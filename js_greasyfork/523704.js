// ==UserScript==
// @name         DexScreener Button on Solscan
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  Adds a Dexscreener button on Solscan page for a token
// @author       Abhishek Prasad
// @match        https://solscan.io/token/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solscan.io
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/523704/DexScreener%20Button%20on%20Solscan.user.js
// @updateURL https://update.greasyfork.org/scripts/523704/DexScreener%20Button%20on%20Solscan.meta.js
// ==/UserScript==

// ==UserScript==
// @name        DexScreener Link on Solscan
// @namespace   http://tampermonkey.net/
// @version     2025-01-14
// @description Adds a Dexscreener link on Solscan page for a token
// @author      Abhishek Prasad
// @match       https://solscan.io/token/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=solscan.io
// @grant       none
// ==/UserScript==

var input = document.createElement("input");
input.type = "button";
input.value = "DexScreener Link";
input.onclick = showAlert;

// Apply inline styles to the button
input.setAttribute("style", `
  background-color: #007bff; /* Blue background */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px; /* Add rounded corners */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Add a subtle shadow */
  position: absolute;
  top: 120px;
  right: 40px;
`);

document.body.appendChild(input);

function showAlert() {
  const currentUrl = window.location.href;
  console.log(currentUrl);
  window.location.href = "https://dexscreener.com/solana/" + getLastPartOfUrl(currentUrl);
}

function getLastPartOfUrl(url) {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  return pathParts[pathParts.length - 1];
}