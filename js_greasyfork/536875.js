// ==UserScript==
// @name        Trello Font Customizer
// @namespace   Violentmonkey Scripts
// @match       https://trello.com/b/g6HLmRf4/%E6%97%A5%E5%B8%B8*
// @grant       GM_addStyle
// @version     1.1
// @author      zer0
// @description Customizes fonts on Trello boards (changes to PlemolJP font family)
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/536875/Trello%20Font%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/536875/Trello%20Font%20Customizer.meta.js
// ==/UserScript==

GM_addStyle(`
  :root {
    --ds-font-body: 'PlemolJP', -apple-system, sans-serif;
  }

  body, .list-card-title {
    font-family: 'PlemolJP', -apple-system, sans-serif !important;
  }
`);