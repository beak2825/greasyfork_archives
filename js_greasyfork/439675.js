// ==UserScript==
// @name         Wordle - Word Reveal Hack
// @namespace    q1k
// @version      1.8.0
// @description  This script adds an element to the bottom of the page with the daily word. Simply hover & click it and the daily word is revealed. Always "guess" the word on the first try and impress your friends.
// @author       q1k
// @match        *://www.nytimes.com/games/wordle/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439675/Wordle%20-%20Word%20Reveal%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/439675/Wordle%20-%20Word%20Reveal%20Hack.meta.js
// ==/UserScript==

var mydiv = document.createElement("div");
mydiv.setAttribute("id","word-reveal");
var styles = document.createElement("style");
styles.innerHTML="*{box-sizing:border-box;} body{margin:0;display:flex;flex-direction:column;} body>div:not([class]){height:calc(100% - 1.5em);position:relative;}#word-reveal{order:3;width:100%;height:1.5em;margin-left:-100%;margin:0; background:#555;color:#555;text-align:center;line-height:1.5em;z-index:10;user-select:none;} #word-reveal:hover{color:white;}";

//var gam = document.querySelector("#wordle-app-game");
document.body.appendChild(mydiv);
document.body.appendChild(styles);
/*
mydiv.addEventListener('click',function(e){
    mydiv.textContent = "Today's word: " + JSON.parse(localStorage['nyt-wordle-state']).solution.toUpperCase();
});
mydiv.innerHTML = "Click to reveal today's word";
*/

var fetched=false;
var fetching=false;
var date = new Date().toISOString().split('T')[0];
var fetchURL = 'https://www.nytimes.com/svc/wordle/v2/' + date + '.json';

const xhr = new XMLHttpRequest();
xhr.open('GET', fetchURL, true);

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      mydiv.textContent = "Today's word: " + data.solution.toUpperCase();
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


