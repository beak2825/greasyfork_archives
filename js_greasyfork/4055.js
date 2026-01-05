// ==UserScript==
// @id             hidefbnewsfeed@jnv.gihtub.io
// @name           Hide Facebook News Feed
// @description    Replaces useless Facebook feed with useful kittens
// @version        2015.09.05
// @namespace      http://jnv.github.io
// @domain         www.facebook.com
// @include        http://www.facebook.com/*
// @include        https://www.facebook.com/*
// @screenshot     https://gist.githubusercontent.com/jnv/e401c3faac0e893c489a/raw/screenshot.png
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/4055/Hide%20Facebook%20News%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/4055/Hide%20Facebook%20News%20Feed.meta.js
// ==/UserScript==

var kittehs = "//thecatapi.com/api/images/get?size=med";
var style = "#stream_pagelet { min-height: 600px !important; background: url("+kittehs+") top center / contain no-repeat !important }";
style += "#stream_pagelet * { display: none !important; }"

GM_addStyle(style);
