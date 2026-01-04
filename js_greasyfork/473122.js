// ==UserScript==
// @name        GET PGN - followchess.com
// @namespace   Violentmonkey Scripts
// @match       https://live.followchess.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/8/2023, 1:09:32 PM
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473122/GET%20PGN%20-%20followchesscom.user.js
// @updateURL https://update.greasyfork.org/scripts/473122/GET%20PGN%20-%20followchesscom.meta.js
// ==/UserScript==


function print_pgn() {
  var x = document.querySelectorAll("*[class^='live-game_chesspgnbox']");
  var pgn = "";
  for(var i=0;i < x[0].children.length; i++){
    if(i == 0) {
      pgn = pgn + x[0].children[i].textContent
    }
    else {
      pgn = pgn +' ' + x[0].children[i].textContent;
    }
  }
  console.log(pgn);
  window.location = encodeURI("https://lichess.org/analysis/pgn/" + pgn + "?color=white");
}

function add_button() {
  var element = document.createElement("button");
  //Assign different attributes to the element.
  element.type = "button";
  element.innerHTML = "analyze"; // Really? You want the default value to be the type string?
  element.name = "analyze"; // And the name too?
  element.onclick = print_pgn;
  var foo = document.querySelectorAll("*[class^='live-game_controlbox']")[0];
  //Append the element in page (in span).
  foo.appendChild(element);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = async function () {
   await sleep(4000);
   console.log("loaded");
   add_button();
 }