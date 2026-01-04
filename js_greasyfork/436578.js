// ==UserScript==
// @name        Arras  Theme
// @version     4.4.9
// @description  theme for arras.io
// @match        *://arras.io/
// @license     MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/436578/Arras%20%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436578/Arras%20%20Theme.meta.js
// ==/UserScript==
//all credit goes to arras noob 
// "G key"
        
            CanvasRenderingContext2D.prototype._stroke = CanvasRenderingContext2D.prototype._stroke || CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype._fillText || CanvasRenderingContext2D.prototype.fillText
CanvasRenderingContext2D.prototype._strokeText = CanvasRenderingContext2D.prototype._strokeText || CanvasRenderingContext2D.prototype.strokeText
 
CanvasRenderingContext2D.prototype.stroke = function() {
    this.shadowBlur = this.lineWidth / 2;// remove this line to have no blur
    this.shadowColor = this.strokeStyle; // remove this line to have no blur
//tanks in genral
    this.fillStyle = "#c7370f "
    this._stroke(...arguments)
    this.shadowBlur = 0; // remove this line for no blur
};
CanvasRenderingContext2D.prototype.fillText = function() {
    this._fillText(...arguments)
    this.shadowBlur = 0;
};
 //names exc...
CanvasRenderingContext2D.prototype.strokeText = function() {
    this.strokeStyle = "#03fcfc"
    this._strokeText(...arguments);
};
        



'use strict';
const HTML = `
<table style="width:100%" class="greenthing">
 
 
 <tr>
 
   <td><b style="text-shadow:1px 1px 0 #444">Arras.io menu thing?</td>
   <td>
 
  <img src="https://share.sketchpad.app/21/ab8-85dd-e9a387.png" alt="arras cool pic". style="width:200px;height:200px;" > <br>
 if you understand you do. if you dont... <a href="https://www.reddit.com/r/Diepio/comments/ot9rl3/fighter_plush/" target="_blank" style=”color: white; ” class=”linkboi”>Click here</a>  The original ver. <a href="https://share.sketchpad.app/21/45b-afe5-45d32e.png" target="_blank" style=”color: white; ” class=”linkboi”>here</a> </tr>
 <tr>
  
</div>




  <a>Builds</a>
  <p>1. 2/2/2/7/8/8/7/6/0/0 fighter 10.7 mil<br>2. 4/11/2/11/11/0/0 landmine 9 mill<br>3. 1/1/8/8/8/8/1/7/0/0 build that i made 1<br>4.  2/2/8/8/8/8/0/6/0/0 build i made 2<br>5. 3/3/7/7/7/7/1/7/0/0 20 mill auto auto-seer<br>6. 0/1/6/8/8/7/7/5/0 almost 3 mill falcon</p>
</div>
   <img src="https://share.sketchpad.app/21/45b-afe5-45d32e.png" alt="diep cool pic". style="width:200px;height:100px;">
  </div>


   <a>diep.io hybrid and slave</a>
     <img src="https://share.sketchpad.app/21/5be-db3a-ac1934.png" alt="diep cool pic". style="width:200px;height:100px;">








 


</div>






   


</tr>
</table>
   `
const styles = `
 
a:link {
  color: green;
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
console.log("arras menu loaded!")





