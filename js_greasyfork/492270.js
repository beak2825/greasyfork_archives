// ==UserScript==
// @name         pfl.ua - get players
// @namespace    http://tampermonkey.net/
// @version      2024-04-11-002
// @description  "Get players name, surname and number as js array of objects (json string)"
// @author       You
// @match        https://pfl.ua/team/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pfl.ua
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492270/pflua%20-%20get%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/492270/pflua%20-%20get%20players.meta.js
// ==/UserScript==

(function() {

    'use strict';
    console.log("get players");
    let comanda = [];
    document.querySelectorAll("#ex1-tabs-1 .my-1").forEach(function(el) {
        let pfio = el.querySelectorAll(".m-0");
        let pnum = el.querySelector(".col-auto");
        // comanda = comanda + pfio[0].innerHTML + " --- " + pfio[1].innerHTML + " --- " + pnum.innerHTML + "\n";
        let plr = {};
        plr.name = pfio[1].innerHTML.split(/(\s+)/)[0];
        plr.surname = pfio[0].innerHTML;
        plr.num = pnum.innerHTML;
        comanda.push(plr);
    });
    prompt("qwe", '"playerbase":' + JSON.stringify(comanda, null, '\t'));

})();
