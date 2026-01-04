// ==UserScript==
// @name         Auto BTC Rotator with PTC Support
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  auto faucets
// @author       vikiweb
// @match        https://btcadspace.com/*
// @match        https://easysatoshi.com/*
// @match        https://firefaucet.win/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btcadspace.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462018/Auto%20BTC%20Rotator%20with%20PTC%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/462018/Auto%20BTC%20Rotator%20with%20PTC%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sites = [
        {faucetUrl: "https://btcadspace.com/faucet", username: "", password: "", enableFaucet:true, faucetCaptcha:false},
        {faucetUrl: "https://easysatoshi.com/faucet", username: "", password: "", enableFaucet:true, faucetCaptcha:false},
        {faucetUrl: "https://firefaucet.win/faucet/", username: "", password: "",},
    ];

    let sitesMap = [
        {
            websiteUrl:"https://btcadspace.com",
            homePageCheck : "body section.slider",
            claimPopupOpen : ".btn-primary.btn-lg",
            loginCaptchaCheck : true,
            surfSelectors:".card:not(.visited-link)",
            surfStartBtn:".card-body #box .start-btn",
        },
        {
            websiteUrl:"https://easysatoshi.com",
            homePageCheck : "body h1.display-5.fw-bold",
            claimPopupOpen : ".btn-primary.btn-lg",
            loginCaptchaCheck : true,
            surfSelectors:".container .row .col-lg-4 a:not(.opacity-50)",
            surfStartBtn:".container .row .start-btn",
        },
        {
            websiteUrl:"https://firefaucet.win",
            homePageCheck : "form[action='/login']",
            claimPopupOpen : "",
            loginCaptchaCheck : true,
            surfSelectors:".card.ptc-advert-card .watch-btn",
            surfStartBtn:".card-body #box .start-btn",
            additionalFunction : fireFaucet,
        },
    ]


    let check_address = window.location.origin;
    let currentFaucetUrl = new URL(window.location.href);
    let currentOrigin = currentFaucetUrl.origin;
    let currentIndex = sites.findIndex(site => site.faucetUrl.includes(currentOrigin));
    let websiteIndex = sitesMap.findIndex(website => website.websiteUrl.includes(currentOrigin));
    let oldfunction = unsafeWindow.open;
    let windowName = "";
    let interval = 1;

    function movetonext() {
        if (currentIndex === sites.length - 1) {
            currentIndex = 0;
            console.log("All sites visited. Starting from 0 again.");
        } else {
            currentIndex++;
        }
        window.location.href = sites[currentIndex].faucetUrl;
    }

    function checkWindow(params1, params2) {
        console.log(params1 + params2);
        if (!params2 || params2 == "_blank") {
            windowName = "popUpWindow";
        } else {
            windowName = params2;
        }
        console.log("WindowName is::" + windowName);
        return oldfunction(params1, windowName);
    };

    function movetosurf() {
        window.location.href = check_address +'/surf'
    }

    // Check if captcha is checked
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    // Check if on faucet page and claim button is disabled
    function isFaucetClaimButtonDisabled(claimPopup) {
        return document.querySelector(claimPopup) && document.querySelector(claimPopup).disabled;
    }

    // Check if on faucet page is fully claimed
    function isFaucetFullyClaimed() {
        return document.querySelector(".notyf-announcer") && document.querySelector(".notyf-announcer").innerText.includes('You reached the maximum')
    }

    function visibleCheck(elm) {
        if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
        if(getComputedStyle(elm).visibility === 'hidden') { return false; }
        return true;
    }

    function websiteLogin(site){
        setInterval(function() {
            if (document.querySelector("#username")) {
                document.querySelector("#username").value = site.username;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = site.password;
            }
            if (sitesMap[websiteIndex].loginCaptchaCheck){
                if (isCaptchaChecked()) {
                    if (document.querySelector("button[type='submit']")) {
                        document.querySelector("button[type='submit']").click();
                    }
                }
            }else{
                if (document.querySelector("button[type='submit']")) {
                    document.querySelector("button[type='submit']").click();
                }
            }

        }, 6000);
    }

    function fireFaucet(site) {
        if (document.querySelector(sitesMap[websiteIndex].homePageCheck)) {
            websiteLogin(site)
        }

        if(document.querySelector(".dashboard-action-btns")){
            if(document.querySelector("[href='/daily']") && !document.querySelector("[href='/daily']").classList.contains('disabled')){
                document.querySelector("[href='/daily']").click();
            }else if(document.querySelector(".dashboard-action-btns [href='/faucet/']") && !document.querySelector(".dashboard-action-btns [href='/faucet/']").classList.contains('disabled')){
                document.querySelector(".dashboard-action-btns [href='/faucet/']").click();
            }else{
                movetonext()
            }
        }

        if (window.location.href.includes(check_address +'/daily') || window.location.href.includes(check_address +'/faucet/')) {
            setInterval(function() {
                if (document.querySelector("button[type='submit']")) {
                    if (isCaptchaChecked()) {
                        document.querySelector("button[type='submit']").click();
                    }
                }
                if(document.querySelector(".btn.earn-btns") && document.querySelector(".btn.earn-btns").innerText.includes("Continue") || document.querySelector(".btn.earn-btns").innerText.includes("Go Home")){
                    document.querySelector(".btn.earn-btns").click();
                }
            }, 6000);
        }
    }

    // Process current site
    function processSite(site) {
        if (sitesMap[websiteIndex].additionalFunction) {
            sitesMap[websiteIndex].additionalFunction(site);
        }else{
            if(document.querySelector(sitesMap[websiteIndex].homePageCheck) && (window.location.href.includes(check_address))) {
                window.location.replace(check_address + "/login");
            }

            if (window.location.href.includes(check_address +'/login')) {
                console.log(sitesMap[websiteIndex], websiteIndex)
                websiteLogin(site)
            }

            if(window.location.href.includes(check_address +'/account')) {
                if(site.enableFaucet){
                    window.location.replace(check_address +'/faucet');
                }
            }


            if (window.location.href.includes(check_address +'/faucet')) {

                let fauceClick = false;

                setInterval(function() {
                    if (document.querySelector(sitesMap[websiteIndex].claimPopupOpen) && fauceClick === false) {
                        document.querySelector(sitesMap[websiteIndex].claimPopupOpen).click();
                        fauceClick = true;
                    }
                }, 5000);

                setInterval(function() {
                    if(document.querySelector("button[type='submit']")){
                        if(site.faucetCaptcha == true){
                            if (isCaptchaChecked()) {
                                document.querySelector("button[type='submit']").click();
                            }
                        }else{
                            document.querySelector("button[type='submit']").click();
                        }
                    }
                    if(isFaucetFullyClaimed()){
                        movetonext();
                    }
                }, 5000);
                setInterval(function() {
                    if (isFaucetClaimButtonDisabled(sitesMap[websiteIndex].claimPopupOpen) && site.enableSurf == true) {
                        movetosurf()
                    }else if(isFaucetClaimButtonDisabled(sitesMap[websiteIndex].claimPopupOpen)){
                        movetonext()
                    }
                }, interval * 60000);
            }
        }
    }

    // Start processing the first site
    processSite(sites[currentIndex]);
})();