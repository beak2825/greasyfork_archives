// ==UserScript==
// @name        PR Anti-Edit
// @namespace   https://github.com/vintprox
// @description Untick checkbox allowing edits from maintainers for new pull and merge requests on GitHub and GitLab. Effectively, it prevents extraneous adding and modifying commits within your fork's branch acting as a source in PR/MR you create. May be useful to those of you who don't appreciate upstream maintainer tampering with your allegedly perfect work.
// @version     0.1
// @icon        https://github.com/vintprox/pr-anti-edit/raw/main/icon.png
// @license     GPL-3.0
// @author      vintprox
// @match       https://github.com/*/*/compare*
// @match       https://gitlab.com/*/merge_requests/new*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/452865/PR%20Anti-Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/452865/PR%20Anti-Edit.meta.js
// ==/UserScript==

(function () {
  let checkbox;

  switch (location.host) {
    case "github.com":
      checkbox = document.querySelector("input[name=collab_privs]");
      break;
    case "gitlab.com":
      checkbox = document.getElementById("merge_request_allow_collaboration");
      break;
  }

  if (!checkbox) throw new Error("[PR Anti-Edit] Cannot find checkbox to untick");

  checkbox.checked = false;
})();
