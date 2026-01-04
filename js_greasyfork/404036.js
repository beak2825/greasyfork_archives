// ==UserScript==
// @name         /r/place auto-draw
// @namespace    /u/OperaSona
// @version      0.1
// @description  Automatically draws on /r/place
// @author       /u/OperaSona
// @match        https://www.reddit.com/place?webview=true
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/404036/rplace%20auto-draw.user.js
// @updateURL https://update.greasyfork.org/scripts/404036/rplace%20auto-draw.meta.js
// ==/UserScript==

var color=13;
var xmin =750; // at least 0
var xmax =999; // at most 999
var ymin =750; // at least 0
var ymax =999; // at most 999

var modhash;

function sleep (delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function drawWhenReady() {
  while (document.getElementById("place-timer").style.display != "none") {
    console.log("Not allowed to draw, waiting 15 sec...");
    await sleep(15000);
  }
  console.log("We can draw now!");
  drawRandomPixel();
}

async function drawRandomPixel() {
  var x = Math.floor(Math.random()*(1+xmax-xmin)+xmin);
  var y = Math.floor(Math.random()*(1+ymax-ymin)+ymin);
  $.ajax({
    url: "https://www.reddit.com/api/place/draw.json",
    type: "POST",
    headers: {
      "x-requested-with" : "XMLHttpRequest",
      "x-modhash"        : modhash,
    },
    data: { x: x, y: y, color: color }
  });
  console.log("Drew pixel at (" + x + "," + y + ")");
  await sleep(10 * 1000);
  location.reload();
}

function init() {
  modhash = document.getElementById("config").innerHTML.match(/"modhash": "(\w+)"/)[1];
  drawWhenReady();
}

setTimeout(init, 1500);