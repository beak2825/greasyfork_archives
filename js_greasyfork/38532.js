// ==UserScript==
// @name           Restore View Image Button for Google
// @namespace      David Refoua <www.Refoua.me>
// @author         David Refoua
// @description    Restores the 'View Image' button on Google Image search. Beta, report back issues!
// @include        http://*.google.tld/*isch*
// @include        https://*.google.tld/*isch*
// @version        0.1.3.1-beta
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/38532/Restore%20View%20Image%20Button%20for%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/38532/Restore%20View%20Image%20Button%20for%20Google.meta.js
// ==/UserScript==

var resetViewBtn = (function() {
	'use strict';

	var getCousins = function(node, selector) {

		var found = null;

		while ( (parent = node.parentNode) && ( parent != node ) ) {

			node = parent;
			var list = node.querySelectorAll(selector);
      
			if ( list.length > 0 ) {
				found = list;
				break;
			}

		}

		return found;

	};

	var getImageLink = function(node) {

		/*
		var image_nodes = getCousins(node, '.irc_mi');

		for (var i in image_nodes) if ( image_nodes.hasOwnProperty(i) ) {
			var image_item = image_nodes[i];

			var image_source = image_item.getAttribute('src');
			if ( !image_source ) return image_source;
		}
		*/

		var related_nodes = getCousins(node, '.irc_rimask');

		for (var j in related_nodes) if ( related_nodes.hasOwnProperty(j) ) {
			var related_item = related_nodes[j];

			if ( related_item.classList.contains('irc_rist') ) {

				var target_image = related_item.querySelector('.target_image');

				var x, the_source;

				if ( target_image && ( x = target_image.parentNode ) && ( the_source = x.getAttribute('href') ) )
				{
					
					var image_match = the_source.match( /imgurl=([^\&]+)\&/i );

					if ( image_match && image_match.length > 0 ) {

						var image_link = image_match[1];
						while ( decodeURIComponent(image_link) != image_link ) image_link = decodeURIComponent(image_link);

						return image_link;

					}

				}

			}

		}

		return null;
		
	};
  
  
  var bottom_buttons = document.querySelectorAll('.irc_but_r');

	for ( var i = 0; i < bottom_buttons.length; i++ ) {

		var the_table = bottom_buttons[i];
		var img_addr = getImageLink(the_table);
		var visit_button_container = the_table.querySelector('.irc_vpl').parentNode;
		var view_image_button = visit_button_container.querySelector('.irc_view_image');
		
		if ( !view_image_button ) {
			var new_button = document.createElement("a");
			view_image_button = visit_button_container.appendChild(new_button);
			view_image_button.classList.add('irc_view_image');
      // TODO: use the waybackmachine to find what google originally used instead of `.irc_view_image`
		}
		
		view_image_button.style.display = ( img_addr ? '' : 'none' );

		// view_image_button.innerText = 'View Image';
		view_image_button.innerHTML = '<span class="_WKw">View Image</span>';

		view_image_button.setAttribute('href', img_addr);

		view_image_button.setAttribute('target', '_blank');
		view_image_button.setAttribute('tabindex', '0');

	}

});

/*
// TODO: find a valid event and don't use an interval
var eventsList = ['mouseup', 'keyup'];

for (var i in eventsList) if ( eventsList.hasOwnProperty(i) ) {
	document.addEventListener(eventsList[i], function(e){
		if (e.target && e.target.classList && e.target.classList.contains('irc_view_image') == false && e.target.parentNode.classList.contains('irc_view_image') == false )
			resetViewBtn();
	});
}
*/

setInterval(resetViewBtn, 500);
