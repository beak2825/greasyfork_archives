// ==UserScript==
// @name         HHU Revive Request Script
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Harasses someone from HHU to revive you.
// @author       not Mavri [2402357]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @homepage     https://mavriware.me
// @require      https://cdn.jsdelivr.net/npm/axios@~0.21.1/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/axios-userscript-adapter@~0.1.2/dist/axiosGmxhrAdapter.min.js
// @connect      mavriware.me
// @downloadURL https://update.greasyfork.org/scripts/430000/HHU%20Revive%20Request%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/430000/HHU%20Revive%20Request%20Script.meta.js
// ==/UserScript==


/* eslint-disable no-shadow */
/* eslint-disable no-inline-comments */
/* eslint-disable no-undef */

'use strict';

setTimeout(renderButton, 500);

axios.defaults.adapter = axiosGmxhrAdapter;


GM_addStyle(`
    .imp {
    box-shadow:inset 0px 1px 0px 0px #cf866c;
    background:linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
    background-color:#d0451b;
    border-radius:1em;
    border:1px solid #942911;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:.75em;
    padding:.3em .5em;
    text-decoration:none;
    text-shadow:0px 1px 0px #854629;
    margin-bottom: .7em;
}
.imp:hover {
    background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
    background-color:#bc3315;
}
.imp:active {
    position:relative;
    top:1px;
}
`);

function renderButton() {
	if (!document.getElementById('imp-button')) {
		let sidebar;
		let elem;
		try {
			sidebar = getSidebar();
			if (sidebar.statusIcons.icons.hospital) { // true if ape's in hospital
				if (sidebar.windowSize != 'mobile') {
					elem = document.querySelector('#barLife');
				}
				if (sidebar.windowSize == 'mobile') {
					elem = document.querySelector('.header-buttons-wrapper');
				}
				if (elem != null) {
					const html = '<a href="#" class="imp" id="imp-button">REVIVE ME</a>';
					elem.children[0].insertAdjacentHTML('beforebegin', html);
					const impButton = document.getElementById('imp-button');
					impButton.addEventListener('click', function() {
						sendInfo();
					});
				}

			}
		}
		catch (e) {
			/* ! die lol */
		}
	}
	setTimeout(renderButton, 500);
}

function sendInfo() {

	const sidebar = getSidebar();
	const uid = sidebar.user.userID;
	const name = sidebar.user.name;
	const faction = sidebar.statusIcons.icons.faction.subtitle.split(' of ')[1];
	const source = 'IMPS';
	const url = 'http://api.mavriware.me/revive';
	const hospitalIcon = sidebar.statusIcons.icons.hospital;

	if (hospitalIcon == null) {
		alert('You are not in the hospital!');
	}
	else {
		const obj = {
			'userID': uid,
			'userName': name,
			'factionName': faction,
			'source': source,
		};

		console.log(obj);

		axios({
			method: 'post',
			url: url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: obj,
		});
		alert('Request sent');
	}
}

function getSidebar() {
	const key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
	const sidebarData = JSON.parse(sessionStorage.getItem(key));
	return sidebarData;
}