// ==UserScript==
// @name         绯月首页屏蔽
// @namespace    fypb@icesword95
// @version      0.10
// @create       2022-04-08
// @lastmodified 2022-04-08
// @license MIT
// @description  按id及关键词屏蔽首页
// @author       icesword95
// @match        *bbs.9shenmi.com/*
// @downloadURL https://update.greasyfork.org/scripts/442957/%E7%BB%AF%E6%9C%88%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/442957/%E7%BB%AF%E6%9C%88%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {

    var keywords = ['zzzzz','zzzz','zzz'];
    var topics = document.getElementsByClassName('indexlbtc');
    for (var i = topics.length-1; i >=0; i--) {
        var a = topics[i];
        var title = a.innerHTML;
        for (var j = 0; j < keywords.length; j++) {
            var keyword = keywords[j];

            if(title.indexOf(keyword) != -1){
                console.log('Removed: ' + a.href + ' [' + title + ']');

                a.remove();
            }
        }
    }
})();