// ==UserScript==
// @name         Toolxun
// @namespace    tool-xun
// @version      2024-02-06
// @description  a tuxun toolkit with only one tool
// @author       JasY
// @match        https://tuxun.fun/map-maker?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486774/Toolxun.user.js
// @updateURL https://update.greasyfork.org/scripts/486774/Toolxun.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'Space':
                var buttonSpace = document.getElementsByClassName('el-button')[2]
                if (buttonSpace) buttonSpace.click();
                break;
        }
    });
})();