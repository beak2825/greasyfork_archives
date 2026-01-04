// ==UserScript==
// @name         MooMoo introductory Antihacks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Random Output Generator(translated from Java)
// @author       You
// @match        ://*/*moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420783/MooMoo%20introductory%20Antihacks.user.js
// @updateURL https://update.greasyfork.org/scripts/420783/MooMoo%20introductory%20Antihacks.meta.js
// ==/UserScript==
let $= function(e){
    return document.querySelector(e)
}
 function getOutput(){
        var output = "hackersRBabies".split("");
        var string = "";
        var rand=Math.random<.5;
        var i=0;
        var returnString="";
        for(i=0; i < output.length; i++) {{
            output[i] = (rand.nextBoolean() && rand.nextBoolean()) ? "-" : output[i];
        }}
        for(let index2591=0; index2591 < output.length; index2591++) {{
            let elements = output[index2591];
            returnString += elements
        }}
        return returnString
        }
document.query=$
document.querySelector("mainMenu").append(getOutput());
document.addEventListener("keydown",function(e){
   switch(e.keyCode()){
          case 81:
            console.log(getOutput())
            break;
     }
    switch(e.which){
        case 'e':
            console.log("E pressed")
            break;
        case 'neverUsed':
            var socket=document.querySelector("mainMenu");
            socket.remove();
            break;
        default:
            console.log("Default Running")
            break;
    }
})