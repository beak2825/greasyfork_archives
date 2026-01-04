// ==UserScript==
// @name         vgtime视频跳转问题修复
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  vgtime视频点开跳转问题的修复
// @author       You
// @match        http://www.vgtime.com/*
// @match        https://www.vgtime.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441263/vgtime%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/441263/vgtime%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vgClass= document.querySelectorAll('.reser_href')
    for(var i=0;i<vgClass.length;i++){
        //console.log(vgClass[i])
        vgClass[i].remove()
    }
})();