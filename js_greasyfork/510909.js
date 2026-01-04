// ==UserScript==
// @name           Croxyproxy Improvement
// @namespace      I need a financial help
// @match          https://www.croxyproxy.com/*
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-body
// @noframes       off
// @version        1.0.9.24
// @author         is_competent
// @compatible     Chrome
// @compatible     Firefox
// @license        MIT
// @description    Let you access what you need with your favorite IP address. The best tool to bypass a blockage of any web page (croxyproxy).
// @downloadURL https://update.greasyfork.org/scripts/510909/Croxyproxy%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/510909/Croxyproxy%20Improvement.meta.js
// ==/UserScript==

(() => {
	const localID = Number(GM_getValue('id')) || '';
	const localURL = GM_getValue('urls') || [];

	const main_ = document.createElement('container');
	const help = document.createElement('div');
	const idInput = document.createElement('input');
	const parentHistory = document.createElement('span');
	const historyList = document.createElement('div');
	const urlInput = document.createElement('input');

	idInput.placeholder = '# [40-300]';
	urlInput.placeholder = 'Url here';
	idInput.type = 'number';
	idInput.pattern = '[0-9]*';
	idInput.value = localID;
	urlInput.value = localURL[localURL.length - 1] || '';

	idInput.onkeydown = enterEvt;
	urlInput.onkeydown = enterEvt;
	urlInput.onclick = clickEvt;

	help.textContent = 'I need a financial help, BRO. (is_competent@proton.me)';

	parentHistory.append(urlInput);
	parentHistory.append(historyList);
	main_.append(help);
	main_.append(idInput);
	main_.append(parentHistory);

	document.querySelector('container')?.remove();

	checkBody = setInterval(() => {
		if (!document.body)
			return;
		document.body.prepend(main_);
		clearInterval(checkBody);

	})

	function clickEvt(event) {
		const {
			target
		} = event;

		const X = GM_getValue('urls') ?? [];
		const H = target.nextElementSibling;
		H.style.display = 'block';
		if (!H)
			return;
		H.textContent = '';

		X.forEach(e => {
			const Q = document.createElement('item');
			Q.textContent = e;
			H.append(Q);
		});
		const keyboardEvent = new KeyboardEvent('keydown', {
			key: 'Enter',
			bubbles: true
		});
		H.onclick = (eventH) => {
			const C = eventH.target.textContent;
			target.value = C;
			target.dispatchEvent(keyboardEvent);
			H.style.display = 'none';

		}

	}

	function enterEvt(event) {
		const {
			target
		} = event;
		const parent = target.closest('container');
		const idInput = parent.querySelector('input');
		const urlInput = parent.querySelector('span input');

		if (!/enter/i.test(event.key))
			return;

		const serverID = idInput?.value || '200';
		const urlTOGO = urlInput?.value || 'https://example.net/';
		const csrf = document.querySelector("#request > input[name=csrf]")?.value;
		if (!csrf) {
			alert('But I cannot continue, try on home page...');
			return;
		}

		const X = GM_getValue('urls') ?? [];
		X.push(urlTOGO);

		GM_setValue('id', serverID);
		GM_setValue('urls', [...new Set(X)]);

		fetch("servers", {
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
			},
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": `url=${ encodeURIComponent( urlTOGO ) }&csrf=${ csrf }`,
			"method": "POST"
		}).then(e => e.text()).then(e => {
			const parsedCSRF = /data-csrf=(\S+)/i.exec(e)[1].replaceAll(/&quot;|"/g, '');
			document.querySelector('#xForm')?.remove();
			const form = `
      <form id="xForm" method="POST" action="/requests?fso="><input type="hidden" name="url" value="${ urlTOGO }"><input type="hidden" name="proxyServerId" value="${ serverID }"><input type="hidden" name="csrf" value="${ parsedCSRF }"><input type="hidden" name="demo" value="0"><input type="hidden" name="frontOrigin" value="https://www.croxyproxy.com"><input type=submit></form>`;

			const container = document.querySelector('container');
			container.insertAdjacentHTML('beforeend', form);

			// document.querySelector("body > form [type=submit]").click();
			// document.querySelector("body > form [type=submit]").submit();
			// document.querySelector("body > form").submit();
		});


	}
const STYLE = document.createElement('STYLE');
  STYLE.textContent = `
item:hover {
    opacity: .5;
    color: green;
    cursor: pointer;
}
item {
    display: block;
}
container {
    position: fixed;
    z-index: 10000;
    padding: 5px;
    backdrop-filter: blur(8px);
}
container span {
    display: initial;
    width: 100%;
}
container span div {
    position: static;
    display: none;
    background: lightblue;
    left: 50px;
    margin-left: 136px;
    border-radius: 0 0 8px 8px;
    padding: 5px;
    border: 1px solid;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
}
container form input[type=submit] {
    width: 100%;
}
container input[type='number'] {
    -moz-appearance:textfield;
    margin-right: 5px;
    width: 130px;
}
container input::-webkit-outer-spin-button,
container input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
container span input {
    width: 300px;
}

`;

document.head.append(STYLE);
})();