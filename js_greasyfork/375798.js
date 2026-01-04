// ==UserScript==
// @name         [InstaBinary] Блок с катировкой
// @namespace    tuxuuman:instaforex.com
// @version      0.1
// @description  Добавлят блок фиксированый блок с котировкой
// @author       tuxuuman<vk.com/tuxuuman, tuxuuman@gmail.com>
// @match        https://binary.instaforex.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375798/%5BInstaBinary%5D%20%D0%91%D0%BB%D0%BE%D0%BA%20%D1%81%20%D0%BA%D0%B0%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/375798/%5BInstaBinary%5D%20%D0%91%D0%BB%D0%BE%D0%BA%20%D1%81%20%D0%BA%D0%B0%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%BE%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cVal = $("<input type='text' enabled='false'/>", {
        style: {
            "position": "absolute",
            "top": 0,
            "left": 0
        }
    });

    $('body').prepend(cVal);

    Object.defineProperty($("#coor_y1")[0], "value", {
        set: function(value) {
            cVal.val(value);
        },
        get: function() {
            return cVal.val();
        }
    });

})();