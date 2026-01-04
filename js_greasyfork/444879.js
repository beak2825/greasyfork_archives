// ==UserScript==
// @name         Discord Token Login
// @namespace    Discord Token Login
// @version      0.1
// @description  Вход в учетную запись Discord с помощью токена на странице discord.com/login.
// @author       Bladhard
// @match        https://discord.com/login
// @icon         https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico
// @grant        none
// @exclude      https://discord.com/
// @exclude      https://discord.com/app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444879/Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/444879/Discord%20Token%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
    }, 50);
    setTimeout(() => {
        location.reload();
    }, 2500);
};

    window.onload = function() {
        setTimeout(() => {
            let locat = window.location.pathname
            if (locat === '/login') {
            let tokens = prompt('Введите Discord токен');
            let length = tokens.length;
            if (tokens === null) {}
            else if (length == 0) {
                alert('Упсс...! Похоже ты не ввел токен.')
                let tokens = prompt('Введите Discord токен');
                if (tokens != null) {login(tokens)}
            }
            else if (length > 10) {login(tokens)}
            }
            }, 1000);
  };
})();