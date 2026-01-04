// ==UserScript==
// @name        Project Random - wowee fun question marks
// @namespace   https://greasyfork.org/en/users/945115-unmatchedbracket
// @match       https://0xbeef.co.uk/random*
// @grant       none
// @version     1.0
// @author      Unmatched Bracket
// @description spinny spin
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/494701/Project%20Random%20-%20wowee%20fun%20question%20marks.user.js
// @updateURL https://update.greasyfork.org/scripts/494701/Project%20Random%20-%20wowee%20fun%20question%20marks.meta.js
// ==/UserScript==

function tickq(e) {
  //requestAnimationFrame(() => tickq(e))

  if (mousepos) {
    let rect = e.getBoundingClientRect()
    let mouseRelX = (rect.left + rect.right) / 2 - mousepos.x
    let mouseRelY = (rect.top + rect.bottom) / 2 - mousepos.y

    let angleToMouse = Math.atan2(mouseRelY, mouseRelX)*180/Math.PI - 90
    let diff = ((e.qdata.angle - angleToMouse) % 360 + 540) % 360 - 180
    let dist = Math.hypot(mouseRelX, mouseRelY)
    e.qdata.momentum -= diff / Math.pow(Math.max(1, dist/50), 2)
  }

  let now = Date.now()
  let delta = now - e.qdata.lasttick
  e.qdata.lasttick = now

  e.qdata.momentum *= 0.95
  e.qdata.momentum += Math.pow(Math.random(), 8)*25
  e.qdata.angle += e.qdata.momentum*delta/1000
  e.style.rotate = e.qdata.angle + "deg"
}

let qs = [...document.getElementsByClassName("mark")]

let container = qs[0].parentElement.parentElement

let mousepos = null

container.addEventListener("mousemove", (e) => {
  mousepos = {x: e.pageX, y: e.pageY}
})

container.addEventListener("mouseenter", (e) => {
  mousepos = {x: e.pageX, y: e.pageY}
})

container.addEventListener("mouseleave", (e) => {
  mousepos = null
})

qs.forEach((e) => {
  e.style.animation = "none"
  //e.style.transition = "rotate 0.2s linear"
  e.qdata = {
    angle: Math.random() * 360,
    momentum: Math.random() * 10
  }
  e.qdata.lasttick = Date.now()
})

function alltick() {
  requestAnimationFrame(alltick)
  qs.forEach((e) => tickq(e))
}

alltick()