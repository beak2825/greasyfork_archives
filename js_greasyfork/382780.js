// ==UserScript==
// @name         Add Server Button Adder For minecraftpocket-servers.com
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  A description.
// @author       Armağan#2448
// @match        https://minecraftpocket-servers.com/servers/*
// @match        https://minecraftpocket-servers.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382780/Add%20Server%20Button%20Adder%20For%20minecraftpocket-serverscom.user.js
// @updateURL https://update.greasyfork.org/scripts/382780/Add%20Server%20Button%20Adder%20For%20minecraftpocket-serverscom.meta.js
// ==/UserScript==

(function() {
    'use strict';

//Created By Armağan#2448;
//Add Server Button Adder For minecraftpocket-servers.com
var ipadresses = [];
Array.from(document.getElementsByClassName("btn btn-secondary btn-sm clipboard")).forEach((item, index, array)=>{
ipadresses.push(array[index].getAttribute("data-clipboard-text"));
})
console.log(ipadresses);
var htmlblocks = [];
Array.from(document.getElementsByTagName("td")).forEach((item, index, array)=>{
if (!item.getAttribute("class")){
htmlblocks.push(Array.from(Array.from(item.children)[1].children)[0]);
}
})
console.log(htmlblocks)
htmlblocks.forEach((item, index, array)=>{
var usefullip = "minecraft://?addExternalServer="+Math.random().toString(9).substring(2, 15)+"|"+ipadresses[index];
if (ipadresses[index]) {
item.innerHTML += `<div class="d-inline-block mt-2"><button type="button" role="button" class="btn btn-secondary btn-sm"><a href="`+usefullip+`" style="color: white; text-decoration: none;">Add Server</a></button></div>`
}
});
})();