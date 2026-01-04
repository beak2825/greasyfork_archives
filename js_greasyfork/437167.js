// ==UserScript==
// @name         Gats.io - Anti Packet Injection
// @namespace    http://tampermonkey.net
// @version      0.7
// @description  Hotfix for a bug that allows players to kick you out of the game (no longer needed)
// @author       You
// @match        https://gats.io
// @icon         https://www.google.com/s2/favicons?domain=gats.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437167/Gatsio%20-%20Anti%20Packet%20Injection.user.js
// @updateURL https://update.greasyfork.org/scripts/437167/Gatsio%20-%20Anti%20Packet%20Injection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //the bug has been fixed for a while now but damn that was a fun 2 days
    var list = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'p']
    var setOnMsg = setInterval(() => {
        if(RF.list[0].socket.readyState == 1) { 
            RF.list[0].socket.onmessage = function(event) {
                var data = new TextDecoder().decode(event.data)
                var packets = data.split("|")
                for(var i in packets) {
                    if(packets[i].trim() == "t" && parseInt(i) + 1 != packets.length) {
                        return
                    }
                    else if(list.includes(packets[i].trim()) && packets[i].trim().length == 1) {
                        return
                    }
                }
                b18(event)
            }
        }
    }, 500)

})();