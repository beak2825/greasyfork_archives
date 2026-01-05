// ==UserScript==
// @name         Habrahabr collapsible comments
// @namespace    habrahabrcc
// @version      0.3.2
// @description  Скрипт позволяет сворачивать неинтересные ветки комментариев на geektimes.com и habr.com
// @author       Roman Akhmadullin edited Anton Zr.
// @match        *://habrahabr.ru/*
// @match        *://geektimes.com/*
// @match        *://habr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25562/Habrahabr%20collapsible%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/25562/Habrahabr%20collapsible%20comments.meta.js
// ==/UserScript==


(function() {

    // Уровень комментариев, на котором они будут скрыты
    var HIDE_LEVEL = 2;

    // Основная функция скрытия-раскрытия комментариев
    var toggleHide = function(item,first_run,speed) {
        item = $(item);
        var item_info = item.find('> .comment > .comment__head > .inline-list > .inline-list__item');
        var comments_container = item.find('> .content-list_nested-comments');
        var replies_count = comments_container.find('.comment').length;
        var has_new_replies = comments_container.find('.comment__head.comment__head_new-comment').length;

        if ((first_run === true && has_new_replies === 0) || first_run === false) { // При первой загрузке не скрывать посты с новыми ответами
            comments_container.slideToggle(speed);
        }

        // Кнопка-элемент, кликая на которую, раскрываются комментарии
        var comments_count_element = item_info.find('> a.comments_count');
        console.log('rc='+replies_count +' '+ comments_count_element.length);
        if (comments_container.css('display') === 'none' || (parseInt(comments_container.css('height')) > 1 && first_run === false)) {
            item.css('marginBottom',20);
            comments_count_element.text('Скрыто комментариев: ' + replies_count);
        } else {
            item.css('marginBottom',null);
            comments_count_element.text('Скрыть комментарии');
        }
    };

    // Добавим комментариям новую кнопочку-сворачивалку-разворачивалку
    var all_page_comments = $('.js-comment');
    all_page_comments.each(function(){
        var replies_count = $(this).find('> .content-list_nested-comments .js-comment').length;
        if (replies_count > 0) { // Если ответов больше 0, то добавим специальную кнопочку
            // Класс .link_to_comment добавлен для того, чтобы перенять стили Хабра
	        var item_info = $(this).find('> .comment > .comment__head > .inline-list > .inline-list__item');
            item_info.find('> .icon_comment-anchor').parent().after('<li class="inline-list__item inline-list__item_comment-nav" style="line-height:13px"><a href="#" class="comments_count defination-list__link">Скрыть комментарии</a></li>');
        }
    });

    // Навесим обработчик нажатия на кнопку
    $('.comments_count').on('click',function(){
    	toggleHide($(this).closest('.js-comment'),false);
        return false;
    });

    var disable_first_hide = false;

    if (window.location.search.indexOf('reply_to') > -1) {
        // Видимо, страница загружена из почты, и ожидается, что
        // человек собирается ответить на комментарий.
        // отключим изначальное скрытие
        disable_first_hide = true;
    }

    if (window.location.hash.indexOf('comment_') > -1) {
        // Надо найти какой-то конкретный комментарий,
        // выключим автоскрытие в этом случае также
        disable_first_hide = true;
    }

    // Скроем все комментарии уровня 3 и выше при загрузке страницы,
    // если нет никаких причин этого не делать
    if (disable_first_hide === false) {

        var hide_comments = function(comments_list,level){
            if (level < HIDE_LEVEL) {
                hide_comments(comments_list.find('> .content-list_nested-comments'),level+1);
            } else {
                comments_list.find('> .js-comment').each(function(){
                    toggleHide(this,true,0);
                });
            }
        }

        hide_comments($('.content-list_comments'),1);

        /*
    	$('.content-list_comments > .js-comment').each(function(){
            $(this).find('> .reply_comments > .comment_item').each(function(){
	            toggleHide(this,true,0);
            });
        });
        */
    }

})();