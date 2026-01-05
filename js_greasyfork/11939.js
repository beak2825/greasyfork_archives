// ==UserScript==
// @name           Reddit - restart failed Never Ending Reddit at old position
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.1.7
// @description    When using the "Reddit Enhancement Suite" with "Never Ending Reddit" option, at some point the next page cannot be loaded anymore. Currently your only option is to reload Reddit and start from the top. This script searches bottom up for the next working entry it can use as starting point. This way you can continue browsing from the same position.
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant          none
// @include        /^https?:\/\/(.+\.)?reddit\.com\/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// @downloadURL https://update.greasyfork.org/scripts/11939/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20old%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/11939/Reddit%20-%20restart%20failed%20Never%20Ending%20Reddit%20at%20old%20position.meta.js
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true, regexp: true */
    /*global jQuery,doSearch */

    $.noConflict();

    var button, link, ids = [],
        nextLink = function () {
            var checked = parseInt(button.data("checkedLinks"), 10) + 1;
            if (ids.length === 0 || checked > 30) {
                button.text("Could not find a working link :(");
                return false;
            }
            button.data("checkedLinks", checked);
            button.text("Searching for link (checked: " + checked + ")");
            doSearch();
        },
        doSearch = function () {
            var url = link.replace('[[ID]]', ids.pop());
            $.get(url, function (data) {
                if ($(data).find('#siteTable div.thing').size() > 0) {
                    var count = parseInt($(".thing").last().find("span.rank").text(), 10) - parseInt(button.data("checkedLinks"), 10) + 1,
                        match = url.match(/count=(\d+)/i);
                    if (match !== null && match.length > 1) {
                        url = url.replace(match[0], 'count=' + count);
                    } else {
                        url += '&count=' + count;
                    }
                    button.text("link found - loading");
                    window.location.href = url;
                } else {
                    data = null;
                    nextLink();
                }
            }).error(nextLink);
        };

    $(function () {
        $(document).bind('DOMNodeInserted', function (e) {
            if (e.target.tagName === 'DIV' && e.target.getAttribute('id') && e.target.getAttribute('id') === 'NERFail') {
                button = $('<a>', {
                    'text': 'search for working link to continue NER',
                    'style': 'cursor:pointer;'
                }).click(function () {

                    button.data("checkedLinks", 0);
                    $('#siteTable').find('div.thing').each(function () {
                        ids.push($(this).data('fullname'));
                    });

                    doSearch();
                    return false;
                });

                try {
                    link = $('div#NERFail>p.nextprev>a:contains("try again")').attr('href').match(/.+?.*after=([^&]+)/i);
                    link = link[0].replace(link[1], '[[ID]]');
                } catch (err) {
                    return false;
                }
                $('div#NERFail>p.nextprev>a').first().before(button);
            }
        });
    });

}(jQuery));

/*for testing
$('.neverEndingReddit>p').first().remove(); $('.neverEndingReddit>p').append($('.neverEndingReddit>p>a').clone().text('try again')).attr('class','nextprev');
$('.neverEndingReddit').attr('id','NERFail'); var tmp = $('div#NERFail'), par = tmp.parent(); tmp.remove(); par.append(tmp);
*/
