// ==UserScript==
// @name         Webmota Ext++
// @namespace    https://webmota.houtar.eu.org/ext++
// @version      0.2
// @description  Provide codes of a manga reader.
// @author       Houtar
// @match        *://*.webmota.com/comic/chapter/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webmota.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/454331/Webmota%20Ext%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/454331/Webmota%20Ext%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var shower = window.open('', '_blank', 'popup');
    if (shower !== null) {
        shower.document.body.innerText = "document.body.innerHTML = '';\nvar d = document.createElement('div');\ndocument.body.style.fontSize = '0';\ndocument.body.style.backgroundColor = 'darkgray';\nd.style.width = '1200px';\nd.style.margin = 'auto';\nfor (var index = 1; index < 100; index++) {\n  var a = document.createElement('img');\n  a.src = \"".concat(document.querySelector("#chapter-img-0-0 > img").src.replace('1.jpg', ''), "\".concat(index, \".jpg\");\n  a.onload = function () {\n    d.style.width = d.children[0].width + 'px';\n  };\n  document.body.appendChild(d);\n  d.appendChild(a);\n}");
    } else {
        window.alert('窗口未弹出。\n这可能是由于您的浏览器阻止了弹出窗口。');
    }
})();