// ==UserScript==
// @name             RTIRL Speed Display
// @author           intsven
// @namespace        intsven
// @description      Display speed of streamers on rtirl.com
// @version          0.1
// @match          https://rtirl.com/*
// @run-at           document-start
// @license          MIT
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/502464/RTIRL%20Speed%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/502464/RTIRL%20Speed%20Display.meta.js
// ==/UserScript==

const sockets = [];
const nativeWebSocket = window.WebSocket;
const version = '14';
var lastECEF = null;
var lastTime = null;
var ecefTimes = [];
var speedsKmH = [];
window.WebSocket = function(...args){
    const socket = new nativeWebSocket(...args);
    sockets.push(socket);
    console.log('WSHook args:', args);
    const url = args[0];
  
    console.log('WSHook version:', version);
    // append function to the socket onmessage event
    //socket.onmessage.
    
    return socket;
};
setTimeout(() => {
    // or create a button which, when clicked, does something with the sockets
    console.log(sockets);
    for (const socket of sockets) {
        const oldOnMessage = socket.onmessage;
        socket.onmessage = function(event) {
            //console.log('WSHook onmessage:', event);
            try {
                WSHookMessage(event);
            } catch (error) {
                console.info('WSHook error:', error);
            }
            if (oldOnMessage) {
                oldOnMessage.bind(this)(event);
            }
        }
    } 
}, 5000);

// Create display for speed in bottom left corner
const speedDisplay = document.createElement('div');
speedDisplay.style.position = 'fixed';
speedDisplay.style.bottom = '30px';
speedDisplay.style.left = '0';
//speedDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
speedDisplay.style.color = 'white';
speedDisplay.style.padding = '5px';
speedDisplay.style.borderRadius = '5px';
speedDisplay.innerHTML = 'Speed: 0 km/h';
// text shadow
speedDisplay.style.textShadow = '2px 2px 2px #000';
// Font with monospace
speedDisplay.style.fontFamily = 'monospace';
// Font size
speedDisplay.style.fontSize = '20px';
document.body.appendChild(speedDisplay);




function WSHookMessage(event) {
    const eventUrl = event.target.url;
    //console.log('WSHook eventUrl:', eventUrl);
    if (eventUrl.includes('.firebaseio.com/.ws?') && eventUrl.includes('-locations-rtdb')) {
        //console.log('WSHook Received message:', eventUrl, event.data);
        const data = JSON.parse(event.data);
        //console.log(data);
        // Check if location data is present
        if (!data.d || !data.d.b || !data.d.b.d) {
            return;
        }
        const pos = data.d.b.d;
        //console.log(pos);
        const lat = pos['0'];
        const lon = pos['1'];
        const ecef = fromDegreeToECEF(lat, lon, 0);
        if (lastECEF) {
            // Get the distance between the last position and the current position
            const dist = distance(lastECEF, ecef);
            //console.log('Distance:', dist);
            const deltaTime = Date.now() - lastTime;
            const speed = dist / deltaTime * 1000;
            const speedKmH = speed * 3.6;
            ecefTimes.push([ecef, Date.now()]);
            speedsKmH.push(speedKmH);
            const avgSpeed = average(speedsKmH, 10);
            console.log('Speed [km/h]:', speedKmH, 'Distance [m]:', dist, 'Time [ms]:', deltaTime);
            // three padding zeros
            speedDisplay.innerHTML  = 'Speed[km/h]: ' + speedKmH.toFixed(2).padStart(6, '0') + '<br>';
            speedDisplay.innerHTML += 'Avg Last 10: ' + avgSpeed.toFixed(2).padStart(6, '0');
            //console.log('WSHook Received message:', event.data);
        }
        lastECEF = ecef;
        lastTime = Date.now();
    }
};

function distance(ecef1, ecef2) {
    const x = ecef1[0] - ecef2[0];
    const y = ecef1[1] - ecef2[1];
    const z = ecef1[2] - ecef2[2];
    return Math.sqrt(x * x + y * y + z * z);
}

function average(arr, lastN=0) {
    if (lastN > 0) {
        arr = arr.slice(-lastN);
    }
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function fromDegreeToECEF(latitude,longitude,alt){
    const lat = latitude * Math.PI / 180;
    const lon = longitude * Math.PI / 180;
    return toECEF(lat, lon, alt);
}

function toECEF(lat, lon, alt) {
    const a = 6378137.0;
    const f = 1.0 / 298.257223563;
    const e2 = f * (2 - f);
    const N = a / Math.sqrt(1 - e2 * Math.sin(lat) * Math.sin(lat));
    const x = (N + alt) * Math.cos(lat) * Math.cos(lon);
    const y = (N + alt) * Math.cos(lat) * Math.sin(lon);
    const z = (N * (1 - e2) + alt) * Math.sin(lat);
    return [x, y, z];
}

// wss://s-usc1b-nss-2133.firebaseio.com/.ws?v=5&p=1:684852107701:web:22f87dcafccc98249a61fc&ns=rtirl-a1d7f-locations-rtdb