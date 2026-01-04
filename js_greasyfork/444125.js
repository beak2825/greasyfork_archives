// ==UserScript==
// @name                 Netflix UHD
// @name:zh-CN           Netflix UHD
// @name:zh-TW           Netflix UHD
// @name:ja              Netflix UHD
// @namespace            http://tampermonkey.net/
// @version              1.26
// @description          Play Netflix UHD content on any screen resolution
// @description:zh-CN    让 Netflix 在任何分辨率的显示器上播放 UHD 内容
// @description:zh-TW    讓 Netflix 在任何解析度的顯示器上播放 UHD 內容
// @description:ja       Netflix をあらゆる解像度のディスプレイで UHD コンテンツを再生できるようにする方法です
// @author               TGSAN
// @match                https://www.netflix.com/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @run-at               document-start
// @grant                unsafeWindow
// @grant                GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/444125/Netflix%20UHD.user.js
// @updateURL https://update.greasyfork.org/scripts/444125/Netflix%20UHD.meta.js
// ==/UserScript==

(function () {
    // 'use strict';

    const forceDolbyVision = false;
    const forceHEVC = false;
    const forceUHD = false;
    const forceHDCP = false;
    const forceALL = false;

    let useWindowCtx

    if (self.unsafeWindow) {
        console.log("use unsafeWindow mode");
        useWindowCtx = self.unsafeWindow;
    } else {
        console.log("use window mode");
        useWindowCtx = self.window;
    }

    // Hook

    delete useWindowCtx.screen;
    useWindowCtx.__defineGetter__('screen', function () {
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
    delete useWindowCtx.devicePixelRatio;
    useWindowCtx.devicePixelRatio = 4;

    // useWindowCtx.MSMediaKeysOriginal = useWindowCtx.MSMediaKeys;
    // useWindowCtx.MSMediaKeys = {
    //     isTypeSupportedWithFeatures: function() { return "probably" },
    //     isTypeSupported: function() { return true },
    // };

    if (useWindowCtx.MSMediaKeys) {
        useWindowCtx.MSMediaKeys.isTypeSupportedWithFeaturesOriginal = useWindowCtx.MSMediaKeys.isTypeSupportedWithFeatures;
        useWindowCtx.MSMediaKeys.isTypeSupportedWithFeatures = function (keySystem, targetMediaCodec) {
            const reg = /,display-res-[x|y]=\d+,display-res-[x|y]=\d+/
            targetMediaCodec = targetMediaCodec.replace(reg, "");
            if (forceDolbyVision == true && (targetMediaCodec.indexOf("ext-profile=dvh") !== -1)) {
                keySystem = keySystem.replace("com.microsoft.playready.hardware", "com.microsoft.playready");
            }
            if (forceHEVC == true && targetMediaCodec.indexOf("ext-profile=dvh") === -1 && (targetMediaCodec.indexOf("hvc1") !== -1 || targetMediaCodec.indexOf("hev1") !== -1)) {
                keySystem = keySystem.replace("com.microsoft.playready.hardware", "com.microsoft.playready");
            }
            if (forceHDCP == true && targetMediaCodec.indexOf("hdcp=") !== -1) {
                targetMediaCodec = targetMediaCodec.replace("hdcp=1,", "");
                targetMediaCodec = targetMediaCodec.replace("hdcp=1", "");
                targetMediaCodec = targetMediaCodec.replace("hdcp=2,", "");
                targetMediaCodec = targetMediaCodec.replace("hdcp=2", "");
            }
            if (forceUHD == true && targetMediaCodec.indexOf("decode-res-") !== -1) {
                targetMediaCodec = targetMediaCodec.replace("decode-res-x=3840,", "");
                targetMediaCodec = targetMediaCodec.replace("decode-res-x=3840", "");
                targetMediaCodec = targetMediaCodec.replace("decode-res-y=2160,", "");
                targetMediaCodec = targetMediaCodec.replace("decode-res-y=2160", "");
            }
            let r = this.isTypeSupportedWithFeaturesOriginal(keySystem, targetMediaCodec);
            // if (r !== '') {
            //     console.log("Hook MSMediaKeys isTypeSupportedWithFeatures:", keySystem, targetMediaCodec, r !== '');
            // } else {
            //     console.debug("Hook MSMediaKeys isTypeSupportedWithFeatures:", keySystem, targetMediaCodec, r !== '');
            // }
            if (forceALL) {
                return "probably";
            }
            return r;
        }
        useWindowCtx.MSMediaKeys.isTypeSupportedOriginal = useWindowCtx.MSMediaKeys.isTypeSupported;
        useWindowCtx.MSMediaKeys.isTypeSupported = function (keySystem) {
            keySystem = keySystem.replace("com.microsoft.playready.hardware", "com.microsoft.playready");
            let r = this.isTypeSupportedOriginal(keySystem);
            // if (r !== '') {
            //     console.log("Hook MSMediaKeys isTypeSupportedWithFeatures:", keySystem, targetMediaCodec, r !== '');
            // } else {
            //     console.debug("Hook MSMediaKeys isTypeSupportedWithFeatures:", keySystem, targetMediaCodec, r !== '');
            // }
            return r;
        }
        useWindowCtx.MSMediaKeys.prototype.createSessionOriginal = useWindowCtx.MSMediaKeys.prototype.createSession;
        useWindowCtx.MSMediaKeys.prototype.createSession = function (targetMediaCodec, emptyArrayofInitData, int8ArrayCDMdata) {
            console.log(targetMediaCodec, emptyArrayofInitData, int8ArrayCDMdata);
            const reg = /,display-res-[x|y]=\d+,display-res-[x|y]=\d+/
            targetMediaCodec = targetMediaCodec.replace(reg, "");
            if (forceHDCP == true && targetMediaCodec.indexOf("hdcp=") !== -1) {
                targetMediaCodec = targetMediaCodec.replace("hdcp=1,", "");
                targetMediaCodec = targetMediaCodec.replace("hdcp=1", "");
                targetMediaCodec = targetMediaCodec.replace("hdcp=2,", "");
                targetMediaCodec = targetMediaCodec.replace("hdcp=2", "");
            }
            if (forceUHD == true && targetMediaCodec.indexOf("decode-res-") !== -1) {
                targetMediaCodec = targetMediaCodec.replace("decode-res-x=3840,", "");
                targetMediaCodec = targetMediaCodec.replace("decode-res-x=3840", "");
                targetMediaCodec = targetMediaCodec.replace("decode-res-y=2160,", "");
                targetMediaCodec = targetMediaCodec.replace("decode-res-y=2160", "");
            }
            return this.createSessionOriginal(targetMediaCodec, emptyArrayofInitData, int8ArrayCDMdata);
        }
    }

    if (useWindowCtx.WebKitMediaKeys) {
        useWindowCtx.WebKitMediaKeys.isTypeSupportedOriginal = useWindowCtx.WebKitMediaKeys.isTypeSupported;
        useWindowCtx.WebKitMediaKeys.isTypeSupported = function (keySystem, type) {
            let r = this.isTypeSupportedOriginal(keySystem, type);
            console.log("Hook WebKitMediaKeys", keySystem, type, r);
            return r;
        }
    }

    if (useWindowCtx.navigator.requestMediaKeySystemAccess) {
        useWindowCtx.navigator.requestMediaKeySystemAccessOriginal = useWindowCtx.navigator.requestMediaKeySystemAccess;
        useWindowCtx.navigator.requestMediaKeySystemAccess = async function (keySystem, options) {
            let newKeySystem = keySystem;
            if (keySystem.indexOf("playready") !== -1) {
                try {
                    let r = await useWindowCtx.navigator.requestMediaKeySystemAccessOriginal(newKeySystem, options);
                    return r;
                } catch(e) {
                    console.warn("Fallback PlayReady to SL");
                    newKeySystem = "com.microsoft.playready";
                }
            }
            for (let oi = 0; options.length > oi; oi++) {
                if (options[oi].videoCapabilities != undefined) {
                    for (let vci = 0; options[oi].videoCapabilities.length > vci; vci++) {
                        if (options[oi].videoCapabilities[vci].robustness != undefined) {
                            // options[oi].videoCapabilities[vci].robustness = options[oi].videoCapabilities[vci].robustness.replace("HW_SECURE", "SW_SECURE");
                        }
                    }
                }
            }
            let r = await useWindowCtx.navigator.requestMediaKeySystemAccessOriginal(newKeySystem, options);
            // console.log(options);
            // console.log(r);
            return r;
        }
    }

    // useWindowCtx.MediaKeys.prototype.getStatusForPolicyOriginal = useWindowCtx.MediaKeys.prototype.getStatusForPolicy;
    // useWindowCtx.MediaKeys.prototype.getStatusForPolicy = function(policy) {
    //     let r = this.getStatusForPolicy(policy);
    //     console.log(r, policy);
    //     return r;
    // }

    // WIP: Firefox not support
    // if (useWindowCtx.MediaSource) {
    //     useWindowCtx.MediaSource.isTypeSupportedOriginal = useWindowCtx.MediaSource.isTypeSupported;
    //     useWindowCtx.MediaSource.isTypeSupported = function (mimeType) {
    //         let r = this.isTypeSupportedOriginal(mimeType);
    //         console.log("Hook MSE", mimeType, r);
    //         return r;
    //     }
    // }

    if (useWindowCtx.MediaCapabilities.prototype) {
        useWindowCtx.MediaCapabilities.prototype.decodingInfoOriginal = useWindowCtx.MediaCapabilities.prototype.decodingInfo;
        useWindowCtx.MediaCapabilities.prototype.decodingInfo = function (mediaDecodingConfiguration) {
            let r = this.decodingInfoOriginal(mediaDecodingConfiguration);
            // console.log("MC", mediaDecodingConfiguration, r);
            let p = new Promise((res, rej) => {
                r.then(orir => {
                    // console.log("orir", orir);
                    orir.powerEfficient = orir.supported;
                    orir.smooth = orir.supported;
                    // console.log("orir edited", orir);
                    res(orir);
                }).catch(ex => {
                    rej(ex);
                });
            });
            return p;
        }
    }

    // Ext
    let checkHDCPAsync = async function () {
        if (self.GM_registerMenuCommand && window.MSMediaKeys) {
            // HW
            let hwhdcp0 = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; features="hdcp=0"') != '';
            let hwhdcp0hevc = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; codecs="hev1,mp4a"; features="hdcp=0"') != '';
            let hwhdcp1 = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; features="hdcp=1"') != '';
            let hwhdcp1hevc = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; codecs="hev1,mp4a"; features="hdcp=1"') != '';
            let hwhdcp2 = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; features="hdcp=2"') != '';
            let hwhdcp2hevc = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; codecs="hev1,mp4a"; features="hdcp=2"') != '';
            let hwhdcp2hevc2160p = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.hardware", 'video/mp4; codecs="hev1,mp4a"; features="decode-res-x=3840,decode-res-y=2160,decode-bpc=10,hdcp=2"') != '';
            // SW
            let swhdcp0 = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; features="hdcp=0"') != '';
            let swhdcp0hevc = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; codecs="hev1,mp4a"; features="hdcp=0"') != '';
            let swhdcp1 = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; features="hdcp=1"') != '';
            let swhdcp1hevc = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; codecs="hev1,mp4a"; features="hdcp=1"') != '';
            let swhdcp2 = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; features="hdcp=2"') != '';
            let swhdcp2hevc = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; codecs="hev1,mp4a"; features="hdcp=2"') != '';
            let swhdcp2hevc2160p = window.MSMediaKeys.isTypeSupportedWithFeaturesOriginal("com.microsoft.playready.software", 'video/mp4; codecs="hev1,mp4a"; features="decode-res-x=3840,decode-res-y=2160,decode-bpc=10,hdcp=2"') != '';
            let bool2Status = function (booltype) {
                return booltype ? "✓" : "✕";
            };
            GM_registerMenuCommand("PlayReady DRM Info (" + (hwhdcp2hevc2160p ? "UHD Ready" : "Restricted") + ")", function () {
                // DHCP0
                let content = "PlayReady DRM (without HDCP 2.2):\n";
                content += "Hardware: " + bool2Status(hwhdcp0) + "    Software: " + bool2Status(swhdcp0) + "\n\n";
                // DHCP0 + HEVC
                content += "PlayReady DRM (without HDCP 2.2) with HEVC:\n";
                content += "Hardware: " + bool2Status(hwhdcp0hevc) + "    Software: " + bool2Status(swhdcp0hevc) + "\n\n";
                // DHCP1
                content += "PlayReady DRM (HDCP 2.2):\n";
                content += "Hardware: " + bool2Status(hwhdcp1) + "    Software: " + bool2Status(swhdcp1) + "\n\n";
                // DHCP1 + HEVC
                content += "PlayReady DRM (HDCP 2.2) with HEVC:\n";
                content += "Hardware: " + bool2Status(hwhdcp1hevc) + "    Software: " + bool2Status(swhdcp1hevc) + "\n\n";
                // DHCP2
                content += "PlayReady DRM (HDCP 2.2 Type 1):\n";
                content += "Hardware: " + bool2Status(hwhdcp2) + "    Software: " + bool2Status(swhdcp2) + "\n\n";
                // DHCP2 + HEVC
                content += "PlayReady DRM (HDCP 2.2 Type 1) with HEVC:\n";
                content += "Hardware: " + bool2Status(hwhdcp2hevc) + "    Software: " + bool2Status(swhdcp2hevc) + "\n\n";
                // DHCP2 + HEVC 2160P
                content += "PlayReady DRM (HDCP 2.2 Type 1) with HEVC UHD:\n";
                content += "Hardware: " + bool2Status(hwhdcp2hevc2160p) + "    Software: " + bool2Status(swhdcp2hevc2160p) + "\n\n";
                // Display DRM Info
                alert(content);
            });
        }
    };
    checkHDCPAsync();

    let switchPlayerLog = function () {
        console.log("switch player log");

        useWindowCtx.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 76,
            ctrlKey: true,
            altKey: true,
            shiftKey: true,
        }));
    }

    let loadLocalSubtitle = function () {
        console.log("load local subtitle");

        useWindowCtx.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 84,
            ctrlKey: true,
            altKey: true,
            shiftKey: true,
        }));
    }

    let switchPlayerInfo = function () {
        console.log("switch player info");

        useWindowCtx.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 68,
            ctrlKey: true,
            altKey: true,
            shiftKey: true,
        }));
    }

    let switchStreamSelector = function () {
        console.log("switch player info");

        useWindowCtx.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 83, // S (Old)
            ctrlKey: true,
            altKey: true,
            shiftKey: true,
        }));

        useWindowCtx.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 66, // B
            ctrlKey: true,
            altKey: true,
            shiftKey: true,
        }));
    }

    GM_registerMenuCommand("Player Info", switchPlayerInfo);
    GM_registerMenuCommand("Stream Selector", switchStreamSelector);
    GM_registerMenuCommand("Player Log", switchPlayerLog);
    GM_registerMenuCommand("Load Local Subtitle (.DFXP)", loadLocalSubtitle);
})();