// ==UserScript==
// @name         Popcat Clicker
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Click the cat & run in the background
// @author       Anong0u0
// @include      https://popcat.click/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430843/Popcat%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/430843/Popcat%20Clicker.meta.js
// ==/UserScript==

//===========================
//Max 800 click per 30 second
const count = 800;
const second = 30;
//===========================

(function() {
    var times=0;
    setInterval(()=>
    {
        console.log(++times);
        if(times>=second)
        {
            times=0;
            console.log("send");
            fetch('https://stats.popcat.click/pop?pop_count='+count+'&captcha_token=pass');//with API
            let n=parseInt(`; ${document.cookie}`.split(`; pop_count=`).pop().split(';').shift())+count;
            document.cookie="pop_count="+n;
            document.querySelector(".counter").innerText=(n||0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }},1000);
})();