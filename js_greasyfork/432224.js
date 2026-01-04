// ==UserScript==
// @name        ddrk 按C键开关字幕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  低端影视按C键开关字幕
// @author       churchilldu
// @match        https://ddrk.me/*
// @icon         https://www.google.com/s2/favicons?domain=ddrk.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432224/ddrk%20%E6%8C%89C%E9%94%AE%E5%BC%80%E5%85%B3%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/432224/ddrk%20%E6%8C%89C%E9%94%AE%E5%BC%80%E5%85%B3%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==


// reference https://greasyfork.org/zh-CN/scripts/377094-%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E5%85%A8%E5%B1%8F-%E6%8C%89f%E9%94%AE

(function() {
    'use strict';

    document.onkeydown=function(e){
        var keyNum=window.event ? e.keyCode :e.which;

        if(keyNum==67){

            try{
                if(document.querySelector(".vjs-menu-item.vjs-subtitles-menu-item.vjs-selected").attributes[4]){
                    document.getElementsByClassName("vjs-menu-item-text")[7].click()
                }
            }
            catch(error){
                document.getElementsByClassName("vjs-menu-item-text")[8].click()
            }
        }
    }


})();