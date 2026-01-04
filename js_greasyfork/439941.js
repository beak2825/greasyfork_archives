// ==UserScript==
// @name         Sweardle - Word Reveal Hack
// @namespace    q1k
// @version      1.1.1
// @description  This script adds an element to the bottom of the page with the daily word. Simply hover & click it and the daily word is revealed. Always "guess" the word on the first try and impress your friends.
// @author       q1k
// @include      *://sweardle.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439941/Sweardle%20-%20Word%20Reveal%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/439941/Sweardle%20-%20Word%20Reveal%20Hack.meta.js
// ==/UserScript==

var mydiv = document.createElement("div");
mydiv.setAttribute("id","word-reveal");
var styles = document.createElement("style");
styles.innerHTML="#word-reveal{position:fixed;bottom:0;left:0;right:0;} body{overflow:auto;margin:0;padding:0;} *{box-sizing:border-box;} #word-reveal{user-select:none;text-align:center;line-height:1.5em;background:#555;color:#555;} #word-reveal:hover{color:white;} .game-id{display:none;}";

var game = document.body;
game.appendChild(styles);
game.appendChild(mydiv);

var fetched=false;
var fetching=false;

const xhr = new XMLHttpRequest();
xhr.open('GET', url, true);

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText.match(/\((.*)\)/s)[1]);
            mydiv.textContent = "Today's word: " + atob(data.checksum).toUpperCase();
      fetched = true;
    } else {
      // error
      mydiv.textContent = "Failed to fetch word";
    }
    // Complete callback (always runs)
    fetching = false;
  }
};

mydiv.addEventListener('click',function(e){
    if(fetching || fetched){ return }
    fetching=true;
    mydiv.textContent = "revealing...";
    
    xhr.send();
});
mydiv.innerHTML = "Click to reveal today's word";

