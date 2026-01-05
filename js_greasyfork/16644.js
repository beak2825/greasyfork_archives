// ==UserScript==
// @name          Fascist Glory Device Explosions on Map for Planets.nu
// @description   Shows Fascist Glory Device Explosions on Map
// @include       http://play.planets.nu/*
// @include 	  http://test.planets.nu/*
// @include 	  http://planets.nu/*
// @version 0.2
// @namespace https://greasyfork.org/users/2860
// @downloadURL https://update.greasyfork.org/scripts/16644/Fascist%20Glory%20Device%20Explosions%20on%20Map%20for%20Planetsnu.user.js
// @updateURL https://update.greasyfork.org/scripts/16644/Fascist%20Glory%20Device%20Explosions%20on%20Map%20for%20Planetsnu.meta.js
// ==/UserScript==
// Version History
// 0.1: Show Explosions on Map for Fascists with Glory Device Detonations. In Pink/Lavender
// 0.2: Add explosions on map if _you_ are hit with Glory Device Detonations
function wrapper () { // wrapper for injection

vgaPlanets.prototype.parseMessages = function () {
        if (!this.mymessages)
            this.mymessages = new Array();

        this.dipTurnCount = 0;
        for (var i = 0; i < this.mymessages.length; i++) {
            var message = this.mymessages[i];
            if (message.turn == vgap.settings.turn) {
                if (message.ownerid == vgap.player.id && message.messagetype != 0)
                    this.dipTurnCount++;
            }
            else
                break;
        }

        this.explosions = new Array();
        for (var i = 0; i < vgap.messages.length; i++) {
            var message = vgap.messages[i];
            if (message.messagetype == 10) {
                message.fatal = true;
                message.color = "rgba(255, 0, 255, 0.5)";
                this.explosions.push(message);
            }
            else if (message.messagetype == 16) {
                if (message.body.indexOf(message.headline + " has struck a mine!") >= 0 || message.body.indexOf(" has struck a WEB mine!<br/>") >= 0) {
                    if (message.body.indexOf("WEB") > 0)
                        message.color = "rgba(0,255,128,0.3)";
                    else
                        message.color = "rgba(255,255,0,0.3)";

                    var dam = message.body.substr(message.body.indexOf("Damage is at: ") + "Damage is at: ".length, 3);
                    if (dam.charAt(2) != " " && dam.charAt(2) != "<")
                        message.fatal = true;

                    this.explosions.push(message);
                }
            }
			else if (message.messagetype == 7)
			{
				if (message.body.indexOf("Glory") >=0) {
					message.color = "rgba(255,130,171,0.5)";
					message.fatal = true;
					this.explosions.push(message);
				}
			}
			else if (message.messagetype == 8)
			{
				if (message.body.indexOf("shockwave") >=0) {
					message.color = "rgba(255,130,171,0.5)";
					message.fatal = true;
					this.explosions.push(message);
				}
			}
        }
    };   
	
} //wrapper for injection




var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);