// ==UserScript==
// @name         Block catbox/litterbox anime girls
// @namespace    https://catbox.moe/
// @version      1.0
// @description  Block | remove Catbox/Litterbox anime "grills" images.
// @author       NO FUN ALLOWED
// @license MIT
// @match        https://catbox.moe/*
// @match        https://litterbox.catbox.moe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521035/Block%20catboxlitterbox%20anime%20girls.user.js
// @updateURL https://update.greasyfork.org/scripts/521035/Block%20catboxlitterbox%20anime%20girls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function killImg() {
        document.querySelectorAll('div.image').forEach(div => {
            const eleMent = div.querySelector('script[src="resources/pic.js"]');
            const img = div.querySelector('img[src^="resources/qts/"], img[src^="pictures/qts/"]');
            if (eleMent && img) {
                div.remove();
            }
        });
    }
    killImg();
    const observer = new MutationObserver(killImg);
    observer.observe(document.body, { childList: true, subtree: true });
})();