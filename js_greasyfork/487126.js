// ==UserScript==
// @name         Barça
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @description  Veure el barca gratis
// @match        https://bingsport.watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bingsport.watch
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487126/Bar%C3%A7a.user.js
// @updateURL https://update.greasyfork.org/scripts/487126/Bar%C3%A7a.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = () => {
        window.user_info.is_vip = true;
        window.user_private_token = 'vip_';
    };
})();

window.checkAccount = (f, t) => {
    console.log("Yeah I'm VIP");

    fetch("/me", {
        method: "POST",
        body: {}
    }).then((res) => res.json()).then((data) => {
        console.log("Got data: ", data);
        f(data.token_livestream || '');
        window.token_livestream = data.token_livestream;
    })
}