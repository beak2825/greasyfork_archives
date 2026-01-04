// ==UserScript==
// @name         Reddit - normalize link score
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Normalize link scores according to subreddit subscriber base
// @author       Cáno
// @match        https://www.reddit.com/r/*+*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/38923/Reddit%20-%20normalize%20link%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/38923/Reddit%20-%20normalize%20link%20score.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var thresholds = {
        "PHP": 18,
        "AmateurRoomPorn": 90,
        "starcraft": 120,
        "EmmaWatson": 60,
        "ProgrammerHumor": 90
    };

    var threshold = 0;

    for (var key in thresholds) {
        if (thresholds.hasOwnProperty(key)) {
            if(window.location.href.indexOf(key) > -1) {
                threshold = thresholds[key];
            }
        }
    }

    $( document ).ready(function () {
        var subs = [];

        $('.subscription-box a.title').each(function() {
            subs.push($(this).attr('href'));
        });

        var sum = 0;
        var num = 0;

        var promises = [];

        console.log(subs);

        $.each(subs, function() {
            var ajax = $.ajax({
                url: this + "about.json"
            });

            promises.push(ajax);
        });

        console.log(promises);

        Promise.all(promises)
            .then(responseList => {
            console.log(responseList);
            var results = [];
            $.each(responseList, function () {
                var response = this;
                var el = $('.score.unvoted');
                el.each(function() {
                    var txt = $(this).parent().parent().find('.entry.unvoted .tagline > a:last-child').text();
                    if (txt === response.data.display_name_prefixed) {
                        var result = $(this).attr('title') / response.data.subscribers * 100000;
                        result = Math.round(result * 10) / 10;
                        var parent = $(this).parent().parent();
                        if (!result) {
                            result = 0.0;
                        }

                        num++;
                        sum += result;
                        results.push(result);
                        parent.attr('data-score', result);

                        if (result < threshold) {
                            parent.css('opacity', 0.5).css('filter', 'grayscale(100%)');
                            $(this).html(result);
                        } else {
                            $(this).html(result);
                        }
                    }
                });
            });
            // console.log(sum/num);
            results = results.sort(function (a, b) { return a - b; }).reverse();
            $.each(results, function() {
                // console.log(this);
                var things = $(".thing[data-score='" + this + "']");
                things.each(function() {
                    var clear = $(this).next();
                    $(this).insertBefore('#siteTable .nav-buttons');
                    clear.insertBefore('#siteTable .nav-buttons');
                });
            });
        }).catch(e => {
            //console.log(e);
        });
    })();
})(jQuery);