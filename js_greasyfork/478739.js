// ==UserScript==
// @name                 Netflix Plus
// @name:ja              Netflix Plus
// @name:zh-CN           Netflix Plus
// @name:zh-TW           Netflix Plus
// @namespace            http://tampermonkey.net/
// @version              4.5
// @description          Enable best audio and video and more features on Netflix
// @description:ja       Netflixで最高の音質と画質、そしてもっと多くの機能を体験しましょう
// @description:zh-CN    在 Netflix 上开启最佳音视频质量和更多功能
// @description:zh-TW    在 Netflix 上啓用最佳影音品質和更多功能
// @author               TGSAN
// @match                https://www.netflix.com/*
// @match                https://www3.stage.netflix.com/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @run-at               document-start
// @sandbox              raw
// @grant                unsafeWindow
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/478739/Netflix%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/478739/Netflix%20Plus.meta.js
// ==/UserScript==

(async () => {
    "use strict";

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Netflix Plus] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Netflix Plus] use window mode (your userscript extensions not support unsafeWindow)");
    }

    windowCtx.addEventListener("load", function () {
        // Edge fullscreen bug fix
        const overlay = windowCtx.document.createElement("div");
        windowCtx.document.body.appendChild(overlay);
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "transparent";
        overlay.style.zIndex = 9999;
        overlay.style.pointerEvents = "none";
        overlay.style.position = "fixed";
        overlay.style.backdropFilter = "blur(0px)";
    });

    // Disable Cache
    {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Cache-Control";
        meta.content = "no-cache";
        windowCtx.document.head.appendChild(meta);
    }
    {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Pragma";
        meta.content = "no-cache";
        windowCtx.document.head.appendChild(meta);
    }
    {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Expires";
        meta.content = "-1";
        windowCtx.document.head.appendChild(meta);
    }

    function createToast() {
        let toast = document.createElement("div");
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.padding = "10px 20px";
        toast.style.backgroundColor = "rgba(250, 250, 250, 1.0)";
        toast.style.color = "rgba(32, 32, 32, 1.0)";
        toast.style.fontSize = "12px";
        toast.style.textAlign = "center";
        toast.style.fontWeight = "600";
        toast.style.zIndex = "9999";
        toast.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.25)";
        toast.style.borderRadius = "30px";
        toast.style.opacity = "0.0";
        toast.style.transition = "opacity 0.5s";
        document.body.appendChild(toast);
        return toast;
    }

    function showToast(message, time = 1500) {
        let toast = createToast();
        toast.innerText = message;
        setTimeout(function () {
            toast.style.opacity = "1.0";
            setTimeout(function () {
                toast.style.opacity = "0.0";
                setTimeout(function () {
                    document.body.removeChild(toast);
                }, 500);
            }, time);
        }, 1);
    }

    let playercoreDom = undefined;
    let startCaptureFunctionExec = true;
    windowCtx.Function.prototype.callNetflixPlusOriginal = windowCtx.Function.prototype.call;
    windowCtx.Function.prototype.call = function (...args) {
        if (startCaptureFunctionExec) {
            let funcStr = this.toString();
            let funcLen = funcStr.length;
            if (funcLen > 1000000) {
                // find original playercore not netflix plus playercore
                if (funcStr.indexOf("h264mpl") > -1 && funcStr.indexOf("videoElementNetflixPlus") < 0) {
                    console.log("PlayerCore found len: " + funcStr.length);
                    loadCustomPlayerCore();
                    return undefined;
                }
            }
        }
        return this.callNetflixPlusOriginal(...args);
    }

    if (windowCtx.netflix !== undefined && windowCtx.netflix.player !== undefined) {
        showToast("Netflix Plus is executing too late and is being forced to run, which may cause issues.\n\nRefresh the page while holding down the \"Shift\" key to resolve the issue.", 10000);
        console.warn("The user script is executing too late and is being forced to run, which may cause issues.");
        loadCustomPlayerCore();
    }

    function loadCustomPlayerCore() {
        const setPlayerInitParams = () => {
            try {
                // windowCtx.netflix.reactContext.models.playerModel.data.config.core.initParams.enableHWDRMForHEVCAndQHDOnly = false;
                if (windowCtx.netflix.reactContext.models.playerModel.data.config.core.initParams.browserInfo.os.name == "linux") {
                    windowCtx.netflix.reactContext.models.playerModel.data.config.core.initParams.browserInfo.os = {
                        "name": "windows",
                        "version": "10.0"
                    };
                }
                if (windowCtx.netflix.reactContext.models.playerModel.data.config.core.initParams.browserInfo.hardware != "computer") {
                    windowCtx.netflix.reactContext.models.playerModel.data.config.core.initParams.browserInfo.hardware = "computer";
                }
            } catch {
                setTimeout(setPlayerInitParams, 0)
            }
        };
        setPlayerInitParams();
        startCaptureFunctionExec = false;
        if (playercoreDom == undefined) {
            for (let element of windowCtx.document.getElementsByTagName("script")) {
                if (element.src && element.src.indexOf("cadmium-playercore") > -1) {
                    playercoreDom = element;
                    break;
                }
            }
        }
        let playercore = document.createElement('script');
        playercore.src = "https://www.cloudmoe.com/static/userscript/netflix-plus/cadmium-playercore.js";
        // playercore.crossOrigin = playercoreDom.crossOrigin;
        playercore.async = playercoreDom.async;
        playercore.id = playercoreDom.id;
        playercoreDom.replaceWith(playercore);
    }

    // Register Netflix Plus Functions

    windowCtx._videoElementNetflixPlus;
    Object.defineProperty(windowCtx, "videoElementNetflixPlus", {
        get: function () { return windowCtx._videoElementNetflixPlus; },
        set: function (element) {
            let backup = windowCtx._videoElementNetflixPlus;
            windowCtx._videoElementNetflixPlus = element;
            element.addEventListener('playing', function () {
                if (backup === element) {
                    return;
                }

                if (!windowCtx.globalOptions.setMaxBitrateOld) {
                    return;
                }

                let getElementByXPath = function (xpath) {
                    return document.evaluate(
                        xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                    ).singleNodeValue;
                };

                let selectFun = function () {
                    windowCtx.dispatchEvent(new KeyboardEvent('keydown', {
                        keyCode: 83, // S (Old)
                        ctrlKey: true,
                        altKey: true,
                        shiftKey: true,
                    }));

                    windowCtx.dispatchEvent(new KeyboardEvent('keydown', {
                        keyCode: 66, // B
                        ctrlKey: true,
                        altKey: true,
                        shiftKey: true,
                    }));

                    const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate / VMAF']");
                    const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
                    const BUTTON = getElementByXPath("//button[text()='Override']");
                    if (VIDEO_SELECT && AUDIO_SELECT && BUTTON) {
                        [VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
                            let parent = el.parentElement;

                            let selects = parent.querySelectorAll('select');

                            selects.forEach(function (select) {
                                select.removeAttribute("disabled");
                            });

                            let options = parent.querySelectorAll('select > option');

                            for (var i = 0; i < options.length - 1; i++) {
                                options[i].removeAttribute('selected');
                            }

                            options[options.length - 1].setAttribute('selected', 'selected');
                        });

                        setTimeout(function () { BUTTON.click(); }, 100);

                        backup = element;
                    } else {
                        setTimeout(selectFun, 100);
                    }
                }
                selectFun();
            });
        }
    });

    windowCtx.modifyStreamInfoFilterNetflixPlus = function (Info) {
        if (windowCtx.globalOptions.onlyMaxBitrate) {
            console.debug(`[OnlyMaxBitrate] Dump Data`, Info);
            for (const InfoProperty in Info) {
                const InfoSub = Info[InfoProperty];
                // console.debug(`[OnlyMaxBitrate] ${InfoProperty}: ${InfoSub}`);
                const audio_tracks = InfoSub.audio_tracks;
                const video_tracks = InfoSub.video_tracks;
                if (audio_tracks && video_tracks) {
                    const StreamInfo = InfoSub
                    console.debug(`[OnlyMaxBitrate] Found StreamInfo in ${InfoProperty}`);
                    for (const StreamInfoProperty in StreamInfo) {
                        const StreamInfoSub = StreamInfo[StreamInfoProperty];
                        if (Array.isArray(StreamInfoSub) && StreamInfoSub.length > 0 && StreamInfoSub[0].streams) {
                            console.debug(`[OnlyMaxBitrate] Found CurrentSelectedStreamInfo in ${StreamInfoProperty}`);
                            for (let i = 0; StreamInfoSub.length > i; i++) {
                                if (Array.isArray(StreamInfoSub[i].streams) && StreamInfoSub[i].streams.length > 0) {
                                    StreamInfoSub[i].streams = [StreamInfoSub[i].streams.pop()];
                                }
                                if (Array.isArray(StreamInfoSub[i].bitrates) && StreamInfoSub[i].bitrates.length > 0) {
                                    StreamInfoSub[i].bitrates = [StreamInfoSub[i].bitrates.pop()];
                                }
                            }
                        }
                    }
                }
            }
        }
        return Info;
    }

    windowCtx.modifyFilterNetflixPlus = function (ModList, ModConfig, DRMType) {
        let DrmVersion = "playready" === DRMType ? 30 : 0;
        if (windowCtx.globalOptions.useprk) {
            ModList.push("h264mpl30-dash-playready-prk-qc");
            ModList.push("h264mpl31-dash-playready-prk-qc");
            ModList.push("h264mpl40-dash-playready-prk-qc");
        }
        if (DrmVersion == 30) {
            if (windowCtx.globalOptions.useddplus) {
                if (MediaSource.isTypeSupported("video/mp4; codecs=\"ec-3\"")) {
                    ModList.push("ddplus-2.0-dash");
                    ModList.push("ddplus-5.1-dash");
                    ModList.push("ddplus-5.1hq-dash");
                    ModList.push("ddplus-atmos-dash");
                    // ModList = ModList.filter(item => { if (!new RegExp(/heaac/g).test(JSON.stringify(item))) return item; });
                }
            }
            if (windowCtx.globalOptions.usehevc) {
                ModList = ModList.filter(item => { if (!new RegExp(/main10-L5/g).test(JSON.stringify(item))) return item; });
            }
            if (windowCtx.globalOptions.usef12k) {
                ModList = ModList.filter(item => { if (!new RegExp(/hevc-main10-L.*-dash-cenc-prk-do/g).test(JSON.stringify(item))) return item; });
            }
            if (windowCtx.globalOptions.usef4k) {
                ModList.push("hevc-main10-L30-dash-cenc");
                ModList.push("hevc-main10-L31-dash-cenc");
                ModList.push("hevc-main10-L40-dash-cenc");
                ModList.push("hevc-main10-L41-dash-cenc");
            }
            if (windowCtx.globalOptions.alwaysUseHDR) {
                ModList.push("hevc-hdr-main10-L30-dash-cenc-prk");
                ModList.push("hevc-hdr-main10-L40-dash-cenc-prk");
                ModList.push("hevc-hdr-main10-L50-dash-cenc-prk");
                ModList.push("hevc-hdr-main10-L31-dash-cenc-prk");
                ModList.push("hevc-hdr-main10-L41-dash-cenc-prk");
                ModList.push("hevc-hdr-main10-L51-dash-cenc-prk");
                ModList.push("hevc-hdr-main10-L30-dash-cenc-prk-do");
                ModList.push("hevc-hdr-main10-L40-dash-cenc-prk-do");
                ModList.push("hevc-hdr-main10-L50-dash-cenc-prk-do");
                ModList.push("hevc-hdr-main10-L31-dash-cenc-prk-do");
                ModList.push("hevc-hdr-main10-L41-dash-cenc-prk-do");
                ModList.push("hevc-hdr-main10-L51-dash-cenc-prk-do");
                if (windowCtx.globalOptions.forceDV5) {
                    ModList.push("hevc-dv5-main10-L30-dash-cenc-prk");
                    ModList.push("hevc-dv5-main10-L40-dash-cenc-prk");
                    ModList.push("hevc-dv5-main10-L50-dash-cenc-prk");
                    ModList.push("hevc-dv5-main10-L31-dash-cenc-prk");
                    ModList.push("hevc-dv5-main10-L41-dash-cenc-prk");
                    ModList.push("hevc-dv5-main10-L51-dash-cenc-prk");
                    ModList.push("hevc-dv5-main10-L30-dash-cenc-prk-do");
                    ModList.push("hevc-dv5-main10-L40-dash-cenc-prk-do");
                    ModList.push("hevc-dv5-main10-L50-dash-cenc-prk-do");
                    ModList.push("hevc-dv5-main10-L31-dash-cenc-prk-do");
                    ModList.push("hevc-dv5-main10-L41-dash-cenc-prk-do");
                    ModList.push("hevc-dv5-main10-L51-dash-cenc-prk-do");
                }
            }
        } else {
            if (windowCtx.globalOptions.useFHD) {
                ModList.push("playready-h264mpl40-dash");
                ModList.push("playready-h264hpl40-dash");
                ModList.push("vp9-profile0-L40-dash-cenc");
                ModList.push("av1-main-L50-dash-cbcs-prk");
                ModList.push("av1-main-L51-dash-cbcs-prk");
                // if (windowCtx.globalOptions.alwaysUseHDR) {
                //     ModList.push("av1-hdr10plus-main-L40-dash-cbcs-prk");
                //     ModList.push("av1-hdr10plus-main-L41-dash-cbcs-prk");
                //     ModList.push("av1-hdr10plus-main-L50-dash-cbcs-prk");
                //     ModList.push("av1-hdr10plus-main-L51-dash-cbcs-prk");
                // }
            }
            if (windowCtx.globalOptions.useHA) {
                ModList.push("heaac-5.1-dash");
            }
            if (!windowCtx.globalOptions.usedef) {
                if (windowCtx.globalOptions.useav1) {
                    ModList.push("av1-main-L20-dash-cbcs-prk");
                    ModList.push("av1-main-L21-dash-cbcs-prk");
                    ModList = ModList.filter(item => { if (!new RegExp(/h264/g).test(JSON.stringify(item))) return item; });
                    ModList = ModList.filter(item => { if (!new RegExp(/vp9-profile/g).test(JSON.stringify(item))) return item; });
                }
                if (windowCtx.globalOptions.usevp9) {
                    ModList.push("vp9-profile0-L21-dash-cenc");
                    ModList = ModList.filter(item => { if (!new RegExp(/h264/g).test(JSON.stringify(item))) return item; });
                    ModList = ModList.filter(item => { if (!new RegExp(/av1-main/g).test(JSON.stringify(item))) return item; });
                }
                if (windowCtx.globalOptions.useAVCH) {
                    ModList = ModList.filter(item => { if (!new RegExp(/vp9-profile/g).test(JSON.stringify(item))) return item; });
                    // ModList = ModList.filter(item => { if (!new RegExp(/h264mp/g).test(JSON.stringify(item))) return item; });
                    ModList = ModList.filter(item => { if (!new RegExp(/av1-main/g).test(JSON.stringify(item))) return item; });
                }
                if (windowCtx.globalOptions.useAVC) {
                    ModList = ModList.filter(item => { if (!new RegExp(/vp9-profile/g).test(JSON.stringify(item))) return item; });
                    ModList = ModList.filter(item => { if (!new RegExp(/h264hp/g).test(JSON.stringify(item))) return item; });
                    ModList = ModList.filter(item => { if (!new RegExp(/av1-main/g).test(JSON.stringify(item))) return item; });
                }
            }
        }
        if (windowCtx.globalOptions.useallSub) {
            ModConfig.showAllSubDubTracks = 1
        }
        if (windowCtx.globalOptions.closeimsc) {
            ModList = ModList.filter(item => { if (!new RegExp(/imsc1.1/g).test(JSON.stringify(item))) return item; });
        }
        // console.debug([ModList, ModConfig, DRMType]);
        return [ModList, ModConfig, DRMType];
    };

    // Main Logic

    const originFetchNetflixPlus = windowCtx.fetch;
    windowCtx.fetch = (...arg) => {
        let url = "";
        let isRequest = false;
        switch (typeof arg[0]) {
            case "object":
                url = arg[0].url;
                isRequest = true;
                break;
            case "string":
                url = arg[0];
                break;
            default:
                break;
        }

        if (url.indexOf('//web.prod.cloud.netflix.com/graphql') > -1) {
            if (typeof arg[1] == "object") {
                let options = arg[1];
                if (typeof options.body == "string" && options.body.startsWith("{") && options.body.endsWith("}")) {
                    let body = JSON.parse(options.body);
                    if (typeof body.operationName == "string") {
                        if (windowCtx.globalOptions.disableHouseholdCheck && body.operationName.startsWith("CLCSInterstitial")) { // "CLCSInterstitialPlaybackAndPostPlayback or CLCSInterstitialLolomo
                            console.debug("[DisableHouseholdCheck] Mocked: " + body.operationName);
                            return new Promise((resolve) => {
                                let fakeData = {
                                    data: {}
                                };
                                fakeData.data["body.operationName"] = null;
                                resolve(new Response(JSON.stringify(fakeData)));
                            });
                        }
                    }
                    options.body = JSON.stringify(body);
                }
                arg[1] = options;
            }
        }

        return originFetchNetflixPlus(...arg);
    }

    const Event = class {
        constructor(script, target) {
            this.script = script;
            this.target = target;

            this._cancel = false;
            this._replace = null;
            this._stop = false;
        }

        preventDefault() {
            this._cancel = true;
        }
        stopPropagation() {
            this._stop = true;
        }
        replacePayload(payload) {
            this._replace = payload;
        }
    };

    let callbacks = [];
    windowCtx.addBeforeScriptExecuteListener = (f) => {
        if (typeof f !== "function") {
            throw new Error("Event handler must be a function.");
        }
        callbacks.push(f);
    };
    windowCtx.removeBeforeScriptExecuteListener = (f) => {
        let i = callbacks.length;
        while (i--) {
            if (callbacks[i] === f) {
                callbacks.splice(i, 1);
            }
        }
    };

    const dispatch = (script, target) => {
        if (script.tagName !== "SCRIPT") {
            return;
        }

        const e = new Event(script, target);

        if (typeof windowCtx.onbeforescriptexecute === "function") {
            try {
                windowCtx.onbeforescriptexecute(e);
            } catch (err) {
                console.error(err);
            }
        }

        for (const func of callbacks) {
            if (e._stop) {
                break;
            }
            try {
                func(e);
            } catch (err) {
                console.error(err);
            }
        }

        if (e._cancel) {
            script.textContent = "";
            script.remove();
        } else if (typeof e._replace === "string") {
            script.textContent = e._replace;
        }
    };
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                dispatch(n, m.target);
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });

    const menuItems = [
        ["onlyMaxBitrate", "Only use best bitrate available"],
        // ["setMaxBitrateOld", "Automatically select best bitrate available"],
        ["useallSub", "Show all audio-tracks and subs"],
        ["closeimsc", "Use SUP subtitle replace IMSC subtitle"],
        ["useDDPandHA", "Enable Dolby and HE-AAC 5.1 Audio"],
        // ["useXHA", "Focus xHE-AAC Audio"],
        ["alwaysUseHDR", "Always use HDR or Dolby Vision when available"],
        // ["useFHD", "Focus 1080P"],
        ["disableHouseholdCheck", "Disable checks for Netflix Household"],
    ];
    let menuCommandList = [];

    windowCtx.globalOptions = {
        disableHouseholdCheck: true,
        useDDPandHA: true,
        useXHA: false,
        alwaysUseHDR: false,
        onlyMaxBitrate: true,
        get ["onlyVideoMaxBitrate"]() {
            return windowCtx.globalOptions.onlyMaxBitrate;
        },
        get ["onlyAudioMaxBitrate"]() {
            return windowCtx.globalOptions.onlyMaxBitrate;
        },
        setMaxBitrateOld: false,
        useallSub: true,
        get ["useddplus"]() {
            return windowCtx.globalOptions.useDDPandHA;
        },
        useAVC: false,
        usedef: false,
        get ["useHA"]() {
            return windowCtx.globalOptions.useDDPandHA;
        },
        useAVCH: true,
        usevp9: false,
        useav1: false,
        useprk: true,
        usehevc: false,
        usef4k: true,
        usef12k: false,
        closeimsc: true,
        useFHD: true,
        forceUHD: false,
        forceDV5: false,
    };

    if (await checkHWDrm()) {
        menuItems.push(["forceUHD", "Force use UHD when available"]);
    } else {
        await saveOption("forceUHD", false);
    }

    if (await checkDV5()) {
        await saveOption("forceDV5", true);
    } else {
        await saveOption("forceDV5", false);
    }

    windowCtx.onbeforescriptexecute = function (e) {
        let scripts = document.getElementsByTagName("script");
        if (scripts.length === 0) return;
        for (let i = 0; scripts.length > i; i++) {
            let dom = scripts[i];
            if (dom.src.includes("cadmium-playercore")) {
                // firefox cannot reload src after change src url
                // dom.src = "https://static.cloudmoe.com/res/userscript/netflix-plus/cadmium-playercore.js";
                playercoreDom = dom;
                console.warn("parsing playercore dom");
                windowCtx.onbeforescriptexecute = null;
                break;
            }
        }
    };

    async function checkDV5() {
        let supported = false;
        if (await checkWidevineL1Drm("dvhe.05.01")) {
            supported = true;
        }
        if (await checkPlayReadySL3000Drm("dvhe.05.01")) {
            supported = true;
        }
        return supported;
    }

    async function checkHWDrm() {
        let supported = false;
        if (windowCtx.WebKitMediaKeys) {
            supported = true;
        }
        if (await checkWidevineL1Drm("avc1.42E01E")) {
            supported = true;
        }
        if (await checkPlayReadySL3000Drm("avc1.42E01E")) {
            supported = true;
        }
        return supported;
    }

    async function checkAdvancedDrm() {
        let supported = false;
        if (windowCtx.MSMediaKeys) {
            supported = true;
        }
        if (windowCtx.WebKitMediaKeys) {
            supported = true;
        }
        if (await checkWidevineL1Drm("avc1.42E01E")) {
            supported = true;
        }
        if (await checkPlayReadySL3000Drm("avc1.42E01E")) {
            supported = true;
        }
        console.debug("Supported advanced DRM: " + supported);
        return supported;
    }

    async function checkWidevineL1Drm(codecs) {
        let options = [
            {
                "videoCapabilities": [
                    {
                        "contentType": "video/mp4;codecs=" + codecs,
                        "robustness": "HW_SECURE_ALL"
                    }
                ]
            }
        ];

        try {
            await navigator.requestMediaKeySystemAccess("com.widevine.alpha.experiment", options);
            return true;
        } catch {
            return false;
        }
    }

    async function checkPlayReadySL3000Drm(codecs) {
        let options = [
            {
                "videoCapabilities": [
                    {
                        "contentType": "video/mp4;codecs=" + codecs
                    }
                ]
            }
        ];

        try {
            await navigator.requestMediaKeySystemAccess("com.microsoft.playready.recommendation.3000", options);
            return true;
        } catch {
            return false;
        }
    }

    async function saveOption(option, enable) {
        windowCtx.globalOptions[option] = enable;
        await GM_setValue("NETFLIX_PLUS_" + option, enable);
    }

    async function checkSelected(type) {
        let selected = await GM_getValue("NETFLIX_PLUS_" + type);
        if (typeof selected == "boolean") {
            return selected;
        } else {
            return windowCtx.globalOptions[type];
        }
    }

    async function registerSelectableVideoProcessingMenuCommand(name, type) {
        let selected = await checkSelected(type);
        windowCtx.globalOptions[type] = selected;
        return await GM_registerMenuCommand((selected ? "✅" : "🔲") + " " + name, async function () {
            await saveOption(type, !selected);
            updateMenuCommand();
        });
    }

    async function updateMenuCommand() {
        for (let command of menuCommandList) {
            await GM_unregisterMenuCommand(command);
        }
        menuCommandList = [];
        for (let menuItem of menuItems) {
            menuCommandList.push(await registerSelectableVideoProcessingMenuCommand(menuItem[1], menuItem[0]));
        }
    }

    async function init() {
        if (windowCtx.globalOptions.forceUHD) {
            delete windowCtx.screen;
            windowCtx.__defineGetter__('screen', function () {
                let s = [];
                s.width = 7680;
                s.height = 4320;
                s.availWidth = 7680;
                s.availHeight = 4320;
                s.availLeft = 0;
                s.availTop = 0;
                s.colorDepth = 32;
                s.isExtended = false;
                s.pixelDepth = 32;
                return s;
            });
            delete windowCtx.devicePixelRatio;
            windowCtx.devicePixelRatio = 4;
            windowCtx.MediaKeys.prototype.getStatusForPolicyOriginal = windowCtx.MediaKeys.prototype.getStatusForPolicy;
            windowCtx.MediaKeys.prototype.getStatusForPolicy = async function (policy) {
                return "usable";
            }
        }
    }

    await updateMenuCommand();
    await init();
})();