// ==UserScript==
// @name        Youtube Embed NoCookie
// @namespace   s
// @description Change any embedded youtube videos with the no-cookie version
// @include     *
// @exclude     https://www.youtube.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/418516/Youtube%20Embed%20NoCookie.user.js
// @updateURL https://update.greasyfork.org/scripts/418516/Youtube%20Embed%20NoCookie.meta.js
// ==/UserScript==
function func(item) {
  src = item.getAttribute('src');
  fixed = src.replace(/youtube.com\/embed/, 'youtube-nocookie.com/embed');
  if (src != fixed) {
    item.setAttribute('src', fixed);
  }
}
function updateiframes(m) {
  iframes = document.getElementsByTagName('iframe');
  for (var i = 0; i < iframes.length; i = i + 1) func(iframes[i]);
}

// Observe mutations
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
if (MutationObserver) {
  var body = document.getElementsByTagName('body') [0];
  var mutationObserver = new MutationObserver(updateiframes);
  mutationObserver.observe(body, {
    childList: true,
    subtree: true
  });
}

updateiframes(0);
