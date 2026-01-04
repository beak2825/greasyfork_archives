// ==UserScript==
// @name GitHub Sun* SSO
// @namespace GitHub
// @icon https://avatars.githubusercontent.com/u/2322183
// @run-at document-start
// @match *://github.com/framgia*
// @version 0.0.1
// @description Auto SSO
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496278/GitHub%20Sun%2A%20SSO.user.js
// @updateURL https://update.greasyfork.org/scripts/496278/GitHub%20Sun%2A%20SSO.meta.js
// ==/UserScript==


document.addEventListener("DOMContentLoaded", function(event) {
  if (document.getElementsByClassName('org-sso').length) {
    document.getElementsByTagName('form')[0].submit();
  }
});

