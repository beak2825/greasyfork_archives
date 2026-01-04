// ==UserScript==
// @name         ★Bangumi动画详情＆播放源整合★
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  支持在多个动画网站一键跳转Bangumi查看详情，并在Bangumi番剧详情页中新增“播放源”按钮，可快速跳转至B站、次元城、稀饭动漫等站点搜索播放源
// @author       Aomine
// @match        *.bgm.tv/subject/*
// @match        *://www.agedm.io/play*
// @match        *://www.cycani.org/watch*
// @match        *://www.mutean.com/vodplay*
// @match        *://www.aafun.cc/f*
// @match        *://www.ntdm8.com/play*
// @match        *://www.mwcy.net/play*
// @match        *://dm.xifanacg.com/watch*
// @match        *://anich.emmmm.eu.org/b*
// @match        *://www.bilibili.com/bangumi/play*
// @match        *://www.gugu3.com/index.php/vod/play/id/*/sid/*/nid*
// @include      https://www.fsdm02.com/vodplay*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      bgm.tv
// @license      GPL License
// @icon         https://bgm.tv/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/531203/%E2%98%85Bangumi%E5%8A%A8%E7%94%BB%E8%AF%A6%E6%83%85%EF%BC%86%E6%92%AD%E6%94%BE%E6%BA%90%E6%95%B4%E5%90%88%E2%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/531203/%E2%98%85Bangumi%E5%8A%A8%E7%94%BB%E8%AF%A6%E6%83%85%EF%BC%86%E6%92%AD%E6%94%BE%E6%BA%90%E6%95%B4%E5%90%88%E2%98%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化设置
    const config = {
        showButton: GM_getValue('showButton', true),  // 默认显示按钮
        excludedSites: GM_getValue('excludedSites', [])  // 默认不排除任何站点
    };

    // 注册菜单命令
    GM_registerMenuCommand("⚙️ 脚本设置", openSettings);
    GM_registerMenuCommand(config.showButton ? "🔘 按钮开关" :"❌ 隐藏按钮" , toggleButton);

    // 各网站标题选择器配置
    const siteSelectors = {
        'www.agedm.io': '.card-body .card-title',
        'www.cycani.org':'a.player-title-link',
        'www.mutean.com': '.module-info-heading h1 a',
        'anich.emmmm.eu.org': 'section[player-info] a[href^="/b/"]',
        'www.ntdm8.com': 'h4#detailname a:first-child',
        'www.mwcy.net': 'a.player-title-link',
        'dm.xifanacg.com': 'a.player-title-link',
        'www.gugu3.com': 'a.player-title-link',
        'www.fsdm02.com': '.module-info-heading h1 a',
        'www.aafun.cc': [
            'h2.play-title .hl-infos-title',
            '.hl-dc-title .hl-data-menu'
        ],
        'www.bilibili.com': [
            '.mediainfo_mediaTitle__Zyiqh',
            '[class*="mediaTitle"]',
            '.video-info .video-title',
            '.media-title',
            'h1.title'
        ].join(', ')
    };

    // 切换按钮显示状态
    function toggleButton() {
        config.showButton = !config.showButton;
        GM_setValue('showButton', config.showButton);

        const button = document.querySelector('#bangumiJumpButton');
        if (button) {
            if (config.showButton) {
                button.style.display = 'block';
                setTimeout(() => { button.style.opacity = '1'; }, 10);
            } else {
                button.style.opacity = '0';
                setTimeout(() => { button.style.display = 'none'; }, 300);
            }
        } else if (config.showButton && shouldShowButton()) {
            createJumpButton();
        }
    }

    // 打开设置界面
    function openSettings() {
        const settings = `
            <div style="padding:10px;font-family:Arial,sans-serif;max-width:500px">
                <h3>Bangumi跳转脚本设置</h3>
                <label style="display:block;margin:10px 0">
                    <input type="checkbox" ${config.showButton ? 'checked' : ''}
                           id="showButtonCheckbox">
                    显示右下角"查看详情"按钮
                </label>
                <h4>排除网站：</h4>
                ${Object.keys(siteSelectors).map(domain => `
                    <label style="display:block;margin:5px 0">
                        <input type="checkbox" ${config.excludedSites.includes(domain) ? 'checked' : ''}
                               class="excludeCheckbox" data-domain="${domain}">
                        ${domain}
                    </label>
                `).join('')}
            </div>
            <script>
                document.getElementById('showButtonCheckbox').addEventListener('change', function() {
                    window.opener.postMessage({
                        type: 'updateShowButton',
                        value: this.checked
                    }, '*');
                });

                document.querySelectorAll('.excludeCheckbox').forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        window.opener.postMessage({
                            type: 'updateExcludedSite',
                            domain: this.dataset.domain,
                            value: this.checked
                        }, '*');
                    });
                });
            </script>
        `;

        const win = window.open('', '_blank', 'width=500,height=400');
        win.document.write(settings);

        // 监听设置窗口的消息
        window.addEventListener('message', function(event) {
            if (event.data.type === 'updateShowButton') {
                config.showButton = event.data.value;
                GM_setValue('showButton', config.showButton);
                toggleButton(); // 直接调用切换函数更新按钮状态
            } else if (event.data.type === 'updateExcludedSite') {
                const excluded = GM_getValue('excludedSites', []);
                if (event.data.value && !excluded.includes(event.data.domain)) {
                    excluded.push(event.data.domain);
                } else {
                    const index = excluded.indexOf(event.data.domain);
                    if (index > -1) excluded.splice(index, 1);
                }
                GM_setValue('excludedSites', excluded);
                config.excludedSites = excluded;

                // 检查当前站点是否被排除
                const button = document.querySelector('#bangumiJumpButton');
                if (button) {
                    if (shouldShowButton()) {
                        button.style.display = 'block';
                        setTimeout(() => { button.style.opacity = '1'; }, 10);
                    } else {
                        button.style.opacity = '0';
                        setTimeout(() => { button.style.display = 'none'; }, 300);
                    }
                }
            }
        });
    }

    // 判断是否显示按钮
    function shouldShowButton() {
        // 如果全局关闭按钮或当前站点被排除
        if (!config.showButton || config.excludedSites.includes(window.location.hostname)) {
            return false;
        }

        const path = window.location.pathname;
        return (
            (window.location.hostname === 'www.mutean.com' && path.includes('/vodplay')) ||
            (window.location.hostname === 'www.fsdm02.com' && path.includes('/vodplay')) ||
            (window.location.hostname === 'www.aafun.cc' && path.includes('/f')) ||
            (window.location.hostname === 'www.cycani.org' && path.includes('/watch')) ||
            (window.location.hostname === 'www.agedm.io' && path.includes('/play')) ||
            (window.location.hostname === 'www.ntdm8.com' && path.includes('/play')) ||
            (window.location.hostname === 'www.mwcy.net' && path.includes('/play')) ||
            (window.location.hostname === 'dm.xifanacg.com' && path.includes('/watch')) ||
            (window.location.hostname === 'www.bilibili.com' && path.includes('/play')) ||
            (window.location.hostname === 'anich.emmmm.eu.org' && path.includes('/b')) ||
            (window.location.hostname === 'www.gugu3.com' && path.includes('/bindex.php/vod/play/id')) ||
            !!getAnimeTitle()
        );
    }

    // 获取动画标题
    function getAnimeTitle() {
        const domain = window.location.hostname;
        const selector = siteSelectors[domain];

        if (!selector) {
            console.warn(`当前网站 ${domain} 未配置标题选择器`);
            return null;
        }

        const titleElement = document.querySelector(selector);
        if (titleElement) {
            let title = titleElement.textContent.trim();
            title = title.replace(/^【.+?】/, '')
                .replace(/^《|》$/g, '')
                .replace(/^"|"$/g, '')
                .trim();
            return title;
        }
        return null;
    }

    // 使用Bangumi API获取动画ID
    function getBangumiId(title) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bgm.tv/search/subject/${encodeURIComponent(title)}?type=2&responseGroup=small`,
                headers: {
                    "User-Agent": "Mozilla/5.0 (BangumiScript)"
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.list && data.list.length > 0) {
                            resolve(data.list[0].id);
                        } else {
                            reject('未找到匹配的动画');
                        }
                    } catch (e) {
                        reject('解析API响应失败');
                    }
                },
                onerror: function(error) {
                    reject('API请求失败');
                }
            });
        });
    }

    // 跳转到Bangumi详情页
    async function jumpToBangumi() {
        const animeTitle = getAnimeTitle();
        if (!animeTitle) {
            alert('无法获取动画标题');
            return;
        }

        try {
            const subjectId = await getBangumiId(animeTitle);
            window.open(`https://bgm.tv/subject/${subjectId}`, '_blank');
            console.log(`跳转到Bangumi详情页: ${animeTitle}`);
        } catch (error) {
            console.warn(`直接跳转失败: ${error}, 改用搜索页`);
            const encodedTitle = encodeURIComponent(animeTitle);
            window.open(`https://bgm.tv/subject_search/${encodedTitle}?cat=2`, '_blank');
        }
    }

    // 跳转到Bangumi搜索页（右击功能）
    function jumpToBangumiSearch() {
        const animeTitle = getAnimeTitle();
        if (!animeTitle) {
            alert('无法获取动画标题');
            return;
        }
        const encodedTitle = encodeURIComponent(animeTitle);
        window.open(`https://bgm.tv/subject_search/${encodedTitle}?cat=2`, '_blank');
        console.log(`跳转到Bangumi搜索页: ${animeTitle}`);
    }

    // 创建右下角按钮
    function createJumpButton() {
        if (!shouldShowButton()) return;

        const button = document.createElement('button');
        button.id = 'bangumiJumpButton';
        button.textContent = '查看详情';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#1E88E5';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = '500';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        button.style.transition = 'all 0.3s ease';
        button.style.opacity = config.showButton ? '1' : '0';
        button.style.display = config.showButton ? 'block' : 'none';

        // 添加title属性用于悬停提示
        button.title = '搜索错误时右击';

        // 悬停效果
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#1565C0';
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#1E88E5';
            button.style.transform = 'translateY(0)';
        });

        // 左键点击事件
        button.addEventListener('click', jumpToBangumi);

        // 右键点击事件
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            jumpToBangumiSearch();
        });

        document.body.appendChild(button);
    }

    // 键盘事件处理
    function handleKeyPress(e) {
        const isShiftF8 = (e.key === 'F8' && e.shiftKey) ||
              (e.keyCode === 119 && e.shiftKey);
        if (isShiftF8) {
            e.preventDefault();
            e.stopPropagation();
            jumpToBangumi();
            return false;
        }
    }

    // 添加键盘监听
    function addKeyListener() {
        document.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keydown', handleKeyPress);
    }

    // 主函数
    function main() {
        addKeyListener();
        if (shouldShowButton()) {
            createJumpButton();
        }
        console.log('Bangumi跳转脚本已加载',
                    config.showButton ? '按钮已启用' : '按钮已禁用');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();

// ========== Bangumi 播放源扩展模块 ==========
(function() {
    'use strict';
    if (!/bgm\.tv\/subject\/\d+/.test(location.href)) return;

    // --- 搜索引擎列表 ---
    const searchEngines = [
        { name: "次元城动画", url: "https://www.cycani.org/search.html?wd=${name}" },
        { name: "稀饭动漫", url: "https://dm.xifanacg.com/search.html?wd=${name}" },
        { name: "番薯动漫", url: "https://www.fsdm02.com/vodsearch/-------------.html?wd=${name}" },
        { name: "MuteFun", url: "https://www.mutean.com/vodsearch/${name}-------------.html" },
        { name: "咕咕番", url: "https://www.gugu3.com/index.php/vod/search.html?wd=${name}" },
        { name: "NT动漫", url: "http://www.ntdm8.com/search/-------------.html?wd=${name}&page=1" },
        { name: "风铃动漫", url: "https://www.aafun.cc/feng-s.html?wd=${name}" },
        { name: "喵物次元", url: "https://www.mwcy.net/search.html?wd=${name}" },
        { name: "Bilibili", url: "https://search.bilibili.com/bangumi?keyword=${name}&from_source=webtop_search&spm_id_from=666.4&search_source=5" }
    ];

    // --- 从 infobox 获取动画中文名 ---
    function getAnimeName() {
        const li = document.querySelector('#infobox li');
        if (!li) return null;
        const text = li.textContent.replace(/^中文名[:：]\s*/, '').trim();
        return text || null;
    }

    // --- 创建按钮与菜单 ---
    function createPlaySourceButton() {
        const shareDiv = document.querySelector('.shareBtn');
        if (!shareDiv) return;

        const container = document.createElement('span');
        container.className = 'action play-source-action';
        container.style.position = 'relative';

        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.className = 'icon play_source_btn bve-processed';
        button.title = '查看播放源';
        button.innerHTML = `
              <span class="ico_play" style="margin-right:4px;">&#9654;</span>
              <span class="title">播放源</span>
        `;

        // 下拉菜单
        const menu = document.createElement('div');
        menu.className = 'play-source-menu';
        Object.assign(menu.style, {
            display: 'none',
            position: 'absolute',
            top: '30px',
            left: '0',
            background: '#fafafa',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
            zIndex: '9999',
            maxHeight: '220px',
            overflowY: 'auto',
            width: '160px',
            fontSize: '13px',
            padding: '4px 0',
            color: '#333'
        });

        searchEngines.forEach(engine => {
            const item = document.createElement('div');
            item.textContent = engine.name;
            Object.assign(item.style, {
                padding: '8px 12px',
                cursor: 'pointer',
                userSelect: 'none'
            });
            item.addEventListener('mouseover', () => {
                item.style.background = '#e6f0ff';
                item.style.color = '#1E63D0';
            });
            item.addEventListener('mouseout', () => {
                item.style.background = '';
                item.style.color = '#333';
            });
            item.addEventListener('click', () => {
                const animeName = getAnimeName();
                if (!animeName) {
                    alert('无法获取动画名称');
                    return;
                }
                const url = engine.url.replace('${name}', encodeURIComponent(animeName));
                window.open(url, '_blank');
                menu.style.display = 'none';
            });
            menu.appendChild(item);
        });

        // 点击按钮展开或关闭菜单
        button.addEventListener('click', e => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        // 点击外部隐藏菜单
        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });

        container.appendChild(button);
        container.appendChild(menu);
        shareDiv.appendChild(container);
    }

    // --- 初始化 ---
    function init() {
        const shareDiv = document.querySelector('.shareBtn');
        if (shareDiv) createPlaySourceButton();
        else {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.shareBtn')) {
                    createPlaySourceButton();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.addEventListener('load', init);
})();