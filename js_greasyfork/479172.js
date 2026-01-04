// ==UserScript==
// @name         Omegle IP, Bot Skip, Watermark Remove with Enhancements
// @namespace    https://www.youtube.com/channel/UCL3Nla6-_a2zVOPrbZzSUnA
// @version      1.0
// @description  Improved features including IP display, bot detection, and auto-reconnect.
// @author       HackDoctor
// @match        https://omegle.com/*
// @match        https://www.omegle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479172/Omegle%20IP%2C%20Bot%20Skip%2C%20Watermark%20Remove%20with%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/479172/Omegle%20IP%2C%20Bot%20Skip%2C%20Watermark%20Remove%20with%20Enhancements.meta.js
// ==/UserScript==

window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function(...args) {
  // Remove watermark
  const logo = document.getElementById('videologo');
  if (logo) logo.remove();

  const pc = new window.oRTCPeerConnection(...args);
  pc.oaddIceCandidate = pc.addIceCandidate;
  pc.addIceCandidate = function(iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(' ');
    if (fields[7] === 'srflx') {
      let list = document.getElementsByClassName('logitem')[0];
      let req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            let obj = JSON.parse(this.responseText);
            list.innerHTML = `<strong>IP:</strong> ${fields[4]}, ${(obj.proxy ? 'proxy' : 'not proxy')}<br/>
                              <strong>Provider:</strong> ${obj.isp}<br/>
                              <strong>Region:</strong> ${obj.city}, ${obj.regionName}<br/>
                              <strong>Country:</strong> ${obj.country}`;
          } else {
            list.innerHTML = 'Error retrieving IP information';
          }
        }
      };
      req.open('GET', 'https://ip.madhouselabs.net/json/' + fields[4] + '?fields=country,regionName,city,proxy,isp', true);
      req.onerror = function() {
        list.innerHTML = 'Network error occurred.';
      };
      req.send();
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

let autoReconnect = true; // Set this to false if you don't want auto-reconnect after bot skip.

document.addEventListener('DOMNodeInserted', function(e) {
  if (!e.target.children || !e.target.children[0] || e.target.children[0].className !== 'strangermsg') return;
  let msg = e.target.innerText.replace('Stranger: ', '');
  if (msg.match(new RegExp('^([mf]\\b|[mf]\\d)|\\b(dm|snap|subscribe|follow)\\b', 'gi'))) {
    let dc = document.getElementsByClassName('disconnectbtn')[0];
    if (dc.innerText === 'Stop\nEsc') dc.click();
    if (autoReconnect) setTimeout(() => dc.click(), 1000); // Auto-reconnect after 1 second
  }
}, false);

// UI for toggling auto-skip and auto-reconnect
let controlPanel = document.createElement('div');
controlPanel.innerHTML = `
  <button id="toggleAutoSkip">${autoReconnect ? 'Disable' : 'Enable'} Auto Skip & Reconnect</button>
`;
document.body.appendChild(controlPanel);

document.getElementById('toggleAutoSkip').addEventListener('click', function() {
  autoReconnect = !autoReconnect;
  this.innerText = `${autoReconnect ? 'Disable' : 'Enable'} Auto Skip & Reconnect`;
});