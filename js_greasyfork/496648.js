// ==UserScript==
// @name               AlwaysBing
// @namespace          AlwaysBing
// @version            1.0.0
// @description        Always search with Bing
// @description:en     Always search with Bing
// @description:zh-CN  永远使用 Bing 搜索
// @description:zh-TW  永遠使用 Bing 搜索
// @icon               https://cn.bing.com/favicon.ico
// @author             lingbopro
// @homepage           https://github.com/lingbopro/AlwaysBing
// @license            MIT
// @match              *://*.bing.com/*
// @match              *://*.baidu.com/*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_addStyle
// @grant              GM_log
// @grant              window.location
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/496648/AlwaysBing.user.js
// @updateURL https://update.greasyfork.org/scripts/496648/AlwaysBing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*
     * AlwaysBing
     * 这是一个开源的用户脚本
     * 遵循 MIT 协议
     * GitHub 存储库: https://github.com/lingbopro/AlwaysBing
     * GreasyFork: https://greasyfork.org/zh-CN/scripts/496648
     * 贡献代码前，先用 Prettier 格式化啊~
     */

    //SECTION - 配置 / CONFIG
    /*
     * --------------------
     * 这里是配置内容。
     * 如果你要修改配置，请在这里修改。
     * PS: 不要删JSDoc啊
     * --------------------
     */

    /**
     * 规则列表
     * @type {array}
     */
    let rules = [
        // TODO: 完善规则
        {
            name: '百度', // 名称
            matches: [
                // 子规则
                {
                    type: 'search', // 类型（用来匹配下方的Bing URL）
                    url: 'baidu.com/s', // URL匹配
                    query: 'wd', // 包含搜索内容的参数名称
                },
                {
                    type: 'image',
                    url: 'image.baidu.com/search',
                    query: 'word',
                },
                {
                    type: 'video',
                    url: 'baidu.com/sf/vsearch',
                    query: 'wd',
                },
            ],
        },
    ];
    /**
     * 必应的 URL
     * @type {object}
     */
    let bing = {
        search: 'https://bing.com/search?q=',
        image: 'https://bing.com/images/search?q=',
        video: 'https://bing.com/videos/search?q=',
    };
    /**
     * 读取的配置
     * @type {object}
     */
    let config = {
        rules: [
            // 每项分别对应规则的对应项
            {
                action: 'redirect',
            },
        ],
    };
    //!SECTION

    //SECTION - 逻辑 / LOGIC
    /*
     * --------------------
     * 这里是核心逻辑。
     * 如果你要修改配置，就别动这。
     * 注释不太多，将就看吧:D
     * :)
     * --------------------
     */

    let modal_open = false; // 防止叠弹窗
    /**
     * 读取配置
     */
    let readConfig = function () {
        GM_log(`AlwaysBing: read config`);
        config = GM_getValue('config', config); // 读取配置
        config.rules.forEach((value, index) => {
            // 将配置写到规则表中
            rules[index].action = value.action;
        });
        GM_log(`AlwaysBing: config:\n${JSON.stringify(config)}`);
    };
    /**
     * 写入配置
     */
    let writeConfig = function () {
        GM_log(`AlwaysBing: write config`);
        rules.forEach((value, index) => {
            // 将配置从规则表再写回到配置表
            config.rules[index].action = value.action;
        });
        GM_setValue('config', config); // 写入配置
    };
    /**
     * 上下文菜单回调
     * @param {number} index
     */
    let menuCallback = function (index) {
        GM_log(`AlwaysBing: menu callback: ${index}`);
        let rule = rules[index];
        switch (rule.action) {
            case 'redirect':
                rule.action = 'modal';
                break;
            case 'modal':
                rule.action = 'modal_closeable';
                break;
            case 'modal_closeable':
                rule.action = 'nothing';
                break;
            case 'nothing':
                rule.action = 'redirect';
                break;
            default:
                break;
        }
        rules[index] = rule;
        writeConfig();
        refreshMenu();
    };
    /**
     * 刷新上下文菜单
     */
    let refreshMenu = function () {
        GM_log(`AlwaysBing: refresh menu`);
        rules.forEach((value, index) => {
            let text = '';
            switch (value.action) {
                case 'redirect':
                    text = '🔗重定向';
                    break;
                case 'modal':
                    text = '💬提示';
                    break;
                case 'modal_closeable':
                    text = '💬提示（可关闭）';
                    break;
                case 'nothing':
                    text = '❌什么也不做';
                    break;
                default:
                    break;
            }
            GM_registerMenuCommand(
                `🔍${value.name}: ${text}`,
                function () {
                    menuCallback(index);
                },
                {
                    id: 'menu-' + index,
                    autoClose: false,
                    title: `🔍规则: ${value.name}\n▶动作: ${text}`,
                }
            );
        });
    };
    /**
     * 处理和匹配规则
     */
    let process = function () {
        GM_log(`AlwaysBing: process`);
        rules.forEach((value, index) => {
            // 遍历规则
            let currentRule = value;
            GM_log(`AlwaysBing: process rule ${value.name}`);
            value.matches.forEach((value, index) => {
                // 遍历子规则
                if (window.location.href.includes(value.url)) {
                    // URL匹配
                    GM_log(`AlwaysBing: URL matches rule ${currentRule.name}`);
                    let searchParams = new URLSearchParams(
                        window.location.search
                    );
                    let query = searchParams.get(value.query); // 获取参数
                    let url = bing[value.type] + query; // 对应的必应URL
                    switch (currentRule.action) {
                        case 'redirect':
                            window.location.href = url;
                            break;
                        case 'modal':
                            showModal(url, false);
                            break;
                        case 'modal_closeable':
                            showModal(url, true);
                            break;
                        case 'nothing':
                            break;
                        default:
                            break;
                    }
                }
            });
        });
    };
    /**
     * 显示提示窗
     * @param {string} url 跳转的URL
     * @param {boolean} closeable 是否可关闭
     */
    let showModal = function (url, closeable) {
        if (modal_open) {
            return;
        }
        modal_open = true;
        GM_log(
            `AlwaysBing: show modal\n(url: ${url}\n closeable: ${closeable})`
        );
        let modalEl = document.createElement('div');
        modalEl.id = 'alwaysbing-modal-wrapper';
        // 样式
        GM_addStyle(`
#alwaysbing-modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #00000060;
    -webkit-user-select: none;
    user-select: none;
    z-index: 1145; /* 故意不小心的 */
}
#alwaysbing-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 10px 8px;
    width: -moz-fit-content;
    height: -moz-fit-content;
    width: fit-content;
    height: fit-content;
    max-width: 30%;
    max-height: 50%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    text-align: center;
}

/* Bing 暗色主题 */
/* 好像没啥用... */
.b_dark .alwaysbing-modal {
    background-color: #1b1a19;
    color: #ffffff;
}
.b_dark .alwaysbing-modal * {
    color: #ffffff;
}

#alwaysbing-modal>* {
    padding: 10px;
    margin: 15px;
}
#alwaysbing-modal>.close-btn {
    text-align: right;
    align-self: flex-end;
    width: 20px;
    height: 20px;
    cursor: pointer;
}
#alwaysbing-modal>.img-wrapper {
    margin: 10px;
    padding: 10px;
}
#alwaysbing-modal>.img-wrapper>.img {
    display: block;
    width: 60px;
    height: 60px;
    text-align: center;
}
#alwaysbing-modal>.tit {
    font-size: large;
    font-weight: bold;
}
#alwaysbing-modal>.btn {
    padding: 18px;
    background-color: #35adfd;
    color: #ffffff;
    border-radius: 10px;
    cursor: pointer;
}
#alwaysbing-modal>.btn:hover {
    background-color: #7ec9fc;
}
`);
        // HTML
        modalEl.innerHTML = `
<div id="alwaysbing-modal">
    <div class="close-btn" align="right"  
        onclick="document.getElementById('alwaysbing-modal-wrapper').hidden = true;" 
        ${closeable ? '' : 'hidden'}>
        <!-- 关闭按钮 -->
        <!-- https://icons.bootcss.com/icons/x-lg/ -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
    </div>
    <div align="center" class="img-wrapper">
        <!-- Bing图标 -->
        <img class="img" src="https://cn.bing.com/favicon.ico" />
    </div>
    <div class="tit">
        <!-- 标题 -->
        建议使用 Bing 搜索
    </div>
    <div class="content">
        Microsoft Bing 拥有更好的搜索能力，更少的广告，更精准的结果
    </div>
    <div class="btn" onclick="window.open('${url}','_self')">使用 Bing</div>
</div>
`;
        document.body.appendChild(modalEl);
    };

    /**
     * 初始化
     */
    let init = function () {
        GM_log(`AlwaysBing: init`);
        readConfig();
        refreshMenu();
        process();
    };
    init();
    //!SECTION
})();
