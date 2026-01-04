// ==UserScript==
// @name         Auto Reward
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://faucetcrypto.com/ptc/view/*
// @match        https://faucetcrypto.com/claim/step/*
// @match        https://faucet.gold/BTC/*
// @match        https://faucet.gold/ETH/*
// @match        https://faucetcrypto.com/*
// @icon         https://www.google.com/s2/favicons?domain=faucetcrypto.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425690/Auto%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/425690/Auto%20Reward.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    var interval = setInterval(function(){
        if(window.location.pathname.includes("claim/step/3") || window.location.href.includes("?step=3")){
            clearInterval(interval);
            setTimeout(function() {goto(); setInterval(interval)}, 30000)
        }
        if(window.location.pathname.includes("claim/step/1") || window.location.pathname.includes("claim/step/2") || window.location.href.includes("?step=1") || window.location.href.includes("?step=2")){
            clearInterval(interval);
            goto();
            setInterval(interval)
        }
        if(window.location.pathname.includes("ptc/view")){
            clearInterval(interval);
            setTimeout(function() {
                document.getElementsByClassName("h-screen flex overflow-hidden bg-gray-100")[0].__vue__.$inertia.visit("/ptc/view-link/"+window.location.pathname.split("/")[3])
                setInterval(interval)
            }, (document.getElementsByClassName("inline-flex rounded-md shadow-sm")[0].__vue__.seconds) * 1000)
        }
    }, 2000);
})