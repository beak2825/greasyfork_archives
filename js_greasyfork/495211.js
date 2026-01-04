// ==UserScript==
// @name         videoChange
// @namespace    http://tampermonkey.net/
// @version      v0.5
// @description  简单视频倍速改变
// @author       HBZ
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495211/videoChange.user.js
// @updateURL https://update.greasyfork.org/scripts/495211/videoChange.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#container > video").playbackRate = 16;
})();