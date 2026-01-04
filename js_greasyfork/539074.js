// ==UserScript==
// @name         yucata自定义本地化替换及中文图片
// @namespace    https://yucata.de
// @version      3.0.2
// @description  创世发明终极版中文图片调整
// @author       klingeling
// @match        *.yucata.de/*
// @icon         https://www.yucata.de/Games/InnovationUltimate/cover120.png
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539291/yucata%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%AC%E5%9C%B0%E5%8C%96%E6%9B%BF%E6%8D%A2%E5%8F%8A%E4%B8%AD%E6%96%87%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/539291/yucata%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9C%AC%E5%9C%B0%E5%8C%96%E6%9B%BF%E6%8D%A2%E5%8F%8A%E4%B8%AD%E6%96%87%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 基础URL和文件路径配置
    const BASE_URL = 'https://code.915159.xyz/yucata/';
    const FILE_PATHS = {
        'gamefw1': 'gamefw1.json',
        'gamefw2_v1': 'gamefw2_v1.json',
        'gamefw2_v2': 'gamefw2_v2.json',
        'portal': 'portal.json',
        'InnovationUltimate': 'InnovationUltimate.json',
        'RedCathedral': 'RedCathedral.json',
        'Messina1347': 'Messina1347.json',
        'GrandAustria': 'GrandAustria.json',
        'UnderwaterCities': 'UnderwaterCities.json'
    };

    // 生成完整的URL映射表
    const urlMappings = Object.fromEntries(
        Object.entries(FILE_PATHS).map(([key, file]) => [
            `locales/en/${key}.json`,
            `${BASE_URL}${file}`
        ])
    );

    // 保存原始的 fetch 方法
    const originalFetch = window.unsafeWindow.fetch;

    // 重写 fetch 方法
    window.unsafeWindow.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;

        if (url) {
            // 查找匹配的路径模式
            const match = Object.keys(urlMappings).find(pattern => url.includes(pattern));

            if (match) {
                console.log(`[Tampermonkey] 拦截请求，替换为自定义JSON: ${urlMappings[match]}`);
                input = input.url ? new Request(urlMappings[match], input) : urlMappings[match];
                return originalFetch.call(this, input, init);
            }
        }

        // 不匹配的请求正常执行
        return originalFetch.apply(this, arguments);
    };


    function updateDeckTooltips() {
        const deckTooltips = {
            'Base': '基础牌堆',
            'Unseen': '藏匿牌堆',
            'Cities': '城市牌堆',
            'Figures': '伟人牌堆',
            'Echoes': '回声牌堆',
            'Artifacts': '文物牌堆',
            'backBase': '基础',
            'backUnseen': '藏匿',
            'backCities': '城市',
            'backFigures': '伟人',
            'backEchoes': '回声',
            'backArtifacts': '文物',
            'undo': '撤销',
            'redo': '恢复',
            'alert.png': '警告',
            'meld.png': '融合',
            'bonus.png': '计分'
        };
        document.querySelectorAll('span.clickMeElement.info.stayActive, span.miniCard.back').forEach(span => {
            for (const [className, tooltip] of Object.entries(deckTooltips)) {
                if (span.classList.contains(className)) {
                    span.title = tooltip;
                    break; // Exit loop after finding first matching class
                }
            }
        });
        document.querySelectorAll('img.undo, img.redo').forEach(img => {
            for (const [className, tooltip] of Object.entries(deckTooltips)) {
                if (img.classList.contains(className)) {
                    img.title = tooltip;
                    break; // Exit loop after finding first matching class
                }
            }
        });
        document.querySelectorAll('img.choiceReason').forEach(img => {
            const imgsrc = img.src.split('/').pop();
            for (const [imgsrc, tooltip] of Object.entries(deckTooltips)) {
                if (img.src.includes(imgsrc)) {
                    img.title = tooltip;
                    break; // Exit loop after finding first matching class
                }
            }
        });
    };

    const weburl = window.unsafeWindow.location.href;
    window.unsafeWindow.addEventListener('load', function () {
        var imgs = document.getElementsByTagName('img')
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i]
            img.src = img.src.replace(/www.gravatar.com/, "gravatar.loli.net")
        }
    });

    if (weburl.indexOf('en/Profile#basics') != -1) {
        GM_addStyle(`.yform label {display: inline-grid; float: none;}`);
    }
    if (weburl.indexOf('Game/RedCathedral') != -1) {
        GM_addStyle(`#mainPage .market-header-text {white-space: nowrap !important;}`);
        GM_addStyle(`#mainPage .row-layout {white-space: nowrap !important;}`);

        GM_addStyle(`#log img.die-tile-img { width: 8% !important; }`);
        GM_addStyle(`#log img.punchboard-tile-img { width: 8% !important; }`);
        GM_addStyle(`#log img.resource-img { width: 8% !important; }`);
        GM_addStyle(`#log img.resource-tile-img { width: 10% !important; }`);
        GM_addStyle(`#log img.workshop-tile-img { width: 10% !important; }`);
    }

    if (weburl.indexOf('Game/MysticVale') != -1) {
        GM_addStyle(`#singleArea .deckCard,#singleArea .valeCard {display: inline-flex; float: none;}`);
        GM_addStyle(`#spirits .display .valeCard {width: 20%; display: inline-flex; float: none; margin: 3px;}`);
    }

    if (weburl.indexOf('Game/InnovationUltimate') != -1) {

        const config = {
            // replaceImgSrc: "https://img.915159.xyz/InnovationUltimate/InnovationUltimate_tips.png",  // 替换原网页上的图片
            popupImgSrc: "https://img.915159.xyz/InnovationUltimate/InnovationUltimate_tips.png" // 点击后弹出的图片
        };
        // 等待目标元素加载
        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else {
                setTimeout(() => waitForElement(selector, callback), 500);
            }
        };

        waitForElement('img.publisherLogo', function (imgElement) {
            // 替换原网页上的图片
            // imgElement.src = config.replaceImgSrc;
            imgElement.style.cursor = 'pointer';

            // 添加点击事件（弹出自定义图片）
            imgElement.addEventListener('click', function () {
                const overlay = document.createElement('div');
                overlay.className = 'popup-overlay';

                const popupImg = document.createElement('img');
                popupImg.className = 'popup-image';
                popupImg.src = config.popupImgSrc;  // 使用自定义弹出图片

                overlay.appendChild(popupImg);
                document.body.appendChild(overlay);

                // 点击弹窗关闭
                overlay.addEventListener('click', function () {
                    document.body.removeChild(this);
                });

                // 按ESC键关闭
                document.addEventListener('keydown', function closeOnEsc(e) {
                    if (e.key === 'Escape') {
                        document.body.removeChild(overlay);
                        document.removeEventListener('keydown', closeOnEsc);
                    }
                });
            });
        });
        updateDeckTooltips();
        GM_addStyle(`#log .effect.effectSpacer>span { border-top: 1px dashed black; height: 0em}`);
        // 添加弹窗样式
        GM_addStyle(`
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                cursor: pointer;
            }
            .popup-image {
                max-width: 90%;
                max-height: 90%;
                border: 1em solid white;
        }
    `);
    }


    const CACHE_KEY = 'yucata_image_mappings';
    const CACHE_EXPIRY = 2400 * 60 * 60 * 1000; // 缓存24小时
    let imageMappings = {};
    if (!/InnovationUltimate|WarChest|Arnak|MysticVale|UnderwaterCities/.test(weburl)) return; // 非目标页面直接退出



    /*-----------------------------*/

    // 1. 检查是否有缓存
    function loadFromCache() {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                imageMappings = data;
                replacetitle();
                replaceImages(); // 立即替换现有图片
                startObserver(); // 监听新图片加载
                return true;
            }
        }
        return false;
    }

    // 2. 从网络加载映射
    function fetchImageMappings() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://code.915159.xyz/yucata/CardName.json",
            onload: function (response) {
                imageMappings = JSON.parse(response.responseText);

                // 存储到缓存
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({
                        data: imageMappings,
                        timestamp: Date.now(),
                    })
                );

                replacetitle();
                replaceImages(); // 立即替换
                startObserver(); // 监听新图片
            },
            onerror: function () {
                console.warn("图片映射加载失败，尝试使用缓存");
                if (loadFromCache()) return; // 如果缓存可用则使用

                // 如果没有缓存，则稍后重试
                setTimeout(fetchImageMappings, 3000);
            }
        });
    }

    // 3. 替换图片逻辑（确保可靠）
    function replaceImages() {
        const gameMappings = [
            {
                selector: 'img[src*="/InnovationUltimate/images/cards/fronts/en/"]',
                game: "InnovationUltimate",
                basePath: 'https://www.yucata.de/Games/InnovationUltimate/images/cards/fronts/zh/'
            },
            {
                selector: 'img[src*="/InnovationUltimate/images/cards/backs/en/"]',
                game: "InnovationUltimate",
                basePath: 'https://www.yucata.de/Games/InnovationUltimate/images/cards/backs/zh/'
            },
            {
                selector: 'img[src*="/InnovationUltimate/images/cards/specials/en/"]',
                game: "InnovationUltimate",
                basePath: 'https://www.yucata.de/Games/InnovationUltimate/images/cards/specials/zh/'
            },
            {
                selector: 'img[src*="/WarChest/images/"]',
                game: "WarChest",
                basePath: 'https://img.915159.xyz/WarChest/'
            },
            {
                selector: 'img[src*="/Arnak/images/card"]',
                game: "Arnak",
                basePath: 'https://img.915159.xyz/Arnak/'
            },
            {
                selector: 'img[src*="/MysticVale/images/"]',
                game: "MysticVale",
                basePath: 'https://img.915159.xyz/MysticVale/'
            }
        ];

        gameMappings.forEach(mapping => {
            document.querySelectorAll(mapping.selector).forEach(img => {
                const fileName = img.src.split('/').pop(); // 提取文件名，如 "card79-1.jpg"
                const newPath = imageMappings[mapping.game]?.[fileName]; // 查找映射

                if (newPath && !img.dataset.replaced) {
                    img.src = mapping.basePath + newPath;
                    img.dataset.replaced = 'true';
                }
            });
        });
    }

    // 缓存变量
    let lastTitle = '';
    let lastgameTitle = '';

    // 通用替换函数
    function localizeText(text) {
        if (!text) return text;

        return text
            .replace(/Innovation Ultimate/, "创世发明终极版")
            .replace(/\+1 achievement/, "+1 成就")
            .replace(/no card tracking/, "无卡牌追踪")
            .replace(/Echoes/, "回声")
            .replace(/Figures/, "伟人")
            .replace(/Unseen/, "藏匿")
            .replace(/Cities/, "城市")
            .replace(/Artifacts/, "文物")
            .replace(/Teams/, "组队")
            .replaceAll(/, /g, "，");
    }

    function replacetitle() {
        // 处理页面标题
        const titleElement = document.head?.querySelector('title');
        if (titleElement) {
            const currentTitle = titleElement.textContent;
            if (currentTitle && currentTitle !== lastTitle) {
                const localizedTitle = localizeText(currentTitle);
                if (localizedTitle !== currentTitle) {
                    titleElement.textContent = localizedTitle;
                    lastTitle = localizedTitle;
                }
            }
        }

        // 处理游戏标题
        const gametitleElement = document.body?.querySelector('#gameTitle');
        if (gametitleElement) {
            const currentGameTitle = gametitleElement.textContent;
            if (currentGameTitle && currentGameTitle !== lastgameTitle) {
                const localizedGameTitle = localizeText(currentGameTitle);
                if (localizedGameTitle !== currentGameTitle) {
                    gametitleElement.textContent = localizedGameTitle;
                    lastgameTitle = localizedGameTitle;
                }
            }
        }
    }

    // 4. 监听动态加载的图片（优化监听方式）
    function startObserver() {
        const observer = new MutationObserver(mutations => {
            let needsUpdate = false;

            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                updateDeckTooltips();
                replacetitle();  // 现在这个调用会更谨慎
                replaceImages();
            };
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    // 5. 启动流程（先读缓存，失败再请求网络）
    if (!loadFromCache()) {
        fetchImageMappings();
    }
})();