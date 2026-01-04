// ==UserScript==
// @name           Darksoftware New Threads Color
// @description    Make Them Visible :)
// @include        http*://darksoftware.net/*
// @include        http*://www.darksoftware.net/*
// @grant    GM_addStyle
// @run-at   document-end
// @version 0.0.1.20210717133909
// @namespace https://greasyfork.org/users/794378
// @downloadURL https://update.greasyfork.org/scripts/429499/Darksoftware%20New%20Threads%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/429499/Darksoftware%20New%20Threads%20Color.meta.js
// ==/UserScript==

GM_addStyle ( `
.is-unread .structItem-title a {
    color: yellow;
}
` );
