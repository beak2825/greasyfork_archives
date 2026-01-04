// ==UserScript==
// @name Habitica All-Yellow Tasks (UserCSS conversion)
// @namespace https://greasyfork.org/users/662334
// @version 1.0.2018-01-19-USO
// @description Conversion from userstyles.org edition to UserCSS. A style that makes all tasks yellow, unless they're complete/not-due (grey) or rewards. Cobbled together quickly, so there might be an error somewhere, but I've tested it and haven't found any in the latest version!
// @author citrusella
// @supportURL https://habitica.com/profile/2d6ef231-50b4-4a22-90e7-45eb97147a2c
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.habitica.com/*
// @downloadURL https://update.greasyfork.org/scripts/423273/Habitica%20All-Yellow%20Tasks%20%28UserCSS%20conversion%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423273/Habitica%20All-Yellow%20Tasks%20%28UserCSS%20conversion%29.meta.js
// ==/UserScript==

(function() {
let css = `
  .task-neutral-control-bg,.task-good-control-bg,.task-better-control-bg,.task-best-control-bg,.task-bad-control-bg,.task-worse-control-bg,.task-worst-control-bg {
	  background: #FFBE5D !important;
  }
  .task-neutral-control-inner-daily-todo,.task-good-control-inner-daily-todo,.task-better-control-inner-daily-todo,.task-best-control-inner-daily-todo,.task-bad-control-inner-daily-todo,.task-worse-control-inner-daily-todo,.task-worst-control-inner-daily-todo {
	  background: #FFD9A0 !important;
  }
  .task-neutral-control-inner-habit,.task-good-control-inner-habit,.task-better-control-inner-habit,.task-best-control-inner-habit,.task-bad-control-inner-habit,.task-worse-control-inner-habit,.task-worst-control-inner-habit {
	background: rgba(183, 90, 28, 0.32) !important;
  }
  .task-neutral-control-bg:hover .habit-control,.task-good-control-bg:hover .habit-control,.task-better-control-bg:hover .habit-control,.task-best-control-bg:hover .habit-control,.task-bad-control-bg:hover .habit-control,.task-worse-control-bg:hover .habit-control,.task-worst-control-bg:hover .habit-control {
	background: #bf7d1a !important;
  }
  .task-neutral-control-checkbox,.task-good-control-checkbox,.task-better-control-checkbox,.task-best-control-checkbox,.task-bad-control-checkbox,.task-worse-control-checkbox,.task-worst-control-checkbox {
      color: #FFBE5D !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
