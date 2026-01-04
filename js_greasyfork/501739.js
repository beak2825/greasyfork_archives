// ==UserScript==
// @name         蒙版降低亮度
// @version      1.0
// @description  创建半透明黑色蒙版降低网页亮度
// @author       ChatGPT
// @match        *://*/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/501739/%E8%92%99%E7%89%88%E9%99%8D%E4%BD%8E%E4%BA%AE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/501739/%E8%92%99%E7%89%88%E9%99%8D%E4%BD%8E%E4%BA%AE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.backgroundColor = '#000';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.zIndex = '999999';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0.20';
    overlay.style.width = '100%';
    overlay.style.height = '100%';

    document.body.appendChild(overlay);
})();
