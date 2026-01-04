// ==UserScript==
// @name         Fate theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fates shocks theme
// @author       yaz
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://zygote.cafe/*
// @icon         https://a.pinatafarm.com/454x567/660eb9bb49/homer-simpson-drooling.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453252/Fate%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/453252/Fate%20theme.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'fate.io';

        var style = document.createElement('link');
        style.rel = 'stylesheet';
      style.href='https://fatelove.sikepeople.repl.co/style.css';
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

