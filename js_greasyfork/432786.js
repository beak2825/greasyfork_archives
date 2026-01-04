// ==UserScript==
// @name         自动下一节课程
// @namespace    http://github.com/binjoo
// @version      0.3
// @description  自动下一节课程，刷视频用
// @author       雷恩
// @match        *://bocedu.ls365.com/*
// @require     https://cdn.staticfile.org/jquery/3.5.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432786/%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/432786/%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        console.log($("#learnNextSection").attr("href"))
        if($("#learnNextSection").attr("href")){
            console.log("...click...")
            $("#learnNextSection")[0].click()
        }else{
            console.log("...wait...")
        }
    }, 30000)
    setTimeout(function(){
        document.querySelector('video').playbackRate=2.0;
    }, 10000)
    // Your code here...
})();