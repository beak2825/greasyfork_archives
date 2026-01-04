// ==UserScript==
// @name         CollabVM VM List Fixer
// @namespace    Heck
// @version      2.1.3
// @description  Fixes CollabVM's list
// @author       quant, Uploaded by Wulf715
// @match        http://computernewb.com/collab-vm/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/372897/CollabVM%20VM%20List%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/372897/CollabVM%20VM%20List%20Fixer.meta.js
// ==/UserScript==
tunnel.onstatechange=()=>{};
document.querySelector('#loading').style.display='none';
setTimeout(`
//multicollab("63.141.238.98:6004");
//multicollab("63.141.238.98:6005");
tunnel.onstatechange=()=>{};
document.querySelector('#loading').style.display='none';
multicollab("78.62.57.241:6004");

multicollab("74.140.19.209:12072");

multicollab('0.tcp.ngrok.io:17998');

`,50);