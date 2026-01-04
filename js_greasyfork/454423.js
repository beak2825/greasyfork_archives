// ==UserScript==
// @name        WAGNER SY
// @namespace   Violentmonkey Scripts
// @match       *://thumb8.net/*
// @match       *://thumb9.net/*
// @match       *://crewbase.net/*
// @match       *://crewus.net/*
// @match       *://shinchu.net/*
// @match       *://shinbhu.net/*
// @match       *://ultraten.net/*
// @match       *://uniqueten.net/*
// @match       *://topcryptoz.net/*
// @match       *://allcryptoz.net/*
// @grant       none
// @version     1.3
// @author      SY
// @run-at      document-end
// @description BE HAPPY 
// @downloadURL https://update.greasyfork.org/scripts/454423/WAGNER%20SY.user.js
// @updateURL https://update.greasyfork.org/scripts/454423/WAGNER%20SY.meta.js
// ==/UserScript==

(function(){
'use strict'
const h = new URL(location.href);
if (h.pathname === '/adblock.html' || h.pathname === '/bypass.html'){ location.href = h.host + '?redirect_to=random' }
const existo = selector => document.querySelector(selector);
const _recaptcha_s = (selector, tiempo_de_espera = 1) => { const t= window.setInterval( function() { if (window.grecaptcha && !!window.grecaptcha.getResponse()) { selector.submit(); clearInterval(t);}}, tiempo_de_espera * 1000);}
const _elemento_s = (selector, tiempo_de_espera = 1) => { window.setTimeout(function() { selector.submit();}, tiempo_de_espera * 0.1);}
var formstotal = document.forms.length;
for (var f=0; f<formstotal;f++){ var form = document.getElementsByTagName("form")[f]; var sipaso = form.getAttribute("action");
if (sipaso==='/adblock.html' || sipaso==='/bypass.html' ){console.log('flybite');} else {console.log('flypass ok');
if (existo(".g-recaptcha")) { _recaptcha_s(form, 2); break;}
else { _elemento_s(form, 7); break;}}};
})();
