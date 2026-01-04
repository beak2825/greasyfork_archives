// ==UserScript==
// @name         Create Full Room
// @namespace    createfullroomforbonk.io
// @version      2
// @description  Room of 8 players in 1 click.
// @author       Helloim0_0, (Bonk Commands)
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455365/Create%20Full%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/455365/Create%20Full%20Room.meta.js
// ==/UserScript==

if(document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_fullroombutton") == null){
    document.getElementById("maingameframe").contentDocument.getElementById("roomlistrefreshbutton").click();
    var fullroombutton = document.getElementById("maingameframe").contentDocument.createElement("div");
    fullroombutton.id = "classic_mid_fullroombutton";
    fullroombutton.classList.value = "brownButton brownButton_classic classic_mid_buttons";
    fullroombutton.textContent = `Create Full Room`;
    fullroombutton.onclick = function(){
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatewindowgamename").value = document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_nameofroom").value;
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatewindowmaxplayers").value = 8;
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatecreatebutton").click();
        document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_customgame").click();
    };
    document.getElementById("maingameframe").contentDocument.getElementById("classic_mid").insertBefore(fullroombutton,document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_customgame"))
}

if(document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_nameofroom") == null){
    document.getElementById("maingameframe").contentDocument.getElementById("roomlistrefreshbutton").click();
    var nameofroom = document.getElementById("maingameframe").contentDocument.createElement("input");
    nameofroom.id = "classic_mid_nameofroom";
    nameofroom.ondblclick = function dblclick(data){
        if(data.altKey){
            nameofroom.value = document.getElementById("maingameframe").contentDocument.getElementById('pretty_top_name').innerHTML + "'s game"
        }
    }
    document.getElementById("maingameframe").contentDocument.getElementById("classic_mid").insertBefore(nameofroom,document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_customgame"))
}