// ==UserScript==
// @name         Trade chat discord logger
// @namespace    torn.com
// @version      4.0
// @description  Log Trade chats to discord
// @author       sher_khan
// @match        https://www.torn.com/rules.php*
// @grant        GM_xmlhttpRequest
// @license      MI
// @downloadURL https://update.greasyfork.org/scripts/423758/Trade%20chat%20discord%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/423758/Trade%20chat%20discord%20logger.meta.js
// ==/UserScript==

var channel_map = [];
channel_map["full"] =  "https://discordapp.com/api/webhooks/772810661079547914/4Qz_xUrK_uOxLRxbFJ2sXxphonVTjGwk1c2Vh5yVhtVuRIQcZGYs6dx2bkO4Kak3brOk";
channel_map["revives"] = "https://discordapp.com/api/webhooks/823634529318338571/ULWe_K9cEMXFRuGesosk5pijyakEyAdajTn1mwM0k8_ETfWSP_YFG6dWZmdj4FvzmBpv";
channel_map["spies"] = "https://discordapp.com/api/webhooks/823634755870130206/E179JeKHlFq8PhOCimRjNHN2_6YE2p_8pRx4Mw-KK0CdkH9q1HQn0BKSZsVzJOFwsylH";
channel_map["filtered"] = "https://discordapp.com/api/webhooks/823635047696564225/K2aakK1XGP4FJQ2_hLak0mRBTXiC1u5i3LVuqwavdUdStJGdKLH0ngu0260LdQnTOBxj";
channel_map["commas"] = "https://discordapp.com/api/webhooks/823651745275576341/3mGYDf0OZke0CVpux6EarA91yARAfjDsLNd6wA9RvY1XCmts1Cy885FpMPeIafbBDOw0";
channel_map["trains"] = "https://discordapp.com/api/webhooks/823969892289478715/UgAHa3onnLuKIyGloFGhwPffAj4_osGeL3otfOKud8leQ3nO4ouUk3Ysc3INyeGweLo7"
channel_map["bazaar"] = "https://discordapp.com/api/webhooks/823971991458676776/OveF5-VDll7zFCa1Bd9LsUiOGFq1ZcZ_h7bUSY3sxi0lYFp9V7s9SJSDBDbkcCseNzK9"
channel_map["company"] = "https://discordapp.com/api/webhooks/823972233713942588/SdQpV0-27WH_SbqUe-rSkvI0FebfloDBc9jy7Yw7c0q2_0FhSjGZmOCM_wV1IjQIO1qp"

var message_filters = [",.*,.*,","\\p{Extended_Pictographic}.*\\p{Extended_Pictographic}","spy","spies","revive","hiring","reveal","company boost","logistics special","logistic special","train","baz"];
var sender_filters = ["2631050","2435313","2540975","2103695","1778676","2466957","2430598"];
var company_filters = ["grocery", "clothing","cruise","company","grocers","groceries","adult","strip","fc","gents","ladies","sweetshop","sweet shop","toy shop","toyshop","logistic"];
function pushToDiscord (jsonObject,channel) {
                GM_xmlhttpRequest({
               method: "POST",
                 url: channel_map[channel],
                    data: JSON.stringify({
                      "username" : "TornChat",
                      "embeds": [{"title": jsonObject['data'][0]['senderName']+" ["+jsonObject['data'][0]['senderId']+"]",
                                                    "url": "https://www.torn.com/profiles.php?XID="+jsonObject['data'][0]['senderId'],
                                                    "description": jsonObject['data'][0]['messageText']
                                                   }]}),
                  headers: {
                      "Content-Type": "application/json"
                  },
                  onload: function (e) {
                      //alert(e.responseText);
                  },
                  onerror: function (e) {
                      //alert(e);
                  }
              });
}
function checkIDBan (id) {
 return id == this;
}


var secret = $('script[secret]').attr("secret");
var uid = $('script[uid]').attr("uid");
//alert(secret);
//alert(uid);
var socket = new WebSocket("wss://ws-chat.torn.com/chat/ws?uid="+uid+"&secret="+secret);
socket.onmessage = function(event) {
      if(typeof event.data === 'string'){
          var jsonObject = JSON.parse(event.data);
       // alert (event.data)
         if(jsonObject['data'][0]['roomId'] === 'Trade' && jsonObject['data'][0].hasOwnProperty("messageText")){
             var message = jsonObject['data'][0]['messageText'];
             var sender = jsonObject['data'][0]['senderId'];

             if(!sender_filters.some(checkIDBan,sender)) {
                 var pattern = new RegExp(message_filters.concat(company_filters).join("|"),"iu");
                 var result = message.match(pattern);
                  pushToDiscord(jsonObject,"full");
                 if(!result) {
                 pushToDiscord(jsonObject,"filtered");
                } else if (message.match(new RegExp(",.*,.*,","i"))) {
                    pushToDiscord(jsonObject,"commas");
                } else if (message.match(new RegExp("revive","i"))) {
                    pushToDiscord(jsonObject,"revives");
                } else if (message.match(new RegExp("spies","i"))||message.match(new RegExp("spy","i"))) {
                    pushToDiscord(jsonObject,"spies");
                }  else if (message.match(new RegExp("train","i"))) {
                    pushToDiscord(jsonObject,"trains")
                }  else if (message.match(new RegExp(company_filters.join("|"),"iu"))) {
                     pushToDiscord(jsonObject,"company")
                } else if (message.match(new RegExp("baz","iu"))) {
                     pushToDiscord(jsonObject,"bazaar")
                }

          }
      }
}
}

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};