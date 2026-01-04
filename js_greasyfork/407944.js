// ==UserScript==
// @name         nyaa.si/sukebei.nyaa.si helper
// @namespace    https://nyaa.si/
// @version      0.2.1
// @description  infinite scroll and image previews of torrents (more in description)
// @author       Mossshine
// @match        https://sukebei.nyaa.si/*
// @match        https://nyaa.si/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407944/nyaasisukebeinyaasi%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/407944/nyaasisukebeinyaasi%20helper.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const BASE_URL = `${window.location.protocol}//${window.location.hostname}`;
    const IMAGE_REGEXP = /http(.*jpg|.*png)/g;
    const NEW_LINES = /\]/g;

    $('body').prepend(`
<style>
    .preloader {
        display: inline-block;
        position: relative;
        width: auto;
        height: 10px;
    }
    .preloader:after {
        content: " ";
        display: block;
        border-radius: 50%;
        width: 0;
        height: 0;
        position: relative;
        top: -8px;
        left: 31px;
        box-sizing: border-box;
        border: 12px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: preloader 1.2s infinite;
    }
    .total-known-pages .preloader:after {
        left: 0px !important;
    }
    .preloader.error:after {
        border-color: #fb2b48 transparent #fb2b48 transparent;
    }
    @keyframes preloader {
        0% {
            transform: rotate(0);
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        50% {
            transform: rotate(900deg);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        100% {
            transform: rotate(1800deg);
        }
    }

    .loaded {
        background: black !important;
    }
    .torrent-previews .image {
        height: 125px;
        width: auto;
        object-fit: contain;
        padding: 5px;
    }
    .torrent-previews::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    .torrent-previews {
        display: flex;
        overflow-x: scroll;
        scrollbar-width: none;
    }
    .paginator-status .out-of {
        display: block;
        border-bottom: 2px solid #afafaf;
        margin-bottom: 3px;
    }
    .paginator-status {
        z-index: 999999999;
        position: fixed;
        display: flex;
        flex-direction: column;
        font-size: 25px;
        text-align: center;
        padding: 10px;
        background: #0000007a;
        border-bottom-right-radius: 10px;
    }
</style>   
<div class="paginator-status" style="display: none;">
    <span class="actual-page">1</span>
    <span class="out-of"></span>
    <span class="total-known-pages">1</span>
</div> 
    `);

    function Utilities() {}

    Utilities.prototype = {
        constructor: Utilities,
        nextPage: function (uri) {
            if(uri.has('p')) {
                uri.set('p', (parseInt(uri.get('p')) + 1).toString())
            } else {
                uri.set('p', '2');
            }
            return uri;
        },
        currentPage: function (uri) {
            if(uri.has('p')) {
                return uri.get('p');
            } else {
                return 1;
            }
        }
    };

    const Utils = new Utilities();

    let uri = new URLSearchParams(window.location.search);

    let isLoadingNextPage = false;
    $(window).on('wheel', function () {
        if(isLoadingNextPage === true) {
            return;
        }
        if(($(window).scrollTop() + $(window).height()) === $(document).height()) {
            Utils.nextPage(uri);

            isLoadingNextPage = true;
            $('.total-known-pages').html(`<div class="preloader"></div>`);

            $.ajax({
                url: BASE_URL + '/?' + uri.toString(),
                type: "GET",
                success: function (rawHtml) {
                    isLoadingNextPage = false;
                    let table = $(rawHtml).find('.torrent-list');
                    $('.torrent-list').find('tbody').append(table.find('tbody').html());

                    let currentHighest = 0;
                    $(rawHtml).find('ul.pagination a').each(function () {
                        let page = parseInt($(this).html());
                        if(page > currentHighest) {
                            currentHighest = page;
                        }
                    })

                    $('.actual-page').html(Utils.currentPage(uri));
                    $('.total-known-pages').html(currentHighest);
                    bindPreviews();
                }
            })
        }
    });

    let currentHighest = 0;
    $('ul.pagination').find('a').each(function () {
        let page = parseInt($(this).html());
        if(page > currentHighest) {
            currentHighest = page;
        }
    })

    $('.actual-page').html(Utils.currentPage(uri));
    $('.total-known-pages').html(currentHighest);
    $('.paginator-status').css('display', 'flex');

    bindPreviews();
    function bindPreviews()
    {
        $(".torrent-list tr:not(.loaded)").off().on('mouseover',function (e) {
            if(e.shiftKey === false) {
                return;
            }
            let row = $(this);
            if(row.hasClass('loaded') || row.hasClass('loading')) {
                return;
            }

            let torrentUrl = row.find("td[colspan='2'] > a");
            if(torrentUrl.length === 0) {
                return;
            }
            row.addClass('loading');

            let category = row.find('td:first-child > a');

            $.ajax({
                url: BASE_URL + torrentUrl.attr('href'),
                type: "GET",
                beforeSend: function () {
                    let preloader = category.find('.preloader');
                    if(preloader.length === 0) {
                        category.find('img').css('display', 'none');
                        category.append(`<div class="preloader"></div>`);
                    } else {
                        preloader.removeClass('error');
                    }
                },
                statusCode: {
                    429: function () {
                        row.removeClass('loading');
                        let preloader = category.find('.preloader');
                        if(preloader.length !== 0) {
                            preloader.addClass('error');
                        }
                    }
                },
                error: function () {
                    row.removeClass('loading');
                    let preloader = category.find('.preloader');
                    if(preloader.length !== 0) {
                        preloader.addClass('error');
                    }
                },
                success: function (rawHtml) {
                    row.removeClass('loading');
                    if(row.hasClass('loaded')) {
                        return;
                    }
                    row.addClass('loaded');
                    let rawDescription = $(rawHtml).find('#torrent-description').html();

                    rawDescription = rawDescription.replace(NEW_LINES, "\n");

                    let m;
                    let images = [];

                    while ((m = IMAGE_REGEXP.exec(rawDescription)) !== null) {
                        if (m.index === IMAGE_REGEXP.lastIndex) {
                            IMAGE_REGEXP.lastIndex++;
                        }

                        m.forEach((match, groupIndex) => {
                            if(groupIndex === 0) {
                                images.push(`<img class="image" src="${match}">`);
                            }
                        });
                    }
                    category.find('.preloader').each(function () {
                        $(this).remove();
                    })
                    category.find('img').css('display', 'block');

                    if(images.length > 0) {
                        row.after(`<tr><td colspan="9"><div class="torrent-previews">${images.join('\n')}</div></td></tr>`);
                    }
                }
            })
        });
    }
})();