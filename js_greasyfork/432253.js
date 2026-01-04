// ==UserScript==
// @name         Youtube favorites channels
// @name:ru      Избранные каналы Youtube
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlights videos of the channels that you mark as favorite (only for Grid view). Tap the heart icon on the channel page to add it to your favorites.
// @description:ru  Выделяет видео избранных каналов среди остальных (только в режиме Сетки). Нажмите значок сердца на странице канала, чтобы добавить его в избранное.
// @author       dark1103
// @include      https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/432253/Youtube%20favorites%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/432253/Youtube%20favorites%20channels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bg_color = 'lightgoldenrodyellow';



    function getFav(){
         var fav = GM_getValue("fav1");
        if(fav === undefined){
            fav = [];
        }
        return fav;
    }

    function onLoaded(){
        var name = $('#channel-name #text').eq(0).text();
        var isFav = getFav().includes(name);
        $('#fav-button').remove();
        var node = $('<div id="fav-button" class="style-scope ytd-c4-tabbed-header-renderer" style="line-height: 38px;font-size: large;cursor: pointer;">' + (isFav ? '💖' : '🤍') + '</div>');
        node.appendTo($('#inner-header-container #buttons'));

        node.on('click', function(){

            var fav = getFav();

            if(isFav){
                fav = fav.filter(item => item !== name);
                isFav = false;
            }else{
                fav.push(name);
                isFav = true;
            }

            $('#fav-button').html(isFav ? '💖' : '🤍');
            GM_setValue("fav1", fav);
        });

    }
    function highlightFav(){
        if(location.href === 'https://www.youtube.com/feed/subscriptions'){
            var fav = getFav();
            $('ytd-grid-video-renderer').filter(function(){
                var name = $(this).find('#channel-name #text').text();
                return fav.includes(name);
            }).css('background-color', bg_color);
        }
    }

    function createMutationListener(){
        var target = document.querySelector('body')

        // Create an observer instance linked to the callback function
        const observer2 = new MutationObserver(function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    var target = $(mutation.target);
                    //console.log(target);
                    if(target.prop("tagName") === 'ytd-thumbnail-overlay-time-status-renderer'.toUpperCase()){
                        highlightFav();
                    }
                }
            }
        });

        // Start observing the target node for configured mutations
        observer2.observe(target, { attributes: true, childList: true, subtree: true });
    }

    $(document).ready(function(){
        onLoaded();
        highlightFav();
        createMutationListener();
    });


    var oldHref = document.location.href;
    var bodyList = document.querySelector("body")
        ,observer = new MutationObserver(function(mutations) {

            mutations.forEach(function(mutation) {

                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    setTimeout(function(){
                        onLoaded();
                        highlightFav();
                    }, 1000);
                    onLoaded();
                    highlightFav();
                }

            });

        });

    observer.observe(bodyList, {
        childList: true,
        subtree: true
    });

})();