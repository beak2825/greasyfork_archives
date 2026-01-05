// ==UserScript==
// @name             GolemMultiPage
// @version          0.1.0
// @author           _leBluem_
// @description      Lade alle Seiten von mehrteiligen Artikeln in die erste Seite.
// @namespace        https://greasyfork.org/de/users/83368-lebluem
// @include          http://www.golem.de/news/*
// @clean-include    true
// @run-at           document-ready
// @include-jquery   true
// @use-greasemonkey true
// @downloadURL https://update.greasyfork.org/scripts/25555/GolemMultiPage.user.js
// @updateURL https://update.greasyfork.org/scripts/25555/GolemMultiPage.meta.js
// ==/UserScript==

(function () {
    $(window).load(function(){
        //Multipage stuff after pageload
        if ( $( "ol.list-pages" ).length ) {
            var urls = [];
            //get the urls from the a href of each li
            $( "ol.list-pages" ).children().each(function(){
                urls.push($(this).find('a').attr('href'));
            });
            urls.pop(); //The last link is next page, is not needed again
            //<header class="cluster-header">
            if ( urls.length > 0 ) {
                $("header[class^='cluster-header']").append('<div align="center"><font size="1.5">Seite 1 von ' + (urls.length) + '</font></div>');
                for (var i = 1; i < urls.length; i++) {
                    var divid = "plugin-page-" + i;
                    //append page numbers for info
                    $("div.formatted").append('<div align="center" ><font size="1.5">Seite ' + (i+1) + ' von ' + (urls.length) + '</font></div><br />');
                    //append a new div
                    $("div.formatted").append('<div id="' + divid + '"></div>');
                    //load the content of the page's article into the fresh div
                    $('#' + divid).load(urls[i] + ' article');
                }
            }
        }
    });

})();
