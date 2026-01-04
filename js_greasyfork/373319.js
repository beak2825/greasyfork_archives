// ==UserScript==
// @name         FPT Play remote
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remote FPT Play
// @author       hienlt0610
// @match       https://fptplay.vn/livetv*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js
// @downloadURL https://update.greasyfork.org/scripts/373319/FPT%20Play%20remote.user.js
// @updateURL https://update.greasyfork.org/scripts/373319/FPT%20Play%20remote.meta.js
// ==/UserScript==
var client;
(function() {
    'use strict';
    //$('a').text('hiển');

    // Your code here...
    // Create a client instance
  client = new Paho.MQTT.Client("m12.cloudmqtt.com", 32705, "123456web_" + parseInt(Math.random() * 1000, 10));

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  var options = {
    useSSL: true,
    userName: "wwfptvbl",
    password: "hqvP7bmVIU0h",
    onSuccess:onConnect,
    onFailure:doFail
  }

  // connect the client
  client.connect(options);
})();

// called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe('hienlt/chanel');
  }

  function doFail(e){
    console.log(e);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    console.log("onMessageArrived:"+message);
      var selectedChannel = $('.tv_channel.active').first();
      if (message.payloadString == 'next') {
         selectedChannel.parent().parent().next().find('.tv_channel').first().click();
      }else if(message.payloadString == 'prev'){
         selectedChannel.parent().parent().prev().find('.tv_channel').first().click();
      }else{
         $("a.tv_channel[data-href*='"+message.payloadString+"']").first().click();
      }
      setTimeout(function(){
      $('.vjs-play-control').click();
        $('.vjs-fullscreen-control').click();
      }, 2000);
  }