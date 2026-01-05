// ==UserScript==
// @name         GitLab infinite scroll
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enable infinite scroll for issues
// @author       Florian Lemaitre
// @match        http*://*/*/issues*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29670/GitLab%20infinite%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/29670/GitLab%20infinite%20scroll.meta.js
// ==/UserScript==
window.isLoadingPage = false;
window.$loadingPage = $('<div class="loading" style="display: none;"><i class="fa fa-spinner fa-spin"></i></div>');

(function() {
    if (! isGitLab()) {
        return;
    }

    enableInfiniteScroll();
    highlightProject($('body'));
})();

function isGitLab() {
    return $('meta[content=GitLab]').length > 0;
}

function enableInfiniteScroll() {
    var url = window.location.href;
    var current_page = 1;
    var last_page = 1;
    var last_page_link = false;
    if ($('ul.pagination').find('li.last').length) {
        last_page_link = $('ul.pagination').find('li.last').find('a');
    }
    else if ($('ul.pagination').find('li.page').length) {
        last_page_link = $('ul.pagination').find('li.page').last().find('a');
    }

    if (last_page_link) {
        $(last_page_link.attr('href').split('?')[1].split('&')).each(function(key, value) {
            if (value.split('=')[0] == 'page') {
                last_page = value.split('=')[1];
            }
        });
    }

    $('.content').append(window.$loadingPage);
    $('.gl-pagination').hide();

    $(window).scroll(function() {
        if(!window.isLoadingPage && ($(window).scrollTop() + $(window).height() > $(document).height() - 100)) {
            if (current_page < last_page) {
                loadPageIssueList(url, ++current_page);
            }
        }
    });
}

function loadPageIssueList(url, page) {
    window.isLoadingPage = true;
    window.$loadingPage.show();
    var params = url.split('?').length > 1;
    var url_paginated = url + (params ? '&' : '?') + 'page=' + page;
    $.get(url_paginated, function( data ) {
        $data = highlightProject($(data));
        $('.issues-list').append($data.find('.issues-list > li'));
        window.isLoadingPage = false;
        window.$loadingPage.hide();
    });
}

function highlightProject($context) {
    if ($('body').data('page') !== 'dashboard:issues') {
        return $context;
    }

    $context.find('.issue-info').each(function() {
        var info = $(this).html().split('·');
        info[0] = info[0].match(/(.*\/)([^\/]+)(#.*)/);
        $(this).html(info[0][1] + '<b>' + info[0][2] + '</b>' + info[0][3] + '·' + info[1]);
    });

    return $context;
}