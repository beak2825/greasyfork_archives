// ==UserScript==
// @name         🌿 做个绿色网站
// @namespace    https://github.com/ricsy/GreenWeb
// @version      1.0.2
// @license      MIT
// @description  自动生成响应式目录，支持清除广告、不相关内容，适配夜间模式
// @author       ricsy
// @match        *://www.jianshu.com/p/*
// @match        *://blog.csdn.net/*/article/details/*
// @icon         none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534876/%F0%9F%8C%BF%20%E5%81%9A%E4%B8%AA%E7%BB%BF%E8%89%B2%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/534876/%F0%9F%8C%BF%20%E5%81%9A%E4%B8%AA%E7%BB%BF%E8%89%B2%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

/* =============================== 全局错误监听 =============================== */
window.addEventListener('error', (e) => {
    // console.log(`[GreenWeb] [全局异常] ${e.message} @${e.filename}:${e.lineno}`);
});

/* =============================== 元素标签 =============================== */
const elementTag = (() => {
    const CONFIG = {
        'www.jianshu.com': {
            'article': {
                name_zh: '文章标签',
                hide: false,
            },
            'aside': {
                name_zh: '侧边栏标签',
                hide: true,
            },
        },
        'blog.csdn.net': {
            'article': {
                name_zh: '文章标签',
                hide: false,
            },
        }
    };
    return {
        // 根据中文名称查询
        getTagByChineseName: (name_zh) => {
            let result = '';
            const host = window.location.hostname;
            const platform = Object.keys(CONFIG).find(k => host.includes(k));
            if (!platform) return result;

            for (const [tag, config] of Object.entries(CONFIG[platform])) {
                const zhName = typeof config === 'object' ? config.name_zh : config;
                if (zhName === name_zh) {
                    return { 'tag': tag, 'hide': config?.hide || false };
                }
            }
            return result;
        },
    }
})();

/* =============================== 页面元素 =============================== */
const webElement = (() => {
    const CONFIG = {
        'www.jianshu.com': {
            '.aside': {
                name_zh: '右侧广告栏',
                selector_type: 'class',
                name_en: 'aside',
                type: 'official',
                dynamic: true,
                hide: true,
            },
            '#side-menu-toc': {
                name_zh: '目录主容器',
                selector_type: 'id',
                name_en: 'side-menu-toc',
                type: 'custom'
            },
            '#menu_toc_ol': {
                name_zh: '目录列表',
                selector_type: 'id',
                name_en:'menu_toc_ol',
                type: 'custom'
            },
            '#ad-control': {
                name_zh: '广告控制栏',
                selector_type: 'id',
                name_en:'ad-control',
                type: 'custom'
            },
        },
        'blog.csdn.net': {
            '.toolbar-container': {
                name_zh: '顶部工具栏',
                selector_type: 'class',
                name_en: 'toolbar-container',
                type: 'official',
                hide: true,
            },
            '#asideProfile': {
                name_zh: '个人信息栏',
                selector_type: 'id',
                name_en: 'asideProfile',
                type: 'official',
                hide: true,
            },
            '#asideHotArticle': {
                name_zh: '热门文章栏',
                selector_type: 'id',
                name_en: 'asideHotArticle',
                type: 'official',
                hide: true,
            },
            '#asideNewComments': {
                name_zh: '最新评论栏',
                selector_type: 'id',
                name_en: 'asideNewComments',
                type: 'official',
                hide: true,
            },
            '#footerRightAds': {
                name_zh: '底部广告栏',
                selector_type: 'id',
                name_en: 'footerRightAds',
                type: 'official',
                hide: true,
            },
            '#recommend-right': {
                name_zh: '推荐栏',
                selector_type: 'id',
                name_en: 'recommend-right',
                type: 'official',
                hide: true,
            },
            '#recommendAdBox': {
                name_zh: '推荐广告栏',
                selector_type: 'id',
                name_en:'recommendAdBox',
                type: 'official',
                hide: true,
            },
            '#rightAside': {
                name_zh: '右侧广告栏',
                selector_type: 'id',
                name_en:'rightAside',
                type: 'official',
                hide: true,
            },
            '.groupfile-div': {
                name_zh: '文件分组栏',
                selector_type: 'class',
                name_en:'groupfile-div',
                type: 'official',
                hide: true,
            },
            '.aside-title': {
                name_zh: '侧边栏标题',
                selector_type: 'class',
                name_en:'aside-title',
                type: 'official',
                hide: true,
            },
            '.aside-content': {
                name_zh: '侧边栏内容',
                selector_type: 'class',
                name_en:'aside-content',
                type: 'official',
                hide: true,
            },
            '.btn-code-notes.ckeditor': {
                name_zh: '代码笔记按钮',
                selector_type: 'class',
                name_en:'btn-code-notes.ckeditor',
                type: 'official',
                hide: true,
            },
            '.recommend-box.insert-baidu-box': {
                name_zh: '百度推荐栏',
                selector_type: 'class',
                name_en:'recommend-box.insert-baidu-box',
                type: 'official',
                hide: true,
            },
            '.feed-template': {
                name_zh: '文章列表',
                selector_type: 'class',
                name_en:'feed-template',
                type: 'official',
                hide: true,
            },
            '.ad-box.ad-txt-box': {
                name_zh: '文章底部广告栏',
                selector_type: 'class',
                name_en:'ad-box.ad-txt-box',
                type: 'official',
                hide: true,
            },
            '#csdn-copyright-footer': {
                name_zh: '版权信息栏',
                selector_type: 'id',
                name_en:'csdn-copyright-footer',
                type: 'official',
                hide: true,
            },
            "[id^='dmp_ad_']": {
                name_zh: 'DMP广告栏',
                selector_type: 'attribute',
                name_en:'dmp_ad_',
                type: 'official',
                hide: true,
            }
        }
    };
    return {
        // 返回所有选择器
        getAllSelectors: () => {
            const host = window.location.hostname;
            const platform = Object.keys(CONFIG).find(k => host.includes(k));
            return platform ? Object.entries(CONFIG[platform]).map(([selector, config]) => ({
                name_zh: typeof config === 'object' ? config.name_zh : config,
                name_en: config?.name_en || selector,
                selector: selector,
                hide: config?.hide || false,
                type: config?.type || 'official',
                dynamic: config?.dynamic || false
            })) : [];
        },
        // 根据中文名称查询，如果中文名称为空则返回所有选择器
        getSelectorByChineseName: (name_zh) => {
            if (!name_zh) return this.getAllSelectors();

            const host = window.location.hostname;
            const platform = Object.keys(CONFIG).find(k => host.includes(k));
            if (!platform) return [];

            for (const [selector, config] of Object.entries(CONFIG[platform])) {
                const zhName = typeof config === 'object' ? config.name_zh : config;
                if (zhName === name_zh) {
                    return [{
                        name_en: config?.name_en || selector,
                        selector: selector,
                        hide: config?.hide || false,
                        type: config?.type || 'official',
                        dynamic: config?.dynamic || false
                    }];
                }
            }
            return [];
        }
    };
})();

/* =============================== 元素配置 =============================== */
const EelementConfig = (() => {
    const CONFIG = {
        'blog.csdn.net': {
            rightOffset: 850,
            topOffset: 110,
        },
        'www.jianshu.com': {
            rightOffset: 800,
            topOffset: 100,
        }
    };

    return {
        // 获取指定配置
        getConfig: () => {
            const { hostname } = window.location;
            const [platformKey] = Object.keys(CONFIG)
                .filter(k => hostname.includes(k));
            return CONFIG[platformKey] || {};
        }
    };
})();

/* =============================== 动态样式 =============================== */
// 【目录】右侧偏移量
const tocRightOffset = () => {
    const { rightOffset } = EelementConfig.getConfig();
    return `max(20px, calc(50% - ${rightOffset}px))`;
};
// 【目录】顶部偏移量
const tocTopOffset = () => {
    const { topOffset } = EelementConfig.getConfig();
    return `${topOffset}px`;
};

/* =============================== 样式常量 =============================== */
// 目录样式
const LOC_CONFIG = {
    // 目录样式
    menu: {
        width: 'clamp(250px, 25vw, 300px)',     /* 响应式宽度 */
        right: tocRightOffset(),                /* 动态右侧间距 */
        top: tocTopOffset(),                    /* 动态顶部间距 */
        background: '#f9f9f9',
        zIndex: 99999,
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
    },
    // 分割线样式
    hr: {
        height: '2px',
        color: '#c7254e'
    },
    // 目录项样式
    listItem: {
        fontSize: '15px',
        hoverTransform: 'translateX(5px)'       /* 平滑位移动画，向右移动5px */
    }
};

/* =============================== 工具函数库 =============================== */
const Utils = (() => {
    return {
        // 生成标准化类选择器
        getTagSelector: (tag) => {
            const className = $(tag).attr('class');
            if (!className) {
                console.error(`元素标签 ${tag} 没有 class 属性`);
                return '';
            }
            return '.' + className.split(' ').join('.');
        },

        // 防抖函数，防止频繁触发事件
        debounce: (func, delay) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        },

        setupCopyGuard: () => {
            // 禁用文本选择
            GM_addStyle(`
                * {
                    -webkit-user-select: none!important;
                    -moz-user-select: none!important;
                    -ms-user-select: none!important;
                    user-select: none!important;
                }
                .hljs {
                    user-select: text!important;
                }
            `);

            // 阻止右键菜单
            document.addEventListener('contextmenu', e => e.preventDefault());

            // 拦截剪贴板事件
            const handleClipboard = (e) => {
                const notice = '转载请注明出处：\n本文采用知识共享署名-非商业性使用 4.0 国际许可协议';
                e.clipboardData.setData('text/plain', notice);
                e.preventDefault();
                alert(notice);
            };
            document.addEventListener('copy', handleClipboard);
            document.addEventListener('cut', handleClipboard);
        },

        // 验证选择器类型是否有效
        validateSelectorType: (selector) => {
            const validTypes = ['id', 'class', 'attribute'];
            const selectorRegex = {
                'id': /^#([\w-]+|\[.+\])$/,
                'class': /^\.([\w-]+|\[.+\])$/,
                'attribute': /^\[.*?=['"].*?['"]\]$/
            };
            
            if (!validTypes.includes(selector.selector_type)) {
                console.error(`无效选择器类型: ${selector.selector_type}，应为 id/class/attribute`);
                return false;
            }
            if (!selector.selector.match(selectorRegex[selector.selector_type])) {
                console.error(`无效 ${selector.selector_type} 选择器格式: ${selector.selector}`);
                return false;
            }
            return true;
        }
    };
})();

/* =============================== 核心功能模块 =============================== */

/* ======================== 目录生成模块 ======================== */
// 文章标题是否存在，默认为 true（存在）
let isTitleExist = true;

const TOCGenerator = (() => {
    // 获取排序后的唯一标题层级
    function getSortedUniqueLevels(titles) {
        const levelSet = new Set();

        titles.each(function() {
            const level = parseInt(this.tagName.substring(1));
            levelSet.add(level);
        });

        // 将 Set 转为数组并按 h1-h6 顺序排序
        return Array.from(levelSet).sort((a, b) => a - b);
    }

    // 页面元素
    const {
        tag: articleTag = 'article',
    } = elementTag.getTagByChineseName('文章标签');
    const {
        name_en: sideMenuLocName = 'side-menu-toc',
        selector: sideMenuLocSelector = '#side-menu-toc'
    } = webElement.getSelectorByChineseName("目录主容器") || {};
    const {
        name_en: menuLocOlName = 'menu_toc_ol',
        selector: menuLocOlSelector = '#menu_toc_ol'
    } = webElement.getSelectorByChineseName("目录列表") || {};

    // 标题起始索引
    let titleIndex = 1;
    // 目录标题
    const LocTitle =  "📖 内容导航";
    // 获取所有标题，包含一级标题到六级标题
    const $titles = $(articleTag).find('h1,h2,h3,h4,h5,h6');
    if (!$titles.length) {
        isTitleExist = false;
        return false;
    }

    /* =============================== 事件监听 =============================== */
    // 加载/调整大小/滚动时触发（严格模式）
    const optimizedScrollHandler = Utils.debounce(() => bindScrollEvents(true), 100);
    window.addEventListener('load', optimizedScrollHandler);
    window.addEventListener('resize', optimizedScrollHandler);
    window.addEventListener('scroll', optimizedScrollHandler);

    // 滚动时触发，用于同步菜单滚动位置
    const optimizedSyncMenuScroll = Utils.debounce(() => syncMenuScroll(true), 100);
    window.addEventListener('scroll', optimizedSyncMenuScroll);

    /* =============================== 初始化目录结构 =============================== */
    const initStructure = () => {
        // 文章容器
        const $article = $(articleTag);
        if (!$article.length) {
            console.error(`[GreenWeb] [TOC] 未找到文章容器 ${articleTag}`);
            return false;
        }

        // 插入目录
        $article.prepend(`
            <div id=${sideMenuLocName} style="
                position: fixed;                                     /* 固定定位 */
                top: ${LOC_CONFIG.menu.top};                         /* 距离顶部的距离 */
                right: ${LOC_CONFIG.menu.right};                     /* 距离右侧的距离 */
                width: ${LOC_CONFIG.menu.width};                     /* 宽度 */
                background: ${LOC_CONFIG.menu.background};           /* 背景颜色 */
                z-index: ${LOC_CONFIG.menu.zIndex};                  /* 确保在其他元素之上 */
                border-radius: ${LOC_CONFIG.menu.borderRadius};      /* 圆角 */
                border-left: 1px solid #ccc;                         /* 左边框 */
                box-sizing: border-box;                              /* 包含边框和内边距 */
                box-shadow: ${LOC_CONFIG.menu.boxShadow};            /* 阴影 */
                padding:15px 20px;                                   /* 内边距 */
                line-height: 1.3;                                    /* 行高 */
                max-width: calc(100vw - 1000px);                     /* 防溢出保护 */
                max-height: 50vh;                                    /* 最大高度 */
                overflow-y: auto;                                    /* 溢出时显示滚动条 */
            ">
                <h2 style="margin:0 0 8px;font-size:18px;">
                    ${LocTitle}
                </h2>
                <hr style="
                    height: ${LOC_CONFIG.hr.height};                 /* 线条粗细 */
                    background: ${LOC_CONFIG.hr.color};              /* 背景颜色 */
                    margin: 12px 0;                                  /* 上下边距 */
                    border: none;                                    /* 移除默认边框 */
                ">
                <ol id=${menuLocOlName} style="list-style: none; margin: 0; padding: 0;"></ol>
            </div>
        `);
        return true;
    };

    /* =============================== 生成目录项 =============================== */
    const generateItems = () => {
        // 创建文档片段（内存中的临时容器）
        const fragment = document.createDocumentFragment();
        const duplicateTitlesLevel = getSortedUniqueLevels($titles);
        $titles.each(function() {
            // 标题级别
            const level = parseInt(this.tagName.substring(1));
            // 标题内容
            let title = $(this).text();
            // 标题ID
            const titleId = `toc_${titleIndex++}`;
            // 为标题添加ID
            $(this).attr('id', titleId);
            // 当前标题在去重后的层级中的索引
            const index = duplicateTitlesLevel.indexOf(level);

            let paddingLeft = 0;
            // 增加默认左边距，美化悬浮显示效果
            // 所有标题层级相同，或标题层级与去重按顺序排序后的第一个层级相同时满足条件
            if (duplicateTitlesLevel.length == 1 || index == 0) {
                paddingLeft = 10;
            } else {
                // 标题层级与去重按顺序排序后的最后一个层级相同时满足条件
                paddingLeft = index * 20;
            }

            // 生成目录项
            const $li = $(`
                <li class="${titleId}" style="
                    padding-left: ${paddingLeft}px;
                    margin:6px 0;
                    transition:all 0.2s;
                    cursor:pointer;
                ">
                    ${title}
                </li>
            `);

            if (!title.includes(LocTitle)) {
                // 将原生 DOM 元素添加到片段
                fragment.appendChild($li[0]);
            }
        });

        // 一次性添加所有目录项到文档片段，避免频繁操作DOM
        $(menuLocOlSelector).append(fragment);
    };

    /* =============================== 绑定点击事件 =============================== */
    const bindClickEvents = () => {

        $(menuLocOlSelector).on('click', 'li', function() {
            // 获取目标元素
            const targetId = $(this).attr('class');
            const targetElement = $(`#${targetId}`)[0];

            // =============================== 处理页面滚动 ===============================
            // 多次点击同一目录项时，不做处理
            if (!targetElement) {
                return ;
            }
            // 计算滚动位置
            const elementHeight = targetElement.offsetHeight;
            const y = targetElement.getBoundingClientRect().top + window.pageYOffset - elementHeight - 10;

            // 滚动到目标位置
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });

             // =============================== 处理点击状态 ===============================
            // 清除所有元素点击状态
            $(`${menuLocOlSelector} li`).removeClass('active');
            // 设置当前元素点击状态
            $(this).addClass('active');
        });
    };

    /* =============================== 绑定滚动事件 =============================== */
    const bindScrollEvents = (strictMode) => {
        let currentId = '';
        let minVisibleTop = Infinity;
        let maxInvisibleTop = -Infinity;
        let hiddenId = '';

        Array.from($titles).forEach(title => {
            const rect = title.getBoundingClientRect();
            const id = title.getAttribute('id');

            // 严格模式判断逻辑
            const isVisible = strictMode ?
                rect.top >= 10 && rect.bottom <= window.innerHeight :
                rect.top >= -rect.height;

            if (isVisible && rect.top < minVisibleTop) {
                minVisibleTop = rect.top;
                currentId = id;
            } else if (rect.top < 0 && rect.top > maxInvisibleTop) {
                maxInvisibleTop = rect.top;
                hiddenId = id;
            }
        });

        currentId = currentId || hiddenId;

        const tocLinks = document.querySelectorAll(`${menuLocOlSelector} li`);
        // 更新激活状态
        tocLinks.forEach(link => {
            const classList = link.className || '';
            const firstClass = classList.split(/\s+/)[0] || '';
            link.classList.toggle('active', firstClass === currentId);
        });
    };

    // 页面和长目录滚动同步
    function syncMenuScroll() {
        const activeItem = $(`${menuLocOlSelector} li.active`)[0];
        if (!activeItem) return;

        const menu = $(sideMenuLocSelector)[0];
        const itemTop = activeItem.offsetTop;
        const itemHeight = activeItem.offsetHeight;
        const menuHeight = menu.clientHeight;

        // 计算目标滚动位置
        const targetScrollTop = itemTop - (menuHeight - itemHeight) / 2;

        // 节流平滑滚动
        if (!menu.scrollTimeout) {
            menu.scrollTimeout = setTimeout(() => {
                menu.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
                menu.scrollTimeout = null;
            }, 150); // 调整节流时间 (单位: 毫秒)
        }
    }

    /* =============================== 核心入口 =============================== */
    return {
        init: () => {
            if (!initStructure()) return;
            generateItems();
            bindClickEvents();
        }
    };
})();

/* =============================== 广告管理模块 =============================== */
const AdManager = (() => {
    // 存储模块
    const Storage = (() => {
        return {
            load: () => JSON.parse(localStorage.getItem('adSettings') || '{}'),
            save: (settings) => localStorage.setItem('adSettings', JSON.stringify(settings))
        };
    })();

    const {
        name_en: adControlName = 'ad-control',
    } = webElement.getSelectorByChineseName("广告控制栏") || {};

    // UI组件库
    const ControlPanel = (() => {
        const create = () => {
            const { menu } = LOC_CONFIG;
            return $(`
                <div id=${adControlName} style="
                    position: fixed;
                    bottom: 20px;
                    right: ${menu.right};
                    width: ${menu.width};
                    background: ${menu.background};
                    box-shadow: ${menu.boxShadow};
                    border-radius: 8px;
                    padding: 15px;
                    min-height: 100px;
                    max-height: 40vh;
                    overflow-y: auto;
                    z-index: 99999;
                    display: block;
                ">
                    <span class="close-btn" style="
                        position: absolute;
                        right: 8px;
                        top: 1px;
                        cursor: pointer;
                        font-size: 15px;
                        color: #666;
                        &:hover { color: #333 }">
                        ×
                    </span>
                    <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 10px;
                        ">
                        <h3 style="margin: 0; font-size: 16px;">
                            🛡️ 广告过滤器&nbsp;
                            <span id="ad-counter" style="float: right; font-size: 14px; color: #666;">
                                (<span id="filtered-count">0</span>/<span id="total-count">0</span>)
                            </span>
                        </h3>
                        <button id="toggle-panel" style="
                                cursor: pointer;
                                background: none;
                                border: none;
                                font-size: 20px;
                            ">⬇️
                        </button>
                    </div>
                    <div id="filters" style="max-height: 25vh; overflow-y:auto;">
                    </div>
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button id="reset-default" style="flex: 1; padding: 5px;">恢复默认</button>
                        <button id="toggle-all" style="flex: 1; padding: 5px;">全部</button>
                    </div>
                </div>`);
        };
        return { create };
    })();

    // 核心逻辑
    const Core = (() => {
        const setupEventListeners = (panel) => {
        };

        return {
            init: () => {
                if (window.location.hostname !== 'blog.csdn.net') return;
                // 创建广告控制面板
                window.panel = ControlPanel.create();
                $('body').append(window.panel);
                setupEventListeners(window.panel);
            }
        };
    })();

    return {
        init: Core.init
    };
})();

// 广告计数器更新函数
const updateAdCounter = (() => {
    return {
      init: () => {
        const counters = webElement.getAllSelectors();
        const total = counters.filter(c => {
            const el = document.querySelector(c.selector);
            return el && c.type === 'official';
        }).length;
        const filtered = counters.filter(c => {
          const el = document.querySelector(c.selector);
          return el && (el.style.display === 'none' || el.offsetParent === null);
        }).length;
  
        $('#filtered-count').text(filtered);
        $('#total-count').text(total);
      }
    };
})();

const createControlPanel = () => {
    const panel = window.panel;

    // 从 localStorage 加载用户设置
    const userSettings = JSON.parse(localStorage.getItem('adSettings') || '{}');
    const elements = webElement.getAllSelectors() ?? [];

    // =============================== 【CSDN】创建控制面板 ===============================
    elements.forEach((element) => {
        const selector = element.selector;
        const el = document.querySelector(selector);
        if (!el) {
            return;
        }
        const name_zh = element.name_zh;
        const hide = element.hide;
        // 如果 localStorage 中没有设置，则使用默认值
        const isEnabled = userSettings[selector] !== undefined ? userSettings[selector] : hide;
        panel.find('#filters').append(`
            <label style="
                    display:flex; align-items:center; gap:8px; padding:5px; cursor:pointer;
                ">
                <input type="checkbox" ${isEnabled ? 'checked' : ''} data-selector="${selector}">
                <span style="font-size:13px;">${selector}『${name_zh}』</span>
            </label>
        `);
    });

    // =============================== 【CSDN】面板切换功能 ===============================
    panel.find('#toggle-panel').click(() => {
        panel.toggleClass('collapsed');
        $('#filters').slideToggle();
        $('#toggle-panel').text(panel.hasClass('collapsed') ? '⬆️' : '⬇️');
    });

    // =============================== 【CSDN】控制面板事件 ===============================
    // 保存设置到 localStorage
    panel.on('change', 'input[type="checkbox"]', function() {
        const selector = $(this).data('selector');
        userSettings[selector] = $(this).prop('checked');
        localStorage.setItem('adSettings', JSON.stringify(userSettings));
        console.log(`[GreenWeb] [AdFilter] 已保存设置: ${selector} => ${userSettings[selector]}`);
        $(selector).css('display', userSettings[selector] ? 'none' : 'block');
        updateAdCounter.init();
    });

    // 重置默认设置
    panel.find('#reset-default').click(() => {
        localStorage.removeItem('adSettings');
        // 刷新页面
        location.reload();
    });

    // 全选/全不选
    panel.find('#toggle-all').click(() => {
        const checkboxes = panel.find('input[type="checkbox"]');
        console.log(checkboxes);
        const allChecked = checkboxes.toArray().every(cb => cb.checked);
        checkboxes.prop('checked', !allChecked).trigger('change');
        updateAdCounter.init();
    });

    // 绑定广告关闭按钮点击事件
    $('#ad-control .close-btn').on('click', function() {
        $(this).closest('#ad-control').hide();
    });

    return panel;
};

const removeAds = () => {
     // 移除简书广告
     if (window.location.hostname === 'www.jianshu.com') {

        // =============================== 【简书】移除侧边栏标签 ===============================
        const {
            tag: asideTag = 'aside',
            hide: hideAsideTag = false
        } = elementTag.getTagByChineseName('侧边栏标签');
        const asideSelector = Utils.getTagSelector(asideTag);
        if (!asideSelector) {
            console.error(`[GreenWeb] [TOC] 未找到侧边栏标签 ${asideTag} 对应的选择器`);
            return false;
        }
         if (hideAsideTag) {
            $(asideSelector).css('display','none');
         }

        // =============================== 【简书】移除其他标签 ===============================
        const {
            tag: articleTag = 'article',
        } = elementTag.getTagByChineseName('文章标签');
        // 获取文章标签的父级元素
        const $articleParent = $(articleTag).parent();
        // 隐藏文章标签父级元素的所有同级节点
        $articleParent.siblings().hide();
    } else if (window.location.hostname === 'blog.csdn.net') {

        // =============================== 【CSDN】批量移除元素 ===============================
        const elements = webElement.getAllSelectors() ?? [];
        elements.forEach(element => {
            if (element.hide) {
                $(element.selector).hide();
            }
        });

        // =============================== 【CSDN】移除复制保护 ===============================
        $('.hljs-button.signin')
            .removeClass('signin') // 移除 signin 类
            .removeAttr('onclick') // 移除 onclick 属性
            .attr('data-title', '点击复制') // 设置新的 data-title 属性
            .on('click', async function() { // 新增点击事件，异步处理
                try {
                    const $button = $(this);
                    const $codeBlock = $button.closest('.hljs').find('code')
                                    || $button.siblings('.code-content');

                    // 同时写入纯文本和富文本格式
                    const htmlContent = $codeBlock.html()
                        .replace(/</g, '&lt;') // 保持 HTML 转义
                        .replace(/\n/g, '<br>') // 保留换行
                        + `<style>${$codeBlock.attr('style')}</style>`; // 保留代码样式

                    const textContent = $codeBlock.text()
                        .replace(/\n\s+/g, '\n') // 压缩缩进
                        .replace(/\t/g, '    '); // 替换制表符

                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'text/plain': new Blob([textContent], { type: 'text/plain' }),
                            'text/html': new Blob([
                                `<pre style="${$codeBlock.attr('style')}" class="${$codeBlock.attr('class')}">${htmlContent}</pre>`
                            ], { type: 'text/html' })
                        })
                    ]);
                    $button.attr('data-title', '✅ 已复制');
                    setTimeout(() => $button.attr('data-title', '点击复制'), 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                    $button.attr('data-title', '❌ 复制失败');
                    setTimeout(() => $button.attr('data-title', '点击复制'), 1500);
                }
            });;

    };
};

/* =============================== 样式管理模块 =============================== */
GM_addStyle(`
    /* =============================== 广告控制面板 =============================== */
    #ad-control.collapsed {
        height: 40px;
        overflow: hidden;
    }
    #ad-control button {
        background: #f0f0f0;
        border-radius: 4px;
        transition: all 0.2s;
    }
    #ad-control button:hover {
        background: #e0e0e0;
    }
    #filters label:hover {
        background: #f5f5f5;
    }
    @media (prefers-color-scheme: dark) {
        #ad-control {
            background: #2d2d2d !important;
            color: #e0e0e0;
        }
        #ad-control button {
            background: #404040;
            color: #fff;
        }
        #filters label:hover {
            background: #3d3d3d;
        }
    }

    /* =============================== 目录 =============================== */
    #menu_toc_ol li {
        font-size: ${LOC_CONFIG.listItem.fontSize};             /* 字体大小 */
        cursor: pointer;                                        /* 鼠标悬停时的光标样式 */
        transition: all 0.2s;                                   /* 过渡效果 */
        border-radius: 4px;                                     /* 圆角 */
        padding-top: 4px;                                       /* 上边距 */
        padding-bottom: 4px;                                    /* 下边距 */
    }
    #menu_toc_ol li:hover {
        background: #e7b948;                                  /* 悬停时的背景颜色 */
        text-decoration: underline;                             /* 悬停时添加下划线 */
        transform: ${LOC_CONFIG.listItem.hoverTransform};       /* 悬停时的动画效果 */
    }
    #menu_toc_ol li.active {
        color: #1902c0;                                       /* 点击时的文字颜色 */
        font-weight: 500;                                       /* 加粗显示 */
        background: #e8f0fe;                                  /* 点击时的背景颜色 */
    }
    @media (prefers-color-scheme: dark) {                       /* 深色模式 */
        #side-menu-toc {
            background: #2d2d2d !important;
            color: #e0e0e0;
        }
        #side-menu-toc h2 {
            color: #e0e0e0 !important;
        }
        #menu_toc_ol li.active {
            background: #88969f;
        }
        #menu_toc_ol li:hover {
            background: #a4c99e;
            color: #000000;
        }
    }
    /* 响应式处理 */
    @media (max-width: 1400px) {
        #side-menu-toc, #ad-control {
            display: none !important;
        }
    }
`);

/* =============================== 主执行流程 =============================== */
(() => {
    'use strict';

    /* =============================== 移除广告 =============================== */
    (() => {
        try {
            removeAds();
    console.log('[GreenWeb] [ADB] ✅ 广告已净化');
        } catch (e) {
            console.error('[GreenWeb] [ADB] 💥 广告净化模块异常 - ', e);
        }
    })();

    /* =============================== 广告控制 =============================== */
    (() => {
        try {
            if (window.location.hostname === 'blog.csdn.net') {
                AdManager.init();
                $('body').append(createControlPanel());
                updateAdCounter.init();
                console.log('[GreenWeb] [ADB] ✅ 广告控制面板初始化完成');
            }
        } catch (e) {
            console.error('[GreenWeb] [ADB] 💥 广告控制模块异常 - ', e);
        }
    })();

    /* =============================== 生成目录 =============================== */
    const shouldGenerateTOC = (() => {
        try {
            if (!isTitleExist) {
                console.info('[GreenWeb] [TOC] 文章标题不存在，跳过目录生成');
                return false;
            }
            return true;
        } catch (e) {
            console.error('[GreenWeb] [TOC] 💥 目录预检异常 - ', e);
            return false;
        }
    })();

    (() => {
        try {
            if (!shouldGenerateTOC) return;
            console.log("[GreenWeb] [TOC] 开始生成目录... ⏳");
            TOCGenerator.init();
            console.log('[GreenWeb] [TOC] ✅ 目录生成完成，请尽情享受吧！🎉 🍺');
        } catch (e) {
            console.error('[GreenWeb] [TOC] 💥 目录生成模块异常 - ', e);
        }
    })();
})();