// ==UserScript==
// @name         Surviv.io Show Ping
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  show your ping (LAT)
// @author       vnbpm YT
// @license MIT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446970/Survivio%20Show%20Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/446970/Survivio%20Show%20Ping.meta.js
// ==/UserScript==

(function() {
    'use strict';
var el = document.createElement("p");
var el2 = document.getElementsByClassName("ui-team-member ui-bg-standard")[0];
el2.parentNode.appendChild(el);
el2.parentNode.insertBefore(el,el2);

var lag = document.createElement("p");
var lag2 = document.getElementsByClassName("ui-team-member ui-bg-standard")[0];
lag2.parentNode.appendChild(lag);
lag2.parentNode.insertBefore(lag,lag2);
        setInterval(function(){
        lag.style.fontSize = "20px";
        lag.style.textShadow = "rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 0.540302px 0.841471px 0px, rgb(255, 255, 255) -0.416147px 0.909297px 0px, rgb(255, 255, 255) -0.989992px 0.14112px 0px, rgb(255, 255, 255) -0.653644px -0.756802px 0px, rgb(255, 255, 255) 0.283662px -0.958924px 0px, rgb(255, 255, 255) 0.96017px -0.279415px 0px";
        lag.style.color = "#FFFFFF";
        lag.style.display= "block";
        lag.innerHTML = "Mod by VNBPM on YouTube";
})

const getPing = () => {

let ping = new Date;

    let request = new XMLHttpRequest();
    request.open(`GET`, window.location.href, true);

    request.onload = (() => {
        el.style.fontSize = "20px";
        el.style.textShadow = "rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 0.540302px 0.841471px 0px, rgb(255, 255, 255) -0.416147px 0.909297px 0px, rgb(255, 255, 255) -0.989992px 0.14112px 0px, rgb(255, 255, 255) -0.653644px -0.756802px 0px, rgb(255, 255, 255) 0.283662px -0.958924px 0px, rgb(255, 255, 255) 0.96017px -0.279415px 0px";
        el.style.color = "#FF0000";
        el.innerHTML = `Ping: ${new Date - ping} ms`;
        if(document.getElementById("game-area-wrapper").style.display == "block"){
        }
        setTimeout(getPing, 500);
    });
    request.send();
};
getPing();
})();