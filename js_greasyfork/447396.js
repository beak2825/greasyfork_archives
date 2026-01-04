// ==UserScript==
// @name         hippo messages
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Close external product tabs
// @author       e-c
// @include      https://map.md/*
// @include      https://felicia.md*
// @include      http://medicamente.md/*
// @include      https://medicamente.md/*
// @include      https://www.apteka.md/*
// @include      https://farmacie-online.md/*
// @include      https://ff.md/*
// @include      https://orient.md/*
// @include      https://vitapharm.md/*
// @include      https://mamico.md/*
// @include      https://farmacie.md/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447396/hippo%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/447396/hippo%20messages.meta.js
// ==/UserScript==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	// window.addEventListener('message', event => {
	//     // IMPORTANT: check the origin of the data!
	//     if (event.origin.startsWith('https://hippo.md')) {
	//         // The data was sent from your site.
	//         // Data sent with postMessage is stored in event.data:
 //            event.source.postMessage(location.href, event.origin);
	//     } else {
	//         // The data was NOT sent from your site!
	//         // Be careful! Do not use it. This else branch is
	//         // here just for clarity, you usually shouldn't need it.
	//         return;
	//     }
	// });

	window.addEventListener('message', event => {
	    // IMPORTANT: check the origin of the data!
	    if (event.origin.startsWith('https://hippo.md') || event.origin.startsWith('http://emed.loc')) {
	        // The data was sent from your site.
	        // Data sent with postMessage is stored in event.data:
	        // console.log(event.data);
	        // alert(event.data);
	        copyToClipboard(event.data);
	        event.source.postMessage(location.href, event.origin);
            // NEW place search in input
	    } else {
	        // The data was NOT sent from your site!
	        // Be careful! Do not use it. This else branch is
	        // here just for clarity, you usually shouldn't need it.
	        return;
	    }
	});

	document.body.addEventListener("keydown", function(e){
	    if (e.keyCode === 83 && e.altKey) {
			window.opener.postMessage("alt+s", "*");
	    }
	});

    const copyToClipboard = str => {
	    const el = document.createElement('textarea');
	    el.value = str;
	    el.setAttribute('readonly', '');
	    el.style.position = 'absolute';
	    el.style.left = '-9999px';
	    document.body.appendChild(el);
	    el.select();
	    document.execCommand('copy');
	    document.body.removeChild(el);
	};

})();