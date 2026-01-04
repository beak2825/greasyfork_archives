// ==UserScript==
// @name         湖南工商职业学院-线上学习自动挂机
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击播放下一章节
// @author       Clay
// @match        *://hngsxy.ls365.net/*
// @icon         <$ICON$>
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499018/%E6%B9%96%E5%8D%97%E5%B7%A5%E5%95%86%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2-%E7%BA%BF%E4%B8%8A%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/499018/%E6%B9%96%E5%8D%97%E5%B7%A5%E5%95%86%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2-%E7%BA%BF%E4%B8%8A%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        if($("#learnNextSection").is(":visible")) {
            document.getElementById("learnNextSection").click()
            console.log("自动播放下一章节")
        }
    }, 5000);

})();