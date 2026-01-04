// ==UserScript==
// @name         o-bamba Theme doesn't work broken already

// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VeNoM Theme Created By Jayden Ramirez
// @author       Jayden Ramirez
// @match        httos://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @icon         https://pyxis.nymag.com/v1/imgs/421/6c4/f7d2737dc2a05cd7b3773d141bb6eb9b81-obama-grid.2x.rsocial.w600.jpg
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/441549/o-bamba%20Theme%20doesn%27t%20work%20broken%20already.user.js
// @updateURL https://update.greasyfork.org/scripts/441549/o-bamba%20Theme%20doesn%27t%20work%20broken%20already.meta.js
// ==/UserScript==
 
 
(function() {
    const addScript=()=>{
        document.title = 'o-bamba';
 
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://pyxis.nymag.com/v1/imgs/421/6c4/f7d2737dc2a05cd7b3773d141bb6eb9b81-obama-grid.2x.rsocial.w600.jpg';
        document.head.appendChild(style);
    }
    if(document.body){
        addScript();
    }else{
        document.addEventListener('DOMContentLoaded', function(e){
            addScript();
        })
    }
})();