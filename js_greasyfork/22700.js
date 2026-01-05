// ==UserScript==
// @name 500px Download button and enable right click
// @version 20160828.02
// @author Dizzy69
// @description  This script will add a gren Download button to the Photo page on 500px.com and also enable right clicking the photo.
// @include http*://500px.com/*
// @include http*://www.500px.com/*
// @grant GM_addStyle
// @namespace https://greasyfork.org/users/22540
// @downloadURL https://update.greasyfork.org/scripts/22700/500px%20Download%20button%20and%20enable%20right%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/22700/500px%20Download%20button%20and%20enable%20right%20click.meta.js
// ==/UserScript==

(function () {

	//Enable the right click:
	GM_addStyle("img.photo { z-index:999 !important; }");
	
	// The rest
	/**
	var src = $("#preload img").attr("src");

	if (src.indexOf('/h%3D300/') == -1) {
	$( ".photo_sidebar .actions_region" ).append( '<DIV class="actions_region section"><a href="' + src + '" target="_blank"  title="Download..." download class="button medium submit">下载图片</a></DIV>' );
	}
	 **/
	var addBtnDownload = function (src) {
		var el = document.querySelector('.main_container .sidebar_region .photo_sidebar .actions_region');
		el.insertAdjacentHTML('afterEnd', '<a href="' + src + '" target="_blank" download class="button medium submit">Download</a>');
	}
	var eventHandler = function (events) {
		events.forEach(function (event) {
			if (event.type == "attributes" && event.attributeName == 'src') {
				if (event.target.src.indexOf('h%3D300/') ==  - 1 && event.target.alt != "" && event.target.className == "photo") {
					addBtnDownload(event.target.src);
					//console.log(event.target, event.attrChange, event.attrName, event.newValue);
				}
			}
		});
	}

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	var target = document.querySelector('body');

	var observer = new MutationObserver(eventHandler);

	var config = {
		attributes : true,
		//attributeFilter : ["src"],
		//attributeOldValue : false,
		//childList : true,
		subtree : true
	}

	observer.observe(target, config);

	//	observer.disconnect();

})();