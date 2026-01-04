// ==UserScript==
// @name        Remover Rabbitcast
// @namespace   none
// @description Elimina La rabbitcast
// @include     https://www.rabb.it/*
// @version     3
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/377049/Remover%20Rabbitcast.user.js
// @updateURL https://update.greasyfork.org/scripts/377049/Remover%20Rabbitcast.meta.js
// ==/UserScript==

setTimeout(
  function()
  {
      document.getElementsByClassName('focus')[0].remove()
  }, 60000);