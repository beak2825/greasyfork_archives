// ==UserScript==
// @name         Arras Inbound Packet Sniffer
// @namespace    EFdatastuff_Arras_Outbound
// @version      0.1.0
// @description  Logs inbound packets from arras
// @author       EternalFrostrOrig (@EternalFrost#0955 /u/PineappleNarwhal)
// @match        http://arras.io/
// @match        http://arras-proxy.surge.sh/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383723/Arras%20Inbound%20Packet%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/383723/Arras%20Inbound%20Packet%20Sniffer.meta.js
// ==/UserScript==

/* global Arras */

(function() {
    'use strict';
    try {

        Function.prototype.clone = function() {
            var that = this;
            var string_version = that.toString()
            string_version = string_version.replace(/\.data\);/gi, '.data);console.log(e);')
            string_version = string_version.replace(/function\(.\)\{/gi, "")
            string_version = string_version.replace(";}}", ";}")

            console.log(string_version)
            that = Function("e", string_version)
            console.log(that)

            var temp = function temporary() { return that.apply(this, arguments); };
            for(var key in this) {
                if (this.hasOwnProperty(key)) {
                    temp[key] = this[key];
                }
            }
            return temp;
        };

        function log(data) {
            console.log("AIPS - ", data)
        }

        var mainObj = Arras(0)

        var isInjected = false

        var captured_func;

        function inject() {
            if (mainObj.socket != undefined && mainObj.socket.talk != undefined) {
                log("Socket methods ready, beginging injection...")
                clearInterval(injectLoop)

                captured_func = mainObj.socket.onmessage.clone()
                mainObj.socket.onmessage = captured_func
                mainObj.socket.onmessage("a")
                isInjected = true
            }
        }

        var injectLoop = setInterval(inject, 3)
        } catch(e) {}
})();