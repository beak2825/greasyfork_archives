// ==UserScript==
// @name         Spacehey Superscript
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  All my previous userscripts for Spacehey rolled into one.
// @author       sudofry
// @match        https://spacehey.com/*
// @match        https://forum.spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518756/Spacehey%20Superscript.user.js
// @updateURL https://update.greasyfork.org/scripts/518756/Spacehey%20Superscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var css = document.createElement('style');
    css.innerHTML = `

    #showAlert {
        background-color: #ffffff;
        color: #ff0000;
        font-weight: bold;
        text-align: center;
        display: none;
    }

    .online-box {
        display: block!important;
        height: 90px!important;
        overflow-y: scroll!important;
    }

    .online-box a {
        line-height: 28px;
    }

    #showDetails {
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: #434343!important;
        background-image: none!important;
        color: #cbcbcb!important;
        width: auto;
        height: auto;
        padding: 10px;
        margin: 0;
        border-radius: 8px;
        border: 2px solid #252525!important;
        text-align: center!important;
        font-family: "Segoe UI", Arial, sans-serif!important;
        font-weight: normal!important;
        font-style: normal!important;
        font-size: 13px!important;
        text-shadow: none!important;
        text-decoration: none!important;
        letter-spacing: 0!important;
        z-index: 100000!important;
        display: none;
    }

    #showDetails p {
        color: #cbcbcb!important;
        background-color: transparent!important;
        font-family: "Segoe UI", Arial, sans-serif!important;
        font-weight: normal!important;
        font-style: normal!important;
        font-size: 13px!important;
        text-shadow: none!important;
        text-decoration: none!important;
        letter-spacing: 0!important;
    }

    #showDetails p:first-child {
        display: inline;
    }

    #showDetails a {
        color: #00c08a!important;
        font-family: sans!important;
        font-weight: normal!important;
        font-style: normal!important;
        font-size: 13px!important;
        text-shadow: none!important;
        text-decoration: none!important;
        letter-spacing: 0!important;
    }

    #showDetails .online img {
        vertical-align: middle;
        content: url('https://static.spacehey.net/img/green_person.svg');
        width: 20px;
    }

    #showDetails b {
        color: #00c08a!important;
        letter-spacing: 0!important;
    }

    #showDetails .awards {
        display: none;
    }

    #notification {
        background-color: #ffffff!important;
        color: #0000ff!important;
        font-weight: bold!important;
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

    #divStripper {
        width:auto;
        height:auto;
    }

    #removeStyle {
        color: #343536!important;
        -webkit-text-fill-color: #343536!important;
        position: fixed!important;
        top: 20px!important;
        right: 20px!important;
        background-color: #99ffcc!important;
        background-image: none!important;
        border: 1px solid #343536!important;
        border-radius: 6px!important;
        width: 23px!important;
        height: 23px!important;
        min-width:23px!important;
        min-height:23px!important;
        max-width:23px!important;
        max-height:23px!important;
        padding: 0!important;
        z-index: 100000!important;
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
    var url = $('.right .m-col p a').attr('href');
    var onlineId = "";
    var friendIds = [];
    var display = [];
    var name = "";
    var names = [];
    var listPageCount = 1;
    var statusPageCount = 1;
    var storedIds = JSON.parse(localStorage.getItem('friendIds'));
    var storedNames = JSON.parse(localStorage.getItem('names'));
    var link = "";
    var newList = "";
    var firstCheck = 1;

    var showAlertBox = document.createElement('div');
    showAlertBox.id = 'showAlert';
    $('nav').append(showAlertBox);

    var divPop = document.createElement("div");
    divPop.id = "showDetails";
    $("body").append(divPop);

    var notificationBox = document.createElement('div');
    notificationBox.id = 'notification';
    $('nav').append(notificationBox);

    var showButton = document.createElement("button");
    showButton.id = 'add';

    var divStripper = document.createElement("div");
    divStripper.id = "divStripper";
    $("body").append(divStripper);

    if ($('#code').length) {
        var removeStyle = document.createElement("button");
        removeStyle.id = "removeStyle";
        $("#divStripper").append(removeStyle);
        $('#removeStyle').html('-');
    }

    $("#removeStyle").on("click", function(e) {
        e.preventDefault();
        $("#divStripper").remove();
        $('link[rel="stylesheet"], style').remove();
        $('*').removeAttr('style');
        $('head').append('<link rel="stylesheet" type="text/css" \ href="https://spacehey.com/css/normalize.css" />');
        $('head').append('<link rel="stylesheet" type="text/css" \ href="https://spacehey.com/css/my.css" />');
    });

    if (window.location == 'https://spacehey.com/home') {
        $('.new-people .inner').addClass('online-box');
        runHomeChecks();
        setInterval(function() {
            runHomeChecks();
        }, 60000)
    }

    if (window.location == 'https://forum.spacehey.com/') {
        runForumGroupChecks();
        setInterval(function() {
            runForumGroupChecks();
        }, 60000)
    }

    $(".person a, .comments-table td:first-child a, .comments-table td small a:first-child").hover(function () {
        var getUrl = $(this).attr("href");
        var userId = getUrl.split('=')[1];
        $(document).keydown(function(e) {
            var code = e.keyCode || e.which;
            if (code == 16) {
                $("#showDetails").html("Loading...").show();
                $.get('https://spacehey.com/profile?id=' + userId, function(getDetails) {
                    var code = $(getDetails).find('.private-profile').html();
                    if (code) {
                        $("#showDetails").html('Private Profile');
                    }
                    else {
                        var details = $(getDetails).find('.details').html();
                        var mood = $(getDetails).find('.mood p:first-child').html();
                        var checkMood = mood.split('<b>Mood:</b>')[1];
                        if (checkMood.trim()) {
                            details += mood;
                        }
                        $("#showDetails").html(details);
                        var last = $("#showDetails time.ago").text();
                        if (last != "") {
                            var date = new Date(last * 1000);
                            var active = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " at " + (date.getHours() % 12 || 12) + ":" + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()) + " " + ((date.getHours() >= 12) ? 'pm' : 'am');
                            $("#showDetails time.ago").prev().remove()
                            $("#showDetails time.ago").replaceWith(active);
                        }
                    }
                });
            }
        });
    }, function() {
           $(document).unbind("keydown");
           $("#showDetails").hide();
    });

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

    function runHomeChecks() {
        $('.profile .contact .inner').load(location.href + ' .profile .contact .inner>*','');
        $('.profile .bulletin-table').load(location.href + ' .profile .bulletin-table>*','');
        $('.profile .blog-entries').load(location.href + ' .profile .blog-entries>*','');
        $('.profile .friends .inner').load(location.href + ' .profile .friends .inner>*','');
        $('.new-people .top').html('<h4>Online Friends</h4><span style="float: right;">Loading...</span>');
        $('.new-people .inner').html('...');
        updateList();
    }

    function runForumGroupChecks() {
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

    function updateList() {
        var id = url.split('/friends?id=')[1];
        $.get('https://spacehey.com/friends?id=' + id + '&page=' + listPageCount, function(updateFriendList) {
            $(updateFriendList).find('.person a:first-child').each(function (i) {
                names.push($(this).text().trim());
                friendIds.push($(this).attr('href').split('=')[1]);
            });
            if ($(updateFriendList).find('.next').length) {
                listPageCount++;
                updateList();
            }
            else {
                if (storedIds != null && storedNames != null) {
                    var idDiff = $(storedIds).not(friendIds).get();
                    var nameDiff = $(storedNames).not(names).get();
                    if (idDiff != "") {
                        $('#showAlert').html('<br />THE FOLLOWING USERS ARE NO LONGER IN YOUR FRIEND LIST!<br /><br />' + nameDiff).show();
                    }
                }
                localStorage.setItem('friendIds', JSON.stringify(friendIds));
                localStorage.setItem('names', JSON.stringify(names));
                storedIds = JSON.parse(localStorage.getItem('friendIds'));
                storedNames = JSON.parse(localStorage.getItem('names'));
                listPageCount = 1;
                checkStatus();
            }
        });
    }

    function checkStatus() {
        $.get('https://spacehey.com/browse?page=' + statusPageCount + '&view=online', function(getOnlineUsers) {
            $(getOnlineUsers).find('.person a:first-child').each(function (i) {
                onlineId = $(this).attr('href').split('=')[1];
                name = $(this).text().trim();
                link = '<a href="https://spacehey.com/profile?id=' + onlineId + '">' + name + '</a><br />';
                if ($.inArray(onlineId, storedIds) != -1) {
                    if (firstCheck == 1) {
                        newList = link;
                        $('.new-people .inner').html(newList);
                        firstCheck++;
                        display.push(link);
                    }
                    else {
                        if ($.inArray(link, display) == -1) {
                            newList = newList + link;
                            $('.new-people .inner').html(newList);
                        }
                        display.push(link);
                    }
                }
            });
            if ($(getOnlineUsers).find('.next').length) {
                $('.new-people .top').html('<h4>Online Friends</h4><span style="float: right;">Loading...</span>');
                statusPageCount++;
                checkStatus();
            }
            else {
                $('.new-people .top').html('<h4>Online Friends</h4>');
                if (display === undefined || display.length == 0) {
                    $('.new-people .inner').html('No Friends Online');
                }
                statusPageCount = 1;
                firstCheck = 1;
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