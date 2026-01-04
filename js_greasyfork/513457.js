// ==UserScript==
// @name         Sahibinden Ilan Gizleyici
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ignored_classifieds cookie'sine göre ilanları gizler
// @author       gecmisi.com.tr
// @match        https://*.sahibinden.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513457/Sahibinden%20Ilan%20Gizleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/513457/Sahibinden%20Ilan%20Gizleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const ignoredClassifiedsCookie = getCookie("ignored_classifieds");


    if (ignoredClassifiedsCookie) {
        const ignoredClassifieds = decodeURIComponent(ignoredClassifiedsCookie)
            .replace(/[\[\]]/g, '') 
            .split(',')             
            .map(code => code.trim()); 

        ignoredClassifieds.forEach(id => {
            const item = document.querySelector(`tr[data-id="${id}"]`);
            if (item) {
                item.style.display = 'none'; // İlanı gizle
            }
        });
    }
})();
