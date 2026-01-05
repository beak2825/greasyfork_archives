// ==UserScript==
// @name       Chat Syncer and CP alerts
// @namespace  http://careers.stackoverflow.com/boris-churzin
// @version    2.0
// @description  Syncs tiberium alliances (for now) chat with gtalk (for now) or email, and notifies when CP is close to the capacity. Change the CP_ALERT_HOURS value to tweak CP alert threshold (CP _ALERT_HOURS = how many hours before max capacity alert should be sent)
// @include https://www.tiberiumalliances.com/*
// @include https://*.alliances.commandandconquer.com/*
// @grant unsafeWindow
// @grant         GM_xmlhttpRequest
// @copyright  2013+, Boris Churzin
// @downloadURL https://update.greasyfork.org/scripts/29511/Chat%20Syncer%20and%20CP%20alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/29511/Chat%20Syncer%20and%20CP%20alerts.meta.js
// ==/UserScript==

GROUP_TOKEN = 'beehive';
CP_ALERT_HOURS = 1;

messages_done = {};
setInterval(check_messages, 1000);

cp_done = false;
setInterval(check_cp, 1000);

function send_message(player, message) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://chat-syncer.herokuapp.com/message/" + GROUP_TOKEN + "/" + escape(player) + "/" + escape(message)
    }); 
}

function check_cp() {
    try {
        var player = unsafeWindow.ClientLib.Data.MainData.GetInstance().get_Player();
        if(!cp_done && (player.GetCommandPointCount() > player.GetCommandPointMaxStorage() - player.GetCommandPointsGrowPerHour() * CP_ALERT_HOURS)) {
            console.log("Chat Syncer: CP alert triggered");
            cp_done = true;
            send_message(player.get_Name(), player.get_Name() + ": CP alert: " + Math.round(player.GetCommandPointCount()) + " out of " + player.GetCommandPointMaxStorage());
        } else {
            if(cp_done && !(player.GetCommandPointCount() > player.GetCommandPointMaxStorage() - player.GetCommandPointsGrowPerHour() * CP_ALERT_HOURS)) {
                cp_done = false;
                console.log("Chat Syncer: CP alert reset");
            }
        }
    } catch(e) {
        console.log("Chat Syncer (check_cp): " + e);
    }
}

function check_messages() {
    try {
        var messages = [];
        var spans = document.getElementsByTagName('span');
        for (var i = 0; i < spans.length; ++i) {
            if (spans[i].id.match("CHAT_SENDER")) {
                messages.push(spans[i].parentNode);
            }
        }
        for(var i = 0; i < messages.length; i++) {
            if(messages[i].innerHTML.match("\\[Alliance\\]") || messages[i].innerHTML.match("\\[Officers\\]")) {
                if(!messages_done[messages[i].innerHTML]) {
                    messages_done[messages[i].innerHTML] = true;
                    send_message(messages[i].children[0].innerHTML, messages[i].children[1].innerHTML);
                }
            }
        }
    } catch(e) {
        console.log("Chat Syncer (check_messages): " + e);
    }
}
