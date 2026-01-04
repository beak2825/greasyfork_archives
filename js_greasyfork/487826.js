// ==UserScript==
// @name         revcut
// @namespace    http://tampermonkey.net/
// @version      10.2
// @description  Personal script
// @author       You
// @match        https://horoscop.info/*
// @match        https://revcut.net/*
// @match        https://healthytip.eu/*
// @match        https://writeprofit.org/*
// @match        https://globalrecipes.us/*
// @match        https://docadvice.eu/*
// @match        https://saigontravel.top/*
// @match        https://danangtravel.top/*
// @match        https://article24.online/*
// @match        https://virtuous-tech.net/*
// @match        https://rfaucet.com/*
// @match        https://www.jeuxenligne.xyz/*
// @match        https://newscrypto.info/*
// @match        https://worldwallpaper.top/*
// @match        https://cryptowidgets.net/*
// @match        https://cryptopaid.net/*
// @match        https://www.maqal360.com/*
// @match        https://topurl.site/*
// @match        https://infotrends.co/*
// @match        https://crypto-fi.net/*
// @match        https://eblog.pro/*
// @match        https://cutlink.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horoscop.info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487826/revcut.user.js
// @updateURL https://update.greasyfork.org/scripts/487826/revcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

  setInterval(function() { window.focus(); }, 100);
    document.hasFocus = function () {return true;};


     // damn captcha
        $("#overlay").remove();
        $("#click").css("display","none");
        $("#"+ $("#captchabox_container").closest("form>div").attr("id") ).css("display","block");

setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.btn-lg.get-link.btn-success.btn').click();
    }, 7000);

     $("#overlay").remove();
        $("#click").css("display","none");
        $("#"+ $(".g-recaptcha:first").closest("form>div").attr("id") ).css("display","block");

   var r_timer2 = setInterval( function() {

                if( $("h3").text() == "SCROLL DOWN AND FIND THE BUTTON" ) {
                 function docReady(fn){ if (document.readyState === "complete" || document.readyState === "interactive") {setTimeout(fn, 30000);} else {document.addEventListener("DOMContentLoaded", fn);}}
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


    function docReady(fn){ if (document.readyState === "complete" || document.readyState === "interactive") {setTimeout(fn, 30000);} else {document.addEventListener("DOMContentLoaded", fn);}}
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


    setTimeout(function() {

  $('a').trigger('click');
}, 40000);







})();