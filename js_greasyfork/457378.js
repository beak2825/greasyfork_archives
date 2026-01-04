// ==UserScript==
// @name         Free BTC & BNB Every 20 Seconds [Recapcha bot needed]
// @namespace    Claim Free Coin
// @version      1.01
// @description  Claim Free Coin
// @author       HarwellHooligan
// @match        https://flashfaucet.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flashfaucet.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457378/Free%20BTC%20%20BNB%20Every%2020%20Seconds%20%5BRecapcha%20bot%20needed%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/457378/Free%20BTC%20%20BNB%20Every%2020%20Seconds%20%5BRecapcha%20bot%20needed%5D.meta.js
// ==/UserScript==


//INSTALL THE SCRIPT
//INSTALL RECAPTCHA SOLVER LINK => https://pastebin.com/n6sYgWzH
//THEN GOTO https://flashfaucet.xyz/?r=6586 AND INPUT YOUR FAUCETPAY EMAIL ADDRESS AND LEAVE THE TAB OPEN


(function() {
    'use strict';

    //CLICK ON CLAIM BUTTON
    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector("#subbutt").click();
    }
    }, 5000 + Math.floor(Math.random()*2000 + 1000));

    //CLICK ON FIREWALL
    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector("button[type='submit']").click();
    }
    }, 5000 + Math.floor(Math.random()*3000 + 1000));

    //CLICK ON GOTO CLAIM
    setInterval(function() {
    if (document.querySelector("a.btn.btn-primary")) {
    document.querySelector("a.btn.btn-primary").click();
    }
    }, 5000 + Math.floor(Math.random()*2000 + 1000));

    //CLICK ON OK
    setInterval(function() {
    if (document.querySelector("button[class='swal2-confirm swal2-styled']")) {
    document.querySelector("button[class='swal2-confirm swal2-styled']").click();
    }
    }, 1000 + Math.floor(Math.random()*1000 + 1000));

    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/bnb") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/doge");
  }

 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/doge")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));

    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/doge") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/fey")
    }
 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/fey")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));

    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/fey") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/ltc")
    }
 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/ltc")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));

    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/ltc") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/trx")
    }
 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/trx")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));


    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/trx") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/usdt")
    }
 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/usdt")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));


    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/usdt") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/btc")
    }
 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/btc")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));


    setTimeout(function() {
    if ((document.URL =="https://flashfaucet.xyz/faucet/currency/btc") && document.querySelector(".alert.alert-danger.text-center").innerText == "Daily claim limit for this coin reached, please comeback again tomorrow.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/sol")
    }
 else {

 for (const a of document.querySelectorAll("span")) {
    if (a.textContent.includes("Empty")) {
     console.log(a.textContent);
     window.location.replace("https://flashfaucet.xyz/faucet/currency/sol")
  }
 }
}
}, 5000 + Math.floor(Math.random()*5000 + 1000));


    //IF FAUCET HAD TO FUND IT WILL MOVE TO BNB FAUCET
    setTimeout(function() {
    if(document.querySelector("#swal2-content").innerText == "The faucet does not have sufficient funds for this transaction.") {
    window.location.replace("https://flashfaucet.xyz/faucet/currency/bnb")
    }}, 1000);

    //RELOAD AFTER 1 MIN
    setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 60000 + Math.floor(Math.random()*5000 + 1000));




})();
