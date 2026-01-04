// ==UserScript==
// @name         skyblue007-tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  just web tools
// @author       skyblue007
// @match        *://*/*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-d/jquery/3.6.0/jquery.min.js
// @require      https://unpkg.com/qrcodejs2@0.0.2/qrcode.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/474955/skyblue007-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/474955/skyblue007-tools.meta.js
// ==/UserScript==
;(function () {
  "use strict"
  //init dom
  const $id = (id) => `${skyblueRoot}-${id}`
  const init = () => {
    const skyblueRoot = "skyblue007-tools"
    const app = document.createElement("div")
    app.id = skyblueRoot
    const qrBtn = document.createElement("button")
    qrBtn.innerText = "qrcode"
    qrBtn.id = $id("qrcode")
    app.appendChild(qrBtn)
    document.body.append(createDom)
  }
  const addEvents = () => {
    $($id("qrcode")).click(() => createQrCode(location.href))
  }
  const createQrCode = (text) => {
    $($id("qrcode")).innerText = ""
    new QRCode($id("qrcode"), {
      width: 150, //宽度
      height: 150,
      text,
      render: "table",
    })
  }
  window.onload = () => {
    init()
    addEvents()
  }
})()
