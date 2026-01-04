// ==UserScript==
// @name         Omegle Automatically Skip, Watermark Remove
// @version      0.1
// @description  Auto-skip pervs Indians and removes watermark from stranger's video
// @author       Better Internet
// @match        https://omegle.com/*
// @match        https://www.omegle.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1027093
// @downloadURL https://update.greasyfork.org/scripts/460022/Omegle%20Automatically%20Skip%2C%20Watermark%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/460022/Omegle%20Automatically%20Skip%2C%20Watermark%20Remove.meta.js
// ==/UserScript==

window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function(...args) {
    document.getElementById('videologo').remove();
    const pc = new window.oRTCPeerConnection(...args);
    pc.oaddIceCandidate = pc.addIceCandidate;
    pc.addIceCandidate = function(iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(' ');
        if (fields[7] === 'srflx') {
            let list = document.getElementsByClassName('logitem')[0];
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let obj = JSON.parse(this.responseText);
                    list.innerHTML = '<b>Automatically Skip</b><br/>' + 'Country: ' + obj.country;
                    // skip after 0.2 seconds
                    // Lower valeus can get you BAN
                    if (obj.country === 'India') {
                        setTimeout(() => {
                            let dc = document.getElementsByClassName('disconnectbtn')[0];
                            if (dc.innerText == 'Stop\nEsc') { dc.click(); }
                            if (dc.innerText == 'Really?\nEsc') { dc.click(); }
                        }, 2080);
                    }
                }
            }
            req.open('GET', 'https://ip.chimplabs.xyz/json/' + fields[4] + '?fields=country', true);
            req.onerror = function() {
                list.innerHTML = 'Error, getting Stranger location';
            }
            req.send();
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    }
    return pc;
}
