// ==UserScript==
// @name        Flash Header Replacement
// @namespace   Flash Header Replacement
// @description Remove Star7arab default swf logo then replace it with a normal png logo
// @exclude     http://*.star7arab.com/*?edit=*
// @exclude     http://*.star7-dz.com/*?edit=*
// @exclude     http://*.star7-dz.info/*?edit=*
// @include     http://*.star7arab.com/*
// @include     http://*.star7-dz.com/*
// @include     http://*.star7-dz.info/*
// @version     3
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/28966/Flash%20Header%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/28966/Flash%20Header%20Replacement.meta.js
// ==/UserScript==

var NewLogo = 'http://www.star7arab.com/user.asp?id=20985&f=header_logo.png';
var element = document.getElementsByTagName("embed");
$data = $('center');
$.each($data, function (index, val) {
   $(val).find('embed').after('<img src="' + NewLogo + '" />');
});
element[0].parentNode.removeChild(element[0]);