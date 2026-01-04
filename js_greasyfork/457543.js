// ==UserScript==
// @name         YT July 2018 - November 2020 script
// @version      1.5.1
// @description  use: https://userstyles.world/style/6311/youtube-late-2019-mid-2020-polymer-layout and https://userstyles.world/style/6312/youtube-late-2017-mid-2019-polymer-colors.
// @author       Manchuliit
// @license      none
// @match        *://*.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457543/YT%20July%202018%20-%20November%202020%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/457543/YT%20July%202018%20-%20November%202020%20script.meta.js
// ==/UserScript==
 
// Attributes to remove from <html>
const ATTRS = [
    "system-icons",
    "typography",
    "typography-spacing"
];
 
// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: false
}
 
// Experiment flags.
const EXPFLAGS = {
    kevlar_updated_logo_icons: false,
    kevlar_updated_icons: false,
    kevlar_system_icons: false,
    kevlar_watch_color_update: false,
    desktop_mic_background: false,
    kevlar_refresh_on_theme_change: false, //disable reload when changing theme
    kevlar_unavailable_video_error_ui_client: false, //old video unavailable ui
    kevlar_watch_metadata_refresh: false,
    kevlar_watch_modern_metapanel: false,
    kevlar_watch_modern_panels: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_modern_dialogs: false,
    web_modern_chips: false,
    web_modern_subscribe: false,
    web_modern_buttons: false,
    web_modern_playlists: false,
    enable_programmed_playlist_redesign: false,
    web_amsterdam_playlists: false,
    web_searchbar_style: "default",
    web_button_rework: false,
    web_darker_dark_theme: false,
    web_guide_ui_refresh: false,
    web_sheets_ui_refresh: false,
    web_snackbar_ui_refresh: false,
    web_segmented_like_dislike_button: false,
    web_animated_like: false,
    web_animated_like_lazy_load: false,
    kevlar_use_ytd_player: false
}
 
// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_player_move_autonav_toggle: "false"
}
 
class YTP {
    static observer = new MutationObserver(this.onNewScript);
 
    static _config = {};
 
    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }
 
    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
 
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
 
        return this.mergeDeep(target, ...sources);
    }
 
 
    static onNewScript(mutations) {
        for (var mut of mutations) {
            for (var node of mut.addedNodes) {
                YTP.bruteforce();
            }
        }
    }
 
    static start() {
        this.observer.observe(document, {childList: true, subtree: true});
    }
 
    static stop() {
        this.observer.disconnect();
    }
 
    static bruteforce() {
        if (!window.yt) return;
        if (!window.yt.config_) return;
 
        this.mergeDeep(window.yt.config_, this._config);
    }
 
    static setCfg(name, value) {
        this._config[name] = value;
    }
 
    static setCfgMulti(configs) {
        this.mergeDeep(this._config, configs);
    }
 
    static setExp(name, value) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};
 
        this._config.EXPERIMENT_FLAGS[name] = value;
    }
 
    static setExpMulti(exps) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};
 
        this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
    }
 
    static decodePlyrFlags(flags) {
        var obj = {},
            dflags = flags.split("&");
 
        for (var i = 0; i < dflags.length; i++) {
            var dflag = dflags[i].split("=");
            obj[dflag[0]] = dflag[1];
        }
 
        return obj;
    }
 
    static encodePlyrFlags(flags) {
        var keys = Object.keys(flags),
            response = "";
 
        for (var i = 0; i < keys.length; i++) {
            if (i > 0) {
                response += "&";
            }
            response += keys[i] + "=" + flags[keys[i]];
        }
 
        return response;
    }
 
    static setPlyrFlags(flags) {
        if (!window.yt) return;
        if (!window.yt.config_) return;
        if (!window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) return;
        var conCfgs = window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
        if (!("WEB_PLAYER_CONTEXT_CONFIGS" in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};
 
        for (var cfg in conCfgs) {
            var dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags);
            this.mergeDeep(dflags, flags);
            this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                serializedExperimentFlags: this.encodePlyrFlags(dflags)
            }
        }
    }
}
 
window.addEventListener("yt-page-data-updated", function tmp() {
    YTP.stop();
    for (i = 0; i < ATTRS.length; i++) {
        document.getElementsByTagName("html")[0].removeAttribute(ATTRS[i]);
    }
    window.removeEventListener("yt-page-date-updated", tmp);
});
 
YTP.start();
 
YTP.setCfgMulti(CONFIGS);
YTP.setExpMulti(EXPFLAGS);
YTP.setPlyrFlags(PLYRFLAGS);
 
function $(q) {
    return document.querySelector(q);
}
 
// Fix for Return YouTube Dislike
addEventListener('yt-page-data-updated', function() {
    if(!location.pathname.startsWith('/watch')) return;
 
    var lds = $('ytd-video-primary-info-renderer div#top-level-buttons-computed');
    var like = $('ytd-video-primary-info-renderer div#segmented-like-button > ytd-toggle-button-renderer');
    var share = $('ytd-video-primary-info-renderer div#top-level-buttons-computed > ytd-segmented-like-dislike-button-renderer + ytd-button-renderer');
 
    lds.insertBefore(like, share);
 
    like.setAttribute('class', like.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
    like.removeAttribute('is-paper-button-with-icon');
    like.removeAttribute('is-paper-button');
    like.setAttribute('style-action-button', '');
    like.setAttribute('is-icon-button', '');
    like.querySelector('a').insertBefore(like.querySelector('yt-formatted-string'), like.querySelector('tp-yt-paper-tooltip'));
    try { like.querySelector('paper-ripple').remove(); } catch(e) {}
    var paper = like.querySelector('tp-yt-paper-button');
    paper.removeAttribute('style-target');
    paper.removeAttribute('animated');
    paper.removeAttribute('elevation');
    like.querySelector('a').insertBefore(paper.querySelector('yt-icon'), like.querySelector('yt-formatted-string'));
    paper.outerHTML = paper.outerHTML.replace('<tp-yt-paper-button ', '<yt-icon-button ').replace('</tp-yt-paper-button>', '</yt-icon-button>');
    paper = like.querySelector('yt-icon-button');
    paper.querySelector('button#button').appendChild(like.querySelector('yt-icon'));
 
    var dislike = $('ytd-video-primary-info-renderer div#segmented-dislike-button > ytd-toggle-button-renderer');
    lds.insertBefore(dislike, share);
    $('ytd-video-primary-info-renderer ytd-segmented-like-dislike-button-renderer').remove();
    dislike.setAttribute('class', dislike.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
    dislike.removeAttribute('has-no-text');
    dislike.setAttribute('style-action-button', '');
    var dlabel = document.createElement('yt-formatted-stringx');
    dlabel.setAttribute('id', 'text');
    if(dislike.getAttribute('class').includes('style-default-active'))
        dlabel.setAttribute('class', dlabel.getAttribute('class').replace('style-default', 'style-default-active'));
    dislike.querySelector('a').insertBefore(dlabel, dislike.querySelector('tp-yt-paper-tooltip'));
 
    $('ytd-video-primary-info-renderer').removeAttribute('flex-menu-enabled');
});
 
// CSS adjustments
(function() {var css = [
	"/*right column*/",
	"  [d*=\"M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z\"] {",
	"    d: path(\"M11.7333 8.26667V4L19.2 11.4667L11.7333 18.9333V14.56C6.4 14.56 2.66667 16.2667 0 20C1.06667 14.6667 4.26667 9.33333 11.7333 8.26667Z\")",
	"  }",
    "  [d*=\"M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z\"] {",
	"    d: path(\"M11.7333 8.26667V4L19.2 11.4667L11.7333 18.9333V14.56C6.4 14.56 2.66667 16.2667 0 20C1.06667 14.6667 4.26667 9.33333 11.7333 8.26667Z\")",
	"  }"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		//
		document.documentElement.appendChild(node);
	}
}
})();
 