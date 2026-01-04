/**
  The MIT License (MIT)

  Copyright (c) 2018 Sven Sigmond

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// ==UserScript==
// @name     		Hide and toggle furigana on NHK News Web Easy
// @version		    1.1
// @description   	Automatically hide the furigana (hiragana above kanji) on the NHK News Web Easy website. The furigana can be toggled back in and out of view by pressing the ~ (tilde) key or a combination of the Shift + F keys, which is usually found below the escape key.
// @author       	Sven Sigmond
// @match		    https://www3.nhk.or.jp/*
// @namespace       https://greasyfork.org/users/188897
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/368861/Hide%20and%20toggle%20furigana%20on%20NHK%20News%20Web%20Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/368861/Hide%20and%20toggle%20furigana%20on%20NHK%20News%20Web%20Easy.meta.js
// ==/UserScript==

// Keep track of states
var furiganaHidden = false;
var customStyleTag = null;

// Event listener
document.addEventListener("keyup", keyPushed);

// Create a custom style tag in the head of the page, so custom styles can be assigned for page elements
function addCustomStyleTag(){
  customStyleTag = document.createElement('style');
  customStyleTag.type = 'text/css';
  customStyleTag.classList.add('customStyleTag');
                      
  document.getElementsByTagName('head')[0].appendChild(customStyleTag);
}

// Apply whatever css is passed as an argument to the custom style tag
function setCustomStyle(css) { 
  customStyleTag.innerHTML = css;
}

// Apply custom css to show all furigana
function showFurigana() {
  setCustomStyle('rt { display: auto; }');
  
  furiganaHidden = false;
}

// Apply custom css to hide all furigana
function hideFurigana() {
  setCustomStyle('rt { display: none; }');
  
  furiganaHidden = true;
}

function keyPushed(e) {
  // Check if ~ (tilde) key or combination of (Shift + F) keys was pressed
  if ((e.keyCode === 192) || (e.shiftKey && e.keyCode == 70)) {
    // Show furigana if it's currenly hidden, or hide the furigana if it's currently visible
    if (furiganaHidden) {
    	showFurigana(); 
    } else {
      hideFurigana();
    }
  }
}

// INITIALIZE (run these functions once on page load)
addCustomStyleTag();
hideFurigana();