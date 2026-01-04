// ==UserScript==
// @name         Uzenetek
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Üzenetet küld
// @author       vacsati
// @match        *
// ==/UserScript==

function telegram(chat,bot,message){
    $.ajax({
        type: 'GET',
        url: "https://api.telegram.org/bot"+bot+"/sendmessage?chat_id="+chat+"&text="+encodeURIComponent(message),
        success: function(response){console.log("Telegram: ok - ",message);},
        error: function(response){console.error("Telegram error:",response.responseText);}
    });
}
function discord_wm(webhook,data){
    $.ajax({
        type: 'POST',
        url: webhook,
        data: data,
        success: function(response){console.log("Discord: ok");},
        error: function(response){console.error("Discord error:",response.responseText);}
    });
}
function discord_cbm(channel,bot,message){
    var data = {
        "content": message,
        "tts": false
    };
    $.ajax({
        type: 'POST',
        url: 'https://discordapp.com/api/v6/channels/' + channel + '/messages',
        data: JSON.stringify(data),
        headers: {
            '%3Aauthority': 'discordapp.com',
            '%3Amethod': 'POST',
            '%3Apath': '/api/v6/channels/' + channelId + '/messages',
            '%3Ascheme': 'https',
            'Authorization': 'Bot ' + bot,
            'Content-Type': 'application/json'
    },
    success: function(response) {console.log("Discord channel: ok",message);},
    error: function(response) {console.error("Discord channel error:",response.responseText);}
  });
}