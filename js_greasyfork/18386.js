// ==UserScript==
// @name        Always mobile Wikipedia
// @namespace   https://gist.github.com/leakypixel
// @description Redirect desktop Wikipedia to mobile
// @author      leakypixel
// @include     http://*.wikipedia.org/*
// @include     https://*.wikipedia.org/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18386/Always%20mobile%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/18386/Always%20mobile%20Wikipedia.meta.js
// ==/UserScript==
'use strict';

var m = /^(https?:\/\/[a-z]+)(\.wikipedia\.org\/.*)/.exec(location.href);
if (m) { window.location = m[1] + ".m" + m[2] };