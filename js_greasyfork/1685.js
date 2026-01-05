// ==UserScript==
// @name         Wikipedia / What.CD Search
// @version      1.4
// @description  Adds a what.cd search link to the Wikipedia pages of Albums or Artists.
// @match        http*://*wikipedia.org/*
// @namespace    https://greasyfork.org/users/2201
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/1685/Wikipedia%20%20WhatCD%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/1685/Wikipedia%20%20WhatCD%20Search.meta.js
// ==/UserScript==

if(!document.getElementsByClassName('album').length){
  var summary = document.getElementsByClassName('fn')[0];
  var wcdlink="https://what.cd/torrents.php?action=basic&artistname=";
  var s = summary.textContent;
  wcdlink += encodeURI(s) + "&tags_type=1&order_by=time&order_way=desc&group_results=1&action=advanced&searchsubmit=1";
  var a = document.createElement('a');
  a.href = wcdlink;
  a.innerHTML = "<img style='margin-left:5px' src='https://what.cd/favicon.ico'>";
  summary.appendChild(a);
} else {
  var summary = document.getElementsByClassName('summary')[0];
  var wcdlink="https://what.cd/torrents.php?action=advanced&groupname="
  var s = summary.textContent;
  wcdlink += s;
  wcdlink += "&artistname=" + document.getElementsByClassName('contributor')[0].textContent;
  wcdlink = encodeURIComponent(wcdlink);
  wcdlink += "&recordlabel=&cataloguenumber=&year=&remastertitle=&remasteryear=&remasterrecordlabel=&remastercataloguenumber=&filelist=&encoding=&format=&media=&releasetype=&haslog=&hascue=&scene=&vanityhouse=&freetorrent=&searchstr=&taglist=&tags_type=1&order_by=time&order_way=desc&group_results=1&action=advanced&searchsubmit=1&setdefault=Make+default"
  var a = document.createElement('a');
  a.href = wcdlink;
  a.innerHTML = "<img style='margin-left:5px' src='https://what.cd/favicon.ico'>";
  summary.appendChild(a);
}