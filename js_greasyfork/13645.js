// ==UserScript==
// @name        KickEvils
// @namespace   InGame
// @include     http://www.dreadcast.net/Forum*
// @version     2.3
// @grant       none
// @author	Ladoria
// @description Kick evil buddies from DC's forum.
// @downloadURL https://update.greasyfork.org/scripts/13645/KickEvils.user.js
// @updateURL https://update.greasyfork.org/scripts/13645/KickEvils.meta.js
// ==/UserScript==

var toKick = new Array();
var shown = new Array();
var binded = new Array();

// Uncomment following line with appropriate nicknames : 'nickname1', 'nickname2', [...] 'nicknameX'
// toKick = ['Ladoria', 'kikoo12', 'kévindu93'];

$(document).ready( function() {
	function KickThoseThings() {
		$('.bandeau .nom').each( function() {
			if(-1 != $.inArray($(this).html(),toKick)) {
				var bandeau = $(this).parent();
				if(-1 == $.inArray(bandeau.next().attr('id'),shown))
					bandeau.next().hide();
				
				if(-1 != $.inArray($(this).attr('id'), binded))
					return;
				
				binded.push($(this).attr('id'));
				
				bandeau.on('click', function() {
					var id = $(this).next().toggle().attr('id');
					
					if(-1 == $.inArray(id, shown))
						shown.push(id);
					else {
						shown = jQuery.grep(shown, function(value) {
							return value != id;
						});
					}
				});
			}
		});
	}

	KickThoseThings();
	
	$(document).ajaxComplete( function(a,b,c) {
		if(false == /Check/.test(c.url)) {
			binded = new Array();
		}
		
		KickThoseThings();
	});
});
console.log('DC - Kick evils started');