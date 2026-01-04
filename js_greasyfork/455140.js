// ==UserScript==
// @name         Tools: Cremers
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      1.0
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/455140/Tools%3A%20Cremers.user.js
// @updateURL https://update.greasyfork.org/scripts/455140/Tools%3A%20Cremers.meta.js
// ==/UserScript==

var char1 = document.querySelector("#charselectdropdown > optgroup:nth-child(1) > option:nth-child(1)").innerHTML

if (char1 == "AlphaTwins"){

if (document.URL.indexOf("spawntimeview") != -1 ) {
if (document.querySelector("#content-header-row > form > input[type=submit]") != null){

GM_addStyle ( `
#content-header-row > table{width:700px !important;}
#content-header-row > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td{padding:20px !important;}
#button1,#button2,#button3,#button4,#button5,#button6,#button7,#button8{border:0px !important;box-shadow: 5px 5px 14px #000000,-5px -5px 14px #000000;}
`)

var content = document.querySelector("#content-header-row")
content.innerHTML = `<table class="shortcuts"><tr><td>`+content.innerHTML+`</td></tr>
<tr><td>
<table><tr><td>
<button id='button1' class='button'><img src=/images/mobs/agnargod.png width="150px" height="150px" onmouseover="popup(event,'Agnar')" onmouseout="kill()"></button>
</td><td>
<button id='button2' class='button'><img src=/images/mobs/valzekdeathgod.png width="150px" height="150px" onmouseover="popup(event,'Valzek')" onmouseout="kill()"></button>
</td><td>
<button id='button3' class='button'><img src=/images/mobs/velendgamegod.jpg width="150px" height="150px" onmouseover="popup(event,'Thanox')" onmouseout="kill()"></button>
</td><td>
<button id='button4' class='button'><img src=/images/mobs/kinarkgod.png width="150px" height="150px" onmouseover="popup(event,'Kinark')" onmouseout="kill()"></button>
</td>
</tr><tr><td>
<button id='button5' class='button'><img src=/images/mobs/shayargod.png width="150px" height="150px" onmouseover="popup(event,'Shayar')" onmouseout="kill()"></button>
</td><td>
<button id='button6' class='button'><img src=/images/mobs/firangod.png width="150px" height="150px" onmouseover="popup(event,'Firan')" onmouseout="kill()"></button>
</td><td>
<button id='button7' class='button'><img src=/images/mobs/arcongod.png width="150px" height="150px" onmouseover="popup(event,'Arcon')" onmouseout="kill()"></button>
</td><td>
<button id='button8' class='button'><img src=/images/mobs/holgorgod.png width="150px" height="150px" onmouseover="popup(event,'Holgor')" onmouseout="kill()"></button>
</td></tr></table>
</td></tr></table>`

document.querySelector("#content-header-row > table > tbody > tr:nth-child(1) > td > form > select").setAttribute("id","godlist")

var agnar = document.querySelector("#godlist")
agnar.innerHTML = agnar.innerHTML.replace(`<option value="4789">`,`<option value="4789" id="agnar">`)
var valzek = document.querySelector("#godlist")
valzek.innerHTML = valzek.innerHTML.replace(`<option value="4790">`,`<option value="4790" id="valzek">`)
var thanox = document.querySelector("#godlist")
thanox.innerHTML = thanox.innerHTML.replace(`<option value="4389">`,`<option value="4389" id="thanox">`)
var kinark = document.querySelector("#godlist")
kinark.innerHTML = kinark.innerHTML.replace(`<option value="4787">`,`<option value="4787" id="kinark">`)
var shayar = document.querySelector("#godlist")
shayar.innerHTML = shayar.innerHTML.replace(`<option value="4788">`,`<option value="4788" id="shayar">`)
var firan = document.querySelector("#godlist")
firan.innerHTML = firan.innerHTML.replace(`<option value="4786">`,`<option value="4786" id="firan">`)
var arcon = document.querySelector("#godlist")
arcon.innerHTML = arcon.innerHTML.replace(`<option value="4785">`,`<option value="4785" id="arcon">`)
var holgor = document.querySelector("#godlist")
holgor.innerHTML = holgor.innerHTML.replace(`<option value="4784">`,`<option value="4784" id="holgor">`)

document.getElementById ("button1").addEventListener ("click", Button1, false);
function Button1 (zEvent) {
    document.querySelector("#agnar").setAttribute("selected","true");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
}
document.getElementById ("button2").addEventListener ("click", Button2, false);
function Button2 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").setAttribute("selected","true");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button3").addEventListener ("click", Button3, false);
function Button3 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").setAttribute("selected","true");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
}
document.getElementById ("button4").addEventListener ("click", Button4, false);
function Button4 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").setAttribute("selected","true");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button5").addEventListener ("click", Button5, false);
function Button5 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").setAttribute("selected","true");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button6").addEventListener ("click", Button6, false);
function Button6 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").setAttribute("selected","true");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button7").addEventListener ("click", Button7, false);
function Button7 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").setAttribute("selected","true");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button8").addEventListener ("click", Button8, false);
function Button8 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").setAttribute("selected","true");
                          }
}

var oracleMsg = document.querySelector("#content-header-row").innerHTML.match("You may view the Oracle's prediction in your message center.")
if (oracleMsg != null){

fetch("ow_messagecenter")
   .then(response => response.text())
   .then((response) => {

var msgLink = response.match(/<a href="(view_ow_message\.php\?id=[0-9]+)/i)

window.location.href = msgLink[1]

})}
}

if (document.URL.indexOf("view_ow_message") != -1 ) {
var sender = document.querySelector("#mailbox-inbox").innerHTML.match(/<font color="00FF00">(.*)<\/font>/i)
if (sender[1] == "Outwar Oracle"){
var god = document.querySelector("#mailCollapseTwo > div > p.mail-content.text-left").innerHTML.match(/I have focused my powers on ([a-zA-Z]+)/i)
var time = document.querySelector("#mailCollapseTwo > div > p.mail-content.text-left").innerHTML.match(/[a-zA-Z]+ [0-9]+, [0-9]+, [0-9]+:[0-9]+[a-zA-Z]+ and [a-zA-Z]+ [0-9]+, [0-9]+, [0-9]+:[0-9]+[a-zA-Z]+/i)

GM_addStyle ( `
::selection {
  background: #FFFFFF; color:#1A1C2D;
}
::-moz-selection {
  background: #FFFFFF; color:#1A1C2D;
}
#fname{background:#0F0F0F !important; color:#FFFFFF !important;border:0px solid !important;font-size:24px !important;}
`);

var textbox = document.querySelector("#mailCollapseTwo > div > div.alert.alert-light-warning.border-0.mb-4")
textbox.innerHTML = `<input onClick="this.select();" type="text" size="80" id="fname" name="fname" value="!oracle `+god[1]+` `+time+`">`

}
}
}