// ==UserScript==
// @name         Open Iwara links in new tab
// @description  Open Iwara links in new tab when clicked
// @version      1.0
// @match        http://www.iwara.tv/*
// @match        https://www.iwara.tv/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1045829
// @downloadURL https://update.greasyfork.org/scripts/464849/Open%20Iwara%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/464849/Open%20Iwara%20links%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', function(event) {
        var element = event.target;
        while (element && element.nodeName !== 'A') {
            element = element.parentNode;
        }
        if (element) {
            event.preventDefault();
            window.open(element.href, '_blank');
        }
    });
})();