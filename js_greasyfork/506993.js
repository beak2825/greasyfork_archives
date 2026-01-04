// ==UserScript==
// @name         Favorite GPT conversations
// @version      1.0.0
// @homepage     https://www.techbytegaming.net/
// @description  Show favorite GPT conversions
// @author       acheshirov
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/1363565
// @downloadURL https://update.greasyfork.org/scripts/506993/Favorite%20GPT%20conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/506993/Favorite%20GPT%20conversations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $( document ).ready(function() {
        var isDark = !$('html').hasClass('light');

        var observer = new MutationObserver(function(mutations) {
            setTimeout(function() {
                showPinChatBtn();
            }, 3000);
        });

        observer.observe(document.querySelector("main"), {
            childList: true
        });

        function showPinChatBtn()
        {
            var m2 = $('body').find('.leading\\-\\[0\\]');
            if (m2.find('#addPinThisPage').length === 0) {
                var span2 = m2.find('span').eq(0).clone();
                span2.attr('id', 'addPinThisPage')
                span2.find('svg').replaceWith(`<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24"><path d="M8 2h8a1 1 0 0 1 1 1v.382a1 1 0 0 1-.553.894L15 5v5l2.707 2.707a1 1 0 0 1 .293.707V15a1 1 0 0 1-1 1h-4v4l-1 3l-1-3v-4H7a1 1 0 0 1-1-1v-1.586a1 1 0 0 1 .293-.707L9 10V5l-1.447-.724A1 1 0 0 1 7 3.382V3a1 1 0 0 1 1-1z"/></svg>`);
                if (!isDark) {
                    span2.find('svg').css('filter', 'invert(50%)');
                }
                span2.prependTo(m2);
            }
        }

        setTimeout(function() {
            var m = $('body').find('.h\\-\\[60px\\]');
            var span = m.find('span').eq(0).clone();

            span.find('svg').replaceWith(`<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24"><path d="M8 2h8a1 1 0 0 1 1 1v.382a1 1 0 0 1-.553.894L15 5v5l2.707 2.707a1 1 0 0 1 .293.707V15a1 1 0 0 1-1 1h-4v4l-1 3l-1-3v-4H7a1 1 0 0 1-1-1v-1.586a1 1 0 0 1 .293-.707L9 10V5l-1.447-.724A1 1 0 0 1 7 3.382V3a1 1 0 0 1 1-1z"/></svg>`);
            if (!isDark) {
                span.find('svg').css('filter', 'invert(50%)');
            }
            span.appendTo(m);

            span.on('click', function() {
                showModal();
            });

            showPinChatBtn();
        }, 2000);

        function showModal()
        {
            var chats = GM_getValue('gpt_pin_chats');

            if (!chats) {
                return alert('No pinned chats found!');
            }

            chats = JSON.parse(chats);

            if (chats.length === 0) {
                return alert('No pinned chats found!');
            }

            $('body').find('#myPinnedChats').remove();

            $('body').append('<dialog style="box-shadow: 0 0 7px rgba(200, 200, 200, 0.7); padding: 10px; font-size: 18px; border-radius: 10px; background: rgba(25, 25, 25, 0.98);" id="myPinnedChats"><table border="0"></table></dialog>');

            for (var key in chats) {
                $('#myPinnedChats table').append('<tr data-element-key="' + key + '"><td style="padding: 5px;"><a style="color: #fff" href="' + chats[key].link + '">' + chats[key].title + '</a></td><td style="padding: 5px; color: #fff">[<a href="#" style="color: #fff" class="deletePinnedChat" title="Delete">X</a>]</td></tr>');
            }

            $('#myPinnedChats')[0].showModal();
        }

        $('body').on('click', '#addPinThisPage', function() {
            var title;
            if (title = prompt('Title of the pinned chat', $('head').find('title').text())) {
                var chats = GM_getValue('gpt_pin_chats');
                if (chats) {
                    chats = JSON.parse(chats);
                } else {
                    chats = [];
                }

                for (var key in chats) {
                    if (chats[key].link === window.location.href) {
                        chats[key].title = title;
                        GM_setValue('gpt_pin_chats', JSON.stringify(chats));
                        return;
                    }
                }

                chats.push({'link': window.location.href, 'title': title});

                GM_setValue('gpt_pin_chats', JSON.stringify(chats));
            }
        });

        $('body').on('click', '#myPinnedChats a', function(e) {
            e.preventDefault();

            if ($(this).hasClass('deletePinnedChat')) {
                if (confirm('Are you sure you want to delete this pin?')) {
                    var chats = JSON.parse(GM_getValue('gpt_pin_chats'));

                    chats.splice($(this).parents('tr').attr('data-element-key'), 1)

                    GM_setValue('gpt_pin_chats', JSON.stringify(chats));

                    $('#myPinnedChats')[0].close();
                    showModal();
                }

                return;
            }

            window.location.href = $(this).attr('href');
        });
    });
})();