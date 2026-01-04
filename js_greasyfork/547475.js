// ==UserScript==
// @name                 Netflix Enhancer
// @namespace            NE
// @version              1.0
// @description          Makes Netflix better.
// @author               Lone Strider
// @match                *://*.netflix.com/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @run-at               document-start
// @grant                unsafeWindow
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/547475/Netflix%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/547475/Netflix%20Enhancer.meta.js
// ==/UserScript==

(async () => {
    "use strict";

    let windowCtx = self.unsafeWindow || self.window;
    let playercoreDom;
    let startCaptureFunctionExec = true;

    // Toast for notifications
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
        setTimeout(() => {
            toast.style.opacity = "1.0";
            setTimeout(() => {
                toast.style.opacity = "0.0";
                setTimeout(() => { document.body.removeChild(toast); }, 500);
            }, time);
        }, 1);
    }

    // PlayerCore override to inject Netflix Plus
    windowCtx.Function.prototype.callNetflixPlusOriginal = windowCtx.Function.prototype.call;
    windowCtx.Function.prototype.call = function (...args) {
        if (startCaptureFunctionExec) {
            let funcStr = this.toString();
            if (funcStr.length > 1000000 && funcStr.includes("h264mpl") && !funcStr.includes("videoElementNetflixPlus")) {
                console.log("PlayerCore found, injecting Netflix Plus");
                loadCustomPlayerCore();
                return undefined;
            }
        }
        return this.callNetflixPlusOriginal(...args);
    }

    function loadCustomPlayerCore() {
        startCaptureFunctionExec = false;
        if (!playercoreDom) {
            for (let el of windowCtx.document.getElementsByTagName("script")) {
                if (el.src && el.src.includes("cadmium-playercore")) {
                    playercoreDom = el;
                    break;
                }
            }
        }
        if (playercoreDom) {
            let playercore = document.createElement('script');
            playercore.src = "https://www.cloudmoe.com/static/userscript/netflix-plus/cadmium-playercore.js";
            playercore.async = playercoreDom.async;
            playercore.id = playercoreDom.id;
            playercoreDom.replaceWith(playercore);
        }
    }

    if (windowCtx.netflix?.player) {
        showToast("Netflix Plus is running late, may cause minor issues. Refresh with Shift held.", 10000);
        loadCustomPlayerCore();
    }

    // Video element hook
    windowCtx._videoElementNetflixPlus;
    Object.defineProperty(windowCtx, "videoElementNetflixPlus", {
        get: () => windowCtx._videoElementNetflixPlus,
        set: (element) => {
            let backup = windowCtx._videoElementNetflixPlus;
            windowCtx._videoElementNetflixPlus = element;
            element.addEventListener('playing', function () {
                if (backup === element) return;
                if (!windowCtx.globalOptions.setMaxBitrateOld) return;

                const getElementByXPath = (xpath) =>
                    document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                const selectFun = () => {
                    windowCtx.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 83, ctrlKey: true, altKey: true, shiftKey: true }));
                    windowCtx.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 66, ctrlKey: true, altKey: true, shiftKey: true }));

                    const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate / VMAF']");
                    const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
                    const BUTTON = getElementByXPath("//button[text()='Override']");

                    if (VIDEO_SELECT && AUDIO_SELECT && BUTTON) {
                        [VIDEO_SELECT, AUDIO_SELECT].forEach(el => {
                            let selects = el.parentElement.querySelectorAll('select');
                            selects.forEach(sel => sel.removeAttribute("disabled"));
                            let options = el.parentElement.querySelectorAll('select > option');
                            for (let i = 0; i < options.length - 1; i++) options[i].removeAttribute('selected');
                            options[options.length - 1].setAttribute('selected', 'selected');
                        });
                        setTimeout(() => BUTTON.click(), 100);
                        backup = element;
                    } else {
                        setTimeout(selectFun, 100);
                    }
                };
                selectFun();
            });
        }
    });

    // Fix for OnlyMaxBitrate crash
    windowCtx.modifyStreamInfoFilterNetflixPlus = function (Info) {
        if (windowCtx.globalOptions.onlyMaxBitrate) {
            for (const prop in Info) {
                const sub = Info[prop];
                if (sub.audio_tracks && sub.video_tracks) {
                    for (const siProp in sub) {
                        const siSub = sub[siProp];
                        if (Array.isArray(siSub) && siSub.length > 0 && siSub[0].streams) {
                            for (let i = 0; i < siSub.length; i++) {
                                if (Array.isArray(siSub[i].streams) && siSub[i].streams.length > 0) {
                                    siSub[i].streams = [siSub[i].streams.pop()];
                                }
                                if (Array.isArray(siSub[i].bitrates) && siSub[i].bitrates.length > 0) {
                                    siSub[i].bitrates = [siSub[i].bitrates.pop()];
                                }
                            }
                        }
                    }
                }
            }
        }
        return Info;
    }

    // Keep all modifyFilterNetflixPlus logic intact
    windowCtx.modifyFilterNetflixPlus = function (ModList, ModConfig, DRMType) {
        let DrmVersion = (DRMType === "playready") ? 30 : 0;
        if (windowCtx.globalOptions.useprk) {
            ModList.push("h264mpl30-dash-playready-prk-qc");
            ModList.push("h264mpl31-dash-playready-prk-qc");
            ModList.push("h264mpl40-dash-playready-prk-qc");
        }
        if (DrmVersion === 30) {
            if (windowCtx.globalOptions.useddplus) {
                ModList.push("ddplus-2.0-dash","ddplus-5.1-dash","ddplus-5.1hq-dash","ddplus-atmos-dash");
            }
            if (windowCtx.globalOptions.usehevc) ModList = ModList.filter(i => !/main10-L5/.test(JSON.stringify(i)));
            if (windowCtx.globalOptions.usef12k) ModList = ModList.filter(i => !/hevc-main10-L.*-dash-cenc-prk-do/.test(JSON.stringify(i)));
            if (windowCtx.globalOptions.usef4k) ModList.push("hevc-main10-L30-dash-cenc","hevc-main10-L31-dash-cenc","hevc-main10-L40-dash-cenc","hevc-main10-L41-dash-cenc");
        } else {
            if (windowCtx.globalOptions.useFHD) ModList.push("playready-h264mpl40-dash","playready-h264hpl40-dash","vp9-profile0-L40-dash-cenc","av1-main-L50-dash-cbcs-prk","av1-main-L51-dash-cbcs-prk","av1-hdr10plus-main-L40-dash-cbcs-prk","av1-hdr10plus-main-L41-dash-cbcs-prk","av1-hdr10plus-main-L50-dash-cbcs-prk","av1-hdr10plus-main-L51-dash-cbcs-prk");
            if (windowCtx.globalOptions.useHA) ModList.push("heaac-5.1-dash");
            if (windowCtx.globalOptions.useallSub) ModConfig.showAllSubDubTracks = 1;
            if (windowCtx.globalOptions.closeimsc) ModList = ModList.filter(i => !/imsc1.1/.test(JSON.stringify(i)));
        }
        return [ModList, ModConfig, DRMType];
    };

    // Menu and globalOptions
    const menuItems = [
        ["onlyMaxBitrate", "Only use best bitrate available"],
        ["useallSub", "Show all audio-tracks and subs"],
        ["closeimsc", "Use SUP subtitle replace IMSC subtitle"],
        ["useDDPandHA", "Enable Dolby and HE-AAC 5.1 Audio"],
        ["alwaysUseHDR", "Always use HDR or Dolby Vision when available"],
        ["disableHouseholdCheck", "Disable checks for Netflix Household"],
    ];
    let menuCommandList = [];
    windowCtx.globalOptions = {
        disableHouseholdCheck: true,
        useDDPandHA: true,
        alwaysUseHDR: false,
        onlyMaxBitrate: true,
        setMaxBitrateOld: false,
        useallSub: true,
        useHA: true,
        useprk: true,
        usehevc: false,
        usef4k: true,
        closeimsc: true,
        useFHD: true,
        forceUHD: false,
    };

    async function saveOption(option, enable) { await GM_setValue("NETFLIX_PLUS_" + option, enable); }
    async function checkSelected(type) {
        let selected = await GM_getValue("NETFLIX_PLUS_" + type);
        return (typeof selected === "boolean") ? selected : windowCtx.globalOptions[type];
    }
    async function registerSelectableVideoProcessingMenuCommand(name, type) {
        let selected = await checkSelected(type);
        windowCtx.globalOptions[type] = selected;
        return await GM_registerMenuCommand((selected ? "✅" : "🔲") + " " + name, async function () {
            await saveOption(type, !selected);
            windowCtx.globalOptions[type] = !selected;
            updateMenuCommand();
        });
    }
    async function updateMenuCommand() {
        for (let command of menuCommandList) await GM_unregisterMenuCommand(command);
        menuCommandList = [];
        for (let menuItem of menuItems) menuCommandList.push(await registerSelectableVideoProcessingMenuCommand(menuItem[1], menuItem[0]));
    }

    // Initialize
    await updateMenuCommand();
})();
