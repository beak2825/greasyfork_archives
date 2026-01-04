// ==UserScript==
// @name         Yande.re 大图预览 显示艺术家 打开原图 (Gelbooru/Danbooru适配版)
// @version      1.8
// @description  Yande.re浏览增强：悬停大图预览，显示艺术家名称,点击名称直接跳转主页,右键名称标记艺术家高亮显示不同颜色,支持双击/键盘翻页,自动显示隐藏图片,直接打开原图按钮
// @description  原脚本已数年未更新,在原作者Joker(Streams)的基础上修改;  konachan有限支持,部分功能可能无法使用; 新增Gelbooru/Danbooru悬停预览大图及翻页支持
// @author       uylrcia
// @author       Joker
// @author       Streams
// @match        https://yande.re/*
// @match        https://konachan.com/*
// @match        https://konachan.net/*
// @match        https://gelbooru.com/*
// @match        https://danbooru.donmai.us/*
// @icon         https://yande.re/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/467741
// @downloadURL https://update.greasyfork.org/scripts/545994/Yandere%20%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88%20%E6%98%BE%E7%A4%BA%E8%89%BA%E6%9C%AF%E5%AE%B6%20%E6%89%93%E5%BC%80%E5%8E%9F%E5%9B%BE%20%28GelbooruDanbooru%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545994/Yandere%20%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88%20%E6%98%BE%E7%A4%BA%E8%89%BA%E6%9C%AF%E5%AE%B6%20%E6%89%93%E5%BC%80%E5%8E%9F%E5%9B%BE%20%28GelbooruDanbooru%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

const ENABLE_PREVIEW_DEBUG = false;
//const ENABLE_PREVIEW_DEBUG = true;

// 使用独立的jQuery实例，防止与页面冲突
const $ = jQuery.noConflict(true);

$(function () {
    // 全局唯一标识系统
    var currentUUID = null;
    var requestController = null;
    var hoverTimer = null;
    var currentHoverItem = null;
    const CACHE_DAYS = 365; // ←←← 这里改缓存时间（天数），7=一周，30=一个月
    // 搜索 限制缓存数量 可修改,默认5000条

    // 添加时间显示设置
    var showUploadTime = true; // 默认显示

    var artistStates = {};

    // 用于存储当前页面 script 标签中直接包含的数据
    var pageData = {
        posts: {},
        tagTypes: {}
    };

    function parsePageScriptData() {
        $('script:not([src])').each(function() {
            var content = $(this).html();
            if (!content) return;

            // --- 情况 A: 列表页 Post.register({...}) ---
            var postRegex = /Post\.register\(\s*(\{.*?\})\s*\)/g;
            var match;
            while ((match = postRegex.exec(content)) !== null) {
                try {
                    var postObj = JSON.parse(match[1]);
                    if (postObj && postObj.id) pageData.posts[postObj.id] = postObj;
                } catch (e) {}
            }

            // --- 情况 B: Pool页/图集页 Post.register_resp({...}) ---
            // 匹配 Post.register_resp({ ... });
            var respMatch = content.match(/Post\.register_resp\(\s*(\{.*?\})\s*\);/);
            if (respMatch && respMatch[1]) {
                try {
                    var respData = JSON.parse(respMatch[1]);

                    // 1. 提取标签字典
                    if (respData.tags) {
                        Object.assign(pageData.tagTypes, respData.tags);
                    }

                    // 2. 提取帖子数组
                    if (respData.posts && Array.isArray(respData.posts)) {
                        respData.posts.forEach(function(post) {
                            pageData.posts[post.id] = post;
                        });
                    }
                } catch (e) {
                    console.error("Pool页数据解析失败:", e);
                }
            }

            // --- 提取 Post.register_tags (补充) ---
            var tagsMatch = content.match(/Post\.register_tags\(\s*(\{.*?\})\s*\);/);
            if (tagsMatch && tagsMatch[1]) {
                try {
                    Object.assign(pageData.tagTypes, JSON.parse(tagsMatch[1]));
                } catch (e) {}
            }
        });

        if (ENABLE_PREVIEW_DEBUG) {
            console.log(`[Page Data] 解析完成: ${Object.keys(pageData.posts).length} 帖子`);
        }
    }

    // 立即运行解析
    parsePageScriptData();

    // 从Tampermonkey存储加载数据
    try {
        const savedStates = GM_getValue("artistStates", "{}");
        artistStates = JSON.parse(savedStates);

        // 加载时间显示设置，默认true
        showUploadTime = GM_getValue("showUploadTime", true);
    } catch (e) {
        console.error("Error loading artist states:", e);
    }

    // 右键菜单容器
    const $contextMenu = $('<div id="artist-context-menu">').css({
        position: 'fixed',
        display: 'none',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '6px',
        zIndex: 10000,
        padding: '5px 5px'
    }).appendTo('body');

    // 状态配置 - 使用字母a、b、c作为ID
    const stateConfig = [
        {id: 'a', text: '已收藏', color: '#ffff00'},
        {id: 'b', text: '已下载', color: '#00ff11'},
        {id: 'c', text: 'ignore', color: '#999'},
        {id: 'clear', text: '清除', color: '#fff'}
    ];

    // 创建菜单项
    stateConfig.forEach(option => {
        $('<div class="menu-item">')
            .text(option.text)
            .css({
            padding: '5px 15px',
            cursor: 'pointer',
            color: option.color,
            fontSize: '12px'
        })
            .data('action', option.id)
            .hover(
            function() { $(this).css('background', '#444'); },
            function() { $(this).css('background', 'transparent'); }
        )
            .appendTo($contextMenu);
    });

    // 预览框容器
    var $zoombox = $('<div id="zoombox">').css({
        position: 'fixed',
        top: 0,
        left: 0,
        'z-index': 9999,
        'pointer-events': 'none',
        display: 'none',
        'overflow': 'hidden',
        'transition': 'width 0.3s, height 0.3s'
    }).appendTo('body');

    // 添加全局样式
    function addGlobalStyle(css) {
        $('<style></style>').html(css).appendTo('head');
    }

    // 动态生成状态样式
    let stateStyles = '';
    stateConfig.forEach(state => {
        if (state.id !== 'clear') {
            // 为每个状态生成链接样式
            stateStyles += `
                .artist-label a.status-${state.id} {
                    color: ${state.color} !important;
                }
            `;

            // 特殊状态样式
            if (state.id === 'c') {
                stateStyles += `
                    .artist-label a.status-c {
                        text-decoration: line-through;
                    }
                `;
            }
        }
    });

    addGlobalStyle(`
        /* 主预览框样式 */
        #zoombox {
            max-width: 100%;
            max-height: 100%;
            border-radius: 4px;
        }

        /* 预览图内部样式 */
        #zoombox img {
            display: block;
            pointer-events: none;
            object-fit: contain;
            transition: opacity 0.3s;
            border-radius: 4px;
        }

        /* 图片容器 */
        .inner {
            position: relative;
        }

        /* 控制容器 - 右上角 */
        .control-box {
            position: absolute;
            top: 0px;
            right: 0px;
            z-index: 1000;
            pointer-events: none;
            text-align: right;
            max-width: 80%;  /* 限制最大宽度 */
            font-size: 11px; /* 统一字体大小 */
            line-height: 1.2;
            display: flex;         /* 使用flex布局 */
            flex-direction: column; /* 垂直排列元素 */
            align-items: flex-end;  /* 内容右对齐 */
        }

        /* 艺术家标签 - 多行显示 */
        .artist-label {
            background: rgba(0,0,0,0.3);
            color: white; /* 默认文字颜色 */
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: bold;
            white-space: normal;   /* 允许多行显示 */
            word-break: break-word; /* 长单词换行 */
            pointer-events: auto;
            margin-bottom: 2px;   /* 与下方按钮间距 */
            max-width: 100%;      /* 宽度限制 */
            text-align: left;     /* 内部文本左对齐 */
            cursor: context-menu; /* 显示右键菜单光标 */
        }

        /* unknown状态特殊样式 */
        .artist-label.unknown {
            color: #aaa !important; /* 更灰暗的颜色 */
            font-style: italic; /* 添加斜体效果 */
        }

        /* 艺术家状态样式 */
        ${stateStyles}

        /* 艺术家链接样式 */
        .artist-label a {
            color: inherit; /* 继承父元素颜色 */
            text-decoration: none;
        }
        .artist-label a:hover {
            text-decoration: underline;
        }

        /* 右键菜单样式 */
        #artist-context-menu {
            font-family: Arial, sans-serif;
        }
        .menu-item {
            transition: background 0.5s;
        }
        /* === 默认显示分辨率 === */
        #post-list-posts li a.directlink span.directlink-info {
            display: none !important;
        }
        #post-list-posts li a.directlink span.directlink-res {
            display: inline !important;
        }

        #post-list-posts li a.directlink.original-link:hover span.directlink-res {
            color: #ff5555 !important; /* 悬停时变为红色 */
        }

        /* 上传时间样式 */
        .time-label {
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: rgba(255, 255, 255, 1);
            font-size: 9px;
            font-style: italic; /* 斜体 */
            text-decoration: none; /* 无下划线 */
            pointer-events: none; /* 不阻挡鼠标点击 */
            z-index: 1001;
            text-shadow: 0 0 5px #000; /* 加一点阴影防止在浅色图上看不清 */
        }
    `);


    // === 翻页功能 (多站点适配) ===
    function addKey() {
        const currentDomain = window.location.hostname;

        // 获取翻页按钮的通用函数
        function getPageBtn(type) {
            // type: 'next' or 'prev'
            let selector = "";
            const currentDomain = window.location.hostname;

            if (currentDomain.includes('gelbooru')) {
                // 1. 优先尝试标准的 alt 属性（适用于大部分普通列表页）
                let $altBtn = (type === 'next') ? $('a[alt="next"]') : $('a[alt="back"]');
                if ($altBtn.length > 0) return $altBtn;

                // 2. 针对您提供的 paginator 结构：通过 <b> 标签定位当前页的相邻 a 标签
                // 结构示例：<a href="pid=0">1</a> <b>2</b> <a href="pid=84">3</a>
                let $currentBold = $('#paginator b, .pagination b');
                if ($currentBold.length > 0) {
                    if (type === 'next') {
                        // 紧跟在 <b> 后面的第一个 <a> 就是下一页
                        let $next = $currentBold.nextAll('a').first();
                        if ($next.length > 0) return $next;
                    } else {
                        // 紧跟在 <b> 前面的第一个 <a> 就是上一页
                        let $prev = $currentBold.prevAll('a').first();
                        if ($prev.length > 0) return $prev;
                    }
                }

                // 3. 兜底方案：直接搜索包含箭头符号的链接
                selector = (type === 'next') ?
                    '.pagination a:contains(">"), .pagination a:contains("»")' :
                '.pagination a:contains("<"), .pagination a:contains("«")';
            } else if (currentDomain.includes('donmai.us')) {
                // Danbooru
                // 通常有 id="paginator-prev" / "paginator-next"
                if (type === 'next') {
                    selector = '#paginator-next, a[rel="next"]';
                } else {
                    selector = '#paginator-prev, a[rel="prev"]';
                }
            } else {
                // Yande.re / Konachan
                if (type === 'next') selector = 'a.next_page';
                else selector = 'a.previous_page';
            }

            return $(selector).first();
        }

        function triggerPage(type) {
            var $btn = getPageBtn(type);
            if ($btn.length > 0) {
                if ($btn[0].href) {
                    window.location.href = $btn[0].href;
                } else {
                    $btn[0].click();
                }
            } else {
                if(ENABLE_PREVIEW_DEBUG) console.log(`[Turn Page] No ${type} button found.`);
            }
        }

        $(document).dblclick(function (e) {
            var w = document.documentElement.offsetWidth || document.body.offsetWidth;
            // 避免在输入框双击触发
            if ($(e.target).is('input, textarea')) return;
            if (e.clientX > w / 2) triggerPage('next');
            else triggerPage('prev');
        });

        $(document).keydown(function (e) {
            // 避免在输入框打字时触发
            if ($(e.target).is('input, textarea')) return;
            if (e.keyCode == 37) triggerPage('prev'); // Left Arrow
            else if (e.keyCode == 39) triggerPage('next'); // Right Arrow
        });
    }

    // 生成唯一标识符
    function generateUUID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }


    function setupContextMenu() {
        // 右键点击事件
        $(document).on('contextmenu', '.artist-label a', function(e) {
            e.preventDefault();

            const artistName = $(this).text().trim();
            if (!artistName || artistName === 'unknown') return;

            // === 直接使用视口坐标 ===
            const x = e.clientX;
            const y = e.clientY;

            // 显示菜单
            $contextMenu
                .data('artist', artistName)
                .css({
                display: 'block',
                left: x + 'px',
                top: y + 'px'
            });

            // === 添加边界检查 ===
            setTimeout(() => {
                const menuRect = $contextMenu[0].getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                let adjustedX = x;
                let adjustedY = y;

                // 检查右边界
                if (menuRect.right > windowWidth) {
                    adjustedX = windowWidth - menuRect.width - 10;
                }

                // 检查下边界
                if (menuRect.bottom > windowHeight) {
                    adjustedY = windowHeight - menuRect.height - 10;
                }

                // 如果需要调整位置
                if (adjustedX !== x || adjustedY !== y) {
                    $contextMenu.css({
                        left: adjustedX + 'px',
                        top: adjustedY + 'px'
                    });
                }
            }, 0);
        });

        // 菜单项点击事件
        $contextMenu.on('click', '.menu-item', function() {
            const action = $(this).data('action');
            const artistName = $contextMenu.data('artist');

            if (action === 'clear') {
                // 清除标记
                delete artistStates[artistName];
            } else {
                // 设置状态
                artistStates[artistName] = action;
            }

            // 保存到Tampermonkey存储
            GM_setValue("artistStates", JSON.stringify(artistStates));

            // 更新所有该艺术家的标签
            $(`.artist-label a:contains('${artistName}')`).each(function() {
                const $link = $(this);

                // 清除所有状态类
                stateConfig.forEach(state => {
                    if (state.id !== 'clear') {
                        $link.removeClass(`status-${state.id}`);
                    }
                });

                // 添加新状态类
                if (action !== 'clear' && artistStates[artistName]) {
                    $link.addClass(`status-${artistStates[artistName]}`);
                }
            });

            // 隐藏菜单
            $contextMenu.hide();
        });

        // 点击其他地方关闭菜单
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#artist-context-menu').length) {
                $contextMenu.hide();
            }
        });

    }

    // ==================== 【新增：本地缓存系统】 ====================

    const CACHE_KEY = "postDataCache";       // 缓存总键名


    // 获取缓存（带过期检查）
    function getCachedPost(postId) {
        try {
            const allCache = JSON.parse(GM_getValue(CACHE_KEY, "{}"));
            const item = allCache[postId];
            if (!item) return null;

            const now = Math.floor(Date.now() / 1000);

            // 检查是否过期
            if (now - item.timestamp < CACHE_DAYS * 24 * 60 * 60) {
                // 检查数据是否包含created_at字段（兼容老旧缓存）
                if (item.data && item.data.created_at === undefined) {
                    // 老旧缓存，缺少时间字段，删除它并返回null（触发重新获取）
                    console.log(`[Cache] 老旧缓存缺少时间字段，删除并重新获取: ${postId}`);
                    delete allCache[postId];
                    GM_setValue(CACHE_KEY, JSON.stringify(allCache));
                    return null;
                }
                return item.data;
            } else {
                // 已过期，删除旧数据
                delete allCache[postId];
                GM_setValue(CACHE_KEY, JSON.stringify(allCache));
                return null;
            }
        } catch (e) {
            console.error("Cache read error:", e);
            return null;
        }
    }

    function setCachedPost(postId, postData, artists) {
        try {
            const allCache = JSON.parse(GM_getValue(CACHE_KEY, "{}"));
            allCache[postId] = {
                timestamp: Math.floor(Date.now() / 1000),
                data: {
                    file_url: postData.file_url,
                    artists: artists,
                    created_at: postData.created_at // 【新增】添加时间字段到缓存
                }
            };
            // 限制缓存数量 5000 条，防止无限增长
            const keys = Object.keys(allCache);
            if (keys.length > 5000) {
                const sorted = keys.sort((a, b) => allCache[a].timestamp - allCache[b].timestamp);
                for (let i = 0; i < 1000; i++) {
                    delete allCache[sorted[i]];
                }
            }
            GM_setValue(CACHE_KEY, JSON.stringify(allCache));
        } catch (e) {
            console.error("Cache write error:", e);
        }
    }

    // 预览逻辑
    function addMouseZoomPreview() {
        // 全局状态管理
        const processedIds = new Set(); // 已完成的ID
        const fetchingIds = new Set();  // 正在请求的ID
        const queue = []; // 等待处理的队列
        const log = ENABLE_PREVIEW_DEBUG ? console.log.bind(console) : () => {};

        // === 优先读页面JS -> 读缓存 -> 请求API ===
        function fetchPostData($item, $inner, postId) {

            // ===========================================
            // 策略 1: 检查当前页面 JS 数据
            // ===========================================
            if (pageData.posts[postId]) {
                const post = pageData.posts[postId];

                // 处理标签
                let artists = post.artists;
                if (!artists) {
                    const tagString = post.tags || "";
                    if (typeof tagString === 'string') {
                        const tagList = tagString.split(/\s+/);
                        artists = tagList.filter(tag => pageData.tagTypes[tag] === 'artist');
                    } else {
                        artists = [];
                    }
                    post.artists = artists;
                }

                // 【修复点1】这里传入 $inner，而不是 $controlBox
                renderPostInfo($item.find('.inner'), post);
                processedIds.add(postId);
                return;
            }

            // ===========================================
            // 策略 2: 查缓存
            // ===========================================
            const cached = getCachedPost(postId);
            if (cached) {
                renderPostInfo($inner, {
                    file_url: cached.file_url,
                    artists: cached.artists,
                    created_at: cached.created_at // 确保缓存读取时也尝试读取时间
                });
                processedIds.add(postId);
                return;
            }

            // ===========================================
            // 策略 3: API 请求 (Wiki页/Pool页主要走这里)
            // ===========================================
            if (fetchingIds.has(postId)) return;
            fetchingIds.add(postId);

            // log(`[API Request] postId: ${postId}`); // 调试用

            $.get(`/post.json?api_version=2&include_tags=1&tags=id:${postId}`, function(data) {
                if (data.posts && data.posts.length > 0) {
                    const post = data.posts[0];
                    const tagTypes = data.tags || {};
                    const tags = post.tags.split(' ');
                    const artists = tags.filter(tag => tagTypes[tag] === 'artist');

                    // 构造数据对象
                    const postData = {
                        file_url: post.file_url,
                        artists: artists,
                        created_at: post.created_at // 【修复点3】API返回的数据里包含 created_at
                    };

                    // 写入缓存 (把时间也存进去)
                    setCachedPost(postId, post, artists); // 注意：setCachedPost 函数也需要微调以存储 created_at，或者只依赖 render 时的实时数据

                    // 【修复点4】这里必须传入 $inner
                    renderPostInfo($inner, postData);
                    processedIds.add(postId);
                }
            }).always(function() {
                fetchingIds.delete(postId);
            });
        }

        // 渲染函数：处理艺术家和时间
        function renderPostInfo($container, post) {
            if (!$container || $container.length === 0) return;

            // 找到或创建控制容器
            let $controlBox = $container.find('.control-box');
            if ($controlBox.length === 0) {
                $controlBox = $('<div class="control-box"></div>');
                $container.append($controlBox);
            }

            // --- 1. 添加时间标签（右下角）---
            $container.find('.time-label').remove();

            if (showUploadTime && post.created_at) {
                const date = new Date(post.created_at * 1000);
                const timeStr = date.toLocaleString('zh-CN', {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const $timeLabel = $('<span class="time-label"></span>').text(timeStr);
                $container.append($timeLabel); // 直接添加到容器，不在control-box内
            }

            // --- 2. 修改分辨率标签为原图链接 ---
            const $directLink = $container.closest('li').find('a.directlink.largeimg');

            if ($directLink.length > 0 && post.file_url) {
                const originalUrl = post.file_url;
                $directLink.attr('href', originalUrl);
                $directLink.addClass('original-link');

                const $resSpan = $directLink.find('.directlink-res');
                const originalText = $resSpan.text();

                $directLink.hover(
                    function() {
                        $resSpan.text('原图: ' + originalText);
                        $directLink.attr('title', '单击打开原图,中键在新标签打开 ');
                    },
                    function() {
                        $resSpan.text(originalText);
                        $directLink.removeAttr('title');
                    }
                );
            }

            // --- 3. 更新艺术家标签 ---
            $controlBox.find('.artist-label').remove();

            const artists = post.artists || [];
            const $artistLabel = $('<div class="artist-label"></div>');

            if (artists.length === 0) {
                $artistLabel.addClass('unknown').text('unknown');
            } else {
                artists.forEach((artistName) => {
                    const $artistLine = $('<div class="artist-line"></div>');
                    const $artistLink = $(`<a href="/post?tags=${encodeURIComponent(artistName)}" target="_blank"></a>`).text(artistName);
                    if (artistStates[artistName]) {
                        $artistLink.addClass(`status-${artistStates[artistName]}`);
                    }
                    $artistLine.append($artistLink);
                    $artistLabel.append($artistLine);
                });
            }
            $controlBox.append($artistLabel);
        }

        // === 辅助函数：猜测 Sample URL / 构建 URL 列表 ===
        // 针对 Yande/Konachan 返回单个 string
        // 针对 Gelbooru/Danbooru 返回 array [url1, url2...]
        function guessSampleUrls($item, currentDomain) {
            const isYandere = currentDomain.includes('yande.re');
            const isKonachan = currentDomain.includes('konachan');
            const isGelbooru = currentDomain.includes('gelbooru');
            const isDanbooru = currentDomain.includes('donmai.us');

            // 1. Gelbooru 处理 (保持多级猜测)
            if (isGelbooru) {
                const $img = $item.find('img');
                const thumbSrc = $img.attr('src');
                if (!thumbSrc) return null;

                // Gelbooru Pattern:
                // Thumb: .../thumbnails/xx/yy/thumbnail_{md5}.jpg
                // Target: .../samples/xx/yy/sample_{md5}.jpg (on img2 subdomain mostly)
                // Orig: .../images/xx/yy/{md5}.png (or jpg)
                const match = thumbSrc.match(/\/thumbnails\/([a-f0-9]{2})\/([a-f0-9]{2})\/thumbnail_([a-f0-9]{32})\.(jpg|png|jpeg)/i);
                if (match) {
                    const dir1 = match[1];
                    const dir2 = match[2];
                    const md5 = match[3];
                    return [
                        `https://img2.gelbooru.com/samples/${dir1}/${dir2}/sample_${md5}.jpg`, // 优先尝试 sample
                        `https://img2.gelbooru.com/images/${dir1}/${dir2}/${md5}.png`,       // 其次尝试原图 png
                        `https://img2.gelbooru.com/images/${dir1}/${dir2}/${md5}.jpg`,       // 其次尝试原图 jpg
                        `https://img2.gelbooru.com/images/${dir1}/${dir2}/${md5}.jpeg`       // 极少见
                    ];
                }
                return null;
            }

            // 2. Danbooru 处理 (优先尝试 sample.jpg > 720x720.webp > 原图)
            if (isDanbooru) {
                const $img = $item.find('img');
                const thumbSrc = $img.attr('src');
                if (!thumbSrc) return null;

                // Extract MD5 from typical patterns
                // Pattern 1: https://cdn.donmai.us/180x180/8e/11/8e118c4c...jpg
                const md5Match = thumbSrc.match(/\/([a-f0-9]{32})\./);

                if (md5Match) {
                    const md5 = md5Match[1];
                    const dir1 = md5.substring(0, 2);
                    const dir2 = md5.substring(2, 4);

                    // Danbooru file structure strategy:
                    // 1. Sample JPG (Old samples / Force priority as requested)
                    // 2. 720x720 WebP (High-res thumb, often available)
                    // 3. Original (fallback)
                    return [
                        `https://cdn.donmai.us/sample/${dir1}/${dir2}/sample-${md5}.jpg`,  // Priority 1: Sample JPG
                        `https://cdn.donmai.us/720x720/${dir1}/${dir2}/${md5}.webp`,       // Priority 2: 720 WebP
                        `https://cdn.donmai.us/original/${dir1}/${dir2}/${md5}.png`,       // Fallbacks...
                        `https://cdn.donmai.us/original/${dir1}/${dir2}/${md5}.jpg`,
                        `https://cdn.donmai.us/original/${dir1}/${dir2}/${md5}.webp`
                    ];
                }
                return null;
            }

            // 3. Yande.re / Konachan (原有逻辑，返回单个 String)
            let sampleUrl = null;
            const $thumbLink = $item.find('a.thumb');
            const href = $thumbLink.attr('href');

            if ($thumbLink.length) {
                const thumbSrc = $thumbLink.find('img').attr('src');
                if (thumbSrc) {
                    let md5 = null;
                    const md5Match = thumbSrc.match(/\/data\/preview\/([a-f0-9]{32})\.jpg/) || thumbSrc.match(/\/([a-f0-9]{32})\/yande\.re/);
                    if(!md5) md5 = thumbSrc.split('/').pop().split('.')[0];

                    if (md5 && md5.length === 32) {
                        const postId = $item.data('id') || (href && href.match(/\/post\/show\/(\d+)/) ? href.match(/\/post\/show\/(\d+)/)[1] : null);
                        if (isYandere && postId) {
                            sampleUrl = `https://files.yande.re/sample/${md5}/yande.re%20${postId}%20sample.jpg`;
                        } else if (isKonachan) {
                            sampleUrl = `https://${window.location.hostname}/sample/${md5}.jpg`;
                        }
                    }
                }
            }
            // 备用方案
            if (!sampleUrl) {
                const $directLink = $item.find('a[class*="directlink"]');
                if ($directLink.length) {
                    let url = $directLink.attr('href');
                    if (url && isKonachan) {
                        if (url.includes('/image/')) sampleUrl = url.replace('/image/', '/sample/');
                    }
                }
            }
            return sampleUrl;
        }

        // === 初始化：收集页面元素 ===
        // 更新选择器以包含 Gelbooru (.thumbnail-preview) 和 Danbooru (article.post-preview)
        $("#post-list-posts > li, .pool-show .inner, .thumbnail-preview, article.post-preview").each(function() {
            const $item = $(this);
            // 对于 Gelbooru/Danbooru，结构不同，没有 .inner
            const currentDomain = window.location.hostname;
            const isGelbooru = currentDomain.includes('gelbooru');
            const isDanbooru = currentDomain.includes('donmai.us');

            // 兼容旧站点的 .inner 查找
            const $inner = (!isGelbooru && !isDanbooru) ? $item.find('.inner') : $item;
            if ($inner.length === 0 && !isGelbooru && !isDanbooru) return;

            // 获取 ID (仅用于 Yande/Konachan 的逻辑，Gel/Dan 不跑API逻辑)
            let postId = $item.data('id');
            if (!postId && !isGelbooru && !isDanbooru) {
                const href = $inner.find('a.thumb').attr('href');
                const match = href && href.match(/\/post\/show\/(\d+)/);
                if (match) postId = match[1];
            } else if (isGelbooru) {
                // Gelbooru ID in anchor id "p123456"
                const idAttr = $item.find('a').attr('id');
                if (idAttr) postId = idAttr.replace('p', '');
            } else if (isDanbooru) {
                postId = $item.data('id');
            }

            // 对于 Yande.re/Konachan 执行原有的元数据抓取逻辑
            if (!isGelbooru && !isDanbooru && postId) {
                if (pageData.posts[postId]) {
                    const post = pageData.posts[postId];
                    // 处理艺术家 (从字符串tags转换)
                    let artists = post.artists;
                    if (!artists) {
                        const tagString = post.tags || "";
                        if (typeof tagString === 'string') {
                            const tagList = tagString.split(/\s+/);
                            artists = tagList.filter(tag => pageData.tagTypes[tag] === 'artist');
                        } else {
                            artists = [];
                        }
                        post.artists = artists;
                    }
                    renderPostInfo($inner, {
                        file_url: post.file_url,
                        artists: artists,
                        created_at: post.created_at
                    });
                    processedIds.add(postId);
                } else {
                    queue.push({ $item, $inner, postId });
                }
            } else {
                // Gelbooru/Danbooru 标记为已处理，不进入 API 队列
                if (postId) processedIds.add(postId);
            }

            // === 绑定悬停事件 ===
            // Gelbooru/Danbooru 预览图直接是里面的 img
            const $thumbImg = (isGelbooru || isDanbooru) ? $item.find('img') : $item.find('img.preview');
            const cachedSampleData = guessSampleUrls($item, currentDomain); // 可能是 String 或 Array

            $item.hover(
                function (e) {
                    currentHoverItem = this;
                    if (hoverTimer) clearTimeout(hoverTimer);
                    hoverTimer = setTimeout(() => {
                        if (currentHoverItem !== this) return;
                        if (cachedSampleData) showZoomBox(cachedSampleData, $thumbImg, e);

                        // 仅对旧站点执行 API 获取
                        if (!isGelbooru && !isDanbooru && postId && !processedIds.has(postId)) {
                            fetchPostData($item, $inner, postId);
                        }
                    }, 50);
                },
                function () {
                    if (hoverTimer) clearTimeout(hoverTimer);
                    hoverTimer = null;
                    currentHoverItem = null;
                    if (requestController) {
                        requestController.abort();
                        requestController = null;
                    }
                    $zoombox.hide().empty();
                }
            );
        });

        // 先同步处理所有缓存命中的项 (仅旧站点)
        let i = 0;
        while (i < queue.length) {
            const task = queue[i];
            const cached = getCachedPost(task.postId);
            if (cached) {
                log(`[Cache Hit] postId: ${task.postId}`);
                renderPostInfo(task.$inner, {
                    file_url: cached.file_url,
                    artists: cached.artists,
                    created_at: cached.created_at
                });
                processedIds.add(task.postId);
                queue.splice(i, 1);
            } else {
                i++;
            }
        }

        // === 后台处理循环 ===
        function processQueueLoop() {
            if (queue.length > 0) {
                while (queue.length > 0) {
                    const task = queue.shift();
                    if (!processedIds.has(task.postId) && !fetchingIds.has(task.postId)) {
                        fetchPostData(task.$item, task.$inner, task.postId);
                        break;
                    }
                }
            }
            setTimeout(processQueueLoop, 550);
        }
        processQueueLoop();

        // === 独立的显示大图函数 (支持 URL 列表递归尝试 + 成功URL缓存) ===
        // initialUrlOrList: 可以是单个 URL 字符串，也可以是 URL 字符串数组
        function showZoomBox(initialUrlOrList, $thumbImg, e) {
            if (requestController) requestController.abort();
            const thisUUID = generateUUID();
            currentUUID = thisUUID;
            requestController = new AbortController();

            const log = ENABLE_PREVIEW_DEBUG ? console.log.bind(console) : () => {};
            const warn = ENABLE_PREVIEW_DEBUG ? console.warn.bind(console) : () => {};

            // 1. 检查是否存在已成功的缓存链接 (Gelbooru 优化)
            // 如果该元素之前已经成功加载过某张大图，直接使用该链接，不再重复猜测流程
            const cachedSuccessUrl = $thumbImg.data('zoom-success-url');
            if (cachedSuccessUrl) {
                // log(`[Fast Load] 使用缓存的成功链接: ${cachedSuccessUrl}`);
                initialUrlOrList = [cachedSuccessUrl];
            }

            // 处理输入，统一转为数组状态
            let urlList = [];
            let urlIndex = 0;
            if (Array.isArray(initialUrlOrList)) {
                urlList = initialUrlOrList;
            } else {
                urlList = [initialUrlOrList];
            }
            if (urlList.length === 0) return;

            const currentUrl = urlList[0]; // 从第一个开始尝试

            // 尺寸计算逻辑
            const thumbWidth = $thumbImg.width();
            const thumbHeight = $thumbImg.height();
            const aspectRatio = thumbWidth / thumbHeight;
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
            const isVertical = aspectRatio <= 1;

            let initWidth, initHeight;
            if (isVertical) {
                initHeight = screenHeight;
                initWidth = initHeight * aspectRatio;
            } else {
                initWidth = Math.min(screenWidth * 0.6, screenHeight * aspectRatio);
                initHeight = initWidth / aspectRatio;
            }

            const mouseX = e.clientX;
            const isMouseOnLeft = mouseX < screenWidth / 2;
            let posCSS;
            if (isMouseOnLeft) {
                posCSS = { right: '0px', left: 'auto' };
            } else {
                posCSS = { left: '0px', right: 'auto' };
            }

            $zoombox.css({
                top: '0px',
                width: initWidth + 'px',
                height: initHeight + 'px',
                ...posCSS
            });

            const $imgContainer = $('<div>').css({
                position: 'relative', overflow: 'hidden', width: '100%', height: '100%'
            });
            const $img = $('<img>').css({
                opacity: 1, width: '100%', height: '100%'
            });

            $imgContainer.append($img);
            $zoombox.empty().append($imgContainer).show();

            requestController.signal.addEventListener('abort', () => {
                if (currentUUID !== thisUUID) return;
                $zoombox.hide().empty();
            });

            // === 核心：加载与递归重试逻辑 ===
            function tryLoadImage(url) {
                $img.attr('src', url);
            }

            // 成功回调
            $img.on('load', function() {
                if (currentUUID !== thisUUID) return;
                log(`预览成功 链接: ${this.src}`);

                // 【关键修改】加载成功后，将当前成功的 URL 缓存到 DOM 元素上
                // 这样下次悬停时会直接读取 'zoom-success-url'，跳过 guess 列表的尝试
                if (!cachedSuccessUrl) {
                    $thumbImg.data('zoom-success-url', this.src);
                }

                // 自适应尺寸逻辑
                const natW = this.naturalWidth;
                const natH = this.naturalHeight;
                const realRatio = natW / natH;
                const isRealVertical = realRatio <= 1;
                let fW, fH;
                if (isRealVertical) {
                    const fH = screenHeight;
                    const fW = fH * realRatio;
                    $zoombox.css({ width: fW + 'px', height: fH + 'px', ...posCSS });
                } else {
                    const fW = Math.min(screenWidth * 0.6, screenHeight * realRatio);
                    const fH = fW / realRatio;
                    $zoombox.css({ width: fW + 'px', height: fH + 'px', ...posCSS });
                }
            });

            // 失败回调
            $img.on('error', function() {
                if (currentUUID !== thisUUID) return;
                warn(`加载失败: ${urlList[urlIndex]}`);

                urlIndex++;
                if (urlIndex < urlList.length) {
                    log(`尝试下一个链接: ${urlList[urlIndex]}`);
                    tryLoadImage(urlList[urlIndex]);
                } else {
                    // 列表尝试完毕，尝试最后的 fallback (仅针对旧站点)
                    let fallbackUrl = null;
                    if (currentHoverItem) {
                        fallbackUrl = $(currentHoverItem).find('.original-btn').attr('href') ||
                            $(currentHoverItem).find('a.directlink').attr('href');
                    }

                    if (fallbackUrl) {
                        log(`使用DOM fallback: ${fallbackUrl}`);
                        $(this).off('error'); // 防止死循环
                        $(this).attr('src', fallbackUrl);
                    } else {
                        log(`所有链接尝试失败`);
                        $zoombox.hide().empty();
                    }
                }
            });

            // 启动第一次加载
            tryLoadImage(currentUrl);
        }
    }

    // 显示隐藏图片
    function showHiddenImage() {
        $("#post-list-posts > li.javascript-hide").removeClass("javascript-hide");
    }

    // 独立函数：禁止图片气泡消息（移除title属性）
    function disableImageTooltips() {
        $("#post-list-posts img.preview[title], .thumbnail-preview img[title], article.post-preview img[title]").removeAttr("title");
    }

    // 初始化操作
    $(document).ready(function() {
        setTimeout(function() {
            showHiddenImage();
            addKey();
            addMouseZoomPreview();
            setupContextMenu();
            disableImageTooltips();
        }, 500);

        GM_registerMenuCommand("清除API缓存 (不影响艺术家状态)", function() {
            if (confirm("确定要清除所有API缓存吗？")) {
                GM_setValue(CACHE_KEY, "{}");
                alert("API缓存已清除");
            }
        });

        GM_registerMenuCommand("切换上传时间显示", function() {
            showUploadTime = !showUploadTime;
            GM_setValue("showUploadTime", showUploadTime);
            if (showUploadTime) alert("显示开启，请刷新");
            else { $('.time-label').remove(); alert("显示关闭"); }
        });
    });
});