 // ==UserScript==
// @name         powerline thing
// @namespace    http://tampermonkey.net/
// @version      1
// @description  powerline useless thing
// @author       You
// @match        https://powerline.io/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436715/powerline%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/436715/powerline%20thing.meta.js
// ==/UserScript==

'use strict';
const HTML = `
 
 
<table style="width:100%" class="greenthing">
 
 
<tr>
 
  <td><b style="text-shadow:1px 1px 0 #444">Powerline.io menu thing?</td>
 
 
 
 
 </div>
 
 
    
 
<div>
 
 
 
 
<a href="https://www.youtube.com/channel/UCCUhoX2YMx7Z12i5lkydZoA/featured" target="_blank">go here(my YT channel)</a>
 
 
 
</div>
 
 
 
 
 
 
 
 
 
</tr>
</table>
  `
const styles = `
 
 
a:link, a:visited {
  background-color: #f44336;
  color: white;
  padding: 15px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}
 
a:hover, a:active {
  background-color: red;
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
console.log("powerline menu loaded!")
 
$(document).ready(function(){
   $("footer").removeClass("bannerBox");
   $("footer").removeClass("leftBottomBox");
   $("footer").removeClass("rightBoxNews");
   $("footer").removeAttr("class");
});
 
//footers
 
$(document).ready(function(){
   $("img").removeAttr("src");
}); //Remove the image of the App Section
 
//images
 
$(document).ready(function(){;
   $("font").removeAttr("style");
   $("font").removeAttr("class");
   $("font").remove()
});
 
//fonts
 
$(document).ready(function(){
   $("iframe").removeAttr("src");
   $("iframe").removeAttr("id");
});
 
 
 
 
(function(thenick) {
 
 
   var x = document.getElementById("nick");
   x.maxLength = 100000000;
})();
 
 
 
 

