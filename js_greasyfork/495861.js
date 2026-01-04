// ==UserScript==
// @name           wiki redirect to the english version
// @author         jaccob
// @version        1.1
// @namespace      userscripts
// @description    Redirect articles to the english Wikipedia (if exist)
// @license        GPLv3
// @include        https://*.wikipedia.org/wiki/*
// @exclude        https://en.wikipedia.org/wiki/*
// @downloadURL https://update.greasyfork.org/scripts/495861/wiki%20redirect%20to%20the%20english%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/495861/wiki%20redirect%20to%20the%20english%20version.meta.js
// ==/UserScript==

var ref = document.querySelector('.interlanguage-link.interwiki-en.mw-list-item > a');

if (ref != null) {
    window.location.replace(ref);
}
