// ==UserScript==
// @name         Agenzia delle Entrate - Login helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stores username, password and pin in localStorage to log-in faster
// @author       Martino Mensio
// @match        https://ivaservizi.agenziaentrate.gov.it/portale/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394619/Agenzia%20delle%20Entrate%20-%20Login%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/394619/Agenzia%20delle%20Entrate%20-%20Login%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // let's see what is available in localStorage
    let username = localStorage.getItem('username_');
    let password = localStorage.getItem('password');
    let pin = localStorage.getItem('pin');
    if (username && password && pin) {
        // login already done: use the values
        document.getElementById('username').value = username;
        document.getElementById('password').value = password;
        document.getElementById('pin').value = pin;
    }
    // when the three fields change value, save them
    document.getElementById('username').onchange = function() {
        const ricorda = document.getElementById('ricorda-cf').checked;
        if (ricorda) {
            username = document.getElementById('username').value;
            localStorage.setItem('username_', username);
        }
    }
    document.getElementById('password').onchange = function() {
        const ricorda = document.getElementById('ricorda-cf').checked;
        if (ricorda) {
            password = document.getElementById('password').value;
            localStorage.setItem('password', password);
        }
    }
    document.getElementById('pin').onchange = function() {
        const ricorda = document.getElementById('ricorda-cf').checked;
        if (ricorda) {
            pin = document.getElementById('pin').value;
            localStorage.setItem('pin', pin);
        }
    }
})();