// ==UserScript==
// @name         Auto Adult Toranoana
// @version      1.1
// @description  Automatically gives adult permission on Toranoana
// @author       Freed
// @match        https://toranoana.jp/*, https://ec.toranoana.jp/*
// @namespace https://greasyfork.org/users/214730
// @downloadURL https://update.greasyfork.org/scripts/378007/Auto%20Adult%20Toranoana.user.js
// @updateURL https://update.greasyfork.org/scripts/378007/Auto%20Adult%20Toranoana.meta.js
// ==/UserScript==

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var adult = getCookie("adflg");
if (adult != "0") {
  document.cookie = "adflg=0";
    location.reload();
}
