// ==UserScript==
// @name     CFST_Sujets_Recents
// @description     Améliore la page "sujets récents" du forum CFST
// @version  1
// @grant    none
// @include      http://www.communaute-francophone-star-trek.net/portal
// @namespace https://greasyfork.org/users/81086
// @downloadURL https://update.greasyfork.org/scripts/389829/CFST_Sujets_Recents.user.js
// @updateURL https://update.greasyfork.org/scripts/389829/CFST_Sujets_Recents.meta.js
// ==/UserScript==

document.querySelector(".marquee").style.overflow = 'auto';
document.querySelector(".js-marquee-wrapper").style.animation = 'unset';
document.querySelector(".js-marquee-wrapper").style.margin = '0';
document.querySelector(".column").style.width = '100%';
document.querySelector(".column").style.height = '100%';
document.querySelector(".marquee").style.height = 'unset';
document.querySelector(".marquee").style.fontSize = '1.2em';
var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth
if (x > 686) {
  document.querySelector(".marquee").style.maxWidth = '40em';
  document.querySelector(".marquee").style.marginLeft = 'calc(50% - 20em)';
}