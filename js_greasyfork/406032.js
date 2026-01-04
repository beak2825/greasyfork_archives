// ==UserScript==
// @name        Remove Color
// @match       https://sketchful.io/
// @grant       none
// @version     1.0.3
// @author      Bell
// @description Right-click on a color in the palette to remove it from the canvas
// jshint esversion: 6
// @namespace https://greasyfork.org/users/281093
// @downloadURL https://update.greasyfork.org/scripts/406032/Remove%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/406032/Remove%20Color.meta.js
// ==/UserScript==

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');
const $ = window.$;

$(".gameToolsColor").on("contextmenu", function(e) {
    e.preventDefault();
    colorToRemove = this.style.background.substring(4, this.style.background.length - 1).replace(/ /g, '').split(',');
    removeColor(colorToRemove);
});

function removeColor(color) {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imgData.data;
  
  for(let i = 0; i < data.length; i += 4) {
    if (data[i] == color[0] && data[i + 1] == color[1] && data[i + 2] == color[2]) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
  
  ctx.putImageData(imgData, 0, 0);
}