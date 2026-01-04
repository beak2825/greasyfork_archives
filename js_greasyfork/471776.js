// ==UserScript==
// @name         YouTube patch collection
// @version      0.1
// @description  feel free to modify
// @author       daylin
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1132181
// @downloadURL https://update.greasyfork.org/scripts/471776/YouTube%20patch%20collection.user.js
// @updateURL https://update.greasyfork.org/scripts/471776/YouTube%20patch%20collection.meta.js
// ==/UserScript==

// polyfill for chrome :vomit:
(function() {
    if ("onbeforescriptexecute" in document) return;

    let scriptWatcher = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT") {
                    let syntheticEvent = new CustomEvent("beforescriptexecute", {
                        detail: node,
                        cancelable: true
                    })

                    if (!document.dispatchEvent(syntheticEvent)) {
                        node.remove();
                    }
                }
            }
        }
    })
    scriptWatcher.observe(document, {
        childList: true,
        subtree: true
    })
})();

(function() {

    const EXP_MOD_POLYMER_JS = false;
    const OLD_POLYMER_JS_CONTENT = fetch("https://www.youtube.com/s/desktop/18069be1/jsbin/desktop_polymer.vflset/desktop_polymer.js");

    function modifyJson(json) {

        json.EXPERIMENT_FLAGS.kevlar_updated_logo_icons = false;
        json.EXPERIMENT_FLAGS.kevlar_updated_icons = false;
        json.EXPERIMENT_FLAGS.kevlar_system_icons = false;
        json.EXPERIMENT_FLAGS.kevlar_watch_color_update = false;
        json.EXPERIMENT_FLAGS.desktop_mic_background = false;
        json.EXPERIMENT_FLAGS.kevlar_unavailable_video_error_ui_client = false;
        json.EXPERIMENT_FLAGS.kevlar_center_search_results = false;
        json.EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh = false;
        json.EXPERIMENT_FLAGS.web_snackbar_ui_refresh = false;
        json.EXPERIMENT_FLAGS.web_guide_ui_refresh = false;
        json.EXPERIMENT_FLAGS.web_sheets_ui_refresh = false;
       // json.EXPERIMENT_FLAGS.web_darker_dark_theme = true; //

        json.WEB_PLAYER_CONTEXT_CONFIGS
            .WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH
            .serializedExperimentFlags = modifyPlayerExperiments(
                json.WEB_PLAYER_CONTEXT_CONFIGS
                .WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH
                .serializedExperimentFlags
            );

        startHtmlMods();

        // ------------------------------- //

        return JSON.stringify(json);
    }

    function modifyPlayerExperiments(text) {
        var flags = deserialiseFlags(text);

        // perform your modifications here;
        // due to the encoding of these, the value
        // will always be a string (rather than a bool,
        // for instance)

        flags.web_player_move_autonav_toggle = "false";
        flags.web_settings_menu_icons = "false";

        // ------------------------------- //

        var response = serialiseFlags(flags);
        return response;
    }

    function serialiseFlags(json) {
        var keys = Object.keys(json),
            response = "";

        for (var i = 0, j = keys.length; i < j; i++) {
            if (i > 0) {
                response += "&";
            }
            response += keys[i] + "=" + json[keys[i]];
        }

        return response;
    }

    function deserialiseFlags(text) {

        var a = text.split("&"),
            obj = {};

        for (var i = 0, j = a.length; i < j; i++) {
            var b = a[i].split("=");
            var key = b[0];
            var val = b[1];
            obj[key] = val;
        }

        return obj;
    }

    function extractYtConfigJson(text) {
        const open = "ytcfg.set(";
        const close = ");";

        var a = text.split(open);
        var b = a[1].split(close);
        return b[0];
    }

    function modifyYtConfig(text) {
        var originalJson = extractYtConfigJson(text);
        var parsedJson = JSON.parse(originalJson);

        var modifiedJson = modifyJson(parsedJson);

        var newText = text.replace(originalJson, modifiedJson);
        return newText;
    }

    function startHtmlMods() {
        document.getElementsByTagName('html')[0].removeAttribute('system-icons');
    }

    async function waitForElm(s) {
        while (document.querySelector(s) === null) {
            await new Promise(r => requestAnimationFrame(r))
        }
        return document.querySelector(s);
    }

    async function modPolymerJs(srcUrl) {
        var a = document.createElement("script");
        a.src = srcUrl;
        document.body.appendChild(a);
    }

    const handleScript = (e) => {
        let script = e.details || e.target;

        if (script.textContent.search("ytcfg.set") > -1) {
            script.textContent = modifyYtConfig(script.textContent);
        } else if (EXP_MOD_POLYMER_JS && script.src.search("desktop_polymer") > -1) {
            script.textContent = OLD_POLYMER_JS_CONTENT;
        }
    };

    document.addEventListener("beforescriptexecute", handleScript);

})();

(function() {var css = [
	"/*right column*/",
	"  [d*=\"M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z\"] {",
	"    d: path(\"M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z\")",
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