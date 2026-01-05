// ==UserScript==
// @name         Voat Fixer
// @version      1.1
// @description  Fix the sort by top issues found on voat.co
// @author       https://voat.co/user/Tempo
// @match        https://voat.co/v/*/top?time=*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/16844/Voat%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/16844/Voat%20Fixer.meta.js
// ==/UserScript==
'use strict';

jQuery(document).ready(function(){
    if (location.search.indexOf("?time=") > -1) {
        if (location.search.indexOf("&page=") > -1) {
            var currentPage = parseInt(location.search.replace('?time=all&page=',''));
            var nextPage = currentPage + 1;
            var prevPage = currentPage - 1;
            
            $('a[rel=next]').attr("href", location.origin+location.pathname+"?time=all&page="+nextPage);
            
            if (currentPage > 1) { $('a[rel=prev]').attr("href", location.origin+location.pathname+"?time=all&page="+prevPage); }
            else { $('a[rel=prev]').attr("href", location.origin+location.pathname+"?time=all"); }
        }
        else {
            $('a[rel=next]').attr("href", location.href+"&page=1");
        }
    }
});