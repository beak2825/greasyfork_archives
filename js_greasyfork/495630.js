// ==UserScript==
// @name        Itch.io Visual Novel Remover
// @namespace   Violentmonkey Scripts
// @match       https://itch.io/games/*
// @grant       none
// @version     1.0
// @author      Nebulas
// @description 5/6/2024, 2:48:59 PM
// @downloadURL https://update.greasyfork.org/scripts/495630/Itchio%20Visual%20Novel%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/495630/Itchio%20Visual%20Novel%20Remover.meta.js
// ==/UserScript==

setInterval(()=>{

  var xpath = "//div[text()='Visual Novel']";
  var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if(matchingElement) matchingElement.parentElement.parentElement.remove()
},0)