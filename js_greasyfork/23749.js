// ==UserScript==
// @name        Lyon Intranet
// @namespace   intra.epitech.eu/planning/
// @description Cliquer pour avoir Lyon...
// @include     https://intra.epitech.eu/planning/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23749/Lyon%20Intranet.user.js
// @updateURL https://update.greasyfork.org/scripts/23749/Lyon%20Intranet.meta.js
// ==/UserScript==

window.setTimeout(function() {
  document.querySelector('.country').children[1].children[0].children[1].click();  
}, 3000);
