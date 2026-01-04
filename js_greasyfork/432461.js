// ==UserScript==
// @name         Fac_to_discord
// @namespace    https://www.torn.com
// @version      1.2
// @description  logs torns faction chat messages to our discord server
// @author       Bilbosaggings [2323763]
// @match        https://www.torn.com/profiles.php?XID=2323763
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432461/Fac_to_discord.user.js
// @updateURL https://update.greasyfork.org/scripts/432461/Fac_to_discord.meta.js
// ==/UserScript==


const webhook = "PASTE_WEBHOOK_HERE"


const secret = $('script[secret]').attr("secret")
const userId = $('script[uid]').attr("uid")
const socket = new WebSocket("wss://ws-chat.torn.com/chat/ws?uid="+userId+"&secret="+secret);
socket.onmessage = function(msg){
    if(typeof msg.data === "string"){
        //console.log(typeof msg.data)
        //console.log(msg.data)
        var data = JSON.parse(msg.data)
        //console.log(data.data[0].roomId)
        if(data.data[0]["roomId"] == "Faction:45151"){
            console.log(data.data[0].roomId)
            //alert(new Date() +"\n "+data['data'][0])
            data = data.data[0]
            var name = data.senderName
            var id = data.senderId
            var message = data.messageText
            //var output = "Message By: "+name+" ["+id+"]\nMessage: "+message
            var output = `[${name}](https://www.torn.com/profiles.php?XID=${id}) [${id}]: ${message}`
            if(name == undefined) return;
            //console.log(output)
            console.log(data)
            GM.xmlHttpRequest({
                  method: "POST",
                  url:webhook,
                  data: JSON.stringify({"content":output}),
                  //data: JSON.stringify({"embeds":[{"title":"Faction Chat Message","description":output,"footer":{"text":new Date()},}]}),
                  headers: {
                      "Content-Type": "application/json"
                  },
                  });
        }
    }

}
socket.onclose =function(close){
    console.log(close)
    if(close.wasClean ==true){
        alert(`Connection closed nicely with message: ${close.reason}`)
    }
    else{
        alert(`Connection closed badly. message: ${close.reason}, Code: ${close.code}`)
    }
}

socket.onerror = function(e){
    console.log(e)
    alert(`Error in script msg Bilbosaggings[2323763] and show this to him\n${e.message}`)
}






