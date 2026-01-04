// ==UserScript==
// @name         Diep Tools
// @namespace    http://ggforgaming.ml/
// @version      1.6
// @license      MIT
// @description  Make quick builds with this script (and more soon)!
// @author       GGforGaming
// @match        https://*.diep.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427485/Diep%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/427485/Diep%20Tools.meta.js
// ==/UserScript==

'use strict';
const HTML = `
<table style="width:100%">
  <tr>
    <td><b>Build</b></td>
    <td><b>Apply</b></td>
  </tr>
  <tr>
    <td>Build for most tanks</td>
    <td><button onclick='input.execute("game_stats_build 565611122565656565647474747474747")'>Apply</button></td>
  </tr>
  <tr>
    <td>Build Ram Damage</td>
    <td><button onclick='input.execute("game_stats_build 123123123123123123123676767676766")'>Apply</button></td>
  </tr>
  <tr>
    <td>Build for booster tri-angle etc.</td>
    <td><button onclick='input.execute("game_stats_build 123123123123123123123678678678678")'>Apply</button></td>
  </tr>
  <tr>
    <td>Clear build</td>
    <td><button onclick='input.execute("game_stats_build 0")'>Apply</button></td>
  </tr>
  <tr>
    <td><b>Console</b></td>
    <td><input id="con"><button onclick='document.getElementById("conoutput").value = input.execute(document.getElementById("con"))'>Send</button></td>
  </tr>
  <tr>
    <td><b>Console output</b></td>
    <td id="conoutput">Use above console to get result here!</td>
  </tr>
</table>
    `
const styles = `
div#dt-menu > table, th, td {
  border: 1px solid green;
  padding-left:10px;
  padding-right:10px;
  border-collapse: collapse;
  overflow-y:auto;
  word-wrap:break-all;
}
div#dt-menu > button {
    font-family: inherit;
    font-size: 1em;
}

`
const menuStyles = {
    position: "absolute",
    top: "25%",
    width:"50vw",
    height:"50vh",
    left: "25%",
    display: "none",
    "background-color": "rgba(255,255,255,0.5)",
    "font-family":'"Montserrat","Verdana"'
}
// <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
const menu = document.createElement("div")
for (var prop in menuStyles) {
    menu.style[prop] = menuStyles[prop]
}
menu.innerHTML = HTML
menu.id = "dt-menu"
const styleElement = document.createElement("style")
const font = document.createElement("link")
font.rel = "stylesheet"
font.href = "https://fonts.googleapis.com/css?family=Montserrat"
styleElement.innerHTML = styles
document.head.appendChild(styleElement)
document.head.appendChild(font)
document.body.appendChild(menu)
const myEvent = function(event) {
switch (event.key) {
    case "Escape":
        if (menu.style.display == "none") {
            menu.style.display = "block"
            console.log("Menu Enabled!")
        }
        else {
            menu.style.display = "none"
            console.log("Menu Disabled!")
        }
        break
    case "9":
        input.execute("game_stats_build 565611122565656565647474747474747");
        console.log("Build [Key 9] Applied!");
        break
    case "0":
        input.execute("game_stats_build 123123123123123123123676767676766");
        console.log("Build [Key 0] Applied!");
        break
    case "-":
        input.execute("game_stats_build 123123123123123123123678678678678");
        console.log("Build [Key -] Applied!");
        break
    case "/":
        input.execute("game_stats_build 0");
        console.log("Stopped upgrading!")
        break
    default:
        return
        break
    }
}
window.addEventListener("keydown",myEvent)
console.log("DiepTools Loaded!")