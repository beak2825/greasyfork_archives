// ==UserScript==
// @name          zapIframesProp
// @description   zap all iframes Properties
// @include *
// @include https://*
// @include http://*
// @namespace     https://greasyfork.org/en/users/3561-lucianolll
// @namespace     https://openuserjs.org/users/lucianolll
// @namespace     http://userscripts-mirror.org/users/46776
// @version    8
// @grant     none
// @author lucianolll
// @downloadURL https://update.greasyfork.org/scripts/3778/zapIframesProp.user.js
// @updateURL https://update.greasyfork.org/scripts/3778/zapIframesProp.meta.js
// ==/UserScript==
var zapifrprp=function(){
	var doc=document,ifra=doc.getElementsByTagName('iframe'),ln=ifra.length;
  if(ln!==0){
  var frm=function(f){var m,mds=function(d){m=f[d];return [m,m.parentNode];};return function(d){return mds(d);};}(ifra);
    for(var i=ln,j=0,tm=[];i--;j++){tm[j]=frm(i);}
	tm.forEach(function(v){v[1].removeChild(v[0]);});
  }
};
    addEventListener('load',zapifrprp,false);