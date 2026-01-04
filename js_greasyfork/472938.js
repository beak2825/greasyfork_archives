// ==UserScript==
// @name         scenexe.io hack tool zoom, hack menu, custom gui AND adblocker
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @license      MIT 
// @description  scenexe.io hacks wich allow you to zoom in and out with cursor, custom themes and custom home menu
// @author       ARX-M
// @match        https://scenexe.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472938/scenexeio%20hack%20tool%20zoom%2C%20hack%20menu%2C%20custom%20gui%20AND%20adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/472938/scenexeio%20hack%20tool%20zoom%2C%20hack%20menu%2C%20custom%20gui%20AND%20adblocker.meta.js
// ==/UserScript==

            CanvasRenderingContext2D.prototype._stroke = CanvasRenderingContext2D.prototype._stroke || CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype._fillText || CanvasRenderingContext2D.prototype.fillText
CanvasRenderingContext2D.prototype._strokeText = CanvasRenderingContext2D.prototype._strokeText || CanvasRenderingContext2D.prototype.strokeText
CanvasRenderingContext2D.prototype.stroke = function() {
    this.shadowBlur = this.lineWidth / 2;// remove this line to have no blur
    this.shadowColor = this.strokeStyle; // remove this line to have no blur
//tanks in genral
    this.fillStyle = "#54FF5F"
    this._stroke(...arguments)
    this.shadowBlur = 0; // remove this line for no blur
};
CanvasRenderingContext2D.prototype.fillText = function() {
    this._fillText(...arguments)
    this.shadowBlur = 0;
};
 //names exc...
CanvasRenderingContext2D.prototype.strokeText = function() {
    this.strokeStyle = "#B3178A"
    this._strokeText(...arguments);
};
'use strict';
const HTML = `
<table style="width:100%" class="greenthing">
 <tr>
   <td><b style="text-shadow:1px 1px 0 #444">Scenexe.io menu thing?</td>
   <td>
  <img src="https://share.sketchpad.app/21/ab8-85dd-e9a387.png" alt="arras cool pic". style="width:200px;height:200px;" > <br>
 if you understand you do. if you dont... <a href="https://www.reddit.com/r/Diepio/comments/ot9rl3/fighter_plush/" target="_blank" style=”color: white; ” class=”linkboi”>Click here</a>  The original ver. <a href="https://share.sketchpad.app/21/45b-afe5-45d32e.png" target="_blank" style=”color: white; ” class=”linkboi”>here</a> </tr>
 <tr>
</div>
  <a>Builds</a>
  <p>same as diep.io builds? I aint sure</p><br>
</div>
  </div>

   <a>diep.io hybrid and slave. my fist image!</a>
     <img src="https://share.sketchpad.app/21/5be-db3a-ac1934.png" alt="diep cool pic". style="width:200px;height:100px;">
</div>
</tr>
</table>
   `
const styles = `
a:link {
  color: red;
  background-color: transparent;
  text-decoration: none;
}
a:visited {
  color: pink;
  background-color: transparent;
  text-decoration: none;
}
a:hover {
  color: red;
  background-color: transparent;
  text-decoration: underline;
}
a:active {
  color: yellow;
  background-color: transparent;
  text-decoration: underline;
}
.greenthing {border: 1px solid red;
 padding-left:10px;
 padding-right:10px;
 border-collapse: collapse;
 overflow-y:auto;
 word-wrap:break-all;
}
div#greenthing > table, th, td {
 }
div#greenthing > button {
   font-family: inherit;
   font-size: 1em;
}
 }
`
const menuStyles = {
   position: "absolute",
   top: "25%",
   width:"50vw",
   height:"65vh",
   left: "25%",
   display: "none",
   "background-color": "rgba(50, 0, 50, 0)",
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
   }
}
window.addEventListener("keydown",myEvent)
console.log("scenxe menu loaded!")

let textNode = document.createTextNode(""); document.body.appendChild(textNode);

const xpElement = document.querySelector('#title') //XP header
    if (xpElement !== null) {
        xpElement.textContent = "<<==SCENEXE.IO==>>";
    }
const pElement = document.querySelector('#changelog') //XP header
    if (pElement !== null) {
        pElement.textContent = "subscribe to my youtube: bon plays scenexe";
    }
const Element = document.querySelector('#ads') //XP header
    if (Element !== null) {
        Element.textContent = "subscribe to my youtube: bon plays scenexe";
    }
const lement = document.querySelector('#connecting-text') //XP header
    if (lement !== null) {
        lement.textContent = "nearly there!!";
    }
const ement = document.querySelector('#play-button') //XP header
    if (ement !== null) {
        ement.textContent = "lets go!!";
    }
const ment = document.querySelector('#full-connecting-text') //XP header
    if (ment !== null) {
        ment.textContent = "lets go!!";
    }
const ent = document.querySelector('#server-select-title') //XP header
    if (ent !== null) {
        ent.textContent = "";
    }
const nt = document.querySelector('#server-select-dropdown') //XP header
    if (nt !== null) {
        nt.textContent = "subscribe to bon plays scenexe!";
    }
const t = document.querySelector('#button-feedback') //XP header
    if (t !== null) {
        t.textContent = "subscribe to bon plays scenexe!";
    }
const to = document.querySelector('#popup-title') //XP header
    if (to !== null) {
        to.textContent = "thank you!";
    }
'use strict'
const x=document.createElementNS('http://www.w3.org/1999/xhtml','div')
x.setAttribute('onclick',`"use strict";(${()=>{
	const obj={'__proto__':null,'passive':true},rset=Reflect.set,p=Promise,fh=x=>{
		x.cameraSizeMultiplier*=zoom/10
	}
	let zoom=10
	//use removedEntities to not conflict with tank editor
	Object.defineProperty(Object.prototype,'removedEntities',{
		'__proto__':null,
		'configurable':true,
		'enumerable':false,
		'set'(val){
			rset(obj,'removedEntities',val,this)
			p.resolve(this).then(fh)
		}
	})
	document.getElementById('game-canvas').addEventListener('wheel',event=>{
		if(event.deltaY>0)++zoom
		else if(9===--zoom)zoom=10
	},obj)
	document.body.addEventListener('keypress',event=>{
		const t=event.target.tagName
		if(t!=='INPUT'&&t!=='TEXTAREA')switch(event.key){
			case '+':
				++zoom
				return
			case '-':
				if(9===--zoom)zoom=10
		}
	},obj)
}})()`)
x.click()
document.getElementById('popup').hidden=false
let p = 10
p.speedMultiplier

