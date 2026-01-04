// ==UserScript==
// @name         BLOG24 ADA ROTATOR
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  try to take over the world!
// @author       MrBug
// @match        https://blog24.me/ada/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=name.tr
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/473842/BLOG24%20ADA%20ROTATOR.user.js
// @updateURL https://update.greasyfork.org/scripts/473842/BLOG24%20ADA%20ROTATOR.meta.js
// ==/UserScript==
//
// READ CAREFULLY:
// I don't give you any permission to copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of this script.
// JOIN MY TELEGRAM GROUP FOR MORE SCRIPTS: https://t.me/+osUKE3qQ5rFmMTg0
//
// REQUIREMENTS:
// Letter with red lines solver => https://greasyfork.org/en/scripts/461583-solver-letters-with-red-lines
// You will need a browser extension like hektcaptcha or nopecha to solve recaptcha challenges
//
// DESCRIPTION:
// IF YOU HAVE "BYPASS ALL SHORTLINKS" INSTALLED, YOU MUST EXCLUDE https://blog24.me/ada/*
// Edit line 40 with you faucetpay email address and line 42 with your preference mode
// Then go to https://blog24.me/ada/?r=744 and keep the window opened
//
// SCRIPT FEATURES:
// - If some faucet get out of funds, the script will jump to the next coin
// - If antibot fails 2 times, it will jump to the next coin
//
// If you want to support my work, visit this shortener: https://cuty.io/SupportMrBug
// THANK YOU FOR YOUR SUPPORT!

(function() {
    'use strict';

var email = "faucetpay@emailaddress.com" // Type here your faucetpay email address

var multicoinmode = 'yes' // If you change it to 'no' then go manually to the coin you want to claim in single mode

// DECLARAMOS 15 URLS
let url1 = GM_getValue('url1')
let url2 = GM_getValue('url2');let url3 = GM_getValue('url3');let url4 = GM_getValue('url4');let url5 = GM_getValue('url5');let url6 = GM_getValue('url6');let url7 = GM_getValue('url7');let url8 = GM_getValue('url8');let url9 = GM_getValue('url9');let url10 = GM_getValue('url10');let url11 = GM_getValue('url11');let url12 = GM_getValue('url12');let url13 = GM_getValue('url13');let url14 = GM_getValue('url14');let url15 = GM_getValue('url15')

// DECLARAMOS 15 COINS
let coin1 = GM_getValue('coin1')
let coin2 = GM_getValue('coin2');let coin3 = GM_getValue('coin3');let coin4 = GM_getValue('coin4');let coin5 = GM_getValue('coin5');let coin6 = GM_getValue('coin6');let coin7 = GM_getValue('coin7');let coin8 = GM_getValue('coin8');let coin9 = GM_getValue('coin9');let coin10 = GM_getValue('coin10');let coin11 = GM_getValue('coin11');let coin12 = GM_getValue('coin12');let coin13 = GM_getValue('coin13');let coin14 = GM_getValue('coin14');let coin15 = GM_getValue('coin15');


let lastclaim = GM_getValue('lastclaim') // ULTIMA COIN QUE SE HA HECHO CLAIM
let fail1 = GM_getValue('fail1') // SEÑAL PRIMER FALLO
let fail2 = GM_getValue('fail2') // SEÑAL SEGUNDO FALLO

let ahora = GM_getValue('ahora')
let bitcoinout = GM_getValue('bitcoinout') // SEÑAL BITCOIN SIN FONDOS O SIN CLAIMS
let bitcoinout_time = GM_getValue('bitcoinout_time') // GETTIME DE LA SEÑAL BITCOIN SIN FONDOS O SIN CLAIMS
let beforebitcoin = GM_getValue('beforebitcoin') // COIN PREVIA A BITCOIN
let afterbitcoin = GM_getValue('afterbitcoin') // COIN POSTERIOR A BITCOIN

    const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

let blue= setInterval(function() {
    if(document.querySelector('input.big-button')) {
        document.querySelector('input.big-button').click()
        clearInterval(blue)
    }
    },rndInt(3000, 7000));

function mathcaptchasingleop() {
let mathcaptchaselector = document.querySelector("p#captcha-question")
let op = document.querySelector("p#captcha-question").innerText
let form = document.querySelector("input[type='number']")
form.dispatchEvent(new Event("input"));
if (op.includes('+')) {
    let number1 = op.split('+')[0]
    let number2 = op.split('+')[1]
    if (!number1.includes("+") && !number1.includes("-") && !number1.includes("/") && !number1.includes("*")
       && !number2.includes("+") && !number2.includes("-") && !number2.includes("/") && !number2.includes("*")
       && mathcaptchaselector && form) {
        form.value = +number1 + +number2
        clearInterval(mathcaptchasingleop)
    }
}
if (op.includes('-')) {
    let number1 = op.split('-')[0]
    let number2 = op.split('-')[1]
    if (!number1.includes("+") && !number1.includes("-") && !number1.includes("/") && !number1.includes("*")
       && !number2.includes("+") && !number2.includes("-") && !number2.includes("/") && !number2.includes("*")
       && mathcaptchaselector && form) {
        form.value = +number1 - +number2
        clearInterval(mathcaptchasingleop)
    }
}
if (op.includes('/')) {
    let number1 = op.split('/')[0]
    let number2 = op.split('/')[1]
    if (!number1.includes("+") && !number1.includes("-") && !number1.includes("/") && !number1.includes("*")
       && !number2.includes("+") && !number2.includes("-") && !number2.includes("/") && !number2.includes("*")
       && mathcaptchaselector && form) {
        form.value = +number1 / +number2
        clearInterval(mathcaptchasingleop)
    }
}
if (op.includes('*')) {
    let number1 = op.split('*')[0]
    let number2 = op.split('*')[1]
    if (!number1.includes("+") && !number1.includes("-") && !number1.includes("/") && !number1.includes("*")
       && !number2.includes("+") && !number2.includes("-") && !number2.includes("/") && !number2.includes("*")
       && mathcaptchaselector && form) {
        form.value = +number1 * +number2
        clearInterval(mathcaptchasingleop)
    }
}
}

var time_after_comeback_to_bitcoinfacuet = 4 // Type here the interval time (in hours) you want to stop visiting the bitcoin faucet after no daily bitcoin claims left

var dailyclaims = "1000" // Don't change it unless the daily claims number would be different

if (window.location.href.includes("firewall")) {

setInterval(mathcaptchasingleop, 5000)

let firewall = setInterval(function() {
    let recaptchav3 = document.querySelector("input#recaptchav3Token")
    let hcaptcha = document.querySelector('.h-captcha > iframe')
    let turnstile = document.querySelector('.cf-turnstile > input')
    let boton = document.querySelector("button[type='submit']")
    if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0)
|| grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
        boton.click()
        clearInterval(firewall)
    }}, 5000)
}

setTimeout(function(){
    ahora = new Date().getTime()
    GM_setValue('ahora', ahora)
},1000)


setTimeout(function() {
if (document.querySelector("div.dropdown-menu")) {
    let cardcoin_number = document.querySelectorAll("a.dropdown-item") // DECLARAMOS ARRAY DE URLS
    if (cardcoin_number.length == 26 ||cardcoin_number.length == 13) { //CHEQUEAMOS QUE HAY 15

// GUARDAMOS LAS 15 URLS SEGUN HREF DEL DROPDOWN MENU
GM_setValue('url1', cardcoin_number[0].href);GM_setValue('url2', cardcoin_number[1].href)
GM_setValue('url3', cardcoin_number[2].href);GM_setValue('url4', cardcoin_number[3].href);GM_setValue('url5', cardcoin_number[4].href);GM_setValue('url6', cardcoin_number[5].href);GM_setValue('url7', cardcoin_number[6].href);GM_setValue('url8', cardcoin_number[7].href);GM_setValue('url9', cardcoin_number[8].href);GM_setValue('url10', cardcoin_number[9].href);GM_setValue('url11', cardcoin_number[10].href);GM_setValue('url12', cardcoin_number[11].href);GM_setValue('url13', cardcoin_number[12].href);GM_setValue('url14', 0);GM_setValue('url15', 0)

// GUARDAMOS LA ULTIMA PALABRA DE LAS URLS COMO EL NOMBRE DE LAS COINS
GM_setValue('coin1', cardcoin_number[0].href.split("/")[cardcoin_number[0].href.split("/").length-1])
GM_setValue('coin2', cardcoin_number[1].href.split("/")[cardcoin_number[1].href.split("/").length-1]);GM_setValue('coin3', cardcoin_number[2].href.split("/")[cardcoin_number[2].href.split("/").length-1]);GM_setValue('coin4', cardcoin_number[3].href.split("/")[cardcoin_number[3].href.split("/").length-1]);GM_setValue('coin5', cardcoin_number[4].href.split("/")[cardcoin_number[4].href.split("/").length-1]);GM_setValue('coin6', cardcoin_number[5].href.split("/")[cardcoin_number[5].href.split("/").length-1]);GM_setValue('coin7', cardcoin_number[6].href.split("/")[cardcoin_number[6].href.split("/").length-1]);GM_setValue('coin8', cardcoin_number[7].href.split("/")[cardcoin_number[7].href.split("/").length-1]);GM_setValue('coin9', cardcoin_number[8].href.split("/")[cardcoin_number[8].href.split("/").length-1]);GM_setValue('coin10', cardcoin_number[9].href.split("/")[cardcoin_number[9].href.split("/").length-1]);GM_setValue('coin11', cardcoin_number[10].href.split("/")[cardcoin_number[10].href.split("/").length-1]);GM_setValue('coin12', cardcoin_number[11].href.split("/")[cardcoin_number[11].href.split("/").length-1]);GM_setValue('coin13', cardcoin_number[12].href.split("/")[cardcoin_number[12].href.split("/").length-1]);GM_setValue('coin14', 0);GM_setValue('coin15', 0)
    }
    if (cardcoin_number.length == 28 || cardcoin_number.length == 14) { //CHEQUEAMOS QUE HAY 15
GM_setValue('url1', cardcoin_number[0].href);GM_setValue('url2', cardcoin_number[1].href)
GM_setValue('url3', cardcoin_number[2].href);GM_setValue('url4', cardcoin_number[3].href);GM_setValue('url5', cardcoin_number[4].href);GM_setValue('url6', cardcoin_number[5].href);GM_setValue('url7', cardcoin_number[6].href);GM_setValue('url8', cardcoin_number[7].href);GM_setValue('url9', cardcoin_number[8].href);GM_setValue('url10', cardcoin_number[9].href);GM_setValue('url11', cardcoin_number[10].href);GM_setValue('url12', cardcoin_number[11].href);GM_setValue('url13', cardcoin_number[12].href);GM_setValue('url14', cardcoin_number[13].href);GM_setValue('url15', 0)

// GUARDAMOS LA ULTIMA PALABRA DE LAS URLS COMO EL NOMBRE DE LAS COINS
GM_setValue('coin1', cardcoin_number[0].href.split("/")[cardcoin_number[0].href.split("/").length-1])
GM_setValue('coin2', cardcoin_number[1].href.split("/")[cardcoin_number[1].href.split("/").length-1]);GM_setValue('coin3', cardcoin_number[2].href.split("/")[cardcoin_number[2].href.split("/").length-1]);GM_setValue('coin4', cardcoin_number[3].href.split("/")[cardcoin_number[3].href.split("/").length-1]);GM_setValue('coin5', cardcoin_number[4].href.split("/")[cardcoin_number[4].href.split("/").length-1]);GM_setValue('coin6', cardcoin_number[5].href.split("/")[cardcoin_number[5].href.split("/").length-1]);GM_setValue('coin7', cardcoin_number[6].href.split("/")[cardcoin_number[6].href.split("/").length-1]);GM_setValue('coin8', cardcoin_number[7].href.split("/")[cardcoin_number[7].href.split("/").length-1]);GM_setValue('coin9', cardcoin_number[8].href.split("/")[cardcoin_number[8].href.split("/").length-1]);GM_setValue('coin10', cardcoin_number[9].href.split("/")[cardcoin_number[9].href.split("/").length-1]);GM_setValue('coin11', cardcoin_number[10].href.split("/")[cardcoin_number[10].href.split("/").length-1]);GM_setValue('coin12', cardcoin_number[11].href.split("/")[cardcoin_number[11].href.split("/").length-1]);GM_setValue('coin13', cardcoin_number[12].href.split("/")[cardcoin_number[12].href.split("/").length-1]);GM_setValue('coin14', cardcoin_number[13].href.split("/")[cardcoin_number[13].href.split("/").length-1]);GM_setValue('coin15', 0)
    }
    if (cardcoin_number.length == 30 || cardcoin_number.length == 15 ||cardcoin_number.length > 30) { //CHEQUEAMOS QUE HAY 15
GM_setValue('url1', cardcoin_number[0].href);GM_setValue('url2', cardcoin_number[1].href)
GM_setValue('url3', cardcoin_number[2].href);GM_setValue('url4', cardcoin_number[3].href);GM_setValue('url5', cardcoin_number[4].href);GM_setValue('url6', cardcoin_number[5].href);GM_setValue('url7', cardcoin_number[6].href);GM_setValue('url8', cardcoin_number[7].href);GM_setValue('url9', cardcoin_number[8].href);GM_setValue('url10', cardcoin_number[9].href);GM_setValue('url11', cardcoin_number[10].href);GM_setValue('url12', cardcoin_number[11].href);GM_setValue('url13', cardcoin_number[12].href);GM_setValue('url14', cardcoin_number[13].href);GM_setValue('url15', cardcoin_number[14].href)

// GUARDAMOS LA ULTIMA PALABRA DE LAS URLS COMO EL NOMBRE DE LAS COINS
GM_setValue('coin1', cardcoin_number[0].href.split("/")[cardcoin_number[0].href.split("/").length-1])
GM_setValue('coin2', cardcoin_number[1].href.split("/")[cardcoin_number[1].href.split("/").length-1]);GM_setValue('coin3', cardcoin_number[2].href.split("/")[cardcoin_number[2].href.split("/").length-1]);GM_setValue('coin4', cardcoin_number[3].href.split("/")[cardcoin_number[3].href.split("/").length-1]);GM_setValue('coin5', cardcoin_number[4].href.split("/")[cardcoin_number[4].href.split("/").length-1]);GM_setValue('coin6', cardcoin_number[5].href.split("/")[cardcoin_number[5].href.split("/").length-1]);GM_setValue('coin7', cardcoin_number[6].href.split("/")[cardcoin_number[6].href.split("/").length-1]);GM_setValue('coin8', cardcoin_number[7].href.split("/")[cardcoin_number[7].href.split("/").length-1]);GM_setValue('coin9', cardcoin_number[8].href.split("/")[cardcoin_number[8].href.split("/").length-1]);GM_setValue('coin10', cardcoin_number[9].href.split("/")[cardcoin_number[9].href.split("/").length-1]);GM_setValue('coin11', cardcoin_number[10].href.split("/")[cardcoin_number[10].href.split("/").length-1]);GM_setValue('coin12', cardcoin_number[11].href.split("/")[cardcoin_number[11].href.split("/").length-1]);GM_setValue('coin13', cardcoin_number[12].href.split("/")[cardcoin_number[12].href.split("/").length-1]);GM_setValue('coin14', cardcoin_number[13].href.split("/")[cardcoin_number[13].href.split("/").length-1]);GM_setValue('coin15', cardcoin_number[13].href.split("/")[cardcoin_number[14].href.split("/").length-1])
    }
}
}, 2000)


setTimeout(function() {
    if (window.location.href.includes("btc") && !lastclaim.includes('btc')) { // GUARDAMOS COIN PREVIA A BITCOIN
        GM_setValue('beforebitcoin', lastclaim)
    }
    if (lastclaim.includes('btc') && !window.location.href.includes("btc")) { // GUARDAMOS COIN POSTERIOR A BTICOIN
        GM_setValue('afterbitcoin', location.href.split("/")[location.href.split("/").length-1])
    }
}, 4000)


if (window.location.href.includes("https://blog24.me/ada/faucet/currency")) {
///////////// ACCIONES QUE SE EJECTUTAN SI ESTAMOS DENTRO DE ALGUNO DE LOS FAUCETS
if (multicoinmode == 'yes') {
setTimeout(function() {
    let wrong = document.querySelector("span.swal2-x-mark")
    if (bitcoinout == 'hola' && window.location.href.includes(beforebitcoin) && lastclaim == beforebitcoin && !wrong) {
        location.href = afterbitcoin
    }
}, 2000)
}
setTimeout(function() {
    if ((ahora - bitcoinout_time > time_after_comeback_to_bitcoinfacuet*60*60*1000) && bitcoinout == 'hola') {
        GM_setValue('bitcoinout_time', ahora)
        GM_setValue('bitcoinout', '')
    }
}, 2000)

setInterval(mathcaptchasingleop, 5000)

setTimeout(function() {
let claim = setInterval(function() {
    let hcaptcha = document.querySelector('.h-captcha > iframe')
    let letters = document.querySelector("input.form-control.mb-3")
    let balance = document.querySelector("img.currency-dashboard").nextElementSibling
    let turnstile = document.querySelector("input[name='cf-turnstile-response']")
    let recaptchav3 = document.querySelector('input#recaptchav3Token')
    let boton2 = document.querySelector("button[type='submit']") || document.querySelector("button#subbutt") || document.querySelector("button#claim-button")
    let coin = document.querySelector("img.currency-dashboard")
    if (letters && letters.value !== "" && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0)|| (recaptchav3 && recaptchav3.value.length > 0)) && boton2) {
        GM_setValue("lastclaim", coin.src.split("/")[coin.src.split("/").length-1].split(".")[0])
       $("#fauform").submit();
//        boton2.click()
//        boton2.click();
        clearInterval(claim)
        // ACCION DE CLAIM SI LETTERS Y HCAPTCHA RESUELTOS
    }
    if (letters && letters.value == "" && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0)|| (recaptchav3 && recaptchav3.value.length > 0)) && boton2) {
        window.location.reload()
        clearInterval(claim)
        // SI HCAPTCHA RESUELTO, PERO LETTERS NO, HACER REFRESH
    }
}, 2000)
}, 8000)
if (multicoinmode == 'no') {

let goclaim = setInterval(function() {
    let boton = document.querySelector("h4.next-button a.btn.btn-primary")
    if (boton) {
        window.location.reload()
clearInterval(goclaim)
    }
}, 5000) // PUESTO QUE SOLO HAY TIMER EN BITCOIN, ESTA FUNCION NO APLICA EN ESTA FAUCET
// PERO LA DEJAMOS POR SI ACASO, PORQUE ESE BOTON APARECE EN ESTE TIPO DE SCRIPT
}


function funds(url1, url2) {
    let cartel = document.querySelector("div.alert")
        if (window.location.href.includes(url1) && url2 !== 0) {
if (multicoinmode == 'yes') {
            if (fail2 == 'hola') {
                if (bitcoinout !== 'hola') {
                window.location.replace(url2)
                GM_setValue('fail1', "")
                GM_setValue('fail2', "")
                // SI SEÑAL DE SEGUNDO FALLO ANTIBOT, Y NO ESTAMOS EN LA COIN DE ANTES DE BTC SALTAMOS A SIGUIENTE COIN, Y RESETEAMOS SEÑALES
                }
                if (bitcoinout == 'hola') {
                    if (url1.includes(beforebitcoin)) {
                        window.location.replace(afterbitcoin)
                        GM_setValue('fail1', "")
                        GM_setValue('fail2', "")
                        // SI SEÑAL DE SEGUNDO FALLO ANTIBOT, Y ESTAMOS EN LA COIN DE ANTES DE BTC SALTAMOS A SIGUIENTE COIN, Y RESETEAMOS SEÑALES
                    }
                    if (!url1.includes(beforebitcoin)) {
                        window.location.replace(url2)
                        GM_setValue('fail1', "")
                        GM_setValue('fail2', "")
                        // SI SEÑAL DE SEGUNDO FALLO ANTIBOT, Y ESTAMOS EN LA COIN DE ANTES DE BTC SALTAMOS A SIGUIENTE COIN, Y RESETEAMOS SEÑALES
                    }
                }
            }
}
            if (cartel && (cartel.innerText.includes("funds") || cartel.innerText.includes("limit"))) {
                // SI CARTEL CON PALABRAS FUNDS O LIMIT
                if((window.location.href.includes("btc") && bitcoinout !== 'hola')) {
                    GM_setValue('lastclaim', 'btc')
                    GM_setValue('bitcoinout', 'hola')
                    GM_setValue('bitcoinout_time', ahora)
                    // ADEMAS SI ESTAMOS EN BTC, GUARDAR SEÑAL DE BITCOIN SIN CLAIMS O FONDOS,
                    // GUARDAR HORA DE LA SEÑAL DE BTC
                    // MARCAMOS BTC COMO LAST CLAIM
                window.location.replace(url2)
                // PASAMOS A SIGUIENTE COIN SI NO QUEDAN FONDOS, O SI NO QUEDAN CLAIMS
                }
                if((window.location.href.includes("btc") && bitcoinout == 'hola') || !window.location.href.includes("btc")) {
                window.location.replace(url2)
                // PASAMOS A SIGUIENTE COIN SI NO QUEDAN FONDOS, O SI NO QUEDAN CLAIMS
                }
            }
        }
}

    if (url14 == 0 && url15 == 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(funds, 7000, url1, url2);
setTimeout(funds, 7000, url2, url3);setTimeout(funds, 7000, url3, url4);setTimeout(funds, 7000, url4, url5);setTimeout(funds, 7000, url5, url6);setTimeout(funds, 7000, url6, url7);setTimeout(funds, 7000, url7, url8);setTimeout(funds, 7000, url8, url9);setTimeout(funds, 7000, url9, url10);setTimeout(funds, 7000, url10, url11);setTimeout(funds, 7000, url11, url12);setTimeout(funds, 7000, url12, url13);setTimeout(funds, 7000, url13, url1);setTimeout(funds, 7000, url14, url1);setTimeout(funds, 7000, url15, url1)
    }
    if (url14 !== 0 && url15 == 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(funds, 7000, url1, url2);
setTimeout(funds, 7000, url2, url3);setTimeout(funds, 7000, url3, url4);setTimeout(funds, 7000, url4, url5);setTimeout(funds, 7000, url5, url6);setTimeout(funds, 7000, url6, url7);setTimeout(funds, 7000, url7, url8);setTimeout(funds, 7000, url8, url9);setTimeout(funds, 7000, url9, url10);setTimeout(funds, 7000, url10, url11);setTimeout(funds, 7000, url11, url12);setTimeout(funds, 7000, url12, url13);setTimeout(funds, 7000, url13, url14);setTimeout(funds, 7000, url14, url1);setTimeout(funds, 7000, url15, url1)
    }
    if (url15 !== 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(funds, 7000, url1, url2);
setTimeout(funds, 7000, url2, url3);setTimeout(funds, 7000, url3, url4);setTimeout(funds, 7000, url4, url5);setTimeout(funds, 7000, url5, url6);setTimeout(funds, 7000, url6, url7);setTimeout(funds, 7000, url7, url8);setTimeout(funds, 7000, url8, url9);setTimeout(funds, 7000, url9, url10);setTimeout(funds, 7000, url10, url11);setTimeout(funds, 7000, url11, url12);setTimeout(funds, 7000, url12, url13);setTimeout(funds, 7000, url13, url14);setTimeout(funds, 7000, url14, url15);setTimeout(funds, 7000, url15, url1)
    }

setTimeout(function() {
    let cartel = document.querySelector("div.alert")
    if (cartel && cartel.innerText.includes("funds")) {
        if ((window.location.href.includes(url1) && url2 == 0) || (window.location.href.includes(url2) && url3 == 0)
        || (window.location.href.includes(url3) && url4 == 0) || (window.location.href.includes(url4) && url5 == 0)
           || (window.location.href.includes(url5) && url6 == 0) || (window.location.href.includes(url6) && url7 == 0)
           || (window.location.href.includes(url7) && url8 == 0) || (window.location.href.includes(url8) && url9 == 0)
           || (window.location.href.includes(url9) && url10 == 0) || (window.location.href.includes(url10) && url11 == 0)
           || (window.location.href.includes(url11) && url12 == 0) || (window.location.href.includes(url12) && url13 == 0)
           || (window.location.href.includes(url13) && url14 == 0) || (window.location.href.includes(url14) && url15 == 0)
           || (window.location.href.includes(url15) && url1 == 0)) {
window.location.replace('https://blog24.me/ada')
// SI HA DESAPARECIDO UNA COIN, VOLVER A MAIN
// ESTO TENDRA SENTIDO, SI OTRA FUNCIONA DECLARA LAS URL COMO CERO, EN CASO DE QUE EL ARRAY DE URLS (cardcoin_number) NO SEA IGUAL A 15
        }
    }
}, 5000)

function balance(url1, url2) {
    let balance = document.querySelector("img.currency-dashboard").nextElementSibling
    let claimsleft = document.querySelector("div.text-warning p.lh-1")
    if (balance.innerText !== "Ready" || claimsleft.innerText == "0/"+dailyclaims) {
        if (window.location.href.includes(url1) && url2 !== 0) {
            window.location.replace(url2)
            // SI EL INDICADOR "STATUS BALANCE" NO ES READY, O NO QUEDAN CLAIMS SALTAMOS A SIGUIENTE URL
        }
        if (window.location.href.includes(url1) && multicoinmode == 'no') {
            window.close()
            // SI EL INDICADOR "STATUS BALANCE" NO ES READY, O NO QUEDAN CLAIMS SALTAMOS A SIGUIENTE URL
        }
    }
}

    if (url14 == 0 && url15 == 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(balance, 5000, url1, url2)
setTimeout(balance, 5000, url2, url3);setTimeout(balance, 5000, url3, url4);setTimeout(balance, 5000, url4, url5);setTimeout(balance, 5000, url5, url6);setTimeout(balance, 5000, url6, url7);setTimeout(balance, 5000, url7, url8);setTimeout(balance, 5000, url8, url9);setTimeout(balance,5000, url9, url10);setTimeout(balance,5000, url10, url11);setTimeout(balance,5000, url11, url12);setTimeout(balance,5000, url12, url13);setTimeout(balance,5000, url13, url1);setTimeout(balance,5000, url14, url15);setTimeout(balance,5000, url15, url1)
    }
    if (url14 !== 0 && url15 == 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(balance, 5000, url1, url2)
setTimeout(balance, 5000, url2, url3);setTimeout(balance, 5000, url3, url4);setTimeout(balance, 5000, url4, url5);setTimeout(balance, 5000, url5, url6);setTimeout(balance, 5000, url6, url7);setTimeout(balance, 5000, url7, url8);setTimeout(balance, 5000, url8, url9);setTimeout(balance,5000, url9, url10);setTimeout(balance,5000, url10, url11);setTimeout(balance,5000, url11, url12);setTimeout(balance,5000, url12, url13);setTimeout(balance,5000, url13, url14);setTimeout(balance,5000, url14, url1);setTimeout(balance,5000, url15, url1)
    }
    if (url15 !== 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(balance, 5000, url1, url2)
setTimeout(balance, 5000, url2, url3);setTimeout(balance, 5000, url3, url4);setTimeout(balance, 5000, url4, url5);setTimeout(balance, 5000, url5, url6);setTimeout(balance, 5000, url6, url7);setTimeout(balance, 5000, url7, url8);setTimeout(balance, 5000, url8, url9);setTimeout(balance,5000, url9, url10);setTimeout(balance,5000, url10, url11);setTimeout(balance,5000, url11, url12);setTimeout(balance,5000, url12, url13);setTimeout(balance,5000, url13, url14);setTimeout(balance,5000, url14, url15);setTimeout(balance,5000, url15, url1)
    }



if (multicoinmode == 'yes') {
function ok(url1, url2) {
// CLICK OK Y PASAR AL SIGUIENTE SI NO HAY MARCA DE X DE FALLO
    let okbutton = document.querySelector("button[type='button'][class='swal2-confirm swal2-styled']");
    let wrong = document.querySelector("span.swal2-x-mark")
    let cartel = document.querySelector("div#swal2-content")
    if (okbutton && window.location.href.includes(url1) && url2 !== 0 && !wrong) {
    let coin = window.location.href.split("/")[window.location.href.split("/").length-1]
        GM_setValue('lastclaim', coin)
    if (bitcoinout !== 'hola' || (bitcoinout == undefined || beforebitcoin == undefined)) {
            GM_setValue('fail1', "")
            GM_setValue('fail2', "")
        okbutton.click()
        setTimeout(function() { window.location.href = url2 }, 1000)
        clearInterval(ok)
    }
    if (bitcoinout == 'hola') {
        if (!location.href.includes(beforebitcoin)) {
            GM_setValue('fail1', "")
            GM_setValue('fail2', "")
        okbutton.click()
        setTimeout(function() { window.location.href = url2 }, 1000)
            clearInterval(ok)
        }
    }
    }
    let waiting = document.querySelector("i.fa-spin")
    let boton = document.querySelector("a.btn.btn-primary")
        if (!okbutton && window.location.href.includes(url1) && url2 !== 0 && multicoinmode == "yes" && (waiting || (boton && boton.innerText == "Go Claim"))) {
            window.location.href = url2
            // SI EL INDICADOR "STATUS BALANCE" NO ES READY, O NO QUEDAN CLAIMS SALTAMOS A SIGUIENTE URL
        }
}

    if (url14 == 0 && url15 == 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(ok, 3000, url1, url2)
setTimeout(ok, 3000, url2, url3);setTimeout(ok, 3000, url3, url4);setTimeout(ok, 3000, url4, url5);setTimeout(ok, 3000, url5, url6);setTimeout(ok, 3000, url6, url7);setTimeout(ok, 3000, url7, url8);setTimeout(ok, 3000, url8, url9);setTimeout(ok,3000, url9, url10);setTimeout(ok,3000, url10, url11);setTimeout(ok,3000, url11, url12);setTimeout(ok,3000, url12, url13);setTimeout(ok,3000, url13, url1);setTimeout(ok,3000, url14, url1);setTimeout(ok,3000, url15, url1)
    }
    if (url14 !== 0 && url15 == 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(ok, 3000, url1, url2)
setTimeout(ok, 3000, url2, url3);setTimeout(ok, 3000, url3, url4);setTimeout(ok, 3000, url4, url5);setTimeout(ok, 3000, url5, url6);setTimeout(ok, 3000, url6, url7);setTimeout(ok, 3000, url7, url8);setTimeout(ok, 3000, url8, url9);setTimeout(ok,3000, url9, url10);setTimeout(ok,3000, url10, url11);setTimeout(ok,3000, url11, url12);setTimeout(ok,3000, url12, url13);setTimeout(ok,3000, url13, url14);setTimeout(ok,3000, url14, url1);setTimeout(ok,3000, url15, url1)
    }
    if (url15 !== 0) { //CHEQUEAMOS QUE HAY 15
setTimeout(ok, 3000, url1, url2)
setTimeout(ok, 3000, url2, url3);setTimeout(ok, 3000, url3, url4);setTimeout(ok, 3000, url4, url5);setTimeout(ok, 3000, url5, url6);setTimeout(ok, 3000, url6, url7);setTimeout(ok, 3000, url7, url8);setTimeout(ok, 3000, url8, url9);setTimeout(ok,3000, url9, url10);setTimeout(ok,3000, url10, url11);setTimeout(ok,3000, url11, url12);setTimeout(ok,3000, url12, url13);setTimeout(ok,3000, url13, url14);setTimeout(ok,3000, url14, url15);setTimeout(ok,3000, url15, url1)
    }

}

if (multicoinmode == 'no') {
function ok() {
// CLICK OK Y PASAR AL SIGUIENTE SI NO HAY MARCA DE X DE FALLO
    let okbutton = document.querySelector("button[type='button'][class='swal2-confirm swal2-styled']");
    let wrong = document.querySelector("span.swal2-x-mark")
    let cartel = document.querySelector("div#swal2-content")
    if (okbutton) {
            GM_setValue('fail1', "")
            GM_setValue('fail2', "")
        okbutton.click()
    }
}

setTimeout(ok, 5000)

}


setTimeout(function() {
// MARCAR PRIMERA Y SEGUNDA SEÑAL DE FALLO DE ANTIBOT, fail1 y fail2
    let okbutton = document.querySelector("button[type='button'][class='swal2-confirm swal2-styled']")
    let cartel = document.querySelector("div#swal2-content")
    if (okbutton && cartel && cartel.innerText.includes("Invalid") && (fail1 == "" || fail1 == undefined)) {
            GM_setValue('fail1', 'hola')
            okbutton.click()
    }
    if (okbutton && cartel && cartel.innerText.includes("Invalid") && fail1 == "hola") {
        fail2 = 'hola'
            GM_setValue('fail2', fail2)
            okbutton.click()
    }
}, 5000)


setTimeout(function() {
window.location.reload()
}, 3*60000)

////////////////////////////// FIN DE ACCIONES QUE SE EJECTUTAN SI ESTAMOS DENTRO DE ALGUNO DE LOS FAUCETS
}


setTimeout(function login() {
let mailform = document.querySelector("input#InputEmail")
let loginbutton1 = document.querySelector("button[data-target='#login']:not(.rounded-pill)")
let loginbutton2 = document.querySelector("button[type='submit']:not(.rounded-pill)")
    if (loginbutton1) {
        loginbutton1.click()
        setTimeout(function() {
            if (mailform && mailform.value !== email) {
                mailform.value = email
                setTimeout(function() {
                    if (mailform && mailform.value == email) {
                        loginbutton2.click()
                    }}, 2000)
            }}, 3000)
    }}, 8000)

setTimeout(function sponsor() {
    let mailform = document.querySelector("input#InputEmail")
    let logout = document.querySelector("button[data-target='#logoutModal']")
    if ((mailform || !logout) && location.search !== "?r=744"
        && (window.location.href == 'https://blog24.me/ada/' || window.location.href == 'https://blog24.me/ada/')) {
        location.search = "?r=744"
    }
}, 2000)

if (location.search == '?r=744') {
setInterval(mathcaptchasingleop, 5000)
}
setTimeout(function() {
// REDIRECT DESDE MAIN HASTA PRIMER FAUCET SI "lastclaim" NO ESTA DEFINIDO
    let logout = document.querySelector("button[data-target='#logoutModal']")
    if (logout && lastclaim == undefined && (window.location.href == "https://blog24.me/ada/" || window.location.href == "https://blog24.me/ada")) {
        window.location.replace(document.querySelector("a.dropdown-item").href)
    }
// REDIRECT DESDE MAIN HASTA ULTIMO FAUCET DONDE SE HIZO CLAIM
    if (logout && lastclaim !== undefined && (window.location.href == "https://blog24.me/ada/" || window.location.href == "https://blog24.me/ada")) {
        window.location.replace('https://blog24.me/ada/faucet/currency/'+lastclaim)
    }
}, 10000)

setTimeout(function scroll() {
// SCROLL HASTA EL OBJETO HCAPTCHA
    let hcaptcha = document.querySelector('.h-captcha > iframe')
    if (hcaptcha) {
//        hcaptcha.scrollIntoView()
    }
}, 10000)



setTimeout(function closevideoad() {
// ESTO VIENE DE OTRO USERSCRIPT, AQUI NO APLICA, Y ADEMAS ES UN INTENTO FALLIDO
    let close = document.querySelector("div.avp-floating-close-button-overlay.avp-fade-enter-done")
    let close2 = document.querySelector("div.avp-close-button-overlay.avp-fade-enter-done")
    let close3 = document.querySelector('i.bi.bi-x-circle-fill')
    let close4 = document.querySelector('i.fa-solid.fa-circle-xmark')
    if (close) {
        close.click()
    }
    if (close2) {
        close2.click()
    }
    if (close3) {
        close3.click()
    }
    if (close4) {
        close4.click()
    }
}, 10000)

setTimeout(function() {
    window.location.reload()
}, 10*60000)

})();