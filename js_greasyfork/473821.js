// ==UserScript==
// @name		抖音直播间净化
// @description		抖音直播界面美化. 
// @version		1.0.5
// @author		Yiero
// @match		https://live.douyin.com/*
// @icon		https://live.douyin.com/favicon.ico
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts/
// @license		GPL
// @run-at		document-start
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473821/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/473821/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E5%87%80%E5%8C%96.meta.js
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
        return [ this.header, ...msg ];
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
        return this;
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
        return this;
    }
    pushHide(selector) {
        this.pushImportant(selector, {
            display: "none"
        });
        return this;
    }
    pushHideList(selectorList) {
        selectorList.forEach((selector => {
            this.pushImportant(selector, {
                display: "none"
            });
        }));
        return this;
    }
    pushList(ruleList) {
        ruleList.forEach((({selector: selector, rule: rule}) => {
            this.push(selector, rule);
        }));
        return this;
    }
    pushImportantList(ruleList) {
        ruleList.forEach((({selector: selector, rule: rule}) => {
            this.pushImportant(selector, rule);
        }));
        return this;
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
        return this;
    }
}

function transformedHideSelectorList(prefSelectorList2) {
    return Object.values(prefSelectorList2).flat();
}

function transformedPrefSelectorList(prefSelectorList2) {
    return Object.entries(Object.values(prefSelectorList2).flat().reduce(((result, current) => ({
        ...result,
        ...current
    })))).map((([selector, rule]) => ({
        selector: selector,
        rule: rule
    })));
}

const hideSelectorList = {
    main: [ ".OkoVu3vW", ".douyin-sidebar, .G0S7YWl4" ],
    aside: [ ".N_HNXA04" ],
    header: [ ".CPQ46DEr", ".mNaEBJlG" ],
    liveTitle: [ ".s49a85m9 > button:nth-of-type(n + 2)", ".AbLfr3ao" ],
    live: [ ".f64hQYrh" ],
    fullscreenLive: [ ".is-theater .tgMCqIjJ" ],
    danmuBar: [ ".nex5gRxd", ".webcast-chatroom___bottom-message", ".OAJeuZUg" ]
};

const prefSelectorList = {
    live: {
        "#_douyin_live_scroll_container_ > div, .UKFpY5tW, .SxCiQ8ip": {
            height: "100%"
        },
        ".SxCiQ8ip": {
            padding: 0
        }
    },
    fullscreenLive: {
        ".is-theater > .EDvjMGPs.FKQqfehj": {
            height: "100%"
        }
    }
};

function douyinAddNewStyle() {
    const cssRule = new CSSRule;
    cssRule.pushHideList(transformedHideSelectorList(hideSelectorList)).pushImportantList(transformedPrefSelectorList(prefSelectorList)).submit();
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

(() => {
    if (!isMatchURL(/^https:\/\/live.douyin.com\/\d+/)) {
        return;
    }
    douyinAddNewStyle();
})();
