// ==UserScript==
// @name         toBlackAndWhite
// @namespace    b-a-w
// @version      0.1
// @description  try to change the website to black and white;
// @author       2024
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404980/toBlackAndWhite.user.js
// @updateURL https://update.greasyfork.org/scripts/404980/toBlackAndWhite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const extraStyle = document.createElement('style');
    extraStyle.innerHTML = `
       html {
            filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
         	filter: grayscale(100%);
        	-webkit-filter: grayscale(100%);
         	filter: gray;
        	-webkit-filter: grayscale(1);
       }`;
    document.head.appendChild(extraStyle);
})();