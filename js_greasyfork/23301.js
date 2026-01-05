// ==UserScript==
// @name         Threadless Infinite Scroll
// @namespace    https://github.com/arieljannai
// @version      1.0.0
// @description  Infinite scroll for threadless.com
// @author       Ariel Jannai-Epstein
// @match        *://www.threadless.com/*
// @icon         https://www.threadless.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/23301/Threadless%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/23301/Threadless%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let infiniteLoadingGif = "<div class='infinite-loading' style='text-align:center; margin:0 auto; width:50%'><img src='https://i.imgur.com/NH1zQtD.gif'></img><br><br></div>";

    function isScrolledIntoView(elem) {
        let docViewTop = $(window).scrollTop();
        let docViewBottom = docViewTop + $(window).height();

        let elemTop = $(elem).offset().top;
        let elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    let back_top = $('.search-long-description');
    let pathname = document.location.pathname + document.location.search;
    let pageMatch = pathname.match(/page=(\d+)/);
    let currPage = pageMatch ? pageMatch[1] : 1;
    let requestNext = true;
    let cPrefix = document.location.search === '' ? '?' : '&';
    pathname = pathname.replace(/\&?page=\d+/, '') + cPrefix + 'page=' + currPage;

    const totalPages = $('#search-results-grid ul.pagination > li').eq(-2).text();

    function getPagePath(pageNum) {
        return pathname.replace(/page=\d+/, 'page=' + pageNum);
    }

    function appendPageItems(pageNum) {
        console.log(`loading page: ${pageNum}/${totalPages}`);
        let msg = '';
        $('<div>').load(getPagePath(pageNum) + ' .results-container-app', function(html, status) {
            console.log('status: ', status);
            if (status !== 'success') {
                requestNext = false;
                msg = 'Oops. There was an error while loading the next page items (page ' + pageNum + ').';
                console.error(msg);
                $('<div id="oops_error" style="text-align:center; color:red">' + msg + '<BR><a id="try_again_btn">Try again</a></div>').insertAfter('.results-container-app');
                $('#try_again_btn').click(function() {
                	$('#oops_error').remove();
                	$('.infinite-loading').show();
                	appendPageItems(pageNum);
                });
                // $('div .catalog_browsing').show();
                $('div .search-pagination').show();
            } else if (html.indexOf('class="no-results"') > -1) {
                console.log('not loaded: ', pageNum);
                msg = 'No more items :(';
                console.log(msg);
                $('<div style="text-align:center">' + msg + '</div>').insertAfter('.results-container-app');
            } else {
                $('.results-container-app').append($(this).children('.results-container-app').children());
                requestNext = true;
                console.log(`loaded: ${pageNum}/${totalPages}`);
            }

            $('.infinite-loading').hide();
        });
    }

    $('div .search-pagination').hide();
    $(infiniteLoadingGif).insertBefore('div .search-pagination');
    $('.infinite-loading').hide();

    $(window).scroll(function() {
        if (requestNext && isScrolledIntoView(back_top)) {
            $('.infinite-loading').show();
            requestNext = false;
            appendPageItems(++currPage);
        }
    });
})();
