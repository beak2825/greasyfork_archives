// ==UserScript==
// @name        АнтиAdBlock - avasuka
// @namespace   Violentmonkey Scripts
// @match       *://*.avasuka.monster/*
// @grant       unsafeWindow
// @run-at      document-end
// @version     1.5.0
// @author      exstrim401
// @description Этот скрипт позволяет играть на AvaSuka без рекламы
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/406938/%D0%90%D0%BD%D1%82%D0%B8AdBlock%20-%20avasuka.user.js
// @updateURL https://update.greasyfork.org/scripts/406938/%D0%90%D0%BD%D1%82%D0%B8AdBlock%20-%20avasuka.meta.js
// ==/UserScript==

unsafeWindow.adBlockFunction = function() { };
window.addEventListener('load', function() {
    unsafeWindow.adBlockFunction = function() { };
}, false);
unsafeWindow.document.getElementById('turnoffadblock').style.display = "none";
unsafeWindow.document.getElementById('clickMe').style.display = "block";