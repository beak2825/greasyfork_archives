// ==UserScript==
// @name       Hybrid - NLP
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/27194/Hybrid%20-%20NLP.user.js
// @updateURL https://update.greasyfork.org/scripts/27194/Hybrid%20-%20NLP.meta.js
// ==/UserScript==

if ($('li:contains("MultiGenre NLI")').length) {
    $('textarea').eq(0).focus();
}