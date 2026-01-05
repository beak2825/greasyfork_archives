// ==UserScript==
// @name        BiggerGocomics
// @namespace   https://github.com/Lorentz83/
// @description Changes the page to display directly the bigger version of the comic
// @include     http://www.gocomics.com/*
// @icon        https://raw.githubusercontent.com/Lorentz83/userscripts/master/BiggerGocomics/icon.png
// @version     0.9a
// @grant       none
// @license     GPLv2; http://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/16045/BiggerGocomics.user.js
// @updateURL https://update.greasyfork.org/scripts/16045/BiggerGocomics.meta.js
// ==/UserScript==

var photo = document.querySelector('#content a.photo');
if ( photo !== null ) {
  var id = photo.hash;
  var bigPhoto = document.querySelector(id);

  photo.style.display = 'none';
  bigPhoto.style.display = 'block';
  bigPhoto.id = 'not-an-id';

  document.querySelector('#content').style.width = '100%';
  document.querySelector('#content .feature').style.width = '100%';
}
