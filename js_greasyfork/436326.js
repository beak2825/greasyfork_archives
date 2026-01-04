// ==UserScript==
// @name         VeNoM Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VeNoM Theme Created By 𝐿𝒾𝓁.𝒮𝒾𝓀𝑒
// @author       𝐿𝒾𝓁.𝒮𝒾𝓀𝑒
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
// @icon         https://cdn.discordapp.com/attachments/897139751604342805/913649908442071090/2270-removebg-preview.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437693/VeNoM%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/437693/VeNoM%20Theme.meta.js
// ==/UserScript==
 
 
(function() {
    const addScript=()=>{
        document.title = 'VeNoM';
 
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://venom-theme.sikepeople.repl.co/style.css';
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