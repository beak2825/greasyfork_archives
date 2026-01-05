// ==UserScript==
// @name        Star7arab Online Newspaper Read ICON
// @namespace   Star7arab Online Newspaper Read ICON
// @author Mr MoHanD (FB.CoM/DrMoHanD)
// @description the following script adds an Icon so you can read different newspaper provided by star7arab online using google drive pdf reader without downloading them
// @include     http://*.star7arab.com/*?service*
// @include     http://*.star7-dz.info/*?service*
// @version     2.0
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/27644/Star7arab%20Online%20Newspaper%20Read%20ICON.user.js
// @updateURL https://update.greasyfork.org/scripts/27644/Star7arab%20Online%20Newspaper%20Read%20ICON.meta.js
// ==/UserScript==

var icon = 'http://www.star7arab.com/user.asp?id=20985&f=newspaperonline.gif';
$(document).ready(function () {
  $data = $('table tbody tr td.f1 table tbody tr td');
  $.each($data, function (index, val) {
    $tid = $(val).find('a:not(.calameo)').attr('href').match(/\?j=(.+)/);
    $(val).find('img.java').after('<td id="MrMoHanDOnlineIcon"><span style="padding-right: 10px;"><a target="_new" href="https://drive.google.com/viewerng/viewer?url=http://journaux.star7arab.com/' + $tid[1] + '?pid=explorer&efh=false&a=v&chrome=false&embedded=true"><img src="' + icon + '" title="قراءة مباشرة للجرائد بدون تحميل"/></a></span></td>');
  });
});