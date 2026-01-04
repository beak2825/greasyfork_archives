// ==UserScript==
// @name        Hide sponsored from redflagdeals.com
// @namespace   Violentmonkey Scripts
// @match       https://*.redflagdeals.com/*
// @grant       none
// @version     1.1
// @author      ICHx
// @description 2024-11-23, 3:14:20 p.m.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518641/Hide%20sponsored%20from%20redflagdealscom.user.js
// @updateURL https://update.greasyfork.org/scripts/518641/Hide%20sponsored%20from%20redflagdealscom.meta.js
// ==/UserScript==

let payload = ()=>{Array.from(document.querySelectorAll('.sticky')).filter(n => n.innerText.includes('[Sponsored]')).forEach(n => n.outerHTML = '');
                  console.log('deleted')
                  }

window.addEventListener('load', payload, false);