// ==UserScript==
// @name         bilibili直播间-思源黑体
// @namespace   mscststs
// @version      0.1
// @description  直播间弹幕转为思源黑体
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35227/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4-%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/35227/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4-%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $().ready(
        function(){
                $("body").on("DOMNodeInserted",".bilibili-danmaku",function(){
                    $(this).css("font-family","Source Han Sans CN,Noto Sans CJK SC,Noto Sans CJK SC");
                });
        }
    );
    // Your code here...
})();