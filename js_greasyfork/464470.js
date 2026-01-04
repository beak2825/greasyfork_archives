// ==UserScript==
// @name         Recast auto watcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically keeps watching ads for you
// @author       Tobias van den Hurk
// @match        https://watch.recast.tv/watch-and-earn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=recast.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464470/Recast%20auto%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/464470/Recast%20auto%20watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setInterval(() => {
        let click = new MouseEvent("click", {bubbles: true});

        document.getElementsByClassName("adPlayerPlaceholder__bottomLayout__buttons")[0]
            ?.firstChild.dispatchEvent(click);

        document.getElementsByClassName("adPlayer__playButton")[0]
            ?.dispatchEvent(click)
    }, 1000);
}) ();