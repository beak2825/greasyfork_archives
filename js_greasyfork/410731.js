// ==UserScript==
// @name         Jstris Unofficial Matchmaking
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds fast but unofficial matchmaking to jstris (still in development)
// @author       orz
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410731/Jstris%20Unofficial%20Matchmaking.user.js
// @updateURL https://update.greasyfork.org/scripts/410731/Jstris%20Unofficial%20Matchmaking.meta.js
// ==/UserScript==

/**************************
    Skin Storage Script
**************************/
(function() {

    window.addEventListener('load', function(){

function initMM() {

if (window.MMInited)
    return;
window.MMInited = true;

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

var setPlayerList = (list) => {
    document.getElementById("mmPlayers").innerHTML = "<h3>Queue:</h3>"+list.map(e=>e.name).join("<br>");

}

var openMMSocket = (playerObj) => {
    let socket = new WebSocket("wss://jstris-matchmaking.herokuapp.com");

    socket.onopen = (e) => {
        console.log("entered matchmaking");
        socket.send(JSON.stringify({code: "player", ...playerObj}));
    };

    socket.onmessage = (event) => {
        var msg = JSON.parse(event.data);
        if (msg.code == "playerList") {
            setPlayerList(msg.players);
        }
        if (msg.code == "match") {
            this.joinRoom(msg.rid);
            toggleMM();
            document.getElementById("mmPlayers").innerHTML = "<h3>Match found</h3>";
            setTimeout(()=>document.getElementById("mmPlayers").innerHTML = "",3000)
        }
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log('clean close');
        } else {
            console.log('unclean close');
        }
        clearInterval(window.timer);
        document.getElementById("mmTimer").innerHTML = ""
        if (window.inMM) {
          toggleMM();
        }
    };

    socket.onerror = (error) => {
        alert(`[Error Occured] Server is likely borked.`);
    };
    return socket;
}

var setTimer = (secs) => {

    var hours = Math.floor(secs / 60 / 60);

    var minutes = Math.floor(secs / 60) - (hours * 60);

    var seconds = secs % 60;

    var formatted = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');

    document.getElementById("mmTimer").innerHTML = formatted;
}


var toggleMM = () => {
	window.inMM = !window.inMM;
	if (window.inMM) {
        document.getElementById("mmButton").innerHTML = "Leave Matchmaking"
        fetch("https://jstris.jezevec10.com/api/u/"+this.chatName+"/live/games?offset=0", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("oiawjeofijaweiofj");
            var len = result.length;
            var apm = result.reduce((total, element) => total + element.attack / element.gametime * 60, 0) / result.length;
            window.MMsocket = openMMSocket({user: this.chatName, apm: apm});
            window.timeInQueue = 0;
            setTimer(0);
            window.timer = setInterval(() => setTimer(window.timeInQueue++), 1000);
        }).catch(error => {
            console.log('error', error)
            window.MMsocket = openMMSocket({user: this.chatName, apm: 0});
        });
	} else {
        document.getElementById("mmButton").innerHTML = "Enter Matchmaking"
        document.getElementById("mmPlayers").innerHTML = "";
        window.MMsocket.close();
	}
}

var mmBox = document.createElement("DIV");
mmBox.id = "mmBox";
mmBox.style = "position:absolute; bottom:20px; left: 20px;";
mmBox.innerHTML = "";

var mmPlayers = document.createElement("DIV");
mmPlayers.id = "mmPlayers";
mmPlayers.style = "";

var mmButton = document.createElement("BUTTON");
mmButton.id = "mmButton";
mmButton.addEventListener('click', toggleMM);
mmButton.style = "";
mmButton.innerHTML = "Enter Matchmaking";

var mmTimer = document.createElement("DIV");
mmTimer.id = "mmTimer";

mmBox.appendChild(mmPlayers);
mmBox.appendChild(mmTimer);
mmBox.appendChild(mmButton);
document.body.appendChild(mmBox);

}

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
var randomizeStart = Live['prototype']['onCIDassigned'].toString()
randomizeStart = trim(randomizeStart) + ";" + trim(initMM.toString());
Live['prototype']['onCIDassigned'] = new Function(randomizeStart);



    });
})();