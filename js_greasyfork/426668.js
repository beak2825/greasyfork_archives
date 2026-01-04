// ==UserScript==
// @name         Lag Insta by CyRuler
// @namespace    -
// @version      1.0
// @description  -
// @author       CyRuler
// @match        *moomoo.io/*
// @match        *dev.moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @downloadURL https://update.greasyfork.org/scripts/426668/Lag%20Insta%20by%20CyRuler.user.js
// @updateURL https://update.greasyfork.org/scripts/426668/Lag%20Insta%20by%20CyRuler.meta.js
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
        if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox'){
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
            }, 100);
            setTimeout( () => {
                send(["5", [primaryWeapon, true]]);
                send(["7", [1]]);
                send(["13c", [0, 0, 1]]);
                send(["13c", [0, 0, 0]]);
            }, 160);
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
})();