// ==UserScript==
// @name         Cloudflare Bypasser
// @namespace    https://app.zenrows.com/builder
// @version      0.3
// @description  None
// @author       Sing Developments
// @match        https://www.nitrotype.com/*
// @match        https://www.nitrotype.com/race/*
// @icon         https://singdevelopmentsblog.files.wordpress.com/2022/11/nitrotype-logo.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468245/Cloudflare%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/468245/Cloudflare%20Bypasser.meta.js
// ==/UserScript==

// npm install axios
const axios = require('axios');

const url = 'https://nitrotype.com/race';
const apikey = '9bb81c39a90e3ddf85091025e2bbc4724c2f5f99';
axios({
	url: 'https://api.zenrows.com/v1/',
	method: 'GET',
	params: {
		'url': url,
		'apikey': apikey,
		'antibot': 'true',
		'premium_proxy': 'true',
		'proxy_country': 'ca',
	},
})