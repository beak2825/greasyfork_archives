// ==UserScript==
// @name         LZTCommentLink
// @namespace    MeloniuM/LZT
// @version      1.3.1
// @description  Add clickable link on comment date
// @author       MeloniuM
// @license      MIT
// @match        http*://zelenka.guru/*
// @match        http*://lolz.live/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474218/LZTCommentLink.user.js
// @updateURL https://update.greasyfork.org/scripts/474218/LZTCommentLink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!$('.thread_view, .member_view').length) return;//включаем только в темах и в профиле
    let profile = false;
    if ($('.member_view').length) profile = true;

    //в профиле не подключён https://zelenka.guru/js/lolzteam/thread_improvements/core.min.js поэтому назначим функцию сами.
    if (XenForo.animateBackgroundColor == undefined){
        XenForo.animateBackgroundColor = function(e) {
            var t = e.css("background-color");
            e.animate({
                backgroundColor: "rgb(45,45,45)"
            }, 300, function() {
                setTimeout(function() {
                    e.animate({
                        backgroundColor: t
                    }, 300)
            }, 2e3)
            })
        }
    }

    function addLink(elem){
        const link = location.origin + location.pathname + '#' + $(elem).closest('.comment').attr('id');
        $(elem).wrap('<a href="' + link + '" class="item messageDateInBottom datePermalink" style="display: inline; margin-left: 0;" data-phr="Ссылка скопирована"></a>');
        $(elem).on('click', function(event){
            event.preventDefault();
            const $target = $(event.target).closest('a.messageDateInBottom');
            if (profile){//в профилях ссылка динамическая, поэтому просто копируем в буфер
                Clipboard.copy(encodeURI($target[0].href), $target[0]);
                return;
            }
            let html = '<form class=\"section permalinkInfo\">\n\n\t<div class=\"permalinkContainer\" style=\"padding: 15px 20px;\">\n\t\t<b>Постоянная ссылка<\/b>\n\t\t\t<input type=\"url\" dir=\"ltr\" class=\"textCtrl fillSpace permalink mn-15-0-0\" value=\"'+ encodeURI($target[0].href) +'" autofocus=\"on\" \/>\n\t\t';
            html += '<div class=\"mn-30-0-0\">\n\t\t\t<b>BB-код ссылки<\/b>\n\t\t\t<input type=\"text\" dir=\"ltr\" class=\"textCtrl fillSpace mn-15-0-0\" id=\"bb_code_link_snippet\" value=\"[URL=&quot;'+ encodeURI($target[0].href) +'&quot;]'+ $('.thread_view .titleBar h1')[0].title +'[\/URL]\" \/>\n\t\t<\/div>\n\t\t';
            html += '<div class=\"mn-30-0-0\">\n\t\t\t<b>HTML-код ссылки<\/b>\n\t\t\t<input type=\"text\" dir=\"ltr\" class=\"textCtrl fillSpace mn-15-0-0\" id=\"html_link_code\" value=\"&lt;a href=&quot;'+ encodeURI($target[0].href) +'&quot;&gt;'+ $('.thread_view .titleBar h1')[0].title +'&lt;\/a&gt;\" \/>\n\t\t<\/div>\n\t<\/div>\n\t\n\n<\/form>'
            XenForo.createOverlay(//показываем менюшку
                null,
                $('<div class="section permalinkInfo"></div>').html(html),
                {
                    title: 'Постоянная ссылка для комментария',
                    className: 'comment_link'
                }
            ).load();
        });
    }


    $(document).ready(function(){
        //скроллинг до комментария и анимация при загрузке страницы
        if (location.hash != ''){
            var $scrollTo = $(location.hash);
            if ($scrollTo.length){
                $scrollTo.get(0).scrollIntoView({block: 'end', behavior: 'smooth'});
                XenForo.animateBackgroundColor($scrollTo);
            }else{//если комментария нет на этой странице
                if (profile && location.hash.startsWith('#profile-post-comment-')){
                    const comment_id = location.hash.substr(22);
                    if (!isNaN(comment_id)){//это ведь цифры да?)
                        XenForo.ajax('profile-posts/comments/' + comment_id).then(data => {
                            XenForo.alert('Комментарий на другой странице, перенаправляю..', '', 2e3);
                            location.href = data._redirectTarget.split('#')[0] + location.hash;
                        });
                        //todo: пофиксить случай когда коммент не найден (ajax вернут 404)
                        // на работу не влияет, но в консоль ошибку кидает.
                    }
                }
            }
        }

        $('.comment .DateTime:not(a .DateTime)').each(function(index){
            addLink(this);
        });
    });

    $('.thread_view, .messageSimpleList').on('DOMNodeInserted', function(event) {//при добавлении комментария
        if (!$(event.target).is('.comment, .messageSimple')) return;
        $(event.target).find('.DateTime:not(a .DateTime)').each(function(index){
            addLink(this);
        });
    });
})();