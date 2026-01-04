// ==UserScript==
// @name         AILab tools for free
// @description  Free download + delete watermark
// @version 1.0.1
// @match        *://www.ailabtools.com/image-editor/*
// @run-at       document-idle
// @license      N/A
// @namespace https://greasyfork.org/users/1205341
// @downloadURL https://update.greasyfork.org/scripts/479261/AILab%20tools%20for%20free.user.js
// @updateURL https://update.greasyfork.org/scripts/479261/AILab%20tools%20for%20free.meta.js
// ==/UserScript==

document.getElementsByClassName("editor")[0].remove();

const button = document.createElement('button');
const textNode = document.createTextNode("Download free");
button.appendChild(textNode);
document.body.insertBefore(button, document.body.firstChild);

var canvas = document.getElementsByClassName("lower-canvas")[0];

button.addEventListener("click", function() {
  var imgData = canvas.toDataURL("image/png");

  var a = document.createElement('a');
  a.href = imgData;
  a.download = 'image.png';

  a.click();
});