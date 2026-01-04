// ==UserScript==
// @name         USO - Force site's classic design
// @namespace    https://github.com/Procyon-b
// @version      0.1
// @description  Forces userstyles.org to display the pages using the old design
// @author       Achernar
// @match        https://userstyles.org/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/460633/USO%20-%20Force%20site%27s%20classic%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/460633/USO%20-%20Force%20site%27s%20classic%20design.meta.js
// ==/UserScript==

(function() {
"use strict";

function getCookies() {
  var r={}, a=document.cookie;
  a.split(';').forEach(function(e){
    var p=e.split('=');
    if (p[0]) r[p.shift().trim()]=p.join('=');
    });
  return r;
  }

var cookies=getCookies();

// ignore if already tried < 1min ago
if (cookies.s) return;

if (cookies.split_test_version == 'nextjs') {
  document.cookie='split_test_version=app50; ;path=/;secure;expires='+(new Date(Date.now()+1000*60*60*24*30*4)).toUTCString()+';';
  // safeguard for 1 min
  document.cookie='s=_; ;path=/;secure;expires='+(new Date(Date.now()+1000*60)).toUTCString()+';';
  location.href=location.href;
  }


})();