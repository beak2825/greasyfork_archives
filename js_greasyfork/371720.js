// ==UserScript==
// @name Love Scratch Projects
// @version 1.0
// @description  Love every scratch project you visit
// @match *://scratch.mit.edu/projects*
// @namespace https://greasyfork.org/users/208839
// @downloadURL https://update.greasyfork.org/scripts/371720/Love%20Scratch%20Projects.user.js
// @updateURL https://update.greasyfork.org/scripts/371720/Love%20Scratch%20Projects.meta.js
// ==/UserScript==
var txt = document.URL;
txt.split('#')[0]
var numb = txt.match(/\d/g);
numb = numb.join("");

$.ajax({type: "PUT",url: "https://scratch.mit.edu/site-api/users/lovers/" + numb + "/add/"})