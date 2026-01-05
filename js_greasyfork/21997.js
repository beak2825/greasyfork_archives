// ==UserScript==
// @name         reddit clickable linkflair
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.2
// @description  turns flairs to links that search the sub for threads with the same flair
// @author       scriptfairy
// @match        https://www.reddit.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21997/reddit%20clickable%20linkflair.user.js
// @updateURL https://update.greasyfork.org/scripts/21997/reddit%20clickable%20linkflair.meta.js
// ==/UserScript==

(function($) {
    $('<style>').text('.linkflairlabel > a, .linkflairlabel > a:visited {color:inherit;}').appendTo($('head'));

    var flair, flairTitle, searchContent;
    var linkFlairs = $('.linkflairlabel');
    var sub = location.href;
    sub = sub.slice(0, sub.indexOf("/", sub.indexOf("/r/")+3));

    for (i = 0; i < linkFlairs.length; i++) {
        flair = linkFlairs[i];
        flairTitle = $(flair).attr('title');
        searchContent = encodeURIComponent("flair_text:'"+flairTitle+"'").replace(/%20/g, "+");
        $(flair).html('<a href="'+sub+'/search?q='+searchContent+'&restrict_sr=on">'+flairTitle+'</a>');
    }

})(window.jQuery);