// ==UserScript==
// @name           Trakt TPB Link
// @namespace      https://greasyfork.org/en/users/7864-curtis-gibby
// @description    Add link on Trakt movie pages to search that title on The Pirate Bay
// @version  1.0.1
// @grant    none
// @include        https://trakt.tv/shows/*
// @include        https://trakt.tv/movies/*
// @downloadURL https://update.greasyfork.org/scripts/37073/Trakt%20TPB%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/37073/Trakt%20TPB%20Link.meta.js
// ==/UserScript==

imdbLink = document.querySelectorAll("a[href^='http://www.imdb.com']")[0];

var newLink = imdbLink.cloneNode(true);

newLink.href = 'https://thepiratebay.org/search/' + imdbLink.href.match('tt[0-9]+');
newLink.innerHTML = 'TPB';

imdbLink.parentNode.appendChild(newLink);