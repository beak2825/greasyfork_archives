// ==UserScript==
// @name         FB Log Chat
// @namespace    http://fb-log-chat.notifun.com/
// @version      0.2.1_beta
// @description  Log FB Chat Messages!
// @author       kurokeita
// @license      MIT
// @match        https://www.messenger.com/t/*
// @match        https://www.facebook.com/*
// @icon         https://static.xx.fbcdn.net/rsrc.php/ym/r/YQbyhl59TWY.ico
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441901/FB%20Log%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/441901/FB%20Log%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const backendDomain = "http://stg-log-chat-api.notifun.com/"

  window.sockets = [];

  setInterval(interceptSockets, 5000)

  function getUsername() {
    let avatars = document.querySelectorAll("svg.pzggbiyp");
    avatars = Array.from(avatars)
    if (avatars.length) {
      var currentUser = avatars.find(function (avatar) {
        return avatar.getAttribute("aria-label") !== null && avatar.getAttribute("aria-label") !== ''
      })
      return currentUser.getAttribute("aria-label")
    }

    return null
  }

  function isMessagePacket(data) {
    return data.indexOf("insertMessage") !== -1 ? true : false
  }

  function getMessageText(data) {
    let functionPos = data.indexOf("insertMessage")

    let stringContainMessage = data.slice(functionPos + 16)

    return unescape(stringContainMessage.slice(1, stringContainMessage.indexOf('",U,[')))
  }

  function sendMessageToBackend(payload) {
    let requestPayload = {
      employee_name: payload.currentUserName,
      sender_id: payload.senderId,
      thread_id: payload.threadKey,
      message_id: payload.messageId,
      message: payload.message,
      sent_by_employee: payload.isMe,
      timestamp: Date.now()
    }

    GM_xmlhttpRequest({
      method: "POST",
      url: backendDomain + "webhook",
      data: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      onload: function (response) {
        // console.log(response.status)
        // console.log(response)
      }
    })
  }

  function interceptSockets() {
    console.log('---------- Start to intercepte sockets ----------')

    const originalSend = WebSocket.prototype.send;

    WebSocket.prototype.send = function (...args) {
      let isMessengerSocket = false
      let sockets = window.sockets

      if (this.url.indexOf("edge-chat.messenger.com") !== -1) {
        isMessengerSocket = true
      }

      if (this.url.indexOf("edge-chat.facebook.com") !== -1) {
        isMessengerSocket = true
      }

      if (window.sockets.indexOf(this) === -1 && isMessengerSocket) {
        sockets.push(this);
      }

      sockets = sockets.slice(-5)

      window.sockets = sockets

      return originalSend.call(this, ...args);
    };

    console.log('Number of sockets intercepted: ' + window.sockets.length)

    window.sockets.forEach((socket) => {
      socket.addEventListener('message', socketEventProcess)
    })

    console.log('---------- End sockets intercept ----------')
  }

  function socketEventProcess(event) {
    let currentUserName = getUsername()
    let dataFromSocket = String.fromCharCode.apply(null, new Uint8Array(event.data))

    if (isMessagePacket(dataFromSocket)) {
      let startOfJsonPayload = dataFromSocket.indexOf("{")
      let dataJson = dataFromSocket.slice(startOfJsonPayload)
      let data = JSON.parse(dataJson)
      let payload = data.payload ? data.payload : null
      let regex = new RegExp(/(LS\.sp\(\"insertMessage\").*?(\,\_\=\>LS\.sp)/)

      let insertMessageFunc = payload.match(regex)[0]
      let params = insertMessageFunc.slice(22).slice(0, -10)

      params = params.match(/.*?([^\\]\"\,|U\,|\]\,|true\,|false\,)/g)

      params = params.map(param => param.slice(0, -1))

      let payloadToSend = {
        message: params[0].slice(1).slice(0, -1),
        threadKey: params[3].slice(1).slice(0,-1),
        messageId: params[8].slice(1).slice(0,-1),
        senderId: params[10].slice(1).slice(0,-1),
        isMe: params[47] === "[0,0]",
        currentUserName: currentUserName
      }

      if (params[0]) {
        sendMessageToBackend(payloadToSend)
      }
    }
  }
})();