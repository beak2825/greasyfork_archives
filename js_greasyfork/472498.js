// ==UserScript==
// @name        ddlitalia.biz header remover
// @description It removes the header in all pages of www.ddlitalia.biz
// @match       https://www.ddlitalia.biz/*
// @grant       none
// @version     1.1
// @author      SH3LL
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/472498/ddlitaliabiz%20header%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/472498/ddlitaliabiz%20header%20remover.meta.js
// ==/UserScript==

setTimeout(function() {
    let divs = document.querySelectorAll('div[style="padding:15px;"]');

    // Itera sugli elementi selezionati e rimuovili uno per uno
    divs.forEach(function(div) {
      div.remove();
    });

    let h3Elements = document.querySelectorAll('h3[style*="background: url(\\"https://www.ddlitalia.biz/templates/ddlitalia/images/maintitle.png\\")"]');

    // Itera sugli elementi selezionati e rimuovili uno per uno
    h3Elements.forEach(function(h3) {
      h3.remove();
    });

    // Seleziona tutti gli elementi <hr> senza alcuna proprietà al loro interno
    let hrElements = document.querySelectorAll('hr:not([color]):not([size]):not([noshade])');

    // Itera sugli elementi selezionati e rimuovili uno per uno
    hrElements.forEach(function(hr) {
      hr.remove();
    });


}, 500);
