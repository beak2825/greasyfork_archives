// ==UserScript==
// @name         F365 Fix broken reply form
// @version      2020.04.06
// @namespace    https://greasyfork.org/users/476187-presto
// @description  Fix huge blank space when trying to reply to a post
// @author       Presto
// @match        http://forum.football365.com/posting.php?mode=reply*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399782/F365%20Fix%20broken%20reply%20form.user.js
// @updateURL https://update.greasyfork.org/scripts/399782/F365%20Fix%20broken%20reply%20form.meta.js
// ==/UserScript==

let replyFormParent = $('#page-header');
replyFormParent.children('.post.bg1').remove();
replyFormParent.children('.post.bg2').remove();