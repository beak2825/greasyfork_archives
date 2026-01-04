// ==UserScript==
// @name         Doodle Theme (Shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A New Theme Developed And Designed By Coderable. 
// @author       Coderable
// @match        https://shellshock.io/
// @match        https://algebra.best/
// @match        https://eggcombat.com/*
// @match        https://shellshock.io/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://mathdrills.info
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
// @icon         https://shellshock.io/favicon192.png
// @grant        none
// @lisense MIT
// @downloadURL https://update.greasyfork.org/scripts/450321/Doodle%20Theme%20%28Shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450321/Doodle%20Theme%20%28Shellshockio%29.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Shell Shockers | By Coderable';
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://redirect.coderable.studio/Shell.css';
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
