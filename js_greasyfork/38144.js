// ==UserScript==
// @name         Web Panda yuvaraja
// @namespace    yuvaraja
// @version      11.0
// @description  Latest update: Fixed the value in the "survey accepted" notification so that it always uses 2 decimal places for the cents value.
// @author       Cuyler Stuwe (salembeats)
// @include      https://worker.mturk.com/requesters/handleWebPanda*
// @include      https://worker.mturk.com/requesters/registerWebPanda
// @grant        GM_xmlhttpRequest
// @connect      worker.mturk.com
// @connect      amazon.com
// @connect      mturk.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_notification
// @icon         https://i.imgur.com/snRSm80.gif
// @require      https://greasyfork.org/scripts/36173-panda-crazy-helper-emulation/code/Panda%20Crazy%20Helper%20Emulation.js?version=243252
// @downloadURL https://update.greasyfork.org/scripts/38144/Web%20Panda%20yuvaraja.user.js
// @updateURL https://update.greasyfork.org/scripts/38144/Web%20Panda%20yuvaraja.meta.js
// ==/UserScript==

const IS_BENCHMARKING_ENABLED = true;

if(IS_BENCHMARKING_ENABLED === false) {
	console.time = ()=>{};
	console.timeEnd = ()=>{};
}

const SHOULD_INDICATE_TURN_WITH_FULL_YELLOW_SCAN = false;

// const GID_IN_DATABASE_EMOJI = "?"; // Using icons rather than emoji now.

const POKEBALL_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/2000px-Pok%C3%A9_Ball_icon.svg.png";

const CAUGHT_IMAGE = POKEBALL_IMAGE;
const REPEAT_IMAGE = "https://cdn3.iconfinder.com/data/icons/unicons-vector-icons-pack/32/repeat2-512.png";
const NEW_IMAGE    = "http://www.pvhc.net/img1/wmdxhwvvvzadyfetxqda.png";

const CAUGHT_IMAGE_SIZE_PX = 16;
const CAUGHT_IMAGE_WIDTH_PX  = CAUGHT_IMAGE_SIZE_PX;
const CAUGHT_IMAGE_HEIGHT_PX = CAUGHT_IMAGE_SIZE_PX;

const REPEAT_IMAGE_SIZE_PX = CAUGHT_IMAGE_SIZE_PX;
const REPEAT_IMAGE_WIDTH_PX = REPEAT_IMAGE_SIZE_PX;
const REPEAT_IMAGE_HEIGHT_PX = REPEAT_IMAGE_SIZE_PX;

const NEW_IMAGE_HEIGHT_PX = 16;

window.addEventListener("beforeunload", function(event) {
	if(location.href.includes("registerWebPanda")) {return;}
	let newInstanceCount;
	GM_setValue("web-panda-instance-count", newInstanceCount = GM_getValue("web-panda-instance-count") - 1);
	GM_setValue("web-panda-last-removed", handlerIndex);
	if(GM_getValue("web-panda-turn") >= GM_getValue("web-panda-instance-count")) {
		GM_setValue("web-panda-turn", GM_getValue("web-panda-instance-count")-1);
	}
	if(newInstanceCount === 0) {
		GM_deleteValue("web-panda-turn");
	}
});

console.time("Initial cache load and parse");
let storedMetadata;
var gidMetadataCache = ( (storedMetadata = GM_getValue("gidMetadataCache")) ? JSON.parse(storedMetadata) : {} );
console.timeEnd("Initial cache load and parse");

function getMetadata(gid, key) {
	if(!Boolean(gidMetadataCache[gid])) {return undefined;}
	else if(gidMetadataCache[gid][key] === null || gidMetadataCache[gid][key] === "") {return undefined;}
	else {return gidMetadataCache[gid][key];}
}

function hasMetadata(gid, key) {
	if(!Boolean(gidMetadataCache[gid])) {return false;}
	if(gidMetadataCache[gid][key] === undefined || gidMetadataCache[gid][key] === "") {return false;}
	return true;
}

function createFreshMetadataGID(key, value) {
	let newMetadataGID = {
		createdTimestamp: Date.now(),
		updatedTimestamp: Date.now()
	};

	if(key) {
		newMetadataGID[key] = value;
	}

	return newMetadataGID;
}

function setMetadata(gid, key, value) {
	if(!Boolean(gidMetadataCache[gid])) {
		gidMetadataCache[gid] = createFreshMetadataGID(key,value);
	}
	else {gidMetadataCache[gid][key] = value;}
}

function saveStoredMetadata() {
	console.time("Metadata storing");
	GM_setValue("gidMetadataCache", JSON.stringify(gidMetadataCache));
	console.timeEnd("Metadata storing");
}

function getStoredMetadata() {
	console.time("Metadata retrieval and parsing");
	let returnVal = JSON.parse(GM_getValue("gidMetadataCache") || "{}");
	console.timeEnd("Metadata retrieval and parsing");
	return returnVal;
}

function mergeUndefinedMetadata(gid, metadataChunk) {
	let metadataKeys = Object.keys(metadataChunk);

	if(!Boolean(gidMetadataCache[gid])) { gidMetadataCache[gid] = createFreshMetadataGID(); }

	for(let metadataKey of metadataKeys) {

		let existingValue = gidMetadataCache[metadataKey];

		if(existingValue === undefined || existingValue === "") {
			gidMetadataCache[gid][metadataKey] = metadataChunk[metadataKey];
		}

	}
}

function mergeUndefinedMetadataAndSave(gid, metadataChunk) {
	mergeUndefinedMetadata(gid, metadataChunk);
	saveStoredMetadata();
}

document.head.innerHTML = "";
document.body.innerHTML = "";

/*
Notification.requestPermission().then( function(permission) {
	if (permission === 'denied') {
		console.log("not allowed to use notifications.");
		return;
	}

	if (permission === 'default') {
		console.log("didn't decide whether or not to allow notifications.");
		return;
	}

	console.log(`Notification permission`, permission);
});
*/

/*
var notifyFinalWage = new Notification(
	`title`, {
		body: `body`,
		icon: `https://248qms3nhmvl15d4ne1i4pxl-wpengine.netdna-ssl.com/wp-content/uploads/2017/12/be-760x400.png`
	});
*/

const EMPTY_STRING_ARRAY_RESPONSE = [""];

const READYSTATE_FINISHED = 4;

let handlerIndex;

let statusMessages = [];

var pandaTimeoutHandle;

var pingFunction;

statusMessages.messageIdIndex = 1;

statusMessages.addStatus = function(message, maxMessages = 10) {
	this.unshift(`${this.messageIdIndex}: ${message}`);
	this.messageIdIndex++;
	while(this.length > maxMessages) {
		this.pop();
	}
};

statusMessages.renderHTML = function() {
	let aggregate = "";
	for(let i = 0; i < this.length; i++) {
		aggregate += this[i] + "<br/>";
	}
	return aggregate;
};

const PANDA_DELAY_DEFAULT = 1000;

document.head.insertAdjacentHTML("afterbegin", `
<head>
<style>
.tiny-caps {
font-size: 0.7em;
text-transform: uppercase;
}
.hit-value {
font-weight: bold;
color: green;
}
</style>
</head>`);

document.body.insertAdjacentHTML("afterbegin", `
<body>
<div><span class="tiny-caps">Title:</span> <span id="hitTitle" style="color:purple; font-weight: bold;"></span> <span id="loadedFromCacheIndicator"></span> <span id="caughtSpan"></span> <span class="tiny-caps">Description:</span> <span id="hitDescription" style="color:purple; font-weight: bold;"></span></div>
<div><span class="tiny-caps">Requester:</span> <span id="requesterName" style="color:purple; font-weight: bold;"></span> <span class="tiny-caps">Requester ID:</span> <span id="rid" style="color:purple; font-weight: bold;"></span></div>
<div>Close On Accept: <input type='checkbox' id='closeOnAccept'> Index: <span id='instanceIndex'></span> / Instances: <span id='instanceCount'></span> / Turn: <span id='turn'></span> <span id="scanIndicator"></span></div>
<div>Running Panda for GID: <span id="gidSpan"></span> (<span class="hit-value">$<span id="hitValue"></span></span>)</div>
<div>Found at: <span id="sourceURL"></span></div>
<div>Panda Delay: <input id="pandaDelay" type="range" min="700" max="3000" value=${PANDA_DELAY_DEFAULT}> <span id="pandaDelayMsDisplay">${PANDA_DELAY_DEFAULT}</span>ms <span style='border: 1px dashed black; padding: 4px; background-color: #FFFFE0;'>Transfer to PC: <button id='transferToPandaCrazy'>HIT</button> <button id='transferAllToPandaCrazy'>All HITs</button> </span></div>
<div id="status"></div>
<div id="lastResponse"></div>
</body>
`);

function transferToPandaCrazy() {
	PandaCrazy.addJob(document.querySelector("#gidSpan").innerText.trim());
	window.close();
}

document.getElementById("transferToPandaCrazy").addEventListener("click", function(event) {
	transferToPandaCrazy();
});

GM_addValueChangeListener("transfer-to-panda-crazy", function(name, oldValue, newValue, remote) {
	transferToPandaCrazy();
	GM_setValue("web-panda-instance-count", 0);
	GM_deleteValue("web-panda-turn");
});

document.getElementById("transferAllToPandaCrazy").addEventListener("click", function(event) {
	GM_setValue("transfer-to-panda-crazy", Math.random());
});

GM_addValueChangeListener("web-panda-instance-count", function(name, oldValue, newValue, remote) {
	document.querySelector("#instanceCount").innerHTML = newValue;
	if(handlerIndex >= newValue - 1) {
		handlerIndex--;
		if(handlerIndex <= 0) {handlerIndex = 0;}
		document.querySelector("#instanceIndex").innerHTML = handlerIndex;
	}
	else {
	}
	clearTimeout(pandaTimeoutHandle);
	pandaTimeoutHandle = setTimeout(pingFunction, pandaDelay);
});

GM_addValueChangeListener("web-panda-turn", function(name, oldValue, newValue, remote) {
	document.querySelector("#turn").innerHTML = newValue;
});

GM_addValueChangeListener("web-panda-last-removed", function(name, oldValue, newValue, remote) {
	document.querySelector("#instanceIndex").innerHTML = handlerIndex;
});

GM_addValueChangeListener("push-new-panda-delay-value", function(name, oldValue, newValue, remote) {
	pandaDelay = newValue;
	document.querySelector("#pandaDelay").value = pandaDelay;
	clearTimeout(pandaTimeoutHandle);
	pandaTimeoutHandle = setTimeout(pingFunction, pandaDelay);
	document.getElementById("pandaDelayMsDisplay").innerText = pandaDelay;
});

let pandaDelay          = PANDA_DELAY_DEFAULT;
let pandaDelayElement   = document.getElementById("pandaDelay");
let pandaDelayMsDisplay = document.getElementById("pandaDelayMsDisplay");
let statusDisplay       = document.getElementById("status");
let closeOnAccept       = document.getElementById("closeOnAccept");
let scanIndicator       = document.getElementById("scanIndicator");

let hitTitleSpan        = document.getElementById("hitTitle");
let hitDescriptionSpan  = document.getElementById("hitDescription");
let requesterNameSpan   = document.getElementById("requesterName");
let requesterIDSpan     = document.getElementById("rid");
let hitValueSpan        = document.getElementById("hitValue");

let sourceURLSpan       = document.getElementById("sourceURL");

let loadedFromCacheIndicator = document.getElementById("loadedFromCacheIndicator");
let caughtSpan = document.getElementById("caughtSpan");

function isMissingSomeMetadata() {
	return hitTitleSpan.innerText === "" || hitDescriptionSpan.innerText === "" ||
		requesterNameSpan.innerText === "" || requesterIDSpan.innerText === "";
}

pandaDelayElement.addEventListener("change", function(event) {
	pandaDelay = event.target.value;
	pandaDelayMsDisplay.innerText = pandaDelay;
	GM_setValue( "push-new-panda-delay-value", event.target.value );
});

function cycleToNextHandler() {
	document.body.style.backgroundColor = "white";
	GM_setValue( "web-panda-turn", (GM_getValue("web-panda-turn") + 1) % GM_getValue("web-panda-instance-count") );
}

if(window.location.href.includes("registerWebPanda")) {

	document.getElementById("status").innerHTML = "<p style='background-color: red; color: white; display: inline-block;'>Check around your title bar for an allow/deny prompt, or a diamond-shaped icon to click to allow this app to handle web+panda:// links.</p>";

	// This is how you register the Web Panda protocol in your app.
	navigator.registerProtocolHandler(
		"web+panda", // This will always be "web+panda".
		"https://worker.mturk.com/requesters/handleWebPanda?gid=%s", // %s will contain a URL-encoded version of the entire web+panda://(stuff) URL, including the protocol.
		" Web Panda Handler (Default Handler)"); // User-readable string for the protocol rule.
}
else { // We're actually trying to grab a panda.

	let instanceCount;
	let storedPrevInstanceCount = GM_getValue("web-panda-instance-count");
	if(storedPrevInstanceCount < 0) {storedPrevInstanceCount = 0;}
	GM_setValue("web-panda-instance-count", instanceCount = (storedPrevInstanceCount || 0) + 1);
	handlerIndex = instanceCount - 1;
	document.querySelector("#instanceIndex").innerHTML = handlerIndex;

	// Basic parsing of the web+panda protocol.

	let webPandaURL = decodeURIComponent(window.location.href.match(/gid=(.*)/)[1]);
	let webPandaURLWithDecodedArguents = decodeURIComponent(webPandaURL);
	let parsedWebPandaURL = new URL(webPandaURL);
	let webPandaURLParams = parsedWebPandaURL.searchParams;
	let pandaGID    = (webPandaURL.match(/3[A-Za-z0-9]{29}/) || EMPTY_STRING_ARRAY_RESPONSE)[0].toUpperCase();
	let pandaURL    = `https://worker.mturk.com/projects/${pandaGID}/tasks/accept_random`;

	let once           = webPandaURLParams.get("once") === "true" || webPandaURLParams.get("batchOrSurvey") === "survey";

	let hitTitle       = getMetadata(pandaGID, "hitTitle")          || (webPandaURLWithDecodedArguents.includes("hitTitle=") ? webPandaURLParams.get("hitTitle") : "");
	let hitDescription = getMetadata(pandaGID, "hitDescription")    || (webPandaURLWithDecodedArguents.includes("hitDescription=") ? webPandaURLParams.get("hitDescription") : "");
	let requesterName  = getMetadata(pandaGID, "requesterName")     || (webPandaURLWithDecodedArguents.includes("requesterName=") ? webPandaURLParams.get("requesterName") : "");
	let requesterID    = getMetadata(pandaGID, "rid")               || (webPandaURLWithDecodedArguents.includes("rid=") ? webPandaURLParams.get("rid") : "");
	let hitValue       = Number ( getMetadata(pandaGID, "hitValue") || (webPandaURLWithDecodedArguents.includes("hitValue=") ? webPandaURLParams.get("hitValue") : "") );
	let priority       = getMetadata(pandaGID, "priority")          || (webPandaURLWithDecodedArguents.includes("priority=") ? webPandaURLParams.get("priority") : "");
	let sourceURL      = getMetadata(pandaGID, "contextURL")        || (webPandaURLWithDecodedArguents.includes("contextURL=") ? webPandaURLParams.get("contextURL") : "");

	if(Boolean(gidMetadataCache[pandaGID])) {
		// loadedFromCacheIndicator.innerHTML = `${GID_IN_DATABASE_EMOJI}`; // Using icons instead of emoji now.
        loadedFromCacheIndicator.innerHTML = `<img title="You've run this catcher in the past. First run: ${new Date(gidMetadataCache[pandaGID].createdTimestamp).toLocaleString()}" src="${REPEAT_IMAGE}" width="${REPEAT_IMAGE_WIDTH_PX}px" height="${REPEAT_IMAGE_HEIGHT_PX}px" />`;
	}
    else {
        loadedFromCacheIndicator.innerHTML = `<img title="This is the first time you've run this catcher. Started at: ${Date.now().toLocaleString()}" src="${NEW_IMAGE}" height="${NEW_IMAGE_HEIGHT_PX}px" />`;
    }

	if(Boolean(gidMetadataCache[pandaGID]) &&
	   Boolean(gidMetadataCache[pandaGID].caught)) {
		caughtSpan.innerHTML = `<img title="You've caught this HIT at least once in the past. First catch: ${new Date(gidMetadataCache[pandaGID].caught).toLocaleString()}" src=${CAUGHT_IMAGE} width="${CAUGHT_IMAGE_WIDTH_PX}" height="${CAUGHT_IMAGE_HEIGHT_PX}">`;
	}

	mergeUndefinedMetadataAndSave(pandaGID, {
		hitTitle,
		hitDescription,
		requesterName,
		rid: requesterID,
		hitValue,
		priority,
		contextURL: sourceURL
	});

	let sourceURLParsed;
	if(sourceURL) {
		sourceURLParsed = new URL(sourceURL);
	}

	hitTitleSpan.innerText       = hitTitle;
	hitDescriptionSpan.innerText = hitDescription;
	requesterNameSpan.innerText  = requesterName;
	requesterIDSpan.innerText    = requesterID;
	hitValueSpan.innerText       = hitValue.toLocaleString("US", {minimumFractionDigits: 2});
	sourceURLSpan.innerHTML      = `<a href="${sourceURL}" target="_blank">${sourceURLParsed || {hostname: ""}.hostname}</a>`;

	if(once) {
		closeOnAccept.checked = true;
	}

	document.getElementById("gidSpan").innerText = pandaGID || "[INVALID GID]";

	// Basic single-GID cycler as default web+panda behavior.
	// Have your app register and parse the protocol for more advanced behavior.

	if(pandaGID) {
		document.title = `searching: ${pandaGID}`;
	}
	else {
		document.title = `ERROR: NO GID FOUND`;
	}

	if(GM_getValue("web-panda-turn") === undefined) {
		GM_setValue("web-panda-turn", 0);
	}

	(function pingGID() {

		pingFunction = pingGID;

		pandaTimeoutHandle = setTimeout(pingGID, pandaDelay);

		if(GM_getValue("web-panda-turn") !== handlerIndex) {return;}

		if(SHOULD_INDICATE_TURN_WITH_FULL_YELLOW_SCAN) {document.body.style.backgroundColor = "yellow";}
		scanIndicator.innerHTML = "? [SCANNING]";

		GM_xmlhttpRequest({
			method: "GET",
			url: pandaURL,
			headers: {"Accept": "application/json"},
			onreadystatechange: (response) => {

				if(response.readyState === READYSTATE_FINISHED) {

					const signinURLPrefix = "https://www.amazon.com/ap/signin";
					const taskIDPrefix = `{"task_id`;

					if(response.finalUrl.substr(0, signinURLPrefix.length) === signinURLPrefix) {
						statusMessages.addStatus("<span style='color:red;'>❌ Logged out.</span>");
					}
					else if(response.responseText.includes("Page request rate exceeded")) {
						statusMessages.addStatus("<span style='color:red;'>❌ Page Request Error.</span>");
					}
					else if(response.responseText.substr(0,taskIDPrefix.length) === taskIDPrefix) {

						if(isMissingSomeMetadata()) {

							console.time("Parse Mturk Response");
							let acceptedHitInfo = JSON.parse(response.responseText);
							console.timeEnd("Parse Mturk Response");
							let hitsAvailable   = acceptedHitInfo.project.assignable_hits_count;
							let hitRewardUSD    = acceptedHitInfo.project.monetary_reward.amount_in_dollars;
							let hitTitle        = acceptedHitInfo.project.title;
							let hitDescription  = acceptedHitInfo.project.description;
							let requesterName   = acceptedHitInfo.project.requester_name;
							let requesterId     = acceptedHitInfo.project.requester_id;

							mergeUndefinedMetadataAndSave(pandaGID, {
								hitTitle,
								hitDescription,
								requesterName,
								rid: requesterId,
								hitValue: hitRewardUSD
							});

							hitTitleSpan.innerText        = hitTitle;
							hitDescriptionSpan.innerText  = hitDescription;
							requesterNameSpan.innerText   = requesterName;
							requesterIDSpan.innerText     = requesterId;
							hitValueSpan.innerText        = hitRewardUSD;

							// console.log(acceptedHitInfo, response.responseText);
						}

						if(gidMetadataCache[pandaGID].caught === undefined) {
							gidMetadataCache = getStoredMetadata(); // Make sure we're working with the latest stored DB before we commit changes.
							setMetadata(pandaGID, "caught", Date.now());
							saveStoredMetadata();
							caughtSpan.innerHTML = `<img title="You've caught this HIT at least once in this session." src=${CAUGHT_IMAGE} width="${CAUGHT_IMAGE_WIDTH_PX}" height="${CAUGHT_IMAGE_HEIGHT_PX}">`;
						}

						statusMessages.addStatus("<span style='color:green;'>✔ Accepted!</span>");
						document.title = `FOUND GID: ${pandaGID}`;
					}
					else {
						statusMessages.addStatus("<span style='color:orange;'>❌ Failed to accept.</span>");
					}

					if(document.title.substr(0,5) !== "FOUND") {
						document.title = `searching (${statusMessages.messageIdIndex - 1}): ${pandaGID}`;
					}

					cycleToNextHandler();
					scanIndicator.innerHTML = "";
					statusDisplay.innerHTML = statusMessages.renderHTML();

					if(document.title.substr(0,5) === "FOUND") {
						if(closeOnAccept.checked) {

							GM_notification({
								title: `Accepted HIT And Closed`,
								text: `Title: ${hitTitleSpan.innerText}\n` +
								      `Requester: ${requesterNameSpan.innerText}` +
								      `Desc: ${hitDescriptionSpan.innerText}\n` +
								      `Value: $${Number(hitValueSpan.innerText).toLocaleString("US", {minimumFractionDigits: 2})}`,
								timeout: 0
							});

							window.close();
						}
					}

				}

			}
		});
	})();
}