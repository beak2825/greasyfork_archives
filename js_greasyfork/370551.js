// ==UserScript==
// @name         Auto Tab Closer
// @namespace    https://greasyfork.org/en/users/13772-endorakai
// @version      1.2 Release
// @description  Automagically Closes Tab Of Included URLs
// @include      http*://thevideo.me/*/mttcd
// @include      http*://thevideo.me/*/redir
// @include      http*://vidup.me/mpaabpu/*
// @include      http*://35.193.89.147/*
// @exclude
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/370551/Auto%20Tab%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/370551/Auto%20Tab%20Closer.meta.js
// ==/UserScript==

//Will Increase List As Needed - See Additional Info At Namespace!!!
open(location, '_self').close();