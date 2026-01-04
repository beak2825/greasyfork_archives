// ==UserScript==
// @name         Fast Linesplit (like fast split)
// @namespace    Put your cursor on top of on of the dots and press U
// @version      1.1
// @description  Put your cursor on top of on of the dots and press U
// @author       Net#1872
// @license      GPL-3.0-or-later
// @match        https://cellcraft.io/
// @match        https://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460111/Fast%20Linesplit%20%28like%20fast%20split%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460111/Fast%20Linesplit%20%28like%20fast%20split%29.meta.js
// ==/UserScript==

var split = "U"
window.addEventListener('keydown', keydown);
setTimeout(function() {
    split = split.charCodeAt(0)

}, 50)
function fsLine(){
    $("#canvas").trigger($.Event("keydown", { keyCode: 84}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 84}));
}
function freezeKey() {
    $("#canvas").trigger($.Event("keydown", { keyCode: 70}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 70}));
}

function keydown(event) {
    if(event.keyCode == split){
        fsLine()
        setTimeout(freezeKey, 115)
        setTimeout(freezeKey, 165)
    }
}



$("head").append(`<style>
.point {
  background-color:#333;
}

.point:hover {
  background-color: orange;
}
</style>`);

//Credit to wynell for the window.innerHeight and window.innerWidth

let [w, h] = [, window.innerHeight]
$('body').append(`
<div class="point" id="point-top" onclick="fsLine()" style="border: 2px solid white; border-radius: 100%; width: 15px; height: 15px; position: fixed; left: ${
  window.innerWidth / 2
}px; top: ${0}px; transform: translate(-50%, -50%);"></div>
<div class="point" id="point-right" onclick="fsLine()" style="border: 2px solid white; border-radius: 100%; width: 15px; height: 15px; position: fixed; left: ${
  window.innerWidth
}px; top: ${window.innerHeight / 2}px; transform: translate(-50%, -50%);"></div>
<div class="point" id="point-bottom" onclick="fsLine()" style="border: 2px solid white; border-radius: 100%; width: 15px; height: 15px; position: fixed; left: ${
  window.innerWidth / 2
}px; top: ${window.innerHeight}px; transform: translate(-50%, -50%);"></div>
<div class="point" id="point-left" onclick="fsLine()" style="border: 2px solid white; border-radius: 100%; width: 15px; height: 15px; position: fixed; left: ${0}px; top: ${
  window.innerHeight / 2
}px; transform: translate(-50%, -50%);"></div>
</div>`)
$('#settingTab3,.rab-radius').click(function (e) {
  $('#roleSettings').css('display', 'block')
  $('#cLinesplitOverlay')
    .removeAttr('disabled')
    .parent()
    .parent()
    .css('display', 'block')
})

$(window).resize(function (e) {
  let [w, h] = [window.innerWidth, window.innerHeight]
  $('#point-top')
    .css('left', `${window.innerWidth / 2}px`)
    .css('top', `${0}px`)
  $('#point-right')
    .css('left', `${window.innerWidth}px`)
    .css('top', `${window.innerHeight / 2}px`)
  $('#point-bottom')
    .css('left', `${window.innerWidth / 2}px`)
    .css('top', `${window.innerHeight}px`)
  $('#point-left')
    .css('left', `${0}px`)
    .css('top', `${window.innerHeight / 2}px`)
})

