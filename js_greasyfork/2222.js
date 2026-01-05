// ==UserScript==
// @name        uso-mirror
// @namespace   trespassersW
// @description redirects userscripts.org to userscripts-mirror.org
// @include *
// @exclude http*://www.google.com/reader/*
// @version 1.1.11
// @created 2014-06-07
// @updated 2014-06-08
// @run-at document-start
// @grant GM_none
// @downloadURL https://update.greasyfork.org/scripts/2222/uso-mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/2222/uso-mirror.meta.js
// ==/UserScript==

(function () { "use strict";
var W =  window;
function _log(s){
 //console.log(s);
}
function toObj(s) {
 var r = {}, c = s.split('&'), t;
 for(var i = 0; i < c.length; i++) {
 t = c[i].split('=');
 r[decodeURIComponent(t[0])] = decodeURIComponent(t[1]);
 }
 return r;
}
function anchorMatch(a) {
  for(var k=0; a && k< 5; k++,a=a.parentNode) if(a.localName == 'a') return a;
  return null;
}
var re= /^(http)s?\:\/\/(.*?)\buserscripts\.org(\:8080)?\/(.*)/;
function onDown(e) {
  var h,m, a = anchorMatch(e.target);
  if(a && a.localName == "a"){
    h=a.getAttribute("href");
    if(location.host.indexOf("google")>-1){
      m=a.getAttribute("onmousedown");
      if(m && m.indexOf("return") === 0) { //
        a.removeAttribute("onmousedown");
      }
      if(h) {
         if(h.indexOf("http://") === 0) h = h.substr(h.indexOf("/", 7));
         else if(h.indexOf("https://") === 0) h = h.substr(h.indexOf("/", 8));
         if(h.indexOf("/url?") === 0) {
           _log('spoil '+h);
           h = toObj(h.substr(5));
           a.setAttribute('href', decodeURIComponent(h.url || h.q));
         }
      }   
    }
  
    h=a.getAttribute("href");
    if(!( h && (h=h.match(re)) && h.length==5 )) return;
       h = h[1]+"://userscripts-mirror.org/"+h[4];
       a.setAttribute('href', h);
      _log('USOmirror: '+a.href);
  }
}
 W.addEventListener("mousedown", onDown, true);
 _log('uso-mirror');
})();
