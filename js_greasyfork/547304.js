// ==UserScript==
// @name           豆瓣电影元数据提取
// @description    精准提取所有核心字段（含又名、滴答格式）
// @author         bai
// @version        1.9
// @icon           https://movie.douban.com/favicon.ico
// @grant          GM_addStyle
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include        https://movie.douban.com/subject/*
// @run-at         document-end
// @license        Apache-2.0
// @namespace https://greasyfork.org/users/967749
// @downloadURL https://update.greasyfork.org/scripts/547304/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%85%83%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/547304/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%85%83%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

$(function () {
    // 样式优化
    GM_addStyle(`
        .movie-utils {
            margin: 15px 0;
            padding: 12px;
            background: #f8f5f3;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .copy-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #e4d2cc;
            color: #6b5f59;
            cursor: pointer;
            transition: all 0.3s;
            margin-right: 8px;
        }
        .copy-btn:hover:not(:disabled) {
            background: #d1bcb2;
            transform: translateY(-1px);
        }
        .copy-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .status {
            margin-left: 10px;
            font-size: 14px;
            color: #6b5f59;
        }
        .success { color: #4CAF50; }
        .error { color: #f44336; }
    `);

    // 核心：精准提取引擎
    function extractMovieData() {
        return {
            title: extractTitle(),
            director: extractField('导演'),
            cast: extractCast(),
            country: extractField('制片国家/地区'),
            language: extractField('语言'),
            genre: extractGenre(),
            releaseDate: extractReleaseDate(),
            runtime: extractField('片长'),
            rating: extractRating(),
            intro: extractIntroWithBreaks(),
            alias: extractAlias(),
            url: window.location.href
        };
    }

    // 1. 标题提取
    function extractTitle() {
        const mainTitle = $('h1 span[property="v:itemreviewed"]').text().trim();
        return mainTitle || '未知标题';
    }

    // 2. 提取又名字段
    function extractAlias() {
        const $info = $('span.pl:contains("又名:")').closest('#info');
        if (!$info.length) return '无别名';

        const match = $info.text().match(new RegExp(`又名:\\s*(.*?)(?=\\n|$)`));
        return match? match[1].trim().replace(/\s*\/\s*/g, ' / ') : '无别名';
    }

    // 3. 通用字段提取
    function extractField(fieldName) {
        const $info = $(`span.pl:contains("${fieldName}")`).closest('#info');
        if (!$info.length) return `未知${fieldName}`;

        const match = $info.text().match(new RegExp(`${fieldName}\\s*[:：]\\s*(.*?)(?=\\n|$)`));
        return match? match[1].trim().replace(/^["\s]+|["\s]+$/g, '') : `未知${fieldName}`;
    }

    // 4. 主演提取
    function extractCast() {
        const rawCast = $(`span.pl:contains("主演")`).next().text().trim();
        return rawCast.replace(/\s*更多\.{2,}$/i, '').trim() || '未知主演';
    }

    // 5. 类型提取
    function extractGenre() {
        const genres = $('#info span[property="v:genre"]').map(function () {
            return $(this).text().trim();
        }).get();
        return genres.join(' / ') || '未知类型';
    }

    // 6. 评分提取
    function extractRating() {
        return $('.rating_num').text().trim() || '暂无评分';
    }

    // 7. 剧情简介提取
    function extractIntroWithBreaks() {
        const $fullIntro = $('.all.hidden');
        if ($fullIntro.length) {
            return $fullIntro.contents().map(function () {
                if (this.nodeType === 3) { 
                    return this.textContent.trim();
                }
                if (this.tagName === 'BR') { 
                    return '\n';
                }
                return ''; 
            }).get().join('').replace(/\n+/g, '\n').trim();
        }

        const $shortIntro = $('span[property="v:summary"]');
        if ($shortIntro.length) {
            return $shortIntro.text().trim().replace(/\s+/g, ' ') || '无剧情简介';
        }

        return '无剧情简介';
    }

    // 8. 上映日期提取
    function extractReleaseDate() {
        const $target = $(`span.pl:contains("上映日期")`).nextAll('span[property="v:initialReleaseDate"]');
        const dates = $target.map(function () {
            return $(this).text().trim().replace(/^["\s]+|["\s]+$/g, '');
        }).get();
        return dates.join(' / ') || '未知上映日期';
    }

    // 重置按钮状态的通用函数
    function resetButtonState($btn, originalText) {
        $btn.text(originalText).prop('disabled', false);
    }

    // 复制到滴答逻辑
    async function copyToDida() {
        const $btn = $(this);
        const $status = $btn.siblings('.status');
        const originalText = $btn.text(); // 保存原始按钮文本
        
        $btn.text('转换中...').prop('disabled', true);
        $status.text('处理中').removeClass('success error');

        try {
            const data = extractMovieData();
            if (!data.title.trim()) throw new Error('标题提取失败');

            // 滴答格式拼接
            const didaText = `[《${data.title}》](${data.url}) 🎬：${data.director} ⭐：${data.rating} 🗺️：${data.country} 🗓️：${data.releaseDate}`;
            await navigator.clipboard.writeText(didaText);
            
            $status.text('复制到滴答成功').addClass('success').removeClass('error');
            $btn.text('已复制→滴答');
        } catch (err) {
            $status.text(`失败：${err.message}`).addClass('error').removeClass('success');
            $btn.text('重试→滴答').prop('disabled', false); // 出错时立即允许重试
            console.error('滴答格式复制失败:', err);
            return; // 不再执行后续的重置计时器
        }

        // 2秒后重置状态，确保可以二次点击
        setTimeout(() => {
            resetButtonState($btn, originalText);
            $status.text('').removeClass('success error');
        }, 2000);
    }

    // 原复制逻辑
    async function copyMetadata() {
        const $btn = $(this);
        const $status = $btn.siblings('.status');
        const originalText = $btn.text(); // 保存原始按钮文本
        
        $btn.text('复制中...').prop('disabled', true);
        $status.text('处理中').removeClass('success error');

        try {
            const data = extractMovieData();
            if (!data.intro.trim()) throw new Error('剧情简介提取失败');

            const copyText = formatMetadata(data);
            await navigator.clipboard.writeText(copyText);
            
            $status.text('复制成功').addClass('success').removeClass('error');
            $btn.text('已复制');
        } catch (err) {
            $status.text(`失败：${err.message}`).addClass('error').removeClass('success');
            $btn.text('重试').prop('disabled', false); // 出错时立即允许重试
            console.error('提取失败:', err);
            return; // 不再执行后续的重置计时器
        }

        // 2秒后重置状态，确保可以二次点击
        setTimeout(() => {
            resetButtonState($btn, originalText);
            $status.text('').removeClass('success error');
        }, 2000);
    }

    // 原格式化函数
    function formatMetadata(data) {
        return `电影名：《${data.title}》
别名：${data.alias}
导演：${data.director}
主演：${data.cast}
类型：${data.genre}
制片国家/地区：${data.country}
语言：${data.language}
上映日期：${data.releaseDate}
片长：${data.runtime}
豆瓣评分：${data.rating}
剧情简介：
${data.intro}
页面链接：${data.url}
`;
    }

    // 初始化界面
    const $utils = $('<div class="movie-utils">').append(
        $('<button class="copy-btn" id="copyFull">复制元数据</button>'),
        $('<button class="copy-btn" id="copyDida">复制→滴答</button>'),
        $('<span class="status"> </span>')
    ).prependTo('.aside');

    // 绑定事件
    $('#copyFull').on('click', copyMetadata);
    $('#copyDida').on('click', copyToDida);
});
