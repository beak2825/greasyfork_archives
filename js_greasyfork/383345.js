// ==UserScript==
// @name            Mangadex resize long comments & pictures
// @description:en  Mangadex resize long comments & pictures, hover for full size pictures
// @include         https://mangadex.org/chapter/*/comments
// @include         https://mangadex.org/thread/*
// @include         https://mangadex.cc/chapter/*/comments
// @include         https://mangadex.cc/thread/*
// @icon            https://mangadex.cc/images/misc/default_brand.png
// @grant           GM_addStyle
// @run-at          document-start
// @version 0.0.1.20200126233501
// @namespace https://greasyfork.org/users/5621
// @description Mangadex resize long comments & pictures, hover for full size pictures
// @downloadURL https://update.greasyfork.org/scripts/383345/Mangadex%20resize%20long%20comments%20%20pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/383345/Mangadex%20resize%20long%20comments%20%20pictures.meta.js
// ==/UserScript==

GM_addStyle ( `
    .postbody img {
    max-width: 400px !important;
}
    .postbody img:hover {
    max-width: 1000px !important;
}
    .postbody {
	max-width: 1162px !important;
	word-wrap: break-word;
}


    }
` );