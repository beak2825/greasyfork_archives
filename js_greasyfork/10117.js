// ==UserScript==
// @name           motherless.com - sort videos by hits
// @namespace      https://greasyfork.org/de/scripts/10117-motherless-com-sort-videos-by-hits
// @author         enTiCaRD
//
// @description    Sorts Videos by hits over multiple pages
//
// @include        /^https?:\/\/(.+\.)?motherless\.com\/((gv\/.+)|GV.+)$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_getValue
// @grant          GM_setValue
//
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/10117/motherlesscom%20-%20sort%20videos%20by%20hits.user.js
// @updateURL https://update.greasyfork.org/scripts/10117/motherlesscom%20-%20sort%20videos%20by%20hits.meta.js
// ==/UserScript==


(function ($) {
    "use strict";
    /*jslint browser: true, newcap: true */
    /*global $, jQuery, GM_getValue, GM_setValue */

    $(function () {

        var sortItems = function (container, items) {
                var dict = {},
                    order;
                $(items).each(function () {
                    var hits = parseInt($(this).find("div.caption.right:contains('Hits')").text().split(' ')[0].replace(',', ''), 10);
                    if (dict[hits] === undefined) {
                        dict[hits] = [$(this)];
                    } else {
                        dict[hits].push($(this));
                    }
                });
                order = Object.keys(dict).sort(function (a, b) {
                    return a - b;
                });
                while (order.length > 0) {
                    items = dict[order.pop()];
                    while (items.length > 0) {
                        container.append(items.shift());
                    }
                }
            },
            loadItems = function (site, max, listener) {

                var pages = $('<div>'),
                    end = max + parseInt($(".pagination_link .current").last().text(), 10) - 1;
                pages.data('page', parseInt($(".pagination_link .current").last().text(), 10));
                if (isNaN(pages.data('page'))) {
                    pages.data('page', 1);
                    end = 1;
                }
                pages.data('status', 'loading');
                pages.data('array', []);

                pages.on("next", function (retries) {
                    $("#sortinginfo").text('loading page ' + pages.data('page') + ' (' + (pages.data('page') - end + max) + '/' + max + ')');
                    if (typeof retries !== "number") {
                        retries = 5;
                    }
                    $.get(site + "?page=" + pages.data('page'), function (data) {
                        var jdata = $(data),
                            tmp = pages.data('array');
                        jdata.find("div.thumb-container").each(function () {
                            tmp.push(this);
                        });
                        pages.data('array', tmp);
                        //alert(jdata.find("div.pagination_link a").last().text().match(/NEXT/) === null);
                        if (jdata.find("div.pagination_link a").last().text().match(/NEXT/) === null || pages.data('page') >= end) {
                            pages.data('status', 'success');
                            pages.trigger('allready', 1);
                        } else {
                            pages.data('page', pages.data('page') + 1);
                            pages.trigger('next', 5);

                        }
                    }).fail(function () {
                        retries -= 1;
                        if (retries >= 0) {
                            loadItems(retries);
                        } else {
                            pages.data('status', 'incomplete');
                            pages.trigger('allready');
                        }
                    });
                });


                pages.on('allready', function () {
                    listener(pages.data('status'), pages.data('array'));
                });


                pages.trigger('next', 5);

            },
            pages = parseInt($($(".pagination_link a")[$(".pagination_link a").size() - 2]).text(), 10) - parseInt($(".pagination_link .current").last().text(), 10) + 1,
            saveValue = false;

        $('div.sub_menu').append($('<a href id="listlinks">Links</a><a href title="Sort videos by hits" id="sortvideos">Sort</a> <span id="sortnextinput">next <input type="text" id="sortvideosmaxpages" maxlength="2" style="width: 20px;text-align: right;"> pages.</span><span id="sortinginfo"></span>'));
        if (isNaN(pages)) {
            pages = 1;
        } else if (pages > GM_getValue('default_pages_to_load', 10)) {
            pages = GM_getValue('default_pages_to_load', 10);
        }
        $("#sortvideosmaxpages").val(pages);
        $("#sortvideosmaxpages").click(function () {
            saveValue = true;
            $("#sortvideosmaxpages").css('color', 'black');
        });
        $("#listlinks").click(function () {
            var a = "";
            if ($("#listlinksinsert").size() > 0) {
                $("#listlinksinsert").remove();
            } else {
                $(".thumb.video a.img-container").each(function () {
                    a = a + 'http://motherless.com' + $(this).attr('href') + "\n";
                });
                $(".sub_menu").after($('<textarea>', {
                    id: "listlinksinsert",
                    style: "width: 100%; height: 50px;",
                    text: a
                }));
            }
            return false;
        });


        $("a#sortvideos").click(function () {
            var max = parseInt($("#sortvideosmaxpages").val(), 10),
                mylistener = function (e, items) {
                    var p = max + parseInt($(".pagination_link .current").last().text(), 10),
                        parent = $("div.thumb-container").parent();
                    $("div.thumb-container").remove();
                    sortItems(parent, items);
                    $("#sortinginfo").html(' ' + e + '.');
                    $("#sortnextinput").show();
                    if (parseInt($($(".pagination_link a")[$(".pagination_link a").size() - 2]).text(), 10) >= p) {
                        $("#sortinginfo").html('<a href="?page=' + p + '">goto page ' + p + '</a>');
                    }
                };
            if (isNaN(max) || max <= 0) {
                $("#sortvideosmaxpages").css('color', 'red');
                return false;
            }
            if (saveValue) {
                GM_setValue('default_pages_to_load', max);
            }
            $("#sortnextinput").hide();
            loadItems(window.location.href.toString().split('?')[0], max, mylistener);
            return false;
        });
    });


}(jQuery));
