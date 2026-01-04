// ==UserScript==
// @name         CSDN、知乎页面美化脚本
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  Modify some titles, like csdn and zhihu ...
// @author       Xiangman
// @match        https://blog.csdn.net/*
// @match        https://*.blog.csdn.net/*
// @match        https://zhihu.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434811/CSDN%E3%80%81%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434811/CSDN%E3%80%81%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'ustrict';

    var title = document.title;
    // alert(title);
    if (title.indexOf("条消息) ") != -1) {
        var start = title.indexOf(") ") + 2;
        title = title.substring(start);
        // alert(titl
        document.title = title
    }

    var docs = document.getElementById("content_views")
    var classes = docs.getElementsByTagName('pre')
    // alert(classes.length)
    for (var i = 0; i < classes.length; i++) {
        classes[i].className = 'prettyprint set-code-show';
        var todelete = classes[i].getElementsByClassName('hide-preCode-box');
        if (todelete.length > 0) {
            for (var j = todelete.length - 1; j >= 0; j--) {
                classes[i].removeChild(todelete[j]);
            }
        }
    }

    var classes_download = document.getElementsByClassName('recommend-item-box type_download clearfix')
    // alert(classes_download.length)
    for (var k = 0; k < classes_download.length; k++) {
        classes_download[k].parentNode.removeChild(classes_download[k]);
    }
})();