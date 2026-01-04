// ==UserScript==
// @name        Kickass-Magnet-Fix
// @namespace   kickass
// @description Fixes the Kickass Magnet Links
// @include     http*://*kat.*
// @include     http*://*thekat.*
// @include     http*://*katcr.*
// @include     http*://*kickass.*
// @include     https://katcr.co/*
// @include     http://kickasstorrents.video/*
// @include     https://kat.proxybit.loan/*
// @include     https://kickass.cd/*
// @include     https://kickass-cd.pbproxy.red/*
// @include     https://kickass.unblockme.eu/*
// @include     http://kickass.mx/*
// @include     https://kickass.unlockproject.co/*
// @include     https://kickasstorrents.video/*
// @include     https://kat.gameking.pw/*
// @include     https://kat.torrentfeed.pw/*
// @include     https://kat.sitescrack.pw/*
// @include     https://proxyindex.net/*
// @include     https://kickasstorrents.stream/*
// @include     https://unblocktorrent.com/kickass-proxy-unblock/*
// @include     https://kickass.unlockproj.accountant*
// @include     https://kat.am/*
// @include     https://kickass.unlockproj.party/*
// @include     https://dustorrent.com/*
// @include     https://kickass.skillproxy.org/*
// @include     https://kickass.webypass.xyz/*
// @include     http://katproxy.press/*
// @include     https://kickass-cd.pbproxy.red/*
// @include     https://kickass.cm/*
// @include     https://kickasstorrents.pw/*
// @include     https://kickass.unblocked.live/full/*
// @include     http://kickasstorrent.cr/*
// @include     http://dxtorrentx.com/*
// @include     https://kat.host/*
// @include     https://kickass.unlockproj.space/*
// @include     http://katcr.to/*
// @include     https://kickass5-cd.unblocked.lol*
// @include     https://kickass-cd.bypassed.cool/*
// @include     https://kickass2.org/*
// @include     https://kickass.bypassed.plus/*
// @include     https://kickass.unlockproj.review/*
// @include     http://kickasstorrents.to/*
// @include     https://kat.sitescrack.info/*
// @include     https://kickass.skillproxy.org/*
// @include     https://kickass.unblocked.srl/*
// @include     https://kickass.st/*
// @include     https://kickass.unlockproj.faith/*
// @include     https://kat.proxybit.download/*
// @include     https://kickass5-cd.unblocked.lol/*
// @include     https://kickass.unlockproj.loan/*
// @include     https://kickass.ukunblock.pro/*
// @include     https://kattor.xyz/*
// @include     https://kickass.usunblock.space/*
// @include     https://kickass.unlockproj.club/*
// @include     https://kickass.immunicity.cab/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373234/Kickass-Magnet-Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/373234/Kickass-Magnet-Fix.meta.js
// ==/UserScript==

const attributeName = 'href';
const tagName = 'a';
const urlBegin = '?url=';


var elements = document.getElementsByTagName(tagName);
for (var i = 0; i < elements.length; i++) {
  for (var j = 0; j < elements[i].attributes.length; j++) {
    if (elements[i].attributes[j].nodeName == attributeName) {
        if (elements[i].attributes[j].textContent.indexOf(urlBegin) != - 1) {
         elements[i].attributes[j].textContent = decodeURIComponent(elements[i].attributes[j].textContent.replace(elements[i].attributes[j].textContent.substring(0,elements[i].attributes[j].textContent.indexOf(urlBegin)+urlBegin.length), ''));
      }
    }
  }
}