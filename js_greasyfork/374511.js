// ==UserScript==
// @name         DF Forum Badge
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Changes all the forum stars to red.
// @author       Barney
// @include      /fairview\.deadfrontier\.com\/onlinezombiemmo\/index\.php\?topic=/
// @downloadURL https://update.greasyfork.org/scripts/374511/DF%20Forum%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/374511/DF%20Forum%20Badge.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var imgSrc = document.getElementsByTagName('img');
        for(var i = 0; i < imgSrc.length ; i++) {
            if( imgSrc[i].src.indexOf("starmod") != -1) {
            imgSrc[i].src = 'https://cdn.discordapp.com/attachments/272954770032033796/513903062088286208/staradmin687.png';
               }
        }

})();