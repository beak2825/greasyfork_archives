// ==UserScript==
// @name        cbc382d1
// @namespace   Seyfi.utils
// @description NetMaster CBC-382D1 modem admin ekranı düzenlemesi
// @include     http://192.168.100.1/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14039/cbc382d1.user.js
// @updateURL https://update.greasyfork.org/scripts/14039/cbc382d1.meta.js
// ==/UserScript==

window.onload = null;
document.getElementById('container').style.display = 'block';
if (document.location.href.indexOf('EventLog') != -1)
  return;

var evtLog = document.createElement('li');
evtLog.innerHTML = 
  '<div class="box"><div class="box-outer"><div class="box-inner"><div class="box-final">' +
     '<a href="RgEventLog.asp"><span id="SubMenuLinkEventLog">Event Log</span></a>' +
  '</div></div></div></div>';
document.getElementById('navigation_bar').getElementsByTagName('ul')[0].appendChild(evtLog);
