// ==UserScript==
// @name         real 1 frame hmm
// @namespace    -
// @version      0.1
// @description  -xd
// @author
// @match        *moomoo.io/*
// @match        *dev.moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/446325/real%201%20frame%20hmm.user.js
// @updateURL https://update.greasyfork.org/scripts/446325/real%201%20frame%20hmm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let mouseX;
    let mouseY;
    let width;
    let height;
    var ws;
    var msgpack5 = msgpack;
    let user = {
        id: null,
        x: null,
        y: null,
        dir: null,
        weapon: null
    };
    var primaryWeapon, secondaryWeapon;
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
        if (item == "1" && user.id == null){
            user.id = data[1];
        }
        if (item == "33") {
            for(let i = 0; i < data[1].length / 13; i++) {
                let playerInfo = data[1].slice(13*i, 13*i+13);
                if(playerInfo[0] == user.id) {
                    user.x = playerInfo[1];
                    user.y = playerInfo[2];
                    user.dir = playerInfo[3];
                    user.weapon = playerInfo[5];
                    user.clan = playerInfo[7];
                }
            }
        }
        update();
    }

    function send(sender){
        ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
    }

    function isElementVisible(e) {
        return (e.offsetParent !== null);
    }
    document.addEventListener('keydown', (e)=>{
        if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox'){
            send(["5", [primaryWeapon, true]]);
            send(["13c", [0, 7, 0]]);
            send(["7", [1]]);
            setTimeout( () => {
                var sck = "";
                send(["13c", [0, 53, 0]]);
                send(["5", [secondaryWeapon, true]]);
                for(let i = 0; i < 500; i++){
                    let caas = new Uint8Array(490);
                    for(let i = 0; i <caas.length;i++){
                        caas[i] = Math.floor(Math.random()*5);
                        sck += caas[i]
                    }
                }
                ws.send(caas);
            }, 50);
            setTimeout( () => {
                send(["5", [primaryWeapon, true]]);
                send(["7", [1]]);
                send(["13c", [0, 0, 1]]);
                send(["13c", [0, 0, 0]]);
            }, 250);
        }
    })
    function update() {
        for (let i=0;i<9;i++){
            if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
                primaryWeapon = i;
            }
        }
        for (let i=9;i<16;i++){
            if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
                secondaryWeapon = i;
            }
        }
    }
window.addEventListener("mousedown", (e)=>{
    if (e.which == 3) {
                        doNewSend(["7", [1]]);
    doNewSend(["13c", [0, 40, 0]]);
                doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 18, 1]]);
    }
}, false);
window.addEventListener("mouseup", (e)=>{
    if (e.which == 3) {
                doNewSend(["7", [2]]);
            doNewSend(["13c", [0, 0, 1]]);
                    doNewSend(["13c", [0, 0, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
            if (myPlayer.y < 2400 && isEnemyNear == false) {
                doNewSend(["13c", [0, 15, 0]]);
                doNewSend(["13c", [0, 11, 1]]);
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550 && isEnemyNear == false) {
                doNewSend(["13c", [0, 31, 0]]);
                doNewSend(["13c", [0, 11, 1]]);
            } else {
	            doNewSend(["13c", [0, 12, 0]]);
                doNewSend(["13c", [0, 11, 1]]);
            }
    }
}, false);
window.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
}, false);
})();