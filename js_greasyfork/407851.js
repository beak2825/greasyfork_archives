// ==UserScript==
// @name         Server Uptime
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  made for 100% scale
// @author       Aaa > Aeros
// @match        *://*.diep.io/*
// @icon         https://cdn.discordapp.com/attachments/215907305231876096/707356518034571302/diepbox.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407851/Server%20Uptime.user.js
// @updateURL https://update.greasyfork.org/scripts/407851/Server%20Uptime.meta.js
// ==/UserScript==
(function(){//info
	if(window.updateInfo) return;
    //some coding info
	var info = {};
	var info_container = document.createElement("div");
    info_container.style.cssText = "color: white; position: fixed; text-shadow: -2px 0 black, 0 2px black,	2px 0 black, 0 -2px black, -2px -2px black, -2px 2px black, 2px 2px black, 2px -2px black; font-family: Ubuntu; font-size: 20px; top: 0.5%; left: 2%"
	info_container.style["pointer-events"] = "none"; //its text info
	document.body.appendChild(info_container);

	function toggle_info_container(e){
		if(e.key == "i"){
			info_container.style.display = info_container.style.display=="block" ? "none" : "block";
		}
	}
	window.addEventListener("keyup", toggle_info_container);

	window.updateInfo = function(key, value){
		if(!value) delete info[key];
		else info[key] = value;
		var a1 = "";
		for(var _key in info){
			a1 += info[_key] + "\n"; //makes data changing
		}
		info_container.innerText = a1;
	};
})();
(function() {
    'use strict';
    WebSocket.prototype._send = WebSocket.prototype.send; //its ur websocket
    WebSocket.prototype.send = function (data) {
        this._send(data);
        this.addEventListener('message', function (msg) { //receive messages
            let A = new Uint8Array(msg.data)
            if(A[0] == 0){
                let aaa = Array.from(A).slice(1)
                this.aaa = 0;
                for (let i = 0; i < aaa.length; i++)
                {
                     this.aaa += aaa[i] % 128 * Math.pow(128, i); //vu
                     if (aaa[i] < 128) break; //parse
                }
                let Aaa = this.aaa * 40 / 1000 / 60
                let AAA = Math.round(Aaa)
                if(AAA >= 60) {
                     let a = (AAA / 60 | 0) + " hours " + AAA % 60 + " minutes" ;
                     window.updateInfo && window.updateInfo("time", "Server time: " + a); //full time
                } else {
                     let a = AAA + " minutes";
                     window.updateInfo && window.updateInfo("time", "Server time: " + a);
                };
            }
        }, false);
        this.send = function (data) {
            this._send(data); //send packets back
        };
    }
})();