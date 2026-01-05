// ==UserScript==
// @name        13 Macros For Agar.io DutchGaming HD Youtub Link Under!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  13 macro's for feeding, linesplits, tricksplits, etc. And enables show mass and skip stats by default :)
// @author       Megabyte918
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/23865/13%20Macros%20For%20Agario%20DutchGaming%20HD%20Youtub%20Link%20Under%21.user.js
// @updateURL https://update.greasyfork.org/scripts/23865/13%20Macros%20For%20Agario%20DutchGaming%20HD%20Youtub%20Link%20Under%21.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

//List instructions
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Press & hold <b>W</b> or <b>Q</b> for macro feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_t'> Press <b>E</b>, <b>T</b>, or <b>4</b> to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_a'> Press <b>A</b> or <b>3</b> to split 3x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> or <b>2</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_s'> Press <b>S</b> or <b>1</b> to split 1x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Press <b>H</b> for horizontal linesplit position</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Press <b>V</b> for vertical linesplit position</span></span></center>";

//Auto-enable show mass/skip stats
//IMPORTANT: You must uncheck showmass/skip stats first then recheck them for it to auto save every time
function autoSet() {
  if (document.getElementById("overlays").style.display!="none") {
    document.getElementById("settings").style.display = "block";
    //Show mass
    if (document.getElementById('showMass').checked) {
        document.getElementById('showMass').click();
    }   document.getElementById('showMass').click();
    //Skip stats
    if (document.getElementById('skipStats').checked) {
        document.getElementById('skipStats').click();
    }   document.getElementById('skipStats').click();
  } else {setTimeout(autoSet, 100);}
}

//Load macros
var canFeed = false;
function keydown(event) {
  switch (event.keyCode) {
    case 87: //Feeding Macro (w)
      canFeed = true;
      feed();
      break;
    case 81: //Feeding Macro (q)
      canFeed = true;
      feed();
      break;
    case 84: //Tricksplit Macro (t)
      var t = 35;
      for (var t2 = 0; t2 < 4; t2++) {
        setTimeout(split, t);
        t *= 2;
      }
      break;
    case 69: //Tricksplit Macro (e)
      var e = 35;
      for (var e2 = 0; e2 < 4; e2++) {
        setTimeout(split, e);
        e *= 2;
      }
      break;
    case 52: //Tricksplit Macro (4)
      var four = 35;
      for (var four2 = 0; four2 < 4; four2++) {
        setTimeout(split, four);
        four *= 2;
      }
      break;
    case 65: //Triplesplit Macro (a)
      var a = 35;
      for (var a2 = 0; a2 < 3; a2++) {
        setTimeout(split, a);
        a *= 2;
      }
      break;
    case 51: //Triplesplit Macro (3)
      var three = 35;
      for (var three2 = 0; three2 < 3; three2++) {
        setTimeout(split, three);
        three *= 2;
      }
      break;
    case 68: //Doublesplit Macro (d)
      split();
      setTimeout(split, 50);
      break;
    case 50: //Doublesplit Macro (2)
      split();
      setTimeout(split, 50);
      break;
    case 83: //Space Macro (s)
      split();
      break;
    case 49: //Space Macro (1)
      split();
      break;
    case 72: //Horizontal linesplit (h)
      X = window.innerWidth / 2;
      Y = window.innerHeight / 2;
      $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
      break;
    case 86: //Vertical linesplit (v)
      X = window.innerWidth / 2;
      Y = window.innerHeight / 2.006;
      $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
      break;
  }
}

//When a player lets go of Q or W, stop feeding
function keyup(event) {
  if (event.keyCode == 87 || event.keyCode == 81) canFeed = false;
}

//Alias for W key
function feed() {
  if (canFeed) {
    window.onkeydown({keyCode: 87});
    window.onkeyup({keyCode: 87});
    setTimeout(feed, 0);
  }
}

//Alias for space
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}




