// ==UserScript==
// @name        No wait download - imslp.org
// @namespace   Violentmonkey Scripts
// @match       https://imslp.org/*
// @grant       none
// @version     1.1
// @author      someone
// @description no wait when downloading
// @downloadURL https://update.greasyfork.org/scripts/430495/No%20wait%20download%20-%20imslporg.user.js
// @updateURL https://update.greasyfork.org/scripts/430495/No%20wait%20download%20-%20imslporg.meta.js
// ==/UserScript==


window.open(document.getElementById("sm_dl_wait").attributes["data-id"].value, '_blank');
