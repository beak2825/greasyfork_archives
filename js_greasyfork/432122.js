// ==UserScript==
// @name         JMC Auto-shortlinks (Bot)
// @icon         https://icons.duckduckgo.com/ip2/crypto-lovers.club.ico
// @version      0.1.12
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para shortlinks, redirige y completa el shotlink automaticamente.
// @author       wuniversales
// @include      http*://*.dutchycorp.space/*
// @include      http*://dutchycorp.space/*
// @include      http*://*.dutchycorp.ovh/*
// @include      http*://dutchycorp.ovh/*
// @include      http*://forex-trnd.com/*
// @include      http*://ex-foary.com/*
// @include      http*://blogginglass.com/*
// @include      http*://go.mozlink.net/*
// @include      http*://gos.insuranceblog.xyz/*
// @include      http*://m.imagenesderopaparaperros.com/*
// @include      http*://clik.pw/*
// @include      http*://noweconomy.live/*
// @include      http*://deportealdia.live/*
// @include      http*://adshort.live/*
// @include      http*://exey.io/*
// @include      http*://makemoneywithurl.com/*
// @include      http*://tei.ai/*
// @include      http*://toptechtalk.xyz/*
// @include      http*://forex-lab.xyz/*
// @include      http*://cashearn.cc/*
// @include      http*://coinsearns.com/*
// @include      http*://mcrypto.club/*
// @include      http*://cryptoads.space/*
// @include      http*://linkfly.io/*
// @include      http*://linksly.co/*
// @include      http*://fcc.lc/*
// @include      http*://fc-lc.com/*
// @include      http*://mitly.us/*
// @include      http*://birdurls.com/*
// @include      http*://luckydice.net/*
// @include      http*://tny.so/*
// @include      http*://*100count.net/*
// @include      http*://illink.net/*
// @include      http*://droplink.co/*
// @include      http*://owllink.net/*
// @include      http*://softairbay.com/*
// @include      http*://toptap.website/*
// @include      http*://*.toptap.website/*
// @include      http*://11bit.co.in/*
// @include      http*://*proinfinity.fun/*
// @include      http*://downphanmem.com/*
// @include      http*://aii.sh/*
// @include      http*://tmearn.com/*
// @include      http*://*.freebcc.org/*
// @include      http*://*.mcmfaucets.xyz/*
// @include      http*://mcmfaucets.xyz/*
// @include      http*://*.mcmcryptos.xyz/*
// @include      http*://mcmcryptos.xyz/*
// @include      http*://*uniqueten.net/*
// @include      http*://*ultraten.net/*
// @include      http*://allcryptoz.net/*
// @include      http*://coinpayz.link/*
// @include      http*://zcash.one/*
// @include      http*://techgeek.digital/*
// @include      http*://forex-golds.com/*
// @include      http*://markipli.com/*
// @include      http*://adshort.space/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @license      MIT 
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/432122/JMC%20Auto-shortlinks%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432122/JMC%20Auto-shortlinks%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_shortlinks: {
            type: 'checkbox',
            default: true
        },
    }
});

var as=cfg.get('Auto_shortlinks');
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

    function detecta_captcha_completado() {
        let status=false;
        let c1=document.body.querySelector("textarea#g-recaptcha-response");
        let c2=document.body.querySelector("textarea.g-recaptcha-response");
        let invisible=document.body.innerHTML.toLowerCase().indexOf(',"captcha_type":"invisible-recaptcha",');
        if (c1 != null || c2 != null){
            try{
                if (c1.value!='' || c2.value!=''){
                    status=true;
                }
            }catch(e){console.log(e);}
        }
        if (invisible>=0){
            status=true;
        }
        return status;
    }

    if(as==true){
        window.onload = function() {

            async function exe() {
                if(location.hostname.indexOf("exey.io")>=0){
                    if(window.location.pathname.indexOf("/blog/")>=0){
                        try{document.body.querySelector("button[id=invisibleCaptchaShortlink]").click();}catch(e){console.log(e);}
                        setInterval(function(){try{document.body.querySelector("div.procced > a.btn.get-link").click();}catch(e){console.log(e);}},random_numbers(1000, 1500));
                    }else{
                        try{document.body.querySelector("button[type=submit]").click();}catch(e){console.log(e);}
                    }

                }
            }
            exe();

            async function shrinkearn() {
                if(location.hostname.indexOf("makemoneywithurl.com")>=0){
                    try{document.body.querySelector("button[type=submit]").click();}catch(e){console.log(e);}
                }
                if(location.hostname.indexOf("tei.ai")>=0){
                    setInterval(function(){
                        try{document.body.querySelector("button#continue").click();}catch(e){console.log(e);}
                        try{document.body.querySelector("a.btn.btn-success.get-link").click();}catch(e){console.log(e);}
                    },random_numbers(1000, 1500));
                }
            }
            shrinkearn();

            async function hack_shortlinks() {
                if(location.hostname.indexOf("linkfly.io")>=0 || location.hostname.indexOf("linksly.co")>=0 || location.hostname.indexOf("fcc.lc")>=0 || location.hostname.indexOf("cashearn.cc")>=0 || location.hostname.indexOf("clik.pw")>=0 || location.hostname.indexOf("mcrypto.club")>=0 || location.hostname.indexOf("coinsearns.com")>=0 || location.hostname.indexOf("cryptoads.space")>=0 || location.hostname.indexOf("noweconomy.live")>=0 || location.hostname.indexOf("deportealdia.live")>=0 || location.hostname.indexOf("adshort.live")>=0 || location.hostname.indexOf("dutchycorp.ovh")>=0 || location.hostname.indexOf(".dutchycorp.space")>=0 || location.hostname.indexOf("dutchycorp.space")>=0 || location.hostname.indexOf("mitly.us")>=0 || location.hostname.indexOf("m.imagenesderopaparaperros.com")>=0 || location.hostname.indexOf("blogginglass.com")>=0 || location.hostname.indexOf("go.mozlink.net")>=0 || location.hostname.indexOf("forex-trnd.com")>=0 || location.hostname.indexOf("ex-foary.com")>=0 || location.hostname.indexOf("forex-lab.xyz")>=0 || location.hostname.indexOf("fc-lc.com")>=0 || location.hostname.indexOf("birdurls.com")>=0 || location.hostname.indexOf("luckydice.net")>=0 || location.hostname.indexOf("tny.so")>=0 || location.hostname.indexOf("100count.net")>=0 || location.hostname.indexOf("illink.net")>=0 || location.hostname.indexOf("droplink.co")>=0 || location.hostname.indexOf("owllink.net")>=0 || location.hostname.indexOf("softairbay.com")>=0 || location.hostname.indexOf("toptap.website")>=0 || location.hostname.indexOf("11bit.co.in")>=0 || location.hostname.indexOf("proinfinity.fun")>=0 || location.hostname.indexOf("downphanmem.com")>=0 || location.hostname.indexOf("aii.sh")>=0 || location.hostname.indexOf("tmearn.com")>=0 || location.hostname.indexOf("freebcc.org")>=0 || location.hostname.indexOf("mcmfaucets.xyz")>=0 || location.hostname.indexOf("mcmcryptos.xyz")>=0 || location.hostname.indexOf("uniqueten.net")>=0 || location.hostname.indexOf("ultraten.net")>=0 || location.hostname.indexOf("allcryptoz.net")>=0 || location.hostname.indexOf("coinpayz.link")>=0 || location.hostname.indexOf("zcash.one")>=0 || location.hostname.indexOf("techgeek.digital")>=0 || location.hostname.indexOf("forex-golds.com")>=0 || location.hostname.indexOf("markipli.com")>=0 || location.hostname.indexOf("adshort.space")>=0){

                    let next=document.body.querySelector("button.next-button");
                    let btsubmit=document.body.querySelector("button#submitbtn");
                    let click2=document.body.querySelector("div#cl1 > center > a");
                    let getlink=document.body.querySelector("button.get-link");
                    let wpsafelinkhuman=document.body.querySelector("a#wpsafelinkhuman");

                    if (next != null){
                        try{next.click();}catch(e){console.log(e);}
                    }
                    if (btsubmit != null){
                        try{btsubmit.click();}catch(e){console.log(e);}
                    }
                    if (click2 != null){
                        try{click2.click();}catch(e){console.log(e);}
                    }
                    if (getlink != null){
                        try{getlink.click();}catch(e){console.log(e);}
                    }
                    if (wpsafelinkhuman != null){
                        try{wpsafelinkhuman.click();}catch(e){console.log(e);}
                    }
                    let click=false;
                    setInterval(function(){
                        if(click==false){
                            if(detecta_captcha_completado()){
                                let captcha=document.body.querySelector("button[id=invisibleCaptchaShortlink]");
                                try{captcha.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{captcha.click();}catch(e){console.log(e);}
                                //click=true;
                            }

                            let opc1=document.body.querySelector("a.btn-success:not(.disabled)");
                            let opc2=document.body.querySelector("a.get-link:not(.disabled)");
                            let opc3=document.body.querySelector("div.skip-ad > a:not(.disabled)");
                            let opc4=document.body.querySelector("a#surl1:not(.disabled)");
                            let opc5=document.body.querySelector("form#exfoary-form > input[type=submit]:not(.disabled)");
                            let opc6=document.body.querySelector("button[id=goo]:not(.disabled)");
                            let opc7=document.body.querySelector("button.get_link:not(.disabled)");
                            let opc8=document.body.querySelector("div#cl1 > a:not(.disabled)");
                            let opc9=document.body.querySelector("button[id=link]:not(.disabled)");

                            if (opc1 != null){
                                try{opc1.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc1.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc2 != null){
                                try{opc2.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc2.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc3 != null){
                                try{opc3.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc3.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc4 != null){
                                try{opc4.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc4.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc5 != null){
                                try{opc5.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc5.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc6 !== null){
                                try{opc6.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc6.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc7 !== null){
                                try{opc7.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc7.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc8 != null){
                                try{opc8.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc8.click();}catch(e){console.log(e);}
                                click=true;
                            }
                            if (opc9 != null){
                                try{opc9.removeAttribute("onclick");}catch(e){console.log(e);}
                                try{opc9.click();}catch(e){console.log(e);}
                                click=true;
                            }
                        }

                    },random_numbers(1000, 1500));
                }
            }
            hack_shortlinks();
        }
    }
})();