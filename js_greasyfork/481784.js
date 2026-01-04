// ==UserScript==
// @name         U Campus
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prettify U Campus
// @author       KermanX
// @match        https://ucontent.unipus.cn/_pc_default/pc.html?*
// @icon         https://ucontent.unipus.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481784/U%20Campus.user.js
// @updateURL https://update.greasyfork.org/scripts/481784/U%20Campus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        setInterval(()=>{
            document.querySelector("#ucampus-top > div").style.display = "none";
        },1000);

        const href = document.querySelector("#header > div > div > div > div > a").href;
        const el = document.createElement("a");
        el.innerHTML = "back";
        el.href = href;
        el.style.cssText="position:fixed;z-index:10000000;left:0;top:0;";
        document.body.appendChild(el);

        document.querySelector("#sidemenuContainer").style.visibility = "hidden";
        document.querySelector("#headerContainer").style.visibility = "hidden";
        document.querySelector("#rootContainer").style.right = "25px";
        document.querySelector("#rootContainer").style.top = "40px";
        document.querySelector("#rootContainer").style.paddingTop = "0px";
        const a = document.querySelector("div.audio--audio-player-2_c6b");
        if(a){
            a.style.position = "fixed";
            a.style.left = "0";
            a.style.top = "0";
            a.style.maxWidth = "unset";
            a.style.width = "100vw";
            a.style.zIndex = "1000000";
        }

        document.querySelector("div.audio-material--btn-group-24oPS").style.display = "none";

    },1000)
})();