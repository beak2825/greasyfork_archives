// ==UserScript==
// @name         UJ BHK autoclicker
// @version      0.1
// @description  Autoclicker przeklikujacy za nas kurs BHK na UJ!
// @license MIT
// @include https://bhkszkolenia.cm-uj.krakow.pl/szkolenia/slajd/
// @namespace https://greasyfork.org/users/1200341
// @downloadURL https://update.greasyfork.org/scripts/477855/UJ%20BHK%20autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/477855/UJ%20BHK%20autoclicker.meta.js
// ==/UserScript==

function clickIfPossible() {
    if($('#sec').html() === '')
	{
	   $('#bdalej')[0].click();
	}
    else
	{
        setTimeout( clickIfPossible.bind( null), 1000 );
	}
};

clickIfPossible();