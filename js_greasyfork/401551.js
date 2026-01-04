// ==UserScript==
// @name         Torn Chat for kennymac / shadowrazers
// @namespace    https://tornbots.com/
// @version      0.1
// @description  Pushes chat from Torn to Discord
// @author       saeed [1826888]
// @include      https://www.torn.com/*
// @connect      *.tornbots.com/*
// @connect      *
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      tornbots.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/401551/Torn%20Chat%20for%20kennymac%20%20shadowrazers.user.js
// @updateURL https://update.greasyfork.org/scripts/401551/Torn%20Chat%20for%20kennymac%20%20shadowrazers.meta.js
// ==/UserScript==

//Get Chat Secret
var chatSecret = document.querySelector('script[src^="/js/chat/chat"]').getAttribute("secret");
var UID = document.querySelector('script[src^="/js/chat/chat"]').getAttribute("uid");
//Open the websocket for viewing
var webSocket = new WebSocket('wss://ws-chat.torn.com/chat/ws?uid=' + UID + '&secret=' + chatSecret);
    webSocket.onopen = function (e) {
        console.log('websocket opened');
    };

webSocket.onerror = function(e) {
        console.log('an error occured', e);
    };

webSocket.onmessage = function(msg){
  var msgParse = JSON.parse(msg.data);
  var dataToSend = JSON.stringify(
      {
          "messageId": msgParse.data[0].messageId,
          "messageText": msgParse.data[0].messageText,
          "roomId": msgParse.data[0].roomId,
          "senderId": msgParse.data[0].senderId,
          "senderName": msgParse.data[0].senderName,
          "senderIsStaff": msgParse.data[0].senderIsStaff
      }
  );
if (msgParse.data[0].roomId.indexOf('Trade') !== -1 && $.isNumeric(msgParse.data[0].senderId)) {

    $.ajax({
        type: 'POST',
        url: 'https://tornbots.com:1338/api/chat/receiver/trade',
        data: dataToSend,
        contentType: "application/json",
        dataType: 'json'
    });
}

 if (msgParse.data[0].roomId.indexOf('Faction:13665') !== -1 && $.isNumeric(msgParse.data[0].senderId)) {
    $.ajax({
        type: 'POST',
        url: 'https://tornbots.com:1338/api/chat/receiver/faction/13665',
        data: dataToSend,
        contentType: "application/json",
        dataType: 'json'
    });
}

if (msgParse.data[0].roomId.indexOf('Global') !== -1 && $.isNumeric(msgParse.data[0].senderId)) {
    $.ajax({
        type: 'POST',
        url: 'https://tornbots.com:1338/api/chat/receiver/global',
        data: dataToSend,
        contentType: "application/json",
        dataType: 'json'
    });
}
};