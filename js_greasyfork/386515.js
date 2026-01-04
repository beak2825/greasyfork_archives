// ==UserScript==
// @name         Auto scroller
// @namespace    https://greasyfork.org/zh-TW/users/11333-bendwarn
// @version      0.1
// @description  use alt= to scroll down, alt- to scroll up(both can be faster by pressing more), and alt+0 to stop.
// @author       bendwarn
// @match        *://*/*
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/386515/Auto%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/386515/Auto%20scroller.meta.js
// ==/UserScript==
let intervalid = null
let time = 16
let speed = 0
let move = _ => {document.body.scrollTop += speed}
document.body.onkeydown = e => {
  if (e.altKey) {
    let key = e.key
    if (key == '+' || key == '=' || key == '-') {
      speed += (key == '-') ? -2 : 2
      if (intervalid === null) intervalid = setInterval(move, time)
      else {
        clearInterval(intervalid)
        if (speed) intervalid = setInterval(move, time)
        else intervalid = null
      }
    } else if (key == '0') {
      clearInterval(intervalid)
      intervalid = null
      speed = 0
    }
  }
}