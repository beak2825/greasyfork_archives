// ==UserScript==
// @name         Geoguessr Location Resolver EXTERNAL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Receive geoguessr location to any device.
// @author       0x978
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546581/Geoguessr%20Location%20Resolver%20EXTERNAL.user.js
// @updateURL https://update.greasyfork.org/scripts/546581/Geoguessr%20Location%20Resolver%20EXTERNAL.meta.js
// ==/UserScript==

// ====================================Overwriting Fetch====================================

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
            url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

        this.addEventListener('load', function () {
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            const match = this.responseText.match(pattern);
            if (match && match[0]) {
                const [lat, lng] = match[0].split(",").map(Number);
                sendCoords(lat, lng);
            }
        });
    }
    return originalOpen.apply(this, arguments);
};


// ====================================Send To Server====================================
function sendCoords(lat, lng) {
    cleanFetch.fetch("https://georesolver.0x978.com/coords", {
        method: "POST",
        body: JSON.stringify({
            "lat":lat,
            "lng":lng,
            "sessionId":userId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

// ====================================User ID handling====================================
function generateGuid() { // Taken from: https://stackoverflow.com/a/2117523 :)
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

let userId = GM_getValue("sessionId");
if (!userId) {
    userId = generateGuid();
    GM_setValue("sessionId", userId);
    window.open(`https://georesolver.0x978.com/?id=${userId}`, "_blank");
}


// ====================================Misc====================================
let onKeyDown = (e) => {
    if (e.keyCode === 120) {
        e.stopImmediatePropagation();
        alert(`Your user ID is: ${userId}`);
    }
}

document.addEventListener("keydown", onKeyDown);

// Let's make sure our fetch is Js fetch and not overwritten.
const frame = document.createElement('iframe');
frame.style.display = 'none';
frame.src = 'about:blank';
document.body.appendChild(frame);
const win = frame.contentWindow;
x = {frame, win}
const cleanFetch = {
    fetch: win.fetch.bind(win),
    Headers: win.Headers,
    Request: win.Request,
    Response: win.Response,
    close: () => frame.remove()
};

// Usage ping - sends only script version to server to track usage.
cleanFetch.fetch(`https://geoguessrping.0x978.com/ping?script_version=External_1.1`)