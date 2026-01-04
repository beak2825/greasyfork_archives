// ==UserScript==
// @name		Zerochan List Links
// @namespace	zerochan_list_links
// @description	Adds a button to copy all the image links on a page
// @homepageURL	https://github.com/namiman/zerochan_list_links
// @author		namiman
// @version		1.0
// @date		2018-02-11
// @include		https://www.zerochan.net/*
// @require		https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/38367/Zerochan%20List%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/38367/Zerochan%20List%20Links.meta.js
// ==/UserScript==

(function(){

	let links = [];
	
	function addStyles() {
		let head = document.getElementsByTagName( "head" )[0];
		let styles = document.createElement( "style" );
			styles.textContent =
			'.zerochan_list_links_textbox {'+
			'	min-width: 346px;'+
			'	min-height: 140px;'+
			'}'+
			'#zerochan_list_links_copy {'+
			'	cursor: pointer;'+
			'}';
			styles.id = "zerochan_list_links_styles";
		head.appendChild( styles );
	}

	function getLinks() {
		let items = document.getElementById( "thumbs2" ).getElementsByTagName( "li" );
		[].forEach.call( items, ( item ) => {
			links.push( item.getElementsByTagName( "p" )[0].getElementsByTagName( "a" )[1].href );
		});
	}
/*
	function displayLinks() {
		let menu = document.getElementById( "menu" );
		let textbox = document.createElement( "textarea" );
			textbox.textContent = links.join( "\n" );
			textbox.className = "zerochan_list_links_textbox";
		menu.appendChild( textbox );
	}
*/
	function createCopyButton() {

		let parent = document.getElementsByClassName( "browsing-options" )[0];
		let br = document.createElement( "br" );
		let button = document.createElement( "a" );
			button.textContent = "Copy Image Links";
			button.id = "zerochan_list_links_copy";
		parent.appendChild( br );
		parent.appendChild( button );

		new Clipboard( "#zerochan_list_links_copy", {
			text: function() {
				return links.join( "\n" );
			}
		});
	}

	addStyles();
	getLinks();
//	displayLinks();
	createCopyButton();

})();