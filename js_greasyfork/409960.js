// ==UserScript==
// @name         Softcobra Decoder
// @namespace    https://github.com/earthplusthree/userscripts
// @version      1.0
// @description  decodes links on softcobra.com
// @author       earthplusthree
// @match        *://www.softcobra.com/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/409960/Softcobra%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/409960/Softcobra%20Decoder.meta.js
// ==/UserScript==

// NEEDS TO BE FIXED

var tableRows = document.getElementsByTagName("td");
for (var j = 0; j < tableRows.length; j++) {
  var currRow = tableRows[j].innerText;
  const regex = /^U2Fsd.*/g;
  if (currRow.match(regex)) {
    var decodedLink = CryptoJS.AES.decrypt(currRow, "/").toString(
      CryptoJS.enc.Utf8
    );
    tableRows[j].innerHTML = `<a href="${decodedLink}">${decodedLink}</a>`;
  }
}