// ==UserScript==
// @name       MY MOD
// @version    beta
// @description MOOMOO.IO WORKING MACROS, TRAP => F || Spike => V || Food => Q || WINDMILLS => N
// @author     DETIX || discord => detixthegoat
// @match      *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/474000/MY%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/474000/MY%20MOD.meta.js
// ==/UserScript==
let author = {
    name: "DETIX",
    discord: "detixthegoat"
};

const { name, discord } = author;

if (name === "DETIX" && discord === "detixthegoat") {
    var foodType = 0,
        spikeType = 6,
        millType = 10,
        boostType = 15;

    let pressedF,
        pressedV,
        pressedN,
        pressedQ;

    let cps = 25
    let realCps = Math.round(1000 / cps);

    var mouseX;
    var mouseY;
    var ws;
    var width;
    var height;
    var msgpack5 = msgpack;
    const place = (id, thisCps) => {
        if(pressedV & pressedQ || pressedN & pressedQ || pressedF & pressedQ){
            thisCps = cps
            cps = thisCps / 2
            doNewSend(["5", [id, null]]);
            doNewSend(["c", [1]]);
            doNewSend(["c", [0]]);
            cps = thisCps
            pressedQ = false
            pressedV = false
            pressedF = false
            pressedN = false
        } else {
            doNewSend(["5", [id, null]]);
            doNewSend(["c", [1]]);
            doNewSend(["c", [0]]);
        }
    }
    const isElementVisible = (e) => {
        return (e.offsetParent !== null);
    }
    const doNewSend = (sender) => {
        ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
    }
    const repeater = (e, o, t) => {
        var a = !1
        , n = void 0;
        return {
            start(r) {
                r == e && "chatbox" !== document.activeElement.id.toLowerCase() && (a = !0, void 0 === n && (n = setInterval(function() {
                    typeof (o) == "function" && (o())
                    a || (clearInterval(n), n = void 0)
                }, t)))
            }
            , stop(o) {
                o == e && "chatbox" !== document.activeElement.id.toLowerCase() && (a = !1)
            }
        }
    };
    var joinButton = document.querySelector('#enterGame');
    document.getElementById("promoImgHolder").remove();
    document.querySelector("#pre-content-container").remove();
    $("#youtuberOf").remove();
    $("#adCard").remove();
    $("#mobileInstructions").remove();
    $("#downloadButtonContainer").remove();
    $("#mobileDownloadButtonContainer").remove();
    $(".downloadBadge").remove()
    function e(playerName) {
        playerName = document.getElementById("nameInput").value;
        $("#ot-sdk-btn-floating").hide();
        doNewSend(["sp", [{
            name: `${playerName}`,
            moofoll: 1,
            skin: "constructor"
        }]]);
    }
    joinButton.addEventListener('click', function() {
        e();
    });
    const spike = repeater(86, () => {
        pressedV = true
        place(spikeType)
    }, realCps);
    const food = repeater(81, () => {
        pressedQ = true
        place(foodType);
    }, 78);
    const boost = repeater(70, () => {
        pressedF = true
        place(boostType)
    }, realCps);
    const windmills = repeater(78, () => {
        pressedN = true
        place(millType)
    }, realCps);
    document.addEventListener('keydown', (e)=>{
        windmills.start(e.keyCode);
        food.start(e.keyCode);
        spike.start(e.keyCode);
        boost.start(e.keyCode);
    })
    document.addEventListener('keyup', (e) => {
        windmills.stop(e.keyCode);
        food.stop(e.keyCode);
        spike.stop(e.keyCode);
        boost.stop(e.keyCode);
    });

    function update() {
        for(let i=16;i<19;i++){if(isElementVisible(document.getElementById("actionBarItem"+i.toString()))){foodType=i-16}}
        for(let i=22;i<26;i++){if(isElementVisible(document.getElementById("actionBarItem"+i.toString()))){spikeType=i-16}}
        for(let i=26;i<29;i++){if(isElementVisible(document.getElementById("actionBarItem"+i.toString()))){millType=i-16}}
        for(let i=31;i<33;i++){if(isElementVisible(document.getElementById("actionBarItem"+i.toString()))){boostType=i-16}}
    }

    let myPlayer = {
        id: null,
        x: null,
        y: null,
        dir: null,
        object: null,
        weapon: null,
        clan: null,
        isLeader: null,
        hat: null,
        accessory: null,
        isSkull: null
    };

    document.msgpack = msgpack;
    function n(){
        this.buffer = new Uint8Array([0]);
        this.buffer.__proto__ = new Uint8Array;
        this.type = 0;
    }
    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(m){
        if (!ws){
            document.ws = this;
            ws = this;
            socketFound(this);
        }
        this.oldSend(m);
    };
    function socketFound(socket){
        socket.addEventListener('message', function(message){
            handleMessage(message);
        });
    }
    function handleMessage(m){
        let temp = msgpack5.decode(new Uint8Array(m.data));
        let data;
        if(temp.length > 1) {
            data = [temp[0], ...temp[1]];
            if (data[1] instanceof Array){
                data = data;
            }
        } else {
            data = temp;
        }
        let item = data[0];
        if(!data) {return};
        if(item === "io-init") {
            let cvs = document.getElementById("gameCanvas");
            width = cvs.clientWidth;
            height = cvs.clientHeight;
            $(window).resize(function() {
                width = cvs.clientWidth;
                height = cvs.clientHeight;
            });
            cvs.addEventListener("mousemove", e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
        }
        update();
    }

} else {
    (function(log, a){
        log = console.log;
        a = alert;
        log(":D");
        a("Script Made By DETIX :/")
    })();
}