// ==UserScript==
// @name        Pixiv Preloads Images
// @namespace   https://greasyfork.org/es/users/47339
// @description Preloads images in a manga gallery 
// @match       *://*.pixiv.net/member_illust.php?*mode=manga*
// @run-at      document-end
// @version     1.0.0
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/20259/Pixiv%20Preloads%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/20259/Pixiv%20Preloads%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function preloadImages(array) {
        if (!preloadImages.list) {
            preloadImages.list = [];
        }
        var list = preloadImages.list;
        for (var i = 0; i < array.length; i++) {
            var img = new Image();
            img.onload = function() {
                var index = list.indexOf(this);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            };
            list.push(img);
            img.src = array[i];
        }
    }
    preloadImages(pixiv.context.images);
})();