// ==UserScript==
// @name         Too Many Layers
// @namespace    https://greasyfork.org/en/scripts/507731-too-many-layers
// @version      2024.09.10.001
// @description  Allows a longer list of layers in the map layers menu.
// @author       robosphinx_, callumhume
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/507731/Too%20Many%20Layers.user.js
// @updateURL https://update.greasyfork.org/scripts/507731/Too%20Many%20Layers.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

(function main() {
    'use strict';

    const SCRIPT_LONG_NAME = GM_info.script.name;
    const SCRIPT_SHORT_NAME = "WME-TML";
    const SCRIPT_VERSION = GM_info.script.version;

    const DISPLAY_LAYER_GROUP_CLASS = '.collapsible-GROUP_DISPLAY';

    let successfulStartup = false;

    function fancyLogMessage(tag, message) {
        if (tag == "ERROR") {
            console.error(SCRIPT_SHORT_NAME + ": " + tag + ": " + message);
        }
        else {
            console.log(SCRIPT_SHORT_NAME + ": " + tag + ": " + message);
        }
    }

    function embiggenTheList() {
        // Heirarchy follows
        // ID layer-switcher-region
        // class layer-switcher
        // class menu
        // class scrollable
        // class list-unstyled togglers
        // class group
        // class collapsible-GROUP_DISPLAY
        try {
            fancyLogMessage("INFO", "Looking for display layer group...");
            let displayGroup = document.querySelector(DISPLAY_LAYER_GROUP_CLASS); // Grab element by class name, not ID
            if (displayGroup != null) {
                fancyLogMessage("INFO", "Found display layer group: " + displayGroup);
                displayGroup.style.setProperty('max-height', 'fit-content');
                successfulStartup = true;
            }
            else {
                fancyLogMessage("ERROR", "Could not find element with class " + DISPLAY_LAYER_GROUP_CLASS);
                successfulStartup = false;
            }
        }
        catch (err) {
            fancyLogMessage("ERROR", "Looking for display group returned error " + err);
            successfulStartup = false;
        }
    };


    function init() {
        fancyLogMessage("INFO", SCRIPT_LONG_NAME + " " + SCRIPT_VERSION + " started");
        embiggenTheList();
        if (successfulStartup) {
            fancyLogMessage("INFO", SCRIPT_LONG_NAME + " initialized!");
        }
        else {
            fancyLogMessage("ERROR", SCRIPT_LONG_NAME + " could not initialize.");
        }
    }

    function onWmeReady() {
        if (WazeWrap && WazeWrap.Ready) {
            init();
        } else {
            setTimeout(onWmeReady, 100);
        }
    }

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            onWmeReady();
        } else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    bootstrap();
})();
