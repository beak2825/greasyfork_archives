// ==UserScript==
// @name Eruda Defaults
// @match *://*/*
// @grant none
// @run-at document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1312904
// @description Set default settings across sites for the Eruda console
// @version 0.0.1.20240608114922
// @downloadURL https://update.greasyfork.org/scripts/497352/Eruda%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/497352/Eruda%20Defaults.meta.js
// ==/UserScript==

if (!localStorage['eruda-dev-tools']) localStorage['eruda-dev-tools'] = '{"transparency":1,"displaySize":40,"theme":"Dark"}';