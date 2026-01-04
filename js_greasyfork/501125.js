// ==UserScript==
// @name         bilibili直播模糊区域去除
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  去除bilibili直播模糊区域
// @author       Exroia
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501125/bilibili%E7%9B%B4%E6%92%AD%E6%A8%A1%E7%B3%8A%E5%8C%BA%E5%9F%9F%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/501125/bilibili%E7%9B%B4%E6%92%AD%E6%A8%A1%E7%B3%8A%E5%8C%BA%E5%9F%9F%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
var console_log=console.log;
function remove_mask() {
    if(document.getElementById('web-player-module-area-mask-panel')!=null){
        document.getElementById('web-player-module-area-mask-panel').remove();
        console_log('Mask_removed');
    }
}
(function() {
    console.log=(a)=>{
        console_log(a);
        if(a=="[SistersPlayer] Misaka has been created. >w<"){
            remove_mask()
        }
    }
})();
