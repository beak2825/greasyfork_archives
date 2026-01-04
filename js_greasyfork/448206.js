// ==UserScript==
// @name         Grapple LF Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Grapple LF theme By Skull
// @author       Skull
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
// @icon         https://media.discordapp.net/attachments/997427709250654280/999540394146668604/New-Project-4-modified-1.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448206/Grapple%20LF%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/448206/Grapple%20LF%20Theme.meta.js
// ==/UserScript==
(function() {
    const addScript=()=>{
        document.title = 'Sub to Grapple LF!';

        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://Grapple-LF.sikepeople.repl.co/style.css';
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