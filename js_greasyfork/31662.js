// ==UserScript==
// @name                Come Back Tieba Thumbnails
// @name:zh-CN          恢复贴吧首页缩略图
// @namespace           https://greasyfork.org/zh-CN/users/14997-lrh3321
// @homepageURL         https://greasyfork.org/zh-CN/scripts/31662-come-back-tieba-thumbnails
// @supportURL          https://tieba.baidu.com/p/5236919537?pid=109672014745&cid=0#109672014745
// @version             0.5.4
// @description         Make Tieba great again!
// @description:zh-CN   让被设置为页游的贴吧首页能正常显示缩略图
// @author              LRH3321
// @match               *://tieba.baidu.com/f*
// @match               *://tieba.baidu.com/p/*
// @icon                http://www.baidu.com/favicon.ico
// @icon64              https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg
// @connect             baidu.com
// @license             MIT
// @require             https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.5.0/viewer.min.js
// @resource css        https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.5.0/viewer.min.css
// @resource weui       https://cdnjs.cloudflare.com/ajax/libs/weui/2.2.0/style/weui.min.css
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @grant               GM_getResourceText
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_log
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/31662/Come%20Back%20Tieba%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/31662/Come%20Back%20Tieba%20Thumbnails.meta.js
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    'use strict';
    const moment = window.moment;
    moment.locale('zh-cn');
    if (navigator.userAgent.includes('Mobile')) {
        return;
    }
    const ScriptOptions = {
        hideFriendApply: GM_getValue("hideFriendApply", true),
        hideLiveTopic: GM_getValue("hideLiveTopic", true),
        hooked: false,
        multiForumTip: true,
        powerViewer: GM_getValue("powerViewer", true),
        showBID: GM_getValue("showBID", true),
        showCreateTime: GM_getValue("showCreateTime", true),
        showThumb: GM_getValue("showThumb", true),
        smartLink: GM_getValue("smartLink", true),
    };
    // let Viewer = (<any>window).Viewer;
    let viewer;
    handlePath(location.pathname);
    function hideFriendApply() {
        if (ScriptOptions.hideFriendApply) {
            GM_log("hideFriendApply");
            const comUserbar = document.getElementById('com_userbar');
            if (comUserbar) {
                const news = comUserbar.querySelector('a.j_news span');
                // GM_log(news);
                // GM_log(friendApply);
                if (news instanceof HTMLElement) {
                    // create an observer instance
                    const observer = new MutationObserver(function (mutations) {
                        mutations
                            // .filter((mutation) => mutation.type === 'attributes')
                            .forEach(function (mutation) {
                            const innerFriendApply = comUserbar.querySelector('a.j_cleardata[data-type=friendapply] span');
                            if (mutation.attributeName === 'style') {
                                if (mutation.oldValue === 'display: none;'
                                    && innerFriendApply instanceof HTMLElement
                                    && news.textContent === `(${innerFriendApply.textContent})`) {
                                    news.style.display = 'none';
                                }
                                // GM_log(mutation.oldValue);
                                // GM_log('attributes');
                            }
                        });
                    });
                    // configuration of the observer:
                    const config = {
                        attributeFilter: ['style'],
                        attributeOldValue: true,
                        attributes: true,
                    };
                    const friendApply = comUserbar.querySelector('a.j_cleardata[data-type=friendapply] span');
                    if (friendApply instanceof HTMLElement
                        && news.textContent === `(${friendApply.textContent})`) {
                        news.style.display = 'none';
                    }
                    // pass in the target node, as well as the observer options
                    observer.observe(news, config);
                }
                else {
                    window.setTimeout(hideFriendApply, 200);
                }
            }
            else {
                window.setTimeout(hideFriendApply, 200);
            }
        }
    }
    function appendCreateTime() {
        GM_log('appendCreateTime');
        const threadlistAuthors = Array.from(document.querySelectorAll('div.threadlist_author'));
        // GM_log(threadlistAuthors);
        threadlistAuthors.forEach((threadlistAuthor) => {
            const iconWrap = threadlistAuthor.querySelector('span.icon_wrap');
            if (iconWrap) {
                iconWrap.remove();
            }
            const createSpan = threadlistAuthor.querySelector('span.is_show_create_time');
            let span = threadlistAuthor.querySelector('span.create_time');
            if (!span && createSpan) {
                span = createSpan.cloneNode();
                const time = createSpan.innerHTML.trim();
                if (time.includes(':')) {
                    span.innerHTML = moment(time, "HH:mm").fromNow();
                }
                else if (time.indexOf('-') === 4) {
                    span.innerHTML = moment(time, "YYYY-MM").fromNow();
                }
                else {
                    span.innerHTML = moment(time, "MM-DD").fromNow();
                }
                span.className = 'pull-right create_time';
                if (createSpan.parentElement) {
                    createSpan.parentElement.appendChild(span);
                }
            }
        });
        const selector = document.getElementsByName('select2')[0];
        if (selector) {
            selector.selectedIndex = 0;
        }
    }
    function handleForumHome() {
        if (ScriptOptions.showThumb) {
            if (document.querySelector("img[data-original]") === null) {
                // if ([16036].indexOf(PageData.forum.id) > -1) {
                // }
                window.setTimeout(function () {
                    if (document.querySelector('a.thumbnail') === null) {
                        thumbnailsBack();
                    }
                }, 300);
            }
        }
        else {
            GM_addStyle("div.small_wrap { display: none !important; }");
        }
        if (ScriptOptions.hideLiveTopic) {
            GM_addStyle('div#pagelet_live\\/pagelet\\/live { display: none; }');
        }
        createSettingPanel();
        if (ScriptOptions.multiForumTip) {
            GM_addStyle(`a[href*='?fid=']:before{content: '\\EA0C【多吧】';color: #4285F4;font-family: weui;}`);
        }
        if (ScriptOptions.showCreateTime) {
            GM_addStyle(`span.create_time{font-size: 12px !important;}`);
            window.setTimeout(appendCreateTime, 1000);
        }
        bigpipeHook();
    }
    function handlePath(pathname) {
        switch (pathname) {
            case '/f':
                handleForumHome();
                hideFriendApply();
                break;
            default:
                replaceOriginImageURL();
                if (ScriptOptions.showBID) {
                    window.setTimeout(showOriginalId, 100);
                }
                // showOriginalId();
                if (ScriptOptions.powerViewer) {
                    window.setTimeout(initViewer, 100);
                }
                if (ScriptOptions.smartLink) {
                    const css = `a.smart-link:before{content:' 【';margin-left:3px}a.smart-link:after{content:'】'}` +
                        'a.smart-link{color: peru;}';
                    GM_addStyle(css);
                    window.setTimeout(convertHyperLink, 100);
                    // convertHyperLink();
                }
                if (ScriptOptions.showBID && ScriptOptions.smartLink) {
                    listenReplyLoaded();
                }
                if (location.pathname.startsWith('/p/') && location.search.indexOf('fid=') > 0) {
                    // 多吧发帖
                    GM_log('GRT MultiForumLinks');
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: location.pathname,
                        onload(resp) {
                            const reg = new RegExp(`<a[^>]*multi_forum_link[^>]*>[^<]*</a>`, 'g');
                            const fragment = document.createElement('div');
                            let result;
                            const links = [];
                            result = reg.exec(resp.responseText);
                            while (result) {
                                links.push(result[0]);
                                result = reg.exec(resp.responseText);
                            }
                            if (links.length > 0) {
                                const pThread = document.querySelector('div.p_thread');
                                if (pThread && pThread.parentElement) {
                                    fragment.innerHTML = `<span class="multi_forum_info">楼主将贴子发布到了：</span>` +
                                        links.join(`<span class="multi_forum_split_line">|</span>`);
                                    document.body.appendChild(fragment);
                                    pThread.parentElement.insertBefore(fragment, pThread);
                                }
                            }
                        },
                    });
                }
                hideFriendApply();
                break;
        }
    }
    /**
     * 添加设置选项
     */
    function createSettingPanel() {
        GM_addStyle(GM_getResourceText('weui'));
        const idPrefix = "pagelet_frs-aside/pagelet/";
        const parent = document.getElementById(`${idPrefix}normal_aside`);
        if (!parent) {
            return;
        }
        const aside = document.createElement("div");
        aside.className = "aside_region";
        const h4 = document.createElement("h4");
        h4.className = "region_header clearfix";
        h4.textContent = "脚本设置";
        aside.appendChild(h4);
        const regionContent = document.createElement("div");
        regionContent.className = "region_cnt weui-cells weui-cells_checkbox clearfix";
        regionContent.style.fontSize = '14px';
        regionContent.appendChild(createCheckBoxLabel("显示缩略图", ScriptOptions.showThumb, "showThumb"));
        regionContent.appendChild(createCheckBoxLabel("显示发帖时间", ScriptOptions.showCreateTime, "showCreateTime"));
        regionContent.appendChild(createCheckBoxLabel("启用看图模式", ScriptOptions.powerViewer, "powerViewer"));
        regionContent.appendChild(createCheckBoxLabel("智能转换链接", ScriptOptions.smartLink, "smartLink"));
        regionContent.appendChild(createCheckBoxLabel("跨吧帖标注", ScriptOptions.multiForumTip, "multiForumTip"));
        regionContent.appendChild(createCheckBoxLabel("隐藏今日话题", ScriptOptions.hideLiveTopic, "hideLiveTopic"));
        regionContent.appendChild(createCheckBoxLabel("隐藏好友申请", ScriptOptions.hideFriendApply, "hideFriendApply"));
        regionContent.appendChild(createCheckBoxLabel("帖子内显示用户原始ID", ScriptOptions.showBID, "showBID"));
        const title = document.createElement('div');
        title.className = 'weui-cells__title';
        title.textContent = '筛选帖子';
        regionContent.appendChild(title);
        const postFilter = document.createElement('div');
        postFilter.className = 'weui-cell weui-cell_select weui-cell_select-after';
        postFilter.innerHTML = `<div class="weui-cell__hd">
    <label for="" class="weui-label">按发帖时间</label>
</div>
<div class="weui-cell__bd">
    <select class="weui-select" name="select2">
        <option value="0">无</option>
        <option value="1">小于1小时</option>
        <option value="2">小于1天</option>
        <option value="3">小于1月</option>
    </select>
</div>`;
        regionContent.appendChild(postFilter);
        aside.appendChild(regionContent);
        const regionFooter = document.createElement("div");
        regionFooter.className = "region_footer";
        aside.appendChild(regionFooter);
        parent.insertBefore(aside, document.getElementById(`${idPrefix}forum_info`));
        const selector = document.getElementsByName('select2')[0];
        selector.onchange = function (e) {
            // GM_log(e);
            // GM_log(selector.selectedIndex);
            filterByPostTime(selector.selectedIndex);
        };
    }
    function createCheckBoxLabel(tip, value, bindName, tooltip) {
        const label = document.createElement("label");
        label.className = 'weui-check__label';
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.className = 'weui-check';
        checkBox.checked = value;
        if (tooltip) {
            checkBox.title = tooltip;
        }
        label.appendChild(checkBox);
        const i = document.createElement('i');
        i.className = 'weui-icon-checked';
        label.appendChild(i);
        const text = document.createElement("span");
        text.textContent = tip;
        label.appendChild(text);
        label.onclick = function (ev) {
            GM_setValue(bindName, checkBox.checked);
        };
        return label;
    }
    /**
     * 初始化看图模式
     */
    function initViewer() {
        const images = Array.from(document.querySelectorAll("img.BDE_Image"))
            .filter((i) => (i.parentElement && i.parentElement.tagName.toLowerCase() === 'div'));
        if (images.length === 0) {
            return;
        }
        GM_addStyle(GM_getResourceText("css"));
        const parent = document.querySelector("#pb_content .core_title_btns");
        if (!parent) {
            return;
        }
        const el = document.createElement("span");
        el.className = "see-image-btn btn-small btn-sub";
        el.textContent = "看图";
        el.title = "进入看图模式";
        el.onclick = () => {
            if (typeof viewer === "undefined") {
                const ul = document.createElement("ul");
                for (const img of images) {
                    const image = new Image();
                    image.src = img.getAttribute("bpic");
                    const li = document.createElement("li");
                    li.appendChild(image);
                    ul.appendChild(li);
                }
                if (!ul.firstElementChild) {
                    return;
                }
                viewer = new Viewer(ul, { zIndex: 12017 });
            }
            viewer.show();
        };
        if (document.querySelector("style.stylish")) {
            GM_addStyle(`.see-image-btn:before{content: "\\e895"!important;font-family: 'Material Icons';speak: none;
font-style: normal;font-weight: normal;font-variant: normal;line-height: 1;white-space: nowrap;word-wrap: normal;
direction: ltr;display: block;font-size: 30px;position: absolute !important;left: 50% !important;top: 50% !important;
transform: translate(-50%, -50%);margin-top: -14px !important;}`);
        }
        parent.appendChild(el);
    }
    /**
     * 将文本转换为超链接
     * @param text
     */
    function textToHyperLink(text) {
        const anchor = document.createElement("a");
        let href = "";
        if (text) {
            text = text.trim();
            const bilibiliRegex = /av(\d{1,8})$/;
            let m = bilibiliRegex.exec(text);
            if (m) {
                href = `http://www.bilibili.com/video/av${m[1]}`;
            }
            else {
                m = /(\/?s\/|^)(1[\da-z]{7})(\s|$)/i.exec(text) || /(\/?s\/|^)(1[\da-z]{3})_[\da-zA-Z]{18}(\s|$)/i.exec(text);
                if (m) {
                    href = `https://pan.baidu.com/s/${m[2]}`;
                }
                else if (text.includes("http:") || text.includes("https:")) {
                    href = text.substring(text.indexOf("http"));
                }
                else {
                    m = /([\da-z]{40,40})|([\da-z]{32,32})/i.exec(text);
                    if (m) {
                        href = `magnet:?xt=urn:btih:${m[1] || m[2]}`;
                    }
                    else {
                        m = /link\?shareid=(\d+)&uk=(\d+)&fid=(\d+)/i.exec(text);
                        if (m) {
                            href = `https://pan.baidu.com/share/link?shareid=${m[1]}&uk=${m[2]}&fid=${m[3]}`;
                        }
                    }
                }
            }
        }
        if (href) {
            anchor.href = href;
            anchor.textContent = href;
            anchor.classList.add('smart-link');
            return anchor;
        }
        return undefined;
    }
    function convertElementToAnchor(div) {
        let node = div.firstChild;
        let text = node.textContent;
        while (node) {
            node = node.nextSibling;
            if (!node || !node.parentElement) {
                break;
            }
            if (node.nodeName.toUpperCase() === "BR") {
                const anchor = textToHyperLink(text);
                if (anchor) {
                    const a = Array.from(div.querySelectorAll('a[href]:not([class])'))
                        .find((it) => (it.textContent !== null) &&
                        (it.textContent.trim() === anchor.href));
                    if (!a) {
                        node.parentElement.insertBefore(anchor, node);
                    }
                }
                text = "";
            }
            else if (node.nodeName.toUpperCase() === "IMG") {
                if (node.classList.contains("BDE_Smiley")) {
                    const pre = node.previousSibling;
                    if (pre && (pre.nodeName === "A" || pre.nodeName === "a")) {
                        text = pre.textContent.trim();
                    }
                }
                // } else if (node.nodeName === "A" || node.nodeName === "a") {
            }
            else {
                const t = node.textContent;
                const appendText = t.trim();
                if (t.startsWith(' ') || appendText.startsWith('密码') || appendText.startsWith('提取码')) {
                    // GM_log(appendText);
                }
                else if (appendText) {
                    if (/^[^（]/.exec(appendText)) {
                        text += appendText;
                    }
                }
            }
        }
        const anchor2 = textToHyperLink(text);
        if (!anchor2) {
            return;
        }
        const a2 = Array.from(document.querySelectorAll('a[href]:not([class])'))
            .find((it) => (it.textContent !== null) &&
            (it.textContent.trim() === anchor2.href));
        if (!a2) {
            div.appendChild(anchor2);
        }
    }
    /**
     * 转换超链接
     */
    function convertHyperLink() {
        Array.from(document.querySelectorAll("div.d_post_content"))
            .forEach(convertElementToAnchor);
    }
    function convertHyperLinkFromReply(parent) {
        const replies = Array.from(parent.querySelectorAll('span.lzl_content_main'));
        replies.forEach((it) => {
            const textContent = it.textContent;
            textContent.split(/\s+/).forEach((text) => {
                const anchor = textToHyperLink(text);
                if (anchor) {
                    const a = Array.from(it.querySelectorAll('a[href]:not([class])'))
                        .find((item) => (item.textContent !== null) &&
                        (item.textContent.trim() === anchor.href));
                    if (!a) {
                        it.appendChild(anchor);
                    }
                }
            });
        });
    }
    /**
     * 显示贴吧ID
     */
    function showOriginalId() {
        const userCards = Array.from(document.querySelectorAll("li.d_name a.j_user_card"));
        userCards.forEach((element) => {
            if (element.querySelector("img")) {
                const original = decodeURI(/un=([^&]*?)&/.exec(element.href)[1]);
                if (element.nextElementSibling) {
                    element.nextElementSibling.textContent = original;
                }
                else if (element.parentElement) {
                    const span = document.createElement("span");
                    span.style.display = 'block';
                    span.style.cursor = 'pointer';
                    span.style.letterSpacing = '0';
                    span.style.color = '#999';
                    span.textContent = original;
                    element.parentElement.appendChild(span);
                }
            }
        });
    }
    function showOriginalIdFromReply(parent) {
        const subUserCards = Array.from(parent.querySelectorAll('div.lzl_cnt a.j_user_card'));
        subUserCards.forEach((element) => {
            if (!element.querySelector('img') || !element.parentElement) {
                return;
            }
            const original = decodeURI(/un=([^&]*?)&/.exec(element.href)[1]);
            const span = document.createElement("span");
            span.style.display = 'inline';
            span.style.cursor = 'pointer';
            span.style.letterSpacing = '0';
            span.style.color = '#999';
            span.style.textDecoration = 'underline';
            span.textContent = original;
            element.parentElement.insertBefore(span, element.nextSibling);
        });
    }
    /**
     * 监听加载楼中楼的事件
     */
    function listenReplyLoaded() {
        const lazyLoaders = Array.from(document.querySelectorAll('div.core_reply_wrapper > img.loading_reply'));
        lazyLoaders.forEach((it) => {
            it.addEventListener('DOMNodeRemoved', (ev) => {
                if (ScriptOptions.showBID) {
                    window.setTimeout(showOriginalIdFromReply, 100, ev.relatedNode);
                }
                if (ScriptOptions.smartLink) {
                    window.setTimeout(convertHyperLinkFromReply, 100, ev.relatedNode);
                }
            }, false);
        });
    }
    /**
     * 设置原图连接地址
     */
    function replaceOriginImageURL() {
        GM_log("In replaceOriginImageURL");
        const reg = new RegExp("forum/[^/]*/sign=[^/]*/(.*)\\b", "i");
        for (const img of Array.from(document.querySelectorAll("img.BDE_Image:not([bpic])"))) {
            if (img.src.includes('bede9735e5dde711c981db20a0efce1b9f1661d5')) {
                continue;
            }
            const bpic = img.src.replace(reg, "forum/pic/item/$1");
            img.setAttribute("bpic", bpic);
        }
    }
    /**
     * 动态刷新页面时，显示缩略图
     */
    function bigpipeHook() {
        if (ScriptOptions.hooked) {
            return;
        }
        if (ScriptOptions.showThumb || ScriptOptions.showCreateTime) {
            const originalBroadcast = Bigpipe.broadcast;
            Bigpipe.broadcast = (e, t) => {
                // GM_log(e);
                const r = originalBroadcast(e, t);
                if (e === "page_change") {
                    if (ScriptOptions.showThumb) {
                        window.setTimeout(thumbnailsBack, 1000);
                    }
                    if (ScriptOptions.showCreateTime) {
                        window.setTimeout(appendCreateTime, 1000);
                    }
                }
                return r;
            };
        }
        ScriptOptions.hooked = true;
    }
    function thumbnailsBack() {
        GM_log("Getting thumbnails.");
        function appendImageList(parent, tid, items) {
            const ul = document.createElement("ul");
            ul.className = "threadlist_media j_threadlist_media clearfix";
            ul.id = `fm${tid}`;
            ul.style.cssFloat = "left";
            for (const el of items) {
                const li = document.createElement("li");
                let a;
                let img;
                a = document.createElement("a");
                a.className = "thumbnail vpic_wrap";
                img = new Image();
                img.className = "threadlist_pic j_m_pic";
                img.style.display = "inline";
                img.style.maxWidth = "200px";
                img.style.width = "auto";
                img.style.height = "90px";
                const src = el.src;
                const arr = src.split("/");
                const picId = arr.pop();
                img.src = src;
                img.dataset.original = src;
                img.setAttribute("bpic", `//tiebapic.baidu.com/forum/pic/item/${picId}`);
                a.appendChild(img);
                li.appendChild(a);
                ul.appendChild(li);
            }
            if (ul.hasChildNodes()) {
                parent.appendChild(ul);
            }
        }
        function getThreadWithId(tid) {
            return document.querySelector(`#thread_list li[data-field^='{"id":${tid},']`);
        }
        function appendSmallWrap(tid, items) {
            const thread = getThreadWithId(tid);
            if (!thread) {
                return;
            }
            thread.classList.add('processed');
            if (!items) {
                return;
            }
            const wrap = document.createElement("div");
            wrap.className = "small_wrap j_small_wrap";
            wrap.setAttribute("is_handle", "true");
            let anchor = document.createElement("a");
            anchor.onclick = () => false;
            anchor.style.display = "none";
            anchor.className = "small_btn_pre j_small_pic_pre";
            wrap.appendChild(anchor);
            anchor = anchor.cloneNode(true);
            anchor.className = "small_btn_next j_small_pic_next";
            wrap.appendChild(anchor);
            const smallList = document.createElement("div");
            smallList.className = "small_list j_small_list cleafix";
            const smallListGallery = document.createElement("div");
            smallListGallery.className = "small_list_gallery";
            appendImageList(smallListGallery, tid, items);
            if (items.length > 2) {
                const smallPicNum = document.createElement("div");
                smallPicNum.className = "small_pic_num center_text";
                smallPicNum.textContent = `共 ${items.length} 张`;
                smallListGallery.appendChild(smallPicNum);
            }
            smallList.appendChild(smallListGallery);
            wrap.appendChild(smallList);
            const threadlistText = thread.querySelector("div.threadlist_text");
            if (threadlistText) {
                threadlistText.appendChild(wrap);
            }
        }
        /**
         * 由帖子的Id获取帖子的HTML源码
         * @param id 帖子的id
         */
        function requestThreadAsync(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        onerror: (resp) => reject(resp),
                        onload: (resp) => {
                            if (resp.status < 400) {
                                resolve(resp.responseText);
                            }
                            else {
                                reject(resp);
                            }
                        },
                        url: `https://tieba.baidu.com/p/${id}?see_lz=1&_t=${+new Date()}`,
                    });
                });
            });
        }
        /**
         * 提取帖子内指定楼层的图片
         * @param post 帖子内的楼层
         */
        function extractImages(post) {
            const json = JSON.parse(post.dataset.field || '');
            // const uid = json.author.user_id;
            const content = json.content.content;
            const threadDoc = parser.parseFromString(content, 'text/html');
            const images = Array.from(threadDoc.querySelectorAll('img.BDE_Image'));
            return images;
        }
        const parser = new DOMParser();
        const threadSet = new Set();
        const threadQueue = new Array();
        window.setTimeout(function () {
            document.querySelectorAll('#thread_list > li.j_thread_list:not(.processed)')
                .forEach((el) => {
                threadQueue.push(JSON.parse(el.dataset.field || '').id);
            });
            GM_log(threadQueue);
            while (threadQueue.length > 0) {
                const tid = threadQueue.shift();
                if (threadSet.has(tid)) {
                    continue;
                }
                threadSet.add(tid);
                const thread = getThreadWithId(tid);
                if (thread === null || thread.querySelector('div.small_wrap')) {
                    continue;
                }
                GM_log(`GET ${tid} images`);
                requestThreadAsync(tid)
                    .then((html) => {
                    const htmlDoc = parser.parseFromString(html, 'text/html');
                    const postlist = htmlDoc.getElementById('j_p_postlist');
                    if (postlist) {
                        const postArray = Array.from(postlist.querySelectorAll('div.l_post[data-field]'));
                        let post = postArray.shift();
                        if (post instanceof HTMLDivElement) {
                            const images = extractImages(post);
                            while (images.length < 3 && postArray.length > 0) {
                                post = postArray.shift();
                                if (post instanceof HTMLDivElement) {
                                    const items = extractImages(post);
                                    for (const img of items) {
                                        images.push(img);
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                            // console.debug([content, uid, images]);
                            appendSmallWrap(tid, images);
                            GM_log(`END GET ${tid}`);
                        }
                    }
                    else {
                        console.error(htmlDoc);
                    }
                }).catch((reason) => {
                    console.error(reason);
                });
            }
        }, 500);
    }
    function findThreadListItem(el) {
        let parent = el.parentElement;
        while (parent && !(parent instanceof HTMLLIElement)) {
            parent = parent.parentElement;
        }
        return parent;
    }
    /**
     * 按发帖时间筛选帖子
     */
    function filterByPostTime(unit) {
        GM_log(`FilterByPostTime, unit: ${unit}.`);
        const allSpans = Array.from(document.querySelectorAll('span.pull-right.create_time'));
        switch (unit) {
            case 0: // 无
                allSpans.map(findThreadListItem)
                    .forEach((el) => {
                    if (el) {
                        el.style.display = '';
                    }
                });
                break;
            case 1: // 1小时内
                allSpans.filter((sp) => !sp.innerHTML.includes('分钟'))
                    .map(findThreadListItem)
                    .forEach((el) => {
                    if (el) {
                        el.style.display = 'none';
                    }
                });
                break;
            case 2: // 1天内
                const regexD = /(小时|分钟)/;
                const d = new Date();
                let f = (s) => s === '1 天前';
                if (d.getHours() >= 12) {
                    f = (s) => (s === '1 天前') || (s === '2 天前');
                }
                allSpans.forEach((sp) => {
                    const el = findThreadListItem(sp);
                    if (el) {
                        el.style.display = (regexD.test(sp.innerHTML) || f(sp.textContent)) ? '' : 'none';
                    }
                });
                break;
            case 3: // 1月内
                const regexM = /(小时|分钟|天)/;
                allSpans.forEach((sp) => {
                    const el = findThreadListItem(sp);
                    if (el) {
                        el.style.display = regexM.test(sp.innerHTML) ? '' : 'none';
                    }
                });
                break;
            default:
                break;
        }
    }
})();
