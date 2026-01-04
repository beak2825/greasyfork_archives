// ==UserScript==
// @name         Hellobank.fr/BNP Paribas login form: remember username
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Saves your username (number) to localStorage
// @author       BohwaZ
// @match        https://espace-client.hellobank.fr/login*
// @match        https://connexion-mabanque.bnpparibas/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hellobank.fr
// @license WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465865/HellobankfrBNP%20Paribas%20login%20form%3A%20remember%20username.user.js
// @updateURL https://update.greasyfork.org/scripts/465865/HellobankfrBNP%20Paribas%20login%20form%3A%20remember%20username.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("readystatechange", () => {
        var i = document.querySelector('input[name="userGridPasswordCredential.username"]');
        var v = localStorage.getItem('username');
        if (v) {
            i.value = v;
        }
        i.addEventListener('keyup', () => { if (i.value.match(/^\d+$/)) { localStorage.setItem('username', i.value); } });

    }, { once: true });
})();