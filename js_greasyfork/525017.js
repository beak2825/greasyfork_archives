// ==UserScript==
// @name         EWT认真度检测规避系统
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  修复了升学e网通会跳出认真度检测弹窗的bug（
// @author       Yu_LiZi
// @match        https://teacher.ewt360.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ewt360.com
// @grant        none
// @license      GNU General Public License
// @downloadURL https://update.greasyfork.org/scripts/525017/EWT%E8%AE%A4%E7%9C%9F%E5%BA%A6%E6%A3%80%E6%B5%8B%E8%A7%84%E9%81%BF%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/525017/EWT%E8%AE%A4%E7%9C%9F%E5%BA%A6%E6%A3%80%E6%B5%8B%E8%A7%84%E9%81%BF%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function test()
    {
        if(document.querySelector(".btn-3LStS"))
        {
            document.querySelector(".btn-3LStS").click();
        }
        else
        {
            setTimeout(function() {
                test();
            }, 1000);
        }
    }
    test();
    test();
    test();
    setInterval(function(){
    var x = document.getElementById("vjs_video_3_html5_api");
    x.muted = true;
    if (x.currentTime == x.duration)
    {
        window.close();
    }
    x.play();
},5000);
})();