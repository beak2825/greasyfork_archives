// ==UserScript==
// @name         reka.ai application
// @namespace    Apache-2.0
// @version      1.2
// @description  Allow to install Reka as application
// @author       Tony 0tis
// @license      Apache-2.0
// @match        *://chat.reka.ai/chat
// @icon         https://chat.reka.ai/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492982/rekaai%20application.user.js
// @updateURL https://update.greasyfork.org/scripts/492982/rekaai%20application.meta.js
// ==/UserScript==

(function() {
    const manifestUrl = 'https://raw.githubusercontent.com/tony-0tis/manifests/refs/heads/main/chat.reka.ai/manifest.json';
    const manifest = document.createElement('link');
    manifest.rel = 'manifest'
    manifest.href = manifestUrl;
    document.head.appendChild(manifest);
})();