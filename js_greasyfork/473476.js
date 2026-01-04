// ==UserScript==
// @name         skyblue007-noColors
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  noColors
// @author       skyblue007
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473476/skyblue007-noColors.user.js
// @updateURL https://update.greasyfork.org/scripts/473476/skyblue007-noColors.meta.js
// ==/UserScript==
;(function () {
  "use strict"
  //   /.*(hsck)+.*|.*(baidu)+.*/  加| 关联多个域名
  const reg = /.*(hsck)+.*|.*(pornhub)+.*|.*(xvideos)+.*/
  const startDate = "1713690194101"
  const hostName = location.host
  if (reg.test(hostName)) {
    document.title = "sky blue fly"
    document.body.style.backgroundColor = "rgb(0, 122, 204)"
    document.body.innerHTML = ""
    alert("冷静下！！！")
    location.replace("https://music.163.com/")
  }
  const renderDays = () => {
    const div = document.createElement("div")
    const currentDate = Date.now()
    const daysGap = ((currentDate - startDate) / (1000 * 60 * 60 * 24)).toFixed(
      1
    )

    div.textContent = daysGap > 0 ? daysGap : 0
    const style = document.createElement("style")
    const cssText = document.createTextNode(
      ".days{position:fixed;right:6px;top:50%;color:red;font-size:16px}"
    )
    div.className = "days"
    style.appendChild(cssText)
    document.head.appendChild(style)
    document.body.appendChild(div)
  }
  window.onload = () => {
    renderDays()
  }
})()
