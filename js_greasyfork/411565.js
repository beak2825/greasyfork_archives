// ==UserScript==
// @name         STYLESCRIPTV3 BLOBLE.IO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  STYLESCRIPTV3, n e q melhoro hein ;v, Eh O CrImE
// @author       MASSA ATOMICA
// @match        http://bloble.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411565/STYLESCRIPTV3%20BLOBLEIO.user.js
// @updateURL https://update.greasyfork.org/scripts/411565/STYLESCRIPTV3%20BLOBLEIO.meta.js
// ==/UserScript==
var Css = document.createElement("style")
Css.innerText =
`
// MUDANDO DE COR
#menuContainer {
    background-color: #000000;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	top: 10px;
	z-index: 100;
	align-items: center;
	text-align: center;
}
#leaderboardList {
    background-color: #FF0000;
	width: 100%;
	height: 100%;
}
#chatBox {
   background-color: #FF00FF;
}
#leaderboardContainer {
   background-color: #B22222

`
// COMANDOS DE "STYLE"
$("#gameTitle").html('STYLESCRIPTV3')
//Theme
window.renderPlayer=function(a,d,c,b,g)
{b.save();if(a.skin&&0<a.skin&&a.skin<=playerSkins&&!skinSprites[a.skin]){var e=new Image;e.onload=function(){this.readyToDraw=!0;this.onload=null;g==currentSkin&&changeSkin(0)};e.src=".././img/skins/skin_"+(a.skin-1)+".png";skinSprites[a.skin]=e}a.skin&&skinSprites[a.skin]&&skinSprites[a.skin].readyToDraw?(e=a.size-b.lineWidth/4,b.lineWidth/=2,renderCircle(d,c,a.size,b,!1,!0)):g||(b.fillStyle="rgba(255, 247, 0, 0.2)",renderCircle(d,
c,a.size,b));b.restore()}
outlineWidth = 5,
backgroundColor = "#001a1a",
indicatorColor = "#00ffff",
turretColor = "#000000",
bulletColor = "#00ffff",
redColor = "#00ffff",
targetColor = "#00ffff",
playerColors = "#000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000".split(" ")
renderText = function(a, d) {
var c = document.createElement("canvas"),
        b = c.getContext("2d");
    b.font = d + "px regularF";
    var g = b.measureText(a);
    c.width = g.width + 20;
    c.height = 2 * d;
    b.translate(c.width / 2, c.height / 2);
    b.font = d + "px regularF";
    b.fillStyle = "#000000";
    b.textBaseline = "middle";
    b.textAlign = "center";
    b.strokeStyle = redColor;
    b.lineWidth = outlineWidth;
    b.strokeText(a, 0, 0);
    b.fillText(a, 0, 0);
    return c
}
