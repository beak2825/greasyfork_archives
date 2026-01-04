// ==UserScript==
// @name         Trade chatlogger
// @namespace    torn.com
// @version      0.4
// @description  Log my trade chats
// @author       mezmer [2720412]
// @include      *torn.com*
// @grant        GM.xmlHttpRequest
// @license      MIT
// @connect      torn-city-386820.uc.r.appspot.com
// @downloadURL https://update.greasyfork.org/scripts/487763/Trade%20chatlogger.user.js
// @updateURL https://update.greasyfork.org/scripts/487763/Trade%20chatlogger.meta.js
// ==/UserScript==

var act = 0

document.addEventListener('visibilitychange', function (event) {
    if (document.hidden) {
        act = 1
    } else {
        act = 0
    }
});

function listen(fn){
    fn = fn || console.log;
    let property = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const data = property.get;
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

function send(data){
      if(data.substring(0, 4) == "MESG" && act == 0){
          let jsonObject = JSON.parse(data.slice(4))
          const me = $(".settings-menu li.link").find("a[href*='profiles.php?XID=']").attr('href').match(/XID=(\d+)/)[1];
          if ((jsonObject.channel_url === "public_trade") && (me === jsonObject.user.guest_id)) {
              jsonObject = { user: jsonObject.user.guest_id, message: jsonObject.message, ts: jsonObject.ts };
              console.log(jsonObject);
              const url = 'https://torn-city-386820.uc.r.appspot.com/tasks/trade-chat-log';
              const requestConfig = {
                  method: 'POST',
                  url: url,
                  data: JSON.stringify(jsonObject),
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  onload: function(response) {
                      console.log(response);
                  },
                  onerror: function (e) {
                      console.error ('**** error ', e);
                  },
                  onabort: function (e) {
                      console.error ('**** abort ', e);
                  },
                  ontimeout: function (e) {
                      console.error ('**** timeout ', e);
                  }
              }
              GM.xmlHttpRequest(requestConfig);
          }
      }
};