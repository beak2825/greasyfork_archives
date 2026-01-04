// ==UserScript==
// @name     Hide Facebook Comments
// @version  3
// @grant    none
// @run-at   document-start
// @match    https://*.facebook.com/*
// @license  GNU General Public License v3.0 only
// @supportURL https://gitlab.com/zyphlar/hide-facebook-comments
// @contributionURL https://gitlab.com/zyphlar/hide-facebook-comments
// @compatible firefox
// @namespace https://greasyfork.org/users/236588
// @description COMMENTS CONSIDERED HARMFUL: We all know the phrase "don't read the comments," and yet we do. Squash these pesky varmints once and for all with this helpful UserScript.
// @downloadURL https://update.greasyfork.org/scripts/376198/Hide%20Facebook%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/376198/Hide%20Facebook%20Comments.meta.js
// ==/UserScript==


// Hide Facebook Comments
// Copyright (C) 2019  zyphlar
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


function hideComments() {
  setInterval(doCommentHiding, 10000);
}

function doCommentHiding(){
  hideElementsByClassName("UFIList"); // page comment box
  hideElementsByClassName("comment_link"); // page comment link
  hideElementsByClassName("_ipm");
  hideElementsByClassName("_3w53");
  hideElementsByClassName("_68wo");
  hideElementsByClassName("_666h"); // profile comment box
  hideElementsByClassName("_1bqu"); // <user> commented on your post.
  hideElementById("pagelet_ego_pane");
  hideElementById("pagelet_dock"); // bottom dock and notifications
  hideElementsBySelector("#fbNotificationsFlyout li[data-gt*='comment']"); // comment notifications 
  hideElementsBySelector("div[data-testid='fbSnowliftUFI/feedbackSummary']"); // gallery comment count
  hideElementsBySelector("div[data-testid='UFI2CommentsList/root_depth_0']"); // gallery comments
  //console.log("Hid");
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

hideComments();

window.addEventListener("load", hideComments);