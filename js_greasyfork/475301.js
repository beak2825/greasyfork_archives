// ==UserScript==
// @name         gssozluk_tamyas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GS Sözlük kişi profilleri için tam yaş hesaplayıcı
// @author       Barış Safa GÜRLER
// @license MIT
// @match        https://rerererarara.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rerererarara.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475301/gssozluk_tamyas.user.js
// @updateURL https://update.greasyfork.org/scripts/475301/gssozluk_tamyas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let el = document.querySelector(".futbolcu-kunyesi td[title^=Doğum]");
    let aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    let str = el.getAttribute("title");
    let dt_str = str.substring(str.indexOf(":") + 2);
    let parcalar = dt_str.split(" ");
    let gun = parcalar[0];
    let ay = aylar.indexOf(parcalar[1]);
    let yil = parcalar[2];
    let dt = new Date(yil, ay, gun);
    el.innerHTML = ((Date.now() - dt.getTime())/31556925994).toFixed(2) + " (" + dt_str + ")";
})();








