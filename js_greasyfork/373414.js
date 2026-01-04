// ==UserScript==
// @name         AGAR.IO ( macro fast split + macro fast feed + removed ads )
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agar.io - Macro Fast Split + Macro Fast Feed + Removed ADS
// @author       I_HAVE_A_REALLY_LONG_NICKNAME
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373414/AGARIO%20%28%20macro%20fast%20split%20%2B%20macro%20fast%20feed%20%2B%20removed%20ads%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373414/AGARIO%20%28%20macro%20fast%20split%20%2B%20macro%20fast%20feed%20%2B%20removed%20ads%20%29.meta.js
// ==/UserScript==

// style & ads remove
$(document).ready(function() {
  $('#mainui-play').css({
    'height': '400px'
  });
  $("#instructions").append('<center><span class=\'text-muted\'> Press <b>D</b> to double split</span></center>');
  $("#instructions").append('<center><span class=\'text-muted\'> Press <b>F</b> to triple split</span></center>');
  $("#instructions").append('<center><span class=\'text-muted\'> Press <b>A</b> to 16 split</span></center>');
  $("#instructions").append('<center><span class=\'text-muted\'> Press <b>S</b> to freeze / stop cell</span></center>');
  $("#instructions").append('<center><span class=\'text-muted\'> Press and hold <b>W</b> to macro fast feed</span></center>');
  $('#advertisement').remove();
  $('#mainui-promo').remove();
  $('#adsGameOver').remove();
  $('#mainui-ads').remove();
  $('#adsBottom').remove();
});

// macro mass ejector & split
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var Ejects = false;
var fast = 25;

function keydown(e) {
  if (e.keyCode == 87 && Ejects === false) {
    Ejects = true;
    setTimeout(CellEject, fast);
  }
  if (e.keyCode == 68) { // key D = DOUBLESPLIT 
    CellSplit();
    setTimeout(CellSplit, fast);
  }
  if (e.keyCode == 70) { // key F = TRIPLESPLIT
    CellSplit();
    setTimeout(CellSplit, fast);
    setTimeout(CellSplit, fast * 2);
  }
  if (e.keyCode == 65) { // key A = 16 SPLIT
    CellSplit();
    setTimeout(CellSplit, fast);
    setTimeout(CellSplit, fast * 2);
    setTimeout(CellSplit, fast * 3);
  }
  if (e.keyCode == 83) {
    X = window.innerWidth / 2;
    Y = window.innerHeight / 2;
    $("canvas").trigger($.Event("mousemove", {
      clientX: X,
      clientY: Y
    }));
  }
}

function keyup(e) {
  if (e.keyCode == 87) {
    Ejects = false;
  }
}

function CellEject() {
  if (Ejects) {
    window.onkeydown({
      keyCode: 87
    });
    window.onkeyup({
      keyCode: 87
    });
    setTimeout(CellEject, fast);
  }
}

function CellSplit() {
  $("body").trigger($.Event("keydown", {
    keyCode: 32
  }));
  $("body").trigger($.Event("keyup", {
    keyCode: 32
  }));
}