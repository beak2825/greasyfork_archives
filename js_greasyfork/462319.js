// ==UserScript==
// @name         Faucet bitonsoccer - website down
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Lets make things easy
// @author       vikiweb
// @match        https://faucet.bitonsoccer.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitonsoccer.co
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462319/Faucet%20bitonsoccer%20-%20website%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/462319/Faucet%20bitonsoccer%20-%20website%20down.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btc = '16Lfq4QC9Lgbse4oggWUVAe1e6Rv7o6ELn';
    let ltc = 'MPKodg6ph2Yb8jgqsJdgs6Nx52FFa6h2jT';
    let doge = 'D7e1C6xBNsuVUcy6JGEdRaqtHsXM1wnrVP';

    let sites = [
        'https://faucet.bitonsoccer.co/?r=16Lfq4QC9Lgbse4oggWUVAe1e6Rv7o6ELn',
        'https://faucet.bitonsoccer.co/ltc/?r=MPKodg6ph2Yb8jgqsJdgs6Nx52FFa6h2jT',
        'https://faucet.bitonsoccer.co/doge/?r=D7e1C6xBNsuVUcy6JGEdRaqtHsXM1wnrVP'];

    let currentFaucetUrl = window.location.href.split('?')[0];
    let currentIndex = sites.findIndex(site => site.split('?')[0] === currentFaucetUrl);

    function movetonext() {
        if (currentIndex === sites.length - 1) {
            currentIndex = 0;
            console.log("All sites visited. Starting from 0 again.");
        } else {
            currentIndex++;
        }
        window.location.href = sites[currentIndex];
    }

    if (currentFaucetUrl.indexOf("index.php") !== -1) {
        var newUrl = currentFaucetUrl.replace("index.php", "");

        var index = newUrl.indexOf("?");
        if (index !== -1) {
            newUrl = newUrl.substring(0, index);
        }
        window.location.href = newUrl;
    }

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    setInterval(function(){

        if(window.location.href == 'https://faucet.bitonsoccer.co/'){
            if(document.querySelector("input[name='address']")){
                document.querySelector("input[name='address']").value = btc
            }
        }
        else if(window.location.href.includes("/ltc/")){
            if(document.querySelector("input[name='address']")){
                document.querySelector("input[name='address']").value = ltc
            }
        }else if (window.location.href.includes("/doge/")){
            if(document.querySelector("input[name='address']")){
                document.querySelector("input[name='address']").value = doge
            }
        }

        if(document.querySelector("button[name='loginpage'][type='submit']")){
            document.querySelector("button[name='loginpage'][type='submit']").click()
        }

        if(document.querySelector("button[name='gologin'][type='submit']")){
            document.querySelector("button[name='gologin'][type='submit']").click()
        }

        if(document.querySelector("#demo")){
            movetonext()
        }

        if(window.location.href.includes("/ltc/") || window.location.href.includes("/doge/")){

            if(document.querySelector("button[name='claim'][type='submit']")){
                if(isCaptchaChecked()){
                    document.querySelector("button[name='claim'][type='submit']").click()
                }
            }

        }else{

            if(document.querySelector("button[name='claim'][type='submit']")){
                if(isCaptchaChecked()){
                    document.querySelector("button[name='claim'][type='submit']").click()
                }
            }

        }
    }, 20000)


})();