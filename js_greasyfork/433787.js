// ==UserScript==
// @name         Powerline.io Bots + food
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  You can spawn lot of food!
// @author       Maze
// @match        http://powerline.io/
// @icon         https://www.google.com/s2/favicons?domain=powerline.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433787/Powerlineio%20Bots%20%2B%20food.user.js
// @updateURL https://update.greasyfork.org/scripts/433787/Powerlineio%20Bots%20%2B%20food.meta.js
// ==/UserScript==

class User {
  constructor() {
    this.wsip = "wss://botsproject.glitch.me/"
    this.ws = null;
    this.connect()
    this.bindkeys();
    this.server = null;
    this.startedbots = false;
}

  connect() {
    this.ws = new WebSocket(this.wsip);
    this.ws.onopen = this.onopen.bind(this);
    this.ws.onclose = this.onclose.bind(this);
    this.ws.onerror =this.onerror.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
}
send(message) {
        if (this.ws && this.ws.readyState == 1) this.ws.send(JSON.stringify(message));
    }
  onopen() {
        console.log("Connected!")
      setTimeout(()=>{setInterval(()=>{this.startBots();},1000)},1500)
    }
    onclose() {

    }
    onmessage(a) {
      a = JSON.parse(a.data);
      switch(a.type) {
        case '':
          // get the element that's tallying bots and change it to
          //the message which tells you how many bots are on.
          // use the `${a.msgTYPEHERE}/${a.msgtype}` to get the amount that the server is sending.
          // Use the json {} in sendconnetedbots function for help to see what they're sending
          break;
}

    }
    onerror(a) {

    }


  bindkeys() {
     null;
}

  startBots() {
      console.log('bots started')
    let json = {}; json.type = "_0x82"; json.ip = window.server; this.send(json);
}

  stopBots() {

    this.send({
            type: '_0x83'
        });


}
    turnPos(){
       this.send({type:'turn',data:window.turnPoint})
   }
}

if (!window.usr) window.usr = new User();
WebSocket.prototype.reaSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(pkt) {
    this.reaSend(pkt);
    if (typeof pkt == 'string') return;
    if (this.url.includes('localhost')) return;
    if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
    else if (pkt instanceof DataView) pkt = pkt;
    else pkt = new DataView(pkt.buffer);
    window.server = this.url;
}