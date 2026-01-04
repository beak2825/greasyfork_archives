// ==UserScript==
// @name        rule34 Deleted Post Restorer
// @namespace   MegaPiggy
// @match       https://rule34.xxx/index.php?page=post&s=view&id=*
// @include     https://rule34.xxx/index.php?page=post&s=view&id=*
// @version     1.0
// @author      MegaPiggy
// @license     MIT
// @description Restore posts that have been deleted.
// @downloadURL https://update.greasyfork.org/scripts/493422/rule34%20Deleted%20Post%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/493422/rule34%20Deleted%20Post%20Restorer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var statusNotice = document.getElementsByClassName("status-notice")[0];
  var deleted = statusNotice.textContent.startsWith("This post was deleted.");
  if (deleted) {
    statusNotice.textContent = statusNotice.textContent.replace("This post was deleted", "This post was restored");
    var originalImage = Array.prototype.slice.call(document.getElementsByTagName("a")).find(d => d.href.startsWith("https://us.rule34.xxx//images/")).href;
    var noteContainer = document.getElementById("note-container");
    var div = document.createElement('div');
    div.style = "margin-bottom: 1em;";
    var p = document.createElement('p');
    p.id = "note-count";
    div.appendChild(p);
    noteContainer.parentElement.insertBefore(div, noteContainer.parentElement.children[3]);
    var img = document.createElement('img');
    img.id = "image";
    img.onclick = "Note.toggle();";
    img.style = "";
    img.src = originalImage;
    noteContainer.parentElement.insertBefore(img, div);
  }
})();
