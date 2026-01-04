// ==UserScript==
// @name        Sploop.io --> lostworld.io
// @namespace   -
// @match       https://sploop.io/
// @match       https://webgames.io/*
// @grant       none
// @version     1.0
// @author      fizzixww
// @description used with texturepack here: https://www.youtube.com/watch?v=iUcZW8Br7us
// @grant        GM_addStyle
// @icon         https://i.postimg.cc/XvYrYQKm/ruby.png
// @downloadURL https://update.greasyfork.org/scripts/491699/Sploopio%20--%3E%20lostworldio.user.js
// @updateURL https://update.greasyfork.org/scripts/491699/Sploopio%20--%3E%20lostworldio.meta.js
// ==/UserScript==

//request interceptor json found here: https://www.youtube.com/watch?v=iUcZW8Br7us


            const gridToggle = document.querySelector("#grid-toggle");
setInterval(() => {
            if (gridToggle.checked) gridToggle.click();
}, 0);
            const halalvar = document.querySelector("#display-ping-toggle");
setInterval(() => {
            if (halalvar.checked) {
            }
    else{
        halalvar.click()};
}, 0);

(function() {
    'use strict';
    var css = [
"@font-face {",
"font-family: 'Ubuntu';",
 " font-style: normal;",
 " font-weight: 700;",
 " font-display: swap;",
"  src: url(https://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoCxCvjvWyNL4U.woff2) format('woff2');",
 " unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;",
"}",
"* {",
"    font-family: 'Ubuntu', sans-serif;",
"}"
    ];
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css.join(' ');
    } else {
        style.appendChild(document.createTextNode(css.join(' ')));
    }

//font color gradient
    document.head.appendChild(style);
   const { fillText } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
    'use strict';
    const canvas = document.getElementById("game-canvas");
    var grd = this.createLinearGradient(20, 0, 220, 0);
    /*
grd.addColorStop(0, '#dbf26e');
grd.addColorStop(0.37, '#61fa74');//https://www.eggradients.com/gradient/cute-bug
grd.addColorStop(1, '#1cfdd6');*/
    grd.addColorStop(0, '#affcaf');
grd.addColorStop(0.37, '#12dff3');//https://www.eggradients.com/gradient/cute-bug
grd.addColorStop(1, '#affcaf');
            this.fillStyle = grd;
                var grrrd = this.createLinearGradient(20, 0, 220, 0);
            grrrd.addColorStop(0, '#000000');
            grrrd.addColorStop(1, '#000000');

    this.strokeStyle = grrrd;
    this.strokeText(text, x, y)
    fillText.call(this, ...arguments);
};

var playerContainerz = document.getElementById('player-container');
if (playerContainerz) {
    playerContainerz.style.background = 'linear-gradient(to right, #f0ece0, #1f2419)';
    playerContainerz.style.color = '#f0ece0';
}

})();





//backgrounds
const { fillRect } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  if (this.fillStyle === "#788f57") {
            this.fillStyle = "#768f5a"; }//grass colour
  else if (this.fillStyle === "#b38354") {
      this.fillStyle = "#f7b267"; }//desert colour
  else if (this.fillStyle === "#2a8b9b") {
      this.fillStyle = "#5e74a7"; }//river colour
  else if (this.fillStyle === "#ece5db") {
      this.fillStyle = "#636363"; }//snow colour
  else if (this.fillStyle === "#fcefbb") {//
      this.fillStyle = "#f7b267"; }//beach to desert
  fillRect.call(this, ...arguments);
};


var textDiv = document.createElement('div');//insert title underneath logo
textDiv.className = 'text';
textDiv.textContent = 'LOSTWORLD.IO';
textDiv.style.color = 'white';
textDiv.style.fontSize = '30px';
var middleWrap = document.getElementById('middle-wrap');
if (middleWrap) {
    if (middleWrap.children.length >= 1) {
        middleWrap.insertBefore(textDiv, middleWrap.children[1]);
    } else {
        middleWrap.appendChild(textDiv); // If middleWrap has no children, just append the textDiv
    }
}



/////////////////////////////////////////////
//hatshop
////////////////////////////////////////////
(function() {
    'use strict';
    var css = [
"@font-face {",
"font-family: 'Ubuntu';",
 " font-style: normal;",
 " font-weight: 700;",
 " font-display: swap;",
"  src: url(https://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoCxCvjvWyNL4U.woff2) format('woff2');",
 " unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;",
"}",
"* {",
         " font-style: normal;",
 " font-weight: 700;",
 " font-display: swap;",
"    font-family: 'Ubuntu', sans-serif !important;",
         " unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;",
"}",/*
            "#middle-wrap .text {",//custom :) inserted text "LOSTWORLD.IO"
    "font-family: 'Ubuntu';",
            "color: #FFFFFF;",
    "}"*/
    ]; //"* {",
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css.join(' ');
    } else {
        style.appendChild(document.createTextNode(css.join(' ')));
    }
})();

document.getElementById("hat-menu").style.background = "rgba(0,0,0,0)";
(function() {var css = [
".menu .content .menu-item .header {",//hat name
    "position: relative;",
    	"color: #fff",
	"padding: 5px;",
	"font-size: 24px;",
	"text-align: left;",
    "cursor: pointer;",
"}",
".green-button {",
    "background-color: rgba(0,0,0,0);",
    //"box-shadow: inset 0 -5px 0 rgba(0,0,0,0);",
    "color: #f4845f;",
"}",
".menu .content .menu-item .description {",
    "font-size: 14px;",
    "color: skyblue;",
    "display: inline-block;",
    "padding-bottom: 15px;",
"}",
"#hat-menu .text-shadowed-3 {",
"text-shadow: none;",
    "}",
".scrollbar::-webkit-scrollbar {",
    "opacity: 0;",
    "border-color: rgba(0,0,0,0);",
"}",
    ".scrollbar::-webkit-scrollbar-button {",
    "opacity: 0;",
    "box-shadow: none;",
    "width: 0;",
    "}",
".menu .content .menu-item .menu-pricing .action {", //buy button
    "margin-left: auto;",
    "outline: none;",
    "border: 0px dotted #FFFFFF;",
    "padding: 7px;",
    "cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;",
    "margin-top: auto;",
    "margin-bottom: auto;",
    "border-radius: 10px;",
    "box-shadow: none;",
    "float: right;",
	"font-size: 24px;",
	"text-align: right;",
	"cursor: pointer;",
	"color: #f4845f;",
"}",
".menu .content .menu-item {", //item price number
	"color: rgba(255,255,255,0.5);",
	"font-size: 24px;",
	//"padding-right: 5px;",
"}",
"#hat-menu .subcontent-bg {",//subcontents, the area with all the hats and prices
    "background: rgba(0, 0, 0, 0.25)",
    "margin: 0px 0 0px 0;",
    "border: 4px solid rgb(0, 0, 0, 0);",
    "box-shadow: inset 0 5px 0 rgb(0 0 0 / 0%);",
    "width: 400px;",
    "height: 200px;",
    "position: absolute;",
    "top: 50px;",
"}",
//my test:

"#hat-menu .green-button:hover {",
    "margin-left: auto;",
    "outline: none;",
    "border: 0px dotted #FFFFFF;",
    "padding: 7px;",
    "cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;",
    "margin-top: auto;",
    "margin-bottom: auto;",
    "border-radius: 10px;",
    "box-shadow: none;",
    "float: right;",
	"font-size: 24px;",
	"text-align: right;",
	"cursor: pointer;",
	"color: #f79d65 !important;",
    "background: rgba(0, 0, 0, 0)",
    "}",

//bottom border
    ".menu .content .menu-item {",
	"border-bottom: none;",
    "}",

    "#hat-menu {", //outer border?
	"border: 1px dotted rgba(0, 0, 0, 0);",
    "box-shadow: none;",
    "height: 350px;",
    "width: 0 px;",
    //"text-color: rgba(0, 0, 0, 0)",
    "}",

    ".menu .content .menu-item img {",
    "height: 0px;",
    "width: 0px;",
    "color: rgba(0, 0, 0, 0)",
"}",
    ".menu .text-shadowed-4 {", //text "HATS" at top of hatshop
    "opacity: 0;",
"}",
    //my test
    "@keyframes pulsate {",
    "0% {",
    "    transform: scale(1);",
    "}",
    "50% {",
    "    transform: scale(1.1);",
    "}",
    "100% {",
    "    transform: scale(1);",
    "}",
"}",

    "#logo {",
    //"display: none;",
    "height: 300px;",
    "width: 300px;",
    "animation: pulsate 5s ease-out;",
    "animation-iteration-count: infinite;",
    "-webkit-animation: pulsate 5s ease-out;",
    "-webkit-animation-iteration-count: infinite;",

    "}",

  "#da-bottom {", //ad at the bottom
  "background: rgba(0, 0, 0, 0);",
  "width: 0px;",
  "height: 0px;",
  "opacity: 0;",
  "margin-left: 9999;",
  "display: none;",
"}",

  "#homepage {",//lobbybackground
  "background: rgba(0, 0, 0, 0);",
"}",

    "#waiting-animation0 {",
  "animation: none;",
"}",

"#main-content {",
  "background: rgba(0, 0, 0, 0);",
  "display: flex;",
  "justify-content: space-between;",
  "align-items: center;",
  "align-content: center;",
  "margin-bottom: 10px;",
  "padding: 0px;",
"}",

    "#main-content .text-shadowed-3 {",
"text-shadow: none;",
    "}",

    ".middle-main {",
  "background: rgba(0, 0, 0, 0);",
  //height: 255px;
  "border: none;",
  "display: block;",
  "justify-content: center;",
  "align-items: center;",
  "align-content: center;",
  "flex-wrap: wrap;",
  "width: 320px;",
  "height: 290px;",
  "padding: 15px;",
  "box-shadow: none;",
    "margin-top: 0px;",
"}",
    /*
".blue-button {",//signup
    "display: none;",
    "}",*/
".dark-blue-button {",//gamemode buttons
  "background: #827FFE;",
  "box-shadow: none;",
    "border: none;",
    "border-radius: 31px;",
    "padding: 0px 20px;",
    "height: 50px;",
    "min-width: 150px;",
    "justify-content: center;",
    "align-items: center;",
    "font-size: 16px;",
    "margin-top: 5px;",
    "margin-left: auto;",
    "margin-right: auto;",
"}",

".dark-blue-button:hover {",
  "background: #403866;",
  "box-shadow: none;",
    "padding: 15px 15px;",
    "border: none;",
    "border-radius: 31px;",
    "width: 600;",
    "height: 50px;",
        "margin-left: auto;",
    "margin-right: auto;",
"}",

".dark-blue-button:active {",
  "background: #403866;",
  "box-shadow: none;",
    "border: none;",
    "border-radius: 31px;",
    "padding: 0px 20px;",
    "height: 50px;",
    "min-width: 150px;",
    "justify-content: center;",
    "align-items: center;",
    "font-size: 16px;",
    "margin-top: 5px;",
    "margin-left: auto;",
    "margin-right: auto;",
"}",
"#da-right {",
  "background: rgba(0, 0, 0, 0);",
  "width: 0px;",
  "height: 0px;",
  "margin-left: 9999;",
  "display: none;",
    "opacity: 0;",
    "}",
    "#da-left {",
  "background-color: rgba(0, 0, 0, 0);",
  "width: 0px;",
  "height: 0px;",
  "margin-left: 9999;",
  "display: none;",
    "opacity: 0;",
    "}",

      "#game-bottom-content {", //ad at the bottom
  "background: rgba(0, 0, 0, 0);",
  "height: 0px;",
    "display: none;",
"}",
"#game-bottom-content {", //ad at the bottom
  "background: rgba(0, 0, 0, 0);",
  "height: 0px;",
"}",
    ".side-main {",
    "opacity: 0;",
"}",
    "#top-wrap-left {",
"opacity: 0;",
"}",
        "#top-wrap-right {",
"height: 20px",
    "opacity: 30;",
"}",


"#middle-wrap {",
  "height: 9999999px;",
  "width: 500px;",
    "padding: none;",
"}",
    ".side-button {",//note quesitonmark and eye
    "background: rgba(0, 0, 0, 0);",
    "margin-left: 0px;",
    "border-radius: 3px;",
    "display: none;",
    "}",
    ".side-button:hover {",
    "background: rgba(0, 0, 0, 0);",
    "margin-left: 0px;",
    "border-radius: 5px;",
    "}",
    ".bottom-button {", //policy
  "background: rgba(20, 20, 20, 0.3);",
  "display: none;",
            "}",

  "#server-select {",
    "font-size: 14px;",
    "line-height: 1.7;",
    "color: #666666;",
    "text-transform: uppercase;",
"display: block;",
      "background: rgba(0, 0, 0, 0);",
  "box-shadow: none;",
    "border: none;",
    //"border-radius: 31px;",
    "padding: 0px 20px;",
    "height: 50px;",
    "min-width: 230px;",
    "justify-content: center;",
    "align-items: center;",
    "margin-top: 5px;",
    "margin-left: auto;",
    "margin-right: auto;",
    "text-decoration: underline;",
"}",

      "#server-select:hover {",
    "display: block;",
    "font-size: 14px;",
    "line-height: 1.7;",
    "color: #666666;",

      "background: rgba(0, 0, 0, 0);",
  "box-shadow: none;",
    "border: none;",
    //"border-radius: 31px;",
    "padding: 0px 20px;",
    "height: 50px;",
    "min-width: 230px;",
    "text-decoration: none;",
    "justify-content: center;",
    "align-items: center;",
    "margin-top: 5px;",
    "margin-left: auto;",
    "margin-right: auto;",
"}",
    ".background-img-play {",
    "opacity: 0;",
    "}",
".text-shadowed-5 {",
    "font-size: 16px;",
    "color: #fff;",
    "text-shadow: none;",
    "padding-bottom: 35px;",
    "}",

    "#play {",
      "background: #827FFE;",
  "box-shadow: none;",
    "border: none;",
    "border-radius: 31px;",
    "padding: 0px 20px;",
    "height: 50px;",
    "min-width: 150px;",
    "justify-content: center;",
    "align-items: center;",
    "font-size: 20px;",
    "margin-top: 5px;",
    "margin-left: auto;",
    "margin-right: auto;",
    "}",

    "#play:hover {",
      "background: #403866;",
  "box-shadow: none;",
    "border: none;",
    "border-radius: 31px;",
    //"width: 250;",
    "height: 50px;",
        "margin-left: auto;",
    "margin-right: auto;",
    "}",
    "#nickname {",
    "text-align: center;",
    "color: #666666;",
    "display: block;",
  "background: #fff;",
  "border: none;",
  "border-radius: 31px;",
  "box-shadow: none;",
  "padding: 6px 15px;",
        "margin-left: auto;",
    "margin-right: auto;",
  "font-size: 20px;",
    "width: 300px;",
"}",
    ".nav-button {",
    "display: none;",
    "height: 0px;",
    "}",
    "#nav {",
    "display: none;",
    "}",
"#currency-container {",
    "display: none;",
                 "}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}}})();(function() {
    'use strict';
    var textElement = document.createElement('span');
var data = atob('YnkgZml6eml4d3c='); textElement.textContent = data;textElement.style.position = 'absolute';
    textElement.style.top = '0';
    textElement.style.left = '80px';
    textElement.style.zIndex = '9999';
    textElement.style.color = 'rgba(0, 0, 0, 0.1)';document.body.appendChild(textElement);})();
/////////////////////////////////////////////////////////////
//Webgames widgit container background//////////////////
var container = document.getElementById("cross-promo");
if (container) {
    container.parentNode.removeChild(container);
}
var adContainer = document.querySelector('.wg-ad-container');
if (adContainer) {
    adContainer.style.height = '0';
}
///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////// hi =)



