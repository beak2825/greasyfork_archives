// ==UserScript==
// @name        imdb torrent links final tt
// @namespace   imdb torrent links final tt
// @description Provides links to popular torrent sites while Browsing IMDB movie\TV-show pages
// @include       *imdb.com*
// @version       1.1
// @grant                          none
// @downloadURL https://update.greasyfork.org/scripts/423979/imdb%20torrent%20links%20final%20tt.user.js
// @updateURL https://update.greasyfork.org/scripts/423979/imdb%20torrent%20links%20final%20tt.meta.js
// ==/UserScript==
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function GetTT()
{
  var metaTags = document.getElementsByTagName('link');
  for (var i = 0; i < metaTags.length; ++i) {
        if(metaTags[i].getAttribute('rel') === 'canonical') {
            return metaTags[i].getAttribute('href').replace("https://www.imdb.com/title/","").replace("/","");
        }
  }
}


function GetFilmName()
{
    return document.querySelectorAll("[class^='TitleHeader'], [class*='TitleHeader]")[0].innerHTML;
}


var ttName = GetTT();
var filmName = GetFilmName();

var titleBar = document.querySelectorAll("div[class^='TitleBlock'], div[class*=' TitleBlock]")[0];

var span = document.createElement("span");
span.id = 'DownloadSites';
insertAfter(span, titleBar);

var TTsites = [
  { basePath: "", icon: 'https://ptpimg.me/y11gdn.png', iconHeight: 17, iconWidth: 17 }, //this is for blank to align the line

  { basePath: "https://passthepopcorn.me/torrents.php?searchstr=", icon: 'https://i.imgur.com/6oVyOyJ.gif', iconHeight: 17, iconWidth: 17 },
  { basePath: "http://www.iptorrents.com/t?o=size;q=", icon: 'http://i.imgur.com/cmbcH7k.png', iconHeight: 16, iconWidth: 16, },
  { basePath: "http://filelist.io/browse.php?cat=0&searchin=0&sort=3&search=", icon: 'http://i.imgur.com/tfnsPEn.jpg', iconHeight: 16, iconWidth: 16, },
  { basePath: "https://hd-torrents.org/torrents.php?&active=0&order=size&search=", icon: 'http://i.imgur.com/iQfuiyn.png', iconHeight: 16, iconWidth: 16, },
];


var filmNameSites = [
    { basePath: "https://www.youtube.com/results?search_query=", icon: 'https://i.imgur.com/YUGI7FI.png', iconHeight: 15, iconWidth: 15, suffix: ' trailer' },
    { basePath: "http://rutracker.org/forum/tracker.php?nm=", icon: 'https://i.imgur.com/TLYukCc.png', iconHeight: 16, iconWidth: 16, suffix: '' },
    { basePath: "https://thepiratebay.org/search/", icon: 'https://i.imgur.com/gbRlct6.png', iconHeight: 16, iconWidth: 16, suffix: '/0/5/0' },
    { basePath: "https://subscene.com/subtitles/searchbytitle?query=", icon: 'https://i.imgur.com/9d6AjB8.png', iconHeight: 16, iconWidth: 16, suffix: '' },
    { basePath: "https://broadcasthe.net/torrents.php?searchstr=", icon: 'https://i.imgur.com//aTT0db5.gif', iconHeight: 16, iconWidth: 16, suffix: '' },
    { basePath: "https://www.ktuvit.me/Search.aspx?q=", icon: 'https://i.imgur.com/mN6ofGN.png', iconHeight: 16, iconWidth: 16, suffix: '' },
];

TTsites.forEach(function(site) {
  var link = document.createElement("a");
  link.innerHTML = "<img src="+site.icon+" height="+site.iconHeight+" width="+site.iconWidth+">";
  link.setAttribute("target","_self"); //_blank
  link.setAttribute("href",site.basePath + ttName);
  span.appendChild(document.createTextNode(' '));
  span.appendChild(link);
});

filmNameSites.forEach(function(site) {
  var link = document.createElement("a");
  link.innerHTML = "<img src="+site.icon+" height="+site.iconHeight+" width="+site.iconWidth+">";
  link.setAttribute("target","_self"); //_blank
  var siteName = String(site.basePath);
  console.log(siteName);
  if (siteName.includes("youtube")) {
      link.setAttribute("href",site.basePath + filmName + ' trailer');
  }
  else {
      link.setAttribute("href",site.basePath + filmName);
  }
  span.appendChild(document.createTextNode(' '));
  span.appendChild(link);
});

