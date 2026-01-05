// ==UserScript==
// @name        Highligth visited episodes on animeid.io
// @description Highligth visited (red) episodes on animeid.io
// @description:en        Highligth visited episodes on animeid.io
// @namespace   animeid.io
// @include     http://animeid.io/Anime/*
// @include     https://animeid.io/Anime/*
// @version     1
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27045/Highligth%20visited%20episodes%20on%20animeidio.user.js
// @updateURL https://update.greasyfork.org/scripts/27045/Highligth%20visited%20episodes%20on%20animeidio.meta.js
// ==/UserScript==

GM_addStyle ( "ul#episode_related li a:visited{background-color:#ffc119 ;color:#a23131}" );