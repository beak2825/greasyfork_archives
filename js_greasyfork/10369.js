// ==UserScript==
// @name         8chan mod view toggle
// @description  slurp slurp slurp
// @author       slurp slurp slurp
// @match        *://8ch.net/*
// @match        *://8chan.co/*
// @grant        none
// @version 0.0.1.20150611020908
// @namespace https://greasyfork.org/users/12245
// @downloadURL https://update.greasyfork.org/scripts/10369/8chan%20mod%20view%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/10369/8chan%20mod%20view%20toggle.meta.js
// ==/UserScript==

if(location.toString().indexOf("mod.php") != -1) {
  $(".boardlist").after (
    '<a href="#" id="leaveMod" style="position: fixed; right: 1em; z-index: 999; top: 2.2em;">Leave Mod View</a>'
  );
} else {
  $(".boardlist").after (
    '<a href="#" id="enterMod" style="position: fixed; right: 1em; z-index: 999; top: 2.2em;">Enter Mod View</a>'
  );
}

$(document).on("click", "#leaveMod", function(){
  location = location.href.replace("/mod.php?", "");
});

$(document).on("click", "#enterMod", function(){
  var tld = ".net";
  if(location.href.indexOf(".co") != -1) {
    tld = ".co";
  }
  location = location.href.replace(tld, tld + "/mod.php?");
});
