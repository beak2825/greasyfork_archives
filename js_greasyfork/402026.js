// ==UserScript==
// @name         Humble Bundle Current Country Spy
// @description  Show current Humble Bundle country in navbar.
// @author       Cloud
// @namespace    https://github.com/xPixv/Humble-Bundle-Current-Country-Spy
// @supportURL   https://github.com/xPixv/Humble-Bundle-Current-Country-Spy/issues
// @version      1.1.7
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @include      https://www.humblebundle.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402026/Humble%20Bundle%20Current%20Country%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/402026/Humble%20Bundle%20Current%20Country%20Spy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const showCountry = () => {
        try {
            const country = unsafeWindow.models.request.country_code;

            let node = document.getElementsByClassName('tabs tabs-navbar-item');

            if (node.item(0)) {
                let elem = document.createElement('a');
                elem.setAttribute('class', 'navbar-item not-dropdown button-title');
                elem.href = "#";
                elem.innerHTML = '<span class="navbar-icon-text-wrapper"><i class="navbar-item-icon hb hb-star-o mobile"></i><span class="navbar-item-text">'+country+'</span></span>';
                node.item(0).append(elem);
            }

            node = document.getElementsByClassName('mm-listview');

            if (node.item(0)) {
                let elem = document.createElement('li');
                elem.setAttribute('class', 'mm-listitem');
                elem.innerHTML = '<a href="#" class="mm-listitem__text">'+country+'</a>';
                node.item(0).append(elem);
            }
        } catch (e) {
            setTimeout(() => {
                showCountry();
            }, 500);
        }
    };

    setTimeout(() => {
        showCountry();
    }, 100);
})();
