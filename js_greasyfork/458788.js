// ==UserScript==
// @name         Collective Tools alpha
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      1.0
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/458788/Collective%20Tools%20alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/458788/Collective%20Tools%20alpha.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var crewmenu = document.querySelector("#forms");

let li = document.createElement('li');
li.innerHTML = `<a href="claimgift"><font color="#FF0000">COLLECTIVE</font></a>`
insertAfter(li, crewmenu.children[0]);

if (document.URL.indexOf("claimgift") != -1 ) {

const allgods = ["Agnar","Akkel","Amalgamated","Anguish","Animated","Anvilfist","Arcon","Ariella","Ashnar","Balerion","Banok","Baron","Bloodchill","Bolkor","Brutalitar","Chaos","Crane","Crantos","Crolvak","Detox","Dexor","Dlanod","Drake","Dreg","Ebliss","Emerald","Emperor","Envar","Esquin","Felroc","Firan","Freezebreed","Friar","Ganeshan","Ganja","Garland","Gnorb","Gorganus","Gregov","Grivvek","Hackerphage","Holgor","Howldroid","Hyrak","Jade","Jazzmin","Jorun","Karvaz","Kinark","Kretok","Lacuste","Lieutenant","Magus","Melt","Mercenary","Mistress","Mistress","Murderface","Murfax","Nabak","Nafir","Narada","Nature","Nayark","Nessam","Numerocure","Ormsul","Pinosis","Q-Sec","Quiver","Raiyar","Rancid","Rezun","Rillax","RNGesus","Rook","Rotborn","Samatha","Sarcrina","Shadow","Shaik","Shayar","Shuk","Sibannac","Sigil","Skarthul","Skybrine","Slashbrood","Slug","Smoot","Straya","Suka","Sylvanna","Synge","Terrance","Thanox","Threk","Traxodon","Tsort","Tylos","Valzek","Varan","Varsanor","Villax","Viserion","Vitkro","Volgan","Wanhiroeaz","Windstrike","Xordam","Xynak","Yirkon","Zertan","Zhul","Zikkir"]
var allgodsdropdown = '<option value="none">Select God</option>'
for(var i = 0; i < allgods.length; i++) {var opt = allgods[i];var el = document.createElement("option");el.textContent = opt;el.value = opt;allgodsdropdown += el.outerHTML}

GM_addStyle (`
#container{margin-top:140px !important;}
div.widget{margin-top:1rem !important;}
div.column{margin-left:0.5rem !important;margin-right:0.5rem !important;}
div.left{width:350px !important;}
div.middle{width:750px !important;}
div.right{width:250px !important;}
#groups > tbody > tr > td{padding-right:0.25rem;padding-left:0.25rem;}
`)

var camped = `
<table id="groups">
<tr><td>AMALGAMATED</td><td><select id="camp1">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>COL1</td><td><select id="camp2">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>COL2</td><td><select id="camp3">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>COL5</td><td><select id="camp4">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>GORGANUS</td><td><select id="camp5">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>Q-SEC</td><td><select id="camp6">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>TF3</td><td><select id="camp7">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
<tr><td>TF4</td><td><select id="camp8">`+allgodsdropdown+`</select></td><td>REMOVE</td></tr>
</table>
`

setTimeout(function() {
document.querySelector("#camp1").value = "Amalgamated"
document.querySelector("#camp2").value = "Skarthul"
document.querySelector("#camp3").value = "Viserion"
document.querySelector("#camp4").value = "Crolvak"
document.querySelector("#camp5").value = "Gorganus"
document.querySelector("#camp6").value = "Q-Sec"
document.querySelector("#camp7").value = "Esquin"
document.querySelector("#camp8").value = "Karvaz"
},1000)

var uncamped = `
<table id="groups">
<tr><td>COL3</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>JORUN</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>NAYARK</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>VOLGAN</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>YIRKON</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>ZIKKIR</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>ENVAR</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>15AGNAR</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>15COL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>15COLMOD</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>15VAL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>COLTHANOX</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>VEIL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>REZUN</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>RILLAX</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>VILLAX</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>LACUSTE</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>ORMSUL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>SYLVANNA</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>COL4</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TF5</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>ANVILFIST</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>BADGEBITCHES</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>BB5</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TF1</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TF15</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TF2</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TFBAL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TFMURFAX</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TFTHANOX</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>TFVAL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>AKKEL</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>SARCRINA</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>MAGUS</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>NATURE</td><td><select>`+allgodsdropdown+`</select></td></tr>
<tr><td>BANOK</td><td><select>`+allgodsdropdown+`</select></td></tr>
</table>
`

var inframe = `
<table id="groups">
<tr><td>Thanox</td><td>85%</td><td>Ends in 2 day 23 hr 31 min</td><td>January 27, 2023 11:39 AM</td><td></td></tr>
<tr><td>Viserion</td><td>84%</td><td>Ends in 1 day 16 hr 14 min</td><td>January 26, 2023 4:22 AM</td><td>COL2</td></tr>
<tr><td>Skarthul</td><td>93%</td><td>Ends in 1 day 20 hr 24 min</td><td>January 26, 2023 8:32 AM</td><td>TF2</td></tr>
<tr><td>Crolvak</td><td>59%</td><td>Ends in 0 day 21 hr 21 min</td><td>January 25, 2023 9:29 AM</td><td>COL5</td></tr>
<tr><td>Gorganus</td><td>28%</td><td>Ends in 0 day 10 hr 12 min</td><td>January 24, 2023 10:20 PM</td><td>GORGANUS</td></tr>
<tr><td>Q-Sec</td><td>82%</td><td>Ends in 1 day 5 hr 34 min</td><td>January 25, 2023 5:42 PM</td><td>Q-SEC</td></tr>
<tr><td>Amal</td><td>59%</td><td>Ends in 0 day 14 hr 8 min</td><td>January 25, 2023 2:17 AM</td><td>AMAL</td></tr>
</table>
`

var upcoming = `
<table id="groups">
<tr><td>Holgor</td><td> Starts in 0 hr 35 min </td><td>1/24/2023 12:48</td><td></td></tr>
<tr><td>Firan</td><td> Starts in 17 hr 33 min </td><td>1/25/2023 5:45</td><td></td></tr>
<tr><td>Murfax</td><td> Starts in 0 hr 50 min </td><td>1/24/2023 13:02</td><td></td></tr>
<tr><td>Karvaz</td><td> Starts in 0 hr 27 min </td><td>1/24/2023 12:40</td><td>TF4</td></tr>
<tr><td>Esquin</td><td> Starts in 6 hr 48 min </td><td>1/24/2023 19:00</td><td>TF3</td></tr>
<tr><td>Felroc</td><td> Starts in 13 hr 56 min </td><td>1/25/2023 2:08</td><td></td></tr>
<tr><td>Bolkor</td><td> Starts in 14 hr 39 min </td><td>1/25/2023 2:51</td><td></td></tr>
<tr><td>Kretok</td><td> Starts in 15 hr 39 min </td><td>1/25/2023 3:51</td><td></td></tr>
<tr><td>Raiyar</td><td> Starts in 15 hr 59 min </td><td>1/25/2023 4:12</td><td></td></tr>
<tr><td>Xynak</td><td> Starts in 17 hr 51 min </td><td>1/25/2023 6:04</td><td></td></tr>
<tr><td>Nafir</td><td> Starts in 13 hr 39 min </td><td>1/25/2023 1:51</td><td></td></tr>
<tr><td>Lacuste</td><td> Starts in 7 hr 36 min </td><td>1/24/2023 19:48</td><td></td></tr>
<tr><td>Villax</td><td> Starts in 0 hr 11 min </td><td>1/24/2023 12:23</td><td></td></tr>
<tr><td>Rezun</td><td> Starts in 6 hr 7 min </td><td>1/24/2023 18:19</td><td></td></tr>
<tr><td>Banok</td><td> Starts in 7 hr 2 min </td><td>1/24/2023 19:15</td><td></td></tr>
<tr><td>Envar</td><td> Starts in 11 hr 36 min </td><td>1/24/2023 23:48</td><td></td></tr>
<tr><td>Rillax</td><td> Starts in 13 hr 32 min </td><td>1/25/2023 1:45</td><td></td></tr>
<tr><td>Nature</td><td> Starts in 6 hr 43 min </td><td>1/24/2023 18:56</td><td></td></tr>
<tr><td>Nayark</td><td> Starts in 19 hr 12 min </td><td>1/25/2023 7:24</td><td></td></tr>
<tr><td>Sarcrina</td><td> Starts in 4 hr 47 min </td><td>1/24/2023 16:59</td><td></td></tr>
<tr><td>Magus</td><td> Starts in 7 hr 7 min </td><td>1/24/2023 19:20</td><td></td></tr>
<tr><td>Volgan</td><td> Starts in 13 hr 40 min </td><td>1/25/2023 1:52</td><td></td></tr>
<tr><td>Jorun</td><td> Starts in 14 hr 25 min </td><td>1/25/2023 2:38</td><td></td></tr>
<tr><td>Zikkir</td><td> Starts in 16 hr 19 min </td><td>1/25/2023 4:31</td><td></td></tr>
</table>
`

var oracles = ``
var allgroups = `
<table id="groups">
<tr><td>COL3</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>AMALGAMATED</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>JORUN</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>NAYARK</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>VOLGAN</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>YIRKON</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>ZIKKIR</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>ENVAR</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>15AGNAR</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>15COL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>15COLMOD</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>15VAL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>COL5</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>COLTHANOX</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>VEIL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>COL2</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>REZUN</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>RILLAX</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>VILLAX</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TF3</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>LACUSTE</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>ORMSUL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>SYLVANNA</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>COL4</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TF4</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TF5</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>ANVILFIST</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>GORGANUS</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>Q-SEC</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>BADGEBITCHES</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>BB5</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TF1</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TF15</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TF2</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TFBAL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TFMURFAX</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TFTHANOX</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>TFVAL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>AKKEL</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>SARCRINA</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>MAGUS</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>NATURE</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>BANOK</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
<tr><td>COL1</td><td>VIEW</td><td>EDIT</td><td>DELETE</td></tr>
</table>
`

document.querySelector("#container").innerHTML = `

<div class="row justify-content-center" id="content-header-row">
<div class="column left">
<div class="widget"><h4>CAMPED GROUPS</h4>`+camped+`</div>
<div class="widget"><h4>UNCAMPED GROUPS</h4>`+uncamped+`</div>
<div class="widget"><h4>ALL GROUPS</h4>`+allgroups+`</div>
</div>
<div class="column middle">
<div class="widget"><h4>IN FRAME</h4>`+inframe+`</div>
<div class="widget"><h4>UPCOMING 24</h4>`+upcoming+`</div>
</div>
<div class="column right">
<div class="widget"><h4>ORACLES</h4>`+oracles+`</div>
<div class="widget"><h4>BADGE NEEDS</h4></div>
<div class="widget"><h4>SLAYER NEEDS</h4></div>
</div>
</div>
`

}