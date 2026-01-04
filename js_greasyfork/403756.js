// ==UserScript==
// @name        Notion.so - Hide The Crap
// @name:en     Notion.so - Hide The Crap
// @description Show/Hide the properties section in Notion pages
// @namespace   https://github.com/smartnora
// @match       https://www.notion.so/*
// @run-at      document-start
// @version     0.0.3
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/403756/Notionso%20-%20Hide%20The%20Crap.user.js
// @updateURL https://update.greasyfork.org/scripts/403756/Notionso%20-%20Hide%20The%20Crap.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Edit these to change the text
const HIDE_TEXT = "🧹 Hide The Crap";
const SHOW_TEXT = "💩 Show The Crap";
////////////////////////////////////

// Code below
GM.getValue("hidecrap", false).then((val) => {
  window.hidden_crap = val;
})

function set_crap(hide) {
  let crap = getCommentBlock().parentElement;
  if (hide) {
    crap.classList.add("hiddencrap");
    newButton.innerText = SHOW_TEXT;
  } else {
    crap.classList.remove("hiddencrap");
    newButton.innerText = HIDE_TEXT;
  }
  GM.setValue("hidecrap", hide);
}
  
  
function toggle_crap() {
  window.hidden_crap = !window.hidden_crap;
  set_crap(window.hidden_crap);
}

function getCommentBlock() {
  let comments = document.querySelector('.notion-page-view-discussion');
  if (comments == null) {
    return null;
  }
  return comments;
}

function createClass(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule) 
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name+"{"+rules+"}",0);
}

// TODO: Make this continuously look for new divs
function button_setup() {
  console.log("Button Setup");
  if (getCommentBlock() == null) {
    window.requestAnimationFrame(button_setup);
  } else {
    
    // Let's double check something real quick
    if (getCommentBlock().classList.contains("crap-setup")) {
      // Abort
      return;
    }
    
    newButton = document.createElement("div");
    newButton.innerText = HIDE_TEXT;
    newButton.style="float:left; cursor: pointer; display: inline-flex;font-size: 14px; color: rgba(55, 53, 47, 0.4); margin: 10px";
    newButton.addEventListener('click', toggle_crap);
    getCommentBlock().parentElement.parentElement.insertAdjacentElement('beforebegin', newButton);
    getCommentBlock().classList.add("crap-setup");
    set_crap(window.hidden_crap);
  }
}
createClass('.hiddencrap',"display: none;");
// Call it once
button_setup();
