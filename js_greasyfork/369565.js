// ==UserScript==
// @name         10 fast fingers in ur ass
// @version      0.1
// @description  be 1337
// @author       Zeper
// @require https://code.jquery.com/jquery-2.1.1.min.js
// @match        https://10fastfingers.com/typing-test/*
// @match        https://10fastfingers.com/advanced-typing-test/*
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/369565/10%20fast%20fingers%20in%20ur%20ass.user.js
// @updateURL https://update.greasyfork.org/scripts/369565/10%20fast%20fingers%20in%20ur%20ass.meta.js
// ==/UserScript==

var input = document.getElementsByClassName("form-control")["0"];
var btnreload = document.getElementById("reload-btn");
var mots = 0;
var Keystrokes = 0;
var WPM = 0;
var text;
var inputnospace;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    text = document.getElementsByClassName("highlight")["0"];
    inputnospace = input.value.replace(/ /g,'');
    if(inputnospace != text.innerHTML){
        input.value = text.innerHTML;
        mots = mots+1;
        Keystrokes = Keystrokes + (input.value.length+1);
        WPM = Math.round((((Keystrokes)-(input.value.length+1))/5));
        btnreload.innerHTML = "WPM: " +WPM;
        console.clear();
        console.log("Correct words: "+ (mots-1));
        console.log("Keystrokes: "+(Keystrokes-(input.value.length+1)));
        console.log("WPM: "+ (((Keystrokes)-(input.value.length+1))/5));
    }
    await sleep(20);
    demo();
}

input.onclick = function() {
   input.setAttribute("type", "submit");
   demo();
};

btnreload.onclick = function() {
   mots = 0;
   Keystrokes = 0;
   WPM = 0;
};