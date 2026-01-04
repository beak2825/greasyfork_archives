// ==UserScript==
// @name         PTP expand all torrent metas 3
// @version      0.3
// @description  Expand the torrent metadata (including screenshots) on torrent pages for PTP
// @author       Chameleon
// @include      http*://*passthepopcorn.me/torrents.php?*id=*
// @grant        none
// @namespace    https://greasyfork.org/users/187926
// @downloadURL https://update.greasyfork.org/scripts/368526/PTP%20expand%20all%20torrent%20metas%203.user.js
// @updateURL https://update.greasyfork.org/scripts/368526/PTP%20expand%20all%20torrent%20metas%203.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var t=document.getElementsByClassName('group_torrent_header');
  var groupId=parseInt(window.location.href.split('id=')[1]);
  for(var i=0; i<t.length; i++)
  {
    var id=t[i].id.split('header_')[1];
    $jq('#torrent_'+id).ToggleHC();
    show_description(groupId, id);
  }
})();