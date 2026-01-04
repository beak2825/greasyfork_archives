// ==UserScript==
// @name         茶馆帖子屏蔽
// @namespace    plus+@icesword95
// @version      0.12
// @create       2022-01-09
// @lastmodified 2022-01-09
// @license MIT 
// @description  屏蔽人不是个事儿，还是关键词好用
// @author       icesword95
// @match        *bbs.snow-plus.net/thread.php?fid-9*
// @downloadURL https://update.greasyfork.org/scripts/438254/%E8%8C%B6%E9%A6%86%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/438254/%E8%8C%B6%E9%A6%86%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keywords = ['原神','理财','NTF'];
    var topics = document.getElementsByClassName('tr3 t_one');

    for (var i = topics.length-1; i >=0; i--) {
        var a = topics[i];
        var title = a.innerText;

        for (var j = 0; j < keywords.length; j++) {
            var keyword = keywords[j];

            if(title.indexOf(keyword) >= 0){
                console.log('Removed: ' + a.href + ' [' + title + ']');

                a.remove();
            }
        }
    }
})();