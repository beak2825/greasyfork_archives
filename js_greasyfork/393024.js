// ==UserScript==
// @name         KrityHack(NEW)
// @namespace    SURVIV.io
// @version      0.1
// @description  This hack created by Dimazik123
// @author       Dimazik123
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://surviv.io/*
// @downloadURL https://update.greasyfork.org/scripts/393024/KrityHack%28NEW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393024/KrityHack%28NEW%29.meta.js
// ==/UserScript==


$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');

let aszdasdaw3123123asdas = document.getElementById("surviv-io_300x250");
let element = document.createElement("div");
let adblock_left = document.getElementById("ad-block-left");
let ui_center = document.getElementById("ui-center");
let HackMenu = document.createElement("div");
let a35345424345123213 = true;
let ui_top_left = document.getElementById("ui-top-left");

aszdasdaw3123123asdas.remove();
element.style = "padding-left:5px;padding-right:5px;";
element.innerHTML = `
<p style="text-align:center;font-size:23px;font-weight: 900;background: linear-gradient(to right,#ff8a00,#da1b60);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">KrityHack v0.1</p>
<p style="color:yellow;text-align:center;font-weight: 900;">How use this hack?</p>
<p><span style="color:red;font-size:18px;">1. </span>Text text text</p>
<p><span style="color:red;font-size:18px;">2. </span>Text text text</p>
<p><span style="color:red;font-size:18px;">3. </span>Text text text</p>
<p><span style="color:red;font-size:18px;">4. </span>Text text text</p>
<p style="background: linear-gradient(to right,#ff8a00,#da1b60);-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight:700;font-size:18px;text-align:center;">Created by KrityTeam</p>


`;

adblock_left.appendChild(element);
adblock_left.style = "overflow:auto;";


HackMenu.style = "height:410px;width:280px;background-color: rgba(0, 0, 0, 0.5);border-radius:5px;border:rgba(0,0,0,.4) solid 2px;cursor: default;display:none;";
HackMenu.innerHTML = `
<p style="text-align:center;font-size:23px;font-weight: 900;background: linear-gradient(to right,#ff8a00,#da1b60);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">KrityHack v0.1</p>
<div class="function" id="Aimbot"> Aimbot</div> <br>
<div class="function" id="Spinbot"> SpinBot</div> <br>
<div class="function" id="WallHack"> WallHack</div> <br>
<div class="function" id="Tracer"> Tracer</div> <br>
<div class="function" id="ESP"> ESP</div> <br>
<div class="function" id="Emotion"> RandomEmotion</div> <br>
<p style="background: linear-gradient(to right,#ff8a00,#da1b60);-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight:700;font-size:18px;text-align:center;">Created by KrityTeam</p>
`;
ui_center.appendChild(HackMenu);


let ui_game = document.getElementById("ui-game");
let hi_menu = document.createElement("div");
hi_menu.style = "margin:15px;background-color:rgba(0, 0, 0, 0.5);border-radius:5px;border:2pxsolidrgba(0, 0, 0, 0.1);z-index: 30;height:70px;width:225px;display:none;";

hi_menu.innerHTML = `
<img src="https://upload.wikimedia.org/wikipedia/commons/archive/2/21/20070210155813%21Info_Sign.svg" style="margin-left:10px;margin-top:15px;"/>
<span style="margin-left:20px;color:red;font-weight:700;position: relative;top:-26px;font-size:18px;">Welcome to the</span><br>
<span style="top:-24px;right:-85px;position: relative;color:#6AD9E2;">KrityHack v0.1</span>
`
;

ui_game.appendChild(hi_menu);


jQuery('document').ready(function() {
document.getElementById("Aimbot").onclick = function(){
if (this.style.color == ""){
this.style = "color:#FFFF00;border-left:2px solid red;";
}
else{
this.style = "";
}


};
document.getElementById("Spinbot").onclick = function(){
if (this.style.color == ""){
this.style = "color:#FFFF00;border-left:2px solid red;";
}
else{
this.style = "";
}
};
document.getElementById("WallHack").onclick = function(){
if (this.style.color == ""){
this.style = "color:#FFFF00;border-left:2px solid red;";
}
else{
this.style = "";
}
};
document.getElementById("Tracer").onclick = function(){
if (this.style.color == ""){
this.style = "color:#FFFF00;border-left:2px solid red;";
}
else{
this.style = "";
}
};
document.getElementById("ESP").onclick = function(){
if (this.style.color == ""){
this.style = "color:#FFFF00;border-left:2px solid red;";

}
else{
this.style = "";
}
};
document.getElementById("Emotion").onclick = function(){
if (this.style.color == ""){
this.style = "color:#FFFF00;border-left:2px solid red;";
}
else{
this.style = "";
}
};

document.onkeydown = function(event){
if (event.code === "Tab" && document.getElementById("ui-stats").style.display == "none"){
    if (a35345424345123213) {
      document.getElementById("ui-team").style.display = "none";
      $(hi_menu).fadeIn(1000);
      setTimeout(function() {
        $(hi_menu).fadeOut(500);
      }, 5000);
      setTimeout(function() {
        $(HackMenu).fadeIn(1000);
      }, 500);
      setTimeout(function() {
        $("#ui-team").fadeIn(400);
      }, 5500);
      a35345424345123213 = false;
}
else if(HackMenu.style.display == "none"){
$(HackMenu).fadeIn(50);
}
else{
$(HackMenu).fadeOut(200);
}





} // End Tab


} // End onkeydown


});



GM_addStyle(`
.function{
color: rgba(255,255,255,.8);
margin-top:3px;
padding-left:6px;
border-left:2px solid transparent;
font-size:18px;
font-weight:700;
}

.function:hover{
border-left-color:#D40000;
cursor:pointer;
color:#FFFF50;
}

`);