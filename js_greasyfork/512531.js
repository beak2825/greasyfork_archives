// ==UserScript==
// @name         Spacehey Forum & Group Post Reply Notifications
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get reply notifications on the main forum page for any forum/group post that you enable.
// @author       sudofry
// @match        https://forum.spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512531/Spacehey%20Forum%20%20Group%20Post%20Reply%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/512531/Spacehey%20Forum%20%20Group%20Post%20Reply%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var css = document.createElement('style');
    css.innerHTML = `

    #notification {
        background-color: #ffffff;
        color: #0000ff;
        font-weight: bold;
        padding-left: 10px;
    }

    #notification button {
        position: relative;
        top: 28px;
        left: -14px;
        float: right;
        padding-top: 4px;
    }

    #notification a:hover {
        cursor: pointer;
    }

    .message {
        color: #d2691e;
    }

    `;

    document.head.appendChild(css);

    var topics = [];
    var storedTopicId = '';
    var storedReplyId = '';
    var newestReplyId = '';
    var title = '';
    var groupName = '';
    var list = '';
    var checkTopicId = '';
    var storedTopics = '';
    var userId = '';
    var postCreator = '';

    var notificationBox = document.createElement('div');
    notificationBox.id = 'notification';
    $('nav').append(notificationBox);

    var showButton = document.createElement("button");
    showButton.id = 'add';

    if (window.location == 'https://forum.spacehey.com/') {
        $('#notification').html('<br><span class="message">There are no new notifications to display.</span><br>');
        storedTopics = JSON.parse(localStorage.getItem('topics'));

        if (storedTopics != null) {
            for (var i = 0; i < storedTopics.length; i++) {
                storedTopicId = storedTopics[i].split('_')[0];
                storedReplyId = storedTopics[i].split('_')[1];
                check(storedTopicId, storedReplyId);
            }
        }

        $('#notification').on('click', 'a', function() {
            storedTopics = JSON.parse(localStorage.getItem('topics'));
            storedTopicId = $(this).attr('id').split('_')[0];
            $.get('https://forum.spacehey.com/topic?id=' + storedTopicId + '&sort=new#replies', function(getLatestReply) {
                newestReplyId = $(getLatestReply).find('.reply-box').first().attr('id').split('reply')[1];
                if (storedTopics != null) {
                    topics = [];
                    for (var i = 0; i < storedTopics.length; i++) {
                        if (storedTopics[i].split('_')[0] != storedTopicId) {
                            topics.push(storedTopics[i]);
                        }
                    }
                }

                topics.push(storedTopicId + '_' + newestReplyId);
                localStorage.setItem('topics', JSON.stringify(topics));
                window.location.href = 'https://forum.spacehey.com/topic?id=' + storedTopicId + '&sort=new#replies';
            });
        });
    }

    if (window.location.href.indexOf('https://forum.spacehey.com/topic?id=') > -1) {
        storedTopics = JSON.parse(localStorage.getItem('topics'));

        postCreator = $('.profile-pic a').first().attr('href');
        postCreator = postCreator.split('=')[1];

        $('#notification').append(showButton);

        $.get('https://forum.spacehey.com', function(getUserId) {
            userId = $(getUserId).find('.blog-preview a:last-child').attr('href');
            userId = userId.split('=')[1];

            if (userId == postCreator) {
                $('#notification').hide();
            }
        });

        checkTopicId = window.location.href.split('https://forum.spacehey.com/topic?id=')[1];
        checkTopicId = checkTopicId.split('&')[0];

        $('#notification').html('<button id="add">Enable Notifications</button>');

        if (storedTopics != null) {
            for (var x = 0; x < storedTopics.length; x++) {
                storedTopicId = storedTopics[x].split('_')[0];
                if (storedTopicId == checkTopicId) {
                    $('#notification').html('<button id="remove">Disable Notifications</button>');
                }
            }
        }

        $('#notification').on('click', 'button', function() {
            storedTopics = JSON.parse(localStorage.getItem('topics'));

            if ($('#notification').html() == '<button id="add">Enable Notifications</button>') {
                $.get('https://forum.spacehey.com/topic?id=' + checkTopicId + '&sort=new#replies', function(getLatestReply) {
                    newestReplyId = $(getLatestReply).find('.reply-box').first().attr('id');

                    if (newestReplyId == undefined) {
                        newestReplyId = 0;
                    }
                    else {
                        newestReplyId = newestReplyId.split('reply')[1];
                    }

                    if (storedTopics != null) {
                        topics = [];
                        for (var i = 0; i < storedTopics.length; i++) {
                            topics.push(storedTopics[i]);
                        }
                    }

                    topics.push(checkTopicId + '_' + newestReplyId);
                    localStorage.setItem('topics', JSON.stringify(topics));
                    $('#notification').html('<button id="remove">Disable Notifications</button>');
                });
            }

            if ($('#notification').html() == '<button id="remove">Disable Notifications</button>') {
                $.get('https://forum.spacehey.com/topic?id=' + checkTopicId + '&sort=new#replies', function(getLatestReply) {
                    newestReplyId = $(getLatestReply).find('.reply-box').first().attr('id');

                    if (newestReplyId == undefined) {
                        newestReplyId = 0;
                    }
                    else {
                        newestReplyId = newestReplyId.split('reply')[1];
                    }

                    if (storedTopics != null) {
                        topics = [];
                        for (var i = 0; i < storedTopics.length; i++) {
                            if (storedTopics[i].split('_')[0] != checkTopicId) {
                                topics.push(storedTopics[i]);
                            }
                        }
                    }

                    localStorage.setItem('topics', JSON.stringify(topics));
                    location.reload();
                });
            }
        });
    }

    function check(storedTopicId, storedReplyId) {
        $.get('https://forum.spacehey.com/topic?id=' + storedTopicId + '&sort=new#replies', function(getLatestReply) {
            newestReplyId = $(getLatestReply).find('.reply-box').first().attr('id').split('reply')[1];
            title = $(getLatestReply).find('.title').first().text();
            groupName = $(getLatestReply).find('.category a').text().split(' Group')[0];

            if (newestReplyId > storedReplyId) {
                if ($('#notification').html() == '<br><span class="message">There are no new notifications to display.</span><br>') {
                    $('#notification').html('');
                }
                list = $('#notification').html();
                $('#notification').html('<br /><a id="' + storedTopicId + '_' + newestReplyId + '">' + groupName + ' - ' + title + '</a><br />' + list);
            }
        });
    }

})();