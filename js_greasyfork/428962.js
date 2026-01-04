// ==UserScript==
// @name         boss直聘批量投递工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  boss直聘批量投递
// @author       solenya
// @copyright       2015-2020, AC
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @match        https://www.zhipin.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428962/boss%E7%9B%B4%E8%81%98%E6%89%B9%E9%87%8F%E6%8A%95%E9%80%92%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/428962/boss%E7%9B%B4%E8%81%98%E6%89%B9%E9%87%8F%E6%8A%95%E9%80%92%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

     console.log("批量投递测试!");
    var list = document.querySelectorAll("button");
    for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute("redirect-url") != null) {
            var ele = list[i];
            var span = ele.getElementsByTagName("span");
            var text = $(span[0]).text();
            if (text == "继续沟通") {
            	 console.log(text + ele.getAttribute("redirect-url"));
                continue;
            } else {

            	  list[i].click();
            	  alert("已经投递");
                  console.log(text + ele.getAttribute("redirect-url"));
            }
        }
    }

    // Your code here...
})();