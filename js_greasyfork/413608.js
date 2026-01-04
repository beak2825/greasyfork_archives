// ==UserScript==
// @name         Chat Stalker
// @namespace    hardy.chat.stalker
// @version      1.0
// @description  Notifies when a user post in global or trade chat
// @author       Hardy[2131687]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/413608/Chat%20Stalker.user.js
// @updateURL https://update.greasyfork.org/scripts/413608/Chat%20Stalker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //add user IDs of people you want to stalk. both chats have their own seperate list. By default me and Chedburn are added to both lists
    let globalTargets = ["2131687", "1"];
    let tradeTargets = ["2131687", "1"];
    function pAlert(id, name, room, str) {
        var lastSeen = localStorage.getItem("turdTime");
        var last;
        if (typeof lastSeen == "undefined" || lastSeen == null) {
            last = {"bitches": {}};
            localStorage.setItem("turdTime", JSON.stringify(last));
        } else {
            last = JSON.parse(lastSeen);
            if (last["bitches"][id]) {
                if (Date.now()/1000 - last["bitches"][id] < 500) {
                    return;
                }
            }
        }
        let boxHtml = '<div class="penny_modal", id="penny_modal"><div id="penny_modal-content"><p class="penny_line"><a href="https://www.torn.com/profiles.php/XID='+id+'">'+name+'</a> says in '+room+' chat:'+'</p><br><p class="penny_line">'+str+ '</p><br><div class="penny_button_container"><button class="penny_close-button">Close me</button></div></div></div><br><br>';
        $(".content-wrapper").prepend(boxHtml);
        last["bitches"][id] = Date.now()/1000;
        localStorage.setItem("turdTime", JSON.stringify(last));
    }
    let chatCode = document.querySelector('script[src^="/js/chat/chat."]');
    let secret = chatCode.getAttribute("secret");
    let uid = chatCode.getAttribute("uid");
    let socket = new WebSocket("wss://ws-chat.torn.com/chat/ws?uid="+uid+"&secret="+secret);
    socket.onmessage = function(event) {
        let data = JSON.parse(event.data)["data"][0];
        //console.log(data);
        if (data.roomId == "Trade" && tradeTargets.indexOf(data.senderId) !== -1) {
            pAlert(data.senderId, data.senderName, 'Trade', data.messageText);
        } else if (data.roomId == "Global" && globalTargets.indexOf(data.senderId) !== -1) {
            pAlert(data.senderId, data.senderName, 'Global', data.messageText);
        }
    };
    document.addEventListener("click", function(e) {
        if (e.target.className == "penny_close-button") {
            document.querySelector(".penny_modal").remove();
        }
    });
    GM_addStyle(`
        .penny_modal { border-radius: 8px; background-color: rgb(242, 242, 242); animation: animate 3s linear infinite;}
		@keyframes animate { 0% { box-shadow: 0 0 0 0 rgba(255,109,74,.7), 0 0 0 0 rgba(255,109,74,.7);} 40% { box-shadow: 0 0 0 50px rgba(255,109,74,0), 0 0 0 0 rgba(255,109,74,.7);} 80% { box-shadow: 0 0 0 50px rgba(255,109,74,0), 0 0 0 0 rgba(255,109,74,0);} 100% { box-shadow: 0 0 0 0 rgba(255,109,74,0), 0 0 0 0 rgba(255,109,74,0);} }
		.penny_button_container { padding: 8px; padding-left: 30px;}
        .penny_line { padding: 10px; padding-top: 10px; padding-right: 30px; padding-bottom: 10px; padding-left: 30px; font-size: 18px }
`);
 
})();
 