// ==UserScript==
// @name         Youtube live verified comments highlighter
// @name:ru      Выделение комментариев от верифицированных пользователей и модераторов на Youtube трансляциях
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Shows (also logs) youtube live comments of verified and moderators persons
// @description:ru  Показывает (а также записывает в лог) комментарии от верифицированных пользователей и модераторов на Youtube трансляциях.
// @author       dark1103
// @include      https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/429416/Youtube%20live%20verified%20comments%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/429416/Youtube%20live%20verified%20comments%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var verified = true;
    var moderator = true;
    var owner = true;

    function setup(){
        const style = document.createElement('style');
        style.innerHTML = `
      #notification_live_chat {
    z-index:1000000!important;
    position:fixed;
    top:0px;
    width:100%;
    text-align:center;
    font-weight:normal;
    font-size:14px;
    color:black;
    background-color:lightgray;
    padding:5px;
}
#notification_live_chat span.dismiss {
    border:2px solid #FFF;
    padding:0 5px;
    cursor:pointer;
    float:right;
    margin-right:10px;
}
#notification_live_chat a {
    color:white;
    text-decoration:none;
    font-weight:bold
}
#notification_live_chat img {
    width:24px;
    vertical-align: middle;
    margin-top: -7px;
}
    `;
        document.head.appendChild(style);
        const node = $('<div id="notification_live_chat" style="display: none;"><span class="text"></span><span class="dismiss"><a title="dismiss this notification">x</a></span></div>');
        node.appendTo(document.body);
    }
    var to = undefined;
    function notify(str){
        if(to !== undefined){
            clearTimeout(to);
        }

        const node = $('#notification_live_chat');
        node.fadeIn("slow").find('.text').html(str);
        node.find(".dismiss").click(function(){
            $(node).fadeOut("fast");
        });
        to = setTimeout(function(){
            $(node).fadeOut("slow");
        }, 12000);
    }

    setup();

    var target = document.querySelector('yt-live-chat-app')

    const config = { childList: true, subtree: true };


    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            var target = $(mutation.target);
            if(target.prop("tagName") === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER'){
                var count = 0;
                if(verified){
                    count += target.find('yt-live-chat-author-badge-renderer[type="verified"]').length;
                }
                if(moderator){
                    count += target.find('yt-live-chat-author-badge-renderer[type="moderator"]').length;
                }
                if(owner){
                    count += target.find('.owner').length;
                }

                if(count > 0){
                    var author = target.find('#author-name').text();
                    var data = target.find('#message').html();
                    var text = target.find('#message').text();
                    //notify(author + ": " + text);
                    notify('<span style="color: hsl(225, 84%, 66%);font-weight:bold;margin-right:5px">' + author + '</span><span>' + data + '</span');
                    console.log(author + ": " + text);
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(target, config);
})();