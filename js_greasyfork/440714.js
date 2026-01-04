// ==UserScript==
// @name         @permutive/loggingEnabled:true
// @namespace    http://www.permutive.com/
// @version      1.0
// @description  Enable Permutive's logging from the SDK
// @author       You
// @icon         https://permutive.com/wp-content/themes/permutive/assets/img/symbol.svg
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440714/%40permutiveloggingEnabled%3Atrue.user.js
// @updateURL https://update.greasyfork.org/scripts/440714/%40permutiveloggingEnabled%3Atrue.meta.js
// ==/UserScript==

window.sessionStorage.setItem("__permutiveConfigQueryParams", JSON.stringify({ loggingEnabled: true }))