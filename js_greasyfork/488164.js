// ==UserScript==
// @name         Youtube Tweaks for HD Monitor (1366x768)
// @namespace    https://greasyfork.org/en/scripts/488164-youtube-tweaks-for-hd-monitor-1366x768
// @version      v1.3
// @description  Add tweak menu like for setting the min-width for secondary columns and hide the reaction on YT Live.Mainly for HD monitor (1366x768).
// @author       Tanuki
// @run-at       document-end
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488164/Youtube%20Tweaks%20for%20HD%20Monitor%20%281366x768%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488164/Youtube%20Tweaks%20for%20HD%20Monitor%20%281366x768%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var minWidth = GM_getValue("min-width") ? GM_getValue("min-width") : 420;
    var hideReaction = GM_getValue("hideReaction") ? true : false; // this is needed in case GM_getValue("hideReaction") is null
    var displayReaction = hideReaction ? "none" : "flex";
    var hideScrollbar = GM_getValue("hideScrollbar") ? GM_getValue("hideScrollbar") : "initial";

    const style = document.createElement('style');
    style.insertAdjacentHTML('afterbegin', `
        html {
            scrollbar-width: ${hideScrollbar};
        }
        div#secondary.style-scope.ytd-watch-flexy {
            min-width: ${minWidth}px;
        }
        yt-reaction-control-panel-overlay-view-model.style-scope.yt-live-chat-renderer {
            display: ${displayReaction};
        }
    `);
    document.head.appendChild(style);

    function setMinWidth() {
        const value = prompt("set min-width value (default 420):");
        GM_setValue("min-width", value);
        location.reload();
    }

    function setHideReaction() {
        hideReaction = !hideReaction;
        GM_setValue("hideReaction", hideReaction);
        location.reload();
    }

    function setScrollbar() {
        switch(hideScrollbar){
                case "initial":
                    GM_setValue("hideScrollbar", "thin");
                    break;
                case "thin":
                    GM_setValue("hideScrollbar", "none");
                    break;
                case "none":
                    GM_setValue("hideScrollbar", "initial");
                    break;
                default :
                    GM_setValue("hideScrollbar", "initial");
        }
        location.reload();
    }

    function toDefault() {
        GM_deleteValue("min-width");
        GM_deleteValue("hideReaction");
        GM_deleteValue("hideScrollbar");
        location.reload();
    }

    function updateMenu() {
        // Register the menu command
        GM_registerMenuCommand(`Set min-width value (${minWidth})`, setMinWidth)
        GM_registerMenuCommand(`Reaction Button : ${hideReaction ? 'Hidden' : 'Shown'}`, setHideReaction);
        GM_registerMenuCommand(`Scrollbar style (${hideScrollbar})`, setScrollbar)
        GM_registerMenuCommand(`Reset to default`, toDefault);
    }

    // Register the initial menu command
    updateMenu();
})();