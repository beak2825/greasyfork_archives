// ==UserScript==
// @name           Bugzilla Atom feed
// @namespace      http://forums.mozillazine.org/memberlist.php?mode=viewprofile&u=261941
// @description    Adds an Atom feed to Bugzilla reports, powered by bugzillatoatom.affine.space
// @version        1.0
// @author         Gingerbread Man
// @include        https://bugzilla.mozilla.org/show_bug.cgi?id=*
// @license        http://creativecommons.org/licenses/by-sa/4.0/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/36382/Bugzilla%20Atom%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/36382/Bugzilla%20Atom%20feed.meta.js
// ==/UserScript==
  
var le = document.createElement("link");
le.rel = "alternate";
le.type ="application/atom+xml";
le.href = "https://bugzillatoatom.affine.space/convert?url="+window.location.href;
document.head.appendChild(le);