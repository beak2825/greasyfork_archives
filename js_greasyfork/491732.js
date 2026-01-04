// ==UserScript==
// @name         IMVU Lock List CSS Addon
// @namespace    http://tampermonkey.net/
// @version      2024-04-07-1428
// @description  Improve appearence of blockedlist page on Imvu classic
// @author       Evehne
// @match        https://*.imvu.com/catalog/web_blocked_list.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491732/IMVU%20Lock%20List%20CSS%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/491732/IMVU%20Lock%20List%20CSS%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';
var e = document.querySelector('td .blockedlistbox');
e.innerHTML = e.innerHTML + `
<style>
  body > table {
    margin-top: 150px;
    margin-bottom: 150px;
  }
  #mininav_body{
    position: fixed;
    width: 100%;
    left: 0px;
    top: 0px;
    z-index: 10000 !important;
    background: white;
  }
  .blockedlistbox {
    display: flex;
    width: 98%;
    flex-direction: row;
    justify-items: center;
    text-align: center;
    background: none;
  }
  .blockedlistbox > tbody > tr:has(.infoBox) {
    display: inline-flex;
    width: 350px;
    margin-bottom: 3px;
  }
  .infoBox table[background^="/catalog"]{
    background: none;
  }
  .infoBox:has(font[color="#bb0000"]) {
    opacity: 0.7;
    background: #e3aeae;
  }
  .infoBox:has(font[color="#00bb00"]) {
    opacity: 1.0;
    background: #cff1b9;
  }
  .blockedlistbox > tbody > tr:has(.infoBoxContentstrans){
    display: block;
    position: fixed;
    width: 100%;
    left: 0px;
    top: 34px;
    z-index: 10100 !important;
    background: #333;
    border: 1px solid #333;
  }
  .blockedlistbox > tbody > tr > td:has(.infoBoxContentstrans){
    display: inline-block;
    width: 100%;
    text-align: center;
  }
</style>
`;
var els = document.querySelectorAll('.blockedlistbox > tbody > tr');
var count = els.length;
    els[count-1].parentNode.insertBefore(els[count-1], els[0]);
})();