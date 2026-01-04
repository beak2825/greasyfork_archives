// ==UserScript==
// @name         radiofavo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mail yourself
// @author       @r_nyahaha
// @license       MIT
// @match        https://docs.google.com/forms/d/e/1FAIpQLSd00_0B0j1rwOi7IAf1uYjdSH1l64iDvzT_6JK0nPKHUGZJeg/*
// @match        https://docs.google.com/forms/d/e/1FAIpQLSdtcGIV6TUna32J4W7sbgH4JG24QTfxwhunWRy_ExOmlZIOrg/*
// @match        https://docs.google.com/forms/d/e/1FAIpQLSceRMnrWhPpluXyFoc_qEPKEwECMXt29kLuodNRtvZnnFIpug/*
// @match        https://docs.google.com/forms/d/e/1FAIpQLSeH5v_0Uyiw9rZg81L0H5AuuOxL6qG2Xpd8wM0Fya9XkMk_eQ/*
// @match        https://docs.google.com/forms/d/e/1FAIpQLSddu35Q_8vE8KY2q8u7wwlnRdDd-PSrg-ScH6F9-NFbFskViQ/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445718/radiofavo.user.js
// @updateURL https://update.greasyfork.org/scripts/445718/radiofavo.meta.js
// ==/UserScript==
(function() {
    'use strict';
var a = document.getElementsByClassName("docssharedWizToggleLabeledContainer");
var b = a.length-1
a[b].click()
})();