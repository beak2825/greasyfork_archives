// ==UserScript==
// @name         Ranobelib.me/Mangalib.me autolike
// @name:ru   Ranobelib.me/Mangalib.me автолайк
// @namespace    http://tampermonkey.net/
// @version      0.16.2
// @description  The script will like every chapter for you!
// @description:ru Этот скрипт будет ставить лайки на главы за вас!
// @author       HapetuDev
// @match        https://ranobelib.me/*
// @match        https://mangalib.me/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @icon         https://ranobelib.me/icons/android-icon-72x72.png?333
// @downloadURL https://update.greasyfork.org/scripts/437155/RanobelibmeMangalibme%20autolike.user.js
// @updateURL https://update.greasyfork.org/scripts/437155/RanobelibmeMangalibme%20autolike.meta.js
// ==/UserScript==
/*
global $
*/
(async () => {
    'use strict';
	let click = function() {$('div[data-reader-like]').click();console.log("Liked after "+time+" milliseconds");}
	let time = Math.round((Math.min(Math.max(Math.random()*10,1),5))*500);
	setTimeout(click, time);
})();