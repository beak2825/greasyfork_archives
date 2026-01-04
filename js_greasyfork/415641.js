// ==UserScript==
// @name         coco-pa-mildom
// @namespace    coco-pa-mildom
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.mildom.com/*
// @run-at        document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415641/coco-pa-mildom.user.js
// @updateURL https://update.greasyfork.org/scripts/415641/coco-pa-mildom.meta.js
// ==/UserScript==


(function() {
  'use strict';
  let Config
  let ws_instance
  const log = function(text){
    const date = new Date()
    console.log(`[coco-pa-mildom][${date.getHours()<10?'0'+date.getHours():date.getHours()}:${date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()}:${date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()}]${text}`)
  }
  const originWebSocket = window.WebSocket
  window.WebSocket = function(...args){
    const ws = new originWebSocket(...args)
    if(/jp-room1\.mildom\.com\/?\?roomId=/.test(args[0])){
      ws_instance = ws
    }
    return ws
  }
  window.WebSocket.prototype = originWebSocket.prototype
  const originSend = window.WebSocket.prototype.send
  window.WebSocket.prototype.send = function(data){
    
    if(/jp-room1\.mildom\.com\/?\?roomId=/.test(this.url)){
      const _data = JSON.parse(data)
      if(_data.cmd == "enterRoom"){
        Config = {
          accessToken: _data.accessToken,
          userId: _data.userId,
          guestId: _data.guestId,
          nonopara: _data.nonopara,
          userImg: _data.userImg,
          roomId: _data.roomId,
          toName: _data.toName
        }
      }
      if(_data.cmd == "sendMsg"){
        delete _data.userName
        delete _data.level
      }
      originSend.call(this, JSON.stringify(_data));
    }else{
      originSend.call(this, data);
    }
    
  }
  window.top.fakeSend = function(msg){
    if(Config && msg && typeof msg === "string"){
      if(msg.length>476){
        msg = msg.slice(0,476)
        log(`长度大于476，截断到476`)
      }
      ws_instance.send(JSON.stringify({
        accessToken: Config.accessToken,
        category: 1,
        cmd: "sendMsg",
        count: 1,
        giftId: 999,
        guestId: Config.guestId,
        medals: [],
        msg,
        msgType: 0,
        nonopara: Config.nonopara,
        reqId: 2,
        roomId: Config.roomId,
        time: (new Date()).valueOf(),
        toId: Config.roomId,
        toLevel: 1,
        toName: Config.toName,
        toUserImg: "https://wia.mildom.com/assets/static/default_avatar.png",
        userId: Config.userId,
        userImg: Config.userImg,
      }))
    }else{
      new Error("Config is not init")
    }
  }

  function start(){
    const textarea = document.querySelector(".chat-panel-input")
    textarea.removeAttribute("maxlength")
    textarea.setAttribute("placeholder","字符上限是476，可以不用管右上角的计数了")
    const btn = document.createElement("div")
    btn.innerHTML="隐轰"
    btn.className= textarea.parentElement.children[2].className
    textarea.parentElement.replaceChild(btn,textarea.parentElement.children[2])
    btn.onclick = function(){
      fakeSend(textarea.value)
      textarea.value = ""
    }
  }

  window.addEventListener("load",async function(){
    const timer = setInterval(()=>{
      if(document.querySelector(".chat-panel-input")){
        log("元素定位成功")
        clearInterval(timer)
        start()
      }
    },1000)
  })

})()