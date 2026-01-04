// ==UserScript==
// @name         githubwidth
// @version      0.3
// @description  resizes github repos for smaller window widths.
// @match        http://github.com/*
// @match        https://github.com/*
// @match        http://*.github.com/*
// @match        https://*.github.com/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/404693/githubwidth.user.js
// @updateURL https://update.greasyfork.org/scripts/404693/githubwidth.meta.js
// ==/UserScript==

$("nav.mt-0").map(function(i, node) {
  node.hidden = true;
});
$(".Header-link").map(function(i, node) {
  for (l of ["https://github.com/marketplace",
             "https://github.com/explore"]) {
    if (node.href === l) {
      node.hidden = true;
    }
  }
});

$("table.files").map(function(n, t) {
	t.style.tableLayout = "fixed";
  // table>thead>tr>th
  ths = t.children[0].children[0].children;
  ths[0].style.width = "32px";  // icon
  ths[1].style.width = "192px"; // filename
  ths[3].style.width = "128px"; // mtime
});

for (t of [".min-width-lg", ".header-search", "body"]) {
  $(t).map(function(i, node) {
    node.style.minWidth = "0";
  });
}