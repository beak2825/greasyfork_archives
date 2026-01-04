// ==UserScript==
// @name         TunnelBroker 更多地区
// @namespace    0u0.one
// @version      v0.3.1
// @description  awa!
// @author       LYY2182
// @match        https://tunnelbroker.net/account.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunnelbroker.net
// @grant        none
// @run-at       document-idle
// @license 3BSD
// @downloadURL https://update.greasyfork.org/scripts/541616/TunnelBroker%20%E6%9B%B4%E5%A4%9A%E5%9C%B0%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/541616/TunnelBroker%20%E6%9B%B4%E5%A4%9A%E5%9C%B0%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addOption = () => {
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.add(new Option('将军の老家（朝鲜）', 'KP'));
            countrySelect.add(new Option('南苏丹', 'SS'));
            countrySelect.add(new Option('留尼汪', 'RE'));
            countrySelect.add(new Option('科索沃（可能用不了）', 'XK'));
        }
    };

    addOption();
})();