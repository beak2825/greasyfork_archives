// ==UserScript==
// @name         Moments (Bot)
// @icon         https://icons.duckduckgo.com/ip2/app.moments.market.ico
// @version      0.1.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Moments, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://app.moments.market/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/423181/Moments%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423181/Moments%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_rewards: {
            type: 'checkbox',
            default: true
        }
    }
});

var autorewards=cfg.get('Auto_rewards');

(function() {
    'use strict';
    function random_numbers(min, max) {
        if (min == null || max == null) { console.log('Error: random_number(min,max); El valor min o max es null.'); } else {
            try {
                min = parseInt(min);
                max = parseInt(max);
            } catch (e) { console.log(e); }
            return Math.floor((Math.random() * max) + min);
        }
    }
    async function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }

    window.onload = function() {
        if(location.hostname.indexOf('app.moments.market')>=0){
            if(autorewards){
                async function autorewards() {
                    setInterval(function(){
                        if(window.location.pathname.indexOf("/rewards.php")>=0){
                            setInterval(function(){
                                try{document.querySelector("input[type=submit][value*=Claim]").click();}catch(e){console.log(e);}
                            },random_numbers(1000, 1500));
                        }
                    },random_numbers(3000, 1000));
                }
                autorewards();
            }
        }
    }
})();