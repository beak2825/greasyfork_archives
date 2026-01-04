// ==UserScript==
// @name         Spacehey Online & Deleted Friends Checker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  See online friends on your home page where the "Cool New People" section normally shows. Also displays an alert when a friend is no longer in your friend list.
// @author       sudofry
// @match        https://spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503122/Spacehey%20Online%20%20Deleted%20Friends%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/503122/Spacehey%20Online%20%20Deleted%20Friends%20Checker.meta.js
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

    .new-people .inner {
        display: block!important;
        overflow-x: unset!important;
    }

    .new-people .inner a {
        line-height: 28px;
    }

    `;

    document.head.appendChild(css);

    var home = '/home';
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

    if (window.location.pathname == home) {
        $('.new-people .top').html('<h4>Online Friends</h4><span style="float: right;">Loading...</span>');
        $('.new-people .inner').html('...');
        updateList();
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
            }
        });
    }

})();