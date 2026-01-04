// ==UserScript==
// @name         nota topet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tokopedia.com/invoice.pl?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420819/nota%20topet.user.js
// @updateURL https://update.greasyfork.org/scripts/420819/nota%20topet.meta.js
// ==/UserScript==

(function() {
    'use strict';
var style = document.createElement('style')
  style.innerHTML = `
    div{
        color: black !important;
      }

    `;
    document.head.appendChild(style)

var nod = document.getElementsByClassName('content-area')[0].getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].childNodes
var kurir = nod[6].getElementsByTagName('tbody')[2].getElementsByTagName('td')[0].innerHTML
kurir = kurir.replace(/\s/g, '').slice(0,3)
if (kurir == 'J&a') {
    kurir = 'J%26T'
}
var notrans = nod[0].getElementsByTagName('tbody')[1].getElementsByTagName('span')[1].innerHTML.slice(-9)

console.log(kurir)

var image = nod[0].getElementsByTagName('img')[0]
image.style.width = '400px'
image.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans + '%5Cr%5CtTP%5Cr' + kurir + '%5Cr' +'&code=Code128&multiplebarcodes=false&translate-esc=true&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=&qunit=Mm&quiet=0'
})();