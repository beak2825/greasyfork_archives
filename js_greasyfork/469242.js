// ==UserScript==
// @name         BiliTab
// @name:zh-CN   B 站视频后台标签页打开
// @namespace    https://github.com/dcjanus/userscripts
// @description  支持打开 B 站视频到后台新标签页，而不是打断当前浏览的页面
// @author       DCjanus
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @version      20230630
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/469242/BiliTab.user.js
// @updateURL https://update.greasyfork.org/scripts/469242/BiliTab.meta.js
// ==/UserScript==
'use strict';

const MENU_VALUE_PREFIX = 'bool_menu_value_for_';
const MENU_ID_LIST_KEY = 'bool_menu_id_list';
const PROCESSED_ATTR = 'x-bili-tab-processed';
const ACTIVE_CLASS = 'x-bili-tab-active';
const SCRIPT_NAME = GM_info.script.name;

class Page {
    constructor(object) {
        this.name = object.name;
        this.key = object.key;
        this.selector = object.selector;
        this.page_match = object.page_match;
        this.default_enable = object.default_enable;
    }

    refresh_menu() {
        const menu_value_key = MENU_VALUE_PREFIX + this.key;

        const enabled = this.enabled();

        const menu_icon = enabled ? '✅' : '❌';
        const menu_name = `${menu_icon} ${this.name} 点击切换`;
        registerMenuCommand(menu_name, () => {
            GM_setValue(menu_value_key, !enabled);
            refresh_menus();
        });
    }

    attach() {
        const url = new URL(window.location.href);
        if (!this.page_match(url)) {
            return;
        }
        this.on_page(); // 首次进入页面时执行一次
        setInterval(this.on_page.bind(this), 500);
    }

    on_page() {
        const elements = document.querySelectorAll(this.selector);
        for (const element of elements) {
            set_background_click(element, this.key, this.default_enable);
        }
        if (elements.length > 0) {
            console.log(`[${SCRIPT_NAME}] ${elements.length} 个链接已处理`);
        }
    }

    enabled() {
        return GM_getValue(MENU_VALUE_PREFIX + this.key, this.default_enable);
    }
}

const PAGES = [
    new Page({
        name: 'B 站首页',
        key: 'bili_home',
        selector: `div.bili-video-card a[href*="//www.bilibili.com/video/"]:not([${PROCESSED_ATTR}="true"])`,
        page_match: (url) =>
            url.host === 'www.bilibili.com' && url.pathname === '/',
        default_enable: true,
    }),
    new Page({
        name: 'B 站动态',
        key: 'bili_activity',
        selector: `a.bili-dyn-card-video[href*="//www.bilibili.com/video/"]:not([${PROCESSED_ATTR}="true"])`,
        page_match: (url) => url.host === 't.bilibili.com',
        default_enable: true,
    }),
    new Page({
        name: 'B 站空间页',
        key: 'bili_space',
        selector: `a.cover[href*="//www.bilibili.com/video/"]:not([${PROCESSED_ATTR}="true"])`,
        page_match: (url) => url.host === 'space.bilibili.com',
        default_enable: true,
    }),
];

function refresh_menus() {
    cleanAllMenu();
    // TODO: 现有菜单点击开关的体验不是很好，切换成点击菜单时弹出对话框选择开关
    for (const page of PAGES) {
        page.refresh_menu();
    }

    registerMenuCommand('🗑️重置所有设置', () => {
        cleanAllMenu();
        for (const key of GM_listValues()) {
            GM_deleteValue(key);
        }
        refresh_menus();
    });
}

function set_background_click(old_element, page_name, default_enable) {
    const new_element = old_element.cloneNode(false);
    for (const child of old_element.childNodes) {
        // 避免影响子元素的事件绑定
        new_element.appendChild(child);
    }
    old_element.parentNode.replaceChild(new_element, old_element);

    new_element.setAttribute('target', '_blank');
    new_element.addEventListener('click', (event) => {
        event.preventDefault();

        // 增加点击后的交互效果，因为不够精通 CSS，所以靠简单的 定时器 + class 来实现
        new_element.classList.add(ACTIVE_CLASS);
        setTimeout(() => new_element.classList.remove(ACTIVE_CLASS), 50);

        const tmp_ele = document.createElement('a');
        tmp_ele.href = new_element.href;
        tmp_ele.target = '_blank';

        // 如果用户按下了 Ctrl 键或者 Command 键，默认行为是在后台标签页打开
        let background_open = event.ctrlKey || event.metaKey;

        // 为了保证切换开关后对当前页面立即生效，这里直接读取开关值
        const enable = GM_getValue(
            MENU_VALUE_PREFIX + page_name,
            default_enable,
        );
        if (enable) {
            // 如果当前开关打开，则反转默认行为
            background_open = !background_open;
        }

        const mouse_event = new MouseEvent('click', {
            ctrlKey: background_open, // for Windows and Linux
            metaKey: background_open, // for Mac OS
        });
        tmp_ele.dispatchEvent(new MouseEvent('click', mouse_event));
    });
    new_element.setAttribute(PROCESSED_ATTR, 'true');
}

function registerMenuCommand(name, callback, accessKey) {
    const menu_id = GM_registerMenuCommand(name, callback, accessKey);
    const current = GM_getValue(MENU_ID_LIST_KEY, []);
    current.push(menu_id);
    GM_setValue(MENU_ID_LIST_KEY, current);
}

function cleanAllMenu() {
    const current = GM_getValue(MENU_ID_LIST_KEY, []);
    for (const menu_id of current) {
        GM_unregisterMenuCommand(menu_id);
    }
    GM_deleteValue(MENU_ID_LIST_KEY);
}

function injectStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
        .${ACTIVE_CLASS} {
            filter: brightness(95%);
        }
    `;
    document.head.appendChild(style);
}

function main() {
    injectStyle();
    refresh_menus();
    const url = new URL(window.location.href);
    for (const page of PAGES) {
        if (page.page_match(url)) {
            page.attach();
        }
    }
}

try {
    main();
} catch (e) {
    console.error(`[${SCRIPT_NAME}] ${e}`);
}
