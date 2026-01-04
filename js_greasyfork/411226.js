// ==UserScript==
// @name         Surviv Health Mod
// @namespace    https://github.com/Michal2SAB
// @version      1.0
// @description  Shows you the health number, that's all...
// @author       Michal2SAB
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
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411226/Surviv%20Health%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/411226/Surviv%20Health%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastHP = 0
    var health = $("<span></span>")
    health.css({
        display: "block",
        position: "fixed",
        "z-index": "2",
        margin: "6px 0 0 0",
        right: "12px",
        color: "blue",
        "font-weight": "bold",
        "font-size": "large",
    })
    $("#ui-health-container").append(health)

    setInterval(function(){
        var hp = Math.round(document.getElementById("ui-health-actual").style.width.slice(0,-1))
        if(lastHP !== hp){
            lastHP = hp
            health.html(Math.ceil(hp))
        }
    })
})();