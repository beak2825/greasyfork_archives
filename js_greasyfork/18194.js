// ==UserScript==
// @name           Nabb's Func Func Framework *OLD*
// @namespace      http://nabb.trap17.com
// @description    Required for some of Nabb's Kongregate scripts (on Chrome)
// @include        http://www.kongregate.com/*
// @version 0.0.1.20160322224100
// @downloadURL https://update.greasyfork.org/scripts/18194/Nabb%27s%20Func%20Func%20Framework%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/18194/Nabb%27s%20Func%20Func%20Framework%20%2AOLD%2A.meta.js
// ==/UserScript==

// Nabb, 15th May 2009: nabb.trap17.com

// This script is required for some of my scripts.

setTimeout("nF=function(a){b=a.split(\".\");d=window;for(c=0;c<b.length-1;){d=d[b[c++]]}return[d,b[c]]};nFR=function(a){return a.substring(a.indexOf('(')+1,a.indexOf(')'))};nFA=function(a,x,y){b=nF(a);c=b[0][b[1]].toString();b[0][b[1]]=new Function(nFR(c),(x?x:'')+';'+c.substring(c.indexOf('{')+1,c.length-1)+';'+(y?y:''))};nFE=function(a,s,r){b=nF(a);c=b[0][b[1]].toString();b[0][b[1]]=new Function(nFR(c),(c.substring(c.indexOf('{')+1,c.length-1)).replace(s,r))}",0)
