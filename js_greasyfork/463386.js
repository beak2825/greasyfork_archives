// ==UserScript==
// @name         Misskey Favicon差し替え
// @namespace    https://misskey.io/@_kanade_
// @version      1.0.0
// @description  Faviconとapple-touch-iconを差し替え
// @author       kanade
// @license      MIT
// @match        https://misskey.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=misskey.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/463386/Misskey%20Favicon%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463386/Misskey%20Favicon%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

let icon = "https://s3.arkjp.net/emoji/blobcatnomblobdoggo.png";

(function() {
    'use strict';
    let timer = setInterval(modifyMisskeyIcon, 100);

    function modifyMisskeyIcon () {
        let elem1 = document.querySelector('link[rel="icon"]');
        let elem2 = document.querySelector('link[rel="apple-touch-icon"]');
        if (elem1) {
            elem1.setAttribute('href', icon);
            elem2.setAttribute('href', icon);
            clearInterval(timer);
        }
    }
})();
