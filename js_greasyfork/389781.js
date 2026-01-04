// ==UserScript==
// @name         RARBG Show thumbnail & Bigger preview images (all site variants)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show torrent's thumbnail directly on torrents list & Load bigger preview images. Run on all different variants of RARBG site (since they keep change site's URL). Lazy preload preview image for faster browsing.
// @author       Nobakab
// @icon         https://rarbg.com/favicon.ico
// @include      http*://*rarbg*/top10
// @include      http*://*rarbg*/top100.php*
// @include      http*://*rarbg*/torrents.php*
// @include      http*://*rarbg*/torrent/*
// @include      http*://*rarbg*/s/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389781/RARBG%20Show%20thumbnail%20%20Bigger%20preview%20images%20%28all%20site%20variants%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389781/RARBG%20Show%20thumbnail%20%20Bigger%20preview%20images%20%28all%20site%20variants%29.meta.js
// ==/UserScript==

/* globals jQuery */

(function () {
    'use strict';
    // jQuery.noConflict();

    jQuery(function () {
        /* top10, top100.php, torrents.php, s/ */
        // Add one more table column for thumbnail
        // Use tr:first-child instead of eq(0) since we can have more than one table.lista2t when viewing top10 page
        jQuery('table.lista2t tr:first-child td:nth-child(2)').each(function () {
            jQuery(this).before('<td align="center" class="header6 header40" style="width:100px">Thumb.</td>');
        });

        /* Show thumbnail directly on torrents list */
        jQuery('table.lista2t tr.lista2 td.lista:nth-child(2)').each(function () {
            insertThumbnail(this);
        });

        /* torrent/ */
        // Some torrents don't have related table so check for it first
        if (jQuery('table.lista table.lista tr.lista_related td.lista a[onmouseover~=return]').length) {
            // Add one more table column for thumbnail
            jQuery('table.lista table.lista').eq(0).find('tr:first-child td:nth-child(1)').each(function () {
                jQuery(this).before('<td class="header2" style="width:100px">Thumb.</td>');
            });

            /* Show thumbnail directly on torrents list */
            jQuery('table.lista table.lista tr.lista_related td:first-child').each(function () {
                insertThumbnail(this);
            });
        }

        /* Move previewer following mouse */
        betterPreviewerMoving();

        var imagesCache = new Array();
        /* Recommended list: add bigger preivew */
        addBiggerPreviewer(imagesCache);

        /* Torrents list: Replace big preview */
        replaceBiggerPreviewer(imagesCache);

        lazyPreLoad(imagesCache);
    });

})();

function insertThumbnail(td) {
    var link = jQuery(td).find('a').eq(0);
    var onmouseover = jQuery(link).attr('onmouseover');

    /* https://regexr.com/ */
    // Must escape when using regex in script file but don't escape if you are going to test in Console
    // Use a parenthesis here to have match/exec return the captured group only (without the \' and '\) at 2nd element
    var regExp = /\\\'([^)]+)\\\'/;
    var matches = regExp.exec(onmouseover);
    if (matches && matches.length == 2) {
        // Keep link and hover so that we can also replace & show bigger preview later
        jQuery(td).before(jQuery('<td/>').attr('align', 'left').attr('class', 'lista').html(link.clone().html('<img src="' + matches[1] + '">')));
    } else {
        // Don't have thumbnail so replace by a "nocover" instead
        jQuery(td).before(jQuery('<td align="left" class="lista"><img src="https://dyncdn.me/20/img/nocover.gif" style="width:100px"></td>'));
    }
}

function addBiggerPreviewer(imagesCache) {
    jQuery('td.lista[valign=top] a[onmouseover~=return]').each(function () {
        var thumb = jQuery(this).find('img');
        if (thumb.length >= 1) {
            var thumbUrl = thumb[0].src;
            var biggerImageUrl = changeLink(thumbUrl);
            imagesCache.push(biggerImageUrl);

            var onmouseover = jQuery(this).attr("onmouseover");
            onmouseover = onmouseover.substr(0, onmouseover.length - 2) + "<br/><img src=\\\'" + biggerImageUrl + "\\\'/>')";
            jQuery(this).attr("onmouseover", onmouseover);
        }
    });
}

function replaceBiggerPreviewer(imagesCache) {
    jQuery('table.lista2t tr.lista2 td.lista:nth-child(2), table.lista table.lista tr.lista_related td.lista:nth-child(1)').find('a[onmouseover~=return]').each(function () {
    // jQuery('table.lista2t tr.lista2, table.lista table.lista tr.lista_related').find('td.lista a[onmouseover~=return]').each(function () {
        var onmouseover = jQuery(this).attr("onmouseover");

        var regExp = /\\\'([^)]+)\\\'/;
        var matches = regExp.exec(onmouseover);

        if (matches && matches.length == 2) {
            var link = matches[1];
            var newLink = changeLink(link);
            imagesCache.push(newLink);

            jQuery(this).attr("onmouseover", onmouseover.replace(link, newLink));
        }
    });
}

function changeLink(link) {
    var newLink = link;
    var path = link.split('/')

    switch (path[3]) {
        case 'static':
            switch (path[4]) {
                case 'over': //18+
                    // Images are further divided into sub-directories with name is first charater of image's file name (path[5].substr(0, 1))
                    newLink = link.replace('static/over', 'posters2/' + path[5].substr(0, 1));
                    break;
                case '20': //TVdb
                    newLink = link.replace('_small', '_banner_optimized');
                    break;
                default:
                    console.log("Unable to replace rarbg source:" + link);
                    break;
            }
            break;
        case 'mimages': //movie
            newLink = link.replace('over_opt', 'poster_opt');
            break;
        default:
            console.log("Unable to replace rarbg source:" + link);
            break;
    }

    return newLink;
}

function preLoad(imageURL) {
    (new Image()).src = imageURL;
    // jQuery('<img/>')[0].src = imageURL;
}

function lazyPreLoad(imagesCache) {
    // Timer to lazy load
    setTimeout(function () {
        if (imagesCache.length >= 1) {
            var imageURL = imagesCache[0];
            imagesCache.shift();
            lazyPreLoad(imagesCache);

            preLoad(imageURL);
        }
    }, 100);
}

function betterPreviewerMoving() {
    // var pop = document.getElementById("overlib");

    // Set popup image following mouse
    document.onmousemove = function (mouseEvent) {
        var e = mouseEvent || event || window.event;

        /**
         * xoffset & yoffset are already preset by default
         *     xoffset = 15;
         *     yoffset = 10;
         *
         * e.pageX & e.pageY are mouse positions in relative to page
         * e.clientX & e.clientY are mouse positions in relative to window
         *
         * scrollX & scrollY are scroll bar position, should also be provided automatically already
         *     var scrollX = document.scrollingElement.scrollLeft || document.documentElement.scrollLeft || document.body.scrollLeft;
         *     var scrollY = document.scrollingElement.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
         *
         * document.scrollingElement.clientHeight is height of the whole scrolling element, same as window's height if whole page is scrolling
         */
        var x = (e.pageX || e.clientX + scrollX) + xoffset;
        var y = (e.pageY || e.clientY + scrollY) + yoffset;

        // The element on which mouse is pointing to
        el = e.target || e.srcElement

        if (pop.children[0]) {
            // Avoid showing previewer outside of bottom window
            var r = scrollY + document.scrollingElement.clientHeight - pop.children[0].height - 10
            if (y > r) {
                y = r
            }
        }

        // Position of popup image, in relative to page (not window)
        pop.style.top = y + "px";
        pop.style.left = x + "px"
    };
}
