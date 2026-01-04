// ==UserScript==
// @name         Cinema Mode for notalone.tv (fullscreen)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adds fullscreen Cinema Mode for notalone.tv
// @author       headingWest
// @match        http://notalone.tv/pages/room?room=*
// @require      https://code.jquery.com/jquery-3.4.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388160/Cinema%20Mode%20for%20notalonetv%20%28fullscreen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388160/Cinema%20Mode%20for%20notalonetv%20%28fullscreen%29.meta.js
// ==/UserScript==

var $ = window.jQuery;
var cinemaModeOn = false;
var changedWithCMButton = false;
var config = { childList: true };
var defaultPlayerHeight, defaultChatHeight, defaultMessagesHeight;

var avatars = new Map ();

function toggleCinemaMode () {

    var CMButton = $('button#cinema_button');
    var playlistBlock = $('div.own-after_player');
    var underChatBlock = $('div#chat').find ('div.under_chat');
    var mainBox = $('div.own-mainbox');
    var player = $('div#player').parent ();
    var chat = $('div#chat');

    if (!cinemaModeOn) {

        playlistBlock.css ('display', 'none');
        underChatBlock.find ('div.share, div.settings').css ('display', 'none');
        underChatBlock.find ('div.room_members > h2').css ('display', 'none');
        underChatBlock.find ('div.room_members').attr ('style', 'margin: auto; margin-top: 15px; width: 45%;');
        underChatBlock.find ('div.room_members').appendTo (player);
        mainBox.attr ('style', 'padding: 0; background-color: #2a2b30;');
        player.parent ().css ('height', '100%');
        player.css ('width', '86%');
        chat.css ('width', '14%');
        chat.find ('div.box').attr ('style', 'background-image: none; background-color: #2a2b30;');
        $('ul#messages').css ('height', '95%');

        document.getElementsByClassName ('own-mainbox') [0].requestFullscreen ();
        CMButton.find ('div').css ('background-color', '#35ac78');
        cinemaModeOn = true;

    } else {

        playlistBlock.removeAttr ('style');
        underChatBlock.find ('div.share, div.settings').removeAttr ('style');
        player.find ('div.room_members > h2').removeAttr ('style');
        player.find ('div.room_members').removeAttr ('style');
        player.find ('div.room_members').appendTo (underChatBlock);
        mainBox.removeAttr ('style');
        player.parent ().removeAttr ('style');
        player.removeAttr ('style');
        chat.removeAttr ('style');
        chat.find ('div.box').removeAttr ('style');

        // ==Bandaid fix cause I'm really bad==
        $('div#player').css ('height', defaultPlayerHeight);
        $('div#chat').find ('div.box').css ('height', defaultChatHeight);
        $('div#chat').find ('div.box').find ('ul.messages').css ('height', defaultMessagesHeight);
        // ====================================

        document.exitFullscreen ();
        CMButton.find ('div').css ('background-color', '#d64545');
        cinemaModeOn = false;

    }

}

function newMessage () {

    var lastMessage = $('ul#messages').find ('li:last-child');
    var nickname = lastMessage.find ('div.info').find ('span.user').html ();

    if (nickname == 'Вы') {

        nickname = $('span.name').html ();
        lastMessage.find ('div.info').find ('span.user').html (nickname);

    }

    lastMessage.removeAttr ('class');
    lastMessage.css ('position', 'relative');
    lastMessage.find ('div.info').find ('span.time').css ('margin-right', '25px');
    if (nickname == 'system') {

        lastMessage.css ('background-color', '#6267f4');
        return;

    }
    // custom things
    else if (nickname == 'infernys20') lastMessage.attr ('style', 'position: relative; background-color: #9a26ff; color: white;');
    else if (nickname == 'Snake') lastMessage.attr ('style', 'position: relative; background-color: #8b0000; color: white;');
    else if (nickname == 'vaav') lastMessage.css ('background-color', '#b4d8db');
    else if (nickname == 'toujourspareil') lastMessage.css ('background-color', '#ffffff');
    else lastMessage.css ('background-color', '#edda5c');
    // =============

    lastMessage.append ('<div style="position: absolute; left: 90%; bottom: 4px; width: 50px; height: 50px; border-radius: 50%; background: url(\'' + avatars.get (nickname) + '\') 100% 100% no-repeat; background-size: cover;"></div>');

}

function newUser () {

    $('ul#users').find ('li').each (function (index) {

        loadAvatar ($(this).attr ('data-name'));

    });

}

function loadAvatar (nickname) {

    var profileURL = 'http://notalone.tv/profile/' + nickname;
    var avatarURL;

    $.ajax ({

        url: profileURL,
        type: 'GET',
        success: function (data) {

            data = $(data);
            avatarURL = 'http://notalone.tv' + data.find ('div.avatar_container').find ('img').attr ('src');
            avatars.set (nickname, avatarURL);

        }

    });

}

$(document).ready (function () {

    // ==Prevent page from refreshing==
    var messageForm = $('div#chat').find ('div.box').find ('form.new_message');
    messageForm.on ('submit', function (event) {

        event.preventDefault ();
        event.stopPropagation ();

        messageForm.find ('button').click ();

    });
    // ================================

    // =====Add Cinema Mode button=====
    var buttons = $('div#buttons').find ('div.own-right_buttons');
    var CMButton = '<button id="cinema_button" class="button" style="width: 120px; font-size: 15px;"><div style="width: 10px; height: 10px; background-color: #d64545; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>Cinema Mode</button>';

    buttons.append (CMButton);
    CMButton = buttons.find ('button#cinema_button');

    CMButton.click (function () { changedWithCMButton = true; toggleCinemaMode (); });
    // ================================

    $('div#chat').find ('div.box').find ('ul.messages').attr ('id', 'messages');
    $('div.room_members').find ('ul').attr ('id', 'users');
    $('div#fullscreen').css ('display', 'none');

    defaultPlayerHeight = $('div#player').height ();
    defaultChatHeight = $('div#chat').find ('div.box').height ();
    defaultMessagesHeight = $('ul#messages').height ();

    document.addEventListener ('fullscreenchange', function () {

        if (changedWithCMButton) changedWithCMButton = false;
        else if (!document.fullscreenElement) toggleCinemaMode ();

    });

    var messageObserver = new MutationObserver (newMessage);
    messageObserver.observe (document.getElementById ('messages'), config);

    var userObserver = new MutationObserver (newUser);
    userObserver.observe (document.getElementById ('users'), config);
    newUser ();

});