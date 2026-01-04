// ==UserScript==
// @name         OWOT Toolbox
// @namespace    http://tampermonkey.net/
// @version      2025-08-10
// @description  Useful tools for OWOT.
// @author       DefunctUser
// @match        https://ourworldoftext.com/*
// @match        https://*.ourworldoftext.com/*
// @match        http://ourworldoftext.com/*
// @match        http://*.ourworldoftext.com/*
// @icon         https://ourworldoftext.com/static/favicon.png
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/512055/OWOT%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/512055/OWOT%20Toolbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

var version = "1.3.7";
// Toolbox title
menu.addEntry("<h2 style='background: linear-gradient(180deg, red,orange);-webkit-text-fill-color: transparent;-webkit-background-clip: text;background-clip: text;' id='tb-title'>OWOT<br>TOOLBOX</h2><h4>Version " + version + "</h4>")
// Colors & rate-limit detection
menu.addEntry( `${state.worldModel.color_text <= 0 ? "<div style='float: left; margin-left: 5px; margin-top: 6px; display: inline-block; border: 1px solid grey; background-color: #99ff66; width: 16px; height: 16px;'></div><span>Colors allowed</span>'" : "<div style='float: left; margin-left: 5px; margin-top: 6px; display: inline-block; border: 1px solid grey; background-color: #ff5050; width: 16px; height: 16px;''></div><span>Colors disallowed</span>"}`);
    /*
    if(state.worldModel.color_text>0){alert("WARNING\n========================\nColors are disabled on this world")}
/*    // Chars per second detection
    if(state.worldModel.char_rate[1]<513){
        if(state.worldModel.char_rate[1]<100){
        alert("WARNING\n========================\nThis world has a very low characters per second value.\nThis heavily affects all scripts.")
        } else {
        alert("!!!WARNING!!!\n========================\nThis world has a low characters per second value.\nThis affects all scripts.")
        }
    }
/*
    if(state.worldModel.char_rate[1]>2000){
        alert("WARNING\n========================\nThis world has a high rate-limit ("+ state.worldModel.char_rate[0].toString() + " chars per " + state.worldModel.char_rate[1].toString() + "ms" + "). \nScripts will be slow.")
    }
*/
// Automatic paste permission bypass.
if(state.worldModel.feature_paste>0){
(function(){Permissions.can_paste = function() {return true;};})();
console.log("No pasting detected - Bypassed");
}
menu.addEntry(`<span>Rate limit: <b>${state.worldModel.char_rate[0].toString()} chars per ${state.worldModel.char_rate[1].toString()} ms</b></span>`);
/* Instant Write (previously InstaPaste) v1.1
Supports linebreaks.
*/
function instapaste(str,col,loc) {
    var scriptloc = loc;
    var originalloc = loc;
    for(let i=0;i<str.length;i++){
        var char = str.charAt(i)
        var charsintostring = "-" + i+1
        if(char !== "°") {
        writeCharTo(char,0x000000,...scriptloc);
        scriptloc = coordinateAdd(...scriptloc,0,0,1,0);
        } else {
        originalloc = coordinateAdd(...originalloc,0,0,0,1)
        scriptloc = originalloc;
        }
    }
}
function aa(){
    var kk=prompt("what text to write?\nUse ° for linebreaks :)");
    instapaste(kk,0x000000,cursorCoords);
}
menu.addOption("Instant Write",aa)

// Fill Script
var fillselection = new RegionSelection();
fillselection.color = 'rgba(255,0,0,0.1)';
fillselection.charColor = '#FF4848';
var fillchar = " ";
var fillcolor = 0x000000;
var fillbcolor = null;
var fillbold = false;
var fillunder = false;
var fillstrike = false;
var fillitalic = false;
var fillbcolorenabled = false;
var filltargetenabled = false;
var filltarget = 0x000000;
// Fill settings modal
// i = input
var modalColorUnchanged = true;
var fillmodal = new Modal();
fillmodal.createForm();
fillmodal.setFormTitle("Fill settings");
// input values are accessed by [variable].input.value
var ifillchar = fillmodal.addEntry("Fill char (leave empty to use it as a wiper)","text");
var ifillcolor = fillmodal.addEntry("Color","color");
var ifillbcolor = fillmodal.addEntry("Background color (if enabled below)","color");
var ifilltarget = fillmodal.addEntry("Fill target (if enabled below)","color");
fillmodal.createCheckboxField();
// checkbox values are accessed by [variable].elm.firstChild.checked
var ifillbold = fillmodal.addCheckbox("Bold text");
var ifillitalic = fillmodal.addCheckbox("Italic text");
var ifillunder = fillmodal.addCheckbox("Underline text");
var ifillstrike = fillmodal.addCheckbox("Strikethrough text");
var ifillbcolorenabled = fillmodal.addCheckbox("Enable background color");
var ifilltargetenabled = fillmodal.addCheckbox("Enable fill target. If enabled, you can set the fill target to a color and only the chars with that color will get filled. Useful for erasing spam while keeping everything else intact.");

fillmodal.onOpen(function(){
if(modalColorUnchanged) {
    ifillcolor.input.value = "000000";
}
});
fillmodal.onSubmit(function(){
    if(ifillcolor.input.value !== "000000"){
         modalColorUnchanged = false;
    }
	fillchar = ifillchar.input.value.charAt(0); // only the first char will be saved
        if(fillchar == ""){
        fillchar = " ";
        };
    filltargetenabled = ifilltargetenabled.elm.firstChild.checked;

	if(filltargetenabled == true){
		filltarget = parseInt(ifilltarget.input.value,16);
	};
	// 0x must be added so it is treated as a hex value because for some fucking reason the value from the input doesn't have that at the start
	if(ifillbcolorenabled.elm.firstChild.checked == true){
		fillbcolor = "0x" + ifillbcolor.input.value;
    } else {
        fillbcolor = null;
    };
	fillcolor = "0x" + ifillcolor.input.value;
	fillbold = ifillbold.elm.firstChild.checked;
	fillunder = ifillunder.elm.firstChild.checked;
 	fillstrike = ifillstrike.elm.firstChild.checked;
	fillitalic = ifillitalic.elm.firstChild.checked;
});
// Main fill function
fillselection.tiled = false;
fillselection.onselection(function(coordA, coordB, regWidth, regHeight) {
    var charCoord = coordA;
		for(let yy = 0; yy < regHeight; yy++) {
			for(let xx = 0; xx < regWidth; xx++) {
            var charCol = getCharInfo(...charCoord).color;
            if(filltargetenabled == true){ // Target mode
            if(charCol == parseInt(filltarget,10)){
			writeCharTo(fillchar,fillcolor,...charCoord,true,true,fillbcolor,fillbold,fillitalic,fillunder,fillstrike);
            }
            } else if(fillchar == " " && fillbcolor === null) { // Wiping
                var charSymbol = getCharInfo(...charCoord).char
                var charBcol = getCharInfo(...charCoord).bgColor
                if(charSymbol !== " " || charBcol !== -1) { // Ignore empty chars to optimize wiping
                    writeCharTo(fillchar,fillcolor,...charCoord,true,true,fillbcolor,fillbold,fillitalic,fillunder,fillstrike);
                }
            } else { // Filling
            writeCharTo(fillchar,fillcolor,...charCoord,true,true,fillbcolor,fillbold,fillitalic,fillunder,fillstrike);
            }
			charCoord = coordinateAdd(...charCoord,0,0,1,0);
		}
		charCoord = coordinateAdd(...charCoord,0,0,-regWidth,1);
	}
});
w.on("keyDown", function(e) {
	if(checkKeyPress(e, "ALT+F")) {
		fillselection.startSelection();
	}
});
// Menu buttons
menu.addOption("Fill Area\n(ALT+F)",function(){fillselection.startSelection();});
menu.addCheckboxOption("Fill Tiles",function(){fillselection.tiled = true;},function(){fillselection.tiled = false;},false);
menu.addOption("Fill Settings",function(){fillmodal.open();});

// Stickman Script
// Variable setup
var col = 0x000000;
var col_h = col;
var col_la = col;
var col_ra = col;
var col_ll = col;
var col_rl = col;
var col_body = col;
var loc = [];
// Modals setup
// Limb colors modal
const colormodal2 = new Modal()
colormodal2.createForm()
colormodal2.setFormTitle("Stickman limb colors")
var head = colormodal2.addEntry("Head color","color");
var leftarm = colormodal2.addEntry("Left arm color","color");
var rightarm = colormodal2.addEntry("Right arm color","color");
var body = colormodal2.addEntry("Body color","color");
var leftleg = colormodal2.addEntry("Left leg color","color");
var rightleg = colormodal2.addEntry("Right leg color","color");
colormodal2.onSubmit(function setColors() {
col_h = parseInt(head.input.value,16);
col_la = parseInt(leftarm.input.value,16)
col_ra = parseInt(rightarm.input.value,16)
col_ll = parseInt(leftleg.input.value,16)
col_rl = parseInt(rightleg.input.value,16)
col_body = parseInt(body.input.value,16)
});
// Single color modal
const colormodal = new Modal();
colormodal.createForm();
var stickcolor = colormodal.addEntry("Stickman color","color");
colormodal.setFormTitle("Stickman color. This will override any previously set limb colors.");
colormodal.onSubmit(function setStickCol() {
col = parseInt(stickcolor.input.value,16);
col_h = col;
col_la = col;
col_ra = col;
col_ll = col;
col_rl = col;
col_body = col;
});
col_h = col;
col_la = col;
col_ra = col;
col_ll = col;
col_rl = col;
col_body = col;
// Stickman paster function
function stickman(){
loc = cursorCoords;
writeCharTo("O",col_h,...loc)// Head
loc = coordinateAdd(...loc,0,0,-1,1)
writeCharTo("/",col_la,...loc)// Left arm
loc = coordinateAdd(...loc,0,0,1,0)
writeCharTo("|",col_body,...loc)// Body
loc = coordinateAdd(...loc,0,0,1,0)
writeCharTo('\\',col_ra,...loc)//Right arm
loc = coordinateAdd(...loc,0,0,-2,1)
writeCharTo("/",col_ll,...loc)//Left leg
loc = coordinateAdd(...loc,0,0,2,0)
writeCharTo('\\',col_rl,...loc)//Right leg
}
// Menu options to access the modals
menu.addOption("Add Stickman",()=>{stickman()});
menu.addOption("Set Stickman Color",()=>{
    colormodal.open()
});
menu.addOption("Set Limb Colors",()=>{
    colormodal2.open()
});

w.doAnnounce("OWOT Toolbox Loaded - v" + version + " - Enjoy :)");
})();