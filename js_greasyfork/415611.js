// ==UserScript==
// @name        F1-näppäin muuttaa textboxit kopioitavaksi tekstiksi (Taulukoiden kopiointi exceliin)- Adminet
// @namespace   Violentmonkey Scripts
// @match       https://adminet.admicom.fi/*
// @grant       none
// @version     1.0
// @author      -
// @description 21.2.2020 klo 19.33.01
// @downloadURL https://update.greasyfork.org/scripts/415611/F1-n%C3%A4pp%C3%A4in%20muuttaa%20textboxit%20kopioitavaksi%20tekstiksi%20%28Taulukoiden%20kopiointi%20exceliin%29-%20Adminet.user.js
// @updateURL https://update.greasyfork.org/scripts/415611/F1-n%C3%A4pp%C3%A4in%20muuttaa%20textboxit%20kopioitavaksi%20tekstiksi%20%28Taulukoiden%20kopiointi%20exceliin%29-%20Adminet.meta.js
// ==/UserScript==

window.addEventListener('keyup', ev => {
  if (ev.keyCode === 112) {
    $("input[type='text']").each( function(){ $(this).replaceWith($(this).val()) });
  }
})