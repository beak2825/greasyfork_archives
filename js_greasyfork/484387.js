// ==UserScript==
// @name        CDPR Forum Layout Enhancer
// @namespace   CDPR-FLE
// @description Reduces vertical space wasted and improves the layout.
// @license     WTFPL v2
// @include     https://forums.cdprojektred.com/*
// @include     http://forums.cdprojektred.com/*
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484387/CDPR%20Forum%20Layout%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/484387/CDPR%20Forum%20Layout%20Enhancer.meta.js
// ==/UserScript==

 /*************************************************************************\
 *                                                                         *
 *               DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE               *
 *                       Version 2, December 2004                          *
 *                                                                         *
 *   Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>                      *
 *                                                                         *
 *   Everyone is permitted to copy and distribute verbatim or modified     *
 *   copies of this license document, and changing it is allowed as long   *
 *   as the name is changed.                                               *
 *                                                                         *
 *               DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE               *
 *     TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION     *
 *                                                                         *
 *    0. You just DO WHAT THE FUCK YOU WANT TO.                            *
 *                                                                         *
 \*************************************************************************/


//Quick & dirty substitute in case your userscript manager of choice does not support GM_addStyle().

if (typeof GM_addStyle != 'function') GM_addStyle = function(css){
	var style=document.createElement('style')
	style.innerHTML=css
	document.head.appendChild(style)
}

//The layout changes to reduce wasted vertical space.

GM_addStyle (`
	.p-nav-list > li {
		margin: 5px 10px;
	}
	.p-nav-list .p-navEl {
		height: 50px;
	}
	.p-nav-list .p-navEl .p-navEl-link {
		height: 50px;
	}
	.p-body-header {
		margin-bottom: 0px;
	}
	.p-nav-list .p-navEl .p-navEl-link .fa {
		height: 50px;
		line-height: 50px;
	}
	.p-title {
		padding: 0px;
		margin-top: -5px;
	}
	.search-menu {
		right: 70px;
		top: 3px;
	}
	.structItem {
		height: 44px;
	}
	.structItem-cell {
		padding: 6px 8px;
	}
	.p-header {
		height: 100px;
	}
	.p-header-content {
		height: 100px;
	}
	.p-header-logo.p-header-logo--image {
		margin-top: auto;
		margin-bottom: auto;
	}
	.p-header-logo.p-header-logo--image img {
		vertical-align: middle;
		max-height: 107px;
		margin-top: -12px;
	}
	.p-body-inner {
		padding: 0px 10px 20px;
	}
	.p-sectionLinks-inner .p-navEl-link {
		height: 50px;
	}
	.search-menu .search-menu-content .search-menu-row {
		padding: 0px;
	}
	.button.button--big, a.button.button--big {
		padding: 8px;
	}
	.button.button--big--search-advanced, a.button.button--big--search-advanced {
		padding: 8px 5px;
	}
	.message-cell {
		padding: 8px 15px;
	}
	.message-main>.message-attribution {
		position: relative;
		top: -37px;
		height: 0px;
	}
	.message-cell.message-cell--user {
		height: 44px;
	}
	.message-cell--user>.message-attribution-opposite {
		margin-right: 100px;
	}
	.message-actionBar .actionBar-set {
		margin: 8px 6px 0px 6px;
	}
	.message .likesBar {
		margin-top: -24px;
	}
	.message-userTitle {
		line-height: 20px;
	}
	.block {
		margin-bottom: 2px;
	}
	.structItem-cell--meta-img img {
		float: right;
	}
	.block.js-quickReply {
		min-height: 0px;
		margin-bottom: 20px;
	}
	.structItem-cell--icon {
		box-sizing: content-box;
		width: 10px !important;
	}
	.structItem-cell--latest {
		box-sizing: content-box;
		width: 200px !important;
	}
	.structItem-cell.structItem-cell--meta {
		width: 100px;
	}
`)

//From here on below we have more significant layout changes. Some of these scripts even use javascript inside the stylesheet.

//The follow bit adjusts the message headers to compensate for their bigger size on the Red Tracker page or any similarly constructed page.

if (document.getElementsByClassName('message-cell--user')[0] && document.getElementsByClassName('message-cell--user')[0].firstElementChild.tagName=="DIV") GM_addStyle(`
	.message-cell.message-cell--user {
		height: 60px;
	}
	.message-cell.message-cell--user>div[style~="top:"] {
		top: -9px !important;
	}
`)

//Quick hack to fix issues when the page's title runs for more than one line of text, like the search button, etc. moving into the wrong spot.

GM_addStyle(`
	.p-title-value {
		max-width: calc(100% - 70px);
		line-height: normal;
		margin-top: 11px;
		min-height: 43.25px;
	}
	.p-title-value ~ :not(.search-menu) {
		position: relative;
	}
	.block-filterBar {
		padding: 7.5px 12px;
	}
`)

GM_addStyle(`
	.p-title-value ~ :not(.search-menu) {
		top: ${1-document.querySelector('.p-title-value ~ :not(.search-menu)').offsetTop}px;
	}
`)

//Delete everything below this point and you have the vertical compression UI only.

GM_addStyle (`
	.p-title {
		padding: 0px;
		margin-top: 0px;
	}
	.p-header {
		height: 100px;
		width: 100%;
		position: inherit;
	}
	.search-menu {
		top: 8px;
	}
	.block.js-quickReply .block-container {
		position: relative;
		width: 100%;
		padding: 20px 0px 8px;
	}
	.block.js-quickReply .block-container .block-body {
		max-width: none;
	}
	.p-nav {
		position: absolute;
		margin-top: -4px;
		top: ${document.getElementsByClassName('p-header')[0].offsetTop + document.getElementsByClassName('p-header')[0].clientHeight-5}px;
	}
	.p-nav-list {
		flex-wrap: wrap;
		flex-direction: column;
		align-content: flex-start;
		display: flex;
	}

	.p-body-inner {
		width: calc(100% - 270px);
		max-width: none;
		margin: 0px 0px 0px auto;
	}
	.p-nav-list > li {
		width: 260px;
		margin: 2px 10px;
	}
	.structItem-cell.structItem-cell--latest {
		padding-left: 10px;
	}
	.block.js-quickReply .block-container {
		margin-left: initial;
		position: static;
	}
`)

//For the following optional code components, this holds true:
//	Two slashes (meaning "//*" - without the quotation marks) at the start of the line activates the following code block.
//	One slash (meaning "/*") deactivates it.

/* Add an extra slash to the beginning of this line if you want to center the reply box and any text objects below (like the similar threads list).

GM_addStyle (`
	.block.js-quickReply .block-container {
		margin-left: calc(50% - 50vw + 8px);
		position: relative;
	}
	.block.js-quickReply ~ .block {
		margin-left: calc(50% - 50vw + 8px);
		position: relative;
		width: 100%;
	}
`)//*/

/* Add an extra slash to the beginning of this line to make the navigation bar start higher and move the page banner out of the way.

GM_addStyle (`
	.p-header {
		margin-left: auto;
		width: calc(100% - 270px);
	}
	.p-nav {
		top: 29px;
	}
`)//*/

//The following bit controls the subforum links.
//It has to be loaded after the above section because the main forum's navbar needs to finish being relocated before this runs.

GM_addStyle (`
	.p-sectionLinks:not(:empty)::before {
		content: "Subforum Links";
		font-weight: bold;
		font-size: 18px;
		text-align: center;
		display: inline;
		display: block;
	}
	.p-sectionLinks {
		position: absolute;
		width: 278px;
		top: ${document.getElementsByClassName('p-nav')[0].offsetTop + document.getElementsByClassName('p-nav')[0].clientHeight-10}px;
		left: 0px;
	}
	.p-sectionLinks-inner {
		max-width: none;
		margin: 0px;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.p-sectionLinks-inner .p-navEl {
		margin: 2px 1px;
		max-width: none;
	}
	.block-outer {
		padding-bottom: 0px;
	}
`)

//This last bit is run separately purely so that the code doesn't delay the rest of the CSS from loading.
//This may make a difference if you have a *very* slow computer.

GM_addStyle (`
	html {
		${function(){
			//Prevents a gray background from appearing at the bottom if the nav expands a page beyond the page-wrapper's size.
			//This only really happens when it's a really short page while there are a lot of subforum links.
			var styles='';
			var pageWrapper=window.getComputedStyle(document.getElementsByClassName('p-pageWrapper')[0])
			for (var name in pageWrapper) {
				if (name.indexOf('background-')==0) {
					styles+='\t\t'+name+': '+pageWrapper[name]+';\n'
				}
			}
			return styles;
		}()}
	}
`)

//Quick hack in case the page is too short, ensuring it'll shift the footer to the right so the navbar doesn't overlap with the footer.

if (document.getElementsByClassName('p-sectionLinks').length !=0 && document.getElementsByClassName('p-sectionLinks')[0].offsetTop+document.getElementsByClassName('p-sectionLinks')[0].clientHeight+20 > document.getElementsByClassName('p-footer')[0].offsetTop) GM_addStyle(`
	.p-footer {
		width: calc(100% - 270px);
		max-width: none;
		margin: 0px 0px 0px auto;
	}
`)