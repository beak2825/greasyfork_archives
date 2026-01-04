// ==UserScript==
// @name         百度自动播放脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/382806/%E7%99%BE%E5%BA%A6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/382806/%E7%99%BE%E5%BA%A6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var q=0;
    var i = 0
    function cache(){
        var p = [];
        var po = [];
        for(var j=0;j<=9;j++){
            p[i] = new Image()
            p[i].src = "http://127.0.0.1/state_img/img.php?qq="+i
            console.log('xx',p[i].complete)
            po.push(i)
            i = i+1;
        }
        console.log('已经缓存成功',p)

        if(Object.keys(p).length==10){
            var interval =setInterval(function(){
                $("body").css("cssText","background-image:url(http://127.0.0.1/state_img/img.php?qq="+po[q]+") !important")
                //$("body").css("animation-name","fadein");

                q++
                if(q==9){
                    clearInterval(interval);
                    q = 0;
                    cache()
                }
            },6000);
        }
    }
    cache()

})();