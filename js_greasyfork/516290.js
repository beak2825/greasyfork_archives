// ==UserScript==
// @name        Day length on calendar.zoznam.sk/sunset-*
// @description Adding day length
// @namespace   Violentmonkey Scripts
// @match       https://calendar.zoznam.sk/sunset-*
// @grant       none
// @version     1.0
// @license     MIT
// @author      Zamro
// @downloadURL https://update.greasyfork.org/scripts/516290/Day%20length%20on%20calendarzoznamsksunset-%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/516290/Day%20length%20on%20calendarzoznamsksunset-%2A.meta.js
// ==/UserScript==

Array.from(document.getElementsByClassName('calendar')).forEach(month =>
                                                                Array.from(month.getElementsByTagName("td")).forEach(dayCell => {
  let c = dayCell.childElementCount
  if(c > 2){
    let wschod = dayCell.childNodes[c - 1].textContent.split(":")
    let zachod = dayCell.childNodes[c + 3].textContent.split(":")
    let h = parseInt(zachod[0]) - parseInt(wschod[0])
    let m = parseInt(zachod[1]) - parseInt(wschod[1])
    if( m < 0){
      h = h - 1
      m = m + 60
    }
    dayCell.appendChild(document.createElement("br"))
    dayCell.appendChild(document.createTextNode("Day length:"))
    dayCell.appendChild(document.createElement("br"))
    dayCell.appendChild(document.createTextNode(h.toString().padStart(2,'0') + ":" + m.toString().padStart(2,'0')))
  }
}))
