// ==UserScript==
// @name        Auto AWS SSO CLI - Close Window
// @namespace   Violentmonkey Scripts
// @match       https://*.awsapps.com/start/user-consent/login-success.html
// @grant       window.close
// @version     1.0
// @author      Nicholas Hawkes
// @description Close the tab when successful AWS SSO CLI login
// @homepage    https://gist.github.com/hawkesn/b710c3b7713b08d3a39959d4e06056f3
// @downloadURL https://update.greasyfork.org/scripts/426830/Auto%20AWS%20SSO%20CLI%20-%20Close%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/426830/Auto%20AWS%20SSO%20CLI%20-%20Close%20Window.meta.js
// ==/UserScript==

setInterval(() => {
  window.close()
}, 1000)