// ==UserScript==
// @name         Aliexpress browse to next or previous page with keyboard
// @description  browse aliexpress search results to next or previous page using right and left keys
// @author       yoshkinawa
// @match        https://*.aliexpress.com
// @license MIT
// @version 0.0.1.20201109131907
// @namespace https://greasyfork.org/users/703241
// @downloadURL https://update.greasyfork.org/scripts/415811/Aliexpress%20browse%20to%20next%20or%20previous%20page%20with%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/415811/Aliexpress%20browse%20to%20next%20or%20previous%20page%20with%20keyboard.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'ArrowLeft':
            console.log('left');
            document.querySelector( 'BUTTON.next-prev' ).click();
            break;
        case 'ArrowRight':
            console.log('right');
            document.querySelector( 'BUTTON.next-next' ).click();
	        break;
	}

})