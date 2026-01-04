// ==UserScript==
// @name         Le Parisien Accès Abonnés Gratuit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Accédez au contenu réservé aux abonnés du leparisien.fr
// @author       Smax2k8
// @include      https://www.leparisien.fr/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423188/Le%20Parisien%20Acc%C3%A8s%20Abonn%C3%A9s%20Gratuit.user.js
// @updateURL https://update.greasyfork.org/scripts/423188/Le%20Parisien%20Acc%C3%A8s%20Abonn%C3%A9s%20Gratuit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".blurText {filter: blur(0px)!important;}.piano-paywall{display:none!important;}");
})();