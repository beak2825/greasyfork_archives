// ==UserScript==
// @name         Youtube watch page 2022 update reverter
// @version      6.1
// @description  Reverts the shitty watch page and all Youtube 2022 updates to the old layout (including icons)
// @author       Cat Bot
// @author       Aubrey Pankow (aubyomori@gmail.com)
// @author       Taniko Yamamoto (kirasicecreamm@gmail.com)
// @license MIT
// @match        *://*.youtube.com/*
// @namespace    https://www.reddit.com/user/Cat_Bot4
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445136/Youtube%20watch%20page%202022%20update%20reverter.user.js
// @updateURL https://update.greasyfork.org/scripts/445136/Youtube%20watch%20page%202022%20update%20reverter.meta.js
// ==/UserScript==

const ATTRS = [
    "darker-dark-theme",
    "system-icons"
];

const CONFIGS = {
    BUTTON_REWORK: false
}
const EXPFLAGS = {
    kevlar_system_icons: false,
    render_unicode_emojis_as_small_images: true,
    kevlar_unavailable_video_error_ui_client: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_watch_metadata_refresh: false,
    kevlar_watch_modern_metapanel: false,
    web_amsterdam_playlists: false,
    web_animated_like: false,
    web_button_rework_with_live: false,
    web_darker_dark_theme: false, //change false to true on this line if you want to keep the darker mode
    web_guide_ui_refresh: false,
    web_modern_ads: false,
    web_modern_buttons: false,
    web_modern_chips: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_sheets_ui_refresh: false
}

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

(function() {var css = [
	"/*right column*/",
	"  [d*=\"M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z\"] {",
	"    d: path(\"M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z\")",
	"  }",
    "  [d*=\"M12 20.95Q8.975 20.075 6.987 17.312Q5 14.55 5 11.1V5.7L12 3.075L19 5.7V11.35Q18.775 11.275 18.5 11.2Q18.225 11.125 18 11.075V6.375L12 4.15L6 6.375V11.1Q6 12.575 6.438 13.938Q6.875 15.3 7.625 16.438Q8.375 17.575 9.413 18.425Q10.45 19.275 11.625 19.725L11.675 19.7Q11.8 20 11.975 20.288Q12.15 20.575 12.375 20.825Q12.275 20.85 12.188 20.888Q12.1 20.925 12 20.95ZM17 17Q17.625 17 18.062 16.562Q18.5 16.125 18.5 15.5Q18.5 14.875 18.062 14.438Q17.625 14 17 14Q16.375 14 15.938 14.438Q15.5 14.875 15.5 15.5Q15.5 16.125 15.938 16.562Q16.375 17 17 17ZM17 20Q17.8 20 18.438 19.65Q19.075 19.3 19.5 18.7Q18.925 18.35 18.3 18.175Q17.675 18 17 18Q16.325 18 15.7 18.175Q15.075 18.35 14.5 18.7Q14.925 19.3 15.562 19.65Q16.2 20 17 20ZM17 21Q15.325 21 14.163 19.837Q13 18.675 13 17Q13 15.325 14.163 14.162Q15.325 13 17 13Q18.675 13 19.837 14.162Q21 15.325 21 17Q21 18.675 19.837 19.837Q18.675 21 17 21ZM12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Z\"] {",
	"    d: path(\"M12 21.75q-3.375-.85-5.575-3.888-2.2-3.037-2.2-6.762V5.175L12 2.25l7.775 2.925v5.675q-.65-.3-1.387-.463-.738-.162-1.463-.162-2.775 0-4.737 1.963-1.963 1.962-1.963 4.737 0 1.425.55 2.613.55 1.187 1.425 2.112l-.087.05q-.088.05-.113.05Zm4.925 0q-2 0-3.412-1.413-1.413-1.412-1.413-3.412t1.413-3.413q1.412-1.412 3.412-1.412t3.412 1.412q1.413 1.413 1.413 3.413 0 2-1.413 3.412-1.412 1.413-3.412 1.413Zm0-1.875q.775 0 1.412-.35.638-.35 1.063-.95-.575-.325-1.188-.5-.612-.175-1.287-.175-.65 0-1.262.175-.613.175-1.163.5.4.6 1.038.95.637.35 1.387.35Zm0-2.95q.625 0 1.05-.425.425-.425.425-1.05t-.425-1.05q-.425-.425-1.05-.425-.6 0-1.038.425-.437.425-.437 1.05 0 .6.425 1.038.425.437 1.05.437Z\")",
    "  }",
    "  [d*=\"M10,20c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-1.1,0.9-2,2-2S10,18.9,10,20z M16,18c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2s2-0.9,2-2 C18,18.9,17.1,18,16,18z M7.81,14L7.1,16H18v1H6l0.03-0.97l0.8-2.25L5,5V3H3V2h2h1v1v2h14l-1.88,9H7.81z M6.23,6l1.46,7h9.62l1.46-7 H6.23z\"] {",
	"    d: path(\"M10,20c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-1.1,0.9-2,2-2S10,18.9,10,20z M16,18c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2s2-0.9,2-2 C18,18.9,17.1,18,16,18z M7.81,14L7.1,16H18v1H6l0.03-0.97l0.8-2.25L5,5V3H3V2h2h1v1v2h14l-1.88,9H7.81z\")",
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
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();