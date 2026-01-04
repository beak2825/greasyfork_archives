// ==UserScript==
// @name         Web Panda Ham yuvaraja
// @namespace    yuvaraja
// @version      1.4
// @description  Single-GID ham cycler. Speed and low SLOC.
// @author       yuvaraja
// @include      https://worker.mturk.com/requesters/pandaHamHandler*
// @include      https://worker.mturk.com/requesters/registerPandaHam
// @grant        GM_xmlhttpRequest
// @connect      worker.mturk.com
// @connect      amazon.com
// @connect      mturk.com
// @downloadURL https://update.greasyfork.org/scripts/38145/Web%20Panda%20Ham%20yuvaraja.user.js
// @updateURL https://update.greasyfork.org/scripts/38145/Web%20Panda%20Ham%20yuvaraja.meta.js
// ==/UserScript==

const INTERVAL_MS = 1000;
const MAX_MESSAGES = 10;

var gid;
var xhrParams;

var messages = [];
for(let i = 0; i < MAX_MESSAGES; i++) {
	messages[i] = "&nbsp";
}

var gidSpan;
var logsDiv;
var responseSpan;

var pingIndex = 0;

function register() {
	navigator.registerProtocolHandler(
		"web+panda", // This will always be "web+panda".
		"https://worker.mturk.com/requesters/pandaHamHandler?url=%s", // %s will contain a URL-encoded version of the entire web+panda://(stuff) URL, including the protocol.
		" Web Panda Handler (Ham)"); // User-readable string for the protocol rule.

	newMessage(`Look for a prompt or an icon, usually in or around the URL bar, then click "accept", "approve", "allow", or something along those lines.`);
	newMessage("This script is trying to register itself as a protocol handler for web+panda:// links, but it needs your approval.");
	renderMessages();
}

function ping() {
	newMessage(`${pingIndex} Pinging. (${performance.now()})`);
	renderMessages(logsDiv);
	pingIndex++;
	GM_xmlhttpRequest(xhrParams);
}

function handle() {

	renderMessages(logsDiv);

	var parsedLandingPage = new URL(window.location.href);
	var parsedWebPandaLink = new URL(parsedLandingPage.searchParams.get("url"));
	var gid = parsedWebPandaLink.pathname.replace("//", "");

	gidSpan.innerText = gid;

	xhrParams = {
		method: "GET",
		headers: {
			Accept: "application/json"
		},
		url: `https://worker.mturk.com/projects/${gid}/tasks/accept_random`,
		onload: function(response) {
			responseSpan.innerText = response.responseText;
		}
	};

	setInterval(ping, INTERVAL_MS);
}


function setLayout() {
	document.head.innerHTML = "";
	document.body.innerHTML = `
<div>GID: <span id="gid"></div>
<div id="logs"></div>
<div>Response <span id="response"></span></div>
<style>
div {
    margin: 10px;
}
#gid {
    color: green;
}
#response {
    color: orange;
}
</style>
`;
	gidSpan = document.getElementById("gid");
	logsDiv = document.getElementById("logs");
	responseSpan = document.getElementById("response");
}

function newMessage(message) {
	messages.unshift(message);
	while(messages.length > MAX_MESSAGES) {
		messages.pop();
	}
}

function renderMessages(element) {

	if(!element) {element = document.body;}

	var messagesHTML = "";

	for(const message of messages) {
		messagesHTML += `<div>${message}</div>`;
	}

	element.innerHTML = messagesHTML;
}

function main() {

	setLayout();

	if(window.location.pathname.includes("registerPandaHam")) {
		register();
	}
	else {
		handle();
	}
}

main();