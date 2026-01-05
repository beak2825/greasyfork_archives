// ==UserScript==
// @name             heiseNewsTickerKommentare
// @version          0.2.10
// @author           _leBluem_
// @description      Im Newsticker pro Tag die Option zum laden der Anzahl der Kommentare
// @info             its fun to see ;)
// @namespace        https://greasyfork.org/de/users/83368-lebluem
// @match            http://www.heise.de/newsticker/*
// @match            https://www.heise.de/newsticker/*
// @clean-include    true
// @run-at           document-ready
// @include-jquery   true
// @use-greasemonkey true
// @downloadURL https://update.greasyfork.org/scripts/25552/heiseNewsTickerKommentare.user.js
// @updateURL https://update.greasyfork.org/scripts/25552/heiseNewsTickerKommentare.meta.js
// ==/UserScript==

(function() {
        document.GetComments = function GetComments(e) {
            //alert('jo');
            // find all comments for this day
            var ulist=$(e).parent().parent().next().children();
            // clear all previous loaded comments
            $('span[id*="plugin-page-"]').each(function(){
                $(this).remove();
            });
            // make a span-tag to hold the comments-tag
            var urls = [];
            var j = 0;
            $(ulist).each(function(){
                if ( $(this).find('a').attr('href') ) {
                    urls.push($(this).find('a').attr('href'));
                    $(this).append('<font size="1"><span id="plugin-page-'+(j++)+'"></span></font>');
                }
            });
            //alert(urls.length);
            // make the span-tag actually load the comments-tag
            if ( urls.length > 0 ) {
                for (var i = 0; i<= urls.length; i++) {
                    $("#plugin-page-"+i).load(urls[i] + " div.link_forum_beitrag.news p a");
                }
            }
        };

    window.addEventListener("load", function() {
    //jQuery(document).ready( function() {
        // add "Kommentare laden" link to date that calls GetComments
        var i = 0;
        $("header.published.archiv_woche_published").each(function(){
        //$("h4.archiv_woche_liste").each(function(){
            var s = '<font size="1">&nbsp;<a href="#" target="_self" onclick="GetComments($(this));return false;">Kommentare laden</a></font>';
            $(this).append(s);
            //var btn = '<input type="button" id="btncmt'+(i++)+'" value="lade Kom.tare" style="height: 12px;" />';
            //btn.addEventListener("click", GetComments, false);
            //document.getElementById("btncmt"+(i-1)).onclick = function () { GetComments.toString(); };
            //$(this).append(btn);
            //btn.onclick ='( function() ' + GetComments.toString() + ')';
            //document.getElementById("btncmt"+(i-1)).onclick = function () { GetComments.toString(); };
        });
        // Inject the function and execute it:
        //addFunction(GetComments);
    }, false);
})();
