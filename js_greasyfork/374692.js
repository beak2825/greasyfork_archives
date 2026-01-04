// ==UserScript==
// @name         解除Steam商店、社区的百度云链接屏蔽限制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  解除Steam商店、社区等的百度云链接屏蔽限制
// @author       Garen
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/id/*/recommended/*
// @match        https://steamcommunity.com/profiles/*/recommended/*
// @match        https://steamcommunity.com/app/*/reviews/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374692/%E8%A7%A3%E9%99%A4Steam%E5%95%86%E5%BA%97%E3%80%81%E7%A4%BE%E5%8C%BA%E7%9A%84%E7%99%BE%E5%BA%A6%E4%BA%91%E9%93%BE%E6%8E%A5%E5%B1%8F%E8%94%BD%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/374692/%E8%A7%A3%E9%99%A4Steam%E5%95%86%E5%BA%97%E3%80%81%E7%A4%BE%E5%8C%BA%E7%9A%84%E7%99%BE%E5%BA%A6%E4%BA%91%E9%93%BE%E6%8E%A5%E5%B1%8F%E8%94%BD%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

setInterval(function(){
    var arr = document.getElementsByClassName('collapsed_link');
    for(var i = 0,len = arr.length; i < len; i++){
        if(arr[i].style.display == "none"){
            arr[i].setAttribute('style', 'display:inline-block;color:#40E0D0;');
        }
    }
}, 1000);