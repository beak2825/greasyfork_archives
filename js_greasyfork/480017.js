// ==UserScript==
// @name        大家都是Plus
// @namespace   Violentmonkey Scripts
// @match       https://*/*
// @grant       none
// @version     1.0
// @author      kalicyh
// @license     MIT
// @description 2023/11/16 13:31:59
// @downloadURL https://update.greasyfork.org/scripts/480017/%E5%A4%A7%E5%AE%B6%E9%83%BD%E6%98%AFPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/480017/%E5%A4%A7%E5%AE%B6%E9%83%BD%E6%98%AFPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var addButton = document.createElement('button');
    addButton.innerHTML = 'GIZMO';
    addButton.style.position = 'fixed';
    addButton.style.top = '10px';
    addButton.style.right = '10px';

    document.body.appendChild(addButton);

    addButton.addEventListener('click', function() {
        var url = new URL(window.location.href);
        if (!url.searchParams.has('model')) {
            url.searchParams.set('model', 'gpt-4-gizmo');
            window.location.href = url.href;
        }
    });
})();
