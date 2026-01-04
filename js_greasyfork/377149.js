// ==UserScript==
// @name         Zimek's alis.io macro
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Triple-split, x64 and pop-split macro, click save to save settings
// @author       Zimek
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377149/Zimek%27s%20alisio%20macro.user.js
// @updateURL https://update.greasyfork.org/scripts/377149/Zimek%27s%20alisio%20macro.meta.js
// ==/UserScript==

//html for settings
$(`<div id="macrosMenu" style="background:#212121;border-radius:2px;display:none;height:300px;padding:0;position:absolute;width:350px;z-index:1">
Zimek's macro
<div style="padding: 10px;">
<span>Popsplit macro time: </span>
<input type="text" class="save" id="macrotime" maxlength="3" style="margin-top: 5px;width: 33px;font-size: 17px;height: 21px;" placeholder="185" value="185">ms<br>
<span>Popsplit macro keybind: </span>
<input type="key" class="save" style="width: 30px;margin-top: 5px;height: 30px;font-size: 25px;" id="macrokeybind" maxlength="1" placeholder="r" onkeyup="this.value = this.value.toLowerCase();"><br>
<span>Triple-split macro keybind: </span>
<input type="key" class="save" style="width: 30px;margin-top: 5px;height: 30px;font-size: 25px;" id="triplemacro" maxlength="1" placeholder="f" onkeyup="this.value = this.value.toLowerCase();"><br>
<span>x64 macro keybind: </span>
<input type="key" class="save" style="width: 30px;margin-top: 5px;height: 30px;font-size: 25px;" id="maxsplit" maxlength="1" placeholder="b" onkeyup="this.value = this.value.toLowerCase();"><br><br>
<center><button id="saveMacros" style="width: 100px;height: 30px;font-size: 20px;">Save</button></center></div></div>`).insertAfter("#profilec");
var TripleMacro = document.getElementById("triplemacro"); //triple macro keybind
var POPmacroTime = document.getElementById('macrotime'); //pop macro time (ms)
var POPmacroKeybind = document.getElementById('macrokeybind'); //pop macro keybind
var MaxSplit = document.getElementById('maxsplit'); //x64 macro keybind
var save = document.getElementById('saveMacros'); //save settings
var speed = 45; //speed to work triplesplit (DONT CHANGE)

//Pop macro time is added only for testing, its doesnt save.

const StateTripleMacro = localStorage.getItem('TripleMacro'); //localStorage to save your triple macro keybind
TripleMacro.value = StateTripleMacro;
$("input#triplemacro").val(`${StateTripleMacro}`);

const StatePOPkeybind = localStorage.getItem('POPmacroKeybind'); //localStorage to save your pop macro keybind
POPmacroKeybind.value = StatePOPkeybind;
$("input#macrokeybind").val(`${StatePOPkeybind}`);

const StateMaxSplit = localStorage.getItem('MaxSplit'); //localStorage to save your x64 macro keybind
MaxSplit.value = StateMaxSplit;
$("input#maxsplit").val(`${StateMaxSplit}`);

save.onclick = function () { //save your settings function
    localStorage.setItem("TripleMacro", TripleMacro.value);
    localStorage.setItem("POPmacroKeybind", POPmacroKeybind.value);
    localStorage.setItem("MaxSplit", MaxSplit.value);
};

window.addEventListener('keydown', keydown); //macros
function keydown(event) {
    if (event.key == POPmacroKeybind.value) { //popsplit macro
        split();
        setTimeout(split, POPmacroTime.value);
    }if (event.key == TripleMacro.value) { //triplesplit macro
        split()
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*2);
    }
    if (event.key == MaxSplit.value) { //x64 macro
        split()
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
        setTimeout(split, speed*4);
        setTimeout(split, speed*5);
        setTimeout(split, speed*5);
    }
};

$(document).ready(function(){ //buttons functions show/hide
    $("#macrosMenuShow").click(function(){
        $("div#macrosMenu").toggle();
    });$("#saveMacros").click(function(){
        $("div#macrosMenu").hide();
    });});

function split() { //split function
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
};

//another button to open macros panel
$(`
<li id="macrosMenuShow">
        <a id="macrosMenuShow">
          <p style="width: 250px;">Zimek's macro</p>
          <img id="macrosMenuShow" width="25px" style="margin-left: 1px;" src="https://i.imgur.com/7dF7Ec8.png">
        </a>
      </li>
`).insertAfter("#openrankingli");
