// ==UserScript==
// @name         Gats.io Better Keybinds
// @version      0.1.7.3
// @description  Enables you to change your keybinds of gats.io
// @author       Rayan223
// @match        https://gats.io
// @icon         none
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/825882
// @downloadURL https://update.greasyfork.org/scripts/451641/Gatsio%20Better%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/451641/Gatsio%20Better%20Keybinds.meta.js
// ==/UserScript==

console.log = console.dir;
var newKeyBinds = ['KeyZ','KeyS','KeyD','KeyQ','KeyR','KeyN',['mousedown',3],['mousedown',1]];
const defaultKeyBinds = ['KeyW','KeyS','KeyD','KeyA','KeyR','KeyN','Space',['mousedown',1]];

const iconHTML = `
<img id="menuButton", src="https://greasyfork.s3.us-east-2.amazonaws.com/ofz4u3vku7mzk93g0tqwjo3nw4zn", onclick="console.log('nothing yet...');", onmouseover="$('html,body').css('cursor','pointer');", onmouseleave="$('html,body').css('cursor','default');">
<style>
#menuButton{
    display: inline-block;
    top:5px;
    left:5px;
    position:fixed;
    z-index: 2;
}
section{
    justify-content: space-between;
    margin: 7px;
}
label{
    padding-right
}
<style>
`;

const menuHTML = `
<div>
    <section><label>Move Up</label>         <input type="button", id="moveUp",      value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    <section><label>Move Down</label>       <input type="button", id="moveDown",    value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    <section><label>Move Right</label>      <input type="button", id="moveRight",   value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    <section><label>Move Left</label>       <input type="button", id="moveDown",    value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    
    <section><label>Reload</label>          <input type="button", id="Reload",      value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    <section><label>Toggle Names</label>    <input type="button", id="toggleN",     value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    <section><label>Spacebar Action</label> <input type="button", id="Spacebar",    value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
    
    <section><label>Fire</label>            <input type="button", id="Fire",        value="%keybind%">  <input type"button", class="reset", value="Reset"></section>
</div>
`;
const icon = document.createElement('div');
icon.innerHTML =iconHTML;
document.body.appendChild(icon);

//var gear = document.getElementById('gear');
//gear.addEventListener('click', e=> {
//    console.log('nothing yet...');
//});

document.addEventListener('load', e=> {
    let c = cookie.get('BtKB');
    if (c != ""){
        newKeyBinds = c.split(',');
    }
});

function manageCookie(cname, cvalue){
    const expdate = 2147483647;
    createCookie(cname, cvalue, expdate);
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
  return "";
}

function createCookie(cname, cvalue, expdate){
    var d = new Date();
    d.setTime(d.getTime() + (expdate*24*60*60*100));
    let expiration = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expiraion + ";path=/";
}
