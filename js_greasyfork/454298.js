// ==UserScript==
// @name        Collapse WebWhatsapp - whatsapp.com
// @namespace   Violentmonkey Scripts
// @match       https://web.whatsapp.com/
// @grant       none
// @version     1.1
// @author      Luca Frigenti
// @description 05/11/2022, 12:39:09
// @license MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/454298/Collapse%20WebWhatsapp%20-%20whatsappcom.user.js
// @updateURL https://update.greasyfork.org/scripts/454298/Collapse%20WebWhatsapp%20-%20whatsappcom.meta.js
// ==/UserScript==

const disconnect = VM.observe(document.body, () => {
  let collapsed = false;
  let _button = document.createElement("button");
  _button.data = "hi";
  _button.innerHTML = "Chiudi";
  _button.onclick = ok;
  _button.setAttribute(
    "style",
    "padding: 3px; margin: 10px; background-color: #f0f2f5; border-radius: 25px; min-width: 60px;"
  );

  document.getElementById("pane-side").prepend(_button);

  function ok() {
    if (collapsed) {
      document
        .getElementById("side")
        .parentElement.setAttribute("style", "width: 750px");
      _button.innerHTML = "Chiudi";
    } else {
      document
        .getElementById("side")
        .parentElement.setAttribute("style", "width: 75px; flex: none;");
      _button.innerHTML = "Apri";
    }
    collapsed = !collapsed;
  }
  disconnect();
});
