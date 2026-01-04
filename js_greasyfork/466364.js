// ==UserScript==
// @name		CC直播间净化
// @description		隐藏CC直播页面中的大部分广告, 并且当直播结束跳转其他直播间时, 自动关闭页面
// @name:en		CCLiveClean
// @description:en		Hide almost CC live Element. 
// @author		Yiero
// @version		1.1.0
// @match		https://cc.163.com/*
// @match		https://act/m/daily/anchor_end_countdown/*
// @grant		GM_addStyle
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @run-at		document-start
// @icon		https://cc.163.com/favicon.ico
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts/
// @license		GPL
// @downloadURL https://update.greasyfork.org/scripts/466364/CC%E7%9B%B4%E6%92%AD%E9%97%B4%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/466364/CC%E7%9B%B4%E6%92%AD%E9%97%B4%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
var __defProp = Object.defineProperty;

var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: value
}) : obj[key] = value;

var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
};

class Info {
    constructor(projectName) {
        __publicField(this, "projectName");
        __publicField(this, "header");
        this.projectName = projectName;
        this.header = `[${projectName}]`;
    }
    log(...msg) {
        (() => {})(...this.contentInfo(...msg));
    }
    info(...msg) {
        console.info(...this.contentInfo(...msg));
    }
    warn(...msg) {
        console.warn(...this.contentInfo(...msg));
    }
    error(...msg) {
        console.error(...this.contentInfo(...msg));
    }
    contentInfo(...msg) {
        return [ this.header, `[${(new Date).toLocaleString("zh-ch")}]`, ...msg ];
    }
}

class CSSRule {
    constructor() {
        __publicField(this, "cssRuleSet", new Set);
        __publicField(this, "styleDom", document.createElement("style"));
    }
    push(selector, rule) {
        let ruleString = "";
        for (let ruleKey in rule) {
            const ruleValue = rule[ruleKey];
            ruleString += `${ruleKey}:${ruleValue};`;
        }
        this.cssRuleSet.add(`${selector} {${ruleString}}`);
    }
    pushImportant(selector, rule) {
        let ruleString = "";
        for (let ruleKey in rule) {
            let ruleValue = rule[ruleKey];
            if (typeof ruleValue === "string") {
                ruleValue = ruleValue.replace("!important", "");
            }
            ruleString += `${ruleKey}:${ruleValue} !important;`;
        }
        this.cssRuleSet.add(`${selector} {${ruleString}}`);
    }
    pushHide(selector) {
        this.pushImportant(selector, {
            display: "none"
        });
    }
    pushHideList(selectorList) {
        selectorList.forEach((selector => {
            this.pushImportant(selector, {
                display: "none"
            });
        }));
    }
    pushList(ruleList) {
        ruleList.forEach((({selector: selector, rule: rule}) => {
            this.push(selector, rule);
        }));
    }
    pushImportantList(ruleList) {
        ruleList.forEach((({selector: selector, rule: rule}) => {
            this.pushImportant(selector, rule);
        }));
    }
    submit() {
        this.removeAll();
        new Info("AddStyle").log(Array.from(this.cssRuleSet).join(" "));
        this.styleDom = GM_addStyle(Array.from(this.cssRuleSet).join(" "));
    }
    removeAll() {
        if (this.styleDom) {
            this.styleDom.remove();
        }
    }
}

const hideSelectorList = {
    main: [ ".ad-ct", "#webChat", "#js-side-nav", ".index-module_container_1pK9d", "::-webkit-scrollbar" ],
    headerNav: [ ".menu-location", "#my-follow, #my-record, #download, #menu-be-anchor", "#guard-head-avatar-red-dot-msg, .red-dot" ],
    danmuBar: [ "#room-tabs", "#gift-banner", ".gift-simp-banner", ".room-boardcast", ".activity-notify", ".gift_item", ".chat-msg-folder" ],
    liveTitle: [ "#achievement, .live-type, .live-guard, .live-fans-badge-diamond, .anchor-friends", "#plugins2374, #plugins9970, #plugins9670, #plugins9977, #plugins9412, #plugins9997, #plugins9089, #plugins6666, #plugins9217, #plugins2511, #plugins1609, #plugins9913, #plugins1016, #plugins14, #plugins5985, #plugins1353, #plugins1, #plugins9321 " ],
    live: [ "#recommend-module", "#live_left_bottom_box_wrap", ".video-watermark", "#new-player-banner, #player-banner, #new-player-banner, #mounts_player, #mounts_banner", ".gameH5Theater .user-tool-bar" ]
};

const anchor_end_countdownHideSelectorList = {
    live: [ ".ui-wrap" ]
};

const prefSelectorList = {
    main: {
        ".room-main-container": {
            "margin-top": "20px"
        }
    },
    headerNav: {
        ".user-do": {
            "margin-right": "50%",
            transform: "translateX(50%)"
        }
    },
    live: {
        ".page-right-container": {
            width: "100%"
        },
        "#live_player": {
            height: "100%"
        }
    },
    danmuBar: {
        ".chat-list-short": {
            height: "calc(100% - 110px)"
        },
        "#chat-list-con": {
            height: "100%"
        }
    }
};

function addCCNewStyle() {
    const cssRule = new CSSRule;
    cssRule.pushHideList(Object.values(hideSelectorList).flat());
    const transformedPrefSelectorList = Object.entries(Object.values(prefSelectorList).flat().reduce(((result, current) => ({
        ...result,
        ...current
    })))).map((([selector, rule]) => ({
        selector: selector,
        rule: rule
    })));
    cssRule.pushImportantList(transformedPrefSelectorList);
    cssRule.submit();
}

function addCCIframeNewStyle() {
    const cssRule = new CSSRule;
    cssRule.pushHideList(Object.values(anchor_end_countdownHideSelectorList).flat());
    cssRule.submit();
}

function freshListenerPushState(callback, s = 1) {
    let _pushState = window.history.pushState;
    window.history.pushState = function() {
        setTimeout(callback, s * 1e3);
        return _pushState.apply(this, arguments);
    };
}

const live = {
    id: "",
    historyId: ""
};

Object.defineProperty(live, "id", {
    get() {
        const liveIdMatch = document.URL.match(/https:\/\/cc.163.com\/(\d+)/);
        if (liveIdMatch && liveIdMatch[1]) {
            const liveId = liveIdMatch[1];
            sessionStorage.setItem("localLiveId", liveId);
            return liveId;
        }
        return "";
    }
});

Object.defineProperty(live, "historyId", {
    get() {
        return sessionStorage.getItem("localLiveId") || "";
    }
});

function equalLiveId() {
    freshListenerPushState((() => {
        if (live.historyId !== live.id) {
            window.close();
        }
    }));
}

function getElement(parent = document.body, selector, timeoutPerSecond = 0, getElementDelayPerSecond = 0) {
    return new Promise((resolve => {
        let result = parent.querySelector(selector);
        if (result) {
            return resolve(result);
        }
        let timer;
        const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
        if (mutationObserver) {
            const observer = new mutationObserver((mutations => {
                for (let mutation of mutations) {
                    for (let addedNode of mutation.addedNodes) {
                        if (addedNode instanceof Element) {
                            result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                            if (result) {
                                observer.disconnect();
                                timer && clearTimeout(timer);
                                setTimeout((() => resolve(result)), getElementDelayPerSecond * 1e3);
                            }
                        }
                    }
                }
            }));
            observer.observe(parent, {
                childList: true,
                subtree: true
            });
            if (timeoutPerSecond > 0) {
                timer = setTimeout((() => {
                    observer.disconnect();
                    return resolve(null);
                }), timeoutPerSecond * 1e3);
            }
        }
    }));
}

document.querySelector.bind(document);

const getEls = document.querySelectorAll.bind(document);

async function selectOriginBanSetting() {
    await getElement(document.body, ".ban-effect-list", 0, 1);
    const banList = getEls(".ban-effect-list > li:not(.selected)");
    banList.forEach((banItem => {
        banItem.click();
    }));
}

function isMatchURL(...regExpList) {
    const matchResultList = [];
    regExpList.forEach((regExp => {
        if (typeof regExp === "string") {
            regExp = new RegExp(regExp);
        }
        matchResultList.push(!!document.URL.match(regExp));
    }));
    return matchResultList.includes(true);
}

class EntryBranch {
    constructor() {
        __publicField(this, "branchList", []);
    }
    add(condition, callback) {
        this.branchList.push([ condition, callback ]);
    }
    run() {
        const entry = this.branchList.find((entry2 => entry2[0]()));
        if (entry) {
            entry[1]();
        }
    }
}

class GMConfigMenu {
    constructor(callback) {
        __publicField(this, "menuId", 0);
        __publicField(this, "callback");
        this.callback = callback;
    }
    open(title) {
        if (this.menuId) {
            this.close();
        }
        this.menuId = GM_registerMenuCommand(title, this.callback);
    }
    close() {
        GM_unregisterMenuCommand(this.menuId);
        this.menuId = 0;
    }
}

class GMStorage {
    constructor(key) {
        __publicField(this, "key");
        this.key = key;
    }
    set(value) {
        dispatchEvent(new CustomEvent("GMStorageUpdate", {
            detail: {
                newValue: value,
                oldValue: this.get(),
                target: this.key
            }
        }));
        GM_setValue(this.key, value);
    }
    get(defaultValue = null) {
        return GM_getValue(this.key, defaultValue);
    }
    remove() {
        dispatchEvent(new CustomEvent("GMStorageUpdate", {
            detail: {
                newValue: null,
                oldValue: this.get(),
                target: this.key
            }
        }));
        GM_deleteValue(this.key);
    }
}

class WhiteList extends GMStorage {
    constructor() {
        super("liveIdWhiteList");
    }
    get whiteList() {
        return this.get([ 361433, 239802416 ]);
    }
    add(liveId) {
        const whiteList2 = this.whiteList;
        whiteList2.push(liveId);
        this.set(whiteList2);
    }
    has(liveId) {
        return this.whiteList.includes(liveId);
    }
    delete(liveId) {
        this.set(this.whiteList.filter((whiteLiveId => whiteLiveId !== liveId)));
    }
}

const whiteList = new WhiteList;

function disabledNotWhiteListUrl(liveId) {
    if (!whiteList.has(liveId)) {
        window.close();
        return;
    }
}

function registerConfigBtn(liveId) {
    new GMConfigMenu((() => {
        const result = prompt(`输入需要添加白名单的直播间的数字Id (网页地址中的数字Id):\n当前白名单:\n[${whiteList.whiteList.join(", ")}]`);
        if (result) {
            whiteList.add(Number(result));
        }
    })).open("添加直播间白名单");
    new GMConfigMenu((() => {
        const result = prompt(`输入需要删除白名单的直播间数字Id(网页地址中的数字Id):\n当前白名单:\n[${whiteList.whiteList.join(", ")}]`, String(liveId || whiteList.whiteList[0] || ""));
        if (result) {
            whiteList.delete(Number(result));
        }
    })).open("删除直播间白名单");
}

async function mainPageEntry() {
    disabledNotWhiteListUrl(Number(live.id));
    registerConfigBtn(Number(live.id));
    addCCNewStyle();
    await selectOriginBanSetting();
    equalLiveId();
}

function iframeEntry() {
    addCCIframeNewStyle();
}

(async () => {
    const entryBranch = new EntryBranch;
    entryBranch.add((() => isMatchURL(/^https?:\/\/cc.163.com\/$/)), registerConfigBtn);
    entryBranch.add((() => isMatchURL(/^https?:\/\/cc.163.com\/(\d+)/)), mainPageEntry);
    entryBranch.add((() => isMatchURL("act/m/daily/anchor_end_countdown/index.html")), iframeEntry);
    entryBranch.run();
})();
