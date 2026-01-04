// ==UserScript==
// @name		Quin动态快捷跳转直播间
// @name:en		BiliQuinDynamicLiveLinkJump
// @description		Quin动态, 快捷跳转直播间
// @description:en		Quin动态直播间链接快捷跳转
// @author		Yiero
// @version		1.0.1
// @match		https://t.bilibili.com/*
// @icon		https://t.bilibili.com/favicon.ico
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts/
// @license		GPL
// @run-at		document-idle
// @downloadURL https://update.greasyfork.org/scripts/474421/Quin%E5%8A%A8%E6%80%81%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/474421/Quin%E5%8A%A8%E6%80%81%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
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

class EntryBranch {
    constructor() {
        __publicField(this, "branchList", []);
    }
    add(condition, callback) {
        if (typeof condition === "boolean") {
            this.branchList.push([ () => condition, callback ]);
        } else {
            this.branchList.push([ condition, callback ]);
        }
        return this;
    }
    default(callback) {
        this.add(true, callback);
        return this;
    }
    run() {
        const entry = this.branchList.find((entry2 => entry2[0]()));
        if (entry) {
            new Info("EntryBranch").log("进入分支", entry);
            entry[1]();
        }
    }
}

function elementWaiter(selector, parent = document.body, timeoutPerSecond = 0, delayPerSecond = 0) {
    parent || (parent = document.body);
    const entryBranch = new EntryBranch;
    return new Promise(((resolve, reject) => {
        function returnElement(element) {
            if (!element) {
                reject(new Error("void Element"));
                return;
            }
            setTimeout((() => {
                dispatchEvent(new CustomEvent("getElement", {
                    detail: element
                }));
                resolve(element);
            }), delayPerSecond * 1e3);
        }
        entryBranch.add((() => !!document.querySelector(selector)), (() => {
            returnElement(document.querySelector(selector));
        })).add((() => !!MutationObserver), (() => {
            const timer = timeoutPerSecond && window.setTimeout((() => {
                observer.disconnect();
                returnElement();
            }), timeoutPerSecond * 1e3);
            const observer = new MutationObserver(observeElementCallback);
            function observeElementCallback(mutations) {
                mutations.forEach((mutation => {
                    mutation.addedNodes.forEach((addNode => {
                        if (!(addNode instanceof HTMLElement)) {
                            return;
                        }
                        const element = addNode.matches(selector) ? addNode : addNode.querySelector(selector);
                        if (element) {
                            timer && clearTimeout(timer);
                            returnElement(element);
                        }
                    }));
                }));
            }
            observer.observe(parent, {
                subtree: true,
                childList: true
            });
        })).default((() => {
            const intervalDelay = 500;
            let intervalCounter = 0;
            const maxIntervalCounter = Math.ceil((timeoutPerSecond * 1e3 || 20 * 1e3) / intervalDelay);
            const timer = window.setInterval((() => {
                if (++intervalCounter > maxIntervalCounter) {
                    clearInterval(timer);
                    returnElement();
                    return;
                }
                const element = parent.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    returnElement(element);
                }
            }), intervalDelay);
        })).run();
    }));
}

class DynamicLoad {
    constructor() {
        this.updateObserver();
    }
    get get() {
        return Array.from(document.querySelectorAll(".bili-dyn-list__item"));
    }
    updateObserver() {
        const dynamicUpdateObserver = new MutationObserver((recordList => {
            const appendDynamicList = [];
            recordList.forEach((record => {
                record.addedNodes.forEach((addNode => {
                    appendDynamicList.push(addNode);
                }));
            }));
            window.dispatchEvent(new CustomEvent("dynamicUpdate", {
                detail: appendDynamicList
            }));
        }));
        dynamicUpdateObserver.observe(document.querySelector(".bili-dyn-list__items"), {
            childList: true
        });
    }
}

function isQuin(dynamicDom) {
    var _a;
    const upName = (_a = dynamicDom.querySelector(".bili-dyn-title__text")) == null ? void 0 : _a.innerText;
    return upName === "Mr.Quin";
}

function addQuinLiveBtn(dynamicDom) {
    if (!isQuin(dynamicDom)) {
        return;
    }
    const domList = {
        dynamicItem: dynamicDom,
        firstMoreBtn: dynamicDom.querySelector(".bili-dyn-more__menu__item"),
        popoverContainer: dynamicDom.querySelector(".bili-popover"),
        moreMenu: dynamicDom.querySelector(".bili-dyn-more__menu")
    };
    const dynamicItem = dynamicDom;
    const CCLiveLinkBtn = domList.firstMoreBtn.cloneNode();
    CCLiveLinkBtn.dataset.type = "THREE_POINT_CC_LIVE_LINK";
    CCLiveLinkBtn.innerHTML = '<a href="https://cc.163.com/361433/" target="_blank">跳转CC</a>';
    CCLiveLinkBtn.onclick = () => domList.popoverContainer.style.display = "none";
    const douyinLiveLinkBtn = dynamicItem.querySelector(".bili-dyn-more__menu__item").cloneNode();
    douyinLiveLinkBtn.dataset.type = "THREE_POINT_DOUYIN_LIVE_LINK";
    douyinLiveLinkBtn.innerHTML = '<a href="https://live.douyin.com/200525029536" target="_blank">跳转抖音</a>';
    douyinLiveLinkBtn.onclick = () => domList.popoverContainer.style.display = "none";
    domList.moreMenu.appendChild(CCLiveLinkBtn);
    domList.moreMenu.appendChild(douyinLiveLinkBtn);
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

(async () => {
    (new EntryBranch).add(isMatchURL("^https://t.bilibili.com/"), handlerBindQuinLiveBtn).run();
    async function handlerBindQuinLiveBtn() {
        await elementWaiter(".bili-dyn-list__item");
        const dynamicLoad = new DynamicLoad;
        const dynamicList = dynamicLoad.get;
        dynamicList.forEach(addQuinLiveBtn);
        window.addEventListener("dynamicUpdate", (e => {
            const result = e;
            const dynamicList2 = result.detail;
            dynamicList2.forEach(addQuinLiveBtn);
        }));
    }
})();
