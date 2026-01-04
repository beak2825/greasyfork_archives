// ==UserScript==
// @name         Spam Room Creation
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Spam new rooms with whatever name you want.
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424556/Spam%20Room%20Creation.user.js
// @updateURL https://update.greasyfork.org/scripts/424556/Spam%20Room%20Creation.meta.js
// ==/UserScript==


var spamstuff = document.createElement("div");
document.body.appendChild(spamstuff);
spamstuff.style.position = "fixed";
spamstuff.style.top = 240;
spamstuff.style.left = 10;

var spamstuff2 = document.createElement("div");
document.getElementById('roomlistcreatewindow').appendChild(spamstuff2);
spamstuff2.style.position = "relative";
spamstuff2.style.top = "75%";
spamstuff2.style.left = "75%";


var spamroom = document.createElement("button");
spamroom.innerHTML = "Spam Rooms";
spamroom.id = 'spamroom';

var spamroom2 = document.createElement("button");
spamroom2.innerHTML = "SPAM";
spamroom2.id = 'spamroomtwo';
spamroom2.classList.add("brownButton");
spamroom2.classList.add("brownButton_classic");

var spamprep = document.getElementById('classic_mid_customgame');
spamprep.onclick = function(){
document.getElementById('roomlistcreatebutton').click();
document.getElementById('roomlist_create_close').click();
};

spamroom.onclick = function(){
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
};

spamroom2.onclick = function(){
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
document.getElementById('roomlistcreatecreatebutton').click();
};

//var roomnamebar = document.getElementById('roomlistcreatewindowgamename');
//roomnamebar.style.position = "relative";
//roomnamebar.style.top = 25;
//roomnamebar.style.left = -97;
//roomnamebar.style.width = 120;
//roomnamebar.placeholder = "Room Name";

spamstuff.appendChild(spamroom);
spamstuff2.appendChild(spamroom2);

//roomlistcreatebottombutton brownButton brownButton_classic buttonShadow