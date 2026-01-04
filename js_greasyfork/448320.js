// ==UserScript==
// @name         Tools: Ascension
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        sigil.outwar.com/*
// @version      1.1
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/448320/Tools%3A%20Ascension.user.js
// @updateURL https://update.greasyfork.org/scripts/448320/Tools%3A%20Ascension.meta.js
// ==/UserScript==

// MOXXI VIEW

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

let menu = document.querySelector("#forms");

let li = document.createElement('li');
li.innerHTML = `<a href=purchasepolicy>ASCENSION SCAN</a>`
insertAfter(li, menu.children[0]);

if (document.URL.indexOf("purchasepolicy") != -1 ) {

if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

fetch("myaccount.php")
   .then(response => response.text())
   .then((response) => {

var trustees = response.matchAll(/<a target=.*suid=(.*)&serverid=.*">(.*)<\/a>.*[\n\r].*[\n\r].*<td>.:Ascension:.<\/td>.*[\n\r].*<td>/g)
var syndChars = Array.from(trustees)

var syndvision = document.querySelector("#content-header-row")

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(1){background:#0F0F0F !important;color:#D4D4D4 !important;font-size:8px !important;}
#syndscan > tbody > tr > td:nth-child(1){display:none !important;}
#syndscan > tbody > tr > td:nth-child(2){display:none !important;}
#content-header-row > table > tbody > tr > td{padding-left:5px !important;padding-right:5px !important;padding-top:10px !important;padding-bottom:10px !important;border:2px SOLID #0F0F0F !important;}
`);

let table = document.createElement('table');
for (let row of syndChars) {
  table.insertRow();
  for (let cell of row) {
  let newCell = table.rows[table.rows.length - 1].insertCell();
  newCell.textContent = cell;
  newCell.setAttribute("id","charname")
}}

syndvision.innerHTML = table.outerHTML

function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);}

let menu = document.querySelector("#content-header-row > table > tbody");

let th = document.createElement('tr');
th.innerHTML = `
<td>X</td><td>X</td>
<td><b>ACCOUNT</b></td>
<td><b><a onmouseover="statspopup(event,'will display god image if in the room with thanox, agnar, valzek, or any deity')" onmouseout="kill\(\)">ROOM</b></td>
<td><b><a onmouseover="statspopup(event,'current rage on the char')" onmouseout="kill\(\)">RAGE</b></td>
<td><b><a onmouseover="statspopup(event,'active booster')" onmouseout="kill\(\)">BOOST</b></td>
<td><b><a onmouseover="statspopup(event,'equipped badge')" onmouseout="kill\(\)">BADGE</b></td>
<td><b><a onmouseover="statspopup(event,'indicates whether or not the char has raid skills')" onmouseout="kill\(\)">PRES</b></td>
<td><b><a onmouseover="statspopup(event,'indicates whether or not the char has full strength')" onmouseout="kill\(\)">STR</b></td>
<td><b><a onmouseover="statspopup(event,'indicates whether or not the char has full supplies set to HP')" onmouseout="kill\(\)">SUP</b></td>
<td><b><a onmouseover="statspopup(event,'shows the char's current class')" onmouseout="kill\(\)">CLS</b></td>
<td><b>FREE POTS</b></td>
<td><b>EXTRA POTS</b></td>
<td><b>POWER POTS</b></td>`
menu.insertBefore(th, menu.firstElementChild);

var charsTable = document.querySelector("#content-header-row > table > tbody");
var charsTableRows = charsTable.rows.length;

for (let rownum = 1; rownum < charsTableRows+1; rownum++) {

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=potion")
   .then(response => response.text())
   .then((response) => {

var kix = response.match(/data-name="Kix Potion"/i)
var amdir = response.match(/data-name="Potion of Amdir"/i)
var squid = response.match(/data-name="Squidberry Juice"/i)
var rem = response.match(/data-name="Remnant Solice Lev 10"/i)
var snicker = response.match(/data-name="Snickers Bar"/i)
var starburst = response.match(/data-name="Starburst"/i)
var white = response.match(/data-name="White Vile"/i)
var natas = response.match(/data-name="Natas Vile"/i)
var arcane = response.match(/data-name="Arcane Vile"/i)
var fire = response.match(/data-name="Fire Vile"/i)
var shadow = response.match(/data-name="Shadow Vile"/i)
var kinetic = response.match(/data-name="Kinetic Vile"/i)
var star = response.match(/data-name="Star Power"/i)
var komb = response.match(/data-name="Kombucha"/i)
var minor = response.match(/data-name="Minor Chaos Philter"/i)
var major = response.match(/data-name="Major Chaos Philter"/i)
var madness = response.match(/data-name="Demonic Madness"/i)
var insanity = response.match(/data-name="Vial of Insanity"/i)
var bubble = response.match(/data-name="Bubble Gum"/i)
var kitkat = response.match(/data-name="Kit Kat Bar"/i)
var tootsie = response.match(/data-name="Tootsie Pop"/i)
var reeses = response.match(/data-name="Reeses Peanut Butter Cup"/i)
var mm = response.match(/src="\/images\/items\/mm\.png"/i)
var skittle = response.match(/data-name="Skittles"/i)
var zombie1 = response.match(/data-name="Zombie Potion 1"/i)
var zombie2 = response.match(/data-name="Zombie Potion 2"/i)
var zombie3 = response.match(/data-name="Zombie Potion 3"/i)
var zombie4 = response.match(/data-name="Zombie Potion 4"/i)
var zombie5 = response.match(/data-name="Zombie Potion 5"/i)
var zombie6 = response.match(/data-name="Zombie Potion 6"/i)
var alsayic = response.match(/data-name="Potion of Enraged Alsayic"/i)
var sammy = response.match(/data-name="Sammy Sosa's Special Sauce"/i)
var pumpkin = response.match(/data-name="Pumpkin Juice"/i)

var freepot = '';
if (kix != null)
freepot += "<img src=https://torax.outwar.com/images/potion28.jpg width=20px height=20px>"
if (kix == null)
freepot += `<img src=https://torax.outwar.com/images/potion28.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (amdir != null)
freepot += "<img src=https://torax.outwar.com/images/items/arelepot.jpg width=20px height=20px>"
if (amdir == null)
freepot += `<img src=https://torax.outwar.com/images/items/arelepot.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (squid != null)
freepot += `<img src=https://torax.outwar.com/images/items/Item_SquidberryJuice.jpg width=20px height=20px>`
if (squid == null)
freepot += `<img src=https://torax.outwar.com/images/items/Item_SquidberryJuice.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (rem != null)
freepot += `<img src=https://torax.outwar.com/images/items/90remnant.png width=20px height=20px>`
if (rem == null)
freepot += `<img src=https://torax.outwar.com/images/items/90remnant.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (snicker != null)
freepot += `<img src=https://torax.outwar.com/images/items/snickersbar.png width=20px height=20px>`
if (snicker == null)
freepot += `<img src=https://torax.outwar.com/images/items/snickersbar.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (starburst != null)
freepot += `<img src=https://torax.outwar.com/images/items/starburst.png width=20px height=20px>`
if (starburst == null)
freepot += `<img src=https://torax.outwar.com/images/items/starburst.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (white != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_WhiteVile.jpg width=20px height=20px>`
if (white == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_WhiteVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (natas != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_NatasVile.jpg width=20px height=20px>`
if (natas == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_NatasVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (arcane != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ArcaneVile.jpg width=20px height=20px>`
if (arcane == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ArcaneVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (fire != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_FireVile.jpg width=20px height=20px>`
if (fire == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_FireVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (shadow != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ShadowVile.jpg width=20px height=20px>`
if (shadow == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ShadowVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (kinetic != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_KineticVile.jpg width=20px height=20px>`
if (kinetic == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_KineticVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`

var extrapot = '';
if (star != null)
extrapot += `<img src=https://torax.outwar.com/images/items/starpowerelec.jpg width=20px height=20px>`
if (star == null)
extrapot += `<img src=https://torax.outwar.com/images/items/starpowerelec.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (komb != null)
extrapot += `<img src=https://torax.outwar.com/images/items/Putrid%20Power%20Clusters.jpg width=20px height=20px>`
if (komb == null)
extrapot += `<img src=https://torax.outwar.com/images/items/Putrid%20Power%20Clusters.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (minor != null)
extrapot += `<img src=https://torax.outwar.com/images/items/itemz91.jpg width=20px height=20px>`
if (minor == null)
extrapot += `<img src=https://torax.outwar.com/images/items/itemz91.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (major != null)
extrapot += `<img src=https://torax.outwar.com/images/items/itemz82.jpg width=20px height=20px>`
if (major == null)
extrapot += `<img src=https://torax.outwar.com/images/items/itemz82.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (insanity != null)
extrapot += `<img src=https://torax.outwar.com/images/items/vaultpot1.png width=20px height=20px>`
if (insanity == null)
extrapot += `<img src=https://torax.outwar.com/images/items/vaultpot1.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (madness != null)
extrapot += `<img src=https://torax.outwar.com/images/items/vaultpot2.png width=20px height=20px>`
if (madness == null)
extrapot += `<img src=https://torax.outwar.com/images/items/vaultpot2.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (bubble != null)
extrapot += `<img src=https://torax.outwar.com/images/items/bubblegum.png width=20px height=20px>`
if (bubble == null)
extrapot += `<img src=https://torax.outwar.com/images/items/bubblegum.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (kitkat != null)
extrapot += `<img src=https://torax.outwar.com/images/items/kitkatbar.png width=20px height=20px>`
if (kitkat == null)
extrapot += `<img src=https://torax.outwar.com/images/items/kitkatbar.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (tootsie != null)
extrapot += `<img src=https://torax.outwar.com/images/items/tootsiepop.png width=20px height=20px>`
if (tootsie == null)
extrapot += `<img src=https://torax.outwar.com/images/items/tootsiepop.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (reeses != null)
extrapot += `<img src=https://torax.outwar.com/images/items/reesescups.png width=20px height=20px>`
if (reeses == null)
extrapot += `<img src=https://torax.outwar.com/images/items/reesescups.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (mm != null)
extrapot += `<img src=https://torax.outwar.com/images/items/mm.png width=20px height=20px>`
if (mm == null)
extrapot += `<img src=https://torax.outwar.com/images/items/mm.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (skittle != null)
extrapot += `<img src=https://torax.outwar.com/images/items/skittles.png width=20px height=20px>`
if (skittle == null)
extrapot += `<img src=https://torax.outwar.com/images/items/skittles.png width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`

var powerpot = '';
if (zombie1 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_1.gif width=20px height=20px>`
if (zombie1 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_1.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (zombie2 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_2.gif width=20px height=20px>`
if (zombie2 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_2.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (zombie3 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_3.gif width=20px height=20px>`
if (zombie3 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_3.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (zombie4 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_4.gif width=20px height=20px>`
if (zombie4 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_4.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (zombie5 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_5.gif width=20px height=20px>`
if (zombie5 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_5.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (zombie6 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_6.gif width=20px height=20px>`
if (zombie6 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_6.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (alsayic != null)
powerpot += `<img src=https://torax.outwar.com/images/items/PotionofEA.jpg width=20px height=20px>`
if (alsayic == null)
powerpot += `<img src=https://torax.outwar.com/images/items/PotionofEA.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (sammy != null)
powerpot += `<img src=https://torax.outwar.com/images/pot5.jpg width=20px height=20px>`
if (sammy == null)
powerpot += `<img src=https://torax.outwar.com/images/pot5.jpg width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`
if (pumpkin != null)
powerpot += `<img src=https://torax.outwar.com/images/halloween/PumpkinJuice.gif width=20px height=20px>`
if (pumpkin == null)
powerpot += `<img src=https://torax.outwar.com/images/halloween/PumpkinJuice.gif width=20px height=20px style="filter: grayscale(100%);opacity:15%;">`

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("skills_info.php?suid="+charid+"&id=3009")
   .then(response => response.text())
   .then((response) => {

var ff = response.match(/<b>You have not learned this skill yet<\/b>/i)

var pres = '';
if (ff == null)
pres = "&#10003;"
if (ff == "<b>You have not learned this skill yet</b>")
pres = "<font color=#FF0000>X</font>"

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("profile?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var charclass = response.match(/CHARACTER CLASS.*[\n\r].*Level [0-9]+ (.*)<\/font>/i)

var charclass2 = '';
if (charclass[1] == "Gangster")
charclass2 = "G"
if (charclass[1] == "Monster")
charclass2 = "<font color=#FF0000>M</font>"
if (charclass[1] == "Pop star")
charclass2 = "<font color=#FF0000>P</font>"

var crew = response.match(/<font size="2">(.*) of <a href="\/crew_profile\?id=.*">(.*)<\/a><\/font>/i)

var strength = response.match(/statspopup\(event,'Strength: (.*)'\)" onmouseout/i)
var strength2 = parseInt(strength[1])

var strength3 = '';
if (strength2 <= 100)
strength3 = "<font color=#FF0000>X</font>"
if (strength2 == 100)
strength3 = "&#10003;"

var badge = response.match(/src="(.*)" onclick="window\.location='.*'\)" onmouseout="kill\(\)" alt=".*Badge.*">/i)
var badge2 = '';
if (badge == null)
badge2 = "none"
if (badge != null)
badge2 = "<img src="+badge[1]+" height=25px width=25px>"
var badge3 = response.match(/onmouseover="itempopup\(event,'.*'\)" onmouseout="kill\(\)" alt=".*Badge.*">/i)
var badge4 = '';
if (badge3 == null)
badge4 = "><font color=#D4D4D4>"
if (badge3 != null)
badge4 = badge3

var group = '';
if (crew[1] == "Leader" || crew[1] == "5A" || crew[1] == "5B" || crew[1] == " 5C" || crew[1] == "5D")
group = ""
if (crew[1] != "Leader" && crew[1] != "5A" && crew[1] != "5B" && crew[1] != " 5C" && crew[1] != "5D")
group = "none"

document.querySelector("#content-header-row > table").setAttribute("id","syndscan")

GM_addStyle ( `
#syndscan > tbody > tr:nth-child(`+rownum+`){display: `+group+` !important;}
`);

var booster = response.match(/<img style="border:0px;" src="(.*)" onclick.* Booster.*"/i)
var booster2 = '';
if (booster == null)
booster2 = ""
if (booster != null)
booster2 = "<img src="+booster[1]+" height=25px width=25px>"
var booster3 = response.match(/onmouseover="itempopup\(event,'.*'\)" onmouseout="kill\(\)" alt=".*Booster.*">/i)
var booster4 = '';
if (booster3 == null)
booster4 = "><font color=#D4D4D4>"
if (booster3 != null)
booster4 = booster3

var rage = response.match(/<span class="toolbar_rage">(.*)<\/span>/i)

fetch("ajax_changeroomb?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var room = response.match(/curRoom":"([0-9]+)"/i)
var myRoom = '';
if (parseInt(room[1]) == 39422)
myRoom += ` <img src=https://www.outwar.com/images/mobs/holgorgod.png width=25px height=25px onmouseover="statspopup(event,'HOLGOR')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 39820)
myRoom += ` <img src=https://www.outwar.com/images/mobs/arcongod.png width=25px height=25px onmouseover="statspopup(event,'ARCON')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 41546)
myRoom += ` <img src=https://www.outwar.com/images/mobs/shayargod.png width=25px height=25px onmouseover="statspopup(event,'SHAYAR')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 40313)
myRoom += ` <img src=https://www.outwar.com/images/mobs/firangod.png width=25px height=25px onmouseover="statspopup(event,'FIRAN')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 40828)
myRoom += ` <img src=https://www.outwar.com/images/mobs/kinarkgod.png width=25px height=25px onmouseover="statspopup(event,'KINARK')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 38898)
myRoom += ` <img src=https://www.outwar.com/images/mobs/agnargod.png width=25px height=25px onmouseover="statspopup(event,'AGNAR')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 42546)
myRoom += ` <img src=https://www.outwar.com/images/mobs/valzekdeathgod.png width=25px height=25px onmouseover="statspopup(event,'VAZLEK')" onmouseout="kill\(\)">`
if (parseInt(room[1]) == 37797)
myRoom += ` <img src=https://www.outwar.com/images/mobs/velendgamegod.jpg width=25px height=25px onmouseover="statspopup(event,'THANOX')" onmouseout="kill\(\)">`

fetch("home?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var suppliesAtk = response.match(/<b onmouseover="statspopup\(event,'Attack increase from supplies\.'\)" onmouseout="kill\(\)">ATK From Supplies:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i)
var suppliesHP = response.match(/<b onmouseover="statspopup\(event,'Health increase from supplies\.'\)" onmouseout="kill\(\)">HP From Supplies:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i)

var supplies ='';
if (parseInt(suppliesHP[1]) != 2463 && parseInt(suppliesAtk[1]) != 361)
supplies = "<font color=#FF0000>X</font>"
if (supplies == "")
supplies = "&#10003;"

let menu = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")");

let td8 = document.createElement('td');
td8.innerHTML = "<center>"+myRoom;
insertAfter(td8, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = "<center>"+Math.round(parseInt(rage[1].replace(",",""))/1000)+"k";
insertAfter(td3, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = "<center><a "+booster4+booster2+"</a>";
insertAfter(td2, menu.lastElementChild);

let td9 = document.createElement('td');
td9.innerHTML = "<center><a "+badge4+badge2+"</a>";
insertAfter(td9, menu.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = "<center>"+pres;
insertAfter(td4, menu.lastElementChild);

let td11 = document.createElement('td');
td11.innerHTML = "<center>"+strength3;
insertAfter(td11, menu.lastElementChild);

let td12 = document.createElement('td');
td12.innerHTML = "<center>"+supplies;
insertAfter(td12, menu.lastElementChild);

let td13 = document.createElement('td');
td13.innerHTML = "<center>"+charclass2;
insertAfter(td13, menu.lastElementChild);

let td5 = document.createElement('td');
td5.innerHTML = freepot;
insertAfter(td5, menu.lastElementChild);

let td6 = document.createElement('td');
td6.innerHTML = extrapot;
insertAfter(td6, menu.lastElementChild);

let td7 = document.createElement('td');
td7.innerHTML = powerpot;
insertAfter(td7, menu.lastElementChild);

})})})})})}})}