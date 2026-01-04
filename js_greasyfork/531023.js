// ==UserScript==
	// @name         DBA.dk - show searchbar on all pages
	// @namespace    http://tampermonkey.net/
	// @version      0.1
	// @description  New DBA is missing searchbar on all pages...
	// @author       johnnie johansen
	// @match        https://www.dba.dk/*/*
	// @grant        none
	// @require      http://code.jquery.com/jquery-3.7.1.min.js
	// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531023/DBAdk%20-%20show%20searchbar%20on%20all%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/531023/DBAdk%20-%20show%20searchbar%20on%20all%20pages.meta.js
	// ==/UserScript==
	 
	// var $ = window.$;
	// this.$ = this.jQuery = jQuery.noConflict(true); // GM/jQ v1.0 quickfix
	dbaSearch();

	function dbaSearch() {
		$(document).ready(function() {
			let css = '<style>'
					+ 'body { margin-top: 80px; }'
					+ '.dba-search { margin:0; padding:0; position:absolute; top: 0; left:0; width: 100%; background: darkorange; text-align: center; border-bottom:2px solid #333; }'
					+ '.dba-search input { border-radius: .25em; border:1px solid #333; margin: 15px; font-size: 22px; width: 95%; padding: 8px; }'
					+ '</style>';
			let form = '<form action="/recommerce/forsale/search" class="dba-search">'
					+ '<input name="q" placeholder="Søg efter...." />'
					+ '</form>';

			$('.searchbox input,.searchbox button').hide();
			$('body').append(css).append(form);
		});
	}