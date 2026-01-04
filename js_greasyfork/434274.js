// ==UserScript==
// @name         CodeHS Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Yet another dark mode script. Why don't they have it built in?
// @author       Chase Davis
// @match        https://codehs.com/*
// @icon         https://www.google.com/s2/favicons?domain=codehs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434274/CodeHS%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/434274/CodeHS%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

const bg = '#303030';
const bg2 = '#404040';
const txtCol = '#c0c0c0';
const accent = '#005090';



var timer = setInterval(paint, 100) //Sets the script to re-paint the whole page every 0.01 seconds, so no need to refresh.
function paint() {

  try {
    document.getElementsByClassName('loaded ')[0].style.backgroundColor = bg;
    document.getElementsByClassName('loaded ')[0].style.color = txtCol;
    document.getElementById('logged-in-navbar').style.backgroundColor = bg2;
    document.getElementById('logged-in-navbar').style.color = txtCol;
  } catch(err){};

  try {
    document.getElementById('userpage-content').style.backgroundColor = bg;
    document.getElementById('userpage-content').style.color = txtCol;
  } catch(err){};

  try {
    document.getElementById('exercise-tab').style.backgroundColor = bg;
    document.getElementById('exercise-tab').style.color = txtCol;
  } catch(err){};

  try {
    document.getElementsByClassName('ace_content')[0].style.backgroundColor = bg;
    document.getElementsByClassName('ace_content')[0].style.color = txtCol;
    document.getElementsByClassName('editor-title')[0].style.color = txtCol;
    document.getElementsByClassName('ace_layer ace_gutter-layer ace_folding-enabled')[0].style.backgroundColor = bg2;
    document.getElementsByClassName('ace_layer ace_gutter-layer ace_folding-enabled')[0].style.color = txtCol;
    document.getElementsByClassName('ace_gutter-cell ace_gutter-active-line ')[0].style.backgroundColor = accent;
    document.getElementById('editor-bottombar-nav').style.backgroundColor = bg2;
  } catch(err){};

  try {
    document.getElementById('submit-button').style.backgroundColor = accent;
    document.getElementById('save-button').style.color = accent
    document.getElementById('save-button').style.borderColor = accent
  } catch(err){};

  try {
    document.getElementById('library-main').style.backgroundColor = bg;
    document.getElementById('editor-bottombar-nav').style.backgroundColor = bg2;
  } catch(err){};

  try{
    document.getElementsByClassName('stats-options-container')[0].style.backgroundColor = bg2;
    document.getElementsByClassName('stats-options-container')[0].style.color = txtCol;
    document.getElementsByClassName('stats-options-container')[0].style.borderColor = accent;
    document.getElementById('editor-bottombar-nav').style.backgroundColor = bg2;
    document.getElementById('next-button').style.backgroundColor = accent;
    let element = document.getElementsByClassName('quiz-questions')[0];
    for (let i = 0; i < element.children.length; i++) {
      element.children[i].style.backgroundColor = bg2;
      element.children[i].style.color = txtCol;
      element.children[i].style.borderColor = accent;
    }
  } catch(err){};

};

})();