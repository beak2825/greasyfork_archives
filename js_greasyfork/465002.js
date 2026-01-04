// ==UserScript==
// @name         Collective God Slayer Scanner
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      0.1
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/465002/Collective%20God%20Slayer%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/465002/Collective%20God%20Slayer%20Scanner.meta.js
// ==/UserScript==

// SETUP

var char = document.querySelector("head").innerHTML.match(/uname=(.*?)'/i)[1]

if (char.match(/Ben[0-9]+/i) != null || char.match(/Col2Bot/i) != null){

// NEEDS ASSESSMENT

if (document.URL.indexOf("world") != -1 ) {

document.querySelector("body > center > div.sub-header-container2").remove()
document.querySelector("body > center > div.header-container.fixed-top").remove()
document.querySelector("body > center > div.sub-header-container").remove()


function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

fetch("myaccount.php")
   .then(response => response.text())
   .then((response) => {

var trustees = response.matchAll(/<a target=.*suid=(.*)&serverid=.*">(.*)<\/a>.*[\n\r].*[\n\r].*<td>Collective<\/td>.*[\n\r].*<td>/g)
var syndChars = Array.from(trustees)

var syndvision = document.querySelector("#content-header-row")

GM_addStyle ( `
#content-header-row > table > tbody > tr:nth-child(1){background:#0F0F0F !important;color:#D4D4D4 !important;}
#sidebar{display:none !important;}
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
#content-header-row > table{background:#000000;position:relative !important;top:-40px !important;}
body{background:#000000 !important;}
#tooltab{display:none !important;}
`);

let table = document.createElement('table');
for (let row of syndChars) {
  table.insertRow();
  for (let cell of row) {
  let newCell = table.rows[table.rows.length - 1].insertCell();
  newCell.textContent = cell;
}}

syndvision.innerHTML = table.outerHTML

function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);}

let menu = document.querySelector("#content-header-row > table > tbody");

let th = document.createElement('tr');
th.innerHTML = `
<td>X</td><td>X</td>
<td><b>CHAR</b></td>
<td width=200px><b>RANK</b></td>
<td><b>LEVEL</b></td>
<td width=200px><center><b>EQUIPMENT</b></td>
<td><b><font size=1><center>REPS<br>NEEDED</b></td>
<td><b><font size=1><center>ORES<br>NEEDED</b></td>
<td><b><font size=1><center>BOONS<br>NEEDED</b></td>
<td><b><font size=1><center>VORTEX<br>NEEDED</b></td>
<td><b><font size=1><center>GLYPH<br>NEEDED</b></td>
<td><b><center>GOD SLAYER NEEDED</b></td>
<td><b><center>GOD SLAYER ARTIFACTS NEEDED</b></td>
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
    var slayer = doc.getElementsByClassName('card')[9].innerHTML

var missingQ = '';
    if (slayer.match("Agnar") == null ){missingQ += "Agnar "}
    if (slayer.match("Akkel") == null ){missingQ += "Akkel "}
    if (slayer.match("Amalgamated") == null ){missingQ += "Amalgamated "}
    if (slayer.match("Anguish") == null ){missingQ += "Anguish "}
    if (slayer.match("Animated Captain") == null ){missingQ += "Captain "}
    if (slayer.match("Anvilfist") == null ){missingQ += "Anvilfist "}
    if (slayer.match("Arcon") == null ){missingQ += "Arcon "}
    if (slayer.match("Ariella") == null ){missingQ += "Ariella "}
    if (slayer.match("Ashnar") == null ){missingQ += "Ashnar "}
    if (slayer.match("Balerion") == null ){missingQ += "Balerion "}
    if (slayer.match("Banok") == null ){missingQ += "Banok "}
    if (slayer.match("Baron Mu") == null ){missingQ += "Baron Mu "}
    if (slayer.match("Beast of Cards") == null ){missingQ += "Beast "}
    if (slayer.match("Bloodchill") == null ){missingQ += "Bloodchill "}
    if (slayer.match("Bolkor") == null ){missingQ += "Bolkor "}
    if (slayer.match("Brutalitar") == null ){missingQ += "Brutalitar "}
    if (slayer.match("Crane") == null ){missingQ += "Crane "}
    if (slayer.match("Crantos") == null ){missingQ += "Crantos "}
    if (slayer.match("Crolvak") == null ){missingQ += "Crolvak "}
    if (slayer.match("Detox") == null ){missingQ += "Detox "}
    if (slayer.match("Dexor") == null ){missingQ += "Dexor "}
    if (slayer.match("Dlanod") == null ){missingQ += "Dlanod "}
    if (slayer.match("Dragonite") == null ){missingQ += "Dragonite "}
    if (slayer.match("Dreg") == null ){missingQ += "Dreg "}
    if (slayer.match("Ebliss") == null ){missingQ += "Ebliss "}
    if (slayer.match("Emerald") == null ){missingQ += "Emerald "}
    if (slayer.match("Envar") == null ){missingQ += "Envar "}
    if (slayer.match("Esquin") == null ){missingQ += "Esquin "}
    if (slayer.match("Felroc") == null ){missingQ += "Felroc "}
    if (slayer.match("Firan") == null ){missingQ += "Firan "}
    if (slayer.match("Freezebreed") == null ){missingQ += "Freezebreed "}
    if (slayer.match("Ganeshan") == null ){missingQ += "Ganeshan "}
    if (slayer.match("Ganja") == null ){missingQ += "Ganja "}
    if (slayer.match("Garland") == null ){missingQ += "Garland "}
    if (slayer.match("Gnorb") == null ){missingQ += "Gnorb "}
    if (slayer.match("Gorganus") == null ){missingQ += "Gorganus "}
    if (slayer.match("Gregov") == null ){missingQ += "Gregov "}
    if (slayer.match("Grivvek") == null ){missingQ += "Grivvek "}
    if (slayer.match("Hackerphage") == null ){missingQ += "Hackerphage "}
    if (slayer.match("Holgor") == null ){missingQ += "Holgor "}
    if (slayer.match("Howldroid") == null ){missingQ += "Howldroid "}
    if (slayer.match("Hyrak") == null ){missingQ += "Hyrak "}
    if (slayer.match("Jazzmin") == null ){missingQ += "Jazzmin "}
    if (slayer.match("Jorun") == null ){missingQ += "Jorun "}
    if (slayer.match("Karvaz") == null ){missingQ += "Karvaz "}
    if (slayer.match("Keeper of Nature") == null ){missingQ += "Keeper "}
    if (slayer.match("Kinark") == null ){missingQ += "Kinark "}
    if (slayer.match("Kretok") == null ){missingQ += "Kretok "}
    if (slayer.match("Lacuste") == null ){missingQ += "Lacuste "}
    if (slayer.match("Lady Chaos") == null ){missingQ += "Lady Chaos "}
    if (slayer.match("Melt Bane") == null ){missingQ += "Melt Bane "}
    if (slayer.match("Mistress") == null ){missingQ += "Mistress "}
    if (slayer.match("Murderface") == null ){missingQ += "Murderface "}
    if (slayer.match("Murfax") == null ){missingQ += "Murfax "}
    if (slayer.match("Nabak") == null ){missingQ += "Nabak "}
    if (slayer.match("Nafir") == null ){missingQ += "Nafir "}
    if (slayer.match("Nar Zhul") == null ){missingQ += "Nar Zhul "}
    if (slayer.match("Narada") == null ){missingQ += "Narada "}
    if (slayer.match("Nayark") == null ){missingQ += "Nayark "}
    if (slayer.match("Nessam") == null ){missingQ += "Nessam "}
    if (slayer.match("Neudeus") == null ){missingQ += "Neudeus "}
    if (slayer.match("Noxious") == null ){missingQ += "Noxious "}
    if (slayer.match("Numerocure") == null ){missingQ += "Numerocure "}
    if (slayer.match("Old World Drake") == null ){missingQ += "Drake "}
    if (slayer.match("Ormsul") == null ){missingQ += "Ormsul "}
    if (slayer.match("Pinosis") == null ){missingQ += "Pinosis "}
    if (slayer.match("Q-SEC Commander") == null ){missingQ += "Q-SEC "}
    if (slayer.match("Quiver") == null ){missingQ += "Quiver "}
    if (slayer.match("Raiyar") == null ){missingQ += "Raiyar "}
    if (slayer.match("Rancid") == null ){missingQ += "Rancid "}
    if (slayer.match("Rezun") == null ){missingQ += "Rezun "}
    if (slayer.match("Rillax") == null ){missingQ += "Rillax "}
    if (slayer.match("Rotborn") == null ){missingQ += "Rotborn "}
    if (slayer.match("Samatha") == null ){missingQ += "Samatha "}
    if (slayer.match("Sarcrina") == null ){missingQ += "Sarcrina "}
    if (slayer.match("Shadow") == null ){missingQ += "Shadow "}
    if (slayer.match("Shayar") == null ){missingQ += "Shayar "}
    if (slayer.match("Shuk") == null ){missingQ += "Shuk "}
    if (slayer.match("Sibannac") == null ){missingQ += "Sibannac "}
    if (slayer.match("Sigil") == null ){missingQ += "Sigil "}
    if (slayer.match("Skarthul") == null ){missingQ += "Skarthul "}
    if (slayer.match("Skybrine") == null ){missingQ += "Skybrine "}
    if (slayer.match("Slashbrood") == null ){missingQ += "Slashbrood "}
    if (slayer.match("Smoot") == null ){missingQ += "Smoot "}
    if (slayer.match("Straya") == null ){missingQ += "Straya "}
    if (slayer.match("Suka") == null ){missingQ += "Suka "}
    if (slayer.match("Sylvanna") == null ){missingQ += "Sylvanna "}
    if (slayer.match("Synge") == null ){missingQ += "Synge "}
    if (slayer.match("Tarkin") == null ){missingQ += "Tarkin "}
    if (slayer.match("Terrance") == null ){missingQ += "Terrance "}
    if (slayer.match("Thanox") == null ){missingQ += "Thanox "}
    if (slayer.match("Threk") == null ){missingQ += "Threk "}
    if (slayer.match("Traxodon") == null ){missingQ += "Traxodon "}
    if (slayer.match("Tsort") == null ){missingQ += "Tsort "}
    if (slayer.match("Tylos") == null ){missingQ += "Tylos "}
    if (slayer.match("Valzek") == null ){missingQ += "Valzek "}
    if (slayer.match("Varan") == null ){missingQ += "Varan "}
    if (slayer.match("Varsanor") == null ){missingQ += "Varsanor "}
    if (slayer.match("Villax") == null ){missingQ += "Villax "}
    if (slayer.match("Viserion") == null ){missingQ += "Viserion "}
    if (slayer.match("Vitkros") == null ){missingQ += "Vitkros "}
    if (slayer.match("Volgan") == null ){missingQ += "Volgan "}
    if (slayer.match("Wanhiroeaz") == null ){missingQ += "Wanhiroeaz "}
    if (slayer.match("Windstrike") == null ){missingQ += "Windstrike "}
    if (slayer.match("Xordam") == null ){missingQ += "Xordam "}
    if (slayer.match("Xynak") == null ){missingQ += "Xynak "}
    if (slayer.match("Yirkon") == null ){missingQ += "Yirkon "}
    if (slayer.match("Zertan") == null ){missingQ += "Zertan "}
    if (slayer.match("Zikkir") == null ){missingQ += "Zikkir "}

var missingA = '';
    if (slayer.match("Agnar") == null && artifacts.match("Artifact of Agnar") == null && artifacts.match("Lost Artifact of Agnar") == null)missingA += "Agnar "
    if (slayer.match("Akkel") == null && artifacts.match("Artifact of Akkel") == null && artifacts.match("Lost Artifact of Akkel") == null)missingA += "Akkel "
    if (slayer.match("Amalgamated") == null && artifacts.match("Artifact of Amalgamated") == null && artifacts.match("Lost Artifact of Amalgamated") == null)missingA += "Amalgamated "
    if (slayer.match("Anguish") == null && artifacts.match("Artifact of Anguish") == null && artifacts.match("Lost Artifact of Anguish") == null)missingA += "Anguish "
    if (slayer.match("Animated Captain") == null && artifacts.match("Artifact of Animated Captain") == null && artifacts.match("Lost Artifact of Animated Captain") == null)missingA += "Captain "
    if (slayer.match("Anvilfist") == null && artifacts.match("Artifact of Anvilfist") == null && artifacts.match("Lost Artifact of Anvilfist") == null)missingA += "Anvilfist "
    if (slayer.match("Arcon") == null && artifacts.match("Artifact of Arcon") == null && artifacts.match("Lost Artifact of Arcon") == null)missingA += "Arcon "
    if (slayer.match("Ariella") == null && artifacts.match("Artifact of Ariella") == null && artifacts.match("Lost Artifact of Ariella") == null)missingA += "Ariella "
    if (slayer.match("Ashnar") == null && artifacts.match("Artifact of Ashnar") == null && artifacts.match("Lost Artifact of Ashnar") == null)missingA += "Ashnar "
    if (slayer.match("Balerion") == null && artifacts.match("Artifact of Balerion") == null && artifacts.match("Lost Artifact of Balerion") == null)missingA += "Balerion "
    if (slayer.match("Banok") == null && artifacts.match("Artifact of Banok") == null && artifacts.match("Lost Artifact of Banok") == null)missingA += "Banok "
    if (slayer.match("Baron Mu") == null && artifacts.match("Artifact of Baron Mu") == null && artifacts.match("Lost Artifact of Baron Mu") == null)missingA += "Baron Mu "
    if (slayer.match("Beast of Cards") == null && artifacts.match("Artifact of Beast of Cards") == null && artifacts.match("Lost Artifact of Beast of Cards") == null)missingA += "Beast "
    if (slayer.match("Bloodchill") == null && artifacts.match("Artifact of Bloodchill") == null && artifacts.match("Lost Artifact of Bloodchill") == null)missingA += "Bloodchill "
    if (slayer.match("Bolkor") == null && artifacts.match("Artifact of Bolkor") == null && artifacts.match("Lost Artifact of Bolkor") == null)missingA += "Bolkor "
    if (slayer.match("Brutalitar") == null && artifacts.match("Artifact of Brutalitar") == null && artifacts.match("Lost Artifact of Brutalitar") == null)missingA += "Brutalitar "
    if (slayer.match("Crane") == null && artifacts.match("Artifact of Crane") == null && artifacts.match("Lost Artifact of Crane") == null)missingA += "Crane "
    if (slayer.match("Crantos") == null && artifacts.match("Artifact of Crantos") == null && artifacts.match("Lost Artifact of Crantos") == null)missingA += "Crantos "
    if (slayer.match("Crolvak") == null && artifacts.match("Artifact of Crolvak") == null && artifacts.match("Lost Artifact of Crolvak") == null)missingA += "Crolvak "
    if (slayer.match("Detox") == null && artifacts.match("Artifact of Detox") == null && artifacts.match("Lost Artifact of Detox") == null)missingA += "Detox "
    if (slayer.match("Dexor") == null && artifacts.match("Artifact of Dexor") == null && artifacts.match("Lost Artifact of Dexor") == null)missingA += "Dexor "
    if (slayer.match("Dlanod") == null && artifacts.match("Artifact of Dlanod") == null && artifacts.match("Lost Artifact of Dlanod") == null)missingA += "Dlanod "
    if (slayer.match("Dragonite") == null && artifacts.match("Artifact of Dragonite") == null && artifacts.match("Lost Artifact of Dragonite") == null)missingA += "Dragonite "
    if (slayer.match("Dreg") == null && artifacts.match("Artifact of Dreg Nor") == null && artifacts.match("Lost Artifact of Dreg Nor") == null)missingA += "Dreg "
    if (slayer.match("Ebliss") == null && artifacts.match("Artifact of Ebliss") == null && artifacts.match("Lost Artifact of Ebliss") == null)missingA += "Ebliss "
    if (slayer.match("Emerald") == null && artifacts.match("Artifact of Emerald Assassin") == null && artifacts.match("Lost Artifact of Emerald Assassin") == null)missingA += "Emerald "
    if (slayer.match("Envar") == null && artifacts.match("Artifact of Envar") == null && artifacts.match("Lost Artifact of Envar") == null)missingA += "Envar "
    if (slayer.match("Esquin") == null && artifacts.match("Artifact of Esquin") == null && artifacts.match("Lost Artifact of Esquin") == null)missingA += "Esquin "
    if (slayer.match("Felroc") == null && artifacts.match("Artifact of Felroc") == null && artifacts.match("Lost Artifact of Felroc") == null)missingA += "Felroc "
    if (slayer.match("Firan") == null && artifacts.match("Artifact of Firan") == null && artifacts.match("Lost Artifact of Firan") == null)missingA += "Firan "
    if (slayer.match("Freezebreed") == null && artifacts.match("Artifact of Freezebreed") == null && artifacts.match("Lost Artifact of Freezebreed") == null)missingA += "Freezebreed "
    if (slayer.match("Ganeshan") == null && artifacts.match("Artifact of Ganeshan") == null && artifacts.match("Lost Artifact of Ganeshan") == null)missingA += "Ganeshan "
    if (slayer.match("Ganja") == null && artifacts.match("Artifact of Ganja") == null && artifacts.match("Lost Artifact of Ganja") == null)missingA += "Ganja "
    if (slayer.match("Garland") == null && artifacts.match("Artifact of Garland") == null && artifacts.match("Lost Artifact of Garland") == null)missingA += "Garland "
    if (slayer.match("Gnorb") == null && artifacts.match("Artifact of Gnorb") == null && artifacts.match("Lost Artifact of Gnorb") == null)missingA += "Gnorb "
    if (slayer.match("Gorganus") == null && artifacts.match("Artifact of Gorganus") == null && artifacts.match("Lost Artifact of Gorganus") == null)missingA += "Gorganus "
    if (slayer.match("Gregov") == null && artifacts.match("Artifact of Gregov") == null && artifacts.match("Lost Artifact of Gregov") == null)missingA += "Gregov "
    if (slayer.match("Grivvek") == null && artifacts.match("Artifact of Grivvek") == null && artifacts.match("Lost Artifact of Grivvek") == null)missingA += "Grivvek "
    if (slayer.match("Hackerphage") == null && artifacts.match("Artifact of Hackerphage") == null && artifacts.match("Lost Artifact of Hackerphage") == null)missingA += "Hackerphage "
    if (slayer.match("Holgor") == null && artifacts.match("Artifact of Holgor") == null && artifacts.match("Lost Artifact of Holgor") == null)missingA += "Holgor "
    if (slayer.match("Howldroid") == null && artifacts.match("Artifact of Howldroid") == null && artifacts.match("Lost Artifact of Howldroid") == null)missingA += "Howldroid "
    if (slayer.match("Hyrak") == null && artifacts.match("Artifact of Hyrak") == null && artifacts.match("Lost Artifact of Hyrak") == null)missingA += "Hyrak "
    if (slayer.match("Jazzmin") == null && artifacts.match("Artifact of Jazzmin") == null && artifacts.match("Lost Artifact of Jazzmin") == null)missingA += "Jazzmin "
    if (slayer.match("Jorun") == null && artifacts.match("Artifact of Jorun") == null && artifacts.match("Lost Artifact of Jorun") == null)missingA += "Jorun "
    if (slayer.match("Karvaz") == null && artifacts.match("Artifact of Karvaz") == null && artifacts.match("Lost Artifact of Karvaz") == null)missingA += "Karvaz "
    if (slayer.match("Keeper of Nature") == null && artifacts.match("Artifact of Keeper of Nature") == null && artifacts.match("Lost Artifact of Keeper of Nature") == null)missingA += "Keeper "
    if (slayer.match("Kinark") == null && artifacts.match("Artifact of Kinark") == null && artifacts.match("Lost Artifact of Kinark") == null)missingA += "Kinark "
    if (slayer.match("Kretok") == null && artifacts.match("Artifact of Kretok") == null && artifacts.match("Lost Artifact of Kretok") == null)missingA += "Kretok "
    if (slayer.match("Lacuste") == null && artifacts.match("Artifact of Lacuste") == null && artifacts.match("Lost Artifact of Lacuste") == null)missingA += "Lacuste "
    if (slayer.match("Lady Chaos") == null && artifacts.match("Artifact of Lady Chaos") == null && artifacts.match("Lost Artifact of Lady Chaos") == null)missingA += "Lady Chaos "
    if (slayer.match("Melt Bane") == null && artifacts.match("Artifact of Melt Bane") == null && artifacts.match("Lost Artifact of Melt Bane") == null)missingA += "Melt Bane "
    if (slayer.match("Mistress") == null && artifacts.match("Artifact of Mistress") == null && artifacts.match("Lost Artifact of Mistress") == null)missingA += "Mistress "
    if (slayer.match("Murderface") == null && artifacts.match("Artifact of Murderface") == null && artifacts.match("Lost Artifact of Murderface") == null)missingA += "Murderface "
    if (slayer.match("Murfax") == null && artifacts.match("Artifact of Murfax") == null && artifacts.match("Lost Artifact of Murfax") == null)missingA += "Murfax "
    if (slayer.match("Nabak") == null && artifacts.match("Artifact of Nabak") == null && artifacts.match("Lost Artifact of Nabak") == null)missingA += "Nabak "
    if (slayer.match("Nafir") == null && artifacts.match("Artifact of Nafir") == null && artifacts.match("Lost Artifact of Nafir") == null)missingA += "Nafir "
    if (slayer.match("Nar Zhul") == null && artifacts.match("Artifact of Nar Zhul") == null && artifacts.match("Lost Artifact of Nar Zhul") == null)missingA += "Nar Zhul "
    if (slayer.match("Narada") == null && artifacts.match("Artifact of Narada") == null && artifacts.match("Lost Artifact of Narada") == null)missingA += "Narada "
    if (slayer.match("Nayark") == null && artifacts.match("Artifact of Nayark") == null && artifacts.match("Lost Artifact of Nayark") == null)missingA += "Nayark "
    if (slayer.match("Nessam") == null && artifacts.match("Artifact of Nessam") == null && artifacts.match("Lost Artifact of Nessam") == null)missingA += "Nessam "
    if (slayer.match("Neudeus") == null && artifacts.match("Artifact of Emperor Neudeus") == null && artifacts.match("Lost Artifact of Emperor Neudeus") == null)missingA += "Neudeus "
    if (slayer.match("Noxious") == null && artifacts.match("Artifact of Noxious") == null && artifacts.match("Lost Artifact of Noxious") == null)missingA += "Noxious "
    if (slayer.match("Numerocure") == null && artifacts.match("Artifact of Numerocure") == null && artifacts.match("Lost Artifact of Numerocure") == null)missingA += "Numerocure "
    if (slayer.match("Old World Drake") == null && artifacts.match("Artifact of Drake") == null && artifacts.match("Lost Artifact of Drake") == null)missingA += "Drake "
    if (slayer.match("Ormsul") == null && artifacts.match("Artifact of Ormsul") == null && artifacts.match("Lost Artifact of Ormsul") == null)missingA += "Ormsul "
    if (slayer.match("Pinosis") == null && artifacts.match("Artifact of Pinosis") == null && artifacts.match("Lost Artifact of Pinosis") == null)missingA += "Pinosis "
    if (slayer.match("Q-SEC Commander") == null && artifacts.match("Artifact of Q-SEC Commander") == null && artifacts.match("Lost Artifact of Q-SEC Commander") == null)missingA += "Q-SEC "
    if (slayer.match("Quiver") == null && artifacts.match("Artifact of Quiver") == null && artifacts.match("Lost Artifact of Quiver") == null)missingA += "Quiver "
    if (slayer.match("Raiyar") == null && artifacts.match("Artifact of Raiyar") == null && artifacts.match("Lost Artifact of Raiyar") == null)missingA += "Raiyar "
    if (slayer.match("Rancid") == null && artifacts.match("Artifact of Rancid") == null && artifacts.match("Lost Artifact of Rancid") == null)missingA += "Rancid "
    if (slayer.match("Rezun") == null && artifacts.match("Artifact of Rezun") == null && artifacts.match("Lost Artifact of Rezun") == null)missingA += "Rezun "
    if (slayer.match("Rillax") == null && artifacts.match("Artifact of Rillax") == null && artifacts.match("Lost Artifact of Rillax") == null)missingA += "Rillax "
    if (slayer.match("Rotborn") == null && artifacts.match("Artifact of Rotborn") == null && artifacts.match("Lost Artifact of Rotborn") == null)missingA += "Rotborn "
    if (slayer.match("Samatha") == null && artifacts.match("Artifact of Samatha") == null && artifacts.match("Lost Artifact of Samatha") == null)missingA += "Samatha "
    if (slayer.match("Sarcrina") == null && artifacts.match("Artifact of Sarcrina") == null && artifacts.match("Lost Artifact of Sarcrina") == null)missingA += "Sarcrina "
    if (slayer.match("Shadow") == null && artifacts.match("Artifact of Shadow") == null && artifacts.match("Lost Artifact of Shadow") == null)missingA += "Shadow "
    if (slayer.match("Shayar") == null && artifacts.match("Artifact of Shayar") == null && artifacts.match("Lost Artifact of Shayar") == null)missingA += "Shayar "
    if (slayer.match("Shuk") == null && artifacts.match("Artifact of Kro Shuk") == null && artifacts.match("Lost Artifact of Kro Shuk") == null)missingA += "Shuk "
    if (slayer.match("Sibannac") == null && artifacts.match("Artifact of Sibannac") == null && artifacts.match("Lost Artifact of Sibannac") == null)missingA += "Sibannac "
    if (slayer.match("Sigil") == null && artifacts.match("Artifact of Sigil") == null && artifacts.match("Lost Artifact of Sigil") == null)missingA += "Sigil "
    if (slayer.match("Skarthul") == null && artifacts.match("Artifact of Skarthul") == null && artifacts.match("Lost Artifact of Skarthul") == null)missingA += "Skarthul "
    if (slayer.match("Skybrine") == null && artifacts.match("Artifact of Skybrine") == null && artifacts.match("Lost Artifact of Skybrine") == null)missingA += "Skybrine "
    if (slayer.match("Slashbrood") == null && artifacts.match("Artifact of Slashbrood") == null && artifacts.match("Lost Artifact of Slashbrood") == null)missingA += "Slashbrood "
    if (slayer.match("Smoot") == null && artifacts.match("Artifact of Smoot") == null && artifacts.match("Lost Artifact of Smoot") == null)missingA += "Smoot "
    if (slayer.match("Straya") == null && artifacts.match("Artifact of Straya") == null && artifacts.match("Lost Artifact of Straya") == null)missingA += "Straya "
    if (slayer.match("Suka") == null && artifacts.match("Artifact of Suka") == null && artifacts.match("Lost Artifact of Suka") == null)missingA += "Suka "
    if (slayer.match("Sylvanna") == null && artifacts.match("Artifact of Sylvanna") == null && artifacts.match("Lost Artifact of Sylvanna") == null)missingA += "Sylvanna "
    if (slayer.match("Synge") == null && artifacts.match("Artifact of Synge") == null && artifacts.match("Lost Artifact of Synge") == null)missingA += "Synge "
    if (slayer.match("Tarkin") == null && artifacts.match("Artifact of Tarkin") == null && artifacts.match("Lost Artifact of Tarkin") == null)missingA += "Tarkin "
    if (slayer.match("Terrance") == null && artifacts.match("Artifact of Terrance") == null && artifacts.match("Lost Artifact of Terrance") == null)missingA += "Terrance "
    if (slayer.match("Thanox") == null && artifacts.match("Artifact of Thanox") == null && artifacts.match("Lost Artifact of Thanox") == null)missingA += "Thanox "
    if (slayer.match("Threk") == null && artifacts.match("Artifact of Threk") == null && artifacts.match("Lost Artifact of Threk") == null)missingA += "Threk "
    if (slayer.match("Traxodon") == null && artifacts.match("Artifact of Traxodon") == null && artifacts.match("Lost Artifact of Traxodon") == null)missingA += "Traxodon "
    if (slayer.match("Tsort") == null && artifacts.match("Artifact of Tsort") == null && artifacts.match("Lost Artifact of Tsort") == null)missingA += "Tsort "
    if (slayer.match("Tylos") == null && artifacts.match("Artifact of Tylos") == null && artifacts.match("Lost Artifact of Tylos") == null)missingA += "Tylos "
    if (slayer.match("Valzek") == null && artifacts.match("Artifact of Valzek") == null && artifacts.match("Lost Artifact of Valzek") == null)missingA += "Valzek "
    if (slayer.match("Varan") == null && artifacts.match("Artifact of Varan") == null && artifacts.match("Lost Artifact of Varan") == null)missingA += "Varan "
    if (slayer.match("Varsanor") == null && artifacts.match("Artifact of Varsanor") == null && artifacts.match("Lost Artifact of Varsanor") == null)missingA += "Varsanor "
    if (slayer.match("Villax") == null && artifacts.match("Artifact of Villax") == null && artifacts.match("Lost Artifact of Villax") == null)missingA += "Villax "
    if (slayer.match("Viserion") == null && artifacts.match("Artifact of Viserion") == null && artifacts.match("Lost Artifact of Viserion") == null)missingA += "Viserion "
    if (slayer.match("Vitkros") == null && artifacts.match("Artifact of Vitkros") == null && artifacts.match("Lost Artifact of Vitkros") == null)missingA += "Vitkros "
    if (slayer.match("Volgan") == null && artifacts.match("Artifact of Volgan") == null && artifacts.match("Lost Artifact of Volgan") == null)missingA += "Volgan "
    if (slayer.match("Wanhiroeaz") == null && artifacts.match("Artifact of Wanhiroeaz") == null && artifacts.match("Lost Artifact of Wanhiroeaz") == null)missingA += "Wanhiroeaz "
    if (slayer.match("Windstrike") == null && artifacts.match("Artifact of Windstrike") == null && artifacts.match("Lost Artifact of Windstrike") == null)missingA += "Windstrike "
    if (slayer.match("Xordam") == null && artifacts.match("Artifact of Xordam") == null && artifacts.match("Lost Artifact of Xordam") == null)missingA += "Xordam "
    if (slayer.match("Xynak") == null && artifacts.match("Artifact of Xynak") == null && artifacts.match("Lost Artifact of Xynak") == null)missingA += "Xynak "
    if (slayer.match("Yirkon") == null && artifacts.match("Artifact of Yirkon") == null && artifacts.match("Lost Artifact of Yirkon") == null)missingA += "Yirkon "
    if (slayer.match("Zertan") == null && artifacts.match("Artifact of Zertan") == null && artifacts.match("Lost Artifact of Zertan") == null)missingA += "Zertan "
    if (slayer.match("Zikkir") == null && artifacts.match("Artifact of Zikkir") == null && artifacts.match("Lost Artifact of Zikkir") == null)missingA += "Zikkir "

var charid = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML

fetch("profile?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var crew = response.match(/<font size="2">(.*) of <a href="\/crew_profile\?id=.*">(.*)<\/a><\/font>/i)

var level = response.match(/class="toolbar_level">([0-9]+)<\/span>/i)[1]
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
var orb1 = ''; if (orbs != null){orb1 = parseInt(orbs[1].replace("vaultorb","").replace("a","").replace("b","").replace("c",""))}
var orb2 = ''; if (orbs != null){orb2 = parseInt(orbs[2].replace("vaultorb","").replace("a","").replace("b","").replace("c",""))}
var orb3 = ''; if (orbs != null){orb3 = parseInt(orbs[3].replace("vaultorb","").replace("a","").replace("b","").replace("c",""))}
var badge = items[14].toString().match(/alt="(.*)"/i)

var badge2 = '';
    if (badge == null){ badge2 = "NA" } else {
    if (badge[1] == "Badge of Absolution"){ badge2 = "<img src=http://torax.outwar.com/images/items/badge26a.gif height=25px width=25px>" }
    if (badge[1] == "Badge Level 25"){ badge2 = "<img src=http://torax.outwar.com/images/items/badge25.gif height=25px width=25px>" }
    if (badge[1] == "Badge Level 24"){ badge2 = 15-badgereps2 }
    if (badge[1] == "Badge Level 23"){ badge2 = 30-badgereps2 }
    if (badge[1] == "Badge Level 22"){ badge2 = 45-badgereps2 }
    if (badge[1] == "Badge Level 21"){ badge2 = 60-badgereps2 }
    if (badge[1] == "Badge Level 20"){ badge2 = 75-badgereps2 }
    if (badge[1] == "Badge Level 19"){ badge2 = 90-badgereps2 }
    if (badge[1] == "Badge Level 18"){ badge2 = 105-badgereps2 }
    if (badge[1] == "Badge Level 17"){ badge2 = 120-badgereps2 }
    if (badge[1] == "Badge Level 16"){ badge2 = 135-badgereps2 }
    if (badge[1] == "Badge Level 15"){ badge2 = 150-badgereps2 }
    if (badge[1] == "Badge Level 14"){ badge2 = 165-badgereps2 }
    if (badge[1] == "Badge Level 13"){ badge2 = 180-badgereps2 }
    if (badge[1] == "Badge Level 12"){ badge2 = 195-badgereps2 }
    if (badge[1] == "Badge Level 11"){ badge2 = 210-badgereps2 }
    if (badge[1] == "Badge Level 10"){ badge2 = 225-badgereps2 }
    if (badge[1] == "Badge Level 9"){ badge2 = 240-badgereps2 }
    if (badge[1] == "Badge Level 8"){ badge2 = 255-badgereps2 }
    if (badge[1] == "Badge Level 7"){ badge2 = 270-badgereps2 }
    if (badge[1] == "Badge Level 6"){ badge2 = 285-badgereps2 }
    if (badge[1] == "Badge Level 5"){ badge2 = 300-badgereps2 }
    if (badge[1] == "Badge Level 4"){ badge2 = 315-badgereps2 }
    if (badge[1] == "Badge Level 3"){ badge2 = 330-badgereps2 }
    if (badge[1] == "Badge Level 2"){ badge2 = 345-badgereps2 }
    if (badge[1] == "Badge Level 1"){ badge2 = 360-badgereps2 }}

var chaosgem = '';
    if (gem == null){ chaosgem = "NA"} else {
    if (gem[1] == "Claw of Chaos"){ chaosgem = "<img src=http://torax.outwar.com/images/items/chaosgem10.gif height=25px width=25px>" }
    if (gem[1] == "Embedded Chaos Gem"){ chaosgem = 4-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 8"){ chaosgem = 7-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 7"){ chaosgem = 9-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 6"){ chaosgem = 11-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 5"){ chaosgem = 13-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 4"){ chaosgem = 15-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 3"){ chaosgem = 17-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 2"){ chaosgem = 19-chaosgem2 }
    if (gem[1] == "Flawless Chaos Gem 1"){ chaosgem = 21-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 8"){ chaosgem = 23-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 7"){ chaosgem = 24-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 6"){ chaosgem = 25-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 5"){ chaosgem = 26-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 4"){ chaosgem = 27-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 3"){ chaosgem = 28-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 2"){ chaosgem = 29-chaosgem2 }
    if (gem[1] == "Lucid Chaos Gem 1"){ chaosgem = 30-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 8"){ chaosgem = 31-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 7"){ chaosgem = 32-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 6"){ chaosgem = 33-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 5"){ chaosgem = 34-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 4"){ chaosgem = 35-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 3"){ chaosgem = 36-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 2"){ chaosgem = 37-chaosgem2 }
    if (gem[1] == "Smooth Chaos Gem 1"){ chaosgem = 38-chaosgem2 }}

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
if (parseInt(runelevel) == 31 || parseInt(runelevel) == 30){ vortexneed = "<img src=http://torax.outwar.com/images/items/astralrunebis.gif height=25px width=25px>" }
if (parseInt(runelevel) == 29 || parseInt(runelevel) == 28){ vortexneed = "1" }
if (parseInt(runelevel) == 26 || parseInt(runelevel) == 27){ vortexneed = "2" }
if (parseInt(runelevel) < 26){ vortexneed = "3" }

var menu = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+")");

let td0 = document.createElement('td');
td0.innerHTML = crew[1];
insertAfter(td0, menu.lastElementChild);

let tdlvl = document.createElement('td');
tdlvl.innerHTML = level;
insertAfter(tdlvl, menu.lastElementChild);

const rank = document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(4)").innerHTML
const lvl = parseInt(document.querySelector("#content-header-row > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5)").innerHTML)
if (lvl <= 89 || rank == "Multis" || rank == "Bot Accounts" || rank == "New Guys"){ GM_addStyle (`#content-header-row > table > tbody > tr:nth-child(`+rownum+`){display:none !important;}`) }

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
td4.innerHTML = "<center>"+missingQ;
insertAfter(td4, menu.lastElementChild);

let td8 = document.createElement('td');
td8.innerHTML = "<center>"+missingA;
insertAfter(td8, menu.lastElementChild);

})})})}})}

}