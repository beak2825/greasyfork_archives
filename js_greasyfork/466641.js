// ==UserScript==
// @name         Webcamdarts Lobby [plus] 
// @version      1.61
// @description  New design for Lobby. More Space, colors, players lists (Friends, Blacklist, Custom). View players info in chat window and more features. 
// @description:pl Nowy projekt Lobby. Więcej miejsca, kolorów, definiowane listy graczy (znajomi, czarna lista, custom). Info o graczach dostępne w oknie czatu i kilka dodatkowych funkcji.
// @author       Edmund Kawalec
// @match        https://*.webcamdarts.com/GameOn/Lobby*
// @match        https://*.webcamdarts.com/wda-games/tournaments/*
// @match        https://*.webcamdarts.com/GameOn/Game/MemberStats/*
// @match        https://*.webcamdarts.com/GameOn/Game/MatchResult/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @namespace    https://greasyfork.org/pl/users/1081222-edmund-kawalec
// @license GIT
// @downloadURL https://update.greasyfork.org/scripts/466641/Webcamdarts%20Lobby%20%5Bplus%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/466641/Webcamdarts%20Lobby%20%5Bplus%5D.meta.js
// ==/UserScript==

const UNREAD_MESSAGES_TIMEOUT = 1000;
const TABS_CHECK_INTERVAL = 5000;

var speaking = 1;
var speech_voices;
var languages = {
    'Polski' : 15,
    'English' : 3,
    'Deutsch' : 2
};

var vCommands = {
    'chatWith' : {
        15: 'Czat z',
        3 : 'Chat with',
        2 : 'Chatten Sie mit'
    },
    'settingsSaved' : {
        15: 'Ustawienia zostały zapisane',
        3 : 'Settings have been saved',
        2 : 'Die Einstellungen wurden gespeichert'
    },
    'newMessage' : {
        15: 'Nowa wiadomość od ',
        3 : 'New message from ',
        2 : 'neue Nachricht von '
    },
    'welcome' : {
        15: 'Witaj ',
        3: 'Welcome ',
        2: 'Hallo ',
    },
    'statuses' : {
        'Available' : {
            15: 'gotowy do gry',
            3: 'ready to play ',
            2: 'fertig zu spielen',
        },
        'Busy' : {
            15: 'zajęty',
            3: 'busy',
            2: 'beschäftigt'
        }
    }


};

if ('speechSynthesis' in window) {
    speech_voices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
        speech_voices = window.speechSynthesis.getVoices();
    };
}

function getLang() {
    let _lng = voiceCfg.get('voiceLanguage');
    return languages[_lng];
}
function getVolume() {
    let _v = parseInt(voiceCfg.get('voiceVolume'));
    return _v > 100 ? 1 : (_v < 1 ? 0 : (_v/100)) ;
}


function say(m) { // language 3 en
    if (voiceCfg.get('voiceEnable')) {
        speechSynthesis.cancel();
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        consoleLog(voices);
        var lang = getLang();
        msg.voice = voices[lang];
        msg.voiceURI = voices[lang].voiceURI;
        msg.volume = getVolume();
        msg.rate = 1;
        msg.pitch = 1;
        msg.text = m;
        msg.lang = voices[lang].lang;
        consoleLog(msg);
        msg.onerror = function(e) {
            speechSynthesis.cancel();
        };

        msg.onpause = function(e) {
            consoleLog('onpause in ' + e.elapsedTime + ' seconds.');
        }

        msg.onend = function(e) {
            consoleLog('onend in ' + e.elapsedTime + ' seconds.');
            speechSynthesis.cancel();
        };

        speechSynthesis.onerror = function(e) {
            consoleLog('speechSynthesis onerror in ' + e.elapsedTime + ' seconds.');
            speechSynthesis.cancel();
        };
        speechSynthesis.speak(msg);
    }
}


$.fn.classChange = function(cb) {
    return $(this).each((_, el) => {
        new MutationObserver(mutations => {
            mutations.forEach(mutation => cb && cb(mutation.target, $(mutation.target).prop(mutation.attributeName)));
        }).observe(el, {
            attributes: true,
            attributeFilter: ['class'] // only listen for class attribute changes
        });
    });
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


var voiceCfg = new MonkeyConfig({
    title: 'Assistant voice settings',
    menuCommand: true,
    params: {
        voiceEnable: {
            'label': 'Voice nEnabled',
            type: 'checkbox',
            default: true
        },
        voiceLanguage: {
            'label': 'Language',
            type: 'select',
            choices: [ 'Polski', 'English', 'Deutsch' ],
            default: 'English'
        },
        voiceVolume: {
            'label': 'Volume [0-100]',
            type: 'number',
            'default': 50
        },
    },
    onSave: function (values) {
        say(vCommands.settingsSaved[getLang()]);
    }
});

var urlParams = new URLSearchParams(window.location.search);
var urlPath = window.location.pathname;
function debugMode() {
    if (urlParams.has('debug') === true) {
        localStorage.setItem('debug', urlParams.get('debug'));
    } else {
        localStorage.setItem('debug', 0);
    }
}
function consoleLog(data) {
    if (localStorage.getItem('debug') == 1) {
        console.log(data);
    }
}
debugMode();



// mods for page Lobby
if (urlPath.startsWith('/GameOn/Lobby')) {

    // INIT
    (function() {
        'use strict';
        $('#current-user').append('<a class="Camtesting" href="https://game.webcamdarts.com/CamTest" target="_blank">Camtest</a>');
        $( "<a class='deco' href='javascript:doLogout()'>Logout</a>" ).appendTo( ".logout" );


        // CSS refactor
        addGlobalStyle('@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"');
        addGlobalStyle('.rMenu.userli.avaiable{order:1;}');
        addGlobalStyle('.rMenu.userli.busy{order:2;}');
        addGlobalStyle('.container{max-width: 750px;}');
        addGlobalStyle('.Camtesting{position: absolute;right:40px;bottom:22px;float:right;}');
        addGlobalStyle('#current-user > div.currenuser-info > div.userinfo {position: relative;left:57px;bottom: 12px;height:100%;width:fit-content }');
        addGlobalStyle('#current-user > div.currenuser-info > div.userinfo > p:nth-child(1) {font-size: 14px;}');
        addGlobalStyle('#current-user > div.currenuser-info > div.userinfo > p:nth-child(2) {font-size: 12px; color: #8F8F8F}');
        addGlobalStyle('#current-user > div.currenuser-info > div.userimage,#current-user > div.currenuser-info > div.userimage > img {position: absolute;top: 0px;width:54px;height:53px;  }');
        addGlobalStyle(' .info-message a {padding-right:5px;}');
        addGlobalStyle(' .info-message {font-weight: bold;background-color:#302E2E;font-size:14px;width: 65%;overflow-x: auto;overflow-y: hidden;white-space: nowrap;display: inline-block; }');
        addGlobalStyle('k-widget {background-color:transparent;}');
        addGlobalStyle(' #currenuser-info {z-index:4000; }');
        addGlobalStyle(' #current-user.available, .userli.available {cursor: pointer; background-color: #4b560d60; }');
        addGlobalStyle('.cusermenu {top: 77px;position: absolute;opacity:0.7;}');
        addGlobalStyle('#current-user.busy{ background-color: #572525; }');
        addGlobalStyle('.motdcont {display: none; width: 50% !important;}');
        addGlobalStyle('#info-profil {position:absolute;display:block;width:100%;color:white;}');
        addGlobalStyle('.logout {position: relative;top: 37px;text-align:right;}');
        addGlobalStyle('#current-user a, .logout a {text-decoration: none}');
        //TEST avec search bar//
        addGlobalStyle(' .info-message {font-weight: bold;background-color:#302E2E;font-size:14px;width: 100%;overflow-x: auto;overflow-y: hidden;white-space: nowrap;display: inline-block; }');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-users.k-pane.k-scrollable > div:nth-child(1){font-size:13px;height:31px;position: fixed;top:61px;left: calc(70vw);background-color:#302E2E;}');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter{min-height: 100%;position: fixed;}');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter {min-height: 82.5%;}');
        addGlobalStyle('.bighonkinglogoutbutton{display:none; }');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-users.k-pane.k-scrollable > div.bighonkinglogoutbutton > a {display:none;}');
        //TEST//
        addGlobalStyle('.messages-container {height: 45px; position: sticky; min-width: 100%; width: 100%; top: -4px; background-color: #302E2E;');
        addGlobalStyle('#nav,.band.navigation{max-width: 750px;position:absolute;z-index:10; }');
        addGlobalStyle('#nav{display:inline;border-bottom: 0px;}');
        addGlobalStyle('#current-user {height: auto;border: none;padding-top: 0px;padding-left: 0px;border-radius: 0px;padding-top: 0px;margin-right: 0px;}');
        addGlobalStyle('div.chat-window-container.k-pane.k-scrollable{padding:0px; }');
        addGlobalStyle('.chat-messagebar{margin-left:0px;}');
        addGlobalStyle('#textMessage{width:calc(50vw - 300px) !important; margin-left: 20px !important; margin-top: 0px !important; margin-bottom: 0px; float:left; height: 37px !important}');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.chat-messagebar.k-pane{margin-top:-120px;margin-left:0px;}');
        addGlobalStyle('.k-state-default{border-color: #2b2b2b00; }');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div:nth-child(4) {display: none; }');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter{min-height:100%;}');
        addGlobalStyle('#lobby, .lobby {min-height:100%;}');
        addGlobalStyle('#users {height:fit-content; min-height: 90%; zoom: 100% !important;}');
        addGlobalStyle('#users {padding-top:0px; margin-top:25px; position:fixed; right: 0px; min-width: max-content; box-sizing: border-box; height:200px; background-color: #8cffa0;}');
        addGlobalStyle('#users {display: flex; flex-wrap: wrap; place-content: flex-start; min-width: 50%; max-width: 50%; }');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter{min-height:100%;}');
        addGlobalStyle('.cusermenu{position:absolute; top:0px;}');
        addGlobalStyle('div#current-user {position: fixed;top:2px;width: 285px;right: 2px;height: 55px;padding-right: 4px;;z-index:9999992;}');
        addGlobalStyle('#current-user > div > div.optionContainer > div {width:0px;display:none;position:fixedvisibility:hidden;}');
        addGlobalStyle('.optionContainer {position: fixed;width: 150px;top: 25px;right: 340px;visibility: visible;;}');
        addGlobalStyle('#current-user > div > div.optionContainer > div > div:nth-child(1) {position: fixed;right: 275px;height: 25px;width: fit-content;top: 24px;width: -moz-fit-content;}');
        addGlobalStyle('#current-user > div > div.optionContainer > div > div:nth-child(2) {position: fixed;right: 275px;top: 0px;height: 25px;width: 111px;width: -moz-fit-content;}');
        addGlobalStyle('.useropt .label {float: left;padding: 6px;padding-top:0px;width: fit-content; }');
        addGlobalStyle('.stausicon.available, .stausicon.busy {height: 20px;width: 20px;padding: 10px;margin-left: 10px;margin-top: 2px;}');
        addGlobalStyle('#current-user > div > div.user-camnotapproved,#current-user > div > div.user-camapproved {    margin-top: 0px;margin-left: 0px;float: right;margin-top: 0px;margin-right: 5px; }');
        addGlobalStyle('#current-user .user-camnotapproved,#current-user .user-camapproved {width: 16px;height: 16px;background-size: 16px 16px;margin-left: 0px;left: 0px;}');
        addGlobalStyle('.userimage {float: left;height: 50px;width: 50px;}');
        //EFFACER MESSAGE
        addGlobalStyle('div.chat-window-container.k-pane.k-scrollable { padding: 0px;min-width: 50%;max-width: 50%;overflow:visible;max-height:unset;min-height:unset;}');
        addGlobalStyle('#chatWindow {height: calc(100vh - 170px); padding: 20px 30px !important; margin: 0px !important; overflow-y: auto;}');

        addGlobalStyle('#nav > div{display:block;max-width:50%;}');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.lobby-game-info.k-pane {z-index:15;}');
        addGlobalStyle('.maincont{margin-top:23px;width:100%;margin-left:0px;}');
        addGlobalStyle('#tray{position:absolute;max-width:40%;}');
        addGlobalStyle('#mc-l{width: fit-content;}');
        addGlobalStyle('#nav {position: fixed; font: initial;  font-family: "Open Sans", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif; }');
        addGlobalStyle('#tray {padding: 0 0 0 0; }');
        addGlobalStyle('.social_menu { display: none; }');
        addGlobalStyle('.motds a { font-size: 12px; }');
        addGlobalStyle('#nav { top: 0px; }');
        addGlobalStyle('.mt35 {margin-top:6px!important;min-width: 100%;min-height: 100%;position: fixed;top: 0px; }');
        addGlobalStyle('.tabs-content {height: 100%;width: 100%;position: absolute;');
        addGlobalStyle('nav.primary ul li a {font-size: 12px;line-height: 12px; padding: 0 7px; }');
        addGlobalStyle('.username {display: none; }');
        addGlobalStyle('.mc-l { width:100%; }');
        addGlobalStyle('#current-user .userinfo p {margin-top: 0px;}');
        addGlobalStyle('.rMenu.userli .userinfo  {max-width: 150px; position: relative;}');
        addGlobalStyle('.rMenu.userli .userinfo p {font-size: 1.25em !important;}');
        addGlobalStyle('.rMenu.userli .userinfo p:first-child {text-indent: 17px;}');
        addGlobalStyle('.rMenu.userli .userinfo p.fn {font-size: 1.15em !important; padding-top: 3px;}');
        addGlobalStyle('.summary .inplay.title .THmo{    width: auto;})');

        addGlobalStyle('.game-result{margin-left:0px;padding:2px;min-width:540px;max-width:100%;padding-bottom: 5px;opacity:1;}');
        addGlobalStyle('.gr table{text-align:center;}');
        addGlobalStyle('.gr table tbody td{color: #7D7D7D;border-left: 1px solid #7D7D7D;font-size: 0.9em;}');
        addGlobalStyle('.gr table td{padding: 3px 3px;}');
        addGlobalStyle('.full-game-result tr:nth-child(even){background: #525252})');
        addGlobalStyle('.full-game-result tr:nth-child(odd){background: #302E2E})');
        addGlobalStyle('.full-game-result td {text-transform: uppercase;})');
        addGlobalStyle('.full-game-result tr td {color: unset;text-align: right; font-weight:bold})');
        addGlobalStyle('.full-game-result tr td + td { color: white;font-weight:unset})');
        addGlobalStyle('.info-handle {position: absolute; height: 0px;opacity: 0.7;top:unset;bottom:unset;width:0px; margin-bottom: unset;margin-left: unset;line-height: 20px;padding-top: 25%;transform: rotate(0turn);padding-bottom: unset;background: content-box;border: none;text-transform: uppercase;padding-left: unset;}');
        addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.lobby-game-info.k-pane{ z-index: 2;})');

        // chat window: click on USER NICKNAME opens privChat - logged user click themseve opens profile stats
        addGlobalStyle('.mc-u strong:hover{cursor:pointer;text-decoration:underline;} #chatWindow .THmo:hover{text-decoration:underline;cursor:pointer;}');
        addGlobalStyle('.dropdown {position: relative;  display: inline-block;} ');
        addGlobalStyle('.dropdown-content {display: inline-flex;  position: relative;  background-color: #f1f1f1;  min-width: 70px;  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);  z-index: 1; margin-left: 10px; margin-right: 10px; border-radius: 6px 6px 6px 6px; }');
        addGlobalStyle('.dropdown-content a { font-size: 11px; color: black;  padding: 6px 8px;  text-decoration: none;  display: inline-block; font-weight: 700;}');
        addGlobalStyle('.dropdown-content a:hover {color: #572525; text-decoration: none}');
        addGlobalStyle('.dropdown-content .playerAvg { font-size: 11px; color: black;  padding: 6px 8px;  text-decoration: none;  display: inline-block; font-weight: 700; border-right: 1px solid #333; margin-right: 5px;}');
        addGlobalStyle('.dropdown-content .hideMe { font-size: 10px; color: black;  padding: 6px 8px;  text-decoration: none;  display: inline-block; font-weight: 700; border-left: 1px solid #333; margin-left: 5px; cursor: pointer;}');
        addGlobalStyle('.dropdown-content a.chatWithUser:hover {color: #3857FA; text-decoration: none}');
        addGlobalStyle('.dropdown-content a.userProfile:hover {color: #D614EC; text-decoration: none}');

        addGlobalStyle('.ui-icon.ui-icon-close{-webkit-filter: grayscale(100%);filter: grayscale(100%);}');
        addGlobalStyle('.chat-users.k-pane{width: calc(50vw) !important; left: calc(50vw) !important;}');
        addGlobalStyle('.lobby-game-info.k-pane {top: 20px !important; left: calc(50vw - 220px) !important;}');
        addGlobalStyle(' @media screen and (max-width: 767px) {  .userli {    min-width: 100%; } }');
        addGlobalStyle(' @media screen and (min-width: 768px) and (max-width: 1024px) {  .userli {    min-width: 45%; } }');
        addGlobalStyle(' @media screen and (min-width: 1025px) and (max-width: 1199px) {  .userli {    min-width: 47%; } }');
        addGlobalStyle(' @media screen and (min-width: 1200px) and (max-width: 1350px) {  .userli {    min-width: 30%; } }');
        addGlobalStyle(' @media screen and (min-width: 1351px) {  .userli {    min-width: 23%; } }');
        addGlobalStyle('.info-handle {left: calc(50vw + 5px) !important; line-height: 30px;}');
        addGlobalStyle('#users .userli .userinfo .user-camapproved, #users .userli .userinfo .user-camnotapproved {position: absolute; top: 15px; left: 45px; } ');
        addGlobalStyle('.chat-container .chat-messagebar #SendMessage  {width: 100px; display: block; float: left; max-width: 100px; } ');
        addGlobalStyle('.ml-5 {margin-left: 5px}');
        addGlobalStyle('.mr-5 {margin-right: 5px}');
        addGlobalStyle('#current-user.available, .userli.available {border: solid 1px #079119; } ');
        addGlobalStyle('#current-user.busy, .userli.busy {border: solid 1px #f22121; } ');
        addGlobalStyle('.userinfo {min-width: 150px;} ');

        addGlobalStyle('#chatWindow .mc-m strong.player {cursor: pointer } ');




        // chat window manage
        $(document).on('click', '#chatWindow .mc-u strong, #chatWindow .mc-m strong,  #chatWindow .THmo, .personal-message .chat-history .mc-u strong', function(e) {
            // szukac w #users .rMenu.userli po value = e.target i pobierac data-uid
            var _username = $(e.target).text();
            $('.dropdown-content').detach();
            var _player = $('#users').find(".rMenu.userli[value='"+_username+"']");
            var listView = $("#users").data("kendoListView");
            var dataItem = listView.dataSource.getByUid(_player.data("uid"));
            var _playerAvg = _player.find('p.fn').text();

            let _forbidden = [
                'Game on!',
                'WDA'
            ];


            if (_username != $('.currenuser-info').attr('value') && !_forbidden.includes(_username)) {
                $(e.target).removeClass('dropdown').addClass('dropdown');
                var _profileLink = '<a class="userProfile" href="https://www.webcamdarts.com/GameOn/Game/MemberStats/'+_username+'" target="_blank"><i class="fa-regular fa-user"></i> Profile</a>';
                var _chatLink = '';
                if (dataItem != undefined) {
                    _playerAvg = '<span class="playerAvg">'+_playerAvg+'</span>';
                    _chatLink = '<a href="#" class="chatWithUser" data-username="'+_username+'"><i class="fa-regular fa-comment"></i> Chat</a>';
                } else {
                    _playerAvg = '<span class="playerAvg">offline</span>';
                }
                var _closeLink = '<span class="hideMe"><i class="fa-regular fa-circle-xmark"></i></span>' ;
                $(e.target).after('<div class="dropdown-content">' + _playerAvg + _chatLink + _profileLink + _closeLink + '</div>');
            }
        });

        $(document).on('click', '#chatWindow .chatWithUser', function(e) {
            var _username = $(e.target).data('username');
            var _player = $('#users').find(".rMenu.userli[value='"+_username+"']");
            var listView = $("#users").data("kendoListView");
            var dataItem = listView.dataSource.getByUid(_player.data("uid"));
            if(dataItem!=undefined)
            {
                var gmw = GetGameMessageWindow(dataItem.Name);
                gmw.ShowTab(true);
                say(vCommands.chatWith[getLang()] +" "+ _username);

            }
        });

        $(document).on('click', '.hideMe', function(e) {
            $(this).parent('.dropdown-content').hide('fast').remove();
        });


        var lastUnreadCounter = 0;
        var unreadMessagesCounter = 0;
        const intervalID = setInterval(chatTabsCheck, TABS_CHECK_INTERVAL); //setInterval(chatTabsCheck, 500, "Parameter 1", "Parameter 2");

        function chatTabsCheck() {
            let lis = $('.maincont ul.tabs').children("li");
            let _c = lis.length;
            let _unreadMessagesCounter = 0;
            let _senders = [];
            lis.each(function(index, value) {
                let _a = $(this).find('a');
                let _closeButton = $(this).find('.ui-icon.ui-icon-close');
                if (_closeButton.length && !_a.hasClass('active') && _a.css('background-color') != 'rgb(245, 245, 245)') {
                    _unreadMessagesCounter++;
                    _senders.push(_a.text());
                }
            });
            consoleLog('_unreadMessagesCounter: ' + _unreadMessagesCounter);
            if (_unreadMessagesCounter == 0) {
                lastUnreadCounter = _unreadMessagesCounter;
            }
            if (_unreadMessagesCounter > 0 && _unreadMessagesCounter != lastUnreadCounter) {
                lastUnreadCounter = _unreadMessagesCounter;
                $.each(_senders, function(index, value) {
                    setTimeout(function() {
                        say(vCommands.newMessage[getLang()] + value);
                    }, UNREAD_MESSAGES_TIMEOUT);
                });
            }

        }



        //current user tile mod
        $('#current-user').hide();

        // mods for logged user section 
        setTimeout(function() {
            $('#current-user .logout').children('a').eq(0).attr('title', 'Profile').addClass('mr-5').html('<small><i class="fa-regular fa-user"></i> profile</small>');
            $('#current-user .logout').children('a').eq(1).attr('title', 'Stats').addClass('ml-5').addClass('mr-5').html('<small><i class="fa-solid fa-chart-line"></i> stats</small>');
            let _msg = $('#current-user .logout').children('a').eq(2).text().replace('Messages ', '<i class="fa-regular fa-message"></i> dms ');
            $('#current-user .logout').children('a').eq(2).attr('title', 'Messages').addClass('ml-5').addClass('mr-5').html('<small>'+_msg+'</small>');
            $('#current-user .logout').children('a').eq(3).attr('title', 'Logout').addClass('ml-5').addClass('mr-5').html('<small><i class="fa-regular fa-circle-xmark"></i> logout</small>');
            $('#current-user a.Camtesting').attr('title', 'Camera Test').html('<i class="fa-solid fa-camera"></i>');

            addGlobalStyle('.useroptions .useropt  {width: 120px !important; } ');
            addGlobalStyle('.useroptions .useropt .available  {padding: 0px; margin-left: 10px; margin-top: 2px; margin-right: 0px; background-image: none } ');
            addGlobalStyle('.useroptions .useropt .busy  {padding: 0px; margin-left: 10px; margin-top: 2px; margin-right: 0px; background-image: none } ');
            addGlobalStyle('.useroptions .useropt .label { padding: 1px 6px; } ');
            addGlobalStyle('.useroptions .useropt .label strong  {font-size: 0.8em; } ');

            $('.useroptions .useropt .available').html('<i class="fa-sharp fa-solid fa-circle-check" style="color: #079119;"></i>');
            $('.useroptions .useropt .busy').html('<i class="fa-sharp fa-solid fa-circle-xmark" style="color: #f22121;"></i>');

            addGlobalStyle('.mc-l .available, .mc-l .busy {background-image: none; padding: 0px; margin-top: 0px; margin-left: 10px; margin-right: 5px;} ');
            addGlobalStyle('.mc-l .available::before, .mc-l .busy::before {inline-block;  vertical-align: middle; font-weight: 900; font-family: "Font Awesome 6 Free";} ');
            addGlobalStyle('.mc-l .available::before {color: #079119; content: "\\f058"; } ');
            addGlobalStyle('.mc-l .busy::before {color: #f22121; content: "\\f057"; } ');
            $('#current-user').show('fast');

            addGlobalStyle('.info-handle {width: auto; } ');
            $('.info-handle').html('<i class="fa-solid fa-chart-line"></i> STATS');

            addGlobalStyle('.useropt.k-link.k-header {padding: 3px 0px; } ');

        }, 3000);


        // fast player search
        addGlobalStyle('#users-name-filter {display: inline-block; width: 200px; margin: 4px 30px 2px 0px; padding: 2px 5px; } ');
        addGlobalStyle('label#label-users-available-filter {display: inline-block; } ');
        addGlobalStyle('select#list-filter {display: inline-block; width: 150px; margin: 4px 30px 2px 0px; padding: 2px 5px; min-height: 23px !important; } ');

        $.expr[':'].icontains = $.expr.createPseudo(function(text) {
            return function(e) {
                return $(e).text().toUpperCase().indexOf(text.toUpperCase()) >= 0;
            };
        });


        // <select id="list-filter"><option value="friendslist">Friends List</option><option value="blacklist">Blacklist</option><option value="customlist">Custom list</option></select>
        $('#users-available-filter').parent('div').css('left', 'auto');
        $('#users-available-filter').parent('div').css('right', '20px');
        $('#users-available-filter').parent('div').html('<select id="list-filter"><option value="0">All</option><option value="friendslist">Friends List</option><option value="blacklist">Blacklist</option><option value="customlist">Custom list</option></select><input id="users-name-filter" type="text" placeholder="... search player"><label id="label-users-available-filter" for="users-available-filter"><input id="users-available-filter" type="checkbox" name="available" /> Available only</label>');

        function searchPlayerByName() {
            var _self = $('#users-name-filter');
            var search = _self.val();
            if (search.length > 1 ) {
                $('#users .rMenu.userli').hide();
                $("#users .userinfo p:first-child:icontains('"+search+"')").parents('.rMenu.userli').show();
            } else {
                $('#users .rMenu.userli').show();
            }
        }

        $('#users-name-filter').on('change, keyup', searchPlayerByName);


        function searchPlayersByList() {
            let val = $('#list-filter').find(":selected").val();
            if (val != 0) {
                $('#users .rMenu.userli').hide();
                $('#users .userinfo p:first-child span span[data-type="'+val+'"]').parents('.rMenu.userli').show();
            } else {
                $('#users .rMenu.userli').show();
            }
        }
        $('#list-filter').on('change', searchPlayersByList);


        let _chatWindow = document.getElementById("chatWindow");
        // update chat playernames for clicks
        var ChatObserver = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
        if (ChatObserver){
            var ChatObserverMonitor = new ChatObserver(function(mutationSet){
                mutationSet.forEach(function(mutation){
                    for (var i=0; i<mutation.addedNodes.length; i++){
                        if (mutation.addedNodes[i].nodeType == 1){
                            updatePlayerOnChat(mutation.addedNodes[i]);
                        }

                        if (document.getElementById("chatAutoscroll") != null && document.getElementById("chatAutoscroll").checked == true) {
                          _chatWindow.scrollTop = _chatWindow.scrollHeight;
                        }

                    }
                });
            });
            // attach chgMon to document.body
            var chatObserverOptions = {childList: true, subtree: true};
            ChatObserverMonitor.observe(document.getElementById("chatWindow"), chatObserverOptions);
        }

        function updatePlayerOnChat(el) {
            var patterns = [
                ' joined the Lobby',
                ' is available for games'
            ];
            var node = $(el).find('.mc-m');
            patterns.some(function(v) {
                let text = node.text();
                let test = text.indexOf(v) >= 0;
                if (test === true) {
                    setTimeout(function() {
                        let _username = text.replace(v, '');
                        let _color = '';
                        let _class = 'player';
                        let _player = $('#users').find(".rMenu.userli[value='"+_username+"']").find('.userinfo');
                        _color = _player.css('color');
                        node.hide().html('<strong style="color: '+_color+'" class="player" title="">' + _username + '</strong> ' + v).fadeIn('fast');
                        consoleLog(v + ' found in: ' + node.text() + ', recognized nick:' + _username);
                    }, 1000);
                }
                return test;
            })
        };




        // mod for chat footer
        setTimeout(function() {

            let scrollSwitchLabel = document.createElement("label");
            scrollSwitchLabel.setAttribute('for', 'chatAutoscroll');

            let scrollSwitch = document.createElement("input");
            scrollSwitch.type = 'checkbox';
            scrollSwitch.id = 'chatAutoscroll';
            scrollSwitch.value = 1;
            scrollSwitch.setAttribute('checked', true);
            scrollSwitchLabel.append(scrollSwitch);
            scrollSwitchLabel.innerHTML += ' Auto scroll';

            let sendButton = document.querySelector('#SendMessage');
            sendButton.after(scrollSwitchLabel);

            $(".motds").detach().appendTo(".messages-container");

        }, 3000);

        setTimeout(function() {
            $('#current-user .optionContainer .useropt').click(function() {
                let status = $(this).find('.label').text();
                say('status ' + vCommands.statuses[status][getLang()]);
            });
        }, 5000);


        /* --------- Friends ---------*/
        if (window.self !== window.top) { return; } // end execution if in a frame

        // Main workhorse routine
        function playersHighlight(el, config, keywords, highlight, type){

            var kwords = config.get(keywords);
            if(!kwords)  { return; }  // end execution if not found
            let sep = ',';
            var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
            var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
            kwords = kwords.replace(pat1, sep).replace(pat2, '');
            kwords = kwords.replace(/\s{2,}/g, ' ').trim();


            var highlightStyle = config.get(highlight);

            var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
            kwords = "\\b" + kwords.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
            var pat = new RegExp('(' + kwords + ')', 'gi');
            var span = document.createElement('span');
            // getting all text nodes with a few exceptions
            var snapElements = document.evaluate(
                './/text()[normalize-space() != "" ' +
                'and not(ancestor::style) ' +
                'and not(ancestor::script) ' +
                'and not(ancestor::textarea) ' +
                'and not(ancestor::code) ' +
                'and not(ancestor::pre)]',
                el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

            if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

            for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
                var node = snapElements.snapshotItem(i);
                // check if it contains the keywords
                if (pat.test(node.nodeValue)) {
                    // check that it isn't already highlighted
                    if (node.className != "THmo" && node.parentNode.className != "THmo"){
                        // create an element, replace the text node with an element
                        var sp = span.cloneNode(true);
                        sp.innerHTML = node.nodeValue.replace(pat, '<span data-type="'+type+'" style="' + highlightStyle + '" class="THmo">$1</span>');
                        node.parentNode.replaceChild(sp, node);
                    }
                }
            }
        }

        var friendsCfg = new MonkeyConfig({
            title: 'Friends list',
            menuCommand: true,
            params: {
                keywordsFriends: {
                    'label': 'Friends names<br>comma separated:<br>nick 1, nick2 ,...',
                    type: 'text',
                    default: ''
                },
                highlightStyleFriends: {
                    'label': 'Set Highlight Style<br>(proper CSS)',
                    type: 'text',
                    default: 'color: #000; background-color: #38d60c; border-radius: 6px 6px 6px 6px; padding: 1px 2px;'
                },
            },
            onSave: function (values) {
                say(vCommands.settingsSaved[getLang()]);
                if(!document.body.querySelector(".THmo")) {
                    playersHighlight(document.body, friendsCfg, 'keywordsFriends', 'highlightStyleFriends');
                }
                else {
                    location.reload();
                }
            }
        });
        var blackListCfg = new MonkeyConfig({
            title: 'Blacklist',
            menuCommand: true,
            params: {
                keywordsBlack: {
                    'label': 'Black List names<br>comma separated:<br>nick 1, nick2 ,...',
                    type: 'text',
                    default: ''
                },
                highlightStyleBlack: {
                    'label': 'Set Highlight Style<br>(proper CSS)',
                    type: 'text',
                    default: 'color: #FFF; background-color: #000; border-radius: 6px 6px 6px 6px; padding: 1px 2px;'
                },
            },
            onSave: function (values) {
                say(vCommands.settingsSaved[getLang()]);
                if(!document.body.querySelector(".THmo")) {
                    playersHighlight(document.body, blackListCfg, 'keywordsBlack', 'highlightStyleBlack');
                }
                else {
                    location.reload();
                }
            }
        });
        var personalCfg = new MonkeyConfig({
            title: 'Custom list',
            menuCommand: true,
            params: {
                keywordsPersonal: {
                    'label': 'Players names<br>comma separated:<br>nick 1, nick2 ,...',
                    type: 'text',
                    default: ''
                },
                highlightStylePersonal: {
                    'label': 'Set Highlight Style<br>(proper CSS)',
                    type: 'text',
                    default: 'color:#f01466; font-weight:bold; background-color: #dedede; border-radius: 6px 6px 6px 6px; padding: 1px 2px;'
                },
            },
            onSave: function (values) {
                say(vCommands.settingsSaved[getLang()]);
                if(!document.body.querySelector(".THmo")) {
                    playersHighlight(document.body, personalCfg, 'keywordsPersonal', 'highlightStylePersonal');
                }
                else {
                    location.reload();
                }
            }
        });


        // Add MutationObserver to catch content added dynamically
        var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
        if (THmo_MutOb){
            var THmo_chgMon = new THmo_MutOb(function(mutationSet){
                mutationSet.forEach(function(mutation){
                    for (var i=0; i<mutation.addedNodes.length; i++){
                        if (mutation.addedNodes[i].nodeType == 1){
                            playersHighlight(mutation.addedNodes[i], friendsCfg, 'keywordsFriends', 'highlightStyleFriends', 'friendslist');
                            playersHighlight(mutation.addedNodes[i], blackListCfg, 'keywordsBlack', 'highlightStyleBlack', 'blacklist');
                            playersHighlight(mutation.addedNodes[i], personalCfg, 'keywordsPersonal', 'highlightStylePersonal', 'personallist');
                            searchPlayerByName();
                            searchPlayersByList();
                        }
                    }
                });
            });
            // attach chgMon to document.body
            var opts = {childList: true, subtree: true};
            THmo_chgMon.observe(document.body, opts);
        }

        /* --------- BLACK LIST ---------*/
        // first run
        playersHighlight(document.body, friendsCfg, 'keywordsFriends', 'highlightStyleFriends', 'friendslist');
        playersHighlight(document.body, blackListCfg, 'keywordsBlack', 'highlightStyleBlack', 'blacklist');
        playersHighlight(document.body, personalCfg, 'keywordsPersonal', 'highlightStylePersonal', 'personallist');

    })();


}




// mods for page MemberStats
if (urlPath.startsWith('/GameOn/Game/MemberStats/')) {


    (function() {
        'use strict';

        // after Results_read XHR call
        var StatsObserver = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
        if (StatsObserver){
            var StatsObserverMonitor = new StatsObserver(function(mutationSet){
                mutationSet.forEach(function(mutation){
                    for (var i=0; i<mutation.addedNodes.length; i++){
                        if (mutation.addedNodes[i].nodeType == 1){
                            updateStatsData(mutation.addedNodes[i]);
                        }
                    }
                });
            });
            // attach chgMon to document.body
            var StatsObserverOptions = {childList: true, subtree: true};
            if (document.getElementById("resultsGrid")) {
                StatsObserverMonitor.observe(document.getElementById("resultsGrid"), StatsObserverOptions);
            }
        }

        function updateStatsData(el) {

            let node = $(el).find('td')[0];
            let game_id = $(node).text();
            $(node).html('<a href="https://www.webcamdarts.com/GameOn/Game/MatchResult/'+game_id+'" target="_blank" class="game">'+game_id+'</a>');

            node = $(el).find('td')[1];
            if ($(node).text() == 'Equalizer') {
                $(node).addClass('game-equalizer');
            }

            node = $(el).find('td')[2];
            let player = $(node).text();
            $(node).html('<a href="https://www.webcamdarts.com/GameOn/Game/MemberStats/'+player+'" target="_blank" class="playerName">'+player+'</a>');

            node = $(el).find('td')[4];
            if ($(node).text() == 'WIN') {
                $(node).addClass('win');
            } else {
                $(node).addClass('lost');
            }

        };

        // additional CSS
        addGlobalStyle('#panelBarStats table.full-game-result tbody tr:first-child td {font-size: 1.4em; color: #04d81d; }');
        addGlobalStyle('a.game {text-decoration: none; color: #efefef; } a.game:hover {text-decoration: underline; }');
        addGlobalStyle('a.playerName {text-decoration: none; color: #02ede9; } a.playerName:hover {text-decoration: underline; }');
        addGlobalStyle('td.game-equalizer {text-decoration: none; color: #b7ade7; }');
        addGlobalStyle('td.win {text-decoration: none; color: #04d81d; }');
        addGlobalStyle('td.lost {text-decoration: none; color: #ea6969; }');

    })();


}

// mods for page MatchResult
if (urlPath.startsWith('/GameOn/Game/MatchResult/')) {

    (function() {
        'use strict';

        let node = $('table.full-game-result thead tr').find('th')[1];
        let player = $(node).text();
        $(node).html('<a href="https://www.webcamdarts.com/GameOn/Game/MemberStats/'+player+'" target="_blank" class="playerName">'+player+'</a>');

        node = $('table.full-game-result thead tr').find('th')[2];
        player = $(node).text();
        $(node).html('<a href="https://www.webcamdarts.com/GameOn/Game/MemberStats/'+player+'" target="_blank" class="playerName">'+player+'</a>');

        addGlobalStyle('a.playerName {text-decoration: none; color: #02ede9; } a.playerName:hover {text-decoration: underline; }');

    })();

}


