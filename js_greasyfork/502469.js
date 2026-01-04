// ==UserScript==
// @name         Pixmap Void Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  watch the remaining time on the pixmap.fun/void page
// @author       Iranpix
// @match        https://pixmap.fun/void
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502469/Pixmap%20Void%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/502469/Pixmap%20Void%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a = 0
    var min = 0
    var titlemin = 0
    var time = new Date()
    var voidtime = new Date(document.body.innerText.slice(18))
    var whenvoid = ""

    function gwhenvoid() {
        time = new Date()
        if ((voidtime.getTime() - time.getTime()) <= 0) {
            whenvoid = "NOW"
            const d = Date.parse(voidtime)-Date.parse(new Date());
            const minutes = Math.floor((d / 1000 / 60) % 60);
            min = minutes
            if (min != titlemin) {
                titlemin = min
                document.title = "Void time"
            }
            if (minutes <= -65)
                location.reload()
        }
        else {
            const total = Date.parse(voidtime) - Date.parse(new Date());
            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);
            const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            min = minutes
            whenvoid = `${hours}:${minutes}:${seconds}`
            if (titlemin != min) {
                titlemin = min
                if (hours > 0 && titlemin != min)
                    document.title = "One hour left"
                else if (min == 1)
                    document.title = `One minute left`
                    else
                        document.title = `${min} minutes left`
            }
        }
        if (a != 0)
            document.getElementById("box").innerHTML =
                `
    <span>when void</span>
    <span style="font-size: 150%; margin-bottom: 1rem">${whenvoid}</span>
    <span>Now: ${time.toUTCString()}</span>
    <span>Next void at ${voidtime.toUTCString()}</span>
    `
            a += 1
        setTimeout(() => { gwhenvoid() }, 1000)
    }
    gwhenvoid()
    document.body.innerHTML =
        `
  <div
  style="
      position: aboslute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      align-items: center;
      justify-content: center;
      background: black;
      color: white;
      font-family: system-ui
  ">
  <div style="display: grid;text-align:center" id="box">
  <span>when void</span>
  <span style="font-size: 150%; margin-bottom: 1rem">${whenvoid}</span>
  <span>Now: ${time.toUTCString()}</span>
  <span>Next void at ${voidtime.toUTCString()}</span>
  </div>
  </div>
  <a
  style="position: absolute; bottom: 20; color: #007AFF; font-family: system-ui; text-align: center; width: 100%"
  target="blank" href="https://dsc.gg/iranpix">dsc.gg/iranpix</a>
  `
})();