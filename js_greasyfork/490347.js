// ==UserScript==
// @name        zermelo password
// @namespace   https://ozhw.zportal.nl/
// @description show password in zermelo
// @version     0.7
// @match       *://ozhw.zportal.nl/
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       unsafeWindow
// @run-at      document_start
// @antifeature tracking
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490347/zermelo%20password.user.js
// @updateURL https://update.greasyfork.org/scripts/490347/zermelo%20password.meta.js
// ==/UserScript==




// Get the "password" input field
var passwordInput = document.getElementById("password");

// Change the type of the input field to "text"
passwordInput.type = "text";