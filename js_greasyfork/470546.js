// ==UserScript==
// @name        Lechess: auto stockfish
// @license MIT
// @namespace   pwa
// @match       https://lichess.org/analysis/*
// @icon        https://lichess.org/favicon.ico
// @grant       none
// @author      pwa
// @description 10/6/2022, 01:01:01 PM
// @run-at      document-start
// @inject-into content
// @version 0.0.1.20230710162247
// @downloadURL https://update.greasyfork.org/scripts/470546/Lechess%3A%20auto%20stockfish.user.js
// @updateURL https://update.greasyfork.org/scripts/470546/Lechess%3A%20auto%20stockfish.meta.js
// ==/UserScript==

setTimeout(() => {
  console.log("[~] load")
  let sf = document.getElementById("analyse-toggle-ceval")
  if (sf && !sf.checked) {
    console.log("[+] enabling stockfish")
    sf.click()
  }
}, 500);