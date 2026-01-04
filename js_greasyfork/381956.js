// ==UserScript==
// @name        Voat Post Filterer
// @namespace   http://vvvvvvooooooaaaaattttt.co
// @description Filter Voat Posts By Username
// @include     https://*.voat.co/*
// @include     https://voat.co/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/381956/Voat%20Post%20Filterer.user.js
// @updateURL https://update.greasyfork.org/scripts/381956/Voat%20Post%20Filterer.meta.js
// ==/UserScript==

var blockedUsers = new Array("gabara", "JesustheChrist666");
var blockedDomains = new Array("babylonbee.com", "snopes.com");

var divas, name, aa;
var divs = document.getElementsByTagName("div");
for (var a=0; a<divs.length; a++) {
  bb = divs[a].getAttribute("class");
  if (bb!=null && bb.indexOf("submission")!=-1) {
  
  // Users
  divas = divs[a].getElementsByTagName("a");
  for (var b=0; b<divas.length; b++) {
    name = "";
    aa = divas[b].getAttribute("class");
    if (aa!=null && aa.indexOf("author")!=-1) {
     name = divas[b].getAttribute("data-username");
     if (blockedUsers.indexOf(name)!=-1) {
        divs[a].setAttribute("style", "display:none!important; visibility:hidden!important;");
        break;
      }
    }
  }
  
  // Domains
  var spans = divs[a].getElementsByTagName("span");
  for (var bb=0; bb<spans.length; bb++) {
    var sa = spans[bb].getAttribute("class");
    if (sa!=null && sa.indexOf("domain")!=-1) {
      var dom = spans[bb].getElementsByTagName("a")[0].getAttribute("href");
      var d = dom.split("/");
      if (blockedDomains.indexOf(dom)!=-1 || blockedDomains.indexOf(d[d.length-1])!=-1) {
        divs[a].setAttribute("style", "display:none!important; visibility:hidden!important;");
        break;
      }
    }
  }
 }
}