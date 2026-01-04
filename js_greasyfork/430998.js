// ==UserScript==
// @name     Keul Bookmark
// @version  1
// @grant    none
// @match    *://*/*
// @description un double clic dans le texte sauvegarde la position dans l'URL / Recharger la page la fait défiler sur la position
// @namespace https://greasyfork.org/users/805853
// @downloadURL https://update.greasyfork.org/scripts/430998/Keul%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/430998/Keul%20Bookmark.meta.js
// ==/UserScript==


window.addEventListener("load", load_bookmark);
window.addEventListener("dblclick", save_bookmark);

function save_bookmark() {
  var userSelection = window.getSelection ? window.getSelection() : document.selection.createRange();
  var nodePosition = 0;
  var nodeIterator = document.createNodeIterator(document.body,NodeFilter.SHOW_TEXT);
  while (currentNode = nodeIterator.nextNode()) {
    nodePosition++;
    if(currentNode==userSelection.anchorNode) {
      return window.location.hash = "#bookmark-" + nodePosition + "-" + userSelection.anchorOffset;
    }
  }
}

function load_bookmark() {
  var bookmark=window.location.hash.split("-")
  if(bookmark[0]!='#bookmark' || bookmark.length!=3) return;
  var nodePosition = 0;
  var nodeIterator = document.createNodeIterator(document.body,NodeFilter.SHOW_TEXT);
  while (currentNode = nodeIterator.nextNode()) {
    nodePosition++;
    if(nodePosition == bookmark[1]) {
      var backupNode = currentNode.cloneNode(true);
      var startText = document.createTextNode(currentNode.data.substring(0,bookmark[2]));
      var endText = document.createTextNode(currentNode.data.substring(bookmark[2],currentNode.data.length));
      var bookmarkText = document.createElement("span")
      bookmarkText.setAttribute("style","height:0.7em;display:inline-block;border:2px solid red;");
      var finalNode = document.createElement("span");
      finalNode.appendChild(startText);
      finalNode.appendChild(bookmarkText);
      finalNode.appendChild(endText);
      currentNode.parentNode.replaceChild(finalNode,currentNode);
      bookmarkText.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
      // currentNode.parentNode.replaceChild(backupNode, currentNode); // put old text back after scroll?
      return;
    }
  }
}