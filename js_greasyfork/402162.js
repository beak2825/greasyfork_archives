// ==UserScript==
// @name Spotify Side Mode
// @namespace https://github.com/dearrrfish/my-userscripts
// @version 1.0.0
// @description Re-arrange elements in now playing bar to fit narrow window.
// @author dearrrfish
// @homepageURL https://github.com/dearrrfish/my-userscripts
// @supportURL https://github.com/dearrrfish/my-userscripts/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/402162/Spotify%20Side%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/402162/Spotify%20Side%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `body {
    font-family: Microsoft Yahei;
}

@media screen and (max-width: 700px) {
    body {
        min-width: unset;
    }

    .now-playing-bar-container {
        min-width: unset
    }

    .now-playing-bar {
        width: 100%;
        min-height: 70px;
        padding: 10px 20px;
        height: unset;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .now-playing-bar__left {
        width: auto;
        order: 1;
    }

    .now-playing-bar__center {
        width: 100%;
        order: 3;
    }

    .now-playing-bar__right {
        max-width: 25%;
        min-width: unset;
        order: 2;
    }

    .now-playing-bar__right__inner {
        width: 100%;
    }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
