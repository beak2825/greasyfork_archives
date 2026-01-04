// ==UserScript==
// @name               Apple Daily Hong Kong Content Blocker Removal (Modified)
// @description        (Hong Kong Region) Remove the annoying "Next Member only" content blocker. Now you can read the news without a Next Member account!
// @name:zh-TW         香港蘋果日報訂閱制限制移除（修正版）
// @description:zh-TW  （香港地區）將「壹會員限定」訂閱制限制解除，無需壹會員帳號也能夠閱讀所有新聞！
// @version            2.1.8
// @include      /^https?\:\/\/hk\.appledaily\.com/
// @include      /^https?\:\/\/hk\.nextmgz\.com/
//      /^https?\:\/\/etw\.nextdigital\.com\.hk/
// @run-at             document-start
// @grant GM_addStyle
// @namespace https://greasyfork.org/users/371179
// @downloadURL https://update.greasyfork.org/scripts/427557/Apple%20Daily%20Hong%20Kong%20Content%20Blocker%20Removal%20%28Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427557/Apple%20Daily%20Hong%20Kong%20Content%20Blocker%20Removal%20%28Modified%29.meta.js
// ==/UserScript==
"use strict";

(function $$() {

    if (!document || !document.documentElement) return window.requestAnimationFrame($$);

    //reference https://greasyfork.org/scripts/387996-appledaily-login-bypass/code
    function injectScript() {

        var pOMO = null,
            qOMO = null;

        function S(b) {
            this.__defaultValue__ = b
        }
        S.call(S, '')

        function rext(res, arr) {
            var defaultValue = null;

            function arrLoop(k) {
                switch (typeof k) {
                    case 'string':
                        res[k] = defaultValue;
                        break;
                    case 'object':
                    case 'function':
                        if ('__defaultValue__' in k) {
                            defaultValue = k.__defaultValue__;
                            break;
                        }
                        /* falls through */
                        default:
                            defaultValue = k;
                }
            }
            if (arr && 'forEach' in arr) {
                arr.forEach(arrLoop);
            }
            return res;
        }

        function makeOMO() {
            function OMO(obj) {
                if (typeof obj == 'object') {
                    for (var k in obj) {
                        if (obj[k] && (typeof obj[k] == 'string' || typeof obj[k] == 'number')) {
                            this[k] = obj[k]
                        }
                    }
                }
            }

            var auth = function() {
                return rext({
                    subscribe: (pOMO ? pOMO.prototype.auth : null) || function(e) {},
                    onSuccessfulLogin: (pOMO ? pOMO.prototype.onSuccessfulLogin : null) || function(e) {},
                    getUserInfo: function() {
                        return {
                            isLoggedIn: true,
                            currentAccount: {
                                accountId: 8964,
                                birthday: 1,
                                email: "chantaiman@gov.hk",
                                firstName: "tai man",
                                lastName: "chan",
                                gender: 1,
                                refreshToken: 1,
                                isEmailVerified: true,
                                isPhoneVerified: true,
                                phone: 89648964,
                                snsTokens: [],
                                profiles: [{
                                    profileId: 1,
                                    displayName: "Chan Tai Man",
                                    status: 1,
                                    image: 1,
                                    accountId: 8964,
                                    accessToken: 8964,
                                }],
                                socialProviders: [],
                                roles: 1,
                                sessionExceedLimit: -1,
                                subscription: null
                            },
                            currentProfile: {},
                            currentCdnToken: 1,
                            snsTokens: []
                        }
                    },
                    isUserEntitled: function() {
                        return new Promise(function() {})
                    }
                }, [
                    function() {},
                    "updateAccessToken", "acquireCdnToken", "fetchEventsFromAuthCode", "fetchPostRedirectNotifications",
                    "cleanUrlAfterRedirect", "getLoginStatus", "switchOverSession", "fetchCurrentProfile", "fetchCurrentAccount",
                    "fetchWebAccessToken", "_appLogout", "refetchCurrentUser", "logoutCurrentUser", "switchProfile", "getRedirectUrl",
                    "openLoginDialog", "redirectLogin", "redirectProfile", "showProfile", "showInvoice", "globalLogout",
                    "showInvoicePreference", "getFingerprint", "getAccessToken", "bindWindowMessageHandler",
                    "_setSnsTokens", "loadOnStartup", "lotameAutoLog", "_updateLoginState", "_subDomainChanged",
                    function(e) {},
                    "triggerRedirectEvents", "addSessionHandler", "triggerSessionCallbacks", "snsAuth", "triggerCallbacks",
                    "localLogout", "_setCurrentProfile", "_setCurrentCdnToken", "_setCurrentAccount", "_setCurrentWebAccessToken",
                    function(e, t) {}, "_setShareToken"
                ])
            };

            rext(OMO.prototype, [
                function() {},
                "auth", "getCommentService", "getLotameSettings", "getMediaService", "getMeterInformation",
                "getSubscriptionSettings", "initCommentStreams", "initCriticStreams", "logger", "membership",
                "payment", "setAuthenticationServerUrl", "setRedirectUrl", "setupIeWorkarounds", "_getAppId",
                "_initServices", "logger", "logger",
                auth, "auth"
            ])

            return OMO;
        };


        Object.defineProperty(window, "OMO", {
            get() {
                qOMO = qOMO || makeOMO();
                return qOMO;
            },
            set(nv) {
                pOMO = nv
            },
            configurable: true,
            enumerable: true
        });



        if (!window.googletag) {

            window.googletag = rext({}, [
                function() {},
                "getVersion", "companionAds", "content", "defineOutOfPageSlot", "defineSlot", "defineUnit", "destroySlots", "disablePublisherConsole",
                "display", "enableServices", "evalScripts", "getEventLog", "getVersion", "getWindowsThatCanCommunicateWithHostpageLibrary",
                "onPubConsoleJsLoad", "openConsole", "truesetAdIframeTitle", "sizeMapping",
                true, "_loaded_", "_loadStarted_", "apiReady", "pubadsReady",
                {}, "_vars_", "enums", "encryptedSignalProviders", "encryptedSignalSource",
                [], "cmd",
                function() {
                    return rext({}, [
                        function() {},
                        "addEventListener", "removeEventListener", "getSlots", "getSlotIdMap", "enable", "getName", "setTargeting",
                        "clearTargeting", "getTargeting", "getTargetingKeys", "setCategoryExclusion", "clearCategoryExclusions",
                        "disableInitialLoad", "enableSingleRequest", "enableAsyncRendering", "enableSyncRendering", "enableLazyLoad",
                        "setCentering", "definePassback", "refresh", "enableVideoAds", "setVideoContent", "collapseEmptyDivs", "clear",
                        "setLocation", "setCookieOptions", "setTagForChildDirectedTreatment", "clearTagForChildDirectedTreatment",
                        "setPublisherProvidedId", "set", "get", "getAttributeKeys", "display", "updateCorrelator", "defineOutOfPagePassback",
                        "setForceSafeFrame", "setSafeFrameConfig", "setRequestNonPersonalizedAds", "setTagForUnderAgeOfConsent", "getCorrelator",
                        "getTagSessionCorrelator", "getVideoContent", "getVersion", "forceExperiment", "setCorrelator", "markAsAmp", "isSRA",
                        "setImaContent", "getImaContent", "isInitialLoadDisabled", "setPrivacySettings"
                    ]);
                }, "pubads"
            ]);

        }

        if (!window.gpt) {

            window.gpt = rext({}, [
                function() {}, 'createAdSlot'
            ]);

        }

        if (!window.google) {

            window.google = {
                "ima": {
                    "AdError": {
                        "ErrorCode": rext({}, [
                            7,
                            "DEPRECATED_ERROR_CODE", "VAST_MALFORMED_RESPONSE", "VAST_SCHEMA_VALIDATION_ERROR",
                            "VAST_UNSUPPORTED_VERSION", "VAST_TRAFFICKING_ERROR", "VAST_UNEXPECTED_LINEARITY",
                            "VAST_UNEXPECTED_DURATION_ERROR", "VAST_WRAPPER_ERROR", "VAST_LOAD_TIMEOUT",
                            "VAST_TOO_MANY_REDIRECTS", "VAST_NO_ADS_AFTER_WRAPPER", "VIDEO_PLAY_ERROR",
                            "VAST_MEDIA_LOAD_TIMEOUT", "VAST_LINEAR_ASSET_MISMATCH", "VAST_PROBLEM_DISPLAYING_MEDIA_FILE",
                            "OVERLAY_AD_PLAYING_FAILED", "NONLINEAR_DIMENSIONS_ERROR", "Kg", "lh", "Nf", "If", "UNKNOWN_ERROR",
                            "VPAID_ERROR", "FAILED_TO_REQUEST_ADS", "VAST_ASSET_NOT_FOUND", "VAST_EMPTY_RESPONSE",
                            "UNKNOWN_AD_RESPONSE", "UNSUPPORTED_LOCALE", "ADS_REQUEST_NETWORK_ERROR", "INVALID_AD_TAG",
                            "STREAM_INITIALIZATION_FAILED", "ASSET_FALLBACK_FAILED", "INVALID_ARGUMENTS", "Dg",
                            "AUTOPLAY_DISALLOWED", "CONSENT_MANAGEMENT_PROVIDER_NOT_READY", "$g", "VIDEO_ELEMENT_USED",
                            "VIDEO_ELEMENT_REQUIRED", "VAST_MEDIA_ERROR", "ADSLOT_NOT_VISIBLE", "OVERLAY_AD_LOADING_FAILED", "COMPANION_AD_LOADING_FAILED"
                        ]),
                        "Type": rext({}, [S, "AD_LOAD", "AD_PLAY"])
                    },
                    "AdErrorEvent": {
                        "Type": rext({}, [S, "AD_ERROR"])
                    },
                    "AdEvent": {
                        "Type": rext({}, [
                            S,
                            "AD_CAN_PLAY", "Af", "CONTENT_PAUSE_REQUESTED", "CONTENT_RESUME_REQUESTED", "CLICK",
                            "VIDEO_CLICKED", "VIDEO_ICON_CLICKED", "cd", "EXPANDED_CHANGED", "STARTED", "AD_PROGRESS",
                            "AD_BUFFERING", "IMPRESSION", "jd", "VIEWABLE_IMPRESSION", "dd", "fe", "ge", "he", "je", "ie",
                            "Wf", "PAUSED", "RESUMED", "FIRST_QUARTILE", "MIDPOINT", "THIRD_QUARTILE", "COMPLETE",
                            "DURATION_CHANGE", "USER_CLOSE", "kh", "Pg", "LOADED", "ALL_ADS_COMPLETED", "SKIPPED", "me",
                            "LINEAR_CHANGED", "SKIPPABLE_STATE_CHANGED", "AD_METADATA", "zf", "AD_BREAK_READY", "LOG",
                            "VOLUME_CHANGED", "VOLUME_MUTED", "INTERACTION", "Jf", "hh", "mh", "nh", "oh", "Mf", "Lf", "Kf", "Bg", "ce", "Eg"
                        ])
                    },
                    "AdsManagerLoadedEvent": {
                        "Type": rext({}, [S, "ADS_MANAGER_LOADED"])
                    },
                    "CustomContentLoadedEvent": {
                        "Type": rext({}, [S, "CUSTOM_CONTENT_LOADED"])
                    },
                    "settings": rext({
                        "B": null,
                        "H": {},
                        "ba": [7, ["", 7]]
                    }, [
                        true, "J", "h",
                        false, "K", "F",
                        S, "L", "o", "T", "U", "C", "I", "W", "Z",
                        7, "M", "A", "g", "N", "Y"
                    ]),
                    "ImaSdkSettings": {
                        "CompanionBackfillMode": rext({}, [S, "ALWAYS", "ON_MASTER_AD"]),
                        "VpaidMode": rext({}, [7, "DISABLED", "ENABLED", "INSECURE"])
                    },
                    "VERSION": "",
                    "OmidAccessMode": rext({}, [S, "LIMITED", "DOMAIN", "FULL"]),
                    "UiElements": rext({}, [S, "AD_ATTRIBUTION", "COUNTDOWN"]),
                    "ViewMode": rext({}, [S, "NORMAL", "FULLSCREEN"]),
                    AdDisplayContainer: function AdDisplayContainer() {},
                    AdsLoader: function AdsLoader() {},
                    AdsRequest: function AdsLoader() {},
                }
            };


            rext(window.google.ima.AdsLoader.prototype, [
                function() {}, 'addEventListener', 'requestAds', 'contentComplete'
            ])

            window.google.ima.AdsLoader.prototype.requestAds = function() {
                var _setTimeout = window.setTimeout
                var locker = +new Date + 100;
                //  window.setInterval=function(){console.log(343)}
                window.setTimeout = function(f, t) {
                    if (+new Date > locker) {
                        window.setTimeout = _setTimeout
                        return _setTimeout.apply(this, arguments)

                    }
                    if ((f + "").indexOf('event') > 0) return;
                    if ((f + "").indexOf('.play') > 0) return;
                    console.log(f)
                    _setTimeout(f, 1);
                }
            }
            rext(window.google.ima.AdsRequest.prototype, [
                function() {}, 'setAdWillAutoPlay', 'setAdWillPlayMuted', 'contentComplete'
            ])

            window.google.ima.AdsLoader.prototype.getSettings = function() {
                return rext({}, [function() {}, "setVpaidMode", "setPlayerType", "setPlayerVersion", "setAutoPlayAdBreaks"]);
            }

        }

        // for Next Channel Video Playing
        Object.defineProperty(window, "adsBlock", {
            get() {
                return true
            },
            set(nv) {},
            configurable: true,
            enumerable: true
        });


        // Desktop Site Bypass  // confirmSubscriptionOn
        Object.defineProperty(window, "OMOSubscFlag", {
            get() {
                return false
            },
            set(nv) {},
            configurable: true,
            enumerable: true
        });

        // Mobile Site Bypass
        Object.defineProperty(window, "OMOureadEnable", {
            get() {
                return false
            },
            set(nv) {},
            configurable: true,
            enumerable: true
        });

        Object.defineProperty(window, "registeredSession", {
            get() {
                return 'YES'
            },
            set(nv) {},
            configurable: true,
            enumerable: true
        });

        // 壹週刊 nextmgz
        //Object.defineProperty(window, "uReadDisplayMsgBox", {
        //     writable: false,
        //    value: function() {},
        // });

        // 壹週刊 nextmgz
        // Object.defineProperty(window, "uReadPrompt", {
        //     writable: false,
        //     value: function() {},
        // });

        // 飲食男女 etw.nextdigital.com.hk
        //Object.defineProperty(window, "blockContent", {
        //    writable: false,
        //    value: function() {},
        //});

        console.log("script hack for hk appledaily injected")


    }

    function scriptLoader1() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.innerHTML = "(" + injectScript.toString() + ")();"
        document.documentElement.appendChild(s)
    }

    function scriptLoader0() {
        if (document.documentElement) scriptLoader1();
        else setTimeout(scriptLoader0, 1)
    }
    scriptLoader0();
    GM_addStyle(
        `
    body div#articleBody{display:block !important; height:auto !important; overflow-y: auto !important;}
    body div#articleOmo{opacity:0 !important; position:absolute !important; left:-9px !important; top:-9px !important; height:2px !important; width:2px !important; overflow:hidden !important;}
    body .paywall_fade{opacity:0 !important; position:absolute !important; left:-9px !important; top:-9px !important; height:2px !important; width:2px !important; overflow:hidden !important;}
    body .omo-blocking{opacity:0 !important; position:absolute !important; left:-9px !important; top:-9px !important; height:2px !important; width:2px !important; overflow:hidden !important;}
    body div.user-panel, body div.user-btn{display:none !important;}
    body div.member-pannel>a[rel*="no"][rel*="er"]>img[src*="upgrade"]{display:none !important;}
    body div[class~="member-campaign"], body a[class*="member-campaign-"],body a[class~="member-campaign"], body div[class*="member-campaign-"]{display:none !important;}
    body div[class~="omoLogin"], body div[id~="omoLogin"]{display:none !important;}
    `)


    var expiredAt = -1

    function onReady() {
        if (expiredAt < 0) {
            expiredAt = (+new Date) + 9000
        } else if (+new Date > expiredAt) {
            return;
        }
        //https://hk.nextmgz.com/
        var links = document.querySelectorAll('a[href*="//auth.nextmgz.com/"][href*="redirect_uri="]:not([no_auth])');
        if (links.length > 0) {
            links = Array.prototype.slice.call(links, 0)
            links.forEach(function(link) {
                link.setAttribute('no_auth', 'true');
                link.removeAttribute('data-mburl');
                link.className = (' ' + link.className + ' ').replace(/\s+mbsection\s+/, '').trim();
                if (!link.className) link.removeAttribute('class')
            })
            links = links.filter(function(link) {
                var url = link.getAttribute('href')
                var url_decodeEX = /\Wredirect_uri=([^\&\?]+)/.exec(url)
                if (url_decodeEX) {
                    var url_decode = decodeURIComponent(url_decodeEX[1])
                    if (url_decode && typeof url_decode == 'string' && url_decode.length > 0 && url_decode != url_decodeEX[1] && url_decode.toLocaleLowerCase().indexOf('auth.nextmgz.com') < 0) {
                        link.setAttribute('href', url_decode)
                        link.removeAttribute('no_auth')
                        console.log("decoded url: " + url_decode)
                    }
                }
                return true
            })
        }
        setTimeout(onReady, 33)
    }

    if (document.readyState !== 'loading') {
        onReady();
    } else {
        document.addEventListener('DOMContentLoaded', onReady);
    }
})()