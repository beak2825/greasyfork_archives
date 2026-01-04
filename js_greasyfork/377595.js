// ==UserScript==
// @name        	Czarna Lista Plusów
// @namespace   	http://www.wykop.pl/ludzie/Deykun
// @description 	Usuwa plusy od spam botów
// @author      	Deykun
// @include	    	htt*wykop.pl*
// @version     	1.00
// @grant       	none
// @run-at			document-end
//
// @downloadURL https://update.greasyfork.org/scripts/377595/Czarna%20Lista%20Plus%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/377595/Czarna%20Lista%20Plus%C3%B3w.meta.js
// ==/UserScript==


poor_vooters = ['lubie-sernik', 'manngoth'];

function find_and_remove_shity_voter() {
	var $entry = $(this);
    $entry.find('.voters-list a').each( function(){
        var voter_nick = $(this).text();

        if ( poor_vooters.includes(voter_nick) ) {
			$(this).remove();
			var $plus_votes = $entry.find('.author .vC b > span');
			var pluses_number = Number( $plus_votes.text() );

			$entry.find('.voters-list').contents().filter(function(){
				return (this.nodeValue == ', ');
			}).remove();
			
			
			console.log( pluses_number );
			
			if ( pluses_number > 1 ) {
				$plus_votes.text( '+'+(pluses_number-1) );
			} else {
				$plus_votes.text( 0 );
				$plus_votes.attr('class','');
			}
        }
    });
	
	if ( $entry.find('.voters-list a').length === 0 ) {
		$entry.find('.votersContainer').remove();
	}
}

$(document).ready(function() {
    console.log('Z fartem');
	$('.wblock').each( find_and_remove_shity_voter );
});
