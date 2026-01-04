// ==UserScript==
// @name         斗鱼弹幕上限
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  实测斗鱼弹幕上限61字符，PCWeb默认为41字符
// @author       logicycle
// @match        *://www.douyu.com/*
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/397187/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E4%B8%8A%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/397187/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E4%B8%8A%E9%99%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timesRun = 0;
    let interval = self.setInterval(function(){
        let array = document.getElementsByClassName("ChatSend-txt");
        if (array.length == 1){
            array[0].setAttribute("maxlength", "61");
        }
        timesRun++;
        if (timesRun == 30){
            if (array.length == 0)
                console.log("加载超时或页面转移了");
            else
                console.log("修改成功");
            self.clearInterval(interval);
        }
    }, 2000);
})();