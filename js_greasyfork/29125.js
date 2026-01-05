// ==UserScript==
// @name         Hentai Foundry CSS Fixes
// @namespace    https://github.com/Kayla355
// @version      0.1.1
// @description  Fixes some of the issues I had with the new version of the site.
// @author       Kayla355
// @match        www.hentai-foundry.com/*
// @grant        GM_addStyle
// @icon         http://img.hentai-foundry.com/themes/Hentai/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/29125/Hentai%20Foundry%20CSS%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/29125/Hentai%20Foundry%20CSS%20Fixes.meta.js
// ==/UserScript==

GM_addStyle(""
	+"html {background: none}"
	+"body {width:100%; margin: inherit !important;}"
	+".miniGalleryView .galleryViewTable .thumb_square, .galleryView .galleryViewTable .thumb_square, #mainmenu li, #mainmenu ul li a, #headerText, #headerLogin, #searchBox, header .navlink, #headerLogin a:link, #searchBox a:link, .tabContainer > ul.tabs a:link, .tabContainer > ul.tabs a:visited, #page .boxtab a, button, #filtersButton, #filtersButton a, a.moreLink, a.linkButton, .feedLink, .pdfLink, input, .calendar tr:not(.all_link) a, #category_browse a, #category_browse .list_level_1 > li {"
	+"-webkit-transition: all .3s ease-out;"
    +"-moz-transition: all .3s ease-out;"
    +"-ms-transition: all .3s ease-outr;"
    +"-o-transition: all .3s ease-out;"
	+"}"
	+".thumb:hover {"
	+"position: absolute;"
	+"}");