// ==UserScript==
// @name         Sneakybeaky Stackexchange
// @version      1.1
// @description  WIP - Removes stuff to make browsing stackexchange sites more sneaky
// @author       Salad
// @match        https://*.stackexchange.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/411414
// @downloadURL https://update.greasyfork.org/scripts/393207/Sneakybeaky%20Stackexchange.user.js
// @updateURL https://update.greasyfork.org/scripts/393207/Sneakybeaky%20Stackexchange.meta.js
// ==/UserScript==

$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.sstatic.net/Sites/stackoverflow/primary.css?v=d385c34dc2d7">');
$('.site-header').remove();
$('.s-input__search').prop('placeholder', 'Search...');
$('link[rel="shortcut icon"]').attr('href', 'https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d');
$('.site-footer').css('background-color', '#666');
$('.s-btn__primary').css({'background-color': '#666', 'border': 0});
$('.s-input__search').prop('placeholder', 'Search...')
$('link[rel="shortcut icon"]').attr('href', 'https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d');
$('.network-logo').html('<div style="background: transparent url(\'https://cdn.sstatic.net/Img/unified/sprites.svg?v=e5e58ae7df45\') 0 -500px no-repeat;width: 150px;text-indent: -1000px;height: 35px;">fuckyou</div>');

var h1s = document.querySelectorAll("h1");
for (let i = h1s.length -1 ; i >=0; i--) {
	let h1 = h1s[i];
	let p = document.createElement("p");
	p.appendChild(h1.firstChild);
	h1.parentNode.insertBefore(p, h1);
	h1.parentNode.removeChild(h1);
}
var h2s = document.querySelectorAll("h2");
for (let i = h2s.length -1 ; i >=0; i--) {
	let h2 = h2s[i];
	let p = document.createElement("p");
	p.appendChild(h2.firstChild);
	h2.parentNode.insertBefore(p, h2);
	h2.parentNode.removeChild(h2);
}
var h3s = document.querySelectorAll("h3");
for (let i = h3s.length -1 ; i >=0; i--) {
	let h3 = h3s[i];
	let p = document.createElement("p");
	p.appendChild(h3.firstChild);
	h3.parentNode.insertBefore(p, h3);
	h3.parentNode.removeChild(h3);
}