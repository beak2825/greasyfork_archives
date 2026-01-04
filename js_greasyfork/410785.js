// ==UserScript==
// @name           trakt.tv grid++ IMDb, MetaCritic & RottenTomatoes movie ratings + links (PLOT VERSION)
// @namespace      https://greasyfork.org/en/users/167473-benedict-harris
// @author         jesuis-parapluie (plus modifications by Benedict)
// @description    Inserts movie ratings from IMDb, RottenTomatoes and Metacritic ratings in any grid view with PLOT
//
// @include        /^https?://(.+\.)?trakt\.tv/?.*$/
// @exclude        /^https?://(.+\.)?trakt\.tv/(calendars)/?.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
//
// @grant          GM_xmlhttpRequest
//
// @version        2.2.6
//
// @downloadURL https://update.greasyfork.org/scripts/410785/trakttv%20grid%2B%2B%20IMDb%2C%20MetaCritic%20%20RottenTomatoes%20movie%20ratings%20%2B%20links%20%28PLOT%20VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410785/trakttv%20grid%2B%2B%20IMDb%2C%20MetaCritic%20%20RottenTomatoes%20movie%20ratings%20%2B%20links%20%28PLOT%20VERSION%29.meta.js
// ==/UserScript==


/*==================NOTE - REPLACE the eight @ on the line below (line 22) with your API from omdbapi.com   (its free) ====================*/


var API = '@@@@@@@@';

(function ($) {
    'use strict';
    /*jslint browser: true, regexp: true, newcap: true*/
    /*global jQuery, GM_xmlhttpRequest */
    $.noConflict();

    var loadRatingsForItem = function () {
            var imdb = $('<span>', {
                    'class': 'ratings',
                    'html': '<div style="float: left; width: 0px;"></div><span class="value">&nbsp;</span>'
                }),
                tomatoes = $('<span>', {
                    'class': 'ratings',
                    'html': '<div style="float: left; width: 0px;"></div><span class="value">&nbsp;</span>'
                }),
                dummy = $('<span>', {
                    'class': 'ratings',
                    'style': 'opacity: 0.8; height: 18px;'
                }),
                url = $(this).attr('data-url');

            if ($(this).attr('data-type') !== 'movie' && ($(this).attr('data-type') !== 'show')) {
                $(this).find('.quick-icons').after(dummy).after(dummy.clone());
            } else {
                $(this).find('.quick-icons').after(tomatoes).after(imdb);
                if (url) {
                    $(imdb).find('span.value').html('<span style="color: #999!important; font-weight: normal; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;loading<span>');
                    $.get(url, function (data) {
                        var imdb_id = $(data).find('.external a:contains("IMDB")').attr('href').split('/').pop();
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "http://www.omdbapi.com/?plot=short&tomatoes=true&r=json&apikey=" + API + "&i=" + imdb_id,

                            onload: function (json) {
								var rtcolour = '#FF5555';
								var rtimglink = 'https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg';
                                var imdbimglink = 'https://ia.media-imdb.com/images/M/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE@._V1_.png';
                                var metacimglink = 'https://upload.wikimedia.org/wikipedia/commons/2/20/Metacritic.svg';
                                var rtimglong = '<img src="https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg" alt="rt" height="16" width="16">';
                                var r, res = $.parseJSON(json.responseText);
                                for (r in res.Ratings) {
                                    if (res.Ratings.hasOwnProperty(r) && res.Ratings[r].Source === "Rotten Tomatoes") {
                                        res.tomatoRating = res.Ratings[r].Value;
                                    }
                                }
                                var yearja = res.Year;
                                if (res.Type == 'series'){
                                    //yearja = res.Year.match(/^..../ig);
                                    console.log('oneyear ='+yearja);
                                    //res.tomatoRating = 'tv &#10132;';
                                    //res.tomatoRating = '&#10095&#10095&#10095;';
                                    res.tomatoRating = '<span style="font-variant: all-petite-caps;">TV</span>';
                                    rtimglong = "";
                                    res.tomatoURL = "https://duckduckgo.com/?q=site%3Arottentomatoes.com+"+res.Title+"+"+res.Year+"+!&t=hg";
                                }

                                var metalink = "https://duckduckgo.com/?q=site%3Ametacritic.com+"+res.Title+"+"+yearja+"+!&t=hg";
                                //var metalink = "https://duckduckgo.com/?q=site%3Ametacritic.com+"+res.Title+"+"+res.Year+"+!";
                                //console.log('METALINK');
                                //console.log(metalink);
                                //console.log('++');
                                //console.log("console.log(res.tomatoURL)");
                                //console.log(res.tomatoURL);
                                //console.log("console.dir(res);");
                                //console.dir(res);
                                //console.log("console.log(json);");
                                //console.dir(json);
                                //console.log("console.log(res.Response)");
                                //console.log(res.Response);

                                if (res.tomatoRating === undefined || res.tomatoRating === "N/A") {
                                    res.tomatoRating = '-';
                                    res.tomatoURL = "https://duckduckgo.com/?q=site%3Arottentomatoes.com+"+res.Title+"+"+res.Year+"+!&t=hg";
                                    console.log('NULLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');
                                    rtimglink = '';
                                    rtimglong = '';
                                }
								if (parseFloat(res.tomatoRating) < 60 ) {
                                    rtcolour = '#00CA5F';
									rtimglink = 'https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg';
                                    rtimglong = '<img src="https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg" alt="rt" height="16" width="16">';
                                }    

                                if (res.Metascore === undefined || res.Metascore === "N/A") {
                                    if (res.Type == 'series'){
                                        //res.Metascore = 'tv &#10132;';
                                        //res.Metascore = '&#10095&#10095&#10095;';
                                        res.Metascore = '<span style="font-variant: all-petite-caps;">TV</span>';
                                    } else {
                                    res.Metascore = '-';
                                    }
                                }

                                if (API == '@@@@@@@@'){
                                    res.tomatoRating = 'you didnt read instructions.<br>put in your API in line 22.';
                                    res.Metascore = '';
                                }
                                if (res.imdbRating === undefined || res.imdbRating === "N/A") {
                                    $(imdb).find('span.value').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-');
                                } else {
								/*console.log('============================' + res.tomatoRating);*/
                                    $(imdb).find('span.value').html('<a href="http://www.imdb.com/title/' + res.imdbID + '" target="_blank"><font color="#F6F68B">' + res.imdbRating + '</a>');
                                }
                                $(tomatoes).find('span.value').html('<span class="uuu"><a href="' + metalink + '" target="_blank"><font color="orange">' + res.Metascore + '</a></font></span><span class="sunsh" style="float: right;"><div class="tooltip2"><span class="tooltiptext">' + res.Year + ' ' +res.Country + '</span></div><a href="' + res.tomatoURL + '" target="_blank">' + rtimglong + '<font color="' + rtcolour + '">' + res.tomatoRating + '</a></font></span><div class="plotz">'  + res.Plot +  '</div></span>');
                            },
                            onerror: function () {
                                $(imdb).find('span.value').html('<span style="color: #c11!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
                            }
                        });
                    }).fail(function () {
                        $(imdb).find('span.value').html('<span style="color: #c11!important; font-weight: normal; font-size: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failed<span>');
                    });
                }
            }
        },
        parseRating = function (item, type) {
            var r;
            if (type === 'originalOrder') {
                return $(item).attr('startOrder');
            }
            if (type === 'trakt') {
                r = $(item).find("div.percentage").text().slice(0, -1);
                if (r !== null && r >= 0 && r <= 100) {
                    return r;
                }
            }
            if (type === 'imdb') {
                r = $(item).find("span.ratings").text().match(/IMDb\W+(\d(\.\d)?).*/i);
            }
            if (type === 'tomatometer') {
                r = $(item).find("span.ratings").text().match(/R\.T\.[^\d]+(\d*)%?.*/i);
            }
            if (type === 'metascore') {
                r = $(item).find("span.ratings").text().match(/R\.T\. \/[^\/]+\/\W*(\d+).*/i);
            }
            if (r !== null && r.length > 1 && r[1] !== '-') {
                return r[1];
            }
            return -1;
        },
        sortByRating = function (e) {
            var items, order,
                dict = {},
                parent = $("div.grid-item").parent(),
                how = function (a, b) { return a - b; };

            $(".no-top").hide();
            if ($('#sortable-name').size() > 0) {
                $('#sortable-name').text($(e.target).text()).attr('data-sort-by', $(e.target).attr('data-sort-by'));
            } else {
                $('.trakt-icon-swap-vertical').next().find('.btn-default').html($(e.target).text() + ' <span class="caret"></span>');
            }
            $("div.grid-item").each(function () {
                var rating = parseRating(this, $(e.target).attr('data-sort-by'));
                if (dict[rating] === undefined) {
                    dict[rating] = [$(this)];
                } else {
                    dict[rating].push($(this));
                }
            });
            if ($('#sort-direction').hasClass('desc')) {
                how = function (b, a) { return a - b; };
            }

            order = Object.keys(dict).sort(how);

            while (order.length > 0) {
                items = dict[order.pop()];
                while (items.length > 0) {
                    parent.append(items.shift());
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
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='imdb' data-sort-how='desc'>IMDb rating</a>" }));
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='tomatometer' data-sort-how='desc'>TomatoMeter</a>" }));
                sortMenu.append($('<li>', { html: "<a class='rating' data-sort-by='metascore' data-sort-how='desc'>Metascore</a>" }));
                sortMenu.find('a.rating').click(sortByRating);
                sortMenu.find('a').click(setPositioning);
                $(window).on('resize', setPositioning);
                $('#sort-direction').click(function () {
                    $('.trakt-icon-swap-vertical').next().find('a.rating:contains("' + $('.trakt-icon-swap-vertical').next().find('.btn-default').text().trim() + '")').click();
                });
            } else {
                $(window).off('resize', setPositioning);
            }
            if (($("div.grid-item[data-type='movie']").size() > 0||$("div.grid-item[data-type='show']").size() > 0)) {
                $("div.grid-item").not('.ratingsloaded').each(loadRatingsForItem);
            }
        };


    $(window).ready(function () {
        $('head').append('<style>span.ratings, span.ratings a { padding-top:4px!important; padding-bottom:0px!important; padding-left: 0px!important; margin-top: 0px!important; margin-left:1px!important; margin-right:0px; background-color: transparent; color: white; text-align: left!important; };</style>');
        $('head').append('<style>span.value,  span.value>a { padding-left: 3px!important; font-weight: bolder!important; font-size: 18px; };</style><style>.quick-icons { border-bottom:none!important; };</style>');
        $('head').append('<style>div.posters, div.poster, div.quick-icons { background-color: #1d1d1d; border: none !important; };</style>');
        $('head').append('<style>span.sunsh {padding-right: 10px; };</style>');
        $('head').append('<style>span.sunsh img {margin-right: 4px; };</style>');
        $('head').append('<style>div.grid-item.col-xxlg-1.col-xlg-2.col-lg-2.col-md-3.col-sm-3.col-xs-6 span.sunsh img, div.grid-item.col-xs-6.col-md-2.col-sm-3  span.sunsh img {vertical-align: text-top; margin-right: 2px !important; margin-top: 1px; height:14px !important; width:14px !important;};</style>');
        $('head').append('<style>div.grid-item.col-xxlg-1.col-xlg-2.col-lg-2.col-md-3.col-sm-3.col-xs-6 span.sunsh, div.grid-item.col-xs-6.col-md-2.col-sm-3 span.sunsh {padding-right: 5px !important; };</style>');
        $('head').append('<style>div.grid-item.col-xxlg-1.col-xlg-2.col-lg-2.col-md-3.col-sm-3.col-xs-6 span.value, div.grid-item.col-xs-6.col-md-2.col-sm-3 span.value {font-size: 11px !important; margin-right: 0px!important;};</style>');
        $('head').append('<style>div.grid-item.col-xxlg-1.col-xlg-2.col-lg-2.col-md-3.col-sm-3.col-xs-6 span.value>a, div.grid-item.col-xs-6.col-md-2.col-sm-3 span.value>a {font-size: 11px !important; font-weight: 700 !important; margin-right: 0px!important;};</style>');
        // one below kills ads
        $('head').append('<style>div.grid-item.huckster-grid-item, a.alert.alert-vip-required {display: none !important; };</style>');
        //updated ad killer
        $('head').append('<style>.e20df-grid-item {display: none;};</style>');

        $('head').append('<style>.sunsh { position: relative;   }</style>');
        //$('head').append('<style>.tooltiptext {  visibility: hidden;  width: 120px;  background-color: #555;  color: #fff;  text-align: left;  border-radius: 6px;  padding: 5px;  position: absolute;  z-index: 999;  bottom: 125%;  left: 50%;  margin-left: -60px;  opacity: 0;  transition: opacity 0.3s;} ;</style>');
        $('head').append('<style>.tooltiptext {  visibility: hidden;  width: 225px;  background-color: #2d2d2ddb;  color: #fff;  text-align: left;  border-radius: 6px;  padding: 10px;  position: absolute;  z-index: 999; text-shadow: 0 0px 15px #000; font-family: proxima nova; font-size: 16px; bottom: 125%; right:20%;  opacity: 0;  transition: opacity 0.3s;} ;</style>');
        $('head').append('<style>.tooltiptext::after {  content: "";  position: absolute;  top: 100%;  right: 10%;  margin-left: -5px;  border-width: 5px;  border-style: solid;  border-color: #555 transparent transparent transparent;} ;</style>');
        $('head').append('<style>.grid-item.hu-ck-s-t-er-grid-item {display: none;} ;</style>');
        $('head').append('<style>.sunsh:hover .tooltiptext {  visibility: visible;  opacity: 1;} ;</style>');
        $('head').append('<style>.plotz {line-height: 1.2; height: 140px; margin: 5px; font-weight: 100; color: #aeb4b9;} ;</style>');
        $('head').append('<style>.fanarts .plotz {font-size: 15px; } ;</style>');
        $('head').append('<style>.search .plotz {font-size: 13px; } ;</style>');



        init();

        $(window).on('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'BODY') {
                $(e.target).ready(init);
            }
        });

    });

}(jQuery));