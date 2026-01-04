// jshint esversion:6
// ==UserScript==
// @name        Disabled auto delete branch button
// @namespace   Violentmonkey Scripts
// @match       https://lg.ldco.dev/*merge_requests/new*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/6/29 上午10:53:16
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469687/Disabled%20auto%20delete%20branch%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/469687/Disabled%20auto%20delete%20branch%20button.meta.js
// ==/UserScript==

(function main(){
  const autoDeleteBranchButton = document.getElementById('merge_request_force_remove_source_branch');
  autoDeleteBranchButton && (autoDeleteBranchButton.checked = false);
})();