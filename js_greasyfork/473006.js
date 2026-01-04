// ==UserScript==
// @name         Delete vpn element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete vpn element from vpn hola
// @author       novoto4in
// @license      MIT
// @exclude      https://docs.google.com/spreadsheets/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473006/Delete%20vpn%20element.user.js
// @updateURL https://update.greasyfork.org/scripts/473006/Delete%20vpn%20element.meta.js
// ==/UserScript==

setTimeout(() => {
  const vpnDno = document.querySelector('#_hola_popup_iframe__');
  vpnDno.remove();
  console.log('try del')
}, 8000)
