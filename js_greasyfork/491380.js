// ==UserScript==
// @name          Скрыть блок с главной страницы
// @author        MALWARE
// @homepage      https://t.me/immalware/
// @include       https://zelenka.guru/*
// @grant         GM_addStyle
// @version       1.0
// @license MIT
// @icon          https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @run-at        document-start
// @description   удаление блока
// @namespace https://greasyfork.org/users/1061164
// @downloadURL https://update.greasyfork.org/scripts/491380/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B1%D0%BB%D0%BE%D0%BA%20%D1%81%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B9%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491380/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B1%D0%BB%D0%BE%D0%BA%20%D1%81%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B9%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.meta.js
// ==/UserScript==
var css = '.tournament-block-2 {display: none;}';
(function() {
    'use strict';
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();