// ==UserScript==
// @name         PTP Reported trumpable/dupe to yellow
// @version      0.1
// @description  Change the colour of the 'Reported' text for torrents reported for trumpable/dupe to the Trumpable colour
// @author       Chameleon
// @include      http*://passthepopcorn.me/torrents.php?id=*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/31229/PTP%20Reported%20trumpabledupe%20to%20yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/31229/PTP%20Reported%20trumpabledupe%20to%20yellow.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var reported=document.getElementsByClassName('torrent-info__reported');
  for(var i=0; i<reported.length; i++)
  {
    var r=reported[i];
    var id=r.parentNode.parentNode.parentNode.id.split('header_')[1];
    var report=document.getElementById('reported_'+id);
    if(report.textContent.indexOf("Trumpable") != -1 || report.textContent.indexOf("Dupe") != -1)
      r.setAttribute('class', 'torrent-info__trumpable');
  }
})();