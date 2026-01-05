// ==UserScript==
// @name        Redirecting WoS Images cgi
// @namespace   Timmy First Ever Script
// @description Redirects images of Infoseek to meulie.net, a mirror site
// @include     http://www.worldofspectrum.org/infoseek.cgi*
// @include     http://www.worldofspectrum.org/infoseekadv.cgi*
// @include     http://www.worldofspectrum.org/infoseekid.cgi*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10212/Redirecting%20WoS%20Images%20cgi.user.js
// @updateURL https://update.greasyfork.org/scripts/10212/Redirecting%20WoS%20Images%20cgi.meta.js
// ==/UserScript==

// This fetches all of the <img> tags and stores them in "tags".
var tags = document.getElementsByTagName('img');
// This loops over all of the <img> tags.
for (var i = 0; i < tags.length; i++) {

  // This replaces the src attribute of the tag with the modified one
  tags[i].src = tags[i].src.replace('www.worldofspectrum.org/showscreen.cgi?screen=screens/', 
                                    'wos.meulie.net/pub/sinclair/screens/');
  tags[i].src = tags[i].src.replace('www.worldofspectrum.org/showscreen.cgi?screen=/screens/', 
                                    'wos.meulie.net/pub/sinclair/screens/');
}

// This fetches all of the <img> tags and stores them in "tags".
var links = document.getElementsByTagName('a');
// This loops over all of the <a> tags.
for (var i = 0; i < links.length; i++) {

  // This replaces the src attribute of the tag with the modified one
  links[i].href = links[i].href.replace('www.worldofspectrum.org/showmag.cgi?mag=', 
                                    'wos.meulie.net/pub/sinclair/magazines/');
}
