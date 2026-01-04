// ==UserScript==
// @name         Imagetwist BigIMG
// @version      0.1
// @description  显示imagetwist的大图片，方便看图
// @author       f1tz
// @match        http://*.imagetwist.com/th/*/*.jpg
// @grant        none
// @namespace https://greasyfork.org/users/172241
// @downloadURL https://update.greasyfork.org/scripts/40475/Imagetwist%20BigIMG.user.js
// @updateURL https://update.greasyfork.org/scripts/40475/Imagetwist%20BigIMG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.location.href.replace('th', 'i');
    document.location.href = a;
})();