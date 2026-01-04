// ==UserScript==
// @name         Torn Old Profile Icons
// @version      2.01
// @description  Replaces the current 'action' icons with the old ones
// @author       tos [1976582] modified and updated by The_SamminAter [2097996]
// @include      https://www.torn.com/profiles.php*
// @match        *torn.com/profiles.php*
// @grant        GM_addStyle
// @run-at       document-end
// @namespace namespace
// @downloadURL https://update.greasyfork.org/scripts/372782/Torn%20Old%20Profile%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/372782/Torn%20Old%20Profile%20Icons.meta.js
// ==/UserScript==

GM_addStyle(`
.profile-button-attack  i.icon {
  background: url(//i.imgur.com/6jOkWuf.png) no-repeat !important;
}
.profile-button-sendMessage  i.icon {
  background: url(//i.imgur.com/13GaBzt.png) no-repeat !important;
}
.profile-button-initiateChat  i.icon {
  background: url(//i.imgur.com/cPsMRjJ.png) no-repeat !important;
}
.profile-button-sendMoney  i.icon {
  background: url(//i.imgur.com/QXTVpln.png) no-repeat !important;
}
.profile-button-initiateTrade  i.icon {
  background: url(//i.imgur.com/BSeaRKf.png) no-repeat !important;
}
.profile-button-placeBounty  i.icon {
  background: url(//i.imgur.com/teWG6AE.png) no-repeat !important;
}
.profile-button-report  i.icon {
  background: url(//i.imgur.com/Iki9Mi7.png) no-repeat !important;
}
.profile-button-addFriend  i.icon {
  background: url(//i.imgur.com/rnoBtbq.png) no-repeat !important;
}
.profile-button-addEnemy  i.icon {
  background: url(//i.imgur.com/dmC741j.png) no-repeat !important;
}
.profile-button-personalStats  i.icon {
  background: url(//i.imgur.com/e0o6G36.png) no-repeat !important;
}
.profile-button-viewBazaar  i.icon {
  background: url(//i.imgur.com/NxbeoZ2.png) no-repeat !important;
}
.profile-button-viewDisplayCabinet  i.icon {
  background: url(//i.imgur.com/RKeNlVA.png) no-repeat !important;
}
.profile-button-revive  i.icon {
  background: url(//i.imgur.com/cqxwGLE.png) no-repeat !important;
}
`)