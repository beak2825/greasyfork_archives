// ==UserScript==
// @name     4Chan cdn change
// @version  1
// @description  Improve 4chan image load performance, by replacing image links from specific servers to CDN
// @author       Dankirk
// @namespace    Dankirk/4cdn
// @grant    none
// @include        https://*.4chan.org/*
// @include        http://*.4chan.org/*
// @include        https://*.4channel.org/*
// @include        http://*.4channel.org/*
// @downloadURL https://update.greasyfork.org/scripts/392822/4Chan%20cdn%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/392822/4Chan%20cdn%20change.meta.js
// ==/UserScript==

var regex = /^(https?:\/\/)[^\.]+\.4chan\.org\/(.+)$/i;

document.querySelectorAll('a.fileThumb').forEach( el => {
  el.href = el.href.replace(regex,"$1i\.4cdn.org\/$2");
});

document.querySelectorAll('.fileText a').forEach( el => {
  el.href = el.href.replace(regex,"$1i\.4cdn.org\/$2");
});