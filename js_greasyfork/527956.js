// ==UserScript==
// @name        no games in netflix
// @namespace   Violentmonkey Scripts
// @match       https://www.netflix.com/*
// @match        https://netflix.com/*
// @grant       none
// @version     1.0.1
// @author      -
// @description 12/02/2025, 01:18:06
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/527956/no%20games%20in%20netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/527956/no%20games%20in%20netflix.meta.js
// ==/UserScript==



VM.observe(document.body, () => {   removeGameBillBoard();   });

function removeGameBillBoard(){
  // Find the target node
  const node = $("div.billboard-row-games");

  if (node.length) {
    $("div.billboard-row-games").parent().hide();
    $("div.billboard-row-games").hide();
    $("div.mobile-games-row").remove();

    // disconnect observer  //do not disconnect so that it keeps observing
    // return true;
  }
}

