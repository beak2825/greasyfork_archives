// ==UserScript==
// @name           trakt.tv with tmdb rating
// @author         NKay08
// @description    Inserts movie ratings from tmdb into trakt. credits to
// https://greasyfork.org/de/scripts/9613-trakt-tv-add-imdb-rottentomatoes-movie-ratings-and-sorting-options-for-ratings
// for most of the code
//
// @namespace https://greasyfork.org/de/users/155913-nkay08
// @include        /^https?://(.+\.)?trakt\.tv/?.*$/
// @exclude        /^https?://(.+\.)?trakt\.tv/(shows|calendars)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
//
// @version 0.0.1.20171023135004
// @downloadURL https://update.greasyfork.org/scripts/34462/trakttv%20with%20tmdb%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/34462/trakttv%20with%20tmdb%20rating.meta.js
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true, regexp: true, newcap: true*/
    /*global jQuery, GM_xmlhttpRequest */
    $.noConflict();

    var loadRatingsForItem = function () {
			var tmdb = $('<h3>', {
                    'class': 'ratings',
                    'html': '<div style="float: left; width: 97px;">TMDB</div><span class="value">&nbsp;</span>'
                }),
                dummy = $('<h3>', {
                    'class': 'ratings',
                    'style': 'opacity: 0.8; height: 18px;'
                }),
                url = $(this).attr('data-url');

            if ($(this).attr('data-type') !== 'movie') {
                $(this).find('.quick-icons').after(dummy).after(dummy.clone());
            } else {
                $(this).find('.quick-icons').after(tmdb);
                if (url) {
                   $(tmdb).find('span.value').html('<span style="color: #999!important; font-weight: normal; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;loading<span>');
                    $.get(url, function (data) {
                        var imdb_id = $(data).find('.external a:contains("IMDB")').attr('href').split('/').pop();
                        var tmdb_id = $(data).find('.external a:contains("TMDB")').attr('href').split('/').pop();
						var apiKey = "yourApiKey";
						
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://api.themoviedb.org/3/movie/"+tmdb_id+"?api_key=" + apiKey,
                            onload: function (json) {
                                var r, res = $.parseJSON(json.responseText);
                                console.log("ZZZ "+res.title + ", "+ res.vote_average );
                                if (res.vote_average === undefined || res.vote_average === "N/A") {
                                    $(tmdb).find('span.value').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-');
                                } else {
                                    $(tmdb).find('span.value').html( res.vote_average + '<span style="font-size: 11px!important; font-style: normal; color: #999;"> (' + res.vote_count + ')</span></a>');
                                }

                            },
                            onerror: function () {
                                $(tmdb).find('span.value').html('<span style="color: #c11!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
                            }
                        });
					}).fail(function () {
						$(imdb).find('span.value').html('<span style="color: #c11!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
                    });
				}
			}
        },
        setPositioning = function () {
            setTimeout(function () {
                if ($('.trakt-icon-swap-vertical').next().find('a.rating:contains("' + $('.trakt-icon-swap-vertical').next().find('.btn-default').text().trim() + '")').size() > 0) {
                    $("div.grid-item").each(function () { $(this).attr('style', '{position:relative;top:0px;left:0px;}'); });
                } else if ($('.grid-item').first().attr('style') !== undefined) {
                    $("div.grid-item").each(function () { $(this).css('position', 'absolute'); });
                }
            }, 500);
        },
        init = function () {

            $("div[id*=\"huckster-desktop\"]").html("");

            if (/^\/users\/.+\/(collection|ratings|lists\/|watchlist)/.test(window.location.pathname) && $('.trakt-icon-swap-vertical').next().find('ul a.rating').size() === 0) {
                var sortMenu = $('.trakt-icon-swap-vertical').next().find('ul');
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='tmdb' data-sort-how='desc'>tmdb rating</a>" }));
                sortMenu.find('a.rating').click(sortByRating);
                sortMenu.find('a').click(setPositioning);
                $(window).on('resize', setPositioning);
                $('#sort-direction').click(function () {
                    $('.trakt-icon-swap-vertical').next().find('a.rating:contains("' + $('.trakt-icon-swap-vertical').next().find('.btn-default').text().trim() + '")').click();
                });
            } else {
                $(window).off('resize', setPositioning);
            }
            if ($("div.grid-item[data-type='movie']").size() > 0) {
                $("div.grid-item").not('.ratingsloaded').each(loadRatingsForItem);
            }
        };


    $(window).ready(function () {
        $('head').append('<style>h3.ratings, h3.ratings a { padding-top:4px!important; padding-bottom:0px!important; padding-left: 5px!important; margin-top: 0px!important; margin-left:1px!important; margin-right:1px!important; background-color: #292D41; color: white; font-size: 10px!important; text-align: left!important; };</style>');
        $('head').append('<style>span.value,  span.value>a { padding-left: 4px!important; font-weight: bolder!important; font-size: 12px!important; };</style><style>.quick-icons { border-bottom:none!important; };</style>');
        init();

        $(window).on('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'BODY') {
                $(e.target).ready(init);
            }
        });

    });

}(jQuery));


