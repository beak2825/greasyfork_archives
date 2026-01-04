// ==UserScript==
// @name        Streamable Video Download Linker
// @namespace   http://ojighwr2reg46.co
// @include     https://streamable.com/*
// @include     https://*.streamable.com/*
// @version     1
// @description     This script will popup a javascript alert with the streamable video download link when visiting a streamable.com video.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/415791/Streamable%20Video%20Download%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/415791/Streamable%20Video%20Download%20Linker.meta.js
// ==/UserScript==

var S = document.getElementsByTagName("script");
for (var x=0; x<S.length; x++) {
  if (S[x].getAttribute("id")) {
  if (S[x].getAttribute("id").match(/player\-js/) || S[x].getAttribute("id").match(/embed\-js/)) {
    var tc = S[x].textContent.toString();
    if (tc.length>1) {
      var js = tc.split("var videoObject = {")[1].split('"files": ')[1].split("}},")[0] + "}}";
      var json = eval(JSON.parse(js));
      var Dlink = "https:"+json.mp4.url;
      alert(Dlink);
      break;
    }
  }}
}