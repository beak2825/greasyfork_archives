// ==UserScript==
// @name         Proxy 6 Delete Expire
// @namespace    Proxy 6 Delete Expire
// @version      0.1
// @description  Proxy 6 Delete All Expire Proxy
// @author       el9in
// @license      el9in
// @match        https://proxy6.net/user/proxy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proxy6.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478625/Proxy%206%20Delete%20Expire.user.js
// @updateURL https://update.greasyfork.org/scripts/478625/Proxy%206%20Delete%20Expire.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Используйте document.querySelectorAll для поиска элементов
    const navBar = document.querySelector('.nav.nav-bar.user_proxy_nav');
    if (navBar) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.id = 'all-view-toggle';
        link.textContent = 'Выбрать все удалённые';
        listItem.appendChild(link);
        navBar.appendChild(listItem);
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const elements = document.querySelectorAll('[id^="el-"]');
            for(let element of elements) {
                const labelDager = element.querySelector('.label.label-danger.mr-5');
                if(labelDager) {
                    const value = parseInt(labelDager.innerText);
                    if(value == 0) {
                        const submit = element.querySelector('input[type="checkbox"]');
                        submit.click();
                    }
                }
            }
        });
    }
})();