// ==UserScript==
// @name         Brainly Notifications
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a cool deskstop notitications systems.
// @author       Anonymous
// @match        *://*/*
// @grant         GM.xmlHttpRequest
// @grant         GM_notification



// @downloadURL https://update.greasyfork.org/scripts/406691/Brainly%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/406691/Brainly%20Notifications.meta.js
// ==/UserScript==
// IF YOU ARE NOT FROM BRAINLY.IN , just change the url to your Brainly Market
// Please be sure you are log to your account else it mays not work.
// Don't steal the script please , it took me time to write it.
// !!!!!! IMPORTANT!!!!!! REPLACE LAST NUMBERS BY YOUR LAST NUMBERQ LINK CONVERSATION , VERY IMPORTANT ,
// THIS MEANS THIS SCRIPT WILL WORK WITH ONLY ONE USER FROM YOUR INBOX , IF YOU WANT IT TO WORKS WITH MORE, CREAT A SECOND SCRIPT LIKE THIS BUT WITH A NEW URL
// IT WILL SAY YOU " ARE YOU SURE YOU WANT TO ACCEPT THIS DOMAIN", CLICK ON Always Accept to make the scripts work. More tools coming soon !!! ENJOY :)

window.onload = inbox()
function inbox() {
GM.xmlHttpRequest({
  method: "GET",
  url: "https://brainly.in/api/28/api_messages/get_messages/YOUR LAST CONVERSATION NUMBERS LINK",
  headers: {
    "User-Agent": "Chrome/83.0.4103.116",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var responseXML = null;
    // Inject responseXML into existing Object (only appropriate for XML content).
    if (!response.responseXML) {
      responseXML = new DOMParser()
        .parseFromString(response.responseText, "text/xml");
    }
     var data = JSON.parse(response.responseText);
     var convid = data.data.messages.conversation_id;
     var lastmsg = data.data.messages.user_id;
     var content = data.data.messages[24].content;
     var sendernick = data.users_data[1].nick;
     var img = data.users_data[1].avatar[0]
     var originalimg = img
     var statua = new Boolean(data.data.messages[24].new);
     if (data){console.log("Injected User Datas : Success")}else{alert("Failed to load User Datas, please log to your account")};
     if (statua==false){console.log("Ignore this")}else{GM_notification({title: sendernick+' sent you a message', text: content, image: 'https://i.stack.imgur.com/n5eFk.png'})};

      console.log([
      statua,
      sendernick,
      response.status,
      response.statusText,
      response.readyState,
      response.responseHeaders,
      response.responseText,
      response.finalUrl,
      responseXML
    ].join("\n"));
  }
})}; //Credits Image :  Brainly.com ,  @Brainly , All right reserved
