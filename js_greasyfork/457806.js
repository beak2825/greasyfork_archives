// ==UserScript==
// @name     rmUkraine
// @namespace https://github.com/NessajCN
// @author   Nessaj
// @include  https://mui.com/*
// @require  https://code.jquery.com/jquery-3.6.3.min.js
// @description Remove annoying Ukraine propaganda block.
// @version  1.2
// @license  MIT
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/457806/rmUkraine.user.js
// @updateURL https://update.greasyfork.org/scripts/457806/rmUkraine.meta.js
// ==/UserScript==

setInterval(() => {
  const x = $("a[href^='https://war.ukraine.ua/support-ukraine/']");
	x.remove();
}, "3000")

// $(document).ready(function() {
//   setTimeout(() => {
//     const x = $("a.css-hvtvs0");
//     x.remove();
//   }, "3000")

// }); 

