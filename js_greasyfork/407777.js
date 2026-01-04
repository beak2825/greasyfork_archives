// ==UserScript==
// @name YouTube: unique playlist items
// @name:hu YouTube: egyedi lejátszási lista elemek
// @description	Makes YouTube playlist items' unique
// @description:hu A Youtube lejátszási lista elemeit egyedivé teszi
// @version 1
// @include https://www.youtube.com/playlist*
// @grant none
// @namespace https://greasyfork.org/users/412587
// @downloadURL https://update.greasyfork.org/scripts/407777/YouTube%3A%20unique%20playlist%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/407777/YouTube%3A%20unique%20playlist%20items.meta.js
// ==/UserScript==
function replaceLinks() {
  let links = document.querySelectorAll('.yt-simple-endpoint');
  for (let link of links) {
    let url = link.getAttribute('href'),
        rgxp = new RegExp('^\/watch\\?v=(.[^&]*)&(.*)$','i');
    if (url !== null)
      link.setAttribute(
        'href',
        url.replace(rgxp,'/watch?v=$1')
      );
  }
}
window.onload = function() {
	replaceLinks();
}
window.onscroll = function() {
	replaceLinks();
}