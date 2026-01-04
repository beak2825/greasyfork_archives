// ==UserScript==
// @name        FOL - Disable reply/like
// @namespace   Violentmonkey Scripts
// @match       https://forum.finanzaonline.com/threads/*
// @grant       none
// @version     1.0.1
// @author      money4nothing
// @license     MIT
// @description 5/1/2023, 14:30:43
// @downloadURL https://update.greasyfork.org/scripts/497694/FOL%20-%20Disable%20replylike.user.js
// @updateURL https://update.greasyfork.org/scripts/497694/FOL%20-%20Disable%20replylike.meta.js
// ==/UserScript==

// disable like button
document.querySelectorAll('.actionBar-action--reaction').forEach(el => el.style.display = 'none')

// disable reply button
document.querySelector('.button--icon--reply').style.display = 'none';