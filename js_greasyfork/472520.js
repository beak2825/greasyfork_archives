// ==UserScript==
// @name         Platformre+
// @namespace    https://sheeptester.github.io/platformre
// @version      0.1
// @description  Adds some small changes to Platformre.
// @author       ToasterPanic
// @match        https://sheeptester.github.io/platformre*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sheeptester.github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472520/Platformre%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/472520/Platformre%2B.meta.js
// ==/UserScript==
(function() {
  // This part expands inputs to make them bigger.
  var style = document.createElement("STYLE");
  style.innerHTML = `.newtext input{ width: 100%; }`;

  document.body.appendChild(style);

  // This part of the script adds the BBCode support to text blocks.
  message = document.getElementById('message');

  observer = new MutationObserver(function(mutationsList, observer) {
    if (message.innerText.startsWith("p+: ")) {
      message.innerHTML = message.innerHTML.slice(4)
        .replace(/\[nl\]/g, "<br>")
        .replace(/\[b\](.*?)\[\/b\](?!\[\/b\])/g, "<b>$1</b>")
        .replace(/\[i\](.*?)\[\/i\](?!\[\/i\])/g, "<i>$1</i>")
        .replace(/\[u\](.*?)\[\/i\](?!\[\/i\])/g, "<u>$1</u>")
        .replace(/\[s\](.*?)\[\/s\](?!\[\/s\])/g, "<s>$1</s>")
        .replace(/\[small\](.*?)\[\/small\](?!\[\/small\])/g, "<small style=\"font-size: 16px;\">$1</small>")
        .replace(/\[color=#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\](.*?)\[\/color\](?!\[\/color(=#[0-9a-fA-F]{3,6}){0,1}\])/g, "<plus-color style=\"color: #$1\">$2</plus-color>")
    }
  });

  observer.observe(message, {
    characterData: false,
    childList: true,
    attributes: false
  });
})();