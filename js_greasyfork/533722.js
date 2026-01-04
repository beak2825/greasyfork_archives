// ==UserScript==
// @name         eh-display-fit
// @namespace    http://e-hentai.org
// @version      1.0.3
// @description  ehentai display fit
// @author       Vick Scarlet
// @match        *://e-hentai.org/s/*
// @match        *://exhentai.org/s/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @grant        GM_addStyle
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/533722/eh-display-fit.user.js
// @updateURL https://update.greasyfork.org/scripts/533722/eh-display-fit.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`
body>*:not(#i1) {display: none;}
body,#i1 {
	display: grid;
	place-items: center;
	height: 100vh;
	margin: 0;
	padding: 0;
	border: none;
	overflow: hidden;
}


#i1 {
	background: none;
	height: 100vh !important;
	width: 100vw !important;
	#i2, #i4>div:not(.sn),#i4>.sn>a, #i5 {
		display: none;
	}
	h1, #i4,#i5, #i6 {
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background: rgb(0 0 0 / 0.2) ;
		backdrop-filter: blur(5px);
		margin: 0;
		padding: 0 5px 2px 5px;
		text-shadow: black 0 1px 4px;
		a {
			color: white !important;	
		}
	}
	#i4 {
		right: 0;
		left: auto;
		transform: none;
		.sn {
			padding: 5px;
			height: auto;
			width: auto;
			div{
				margin: 0;
			}
		}
	}
	#i6 {
		top: auto;
		bottom: 0;
	}
	#img {
		width: auto !important;
		max-height: 100vh;
        max-width: 100vw;
	}
}`)
    window.addEventListener('keydown',(e)=>{
		switch(e.key) {
			case 'z': document.querySelector('.sn>a:first-child').click(); break;
			case 'x': document.querySelector('.sn>#prev').click(); break;
			case 'c': document.querySelector('.sn>#next').click(); break;
			case 'v': document.querySelector('.sn>a:last-child').click(); break;
			case 'd': document.querySelector('#i5 a').click(); break;
		}
	})

})();