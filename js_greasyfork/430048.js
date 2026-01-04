// ==UserScript==
// @name         文字变链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  把网页中的字符串链接变成可以直接点击的A标签链接
// @author       Y.X.L
// @include      *
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=jianshu.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/430048/%E6%96%87%E5%AD%97%E5%8F%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/430048/%E6%96%87%E5%AD%97%E5%8F%98%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
var jjjq = $.noConflict();
(function () {
    'use strict';
    var rep = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    var linkList = jjjq('body').text().match(rep);
    if (linkList.length != 0) {
        for (var link of linkList) {
            var elements = jjjq(':contains(' + link + ')');
            var element = elements[elements.length - 1];
            if (element.tagName == 'A') continue;
            var newHTML = element.innerHTML.replace(link, "<a href=\'" + link + "\' target='_blank'>" + link + "</a>");
            element.innerHTML = newHTML;
        }
    }

    // Your code here...
})();