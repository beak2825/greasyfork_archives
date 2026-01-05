// ==UserScript==
// @name		DC - Ponyfy
// @author		Ladoria
// @namespace   InGame
// @version		0.3
// @grant       none
// @description	Just do some shit
// @match		http://www.dreadcast.net/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright	2012+, Ladoria
// @downloadURL https://update.greasyfork.org/scripts/2187/DC%20-%20Ponyfy.user.js
// @updateURL https://update.greasyfork.org/scripts/2187/DC%20-%20Ponyfy.meta.js
// ==/UserScript==

var avatars = new Array();

// avatars['NOM_PERSONNAGE'] = 'LIEN_AVATAR';
// une ligne par personnage

avatars['Betred'] = 'http://image.noelshack.com/fichiers/2014/23/1402040116-betred-pony.png';
avatars['Oline'] = 'http://image.noelshack.com/fichiers/2014/23/1402077946-oline-pony.png';
avatars['Kinchaka'] = 'http://image.noelshack.com/fichiers/2014/24/1402565641-kinchaka-pony.png';
avatars['Lorkah'] = 'http://image.noelshack.com/fichiers/2014/24/1402588632-unnamed-shadowbolt-2-s1e02.png';
avatars['Dann'] = 'http://image.noelshack.com/fichiers/2014/24/1402591400-dann.png';
avatars['Jenny'] = 'http://image.noelshack.com/fichiers/2014/24/1402557881-7pyfy.png';

// random pony for unassigned pseudo
default_avatars = new Array();
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557880-4706.gif');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557880-21327f2a1459edb80c2aadec8795058e.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557880-bxlgu.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557880-cvo1o.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557880-darkjester2.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557880-images.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557881-n6frz.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557881-rexzm.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557881-user-avatar-9222.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557882-8zrax.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557882-70-user-41.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557882-70-user-44.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557882-70-user-112.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557882-70-user-145.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557883-70-user-245.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402557883-70-user-308.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402592300-pony-6.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402592301-pony-1.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402592301-pony-2.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402592301-pony-3.png');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402592301-pony-4.jpg');
default_avatars.push('http://image.noelshack.com/fichiers/2014/24/1402592301-pony-5.gif');



jQuery.noConflict();

$(document).ready( function() {
	var to_ponyfy = Object.keys(avatars);
	
	assign_random_pony();
	make_it_ponier();
	
	$(document).ajaxComplete( function() {
		assign_random_pony();
		make_it_ponier();
	});
	
	// 	checked all avatars
	// 		assign a pony for each unmatched pseudo
	function assign_random_pony() {
		$('img[src*=avatars]:not(ponyfied)').each( function() {
			var pseudo = $(this).attr('src').match(/([^/]+)\.[^\./]+$/);
			
			if(null != pseudo) {
				pseudo = pseudo[1].split('~')[0];
				
				if(-1 == jQuery.inArray(pseudo,to_ponyfy)) {
					to_ponyfy.push(pseudo);
					avatars[pseudo] = default_avatars[Math.round(Math.random() * (default_avatars.length - 1))];
				}
			}
		});
	}
	
	// replace avatar by assigned pony
	function make_it_ponier() {
		for(var i = 0; i < to_ponyfy.length; i++) {
			$('img[src*=avatars][src*=' + to_ponyfy[i] + ']:not(ponyfied)').each(function() {
				$(this).addClass('ponyfied');
				$(this).attr('src', avatars[to_ponyfy[i]]);
			});
		}
	}
});