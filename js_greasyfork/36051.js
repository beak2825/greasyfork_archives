// ==UserScript==
// @name         Craigslist Better Styles
// @namespace    craigslist_better_styles
// @description  Moves the 'hide' button to standard location for faster hiding of items
// @homepageURL  https://github.com/daraeman/craigslist_better_styles
// @author       daraeman
// @version      1.2
// @date         2019-03-17
// @include      https://*.craigslist.org/*
// @downloadURL https://update.greasyfork.org/scripts/36051/Craigslist%20Better%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/36051/Craigslist%20Better%20Styles.meta.js
// ==/UserScript==

const script_id = "craigslist_better_styles";
const styles = {
	search: "."+ script_id +" .banish { float: left; margin-right: 5px; margin-top: 3px; }",
};

function createStyles( styles ) {
	let style_el = document.createElement( "style" );
	style_el.textContent = styles;
	style_el.className = script_id;
	document.head.appendChild( style_el );
}

function getPage() {
	return ( /search/.test( document.body.className ) ) ? "search" : false;
}

function doSearchPage() {
	document.body.className = document.body.className + " " + script_id;
	createStyles( styles.search );
}

function init() {
	let page = getPage();
	if ( page === "search" ) {
		doSearchPage();
	}
}

init();
