// ==UserScript==
// @name         Aplicar Cupom 20 Site MultiPasswords
// @version      1.1
// @description  freefaucets multipasswords version
// @license MIT
// @author       Garcia
// @author       Hexemeister
// @match        https://freecardano.com/*
// @match        https://freebitcoin.io/*
// @match        https://freenem.com/*
// @match        https://coinfaucet.io/*
// @match        https://freesteam.io/*
// @match        https://freetether.com/*
// @match        https://freeusdcoin.com/*
// @match        https://freebinancecoin.com/*
// @match        https://freeethereum.com/*
// @match        https://free-tron.com/*
// @match        https://freedash.io/*
// @match        https://freechainlink.io/*
// @match        https://freeneo.io/*
// @match        https://free-ltc.com/*
// @match        https://free-doge.com/*
// @match        https://freecryptom.com/*
// @match        https://freeshibainu.com/*
// @match        https://freepancake.com/*
// @match        https://freematic.com/*
// @match        https://freebittorrent.com/*
// @match        https://freebfg.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/943794
// @downloadURL https://update.greasyfork.org/scripts/465442/Aplicar%20Cupom%2020%20Site%20MultiPasswords.user.js
// @updateURL https://update.greasyfork.org/scripts/465442/Aplicar%20Cupom%2020%20Site%20MultiPasswords.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // uma senha para cada site
    const websites = [
        {url: "freecardano.com", password: "your_password"},
        {url: "freebitcoin.io", password: "your_password"},
        {url: "freenem.com", password: "your_password"},
        {url: "coinfaucet.io", password: "your_password"},
        {url: "freesteam.io", password: "your_password"},
        {url: "freetether.com", password: "your_password"},
        {url: "freeusdcoin.com", password: "your_password"},
        {url: "freebinancecoin.com", password: "your_password"},
        {url: "freeethereum.com", password: "your_password"},
        {url: "free-tron.com", password: "your_password"},
        {url: "freedash.io", password: "your_password"},
        {url: "freecryptom.com", password: "your_password"},
        {url: "freeneo.io", password: "your_password"},
        {url: "free-ltc.com", password: "your_password"},
        {url: "free-doge.com", password: "your_password"},
        {url: "freeshibainu.com", password: "your_password"},
        {url: "freepancake.com", password: "your_password"},
        {url: "freematic.com", password: "your_password"},
        {url: "freebittorrent.com", password: "your_password"},
        {url: "freebfg.com", password: "your_password"}
    ]

    var inputEmail = "your_email@example.com" // xxx = your email
    var inputPassword = websites.filter(e => e.url == window.location.hostname).map(e => e.password)

    const promotion = []
    const regex_codes = /<td class=\"align-middle fst-italic\">(.+)<\/td><td class=\"align-middle text-end\">/g
    const regex_msg = "<p>(.+)<\/p>"

    function get_promo(){
        GM.xmlHttpRequest({
            method: "GET",
            url: "http://boboscrypto.eu/faucets/sites/cryptosfaucets.php",
            onload: function(response) {

                for (let i = 0; i < response.responseText.match(regex_codes).length; i++) {
                    promotion.push(response.responseText.match(regex_codes)[i].match(">(.+)<\/")[1])
                }
                promotion.forEach((codigo) => {setTimeout(() =>{get_rolls(codigo) },60);
                                              });
            }
        });
    }
    function get_rolls(promo)
    {
        GM.xmlHttpRequest({
            method: "GET",
            url: location.protocol+"//"+location.host+"/promotion/"+promo,
            onload: function(response) {
                console.log(response.responseText.match(regex_msg)[1])
            }
        });
    }

    // Muda de pagina
    function AutoSwitch() {

        setTimeout( function() {
            console.log("KKKKKKK")
            var current_page_id = websites.map(e => e.url).indexOf( window.location.hostname )
            var next_page_id = ( current_page_id < websites.length - 1 ) ? current_page_id + 1 : 0;
            window.location.href = window.location.protocol + "//" + websites[ next_page_id ].url
        }, 5000 )
    }

    //Login
    function login(){
        setTimeout (() => {
            console.log("NotYet")
            if (document.querySelector('input[type="email"]'))
                //&& document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length == 0)
            {
                document.querySelector('input[type="email"]').value = inputEmail
                document.querySelector('input[type="password"]').value = inputPassword
                document.querySelector('button.main-button.main-button-yellow.login.bg-3').click()
            }
        },2000)
    }

    if(location.pathname == "\/free"){
        get_promo()
        setTimeout(()=>{AutoSwitch()},5000)
    }
    if(location.pathname == "\/"){
        login()
    }


})
();
