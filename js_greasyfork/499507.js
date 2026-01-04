// ==UserScript==
// @name         莞教通-自动换课-远程培训
// @namespace    代刷vx:shuake345
// @version      0.1.2
// @description  自动播放|自动切换|自动答题|代刷vx:shuake345
// @author       You
// @match        *://*.dgjy.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499507/%E8%8E%9E%E6%95%99%E9%80%9A-%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE-%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/499507/%E8%8E%9E%E6%95%99%E9%80%9A-%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE-%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function bf(){
        if(document.querySelector("#panelWindow_confirm").style[0]!=="display"){
            document.querySelector("#panelWindow_confirm > div > p.t-center.pb-10.pt-20 > a.abtn-blue.submit").click()
        }
        if(document.querySelector("video")!==null){
           document.querySelector("video").play()
    }
    }
    setInterval(bf,5454)
})();