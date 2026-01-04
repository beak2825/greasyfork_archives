// ==UserScript==
// @name        Ascended Client
// @version     0.0.2
// @description  Created by AuKzz Oui
// @match        *://scenexe.io/
// @license     MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/450642/Ascended%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/450642/Ascended%20Client.meta.js
// ==/UserScript==
//all credits go to the original script creators
// "G key"

// NODARK
var dark = document.getElementById("darkness-canvas");
dark.style.zIndex = "-999";

// Change FOV
function changeFov(fov) {
	if (FovMultiplier < 1) {
		FovMultiplier = 1;
	}
	Object.defineProperty(Object.prototype, "cameraSizeMultiplier", { configurable: true, get: () => fov, set: () => { } });
}
var FovMultiplier = 1;
document.addEventListener('wheel', function (e) {
	if (e.deltaY > 0) {
		FovMultiplier += 0.1;
	} else {
		FovMultiplier -= 0.1;
	}
	changeFov(FovMultiplier);
});
document.addEventListener('mousedown', function (e) {
	if (e.button == 1) {
		FovMultiplier = 1;
		changeFov(FovMultiplier);
	}
});

            CanvasRenderingContext2D.prototype._stroke = CanvasRenderingContext2D.prototype._stroke || CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype._fillText || CanvasRenderingContext2D.prototype.fillText
CanvasRenderingContext2D.prototype._strokeText = CanvasRenderingContext2D.prototype._strokeText || CanvasRenderingContext2D.prototype.strokeText

CanvasRenderingContext2D.prototype.stroke = function() {
    this.shadowBlur = this.lineWidth / 2;// remove this line to have no blur
    this.shadowColor = this.strokeStyle; // remove this line to have no blur
//tanks in genral
    this.fillStyle = "#190b80"
    this._stroke(...arguments)
    this.shadowBlur = 0; // remove this line for no blur
};
CanvasRenderingContext2D.prototype.fillText = function() {
    this._fillText(...arguments)
    this.shadowBlur = 0;
};
 //names exc...
CanvasRenderingContext2D.prototype.strokeText = function() {
    this.strokeStyle = "#bd4a08"
    this._strokeText(...arguments);
};

(div=>{
div.setAttribute('onclick',`'use strict'
var proxyobj={
	'__proto__':null,
	'apply':(targ,$this,args)=>{
		if(args[1]==='forceDisconnect'){
			console.log('patching forceDisconnect')
			var get_ws=Object.getOwnPropertyDescriptor(args[0],'socket')
			if(get_ws&&(get_ws=get_ws.get)){
				args[2]={
					'__proto__':null,
					'configurable':true,
					'enumerable':true,
					'writable':true,
					'value':new Proxy(args[2].get(),{
						'__proto__':null,
						'apply':(targ,$this,args)=>{
							if(get_ws() instanceof WebSocket)return Reflect.apply(targ,$this,args)
							console.log('forceDisconnect call skipped')
						}
					})
				}
				console.log('patched forceDisconnect')
			}else console.log("failed patching forceDisconnect: didn't find socket getter")
			delete proxyobj.apply
		}
		return Reflect.apply(targ,$this,args)
	}
}
Object.defineProperty=new Proxy(Object.defineProperty,proxyobj)`)
div.click()
})(document.createElementNS('http://www.w3.org/1999/xhtml','div'))



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
  color: black;
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



.greenthing {border: 1px solid green;
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
   "background-color": "rgba(0, 80, 89, 1)",
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
console.log("Welcome to Ascended Client Scenexe.io")