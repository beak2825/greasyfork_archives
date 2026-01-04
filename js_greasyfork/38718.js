// ==UserScript==
// @name         Navigation PRO
// @namespace    -
// @version      1.2
// @description  Map Movement
// @author       Night
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38718/Navigation%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/38718/Navigation%20PRO.meta.js
// ==/UserScript==

var ws;

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    this.oldSend(m);
    if (!ws){
        ws = this;
        socketFound(this);
    }
};

function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

var playersList = [];

function parseWSMsg(s){
    if (s.indexOf("42") === -1) return -1;
    var o = s.substring(s.indexOf("["));
    return JSON.parse(o);
}

var player = function(x,y,id,me){
    this.x = x;
    this.y = y;
    this.id = id;
    this.me = me;
    this.targets = [null, null];

}


function handleMessage(m){
    var info = parseWSMsg(m.data);
    if (info[0] == "1" && !playersList[0]){
        var x = new player(null, null, info[1], true);
        playersList.push(new player(null, null, info[1], true) )
    }

    if (info[0] == "3"){
        let data = info.slice(1, info.length);
        for (var i=0;i<data.length;i++){
            let playerData = data.slice(i*13,(i*13)+13)[0];
            if (playerData[0] == playersList[0].id){
                playersList[0].x = playerData[1];
                playersList[0].y = playerData[2];
                if (playersList[0].targets[0]){

                    let distance = Math.sqrt( Math.pow(playersList[0].targets[1]-playersList[0].y, 2) + Math.pow(playersList[0].targets[0] - playersList[0].x, 2));
                    if (distance < 100){
                        playersList[0].targets = [null, null];
                        for (let elem of document.getElementsByClassName("mapTarget")){
                            elem.remove();
                        }
                        ws.send(`42["3",null]`);
                    } else {
                        ws.send(`42["3",null]`);
                        let delta_y = playersList[0].targets[1]-playersList[0].y;
                        let delta_x = playersList[0].targets[0]-playersList[0].x;

                        let angle = Math.atan2(delta_y, delta_x);
                        ws.send(`42["3",${angle}]`);
                    }
            }
        }
    }
}

document.addEventListener("click", (event)=> {
    [x, y] = [event.clientX, event.clientY];
    if (window.innerWidth >= 770){
        if ((20 <= x && x <= 150) && (710 <= y && y <= 840)){
            let mapSize = [14365, 14365];
            let boxSize = [130, 130];
            let targets = [x-20, y-710].map( (n) => { return n/130*14365; } );
            playersList[0].targets = targets;

            for (let elem of document.getElementsByClassName("mapTarget")){
                elem.remove();
            }

            let newTarget = document.createElement("div");
            newTarget.style = `background:red; width:8.5px; height:8.5px; border-radius:50%; position:absolute; left: ${x}px; top:${y}px; z-index:100`;
            newTarget.className = "mapTarget";
            document.getElementsByTagName("body")[0].appendChild(newTarget);

        }
    }
});

document.addEventListener("keydown", (event)=> {
    if (event.code == "Escape"){
        if (playersList[0]){
            if (playersList[0].targets[0]){
                 playersList[0].targets = [null, null];
                        for (let elem of document.getElementsByClassName("mapTarget")){
                            elem.remove();
                        }
                        ws.send(`42["3",null]`);
            }
        }
    }
});
}