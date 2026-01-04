// ==UserScript==
// @name        jQuery version
// @namespace   hairen
// @match       *://*/*
// @noframes
// @grant       none
// @version     1.0.3
// @author      -
// @description show jQuery version
// @require     https://unpkg.com/jquery@3.6.3
// @require https://greasyfork.org/scripts/459136-usergui/code/UserGui.js?version=1143683
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459501/jQuery%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/459501/jQuery%20version.meta.js
// ==/UserScript==


$(function () {
  console.log('v' + $().jquery)
})