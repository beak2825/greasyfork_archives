// ==UserScript==
// @id             fbrecomhide@jnv.gihtub.io
// @name           Hide Recommendations on Facebook
// @description    Removes "People you may know", "Recommended Pages" and similar on Facebook.
// @version        2015.07.12
// @namespace      http://jnv.github.io
// @domain         www.facebook.com
// @include        http://www.facebook.com/*
// @include        https://www.facebook.com/*
// @grant          GM_addStyle
// @screenshot     https://gist.github.com/jnv/c5402051326e63ed59de/raw/screenshot.png
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/5154/Hide%20Recommendations%20on%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/5154/Hide%20Recommendations%20on%20Facebook.meta.js
// ==/UserScript==


var style = "#pagelet_ego_pane { display: none !important; }"

GM_addStyle(style);
