// ==UserScript==
// @name         Tools: Syndicate
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      4.0
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/447825/Tools%3A%20Syndicate.user.js
// @updateURL https://update.greasyfork.org/scripts/447825/Tools%3A%20Syndicate.meta.js
// ==/UserScript==

// SETUP

var char1 = document.querySelector("#charselectdropdown > optgroup:nth-child(1) > option:nth-child(1)").innerHTML

if (char1 == "synwtf19"){

GM_addStyle ( `
#sidebar ul.menu-categories li.menu:first-child>.dropdown-toggle{margin-top:8px !important;}
#accordionExample > a,#accordionExample > p:nth-child(13){display:none !important;}
#accordionExample > div.search,#accordionExample > form,#accordionExample > p:nth-child(15){display:none !important;}
#accordionExample{margin-top:10px !important;}
#content-header-row > table > tbody > tr{background: #0F0F0F !important;}
body{background: #202020 !important;}
#sidebar{display:none !important;}
.dropbtn {color: #fff;background: #000;font-size: 12px;padding: 2px 5px;margin-bottom: 0;}
.dropdown {position: relative;display: inline-block;}
.dropdown-content {display: none;position: absolute;background-color: #f1f1f1;min-width: 160px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);z-index: 1;}
.dropdown-content a {color: black;padding: 12px 16px;text-decoration: none;display: block;}
.dropdown-content a:hover {background-color: #ddd;}
.dropdown:hover .dropdown-content {display: block;}
.dropdown:hover .dropbtn {background-color: #3e8e41;}
#container > div.sidebar-wrapper.sidebar-theme{display:none !important;}
`);

var toplinks = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(6)")
toplinks.innerHTML = `

<div class="dropdown">
<button class="dropbtn">SYNDICATE TOOLS</button>
<div class="dropdown-content">
<a href=home>HOME</a>
<a href=world>WORLD</a>
<a href=cast_skills>SKILLS</a>
<a href=purchasepolicy>TOP 15 RAID PREP</a>
<a href=raffle>NEEDS ASSESSMENT</a>
<a href=raidtools>VEILED MOBS AND KEYS</a>
</div>
</div>
`

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

// RAID PREP

if (document.URL.indexOf("purchasepolicy") != -1 ) {

if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

fetch("myaccount.php")
   .then(response => response.text())
   .then((response) => {

var trustees = response.matchAll(/<a target=.*suid=(.*)&serverid=.*">(.*)<\/a>.*[\n\r].*[\n\r].*<td>SYNDICATE<\/td>.*[\n\r].*<td>/g)
var syndChars = Array.from(trustees)

var syndvision = document.querySelector("#content-header-row")

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(1){background:#0F0F0F !important;color:#D4D4D4 !important;}
#content-header-row > table > tbody > tr > td:nth-child(1){display:none !important;}
#content-header-row > table > tbody > tr > td:nth-child(2){display:none !important;}
#content-header-row > table > tbody > tr > td{padding-left:10px !important;padding-right:10px !important;padding-top:5px !important;padding-bottom:5px !important;border:2px SOLID #0F0F0F !important;}
#content-header-row > table > tbody > tr > td > img{border:1px SOLID #454545 !important;margin:1px !important;}
#content-header-row > table > tbody > tr > td > center > img{border:1px SOLID #454545 !important;margin:1px !important;}
#content-header-row > table > tbody > tr{background: #1A1C2D !important;}
body{background: #202020 !important;}
#rightbar{display:none !important;}
#content{width:100% !important;max-width: 100% !important;margin-left:0px !important;}
#content-header-row > table{width:100% !important;}
::selection {background: #FFFFFF; color:#1A1C2D;}
::-moz-selection {background: #FFFFFF; color:#1A1C2D;}
#agneedstext{background:#19172E !important; color:#FFFFFF !important;border:0px solid !important;font-size:14px !important;}
#valneedstext{background:#2D1C1A !important; color:#FFFFFF !important;border:0px solid !important;font-size:14px !important;}
#content > div.footer-wrapper{display:none !important;}
#test > table > tbody > tr > td{padding:10px !important;}
#showagnar {display: none}
#showvalzek {display: none}
#button1,#button2,#button3 {color: #FFFFFF; background: #0F0F0F;padding:10px}
`);

let table = document.createElement('table');
for (let row of syndChars) {
  table.insertRow();
  for (let cell of row) {
  let newCell = table.rows[table.rows.length - 1].insertCell();
  newCell.textContent = cell;
}}

syndvision.innerHTML = `<span id="test"></span><p>`+table.outerHTML


function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);}

let menu = document.querySelector("#content-header-row > table > tbody");

let th = document.createElement('tr');
th.innerHTML = `
<td>X</td><td>X</td>
<td><b>CHAR</b></td>
<td><b><center>ROOM</b></td>
<td><b>CAST SKILLS</b></td>
<td><b>RAGE</b></td>
<td><b><center>BOOST</b></td>
<td><b><center>BD</b></td>
<td><b><center>SKL</b></td>
<td><b><center>CAP</b></td>
<td><b><center>GRD</b></td>
<td><b><center>EQ</b></td>
<td><b><center>STR</b></td>
<td><b><center>SUP</b></td>
<td><b><center>CLS</b></td>
<td><b><center>POTIONS</b></td>
<td><b><center>VALZEK ONLY</b></td>
`
menu.insertBefore(th, menu.firstElementChild);

var charsTable = document.querySelector("#content-header-row > table > tbody");
var charsTableRows = charsTable.rows.length;

var allvalNeeds ='';
var allagNeeds = '';
for (let rownum = 1; rownum < charsTableRows+1; rownum++) {

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=potion")
   .then(response => response.text())
   .then((response) => {

var kix = response.match(/data-itemidqty="([0-9]+)" data-name="Kix Potion"/i)
var amdir = response.match(/data-itemidqty="([0-9]+)" data-name="Potion of Amdir"/i)
var squid = response.match(/data-itemidqty="([0-9]+)" data-name="Squidberry Juice"/i)
var rem = response.match(/data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 10"/i)
var snicker = response.match(/data-itemidqty="([0-9]+)" data-name="Snickers Bar"/i)
var starburst = response.match(/data-itemidqty="([0-9]+)" data-name="Starburst"/i)
var white = response.match(/data-itemidqty="([0-9]+)" data-name="White Vile"/i)
var natas = response.match(/data-itemidqty="([0-9]+)" data-name="Natas Vile"/i)
var arcane = response.match(/data-itemidqty="([0-9]+)" data-name="Arcane Vile"/i)
var fire = response.match(/data-itemidqty="([0-9]+)" data-name="Fire Vile"/i)
var shadow = response.match(/data-itemidqty="([0-9]+)" data-name="Shadow Vile"/i)
var kinetic = response.match(/data-itemidqty="([0-9]+)" data-name="Kinetic Vile"/i)
var star = response.match(/data-itemidqty="([0-9]+)" data-name="Star Power"/i)
var komb = response.match(/data-itemidqty="([0-9]+)" data-name="Kombucha"/i)
var minor = response.match(/data-itemidqty="([0-9]+)" data-name="Minor Chaos Philter"/i)
var major = response.match(/data-itemidqty="([0-9]+)" data-name="Major Chaos Philter"/i)
var madness = response.match(/data-itemidqty="([0-9]+)" data-name="Demonic Madness"/i)
var insanity = response.match(/data-itemidqty="([0-9]+)" data-name="Vial of Insanity"/i)
var bubble = response.match(/data-itemidqty="([0-9]+)" data-name="Bubble Gum"/i)
var kitkat = response.match(/data-itemidqty="([0-9]+)" data-name="Kit Kat Bar"/i)
var tootsie = response.match(/data-itemidqty="([0-9]+)" data-name="Tootsie Pop"/i)
var reeses = response.match(/data-itemidqty="([0-9]+)" data-name="Reeses Peanut Butter Cup"/i)
var skittle = response.match(/data-itemidqty="([0-9]+)" data-name="Skittles"/i)
var zombie1 = response.match(/data-itemidqty="([0-9]+)" data-name="Zombie Potion 1"/i)
var zombie2 = response.match(/data-itemidqty="([0-9]+)" data-name="Zombie Potion 2"/i)
var zombie3 = response.match(/data-itemidqty="([0-9]+)" data-name="Zombie Potion 3"/i)
var zombie4 = response.match(/data-itemidqty="([0-9]+)" data-name="Zombie Potion 4"/i)
var zombie5 = response.match(/data-itemidqty="([0-9]+)" data-name="Zombie Potion 5"/i)
var zombie6 = response.match(/data-itemidqty="([0-9]+)" data-name="Zombie Potion 6"/i)
var alsayic = response.match(/data-itemidqty="([0-9]+)" data-name="Potion of Enraged Alsayic"/i)
var sammy = response.match(/data-itemidqty="([0-9]+)" data-name="Sammy Sosa's Special Sauce"/i)
var pumpkin = response.match(/data-itemidqty="([0-9]+)" data-name="Pumpkin Juice"/i)

var freepot = '';
if (kix != null)
freepot += `<img src=https://torax.outwar.com/images/potion28.jpg width=20px height=20px onmouseover="statspopup(event,'Kix: `+kix[1]+`')" onmouseout="kill\(\)">`
if (kix == null)
freepot += `<img src=https://torax.outwar.com/images/potion28.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (amdir != null)
freepot += `<img src=https://torax.outwar.com/images/items/arelepot.jpg width=20px height=20px onmouseover="statspopup(event,'Amdir: `+amdir[1]+`')" onmouseout="kill\(\)">`
if (amdir == null)
freepot += `<img src=https://torax.outwar.com/images/items/arelepot.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (squid != null)
freepot += `<img src=https://torax.outwar.com/images/items/Item_SquidberryJuice.jpg width=20px height=20px onmouseover="statspopup(event,'Squid: `+squid[1]+`')" onmouseout="kill\(\)">`
if (squid == null)
freepot += `<img src=https://torax.outwar.com/images/items/Item_SquidberryJuice.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (rem != null)
freepot += `<img src=https://torax.outwar.com/images/items/90remnant.png width=20px height=20px onmouseover="statspopup(event,'Rem: `+rem[1]+`')" onmouseout="kill\(\)">`
if (rem == null)
freepot += `<img src=https://torax.outwar.com/images/items/90remnant.png width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (white != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_WhiteVile.jpg width=20px height=20px onmouseover="statspopup(event,'White: `+white[1]+`')" onmouseout="kill\(\)">`
if (white == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_WhiteVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (natas != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_NatasVile.jpg width=20px height=20px onmouseover="statspopup(event,'Natas: `+natas[1]+`')" onmouseout="kill\(\)">`
if (natas == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_NatasVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (arcane != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ArcaneVile.jpg width=20px height=20px onmouseover="statspopup(event,'Arcane: `+arcane[1]+`')" onmouseout="kill\(\)">`
if (arcane == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ArcaneVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (fire != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_FireVile.jpg width=20px height=20px onmouseover="statspopup(event,'Fire: `+fire[1]+`')" onmouseout="kill\(\)">`
if (fire == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_FireVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (shadow != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ShadowVile.jpg width=20px height=20px onmouseover="statspopup(event,'Shadow: `+shadow[1]+`')" onmouseout="kill\(\)">`
if (shadow == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_ShadowVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (kinetic != null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_KineticVile.jpg width=20px height=20px onmouseover="statspopup(event,'Kinetic: `+kinetic[1]+`')" onmouseout="kill\(\)">`
if (kinetic == null)
freepot += `<img src=https://torax.outwar.com/images/items/Pot_KineticVile.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (snicker != null)
freepot += `<img src=https://torax.outwar.com/images/items/snickersbar.png width=20px height=20px onmouseover="statspopup(event,'Snickers: `+snicker[1]+`')" onmouseout="kill\(\)">`
if (snicker == null)
freepot += `<img src=https://torax.outwar.com/images/items/snickersbar.png width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (starburst != null)
freepot += `<img src=https://torax.outwar.com/images/items/starburst.png width=20px height=20px onmouseover="statspopup(event,'Starburst: `+starburst[1]+`')" onmouseout="kill\(\)">`
if (starburst == null)
freepot += `<img src=https://torax.outwar.com/images/items/starburst.png width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (star != null)
freepot += `<img src=https://torax.outwar.com/images/items/starpowerelec.jpg width=20px height=20px onmouseover="statspopup(event,'Starpower: `+star[1]+`')" onmouseout="kill\(\)">`
if (star == null)
freepot += `<img src=https://torax.outwar.com/images/items/starpowerelec.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (minor != null)
freepot += `<img src=https://torax.outwar.com/images/items/itemz91.jpg width=20px height=20px onmouseover="statspopup(event,'Minor: `+minor[1]+`')" onmouseout="kill\(\)">`
if (minor == null)
freepot += `<img src=https://torax.outwar.com/images/items/itemz91.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (insanity != null)
freepot += `<img src=https://torax.outwar.com/images/items/vaultpot1.png width=20px height=20px onmouseover="statspopup(event,'Insanity: `+insanity[1]+`')" onmouseout="kill\(\)">`
if (insanity == null)
freepot += `<img src=https://torax.outwar.com/images/items/vaultpot1.png width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`

if (kinetic != null && shadow != null && fire != null && arcane != null && natas != null && white != null && starburst != null && snicker != null && rem != null && squid != null && amdir != null && kix != null && star != null && minor != null && insanity != null){
const freearr = [parseInt(kinetic[1]), parseInt(shadow[1]), parseInt(fire[1]), parseInt(arcane[1]), parseInt(natas[1]), parseInt(white[1]), parseInt(starburst[1]), parseInt(snicker[1]), parseInt(rem[1]), parseInt(squid[1]), parseInt(amdir[1]), parseInt(kix[1]), parseInt(star[1]), parseInt(minor[1]), parseInt(insanity[1])]
const freemin = Math.min(...freearr)
freepot = `<a onmouseover="statspopup(event,'Kix: `+kix[1]+`<br>Amdir: `+amdir[1]+`<br>Squid: `+squid[1]+`<br>Rem: `+rem[1]+`<br>Snicker: `+snicker[1]+`<br>Starburst: `+starburst[1]+`<br>White: `+white[1]+`<br>Natas: `+natas[1]+`<br>Arcane: `+arcane[1]+`<br>Fire: `+fire[1]+`<br>Shadow: `+shadow[1]+`<br>Kinetic: `+kinetic[1]+`<br>Starpower: `+star[1]+`<br>Minor: `+minor[1]+`<br>Insanity: `+insanity[1]+`')" onmouseout="kill\(\)"><center>READY x`+freemin+`</a>`
}

var powerpot = '';
if (zombie1 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_1.gif width=20px height=20px>`
if (zombie1 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_1.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (zombie2 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_2.gif width=20px height=20px>`
if (zombie2 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_2.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (zombie3 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_3.gif width=20px height=20px>`
if (zombie3 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_3.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (zombie4 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_4.gif width=20px height=20px>`
if (zombie4 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_4.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (zombie5 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_5.gif width=20px height=20px>`
if (zombie5 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_5.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (zombie6 != null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_6.gif width=20px height=20px>`
if (zombie6 == null)
powerpot += `<img src=https://torax.outwar.com/images/items/potion_6.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (major != null)
powerpot += `<img src=https://torax.outwar.com/images/items/itemz82.jpg width=20px height=20px onmouseover="statspopup(event,'Major: `+major[1]+`')" onmouseout="kill\(\)">`
if (major == null)
powerpot += `<img src=https://torax.outwar.com/images/items/itemz82.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (madness != null)
powerpot += `<img src=https://torax.outwar.com/images/items/vaultpot2.png width=20px height=20px>`
if (madness == null)
powerpot += `<img src=https://torax.outwar.com/images/items/vaultpot2.png width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (alsayic != null)
powerpot += `<img src=https://torax.outwar.com/images/items/PotionofEA.jpg width=20px height=20px>`
if (alsayic == null)
powerpot += `<img src=https://torax.outwar.com/images/items/PotionofEA.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (sammy != null)
powerpot += `<img src=https://torax.outwar.com/images/pot5.jpg width=20px height=20px>`
if (sammy == null)
powerpot += `<img src=https://torax.outwar.com/images/pot5.jpg width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (pumpkin != null)
powerpot += `<img src=https://torax.outwar.com/images/halloween/PumpkinJuice.gif width=20px height=20px>`
if (pumpkin == null)
powerpot += `<img src=https://torax.outwar.com/images/halloween/PumpkinJuice.gif width=20px height=20px style="filter: grayscale(100%);opacity:12%;">`
if (major != null && madness != null && zombie1 != null && zombie2 != null && zombie3 != null && zombie4 != null && zombie5 != null && zombie6 != null)
powerpot = `<center>READY`
if (major != null && madness != null && alsayic != null && sammy != null && pumpkin != null && madness != null )
powerpot = `<center>READY`
if (major != null && madness != null && alsayic != null && zombie1 != null && zombie2 != null && zombie3 != null && madness != null)
powerpot = `<center>READY`
if (major != null && madness != null && alsayic != null && zombie4 != null && zombie5 != null && madness != null)
powerpot = `<center>READY`
if (major != null && madness != null && alsayic != null && zombie6 != null && madness != null)
powerpot = `<center>READY`

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("skills_info.php?suid="+charid+"&id=3009")
   .then(response => response.text())
   .then((response) => {

var FFready = response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i)
var FFcharge = response.match(/<b>This skill is recharging\. .* minutes remaining\.<\/b>/i)

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("skills_info.php?suid="+charid+"&id=2")
   .then(response => response.text())
   .then((response) => {

var BFAready = response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i)
var BFAcharge = response.match(/<b>This skill is recharging\. .* minutes remaining\.<\/b>/i)

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("skills_info.php?suid="+charid+"&id=3012")
   .then(response => response.text())
   .then((response) => {

var EPOWERready = response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i)
var EPOWERcharge = response.match(/<b>This skill is recharging\. .* minutes remaining\.<\/b>/i)

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("skills_info.php?suid="+charid+"&id=3006")
   .then(response => response.text())
   .then((response) => {

var EBARRIERready = response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i)
var EBARRIERcharge = response.match(/<b>This skill is recharging\. .* minutes remaining\.<\/b>/i)

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("skills_info.php?suid="+charid+"&id=3025")
   .then(response => response.text())
   .then((response) => {

var EXEready = response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i)
var EXEcharge = response.match(/<b>This skill is recharging\. .* minutes remaining\.<\/b>/i)

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("/crew_capstatus.php?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var capcheck = response.match(/<b>Guardians killed in last 7 days:<\/b> (.*)<\/p>/i)
var capstatus = '';
    if (parseInt(capcheck[1]) < 10)
        capstatus = parseInt(capcheck[1])
    if (parseInt(capcheck[1]) == 10)
        capstatus = "<font color=#FF0000>"+parseInt(capcheck[1])

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("profile?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var FFactive = response.match(/images\/skills\/forcefield\.png/i)
var BFAactive = response.match(/images\/skills\/blessingfromabove\.png/i)
var EPOWERactive = response.match(/images\/skills\/elementalpower\.png/i)
var EBARRIERactive = response.match(/images\/skills\/elementalbarrier\.png/i)
var EXEactive = response.match(/images\/skills\/executioner\.png/i)

var skills = ''
if (FFready != null && BFAready != null && EPOWERready != null && EBARRIERready != null && EXEready != null)
skills = `READY`
if (FFcharge != null || BFAcharge != null || EPOWERcharge != null || EBARRIERcharge != null || EXEcharge != null)
skills = `CHARGING`
if (FFactive != null && BFAactive != null && EPOWERactive != null && EBARRIERactive != null && EXEactive != null && FFready != null && BFAready != null && EPOWERready != null && EBARRIERready != null && EXEready != null)
skills = `CAST<br>READY`
if (FFactive != null && BFAactive != null && EPOWERactive != null && EBARRIERactive != null && EXEactive != null && FFcharge != null || BFAcharge != null || EPOWERcharge != null || EBARRIERcharge != null || EXEcharge != null)
skills = `CAST<br>CHARGING`

var onguard = '';
if (response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/onguard\.png" hspace="2" width="25" height="25" alt="On Guard" onmouseover="popup\(event,'<b>Level 10 On Guard<\/b><br \/>You never tire\. Your strength cannot be stolen in battle\.<br \/>.* left<br>Cast By .*',808080\)" onmouseout="kill\(\)">/i) != null)
onguard = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/onguard\.png" hspace="2" width="25" height="25" alt="On Guard" onmouseover="popup\(event,'<b>Level 10 On Guard<\/b><br \/>You never tire\. Your strength cannot be stolen in battle\.<br \/>.* left<br>Cast By .*',808080\)" onmouseout="kill\(\)">/i)
if (response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/onguard\.png" hspace="2" width="25" height="25" alt="On Guard" onmouseover="popup\(event,'<b>Level 10 On Guard<\/b><br \/>You never tire\. Your strength cannot be stolen in battle\.<br \/>.* left<br>Cast By .*',808080\)" onmouseout="kill\(\)">/i) == null)
onguard = "<font color=#FF0000>X</font>"

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
strength3 = "<font color=#FF0000>"+strength2+"</font>"
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

var items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im)
var items2 = (items.toString().match(/img/g) || []).length
var items3 = '';
if (items2 < 10)
items3 = "<center><font color=#FF0000>"+items2
if (items2 == 10)
items3 = "<center><font color=#D4D4D4>&#10003;"

var group = '';
if (crew[1] == "Group 1")
group = ""
if (crew[1] == "Group 2")
group = ""
if (crew[1] == "Group 3")
group = ""
if (crew[1] == "Group 4")
group = "none"
if (crew[1] == "Group 5")
group = "none"
if (crew[1] == "Group 6")
group = "none"
if (crew[1] == "Group 7")
group = "none"
if (crew[1] == "Group 8")
group = "none"
if (crew[1] == "Group 9")
group = "none"
if (crew[1] == "Group 10")
group = "none"
if (crew[1] == "Welcome, Fresh Meat")
group = "none"

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(`+rownum+`){display:`+group+` !important;}
`);

var booster = response.match(/<img style="border:0px;" src="(.*)" onclick="window\.location='\/itemlink\?id=([0-9]+)&owner=[0-9]+'" ONMOUSEOVER.* Booster.*"/i)
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

var boostercheck = response.match(/Converged Booster/i)
var rage = response.match(/<span class="toolbar_rage">(.*)<\/span>/i)

var boosterid = '';
    if (booster == null)
        boosterid = ""
    if (booster != null)
        boosterid = "?id="+booster[2]

fetch("item_rollover.php"+boosterid)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var boosterscrape = '';
    if (doc.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2)") != null)
        boosterscrape = doc.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2)").innerHTML.replace("<br>Expires<br>","").replace("minutes","").replace("margin:2px;","margin:2px;height:20px;width:20px")
    if (doc.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2)") == null)
        boosterscrape = ""

fetch("ajax_changeroomb?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var room = response.match(/curRoom":"([0-9]+)"/i)
var myRoom = '';
if (parseInt(room[1]) == 39422)
myRoom += " <img src=https://www.outwar.com/images/mobs/holgorgod.png width=35px height=35px>"
if (parseInt(room[1]) == 39820)
myRoom += " <img src=https://www.outwar.com/images/mobs/arcongod.png width=35px height=35px>"
if (parseInt(room[1]) == 41546)
myRoom += " <img src=https://www.outwar.com/images/mobs/shayargod.png width=35px height=35px>"
if (parseInt(room[1]) == 40313)
myRoom += " <img src=https://www.outwar.com/images/mobs/firangod.png width=35px height=35px>"
if (parseInt(room[1]) == 40828)
myRoom += " <img src=https://www.outwar.com/images/mobs/kinarkgod.png width=35px height=35px>"
if (parseInt(room[1]) == 38898)
myRoom += " <img src=https://www.outwar.com/images/mobs/agnargod.png width=35px height=35px>"
if (parseInt(room[1]) == 42546)
myRoom += " <img src=https://www.outwar.com/images/mobs/valzekdeathgod.png width=35px height=35px>"

fetch("home?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var suppliesAtk = response.match(/<b onmouseover="statspopup\(event,'Attack increase from supplies\.'\)" onmouseout="kill\(\)">ATK From Supplies:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i)
var suppliesHP = response.match(/<b onmouseover="statspopup\(event,'Health increase from supplies\.'\)" onmouseout="kill\(\)">HP From Supplies:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i)

var supplies ='';
if (parseInt(suppliesHP[1].replace(",","")) != 2463)
supplies = "<font color=#FF0000>"+Math.round((parseInt(suppliesHP[1].replace(",","")))/2463*100)+"</font>"
if (supplies == "")
supplies = "&#10003;"

fetch("cast_skills?suid="+charid)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const castSkills = doc.querySelector("#basic > div.widget-content.widget-content-area > div:nth-child(1) > div:nth-child(1) > div > div").innerHTML.replaceAll(`width="25" height="25"`,`width="20" height="20"`)

if (group != "none"){

var charname = " \n**"+document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(3)").innerHTML+"**"

var powerpotneeds = '';
if (zombie1 != null && zombie2 != null && zombie3 != null && zombie4 != null && zombie5 != null && zombie6 != null)
powerpotneeds = `READY`
if (alsayic != null && sammy != null && pumpkin != null)
powerpotneeds = `READY`
if (alsayic != null && zombie1 != null && zombie2 != null && zombie3 != null)
powerpotneeds = `READY`
if (alsayic != null && zombie4 != null && zombie5 != null)
powerpotneeds = `READY`
if (alsayic != null && zombie6 != null)
powerpotneeds = `READY`

var valNeeds = '';
if (kix == null || amdir == null || squid == null || rem == null || snicker == null || starburst == null || white == null || star == null || minor == null || major == null || madness == null || insanity == null || powerpotneeds != `READY`

|| (strength2 <= 95)
|| (FFactive != null && BFAactive != null && EPOWERactive != null && EBARRIERactive != null && EXEactive != null && FFcharge != null || BFAcharge != null || EPOWERcharge != null || EBARRIERcharge != null || EXEcharge != null)
|| (FFready == null || BFAready == null || EPOWERready == null || EBARRIERready == null || EXEready == null)
|| (boostercheck == null)
|| (Math.round((parseInt(suppliesHP[1].replace(",","")))/2463*100) < 95)
   ) valNeeds += charname+": "
if (kix == null) valNeeds += ", Kix"
if (amdir == null) valNeeds += ", Amdir"
if (squid == null) valNeeds += ", Squid"
if (rem == null) valNeeds += ", Rem"
if (snicker == null) valNeeds += ", Snicker"
if (starburst == null) valNeeds += ", Starburst"
if (white == null || natas == null || arcane == null || fire == null || shadow == null || kinetic == null) valNeeds += ", Wonderland"
if (star == null) valNeeds += ", Starpower"
if (minor == null) valNeeds += ", Minor"
if (major == null) valNeeds += ", Major"
if (madness == null) valNeeds += ", Madness"
if (insanity == null) valNeeds += ", Insanity"
if (Math.round((parseInt(suppliesHP[1].replace(",","")))/2463*100) < 95) valNeeds += `, Supplies`
if (strength2 <= 95) valNeeds += `, Strength `
if (FFactive != null && BFAactive != null && EPOWERactive != null && EBARRIERactive != null && EXEactive != null && FFcharge != null || BFAcharge != null || EPOWERcharge != null || EBARRIERcharge != null || EXEcharge != null) valNeeds += `Totem `
if (FFready == null || BFAready == null || EPOWERready == null || EBARRIERready == null || EXEready == null) valNeeds += `, Skills`
if (boostercheck == null) valNeeds += `, Booster`
if (powerpotneeds != "READY") valNeeds += `, Power Pots`

var agNeeds = '';
if (kix == null || amdir == null || squid == null || rem == null || snicker == null || starburst == null || white == null || star == null || minor == null || insanity == null
|| (strength2 <= 95)
|| (FFactive != null && BFAactive != null && EPOWERactive != null && EBARRIERactive != null && EXEactive != null && FFcharge != null || BFAcharge != null || EPOWERcharge != null || EBARRIERcharge != null || EXEcharge != null)
|| (FFready == null || BFAready == null || EPOWERready == null || EBARRIERready == null || EXEready == null)
|| (boostercheck == null)
|| (Math.round((parseInt(suppliesHP[1].replace(",","")))/2463*100) < 95)
   ) agNeeds += charname+": "
if (kix == null) agNeeds += ", Kix"
if (amdir == null) agNeeds += ", Amdir"
if (squid == null) agNeeds += ", Squid"
if (rem == null) agNeeds += ", Rem"
if (snicker == null) agNeeds += ", Snicker"
if (starburst == null) agNeeds += ", Starburst"
if (white == null || natas == null || arcane == null || fire == null || shadow == null || kinetic == null) agNeeds += ", Wonderland"
if (star == null) agNeeds += ", Starpower"
if (minor == null) agNeeds += ", Minor"
if (insanity == null) agNeeds += ", Insanity"
if (Math.round((parseInt(suppliesHP[1].replace(",","")))/2463*100) < 95) agNeeds += `, Supplies`
if (strength2 <= 95) agNeeds += `, Strength`
if (FFactive != null && BFAactive != null && EPOWERactive != null && EBARRIERactive != null && EXEactive != null && FFcharge != null || BFAcharge != null || EPOWERcharge != null || EBARRIERcharge != null || EXEcharge != null) agNeeds += `, Totem `
if (FFready == null || BFAready == null || EPOWERready == null || EBARRIERready == null || EXEready == null) agNeeds += `, Skills`
if (boostercheck == null) agNeeds += `, Booster`

}

allagNeeds += agNeeds.replace("undefined","").replace("**: ,","**:");
allvalNeeds += valNeeds.replace("undefined","").replace("**: ,","**:");

var allagNeedsCrew = allagNeeds.replaceAll(",","").split(" ")
const agcnt = {};
for (const num of allagNeedsCrew) {agcnt[num] = agcnt[num] ? agcnt[num] + 1 : 1;}

var agitemNeeds = '';
if (agcnt["Madness"] != undefined) agitemNeeds += `\n Madness: `+agcnt["Madness"]
if (agcnt["Amdir"] != undefined) agitemNeeds += `\n Amdir: `+agcnt["Amdir"]
if (agcnt["Kix"] != undefined) agitemNeeds += `\n Kix: `+agcnt["Kix"]
if (agcnt["Squid"] != undefined) agitemNeeds += `\n Squid: `+agcnt["Squid"]
if (agcnt["Snicker"] != undefined) agitemNeeds += `\n Snicker: `+agcnt["Snicker"]
if (agcnt["Starburst"] != undefined) agitemNeeds += `\n Starburst: `+agcnt["Starburst"]
if (agcnt["Starpower"] != undefined) agitemNeeds += `\n Starpower: `+agcnt["Starpower"]
if (agcnt["Minor"] != undefined) agitemNeeds += `\n Minor: `+agcnt["Minor"]
if (agcnt["Major"] != undefined) agitemNeeds += `\n Major: `+agcnt["Major"]

var allvalNeedsCrew = allvalNeeds.replaceAll(",","").split(" ")
const valcnt = {};
for (const num of allvalNeedsCrew) {valcnt[num] = valcnt[num] ? valcnt[num] + 1 : 1;}

var valitemNeeds = '';
if (valcnt["Madness"] != undefined) valitemNeeds += `\n Madness: `+valcnt["Madness"]
if (valcnt["Amdir"] != undefined) valitemNeeds += `\n Amdir: `+valcnt["Amdir"]
if (valcnt["Kix"] != undefined) valitemNeeds += `\n Kix: `+valcnt["Kix"]
if (valcnt["Squid"] != undefined) valitemNeeds += `\n Squid: `+valcnt["Squid"]
if (valcnt["Snicker"] != undefined) valitemNeeds += `\n Snicker: `+valcnt["Snicker"]
if (valcnt["Starburst"] != undefined) valitemNeeds += `\n Starburst: `+valcnt["Starburst"]
if (valcnt["Starpower"] != undefined) valitemNeeds += `\n Starpower: `+valcnt["Starpower"]
if (valcnt["Minor"] != undefined) valitemNeeds += `\n Minor: `+valcnt["Minor"]
if (valcnt["Major"] != undefined) valitemNeeds += `\n Major: `+valcnt["Major"]

document.querySelector("#test").innerHTML = `<table>
<tr>
<td id="showagnar"><textarea id="agneedstext" class="agneedstext" rows="20" cols="150" onclick="this.focus();this.select()" readonly="readonly">~ Agnar Needs`+allagNeeds+`</textarea></td>
<td id="showagnar"><textarea id="agneedstext" class="agneedstext" rows="20" cols="30" onclick="this.focus();this.select()" readonly="readonly">~ Agnar Needs`+agitemNeeds+`</textarea></td>
<td id="showvalzek"><textarea id="valneedstext" class="valneedstext" rows="20" cols="150" onclick="this.focus();this.select()" readonly="readonly">~ Valzek Needs`+allvalNeeds+`</textarea></td>
<td id="showvalzek"><textarea id="valneedstext" class="valneedstext" rows="20" cols="30" onclick="this.focus();this.select()" readonly="readonly">~ Valzek Needs`+valitemNeeds+`</textarea></td>
</tr></table><p>
<button id='button1' class='button'>SHOW AGNAR LISTS</button>
<button id='button2' class='button'>SHOW VALZEK LISTS</button>
<button id='button3' class='button'>CLOSE LISTS</button>
`;

document.getElementById ("button1").addEventListener (
    "click", Button1, false
);
function Button1 (zEvent) {
GM_addStyle ( `
#showagnar {display: revert}
#showvalzek {display: none}
`);}

document.getElementById ("button2").addEventListener (
    "click", Button2, false
);
function Button2 (zEvent) {
GM_addStyle ( `
#showagnar {display: none}
#showvalzek {display: revert}
`);}

document.getElementById ("button3").addEventListener (
    "click", Button3, false
);
function Button3 (zEvent) {
GM_addStyle ( `
#showagnar {display: none}
#showvalzek {display: none}
`);}

let menu = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")");

let td18 = document.createElement('td');
td18.innerHTML = "<center>"+myRoom;
insertAfter(td18, menu.lastElementChild);

let td8 = document.createElement('td');
td8.innerHTML = castSkills;
insertAfter(td8, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = rage[1];
insertAfter(td3, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = "<center>"+boosterscrape;
insertAfter(td2, menu.lastElementChild);

let td9 = document.createElement('td');
td9.innerHTML = "<center><a "+badge4+badge2+"</a>";
insertAfter(td9, menu.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = "<center>"+skills;
insertAfter(td4, menu.lastElementChild);

let td17 = document.createElement('td');
td17.innerHTML = "<center>"+capstatus;
insertAfter(td17, menu.lastElementChild);

let td14 = document.createElement('td');
td14.innerHTML = "<center>"+onguard;
insertAfter(td14, menu.lastElementChild);

let td10 = document.createElement('td');
td10.innerHTML = items3+"</font>";
insertAfter(td10, menu.lastElementChild);

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
td5.innerHTML = "<center>"+freepot;
insertAfter(td5, menu.lastElementChild);

let td6 = document.createElement('td');
td6.innerHTML = "<center>"+powerpot;
insertAfter(td6, menu.lastElementChild);


})})})})})})})})})})})})}})}

// VEILED KEYS

if (document.URL.indexOf("raidtools") != -1 ) {

if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

fetch("myaccount.php")
   .then(response => response.text())
   .then((response) => {

var trustees = response.matchAll(/<a target=.*suid=(.*)&serverid=.*">(.*)<\/a>.*[\n\r].*[\n\r].*<td>SYNDICATE<\/td>.*[\n\r].*<td>/g)
var syndChars = Array.from(trustees)

var syndvision = document.querySelector("#content-header-row")

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(1){background:#0F0F0F !important;color:#D4D4D4 !important;}
#content-header-row > table > tbody > tr > td:nth-child(1){display:none !important;}
#content-header-row > table > tbody > tr > td:nth-child(2){display:none !important;}
#content-header-row > table > tbody > tr:nth-child(1) > td:nth-child(9){display:none !important;}
#content-header-row > table > tbody > tr:nth-child(1) > td:nth-child(10){display:none !important;}
#content-header-row > table > tbody > tr:nth-child(1) > td:nth-child(11){display:none !important;}
#content-header-row > table > tbody > tr:nth-child(1) > td:nth-child(12){display:none !important;}
#content-header-row > table > tbody > tr:nth-child(1) > td:nth-child(13){display:none !important;}
#content-header-row > table > tbody > tr > td{padding-left:10px !important;padding-right:10px !important;padding-top:5px !important;padding-bottom:5px !important;border:2px SOLID #0F0F0F !important;}
#content-header-row > table > tbody > tr > td > img{border:1px SOLID #454545 !important;margin:1px !important;}
#content-header-row > table > tbody > tr > td > center > img{border:1px SOLID #454545 !important;margin:1px !important;}
#content-header-row > table > tbody > tr{background: #1A1C2D !important;}
body{background: #202020 !important;}
`);

let table = document.createElement('table');
for (let row of syndChars) {
  table.insertRow();
  for (let cell of row) {
  let newCell = table.rows[table.rows.length - 1].insertCell();
  newCell.textContent = cell;
}}

syndvision.innerHTML = "if room image does not display after teleporting, user needs to allow key access via trustee to beastbob4 beastbob5 beastbob6<p>"+table.outerHTML

function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);}

let menu = document.querySelector("#content-header-row > table > tbody");

let th = document.createElement('tr');
th.innerHTML = `
<td>X</td><td>X</td>
<td><b>CHAR</b></td>
<td width=100px><center><b>ROOM</b></td>
<td width=100px><center><b>MOB</b></td>
<td width=100px><center><b>TELE</b></td>
<td width=100px><center><b>IDOL</b></td>
<td width=100px><center><b>KEY</b></td>
`
menu.insertBefore(th, menu.firstElementChild);

var charsTable = document.querySelector("#content-header-row > table > tbody");
var charsTableRows = charsTable.rows.length;

for (let rownum = 1; rownum < charsTableRows+1; rownum++) {

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=quest")
   .then(response => response.text())
   .then((response) => {

var key = '';
if (response.match(/data-name="Veiled Key" data-itemqty=".*" data-itemid/i) != null)
    key = "<img src=https://torax.outwar.com/images/items/veiledkey.png width=55px height=20px>"

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=key")
   .then(response => response.text())
   .then((response) => {

var teleporter = '';
if (response.match(/data-name="Veiled Teleporter" data-itemqty=".*" data-itemid/i) != null)
    teleporter = "<img src=https://torax.outwar.com/images/items/veiledtp.png width=55px height=20px>"

var hide = '';
if (teleporter != "<img src=https://torax.outwar.com/images/items/veiledtp.png width=55px height=20px>")
    hide = "none"

var idol = '';
if (response.match(/data-name="Veiled Idol" data-itemqty=".*" data-itemid/i) != null)
    idol = "<img src=https://torax.outwar.com/images/items/veiledidol.png width=55px height=20px>"

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("ajax_changeroomb?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var mob = response.match(/Veiled Guard/i)
var alive = '';
if (mob != null)
alive = "<img src=http://torax.outwar.com/images/mobs/veiledguard.png height=20px width=55px>"

var roomcheck = response.match(/veiledpassage\.png/i)
var room = '';
if (roomcheck != null)
room = "<img src=https://studiomoxxi.com/moxximod/veiledpassage.webp height=20px width=55px>"

let menu = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")");

let td10 = document.createElement('td');
td10.innerHTML = "<center>"+room;
insertAfter(td10, menu.lastElementChild);

let td8 = document.createElement('td');
td8.innerHTML = "<center>"+alive;
insertAfter(td8, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = "<center>"+teleporter;
insertAfter(td3, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = "<center>"+idol;
insertAfter(td2, menu.lastElementChild);

let td9 = document.createElement('td');
td9.innerHTML = "<center>"+key;
insertAfter(td9, menu.lastElementChild);

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(`+rownum+`){display: `+hide+` !important;}
`);

})})})}})}

// NEEDS ASSESSMENT

if (document.URL.indexOf("raffle") != -1 ) {

if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

fetch("myaccount.php")
   .then(response => response.text())
   .then((response) => {

var trustees = response.matchAll(/<a target=.*suid=(.*)&serverid=.*">(.*)<\/a>.*[\n\r].*[\n\r].*<td>SYNDICATE<\/td>.*[\n\r].*<td>/g)
var syndChars = Array.from(trustees)

var syndvision = document.querySelector("#content-header-row")

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(1){background:#0F0F0F !important;color:#D4D4D4 !important;}
#content-header-row > table > tbody > tr > td:nth-child(1){display:none !important;}
#content-header-row > table > tbody > tr > td:nth-child(2){display:none !important;}
#content-header-row > table > tbody > tr > td{padding-left:10px !important;padding-right:10px !important;padding-top:5px !important;padding-bottom:5px !important;border:2px SOLID #0F0F0F !important;}
#content-header-row > table > tbody > tr > td > img{border:1px SOLID #454545 !important;margin:1px !important;}
#content-header-row > table > tbody > tr > td > center > img{border:1px SOLID #454545 !important;margin:1px !important;}
#content-header-row > table > tbody > tr > td > img{width:30px !important; height: 30px !important;}
#content-header-row > table > tbody > tr:nth-child(1) > td:nth-child(5) > b{font-size:14px !important;}
#rightbar{dislpay:none !important;}
#content-header-row > table{width:100% !important;}
#content{width:100% !important;max-width: 100% !important;margin-left:0px !important;}
#content > div.footer-wrapper{display:none !important;}
#rightbar{display:none !important;}
.button{background:#0F0F0F !important;color:#ffffff !important;padding:10px !important;margin:10px !important;}
`);

let table = document.createElement('table');
for (let row of syndChars) {
  table.insertRow();
  for (let cell of row) {
  let newCell = table.rows[table.rows.length - 1].insertCell();
  newCell.textContent = cell;
}}

syndvision.innerHTML = `<button id='button1' class='button'>SHOW ONLY TOP 15</button> <button id='button2' class='button'>SHOW ONLY TOP 30</button> <button id='button3' class='button'>HIDE TOP 15</button> <button id='button4' class='button'>SHOW ALL ACCOUNTS</button>`
+ `<hr>`+table.outerHTML

document.getElementById ("button1").addEventListener (
    "click", Button1, false
);

function Button1 (zEvent) {
GM_addStyle ( `
.none {display:none !important;}
.t30 {display:none !important;}
.t15 {display:revert !important;}
`);
}

document.getElementById ("button2").addEventListener (
    "click", Button2, false
);

function Button2 (zEvent) {
GM_addStyle ( `
.none {display:none !important;}
.t15 {display:none !important;}
.t30 {display:revert !important;}
`);
}

document.getElementById ("button3").addEventListener (
    "click", Button3, false
);

function Button3 (zEvent) {
GM_addStyle ( `
.none {display:revert !important;}
.t15 {display:none !important;}
.t30 {display:revert !important;}
`);
}

document.getElementById ("button4").addEventListener (
    "click", Button4, false
);

function Button4 (zEvent) {
GM_addStyle ( `
.none {display:revert !important;}
.t30 {display:revert !important;}
.t15 {display:revert !important;}
`);
}

function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);}

let menu = document.querySelector("#content-header-row > table > tbody");

let th = document.createElement('tr');
th.innerHTML = `
<td>X</td><td>X</td>
<td><b>CHAR</b></td>
<td><b>GROUP</b></td>
<td width=380px><center><b>EQUIPMENT</b></td>
<td><b><font size=1><center>REPS<br>NEEDED</b></td>
<td><b><font size=1><center>ORES<br>NEEDED</b></td>
<td><b><font size=1><center>BOONS<br>NEEDED</b></td>
<td><b><font size=1><center>VORTEX<br>NEEDED</b></td>
<td><b><font size=1><center>GLYPH<br>NEEDED</b></td>
<td><b><center>MISSING ARTIFACTS</b></td>
`
menu.insertBefore(th, menu.firstElementChild);

var charsTable = document.querySelector("#content-header-row > table > tbody");
var charsTableRows = charsTable.rows.length;

for (let rownum = 2; rownum < (charsTableRows+1); rownum++) {

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=quest")
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const artifacts = doc.querySelector("body").innerHTML

var chaosore = artifacts.match(/data-name="Chaos Ore" data-itemqty="(.*)" data-itemid="6003"/i)
var chaosgem2 = '';
    if (chaosore == null)
        chaosgem2 = 0
    if (chaosore != null)
        chaosgem2 = parseInt(chaosore[1])
var badgereps = artifacts.match(/data-name="Badge Reputation" data-itemqty="(.*)" data-itemid="5607"/i)
var badgereps2 = '';
    if (badgereps == null)
        badgereps2 = 0
    if (badgereps != null)
        badgereps2 = parseInt(badgereps[1])

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("profile?suid="+charid)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const slayer = doc.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-8.col-md-7 > div > div:nth-child(5) > div").innerHTML

var missing = '';
    if (slayer.match("Agnar") == null && artifacts.match("Artifact of Agnar") == null && artifacts.match("Lost Artifact of Agnar") == null)missing += "Agnar "
    if (slayer.match("Akkel") == null && artifacts.match("Artifact of Akkel") == null && artifacts.match("Lost Artifact of Akkel") == null)missing += "Akkel "
    if (slayer.match("Amalgamated") == null && artifacts.match("Artifact of Amalgamated") == null && artifacts.match("Lost Artifact of Amalgamated") == null)missing += "Amalgamated "
    if (slayer.match("Anguish") == null && artifacts.match("Artifact of Anguish") == null && artifacts.match("Lost Artifact of Anguish") == null)missing += "Anguish "
    if (slayer.match("Animated Captain") == null && artifacts.match("Artifact of Animated Captain") == null && artifacts.match("Lost Artifact of Animated Captain") == null)missing += "Captain "
    if (slayer.match("Anvilfist") == null && artifacts.match("Artifact of Anvilfist") == null && artifacts.match("Lost Artifact of Anvilfist") == null)missing += "Anvilfist "
    if (slayer.match("Arcon") == null && artifacts.match("Artifact of Arcon") == null && artifacts.match("Lost Artifact of Arcon") == null)missing += "Arcon "
    if (slayer.match("Ariella") == null && artifacts.match("Artifact of Ariella") == null && artifacts.match("Lost Artifact of Ariella") == null)missing += "Ariella "
    if (slayer.match("Ashnar") == null && artifacts.match("Artifact of Ashnar") == null && artifacts.match("Lost Artifact of Ashnar") == null)missing += "Ashnar "
    if (slayer.match("Balerion") == null && artifacts.match("Artifact of Balerion") == null && artifacts.match("Lost Artifact of Balerion") == null)missing += "Balerion "
    if (slayer.match("Banok") == null && artifacts.match("Artifact of Banok") == null && artifacts.match("Lost Artifact of Banok") == null)missing += "Banok "
    if (slayer.match("Baron Mu") == null && artifacts.match("Artifact of Baron Mu") == null && artifacts.match("Lost Artifact of Baron Mu") == null)missing += "Baron Mu "
    if (slayer.match("Beast of Cards") == null && artifacts.match("Artifact of Beast of Cards") == null && artifacts.match("Lost Artifact of Beast of Cards") == null)missing += "Beast "
    if (slayer.match("Bloodchill") == null && artifacts.match("Artifact of Bloodchill") == null && artifacts.match("Lost Artifact of Bloodchill") == null)missing += "Bloodchill "
    if (slayer.match("Bolkor") == null && artifacts.match("Artifact of Bolkor") == null && artifacts.match("Lost Artifact of Bolkor") == null)missing += "Bolkor "
    if (slayer.match("Brutalitar") == null && artifacts.match("Artifact of Brutalitar") == null && artifacts.match("Lost Artifact of Brutalitar") == null)missing += "Brutalitar "
    if (slayer.match("Crane") == null && artifacts.match("Artifact of Crane") == null && artifacts.match("Lost Artifact of Crane") == null)missing += "Crane "
    if (slayer.match("Crantos") == null && artifacts.match("Artifact of Crantos") == null && artifacts.match("Lost Artifact of Crantos") == null)missing += "Crantos "
    if (slayer.match("Crolvak") == null && artifacts.match("Artifact of Crolvak") == null && artifacts.match("Lost Artifact of Crolvak") == null)missing += "Crolvak "
    if (slayer.match("Detox") == null && artifacts.match("Artifact of Detox") == null && artifacts.match("Lost Artifact of Detox") == null)missing += "Detox "
    if (slayer.match("Dexor") == null && artifacts.match("Artifact of Dexor") == null && artifacts.match("Lost Artifact of Dexor") == null)missing += "Dexor "
    if (slayer.match("Dlanod") == null && artifacts.match("Artifact of Dlanod") == null && artifacts.match("Lost Artifact of Dlanod") == null)missing += "Dlanod "
    if (slayer.match("Dragonite") == null && artifacts.match("Artifact of Dragonite") == null && artifacts.match("Lost Artifact of Dragonite") == null)missing += "Dragonite "
    if (slayer.match("Dreg") == null && artifacts.match("Artifact of Dreg Nor") == null && artifacts.match("Lost Artifact of Dreg Nor") == null)missing += "Dreg "
    if (slayer.match("Ebliss") == null && artifacts.match("Artifact of Ebliss") == null && artifacts.match("Lost Artifact of Ebliss") == null)missing += "Ebliss "
    if (slayer.match("Emerald") == null && artifacts.match("Artifact of Emerald Assassin") == null && artifacts.match("Lost Artifact of Emerald Assassin") == null)missing += "Emerald "
    if (slayer.match("Envar") == null && artifacts.match("Artifact of Envar") == null && artifacts.match("Lost Artifact of Envar") == null)missing += "Envar "
    if (slayer.match("Esquin") == null && artifacts.match("Artifact of Esquin") == null && artifacts.match("Lost Artifact of Esquin") == null)missing += "Esquin "
    if (slayer.match("Felroc") == null && artifacts.match("Artifact of Felroc") == null && artifacts.match("Lost Artifact of Felroc") == null)missing += "Felroc "
    if (slayer.match("Firan") == null && artifacts.match("Artifact of Firan") == null && artifacts.match("Lost Artifact of Firan") == null)missing += "Firan "
    if (slayer.match("Freezebreed") == null && artifacts.match("Artifact of Freezebreed") == null && artifacts.match("Lost Artifact of Freezebreed") == null)missing += "Freezebreed "
    if (slayer.match("Ganeshan") == null && artifacts.match("Artifact of Ganeshan") == null && artifacts.match("Lost Artifact of Ganeshan") == null)missing += "Ganeshan "
    if (slayer.match("Ganja") == null && artifacts.match("Artifact of Ganja") == null && artifacts.match("Lost Artifact of Ganja") == null)missing += "Ganja "
    if (slayer.match("Garland") == null && artifacts.match("Artifact of Garland") == null && artifacts.match("Lost Artifact of Garland") == null)missing += "Garland "
    if (slayer.match("Gnorb") == null && artifacts.match("Artifact of Gnorb") == null && artifacts.match("Lost Artifact of Gnorb") == null)missing += "Gnorb "
    if (slayer.match("Gorganus") == null && artifacts.match("Artifact of Gorganus") == null && artifacts.match("Lost Artifact of Gorganus") == null)missing += "Gorganus "
    if (slayer.match("Gregov") == null && artifacts.match("Artifact of Gregov") == null && artifacts.match("Lost Artifact of Gregov") == null)missing += "Gregov "
    if (slayer.match("Grivvek") == null && artifacts.match("Artifact of Grivvek") == null && artifacts.match("Lost Artifact of Grivvek") == null)missing += "Grivvek "
    if (slayer.match("Hackerphage") == null && artifacts.match("Artifact of Hackerphage") == null && artifacts.match("Lost Artifact of Hackerphage") == null)missing += "Hackerphage "
    if (slayer.match("Holgor") == null && artifacts.match("Artifact of Holgor") == null && artifacts.match("Lost Artifact of Holgor") == null)missing += "Holgor "
    if (slayer.match("Howldroid") == null && artifacts.match("Artifact of Howldroid") == null && artifacts.match("Lost Artifact of Howldroid") == null)missing += "Howldroid "
    if (slayer.match("Hyrak") == null && artifacts.match("Artifact of Hyrak") == null && artifacts.match("Lost Artifact of Hyrak") == null)missing += "Hyrak "
    if (slayer.match("Jazzmin") == null && artifacts.match("Artifact of Jazzmin") == null && artifacts.match("Lost Artifact of Jazzmin") == null)missing += "Jazzmin "
    if (slayer.match("Jorun") == null && artifacts.match("Artifact of Jorun") == null && artifacts.match("Lost Artifact of Jorun") == null)missing += "Jorun "
    if (slayer.match("Karvaz") == null && artifacts.match("Artifact of Karvaz") == null && artifacts.match("Lost Artifact of Karvaz") == null)missing += "Karvaz "
    if (slayer.match("Keeper of Nature") == null && artifacts.match("Artifact of Keeper of Nature") == null && artifacts.match("Lost Artifact of Keeper of Nature") == null)missing += "Keeper "
    if (slayer.match("Kinark") == null && artifacts.match("Artifact of Kinark") == null && artifacts.match("Lost Artifact of Kinark") == null)missing += "Kinark "
    if (slayer.match("Kretok") == null && artifacts.match("Artifact of Kretok") == null && artifacts.match("Lost Artifact of Kretok") == null)missing += "Kretok "
    if (slayer.match("Lacuste") == null && artifacts.match("Artifact of Lacuste") == null && artifacts.match("Lost Artifact of Lacuste") == null)missing += "Lacuste "
    if (slayer.match("Lady Chaos") == null && artifacts.match("Artifact of Lady Chaos") == null && artifacts.match("Lost Artifact of Lady Chaos") == null)missing += "Lady Chaos "
    if (slayer.match("Melt Bane") == null && artifacts.match("Artifact of Melt Bane") == null && artifacts.match("Lost Artifact of Melt Bane") == null)missing += "Melt Bane "
    if (slayer.match("Mistress") == null && artifacts.match("Artifact of Mistress") == null && artifacts.match("Lost Artifact of Mistress") == null)missing += "Mistress "
    if (slayer.match("Murderface") == null && artifacts.match("Artifact of Murderface") == null && artifacts.match("Lost Artifact of Murderface") == null)missing += "Murderface "
    if (slayer.match("Murfax") == null && artifacts.match("Artifact of Murfax") == null && artifacts.match("Lost Artifact of Murfax") == null)missing += "Murfax "
    if (slayer.match("Nabak") == null && artifacts.match("Artifact of Nabak") == null && artifacts.match("Lost Artifact of Nabak") == null)missing += "Nabak "
    if (slayer.match("Nafir") == null && artifacts.match("Artifact of Nafir") == null && artifacts.match("Lost Artifact of Nafir") == null)missing += "Nafir "
    if (slayer.match("Nar Zhul") == null && artifacts.match("Artifact of Nar Zhul") == null && artifacts.match("Lost Artifact of Nar Zhul") == null)missing += "Nar Zhul "
    if (slayer.match("Narada") == null && artifacts.match("Artifact of Narada") == null && artifacts.match("Lost Artifact of Narada") == null)missing += "Narada "
    if (slayer.match("Nayark") == null && artifacts.match("Artifact of Nayark") == null && artifacts.match("Lost Artifact of Nayark") == null)missing += "Nayark "
    if (slayer.match("Nessam") == null && artifacts.match("Artifact of Nessam") == null && artifacts.match("Lost Artifact of Nessam") == null)missing += "Nessam "
    if (slayer.match("Neudeus") == null && artifacts.match("Artifact of Emperor Neudeus") == null && artifacts.match("Lost Artifact of Emperor Neudeus") == null)missing += "Neudeus "
    if (slayer.match("Noxious") == null && artifacts.match("Artifact of Noxious") == null && artifacts.match("Lost Artifact of Noxious") == null)missing += "Noxious "
    if (slayer.match("Numerocure") == null && artifacts.match("Artifact of Numerocure") == null && artifacts.match("Lost Artifact of Numerocure") == null)missing += "Numerocure "
    if (slayer.match("Old World Drake") == null && artifacts.match("Artifact of Drake") == null && artifacts.match("Lost Artifact of Drake") == null)missing += "Drake "
    if (slayer.match("Ormsul") == null && artifacts.match("Artifact of Ormsul") == null && artifacts.match("Lost Artifact of Ormsul") == null)missing += "Ormsul "
    if (slayer.match("Pinosis") == null && artifacts.match("Artifact of Pinosis") == null && artifacts.match("Lost Artifact of Pinosis") == null)missing += "Pinosis "
    if (slayer.match("Q-SEC Commander") == null && artifacts.match("Artifact of Q-SEC Commander") == null && artifacts.match("Lost Artifact of Q-SEC Commander") == null)missing += "Q-SEC "
    if (slayer.match("Quiver") == null && artifacts.match("Artifact of Quiver") == null && artifacts.match("Lost Artifact of Quiver") == null)missing += "Quiver "
    if (slayer.match("Raiyar") == null && artifacts.match("Artifact of Raiyar") == null && artifacts.match("Lost Artifact of Raiyar") == null)missing += "Raiyar "
    if (slayer.match("Rancid") == null && artifacts.match("Artifact of Rancid") == null && artifacts.match("Lost Artifact of Rancid") == null)missing += "Rancid "
    if (slayer.match("Rezun") == null && artifacts.match("Artifact of Rezun") == null && artifacts.match("Lost Artifact of Rezun") == null)missing += "Rezun "
    if (slayer.match("Rillax") == null && artifacts.match("Artifact of Rillax") == null && artifacts.match("Lost Artifact of Rillax") == null)missing += "Rillax "
    if (slayer.match("Rotborn") == null && artifacts.match("Artifact of Rotborn") == null && artifacts.match("Lost Artifact of Rotborn") == null)missing += "Rotborn "
    if (slayer.match("Samatha") == null && artifacts.match("Artifact of Samatha") == null && artifacts.match("Lost Artifact of Samatha") == null)missing += "Samatha "
    if (slayer.match("Sarcrina") == null && artifacts.match("Artifact of Sarcrina") == null && artifacts.match("Lost Artifact of Sarcrina") == null)missing += "Sarcrina "
    if (slayer.match("Shadow") == null && artifacts.match("Artifact of Shadow") == null && artifacts.match("Lost Artifact of Shadow") == null)missing += "Shadow "
    if (slayer.match("Shayar") == null && artifacts.match("Artifact of Shayar") == null && artifacts.match("Lost Artifact of Shayar") == null)missing += "Shayar "
    if (slayer.match("Shuk") == null && artifacts.match("Artifact of Shuk") == null && artifacts.match("Lost Artifact of Shuk") == null)missing += "Shuk "
    if (slayer.match("Sibannac") == null && artifacts.match("Artifact of Sibannac") == null && artifacts.match("Lost Artifact of Sibannac") == null)missing += "Sibannac "
    if (slayer.match("Sigil") == null && artifacts.match("Artifact of Sigil") == null && artifacts.match("Lost Artifact of Sigil") == null)missing += "Sigil "
    if (slayer.match("Skarthul") == null && artifacts.match("Artifact of Skarthul") == null && artifacts.match("Lost Artifact of Skarthul") == null)missing += "Skarthul "
    if (slayer.match("Skybrine") == null && artifacts.match("Artifact of Skybrine") == null && artifacts.match("Lost Artifact of Skybrine") == null)missing += "Skybrine "
    if (slayer.match("Slashbrood") == null && artifacts.match("Artifact of Slashbrood") == null && artifacts.match("Lost Artifact of Slashbrood") == null)missing += "Slashbrood "
    if (slayer.match("Smoot") == null && artifacts.match("Artifact of Smoot") == null && artifacts.match("Lost Artifact of Smoot") == null)missing += "Smoot "
    if (slayer.match("Straya") == null && artifacts.match("Artifact of Straya") == null && artifacts.match("Lost Artifact of Straya") == null)missing += "Straya "
    if (slayer.match("Suka") == null && artifacts.match("Artifact of Suka") == null && artifacts.match("Lost Artifact of Suka") == null)missing += "Suka "
    if (slayer.match("Sylvanna") == null && artifacts.match("Artifact of Sylvanna") == null && artifacts.match("Lost Artifact of Sylvanna") == null)missing += "Sylvanna "
    if (slayer.match("Synge") == null && artifacts.match("Artifact of Synge") == null && artifacts.match("Lost Artifact of Synge") == null)missing += "Synge "
    if (slayer.match("Tarkin") == null && artifacts.match("Artifact of Tarkin") == null && artifacts.match("Lost Artifact of Tarkin") == null)missing += "Tarkin "
    if (slayer.match("Terrance") == null && artifacts.match("Artifact of Terrance") == null && artifacts.match("Lost Artifact of Terrance") == null)missing += "Terrance "
    if (slayer.match("Thanox") == null && artifacts.match("Artifact of Thanox") == null && artifacts.match("Lost Artifact of Thanox") == null)missing += "Thanox "
    if (slayer.match("Threk") == null && artifacts.match("Artifact of Threk") == null && artifacts.match("Lost Artifact of Threk") == null)missing += "Threk "
    if (slayer.match("Traxodon") == null && artifacts.match("Artifact of Traxodon") == null && artifacts.match("Lost Artifact of Traxodon") == null)missing += "Traxodon "
    if (slayer.match("Tsort") == null && artifacts.match("Artifact of Tsort") == null && artifacts.match("Lost Artifact of Tsort") == null)missing += "Tsort "
    if (slayer.match("Tylos") == null && artifacts.match("Artifact of Tylos") == null && artifacts.match("Lost Artifact of Tylos") == null)missing += "Tylos "
    if (slayer.match("Valzek") == null && artifacts.match("Artifact of Valzek") == null && artifacts.match("Lost Artifact of Valzek") == null)missing += "Valzek "
    if (slayer.match("Varan") == null && artifacts.match("Artifact of Varan") == null && artifacts.match("Lost Artifact of Varan") == null)missing += "Varan "
    if (slayer.match("Varsanor") == null && artifacts.match("Artifact of Varsanor") == null && artifacts.match("Lost Artifact of Varsanor") == null)missing += "Varsanor "
    if (slayer.match("Villax") == null && artifacts.match("Artifact of Villax") == null && artifacts.match("Lost Artifact of Villax") == null)missing += "Villax "
    if (slayer.match("Viserion") == null && artifacts.match("Artifact of Viserion") == null && artifacts.match("Lost Artifact of Viserion") == null)missing += "Viserion "
    if (slayer.match("Vitkros") == null && artifacts.match("Artifact of Vitkros") == null && artifacts.match("Lost Artifact of Vitkros") == null)missing += "Vitkros "
    if (slayer.match("Volgan") == null && artifacts.match("Artifact of Volgan") == null && artifacts.match("Lost Artifact of Volgan") == null)missing += "Volgan "
    if (slayer.match("Wanhiroeaz") == null && artifacts.match("Artifact of Wanhiroeaz") == null && artifacts.match("Lost Artifact of Wanhiroeaz") == null)missing += "Wanhiroeaz "
    if (slayer.match("Windstrike") == null && artifacts.match("Artifact of Windstrike") == null && artifacts.match("Lost Artifact of Windstrike") == null)missing += "Windstrike "
    if (slayer.match("Xordam") == null && artifacts.match("Artifact of Xordam") == null && artifacts.match("Lost Artifact of Xordam") == null)missing += "Xordam "
    if (slayer.match("Xynak") == null && artifacts.match("Artifact of Xynak") == null && artifacts.match("Lost Artifact of Xynak") == null)missing += "Xynak "
    if (slayer.match("Yirkon") == null && artifacts.match("Artifact of Yirkon") == null && artifacts.match("Lost Artifact of Yirkon") == null)missing += "Yirkon "
    if (slayer.match("Zertan") == null && artifacts.match("Artifact of Zertan") == null && artifacts.match("Lost Artifact of Zertan") == null)missing += "Zertan "
    if (slayer.match("Zikkir") == null && artifacts.match("Artifact of Zikkir") == null && artifacts.match("Lost Artifact of Zikkir") == null)missing += "Zikkir "


var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("profile?suid="+charid)
   .then(response => response.text())
   .then((response) => {


var crew = response.match(/<font size="2">(.*) of <a href="\/crew_profile\?id=.*">(.*)<\/a><\/font>/i)

var cellcolor = '';
if (crew[1] == "Group 1")
cellcolor = "134F5C"
if (crew[1] == "Group 2")
cellcolor = "134F5C"
if (crew[1] == "Group 3")
cellcolor = "134F5C"
if (crew[1] == "Group 4")
cellcolor = ""
if (crew[1] == "Group 5")
cellcolor = ""
if (crew[1] == "Group 6")
cellcolor = ""
if (crew[1] == "Group 7")
cellcolor = ""
if (crew[1] == "Group 8")
cellcolor = "333333"
if (crew[1] == "Group 9")
cellcolor = "333333"
if (crew[1] == "Group 10")
cellcolor = "333333"
if (crew[1] == "Welcome, Fresh Meat")
cellcolor = "333333"

var group = '';
if (crew[1] == "Group 1")
group = "T15"
if (crew[1] == "Group 2")
group = "T15"
if (crew[1] == "Group 3")
group = "T15"
if (crew[1] == "Group 4")
group = "T30"
if (crew[1] == "Group 5")
group = "T30"
if (crew[1] == "Group 6")
group = "T30"
if (crew[1] == "Group 7")
group = "T30"
if (crew[1] == "Group 8")
group = "NONE"
if (crew[1] == "Group 9")
group = "NONE"
if (crew[1] == "Group 10")
group = "NONE"
if (crew[1] == "Welcome, Fresh Meat")
group = "NONE"

if (crew[1] == "Group 1"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t15")}
if (crew[1] == "Group 2"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t15")}
if (crew[1] == "Group 3"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t15")}
if (crew[1] == "Group 4"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t30")}
if (crew[1] == "Group 5"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t30")}
if (crew[1] == "Group 6"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t30")}
if (crew[1] == "Group 7"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "t30")}
if (crew[1] == "Group 8"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "none")}
if (crew[1] == "Group 9"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "none")}
if (crew[1] == "Group 10"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "none")}
if (crew[1] == "Welcome, Fresh Meat"){
document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")").setAttribute("class", "none")}

var items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*).*[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)/im)
var core = items[1]
var head = items[2]
var neck = items[3]
var weapon = items[4]
var body = items[5]
var shield = items[6]
var belt = items[7]
var pants = items[8]
var ring = items[9]
var foot = items[10]
var gem = items[11].toString().match(/alt="(.*)"/i)
var rune = items[12].toString().replace(/<img style="border:0px;" src="http:\/\/torax\.outwar\.com\/images\/items\/.*" onclick="window\.location='\/itemlink\?id=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt="/i,"").replace(/"> <\/div>/i,"")
var orbs = items[13].toString().match(/<img style="border:0px;" src="http:\/\/torax\.outwar\.com\/images\/items\/(.*)\..*" onclick="window\.location='\/itemlink\?id=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt=".*"><img style="border:0px;" src="http:\/\/torax\.outwar\.com\/images\/items\/(.*)\..*" onclick="window\.location='\/itemlink\?id=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt=".*"><img style="border:0px;" src="http:\/\/torax\.outwar\.com\/images\/items\/(.*)\..*" onclick="window\.location='\/itemlink\?id=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt=".*"> <\/div>/i)
var orb1 = parseInt(orbs[1].replace("vaultorb","").replace("a","").replace("b","").replace("c",""))
var orb2 = parseInt(orbs[2].replace("vaultorb","").replace("a","").replace("b","").replace("c",""))
var orb3 = parseInt(orbs[3].replace("vaultorb","").replace("a","").replace("b","").replace("c",""))
var badge = items[14].toString().match(/alt="(.*)"/i)

var badge2 = '';
    if (badge[1] == "Badge of Absolution")
        badge2 = "<img src=http://torax.outwar.com/images/items/badge26a.gif height=25px width=25px>"
    if (badge[1] == "Badge Level 25")
        badge2 = "<img src=http://torax.outwar.com/images/items/badge25.gif height=25px width=25px>"
    if (badge[1] == "Badge Level 24")
        badge2 = 15-badgereps2
    if (badge[1] == "Badge Level 23")
        badge2 = 30-badgereps2
    if (badge[1] == "Badge Level 22")
        badge2 = 45-badgereps2
    if (badge[1] == "Badge Level 21")
        badge2 = 60-badgereps2
    if (badge[1] == "Badge Level 20")
        badge2 = 75-badgereps2
    if (badge[1] == "Badge Level 19")
        badge2 = 90-badgereps2
    if (badge[1] == "Badge Level 18")
        badge2 = 105-badgereps2
    if (badge[1] == "Badge Level 17")
        badge2 = 120-badgereps2
    if (badge[1] == "Badge Level 16")
        badge2 = 135-badgereps2
    if (badge[1] == "Badge Level 15")
        badge2 = 150-badgereps2
    if (badge[1] == "Badge Level 14")
        badge2 = 165-badgereps2
    if (badge[1] == "Badge Level 13")
        badge2 = 180-badgereps2
    if (badge[1] == "Badge Level 12")
        badge2 = 195-badgereps2
    if (badge[1] == "Badge Level 11")
        badge2 = 210-badgereps2
    if (badge[1] == "Badge Level 10")
        badge2 = 225-badgereps2
    if (badge[1] == "Badge Level 9")
        badge2 = 240-badgereps2
    if (badge[1] == "Badge Level 8")
        badge2 = 255-badgereps2
    if (badge[1] == "Badge Level 7")
        badge2 = 270-badgereps2
    if (badge[1] == "Badge Level 6")
        badge2 = 285-badgereps2
    if (badge[1] == "Badge Level 5")
        badge2 = 300-badgereps2
    if (badge[1] == "Badge Level 4")
        badge2 = 315-badgereps2
    if (badge[1] == "Badge Level 3")
        badge2 = 330-badgereps2
    if (badge[1] == "Badge Level 1")
        badge2 = 345-badgereps2
    if (badge[1] == "Badge Level 2")
        badge2 = 360-badgereps2

var chaosgem = '';
    if (gem[1] == "Claw of Chaos")
    chaosgem = "<img src=http://torax.outwar.com/images/items/chaosgem10.gif height=25px width=25px>"
    if (gem[1] == "Embedded Chaos Gem")
    chaosgem = 4-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 8")
    chaosgem = 7-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 7")
    chaosgem = 9-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 6")
    chaosgem = 11-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 5")
    chaosgem = 13-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 4")
    chaosgem = 15-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 3")
    chaosgem = 17-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 2")
    chaosgem = 19-chaosgem2
    if (gem[1] == "Flawless Chaos Gem 1")
    chaosgem = 21-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 8")
    chaosgem = 23-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 7")
    chaosgem = 24-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 6")
    chaosgem = 25-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 5")
    chaosgem = 26-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 4")
    chaosgem = 27-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 3")
    chaosgem = 28-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 2")
    chaosgem = 29-chaosgem2
    if (gem[1] == "Lucid Chaos Gem 1")
    chaosgem = 30-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 8")
    chaosgem = 31-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 7")
    chaosgem = 32-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 6")
    chaosgem = 33-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 5")
    chaosgem = 34-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 4")
    chaosgem = 35-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 3")
    chaosgem = 36-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 2")
    chaosgem = 37-chaosgem2
    if (gem[1] == "Smooth Chaos Gem 1")
    chaosgem = 38-chaosgem2

var veldhelm = '';
    if (head.match(/alt="Helm of the (.*) Veldarian">/i) != null)
        veldhelm = head.match(/alt="Helm of the (.*) Veldarian">/i)
    if (head.match(/alt="Helm of the (.*) Veldarian">/i) == null)
        veldhelm = "XX"
var veldhelm2 = '';
    if (veldhelm[1] == "X")
        veldhelm2 = "NA"
    if (veldhelm[1] == "Chaotic")
        veldhelm2 = "<img src=http://torax.outwar.com/images/items/velepichelmfinal.gif width=25px height=25px>"
    if (veldhelm[1] == "Maniacal")
        veldhelm2 = "1"
    if (veldhelm[1] == "Anarchic")
        veldhelm2 = "2"
    if (veldhelm[1] == "Frenzied")
        veldhelm2 = "3"
    if (veldhelm[1] == "Erratic")
        veldhelm2 = "4"

var glyphneed = '';
if (orb1+orb2+orb3 == 12)
    glyphneed = "<img src=http://torax.outwar.com/images/items/vaultorb4a.gif height=25px width=10px><img src=http://torax.outwar.com/images/items/vaultorb4b.gif height=25px width=10px><img src=http://torax.outwar.com/images/items/vaultorb4c.gif height=25px width=10px>"
if (orb1+orb2+orb3 == 11)
    glyphneed = "1"
if (orb1+orb2+orb3 == 10)
    glyphneed = "2"
if (orb1+orb2+orb3 < 10)
    glyphneed = "3"
if (glyphneed == "")
    glyphneed = "3"

var runelevel = '';
if (rune == "Rune of Creation")
    runelevel = "31"
if (rune == "Empyreal Rune Stage 5")
    runelevel = "30"
if (rune == "Empyreal Rune Stage 4")
    runelevel = "29"
if (rune == "Empyreal Rune Stage 3")
    runelevel = "28"
if (rune == "Empyreal Rune Stage 2")
    runelevel = "27"
if (rune == "Empyreal Rune Stage 1")
    runelevel = "26"
if (rune == "Titanic Rune Stage 5")
    runelevel = "25"
if (rune == "Titanic Rune Stage 4")
    runelevel = "24"
if (rune == "Titanic Rune Stage 3")
    runelevel = "23"
if (rune == "Titanic Rune Stage 2")
    runelevel = "22"
if (rune == "Titanic Rune Stage 1")
    runelevel = "21"
if (rune == "Cosmic Rune Stage 5")
    runelevel = "20"
if (rune == "Cosmic Rune Stage 4")
    runelevel = "19"
if (rune == "Cosmic Rune Stage 3")
    runelevel = "18"
if (rune == "Cosmic Rune Stage 2")
    runelevel = "17"
if (rune == "Cosmic Rune Stage 1")
    runelevel = "16"
if (rune == "Stellar Rune Stage 5")
    runelevel = "15"
if (rune == "Stellar Rune Stage 4")
    runelevel = "14"
if (rune == "Stellar Rune Stage 3")
    runelevel = "13"
if (rune == "Stellar Rune Stage 2")
    runelevel = "12"
if (rune == "Stellar Rune Stage 1")
    runelevel = "11"
if (rune == "Elevated Rune Stage 5")
    runelevel = "10"
if (rune == "Elevated Rune Stage 4")
    runelevel = "9"
if (rune == "Elevated Rune Stage 3")
    runelevel = "8"
if (rune == "Elevated Rune Stage 2")
    runelevel = "7"
if (rune == "Elevated Rune Stage 1")
    runelevel = "6"
if (rune == "Astral Rune Stage 5")
    runelevel = "5"
if (rune == "Astral Rune Stage 4")
    runelevel = "4"
if (rune == "Astral Rune Stage 3")
    runelevel = "3"
if (rune == "Astral Rune Stage 2")
    runelevel = "2"
if (rune == "Astral Rune Stage 1")
    runelevel = "1"
if (runelevel == "")
    runelevel = "1"

var vortexneed = '';
if (parseInt(runelevel) == 31 || parseInt(runelevel) == 30)
    vortexneed = "<img src=http://torax.outwar.com/images/items/astralrunebis.gif height=25px width=25px>"
if (parseInt(runelevel) == 29 || parseInt(runelevel) == 28)
    vortexneed = "1"
if (parseInt(runelevel) == 26 || parseInt(runelevel) == 27)
    vortexneed = "2"
if (parseInt(runelevel) < 26)
    vortexneed = "3"

var menu = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")");

let td0 = document.createElement('td');
td0.innerHTML = group;
insertAfter(td0, menu.lastElementChild);

let td1 = document.createElement('td');
td1.innerHTML = core+head+neck+weapon+body+shield+belt+pants+ring+foot;
insertAfter(td1, menu.lastElementChild);

let td6 = document.createElement('td');
td6.innerHTML = "<center>"+badge2;
insertAfter(td6, menu.lastElementChild);

let td7 = document.createElement('td');
td7.innerHTML = "<center>"+chaosgem;
insertAfter(td7, menu.lastElementChild);


let td5 = document.createElement('td');
td5.innerHTML = "<center>"+veldhelm2;
insertAfter(td5, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = "<center>"+vortexneed;
insertAfter(td2, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = "<center>"+glyphneed;
insertAfter(td3, menu.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = "<center>"+missing;
insertAfter(td4, menu.lastElementChild);

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(`+rownum+`) > td{background: #`+cellcolor+` !important;}
`);

})})})}})}

}