// ==UserScript==
// @name         barrage-keywords-stop
// @namespace    https://github.com/wuxin0011/tampermonkey-script/barrage-keywords-stop
// @version      0.0.4
// @author       wuxin0011
// @description  抖音、斗鱼、虎牙、bilibili弹幕关键字屏蔽，按下 ctrl+alt+k 即可激活🧨
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABIFJREFUWEe1l11oHFUUx//nzm6tgQa/GpudrSE0YgI+VAR9EE0LftGgxA9adDNbS7UPsTuJPkSwARVaQaE2mU0jpJbUmSw+iKVIG6lGaqQPGqiCPrSR2pBmZ1ut1opWa7J7j9zZ3Xaz2c1uku3A7jzMvef/u+eec+49hAU8HfbU/RL0CIGaQGgCvN9vAC54b8aIIDm2bPryiXe3Nv5VjmkqNWj7YKJRaNwO4AkQVpUan/5OvzBkTGMx1BMOnJxvzrwApuO+CUCJr/DMEg+D6ZhkTAqfb3K5zz85jctacsbXIJgbmPlOgBsY9CgB1QCSYI5a4eDrxSCKApiOOwLggawwS22/Fa4dLscDnbFf16bkzBsEPJ6dL5OyK/rCHT/nzy8IYNrxOIhuVfsqQJEeI3CoHOH8MRE7YQrCTgb7AZwUTKH8LZkDYDruKQB1YP4Bmmi3QoETixHPnWPabgyEpxWEJpLP7gnVncl+nwVwbSAfnhGpbe+H6v6omDjjYBqCP7WM4KY5AJmAew3ghGTfw33hVROVFLfCeijixC8R6AZm3hUNB3d68aH+vFTz8dfpaKeIZQQ+qLS4p+MkWgX4I09YUGtvKHDUAzBt1wLhJQCHLEN/7nqIZ22aTvwAQJvA2GeFddMDiNjuWSKsJJbresOrv10KwNU4YhxUbs+3paopk/gKoIRlBNZQRyzxEEs+CrBrGcGG6yme44XTAOmSuYUidrybiHagCHG5QKVWXjAtmXdTTo62W4Y+WK5gYYOF3Z5v03TcLQD61aLJdNzv1KlGgh7rDQVUJizoWcjKs4az286M7xXAv5m0WDDAYsSV1rW4wyUFMAXgtoV6YLHiuQDMuLCoLViK+CwA8DEF8DmAB8G8zQoHnVIBsFTxdOGLGyAaANCnsqALhLcADFmGrqph0acS4h6A4+4D0MbgTup0ptZJiM8ATFqG3lhMvVLiGQDvyBestVDX/lMrriyr/hHg21mI5miodmxO3mbP8yUWK6/sx87dR1KOAhizDL05fRY48V0EepWZh6Ph4DNLKTIlY8hx1WnYCokua7Me9QA67USTJFYr9xFxd29bcHc6WDI3mQqsPO36xIsAR0G4mJzx39u/peb81RuRacffBtErYMxYYb260uLb7fP1gpIjAAWYMBBt0zu8Apjrso6h+CfMtEHVaO/6VKGVdw5O3JTS/ANEpHqL48ll/qf6N9b8PQcgcuDsGtK0j72Op1LisfjaVIr6iXAPgAkN/if3GDWnswufcyvOxEMs03ZNE3Goty14uFRwFfqurmAascWMlQCmoaHFel4/nju2YF/wcixRp0nuVsUi7Sb6MCnle3s3B38qB8S0z20gkdrqbScAJoxqLKI9Ru2R/Pnzt2bpkrnD6xOA38EYBXiCmc4wY3z6PxqvqrkxmbryT70mqT6VQlAI2ZwVBjAOyD7LWF30kluyOVXeECkZEUTNDNxdjgcY/A0YX1Ytr4q+s/GWP+ebUxJgVpY47l1MtB7M6wHcPGsvCReZ5UhKaF/sDQUmywFVY/4HmMRRtLE+F8gAAAAASUVORK5CYII=
// @source       https://github.com/wuxin0011/tampermonkey-script/barrage-keywords-stop
// @supportURL   https://github.com/wuxin0011/tampermonkey-script/issues
// @match        https://www.huya.com/*
// @match        https://live.douyin.com/*
// @match        https://live.bilibili.com/*
// @match        https://www.douyu.com/*
// @downloadURL https://update.greasyfork.org/scripts/475878/barrage-keywords-stop.user.js
// @updateURL https://update.greasyfork.org/scripts/475878/barrage-keywords-stop.meta.js
// ==/UserScript==
const selectKeywordsLocal = "selectKeywordsLocal";

const isNoShowTipKey = "tip_isNoShowTipKey";

const isFisrtInstallKey = "isFisrtInstallKey";

const selectOnlyThieRoom = "selectOnlyThieRoom";

const isAnimationKey = "m_isAnimationKey";

const AnimationTimeKey = "m_time_isAnimationKey";

const defaultKeywords = [ "送出", "6666", "直播间" ];

const localLink = window.location.href;

const isDouYinLive = /https?:\/\/live\.douyin.*/.test(localLink);

const isHyLive = /https?:\/\/www\.huya\.com.+/.test(localLink);

const isDouyuLive = /https?:\/\/.*douyu.*(\/((.*rid=\d+)|(\d+)).*)$/.test(localLink);

const isBiliBiliLive = /https?:\/\/live\.bilibili.*/.test(localLink);

const isLocalHost = /127\..*/.test(localLink);

const MAX_ANIMATION_TIME = 2;

const DEFAULT_ANIMATION_TIME = .5;

const setItem = (k, v, isParse = false) => window.localStorage.setItem(k, isParse ? JSON.stringify(v) : v);

const getItem = (k, isParse = false) => isParse ? JSON.parse(window.localStorage.getItem(k)) : window.localStorage.getItem(k);

const isFisrtInstall = () => getItem(isFisrtInstallKey) == null || getItem(isFisrtInstallKey) !== isFisrtInstallKey;

const isNoShowTip = () => getItem(isNoShowTipKey) == null || getItem(isNoShowTipKey) !== isNoShowTipKey;

const getAnimationTime = () => getItem(AnimationTimeKey) == null ? DEFAULT_ANIMATION_TIME : isNaN(getItem(AnimationTimeKey)) ? DEFAULT_ANIMATION_TIME : getItem(AnimationTimeKey) > MAX_ANIMATION_TIME ? DEFAULT_ANIMATION_TIME : getItem(AnimationTimeKey);

const isOpenTranisition = () => getItem(isAnimationKey) == null || getItem(isAnimationKey) === isAnimationKey;

const selectKeywords = () => isFisrtInstall() || getItem(selectKeywordsLocal) == null ? defaultKeywords : getItem(selectKeywordsLocal, true);

const createRoomId = id => id ? `${selectOnlyThieRoom}_${id}` : `${selectOnlyThieRoom}_${localLink}`;

const getRoomId = () => {
    let match = null;
    try {
        if (!localLink) {
            return "";
        }
        if (isBiliBiliLive) {
            match = localLink.match(/https:\/\/live\.bilibili\..*\/(\d+).*/);
        } else if (isDouYinLive) {
            match = localLink.match(/https:\/\/live\.douyin\..*\/(\d+).*/);
        } else if (isHyLive) {
            match = localLink.match(/https:\/\/www\.huya\.com\/(.*)/);
        } else if (isDouyuLive) {
            if (/.*rid=(\d+).*/.test(localLink)) {
                match = localLink.match(/rid=(\d+)/);
            } else if (localLink.match(/https:\/\/www\.douyu\.com\/(\d+).*/)) {
                match = localLink.match(/https:\/\/www\.douyu\.com\/(\d+).*/);
            }
        }
    } catch (error) {}
    if (match !== null && match.length >= 1) {
        return match[1];
    }
    return localLink;
};

const isFull = () => {
    if ("fullscreenElement" in document) {
        return !!document["fullscreenElement"];
    }
    if ("webkitFullscreenElement" in document) {
        return !!document["webkitFullscreenElement"];
    }
    if ("mozFullScreenElement" in document) {
        return !!document["mozFullScreenElement"];
    }
    if ("msFullscreenElement" in document) {
        return !!document["msFullscreenElement"];
    }
};

const roomId = () => createRoomId(getRoomId());

const selectOnlyThisRoomsKeywords = () => getItem(roomId()) == null ? defaultKeywords : getItem(roomId(), true);

const MARK = "dm-mark-version";

const MARK_TAG = (t = 0) => `mark-version-${t}`;

const removeDom = (dom, r = false) => {
    try {
        dom.style.display = "none";
        if (r) {
            dom.remove();
        }
    } catch (ignore) {}
};

const SUPPORT = {
    HY: "HY_LIVE",
    DOUYIN: "DOUYIN_LIVE",
    DOUYU: "DOUYU_LIVE",
    BILIBILI: "BILIBILI_LIVE",
    LOCALHOST: "LOCALHOST_LIVE"
};

const TAG_TYPE = {
    [SUPPORT.DOUYIN]: [ ".xgplayer-danmu>div[data-line-index]", ".webcast-chatroom___list .webcast-chatroom___item", ".xgplayer-danmu div" ],
    [SUPPORT.HY]: [ "#player-video #danmuwrap #danmudiv .danmu-item", "#player-video #danmuwrap #danmudiv #danmudiv2", "#player-marquee-wrap .player-marquee-noble-item", "#player-marquee-wrap .player-banner-enter", "#chat-room__list>div[data-cmid]" ],
    [SUPPORT.BILIBILI]: [ ".web-player-danmaku .danmaku-item-container .bili-dm", "#chat-items .chat-item" ],
    [SUPPORT.DOUYU]: [ "#douyu_room_normal_player_danmuDom .ani-broadcast", "#js-barrage-container #js-barrage-list li" ],
    [SUPPORT.LOCALHOST]: [ "video" ]
};

const style = `\n \n  .m-dm-container {\n    --dm-container-width: 500px;\n    --dm-container-height: 300px;\n    --dm-input-add-keywords-width: 120px;\n    --dm-input-time-width: 20px;\n    --dm-container-background-color: 30, 23, 37;\n    --dm-font-color: #fff;\n    --dm-font-color-hover: #000;\n    --dm-background-color: 0, 0, 0;\n    --dm-background-color-hover: #fff;\n    --dm-border-color: #fff;\n    --dm-border-color-hover: #000;\n  }\n\n\n\n\n  .m-dm-container {\n    width: var(--dm-container-width) ;\n    height: var(--dm-container-height) ;\n    background-color: rgba(var(--dm-container-background-color), 1) ;\n    position: fixed ;\n    display: flex ;\n    flex-direction: column ;\n    box-sizing: border-box ;\n    box-shadow: 2px 2px 10px rgba(var(--dm-background-color), 0.7) ;\n    border-radius: 10px ;\n    position: fixed ;\n    right: 0 ;\n    top: 100px ;\n    border: none ;\n    transition: transform ease-in-out 0.5s ;\n    z-index: 999999 ;\n    box-sizing: border-box ;\n    padding: 10px ;\n  }\n\n  .m-dm-input-animation-time,\n  .m-dy-input-add-keywords {\n    width: var(--dm-input-add-keywords-width) ;\n    padding: 8px 12px ;\n    border: none ;\n    outline: none ;\n    margin-left: 10px ;\n    margin-top: 10px ;\n    border-radius: 10px ;\n  }\n\n  .m-dm-input-animation-time,\n  .m-dy-input-add-keywords:focus {\n    border: none ;\n    outline: none ;\n  }\n\n  .m-dm-input-animation-time {\n    width: var(--dm-input-time-width) ;\n  }\n\n  .m-dm-install-link {\n    display:inline-block ;\n    float:right ;\n    right:5px ;\n    color: var(--dm-font-color) ;\n  }\n\n\n\n  .m-dm-container-header,\n  .m-dm-container-footer {\n    height: 44px ;\n    position: relative  ;\n  }\n\n  .m-dm-container-header #m-dm-close-btn {\n    float:right ;\n    right: 3px ;\n    color: var(--dm-font-color) ;\n    font-size: 30px ;\n    cursor: pointer  ;\n    position: absolute  ;\n  }\n\n\n  .m-dm-container-body {\n    flex: 1 ;\n    overflow: auto ;\n  }\n\n  .m-dm-keywords-tag {\n    display: inline-block ;\n    padding: 5px ;\n    background-color: var(--dm-background-color) ;\n    border: none ;\n    margin: 5px ;\n    cursor: pointer ;\n    color: var(--dm-font-color) ;\n    font-size: 12px ;\n    outline: 1px solid var(--dm-border-color) ;\n    border-radius: 10px ;\n  }\n\n  .m-dm-keywords-tag:hover {\n    background-color:var(--dm-font-color);\n    color:var(--dm-font-color-hover);\n  }\n\n\n  .m-dm-time-button,\n  .m-dm-all-keywords-button,\n  .m-dm-delete-keywords-button,\n  .m-dm-add-keywords-button {\n    display: inline-block ;\n    padding: 4px 8px ;\n    text-align: center ;\n    border: none ;\n    outline: none ;\n    background-color: var(--dm-background-color-hover) ;\n    color: var(--dm-font-color-hover) ;\n    cursor: pointer ;\n    border: 1px solid var(--dm-border-color) ;\n    border-radius: 10px ;\n  }\n\n  \n  .m-dm-time-button:hover,\n  .m-dm-all-keywords-button:hover,\n  .m-dm-delete-keywords-button:hover,\n  .m-dm-add-keywords-button:hover {\n    background-color: rgb(var(--dm-background-color)) ;\n    color: var(--dm-font-color) ;\n    border: 1px solid var(--dm-border-color) ;\n\n  }\n\n  .m-dm-container-footer {\n    box-sizing: border-box ;\n    padding: 10px ;\n  }\n\n  .m-dm-container-footer .message-tip{\n    color: var(--dm-font-color) ;\n    opacity:1;\n    display:inline-block;\n    transition:opacity 0.5s ease-out;\n  }\n\n\n  .m-dm-ani-close {\n    transform: translateX(var(--dm-container-width)) ;\n  }\n\n  .m-dm-container-body {\n    overflow: auto ;\n    -webkit-overflow-scrolling: touch ;\n    scrollbar-width: thin ;\n    scrollbar-color: #888888 #f0f0f0 ;\n    -webkit-overflow-scrolling: touch ;\n    scrollbar-width: none ;\n    -ms-overflow-style: none ;\n  }\n\n\n\n  .m-dm-container-body::-webkit-scrollbar {\n    width: 4px ;\n  }\n\n  .m-dm-container-body::-webkit-scrollbar-track {\n    background-color: rgb(22, 24, 35) ;\n  }\n\n  .m-dm-container-body::-webkit-scrollbar-thumb {\n    background-color: #333 ;\n    border-radius: 4px ;\n  }\n\n\n  \n  `;

const containerDOMStr = ` \n    <div class="m-dm-container-header">\n      <input type="text" class="m-dy-input-add-keywords" placeholder="请输入关键字">\n      <div class="m-dm-add-keywords-button">确认</div>\n      <div class="m-dm-all-keywords-button" title="当前弹幕仅在房间内生效,点击切换到全房间">房间</div>\n      <div class="m-dm-delete-keywords-button">清空</div>\n      <input type="checkbox" class="m-dm-animation-checkbox" id="m-dm-animation-checkbox" title="如果弹幕区出现抖动，添加一个过渡可能好点">\n      <input type="text"  class="m-dm-input-animation-time" id="m-dm-input-animation-time" title="自定义输出一个过渡时间,默认为0.5s,建议数字大小在0-1之间" placeholder="请输入弹幕过渡时间">\n      <div class="m-dm-time-button">确认</div>\n      <span title="收起 使用 ctrl+alt+k可唤醒 我哦" class="m-dm-close-btn" id="m-dm-close-btn"> &times </span>\n    </div>\n    <div class="m-dm-container-body"></div>\n    <div class="m-dm-container-footer">\n       <p class="message-tip"></p>\n      <a href="https://greasyfork.org/zh-CN/scripts/475878-barrage-keywords-stop"  target="_blank" title="更新" class="m-dm-install-link">反馈</a>\n    </div>\n`;

class BarrageKeywordsStop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        const css = document.createElement("style");
        css.innerHTML = style;
        this.shadowRoot.appendChild(css);
    }
    createContainer(tagName, isShow, isBefore = false) {
        var _a;
        if (!tagName) {
            return null;
        }
        const c = document.querySelector(tagName);
        if (!c) {
            console.log("当前容器不存在！请检查", tagName);
            return null;
        }
        const plugin = document.createElement("barrage-keywords-stop");
        const shadowRoot = plugin.shadowRoot;
        const dmContainer = document.createElement("div");
        dmContainer.className = `m-dm-container ${isFisrtInstall() || isShow ? "" : "m-dm-ani-close"} `;
        dmContainer.innerHTML = containerDOMStr;
        const tip = dmContainer.querySelector(".m-dm-container-footer .message-tip");
        tip.textContent = isNoShowTip() ? "使用ctrl+alt+k可唤醒或者关闭哦！" : "";
        shadowRoot.appendChild(dmContainer);
        if (isBefore) {
            (_a = c === null || c === void 0 ? void 0 : c.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(plugin, c.nextSibling);
        } else {
            c.append(plugin);
        }
        return dmContainer;
    }
}

(function() {
    if (typeof window === undefined) {
        return;
    }
    const tipTimeout = 2e3;
    let isAnimation = false;
    let animationTime = DEFAULT_ANIMATION_TIME;
    let nodeVersion = 0;
    let beforeTag = null;
    let keywordsCache = [];
    let tipMessageElement = null;
    let isStart = false;
    let tagInitSuccess = true;
    let isAllRooms = false;
    let isSupport = true;
    let currentContainer = null;
    let requestAnimationFrameTimer = 0;
    let BARRAGE_CONTAINER = [];
    const contains = text => {
        if (!text) {
            return false;
        }
        for (let index = 0; index < keywordsCache.length; index++) {
            if (keywordsCache[index] && text.indexOf(keywordsCache[index]) !== -1) {
                return true;
            }
        }
        return false;
    };
    let findBarrages = () => {
        const findTargetText = selector => {
            if (!selector) {
                return;
            }
            const nodes = document.querySelectorAll(`${selector} :not([${MARK}="${MARK_TAG(nodeVersion)}"])`);
            for (let index = 0; index < nodes.length; index++) {
                const node = nodes[index];
                if (node instanceof HTMLElement) {
                    if (contains(node === null || node === void 0 ? void 0 : node.textContent)) {
                        if (isAnimation) {
                            node.style.opacity = "0";
                            node.style.transition = `opacity ${animationTime}s ease-out`;
                            node.addEventListener("transitionend", (() => {
                                removeDom(node, true);
                            }));
                        } else {
                            removeDom(node, true);
                        }
                    }
                    node.setAttribute(MARK, MARK_TAG(nodeVersion));
                }
            }
        };
        for (let i = 0; i < BARRAGE_CONTAINER.length; i++) {
            findTargetText(BARRAGE_CONTAINER[i]);
        }
        requestAnimationFrameTimer = window.requestAnimationFrame(findBarrages);
    };
    const installBeforeInfo = () => {
        console.log("欢迎使用弹幕屏蔽插件...");
        console.log("是否是首次安装", isFisrtInstall() ? "是" : "否");
        console.log("是否不需要快捷键提示", isNoShowTip() ? "需要" : "不需要");
    };
    const keywordsUpdate = array => {
        if (!Array.isArray(array)) {
            array = [];
        }
        isAllRooms ? setItem(selectKeywordsLocal, array, true) : setItem(roomId(), array, true);
        notify();
    };
    const removeKeywords = text => {
        if (!Array.isArray(keywordsCache)) {
            return;
        }
        const index = keywordsCache.findIndex((t => t == text));
        if (index >= 0) {
            addTipMessageText(`关键词 ${text} 已移除`);
            keywordsCache.splice(index, 1);
            keywordsUpdate([ ...keywordsCache ]);
        }
    };
    const createKeywords = text => {
        if (!Array.isArray(keywordsCache)) {
            keywordsCache = [];
        }
        const index = keywordsCache.findIndex((t => t == text));
        if (index === -1) {
            addTipMessageText(`关键词 ${text} 已添加`);
            keywordsCache = [ text, ...keywordsCache ];
            keywordsUpdate(keywordsCache);
        }
    };
    customElements.define("barrage-keywords-stop", BarrageKeywordsStop);
    const initInfo = () => {
        keywordsCache = [];
        if (Array.isArray(selectOnlyThisRoomsKeywords())) {
            keywordsCache = [ ...new Set(selectOnlyThisRoomsKeywords()) ];
        }
        if (Array.isArray(selectKeywords())) {
            keywordsCache = [ ...new Set([ ...keywordsCache, ...selectKeywords() ]) ];
        }
        isAnimation = isOpenTranisition();
        animationTime = getAnimationTime();
        console.log("是否开启动画过渡效果🕢:", isAnimation ? "开启了弹幕过渡效果" : "关闭了弹幕过渡效果");
        console.log("弹幕过渡时长🕑:", animationTime, "s");
        console.log("重新扫描中...当前关键词🧹:", keywordsCache);
    };
    const notify = () => {
        try {
            window.cancelAnimationFrame(requestAnimationFrameTimer);
            initInfo();
            if (Array.isArray(keywordsCache) && keywordsCache.length > 0) {
                nodeVersion = nodeVersion + 2;
                findBarrages();
                setTimeout((() => {
                    addTipMessageText("弹幕重新扫描中...🚀");
                }), tipTimeout);
            } else {
                addTipMessageText("当前标签为空！停止扫描！🧹");
            }
        } catch (error) {
            addTipMessageText("弹幕插件出现异常了😭");
        }
    };
    const addOperationEvent = () => {
        let dmContainer = currentContainer;
        if (!dmContainer) {
            console.error("获取不到弹幕容器");
            return;
        }
        dmContainer = dmContainer;
        const dmInput = dmContainer.querySelector(".m-dy-input-add-keywords");
        const dmAnimationCheckbox = dmContainer.querySelector("#m-dm-animation-checkbox");
        const dmAniTimeInput = dmContainer.querySelector("#m-dm-input-animation-time");
        const dmTimeButton = dmContainer.querySelector(".m-dm-time-button");
        const dmBody = dmContainer.querySelector(".m-dm-container-body");
        const dmAddButton = dmContainer.querySelector(".m-dm-add-keywords-button");
        const dmChangeButton = dmContainer.querySelector(".m-dm-all-keywords-button");
        const dmCloseButton = dmContainer.querySelector("#m-dm-close-btn");
        const dmDeleteButton = dmContainer.querySelector(".m-dm-delete-keywords-button");
        if (!dmInput || !dmAddButton || !dmBody) {
            console.log("element has null");
            return;
        }
        tipMessageElement = dmContainer.querySelector(".m-dm-container-footer .message-tip");
        const find = text => keywordsCache.find((t => t == text));
        const add = () => {
            const text = dmInput.value;
            if (!text) {
                addTipMessageText("请输入关键字!");
                return;
            }
            if (find(text)) {
                addTipMessageText(`添加失败，关键词${text}已存在！😭`);
                dmInput.value = "";
                return;
            }
            createTag(dmBody, text);
            createKeywords(text);
            setItem(isFisrtInstallKey, isFisrtInstallKey);
            dmInput.value = "";
            notify();
        };
        dmInput.addEventListener("keydown", (event => {
            if (event.key === "Enter") {
                add();
            }
        }));
        dmAddButton.addEventListener("click", (() => {
            add();
        }));
        dmCloseButton.addEventListener("click", (() => {
            if (dmContainer.classList.contains("m-dm-ani-close")) {
                dmContainer.classList.remove("m-dm-ani-close");
            } else {
                dmContainer.classList.add("m-dm-ani-close");
            }
        }));
        dmChangeButton.addEventListener("click", (() => {
            isAllRooms = !isAllRooms;
            createTags();
            dmChangeButton.textContent = isAllRooms ? "全房间" : "房间";
            dmChangeButton.title = isAllRooms ? "当前弹幕在所有直播间生效,点击切换房间" : "当前弹幕仅在该房间生效，点击切换到全房间";
            addTipMessageText(`切换成功 ${isAllRooms ? "当前弹幕在所有直播间生效🧱" : "当前弹幕仅在该房间生效🚀"}`);
        }));
        dmAnimationCheckbox.checked = isOpenTranisition();
        dmAnimationCheckbox.addEventListener("change", (() => {
            setItem(isAnimationKey, dmAnimationCheckbox.checked ? isAnimationKey : `NO_${isAnimationKey}`);
            addTipMessageText(`弹幕过渡效果${dmAnimationCheckbox.checked ? `已开启,过渡时间${dmAniTimeInput.value}s` : "已关闭"}`);
            notify();
        }));
        dmAniTimeInput.value = getAnimationTime();
        const addTime = () => {
            if (isNaN(Number(dmAniTimeInput.value)) || (Number(dmAniTimeInput.value) < 0 || Number(dmAniTimeInput.value) > MAX_ANIMATION_TIME)) {
                addTipMessageText(`请输入0-${MAX_ANIMATION_TIME}的数字`);
                dmAniTimeInput.value = String(animationTime);
                return;
            }
            setItem(AnimationTimeKey, dmAniTimeInput.value);
            addTipMessageText(`弹幕过渡效果${isOpenTranisition() ? `已开启,过渡时间${dmAniTimeInput.value}s` : "已关闭,需要开启才能生效哦！"}`);
            notify();
        };
        dmAniTimeInput.addEventListener("keydown", (event => {
            if (event.key === "Enter") {
                addTime();
            }
        }));
        dmTimeButton.addEventListener("click", (event => {
            addTime();
        }));
        dmDeleteButton.addEventListener("click", (() => {
            if (confirm("确认清空？")) {
                removeTags();
                keywordsCache = [];
                setItem(isAllRooms ? selectKeywordsLocal : roomId(), keywordsCache, true);
                addTipMessageText(`${isAllRooms ? "全房间" : "该房间"}关键词标签已清空！`);
                notify();
            }
        }));
        console.log("响应事件监听完毕...");
    };
    const addTipMessageText = (text, wait = tipTimeout) => {
        if (!tipMessageElement) {
            return;
        }
        tipMessageElement.style.opacity = "1";
        tipMessageElement.textContent = text;
        setTimeout((() => {
            tipMessageElement.style.opacity = "0";
        }), wait);
    };
    const handleFullScreenChange = () => {
        removeDom(currentContainer, true);
        currentContainer = null;
        console.log("容器重新生成中....");
        if (isFull()) {
            createContainer("video", false, true);
        } else {
            createContainer("body", false);
        }
    };
    const addFullScreenEvent = () => {
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
        document.addEventListener("mozfullscreenchange", handleFullScreenChange);
        document.addEventListener("MSFullscreenChange", handleFullScreenChange);
    };
    const addCtrlAltKEvent = () => {
        document.addEventListener("keydown", (function(event) {
            if (event.ctrlKey && event.altKey && event.key === "k") {
                const dmContainer = currentContainer;
                if (!dmContainer) {
                    return;
                }
                if (dmContainer.classList.contains("m-dm-ani-close")) {
                    dmContainer.classList.remove("m-dm-ani-close");
                    setItem(isFisrtInstallKey, isFisrtInstallKey);
                } else {
                    dmContainer.classList.add("m-dm-ani-close");
                }
            }
        }));
    };
    const createTag = (dmBody, text) => {
        if (!currentContainer) {
            return;
        }
        if (!dmBody) {
            dmBody = currentContainer.querySelector(".m-dm-container-body");
        }
        if (!dmBody) {
            return;
        }
        if (!text) {
            console.log("关键词内容不能为空！ ");
            return;
        }
        const dmTag = document.createElement("span");
        dmTag.className = "m-dm-keywords-tag";
        dmTag.textContent = `${text}`;
        dmTag.title = `点击移除关键字: ${text}`;
        dmTag.addEventListener("click", (() => {
            removeKeywords(text);
            dmTag.remove();
        }));
        !!beforeTag ? dmBody.appendChild(dmTag) : dmBody.insertBefore(dmTag, beforeTag);
        beforeTag = dmTag;
    };
    const removeTags = () => {
        if (!currentContainer) {
            return;
        }
        const allTags = currentContainer.querySelectorAll(".m-dm-container-body .m-dm-keywords-tag");
        if (allTags && allTags.length > 0) {
            for (let i = 0; i < allTags.length; i++) {
                removeDom(allTags[i], true);
            }
        }
    };
    const createTags = () => {
        if (!currentContainer) {
            return;
        }
        removeTags();
        const dmBody = currentContainer.querySelector(".m-dm-container .m-dm-container-body");
        if (!dmBody) {
            return;
        }
        const keys = isAllRooms ? selectKeywords() : [ ...selectOnlyThisRoomsKeywords() ];
        if (!Array.isArray(keys)) {
            return;
        }
        for (let i = 0; i < keys.length; i++) {
            createTag(dmBody, keys[i]);
        }
        console.log("标签创建完毕....");
    };
    const createContainer = (tagName = "body", isShow = true, isBefore = false) => {
        currentContainer = (new BarrageKeywordsStop).createContainer(tagName, isShow, isBefore);
        if (!currentContainer) {
            isSupport = false;
            console.log("当前容器不存在！请检查", tagName);
            return;
        }
        console.log("弹幕容器创建完毕....");
        addOperation();
    };
    const addOperation = () => {
        if (!isSupport) {
            console.warn("不支持哦初始化失败");
            return;
        }
        if (!currentContainer) {
            console.log("未找到弹幕容器... ");
            return;
        }
        createTags();
        addOperationEvent();
        console.log("一切准备就绪！");
        notify();
    };
    const initDom = () => {
        addCtrlAltKEvent();
        addFullScreenEvent();
        if (isFisrtInstall()) {
            setTimeout((() => {
                createContainer("body", false);
            }), 5e3);
        } else {
            createContainer("body", false);
        }
    };
    const initTag = type => {
        if (!TAG_TYPE[type]) {
            tagInitSuccess = false;
            return;
        }
        BARRAGE_CONTAINER = TAG_TYPE[type];
        tagInitSuccess = !!BARRAGE_CONTAINER && Array.isArray(BARRAGE_CONTAINER) && BARRAGE_CONTAINER.length > 0;
    };
    const start = () => {
        if (isStart) {
            return;
        }
        console.log("弹幕插件执行中...");
        installBeforeInfo();
        if (isDouYinLive) {
            initTag(SUPPORT.DOUYIN);
        } else if (isHyLive) {
            initTag(SUPPORT.HY);
        } else if (isBiliBiliLive) {
            initTag(SUPPORT.BILIBILI);
        } else if (isDouyuLive) {
            initTag(SUPPORT.DOUYU);
        } else if (isLocalHost) {
            initTag(SUPPORT.LOCALHOST);
            isSupport = true;
        } else {
            isSupport = false;
        }
        if (!tagInitSuccess) {
            console.log("标签初始化失败！");
            return;
        }
        if (isSupport) {
            initDom();
        } else {
            console.log("对不起不支持当前网址!", localLink);
        }
        isStart = true;
    };
    start();
})();
