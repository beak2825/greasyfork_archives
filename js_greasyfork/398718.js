// ==UserScript==
// @name     Force View Password
// @description Views all passwords in the page in cleartext by editing attribute info. Press E to activate.
// @version  1
// @grant    none
// @match    *://*/*
// @require  http://code.jquery.com/jquery-3.4.1.slim.min.js
// @namespace https://greasyfork.org/users/468281
// @downloadURL https://update.greasyfork.org/scripts/398718/Force%20View%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/398718/Force%20View%20Password.meta.js
// ==/UserScript==

let fields = $("input[type=password]").toArray();

localStorage.DEBUG ? console.log(fields) : 0;

$(document).on("keydown", function(k) {
	let key = k.which || k.keyCode;
  if (key == 69) {
    fields.forEach(f => f.setAttribute("type", "text"));
  }
});

$(document).on("keyup", function(k) {
	let key = k.which || k.keyCode;
  if (key == 69) {
    fields.forEach(f => f.setAttribute("type", "password"));
  }
});