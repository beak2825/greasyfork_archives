// ==UserScript==
// @name         shop in sam api
// @namespace    about blanki
// @version      1.2
// @description  this is written to help get data from samsung foods
// @author       You
// @match        https://app.samsungfood.com/print-shopping-list/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535087/shop%20in%20sam%20api.user.js
// @updateURL https://update.greasyfork.org/scripts/535087/shop%20in%20sam%20api.meta.js
// ==/UserScript==
var buttons;
var button1;

function sendToGoogleSheets(){
   let script= window.open("https://script.google.com/macros/s/AKfycbyGhgzMq86BXD0C7NIoe-CPQinES5Q5FMdN8v8bP64MM3fLg0jz4p4MQWpt7qR6xq8GJA/exec?samfoodlist="+getList(),'_self')
     setTimeout(function() {
    script.close();
}, 10000);
}

function onbuttonclicked() {
    sendToGoogleSheets();
    button1.disabled = true;
       button1.style.backgroundColor = "gray";
    setTimeout(function() {
   button1.style.backgroundColor = "";
       button1.disabled = false;
}, 10000);
}

function getcolumlistClassNamebyStyle(){
 const divs =document.getElementsByTagName("div");
 for (let i = 0; i <= divs.length; i++) {
    if(divs[i].getAttribute("style")!= -1 && divs[i].style.position =="absolute"){
        return document.getElementsByClassName(divs[i].className)[0].children[0].children[1].classList
    }
  }
}
function getList() {
    var record= [];
const testElements = document.getElementsByClassName(getcolumlistClassNamebyStyle());
for (let div of testElements) {
  var item= div.children[1].children[0].textContent
  if(item!=""){
   record.push(item)
  }
}
    return record
}

function createButton(){
 buttons = document.getElementsByClassName(document.getElementsByTagName("button")[0].parentElement.className)[0];
 button1 = document.createElement("button");
 button1.className=document.getElementsByTagName("button")[0].classList;
button1.innerHTML="Send to Google Sheet";
 button1.onclick = onbuttonclicked;
 buttons.appendChild(button1);
}
(function() {
    'use strict';

setTimeout(function() {
  createButton();
}, 1000);
})();