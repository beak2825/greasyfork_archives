// ==UserScript==
// @name     Facebook - hide annoying fields
// @version  1
// @grant    none
// @include  https://www.facebook.com/
// @description Hides some annoying messages on Facebook.
// 
// Hides the cookie-accept-policy
// Hides the "Remember password YES/NO" message
// @namespace https://greasyfork.org/users/166103
// @downloadURL https://update.greasyfork.org/scripts/37461/Facebook%20-%20hide%20annoying%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/37461/Facebook%20-%20hide%20annoying%20fields.meta.js
// ==/UserScript==

var megaphone = document.getElementById("pagelet_megaphone");
var cookieMessage = document.querySelector(".fbPageBanner");

if (megaphone) {
	megaphone.style.display = "none";
  console.log("Success: megaphone message has been hidden!");
} else {
  console.log("Not found. Megaphone message has NOT been hidden.");
}
if (cookieMessage && cookieMessage.getAttribute("data-testid")) {
  cookieMessage.style.display = "none";
  console.log("Success: cookie message has been hidden!");
} else {
  console.log("Not found. Cookie message has NOT been hidden.");
}
