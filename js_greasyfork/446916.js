// ==UserScript==
// @name        Hide q-dance chat
// @description Hides the chat on Q-dance livestreams
// @namespace   hide-qdance-chat
// @license     MIT
// @version     2
// @grant       none
// @match       https://library.q-dance.com/network/live/*
// @match       https://www.q-dance.com/network/live/*
// @match       https://live.q-dance.com/*
// @downloadURL https://update.greasyfork.org/scripts/446916/Hide%20q-dance%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/446916/Hide%20q-dance%20chat.meta.js
// ==/UserScript==

function hide()
{
  let sc = document.getElementById("scrollContainer");
  if (sc.classList.contains("col-l--9")) {
    sc.classList.remove("col-l--9");
    sc.classList.remove("col-m--8");
    sc.classList.add("col-l--12");
    sc.classList.remove("col-m--12");
  }
}

setInterval(hide, 250);
hide();
