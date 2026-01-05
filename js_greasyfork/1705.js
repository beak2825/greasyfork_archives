// ==UserScript==
// @name        TV-Muse quicklinks
// @description Adds links to coke&popcorn, fullseries and google video search to tv-muse.
// @include     http://www.tvmuse.eu/tv-shows/*
// @include     http://www.tvmuse.com/tv-shows/*
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/2209
// @downloadURL https://update.greasyfork.org/scripts/1705/TV-Muse%20quicklinks.user.js
// @updateURL https://update.greasyfork.org/scripts/1705/TV-Muse%20quicklinks.meta.js
// ==/UserScript==

// parse tv-muse URL and extract show and episode
var bla = location.href.match(/tv-shows\/([^_]+).*season_(\d+).*episode_(\d+)/);
var show = '';
if(bla[1]==='NCIS') // special case for NCIS
  show = 'NCIS';
else
  show = bla[1].toLowerCase();

  
var site1 = '<a target="_blank" href="http:\/\/www.cokeandpopcorn.ch\/watch-'+show+'-season-'+bla[2]+'-episode-'+bla[3]+'-online.php">Coke & popcorn</a>';

var site2 = '<a target="_blank" href="http:\/\/fullseries.net\/'+bla[1].toLowerCase()+'-season-'+bla[2]+'-episode-'+bla[3]+'">Full Series</a>';
  
var site3 = '<a target="_blank" href="https:\/\/www.google.de\/search?q='+bla[1].replace(/-/g, " ")+' Season '+bla[2]+' Episode '+bla[3]+'&tbm=vid&tbs=dur:l">Google Video</a>';

https://www.google.de/search?q=xxxx&tbm=vid&tbs=dur:l
  
 // Coke&Popcorn
var topLinks;
topLinks = document.createElement('div');
topLinks.innerHTML = '<div style="font-size:28px">' + site1 +' | '+ site2 + ' | '+ site3 + '</div>';
document.body.insertBefore(topLinks, document.body.firstChild);


