// ==UserScript==
// @name        Hide full rooms - bonk.io
// @namespace   left paren
// @match        https://bonk.io/gameframe-release.html
// @grant       none
// @version     1.0
// @author      left paren
// @license     Unlicense
// @description Hides rooms that are full in bonk.io.
// @downloadURL https://update.greasyfork.org/scripts/455222/Hide%20full%20rooms%20-%20bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/455222/Hide%20full%20rooms%20-%20bonkio.meta.js
// ==/UserScript==


let hfrOldSend = XMLHttpRequest.prototype.send
let hfrOldOpen = XMLHttpRequest.prototype.open

XMLHttpRequest.prototype.open = function(_, url) {
    if (url.includes("scripts/getrooms.php")) {
        this.hfrIsGetRooms = true
    }
    hfrOldOpen.call(this, ...arguments)
}

XMLHttpRequest.prototype.send = function(data) {
    if (this.isGetRooms) {
        this.hfrOldReadyChange = this.onreadystatechange
        this.onreadystatechange = function () {
            if (this.readyState == 4) {
                var respJson = JSON.parse(this.response)
                if (respJson.rooms) {
                  respJson.rooms = respJson.rooms.filter(room => room.players < room.maxplayers)
                }

                let newText = JSON.stringify(respJson)
                var newResp = () => {
                    return newText
                }
                this.__defineGetter__("responseText", newResp)
                this.__defineGetter__("response", newResp)
            }
            this.hfrOldReadyChange?.call(this, ...arguments)
        }
    }
    hfrOldSend.call(this, ...arguments)
}