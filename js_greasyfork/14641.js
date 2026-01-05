// ==UserScript==
// @name Universal Radio Submit
// @author DCI
// @description radio hotkeys and onclick submit
// @version 1.0
// @namespace redpandanetwork.org
// @include https://www.mturkcontent.com/*
// @include https://s3.amazonaws.com/*

// @downloadURL https://update.greasyfork.org/scripts/14641/Universal%20Radio%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/14641/Universal%20Radio%20Submit.meta.js
// ==/UserScript==

var radio = document.querySelectorAll("input[type='radio']");

for ( f=0; f < radio.length; f++){
    radio[f].onclick = submit;
};

function submit(){
    document.getElementById('submitButton').click();
};

document.addEventListener( "keydown", keys, false);

function keys(i) {
    if (i.keyCode == 112) { //F1 
         i.preventDefault();
         document.querySelectorAll("input[type='radio']")[0].click();
         document.getElementById('submitButton').click();
    }
    if (i.keyCode == 113) { //F2
         i.preventDefault();
         document.querySelectorAll("input[type='radio']")[1].click();
         document.getElementById('submitButton').click();
    }
    if (i.keyCode == 114) { //F3
         i.preventDefault();
         document.querySelectorAll("input[type='radio']")[2].click();
         document.getElementById('submitButton').click();
    }
    if (i.keyCode == 115) { //F4
         i.preventDefault();
         document.querySelectorAll("input[type='radio']")[3].click();
         document.getElementById('submitButton').click();
    }
    if (i.keyCode == 116) { //F5
         i.preventDefault();
         document.querySelectorAll("input[type='radio']")[4].click();
         document.getElementById('submitButton').click();
    }
};
