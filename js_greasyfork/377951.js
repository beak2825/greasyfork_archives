// ==UserScript==
// @name         Auto Adult Suruga-Ya
// @version      1.0
// @description  Automatically gives adult permission on suruga-ya
// @author       Freed
// @match        https://www.suruga-ya.jp/*
// @namespace https://greasyfork.org/users/214730
// @downloadURL https://update.greasyfork.org/scripts/377951/Auto%20Adult%20Suruga-Ya.user.js
// @updateURL https://update.greasyfork.org/scripts/377951/Auto%20Adult%20Suruga-Ya.meta.js
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

var adult = getCookie("adult");
if (adult != "1") {
  document.cookie = "adult=1";
    location.reload();
}
