// ==UserScript==
// @name         Update Animations Panel
// @version      0.1
// @match        *://agma.io/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        unsafeWindow
// @run-at       document-start
// @namespace brrr
// @description update animation
// @downloadURL https://update.greasyfork.org/scripts/497990/Update%20Animations%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/497990/Update%20Animations%20Panel.meta.js
// ==/UserScript==

let send;
let status = false;
const osend = WebSocket.prototype.send
WebSocket.prototype.send = function () {
    send = (...args) => osend.call(this, ...args)
    return osend.apply(this, arguments)
}
unsafeWindow.anim = (id) => send(new Uint8Array([0xb3, id]));
window.addEventListener('load', (event) => {
$('body').append(`
<div id="fushykng" style="
    background-color: #2b2929a6;
    position: fixed;
    right: 10px;
    top: 54%;
    border-radius: 5px;
    transform: translateY(-50%);
    display: grid;
    gap: 10px 10px;
margin-top: 20px;
    grid-template-columns: repeat(5, 1fr);
">
<style >#fushykng>div{
    padding: 5px;
    background-color: #ffffff26;
    border-radius: 5px;
    border: 1px #ffffff40 solid;
}</style>
`);
for(let i = 1; i < 52; i++) $('#fushykng').append(`<div onclick="anim(${i})">${i}</div>`);
document.addEventListener("keydown", event => {
if (event.code == 'Numpad1') {
if(status == false){
status = true;
document.getElementById("fushykng").style.visibility = "hidden";
} else {
status = false;
document.getElementById("fushykng").style.visibility = "visible";
}
}
});
});