// ==UserScript==
// @name         Seguimiento de productos de Gearbest
// @namespace    https://installfights.blogspot.cl/
// @version      0.1
// @description  Permite hacer seguimiento de tus compras de Gearbest
// @author       Nicolás Boettcher
// @match        https://user.gearbest.com/m-users-a-order_detail-order_id*
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39498/Seguimiento%20de%20productos%20de%20Gearbest.user.js
// @updateURL https://update.greasyfork.org/scripts/39498/Seguimiento%20de%20productos%20de%20Gearbest.meta.js
// ==/UserScript==

// Obtiene el track number de Gearbest
var track= document.getElementsByClassName('shipp_num')["0"].innerText;

// Encuentra el código para hacer seguimiento
var track_cl= track.split(' ',3)["2"];

// Modifica la url para acceder directamente al seguimiento por el sitio de Mail Americas
var a = document.querySelector('a[href^="http://tracking.mailamericas.com/search"]');
if (a) {
  a.setAttribute('href', 'http://tracking.mailamericas.com/search?tracking='+ track_cl);
}