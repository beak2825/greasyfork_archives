// ==UserScript==
// @name         Omegle IP, Bot Skip, Watermark Remove
// @namespace    https://origamitoast.ga/
// @version      0.9.5
// @description  Shows IP, Suspected Proxy Status, Service Provider, and Location in chat window, auto-skips bots, and removes omegle watermark from stranger's video
// @author       Origami Toast
// @match        https://omegle.com/*
// @match        https://www.omegle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419663/Omegle%20IP%2C%20Bot%20Skip%2C%20Watermark%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/419663/Omegle%20IP%2C%20Bot%20Skip%2C%20Watermark%20Remove.meta.js
// ==/UserScript==

window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function(...args) {
  document.getElementById('videologo').remove()
  const pc = new window.oRTCPeerConnection(...args)
  pc.oaddIceCandidate = pc.addIceCandidate
  pc.addIceCandidate = function(iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(' ')
    if (fields[7] === 'srflx') {
      let list = document.getElementsByClassName('logitem')[0];
      let req = new XMLHttpRequest()
      req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let obj = JSON.parse(this.responseText)
          list.innerHTML = `IP: ${fields[4]}, ${(obj.proxy ? 'proxy' : 'not proxy')}<br/>Provider: ${obj.isp}<br/>Region: ${obj.city}, ${obj.regionName}<br/>Country: ${obj.country}`
        }
      }
      req.open('GET', 'https://ip.madhouselabs.net/json/' + fields[4] + '?fields=country,regionName,city,proxy,isp', true)
      req.onerror = function() {
        list.innerHTML = 'Error, ask sova5099 on Discord'
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