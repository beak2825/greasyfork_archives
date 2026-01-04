// ==UserScript==
// @name         Betfury (Bot)
// @namespace    https://greasyfork.org/users/592063
// @version      0.4.3
// @description  Script automatizado para Betfury, aumenta tus ganancias.
// @author       wuniversales
// @match        https://betfury.io/*
// @icon         https://icons.duckduckgo.com/ip2/betfury.io.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435050/Betfury%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435050/Betfury%20%28Bot%29.meta.js
// ==/UserScript==

let autofaucet=true;
let autocatchfury=true;
let autofurywheel=true;
let autocashback=true;
let autostaking=true;
let disablefunfury=true;
let alertbetfurycoin=true;
let calcmin=true;

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
        try{
            if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
                status=true;
            }
        }catch(e){}
        return status;
    }
    window.addEventListener("load", function(){
        let pass=1,temp=0;
        setInterval(function(){
            if(autofurywheel){
                if(document.querySelectorAll("button.fury-wheel__btn:not([disabled])").length>0){
                    try{document.querySelector("button.fury-wheel__btn:not([disabled])").click();}catch(e){}
                    try{document.querySelector("button.fury-wheel__btn:not([disabled])").disabled=true;}catch(e){}
                }
            }
            if(autocashback){
                if(location.pathname.search('/cashback')==0 && location.search.search('tab=my-cashback')==1){
                    if(document.querySelectorAll("div.balances__footer > button:not([disabled])").length>0){
                        try{document.querySelector("div.balances__footer > button:not([disabled])").click();}catch(e){}
                        try{document.querySelector("div.balances__footer > button:not([disabled])").disabled=true;}catch(e){}
                    }
                    if(document.body.querySelectorAll('div.withdraw-confirmation__footer > button:not([disabled])').length>0){
                        try{document.querySelector("div.withdraw-confirmation__footer > button:not([disabled])").click();}catch(e){}
                        try{document.querySelector("div.withdraw-confirmation__footer > button:not([disabled])").disabled=true;}catch(e){}
                    }
                    if(document.querySelectorAll("button.modal__btn-close").length>=1){
                        try{document.querySelector("button.modal__btn-close").click();}catch(e){}
                    }
                }
            }
            if(autostaking){
                if(location.pathname.search('/staking')==0){
                    if(document.body.querySelectorAll('div.dividends__my-stake > button:not([disabled])').length>0){
                        try{document.querySelector("div.dividends__my-stake > button:not([disabled])").click();}catch(e){}
                        try{document.querySelector("div.dividends__my-stake > button:not([disabled])").disabled=true;}catch(e){}
                    }
                    if(document.body.querySelectorAll('div.withdraw-confirmation__footer > button:not([disabled])').length>0){
                        try{document.querySelector("div.withdraw-confirmation__footer > button:not([disabled])").click();}catch(e){}
                        try{document.querySelector("div.withdraw-confirmation__footer > button:not([disabled])").disabled=true;}catch(e){}
                    }
                    if(document.querySelectorAll("button.modal__btn-close").length>=1){
                        try{document.querySelector("button.modal__btn-close").click();}catch(e){}
                    }
                }
            }
            if(calcmin){
                if(location.pathname.search('/inhouse/')==0){
                    if(document.body.querySelectorAll('input.inp-number').length>0 && document.body.querySelectorAll('span.balance').length>0 && document.body.querySelectorAll('div.amount > div.amount__center > div > img').length>0){
                        let moneyvalue=parseFloat(document.body.querySelector('input.inp-number').value);
                        let usdmoneyvalue=parseFloat(document.body.querySelector('span.balance').innerText.replace(',','.'));
                        let minrecomended=((moneyvalue*0.01001)/usdmoneyvalue).toFixed(8);
                        if (isFinite(minrecomended)){
                            document.body.querySelector('div.amount > div.amount__center > div > img').title='El minimo recomendado es: '+minrecomended;
                            document.body.querySelector("div.amount > div.amount__center > div > img").onclick = function() {navigator.clipboard.writeText(minrecomended);};
                        }
                    }
                }
            }
            if(alertbetfurycoin){
                if(location.pathname.search('/all-games')==0 || location.pathname.search('/inhouse/')==0 || location.pathname.search('/slots/')==0){
                    if(document.body.querySelectorAll('div.dropdown__trigger > div > div.balance > span.currency > img').length>0){
                        if(document.body.querySelector('div.dropdown__trigger > div > div.balance > span.currency > img').src.search('bfg')>=0){
                            document.body.style.backgroundColor = 'red';
                        }
                        else{
                            document.body.style.backgroundColor = '';
                        }
                    }
                }else{
                    document.body.style.backgroundColor = '';
                }
            }
            if(autofaucet){
                if(location.pathname.search('/boxes/all')==0){
                    if(disablefunfury){
                        if(document.querySelectorAll("div.free-box__funfury > div > div > div > div.free-box__button > button:not([disabled])").length>=1){
                            try{document.querySelector("div.free-box__funfury > div > div > div > div.free-box__button > button:not([disabled])").disabled=true;}catch(e){}
                        }
                    }
                    console.log('Pass: '+pass);
                    if(pass==1){
                        if(document.querySelectorAll("div.all-boxes__free-boxes > div > div > div > div > div > button.button_red.button_fullwidth:not([disabled])").length>=1){
                            try{document.querySelector("button.button_red.button_fullwidth:not([disabled])").click();}catch(e){}
                            pass=2;
                        }else{
                            if(document.querySelectorAll("div.all-boxes__my-box > div > div > div > div > button.button_red.button_fullwidth:not([disabled])").length>=1){
                                try{document.querySelector("div.all-boxes__my-box > div > div > div > div > button.button_red.button_fullwidth:not([disabled])").click();}catch(e){}
                                pass=5;
                            }
                        }
                    }
                    if(pass==2){
                        if(detecta_hcaptcha_completado()){
                            if(document.querySelectorAll("button.button_red.button_fullwidth:not([disabled])").length>=1){
                                try{document.querySelectorAll("button.button_red.button_fullwidth:not([disabled])")[4].click();}catch(e){}
                                pass=3;
                                temp=0;
                            }
                        }else{
                            if(temp<100){
                                temp++;
                            }else{
                                location.reload();
                            }
                        }
                    }
                    if(pass==4){
                        if(document.querySelectorAll("button.modal__btn-close").length>=1){
                            try{document.querySelector("button.modal__btn-close").click();}catch(e){}
                        }
                        pass=1;
                    }
                    if(pass==3){
                        if(document.querySelectorAll("button.modal__btn-close").length>=1){
                            try{document.querySelector("button.modal__btn-close").click();}catch(e){}
                            pass=4;
                        }
                    }
                    if(pass==5){
                        if(document.querySelectorAll("div.confirm-withdraw__action > button").length>=1){
                            try{document.querySelector("div.confirm-withdraw__action > button").click();}catch(e){}
                            pass=1;
                        }
                    }
                }
            }
        },random_numbers(2000, 2500));
        if(autocatchfury){
            setInterval(function(){
                if(document.querySelectorAll("img[src*='catch_fury']").length>0){
                    document.querySelector("img[src*='catch_fury']").click();
                }
            },random_numbers(1000, 1500));
        }
    });
})();