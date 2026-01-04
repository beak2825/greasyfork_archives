// ==UserScript==
// @name         e-hentai.org adaptivity
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  minor adaptivity for mobiles on e-hentai.org
// @author       You
// @match        https://e-hentai.org/*
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494855/e-hentaiorg%20adaptivity.user.js
// @updateURL https://update.greasyfork.org/scripts/494855/e-hentaiorg%20adaptivity.meta.js
// ==/UserScript==

function todo(callback, timeout = 500) {
	const intervalId = setInterval(() => {
		console.log('todo: ', callback);
		if ( callback() ) clearInterval(intervalId);
		setTimeout(() => clearInterval(intervalId), timeout);
		if (document.readyState === 'complete') setTimeout(() => clearInterval(intervalId), timeout);
	}, 10)
}

function toRemove(selector, timeout = 500) {
	const intervalId = setInterval(() => {
		const elements = document.querySelectorAll(selector);
		if (elements.length !== 0) elements.forEach(element => element.remove());
		if (document.readyState === 'complete') setTimeout(() => clearInterval(intervalId), timeout);
	}, 10)
}

if (location.pathname == '/') {
	todo(() => {
		const select = document.querySelector('select');

		if (select && select.value) {
			if (select.value === 't') return true;

			const event = new Event('change');
			select.value = 't';
			select.dispatchEvent(event);
		}

	}, 0)

}

if (location.href.split('/')[3] === 's') {

	const styleElement = document.createElement('style');

	const cssText = 
	`
	h1, #i2, #i4 > div:not(.sn) {
		display: none !important;
	}

	body {
		padding: 0 !important;
	}

	.sni {
		border: 0 !important;
	}

    .sn {
        height: 90px !important;
    }
    
    .sn > a > img {
        height: 90px;
        width: 90px;
    }
    
    .sn > div {
        margin: 0 20px !important;
        font-size: 20px !important;
        display: inline-block !important;
        transform: translateY(79px) !important;
    }
    
    #i4 > div {
        overflow: unset !important;
    }
    
    #i5 {
        height: 90px !important;
    }
    
    .sb > a, .sb > a > img {
        transform: translateY(-79px) !important;
    }
    
    .sb > a > img {
        height: 90px;
        width: 90px;
    }
    
    .dp {
        display: none;
    }
    
    #gd4 {
        width: calc(90% - 170px) !important;
    }
    
    #gd5 {
        display: none;
    }
	`;
	styleElement.textContent = cssText;

	document.head.appendChild(styleElement);
}


toRemove('[allowtransparency=true]');
























