// ==UserScript==
// @name        WMP plugin force
// @namespace   moooka
// @author      moooka
// @include     *.*
// @version     1.0
// @grant       none
// @description Force windows media player instead of vlc plugin for embedded videos.
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/18054/WMP%20plugin%20force.user.js
// @updateURL https://update.greasyfork.org/scripts/18054/WMP%20plugin%20force.meta.js
// ==/UserScript==
var nodeList = document.querySelectorAll('embed');
[
].forEach.call (nodeList, function (node) {
  var mimeType = node.getAttribute ('type');
  if (mimeType == 'application/x-mplayer2' ||
  mimeType == 'video/x-ms-wm' ||
  mimeType == 'video/x-ms-wmv' ||
  mimeType == 'video/x-ms-wvx' ||
  mimeType == 'video/x-ms-asf-plugin' ||
  mimeType == 'video/x-ms-asf') {
    node.setAttribute ('type', 'application/x-ms-wmp');
    var parent = node.parentNode;
    var content = parent.innerHTML;
    parent.innerHTML = content;
  }
});
