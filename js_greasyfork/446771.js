// ==UserScript==
// @name Youtube helper
// @icon https://www.youtube.com/s/desktop/a14aba22/img/favicon_144x144.png
// @description Removes "thanks", "download", "clip" and "description" buttons, also removes "Do you want to continue?" popup in the playlist
// @author Murka
// @version 0.3
// @match *://www.youtube.com/*
// @run-at document-start
// @grant none
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/446771/Youtube%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/446771/Youtube%20helper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {

    const log = console.log;
	Object.defineProperty(window, "_lact", {
		get() {
			return Date.now();
		}
	})

    function createObserver(target, callback) {
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    callback(node);
                }
            }
        })
        observer.observe(target, { childList: true, subtree: true });
        return observer;
    }

    const exclude = ["OFFLINE_DOWNLOAD", "MONEY_HEART", "CONTENT_CUT", "INFO"];
    const observer = createObserver(document, function(node) {
        if (node.id !== "top-level-buttons-computed") return;

        let found = false;
        for (const child of node.children) {
            const data = child.__data && child.__data.data;
            const iconType = data && (data.defaultIcon && data.defaultIcon.iconType || data.icon && data.icon.iconType);
            if (iconType && exclude.includes(iconType)) {
                child.style.display = "none";
                found = true;
            }
            child.style.fontSize = "1em";
        }

        if (found) observer.disconnect();
    })

})();