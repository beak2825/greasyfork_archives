// ==UserScript==
// @name           Youtube Номерация роликов
// @version        2025.10.11
// @description    Номерация роликов Youtube
// @match          https://www.youtube.com/@*
// @author         Rainbow-Spike
// @namespace      https://greasyfork.org/users/7568
// @homepage       https://greasyfork.org/ru/users/7568-rainbow-spike
// @icon           https://www.google.com/s2/favicons?domain=youtube.com
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/541824/Youtube%20%D0%9D%D0%BE%D0%BC%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D1%80%D0%BE%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/541824/Youtube%20%D0%9D%D0%BE%D0%BC%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D1%80%D0%BE%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

let toLow = 1;
const splitSign = " ⹀ ";
const stopClass = 'js-stop';
const titleNode = '#video-title';
const vidNode = 'ytd-rich-item-renderer';
const countNode = 'yt-content-metadata-view-model div:nth-of-type(2) span:last-child';

function h ( tag, props = { }, children = [ ] ) {
	const element = Object . assign ( document . createElement ( tag ), props );
	element . append ( ...children );
	return element;
};

function Toggle ( a ) {
	toLow = !a;
	const allVideos = document . querySelectorAll ( vidNode );

	allVideos . forEach ( ( e ) => {
		if ( e . classList . contains ( stopClass ) ) {
			e . querySelector ( titleNode ) . innerHTML = e . querySelector ( titleNode ) . innerHTML . split ( splitSign ) [ 1 ];
			e . classList . remove ( stopClass );
		};
	} );
};

function Action ( ) {
	const allVideos = document . querySelectorAll ( vidNode );
	const countVideos = document . querySelector ( countNode ) . innerHTML . split ( " " ) [ 0 ] || allVideos . length;
	const countLength = countVideos . toString ( ) . length;

	allVideos . forEach ( ( e, i ) => {
		const videoCounter = ( toLow ? countVideos - i : i + 1 ) . toString ( ) . padStart ( countLength, '0' );
		if ( ! e . classList . contains ( stopClass ) ) {
			e . querySelector ( titleNode ) . innerHTML = videoCounter + splitSign + e . querySelector ( titleNode ) . innerHTML;
			e . classList . add ( stopClass );
		};
	} );
};

function Detector ( ) {
    return ( document . querySelector ( "#yvn" ) . style . opacity = ( /\/videos/ . test ( window . location . href ) ) ? 0.8 : 0 );
};

function InsertButton ( ) {
	document . body . appendChild (
		h ( 'div', { id: 'yvn' }, [
			h ( 'style', {
				innerHTML:	`#yvn { background-color: white; border: 3px solid #1ad4df; border-radius: 13px; bottom: 5px; opacity: 0.8; padding: 5px; position: fixed; right: 25px; z-index: 999999; }
							#yvn * { font-size: 18px; margin: 2px }
							#yvn [type="button"] { display: block }
							#yvn input:hover { border-color: #eaf1f1 }`
			} ),
			h ( 'input', { type: 'button', value: 'Номерование', title: "Номерование", onclick: ( event ) => Action ( ) } ),
			h ( 'span', { innerHTML: 'По убыванию?' } ),
			h ( 'input', { type: 'checkbox', value: 'По убыванию?', checked: 'checked', onclick: ( event ) => Toggle ( toLow ) } )
		] )
	);
};

InsertButton ( );
setInterval ( Detector, 500 );