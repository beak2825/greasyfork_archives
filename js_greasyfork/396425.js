// ==UserScript==
// @name         Templates Dropdown SO
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds quick response templates to PT ticket view and a quick assign button.
// @author       Marian Danilencu
// @shoutout     A. Braunschweig
// @update       https://greasyfork.org/scripts/396425-templates-dropdown-so/code/Templates%20Dropdown%20SO.user.js
// @download     https://greasyfork.org/scripts/396425-templates-dropdown-so/code/Templates%20Dropdown%20SO.user.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @include        *admin.wayfair.com/tracker*
// @grant        none
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/396425/Templates%20Dropdown%20SO.user.js
// @updateURL https://update.greasyfork.org/scripts/396425/Templates%20Dropdown%20SO.meta.js
// ==/UserScript==

var $ = window.jQuery;
var jQuery = window.jQuery;
var display = document.getElementById("PtuDetail");
var panel = document.getElementById("UpdatePanel_h");
var select = document.getElementById("au_1_sel");
var user = document.getElementById('serverip').innerHTML


//Create empty dropdown menu element and append to element on page

display.onclick=
function()
{
var select = document.createElement("select");
select.id = "au_1_sel";
select.name="au_1_sel";
select.class="search";
select.style.position="absolute";
select.style.backgroundColor="tomato";
select.style.color="white";
select.style.left="100px"
document.getElementById("UpdatePanel_h").appendChild(select);


// Insert options in dropdown menu
var option1 = document.createElement("option");
option1.value="Hello  MV,\n\nYou are watchlisted on this ticket for information only. Please do not outreach to the supplier.\n\nThank you,";
option1.innerHTML= "Watchlist MV";
select.appendChild(option1);


var option2 = document.createElement("option");
option2.value="Hi Team,\n\nPlease be informed that the outreach to the supplier was performed. This ticket will be replied to as soon as I receive an update.\nYou can always check the target date on the right side of the ticket.\n\nThank you,";
option2.innerHTML= "Outreach Mail";
select.appendChild(option2);

var option3 = document.createElement("option");
option3.value="Hi Team,\n\nPlease find attached the requested information.\nIf you have any additional questions or require further clarification regarding the attached template, feel free to let me know. If not, please close the ticket.\n\nThank you,";
option3.innerHTML= "Answer MAIL";
select.appendChild(option3);

var option4 = document.createElement("option");
option4.value="Hi Team,\n\nI didn’t receive an answer from the supplier yet so I tried calling him today but I wasn’t able to get in touch with him via phone either. This ticket will be updated once I receive an answer.\n\nThank you,";
option4.innerHTML= "Unresponsive";
select.appendChild(option4);

var option5 = document.createElement("option");
option5.value="Hi Team,\n\nI called the supplier today at TIME and informed me that he will send the required information by DATE. This ticket will be updated once I receive an answer.\n\nThank you,";
option5.innerHTML= "Response Delay";
select.appendChild(option5);

var option6 = document.createElement("option");
option6.value="Hi Team,\n\nI called the supplier today at TIME and he confirmed that … .\nIf you have any additional questions or require further clarification regarding the attached template, feel free to let me know. If not, please close the ticket.\n\nThank you,";
option6.innerHTML= "Answer PHONE";
select.appendChild(option6);


//This is the template insert button (it makes the selected template appear in text area)

var button = document.createElement("button");
button.innerHTML = "Insert";
document.getElementById("UpdatePanel_h").appendChild(button)
button.style.position="absolute";
button.style.left="230px";
button.style.color="white";
button.style.backgroundColor="blueviolet"
button.style.height="7%";
button.onclick=function(){
var index = select.options[select.selectedIndex].value;
if (user.indexOf("nciurea") != -1) {var b ="\nNicoleta"}
else if (user.indexOf("bvoinea") != -1) { b ="\nBianca"}
else if (user.indexOf("lpopescu") != -1) { b ="\nLucian"}
else if (user.indexOf("abraunschweig") != -1) { b ="\nAlexander"}
else if (user.indexOf("sionescu") != -1) { b ="\nStefi"}
else if (user.indexOf("lvatajanu") != -1) { b ="\nLaura"}
else if (user.indexOf("ageonea") != -1) { b ="\nAndreea"}
else if (user.indexOf("avasilescu") != -1) { b ="\nFrida"}

display.value=index+b;
}}
