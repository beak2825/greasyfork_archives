// ==UserScript==
// @name        泛采专业版插件
// @name:en     FanCai Pro Plugin
// @description 泛采系统增强工具 - 提供主题切换、快捷键、自动刷新等功能，让您的工作更高效
// @description:en Enhanced toolset for FanCai System - Theme switching, keyboard shortcuts, auto-refresh and more
// @namespace   https://www.valuesimplex.com/
// @version     0.0.19
// @author      fangtiansheng <fangtiansheng@gmail.com>
// @icon        https://www.valuesimplex.com/images/favicon.ico
// @license     MIT
// @match       *://*/*
// @connect     *
// @require     https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.2.0/dist/axiosGmxhrAdapter.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/422266/%E6%B3%9B%E9%87%87%E4%B8%93%E4%B8%9A%E7%89%88%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/422266/%E6%B3%9B%E9%87%87%E4%B8%93%E4%B8%9A%E7%89%88%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/*
 * 泛采专业版插件
 * ==============
 *
 * 功能特性:
 * 1. 主题切换 - 支持明暗主题自动切换
 * 2. 快捷键支持:
 *    - ESC: 关闭弹窗
 *    - Ctrl+S: 保存
 *    - 自定义快捷键绑定
 * 3. 自动刷新功能
 * 4. 面板切换优化
 * 5. 验证器位置调整
 * 6. 任务列表限制优化
 * 7. 安全特性检查
 *
 * 安装说明:
 * 1. 确保已安装支持用户脚本的浏览器扩展（如Tampermonkey）
 * 2. 点击安装链接即可自动安装
 *
 * 使用说明:
 * - 脚本会自动在泛采系统页面启用
 * - 可通过浏览器扩展的设置面板配置脚本选项
 * - 问题反馈请访问GitHub仓库提交Issue
 *
 * 更新日志:
 * v0.0.18
 * - 新增主题自动切换功能
 * - 优化键盘快捷键支持
 * - 提升性能和稳定性
 */

// 配置项
const CONFIG = {
    REFRESH_INTERVAL: 1000,
    THEME_CHECK_INTERVAL: 1000,
    MENU_ITEMS: [
        {
            name: '财经转到泛采',
            fn: toCrawl,
            accessKey: 'f'
        }
    ]
};

// 工具函数
const utils = {
    async get(url, config = {}) {
        return axios.get(url, {
            adapter: axiosGmxhrAdapter,
            ...config
        });
    },

    async post(url, data, config = {}) {
        return axios.post(url, data, {
            adapter: axiosGmxhrAdapter,
            ...config
        });
    },

    isCrawlPage() {
        return window.location.href.endsWith('#/home/crawl');
    }
};

// 核心功能
class CrawlerTools {
    constructor() {
        this.init();
    }

    async init() {
        // 从UserScript元信息中获取版本号
        const version = GM.info.script.version;
        console.log(`%c 泛采系统专业版插件 %c v${version} %c`,
            "background:#5D5D5D; padding:1px; border-radius:3px 0 0 3px; color:#fff",
            "background:#0D7FBF; padding:1px; border-radius:0 3px 3px 0; color:#fff",
            "background:transparent"
        );

        if (window.location.hash.includes('/home/crawl')) {
            // 爬虫管理页面特定功能
            this.bindKeyboardShortcuts();
            this.initThemeSwitch();
            this.initPanelSwitch();
            this.initAutoRefresh();
            this.initValidatorPosition();
            this.initTaskListLimit();
            console.log('爬虫管理页面功能已初始化');
        } else {
            // 在其他页面执行的功能
            this.checkSecurityFeatures();
            this.checkMetaTags();
            console.log('安全特性检查已初始化');
        }
    }

    bindKeyboardShortcuts() {
    // ESC关闭弹窗
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const popups = Array.from(document.getElementsByClassName("popup_hover")).reverse();
                for (const popup of popups) {
                    if (popup.style.display === "") {
                        popup.querySelector(".popup_head_close_icon")?.click();
                        break;
                    }
                }
            }

            // Ctrl+S保存
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                const saveButton = document.querySelector(".pageDetail_toolBox_item, .planDetail_toolBox_item");
                const buttons = saveButton?.children;
                if (buttons?.length) {
                    buttons[buttons.length - 2].click();
                }
            }
        });
    }

    initThemeSwitch() {
        const head = document.querySelector(".head");
        if (!head) {
            console.log("未找到.head元素，等待DOM加载...");
            setTimeout(() => this.initThemeSwitch(), 1000);
            return;
        }

        // 检查是否已经存在主题切换按钮
        if (document.querySelector('[role="switch_theme_option"]')) {
            console.log("主题切换按钮已存在");
            return;
        }

        const switchHtml = `
            <label for="switch_theme_option" class="nav" style="color:#fff; position:absolute; right:400px;">亮色</label>
            <div class="el-form-item__content" style="margin-left:15px; margin-bottom:2px; position:absolute; right:350px;">
                <div role="switch_theme_option" aria-checked="true" class="el-switch is-checked">
                    <input type="checkbox" name="" true-value="true" class="el-switch__input">
                    <span class="el-switch__core" style="width:40px;"></span>
                </div>
            </div>
        `;

        const switchWrapper = document.createElement("div");
        switchWrapper.innerHTML = switchHtml;

        // 确保switchWrapper的内容被正确插入
        const fragment = document.createDocumentFragment();
        while (switchWrapper.firstChild) {
            fragment.appendChild(switchWrapper.firstChild);
        }
        head.appendChild(fragment);

        const switchElement = document.querySelector('[role="switch_theme_option"]');
        if (switchElement) {
            switchElement.addEventListener("click", this.toggleTheme.bind(this));
            console.log("主题切换按钮已添加并绑定事件");
        } else {
            console.log("未能找到主题切换按钮元素");
        }
    }

    toggleTheme(e) {
        const isDark = e.currentTarget.classList.contains("is-checked");
        e.currentTarget.classList.toggle("is-checked");

        const html = document.querySelector("html");
        const label = document.querySelector('label[for="switch_theme_option"]');

        if (isDark) {
            html.style = `mix-blend-mode:difference; filter:invert(80%) hue-rotate(0deg) brightness(110%);`;
            ['.cell', 'span', '.iconfont'].forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el.style.color = '#111');
            });
            label.innerText = "暗色";
        } else {
            html.style = "";
            ['.cell', 'span', '.iconfont'].forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el.style.color = '');
            });
            label.innerText = "亮色";
        }
    }

    initPanelSwitch() {
        if (!window.location.hash.includes('/home/crawl')) return;

        const checkAndInitSwitch = () => {
            const head = document.querySelector(".head");
            const button_switch = document.querySelector('div[role="switch_option"]');
            const label_switch = document.querySelector('label[for="switch_option"]');
            const main_box = document.querySelector(".pageDetail_mainBox");

            if (main_box && !button_switch && head) {
                const switch_option = document.createElement("div");
                head.insertBefore(switch_option, head.lastChild);
                switch_option.outerHTML = `
                    <label for="switch_option" class="nav" style="color: #fff;position: absolute;right: 300px;">显示</label>
                    <div class="el-form-item__content" style="margin-left: 15px; margin-bottom: 2px;position: absolute;right: 250px;">
                        <div role="switch_option" aria-checked="true" class="el-switch is-checked">
                            <input type="checkbox" name="" true-value="true" class="el-switch__input">
                            <span class="el-switch__core" style="width: 40px;"></span>
                        </div>
                    </div>
                `;

                const button_switch = document.querySelector('div[role="switch_option"]');
                if (button_switch) {
                    button_switch.addEventListener("click", this.handlePanelSwitch.bind(this));
                }
            }

            if (!main_box && button_switch) {
                button_switch.remove();
                label_switch?.remove();
            }
        };

        // 初始检查并每秒更新
        checkAndInitSwitch();
        setInterval(checkAndInitSwitch, 1000);
    }

    handlePanelSwitch(e) {
        const main_box = document.querySelector(".pageDetail_mainBox");
        const label = document.querySelector('label[for="switch_option"]');
        if (!main_box || !label) return;

        const isChecked = e.currentTarget.classList.contains("is-checked");
        e.currentTarget.classList.toggle("is-checked");

        const display = isChecked ? "none" : "block";
        const text = isChecked ? "隐藏" : "显示";

        // 更新所有子元素的显示状态
        Array.from(main_box.children)
            .slice(0, -2)
            .forEach(child => child.style.display = display);

        label.innerText = text;
    }

    async checkSecurityFeatures() {
        // 检查 Cloudflare
        try {
            const res = await fetch(location.origin + "/cdn-cgi/trace", {
                method: "HEAD",
                mode: "cors",
                credentials: "include"
            });
            if (res.ok) {
                console.log("网站使用了Cloudflare CDN服务");
            }
        } catch (e) {}

        // 检查加速乐
        if (document.cookie.includes('__jsl_clearance_s')) {
            console.log('网站启用了加速乐');
        }

        // 检查robots.txt
        try {
            const robotsRes = await utils.get("/robots.txt");
            if (robotsRes.status === 200) {
                console.log(`发现网站有robots.txt文件: ${robotsRes.request.responseURL}`);
                document.title = "" + document.title;
            }
        } catch (e) {}

        // 检查sitemap.xml
        try {
            const sitemapRes = await utils.get("/sitemap.xml");
            if (sitemapRes.status === 200) {
                console.log(`发现网站有sitemap.xml文件: ${sitemapRes.request.responseURL}`);
                document.title = "" + document.title;
            }
        } catch (e) {}
    }

    initAutoRefresh() {
        setInterval(async () => {
            try {
                const res = await utils.get("/crawl/crawl/get-user-list");
                if (res.status === 200) {
                    document.querySelectorAll(".head").forEach(head => {
                        head.style.backgroundColor = "";
                    });
                    document.title = "爬虫管理系统";
                }

                // 更新描述时间戳
                const descTextarea = document.querySelector('textarea');
                if (descTextarea) {
                    const timestamp = new Date().toLocaleString('sv-SE').replaceAll("/", "-") + '\n';
                    const timePattern = /\d+\-\d+\-\d+\s\d+:\d+:\d+\n/;
                    descTextarea.value = timePattern.test(descTextarea.value)
                        ? descTextarea.value.replace(timePattern, timestamp)
                        : timestamp + descTextarea.value;
                }
            } catch (e) {
                console.error("自动刷新失败:", e);
            }
        }, CONFIG.REFRESH_INTERVAL * 60);
    }

    initValidatorPosition() {
        setInterval(() => {
            const validatorDiv = document.querySelector('.crawl_validatorTable');
            if (validatorDiv && validatorDiv.parentNode.firstChild !== validatorDiv) {
                validatorDiv.parentNode.insertBefore(validatorDiv, validatorDiv.parentNode.firstChild);
            }
        }, CONFIG.REFRESH_INTERVAL);
    }

    // 修改任务列表数量限制
    initTaskListLimit() {
        // 保存原始的XMLHttpRequest.open方法
        const originalOpen = XMLHttpRequest.prototype.open;

        // 重写XMLHttpRequest.open方法
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            // 检查URL是否匹配特定模式
            if (url.includes("/crawl/crawl/plan-task-select/") && url.includes("limit=10")) {
                // 将limit参数从10修改为100
                url = url.replace("limit=10", "limit=100");
            }

            // 使用修改后的URL调用原始的open方法
            originalOpen.call(this, method, url, async, user, password);
        };
    }

    // 检测页面meta标签
    checkMetaTags() {
        const title = window.document.title;
        const metaTags = {
            "ArticleTitle": './/*[@name="ArticleTitle"]/@content',
            "PubDate": './/*[translate(@name, "PUBDATE", "pubdate")="pubdate" and contains(@content, "20")]/@content',
            "ColumnName": './/*[translate(@name, "COLUMNNAME", "columnname")="columnname"]/@content',
            "ContentSource": './/*[translate(@name, "CONTENTSOURCE", "contentsource")="contentsource"]/@content',
            "Author": './/*[translate(@name, "AUTHOR", "author")="author"]/@content',
            "Keywords": './/*[translate(@name, "KEYWORDS", "keywords")="keywords"]/@content'
        };

        // 检查常规meta标签
        for (const [tag, xpath] of Object.entries(metaTags)) {
            const elements = document.getElementsByName(tag) || document.getElementsByName(tag.toLowerCase());
            if (elements.length || (tag === "PubDate" && document.getElementsByName("pubdate").length)) {
                console.log(xpath);
                if (tag === "ArticleTitle") {
                    window.document.title = "❤️" + window.document.title;
                    this.startTitleAnimation("❤️", "🔔", title, 600);
                }
            }
        }

        // 检查WordPress日期meta标签
        const metaPubDates = document.querySelectorAll('meta[content^="202"]');
        if (metaPubDates.length > 0) {
            metaPubDates.forEach((meta, index) => {
                console.log(`带有时间格式的meta标签${index + 1}:`, meta);

                if (meta.property?.startsWith("article:")) {
                    window.document.title = "💚" + window.document.title;
                    this.startTitleAnimation("💚", "🔔", title, 600);
                    console.log('.//*[contains(@property, "article:published")]/@content');
                }
            });
        }
    }

    // 标题动画辅助函数
    startTitleAnimation(emoji1, emoji2, baseTitle, interval) {
        let isFirstEmoji = true;
        const updateTitle = () => {
            window.document.title = isFirstEmoji ? emoji1 + baseTitle : emoji2 + baseTitle;
            isFirstEmoji = !isFirstEmoji;
        };

        updateTitle(); // 立即执行一次
        return setInterval(updateTitle, interval);
    }
}

// 初始化
async function toCrawl() {
    window.location = window.location.origin + "/#/home/crawl";
}

// 启动脚本
(async function main() {
    try {
        new CrawlerTools();
        CONFIG.MENU_ITEMS.forEach(item => {
            GM.registerMenuCommand(item.name, item.fn, item.accessKey);
        });
    } catch (e) {
        console.error("脚本初始化失败:", e);
    }
})();