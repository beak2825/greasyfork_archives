// ==UserScript==
// @name         newScript
// @namespace    http://name.fun/
// @version      0.3
// @description  nihaoa
// @description:zh-cn hai
// @author       jclhr
// @match        https://www.msnzy1.xyz/cn/home/web/*
// @match        https://osc.msnzy1.xyz/*
// @match        https://byy.msnzy1.xyz/*
// @match        https://hsex.men/*
// @match        *://hsex.men/*
// @icon         https://greasyfork.org/vite/assets/blacklogo96.e0c2c761.png
// @grant        none
// @license    GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/453958/newScript.user.js
// @updateURL https://update.greasyfork.org/scripts/453958/newScript.meta.js
// ==/UserScript==

(() => {
    "use strict";
    //msn
    document.getElementById("dgf_pc").remove();
    //men
    document.getElementById("container").remove();
    var topAds=document.getElementsByClassName("col-xs-12 col-md-6")[0];
    topAds.remove()
    //document.getElementById("player-container").remove();

    //document.getElementsByTagName

})();
