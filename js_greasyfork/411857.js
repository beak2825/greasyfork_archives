// ==UserScript==
// @name         华文慕课_视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动播放华文mooc的视频
// @author       kakasearch
// @match        http://www.chinesemooc.org/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411857/%E5%8D%8E%E6%96%87%E6%85%95%E8%AF%BE_%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/411857/%E5%8D%8E%E6%96%87%E6%85%95%E8%AF%BE_%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
    document.getElementsByTagName('video')[0].onended= ()=>{
document.querySelector(" ul > li> img").parentElement.nextElementSibling.click()
    }},5000)
    // Your code here...
})();