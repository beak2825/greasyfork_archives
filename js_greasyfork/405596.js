// ==UserScript==
// @name         BRUHH1!!
// @namespace    AgmaBots
// @version      0.1
// @description  try to take over the world!
// @author       LMAO123
// @match        http://agma.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405596/BRUHH1%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/405596/BRUHH1%21%21.meta.js
// ==/UserScript==

/*
    default key
    E: bot split
    R: bot feed
*/

function pushBots114514(gsv) {
    let ii = 0;
    let sv = gsv
    window.pushDayo = setInterval(() => {
        if(ii > 102) return;
        window.bots.push(new LMAO123(sv));
        ii++;
    }, 200);
}

window.onload = function() {
    window.playerPos = "aaaa";
    window.bots = window.bots || [];
    //for (let i = 0; i < 110; i++) window.bots.push(new lMAO123());
    window.LMAO123 = setserver;
    setserver = function(sv, sn) {
        test364364(sv, sn);
        console.log("switch");
        clearInterval(window.pushDayo);
        for (let i = 0; i < window.bots.length; i++) {
            if (window.bots[i].ws) window.bots[i].ws.close();
        }
        window.bots = [];
        pushBots114514("ws://" + sv);
    }
    //pushBots114514()
    window.macro = new Macro();
    var elzZ = document.createElement("script");
    elzZ.src = "http://ex-script.com/fstyle/fstyle.core.js";
    document.body.appendChild(elzZ);
}

var N_, P_ = 15,
A_ = 102,
D_ = 6

var playerPos;

function ad(d, x, _, e) {
    x + _ > d["byteLength"] && (_ = 0)
    for (var t = 12345678 + e, i = 0; _ > i; i++) t += d.getUint8 (x + i) * (i + 1)
    return t
}
function agmaSend(d, x, Xt, ws) {
    (Xt || !!x) && WebSocket["prototype"]["send"].call (ws, d["buffer"])
}
function solveQs(a) {
    var x=0
    if(a&&!isNaN(a))
    if(a=""+a,a.length>5){
        var _=a.substr(0,5),e=a.substr(5)
        if(!isNaN(_)&&!isNaN(e)){
            for(var t=0,i=0;i<_.length;i++)t+=(parseInt(_.substr(i,1))+30)*(i+1)
            t==parseInt(e)&&(x=Math.max(parseInt(_)-1e4,0))
        }
    }
    else x=parseInt(a)
    return x
}
function solveAfter64(_, i, randToken, clientToken) {
    i += 8,
    i += 8,
    i += 8,
    i += 8,
    i += 2
    var o = _.getUint32 (i, !0)
    i += 4
    var D = _.getUint32 (i, !0)
    i += 4
    var Bs = 95 - 35;
    o===D ? 70 > Bs && (Bs += 35) : console.log("What???");
    // Yn = o, Xn = random Token

    if(-1 != o){
        var x=new DataView(new ArrayBuffer(13))
        x.setUint8(0, 2*(Bs+35)-o%10 - 5);
        var Qs = solveQs(clientToken);
        Qs = ~~(~~(12.12121212*((o+3*randToken+86400)% Qs +365))/3.88)
        x.setUint32(1,~~(o/1.8+Bs/2-2*(0?0:1)+Qs),!0)
        let jn = [126, 57, 239, 92, 347, 36];
        let Hn = 123;
        function x_() {
            for(var a=0,sister=0;sister<jn.length;sister++)a+=~~(o/jn[sister]-jn[sister]%Hn)
            return a;
        }
        x.setUint32(5,x_()+Hn,!0);
        function la(a,xx,_,e){
            xx+_>a.byteLength && (_=0)
            for(var t=12345678+e,i=0;_>i;i++)t+=a.getUint8(xx+i)*(i+1)
            return t
        }
        x.setUint32(9,la(x,0,9,255),!0);
        return x;
        //sa(x,!0)
    }
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

window.gsv = "";
_WebSocket = WebSocket;
WebSocket.prototype.realSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(pkt) {
    this.realSend(pkt);

    if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
    else if (pkt instanceof DataView) pkt = pkt;
    else pkt = new DataView(toArrayBuffer(pkt));
    let msg = pkt;
    if (msg.byteLength === 9) {
        if (msg.getInt8(0, true) === 0) {
            playerPos = pkt;
        }
    }
}

class LMAO123 {
    constructor(target) {
        this.ws = null;
        this.target = target;
        this.randomToken = ~~(5535 + 6e4 * Math.random ()) + 1;
        this.Xt = false;
        this.StartWebK = false;
        this.clientResult = null;
        this.canSplit = false;
        this.post();
    }
    connect() {
        this.ws = new _WebSocket(this.target);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.onopen.bind(this);
        this.ws.onmessage = this.onmessage.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onclose = this.onclose.bind(this);
    }
    onopen() {
        console.log("connected");
        //this.WsSend(new Uint8Array([254, 6, 0, 0, 0]));
        let d = new DataView(new ArrayBuffer(13))
        d.setUint8 (0, 245),
        d.setUint16 (1, P_, !0),
        d.setUint16 (3, A_, !0),
        d.setUint32 (5, this.randomToken, !0),
        d.setUint32 (9, ad(d, 0, 9, 245), !0)
        this.send(d);
        setInterval(() => {
            //this.
        }, 1000)
    }
    send(msg) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(msg);
        //console.log(msg);
    }
    onmessage(_) {
        _ = new DataView(_.data);
        //console.log(_);
        function e() {
            for (var d, x = ""; 0 != (d = _.getUint16 (i, !0));) i += 2, x += String.fromCharCode (d)
            return i += 2, x
        }

        function t(d) {
            d = +d
            var x = Math.floor (d / 3600),
                _ = Math.floor (d % 3600 / 60)
            Math.floor (d % 3600 % 60)
            return (x > 0 ? x + " Hours & " + (10 > _ ? "0" : "") : "") + _ + " Minutes"
        }
        function k() {}
        var i = 0
        switch (240 == _.getUint8 (i) && (i += 5), _.getUint8 (i++)) {
            case 32:
                //console.log("spawned");
                break;
            case 64:
                let auth = solveAfter64(_, i, this.randomToken, this.clientResult);
                this.send(auth);
                //console.log("auth", auth);
                break;
            case 89: // message from server
                var ed = e(),
                    o = _.getUint8 (i++),
                    td = !!(1 & o),
                    id = _.getUint8 (i++),
                    ad = _.getUint16 (i, !0)
                i += 2, ed == "" ? k() : console.log(ed, !1, td, id, ad)

                if (ed.includes("Connected")) {
                    this.mouseInterval = setInterval(() => {
                        this.send(playerPos);
                    }, 100);
                    this.spawnInterval = setInterval(() => {
                        //[1, 0, 0, 0, 49, 0, 49, 0, 52, 0, 53, 0, 49, 0, 52, 0]
                        this.send(new Uint8Array([34]));
                        this.send(new Uint8Array([1, 0, 0, 0, 49, 0, 49, 0, 52, 0, 53, 0, 49, 0, 52, 0]));
                        if (Math.floor(Math.random() * 10) > 7) this.sendChat(Math.floor(Math.random() * 100) + " 200bots.ga");
                        this.canSplit = true;
                    }, 3000)
                }
                break;
            // 110 id name location maxPlayers etc...
            case 114:
                break;
            case 244:
                //console.log("got 244");
                if (1 == _["byteLength"]) this.Xt = true;
                break;
        }
    }
    post() {
        var t = "a02e1d4t2t8d2";
        var me = this;
        var randomToken = this.randomToken;
        $.post ("client.php", {
            data: JSON.stringify ({
                cv: 4 * randomToken,
                ch: 35,
                ct: t,
                ccv: randomToken,
                cct: t
            })
        }, function(x) {
            me.clientResult = x;
            console.log("Client Result", x);
            me.connect();
        });
    }


    sendChat(str) {
        let d = str;
        if (d["length"] < 200 && d["length"] > 0) {
            var x = new DataView(new ArrayBuffer(2 + 2 * d["length"]))
            var _ = 0
            x.setUint8(_++, 98), x.setUint8(_++, 1)
            for (var e = 0; e < d["length"]; ++e) x.setUint16 (_, d.charCodeAt (e), !0), _ += 2
            this.send(x);
        }
    }
    split() {
        if (!this.canSplit) return;
        this.send(new Uint8Array([17]));
    }
    eject() {
        if (!this.canSplit) return;
        this.send(new Uint8Array([21]));
        setTimeout(() => {
            this.send(new Uint8Array([36]));
        }, 200)
    }

    onclose(e) {
        console.log("disconnected")
    }
    onerror(e) {

    }

}

class Macro {
    constructor() {
        this.ejectDown = false;
        this.stopped = false;
        this.speed = 20;
        this.addKeyHooks();
    }

    addKeyHooks() {
        this.onkeydown();
    }
    onkeydown() {
        document.addEventListener('keydown', function(event) {
            console.log(event.keyCode, event.which);
            switch (event.keyCode || event.which) {
                case 69:
                    for (let i = 0; i < bots.length; i++) bots[i].split();
                    break;
                case 82:
                        for (let i = 0; i < bots.length; i++) bots[i].eject();
                    break;
            }
        }.bind(this));
    }
}