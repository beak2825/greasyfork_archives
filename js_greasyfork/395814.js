// ==UserScript==
// @name         Gmail Template Support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A crocodile can’t poke its tongue out
// @author       Marian D.
// @include        *https://mail.google.com/mail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395814/Gmail%20Template%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/395814/Gmail%20Template%20Support.meta.js
// ==/UserScript==

window.onload = function(){

var Header=document.querySelectorAll("div")[67]
var user=document.querySelector(".gb_Uc").innerHTML
var Button = document.createElement("select");
Button.id = "au_1_sel";
Button.name="au_1_sel";
Button.class="search";
Button.style.cssText="border-radius:6px 0px 0px 6px;zIndex:10000;color:white;background-color:#5f6368;width:210px;height:40px;position:absolute;top:12px;left:1300px"
Header.appendChild(Button);


// Insert options in dropdown menu
var option1 = document.createElement("option");
option1.value="";
option1.innerHTML= "Request Update";
Button.appendChild(option1);


var option2 = document.createElement("option");
option2.value="";
option2.innerHTML= "Complete/Updated";
Button.appendChild(option2);

var option3 = document.createElement("option");
option3.value="";
option3.innerHTML= "Re-route";
Button.appendChild(option3);

var option4 = document.createElement("option");
option4.value="";
option4.innerHTML= "PtNumber Updated";
Button.appendChild(option4);

var option5 = document.createElement("option");
option5.value="";
option5.innerHTML= "White Labeled";
Button.appendChild(option5);

var option6 = document.createElement("option");
option6.value="";
option6.id= "o1";
option6.selected="";
option6.innerHTML= "German";
Button.appendChild(option6);

var option7 = document.createElement("option");
option7.value="";
option7.innerHTML= "5Days";
Button.appendChild(option7);

var option8 = document.createElement("option");
option8.value="";
option8.innerHTML= "Non-Standard Kit";
Button.appendChild(option8);
option8.style.backgroundColor="lavender";
option8.style.color="black";

var option9 = document.createElement("option");
option9.value="";
option9.innerHTML= "SRM(supplier)";
Button.appendChild(option9);


var button=document.createElement("button");
button.innerHTML = "Insert";
Header.appendChild(button)
button.style.cssText="border-radius:0px 6px 6px 0px;position:absolute;left:1510px;color:white;background:#78909c;top:10.7px;height:64%"
button.onclick=function(){
var index = Button.options[Button.selectedIndex].value;
if (user.indexOf("mdanilencu@gmail.com") != -1) {var b ="\nMarian"}
else if (user.indexOf("alexandra") != -1) { b ="\nAlexandra"}
else if (user.indexOf("victor") != -1) { b ="\nVictor"}
else if (user.indexOf("cristina") != -1) { b ="\nCristina"}
else if (user.indexOf("madalina") != -1) { b ="\nMadalina"}
else if (user.indexOf("smirica") != -1) { b ="\nSabina"}
else if (user.indexOf("rdiacanu") != -1) { b ="\nRaluca"}
else if (user.indexOf("fvalentino") != -1) { b ="\nValentino"}
else if (user.indexOf("vrosioru") != -1) { b ="\nValentina"}
else if (user.indexOf("tdavid") != -1) { b ="\nDavid"}
else if (user.indexOf("mmadalina") != -1) { b ="\nMadi"}
else if (user.indexOf("bcatalin") != -1) { b ="\nCatalin"}
else if (user.indexOf("lsimona") != -1) { b ="\nSimona"}
else if (user.indexOf("rlazaroiu") != -1) { b ="\nRaluca"}
else if (user.indexOf("salexandru") != -1) { b ="\nAlex"}
else if (user.indexOf("sblajevici") != -1) { b ="\nSebastian"}
else if (user.indexOf("mdorobantu1") != -1) { b ="\nLucian"}
document.querySelectorAll('[aria-label="Message Body"]')[1].innerText=index+b;}
}