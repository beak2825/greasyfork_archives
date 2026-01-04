"use strict";

// ==UserScript==
// @name        Wide Github [fork]
// @namespace   https://github.com/xthexder/wide-github
// @description Change all Github repository and gist pages to be full width and dynamically sized.
// @author      xthexder
// @copyright   2013+, xthexder (https://github.com/xthexder)
// @contributor Jason Frey (https://github.com/Fryguy)
// @contributor Marti Martz (https://github.com/Martii)
// @contributor Paul "Joey" Clark (https://github.com/joeytwiddle)
// @license     MIT; https://raw.githubusercontent.com/xthexder/wide-github/master/LICENSE
// @version     1.2.0-joey8
// @icon        https://raw.githubusercontent.com/xthexder/wide-github/master/icon.png
// @homepageURL https://github.com/xthexder/wide-github
// @supportURL  https://github.com/xthexder/wide-github/issues
// @include     *github.com*
// @grant       none
//// Added by Joey:
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/41026/Wide%20Github%20%5Bfork%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/41026/Wide%20Github%20%5Bfork%5D.meta.js
// ==/UserScript==

// @todo I like the 1500px limit for normal usage, but I want to go much wider when doing side-by-side diffs.
// Options for detection: Guess from the URL, or look for telltale elements in the HTML.
// Options for live updates: Apply new CSS when a change is detected (slow memory leak), or add a toggling class to the root of the page.

var styleSheet = "" +
"header .container," +
"header .container-lg {" +
  "width: auto !important;" +
  "margin-left: 20px !important;" +
  "margin-right: 20px !important;" +
  "min-width: 980px;" +
  "max-width: initial;" +
"}" +
// This id ensures our CSS is more specific, so it overrides the site's CSS, regardless of which order they are loaded
"#js-repo-pjax-container .container {" +
  "width: auto !important;" +
  //"margin-left: 20px !important;" +
  //"margin-right: 20px !important;" +
  "min-width: 980px;" +
  // I use zoom 90% in Chrome.  But that causes the left border of the file list to disappear, if I use an even max-width.  So I have to use an odd max-width.
  "max-width: 1499px;" +
  "margin-left: auto !important;" +
  "margin-right: auto !important;" +
  "padding-left: 20px;" +
  "padding-right: 20px;" +
"}" +
// But our specific rule above should not apply to wide pages
// (This ensures that pages showing split diffs use all the available width)
"body.split-diff #js-repo-pjax-container .container, body.split-diff #js-repo-pjax-container .container-lg, body.full-width #js-repo-pjax-container .container, body.full-width #js-repo-pjax-container .container-lg {" +
  "max-width: 100% !important;" +
"}" +
".full-width .container {" +
  "padding-left: auto !important;" +
  "padding-right: auto !important;" +
"}" +

// New PR split diff
".full-width .new-pr-form {" +
  "max-width: none !important;" +
"}" +

// Repository Issues
"#js-repo-pjax-container .repository-content .discussion-timeline {" +  // Issue body
  "margin-left: -220px;" +
  "padding-left: 220px;" +
  "width: 100% !important;" +
"}" +
// On PRs and issues there is a pretty vertical line that runs through all the commits and references.
// But the rule above pushes it out to the left, so we need to push it back into place.
"#js-repo-pjax-container .repository-content .discussion-timeline::before {" +
  "margin-left: 220px;" +
"}" +
".repository-content .discussion-sidebar {" +
  "width: 200px !important;" +
"}" +
".repository-content .timeline-new-comment {" + // New Issue / issue comment form
  "max-width: 100% !important;" +
"}" +
".repository-content .inline-comments .comment-holder {" + // Diff / code comments
  "max-width: 960px !important;" +
"}" +
".repository-content .inline-comments .inline-comment-form-container {" +
  "max-width: 960px !important;" +
"}" +
".repository-content .inline-comments .inline-comment-form {" +
  "max-width: 960px !important;" +
"}" +

// Repository pulse page
".repository-content .authors-and-code .section {" + // Contributors bar graph
  "width: 50%;" +
  "height: 180px;" +
"}" +
".repository-content .authors-and-code .section svg {" +
  "height: 180px;" +
"}" +

// Repository graph page
".repository-content .capped-card {" + // Graph cards on contributors / graph list
  "margin:10px 10px 0 0 !important;" +
"}" +

// Gists
".gist-content-wrapper .container {" +
  "width: auto !important;" +
  "margin-left: 20px !important;" +
  "margin-right: 20px !important;" +
  "min-width: 980px;" +
"}" +

"";

(function () {
  var s = document.createElement('style');
  s.type = "text/css";
  s.innerHTML = styleSheet;
  (document.head || document.documentElement).appendChild(s);
})();
