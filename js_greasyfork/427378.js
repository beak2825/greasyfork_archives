// ==UserScript==
// @name         Gats.io - In-game GUI & texture packs [Read Desc.]
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Texture pack mod made by Vaakir & nitrogem35
// @author       Vaakir youtube & nitrogem35
// @run-at       document-end
// @match        https://gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427378/Gatsio%20-%20In-game%20GUI%20%20texture%20packs%20%5BRead%20Desc%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/427378/Gatsio%20-%20In-game%20GUI%20%20texture%20packs%20%5BRead%20Desc%5D.meta.js
// ==/UserScript==

(function() {

let overlayHTML = `
<link href="https://fonts.googleapis.com/css?family=Orbitron:900" rel="stylesheet"/>
<div id="box">
    <div class="ou" id="box2">
        <p>Color Mod v2</p>
        <label>Crate</label>                <input id="acrate"           type="color"     value="#dfbf9f">
        <label>Long Crate</label>           <input id="alongCrate"       type="color"     value="#bec8dd">
        <label>Crate Border</label>         <input id="acrateborder"     type="color"     value="#808080">
        <label>Long Crate Border</label>    <input id="alongcrateborder" type="color"     value="#808080">
        <label>Player Crate Border</label>   <input id="playercrateborder"type="color"     value="#808080">
        <label>Random Crate Colors</label>  <input id="arandom"          type="checkbox"  value="#0000ff">
        <label>Random Crate Borders</label> <input id="arandom2"         type="checkbox"  value="#0000ff">
        <label>Seizure Mode</label>         <input id="seizure"          type="checkbox"  value="#0000ff">
        <label>Reset To Defaults</label>    <input id="default"          type="checkbox"  value="#0000ff">
    </div>
    <button class="ou" id="accordian">Toggle</button>
</div>
<style>
#box {z-index: 10;position: absolute;bottom: 10vh; left: 10px;}
#box2 {
    display: grid;
    grid-template-columns: auto, auto;

    padding: 5px;
    padding-bottom: 1vh;
}
.ou {
    background-color: #bebebe;
    border: 1px solid whitesmoke;
    box-shadow: 0px 10px 16px 0 rgba(0,0,0,1),
                0 6px 20px 0 rgba(0,0,0,1);
    border-radius: 5px;
    letter-spacing: 3px;

    font-weight: bold;
    font-family: Orbitron;
    color: black;
}
input {width: 60%;}
input:hover {cursor: pointer;}
input:focus {box-shadow: 0 0 10px #9ecaed;}
button {margin-top: 5px;}
p {grid-column: 1/3;text-align: center;}
a {color: black;}
#accordian {width: 15vw;border-radius: 5px;}
label {grid-column: 1/2;padding: 1vh;}
input {grid-column: 2/3;width: 5vw;}
input[type=checkbox] {
    transform: scale(2);
    width: fit-content;
    margin: auto;
    margin-left: 5px;
}

</style>
`
let overlay = document.createElement("div");overlay.innerHTML = overlayHTML;document.body.appendChild(overlay);
function get(x){return document.getElementById(x);}
let acrate=get("acrate"),alongCrate=get("alongCrate"),acrateborder=get("acrateborder"),alongcrateborder=get("alongcrateborder"),aplayercrateborder=get("playercrateborder"),ran=get("arandom"),
ran2=get("arandom2"),seizure=get("seizure"),defaults=get("default");
let loop = undefined;
let defaultColors = ["#dfbf9f","#bec8dd","#808080"]

function rColor(){return rgbToHex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));}
function componentToHex(c) {var hex = c.toString(16);return hex.length == 1 ? "0" + hex : hex;}
function rgbToHex(r, g, b) {return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);}

overlay.onfocus=function(){console.log('1')}
alongCrate.onchange=function(){window.longCrate[0][1][1][3]=this.value;}
acrate.onchange=function(){window.crate[0][1][1][3]=this.value;}
acrateborder.onchange=function(){window.crate[0][0][1][3]=this.value;}
alongcrateborder.onchange=function(){window.longCrate[0][0][1][3]=this.value;}
aplayercrateborder.onchange=function(){window.userCrate[0][0][1][3]=this.value;}
ran.onclick=function() {
    if (this.checked) {
        let c=rColor(), c2=rColor();
        window.crate[0][1][1][3]=c;acrate.value=c;
        window.longCrate[0][1][1][3]=c2;alongCrate.value=c2;
        this.checked = false;
    }
}
ran2.onclick=function() {
    if (this.checked) {
        let c=rColor(), c2=rColor(), c3=rColor();
        window.crate[0][0][1][3]=c;acrateborder.value=c;
        window.longCrate[0][0][1][3]=c2;alongcrateborder.value=c2;
        window.userCrate[0][0][1][3]=c3;aplayercrateborder.value=c3;
        this.checked = false;
    }
}
seizure.onclick=function() {
    if(!loop) {
     loop = setInterval(function(){
            let c=rColor(), c2=rColor();
            window.crate[0][1][1][3]=c;acrate.value=c;
            window.longCrate[0][1][1][3]=c2;alongCrate.value=c2;
            let e=rColor(), e2=rColor(), e3=rColor();
            window.crate[0][0][1][3]=e;acrateborder.value=e;
            window.longCrate[0][0][1][3]=e2;alongcrateborder.value=e2;
            window.userCrate[0][0][1][3]=e3;aplayercrateborder.value=e3;
        }, 100)
    }
   else {clearInterval(loop); loop=undefined;}
}
defaults.onclick=function() {
    if (this.checked) {
     window.crate[0][1][1][3]=defaultColors[0];acrate.value=defaultColors[0];
     window.crate[0][0][1][3]=defaultColors[2];acrateborder.value=defaultColors[2];
     window.longCrate[0][1][1][3]=defaultColors[1];alongCrate.value=defaultColors[1];
     window.longCrate[0][0][1][3]=defaultColors[2];alongcrateborder.value=defaultColors[2];
     window.userCrate[0][0][1][3]=defaultColors[2];aplayercrateborder.value=defaultColors[2];
     this.checked = false;
    }
}
let acc = get("accordian");
acc.onclick=function(){
    let panel = get("box2");
    if (panel.style.display == "grid") panel.style.display = "none";
    else {panel.style.display = "grid";}
}
})();