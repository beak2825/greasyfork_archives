// ==UserScript==
// @name         change google style
// @namespace    http://tampermonkey.net/
// @version      0.1.20210121
// @description  try to take over the world!
// @author       x06lan
// @match        https://www.google.com/
// @match        https://www.google.com.tw/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/420531/change%20google%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/420531/change%20google%20style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //change logo
    const logo=document.getElementById('hplogo');
    const windowlogo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Windows_logo_-_2012_%28dark_blue%29.svg/1200px-Windows_logo_-_2012_%28dark_blue%29.svg.png"
    

    logo.src=windowlogo
    logo.srcset=windowlogo


    console.log("google to window")

    //change backeground
    let body=document.getElementsByTagName("body")[0];
    body.style.background= "#f3f3f3 url('https://imgur.com/ZDGHXQS.png') no-repeat right top";
    body.style.backgroundSize="cover";
    let foot= document.getElementById("fbar");
    foot.style.opacity="0"

    let text=document.getElementById("SIvCob")
    text.style.color="#ffffff"


})();
// /images/branding/googlelogo/1x/googlelogo_color_272x92dp.png 1x,
// /images/branding/googlelogo/2x/googlelogo_color_272x92dp.png 2x