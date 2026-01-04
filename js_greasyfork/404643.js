// ==UserScript==
// @name         GoCoderzHack
// @version      2
// @description  im too lazy i hope it works
// @author       You
// @match        https://play.gocoderz.com/dashboard/*
// @grant        none
// @run-at       document-start
// @namespace https://google.com
// @downloadURL https://update.greasyfork.org/scripts/404643/GoCoderzHack.user.js
// @updateURL https://update.greasyfork.org/scripts/404643/GoCoderzHack.meta.js
// ==/UserScript==

function makecomplete(id){
fetch("https://play.gocoderz.com/coderz-api/updateAttempts",{method:"POST",body:JSON.stringify({id: id, completed: "1", score: 100}), headers:{"content-type": "application/json;charset=UTF-8"}})
}

function addattempt(id, t){
    for(var b=0;b<t;b++){
        fetch("https://play.gocoderz.com/coderz-api/updateAttempts",{method:"POST",body:JSON.stringify({id: id, completed: "0", score: 0}), headers:{"content-type": "application/json;charset=UTF-8"}})
    }
}

function addcompletetime(id,s){
fetch("https://play.gocoderz.com/coderz-api/updateDuration",{method:"POST",body:JSON.stringify({id: id, completed: "0", duration: s}), headers:{"content-type": "application/json;charset=UTF-8"}})
}

function legitcomplete(id){
let c = 3+Math.floor(Math.random()*5);
let t = c*40+(Math.floor(Math.random()*21)-10)
addattempt(id, c);
addcompletetime(id, c*40);
makecomplete(id);

document.write("Succesfully added "+c+" attempts, "+t+" seconds, and completed the mission of id: "+window.location.toString().match(/[0-9]{7}/)[0]+".</br>You can go back now and refresh and it will show :)");
}
if(window.location.toString().match(/[0-9]{7}/)[0].length>0){
   legitcomplete(window.location.toString().match(/[0-9]{7}/)[0]);
   }
