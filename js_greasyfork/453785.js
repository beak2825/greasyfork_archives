// ==UserScript==
// @name        bypass fly 3
// @namespace   Violentmonkey Scripts
// @include       *://thumb8.net/*
// @include       *://thumb9.net/*
// @include       *://crewbase.net/*
// @include       *://crewus.net/*
// @include       *://shinchu.net/*
// @include       *://shinbhu.net/*
// @include       *://ultraten.net/*
// @include       *://uniqueten.net/*
// @include       *://topcryptoz.net/*
// @include       *://allcryptoz.net/*
/// @grant       none
// @version     111
// @author      -
// @description be happy 
// @downloadURL https://update.greasyfork.org/scripts/453785/bypass%20fly%203.user.js
// @updateURL https://update.greasyfork.org/scripts/453785/bypass%20fly%203.meta.js
// ==/UserScript==
(function(){
'use strict'
const h = new URL(location.href);
Object.defineProperty(window, "demandSupplyCs", { enumerable : true, writable : false, value : 1 });
if (h.pathname === '/adblock.html'){ location.href = h.host + '?redirect_to=random' }
const w = window; const d = document; const ci = clearInterval;
     const existo = selector => d.querySelector(selector);
     const _recaptcha_s = (selector, tiempo_de_espera = 1) => { if (existo) { const t= w.setInterval( function() { if (w.grecaptcha && !!w.grecaptcha.getResponse()) { selector.submit(); ci(t);}}, tiempo_de_espera * 10);}}
     const _elemento_s = (selector, tiempo_de_espera = 1) => { if (existo) { w.setTimeout(function() { selector.submit();}, tiempo_de_espera * 800);}}
     var formstotal = d.forms.length;
        for (var f=0; f<formstotal;f++){ var form = document.getElementsByTagName("form")[f]; var sipaso = form.getAttribute("action");
           if (sipaso==='/adblock.html' || sipaso==='/bypass.html' ){} else {
              if (existo(".g-recaptcha")) { _recaptcha_s(form, 5);}
                 else { _elemento_s(form, 10);}                         }
                                       }
})();