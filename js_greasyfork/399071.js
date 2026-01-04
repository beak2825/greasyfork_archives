// ==UserScript==
// @name         steamdb.info屏蔽周末临时免费
// @description  steamdb.info steam免费游戏界面屏蔽周末临时免费，只显示永久。
// @version      1.1
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include       **steamdb.info/upcoming/free**
// @downloadURL https://update.greasyfork.org/scripts/399071/steamdbinfo%E5%B1%8F%E8%94%BD%E5%91%A8%E6%9C%AB%E4%B8%B4%E6%97%B6%E5%85%8D%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/399071/steamdbinfo%E5%B1%8F%E8%94%BD%E5%91%A8%E6%9C%AB%E4%B8%B4%E6%97%B6%E5%85%8D%E8%B4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var keywords = ['','Weekend'];

    setInterval(function(){

        var topics = document.getElementsByTagName('td');

        for (var i = 0; i < topics.length; i++) {
            var a = topics[i];
            var title = a.innerText;

            for (var j = 0; j < keywords.length; j++) {
                var keyword = keywords[j];
                if (keyword!='') {
                if(title.indexOf(keyword) >= 0){
                    console.log('Removed: ' + a.href + ' [' + title + ']');

                    a.parentElement.remove();
                }}
            }
        }
    }, 100);
})();