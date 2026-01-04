// ==UserScript==
// @name ashrfd+poqzn.xyz bypass
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Automatically submit a form on ashrfd.xyz to bypass it
// @author Minoa, Greasy MF Fork
// @match https://poqzn.xyz/*
// @match https://ashrfd.xyz/*
// @match https://ashrff.xyz/*
// @match https://tryzt.xyz/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493648/ashrfd%2Bpoqznxyz%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/493648/ashrfd%2Bpoqznxyz%20bypass.meta.js
// ==/UserScript==

(function() {
'use strict';

// Your code to be executed on page load
window.addEventListener('load', function() {
// Check if the form exists
var userForm = document.querySelector("#userForm");
if (userForm) {
// Create hidden input element

var result = document.evaluate('//*[@id="myModal"]/div[1]/center/script', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
var outres = result.singleNodeValue.innerHTML;
outres = outres.substring(outres.search(/validator/))
var ranname = outres.substring(0, outres.search(/\";/));

var el = document.createElement("input");
el.type = "hidden";
el.name = ranname;
el.value = "true";
userForm.appendChild(el);

// Disable button
var btn = document.querySelector("#cbt");
if (btn) {
btn.innerText = "Please wait...";
btn.disabled = true;
}

// Submit the form
userForm.submit();
}
});
})();