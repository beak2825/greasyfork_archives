// ==UserScript==
// @name         Gold Information - zombs.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  my discord skittle-troller#6357
// @author       skittle-troller
// @match        http://zombs.io/
// @icon         https://cdn-icons-png.flaticon.com/512/4576/4576492.png
// @grant        none
// @require      https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @downloadURL https://update.greasyfork.org/scripts/438266/Gold%20Information%20-%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/438266/Gold%20Information%20-%20zombsio.meta.js
// ==/UserScript==

let css2 = `
.hud-menu-zipp4 {
display: none;
position: fixed;
top: 30%;
left: 50%;
width: 390px;
height: 240px;
margin: -130px 0 0 -182px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
z-index: 5;
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity4"]::before {
background-image: url("https://cdn-icons-png.flaticon.com/512/4576/4576492.png");
}
.hud-menu-zipp4 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
}
`;
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity4");
spell.classList.add("hud-zipp4-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-zipp4">
<div class="hud-zipp-grid4">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp4")[0];

document.getElementsByClassName("hud-zipp4-icon")[0].addEventListener("click", function() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        zipz123.style.display = "block";
    } else {
        zipz123.style.display = "none";
    }
});

document.getElementsByClassName("hud-zipp-grid4")[0].innerHTML = `
<div style="text-align:center"><br>
<button class="1bs" onclick="hgfh();">For buy full pickaxe need 132 500 gold</button>
<button class="2bs" onclick="bt();">For buy full spear need 178 500 gold</button>
<button class="3bs" onclick="hgfhf();">For buy full bow need 153 500 gold</button>

<button class="4bs" onclick="gfgf();">For buy full shield need 234k gold</button>
<button class="5bs" onclick="gfgfdfds();">For buy full bomb need 152 500 gold</button>
<button class="6bs" onclick="gfgfs2();">For buy all weapons to full need 616k gold</button>

<button class="7bs" onclick="fggf();">For upgrade full stash need 583k gold</button>
<button class="8bs" onclick="gfgffg();">"Boss Waves: 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121</button>
<button class="9bs" onclick="fdjiodio();">Thanks for dowland my script (with love skittle)</button>

`;

