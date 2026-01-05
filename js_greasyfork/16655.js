// ==UserScript==
// @name           Nyaa Magnet Links
// @author         reconman
// @version        0.1
// @include        http://*.nyaa.se/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @description    Adds magnet links to Nyaa.se for convenience
// @run-at         document-end
// @namespace https://greasyfork.org/users/28815
// @downloadURL https://update.greasyfork.org/scripts/16655/Nyaa%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/16655/Nyaa%20Magnet%20Links.meta.js
// ==/UserScript==


url = document.URL;

if(url.search("page=search")) {
    $(function () {
        $('[title="Download"]').attr('href', function (i, h) {
            return h + (h.indexOf('?') != -1 ? "&magnet=1" : "?magnet=1");
        });
    });
}

if(url.search("page=view")) {
    button = $('.viewdownloadbutton').find('a');
    link = button.attr('href');
    button.before('<a href="' + link + '&magnet=1" rel="nofollow"><img  src="data:image/png;base64,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" alt="Magnet" width="25px" style="margin-right:10px;"/></a>');
    
    $('.viewdownloadbutton')[0].style.width="150px";
}