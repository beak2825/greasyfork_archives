// ==UserScript==
// @name         Link Copier
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Allows you to copy links that you normally wouldn't be able to copy from (i.e. Maze, FFA, ect..)
// @author       Someone
// @match        https://diep.io/
// @downloadURL https://update.greasyfork.org/scripts/410064/Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/410064/Link%20Copier.meta.js
// ==/UserScript==

    var realSend = WebSocket.prototype.send;
    var mainWS;
    var serverWS;
    const URLRegex = /^wss?:\/\/[a-z0-9]{4}\.s\.m28n\.net\/$/g;
    let useServerFeatures = false;

    WebSocket.prototype.send = function(data)
    {
        if (!(data instanceof Int8Array && this.url.match(URLRegex)) || this.dontRegister)
        {
            return realSend.call(this, data);
        }

        if (this !== mainWS)
        {
            mainWS = this;
            this.serverID = this.url.split("://")[1].split(".")[0].toLowerCase();
            this.realRecv = this.onmessage;
            this.onmessage = function(event)
            {
                var data = new Uint8Array(event.data);
                switch (data[0])
                {
                    case 4:
                    {
                        if (!this.partyCode) this.onmessage({data: [6]});
                        break;
                    }
                                            case 6:
                    {
                        if (window.location.hash && window.location.hash.indexOf("00") && window.location.hash.indexOf("00") + 2 !== window.location.hash.length)
                        {
                            this.partyCode = window.location.hash.slice(window.location.hash.indexOf("00") + 2).toUpperCase();
                        }
                        else
                        {
                            this.partyCode = Array.from(data).slice(1).map(r => r.toString(16).padStart(2, "0").split('').reverse().join("")).join("").toUpperCase();
                            var x = this.partyCode;
                            console.log(x)
                        }
                        if (useServerFeatures) serverWS.send("\x00" + this.serverID + "\x00" + this.partyCode);
                        break;
                    }
                }
                return this.realRecv.call(this, event);
            }
        }
        return realSend.call(this, data);
    }