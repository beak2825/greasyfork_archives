// ==UserScript==
// @name         Agar.io Train Line Controller
// @namespace    https://www.youtube.com/channel/UCMf28IHMkAhEGv6wnU34mvw
// @version      1.6.1
// @description  Script that allows you to make impossible lines and include custom configuration settings.
// @author       Copy
// @match        agar.io*
// @match        gota.io/web*
// @match        cellz.io*
// @match        agar.red*
// @match        vanis.io*
// @match        balz.io*
// @grant        GM_addStyle
// @icon         http://i65.tinypic.com/mmzo9e.jpg
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393206/Agario%20Train%20Line%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/393206/Agario%20Train%20Line%20Controller.meta.js
// ==/UserScript==
/*
MIT License

Copyright (c) [2019]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph)
shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

alert('Train Line Controller ACTIVE!! \nPress  "~"  to open the control panel \n\n("backquote" key may differ with other keyboards)\n\nVERSION : 1.6.1\n\nGood Luck :D');

//HTML Enabled.
$("body").append ( `
<div class="modal c" id="scrollbarr">
<div>
<span class="x">x</span>
<p class="title">TRAIN LINE CONTROLLER</p>
<button class="btns" onclick="openPage('Home')" id="firstPage">HOME</button>
<button class="btns" onclick="openPage('Theme')">THEME</button>
<button class="btns" onclick="openPage('Setup')">SETUP</button>
<button class="btns" onclick="openPage('About')">ABOUT</button>
<div id="Home" class="tabcont a c">
  <h1>Welcome To Train Line Script </h1>
  <h2 class="c-red c">What is Train Line Controller?</h2>
  <p> It is a script that allows you to split lines in all directions in similar games like agar io. </p>
  <h3 class="c-red c">How to use line</h3>
  <p>There are two options for this.</p>
  <p><b>Auto : </b>Press the key that you set on the setup page, then split.</p>
   <p><b>Manual : </b>Step 1. Freeze your cell. Step 2. Press one of the line buttons specified during setup.(left,right,up,down lines) Step 3. SPLIT!
   You can look at the old tutorial video </br><a class="c" href="https://youtu.be/qevn6WdLfmg" target="_blank">HERE</a></p>
   <u>Do not move your mouse</u>
   <p><b>NOTE :</b> The diagonal line has been assigned a coordinate value, which is attempted to be verified as much as possible.Real time,
   correct proportion, browser used, changing physics engine in Game, Monitor size etc.
   affects the items.That's hard to do.You have to constantly try to achieve this in the most erfect way.Going into the corner might be a bit more likely.Good luck!</p>
</div>
<div id="Theme" class="tabcont a c">
<table>
<p>Background Color : <input type="color" value="#ffffff" id="bgcolor"></input></p>
<p>Backdrop Color : <input type="color" value="#000000" id="bdcolor"></input></p>
<p>Button Color : <input type="color" value="#000000" id="btncolor"></input></p>
<p>Border Color : <input type="color" value="#ffffff" id="bordercolor"></input></p>
<p>Text Color : <input type="color" value="#000000" id="textcolor"></input></p>
</table>
</div>
<div id="Setup" class="tabcont a c">
  <h3 class="a">Agar.io</h3>
  <b style="float:left">Line Mode : <select id="linemod">
  <option value="manual">Manual</option>
  <option value="auto">Auto</option>
  </select></b>
  <table class="b">
  <tr>
  <th></th><th title="Click on the boxes and select the appropriate key.">Line Keys</th>
  <th></th><th>Feature</th>
  <th>Macro Keys</th>
  </tr>
  <tr>
<td><select class="selectt" id="freeze-topleft"></select></td>
<td><select class="selectt" id="freeze-up"></select></td>
<td><select class="selectt" id="freeze-topright"></select></td>
<td><p>Feed Macro :</p></td>
<td><select class="selectt" id="feed"></select></td>
</tr>
</br>
<tr>
<td><select class="selectt" id="freeze-left"></select></td>
<td><select class="selectt" id="freeze-middle"></select></td>
<td><select class="selectt" id="freeze-right"></select</td>
<td><p>Double Split :</p></td>
<td><select class="selectt" id="double"></select></td>
</tr>
</br>
<tr>
<td><select class="selectt" id="freeze-bottomleft"></select></td>
<td><select class="selectt" id="freeze-bottom"></select></td>
<td><select class="selectt" id="freeze-bottomright"></select></td>
<td><p>Triple Split :</p></td>
<td><select class="selectt" id="triple"></select></td>
</tr>
<tr>
<td><td>&nbsp;<b>Gota.io</b></td></td>
</tr>
<tr>
<td>Diagonal Line :</td>
<td><select class="selectt" id="diagonal"></select></td>
<td></td>
<td>Quad Split :</td>
<td><select class="selectt" id="quad"></select></td>
</tr>
<tr>
<td>Diagonal (16x):</td>
<td><select class="selectt" id="diagonalx16"></select></td>
<td></td>
<td>W Split (1x) :</td>
<td><select class="selectt" id="wsplit"></select></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td>Backward </br> Double :</td>
<td><select class="selectt" id="backward"></select></td>
</tr>
<tr>
<td><td><td></td></td></td>
<td>Late Backward </br> Double Split :</td>
<td><select class="selectt" id="ltbackward"></select></td>
</tr>
</table>
</div>
<div id="About" class="tabcont a c">
<h1>CeyHun</h1>
<a href="https://youtube.com/c/CeyHun1" target="_blank"><button class="yt-btn">YouTube</button></a>
<p>Subscribe to my channel for support!</p>
</br>
<p class="c" style="color: grey;">SCRIPT VERSION : 1.6.1</p>
</div>
</div>
</div>
<div id="backdrop" class="backdrop"></div>
` );
//HTML Code End.

//CSS Enabled.
GM_addStyle ( `\
.modal {\
  position: absolute;\
  left: 50%;\
  top: 50%;\
  right: 50%;\
  transform: translate(-50%, -50%);\
  width: 680px;\
  height: 435px;\
  padding: 5px;\
  padding-left: 30px;\
  padding-right: 10px;\
  display: none;\
  flex-direction: column;\
  align-items: center;\
  border: 3px solid black;\
  border-radius: 5px;\
  background: white;\
  margin: auto;\
  overflow: auto;\
  z-index: 999;\
}\
.btns {\
  color:inherit;\
  font-family: arial;\
  font-size: 20px;\
  background: white;\
  padding: 1px 43px;\
  border: 3px solid black;\
  box-shadow: 0 0 0 black;\
  transition: all 0.2s;\
  cursor: pointer;\
  outline: none;\
}\

.btns:last-child {\
  margin: 0;\
}\

.btns:hover {\
  box-shadow: 0.4rem 0.4rem 0 black;\
  transform: translate(-0.4rem, -0.4rem);\
}\

.btns:active {\
  box-shadow: 0 0 0 black;\
  transform: translate(0, 0);\
}\
\
.tablink {\
  background-color: #555;\
  color: white;\
  float: left;\
  border: none;\
  outline: none;\
  cursor: pointer;\
  padding: 14px 16px;\
  font-size: 17px;\
  width: 25%;\
}\

.tablink:hover {\
  background-color: #777;\
}\
.tabcont {\
  color: black;\
  display: none;\
  padding: 25px 20px;\
  height: 100%;\
}\
.b {\
  margin-left: 22px;\
}\
.x {\
  float: right;\
  font-family: sans-serif;\
  font-size: 20px;\
  cursor: pointer;\
  z-index: 9;\
}\
.savebuton {\
  background-color: green;\
  border: solid 3px black;\
  color: white;\
  padding: 5px 20px;\
  font-size: 16px;\
  cursor: pointer;\
}\
  .title {\
  text-align: center;\
  font-family: arial;\
  font-size: 35px;\
}\
.yt-btn {\
  background-color: #cc181e;\
  items-size:50px;\
  color: white;\
  padding: 4px 18px;\
  font-size: 13px;\
  border-radius: 1px;\
  border:none;\
  font: 12px ,Roboto,arial,sans-serif;\
  text-align: center;\
  cursor: pointer;\
}\
.a {\
  text-align: center;\
  font-family: arial;\
}\
.c-red {\
  color:red;\
}\
.selectt {\
  text-align: center;\
  text-align-last: center;\
  width: 90px;\
  height: 50px;\
  font-size: 15px;\
  margin: 10px;\
  border: 1px solid black;\
  -webkit-appearance: none;\
  -moz-appearance: none;\
  -o-appearance: none;\
}\
.backdrop {\
  position: fixed;\
  top: 0;\
  right: 0;\
  bottom: 0;\
  left: 0;\
  background-color: black;\
  opacity: 0.6;\
  width: 100%;\
  height: 100%;\
  display: none;\
  z-index: 998;\
}\
.selectt option {\
font-size: 18px;\
}\
#scrollbarr::-webkit-scrollbar-button {\
  display: none;\
  height: 13px;\
  border-radius: 0px;\
  background-color: #AAA;\
}\

#scrollbarr::-webkit-scrollbar-button:hover {\
  background-color: #AAA;\
}\
#scrollbarr::-webkit-scrollbar-thumb {\
  background-color: #CCC;\
  border-radius: 9px;\
}\
#scrollbarr::-webkit-scrollbar-thumb:hover {\
  background-color: #CCC;\
  border-radius: 9px;\
}\
#scrollbarr::-webkit-scrollbar-track {\
  background-color: #efefef;\
}\
#scrollbarr::-webkit-scrollbar {\
  width: 7px;\
}\
#scrollbarr::-moz-scrollbar-button {\
  display: none;\
  height: 13px;\
  border-radius: 0px;\
  background-color: #AAA;\
}\
#scrollbarr::-moz-scrollbar-button:hover {\
  background-color: #AAA;\
}\
#scrollbarr::-moz-scrollbar-thumb {\
  background-color: #CCC;\
  border-radius: 9px;\
}\
#scrollbarr::-moz-scrollbar-thumb:hover {\
  background-color: #CCC;\
  border-radius: 9px;\
}\
#scrollbarr::-moz-scrollbar-track {\
  background-color: #efefef;\
}\
#scrollbarr::-moz-scrollbar {\
  width: 7px;\
}\
#scrollbarr::-o-scrollbar-button {\
  display: none;\
  height: 13px;\
  border-radius: 0px;\
  background-color: #AAA;\
}\
#scrollbarr::-o-scrollbar-button:hover {\
  background-color: #AAA;\
}\
#scrollbarr::-o-scrollbar-thumb {\
  background-color: #CCC;\
  border-radius: 9px;\
}\
#scrollbarr::-o-scrollbar-thumb:hover {\
  background-color: #CCC;\
  border-radius: 9px;\
}\
#scrollbarr::-o-scrollbar-track {\
  background-color: #efefef;\
}\
#scrollbarr::-o-scrollbar {\
  width: 7px;\
}\
` );
//CSS Code End.

//Keycodes mapping option
$( "#freeze-topleft,#freeze-up,#freeze-topright,#freeze-left,#freeze-middle,#freeze-right,#freeze-bottomleft,#freeze-bottom,#freeze-bottomright,#feed,#double,#triple,#quad,#wsplit,#backward,#ltbackward,#diagonal,#diagonalx16" ).append( `<option value="0"></option>
<option value="8">Backspace</option>
<option value="9">Tab</option>
<option value="13">Enter</option>
<option value="16">Shift</option>
<option value="17">Ctrl</option>
<option value="18">Alt</option>
<option value="225">Alt Gr</option>
<option value="19">Pause Break</option>
<option value="20">Caps Lock</option>
<option value="33">Page Up</option>
<option value="34">Page Down</option>
<option value="35">End</option>
<option value="36">Home</option>
<option value="45">Insert</option>
<option value="46">Delete</option>
<option value="145">Scroll Lock</option>
<option value="92">Win / Key ⌘</option>
<option disabled></option>
<option value="48">0</option>
<option value="49">1</option>
<option value="50">2</option>
<option value="51">3</option>
<option value="52">4</option>
<option value="53">5</option>
<option value="54">6</option>
<option value="55">7</option>
<option value="56">8</option>
<option value="57">9</option>
<option disabled></option>
<option value="65">A</option>
<option value="66">B</option>
<option value="67">C</option>
<option value="68">D</option>
<option value="69">E</option>
<option value="70">F</option>
<option value="71">G</option>
<option value="72">H</option>
<option value="73">I</option>
<option value="74">J</option>
<option value="75">K</option>
<option value="76">L</option>
<option value="77">M</option>
<option value="78">N</option>
<option value="79">O</option>
<option value="80">P</option>
<option value="81">Q</option>
<option value="82">R</option>
<option value="83">S</option>
<option value="84">T</option>
<option value="85">U</option>
<option value="86">V</option>
<option value="87">W</option>
<option value="88">X</option>
<option value="89">Y</option>
<option value="90">Z</option>
<option disabled></option>
<option value="37">←</option>
<option value="38">↑</option>
<option value="39">→</option>
<option value="40">↓</option>
<option disabled></option>
<option value="144">NumLock</option>
<option value="96">Numpad 0</option>
<option value="97">Numpad 1</option>
<option value="98">Numpad 2</option>
<option value="99">Numpad 3</option>
<option value="100">Numpad 4</option>
<option value="101">Numpad 5</option>
<option value="102">Numpad 6</option>
<option value="103">Numpad 7</option>
<option value="104">Numpad 8</option>
<option value="105">Numpad 9</option>
<option value="107">+</option>
<option value="111">/</option>
<option value="188">,</option>
<option value="189">-</option>
<option value="223">*</option>
<option disabled></option>
<option value="112">F1</option>
<option value="113">F2</option>
<option value="114">F3</option>
<option value="115">F4</option>
<option value="116">F5</option>
<option value="117">F6</option>
<option value="118">F7</option>
<option value="119">F8</option>
<option value="120">F9</option>
<option value="121">F10</option>
<option value="122">F11</option>
<option value="123">F12</option>
<option value="124">F13</option>
<option value="125">F14</option>
`);
//Key Mapping End

$(function() {
//Theme,Keys Set Data
var textcolorr = localStorage.getItem("textcolor"),
bordercolorr = localStorage.getItem("bordercolor"),
btncolorr = localStorage.getItem("btncolor"),
bdcolorr = localStorage.getItem("bdcolor"),
bgcolorr = localStorage.getItem("bgcolor"),
topleft = localStorage.getItem("topleft", topleft),
up = localStorage.getItem("up", up),
topright = localStorage.getItem("topright", topright),
left = localStorage.getItem("left", left),
middle = localStorage.getItem("middle", middle),
right = localStorage.getItem("right", right),
bottomleft = localStorage.getItem("bottomleft", bottomleft),
bottom = localStorage.getItem("bottom", bottom),
bottomright = localStorage.getItem("bottomright", bottomright),
feed = localStorage.getItem("feed", feed),
double = localStorage.getItem("double", double),
triple = localStorage.getItem("triple", triple),
quad = localStorage.getItem("quad", quad),
wsplit = localStorage.getItem("wsplit", wsplit),
backward = localStorage.getItem("backward", backward),
ltbackward = localStorage.getItem("ltbackward", ltbackward),
diagonal = localStorage.getItem("diagonal", diagonal),
diagonalx16 = localStorage.getItem("diagonalx16", diagonalx16),
linemod = localStorage.getItem("linemod", linemod);

$('.c').css('color', textcolorr);
$('.modal,.btns,.selectt,.savebuton').css('borderColor', bordercolorr);
$('.btns').css('background-color', btncolorr);
$('.backdrop').css('background-color', bdcolorr);
$('.modal').css('background-color', bgcolorr);
$("#bdcolor").val(bdcolorr);
$("#bgcolor").val(bgcolorr);
$("#bordercolor").val(bordercolorr);
$("#btncolor").val(btncolorr);
$("#bordercolor").val(bordercolorr);
$("#textcolor").val(textcolorr);

$("#freeze-topleft").val(topleft);
$("#freeze-up").val(up);
$("#freeze-topright").val(topright);
$("#freeze-left").val(left);
$("#freeze-middle").val(middle);
$("#freeze-right").val(right);
$("#freeze-bottomleft").val(bottomleft);
$("#freeze-bottom").val(bottom);
$("#freeze-bottomright").val(bottomright);
$("#feed").val(feed);
$("#double").val(double);
$("#triple").val(triple);
$("#quad").val(quad);
$("#wsplit").val(wsplit);
$("#backward").val(backward);
$("#ltbackward").val(ltbackward);
$("#diagonal").val(diagonal);
$("#diagonalx16").val(diagonalx16);
$("#linemod").val(linemod);
//Theme Listener Set
$(":text").on('blur', function() {
window.addEventListener('keydown', keydown ,false);
window.addEventListener('keyup', keyup ,false);
})

$(":text").on('focus', function() {
window.removeEventListener('keydown', keydown ,false);
window.removeEventListener('keyup', keyup ,false);
})

$('#backdrop ,.x').on('click', function() {
$(".modal").hide();
$("#backdrop").hide();
})

$('#textcolor').on('change', function() {
var textcolor = document.getElementById("textcolor").value;
localStorage.setItem("textcolor", textcolor);
 $('.c').css('color', textcolor);
})

$('#bordercolor').on('change', function() {
var bordercolor = document.getElementById("bordercolor").value;
    localStorage.setItem("bordercolor", bordercolor);
$('.modal,.btns,.selectt,.savebuton').css('borderColor', bordercolor);
})

$('#btncolor').on('change', function() {
var btncolor = document.getElementById("btncolor").value;
    localStorage.setItem("btncolor", btncolor);
$('.btns').css('background-color', btncolor);
})

$('#bdcolor').on('change', function() {
var bdcolor = document.getElementById("bdcolor").value;
    localStorage.setItem("bdcolor", bdcolor);
$('.backdrop').css('background-color', bdcolor);
})

$( "#bgcolor" ).change(function() {
var bgcolor = document.getElementById("bgcolor").value;
    localStorage.setItem("bgcolor", bgcolor);
$('.modal').css('background-color', bgcolor);
})
    //Listener Cookie Set
$( "#freeze-topleft,#freeze-up,#freeze-topright,#freeze-left,#freeze-middle,#freeze-right,#freeze-bottomleft,#freeze-bottom,#freeze-bottomright,#feed,#double,#triple,#quad,#wsplit,#backward,#ltbackward,#diagonal,#diagonalx16,#linemod" ).change(function() {
var topleft = document.getElementById("freeze-topleft").value,
 up = document.getElementById("freeze-up").value,
 topright = document.getElementById("freeze-topright").value,
 left = document.getElementById("freeze-left").value,
 middle = document.getElementById("freeze-middle").value,
 right = document.getElementById("freeze-right").value,
 bottomleft = document.getElementById("freeze-bottomleft").value,
 bottom = document.getElementById("freeze-bottom").value,
 bottomright = document.getElementById("freeze-bottomright").value,
 feed = document.getElementById("feed").value,
 double = document.getElementById("double").value,
 triple = document.getElementById("triple").value,
 quad = document.getElementById("quad").value,
 wsplit = document.getElementById("wsplit").value,
 backward = document.getElementById("backward").value,
 ltbackward = document.getElementById("ltbackward").value,
 diagonal = document.getElementById("diagonal").value,
 diagonalx16 = document.getElementById("diagonalx16").value,
 linemod = document.getElementById("linemod").value;
    //Cookie Set Keys
    localStorage.setItem("topleft", topleft);
    localStorage.setItem("up", up);
    localStorage.setItem("topright", topright);
    localStorage.setItem("left", left);
    localStorage.setItem("middle", middle);
    localStorage.setItem("right", right);
    localStorage.setItem("bottomleft", bottomleft);
    localStorage.setItem("bottom", bottom);
    localStorage.setItem("bottomright", bottomright);
    localStorage.setItem("feed", feed);
    localStorage.setItem("double", double);
    localStorage.setItem("triple", triple);
    localStorage.setItem("quad", quad);
    localStorage.setItem("wsplit", wsplit);
    localStorage.setItem("backward", backward);
    localStorage.setItem("ltbackward", ltbackward);
    localStorage.setItem("diagonal", diagonal);
    localStorage.setItem("diagonalx16", diagonalx16);
    localStorage.setItem("linemod", linemod);
})
    //fixed menu button
  if (location.host == "balz.io" || location.host == "cellz.io" || location.host == "agar.red" || location.host == "xgar.io") {
	 $('.btns').css('padding','1px 40px');
     $('.modal').css('padding-left','22px');
     return;
}
    //auto select
  if (linemod == "" || linemod == null) {
      linemod = "auto"
  }
});
document.openPage = function (pageName) {
  var i, tabcont;
  tabcont = document.getElementsByClassName("tabcont");
  for (i = 0; i < tabcont.length; i++) {
  tabcont[i].style.display = "none";
}
document.getElementById(pageName).style.display = "block";
}
document.getElementById("firstPage").click();

window.addEventListener('keydown', keydown ,false);
window.addEventListener('keyup', keyup ,false);
var EjectDn = false;
var wspeed = 10;
function keydown(event) {
 //Key Value Porting
 var topleft = document.getElementById("freeze-topleft").value,
 up = document.getElementById("freeze-up").value,
 topright = document.getElementById("freeze-topright").value,
 left = document.getElementById("freeze-left").value,
 middle = document.getElementById("freeze-middle").value,
 right = document.getElementById("freeze-right").value,
 bottomleft = document.getElementById("freeze-bottomleft").value,
 bottom = document.getElementById("freeze-bottom").value,
 bottomright = document.getElementById("freeze-bottomright").value,
 feed = document.getElementById("feed").value,
 double = document.getElementById("double").value,
 triple = document.getElementById("triple").value,
 quad = document.getElementById("quad").value,
 wsplit = document.getElementById("wsplit").value,
 backward = document.getElementById("backward").value,
 ltbackward = document.getElementById("ltbackward").value,
 diagonal = document.getElementById("diagonal").value,
 diagonalx16 = document.getElementById("diagonalx16").value,
 linemod = document.getElementById("linemod").value,
 keys = event.keyCode;
 //Key Value Porting End

 //Controls
    if (keys == middle) {
        X = window.innerWidth / 2;
        Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
     if (keys == left && linemod == "manual") {
        X = window.innerWidth / 3;
        Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == left && linemod == "auto") {
        center();
        X = window.innerWidth / 3;
        Y = window.innerHeight / 2;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
     if (keys == right && linemod == "manual") {
        X = window.innerWidth / 1;
        Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == right && linemod == "auto") {
        center();
        X = window.innerWidth / 1;
        Y = window.innerHeight / 2;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
    if (keys == bottom && linemod == "manual") {
        X = window.innerWidth / 2;
        Y = window.innerHeight / 1;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == bottom && linemod == "auto") {
        center();
        X = window.innerWidth / 2;
        Y = window.innerHeight / 1;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
    if (keys == up && linemod == "manual") {
        X = window.innerWidth / 2;
        Y = window.innerHeight / 3;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == up && linemod == "auto") {
        center();
        X = window.innerWidth / 2;
        Y = window.innerHeight / 3;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
    if (keys == topleft && linemod == "manual") {
        X = window.innerWidth / 2.008
        Y = window.innerHeight / 2.008
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == topleft && linemod == "auto") {
        center();
        X = window.innerWidth / 2.008;
        Y = window.innerHeight / 2.008;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
    if (keys == topright && linemod == "manual") {
        X = window.innerWidth / 1.994
        Y = window.innerHeight / 2.008
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == topright && linemod == "auto") {
        center();
        X = window.innerWidth / 1.994;
        Y = window.innerHeight / 2.008;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
    if (keys == bottomright && linemod == "manual") {
        X = window.innerWidth / 1.994
        Y = window.innerHeight / 1.994
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == bottomright && linemod == "auto") {
        center();
        X = window.innerWidth / 1.994;
        Y = window.innerHeight / 1.994;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }
    if (keys == bottomleft && linemod == "manual") {
        X = window.innerWidth / 2.008
        Y = window.innerHeight / 1.994
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        return;
    }
    else if (keys == bottomleft && linemod == "auto") {
        center();
        X = window.innerWidth / 2.008;
        Y = window.innerHeight / 1.994;
        setTimeout(function () { $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}))}, 570);
    }

    if (keys == double) {
        split();
        setTimeout(split, 10);
        return;
    }

    if (keys == triple) {
        split();
        setTimeout(split, 10);
        setTimeout(split, 20);
        return;
    }
    if (keys == quad) {
        split();
        setTimeout(split, 10);
        setTimeout(split, 20);
        setTimeout(split, 30);
        return;
    }
    if (keys == wsplit) {
        ww();
        setTimeout(split, 5);
        return;
    }

    if (keys == diagonal && location.host == "gota.io" && document.getElementById("main").style.display == "none") {
        split();
        split();
        split();
        menu_off();
        block();
        setTimeout(none, 1050);
        setTimeout(menu_on, 1050);
        return;
    }

    if (keys == backward) {
        split();
        center();
        center();
        center();
        split();
        return;
    }

    if (keys == feed && EjectDn === false) {
        EjectDn = true;
        setTimeout(eject, wspeed);
        return;
    }

    if (keys == diagonalx16 && location.host == "gota.io" && document.getElementById("main").style.display == "none") {
        split();
        split();
        split();
        split();
        menu_off();
        block();
        setTimeout(none, 1050);
        setTimeout(menu_on, 1050);
        return;
    }
    if (keys == 192) {
        $(".modal").show();
        $("#backdrop").show();
        return;
    }
    if (keys == ltbackward) {
        split();
        split();
        setTimeout(center, 300);
        return;
    }
}
    function none() { //changing display value
        var m = document.getElementById("main");
        m.style.display = "none";
    }
    function block() { //changing display value
        var m = document.getElementById("main");
        m.style.display = "block";
    }
    function menu_on() { //show the menu
        var m = document.getElementById("main");
        m.style.zIndex = "2";
    }
    function menu_off() { //hide the menu
        var m = document.getElementById("main");
        m.style.zIndex = "-99";
    }
    function center() { //routing the mouse event to the center
    X = window.innerWidth / 2;
    Y = window.innerHeight / 2;
    $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        }
    function split() { //Space key listener the assigned number
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
        }
    function esc() { //ESC key listener the assigned number
    $("body").trigger($.Event("keydown", { keyCode: 27}));
    $("body").trigger($.Event("keyup", { keyCode: 27}));
        }
    function ww() {
    $("body").trigger($.Event("keydown", { keyCode: 87}));
    $("body").trigger($.Event("keyup", { keyCode: 87}));
        }
    function keyup(event) {
        var feeding = document.getElementById("feed"),
        feed = feeding.value;
        if (event.keyCode == feed) {
        EjectDn = false;
    }
}
    function eject() {
        if (EjectDn) {
    $("body").trigger($.Event("keydown", { keyCode: 87}));
    $("body").trigger($.Event("keyup", { keyCode: 87}));
        setTimeout(eject, wspeed);
    }
}
    //Train Line Controller By CeyHun 1.6.1