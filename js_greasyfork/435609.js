// ==UserScript==
// @name         Brick Hill New Theme
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  brick hill new theme
// @author       pixtle
// @match        https://*.brick-hill.com/*
// @icon         https://cdn.discordapp.com/attachments/742085385579921451/910617140393029752/brick_hill_new_logo_omg_so_real.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435609/Brick%20Hill%20New%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/435609/Brick%20Hill%20New%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var h = document.getElementsByTagName('body');
    var head = document.getElementsByTagName('HEAD')[0];
    var style = document.createElement('style');
    /*minified custom new css*/ style.innerHTML = ".part-btn{margin:0px!important}*{border-radius:0!important;}.status-dot{border-radius:100%!important;}.notif, .nav-notif{border-radius:5px!important;}.card{box-shadow: 0 0px 0px rgba(0,0,0,0)!important;border:lightgray 1px solid;};.card .top:not(.absolute).blue{border:1px solid #007acc;background:#007acc;background:linear-gradient(#419cd8 0,#027bcc 100%);color:#fff!important;font-weight:700;font-size:20px} .card .top:not(.absolute).red{border:1px solid #dd1a21;background:#dd1a21;background:linear-gradient(#fe5746 0,#dd1a21 100%);color:#fff!important;font-weight:700;font-size:20px}.alert.error{border:1px solid #dd1a21;background:#dd1a21;background:linear-gradient(#fe5746 0,#dd1a21 100%)}.card .top:not(.absolute).green{border:1px solid #11a304;background:#11a304;background:linear-gradient(#17c60a 0,#11a304 100%);color:#fff!important;font-weight:700;font-size:20px}.card .top:not(.absolute){border:1px solid #b6b6b6;background:#b6b6b6;background:linear-gradient(#d0d0d0 0,#b6b6b6 100%);color:#fff!important;font-weight:700;font-size:20px}.card .top:not(.absolute).orange{border:1px solid #d87c00;background:#d87c00;background:linear-gradient(#f39a00 0,#d87c00 100%);color:#fff!important;font-weight:700;font-size:20px}.input-group .input-button{border-left:1px solid #fff;color:#fff;background:#00a9fe;background:linear-gradient(0deg,#007cdc 0,#00a9fe 100%);text-align:center;display:inline-block;text-transform:uppercase;border:0;border-top-color:currentcolor;border-right-color:currentcolor;border-bottom-color:currentcolor;border-left-color:currentcolor;padding:10px 20px;font-weight:600}.input-group{border:1px solid #fff}.loader{border-radius:100%!important;}nav .info{background: rgb(33,33,33);background: linear-gradient(0deg, rgba(33,33,33,1) 0%, rgba(93,93,93,1) 100%);}nav div.primary{background: #00a9fe;background: linear-gradient(0deg,#007CDC 0%,#00A9FE 100%);}nav div.secondary{background: rgb(33,33,33);background: linear-gradient(0deg, rgba(33,33,33,1) 0%, rgba(93,93,93,1) 100%);}";
    head.appendChild(style);

    // new theme class to render everything with the updated styles
    for (var i = 0; i < h.length; i++) {
        if (h[i].classList.length === 0) {
            h[i].classList.add("new-theme");
        }
    }
})();