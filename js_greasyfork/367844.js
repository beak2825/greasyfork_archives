// ==UserScript==
// @name		Various fixes on FF.net
// @namespace	https://greasyfork.org/en/scripts/367844-various-fixes-on-ff-net
// @description Adds Verdana characters not taken into account and fixes line height in Favorite Authors tab.
// @version		1
// @match		http://www.fanfiction.net/*
// @match		https://www.fanfiction.net/*
// @run-at		document-start
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/367844/Various%20fixes%20on%20FFnet.user.js
// @updateURL https://update.greasyfork.org/scripts/367844/Various%20fixes%20on%20FFnet.meta.js
// ==/UserScript==


GM_addStyle(" @font-face			\
            {						\
			font-family: 'Verdana';	\
			font-style: normal;		\
			font-weight: 400;		\
			src: local('Verdana');	\
            }");
			
GM_addStyle(" #fa > table > tbody > tr > td[style]	\
            {										\
			line-height: 66px !important			\
            }");