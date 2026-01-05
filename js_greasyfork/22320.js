// ==UserScript==
// @name        phtest
// @namespace   https://sleazyfork.org/fr/users/60332-maxime
// @include     http://www.pornhub.com/*
// @description for videos issues on slow devices
// @version     1
// @grant       GM_openInTab
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/22320/phtest.user.js
// @updateURL https://update.greasyfork.org/scripts/22320/phtest.meta.js
// ==/UserScript==
$(document).delegate("*","click",function(){
  var link = $(this).attr('href');
  //alert(link);
  if (link.indexOf("view_video.php?viewkey=") >= 0) {
    var regex = /view_video\.php\?viewkey=/;
    link = link.replace(regex, "embed/");
    GM_openInTab (link);
    return false;
  } 
});