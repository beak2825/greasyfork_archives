// ==UserScript==
// @name         CoinSpiller (Bot)
// @namespace    https://greasyfork.org/users/592063
// @icon         https://icons.duckduckgo.com/ip2/coinspiller.club.ico
// @version      0.1
// @description  Script automatizado para CoinSpiller, aumenta tus ganancias.
// @author       wuniversales
// @match        http*://coinspiller.club/faucet/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/435144/CoinSpiller%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435144/CoinSpiller%20%28Bot%29.meta.js
// ==/UserScript==

let cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_faucets: {
            type: 'checkbox',
            default: true
        },
        Delete_ads: {
            type: 'checkbox',
            default: true
        },
    }
});

let autofaucets=cfg.get('Auto_faucets');
let deleteads=cfg.get('Delete_ads');

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

    function detecta_hcaptcha_completado() {
        let status=false;
        if(document.body.querySelectorAll("iframe[src*='hcaptcha.com']").length>0){
            if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
                status=true;
            }
        }
        return status;
    }

    if(autofaucets){
        async function loadbot() {
            if (window.location.href.includes("coinspiller.club/faucet/")) {
                //Step 1
                if(document.body.querySelectorAll('div.shortlink > a').length>0){
                    if(!document.body.querySelector('div.shortlink > a').innerText.includes("THANK")){
                        let onclickval=document.body.querySelector('div.shortlink > a').getAttribute('onClick').trim();
                        let posin=onclickval.indexOf("$(location).attr('href','");
                        posin=posin+25;
                        onclickval=onclickval.substr(posin).replace("');return false;", '');
                        window.location.href=window.location.href+onclickval;
                    }
                }
                //Step 2
                setInterval(function(){
                    if(detecta_hcaptcha_completado()){
                        document.body.querySelector('button.btn-success').click();
                    }
                },random_numbers(5000, 5500));

                //Step 3 (Captcha 2)
                let img=document.body.querySelectorAll('div#vnumbers > div#wall_captcha > img');
                for (let i = 0; i < img.length; i++) {
                    if(document.body.querySelectorAll('div#vnumbers > div#wall_captcha > img[src="'+img[i].src+'"]').length>=2){
                        img[i].click();
                        break;
                    }
                }
            }
        }
        loadbot();
    }
    if(deleteads){
        async function no_ads() {
            let ads=document.body.querySelectorAll('div.banner');
            for (let i = 0; i < ads.length; i++) {
                ads[i].remove();
            }
        }
        no_ads();
    }
})();