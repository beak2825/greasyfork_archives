// ==UserScript==
// @name         Frostay theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Frostay theme by Skullgeto
// @author       NOT YOU!!
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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452650/Frostay%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/452650/Frostay%20theme.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'frost.io';
        
        var style = document.createElement('link');
        style.rel = 'stylesheet';
      style.href='https://frostay.sikepeople.repl.co/style.css';
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