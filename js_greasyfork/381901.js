// ==UserScript==
// @name         weiqi auto jump
// @namespace    https://www.101weiqi.com/qday/
// @version      1.0
// @description  按下方向键右，可直接跳到下一题
// @author       Lennon
// @match        https://*.101weiqi.com/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @run-at       document-end
// @icon         https://deepmind.com/static/v0.0.0/appIcons/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/381901/weiqi%20auto%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/381901/weiqi%20auto%20jump.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var elementButton = $('a.btn-info');
    $(document).keyup(function(e) {
        switch (e.keyCode) {
                // arrow left
            case 37:
                elementButton[0].click();
                break;
                // arrow right
            case 39:
                if($('div[ng-click="startnext()"]').length) {
                    $('div[ng-click="startnext()"]').click();
                } else if ($(elementButton[1]).length) {
                    elementButton[1].click();
                } else if ($('div.huati_lei > span > a').attr('href').length) {
                    location.href = $('div.huati_lei > span > a').attr('href');
                }
                break;
        }

        return !0
    })
})();