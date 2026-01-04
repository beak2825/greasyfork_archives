// ==UserScript==
// @name         bangumi日志及最新讨论关键词屏蔽
// @namespace    bgm@B.A.D
// @version      0.3
// @create       2022-01-18
// @lastmodified 2022-01-18
// @description  再见原批
// @author       icesword95
// @license MIT
// @match        *bangumi.tv/*
// @downloadURL https://update.greasyfork.org/scripts/438719/bangumi%E6%97%A5%E5%BF%97%E5%8F%8A%E6%9C%80%E6%96%B0%E8%AE%A8%E8%AE%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/438719/bangumi%E6%97%A5%E5%BF%97%E5%8F%8A%E6%9C%80%E6%96%B0%E8%AE%A8%E8%AE%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keywords = ['原神','asmr'];
    var tt = document.getElementById('news_list');
    var topics = tt.children;


    for (var i = topics.length-1; i >=0; i--) {

        var a = topics[i];
        var title = a.innerText;

        for (var j = 0; j < keywords.length; j++) {
            var keyword = keywords[j];

            if(title.indexOf(keyword) >= 0){
                a.remove();
            }
        }
    }
    var table=document.getElementsByClassName('topic_list');
    var trs = table[0].getElementsByTagName('tr');
    for (var k =trs.length-1;k>=0;k--){
        var innerText = trs[k].innerText;
        console.log(innerText);
        for (var l = 0; l < keywords.length; l++) {
            keyword = keywords[l];

            if(innerText.indexOf(keyword) >= 0){
                trs[k].remove();
            }
        }
    }

})();