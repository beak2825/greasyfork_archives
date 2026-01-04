// ==UserScript==
// @name         Omegle Shit (Zentra Edition)
// @namespace    https://omegle.com/
// @version      0.0.1
// @description  Yuh
// @author       Zentra
// @match        https://omegle.com/*
// @match        https://www.omegle.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444647/Omegle%20Shit%20%28Zentra%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444647/Omegle%20Shit%20%28Zentra%20Edition%29.meta.js
// ==/UserScript==

document.title = ".";
window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function(...args) {
  document.getElementById('videologo').remove()
  const pc = new window.oRTCPeerConnection(...args)
  pc.oaddIceCandidate = pc.addIceCandidate
  pc.addIceCandidate = function(iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(' ')
    /*if (fields[16] == "network-id")
    {
        for(var i = 0; i < 10; i++)
        {
            console.log(fields[16][i]);
        }
    }*/
    if (fields[7] === 'srflx') {
      let list = document.getElementsByClassName('logitem')[0];
      let req = new XMLHttpRequest()
      req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText)
            if (obj.country == "IN")
            {
                let dc = document.getElementsByClassName('disconnectbtn')[0]
                if (dc.innerText == 'Stop\nEsc') dc.click()
                if (dc.innerText == 'Really?\nEsc') dc.click()
                list.innerHTML = `${fields[4]}<br/>${obj.city}, ${obj.region}<br/>${obj.country}`
            } else {
                list.innerHTML = `${fields[4]}<br/>${obj.city}, ${obj.region}<br/>${obj.country}`
            }
        }
      }
      req.open('GET', 'https://ipinfo.io/' + fields[4] + '?token=1d6ff6d39f319f', true)
      req.onerror = function() {
        list.innerHTML = 'Error'
      }
      req.send()
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest)
  }
  return pc
}

document.addEventListener('DOMNodeInserted', function(e) {
  if(!e.target.children||!e.target.children[0]||e.target.children[0].className!='strangermsg') return
  let msg = e.target.innerText.replace('Stranger: ', '')
  if(msg.match(new RegExp('^([mf]\\b|[mf]\\d)|\b(dm|snap|subscribe|follow)\b', 'gi'))){
    let dc = document.getElementsByClassName('disconnectbtn')[0]
    if (dc.innerText == 'Stop\nEsc') dc.click()
    if (dc.innerText == 'Really?\nEsc') dc.click()
  }
}, false)