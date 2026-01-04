// ==UserScript==
// @name         Proxy 6 All View
// @namespace    Proxy 6 All View
// @version      0.1
// @description  Proxy 6 All Check Proxy
// @author       You
// @match        https://proxy6.net/user/proxy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proxy6.net
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/476911/Proxy%206%20All%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/476911/Proxy%206%20All%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const navBar = document.querySelector('.nav.nav-bar.user_proxy_nav');
    if (navBar) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.id = 'all-view-toggle';
        link.textContent = 'Проверить всё';
        listItem.appendChild(link);
        navBar.appendChild(listItem);
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const checkLinks = document.querySelectorAll('a[data-role="check"]');
            checkLinks.forEach(function (link) {
                link.click();
            });
        });
    }
})();