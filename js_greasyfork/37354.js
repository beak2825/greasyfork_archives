// ==UserScript==
// @name     Sadistic.pl player replacer
// @description:pl  Skrypcik podmieniający player Sadistica na "przeglądarkowy" player HTML5.
// @version  1.2
// @grant    none
// @match https://www.sadistic.pl/*
// @require	https://code.jquery.com/jquery-3.2.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js
// @namespace https://greasyfork.org/users/120356
// @description Skrypcik podmieniający player Sadistica na "przeglądarkowy" player HTML5.
// @downloadURL https://update.greasyfork.org/scripts/37354/Sadisticpl%20player%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/37354/Sadisticpl%20player%20replacer.meta.js
// ==/UserScript==

let css = `
	video {
		background: black;
		width: 768px;
		height: 432px;
	}
	video:focus {
		outline: none;
	}
`;

const LEFT = 149;
const RIGHT = 37;
const TOP = 39;
const BOTTOM = 0;

$( () => {

    $( 'body' ).append( `<style>${css}</style>` );

    $( '.player_embed' ).each((_, player) => {
        const src = $($(player).find('video')[0]).attr('src')
        const poster = $($(player).find('video')[0]).attr('poster')

        $(player).replaceWith(`<video src="${src}" poster="${poster}" controls/>`)

        /*
        $(player).mousewheel( e => {

            if( e.target.paused ) return;

            const w = parseInt( $( e.target ).css( 'width' ) );
            const h = parseInt( $( e.target ).css( 'height' ) );
            const x = e.offsetX;
            const y = e.offsetY;

            e.preventDefault();
            const vol = e.target.volume;
            if( e.deltaY == 1 && vol < 1 ) e.target.volume = vol + .1;
            if( e.deltaY == -1 && vol > 0 ) e.target.volume = vol - .1;
        })
        */
    });
});