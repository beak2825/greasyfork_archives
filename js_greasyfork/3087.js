// ==UserScript==
// @author      Zachary Seeley
// @name        Gru's Lab
// @namespace   http://www.jedatasolutions.com/
// @description Makes HipChat 1000 times more awesome.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://jedatasolutions.hipchat.com/chat*
// @copyright   © 2014, J&E Data Solutions
// @version     0.2
// @downloadURL https://update.greasyfork.org/scripts/3087/Gru%27s%20Lab.user.js
// @updateURL https://update.greasyfork.org/scripts/3087/Gru%27s%20Lab.meta.js
// ==/UserScript==

document.title = "Gru's Lab - Despicable J&E";

$( 'img[alt="HipChat"]' ).attr( 'src', 'http://i.imgur.com/Rs42cvN.png' ).attr( 'height', '54px' ).attr( 'width', '160px' ).css( 'margin-left', '-20px' ).css( 'margin-top', '-15px' );

$( 'span:contains("Lobby")' ).text( 'Lab Directory' );