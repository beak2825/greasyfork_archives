// ==UserScript==
// @name         YouTube Enhancer
// @name:ar      محسن يوتيوب
// @description  Bypasses YouTube age restrictions and enables high-definition video and audio downloads with subtitle support, provided free of charge without advertisements.
// @description:ar  يتجاوز قيود العمر على يوتيوب ويمكّن تحميل الفيديوهات والصوتيات بجودة عالية مع دعم الترجمة، مقدم مجانًا بدون إعلانات.
// @version      1.0
// @author       Mohammed bin Salman Al Saud
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-start
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @match        https://youtu.be/*
// @match        https://*.youtube.com/*
// @namespace https://greasyfork.org/users/1473452
// @downloadURL https://update.greasyfork.org/scripts/536852/YouTube%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/536852/YouTube%20Enhancer.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const localization = {
        en: {
            downloadText: "Download",
            error: {
                addNormalButton: "Error adding download button:",
                addShortsButton: "Error adding Shorts download button:"
            }
        },
        ar: {
            downloadText: "تنزيل",
            error: {
                addNormalButton: "خطأ أثناء إضافة زر التنزيل:",
                addShortsButton: "خطأ أثناء إضافة زر تنزيل Shorts:"
            }
        }
    };

    GM_addStyle(`
        .download-btn {
            background: #f2f2f2;
            border: none;
            border-radius: 18px;
            color: #0f0f0f;
            padding: 0 16px;
            height: 36px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
        }
        .download-btn:hover {
            background: #e6e6e6;
        }
        .buttons-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `);

    const Config = window[Symbol()] = {
        UNLOCKABLE_PLAYABILITY_STATUSES: ["AGE_VERIFICATION_REQUIRED", "AGE_CHECK_REQUIRED", "CONTENT_CHECK_REQUIRED", "LOGIN_REQUIRED"],
        VALID_PLAYABILITY_STATUSES: ["OK", "LIVE_STREAM_OFFLINE"],
        ACCOUNT_PROXY_SERVER_HOST: "https://youtube-proxy.zerody.one",
        VIDEO_PROXY_SERVER_HOST: "https://ny.4everproxy.com",
        ENABLE_UNLOCK_CONFIRMATION_EMBED: true,
        ENABLE_UNLOCK_NOTIFICATION: true,
        SKIP_CONTENT_WARNINGS: true,
        GOOGLE_AUTH_HEADER_NAMES: ["Authorization", "X-Goog-AuthUser", "X-Origin"],
        BLURRED_THUMBNAIL_SQP_LENGTHS: [32, 48, 56, 68, 72, 84, 88]
    };

    const nativeJSONParse = window.JSON.parse;
    const nativeXMLHttpRequestOpen = window.XMLHttpRequest.prototype.open;
    const isDesktop = window.location.host !== "m.youtube.com";
    const isMusic = window.location.host === "music.youtube.com";
    const isEmbed = window.location.pathname.indexOf("/embed/") === 0;
    const isConfirmed = window.location.search.includes("unlock_confirmed");

    function isGoogleVideoUrl(url) {
        return url.host.includes(".googlevideo.com");
    }

    function isGoogleVideoUnlockRequired(googleVideoUrl, lastProxiedGoogleVideoId) {
        const urlParams = new URLSearchParams(googleVideoUrl.search);
        return urlParams.get("gcr") && urlParams.get("id") === lastProxiedGoogleVideoId;
    }

    class Deferred {
        constructor() {
            return Object.assign(new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            }), this);
        }
    }

    if (window.trustedTypes && trustedTypes.createPolicy && !trustedTypes.defaultPolicy) {
        const passThroughFn = x => x;
        trustedTypes.createPolicy("default", {
            createHTML: passThroughFn,
            createScriptURL: passThroughFn,
            createScript: passThroughFn
        });
    }

    function createElement(tagName, options) {
        const node = document.createElement(tagName);
        options && Object.assign(node, options);
        return node;
    }

    function isObject(obj) {
        return obj !== null && typeof obj === "object";
    }

    function findNestedObjectsByAttributeNames(object, attributeNames) {
        let results = [];
        if (attributeNames.every(key => typeof object[key] !== "undefined")) results.push(object);
        Object.keys(object).forEach(key => {
            if (object[key] && typeof object[key] === "object") {
                results.push(...findNestedObjectsByAttributeNames(object[key], attributeNames));
            }
        });
        return results;
    }

    function pageLoaded() {
        if (document.readyState === "complete") return Promise.resolve();
        const deferred = new Deferred();
        window.addEventListener("load", deferred.resolve, { once: true });
        return deferred;
    }

    function createDeepCopy(obj) {
        return nativeJSONParse(JSON.stringify(obj));
    }

    function getYtcfgValue(name) {
        return window.ytcfg?.get(name);
    }

    function getSignatureTimestamp() {
        const playerBaseJsPath = document.querySelector('script[src*="/base.js"]')?.src;
        if (!playerBaseJsPath) return getYtcfgValue("STS");
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", playerBaseJsPath, false);
        xmlhttp.send(null);
        return parseInt(xmlhttp.responseText.match(/signatureTimestamp:([0-9]*)/)?.[1]);
    }

    function isUserLoggedIn() {
        if (typeof getYtcfgValue("LOGGED_IN") === "boolean") return getYtcfgValue("LOGGED_IN");
        if (typeof getYtcfgValue("DELEGATED_SESSION_ID") === "string" || parseInt(getYtcfgValue("SESSION_INDEX")) >= 0) return true;
        return false;
    }

    function getCurrentVideoStartTime(currentVideoId) {
        if (window.location.href.includes(currentVideoId)) {
            const urlParams = new URLSearchParams(window.location.search);
            const startTimeString = (urlParams.get("t") || urlParams.get("start") || urlParams.get("time_continue"))?.replace("s", "");
            if (startTimeString && !isNaN(startTimeString)) return parseInt(startTimeString);
        }
        return 0;
    }

    function setUrlParams(params) {
        const urlParams = new URLSearchParams(window.location.search);
        for (const paramName in params) urlParams.set(paramName, params[paramName]);
        window.location.search = urlParams;
    }

    function waitForElement(elementSelector, timeout) {
        const deferred = new Deferred();
        const checkDomInterval = setInterval(() => {
            const elem = document.querySelector(elementSelector);
            if (elem) {
                clearInterval(checkDomInterval);
                deferred.resolve(elem);
            }
        }, 100);
        setTimeout(() => {
            clearInterval(checkDomInterval);
            deferred.reject();
        }, timeout);
        return deferred;
    }

    function isWatchNextObject(parsedData) {
        if (!(parsedData?.contents) || !(parsedData?.currentVideoEndpoint?.watchEndpoint?.videoId)) return false;
        return !!parsedData.contents.twoColumnWatchNextResults || !!parsedData.contents.singleColumnWatchNextResults;
    }

    function isWatchNextSidebarEmpty(parsedData) {
        if (isDesktop) {
            return !parsedData.contents?.twoColumnWatchNextResults?.secondaryResults?.secondaryResults?.results;
        }
        const content = parsedData.contents?.singleColumnWatchNextResults?.results?.results?.contents;
        return typeof content?.find(e => e.itemSectionRenderer?.targetId === "watch-next-feed")?.itemSectionRenderer !== "object";
    }

    function isPlayerObject(parsedData) {
        return !!(parsedData?.videoDetails && parsedData?.playabilityStatus);
    }

    function isEmbeddedPlayerObject(parsedData) {
        return typeof parsedData?.previewPlayabilityStatus === "object";
    }

    function isAgeRestricted(playabilityStatus) {
        if (!(playabilityStatus?.status)) return false;
        if (unofficialplayabilityStatus.desktopLegacyAgeGateReason) return true;
        if (Config.UNLOCKABLE_PLAYABILITY_STATUSES.includes(playabilityStatus.status)) return true;
        return isEmbed && playabilityStatus.errorScreen?.playerErrorMessageRenderer?.reason?.runs?.find(x => x.navigationEndpoint)?.navigationEndpoint?.urlEndpoint?.url?.includes("/2802167");
    }

    function isSearchResult(parsedData) {
        return typeof parsedData.contents?.twoColumnSearchResultsRenderer === "object" ||
               parsedData.contents?.sectionListRenderer?.targetId === "search-feed" ||
               parsedData.onResponseReceivedCommands?.find(x => x.appendContinuationItemsAction)?.appendContinuationItemsAction?.targetId === "search-feed";
    }

    function attachHook(obj, prop, onCall) {
        if (!obj || typeof obj[prop] !== "function") return;
        const original = obj[prop];
        obj[prop] = function() {
            try { onCall(arguments); } catch {}
            return original.apply(this, arguments);
        };
    }

    const logPrefix = "%cYouTubeEnhancer:";
    const logPrefixStyle = "background-color:#1e5c85;color:#fff;font-size:1.2em;";
    const logSuffix = "Please report issues at: https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/issues";

    function logError(err, msg) {
        console.error(logPrefix, logPrefixStyle, msg, err, getYtcfgDebugString(), logSuffix);
        window.SYARB_CONFIG && window.dispatchEvent(new CustomEvent("SYARB_LOG_ERROR", {
            detail: { message: (msg ? msg + "; " : "") + (err?.message || ""), stack: err?.stack || null }
        }));
    }

    function logInfo(msg) {
        console.info(logPrefix, logPrefixStyle, msg);
        window.SYARB_CONFIG && window.dispatchEvent(new CustomEvent("SYARB_LOG_INFO", { detail: { message: msg }}));
    }

    function getYtcfgDebugString() {
        try {
            return `InnertubeConfig: innertubeApiKey: ${getYtcfgValue("INNERTUBE_API_KEY")} ` +
                   `innertubeClientName: ${getYtcfgValue("INNERTUBE_CLIENT_NAME")} ` +
                   `innertubeClientVersion: ${getYtcfgValue("INNERTUBE_CLIENT_VERSION")} ` +
                   `loggedIn: ${getYtcfgValue("LOGGED_IN")}`;
        } catch (err) {
            return `Failed to access config: ${err}`;
        }
    }

    function interceptObjectProperty(prop, onSet) {
        const { set, get } = Object.getOwnPropertyDescriptor(Object.prototype, prop) || {
            set(value) { this[`__SYARB_${prop}`] = value; },
            get() { return this[`__SYARB_${prop}`]; }
        };
        Object.defineProperty(Object.prototype, prop, {
            set(value) { set.call(this, isObject(value) ? onSet(this, value) : value); },
            get() { return get.call(this); },
            configurable: true
        });
    }

    function attachInitialData(onInitialData) {
        interceptObjectProperty("playerResponse", (obj, playerResponse) => {
            logInfo(`playerResponse set, contains sidebar: ${!!obj.response}`);
            isObject(obj.response) && onInitialData(obj.response);
            playerResponse.unlocked = false;
            onInitialData(playerResponse);
            return playerResponse.unlocked ? createDeepCopy(playerResponse) : playerResponse;
        });
        window.addEventListener("DOMContentLoaded", () => {
            isObject(window.ytInitialData) && onInitialData(window.ytInitialData);
        });
    }

    function attachJsonParse(onJsonDataReceived) {
        window.JSON.parse = function() {
            const data = nativeJSONParse.apply(this, arguments);
            return isObject(data) ? onJsonDataReceived(data) : data;
        };
    }

    function attachRequest(onRequestCreate) {
        if (typeof window.Request !== "function") return;
        window.Request = new Proxy(window.Request, {
            construct(target, args) {
                let [url, options] = args;
                try {
                    if (typeof url === "string") {
                        if (url.indexOf("/") === 0) url = window.location.origin + url;
                        if (url.indexOf("https://") !== -1) {
                            const modifiedUrl = onRequestCreate(url, options);
                            if (modifiedUrl) args[0] = modifiedUrl;
                        }
                    }
                } catch (err) {
                    logError(err, "Failed to intercept Request()");
                }
                return Reflect.construct(target, args);
            }
        });
    }

    function attachXhr(onXhrOpenCalled) {
        XMLHttpRequest.prototype.open = function(...args) {
            let [method, url] = args;
            try {
                if (typeof url === "string") {
                    if (url.indexOf("/") === 0) url = window.location.origin + url;
                    if (url.indexOf("https://") !== -1) {
                        const modifiedUrl = onXhrOpenCalled(method, url, this);
                        if (modifiedUrl) args[1] = modifiedUrl;
                    }
                }
            } catch (err) {
                logError(err, "Failed to intercept XMLHttpRequest.open()");
            }
            nativeXMLHttpRequestOpen.apply(this, args);
        };
    }

    const localStoragePrefix = "SYARB_";

    function setLocalStorage(key, value) {
        localStorage.setItem(localStoragePrefix + key, JSON.stringify(value));
    }

    function getLocalStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(localStoragePrefix + key));
        } catch {
            return null;
        }
    }

    function sendInnertubeRequest(endpoint, payload, useAuth) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", `/youtubei/${endpoint}?key=${getYtcfgValue("INNERTUBE_API_KEY")}&prettyPrint=false`, false);
        if (useAuth && isUserLoggedIn()) {
            xmlhttp.withCredentials = true;
            Config.GOOGLE_AUTH_HEADER_NAMES.forEach(headerName => xmlhttp.setRequestHeader(headerName, getLocalStorage(headerName)));
        }
        xmlhttp.send(JSON.stringify(payload));
        return nativeJSONParse(xmlhttp.responseText);
    }

    const innertube = {
        getPlayer: (payload, useAuth) => sendInnertubeRequest("v1/player", payload, useAuth),
        getNext: (payload, useAuth) => sendInnertubeRequest("v1/next", payload, useAuth)
    };

    let nextResponseCache = {};

    function getGoogleVideoUrl(originalUrl) {
        return Config.VIDEO_PROXY_SERVER_HOST + "/direct/" + btoa(originalUrl.toString());
    }

    function getPlayer(payload) {
        if (!nextResponseCache[payload.videoId] && !isMusic && !isEmbed) payload.includeNext = 1;
        return sendRequest("getPlayer", payload);
    }

    function getNext(payload) {
        if (nextResponseCache[payload.videoId]) return nextResponseCache[payload.videoId];
        return sendRequest("getNext", payload);
    }

    function sendRequest(endpoint, payload) {
        const queryParams = new URLSearchParams(payload);
        const proxyUrl = `${Config.ACCOUNT_PROXY_SERVER_HOST}/${endpoint}?${queryParams}&client=js`;
        try {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", proxyUrl, false);
            xmlhttp.send(null);
            const proxyResponse = nativeJSONParse(xmlhttp.responseText);
            proxyResponse.proxied = true;
            if (proxyResponse.nextResponse) {
                nextResponseCache[payload.videoId] = proxyResponse.nextResponse;
                delete proxyResponse.nextResponse;
            }
            return proxyResponse;
        } catch (err) {
            logError(err, "Proxy API Error");
            return { errorMessage: "Proxy Connection failed" };
        }
    }

    const proxy = { getPlayer, getNext, getGoogleVideoUrl };

    function getUnlockStrategies(videoId, reason) {
        const clientName = getYtcfgValue("INNERTUBE_CLIENT_NAME") || "WEB";
        const clientVersion = getYtcfgValue("INNERTUBE_CLIENT_VERSION") || "2.20220203.04.00";
        const signatureTimestamp = getSignatureTimestamp();
        const startTimeSecs = getCurrentVideoStartTime(videoId);
        const hl = getYtcfgValue("HL");
        return [
            {
                name: "Content Warning Bypass",
                skip: !reason || !reason.includes("CHECK_REQUIRED"),
                optionalAuth: true,
                payload: {
                    context: { client: { clientName, clientVersion, hl }},
                    playbackContext: { contentPlaybackContext: { signatureTimestamp }},
                    videoId,
                    startTimeSecs,
                    racyCheckOk: true,
                    contentCheckOk: true
                },
                endpoint: innertube
            },
            {
                name: "TV Embedded Player",
                requiresAuth: false,
                payload: {
                    context: { client: { clientName: "TVHTML5_SIMPLY_EMBEDDED_PLAYER", clientVersion: "2.0", clientScreen: "WATCH", hl }, thirdParty: { embedUrl: "https://www.youtube.com/" }},
                    playbackContext: { contentPlaybackContext: { signatureTimestamp }},
                    videoId,
                    startTimeSecs,
                    racyCheckOk: true,
                    contentCheckOk: true
                },
                endpoint: innertube
            },
            {
                name: "Creator + Auth",
                requiresAuth: true,
                payload: {
                    context: { client: { clientName: "WEB_CREATOR", clientVersion: "1.20210909.07.00", hl }},
                    playbackContext: { contentPlaybackContext: { signatureTimestamp }},
                    videoId,
                    startTimeSecs,
                    racyCheckOk: true,
                    contentCheckOk: true
                },
                endpoint: innertube
            },
            {
                name: "Account Proxy",
                payload: { videoId, reason, clientName, clientVersion, signatureTimestamp, startTimeSecs, hl, isEmbed: +isEmbed, isConfirmed: +isConfirmed },
                endpoint: proxy
            }
        ];
    }

    function getNextUnlockStrategies(videoId, lastPlayerUnlockReason) {
        const clientName = getYtcfgValue("INNERTUBE_CLIENT_NAME") || "WEB";
        const clientVersion = getYtcfgValue("INNERTUBE_CLIENT_VERSION") || "2.20220203.04.00";
        const hl = getYtcfgValue("HL");
        const userInterfaceTheme = getYtcfgValue("INNERTUBE_CONTEXT")?.client?.userInterfaceTheme || (document.documentElement.hasAttribute("dark") ? "USER_INTERFACE_THEME_DARK" : "USER_INTERFACE_THEME_LIGHT");
        return [
            {
                name: "Content Warning Bypass",
                skip: !lastPlayerUnlockReason || !lastPlayerUnlockReason.includes("CHECK_REQUIRED"),
                optionalAuth: true,
                payload: { context: { client: { clientName, clientVersion, hl, userInterfaceTheme }}, videoId, racyCheckOk: true, contentCheckOk: true },
                endpoint: innertube
            },
            {
                name: "Account Proxy",
                payload: { videoId, clientName, clientVersion, hl, userInterfaceTheme, isEmbed: +isEmbed, isConfirmed: +isConfirmed },
                endpoint: proxy
            }
        ];
    }

    const buttonTemplate = '<div style="margin-top:15px;padding:3px 10px;margin:0 auto;background-color:#4d4d4d;width:fit-content;font-size:1.2em;text-transform:uppercase;border-radius:3px;cursor:pointer"><div class="button-text"></div></div>';
    let buttons = {};

    async function addButton(id, text, onClick) {
        const errorScreenElement = await waitForElement(".ytp-error", 2000);
        const buttonElement = createElement("div", { class: "button-container", innerHTML: buttonTemplate });
        buttonElement.getElementsByClassName("button-text")[0].innerText = text;
        if (typeof onClick === "function") buttonElement.addEventListener("click", onClick);
        if (buttons[id] && buttons[id].isConnected) return;
        buttons[id] = buttonElement;
        errorScreenElement.append(buttonElement);
    }

    function removeButton(id) {
        if (buttons[id] && buttons[id].isConnected) buttons[id].remove();
    }

    const confirmationButtonId = "confirmButton";
    const confirmationButtonText = "Click to Unlock";

    function isConfirmationRequired() {
        return !isConfirmed && isEmbed && Config.ENABLE_UNLOCK_CONFIRMATION_EMBED;
    }

    function requestConfirmation() {
        addButton(confirmationButtonId, confirmationButtonText, () => {
            removeButton(confirmationButtonId);
            confirm();
        });
    }

    function confirm() {
        setUrlParams({ unlock_confirmed: 1, autoplay: 1 });
    }

    const tDesktop = '<tp-yt-paper-toast></tp-yt-paper-toast>';
    const tMobile = '<c3-toast><ytm-notification-action-renderer><div class="notification-action-response-text"></div></ytm-notification-action-renderer></c3-toast>';
    const template = isDesktop ? tDesktop : tMobile;
    const nToastContainer = createElement("div", { id: "toast-container", innerHTML: template });
    const nToast = nToastContainer.querySelector(":scope > *");

    if (isMusic) nToast.style["margin-bottom"] = "85px";
    if (!isDesktop) {
        nToast.nMessage = nToast.querySelector(".notification-action-response-text");
        nToast.show = message => {
            nToast.nMessage.innerText = message;
            nToast.setAttribute("dir", "in");
            setTimeout(() => nToast.setAttribute("dir", "out"), nToast.duration + 225);
        };
    }

    async function showToast(message, duration = 5) {
        if (!Config.ENABLE_UNLOCK_NOTIFICATION || isEmbed || document.visibilityState === "hidden") return;
        await pageLoaded();
        if (!nToastContainer.isConnected) document.documentElement.append(nToastContainer);
        nToast.duration = duration * 1000;
        nToast.show(message);
    }

    const Toast = { show: showToast };
    const messagesMap = {
        success: "Age-restricted video successfully unlocked.",
        fail: "Unable to unlock this video. Please check the developer console for more information."
    };

    let lastPlayerUnlockVideoId = null;
    let lastPlayerUnlockReason = null;
    let lastProxiedGoogleVideoUrlParams;
    let cachedPlayerResponse = {};

    function getLastProxiedGoogleVideoId() {
        return lastProxiedGoogleVideoUrlParams?.get("id");
    }

    function unlockPlayerResponse(playerResponse) {
        if (isConfirmationRequired()) {
            logInfo("Unlock confirmation required.");
            requestConfirmation();
            return;
        }
        const videoId = playerResponse.videoDetails?.videoId || getYtcfgValue("PLAYER_VARS").video_id;
        const reason = playerResponse.playabilityStatus?.status || playerResponse.previewPlayabilityStatus?.status;
        if (!Config.SKIP_CONTENT_WARNINGS && reason.includes("CHECK_REQUIRED")) {
            logInfo(`Content warning detected and SKIP_CONTENT_WARNINGS is disabled.`);
            return;
        }
        lastPlayerUnlockVideoId = videoId;
        lastPlayerUnlockReason = reason;
        const unlockedPlayerResponse = getUnlockedPlayerResponse(videoId, reason);
        if (unlockedPlayerResponse.errorMessage) {
            Toast.show(`${messagesMap.fail} (Proxy Error)`, 10);
            throw new Error(`Player Unlock Failed: ${unlockedPlayerResponse.errorMessage}`);
        }
        if (!Config.VALID_PLAYABILITY_STATUSES.includes(unlockedPlayerResponse.playabilityStatus?.status)) {
            Toast.show(`${messagesMap.fail} (Playability Error)`, 10);
            throw new Error(`Player Unlock Failed: Status ${unlockedPlayerResponse.playabilityStatus?.status}`);
        }
        if (unlockedPlayerResponse.proxied && unlockedPlayerResponse.streamingData?.adaptiveFormats) {
            const cipherText = unlockedPlayerResponse.streamingData.adaptiveFormats.find(x => x.signatureCipher)?.signatureCipher;
            const videoUrl = cipherText ? new URLSearchParams(cipherText).get("url") : unlockedPlayerResponse.streamingData.adaptiveFormats.find(x => x.url)?.url;
            lastProxiedGoogleVideoUrlParams = videoUrl ? new URLSearchParams(new window.URL(videoUrl).search) : null;
        }
        if (playerResponse.previewPlayabilityStatus) playerResponse.previewPlayabilityStatus = unlockedPlayerResponse.playabilityStatus;
        Object.assign(playerResponse, unlockedPlayerResponse);
        playerResponse.unlocked = true;
        Toast.show(messagesMap.success);
    }

    function getUnlockedPlayerResponse(videoId, reason) {
        if (cachedPlayerResponse.videoId === videoId) return createDeepCopy(cachedPlayerResponse);
        const unlockStrategies = getUnlockStrategies(videoId, reason);
        let unlockedPlayerResponse = {};
        unlockStrategies.every((strategy, index) => {
            if (strategy.skip || (strategy.requiresAuth && !isUserLoggedIn())) return true;
            logInfo(`Attempting Player Unlock Method #${index + 1} (${strategy.name})`);
            try {
                unlockedPlayerResponse = strategy.endpoint.getPlayer(strategy.payload, strategy.requiresAuth || strategy.optionalAuth);
            } catch (err) {
                logError(err, `Player Unlock Method ${index + 1} failed`);
            }
            const isStatusValid = Config.VALID_PLAYABILITY_STATUSES.includes(unlockedPlayerResponse?.playabilityStatus?.status);
            if (isStatusValid) {
                if (!unlockedPlayerResponse.trackingParams || !unlockedPlayerResponse.responseContext?.mainAppWebResponseContext?.trackingParam) {
                    unlockedPlayerResponse.trackingParams = "CAAQu2kiEwjor8uHyOL_AhWOvd4KHavXCKw=";
                    unlockedPlayerResponse.responseContext = { mainAppWebResponseContext: { trackingParam: "kx_fmPxhoPZRzgL8kzOwANUdQh8ZwHTREkw2UqmBAwpBYrzRgkuMsNLBwOcCE59TDtslLKPQ-SS" }};
                }
                if (strategy.payload.startTimeSecs && strategy.name === "Account Proxy") {
                    unlockedPlayerResponse.playerConfig = { playbackStartConfig: { startSeconds: strategy.payload.startTimeSecs }};
                }
            }
            return !isStatusValid;
        });
        cachedPlayerResponse = { videoId, ...createDeepCopy(unlockedPlayerResponse) };
        return unlockedPlayerResponse;
    }

    let cachedNextResponse = {};

    function unlockNextResponse(originalNextResponse) {
        const videoId = originalNextResponse.currentVideoEndpoint.watchEndpoint.videoId;
        if (!videoId) throw new Error("Missing videoId in nextResponse");
        if (videoId !== lastPlayerUnlockVideoId) return;
        const unlockedNextResponse = getUnlockedNextResponse(videoId);
        if (isWatchNextSidebarEmpty(unlockedNextResponse)) throw new Error("Sidebar Unlock Failed");
        mergeNextResponse(originalNextResponse, unlockedNextResponse);
    }

    function getUnlockedNextResponse(videoId) {
        if (cachedNextResponse.videoId === videoId) return createDeepCopy(cachedNextResponse);
        const unlockStrategies = getNextUnlockStrategies(videoId, lastPlayerUnlockReason);
        let unlockedNextResponse = {};
        unlockStrategies.every((strategy, index) => {
            if (strategy.skip) return true;
            logInfo(`Attempting Next Unlock Method #${index + 1} (${strategy.name})`);
            try {
                unlockedNextResponse = strategy.endpoint.getNext(strategy.payload, strategy.optionalAuth);
            } catch (err) {
                logError(err, `Next Unlock Method ${index + 1} failed`);
            }
            return isWatchNextSidebarEmpty(unlockedNextResponse);
        });
        cachedNextResponse = { videoId, ...createDeepCopy(unlockedNextResponse) };
        return unlockedNextResponse;
    }

    function mergeNextResponse(originalNextResponse, unlockedNextResponse) {
        if (isDesktop) {
            originalNextResponse.contents.twoColumnWatchNextResults.secondaryResults = unlockedNextResponse.contents.twoColumnWatchNextResults.secondaryResults;
            const originalVideoSecondaryInfoRenderer = originalNextResponse.contents.twoColumnWatchNextResults.results.results.contents.find(x => x.videoSecondaryInfoRenderer).videoSecondaryInfoRenderer;
            const unlockedVideoSecondaryInfoRenderer = unlockedNextResponse.contents.twoColumnWatchNextResults.results.results.contents.find(x => x.videoSecondaryInfoRenderer).videoSecondaryInfoRenderer;
            if (unlockedVideoSecondaryInfoRenderer.description) {
                originalVideoSecondaryInfoRenderer.description = unlockedVideoSecondaryInfoRenderer.description;
            } else if (unlockedVideoSecondaryInfoRenderer.attributedDescription) {
                originalVideoSecondaryInfoRenderer.attributedDescription = unlockedVideoSecondaryInfoRenderer.attributedDescription;
            }
            return;
        }
        const unlockedWatchNextFeed = unlockedNextResponse.contents?.singleColumnWatchNextResults?.results?.results?.contents?.find(x => x.itemSectionRenderer?.targetId === "watch-next-feed");
        if (unlockedWatchNextFeed) originalNextResponse.contents.singleColumnWatchNextResults.results.results.contents.push(unlockedWatchNextFeed);
        const originalStructuredDescriptionContentRenderer = originalNextResponse.engagementPanels.find(x => x.engagementPanelSectionListRenderer).engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items.find(x => x.expandableVideoDescriptionBodyRenderer);
        const unlockedStructuredDescriptionContentRenderer = unlockedNextResponse.engagementPanels.find(x => x.engagementPanelSectionListRenderer).engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items.find(x => x.expandableVideoDescriptionBodyRenderer);
        if (unlockedStructuredDescriptionContentRenderer.expandableVideoDescriptionBodyRenderer) {
            originalStructuredDescriptionContentRenderer.expandableVideoDescriptionBodyRenderer = unlockedStructuredDescriptionContentRenderer.expandableVideoDescriptionBodyRenderer;
        }
    }

    function handleXhrOpen(method, url, xhr) {
        const urlObj = new URL(url);
        const proxyUrl = unlockGoogleVideo(urlObj);
        if (proxyUrl) {
            Object.defineProperty(xhr, "withCredentials", { set: () => {}, get: () => false });
            return proxyUrl.toString();
        }
        if (urlObj.pathname.indexOf("/youtubei/") === 0) {
            attachHook(xhr, "setRequestHeader", ([headerName, headerValue]) => {
                if (Config.GOOGLE_AUTH_HEADER_NAMES.includes(headerName)) setLocalStorage(headerName, headerValue);
            });
        }
        if (Config.SKIP_CONTENT_WARNINGS && method === "POST" && ["/youtubei/v1/player", "/youtubei/v1/next"].includes(urlObj.pathname)) {
            attachHook(xhr, "send", args => {
                if (typeof args[0] === "string") args[0] = setContentCheckOk(args[0]);
            });
        }
    }

    function handleFetchRequest(url, requestOptions) {
        const urlObj = new URL(url);
        const newGoogleVideoUrl = unlockGoogleVideo(urlObj);
        if (newGoogleVideoUrl) {
            if (requestOptions.credentials) requestOptions.credentials = "omit";
            return newGoogleVideoUrl.toString();
        }
        if (urlObj.pathname.indexOf("/youtubei/") === 0 && isObject(requestOptions.headers)) {
            for (let headerName in requestOptions.headers) {
                if (Config.GOOGLE_AUTH_HEADER_NAMES.includes(headerName)) setLocalStorage(headerName, requestOptions.headers[headerName]);
            }
        }
        if (Config.SKIP_CONTENT_WARNINGS && ["/youtubei/v1/player", "/youtubei/v1/next"].includes(urlObj.pathname)) {
            requestOptions.body = setContentCheckOk(requestOptions.body);
        }
    }

    function unlockGoogleVideo(url) {
        if (Config.VIDEO_PROXY_SERVER_HOST && isGoogleVideoUrl(url) && isGoogleVideoUnlockRequired(url, getLastProxiedGoogleVideoId())) {
            return proxy.getGoogleVideoUrl(url);
        }
    }

    function setContentCheckOk(bodyJson) {
        try {
            const parsedBody = JSON.parse(bodyJson);
            if (parsedBody.videoId) {
                parsedBody.contentCheckOk = true;
                parsedBody.racyCheckOk = true;
                return JSON.stringify(parsedBody);
            }
        } catch {}
        return bodyJson;
    }

    function processThumbnails(responseObject) {
        const thumbnails = findNestedObjectsByAttributeNames(responseObject, ["url", "height"]);
        let blurredThumbnailCount = 0;
        for (const thumbnail of thumbnails) {
            if (isThumbnailBlurred(thumbnail)) {
                blurredThumbnailCount++;
                thumbnail.url = thumbnail.url.split("?")[0];
            }
        }
        logInfo(`${blurredThumbnailCount}/${thumbnails.length} thumbnails detected as blurred.`);
    }

    function isThumbnailBlurred(thumbnail) {
        if (thumbnail.url.indexOf("?sqp=") === -1) return false;
        const SQPLength = new URL(thumbnail.url).searchParams.get("sqp").length;
        return Config.BLURRED_THUMBNAIL_SQP_LENGTHS.includes(SQPLength);
    }

    function createDownloadButton() {
        if (document.querySelector(".download-btn")) return;
        const downloadButton = document.createElement("button");
        downloadButton.className = "download-btn";
        downloadButton.textContent = localization.en.downloadText;
        downloadButton.addEventListener("click", () => {
            const videoUrl = window.location.href;
            const downloadDomains = ["addyoutube.com"];
            const randomDomain = downloadDomains[Math.floor(Math.random() * downloadDomains.length)];
            const newUrl = videoUrl.replace("youtube.com", randomDomain);
            window.open(newUrl, "_blank");
        });
        return downloadButton;
    }

    function tryAddButton() {
        waitForElement("#subscribe-button button", subscribeButton => {
            if (!document.querySelector(".download-btn")) {
                const downloadButton = createDownloadButton();
                const container = subscribeButton.closest("#subscribe-button");
                if (container) {
                    const wrapper = document.createElement("div");
                    wrapper.className = "buttons-wrapper";
                    container.parentNode.insertBefore(wrapper, container);
                    wrapper.appendChild(container);
                    wrapper.appendChild(downloadButton);
                }
            }
        }, 10000);
    }

    function processYtData(ytData) {
        try {
            if (isPlayerObject(ytData) && isAgeRestricted(ytData.playabilityStatus)) {
                unlockPlayerResponse(ytData);
            } else if (isEmbeddedPlayerObject(ytData) && isAgeRestricted(ytData.previewPlayabilityStatus)) {
                unlockPlayerResponse(ytData);
            }
        } catch (err) {
            logError(err, "Video unlock operation failed");
        }
        try {
            if (isWatchNextObject(ytData) && isWatchNextSidebarEmpty(ytData)) {
                unlockNextResponse(ytData);
            }
            if (isWatchNextObject(ytData.response) && isWatchNextSidebarEmpty(ytData.response)) {
                unlockNextResponse(ytData.response);
            }
        } catch (err) {
            logError(err, "Sidebar unlock operation failed");
        }
        try {
            if (isSearchResult(ytData)) processThumbnails(ytData);
        } catch (err) {
            logError(err, "Thumbnail unlock operation failed");
        }
        return ytData;
    }

    try {
        attachInitialData(processYtData);
        attachJsonParse(processYtData);
        attachXhr(handleXhrOpen);
        attachRequest(handleFetchRequest);
    } catch (err) {
        logError(err, "Error attaching data interceptors");
    }

    document.addEventListener("yt-navigate-finish", () => {
        if (window.location.pathname.includes("/watch")) setTimeout(tryAddButton, 1000);
    });

    if (window.location.pathname.includes("/watch")) setTimeout(tryAddButton, 1000);
})();