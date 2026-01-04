// ==UserScript==
// @name         XiTale
// @name:zh-TW   慶豐Tale
// @name:zh-CN   庆丰Tale
// @namespace    https://greasyfork.org/zh-CN/scripts/404423-%E5%BA%86%E4%B8%B0tale
// @version      0.2.1
// @description  Let the Qingfeng Newspeak get into the doors of thousands.
// @description:zh-TW  讓慶豐話走入尋常百姓家。
// @description:zh-CN  让庆丰话走进寻常百姓家。
// @author       Light Ascend
// @match        https://fimtale.com/*
// @match        https://*.fimtale.com/*
// @grant        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/404423/XiTale.user.js
// @updateURL https://update.greasyfork.org/scripts/404423/XiTale.meta.js
// ==/UserScript==

"use strict";
const legalStates = ["loading", "interactive", "complete"];
self.runnedYet = false;

// Quick paths
self["$e"] = self["$e"] || function (selector, source) {
	var src = source || document;
	return src.querySelector(selector);
};
self["$a"] = self["$a"] || function (selector, source) {
	var src = source || document;
	return Array.from(src.querySelectorAll(selector));
};
HTMLElement.prototype.$e = function (selector) {
	return $e(selector, this);
};
HTMLElement.prototype.$a = function (selector) {
	return $a(selector, this);
};

// Initialize Maps
self.gDict = {};
gDict.articleType = new Map([
    ["原创", "人大报告"],
    ["转载", "灌肠消息"],
    ["翻译", "发言稿"]
]);
if (location.pathname.indexOf("/en") == 0) {
    gDict.workType = new Map([
        ["work", "工笔"],
        ["tag", "派系"],
        ["user", "名单"],
        ["channel", "书单"],
        ["blog post", "微博"]
    ]);
    gDict.longWorkType = new Map([
        ["works", "人大文件"],
        ["stories", "官媒访谈"],
        ["gallery", "秦城画廊"],
        ["forum", "一带一路论坛"],
        ["tags", "入狱标签"],
        ["channels", "电视认罪"]
    ]);
    gDict.pageCaption = new Map([
        ["Hot ", "最新"],
        ["Newly ", "撒币"],
        ["Navigator", "沼气池"],
        ["forum posts", "认罪书"],
        ["Recommend to you", "精准扶贫"],
        ["Post new ", "发布新"],
        ["Updates", "散毒动态"],
        ["Add ", "拉入"]
    ]);
    gDict.sidebarMenu = new Map([
        ["Dark mode", "关闭会堂大灯"],
        ["Home", "梁家河"],
        ["Jump to random work", "随机突开"],
        ["FimTale handbook", "人大代表修炼指南"],
        ["Post", "微博发布"],
        ["Settings", "亲自指挥"],
        ["Notifications:", "大队信箱:"],
        ["Bits:", "电子习大头:"],
        ["Task list:", "枪毙名单:"],
        ["History", "山路历程"],
        ["My favorites", "巴拿马账户"],
        ["Recycle bin", "低端人口"],
        ["Log out", "下台"],
        ["Information Bar", "新华社通稿"],
        ["用户手册", "人大代表修炼指南"],
        ["EquestriaCN 小马中国", "Qingfeng China 庆丰包子连锁"]
    ]);
};

// Word replacer
self.gRepl = {};
gRepl.logo = function (container) {
    container.innerHTML = '<span style="font-size: 40px;font-style: italic;font-family: &quot;Manrope&quot;, &quot;Tahoma&quot;, &quot;Verdana&quot;, &quot;Noto Sans&quot;, sans-serif;vertical-align: middle;line-height: 40px;">XiTale</span>';
};
gRepl.searchType = function (display, tags) {
    tags.$a("li > a").forEach((e) => {
        if (gDict.workType.has(e.innerText.toLowerCase())) {
            e.setAttribute("onclick", e.getAttribute("onclick").replace(e.innerText, gDict.workType.get(e.innerText.toLowerCase())));
            e.innerText = gDict.workType.get(e.innerText.toLowerCase());
        };
    });
    if (display) {
        display.innerText = gDict.workType.get(display.innerText.toLowerCase());
    };
};
gRepl.actionBar = function (actionElements) {
    actionElements.forEach((e) => {
        e.title = gDict.longWorkType.get(e.title.toLowerCase());
        e.$e("div.label").innerText = e.title;
    });
};
gRepl.sideBarMenu = function (menuItems) {
    menuItems.forEach((e, i, a) => {
        if (i > 1 || a.length == 1) {
            gDict.sidebarMenu.forEach((e1, i1) => {
                e.innerHTML = e.innerHTML.replace(i1, e1);
            });
        };
    });
};
gRepl.articleTypes = function (articleLists) {
    articleLists.forEach((e) => {
        gDict.articleType.forEach((e1, i1) => {
            e.innerHTML = e.innerHTML.replace(i1, e1);
        });
    });
};
gRepl.pageCaptions = function (subtitles) {
    subtitles.forEach((e) => {
        (new Map([...gDict.pageCaption, ...gDict.longWorkType, ...gDict.workType])).forEach((e1, i1) => {
            e.innerHTML = e.innerHTML.replace(i1, e1);
        });
    });
};

// Periodic replacer
self.pRepl = {};
pRepl.popupTitles = function () {
    $a("div.layui-layer-title").forEach(function (e) {
        e.innerText = e.innerText.replace("FimTale", "XiTale");
    });
};

// Periodic activity
self.periodicActivity = function () {
    pRepl.popupTitles();
    gRepl.articleTypes($a(".main-tag-set .grey"));
};

// Main activity
self.mainActivity = function () {
    if (!runnedYet) {
        // Get periodic elements
        // Global replace
        gRepl.searchType($e("#type-selector-trigger"), $e("ul#choose-type"));
        gRepl.logo($e("a.logo-container"));
        gRepl.actionBar($a(".action-bar > a > div"));
        gRepl.sideBarMenu($a("ul#sidenav-main > li"));
        gRepl.sideBarMenu($a("ul#sidenav-main > div"));
        gRepl.sideBarMenu($a("a#new-trigger"));
        gRepl.articleTypes($a("div.carousel-item .grey"));
        gRepl.articleTypes($a("div.container .grey"));
        gRepl.pageCaptions($a("div.page-subtitle"));
        // Periodic replace
        self.periodicThread = setInterval(periodicActivity, 500);
        // Individual replace
        ($e("div#billboard .carousel-absolute-item .always-white") || {}).innerText = "梁家河大字报";
        runnedYet = true;
        console.log("The Foreign Powers had conquered XiTale.");
    };
};

document.addEventListener("readystatechage", function () {
    switch (document.readyState.toLowerCase()) {
        case legalStates[1]: {
            mainActivity();
            break;
        };
    };
});

self.onload = mainActivity;

if (document.readyState == legalStates[2]) {
    mainActivity();
};

console.log("XiTale is loaded by the Foreign Powers.");