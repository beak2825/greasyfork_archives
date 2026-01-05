// ==UserScript==
// @name        HoverCard: BoardGames.SE MTG Gatherer Card Link Rollover
// @namespace   https://greasyfork.org/users/38387
// @description Display MTG cards in tooltip when hovering over Gatherer and Autocard links
// @grant       none
// @match       *://boardgames.stackexchange.com/questions/*
// @match       *://meta.boardgames.stackexchange.com/questions/*
// @match       *://boardgames.meta.stackexchange.com/questions/*
// @version     1.0.10
// @downloadURL https://update.greasyfork.org/scripts/18720/HoverCard%3A%20BoardGamesSE%20MTG%20Gatherer%20Card%20Link%20Rollover.user.js
// @updateURL https://update.greasyfork.org/scripts/18720/HoverCard%3A%20BoardGamesSE%20MTG%20Gatherer%20Card%20Link%20Rollover.meta.js
// ==/UserScript==

var userscript = function($) {
	
	var hoverCss = '\
		#hoverCard { \
			position: fixed; \
			z-index: 1; \
			display: none; \
			width: 223px; \
			height: 311px; \
			background: #191919; \
			background: linear-gradient(to bottom,#191919 0%,#282828 100%); \
			border-radius: 11px; \
			overflow: hidden; \
			box-shadow: 0 0 7px #333; \
		} \
		#hoverCard::before { \
			position: absolute; \
			bottom: 0; \
			width: 100%; \
			height: 50px; \
			color: #999; \
			text-align: center; \
			font-weight: bold; \
			text-shadow: 0 -2px 2px #191919, 0 1px 1px #444; \
			content: "Gathering..."; \
		} \
		#hoverCard img { \
			position: absolute; \
		} \
	';
	
	var hoverCard = {
		selectors   : function() {
			// THIS METHOD IS NO LONGER USED AS OF v1.0.6. Added lines 56,60-72 to fix this.
			// Chrome no longer seems to like [... i] selectors for case-insensitive matching.
			// This makes the code a bit more clunky because I can no longer filter the
			// selectors directly, but must match ALL hyperlink anchors and see if they match
			// any of the MTG urls below after forcing them to lowercase.
			var urls = [
				  '://www.wizards.com/magic/autocard.asp'
				, '://gatherer.wizards.com/Pages/Card/Details.aspx'
				, '://gatherer.wizards.com/Pages/Search/Default.aspx'
				, '://gatherer.wizards.com/Handlers/Image.ashx'
			];
			//return 'a[href*="' + urls.join( '" i], a[href*="' ) + '" i]';
			return urls;
		},
		imageUrl    : 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&',
		extractCard : function( href, key ) {
			var match = false;
			var urls = this.selectors();
			urls.forEach( function( url ) {
				if( href.toLowerCase().indexOf( url.toLowerCase() ) > -1 ) {
					match = true;
					return;
				}
			});
			if( !match ) {
				return {
					success : false
				};
			}
			var query;
			if( href.indexOf( '#' ) == -1 ) {
				query = href.substring( href.indexOf( '?' ) + 1 );
			} else {
				query = href.substring( href.indexOf( '?' ) + 1, href.indexOf( '#' ) );
			}
			query = query.split( '&' );
			var result = {};
			result.success = false;
			for( var i = 0; i < query.length; ++i ) {
				var pair = query[ i ].split( '=' );
				if( pair[ 0 ].toLowerCase() == 'name' || pair[ 0 ].toLowerCase() == 'multiverseid' ) {
					result.success = true;
					result.key = pair[ 0 ];
					result.value = encodeURIComponent( decodeURIComponent( pair[ 1 ] ).replace( /\]\+\[/g, ' ' ).replace( /[\+\[\]]/g, '' ) );
					break;
				}
			}
			return result;
		},
		initDom     : function() {
			var styleHead = $( '<style>' ).attr( 'id', 'mtg-hovercard' ).text( hoverCss ),
				popupHtml = '<div id="hoverCard"></div>';
			$( 'head' ).append( styleHead );
			$( '#mainbar' ).append( popupHtml );
		},
		calcPos     : function( anchor ) {
			var popupWidth    = 223,
				popupHeight   = 311,
				popupMaxWidth = $( '#mainbar' ).width(),
				anchorWidth   = $( anchor )[0].offsetWidth,
				anchorHeight  = $( anchor )[0].offsetHeight,
				anchorPosRel  = $( anchor )[0].getBoundingClientRect(),
				contentPosRel = $( '#mainbar' )[0].getBoundingClientRect();
			var offsetTop  = anchorPosRel.top + anchorHeight + 8,
				offsetLeft = ( popupMaxWidth / 2 ) - ( popupWidth / 2 );
			if( offsetTop > ( document.documentElement.clientHeight - popupHeight - 8 ) ) {
				offsetTop = offsetTop - popupHeight - anchorHeight - 16;
			}
			if( popupWidth < popupMaxWidth ) {
				var leeway       = popupMaxWidth - popupWidth - offsetLeft - 1 + ( anchorPosRel.left - contentPosRel.left ),
					anchorCenter = anchorPosRel.left + ( anchorWidth / 2 ),
					popupCenter  = offsetLeft + ( popupWidth / 2 );
				var nudgeRight   = anchorCenter - popupCenter;
				nudgeRight       = nudgeRight > leeway ? leeway : nudgeRight;
				offsetLeft       = offsetLeft + nudgeRight;
			}
			offsetLeft = offsetLeft < 0 ? anchorPosRel.left : offsetLeft;
			offsetLeft = anchorWidth > popupMaxWidth * 0.7 ? anchorPosRel.left : offsetLeft;
			return {
				left : offsetLeft,
				top  : offsetTop
			};
		},
		showCard    : function( anchor ) {
			var card = hoverCard.extractCard( $( anchor ).attr( 'href' ) );
			if( !card.success ) { return false; }
			var html = '<img src="' + hoverCard.imageUrl + card.key + '=' + card.value + '" />';
			var pos  = hoverCard.calcPos( anchor );
			$( '#hoverCard' ).stop().hide().html( html ).fadeTo( 350, 1.0 ).css({
				left : Math.floor( pos.left ),
				top  : Math.floor( pos.top )
			});
		},
		hideCard    : function() {
			$( '#hoverCard' ).stop().fadeTo( 350, 0.0, function() {
				$( this ).hide();
			});
		}
	};
	
	StackExchange.ready( function() {
		hoverCard.initDom();
		$( 'body' ).on( 'mouseenter mouseleave', 'a', function( e ) {
			if( e.type == 'mouseenter' ) {
				hoverCard.showCard( this );
			} else if( e.type == 'mouseleave' ) {
				hoverCard.hideCard();
			}
		});
    });
	
};

var el = document.createElement('script');
el.type = 'text/javascript';
el.text = '(' + userscript + ')(jQuery);';
document.head.appendChild(el);