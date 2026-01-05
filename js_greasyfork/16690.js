// ==UserScript==
// @name         Ghost trapper Auto Companion Lover
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Help you send gift to companion you loved.Make sure to install ghost trapper companion companion, disabled it or companion script to stop sending. Gift send automatically to and companion that can receives gift!!
// @author       Knight of K9
// @grant        none
// @include      http://www.ghost-trappers.com/fb/*
// @downloadURL https://update.greasyfork.org/scripts/16690/Ghost%20trapper%20Auto%20Companion%20Lover.user.js
// @updateURL https://update.greasyfork.org/scripts/16690/Ghost%20trapper%20Auto%20Companion%20Lover.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
if(localStorage.getItem('isSendGiftAllowed')==null){
    //Init isSendGiftAllowed if haven't created
    localStorage.setItem('isSendGiftAllowed',true)
    console.log("init isSendGiftAllowed");
}
var count  = 0;
if(localStorage.isSendGiftAllowed=="true"){
    console.log(count++);
    sendGift();
}

//Button for enable/disable auto send gift
var button = document.createElement("button");
button.setAttribute("id","giftButton");
var text;
if(!(localStorage.isSendGiftAllowed=="true")){
    text = document.createTextNode("Enable auto send gift");
}
else{
    text = document.createTextNode("Disable auto send gift");
}
button.appendChild(text);
button.onclick = changeAutoGiftAllowed;
document.body.appendChild(button);

function changeAutoGiftAllowed(){
    if(localStorage.isSendGiftAllowed=="true"){
        alert("Auto send gift disabled!");
        button.textContent=("Enable auto send gift");
    }
    else{
        alert("Auto send gift enabled!");
        button.textContent=("Disable auto send gift");
    }
    localStorage.isSendGiftAllowed=(localStorage.isSendGiftAllowed=="true"?false:true);

    console.log(localStorage.isSendGiftAllowed);
}

function sendGift(){
    var checkButton = document.getElementsByName("present_id")[0];
    var gift = document.getElementsByClassName("smallPresentText")[0];
    if(gift != null)
    {
        var giftName = gift.textContent;
        var sendButton = document.getElementsByName("confirm")[1];
        console.log("Are u sure u want to send "+ giftName +" with value = "+checkButton.value);
        if (giftName.indexOf("(")>=0 && giftName.indexOf(")")>=0) {
            if(giftName.indexOf("(?)")>=0){
                alert("No gift information found!!");
            }
            else{
                checkButton.checked = true;
                sendButton.click();
            }
        }
        else {
            alert("No companion script found!Have you installed ghost trapper companion companion?");
        }
    }
    else{
        console.log("Your companion can not receive gift !!")
    }
}
