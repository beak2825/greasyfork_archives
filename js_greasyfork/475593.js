// ==UserScript==
// @name         Configure YouTube features
// @version      2023.10.26
// @description  This script (based on YouTube Patch Collection) allows you to configure YouTube features & additional ones that are on a rollout, such as the new modern tabs, rounded player, you tab & more using yt.config flags!
// @author       Alpharetzy
// @license      MIT
// @match        www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1094802
// @downloadURL https://update.greasyfork.org/scripts/475593/Configure%20YouTube%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/475593/Configure%20YouTube%20features.meta.js
// ==/UserScript==

// Attributes to remove from <html>
const ATTRS = [
    // "system-icons",
    // "typography",
    // "typography-spacing"
];

// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: true
};

// Experiment flags.
const EXPFLAGS = {
    enable_channel_page_header_profile_section: true,
    enable_header_channel_handler_ui: true,
    kevlar_unavailable_video_error_ui_client: true,
    kevlar_refresh_on_theme_change: true,
    kevlar_modern_sd_v2: true,
    kevlar_watch_cinematics: true,
    kevlar_watch_comments_panel_button: true,
    //kevlar_watch_grid: true,
    //kevlar_watch_grid_hide_chips: true,
    kevlar_watch_metadata_refresh: true,
    kevlar_watch_metadata_refresh_no_old_secondary_data: true,
    kevlar_watch_modern_metapanel: true,
    kevlar_watch_modern_panels: true,
    kevlar_watch_panel_height_matches_player: true,
    smartimation_background: true,
    web_amsterdam_playlists: true,
    web_animated_actions: true,
    kevlar_system_icons: true,
    web_animated_like: true,
    web_button_rework: true,
    web_button_rework_with_live: true,
    web_darker_dark_theme: true,
    web_enable_youtab: true,
    web_guide_ui_refresh: true,
    web_modern_ads: true,
    web_modern_buttons: true,
    web_modern_chips: true,
    web_modern_collections_v2: true,
    web_modern_dialogs: true,
    web_modern_playlists: true,
    web_modern_subscribe: true,
    web_modern_tabs: true,
    web_modern_typography: true,
    web_rounded_containers: true,
    web_rounded_thumbnails: true,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: true,
    web_sheets_ui_refresh: true,
    web_snackbar_ui_refresh: true,
    web_watch_rounded_player_large: true
}

// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_player_move_autonav_toggle: "true",
    web_settings_menu_icons: "true",
    web_rounded_containers: "true",
    web_rounded_thumbnails: "true"
};

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