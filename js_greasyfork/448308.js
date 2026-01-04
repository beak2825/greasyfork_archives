// ==UserScript==
// @name         Amazonプライム倍速
// @namespace    https://toogiri.buhoho.net/
// @version      0.2.1
// @description  Amazonプライムの再生速度します。
// @author       buhoho
// @match        https://www.amazon.co.jp/*video*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448308/Amazon%E3%83%97%E3%83%A9%E3%82%A4%E3%83%A0%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/448308/Amazon%E3%83%97%E3%83%A9%E3%82%A4%E3%83%A0%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let rate = window.sessionStorage.getItem('amazon_prime_baisoku_rate') || 1.0;

	document.head.querySelector('style').textContent += `
		.primeSpeedCtr {
			color: #aaa;
            display: block;
			background-color: #112;
			position: fixed;
			top: 0;
			left: 0;
			width: 2rem;
			height: 1.2rem;
			z-index: 99999;
            overflow: hidden;
		}
        .primeSpeedCtr:hover {
            width: 7rem;
        }
		.primeSpeedCtr p {
			display: inline-block;
			width: 4rem;
		}
		.primeSpeedCtr button {
			display: inline-block;
		}
	`;

	let ctr = document.createElement("div");
	ctr.className = "primeSpeedCtr";

	let p = document.createElement("p");
	ctr.append(p);

	let b2 = document.createElement("button");
	b2.textContent = "🐢";
	b2.onclick = function () {
		rate = Math.round((rate - 0.1) * 10) / 10;
        baisoku();
	};
	ctr.append(b2);

	let b1 = document.createElement("button");
	b1.textContent = "🐰";
	b1.onclick = function () {
		rate = Math.round((rate + 0.1) * 10) / 10;
        baisoku();
	};
	ctr.append(b1);

	document.body.append(ctr);

	function baisoku () {
		document.querySelectorAll('video').forEach(v => v.playbackRate = rate);
        if (document.querySelectorAll('video').length > 0) {
        }
		p.textContent = rate + 'x';
		console.log('プライムビデオ' + rate + 'xします');
        window.sessionStorage.setItem('amazon_prime_baisoku_rate', rate)
	}
	setInterval(baisoku, 1500);
})();
