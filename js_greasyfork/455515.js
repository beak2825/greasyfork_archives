// ==UserScript==
// @name         Shell Shockers Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @icon          data:image/jpeg;base64,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
// @description  Tide-League-Theme
// @author       pixxy
// @match        https://shellshock.io/
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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455515/Shell%20Shockers%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/455515/Shell%20Shockers%20Theme.meta.js
// ==/UserScript==

(function() {
    const theme=()=>{
        document.title = 'shell shockers pixxy';
        let style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://Tide-League-Theme.jayvan229.repl.co/style.css';
        document.head.appendChild(style);
        setTimeout(function(){
            document.getElementById("logo").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/872246201196621884/unknown.png'>";
            document.getElementById("shellshockers_titlescreen_wrap").innerHTML = "<img src='https://cdn.discordapp.com/attachments/811268272418062359/872255106819686430/unknown.png'><img src='https://cdn.discordapp.com/attachments/811268272418062359/872255106819686430/unknown.png'><img src='https://cdn.discordapp.com/attachments/811268272418062359/872255106819686430/unknown.png'>";
        }, 2000);
    }
    if(document.body){
        theme();
    }else{
        document.addEventListener('DOMContentLoaded', function(load){
            theme();
        })
    }
})();