// ==UserScript==
// @name         earn
// @namespace    http://tampermonkey.net/
// @version      12
// @description  try to take over the world!
// @author       You
// @match        https://cryptowidgets.net/*
// @match        https://pfcfaucet.my.id/*
// @match        https://freeoseocheck.com/*
// @match        https://dailytech-news.eu/*
// @match        https://blog.webfreetools.net/*
// @match        https://blog.petsguide.net/*
// @match        https://blog.wiki-topia.com/*
// @match        https://blog.countriesguide.net/*
// @match        https://blog.webfreetools.net/*
// @match        https://blog.gputrends.net/*
// @match        https://blog.coinsrise.net/*
// @match        https://financewrapper.net/*
// @match        https://blog.coinsvalue.net/*
// @match        https://blog.cryptowidgets.net/*
// @match        https://blog.melodyspot.net/*
// @match        https://blog.coinstrend.net/*
// @match        https://blog.makeupguide.net/*
// @match        https://blog.insurancegold.in/*
// @match        https://blog.carstopia.net/*
// @match        https://blog.carsmania.net/*
// @match        https://coinsvalue.net/*
// @match        https://blog.cookinguide.net/*
// @match        https://coinscap.info/*
// @match        https://blog.cinemascene.net/*
// @match        https://blog.tvseriescentral.net/*
// @match        https://blog.constructorspro.com/*
// @match        https://giftmagic.net/*
// @match        https://blog.webfreetools.net/*
// @match        https://freeoseocheck.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptowidgets.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503556/earn.user.js
// @updateURL https://update.greasyfork.org/scripts/503556/earn.meta.js
// ==/UserScript==

(function() {
    'use strict';




                      function docReady(fn){ if (document.readyState === "complete" || document.readyState === "interactive") {setTimeout(fn, 450000000);} else {document.addEventListener("DOMContentLoaded", fn);}}
function flypass(){
const h = new URL(location.href);
if (h.pathname === '/adblock.html' || h.pathname === '/bypass.php'){ location.href = h.host + '?redirect_to=random' }
const existo = selector => document.querySelector(selector);
const _recaptcha_s = (selector, tiempo_de_espera = 1) => { const t= window.setInterval( function() { { selector.submit(); clearInterval(t);}}, tiempo_de_espera, 50000);}
const _elemento_s = (selector, tiempo_de_espera = 1) => { window.setTimeout(function() { selector.submit();}, tiempo_de_espera, 50000);}
var formstotal = document.forms.length;
for (var f=0; f<formstotal;f++){ var form = document.getElementsByTagName("form")[f]; var sipaso = form.getAttribute("action");
if (sipaso==='/adblock.html' || sipaso==='/bypass.html' ){console.log('flybite');} else {console.log('flypass ok');
if (existo(".g-recaptcha")) { _recaptcha_s(form, 2); break;}
else { _elemento_s(form, 7); break;}}};}

docReady(flypass);

    var r_timer2 = setInterval( function() {

                if( $(".bg-success.badge.mb-2").text() == "Verified!" ) {
                        function docReady(fn){ if (document.readyState === "complete" || document.readyState === "interactive") {setTimeout(fn, 5000);} else {document.addEventListener("DOMContentLoaded", fn);}}
function flypass(){
const h = new URL(location.href);
if (h.pathname === '/adblock.html' || h.pathname === '/bypass.php'){ location.href = h.host + '?redirect_to=random' }
const existo = selector => document.querySelector(selector);
const _recaptcha_s = (selector, tiempo_de_espera = 1) => { const t= window.setInterval( function() { { selector.submit(); clearInterval(t);}}, tiempo_de_espera, 50000);}
const _elemento_s = (selector, tiempo_de_espera = 1) => { window.setTimeout(function() { selector.submit();}, tiempo_de_espera, 50000);}
var formstotal = document.forms.length;
for (var f=0; f<formstotal;f++){ var form = document.getElementsByTagName("form")[f]; var sipaso = form.getAttribute("action");
if (sipaso==='/adblock.html' || sipaso==='/bypass.html' ){console.log('flybite');} else {console.log('flypass ok');
if (existo(".g-recaptcha")) { _recaptcha_s(form, 2); break;}
else { _elemento_s(form, 7); break;}}};}

docReady(flypass);
                }
            }, 1000);

})();