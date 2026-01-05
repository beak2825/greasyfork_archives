// ==UserScript==
// @name         Animestelecine.com
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.2
// @description  Burla a página de espera de 4 segundos para realizar o Download
// @author       Felippe
// @include      http*://*.animestelecine.me/*
// @include      http*://*.animestelecine.com/*
// @include      http*://*.animestelecine.net/*
// @include      http*://*.animestelecine.top/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/16836/Animestelecinecom.user.js
// @updateURL https://update.greasyfork.org/scripts/16836/Animestelecinecom.meta.js
// ==/UserScript==

setTimeout(function() {
				$('.downlink').toggle()
			}, 4000);


setTimeout(function() {
				$('.downlink').toggle()
			}, 0);

window.location.replace(document.getElementsByClassName('downlink')[0].href);


