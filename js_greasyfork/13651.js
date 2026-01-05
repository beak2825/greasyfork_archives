// ==UserScript==
// @name           Redmine Syntax Hilighter with Google Code Prettify
// @description:en Hilight code tag by Google Code Prettify
// @version        0.1
// @namespace      http://twitter.com/foldrr
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-vb.min.js
// @resource       prettify_css http://google-code-prettify.googlecode.com/svn/trunk/styles/desert.css
// @match          */redmine/issues/*
// @match          */redmine/projects/*/wiki/*
// @description Hilight code tag by Google Code Prettify
// @downloadURL https://update.greasyfork.org/scripts/13651/Redmine%20Syntax%20Hilighter%20with%20Google%20Code%20Prettify.user.js
// @updateURL https://update.greasyfork.org/scripts/13651/Redmine%20Syntax%20Hilighter%20with%20Google%20Code%20Prettify.meta.js
// ==/UserScript==

(function(){
    GM_addStyle(GM_getResourceText("prettify_css"));
    $("pre").addClass("prettyprint");
    $(".prettyprint").css("background-color", "#333");
    $(".prettyprint").css("padding", "10px");
    prettyPrint();
})();
