// ==UserScript==
// @name Enhanced FM4 Player
// @namespace https://www.notinventedhere.org
// @match https://fm4.orf.at/player/*
// @grant GM_addStyle
// @version 1.0
// @description Makes all songs in the player visible and clickable.
// @downloadURL https://update.greasyfork.org/scripts/385859/Enhanced%20FM4%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/385859/Enhanced%20FM4%20Player.meta.js
// ==/UserScript==

// Make tracks visible.
GM_addStyle(`
.broadcast-item.is-music {
  top: 0px;
}

.radiothekplayer.fm4 .broadcast-item.is-music:hover .info {
  background-color:rgba(100, 100, 100, 0.9);
}
`);

// Make tricks clickable.
// Note: This apparently breaks if we zoom out and in again with the magnifier
// in the top right corner.
const target = document.querySelector(".broadcast-items");
const observer = new MutationObserver(function (mutationRecords, observer) {
  console.log(mutationRecords);
  for (var mutationRecord of mutationRecords) {
    for (var node of mutationRecord.addedNodes) {
      if (node.childNodes.length == 1) {
        var a = node.childNodes[0];
        if (!a.hasAttribute("href")) {
          var dateStart = new Date(parseInt(node.getAttribute("data-start")));
          var hash = window.location.href.replace("https://fm4.orf.at/player/", "") + "/" + moment(dateStart).format("HHmmssSSS");
          a.href = "https://fm4.orf.at/player/" + hash;
          a.setAttribute("data-internal-hash", hash);
          a.tabindex = -1;
        }
      }
    }
  }
});
observer.observe(target, {childList: true});