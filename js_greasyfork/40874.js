// ==UserScript==
// @name         for goat
// @description  crown for goat
// @namespace    http://tampermonkey.net/
// @author       Havoc
// @match        http://alis.io/*
// @match        http://*.alis.io/*
// @version      1.3
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40874/for%20goat.user.js
// @updateURL https://update.greasyfork.org/scripts/40874/for%20goat.meta.js
// ==/UserScript==

onMultiChat = (user, message) => {
    if (currentIP === "") return;
    if(user == 'SERVER' && message[0] == '/') {
        var split = message.slice(1, message.length).split(': ');
        var command = split[0];
        split.splice(0,1);
        var response = split.join().trim();
        if(command == 'playerid') console.log(`%c  Player ID: ${response}  `, 'background: #262626 ; color: #ffd700; font-size:10px; font-family: "Segoe UI"'); myid = response;
    }
};

updatePlayerID = () => setTimeout(() => { sendChat('/getmyid'); }, 200);

var split = (splitTimes) => {
    var data = new DataView(new ArrayBuffer(1));
    data.setUint8(0, 17);
    for (var index = 0; index < splitTimes; index++) {
        setTimeout(() => {
            webSocket.send(data.buffer);
        }, index * 50);
    }
};

unsafeWindow.crown = (a) => {
    var delay;
    typeof(a) !== 'undefined' ? delay = 500 : delay = 0;
    setTimeout(() => {
        var waitForPlayerID = setInterval(() => {
            if (typeof(myid) === "undefined" ? false : myid !== "") {
                playerDetails[myid].customImages = [{x: -0.6, y: -2.20, url: "https://i.imgur.com/3STWHPg.png"}];
                console.log(`%c  Crown loaded for ${playerDetails[myid].name === "" ? 'Unnamed' : playerDetails[myid].name}? `, 'background: #262626 ; color: #ffd700; font-size:16px; font-family: "Segoe UI"');
                clearInterval(waitForPlayerID);
            }
        }, 50);
    }, delay);
};

$("#maincard").on("click", "button", (e) => {
    if (currentIP === "") return;
    if($($(e.currentTarget)).text() === 'Play') {
        updatePlayerID();
        console.log('%c  Loading crown...  ', 'background: #262626 ; color: #ffd700; font-size:14px; font-family: "Segoe UI"');
		crown();
    }
});

$("body").on("keydown",(e) => {
    if (currentIP === "") return;
    if (e.keyCode === Object.entries(JSON.parse(getLocalStorage('hotkeyMapping'))).find(i => i[1] === "hk_start_new_game")[0].charCodeAt(0) && !$('#input_box2').is(':focus')) {
        updatePlayerID();
        console.log('%c  Loading crown...  ', 'background: #262626 ; color: #ffd700; font-size:14px; font-family: "Segoe UI"');
        crown(true);
    }
});