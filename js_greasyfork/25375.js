// ==UserScript==
// @name        RED Record label search links
// @namespace   https://greasyfork.org/en/users/14892
// @description Makes record labels on PTH artist, torrent, collages, bookmarks, and search pages hyperlinks to search the record label
//
// @include     https://redacted.ch/torrents.php*
// @include     https://redacted.ch/artist.php*
// @include     https://redacted.ch/collages.php*
// @include     https://redacted.ch/bookmarks.php*
//
// @version     1.16
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25375/RED%20Record%20label%20search%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/25375/RED%20Record%20label%20search%20links.meta.js
// ==/UserScript==
var els=document.getElementsByClassName('edition_info'),es,text,text2;
[].forEach.call(els,function(e,i,a){
  es=e.firstChild;
  text=es.childNodes[1].textContent.split(' / ');
  if(text.length >= 3){
    if(text[0].indexOf(' - ') != -1){
      text2 = text[0].split(' - ');
      text2[1] = '<a href="torrents.php?recordlabel='+encodeURIComponent(text2[1]) +'" style="width: unset; float: none;"><b>'+text2[1]+'</b></a>';
      text[0] = text2.join(' - ');
    }
    text[1]='<a href="torrents.php?recordlabel='+encodeURIComponent(text[1]) +'" style="width: unset; float: none;"><b>'+text[1]+'</b></a>';
    es.innerHTML=es.firstChild.outerHTML+text.join(' / ');
  }
});