// ==UserScript==
// @name         Wikipedia Language Tabs
// @namespace    http://tampermonkey.net/
// @version      1
// @description  add language switch tab items
// @author       Longbiao CHEN
// @match        *.wikipedia.org/*
// @grant        none
// @license     GPLv3
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39401/Wikipedia%20Language%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/39401/Wikipedia%20Language%20Tabs.meta.js
// ==/UserScript==

(function() {
    var langs = ['ru','en','de'];
    for(var i in langs){
        var lang = $('#p-lang > div > ul > li.interlanguage-link.interwiki-' + langs[i]).html();
        if(lang){
            var node = '<li><span>' + lang + '</span></li>';
            $('#p-namespaces > ul').append(node);
        }
    }
})();