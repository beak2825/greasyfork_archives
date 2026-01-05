// ==UserScript==
// @name        Last.fm Interference Inhibitor (fix)
// @namespace   xxarock
// @description Restores font when using thebspatrol's "Last.fm Interference Inhibitor" script.
// @author      arockalypto
// @match       *://last.fm/*
// @match       *://*.last.fm/*
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24443/Lastfm%20Interference%20Inhibitor%20%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24443/Lastfm%20Interference%20Inhibitor%20%28fix%29.meta.js
// ==/UserScript==

GM_addStyle (" \
    html { \
        font-size:14px !important; \
        font-family: Open Sans, Lucida Grande, Helvetica Neue, Helvetica, Arial, Sans-serif!important; \
        line-height: 1.71428571!important; \
        color: #222222!important; \
	} \
");