// ==UserScript==
// @name         Steam New Queue AutoDiscover
// @version      0.2
// @description  auto run trough steam next fest discovery queue
// @author       gortik
// @license      MIT
// @match        https://store.steampowered.com/explore/
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/protobufjs@7.1.2/dist/light/protobuf.min.js

// @namespace https://greasyfork.org/users/968091
// @downloadURL https://update.greasyfork.org/scripts/452711/Steam%20New%20Queue%20AutoDiscover.user.js
// @updateURL https://update.greasyfork.org/scripts/452711/Steam%20New%20Queue%20AutoDiscover.meta.js
// ==/UserScript==


var	access_token,
	skipDelay = 300,		//in ms
	newDiscoveryQueueModal;


var	jsonGetQueue = {"nested":{"getQueue":{"fields":{"appids":{"rule":"repeated","type":"int32","id":1,"options":{"packed":false}},"b":{"rule":"required","type":"string","id":2},"c":{"rule":"required","type":"string","id":3},"d":{"rule":"required","type":"int32","id":4},"e":{"rule":"required","type":"int32","id":5},"f":{"rule":"required","type":"int32","id":6}}}}},
	jsonSkip = {"nested":{"skipAppid":{"fields":{"a":{"rule":"required","type":"int32","id":1},"appid":{"rule":"required","type":"int32","id":2},"in1":{"rule":"required","type":"In1","id":3}}},"In1":{"fields":{"in2":{"rule":"required","type":"In2","id":1}}},"In2":{"fields":{"a":{"rule":"required","type":"int32","id":1}}}}}



function sleep(ms) {
        return new Promise(resolve => {
		console.log('Sleep: ' + ms/1000 + 's.');
		setTimeout(resolve, ms)
	});
}

function buffer2hex(buffer) {
	function i2hex(i) { return ('0' + i.toString(16)).slice(-2); }
	return Array.from(buffer).map(i2hex).join(' ');
}

function buffer2base64(buffer) {
	let str = buffer.reduce((acc, char) => acc + String.fromCharCode(char) , '');
	return btoa(str);
}

async function getAccessToken() {
	//document.querySelector('#application_config').dataset.loyalty_webapi_token
	/*if (window.location.href.indexOf('steampowered') > -1) {
	}
	else if(window.location.href.indexOf('steamcommunity') > -1) {
	}*/
	let response = await fetch('https://store.steampowered.com/points/shop');
	let text = await response.text();
	let match = text.match(/webapi_token&quot;:&quot;([\d\w]+)&quot/);
	console.log('access_token: ' + match[1]);
	return match[1];
}


//arrGet = [8, 168, 219, 83, 8, 170, 243, 117, 8, 204, 243, 66, 8, 150, 176, 126, 8, 172, 169, 127, 8, 186, 169, 111, 8, 196, 129, 126, 8, 170, 242, 104, 8, 250, 195, 118, 8, 160, 232, 119, 8, 178, 170, 71, 8, 150, 196, 116, 18, 2, 83, 75, 26, 0, 32, 68, 40, 0, 48, 0]
//arrGet = [8, 242, 255, 90, 8, 178, 162, 107, 8, 232, 155, 100, 8, 244, 198, 81, 8, 158, 208, 105, 8, 178, 238, 115, 8, 212, 205, 105, 8, 138, 202, 57, 8, 238, 162, 77, 8, 130, 194, 70, 8, 208, 134, 123, 8, 174, 231, 125, 18, 2, 83, 75, 26, 0, 32, 12, 40, 0, 48, 0]

//accepts base64  or Array  or Uint8Array
function decode(json, messageName, msg) {
	let root = protobuf.Root.fromJSON(json);
	let message = root.lookupType(messageName);
	let arr = [];
	//if msg is array or Uint8Array
	if (Array.isArray(msg) || ArrayBuffer.isView(msg))
		arr = msg;
	else
		protobuf.util.base64.decode(protobufMsg, arr, 0)
	//let arr = new Uint8Array(X)	//X = bytes needed
	return message.decode(arr);
}

//j = decode(jsonGetQueue, 'getQueue', arrGet)

function createPayload(appid) {
	return {
		a: 1,
		appid: appid,
		in1: {
			in2: {
				a: 1235711
			}
		}
	}
}

function encode(json, messageName, payload) {
	let	root = protobuf.Root.fromJSON(json),
		message = root.lookupType(messageName);
	//var payload = { a: 1, appid: 987654, in1: { in2: { a: 1235711 } } };
	let msg_to_send = message.create(payload);
	let buffer = message.encode(msg_to_send).finish();
	return buffer2base64(buffer);
}

async function getQueue() {
	let	body = {
			access_token: access_token,
			input_protobuf_encoded: 'CAESAlNLGAEwAWIGCgQI/7VL'
		},
		url = 'https://api.steampowered.com/IStoreService/GetDiscoveryQueue/v1?' + new URLSearchParams(body).toString(),
		options = {
			"credentials":"omit",
			"headers":{
				"accept":"application/json, text/plain, */*",
				"accept-language":"en-US,en;q=0.9",
				"sec-fetch-mode":"cors",
				"sec-fetch-site":"same-site"
			},
			"referrer":"https://store.steampowered.com/sale/nextfest",
			"referrerPolicy":"no-referrer-when-downgrade",
			"body": null,
			"method": "GET",
			"mode":"cors"
		}
	let response  = await fetch(url, options);
	let arrBuff = await response.arrayBuffer();
	let uint8 = new Uint8Array(arrBuff);
	//let uint8 = Array.from(arrBuff);
	console.log(buffer2base64(uint8));
	let json = decode(jsonGetQueue, 'getQueue', uint8)
	return json;
}


async function postSkip(protobufBase64) {
	let	query = {
			access_token: access_token
		},
		body = {
			input_protobuf_encoded: protobufBase64
		},
		url = 'https://api.steampowered.com/IStoreService/SkipDiscoveryQueueItem/v1?' + new URLSearchParams(query).toString();

	let res = await fetch(url, {
		"headers": {
			"accept": "application/json, text/plain, */*",
			"accept-language": "en-US,en;q=0.9,sk;q=0.8,cs;q=0.7",
			// "content-type": "multipart/form-data; boundary=----WebKitFormBoundary5BetF1tNQduIif48",
			"content-type": "application/x-www-form-urlencoded",
			//"sec-ch-ua": "\";Not A Brand\";v=\"99\", \"Chromium\";v=\"88\"",
			//"sec-ch-ua-mobile": "?0",
			//"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-site"
		},
		//"referrer": "https://store.steampowered.com/",
		//"referrerPolicy": "strict-origin-when-cross-origin",
		//"body": "------WebKitFormBoundary5BetF1tNQduIif48\r\nContent-Disposition: form-data; name=\"input_protobuf_encoded\"\r\n\r\nCAEQsqpHGgYKBAj/tUs=\r\n------WebKitFormBoundary5BetF1tNQduIif48--\r\n",
		"body": new URLSearchParams(body).toString(),
		"method": "POST",
		"mode": "cors",
		"credentials": "omit"
	});
	let text = await res.text();
	if (text == '')
		console.log('OK');
	else
		console.log('')
}

async function skipAppids(appids) {
	let i = 0;
	for (let appid of appids) {
		console.log(appid);

		let payload = createPayload(appid);
		let payload_base64 = encode(jsonSkip, 'skipAppid', payload);
		await postSkip(payload_base64);

		newDiscoveryQueueModal.Dismiss();
		newDiscoveryQueueModal = ShowBlockingWaitDialog('Exploring the queue...', 'Request ' + ++i + ' of ' + appids.length);
		await sleep(skipDelay);
	}
	console.log('Done');
}

function showDoneDialog(queueTotal) {
	if (newDiscoveryQueueModal)
		newDiscoveryQueueModal.Dismiss();
	newDiscoveryQueueModal = ShowConfirmDialog('Done', 'Queue has been explored ' + queueTotal + ' times', 'Open badge page')
		.done(function() {
			window.open('https://steamcommunity.com/my/badges/62', '_blank');
		});
}

function showGeneratingDialog(queueCount, queueTotal) {
	if (newDiscoveryQueueModal)
		newDiscoveryQueueModal.Dismiss();
	newDiscoveryQueueModal = ShowBlockingWaitDialog('Generating the new queue...', 'Generating new discovery queue ' + queueCount + ' of ' + queueTotal);
}

async function skipQueues(queueTotal) {
	let queueCount = 0;
	access_token = access_token || await getAccessToken();
	for (let i = 0; i < queueTotal; i++) {
		queueCount++;
		console.log('Queue #' + queueCount);
		showGeneratingDialog(queueCount, queueTotal);
		let json = await getQueue();
		await sleep(1e3);
		await skipAppids(json.appids);
	}
	showDoneDialog(queueTotal);
}

function addHTML() {
	let parentElem = document.querySelector('.discovery_queue_customize_ctn');
	parentElem.insertAdjacentHTML('afterend', '<div class="discovery_queue_customize_ctn"><div class="btnv6_blue_hoverfade btn_medium" id="js-new-queue-auto"><span>Auto discover new queue</span></div><span>Discover the queue 6 times to get the badge</span></div>')
	let button = document.getElementById('js-new-queue-auto');
	button.addEventListener('click', function() {
		skipQueues(6);
	}, false );
}

(function() {
	'use strict';
	addHTML();
})();
