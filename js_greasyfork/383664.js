// ==UserScript==
// @name         Arras Outbound Packet Sniffer
// @namespace    EFdatastuff_Arras_Outbound
// @version      1.0.1
// @description  Logs outbound packets from arras
// @author       EternalFrostrOrig (@EternalFrost#0955 /u/PineappleNarwhal)
// @match        http://arras.io/
// @match        http://arras-proxy.surge.sh/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383664/Arras%20Outbound%20Packet%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/383664/Arras%20Outbound%20Packet%20Sniffer.meta.js
// ==/UserScript==

/* global Arras */

(function() {
    'use strict';
    try {

        Function.prototype.clone = function() {
            var that = this;
            var temp = function temporary() { return that.apply(this, arguments); };
            for(var key in this) {
                if (this.hasOwnProperty(key)) {
                    temp[key] = this[key];
                }
            }
            return temp;
        };

        function log(data) {
            console.log("AOPS - ", data)
        }

        var mainObj = Arras(1337)

        var isInjected = false

        var captured_talk

        function inject() {
            if (mainObj.socket != undefined && mainObj.socket.talk != undefined) {
                log("Socket methods ready, beginging injection...")
                clearInterval(injectLoop)

                captured_talk = mainObj.socket.talk.clone()

                log("Captured talk() method, injecting middleman function...")

                mainObj.socket.talk = function(...data) {
                    log(data)

                    switch (data.length) {
                        case 1:
                            captured_talk(data[0])
                            break;
                        case 2:
                            captured_talk(data[0], data[1])
                            break;
                        case 3:
                            captured_talk(data[0], data[1], data[2])
                            break;
                        case 4: captured_talk(data[0], data[1], data[2], data[3])
                            break;
                        default:
                            log("UNABLE TO PROCESS DATA AMOUNT OF LENGTH " + data.length)
                            break;
                    }
                }
                log("Injected sucessfully")
            }
        }

        var injectLoop = setInterval(inject, 3)
        } catch(e) {}
})();