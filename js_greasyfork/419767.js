// ==UserScript==
// @name         nike 搶鞋
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      /gs.nike.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419767/nike%20%E6%90%B6%E9%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419767/nike%20%E6%90%B6%E9%9E%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

setInterval(function(){

            var d1 = new Date();
            var d2 = new Date(2021, 0, 7, 10, 0, 1); //控制啟動時間



            if (d1.getTime() >= d2.getTime()) {

                 document.querySelector('.button-submit').click();

            }




}, 1000);//每X秒執行1次

})();