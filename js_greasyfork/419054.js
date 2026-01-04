// ==UserScript==
// @name Free multicrypto Auto Faucet
// @description Auto Faucet Script by CodeFred
// @author CodeFred
// @version 2.0
// @namespace mailto:tmtm@outlook.be
// @match https://freebitcoin.io/*
// @match https://freenem.com/*
// @match https://coinfaucet.io/*
// @match https://freecardano.com/*
// @match https://freesteam.io/*
// @match https://freetether.com/*
// @match https://free-ltc.com/*
// @match https://freeusdcoin.com/*
// @match https://freeneo.io/*
// @match https://freebinancecoin.com/*
// @match https://free-tron.com/*
// @match https://freeethereum.com/*
// @match https://freedash.io/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/419054/Free%20multicrypto%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/419054/Free%20multicrypto%20Auto%20Faucet.meta.js
// ==/UserScript==

const email = ""
const password = ""

const websites = [
    "freebitcoin.io",
    "freenem.com",
    "coinfaucet.io",
    "freecardano.com",
    "freesteam.io",
    "freetether.com",
    "free-ltc.com",
    "freeusdcoin.com",
    "freeneo.io",
    "freebinancecoin.com",
    "free-tron.com",
    "freeethereum.com",
    "freedash.io"
]


setTimeout(function() {
    'use strict';

    // Automatic Login
    AutoLogin();

    // Roll when possible
    if (document.querySelector("div[class='roll-wrapper']").style.display !== "none") {
        document.querySelector("button[class='main-button-2 roll-button bg-2']").click()
        AutoSwitch(); // Automatic page switching
    }
    //every 10 minutes the page will be refreshed to check if you can roll again
    setTimeout(function(){ location.reload(); }, 10*60*1000);

},2000);

// Autom Login
function AutoLogin() {
    var login_form = document.getElementsByClassName('login-wrapper wrapper bg-1');
    if (login_form.length == 1) {
        var inputs = login_form[0].getElementsByTagName("input");
        var button = login_form[0].getElementsByTagName("button")[0];
        inputs[1].value = email;
        inputs[2].value = password;
        button.click()
    }
}

// Auto Page Switching
function AutoSwitch() {
    setTimeout(function() {
        var current_page_id = websites.indexOf(window.location.hostname)
        var next_page_id = (current_page_id < websites.length - 1) ? current_page_id + 1 : 0;
        window.location.href = window.location.protocol + "//" + websites[next_page_id]
    },2000);
}

