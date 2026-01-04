// ==UserScript==
// @name Settings
// @description Adds live example button, with styling.
// @match *://gleam.io/*
// @grant GM_addStyle
// @version 1.0.10
// @namespace https://greasyfork.org/users/851257
// @downloadURL https://update.greasyfork.org/scripts/436852/Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/436852/Settings.meta.js
// ==/UserScript==
let BSC = "VOID";
let Telegram = "VOID";
let Twitter = "VOID";
let Discord = "VOID";
let Wax = "VOID";
let Sollana = "VOID";



//////////////////////////ETH(BSC)(POLYGON)///////////////////////////////////////////

var zNode = document.createElement ('div');
zNode.innerHTML = '<span id="BSC" type="button">'+BSC+'</span>';
document.getElementsByClassName("incentive-description")[0].appendChild (zNode);

document.getElementById ("BSC").addEventListener (
"click", BSCClickAction, false
);

function BSCClickAction (zEvent) {
let test = document.querySelector('#BSC');
copyToClipboard(test.innerHTML);
}



zNode = document.createElement ('div');
zNode.innerHTML = '<span id="Discord" type="button">'+ Discord +'</span>';

document.getElementsByClassName("incentive-description")[0].appendChild (zNode);

document.getElementById ("Discord").addEventListener (
"click", DiscordClickAction, false
);

function DiscordClickAction (zEvent) {
let test = document.querySelector('#Discord');
copyToClipboard(test.innerHTML);
}

//////////////////////////Wax///////////////////////////////////////////

zNode = document.createElement ('div');
zNode.innerHTML = '<span id="Wax" type="button">'+ Wax +'</span>';

document.getElementsByClassName("incentive-description")[0].appendChild (zNode);

document.getElementById ("Wax").addEventListener (
"click", WaxClickAction, false
);

function WaxClickAction (zEvent) {
let test = document.querySelector('#Wax');
copyToClipboard(test.innerHTML);
}

//////////////////////////Sollana///////////////////////////////////////////

zNode = document.createElement ('div');
zNode.innerHTML = '<span id="Sollana" type="button">'+ Sollana +'</span>';

document.getElementsByClassName("incentive-description")[0].appendChild (zNode);

document.getElementById ("Sollana").addEventListener (
"click", SollanaClickAction, false
);

function SollanaClickAction (zEvent) {
let test = document.querySelector('#Sollana');
copyToClipboard(test.innerHTML);
}

/////////////////////////////////////////////////////////////////////////////


GM_addStyle ( `
#Twitter {
color: white;
position: absolute;
right: 540px;
bottom: 90px;
font-size: 10px;
background: #457298;
border: 3px outset black;
margin: 5px;
padding: 5px 20px;
}
#Twitter {
cursor: pointer;
}
#Telegram {
color: white;
position: absolute;
right: 540px;
bottom: 120px;
font-size: 10px;
background: #457298;
border: 3px outset black;
margin: 5px;
padding: 5px 20px;
}
#Telegram {
cursor: pointer;
}
#BSC {
color: white;
position: absolute;
right: 540px;
bottom: 150px;
font-size: 10px;
background: #457298;
border: 3px outset black;
margin: 5px;
padding: 5px 20px;
}
#BSC {
cursor: pointer;
}


#Discord {
color: white;
position: absolute;
right: 540px;
bottom: 60px;
font-size: 10px;
background: #457298;
border: 3px outset black;
margin: 5px;
padding: 5px 20px;
}
#Discord {
cursor: pointer;
}

#Wax {
color: white;
position: absolute;
right: 540px;
bottom: 30px;
font-size: 10px;
background: #457298;
border: 3px outset black;
margin: 5px;
padding: 5px 20px;
}
#Wax {
cursor: pointer;
}

#Sollana {
color: white;
position: absolute;
right: 540px;
bottom: 0px;
font-size: 10px;
background: #457298;
border: 3px outset black;
margin: 5px;
padding: 5px 20px;
}
#Sollana {
cursor: pointer;
}
` );





function copyToClipboard(str) {
var area = document.createElement('textarea');
document.body.appendChild(area);
area.value = str;
area.select();
document.execCommand("copy");
document.body.removeChild(area);
}