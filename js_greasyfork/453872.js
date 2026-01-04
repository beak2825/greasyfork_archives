// ==UserScript==
// @name         Tools: Veiled Mobs
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      1.2
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/453872/Tools%3A%20Veiled%20Mobs.user.js
// @updateURL https://update.greasyfork.org/scripts/453872/Tools%3A%20Veiled%20Mobs.meta.js
// ==/UserScript==

fetch("crew_profile")
.then(res => res.text())
.then((responseText) => {
const doc = new DOMParser().parseFromString(responseText, 'text/html');
const xxx = doc.querySelector("#content-header-row > div:nth-child(5) > div > h2").innerHTML
if (xxx == "SYNDICATE"){
fetch("mob_search.php?target=5301")
.then (response => response.text())
.then((response) => {
var check = '';
if (response.match(/Error, could not find mob from here./i) != null){
check = "dead"}
if (response.match(/Quest help activated!/i) != null){
check = "alive"}
if (check == "alive"){
function insertBefore(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}
var menu = document.querySelector("#accordionExample");
let raffle = document.createElement('li');
raffle.setAttribute("class","nav-item dropdown notification-dropdown hide-on-mob")
raffle.innerHTML = `
<div id="veiled"><button id='button1' class='button'>
<img border="0" src="https://torax.outwar.com/images/mobs/veiledguard.png" height="100px" width="100px"></button>
</div>`
insertBefore(raffle, menu.lastElementChild);
document.getElementById ("button1").addEventListener("click", Button1, false);
function Button1 (divid) {

fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var veiledID = response.match(/data-name="Veiled Teleporter".*data-iid="([0-9]+)"/i)
    if (veiledID == null) {alert("you do not have the item required")}

fetch('https://torax.outwar.com/ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': veiledID[1]
  })
}).then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });

})}

var roomnum = document.querySelector("#roomid_display").innerHTML
if (roomnum == "42619"){

fetch("skills_info.php?id=3024")
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const haste = doc.querySelector("body").innerHTML.replaceAll(/<div class=".*">/g,"").replace("Your actions become lightning fast, time speeds up with your every move.","").replace(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i,"")

var column = document.querySelector("#content-header-row > div.col-xl-4.col-lg-12.col-md-12.col-sm-12.col-12.layout-spacing.px-1")
column.innerHTML = "<p style='margin-top:20px'>"+haste+"<span id='cast'></span>"

var charging = haste.match(/recharging/i)

console.log(charging)

if (charging == null){

document.querySelector("#cast").innerHTML = "<p style='margin-top:20px'><button id='button2' class='button'>CAST HASTE</button>"

GM_addStyle ( `
#button2{padding:10px;background:#F7DF13}
`);

document.getElementById ("button2").addEventListener("click", Button2, false);
function Button2 (zEvent) {

fetch('https://torax.outwar.com/cast_skills.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'castskillid': '3024',
    'cast': 'Cast Skill'
  })
}).then(res => res.text())
  .then(res => {
    if (res.match("You just cast Haste") != null) {alert("haste cast")}
  });

}
}

})}

}})}})