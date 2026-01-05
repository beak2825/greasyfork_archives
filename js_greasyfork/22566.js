// ==UserScript==
// @name         TMacros
// @namespace    https://greasyfork.org/scripts/22566-tmacros/code/TMacros.user.js
// @version      3.1
// @description  The official ƬҲ Clan Userscript!
// @author       Traxxr
// @match        agar.io
// @match        agar.io/*
// @match        http://agar.io
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @icon         http://i.imgur.com/fhOvogY.png
// @icon64       http://i.imgur.com/a1Uxhh3.png
// @downloadURL https://update.greasyfork.org/scripts/22566/TMacros.user.js
// @updateURL https://update.greasyfork.org/scripts/22566/TMacros.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
//List all of the instructions
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Press & hold <b>W</b> for macro feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_t'> Press <b>Shift</b> to tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_a'> Press <b>E</b> or <b>H</b> to split 3x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>Q</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_g'>Created by <a href=http://youtube.com/user/biblerule1>Traxxr</a></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_f'>Our tag: ƬҲ</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_f'><a href=http://tinyurl.com/txofficialdiscord>Our Discord</a></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_f'>Version (click for update):</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_f'><a href=https://greasyfork.org/scripts/22566-tmacros/code/TMacros.user.js><b><h1>3.1</h1></b></a></span></span></center>";

function autoSet() {
  if (document.getElementById("overlays").style.display!="none") {
    document.getElementById("settings").style.display = "block";
    //Show player mass
    if (document.getElementById('showMass').checked) {
        document.getElementById('showMass').click();
    }   document.getElementById('showMass').click();
    //Skip stats (it can get annoying, so im setting it to auto
    if (document.getElementById('skipStats').checked) {
        document.getElementById('skipStats').click();
    }   document.getElementById('skipStats').click();
  } else {setTimeout(autoSet, 100);}
}

//Load Tmacros
var canFeed = false;
function keydown(event) {
  switch (event.keyCode) {
    case 87: //Feeding Macro (w)
      canFeed = true;
      feed();
      break;
    case 16: //Tricksplit Macro (shift)
      var shift = 16;
      for (var t2 = 0; t2 < 4; t2++) {
          split();
          split();
          split();
          split();
        t *= 2;
      }
      break;
    case 69: //Triplesplit Macro (e)
      var a = 82;
      for (var a2 = 0; a2 < 3; a2++) {
          split();
          split();
        a *= 2;
      }
      break;
    case 72: //Triplesplit Macro (h)
      var three = 72;
      for (var three2 = 0; three2 < 3; three2++) {
          split();
          split();
          split();
        three *= 2;
      }
      break;
    case 81: //Doublesplit Macro (q)
      split();
      split();
      break;
    case 72: 
      X = window.innerWidth / 2;
      Y = window.innerHeight / 2;
      $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
      break;
    case 86: 
      X = window.innerWidth / 2;
      Y = window.innerHeight / 2.006;
      $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
      break;
  }
}


function keyup(event) {
  if (event.keyCode == 87 || event.keyCode == 81) canFeed = false;
}


function feed() {
  if (canFeed) {
    window.onkeydown({keyCode: 87});
    window.onkeyup({keyCode: 87});
    setTimeout(feed, 0);
  }
}


function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}