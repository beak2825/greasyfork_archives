// ==UserScript==
// @name        getGamepads not supported fix
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description for browsers that don't support navigator.getGamepads()
// @author      BZZZZ
// @include     *
// @version     0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/424095/getGamepads%20not%20supported%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/424095/getGamepads%20not%20supported%20fix.meta.js
// ==/UserScript==

if(typeof window.navigator.getGamepads!=="function")window.navigator.getGamepads=window.Array;