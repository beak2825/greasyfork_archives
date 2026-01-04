// ==UserScript==
// @name     Tinder Auto-Like
// @version  1.2
// @grant    none
// @match    *://tinder.com/*
// @description like in anynone each 3 seconds
// @namespace https://greasyfork.org/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/438494/Tinder%20Auto-Like.user.js
// @updateURL https://update.greasyfork.org/scripts/438494/Tinder%20Auto-Like.meta.js
// ==/UserScript==

var interval = 200;
var autoEnabled = false;
var enabled = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(enabled);
enabled.style = "position:absolute; top:0px; left:140px; font-size: 12px;";
enabled.innerHTML = `
<span>AutoLike:</span>
<span id="runningAuto" style="margin-left:5px;"></span>
<div>
  <button id="startAuto" style="border: 1px solid black;">Start</button>
  <button id="stopAuto" style="border: 1px solid black;">Stop</button>
<div>
<div>
  <input type="range" min="100" max="3000" value="200" step="100" class="slider" id="autoSlider" oninput="this.nextElementSibling.innerHTML = this.value + ' ms'">
  <div>200 ms</span>
</div>`;

function auto() {
    $('#runningAuto').html(autoEnabled ? 'Running' : 'Stopped')
    clearInterval(func)
    func = setInterval(auto, interval);
    interval = $('#autoSlider').val()
    if (!autoEnabled) return;
    let btn = $('.button')[3]
    if (btn) btn.click()

};

$('#startAuto').click(function(){autoEnabled = true; $('#runningAuto').html('Starting...')})
$('#stopAuto').click(function(){autoEnabled = false; $('#runningAuto').html('Stopping...')})

var func = setInterval(auto, interval);