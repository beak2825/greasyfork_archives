// ==UserScript==
// @name         shire helper
// @namespace    https://greasyfork.org/zh-CN/scripts/461311-shire-helper
// @version      1.0.12.3
// @description  Download shire thread content.
// @author       80824
// @match        https://www.shireyishunjian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shireyishunjian.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_deleteValue
// @grant        GM.listValues
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.download
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/loglevel/1.9.2/loglevel.min.js

// @downloadURL https://update.greasyfork.org/scripts/461311/shire%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461311/shire%20helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================================================================================
    // 高频工具
    // ========================================================================================================
    const qS = (selector, scope = document) => scope.querySelector(selector);
    const qSA = (selector, scope = document) => scope.querySelectorAll(selector);
    const docre = tag => document.createElement(tag);
    String.prototype.parseURL = function () {
        const url = new URL(this);
        let obj = { hostname: url.hostname, hash: url.hash, pathname: url.pathname };
        obj.loc = obj.pathname?.match(/([^\/]+)\.[^\.]*/)?.at(1);
        for (let [k, v] of url.searchParams.entries()) {
            obj[k] = v;
        }
        return obj;
    };

    // ========================================================================================================
    // 初始化设置
    // ========================================================================================================
    const helper_default_setting = {
        // 消息通知设置
        enable_notification: true,
        max_noti_threads: 3,
        important_fids: ['78'],
        // 历史记录设置
        enable_history: true,
        max_history: 100,
        // 下载设置
        enable_text_download: true,
        enable_postfile_download: true,
        enable_attach_download: true,
        enable_op_download: true,
        files_pack_mode: 'all',
        default_merge_mode: 'main',
        // 自动回复设置
        enable_auto_reply: false,
        auto_reply_message: '感谢分享！',
        // 自动换行设置
        enable_auto_wrap: false,
        min_wrap_length: 100,
        typical_wrap_length: 200,
        max_wrap_length: 300,
        wrap_dot: '.。？?!！',
        wrap_comma: ',，、;；',
        // 代表作设置
        data_cache_time: 168 * 3600 * 1000, // 7天
        masterpiece_num: 10,
        default_masterpiece_sort: 'view',
        // 屏蔽词设置
        enable_block_keyword: false,
        block_keywords: [],
        // 黑名单设置
        enable_blacklist: false,
        blacklist: [],
    };

    const hs = GM_getValue('helper_setting', {});
    let default_updated = false;
    for (let key in helper_default_setting) {
        if (!(key in hs)) {
            hs[key] = helper_default_setting[key];
            log.info(`Setting ${key} not found, set to default value.`);
            default_updated = true;
        }
    }
    if (default_updated) {
        GM.setValue('helper_setting', hs);
    }

    // ========================================================================================================
    // 判断脚本启用条件
    // ========================================================================================================
    const location_params = document.URL.parseURL();
    log.log('Location params:', location_params);

    const is_desktop = location_params.mobile == 'no' || Array.from(qSA('meta')).some(meta => meta.getAttribute('http-equiv') === 'X-UA-Compatible');
    if (location_params.loc != undefined && !is_desktop) {
        log.info('Mobile version detected, shire-helper disabled.');
        return;
    }

    // ========================================================================================================
    // 常量
    // ========================================================================================================
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/125.0.0.0';
    const large_page_num = 1024;
    const magic_num = Math.sqrt(large_page_num);
    const MIME_type_map = {
        'image/jpeg': 'jpg',
        'image/bmp': 'bmp',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'video/x-msvideo': 'avi',
        'video/x-matroska': 'mkv',
        'video/x-flv': 'flv',
        'video/mpeg': 'mpg',
        'video/quicktime': 'mov',
        'audio/mp3': 'mp3',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'audio/wave': 'wav',
        'audio/x-wav': 'wav',
        'text/plain': 'txt'
    };

    // ========================================================================================================
    // 通用工具
    // ========================================================================================================
    const decimalCeil = (num, precision = 4) => Math.ceil(num * Math.pow(10, precision)) / Math.pow(10, precision);
    const commonPrefix = ((str1, str2) => {
        [str1, str2] = [str1, str2].map(str => str.replaceAll(/[\s\n\r]/g, '').replaceAll(/[（《\[\{\(\<]/g, '【').replaceAll(/[）》\]\}\)\>]/g, '】'));
        return str1 === '' ? str2 : (str2 === '' ? str1 : (() => {
            let i = 0;
            while (i < str1.length && i < str2.length && str1[i] === str2[i]) i++;
            return str1.slice(0, i);
        })());
    });
    const startWithChinese = str => /^[\p{Script=Han}]/u.test(str);
    const extractFileAndExt = str => {
        const exts = Array.from(Object.values(MIME_type_map)).join('|');
        const regex = new RegExp(`([^\\/]+)\\.(${exts})$`, 'i');
        const match = str.match(regex);
        return match ? [match[1], match[2]] : [str, ''];
    };
    const timeAgo = timestamp => {
        const diff = Date.now() - timestamp;
        const units = [
            { info: '年前', dt: 365 * 24 * 60 * 60 * 1000 },
            { info: '个月前', dt: 30 * 24 * 60 * 60 * 1000 },
            { info: '天前', dt: 24 * 60 * 60 * 1000 },
            // { info: '小时前', dt: 60 * 60 * 1000 },
            // { info: '分钟前', dt: 60 * 1000, bound: 5 * 60 * 1000 }
        ];
        const unit = units.find(({ dt, bound }) => diff >= bound ?? dt); // 如果有bound则以bound为界限，否则以dt为界限
        return unit ? `${Math.floor(diff / unit.dt)}${unit.info}` : '今天内';
    };

    const checkVariableDefined = (variable_name, timeout = 15000, time_interval = 100) => new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            if (typeof unsafeWindow[variable_name] !== 'undefined') {
                resolve(unsafeWindow[variable_name]);
            } else if (Date.now() - startTime >= timeout) {
                reject(new Error(`Check ${variable_name} timeout exceeded`));
            } else {
                setTimeout(check, time_interval);
            }
        }

        check();
    });

    const executeIfLoctionMatch = (func, params) => {
        const matchFunc = ([k, v]) => {
            const loc_v = location_params[k] == '' ? undefined : location_params[k];
            return Array.isArray(v) ? v.includes(loc_v) : v == loc_v
        };
        if (Object.entries(params).every(matchFunc)) {
            func();
        }
    };

    // ========================================================================================================
    // GM Value 工具
    // ========================================================================================================
    function updateListElements(list, elem, status, equal = (a, b) => a == b) {
        // 根据equal判断独立elem，根据status判断新list中是否有elem
        if (status && !list.some(e => equal(e, elem))) { // 存入元素
            list.push(elem);
        }
        if (list.some(e => equal(e, elem))) {
            const new_list = list.filter(e => !equal(e, elem)); // 删除元素
            list.length = 0;
            list.push(...new_list);
            if (status) {
                list.push(elem); // 更新元素
            }
        }
        return list;
    }

    function updateGMList(list_name, list) {
        if (list.length == 0) {
            GM.deleteValue(list_name);
        }
        else {
            GM.setValue(list_name, list);
        }
    }

    // ========================================================================================================
    // 自定义表情
    // ========================================================================================================
    // const original_smilies_types = ['4'];
    // const new_smilies = [];
    // Element：{name:name, type:type, path:path, info:[[id, smile_code, file_name, width, height, weight]]}
    // Test images: 'data/attachment/album/202207/04/192158kg0urgxtw2805yrs.png','static/image/smiley/ali/1love1.gif',''https://p.upyun.com/demo/webp/webp/animated-gif-0.webp'

    // ========================================================================================================
    // 自定义样式
    // ========================================================================================================

    // 设置弹窗框架
    GM_addStyle(`
            #helper-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50%;
                min-width: 600px;
                min-height: 300px;
                max-height: 85%;
                background-color: white;
                color: black !important;
                border: 1px solid #ccc;
                z-index: 2000;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #helper-title-container {
                display: flex;
                align-items: center;
                padding: 20px;
                font-size: 1.5rem;
                font-weight: bold;
                text-align: left;
                border-bottom: 1px solid #ccc;
            }

            #helper-title {
                flex: 1;
            }

            #helper-content-container {
                display: flex;
                flex: 1;
                overflow: hidden;
                background-color: inherit;
            }

            #helper-tab-btn-container {
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
            }

            #helper-tab-content-container {
                flex: 1;
                padding: 10px;
                font-size: 0.75rem;
            }`);

    // 消息弹窗
    GM_addStyle(`
            #helper-notification-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 35%;
                min-width: 300px;
                max-height: 80%;
                background-color: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 10000;
            }

            .helper-noti-message {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
            }`);

    // 弹窗关闭按钮
    GM_addStyle(`
            .helper-close-btn {
                border: none;
                cursor: pointer;
                margin-left: 10px;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                transition: background-color 0.3s;
            }

            .helper-close-btn {
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>');
            }

            .helper-close-btn.helper-redx {
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>');
            }

            .helper-close-btn:hover {
                background-color: #ddd;
            }`);

    // 蒙版与加载动画
    GM_addStyle(`
            #helper-loading-overlay{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 3000;
            }

            #helper-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            #helper-overlay.helper-redirect-layer{
                cursor: pointer;
                background-color: transparent;
            }

            #helper-overlay.helper-shield-layer{
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
            }

            .helper-spinner {
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }`);

    // 顶部进度条
    GM_addStyle(`
            #helper-top-progressbar-container {
                position: fixed;
                top: 0;
                width: 100%;
                background-color: #eee;
                z-index: 3000;
            }

            #helper-top-progressbar {
                height: 5px;
                background-color: #4caf50;
                width: 0%;
                transition: width 0.5s ease-in-out
            }`);

    // 开关控件
    GM_addStyle(`
            label:has(> .helper-toggle-switch) > input {
                display: none;
            }

            .helper-toggle-switch {
                position: relative;
                display: inline-block;
                width: 32px;
                background-color: #ddd;
                transition: background-color 0.3s;
            }

            .helper-toggle-switch::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 12px;
                height: 12px;
                background-color: white;
                border-radius: 50%;
                transition: transform 0.3s;
            }

            label:has(> .helper-toggle-switch) > input:checked + .helper-toggle-switch {
                background-color: #4caf50;
            }

            label:has(> .helper-toggle-switch) > input:checked + .helper-toggle-switch::after {
                transform: translateX(15px);
            }`);

    // 下拉控件
    GM_addStyle(`
            .helper-select {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>')
                no-repeat right 10px center;
                background-color: inherit;
                color: inherit;
                border: 1px solid #ccc;
                padding: 0 30px 0 10px;
                width: max-content;
                transition: background-color 0.3s, border-color 0.3s;
                cursor: pointer;
                outline: none;
            }

            .helper-select:focus {
                background-color: #ddd;
                border-color: #ccc;
            }`);

    // 多选控件
    GM_addStyle(`
            .helper-multicheck-container {
                display: flex;
                border: 1px solid #ccc;
                box-sizing: border-box;
                overflow: hidden;
            }

            .helper-multicheck-item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.3s;
                position: relative;
            }

            .helper-multicheck-item:not(:first-child)::before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 1px;
                background-color: #eee;
            }

            .helper-multicheck-item:not(:first-child) {
                padding-left: 1px;
            }

            .helper-multicheck-item:not(:last-child)::before {
                display: block;
            }

            .helper-multicheck-item input[type="checkbox"] {
                position: absolute;
                opacity: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                cursor: pointer;
            }

            .helper-multicheck-item input[type="checkbox"]:checked + .helper-multicheck-text {
                background-color: #4caf50;
            }

            .helper-multicheck-item .helper-multicheck-text {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 0 10px;
                background-color: inherit;
                border: 1px solid transparent;
                transition: background-color 0.3s;
                box-sizing: border-box;
                white-space: nowrap;
            }`);

    // 单行输入控件
    GM_addStyle(`
            .helper-input {
                width: 80%;
                height: 2em;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding-left: 5px;
                margin-left: 5px;
            }`);

    // 标签控件
    GM_addStyle(`
            .helper-tag-container {
                display: flex;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .helper-tag {
                background-color: #d2553d;
                color: white;
                padding: 2px 5px 2px 10px;
                margin: 5px;
                border-radius: 20px;
                display: flex;
                align-items: center;
            }

            .helper-tag .helper-tag-remove-btn {
                background-color: transparent;
                border: none;
                color: white;
                margin-left: 5px;
                cursor: pointer;
            }`);

    // 执行按钮控件
    GM_addStyle(`
            .helper-setting-button {
                padding: 0 20px;
                background-color: inherit;
                color: inherit;
                border: 1px solid #ccc;
                cursor: pointer;
                transition: background-color 0.3s;
            }`);

    // 关注、屏蔽按钮控件
    GM_addStyle(`
            .helper-f-button,
            .helper-b-button {
                padding: 2px;
                width: 5.5rem;
                cursor: pointer;
                border: none;
                border-radius: 8px;
                color: white;
                transition: background-color 0.3s ease;
            }

            .helper-b-button {
                background-color: #d2553d;
            }

            .helper-b-button::before {
                content: '已屏蔽';
            }

            .helper-f-button:not([data-hfb-followed]) {
                background-color: #1772f6;
            }

            .helper-f-button:not([data-hfb-followed]):hover {
                background-color: #0063e6;
            }

            .helper-f-button[data-hfb-followed] {
                background-color: #8491a5;
            }

            .helper-f-button[data-hfb-followed]:hover {
                background-color: #758195;
            }

            .helper-f-button.hfb-normal:not([data-hfb-followed])::before {
                content: '关注';
            }

            .helper-f-button.hfb-special:not([data-hfb-followed])::before {
                content: '特别关注';
            }

            .helper-f-button.hfb-thread:not([data-hfb-followed])::before {
                content: '在本帖关注';
            }

            .helper-f-button.hfb-normal[data-hfb-followed]::before {
                content: '已关注';
            }

            .helper-f-button.hfb-normal[data-hfb-followed]:hover::before {
                content: '取消关注';
            }

            .helper-f-button.hfb-special[data-hfb-followed]::before {
                content: '已特关';
            }

            .helper-f-button.hfb-special[data-hfb-followed]:hover::before {
                content: '取消特关';
            }

            .helper-f-button.hfb-thread[data-hfb-followed]::before {
                content: '已在本帖关注';
            }

            .helper-f-button.hfb-thread[data-hfb-followed]:hover::before {
                content: '在本帖取关';
            }`);

    // 复选框控件
    GM_addStyle(`
            .helper-checkbox {
                appearance: none;
                width: 10px;
                height: 10px;
                border: 1px solid black;
                background-color: transparent;
                display: inline-block;
                position: relative;
                margin-right: 5px;
                cursor: pointer;
            }

            .helper-checkbox:before {
                content: '';
                background-color: black;
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                width: 5px;
                height: 5px;
                transition: all 0.1s ease-in-out;
            }

            .helper-checkbox:checked:before {
                transform: translate(-50%, -50%) scale(1);
            }

            .helper-checkbox-label {
                color: black;
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
            }`);

    // 控件通用样式
    GM_addStyle(`
            .helper-active-component {
                height: 32px;
                border-radius: 32px;
            }

            .helper-halfheight-active-component {
                height: 16px;
                border-radius: 16px;
            }`);

    // 弹窗表格
    GM_addStyle(`
            .helper-popup-table {
                width: 100%;
                height: 100%;
                border-collapse: collapse;
            }

            .helper-scroll-component:has(> .helper-popup-table) {
                padding-top: 0 !important;
            }

            .helper-popup-table th,
            .helper-popup-table td {
                padding: 8px;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 10rem;
            }

            .helper-sticky-header {
                position: sticky;
                top: 0px;
                padding-top: 10px;
                background-color: white;
            }

            th.helper-sortby::after {
                content: '▼';
            }`);

    // 弹窗表格中复用移动版主题span
    GM_addStyle(`
            .helper-popup-table .micon{
                background-color: #6db1d5;
                color: white;
                padding: 1px;
                margin-right: 3px;
                border-radius: 2px;
                overflow: hidden;
            }

            .helper-popup-table .top{
                background-color: #ff9900;
            }

            .helper-popup-table .lock{
                background-color: #ff5656;
            }

            .helper-popup-table .digest{
                background-color: #b3cc0d;
            }`);

    // 其它弹窗样式
    GM_addStyle(`
            .helper-hr {
                margin: 0;
                border: 0;
                border-top: 1px solid #ccc;
            }

            .helper-scroll-component {
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #888 #eee;
            }

            .helper-tab-btn {
                padding: 10px;
                border: none;
                background-color: transparent;
                color: inherit;
                cursor: pointer;
                text-align: center;
                font-size: 0.75rem;
                font-weight: 500;
                margin: 5px;
                border-radius: 12px;
                transition: background-color 0.3s;
                white-space: nowrap;
            }

            .helper-tab-selected {
                background-color: #ddd;
            }

            div.helper-center-message {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                padding: 0;
            }

            .helper-footnote {
                position: absolute;
                bottom: 2px;
                left: 5px;
                font-size: 70%;
                color: #ccc;
                background-color: inherit;
            }

            .helper-setting-container {
                display: flex;
                min-height: 36px;
                justify-content: space-between;
                align-items: center;
                padding: 5px;
            }

            div:has(> .helper-setting-container) .helper-setting-container:not(:last-of-type) {
                border-bottom: 1px solid #ccc;
            }`);



    // 其它样式
    GM_addStyle(`
            .helper-ellip-link {
                display: inline-block;
                color: #004e83 !important;
                overflow: hidden;
                max-width: calc(min(70%, 30rem));
                text-overflow: ellipsis;
                vertical-align: top;
            }`);

    // ========================================================================================================
    // 获取页面信息
    // ========================================================================================================
    function hasReadPermission(doc = document) {
        return !Boolean(qS('#messagetext', doc));
    }

    function isLogged() {
        return document.cookie.split(';').some(e => /_lastcheckfeed=\d+/.test(e));
    }

    function isFirstPage(URL_params) {
        const page = URL_params.page;
        return !Boolean(page) || page == 1;
    }

    function getPostId(post) { return post.id.slice(3); }

    function getPostsInPage(page_doc = document) { return qSA('[id^=pid]', page_doc); }

    function getPostInfo(post) {
        const post_id = getPostId(post);
        const post_URL = qS(`#postnum${post_id}`, post).href;
        const post_URL_params = post_URL.parseURL();
        const thread_id = post_URL_params.ptid;
        const post_auth = qS('#favatar' + post_id + ' > div.pi > div > a', post).text;
        const post_auth_id = qS('#favatar' + post_id + ' > div.pi > div > a', post).href.parseURL().uid;
        const sub_time = qS('[id^=authorposton]', post).textContent;

        return { post_id, thread_id, post_auth, post_auth_id, sub_time, post_URL };
    }

    function getFirstFloorAuthorInfo(page_doc = document) {
        const first_post_info = getPostInfo(qS('#postlist > div > table'), page_doc);
        return { name: first_post_info.post_auth, uid: first_post_info.post_auth_id };
    }

    function theOnlyAuthorInfo(page_doc = document) {
        const specific_authorid = page_doc.original_url.parseURL().authorid;
        const first_floor_author = getFirstFloorAuthorInfo(page_doc);
        return specific_authorid == first_floor_author.uid ? first_floor_author : null;
    }

    async function getThreadAuthorInfo(page_doc = document) {
        const URL_params = page_doc.original_url.parseURL();

        if (isFirstPage(URL_params)) {
            const the_only_author = theOnlyAuthorInfo(page_doc);
            if (!the_only_author) {
                return getFirstFloorAuthorInfo();
            }
            else {
                delete URL_params.authorid;
                const real_first_page = await getPageDocInDomain(URL_params);
                return getThreadAuthorInfo(real_first_page);
            }
        }
        else {
            const thread_auth_name = qS('#tath > a:nth-child(1)').title;
            const thread_auth_id = qS('#tath > a:nth-child(1)').href.parseURL().uid;
            return { name: thread_auth_name, uid: thread_auth_id };
        }
    }

    function getSpaceAuthor(page_doc = document) {
        const URL_params = page_doc.original_url.parseURL();

        if (typeof URL_params.do === 'undefined') {
            return qS('meta[name="keywords"]', page_doc).content.slice(0, -3);
        }
        else {
            const author_name = qS('#pcd > div > div > h2 > a', page_doc);
            return author_name ? author_name.textContent : '';
        }
    };

    async function getThreadPopularity(tid) {
        const page_doc = await getPageDocInDomain({ loc: 'forum', mod: 'viewthread', tid, mobile: '2' }, mobileUA);
        const views = Number(qS('i.dm-eye', qS('ul.authi', page_doc)).nextSibling.textContent);
        const replies = Number(qS('i.dm-chat-s', qS('ul.authi', page_doc)).nextSibling.textContent);
        const favs = Number(qS('#forum > div.foot.foot_reply.flex-box.cl > a:nth-child(2)', page_doc).textContent.slice(0, -2));
        const shares = Number(qS('#forum > div.foot.foot_reply.flex-box.cl > a:nth-child(3)', page_doc).textContent.slice(0, -2));
        return { views, replies, favs, shares };
    }

    // ========================================================================================================
    // 获取页面内容
    // ========================================================================================================
    function createURLInDomain(params) {
        if (!'loc' in params) {
            return;
        }
        let url = `https://${location.host}/main/${params.loc}.php?`;
        delete params.loc;
        for (let [key, value] of Object.entries(params)) {
            url += `${key}=${value}&`;
        }
        return url;
    }

    async function getPageDocInDomain(params, UA = null) {
        const url = createURLInDomain(params);
        if (UA === null) {
            const response = await fetch(url);
            let page_doc = new DOMParser().parseFromString(await response.text(), 'text/html');
            page_doc.original_url = url;
            return page_doc;
        }
        else {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'User-Agent': UA },
                    onload: response => {
                        let page_doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        page_doc.original_url = url;
                        resolve(page_doc);
                    }
                });
            });
        }
    }

    function formatPostNodeText(node) {
        let text = '';
        switch (node.tagName + '.' + node.className) {
            case 'STYLE.':
            case 'SCRIPT.':
            case 'TABLE.op':
            case 'IGNORE_JS_OP.':
                break;
            case 'DIV.quote':
                text += '<<<\n';
                let quote_href = qS('td > div > blockquote > font > a', node);
                if (quote_href) {
                    let origin_quote = quote_href.innerText;
                    quote_href.innerText += ` PID:${quote_href.href.parseURL().pid}`;
                    text += node.textContent + '\n';
                    quote_href.innerText = origin_quote;
                }
                else {
                    text += node.textContent + '\n'
                }
                text += '>>>\n';
                break;
            case 'HR.l':
                text += '++++++++\n';
                break;
            default:
                text += node.textContent;
        }
        return text;
    }

    function getPostContent(pid, page_doc = document) {
        const post = qS('#post_' + pid, page_doc);

        const tf = qS('#postmessage_' + pid, post);
        let children_nodes = tf.childNodes;
        let text = '';
        for (let child of children_nodes) {
            text += formatPostNodeText(child);
        }

        let post_file = [];
        qSA('ignore_js_op', tf).forEach(node => {
            for (let a of qSA('a', node)) {
                if (a.href.includes('mod=attachment&aid=')) {
                    let title, ext;
                    if (a.innerText == '下载附件') {
                        [title, ext] = extractFileAndExt(qS('strong', node).innerText);
                    }
                    else {
                        [title, ext] = extractFileAndExt(a.innerText);
                    }

                    if (!startWithChinese(title)) {
                        title = '';
                    }

                    post_file.push({ url: a.href, title, ext });
                    break;
                }
            }
        });

        let attach = [];
        qSA('a[id^=aid]', post).forEach(a => {
            let [title, ext] = extractFileAndExt(a.innerText);
            if (!startWithChinese(title)) {
                title = '';
            }
            attach.push({ url: a.href, title, ext });
        });

        // let image_list = qS('#imagelist_' + pid, post) // 多图
        // if (image_list) {
        //     image_list = qS('div.pattl', post); // 单图
        // }
        // if (image_list) {
        //     image_list = qSA('img', image_list);
        //     for (let i = 0; i < image_list.length; i++) {
        //         const img = image_list[i];
        //         const img_url = img.getAttribute('zoomfile');
        //         let img_title = img.title
        //         if (!startWithChinese(img_title)) {
        //             img_title = '';
        //         }
        //         attach.push({ url: img_url, title: img_title });
        //     }
        // }

        let op_body = qS('[id^="op-"][id$="-body"]', post);
        let op = [];
        if (op_body) {
            const url_list = qSA('a', op_body);
            if (url_list.length > 0) {
                for (let url of url_list) {
                    let [title, ext] = extractFileAndExt(url.innerText);
                    op.push({ url: url.href, title, ext });
                }
            }
        }

        return { text, post_file, attach, op };
    }

    async function getPageContent(page_doc, type = 'main') { // type: main, checked, all
        if (!page_doc.original_url) {
            page_doc.original_url = page_doc.URL;
        }

        const tid = page_doc.original_url.parseURL().tid;
        const title = qS('meta[name="keywords"]', page_doc).content;
        let page_id = page_doc.original_url.parseURL().page;
        if (!page_id) {
            page_id = 1;
        }
        const checked_posts = await GM.getValue(tid + '_checked_posts', []);
        const posts_in_page = getPostsInPage(page_doc);

        let text = '';
        let post_file = [];
        let attach = [];
        let op = [];
        for (let post of posts_in_page) {
            if (type == 'checked') {
                const post_id = getPostId(post);
                if (!checked_posts.includes(post_id)) {
                    continue;
                }
            }
            const post_info = getPostInfo(post);
            const post_content = getPostContent(post_info.post_id, page_doc);

            post_file.push(...post_content.post_file);
            attach.push(...post_content.attach);
            op.push(...post_content.op);

            if (type != 'main') {
                text += '<----------------\n';
            }
            text += `//${post_info.post_auth}(UID: ${post_info.post_auth_id}) ${post_info.sub_time}\n`;
            text += `//PID:${post_info.post_id}\n`;
            text += post_content.text;
            if (type != 'main') {
                text += '\n---------------->\n';
            }

            if (type == 'main') {
                break;
            }
        }
        return { tid, title, page_id, text, post_file, attach, op };
    }

    async function getAllPageContent(tid, authorid = '', type = 'all', progress = null, dt = null) { // type: main, all, checked
        const first_page = await getPageDocInDomain({ loc: 'forum', mod: 'viewthread', tid, authorid });
        const title = qS('meta[name="keywords"]', first_page).content;
        if (!hasReadPermission(first_page)) {
            updateProgressbar(progress, dt);
            return { tid, title, text: '没有阅读权限', attach: [], op: [] };
        }

        if (type == 'main') {
            updateProgressbar(progress, decimalCeil(0.8 * dt));
            const content = await getPageContent(first_page, type);
            updateProgressbar(progress, decimalCeil(0.2 * dt));
            return content;
        }

        const page_num = (qS('#pgt > div > div > label > span', first_page) || { title: '共 1 页' }).title.match(/共 (\d+) 页/)[1];
        const ddt = decimalCeil(dt / page_num);
        updateProgressbar(progress, ddt);

        const promises = [getPageContent(first_page, type)];
        promises.push(...Array.from({ length: page_num - 1 }, async (_, i) => {
            const page = await getPageDocInDomain({ loc: 'forum', mod: 'viewthread', tid, page: i + 2, authorid });
            updateProgressbar(progress, 0.8 * ddt);
            const content = await getPageContent(page, type);
            updateProgressbar(progress, 0.2 * ddt);
            return content;
        }));

        let content_list = await Promise.all(promises);
        content_list.sort((a, b) => a.page_id - b.page_id);

        let text = '';
        let post_file = [];
        let attach = [];
        let op = [];
        content_list.forEach(content => {
            text += content.text + '\n';
            post_file.push(...content.post_file);
            attach.push(...content.attach);
            op.push(...content.op);
        });

        return { tid, title, text, post_file, attach, op };
    }

    // ========================================================================================================
    // 保存与下载
    // ========================================================================================================
    function downloadFromURL(target, zip = null, progress = null, dt = null) {
        // 直接下载或者保存到zip
        // progress={value} 当前进度条百分比
        // dt 完成后增加的进度条百分比
        let { url, title, ext, is_blob } = target;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: response => {
                    if (!ext) {
                        const content_type = response.responseHeaders.match(/Content-Type: (.+)/i);
                        if (content_type && content_type[1]) {
                            ext = MIME_type_map[content_type[1]] || '';
                        }
                    }

                    if (ext != '') {
                        const blob = response.response;
                        if (zip !== null && response.status == 200) {
                            zip.file(`${title}.${ext}`, blob, { binary: true });
                            updateProgressbar(progress, dt);
                        }
                        else {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onload = () => {
                                const a = docre('a');
                                a.download = `${title}.${ext}`;
                                a.href = reader.result;
                                a.click();
                                updateProgressbar(progress, dt);
                            }
                            const revokeURL = () => is_blob ? URL.revokeObjectURL(url) : null;
                            reader.onloadend = revokeURL;
                        }
                        resolve();
                    }
                }
            });
        });
    }

    async function insertZip(target_list, zip, progress = null, dt = null) {
        const calcZipTagrgetFileNum = target_list => {
            if (!target_list.hasOwnProperty('files_num')) {
                target_list.files_num = target_list.reduce((acc, cur) => acc + (cur?.is_dir ? calcZipTagrgetFileNum(cur.files) : 1), 0);
            }
            return target_list.files_num;
        };
        calcZipTagrgetFileNum(target_list);

        const ddt = dt ? dt / target_list.files_num : null;
        for (let target of target_list) {
            if (target?.is_dir) {
                const dir = zip.folder(target.title);
                insertZip(target.files, dir, progress, ddt * target.files_num);
            }
            else {
                await downloadFromURL(target, zip, progress, ddt);
            }
        }
    }

    async function createZipAndDownloadFromURLs(zip_name, target_list, progress = null, dt = null) {
        if (target_list.length == 0) {
            return Promise.resolve();
        }

        if (target_list.length == 1) {
            return downloadFromURL(target_list[0], null, progress, dt);
        }

        const zip = new JSZip();
        await insertZip(target_list, zip, progress, decimalCeil(0.75 * dt));
        return await new Promise(async (resolve, reject) => {
            const content = await zip.generateAsync({ type: 'blob' });
            const a = docre('a');
            a.download = zip_name + '.zip';
            a.href = URL.createObjectURL(content);
            a.click();
            updateProgressbar(progress, decimalCeil(0.25 * dt));
            URL.revokeObjectURL(a.href);
            resolve();
        });
    }

    async function saveFile(filename, text, post_file = [], attach = [], op = []) {
        let download_list = []

        if (hs.enable_text_download) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            download_list.push({ list: [{ url, title: filename, is_blob: true }], name: '正文' });
        }

        if (hs.enable_postfile_download) {
            post_file.forEach((e, i) => {
                if (!e.url.startsWith(location.origin)) {
                    e.url = location.origin + '/main/' + e.url;
                }
                e.title = e.title || `${i + 1}`;
                e.title = `${filename}_${e.title}`;
            });
            download_list.push({ list: post_file, name: '帖内资源' });
        }

        if (hs.enable_attach_download) {
            attach.forEach((e, i) => {
                if (!e.url.startsWith(location.origin)) {
                    e.url = location.origin + '/main/' + e.url;
                }
                e.title = e.title || `${i + 1}`;
                e.title = `${filename}_附${e.title}`;
            });
            download_list.push({ list: attach, name: '附件' });
        }

        if (hs.enable_op_download) {
            download_list.push({ list: op, name: '原创资源保护' });
        }

        download_list = download_list.filter(e => e.list.length > 0);
        if (download_list.length == 0) {
            alert('没有需要保存的内容, 请检查设置.');
            return;
        }

        const top_progressbar = createTopProgressbar();
        let progress = { value: 0, bar: top_progressbar };
        let promises = [];

        switch (hs.files_pack_mode) {
            case 'no': {
                const files_num = download_list.reduce((acc, cur) => acc + cur.list.length, 0);
                const dt = decimalCeil(100 / files_num);
                download_list.forEach(target =>
                    target.list.forEach(e =>
                        promises.push(downloadFromURL(e, null, progress, dt)
                        )));
                break;
            }
            case 'single': {
                const dt = decimalCeil(100 / download_list.length);
                download_list.forEach(target =>
                    promises.push(createZipAndDownloadFromURLs(`${filename}_${target.name}`, target.list, progress, dt)
                    ));
                break;
            }
            case 'all': {
                promises.push(createZipAndDownloadFromURLs(filename, download_list.flatMap(e => e.list), progress, 100));
                break;
            }
        }
    }

    async function saveThread(type = 'main') {
        const thread_id = qS('#postlist > table:nth-child(1) > tbody > tr > td.plc.ptm.pbn.vwthd > span > a').href.parseURL().tid;
        let title_name = qS('#thread_subject').parentNode.textContent.replaceAll('\n', '').replaceAll('[', '【').replaceAll(']', '】');
        let file_info = `Link: ${document.URL}\n****************\n`;

        if (type == 'main') {
            let text = file_info;
            let content = await getPageContent(document, 'main');
            text += content.text;
            await saveFile(title_name, text, content.post_file, content.attach, content.op);
        }
        else {
            if (type == 'checked') {
                const checked_posts = await GM.getValue(thread_id + '_checked_posts', []);
                if (checked_posts.length == 0) {
                    alert('没有需要保存的内容, 请检查设置.');
                    return;
                }
            }

            let filename = title_name;
            let text = file_info;

            const the_only_author = theOnlyAuthorInfo();

            let filename_suffix = '';
            if (the_only_author) {
                filename_suffix = `${the_only_author.name}`;
                if (type == 'checked') {
                    filename_suffix += '节选';
                }
            }
            else {
                if (type == 'all') {
                    filename_suffix = '全帖';
                }
                else if (type == 'checked') {
                    filename_suffix = '节选';
                }
            }
            filename += '（' + filename_suffix + '）';

            const content_list = await getAllPageContent(thread_id, the_only_author ? the_only_author.uid : '', type);
            await saveFile(filename, text + content_list.text, content_list.post_file, content_list.attach, content_list.op);
            if (type == 'checked') {
                GM.deleteValue(thread_id + '_checked_posts');
            }
        }
    }

    async function saveMergedThreads(type = 'main') {
        const uid = location_params.uid;
        let checked_threads = GM_getValue(uid + '_checked_threads', []);

        if (checked_threads.length == 0) {
            alert('没有需要保存的内容, 请检查设置.');
            return;
        }

        const bar = createTopProgressbar();
        const progress = { value: 0, bar };

        if (type == 'main') {
            const dt = decimalCeil(90 / checked_threads.length);
            const promises = checked_threads.map(tid => getAllPageContent(tid, uid, 'main', progress, dt));
            let content_list = await Promise.all(promises);
            content_list = content_list.sort((a, b) => a.tid - b.tid);
            const content = content_list.map(e => e.text).join('\n\n=================\n\n');
            let filename = content_list.reduce((acc, cur) => commonPrefix(acc, cur.title), content_list[0].title);
            filename += '（合集）';
            await downloadFromURL({
                url: URL.createObjectURL(new Blob([content], { type: 'text/plain' })),
                title: filename,
                is_blob: true
            },
                null, progress, 10);
        }
        else {
            const dt = decimalCeil(85 / checked_threads.length);
            const promises = checked_threads.map(tid => getAllPageContent(tid, type == 'author' ? uid : '', type, progress, dt));
            let content_list = await Promise.all(promises);
            let filename = content_list.reduce((acc, cur) => commonPrefix(acc, cur.title), content_list[0].title);
            filename += type == 'author' ? '（合集仅作者）' : '（合集）'
            content_list = content_list.map(e => {
                return {
                    title: e.title,
                    url: URL.createObjectURL(new Blob([e.text], { type: 'text/plain' }))
                }
            });
            createZipAndDownloadFromURLs(filename, content_list, progress, 15);
        }

        await GM.deleteValue(uid + '_checked_threads');
        updatePageDoc();
    }

    // ========================================================================================================
    // 获取用户最新动态
    // ========================================================================================================
    async function getUserNewestPostOrThread(uid, tid, last_tpid = 0) {
        // 返回结构：
        // { new: [{ tid, title, pids: [], fid }], found, last_tpid }
        // 其中对于对于tid=0的情况，pids为undefined; 对于tid!=0的情况，fid为undefined
        if (tid == 0) {
            return getUserNewestThread(uid, last_tpid);
        }
        else if (tid > 0) {
            return getUserNewestPostInThread(uid, tid, last_tpid);
        }
        else if (tid == -1) {
            return getUserNewestReply(uid, last_tpid);
        }
    }

    async function getUserNewestReply(uid, last_pid = 0) {
        // 返回用户空间回复页首页新于last_pid的回复，通过能否在首页查询到不晚于last_pid的回复判断是否可能有更多回复

        const URL_params = { loc: 'home', mod: 'space', uid, do: 'thread', view: 'me', type: 'reply', from: 'space', mobile: '2' };
        const followed_threads = GM_getValue(uid + '_followed_threads', []);
        const follow_tids = followed_threads.map(e => e.tid).filter(e => e > 0);
        const page_doc = await getPageDocInDomain(URL_params, mobileUA);
        const threads_in_page = qSA('#home > div.threadlist.cl > ul > li', page_doc);
        let new_replyed_threads = [];
        let found = false;
        if (threads_in_page.length > 0) {
            for (let thread of threads_in_page) {
                const reply_in_thread = qSA('a', thread);
                const tid = reply_in_thread[0].href.parseURL().ptid;
                const title = qS('em', reply_in_thread[0]).textContent.trim()
                let pids = []
                for (let i = 1; i < reply_in_thread.length; i++) { // index 0 是主题链接
                    const pid = reply_in_thread[i].href.parseURL().pid;
                    if (pid <= last_pid) {
                        found = true;
                        break;
                    }
                    pids.push(pid);
                }
                if (pids.length > 0 && !follow_tids.includes(Number(tid))) {
                    new_replyed_threads.push({ tid, title, pids });
                }
            }
        }
        last_pid = new_replyed_threads.length == 0 ? 1 : new_replyed_threads[0].pids[0]; // last_pid==0代表第一次查询新回复状态，所以完全没有回复的状态只能设为1
        return { 'new': new_replyed_threads, found, last_tpid: last_pid };
    }

    async function getUserNewestThread(uid, last_tid = 0) {
        // 返回用户空间主题页首页新于last_tid的主题，通过能否在首页查询到不晚于last_tid的主题判断是否可能有更多主题

        const URL_params = { loc: 'home', mod: 'space', uid, do: 'thread', view: 'me', from: 'space', mobile: '2' };
        const page_doc = await getPageDocInDomain(URL_params, mobileUA);
        const threads_in_page = qSA('li.list', page_doc);
        let new_threads = [];
        let found = false;
        if (threads_in_page.length > 0) {
            for (let thread of threads_in_page) {
                const thread_title_node = qS('.threadlist_tit', thread);
                const tid = thread_title_node.parentNode.href.parseURL().tid;
                if (tid <= last_tid) {
                    found = true;
                    break;
                }
                const title = qS('em', thread_title_node).textContent;
                const fid = qS('li.mr > a', thread).href.parseURL().fid;
                new_threads.push({ tid, title, fid });
                if (last_tid == 0) {
                    break;
                }
            }
        }
        last_tid = new_threads.length == 0 ? 1 : new_threads[0].tid;
        return { 'new': new_threads, found, 'last_tpid': last_tid }
    }

    async function getUserNewestPostInThread(uid, tid, last_pid = 0) {
        // 返回关注主题只看该作者末页（large_page_num）新于last_pid的回复，通过能否在末页查询到不晚于last_pid的回复判断是否可能有更多回复

        const URL_params = { loc: 'forum', mod: 'viewthread', tid, authorid: uid, page: large_page_num, mobile: '2' };
        const page_doc = await getPageDocInDomain(URL_params, mobileUA);
        const posts_in_page = getPostsInPage(page_doc);
        const thread_title = qS('meta[name="keywords"]', page_doc).content;
        let new_posts = [];
        let found = false;
        let pids = [];
        for (let i = posts_in_page.length - 1; i >= 0; i--) {
            const post = posts_in_page[i];
            const pid = getPostId(post);
            if (pid <= last_pid) {
                found = true;
                break;
            }
            pids.push(pid);
            if (last_pid == 0) {
                break;
            }
        }
        if (pids.length > 0) {
            new_posts.push({ tid, title: thread_title, pids });
        }
        last_pid = new_posts.length == 0 ? 1 : new_posts[0].pids[0]; // last_pid==0代表第一次查询新回复状态，所以完全没有回复的状态只能设为1
        return { new: new_posts, found, last_tpid: last_pid };
    }

    // ========================================================================================================
    // 关注、屏蔽与自动回复
    // ========================================================================================================
    // 根据checkbox的状态更新value对应的数组
    // value/id: tid/pid, uid/tid
    function recordCheckbox(value, id, checked) {
        let checked_list = GM_getValue(value, []);
        id = id.split('_check_')[1];
        updateListElements(checked_list, id, checked);
        updateGMList(value, checked_list);
    }

    // 关注某个用户在某个Thread下的回复
    // 若tid==0，则关注用户的所有主题
    // 若tid==-1, 则关注用户的所有回复
    function recordFollow(info, followed) {
        let followed_threads = GM_getValue(info.uid + '_followed_threads', []);
        updateListElements(followed_threads, { tid: info.tid, title: info.title, last_tpid: 0 }, followed, (a, b) => a.tid == b.tid); // last_tpid==0 表示这是新关注的用户
        updateGMList(info.uid + '_followed_threads', followed_threads);

        let followed_users = GM_getValue('followed_users', []);
        updateListElements(followed_users, { uid: info.uid, name: info.name }, followed_threads.length > 0, (a, b) => a.uid == b.uid);
        updateGMList('followed_users', followed_users);

        let followed_num = GM_getValue('followed_num', 0);
        followed_num += followed ? 1 : -1;
        followed_num = followed_num < 0 ? 0 : followed_num;
        GM.setValue('followed_num', followed_num);
    }

    function blockUser(uid, name) {
        hs.blacklist = updateListElements(hs.blacklist, { uid, name }, true, (a, b) => a.uid == b.uid);
        GM.setValue('helper_setting', hs);
        updateGMList(`${uid}_followed_threads`, []);
        const followed_users = GM_getValue('followed_users', []);
        updateListElements(followed_users, { uid, name }, false, (a, b) => a.uid == b.uid);
        updateGMList('followed_users', followed_users);
    }

    function autoReply(timeout = 2000) {
        const reply_text = hs.auto_reply_message;
        const reply_textarea = qS('#fastpostmessage');
        if (reply_textarea) {
            reply_textarea.value = reply_text;
        }
        const reply_btn = qS('#fastpostsubmit');
        if (reply_btn) {
            setTimeout(() => reply_btn.click(), timeout);
        }
    }


    // ========================================================================================================
    // 修改页面的工具
    // ========================================================================================================
    function setHidden(elem, hidden = true) {
        if (!elem) {
            return;
        }

        if (hidden) {
            elem.style.display = 'none';
        }
        else {
            elem.style.display = '';
        }
    }

    function insertElement(elem, pos, type = 'insertBefore') {
        switch (type) {
            case 'append':
                pos.appendChild(elem);
                break;
            case 'insertBefore':
                pos.parentNode.insertBefore(elem, pos);
                break;
            case 'insertAfter':
                if (pos.nextSibling) {
                    pos.parentNode.insertBefore(elem, pos.nextSibling);
                }
                else {
                    pos.parentNode.appendChild(elem);
                }
                break;
        }
    }

    function insertInteractiveLink(text, func, pos, type = 'append') {
        const a = docre('a');
        a.href = 'javascript:void(0)';
        a.textContent = text;
        if (func instanceof Function) {
            a.addEventListener('click', func);
        }
        insertElement(a, pos, type);
        return a;
    }

    function insertLink(text, URL_params, pos, max_text_length = 0, type = 'append') {
        const a = docre('a');
        if (max_text_length > 0 && text.length > max_text_length) {
            a.text = text.slice(0, max_text_length) + '...';
            a.title = text;
        }
        else {
            a.textContent = text;
        }
        a.href = createURLInDomain(URL_params);
        a.target = '_blank';
        insertElement(a, pos, type);
        return a;
    }

    function createFollowButton(info) {
        // info: { uid, name, tid, title }
        const follow_btn = docre('button');
        const follow_status = GM_getValue(info.uid + '_followed_threads', []);
        const followed = follow_status.some(e => e.tid == info.tid);
        follow_btn.type = 'button';
        follow_btn.className = 'helper-f-button';
        follow_btn.setAttribute('data-hfb-uid', info.uid);
        if (followed) {
            follow_btn.setAttribute('data-hfb-followed', '');
        }

        let follow_type = '';
        switch (info.tid) {
            case -1:
                follow_type = 'hfb-special';
                info.title = '所有回复';
                break;
            case 0:
                follow_type = 'hfb-normal';
                info.title = '所有主题';
                break;
            default:
                follow_type = 'hfb-thread';
        }
        follow_btn.classList.add(follow_type);

        follow_btn.addEventListener('click', async () => {
            const followed_num = GM_getValue('followed_num', 0);
            if (followed_num >= magic_num) {
                alert('关注数已达上限，请清理关注列表.');
                return;
            }
            const follow_status = GM_getValue(info.uid + '_followed_threads', []);
            const followed = follow_status.some(e => e.tid == info.tid);
            qSA(`.${follow_type}[data-hfb-uid='${info.uid}']`).forEach(e => {
                if (followed) {
                    e.removeAttribute('data-hfb-followed');
                }
                else {
                    e.setAttribute('data-hfb-followed', '')
                }
            });
            recordFollow(info, !followed);
            if (info.tid == -1 && !followed) { // 特关同时也关注主题
                recordFollow({ uid: info.uid, name: info.name, tid: 0, title: '所有主题' }, true);
            }
        });

        return follow_btn;
    }

    function addWrapInNode(root, min_wrap_length = hs.min_wrap_length, wrap_length = hs.typical_wrap_length, max_wrap_length = hs.max_wrap_length, dot_char = hs.wrap_dot, comma_char = hs.wrap_comma) {
        const findBreak = text => {
            for (let i = wrap_length; i < Math.min(text.length, max_wrap_length); i++) {
                if (dot_char.includes(text[i])) {
                    return i;
                }
            }
            if (text.length > max_wrap_length) {
                for (let i = max_wrap_length; i < text.length; i++) {
                    if (dot_char.includes(text[i]) || comma_char.includes(text[i])) {
                        return i;
                    }
                }
            }
            return -1;
        };

        let iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, null, false);
        let node = iter.nextNode();
        while (node) {
            let text = node.nodeValue;

            let break_index;
            if (text.length > wrap_length) {
                break_index = findBreak(text);
            }

            if (break_index > 0) {
                let text1 = text.slice(0, break_index + 1);
                let text2 = text.slice(break_index + 1);
                if (text2.trim().length > min_wrap_length) {
                    node.nodeValue = '';
                    let new_node1 = document.createTextNode(text1);
                    let br = docre('br');
                    br.setAttribute('data-hbr', 'auto-wrap');
                    let new_node2 = document.createTextNode(text2);
                    insertElement(new_node2, node, 'insertAfter');
                    insertElement(br, new_node2);
                    insertElement(new_node1, br);
                    let current_node = node;

                    node = iter.nextNode();
                    node = iter.nextNode();
                    node.parentNode.removeChild(current_node);
                    continue;
                }
            }
            node = iter.nextNode();
        }

        iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, { acceptNode: node => node.tagName == 'BR' }, false);
        node = iter.nextNode();
        while (node) {
            let in_multi_br = false;
            let last_in_multi_br = false;
            while (node) {
                if (node.nextSibling) {
                    const next = node.nextSibling;
                    const next_is_br = next.tagName == 'BR';
                    const next_is_space = next.nodeType == Node.TEXT_NODE && next.nodeValue.trim() == '';
                    const next_is_the_end = !next.nextSibling;
                    const nnext_is_br = next?.nextSibling?.tagName == 'BR';
                    const nnext_is_newline = next?.nextSibling?.nodeType == Node.TEXT_NODE && next?.nextSibling?.nodeValue.trim() != '';
                    const nnext_is_newblock = next?.nextSibling?.tagName == 'DIV';
                    in_multi_br = next_is_br || next_is_the_end || next_is_space && (nnext_is_br || nnext_is_newline || nnext_is_newblock);
                    if (in_multi_br) {
                        node = iter.nextNode();
                        last_in_multi_br = true;
                        continue;
                    }
                }
                break;
            }
            if (!in_multi_br && !last_in_multi_br) {
                const br = docre('br');
                br.setAttribute('data-hbr', 'before-single-br');
                insertElement(br, node);
            }
            node = iter.nextNode();
        }

        // 删掉引用中的自动<br>和引用后可能的第一个自动<br>
        qSA('div.quote', root).forEach(e => {
            const brs = qSA('br[data-hbr]', e);
            for (let br of brs) {
                br.parentNode.removeChild(br);
            }
            const next = e.nextElementSibling;
            if (next.getAttribute('data-hbr') == 'before-single-br') {
                next.parentNode.removeChild(next);
            }
        });
    }

    function removeWrapInNode(root) {
        let iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, {
            acceptNode: node => {
                if (node.tagName == 'BR' && node.hasAttribute('data-hbr') && node.getAttribute('data-hbr') == 'before-single-br') {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }, false);
        let node = iter.nextNode();

        while (node) {
            const current = node;
            node = iter.nextNode();
            current.parentNode.removeChild(current);
        }

        iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, {
            acceptNode: node => {
                if (node.tagName == 'BR' && node.hasAttribute('data-hbr') && node.getAttribute('data-hbr') == 'auto-wrap') {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }, false);
        node = iter.nextNode();

        while (node) {
            const next = node.nextSibling;
            const previous = node.previousSibling;
            const current = node;
            node = iter.nextNode();

            previous.nodeValue += next.nodeValue;
            current.parentNode.removeChild(next);
            current.parentNode.removeChild(current);
        }
    }

    // ========================================================================================================
    // 修改页面内容
    // ========================================================================================================
    function insertHelperLink() {
        let target_menu = qS('#myitem')
        if (target_menu) {
            const helper_setting_link = insertInteractiveLink('助手', () => { if (!qS('#helper-popup')) { createHelperPopup() } }, target_menu, 'insertBefore');
            helper_setting_link.id = 'helper_setting';
            const span = docre('span');
            span.textContent = ' | ';
            span.className = 'pipe';
            insertElement(span, target_menu);
            return;
        }

        target_menu = qS('#myspace');
        if (target_menu) {
            target_menu = qS('#myspace')
            insertInteractiveLink('助手', () => { if (!qS('#helper-popup')) { createHelperPopup() } }, target_menu, 'insertBefore');
            return;
        }
    }

    function modifyPostInPage() {
        const tid = location_params.tid;
        const posts_in_page = getPostsInPage();
        const thread_title = qS('#thread_subject').textContent;
        let all_checked = true;

        for (let post of posts_in_page) {
            const post_info = getPostInfo(post);
            const pid = post_info.post_id;
            const uid = post_info.post_auth_id;
            const name = post_info.post_auth;

            const label = docre('label');
            const checkbox = docre('input');
            checkbox.id = 'post_check_' + pid;
            checkbox.className = 'helper-checkbox';
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => { recordCheckbox(`${tid}_checked_posts`, checkbox.id, checkbox.checked) });// 每个Thread设置一个数组，存入被选中的Post的ID
            label.appendChild(checkbox);

            const label_text = document.createTextNode('保存本层');
            label.className = 'helper-checkbox-label o';
            label.appendChild(label_text);


            all_checked = all_checked && checkbox.checked;

            const user_card = qS('tbody > tr:nth-child(1) > td.pls > div', post)

            const profile_card = qS('[id^=userinfo] > div.i.y ', post);
            insertInteractiveLink('代表作', () => createMasterpiecePopup(uid, name), qS('div:first-child', profile_card));

            const post_follow_btn = createFollowButton({ uid, name, tid, title: thread_title });
            post_follow_btn.classList.add('o');
            user_card.appendChild(post_follow_btn);
            user_card.appendChild(label);

            const profile_icon = qS('div.imicn', profile_card);
            profile_icon.appendChild(createFollowButton({ uid, name, tid: 0 }));
            insertInteractiveLink(' 屏蔽用户', () => {
                blockUser(uid, name);
                updatePageDoc();
            }, profile_icon);
        }

        const label = docre('label');
        const label_text = document.createTextNode(all_checked ? '清空全选' : '全选本页');
        label.appendChild(label_text);
        qS('#postlist > table:nth-child(1) > tbody > tr > td.plc.ptm.pbn.vwthd > div').appendChild(label);

        const checkbox = docre('input');
        checkbox.id = 'page_checked_all';
        checkbox.type = 'checkbox';
        checkbox.className = 'helper-checkbox';
        checkbox.style.verticalAlign = 'middle';
        checkbox.checked = all_checked;
        checkbox.addEventListener('change', () => {
            qSA('[id^=post_check_]').forEach(e => e.checked = checkbox.checked);
            label_text.textContent = checkbox.checked ? '清空全选' : '全选本页';
        });
        label.appendChild(checkbox);
    }

    function modifyPostPage() {
        const the_only_author = theOnlyAuthorInfo();

        const saveFunc = (type = 'main') => () => {
            saveThread(type).then(() => {
                if (hs.enable_auto_reply) {
                    autoReply();
                }
            });
        };

        const down_first_link_pos = qS('#postlist > div > table > tbody > tr:nth-child(1) > td.plc > div.pi > strong');
        if (isFirstPage(location_params)) {
            insertInteractiveLink('保存主楼  ', saveFunc(), down_first_link_pos);
        }

        const down_thread_link_pos = qS('#postlist > table:nth-child(1) > tbody > tr > td.plc.ptm.pbn.vwthd > div');
        if (the_only_author) {
            insertInteractiveLink('保存作者  ', saveFunc('all'), down_thread_link_pos);
        }
        else {
            insertInteractiveLink('保存全帖  ', saveFunc('all'), down_thread_link_pos);
        }
        insertInteractiveLink('保存选中  ', saveFunc('checked'), down_thread_link_pos);

        modifyPostInPage();
    }

    function modifySpacePage() {
        const uid = location_params.uid;
        const toptb = qS('#toptb > div.z');
        if (toptb) {
            const name = getSpaceAuthor();
            insertLink(`${name}的主题`, { loc: 'home', mod: 'space', uid, do: 'thread', view: 'me', from: 'space' }, toptb);
            toptb.appendChild(createFollowButton({ uid, name, tid: location_params?.type == 'reply' ? -1 : 0 }));
            // updatePageDoc();
        }

        const addMergedownComponent = () => {
            const pos = qS('#delform > table > tbody > tr.th > th');
            const save_select = docre('select');
            const save_types = ['main', 'all', 'author'];
            const save_types_text = ['主楼（合并）', '全帖（打包）', '作者（打包）'];
            for (let i = 0; i < save_types.length; i++) {
                const option = docre('option');
                option.value = save_types[i];
                option.textContent = save_types_text[i];
                save_select.appendChild(option);
                if (save_types[i] == hs.default_merge_mode) {
                    option.selected = true;
                }
            }

            const save_link = insertInteractiveLink('  下载 ', () => saveMergedThreads(save_select.value), pos);
            save_select.addEventListener('change', () => {
                const new_save_link = save_link.cloneNode(true);
                new_save_link.addEventListener('click', () => {
                    saveMergedThreads(save_select.value);
                });
                save_link.replaceWith(new_save_link);
            });
            save_select.style.display = 'none';

            pos.appendChild(save_select);

            const thread_table = qS('#delform > table > tbody');
            if (qS('.emp', thread_table)) {
                return;
            }

            const thread_in_page = qSA('tr:not(.th)', thread_table);

            for (let thread of thread_in_page) {
                const link = qS('th > a', thread)
                const tid = link.href.parseURL().tid;
                const checkbox = docre('input');
                checkbox.id = 'thread_check_' + tid;
                checkbox.type = 'checkbox';
                checkbox.className = 'pc';

                insertElement(checkbox, link);

                if (qS('td:nth-child(3) > a', thread).textContent == '保密存档') {
                    checkbox.disabled = true;
                    continue;
                }

                checkbox.addEventListener('change', () => { recordCheckbox(`${uid}_checked_threads`, checkbox.id, checkbox.checked) });// 每个用户设置一个数组，存入被选中的thread的ID
            }
        };
        const addMasterpieceComponent = () => {
            const user_name = getSpaceAuthor();
            const header = document.querySelector('#ct > div.mn > div > div.bm_h > h1');
            const masterpiece = docre('span');
            masterpiece.className = 'xs1 xw0';
            const pipe = docre('span');
            pipe.className = 'pipe';
            pipe.textContent = '|';
            masterpiece.appendChild(pipe);
            insertInteractiveLink('代表作', () => createMasterpiecePopup(uid, user_name), masterpiece);
            header.appendChild(masterpiece);
        };
        const addDebugModeComponent = () => {
            const pos = qS('#pcd > div > ul');
            const label = docre('label');
            const checkbox = docre('input');
            checkbox.type = 'checkbox';
            checkbox.checked = hs.enable_debug_mode;
            checkbox.addEventListener('change', () => {
                hs.enable_debug_mode = checkbox.checked;
                hs.enable_debug_mode ? log.setLevel('debug') : log.resetLevel();
                log.info('调试模式已' + (hs.enable_debug_mode ? '开启' : '关闭'));
                GM.setValue('helper_setting', hs);
            });
            const text = document.createTextNode('调试模式');
            label.appendChild(checkbox);
            label.appendChild(text);
            pos.appendChild(label);
        };

        executeIfLoctionMatch(addMergedownComponent, { do: 'thread', type: ['thread', undefined] });
        executeIfLoctionMatch(addMasterpieceComponent, { do: 'thread', view: 'me', from: 'space' });
        executeIfLoctionMatch(addDebugModeComponent, { do: 'wall', uid: GM_info.script.author });
    }

    function modifyIndexPage() {
        setHidden(qS('#logo'));
        setHidden(qS('#desktop'));
        setHidden(qS('#mobile'));
        insertElement(createOverlay('redirect', () => { location.href = 'main' }), qS('#info'), 'insertBefore');
        log.log('Index page modified.');
    }

    function modifyPageDoc() {
        if (hasReadPermission() && isLogged()) {

            executeIfLoctionMatch(modifyIndexPage, { pathname: '/' },);
            executeIfLoctionMatch(modifyPostPage, { loc: 'forum', mod: 'viewthread', 'mobile': ['no', undefined] });
            executeIfLoctionMatch(modifySpacePage, { loc: 'home', mod: 'space', 'mobile': ['no', undefined] });

            updatePageDoc();

            if (hs.enable_notification) {
                updateNotificationPopup();
            }

            insertHelperLink();
        }
    }

    // ========================================================================================================
    // 更新页面内容
    // ========================================================================================================
    function updatePostsStaus() {
        const posts_in_page = getPostsInPage();
        const tid = location_params.tid;

        // 更新自动换行
        for (let post of posts_in_page) {
            if (hs.enable_auto_wrap) {
                const post_content = qS('[id^=postmessage]', post);
                addWrapInNode(post_content);
            }
            else {
                const post_content = qS('[id^=postmessage]', post);
                removeWrapInNode(post_content);
            }
        }

        // 更新“保存本层”复选框
        const checked_posts = GM_getValue(`${tid}_checked_posts`, []);
        qSA('[id^=post_check_]').forEach(e => {
            e.checked = checked_posts.includes(e.id.slice(11));
        });
    }

    function updateForumStaus() {
        qSA('[id^=normalthread]').forEach(thread => {
            const title = qS('a.s.xst', thread).innerText.trim().toLowerCase();
            const uid = qS('td.by cite a', thread).href.parseURL().uid;
            // 屏蔽关键词
            if (hs.enable_block_keyword && hs.block_keywords.some(keyword => title.includes(keyword))) {
                thread.style.display = 'none';
            }
            // 屏蔽用户
            else if (hs.enable_blacklist && hs.blacklist.some(e => e.uid == uid)) {
                thread.style.display = 'none';
            }
            else {
                thread.style.display = '';
            }
        });
    }

    async function updateMergedownStaus() {
        // 更新多选下载复选框
        const checked_threads = await GM.getValue(location_params.uid + '_checked_threads', []);
        qSA('[id^=thread_check_]').forEach(e => {
            e.checked = checked_threads.includes(e.id.slice(13));
        });
    }

    function updateFollowOrBlockButtonsStatus() {
        for (let { uid } of hs.blacklist) {
            qSA(`.helper-f-button[data-hfb-uid='${uid}']`).forEach(e => {
                e.removeAttribute('data-hfb-followed');
                e.classList.remove('helper-f-button');
                e.classList.add('helper-b-button');
                e.replaceWith(e.cloneNode(true));
            });
        }

        qSA('.helper-b-button').forEach(e => {
            if (!hs.blacklist.some(p => p.uid == e.getAttribute('data-hfb-uid'))) {
                e.classList.remove('helper-b-button');
                e.classList.add('helper-f-button');
                e.addEventListener('click', async () => {
                    const followed_num = GM_getValue('followed_num', 0);
                    if (followed_num >= magic_num) {
                        alert('关注数已达上限，请清理关注列表.');
                        return;
                    }
                    const follow_status = GM_getValue(info.uid + '_followed_threads', []);
                    const followed = follow_status.some(e => e.tid == info.tid);
                    qSA(`.${follow_type}[data-hfb-uid='${info.uid}']`).forEach(e => {
                        if (followed) {
                            e.removeAttribute('data-hfb-followed');
                        }
                        else {
                            e.setAttribute('data-hfb-followed', '')
                        }
                    });
                    recordFollow(info, !followed);
                    if (info.tid == -1 && !followed) { // 特关同时也关注主题
                        recordFollow({ uid: info.uid, name: info.name, tid: 0, title: '所有主题' }, true);
                    }
                });
            }
        });
    }

    function updatePageDoc() {
        executeIfLoctionMatch(updatePostsStaus, { loc: 'forum', mod: 'viewthread', 'mobile': ['no', undefined] });
        executeIfLoctionMatch(updateForumStaus, { loc: 'forum', mod: 'forumdisplay', 'mobile': ['no', undefined] });
        executeIfLoctionMatch(updateMergedownStaus, { loc: 'home', mod: 'space', do: 'thread', type: ['thread', undefined], 'mobile': ['no', undefined] });
        updateFollowOrBlockButtonsStatus();
    }

    // ========================================================================================================
    // 浮动弹窗通用工具
    // ========================================================================================================
    function removeHelperPopup() {
        const popup = qS('#helper-popup');
        if (popup) {
            document.body.removeChild(popup);
        }
        const overlay = qS('#helper-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    function createCloseButton(onclick) {
        const close_btn = docre('button');
        close_btn.className = 'helper-close-btn';
        close_btn.type = 'button';
        close_btn.addEventListener('click', onclick);
        return close_btn;
    }

    function createOverlay(type = 'shield', onclick = removeHelperPopup) {
        const overlay = docre('div');
        overlay.id = 'helper-overlay';
        overlay.className = 'helper-' + type + '-layer';
        overlay.addEventListener('click', onclick);
        return overlay;
    }

    function createLoadingOverlay() {
        const overlay = docre('div');
        overlay.id = 'helper-loading-overlay';
        const spiner = docre('div');
        spiner.className = 'helper-spinner';
        overlay.appendChild(spiner);
        return overlay;
    }

    function createPopupWithTitle(title) {
        const popup = docre('div');
        const overlay = createOverlay();
        popup.id = 'helper-popup';

        const helper_title_container = docre('div');
        helper_title_container.id = 'helper-title-container';
        popup.appendChild(helper_title_container);

        const helper_title = docre('div');
        helper_title.id = 'helper-title';
        helper_title.textContent = title;
        helper_title_container.appendChild(helper_title);

        const close_btn = createCloseButton(removeHelperPopup);
        helper_title_container.appendChild(close_btn);

        const hr = docre('hr');
        hr.className = 'helper-hr';
        popup.appendChild(hr);

        const content_container = docre('div');
        content_container.id = 'helper-content-container';
        popup.appendChild(content_container);

        document.body.appendChild(overlay);
        return popup;
    }

    function createCenterMessageDiv(message) {
        const div = docre('div');
        div.className = 'helper-center-message';
        div.textContent = message;
        return div;
    }

    function createTopProgressbar() {
        const container = docre('div');
        container.id = 'helper-top-progressbar-container';
        const progressbar = docre('div');
        progressbar.id = 'helper-top-progressbar';
        container.appendChild(progressbar);

        document.body.appendChild(container);
        return progressbar;
    }

    function updateProgressbar(progress, dt, remove_timeout = 1500) {
        if (progress && dt && dt > 0) {
            progress.value += dt;
            progress.bar.style.width = progress.value + '%';

            if (progress.value >= 100) {
                setTimeout(() => {
                    document.body.removeChild(progress.bar.parentNode);
                }, remove_timeout);
            }
        }
    }

    // ========================================================================================================
    // 助手设置组件
    // ========================================================================================================
    function createHelperSettingSelect(attr, options = [], texts = []) {
        const status = hs[attr];
        if (options.length == 0) {
            options = [status];
        }

        const select = docre('select');
        select.className = 'helper-select helper-active-component';
        options.forEach(option => {
            const opt = docre('option');
            opt.value = option;
            opt.textContent = texts[options.indexOf(option)] || option;
            if (option == status) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            hs[attr] = e.target.value;
            GM.setValue('helper_setting', hs);
        });

        return select;
    }

    function createHelperSettingSwitch(attr, onchange = null) {
        const label = docre('label');

        const checkbox = docre('input');
        checkbox.type = 'checkbox';
        checkbox.checked = hs[attr];
        checkbox.addEventListener('change', (e) => {
            hs[attr] = e.target.checked;
            GM.setValue('helper_setting', hs);
            if (onchange) {
                onchange();
            }
        });
        label.appendChild(checkbox);

        const span = docre('span');
        span.className = 'helper-toggle-switch helper-halfheight-active-component';
        label.appendChild(span);

        return label;
    }

    function createHelperSettingMultiCheck(multichecks) {
        const container = docre('div');
        container.className = 'helper-multicheck-container helper-active-component';

        multichecks.forEach(option => {
            const item = docre('div');
            item.className = 'helper-multicheck-item';

            const checkbox = docre('input');
            checkbox.type = 'checkbox';
            checkbox.checked = hs[option.attr];
            checkbox.addEventListener('change', (e) => {
                hs[option.attr] = e.target.checked;
                GM.setValue('helper_setting', hs);
            });
            item.appendChild(checkbox);

            const item_text = docre('div');
            item_text.textContent = option.text;
            item_text.className = 'helper-multicheck-text';
            item_text.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
            item.appendChild(item_text);

            container.appendChild(item);
        });

        return container;
    }

    function createHelperSettingButton(btn_text, onclick) {
        const btn = docre('button');
        btn.type = 'button';
        btn.className = 'helper-setting-button helper-active-component';
        btn.textContent = btn_text;
        btn.addEventListener('click', onclick);

        return btn;
    }

    function createHelperActiveComponent(type, args) {
        switch (type) {
            case 'switch':
                return createHelperSettingSwitch(...args);
            case 'multicheck':
                return createHelperSettingMultiCheck(...args);
            case 'select':
                return createHelperSettingSelect(...args);
            case 'button':
                return createHelperSettingButton(...args);
            default:
                return docre('div');
        }
    }

    function createHeperTagsContainer(tag_list, onremove = null, value_attr = null) {
        const tag_container = docre('div');
        tag_container.className = 'helper-tag-container';

        const renderTags = () => {
            tag_container.innerHTML = '';
            tag_list.forEach((tag_info, index) => {
                const tag = docre('div');
                tag.className = 'helper-tag';
                if (value_attr && (value_attr in tag_info)) {
                    tag.textContent = tag_info[value_attr];
                }
                else {
                    tag.textContent = tag_info;
                }

                const remove_btn = docre('button');
                remove_btn.type = 'button';
                remove_btn.className = 'helper-tag-remove-btn';
                remove_btn.textContent = '×';
                remove_btn.addEventListener('click', () => {
                    tag_list.splice(index, 1);
                    renderTags();
                    updatePageDoc();
                    if (onremove) {
                        onremove();
                    }
                });

                tag.appendChild(remove_btn);
                tag_container.appendChild(tag);
            });
        };
        renderTags();

        return tag_container;
    }

    // ========================================================================================================
    // 助手设置弹窗
    // ========================================================================================================
    function createFollowListTab() {
        const followed_users = GM_getValue('followed_users', []);

        if (followed_users.length == 0) {
            return createCenterMessageDiv('暂无关注');
        }

        const table = docre('table');
        table.className = 'helper-popup-table';
        const table_head = docre('thead');
        table.appendChild(table_head);
        const title_row = table_head.insertRow();

        const user_title = docre('th');
        const thread_title = docre('th');
        const follow_title = docre('th');
        user_title.textContent = '用户';
        thread_title.textContent = '关注内容';
        follow_title.textContent = '操作';
        [user_title, thread_title, follow_title].forEach(e => {
            title_row.appendChild(e);
            e.className = 'helper-sticky-header';
        });

        const table_body = docre('tbody');
        table.appendChild(table_body);

        for (let user of followed_users) {
            const followed_threads = GM_getValue(user.uid + '_followed_threads', []);
            const user_URL_params = { loc: 'home', mod: 'space', uid: user.uid };

            if (followed_threads.some(e => e.tid == -1)) {
                const row = table_body.insertRow();
                const [user_cell, thread_cell, follow_cell] = [0, 1, 2].map(i => row.insertCell(i));

                insertLink(user.name, user_URL_params, user_cell);
                const thread_URL_params = { loc: 'home', mod: 'space', uid: user.uid, do: 'thread', view: 'me', type: 'reply', from: 'space' };
                insertLink('所有回复', thread_URL_params, thread_cell);
                follow_cell.appendChild(createFollowButton({ 'uid': user.uid, name: user.name, tid: -1, title: '所有回复' }));
                continue;
            }

            for (let thread of followed_threads) {
                const row = table_body.insertRow();
                const [user_cell, thread_cell, follow_cell] = [0, 1, 2].map(i => row.insertCell(i));

                insertLink(user.name, user_URL_params, user_cell);
                let thread_URL_params;
                if (thread.tid > 0) {
                    thread_URL_params = { loc: 'forum', mod: 'viewthread', tid: thread.tid };
                }
                else if (thread.tid == 0) {
                    thread_URL_params = { loc: 'home', mod: 'space', uid: user.uid, do: 'thread', view: 'me', from: 'space' };
                }

                insertLink(thread.title, thread_URL_params, thread_cell);
                follow_cell.appendChild(createFollowButton({ uid: user.uid, name: user.name, tid: thread.tid, title: thread.title }));
            }
        }
        return table;
    }

    function createHistoryNotificationTab() {
        const notification_messages = GM_getValue('notification_messages', []);

        if (notification_messages.length == 0) {
            return createCenterMessageDiv('暂无历史通知');
        }

        const div = docre('div');
        notification_messages.forEach(message => { div.innerHTML += message; });
        return div;
    }

    function createBlockKeywordTab() {
        const div = docre('div');
        const title_div = docre('div');
        title_div.className = 'helper-sticky-header';
        const input = docre('input');
        input.type = 'text';
        input.placeholder = '输入屏蔽词并回车提交';
        input.className = 'helper-input';

        let tag_container = createHeperTagsContainer(hs.block_keywords, () => GM.setValue('helper_setting', hs));
        input.addEventListener('keyup', e => {
            if (e.key == 'Enter') {
                const keyword = input.value.trim().toLowerCase();
                if (keyword.length > 0 && !hs.block_keywords.includes(keyword)) {
                    hs.block_keywords.push(keyword);
                    GM.setValue('helper_setting', hs);
                    div.removeChild(tag_container);
                    tag_container = createHeperTagsContainer(hs.block_keywords, () => GM.setValue('helper_setting', hs));
                    div.appendChild(tag_container);
                    updatePageDoc();
                }
                input.value = '';
            }
        });

        div.appendChild(input);
        div.appendChild(tag_container);

        return div;
    }

    function createBlacklistTab() {
        return createHeperTagsContainer(hs.blacklist, () => GM.setValue('helper_setting', hs), 'name');
    }

    function createDebugTab() {
        const div = docre('div');
        const all_value = GM_listValues();
        all_value.forEach(element => {
            const p = docre('p');
            p.textContent = element;
            p.addEventListener('click', () => {
                div.innerHTML = '';
                div.textContent = element + ':' + JSON.stringify(GM_getValue(element));
            });
            div.appendChild(p);
        });
        return div;
    }

    function createHelperSettingTab(setting_type) {
        const div = docre('div');
        let components = [];

        switch (setting_type) {
            case 'read':
                components = [
                    // 开启更新通知
                    { title: '订阅更新通知', type: 'switch', args: ['enable_notification', () => setHidden(qS('#htb-follow'), !hs.enable_notification)] },
                    // 开启历史消息
                    { title: '保存历史通知', type: 'switch', args: ['enable_history', () => setHidden(qS('#htb-history'), !hs.enable_history)] },
                    // 开启辅助换行
                    { title: '自动换行', type: 'switch', args: ['enable_auto_wrap', updatePageDoc] },
                    // 开启屏蔽词
                    {
                        title: '标题关键词屏蔽', type: 'switch', args: ['enable_block_keyword', () => {
                            updatePageDoc();
                            setHidden(qS('#htb-block'), !hs.enable_block_keyword);
                        }
                        ]
                    },
                    // 开启黑名单
                    {
                        title: '黑名单', type: 'switch', args: ['enable_blacklist', () => {
                            updatePageDoc();
                            setHidden(qS('#htb-blacklist'), !hs.enable_blacklist);
                        }]
                    }];
                break;
            case 'save':
                components = [
                    // 选择下载内容
                    {
                        title: '保存帖子内容', type: 'multicheck', args: [[
                            { attr: 'enable_text_download', text: '文本' },
                            { attr: 'enable_postfile_download', text: '帖内资源' },
                            { attr: 'enable_attach_download', text: '附件' },
                            { attr: 'enable_op_download', text: '原创资源' }]]
                    },
                    // 选择文件打包模式
                    {
                        title: '帖内打包保存方式', type: 'select', args: [
                            'files_pack_mode',
                            ['no', 'single', 'all'],
                            ['不打包', '分类打包', '全部打包']]
                    },

                    // 开启自动回复
                    {
                        title: '保存后自动回复', type: 'switch', args: ['enable_auto_reply']
                    },
                    // 选择默认合并下载模式
                    {
                        title: '空间合并保存方式', type: 'select', args: [
                            'default_merge_mode',
                            ['main', 'author', 'all'],
                            ['主楼（合并）', '作者（打包）', '全帖（打包）']]
                    }
                ];
                break;
            case 'data':
                components = [
                    // 清除历史消息
                    {
                        title: '清空历史通知', type: 'button', args: ['全部清空', () => {
                            const confirm = window.confirm('确定清空所有历史通知？');
                            if (confirm) {
                                GM.deleteValue('notification_messages');
                                location.reload();
                            }
                        }]
                        , hidden: !hs.enable_history
                    },

                    // 清除脚本数据
                    {
                        title: '清空脚本数据', type: 'button', args: ['全部清空', () => {
                            const confirm = window.confirm('确定清空脚本所有数据？');
                            if (confirm) {
                                GM_listValues().forEach(e => GM.deleteValue(e));
                                location.reload();
                            }
                        }]
                    }];
                break;
        }

        components.forEach(component => {
            const container = docre('div');
            container.className = 'helper-setting-container';

            const text_node = docre('div');
            text_node.textContent = component.title;
            container.appendChild(text_node);

            const active_component = createHelperActiveComponent(component.type, component.args);
            container.appendChild(active_component);

            if (!component.hasOwnProperty('hidden')) {
                component.hidden = false;
            }
            setHidden(container, component.hidden);
            div.appendChild(container);
        });

        return div;
    }

    function createHelperPopup() {
        const popup = createPopupWithTitle('湿热助手');

        const content_container = qS('#helper-content-container', popup);

        const tab_btn_container = docre('div');
        tab_btn_container.id = 'helper-tab-btn-container';
        tab_btn_container.className = 'helper-scroll-component';
        content_container.appendChild(tab_btn_container);

        const tab_content_container = docre('div');
        tab_content_container.id = 'helper-tab-content-container';
        tab_content_container.className = 'helper-scroll-component';
        content_container.appendChild(tab_content_container);

        const tabs = [
            { id: 'view', name: '浏览设置', func: () => createHelperSettingTab('read') },
            { id: 'save', name: '下载设置', func: () => createHelperSettingTab('save') },
            { id: 'data', name: '数据设置', func: () => createHelperSettingTab('data') },
            { id: 'follow', name: '关注列表', func: createFollowListTab, 'hidden': !hs.enable_notification },
            { id: 'history', name: '历史提醒', func: createHistoryNotificationTab, 'hidden': !hs.enable_history },
            { id: 'block', name: '标题屏蔽词', func: createBlockKeywordTab, 'hidden': !hs.enable_block_keyword },
            { id: 'blacklist', name: '黑名单', func: createBlacklistTab, 'hidden': !hs.enable_blacklist },
            { id: 'debug', name: '调试', func: createDebugTab, hidden: !hs.enable_debug_mode }];

        const show_tab = content => {
            tab_content_container.innerHTML = '';
            tab_content_container.appendChild(content)
        };

        tabs.forEach((tab, index) => {
            const btn = docre('button');
            btn.type = 'button';
            btn.id = 'htb-' + tab.id;
            btn.className = 'helper-tab-btn';
            btn.textContent = tab.name;

            btn.addEventListener('click', () => {
                qSA('button', tab_btn_container).forEach(e => e.classList.remove('helper-tab-selected'));
                btn.classList.add('helper-tab-selected');
                show_tab(tab.func());
            });

            if (index == 0) {
                btn.classList.add('helper-tab-selected');
                show_tab(tab.func());
            }

            if (!tab.hasOwnProperty('hidden')) {
                tab.hidden = false;
            }
            setHidden(btn, tab.hidden);
            tab_btn_container.appendChild(btn);
        });

        document.body.appendChild(popup);
    }

    // ========================================================================================================
    // 消息提醒弹窗
    // ========================================================================================================

    function createNotificationPopup() {
        const popup = docre('div');
        popup.id = 'helper-notification-popup';
        document.body.appendChild(popup);

        const close_btn = createCloseButton(() => { popup.style.display = 'none' });
        close_btn.style.position = 'absolute';
        close_btn.style.top = '10px';
        close_btn.style.right = '10px';
        close_btn.classList.add('helper-redx');
        popup.appendChild(close_btn);
    }

    async function updateNotificationPopup() {
        const followed_users = await GM.getValue('followed_users', []);
        if (followed_users.length > 0) {
            let popup = qS('#helper-notification-popup');
            let notification_messages = [];
            let promises = [];

            const createParaAndInsertUserNameLink = (user, parent) => {
                const messageElement = docre('div');
                messageElement.className = 'helper-noti-message';
                parent.appendChild(messageElement);
                const user_URL_params = { loc: 'home', mod: 'space', uid: user.uid };
                const user_link = insertLink(user.name, user_URL_params, messageElement);
                user_link.className = 'helper-ellip-link';
                user_link.style.maxWidth = '30%';
                user_link.style.color = 'inherit !important';
                return messageElement;
            }
            const processNewInfos = (user, thread, new_infos) => {
                let followed_threads = GM_getValue(user.uid + '_followed_threads', []);
                let new_threads = new_infos.new;
                const found_last = new_infos.found;
                const last_tpid = new_infos.last_tpid;

                if (new_threads.length > 0) {
                    updateListElements(followed_threads, { tid: thread.tid, last_tpid, title: thread.title }, true, (a, b) => a.tid == b.tid);
                    updateGMList(user.uid + '_followed_threads', followed_threads);
                }

                if (thread.last_tpid == 0 || new_threads.length == 0) { // 如果没有更新，或者是首次关注，则不发送消息
                    return notification_messages;
                }

                if (!popup) {
                    createNotificationPopup();
                    popup = qS('#helper-notification-popup');
                }

                const div = docre('div');
                if (thread.tid != 0) {
                    for (let new_thread of new_threads) {
                        const thread_title = new_thread.title;
                        const messageElement = createParaAndInsertUserNameLink(user, div);
                        let message = ` 有`;
                        if (!found_last && thread.tid != -1) { // 在特定关注主题末页未找到不晚于last_pid的
                            message += '至少';
                        }
                        message += `${new_thread.pids.length}条新回复在 `;
                        const text_element = document.createTextNode(message);
                        messageElement.appendChild(text_element);
                        const thread_URL_params = { loc: 'forum', mod: 'redirect', goto: 'findpost', ptid: new_thread.tid, pid: new_thread.pids.at(-1) };
                        const thread_message = insertLink(thread_title, thread_URL_params, messageElement);
                        thread_message.className = 'helper-ellip-link';
                    }
                    if (!found_last && thread.tid == -1) { // 在空间回复页首页未找到不晚于last_pid的
                        const messageElement = createParaAndInsertUserNameLink(user, div);
                        const text_element2 = document.createTextNode(' 或有 ');
                        messageElement.appendChild(text_element2);
                        const reply_URL_params = { loc: 'home', mod: 'space', 'uid': user.uid, do: 'thread', view: 'me', type: 'reply', from: 'space' };
                        insertLink('更多新回复', reply_URL_params, messageElement);
                    }
                }
                else if (thread.tid == 0) {
                    const noti_threads = new_threads.filter(e => hs.important_fids.includes(e.fid));
                    hs.important_fids.forEach(fid => { new_threads = new_threads.filter(e => e.fid != fid) });
                    const notif_num = new_threads.length > hs.max_noti_threads ? hs.max_noti_threads : new_threads.length;
                    noti_threads.push(...new_threads.slice(0, notif_num));
                    for (let new_thread of noti_threads) {
                        const messageElement = createParaAndInsertUserNameLink(user, div);
                        const text_element = document.createTextNode(' 有新帖 ');
                        messageElement.appendChild(text_element);
                        const thread_URL_params = { loc: 'forum', mod: 'viewthread', tid: new_thread.tid };
                        const thread_message = insertLink(new_thread.title, thread_URL_params, messageElement);
                        thread_message.className = 'helper-ellip-link';
                        if (hs.important_fids.includes(new_thread.fid)) {
                            thread_message.style = 'color: red !important';
                        }
                    }
                    if (new_threads.length > 3) {
                        const messageElement = createParaAndInsertUserNameLink(user, div);
                        let message = ` 有另外 `;
                        if (!found_last) {
                            message += '至少';
                        }
                        const text_element = document.createTextNode(message);
                        messageElement.appendChild(text_element);
                        const thread_URL_params = { loc: 'home', mod: 'space', 'uid': user.uid, do: 'thread', view: 'me', from: 'space' };
                        insertLink(`${new_threads.length - 3}条新帖`, thread_URL_params, messageElement);
                    }
                }
                popup.appendChild(div);
                notification_messages.push(div.innerHTML);

                return notification_messages;
            };

            for (let user of followed_users) {
                let followed_threads = GM_getValue(user.uid + '_followed_threads', []);
                for (let thread of followed_threads) {
                    promises.push(
                        getUserNewestPostOrThread(user.uid, thread.tid, thread.last_tpid).then(
                            new_infos => processNewInfos(user, thread, new_infos)
                        )
                    );
                }
            }
            if (hs.enable_history) {
                await Promise.all(promises);
                const old_notification_messages = GM_getValue('notification_messages', []);
                notification_messages.push(...old_notification_messages);
                updateGMList('notification_messages', notification_messages);
            }
        }
    }

    // ========================================================================================================
    // 代表作弹窗
    // ========================================================================================================
    function createMasterpieceTable(masterpiece_info, sortby = 'view') {
        const div = docre('div');
        div.className = 'helper-scroll-component';
        div.style.width = '100%';
        div.style.paddingBottom = '10px';

        const has_thread = ['view', 'reply'].some(e => masterpiece_info['max_' + e + '_threads'].length > 0);
        if (!has_thread) {
            div.appendChild(createCenterMessageDiv('暂无作品'));
            return div;
        }

        let masterpiece_list = [];
        const updateTable = sort_by => {
            const table = docre('table');
            table.className = 'helper-popup-table';
            const table_head = docre('thead');
            table.appendChild(table_head);
            const title_row = table_head.insertRow();

            const thread_title = docre('th');
            const view_title = docre('th');
            const reply_title = docre('th');
            thread_title.textContent = '主题';
            view_title.textContent = '浏览';
            reply_title.textContent = '回复';
            switch (sort_by) {
                case 'reply':
                    reply_title.className = 'helper-sortby';
                    masterpiece_list = masterpiece_info.max_reply_threads;
                    view_title.addEventListener('click', () => {
                        div.innerHTML = '';
                        updateTable('view');
                    });
                    view_title.style.cursor = 'pointer';
                    break;
                case 'view':
                default:
                    view_title.className = 'helper-sortby';
                    masterpiece_list = masterpiece_info.max_view_threads;
                    reply_title.addEventListener('click', () => {
                        div.innerHTML = '';
                        updateTable('reply');
                    });
                    reply_title.style.cursor = 'pointer';
            }

            [thread_title, view_title, reply_title].forEach(e => title_row.appendChild(e));

            const table_body = docre('tbody');
            table.appendChild(table_body);


            for (let thread of masterpiece_list) {
                const row = table_body.insertRow();
                const [thread_cell, view_cell, reply_cell] = [0, 1, 2].map(i => row.insertCell(i));

                const thread_URL_params = { loc: 'forum', mod: 'viewthread', tid: thread.tid };
                insertLink(thread.title, thread_URL_params, thread_cell);
                thread_cell.innerHTML = (thread.spanHTML ?? '') + thread_cell.innerHTML;
                view_cell.textContent = thread.views;
                reply_cell.textContent = thread.replies;
            }
            div.appendChild(table);
        };

        updateTable();

        return div;
    }

    async function createMasterpiecePopup(uid, user_name) {
        const popup = createPopupWithTitle(`${user_name} 的代表作`);
        document.body.appendChild(popup);
        const content_container = qS('#helper-content-container', popup);

        let masterpiece_info = GM_getValue(uid + '_masterpiece', { update_time: 0, max_view_threads: [], max_reply_threads: [] });
        const loadContent = async () => {
            content_container.appendChild(createLoadingOverlay());
            const top_progressbar = createTopProgressbar();
            let progress = { value: 0, bar: top_progressbar };
            masterpiece_info = await updateMasterpiece(uid, progress);
            content_container.innerHTML = '';
        };

        if (Date.now() - masterpiece_info.update_time > hs.data_cache_time) {
            await loadContent();
        }
        content_container.appendChild(createMasterpieceTable(masterpiece_info, hs.default_masterpiece_sort));

        const updateFootnote = () => {
            const footnote = docre('div');
            content_container.appendChild(footnote);
            footnote.className = 'helper-footnote';
            const update_time_ago = timeAgo(masterpiece_info.update_time);
            footnote.textContent = `缓存时间：${update_time_ago}`;
            if (update_time_ago != '今天内' || hs.enable_debug_mode) {
                footnote.textContent += ' | ';
                const reload_link = insertInteractiveLink('立即刷新', async () => {
                    await loadContent();
                    content_container.appendChild(createMasterpieceTable(masterpiece_info, hs.default_masterpiece_sort));
                    updateFootnote();
                }, footnote);
                reload_link.style.color = 'inherit !important';
            }
        };

        updateFootnote();
    }

    async function updateMasterpiece(uid, progress = null) {
        const getUserThreadNum = async (uid) => {
            const URL_params = { loc: 'home', mod: 'space', uid: uid, do: 'profile' };
            const page_doc = await getPageDocInDomain(URL_params);
            const thread_info = qS('#ct > div.mn > div > div.bm_c > div > div:nth-child(1) > ul.cl.bbda.pbm.mbm > li > a:nth-child(12)', page_doc);
            const thread_num = Number(thread_info.textContent.slice(4));
            return thread_num > 0 ? thread_num : 1;
        };

        const max_page = Math.ceil(await getUserThreadNum(uid) / 20);
        updateProgressbar(progress, 10);
        const dt = decimalCeil(90 / max_page);

        let threads = [];
        let promises = Array.from({ length: max_page }, (v, k) => k + 1).map(page_num => new Promise(async (resolve, reject) => {
            const URL_params = { loc: 'home', mod: 'space', 'uid': uid, do: 'thread', view: 'me', page: page_num, mobile: '2' };
            const page_doc = await getPageDocInDomain(URL_params, mobileUA);
            const threads_in_page = qSA('li.list', page_doc);
            for (let thread of threads_in_page) {
                const title_node = qS('.threadlist_tit', thread);
                const spanHTML = qS('span', title_node)?.outerHTML;
                const title = qS('em', title_node).textContent;
                const tid = title_node.parentNode.href.parseURL().tid;
                const views = Number(qS('.dm-eye-fill', thread).nextSibling.textContent);
                const replies = Number(qS('.dm-chat-s-fill', thread).nextSibling.textContent);
                threads.push({ tid, spanHTML, title, views, replies });
            }
            updateProgressbar(progress, dt);
            resolve();
        }));
        await Promise.all(promises);

        const max_view_threads = threads.sort((a, b) => b.views - a.views).slice(0, hs.masterpiece_num);
        const max_reply_threads = threads.sort((a, b) => b.replies - a.replies).slice(0, hs.masterpiece_num);
        const masterpiece_info = { update_time: Date.now(), max_view_threads, max_reply_threads };
        GM.setValue(uid + '_masterpiece', masterpiece_info);
        return masterpiece_info;
    }

    // ========================================================================================================
    // 插入表情
    // ========================================================================================================
    async function modifySmiliesArray(new_smilies) {
        await checkVariableDefined('smilies_array');
        for (let smilies of new_smilies) {
            smilies_type['_' + smilies.type] = [smilies.name, smilies.path];
            smilies_array[smilies.type] = new Array();
            smilies_array[smilies.type][1] = smilies.info;
        }
    }

    async function modifySmiliesSwitch(original_smilies_types, mode = 'img') {
        await checkVariableDefined('smilies_switch');
        let smilies_switch_str = unsafeWindow['smilies_switch'].toString();
        smilies_switch_str = smilies_switch_str.replace("STATICURL+'image/smiley/'+smilies_type['_'+type][1]+'/'", `('${original_smilies_types}'.split(',').includes(type.toString())?(STATICURL+'image/smiley/'+smilies_type['_'+type][1]+'/'):smilies_type['_'+type][1])`);
        if (mode == 'img') {
            // TODO fastpost时有问题
            smilies_switch_str = smilies_switch_str.replace("'insertSmiley('+s[0]+')'", `"insertText('[img]"+smilieimg+"[/img]',strlen('[img]"+smilieimg+"[/img]'),0)"`);
        }
        smilies_switch = new Function('return ' + smilies_switch_str)();
    }

    async function insertExtraSmilies(id, seditorkey, original_smilies_types, new_smilies) {
        await modifySmiliesArray(new_smilies);
        await modifySmiliesSwitch(original_smilies_types, 'img');
        smilies_show(id, 8, seditorkey);
    }

    async function modifyBBCode2Html(original_smilies_types) {
        // 可以正常使用，但由于modifyPostOnSubmit的缘故，同步弃用
        await checkVariableDefined('bbcode2html');
        let bbcode2html_str = unsafeWindow['bbcode2html'].toString();
        bbcode2html_str = bbcode2html_str.replace("STATICURL+'image/smiley/'+smilies_type['_'+typeid][1]+'/'", `('${original_smilies_types}'.split(',').includes(typeid.toString())?(STATICURL+'image/smiley/'+smilies_type['_'+typeid][1]+'/'):smilies_type['_'+typeid][1])`);
        bbcode2html_str = bbcode2html_str.replace("}if(!fetchCheckbox('bbcodeoff')&&allowbbcode){", "}if(!fetchCheckbox('bbcodeoff')&&allowbbcode){")
        bbcode2html = new Function('return ' + bbcode2html_str)();
    }

    async function modifyPostOnSubmit(submit_id, original_smilies_types) {
        // TODO 不知道为什么，不这么做的话自定义表情在提交时会被转义成bbcode
        // TODO 但是对于fastpost的情况还是没法处理，所以暂时弃用
        const post = qS('#' + submit_id);
        submit_id = submit_id.replace('form', '');
        // const original_onsubmit_str = post.getAttribute('onsubmit').toString();
        post.setAttribute('onsubmit', `if(typeof smilies_type == 'object'){for (var typeid in smilies_array){for (var page in smilies_array[typeid]){for(var i in smilies_array[typeid][page]){re=new RegExp(preg_quote(smilies_array[typeid][page][i][1]),"g");this.message.value=this.message.value.replace(re,'[img]'+('${original_smilies_types}'.split(',').includes(typeid.toString())?(STATICURL+'image/smiley/'+ smilies_type['_' + typeid][1] + '/'):smilies_type['_' + typeid][1])+smilies_array[typeid][page][i][2]+"[/img]");}}}}`);
    }

    // ========================================================================================================
    // 窗口事件和DOM属性
    // ========================================================================================================
    window.addEventListener('keydown', e => {
        if (e.key == 'Escape') {
            const noti_popup = qS('#helper-notification-popup');
            if (noti_popup && noti_popup.style.display != 'none') {
                noti_popup.style.display = 'none';
            }
            else {
                removeHelperPopup();
            }
        }
    });

    document.original_url = document.URL;

    // ========================================================================================================
    // 主体运行
    // ========================================================================================================

    modifyPageDoc();

})();


// 功能优化
// TODO 使用倒序浏览替代large_page_num
// TODO 保存文本链接处理
// TODO 版面浮动名片、好友浮动名片添加代表作、关注、拉黑
// TODO 进度条优化：saveThread中的getAllPageContent
// TODO 自动切换全帖/选中：显示已选
// TODO 滚动条悬停显示
// TODO 设置按钮hover
// TODO 支持firefox
// TODO 保存的文件名是否要带小分区名
// TODO 考虑op未加载的情况

// 设置优化
// TODO 换行参数
// TODO 提醒参数
// TODO 获取帖子信息参数
// TODO 显示按钮和订阅更新分开设置
// TODO 代表作数量
// TODO 历史消息上限
// TODO 插入TAB设置
// TODO 恢复默认设置
// TODO 是否重命名附件

// 调试模式
// TODO 导出关注
// TODO 删除键值

// 代码优化
// TODO 添加debug log
// TODO css classname data清理
// TODO 使用?. ?? 运算符替代if判断
// TODO 使用hasOwnProperty替代in判断
// FIXME getSpaceAuthor
// TODO 使用nodename替代tagname
// TODO 避免getAllPageContent中first page重复获取

// 搁置: 麻烦
// FIXME 置顶重复
// FIXME 历史消息重复
// TODO md格式
// TODO 图片不区分楼层

// NOTE 可能会用到 @require https://scriptcat.org/lib/513/2.0.0/ElementGetter.js
