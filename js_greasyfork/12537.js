// ==UserScript==
// @name          Arena Vision Agenda in Local Time
// @description Converts the times in the Arena Vision agenda to user's local timezone.
// @include       http://www.arenavision.in/agenda*
// @copyright     Akashi
// @version       1.0.2
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @namespace https://greasyfork.org/users/15887
// @downloadURL https://update.greasyfork.org/scripts/12537/Arena%20Vision%20Agenda%20in%20Local%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/12537/Arena%20Vision%20Agenda%20in%20Local%20Time.meta.js
// ==/UserScript==

var el = jQuery('.field-item.even p') ;


el[1].innerHTML = el[1].innerHTML.replace(/\d\d\/\d\d\/\d\d \d\d:\d\d CET/g, function(r) {
  var spacesplit = r.split(' ');
  var s = spacesplit[0].split('/');
  var time = spacesplit[1];
  var t =time.split(":");
  var utcDate = Date.UTC("20" + s[2], s[1] - 1, s[0], t[0] - 2, t[1]);
  var d = new Date(utcDate);
  return d.toLocaleString();
});

el[0].innerHTML = el[0].innerHTML.replace("**CET Time - UTC +0100 (Madrid, París, Bruselas)", "**");