// ==UserScript==
// @name         MyWasedaEnter
// @namespace    https://iaidp.ia.waseda.jp/idp/profile/SAML2/Redirect/SSO*
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match       https://iaidp.ia.waseda.jp/idp/profile/SAML2/Redirect/SSO*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383179/MyWasedaEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/383179/MyWasedaEnter.meta.js
// ==/UserScript==
document.addEventListener('keypress', onKeyPress)
document.getElementById("j_username").addEventListener('keypress', onKeyPress2)
document.getElementById("j_password").addEventListener('keypress', onKeyPress)
function onKeyPress(e) {
  if ( e.keyCode === 13) {
        document.getElementById("btn-save").click();
  }
}
function onKeyPress2(e) {
  if ( e.keyCode === 13) {
        document.getElementById("j_password").focus();
  }
}