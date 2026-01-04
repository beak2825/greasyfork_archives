// ==UserScript==
// @name        imdb torrent links tt
// @namespace   imdb torrent links tt
// @description Provides links to popular torrent sites while Browsing IMDB movie\TV-show pages
// @include       *imdb.com*
// @version       1.0
// @grant                          none
// @downloadURL https://update.greasyfork.org/scripts/34669/imdb%20torrent%20links%20tt.user.js
// @updateURL https://update.greasyfork.org/scripts/34669/imdb%20torrent%20links%20tt.meta.js
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
  { basePath: "https://passthepopcorn.me/torrents.php?searchstr=", icon: 'https://i.imgur.com/6oVyOyJ.gif', iconHeight: 17, iconWidth: 17 },
  { basePath: "http://www.iptorrents.com/t?o=size;q=", icon: 'http://i.imgur.com/cmbcH7k.png', iconHeight: 16, iconWidth: 16, },
  { basePath: "http://filelist.ro/browse.php?cat=0&searchin=0&sort=3&search=", icon: 'http://i.imgur.com/tfnsPEn.jpg', iconHeight: 16, iconWidth: 16, },
  { basePath: "https://hd-torrents.org/torrents.php?&order=size&search=", icon: 'http://i.imgur.com/iQfuiyn.png', iconHeight: 16, iconWidth: 16, },
  { basePath: "https://www.fuzer.me/browse.php?ref_=basic&query=", icon: 'https://i.imgur.com/NDcWOfZ.png', iconHeight: 15, iconWidth: 15, },
];


sites.forEach(function(site) {
  var link = document.createElement("a");
  link.innerHTML = "<img src="+site.icon+" height="+site.iconHeight+" width="+site.iconWidth+">";
  link.setAttribute("target","_blank");
  link.setAttribute("href",site.basePath + pageId

);
  span.appendChild(document.createTextNode(' '));
  span.appendChild(link);
});