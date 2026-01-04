// ==UserScript==
// @name         dm5 Load all pages
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://www.dm5.com/*
// @match        https://www.dm5.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37863/dm5%20Load%20all%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/37863/dm5%20Load%20all%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadAllPages() {
        if (typeof $ !== 'undefined' && $('a[href$=p2\\/]').size()) {
            var lastPage = 0;
            var lastUrl;
            for (var i = 2; i < 999; i++) {
                var url = $('a[href$=p' + i + '\\/]').attr('href');
                if (typeof url !== 'undefined') {
                    lastPage = i;
                    lastUrl = url;
                }
            }
            var baseUrl = lastUrl.substr(0, lastUrl.indexOf('-'));
            $('<div style="position:fixed;left:50%;bottom:20px;transform:tralsate(-50%,0);padding:5px 10px;background:white;color:black;box-shadow:2px 2px 10px;opacity:0.8;font-size:12px;" id="_status"></div>')
                .appendTo(document.body);
            window._total = 0;
            for (var i = 2; i <= lastPage; i++) {
                var url = baseUrl + '-p' + i + '/';
                console.log('create iframe ' + url);
                $('<iframe style="position:absolute;left:0;top:0;width:0;height:0;">')
                    .attr('src', url + '?_pb=1')
                    .attr('name', '_p' + i)
                    .appendTo(document.body);
                window._total++;
            }
            $('#_status').text('Loading');
        } else {
            window.setTimeout(loadAllPages, 1000);
        }
    }

    function postbackToParent() {
        if (typeof $ !== 'undefined') {
            var img = $('#showimage > #cp_img > img');
            if (img.size() && img.prop('complete')) {
                var src = img.prop('src');
                var page = /p(\d+)/.exec(location.href)[1];
                console.log('get image ' + page + '=' + src);
                for (var i = 2; i <= page; i++) {
                    img = $(window.parent.document).find('#showimage > div[page=' + i + ']');
                    if (!img.size()) {
                        console.log('create image ' + i);
                        img = $('<div style="margin:10px 0;text-align:center;">').attr('page', i).text('Page ' + i).appendTo($(window.parent.document).find('#showimage'));
                    }
                }
                $(window.parent.document).find('#showimage > div[page=' + page + ']')
                    .empty()
                    .append($('<img>').attr('src', src));
                var total = window.parent._total;
                var loading = $(window.parent.document).find('iframe[name^=_p]').size() - 1;
                if (loading <= 0) {
                    $(window.parent.document).find('#_status').hide();
                } else {
                    $(window.parent.document).find('#_status').text((total - loading) + ' / ' + total);
                }
                $(window.parent.document).find('iframe[name=_p' + page + ']').remove();
                return;
            }
        }
        window.setTimeout(postbackToParent, 100);
    }

    if (typeof DM5_CID !== 'undefined') {
        if (location.href.indexOf('_pb=1') < 0) {
            window.setTimeout(loadAllPages, 1000);
        } else {
            window.setTimeout(postbackToParent, 1000);
        }
    }
})();