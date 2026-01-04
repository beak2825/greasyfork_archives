// ==UserScript==
// @name         Тёмное ВСЕ
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Выбери свою сторону!
// @author       Алексей Иващенко
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/447597/%D0%A2%D1%91%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%92%D0%A1%D0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447597/%D0%A2%D1%91%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%92%D0%A1%D0%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

function addStyle( styleString ) {
	const style = document.createElement( "style" );
	style.textContent = styleString;
	document.head.append( style );
}

addStyle(`
html.inverted {
filter: invert(.9) brightness(1.25) hue-rotate(180deg) !important;
}

html.inverted body {
background: #fff !important;
}

html.inverted img {
filter: invert(.9) brightness(1.25) hue-rotate(180deg) !important;
}
`);


window.invertor = function () {
	var appClasses = document.documentElement.classList;
	if (appClasses.contains("inverted")) {
		appClasses.remove("inverted");
        window.localStorage.setItem( "inverted" , "false" );
	} else {
		appClasses.add("inverted");
        window.localStorage.setItem( "inverted" , "true" );
	}
}

if( window.localStorage.getItem( "inverted" ) == "true") {
  document.documentElement.classList.add("inverted");
} else {
  document.documentElement.classList.remove("inverted");
}

})();