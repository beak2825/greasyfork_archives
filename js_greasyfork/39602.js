// ==UserScript==
// @name CogDev Nothing Much ($0.30)
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Marks all No. Because why not?
// @author ceedj
// @include *.mturkcontent.com/*
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/39602/CogDev%20Nothing%20Much%20%28%24030%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39602/CogDev%20Nothing%20Much%20%28%24030%29.meta.js
// ==/UserScript==

var NoMu = $('p:contains(We will call these scenes NM for nothing much)');
if (NoMu.length)
{
window.focus();

$("input[name^='Something_']").click();
$("input[value='no']").click();
}