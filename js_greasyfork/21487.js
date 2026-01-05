// ==UserScript==
// @name        Gmail Basic Select All
// @namespace   mailto:badocelot@badocelot.com
// @description Add select all/none button to Gmail Basic
// @include     https://mail.google.com/mail/*/h/*
// @include     https://mail.google.com/mail/h/*
// @version     3
// @license     MIT/Expat
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21487/Gmail%20Basic%20Select%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/21487/Gmail%20Basic%20Select%20All.meta.js
// ==/UserScript==

/*  User script to add a "select all/none" button to Gmail Basic
 *
 *  @licstart The following is the entire license notice for the JavaScript
 *  code in this file.
 *
 *  Copyright (C) 2016 James M. Jensen II
 *
 *  Permission is hereby granted, free of charge, to any person obtaining
 *  a copy of this software and associated documentation files (the
 *  "Software"), to deal in the Software without restriction, including
 *  without limitation the rights to use, copy, modify, merge, publish,
 *  distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to
 *  the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included
 *  in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 *  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  @licend The following is the entire license notice for the JavaScript
 *  code in this file.
 */

// So, the way this works is we look up the buttons that start the bars
// above and below the email list, and for each one we create a button to
// inject before the archive button.
//
// TODO: Get this working on Sent Mail page, where the bars don't start
// with a button or other named item.  Contacts would also be nice.
//
// When the button is clicked, it loops through the checkboxes on each
// conversation and counts how many are checked or unchecked.  If the majority
// are checked, it unchecks all of them, and vice versa.

function toggleBoxes () {
  var i;
  var checkboxes = document.getElementsByName('t');

  // Check whether majority are checked or unchecked to determine
  // which way to toggle them
  var num_checked = 0;
  var num_unchecked = 0;
  for (i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      num_checked++;
    } else {
      num_unchecked++;
    }
  }

  var shouldCheck;
  if (num_unchecked < num_checked) {
    shouldCheck = false;
  } else {
    shouldCheck = true;
  }

  // (un)check all checkboxes
  for (i = 0; i < checkboxes.length; i++) {
    var c = checkboxes[i];
    c.checked = shouldCheck;
  }
}

var i = 0;

// Figure out what the first button on the top and bottom bars is, checking
// the following in order:
//   * Archive (nvp_a_arch)
//   * Remove Star (nvp_bu_rs)
//   * Discard Drafts (nvp_a_dd)
//   * Delete Forever (nvp_a_dl)
//   * Remove label (nvp_bu_rl)
//   * Move to Inbox (nvp_a_ib)
var buttonNames = [
  'nvp_a_arch',
  'nvp_bu_rs',
  'nvp_a_dd',
  'nvp_a_dl',
  'nvp_bu_rl',
  'nvp_a_ib'
];
var firstButtons = [];
while (i < buttonNames.length && firstButtons.length === 0) {
  firstButtons = document.getElementsByName(buttonNames[i]);
  i++;
}

for (i = 0; i < firstButtons.length; i++) {
  var btn = firstButtons[i];
  
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.innerHTML = '&#x2714;';
  
  // hack to fix the right-side gap -- I have no idea why this is necessary
  toggle.style.marginRight = '6px';
  
  toggle.onclick = toggleBoxes;
  
  var buttonRow = btn.parentElement;
  buttonRow.insertBefore(toggle, btn);
}
