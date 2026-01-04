// ==UserScript==
// @name 4chan iframe remover
// @description Remove iframes from 4chan
// @author Xyl
// @match *://*.4chan.org/*
// @match *://*.4channel.org/*
// @grant GM_xmlhttpRequest
// @connect sys.4chan.org
// @version 1.0.0
// @namespace https://greasyfork.org/users/702681
// @downloadURL https://update.greasyfork.org/scripts/415690/4chan%20iframe%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/415690/4chan%20iframe%20remover.meta.js
// ==/UserScript==

var iframes = document.querySelectorAll('iframe');
for (var i = 0; i < iframes.length; i++) {
    iframes[i].parentNode.removeChild(iframes[i]);
}