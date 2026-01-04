// ==UserScript==
// @name         MagicCard-Reload
// @version      0.1
// @namespace    https://greasyfork.org/users/212360
// @description  Reload magiccard webpage when it being a warning.gif
// @author       zelricx
// @date         2018.11.22
// @match        http://imgcache.qq.com/images/warning.gif
// @icon         http://show.qq.com/favicon.ico
// @encoding     utf-8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374651/MagicCard-Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/374651/MagicCard-Reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href == 'http://imgcache.qq.com/images/warning.gif') {
        window.location.href = 'http://appimg2.qq.com/card/index_v3.html';
    }

})();