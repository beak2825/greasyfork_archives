// ==UserScript==
// @name     Hide Facebook Likes/Reacts
// @version  1
// @grant    none
// @run-at   document-start
// @match    https://*.facebook.com/*
// @license  GNU General Public License v3.0 only
// @supportURL https://gitlab.com/zyphlar/hide-facebook-likes
// @contributionURL https://gitlab.com/zyphlar/hide-facebook-likes
// @compatible firefox
// @namespace https://greasyfork.org/users/236588
// @description Clean up your FB notification feed and news feed by hiding information about who's liked what.
// @downloadURL https://update.greasyfork.org/scripts/395296/Hide%20Facebook%20LikesReacts.user.js
// @updateURL https://update.greasyfork.org/scripts/395296/Hide%20Facebook%20LikesReacts.meta.js
// ==/UserScript==


// Hide Facebook Likes and Reacts
// Copyright (C) 2020  zyphlar
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


"use strict";


function hideReacts() {
  setInterval(doReactHiding, 10000);
}

function doReactHiding(){  
  hideElementsBySelector("#fbNotificationsFlyout li[data-gt*='feedback_reaction_generic']"); // generic reaction notifications
  hideElementsBySelector("div[data-testid='fbFeedStoryUFI/feedbackSummary']"); // reaction and share icons
}

function hideElementById(id) {
  var e = document.getElementById(id);
  if (e) {
    e.style = "display: none;";
  }
}

function hideElementsByClassName(name) {
  var e = document.getElementsByClassName(name);
  for (var i=0;i<e.length;i++) {
    e[i].style = "display: none;";
  }
}

function hideElementsBySelector(selector) {
  var f = document.querySelectorAll(selector);
  for (var i=0;i<f.length;i++) {
    f[i].style = "display: none;";
  }
}

hideReacts();

window.addEventListener("load", hideReacts);