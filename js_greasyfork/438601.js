// ==UserScript==
// @name			7ktTube | 2016 REDUX
// @namespace STILL_ALIVE
// @version 4.0.11
// @description Old YouTube 2016 Layout | Old watchpage | Change thumbnail & video player size | grayscale seen video thumbnails | Hide suggestion blocks, category/filter bars | Square profile-pictures | Disable hover thumbnail previews | and much more!
// @author 7KT-SWE
// @icon            https://7kt.se/resources/images/icon.png
// @icon64          https://7kt.se/resources/images/icon64.png
// @license      GPL-3.0-only
// @homepageURL     https://7kt.se/
// @supportURL      https://discord.7kt.se
// @contributionURL https://www.paypal.com/donate/?hosted_button_id=2EJR4DLTR4Y7Q
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @require         https://update.greasyfork.org/scripts/28536/184529/GM_config.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @grant GM_addElement
// @run-at document-end
// @compatible Chrome >=55 + Tampermonkey + Violentmonkey
// @compatible Firefox >=56 + Tampermonkey + Violentmonkey
// @compatible Opera + Tampermonkey + Violentmonkey
// @compatible Edge + Tampermonkey + Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/438601/7ktTube%20%7C%202016%20REDUX.user.js
// @updateURL https://update.greasyfork.org/scripts/438601/7ktTube%20%7C%202016%20REDUX.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
// fix GM_addStyle

if (typeof GM_addStyle !== "function") {
    function GM_addStyle(css) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        const head = document.getElementsByTagName('head')[0];
        if (head) head.appendChild(style);
        else document.documentElement.appendChild(style);
    }
}

function removeEl (){
const yt_lib_custom = {
    removeEl: selector => {
        let e = document.querySelector(selector);
        e && e.parentNode.removeChild(e);
    },
    getQueryURL: (query, url) => new URLSearchParams((url ? new URL(url) : location).search).get(query),
}

// remove el
window.addEventListener('load', () => {
       document.querySelectorAll("#masthead-ad,#root").forEach(e => e.remove()); // ad
 document.body.addEventListener("yt-navigate-finish", () => {
        yt_lib_custom.removeEl('ytd-miniplayer');
        yt_lib_custom.removeEl('ytd-miniplayer-ui');
        yt_lib_custom.removeEl('.ytp-miniplayer-button');

/* Remove autoplay button in player
        yt_lib_custom.removeEl('div.ytp-autonav-toggle-button-container');
        yt_lib_custom.removeEl('div.ytp-autonav-toggle-button');
*/
        if (window.location.pathname != "/watch") yt_lib_custom.removeEl('#movie_player video');

    });
});
}

function restoreAppbarLinks() {
    var trendingData = {
        "navigationEndpoint": {
            "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "commandMetadata": {
                "webCommandMetadata": {
                    "url": "/feed/trending",
                    "webPageType": "WEB_PAGE_TYPE_BROWSE",
                    "rootVe": 6827,
                    "apiUrl": "/youtubei/v1/browse"
                }
            },
            "browseEndpoint": {
                "browseId": "FEtrending"
            }
        },
        "icon": {
            "iconType": "TRENDING"
        },
        "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
        "formattedTitle": {
            "simpleText": "Trending"
        },
        "accessibility": {
            "accessibilityData": {
                "label": "Trending"
            }
        },
        "isPrimary": true
    };

    var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
    document.querySelector(`#items > ytd-guide-entry-renderer:first-child`).insertAdjacentHTML("afterend", guidetemplate);
    document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;
    document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(3)`).remove();
    document.querySelector("ytd-guide-section-renderer.style-scope:first-child").data.items[1].guideEntryRenderer = trendingData;


    if (yt.config_.LOGGED_IN) {
        const yourVideos = document.querySelector("ytd-guide-entry-renderer a[href*='/videos']");
        const channelId = yourVideos.href.split("/")[4];
        var channelData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/channel/" + channelId,
                        "webPageType": "WEB_PAGE_TYPE_CHANNEL",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": channelId
                }
            },
            "icon": {
                "iconType": "ACCOUNT_BOX"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "My channel"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "My channel"
                }
            },
            "isPrimary": true
        };

        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:first-child`).insertAdjacentHTML("afterend", guidetemplate);
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = channelData;
        document.querySelector("ytd-guide-section-renderer.style-scope:nth-child(1)").data.items[1].guideEntryRenderer = channelData;
        yourVideos.remove();
    }
}

function insertResultsEstimate() {
    waitForElement("#filter-menu #container").then(function(elm) {
        const estimatedResults = parseInt(document.querySelector("ytd-search").data.estimatedResults).toLocaleString();

        if (elm.querySelector(".num-results") !== null) {
            elm.querySelector(".num-results").innerHTML = `About ${estimatedResults} results`;
            return;
        }

        let numResults = document.createElement("p");
        numResults.className = "num-results first-focus";
        numResults.setAttribute("tabindex", "0");
        numResults.innerHTML = `About ${estimatedResults} results`;
        elm.appendChild(numResults);
    });
}

function gen_aspect_fix() {
    "use strict";
    var vidfix = {
        inject: function(is_user_script) {
            var modules;
            var vidfix_api;
            var user_settings;
            var default_language;
            var send_settings_to_page;
            var receive_settings_from_page;
            modules = [];
            vidfix_api = {
                initializeBypasses: function() {
                    var ytd_watch;
                    var sizeBypass;
                    if (ytd_watch = document.querySelector("ytd-watch, ytd-watch-flexy")) {
                        sizeBypass = function() {
                            var width;
                            var height;
                            var movie_player;
                            if (!ytd_watch.theater && !document.querySelector(".iri-full-browser") && (movie_player = document.querySelector("#movie_player"))) {
                                width = movie_player.offsetWidth;
                                height = Math.round(movie_player.offsetWidth / (16 / 9));
                                if (ytd_watch.updateStyles) {
                                    ytd_watch.updateStyles({
                                        "--ytd-watch-flexy-width-ratio": 1,
                                        "--ytd-watch-flexy-height-ratio": 0.5625
                                    });
                                    ytd_watch.updateStyles({
                                        "--ytd-watch-width-ratio": 1,
                                        "--ytd-watch-height-ratio": 0.5625
                                    });
                                }
                            }
                            else {
                                width = window.NaN;
                                height = window.NaN;
                            }
                            return {
                                width: width,
                                height: height
                            };
                        };
                        if (ytd_watch.calculateCurrentPlayerSize_) {
                            if (!ytd_watch.calculateCurrentPlayerSize_.bypassed) {
                                ytd_watch.calculateCurrentPlayerSize_ = sizeBypass;
                                ytd_watch.calculateCurrentPlayerSize_.bypassed = true;
                            }
                            if (!ytd_watch.calculateNormalPlayerSize_.bypassed) {
                                ytd_watch.calculateNormalPlayerSize_ = sizeBypass;
                                ytd_watch.calculateNormalPlayerSize_.bypassed = true;
                            }
                        }
                    }
                },
                initializeSettings: function(new_settings) {
                    var i;
                    var j;
                    var option;
                    var options;
                    var loaded_settings;
                    var vidfix_settings;
                    if (vidfix_settings = document.getElementById("vidfix-settings")) {
                        loaded_settings = JSON.parse(vidfix_settings.textContent || "null");
                        receive_settings_from_page = vidfix_settings.getAttribute("settings-beacon-from");
                        send_settings_to_page = vidfix_settings.getAttribute("settings-beacon-to");
                        vidfix_settings.remove();
                    }
                    user_settings = new_settings || loaded_settings || user_settings || {};
                    for (i = 0; i < modules.length; i++) {
                        for (options in modules[i].options) {
                            if (modules[i].options.hasOwnProperty(options)) {
                                option = modules[i].options[options];
                                if (!(option.id in user_settings) && "value" in option) {
                                    user_settings[option.id] = option.value;
                                }
                            }
                        }
                    }
                },
                initializeModulesUpdate: function() {
                    var i;
                    for (i = 0; i < modules.length; i++) {
                        if (modules[i].onSettingsUpdated) {
                            modules[i].onSettingsUpdated();
                        }
                    }
                },
                initializeModules: function() {
                    var i;
                    for (i = 0; i < modules.length; i++) {
                        if (modules[i].ini) {
                            modules[i].ini();
                        }
                    }
                },
                initializeOption: function() {
                    var key;
                    if (this.started) {
                        return true;
                    }
                    this.started = true;
                    for (key in this.options) {
                        if (this.options.hasOwnProperty(key)) {
                            if (!(key in user_settings) && this.options[key].value) {
                                user_settings[key] = this.options[key].value;
                            }
                        }
                    }
                    return false;
                },
                initializeBroadcast: function(event) {
                    if (event.data) {
                        if (event.data.type === "settings") {
                            if (event.data.payload) {
                                if (event.data.payload.broadcast_id === this.broadcast_channel.name) {
                                    this.initializeSettings(event.data.payload);
                                    this.initializeModulesUpdate();
                                }
                            }
                        }
                    }
                },
                ini: function() {
                    this.initializeSettings();
                    this.broadcast_channel = new BroadcastChannel(user_settings.broadcast_id);
                    this.broadcast_channel.addEventListener("message", this.initializeBroadcast.bind(this));
                    document.documentElement.addEventListener("load", this.initializeSettingsButton, true);
                    document.documentElement.addEventListener("load", this.initializeBypasses, true);
                    if (this.isSettingsPage) {
                        this.initializeModules();
                    }
                }
            };
            vidfix_api.ini();
        },
        isAllowedPage: function() {
            var current_page;
            if (current_page = window.location.pathname.match(/\/[a-z-]+/)) {
                current_page = current_page[0];
            }
            else {
                current_page = window.location.pathname;
            }
            return ["/tv", "/embed", "/live_chat", "/account", "/account_notifications", "/create_channel", "/dashboard", "/upload", "/webcam"].indexOf(current_page) < 0;
        },
        generateUUID: function() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
                .replace(/[018]/g, function(point) {
                return (point ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> point / 4)
                    .toString(16);
            });
        },
        saveSettings: function() {
            if (this.is_user_script) {
                this.GM.setValue(this.id, JSON.stringify(this.user_settings));
            }
            else {
                chrome.storage.local.set({
                    vidfixSettings: this.user_settings
                });
            }
        },
        updateSettingsOnOpenWindows: function() {
            this.broadcast_channel.postMessage({
                type: "settings",
                payload: this.user_settings
            });
        },
        settingsUpdatedFromOtherWindow: function(event) {
            if (event.data && event.data.broadcast_id === this.broadcast_channel.name) {
                this.user_settings = event.data;
                this.saveSettings();
            }
        },
        contentScriptMessages: function(custom_event) {
            var updated_settings;
            if ((updated_settings = custom_event.detail.settings) !== undefined) {
                this.saveSettings();
            }
        },
        initializeScript: function(event) {
            var holder;
            this.user_settings = event[this.id] || event;
            if (!this.user_settings.broadcast_id) {
                this.user_settings.broadcast_id = this.generateUUID();
                this.saveSettings();
            }
            this.broadcast_channel = new BroadcastChannel(this.user_settings.broadcast_id);
            this.broadcast_channel.addEventListener("message", this.settingsUpdatedFromOtherWindow.bind(this));
            event = JSON.stringify(this.user_settings);
            holder = document.createElement("vidfix-settings");
            holder.id = "vidfix-settings";
            holder.textContent = event;
            holder.setAttribute("style", "display: none");
            holder.setAttribute("settings-beacon-from", this.receive_settings_from_page);
            holder.setAttribute("settings-beacon-to", this.send_settings_to_page);
            document.documentElement.appendChild(holder);

            //Fixes chromium based browsers
            if ("trustedTypes" in window) {
                window.trustedTypes.createPolicy('default', {
                    createHTML: str => str,
                    createScriptURL: str=> str,
                    createScript: str=> str,
                });
            }
            GM_addElement('script', {
                textContent: "(" + this.inject + "(" + this.is_user_script.toString() + "))"
            });
            holder.remove();
            this.inject = null;
            delete this.inject;
        },
        main: function(event) {
            var now;
            var context;
            now = Date.now();
            this.receive_settings_from_page = now + "-" + this.generateUUID();
            this.send_settings_to_page = now + 1 + "-" + this.generateUUID();
            window.addEventListener(this.receive_settings_from_page, this.contentScriptMessages.bind(this), false);
            if (!event) {
                if (this.is_user_script) {
                    context = this;
                    // javascript promises are horrible
                    this.GM.getValue(this.id, "{}")
                        .then(function(value) {
                        event = JSON.parse(value);
                        context.initializeScript(event);
                    });
                }
            }
            else {
                this.initializeScript(event);
            }
        },
        ini: function() {
            if (this.isAllowedPage()) {
                this.is_settings_page = window.location.pathname === "/vidfix-settings";
                this.id = "vidfixSettings";
                if (typeof GM === "object" || typeof GM_info === "object") {
                    this.is_user_script = true;
                    // GreaseMonkey 4 polly fill
                    // https://arantius.com/misc/greasemonkey/imports/greasemonkey4-polyfill.js
                    if (typeof GM === "undefined") {
                        this.GM = {
                            setValue: GM_setValue,
                            info: GM_info,
                            getValue: function() {
                                return new Promise((resolve, reject) => {
                                    try {
                                        resolve(GM_getValue.apply(this, arguments));
                                    }
                                    catch (e) {
                                        reject(e);
                                    }
                                });
                            }
                        };
                    }
                    else {
                        this.GM = GM;
                    }
                    this.main();
                }
                else {
                    this.is_user_script = false;
                    chrome.storage.local.get(this.id, this.main.bind(this));
                }
            }
        }
    };

    vidfix.ini();

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.html5-video-player { background-color: #000!important; }');

}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

function subbutton() {
  function doMastheadFix() {
    if (!document.documentElement.hasAttribute("dark")) {
        document.querySelector("ytd-masthead").removeAttribute("dark");
    }
}
window.addEventListener("yt-set-theater-mode-enabled", doMastheadFix, false);
waitForElement('tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]').then(function(elm) {
    var subhover = document.querySelector('tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]');

    subhover.addEventListener("mouseenter", function( event ) {
        event.target.innerText = "Unsubscribe";
    }, false);
    subhover.addEventListener("mouseleave", function( event ) {
        event.target.innerText = "Subscribed";
    }, false);
});

waitForElement('#primary #info #button.dropdown-trigger.style-scope.ytd-menu-renderer').then(function(elm) {
    var morebutton = document.querySelector('#primary #info #button.dropdown-trigger.style-scope.ytd-menu-renderer');
    document.querySelector('#top-level-buttons-computed').appendChild(morebutton);
});
waitForElement('ytd-app #info ytd-toggle-button-renderer.style-text[is-icon-button] #text.ytd-toggle-button-renderer').then(function(elm) {
    var likec = document.querySelector('#info ytd-toggle-button-renderer.style-text[is-icon-button] #text.ytd-toggle-button-renderer');
    likec.innerText.replace(likec.ariaLabel);
});
}

function gen_history() {
    /*
     - Grey out watched video thumbnails info:
     - Use ALT+LeftClick or ALT+RightClick on a video list item to manually toggle the watched marker. The mouse button is defined in the script and can be changed.
     - For restoring/merging history, source file can also be a YouTube's history data JSON (downloadable from https://support.google.com/accounts/answer/3024190?hl=en). Or a list of YouTube video URLs (using current time as timestamps).
   */
    //=== config start ===
    var maxWatchedVideoAge   = 5 * 365; //number of days. set to zero to disable (not recommended)
    var contentLoadMarkDelay = 600;     //number of milliseconds to wait before marking video items on content load phase (increase if slow network/browser)
    var markerMouseButtons   = [0, 1];  //one or more mouse buttons to use for manual marker toggle. 0=left, 1=right, 2=middle. e.g.:
    //if `[0]`, only left button is used, which is ALT+LeftClick.
    //if `[1]`, only right button is used, which is ALT+RightClick.
    //if `[0,1]`, any left or right button can be used, which is: ALT+LeftClick or ALT+RightClick.
    //=== config end ===

    var watchedVideos, ageMultiplier = 24 * 60 * 60 * 1000, xu = /\/watch(?:\?|.*?&)v=([^&]+)|\/shorts\/([^\/\?]+)/,
    querySelector = Element.prototype.querySelector, querySelectorAll = Element.prototype.querySelectorAll;
    function getVideoId(url) {
        var vid = url.match(xu);
        if (vid) vid = vid[1] || vid[2];
        return vid;
    }

    function watched(vid) {
        return !!watchedVideos.entries[vid];
    }

    function processVideoItems(selector) {
        var items = document.querySelectorAll(selector), i, link;
        for (i = items.length-1; i >= 0; i--) {
            if (link = querySelector.call(items[i], "A")) {
                if (watched(getVideoId(link.href))) {
                    items[i].classList.add("watched");
                } else items[i].classList.remove("watched");
            }
        }
    }

  function processAllVideoItems() {
    //home page
    processVideoItems(`.yt-uix-shelfslider-list>.yt-shelf-grid-item`);
    processVideoItems(`#contents.ytd-rich-grid-renderer>ytd-rich-item-renderer, #contents.ytd-rich-shelf-renderer ytd-rich-item-renderer.ytd-rich-shelf-renderer, #contents.ytd-rich-grid-renderer>ytd-rich-grid-row ytd-rich-grid-media`);
    //subscriptions page
    processVideoItems(`.multirow-shelf>.shelf-content>.yt-shelf-grid-item`);
    //history:watch page
    processVideoItems(`ytd-section-list-renderer[page-subtype="history"] .ytd-item-section-renderer>ytd-video-renderer`);
    //channel/user home page
    processVideoItems(`#contents>.ytd-item-section-renderer>.ytd-newspaper-renderer, #items>.yt-horizontal-list-renderer`); //old
    processVideoItems(`#contents>.ytd-channel-featured-content-renderer, #contents>.ytd-shelf-renderer>#grid-container>.ytd-expanded-shelf-contents-renderer`); //new
    //channel/user video page
    processVideoItems(`.yt-uix-slider-list>.featured-content-item, .channels-browse-content-grid>.channels-content-item, #items>.ytd-grid-renderer`);
    //channel/user shorts page
    processVideoItems(`ytd-rich-item-renderer ytd-rich-grid-slim-media`);
    //channel/user playlist page
    processVideoItems(`.expanded-shelf>.expanded-shelf-content-list>.expanded-shelf-content-item-wrapper, .ytd-playlist-video-renderer`);
    //channel/user playlist item page
    processVideoItems(`.pl-video-list .pl-video-table .pl-video, ytd-playlist-panel-video-renderer`);
    //channel/user search page
    if (/^\/(?:(?:c|channel|user)\/)?.*?\/search/.test(location.pathname)) {
      processVideoItems(`.ytd-browse #contents>.ytd-item-section-renderer`); //new
    }
    //search page
    processVideoItems(`#results>.section-list .item-section>li, #browse-items-primary>.browse-list-item-container`); //old
    processVideoItems(`.ytd-search #contents>ytd-video-renderer, .ytd-search #contents>ytd-playlist-renderer, .ytd-search #items>ytd-video-renderer`); //new
    //video page
    processVideoItems(`.watch-sidebar-body>.video-list>.video-list-item, .playlist-videos-container>.playlist-videos-list>li`); //old
    processVideoItems(`.ytd-compact-video-renderer, .ytd-compact-radio-renderer`); //new
  }

    function addHistory(vid, time, noSave, i) {
        if (!watchedVideos.entries[vid]) {
            watchedVideos.index.push(vid);
        } else {
            i = watchedVideos.index.indexOf(vid);
            if (i >= 0) watchedVideos.index.push(watchedVideos.index.splice(i, 1)[0])
        }
        watchedVideos.entries[vid] = time;
        if (!noSave) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
    }

    function delHistory(index, noSave) {
        delete watchedVideos.entries[watchedVideos.index[index]];
        watchedVideos.index.splice(index, 1);
        if (!noSave) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
    }

    var dc, ut;
    function parseData(s, a, i, j, z) {
        try {
            dc = false;
            s = JSON.parse(s);
            //convert to new format if old format.
            //old: [{id:<strVID>, timestamp:<numDate>}, ...]
            //new: {entries:{<stdVID>:<numDate>, ...}, index:[<strVID>, ...]}
            if (Array.isArray(s) && (!s.length || (("object" === typeof s[0]) && s[0].id && s[0].timestamp))) {
                a = s;
                s = {entries: {}, index: []};
                a.forEach(o => {
                    s.entries[o.id] = o.timestamp;
                    s.index.push(o.id);
                });
            } else if (("object" !== typeof s) || ("object" !== typeof s.entries) || !Array.isArray(s.index)) return null;
            //reconstruct index if broken
            if (s.index.length !== (a = Object.keys(s.entries)).length) {
                s.index = a.map(k => [k, s.entries[k]]).sort((x, y) => x[1] - y[1]).map(v => v[0]);
                dc = true;
            }
            return s;
        } catch(z) {
            return null;
        }
    }

    function parseYouTubeData(s, a) {
        try {
            s = JSON.parse(s);
            //convert to native format if YouTube format.
            //old: [{titleUrl:<strUrl>, time:<strIsoDate>}, ...] (excludes irrelevant properties)
            //new: {entries:{<stdVID>:<numDate>, ...}, index:[<strVID>, ...]}
            if (Array.isArray(s) && (!s.length || (("object" === typeof s[0]) && s[0].titleUrl && s[0].time))) {
                a = s;
                s = {entries: {}, index: []};
                a.forEach((o, m, t) => {
                    if (o.titleUrl && (m = o.titleUrl.match(xu))) {
                        if (isNaN(t = (new Date(o.time)).getTime())) t = (new Date()).getTime();
                        s.entries[m[1] || m[2]] = t;
                        s.index.push(m[1] || m[2]);
                    }
                });
                s.index.reverse();
                return s;
            } else return null;
        } catch(a) {
            return null;
        }
    }

    function mergeData(o, a) {
        o.index.forEach(i => {
            if (watchedVideos.entries[i]) {
                if (watchedVideos.entries[i] < o.entries[i]) watchedVideos.entries[i] = o.entries[i];
            } else watchedVideos.entries[i] = o.entries[i];
        });
        a = Object.keys(watchedVideos.entries);
        watchedVideos.index = a.map(k => [k, watchedVideos.entries[k]]).sort((x, y) => x[1] - y[1]).map(v => v[0]);
    }

    function getHistory(a, b) {
        a = GM_getValue("watchedVideos");
        if (a === undefined) {
            a = '{"entries": {}, "index": []}';
        } else if ("object" === typeof a) a = JSON.stringify(a);
        if (b = parseData(a)) {
            watchedVideos = b;
            if (dc) b = JSON.stringify(b);
        } else b = JSON.stringify(watchedVideos = {entries: {}, index: []});
        GM_setValue("watchedVideos", b);
    }

    function doProcessPage() {
        //get list of watched videos
        getHistory();

        //remove old watched video history
        var now = (new Date()).valueOf(), changed, vid;
        if (maxWatchedVideoAge > 0) {
            while (watchedVideos.index.length) {
                if (((now - watchedVideos.entries[watchedVideos.index[0]]) / ageMultiplier) > maxWatchedVideoAge) {
                    delHistory(0, false);
                    changed = true;
                } else break;
            }
            if (changed) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
        }

        //check and remember current video
        if ((vid = getVideoId(location.href)) && !watched(vid)) addHistory(vid, now);

        //mark watched videos
        processAllVideoItems();
    }
    function processPage() {
        setTimeout(doProcessPage, Math.floor(contentLoadMarkDelay / 2));
    }

    function delayedProcessPage() {
        setTimeout(doProcessPage, contentLoadMarkDelay);
    }

  function toggleMarker(ele, i) {
    if (ele) {
      if (!ele.href && (i = ele.closest('a'))) ele = i;
      if (ele.href) {
        i = getVideoId(ele.href);
      } else {
        while (ele) {
          while (ele && (!ele.__data || !ele.__data.data || !ele.__data.data.videoId)) ele = ele.__dataHost || ele.parentNode;
          if (ele) {
            i = ele.__data.data.videoId;
            break
          }
        }
      }
      if (i) {
        if ((ele = watchedVideos.index.indexOf(i)) >= 0) {
          delHistory(ele);
        } else addHistory(i, (new Date()).valueOf());
        processAllVideoItems();
      }
    }
  }

    var rxListUrl = /\/\w+_ajax\?|\/results\?search_query|\/v1\/(browse|next|search)\?/;
    var xhropen = XMLHttpRequest.prototype.open, xhrsend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.url_mwyv = url;
        return xhropen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(method, url) {
        if (rxListUrl.test(this.url_mwyv) && !this.listened_mwyv) {
            this.listened_mwyv = 1;
            this.addEventListener("load", delayedProcessPage);
        }
        return xhrsend.apply(this, arguments);
    };

    var fetch_ = unsafeWindow.fetch;
    unsafeWindow.fetch = function(opt) {
        let url = opt.url || opt;
        if (rxListUrl.test(opt.url || opt)) {
            return fetch_.apply(this, arguments).finally(delayedProcessPage);
        } else return fetch_.apply(this, arguments);
    };

    addEventListener("DOMContentLoaded", sty => {
        sty = document.createElement("STYLE");
        sty.innerHTML = `

`;
        document.head.appendChild(sty);
        var nde = Node.prototype.dispatchEvent;
        Node.prototype.dispatchEvent = function(ev) {
            if (ev.type === "yt-service-request-completed") {
                clearTimeout(ut);
                ut = setTimeout(doProcessPage, contentLoadMarkDelay / 2)
            }
            return nde.apply(this, arguments)
        };
    });

    var lastFocusState = document.hasFocus();
    addEventListener("blur", () => {
        lastFocusState = false;
    });
    addEventListener("focus", () => {
        if (!lastFocusState) processPage();
        lastFocusState = true;
    });
    addEventListener("click", (ev) => {
    if ((markerMouseButtons.indexOf(ev.button) >= 0) && ev.altKey) {
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
      toggleMarker(ev.target);
    }
  }, true);

    if (markerMouseButtons.indexOf(1) >= 0) {
        addEventListener("contextmenu", (ev) => {
            if (ev.altKey) toggleMarker(ev.target);
        });
    }
    if (window["body-container"]) { //old
        addEventListener("spfdone", processPage);
        processPage();
    } else { //new
        var t = 0;
        function pl() {
            clearTimeout(t);
            t = setTimeout(processPage, 300);
        }
        (function init(vm) {
            if (vm = document.getElementById("visibility-monitor")) {
                vm.addEventListener("viewport-load", pl);
            } else setTimeout(init, 100);
        })();
        (function init2(mh) {
            if (mh = document.getElementById("masthead")) {
                mh.addEventListener("yt-rendererstamper-finished", pl);
            } else setTimeout(init2, 100);
        })();
        addEventListener("load", delayedProcessPage);
        addEventListener("spfprocess", delayedProcessPage);
    }

    GM_registerMenuCommand("Display History Statistics", () => {
        function sum(r, v) {
            return r + v;
        }
        function avg(arr) {
            return arr && arr.length ? Math.round(arr.reduce(sum, 0) / arr.length) : "(n/a)";
        }
        var pd, pm, py, ld = [], lm = [], ly = [];
        getHistory();
        Object.keys(watchedVideos.entries).forEach((k, t) => {
            t = new Date(watchedVideos.entries[k]);
            if (!pd || (pd !== t.getDate())) {
                ld.push(1);
                pd = t.getDate();
            } else ld[ld.length - 1]++;
            if (!pm || (pm !== (t.getMonth() + 1))) {
                lm.push(1);
                pm = t.getMonth() + 1;
            } else lm[lm.length - 1]++;
            if (!py || (py !== t.getFullYear())) {
                ly.push(1);
                py = t.getFullYear();
            } else ly[ly.length - 1]++;
        });
        if (watchedVideos.index.length) {
            pd = (new Date(watchedVideos.entries[watchedVideos.index[0]])).toLocaleString();
            pm = (new Date(watchedVideos.entries[watchedVideos.index[watchedVideos.index.length - 1]])).toLocaleString();
        } else {
            pd = "(n/a)";
            pm = "(n/a)";
        }
        alert(`\
Number of entries: ${watchedVideos.index.length}
Oldest entry: ${pd}
Newest entry: ${pm}

Average viewed videos per day: ${avg(ld)}
Average viewed videos per month: ${avg(lm)}
Average viewed videos per year: ${avg(ly)}

History data size: ${JSON.stringify(watchedVideos).length} bytes\
`);
  });

    GM_registerMenuCommand("Backup History Data", (a, b) => {
        document.body.appendChild(a = document.createElement("A")).href = URL.createObjectURL(new Blob([JSON.stringify(watchedVideos)], {type: "application/json"}));
        a.download = `MarkWatchedYouTubeVideos_${(new Date()).toISOString()}.json`;
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
    });

    GM_registerMenuCommand("Restore History Data", (a, b) => {
        function askRestore(o) {
            if (confirm(`Selected history data file contains ${o.index.length} entries.\n\nRestore from this data?`)) {
                if (mwyvrhm_ujs.checked) {
                    mergeData(o);
                } else watchedVideos = o;
                GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
                a.remove();
                doProcessPage();
            }
        }
        if (window.mwyvrh_ujs) return;
        (a = document.createElement("DIV")).id = "mwyvrh_ujs";
        a.innerHTML = `<style>
       #mwyvrh_ujs {display:flex;position:fixed;z-index:99999;left:0;top:0;right:0;bottom:0;margin:0;border:none;padding:0;background:rgb(0,0,0,0.5);color:#000;font-family:sans-serif;font-size:12pt;line-height:12pt;font-weight:normal;cursor:pointer}
       #mwyvrhb_ujs {margin:auto;border:.3rem solid #007;border-radius:.3rem;padding:.5rem .5em;background-color:#fff;cursor:auto}
       #mwyvrht_ujs {margin-bottom:1rem;font-size:14pt;line-height:14pt;font-weight:bold}
       #mwyvrhmc_ujs {margin:.5em 0 1em 0;text-align:center}
       #mwyvrhi_ujs {display:block;margin:1rem auto .5rem auto;overflow:hidden}
       </style>
<div id="mwyvrhb_ujs">
  <div id="mwyvrht_ujs">Mark Watched YouTube Videos</div>
  Please select a file to restore history data from.
  <div id="mwyvrhmc_ujs"><label><input id="mwyvrhm_ujs" type="checkbox" checked /> Merge history data instead of replace.</label></div>
  <input id="mwyvrhi_ujs" type="file" multiple />
</div>`;
        a.onclick = e => {
            (e.target === a) && a.remove();
        };
        (b = a.querySelector("#mwyvrhi_ujs")).onchange = r => {
            r = new FileReader();
            r.onload = (o, t) => {
                if (o = parseData(r = r.result)) { //parse as native format
                    if (o.index.length) {
                        askRestore(o);
                    } else alert("File doesn't contain any history entry.");
                } else if (o = parseYouTubeData(r)) { //parse as YouTube format
                    if (o.index.length) {
                        askRestore(o);
                    } else alert("File doesn't contain any history entry.");
                } else { //parse as URL list
                    o = {entries: {}, index: []};
                    t = (new Date()).getTime();
                    r = r.replace(/\r/g, "").split("\n");
                    while (r.length && !r[0].trim()) r.shift();
                    if (r.length && xu.test(r[0])) {
                        r.forEach(s => {
                            if (s = s.match(xu)) {
                                o.entries[s[1] || s[2]] = t;
                                o.index.push(s[1] || s[2]);
                            }
                        });
                        if (o.index.length) {
                            askRestore(o);
                        } else alert("File doesn't contain any history entry.");
                    } else alert("Invalid history data file.");
                }
            };
            r.readAsText(b.files[0]);
        };
        document.documentElement.appendChild(a);
        b.click();
    });
}
var styles = [], intervals = [];

function addInterval(period, func, params) {
	if (!period) period = 1;

	intervals.push({
		cnt: period,
		period: period,
		call: func,
		params: params || []
	});
}

function genSettings() {
    if (document.location.pathname == "/error")
        return;

    GM_config.init({
        "id": "settings-7kt",
        "title": "7ktTube 2016 REDUX Settings",
        "fields": {
			"shorts_redirect": {
                "label": "Redirect shorts to classic watch-page",
                "type": "checkbox",
                "default": false
            },
            "old_player": {
                "label": "Old player style (smaller buttons and menu)",
                "type": "checkbox",
                "default": true
            },
            "search_left": {
                "label": "Align the searchbar to the left",
                "type": "checkbox",
                "default": true
            },
            "hide_guide": {
                "label": "Compact side-bar",
                "type": "checkbox",
                "default": false
            },
            "square_pfps": {
                "label": "Square profile-pictures",
                "type": "checkbox",
                "default": true
            },
            "thumb_preview": {
                "label": "Disable thumbnail video preview while mouse over",
                "type": "checkbox",
                "default": false
            },
            "hide_info_card": {
                "label": "Hide panels in video description on watch-page ",
                "type": "checkbox",
                "default": true
            },
			"hide_clarify_box": {
                "label": "Hide Metadata panels below description ",
                "type": "checkbox",
                "default": false
            },
			"hide_channel_store": {
                "label": "Hide channel-store / merch on watch page",
                "type": "checkbox",
                "default": true
            },
            "hide_queue": {
                "label": "Hide queue button on thumbnails",
                "type": "checkbox",
                "default": false
            },
            "hide_filters_header": {
                "label": "Hide category filter on home page",
                "type": "checkbox",
                "default": true
            },
            "hide_yt_suggested_blocks": {
                "label": "Hide Shorts & suggestion blocks on home page (recommended playlists, posts, etc.)",
                "type": "checkbox",
                "default": true
            },
            "grey_watched": {
                "label": "Make watched video thumbnails black & white and less visible",
                "type": "checkbox",
                "default": true
            },
            "blur_watched": {
                "label": "Blur watched video thumbnails",
                "type": "checkbox",
                "default": true
            },
            "channel_list": {
                "label": "Use list view on channels",
                "type": "checkbox",
                "default": false
            },
            "small_recc": {
                "label": "Smaller recommended thumbnails on watch page",
                "type": "checkbox",
                "default": true
            },
            "use_ryd": {
                "label": "",
                "type": "hidden",
            },
            "full_subs": {
                "label": "Enable full subscriber counts (estimation)",
                "type": "checkbox",
                "default": true
            },
            "clear_search": {
                "label": "Hide unrelated suggestion blocks on search page",
                "type": "checkbox",
                "default": true
            },
            "restore_old_sidebar": {
                "label": "Restore old sidebar links (Trending, My channel)",
                "title": "(will only work if language is set to English)",
                "type": "checkbox",
                "default": true
            },
            "shelves": {
                "label": "",
                "type": "hidden",
            },
            "search_estimate": {
                "label": "Show estimates in search results",
                "type": "checkbox",
                "default": true
            },
            "rightside": {
                "label": "CHECK this if you use the Right Side Description extension",
                "type": "checkbox",
                "default": false
            },
            "logo_style": {
                "label": "Top header Logo style:",
                "type": "select",
                "options": ["7ktTube", "2015-2017", "2017-2020", "Current"],
                "default": "7ktTube"
            },
            "home_thumbnail": {
                "label": "Home thumbnail size:",
                "type": "select",
                "options": ["196px", "238px", "300px", "406px"],
                "default": "196px"
            },
            "search_thumbnail": {
                "label": "Search thumbnail size:",
                "type": "select",
                "options": ["193px", "246px", "360px"],
                "default": "246px"
            },
            "player_size": {
                "label": "Video player size:",
                "type": "select",
                "options": ["Flexible", "640x360", "853x480", "1280x720"],
                "default": "853x480"
            },
            "paypal": {
                "label": "Donate through PayPal (please!)",
                "type": "button",
                "click": () => location.href = 'https://www.paypal.com/donate?hosted_button_id=2EJR4DLTR4Y7Q'
            }
        },
		"events": {
            "open": injectStyles,
			"save": () => document.location.reload()
		}
    });

    // "settings" button
	let settingsButtonMark;
	function createSettingsButton() {
		if (settingsButtonMark && settingsButtonMark.parentNode) return;
        let toolBar = document.getElementsByTagName('ytd-topbar-menu-button-renderer');
        let _1st = toolBar[0];
        if (!_1st) return;
        toolBar = _1st.parentNode;
        let sb = document.createElement('ytd-topbar-menu-button-renderer');
        sb.className = 'style-scope ytd-masthead style-default';
        sb.setAttribute('use-keyboard-focused', '');
        sb.setAttribute('is-icon-button', '');
        sb.setAttribute('has-no-text', '');
        toolBar.insertBefore(sb, toolBar.childNodes[0]);
        let mark = document.createElement('fix-settings-mark');
        mark.style = 'display:none';
        toolBar.insertBefore(mark, sb); // must be added to parent node of buttons in order to Polymer dropped it on soft reload
        let icb = document.createElement('yt-icon-button');
        icb.id = 'button';
        icb.className = 'style-scope ytd-topbar-menu-button-renderer style-default';
        let aa = document.createElement('a');
        aa.className = 'yt-simple-endpoint style-scope ytd-topbar-menu-button-renderer';
        aa.setAttribute('tabindex', '-1');
        aa.target = '_blank';
        aa.appendChild(icb);
        sb.getElementsByTagName('div')[0].appendChild(aa); // created by YT scripts
        let bb = icb.getElementsByTagName('button')[0]; // created by YT scripts
        bb.setAttribute('aria-label', 'fixes settings');
        bb.addEventListener("click", () => GM_config.open());
        let ic = document.createElement('yt-icon');
        ic.className = 'style-scope ytd-topbar-menu-button-renderer';
        bb.appendChild(ic);
        let gpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        gpath.className.baseVal = 'style-scope yt-icon';
        gpath.setAttribute('d', 'M1 20l6-6h2l11-11v-1l2-1 1 1-1 2h-1l-11 11v2l-6 6h-1l-2-2zM13 15l2-2 8 8v1l-1 1h-1zM9 11l2-2-2-2 1.5-3-3-3h-2l3 3-1.5 3-3 1.5-3-3v2l3 3 3-1.5z');
        let svgg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgg.className.baseVal = 'style-scope yt-icon';
        svgg.appendChild(gpath);
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.className.baseVal = 'style-scope yt-icon';
        svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
        svg.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('style', 'pointer-events: none; display: block; width: 100%; height: 100%;');
        svg.appendChild(svgg);
        ic.appendChild(svg); // YT clears *ic
		settingsButtonMark = mark;
    }
    addInterval(1, createSettingsButton, []);

    if (GM_config.get("old_player"))
        applyOldPlayer();
    if (GM_config.get("search_left"))
        alignSearchbar();
    if (GM_config.get("hide_guide"))
        hideGuide();
    if (GM_config.get("square_pfps"))
        squarePFPs();
    if (GM_config.get("thumb_preview"))
        disablePreviews();
    if (GM_config.get("hide_info_card") && window.location.href.includes('watch'))
        hideInfoCards();
	if (GM_config.get("hide_clarify_box"))
        hideClarifyBox();
    if (GM_config.get("hide_queue"))
        hideQueue();
	if (GM_config.get("hide_filters_header"))
		hideHomeFilters();
	if (GM_config.get("hide_channel_store"))
		hideChannelStore();
	if (GM_config.get("hide_yt_suggested_blocks"))
		hideSuggestionBlocks();
	if (GM_config.get("channel_list"))
		channelListView();
	if (GM_config.get("small_recc"))
		smallRecommendations();
	if (GM_config.get("clear_search"))
		hideSearchBlocks();
	if (GM_config.get("restore_old_sidebar"))
		waitForElement('#items > ytd-guide-entry-renderer').then(restoreAppbarLinks);
	if (GM_config.get("shelves"))
		enableHomeShelves();
	if (GM_config.get("search_estimate"))
		window.addEventListener("yt-page-data-updated", insertResultsEstimate, false);
	if (!GM_config.get("rightside"))
		patchNonRSD();
	if (GM_config.get("rightside"))
		fixRSD();
	if (GM_config.get("logo_style") == "2015-2017")
		use2015Logo();
	if (GM_config.get("logo_style") == "2017-2020")
		use2017Logo();
    if (GM_config.get("logo_style") == "7ktTube")
        use7ktLogo();
	if (GM_config.get("shorts_redirect"))
        redir_shorts();

	if (GM_config.get("blur_watched")) {
		if (GM_config.get("grey_watched"))
			greyAndBlurWatched();
		else
			blurWatched();
	} else if (GM_config.get("grey_watched")) {
		greyWatched();
	}

    if (GM_config.get("use_ryd")) {
        addRYDStyles();
        window.addEventListener("yt-page-data-updated", returnDislike, false);
    }

    if (GM_config.get("full_subs")) {
        addFullSubsStyles();
        window.addEventListener("yt-page-data-updated", estimateSubs, false);
    }

	patchHomeThumbnails(GM_config.get("home_thumbnail"));
	patchSearchThumbnails(GM_config.get("search_thumbnail"));
	patchPlayerSize(GM_config.get("player_size"));

    GM_addStyle(styles.join(''));

	// intervals
	setInterval(function () {
		for (const iv of intervals) {
			if (--iv.cnt > 0) continue;
			iv.call.apply(this, iv.params);
			iv.cnt = iv.period;
		}
    }, 1000);
}

function injectStyles(settingsDoc) {
    var css = `
	#settings-7kt select  {
		width: 85px;
		margin-top: 20px;
		margin-left: 25px;
	}
	#settings-7kt_home_thumbnail_field_label {
		position: absolute;
		margin: 0px -10px !important;
	}
	#settings-7kt_player_size_field_label {
		position: absolute;
		margin: 0px -10px !important;
	}
	#settings-7kt_search_thumbnail_field_label {
		position: absolute;
		margin: 0px -10px !important;
	}
	#settings-7kt_logo_style_field_label {
		position: absolute;
		margin: 0px -10px !important;
	}

	#settings-7kt input[type="checkbox"] {
        position: absolute;
        left:0;
        margin-left:6px;
        width: 30px;
        height: 12px;
        -webkitappearance: none;
        appearance: none;
        background: #b8b8b8;
        outline: none;
        border-radius: 2rem;
        cursor: pointer;
		background-size: 200px;
		background-position-y: 37%;
		background-position-x: 22%;

    }
    #settings-7kt input[type="checkbox"]::before {
        content: "";
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fbfbfb;
        position: absolute;
        box-shadow:   1px 1px 2px 1px rgb(0 0 0 / 20%);
        top: 0;
        left: 0;
        transition: 0.5s;
    }
    #settings-7kt input[type="checkbox"]:checked::before {
        transform: translateX(164%);
        background: #fbfbfb
    }
    #settings-7kt input[type="checkbox"]:checked {
        background:#167ac6 no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png);
        background-size:180px;
        background-position-y: 37%;
        background-position-x: 22%;

    }
    #settings-7kt input[type="checkbox"]:checked::before {
        transform: translateX(165%);
        background: #fff
    }
    #settings-7kt input[type="checkbox"]:checked {
        background:#167ac6 no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png);
		background-size: 200px;
		background-position-y: 37%;
		background-position-x: 22%;
	}

    }
    #settings-7kt * {
        font-family: Roboto, Arial, sans-serif;
    }
	#settings-7kt .config_var {
		margin: 0px 10px 2px !important;
	}

    #settings-7kt .config_var::after {
        content: "";
        position: absolute;
        display: inline-block;
        left: 540px;
        top: 300px;
        width: 390px;
        height: 190px;
        background-size: 100%;
    }
	#settings-7kt .field_label {
		cursor: pointer;
		line-height: 20px;
		margin-left: 25px;
	}
    #settings-7kt_old_player_var:hover::after {
        background: url(https://7kt.se/resources/images/old-player.png);
    }
    #settings-7kt_search_left_var:hover::after {
        background: url(https://7kt.se/resources/images/searchbar.png);
    }
    #settings-7kt_hide_guide_var:hover::after {
        background: url(https://7kt.se/resources/images/auto-close-menu.png);
    }
    #settings-7kt_square_pfps_var:hover::after {
        background: url(https://7kt.se/resources/images/square-avatars.png);
    }
    #settings-7kt_hide_info_card_var:hover::after {
        background: url(https://7kt.se/resources/images/hide-info-card.png);
    }
	#settings-7kt_hide_clarify_box_var:hover::after {
        background: url(https://7kt.se/resources/images/hide-clarify-box.png);
    }
	#settings-7kt_hide_channel_store_var:hover::after {
        background: url(https://7kt.se/resources/images/hide-store.png);
    }
    #settings-7kt_hide_queue_var:hover::after {
        background: url(https://7kt.se/resources/images/hide-queue-button.png);
    }
    #settings-7kt_hide_filters_header_var:hover::after {
        background: url(https://7kt.se/resources/images/hide-filters.png);
    }
    #settings-7kt_hide_yt_suggested_blocks_var:hover::after {
        background: url(https://7kt.se/resources/images/recommended-home.png);
    }
    #settings-7kt_grey_watched_var:hover::after {
        background: url(https://7kt.se/resources/images/grey-watched.png);
    }
	#settings-7kt_blur_watched_var:hover::after {
        background: url(https://7kt.se/resources/images/blur-watched.png);
	}
    #settings-7kt_channel_list_var:hover::after {
        background: url(https://7kt.se/resources/images/listview-channel.png);
    }
    #settings-7kt_small_recc_var:hover::after {
        background: url(https://7kt.se/resources/images/small-recommended.png);
    }
    #settings-7kt_hide_dislike_var:hover::after {
        background: url(https://7kt.se/resources/images/hide-dislike.png);
    }
	#settings-7kt_full_subs_var:hover::after {
        background: url(https://7kt.se/resources/images/full-sub.png);
    }
    #settings-7kt_clear_search_var:hover::after {
        background: url(https://7kt.se/resources/images/recommended-search.png);
    }
    #settings-7kt_shelves_var:hover::after {
        background: url(https://7kt.se/resources/images/replace-explore.png);
    }
    #settings-7kt_logo_style_var:hover::after {
        background: url(https://7kt.se/resources/images/logo-style.png);
    }
	 #settings-7kt_wrapper #settings-7kt_closeBtn, #settings-7kt_field_paypal {
		 margin: 15px 0px 0px 0px;
	 }
    .saveclose_buttons, #settings-7kt_field_paypal {
        border-radius: 2px;
        cursor: pointer;
        font: bold 11px arial !important;
        padding: 0 10px !important;
        height: 28px;
        box-shadow: 0 1px 0 rgb(0 0 0/5%) !important;
        border: 1px transparent;
    }
    #settings-7kt_closeBtn, #settings-7kt_field_paypal {
        background-color: #f8f8f8 !important;
        border: solid 1px #d3d3d3 !important;
        color: #000 !important;
    }
    #settings-7kt_closeBtn:hover, #settings-7kt_field_paypal:hover {
        border-color: #c6c6c6 !important;
        background-color: #f0f0f0 !important;
        box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
    }
    #settings-7kt_closeBtn:active, #settings-7kt_field_paypal:active {
        background-color: #e9e9e9 !important;
        box-shadow: inset 0 1px 0 #ddd !important;
    }
    #settings-7kt_saveBtn {
        background-color: #167ac6 !important;
        color: #fff !important;
        border-color: #167ac6 !important;
    }
    #settings-7kt_saveBtn:hover {
        background-color: #126db3 !important;
        border-color: #126db3 !important;
    }
    #settings-7kt_saveBtn:active {
        background-color: #095b99 !important;
        border-color: #126db3 !important;
        box-shadow: inset 0 1px 0 rgb(0 0 0/50%) !important;
    }
	#settings-7kt_buttons_holder {
		text-align: left!important;
		margin: 16px 0px 10px !important;
    }
	#settings-7kt .center {
		text-align:left;
		margin-bottom: 10px!important;
		text-decoration: underline;
	}
	#settings-7kt_resetLink {
		margin-left: 10px!important;
	}`;

    if (document.documentElement.hasAttribute("dark"))
    {
        css += `
        #settings-7kt {
            background: #212121;
            color: #fff;
        }
        #settings-7kt select,
        #settings-7kt input[type="button"],
        #settings-7kt .saveclose_buttons {
            background: #1c1c1c;
            color: #fff;
            border-color: rgba(110, 110, 110, 0.3);

        }
        #settings-7kt .reset {
            color: #fff;
        }
        #settings-7kt_wrapper #settings-7kt_closeBtn, #settings-7kt_field_paypal {
            background-color: #1c1c1c !important;
            border: solid 1px #333 !important;
            color: #fff !important;
			margin: 15px 0px 0px 0px;
        }
        #settings-7kt_wrapper #settings-7kt_closeBtn:hover, #settings-7kt_field_paypal:hover {
            border-color: #3c3c3c !important;
            background-color: #444 !important;
            box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
        }
        #settings-7kt_wrapper #settings-7kt_closeBtn:active, #settings-7kt_field_paypal:active {
            background-color: #555 !important;
            box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
		}`;
    }

    let style = settingsDoc.createElement("style");
    style.type = "text/css";
    style.appendChild(settingsDoc.createTextNode(css));
    const head = settingsDoc.getElementsByTagName("head")[0];
    head.appendChild(style);
}

async function estimateSubs() {
    async function getSubCount(channelID) {
        let subs, retries = 0;
        while (typeof subs === "undefined" && retries < 5) {
            retries++;
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 2000);
                const apiResponse = await fetch(`https://api.socialcounts.org/youtube-live-subscriber-count/${channelID}`, { signal: controller.signal });
                clearTimeout(id);

                const apiResult = await apiResponse.json();
                if (apiResult) {
                    subs = apiResult.est_sub;
                    if (typeof subs !== "undefined")
                        return Number.isInteger(subs) ? subs.toLocaleString() : "0";
                }
            } catch(e) { console.log(`Getting full sub count failed (attempt ${retries}/5)`); }
        }

        console.log("Get full sub count failed after 3 attempts!");
        return "FAILED";
    }

    const resultsObserver = new MutationObserver(async function(mutations) {
        var subscribersTranslation;
        for (const elm of document.querySelectorAll("ytd-channel-renderer:not([patched7kt])")) {
            elm.setAttribute("patched7kt", "");
            const channelID = elm.data.channelId;
            const subCountElm = elm.querySelector("#subscribers");
            const estSubText = subCountElm.innerText;
            if (!estSubText.length)
                continue;

            if (!subscribersTranslation)
                subscribersTranslation = estSubText.slice(estSubText.lastIndexOf(" "));
            subCountElm.innerText = "";

            const subCount = await getSubCount(channelID);
            subCountElm.innerText = subCount != "FAILED" ? subCount + subscribersTranslation : estSubText;
        }
    });

    if (window.location.pathname == "/watch") {
        const channelID = document.querySelector("ytd-app").data.playerResponse.videoDetails.channelId;
        const subCountElm = await waitForElement("#top-row #owner-sub-count.ytd-video-owner-renderer");
        const estSubText = subCountElm.innerText;

        const subscribersTranslation = estSubText.slice(estSubText.lastIndexOf(" "));
        subCountElm.innerText = "";

        const subCount = await getSubCount(channelID);
        subCountElm.innerText = subCount != "FAILED" ? subCount : estSubText.replace(subscribersTranslation, "");
    } else if (window.location.pathname.startsWith("/c/") || window.location.pathname.startsWith("/channel") || window.location.pathname.startsWith("/user")) {
        const channelID = document.querySelector("ytd-app").data.response.header.c4TabbedHeaderRenderer.channelId;
        const subCountElm = await waitForElement("#subscriber-count.ytd-c4-tabbed-header-renderer");
        const estSubText = subCountElm.innerText;

        const subscribersTranslation = estSubText.slice(estSubText.lastIndexOf(" "));
        subCountElm.innerText = "";

        const subCount = await getSubCount(channelID);
        subCountElm.innerText = subCount != "FAILED" ? subCount : estSubText.replace(subscribersTranslation, "");
    } else if (window.location.pathname == "/results") {
        const resultsList = await waitForElement("ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer");
        resultsObserver.observe(resultsList, { childList: true, subtree: true });
    }
}

function addFullSubsStyles() {
    styles.push(`
    #top-row #owner-sub-count.ytd-video-owner-renderer,
    #subscriber-count.ytd-c4-tabbed-header-renderer {
        max-width: 100% !important;
    }
    `);
}

function patchPlayerSize(size) {
	if (size == "Flexible")
		return;

	const split = size.split("x");
	const width = split[0];
	const height = split[1];
	const sizeObj = { w: width, h: height };

	styles.push(`
	#primary.ytd-watch-flexy, #player-container-outer {
	 --ytd-watch-flexy-min-player-width: ${height}px !important;
	 min-width: --ytd-watch-flexy-min-player-width: 100% !important;
	 max-width: ${width}px !important
	}

	ytd-watch-flexy[flexy_][is-two-columns_][is-extra-wide-video_] #primary.ytd-watch-flexy, ytd-watch-flexy[flexy_][is-two-columns_][is-four-three-to-sixteen-nine-video_] #primary.ytd-watch-flexy {
	 min-width: ${width}px!important
	}

	ytd-watch-flexy[flexy_][flexy-large-window_]:not([is-extra-wide-video_]), ytd-watch-flexy[flexy_][flexy-large-window_][transcript-opened_][is-two-columns_]:not([is-extra-wide-video_]), ytd-watch-flexy[flexy_][flexy-large-window_][playlist][is-two-columns_]:not([is-extra-wide-video_]), ytd-watch-flexy[flexy_][flexy-large-window_][should-stamp-chat][is-two-columns_]:not([is-extra-wide-video_]) {
	 --ytd-watch-flexy-min-player-height: ${height}px !important;`);

	addInterval(1, function (sn, st) {
		let eq = document.getElementsByTagName("ytd-watch-flexy");
		if (!eq.length) return;
		let s = eq[0].hasAttribute('size_norm') ? st : sn;
		if (!s) return;
		let ep = document.getElementById("movie_player");
		if (ep && ep.setInternalSize && ep.isFullscreen && ep.getPlayerSize && !ep.isFullscreen() && ep.getPlayerSize().width != s[0])
			ep.setInternalSize(s[0], s[1]);
	}, [sizeObj]);
}

function patchSearchThumbnails(size) {
	styles.push(`
    #contents ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail.ytd-video-renderer,
    ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer,
	ytd-video-renderer[is-search] ytd-thumbnail.ytd-video-renderer,
    ytd-video-renderer[use-prominent-thumbs] #channel-info.ytd-video-renderer,
	ytd-playlist-renderer[use-prominent-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer,
	ytd-radio-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-radio-renderer,
	ytd-playlist-renderer[is-search] ytd-playlist-thumbnail.ytd-playlist-renderer,
	ytd-thumbnail.ytd-radio-renderer,
	ytd-video-renderer[use-bigger-thumbs] ytd-thumbnail.ytd-video-renderer,
	ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style="BIG"] ytd-thumbnail.ytd-video-renderer,
	#contents .yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image,
    #avatar-section.ytd-channel-renderer, ytd-radio-renderer[collections] ytd-playlist-thumbnail.ytd-radio-renderer {
	 max-width: ${size} !important;
	 min-width: 0px !important;
	}`);
}

function patchHomeThumbnails(size) {
	styles.push(`div#contents.style-scope.ytd-rich-grid-renderer {display:block!important}
	ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer {display:inline!important}
	ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div {display:inline!important;margin:0!important}
	ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div > ytd-rich-item-renderer,
	ytd-rich-item-renderer {
	  display: inline-block !important;
	  width: ${size} !important;
	  contain:none !important;
	  margin-right: 6px !important;
	}`);
}

function use2017Logo() {
	styles.push(`
	ytd-masthead #logo-icon-container, #contentContainer #logo-icon-container, ytd-topbar-logo-renderer>#logo {
	 content:var(--logo-2017-light-header) !important;
	 width: 100px !important;
	 height: 30px !important;
	 padding: 0 !important;
	}

	ytd-masthead[dark] #logo-icon-container, html[dark] #contentContainer #logo-icon-container, ytd-masthead[dark] ytd-topbar-logo-renderer>#logo, html[dark] ytd-topbar-logo-renderer>#logo {
	 content:var(--logo-2017-dark-header) !important;
	 width: 100px !important;
	 height: 30px !important;
	}

	ytd-topbar-logo-renderer>#logo {
	 margin-left: -1px;
	}

	#start>#masthead-logo, #masthead>#masthead-logo {
	 content:var(--logo-2017-dark-header) !important;
	 width: 100px !important;
	 height: 30px !important;
	}

	html[dark] #start>#masthead-logo, html[dark] #masthead>#masthead-logo {
	 content:var(--logo-2017-dark-header) !important;
	 width: 100px !important;
	 height: 30px !important;
	}

	#guide-button.ytd-masthead {
	 margin-right: 7px !important;
	 top: 1px;
	 padding: 0 10px;
	}

	#start.ytd-masthead {
	 position: relative;
	 left: 2px;
	}

	ytd-searchbox.ytd-masthead {
	 padding: 0 !important;
	 margin: 0 0 0 38px !important;
	}

	html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
	 background-color: #f00 !important
	}
	[page-subtype="history"] ytd-sub-feed-selector-renderer [aria-checked="true"] #radioLabel.tp-yt-paper-radio-button, [page-subtype="history"] ytd-sub-feed-selector-renderer #radioLabel.tp-yt-paper-radio-button:hover {
	  border-bottom-color:#f00 !important
	}
	#country-code.ytd-topbar-logo-renderer {
	 padding: 0 !important;
	 margin: 1px 0 0 0.3px !important;
	 font-size: 11px;
	}

	html:not([dark]) #guide-section-title.ytd-guide-section-renderer,
	html:not([dark]) #guide #header .title {
	 color: #f00 !important;
	}
	ytd-mini-guide-entry-renderer[is-active] .guide-icon.ytd-mini-guide-entry-renderer {
	color: #f00 !important;
	}
	html:not([dark]) ytd-guide-collapsible-section-entry-renderer.ytd-guide-section-renderer:not(:first-child):before {
	  color: #f00 important;
	}
	`);
}
function redir_shorts() {
function shortsCheck(mutation){
    if (location.href.includes('/shorts/')) {
        location.replace(location.href.replace('/shorts/', '/watch?v='))
    }
}

shortsCheck();

const shortsObserver = new MutationObserver(shortsCheck).observe(document, {subtree: true, childList: true});
}

function use7ktLogo() {
	styles.push(`
	ytd-masthead #logo-icon-container, #contentContainer #logo-icon-container, ytd-topbar-logo-renderer>#logo {
	 content:var(--logo-7kt-light-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	 padding: 0 !important;
	}

	ytd-masthead[dark] #logo-icon-container, html[dark] #contentContainer #logo-icon-container, ytd-masthead[dark] ytd-topbar-logo-renderer>#logo, html[dark] ytd-topbar-logo-renderer>#logo {
	 content:var(--logo-7kt-dark-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	}

	#start>#masthead-logo, #masthead>#masthead-logo {
	 content:var(--logo-7kt-dark-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	}

	html[dark] #start>#masthead-logo, html[dark] #masthead>#masthead-logo {
	 content:var(--logo-7kt-dark-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	}

	#guide-button.ytd-masthead {
	 margin-right: 8px !important;
	 top: 1px;
	 padding: 0 10px;
	}

	#start.ytd-masthead {
	 position: relative;
	 left: 2px;
	}

	ytd-searchbox.ytd-masthead {
	 padding: 0 !important;
	 margin: 0 0 0 38px !important;
	}

	html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
	 background-color: var(--oldcolor) !important
	}
	[page-subtype="history"] ytd-sub-feed-selector-renderer [aria-checked="true"] #radioLabel.tp-yt-paper-radio-button, [page-subtype="history"] ytd-sub-feed-selector-renderer #radioLabel.tp-yt-paper-radio-button:hover {
	  border-bottom-color:var(--oldcolor)!important
	}
	#country-code.ytd-topbar-logo-renderer {
	 padding: 0 !important;
	 margin: -1px 2px 0 !important;
	 font-size: 11px;
	}

	html:not([dark]) #guide-section-title.ytd-guide-section-renderer,
	html:not([dark]) #guide #header .title {
	 color: var(--oldcolor)!important;
	}
	ytd-mini-guide-entry-renderer[is-active] .guide-icon.ytd-mini-guide-entry-renderer {
	color: var(--oldcolor)!important;
	}
	html:not([dark]) ytd-guide-collapsible-section-entry-renderer.ytd-guide-section-renderer:not(:first-child):before {
	  color: var(--oldcolor)important;
	}
	/*OLD RED*/
	html #subscribe-button ytd-button-renderer #button.ytd-button-renderer,html #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer {
	background:#e62117
	}
	html #subscribe-button ytd-button-renderer #button.ytd-button-renderer:hover,html #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:hover {
	background:#cc181e
	}
	html #subscribe-button ytd-button-renderer #button.ytd-button-renderer:active,html #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:active {
	background:#b31217
	}
	`);
}
function use2015Logo() {
	styles.push(`
	ytd-masthead #logo-icon-container, #contentContainer #logo-icon-container, ytd-topbar-logo-renderer>#logo {
	 content:var(--logo-2015-light-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	 padding: 0 !important;
	}

	ytd-masthead[dark] #logo-icon-container, html[dark] #contentContainer #logo-icon-container, ytd-masthead[dark] ytd-topbar-logo-renderer>#logo, html[dark] ytd-topbar-logo-renderer>#logo {
	 content:var(--logo-2015-dark-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	}

	#start>#masthead-logo, #masthead>#masthead-logo {
	 content:var(--logo-2015-dark-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	}

	html[dark] #start>#masthead-logo, html[dark] #masthead>#masthead-logo {
	 content:var(--logo-2015-dark-header) !important;
	 width: 71px !important;
	 height: 30px !important;
	}

	#guide-button.ytd-masthead {
	 margin-right: 8px !important;
	 top: 1px;
	 padding: 0 10px;
	}

	#start.ytd-masthead {
	 position: relative;
	 left: 2px;
	}

	ytd-searchbox.ytd-masthead {
	 padding: 0 !important;
	 margin: 0 0 0 38px !important;
	}

	html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
	 background-color: var(--oldcolor) !important
	}
	[page-subtype="history"] ytd-sub-feed-selector-renderer [aria-checked="true"] #radioLabel.tp-yt-paper-radio-button, [page-subtype="history"] ytd-sub-feed-selector-renderer #radioLabel.tp-yt-paper-radio-button:hover {
	  border-bottom-color:var(--oldcolor)!important
	}
	#country-code.ytd-topbar-logo-renderer {
	 padding: 0 !important;
	 margin: -1px 2px 0 !important;
	 font-size: 11px;
	}

	html:not([dark]) #guide-section-title.ytd-guide-section-renderer,
	html:not([dark]) #guide #header .title {
	 color: var(--oldcolor)!important;
	}
	ytd-mini-guide-entry-renderer[is-active] .guide-icon.ytd-mini-guide-entry-renderer {
	color: var(--oldcolor)!important;
	}
	html:not([dark]) ytd-guide-collapsible-section-entry-renderer.ytd-guide-section-renderer:not(:first-child):before {
	  color: var(--oldcolor)important;
	}
	/*OLD RED*/
	html #subscribe-button ytd-button-renderer #button.ytd-button-renderer,html #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer {
	background:#e62117
	}
	html #subscribe-button ytd-button-renderer #button.ytd-button-renderer:hover,html #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:hover {
	background:#cc181e
	}
	html #subscribe-button ytd-button-renderer #button.ytd-button-renderer:active,html #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:active {
	background:#b31217
	}
	`);
}

function fixRSD() {
	waitForElement('#top-row.ytd-video-secondary-info-renderer').then(function(elm) {
		var watchfrag = document.querySelector('#top-row.ytd-video-secondary-info-renderer');
		document.querySelector('ytd-video-primary-info-renderer > #container').appendChild(watchfrag);
	});
	styles.push(`
	ytd-app #channel-name.ytd-video-owner-renderer {
	  top:-16px!important
	}
	ytd-app ytd-playlist-sidebar-secondary-info-renderer #channel-name.ytd-video-owner-renderer {
	top:0!important
	}
	ytd-app #info ytd-video-primary-info-renderer {
	 margin-top:10px;
	}
	ytd-app #info .ryd-tooltip, #info #sentiment.ytd-video-primary-info-renderer {
	 float:right;
	 top:-37px!important
	}
	ytd-app #info .top-level-buttons.ytd-menu-renderer {
	 border:none
	}
	ytd-app #info {
	 top:75px!important
	}
	ytd-app #info ytd-toggle-button-renderer.style-text[is-icon-button] {
	position:unset!important;
	}
	ytd-app #info ytd-toggle-button-renderer.style-text[is-icon-button]:last-of-type {
	left:0
	}
	`);
}

function patchNonRSD() {
	waitForElement('#top-row.ytd-video-secondary-info-renderer').then(function(elm) {
		var watchfrag = document.querySelector('#top-row.ytd-video-secondary-info-renderer');
		document.querySelector('ytd-video-primary-info-renderer > #container').appendChild(watchfrag);
	});
	styles.push(`
	ytd-app #channel-name.ytd-video-owner-renderer {
	  top:-16px!important
	}
	ytd-app ytd-playlist-sidebar-secondary-info-renderer #channel-name.ytd-video-owner-renderer {
	top:0!important
	}
	ytd-app #info ytd-video-primary-info-renderer {
	 margin-top:10px;
	}
	ytd-app #info .ryd-tooltip, #info #sentiment.ytd-video-primary-info-renderer {
	 float:right;
	 top:-37px!important
	}
	ytd-app #info .top-level-buttons.ytd-menu-renderer {
	 border:none
	}
	ytd-app #info {
	 top:75px!important
	}
	ytd-app #info ytd-toggle-button-renderer.style-text[is-icon-button] {
	position:unset!important;
	}
	ytd-app #info ytd-toggle-button-renderer.style-text[is-icon-button]:last-of-type {
	left:0
	}
	`);
}

function enableHomeShelves() {
	window.addEventListener("yt-page-data-updated", injectShelvesHp, false);
	styles.push(`
	ytd-browse[page-subtype='home'] ytd-rich-grid-renderer {
		display: none !important;
	}
	ytd-browse[page-subtype='home'] #contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer:first-child {
		margin-top: 17px;
		padding-bottom: 3px;
	}

	ytd-browse[page-subtype='home'] #contents.ytd-shelf-renderer {
		margin-top: 5px !important;
	}

	ytd-browse[page-subtype='home'] ytd-thumbnail #thumbnail.ytd-thumbnail {
		margin-left: 0;
	}

	ytd-browse[page-subtype='home'] ytd-section-list-renderer {
		padding: 0 !important;
	}

	ytd-browse[page-subtype='home'] #contents.ytd-item-section-renderer {
		padding: 0 16px;
	}

	ytd-browse[page-subtype='home'] #scroll-container.yt-horizontal-list-renderer ytd-thumbnail-overlay-time-status-renderer {
		margin-top: 5px !important;
	}

	ytd-browse[page-subtype='home'] ytd-shelf-renderer img.yt-img-shadow {
		max-height: var(--ytd-grid-thumbnail_-_height);
	}`);
}

function hideSearchBlocks() {
	styles.push(`
	ytd-two-column-search-results-renderer ytd-shelf-renderer.style-scope.ytd-item-section-renderer, ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer {
	 display: none!important
	}`);
}

async function returnDislike() {
    if (window.location.pathname != "/watch")
        return;

    const menu = await waitForElement("#menu-container");
    const likeButton = document.querySelector("#info #segmented-like-button");

    // reconstruct dislike if needed
    const dislikeButton = document.querySelector("#info #segmented-dislike-button");
    var dislikeText = dislikeButton.querySelector("#text");
    if (!dislikeText) {
        dislikeText = document.createElement("yt-formatted-string");
        dislikeText.className = "style-scope ytd-toggle-button-renderer style-text";
        dislikeText.id = "text";
        dislikeText.removeAttribute("is-empty");
        dislikeButton.querySelector("button").appendChild(dislikeText);
    }

    const videoId = new URL(window.location.href).searchParams.get("v");
    const apiResponse = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
    const apiResult = await apiResponse.json();
    if (!apiResult || "traceId" in apiResponse)
        return;

    const { dislikes } = apiResult;
    const likes = parseInt(likeButton.querySelector("#text").getAttribute("aria-label").match(/\d/g).join(""));
    dislikeText.innerText = dislikes.toLocaleString();

    const rateBar = document.getElementById("return-youtube-dislike-bar-container");
    const widthPx = likeButton.clientWidth + dislikeButton.clientWidth + 8;
    const widthPercent = likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 0;

    dislikeButton.addEventListener("click", function() {
        const btnText = this.querySelector("#text");
        let btnCount = parseInt(btnText.innerText.match(/\d/g).join(""));
        btnCount += this.firstChild.classList.contains("style-default-active") ? 1 : -1;
        btnText.innerText = btnCount.toLocaleString();
    });

    if (!rateBar) {
        menu.insertAdjacentHTML("beforeend", `
        <div class="ryd-tooltip" style="width: ${widthPx}px">
            <div class="ryd-tooltip-bar-container">
               <div id="return-youtube-dislike-bar-container" style="width: 100%; height: 2px">
                  <div id="return-youtube-dislike-bar" style="width: ${widthPercent}%; height: 100%"></div>
               </div>
            </div>
        </div>
        `);
    } else {
        rateBar.style.width = widthPx + "px";
        document.getElementById("return-youtube-dislike-bar").style.width = widthPercent + "%";
    }
}

function addRYDStyles() {
	styles.push(`
    #return-youtube-dislike-bar-container {
      background: var(--yt-spec-icon-disabled);
      border-radius: 2px;
    }
    #return-youtube-dislike-bar {
      background: var(--yt-spec-text-primary);
      border-radius: 2px;
      transition: all 0.15s ease-in-out;
    }
    .ryd-tooltip {
      position: relative;
      display: block;
      height: 2px;
      top: 9px;
    }
    .ryd-tooltip-bar-container {
      width: 100%;
      height: 2px;
      position: absolute;
      padding-top: 6px;
      padding-bottom: 28px;
    }`);
}


function smallRecommendations() {
	styles.push(`#secondary :not([watch-feed-big-thumbs]) ytd-thumbnail, #secondary :not([watch-feed-big-thumbs]) ytd-playlist-thumbnail {
		width:120px!important;
		height:67.5px!important;
	}
	#thumbnail-container.ytd-playlist-panel-video-renderer > ytd-thumbnail.ytd-playlist-panel-video-renderer {
	width: 72px !important;
	height: 45px !important;
	}
		ytd-app #secondary #video-title[class*="renderer"], ytd-app #secondary #movie-title[class*="renderer"] {
		font-weight:500;
		font-size:13px!important;
		line-height:1.1!important;
		margin-bottom:0
	}
		ytd-app #secondary #byline-container #text.ytd-channel-name, html ytd-app #secondary #metadata-line.ytd-video-meta-block span.ytd-video-meta-block {
		line-height:15.4px;
	}
	ytd-app #secondary #byline-container #text.ytd-channel-name, html:not([dark]) ytd-app #secondary #metadata-line.ytd-video-meta-block span.ytd-video-meta-block {
		color:#999!important
	}
		#secondary #contents .ytd-item-section-renderer:not(:first-child) {
		margin-top:15px!important
	}
		#dismissible ytd-badge-supported-renderer.badges .badge.ytd-badge-supported-renderer {
		position:absolute;
		right:10px;
		margin-top:-16px
	}
	#secondary ytd-thumbnail ytd-thumbnail-overlay-bottom-panel-renderer.style-scope {
		top:0!important;
		position:relative;
		left:70px!important
	}
	#secondary ytd-thumbnail-overlay-bottom-panel-renderer.style-scope::before {
		top:-25px!important
	}
	#secondary ytd-thumbnail-overlay-bottom-panel-renderer.style-scope::after {
		top:-10px!important
	}
	yt-icon.style-scope.ytd-thumbnail-overlay-bottom-panel-renderer {
	   top:2px!important
	}
	#secondary .yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image {
	min-width: 120px !important;
	width: 120px !important;
	height:67.5px!important;
	margin-top: 0px !important;
	}
	`);
}

function channelListView() {
	styles.push(`
	[page-subtype="channels"] ytd-section-list-renderer #header-container ytd-channel-sub-menu-renderer {
		border-bottom:0!important;
		padding-bottom:0!important;
		margin-bottom:0!important
	}
	html[dark] [page-subtype="channels"] ytd-section-list-renderer #header-container ytd-channel-sub-menu-renderer {
	   border-color:var(--yt-spec-10-percent-layer)
	}
	#items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-downloaded-video-grid-video-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-grid-radio-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-grid-channel-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-grid-playlist-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-grid-movie-playlist-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-grid-movie-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-grid-show-renderer.ytd-grid-renderer, #items.ytd-grid-renderer > ytd-game-card-renderer.ytd-grid-renderer{
	  display:inline-block!important;
	}
	#items.ytd-grid-renderer{
	  flex-direction:column!important;
	}
	[page-subtype="channels"] #contents > ytd-item-section-renderer > #contents > ytd-grid-renderer > #items > ytd-grid-video-renderer #details.ytd-grid-video-renderer{
	  display:inline-block!important;
	  position: absolute;
	  left: 18%!important;
	  top: 10%;
	  width: 1018px !important;
	}
	ytd-app ytd-section-list-renderer[page-subtype="channels"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer {
		width: 1245px !important;
	}
	.style-scope.ytd-grid-renderer.watched #details.ytd-grid-video-renderer{
	  top: 10%!important;
	}
	ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{
	  font-size:14px!important;
	}
	#scroll-container.yt-horizontal-list-renderer ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{
	  font-size:13px!important;
	}
	#metadata-line.ytd-grid-video-renderer span.ytd-grid-video-renderer{
	  font-size:12px!important;
	}
	#scroll-container.yt-horizontal-list-renderer #metadata-line.ytd-grid-video-renderer span.ytd-grid-video-renderer{
	  font-size:11px!important;
	}
	ytd-browse[page-subtype~="channels"] ytd-two-column-browse-results-renderer.ytd-browse * > #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer{
	  margin-bottom:10px!important;
	}
	ytd-browse[page-subtype~="channels"] ytd-two-column-browse-results-renderer.ytd-browse * > #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer{
	  padding-top:15px!Important;
	  border-top:1px solid #e2e2e2!important;
	  margin-left: -17px;
	  padding-left: 17px !important;
	}`);
}

function greyWatched() {
	styles.push(`
#play.ytd-moving-thumbnail-renderer {
  width: 1px !important;
  height: 1px !important;
}
    .watched ytd-thumbnail[is-original-aspect-ratio] #thumbnail.ytd-thumbnail,
	.watched #thumbnail.fade-in.ytd-moving-thumbnail-renderer,
	.watched .yt-core-image--content-mode-scale-aspect-fill,
	.watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
	.watched yt-img-shadow.ytd-thumbnail {
	   transition: ease-in;
	   transition-duration: 0.2s;
	   opacity: 0.4 !important;
	   filter: grayscale(1)!important;
	}
    .watched ytd-thumbnail[is-original-aspect-ratio] #thumbnail.ytd-thumbnail:hover,
	.watched #thumbnail.fade-in.ytd-moving-thumbnail-renderer:hover,
	.watched .yt-core-image--content-mode-scale-aspect-fill:hover,
	.watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail:hover,
	.watched yt-img-shadow.ytd-thumbnail:hover,
	.watched .yt-core-image.yt-core-image--fill-parent-height.yt-core-image--fill-parent-width.yt-core-image--content-mode-scale-aspect-fill.yt-core-image--loaded:hover	{
	   transition: ease-out;
	   transition-duration: 0.7s;
	   opacity: 1.0 !important;
	   filter:  grayscale(0) !important;
	}`);
}

function blurWatched() {
	styles.push(`
	#play.ytd-moving-thumbnail-renderer {
  width: 1px !important;
  height: 1px !important;
	}
    .watched ytd-thumbnail[is-original-aspect-ratio] #thumbnail.ytd-thumbnail,
	.watched #thumbnail.fade-in.ytd-moving-thumbnail-renderer,
	.watched .yt-core-image--content-mode-scale-aspect-fill,
	.watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
	.watched yt-img-shadow.ytd-thumbnail {
	   transition: ease-in;
	   transition-duration: 0.2s;
	   filter: blur(2.2px) !important;
	}
    .watched ytd-thumbnail[is-original-aspect-ratio] #thumbnail.ytd-thumbnail:hover,
	#thumbnail.fade-in.ytd-moving-thumbnail-renderer:hover,
	.watched .yt-core-image--content-mode-scale-aspect-fill:hover,
	.watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail:hover,
	.watched yt-img-shadow.ytd-thumbnail:hover,
	.watched .yt-core-image.yt-core-image--fill-parent-height.yt-core-image--fill-parent-width.yt-core-image--content-mode-scale-aspect-fill.yt-core-image--loaded:hover	{
	   transition: ease-out;
	   transition-duration: 0.7s;
	   filter:  blur(0px) !important;
	}`);
}

function greyAndBlurWatched() {
	styles.push(`
	#play.ytd-moving-thumbnail-renderer {
  width: 1px !important;
  height: 1px !important;
	}
    .watched ytd-thumbnail[is-original-aspect-ratio] #thumbnail.ytd-thumbnail,
	.watched .yt-core-image--content-mode-scale-aspect-fill,
	.watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail,
	.watched yt-img-shadow.ytd-thumbnail {
	   transition: ease-in;
	   transition-duration: 0.2s;
	   opacity: 0.4 !important;
	   filter: blur(2.2px) grayscale(1)!important;
	}
    .watched ytd-thumbnail[is-original-aspect-ratio] #thumbnail.ytd-thumbnail:hover,
	.watched .yt-core-image--content-mode-scale-aspect-fil:hover,
	.watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail:hover,
	.watched yt-img-shadow.ytd-thumbnail:hover,
	.watched .yt-core-image.yt-core-image--fill-parent-height.yt-core-image--fill-parent-width.yt-core-image--content-mode-scale-aspect-fill.yt-core-image--loaded:hover	{
	   transition: ease-out;
	   transition-duration: 0.7s;
	   opacity: 1.0 !important;
	   filter:  blur(0px) grayscale(0) !important;
	}`);
}


function hideSuggestionBlocks() {
	styles.push(`div#contents.ytd-rich-grid-renderer ytd-rich-section-renderer {
	 display: none!important;
	 }
	 ytd-thumbnail-overlay-endorsement-renderer {
	 display: none !important; }
	 ytd-rich-section-renderer[align-within-rich-grid]{display: none!important;
	}`);
}

function hideClarifyBox() {
    styles.push(`ytd-rich-metadata-row-renderer:not([fixie]) {

	display: none !important;
	}`);
}

function hideChannelStore() {
	styles.push(`
	ytd-merch-shelf-renderer {
        display: none!important
	}
	`);
}

function hideHomeFilters() {
	styles.push(`
	ytd-feed-filter-chip-bar-render {
		display: none!important
	}
	ytd-browse:not([page-subtype="channels"]) #header {
		display: none !important;
    }
	`);
}

function hideQueue() {
    styles.push(`
    .ytd-thumbnail[top-right-overlay] ~ .ytd-thumbnail[top-right-overlay] {
     display:none;
    }
    `);
}

function hideInfoCards() {
    styles.push(`ytd-structured-description-content-renderer.ytd-watch-metadata, ytd-compact-infocard-renderer {
     display: none!important
    }

    /*#details.ytd-rich-grid-video-renderer {
     cursor: auto!important;
     pointer-events: none!important
    }

    #details.ytd-rich-grid-video-renderer *>a, #details.ytd-rich-grid-video-renderer *>button.yt-icon-button {
     cursor: pointer!important;
     pointer-events: initial!important
    }*/
`);
}

function disablePreviews() {
    styles.push(`
    #avatar-link.ytd-rich-grid-media, #avatar-link.ytd-rich-grid-video-renderer, #masthead-ad, #offer-module, #play.fade-in.ytd-moving-thumbnail-renderer, #play.show.ytd-moving-thumbnail-renderer, #selectionBar.paper-tabs, #thumbnail.ytd-moving-thumbnail-renderer, .not-visible.paper-tabs, .ytp-miniplayer-button, [id*=skeleton], paper-ripple, ytd-compact-movie-renderer.ytd-watch-next-secondary-results-renderer, ytd-compact-promoted-item-renderer, ytd-search ytd-video-renderer[use-prominent-thumbs] #channel-info.ytd-video-renderer>a>yt-img-shadow.ytd-video-renderer {
     display: none!important
    }

    #details.ytd-rich-grid-video-renderer {
     cursor: auto!important;
     pointer-events: none!important
    }

    #details.ytd-rich-grid-video-renderer *>a, #details.ytd-rich-grid-video-renderer *>button.yt-icon-button {
     cursor: pointer!important;
     pointer-events: initial!important
    }`);
}

function squarePFPs() {
    styles.push(`
    #thumbnail.ytd-profile-column-user-info-renderer,
    yt-img-shadow.ytd-channel-renderer,
    #avatar.ytd-active-account-header-renderer,
    #avatar.ytd-video-owner-renderer,
    #avatar.ytd-c4-tabbed-header-renderer,
    yt-img-shadow.ytd-channel-avatar-editor,
    yt-img-shadow.ytd-guide-entry-renderer,
    #author-thumbnail.ytd-commentbox,
    #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer,
    #author-thumbnail.ytd-comment-simplebox-renderer,
    #avatar.ytd-video-owner-renderer, .ytd-comment-action-buttons-renderer:nth-of-type(2),
    #hearted-thumbnail.ytd-creator-heart-renderer, ytd-comment-replies-renderer #creator-thumbnail.ytd-comment-replies-renderer yt-img-shadow.ytd-comment-replies-renderer,
    .thumbnail.ytd-notification-renderer, #author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model,
    ytd-commentbox[is-reply][is-backstage-comment] #author-thumbnail.ytd-commentbox, #author-thumbnail.ytd-backstage-post-renderer yt-img-shadow.ytd-backstage-post-renderer,
	.avatar.ytd-recognition-shelf-renderer {
     border-radius: 0%!important;
    }`);
}

function hideGuide() {
	addInterval(1, function (info) {
		if (info.act == 0) { // observe location change
			let url = document.location.toString();
			if (url != info.url) info.act = 1;
		}
		if (info.act == 1) { // wait for sorp page load completion
			let Q = document.querySelector('yt-page-navigation-progress');
			if (!Q) return;
			if (Q.hasAttribute('hidden')) info.act = 2;
		}
		if (info.act == 2) { // wait for button and press it if necessary
			let guide_button = document.getElementById('guide-button');
			if (!guide_button) return;

			let tmp = guide_button.querySelector('button');
			if (!tmp || !tmp.hasAttribute('aria-pressed')) return;

			if (tmp.attributes['aria-pressed'].value == 'true') guide_button.click();
			else {
				info.url = document.location.toString();
				info.act = 0;
			}
		}
	}, [{ act: 2 }]);
}

function alignSearchbar() {
    styles.push(`
    #center.ytd-masthead {
     margin-right: auto;
    }
    tp-yt-paper-toast.paper-toast-open {
      position:static!important;
    }
    yt-notification-action-renderer {
      margin-left:20px;
      margin-top:30px
    }
    `);
}

function applyOldPlayer() {
    (function() {
        'use strict';
        waitForElement(".ytp-exp-bigger-button-like-mobile").then((elm) => elm.setAttribute("class", "html5-video-player ytp-transparent ytp-hide-info-bar"));
    })();
    styles.push(`
    .ytp-volume-slider {
          height: 100%;
          min-height: 40px;
          margin-top: -3px;
    }
    .ytp-larger-tap-buttons .ytp-chrome-controls .ytp-button.ytp-mute-button {
          padding: 2px !important;
      }
      .ytp-chrome-controls .ytp-button[aria-pressed="true"]::after {
          width: 20px !important;
          left: 9px !important;

      }
      .ytp-larger-tap-buttons .ytp-chrome-controls .ytp-button[aria-pressed="true"]::after {
          width: 20px !important;
          left: 9px !important;
          bottom: 6px !important;
      }
      .ytp-big-mode .ytp-chrome-controls .ytp-button[aria-pressed="true"]::after {
          width: 27px !important;
          left: 14px !important;
          bottom: 10px !important;
      }
      .ytp-chrome-controls .ytp-button.ytp-mute-button{
      padding: 2px!important
      }
      .ytp-chrome-bottom {
          height:36px!important
      }
      .ytp-big-mode .ytp-chrome-bottom {
          height:48px!important
      }
      .ytp-progress-bar-container, .ytp-exp-bigger-button-like-mobile.ytp-small-mode .ytp-progress-bar-container {
          bottom:35px!important
      }
      .ytp-big-mode .ytp-progress-bar-container {
          bottom:44px!important
      }

      .ytp-chrome-controls {
      height:40px!important
      }

      .ytp-chrome-bottom .ytp-chrome-controls .ytp-button {
          height:36px!important;
          width:36px
      }
      .ytp-big-mode .ytp-chrome-bottom .ytp-chrome-controls .ytp-button {
          height:54px!important
      }
      .ytp-chrome-bottom .ytp-chrome-controls .ytp-chapter-title.ytp-button {
          width: auto !important;
      }
      .ytp-time-display, .ytp-exp-bigger-button-like-mobile.ytp-small-mode .ytp-time-display {
      line-height:36px!important
      }
      .ytp-big-mode .ytp-time-display {
          line-height:54px!important
      }
          /*volume*/
      .ytp-volume-slider-handle {
          width: 4px!important;
          height: 13px!important;
          background: #fff;
          border-radius:0!important;
          margin-top:-5px!important
      }
      .ytp-big-mode .ytp-volume-slider-handle {
          width:6px!important;
          height:20px!important;
          margin-top:-10px!important
      }
      .ytp-volume-slider-handle::before {
          background:#f12b24!important
      }
      .ytp-volume-slider-handle::before, .ytp-volume-slider-handle::after {
          width:58px!important
      }
      .ytp-big-mode .ytp-volume-slider-handle::before, .ytp-big-mode .ytp-volume-slider-handle::after {
          height:5px!important
      }
      .ytp-big-mode .ytp-volume-slider-handle::before {
          width:86px!important
      }
      .ytp-volume-slider-active .ytp-volume-panel {
          width:44px!important
      }
      .ytp-big-mode .ytp-volume-slider-active .ytp-volume-panel {
          width:66px!important
      }
      /*settings*/
      .ytp-popup {
          background: rgba(28,28,28,0.8)!important;
          text-shadow: 0 0 2px rgb(0 0 0 / 50%)!important;
          border-radius: 0!important
      }
      .ytp-settings-menu {
          bottom:40px!important
      }
      .ytp-big-mode .ytp-settings-menu {
          bottom:50px!important
      }
      .ytp-panel-menu {
          padding:0!important;
          font-weight:normal!important
      }
      .ytp-settings-menu, .ytp-panel-menu {
          color:#bbb!important
      }
      .ytp-menuitem-icon {
          display:none
      }
      .ytp-panel-header {
          padding:0!important
      }
      .ytp-menuitem-label {
          padding:0 10px!Important;
          font-size:100%!important
      }
      .ytp-menuitem, .ytp-panel-header {
          height:27px!important
      }
      .ytp-big-mode .ytp-menuitem, .ytp-big-mode .ytp-panel-header {
          height:37px!important
      }
      .ytp-menuitem[aria-haspopup=true] .ytp-menuitem-content {
          padding-left:0!important
      }
      .ytp-menuitem[role=menuitemradio] .ytp-menuitem-label {
          padding-left:35px!important
      }
      .ytp-big-mode .ytp-menuitem[role=menuitemradio] .ytp-menuitem-label {
          padding-left:45px!important
      }
      .ytp-menuitem-icon {
      display:none!important
      }
      .ytp-panel {
          min-width:100px!important
      }
      .ytp-big-mode .ytp-panel {
          min-width:115px!important
      }
          /*slider handle*/
      .ytp-slider-handle {
          border-radius:0!important;
          width:6px!important
      }
      .ytp-slider-handle:before {
          width:150px!important
      }
      .ytp-slider-handle:before {
          left:-150px!important;
          background-color:#f12b24!important
      }
      .ytp-slider-handle:after {
          left:0!important
      }
      .ytp-chapter-container {
          float: right!important;
          padding: 2px 5px 0 0;
          line-height:40px!important
      }`);
    (function() {
        'use strict';
        waitForElement(".ytp-exp-bigger-button-like-mobile").then((elm) => elm.setAttribute("class", "html5-video-player ytp-transparent ytp-hide-info-bar"));
    })();
}

function restoreAppbarLinks() {
    if (document.documentElement.lang == "en") {
        var trendingData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/feed/trending",
                        "webPageType": "WEB_PAGE_TYPE_BROWSE",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": "FEtrending"
                }
            },
            "icon": {
                "iconType": "TRENDING"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "Trending"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "Trending"
                }
            },
            "isPrimary": true
        };

        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:first-child`).insertAdjacentHTML("afterend", guidetemplate);
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(3)`).remove();
        document.querySelector("ytd-guide-section-renderer.style-scope:first-child").data.items[1].guideEntryRenderer = trendingData;
    }


    if (!document.querySelector("ytd-app").data.response.responseContext.mainAppWebResponseContext.loggedOut) {
        const yourVideos = document.querySelector("ytd-guide-entry-renderer a[href*='/videos']");
        const channelId = yourVideos.href.split("/")[4];
        var channelData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/channel/" + channelId,
                        "webPageType": "WEB_PAGE_TYPE_CHANNEL",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": channelId
                }
            },
            "icon": {
                "iconType": "ACCOUNT_BOX"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "My channel"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "My channel"
                }
            },
            "isPrimary": true
        };

        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:first-child`).insertAdjacentHTML("afterend", guidetemplate);
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = channelData;
        document.querySelector("ytd-guide-section-renderer.style-scope:nth-child(1)").data.items[1].guideEntryRenderer = channelData;
        yourVideos.remove();

        GM_addStyle(`#items > ytd-guide-entry-renderer:nth-child(2) .guide-icon {
            content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAOFJREFUeJztlL0Ng0AMhWlSZ5QMkU0o6KjpIlLAHSNkgkyQLbICA6RPT/hEAk8WxwWJKoolS5Z/3vnZhiT5y0cuvtiXZXny3t/run6i2PiIrQKrqvPROdf22gW0JWcN2FhMV3mRH1BsjUVBoaKd9TQ7pYeNTztdpM98tAPmZnPwaQ41QUBLaaDl0mkcLrVxaoKA9nUtmnssxCIG2DZNc0PnNr8IqF0AwGZtDr43eJyyLOWRZdkulEeMnOhS9Gx0GVZkOctnMyRPh93P5wpFOkKx8X192AZ0m09P6W/2c/hteQFIL1T2NRIk0wAAAABJRU5ErkJggg==);
        }
#section-items > ytd-guide-entry-renderer.ytd-guide-collapsible-section-entry-renderer.style-scope:nth-of-type(1){
	display:none
}
#guide #header .title {
	visibility: hidden;
	margin-left: -15px;
}
#guide #header .title::after {
  content: "LIBRARY";
  visibility: visible;
}

        #items > ytd-guide-entry-renderer:nth-child(2):hover .guide-icon,
        #items > ytd-guide-entry-renderer:nth-child(2) tp-yt-paper-item[aria-selected="true"] .guide-icon {
            content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAMhJREFUeJztVDEKwzAMzNK5a96RF/g1Bj/Dz+neOT/wngdk9ujNqFKREyNsBUOm0oODkJNPkqVkmv4oiDE+AcAjAzIx6dmTNmSGhwxyhz5IMyNmNVbkwlyFpptym7KyuUo2y0rV9vnOaqRGTBIxXjMMjftyle4aetAMZfbjUCdZs4srww35Zm6jhnUV3+k2YuS01ZbLUHZr7aMXRxqc29Afilgb14uDczj62nDwsdg55xe1SBVxVQu/KzCqmTC959MruPXn8Nv4ADy6IMvnpMUsAAAAAElFTkSuQmCC)
        }
		`);
    }
}

function insertResultsEstimate() {
    waitForElement("#filter-menu #container").then(function(elm) {
        const estimatedResults = parseInt(document.querySelector("ytd-search").data.estimatedResults).toLocaleString();

        if (elm.querySelector(".num-results") !== null) {
            elm.querySelector(".num-results").innerHTML = `About ${estimatedResults} results`;
            return;
        }

        let numResults = document.createElement("p");
        numResults.className = "num-results first-focus";
        numResults.setAttribute("tabindex", "0");
        numResults.innerHTML = `About ${estimatedResults} results`;
        elm.appendChild(numResults);
    });
}

function counterstuff() {
function getCounterText (x) {	// x is not wrapper
    try { return x.__data.data.viewCountText.simpleText; } catch (ex) { }
    try { return x.__data.data.content.videoRenderer.viewCountText.simpleText; } catch (ex) { }
}
function replaceCountersText (x) {
    x = x.wrappedJSObject || x;
    const par = x.parentNode.__ytfix_parent;
    if (!par)
        return;
    const tgt = getCounterText (par);
    if (tgt && x.textContent != tgt)
        x.textContent = tgt;
}
function replaceCountersCallback (mm) {
    for (let i = mm.length; --i >= 0; ) {
        const m = mm [i];
        if (m.type == 'characterData')
            replaceCountersText (m.target);
    }
}
const m = new MutationObserver (replaceCountersCallback);
const opt = { subtree: true, characterData: true };
function replaceCountersEach (x) {
    x.setAttribute ('ytfix', '');
    const ee = x.querySelectorAll ('#metadata-line span');
    if (ee.length != 2)
        return;
    const e = ee [0];
    (e.wrappedJSObject || e).__ytfix_parent = x;
    replaceCountersText (e.firstChild);
    m.observe (e, opt);
}
setInterval (function () {
    document.querySelectorAll ('ytd-compact-video-renderer:not([ytfix])').forEach (replaceCountersEach);
    document.querySelectorAll ('ytd-grid-video-renderer:not([ytfix])').forEach (replaceCountersEach);
    document.querySelectorAll ('ytd-rich-item-renderer:not([ytfix])').forEach (replaceCountersEach);
    document.querySelectorAll ('ytd-video-renderer:not([ytfix])').forEach (replaceCountersEach);
}, 1000);
  // this observer disables the like count updating while watching a live stream because it messes with a bunch of things and we can't get full like count from it either
var likeObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (const node of mutation.addedNodes) {
            while (mutation.target.childNodes.length > 1) {
                mutation.target.removeChild(mutation.target.lastChild);
            }
        }
    });
});

waitForElement("#info ytd-toggle-button-renderer.style-text[is-icon-button]:first-child #text.ytd-toggle-button-renderer").then(function(elm) {
    likeObserver.observe(elm, {
        childList: true,
        subtree: true
    });
    document.querySelector('#info ytd-button-renderer:last-of-type yt-formatted-string').innerText = 'Add to';
});

// thanks objectful for a actual working one
}

function patch_css() {
    // patch css
GM_addStyle(`

f:root {
   --dgyt-bg-color-dark: rgb(15, 15, 15);
   --dgyt-bg-color-medium: rgb(33, 33, 33);
   --dgyt-cell-bg-color: rgba(0, 0, 0, 0.2);
   --dgyt-menu-bg-color: rgba(21, 21, 21, 0.8);
   --dgyt-button-color: rgba(255, 255, 255, 0.1);
   --dgyt-button-color-hover: rgba(255, 255, 255, 0.22);
   --dgyt-border-color: rgba(0, 0, 0, 0.2);
   --dgyt-text-main: rgb(192, 192, 192);
   --dgyt-text-secondary: rgb(142, 142, 142);
   --dgyt-text-highlight: rgb(255, 255, 255);
   --dgyt-color-red: rgb(204, 24, 30);
   --dgyt-color-blue: rgb(22, 122, 198);
   --dgyt-color-yellow: rgb(245, 213, 98);
   --dgyt-color-orange: rgb(255, 85, 0);
   --dgyt-color-purple: rgb(156, 39, 176);
   --dgyt-color-green: rgb(76, 175, 80);
}
:root {
   --yt-link-letter-spacing: 0 !important;
   --ytd-user-comment_-_letter-spacing: 0 !important;
   --oldcolor: #cc181e;
}
html:not(.style-scope)[typography-spacing] {
   --yt-subheadline-letter-spacing: 0;
   --yt-thumbnail-attribution-letter-spacing: 0;
   --yt-user-comment-letter-spacing: 0;
   --yt-guide-highlight-letter-spacing: 0;
   --yt-caption-letter-spacing: 0;
   --yt-badge-letter-spacing: 0;
   --yt-tab-system-letter-spacing: 0;
   --yt-subheadline-link-letter-spacing: 0;
   --yt-link-letter-spacing: 0.25px;
}
.html5-video-player {
   background-color: #000 !important;
}
#avatar-link.ytd-rich-grid-media {
   height: 0 !important;
   margin-top: 0 !important;
   margin-right: 0 !important;
   visibility: hidden !important;
   position: fixed !important;
}
yt-live-chat-message-input-renderer {
   margin-bottom: -1px;
}
#chat.ytd-watch-flexy {
   margin-bottom: var(--ytd-margin-3x) !important;
   margin-left: -14px;
   margin-right: 14px;
}
html:not([dark]) #header.ytd-engagement-panel-title-header-renderer {
   background: #f1f1f1;
}
#action-buttons.ytd-tvfilm-offer-module-renderer ytd-button-renderer.ytd-tvfilm-offer-module-renderer:last-child {
   margin-bottom: 0;
   background: url("") !important;
   color: #000;
   height: 20px;
   width: min-content!important;
}
ytd-video-description-gaming-section-renderer {
   display: none!important;
}
#chat-container.ytd-watch-flexy:not([chat-collapsed]) {
   width: var(--ytd-watch-flexy-chat-max-width);
   margin-left: -14px;
   margin-right: 14px;
   margin-bottom: 10px;
}
/*
ytd-watch-flexy[flexy] #chat-container.ytd-watch-flexy:not([chat-collapsed]).ytd-watch-flexy,
ytd-watch-flexy[flexy] #chat.ytd-watch-flexy:not([collapsed]).ytd-watch-flexy {
	min-height: 591px !important;
}
*/
yt-icon.style-scope.ytd-badge-supported-renderer,
ytd-author-comment-badge-renderer:not([m]) #icon.ytd-author-comment-badge-renderer {
   color: transparent;
   fill: transparent !important;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflbdpYum.webp) -146px -556px;
   height: 9px;
   margin-bottom: 0;
}
yt-icon.style-scope.ytd-badge-supported-renderer:hover,
ytd-author-comment-badge-renderer #icon.ytd-author-comment-badge-renderer:hover {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflbdpYum.webp) -732px -646px;
}
a, a:visited {
   color: #167ac6;
}
html[dark] a, html[dark] a:visited {
   color: #fff;
}
ytd-banner-promo-renderer.banner-promo-style-type-masthead-v2 .ytd-banner-promo-renderer-background.ytd-banner-promo-renderer {
   visibility: hidden;
   height: 0 !important;
}
.content.ytd-metadata-row-header-renderer,
ytd-action-companion-ad-renderer {
   display: none !important;
}
#buttons.ytd-masthead > .ytd-masthead:nth-last-child(2) {
   margin-right: 0 !important;
}
#search-input.ytd-searchbox-spt input {
   margin-left: 0 !important;
}
#search-input {
   top: 1px;
   right: 2px;
   position: relative;
}
html:not([dark]) #search-input.ytd-searchbox-spt input::placeholder {
   color: rgb(118, 118, 118);
}
#expander.ytd-comment-renderer > paper-button.ytd-expander {
   text-align: left;
}
.title.style-scope.ytd-video-primary-info-renderer yt-formatted-string.ytd-video-primary-info-renderer {
   font-size: 20px;
}
ntd-toggle-button-renderer {
   font-weight: normal;
}
author-text.yt-simple-endpoint.ytd-comment-renderer,
ytd-author-comment-badge-renderer {
   border-radius: 0 !important;
}
html:not([dark]) #name.ytd-author-comment-badge-renderer,
html:not([dark]) ytd-author-comment-badge-renderer {
   --ytd-author-comment-badge-name-color: #187ac6;
   color: #187ac6;
}
#name.ytd-author-comment-badge-renderer,
ytd-author-comment-badge-renderer {
   --ytd-author-comment-badge-name-color: #fff;
   color: #fff;
}
ytd-expander.ytd-video-secondary-info-renderer {
   font-size: 13px !important;
   --ytd-expander-collapsed-height: 66px !important;
}
html[dark] #vote-count-middle.ytd-comment-action-buttons-renderer {
   color: #3ea6ff !important;
}
ytd-comments-header-renderer.style-scope.ytd-item-section-renderer,
ytd-metadata-row-renderer {
   margin: 0 !important;
}
html[dark] .style-scope.ytd-video-primary-info-renderer {
   color: #fff;
}
#title.ytd-metadata-row-renderer {
   font-size: 11px !important;
   margin: 0 !important;
}
.content.ytd-metadata-row-renderer {
   font-size: 11px !important;
   font-weight: normal !important;
}
ytd-playlist-renderer {
   background: var(--yt-spec-general-background-b) !important;
}
ytd-watch-flexy[flexy][fullscreen] #columns.ytd-watch-flexy {
   min-width: 100% !important;
}
div#contents.style-scope.ytd-rich-grid-renderer {
   display: block !important;
}
ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer {
   display: inline !important;
}
ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div {
   display: inline !important;
   margin: 0 !important;
}
ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div > ytd-rich-item-renderer {
   display: inline-block !important;
   width: 193px;
}
html[darker-dark-theme][dark],
[darker-dark-theme] [dark] {
   background: #181818 !important;
}
html[dark] {
   scrollbar-color: var(--yt-spec-text-secondary) #181818 !important;
}
html {
   font-family: Roboto, arial, sans-serif !important;
}
html:not(.style-scope) {
   --yt-post-redemption-section-title_-_font-family: roboto;
   --paper-font-common-base_-_font-family: roboto, arial, sans-serif !important;
   --paper-font-body1_-_font-size: 13px !important;
   --paper-font-body2_-_font-size: 13px !important;
   --paper-font-caption_-_font-size: 12px !important;
   --paper-font-menu_-_font-size: 13px !important;
   --paper-font-button_-_font-size: 13px !important;
   --ytd-thumbnail-attribution_-_font-size: 11px !important;
   --ytd-user-comment_-_font-size: 13px !important;
   --ytd-caption_-_font-size: 11px !important;
   --ytd-tab-system_-_font-size: 13px !important;
   --ytd-comment-link_-_font-size: 13px !important;
   --ytd-subheadline_-_font-size: 13px !important;
   --ytd-grid-video-title_-_font-size: 13px !important;
   --paper-font-body1_-_font-weight: 500 !important;
   --ytd-thumbnail-attribution_-_font-weight: 400 !important;
   --ytd-user-comment_-_font-weight: 400 !important;
   --ytd-subheadline_-_font-weight: 400 !important;
   --ytd-thumbnail-attribution_-_line-height: 1.4em !important;
   --ytd-user-comment_-_line-height: 1.3em !important;
   --ytd-comment-link_-_line-height: 1.3em !important;
   --ytd-subheadline_-_line-height: 1.3em !important;
   --paper-font-button_-_text-transform: none !important;
   --yt-endpoint-hover_-_text-decoration: underline !important;
   --ytd-grid-video-title_-_letter-spacing: 0 !important;
   --ytd-masthead-height: 49px !important;
   --ytd-toolbar-height: 49px !important;
   --logo-7kt-dark-header: url(https://7kt.se/images/7kttube_logo_header.png);
   --logo-7kt-light-header: url(https://7kt.se/images/7kttube_logo_header2.png);
   --logo-2015-dark-header: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAeCAMAAABJ7/MSAAAAaVBMVEUAAADbKBv////hKB/////////////hKCD////////eKBzfOCD////////jJh7////////jKST////////aRiH////////RKxz////aNCX/b2L/xL7/sKn/iH7/2tfwSjv/9/b/o5v/6eebHW/LAAAAF3RSTlMA+VbUhb4+sdFx7CD2rokqDmTjjj4anxy61LcAAAHISURBVEjHvZaJboMwDIZNuWnKsbbLT4BwvP9DzuZQUbuNaJv2SSUxKp+MDSR0yC3P49j3/SzzGD0jsyzjk3Gc5zdy4OzrQ/zzscbTDniHolg7ER+lox05U6JUSRQpdaVXKv4LVlq90gEvnooC4ETL8ZXc1ZNTAbwThVDlF+UZxxaw42i+88RECd6IFC70CUvT6yWZ7zw+UQoUEZASlVH0lFS28/R9L4d69tSGA80Dj0JGdGdHANzppADFVToBkRSMPd7O06CRmRGPAQaxTlvdPJIbuyRIKMJM4eLBAIxa23nSrZ4ACgjoClUUPNl79Beevp446iVqYDVDRMWSRoiE6A0XF4/WLUcGkGoNi0culpaFCIkSd4/dPNg8F+D6Q4+108OTAqefeYQ/8ZieOfZ4x/Wp61r6/muPRHvPU9/fZ0/25Ok3j0Ti6fU49z17eAIgTfknnoADPL2nLQZjV89ohiW71kzzc+g/PHcFRpXLc5nMnnjnGQE0q4d96EQtmOW7sXmoCIGwoPkOo6U++eKxli/q7dTxzGhjbd0OjZS3swOfYHISypI+p9KOVH/1nf+Xdcd9HfyvdVlM1bxP2G8UZMy2fUJ1I+YDE+J/OoVjUQ0AAAAASUVORK5CYII=);
   --logo-2015-light-header: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAeCAMAAABJ7/MSAAAAbFBMVEUAAADbKBs4MjLhKB8yNjQyMDA6OjrhKCA0NDM0NjTeKBzfOCA3NjY1MzPjJh4MDAwSEhLjKSRmZmY4NzcxMzLaRiEUFBTRKxz///8zMzPaNCX/b2L/xL7/sKn/iH7/2tfwSjv/9/b/o5v/6efD6vgAAAAAF3RSTlMA+VbUhb4+sdFx7CD2rokqDmQF45U+Gst17Z4AAAHZSURBVEjHvZaLkqowDIaDyEWsXFy1DQVa4P3f8SStjBxdl87uzv4z0sSx36R/sC1s6lqWWRbHcVFEJOnEUVHQl1lWllcI0DGWm4qP25hIBijaBGUySNlWOTJQR8iFqAFSIS7wqoZ+ou7qlzmDUi+cBvaIO/DPV5WhnBIqRKokQVG/sWeaeqXMNOm3HG9Qjh9wFniCT+Sb3vpivuLEAAfEKkU8ANRp+lRUseJYa/nROk6rKZE0+FEWADdikD032AlEQS7tEFM2jDjRitOpjiPNHK3UyNR58S0CXtgpxxxSdKoCOERRapLSuGDwHJoiEPdwQVFVFKw58g3HtjNllrNOGUkCgMqXkVBN8IGnEI6UPWW0OnZr9ByeTC0jTgKQh3PMwlEL54R4+SbHmHnhuM7vvsdh/QpHW9I2J9r2p21b7vuPOZytOU99vzhO8cSxC4cz5lg5ub4XDw5VcDjQhzl7SvDpf9qrUZs7Z9Kjr67Xs3sP4wfnJpAkav9e5o6TrTgTdaa7cwzFA6NZmveNBweqBDGpwK0w9f6UnmMMTbJmHijSUhvT9mPH9g5mNNrvY6RzXZ/BBTzw+NhXA9X81j7/J+dO+Dn4V+cykxq+J/x3UeCxWO4JzRVI/wDdeYEehJSX4AAAAABJRU5ErkJggg==);
   --logo-2017-dark-header: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAA8CAYAAAAjW/WRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDUgNzkuMTY0NTkwLCAyMDIwLzEyLzA5LTExOjU3OjQ0ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAyLTI4VDE1OjQzOjM2LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMi0yOFQxNTo0Nzo1My0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMi0yOFQxNTo0Nzo1My0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MWQyNmE1M2MtMmMxNC1kNzQyLTg3NmItNWJmZTJiMDA4YjMxIiB4bXBNTTpEb2N1bWVudElEPSJ4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);
   --logo-2017-light-header: url(https://www.youtube.com/yts/img/ringo/hitchhiker/logo_small_2x-vfl4_cFqn.png);
}
ytd-app #video-title[class*=renderer],
ytd-compact-video-renderer #video-title.ytd-compact-video-renderer,
ytd-two-column-search-results-renderer #channel-title .ytd-channel-name {
   font-size: 14px !important;
   line-height: 1.1 !important;
}
#author-text.yt-simple-endpoint.ytd-comment-renderer,
#content-text.ytd-backstage-post-renderer,
#content-text.ytd-comment-renderer,
#expander.ytd-comment-replies-renderer,
#video-title.ytd-rich-grid-video-renderer,
.title.ytd-guide-entry-renderer,
.title.ytd-mini-channel-renderer,
h3.ytd-rich-grid-media,
ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button-end.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,
ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,
ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer,
ytd-guide-entry-renderer[active],
ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media {
   font-size: 13px !important;
}
#video-title,
ytd-two-column-search-results-renderer #channel-title .ytd-channel-name {
   font-weight: 500 !important;
}
.badge.ytd-badge-supported-renderer {
   font-weight: normal !important;
}
ytd-guide-entry-renderer[active],
ytd-playlist-renderer {
   background: 0 0 !important;
}
.title.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer {
   line-height: 20px !important;
}
#author-text.yt-simple-endpoint.ytd-comment-renderer:hover,
#video-title:hover,
yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover {
   text-decoration: underline !important;
}
@media (min-width: 900px) {
   ytd-rich-grid-renderer {
      --ytd-rich-grid-items-per-row: 4 !important;
   }
}
@media (min-width: 1200px) {
   ytd-rich-grid-renderer {
      --ytd-rich-grid-items-per-row: 5 !important;
   }
}
@media (min-width: 1800px) {
   ytd-rich-grid-renderer {
      --ytd-rich-grid-items-per-row: 6 !important;
   }
}
@media (min-width: 2500px) {
   ytd-rich-grid-renderer {
      --ytd-rich-grid-items-per-row: 9 !important;
   }
}
@media (min-width: 900px) {
   ytd-two-column-browse-results-renderer {
      max-width: 850px !important;
   }
}
@media (min-width: 1150px) {
   ytd-two-column-browse-results-renderer {
      max-width: 1056px !important;
   }
}
@media (min-width: 1600px) {
   ytd-two-column-browse-results-renderer {
      max-width: 1262px !important;
   }
}
@media (min-width: 2500px) {
   ytd-two-column-browse-results-renderer {
      max-width: 2200px !important;
   }
}
@media (min-width: 900px) {
   html:not(.style-scope) {
      --ytd-grid-video-item_-_width: 196px !important;
      --ytd-grid-thumbnail_-_width: 196px !important;
      --ytd-grid-thumbnail_-_height: 110px !important;
      --ytd-thumbnail-height: 110px !important;
   }
}
@media (min-width: 2500px) {
   html:not(.style-scope) {
      --ytd-grid-video-item_-_width: 210px !important;
      --ytd-grid-thumbnail_-_width: 210px !important;
      --ytd-grid-thumbnail_-_height: 118px !important;
      --ytd-thumbnail-height: 118px !important;
   }
}
ytd-thumbnail.ytd-grid-video-renderer,
ytd-thumbnail.ytd-rich-grid-media,
ytd-thumbnail.ytd-rich-grid-video-renderer {
   margin-bottom: 3px !important;
}
ytd-rich-grid-media[mini-mode] h3.ytd-rich-grid-media {
   margin-bottom: 1px !important;
   padding-right: 16px !important;
   margin-top: 3px !important;
}
#meta.ytd-grid-video-renderer,
#meta.ytd-rich-grid-media,
#meta.ytd-rich-grid-video-renderer {
   padding-right: 0 !important;
}
h3.ytd-rich-grid-media {
   margin: 0;
}
ytd-rich-item-renderer {
   margin-bottom: 12px !important;
}
.ytd-browse.grid .ytd-two-column-browse-results-renderer {
   margin-top: 10px;
}
h3.ytd-grid-video-renderer,
h3.ytd-rich-grid-video-renderer {
   margin: 0 10px 0 0 !important;
}
ytd-section-list-renderer[page-subtype=subscriptions] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer {
   width: 196px;
   margin-right: 10px;
   margin-bottom: 12px;
}
ytd-section-list-renderer[page-subtype=subscriptions] ytd-thumbnail.ytd-grid-video-renderer {
   height: 110px;
   width: 196px;
}
ytd-section-list-renderer[page-subtype=channels] #items.ytd-grid-renderer,
ytd-section-list-renderer[page-subtype=subscriptions] #items.ytd-grid-renderer {
   margin-right: -15px !important;
}
ytd-browse[page-subtype=channels] app-header {
   transform: unset !important;
   position: static !important;
   margin-top: 0 !important;
}
#contentContainer.app-header-layout,
ytd-search-filter-renderer.ytd-search-filter-group-renderer {
   padding-top: 0 !important;
}
#chat.ytd-watch-flexy,
#donation-shelf.ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy,
#donation-shelf.ytd-watch-flexy ytd-donation-unavailable-renderer.ytd-watch-flexy,
#panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy,
#playlist.ytd-watch-flexy {
   margin-bottom: 10px !important;
}
ytd-playlist-panel-renderer[js-panel-height] #container.ytd-playlist-panel-renderer {
   margin-left: 10px !important;
   margin-right: -10px !important;
}
ytd-engagement-panel-section-list-renderer {
   right: 14px !important;
   border: 1px solid #e8e8e8;
   box-sizing: border-box;
   display: -ms-flexbox;
   display: -webkit-flex;
   display: flex;
   flex-direction: column;
   position: relative !important;
}
ytd-section-list-renderer {
   padding: 0 17px !important;
}
ytd-browse[page-subtype~=channels] ytd-two-column-browse-results-renderer.ytd-browse * > #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer {
   margin-right: 10px !important;
   margin-bottom: 20px !important;
}
#tabs-container.ytd-c4-tabbed-header-renderer,
#tabs-inner-container.ytd-c4-tabbed-header-renderer,
tp-yt-app-toolbar.ytd-c4-tabbed-header-renderer,
tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {
   height: 32px !important;
}
.tab-content.tp-yt-paper-tab {
   letter-spacing: 0 !important;
   padding: 0 3px 3px !important;
   height: 29px;
   color: #666;
   font-size: 13px;
   font-weight: normal;
   font-family: roboto;
}
#selectionBar.tp-yt-paper-tabs,
#sign-in-button yt-icon {
   display: none;
}
tp-yt-paper-tab.iron-selected.ytd-c4-tabbed-header-renderer .tab-content.tp-yt-paper-tab {
   color: var(--yt-lightsource-primary-title-color);
   font-weight: 500;
}
yt-icon-button.ytd-expandable-tab-renderer {
   opacity: 0.33 !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) 0 -738px;
   background-size: auto;
   width: 15px !important;
   height: 15px !important;
   color: transparent;
}
yt-icon-button.ytd-expandable-tab-renderer:hover {
   opacity: 1 !important;
}
.input-content.tp-yt-paper-input-container > iron-input,
.input-content.tp-yt-paper-input-container > label {
   height: 15px;
   padding-top: 5px;
   padding-bottom: 6px;
   margin-bottom: 3px;
}
paper-tab.ytd-c4-tabbed-header-renderer {
   padding: 0 12px !important;
}
paper-tabs.ytd-c4-tabbed-header-renderer {
   margin-left: 0 !important;
   padding-bottom: 0 !important;
}
#channel-header.ytd-c4-tabbed-header-renderer {
   background-color: var(--yt-lightsource-section1-color);
   width: 100% !important;
   padding: 18px 20px 10px !important;
   position: relative !important;
   z-index: 1;
   min-width: 0;
}
html:not([dark]) ytd-c4-tabbed-header-renderer {
   --yt-lightsource-section1-color: #fff !important;
}
html:not([dark]) app-toolbar.ytd-c4-tabbed-header-renderer {
   background-color: #fff !important;
}
html:not([dark]) paper-tab.iron-selected.ytd-c4-tabbed-header-renderer > .tab-content.paper-tab,
html:not([dark]) paper-tab:not(.iron-selected) > .tab-content.paper-tab:hover {
   box-shadow: inset 0 -3px red;
}
html:not([dark]) paper-tab:not(.iron-selected) > .tab-content.paper-tab {
   opacity: 0.8 !important;
   font-weight: normal !important;
}
html[dark] ytd-c4-tabbed-header-renderer {
   --yt-lightsource-section1-color: #212121 !important;
}
html[dark] app-toolbar.ytd-c4-tabbed-header-renderer {
   background-color: #212121 !important;
}
html[dark] paper-tabs.ytd-c4-tabbed-header-renderer {
   --paper-tabs-selection-bar-color: #cd1821 !important;
}
html[dark] paper-tab.iron-selected.ytd-c4-tabbed-header-renderer > .tab-content.paper-tab,
html[dark] paper-tab:not(.iron-selected) > .tab-content.paper-tab:hover {
   box-shadow: inset 0 -3px #cd1821 !important;
}
#metadata-container.ytd-channel-video-player-renderer,
#title.ytd-channel-video-player-renderer {
   margin-bottom: 3px !important;
}
#items.ytd-watch-next-secondary-results-renderer {
   padding: 12px 0 15px 15px !important;
}
ytd-comments {
   padding: 15px 10px 15px 15px !important;
}
ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy,
ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy {
   padding-top: 0 !important;
}
#category-buttons.yt-emoji-picker-renderer {
   margin-top: 20px !important;
}
#categories-wrapper.yt-emoji-picker-renderer {
   margin-top: 0px!important;
}
ytd-watch-flexy[fullscreen] #secondary.ytd-watch-flexy,
ytd-watch-flexy[theater] #secondary.ytd-watch-flexy {
   margin-top: 10px !important;
}
#meta ytd-expander.ytd-video-secondary-info-renderer {
   margin-left: 0;
}
#meta ytd-video-secondary-info-renderer {
   margin: 10px 0;
   padding: 1px 15px;
   min-height: 60px;
}
#info ytd-video-primary-info-renderer {
   padding: 15px;
   margin-top: 30px;
   --yt-button-icon-size: 30px;
   font-weight: normal;
   min-height: 20px;
}
#menu.ytd-video-primary-info-renderer {
   top: 12px !important;
}
#menu #return-youtube-dislike-bar-container,
#menu #ryd-bar-container {
   background: #ccc !important;
}
#like-bar.ytd-sentiment-bar-renderer,
#return-youtube-dislike-bar,
#ryd-bar {
   background: #1879c6 !important;
}
html:not([dark]) #guide-section-title.ytd-guide-section-renderer {
   color: red;
}
html:not([dark]) ytd-guide-entry-renderer[active] > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
html:not([dark]) ytd-guide-entry-renderer[active] > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
   background-color: var(--oldcolor);
}
html:not([dark]) #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
   background-color: #444;
}
html:not([dark]) .guide-icon.ytd-guide-entry-renderer {
   color: unset;
}
html:not([dark]) tp-yt-paper-item.ytd-guide-entry-renderer {
   color: #878787;
}
html:not([dark]) tp-yt-paper-item.ytd-guide-entry-renderer:hover,
html:not([dark]) ytd-app yt-formatted-string[has-link-only_]:not([force-default-style]).title.ytd-playlist-panel-renderer a.yt-simple-endpoint.yt-formatted-string {
   color: #fff;
}
app-drawer.ytd-app:not([persistent]).ytd-app,
ytd-guide-renderer.ytd-app {
   width: 230px !important;
}
#contentContainer.app-drawer,
#scrim,
iron-collapse {
   transition-duration: 0ms !important;
}
tp-yt-paper-item.ytd-guide-entry-renderer {
   height: 28px !important;
   padding: 0 9px !important;
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer > paper-item {
   min-height: 28px !important;
}
.guide-icon.ytd-guide-entry-renderer {
   --iron-icon-height: 20px !important;
   --iron-icon-width: 20px !important;
   margin-right: 6px !important;
}
#sections.ytd-guide-renderer > .ytd-guide-renderer {
   padding: 13px 22px !important;
}
#sections.style-scope.ytd-guide-renderer:first-child #items > ytd-guide-entry-renderer > a:not([href]) {
   display: none;
}
#guide #guide-spacer.ytd-app {
   margin-top: 50px;
}
#guide yt-img-shadow.ytd-guide-entry-renderer {
   margin-right: 6px;
}
#guide #guide-section-title.ytd-guide-section-renderer {
   padding: 1px 0 6px;
   margin: 0 5px;
   text-transform: uppercase;
   font-weight: normal;
   font-size: 11px;
   height: 10px;
}
#container.ytd-masthead {
   max-height: 49px;
}
html:not([dark]) #container.ytd-masthead {
   border-bottom: 1px solid #e8e8e8;
}
ytd-masthead[dark] #container.ytd-masthead {
   border-bottom: 1px solid #181818;
}
html[dark] #container.ytd-searchbox,
html[dark] #search-icon-legacy.ytd-searchbox {
   box-shadow: none !important;
   background-color: #1c1c1c !important;
   border: 1px solid rgba(110, 110, 110, 0.3) !important;
   border-radius: 0 !important;
}
#masthead #container.ytd-searchbox,
#masthead #search-icon-legacy.ytd-searchbox {
   border-radius: 0;
   border-color: #ccc;
}
ytd-searchbox[has-focus] #search-icon.ytd-searchbox {
   display: none !important;
}
.sbpqs_a::before,
.sbqs_c::before {
   content: none !important;
}
#masthead #search-form.ytd-searchbox {
   height: 29px;
}
ytd-searchbox[has-focus] #container.ytd-searchbox {
   padding: 2px 6px 2px 6px !important;
   margin: 0 !important;
}
#button.style-scope.ytd-searchbox {
   border-top-right-radius: 1px;
   border-bottom-right-radius: 1px;
}
ytd-searchbox.ytd-masthead {
   max-width: 650px;
}
#masthead [has-focus] #container.ytd-searchbox {
   border: 1px solid #1c62b9;
}
#masthead #search-icon-legacy.ytd-searchbox {
   background-color: #f8f8f8;
   height: 29px;
   width: 67px !important;
}
div.gstl_50 {
   min-width: 583px !important;
   margin-left: 0;
}
ytd-searchbox[has-focus] #container.ytd-searchbox {
   transition: border-color 0.2s ease;
}
#masthead #search-icon-legacy.ytd-searchbox:hover {
   background-color: #f0f0f0;
}
#search-icon-legacy.ytd-searchbox:hover yt-icon.ytd-searchbox {
   opacity: 1 !important;
}
#voice-search-button.ytd-masthead,
.ytd-masthead [href^="https://accounts.google.com/ServiceLogin?"] yt-icon {
   display: none !important;
}
#masthead-container.ytd-app {
   transition: none !important;
}
#sign-in-button tp-yt-paper-button,
.ytd-masthead [href^="https://accounts.google.com/ServiceLogin?"] tp-yt-paper-button {
   background: #167ac6 !important;
   max-height: 28px !important;
   height: auto!important;
   margin-top: 5px;
}
#sign-in-button:hover tp-yt-paper-button,
.ytd-masthead [href^="https://accounts.google.com/ServiceLogin?"]:hover tp-yt-paper-button {
   background: #126db3 !important;
}
#sign-in-button tp-yt-paper-button #text,
.ytd-masthead [href^="https://accounts.google.com/ServiceLogin?"] yt-formatted-string {
   color: #fff !important;
   font: 500 11px roboto !important;
   margin-left: 0!important;
}
html:not(.style-scope):not([dark]) {
   --yt-spec-brand-background-primary: #fff !important;
   --yt-spec-general-background-a: #f1f1f1 !important;
   --yt-lightsource-section1-color: #fff !important;
   --yt-spec-text-secondary: #767676 !important;
   --yt-spec-call-to-action: #167ac6 !important;
   --yt-spec-text-primary: #333 !important;
   --yt-button-color: #767676;
}
html[dark]:not(.style-scope) {
   --yt-spec-brand-background-primary: #212121 !important;
   --yt-spec-general-background-a: #181818 !important;
   --yt-lightsource-section1-color: #212121 !important;
   --yt-spec-text-secondary: #8f8f8f !important;
   --yt-spec-call-to-action: #1879c6 !important;
   --yt-button-color: #8f8f8f;
}
html:not([dark]) #header.ytd-c4-tabbed-header-renderer,
html:not([dark]) #info.ytd-watch-flexy,
html:not([dark]) #items.ytd-watch-next-secondary-results-renderer,
html:not([dark]) #meta.ytd-watch-flexy,
html:not([dark]) #primary.ytd-two-column-browse-results-renderer,
html:not([dark]) #ticket-shelf.ytd-watch-flexy,
html:not([dark]) ytd-browse-secondary-contents-renderer.ytd-two-column-browse-results-renderer,
html:not([dark]) ytd-comments,
html:not([dark]) ytd-two-column-search-results-renderer[center-results] #primary.ytd-two-column-search-results-renderer {
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
   background-color: #fff !important;
}
ytd-comments,
ytd-expander.ytd-video-secondary-info-renderer,
ytd-video-primary-info-renderer,
ytd-video-secondary-info-renderer {
   border: 0 !important;
}
html:not([dark]) #secondary #related #dismissible:hover #video-title,
html:not([dark]) #title.ytd-channel-video-player-renderer a,
html:not([dark]) #video-title,
html:not([dark]) #video-title:hover,
html:not([dark]) h3.ytd-rich-grid-media,
html:not([dark]) ytd-compact-video-renderer:hover #video-title,
ytd-two-column-search-results-renderer ytd-channel-name {
   color: #167ac6 !important;
}
html:not([dark]) #secondary #video-title,
html:not([dark]) #video-title.ytd-playlist-video-renderer {
   color: #333 !important;
}
#secondary #related #dismissible #video-title {
   text-decoration: none !important;
}
html:not([dark]) #video-title.ytd-child-video-renderer {
   color: #767676 !important;
   font: 11px roboto !important;
}
#list.ytd-playlist-renderer,
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer > ytd-button-renderer.ytd-browse-feed-actions-renderer,
yt-copy-link-renderer.yt-third-party-network-section-renderer {
   margin: 0;
}
#video-title.ytd-grid-video-renderer,
ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media {
   line-height: 1.3em !important;
}
html[dark] #header.ytd-c4-tabbed-header-renderer,
html[dark] #info.ytd-watch-flexy,
html[dark] #items.ytd-watch-next-secondary-results-renderer,
html[dark] #meta.ytd-watch-flexy,
html[dark] #primary.ytd-two-column-browse-results-renderer,
html[dark] ytd-browse-secondary-contents-renderer.ytd-two-column-browse-results-renderer,
html[dark] ytd-comments,
html[dark] ytd-two-column-search-results-renderer[center-results] #primary.ytd-two-column-search-results-renderer {
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
   background-color: #212121 !important;
}
html:not([dark]) ytd-guide-entry-renderer[active] .guide-icon.ytd-guide-entry-renderer,
html:not([dark]) ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer,
html[dark] #title.ytd-channel-video-player-renderer a,
html[dark] #video-title,
html[dark] #video-title:hover,
html[dark] h3.ytd-rich-grid-media,
html[dark] yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover,
html[dark] ytd-compact-video-renderer:hover #video-title,
html[dark] ytd-two-column-search-results-renderer ytd-channel-name {
   color: #fff !important;
}
#secondary h4 #video-title.ytd-playlist-panel-video-renderer {
   color: #cacaca !important;
}
ytd-app .metadata.ytd-compact-video-renderer {
   padding-right: 14px;
}
body[style="overflow: hidden;"] {
   overflow-y: auto !important;
}
#details.ytd-rich-grid-video-renderer {
   cursor: auto;
   pointer-events: none;
}
#details.ytd-rich-grid-video-renderer * > a,
#details.ytd-rich-grid-video-renderer * > button.yt-icon-button {
   cursor: pointer;
   pointer-events: initial;
}
tp-yt-paper-button.ytd-expander {
   margin: 0 0 -15px;
}
html:not([dark]) paper-button.keyboard-focus.ytd-subscribe-button-renderer,
html:not([dark]) ytd-button-renderer.style-destructive[is-paper-button] {
   border-color: transparent !important;
   box-shadow: none !important;
}
yt-formatted-string.ytd-subscribe-button-renderer {
   position: relative;
}
#background.paper-ripple,
#waves.paper-ripple,
.wave-container.paper-ripple,
.wave.paper-ripple {
   display: none !important;
   visibility: hidden;
}
ytd-rich-grid-media {
   --yt-button-compact-background-color: transparent;
}
#avatar.ytd-rich-grid-media {
   background-color: transparent;
}
#guide #header yt-icon,
#home-page-skeleton,
#masthead-skeleton-icons,
.ghost-card.ytd-ghost-grid-renderer,
.watch-skeleton #primary-info,
.watch-skeleton #related .video-details,
yt-icon-button[touch-feedback] yt-interaction.yt-icon-button,
yt-interaction.extended {
   display: none;
}
tp-yt-paper-tooltip {
   display: none!important;
}
#tooltip.tp-yt-paper-tooltip {
   opacity: 0.8 !important;
   background: #000 !important;
   padding: 4px !important;
   margin: 0 !important;
   border-radius: 0 !important;
}
body.lock-scrollbar {
   overflow: visible !important;
   overflow-y: visible !important;
   position: initial !important;
}
body:not(.style-scope)[standardized-themed-scrollbar]:not(.style-scope):not([no-y-overflow]):not(.style-scope)::-webkit-scrollbar-thumb,
ytd-app[standardized-themed-scrollbar] #guide-inner-content.ytd-app::-webkit-scrollbar-thumb {
   all: unset;
}
ytd-app[standardized-themed-scrollbar] #guide-inner-content.ytd-app::-webkit-scrollbar {
   width: 8px;
}
* {
   --ytd-tab-system_-_letter-spacing: 0 !important;
   --ytd-tab-system_-_text-transform: none;
   text-transform: none;
}
paper-toggle-button {
   left: 7px !important;
   visibility: hidden;
}
paper-toggle-button,
span.ytd-thumbnail-overlay-inline-unplayable-renderer {
   display: none !important;
}
.dropdown-content.paper-menu-button,
html:not([dark]) ytd-multi-page-menu-renderer {
   border: 1px solid #c5c5c5 !important;
   border-top: 1px solid #c5c5c5 !important;
   box-shadow: 0 0 15px rgba(0, 0, 0, 0.18) !important;
}
html:not([dark]) ytd-menu-popup-renderer {
   border: 1px solid #d3d3d3 !important;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
   border-radius: 0 !important;
}
ytd-radio-renderer.ytd-item-section-renderer ytd-thumbnail-overlay-side-panel-renderer,
ytd-search ytd-playlist-thumbnail #thumbnail.ytd-playlist-thumbnail ytd-thumbnail-overlay-side-panel-renderer {
   width: 70px !important;
}
ytd-search #channel-name.ytd-video-renderer {
   padding-left: 0;
}
.ytp-spinner-circle {
   left: -100%;
   right: 0;
   border-left-color: transparent;
   -webkit-animation: none !important;
   animation: none !important;
}
#spinnerContainer,
ytp-spinner-left,
ytp-spinner-right {
   transform: rotate(0deg) !important;
   -webkit-animation: none !important;
   animation: none !important;
}
.ytp-spinner-rotator {
   width: 50%;
   height: 50%;
   -webkit-animation: none !important;
   animation: none !important;
}
.ytp-spinner-container,
.ytp-spinner-rotator {
   animation: none !important;
   content: url('data:image/png;base64,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');
}
ytd-button-renderer.style-suggestive[is-paper-button] paper-button.ytd-button-renderer {
   height: 24px;
   font-size: 12px;
   outline: 1px solid transparent;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
}
ytd-button-renderer.style-primary[is-paper-button]:hover {
   border-color: #333;
}
ytd-button-renderer.style-primary[is-paper-button]:active {
   box-shadow: inset 0 1px 0 rgb(0 0 0/50%);
}
ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer {
   background-image: linear-gradient(#1c1c1c, #1c1c1c);
   height: 24px;
   outline: 1px solid transparent;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   text-transform: none !important;
   color: var(--yt-spec-text-secondary) !important;
   white-space: nowrap !important;
   font-size: 12px !important;
   font-weight: normal !important;
   letter-spacing: normal !important;
   border: 1px solid #333 !important;
}
html:not([dark]) ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer {
   background-image: linear-gradient(to top, #f6f6f6 0, #fcfcfc 100%);
   border-color: #d3d3d3 !important;
   height: 24px;
   font-size: 12px !important;
   outline: 1px solid transparent;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   text-transform: none !important;
   color: var(--yt-spec-text-secondary) !important;
}
#guide-button.ytd-masthead {
   margin-right: 5px;
}
#guide-button.ytd-app,
#guide-icon.ytd-masthead {
   fill: transparent;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflEoWid_.png) -18px -202px;
}
#guide-button.ytd-app:hover,
#guide-icon.ytd-masthead:hover {
   background-position: -36px -370px;
}
#guide-button.ytd-app {
   padding: 0 !important;
   height: 23px !important;
   width: 22px !important;
   margin-left: 8px !important;
   margin-right: 8px !important;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer .guide-icon.ytd-guide-entry-renderer {
   width: 20px;
   height: 20px;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACRQTFRFAAAAhoaGZmZmhoaGh4eHmYh3iYmJiIiIlpaPh4eHbXdth4eH6O0+XAAAAAx0Uk5TAJQFp/8Ptcwi3S/pAvLsZQAAAEJJREFUeJxjYCAGMArAWEwmzgpQZpiLSxKExVri4uIeAGZ2ugDBDBCLawuI6b0AyOR0AYMJIGEWFwYGFwcGCphEAwAS9g9mWUXrfQAAAABJRU5ErkJggg==);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACpQTFRFAAAA////ZmZm/f39/////f397u7u////////////////////////////f1ju7gAAAA50Uk5TAJAFqf+eD7QYxyTYMuQQcbMsAAAAQklEQVR4nGNgIAYwCsBYTCauClBmuotLGYTFMcXFxbMBzFztAgQ7QCyeKyCm7wEgk9cFDDaAhFlcGBhcHBgoYBINALEuEIz8W58TAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/trending"] yt-icon,
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/explore"] yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -674px 0;
   fill: none;
   color: transparent;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[active][href="/feed/trending"] yt-icon,
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/trending"]:hover yt-icon,
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/explore"]:hover yt-icon,
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[active][href="/feed/explore"] yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -531px -233px;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/subscriptions"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACpQTFRFAAAAgIOAiIiIp4BsnZ2dh4eHh4eHh4eHh4eHhoaGiIiIVVVVi4uLhoaGnxQEiwAAAA50Uk5TAE7/GidkoOyx0j4GfYeKF/N5AAAASklEQVR4nGNgIAIIKSkpCUCYhoKCggZgFksoEISAmWzlQFCGrqtzJgg0gJhKYKAAYaoVwZlae4rgTFu4qAZCLVxbEZhZQIxr4QAA2kYRqrDO3BAAAAAASUVORK5CYII=);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/subscriptions"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/subscriptions"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAH5JREFUeJxjYBgFMPD//3+/v3///scD/Eg1UAWkCQ9WIcUwIyDOJAIbEWUg0KvzgIqfEMIgdSR5myoAaPMWID5LAt5CyECSAckGQsP0HdUMBAKjd+/e8QPpRmwGk2UgEEsA8QQg/kYNA7dgM4gSA/ECQgY+IdG8J3gNHAUkAwDMuiTgroDKPQAAAABJRU5ErkJggg==);
}
#guide-section-title.ytd-guide-section-renderer,
#guide #header .title {
   font-size: 11px !important;
   text-transform: uppercase;
   font-weight: var(--ytd-tab-system_-_font-weight) !important;
   letter-spacing: var(--ytd-tab-system_-_letter-spacing) !important;
}
#guide #header:hover .title {
   text-shadow: none !important;
}
#guide #header .title:hover {
   text-decoration: underline;
}
html:not([dark]) #guide #header .title {
   color: var(--oldcolor);
}
html[dark] #guide #header .title {
   color: #8f8f8f !important;
}
#guide #header #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer {
   background: 0 0 !important;
   min-height: 0 !important;
   height: 12px !important;
   padding-bottom: 6px;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/history"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKhJREFUeJxjYBgFINDe3v6fGEy0gW1tbcuBGl7iMewlSA1Jruzs7Nza0dFxBl0cJAaSI8kwEGhoaKgDuuLLzI5yfpgYiA0SA8mRbOC0af1KIK+BXANigzCIDRIDsUk2EMnQu0hhd5dsw2CgtbXRGWYgiE2RYdhcmFueq0+JYRhJBxQpZHkbFJO40iFZsQyNUawGkpwOQYEPSsC4DATJkRRBVM/Lo4AkAACcGemuiDZzGgAAAABJRU5ErkJggg==);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/history"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/history"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJlJREFUeJxjYBgFIPCfSEC0gX///l0JVP8Oj1nvQGpIdeUWID6ORfw4SI4kw6AaG4H427t37/hhYiA21OWN5BgoAcRPoC5VgeItUDEJkg2EGgoy5AZS2IHYKmQZhmSoH5KBfpQapgL1IgyA2EbkGiaBZhg8yZAVhtBYxgXIiuV9eAwkLR1CI+IsHgNvkBRBeAxCAaT6ehQQBwBPdHJ7egtCiAAAAABJRU5ErkJggg==);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href*="https://studio.youtube.com/channel"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAOFJREFUeJztlL0Ng0AMhWlSZ5QMkU0o6KjpIlLAHSNkgkyQLbICA6RPT/hEAk8WxwWJKoolS5Z/3vnZhiT5y0cuvtiXZXny3t/run6i2PiIrQKrqvPROdf22gW0JWcN2FhMV3mRH1BsjUVBoaKd9TQ7pYeNTztdpM98tAPmZnPwaQ41QUBLaaDl0mkcLrVxaoKA9nUtmnssxCIG2DZNc0PnNr8IqF0AwGZtDr43eJyyLOWRZdkulEeMnOhS9Gx0GVZkOctnMyRPh93P5wpFOkKx8X192AZ0m09P6W/2c/hteQFIL1T2NRIk0wAAAABJRU5ErkJggg==);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href*="https://studio.youtube.com/channel"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href*="https://studio.youtube.com/channel"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAMhJREFUeJztVDEKwzAMzNK5a96RF/g1Bj/Dz+neOT/wngdk9ujNqFKREyNsBUOm0oODkJNPkqVkmv4oiDE+AcAjAzIx6dmTNmSGhwxyhz5IMyNmNVbkwlyFpptym7KyuUo2y0rV9vnOaqRGTBIxXjMMjftyle4aetAMZfbjUCdZs4srww35Zm6jhnUV3+k2YuS01ZbLUHZr7aMXRxqc29Afilgb14uDczj62nDwsdg55xe1SBVxVQu/KzCqmTC959MruPXn8Nv4ADy6IMvnpMUsAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/playlist?list=WL"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKRJREFUeJxjYBgFyCC3PFe/ra1teXt7+0sg/QVKLweJk2RQWloaa0NDQx3QgP+4MEgepI4oAwkZhmwoUd7EphnkGmziBL0PDTMMjTM7yvmxiYPU4zUQFPCkGAhST8iFX3AZ2NnZuRWLC7+Q5UKQ16ZN61dqbW10RjOYoAuxhiHMNa2t7UnIEUcwDHHFMnq4ER3LIEDVdAgCVM8pyN6nSl4eBSQBALbqYVP/7ExDAAAAAElFTkSuQmCC) !important;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/playlist?list=WL"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/playlist?list=WL"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJtJREFUeJxjYBgFyOD///9Gf//+XQmknwDxNxAN5RuRY1gjUPN/bAAq3kiSYVhNwgSEDYV6E0NnWloaKw6X4vc+NIwwwLt37/hxeH8lIRc+weE9CRziTwgZ+A2PC7dgkfpGlguhQQFypQMQ7yPahbjCEOZQIM4EYiNkiwi5EGssYzGYuFiGGkq9dAgC0DRHvZyC5n3q5OVRQDQAAOojKqlWPB/dAAAAAElFTkSuQmCC)!important;
}
#filter-menu #button.ytd-toggle-button-renderer yt-icon,
div#footer.style-scope.ytd-guide-renderer,
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ"],
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/channel/UCtFRv9O2AHqOZjjynzrv-xg"],
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/clips"],
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/premium"],
yt-img-shadow.ytd-video-renderer {
   display: none;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/playlist?list=LL"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKdJREFUeJxjYBgFhMDMjnL+9vb2/62tjc5UMbCtrW0KyMCGhoY6il0GNGw5yDCKDWxtbU8CGvISZhjQ4C+55bn6JBuUlpbGiuwqmGFEG4CsEcTv7OzciiyGhF+C5EDexutSdANxGPafaBeTaeByqhoIijCqGQjyLig5UdNA3N4lx0CC2Q/dQJCXcBnW0dFxBq9huAAojEAuAQU+KB+DDAJZhDcyRhYAAEDcPbd3sUY9AAAAAElFTkSuQmCC) !important;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/playlist?list=LL"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/playlist?list=LL"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJFJREFUeJxjYBgFhMD///8l/kOAA7UMnAA1sJFil/39+3flfwQopcSwWCB+h2TYNyA2Itmgd+/e8QNdNe8/KvhGikvgAMrf8h87eAKVK8XrUiwGEgPeUdVAUERR24Wx1DTwGyjiqGYgKAXgNIxMFzqQauA3PIadxWsYLgAKI5BLgDjzPyQfH/8PyTV+ZBk4/AAAwhz1B8fVSG8AAAAASUVORK5CYII=)!important;
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href*="/playlist?list="] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEdJREFUeJxjYBgFVAXt7e3/ycH0M3Dwg9EwxAtaW9uTCCoixYsguqOj40xuea4+1QwE4pdEuZQY0NbWNmVmRzk/VQwbBbQFALwR1y4cnM8yAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href*="/playlist?list="]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href*="/playlist?list="] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAD1JREFUeJxjYBgFVAX/yQT0M3Dwg9EwxAuADsskRhHRXoQyzwKxETUNfEeUS4kBf//+nQc0TIIqho0C2gIAaBNPMh5knQEAAAAASUVORK5CYII=);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/guide_builder"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAIZJREFUeJxjYBgFMDCzo5y/oaGhrqOj40xbW9sXEAaxQWIgOZIMa21tdG5vb78LxP9x4LsgNaQYhssgFEzQUJBXCLgMw6V4vQ8KH2waYfLY5EB6cBoICnRSDQTpwWkgKCaxGYQOkNWA9NDPQKp7meqRQvVkAwJUTdhohlIn6yF7n2qFw/AGAJRscqhLuHgXAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/guide_builder"]:hover .guide-icon.ytd-guide-entry-renderer,
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/guide_builder"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAHdJREFUeJxjYBgFMPDu3Tv+////NwLxWSD+BsUgdiNIjiTDgJocgPjJf9wAJOdAimHEAvyGQr2Jz2UYLsXrfWiYYQAkeWygEZ+BZ8kw8Cw+A79hMwiLOmTwja4GUt3L1I0UqicbqCuol7DRDKVO1kPzPnUKh+ENAC1USA8dMiWwAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/storefront?bp=ogUCKAI%3D"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACjklEQVQ4EeWTzUuqQRSH370lhX0ohRJiZFDrvtXKiv5FFy0UAgtatojACIJoVRZlpShUVkbrovIXz4EZ7t3f3X1h3vk655nfOWcmyGazWlxc1OrqqjKZjLXl5WU/X1hY0MrKipaWlvwaPrlcztbcGB9sAiA4sOAW5+bmbBMDB8eROfaMOYg95qyzRguAodBtoHR+fl6bm5t/OaAIO+ydDb2D4o9N4FSwAGhjY8M2GKMCJ052QDd2gHw+b1C3bgpxXl9fN6dkMqnx8XGNjY1peHhYvb29CoVC6unpUX9/vyKRiEZGRswmlUr50D2Qk5gAnZqa0sHBgY6OjnRycqLLy0vd3d3p9vZWNzc3Nr64uNDZ2ZnZVSoVpdNpn1cfsisKCnDc3d3Vw8OD+LrdrvXu9/X1pefnZ+3t7Ql4LBazogBDnFWZxJKv0dFRXV9fa2trSy8vLx728/NjPNd3Oh0VCgU1Gg1LATAYFC0gXBRCHxgYsDBR12q1nCh9f3/7MYNms6nHx0dVq1UNDQ1ZygDCMoVUmhaNRi1fxWJRb29vHkLYhEpPe39/V6lU0v39vQYHB/09tByibG1tzSQD5NRyuWwKgfz5oZS1p6cn7ezs6Pz83BTCoBmQuMkfrwMglaWqr6+vxvr4+JDLnYNTlFqtpnq9bkDC9UXh4jKhpyicisJ2u63Pz0/H8D0qyTE2RMO9JHdAURlw/4ChlHxcXV1pe3vbwnIUlz/mqKXKALkRFAVfRFnIbjAzM6Pp6Wnt7+/r+PhYp6endicJH0cuOHeUA9njARweHmpyctKUUVSEBfxmZ2dtApxnx5NKJBLq6+uz58bTYxwOh20ej8fNbmJiwsKF4d693UNy8K/afwj8BRpqisFAXhQnAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/gaming"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACi0lEQVQ4EeWUu0qrURCFdxOECFbpbFLYKCIYjMb7JXc7X0SQ+AJ2thLiAwT0GVJapEinICpeg4pGEJGAKEnUdfgGJnD6050fJntm7zVr1uxLQjqd1srKihYXF7W0tKTV1VWLM5lM319eXtba2poYwS0sLKhQKGh+ft7myPG8ACELAPBJnJmZEYRzc3MWUxAMSfl83kZIwSKCQhh+AAiIAAIUZLNZA0BKIoVYx5wYbC6XM3JXyBioghFQBXKA3hokrLt6cBSEGDwxHWDgAgkE3jqKvEVP8GRU+TrqwYGhOIYfUAOISl5tcnJS4+PjpnZkZMTmKTg1NWXYRCKh6enp/h57HuJMIZVpg4UQgsrlsj4+PsR3eHioaDRq83t7e3p5edHZ2Zl2d3c1ODjY31MKotgIfc+GhobUbDaNiJ+fnx/z397edHx8rIeHB93d3enx8dGIj46ONDY2plQqZWKsZXqH3YIQ9Pn5aST1el0HBwfqdrsWX11d6fb2Vs/Pz9re3jaV19fXisVidhjsqbXsJ4zcgYEBfX19Wbv7+/va2dkxJTCirNFoaGtrSycnJxafnp4aIaLYLhMFqxv79/39rV6vp3a7rdfXV1PHz83Nje7v721EaavV0sXFheLxuJ0wHP2WeSVI5vSKxaIBIeb7/f01oz0M4qenJ9VqNW1sbCiZTPa3zFpGKpK5a640EomoVCrp/f3dSDudjrVI2+fn59rc3NTw8LBdHfL9ZRkhewfh+vr6Xy9gdnbWrkq1WjXSy8tLVSoVm0MV7UFEPtZvmQp+aR2EWp4gBzY6OmpKSJqYmLCLzTWDACHk4DtxgNADKvqfAQqZZ92r40OAAPcpyhwj+OBk/2r8Dwn/AGeOOZSHuaPrAAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/channel/UC4R8DWoMoI7CAwX8_LjQHig"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACjklEQVQ4Ec2TP0v6URTGv1FzBArRZKg55JBCkGVmf63wBSSNhUtrUFME+hYk2poNtD1oDbLWliCwoT9DayiCPj8+B470Ahp+wvXcc+45z/Pcc+43WF5eVqFQUC6X08LCgnZ2dmy/urqqra0tbWxsaGVlxWw+n7dYNpsV56y1tTWznLEC/ihaX183YPaQ4C8tLRk4RcTIJba9vW3n5DigEwSbm5taXFy0BFSyJ+YEqEM1BdyEM24C8W+lQ0CYYQSM4t3dXbMkoAhgcnwBAii5tIQcB8MGSOYankSQYnySASAHlYB7T4lxjvVlgBSycSWwsvcCfAgzmYypIo46SB2IfK8JXAEB2OPxuGZmZkyZJ9JXJ6A1xFOplObn561Vv5UOpwxrOp1WvV7Xw8ODRkdHrSAUCmlvb0/7+/sKh8NGFASBms2marWaKUeUgwYAufTx8XG1223d3t7q6+tLZ2dnenx81M/Pj/i1Wi2Vy2Wzl5eXRhyJRIbXBTTwhwwLzL1eT9VqVf1+XycnJ+p0OgaGheTw8FDf3986PT3V8/OzpqamhjMwQBpO73BGRkbU7XZ1fn4+BBwMBnp/f9fLy4s+Pz91cHCgt7c3HR8fW2xyctKG5NMP2DBJpjYxMWHFd3d3en19VaVS0fX1tbXh4+NDjUZDR0dHenp60tXVle7v7xWNRg2QQZlC/zJ4Oslk0hIZytjYmA0gkUioVCrZUGKxmE2V1tzc3Oji4sIGBxD19g5B5i2isFgsam5uTtPT08YGGb1lcFgKyOPLmp2dtc+UmD8pA8ThbcFCMtcnRisgw2fPGZYzwPmu6T85xFh2ZXdAZ/nD9c8Rn5zfSvD9uWE5g8wAHeivbPBXQI7z/wP+A87yAxA1rz19AAAAAElFTkSuQmCC);
}
tp-yt-app-drawer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw"] .guide-icon.ytd-guide-entry-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAC7klEQVQ4EW2TSyu9URTGdzIxdjcgddCh3Mv97hCKiW8gAxPfwQBlxBGDMyA+gomRDJTRGVA6yl0MFAZSDFyef79V63T8eWu391rvXs/+rWe/b+jq6lJvb6/6+vrU3d0tYtY9PT2W5x154oGBAcsxs6e/vz+9h32MMDg4mBaKxWK2yTczMxCkmJmitrY2W3vsYibY2dlpJztpe3u7hoaG1NLSYlQIcmhra2uaCtrh4eEfXbhogIoihBEdHR21mDUEZWVlamhosAPKy8uNjr0IZNqSFqQQUShIEtNSdna2ZmdndXJyopWVFW1sbCiVSml6elo5OTkm9mfLnEJ7ULLGq8rKSh0eHopncXFRVVVVKioq0tzcnOWSyaSgBcTJfA74hZAPPCwoKLDCz89PzczMqKmpyQqnpqYs//39bZ7+Seh+QMiorq62dj8+Pqx4Z2dHWVlZCiGIteexpba29jchZP7pNDY2an19XRDwfH192fz8/CwGz/v7uy4vL3V+fq6lpSXV1dXZjeM9cIHeOzo6rGUo3t7eRKs8CLs48dXVla6vr3V3d2eiZ2dnKi0tNUq3LPDVcxHMCL68vOj09FSRSESrq6t6fX3V4+Oj3TBUXAyt7u7uWq6wsNDI/K8JGOuE+fn5ur+/N+Hm5mYVFxdrbW1Nt7e3RsUBFRUVdiEcfnBwYDEaaUH880+GvwEP+URGRkZUUlKieDxuxA8PD1peXrZ37K+pqdH8/Hz6D8I62g7eu5sKwfb2tgli+sXFhRHiH54tLCxofHxcW1tbikajBoMYlCaId9wORLRJPDExoePjY93c3Jj53KqPp6cnHR0d2X4EvLsfhCT9F2TNx52bm6vNzU3t7+9rbGxMk5OT2tvbUyKRUF5entG4CDMgUAY3k9N44TEXxS+JV3jLIfX19TY43AWoyRzBkVHnBbHnsAJhYg4iRvj/Vn8JkmCTU7po5owgVN4BNZlrFzVCL/Qks1NxCC3Sged475SZNaz/AavpPaIP/0kIAAAAAElFTkSuQmCC);
}
#secondary #byline-container #text.ytd-channel-name,
ytd-app ytd-video-meta-block:not([rich-meta]) #metadata-line.ytd-video-meta-block,
ytd-video-meta-block.ytd-rich-grid-media #metadata-line.ytd-video-meta-block span.ytd-video-meta-block,
ytd-video-meta-block.ytd-rich-grid-media yt-formatted-string[ellipsis-truncate] a.yt-formatted-string {
   line-height: 1.3em;
   font-size: 11px !important;
}
#video-title.ytd-rich-grid-media {
   line-height: 1.3em;
}
.style-scope.ytd-guide-entry-renderer::before {
   content: none;
}
#guide-section-title.ytd-guide-section-renderer {
   font-size: 11px;
   letter-spacing: 0.2px;
}
#sections.ytd-guide-renderer > .ytd-guide-renderer:last-child,
[collapsed] ytd-metadata-row-container-renderer,
ytd-expander.ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer ytd-metadata-row-header-renderer[has-divider-line],
ytd-expander.ytd-video-secondary-info-renderer ytd-metadata-row-renderer:last-child {
   display: none;
}
ytd-guide-section-renderer.ytd-guide-renderer:nth-of-type(3) {
   border-bottom: 0 !important;
}
ytd-guide-section-renderer.ytd-guide-renderer:nth-of-type(3) #guide-section-title.ytd-guide-section-renderer {
   height: 13px;
}
tp-yt-paper-item.ytd-guide-entry-renderer:hover .title.ytd-guide-entry-renderer,
ytd-search-filter-renderer yt-formatted-string.ytd-search-filter-renderer:hover {
   color: #fff !important;
}
yt-icon.yt-player-error-message-renderer {
   --iron-icon-fill-color: #ffe0;
   flex: var(--layout-flex-none_-_flex);
   height: 100px;
   width: 150px;
   background-size: 140px, 50px;
   background-repeat: no-repeat;
   background-image: url(https://s.ytimg.com/yts/img/meh7-vflGevej7.png);
   fill: transparent;
}
#reason.yt-player-error-message-renderer::after,
div#reason.style-scope.yt-player-error-message-renderer {
   font-size: 25px;
   text-shadow: 1px 1px 3px #7b7b7b;
}
yt-playability-error-supported-renderers {
   display: block;
   background: linear-gradient(#383838, #141518) !important;
   flex: var(--layout-flex_-_flex) !important;
   flex-basis: var(--layout-flex_-_flex-basis) !important;
   flex-direction: var(--layout-vertical_-_flex-direction) !important;
}
ytd-search-filter-renderer.selected #dismiss-x.ytd-search-filter-renderer {
   padding-bottom: 5px !important;
}
html:not([dark]) #metadata-line.ytd-video-meta-block span.ytd-video-meta-block,
html:not([dark]) ytd-search-filter-renderer yt-formatted-string.ytd-search-filter-renderer {
   color: #555 !important;
}
ytd-search-filter-renderer yt-formatted-string.ytd-search-filter-renderer {
   font-size: 11px !important;
   height: 21px !important;
   font-weight: normal !important;
   width: auto;
}
#filter-group-name.ytd-search-filter-group-renderer {
   color: #555 !important;
   padding: 0 !important;
   border-bottom: none !important;
   font-size: 11px !important;
   font-weight: 500 !important;
}
ytd-toggle-button-renderer:not(.ytd-segmented-like-dislike-button-renderer) #button yt-icon + yt-formatted-string {
   border: 1px solid #3c3c3c;
   background: 0 0 !important;
   color: var(--yt-button-color, inherit);
   padding: 0 10px;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
   padding-top: 2px !important;
   padding-bottom: 3px;
   font-size: 11px !important;
   margin-left: 0 !important;
}
html:not([dark]) ytd-toggle-button-renderer:not(.ytd-segmented-like-dislike-button-renderer) #button yt-icon + yt-formatted-string {
   border: 1px solid #d3d3d3 !important;
   background: #f8f8f8 !important;
   color: #333;
   padding: 0 10px;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
   padding-top: 2px !important;
   padding-bottom: 3px;
   font-size: 11px !important;
   margin-left: 0 !important;
   font-weight: normal !important;
}
ytd-toggle-button-renderer:not(.ytd-segmented-like-dislike-button-renderer) #button yt-icon + yt-formatted-string::after {
   content: "";
   margin-left: 5px;
   border: 1px solid transparent;
   border-top-color: #333;
   border-width: 4px 4px 0;
   top: 9px;
   width: 0;
   height: 0;
   position: relative;
}
ytd-toggle-button-renderer:not(.ytd-segmented-like-dislike-button-renderer) #button yt-icon + yt-formatted-string:hover {
   border-color: #333;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
html:not([dark]) ytd-toggle-button-renderer:not(.ytd-segmented-like-dislike-button-renderer) #button yt-icon + yt-formatted-string:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
ytd-search-filter-group-renderer {
   all: unset !important;
   padding: 0 32px 0 0 !important;
}
#filter-menu.ytd-search-sub-menu-renderer,
ytd-backstage-post-thread-renderer,
ytd-item-section-renderer {
   border: 0 !important;
}
#country-code.ytd-topbar-logo-renderer,
ytd-topbar-logo-renderer[is-logo-updated] #country-code.ytd-topbar-logo-renderer {
   margin: 0 0 0 2px;
}
ytd-video-renderer[use-prominent-thumbs] #channel-info.ytd-video-renderer {
   padding: 5px 0;
}
ytd-horizontal-card-list-renderer.ytd-item-section-renderer:first-child {
   display: none;
}
#metadata-line.ytd-video-meta-block {
   position: relative;
}
#description-text.ytd-video-renderer {
   position: relative;
   bottom: 0;
}
#all.ytd-vertical-list-renderer,
#more.ytd-vertical-list-renderer {
   padding-top: 5px;
}
ytd-vertical-list-renderer {
   padding-bottom: 8px;
}
ytd-thumbnail-overlay-playback-status-renderer {
   top: 0;
}
ytd-thumbnail-overlay-toggle-button-renderer {
   opacity: 0.9;
   box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
   position: absolute !important;
   margin: 8px 8px !important;
   border-radius: 1px !important;
   border-color: #d3d3d3 !important;
   background: #f8f8f8 !important;
   color: #333 !important;
   width: 22px !important;
   height: 22px !important;
   transition: none !important;
   top: 0px;
   right: 0px;
}
ytd-thumbnail-overlay-toggle-button-renderer:hover {
   opacity: 1;
}
.ytd-thumbnail[top-right-overlay] ~ .ytd-thumbnail[top-right-overlay] {
   top: 32px !important;
}
ytd-thumbnail-overlay-toggle-button-renderer:hover {
   border-color: #d3d3d3 !important;
   background: #f0f0f0 !important;
}
ytd-thumbnail-overlay-toggle-button-renderer yt-icon:hover {
   color: #606060 !important;
}
ytd-thumbnail-overlay-toggle-button-renderer yt-icon:active {
   color: #000 !important;
}
ytd-app ytd-thumbnail-overlay-time-status-renderer {
   margin: 4px 2px;
   padding: 3px 4px !important;
   font-size: 11px !important;
   background-color: #000;
   height: 12px !important;
   line-height: 12px !important;
   opacity: 0.75;
   border-radius: 0;
   letter-spacing: 0 !important;
}
ytd-menu-popup-renderer tp-yt-paper-listbox tp-yt-paper-item yt-icon {
   display: inline-block !important;
}
ytd-menu-popup-renderer tp-yt-paper-listbox tp-yt-paper-item {
   min-height: 28px;
}
tp-yt-paper-item.ytd-menu-service-item-renderer {
   --paper-item-min-height: 24px !important;
   padding: 0 36px 0 16px !important;
}
tp-yt-paper-item.ytd-menu-service-item-renderer:hover {
   background: #444 !important;
}
tp-yt-paper-item.ytd-menu-service-item-renderer:hover yt-formatted-string {
   color: #fff;
   opacity: 1 !important;
}
html[dark] #info ytd-toggle-button-renderer.style-default-active a #text,
html[dark] #info ytd-toggle-button-renderer.style-text[is-icon-button] #text.ytd-toggle-button-renderer,
tp-yt-paper-item.ytd-menu-service-item-renderer:hover yt-icon {
   color: #fff;
}
tp-yt-paper-item.ytd-menu-service-item-renderer yt-icon {
   margin-right: 8px;
}
html[dark] #masthead-container #search-icon-legacy.ytd-searchbox yt-icon.ytd-searchbox,
html[dark] #play-button ytd-button-renderer yt-formatted-string.ytd-button-renderer,
html[dark] yt-icon-button.ytd-expandable-tab-renderer,
html[dark] yt-icon.ytd-menu-renderer,
html[dark] ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer,
html[dark] ytd-button-renderer.style-visibly-disabled[is-icon-button] #text.ytd-button-renderer,
html[dark] ytd-button-renderer[is-paper-button] yt-icon.ytd-button-renderer,
html[dark] ytd-notification-topbar-button-shape-renderer #button yt-icon {
   filter: invert(1);
}
yt-icon.ytd-menu-renderer {
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAANCAYAAABsItTPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAcSURBVBhXY2RgYPgPxGDABKXBAIWDG9DHAAYGADC6Aw1aLZAXAAAAAElFTkSuQmCC) no-repeat center center;
   opacity: 0.5;
}
yt-icon.ytd-menu-renderer:hover {
   opacity: 0.75;
}
yt-icon.ytd-menu-renderer:active {
   opacity: 1;
}
yt-icon.ytd-menu-renderer svg {
   fill: transparent;
}
yt-icon-button.dropdown-trigger {
   height: 16px !important;
}
ytd-rich-grid-media:not([three-dot-rework]) ytd-menu-renderer.ytd-rich-grid-media {
   margin-top: 5px;
}
ytd-menu-renderer.ytd-video-primary-info-renderer {
   padding-bottom: 6px;
}
#label.ytd-pinned-comment-badge-renderer {
   color: #fff !important;
}
html:not([dark]) #label.ytd-pinned-comment-badge-renderer {
   color: var(--yt-spec-text-secondary) !important;
}
html:not([dark]) ytd-pinned-comment-badge-renderer {
   padding-right: 6px !important;
   padding-left: 2px !important;
   padding-top: 2px !important;
   background: 0 0;
}
ytd-pinned-comment-badge-renderer {
   padding-right: 6px !important;
   padding-left: 2px !important;
   padding-top: 2px !important;
}
ytd-author-comment-badge-renderer[creator] {
   background-color: #3f4c57;
   border-radius: 0;
   padding-right: 6px !important;
   padding-left: 6px !important;
}
html:not([dark]) ytd-author-comment-badge-renderer[creator] {
   background-color: #dbe4eb;
   border-radius: 0;
   padding-right: 6px !important;
   padding-left: 6px !important;
}
ytd-comments-header-renderer {
   padding-bottom: 20px;
   border-bottom: 1px solid #5a5a5a;
}
html:not([dark]) ytd-comments-header-renderer {
   padding-bottom: 20px;
   border-bottom: 1px solid #e2e2e2;
}
ytd-comments-header-renderer .count-text.ytd-comments-header-renderer {
   display: flex;
   font-size: 13px;
   letter-spacing: 0;
   text-transform: uppercase !important;
}
html:not([dark]) ytd-comments-header-renderer .count-text.ytd-comments-header-renderer {
   display: flex;
   font-size: 13px;
   color: #555;
   letter-spacing: 0;
   text-transform: uppercase !important;
}
ytd-comments-header-renderer .count-text.ytd-comments-header-renderer span:nth-of-type(1) {
   order: 2;
}
ytd-comments-header-renderer .count-text.ytd-comments-header-renderer span:nth-of-type(2) {
   order: 1;
   font-weight: 500;
   text-transform: uppercase;
}
ytd-comments-header-renderer .count-text.ytd-comments-header-renderer span:nth-of-type(2)::after {
   content: "•";
   margin: 0 3px;
}
.ytd-comment-simplebox-renderer .underline.tp-yt-paper-input-container,
div#reply-dialog.style-scope.ytd-comment-action-buttons-renderer .underline.tp-yt-paper-input-container,
paper-ripple,
yt-interaction,
yt-sort-filter-sub-menu-renderer #label-icon.yt-dropdown-menu,
ytd-comment-thread-renderer tp-yt-paper-tooltip.ytd-toggle-button-renderer.ytd-toggle-button-renderer,
ytd-comment-thread-renderer yt-interaction {
   display: none !important;
}
tp-yt-paper-listbox.yt-dropdown-menu .iron-selected.yt-dropdown-menu {
   background-color: transparent !important;
}
#title.ytd-comments-header-renderer {
   margin-bottom: 10px;
}
#title.ytd-comments-header-renderer tp-yt-paper-listbox.yt-dropdown-menu,
#title.ytd-comments-header-renderer tp-yt-paper-listbox.yt-dropdown-menu .iron-selected.yt-dropdown-menu {
   --paper-item-min-height: 24px;
}
#title.ytd-comments-header-renderer tp-yt-paper-listbox.yt-dropdown-menu .item.yt-dropdown-menu {
   font-size: 12px !important;
   letter-spacing: 0;
}
#title.ytd-comments-header-renderer tp-yt-paper-menu-button[vertical-align=top] .dropdown-content.tp-yt-paper-menu-button {
   background-color: var(--yt-button-color, inherit);
   border: 1px solid #3c3c3c;
   min-width: max-content;
   top: 0;
}
html:not([dark]) #title.ytd-comments-header-renderer tp-yt-paper-menu-button[vertical-align=top] .dropdown-content.tp-yt-paper-menu-button {
   border: 1px solid #d3d3d3;
   min-width: max-content;
   top: 0;
}
html:not([dark]) ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button,
html:not([dark]) ytd-comments-header-renderer div#icon-label.style-scope.yt-dropdown-menu {
   color: #333;
   font-weight: 500 !important;
   font-size: 11px !important;
   text-transform: none !important;
   letter-spacing: 0 !important;
}
html:not([dark]) ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button,
html:not([dark]) ytd-comments-header-renderer #label.yt-dropdown-menu {
   background-color: #f8f8f8 !important;
   height: 28px;
   border: solid 1px #d3d3d3 !important;
   padding: 0 10px;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
}
html:not([dark]) ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button:hover,
html:not([dark]) ytd-comments-header-renderer #label.yt-dropdown-menu:hover {
   border-color: #c6c6c6 !important;
   background: #f0f0f0 !important;
   box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
}
html:not([dark]) ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button:active,
html:not([dark]) ytd-comments-header-renderer #label.yt-dropdown-menu:active {
   background-color: #e9e9e9 !important;
   box-shadow: inset 0 1px 0#ddd !important;
}
ytd-comments-header-renderer #label.yt-dropdown-menu::after {
   content: "";
   margin-left: 5px;
   width: 0;
   height: 0;
   border-left: 4px solid transparent;
   border-right: 4px solid transparent;
   border-top: 4px solid #8f8f8f;
}
html:not([dark]) ytd-comments-header-renderer #label.yt-dropdown-menu::after {
   content: "";
   margin-left: 5px;
   width: 0;
   height: 0;
   border-left: 4px solid transparent;
   border-right: 4px solid transparent;
   border-top: 4px solid #333;
}
ytd-comments-header-renderer #label.yt-dropdown-menu {
   color: var(--yt-button-color, inherit);
}
ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button,
ytd-comments-header-renderer #label.yt-dropdown-menu {
   background-color: #1c1c1c;
   height: 30px;
   border: solid 1px #333;
   padding: 0 10px;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
}
ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button:hover,
ytd-comments-header-renderer #label.yt-dropdown-menu:hover {
   border-color: #3c3c3c !important;
   color: var(--yt-button-color, inherit);
   box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
   background-color: #444;
}
ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button:active,
ytd-comments-header-renderer #label.yt-dropdown-menu:active {
   background-color: #212121 !important;
   box-shadow: inset 0 1px 0#333 !important;
   color: #8f8f8f;
}
ytd-button-renderer#cancel-button.style-scope tp-yt-paper-button#button,
ytd-comments-header-renderer div#icon-label.style-scope.yt-dropdown-menu {
   color: var(--yt-button-color, inherit);
   font-weight: 500 !important;
   border-color: #333 !important;
   font-size: 11px !important;
   text-transform: none !important;
   letter-spacing: 0 !important;
}
html:not([dark]) ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button {
   background-color: #167ac6 !important;
   color: #fff !important;
   height: 28px !important;
   border: solid 1px #167ac6;
   padding: 0 10px !important;
   font-weight: 500 !important;
   font-size: 11px !important;
   text-transform: none !important;
   letter-spacing: 0 !important;
   border-radius: 2px !important;
   box-shadow: 0 1px 0 rgb(0 0 0/5%) !important;
}
ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button {
   background-color: var(--yt-spec-call-to-action);
   color: var(--yt-spec-text-primary-inverse);
   height: 28px !important;
   border: solid 1px var(--yt-spec-badge-chip-background);
   padding: 0 10px !important;
   font-weight: 500 !important;
   font-size: 11px !important;
   text-transform: none !important;
   letter-spacing: 0 !important;
   border-radius: 2px !important;
   box-shadow: 0 1px 0 rgb(0 0 0/5%) !important;
}
html:not([dark]) ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button:hover {
   background: #126db3 !important;
}
ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button:active,
ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button:hover {
   background-color: var(--yt-spec-call-to-action);
   color: var(--yt-spec-text-primary-inverse);
}
html:not([dark]) ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button:active {
   background: #095b99 !important;
   box-shadow: inset 0 1px 0 rgb(0 0 0/50%) !important;
}
html:not([dark]) ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button[disabled] {
   border-color: #7fb7e0 !important;
   background: #7fb7e0 !important;
}
ytd-button-renderer#submit-button.style-scope tp-yt-paper-button#button[disabled] {
   background-color: var(--yt-spec-badge-chip-background) !important;
   color: var(--yt-spec-text-disabled) !important;
}
#author-thumbnail.ytd-commentbox,
ytd-comment-simplebox-renderer #author-thumbnail.ytd-comment-simplebox-renderer,
ytd-comment-simplebox-renderer img#img.style-scope.yt-img-shadow,
ytd-commentbox[is-backstage-comment] #author-thumbnail.ytd-commentbox {
   height: min-content;
   width: 48px;
}
ytd-comment-action-buttons-renderer ytd-comment-reply-dialog-renderer.ytd-comment-action-buttons-renderer img#img.style-scope.yt-img-shadow,
ytd-commentbox[is-reply] #author-thumbnail.ytd-commentbox {
   height: 32px !important;
   width: 32px !important;
}
html:not([dark]) #placeholder-area.ytd-comment-simplebox-renderer,
html:not([dark]) .ytd-comment-simplebox-renderer .input-content.tp-yt-paper-input-container,
html:not([dark]) div#reply-dialog.style-scope.ytd-comment-action-buttons-renderer .input-content.tp-yt-paper-input-container {
   border: 1px solid #ddd;
   border-top: 1px solid #d5d5d5;
   color: #b8b8b8;
   cursor: pointer;
   min-height: 35px;
   border-radius: 0 2px 2px;
   padding: 8px 10px 5px;
   width: 0;
   background-color: transparent!important;
}
#placeholder-area.ytd-comment-simplebox-renderer,
.ytd-comment-simplebox-renderer .input-content.tp-yt-paper-input-container,
div#reply-dialog.style-scope.ytd-comment-action-buttons-renderer .input-content.tp-yt-paper-input-container {
   border: 1px solid #5a5a5a;
   border-top: 1px solid #5a5a5a;
   color: var(--paper-input-container-input-color, var(--primary-text-color));
   cursor: pointer;
   min-height: 35px;
   border-radius: 0 2px 2px;
   padding: 8px 10px 5px;
   width: 0;
   background-color: #1c1c1c;
}
html:not([dark]) #placeholder-area.ytd-comment-simplebox-renderer:focus,
html:not([dark]) .ytd-comment-simplebox-renderer .input-content.tp-yt-paper-input-container,
html:not([dark]) div#reply-dialog.style-scope.ytd-comment-action-buttons-renderer .input-content.tp-yt-paper-input-container {
   border: 1px solid #699dd2;
   border-top: 1px solid #699dd2;
   border-radius: 0 2px 2px;
}
#placeholder-area.ytd-comment-simplebox-renderer:focus,
.ytd-comment-simplebox-renderer .input-content.tp-yt-paper-input-container,
div#reply-dialog.style-scope.ytd-comment-action-buttons-renderer .input-content.tp-yt-paper-input-container {
   border: 1px solid #5a5a5a;
   border-top: 1px solid #5a5a5a;
   border-radius: 0 2px 2px;
}
#contenteditable-root.yt-formatted-string[aria-label].yt-formatted-string,
#simplebox-placeholder.ytd-comment-simplebox-renderer {
   font-size: 13px !important;
   letter-spacing: 0;
}
ytd-comments-header-renderer div#placeholder-area::before {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRF6urq1dXVAAAA////mznMegAAAAR0Uk5T//8A//4MuwsAAAAuSURBVHicDcMxDQBACATBc0D1elCBIoxQAib5nWT0IpR3Kraf1pgstmvXmCzOBx6TFq6sX+dfAAAAAElFTkSuQmCC);
   z-index: 1;
   float: left;
   margin-right: -11px;
   margin-left: -22px;
   margin-top: -9px;
   filter: invert(94.5%) grayscale(1) brightness(200%);
}
html:not([dark]) ytd-comments-header-renderer div#placeholder-area::before {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRF6urq1dXVAAAA////mznMegAAAAR0Uk5T//8A//4MuwsAAAAuSURBVHicDcMxDQBACATBc0D1elCBIoxQAib5nWT0IpR3Kraf1pgstmvXmCzOBx6TFq6sX+dfAAAAAElFTkSuQmCC);
   z-index: 1;
   float: left;
   margin-right: -11px;
   margin-left: -22px;
   margin-top: -9px;
   filter: none;
}
html[dark] #action-buttons.ytd-comment-renderer div.input-wrapper.style-scope.tp-yt-paper-input-container::before,
html[dark] ytd-comments-header-renderer div.input-wrapper.style-scope.tp-yt-paper-input-container::before {
   filter: invert(89.5%) grayscale(1) brightness(100%);
}
#action-buttons.ytd-comment-renderer div.input-wrapper.style-scope.tp-yt-paper-input-container::before,
ytd-comments-header-renderer div.input-wrapper.style-scope.tp-yt-paper-input-container::before {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFaZzSaZ3SAAAA////cFz/SQAAAAR0Uk5To/8A/3/XCxEAAAAtSURBVHicDcMxDQBACATBM/E1qtBDiQ66Cyb5nWT0MtV3GrpOG2wOXdoNNof+L3wXXNQlZQ4AAAAASUVORK5CYII=);
   z-index: 1;
   position: absolute;
   width: 11px;
   height: 11px;
   top: 0;
   right: 100%;
   filter: invert(0) grayscale(0) brightness(100%);
}
ytd-comments.style-scope div#contents.style-scope.ytd-item-section-renderer {
   margin-top: 36px !important;
}
ytd-comments.style-scope {
   border: 0;
   background: #fff;
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
   -moz-box-sizing: border-box;
   box-sizing: border-box;
   padding: 15px;
}
#author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer {
   margin-right: 10px !important;
   height: 48px !important;
   width: 48px !important;
}
ytd-comment-renderer:not([comment-style=backstage-comment])[is-reply] #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer,
ytd-comment-renderer[is-creator-reply] #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer {
   height: 32px !important;
   width: 32px !important;
}
ytd-author-comment-badge-renderer:not([creator]) #icon.ytd-author-comment-badge-renderer,
ytd-author-comment-badge-renderer[creator] #icon.ytd-author-comment-badge-renderer {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJBAMAAAD0ltBnAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACdQTFRFnJycmpqah4eHs7OziIiIz8/PyMjI5OTko6Oj8PDw/////f39jo6OcQxNSQAAAA10Uk5TVbSdubDh0eHD////wP+/OHAAAAA0SURBVHicY2AUFBRUFGAAkoKGgkBKRDQRRDmWCwKp9vSJIEpstQmIEgwTBFMHQRRIn6AAAOTgB5X8AsHIAAAAAElFTkSuQmCC);
   width: 12px !important;
   height: 9px !important;
}
ytd-author-comment-badge-renderer:not([creator]) #icon.ytd-author-comment-badge-renderer:hover,
ytd-author-comment-badge-renderer[creator] #icon.ytd-author-comment-badge-renderer:hover {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJBAMAAAD0ltBnAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACRQTFRFQ5DaYqPnS6LfhrXsrdb1xd33yNPjQI/O5ebn////9vb2pbjU4GAmaAAAAAx0Uk5Tbv79////+v/+///363aeKQAAADtJREFUeJxjYBQUFFQUYACRhoIMSkpKKkZKDEqKSmFFQErFtF0JSBXPUgdR6puLQJRSOVAVAxOQUFIAAAsGCYbgx0ruAAAAAElFTkSuQmCC);
   width: 12px !important;
   height: 9px !important;
}
.ytd-sponsor-comment-badge-renderer {
   padding-left: 2px;
   margin-right: -2px;
}
#header.ytd-comment-renderer,
ytd-author-comment-badge-renderer {
   margin-top: -1px !important;
   margin-bottom: 1px !important;
}
#author-comment-badge.ytd-comment-renderer,
ytd-author-comment-badge-renderer:not([creator]) #icon.ytd-author-comment-badge-renderer {
   padding-right: 0 !important;
}
#channel-name.ytd-author-comment-badge-renderer,
html:not([dark]) #author-text.yt-simple-endpoint.ytd-comment-renderer {
   color: #128ee9 !important;
   margin-right: 0 !important;
   letter-spacing: 0 !important;
}
#channel-name.ytd-author-comment-badge-renderer:hover,
#content-text.ytd-comment-renderer a.yt-simple-endpoint.yt-formatted-string:hover,
#message.ytd-message-renderer a:hover,
html:not([dark]) #author-text.yt-simple-endpoint.ytd-comment-renderer:hover {
   text-decoration: underline !important;
   text-decoration-color: #128ee9 !important;
}
#author-text.yt-simple-endpoint.ytd-comment-renderer:hover,
#content-text.ytd-comment-renderer a.yt-simple-endpoint.yt-formatted-string:hover,
#message.ytd-message-renderer a:hover {
   text-decoration: underline !important;
   text-decoration-color: #fff !important;
}
.published-time-text.ytd-comment-renderer a {
   color: #767676 !important;
   font-size: 11px !important;
   margin-left: 6px !important;
   letter-spacing: 0 !important;
}
.published-time-text.ytd-comment-renderer a:hover {
   text-decoration: underline !important;
   text-decoration-color: #767676 !important;
}
#content-text.ytd-comment-renderer,
#expander.ytd-comment-replies-renderer #content.ytd-expander,
#message.ytd-message-renderer {
   font-size: 13px !important;
   line-height: 1.3em !important;
   letter-spacing: 0 !important;
}
#content-text.ytd-comment-renderer a.yt-simple-endpoint.yt-formatted-string {
   color: #128ee9 !important;
}
div#toolbar.style-scope.ytd-comment-action-buttons-renderer {
   margin-top: 6px;
   margin-bottom: 10px;
   margin-left: 0;
   height: 13px;
}
#vote-count-left.ytd-comment-action-buttons-renderer[hidden] + #like-button.ytd-comment-action-buttons-renderer {
   margin-left: -4px !important;
}
#toolbar.ytd-comment-action-buttons-renderer tp-yt-paper-button.ytd-button-renderer::after {
   content: "•";
   margin: 0 5px !important;
}
#toolbar.ytd-comment-action-buttons-renderer tp-yt-paper-button.ytd-button-renderer:hover {
   opacity: 1 !important;
   text-decoration: none !important;
}
#toolbar.ytd-comment-action-buttons-renderer tp-yt-paper-button.ytd-button-renderer {
   order: 1;
   text-transform: none !important;
   line-height: 1.3em !important;
   margin-left: -18px !important;
   padding-right: 0 !important;
   font-weight: normal !important;
   color: #848484 !important;
   opacity: 1 !important;
}
html:not([dark]) #toolbar.ytd-comment-action-buttons-renderer tp-yt-paper-button.ytd-button-renderer {
   order: 1;
   text-transform: none !important;
   line-height: 1.3em !important;
   margin-left: -18px !important;
   padding-right: 0 !important;
   font-weight: normal !important;
   color: #555 !important;
   opacity: 0.75 !important;
}
#vote-count-middle.ytd-comment-action-buttons-renderer {
   order: 2;
   color: #128ee9 !important;
   padding-right: 6px !important;
   font-size: 9pt !important;
}
html:not([dark]) #like-button.ytd-comment-action-buttons-renderer {
   order: 3;
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFFQTFRFAAAAGRkZMzMzAAAACgoKGhoaEhISMTExMDAwAAAAAAAAGhoaAAAAIiIiHBwcHh4eLi4uERERAAAAKysrHBwcAwMDAAAAAAoKKSkpLS0tIiIidpjREQAAABt0Uk5TAHv/KE4oV/fzCAGABqeJn+BcG9eRSQkay+asp6oxLwAAAFBJREFUeJxVzkkSgCAQQ9EQURREnKf7H9Sxi+q/ytsFkAwL5CxZZlWOdSPwhmQQtfFW5595DyT+9S9FTJqD5qg4QXHWXBTd+t3YbIj74U7gArqRAmr4tybqAAAAAElFTkSuQmCC);
   width: 14px;
   height: 14px;
   opacity: 0.54;
   margin-right: 9px;
   cursor: pointer;
}
#like-button.ytd-comment-action-buttons-renderer {
   order: 3;
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFFQTFRFAAAAGRkZMzMzAAAACgoKGhoaEhISMTExMDAwAAAAAAAAGhoaAAAAIiIiHBwcHh4eLi4uERERAAAAKysrHBwcAwMDAAAAAAoKKSkpLS0tIiIidpjREQAAABt0Uk5TAHv/KE4oV/fzCAGABqeJn+BcG9eRSQkay+asp6oxLwAAAFBJREFUeJxVzkkSgCAQQ9EQURREnKf7H9Sxi+q/ytsFkAwL5CxZZlWOdSPwhmQQtfFW5595DyT+9S9FTJqD5qg4QXHWXBTd+t3YbIj74U7gArqRAmr4tybqAAAAAElFTkSuQmCC);
   width: 14px;
   height: 14px;
   opacity: 1;
   margin-right: 9px;
   cursor: pointer;
   filter: brightness(2);
}
#like-button.ytd-comment-action-buttons-renderer:hover {
   opacity: 1;
   filter: brightness(3);
}
html:not([dark]) #like-button.ytd-comment-action-buttons-renderer:hover {
   opacity: 0.6;
}
#like-button.ytd-comment-action-buttons-renderer.style-default-active {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFpQTFRFAAAAIUB3QYTzBhgrFCtLQYPxQoX0BwcOFyxSP4DsPn7pAAAAAAAAH0B2IkR6K1egJEWBKFKYOXPVEzFaAAoKN2/OJUyLFCVHAAAAFBQUIkN7NGnDO3jcLFqlDo2PIwAAAB50Uk5TAHz+Kk78/yRX+PMGAXuAp4if314a15FLCRqBzOas5Dk6uwAAAFNJREFUeJxVzkkSgCAQQ9EWMYqgiPN4/2sqahfVf5W3CxGXqZxSukCZVBnUluEaBbQs6wF0Ls5nUMBf/5KFIDlIjoITCc6Si6BZvxub3v1xmovoBlQiBENPyrYVAAAAAElFTkSuQmCC);
   width: 14px;
   height: 14px;
   opacity: 1;
   filter: brightness(1);
}
html:not([dark]) #like-button.ytd-comment-action-buttons-renderer.style-default-active {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFpQTFRFAAAAIUB3QYTzBhgrFCtLQYPxQoX0BwcOFyxSP4DsPn7pAAAAAAAAH0B2IkR6K1egJEWBKFKYOXPVEzFaAAoKN2/OJUyLFCVHAAAAFBQUIkN7NGnDO3jcLFqlDo2PIwAAAB50Uk5TAHz+Kk78/yRX+PMGAXuAp4if314a15FLCRqBzOas5Dk6uwAAAFNJREFUeJxVzkkSgCAQQ9EWMYqgiPN4/2sqahfVf5W3CxGXqZxSukCZVBnUluEaBbQs6wF0Ls5nUMBf/5KFIDlIjoITCc6Si6BZvxub3v1xmovoBlQiBENPyrYVAAAAAElFTkSuQmCC);
   width: 14px;
   height: 14px;
   opacity: 1;
}
#dislike-button.ytd-comment-action-buttons-renderer {
   order: 4;
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFFQTFRFAAAAIiIiMTExLS0tKSkpIiIiGhoaCgoKAAoKAAAAMzMzAwMDHBwcKysrAAAAERERHh4eLi4uAAAAHBwcAAAAGRkZAAAAMDAwEhISGhoaAAAA6t4PpwAAABt0Uk5TAKz35sungE4aCf9JkdcbXJ/gAYkGewjzVygoDkXByQAAAFNJREFUeJxVzEkOgCAQRNESBbScEMXp/gcVBzD9k07qbRpAocpKG1vjqVF8w31oKdhJ9oIDBUdJJzklufcV4Oc49IIvExV80rpR7cgdpP2FkyHvC2y7BYuVtnTFAAAAAElFTkSuQmCC);
   width: 14px;
   height: 14px;
   opacity: 1;
   cursor: pointer;
   filter: brightness(2);
}
html:not([dark]) #dislike-button.ytd-comment-action-buttons-renderer {
   order: 4;
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFFQTFRFAAAAIiIiMTExLS0tKSkpIiIiGhoaCgoKAAoKAAAAMzMzAwMDHBwcKysrAAAAERERHh4eLi4uAAAAHBwcAAAAGRkZAAAAMDAwEhISGhoaAAAA6t4PpwAAABt0Uk5TAKz35sungE4aCf9JkdcbXJ/gAYkGewjzVygoDkXByQAAAFNJREFUeJxVzEkOgCAQRNESBbScEMXp/gcVBzD9k07qbRpAocpKG1vjqVF8w31oKdhJ9oIDBUdJJzklufcV4Oc49IIvExV80rpR7cgdpP2FkyHvC2y7BYuVtnTFAAAAAElFTkSuQmCC);
   width: 14px;
   height: 14px;
   opacity: 0.54;
   cursor: pointer;
}
html:not([dark]) #dislike-button.ytd-comment-action-buttons-renderer:hover {
   opacity: 0.6;
}
#dislike-button.ytd-comment-action-buttons-renderer:hover {
   opacity: 1;
   filter: brightness(3);
}
html:not([dark]) #dislike-button.ytd-comment-action-buttons-renderer.style-default-active {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFpQTFRFAAAALFqlP4DsO3jcNGnDK1egIkN7FCtLFBQUAAAAQoX0FCVHJUyLN2/OAAoKEzFaKFKYOXPVAAAAJEWBAAAAIkR6QYTzH0B2Pn7pFyxSBwcOQYPxBhgrIUB3PiVdqQAAAB50Uk5TAKz45syngU4aCf9LkdcaXp/fAYgGgP5781ck/Cp82XTnmAAAAFVJREFUeJxVzNkOgCAMRNERRbQuICLu//+bLgimN2ky56UAMpEXslQV3mpBITyHhhhbzo6xJ0bNaTiHKBNeAXa8h3T4moj8bKPcQmJFaqNd/cLhz7QvdZIF0DY8ddEAAAAASUVORK5CYII=);
   width: 14px;
   height: 14px;
   opacity: 1;
}
#dislike-button.ytd-comment-action-buttons-renderer.style-default-active {
   content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFpQTFRFAAAALFqlP4DsO3jcNGnDK1egIkN7FCtLFBQUAAAAQoX0FCVHJUyLN2/OAAoKEzFaKFKYOXPVAAAAJEWBAAAAIkR6QYTzH0B2Pn7pFyxSBwcOQYPxBhgrIUB3PiVdqQAAAB50Uk5TAKz45syngU4aCf9LkdcaXp/fAYgGgP5781ck/Cp82XTnmAAAAFVJREFUeJxVzNkOgCAMRNERRbQuICLu//+bLgimN2ky56UAMpEXslQV3mpBITyHhhhbzo6xJ0bNaTiHKBNeAXa8h3T4moj8bKPcQmJFaqNd/cLhz7QvdZIF0DY8ddEAAAAASUVORK5CYII=);
   width: 14px;
   height: 14px;
   opacity: 1;
   filter: brightness(1);
}
#hearted-thumbnail.ytd-creator-heart-renderer,
.ytd-comment-action-buttons-renderer:nth-of-type(2) {
   order: 5;
}
.less-button.ytd-comment-renderer,
tp-yt-paper-button.ytd-expander .more-button.ytd-comment-renderer,
ytd-comment-replies-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer {
   letter-spacing: 0 !important;
   font-size: 13px !important;
   color: #2793e6 !important;
   text-transform: none !important;
}
html[lang=en] .less-button.ytd-comment-renderer,
html[lang=en] tp-yt-paper-button.ytd-expander .more-button.ytd-comment-renderer,
html[lang=en] ytd-comment-replies-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer span:nth-of-type(1)::after {
   content: " all ";
}
ytd-comment-replies-renderer #less-replies.ytd-comment-replies-renderer,
ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer {
   margin-top: -6px !important;
   margin-left: -6px !important;
   letter-spacing: 0 !important;
   color: #2793e6 !important;
   font-size: 13px !important;
}
ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer:hover {
   text-decoration: underline;
   text-decoration-color: #2793e6 !important;
}
ytd-comment-replies-renderer ytd-button-renderer[is-paper-button] yt-icon.ytd-button-renderer {
   order: 2;
   margin-left: 5px;
   margin-top: 2px;
}
ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer yt-icon.ytd-button-renderer {
   fill: transparent;
   background: url(https://s.ytimg.com/yts/imgbin/www-comments-vflNbz94j.png) -152px -20px/auto no-repeat;
   opacity: 0.7;
   filter: invert(1);
   color: transparent;
}
ytd-comment-replies-renderer #less-replies.ytd-comment-replies-renderer yt-icon.ytd-button-renderer {
   fill: transparent;
   background: url(https://s.ytimg.com/yts/imgbin/www-comments-vflNbz94j.png) -152px -72px/auto no-repeat;
   opacity: 0.7;
   filter: invert(1);
   color: transparent;
}
html:not([dark]) ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer yt-icon.ytd-button-renderer {
   fill: transparent;
   background: url(https://s.ytimg.com/yts/imgbin/www-comments-vflNbz94j.png) -152px -20px/auto no-repeat;
   opacity: 0.7;
   filter: invert(0);
   color: transparent;
}
html:not([dark]) ytd-comment-replies-renderer #less-replies.ytd-comment-replies-renderer yt-icon.ytd-button-renderer {
   fill: transparent;
   background: url(https://s.ytimg.com/yts/imgbin/www-comments-vflNbz94j.png) -152px -72px/auto no-repeat;
   opacity: 0.7;
   filter: invert(0);
   color: transparent;
}
#contents.ytd-comment-replies-renderer #body.ytd-comment-renderer {
   margin-bottom: -2px;
}
#body.ytd-comment-renderer:not(:hover) ytd-menu-renderer.ytd-comment-renderer:not([menu-active]).ytd-comment-renderer:not(:focus-within) {
   opacity: initial;
}
html:not([dark]) yt-icon.ytd-menu-renderer {
   opacity: 0.3;
}
html:not([dark]) tp-yt-paper-spinner.ytd-continuation-item-renderer,
tp-yt-paper-spinner.ytd-continuation-item-renderer {
   content: url(data:image/gif;base64,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);
   width: auto;
   height: auto;
   filter: invert(100%) contrast(75%);
}
html:not([dark]) tp-yt-paper-spinner.ytd-continuation-item-renderer {
   filter: none !important;
}
ytd-continuation-item-renderer.ytd-comment-replies-renderer {
   width: 84px;
   padding-top: 0;
   padding-bottom: 0;
   height: 0;
   margin: 0;
}
#button.ytd-continuation-item-renderer ytd-button-renderer.ytd-continuation-item-renderer yt-icon,
ytd-mealbar-promo-renderer {
   display: none;
}
#button.ytd-continuation-item-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer {
   font-size: 0 !important;
   text-decoration: none !important;
}
#button.ytd-continuation-item-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer::after {
   content: "View more comments";
   font-size: 13px !important;
   line-height: 13px;
}
ytd-comment-replies-renderer * > ytd-button-renderer yt-formatted-string.ytd-button-renderer:hover {
   text-decoration: none !important;
}
#button.ytd-continuation-item-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer:hover::after {
   text-decoration: underline !important;
}
.less-button.ytd-comment-renderer,
.more-button.ytd-comment-renderer {
   font-weight: normal !important;
}
ytd-comment-thread-renderer {
   padding-bottom: 5px;
}
#contents.ytd-comment-replies-renderer ytd-comment-renderer:last-of-type {
   padding-bottom: 11px;
}
#contents.ytd-comment-replies-renderer #button.ytd-continuation-item-renderer {
   margin-top: -11px;
}
#expander.ytd-comment-replies-renderer {
   margin-bottom: -4px;
}
#wrapper.tp-yt-app-header-layout > [slot=header] {
   position: unset !important;
   transform: none !important;
   margin: 0;
}
#background.tp-yt-app-header,
#backgroundFrontLayer.tp-yt-app-header,
#backgroundRearLayer.tp-yt-app-header {
   transform: none !important;
}
#contentContainer.tp-yt-app-header-layout,
ytd-thumbnail-overlay-toggle-button-renderer tp-yt-paper-tooltip {
   display: none;
}
#contenteditable-root.yt-formatted-string {
   cursor: auto;
}
#placeholder-area.ytd-comment-simplebox-renderer:focus,
.ytd-comment-simplebox-renderer .input-content.tp-yt-paper-input-container {
   cursor: default;
}
.gsok_a {
   background: url(data:image/gif;base64,R0lGODlhEwALAKECAAAAABISEv///////yH5BAEKAAIALAAAAAATAAsAAAIdDI6pZ+suQJyy0ocV3bbm33EcCArmiUYk1qxAUAAAOw==)no-repeat center!important;
   display: inline-block !important;
   height: 11px !important;
   line-height: 0 !important;
   width: 19px !important;
}
.sbdd_b {
   background: #fff !important;
   border: 1px solid #ccc !important;
   border-top-color: #d9d9d9 !important;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
   cursor: default !important;
}
.sbdd_c {
   display: none !important;
}
.sbsb_b {
   list-style-type: none !important;
   margin: 0 !important;
   padding: 0 !important;
}
.sbsb_c,
.sbsb_c td {
   line-height: 20px !important;
}
.sbsb_c {
   padding: 0 6px !important;
}
.sbsb_d td {
   background: #eee !important;
}
.sbdd_a {
   margin-left: -6px;
   top: 38.5px !important;
}
.sbsb_a {
   padding-top: 0 !important;
}
ytd-thumbnail-overlay-toggle-button-renderer[toggled]:first-child {
   background-image: linear-gradient(to bottom, #74a446 0, #4d7730 100%) !important;
}
ytd-thumbnail-overlay-toggle-button-renderer:first-child yt-icon {
   color: transparent !important;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) 0 -184px !important;
   width: 13px;
   height: 13px;
}
ytd-thumbnail-overlay-toggle-button-renderer[toggled]:first-child yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) 0 -1060px !important;
   width: 13px;
   height: 13px;
}
tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {
   letter-spacing: 0 !important;
}
#masthead-container #search-icon-legacy.ytd-searchbox yt-icon.ytd-searchbox {
   fill: none;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -594px -48px;
   width: 15px !important;
   height: 15px !important;
   bottom: 1px;
}
.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
   border-radius: 2px !important;
   border: 0;
   font-size: 11px !important;
   position: absolute;
   left: 18px;
   z-index: 100;
   background: #cb4437 !important;
   color: #fff !important;
   line-height: 15px;
   text-align: center;
   opacity: 1;
}
html:not([dark]) .yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
   border-bottom: 1px solid #fff;
   border-left: 1px solid #fff;
}
ytd-notification-topbar-button-shape-renderer #button yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -31px -248px;
   background-size: auto;
   width: 30px;
   fill: none;
   opacity: 0.55;
}
ytd-notification-topbar-button-shape-renderer #button:hover yt-icon {
   opacity: 0.65;
}
html[dark] ytd-topbar-menu-button-renderer:nth-last-of-type(3) yt-icon {
   filter: invert(1);
   opacity: 1;
   fill: #000
}
ytd-topbar-menu-button-renderer:nth-last-of-type(2) yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) 0 -75px !important;
   background-size: auto;
   width: 36px !important;
   height: 24px !important;
   color: transparent !important;
   opacity: 0.6 !important;
}
html[dark] ytd-topbar-menu-button-renderer:nth-last-of-type(2) yt-icon {
   opacity: 1 !important;
   filter: invert(1) brightness(1.5);
   color: transparent !important;
}
ytd-topbar-menu-button-renderer:not(:nth-last-child(1)) {
   opacity: 0.67;
}
ytd-topbar-menu-button-renderer:not(:nth-last-child(1)):hover {
   opacity: 0.8;
}
ytd-topbar-menu-button-renderer:not(:nth-last-child(1)):active {
   opacity: 1;
}
#info #segmented-like-button yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) 0 -867px;
   fill: transparent;
   width: 20px !important;
   height: 20px;
   opacity: 0.5;
   color: transparent;
}
#info #segmented-dislike-button yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -174px -804px;
   fill: transparent;
   width: 20px;
   color: transparent;
}
#info #segmented-like-button .style-default-active yt-icon,
#info #segmented-like-button:active yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -79px -278px;
   opacity: 1;
}
#info ytd-toggle-button-renderer.style-default-active a #text,
#info ytd-toggle-button-renderer.style-text[is-icon-button] #text.ytd-toggle-button-renderer {
   color: #000;
   font-weight: 500;
}
#info #segmented-like-button .style-default-active #text,
#info #segmented-like-button:active yt-formatted-string {
   font-size: 11px !important;
   color: #167ac6 !important;
}
[dark] #info ytd-toggle-button-renderer yt-icon,
[dark] #info ytd-toggle-button-renderer.style-default-active:nth-child(2) yt-icon,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item #label {
   filter: invert(1);
}
[dark] #info #segmented-like-button .style-default-active yt-icon,
[dark] #info #segmented-like-button:active yt-icon {
   filter: invert(0);
}
#info #top-level-buttons-computed ytd-button-renderer yt-formatted-string,
#info ytd-button-renderer yt-icon-button,
#info ytd-toggle-button-renderer a yt-formatted-string,
#info ytd-toggle-button-renderer a yt-icon-button {
   opacity: 0.5;
}
#info #menu yt-icon.ytd-menu-renderer:hover,
#info #top-level-buttons-computed ytd-button-renderer:hover yt-formatted-string,
#info ytd-button-renderer:hover yt-icon-button,
#info ytd-toggle-button-renderer a:hover yt-formatted-string,
#info ytd-toggle-button-renderer a:hover yt-icon-button {
   opacity: 0.6;
}
#info ytd-toggle-button-renderer a yt-formatted-string.style-default-active,
#info ytd-toggle-button-renderer a yt-icon-button.style-default-active,
#info ytd-toggle-button-renderer a:active yt-formatted-string,
#info ytd-toggle-button-renderer a:active yt-icon-button,
#info #top-level-buttons-computed ytd-button-renderer:active yt-formatted-string {
   opacity: 1;
}
#info ytd-button-renderer[is-icon-button][style-action-button] yt-icon {
   fill: #000;
   width: 20px;
   height: 20px;
}
#info ytd-button-renderer[is-icon-button][style-action-button]:nth-child(3) yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -267px -824px;
}
#top-level-buttons-computed .ytd-menu-renderer:nth-child(6):nth-last-child(2) button[aria-label*=Report] yt-icon {
   fill: #000 !important;
}
#info #menu .dropdown-trigger {
   margin-top: 5px;
   width: 60px;
   order: 2 !important;
}
#info #menu .dropdown-trigger[hidden] {
   display: inline-block !important;
}
#info #menu .dropdown-trigger yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -155px -864px !important;
   width: 20px;
   height: 20px;
   padding-left: 42px;
   box-sizing: border-box;
}
#info #menu .dropdown-trigger yt-icon::after,
ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer {
   content: "More";
   font-weight: 500;
   font-family: Roboto;
   color: #000 !important;
   font-size: 11px !important;
}
ytd-video-primary-info-renderer ytd-toggle-button-renderer.style-default-active[is-icon-button]:first-child,
ytd-video-primary-info-renderer ytd-toggle-button-renderer.style-text[is-icon-button]:first-child {
   flex: 1;
   max-width: min-content;
   margin-left: auto !important;
}
#info.ytd-video-primary-info-renderer,
#menu-container.ytd-video-primary-info-renderer,
#meta ytd-expander.ytd-video-secondary-info-renderer,
.top-level-buttons.ytd-menu-renderer {
   width: 100%;
}
#info.ytd-video-primary-info-renderer #flex {
   display: none;
}
#info #menu yt-icon.ytd-menu-renderer,
#info ytd-button-renderer {
   opacity: 0.5;
   left: -623px;
   position: unset;
   top: 64px;
}
#info ytd-button-renderer {
   opacity: 1;
}
#info #menu yt-icon.ytd-menu-renderer:active,
#info ytd-button-renderer:active yt-formatted-string,
#info ytd-button-renderer:active yt-icon-button {
   opacity: 1;
}
ytd-button-renderer[is-icon-button][style-action-button]:nth-of-type(1) {
   margin-right: 4px !important;
}
#menu-container.ytd-video-primary-info-renderer {
   z-index: 2 !important;
}
ytd-video-primary-info-renderer ytd-toggle-button-renderer.style-text[is-icon-button] {
   position: unset;
   order: 3 !important;
}
.ytd-subscription-notification-toggle-button-renderer yt-icon {
   fill: none;
}
html:not([dark]) ytd-pinned-comment-badge-renderer yt-icon {
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAAUUlEQVQoz2NgoAUQYXBAgjzYFbkzPGf4D4W3GUxwmbUfrmg+bgupp+g+XNF+7Ao4GMrhSkAwmoEFU9F8FCUgWI/bynqGeMJBOhgVSeCKWmoAADLDMeolZoHfAAAAAElFTkSuQmCC);
   fill: none;
   background-size: cover;
   opacity: 0.8;
}
#guide[opened] #header.ytd-app,
#scrim.tp-yt-app-drawer {
   display: none;
}
tp-yt-app-drawer,
tp-yt-app-drawer[persistent] {
   width: 230px !important;
}
#contentContainer.tp-yt-app-drawer[style="transition-duration: 200ms;"][opened] {
   width: 230px;
   background: 0 0 !important;
   transition-duration: 0ms !important;
   padding-top: 0;
   padding-bottom: 0;
}
tp-yt-app-drawer#guide[style="transition-duration: 200ms; touch-action: pan-y;"] {
   top: 0;
   bottom: 0;
   margin-top: 50px;
   transition-duration: 0ms !important;
}
#primary ytd-merch-shelf-renderer,
.style-scope.ytd-page-manager[fullscreen],
.tp-yt-app-drawer[style="transition-duration: 200ms;"][opened] {
   margin-top: 0;
}
#guide-spacer.ytd-app {
   margin-top: 51px;
}
.tp-yt-app-drawer[style="transition-duration: 200ms;"][opened] #guide-wrapper {
   box-shadow: 5px 10px 15px 5px rgb(0 0 0/10%);
}
.lock-scrollbar {
   overflow: initial !important;
   position: static !important;
}
tp-yt-paper-item.ytd-compact-link-renderer::before,
tp-yt-paper-item::before {
   content: none !important;
}
#manage-account.ytd-active-account-header-renderer {
   background-color: #999;
   border-bottom: none;
   color: #fff;
   padding: 6px 15px 7px;
   text-transform: uppercase;
   order: -1;
   margin: 0 !important;
   justify-content: initial;
   cursor: pointer;
}
#channel-container.ytd-active-account-header-renderer {
   width: 100% !important;
   justify-content: initial;
   margin-top: -6px !important;
}
ytd-active-account-header-renderer {
   padding: 0 !important;
   border: 0 !important;
   min-height: 75px !important;
}
#manage-account.ytd-active-account-header-renderer a {
   all: unset;
   font: bold 11px roboto;
   margin: 5px 0 -2px;
}
#manage-account.ytd-active-account-header-renderer a:hover,
.super-title.ytd-video-primary-info-renderer a.yt-simple-endpoint.yt-formatted-string:hover {
   text-decoration: underline;
}
#avatar.ytd-active-account-header-renderer {
   position: absolute;
   width: 64px !important;
   height: 64px !important;
   margin: 38px 0 0 15px !important;
}
#avatar.ytd-active-account-header-renderer img {
   margin: 0 !important;
   width: 64px !important;
   height: 64px !important;
}
#account-name.ytd-active-account-header-renderer,
#email.ytd-active-account-header-renderer {
   font: 500 13px roboto !important;
   margin-left: 90px;
}
#account-name.ytd-active-account-header-renderer {
   margin-top: 12px;
}
yt-formatted-string#email:not(.use-shadow):empty {
   display: block !important;
   min-height: 16px !important;
}
#playlist ytd-thumbnail-overlay-time-status-renderer,
[menu-style=multi-page-menu-style-type-system] #content-icon,
[menu-style=multi-page-menu-style-type-system] .content-icon {
   display: none !important;
}
[menu-style=multi-page-menu-style-type-system] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   padding: 0 15px;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:first-child {
   background: 0 0 !important;
   max-width: 80px;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:first-child #label {
   color: #fff;
   background-color: rgba(0, 0, 0, 0.4);
   font: 500 9px roboto;
   line-height: 9px;
   padding: 5px 0;
   width: 65px;
   margin-bottom: 4px;
   text-align: center;
   margin-left: -2px;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(4) {
   border-top: 1px solid rgba(0, 0, 0, 0.1);
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) {
   position: absolute;
   top: 78px;
   left: 90px;
}
[menu-style="multi-page-menu-style-type-system"] #content-icon {
	display: initial !important;
}
#container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) {
   position: absolute;
   top: 78px;
   left: 100px;
   margin-left: 95px !important;
}
ytd-multi-page-menu-renderer[menu-style=multi-page-menu-style-type-account] #spinner.ytd-multi-page-menu-renderer {
   height: 400px !important;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item {
   border: 1px solid #d3d3d3;
   background: #f8f8f8;
   color: #333;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   padding: 0px 0px;
   height: 22px !important;
   margin-left: -4px;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item {
   border: 1px solid #d3d3d3;
   background: #f8f8f8;
   color: #333;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   height: 22px !important;
   padding: 0 4px;
}
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item,
html[dark] [menu-style=multi-page-menu-style-type-system] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer,
html[dark] [menu-style=multi-page-menu-style-type-system] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer {
   border-color: #444;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer:hover,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item:hover,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer:hover,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgb(0 0 0/10%);
}
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item,
html[dark] [menu-style=multi-page-menu-style-type-system] #submenu ytd-compact-link-renderer.yt-multi-page-menu-section-renderer {
   background: #292929 !important;
   color: #eee;
}
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item:hover,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item:hover {
   border-color: rgba(255, 255, 255, 0.1);
   background: #2c2c2c;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item #label {
   font: normal 11px Roboto;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item #label {
   font: normal 0 roboto;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -626px 0;
   background-size: auto;
   width: 20px;
   height: 20px;
   opacity: 0.5;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item #label:hover {
   opacity: 1;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item #primary-text-container,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item #primary-text-container,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item #primary-text-container {
   display: inline-block;
}
/*
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(5),
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(6),
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(7),
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(8),
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:nth-child(3) {
  display: none;
}
*/
#sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:not(:last-child) {
   border: 0 !important;
   padding-bottom: 0 !important;
}
#sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:nth-child(2) {
   padding-top: 0;
   padding-bottom: 5px;
   border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
[menu-style=multi-page-menu-style-type-system] #container #sections {
   padding-bottom: 48px;
   background: #f5f5f5;
}
html[dark] [menu-style=multi-page-menu-style-type-system] #container #sections {
   background: #292929;
}
[menu-style=multi-page-menu-style-type-system] #container #sections yt-multi-page-menu-section-renderer {
   background: #fff;
}
html[dark] [menu-style=multi-page-menu-style-type-system] #container #sections yt-multi-page-menu-section-renderer {
   background: #212121;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) {
   position: absolute;
   bottom: 10px;
   right: 15px;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) {
   position: absolute;
   bottom: 10px;
   left: 15px;
}
[menu-style=multi-page-menu-style-type-system] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer,
[menu-style=multi-page-menu-style-type-system] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer {
   background: #f8f8f8;
   height: 28px !important;
   border: solid 1px #d3d3d3;
   padding: 0 10px;
   outline: 0;
   font-weight: 500;
   font-size: 11px;
   text-decoration: none;
   white-space: nowrap;
   word-wrap: normal;
   line-height: normal;
   vertical-align: middle;
   cursor: pointer;
   *overflow: visible;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer #label,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer #label {
   color: #333;
   font: 500 11px Roboto;
}
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer:hover,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer:hover {
   border-color: #333;
}
[menu-style=multi-page-menu-style-type-system] #submenu ytd-compact-link-renderer.yt-multi-page-menu-section-renderer {
   position: static !important;
   background: #f5f5f5 !important;
   border-top: 1px solid rgba(0, 0, 0, 0.1);
   min-height: 28px;
}
[menu-style=multi-page-menu-style-type-system] #submenu yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:first-child {
   border: 0 !important;
}
[menu-style=multi-page-menu-style-type-system] #submenu tp-yt-paper-item {
   border: 0 !important;
   padding: 0 15px;
   box-shadow: none !important;
   border-radius: 0;
   margin: 0;
   height: 28px !important;
}
[menu-style=multi-page-menu-style-type-system] #submenu yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) tp-yt-paper-item {
   margin-left: 5px;
   height: 28px !important;
}
[menu-style=multi-page-menu-style-type-system] #submenu #label {
   font: 500 13px roboto !important;
   margin: 0 !important;
   line-height: 28px;
}
[menu-style=multi-page-menu-style-type-system] #submenu yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:first-child #label {
   all: unset;
   font: normal 13px roboto !important;
   padding-top: 10px;
   padding-bottom: 10px;
}
[menu-style=multi-page-menu-style-type-system] #submenu #sections {
   padding-bottom: 0;
   border: 0;
}
[menu-style=multi-page-menu-style-type-system] #submenu #sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer {
   padding: 0;
}
[menu-style=multi-page-menu-style-type-system] #submenu ytd-simple-menu-header-renderer {
   border: 0;
   min-height: 0;
   background-color: #999;
   border-bottom: none;
   color: #fff;
   order: -1;
   margin: 0;
   justify-content: initial;
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer:hover,
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer:hover,
[menu-style="multi-page-menu-style-type-system"] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer,
[menu-style="multi-page-menu-style-type-system"] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer {
   display: none;
}
[menu-style=multi-page-menu-style-type-system] #submenu ytd-simple-menu-header-renderer yt-formatted-string {
   text-transform: uppercase;
   font: bold 11px roboto;
   line-height: 24px;
}
[menu-style=multi-page-menu-style-type-system] #submenu ytd-simple-menu-header-renderer ytd-button-renderer #button.ytd-button-renderer {
   padding: 0;
   height: 20px;
   width: 20px;
   color: #fff;
}
h2.ytd-simple-menu-header-renderer {
   height: 26px;
}
ytd-toggle-theme-compact-link-renderer {
   height: 24px !important;
   min-height: 0 !important;
   padding: 0 15px !important;
}
.ytd-account-item-section-renderer .content-icon {
   display: inline-block;
}
.ytd-account-item-section-renderer ytd-account-item-renderer[enable-ring-for-active-account] yt-img-shadow.ytd-account-item-renderer {
   border-radius: 0;
   border: 0;
   width: 36px;
   height: 36px;
}
.ytd-account-item-section-renderer img {
   height: 36px;
   width: 36px;
}
.ytd-account-item-section-renderer #contentIcon {
   height: 36px;
   width: 36px;
   padding-right: 10px;
}
tp-yt-paper-icon-item.ytd-account-item-renderer {
   height: 50px;
   min-height: 50px;
   border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
tp-yt-paper-icon-item.ytd-account-item-renderer::before,
ytd-playlist-sidebar-primary-info-renderer[responsive] ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer::before {
   content: none !important;
}
[menu-style=multi-page-menu-style-type-system] #submenu #footer tp-yt-paper-item {
   background: #f8f8f8;
}
[menu-style=multi-page-menu-style-type-system] #submenu #footer ytd-compact-link-renderer.yt-multi-page-menu-section-renderer,
ytd-unified-share-panel-renderer {
   max-width: none !important;
}
ytd-google-account-header-renderer.ytd-account-section-list-renderer {
   background: #fff;
   border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
#container.ytd-google-account-header-renderer,
html[dark] [page-subtype=playlist] ytd-playlist-video-renderer {
   border-bottom: none;
}
#footer.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer {
   padding-top: 0;
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
tp-yt-paper-item {
   min-height: 20px !important;
   height: auto !important;
}
[menu-style=multi-page-menu-style-type-system] #header.ytd-multi-page-menu-renderer::after {
   content: "";
   display: inline-block;
   border: 12px solid transparent;
   border-top-width: 0 !important;
   border-bottom-color: #999;
   position: absolute;
   top: -8px;
   right: 18px;
}
#container.ytd-playlist-panel-renderer {
   position: relative !important;
   right: 24px !important;
   border: 0 !important;
}
.header.ytd-playlist-panel-renderer {
   background-color: #1a1a1a !important;
}
ytd-playlist-panel-video-renderer:hover:not(.dragging) {
   background-color: #525252 !important;
}
#expand-button.ytd-playlist-panel-renderer {
   display: none !important;
}
.title.ytd-playlist-panel-renderer a.yt-formatted-string {
   color: #fff !important;
   display: inline !important;
   font-size: 15px !important;
   font-weight: normal !important;
}
.title.ytd-playlist-panel-renderer a.yt-formatted-string:hover,
.ytd-watch-next-secondary-results-renderer [class*=ytd-compact-]:hover ytd-thumbnail-overlay-time-status-renderer span:not(.ytd-badge-supported-renderer),
yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover {
   color: #fff !important;
}
.index-message-wrapper.ytd-playlist-panel-renderer,
ytd-playlist-panel-renderer[collapsible] .publisher.ytd-playlist-panel-renderer {
   font-size: 11px !important;
   color: #b8b8b8 !important;
}
.publisher.ytd-playlist-panel-renderer .yt-simple-endpoint.style-scope.yt-formatted-string {
   color: #b8b8b8 !important;
}
ytd-playlist-panel-renderer[collapsible] #publisher-container.ytd-playlist-panel-renderer {
   margin-top: 0 !important;
}
#header-top-row.ytd-playlist-panel-renderer {
   border-bottom: 1px solid #3a3a3a !important;
   padding-bottom: 7px !important;
}
#secondary .top-level-buttons.ytd-menu-renderer button.yt-icon-button {
   width: 24px !important;
   height: 24px !important;
}
#top-level-buttons-computed.ytd-menu-renderer:not(:empty) + #button.ytd-menu-renderer,
.ytd-menu-renderer[button-renderer] + template.ytd-menu-renderer + #button.ytd-menu-renderer,
ytd-menu-renderer:not([condensed]) .ytd-menu-renderer[button-renderer] + .ytd-menu-renderer[button-renderer] {
   margin-left: 0 !important;
}
.index-message-wrapper.ytd-playlist-panel-renderer::after {
   content: " videos" !important;
}
#save-button.ytd-playlist-panel-renderer button.yt-icon-button {
   color: transparent !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflEoWid_.png) -151px -268px;
   background-size: auto;
   width: 24px;
   height: 24px;
   opacity: 0.5;
}
.ytd-playlist-panel-renderer .top-level-buttons ytd-toggle-button-renderer.ytd-menu-renderer:first-child .yt-icon-button {
   color: transparent !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflEoWid_.png) -41px -559px;
   background-size: auto;
   width: 24px;
   height: 24px;
   opacity: 0.5;
}
.ytd-playlist-panel-renderer .top-level-buttons ytd-toggle-button-renderer.ytd-menu-renderer:last-child .yt-icon-button {
   color: transparent !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflEoWid_.png) -171px -52px;
   background-size: auto;
   width: 24px;
   height: 24px;
   opacity: 0.5;
}
#save-button.ytd-playlist-panel-renderer button.yt-icon-button:hover,
.ytd-playlist-panel-renderer .top-level-buttons ytd-toggle-button-renderer.ytd-menu-renderer:hover .yt-icon-button {
   opacity: 0.6;
}
#save-button.ytd-playlist-panel-renderer button.yt-icon-button:active,
.ytd-playlist-panel-renderer .top-level-buttons ytd-toggle-button-renderer.ytd-menu-renderer.style-default-active .yt-icon-button#button,
.ytd-playlist-panel-renderer .top-level-buttons ytd-toggle-button-renderer.ytd-menu-renderer:active .yt-icon-button {
   opacity: 0.8;
}
ytd-app #save-button {
   position: relative;
   top: -47px !important;
}
h4.ytd-playlist-panel-video-renderer #video-title {
   text-decoration: none !important;
}
#playlist-action-menu ytd-toggle-button-renderer.style-default-active[is-icon-button] {
   order: -1 !important;
}
ytd-app #playlist-actions #save-button {
   position: static !important;
   top: 0 !important;
}
ytd-grid-video-renderer[three-dot-rework] ytd-menu-renderer.ytd-grid-video-renderer {
   display: none !important;
}
#menu.ytd-playlist-panel-video-renderer {
   max-width: 14px;
}
#playlist #thumbnail-container.ytd-playlist-panel-video-renderer,
#playlist img.yt-img-shadow,
#playlist ytd-thumbnail #thumbnail.ytd-thumbnail,
#playlist ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail {
   width: 72px !important;
   height: 45px !important;
}
ytd-movie-renderer[use-prominent-thumbs] .thumbnail-container.ytd-movie-renderer {
   min-width: 156px !important;
   width: auto;
   flex: 0 !important;
}
#video-title.ytd-playlist-panel-video-renderer {
   color: #cacaca !important;
   font-size: 13px !important;
   font-weight: normal !important;
   line-height: normal !important;
   margin-bottom: 0 !important;
}
#byline.ytd-playlist-panel-video-renderer,
ytd-playlist-panel-video-renderer[watch-color-update] #byline.ytd-playlist-panel-video-renderer {
   color: #767676 !important;
   font-size: 11px !important;
}
.playlist-items.ytd-playlist-panel-renderer {
   background-color: #222 !important;
   padding: 0 !important;
}
ytd-playlist-panel-video-renderer[selected][watch-color-update] {
   background: #3a3a3a !important;
}
ytd-playlist-panel-video-renderer {
   padding: 10px 10px 10px 0 !important;
   height: 37px !important;
}
#index-container.ytd-playlist-panel-video-renderer,
#index.ytd-playlist-panel-video-renderer,
#reorder.ytd-playlist-panel-video-renderer {
   font-size: 10px !important;
   color: #b8b8b8 !important;
   margin: 0 2px !important;
   left: -1px !important;
   position: relative;
   top: -1px !important;
}
ytd-playlist-panel-video-renderer[selected] #index.ytd-playlist-panel-video-renderer {
   color: #c03636 !important;
}
#avatar.ytd-c4-tabbed-header-renderer,
#avatar.ytd-c4-tabbed-header-renderer img.yt-img-shadow {
   top: -96px !important;
   position: relative !important;
   overflow: visible !important;
   height: 100px !important;
   width: 100px !important;
}
@media (max-width: 1599px) {
   #avatar.ytd-c4-tabbed-header-renderer,
   #avatar.ytd-c4-tabbed-header-renderer img.yt-img-shadow {
      top: -79px !important;
   }
   ytd-app #banner-top-options,
   ytd-app #header.ytd-browse {
      width: 1056px !important;
   }
   ytd-app #subscriber-count.ytd-c4-tabbed-header-renderer {
      left: 955px !important;
   }
   ytd-app ytd-button-renderer.style-primary:nth-of-type(2) {
      left: -680px !important;
   }
   ytd-app #subscriber-count.ytd-c4-tabbed-header-renderer::before {
      left: -1000px !important;
   }
}
#meta.ytd-c4-tabbed-header-renderer {
   position: relative;
   left: -120px !important;
}
#buttons.ytd-c4-tabbed-header-renderer {
   position: relative;
   left: -59px !important;
}
.style-scope.ytd-page-manager {
   margin-top: 11px;
}
#primary-links.ytd-c4-tabbed-header-renderer yt-formatted-string.ytd-c4-tabbed-header-renderer {
   height: 16px !important;
   color: #fff !important;
   font-size: 11px !important;
   font-family: "YouTube Noto", Roboto, arial, sans-serif !important;
   line-height: 15.8px !important;
   letter-spacing: 0 !important;
}
#primary-links.ytd-c4-tabbed-header-renderer a.yt-simple-endpoint.ytd-c4-tabbed-header-renderer {
   float: right !important;
   padding: 10px !important;
}
#secondary-links.ytd-c4-tabbed-header-renderer {
   float: right !important;
   padding: 10px 0!important;
   height: 16px !important;
   margin-left: 2px !important;
}
ytd-app #secondary-links.ytd-c4-tabbed-header-renderer a.yt-simple-endpoint.ytd-c4-tabbed-header-renderer {
   padding: 0;
}
ytd-app #secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer:first-child {
   padding-left: 10px;
}
ytd-app #secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer:nth-last-child(2) {
   padding-right: 10px;
}
.ytp-larger-tap-buttons .ytp-chrome-controls .ytp-button.ytp-mute-button {
   padding: 0 !important;
}
ytd-browse[page-subtype="channels"] #alerts {
   order: -1;
}
#primary-links.ytd-c4-tabbed-header-renderer,
#secondary-links.ytd-c4-tabbed-header-renderer {
   background-color: rgba(102, 102, 102, 0.5) !important;
}
#links-holder.ytd-c4-tabbed-header-renderer {
   top: -36px !important;
}
#primary-links.ytd-c4-tabbed-header-renderer:hover yt-formatted-string.ytd-c4-tabbed-header-renderer {
   text-decoration: underline !important;
}
@media (min-width: 1500px) {
   #header.ytd-browse {
      width: 1260px !important;
   }
}
tp-yt-app-header-layout #text.ytd-channel-name {
   color: #333 !important;
   font-size: 20px !important;
   font-weight: 500 !important;
   text-shadow: none !important;
}
html[dark] tp-yt-app-header-layout #text.ytd-channel-name {
   color: #fff !important;
}
#text.ytd-channel-name:hover {
   text-decoration: underline !important;
   cursor: pointer !important;
}
#channel-header-container.ytd-c4-tabbed-header-renderer {
   height: 33px !important;
}
#channel-name.ytd-c4-tabbed-header-renderer,
#meta.ytd-c4-tabbed-header-renderer {
   overflow: visible !important;
}
#subscriber-count.ytd-c4-tabbed-header-renderer {
   position: absolute;
   font-size: 11px !important;
   letter-spacing: 0 !important;
   color: #737373;
   height: 22px !important;
   line-height: 24px !important;
   border: 1px solid #ccc;
   padding: 0 6px 0 11px !important;
   border-radius: 2px !important;
   text-align: center !important;
   left: 1160px !important;
   top: 3px !important;
   max-width: 28px;
   overflow: hidden;
}
#tabsContent.tp-yt-paper-tabs > :not(#selectionBar) {
   height: 29px !important;
   padding-bottom: 0;
   padding-left: 0;
   padding-right: 0;
   margin-left: 20px;
   text-transform: none;
}
#tabsContainer.tp-yt-paper-tabs,
#tabsContent.scrollable.tp-yt-paper-tabs,
ytd-c4-tabbed-header-renderer[guide-persistent-and-visible] tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {
   height: 100% !important;
   margin-left: 0 !important;
}
#tabsContent.scrollable.tp-yt-paper-tabs {
   padding-top: 3px;
}
html[dark] #subscriber-count.ytd-c4-tabbed-header-renderer {
   border-color: #333 !important;
}
#sponsor-button.ytd-c4-tabbed-header-renderer,
.underline.style-scope.tp-yt-paper-input-container,
form.ytd-expandable-tab-renderer yt-icon-button.ytd-expandable-tab-renderer {
   display: none !important;
}
#inner-header-container.ytd-c4-tabbed-header-renderer {
   top: 8px !important;
   position: relative;
}
#tabsContent.tp-yt-paper-tabs:not(.iron-selected) {
   border-bottom: 3px solid transparent;
}
tp-yt-app-header-layout .badge-style-type-verified.ytd-badge-supported-renderer {
   top: -2px !important;
   position: relative;
}
tp-yt-paper-tab.iron-selected.ytd-c4-tabbed-header-renderer,
tp-yt-paper-tab.ytd-c4-tabbed-header-renderer:hover {
   border: 0 !important;
   box-shadow: #cc181e 0 -3px inset;
   height: 30px !important;
}
.badge-style-type-verified.ytd-badge-supported-renderer {
   padding-left: 0 !important;
}
#paper-input-label-1 {
   color: #666;
}
tp-yt-paper-input-container {
   top: -1px !important;
   position: relative;
}
.grid-subheader.ytd-shelf-renderer {
   margin-top: 10px !important;
}
#title.ytd-shelf-renderer {
   font-size: 15px !important;
   height: 29px !important;
}
#contents.ytd-shelf-renderer {
   margin-top: 10px !important;
}
[page-subtype=channels] ytd-thumbnail.ytd-grid-video-renderer {
   height: 110px !important;
   width: 196px !important;
   margin-right: 10px !important;
}
#scroll-container.yt-horizontal-list-renderer #thumbnail.ytd-thumbnail {
   overflow: visible !important;
   width: 196px !important;
}
#items.yt-horizontal-list-renderer > .yt-horizontal-list-renderer {
   padding-right: 0 !important;
}
ytd-grid-video-renderer .top-level-buttons.ytd-menu-renderer {
   display: none !important;
}
ytd-grid-video-renderer {
   width: 196px !important;
   margin-right: 10px !important;
}
#avatar.ytd-shelf-renderer,
#avatar.ytd-shelf-renderer img.yt-img-shadow {
   width: 20px !important;
   height: 20px !important;
   border-radius: initial !important;
}
yt-horizontal-list-renderer {
   height: 193px !important;
}
html .arrow.yt-horizontal-list-renderer {
   box-shadow: none;
   right: -12px !important;
   position: relative;
   border-radius: initial !important;
}
.style-scope.ytd-item-section-renderer #button.size-default.style-default.ytd-button-renderer.style-scope {
   color: transparent;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -112px -42px !important;
   width: 7px !important;
   height: 10px !important;
   padding: 0 !important;
   opacity: 0.5 !important;
}
html[dark] #button.size-default.style-default.ytd-button-renderer.style-scope,
html[dark] #button.size-default.style-visibly-disabled.ytd-button-renderer.style-scope {
   filter: invert(1);
}
html[dark] ytd-button-renderer.ytd-searchbox yt-icon-button {
   filter: none !important;
}
.arrow.yt-horizontal-list-renderer,
yt-horizontal-list-renderer .style-scope.ytd-item-section-renderer a.yt-simple-endpoint.ytd-button-renderer {
   width: 7px !important;
   height: 10px !important;
}
yt-horizontal-list-renderer:hover .arrow.yt-horizontal-list-renderer {
   width: 40px !important;
   height: 60px !important;
   border: 1px solid #e3e3e3;
   box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
   left: 0px !important;
   opacity: 1 !important;
}
html[dark] ytd-item-section-renderer:hover .arrow.yt-horizontal-list-renderer {
   border: 1px solid #51515151 !important;
}
div#dismissible:hover ytd-button-renderer.style-text[is-paper-button] #button.ytd-button-renderer,
ytd-item-section-renderer:hover #button.size-default.style-default.ytd-button-renderer.style-scope {
   opacity: 1 !important;
}
.style-scope.ytd-item-section-renderer #left-arrow.yt-horizontal-list-renderer #button.size-default.style-default.ytd-button-renderer.style-scope {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -20px -918px !important;
}
#left-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer {
   left: -7px !important;
}
ytd-item-section-renderer:hover #left-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer {
   left: 4px !important;
}
#video-title.yt-simple-endpoint.ytd-grid-video-renderer {
   line-height: normal !important;
}
ytd-grid-video-renderer:not([rich-meta]) #metadata-line.ytd-grid-video-renderer {
   font-size: 11px !important;
   line-height: normal !important;
}
ytd-grid-video-renderer yt-formatted-string[ellipsis-truncate] a.yt-formatted-string {
   font-size: 11px !important;
   line-height: normal !important;
}
#metadata-container {
   margin-top: 3px !important;
}
#items.yt-horizontal-list-renderer {
   transition-duration: 0.3s !important;
   transition-timing-function: ease-in-out !important;
}
ytd-badge-supported-renderer.ytd-channel-name {
   margin-left: 3px !important;
}
#scroll-container.yt-horizontal-list-renderer ytd-thumbnail-overlay-time-status-renderer {
   margin-top: -7px !important;
   margin-right: 2px !important;
   padding: 0 4px;
   font-weight: 500;
   font-size: 11px;
   background-color: #000;
   color: #fff !important;
   height: 14px;
   line-height: 14px;
   opacity: 0.75 !important;
   filter: alpha(opacity=75);
   vertical-align: top;
   display: inline-block;
   border-radius: 0 !important;
   top: 94px !important;
   z-index: 1 !important;
}
#hover-overlays #label-container,
.style-scope.ytd-item-section-renderer tp-yt-paper-button.ytd-subscribe-button-renderer::before,
ytd-badge-supported-renderer.ytd-grid-video-renderer,
ytd-grid-video-renderer:hover ytd-thumbnail-overlay-time-status-renderer {
   display: none !important;
}
ytd-thumbnail-overlay-resume-playback-renderer {
   display: block !important;
   opacity: 1 !important;
   background: rgba(0, 0, 0, 0) !important;
   transition: all 0s ease 0s !important;
   z-index: 9 !important;
}
ytd-thumbnail-overlay-resume-playback-renderer:hover {
   opacity: 1;
}
ytd-playlist-thumbnail.ytd-grid-playlist-renderer {
   width: 196px !important;
   height: 110px !important;
}
ytd-grid-playlist-renderer {
   width: 200px !important;
}
html:not([dark]) #video-title.ytd-grid-playlist-renderer {
   font-size: 13px !important;
   line-height: normal !important;
   color: #167ac6 !important;
}
#video-title.ytd-grid-playlist-renderer {
   font-size: 13px !important;
   line-height: normal !important;
}
#video-title.ytd-grid-playlist-renderer:hover {
   text-decoration: underline !important;
}
#secondary-links.ytd-c4-tabbed-header-renderer:not(first-child) a.yt-simple-endpoint.ytd-c4-tabbed-header-renderer:not(:first-child) {
   margin-left: 5px !important;
}
ytd-thumbnail-overlay-hover-text-renderer {
   background: rgba(0, 0, 0, 0.7) !important;
}
.style-scope.ytd-thumbnail-overlay-hover-text-renderer {
   text-transform: uppercase !important;
   font-size: 13px !important;
   text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6) !important;
   font-weight: normal !important;
}
ytd-thumbnail-overlay-hover-text-renderer.ytd-playlist-thumbnail yt-icon {
   color: transparent !important;
   margin-right: 6px !important;
   vertical-align: middle;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflHFLZLR.webp) -86px -122px;
   background-size: auto;
   width: 9px;
   height: 12px;
}
ytd-thumbnail-overlay-side-panel-renderer {
   position: absolute !important;
   right: 0 !important;
   top: 0 !important;
   height: 100% !important;
   width: 43.75% !important;
   background: rgba(0, 0, 0, 0.8) !important;
}
yt-icon.ytd-thumbnail-overlay-side-panel-renderer {
   color: transparent !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflHFLZLR.webp) -217px -456px;
   background-size: auto;
   width: 24px;
   height: 24px;
}
yt-formatted-string.ytd-thumbnail-overlay-side-panel-renderer {
   color: #cfcfcf !important;
   display: block;
   margin: 0 0.75em;
   font-size: 18px;
   line-height: 22px;
   word-break: break-word;
   white-space: normal;
   text-transform: uppercase;
   top: -10px !important;
   position: relative;
   width: 50px !important;
}
yt-formatted-string.ytd-thumbnail-overlay-side-panel-renderer::before {
   content: "VIDEOS";
   position: absolute !important;
   font-size: 10px !important;
   width: 35px !important;
   top: 17px !important;
   left: 7px !important;
}
ytd-app #play-button ytd-button-renderer[is-paper-button] yt-icon.ytd-button-renderer {
   fill: transparent !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -113px -474px !important;
   width: 16px !important;
   height: 16px !important;
   opacity: 0.5 !important;
   position: relative;
   left: -26px !important;
   top: -1px !important;
}
#play-button ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   overflow: visible !important;
   color: #333 !important;
   font-size: 11px !important;
   letter-spacing: 0 !important;
   position: relative;
   top: -15px !important;
   left: -16px !important;
}
#title-container.ytd-shelf-renderer ytd-button-renderer #button.ytd-button-renderer {
   border: 1px solid #d3d3d3 !important;
   background: #f8f8f8 !important;
   padding: 0 38px !important;
   height: 18px !important;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
   width: 0 !important;
   display: block;
   position: relative;
   top: 0 !important;
   left: 3px !important;
   opacity: 0 !important;
}
html[dark] #title-container.ytd-shelf-renderer ytd-button-renderer #button.ytd-button-renderer {
   background: 0 0 !important;
   border: 1px solid #51515151 !important;
}
ytd-channel-video-player-renderer {
   padding: 18px 0 24px !important;
}
#player-container.ytd-channel-video-player-renderer {
   width: 520px !important;
   height: 292.5px !important;
   margin-right: 12px !important;
}
.video-stream.html5-main-video {
   width: 520px;
   height: 292.5px;
}
.ytp-chrome-bottom {
   width: 500px;
}
ytd-app .ytp-larger-tap-buttons .ytp-chrome-controls .ytp-button,
ytd-app .ytp-larger-tap-buttons .ytp-replay-button {
   padding: 0 !important;
   width: 36px;
}
ytd-app .ytp-chrome-controls .ytp-play-button {
   width: 46px !important;
}
.ytp-big-mode .ytp-chrome-bottom,
.ytp-big-mode .ytp-chrome-controls {
   height: 54px !important;
   line-height: 54px !important;
}
.ytp-big-mode .ytp-progress-bar-container {
   bottom: 52.5px !important;
   height: 8px !important;
}
.ytp-big-mode .ytp-chrome-controls .ytp-button,
.ytp-big-mode .ytp-chrome-top .ytp-button {
   height: 54px !important;
   width: 54px !important;
}
.ytp-big-mode .ytp-chrome-controls .ytp-play-button {
   height: 54px !important;
   width: 69px !important;
   padding: 0 !important;
}
.ytp-big-mode .ytp-time-display.notranslate span {
   top: 0 !important;
   position: relative;
}
/*
.ytp-watch-later-icon {
	display: none !important;
}
*/
html:not([dark]) .content.ytd-channel-video-player-renderer {
   font-size: 13px !important;
   color: #555 !important;
   max-height: 13em !important;
}
.more-button.ytd-channel-video-player-renderer {
   font-weight: normal !important;
   color: #167ac6 !important;
   font-size: 13px !important;
}
#description.ytd-channel-video-player-renderer {
   width: 494px !important;
}
@media (min-width: 1600px) {
   .banner-visible-area.ytd-c4-tabbed-header-renderer,
   ytd-c4-tabbed-header-renderer .banner-visible-area.ytd-c4-tabbed-header-renderer,
   ytd-c4-tabbed-header-renderer[guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer,
   #banner-editor {
      height: 209px !important;
   }
}
@media (max-width: 1599px) {
   ytd-c4-tabbed-header-renderer[has-channel-art] .banner-visible-area.ytd-c4-tabbed-header-renderer,
   ytd-c4-tabbed-header-renderer[has-channel-art][guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer,
   #banner-editor {
      height: 175px !important;
   }
}
ytd-app .ytd-thumbnail[top-right-overlay] ~ .ytd-thumbnail[top-right-overlay] yt-icon {
   width: 20px !important;
   height: 20px !important;
   color: #fff !important;
   filter: invert(1) !important;
}
html[dark] ytd-app .ytd-thumbnail[top-right-overlay] ~ .ytd-thumbnail[top-right-overlay] yt-icon {
   filter: invert(0) !important;
}
ytd-item-section-renderer:nth-of-type(1) {
   border-bottom: 1px solid #e5e5e5 !important;
}
html[dark] ytd-item-section-renderer:nth-of-type(1) {
   border-bottom: 1px solid #51515151 !important;
}
html[dark] ytd-thumbnail-overlay-toggle-button-renderer {
   border-color: #51515151 !important;
   background: #212121 !important;
}
html[dark] #notification-preference-button button.yt-icon-button,
html[dark] ytd-thumbnail-overlay-toggle-button-renderer yt-icon {
   filter: invert(1);
}
html[dark] ytd-thumbnail-overlay-toggle-button-renderer {
   opacity: 0.8;
   border-color: #000 !important;
   background: #000 !important;
   filter: invert(0)
}
html[dark] ytd-thumbnail-overlay-toggle-button-renderer:hover {
   background: #222 !important;
   filter: invert(1) contrast(1);
   opacity: 1;
}
ytd-thumbnail-overlay-toggle-button-renderer yt-icon {
   color: transparent !important;
   box-shadow: none !important;
   background: no-repeat url("https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflHFLZLR.webp") -239px -48px;
   background-size: auto;
   width: 13px;
   height: 13px;
   opacity: 1 !important;
}
.banner-visible-area.ytd-c4-tabbed-header-renderer {
   height: 175px !important;
}
#banner-editor {
   display: block;
   height: 209.199px;
   position: relative;
}
#subtitle.ytd-shelf-renderer {
   line-height: normal !important;
   font-size: 12px !important;
}
[page-subtype=playlist] ytd-section-list-renderer,
ytd-thumbnail #thumbnail.ytd-thumbnail {
   padding: 0 !important;
}
ytd-video-renderer:not([use-prominent-thumbs]) ytd-thumbnail.ytd-video-renderer {
   max-width: 246px !important;
   margin-right: 10px !important;
}
.text-wrapper.ytd-video-renderer {
   position: relative !important;
   top: -5px !important;
}
h3.ytd-grid-playlist-renderer {
   margin: 5px 0 1px !important;
}
#avatar.ytd-channel-renderer,
#avatar.ytd-channel-renderer img.yt-img-shadow,
yt-img-shadow.ytd-channel-renderer,
ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer,
ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer .channel-link.ytd-channel-renderer {
   height: 110px !important;
   width: 110px !important;
}
ytd-search ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer {
   max-width: 120px;
   min-width: 110px;
}
ytd-channel-renderer[use-prominent-thumbs] #info-section.ytd-channel-renderer {
   position: relative;
   left: -20px !important;
   top: -15px !important;
}
#metadata.ytd-channel-renderer,
ytd-backstage-post-thread-renderer {
   margin-bottom: 0 !important;
}
ytd-section-list-renderer:not([hide-bottom-separator]):not([page-subtype=history]):not([page-subtype=memberships-and-purchases]):not([page-subtype=ypc-offers]) #contents.ytd-section-list-renderer > .ytd-section-list-renderer:not(:last-child):not(ytd-page-introduction-renderer):not([item-dismissed]).ytd-section-list-renderer:not([has-destination-shelf-renderer]).ytd-section-list-renderer:not(ytd-minor-moment-header-renderer) {
   border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important;
}
#channel-info.ytd-grid-channel-renderer yt-img-shadow.ytd-grid-channel-renderer,
ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer {
   border-radius: 0 !important;
}
#channel.ytd-grid-channel-renderer #subscribe.ytd-grid-channel-renderer {
   margin-top: 30px !important;
   margin-left: -116px;
}
html[dark] #banner-top-options {
   height: 55px;
   width: 1260px;
   background: #212121;
   border: 1px solid #51515151;
}
#banner-top-options {
   height: 55px;
   width: 1262px;
   background: #fff;
   border: 1px solid #e5e5e5;
}
@media (max-width: 1800px) {
   #banner-top-options {
      width: 1262px !important;
   }
   #subscriber-count.ytd-c4-tabbed-header-renderer::before {
      left: -1210px !important;
   }
}
ytd-channel-avatar-editor {
   top: -191px !important;
}
@media (max-width:1600px) {
   ytd-channel-avatar-editor {
      top: -158px !important;
   }
}
yt-img-shadow.ytd-channel-avatar-editor,
yt-img-shadow.ytd-channel-avatar-editor img.yt-img-shadow,
ytd-channel-avatar-editor,
ytd-channel-avatar-editor .yt-simple-endpoint {
   width: 100px !important;
   height: 100px !important;
}
yt-icon.ytd-channel-avatar-editor,
yt-icon.ytd-channel-banner-editor-renderer {
   border-radius: 0 !important;
   height: 30px !important;
   width: 30px !important;
   padding: 0 !important;
   position: absolute;
   left: 68px !important;
   top: 0 !important;
   background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAP1BMVEX///////////////91dXX8/Pz29vbLy8uBgYGwsLChoaGFhYV2dnbg4ODb29vR0dHQ0NDExcTr6+u6urqPj4/hUtpaAAAAA3RSTlP99Ppq0hvmAAAAhElEQVQoz82S3QqAIAyFT+aysv96/2ctJVprIQRdePBGPr6xjaFMJhsMogRGifvXpIvjFVdrn8KN9ZMsDsLl9pPvvLABrtzaedgc4/CYNtbW80KPwdg9sNNz43SPOFKDAdplzG4XXQ53LlzdmnIhsHYFHseBJPrvWowxRUxYc0xWh/wZ74W1C6tF55PLAAAAAElFTkSuQmCC');
   fill: transparent;
   border: 1px solid #e5e5e5 !important;
}
html[dark] yt-icon.ytd-channel-avatar-editor,
html[dark] yt-icon.ytd-channel-banner-editor-renderer {
   background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAP1BMVEX///////////////91dXX8/Pz29vbLy8uBgYGwsLChoaGFhYV2dnbg4ODb29vR0dHQ0NDExcTr6+u6urqPj4/hUtpaAAAAA3RSTlP99Ppq0hvmAAAAhElEQVQoz82S3QqAIAyFT+aysv96/2ctJVprIQRdePBGPr6xjaFMJhsMogRGifvXpIvjFVdrn8KN9ZMsDsLl9pPvvLABrtzaedgc4/CYNtbW80KPwdg9sNNz43SPOFKDAdplzG4XXQ53LlzdmnIhsHYFHseBJPrvWowxRUxYc0xWh/wZ74W1C6tF55PLAAAAAElFTkSuQmCC');
   filter: invert(0.8);
}
yt-icon.ytd-channel-banner-editor-renderer {
   position: relative;
   left: auto !important;
   float: right !important;
   right: 0!important;
}
#subscriber-count.ytd-c4-tabbed-header-renderer::before {
   content: attr(aria-label);
   position: absolute;
   top: -280px;
   left: -1210px;
   width: 130px !important;
}
ytd-button-renderer.style-primary:nth-of-type(2) {
   top: -280px !important;
   left: -960px !important;
   position: relative;
   background-color: transparent !important;
}
ytd-comments ytd-button-renderer.style-primary:nth-of-type(2) {
   position: static;
}
#header.ytd-browse ytd-button-renderer #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   left: auto !important;
   top: auto !important;
   font-size: 0 !important;
   overflow: hidden !important;
   color: #737373 !important;
}
#info #menu ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   color: #000;
}
#contentContainer.tp-yt-app-header ytd-button-renderer:nth-of-type(2) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer:hover {
   text-decoration: underline;
}
#contentContainer.tp-yt-app-header ytd-button-renderer:nth-of-type(2) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer::after {
   content: "Video Manager";
   font-size: 11px !important;
   margin-left: 5px !important;
}
#contentContainer.tp-yt-app-header ytd-button-renderer:nth-of-type(2) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer::before {
   content: "";
   background: url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png)no-repeat -253px -342px;
   width: 10px;
   height: 11px;
   top: 2px !important;
   position: relative;
   display: inline-block;
}
html[dark] #subscriber-count.ytd-c4-tabbed-header-renderer::before {
   filter: invert(1);
}
#header.ytd-browse ytd-button-renderer:nth-of-type(1) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   font-size: 0 !important;
   color: #fff !important;
   filter: invert(0);
   position: absolute;
   left: 34px !important;
   top: -4px !important;
}
#header.ytd-browse ytd-button-renderer:nth-of-type(1) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer::after {
   font-size: 12px !important;
   color: #fff !important;
   content: "Subscribe";
   line-height: 24px !important;
   width: 63px !important;
   filter: invert(0);
   display: inline-block;
   background-color: #e99482 !important;
}
#header.ytd-browse ytd-button-renderer:nth-of-type(1) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer::before {
   content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMAgMAAAAWidUSAAAADFBMVEX////plIL3xcL1s68V8u6TAAAAGElEQVQI12NAB2wggvUAiAiAEwfAEugAAEK8AkG61muDAAAAAElFTkSuQmCC');
   filter: brightness(1);
   top: 2px !important;
   left: 2px !important;
   position: relative;
   border-radius: 2px !important;
   background-color: #e99482 !important;
   line-height: 36px !important;
   height: 24px;
   width: 27px !important;
   display: inline-block;
}
#header.ytd-browse ytd-button-renderer:nth-of-type(1) #button.ytd-button-renderer,
ytd-button-renderer.style-primary:nth-of-type(1) {
   background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAMFBMVEUAAABnZ2hnZ2dpaWloaGhnZ2dnZ2dsbGxnZ2dpaGh5eXdmZma6pJpmZmZmZmZpa2vKDH3GAAAADnRSTlMAkOLPvKZid4BRGTcM8Jbx1VoAAACHSURBVAjXYwAC9nfvChgggPXduwAok/ndOwMww2RW3Lt3X1e6MDCwvYOCBIa1MKYOgxyQNBQCEi8Y8t+9e8gAEvjJwK0H0s707tEGBoa+dwIMDIzvnjMgMYEK3itAFCC0fWPoA5qjCDHsEJD89x5kBbLFDC6z4t+9+7jSBe5ITKez//8P8hAAJWxgShrD7JcAAAAASUVORK5CYII=')no-repeat!important;
   border: 0 !important;
   height: 20px;
   width: 20px !important;
}
#edit-buttons {
   position: relative;
   left: 27px;
}
.subheadline.ytd-channel-about-metadata-renderer {
   margin: 15px 0 5px !important;
   font-weight: 500 !important;
   font-size: 13px !important;
   color: #555 !important;
}
#bio.ytd-channel-about-metadata-renderer,
#description.ytd-channel-about-metadata-renderer {
   font-size: 13px !important;
   color: #555 !important;
   line-height: 1.3em !important;
}
#action-buttons.ytd-channel-about-metadata-renderer,
#primary-items.ytd-channel-sub-menu-renderer #label-icon.yt-dropdown-menu,
#right-column.ytd-channel-about-metadata-renderer .subheadline.ytd-channel-about-metadata-renderer {
   display: none !important;
}
#details-container.ytd-channel-about-metadata-renderer tr.ytd-channel-about-metadata-renderer:nth-of-type(1) {
   display: none !important;
}
#right-column.ytd-channel-about-metadata-renderer > yt-formatted-string.ytd-channel-about-metadata-renderer {
   border: 0 !important;
   padding: 0 !important;
}
#description-container .subheadline.ytd-channel-about-metadata-renderer {
   margin: 72px 0 24px !important;
}
#right-column.ytd-channel-about-metadata-renderer {
   display: flex;
   flex-direction: column;
   left: -850px !important;
   position: relative;
   max-height: 200px;
}
#right-column.ytd-channel-about-metadata-renderer .style-scope.ytd-channel-about-metadata-renderer:nth-of-type(2) {
   order: 2;
   font-size: 13px;
   color: #555;
}
#right-column.ytd-channel-about-metadata-renderer .style-scope.ytd-channel-about-metadata-renderer:nth-of-type(3) {
   font-size: 13px;
   color: #555;
   font-weight: 500 !important;
}
.deemphasize.yt-formatted-string {
   font-size: 13px;
   color: #555 !important;
   font-weight: 500 !important;
}
ytd-app #details-container.ytd-channel-about-metadata-renderer .subheadline.ytd-channel-about-metadata-renderer {
   margin: 15px 0 0 !important;
}
#details-container.ytd-channel-about-metadata-renderer tr.ytd-channel-about-metadata-renderer {
   height: 34px !important;
}
#details-container.ytd-channel-about-metadata-renderer table.ytd-channel-about-metadata-renderer {
   left: -2px !important;
   position: relative !important;
}
ytd-app #details-container.ytd-channel-about-metadata-renderer {
   padding-bottom: 10px !important;
}
ytd-browse[page-subtype~=channels] ytd-two-column-browse-results-renderer.ytd-browse {
   min-height: auto !important;
   overflow: hidden !important;
}
@media (max-width: 1599px) {
   #right-column.ytd-channel-about-metadata-renderer {
      left: -714px !important;
   }
}
#link-list-container.ytd-channel-about-metadata-renderer a.yt-simple-endpoint.ytd-channel-about-metadata-renderer {
   color: #167ac6 !important;
   cursor: pointer !important;
   font-weight: 500 !important;
   margin-bottom: 5px !important;
}
[page-subtype=channels] ytd-section-list-renderer #header-container {
   margin-bottom: 10px;
}
[page-subtype=channels] ytd-section-list-renderer #header-container ytd-channel-sub-menu-renderer {
   border-bottom: 1px solid #e2e2e2;
   padding-bottom: 2px;
}
html[dark] #meta .ytd-video-secondary-info-renderer tp-yt-paper-button.ytd-expander,
html[dark] [page-subtype=channels] ytd-section-list-renderer #header-container ytd-channel-sub-menu-renderer {
   border-color: var(--yt-spec-10-percent-layer);
}
ytd-channel-sub-menu-renderer {
   margin: 0 !important;
   height: 48px !important;
}
[page-subtype=channels] yt-dropdown-menu.has-items #label-text.yt-dropdown-menu,
[page-subtype=channels] ytd-channel-sub-menu-renderer #icon-label.yt-dropdown-menu {
   color: #333;
   font-size: 11px !important;
   font-weight: 500 !important;
   border: 1px solid #d3d3d3;
   background: #f8f8f8;
   line-height: 28px !important;
   padding: 0 10px !important;
   border-radius: 2px !important;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05) !important;
}
[page-subtype=channels] yt-dropdown-menu.has-items #label-text.yt-dropdown-menu::after,
[page-subtype=channels] ytd-channel-sub-menu-renderer #icon-label.yt-dropdown-menu::after {
   content: "";
   margin-top: -3px;
   margin-left: 5px;
   border: 1px solid transparent;
   border-top-color: #333;
   border-width: 4px 4px 0;
   width: 0;
   height: 0;
   top: 7px !important;
   position: relative;
}
[page-subtype=channels] ytd-channel-sub-menu-renderer #icon-label.yt-dropdown-menu {
   color: #333 !important;
   text-transform: none;
}
html[dark] [page-subtype=channels] yt-dropdown-menu.has-items #icon-label.yt-dropdown-menu,
html[dark] [page-subtype=channels] yt-dropdown-menu.has-items #label-text.yt-dropdown-menu {
   color: #fff !important;
   background: #1c1c1c !important;
   border-color: #333 !important;
}
html[dark] [page-subtype=channels] yt-dropdown-menu.has-items #icon-label.yt-dropdown-menu:hover,
html[dark] [page-subtype=channels] yt-dropdown-menu.has-items #label-text.yt-dropdown-menu:hover {
   border-color: #3c3c3c !important;
   box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
   background-color: #444 !important;
}
html[dark] [page-subtype=channels] yt-dropdown-menu.has-items #icon-label.yt-dropdown-menu::after,
html[dark] [page-subtype=channels] yt-dropdown-menu.has-items #label-text.yt-dropdown-menu::after {
   border-top-color: #fff;
}
[page-subtype=channels] yt-dropdown-menu:not(.has-items) #label-text.yt-dropdown-menu {
   font-weight: 500 !important;
   color: #333 !important;
   font-size: 15px !important;
}
[page-subtype=playlist] {
   margin: 0;
   left: 0;
   padding: 0;
}
ytd-browse ytd-playlist-sidebar-renderer.ytd-browse {
   position: relative;
   left: 0 !important;
   right: 0;
   padding: 15px;
   height: auto;
   width: 100%;
   max-width: 1262px;
   background: #fff;
   margin: 40px auto 0;
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
   min-height: 144px;
   overflow: visible;
}
html[dark] ytd-browse ytd-playlist-sidebar-renderer.ytd-browse {
   background: #212121 !important;
}
ytd-playlist-sidebar-primary-info-renderer[responsive] ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer,
ytd-playlist-sidebar-primary-info-renderer[responsive] ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer img {
   width: 224px !important;
   height: 114px !important;
   margin: 0 !important;
   position: absolute !important;
}
ytd-playlist-sidebar-primary-info-renderer[responsive] ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer #overlays {
   display: none;
}
#menu.ytd-playlist-sidebar-primary-info-renderer,
#play-buttons.ytd-playlist-sidebar-primary-info-renderer,
#privacy-stats.ytd-playlist-sidebar-primary-info-renderer,
#stats.ytd-playlist-sidebar-primary-info-renderer,
#title.ytd-playlist-sidebar-primary-info-renderer,
ytd-expander.ytd-playlist-sidebar-primary-info-renderer,
ytd-inline-form-renderer#title-form.ytd-playlist-sidebar-primary-info-renderer {
   display: block !important;
   margin-left: 234px !important;
   margin-bottom: 0 !important;
}
#items.ytd-playlist-sidebar-renderer > .ytd-playlist-sidebar-renderer:not(:last-child) {
   border-bottom: 0 !important;
   width: 100%;
}
#title.ytd-playlist-sidebar-primary-info-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {
   color: #333 !important;
   font-size: 20px;
   font-weight: 500;
   line-height: 33px;
}
html[dark] #title.ytd-playlist-sidebar-primary-info-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string,
html[dark] [page-subtype=playlist] #video-title.ytd-playlist-video-renderer {
   color: #fff !important;
}
#stats.ytd-playlist-sidebar-primary-info-renderer {
   color: #767676;
   margin-top: 0;
   font-size: 12px !important;
   line-height: 1;
}
ytd-expander.ytd-playlist-sidebar-primary-info-renderer #description {
   color: #767676;
   margin-top: 0;
   font-size: 12px !important;
   line-height: 1;
   margin-bottom: 0;
}
ytd-playlist-sidebar-secondary-info-renderer {
   padding: 0 !important;
   position: fixed;
   top: 50px;
   background: #fff;
   width: calc(100% - 232px);
   left: 231px;
   border-bottom: 1px solid #e8e8e8;
   z-index: 1024;
}
html[dark] ytd-playlist-sidebar-secondary-info-renderer {
   background: #212121 !important;
   border-bottom-color: rgba(255, 255, 255, 0.1);
}
[mini-guide-visible] ytd-playlist-sidebar-secondary-info-renderer {
   left: 73px;
   width: calc(100% - 73px);
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer {
   margin-bottom: 0 !important;
   margin-top: 2px;
   padding-right: 20px;
   padding-left: 10px;
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer #avatar.ytd-video-owner-renderer,
#owner-container.ytd-playlist-sidebar-secondary-info-renderer #avatar.ytd-video-owner-renderer img {
   width: 36px !important;
   height: 36px !important;
}
ytd-browse[page-subtype=show][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse,
ytd-browse[responsive-playlist][page-subtype=playlist][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse {
   padding: 0 !important;
   width: 1262px;
   margin: 0 auto;
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
   margin-top: 0 !important;
}
[page-subtype=playlist] ytd-playlist-video-renderer:hover:not(.dragging) {
   background: 0 0;
}
[page-subtype=playlist] ytd-playlist-video-renderer {
   border-bottom: 1px solid #e2e2e2;
}
[page-subtype=playlist] #content.ytd-playlist-video-renderer {
   border: 0;
   padding: 15px 0;
}
/*
[page-subtype=playlist] ytd-thumbnail.ytd-playlist-video-renderer,
ytd-thumbnail.ytd-playlist-video-renderer img {
  height: 40.5px;
  width: 72px;
}
*/
/*
[page-subtype=channels] ytd-comments-header-renderer,
[page-subtype=playlist] #text.ytd-alert-with-button-renderer {
  display: none !important;
}
 */
[page-subtype=playlist] #dismiss-button,
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer button {
   display: none;
}
[page-subtype=playlist] #video-title.ytd-playlist-video-renderer {
   color: #333;
   display: inline-block;
   font-size: 13px;
   font-weight: 500;
   line-height: 1.1;
}
[page-subtype=playlist] ytd-playlist-video-renderer:hover #content.ytd-playlist-video-renderer {
   border: 0;
}
[page-subtype=playlist] ytd-video-meta-block:not([rich-meta]) #byline-container.ytd-video-meta-block {
   font: 12px roboto;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer a {
   display: inline-block;
   height: 28px;
   border: solid 1px #d3d3d3;
   padding: 0 10px;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
   background: #f8f8f8;
   color: #333;
   margin-right: 10px;
   margin-top: 10px;
   margin-bottom: 10px;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer a:hover,
ytd-playlist-sidebar-primary-info-renderer:hover #edit-button yt-icon-button:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer a:active,
ytd-playlist-sidebar-primary-info-renderer:hover #edit-button yt-icon-button:active {
   border-color: #c6c6c6;
   background: #e9e9e9;
   box-shadow: inset 0 1px 0#ddd;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer #button.ytd-toggle-button-renderer,
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer yt-icon-button.ytd-button-renderer {
   padding: 0;
   width: 13px;
   height: 13px;
   vertical-align: middle;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -812px -38px;
   opacity: 0.5;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer.style-text yt-icon-button.ytd-button-renderer {
   background-position: -750px -19px;
   width: 13px;
   height: 17px;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer:nth-child(3) yt-icon-button.ytd-button-renderer {
   background-position: -746px -109px;
   width: 10px;
   height: 17px;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer.style-text a::after {
   content: "Shuffle";
}
[page-subtype=playlist] #top-level-buttons-computed ytd-toggle-button-renderer.ytd-menu-renderer a::after {
   content: "Save" !important;
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer:nth-child(3) a::after {
   content: "Share";
}
[page-subtype=playlist] #top-level-buttons-computed .ytd-menu-renderer a::after {
   display: inline-block;
   font: 500 11px roboto;
   color: #333;
   line-height: 28px;
   margin-left: 5px;
}
[page-subtype=playlist] #top-level-buttons-computed.ytd-menu-renderer:not(:empty) + #button.ytd-menu-renderer {
   margin-top: 12px;
}
.more-button.ytd-playlist-sidebar-primary-info-renderer {
   margin: 5px 0 0;
   color: #167ac6 !important;
   text-transform: none;
}
yt-img-shadow.ytd-playlist-video-thumbnail-renderer {
   transform: none !important;
   top: 0 !important;
}
ytd-playlist-sidebar-renderer[standardized-themed-scrollbar] {
   overflow-y: visible;
}
@media (max-width: 1600px) {
   ytd-browse ytd-playlist-sidebar-renderer.ytd-browse,
   ytd-browse[page-subtype=show][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse,
   ytd-browse[responsive-playlist][page-subtype=playlist][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse {
      width: 1056px !important;
   }
}
@media (max-width: 1160px) {
   ytd-browse ytd-playlist-sidebar-renderer.ytd-browse,
   ytd-browse[page-subtype=show][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse,
   ytd-browse[responsive-playlist][page-subtype=playlist][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse {
      width: 800px !important;
   }
}
#content-attachment.ytd-backstage-post-renderer,
#content-attachment.ytd-backstage-post-renderer img.yt-img-shadow {
   max-width: 75%;
   max-height: 420px !important;
   border-radius: 0 !important;
   float: left;
}
#author-thumbnail.ytd-backstage-post-renderer,
#author-thumbnail.ytd-backstage-post-renderer img.yt-img-shadow {
   height: 48px !important;
   width: 48px !important;
   left: -6px !important;
   overflow: visible;
   position: relative;
}
#author-thumbnail.ytd-backstage-post-renderer yt-img-shadow.ytd-backstage-post-renderer {
   height: 48px !important;
   width: 48px !important;
   left: -6px !important;
   position: relative;
   overflow: visible !important;
}
#author-text.yt-simple-endpoint.ytd-backstage-post-renderer {
   color: #128ee9 !important;
   font-weight: 500 !important;
   text-decoration: none !important;
}
html:not([dark]) ytd-app yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {
   color: #767676;
}
#published-time-text.ytd-backstage-post-renderer {
   color: #767676 !important;
   font-size: 11px !important;
}
#published-time-text.ytd-backstage-post-renderer:hover {
   color: #767676 !important;
}
html:not([dark]) yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover,
html:not([dark]) ytd-app #metadata-line.ytd-video-meta-block span.ytd-video-meta-block {
   color: #767676 !important;
}
#main.ytd-backstage-post-renderer {
   left: -4px !important;
   position: relative;
   top: -4px !important;
}
#content-text.ytd-backstage-post-renderer {
   color: #000 !important;
   line-height: normal !important;
}
.less-button.ytd-backstage-post-renderer,
.more-button.ytd-backstage-post-renderer {
   color: #167ac6 !important;
   font-weight: normal !important;
   font-size: 12px !important;
}
#reply-button-end #button.size-default.style-default.ytd-button-renderer.style-scope,
.badge-style-type-members-only.ytd-badge-supported-renderer {
   display: none !important;
}
[page-subtype=channels] ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer {
   font-size: 0 !important;
}
[page-subtype=channels] ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer::after {
   content: "Comment •";
   font-size: 13px !important;
   color: #555 !important;
   font-weight: normal !important;
   letter-spacing: 0 !important;
   opacity: 0.75 !important;
   top: 2px !important;
   position: relative;
}
#content-attachment.ytd-backstage-post-renderer ytd-playlist-renderer.ytd-backstage-post-renderer,
#content-attachment.ytd-backstage-post-renderer ytd-video-renderer.ytd-backstage-post-renderer {
   background: 0 0 !important;
   border: 1px solid #ddd !important;
}
ytd-app ytd-video-renderer[is-backstage-video] img.yt-img-shadow {
   max-width: 100% !important;
}
[page-subtype=channels] .text-wrapper.ytd-video-renderer {
   top: 0 !important;
}
#content-attachment #metadata.ytd-video-meta-block {
   flex-direction: column !important;
}
ytd-video-meta-block:not([rich-meta]) #metadata-line.ytd-video-meta-block {
   flex-direction: row !important;
}
#content-attachment #separator.ytd-video-meta-block,
[page-subtype=history] yt-icon-button.dropdown-trigger {
   display: none !important;
}
#content-attachment #description-text.ytd-video-renderer {
   padding-top: 0 !important;
}
ytd-video-renderer[is-backstage-video] #video-title.ytd-video-renderer {
   color: #333 !important;
}
tp-yt-paper-listbox tp-yt-paper-item yt-icon {
   display: block !important;
}
yt-icon.checked.ytd-backstage-poll-renderer {
   color: transparent !important;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -171px 1px;
   background-size: auto;
   width: 12px;
   height: 12px;
}
yt-icon.ytd-backstage-poll-renderer {
   padding: 0 !important;
}
.progress-bar.style-scope.ytd-backstage-poll-renderer {
   height: 24px !important;
}
.choice-info.style-scope.ytd-backstage-poll-renderer,
.vote-choice.ytd-backstage-poll-renderer {
   height: 24px !important;
}
.text-area.ytd-backstage-poll-renderer,
ytd-compact-link-renderer[compact-link-style=compact-link-style-type-history-my-activity-link] {
   margin: 0 !important;
}
ytd-backstage-poll-renderer:not([is-image-poll]) tp-yt-paper-item.ytd-backstage-poll-renderer[selected] .choice-info.ytd-backstage-poll-renderer,
ytd-backstage-poll-renderer:not([is-image-poll]) tp-yt-paper-item.ytd-backstage-poll-renderer[show-percentage] .choice-info.ytd-backstage-poll-renderer {
   border: 0 !important;
}
tp-yt-paper-item.ytd-backstage-poll-renderer[selected] .progress-bar.ytd-backstage-poll-renderer {
   background-color: #def0ff !important;
}
tp-yt-paper-item.ytd-backstage-poll-renderer:not([selected]) .progress-bar.ytd-backstage-poll-renderer {
   background-color: transparent !important;
}
.choice-text.ytd-backstage-poll-renderer {
   font-size: 11px !important;
   font-weight: 500 !important;
   line-height: 24px !important;
   margin: 0 0 0 32px !important;
}
.vote-percentage.ytd-backstage-poll-renderer {
   line-height: 24px !important;
   position: absolute !important;
}
tp-yt-paper-item.ytd-backstage-poll-renderer[selected] .choice-text.ytd-backstage-poll-renderer {
   color: #128ee9 !important;
}
.vote-choice.ytd-backstage-poll-renderer {
   width: 437px !important;
   left: 10px !important;
}
tp-yt-paper-item.ytd-backstage-poll-renderer[selected] .vote-percentage.ytd-backstage-poll-renderer {
   color: #128ee9 !important;
   font-size: 11px !important;
   font-weight: 500 !important;
   left: -30px !important;
}
.check-icons.ytd-backstage-poll-renderer {
   height: 14px !important;
   min-width: 14px !important;
   background: #fff;
   left: 21px;
   z-index: 1;
   border-radius: 14px;
}
#poll-votes.ytd-backstage-poll-renderer {
   left: 25px !important;
   padding: 0 !important;
   position: relative;
}
tp-yt-paper-item.ytd-backstage-poll-renderer:not([selected]) .vote-percentage.ytd-backstage-poll-renderer {
   color: #000 !important;
   font-size: 11px !important;
   font-weight: 500 !important;
   left: -30px !important;
}
tp-yt-paper-item.ytd-backstage-poll-renderer:not([selected]) yt-icon.ytd-backstage-poll-renderer {
   color: transparent !important;
   border-radius: 12px;
   border-color: #767676;
   border-style: solid;
   border-width: 1px;
   height: 12px !important;
   width: 12px !important;
}
#sign-in.yt-simple-endpoint.ytd-backstage-poll-renderer {
   padding-bottom: 3px !important;
   height: 24px !important;
}
ytd-backstage-poll-renderer:not([is-image-poll]) .choice-info.ytd-backstage-poll-renderer {
   border: 0 !important;
}
#vote-info.ytd-backstage-poll-renderer {
   display: none !important;
}
html:not([dark]) tp-yt-iron-overlay-backdrop {
   background: rgba(255, 255, 255, 0.8) !important;
}
ytd-app ytd-add-to-playlist-renderer[dialog] {
   background: #fff;
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}
ytd-app #title.ytd-add-to-playlist-renderer {
   padding: 6px 8px;
   font-size: 13px;
   font-weight: 500;
}
ytd-app #checkbox.tp-yt-paper-checkbox {
   border: 1px solid #ddd;
   border-radius: 0;
   height: 18px;
   width: 18px;
}
#checkbox.tp-yt-paper-checkbox:active,
ytd-app #checkbox.checked.tp-yt-paper-checkbox {
   border: 1px solid #1c62b9;
   background: 0 0;
   color: #1c62b9;
   fill: #1c62b9;
}
ytd-app #checkbox.checked.tp-yt-paper-checkbox #checkmark.tp-yt-paper-checkbox {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflgGT3Hj.png) 0 -42px;
   background-size: auto;
   width: 14px;
   height: 14px;
   animation: none;
   rotate: none;
   border: 0;
}
ytd-app #checkboxLabel.tp-yt-paper-checkbox {
   padding-left: 5px;
}
ytd-app #playlists.ytd-add-to-playlist-renderer {
   padding: 6px 8px;
}
ytd-app ytd-add-to-playlist-renderer[increased-tap-target] #playlists.ytd-add-to-playlist-renderer > .ytd-add-to-playlist-renderer:not(:last-child) {
   margin-bottom: 5px;
}
ytd-app yt-share-target-renderer yt-icon.yt-share-target-renderer {
   --iron-icon-height: 32px;
   --iron-icon-width: 32px;
   margin: 0;
}
ytd-app #title.yt-share-target-renderer {
   width: 36px;
}
#bar.yt-copy-link-renderer {
   background-color: var(--ytd-searchbox-background);
   border: 1px solid var(--ytd-searchbox-legacy-border-color);
}
#edit-button yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-watchedit-vflxUZcSA.png) 0 -113px;
   background-size: auto;
   width: 24px;
   height: 24px;
   fill: none;
   filter: invert(1);
   opacity: 0.5;
}
#edit-button yt-icon-button {
   height: 28px;
   padding: 0;
   width: 36px;
   border: 1px solid transparent;
}
ytd-playlist-sidebar-primary-info-renderer:hover #edit-button yt-icon-button {
   border: solid 1px #d3d3d3;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
   background: #f8f8f8;
}
ytd-inline-form-renderer[component-style=INLINE_FORM_STYLE_BODY_TEXT_PLACEHOLDER] #edit-button.ytd-inline-form-renderer {
   margin-top: 0 !important;
}
.ytd-privacy-dropdown-item-renderer yt-icon {
   background: url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflsrtxCf.webp) -28px -1264px;
   fill: none;
   width: 18px;
   height: 18px;
}
ytd-privacy-dropdown-item-renderer:nth-child(2) yt-icon {
   background-position: 0 -261px;
}
ytd-privacy-dropdown-item-renderer:nth-child(3) yt-icon {
   background-position: -28px -642px;
}
ytd-app ytd-playlist-sidebar-primary-info-renderer #save-button {
   position: static;
   background-color: #167ac6;
   border: solid 1px #167ac6;
   color: #fff;
   padding: 0;
   height: 26px;
   margin-left: 5px;
   border-radius: 2px;
   margin-right: 0 !important;
   box-shadow: 0 1px 0 rgb(0 0 0/5%) !important;
}
ytd-app ytd-playlist-sidebar-primary-info-renderer #save-button:hover {
   background: #126db3 !important;
}
ytd-app ytd-playlist-sidebar-primary-info-renderer #save-button:active {
   background: #095b99 !important;
   box-shadow: inset 0 1px 0 rgb(0 0 0/50%) !important;
}
ytd-app ytd-playlist-sidebar-primary-info-renderer #save-button tp-yt-paper-button {
   padding: 0;
   width: max-content;
   line-height: 26px;
}
ytd-app ytd-playlist-sidebar-primary-info-renderer #edit-buttons {
   left: 0;
}
.badge.ytd-badge-supported-renderer:not(.badge-style-type-verified):not(.badge-style-type-collection):not(.badge-style-type-verified-artist) {
   background: 0 0;
   border: 1px solid #ddd;
   padding: 0 4px;
   height: 14px;
}
html[dark] .badge.ytd-badge-supported-renderer:not(.badge-style-type-verified):not(.badge-style-type-collection):not(.badge-style-type-verified-artist) {
   border-color: #444;
}
.badge.ytd-badge-supported-renderer span {
   text-transform: uppercase;
   font: 11px roboto;
}
.badge-style-type-live-now.ytd-badge-supported-renderer:not(.badge-style-type-verified) {
   border-color: #b91f1f !important;
   color: #b91f1f;
}
ytd-expander.ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer ytd-metadata-row-header-renderer {
   padding: 0;
}
.super-title.ytd-video-primary-info-renderer a.yt-simple-endpoint.yt-formatted-string {
   color: #000 !important;
   background-color: #f1f1f1;
   border-radius: 2px;
   padding: 0 4px;
   margin-right: 6px;
}
#info #menu ytd-button-renderer yt-formatted-string.ytd-button-renderer,
#info ytd-toggle-button-renderer.style-default-active a #text,
#info ytd-toggle-button-renderer.style-text[is-icon-button] #text.ytd-toggle-button-renderer {
   font-size: 11px !important;
}
ytd-button-renderer.ytd-item-section-renderer,
ytd-compact-movie-renderer.ytd-item-section-renderer,
ytd-compact-playlist-renderer.ytd-item-section-renderer,
ytd-compact-radio-renderer.ytd-item-section-renderer,
ytd-compact-video-renderer.ytd-item-section-renderer,
ytd-emergency-onebox-renderer.ytd-item-section-renderer,
ytd-movie-renderer.ytd-item-section-renderer,
ytd-playlist-renderer.ytd-item-section-renderer,
ytd-radio-renderer.ytd-item-section-renderer,
ytd-show-renderer.ytd-item-section-renderer {
   margin-top: 15px !important;
}
ytd-button-renderer.ytd-item-section-renderer:first-child,
ytd-compact-movie-renderer.ytd-item-section-renderer:first-child,
ytd-compact-playlist-renderer.ytd-item-section-renderer:first-child,
ytd-compact-radio-renderer.ytd-item-section-renderer:first-child,
ytd-emergency-onebox-renderer.ytd-item-section-renderer:first-child,
ytd-movie-renderer.ytd-item-section-renderer:first-child,
ytd-playlist-renderer.ytd-item-section-renderer:first-child,
ytd-radio-renderer.ytd-item-section-renderer:first-child,
ytd-show-renderer.ytd-item-section-renderer:first-child {
   margin-top: 0 !important;
}
ytd-playlist-panel-renderer[collapsible] .title.ytd-playlist-panel-renderer {
   color: #fff !important;
   font-size: 15px !important;
   font-weight: normal !important;
}
ytd-settings-sidebar-renderer #label {
   font: normal 13px roboto !important;
   line-height: 20px !important;
   color: #222;
}
html[dark] ytd-settings-sidebar-renderer #label,
html[dark] ytd-browse #title.ytd-settings-sidebar-renderer {
   color: var(--yt-spec-text-primary);
}
ytd-settings-sidebar-renderer ytd-compact-link-renderer[compact-link-style] tp-yt-paper-item.ytd-compact-link-renderer {
   padding: 0 6px;
   height: 28px !important;
}
ytd-browse ytd-settings-sidebar-renderer,
ytd-settings-sidebar-renderer {
   width: 186px;
   background: var(--yt-spec-brand-background-solid);
   padding: 0 22px;
   box-sizing: content-box;
   border-right: 1px solid #e8e8e8;
   margin-top: -14px;
}
html[dark] ytd-browse ytd-settings-sidebar-renderer,
html[dark] ytd-settings-sidebar-renderer {
   border-right: none;
}
ytd-browse #title.ytd-settings-sidebar-renderer {
   padding: 5px 0 12px;
   font-size: 16px;
   color: #222;
   text-transform: none;
}
ytd-compact-link-renderer[compact-link-style="compact-link-style-type-settings-sidebar"][active] #label.ytd-compact-link-renderer {
   font-weight: 500 !important;
}
html:not([dark]) #meta #top-row ytd-video-owner-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {
   color: #111 !important;
}
#meta .ytd-video-secondary-info-renderer tp-yt-paper-button.ytd-expander {
   width: 100%;
   border-top: 1px solid #e2e2e2;
   padding-top: 2px;
   margin-bottom: 0 !important;
   border-radius: 0;
   margin-top: 15px !important;
   height: 28px;
}
#meta .ytd-video-secondary-info-renderer tp-yt-paper-button.ytd-expander:hover yt-formatted-string {
   color: #222;
}
[page-subtype=history] #header-container,
[page-subtype=history] #title.ytd-sub-feed-selector-renderer {
   display: none;
}
a.yt-simple-endpoint.ytd-sub-feed-option-renderer {
   flex: none;
}
ytd-sub-feed-option-renderer.ytd-sub-feed-selector-renderer {
   display: inline-block;
   padding: 0 !important;
   border: 0 !important;
}
ytd-app ytd-two-column-browse-results-renderer[page-subtype=history] #secondary.ytd-two-column-browse-results-renderer {
   background: 0 0;
   position: absolute;
   left: 0;
   max-height: 102px !important;
}
ytd-two-column-browse-results-renderer[page-subtype=history] {
   position: relative;
   margin-top: 0 !important;
}
ytd-two-column-browse-results-renderer[page-subtype=history][has-secondary-column-data] #primary.ytd-two-column-browse-results-renderer {
   padding: 80px 0 0 !important;
}
[page-subtype=history] ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer {
   padding: 0 !important;
   margin: 0;
   width: 100% !important;
}
[page-subtype=history] ytd-search-box-renderer {
   margin: 0 5px 0 0;
   display: block;
   width: 200px;
   right: 0;
   left: auto;
   position: absolute;
}
[page-subtype=history] ytd-sub-feed-selector-renderer {
   padding: 10px 20px 0;
   border-bottom: 1px solid #e2e2e2;
   width: 100% !important;
   box-sizing: border-box;
}
[dark] [page-subtype=history] #contents.ytd-browse-feed-actions-renderer,
[dark] [page-subtype=history] ytd-sub-feed-selector-renderer {
   border-color: #333;
}
[dark] [page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button,
[dark] [page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   border-color: #333;
   background: #1c1c1c;
}
[dark] [page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button:hover,
[dark] [page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer:hover {
   border-color: #3c3c3c !important;
   box-shadow: 0 1px 0 rgb(0 0 0/10%) !important;
   background-color: #444;
}
html[dark] .ytdl-link-btn {
   color: #fff;
   border-color: #333;
}
[page-subtype=history] tp-yt-paper-input.ytd-search-box-renderer {
   margin: 0;
   width: 200px !important;
}
[page-subtype=history] ytd-sub-feed-selector-renderer #radioLabel.tp-yt-paper-radio-button {
   font: 500 13px roboto;
   height: 28px;
   border-bottom: 3px solid transparent;
   padding: 0 3px;
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer yt-icon,
[page-subtype=history] ytd-sub-feed-selector-renderer #radioContainer.tp-yt-paper-radio-button {
   display: none;
}
[page-subtype=history] ytd-sub-feed-selector-renderer #radioLabel.tp-yt-paper-radio-button:hover,
[page-subtype=history] ytd-sub-feed-selector-renderer [aria-checked=true] #radioLabel.tp-yt-paper-radio-button {
   border-bottom-color: red;
}
[page-subtype=history] ytd-sub-feed-option-renderer {
   padding-right: 23px !important;
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer {
   display: inline-block !important;
   width: 100% !important;
   padding-bottom: 10px;
   border-bottom: 1px solid #e2e2e2;
}
[page-subtype=history] .text-wrapper.ytd-video-renderer,
[page-subtype=history] ytd-video-renderer:not([use-prominent-thumbs]) {
   max-width: none;
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button,
[page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   background: #f8f8f8;
   color: #333;
   height: 28px !important;
   border: solid 1px #d3d3d3;
   padding: 0 10px !important;
   outline: 0;
   font: 500 11px roboto;
   border-radius: 2px;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   margin-left: 10px;
   vertical-align: middle;
   text-align: center;
   line-height: 24px;
}
ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   height: 26px !important;
}
[page-subtype=history] ytd-compact-link-renderer[compact-link-style=compact-link-style-type-history-my-activity-link] #content-icon.ytd-compact-link-renderer[hidden] + #primary-text-container.ytd-compact-link-renderer > #label.ytd-compact-link-renderer {
   font: 500 11px roboto;
   color: #333;
   line-height: 28px;
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer > ytd-button-renderer.ytd-browse-feed-actions-renderer:nth-child(3) {
   margin-left: 10px;
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button yt-formatted-string {
   margin-left: 0 !important;
}
.ytd-two-column-search-results-renderer ytd-playlist-renderer #title.ytd-child-video-renderer #length.ytd-child-video-renderer {
   color: #767676 !important;
   font: 11px roboto !important;
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button:hover,
[page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgb(0 0 0/10%);
}
[page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button:active,
[page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer:active {
   border-color: #c6c6c6;
   background: #e9e9e9;
   box-shadow: inset 0 1px 0#ddd;
}
#input-container yt-live-chat-author-chip,
[page-subtype=history] #subtitle.ytd-compact-link-renderer,
[page-subtype=history] ytd-search-box-renderer .prefix,
[page-subtype=history] ytd-search-box-renderer .suffix,
ytd-rich-metadata-renderer[component-style=RICH_METADATA_RENDERER_STYLE_BOX_ART] #call-to-action.ytd-rich-metadata-renderer yt-icon {
   display: none;
}
[page-subtype=history] #primary-text-container.ytd-compact-link-renderer,
[page-subtype=history] ytd-browse-feed-actions-renderer * {
   display: inline-block;
   flex: none;
}
ytd-item-section-header-renderer[title-style=ITEM_SECTION_HEADER_TITLE_STYLE_HISTORY] #title.ytd-item-section-header-renderer {
   font: bold 13px arial;
   padding-bottom: 0 !important;
}
[page-subtype=history] .input-content.tp-yt-paper-input-container {
   box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.05);
   border: 1px solid #d3d3d3;
   color: #333;
   padding: 5px 10px 6px;
}
[page-subtype=history] .input-content.tp-yt-paper-input-container.focused {
   border-color: #167ac6;
   box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1);
}
[page-subtype=history] .input-content.tp-yt-paper-input-container #paper-input-label-1 {
   margin: -1px 4px;
   color: #333;
}
[page-subtype=history] .input-content.tp-yt-paper-input-container input {
   color: #333;
}
html[dark] [page-subtype=history] .input-content.tp-yt-paper-input-container {
   background: #1c1c1c;
   border-color: #333;
}
[page-subtype=history] ytd-item-section-renderer:nth-of-type(1) #title.ytd-item-section-header-renderer {
   margin-top: 8px !important;
}
[page-subtype=history] #title.ytd-item-section-header-renderer {
   font-size: 15px !important;
   font-weight: 500 !important;
}
[page-subtype=history] tp-yt-paper-radio-button.ytd-sub-feed-option-renderer[aria-checked=false] yt-formatted-string.ytd-sub-feed-option-renderer {
   color: #666 !important;
   font-weight: normal !important;
}
[page-subtype=history] .top-level-buttons.ytd-menu-renderer button.yt-icon-button {
   color: transparent !important;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -76px -511px;
   background-size: auto;
   width: 20px;
   height: 20px;
   opacity: 0.25 !important;
}
[page-subtype=history] ytd-video-renderer:not(:hover) ytd-menu-renderer.ytd-video-renderer:not([menu-active]).ytd-video-renderer:not(:focus-within) {
   opacity: 1 !important;
}
[page-subtype=history] .top-level-buttons.ytd-menu-renderer button.yt-icon-button:hover {
   opacity: 0.5 !important;
}
#subscribe-button ytd-button-renderer,
[page-subtype=history] .top-level-buttons.ytd-menu-renderer button.yt-icon-button:active,
[page-subtype=history] .watched ytd-thumbnail #thumbnail.ytd-thumbnail yt-img-shadow.ytd-thumbnail {
   opacity: 1 !important;
}
[page-subtype=history] #icon,
[page-subtype=history] ytd-item-section-renderer #header {
   display: none !important;
}
ytd-message-renderer[component-style=RENDER_STYLE_EMPTY_STATE] #message-button.ytd-message-renderer:not(:empty),
ytd-message-renderer[component-style=RENDER_STYLE_EMPTY_STATE] #message.ytd-message-renderer:not([hidden]).ytd-message-renderer {
   display: none !important;
}
ytd-message-renderer[component-style=RENDER_STYLE_EMPTY_STATE] {
   padding-top: 10px !important;
}
#message.ytd-message-renderer:not([hidden]).ytd-message-renderer + #submessage.ytd-message-renderer {
   margin-top: 23px !important;
   margin-bottom: 10px !important;
}
#submessage.ytd-message-renderer {
   color: #767676 !important;
   font-size: 15px !important;
}
[page-subtype=history] ytd-video-renderer:first-child {
   margin-top: 25px !important;
   margin-bottom: 15px !important;
}
[page-subtype=history] ytd-video-renderer:not(:first-child) {
   padding-top: 15px !important;
   border-top: 1px solid #e6e6e6 !important;
}
html[dark] [page-subtype=history] ytd-video-renderer:not(:first-child) {
   border-color: var(--yt-spec-10-percent-layer) !important;
}
[page-subtype=history] #title-wrapper.ytd-video-renderer {
   height: 16px !important;
}
[page-subtype=history] .text-wrapper.ytd-video-renderer {
   top: 0 !important;
}
.toggle-container .toggle-bar.tp-yt-paper-toggle-button {
   background: #b8b8b8 !important;
   height: 13px;
   border-radius: 20px;
   border: 1px solid transparent;
   padding-left: 1px solid;
   padding-right: 1px solid;
   opacity: 1 !important;
}
.toggle-container .toggle-button.tp-yt-paper-toggle-button {
   width: 13px;
   height: 13px;
   border-radius: 13px;
   background: #fbfbfb;
   box-shadow: none;
   top: 1px;
   bottom: 0;
   left: 1px;
}
ytd-app tp-yt-paper-toggle-button[checked]:not([disabled]) .toggle-button.tp-yt-paper-toggle-button {
   background: #fbfbfb;
}
ytd-app tp-yt-paper-toggle-button[checked] .toggle-button.tp-yt-paper-toggle-button {
   transform: translate(24px, 0) !important;
}
ytd-app tp-yt-paper-toggle-button[checked]:not([disabled]) .toggle-container .toggle-bar.tp-yt-paper-toggle-button {
   background: #167ac6 !important;
   opacity: 1 !important;
}
ytd-thumbnail-overlay-bottom-panel-renderer.style-scope {
   height: 94px !important;
   width: 43.75% !important;
   left: 94.5px;
   background: rgba(0, 0, 0, 0.7) !important;
}
ytd-search ytd-thumbnail-overlay-bottom-panel-renderer {
   height: 108px !important;
   left: 109px !important;
}
/*
.style-scope.ytd-thumbnail-overlay-bottom-panel-renderer {
	background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) -714px -55px;
	width: 32px;
	height: 32px;
	color: transparent !important;
	background-size: auto;
	left:28px !important;
    top:2px !important;
    position:absolute;
}

.style-scope.ytd-thumbnail-overlay-bottom-panel-renderer::before {
    content: "+++";
	position: absolute;
	font-size: 18px !important;
	top: 32px !important;
	color: #cfcfcf;
    left:0px;
}

.style-scope.ytd-thumbnail-overlay-bottom-panel-renderer::after {
	content: "VIDEOS";
	font-size: 10px !important;
    background:transparent !important;
	position: absolute;
	top: 52px;
    left:-2px;
	color: #cfcfcf !important;
	font-weight: 500;

}
*/
.collections-stack-wiz.style-scope.ytd-playlist-thumbnail {
   display: none !important;
}
ytd-thumbnail-overlay-bottom-panel-renderer[overlay-style] {
   justify-content: center !important;
}
.style-scope.ytd-thumbnail-overlay-bottom-panel-renderer,
ytd-thumbnail-overlay-bottom-panel-renderer[use-modern-collections-v2] {
   margin-right: 14px !important;
   margin-left: 14px !important;
   margin-bottom: 0px!important;
   border-radius: 0px!important;
   height: 86% !important;
   width: 43.75% !important;
   left: unset!important;
   flex-direction: column !important;
   text-align: center !important
}
ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail,
ytd-playlist-thumbnail[size="medium"]::before {
   border-radius: 0px !important;
}
.collections-stack-wiz__collection-stack1--medium {
   top: -0px!important;
   height: 100%!important;
   left: 0!important;
   right: 0!important;
   border-radius: 0px!important;
   display: none !important
}
#info-strings.ytd-video-primary-info-renderer {
   font-size: 13px !important;
   font-weight: 500 !important;
   color: #333 !important;
   margin-top: 13px !important;
}
ytd-video-owner-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {
   font-weight: 500 !important;
   font-size: 13px !important;
}
html:not([dark]) ytd-video-owner-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {
   color: #333 !important;
}
span.ytd-video-view-count-renderer,
ytd-video-primary-info-renderer[has-date-text] #info-text.ytd-video-primary-info-renderer {
   line-height: 24px !important;
   max-height: 24px !important;
   text-align: right !important;
   font-size: 19px !important;
   color: #666 !important;
   white-space: nowrap !important;
   margin-bottom: 2px !important;
}
html[dark] span.ytd-video-view-count-renderer {
   color: var(--yt-spec-text-secondary) !important;
   color: #b2aca2 !important;
}
#sentiment.ytd-video-primary-info-renderer {
   display: none !important;
}
ytd-app ytd-expander.ytd-video-secondary-info-renderer {
   line-height: 14px !important;
   --ytd-expander-collapsed-height: 42px !important;
}
/*subscribe*/
/*base*/
html ytd-button-renderer.style-destructive[is-paper-button] {
   background: transparent;
}
#subscribe-button ytd-button-renderer #button.ytd-button-renderer,
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer {
   display: inline-block;
   border: solid 1px transparent;
   font-weight: 400;
   font-size: 12px;
   line-height: 22px;
   border-radius: 2px 0 0 2px;
   box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
   padding: 0 6px 0 4.5px;
   height: 24px;
   text-align: initial;
   min-width: 0;
   font-family: roboto;
   z-index: 1;
   color: #fefefe;
   margin: 0 0 0 4px;
}
#subscribe-button ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   display: inline-block;
   overflow: visible;
   margin-left: 3px;
}
#subscribe-button ytd-button-renderer #button.ytd-button-renderer:before,
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:before,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer:before {
   content: '';
   display: inline-block;
   vertical-align: middle;
   margin-right: 4px;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -48px -775px;
   background-size: auto;
   width: 16px;
   height: 14px;
}
#subscribe-button .ytd-c4-tabbed-header-renderer :before,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer:before {
   margin-top: 1px;
}
#notification-preference-button {
   margin-top: -24px !important;
   width: 26px;
   margin-left: 100px !important;
   border: 1px solid #ccc;
}
/*RED*/
#subscribe-button ytd-button-renderer #button.ytd-button-renderer,
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer {
   background: red;
}
#subscribe-button ytd-button-renderer #button.ytd-button-renderer:hover,
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:hover,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer:hover {
   background: #d90a17;
}
#subscribe-button ytd-button-renderer #button.ytd-button-renderer:active,
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:active,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer:active {
   background: #a60812;
}
/*SUBBED REDS LIGHT*/
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed],
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed] {
   border: 1px solid #ccc;
   background: #f8f8f8;
   color: #666;
   font-weight: 400;
   padding-right: 8px;
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:active,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:active {
   background: #ededed;
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:before,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:before {
   background-position: -99px -147px;
   margin-right: 3px;
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover:before,
#owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover:before {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -24px -696px;
}
/*SUBBED REDS DARK*/
html[dark] #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed],
html[dark] #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover,
html[dark] #owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover {
   color: #ccc;
   background-color: #212121;
   border: 1px solid #51515151;
}
html[dark] #subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:active,
html[dark] #owner-container ytd-subscribe-button-renderer tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:active {
   background: #111;
}
/*BELL*/
html ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer {
   height: 24px;
   width: 28px;
   padding: 0;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   border: 1px solid #d3d3d3;
   background-color: #f8f8f8;
}
html ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
html ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer:active {
   border-color: #c6c6c6;
   background: #e9e9e9;
   box-shadow: inset 0 1px 0 #ddd;
}
#notification-preference-button button.yt-icon-button {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflgGT3Hj.png) -106px -122px;
   width: 18px;
   height: 18px;
   left: 4px;
   position: relative;
   top: 2px;
   opacity: 0.5;
}
#notification-preference-button:hover button.yt-icon-button {
   opacity: .6;
}
#notification-preference-button:active button.yt-icon-button {
   opacity: 1;
}
html[dark] #notification-preference-button #button.ytd-subscription-notification-toggle-button-renderer,
ytd-subscription-notification-toggle-button-renderer.style-text[is-icon-button] {
   background-image: linear-gradient(to top, #1c1c1c, #1c1c1c 100%);
   box-shadow: none;
   border-color: #333;
}
/*MINI*/
.style-scope.ytd-item-section-renderer tp-yt-paper-button.ytd-subscribe-button-renderer {
   border: 1px solid #ccc;
   background-color: #f8f8f8;
   color: #333;
   height: 20px;
   border-radius: 2px;
   padding: 0 6px 0 8px;
   font-size: 11px;
   font-weight: 500;
}
.style-scope.ytd-item-section-renderer ytd-subscribe-button-renderer {
   position: relative;
   top: -25px;
   left: -4px;
}
#upload-info > #owner-sub-count {
   position: absolute !important;
   margin-left: 150px;
   top: 22px;
}
ytd-subscribe-button-renderer {
   --yt-formatted-string-deemphasize-color: var(--yt-spec-static-brand-white);
   display: flex;
   flex-direction: row;
   bottom: 40px !important;
   left: 52px!important;
}
#owner-sub-count.ytd-video-owner-renderer {
   font-size: 11px !important;
   letter-spacing: 0 !important;
   color: #737373;
   height: 22px !important;
   line-height: 24px !important;
   border: 1px solid #ccc;
   border-left-width: 0 !important;
   padding: 0 6px 0 11px !important;
   border-radius: 2px !important;
   text-align: center !important;
   max-width: 28px !important;
   overflow: hidden !important;
   left: -7px;
   position: relative !important;
}
html[dark] .style-scope.ytd-video-primary-info-renderer {
   color: #fff;
}
ytd-app #subscribe-button.ytd-video-secondary-info-renderer {
   position: absolute;
   left: 54px;
   top: 17px;
   margin-bottom: 0;
   flex-direction: row;
}
#rsd-description-entry ytd-video-owner-renderer.ytd-video-secondary-info-renderer {
   max-width: 360px;
}
#top-row.ytd-video-secondary-info-renderer,
.ytd-video-primary-info-renderer {
   position: relative;
}
#info ytd-video-owner-renderer {
   top: -21px !important;
   position: relative;
   padding-bottom: 13px !important;
   border-bottom: 1px solid #e5e5e5 !important;
}
#info {
   top: 4px !important;
}
html[dark] #info ytd-video-owner-renderer {
   border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important;
}
html[dark] #owner-sub-count.ytd-video-owner-renderer {
   border: 1px solid #333;
}
ytd-video-primary-info-renderer[has-date-text] #info-text.ytd-video-primary-info-renderer {
   overflow: visible !important;
}
#info.ytd-video-primary-info-renderer {
   height: 20px !important;
   position: relative;
   bottom: 0;
   z-index: 99;
}
#info ytd-video-primary-info-renderer[has-date-text] #info-text.ytd-video-primary-info-renderer {
   right: 0;
   position: absolute;
   top: -31px;
}
ytd-toggle-button-renderer.force-icon-button a.ytd-toggle-button-renderer {
   margin-left: 8px;
   padding-right: 1px !important;
}
#analytics-button.ytd-video-owner-renderer,
#purchase-button.ytd-video-owner-renderer,
#sponsor-button.ytd-video-owner-renderer {
   display: none !important;
}
#info ytd-toggle-button-renderer.style-text[is-icon-button] {
   position: absolute !important;
   top: -40px;
   left: 0;
}
#info ytd-toggle-button-renderer.style-text[is-icon-button]:last-of-type {
   left: 80px;
}
.style-scope.ytd-menu-renderer.force-icon-button.style-default.size-default:nth-of-type(2) {
   order: 1 !important;
}
.style-scope.ytd-menu-renderer.force-icon-button.style-default.size-default:nth-of-type(1) {
   order: 2 !important;
}
#info #menu #top-level-buttons-computed .ytd-menu-renderer:nth-child(4):nth-last-child(3) yt-formatted-string.ytd-button-renderer,
#info #menu #top-level-buttons-computed .ytd-menu-renderer:nth-child(4):nth-last-child(4) yt-formatted-string.ytd-button-renderer {
   font-size: 11px !important;
}
#info #menu #top-level-buttons-computed .ytd-menu-renderer:nth-child(4):nth-last-child(3) yt-formatted-string::after,
#top-level-buttons-computed .ytd-menu-renderer:nth-child(4):nth-last-child(4) yt-formatted-string.ytd-button-renderer::after {
   content: none !important;
}
#info #menu ytd-button-renderer.ytd-menu-renderer[has-no-text] {
   order: 2 !important;
   margin-right: 5px !important;
}
#info #top-row.ytd-video-secondary-info-renderer {
   margin-bottom: 0 !important;
   bottom: 3px;
}
#info ytd-menu-renderer.ytd-video-primary-info-renderer {
   padding-bottom: 0px;
}
#info #sentiment.ytd-video-primary-info-renderer,
#info .ryd-tooltip {
   min-width: 160px;
   top: -31px !important;
   float: right;
}
#info .top-level-buttons.ytd-menu-renderer {
   border: 1px solid #ccc;
}
#info #return-youtube-dislike-bar-container,
#info #ryd-bar-container {
   min-width: 160px;
}
.ryd-tooltip-bar-container {
   padding-top: 12px !important;
}
#info .ryd-tooltip-bar-container {
   padding-bottom: 0 !important;
}
#info #top-level-buttons-computed .ytd-menu-renderer:nth-child(4):nth-last-child(2) yt-icon-button {
   padding-left: 0 !important;
   width: 24px !important;
}
ytd-toggle-button-renderer.style-default-active[is-icon-button] {
   order: 3 !important;
   position: unset !important;
}
.super-title.ytd-video-primary-info-renderer {
   font-size: 11px !important;
}
#search-icon-legacy.ytd-searchbox yt-icon.ytd-searchbox {
   color: transparent !important;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) -647px -24px;
   background-size: auto;
   width: 15px !important;
   height: 15px !important;
   opacity: 0.6 !important;
}
#playlist[playlist-type=RDMM] #index-container.ytd-playlist-panel-video-renderer {
   display: none !important;
}
#playlist[playlist-type=RDMM] #thumbnail-container.ytd-playlist-panel-video-renderer {
   margin-left: 16px !important;
}
#playlist[playlist-type=RDMM] #header-contents.ytd-playlist-panel-renderer,
#playlist[playlist-type=RDMM] #header-top-row.ytd-playlist-panel-renderer {
   margin-bottom: 3px !important;
   border: 0 !important;
}
#playlist[playlist-type=RDMM] #header-description.ytd-playlist-panel-renderer::before {
   float: left;
   margin-right: 10px;
   margin-top: 4px;
   overflow: hidden;
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -200px -134px;
   background-size: auto;
   width: 24px;
   height: 24px;
   content: "";
}
ytd-settings-sidebar-renderer ytd-compact-link-renderer[compact-link-style]:hover {
   background: #444;
}
html[dark] ytd-app yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected],
html[dark] ytd-app yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER][selected],
ytd-compact-link-renderer[compact-link-style][active] #label,
ytd-settings-sidebar-renderer ytd-compact-link-renderer[compact-link-style]:hover #label {
   color: #fff;
}
ytd-compact-link-renderer[compact-link-style][active]:hover,
ytd-settings-sidebar-renderer ytd-compact-link-renderer[compact-link-style][active] {
   background: var(--oldcolor);
}
html[dark] ytd-settings-sidebar-renderer ytd-compact-link-renderer[compact-link-style][active] {
   background: none;
}
html[dark] ytd-compact-link-renderer[compact-link-style][active]:hover {
   background: #444;
}
#title.ytd-settings-sidebar-renderer {
   padding: 5px 0 12px;
   font-size: 16px;
   color: #222;
   text-transform: none;
}
#upload-info.ytd-video-owner-renderer {
   flex-basis: 0;
   justify-content: initial;
}
.ytd-video-secondary-info-renderer #avatar.ytd-video-owner-renderer {
   margin-right: 10px;
}
#meta .ytd-video-secondary-info-renderer tp-yt-paper-button.ytd-expander yt-formatted-string {
   font: 500 11px roboto !important;
   color: #767676;
   margin-top: 4px;
}
html:not([dark]) .title.ytd-video-primary-info-renderer {
   color: black;
}
.title.ytd-video-primary-info-renderer,
.super-title.ytd-video-primary-info-renderer {
   line-height: normal !important;
   top: 2px;
}
html[dark] #info-strings.ytd-video-primary-info-renderer,
html[dark] #meta .ytd-video-secondary-info-renderer tp-yt-paper-button.ytd-expander:hover yt-formatted-string {
   color: #ddd !important;
}
html:not([dark]) .ytd-watch-next-secondary-results-renderer [class*=ytd-compact-]:hover,
ytd-video-secondary-info-renderer:hover a.yt-simple-endpoint.yt-formatted-string {
   color: #167ac6;
}
#header.ytd-browse ytd-button-renderer:nth-of-type(1) #button.ytd-button-renderer,
ytd-button-renderer.style-primary:nth-of-type(1) {
   background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAMFBMVEUAAABnZ2hnZ2dpaWloaGhnZ2dnZ2dsbGxnZ2dpaGh5eXdmZma6pJpmZmZmZmZpa2vKDH3GAAAADnRSTlMAkOLPvKZid4BRGTcM8Jbx1VoAAACHSURBVAjXYwAC9nfvChgggPXduwAok/ndOwMww2RW3Lt3X1e6MDCwvYOCBIa1MKYOgxyQNBQCEi8Y8t+9e8gAEvjJwK0H0s707tEGBoa+dwIMDIzvnjMgMYEK3itAFCC0fWPoA5qjCDHsEJD89x5kBbLFDC6z4t+9+7jSBe5ITKez//8P8hAAJWxgShrD7JcAAAAASUVORK5CYII=')no-repeat!important;
   border: 0 !important;
   height: 20px;
   width: 20px !important;
}
#input-panel yt-live-chat-message-input-renderer {
   padding: 4px 12px;
}
iron-pages#panel-pages.yt-live-chat-renderer {
   overflow: hidden;
}
ytd-expander.ytd-video-secondary-info-renderer:not([collapsed]) ytd-metadata-row-container-renderer {
   display: inline-block;
   width: 25.2%;
}
ytd-expander.ytd-video-secondary-info-renderer:not([collapsed]) #content {
   display: inline-block;
   width: 74.4%;
   vertical-align: top;
}
ytd-expander.ytd-video-secondary-info-renderer:not([collapsed]) {
   display: inline-block;
}
ytd-expander.ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer ytd-metadata-row-header-renderer ytd-expander.ytd-video-secondary-info-renderer #content {
   width: 80% !important;
}
ytd-expander.ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer #title.ytd-metadata-row-renderer {
   width: 50px;
}
#meta #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer:last-child {
   visibility: hidden !important;
   height: 0;
}
#meta #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer {
   margin: 0;
}
ytd-expander.ytd-video-secondary-info-renderer ytd-rich-metadata-renderer {
   background: 0 0;
   max-width: 100%;
   min-width: 100px;
   flex: initial;
}
ytd-expander.ytd-video-secondary-info-renderer a.ytd-rich-metadata-renderer #title.ytd-rich-metadata-renderer {
   font: 500 12px roboto;
}
#meta #contents.ytd-rich-metadata-row-renderer {
   margin-right: 0;
}
ytd-rich-metadata-renderer[component-style=RICH_METADATA_RENDERER_STYLE_BOX_ART] #thumbnail.ytd-rich-metadata-renderer {
   margin-right: 10px;
}
ytd-rich-metadata-renderer[component-style=RICH_METADATA_RENDERER_STYLE_BOX_ART] #text-container.ytd-rich-metadata-renderer {
   display: block;
}
ytd-rich-metadata-renderer[component-style=RICH_METADATA_RENDERER_STYLE_BOX_ART] #call-to-action.ytd-rich-metadata-renderer {
   font-size: 11px;
   color: #999;
}
ytd-expander:hover ytd-rich-metadata-renderer[component-style=RICH_METADATA_RENDERER_STYLE_BOX_ART] #call-to-action.ytd-rich-metadata-renderer {
   color: #167ac6;
}
ytd-expander.ytd-video-secondary-info-renderer:not([collapsed]) ytd-rich-metadata-row-renderer {
   margin-top: 0;
}
#share yt-button-renderer #button.yt-button-renderer.style-primary[aria-disabled=true] {
   opacity: 0.5;
}
#share yt-button-renderer #button.yt-button-renderer.style-primary,
#sync-container #sync-button.ytd-macro-markers-list-renderer,
yt-button-renderer #button.yt-button-renderer.style-blue-text,
ytcp-button[type=filled],
ytd-button-renderer #button.ytd-button-renderer.style-blue-text {
   background: #1b7fcc;
   border-radius: 0;
   height: 28px;
   padding: 0 10px;
   border: 1px solid #1b7fcc;
   color: #fff;
   font: bold 11px roboto;
}
yt-button-renderer #button.yt-button-renderer.style-blue-text yt-formatted-string,
ytd-button-renderer #button.ytd-button-renderer.style-blue-text yt-formatted-string {
   color: #fff;
   font: bold 11px roboto;
}
#share yt-button-renderer #button.yt-button-renderer.style-primary:hover,
#sync-container #sync-button.ytd-macro-markers-list-renderer:hover,
yt-button-renderer #button.yt-button-renderer.style-blue-text:hover,
ytd-button-renderer #button.ytd-button-renderer.style-blue-text:hover {
   background: #126db3;
}
#share yt-button-renderer #button.yt-button-renderer.style-primary:active,
#sync-container #sync-button.ytd-macro-markers-list-renderer:active,
yt-button-renderer #button.yt-button-renderer.style-blue-text:active,
ytd-button-renderer #button.ytd-button-renderer.style-blue-text:active {
   background: #095b99;
   box-shadow: inset 0 1px 0 rgb(0 0 0/50%);
}
#cancel yt-button-renderer #button.yt-button-renderer.style-blue-text,
yt-button-renderer#cancel-button #button.yt-button-renderer.style-text,
ytd-button-renderer #cancel-button #button.ytd-button-renderer.style-text {
   background: #f8f8f8;
   border: 1px solid #d3d3d3;
   box-shadow: 0 1px 0 rgb(0 0 0/5%);
   padding: 0 10px;
   height: 28px;
   font: 500 11px roboto;
   color: #333;
}
#cancel yt-button-renderer #button.yt-button-renderer.style-blue-text yt-formatted-string {
   color: #333;
   font-weight: 500;
}
#cancel yt-button-renderer #button.yt-button-renderer.style-blue-text:hover,
yt-button-renderer#cancel-button #button.yt-button-renderer.style-text:hover,
ytd-button-renderer #cancel-button #button.ytd-button-renderer.style-text:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgb(0 0 0/10%);
}
#cancel yt-button-renderer #button.yt-button-renderer.style-blue-text:active,
yt-button-renderer#cancel-button #button.yt-button-renderer.style-text:active,
ytd-button-renderer #cancel-button #button.ytd-button-renderer.style-text:active {
   border-color: #c6c6c6;
   background: #e9e9e9;
   box-shadow: inset 0 1px 0#ddd;
}
html[dark] #cancel yt-button-renderer #button.yt-button-renderer.style-blue-text,
html[dark] yt-button-renderer#cancel-button #button.yt-button-renderer.style-text,
html[dark] ytd-button-renderer #cancel-button #button.ytd-button-renderer.style-text {
   background: rgba(0, 0, 0, 0.2);
   border-color: #444;
   color: #999;
}
html[dark] #cancel yt-button-renderer #button.yt-button-renderer.style-blue-text:active,
html[dark] #cancel yt-button-renderer #button.yt-button-renderer.style-blue-text:hover,
html[dark] yt-button-renderer#cancel-button #button.yt-button-renderer.style-text:active,
html[dark] yt-button-renderer#cancel-button #button.yt-button-renderer.style-text:hover,
html[dark] ytd-button-renderer #cancel-button #button.ytd-button-renderer.style-text:active,
html[dark] ytd-button-renderer #cancel-button #button.ytd-button-renderer.style-text:hover {
   background: rgba(0, 0, 0, 0.3);
   border-color: #444;
}
.badge-style-type-collection.ytd-badge-supported-renderer {
   padding: 0;
}
#hover-overlays #play,
ytd-thumbnail-overlay-inline-unplayable-renderer {
   display: none;
}
html #subscribe-button [href*="https://studio.youtube.com"] #button.ytd-button-renderer {
   border: 1px solid #d3d3d3;
   background: #f8f8f8;
   font: 500 11px roboto;
   width: auto;
}
html #subscribe-button [href*="https://studio.youtube.com"] #button.ytd-button-renderer:hover {
   border-color: #c6c6c6;
   background: #f0f0f0;
   box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
html #subscribe-button [href*="https://studio.youtube.com"] #button.ytd-button-renderer:active {
   border-color: #c6c6c6;
   background: #e9e9e9;
   box-shadow: inset 0 1px 0 #ddd;
}
#subscribe-button ytd-button-renderer.style-primary:nth-of-type(1) {
   width: unset !important;
   background: 0 0 !important;
}
html #subscribe-button [href*="https://studio.youtube.com"] #button.ytd-button-renderer yt-formatted-string {
   color: #333;
   line-height: 2em;
   width: auto;
   height: 22px;
}
html #subscribe-button ytd-button-renderer [href*="https://studio.youtube.com"] #button.ytd-button-renderer::before {
   content: "";
   display: inline-block;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) 0 -852px;
   background-size: auto;
   width: 16px;
   height: 16px;
}
ytd-app yt-chip-cloud-chip-renderer.yt-chip-cloud-renderer,
ytd-app yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer {
   background: 0 0 !important;
   border-width: 0 0 3px;
   border-radius: 0;
   box-shadow: none;
   border-bottom-color: transparent;
   font: normal 13px roboto;
   color: #666;
   margin-bottom: 0;
   margin-top: 0;
}
ytd-app yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:hover {
   border-bottom-color: var(--oldcolor);
}
ytd-app yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT][selected],
ytd-app yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER][selected] {
   border-bottom-color: var(--oldcolor);
   background: 0 0;
   color: #333;
   font-weight: 500;
}
ytd-app ytd-feed-filter-chip-bar-renderer {
   height: auto;
   margin-top: 10px;
}
ytd-app ytd-button-renderer.yt-chip-cloud-renderer {
   width: unset;
}
ytd-app ytd-feed-filter-chip-bar-renderer #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
   border-top: 0;
}
#left-arrow-button.ytd-feed-filter-chip-bar-renderer,
#right-arrow-button.ytd-feed-filter-chip-bar-renderer {
   background: 0 0;
}
ytd-app #left-arrow.yt-chip-cloud-renderer::after,
ytd-app #right-arrow.yt-chip-cloud-renderer::before {
   content: none;
}
ytd-app ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
   margin: 0;
   background: 0 0;
   cursor: pointer;
}
ytd-app .yt-chip-cloud-renderer ytd-button-renderer #button.ytd-button-renderer,
ytd-app ytd-button-renderer.ytd-feed-filter-chip-bar-renderer #button.ytd-button-renderer {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -112px -42px;
   width: 7px;
   height: 10px;
   padding: 0;
   opacity: 0.5;
}
#left-arrow .yt-chip-cloud-renderer ytd-button-renderer #button.ytd-button-renderer,
ytd-app #left-arrow ytd-button-renderer.ytd-feed-filter-chip-bar-renderer #button.ytd-button-renderer {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -20px -918px;
}
#info-contents > div {
   z-index: 999;
   margin-top: 10px;
}
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer:hover,
[menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer:hover,
[menu-style=multi-page-menu-style-type-system] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer,
[menu-style=multi-page-menu-style-type-system] yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer {
   background: 0 0;
}
html[dark] [menu-style=multi-page-menu-style-type-system] #submenu #footer tp-yt-paper-item,
html[dark] [page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button,
html[dark] [page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer,
html[dark] ytd-google-account-header-renderer.ytd-account-section-list-renderer {
   background-color: #1c1c1c;
   border: solid 1px #333;
   color: var(--yt-button-color, inherit);
}
html[dark] [menu-style=multi-page-menu-style-type-system] #submenu #footer tp-yt-paper-item:hover,
html[dark] [page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button:hover,
html[dark] [page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer:hover,
html[dark] ytd-google-account-header-renderer.ytd-account-section-list-renderer:hover {
   background-color: #444;
   border-color: #3c3c3c;
}
html[dark] #bio.ytd-channel-about-metadata-renderer,
html[dark] #content-text.ytd-backstage-post-renderer,
html[dark] #description.ytd-channel-about-metadata-renderer,
html[dark] #right-column.ytd-channel-about-metadata-renderer .style-scope.ytd-channel-about-metadata-renderer,
html[dark] .subheadline.ytd-channel-about-metadata-renderer,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item.ytd-compact-link-renderer #label,
html[dark] [menu-style=multi-page-menu-style-type-system] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item.ytd-compact-link-renderer #label,
html[dark] [page-subtype=channels] yt-dropdown-menu:not(.has-items) #label-text.yt-dropdown-menu,
html[dark] [page-subtype=history] #contents.ytd-browse-feed-actions-renderer tp-yt-paper-button,
html[dark] [page-subtype=history] .input-content.tp-yt-paper-input-container input,
html[dark] [page-subtype=history] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer,
html[dark] [page-subtype=history] ytd-compact-link-renderer[compact-link-style=compact-link-style-type-history-my-activity-link] #content-icon.ytd-compact-link-renderer[hidden] + #primary-text-container.ytd-compact-link-renderer > #label.ytd-compact-link-renderer,
html[dark] ytd-video-renderer[is-backstage-video] #video-title.ytd-video-renderer {
   color: #fff !important;
}
html[dark] [page-subtype=history] .input-content.tp-yt-paper-input-container #paper-input-label-1 {
   color: #666;
}
html[dark] ytd-app #checkbox.checked.tp-yt-paper-checkbox #checkmark.tp-yt-paper-checkbox {
   filter: invert(1);
}
.sbsb_c.gsfs:last-child {
   display: none;
}
html #share-url.yt-copy-link-renderer {
   color: #666;
   margin-left: 2px;
   max-width: 315px;
}
#title.yt-share-panel-header-renderer {
   border-bottom: 3px solid var(--oldcolor);
}
#contents.yt-third-party-share-target-section-renderer yt-share-target-renderer.yt-third-party-share-target-section-renderer {
   margin-right: 3px;
}
.yt-third-party-network-section-renderer .input-content.tp-yt-paper-input-container,
html #bar.yt-copy-link-renderer {
   background: 0 0;
   border: 1px solid #d3d3d3;
   box-shadow: inset 0 0 1px rgb(0 0 0/5%);
}
html:not([dark]) #bar.yt-copy-link-renderer:hover,
html:not([dark]) .yt-third-party-network-section-renderer .input-content.tp-yt-paper-input-container:hover {
   border-color: #b9b9b9;
}
html:not([dark]) #bar.yt-copy-link-renderer:focus-within,
html:not([dark]) .yt-third-party-network-section-renderer .input-content.tp-yt-paper-input-container:focus-within {
   box-shadow: inset 0 0 1px rgb(0 0 0/10%);
   border-color: #1b7fcc;
}
html[dark] #bar.yt-copy-link-renderer,
html[dark] .yt-third-party-network-section-renderer .input-content.tp-yt-paper-input-container {
   border-color: #333;
}
.ytd-unified-share-panel-renderer yt-start-at-renderer.yt-third-party-network-section-renderer {
   padding: 0;
   margin: 0;
   border: 0;
   display: inline-block;
}
.yt-third-party-network-section-renderer .input-content.tp-yt-paper-input-container {
   padding-top: 1px;
   padding-bottom: 2px;
   padding-left: 3px;
}
yt-copy-link-renderer.yt-third-party-network-section-renderer {
   max-width: none;
}
#copy-link.yt-third-party-network-section-renderer,
#start-at.yt-third-party-network-section-renderer {
   display: inline-block;
}
#start-at.yt-third-party-network-section-renderer {
   vertical-align: super;
   margin-left: 20px;
}
.yt-third-party-network-section-renderer tp-yt-paper-button.yt-button-renderer {
   padding: 0;
   width: max-content;
   min-width: 0;
}
.scroll-button {
   border-radius: 0 !important;
}
yt-third-party-network-section-renderer .scroll-button {
   display: none;
}
yt-share-target-renderer:first-child,
yt-share-target-renderer:nth-child(5) {
   position: absolute;
   top: -35px;
   left: 60px;
}
yt-share-target-renderer:nth-child(5) {
   left: 130px;
}
yt-share-target-renderer:nth-child(5) yt-icon.yt-share-target-renderer {
   display: none;
}
#title.yt-share-panel-title-v15-renderer,
yt-share-target-renderer:first-child #title,
yt-share-target-renderer:nth-child(5) #title {
   font: 500 13px roboto;
   width: auto;
}
.yt-third-party-share-target-section-renderer yt-share-target-renderer:first-child yt-icon {
   display: none;
}
yt-share-target-renderer:not(:first-child):not(:nth-child(5)) #title {
   display: none;
}
yt-share-target-renderer:nth-child(2) yt-icon.yt-share-target-renderer {
   background: #25d366;
}
yt-share-target-renderer:nth-child(3) yt-icon.yt-share-target-renderer {
   background: #3b5998;
}
yt-share-target-renderer:nth-child(4) yt-icon.yt-share-target-renderer {
   background: #1da1f2;
}
yt-share-target-renderer:nth-child(6) yt-icon.yt-share-target-renderer {
   background: #ffe812;
}
yt-share-target-renderer:nth-child(7) yt-icon.yt-share-target-renderer {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vflsuIoGD.png) 0 -1238px;
   background-size: auto;
   width: 32px;
   height: 32px;
}
yt-share-target-renderer:nth-child(8) yt-icon.yt-share-target-renderer {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vflsuIoGD.png) 0 -284px;
   background-size: auto;
   width: 32px;
   height: 32px;
}
yt-share-target-renderer:nth-child(9) yt-icon.yt-share-target-renderer {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vflsuIoGD.png) 0 -1013px;
   background-size: auto;
   width: 32px;
   height: 32px;
}
yt-share-target-renderer:nth-child(10) yt-icon.yt-share-target-renderer {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-sharing-vflsuIoGD.png) 0 -1562px;
   background-size: auto;
   width: 32px;
   height: 32px;
}
yt-share-target-renderer:nth-child(11) yt-icon.yt-share-target-renderer {
   background: #f57d00;
}
yt-share-target-renderer:nth-child(12) yt-icon.yt-share-target-renderer {
   background: #35465c;
}
yt-share-target-renderer:nth-child(13) yt-icon.yt-share-target-renderer {
   background: #0077b5;
}
yt-share-target-renderer:nth-child(14) yt-icon.yt-share-target-renderer {
   background: #051b0d;
}
yt-share-target-renderer:nth-child(15) yt-icon.yt-share-target-renderer {
   background: #ff8226;
}
yt-share-target-renderer:nth-child(16) yt-icon.yt-share-target-renderer {
   background: #ce2e2d;
}
yt-share-target-renderer:nth-child(10) svg,
yt-share-target-renderer:nth-child(7) svg,
yt-share-target-renderer:nth-child(8) svg,
yt-share-target-renderer:nth-child(9) svg {
   display: none !important;
}
.ytp-right-controls > button:first-child {
   display: none;
}
.ytp-right-controls > button:first-child[aria-label="Autoplay is on"] {
   display: inline-block;
}
#upnext.ytd-compact-autoplay-renderer {
   font-size: 13px !important;
   line-height: 1.3em !important;
   font-weight: 500 !important;
   flex: 1;
   position: relative;
   top: 1px;
}
html:not([dark]) #upnext.ytd-compact-autoplay-renderer {
   color: #222;
}
#autoplay.ytd-compact-autoplay-renderer {
   font-size: 13px !important;
   text-transform: none !important;
   position: relative;
   top: 1px;
   font-weight: 500;
   color: #767676;
}
html[dark] #upnext.ytd-compact-autoplay-renderer {
   color: var(--yt-spec-text-primary);
}
html[dark] #autoplay.ytd-compact-autoplay-renderer {
   color: #fff;
   opacity: 0.5;
}
.autoplay-hovercard:hover {
   opacity: 0.6 !important;
   cursor: pointer;
}
html[dark] .autoplay-hovercard {
   filter: invert(1);
}
#toggle.ytd-compact-autoplay-renderer[checked] .toggle-label {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -53px -563px;
}
#toggle.ytd-compact-autoplay-renderer .toggle-label {
   height: 7px;
   width: 10px;
   right: 31px;
   top: 1px;
}
#head.ytd-compact-autoplay-renderer {
   margin-bottom: 7px !important;
   width: 402px;
   display: flex;
   flex-direction: row;
   align-items: center;
}
ytd-compact-autoplay-renderer ytd-compact-video-renderer.ytd-item-section-renderer {
   margin-top: 7px !important;
}
ytd-compact-autoplay-renderer {
   margin-bottom: 0 !important;
   padding-bottom: 7px !important;
   width: 381px;
   display: block;
   border-bottom: 1px solid var(--yt-spec-10-percent-layer);
}
tp-yt-paper-toggle-button.ytd-compact-autoplay-renderer {
   margin-left: 8px;
   position: relative !important;
   top: 2px;
   left: 3px;
}
ytd-compact-autoplay-renderer .toggle-label > .tp-yt-paper-toggle-button {
   display: none;
}
ytd-compact-autoplay-renderer > ytd-compact-autoplay-renderer {
   display: none;
}
.toggle-container.tp-yt-paper-toggle-button {
   width: 37px !important;
   height: 15px !important;
}
html[dark] ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-autoplay-renderer {
   border-bottom-color: var(--yt-spec-10-percent-layer) !important;
}
#secondary-inner.ytd-watch-flexy {
   width: 417px !important;
   margin-top: -10px;
}
html ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer {
   max-width: 220px;
   position: absolute;
   width: 220px;
}
html .ytd-playlist-sidebar-primary-info-renderer #overlays {
   visibility: hidden;
}
html .ytd-playlist-sidebar-primary-info-renderer:hover #overlays {
   visibility: visible;
}
html .ytd-playlist-sidebar-primary-info-renderer ytd-thumbnail-overlay-side-panel-renderer {
   width: 100% !important;
}
html ytd-browse[page-subtype="playlist"][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse {
   padding: 0;
   margin: 0 auto;
}
html[dark] div.ytd-simple-menu-header-renderer ytd-button-renderer {
   filter: invert(1);
}
html[dark] [page-subtype="playlist"] #top-level-buttons-computed .ytd-menu-renderer a {
   background-color: #1c1c1c;
   border: solid 1px #333;
}
html[dark] [page-subtype="playlist"] #top-level-buttons-computed .ytd-menu-renderer a::after {
   color: #fff;
}
html[dark] [page-subtype="playlist"] #top-level-buttons-computed .ytd-menu-renderer a:hover {
   background-color: #444;
   border-color: #3c3c3c;
}
html[dark] [page-subtype='playlist'] #top-level-buttons-computed .ytd-menu-renderer.style-text yt-icon-button {
   filter: invert(1);
}
/*toast*/
tp-yt-paper-toast.paper-toast-open {
   background: #2793e6;
   border: 1px solid #3a78ab;
   text-shadow: 0 0 1px rgb(0 0 0 / 45%);
   color: #fff;
   width: auto;
   max-width: none;
   padding: 3px 6px!important;
   max-height: 27px;
   min-height: 0!important;
   font-weight: bold;
}
ytd-app tp-yt-paper-toast.yt-notification-action-renderer {
   font-weight: bold;
}
tp-yt-paper-toast.paper-toast-open #text-container yt-formatted-string:before {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -51px -1294px;
   background-size: auto;
   width: 19px;
   height: 19px;
   margin-right: 5px;
   content: "";
   display: inline-block;
   transform: scale(.8);
}
tp-yt-paper-toast tp-yt-paper-button#button {
   padding: 2px 5px !important;
}
yt-notification-action-renderer {
   width: 100%!important;
   height: auto!important;
   padding: 0!important;
   max-height: 27px;
}
ytd-search #sub-menu {
   border-bottom: 1px solid #f1f1f1;
   padding-bottom: 2px;
}
html[dark] ytd-search #sub-menu {
   border-bottom: 1px solid var(--yt-spec-10-percent-layer);
}
.num-results {
   white-space: nowrap;
   color: #555;
   font-size: 11px;
   margin-top: 3px;
}
html[dark] .num-results {
   color: white;
}
.html5-video-player .ytp-live-badge {
   width: auto !important;
}
.title.ytd-guide-entry-renderer {
   margin-left: 3.5px;
}
#header-entry #endpoint[href="/feed/you"] tp-yt-paper-item.ytd-guide-entry-renderer {
   padding: 0 !important;
}
html[dark] tp-yt-paper-item path[d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"],
html[dark] yt-icon path[d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"] {
   filter: contrast(0.3);
}
html[dark] tp-yt-paper-item:hover path[d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"],
html[dark] tp-yt-paper-item[aria-selected="true"] path[d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"] {
   filter: none;
}
ytd-thumbnail.ytd-reel-item-renderer {
   height: var(--ytd-grid-thumbnail_-_height);
   width: var(--ytd-grid-thumbnail_-_width);
   margin-bottom: 3px !important;
}
ytd-reel-item-renderer {
   width: var(--ytd-grid-thumbnail_-_width);
   margin-right: 10px;
}
/*
yt-horizontal-list-renderer[override-arrow-position-for-reel-items] #left-arrow.yt-horizontal-list-renderer,
yt-horizontal-list-renderer[override-arrow-position-for-reel-items] #right-arrow.yt-horizontal-list-renderer {
    height: 118px !important;
}
*/
ytd-reel-item-renderer #video-title {
   font-size: 13px !important;
   line-height: normal !important;
}
h3.ytd-reel-item-renderer {
   margin: 0 10px 0 0 !important;
   padding: 0;
}
ytd-video-meta-block.ytd-reel-item-renderer {
   margin-top: 3px;
}
#contents.ytd-reel-shelf-renderer {
   margin-top: 10px !important;
}
#title-container.ytd-reel-shelf-renderer {
   margin-top: 17px !important;
}
ytd-video-renderer[use-prominent-thumbs] #title-wrapper.ytd-video-renderer,
[page-subtype="trending"] #title-wrapper.ytd-video-renderer {
   margin-top: 8px;
}
#title-container a.yt-simple-endpoint[href^="/feed/storefront"] {
   margin-top: 17px;
   margin-bottom: 10px;
}
html #video-title.ytd-grid-movie-renderer {
   font-size: 13px !important;
   line-height: normal !important;
}
ytd-grid-movie-renderer {
   margin-right: 10px;
   width: var(--ytd-grid-thumbnail_-_width) !important;
}
ytd-thumbnail.ytd-grid-movie-renderer,
ytd-thumbnail.ytd-grid-movie-renderer img.yt-img-shadow {
   width: calc(var(--ytd-grid-thumbnail_-_width) / 2) !important;
   height: var(--ytd-grid-thumbnail_-_height) !important;
}
.sbpqs_a {
   color: #52188c !important;
}
html[dark] .sbpqs_a {
   color: #9328ff !important;
}
html[dark] .sbdd_b,
html[dark] .sbsb_a {
   background: hsl(0, 0%, 10%) !important;
}
html[dark] .gsfs {
   color: #fff;
}
html[dark] .sbsb_d {
   background: hsla(0, 0%, 100%, 0.08) !important;
}
html[dark] .sbdd_b {
   border: 1px solid hsla(0, 0%, 53.3%, 0.4) !important;
   border-top-style: none !important;
}
yt-icon path[d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"] {
   filter: brightness(40);
}
yt-icon:hover path[d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"] {
   filter: brightness(20);
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed] {
   text-transform: none;
}
.badge-style-type-featured.ytd-badge-supported-renderer {
   color: var(--yt-spec-text-primary) !important;
}
[page-subtype="trending"] #channel-name.ytd-video-renderer {
   padding-left: 0;
}
ytd-video-meta-block:not([rich-meta]) #byline-container.ytd-video-meta-block {
   line-height: 1.4rem !important;
}
[page-subtype="trending"] #description-text.ytd-video-renderer {
   line-height: 1.3em !important;
   padding-top: 20px !important;
}
[page-subtype="trending"] #title-wrapper.ytd-video-renderer {
   height: 17px !important;
}
[page-subtype="trending"] #metadata-line.ytd-video-meta-block {
   position: absolute !important;
   top: 42px !important;
   line-height: 1.5rem !important;
   font-size: 1.2rem !important;
}
[page-subtype="trending"] #separator.ytd-video-meta-block {
   display: none !important;
}
[lang*=en] .addto-btn yt-formatted-string {
   font-size: 0 !important;
}
[lang*=en] .addto-btn yt-formatted-string::after {
   content: "Add to";
   font-size: 1.4rem !important;
   top: 1px;
   position: absolute;
}
.addto-btn yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -151px -725px;
   fill: none !important;
   filter: contrast(0);
   left: 2px;
}
.yt-spec-icon-badge-shape__icon {
   fill: none;
   left: 0;
   opacity: .85;
   margin-top: -2px;
   margin-left: 1px;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -698px -257px;
   background-size: auto;
   width: 30px !important;
   height: 30px !important;
   filter: invert(0.60);
}
yt-icon-button.ytd-notification-topbar-button-renderer {
   filter: contrast(130%);
}
yt-icon-button.ytd-notification-topbar-button-renderer:hover {
   filter: contrast(100%) brightness(94%);
}
html[dark] yt-icon-button.ytd-notification-topbar-button-renderer:hover {
   filter: contrast(2);
}
yt-icon-button.ytd-notification-topbar-button-renderer:active {
   filter: contrast(1);
}
html[dark] yt-icon-button.ytd-notification-topbar-button-renderer:active {
   filter: contrast(3);
}
.yt-spec-icon-badge-shape--type-notification.yt-spec-icon-badge-shape > .yt-spec-icon-badge-shape__icon > yt-icon {
   display: none;
}
yt-interaction {
   display: none;
}
.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
   height: 29px;
   width: 31px;
   left: 4px;
   padding-left: 8px;
   padding-top: 2px;
   top: -5px;
   min-width: unset !important;
   max-width: unset !important;
   border-bottom: unset !important;
   border-left: unset !important;
}
/*
ytd-watch-metadata {
	display: none !important;
}
*/
ytd-watch-flexy #info-contents,
ytd-watch-flexy #meta-contents {
   display: block !important;
}
#info-contents[hidden] #upload-info > #owner-sub-count {
   margin-left: 181px;
}
ytd-promoted-sparkles-web-renderer.ytd-item-section-renderer {
   margin-top: 15px;
}
ytd-promoted-sparkles-web-renderer.ytd-item-section-renderer #action-button {
   display: none;
}
ytd-badge-supported-renderer.ytd-promoted-sparkles-web-renderer span {
   color: var(--yt-spec-text-secondary);
}
.ytp-heat-map-container {
   display: none !important;
}
.ytp-progress-bar-hover.ytp-progress-bar-decoration .ytp-tooltip-title {
   display: none !important;
}
.ytp-progress-bar-hover.ytp-progress-bar-decoration .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-text {
   top: 33px;
}
.ytp-chrome-controls .ytp-button.ytp-mute-button {
   padding: 0 2px !important;
}
ytd-download-button-renderer {
   display: none !important;
}
#container.ytd-searchbox {
   margin-left: 0px !important;
}
#container.ytd-searchbox > [slot=search-input] input {
   padding: 1px 2px 2px !important;
}
.ytp-button[data-tooltip-target-id=ytp-autonav-toggle-button] {
   padding: 0 !important;
}
ytd-two-column-search-results-renderer #avatar-section.ytd-channel-renderer {
   margin-right: 8px;
}
ytd-two-column-search-results-renderer #subscribe-button.ytd-channel-renderer {
   padding-right: 80px;
}
ytd-video-renderer[is-search] #channel-thumbnail.ytd-video-renderer {
   display: none;
}
ytd-video-renderer[is-search] #channel-info.ytd-video-renderer {
   padding: 0 !important;
}
ytd-video-renderer[is-search] .text-wrapper.ytd-video-renderer {
   top: 0 !important;
}
#expandable-metadata.ytd-video-renderer:not(:empty) {
   margin: 0 !important;
}
ytd-video-primary-info-renderer[use-yt-sans20-light] .title.ytd-video-primary-info-renderer {
   font-family: "Roboto", "Arial", sans-serif !important;
   font-size: 1.8rem !important;
   font-weight: 400 !important;
}
.ytcp-main-appbar {
   margin: -12px;
   width: 100%;
   text-align: center;
   line-height: 42px;
   height: 42px;
   border-bottom: 1px solid #e8e8e8;
   border-left: 1px solid #e8e8e8;
   background-color: #fff;
   position: fixed;
   z-index: 2001;
   font-size: 13px;
   font-family: Roboto, arial, sans-serif;
}
html:not([dark]) .ytcp-nav-item {
   display: inline-block;
   margin-left: 30px;
}
html:not([dark]) .ytcp-nav-item span {
   display: inline-block;
   color: #666;
   text-decoration: none;
   cursor: pointer;
}
html:not([dark]) .ytcp-nav-item span:hover {
   box-shadow: inset 0 -3px #f00;
}
html:not([dark]) [page-subtype="home"] .ytcp-nav-home span,
html:not([dark]) [page-subtype="subscriptions"] .ytcp-nav-subs span,
html:not([dark]) [page-subtype="trending"] .ytcp-nav-trending span {
   box-shadow: inset 0 -3px #f00;
   color: #333;
   font-weight: 500;
}
html:not([dark]) .ytcp-appbar-nav {
   display: inline-block;
   vertical-align: top;
   overflow: hidden;
}
html[dark] .ytcp-main-appbar {
   background-color: #222;
   border-bottom: 1px solid #181818;
   border-left: 1px solid var(--yt-spec-10-percent-layer);
   box-shadow: inset 0 1px #0f0f0f;
}
html[dark] .ytcp-nav-item {
   display: inline-block;
   margin-left: 30px;
}
html[dark] .ytcp-nav-item span {
   display: inline-block;
   color: #8f8f8f;
   text-decoration: none;
   cursor: pointer;
}
html[dark] .ytcp-nav-item span:hover {
   box-shadow: inset 0 -3px #dcdcdc;
}
html[dark] [page-subtype="home"] .ytcp-nav-home span,
html[dark] [page-subtype="subscriptions"] .ytcp-nav-subs span,
html[dark] [page-subtype="trending"] .ytcp-nav-trending span {
   box-shadow: inset 0 -3px #dcdcdc;
   color: #c1c1c1;
   font-weight: 500;
}
html[dark] .ytcp-appbar-nav {
   display: inline-block;
   vertical-align: top;
   overflow: hidden;
}
.ytcp-load-more-button {
   margin: 20px auto;
   display: block;
   height: 28px;
   border-radius: 2px;
   cursor: pointer;
   font: 11px Roboto, arial, sans-serif;
   padding: 0 10px;
   font-weight: 500;
   outline: 0;
}
.ytcp-load-more-button.ytcp-related {
   margin: 0 auto !important;
}
html:not([dark]) .ytcp-load-more-button {
   border: 1px solid #d3d3d3;
   box-shadow: 0 1px 0 rgba(0, 0, 0, .05);
   background-color: #f8f8f8;
   color: #333;
}
html:not([dark]) .ytcp-load-more-button:hover {
   border-color: #c6c6c6;
   background-color: #f0f0f0;
   box-shadow: 0 1px 0 rgba(0, 0, 0, .1);
}
html:not([dark]) .ytcp-load-more-button:active {
   border-color: #c6c6c6;
   background-color: #e9e9e9;
   box-shadow: inset 0 1px 0 #ddd;
}
html[dark] .ytcp-load-more-button {
   border: 0;
   background-color: #2e2e2e;
   color: #c1c1c1;
}
html[dark] .ytcp-load-more-button:hover {
   background-color: #353535;
}
html[dark] .ytcp-load-more-button:active {
   background-color: #292929;
}
[page-subtype="home"] ytd-two-column-browse-results-renderer,
[page-subtype="subscriptions"] ytd-two-column-browse-results-renderer,
[page-subtype="trending"] tp-yt-app-header {
   margin-top: 60px !important;
}
[page-subtype="trending"] ytd-two-column-browse-results-renderer {
   margin-top: 30px !important;
}
#contents.ytd-compact-autoplay-renderer > ytd-compact-video-renderer.ytd-item-section-renderer:first-child {
   margin-top: 0 !important;
}
ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer:not([expansion="collapsed"]).ytd-watch-next-secondary-results-renderer {
   margin-top: 15px !important;
   margin-bottom: 0 !important;
}
ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer:not([expansion="collapsed"]).ytd-watch-next-secondary-results-renderer:first-child {
   margin-top: 0 !important;
}
ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer:not([expansion="collapsed"]).ytd-watch-next-secondary-results-renderer:last-child {
   margin-bottom: 8px !important;
}
ytd-continuation-item-renderer.ytd-comment-replies-renderer tp-yt-paper-spinner {
   margin-top: -10px !important;
}
.watch-active-metadata yt-formatted-string[is-empty]:not(:empty) {
   display: inline !important;
}
.yt-spec-icon-badge-shape--style-overlay .yt-spec-icon-badge-shape__badge {
   border: none !important;
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer {
   color: var(--yt-spec-text-secondary);
}
#metadata-line.ytd-video-meta-block > .ytd-video-meta-block:not(:first-of-type)::before {
   margin-right: 4px !important;
   margin-left: 1px !important;
}
ytd-segmented-like-dislike-button-renderer {
   order: 100;
   margin-left: auto;
}
.ytd-segmented-like-dislike-button-renderer #text {
   font-size: 11px !important;
   top: 1px;
   position: relative;
   opacity: 1;
   margin-left: 6px !important;
}
#segmented-dislike-button yt-icon-button {
   padding: 6px 0 6px 6px;
   width: max-content;
}
#segmented-dislike-button #text {
   position: relative;
   top: 1px !important;
}
#segmented-like-button tp-yt-paper-button {
   padding-right: 6px !important;
}
ytd-video-primary-info-renderer[flex-menu-enabled] #menu-container.ytd-video-primary-info-renderer {
   display: block !important;
}
#cinematics.ytd-watch-flexy {
   display: none !important;
}
.ytp-fine-scrubbing-exp .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-edu {
   display: none !important;
}
[page-subtype=channels] ytd-rich-item-renderer[is-slim-grid]:first-of-type {
   margin-left: calc(var(--ytd-rich-grid-item-margin)/2) !important;
}
[page-subtype=channels] ytd-rich-item-renderer[is-slim-grid]:last-of-type {
   margin-right: calc(var(--ytd-rich-grid-item-margin)/2) !important;
}
/*Latest UI Border-radius thumbnails*/
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
   border-radius: 0px !important;
}
.ytp-ce-video.ytp-ce-large-round,
.ytp-ce-playlist.ytp-ce-large-round,
.ytp-ce-large-round .ytp-ce-expanding-overlay-background {
   border-radius: 0px !important;
}
.ytp-ce-video.ytp-ce-medium-round,
.ytp-ce-playlist.ytp-ce-medium-round,
.ytp-ce-medium-round .ytp-ce-expanding-overlay-background {
   border-radius: 0px !important;
}
.ytp-videowall-still-round-medium .ytp-videowall-still-image {
   border-radius: 0px !important;
}
yt-icon,
.yt-icon-container.yt-icon {
   width: var(--iron-icon-width, 20px);
   height: var(--iron-icon-height, 20px);
}
ytd-toggle-theme-compact-link-renderer {
   height: 24px !important;
   min-height: 0 !important;
   padding: 0 15px !important;
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:first-child {
   background: 0 0 !important;
   max-width: 78px;
}
ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   height: 26px !important;
}
#sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:not(:last-child) {
   border: 0 !important;
   padding-bottom: 0 !important;
}
tp-yt-paper-item.ytd-compact-link-renderer::before,
tp-yt-paper-item::before {
   content: none !important;
}
#channel-handle.ytd-active-account-header-renderer {
   display: none;
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(2) {
   position: absolute;
   bottom: 10px;
   left: 35px;
}
[menu-style="multi-page-menu-style-type-system"] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   padding: 0px 0px;
   margin: 0px 0 0px -24px;
}
#channel-header #channel-name.ytd-c4-tabbed-header-renderer {
   display: inline;
}
#channel-header p.ytd-c4-tabbed-header-renderer {
   display: none;
}
#channel-header #channel-handle,
#videos-count.ytd-c4-tabbed-header-renderer {
   display: inline !important;
   position: relative;
   bottom: 3px;
}
#subscriber-count[is-empty]:not(.use-shadow):not(:empty) {
   display: inherit;
}
#videos-count.ytd-c4-tabbed-header-renderer::before {
   content: "•";
   margin: 0 4px;
}
.ytp-sb-subscribe.ytp-sb-rounded,
.ytp-sb-unsubscribe.ytp-sb-rounded {
   border-radius: 0px!important;
}
.branding-context-container-inner.ytp-rounded-branding-context {
   border-radius: 0px!important;
}
.ytp-sb-subscribe,
.ytp-sb-unsubscribe {
   border-radius: 0px!important;
}
ytd-popup-container {
   width: 1px!important;
   height: 1px!important;
}
#settings-7kt_buttons_holder {
   text-align: left!important;
}
#settings-7kt .config_var {
   margin: 0px 10px 3px!important;
}
#settings-7kt {
   opacity: 0.98 !important;
   height: 90% !important;
   border: 1px solid rgba(16, 16, 16, 0.11) !important;
   border-top-width: 0px !important;
}
html[dark] ytd-commentbox:not([is-backstage-post]) yt-formatted-string#contenteditable-textarea.ytd-commentbox {
   background: #1c1c1c;
}
ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
   background-color: transparent !important;
   border: none;
   z-index: 0;
   justify-content: flex-start;
   margin-top: -25px;
}
#container.yt-chip-cloud-renderer {
   margin-top: -10px!important;
}
iron-selector.yt-chip-cloud-renderer {
   margin-right: 12px!important;
}
ytd-promoted-sparkles-web-renderer.ytd-item-section-renderer {
   display: none !important;
}
yt-chip-cloud-renderer:not([no-top-margin]) yt-chip-cloud-chip-renderer.yt-chip-cloud-renderer {
   margin: 0px -6px 0px 0px!important;
}
.ytp-autonav-cancelled-mini-mode .ytp-autonav-endscreen-upnext-button,
.countdown-running .ytp-autonav-endscreen-small-mode .ytp-autonav-endscreen-upnext-button {
   border-radius: 0px !important;
}
.ytp-autonav-cancelled-mini-mode .ytp-autonav-endscreen-upnext-thumbnail.rounded-thumbnail,
.countdown-running .ytp-autonav-endscreen-small-mode .ytp-autonav-endscreen-upnext-thumbnail.rounded-thumbnail {
   border-radius: 0px !important;
}
.ytp-ad-player-overlay-flyout-cta-rounded {
   border-radius: 0px !important;
}
#dismissible.ytd-compact-movie-renderer {
   display: none !important;
}
ytd-engagement-panel-section-list-renderer[modern-panels] {
   border-radius: 0px !important;
}
ytd-watch-next-secondary-results-renderer ytd-reel-shelf-renderer {
   display: none;
}
.ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded {
   border-radius: 0px !important;
}
.badge.badge-style-type-live-now-alternate.ytd-badge-supported-renderer {
   border-color: #e62117!important;
   color: #e62117;
   padding: 0 4px!important;
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer span.ytd-badge-supported-renderer {
   padding: 0 !important;
}
.badge.badge-style-type-live-now-alternate.ytd-badge-supported-renderer yt-icon {
   display: none;
}
.badge.badge-style-type-live-now-alternate.ytd-badge-supported-renderer {
   border-color: #e62117!important;
   color: #e62117;
   padding: 0 4px!important;
}
.badge.badge-style-type-live-now-alternate.ytd-badge-supported-renderer yt-icon {
   display: none;
}
ytd-thumbnail.ytd-reel-item-renderer::before {
   padding-top: 52% !important;
   margin-right: 100px !important;
   background-color: transparent !important;
}
yt-horizontal-list-renderer[override-arrow-position-for-reel-items] #left-arrow.yt-horizontal-list-renderer,
yt-horizontal-list-renderer[override-arrow-position-for-reel-items] #right-arrow.yt-horizontal-list-renderer {
   height: 110px !important;
}
html[dark] div.ytd-simple-menu-header-renderer ytd-button-renderer {
   filter: invert(0);
}
html[dark] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
   background-color: #212121;
}
html[dark] yt-multi-page-menu-section-renderer.style-scope.ytd-multi-page-menu-renderer {
   background: #333333;
}
ytd-multi-page-menu-renderer[scrollbar-rework] .menu-container.ytd-multi-page-menu-renderer {
   background: #212121 !important;
}
html[dark] #guide-content.ytd-app {
   background: #222;
}
#details.ytd-reel-item-renderer {
   margin-left: 10px;
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start {
   border-radius: 0 !important;
}

.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading .yt-spec-button-shape-next__icon {
   margin-right: 6px!important;
   margin-left: -6px!important;
}
.yt-spec-button-shape-next__icon {
   fill: transparent!important;
}
.yt-spec-button-shape-next {
   outline-width: 0!important;
   box-sizing: border-box!important;
   background: none!important;
}
ytd-masthead[guide-refresh] yt-icon-button.ytd-masthead:hover,
ytd-masthead[guide-refresh] ytd-topbar-menu-button-renderer.ytd-masthead:hover,
ytd-masthead[guide-refresh] ytd-notification-topbar-button-renderer.ytd-masthead:hover {
   background-color: transparent!important;
}
ytd-thumbnail[size=medium] a.ytd-thumbnail,
ytd-thumbnail[size=medium]:before {
   border-radius: 0px!important;
}
ytd-playlist-thumbnail[size="large"] a.ytd-playlist-thumbnail,
ytd-playlist-thumbnail[size="large"]:before {
   border-radius: 0 !important;
}
ytd-thumbnail[size=large] a.ytd-thumbnail,
ytd-thumbnail[size=large]:before {
   border-radius: 0 !important;
}
ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail,
ytd-playlist-thumbnail[size="medium"]:before {
   border-radius: 0 !important;
}
.yt-spec-touch-feedback-shape--touch-response .yt-spec-touch-feedback-shape__fill {
   background-color: #000!important;
}
.yt-spec-touch-feedback-shape--touch-response .yt-spec-touch-feedback-shape__fill {
   background-color: transparent!important;
}
.yt-spec-touch-feedback-shape--touch-response {
   background-color: transparent!important;
}
ytd-macro-markers-list-item-renderer[modern][rounded][layout=MACRO_MARKERS_LIST_ITEM_RENDERER_LAYOUT_VERTICAL] {
   border-radius: 0!important;
}
.yt-spec-touch-feedback-shape {
   display: none!important;
}
html[dark] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
color: #a6a6a6 !important;
}
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
   background-color: transparent!important;
   color: #656565 !important;
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end {
   border-radius: 0px!important;
}
.ytp-ce-video.ytp-ce-large-round,
.ytp-ce-playlist.ytp-ce-large-round,
.ytp-ce-large-round .ytp-ce-expanding-overlay-background {
   border-radius: 0px !important;
}
ytd-guide-entry-renderer[guide-refresh] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
ytd-guide-entry-renderer[guide-refresh] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus {
   border-radius: 0px !important;
}
html[dark],
[dark] {
   --yt-spec-base-background: #181818 !important;
}
ytd-playlist-video-renderer[amsterdam] {
   border-radius: 0px !important;
}
html:not([dark]) ytd-app {
   background-color: #f1f1f1!important;
}
html[dark] ytd-guide-renderer.ytd-app {
   background-color: #222!important;
}
html[dark] ytd-guide-renderer.ytd-app {
   background-color: #222;
}
ytd-masthead[dark] #container.ytd-masthead {
   background-color: #222;
}
ytd-multi-page-menu-renderer[sheets-refresh] {
   border-radius: 0px !important;
}
#avatar-btn.ytd-topbar-menu-button-renderer:focus yt-img-shadow.ytd-topbar-menu-button-renderer {
   box-shadow: 0 0 0 0px !important;
}
html:not([dark]) #notification-preference-button {
   margin-top: 1px !important;
   margin-left: 65px !important;
   width: 28px;
   border-right: 1px solid #ccc;
}
html[dark] #notification-preference-button {
   margin-top: 1px !important;
   margin-left: 65px !important;
   width: 28px;
   border: 1px solid #333;
}
#info #menu .dropdown-trigger yt-icon::after,
ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer {
   content: "" !important;
}
.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing {
   width: fit-content;
   margin: 0px -20px 0px -9px;
}

.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing .yt-spec-button-shape-next__secondary-icon {
   display: none;
}
.ytd-subscribe-button-renderer.style-scope yt-icon:hover,
.yt-icon-container.yt-icon {
   opacity: 0.6;
}
.ytd-subscribe-button-renderer.style-scope yt-icon,
.yt-icon-container.yt-icon {
   width: 18px !important;
   height: 18px !important;
   margin: 3px 2px 0px 0px;
   opacity: 0.5;
}
tp-yt-paper-button.style-scope.ytd-subscribe-button-renderer {
   display: flex!important;
}
#background.ytd-masthead {
   z-index: -1 !important;
   opacity: 1 !important;
   position: absolute !important;
   height: 50px !important;
   width: 100% !important;
   background: var(--yt-spec-brand-background-primary) !important;
}
.style-scope.ytd-item-section-renderer tp-yt-paper-button.ytd-subscribe-button-renderer {
   border: 1px solid #ccc !important;
   background-color: #f8f8f8 !important;
   color: #333 !important;
   height: 20px !important;
   border-radius: 1px !important;
   padding: 0 3px 0 4px !important;
   padding-left: 10px !important;
   padding-right: 10px !important;
   font-size: 11px !important;
   font-weight: 500 !important;
}
html[dark] .yt-spec-icon-badge-shape__icon {
   filter: invert(1) !important;
}
.yt-spec-icon-badge-shape__icon {
   fill: none !important;
   left: 0 !important;
   opacity: .7 !important;
   margin-top: -2px !important;
   margin-left: 1px !important;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -698px -257px !important;
   background-size: auto !important;
   width: 30px !important;
   height: 30px !important;
   filter: invert(0.40) !important;
}
.yt-icon-button[aria-label="Settings"] {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -624px 2px !important;
   opacity: .5 !important;
   color: transparent !important;
}
ytd-notification-renderer {
   border-bottom: 1px solid #ddd !important;
}
html[dark] ytd-notification-renderer {
   border-bottom-color: #333 !important;
}
html[dark] .yt-icon-button[aria-label="Settings"] {
   filter: invert(1) !important;
}
.yt-spec-icon-badge-shape__icon:hover {
   filter: contrast(0.3) !important;
   opacity: 0.8 !important;
}
#buttons.ytd-masthead > ytd-button-renderer.style-default[is-paper-button] {
   background: url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) 0px -74px !important;
   background-size: auto;
   max-width: 32px !important;
   height: 24px !important;
   opacity: 0.6;
   display: inherit;
   color: transparent;
   overflow: clip;
}
#buttons.ytd-masthead > ytd-button-renderer.style-default[is-paper-button]:hover {
   opacity: 0.8;
}
html[dark] #buttons.ytd-masthead > ytd-button-renderer.style-default[is-paper-button] {
   filter: invert(1)
}

.yt-core-image--loaded {
   visibility: inherit;
}

.yt-spec-avatar-shape--cairo-refresh.yt-spec-avatar-shape--live-ring::after {
   display: none !important;
}

.yt-spec-avatar-shape--cairo-refresh .yt-spec-avatar-shape__live-badge {
   display: none !Important;
}

#buttons.ytd-masthead > .ytd-masthead:not(:last-child) {
   margin-right: 23px !Important;
}
.yt-spec-icon-badge-shape__icon:hover {
   opacity: 0.8
}
.yt-spec-icon-badge-shape__icon:active {
   filter: contrast(10) !important;
}
.yt-spec-icon-badge-shape--type-notification.yt-spec-icon-badge-shape > .yt-spec-icon-badge-shape__icon > yt-icon {
   display: none !important;
}
yt-interaction {
   display: none !important;
}
yt-img-shadow#avatar.ytd-notification-renderer,
yt-img-shadow#avatar.ytd-notification-renderer img.yt-img-shadow {
   border-radius: 50%!important;
}
html[dark] ytd-multi-page-menu-renderer[scrollbar-rework] .menu-container.ytd-multi-page-menu-renderer {
   background: #212121!important;
}
ytd-multi-page-menu-renderer[scrollbar-rework] .menu-container.ytd-multi-page-menu-renderer {
   background: #f5f5f5!important;
}
.dropdown-content.paper-menu-button,
html:not([dark]) ytd-multi-page-menu-renderer {
   border: 1px solid #c5c5c5!important;
   border-top: 1px solid #c5c5c5!important;
   box-shadow: 0 0 15px rgba(0, 0, 0, .18)!important;
}
h2.ytd-simple-menu-header-renderer {
   font-weight: 500 !important;
   font-size: 14px !important;
   top: 2px!important;
   position: relative !important;
}
ytd-multi-page-menu-renderer.style-scope.ytd-popup-container {
   max-height: 432px!important;
}
.metadata.ytd-notification-renderer {
   letter-spacing: 0px!important;
   font-size: 12px!important;
   top: -8px!Important;
   position: relative;
}
#notification-count {
   border-radius: 2px;
   background: #cb4437;
   z-index: 90;
   font-size: 11px!important;
   line-height: 15px!important;
}
#notification-count:after {
   content: "";
   width: 15px;
   height: 15px;
   border-bottom: 1px solid #fff;
   border-left: 1px solid #fff;
   position: absolute;
   left: -0px;
   z-index: 9
}
ytd-simple-menu-header-renderer {
   border-bottom: none;
}
ytd-multi-page-menu-renderer[scrollbar-rework] .menu-container.ytd-multi-page-menu-renderer {
   border-top: none;
}
ytd-notification-renderer.unread #new.ytd-notification-renderer {
   background-color: transparent;
}
#segmented-dislike-button #text {
   top: 2px !important;
   font-family: "Roboto",
   "Arial",
   sans-serif;
}
.choice-image.ytd-backstage-poll-renderer {
   height: 90px;
   width: 90px;
}
ytd-backstage-poll-renderer[is-image-poll] .vote-percentage-area.ytd-backstage-poll-renderer {
   align-items: center;
   height: 10%;
   margin: 46%;
   width: 100%;
}
ytd-backstage-poll-renderer {
   --ytd-backstage-poll-choice-height: 90px;
   --ytd-backstage-image-poll-choice-image-size: 20px;
   --ytd-backstage-image-poll-choice-height: 20px;
}
#sign-in.yt-simple-endpoint.ytd-backstage-poll-renderer {
   padding-bottom: 1px !important;
   padding-top: 40px;
   height: 24px !important;
}
ytd-backstage-poll-renderer[is-image-poll] .choice-text.ytd-backstage-poll-renderer {
   color: var(--yt-spec-text-primary);
   padding: 40px;
   width: 100%;
}
tp-yt-paper-item.ytd-backstage-poll-renderer[selected] .vote-percentage.ytd-backstage-poll-renderer {
   color: #128ee9 !important;
   font-size: 11px !important;
   font-weight: 500 !important;
   left: -4px !important;
}
tp-yt-paper-item.ytd-backstage-poll-renderer:not([selected]) .vote-percentage.ytd-backstage-poll-renderer {
   color: #000 !important;
   font-size: 11px !important;
   font-weight: 500 !important;
   left: -4px !important;
}
yt-icon.style-scope.ytd-badge-supported-renderer,
ytd-author-comment-badge-renderer:not([m]) #icon.ytd-author-comment-badge-renderer {
   color: transparent;
   fill: transparent !important;
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflbdpYum.webp) -146px -556px;
   height: 9px;
}
.sbdd_b {
   border-radius: 0px;
}
ytd-channel-tagline-renderer {
   display: none !important;
}
#meta.ytd-c4-tabbed-header-renderer {
   min-width: 150px;
   flex: 1;
   flex-basis: 0%;
   flex-basis: 0.000000001px;
   margin-top: -30px;
   padding-top: 5px;
   margin-left: -10px;
}
#tabsContent.tp-yt-paper-tabs:not(.iron-selected) {
   border-bottom: 4px solid transparent;
}
#tabsContent.scrollable.tp-yt-paper-tabs {
   padding-top: 4px;
}
#avatar.ytd-c4-tabbed-header-renderer,
#avatar.ytd-c4-tabbed-header-renderer img.yt-img-shadow {
   top: -96px !important;
   position: relative !important;
   overflow: visible !important;
   height: 110px !important;
   width: 110px !important;
   margin-top: -3px !important;
   margin-left: 0px !important;
}
#subscriber-count.ytd-c4-tabbed-header-renderer {
   position: absolute;
   font-size: 11px !important;
   letter-spacing: 0 !important;
   color: #737373;
   height: 22px !important;
   line-height: 24px !important;
   border: 1px solid #ccc;
   padding: 0 72px 0 8px !important;
   border-radius: 2px !important;
   text-align: left !important;
   left: 1160px !important;
   top: 3px !important;
   max-width: 21px;
   padding-left: 0px;
   overflow: hidden;
}
#header.ytd-browse ytd-button-renderer:nth-of-type(1) #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   font-size: 0 !important;
   color: #fff !important;
   filter: invert(0);
   position: absolute;
   left: 83px !important;
   top: -9px !important;
}
ytd-button-renderer #button.ytd-button-renderer {
   color: var(--yt-button-color, transparent);
   background-color: transparent;
   text-transform: var(--yt-button-text-transform, inherit);
}
ytd-c4-tabbed-header-renderer[use-modern-style] .meta-item.ytd-c4-tabbed-header-renderer {
   display: inline-block;
   margin-right: 0px !important;
   white-space: nowrap;
   color: var(--yt-spec-text-secondary);
   font-family: "Roboto",
   "Arial",
   sans-serif;
   font-size: 1.4rem;
   line-height: 2rem;
   font-weight: 400;
}
ytd-c4-tabbed-header-renderer[use-modern-style] #buttons.ytd-c4-tabbed-header-renderer {
   padding: 0px 0;
   margin-top: -27px;
   padding-right: 72px;
}
ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer {
   overflow: hidden;
   border-radius: 0px !important;
   isolation: isolate;
}
ytd-channel-video-player-renderer {
   padding: 0px 0 18px !important;
   margin-top: -10.5px;
}
button#frex-downbut {
   background: none;
   color: red;
   border: medium none;
   display: none;
}
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img,
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay,
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay {
   -webkit-border-radius: 0px;
   -moz-border-radius: 0px;
   border-radius: 0px;
}
ytd-live-chat-frame[rounded-container] {
   border-radius: 0px;
}
.ytcp-main-appbar {
   margin: -12px;
   width: 104%;
   text-align: center;
   line-height: 42px;
   height: 42px;
   border-bottom: 1px solid #e8e8e8;
   border-left: 1px solid #e8e8e8;
   background-color: #fff;
   position: fixed;
   z-index: 2001;
   font-size: 13px;
   font-family: Roboto,
   arial,
   sans-serif;
}
ytd-browse[page-subtype="channels"] {
   background: var(--yt-spec-general-background-b);
   background-color: #f1f1f1 !important;
}
#guide #guide-section-title.ytd-guide-section-renderer {
   padding: 1px 0 11px !important;
   margin: 0 5px !important;
   text-transform: uppercase !important;
   font-weight: normal !important;
   font-size: 11px !important;
   height: 10px !important;
}
#video-title.ytd-rich-grid-media {
   color: var(--yt-spec-text-primary) !important;
   font-family: "Roboto",
   "Arial",
   sans-serif !important;
   font-size: 1.3rem !important;
   line-height: 1.6rem !important;
   font-weight: 500 !important;
   overflow: hidden !important;
   display: block !important;
   max-height: 3.6rem !important;
   -webkit-line-clamp: 2 !important;
   display: flexbox !important;
   display: -webkit-box !important;
   -webkit-box-orient: vertical !important;
   text-overflow: ellipsis !important;
   white-space: normal !important;
   margin-top: 2px !important;
}
html[dark] .super-title.ytd-video-primary-info-renderer a.yt-simple-endpoint.yt-formatted-string {
   background-color: #212121 !important
}
.super-title.ytd-video-primary-info-renderer a.yt-simple-endpoint.yt-formatted-string {
   color: #128ee9 !important;
   background-color: #f1f1f1 !important;
   border-radius: 2px !important;
   padding: 0 4px !important;
   margin-right: 6px !important;
}
html[dark] ytd-browse[page-subtype="channels"] {
   background: var(--yt-spec-general-background-b);
   background-color: #181818 !important;
}
html[dark] ytd-notification-renderer {
   border-bottom-color: #333 !important;
   background: #333 !important;
}
html[dark] #items.yt-multi-page-menu-section-renderer > .yt-multi-page-menu-section-renderer:not([compact-link-style="compact-link-style-type-disclaimer"]).yt-multi-page-menu-section-renderer:not([component-style="RENDER_STYLE_SIMPLE_HEADER"]).yt-multi-page-menu-section-renderer:hover {
   background-color: #0d0d0d !important;
}
html[dark] [menu-style="multi-page-menu-style-type-system"] #container #sections {
   background: #292929 !important;
   padding-bottom: 0px !important;
}
[menu-style="multi-page-menu-style-type-system"] #container #sections {
   padding-bottom: 0px !important;
   background: #f5f5f5 !important;
}
.ytp-ad-overlay-container .ytp-ad-overlay-image img,
.ytp-ad-overlay-container .ytp-ad-text-overlay,
.ytp-ad-overlay-container .ytp-ad-enhanced-overlay {
   -webkit-border-radius: 8px !important;
   -moz-border-radius: 8px !important;
   border-radius: 0px !important;
}
.iv-branding-active .branding-context-container-inner {
   border-radius: 0px !important;
}
yt-button-shape.ytd-subscribe-button-renderer {
   max-width: fit-content !important;
   flex: none !important;
   display: inline-block !important;
   font-weight: 400 !important;
   font-size: 9px !important;
   line-height: 22px !important;
   border-radius: 2px 0 0 2px !important;
   box-shadow: 0 1px 0 rgb(0 0 0 / 5%) !important;
   padding: 1px 0px 0px 0px !important;
   height: 22px !important;
   text-align: center !important;
   min-width: 0 !important;
   font-family: roboto !important;
   z-index: 1 !important;
   color: #fefefe !important;
   margin: 0px 0px 0px 0px !important;
   font-style: normal !important;
   border: solid 1px transparent !important;
}
h3.ytd-rich-grid-media {
   margin: 2px 0 4px 0 !important;
}
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) > tp-yt-paper-button:not([subscribed]):not([page-subtype="subscriptions"] #subscribe-button tp-yt-paper-button)::before,
#subscribe-button > ytd-button-renderer:not(.style-primary) > a > tp-yt-paper-button:not([subscribed]):not([page-subtype="subscriptions"] #subscribe-button tp-yt-paper-button)::before,
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) yt-button-shape > button:not(.yt-spec-button-shape-next--tonal):not([page-subtype="subscriptions"] #subscribe-button yt-button-shape > button)::before,
#subscribe-button > ytd-button-renderer:not(.style-primary) yt-button-shape > button:not(.yt-spec-button-shape-next--tonal):not([page-subtype="subscriptions"] #subscribe-button yt-button-shape > button)::before {
   content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAxLTE3VDIxOjE4OjA1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMS0xN1QyMToyMiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMS0xN1QyMToyMiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MmQ0ZWZhNi02NzMxLTFkNGEtOGQ2Ni00ZTMwYzFmMzI1MzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzJkNGVmYTYtNjczMS0xZDRhLThkNjYtNGUzMGMxZjMyNTM2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NzJkNGVmYTYtNjczMS0xZDRhLThkNjYtNGUzMGMxZjMyNTM2Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MmQ0ZWZhNi02NzMxLTFkNGEtOGQ2Ni00ZTMwYzFmMzI1MzYiIHN0RXZ0OndoZW49IjIwMjEtMDEtMTdUMjE6MTg6MDUrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4SMynAAAAAY0lEQVQoz2P8//+/HwMDwzQglmYgDTwF4ixGoAFPyNAMNwRkwH8GCgBOA54rSTAILlnNwGFlS6YBHKwMDFLCDPyTZjBw+QSQaQAUcOZmMwh0TxgIAyjyAqWBSEo0UpyQKErKAClORkVlDNckAAAAAElFTkSuQmCC') !important;
   background-size: auto;
   width: 14px;
   padding-top: 2px;
   margin-right: 7px;
   margin-left: -12px;
}
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) > tp-yt-paper-button[subscribed]::before,
#subscribe-button > ytd-button-renderer:not(.style-primary) > a > tp-yt-paper-button[subscribed]::before,
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) yt-button-shape > button.yt-spec-button-shape-next--tonal::before,
#notification-preference-button yt-button-shape > button.yt-spec-button-shape-next--tonal::before {
   content: "";
   border-right: 1px solid #909090;
   border-bottom: 1px solid #909090;
   height: 0px;
   width: 3px;
   transform: rotate(45deg);
   margin-left: -9px !important;
   margin-right: 8px;
   margin-bottom: 2px;
}
#owner-sub-count.ytd-video-owner-renderer {
   font-size: 11px !important;
   letter-spacing: 0 !important;
   color: #737373;
   height: 22px !important;
   line-height: 24px !important;
   border: 1px solid #ccc;
   border-left-width: 1px;
   border-left-width: 0 !important;
   padding: 0 6px 0 11px !important;
   border-radius: 2px !important;
   text-align: center !important;
   max-width: 28px !important;
   overflow: hidden !important;
   left: -3px;
   position: relative !important;
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled.yt-spec-button-shape-next > .yt-spec-button-shape-next__button-text-content > .yt-core-attributed-string--white-space-no-wrap.yt-core-attributed-string {
   color: #fff;
}
html[dark] .yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap {
   font-size: 12px !important;
   color: #8e8d8c;
}
.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap {
   font-size: 12px !important;
   color: #000;
}
html:not([dark]) ytd-browse[page-subtype="channels"] {
   background-color: #f1f1f1 !important;
}
html:not([dark]) ytd-browse[page-subtype="playlist"] ytd-two-column-browse-results-renderer.ytd-browse,
ytd-browse[page-subtype="show"] ytd-two-column-browse-results-renderer.ytd-browse {
   background-color: #f1f1f1 !important;
}
ytd-browse[page-subtype="playlist"],
ytd-browse[page-subtype="show"] {
   background-color: transparent !important;
}
#content.ytd-channel-tagline-renderer {
   font-size: 12px !important;
}
#endpoint.ytd-channel-tagline-renderer {
   margin-top: -15px;
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus {
   border-radius: 0px !important
}
ytd-multi-page-menu-renderer {
   border-radius: 0px !important;
}
yt-icon-button.ytd-masthead:hover,
ytd-topbar-menu-button-renderer.ytd-masthead:hover,
ytd-notification-topbar-button-renderer.ytd-masthead:hover {
   background-color: transparent !important;
}
ytd-app #info {
   white-space: nowrap !important;
}

/*
  ytd-browse[page-subtype="playlist"][has-sidebar] ytd-two-column-browse-results-renderer.ytd-browse, ytd-browse[page-subtype="show"][has-sidebar] ytd-two-column-browse-results-renderer.ytd-browse {
    padding-left: 104px !important;
  }
*/
ytd-ad-slot-renderer {
   display: none !important;
}
ytd-video-description-transcript-section-renderer[modern] {
   border-top: unset;
   display: none !important;
}
#action-buttons.ytd-video-description-infocards-section-renderer {
   display: none !important;
}
#guide-icon.ytd-masthead {
   color: transparent !important;
}
.badge.badge-style-type-ypc.style-scope.ytd-badge-supported-renderer {
   display: none !important;
}
div#inner-header-container div#buttons > div#edit-buttons a[href$="editing"] tp-yt-paper-button#button {
   display: none !important;
}
/*Progress bar over thumbnail*/
#progress.ytd-thumbnail-overlay-resume-playback-renderer {
   display: block !important;
   background-color: red !important;
   opacity: 1 !important;
}
.yt-spec-button-shape-next--size-s {
   padding: 0 12px;
   height: 22px;
   font-size: 12px;
   line-height: 32px;
   border-radius: 16px;
}
ytd-comment-replies-renderer #creator-thumbnail.ytd-comment-replies-renderer yt-img-shadow.ytd-comment-replies-renderer {
   background-color: transparent;
   overflow: hidden;
   width: 24px;
   height: 24px;
}
ytd-comment-replies-renderer:not([modern]) #expander.ytd-comment-replies-renderer .dot.ytd-comment-replies-renderer {
   color: transparent;
}
ytd-grid-playlist-renderer.style-scope:nth-child(1) > ytd-playlist-thumbnail:nth-child(1) > yt-collections-stack:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
   background-color: rgb(89,
   89,
   89);
}
ytd-two-column-search-results-renderer .style-scope.ytd-reel-shelf-renderer {
   display: none;
}
.yt-core-attributed-string--highlight-text-decorator {
   background-color: transparent !important;
   border-radius: 0;
}
/* New live-chat */
ytd-watch-flexy[flexy] #chat.ytd-watch-flexy:not([collapsed]) {
   min-height: 591px !important;
}
ytd-live-chat-frame[rounded-container] {
   border-radius: 0px !important;
}
ytd-live-chat-frame[rounded-container] iframe.ytd-live-chat-frame {
   border-radius: 0px 0px 0 0 !important;
}
html[dark] ytd-live-chat-frame #show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame {
   background-color: #212121;
}
ytd-live-chat-frame[rounded-container] #show-hide-button.ytd-live-chat-frame ytd-toggle-button-renderer.ytd-live-chat-frame {
   border-radius: 0 0 0px 0px !important;
}
#show-hide-button.ytd-live-chat-frame > ytd-button-renderer.ytd-live-chat-frame,
#show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame {
   color: var(--yt-live-chat-secondary-text-color);
}
#chat.ytd-watch-flexy {
   margin-left: 0px !important;
   margin-right: 0px !important;
}
#chat.ytd-watch-flexy,
#donation-shelf.ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy,
#donation-shelf.ytd-watch-flexy ytd-donation-unavailable-renderer.ytd-watch-flexy,
#panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy,
#playlist.ytd-watch-flexy {
   margin-bottom: 10px !important;
}
#chat-container.ytd-watch-flexy:not([chat-collapsed]) {
   margin-left: -30px !important;
   margin-right: 30px !important;
   margin-bottom: 10px !important;
   margin-top: 8px !important;
}
yt-live-chat-banner-renderer {
   border-radius: 2px !important;
}
#live-chat-header-context-menu.yt-live-chat-header-renderer {
   color: var(--yt-spec-icon-inactive) !important;
}
#live-chat-header-context-menu.yt-live-chat-header-renderer {
   padding: 0 !important;
}
#live-chat-header-context-menu.yt-live-chat-header-renderer {
   height: auto !important;
}
ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy:not([collapsed]) {
   height: var(--ytd-watch-flexy-chat-max-height);
   border-color: #e7e7e7;
}
html[dark] ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy:not([collapsed]) {
   height: var(--ytd-watch-flexy-chat-max-height);
   border-color: #212121;
}
#time-status.ytd-thumbnail-overlay-time-status-renderer {
   background-color: transparent !important;
   padding: 0 !important;
   height: 12px !important;
}
ytd-badge-supported-renderer.ytd-thumbnail-overlay-time-status-renderer {
   margin: 0px !important;
}
#more yt-formatted-string {
   visibility: hidden !important;
}
#more yt-formatted-string::before {
   visibility: visible !important;
   content: "SHOW MORE" !important;
}
ytd-channel-tagline-renderer {
   display: none;
}
ytd-badge-supported-renderer.ytd-channel-name {
   vertical-align: top;
}
#channel-tagline.ytd-c4-tabbed-header-renderer > ytd-channel-tagline-renderer.ytd-c4-tabbed-header-renderer {
   padding: 5px 0;
}
ytd-channel-header-links-view-model {
   display: block;
}
#meta.ytd-c4-tabbed-header-renderer {
   margin-top: -2px;
   padding-top: 5px;
   margin-left: -10px;
}
#container.ytd-channel-header-links-view-model {
   position: relative;
   top: -11px;
   left: 0;
}
.yt-core-attributed-string--link-inherit-color .yt-core-attributed-string__link--call-to-action-color {
   font-size: 11px !important;
}
#ytd-player {
   border-radius: 0px !important;
}
#related {
   position: relative !important;
   left: 15px;
}
ytd-comments {
   position: relative !important;
   top: 15px;
}
ytd-live-chat-frame {
   position: relative !important;
   left: 15px;
}
#button[aria-label="Show more"][role="button"] {
   padding: 15px !important;
   margin-top: 15px;
}
ytd-live-chat-frame[collapsed] {
   height: 31px!important;
}
ytd-notification-topbar-button-shape-renderer yt-icon {
   color: var(--yt-spec-icon-inactive);
}
#more-replies yt-formatted-string::before {
   content: "View ";
   text-transform: none;
}
#less-replies yt-formatted-string::before {
   content: "Hide ";
   text-transform: none;
}
.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s {
   height: 22px;
}
#info.ytd-channel-renderer {
   display: inline-table !important;
   padding: 0px 15px 30px 0px !important;
   min-width: 50%;
   max-width: 50%;
}
#info-section.ytd-channel-renderer {
   display: inline-table !important;
   min-width: 50%;
   max-width: 50%;
}
#about-these-results {
   display: none;
}
#chip-bar.ytd-search-header-renderer {
   display: none;
}
ytd-search-header-renderer[has-chip-bar] {
   height: 20px !important;
}
ytd-search-header-renderer {
   align-items: normal !important;
}
#expandable-metadata.ytd-video-renderer:not(:empty) {
   display: none;
}
ytd-search #sub-menu {
   margin-bottom: 15px !important;
}
.dropdown-content.style-scope.tp-yt-paper-menu-button {
   border-radius: 0px !important;
}
ytd-menu-popup-renderer {
   border-radius: 0px !important;
}
ytd-c4-tabbed-header-renderer[use-modern-style][has-channel-header-links] #inner-header-container.ytd-c4-tabbed-header-renderer {
   margin-top: 0;
   margin-left: 10px;
}
#description.ytd-watch-metadata {
   --ytd-text-inline-expander-button-color: var(--yt-spec-text-primary);
   position: relative !important;
   border-radius: 0px !important;
   background: #fff !important;
   min-width: 100% !important;
   min-width: max(381px,
   50% - 12px) !important;
   -moz-box-flex: 1 !important;
   flex: 1 !important;
   flex-basis: 0.000000001px !important;
   font-family: "Roboto",
   "Arial",
   sans-serif !important;
   font-size: 1.4rem !important;
   line-height: 2rem !important;
   font-weight: 400 !important;
   border-top: 0px solid #181818 !important;
}
html[dark] #description.ytd-watch-metadata {
   background: #212121 !important;
}
.button.ytd-text-inline-expander {
   text-transform: capitalize !important;
}
html[dark] ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata:hover {
   background: #212121;
}
ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata:hover {
   background: #fff;
}
#expand.ytd-text-inline-expander {
   position: absolute !important;
   bottom: -5px !important;
   left: 0px !important;
   right: 0px !important;
   border-top: 1px solid #d5d5d5;
   padding-top: 6px;
}


html[dark] #expand.ytd-text-inline-expander {
   border-top: 1px solid #5a5a5a;
}
#snippet.ytd-text-inline-expander {
   white-space: pre-wrap !important;
   padding-bottom: 30px !important;
}
#subscriber-count.ytd-c4-tabbed-header-renderer {
   position: absolute;
   font-size: 11px !important;
   letter-spacing: 0 !important;
   color: #737373;
   height: 22px !important;
   line-height: 24px !important;
   /* border: 1px solid #ccc; */
   padding: 0 72px 0 8px !important;
   border-radius: 2px !important;
   text-align: left !important;
   left: 1160px !important;
   top: 17px !important;
   max-width: 21px;
   padding-left: 0px;
   overflow: hidden;
}
#subscribe-button {
   margin-top: 14px !important;
   position: absolute !important;
   left: 58px !important;
}
#upload-info > #owner-sub-count {
   position: absolute !important;
   left: 4px !important;
   margin-left: 142px !important;
   min-width: fit-content;
   height: 100% !important;
   padding-left: 45px !important;
   top: 67px !important;
   visibility: visible;
}

html[dark] #top-row.ytd-watch-metadata {
   background-color: #212121;
}
html[dark] ytd-watch-metadata[actions-on-separate-line] #top-row.ytd-watch-metadata {
   display: block;
   border-bottom: 0px !important;
}
#top-row.ytd-watch-metadata {
   margin-top: -4px !important;
   display: block !important;
   -moz-box-orient: horizontal !important;
   -moz-box-direction: normal !important;
   flex-direction: row !important;
   -moz-box-pack: start !important;
   justify-content: flex-start !important;
   background-color: #fff;
   padding: 10px !important;
}
html[dark] #top-row.ytd-watch-metadata {
   border-bottom: 0px !important;
}
html[dark] div#top-row.style-scope.ytd-watch-metadata {
   border: 0px !important;
}
#owner-sub-count.ytd-video-owner-renderer {
   position: absolute !important;
   max-height: 23px !important;
}
html[dark] #collapse.ytd-text-inline-expander {
   border-top: 1px solid #5a5a5a !important;
}

html[dark] h1.ytd-watch-metadata {
   background-color: #212121;
}
h1.ytd-watch-metadata {
   font-family: "Roboto",
   "Arial",
   sans-serif !important;
   color: var(--ytd-video-primary-info-renderer-title-color,
   var(--yt-spec-text-primary)) !important;
   font-size: 20px !important;
   font-variant: var(--ytd-video-primary-info-renderer-title-font-variant,
   inherit) !important;
   text-shadow: var(--ytd-video-primary-info-renderer-title-text-shadow,
   none) !important;
   font-weight: 400 !important;
   white-space: normal !important;
   margin: 0 !important;
   background-color: #fff;
   padding: 5px 10px 0px 10px !important;
   text-overflow: ellipsis !important;
   overflow: hidden !important;
   -webkit-line-clamp: 1 !important;
   display: -webkit-box !important;
   word-wrap: anywhere;
   -webkit-box-orient: vertical;
   max-height: 4.6rem;
}
ytd-watch-metadata.ytd-watch-flexy {
   margin-top: var(--ytd-margin-2x) !important;
   margin-bottom: -1px !important;
}
yt-formatted-string[ellipsis-truncate-styling] a.yt-formatted-string {
   display: block !important;
   margin-right: auto !important;
   padding-right: auto !important;
   white-space: hidden !important;
}
ytd-comments-header-renderer .count-text.ytd-comments-header-renderer span:nth-of-type(2) {
   order: 1 !important;
   font-weight: 500 !important;
   text-transform: initial !important;
}
ytd-button-renderer.style-default[is-paper-button] {
   background: transparent !important
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button {
   width: 36px;
   padding: 0;
   padding-right: 6px !important;
}
ytd-badge-supported-renderer[system-icons] .badge-style-type-verified.ytd-badge-supported-renderer yt-icon.ytd-badge-supported-renderer,
ytd-badge-supported-renderer[system-icons] .badge-style-type-verified-artist.ytd-badge-supported-renderer yt-icon.ytd-badge-supported-renderer,
ytd-badge-supported-renderer[system-icons] .badge-style-type-collection.ytd-badge-supported-renderer yt-icon.ytd-badge-supported-renderer,
ytd-badge-supported-renderer[system-icons] .badge-style-type-ypc-transparent.ytd-badge-supported-renderer yt-icon.ytd-badge-supported-renderer {
   height: 10px ! important;
}
html[dark] ytd-watch-metadata[flex-menu-enabled] #actions-inner.ytd-watch-metadata {
   width: 100%;
   border-top: 1px solid #5a5a5a;
}
ytd-watch-metadata[flex-menu-enabled] #actions-inner.ytd-watch-metadata {
   width: 100%;
   border-top: 1px solid #d5d5d5;
}
#menu.ytd-watch-metadata {
   --yt-button-icon-size: 36px !important;
   padding-top: 6px !important;
}
ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer {
   margin-left: 18px !important;
   padding-top: 6px !important;
   margin-right: 24px !important;
   margin-top: -6px !important;
}
ytd-text-inline-expander {
   display: block;
   position: relative;
   overflow: hidden;
   contain: content;
   color: #333 !important;
   font-family: roboto !important;
   font-size: 1.33rem !important;
   font-weight: 400 !important;
   white-space: normal !important;
   line-height: 15.4px !important;
   letter-spacing: 0px !important;
}
html[dark] ytd-text-inline-expander {
   color: #fff !important;
}
html[dark] ytd-watch-flexy button[aria-label="Share"] .yt-spec-button-shape-next__icon,
html[dark] ytd-watch-flexy #above-the-fold #top-level-buttons-computed ytd-button-renderer .yt-spec-button-shape-next__icon {
   filter: invert(1);
}
html[dark] td-text-inline-expander {
   color: #fff;
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after {
   background: transparent !important;
}
.yt-tab-shape-wiz__tab {
   color: #606060 !important;
   font-family: roboto !important;
   font-size: 13px !important;
   line-height: 2.2rem !important;
   font-weight: 500 !important;
}
.yt-tab-shape-wiz {
   -moz-box-align: center !important;
   align-items: center !important;
   cursor: pointer !important;
   display: -moz-box !important;
   display: flex !important;
   flex-shrink: 0 !important;
   height: 35px !important;
   -moz-box-pack: center !important;
   justify-content: center !important;
   margin-right: 24px !important;
   min-width: 48px !important;
   padding: 0 !important;
   position: relative !important;
   font-family: roboto !important;
}
#tabsContent.tp-yt-paper-tabs > :not(#selectionBar) {
  height: 29px !important;

}
#tabsContent.scrollable.tp-yt-paper-tabs {
  padding-top: 4px !important;
}
tp-yt-app-toolbar.ytd-tabbed-page-header {
	position: relative !important;
	margin-top: -20px !important;
}
#tabsContent.tp-yt-paper-tabs > :not(#selectionBar) {
   height: 29px !important;
   padding-bottom: 0!important;
   padding-left: 0!important;
   padding-right: 0!important;
   margin-left: 20px!important;
   text-transform: none!important;
   margin-top: 15px!important;
}
ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer:not(:first-child),
ytd-metadata-row-container-renderer.ytd-structured-description-content-renderer:not(:first-child),
ytd-structured-description-content-renderer[inline-structured-description] ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer,
ytd-structured-description-content-renderer[inline-structured-description] ytd-error-corrections-section-renderer.ytd-structured-description-content-renderer,
ytd-structured-description-content-renderer[inline-structured-description] ytd-video-description-infocards-section-renderer.ytd-structured-description-content-renderer {
   border-top: 1px solid var(--yt-spec-10-percent-layer) !important;
}
ytd-app #info ytd-video-primary-info-renderer {
   display: none !important;
}
#inner-header-container.ytd-c4-tabbed-header-renderer {
   top: 8px !important;
}
#header.ytd-browse ytd-button-renderer #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer {
   color: #737373 !important;
   position: absolute !important;
   top: -61px;
   left: 146px;
}
ytd-app #subscriber-count.ytd-c4-tabbed-header-renderer {
   left: 867px !important;
}
#buttons.ytd-c4-tabbed-header-renderer {
   position: inherit;
   left: -59px !important;
}
ytd-c4-tabbed-header-renderer.grid-5-columns tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer,
ytd-c4-tabbed-header-renderer.grid-5-columns .page-header-banner.ytd-c4-tabbed-header-renderer {
   margin-left: 0!important;
   margin-right: 0!important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer {
   border-radius: 0px !important;
}
div#inner-header-container div#buttons > div#edit-buttons {
   margin-top: -24px !important;
   position: absolute!important;
   left: 165px!important
}
ytd-c4-tabbed-header-renderer[use-page-header-style] #buttons.ytd-c4-tabbed-header-renderer .channel-action.ytd-c4-tabbed-header-renderer:not(:empty) {
   margin: -83px 645px 100px !important;
}
ytd-watch-next-secondary-results-renderer {
   position: relative !important;
   right: 29px !important;
}
span.bold.yt-formatted-string.style-scope:nth-of-type(3)::before {
   content: "Published on " !important;
}
span.bold.yt-formatted-string.style-scope:nth-of-type(1) {
   display: none !important;
}
#expand.ytd-text-inline-expander {
   color: transparent !important;
}
html[dark] #expand.ytd-text-inline-expander::after {
   background-color: #212121;
}
#expand.ytd-text-inline-expander::after {
   color: var(--yt-spec-text-secondary);
   content: "More";
   margin-right: 55px;
   background-color: #fff;
   text-transform: uppercase;
}
html[dark] div#messages.style-scope.ytd-watch-flexy {
   color: #b2aca2;
}
div#messages.style-scope.ytd-watch-flexy {
   line-height: 24px !important;
   max-height: 24px !important;
   text-align: right !important;
   font-size: 19px !important;
   margin-bottom: 2px !important;
   position: absolute !important;
   top: 82px !important;
   font-weight: 400 !important;
   margin-bottom: 2px !important;
   right: 35px !important;
}

span.bold.yt-formatted-string.style-scope:nth-of-type(3)::before {
   content: "Published ";
}
#collapse.ytd-text-inline-expander {
   border-top: 1px solid #d5d5d5;
   text-transform: uppercase !important;
   width: 100%;
   color: var(--yt-spec-text-secondary) !important;
   border-top: 1px solid #d5d5d5;
   width: 100%;
   padding-top: 5px;
   margin-top: 0px !important;
}
#collapse.ytd-text-inline-expander {}
yt-button-shape.style-scope.ytd-subscribe-button-renderer {
   display: flex !important;
}
yt-smartimation.ytd-subscribe-button-renderer,
.smartimation__content > __slot-el {
   display: flex !important;
}
html:not([dark]) #notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible],
html:not([dark]) #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] {
   pointer-events: auto;
   visibility: visible !important;
   position: static!important;
   background-color: #f2f2f2 !important;
   border: 1px solid #ccc !important;
}
html[dark] #notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible],
html[dark] #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] {
   pointer-events: auto;
   visibility: visible;
   position: static;
   background-color: #333 !important;
   border: 1px solid #333 !important;
}
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) > tp-yt-paper-button[subscribed]::before,
#subscribe-button > ytd-button-renderer:not(.style-primary) > a > tp-yt-paper-button[subscribed]::before,
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) yt-button-shape > button.yt-spec-button-shape-next--tonal::before,
#notification-preference-button yt-button-shape > button.yt-spec-button-shape-next--tonal::before {
   width: 4px;
   height: 9px;
   margin-right: 12px;
   margin-left: -6px !important;
   transform: rotate(45deg);
   margin-bottom: 5px !important;
}
ytd-topbar-menu-button-renderer:nth-last-of-type(2) yt-icon {
   background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) 0 -75px !important;
   background-size: auto;
   width: 36px !important;
   height: 24px !important;
   color: transparent !important;
   opacity: 0.6 !important;
}
ytd-app[frosted-glass] tp-yt-app-drawer.ytd-app[persistent] #guide-content.ytd-app {
   background: #fff !important;
}
html[dark] ytd-app[frosted-glass] tp-yt-app-drawer.ytd-app[persistent] #guide-content.ytd-app {
   background: #222 !important;
}

#contentContainer.tp-yt-app-drawer[persistent] {
   width: 100%;
   top: -116px !important;
}
tp-yt-app-drawer.ytd-app:not([persistent]) {
   z-index: 2030;

   top: 0px !important;
}
tp-yt-app-drawer {

   top: 45px !important;
   right: 0;
   bottom: -120px;
   left: 0;
   visibility: hidden;
   transition-property: visibility;
}
ytd-guide-renderer.ytd-app {
   background: #fff;
}
#guide #guide-spacer.ytd-app {
   margin-top: 1px !important;
}

ytd-reel-shelf-renderer {
   display: none !important;
}
ytd-c4-tabbed-header-renderer.grid-6-columns tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer,
ytd-c4-tabbed-header-renderer.grid-6-columns .page-header-banner.ytd-c4-tabbed-header-renderer {
   margin-left: 0px !important;
   margin-right: 0px !important;
}
div.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer {
   margin-left: 0px !important;
   margin-right: 0px !important;
   border-radius: 0px !important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer {
   border-radius: 0px !important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer {
   flex-direction: row !important;
}
.yt-tab-shape-wiz__tab {
   font-weight: 500 !important;
   margin-top: -5px;
}
#avatar.ytd-c4-tabbed-header-renderer {
   margin-top: 25px !important;
}
.yt-tab-group-shape-wiz__slider {
   background-color: #c00 !important;
}
ytd-watch-flexy button[aria-label="Share"] .yt-spec-button-shape-next__icon,
ytd-watch-flexy #above-the-fold #top-level-buttons-computed ytd-button-renderer .yt-spec-button-shape-next__icon {
   width: 20px;
   height: 20px;
   opacity: 0.6;
   background: url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfljEooDy.png) -21px -1679px;
   color: transparent;
}
#below button,
#below ytd-button-renderer,
yt-animated-rolling-number div {
   font-size: 12px!important;
   vertical-align: middle;
   font-weight: 500;
}
#top-level-buttons-computed svg {
   visibility: hidden;
}
#top-level-buttons-computed > yt-button-view-model.ytd-menu-renderer > .ytd-menu-renderer.style-scope.yt-spec-button-view-model > .yt-spec-button-shape-next--enable-backdrop-filter-experiment.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next > .yt-spec-button-shape-next__icon > yt-icon > .yt-spec-icon-shape.yt-icon.style-scope.yt-icon-shape > div > svg {
   visibility: visible;
}
html[dark] ytd-guide-entry-renderer[active] {
  background-color: var(--yt-spec-badge-chip-background) !important;
  border-radius: 0px;
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active {
    border-radius: 0px !important;
}
#messages {
   color: #666;
}
ytd-watch-metadata tp-yt-paper-button yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) -160px -808px;
   width: 20px;
   height: 20px;
}
ytd-watch-metadata tp-yt-paper-button:hover {
   opacity: 0.6;
}

.ryd-tooltip-bar-container {
   width: 100% !important;
   padding-top: 18px !important;
   margin-left: 860px;
   top: -55px !important;
}
ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer {
   margin-right: 705px !important;
}
ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer::before {
   font-size: 1.2rem;
   font-weight: 500;
}
.YtSegmentedLikeDislikeButtonViewModelHost {
   margin-left: -5px !important;
}
#expand.ytd-text-inline-expander::after {
   content: "Show more";
}
.button.ytd-text-inline-expander {
   font-size: 1.11rem !important;
}
ytd-watch-info-text:not([detailed]) #info.ytd-watch-info-text,
span.bold.yt-formatted-string.style-scope:nth-of-type(3)::before,
ytd-watch-info-text[detailed] #info.ytd-watch-info-text {
   content: "Published on ";
   font-size: 1.33rem;
}
yt-img-shadow.ytd-topbar-menu-button-renderer {
   width: 27px !important;
   height: 27px !important;
}
button#avatar-btn.style-scope.ytd-topbar-menu-button-renderer > yt-img-shadow.style-scope.ytd-topbar-menu-button-renderer.no-transition > img#img.style-scope.yt-img-shadow {
   width: 27px !important;
   height: 27px !important;
}
#container.ytd-searchbox {
   padding: 2px 6px !important;
}
ytd-comments-header-renderer .count-text.ytd-comments-header-renderer span:nth-of-type(2) {
   font-weight: 500 !important;
   text-transform: capitalize !important;
}
ytd-comments-header-renderer[modern-typography] .count-text.ytd-comments-header-renderer {
   font-weight: 400;
}
yt-img-shadow#avatar.ytd-notification-renderer,
yt-img-shadow#avatar.ytd-notification-renderer img.yt-img-shadow {
   border-radius: 0%!important;
}
.item.yt-dropdown-menu {
   font-size: 1.1rem !important;
   font-weight: 500;
   line-height: 2rem !important;
}
:root {
   --yt-link-letter-spacing: 0 !important;
   --ytd-user-comment_-_letter-spacing: 0 !important;
   --oldcolor: #c00;
}
ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer,
.title.ytd-playlist-panel-renderer a.yt-formatted-string {
   font-family: "Roboto",
   sans-serif;
   font-size: 1.4rem !important;
}
element.style {
   background-color: rgba(40,
   31,
   16,
   0.8);
}
.style-scope.ytd-thumbnail-overlay-bottom-panel-renderer,
ytd-thumbnail-overlay-bottom-panel-renderer[use-modern-collections-v2] {
   margin-right: 0px!important;
   margin-left: 0px!important;
   border-radius: 0px!important;
   height: 100% !important;
   width: 45% !important;
   left: unset !important;
}
ytd-compact-autoplay-renderer {
   padding: 12px 21px 12px 15px;
   box-shadow: 0 1px 2px rgba(0,
   0,
   0,
   0.1) !important;
   background-color: #fff !important;
}
html[dark] ytd-compact-autoplay-renderer {
   padding: 12px 21px 12px 15px;
   box-shadow: 0 1px 2px rgba(0,
   0,
   0,
   0.1) !important;
   background-color: #212121 !important;
}
#autoplay.ytd-compact-autoplay-renderer:after {
   content: url(//i.ibb.co/LtWLWNV/info.png);
   margin-left: 10px;
   margin-right: -2px;
}
ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail {
   margin-top: 0 !important;
   margin-right: 2px !important;
   font-size: 11px !important;
   padding: 1px 4px !important;
   height: 14px !important;
   line-height: 14px !important;
   opacity: .75 !important;
}
#guide #guide-section-title.ytd-guide-section-renderer {
   padding: 1px 1px 11px !important;
   margin-top: -9px !important;
   text-transform: uppercase !important;
   font-weight: 500 !important;
}
#guide #header .title {
   font-weight: 500 !important;
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer p.ytd-badge-supported-renderer {
   padding-left: 0px;
   vertical-align: middle;
   white-space: nowrap;
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer p.ytd-badge-supported-renderer:after {
   content: " NOW";
}
.animated-action__container {
   width: 0px;
   margin: 0px -7px 0px 3px;
   left: -73px;
}

ytd-channel-tagline-renderer {
   display: block !important;
   margin-left: 1090px !important;
   margin-right: -135px;
}
#content.ytd-channel-tagline-renderer::before {
   content: "About this channel";
   font-weight: 500 !important;
}
#content.ytd-channel-tagline-renderer {
   max-width: 256px !important;
}
#channel-header #channel-handle,
#videos-count.ytd-c4-tabbed-header-renderer {
   display: none !important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] .meta-item.ytd-c4-tabbed-header-renderer:not([hidden]) .delimiter.ytd-c4-tabbed-header-renderer {
   display: none;
}
ytd-channel-header-links-view-model[use-page-header-style] #container.ytd-channel-header-links-view-model {
   display: none;
}
.yt-tab-shape-wiz__tab {
   font-weight: 400 !important;
   margin-top: -5px;
   color: #606060;
}
.yt-tab-shape-wiz__tab--tab-selected {
   font-weight: 500 !important;
   color: #000;
}
html[dark] .yt-tab-shape-wiz__tab--tab-selected {
   font-weight: 500 !important;
   color: #fff;
}
html[dark] .yt-tab-shape-wiz__tab {
   color: #fff !important;
}
ytd-shelf-renderer[modern-typography] #title.ytd-shelf-renderer {
   font-weight: 500;
}
div#meta.style-scope.ytd-c4-tabbed-header-renderer {
   width: auto !important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer {
   flex-direction: row !important;
   left: 5px;
}
ytd-app #subscriber-count.ytd-c4-tabbed-header-renderer {
   left: 1115px !important;
   margin-top: 12px;
   padding: 0 8px 0 8px !important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] #buttons.ytd-c4-tabbed-header-renderer .channel-action.ytd-c4-tabbed-header-renderer:not(:empty) {
   margin: -70px 857px 100px !important;
}
ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-name.ytd-c4-tabbed-header-renderer {
   margin-left: -10px;
   --iron-icon-margin-left: -3px !Important;
}
#avatar.ytd-c4-tabbed-header-renderer,
#avatar.ytd-c4-tabbed-header-renderer img.yt-img-shadow {
   top: -95px !important;
   box-shadow: 0px 2px 2px #00000036!important;
}
#avatar.ytd-c4-tabbed-header-renderer {
   box-shadow: 0px 0px 0px #00000036!important;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Shopping"] {
   display: none;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Podcasts"] {
   display: none;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Music"] {
   display: none;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Movies & TV"] .guide-icon.ytd-guide-entry-renderer {
   background: url(https://web.archive.org/web/20220927000035im_/https://yt3.ggpht.com/6lo97rUTO7xhIBXZqLiaW2kA_eMBIEmqc27EqlKLyE4nAY-yzcKBG0Hs0YdUka3gJ629HcwgyzQ=s88-c-k-c0x00ffffff-no-rj) 0% 0% / 20px 20px;
   border-radius: 0px;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Movies & TV"] .guide-icon.ytd-guide-entry-renderer svg path {
   display: none;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="News"] .guide-icon.ytd-guide-entry-renderer {
   background: url(https://web.archive.org/web/20220927000035im_/https://yt3.ggpht.com/yyvnDCUp8n75OCqe-StBsJ7Ustb_ltwMFlbfhis59WXChvUpjToQeV3PmY7G7QftRZyaweJxKks=s88-c-k-c0x00ffffff-no-rj) 0% 0% / 20px 20px;
   border-radius: 0px;
}
ytd-guide-entry-renderer #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="News"] .guide-icon.ytd-guide-entry-renderer svg path {
   display: none;
}
yt-img-shadow.style-scope.ytd-guide-entry-renderer.no-transition {
   width: 24px !important;
   height: 24px !important;
}
#guide img.yt-img-shadow {
   width: 24px !important;
   height: 24px !important;
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
tp-yt-paper-item {
   min-height: 24px !important;
   height: auto !important;
}
ytd-mini-guide-renderer {
   background-color: #fff !important;
   z-index: 2002!important;
}
html[dark] ytd-mini-guide-renderer {
   background-color: #222 !important;
}
yt-button-shape.ytd-subscribe-button-renderer {
   background-color: #c00 !important;
}
.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
   background: no-repeat url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAdBAMAAACgSKoBAAAAMFBMVEUAAACpqan49PPGxcXS0tLLy8sNDQ0zMjKtra2zsrLY2NjVZ10ZGRkNDQ377+7/AAD/VjM8AAAAD3RSTlMA9wSkZIsHBPPoTAQZDwnerwN9AAAAcUlEQVQY02NABXxwFv9/CPgAE9BHF+CnuQBXF5oAoyCKQBlDoGAAbz1CIN1RUFDQ7TxCgEUQCESQtCgKggCSQCBYwB4hMBEsMB8hIAgG0hvA7mNSgAkIwJxMGwFliICwAkIBTAkeYChogCqg3KyA4AAAZ8ONnD/rQOwAAAAASUVORK5CYII=') !important;
}
ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
   height: 26px !important;
}
#content-icon.ytd-compact-link-renderer {
   margin-right: 20px;
}
ytd-mini-guide-renderer.ytd-app {
   top: 40px !important;
}
#comment-content.ytd-comment-renderer {
   display: inline-flex ! important;
   width: 95% !important;
}
/*
  #top-level-buttons-computed {
  	margin-left: -43px;
  }
  */
#meta.ytd-rich-grid-media {
   overflow-x: inherit!important;
}
#channel-name.ytd-author-comment-badge-renderer {
   color: #187ac6 !important;
}
/* Remove rounded corners under the watch player */
.ytp-ad-player-overlay-flyout-cta-rounded {
   border-radius: 2px !important;
}
.ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded {
   border-radius: 2px;
   text-transform: uppercase
}
.ytp-ad-action-interstitial-action-button.ytp-ad-action-interstitial-action-button-rounded {
   border-radius: 2px;
   text-transform: uppercase
}
.ytp-settings-menu.ytp-rounded-menu,
.ytp-screen-mode-menu.ytp-rounded-menu {
   border-radius: 2px !important;
}
.ytp-videowall-still-image {
   border-radius: 0px !important;
}
.ytp-sb-subscribe.ytp-sb-rounded,
.ytp-sb-unsubscribe.ytp-sb-rounded {
   border-radius: 2px !important;
}
div.branding-context-container-inner.ytp-rounded-branding-context {
   border-radius: 2px !important;
}
div.iv-card.iv-card-video.ytp-rounded-info {
   border-radius: 0px !important;
}
div.iv-card.iv-card-playlist.ytp-rounded-info {
   border-radius: 0px !important;
}
div.iv-card.iv-card-channel.ytp-rounded-info {
   border-radius: 0px !important;
}
div.iv-card.ytp-rounded-info {
   border-radius: 0px !important;
}
.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview,
.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
   border-radius: 0px !important;
}
.ytp-ce-video.ytp-ce-medium-round,
.ytp-ce-playlist.ytp-ce-medium-round,
.ytp-ce-medium-round .ytp-ce-expanding-overlay-background {
   border-radius: 0px !important;
}
div.ytp-autonav-endscreen-upnext-thumbnail.rounded-thumbnail {
   border-radius: 0px !important;
}
button.ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-cancel-button.ytp-autonav-endscreen-upnext-button-rounded {
   border-radius: 2px !important;
}
a.ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-play-button.ytp-autonav-endscreen-upnext-button-rounded {
   border-radius: 2px !important;
}
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img,
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay,
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay {
   border-radius: 0px !important;
}
.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
   border-top-left-radius: 0px!important;
   border-bottom-left-radius: 0px !important;
}
.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview {
   border-radius: 0px !important;
}
ytd-section-list-renderer.style-scope.ytd-two-column-search-results-renderer {
   background-color: #ffffff;
}
html[dark] ytd-section-list-renderer.style-scope.ytd-two-column-search-results-renderer {
   background-color: #222;
}
ytd-menu-renderer {
   justify-content: flex-end;
}
.style-scope.ytd-item-section-renderer ytd-subscribe-button-renderer {
   position: relative;
   top: -20px;
   left: 66em !important;
}
ytd-two-column-search-results-renderer #subscribe-button.ytd-channel-renderer {
   margin-left: -555px !important;
   margin-top: inherit !important;
   position: relative !important;
   left: -104px !important;
}
ytd-two-column-search-results-renderer #subscribe-button {
   margin-left: -52px !important;
   margin-top: 0px !important;
   position: relative !important;
   left: 0px !important;
}
ytd-toggle-button-renderer.style-default-active[is-icon-button] {
   order: 0 !important;
   position: unset !important;
}
#vote-count-middle.ytd-comment-engagement-bar {
   margin-right: 0px !important;
   order: -2 !important;
}
#reply-button-end.ytd-comment-engagement-bar {
   --yt-button-padding: 8px 16px;
   margin-left: 0px !important;
   text-transform: uppercase;
   font-family: "Roboto",
   "Arial",
   sans-serif;
   font-size: 13px !important;
   line-height: 1.8rem;
   font-weight: 500;
   order: -3 !important;
   position: unset !important;
}
ytd-comment-replies-renderer #less-replies.ytd-comment-replies-renderer,
ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer {
   margin-top: -6px !important;
   margin-left: -24px !important;
   letter-spacing: 0 !important;
   color: #2793e6 !important;
   font-size: 13px !important;
}
#toolbar.ytd-comment-engagement-bar {
   align-items: center;
   display: flex;
   flex-direction: row;
   margin-left: -18px !important;
}

#expander.ytd-comment-replies-renderer .dot.ytd-comment-replies-renderer {
   margin: 0px 5px 0 4px !important;
   color: transparent !important;
}
#author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model {
   width: 48px !important;
   height: 48px !important;
   margin-right: 10px !important;
}
#author-thumbnail.ytd-comment-view-model {
   margin-right: 0px !important;
}
#expander.ytd-comment-replies-renderer #expander-contents #author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model {
   width: 32px !important;
   height: 32px !important;
}
ytd-comment-replies-renderer #less-replies.ytd-comment-replies-renderer yt-icon.ytd-button-renderer {
   width: 20px !important;
}
#button-shape > .yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next::after {
   content: "More";
}
ytd-c4-tabbed-header-renderer[use-page-header-style] .meta-item.ytd-c4-tabbed-header-renderer:not([hidden]) .delimiter.ytd-c4-tabbed-header-renderer {
   display: none!important;
}
ytd-companion-slot-renderer {
   display: none !important;
}
.sbdd_b {
   border-radius: 0px !important;
}
#inner-header-container.ytd-c4-tabbed-header-renderer {
   height: 60px !important;
   margin-top: -43px !important;
}
.badge-shape-wiz--default.badge-shape-wiz--overlay {
   background-color: transparent !important;
}
.badge-shape-wiz {
   font-size: 11px !important;
   margin-top: -2px !important;
}

.badge-shape-wiz--thumbnail-badge {
   background-color: transparent !important;
   border-radius: 0px !important;
   padding: 0px !important;
}
.thumbnail-overlay-badge-shape.ytd-thumbnail-overlay-time-status-renderer {
   margin-left: 0px !important;
}
ytd-thumbnail-overlay-time-status-renderer {
   margin: 4px 2px !important;
   padding: 3px 4px !important;
   background-color: rgb(0 0 0 / 75%) !important;
   height: 13px !important;
   line-height: 12px !important;
   letter-spacing: 0 !important;
}
ytd-watch-metadata[flex-menu-enabled] #actions.ytd-watch-metadata ytd-menu-renderer.ytd-watch-metadata {
   justify-content: flex-end !important;
}
ytd-miniplayer {

   border-radius: 0px 0px 0 0 !important;
}
.ytp-player-minimized .html5-main-video,
.ytp-player-minimized .ytp-miniplayer-scrim,
.ytp-player-minimized.html5-video-player {
   border-radius: 0px 0px 0 0 !important;
}
ytd-rich-grid-renderer {
   --ytd-rich-grid-gutter-margin: 0px !important;
}
ytd-rich-item-renderer {
   display: inline-block !important;
}
#avatar-container.ytd-rich-grid-media {
   display: none !important;
}
.yt-image-banner-view-model-wiz--inset {
   border-radius: 0px !important;
}
.yt-spec-avatar-shape__button--button-giant {
   width: 100px !important;
   height: 100px !important;
   margin: -220px 0px 0 !important;
}
.yt-spec-avatar-shape--avatar-size-giant {
   margin: -13px -33px 0px 0px !important;
   position: relative;
   display: flex;
   justify-content: center;
   width: 100px !important;
   height: 100px !important;
}
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
   color: #ffffff !important;
   background: #cc0000 !important;
   font-size: 11px !important;
}
.page-header-view-model-wiz__page-header-headline-info {
   display: flex;
   flex-direction: column;
   flex-grow: 1;
   min-width: 0;
   margin-left: -100px !important;
}

.yt-spec-button-shape-next--size-m {
   padding: 0 16px!important;
   height: 22px!important;
   font-size: 14px!important;
   line-height: 24px!important;
   border-radius: 0!important;
}

.yt-spec-avatar-shape__image {
   border-radius: 0px !important;
}

.yt-subscribe-button-view-model-wiz {
   display: flex;
   position: relative !important;
   max-width: 94% !important;
   left: -15px !important;
   top: 0px !important;
   padding-left: 76px;
   margin-left: 9px;
   min-width: 18%;
   margin-right: 30px;
}
.yt-spec-button-shape-next__button-text-content {
   font-size: 12px !important;
}
.yt-subscribe-button-view-model-wiz__container {
   display: contents !important;
}
.yt-sheet-view-model-wiz--contextual {
   border-radius: 0px !important;
}
.yt-sheet-view-model-wiz--contextual:hover {
   border-radius: 0px !important;
}
.page-header-view-model-wiz__page-header-content-metadata {
   color: #aaa;
   position: relative!important;
   top: -6px!important;
   font-family: "Roboto",
   "Arial",
   sans-serif;
   font-size: 11px;
}
.page-header-view-model-wiz__page-header-description {
   margin-top: 12px!important;
   position: relative!important;
   top: -20px!important;
   font-family: "Roboto",
   "Arial",
   sans-serif;
   font-size: 11px;
}
.page-header-view-model-wiz__page-header-content {
   position: relative;
   max-height: 150px !important;
}
.yt-content-metadata-view-model-wiz__metadata-text {
   font-family: "Roboto",
   "Arial",
   sans-serif;
   font-size: 11px !important;
}
.truncated-text-wiz__truncated-text-content {
   overflow: hidden;
   display: block;
   font-size: 11px !important;
}
.page-header-view-model-wiz__page-header-attribution {
   position: relative;
   margin-top: -20px !important;
}
ytd-menu-renderer .ytd-menu-renderer[style-target="button"] {
   --yt-icon-button-icon-width: 24px !important;
   --yt-icon-button-icon-height: 24px !important;
   width: 27px!important;
   height: 27px!important;
}
ytd-mini-guide-entry-renderer {
   display: inline-block;
   position: relative;
   background-color: transparent !important;
   border-radius: 10px;
}
.guide-icon.ytd-mini-guide-entry-renderer:hover {
   color: #f1f1f1;
   margin-bottom: 6px;
}
.title.ytd-mini-guide-entry-renderer:hover {
   color: #f1f1f1;
}
.ytp-cairo-refresh-signature-moments .ytp-play-progress {
   background: #f00 !important;
}
ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer {
   background: linear-gradient(to right,
   #f00 80%,
   #f00 100%) !important;
}
#progress.ytd-thumbnail-overlay-resume-playback-renderer {
   background-color: #f00 !important;
   height: 100%;
   background: #f00 !important;
}
.ytd-thumbnail-overlay-resume-playback-renderer {
   background-color: #f00 !important;
   height: 100%;
   background: #f00 !important;
}
.ytp-cairo-refresh .ytp-swatch-background-color {
   background-color: #f00 !important;
}
ytd-menu-renderer:not([condensed]) .ytd-menu-renderer[button-renderer] + .ytd-menu-renderer[button-renderer],
.ytd-menu-renderer[button-renderer] + yt-button-view-model.ytd-menu-renderer,
yt-button-view-model.ytd-menu-renderer + yt-button-view-model.ytd-menu-renderer,
.ytd-menu-renderer[button-renderer] + template.ytd-menu-renderer + #button.ytd-menu-renderer,
yt-button-view-model.ytd-menu-renderer + template.ytd-menu-renderer + #button.ytd-menu-renderer,
#flexible-item-buttons.ytd-menu-renderer:not(:empty) > .ytd-menu-renderer[button-renderer],
#top-level-buttons-computed.ytd-menu-renderer:not(:empty) > .ytd-menu-renderer[button-renderer] ~ .ytd-menu-renderer[button-renderer],
#flexible-item-buttons.ytd-menu-renderer:not(:empty) > yt-button-view-model.ytd-menu-renderer,
#top-level-buttons-computed.ytd-menu-renderer:not(:empty) + #flexible-item-buttons.ytd-menu-renderer + #button.ytd-menu-renderer {
   margin-left: 40px !important;
   margin-right: -10px !important;
}
ytd-app #channel-name.ytd-video-owner-renderer,
#channel-name.ytd-video-owner-renderer {
   top: 45px !important;
   position: absolute !important;
   left: 60px !important;
}
#menu.yt-dropdown-menu {
   border-radius: 0px !important;
}
ytd-guide-entry-renderer {
   width: calc(100% - 0px) !important;
}
tp-yt-app-drawer[opened] {
   visibility: visible !important;
}
like-button-view-model button,
dislike-button-view-model button {
   opacity: 0.5;
}
like-button-view-model button:hover,
dislike-button-view-model button:hover {
   opacity: 0.6;
}
like-button-view-model button[aria-pressed="true"],
dislike-button-view-model button[aria-pressed="true"] {
   opacity: 1;
}
like-button-view-model yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) -188px -237px;
   width: 20px;
   height: 20px;
}
html[dark] like-button-view-model yt-icon {
   filter: invert(1);
}
dislike-button-view-model yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) -72px -408px;
   width: 20px;
   height: 20px;
}
html[dark] dislike-button-view-model yt-icon {
   filter: invert(1) grayscale(1);
}
like-button-view-model button[aria-pressed="true"] yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) -118px -213px;
}
like-button-view-model button[aria-pressed="true"] {
   color: #1b7fcc !important;
}
dislike-button-view-model button[aria-pressed="true"] {
   color: #1b7fcc !important;
}
html[dark] like-button-view-model button[aria-pressed="true"] {
   color: #fff !important;
}
html[dark] like-button-view-model button[aria-pressed="true"] yt-icon {
   filter: invert(1) grayscale(1) brightness(2.5);
}
like-button-view-model,
dislike-button-view-model {
   margin-left: 855px;
   margin-right: -855px;
}
html[dark] dislike-button-view-model button[aria-pressed="true"] yt-icon {
   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) -72px -408px;
   width: 20px;
   height: 20px;
}
dislike-button-view-model button[aria-pressed="true"] yt-icon {
   background: no-repeat url(https://i.imgur.com/ChH84eb.png) -2px -1px;
}
html[dark] dislike-button-view-model button[aria-pressed="true"] {
   color: #fff !important;
}
ytd-playlist-thumbnail #thumbnail.ytd-playlist-thumbnail {
   height: 100% !important;
   position: absolute !important;
   top: -4px !important;
   right: 0 !important;
   bottom: 0 !important;
   left: 0 !important;
   margin-top: 4px !important;
}
ytd-thumbnail-overlay-hover-text-renderer {
   width: 40% !important;
   height: 30% !important;
   position: absolute !important;
   left: 115px !important;
   top: 91px !important;
   background: transparent !important;
}
.YtThumbnailHoverOverlayViewModelIcon {
   position: absolute !important;
   top: 20px !important;
}
.YtThumbnailHoverOverlayViewModelText {
   position: absolute !important;
   top: 50px !important;
}
.yt-thumbnail-view-model--medium {
   border-radius: 0px !important;
}
.collections-stack-wiz__collection-stack2 {

   display: none!important;
}
.collections-stack-wiz__collection-stack1--large {
   display: none!important;
}


.yt-thumbnail-view-model--medium {
   border-radius: 0px !important;
}

ytd-thumbnail-overlay-hover-text-renderer {
   width: 55% !important;
}

.YtThumbnailHoverOverlayViewModelHost {
   width: 45%!important;
   left: 55%!important;

   background: rgba(0,0,0,0.2) !important;
}
#teaser-carousel.ytd-watch-metadata {
   display: none !important;
}
#comment-teaser.ytd-watch-metadata,
#teaser-carousel.ytd-watch-metadata {
   display: none !important;
}

[page-subtype="playlist"] .page-header-view-model-wiz__page-header-headline-info {
   margin-left: 0px !important;
}
.page-header-view-model-wiz--display-as-sidebar .page-header-view-model-wiz__page-header-background {
   border-radius: 0px !important;
   overflow: hidden;
}
.YtCinematicContainerViewModelBackgroundGradient {
   background: var(--yt-spec-brand-background-primary) !important;
}

.ytp-featured-product,
#masthead-ad,
#player-ads,
#shorts-inner-container > .ytd-shorts:has( > .ytd-reel-video-renderer > ytd-ad-slot-renderer),
.YtdShortsSuggestedActionStaticHostContainer,
.ytd-merch-shelf-renderer,
.ytp-suggested-action > button.ytp-suggested-action-badge,
ytd-ad-slot-renderer,
ytd-rich-item-renderer:has( > #content > ytd-ad-slot-renderer),
ytd-search-pyv-renderer {
   display: none !important;
}
ytd-engagement-panel-section-list-renderer[dialog] {
   padding: 0
}

ytd-browse[page-subtype="playlist"] ytd-playlist-header-renderer.ytd-browse,
ytd-browse[page-subtype="playlist"] .page-header-sidebar.ytd-browse,
ytd-browse[has-page-header-sidebar] ytd-playlist-header-renderer.ytd-browse,
ytd-browse[has-page-header-sidebar] .page-header-sidebar.ytd-browse {
   height: 500px !important;
   margin-top: 19px !important;
   position: absolute !important;
   top: 22px !important;
   left: -5px !important;
}
.ytp-title-link.yt-uix-sessionlink {
   color: #fff !important;
}
.page-header-view-model-wiz__page-header-headline-image--page-header-headline-image-hero {
   margin: 0 0 16px !important;
}
.immersive-header-gradient.ytd-playlist-header-renderer {
   background: var(--yt-spec-brand-background-primary) !important;
}
.blurred-image.ytd-playlist-header-renderer {
   display: none;
}
.image-wrapper.ytd-hero-playlist-thumbnail-renderer {
   border-radius: 0px;
}
.immersive-header-container.ytd-playlist-header-renderer {
    border-radius: 0px !important;
}
.yt-content-preview-image-view-model-wiz--large-rounded-image {
   border-radius: 0px !important;
}
html:not([dark]) [page-subtype="playlist"] .yt-avatar-stack-view-model-wiz__avatar-stack-text {
   filter: invert(1);
}
html:not([dark]) [page-subtype="playlist"] .yt-content-metadata-view-model-wiz__metadata-text {
   filter: invert(1);
}
html:not([dark]) [page-subtype="playlist"] .yt-flexible-actions-view-model-wiz__action.yt-flexible-actions-view-model-wiz__action--row-action.yt-flexible-actions-view-model-wiz__action--icon-only-button {
   filter: invert(1);
}
html:not([dark]) [page-subtype="playlist"] .yt-flexible-actions-view-model-wiz__action.yt-flexible-actions-view-model-wiz__action--row-action.yt-flexible-actions-view-model-wiz__action--icon-only-button {
   filter: invert(1);
}
html[dark] [page-subtype=playlist] .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled {
   filter: invert(1);
}
.YtSearchboxComponentHost {
	margin: 0px !important;
	height: 27px !important;
}
.YtSearchboxComponentInputBox {
  	border: 1px solid !important;
	border-radius: 0px !important;
    border-color: #d2d2d2 !important;
}
html[dark] .YtSearchboxComponentInputBox {
	border-color: #333 !important;
}
.YtSearchboxComponentSearchButton {
	border-radius: 0px !important;
}
html:not([dark]) .YtSearchboxComponentSearchButton {
	border: 1px solid #d2d2d2 !important;
	background-color: #f8f8f8 !important;
}
.YtSearchboxComponentSuggestionsContainer {
	padding-top: 0px !important;
	padding-bottom: 0px !important;
	top: 28px !important;
	left: 35px !important;
	border-radius: 0px !important;
}
.YtSuggestionComponentIcon {
	display: none !important;
}
.YtSearchboxComponentInnerSearchIcon {
	display: none !important;
	width: 0px !important;
	height: 0px !important;
	padding: 0px !important;
}
.YtSearchboxComponentInputBoxHasFocus {
	margin-left: 32px !important;
	padding: 2px 4px 2px 16px !important;
	border: 1px solid !important;
}
.YtSearchboxComponentInputBoxHasFocus {
	border-color: #d2d2d2 !important;
}
html[dark] .YtSearchboxComponentInputBoxHasFocus {
	border-color: #333 !important;
}
.YtSearchboxComponentDesktop .YtSearchboxComponentClearButton:hover {
	background-color: transparent !important;
}
.YtSearchboxComponentDesktop .YtSearchboxComponentClearButtonIcon {
	height: 16px !important;
	width: 16px !important;
}
#modern-card,
#modern-card.ytd-miniplayer {
	border-radius: 0px !important;
}
ytd-playlist-panel-renderer[modern-panels][within-miniplayer][modern-miniplayer] #container.ytd-playlist-panel-renderer {
	border-radius: 0px !important;
}
.YtSearchboxComponentSearchButton > yt-icon > .yt-spec-icon-shape.yt-icon.style-scope.yt-icon-shape {
	height: 16px !important;
	width: 16px !important;
}
tp-yt-paper-dialog[modern] {
	border-radius: 0px !important;
}
.yt-thumbnail-overlay-badge-view-model-wiz--bottom-end {
	right: -27px !important;
	width: 59% !important;
	background: rgba(0, 0, 0, 0.67) !important;
	border-radius: 0px !important;
	margin: 0px 0px 0px !important;
}
.yt-thumbnail-overlay-badge-view-model-wiz--bottom-end .yt-thumbnail-overlay-badge-view-model-wiz__badge {
	border-radius: 0px !important;
	background: transparent !important;
	border-radius: 0px !important;
	position: relative !important;
	margin: 5px 5px 0px !important;
	z-index: 1!important;
    bottom: -77% !important;
    background: transparent !important;
}
.YtThumbnailHoverOverlayViewModelStyleCover {
	background: rgba(0, 0, 0, 0.8) !important;
}
ytd-search-header-renderer[has-chip-bar] {
   height: 32px !important;
}

	html[dark] .yt-lockup-metadata-view-model-wiz--standard .yt-lockup-metadata-view-model-wiz__title {
		color: #fff !important;
	}
	.yt-lockup-metadata-view-model-wiz--standard .yt-lockup-metadata-view-model-wiz__title {
		line-height: 1.3em !important;
		font-family: "Roboto", "Arial", sans-serif !important;
		font-size: 1.3rem !important;
		font-weight: 500 !important;
		overflow: hidden !important;
		max-height: 3.6rem !important;
		-webkit-line-clamp: 2 !important;
		display: -webkit-box !important;
		-webkit-box-orient: vertical !important;
		text-overflow: ellipsis !important;
		white-space: normal !important;
		margin-top: 0px !important;
		color: #167ac6 !important;
	}
	.yt-content-metadata-view-model-wiz--medium-text .yt-content-metadata-view-model-wiz__metadata-text {
		line-height: 1.2rem !important;
	}
	.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--enable-backdrop-filter-experiment {
		color: transparent !important;
	}
	.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--enable-backdrop-filter-experiment::before {
		content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAANCAYAAABsItTPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAcSURBVBhXY2RgYPgPxGDABKXBAIWDG9DHAAYGADC6Aw1aLZAXAAAAAElFTkSuQmCC);
		opacity: 0.5 !important;
		margin-right: -25px !important;
		margin-bottom: -12px !important;
	}
	html[dark] .yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--enable-backdrop-filter-experiment::before {
		content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAANCAYAAABsItTPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAcSURBVBhXY2RgYPgPxGDABKXBAIWDG9DHAAYGADC6Aw1aLZAXAAAAAElFTkSuQmCC);
		filter: invert(1);
	}

    .yt-lockup-metadata-view-model-wiz__text-container {
        margin-top: -5px !important;
    }
    	#subscribe-button-shape > .yt-spec-button-shape-next--enable-backdrop-filter-experiment.yt-spec-button-shape-next--size-s.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next > .yt-spec-button-shape-next__button-text-content > .yt-core-attributed-string--white-space-no-wrap.yt-core-attributed-string {
		font-size: 12px !important;
		color: #fff;
	}
	ytd-browse[page-subtype="channels"] .style-scope.ytd-item-section-renderer ytd-subscribe-button-renderer {
		left: 55px!important;
		top: -40px !important;
	}
    #bar.yt-copy-link-renderer {
        border-radius: 0px !important;
    }
    html[dark] .yt-core-attributed-string--link-inherit-color {
		color: #f1f1f1 !important;
    }
    .yt-core-attributed-string--link-inherit-color {
		color: #333 !important;
    }
    .yt-core-attributed-string--link-inherit-color .yt-core-attributed-string__link--call-to-action-color {
        color: #167ac6 !important;
        font-size: 1.33rem !important;
    }
    .yt-core-attributed-string__link--call-to-action-color {
		color: #167ac6 !important;
  }
  html[dark] #channel-name.ytd-video-meta-block {
	--yt-endpoint-color: #ffffff !important;
	--yt-endpoint-visited-color: #ffffff ! important;
}
yt-searchbox {
	height: 28px !important;
}
.yt-searchbox {
	height: 28px !important;
}
ytd-topbar-menu-button-renderer:nth-last-of-type(2n) yt-icon {
		background: none !important;
		fill: inherit !important;
		height: 22px !important;
		color: transparent !important;
		margin-left: -8px  !important;
	}
	#button.size-default.style-default.ytd-button-renderer.style-scope {
		fill: transparent !important;
		color: transparent !important;
	}
	#buttons.ytd-masthead > ytd-button-renderer.style-default[is-paper-button] {
		background: url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) 0px -74px !important;
		background-size: auto !important;
		max-width: 24px !important;
		height: 24px !important;
		opacity: 0.33 !important;
		display: inherit !important;
		color: transparent !important;
		fill: transparent !important;
		overflow: clip !important;
	}
	#buttons.ytd-masthead > ytd-button-renderer.style-default[is-paper-button]:hover {
		opacity: 0.6 !important
	}
		#buttons.ytd-masthead > ytd-button-renderer.style-default[is-paper-button]:active {
		opacity: 0.65 !important
	}
	.ytSearchboxComponentHost {
		margin: 0 0 0 0px !important;
		padding: 0 4px !important;
		height: 28px !important;
	}
	.ytSearchboxComponentInputBox {
		border-radius: 0px !important;
		margin-left: 32px !important;
		padding: 0 4px 0 15px !important;
	}
	.ytSearchboxComponentSearchButton {
		border-radius: 0px !important;
		color: transparent !important;
		background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -569px -41px;
	}
	.ytSearchboxComponentInnerSearchIcon {
		display: none !important;
	}
	.ytSuggestionComponentIcon {
		display: none!important;
	}
	.ytSearchboxComponentSuggestionsContainer {
		top: 30px!important;
		border-radius: 0!important;
		padding: 8px 0 8px!important;
		left: 36px !important;

	}
	.ytSearchboxComponentDesktop .ytSearchboxComponentClearButtonIcon {
		color: #555 !important;
		height: 15px !important;
		width: 14px !important;
		stroke: #555 !important;
		stroke-width: 2px !important;
	}
	.ytSearchboxComponentDesktop .ytSearchboxComponentClearButton:hover {
		background-color: transparent !important;
	}
	.ytSearchboxComponentClearButtonIcon:hover {
		color: rgba(255, 255, 255, 0.6) !important;
		stroke: rgba(255, 255, 255, 0.6) !important;
	}
	.ytSearchboxComponentInputBoxDark.ytSearchboxComponentInputBoxHasFocus {
		border-color: hsl(0, 0%, 40%) !important;
		border-right: 1px solid hsl(0, 0%, 40%) !important;
	}
	.ytSearchboxComponentInputBoxDark,
	.ytSearchboxComponentInput {
		border-right: 1px solid transparent !important;
	}
	.ytSuggestionComponentSuggestion {
		color: var(--yt-spec-text-primary) !important;
	}
	.ytSearchboxComponentHost {
		color: var(--yt-spec-text-primary) !important;
	}
html[dark] ytd-button-renderer.ytd-masthead.style-scope .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal:hover {
	opacity: 0.8 !important;
}
html[dark] ytd-button-renderer.ytd-masthead.style-scope .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal {
	background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) 0 -75px !important;
	color: transparent !important;
	width: 0px !important;
	opacity: 0.6 !important;
	filter: invert(1)
}

ytd-button-renderer.ytd-masthead.style-scope .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
	background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl44vgwb.png) 0 -75px !important;
	color: transparent !important;
	width: 0px !important;
	opacity: 0.34 !important;
}

ytd-button-renderer.ytd-masthead.style-scope .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover {
opacity: 0.5 !important;
}`);
}

waitForElement('ytd-compact-link-renderer').then(function(elm) {
    document.querySelector('#container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4)').style.left = document.querySelector('[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:first-child ytd-compact-link-renderer:nth-child(3) a').offsetWidth+"px";
});

function getLikes() {
    const topLevelButtons = document.querySelector("ytd-app").data.response.contents.twoColumnWatchNextResults.results.results.contents.find(e => e.hasOwnProperty("videoPrimaryInfoRenderer")).videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0];
    const buttonText = topLevelButtons.isToggled ? topLevelButtons.toggleButtonRenderer.toggledText : topLevelButtons.toggleButtonRenderer.defaultText;
    const likes = parseInt(buttonText.accessibility.accessibilityData.label.match(/\d/g).join(""));
    const likesText = document.querySelector("#info ytd-toggle-button-renderer.style-text[is-icon-button]:first-child #text.ytd-toggle-button-renderer");
    likesText.innerHTML = likes.toLocaleString();

    document.querySelector("ytd-toggle-button-renderer.style-scope:first-child").addEventListener("click", function() {
        const liked = likesText.classList.contains("style-default-active");
        likesText.innerHTML = liked ? (likes + 1).toLocaleString() : likes.toLocaleString();
    }, false);
}

async function getDislikes() {
    await new Promise(resolve => setTimeout(resolve, 500)); // this is necessary because otherwise RYD will *sometimes* update the value after this does. would like to do a better way than this though
    const videoId = document.querySelector("ytd-app").data.endpoint.watchEndpoint.videoId;
    let response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`).then((response) => response.json()).catch();
    if (response === undefined || "traceId" in response) return;

    const dislikesText = document.querySelector("#info ytd-toggle-button-renderer.style-text[is-icon-button]:nth-child(2) #text.ytd-toggle-button-renderer");
    const likesText = document.querySelector("#info ytd-toggle-button-renderer.style-text[is-icon-button]:first-child #text.ytd-toggle-button-renderer");
    if (response.dislikes == 0 && response.likes == 0 && response.viewCount == 0) { // no ratings
        dislikesText.innerHTML = "";
        likesText.innerHTML = "";
    } else { // we have ratings!
        dislikesText.innerHTML = response.dislikes.toLocaleString();
        document.querySelector("ytd-toggle-button-renderer.style-scope:nth-child(2)").addEventListener("click", function() {
            const disliked = dislikesText.classList.contains("style-default-active");
            dislikesText.innerHTML = disliked ? (response.dislikes + 1).toLocaleString() : response.dislikes.toLocaleString();
        }, false);
    }
}

function restoreDropdown(iconLabel, firstChild, dropdownChildren) {
    const iconLabelSel = document.querySelector(iconLabel);
    if (!window.location.search.includes("sort")) // channel sort dropdown fix
        iconLabelSel.innerHTML = document.querySelector(firstChild).innerHTML;

    for (const x of document.querySelectorAll(dropdownChildren)) {
        x.addEventListener("click", function() {
            iconLabelSel.innerHTML = this.innerHTML;
        }, false);
    }
}


function setupSecondaryInfoRenderer() {
    if (window.location.href.indexOf("/watch?") == -1) return;

    const uploadDate = document.querySelector('#info-strings.ytd-video-primary-info-renderer');
    document.querySelector('ytd-video-secondary-info-renderer > #container').prepend(uploadDate);

    if (!document.querySelector("ytd-app").data.response.responseContext.mainAppWebResponseContext.loggedOut) {
        const subCountRenderer = document.querySelector('#owner-sub-count.ytd-video-owner-renderer');
        const subBtnRenderer = document.querySelector("ytd-subscribe-button-renderer");
        subBtnRenderer.appendChild(subCountRenderer);
    }

    getLikes();
}

function setUploadedText(elm) {
    const isNormalUpload = document.querySelector("#chat") == null;
    if (!elm.innerHTML.startsWith("Published on ") && isNormalUpload) {
        elm.insertAdjacentText("afterbegin", "Published on ");
    }
}

async function setupUpdateDependentElements() {
    if (window.location.pathname == "/watch") {
        waitForElement('.ryd-tooltip-bar-container').then(() => getDislikes());
        waitForElement('#items.ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer.style-scope:first-child').then(() => restoreOldAutoplay());
        waitForElement('#top-row.ytd-video-secondary-info-renderer').then(() => setupSecondaryInfoRenderer());
        waitForElement('#info-strings.ytd-video-primary-info-renderer yt-formatted-string').then((elm) => setUploadedText(elm));

        // classic description
        var description;
        waitForElement('tp-yt-paper-button[id="more"]').then((elm) => elm.addEventListener("click", () => description.removeAttribute("collapsed")));
        waitForElement('ytd-expander.ytd-video-secondary-info-renderer').then((elm) => { description = elm });
        waitForElement('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]').then((elm) => elm?.remove());
    }

    waitForElement("ytd-comments-header-renderer yt-dropdown-menu:last-of-type").then(function() {
        restoreDropdown("ytd-comments-header-renderer #icon-label.yt-dropdown-menu",
                        "ytd-comments-header-renderer a.yt-dropdown-menu:first-child > tp-yt-paper-item:first-child > tp-yt-paper-item-body:first-child > div:first-child",
                        "ytd-comments-header-renderer a.yt-dropdown-menu > tp-yt-paper-item:first-child > tp-yt-paper-item-body:first-child > div:first-child");
    });

    waitForElement("yt-sort-filter-sub-menu-renderer yt-dropdown-menu:last-of-type").then(function() {
        restoreDropdown("yt-sort-filter-sub-menu-renderer #icon-label.yt-dropdown-menu",
                        "yt-sort-filter-sub-menu-renderer a.yt-dropdown-menu:nth-child(3) > tp-yt-paper-item:first-child > tp-yt-paper-item-body:first-child > div:first-child",
                        "yt-sort-filter-sub-menu-renderer a.yt-dropdown-menu > tp-yt-paper-item:first-child > tp-yt-paper-item-body:first-child > div:first-child");
    });
}

window.addEventListener("yt-page-data-updated", setupUpdateDependentElements, false);
// init functions
removeEl();
genSettings();
patch_css();
gen_history();
gen_aspect_fix();
subbutton();
counterstuff();