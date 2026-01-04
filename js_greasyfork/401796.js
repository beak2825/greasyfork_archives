// ==UserScript==
// @name         bilibili直播去水印
// @namespace    http://tampermonkey.net/
// @version      0.15
// @author       xiaoso
// @match        https://live.bilibili.com/*
// @grant        none
// @description 去掉bilibili直播界面右上角logo
// @downloadURL https://update.greasyfork.org/scripts/401796/bilibili%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/401796/bilibili%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function() {
    let isRemoved = false;
    let maxCheck = 10;

    function removeLogo(){

        let logo = document.getElementsByClassName("web-player-icon-roomStatus")[0];
        console.log(logo);
        if (typeof(logo)==='object')
        {
            logo.remove();
            isRemoved = true;
        }else if(maxCheck>=0){
            maxCheck--;
            setTimeout(removeLogo,1000);

        }

    };
    setTimeout(removeLogo,1000);


})();