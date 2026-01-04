// ==UserScript==
// @name        imdb torrent links title
// @namespace   imdb torrent links title
// @description Provides links to popular torrent sites while Browsing IMDB movie\TV-show pages
// @include       *imdb.com*
// @version       1.0
// @grant                          none
// @downloadURL https://update.greasyfork.org/scripts/34670/imdb%20torrent%20links%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/34670/imdb%20torrent%20links%20title.meta.js
// ==/UserScript==
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function getPureTitle(node) {
  text = '';
  for (var i = 0; i < node.childNodes.length; ++i)
  if (node.childNodes[i].nodeType === 3)
        text += node.childNodes[i].textContent;
  return text.trim();
}
function getIdentifier()
{
  var metaTags = document.getElementsByTagName('meta');
  for (var i = 0; i < metaTags.length; ++i) {
        if(metaTags[i].getAttribute('property') === 'pageId')
        return metaTags[i].getAttribute('content');
  }
}

var pageId = getIdentifier();
var titleBar = document.getElementsByClassName('title_wrapper')[0].children[0];
var span = document.createElement("span");
insertAfter(span, titleBar);

var sites = [
  { basePath: "https://www.youtube.com/results?search_query=", icon: 'https://i.imgur.com/YUGI7FI.png', iconHeight: 15, iconWidth: 15, suffix: ' trailer' },
  { basePath: "https://broadcasthe.net/torrents.php?searchstr=", icon: 'https://i.imgur.com//aTT0db5.gif', iconHeight: 16, iconWidth: 16, suffix: '' },
  { basePath: "http://rutracker.org/forum/tracker.php?nm=", icon: 'https://i.imgur.com/TLYukCc.png', iconHeight: 16, iconWidth: 16, suffix: '' },
  { basePath: "https://thepiratebay.org/search/", icon: 'https://i.imgur.com/gbRlct6.png', iconHeight: 16, iconWidth: 16, suffix: '/0/5/0' },
  { basePath: "https://beyondhd.xyz/browse.php?search=", icon: 'http://i.imgur.com/2nJ6Twf.png', iconHeight: 16, iconWidth: 16, suffix: '' },
  { basePath: "http://subscenter.info/he/subtitle/search/?q=", icon: 'http://i.imgur.com/OUpksDT.png', iconHeight: 16, iconWidth: 16, suffix: '' },
  { basePath: "http://hebits.net/browse.php?search=", icon: 'http://i.imgur.com/OaYzlhT.png', iconHeight: 16, iconWidth: 16, suffix: '' },
  { basePath: "https://ncore.cc/torrents.php?miszerint=size&hogyan=DESC&tipus=all_own&mire=", icon: 'http://i.imgur.com/he0tCGp.png', iconHeight: 16, iconWidth: 16, suffix: '' },
];


sites.forEach(function(site) {
  var link = document.createElement("a");
  link.innerHTML = "<img src="+site.icon+" height="+site.iconHeight+" width="+site.iconWidth+">";
  link.setAttribute("target","_blank");
  link.setAttribute("href",site.basePath + encodeURIComponent(getPureTitle(titleBar) + site.suffix

));
  span.appendChild(document.createTextNode(' '));
  span.appendChild(link);
});