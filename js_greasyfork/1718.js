// ==UserScript==
// @name Last.fm Pirate Search
// @author MadhATTER6
// @description Adds Pirate Bay search links to the buy buttons on Last.FM
// @version 2.2.1
// @match http://last.fm/*
// @match http://www.last.fm/*
// @namespace https://greasyfork.org/users/2237
// @downloadURL https://update.greasyfork.org/scripts/1718/Lastfm%20Pirate%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/1718/Lastfm%20Pirate%20Search.meta.js
// ==/UserScript==

/* new button functions */

function createSearchItem(search){
  li = document.createElement("li");
  a = li.appendChild(document.createElement("a"));
    a.className = "dropdown-btn-menu-item media remove-bottom-margin";
    a.setAttribute("target", "_blank");
    a.setAttribute("href",
                   "http://thepiratebay.se/search/" + search + "/0/99/100");
    span = a.appendChild(document.createElement("span"));
      span.className = "media-body";
      img  = span.appendChild(document.createElement("img"));
        img.setAttribute("src", "http://thepiratebay.se/favicon.ico");
        img.className = 'ecommerce-icon';
    a.appendChild(document.createTextNode(" The Pirate Bay"));
    span = a.appendChild(document.createElement('span'));
      span.className = 'media-pull-right remove-left-margin';
      span.appendChild(document.createTextNode("Search"));
  return li;
}

/* -------------- */

/* get type of page, to know where to look for buttons */

var type; // 0 if 404 error
          // 1 if last.fm/music/{artist}[/+]
          // 2 if last.fm/music/{artist}/{album}[/+]
          // 3 if last.fm/music/{artist}/{album}/{track}[/+]
          // 4 if last.fm/music/{artist}/+albums
          // 4 if last.fm/music/{artist}/{album}/{track}/+albums
          // else 0

var regex_artist        = /^\/music\/(\+noredirect\/)?([^\/\+][^\/]*)(\/\+)?$/;
var regex_album         = /^\/music\/(\+noredirect\/)?([^\/\+][^\/]*)\/([^\/\+][^\/]+)(\/\+)?$/;
var regex_track         = /^\/music\/(\+noredirect\/)?([^\/\+][^\/]*)\/([^\/\+][^\/]*)\/([^\/\+][^\/]*)(\/\+)?$/;
var regex_artist_albums = /^\/music\/(\+noredirect\/)?([^\/\+][^\/]*)\/\+albums$/;
var regex_track_albums  = /^\/music\/(\+noredirect\/)?([^\/\+][^\/]*)\/([^\/\+][^\/]*)\/([^\/\+][^\/]*)\/\+albums$/;

var artist= "";
var album = "";
var track = "";
var matched;
if (document.getElementById("fourOhFour"))
  type = 0;
else if (matched = regex_artist.exec(window.location.pathname))
{ type = 1;
  artist = matched[2];
}
else if (matched = regex_album.exec(window.location.pathname))
{ type = 2;
  artist = matched[2];
  album  = matched[3];
}
else if (matched = regex_track.exec(window.location.pathname))
{ type = 3;
  artist = matched[2];
  album  = matched[3];
  track  = matched[4];
}
else if (matched = regex_artist_albums.exec(window.location.pathname))
{ type = 4;
  artist = matched[2];
}
else if (matched = regex_track_albums.exec(window.location.pathname))
{ type = 4;
  artist = matched[2];
}
else
{ type = 0;
}
artist = artist.replace("+", "%20");
album = album.replace("+", "%20");
track = track.replace("+", "%20");

/* ---------------------- */

if (type > 0)
{ var search;

  // last.fm/music/{artist}
  if (type == 1)
  { search = artist;
  }

  // last.fm/music/{artist}/{album}
  // last.fm/music/{artist}/{album}/{track}
  if (type == 2 || (type == 3 && album != "_"))
  { search = artist + "%20" + album;
  }

  // last.fm/music/{artist}/_/{track}
  if (type == 3 && album == "_")
  { album = document.getElementsByClassName("track-detail")[0]
                    .getElementsByClassName("media-link-reference")[0];
    if (album) search = artist + "%20" + album.innerText;
    else search = artist + "%20" + track;
  }

  // main ecommerce button
  dropdown = document.getElementsByClassName("ecommerce-actions")[0];
  if (dropdown)
  { dropdown = dropdown.getElementsByClassName("dropdown-btn-menu")[0];
    insertBeforeElement =
              dropdown.getElementsByClassName("dropdown-btn-section-title")[1];
    dropdown.insertBefore(createSearchItem(search), insertBeforeElement);
  }

  // secondary ecommerce buttons
  albums = document.getElementsByClassName("album-item");
  for (var i = 0; i < albums.length; i++)
  { album = albums[i];
    meta = album.getElementsByTagName('meta');
    var name;
    for (var j = 0; j < meta.length; j++)
    { if (meta[j].getAttribute('itemprop') == 'name')
      { name = meta[j].getAttribute('content');
        break;
      }
    }
    dropdown = album.getElementsByClassName("dropdown-btn-menu")[0];
    insertBeforeElement =
              dropdown.getElementsByClassName("dropdown-btn-section-title")[1];
    dropdown.insertBefore(createSearchItem(artist + "%20" + name),
                          insertBeforeElement);
  }
}