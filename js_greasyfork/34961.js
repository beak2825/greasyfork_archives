// ==UserScript==
// @name         InfiniteJandan
// @namespace    https://greasyfork.org/zh-CN/scripts/34961-infinitejandan
// @version      0.9
// @description  Waste your time faster by making images infinite on JANDAN.NET
// @author       w1ndy
// @match        http://jandan.net/pic
// @match        https://jandan.net/pic
// @match        http://jandan.net/ooxx
// @match        https://jandan.net/ooxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34961/InfiniteJandan.user.js
// @updateURL https://update.greasyfork.org/scripts/34961/InfiniteJandan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loading = false;
    let currentPage = $;

    function getNextPage (jq) {
        return new Promise((resolve, reject) => {
            const URI = $(jq.find('.previous-comment-page:first')).attr('href');
            if (!URI) {
                reject('No next page!');
            } else {
                $.get(URI, data => {
                    const page = '<div id="new-page">' + data.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
                    window.history.pushState(null, '', URI);
                    resolve($(page));
                })
                .fail(() => {
                    reject('Unable to load next page!');
                });
            }
        });
    }

    function removeHook() {
        $('.comment-like, .comment-unlike').unbind('click');
        $('.tucao-btn').unbind('click');
    }

    function addHook() {
        // ooxx btn
        $('.comment-like, .comment-unlike').on('click', function () {
            ooxx_action($(this), 'comment');
        });

        // tucao btn
        $('.tucao-btn').on('click', function () {
            var $this = $(this);
            var comment_id = $this.data('id');
            var comment_item = $this.closest('li');
            var tucao_div = comment_item.find('div.jandan-tucao');
            if (tucao_div.length) {
                tucao_div.slideToggle('fast');
            } else {
                tucao_load_content(comment_item, comment_id);
            }
        });
    }

    // Move up the comment box
    $('#commentform').insertBefore('#comments > div:nth-child(1)');
    $('#comments > div:nth-last-child(1)').insertBefore('#commentform');

    // Insert infinite sensor
    $('<div id="infinite-status">Loading next page...</div>')
        .css('height', '50px')
        .css('line-height', '50px')
        .css('text-align', 'center')
        .insertAfter('.commentlist');

    document.addEventListener('scroll', () => {
        if (loading) {
            return;
        }
        if ($(window).scrollTop() + $(window).height() > $('#infinite-status').offset().top) {
            console.log('loading...');
            loading = true;
            removeHook();
            getNextPage(currentPage)
                .then(page => {
                    // clean up old images to save memory
                    const size = $('#comments > ol > li').length;
                    if (size > 15) {
                        const deltaPos = $(`#comments > ol > li:eq(${size - 10})`).offset().top - $('#comments > ol > li:eq(0)').offset().top;
                        $('html, body').scrollTop($('html, body').scrollTop() - deltaPos);
                        $('#comments > ol > li').slice(0, size - 10).remove();
                    }

                    // push new images
                    const elems = page.find('.commentlist > *');
                    const firstId = elems[0].id;
                    $('.commentlist').append(elems);

                    currentPage = page;
                    addHook();
                    loading = false;
                })
                .catch(err => {
                    $('#infinite-status').html(err);
                });
        }
    });
})();