// ==UserScript==
// @name        GitLab - Squash n' Merge
// @description Defaults to squash commits and remove source branches on merge
// @author      Sam McLeod | https://twitter.com/s_mcleod | https://smcleod.net
// @include     /^https?://gitlab.*/.*/.*/merge_requests/new*
// @icon         https://gitlab.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png
// @license MIT
// @version 1.0.1
// check remove-source-branch-input checkbox
// check merge-param-checkbox checkbox
//
// @namespace https://greasyfork.org/users/97169
// @downloadURL https://update.greasyfork.org/scripts/38211/GitLab%20-%20Squash%20n%27%20Merge.user.js
// @updateURL https://update.greasyfork.org/scripts/38211/GitLab%20-%20Squash%20n%27%20Merge.meta.js
// ==/UserScript==

// Check remove source branch
checkThem([].slice.call(document.querySelectorAll('input[type="checkbox"]' && 'input[id="merge_request_force_remove_source_branch"]')));

// Check squash merge request
checkThem([].slice.call(document.querySelectorAll('input[type="checkbox"]' && 'input[id="merge_request_squash"]')));

function checkThem(nodes) {
  nodes.forEach(function (n) {
    n.checked = true;
  });
}
