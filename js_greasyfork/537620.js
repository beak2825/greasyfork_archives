// ==UserScript==
// @name         [Premium] adBTC by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      1.2.1
// @description  Make all Ads and Shortlinks.
// @author       Andrewblood
// @match        *://*.adbtc.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adbtc.top
// @grant        window.focus
// @grant        window.close
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/537620/%5BPremium%5D%20adBTC%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/537620/%5BPremium%5D%20adBTC%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const titles = [
        'Just a moment',
        '稍等片刻',
        'Een ogenblik',
        'Un instant',
        'Nur einen Moment',
        'Un momento',
        'Um momento',
        'Bir an'
    ];

    if (titles.some(title => document.title.includes(title))) {
        console.log('Cloudflare-Challenge-Seite erkannt. [Premium] adBTC by Andrewblood Skript wird gestoppt.');
        return;
    }

    console.log('Keine Cloudflare-Challenge-Seite erkannt. [Premium] adBTC by Andrewblood Skript läuft.');

    if (window.location.href === "https://adbtc.top/") window.location.replace("https://adbtc.top/r/l/3828777");

    clickByText("LOG IN");

    if (window.location.href.includes("index")){
        clickByText("START EARNING");
        clickByText("SURF ADS");
    }

    if (window.location.href.includes("surf")){

        const interval = setInterval(function() {
            const captchaElement = document.querySelector(".cf-turnstile")
            const captchaResponse = document.querySelector('[name="cf-turnstile-response"]');
            const button = document.querySelector(".btn");
            if (captchaElement && captchaElement.offsetHeight > 0) {
                captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                    if (captchaResponse && captchaResponse.value.length > 0) {
                        clearInterval(interval);
                        console.log("Captcha ausgefüllt gefunden. Klicke: " + button);
                        button.click();
                    } else {
                        console.log("Captcha gefunden, warte auf Lösung...");
                    }
                }
            }
            if (document.title.includes("You earned")){
                clearInterval(interval);
                window.focus();
            }
            if (document.title.includes("You closed")){
                clearInterval(interval);
                window.focus();
                if (unsafeWindow.myWindow) {
                    unsafeWindow.myWindow.close();
                }
                if (unsafeWindow.coinwin) {
                    var tmp = unsafeWindow.coinwin;
                    unsafeWindow.coinwin = {};
                    tmp.close();
                }
                clickByText("SKIP");
            }
        }, 1000);
        clickByText("SENDEN");
        clickByText("0PEN");
        clickByText("OPЕN");


        if (document.querySelector("body > div.row.bodypad > div.col.s12.m9 > div:nth-child(3) > p.flow-text") && document.querySelector("body > div.row.bodypad > div.col.s12.m9 > div:nth-child(3) > p.flow-text").innerText == 'You have watched all the available ads for now. Please, come back later, new sites are adding several times a day. Users with higher rating have more ads available.') {
            if (window.location.href.includes("/surf/browse/")) {
                clickByText("Surf ads USDT");
            }
            if (window.location.href.includes("/surfusd/browse/")) {
                clickByText("Surf ads ₽");
            }
            if (window.location.href.includes("/surfiat/browse/")) {
                clickByText("Shortlinks");
                // clickByText("Video ads");
            }
        }
    }

    if (window.location.href.includes("/video/inf")){
        if (document.querySelector("#pre > p.flow-text") && document.querySelector("#pre > p.flow-text").innerText == 'You have watched all the available ads for now. Please, come back later, new sites are adding several times a day. Users with higher rating have more ads available.'){
            clickByText("Shortlinks");
        }
        if (document.querySelector(".card-title")){
            document.querySelector(".card-title").click();
        }
    }
    if (window.location.href.includes("/video/w")){
        setInterval(() => {
            if (document.querySelector("#timer") && document.querySelector("#timer").innerText.includes("You earned")){
                window.close();
            }
        }, 1000);
    }

    if (window.location.href == "https://adbtc.top/shortlink/"){
        clickByText("VISIT");
        if (document.querySelectorAll("span.grey-text.right") && document.querySelectorAll("span.grey-text.right")[0].innerText.includes("Wait")){

            let round = GM_getValue('roundNumber', 0);
            round++;
            console.log("Aktueller Durchlauf: " + round);

            if (round <= 5) {
                GM_setValue('roundNumber', round);
                clickByText("Surf ads\ncomputer");
            } else {
                clickByText("Autosurfing");
                setTimeout(() => {
                    GM_deleteValue('roundNumber');
                    window.close();
                }, 3000);
            }

        }
    }
    if (window.location.href.includes("/shortlink/check")){
        clickByText("Shortlinks");
    }

    if (window.location.href.includes("autosurf/session")){
        setTimeout(() => {
            if (document.querySelector("body > h3") && document.querySelector("body > h3").innerText.includes("We are waiting")){
                window.close();
            }
        }, 3000);
    }

    function clickByText(text) {
        const interval = setInterval(function() {
            const clickableElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
            for (let button of clickableElements) {
                if (button && button.innerText && button.innerText.includes(text) && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                    console.log("Klicke: " + button.innerText + button);
                    clearInterval(interval);
                    button.click();
                    return;
                }
            }
        }, 1000);
    }

    window.onbeforeunload = function() {
        if (unsafeWindow.myWindow) {
            unsafeWindow.myWindow.close();
        }
        if (unsafeWindow.coinwin) {
            var tmp = unsafeWindow.coinwin;
            unsafeWindow.coinwin = {};
            tmp.close();
        }
    };

})();