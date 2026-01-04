// ==UserScript==
// @name         WebRTC Blocker
// @version      1.0
// @description  Blocks WebRTC protocol on non-whitelisted websites.
// @match        *://*/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1066079
// @downloadURL https://update.greasyfork.org/scripts/464669/WebRTC%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/464669/WebRTC%20Blocker.meta.js
// ==/UserScript==

// Add your whitelist URLs here
const whitelist = [
  "https://example.com",
  "https://example.net"
];

// Check if the current URL is in the whitelist
function isWhitelisted(url) {
  return whitelist.some((whitelistedUrl) => url.startsWith(whitelistedUrl));
}

// Block WebRTC on non-whitelisted pages
if (!isWhitelisted(window.location.href)) {
  const killWebRTC = () => {
    // Remove WebRTC API from the window object
    delete window.RTCPeerConnection;
    delete window.webkitRTCPeerConnection;
    delete window.mozRTCPeerConnection;
  };

  killWebRTC();
  console.log("Accelerator killed WebRTC.");
}