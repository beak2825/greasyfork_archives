// ==UserScript==
// @name        New Reddit Hot Redirect
// @namespace   https://greasyfork.org/en/users/594496-divided-by
// @author      dividedby
// @description Redirects default frontpage from 'best' to 'hot' and entire site to new.reddit.com
// @version     1.2
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=dividedbyerror@gmail.com&item_name=Reddit+Redirect+Donation
// @contributionAmount  $1
// @include     /^https:\/\/[a-z0-9.]*\.?reddit.com/
// @run-at      document-start

// @downloadURL https://update.greasyfork.org/scripts/495315/New%20Reddit%20Hot%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/495315/New%20Reddit%20Hot%20Redirect.meta.js
// ==/UserScript==

(function () {
  const currentHost = window.location.hostname;
  const currentPath = window.location.pathname;

  if (currentHost === "www.reddit.com") {
    window.location.replace(`https://new.reddit.com${currentPath}`);
  } else if (currentHost.endsWith(".reddit.com") && currentPath === "/") {
    window.location.replace(`${window.location.origin}/hot`);
  }
})();
