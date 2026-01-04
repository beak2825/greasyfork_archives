// ==UserScript==
// @name         Omegle IP to location and Watermark Remove
// @description  Shows IP, country, state, city, district, local time, and ISP. Also removes omegle watermark from stranger's video.
// @version      1.0
// @match        https://omegle.com/*
// @match        https://www.omegle.com/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/789058
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428830/Omegle%20IP%20to%20location%20and%20Watermark%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/428830/Omegle%20IP%20to%20location%20and%20Watermark%20Remove.meta.js
// ==/UserScript==

const apiService = "ipinfo" // must be "ipinfo" or "ipapi"
const apiKey = "" // gets better results with ipinfo, and does nothing for ip-api
var tested = [];
if (localStorage.getItem('tests') !== null) {
	tested = JSON.parse(localStorage.getItem('tests'));
}
var session = 0;
var lastQuery = Date.now();
window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function (...args) {
	const pc = new window.oRTCPeerConnection(...args);
	pc.oaddIceCandidate = pc.addIceCandidate;
	pc.addIceCandidate = function (iceCandidate, ...rest) {
		if (document.getElementById('videologo') instanceof Object) {
			document.getElementById('videologo').remove();
		}
		const fields = iceCandidate.candidate.split(' ');
		const ip = fields[4];
		if (fields[7] === 'srflx') {
			for (var i of tested) {
				if (i.query == ip) {
					makeTable(i);
				}
			}
			if (document.getElementsByTagName('table').length < 2 & lastQuery+1000 < Date.now()) {
				getLocation(ip);
			}
		}
		console.log(tested.length + ' - ' + ip);
		return pc.oaddIceCandidate(iceCandidate, ...rest);
	};
	return pc;
};
function getLocation(ip) {
	lastQuery = Date.now();
	var endpoint = `https://ipinfo.io/${ip}/json?token=${apiKey}`;
	if (apiService == "ipapi") {
		endpoint = `http://ip-api.com/json/${ip}?fields=18561529`;
	}
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			response.timezone = new Intl.DateTimeFormat([],{timeZone:response.timezone,year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).format(new Date());
			response.total = tested.length;
			tested.push(response);
			localStorage.setItem('tests',JSON.stringify(tested));
			makeTable(response);
		}
	};
	xhr.open('GET', endpoint, true);
	xhr.send();
}
function makeTable(json) {
	session ++;
	json.session = session;
	var table = '<table border="2px">';
	for (const thing in json) {
		table += `<tr><td>${thing.charAt(0).toUpperCase()+thing.substring(1)}</td><td>${json[thing]}</td></tr>`;
	}
	table += '</table>';
	document.getElementsByClassName('statuslog')[0].innerHTML = table;
}