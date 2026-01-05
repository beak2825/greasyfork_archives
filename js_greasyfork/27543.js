// ==UserScript==
// @name          RED Dynamic Range DB Lookup
// @description   Searches the dynamic range DB for an artist / album
// @version       3.1
// @author        phracker <phracker@bk.ru>, ruff_wizard, munch, amohongos
// @namespace     https://greasyfork.org/users/2201
// @grant         none
//
// @include       http*://*redacted.sh/torrents.php?id=*
// @include       http*://*redacted.sh/artist.php?id=*
// @include       http*://redacted.sh/torrents.php?page=*&id=*#comments
// @downloadURL https://update.greasyfork.org/scripts/27543/RED%20Dynamic%20Range%20DB%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/27543/RED%20Dynamic%20Range%20DB%20Lookup.meta.js
// ==/UserScript==

(function() {
  if(document.URL.search('torrents.php') != -1) {  
    var artist = document.getElementsByClassName('header').item(0).getElementsByTagName('h2').item(0).getElementsByTagName('a').item(0).textContent.trim();
    var album = document.getElementsByClassName('header').item(0).getElementsByTagName('h2').item(0).getElementsByTagName('span').item(0).textContent.trim();
    var a = document.createElement('a');
    var linkurl = "http://dr.loudness-war.info/album/list?artist=" + encodeURIComponent(artist) + "&album=" + encodeURIComponent(album);
    a.href = linkurl;
    a.target = "_blank";
    a.innerText = "DR Database";
    a.className = "brackets";
    document.getElementsByClassName('header').item(0).getElementsByClassName('linkbox').item(0).appendChild(a);
  } else {
    var artist = document.getElementsByClassName('header').item(0).getElementsByTagName('h2').item(0).textContent.trim();
    var a = document.createElement('a');
    var linkurl = "http://dr.loudness-war.info/album/list?artist=" + encodeURIComponent(artist);
    a.href = linkurl;
    a.target = "_blank";
    a.textContent = "DR Database";
    a.className = "brackets";
    document.getElementsByClassName('header').item(0).getElementsByClassName('linkbox').item(0).appendChild(a);
    var albumlist = document.getElementById('discog_table').getElementsByClassName('group_info');
    for(var x = 0; x < albumlist.length; x++){ 
        var albumx = albumlist.item(x).getElementsByTagName('a').item(0).textContent.trim();
        var albumxlink = document.createElement('a');
      	albumxlink.innerHTML = "<img src='https://ptpimg.me/wdl9k4.png' style='border:none !important; height:6px;'/> DR";
      	albumxlink.target = "_blank";
	    albumxlink.setAttribute('style','margin-left: 1em; font-size: 6pt');
    	albumxlink.href = "http://dr.loudness-war.info/album/list?artist=&album=" + encodeURIComponent(albumx);
    	albumlist[x].getElementsByTagName('strong')[0].appendChild(albumxlink);
  	}
  }
}
)();