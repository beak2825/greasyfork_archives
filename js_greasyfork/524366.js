// ==UserScript==
// @name         Soundgasm Progress Bar
// @description  Adds a progress bar when uploading a file to Soundgasm. Also displays an estimated time of completion.
// @namespace    RoundPension
// @include      https://soundgasm.net/upload
// @version      1.0
// @license      MIT-0
// @downloadURL https://update.greasyfork.org/scripts/524366/Soundgasm%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/524366/Soundgasm%20Progress%20Bar.meta.js
// ==/UserScript==

var form = document.querySelector("form");

var req = new XMLHttpRequest();
var progbar;
var eta;
var starttime;
var lasttime;

form.addEventListener("submit", function(e) {
  e.preventDefault();
  
  req.upload.addEventListener("progress", prog);
  req.upload.addEventListener("loadstart", start);
  req.addEventListener("load", end);
  req.open("POST", "https://soundgasm.net/upload");
  req.send(new FormData(form));
});

function start() {
  starttime = Date.now();
  lasttime = starttime;
  var div = document.createElement("div");
  document.querySelector("body").append(div);
  div.innerHTML += `
<label>
  Uploading File: <progress id="prog" value="0"></progress>
</label>
<p>Estimated time remaining: <span id="eta"></span></p>`;
  progBar = document.getElementById("prog");
  eta = document.getElementById("eta");
}

function prog(e) {
  var ratio = e.loaded/e.total
  progBar.value = ratio;
  if (Date.now() - lasttime > 1000) {
    updateETA(ratio);
  }
}

function end() {
  document.querySelector("body").innerHTML = `
<p>Upload completed!</p>
<p><a href="https://soundgasm.net/upload">Upload another</a></p>`
}

function updateETA(ratio) {
  lasttime = Date.now();
  var totalTime = (Date.now() - starttime)/ratio;
  var etaTime = totalTime*(1-ratio);
  eta.innerHTML = msToTime(etaTime);
}

//modified from https://stackoverflow.com/a/19700358
function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor(duration / (1000 * 60 * 60));
  
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}