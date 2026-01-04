// ==UserScript==
// @name         Bruhseidon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Bruhseidon YT's theme made by Not Revan YT
// @author       Not Revan YT
// @match        https://shellshock.io/
// @icon         https://media.discordapp.net/attachments/1110510036943384668/1155797528772624394/Shellshock-io-SS___Bruhseidon.png?width=494&height=556
// @downloadURL https://update.greasyfork.org/scripts/478017/Bruhseidon.user.js
// @updateURL https://update.greasyfork.org/scripts/478017/Bruhseidon.meta.js
// ==/UserScript==


let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://bruhseidon-theme.bluetack.repl.co/style.css';
document.head.appendChild(style);

let index = document.createElement('link');
index.rel = 'stylesheet';
index.href = 'https://bruhseidon-theme.bluetack.repl.co/style.css';
document.head.appendChild(index);




(function () {
    const addScript = () => {
        document.title="Bruhseidon"
        document.head.innerHTML += `<style>

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(https://media.discordapp.net/attachments/1110510036943384668/1155795543663071253/my_yt_banner_render.png?width=988&height=556)
}
#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'You Violated'!important;
  color: black;
  }
#killBox h3{
  display:none;
}
#KILL_STREAK::before{
  display: normal !important;
}
#deathBox h3{
  display:none;
}

#deathBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'You were sent to EGGSUS by'!important;
  color: black;
}

#scopeBorder {
box-sizing: initial;
display: flex;
flex-direction: row;
justify-content: center;
width: 100vw; height: 100vh;
position: absolute;
top: 0px; left: 0px;
pointer-events: none;
overflow-x: hidden;
}

#maskleft, #maskright {
background: var(--ss-black);
flex: 1;
}

#maskmiddle {
background: url('https://media.discordapp.net/attachments/1000151470634700900/1010127774356348968/boolet_scope.png?width=556&height=556') center center no-repeat;
background-size: contain;
width: 100vh;
height: 100vh;
}

.crosshair {
position: absolute;
transform-origin: 50% top;
top: 50%;
border: solid 0.05em #FF0000;
height: 0.8em;
margin-bottom: 0.12em;
opacity: 0.7;
}

.crosshair.normal {
left: calc(50% - 0.15em);
background: #FF0000;
width: 0.3em;
}

.crosshair.powerful {
left: calc(50% - 0.25em);
background: red;
width: 0.5em;
}

#dotReticle {
position: absolute;
left: 50%; top: 50%;
transform: translate(-50%, -50%);
background: var(--ss-yolk);
width: 0.7em; height: 0.7em;
border-radius: 100%;
}

#shotReticleContainer {
position: absolute;
text-align: center;
left: 50%; top: 50%;
transform: translate(-50%, -50%);
opacity: 0.7;
overflow-x: hidden;
}

#reticleContainer {
position: fixed;
top: 0; left: 0;
width: 100%; height: 100%;
}

#crosshairContainer {
position: absolute;
left: 50%; top: 50%;
transform: perspective(0px);
}

.shotReticle {
box-sizing: border-box;
position: absolute;
left: 50%;
width: 2.5em;
height: 100%;
transform-origin: center;
background: transparent;
border: solid;
border-left: solid transparent;
border-right: solid transparent;
border-radius: 1.25em 1.25em 1.25em 1.25em;
}

.shotReticle:nth-child(1n) {
transform: translateX(-50%) rotate(0deg);
}

.shotReticle:nth-child(2n) {
transform: translateX(-50%) rotate(90deg);
}

.shotReticle.fill {
}

.shotReticle.border {
}

.shotReticle.fill.normal {
border-color: purple;
border-left: solid transparent;
border-right: solid transparent;
border-width: 0.1em;
padding: 0.1em;
}

.shotReticle.fill.powerful {
border-color: purple;
border-left: solid transparent;
border-right: solid transparent;
border-width: 0.3em;
padding: 0.1em;
}

.shotReticle.border.normal {
border-color: #9f09bd;
border-left: solid transparent;
border-right: solid transparent;
border-width: 0.2em;
}

.shotReticle.border.powerful {
border-color: #9f09bd;
border-left: solid transparent;
border-right: solid transparent;
border-width: 0.4em;
}
}

#ammo {
text-align: right;
font-size: 3.25em;
font-family: 'Nunito', sans-serif;
font-weight: bold;
line-height: 1em;
margin: 0;

padding-right: 1.2em;
padding-top: 0em;
margin-bottom: 0.1em;

background-image: url(../img/ico_ammo.png);
    background-position: right center;
background-size: contain;
    background-repeat: no-repeat;
}

#healthContainer {
position: absolute;
left: 50%; bottom: 1em;
transform: translateX(-50%);
display: inline-block;
width: 6em; height: 6em;
background: var(--ss-blueshadow);
border-radius: 50%;
text-align: center;
}

#health {
}

#healthHp {
font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
transform-origin: center;
transform: rotate(90deg);
fill: transparent;
stroke: white;
stroke-width: 1em;
stroke-dasharray: 14.4513em;
transition: all 0.3s ease-in-out;
}

.healthYolk {
fill: #12e39a;
}

.healthSvg {
width: 100%; height: 100%;
}

#hardBoiledContainer {
position: absolute;
left: 50%; bottom: 1em;
transform: translateX(-50%);
display: inline-block;
width: 6em; height: 6em;
text-align: center;
}

#hardBoiledValue {
font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}

#hardBoiledShieldContainer {
width: 100%;
height: 100%;
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://media.discordapp.net/attachments/1147404482209124432/1154821624906924062/1st_glowy_albino_cs_render.png?width=991&height=556');
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
