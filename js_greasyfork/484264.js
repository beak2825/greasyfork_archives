// ==UserScript==
// @name         tt1069 jammer remove
// @namespace    http://minhill.com/
// @version      0.3
// @description  remove jammer in tt1069
// @author       Pchy Han
// @match        https://yuluji.blogspot.com/*
// @match        https://www.tt1069.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484264/tt1069%20jammer%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/484264/tt1069%20jammer%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var jammNodes = document.querySelectorAll('.jammer');
     Array.from(jammNodes).forEach(node=>node.parentNode.removeChild(node));
     var fontWhiteNodes = document.querySelectorAll('font[style="color:rgb(255, 255, 255)"]');
     Array.from(fontWhiteNodes).forEach(node=>node.parentNode.removeChild(node));

})();