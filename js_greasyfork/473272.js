// ==UserScript==
// @name agar.io Packet Sniffer
// @namespace agar.io
// @version 2.2
// @description Packet sniffer for agar.io (Developer's outmost important script)
// @author Jimboy3100
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require http://code.jquery.com/jquery-latest.js
// @resource https://raw.githubusercontent.com/necolas/css3-github-buttons/master/gh-buttons.css
// @resource https://raw.githubusercontent.com/necolas/css3-github-buttons/master/gh-icons.png
// @match *agar.io/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473272/agario%20Packet%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/473272/agario%20Packet%20Sniffer.meta.js
// ==/UserScript==
_WebSocket = window.WebSocket;
window.key255 = null;
window.key254 = null;
window.encryptionKey = 0;
window.decryptionKey = 0;
window.packetSent=[];
window.packetCount=0;
$.ajax('https://agar.io/agario.core.js', {
    success: core => {
        core = core.replace(/function\((\w)\)\{/i, '$& console.log($1);');
        core = core.replace(/;if\((\w)<1\.0\){/i, `;if($1<!true){`);
        core = core.replace(/function tm\((w)\){/i, '$& console.log($1);');
        core = core.replace(/c\[h>>2\]=d;d/, 'c\[h>>2\]=d;if(window.gotKey == false || window.gotKey == undefined || window.gotKey == null){window.encryptionKey = d; window.gotKey = true; console.log("Encryption key (host):"+d)}d');
        eval(core);
    },
    dataType: 'text',
    method: 'GET',
    cache: false,
    crossDomain: true
});
$( document ).ready(function() {
	window.MC._onPlayerDeath = window.MC.onPlayerDeath,
	window.MC.onPlayerDeath = function() {
        window.MC._onPlayerDeath.apply(this, arguments),
		$("canvas").hide();
     }
	window.MC._onPlayerSpawn = window.MC.onPlayerSpawn,
	window.MC.onPlayerSpawn = function() {
        window.MC._onPlayerSpawn.apply(this, arguments),
		$("canvas").show();
    }
});


function refer(master, slave, prop) {
    Object.defineProperty(master, prop, {
        get: function() {
            return slave[prop];
        },
        set: function(val) {
            slave[prop] = val;
        },
        enumerable: true,
        configurable: true
    });
};
window.WebSocket = function(url, protocols) {
    console.log('Listen');
    if (protocols === undefined) {
        protocols = [];
    }
    var ws = new _WebSocket(url, protocols);
    refer(this, ws, 'binaryType');
    refer(this, ws, 'bufferedAmount');
    refer(this, ws, 'extensions');
    refer(this, ws, 'protocol');
    refer(this, ws, 'readyState');
    refer(this, ws, 'url');
    this.send = function(data) {
        let buf = new Uint8Array(data);
        if (buf[0] == 255) {
            window.key255 = buf;
            console.log(`client key:${window.MC.CLIENT_VERSION}`);
        } else if (buf[0] == 254) {
            console.log(`Protocol version:${buf[1]}`);
        } else {
            buf = window.decryptPacket(buf); console.log("Buffer sent:",buf);
			if (buf.length>3) {
				console.log("Buffer count:",window.packetCount);
				console.log(String.fromCharCode.apply(String, buf));
				window.packetSent[window.packetCount] = buf;
				window.packetCount++;
			}
        }
        return ws.send.call(ws, data);
    };
    this.close = function() {
        return ws.close.call(ws);
    };

    this.onopen = function(event) {};
    this.onclose = function(event) {};
    this.onerror = function(event) {};
    this.onmessage = function(event) {};
    ws.onopen = function(event) {
        console.log(url);
        if (this.onopen) return this.onopen.call(ws, event);
    }.bind(this);
    ws.onmessage = function(event) {
        if (this.onmessage)
            return this.onmessage.call(ws, event);
    }.bind(this);
    ws.onclose = function(event) {
        if (this.onclose) return this.onclose.call(ws, event);
    }.bind(this);
    ws.onerror = function(event) {
        if (this.onerror) return this.onerror.call(ws, event);
    }.bind(this);
};
window.WebSocket.prototype = _WebSocket;
window.decryptPacket = function(data) {
    for (var i = 0; i < data.length; i++) {
        data[i] = data[i] ^ window.encryptionKey >>> i % 4 * 8 & 255;
    }
    window.encryptionKey = window.rotateKey(window.encryptionKey);
    return data;
};
window.xorBuf = function(data, key) {
    for (var i = 0; i < data.length; i++) {
        data[i] = data[i] ^ key >>> i % 4 * 8 & 255;
    }
    return data;
};
window.rotateKey = function(key) {
    key = Math.imul(key, 1540483477) >> 0;
    key = Math.imul(key >>> 24 ^ key, 1540483477) >> 0 ^ 114296087;
    key = Math.imul(key >>> 13 ^ key, 1540483477) >> 0;
    return key >>> 15 ^ key;
};
