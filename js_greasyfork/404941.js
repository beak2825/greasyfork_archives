// ==UserScript==
// @name         BOSS直聘过滤脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BOSS直聘过滤已谈过的boss
// @author       张玉良
// @home-url        https://github.com/caoxie/BlogFilter/boss.js
// @home-url2       https://github.com/caoxie/BlogFilter/boss.js
// @homepageURL     https://github.com/caoxie/BlogFilter/boss.js
// @copyright       2015-2020, AC
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @match        https://www.zhipin.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/404941/BOSS%E7%9B%B4%E8%81%98%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/404941/BOSS%E7%9B%B4%E8%81%98%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var showNew = function() {
        var liList = $(".job-list ul li");
        if(liList){
            for(var i = 0; i < liList.length; i++){
                var li = $(liList[i]);
                var sp = li.find("button span");
                if(sp){
                    var text = $(sp[0]).text();
                    if(text == "继续沟通"){
                        li.hide();
                        try{
                            var jobmain = li.parent().parent().parent();
                            if(jobmain){
                                console.log(jobmain.text().replace("\\s+"," "));
                            }
                        } catch(e){
                            console.log(e);
                        }
                    }
                }

            }
        }
    };
    showNew();
    // Your code here...
})();