// ==UserScript==
// @name        DuckDuckGo - Alt Favicon
// @namespace   codeberg.org/skye
// @match       http*://*.duckduckgo.com/*
// @grant       none
// @version     1.0.0
// @author      freyja
// @description Changes DDG favicon to their logo without any orange in it
// @icon		https://duckduckgo.com/assets/logo_header.alt.v108.svg
// @license		MIT
// @downloadURL https://update.greasyfork.org/scripts/466358/DuckDuckGo%20-%20Alt%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/466358/DuckDuckGo%20-%20Alt%20Favicon.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('type', 'image/x-icon');
icon.setAttribute('rel', 'icon'); //firefox
icon.setAttribute('rel', 'shortcut icon'); //chromium
icon.setAttribute('href', 'https://duckduckgo.com/assets/logo_header.alt.v108.svg');

head.appendChild(icon);