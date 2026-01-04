// ==UserScript==
// @name         Dynamic name pull and agent assign
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Pulls agent name automatically and inserts in signature.
// @author       Marian D
// @include       *pastebin.com*
// @run-at      document-idle
// @grant       GM_addStyle
//@history      Updated agents library
//@update https://greasyfork.org/scripts/393356-test/code/Test.user.js
//@download https://greasyfork.org/scripts/393356-test/code/Test.user.js
// @downloadURL https://update.greasyfork.org/scripts/393356/Dynamic%20name%20pull%20and%20agent%20assign.user.js
// @updateURL https://update.greasyfork.org/scripts/393356/Dynamic%20name%20pull%20and%20agent%20assign.meta.js
// ==/UserScript==

// This could be useful for finding username:    if(document.getElementsByClassName("user-profile-link")[0].innerHTML=="User"){alert("Success")}else{alert("Fail")};



//Button inserts template and stores the template text
var header = document.getElementById("header_top");
var btn = document.createElement("button");
btn.value="Hello,\n\nThis is my template.\n\n";
btn.innerHTML="Insert";
header.appendChild(btn);
//used "header_logo" to simulate currently logged agent
var user = document.getElementById("header_logo")
//signature part 1
var a = "Kind Regards,";
//function when button is clicked
btn.onclick= function(){
// checks who is currently logged in
var user = document.getElementById('serverip').innerHTML

if (user.indexOf("mdanilencu") != -1) {var b ="\nMarian"}
else if (user.indexOf("calexandra") != -1) { b ="\nAlexandra"}
else if (user.indexOf("svictor") != -1) { b ="\nVictor"}
else if (user.indexOf("vcristina") != -1) { b ="\nCristina"}
else if (user.indexOf("gmadalina") != -1) { b ="\nMadalina"}
else if (user.indexOf("smirica") != -1) { b ="\nSabina"}
else if (user.indexOf("draluca") != -1) { b ="\nRaluca"}
else if (user.indexOf("fvalentiono") != -1) { b ="\nValentino"}
else if (user.indexOf("rvalentina") != -1) { b ="\nValentina"}
else if (user.indexOf("tdavid") != -1) { b ="\nDavid"}
else if (user.indexOf("mmadalina") != -1) { b ="\nMadi"}
else if (user.indexOf("bcatalin") != -1) { b ="\nCatalin"}
else if (user.indexOf("lsimona") != -1) { b ="\nSimona"}
else if (user.indexOf("lraluca") != -1) { b ="\nRaluca"}
else if (user.indexOf("salexandru") != -1) { b ="\nAlex"}
//this is the textbox
var text = document.getElementById ("paste_code");
//inserts the name of the agent in the template
var position = 18;
var output = [a.slice(0, position + 1), b, a.slice(position)].join('');
// displays text template(btn.value) plus name of the agent in signature(output)
text.value=btn.value+output};
//create assign button
var btn1 = document.createElement("button");
btn1.innerHTML="Assign";
header.appendChild(btn1);
btn1.onclick= function(){
// Assigns agent name
if (paste.innerHTML=="dmarian") {var c ="Marian"}
else if (paste.innerHTML=="calexandra") { c ="Alexandra"}
else if (paste.innerHTML=="svictor") { c ="Victor"}
else if (paste.innerHTML=="vcristina") { c ="nCristina"}
else if (paste.innerHTML=="gmadalina") { c ="nMadalina"}
else if (paste.innerHTML=="msabina") { c ="Sabina"}
else if (paste.innerHTML=="draluca") { c ="Raluca"}
else if (paste.innerHTML=="fvalentino") { c ="Valentino"}
else if (paste.innerHTML=="rvalentina") { c ="Valentina"}
else if (paste.innerHTML=="tdavid") { c ="David"}
else if (paste.innerHTML=="mmadalina") { c ="Madi"}
else if (paste.innerHTML=="bcatalin") { c ="Catalin"}
else if (paste.innerHTML=="lsimona") { c ="Simona"}
else if (paste.innerHTML=="lraluca") { c ="Raluca"}
else if (paste.innerHTML=="salexandru") { c ="Alexandru S."}
//Searches for agent ID
if (paste.innerHTML=="dmarian"){var d ="098765123512"}
else if (paste.innerHTML=="calexandra"){ d ="23452345"}
else if (paste.innerHTML=="svictor"){ d ="23452"}
else if (paste.innerHTML=="vcristina"){ d ="234523"}
else if (paste.innerHTML=="gmadalina"){ d ="4568545"}
else if (paste.innerHTML=="msabina"){ d ="2345234"}
else if (paste.innerHTML=="draluca"){ d ="12312"}
else if (paste.innerHTML=="fvalentino"){ d ="125135"}
else if (paste.innerHTML=="rvalentina"){ d ="235463461"}
else if (paste.innerHTML=="tdavid"){ d ="54684568"}
else if (paste.innerHTML=="mmadalina"){ d ="4568632"}
else if (paste.innerHTML=="bcatalin"){ d ="23461346"}
else if (paste.innerHTML=="lsimona"){ d ="126126"}
else if (paste.innerHTML=="lraluca"){ d ="13471346"}
else if (paste.innerHTML=="salexandru") { d ="12523523468"}
//insert function to be executed after the agent name and id have been found
alert(c+d)};