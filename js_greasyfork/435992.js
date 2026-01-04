// ==UserScript==
// @name        copyToClipboard
// @namespace   Violentmonkey Scripts
// @match       https://kaltura.app.opsgenie.com/alert/list#
// @version     1.1.4
// @author      vludanenkov
// @grant GM_setClipboard
// @grant clipboardWrite
// @license MIT
// @description 08/11/2021, 14:54:43
// @downloadURL https://update.greasyfork.org/scripts/435992/copyToClipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/435992/copyToClipboard.meta.js
// ==/UserScript==

var regexp_for_name = /P\d(.*?)\n/g
var regexp_for_num = /(#\d+)\n/g

var workMode = 'Single Mode'

window.alert_summary = ''

function copyOne(event) {
  if (event.target.className == "alert-numbers__label has-tooltip v-tooltip-open" && workMode == 'Single Mode') {
    event.preventDefault()
    event.stopImmediatePropagation()
    alert_num = event.target.offsetParent.innerText.match(regexp_for_num)[0].replace('\n',' ')
    alert_text = event.target.offsetParent.innerText.match(regexp_for_name)[0].substring(2)
    alert_link = event.target.offsetParent.href
    alert_summary = alert_num + alert_text + alert_link
    GM_setClipboard(alert_summary, 'text/plain')
  }
}

function copyMultiple(event) {
  if (event.target.className == "alert-numbers__label has-tooltip v-tooltip-open" && workMode == 'Multiple Mode') {
    event.preventDefault()
    event.stopImmediatePropagation()
    alert_num = event.target.offsetParent.innerText.match(regexp_for_num)[0].replace('\n',' ')
    alert_text = event.target.offsetParent.innerText.match(regexp_for_name)[0].substring(2)
    alert_link = event.target.offsetParent.href
    alert_summary += alert_num + alert_text + alert_link + "\n\n"
  }
}


function copyToClipboard() {
      console.log('hi there')
      document.addEventListener('keydown', function(e){
        if (e.code == 'ShiftLeft') {
            alert_summary = ''
            workMode = "Multiple Mode" 
        }
      })
      document.addEventListener('keydown', function(e){
        if (e.code == 'KeyZ') {
            GM_setClipboard(alert_summary, 'text/plain')
            alert_summary = ''
            workMode = "Single Mode" 
        }
      })
      document.addEventListener('click', copyOne, true)
      document.addEventListener('click', copyMultiple, true)
            
}
copyToClipboard()