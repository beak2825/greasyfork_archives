// ==UserScript==
// @name         Catbox.moe Paste
// @namespace    yuniDev.catbox-paste
// @version      1.0
// @description  Allows for pasting files directly into catbox.moe. For more scripts see https://alexdavies8.github.io/userscripts/
// @author       Alex Davies (yuniDev)
// @match        https://catbox.moe/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catbox.moe
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521414/Catboxmoe%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/521414/Catboxmoe%20Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', async (e) => {
        e.preventDefault();

        [...e.clipboardData.items].forEach(item => Dropzone.instances[0].addFile(item.getAsFile()));
    });
})();
