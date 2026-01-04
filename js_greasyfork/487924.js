// ==UserScript==
// @name        Keyboard shortcuts for leclercdrive.fr
// @namespace   Violentmonkey Scripts
// @match       https://*.leclercdrive.fr/*
// @grant       none
// @version     1.0
// @author      -
// @description hit / to focus the search box and s to sort item by price / kg
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/487924/Keyboard%20shortcuts%20for%20leclercdrivefr.user.js
// @updateURL https://update.greasyfork.org/scripts/487924/Keyboard%20shortcuts%20for%20leclercdrivefr.meta.js
// ==/UserScript==

VM.shortcut.register('/', () => {
  document.querySelector("#inputWRSL301_rechercheTexte").focus();
});

VM.shortcut.register('s', () => {
  document.querySelector("#divWCRS368_Select > div > div > div:nth-child(4)").click();
});
