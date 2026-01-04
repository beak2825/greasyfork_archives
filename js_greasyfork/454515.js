// ==UserScript==
// @name         steam自动移除免费游戏/软件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  steam自动移除免费的游戏/软件
// @author       breeze
// @match        https://store.steampowered.com/account/licenses/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454515/steam%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/454515/steam%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (document.querySelectorAll('.free_license_remove_link a').length > 1) {
        document.querySelectorAll('.free_license_remove_link a')[0].click()
        setTimeout(() => {
            document.querySelector('.btn_green_steamui').click()
        }, 0)
    }

})();