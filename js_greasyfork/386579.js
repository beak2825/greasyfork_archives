// ==UserScript==
// @name         Wykop mirkoblog wpis podgląd postu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       dahomej
// @include      *wykop.pl/wpis*
// @include      *wykop.pl/link/*
// @include      *wykop.pl/tag/*
// @include      *wykop.pl/mikroblog/*
// @include      *wykop.pl/ludzie/*
// @description  podgląd poprzedniego posta

// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/386579/Wykop%20mirkoblog%20wpis%20podgl%C4%85d%20postu.user.js
// @updateURL https://update.greasyfork.org/scripts/386579/Wykop%20mirkoblog%20wpis%20podgl%C4%85d%20postu.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function parsePost(post) {
        var o = {
            username: $(post).find('.showProfileSummary b').text().trim(),
            content: $(post).find('.text').clone().html(),
            time: $(post).find('time').attr('title')
        };
        o.content = o.username + '<br/>' + o.content;
        return o;
    }

    $(function(){
        $('head').append($('<style id="mystyle"></style>')
                         .html('.myhide {display: none;} .prev {border: 1px solid white;}'));

        function ab(username,posts,thispost) {
            var jqthis = parsePost(thispost);
            var f = '';
            for(var i=0; i<posts.length; i++) {
                if (posts[i].time === jqthis.time) {
                    break;
                }
                if (posts[i].username === username) {
                    f = posts[i];
                }
            }
            return f;
        }

        function processHistory(parent) {
            let posts = parent ? [$(parent).parent().find('[data-type="entry"]').eq(0)].concat(Array.from($(parent).find('> li'))) : $('#itemsStream [data-type="entry"]:first-child, #itemsStream .sub > li');
            var postsHistory = $.map(posts, function(val, it) {
                return parsePost(val);
            });

            $(posts).each(function() {

                $(this).find('.text .showProfileSummary').each(function() {

                    var pare = $(this).parent().parent().parent().parent().parent();
                    //console.log(pare);
                    var texto = $(this).text().trim();
                    var ct = ab(texto,postsHistory,pare);

                    $(this)//.parent()//.parent()
                        .after(
                        $('<a>&nbsp;[E]</a>')
                        .on('click', function() {
                            var pe = $(this).prev();
                            while (!$(pe).hasClass('prev')) {
                                pe = $(pe).prev();
                            }
                            $(pe).toggleClass('myhide');


                            //var pr = $(this).parent().find('.prev');
                            //$(pr).toggleClass('myhide');
                            /*
                        var h = $(pr).css('height');
                        console.log(h);
                        if (h === '1px') {
                            $(pr).css('height', '');
                            $(pr).css('border', '1px solid white');
                        } else {
                            $(pr).css('height', '1px');
                            $(pr).css('border', '0px none white');
                        }
                        */
                        })
                        .css({
                            'width': '30px',
                            'height': '20px',
                            'font-size': '10px',
                            'cursor': 'pointer'
                        })
                    )
                        .before(
                        $('<div></div>')
                        .html(ct ? ct.content : '')
                        .css({
                            'max-height': '250px',
                            'overflow-y': 'auto',
                            'width': 'calc(100% - 60px)'
                            //,'float': 'right'
                        })
                        .addClass('prev myhide')
                    );
                });

                /*
            $(this).find('.text')
            .prepend(
                $('<button">exp</button>')
                .on('click', function() {
                    var pr = $(this).parent().find('.prev');
                    var h = $(pr).css('height');
                    console.log(h);
                    if (h === '1px') {
                        $(pr).css('height', '150px');
                        $(pr).css('border', '1px solid white');
                    } else {
                        $(pr).css('height', '1px');
                        $(pr).css('border', '0px none white');
                    }
                })
                .css({
                    'width': '30px',
                'height': '20px',
                'font-size': '10px'
                })
            )
            .prepend(
                $('<div></div>')
                .html(postsHistory[0].content)
                .css({
                    'max-height': '150px',
                    'overflow-y': 'auto',
                    'height': '1px',
                    'width': 'calc(100% - 60px)',
                    'float': 'right'
                })
                .addClass('prev')
            );*/
            });
        }

        function markOp(parent) {
            let op = $('.space.information.bdivider .usercard a b');
            if (parent) {
                op = $(parent).find('.author.ellipsis a b').eq(0).text().trim();
            } else {
                if (op.length < 1) {
                    op = $('.author.ellipsis b')
                }
                op = op.eq(0).text().trim();
            }

            let entries = parent ? $(parent).find('a.showProfileSummary b') : $('a.showProfileSummary b');

            $(entries).each(function(){
                if ($(this).text().trim() === op) {
                    $(this).css('color', 'purple');
                }
            });
        }

        let currentUrl = window.location.href;
        if (!currentUrl.includes('/mikroblog/') && !currentUrl.includes('/ludzie/') && !currentUrl.includes('/tag/')) {
            processHistory();
            markOp();
        } else {
            $('.affect.ajax[href]').on('click', function() {
                let parent = $(this).parent().parent().parent();
                setTimeout(function() {
                    processHistory(parent);
                    markOp($(parent).parent());
                }, 1750);
            });
        }

    });
})();