// ==UserScript==
// @name         Faction Chat to Discord
// @namespace    tenren.torn.com
// @version      1.0
// @description  Log Faction Chat to Discord
// @author       Tenren [3373820]
// @include      *torn.com*
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523123/Faction%20Chat%20to%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/523123/Faction%20Chat%20to%20Discord.meta.js
// ==/UserScript==

// Credit: Ahab [1735214] - https://www.torn.com/forums.php#/p=threads&f=67&t=16151112&b=0&a=0

var faction_webhook = "" // Insert Discord WebHook URL here

// Intercept WebSocket messages: https://stackoverflow.com/a/70267397
function listen(fn) {
    fn = fn || console.log;
    let property = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const data = property.get;

    // wrapper that replaces getter
    function lookAtMessage() {
        let socket = this.currentTarget instanceof WebSocket;
        if (!socket) {
            return data.call(this);
        }
        let msg = data.call(this);
        Object.defineProperty(this, "data", { value: msg } ); //anti-loop
        fn({ data: msg, socket:this.currentTarget, event:this });
        return msg;
    }
    property.get = lookAtMessage;
    Object.defineProperty(MessageEvent.prototype, "data", property);
}

listen( ({data}) => send(data))

function send(data) {
    if(data.substring(0, 4) == "MESG"){
        var jsonObject = JSON.parse(data.slice(4)) // Convert data after MESG to JSON
        console.log(jsonObject)
        if(jsonObject.channel_url.substring(0, 7) === "faction"){
            GM.xmlHttpRequest({
                method: "POST",
                url: faction_webhook,
                data: JSON.stringify({"embeds": [{"title": jsonObject.user.name+" ["+jsonObject.user.guest_id+"]",
                                                  "url": "https://www.torn.com/profiles.php?XID="+jsonObject.user.guest_id,
                                                  "description": jsonObject.message,
                                                  "color": "16711680",
                                                  "footer": {"text": new Date(jsonObject.last_updated_at).toJSON().replace('T', ' ').slice(0, -5) + " TCT"}
                                                }]}),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
    }
};