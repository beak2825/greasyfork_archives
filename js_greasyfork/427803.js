// ==UserScript==
// @name         agar.kr chathack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description         agar.kr chathack!!
// @author       You
// @match        http://agar.ddack.oa.gg/
// @match        https://agar.kr/
// @grant        none
// @description      agar.kr chathack!!
// @downloadURL https://update.greasyfork.org/scripts/427803/agarkr%20chathack.user.js
// @updateURL https://update.greasyfork.org/scripts/427803/agarkr%20chathack.meta.js
// ==/UserScript==

(function() {
    'use strict';

var repeatCount = 100000; //How many messages do you want to send?
var CurrentCount = 0;

var WebSocketFirstConnected = true;
var InterceptWS;
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
   if (!InterceptWS) {
      if (WebSocketFirstConnected) {
         WebSocketFirstConnected = false;
         var sendBtn = document.createElement("button");
            sendBtn.className = "btn btn-warning";
            sendBtn.style.zIndex = "3";
            sendBtn.style.position = "fixed";
            sendBtn.style.bottom = "0";
            sendBtn.style.right = "0";
            sendBtn.innerText = "SendChat";

            document.getElementById("overlays").appendChild(sendBtn);
            sendBtn.onclick = function() {
               if (typeof repeatCount !== 'number') {
                  window.alert("repeatCount에 반복할 횟수를 입력해 주세요.");
                  throw new Error("repeatCount는 숫자여야만 합니다.");
                  return;
               } else {
                  this.style.display = "none";
                  sendChatAndReConnect();
               }
            };
      }
      document.InterceptWS = this;
      InterceptWS = this;

      console.log("WebSocket 가로채기 성공");
       //setInterval(function(){ console.log(InterceptWS) }, 3000);
   }
   this.oldSend(m);
};

function sendChatAndReConnect() {
   if (CurrentCount >= repeatCount) {
      window.alert("End Chat");
      document.getElementsByClassName("btn btn-warning")[0].style.display = "inline";
      CurrentCount = 0;
      return true;
   } else if (!InterceptWS) {
      setTimeout(sendChatAndReConnect, 100);
      return;
   }

   var msg = document.querySelector("#chatBox").value; // "아가딱 서버 재오픈! 주소: agar.co.kr";
   var messageAsBinary = new DataView(new ArrayBuffer(2+2*msg.length));
   var offset = 0;

   messageAsBinary.setUint8(offset++,99);
   messageAsBinary.setUint8(offset++,0);
   for (var i = 0; i < msg.length; ++i) {
      messageAsBinary.setUint16(offset, msg.charCodeAt(i), true);
      offset += 2;
   }

   InterceptWS.send(messageAsBinary.buffer);
   InterceptWS.close();
   console.log("sent chat...");
   InterceptWS = false;
   CurrentCount++;
   setTimeout(sendChatAndReConnect, 500);
}
})();