// ==UserScript==
// @name         abc
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  asdfasdf
// @author       luna
// @match        https://bithub.win/*
// @match        https://ouo.io/*
// @match        https://ouo.press/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bithub.win
// @require      https://greasyfork.org/scripts/461948-fbase-lib/code/FBase%20Lib.js?version=1222667
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/471874/abc.user.js
// @updateURL https://update.greasyfork.org/scripts/471874/abc.meta.js
// ==/UserScript==
//
// You can reach me on telegram for more scripts ==> https://t.me/+YDDLGvZmgxE3Mzhk
//
// READ CAREFULLY:
// I don't give you any permission to copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of this script.
//
// REQUIREMENTS:
// You will need a gpcaptcha solver:
// LINK => https://greasyfork.org/scripts/461805-gp-captcha-sover/code/GP%20Captcha%20Sover.user.js
//
//
// DESCRIPTION:
// Go to the link below to create an account:
// LINK => https://bithub.win/?r=353615
// Edit lines 42 and 43 with your email and password
//
// If you want to check for updates visit link in line 11
//
// If you want to support my work, visit this shortener: https://cuty.io/SupportMrBug
// THANK YOU FOR YOUR SUPPORT!

(function() {
    'use strict';

var email = "kenoclarog18@gmail.com" // Type here your email address
var password = "kevenkauan12" // Type here your password

let achievements = GM_getValue('achievements')
let viewedptc = GM_getValue('viewedptc')
let ahora = GM_getValue('ahora')

GM_setValue('ahora', new Date().getTime())
if(location.hostname == 'bithub.win') {
if (window.location.href.includes("bithub.win/ptc") && !window.location.href.includes("view")) {
setTimeout(function goptc() {
    let ahora1 = new Date()
    let boton = document.querySelector('button.btn.btn-one')
    let noptc = document.querySelector('div.alert-warning')
    if (window.location.href.includes("bithub.win/ptc") && boton) {
        boton.click()
    }
    if (window.location.href.includes("bithub.win/ptc") && !boton && ((ahora - achievements > 86400000) || achievements == null)){
        GM_setValue('viewedptc', ahora1.getTime())
        setTimeout(function() {window.location.href = "https://bithub.win/achievements"}, 2000)
    }
    else {
        GM_setValue('viewedptc', ahora1.getTime())
        setTimeout(function() {window.location.href = "https://bithub.win/faucet"}, 2000)
}}, 10000)
}

if (window.location.href.includes("bithub.win/achievements")) {
setTimeout(function claimahieve() {
    let ahora = new Date()
    let boton = document.querySelector("button[type='submit']")
    if (window.location.href.includes("bithub.win/achievements") && boton) {
        boton.click()
    }
    if (window.location.href.includes("bithub.win/achievements") && boton && boton.disabled == true) {
        GM_setValue('achievements', ahora.getTime())
        window.location.href = "https://bithub.win/auto"
    }}, 10000)
}

setTimeout(function exitauto() {
    let noenergy = document.querySelector("div.alert-danger")
    if (window.location.href.includes("bithub.win/auto") && noenergy && noenergy.innerText.includes("Enough")) {
        window.location.href = "https://bithub.win/faucet"
    }
}, 8000)

if (window.location.href.includes("bithub.win/ptc/view")) {
    let claim = setInterval(function() {
        let gpcaptcha = document.querySelector('input#captcha_choosen')
        let boton = document.querySelector("button#verify")
        let time = document.querySelector("span#ptcCountdown")
        if (gpcaptcha && gpcaptcha.value.length > 0 && boton && time && time.innerText == '0 second') {
            boton.click()
            clearInterval(claim)
        }}, 5000)
}

if (window.location.href.includes("firewall")) {
let firewall = setInterval(function() {
    let gpcaptcha = document.querySelector('input#captcha_choosen')
    let boton = document.querySelector("button[type='submit']")
    let hcaptcha = document.querySelector('.h-captcha > iframe')
    if ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0)
        || (gpcaptcha && gpcaptcha.value.length > 0)
        || window.grecaptcha.getResponse().length > 0) {
        boton.click()
        clearInterval(firewall);
    }}, 10000)
}

if (window.location.href.includes("bithub.win/login")) {
    let login = setInterval(function() {
        let mailform = document.querySelector('input#email')
        let passform = document.querySelector('input#password')
        let boton = document.querySelector("button[type='submit']")
    if (window.location.href.includes("login") && mailform && passform
       && mailform.value!== email && passform.value !== password) {
        mailform.value = email
        passform.value = password
    }
    if (window.location.href.includes("login") && boton && grecaptcha.getResponse().length > 0
       && mailform.value == email && passform.value == password) {
        boton.click()
        clearInterval(login)
    }}, 5000)
}

if (window.location.href.includes("dashboard")) {
setTimeout(function redir() {
        window.location.href = "https://bithub.win/faucet"
    }, 12000)

setTimeout(function redir2() {
    if ((ahora - viewedptc > 28800000) || viewedptc == null) {
        window.location.href = "https://bithub.win/ptc"
        }}, 3000)
}

if (window.location.href.includes("bithub.win/faucet")) {
    let claim = setInterval(function() {
        let gpcaptcha = document.querySelector('input#captcha_choosen')
        let boton = document.querySelector("button.claim-button")
        if (gpcaptcha && gpcaptcha.value.length > 0 && boton) {
            boton.click()
            clearInterval(claim)
        }}, 5000)

    setTimeout(function() {
        if ((ahora - viewedptc > 28800000) || viewedptc == null) {
            window.location.href = "https://bithub.win/ptc"
        }}, 3000)

    setTimeout(function() {
        if (((ahora - achievements > 86400000) || achievements == null)){
        setTimeout(function() {window.location.href = "https://bithub.win/achievements"}, 2000)
    }}, 3000)

    setTimeout(function() {
        window.location.reload()
    }, 3*60000 + 20000)
    }

if (window.location.href == "https://bithub.win/" || window.location.href == "https://bithub.win") {
window.location.href = "https://bithub.win/?r=353615"
}

setTimeout(function() {
    if (window.location.href == "https://bithub.win/?r=353615") {
        window.location.href = "https://ouo.io/NOiT22"
    }}, 12000)

setInterval(function() {
    let ok = document.querySelector("button[type='button'][class='swal2-confirm swal2-styled']")
    let oktext = document.querySelector("h2#swal2-title")
    let error = document.querySelector("span.swal2-x-mark")
    if ((ok && !error) || (ok && error && !window.location.href.includes("withdraw"))) {
        ok.click();
    }
    if (ok && error && window.location.href.includes("withdraw")) {
        window.location.replace("https://bithub.win/leaderboard");
    }}, 3000) //CLICK OK
}
if (location.hostname == 'ouo.io' || location.hostname == 'ouo.press') {
      setTimeout(() => {
        (new OuoSolver()).start();
    }, rndInt(1000, 3000));
}
    // Your code here...
})();