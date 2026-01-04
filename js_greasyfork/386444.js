// ==UserScript==
// @name         Linkify Plain Text URLs
// @version      1.0.2
// @author       salad: https://greasyfork.org/en/users/241444-salad
// @description  Turn plain text URLs into clickable links
// @namespace    https://greasyfork.org/users/241444
// @include      *
// @run-at       document-idle
// @grant        GM.registerMenuCommand
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/386444/Linkify%20Plain%20Text%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/386444/Linkify%20Plain%20Text%20URLs.meta.js
// ==/UserScript==

/* dunno who wrote this. I just converted a bookmarklet to a userscript. */

(function () {

  function linkifyPlainText() {

    document.body.normalize();

    function linkifyNode(n) {
      var M, R, currentNode;
      if (n.nodeType == 3) {
        const urlPosition = n.data.search(/https?:\/\/[^\s]*/);

        if (urlPosition < 0) return;

        M = n.splitText(urlPosition);
        R = M.splitText(RegExp.lastMatch.length);
        const linkTag = document.createElement("A");
        linkTag.href = M.data;
        linkTag.appendChild(M);
        R.parentNode.insertBefore(linkTag, R);

      } else if (n.tagName != "STYLE" && n.tagName != "SCRIPT" && n.tagName != "A")

      for (let i = 0; currentNode = n.childNodes[i]; ++i) {
        linkifyNode(currentNode);
      }
    }

    linkifyNode(document.body);

  }

  GM.registerMenuCommand('Linkify Plain Text URLs', linkifyPlainText);

})();
