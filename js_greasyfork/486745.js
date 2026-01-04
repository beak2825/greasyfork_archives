// ==UserScript==
// @name        syosetu.com Remove emphasis dots
// @namespace   Violentmonkey Scripts
// @match       https://novel18.syosetu.com/*
// @match       https://ncode.syosetu.com/*
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     1.0
// @author      -
// @license     GPL-3
// @description 06/02/2024, 20:03:22
// @downloadURL https://update.greasyfork.org/scripts/486745/syosetucom%20Remove%20emphasis%20dots.user.js
// @updateURL https://update.greasyfork.org/scripts/486745/syosetucom%20Remove%20emphasis%20dots.meta.js
// ==/UserScript==
VM.observe(document.body, () => {
  let nodes = document.getElementsByTagName('p');
  for(let node of nodes) {
    if (node.innerHTML.includes('<ruby>')) {
      node.innerHTML = node.innerText.replaceAll('・', '');
    }

  }
  if (nodes.length > 1)
    return true;
})