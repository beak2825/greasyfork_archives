// ==UserScript==
// @name Avgle
// @Version 0.1
// @author mun
// @include http://.avgle.com/
// @include https://.avgle.com/
// @include https://avgle.com/*
// @grant none
// @description:en 666
// @version 0.0.1.20180126035016
// @namespace https://greasyfork.org/users/168192
// @description 666
// @downloadURL https://update.greasyfork.org/scripts/37819/Avgle.user.js
// @updateURL https://update.greasyfork.org/scripts/37819/Avgle.meta.js
// ==/UserScript==

(function() {
var f = function(a, b, c) {
return true;
};
if ( window.hasOwnProperty('checkElem') ) {
window.checkElem = f;
} else {
Object.defineProperty(window, 'checkElem', f);
}
if ( window.hasOwnProperty('checkThings') ) {
window.checkThings = f;
} else {
Object.defineProperty(window, 'checkThings', f);
}
})();
