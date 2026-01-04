// ==UserScript==
// @name         Squirp Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Theme for Squirp
// @author       Little Boy
// @match        https://shellshock.io/*
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
// @match        https://algebra.best/*
// @match        https://scrambled.today/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438035/Squirp%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/438035/Squirp%20Theme.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Squirp';
 
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://sample-1.sikepeople.repl.co/shell-themes/style.css';
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