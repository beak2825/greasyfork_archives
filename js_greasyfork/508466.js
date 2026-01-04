// ==UserScript==
// @name         triep games played grinder
// @namespace    http://tampermonkey.net/
// @version      6.99
// @description  use it in ffa or 2teams - i will give you 250,069,420,000 stars if you grind to 100,000 games played
// @author       Zert
// @match        https://triep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triep.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/508466/triep%20games%20played%20grinder.user.js
// @updateURL https://update.greasyfork.org/scripts/508466/triep%20games%20played%20grinder.meta.js
// ==/UserScript==

let fakeEvent = new Event(''), realEvent = window.r = new Proxy({ __proto__:fakeEvent }, { get:(a, b, c) => b === 'isTrusted' || fakeEvent[b] })
let onclick = window.o = {}
let buttons = ['leave-game', 'continue-btn', 'play-btn'], click = function(e) {
  if(e.onclick) {
    e.onclick(realEvent)
    return
  }
  let id = e.className
  onclick[id] && onclick[id](realEvent)
}
HTMLElement.prototype.addEventListener = new Proxy(HTMLElement.prototype.addEventListener, { apply:function(a, b, c) {
  if(c[0] === 'click') {
    onclick[b.className] = c[1]
  }
  return Reflect.apply(a, b, c)
} })
setInterval(function() {
  buttons.forEach(id => click(document.getElementsByClassName(id).item(0)))
}, 10500)
setTimeout(function() { document.getElementsByClassName('circle').item(0).remove() }, 10000)