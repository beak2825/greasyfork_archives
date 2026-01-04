// ==UserScript==
// @name         Omegle IP to location and Watermark Remove
// @description  Shows IP, country, state, city, district, local time, and ISP. Also removes omegle watermark from stranger's video.
// @version      0.8.fork
// @match        https://omegle.com/*
// @match        https://www.omegle.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/789058
// @downloadURL https://update.greasyfork.org/scripts/440941/Omegle%20IP%20to%20location%20and%20Watermark%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/440941/Omegle%20IP%20to%20location%20and%20Watermark%20Remove.meta.js
// ==/UserScript==

//Put api key for ipinfo.io
var apikey = '2ffc300c029aa2';
var tested = [];
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
		if (fields[7] === 'srflx' && !tested.includes(ip)) {
			tested.push(ip);
			getLocation(ip);
		} else {
			console.log(tested.length + ' - ' + ip);
		}
		return pc.oaddIceCandidate(iceCandidate, ...rest);
	};
	return pc;
};
let getLocation = async(ip) => {
	var url = `https://ipinfo.io/${ip}?token=${apikey}`;
	await fetch(url).then((response) =>
		response.json().then((json) => {
			let country = json.country;
			let region = json.region;
			let city = json.city;
			let coords = json.loc;
			let timezone = json.timezone;
			let isp = json.org;
			let info = tested.length + ' - ' + ip;
			document.getElementsByClassName('statuslog')[0].innerHTML = `
<table border="2px">
	<tr>
		<td>Country</td>
		<td>${country}</td>
	</tr>
	<tr>
		<td>Region</td>
		<td>${region}</td>
	</tr>
	<tr>
		<td>City</td>
		<td>${city}</td>
	</tr>
	<tr>
		<td>Coordinates</td>
		<td>${coords}</td>
	</tr>
	<tr>
		<td>ISP</td>
		<td>${isp}</td>
	</tr>
	<tr>
		<td># - IP</td>
		<td>${info}</td>
	</tr>
</table>`;
		})
	);
};