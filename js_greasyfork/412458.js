// ==UserScript==
// @name         Океюшки
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  отправляем OK в чат ватцапа!
// @author       demettriss
// @match        https://web.whatsapp.com/
// @include        https://*.whatsapp.com/
// @include        https://*.whatsapp.com
// @match          https://*.whatsapp.com
// @match          http://*.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412458/%D0%9E%D0%BA%D0%B5%D1%8E%D1%88%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/412458/%D0%9E%D0%BA%D0%B5%D1%8E%D1%88%D0%BA%D0%B8.meta.js
// ==/UserScript==

/* https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ru */

(function() {
    'use strict';

    var okPush = null;
    setInterval(function() {
        if (okPush === null) {
            // не установлено время пуша
            var nd = new Date();
            var h = nd.getHours();
            if (h >= 0 || h < 8) {
                okPush = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate(), 8, getRandomInt(30), getRandomInt(30));
            }
        } else {
            var ndf = new Date();
            var ndfh = ndf.getHours();
            if (ndf - okPush > 0 && ndfh === 8) {
                var inp = document.querySelector('[data-testid="send"]');
                inp.parentNode.click();
                okPush = null;
            }
        }
    }, 275000);

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
})();