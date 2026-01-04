// ==UserScript==
// @name         [Discouraged] Discord Messaging Loop
// @namespace    https://greasyfork.org/en/users/173828-snowofficial
// @version      1.0
// @description  USE THIS AT YOUR OWN RISK! YOU MAY BE BANNED BY DISCORD BY USING THIS SCRIPT! This script allows you to send messages on loop using the '/sendMessageLoop 3 Message is here to be looped' command in the discord textarea.
// @author       Copyright 2017, iomods.weebly.com, All rights reserved.
// @match        *://discordapp.com/channels
// @match        *://discordapp.com/channels/*
// @supportURL   http://iomods.weebly.com/
// @icon         https://cdn.discordapp.com/avatars/459369695519178773/d4ba99e72010e782441f050d63bd8670.png?size=1024
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370145/%5BDiscouraged%5D%20Discord%20Messaging%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/370145/%5BDiscouraged%5D%20Discord%20Messaging%20Loop.meta.js
// ==/UserScript==

var prefix = "/";

var j = document.createElement('script');
j.type = 'text/javascript';
document.body.appendChild(j);
j.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';

function getToken() {
  var token;
  if (window.location.href.search("discordapp") != "-1") {
    var iFrame = document.createElement('iframe');
    iFrame.style.display = 'none';
    iFrame.id = 'iFrame';
    document.body.appendChild(iFrame);
    token = iFrame.contentWindow.localStorage.token.replace(/"/g, "");
  } else {
    token = undefined;
  }
  return token;
}

function send(message, channelId) {
  if (!channelId) {
    channelId = document.location.pathname.split('/').pop();
  }
  var data = {
    "content": message,
    "tts": "false",
    "nonce": "394615475109101568"
  }
  $.ajax({
    type: 'POST',
    url: 'https://discordapp.com/api/v6/channels/' + channelId + '/messages',
    data: JSON.stringify(data),
    headers: {
      '%3Aauthority': 'discordapp.com',
      '%3Amethod': 'POST',
      '%3Apath': '/api/v6/channels/' + channelId + '/messages',
      '%3Ascheme': 'https',
      'Authorization': getToken(),
      'Content-Type': 'application/json'
    },
	success: function(data) {
		console.log("Sent Message: " + message);
    },
    error: function(data) {
      console.error("[SnowLord]: Error sending message:");
      console.log(data.responseText);
    }
  });
}
var input = document.querySelector("textarea");
input.addEventListener("keyup", function() {
  if (input.value.toLowerCase().slice(0, 16) == prefix + "sendmessageloop" && input.value[input.value.length - 1] == ";" && jQuery) {
	var delay = parseInt(input.value.slice(17)) * 1000;
	if (delay < 3000) {
		delay = 3000;
    }
    var message = input.value.slice(18 + String(delay / 1000).length, input.value.length - 1);
    setInterval(function() {
		send(message);
    }, delay)
    input.value = "";
  }
});
