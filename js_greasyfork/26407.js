// ==UserScript==
// @name         Happyfor.win - By - SnKXXs-agario
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  hack ,Tricksplit , doblesplit , etc
// @author       SnKXXs y LaloYT
// @icon         https://yt3.ggpht.com/-_3mXLLjZmXA/AAAAAAAAAAI/AAAAAAAAAAA/n0AfuhvZe3o/s100-c-k-no-mo-rj-c0xffffff/photo.jpg
// @match        http://agar.io/*
// @match        http://gota.io/*
// @match        http://happyfor.win/*
//@grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26407/Happyforwin%20-%20By%20-%20SnKXXs-agario.user.js
// @updateURL https://update.greasyfork.org/scripts/26407/Happyforwin%20-%20By%20-%20SnKXXs-agario.meta.js
// ==/UserScript==

   //replaces title
   //h2 selects all h2 elements
   $("h2").replaceWith('<h4>DEADERS EXTENCION</h4>');

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

//List instructions
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> - <code>INSTRUCIONES CRACK<code> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Presiona & sostener <b>W</b> or <b>Q</b> el macro encienda</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_t'> Presiona <b>T</b> split 16</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_a'> Presiona <b>A</b> triple split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Presiona <b>D</b> double </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_s'> Presiona <b>S</b> 11 split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Presiona <b>H</b> posicion orizontel linesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> Presiona <b>V</b> Posicion vertical linesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> - <code>By -??? y ωєяиєя<code> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> - <code>Esperamos que les guste<code> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> - <code>V/5.1<code> </span></span></center>";

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
    case 69: //Tricksplit Macro (ñ)
      var ñ = 35;
      for (var ñ2 = 0; ñ2 < 4; ñ2++) {
        setTimeout(split, ñ);
        ñ *= 2;
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
