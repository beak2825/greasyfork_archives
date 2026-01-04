// ==UserScript==
// @name        TinyChatScript 01_03_24
// @version     1.8.58
// @description Modified TinyChat - Best Scripts; prepare to be amazed.
// @author      CosmosisT
// @license     Copyright (C) CosmosisT
// @icon        https://i.imgur.com/XlkFjOK.png
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts*
// @grant       none
// @run-at      document-start
//              jshint esversion: 6
// @namespace https://greasyfork.org/users/1241733
// @downloadURL https://update.greasyfork.org/scripts/483584/TinyChatScript%2001_03_24.user.js
// @updateURL https://update.greasyfork.org/scripts/483584/TinyChatScript%2001_03_24.meta.js
// ==/UserScript==

(function() {
    "use strict";
    //DEBUGGER
    window.DebugClear = false; // TRUE = CLEARS || FALSE = SHOWS
    window.CTSVersion = {
        Major: 1,
        Minor: 8,
        Patch: 58
    };
    var MainElement, ChatLogElement, VideoListElement, SideMenuElement, TitleElement, UserListElement, ModerationListElement, ChatListElement, UserContextElement, MicrophoneElement, TextAreaElement,
        FeaturedCSS, VideoCSS, SideMenuCSS, MainCSS, RoomCSS, TitleCSS, ContextMenuCSS, ModeratorCSS, UserListCSS, ChatListCSS, NotificationCSS, ChatboxCSS;
    //CTS MAIN VARIABLES
    var CTS = {
        Project: {
            Name: "CTS",
            Storage: "CTS_",
            isTouchScreen: false,
        },
        AnimationFrameWorker: undefined,
        WorkersAllowed: (typeof(Worker) !== "undefined"),
        Me: {},
        Room: {},
        ScriptInit: false,
        MainBackground: `radial-gradient(#FFFFFF, #5d839c, #254c66) #000`,
        MediaStreamFilter: "No Filter",
        OGStyle: {
            HeightCounter: 3,
            WidthCounter: 1,
            SavedHeight: undefined,
            SavedWidth: undefined
        },
        NormalStyle: {
            ChatHide: false
        },
        FontSize: 20,
        ChatStyleCounter: 0,
        ChatHeight: 30,
        ChatWidth: 0,
        ChatDisplay: true,
        UserListDisplay: true,
        ChatStyles: undefined,
        ChatType: true,
        MainBackgroundCounter: 0,
        NotificationLimit: 100,
        ChatScroll: true,
        CreateMessageLast: undefined,
        NotificationScroll: true,
        NoGreet: false,
        Featured: true,
        Bot: true,
        AutoKick: false,
        AutoBan: false,
        GreetMode: false,
        PerformanceMode: false,
        VoteSystem: false,
        Popups: true,
        Avatar: true,
        Reminder: true,
        CanSeeTips: true,
        CanSeeGames: true,
        CanHostFishGames: false,
        CanHostTriviaGames: false,
        CanHostWordleGames: false,
        isFullScreen: false,
        Imgur: true,
        ImgurWarning: 0,
        Notification: true,
        RaidToggle: true,
        ThemeChange: true,
        SoundMeterToggle: true,
        TimeStampToggle: true,
        AutoMicrophone: false,
        GreenRoomToggle: true,
        PublicCommandToggle: true,
        Strict: false,
        SpamBan: false,
        Game: {
            NoReset: false,
            Wordle: {
                wordList: [],
                ActiveAnswer: [],
                ActivePlayer: [],
                AttemptList: [],
                CurrentAttempt: [],
                Keyboard: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                ProgressMsg: "",
                tempMsg: "",
            //    Timer: undefined,
            //    WaitCount: 0,
            //    Waiting: true,
            },
            Trivia: {
                QuestionList: [],
                Timer: undefined,
                ANum: ["A", "B", "C", "D"],
                Correct: "",
                Attempts: 0,
                AttemptList: [],
                WaitCount: 0,
                Waiting: true,
                HighScore: ["CosmosisT", 2],
                Worth: 0,
                PlayerList: {},
                PriceList: {
                    raid: 50000, //default 10000
                    spot: 1000, //default 500
                }
            },
            Fish: {
                HighScore: ["CosmosisT", 13337],
                StartTimeout: undefined,
                RestockTimeout: undefined,
                ReCastTimeout: undefined,
                NotEnoughTimeout: undefined,
                Round: 0,
                Player: [],
                TypesOfFish: [
                    ["Bullfrog", 1, true],
                    ["Bluegill", 2, true],
                    ["Goldfish", 3, true],
                    ["Dropped Bait", 4, false],
                    ["Sardines", 5, true],
                    ["Catfish", 6, true],
                    ["Spotted Bass", 7, true],
                    ["Sea Bass", 8, true],
                    ["Shrimp", 9, true],
                    ["Seasick!", 10, false],
                    ["Cisco Fish", 11, true],
                    ["Edible Seaweed", 12, true],
                    ["Snagged Boot", 13, false],
                    ["Snagged Tire", 14, false],
                    ["Lost Rod", 15, false],
                    ["Rainbow Trout", 16, true],
                    ["Snapped Line", 80, false],
                    ["Parrotfish", 17, true],
                    ["Plastic Bag", 18, false],
                    ["Walleye", 19, true],
                    ["Grouper", 20, true],
                    ["Family Clams", 21, true],
                    ["Family Oysters", 22, true],
                    ["Blackfish", 23, true],
                    ["Dolphin", 24, true],
                    ["Sea Urchin", 25, true],
                    ["Pufferfish", 26, true],
                    ["Pirates", 27, false],
                    ["Lobster", 28, true],
                    ["Albacore", 29, true],
                    ["Electric Eel", 30, true],
                    ["Shocked by Eel", 31, false],
                    ["Swordfish", 32, true],
                    ["Reel Jammed", 33, false],
                    ["Fumbled Net", 34, false],
                    ["Giant Squid", 35, true],
                    ["Swordfish", 36, true],
                    ["Octopus", 37, true],
                    ["Sea Serpent", 38, true],
                    ["Sea Turtle", 39, true],
                    ["Cleaned Lake", 40, true],
                    ["Female Whale", 41, false],
                    ["Pacific Cod", 42, true],
                    ["Barracuda", 43, true],
                    ["Pike Fish", 44, true],
                    ["Sturgeon", 45, true],
                    ["Anglerfish", 46, true],
                    ["Marlin", 47, true],
                    ["Yellow Tuna", 48, true],
                    ["Bluefin Tuna", 49, true],
                    ["Red Snapper", 50, true],
                    ["Great White", 51, true],
                    ["Mermaid🧜‍♀️", 52, true],
                    ["Loch Ness🐉", 75, true],
                    ["Treasure🪙", 100, true]
                ]
            }
        },
        hasGreetedWC: false,
        Host: 0,
        HostAttempt: 0,
        HostWaiting: false,
        StorageSupport: true,
        WaitToVoteList: [],
        UserList: [],
        MentionList: [],
        TempIgnoreNickList: [],
        TempIgnoreUserList: [],
        IgnoreList: [],
        UserBanList: [],
        NickBanList: [],
        UserKickList: [],
        NickKickList: [],
        BotOPList: [],
        BotModList: [],
        BanKeywordList: [],
        KickKeywordList: [],
        UserKeyBanList: [],
        NickKeyBanList: [],
        HighlightList: [],
        GreetList: [],
        ReminderList: [],
        ReminderServerInList: [],
        Favorited: [null, null, null, null, null],
        SafeList: [],
        GreenRoomIgnoreList: [],
        GreenRoomList: [],
        WatchList: [],
        HiddenCameraList: [],
        KBQueue: [],
        Message: [
            []
        ],
        Clipboard: {
            Message: [""],
            Typing: false,
            Log: "",
            MessageLen: 0,
            Counter: 0
        },
        LastMessage: new Date(),
        ShowedSettings: false,
        SendQueue: [],
        MissedMsg: 0,
        Camera: {
            List: [],
            Sweep: false,
            SweepTimer: 5,
            clearRandom: undefined
        },
        NotificationTimeOut: [],
    };

    CTS.StorageSupport = StorageSupport();
    SetLocalValues();

    //IS USER TOUCHSCREEN
    CheckUserTouchScreen();
    if (CTS.ThemeChange) {
        // TinyChat Style
        FeaturedCSS = "#videos.column>.videos-items{height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
        ChatListCSS = "#playerYT{background: black;border-radius: 3px;}.overlay .duration{background:#9a0000;}.overlay .volume{background: #2a6a89;}.overlay .volume, .overlay .duration{height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.overlay span:hover{background: #53b6ef;cursor: pointer;}.overlay button{outline: none;line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 28px;width: 34px;}.overlay{position: absolute;width: 100%;height: 25px;display: contents;}#player{pointer-events:none; width:100%; height:20%;}#chatlist{background:#00000075;}.list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#53b6ef;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background:#53b6ef;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{font-weight: 600;border-radius:unset;color:#FFFFFF;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}";
        ChatboxCSS = "#chat-import-label{text-align: center;height: 20px;right: 70px;width:35px;cursor:pointer;}#safelist-import-label{text-align: center;height: 20px;cursor:pointer;}#chat-import{opacity: 0;position: absolute;z-index: -1;}#safelist-import{opacity: 0;position: absolute;z-index: -1;}.stackmessage:hover > .ctstimehighlight{display:block;z-index:1;}.ctstimehighlight{font-weight: 600;font-size: 16px;color: #FFF;position: absolute;right: 3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;display:none;}.stackmessage{background: #00000085;border-radius: 6px;margin: 5px 0 0 -5px;padding: 5px;border: #7672729e 1px solid;}#chat-export{right:35px;width:35px;}#safelist-export{right:105px; width:35px;}#safelist-import-label{right:140px; width:35px;}#chat-download{right:0;width:35px;}#safelist-import-label:hover,#safelist-export:hover, #chat-import-label:hover, #chat-export:hover, #chat-download:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}.chat-button{outline:none;background: unset;border: unset;position: absolute;height: 22px;padding-top: 2px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;}#chatlog-button{display:none!important;}@media screen and (max-width: 1200px){#chat-hide{display: none!important;top: -39px!important;left: 0!important;width: 100%!important;border-radius: 0!important;}}#chat-hide{top: calc(50% - 18px);position: absolute;display: block;height: 16px;width: 16px;left: -8px;margin-top: -20px;border-radius: 16px;font-size: 0;background:url(https://i.imgur.com/jFSLyDD.png) #000000 center no-repeat;background-size:16px;cursor: pointer;z-index: 1;-webkit-box-shadow: 0 0 6px #666;box-shadow: 0 0 6px #666;}#chat-instant.show{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(25, 29, 32)100%)!important;}#chat-wider:before{transition:.3s;margin: -4px 0 0 -4px;border-width: 6px 6px 6px 0;border-color: transparent #ffffff!important;}#chat-wider{-webkit-box-shadow: 0 0 6px #666;box-shadow: 0 0 6px #666;z-index: 2;background:#000000!important}#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #10131494;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;overflow:hidden;}#user-menu{border-radius: 6px;background: #000000b8;position: absolute;display: none;bottom: 50px;right: 0;box-sizing: border-box;border-radius: 6px;color: #FFFFFF;line-height: 1;z-index: 1;max-width:300px;padding:12px;}#user-menu > span {border-radius:6px;background:#000000c9;display: inline-block;width: 100%;padding: 6px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background:unset;}.cts-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.ctstime{position:absolute;right:3px;top:3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#cts-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message>.systemuser{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgba(0, 0, 0, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift>a{background:black;}.gift{border-radius:12px;background: #0165d0;-webkit-box-shadow: inset 0 0 5em 5px #000;box-shadow: inset 0 0 5em 5px #000;}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{text-decoration:underline;}#chat{will-change: transform;min-height:unset;}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#cts-chat-content>.message{padding:6px 3px;background:#101314a8;position:relative;left:0;margin-bottom:3px;border-radius:6px}#cts-chat-content>.message.highlight,.message.common.highlight{background:#666666a1;-webkit-box-shadow: inset 0 0 20px #000000;box-shadow: inset 0 0 20px 0 #000000;}#cts-chat-content>.message.common{min-height: 50px;padding:3px 3px 9px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#cts-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);pointer-events:none;}#chat-instant>.avatar>div,#cts-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}.notifbtn:hover{background:linear-gradient(0deg,rgba(255, 255, 255,0.25)0%,rgba(20, 20, 20, 0.94)75%,rgba(225, 225, 225, 0.6)100%);}.notifbtn{cursor: pointer;border-radius: 0 0 12px 12px;outline: none;background:linear-gradient(0deg,rgba(0, 0, 0, 0)0%,rgba(37, 37, 37, 0.32)75%,rgba(255, 255, 255, 0.6)100%);border: none;color: white;width: 100%;}#notification-content.large{height:50%;}#notification-content{transition: .2s;will-change: transform;top:0;position:relative;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height:20%;min-height:38px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#cts-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-instant::after{content:unset;}.on-white-scroll{scrollbar-width: none;overflow-wrap: break-word;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content>.message>.nickname{cursor: pointer;border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" + (CTS.FontSize - 4) + "px;font-family:sans-serif;font-weight:300;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
        MainCSS = "#menu{display:none;}#mobile-app.show{display:none;}html{background:rgba(0,0,0,1);}#menu-icon{display:none;}body{background:" + CTS.MainBackground + ";background-position: center!important;background-size:auto!important;overflow:hidden;}#nav-static-wrapper {display:none;}#content{padding:0!important;}";
        VideoCSS = "#button-banlist{display:none;color: white;cursor: pointer;background: #101314;border: none;}#button-banlist:hover{background:#53b6ef;}.overlay{display:none;}#youtube.video > div > .overlay > .icon-visibility{display:none;}@media screen and (min-width: 700px){#seek-duration{display:block!important;}}#seek-duration{display:none;}#youtube.video:hover > div > .overlay{opacity:1;}#youtube.video > div{margin-bottom:unset;}#youtube.video > div > .overlay{top: calc(100% - 57px);opacity: 0;transition: opacity .5s ease-out;-moz-transition: opacity .5s ease-out;-webkit-transition: opacity .5s ease-out;-o-transition: opacity .5s ease-out;background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}.video>div{border-radius:10px;}@media screen and (max-width: 600px){#videos{top:38px;}#videos-header{position: unset;height: unset;width: unset;top: unset;bottom: unset;padding: 0 2px 10px 15px;box-sizing: border-box;}}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{height:unset;}#videolist[data-mode=\"dark\"]{background-color:unset;}@media screen and (max-width: 1200px){#videos-footer{right: unset!important;bottom: -22px!important;top: unset!important;}}#videos-footer-broadcast-wrapper{margin-top:16px;}.tcsettings{display:none}#videos-header{background:#101314;}#videos-footer-broadcast-wrapper.active>#videos-footer-broadcast,#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button,#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:focus{background-color:#2d373a;}.js-video.broken{display:none;}.videos-header-volume {border-color:#202627;}.tcsettings:hover{background:#008cda;}.tcsettings{cursor: pointer;outline: none;background:#101314;border: none;color: white;}.music-radio-info>.description{cursor:default;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.music-radio-info>.volume{bottom: 0;position: absolute;background: #2a6a89;height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.music-radio-info{top: -50px;position: absolute;background: #071c19f0;height: 50px;width: 336px;line-height: 24px;}.ctsdrop{position:fixed;display:inline-block;top:3px;left:4px;z-index:5;min-width: 46px;}.ctsdrop-content{top:28px;right:0;background:#101314;width: 92px;padding:0;z-index:1;display:none;}.ctsdrop:hover .ctsdrop-content{display:block;}.ctsdrop-content button.hidden{display:none;}.ctsdrop-content button:hover, .ctsoptions:hover{background:#53b6ef}.ctsdrop-content button, .ctsoptions{line-height: 22px;color: white;width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #10131475;border: none;padding: 5% 0;display: inline-block;}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: -64px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-push-to-talk {min-width: 170px; width: 170px;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #53b6ef;cursor: pointer;}#videos-footer #music-radio{left: 0;border-radius: 12px;background: #101314;}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}#videos-footer{cursor:pointer;top:0;display:block;padding: 2px 0 0 11px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute}#videos-footer-broadcast{height:unset;border-radius:unset;z-index: 1;padding: unset!important;white-space: pre}span[title=\"Settings\"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0;left: 0;right: 0;top: 0}:host,#videolist{background:unset!important;}.video:after{content: unset;border:unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header>span{display:block;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}";
        RoomCSS = "tc-title{display:flex;}#room-content{padding-top:0!important;background:unset!important;}";
        TitleCSS = "#room-header-info > h1:after{content:unset;}@media screen and (max-width: 600px){#room-header-info{left:unset;right:unset;}}#room-header-info > span + span,#room-header-info > span{display:none;}#room-header-info > h1{width:unset;max-width:unset; position: relative;top: 8px;left: 60px;}#room-header-info{padding:unset;}#room-header-avatar{display:none}#room-header-gifts{display:none}#room-header-info-text{display:none}#room-header-info-details{display:none}#room-header-mobile-button{display:none}#room-header{width:100%;min-height:38px;max-height:38px;}";
        SideMenuCSS = "#sidemenu{left:0;z-index:3;}@media screen and (max-width: 1000px){#sidemenu{left:-270px;}}#sidemenu.full-screen{left:-270px;}#user-info{display:none;}#top-buttons-wrapper{display:none;}#sidemenu-content{scrollbar-width:none;padding-top:unset;}#sidemenu-wider:before{margin: -4px 0 0 -4px;border-width: 6px 6px 6px 0;border-color: transparent #ffffff;}#sidemenu-wider{-webkit-box-shadow: 0 0 6px #666;box-shadow: 0 0 6px #666;z-index: 2;display:block;background-color: #000000;}#sidemenu-content::-webkit-scrollbar{display: none;}#sidemenu.wider {left: -270px;}";
        NotificationCSS = "#youtube.video{min-height:unset;min-width:unset;}f@media screen and (max-width: 600px){#videos-header>span{line-height:50px;}}#videos-header > span {background-color: unset!important;}.PMTime{display:inline-block;padding:0 6px 0 0;margin:0 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{word-break: break-word;white-space: pre-line;word-wrap: break-word;user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;color: #FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0 0;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0 0 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
        UserListCSS = "#contextmenu {top:unset!important;bottom:0!important;right:0!important;left:0!important;}.list-item>span>span{padding: 0 8px;top:-2px}.list-item > span:hover > span{background-color:unset;box-shadow:unset;}#userlist{background: #00000075;}.js-user-list-item{background: linear-gradient(0deg,rgb(0, 0, 0) 2px,rgba(0, 0, 0, 0.25) 2px,rgba(0, 0, 0, 0.59) 32%);}.list-item>span>span[data-cam=\"1\"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator=\"1\"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:5px;}.list-item>span>img{top:6px;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{font-weight: 600;color:#FFFFFF;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}";
        ModeratorCSS = ".video{width:100%}.video > div > .overlay{background-color:unset;}.video:hover{max-width:unset;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#53b6ef;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{padding-left:unset;max-height:60px;background: #00000075;}#moderatorlist>#header{height: 60px;color: #FFFFFF;border-radius: unset;line-height: 22px;}#moderatorlist.show[data-videos-count=\"1\"], #moderatorlist.show[data-videos-count=\"2\"],#moderatorlist.show[data-videos-count=\"3\"],#moderatorlist.show[data-videos-count=\"4\"],#moderatorlist.show[data-videos-count=\"5\"],#moderatorlist.show[data-videos-count=\"6\"],#moderatorlist.show[data-videos-count=\"7\"],#moderatorlist.show[data-videos-count=\"8\"],#moderatorlist.show[data-videos-count=\"9\"],#moderatorlist.show[data-videos-count=\"10\"],#moderatorlist.show[data-videos-count=\"11\"],#moderatorlist.show[data-videos-count=\"12\"]{margin: 5px;max-height:100%}";
        ContextMenuCSS = ".context[data-mode=\"dark\"] > span:hover{background-color:#04caff;}.context.show{height:100%;}.context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background:#101314;position:unset;padding:0;height:0;transition:.25s;}";
    } else {
        //CTS Style
        FeaturedCSS = "#videos.column>.videos-items{background:#0000003b;height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{background:#0000003b;width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
        ChatListCSS = ".list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#53b6ef;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background:#53b6ef;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}";
        ChatboxCSS = "#chat-import-label{text-align: center;height: 20px;right: 70px;width:35px;cursor:pointer;}#safelist-import{opacity: 0;position: absolute;z-index: -1;}#safelist-import-label{text-align: center;height: 20px;cursor:pointer;}#chat-import{display: none;position: absolute;z-index: -1;}.stackmessage:hover > .ctstimehighlight{display:block;z-index:1;}.ctstimehighlight{font-weight: 600;font-size: 16px;color: #FFF;position: absolute;right: 3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;display:none;}.stackmessage{background: #00000085;border-radius: 6px;margin: 5px 0 0 -5px;padding: 5px;border:#7672729e 1px solid;}#chat-export{right:35px;width:35px;}#safelist-export{right:105px; width:35px;}#safelist-import-label{right:140px; width:35px;}#chat-download{right:0;width:35px;}#safelist-import-label:hover,#safelist-export:hover, #chat-import-label:hover, #chat-export:hover, #chat-download:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}.chat-button{outline:none;background: unset;border: unset;position: absolute;height: 22px;padding-top: 2px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;}#chatlog-button{display:none!important;}#chat-instant.show{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(25, 29, 32)100%)!important;}#chat-wider{display:none;}#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #10131494;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;overflow:hidden;}#user-menu {border-radius: 6px;background: #000000b8;position: absolute;display: none;bottom: 50px;right: 0;box-sizing: border-box;border-radius: 6px;color: #FFFFFF;line-height: 1;z-index: 1;max-width:300px;padding:12px;}#user-menu > span {border-radius:6px;background:#000000c9;display: inline-block;width: 100%;padding: 6px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background:unset;}.cts-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.ctstime{position:absolute;right:3px;top:3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#cts-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message>.systemuser{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgba(0, 0, 0, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift>a{background:black;}.gift{border-radius:12px;background: #0165d0;-webkit-box-shadow: inset 0 0 5em 5px #000;box-shadow: inset 0 0 5em 5px #000;}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{text-decoration:underline;}#chat{will-change: transform;min-height:unset;}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#cts-chat-content>.message{padding:6px 3px;background:#101314a8;position:relative;left:0;margin-bottom:3px;border-radius:6px}#cts-chat-content>.message.highlight,.message.common.highlight{background:#666666a1;-webkit-box-shadow:inset 0 0 20px #000000;box-shadow: inset 0 0 20px 0 #000000;}#cts-chat-content>.message.common{min-height: 50px;padding:3px 3px 9px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#cts-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);pointer-events:none;}#chat-instant>.avatar>div,#cts-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}.notifbtn:hover{background:linear-gradient(0deg,rgb(0, 135, 186)0%,rgba(0, 49, 64, 0.94)75%,rgba(0, 172, 255, 0.6)100%);}.notifbtn{cursor: pointer;border-radius: 0 0 12px 12px;outline: none;background:linear-gradient(0deg,rgba(0, 0, 0, 0)0%,rgba(37, 37, 37, 0.32)75%,rgba(255, 255, 255, 0.6)100%);border: none;color: white;width: 100%;}#notification-content.large{height:50%;}#notification-content{transition: .2s;will-change: transform;top:0;position:relative;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height: 15%;min-height:38px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#cts-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-instant::after{content:unset;}.on-white-scroll{scrollbar-width: none;overflow-wrap: break-word;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content>.message>.nickname{cursor: pointer;border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" + (CTS.FontSize - 4) + "px;font-family:sans-serif;font-weight:300;}#chat-wrapper{border:none;transition:none;bottom:0;right:0!important;max-height:calc(70% - 119px)!important;min-height:calc(70% - 119px)!important;position:fixed!important;min-width:400px;max-width:400px;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
        MainCSS = "#menu{display:none;}.container{display:none;}#mobile-app.show{display:none;}html{background:rgba(0,0,0,1);}#users-icon{display:none;}#menu-icon{display:none;}body{background:" + CTS.MainBackground + ";background-position: center!important;background-size:auto!important;overflow:hidden;}#content{width:calc(100% - 400px);padding:0!important;}#nav-static-wrapper, #nav-fixed-wrapper{display:none;}";
        VideoCSS = "#button-banlist{display:none;color: white;cursor: pointer;background: #101314;border: none;}#button-banlist:hover{background:#53b6ef;}.overlay{display:none;}#youtube.video > div > .overlay > .icon-visibility{display:none;}#youtube.video:hover > div > .overlay{opacity:1;}@media screen and (min-width: 700px){#seek-duration{display:block!important;}}#seek-duration{display:none;}#youtube.video > div{margin-bottom:unset;}#youtube.video > div > .overlay{top: calc(100% - 57px);opacity: 0;transition: opacity .5s ease-out;-moz-transition: opacity .5s ease-out;-webkit-transition: opacity .5s ease-out;-o-transition: opacity .5s ease-out;background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}@media screen and (max-width: 600px){#videos-footer-broadcast{height:unset;text-align:center;line-height:50px;}}.video>div{border-radius:10px;}@media screen and (max-width: 600px){#videos{top:38px;}}#videolist[data-mode=\"dark\"]{background-color:unset;}.js-video.broken{display:none;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-submenu{right:0;}#videos-footer-submenu{width: calc(100% - 14px);right:0;bottom:-2px;}.videos-header-volume {border-color:#202627;}.tcsettings:hover{background:#008cda;}.tcsettings{cursor: pointer;outline: none;background:#101314;border: none;color: white;}.music-radio-info>.description{cursor:default;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.music-radio-info>.volume{bottom: 0;position: absolute;background: #2a6a89;height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.music-radio-info{top: -50px;position: absolute;background: #071c19f0;height: 50px;width: 336px;line-height: 24px;}.ctsdrop{position:fixed;display:inline-block;top:3px;right:4px;z-index:5;min-width: 46px;}.ctsdrop-content{position:absolute;top:28px;right:0;background:#101314;width: 92px;padding:0;z-index:1;display:none;}.ctsdrop:hover .ctsdrop-content{display:block;}.ctsdrop-content button.hidden{display:none;}.ctsdrop-content button:hover, .ctsoptions:hover{background:#53b6ef}.ctsdrop-content button, .ctsoptions{line-height: 22px;color: white;width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #101314;border: none;padding: 5% 0;display: inline-block;}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer-broadcast-wrapper>.video{position: fixed;display: none;width: 5%;top: 0;left: 0}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:hover{background: #1f2223!important}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button{background: #2d373a}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: 21px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-push-to-talk {min-width: 170px; width: 170px;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #53b6ef;cursor: pointer;}#videos-footer #music-radio{left: 0;border-radius: 12px;background: #101314;}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}#videos-footer{cursor:pointer;top: calc(30% + 119px);display:block;padding: 2px 0 0 11px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute;}#videos-footer-broadcast{border-radius:unset;z-index: 1;padding: unset!important;white-space: pre}#videos-footer-broadcast-wrapper{z-index: 0;visibility: visible;height: 50px;min-height: 50px;width: 400px;padding: unset;right: 0;left: unset;position: fixed;top: calc(30% + 34px)}span[title=\"Settings\"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0;left: 0;right: 0;top: 0}:host,#videolist{background:unset!important;}.video:after{content: unset;border:unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header{z-index: 3;background:#101314;transition: none;left: unset;right: 0;width: 400px;top: calc(30%);position: fixed;max-height: 34px;min-height: 34px;}#videos-header>span{display:block;line-height: unset;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}";
        RoomCSS = "tc-title{display:flex!important;}#room{padding:0!important;}#room-content{padding-top:0!important;background:unset!important;}";
        TitleCSS = "#room-header-avatar{display:none}#room-header-gifts{display:none}#room-header-info-text{display:none}#room-header-info-details{display:none}#room-header-mobile-button{display:none}#room-header{border:unset;z-index:1;min-height:36px!important;max-height:36px!important;min-width:400px;max-width:400px;top:calc(30% + 84px);right:0;position:fixed;background: linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(9, 41, 57)100%);}#room-header-info>h1{height:100%;top: unset;left: unset;right: unset;text-transform:uppercase;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:600 20px sans-serif;color:#FFFFFF;}#room-header-info>h1:after{content:unset;}#room-header-info {padding: 7px 0 0 6px!important;box-sizing: border-box;width: 100%!important;top: 0!important;left: 0!important;right: 0!important;}#room-he#room-header-info>span{right: 8px;position: absolute;top:7px;margin-top:0!important;}";
        SideMenuCSS = "#playerYT{background: black;border-radius: 3px;}:host, #videolist{z-index:0;}.overlay .volume{background: #2a6a89;}.overlay .volume, .overlay .duration{height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.overlay .duration{background:#9a0000;}.overlay button:hover{background: #53b6ef;cursor: pointer;}.overlay button{outline: none;line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 28px;width: 34px;}#player{pointer-events:none; width:100%;}#close-users{display:none!important;}#user-info{display:none;}#top-buttons-wrapper{display:none;}@media screen and (max-width: 600px) {#sidemenu {top:unset;z-index:2;padding-bottom:0;margin-top:0;}}#sidemenu-wider{display:none;}#sidemenu-content::-webkit-scrollbar{width:0;background:transparent;}#sidemenu{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:300 20px sans-serif;left:unset!important;right:0!important;padding-bottom:0;height:30%!important;min-width:400px;max-width:400px;}#sidemenu-content{scrollbar-width:none;padding-top:unset;}";
        NotificationCSS = "#youtube.video{min-height:unset;min-width:unset;}#videos-header > span {background-color: unset!important;line-height: unset;}.PMTime{display:inline-block;padding:0 6px 0 0;margin:0 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{word-break: break-word;white-space: pre-line;word-wrap: break-word;user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;color: #FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0 0;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0 0 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
        UserListCSS = "#userlist{padding-bottom:40px;}.list-item>span>span[data-cam=\"1\"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator=\"1\"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:4px;}.list-item>span>img{top:6px;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}#contextmenu {top:unset!important;bottom:0!important;right:0!important;left:0!important;}";
        ModeratorCSS = ".video{width:350px}.video > div > .overlay{background-color:unset;}.video:hover{max-width:unset;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#53b6ef;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{margin: 5px;max-height:60px;}#moderatorlist>#header{height: 60px;color: #FFFFFF;border-radius: unset;line-height: 22px;}#moderatorlist.show[data-videos-count=\"1\"], #moderatorlist.show[data-videos-count=\"2\"],#moderatorlist.show[data-videos-count=\"3\"],#moderatorlist.show[data-videos-count=\"4\"],#moderatorlist.show[data-videos-count=\"5\"],#moderatorlist.show[data-videos-count=\"6\"],#moderatorlist.show[data-videos-count=\"7\"],#moderatorlist.show[data-videos-count=\"8\"],#moderatorlist.show[data-videos-count=\"9\"],#moderatorlist.show[data-videos-count=\"10\"],#moderatorlist.show[data-videos-count=\"11\"],#moderatorlist.show[data-videos-count=\"12\"]{max-height:326px;max-width:350px;}";
        ContextMenuCSS = ".context[data-mode=\"dark\"] > span:hover{background-color:#04caff;}.context.show{height:100%;}.context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background:#101314;position:unset;padding:0;height:0;transition:.25s;}";
    }
    //INITIATE
    CTSInit();

    function CTSInit() {
        //INITIATE CTS
        let err_out = 0;
        CTS.ScriptLoading = setInterval(function() {
            err_out++;
            if (document.querySelector("tinychat-webrtc-app")) {
                if (document.querySelector("tinychat-webrtc-app").shadowRoot) CTSRoomInject();
                debug("TINYCHAT::LOAD", "ROOM");
            } else if (document.querySelector("#welcome-wrapper")) {
                CTSHomeInject();
                debug("TinyChat::LOAD", "HOME");
            } else {
                err_out++;
            }
            if (err_out == 50) {
                clearInterval(CTS.ScriptLoading);
                clearInterval(CTS.FullLoad);
            }
        }, 200);
        //WEBSOCKET HOOK
        if (!document.URL.match(/^https:\/\/tinychat\.com\/(?:$|#)/i)) {
            new MutationObserver(function() {
                this.disconnect();
                CTSWebSocket();
            }).observe(document, {
                subtree: true,
                childList: true
            });
        }
        //FULLY LOADED -> RUNALL
        CTS.FullLoad = setInterval(function() {
            if (CTS.ScriptInit && CTS.SocketConnected) {
                clearInterval(CTS.FullLoad);
                if (CTS.Me.mod) {
                    if (CTS.Bot) CheckHost();

                    VideoListElement.querySelector("#button-banlist").setAttribute("style", "display: block;");
                }
                //PTT AUTO
                if (CTS.Room.PTT) {
                    VideoListElement.querySelector("#videos-footer-push-to-talk").addEventListener("mouseup", function(e) {
                        e = e || window.event;
                        if (e.which == 1) CTS.AutoMicrophone = false;
                        if (e.which == 1 && e.ctrlKey === true) CTS.AutoMicrophone = !CTS.AutoMicrophone;
                        if (e.which == 2) CTS.AutoMicrophone = !CTS.AutoMicrophone;
                    }, {
                        passive: true
                    });
                }
                //FAVORITE ROOM
                let favorited_rooms = "",
                    len = CTS.FavoritedRooms.length,
                    script = document.createElement("script"),
                    elem = document.getElementsByTagName("script")[0];
                script.text = 'function AddFavorite(obj, index) {\n var val = JSON.parse(localStorage.getItem("' + CTS.Project.Storage + 'FavoritedRooms"));\n val[index]=["' + CTS.Room.Name + '"];\n localStorage.setItem("' + CTS.Project.Storage + 'FavoritedRooms", JSON.stringify(val));\n obj.href ="https://tinychat.com/room/' + CTS.Room.Name + '";\n obj.innerText = "' + CTS.Room.Name + '";\n obj.onclick = null;\n return false;\n}';
                elem.parentNode.insertBefore(script, elem);
                for (let i = 0; i < len; i++) favorited_rooms += CTS.FavoritedRooms[i] !== null ? "<span>#" + (i + 1) + ' <a href="https://tinychat.com/room/' + CTS.FavoritedRooms[i] + '">' + CTS.FavoritedRooms[i] + "</a></span>" : "<span>#" + (i + 1) + ' <a href="#" onclick="return AddFavorite(this,' + i + ');">ADD ROOM</a></span>';
                ChatLogElement.querySelector("#input").insertAdjacentHTML("afterbegin", '<div id="header-user"><label id="label-user" for="input-user"><img class="switcher" src="' + (CTS.Me.avatar ? CTS.Me.avatar : "https://avatars.tinychat.com/standart/small/eyePink.png") + '"></label><input type="checkbox" id="input-user" hidden=""><div id="user-menu"><span id="nickname">FAVORITED ROOMS</span>' + favorited_rooms + '<span id="title">' + CTS.Me.username + '</span><span><a href="https://tinychat.com/settings/gifts"> My Gifts</a></span><span><a href="https://tinychat.com/settings/profile">Profile</a></span><span><a href="https://tinychat.com/room/' + CTS.Me.username + '">My Room</a></span><span><a href="https://tinychat.com/#">Directory</a></span></div></div>');
                //RECENT GIFTS
                let recent_gifts = "\n";
                for (let g = 0; g < CTS.Room.Recent_Gifts.length; g++) recent_gifts += "<img src=\"" + CTS.Room.Recent_Gifts[g] + "\" />";
                //ALERT
                Settings("<center><u>" + CTS.Room.Name.toUpperCase() + "</u>" + (CTS.Room.Avatar ? '\n<img src="' + CTS.Room.Avatar + '">' : "") + "\n" + CTS.Room.Bio + '\n<a href="' + CTS.Room.Website + '" target="_blank">' + CTS.Room.Website + "</a>" + ((recent_gifts != "") ? recent_gifts : "") + "</center>");
                CTS.ShowedSettings = true;
                AddUserNotification(2, CTS.Me.namecolor, CTS.Me.nick, CTS.Me.username, false);
                //FEATURE LAUNCH
                SoundMeter();
                Reminder();
                PerformanceModeInit(CTS.PerformanceMode);
            }
        }, 500);
    }

    function CTSHomeInject() {
        var HomeCSS = "@media screen and (max-width: 1000px){.nav-menu {background-color: #181e1f;}}.nav-sandwich-menu-button{background-color:unset;}#modalfree-wrapper{display: none;}.tile-header > img {transition:unset;}.tile-favroom-opt{cursor:pointer;position: absolute;right: 0;top: 0;padding: 1px;background:#10131494;}.tile-favroom-opt:hover{background:#ff00008c;}#content{padding-bottom:unset;}.tile-content{height:180px;}.cts-footer-contents .tile-info{height:20px}.cts-footer-contents .tile-header>img{cursor:pointer;height: 220px;}.tile-header>img{height: 230px;width: 100%;max-width: 100%;}.cts-footer:hover .cts-footer-contents .tile{font-size: 18px;font-weight: 800;width:20%;display:inline-block;}.cts-footer-contents .tile {background: #00a2ff;text-align: center;border:unset;height:unset;display:none;margin: unset;}.cts-footer {background:#10131494;width: 100%;position: fixed;bottom: 0;left: 0;}#catalog > div {display: inline-block;padding: 5px;box-sizing: border-box;}.tile[data-status=\"pro\"], .tile[data-status=\"extreme\"], .tile[data-status=\"gold\"] {margin-top: 12px;}.tile-header {border-radius: 12px 12px 0 0;}#promoted .tile-header > img{width:100%;}#navigation > label{border-radius:12px;}#welcome>div{padding-top:0}.tile-statistic{padding-top:0;padding-bottom:4px;background: #000000a6;}.tile-name{padding-top:unset;}#promote-button{border-radius: 12px 12px 0 0;}tile-name{padding-top:unset;}.tile-info{bottom:unset;top:0;height:28px;}.cts-footer > h2, #promoted-wrapper > h2, #trended-wrapper > h2, #header-for-all{text-align: center;font-size: 30px;font-weight: 800;}body{background:" + CTS.MainBackground + ";background-size:auto;background-attachment: fixed;}.tile-content-info-icon > img {display:none;}.tile-content-info{font-size: 14px;font-weight: 600;}#promoted .tile-content-info-text{word-break: break-word;max-height:95px;}.tile{border:2px solid #fff;margin-top: 13px;height:425px;}#loadmore-no-more {background:#101314;}.tile-content > img{display:none;}#welcome-wrapper{background: #10131494;border-bottom:unset;}#loadmore{background: #00a2ff;font-weight: 600;}#user-menu{background: #101314;}#nav-static-wrapper {-webkit-box-shadow: 0 0 20px 17px #80808088;box-shadow: 0 0 20px 17px #80808088;background:#101314;}#up-button:hover > #up-button-content {background: #10131459;}#nav-fixed{border-bottom:unset;}#nav-fixed-wrapper{-webkit-box-shadow: 0 0 20px 17px #80808088;box-shadow: 0 0 20px 17px #80808088;background: #101314;}#nav-static {border-bottom:unset;}#welcome{padding:12px 30px 24px;}.tile{border-radius: 12px;background: #101314b3;}div, span, a, h1, h2, h3, h4, h5, h6, p {text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color: #FFFFFF!important;}#promoted-wrapper > div, #trended-wrapper > div {background: #08080888;border-radius: 12px;}.tile-content-info-text {word-break: break-word;width:100%;}.tile-content-info.with-icon {display: contents;}#navigation > label:not([for=\"input-catalog-navigation\"]) {font-weight:600;background: #000000;}";
        //INSERT HTML/CSS
        document.body.querySelector("style").insertAdjacentHTML("beforeend", HomeCSS);
        document.body.insertAdjacentHTML("beforeend", '<div class="cts-footer"><h2>FAVORITED ROOMS</h2><div class="cts-footer-contents"></div></div>');
        //INSERT SCRIPT
        let script = document.createElement("script"),
            elem = document.getElementsByTagName("script")[0];
        script.text = 'function RemoveFavorite(obj, index) {\n	var val = JSON.parse(localStorage.getItem("' + CTS.Project.Storage + 'FavoritedRooms"));\n	val[index]=null;\n	localStorage.setItem("' + CTS.Project.Storage + 'FavoritedRooms", JSON.stringify(val));\n	return obj.parentNode.parentNode.remove();\n}';
        elem.parentNode.insertBefore(script, elem);
        let len = CTS.FavoritedRooms.length;
        for (let i = 0; i < len; i++) document.body.querySelector(".cts-footer-contents").insertAdjacentHTML("beforeend", CTS.FavoritedRooms[i] !== null ? '<div class="tile" data-room-name="' + CTS.FavoritedRooms[i] + '">Favorite #' + (i + 1) + ' <div class="tile-header"><img id="tile-header-image" src=\"https://upload.tinychat.com/pic/' + CTS.FavoritedRooms[i] + '\")' + '" onload="MasonryTails.Refresh();" onclick="locationTo(\'/room/' + CTS.FavoritedRooms[i] + '\');"><div class="tile-info"><div class="tile-favroom-opt" onclick="RemoveFavorite(this,' + i + ')">X</div><div class="tile-name">' + CTS.FavoritedRooms[i] + '</div><div class="tile-statistic"><svg width="18" height="14" viewBox="0 0 18 14" xmlns="https://www.w3.org/2000/svg"><path d="M9.333 5.667c0-.367-.3-.667-.666-.667h-8C.3 5 0 5.3 0 5.667v6.666C0 12.7.3 13 .667 13h8c.366 0 .666-.3.666-.667V10L12 12.667V5.333L9.333 8V5.667z" transform="translate(3 -3)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span><svg width="20" height="16" viewBox="0 0 20 16" xmlns="https://www.w3.org/2000/svg"><path d="M57 4c-3.182 0-5.9 2.073-7 5 1.1 2.927 3.818 5 7 5s5.9-2.073 7-5c-1.1-2.927-3.818-5-7-5zm0 8.495c1.93 0 3.495-1.565 3.495-3.495 0-1.93-1.565-3.495-3.495-3.495-1.93 0-3.495 1.565-3.495 3.495 0 1.93 1.565 3.495 3.495 3.495zm0-1.51c1.096 0 1.985-.89 1.985-1.985 0-1.096-.89-1.985-1.985-1.985-1.096 0-1.985.89-1.985 1.985 0 1.096.89 1.985 1.985 1.985z" transform="translate(-47 -2)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span></div></div></div></div>' : '<div class="tile">Favorite #' + (i + 1) + "</div>");
        //SCRIPT INIT -> PREPARE()
        clearInterval(CTS.ScriptLoading);
        CTS.ScriptInit = true;
        CTSHomePrepare();
    }

    function CTSHomePrepare() {
        //FUNCTION BYPASS
        window.ModalFreeTrialPro = function() {};
        //REMOVE
        Remove(document, "#footer");
        Remove(document, ".nav-logo");
    }

    function CTSRoomInject() {
        // PUBLIC / ADDON GRABBERS
        window.CTSRoomVolume = 1;
        window.CTSMuted = false;
        window.CTSImages = [
            `url("https://i.imgur.com/IgWNBoL.png") #000 repeat`, `url("https://i.imgur.com/RDRcl8T.jpg") #000 repeat`, `url("https://i.imgur.com/DizVNzk.png") #000 repeat`, `url("https://i.imgur.com/PoKPFWe.jpg") #000 repeat`, `url("https://i.imgur.com/AePOyjU.jpg") #000 repeat`, `url("https://i.imgur.com/ZxTjRqy.jpg") #000 repeat`, `url("https://i.imgur.com/720HXTu.png") #000 repeat`, `url("https://i.imgur.com/rGf1Nfu.jpg") #000 repeat`, `url("https://i.imgur.com/VEPdViA.jpg") #000 repeat`, `url("https://i.imgur.com/5aw7rPY.png") #000 repeat`, `url("https://i.imgur.com/7Be34y8.png") #000 repeat`, `url("https://i.imgur.com/9UppBPr.png") #000 repeat`, `url("https://i.imgur.com/Vakfsih.png") #000 repeat`, `url("https://i.imgur.com/5vqtmR3.png") #000 repeat`, `url("https://i.imgur.com/NtSpx46.png") #000 repeat`, `url("https://i.imgur.com/d6uNHYz.jpg") #000 repeat`, `url("https://i.imgur.com/mhUOVEn.png") #000 repeat`, `url("https://i.imgur.com/nxd9XHb.png") #000 repeat`, `url("https://i.imgur.com/Lsj5Dc2.png") #000 repeat`, `url("https://i.imgur.com/W5rNYJv.png") #000 repeat`, `url("https://i.imgur.com/JflfAyb.png") #000 repeat`, `url("https://i.imgur.com/0HgLp4V.png") #000 repeat`, `url("https://i.imgur.com/BA02dPh.jpg") #000 repeat`, `url("https://i.imgur.com/BMUb5Kk.jpg") #000 repeat`, `url("https://i.imgur.com/bB5UKsy.jpg") #000 repeat`, `url("https://i.imgur.com/WdxjkW5.jpg") #000 repeat`, `url("https://i.imgur.com/Vr6vAiC.png") #000 repeat`, `url("https://i.imgur.com/th1XnvH.jpg") #000 repeat`, `url("https://i.imgur.com/ZFoaSAg.png") #000 repeat`, `url("https://i.imgur.com/Srlxj1M.png") #000 repeat`, `url("https://i.imgur.com/cXM3CTE.jpg") #000 repeat`, `url("https://i.imgur.com/xqfuQRC.jpg") #000 repeat`, `url("https://i.imgur.com/iZCr5KO.jpg") #000 repeat`, `url("https://i.imgur.com/yllTVFK.jpg") #000 repeat`, `url("https://i.imgur.com/G0IbcpW.png") #000 repeat`, `url("https://i.imgur.com/uOcxq1Y.png") #000 repeat`, `url("https://i.imgur.com/gpcbmPD.png") #000 repeat`, `radial-gradient(#3B3B3B, #212121) #000`, `radial-gradient(#FFFFFF, #848484, #6A6A6A) #000`, `radial-gradient(#FFFFFF, #7C7106, #4C4504) #000`, `radial-gradient(#FFFFFF, #5d839c, #254c66) #000`, `radial-gradient(#FFFFFF, #F69C3C, #F4830B) #000`, `radial-gradient(#FFFFFF, #75BD81, #52AD62) #000`, `radial-gradient(#FFFFFF, #53C7DF, #28B9D7) #000`, `radial-gradient(#FFFFFF, #7918bc, #24152d) #000`, `radial-gradient(#631E50, #01084F) #000`, `radial-gradient(#FFFFFF, #fcd1d5, #f69dc6) #000`, `radial-gradient(#FFFFFF, #B87A88, #A6596B) #000`, `radial-gradient(#FFFFFF, #F039B1, #E305AD) #000`, `radial-gradient(#FFFFFF, #CC66CC, #BF40BF) #000`, `radial-gradient(#262b30, #373f45) #000`, `radial-gradient(white, purple) #000`, `radial-gradient(white, black) #000`, `url("https://i.imgur.com/jtIyAVQ.jpg") #000 no-repeat`, `url("https://i.imgur.com/fB2l0Lx.jpg") #000 no-repeat`, `url("https://i.imgur.com/ySCyC6G.png") #000 no-repeat`, `url("https://i.imgur.com/GPSzthB.jpg") #000 no-repeat`, `url("https://i.imgur.com/602sSAc.jpg") #000 no-repeat`, `url("https://i.imgur.com/StyX815.jpg") #000 no-repeat`, `url("https://i.imgur.com/3ZduTPY.jpg") #000 no-repeat`, `url("https://i.imgur.com/yEFrpaa.jpg") #000 no-repeat`, `url("https://i.imgur.com/JaaCSq9.jpg") #000 no-repeat`, `url("https://i.imgur.com/Y5xq9wH.jpg") #000 no-repeat`, `url("https://i.imgur.com/QlACC8r.jpg") #000 no-repeat`, `url("https://i.imgur.com/0hdI64c.jpg") #000 no-repeat`, `url("https://i.imgur.com/jhKOGQv.jpg") #000 no-repeat`, `url("https://i.imgur.com/nYObw8w.jpg") #000 no-repeat`, `url("https://i.imgur.com/nutPByI.jpg") #000 no-repeat`, `url("https://i.imgur.com/puNcReY.jpg") #000 no-repeat`, `url("https://i.imgur.com/jaGmjkB.jpg") #000 no-repeat`, `url("https://i.imgur.com/koUK7Qd.jpg") #000 no-repeat`, `url("https://i.imgur.com/6cxIdsK.jpg") #000 no-repeat`, `url("https://i.imgur.com/PU8gCqc.jpg") #000 no-repeat`, `url("https://i.imgur.com/2E93xGF.jpg") #000 no-repeat`, `url("https://i.imgur.com/N16lxQI.jpg") #000 no-repeat`, `url("https://i.imgur.com/W9IlVLT.jpg") #000 no-repeat`, `url("https://i.imgur.com/im9lPSr.jpg") #000 no-repeat`, `url("https://i.imgur.com/HoraMua.jpg") #000 no-repeat`, `url("https://i.imgur.com/uz4od4F.jpg") #000 no-repeat`, `url("https://i.imgur.com/eVP8oVz.jpg") #000 no-repeat`, `url("https://i.imgur.com/qSXsGt7.jpg") #000 no-repeat`, `url("https://i.imgur.com/smx3awB.jpg") #000 no-repeat`, `url("https://i.imgur.com/SImcSc2.png") #000 no-repeat`, `url("https://i.imgur.com/9uCdYyq.png") #000 no-repeat`, `url("https://i.imgur.com/ii00Lnl.jpg") #000 no-repeat`, `url("https://i.imgur.com/sRpDOp3.jpg") #000 no-repeat`
        ];
        window.CTSEightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As  I see it, yes.", "Most Likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
        window.CTSWelcomes = ["Hey ", "What's crackin ", "Hello ", "Good to see you ", "Howdy ", "Hey there ", "Yo ", "What's up ", "Greetings ", "What's hangin' "];
        //2nd group of Welcome messages. comment out the above array with // and uncomment the one below to switch.
        //window.CTSWelcomes = ["we are so glad you’re here! If you’re not, please pretend you are.", "please remove your shoes and don’t take anything personally", "to our happy place! We promise not to make you do the dishes.", "please excuse the mess, we live here.", "to our home. Where the wifi is weak but the connection is strong.", "We’re all crazy here. You’ll fit right in!", "to our perfectly imperfect chaos!", "we have a strict ‘no serious conversations’ policy."];
        window.CTSSound = {
            C: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            HIGHLIGHT: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            GREET: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            MENTION: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            MSG: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            GIFT: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            PVTMSG: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3")
        };
        window.CTSRadioStations = [
            ["HipHop & Rap", "https://streaming.radio.co/s0910e3712/listen"],
            ["UK Dance & Urban", "https://ice-sov.musicradio.com/CapitalXTRALondonMP3"],
            ["EDM", "https://listen.uturnradio.com/electro_house"],
            ["House Music", "https://streaming.radio.co/s323146ac6/listen"],
            ["HOT99.7", "https://ice5.securenetsystems.net/KHHK"],
            ["Reggae", "https://alphaboys-live.streamguys1.com/alphaboys.aac"],
            ["HotCountry97.3", "https://us9.maindigitalstream.com/ssl/KSHR"],
            ["Top 40", "https://vistaradio.streamb.live/SB00091"],
            ["DubStep", "https://subfm.radioca.st/Sub.FM"],
            ["Worship", "https://maestro.emfcdn.com/stream_for/k-love/iheart/aac"],
            ["Oldies Radio", "https://proxy.stream.statsradio.com/cjwv"],
            ["Rock On", "https://streaming.radiostreamlive.com/radiorockon_devices"],
            ["Reggaeton", "http://ice03.fluidstream.net/companyreggaetown.mp3"]
        ];
        window.CTSNameColor = ["#3f69c0", "#b63fc0", "#001f3f", "#1d3133", "#c86500", "#3e4f51", "#ef3038", "#616f71", "#869192", "#00a693", "#e63e62", "#adb4b5", "#d5d9d9", "#b87333"];
        window.CTSChatCSS = [
            [ //STYLE #0 ORIGINAL
                ["#chat-wrapper{background:linear-gradient(0deg,rgb(248,5,5)0%,rgb(81,22,22)calc(100% - 62px),rgba(204,0,0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(121, 3, 3)8px,rgb(176, 2, 2)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#c10101;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#c10101!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#6b0f0f!important;}#videos-footer-push-to-talk{background:#c10101}#videos-footer-push-to-talk:hover{background:#6b0f0f}#videos-footer-broadcast:hover{background:#6b0f0f}#videos-footer-broadcast{background:#c10101;}"],
                ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(15,5,5)8px,rgb(193,1,1)100%);}"]
            ],
            [ //STYLE #1 ORIGINAL
                ["#chat-wrapper{background:linear-gradient(0deg,rgb(65,144,219)0%,rgb(7,69,97)calc(100% - 62px),rgb(37,179,222)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(26, 59, 75)8px,rgb(59, 130, 170)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,14,15)8px,rgb(83,182,239)100%);}"]
            ],
            [ //STYLE #2 ORIGINAL
                ["#chat-wrapper{background:linear-gradient(0deg,rgb(0,158,5)0%,rgb(5,15,5)calc(100% - 62px),rgb(13,181,0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"],
                ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,15,5)8px,rgb(14,104,7)100%);}"]
            ],
            [ //STYLE #3 UPDATED SHERBERT
                ["#chat-wrapper{background:linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)!important;box-shadow:0 0 5px rgba(255,255,255,1)}#cts-chat-content>.message{background:#01084Fa8;color:#fff;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black}"],
                [".PMPopup .PMContent{background:#01084FDB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#FA8BFF}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #FA8BFF, #01084F)!important;border-left: 3px solid #01084F;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #01084F, #FA8BFF)!important}#videos-footer-push-to-talk{background:#FA8BFF}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #01084F, #FA8BFF)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #01084F, #FA8BFF)}#videos-footer-broadcast{background:#FA8BFF;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#FA8BFF!important;}"],
                ["#sidemenu{background:linear-gradient(0deg, rgba(250,139,255,0.95) 0%, rgba(43,210,255,0.75) 30%, rgba(250,139,255,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255,255,255,0.2)}"]
            ],
            [ //STYLE #4 UPDATED SAND/GREY
                ["#chat-wrapper{background:linear-gradient(45deg, #d7d2cc 0%, #304352 90%)!important;box-shadow:0 0 5px rgba(255,255,255,1)}#cts-chat-content>.message{background:#304352a8;color:#fff;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black}"],
                [".PMPopup .PMContent{background:#304352DB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#d7d2cc}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #d7d2cc, #304352)!important;border:1px solid #304352;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #304352, #d7d2cc)!important}#videos-footer-push-to-talk{background:#d7d2cc;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #304352, #d7d2cc)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #304352, #d7d2cc);}#videos-footer-broadcast{background:#d7d2cc;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#d7d6cc!important;}"],
                ["#sidemenu{background:linear-gradient(15deg, rgba(215,210,204,0.95) 0%, rgba(48,67,82,0.75) 40%, rgba(215,210,204,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255,255,255,0.2)}"]
            ],
            [ //STYLE #5 UPDATED TITANIUM
                ["#chat-wrapper{background:linear-gradient(45deg, #859398 0%, #283048 90%)!important;box-shadow:0 0 5px rgba(0,0,0,0.7)}#cts-chat-content>.message{background:#283048a8;color:#fff;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black}"],
                [".PMPopup .PMContent{background:#283048DB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#859398}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #859398, #283048)!important;border:1px solid #283048;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #283048, #859398)!important}#videos-footer-push-to-talk{background:#859398}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #283048, #859398)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #283048, #859398)}#videos-footer-broadcast{background:#859398}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#85a498!important;}"],
                ["#sidemenu{background:linear-gradient(0deg, rgba(133,147,152,0.95) 0%, rgba(40,48,72,0.75) 30%, rgba(133,147,152,0.95) 100%);box-shadow:4px 0 6px -4px rgba(0,0,0,0.7)}"]
            ],
            [ //STYLE #6 UPDATED RED/TAN
                ["#chat-wrapper{background:linear-gradient(45deg, #F4D58D 0%, #8D0801 90%)!important;box-shadow:0 0 10px rgba(0,0,0,0.5)}#cts-chat-content>.message{background:#8D0801a8;color:#fff;text-shadow:-1px 0 #8D0801,0 1px #8D0801,1px 0 #8D0801,0 -1px #8D0801}"],
                [".PMPopup .PMContent{background:#8D0801DB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#F4D58D}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #F4D58D, #8D0801)!important;border-left:2px solid #8D0801;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #8D0801, #F4D58D)!important}#videos-footer-push-to-talk{background:#F4D58D}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #8D0801, #F4D58D)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #8D0801, #F4D58D)}#videos-footer-broadcast{background:#F4D58D}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#f4dc8d!important;}"],
                ["#sidemenu{background:linear-gradient(0deg, rgba(141,8,1,0.95) 0%, rgba(244,213,141,0.75) 30%, rgba(141,8,1,0.95) 100%);box-shadow:4px 0 6px -4px rgba(0,0,0,0.5)}"]
            ],
            [ //STYLE #7 UPDATED PURPLE/GREEN
                ["#chat-wrapper{background:linear-gradient(0deg, #71B280 0%, #01084F calc(100% - 62px), #71B280 100%)!important;}#cts-chat-content>.message{background:#01084Fa8;}.message{color:#fff;text-shadow:-1px 0 #01084f, 0 1px #01084f, 1px 0 #01084f, 0 -1px #01084f;}"],
                [".PMPopup .PMContent{background:#01084FDB;}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper>.waiting{background:#71B280;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #71B280, #01084F)!important;border:1px solid #01084F;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #01084F, #71B280)!important;}#videos-footer-push-to-talk{background:#71B280;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #01084F, #71B280);}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #01084F, #71B280);}#videos-footer-broadcast{background:#71B280;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#71c380!important;}"],
                ["#sidemenu{background:linear-gradient(0deg, rgba(113,178,128,0.95) 0%, rgba(19,78,94,0.75) 30%, rgba(113,178,128,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [ //STYLE #8 UPDATED PINK/BLUE
                ["#chat-wrapper{background:linear-gradient(0deg, #FF7A7A 0%, #003366 calc(100% - 62px), #FF7A7A 100%)!important;}#cts-chat-content>.message{background:#003366a8;}.message{color:#fff;text-shadow:-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;}"],
                [".PMPopup .PMContent{background:#003366DB;}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #FFD700 8px, #FF8C00 100%);}#videos-footer-broadcast-wrapper>.waiting{background:#FF7A7A;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #FF7A7A, #003366)!important;border:1px solid #003366;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #003366, #FF7A7A)!important;}#videos-footer-push-to-talk{background:#FF7A7A;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #003366, #FF7A7A);}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #003366, #FF7A7A);}#videos-footer-broadcast{background:#FF7A7A;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#ff8b7a!important;}"],
                ["#sidemenu{background:linear-gradient(0deg, rgba(255,122,122,1) 0%, rgba(0,51,102,0.75) 30%, rgba(255,122,122,1) 100%);box-shadow:4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [ //STYLE #9 UPDATED OLIVE GREEN/PURPLE
                ["#chat-wrapper{background:linear-gradient(0deg, #6B8E23 0%, #800080 calc(100% - 62px), #6B8E23 100%)!important;}#cts-chat-content>.message{background:#800080a8;}.message{color:#fff;text-shadow:-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;}"],
                [".PMPopup .PMContent{background:#6B8E23DB;}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #FFD700 8px, #FF8C00 100%);}#videos-footer-broadcast-wrapper>.waiting{background:#6B8E23;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #6B8E23, #800080)!important;border:1px solid #800080;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #800080, #6B8E23)!important;}#videos-footer-push-to-talk{background:#6B8E23;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #800080, #6B8E23);}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #800080, #6B8E23);}#videos-footer-broadcast{background:#6B8E23;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#6b9d23!important;}"],
                ["#sidemenu{background:linear-gradient(15deg, rgb(107, 142, 35), rgba(128, 0, 128,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [ //STYLE #10 UPDATED ORANGE/BLUE
                ["#chat-wrapper {background: linear-gradient(0deg, #F4A261 0%, #2A9D8F calc(100% - 62px), #F4A261 100%) !important;}#cts-chat-content > .message {background: #2A9D8FCC;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #2A9D8FDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #F4A261;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #F4A261, #2A9D8F) !important;border: 1px solid #2A9D8F;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #2A9D8F, #F4A261) !important;}#videos-footer-push-to-talk {background: #F4A261;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #2A9D8F, #F4A261);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #2A9D8F, #F4A261);}#videos-footer-broadcast {background: #F4A261;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#F4B361!important;}"],
                ["#sidemenu {background: linear-gradient(15deg, rgba(42,157,143,1) 0%, rgba(244,162,97,0.75) 40%, rgba(42,157,143, 1) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #11 BLACK/GREY UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #3B3B3B 0%, #212121 calc(100% - 62px), #3B3B3B 100%) !important;}#cts-chat-content > .message {background: #212121a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #212121DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #3B3B3B;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #3B3B3B, #212121) !important;border: 1px solid #212121;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #212121, #3B3B3B) !important;}#videos-footer-push-to-talk {background: #3B3B3B;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #212121, #3B3B3B);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #212121, #3B3B3B);}#videos-footer-broadcast {background: #3B3B3B;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#3b3c3b!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(33, 33, 33, 1) 0%, rgb(59, 59, 59, 0.75) 30%, rgb(33, 33, 33, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #12 GREY UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #848484 0%, #6A6A6A calc(100% - 62px), #848484 100%) !important;}#cts-chat-content > .message {background: #6A6A6Aa8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #6A6A6ADB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #848484;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #848484, #6A6A6A) !important;border: 1px solid #6A6A6A;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #6A6A6A, #848484) !important;}#videos-footer-push-to-talk {background: #848484;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #6A6A6A, #848484);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #6A6A6A, #848484);}#videos-footer-broadcast {background: #848484;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#848984!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(106, 106, 106, 1 0%, rgba(132, 132, 132, 0.75) 30%, rgba(106, 106, 106, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #13 ARMY UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #7C7106 0%, #4C4504 calc(100% - 62px), #7C7106 100%) !important;}#cts-chat-content > .message {background: #4C4504a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #4C4504DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #7C7106;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #7C7106, #4C4504) !important;border: 1px solid #4C4504;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #4C4504, #7C7106) !important;}#videos-footer-push-to-talk {background: #7C7106;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #4C4504, #7C7106);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #4C4504, #7C7106);}#videos-footer-broadcast {background: #7C7106;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#7c8206!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(76, 69, 4, 1) 0%, rgba(124, 113, 6, 0.75) 30%, rgba(76, 69, 4, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #14 DEFAULT UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #5d839c 0%, #254c66 calc(100% - 62px), #5d839c 100%) !important;}#cts-chat-content > .message {background: #254c66a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #254c66DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #5d839c;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #5d839c, #254c66) !important;border: 1px solid #254c66;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #254c66, #5d839c) !important;}#videos-footer-push-to-talk {background: #5d839c;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #254c66, #5d839c);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #254c66, #5d839c);}#videos-footer-broadcast {background: #5d839c;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#5d949c!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(37, 76, 102, 1) 0%, rgba(93, 131, 156, 0.75) 30%, rgba(37, 76, 102, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #15 ORANGE UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #F69C3C 0%, #F4830B calc(100% - 62px), #F69C3C 100%) !important;}#cts-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #F4830BDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #F69C3C;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #F69C3C, #F4830B) !important;border: 1px solid #F4830B;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #F4830B, #F69C3C) !important;}#videos-footer-push-to-talk {background: #F69C3C;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #F4830B, #F69C3C);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #F4830B, #F69C3C);}#videos-footer-broadcast {background: #F69C3C;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#f6ad3c!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(244, 131, 11, 1) 0%, rgba(246, 156, 60, 0.75) 30%, rgba(244, 131, 11, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #16 GREEN UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #75BD81 0%, #52AD62 calc(100% - 62px), #75BD81 100%) !important;}#cts-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #52AD62DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #75BD81;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #75BD81, #52AD62) !important;border: 1px solid #52AD62;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #52AD62, #75BD81) !important;}#videos-footer-push-to-talk {background: #75BD81;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #52AD62, #75BD81);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #52AD62, #75BD81);}#videos-footer-broadcast {background: #75BD81;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#75ce81!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(82, 173, 98, 0.95) 0%, rgba(117, 189, 129, 0.75) 30%, rgba(82, 173, 98, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #17 SEAWATER UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #53C7DF 0%, #28B9D7 calc(100% - 62px), #53C7DF 100%) !important;}#cts-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #28B9D7DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #53C7DF;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #53C7DF, #28B9D7) !important;border: 1px solid #28B9D7;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #28B9D7, #53C7DF) !important;}#videos-footer-push-to-talk {background: #53C7DF;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #28B9D7, #53C7DF);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #28B9D7, #53C7DF);}#videos-footer-broadcast {background: #53C7DF;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#53d8df!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(40, 185, 215, 0.95) 0%, rgba(83, 199, 223, 0.75) 30%, rgba(40, 185, 215, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #18 PURPLE UPDATED
                ["#chat-wrapper{background: linear-gradient(0deg, #7918bc 0%, #24152d calc(100% - 62px), #7918bc 100%) !important;}#cts-chat-content > .message{background: #101314a8;}.message{color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent{background: #2d373aDB;}.PMPopup h2{background: linear-gradient(0deg, #000 0%, #531180 8px, #441769 100%);}#videos-footer-broadcast-wrapper > .waiting{background: #7918bc;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{background: #7918bc !important;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover{background: #460b6f !important;}#videos-footer-push-to-talk{background: #7918bc;}#videos-footer-push-to-talk:hover{background: #460b6f;}#videos-footer-broadcast:hover{background: #460b6f;}#videos-footer-broadcast{background: #7918bc;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(53, 22, 73, 0.95) 0%, rgba(121, 24, 188, 0.75) 30%, rgba(53, 22, 73, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #19 PURPLE/BLUE UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #631E50 0%, #01084F calc(100% - 62px), #631E50 100%) !important;}#cts-chat-content > .message {background: #01084Fa8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #01084FDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #631E50;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #631E50, #01084F) !important;border: 1px solid #01084F;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #01084F, #631E50) !important;}#videos-footer-push-to-talk {background: #631E50;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #01084F, #631E50);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #01084F, #631E50);}#videos-footer-broadcast {background: #631E50;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#632d50!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(1, 8, 79, 0.95) 0%, rgba(99, 30, 80, 0.75) 30%, rgba(1, 8, 79, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
            ],
            [ //STYLE #20 PINK #1 UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #fcd1d5 0%, #f69dc6 calc(100% - 62px), #fcd1d5 100%) !important;}#cts-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #f69dc6DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #fcd1d5;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #fcd1d5, #f69dc6) !important;border: 1px solid #f69dc6;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #f69dc6, #fcd1d5) !important;}#videos-footer-push-to-talk {background: #fcd1d5;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #f69dc6, #fcd1d5);}#videos-footer-broadcast:hover {background: linear-gr,adient(45deg, #f69dc6, #fcd1d5);}#videos-footer-broadcast {background: #fcd1d5;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#fce2d5!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(246, 157, 198, 0.95) 0%, rgba(252, 209, 213, 0.75) 30%, rgba(246, 157, 198, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [ //STYLE #21 PINK #2 UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #B87A88 0%, #A6596B calc(100% - 62px), #B87A88 100%) !important;}#cts-chat-content > .message {background: #A6596Ba8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #A6596BDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #B87A88;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #B87A88, #A6596B) !important;border: 1px solid #A6596B;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #A6596B, #B87A88) !important;}#videos-footer-push-to-talk {background: #B87A88;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #A6596B, #B87A88);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #A6596B, #B87A88);}#videos-footer-broadcast {background: #B87A88;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#b88b88!important;}"],
                ["#sidemenu {background: linear-gradient(0deg, rgba(166, 89, 107, 0.95) 0%, rgba(184, 122, 136, 0.85) 30%, rgba(166, 89, 107, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [ //STYLE #22 PINK #3 UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #F039B1 0%, #E305AD calc(100% - 62px), #F039B1 100%) !important;}#cts-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #E305ADDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #F039B1;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #F039B1, #E305AD) !important;border: 1px solid #E305AD;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #E305AD, #F039B1) !important;}#videos-footer-push-to-talk {background: #F039B1;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #E305AD, #F039B1);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #E305AD, #F039B1);}#videos-footer-broadcast {background: #F039B1;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#f04ab1!important;}"],
                ["#sidemenu {background: linear-gradient(5deg, rgba(240, 57, 177, 1) 0%, rgba(227, 5, 173, 0.85) 40%, rgba(240, 57, 177, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [ //STYLE #23 PINK #4 UPDATED
                ["#chat-wrapper {background: linear-gradient(0deg, #CC66CC 0%, #BF40BF calc(100% - 62px), #CC66CC 100%) !important;}#cts-chat-content > .message {background: #BF40BFa8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent {background: #BF40BFDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #CC66CC;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #CC66CC, #BF40BF) !important;border: 1px solid #BF40BF;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #BF40BF, #CC66CC) !important;}#videos-footer-push-to-talk {background: #CC66CC;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #BF40BF, #CC66CC);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #BF40BF, #CC66CC);}#videos-footer-broadcast {background: #CC66CC;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#cc77cc!important;}"],
                ["#sidemenu {background: linear-gradient(5deg, rgba(191, 64, 191, 1) 0%, rgba(204, 102, 204, 0.85) 30%, rgba(191, 64, 191, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
            ],
            [  //STYLE #24 UPDATED
                ["#cts-chat-content>.message{ background: #262b30; }#chat-wrapper{background: #373f45 !important;}#cts-chat-content>.message{background:#262b30a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                [".PMPopup .PMContent{background: #394551DB;}.PMPopup h2 {background: #373f45;}#videos-footer-broadcast-wrapper>.waiting{background: #6ca5d6;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background: #6ca5d6 !important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background: #507c9e !important;}#videos-footer-push-to-talk{background: #6ca5d6;}#videos-footer-push-to-talk:hover{background: #507c9e;}#videos-footer-broadcast:hover{background: #507c9e;}#videos-footer-broadcast{background: #6ca5d6;}"],
                ["#sidemenu{background: #373f45;}"]
          ]
          
        ];
        //INSERT SCRIPT
        let script = document.createElement("script"),
            elem = document.getElementsByTagName("script")[0];
        script.text = 'function UserProfileView(username) {if (username === "") {return;}var profilefetch = new XMLHttpRequest();profilefetch.onreadystatechange = function() {if (this.readyState == 4 && this.status == 200){window.ShowProfile(profilefetch.responseText);}};profilefetch.open("GET", "https://tinychat.com/api/v1.0/user/profile?username="+username, true);profilefetch.send();}window.StationSelected = 0,\n	window.StationPlay = false,\n	window.StationVol = 1;\nfunction VolStation(elem, vol){\n	window.StationElem = elem.parentElement.nextSibling;\n	var StationVolElem = elem.parentElement.querySelector(".music-radio-info>.volume");\nStationVol += vol;\n	if (StationVol < 0){\n		StationVol = 0;\n	} else if (StationVol > 1) {\n		StationVol = 1.0;\n	}\n	window.StationElem.volume = StationVol*window.CTSRoomVolume;\nStationVolElem.style.width=((StationVol * 100)+"%");}\nfunction PlayPauseStation(elem) {\n	var StationPlayPauseBtn = elem.parentElement.querySelector(".music-radio-playpause");\n window.StationElem=elem.parentElement.nextSibling;\nvar StationDescElem=elem.parentElement.querySelector(".music-radio-info>.description");\n	StationPlay=!StationPlay;\n	if (StationPlay) {\n		window.StationElem.volume = StationVol*window.CTSRoomVolume;\n		if(!window.CTSMuted) window.StationElem.play();\n StationPlayPauseBtn.innerText="❚❚";	StationDescElem.innerText = ("Playing: "+window.CTSRadioStations[StationSelected][0]+"\\nURL: "+window.CTSRadioStations[StationSelected][1]);\n} else {\n		window.StationElem.pause();\nStationPlayPauseBtn.innerText="▶";\n	StationDescElem.innerText = ("Paused: "+window.CTSRadioStations[StationSelected][0]+"\\nURL: "+window.CTSRadioStations[StationSelected][1]);}\n}\nfunction SeekStation(elem, direction) {\n	window.StationElem = elem.parentElement.nextSibling;\n	var StationDescElem = elem.parentElement.querySelector(".music-radio-info>.description");\nvar StationPlayPauseBtn = elem.parentElement.querySelector(".music-radio-playpause");\n	StationPlay = true;\n	StationSelected += direction;\n	\n	if (StationSelected > window.CTSRadioStations.length-1) {\n		StationSelected = 0;\n	} else if (StationSelected < 0){\n		StationSelected = window.CTSRadioStations.length-1;\n	}\n	window.StationElem.pause();\n	window.StationElem.setAttribute("src", window.CTSRadioStations[StationSelected][1]);\n	window.StationElem.load();\n	window.StationElem.volume = StationVol*window.CTSRoomVolume;\nStationPlayPauseBtn.innerText="❚❚";\n	if(!window.CTSMuted) window.StationElem.play();\nStationDescElem.innerText = ("Playing: "+window.CTSRadioStations[StationSelected][0]+"\\nURL: "+window.CTSRadioStations[StationSelected][1]);\n}';
        elem.parentNode.insertBefore(script, elem);
        //LOCALSETTINGS
        CTS.enablePMs = window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enablePMs;

        //ELEMENT DEFINE
        MainElement = document.querySelector("tinychat-webrtc-app").shadowRoot;
        ChatLogElement = MainElement.querySelector("tc-chatlog").shadowRoot;
        TextAreaElement = ChatLogElement.querySelector("#textarea");
        VideoListElement = MainElement.querySelector("tc-videolist").shadowRoot;
        MicrophoneElement = document.createEvent("MouseEvent");
        SideMenuElement = MainElement.querySelector("tc-sidemenu").shadowRoot;
        TitleElement = MainElement.querySelector("tc-title").shadowRoot;
        UserListElement = SideMenuElement.querySelector("tc-userlist").shadowRoot;
        ModerationListElement = SideMenuElement.querySelector("tc-video-moderation").shadowRoot;
        ChatListElement = SideMenuElement.querySelector("tc-chatlist").shadowRoot;
        UserContextElement = UserListElement.querySelector("tc-user-contextmenu").shadowRoot;
        let insert = TitleElement.querySelector('span[title="Settings"]');
        VideoListElement.querySelector("#videos-header").appendChild(insert);

        //INSERT HTML/CSS
        if (!CTS.Project.isTouchScreen) {
            insert = VideoListElement.querySelector("#videos-footer-broadcast-wrapper");
            VideoListElement.querySelector("#videolist").appendChild(insert);
            VideoListElement.querySelector("#videos-footer").insertAdjacentHTML("afterbegin", "Radio");
            VideoListElement.querySelector("#videos-footer").insertAdjacentHTML("beforeend", '<div id="music-radio"><div class="music-radio-info"><div class="description">Playing: None<br>URL: None</div><div class="volume"></div></div><button class="music-radio-seek" onclick="SeekStation(this,-1);">&#8592;</button><button class="music-radio-seek" onclick="SeekStation(this,1);">&#8594;</button><button class="music-radio-playpause" onclick="PlayPauseStation(this);">&#9654;</button><button class="music-radio-vol" onclick="VolStation(this,.05);">&#43;</button><button class="music-radio-vol" style="top:50%" onclick="VolStation(this,-.05);">&#45;</button></div><audio id="music-radio-audio" src="' + window.CTSRadioStations[0][1] + '"></audio>');
            TitleCSS += "span[title=\"Follow\"], span[title=\"Share room\"]{display:none!important;}";
        } else {
            VideoCSS = ".video>div{border-radius:10px;}#videos-footer-broadcast{border-radius:unset!important;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{border-radius:unset;}#videos-footer-push-to-talk{margin-left:0!important;border-radius:unset;}#videos-footer-youtube, #videos-footer-soundcloud{min-width:35px;border-radius:unset;margin-right: 0;}@media screen and (max-width: 600px){#videos{top:38px;}#videos-footer-broadcast, #videos-footer-broadcast-wrapper.hide-submenu > #videos-footer-broadcast {height:50px;line-height:50px;}#videos-footer{min-height: 50px;padding:0}}span[title=\"Settings\"]>svg{padding:7px 10px;height:24px;width:24px;}#videolist[data-mode=\"dark\"]{background-color:unset;}#videos-footer-broadcast-wrapper{display:contents;}.video:after{content: unset;border:unset;}#videos-header{padding:0;background:#181d1e;}.ctsdrop{position:fixed;display:inline-block;top:3px;left:4px;z-index:5;min-width: 46px;}.ctsdrop-content{top:28px;right:0;background:#181d1e;width: 92px;padding:0;z-index:1;display:none;}.ctsdrop:hover .ctsdrop-content{display:block;}.ctsdrop-content button:hover, .ctsoptions:hover{background:#53b6ef}.ctsdrop-content button.hidden{display:none;}.ctsdrop-content button., .ctsoptions{line-height: 22px;color: white;width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #181d1e75;border: none;padding: 5% 0;display: inline-block;}";
            MainCSS += "body{overflow:auto;}";
            UserListCSS += "#contextmenu{top:unset;bottom:0;left:0;}";
        }
        ChatLogElement.querySelector("style").insertAdjacentHTML("beforeend", ChatboxCSS);
        StyleSet();
        document.body.querySelector("style").insertAdjacentHTML("beforeend", MainCSS);
        MainElement.querySelector("style").insertAdjacentHTML("beforeend", RoomCSS);
        VideoListElement.querySelector("style").insertAdjacentHTML("beforeend", NotificationCSS);
        VideoListElement.querySelector("style").insertAdjacentHTML("beforeend", VideoCSS);
        SideMenuElement.querySelector("style").insertAdjacentHTML("beforeend", SideMenuCSS);
        UserListElement.querySelector("style").insertAdjacentHTML("beforeend", UserListCSS);
        ChatListElement.querySelector("style").insertAdjacentHTML("beforeend", ChatListCSS);
        ModerationListElement.querySelector("style").insertAdjacentHTML("beforeend", ModeratorCSS);
        UserContextElement.querySelector("style").insertAdjacentHTML("beforeend", ContextMenuCSS);
        TitleElement.querySelector("style").insertAdjacentHTML("beforeend", TitleCSS);
        UserListElement.querySelector("#button-banlist").insertAdjacentHTML("beforebegin", "<span>1</span>");
        VideoListElement.querySelector("#videos-header").insertAdjacentHTML("afterbegin", "<button style=\"display:" + ((CTS.Project.isTouchScreen) ? "none" : "block") + "\" class=\"tcsettings\">←</button><input id=\"cts-vol-control\" type=\"range\" min=\"10\" max=\"100\" value=\"100\" step=\"1\" oninput=\"window.AdjustRoomVolume(this.value)\" onchange=\"window.AdjustRoomVolume(this.value)\" style=\"min-width: 100px;\"><span id=\"videos-header-sound-cts\"><svg id=\"videos-header-sound-mute-cts\" style=\"padding: 5px 0;\" width=\"20\" height=\"26\" viewBox=\"0 0 20 26\" xmlns=\"http://www.w3.org/2000/svg\" class=\"\"><path d=\"M533.31 159.634c.933.582 1.69.166 1.69-.94v-19.388c0-1.1-.76-1.52-1.69-.94l-6.724 4.187c-.934.58-2.587 1.053-3.687 1.053h-1.904c-1.102 0-1.996.9-1.996 2.004v6.78c0 1.107.895 2.004 1.996 2.004h1.903c1.1 0 2.754.473 3.686 1.054l6.723 4.186z\" transform=\"translate(-517 -136)\" stroke=\"#41b7ef\" stroke-width=\"2\" fill=\"none\" fill-rule=\"evenodd\"></path></svg></span>");
        VideoListElement.querySelector("#videos-content").insertAdjacentHTML("beforeend", '<div id="popup" class="PMOverlay"></div>');
        VideoListElement.querySelector("#videolist").insertAdjacentHTML("afterbegin", '<div class="ctsdrop"><button class="ctsoptions" title="CTS Options">🔧</button><div class="ctsdrop-content"><div style="height:6px;background:#624482;"></div><button id="BackgroundUpdateRight" class="ctsoptions" title="Background">⬅️</button><button id="BackgroundUpdateLeft" class="ctsoptions" title="Background">➡️</button><div style="height:6px;background:#624482;"></div><button id="FontSizeUpdate" class="ctsoptions" title="Font Size">🔍</button><button id="ChatCompact" class="ctsoptions" title="Compact Chat">💬</button><div style="height:6px;background:#624482;"></div>' + ((!CTS.ThemeChange) ? '<button id="ChatWidthToggled" class="ctsoptions" title="Chat Resize">↔</button><button id="ChatHeightToggled" class="ctsoptions" title="Chat Resize">↕</button><div style="height:6px;background:#624482;"></div>' : '') + '<button id="ChatColor" class="ctsoptions" title="Chat Style">🎨</button><button id="CameraBorderToggled" class="ctsoptions" title="Camera Border">📷</button><button id="FeaturedToggled" class="ctsoptions" title="Featured Resize">📺</button><button id="PerformanceModeToggled" class="ctsoptions" title="Performance Mode">🎮</button><div style="height:6px;background:#624482;"></div><button id="SpamBan" class="ctsoptions" title="SpamBan Toggle">🪓</button><button id="Strict" class="ctsoptions" title="Strict Toggle">🧱</button>' + ((!CTS.Project.isTouchScreen) ? '<div style="height:6px;background:#624482;"></div><button id="ThemeChange" class="ctsoptions" title="Switch CTS Theme Mode">🔄</button><div style="height:6px;background:#624482;"></div></div></div>' : ''));
        insert = UserListElement.querySelector("#button-banlist");

        VideoListElement.querySelector("#videos-header").appendChild(insert);
        ChatLogElement.querySelector("#chat-position").insertAdjacentHTML("afterbegin", '<div id="notification-content"></div><button class="notifbtn">▼</button>');
        ChatLogElement.querySelector("#chat").insertAdjacentHTML("beforeend", '<div id="cts-chat-content"></div>');
        ChatLogElement.querySelector("#chat").insertAdjacentHTML("afterend", '<div class="cts-message-unread" style="display:none;">There are unread messages!</div>');
        //SCRIPT INIT -> PREPARE()
        clearInterval(CTS.ScriptLoading);
        CTS.ScriptInit = true;
        CTSRoomPrepare();
    }

    function CTSRoomPrepare() {
        //FUNCTION BYPASS
        window.AdjustRoomVolume = function(val) {
            // Room Volume Value Set
            window.CTSRoomVolume = val / 100;
            window.CTSMuted = (window.CTSRoomVolume == 0.1)?true:false;
            VideoListElement.querySelector("#videos-header-sound-cts path").setAttribute('style', ('stroke:'+((window.CTSMuted)?'#FF4136':'#41b7ef')));
            // Adjust Camera Volumes in accordance
            Cameras();
            // Adjust Radio Volume
            VideoListElement.querySelector("#music-radio-audio").volume = (window.CTSMuted)?0:(window.StationVol*(window.CTSRoomVolume));
            if (window.StationPlay) VideoListElement.querySelector("#music-radio-audio").play();
        };
        window.TinychatApp.BLL.Videolist.prototype.blurOtherVids = function() {};
        window.TinychatApp.BLL.SoundPlayer.playMessage = function() {};
        window.TinychatApp.BLL.SoundPlayer.playGift = function() {};
        window.TinychatApp.BLL.User.isSubscription = function() {
            return true;
        };
        window.TinychatApp.BLL.User.canUseFilters = function() {
            return true;
        };
        window.TinychatApp.BLL.MediaConnection.prototype.Close = function() {
            RTC(this);
        };
        window.TinychatApp.BLL.ChatRoom.prototype.sendPushForUnreadPrivateMessage = function() {};
        if (!CTS.Project.isTouchScreen) {
            window.TinychatApp.BLL.ChatRoom.prototype.BroadcastStart = function(a) {
                let b = this,
                    d = this.settings.getSettings();
                if (d.video === null) {
                    return void this.app.MediaSettings(() => {
                        this.BroadcastStart();
                    });
                }
                this.videolist.AddingVideoSelf(this.self_handle);
                let e = {};
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                    e.audio = true;
                    e.video = { width: { min: 320, max: 4096 }, height: { min: 240, max: 2160 }, frameRate: { min: 15, ideal: 30, max: 60 } };
                } else {
                    navigator.mediaDevices.enumerateDevices().then(g => {
                        let h = false;
                        let len = g.length;
                        for (let c = 0; c < len; c++) {
                            if (g[c].kind === "videoinput") {
                                if (e.video === void 0) e.video = {width: {min: 320,max: 4096},height: {min: 240,max: 2160},frameRate: {min: 15,ideal: 30,max: 60}};
                                if (h) {
                                    d.video = g[c];
                                    h = false;
                                    this.settings.saveSettings(d);
                                } else if (d.video === null) {
                                    d.video = g[c];
                                    this.settings.saveSettings(d);
                                } else if (d.video !== null && typeof d.video == "object" && d.video.deviceId == g[c].deviceId && d.video.deviceId !== a) {
                                    e.video.deviceId = {exact: d.video.deviceId};
                                } else if (d.video.deviceId === a) {
                                    h = true;
                                }
                            }
                            if (g[c].kind === "audioinput") {
                                if (e.audio === void 0) e.audio = {};
                                if (d.audio !== null && typeof d.audio == "object" && d.audio.deviceId == g[c].deviceId) e.audio = {deviceId: {exact: d.audio.deviceId}};
                            }
                        }
                        if (e.video !== null && d.video !== null && d.video.deviceId == b.id__miconly) delete e.video;
                        let i = navigator.mediaDevices.getSupportedConstraints();
                        for (let a in i) {
                            if (i.hasOwnProperty(a) && "echoCancellation" == a && e.audio) e.audio[a] = this.settings.isAcousticEchoCancelation();
                        }
                        if (!(e.audio || e.video)) {
                            b.onMediaFailedCallback(new Error("No media devices to start broadcast."));
                        } else if ("https:" === location.protocol || this.app.isDebug()) {
                            debug("BROADCAST", "Initiating Media...");
                            let m = new window.TinychatApp.BLL.BroadcastProgressEvent(window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START);
                            this.EventBus.broadcast(window.TinychatApp.BLL.BroadcastProgressEvent.ID, m);
                            b.mediaLastConstraints = e;
                            navigator.mediaDevices.getUserMedia(e).then(m => {
                                b.onMediaSuccessCallback(m);
                            });
                        }
                    }).catch(er => {
                        debug("CAMERA::ERROR", er);
                    });
                }
            };
        }
        window.TinychatApp.BLL.Userlist.prototype.ignore = function(a) {
            let b = ((a.isUsername) ? a.username : a.nickname);
            if (this.isIgnored(a) || this.ignored.push(b)) {
                let c = new window.TinychatApp.BLL.IgnorelistUpdateUserEvent(a);
                this.EventBus.broadcast(window.TinychatApp.BLL.IgnorelistUpdateUserEvent.ID, c);
                this.app.showToast(b + " ignored successfully till they leave or you refresh!");
                if (!a.isUsername) {
                    CTS.TempIgnoreNickList.push(b.toUpperCase());
                } else {
                    CTS.TempIgnoreUserList.push(b.toUpperCase());
                }
            }
        };
        window.TinychatApp.BLL.Userlist.prototype.unignore = function(a) {
            let b = ((a.isUsername) ? a.username : a.nickname),
                index = this.ignored.indexOf(b);
            if (index != -1) this.ignored.splice(index, 1);
            if (!a.isUsername) {
                index = CTS.TempIgnoreNickList.indexOf(b.toUpperCase());
                if (index != -1) CTS.TempIgnoreNickList.splice(index, 1);
            } else {
                index = CTS.TempIgnoreUserList.indexOf(b.toUpperCase());
                if (index != -1) CTS.TempIgnoreUserList.splice(index, 1);
            }
            let e = new window.TinychatApp.BLL.IgnorelistUpdateUserEvent(a);
            this.EventBus.broadcast(window.TinychatApp.BLL.IgnorelistUpdateUserEvent.ID, e);
            this.app.showToast(a.username + " unignored");
        };
        if (CTS.StorageSupport) {
            window.TinychatApp.BLL.SettingsFeature.prototype.getSettings = function() {
                let A = this._get("tinychat_settings");
                try {
                    A = Object.assign(new window.TinychatApp.DAL.SettingsEntity(), JSON.parse(A));
                } catch (E) {}
                if (A !== undefined) {
                    CTS.enableSound = A.enableSound;
                    if (CTS.enablePMs !== A.enablePMs) {
                        CTS.enablePMs = A.enablePMs;
                        PMShow();
                    }
                }
                return ((void 0 == A || "object" !== typeof A) && (A = new window.TinychatApp.DAL.SettingsEntity()) || A);
            };
        }
        if (!CTS.Project.isTouchScreen) {
            window.TinychatApp.BLL.ChatRoom.prototype.prepareStream = function(a) {
                function b() {
                    if (null == c.mediaStreamCanvas) {
                        if (CTS.AnimationFrameWorker != undefined) {
                            CTS.AnimationFrameWorker.terminate();
                            CTS.AnimationFrameWorker = undefined;
                        }
                        CTS.Me.broadcasting = false;
                        return;
                    }
                    d.clearRect(0, 0, c.mediaStreamCanvas.width, c.mediaStreamCanvas.height);
                    let a = c.mediaStreamVideo.videoHeight,
                        e = c.mediaStreamVideo.videoWidth;
                    c.mediaStreamCanvas.width = e;
                    c.mediaStreamCanvas.height = a;
                    window.TinychatApp.BLL.VideoFilters.getFilter(CTS.MediaStreamFilter).apply(d, e, a);
                    d.drawImage(c.mediaStreamVideo, 0, 0, e, a, 0, 0, c.mediaStreamCanvas.width, c.mediaStreamCanvas.height);
                }
                this.mediaStreamOrigin = a;
                this.mediaStreamVideo = document.createElement("video");
                this.mediaStreamVideo.srcObject = this.mediaStreamOrigin;
                this.mediaStreamVideo.pause();
                this.mediaStreamVideo.oncanplay = function() {
                    CTS.Me.broadcasting = true;
                    if (CTS.WorkersAllowed) {
                        if (CTS.AnimationFrameWorker == undefined) {
                            CTS.AnimationFrameWorker = new Worker(window.URL.createObjectURL(new Blob(["function Counter() {self.postMessage(\"0\");}setInterval(function(){Counter();}, 1e3/" + CTS.FPS + ");"])));
                            CTS.AnimationFrameWorker.onmessage = function() {
                                b();
                            };
                        }
                    } else {
                        requestAnimationFrame(b);
                    }
                };
                this.mediaStreamVideo.autoplay = !0;
                this.mediaStreamVideo.muted = !0;
                this.mediaStreamCanvas = document.createElement("canvas");
                let c = this,
                    d = this.mediaStreamCanvas.getContext("2d");
                this.mediaStreamVideo.play();
                let e = this.mediaStreamCanvas.captureStream(CTS.FPS);
                return (e.addTrack(this.mediaStreamOrigin.getAudioTracks()[0]) || e);
            };
        }
        window.TinychatApp.BLL.ChatRoom.prototype.applyFilter = function(a) {
            this.mediaStreamFilter = a;
            CTS.MediaStreamFilter = a;
            Save("MediaStreamFilter", CTS.MediaStreamFilter);
        };
        window.TinychatApp.BLL.Videolist.prototype.toggleHiddenVW = function(a) {
            let b = window.TinychatApp.getInstance().defaultChatroom._videolist.items.indexOf(a);
            if (b != -1) {
                let username = a.userentity.username.toUpperCase(),
                    index = CTS.HiddenCameraList.indexOf(username.toUpperCase());
                if (username === "GUEST") {
                    a.hidden = !a.hidden;
                } else {
                    if (a.hidden) {
                        a.hidden = false;
                        if (index !== -1) {
                            //REMOVE
                            if (arguments[1] === undefined) {
                                debug("HIDDENCAMERALIST::", "REMOVE USER " + username + " FROM HIDDENCAMERALIST");
                                Alert(GetActiveChat(), "✓ Removing " + username + " from hiddencameralist!");
                                CommandList.hiddencameraremove(index);
                            }
                        }
                    } else {
                        a.hidden = true;
                        if (index === -1) {
                            //ADD
                            if (arguments[1] === undefined) {
                                debug("HIDDENCAMERALIST::", "ADD USER " + username + " TO HIDDEN CAMERA LIST");
                                Alert(GetActiveChat(), "✓ Adding " + username + " to hidden camera list!");
                                CommandList.hiddencameraadd(username);
                            }
                        }
                    }
                }
                a.mute = ((CTS.Me.username === username) ? true : a.mute);
                window.TinychatApp.getInstance().defaultChatroom._videolist._pauseMediaStream(a.mediastream, a.hidden);
                if (!a.hidden) window.TinychatApp.getInstance().defaultChatroom._videolist._muteMediaStream(a.mediastream, a.mute);
                let d = new window.TinychatApp.BLL.VideolistEvent(window.TinychatApp.BLL.VideolistAction.Update, a, b);
                window.TinychatApp.getInstance().defaultChatroom._videolist.EventBus.broadcast(window.TinychatApp.BLL.VideolistEvent.ID, d);
            }
        };
        window.fullscreenManager.status = () => {
            if (CTS.isFullScreen !== (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen)) {
                CTS.isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                // Fix FullScreen
                MainElement.querySelector("#room").classList.toggle("full-screen");
            }
            return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        };
        //REMOVE
        Remove(ChatLogElement, 'span[id="input-unread"]');
        Remove(ChatLogElement, "#chat-content");
        Remove(VideoListElement, "#youtube");
        Remove(VideoListElement, "#videos-header-sound");
        //SETTINGS PREPARE
        if (CTS.enablePMs === false) PMShow();
        //LOAD
        CTSRoomLoad();
    }

    function CTSRoomLoad() {
        let element;
        //EVENT LISTENERS
        if (!CTS.ThemeChange) {
            // BOOT UP OG THEME
            let finishoff = false;
            while (CTS.OGStyle.SavedHeight !== CTS.OGStyle.HeightCounter || CTS.OGStyle.SavedWidth !== CTS.OGStyle.WidthCounter) {
                if (CTS.OGStyle.SavedHeight !== CTS.OGStyle.HeightCounter) {
                    ChatHeightToggled();
                } else {
                    finishoff = true;
                }
                if (CTS.OGStyle.SaveWidth !== CTS.OGStyle.WidthCounter && finishoff) ChatWidthToggled();
            }
            VideoListElement.querySelector("#ChatHeightToggled").addEventListener("click", function() {
                ChatHeightToggled();
                Save("OGStyleHeight", CTS.OGStyle.HeightCounter);
            }, {
                passive: true
            });
            VideoListElement.querySelector("#ChatWidthToggled").addEventListener("click", function() {
                ChatWidthToggled();
                Save("OGStyleWidth", JSON.stringify(CTS.OGStyle.WidthCounter));
            }, {
                passive: true
            });
        } else {
            if (!CTS.Project.isTouchScreen) {
                element = document.createElement("div");
                element.setAttribute("id", "chat-hide");
                ChatLogElement.querySelector("#chat-wider").parentNode.insertBefore(element, ChatLogElement.querySelector("#chat-wider"));
                ChatLogElement.querySelector("#chat-hide").addEventListener("click", function() {
                    ChatHide();
                }, {
                    passive: true
                });
            }
        }
        element = document.createElement("button");
        element.setAttribute("id", "chat-download");
        element.setAttribute("class", "chat-button");
        element.setAttribute("title", "Download copy of chat-log");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#chat-download").textContent = "📋";
        ChatLogElement.querySelector("#chat-download").addEventListener("click", function() {
            let len = CTS.UserList.length,
                t = "Users : " + len + "\n",
                c;
            for (c = 0; c < len; c++) {
                if (c) {
                    t += ", ";
                    if (c % 10 === 0) t += "\n";
                }
                t += CTS.UserList[c].username + " (" + CTS.UserList[c].nick + ")";
            }
            t += "\n\n";
            len = CTS.Message[GetActiveChat()].length;
            for (c = 0; c < len; c++) t += "[" + CTS.Message[GetActiveChat()][c].time + "][" + CTS.Message[GetActiveChat()][c].username + "(" + CTS.Message[GetActiveChat()][c].nick + ")]: " + (CTS.Message[GetActiveChat()][c].msg.replace(/(\r\n|\n|\r)/gm, "") + "\n");
            Export("TinyChat_" + CTS.Room.Name.toUpperCase() + " " + DateTime() + ".log", "Room : " + CTS.Room.Name + "\n" + t);
        }, {
            passive: true
        });
        element = document.createElement("button");
        element.setAttribute("id", "safelist-export");
        element.setAttribute("class", "chat-button");
        element.setAttribute("title", "Export your safelist");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#safelist-export").textContent = "📤";
        ChatLogElement.querySelector("#safelist-export").addEventListener("click", function() {
            if (localStorage.getItem("CTS_AKB") !== null) Export("CTS_Safelist_" + DateTime() + ".backup", JSON.stringify(CTS.SafeList));
        }, {
            passive: true
        });
        element = document.createElement("label");
        element.setAttribute("for", "safelist-import");
        element.setAttribute("class", "chat-button");
        element.setAttribute("title", "Import your safelist");
        element.setAttribute("id", "safelist-import-label");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#safelist-import-label").textContent = "📥";
        element = document.createElement("input");
        element.setAttribute("type", "file");
        element.setAttribute("id", "safelist-import");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#safelist-import").addEventListener('change', function(e) {
            let file = ChatLogElement.querySelector("#safelist-import").files[0],
                reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                try {
                    let resp = JSON.parse(reader.result);
                    if (resp !== null) {
                        let len2 = resp.length,
                            counter = 0;
                        for (let i = 0; i < len2; i++) {
                            if (CheckUserNameStrict(resp[i]) && !CTS.SafeList.includes(resp[i].toUpperCase())) {
                                CTS.SafeList.push(resp[i].toUpperCase());
                                counter++;
                            }
                        }
                        Save("AKB", JSON.stringify(CTS.SafeList));
                        Alert(GetActiveChat(), "✓ Backup looks good!\n" + counter + " users added to SafeList!");
                    }
                } catch (e) {
                    debug("BACKUP::ERROR", e);
                }
            };
            reader.onerror = function() {
                debug("BACKUP::ERROR", "Something went wrong...");
            };
        });
        element = document.createElement("button");
        element.setAttribute("id", "chat-export");
        element.setAttribute("class", "chat-button");
        element.setAttribute("title", "Export your saved CTS settings");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#chat-export").textContent = "📤";
        ChatLogElement.querySelector("#chat-export").addEventListener("click", function() {
            let tempobj = {};
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).substring(0, 4) == 'CTS_') tempobj[localStorage.key(i)] = localStorage[localStorage.key(i)];
            }
            Export("CTS_Settings_" + DateTime() + ".backup", JSON.stringify(tempobj));
        }, {
            passive: true
        });
        element = document.createElement("label");
        element.setAttribute("for", "chat-import");
        element.setAttribute("class", "chat-button");
        element.setAttribute("title", "Import your saved CTS settings");
        element.setAttribute("id", "chat-import-label");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#chat-import-label").textContent = "📥";
        element = document.createElement("input");
        element.setAttribute("type", "file");
        element.setAttribute("id", "chat-import");
        ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
        ChatLogElement.querySelector("#chat-import").addEventListener('change', function(e) {
            let file = ChatLogElement.querySelector("#chat-import").files[0],
                reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                try {
                    let resp = JSON.parse(reader.result);
                    if (resp !== null) {
                        let keys = Object.keys(resp),
                            ready = true;
                        Alert(GetActiveChat(), "- Scanning backup!");
                        for (let a = 0; a < keys.length; a++) {
                            if (keys[a].substring(0, 4) !== 'CTS_') ready = false;
                        }
                        if (ready) {
                            Alert(GetActiveChat(), "✓ Backup looks good!");
                            let localkeys = Object.keys(localStorage),
                                locallen = localkeys.length;
                            Alert(GetActiveChat(), "- Clearing Storage!");
                            for (let b = 0; b < locallen; b++) {
                                if (localkeys[b].substring(0, 4) === "CTS_") localStorage.removeItem(localkeys[b]);
                            }
                            Alert(GetActiveChat(), "✓ Storage cleared!\n- Applying CTS Backup!");
                            for (let c = 0; c < keys.length; c++) {
                                localStorage.setItem(keys[c], resp[keys[c]]);
                            }
                            Alert(GetActiveChat(), "✓ All done!\n\nYou'll auto-refresh shortly!");
                            setTimeout(function() {
                                location.reload();
                            }, 3000);
                        }
                    }
                } catch (e) {
                    debug("BACKUP::ERROR", e);
                }
            };
            reader.onerror = function() {
                debug("BACKUP::ERROR", "Something went wrong...");
            };
        });

        if (!CTS.Project.isTouchScreen) {
            VideoListElement.querySelector("#ThemeChange").addEventListener("click", function() {
                CTS.ThemeChange = !CTS.ThemeChange;
                Save("ThemeChange", JSON.stringify(CTS.ThemeChange));
                location.reload();
            }, {
                passive: true
            });
        }
        VideoListElement.querySelector("#videos-header-sound-mute-cts").addEventListener("click", function() {
            // Set Room Muted
            window.CTSMuted = !window.CTSMuted;
            VideoListElement.querySelector("#videos-header-sound-cts path").setAttribute('style', ('stroke:'+((window.CTSMuted)?'#FF4136':'#41b7ef')));
            VideoListElement.querySelector("#cts-vol-control").value = window.CTSMuted?0.1:(window.CTSRoomVolume*100);

            // un/Mute Radio
            let radioelem = VideoListElement.querySelector("#music-radio-audio");
            if (radioelem) radioelem[(window.CTSMuted)?"pause":(window.StationPlay)?"play":"pause"]();

            Cameras();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#PerformanceModeToggled").addEventListener("click", function() {
            if (CTS.ChatDisplay) {
                CTS.PerformanceMode = !CTS.PerformanceMode;
                Save("PerformanceMode", JSON.stringify(CTS.PerformanceMode));
                PerformanceModeInit(CTS.PerformanceMode);
            }
        }, {
            passive: true
        });
        VideoListElement.querySelector("#FeaturedToggled").addEventListener("click", function() {
            CTS.Featured = !CTS.Featured;
            Save("Featured", JSON.stringify(CTS.Featured));
            FeaturedCameras(CTS.Featured);
            Resize();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#CameraBorderToggled").addEventListener("click", function() {
            CTS.CameraBorderToggle = !CTS.CameraBorderToggle;
            Save("CameraBorderToggle", JSON.stringify(CTS.CameraBorderToggle));
            Cameras();
            Resize();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#SpamBan").addEventListener("click", function() {
            CommandList.spamban();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#Strict").addEventListener("click", function() {
            CommandList.strict();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#ChatColor").addEventListener("click", function() {
            CTS.ChatStyleCounter++;
            Remove(VideoListElement, "style[id=\"" + (CTS.ChatStyleCounter - 1) + "\"]");
            Remove(ChatLogElement, "style[id=\"" + (CTS.ChatStyleCounter - 1) + "\"]");
            Remove(SideMenuElement, "style[id=\"" + (CTS.ChatStyleCounter - 1) + "\"]");
            let len = window.CTSChatCSS.length - 1;
            if (CTS.ChatStyleCounter > len) CTS.ChatStyleCounter = 0;
            StyleSet();
            Save("ChatStyle", CTS.ChatStyleCounter);
        }, {
            passive: true
        });
        ChatLogElement.querySelector(".cts-message-unread").addEventListener("click", function() {
            UpdateScroll(1, true);
            CheckUnreadMessage();
        }, {
            passive: true
        });
        ChatLogElement.querySelector("#chat").addEventListener("scroll", function(event) {
            let element = event.target;

            if (Math.floor(element.scrollTop + 50) >= (element.scrollHeight - element.offsetHeight)) CheckUnreadMessage(true);
        }, {
            passive: true
        });
        ChatLogElement.querySelector("#notification-content").addEventListener("scroll", function(event) {
            let element = event.target;
            if (Math.floor(element.scrollTop + 50) >= (element.scrollHeight - element.offsetHeight)) CTS.NotficationScroll = true;
        }, {
            passive: true
        });
        if (CTS.NotificationToggle === 0) {
            ChatLogElement.querySelector(".notifbtn").addEventListener("click", NotificationResize, {
                passive: true
            });
        }
        VideoListElement.querySelector(".tcsettings").addEventListener("click", function(event) {
            let arg;
            if (this.innerText === "→") {
                this.innerText = "←";
                arg = "block";
            } else {
                this.innerText = "→";
                arg = "none";
            }
            if (CTS.Room.PTT === false) VideoListElement.querySelector("#videos-header-mic").style.display = arg;
            //VideoListElement.querySelector("#videos-header-snapshot").style.display = arg;
            VideoListElement.querySelector("#videos-header-fullscreen").style.display = arg;
            VideoListElement.querySelector("span[title=\"Settings\"]").style.display = arg;
            VideoListElement.querySelector("#videos-header-sound-cts").style.display = arg;
            VideoListElement.querySelector("#cts-vol-control").style.display = arg;
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"BackgroundUpdateLeft\"]").addEventListener("click", function() {
            if (!Addon.active("BGIMG")) {
                CTS.MainBackgroundCounter++;
                if (CTS.MainBackgroundCounter === window.CTSImages.length) CTS.MainBackgroundCounter = 0;
                let background = `${window.CTSImages[CTS.MainBackgroundCounter]}`;
                document.body.style.background = background;
                Save("MainBackground", background);
            }
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"BackgroundUpdateRight\"]").addEventListener("click", function() {
            if (!Addon.active("BGIMG")) {
                CTS.MainBackgroundCounter--;
                if (CTS.MainBackgroundCounter === -1) CTS.MainBackgroundCounter = window.CTSImages.length - 1;
                // var background = "url(\"" + window.CTSImages[CTS.MainBackgroundCounter] + "\") rgb(0, 0, 0) no-repeat";
                let background = `${window.CTSImages[CTS.MainBackgroundCounter]}`;
                document.body.style.background = background;
                Save("MainBackground", background);
            }
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"FontSizeUpdate\"]").addEventListener("click", function() {
            CTS.FontSize += 5;
            if (CTS.FontSize >= 40) CTS.FontSize = 15;
            Save("FontSize", CTS.FontSize);
            TextAreaElement.style.fontSize = (CTS.FontSize - 4) + "px";
            LoadMessage();
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"ChatCompact\"]").addEventListener("click", function() {
            CTS.ChatType = !CTS.ChatType;
            Save("ChatType", CTS.ChatType);
            LoadMessage();
        }, {
            passive: true
        });

        TextAreaElement.oninput = function() {
            CTS.Clipboard.Log = TextAreaElement.value;
        };
        TextAreaElement.onkeyup = function(e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                // SAVE CLIPBOARD
                CTS.Clipboard.Message.push(CTS.Clipboard.Log);
                if (CTS.Clipboard.Message.length > 3) CTS.Clipboard.Message.shift();
                CTS.Clipboard.MessageLen = CTS.Clipboard.Message.length - 1;
            } else if (e.keyCode == 40) {
                // NAVIGATE CLIPBOARD (IF TYPING IS FALSE)
                if (CTS.Clipboard.Message.includes(CTS.Clipboard.Log)) {
                    CTS.Clipboard.Counter = ((TextAreaElement.value == "") ? 0 : ((CTS.Clipboard.Counter >= CTS.Clipboard.MessageLen) ? 0 : (CTS.Clipboard.Counter + 1)));
                    TextAreaElement.value = CTS.Clipboard.Message[CTS.Clipboard.Counter];
                }
            } else if (e.keyCode == 38) {
                // NAVIGATE CLIPBOARD (IF TYPING IS FALSE)
                if (CTS.Clipboard.Message.includes(CTS.Clipboard.Log)) {
                    CTS.Clipboard.Counter = ((TextAreaElement.value == "") ? CTS.Clipboard.MessageLen : ((CTS.Clipboard.Counter <= 0) ? CTS.Clipboard.MessageLen : (CTS.Clipboard.Counter - 1)));
                    TextAreaElement.value = CTS.Clipboard.Message[CTS.Clipboard.Counter];
                }
            }
        };
        //MUTATION OBSERVERS
        new MutationObserver(function(elem) {
            MainElement.querySelector("#modal").shadowRoot.querySelector("#modal-window").classList.remove("modal-show");
            if (MainElement.querySelector("#fatal")) Remove(MainElement.querySelector("#fatal"));
            if(MainElement.querySelector("#modal").hasChildNodes()) MainElement.querySelector("#modal").shadowRoot.querySelector("#modal-window").classList.add("modal-show");
        }).observe(MainElement.querySelector("#modal"), {
            childList: true
        });

        new MutationObserver(function() {
            LoadMessage();
        }).observe(ChatLogElement.querySelector("#chat-instant"), {
            attributes: true,
            attributeFilter: ["class"],
            childList: false,
            characterData: false
        });
        new MutationObserver(function() {
            Cameras();
        }).observe(VideoListElement.querySelector(".videos-items:first-child"), {
            childList: true
        });
        new MutationObserver(function() {
            Cameras();
        }).observe(VideoListElement.querySelector(".videos-items:last-child"), {
            childList: true
        });
        new MutationObserver(function() {
            if (CTS.AutoMicrophone) {
                OpenMicrophone();
            }
        }).observe(VideoListElement.querySelector("#videos-footer-broadcast-wrapper"), {
            attributes: true,
            attributeFilter: ["class"]
        });
        //BOOT UP - FIRST START
        NotificationDisplay();
        FeaturedCameras(CTS.Featured);
        Cameras();
    }

    function CheckHost() {
        if (CTS.Host === 0) {
            Send("msg", "!whoisbot");
            CTS.HostAttempt = 0;
            CTS.HostWaiting = true;
        }
    }

    function SetBot() {
        if (arguments[0]) CTS.Game.NoReset = true;
        Send("msg", "!bot");
        CTS.HostWaiting = false;
    }

    const botCommandCheck = (...args) => {
        let [userId, command] = args;
        let user = CTS.UserList[userId];
        
        if (user && user.canGame) {
            if (isCommand(command)) {
                if ((/^!userkick |^!userban |^!userclose |^!nickkick |^!nickban |^!nickclose|^!safeadd |^!safe /i).test(command)) {
                    botCommandCheckJR(user, command);
                } else if ((/^!whoisbot$|^!botcheck$|^!8ball |^!vote |^!coin$|^!chuck$|^!urb |^!dad$|^!dark$|^!advice$/i).test(command)) {
                    botCommandCheckPUB(user, command);
                } else if ((/^!wordle$|^!wordlehelp$|^!wordlereset$|^!guess /i).test(command) && CTS.CanHostWordleGames && isSafeListed(user.username)) {
                    wordleCommandCheck(user, command);
                } else if (CTS.Game.Trivia.Started && CTS.CanHostTriviaGames) {
                    if (/^!raid /i.test(command)) {
                        handleRaid(user, command);
                    } else if (/^!spot$/i.test(command)) {
                        handleSpot(user, command);
                    } else if ((/^!iq$|^!triviahelp$|^!triviashop$/i).test(command)) {
                        handleSpecialCommands(user, command);
                    }
                } else if (CTS.CanHostFishGames) {
                    fishCommandCheck(user, command);
                } 
            } else if (CTS.Game.Trivia.Started && CTS.CanHostTriviaGames) {
                if (/^[a-d]$/i.test(command)) {
                    handleTriviaAttempt(user, command);                    
                } 
            }
        }
    }

    const wordleCommandCheck = (...args) => {
        let [user, command] = args;
        let newPlayer = CTS.Game.Wordle.ActivePlayer;
        let attemptsRemaining = 6 - CTS.Game.Wordle.AttemptList.length;
    
        let sendWordleMessage = (message) => Send("msg", `[WORDLE]\n${message}\nAttempts Remaining: ${attemptsRemaining}`);
    
        switch (true) {
            case /^!wordle$/i.test(command):
                if (newPlayer.length === 0) {
                    newPlayer.push(user.handle, user.username, user.nick);
                    if (CTS.Game.Wordle.wordList.length === 0) {
                        WordleGenerateList(WordleGetAnswer);
                    } else if (CTS.Game.Wordle.ActiveAnswer.length === 0) {
                        WordleGetAnswer();
                    }
                } else {
                    sendWordleMessage(`Please wait for ${newPlayer[2]} to finish their game.`);
                }
                break;
            case /^!wordlehelp$/i.test(command):
                if (user.handle === newPlayer[0]) {
                    Send("msg", `[WORDLE]\n**Objective:**\nGuess the secret word in 6 attempts! Each guess should be a 5-letter word.\n\n**Game Feedback:**\nThe color of the tiles will change to reflect how close your guess is to the actual word.\n\n🟩 *Green Tile:*Shows correct letter in the correct spot.\n🟨 *Yellow Tile:*Shows correct letter in the wrong spot.\n⬛ *Black Tile:*Denotes letter that is not in the word.`);
                }
                break;
            case /^!guess/i.test(command):
                if (user.handle === newPlayer[0] && attemptsRemaining > 0) {
                    let attempt = command.match(/^!guess ([a-z]{5})$/i);
                    if (attempt !== null) {
                        CTS.Game.Wordle.CurrentAttempt.push(attempt[1].toUpperCase());
                        WordleVerifyAttempt(attempt[1].toLowerCase());
                    } else {
                        sendWordleMessage("Try again, not a 5 letter word.");
                    }
                } else if (user.handle !== newPlayer[0] && newPlayer.length !== 0) {
                    sendWordleMessage(`Please wait for ${newPlayer[2]}, to finish their game`);
                }
                break;
            case /^!wordlereset$/i.test(command):
                if (CTS.Host === CTS.Me.handle || (CTS.BotModList.includes(user.username) && user.mod)) {
                    WordleReset();
                }
                break;
        }
    }

    const handleTriviaAttempt = (user, guess) => {    
        if (!user || !isSafeListed(user.username)) {
            return;
        }
    
        let guessed = CTS.Game.Trivia.AttemptList.includes(user.username);
    
        if (guess.length === 1 && CTS.Game.Trivia.ANum.includes(guess.toUpperCase()) && !guessed && !CTS.Game.Trivia.Waiting) {
            if (CTS.Game.Trivia.Correct === guess.toUpperCase()) {
                handleAnswer(user, true);
            } else {
                handleAnswer(user, false);
            }
        }
    };
    
    const handleAnswer = (user, isCorrect) => {
        if (isCorrect) {
            user.triviapoints += CTS.Game.Trivia.Worth;
            updateProgress(user);
            Send("msg", `[TRIVIA] correct! +${CTS.Game.Trivia.Worth} IQ.\n${user.nick.substr(0, 10)}, Total: ${user.triviapoints} IQ!`);
            if (user.triviapoints > CTS.Game.Trivia.HighScore[1]) {
                updateHighScore(user);
            }
            Trivia.Wait();
        } else {
            CTS.Game.Trivia.Attempts++;
            CTS.Game.Trivia.AttemptList.push(user.username);
    
            let wrongGuessValue = calculateWrongGuessValue();
            user.triviapoints -= wrongGuessValue;
            user.triviapoints = Math.max(0, user.triviapoints);
    
            updateProgressAndSend(user, wrongGuessValue);
    
            if (CTS.Game.Trivia.Attempts === 3) {
                Send("msg", `[TRIVIA] answer was: ${CTS.Game.Trivia.Correct}`);
                Trivia.Wait();
            }
        }
    };

    const calculateWrongGuessValue = () => {
        return CTS.Game.Trivia.Worth >= 70 ? Math.ceil(CTS.Game.Trivia.Worth / 4) : Math.ceil(CTS.Game.Trivia.Worth / 3);
    };    
    
    const updateProgressAndSend = (user, value) => {
        updateProgress(user);
        Send("msg", `[TRIVIA] wrong. -${value} IQ.\n${user.nick.substr(0, 10)}, Total: ${user.triviapoints} IQ!`);
    };
    
    const updateProgress = (user) => {
        CTS.Game.Trivia.PlayerList[user.username] = user.triviapoints;
        Save("TriviaPlayerList", JSON.stringify(CTS.Game.Trivia.PlayerList));
    };

    const updateHighScore = (user) => {
        CTS.Game.Trivia.HighScore[0] = user.username;
        CTS.Game.Trivia.HighScore[1] = user.triviapoints;
        Save("TriviaHighScore", JSON.stringify(CTS.Game.Trivia.HighScore));
    };
    
    const handleRaid = (user, command) => {
        if (/^!raid /i.test(command)) {
            if (userCanAfford(user, CTS.Game.Trivia.PriceList.raid)) {
                let raidMatch = command.match(/^(?:!raid )(?:<a href=")(?:https?:\/\/)?tinychat\.com(?!\/#)\/(?!gifts|settings|coins|subscription|promote)(?:room\/)?([a-z0-9]{3,16})/i);
    
                if (raidMatch !== null) {
                    user.triviapoints -= CTS.Game.Trivia.PriceList.raid;
                    updatePlayerListAndSend(user, `[TRIVIA]\n${user.username},\nyou've just purchased raid for ${CTS.Game.Trivia.PriceList.raid} IQ!\n\nCTS Users be prepared to teleport in several seconds!`, `[TRIVIA]\nREMEMBER HAVE FUN IF YOU DON'T WARP CLICK THE LINK SHORTLY!\n\nhttps://tinychat.com/room/${raidMatch[1]}`, 10000, `!raid https://tinychat.com/room/${raidMatch[1]}`);
                } else {
                    Send("msg", "[TRIVIA]\nThis is not a valid link/format for raid.\n\n(ex. !raid https://tinychat.com/stonercircle)\n\nThis is a costly operation, can't mess around if you want to be captain!");
                }
            } else {
                TriviaTooPoor(user.username);
            }
        }
    };
    
    const updatePlayerListAndSend = (user, ...messages) => {
        updatePlayerList(user);
        messages.forEach((msg) => Send("msg", msg));
    };
    
    const handleSpot = (user, command) => {
        if (/^!spot$/i.test(command)) {
            if (userCanAfford(user, CTS.Game.Trivia.PriceList.spot)) {
                let rand = Rand(0, CTS.Camera.List.length - 1);
                let target = HandleToUser(CTS.Camera.List[rand]);
    
                if (target !== -1) {
                    user.triviapoints -= CTS.Game.Trivia.PriceList.spot;
                    updatePlayerListAndSend(user, `[TRIVIA]\n${user.username},\nyou've just purchased ${CTS.UserList[target].username}'s spot for ${CTS.Game.Trivia.PriceList.spot} IQ!\n`);
    
                    if (CTS.UserList[target].handle !== CTS.Me.handle) {
                        Send("stream_moder_close", CTS.Camera.List[rand]);
                    } else {
                        CTS.SocketTarget.send(JSON.stringify({
                            "tc": "stream_close",
                            "handle": CTS.Me.handle
                        }));
                    }
                }
            } else {
                TriviaTooPoor(user.username);
            }
        }
    };
    
    const handleSpecialCommands = (user, command) => {
        if (/^!triviashop$/i.test(command)) {
            Send("msg", `[TRIVIA]\n\n${CTS.Me.owner ? `!raid\n[FOR ${CTS.Game.Trivia.PriceList.raid} IQ]\n\n!spot\n[FOR ${CTS.Game.Trivia.PriceList.spot} IQ]\n\n` : ""}`);
        } else if (/^!triviahelp$/i.test(command)) {
            Send("msg", "[TRIVIA]\n\n!iq\n\n!triviashop");
        } else if (/^!iq$/i.test(command)) {
            Send("msg", `[TRIVIA]\n${user.nick.substr(0,13)}, Total: ${user.triviapoints} IQ.`);
        }
    };
    
    const TriviaTooPoor = (username) => {
        Send("msg", `[TRIVIA]\n\n${username},\nyou cannot afford this right now!`);
    };
    
    const userCanAfford = (user, cost) => {
        return CTS.Game.Trivia.PlayerList[user.username] >= cost;
    };
    
    const updatePlayerList = (user) => {
        CTS.Game.Trivia.PlayerList[user.username] = user.triviapoints;
        Save("TriviaPlayerList", JSON.stringify(CTS.Game.Trivia.PlayerList));
    };

    function botCommandCheckJR(user, command) {
        let isBotMod = CTS.BotModList.includes(user.username);
    
        if (isBotMod) {
            if (command.match(/^!userkick /i)) {
                ModCommand("kick", command, true);
            } else if (command.match(/^!userban /i)) {
                ModCommand("ban", command, true);
            } else if (command.match(/^!userclose /i)) {
                ModCommand("stream_moder_close", command, true);
            } else if (command.match(/^!nickkick /i)) {
                ModCommand("kick", command, false);
            } else if (command.match(/^!nickban /i)) {
                ModCommand("ban", command, false);
            } else if (command.match(/^!nickclose /i)) {
                ModCommand("stream_moder_close", command, false);
            } else if (command.match(/^!safe /i) && user.handle !== CTS.Me.handle) {
                ModCommand("safe_add_mod", command, true);
            }
        }
    }

    function botCommandCheckPUB(user, command) {
        if ((/^!whoisbot$|^!botcheck/i).test(command) && user.mod) SetBot(true);
        if (/^!vote /i.test(command)) {
            Vote(user, command);
        }
        // PUBLIC COMMANDS
        if (CTS.PublicCommandToggle) {
            let userIsModOrSafeListed = user.mod || isSafeListed(user.username);
    
            if (/^!8ball [\w\s]*\??/i.test(command)) {
                if (userIsModOrSafeListed) {
                    Send("msg", "[8BALL]\n" + window.CTSEightBall[Rand(0, window.CTSEightBall.length - 1)]);
                }
            } else if (/^!coin$/i.test(command)) {
                if (userIsModOrSafeListed) {
                    let coinResult = Rand(0, 1) === 1 ? "HEADS" : "TAILS";
                    Send("msg", "[COIN FLIP]\nThe coin landed on " + coinResult + "!");
                }
            } else {
                if (/^!chuck$/i.test(command)) {
                    Chuck(user.username);
                } else if (/^!urb /i.test(command)) {
                    Urb(command, user.username);
                } else if (/^!dad$/i.test(command)) {
                    Dad(user.username);
                } else if (/^!dark$/i.test(command)) {
                    Dark(user.username);
                } else if (/^!advice$/i.test(command)) {
                    Advice(user.username);
                }
            }
        }
    }

    function BotCheck() {
        if (CTS.UserList[arguments[0]].mod) {
            //CHECK HOST
            if (/^!bot$/i.test(arguments[1])) {
                //SET HOST
                CTS.Host = arguments[2].handle;
                CTS.HostWaiting = false;
                //RESET GAMES
                if (CTS.Host != CTS.Me.handle && CTS.Game.NoReset) CTS.Game.NoReset = false;
                if (arguments[2].handle === CTS.Host && CTS.HostWaiting === false && !CTS.Game.NoReset) {
                    if (CTS.Me.handle !== arguments[2].handle) {
                        CTS.Game.NoReset = false;
                        Fish.Reset(true);
                        // Reset Trivia
                        Trivia.Reset();
                    }
                }
                //ELSE KEEP ON UNLESS HOSTWAITING (!WHOISBOT)
            } else if (CTS.HostWaiting === true) {
                CTS.HostAttempt++;
                //SET BOT IF NO RESPONSE IN 10 MESSAGES or 10 SECONDS
                if (CTS.HostAttempt == 1) {
                    setTimeout(function() {
                        //CHECK WAITING STATE OR IF HOST HAS CHANGED
                        if (CTS.HostWaiting === true && CTS.Host === 0) SetBot(false);
                    }, 10000); //default 10000
                }
                //SETS BOT FORCEFULLY ON 10 MESSAGES CANCELING TIMER EVENT WHEN IT QUEUES
                if (CTS.HostAttempt == 10) SetBot(false);
            }
        }
    }

    //AdviceSlip API (https://api.adviceslip.com/advice)
    async function Advice() {
        let randomNum = Math.floor(Math.random() * 224) + 1; // workaround to pull random advice index, API is repeating advice response
        // OPEN REQUEST
        if (isSafeListed(arguments[0])) {
            try {
                let response = await fetch(`https://api.adviceslip.com/advice/${randomNum}`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                let data = await response.json();
                let msg = "[ADVICE]\n" + data.slip.advice;
                if (data !== null) {
                    Send("msg", msg.substr(0, 499));
                }
            } catch (error) {
                console.error("Error fetching Advice API:", error);
            }
        }
    }

    //Chuck Norris Jokes API (https://api.chucknorris.io/) //good
    async function Chuck() {
        // OPEN REQUEST
        if (isSafeListed(arguments[0])) {
            try {
                let response = await fetch("https://api.chucknorris.io/jokes/random", {
                    method: "GET"
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                let data = await response.json();
                let msg = `[CHUCK NORRIS]\n${data.value}`;
                if (data !== null) {
                    Send("msg", msg.substr(0, 499));
                }
            } catch (error) {
                console.error("Error fetching Chuck Norris API:", error);
            }
        }
    }   

    // ICanHazDadJoke's API (https://icanhazdadjoke.com/) //good
    async function Dad() {
        // OPEN REQUEST
        if (isSafeListed(arguments[0])) {
            try {
                let response = await fetch("https://icanhazdadjoke.com/", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                let data = await response.json();
                let msg = `[DAD JOKE]\n${data.joke}`;
                Send("msg", msg.substr(0, 499));
            } catch (error) {
                console.error("Error fetching Dad Joke API:", error);
            }
        }
    }

    // Dark Joke API (https://v2.jokeapi.dev/joke/Dark) //good
    async function Dark() {
        // OPEN REQUEST
        if (isSafeListed(arguments[0])) {
            try {
                let response = await fetch("https://v2.jokeapi.dev/joke/Dark", {
                    method: "GET"
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                let data = await response.json();
                let msg = `[DARK JOKE]\n`;
                msg += (data.type === 'twopart') ? `${data.setup}\n\n\n${data.delivery}` : data.joke;
                Send("msg", msg.substr(0, 499));
            } catch (error) {
                console.error("Error fetching Dark Joke API:", error);
            }
        }
    }

    // Urban Dictionary API (https://api.Urb.com/) //testing
    async function Urb() {
        // CHECK TERM
        if (isSafeListed(arguments[1])) {
            let urban = arguments[0].match(/^!urb ([\w ]*)/i);

            if (urban !== null) {
                // OPEN REQUEST
                let url = `https://api.urbandictionary.com/v0/define?term=${urban[1]}`;
    
                try {
                    let response = await fetch(url);
                    if (response.ok) {
                        let data = await response.json();
                        let msg = `[URBAN DICTIONARY]\n${(data.list[0] !== undefined) ? ` ${data.list[0].word.toUpperCase()}\n${data.list[0].definition}` : "Nothing was found!"}`;
                        if (data !== null) Send("msg", msg.substr(0, 499));
                    } else {
                        console.error('Failed to fetch data from the Urban Dictionary API');
                    }
                } catch (error) {
                    console.error('Error while fetching data:', error);
                }
            }
        }
    }

    //WORDLE GENERATE WORDLIST FUNCTION
    async function WordleGenerateList(callback) {
        try {
            // Fetch the valid wordle word list. Used to verify guess is valid word.
            let response = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
            
            if (!response.ok) {
              throw new Error('Failed to fetch word list');
            }
            let wordsText = await response.text();
            let wordArray = wordsText.split('\n');
            let filteredWords = wordArray.filter(word => word.trim() !== '');
    
            CTS.Game.Wordle.wordList = filteredWords;
    
            if (typeof callback === 'function') {
                callback();
            }
        } catch (error) {
            console.error('Error fetching the word list:', error);
        }
    }


    //WORDLE GET ANSWER FUNCTION
    function WordleGetAnswer() { 
        //NYT wordle answer list.
        let answerList = [
            "geeky", "cough", "naive", "shoal", "stork", "bathe", "aunty", "check", "prime", "brass", "outer", "furry", "razor", "elect", "evict", "imply", "demur", "quota", "haven", "cavil", "swear", "crump", "dough", "gavel", "wagon", "salon", "nudge", "harem", "pitch", "sworn", "pupil", "excel", "stony", "cabin", "unzip", "queen", "trout", "polyp", "earth", "storm",
            "until", "taper", "enter", "child", "adopt", "minor", "fatty", "husky", "brave", "filet", "slime", "glint", "tread", "steal", "regal", "guest", "every", "murky", "share", "spore", "hoist", "buxom", "inner", "otter", "dimly", "level", "sumac", "donut", "stilt", "arena", "sheet", "scrub", "fancy", "slimy", "pearl", "silly", "porch", "dingo", "sepia", "amble",
            "shady", "bread", "friar", "reign", "dairy", "quill", "cross", "brood", "tuber", "shear", "posit", "blank", "villa", "shank", "piggy", "freak", "which", "among", "fecal", "shell", "would", "algae", "large", "rabbi", "agony", "amuse", "bushy", "copse", "swoon", "knife", "pouch", "ascot", "plane", "crown", "urban", "snide", "relay", "abide", "viola", "rajah",
            "straw", "dilly", "crash", "amass", "third", "trick", "tutor", "woody", "blurb", "grief", "disco", "where", "sassy", "beach", "sauna", "comic", "clued", "creep", "caste", "graze", "snuff", "frock", "gonad", "drunk", "prong", "lurid", "steel", "halve", "buyer", "vinyl", "utile", "smell", "adage", "worry", "tasty", "local", "trade", "finch", "ashen", "modal",
            "gaunt", "clove", "enact", "adorn", "roast", "speck", "sheik", "missy", "grunt", "snoop", "party", "touch", "mafia", "emcee", "array", "south", "vapid", "jelly", "skulk", "angst", "tubal", "lower", "crest", "sweat", "cyber", "adore", "tardy", "swami", "notch", "groom", "roach", "hitch", "young", "align", "ready", "frond", "strap", "puree", "realm", "venue",
            "swarm", "offer", "seven", "dryer", "diary", "dryly", "drank", "acrid", "heady", "theta", "junto", "pixie", "quoth", "bonus", "shalt", "penne", "amend", "datum", "build", "piano", "shelf", "lodge", "suing", "rearm", "coral", "ramen", "worth", "psalm", "infer", "overt", "mayor", "ovoid", "glide", "usage", "poise", "randy", "chuck", "prank", "fishy", "tooth",
            "ether", "drove", "idler", "swath", "stint", "while", "begat", "apply", "slang", "tarot", "radar", "credo", "aware", "canon", "shift", "timer", "bylaw", "serum", "dandy", "vigor", "oxide", "plant", "olive", "inert", "askew", "heist", "shown", "zesty", "hasty", "trash", "fella", "larva", "forgo", "story", "hairy", "train", "homer", "badge", "midst", "canny",
            "fetus", "butch", "farce", "slung", "tipsy", "metal", "yield", "delve", "being", "scour", "glass", "gamer", "scrap", "money", "hinge", "album", "vouch", "asset", "tiara", "crept", "bayou", "atoll", "manor", "creak", "showy", "phase", "froth", "depth", "gloom", "flood", "trait", "girth", "piety", "payer", "goose", "float", "donor", "atone", "primo", "apron",
            "blown", "cacao", "loser", "input", "gloat", "awful", "brink", "smite", "beady", "rusty", "retro", "droll", "gawky", "hutch", "pinto", "gaily", "egret", "lilac", "sever", "field", "fluff", "hydro", "flack", "agape", "voice", "stead", "stalk", "berth", "madam", "night", "bland", "liver", "wedge", "augur", "roomy", "wacky", "flock", "angry", "bobby", "trite",
            "aphid", "tryst", "midge", "power", "elope", "cinch", "motto", "stomp", "upset", "bluff", "cramp", "quart", "coyly", "youth", "rhyme", "buggy", "alien", "smear", "unfit", "patty", "cling", "glean", "label", "hunky", "khaki", "poker", "gruel", "twice", "twang", "shrug", "treat", "unlit", "waste", "merit", "woven", "octal", "needy", "clown", "widow", "irony",
            "ruder", "gauze", "chief", "onset", "prize", "fungi", "charm", "gully", "inter", "whoop", "taunt", "leery", "class", "theme", "lofty", "tibia", "booze", "alpha", "thyme", "eclat", "doubt", "parer", "chute", "stick", "trice", "alike", "sooth", "recap", "saint", "liege", "glory", "grate", "admit", "brisk", "soggy", "usurp", "scald", "scorn", "leave", "twine",
            "sting", "bough", "marsh", "sloth", "salsa", "thick", "warty", "manic", "saner", "blend", "clock", "tilde", "store", "prove", "bring", "solve", "cheat", "grime", "exult", "usher", "epoch", "triad", "break", "rhino", "viral", "conic", "masse", "sonic", "vital", "trace", "using", "peach", "champ", "baton", "brake", "pluck", "craze", "gripe", "weary", "picky",
            "acute", "ferry", "aside", "tapir", "troll", "unify", "rebus", "boost", "truss", "siege", "tiger", "banal", "slump", "crank", "gorge", "query", "drink", "favor", "abbey", "tangy", "panic", "solar", "shire", "proxy", "point", "robot", "prick", "wince", "crimp", "knoll", "sugar", "whack", "mount", "perky", "could", "wrung", "light", "those", "moist", "shard",
            "pleat", "aloft", "skill", "elder", "frame", "humor", "pause", "ulcer", "ultra", "robin", "cynic", "aroma", "caulk", "shake", "dodge", "swill", "tacit", "other", "thorn", "trove", "bloke", "vivid", "spill", "chant", "choke", "rupee", "nasty", "mourn", "ahead", "brine", "cloth", "hoard", "sweet", "month", "lapse", "watch", "today", "focus", "smelt", "tease",
            "cater", "movie", "saute", "allow", "renew", "their", "slosh", "purge", "chest", "depot", "epoxy", "nymph", "found", "shall", "harry", "stove", "lowly", "snout", "trope", "fewer", "shawl", "natal", "comma", "foray", "scare", "stair", "black", "squad", "royal", "chunk", "mince", "shame", "cheek", "ample", "flair", "foyer", "cargo", "skunk", "scalp", "bitty",           
            "cigar", "rebut", "sissy", "humph", "awake", "blush", "focal", "evade", "naval", "serve", "heath", "dwarf", "model", "karma", "stink", "grade", "quiet", "bench", "abate", "feign", "major", "death", "fresh", "crust", "stool", "colon", "abase", "marry", "react", "batty", "pride", "floss", "helix", "croak", "staff", "paper", "unfed", "whelp", "trawl", "outdo",
            "adobe", "crazy", "sower", "repay", "digit", "crate", "cluck", "spike", "mimic", "pound", "maxim", "linen", "unmet", "flesh", "booby", "forth", "first", "stand", "belly", "ivory", "seedy", "print", "yearn", "drain", "bribe", "stout", "panel", "crass", "flume", "offal", "agree", "error", "swirl", "argue", "bleed", "delta", "flick", "totem", "wooer", "front",
            "shrub", "parry", "biome", "lapel", "start", "greet", "goner", "golem", "lusty", "loopy", "round", "audit", "lying", "gamma", "labor", "islet", "civic", "forge", "corny", "moult", "basic", "salad", "agate", "spicy", "spray", "essay", "fjord", "spend", "kebab", "guild", "aback", "motor", "alone", "hatch", "hyper", "thumb", "dowry", "ought", "belch", "dutch",
            "pilot", "tweed", "comet", "jaunt", "enema", "steed", "abyss", "growl", "fling", "dozen", "boozy", "erode", "world", "gouge", "click", "briar", "great", "altar", "pulpy", "blurt", "coast", "duchy", "groin", "fixer", "group", "rogue", "badly", "smart", "pithy", "gaudy", "chill", "heron", "vodka", "finer", "surer", "radio", "rouge", "perch", "retch", "wrote",
            "three", "steak", "iliac", "shirk", "blunt", "puppy", "penal", "joist", "bunny", "shape", "beget", "wheel", "adept", "stunt", "stole", "topaz", "chore", "fluke", "afoot", "bloat", "bully", "dense", "caper", "sneer", "boxer", "jumbo", "lunge", "space", "avail", "short", "slurp", "loyal", "flirt", "pizza", "conch", "tempo", "droop", "plate", "bible", "plunk",
            "afoul", "savoy", "steep", "agile", "stake", "dwell", "knave", "beard", "arose", "motif", "smash", "broil", "glare", "shove", "baggy", "mammy", "swamp", "along", "rugby", "wager", "quack", "squat", "snaky", "debit", "mange", "skate", "ninth", "joust", "tramp", "spurn", "medal", "micro", "rebel", "flank", "learn", "nadir", "maple", "comfy", "remit", "gruff",
            "ester", "least", "mogul", "fetch", "cause", "oaken", "aglow", "meaty", "gaffe", "shyly", "racer", "prowl", "thief", "stern", "poesy", "rocky", "tweet", "waist", "spire", "grope", "havoc", "patsy", "truly", "forty", "deity", "uncle", "swish", "giver", "preen", "bevel", "lemur", "draft", "slope", "annoy", "lingo", "bleak", "ditty", "curly", "cedar", "dirge",
            "grown", "horde", "drool", "shuck", "crypt", "cumin", "stock", "gravy", "locus", "wider", "breed", "quite", "chafe", "cache", "blimp", "deign", "fiend", "logic", "cheap", "elide", "rigid", "false", "renal", "pence", "rowdy", "shoot", "blaze", "envoy", "posse", "brief", "never", "abort", "mouse", "mucky", "sulky", "fiery", "media", "trunk", "yeast", "clear",
            "reach", "nobly", "empty", "speed", "gipsy", "recur", "smock", "dread", "merge", "burst", "kappa", "amity", "shaky", "hover", "carol", "snort", "synod", "faint", "haunt", "flour", "chair", "detox", "shrew", "tense", "plied", "quark", "burly", "novel", "waxen", "stoic", "jerky", "blitz", "beefy", "lyric", "hussy", "towel", "quilt", "below", "bingo", "wispy",
            "brash", "scone", "toast", "easel", "saucy", "value", "spice", "honor", "route", "sharp", "bawdy", "radii", "skull", "phony", "issue", "lager", "swell", "urine", "gassy", "trial", "flora", "upper", "latch", "wight", "brick", "retry", "holly", "decal", "grass", "shack", "dogma", "mover", "defer", "sober", "optic", "crier", "vying", "nomad", "flute", "hippo",
            "shark", "drier", "obese", "bugle", "tawny", "chalk", "feast", "ruddy", "pedal", "scarf", "cruel", "bleat", "tidal", "slush", "semen", "windy", "dusty", "sally", "igloo", "nerdy", "jewel", "shone", "whale", "hymen", "abuse", "fugue", "elbow", "crumb", "pansy", "welsh", "syrup", "terse", "suave", "gamut", "swung", "drake", "freed", "afire", "shirt", "grout",
            "oddly", "tithe", "plaid", "dummy", "broom", "blind", "torch", "enemy", "again", "tying", "pesky", "alter", "gazer", "noble", "ethos", "bride", "extol", "decor", "hobby", "beast", "idiom", "utter", "these", "sixth", "alarm", "erase", "elegy", "spunk", "piper", "scaly", "scold", "hefty", "chick", "sooty", "canal", "whiny", "slash", "quake", "joint", "swept",
            "prude", "heavy", "wield", "femme", "lasso", "maize", "shale", "screw", "spree", "smoky", "whiff", "scent", "glade", "spent", "prism", "stoke", "riper", "orbit", "cocoa", "guilt", "humus", "shush", "table", "smirk", "wrong", "noisy", "alert", "shiny", "elate", "resin", "whole", "hunch", "pixel", "polar", "hotel", "sword", "cleat", "mango", "rumba", "puffy",
            "filly", "billy", "leash", "clout", "dance", "ovate", "facet", "chili", "paint", "liner", "curio", "salty", "audio", "snake", "fable", "cloak", "navel", "spurt", "pesto", "balmy", "flash", "unwed", "early", "churn", "weedy", "stump", "lease", "witty", "wimpy", "spoof", "cider", "koala", "duvet", "segue", "creme", "super", "grill", "after", "owner", "ember",
            "blare", "squib", "spoon", "probe", "crepe", "knack", "force", "debut", "order", "haste", "throw", "unity", "pivot", "slept", "troop", "spare", "sewer", "parse", "morph", "cacti", "teeth", "agent", "widen", "icily", "slice", "ingot", "clash", "juror", "blood", "abode", "tacky", "spool", "demon", "moody", "annex", "begin", "fuzzy", "patch", "water", "lumpy",
            "admin", "omega", "limit", "tabby", "macho", "aisle", "skiff", "basis", "plank", "verge", "botch", "crawl", "lousy", "slain", "cubic", "raise", "wrack", "guide", "foist", "cameo", "under", "actor", "revue", "fraud", "harpy", "scoop", "climb", "refer", "olden", "clerk", "debar", "tally", "ethic", "cairn", "tulle", "ghoul", "hilly", "crude", "apart", "scale",
            "older", "plain", "sperm", "briny", "abbot", "rerun", "quest", "crisp", "bound", "befit", "drawn", "suite", "itchy", "cheer", "bagel", "guess", "broad", "axiom", "chard", "caput", "leant", "harsh", "curse", "proud", "swing", "opine", "taste", "lupus", "gumbo", "miner", "green", "chasm", "lipid", "topic", "armor", "brush", "crane", "mural", "abled", "habit",
            "bossy", "maker", "dusky", "dizzy", "lithe", "brook", "jazzy", "fifty", "sense", "giant", "surly", "legal", "fatal", "flunk", "began", "prune", "small", "slant", "scoff", "torus", "ninny", "covey", "viper", "taken", "moral", "vogue", "owing", "token", "entry", "booth", "voter", "chide", "elfin", "ebony", "neigh", "minim", "melon", "kneed", "decoy", "voila",
            "ankle", "arrow", "mushy", "tribe", "cease", "eager", "birth", "graph", "odder", "terra", "weird", "tried", "clack", "color", "rough", "weigh", "uncut", "ladle", "strip", "craft", "minus", "dicey", "titan", "lucid", "vicar", "dress", "ditch", "gypsy", "pasta", "taffy", "flame", "swoop", "aloof", "sight", "broke", "teary", "chart", "sixty", "wordy", "sheer",
            "leper", "nosey", "bulge", "savor", "clamp", "funky", "foamy", "toxic", "brand", "plumb", "dingy", "butte", "drill", "tripe", "bicep", "tenor", "krill", "worse", "drama", "hyena", "think", "ratio", "cobra", "basil", "scrum", "bused", "phone", "court", "camel", "proof", "heard", "angel", "petal", "pouty", "throb", "maybe", "fetal", "sprig", "spine", "shout",
            "cadet", "macro", "dodgy", "satyr", "rarer", "binge", "trend", "nutty", "leapt", "amiss", "split", "myrrh", "width", "sonar", "tower", "baron", "fever", "waver", "spark", "belie", "sloop", "expel", "smote", "baler", "above", "north", "wafer", "scant", "frill", "awash", "snack", "scowl", "frail", "drift", "limbo", "fence", "motel", "ounce", "wreak", "revel",
            "talon", "prior", "knelt", "cello", "flake", "debug", "anode", "crime", "salve", "scout", "imbue", "pinky", "stave", "vague", "chock", "fight", "video", "stone", "teach", "cleft", "frost", "prawn", "booty", "twist", "apnea", "stiff", "plaza", "ledge", "tweak", "board", "grant", "medic", "bacon", "cable", "brawl", "slunk", "raspy", "forum", "drone", "women",
            "mucus", "boast", "toddy", "coven", "tumor", "truer", "wrath", "stall", "steam", "axial", "purer", "daily", "trail", "niche", "mealy", "juice", "nylon", "plump", "merry", "flail", "berry", "cower", "erect", "brute", "leggy", "snipe", "sinew", "skier", "penny", "jumpy", "rally", "umbra", "scary", "modem", "gross", "avian", "greed", "satin", "tonic", "parka",
            "sniff", "livid", "stark", "trump", "giddy", "reuse", "taboo", "avoid", "quote", "devil", "liken", "gloss", "gayer", "beret", "noise", "gland", "dealt", "sling", "rumor", "opera", "thigh", "tonga", "flare", "wound", "white", "bulky", "etude", "horse", "circa", "paddy", "inbox", "fizzy", "grain", "exert", "surge", "gleam", "belle", "salvo", "crush", "fruit",
            "sappy", "taker", "tract", "ovine", "spiky", "frank", "reedy", "filth", "spasm", "heave", "mambo", "right", "clank", "trust", "lumen", "borne", "spook", "sauce", "amber", "lathe", "carat", "corer", "dirty", "slyly", "affix", "alloy", "taint", "sheep", "kinky", "wooly", "mauve", "flung", "yacht", "fried", "quail", "brunt", "grimy", "curvy", "cagey", "rinse",
            "deuce", "state", "grasp", "milky", "bison", "graft", "sandy", "baste", "flask", "hedge", "girly", "swash", "boney", "coupe", "endow", "abhor", "welch", "blade", "tight", "geese", "miser", "mirth", "cloud", "cabal", "leech", "close", "tenth", "pecan", "droit", "grail", "clone", "guise", "ralph", "tango", "biddy", "smith", "mower", "payee", "serif", "drape",
            "fifth", "spank", "glaze", "allot", "truck", "kayak", "virus", "testy", "tepee", "fully", "zonal", "metro", "curry", "grand", "banjo", "axion", "bezel", "occur", "chain", "nasal", "gooey", "filer", "brace", "allay", "pubic", "raven", "plead", "gnash", "flaky", "munch", "dully", "eking", "thing", "slink", "hurry", "theft", "shorn", "pygmy", "ranch", "wring",
            "lemon", "shore", "mamma", "froze", "newer", "style", "moose", "antic", "drown", "vegan", "chess", "guppy", "union", "lever", "lorry", "image", "cabby", "druid", "exact", "truth", "dopey", "spear", "cried", "chime", "crony", "stunk", "timid", "batch", "gauge", "rotor", "crack", "curve", "latte", "witch", "bunch", "repel", "anvil", "soapy", "meter", "broth",
            "madly", "dried", "scene", "known", "magma", "roost", "woman", "thong", "punch", "papal", "pasty", "downy", "knead", "whirl", "rapid", "clang", "anger", "drive", "goofy", "email", "music", "stuff", "bleep", "rider", "mecca", "folio", "setup", "verso", "quash", "fauna", "gummy", "happy", "newly", "fussy", "relic", "guava", "ratty", "fudge", "femur", "chirp",
            "forte", "alibi", "whine", "petty", "golly", "plait", "fleck", "felon", "gourd", "brown", "thrum", "ficus", "stash", "decry", "wiser", "junta", "visor", "daunt", "scree", "impel", "await", "press", "whose", "turbo", "stoop", "speak", "mangy", "eying", "inlet", "crone", "pulse", "mossy", "staid", "hence", "pinch", "teddy", "sully", "snore", "ripen", "snowy",
            "attic", "going", "leach", "mouth", "hound", "clump", "tonal", "bigot", "peril", "piece", "blame", "haute", "spied", "undid", "intro", "basal", "shine", "gecko", "rodeo", "guard", "steer", "loamy", "scamp", "scram", "manly", "hello", "vaunt", "organ", "feral", "knock", "extra", "condo", "adapt", "willy", "polka", "rayon", "skirt", "faith", "torso", "match",
            "mercy", "tepid", "sleek", "riser", "twixt", "peace", "flush", "catty", "login", "eject", "roger", "rival", "untie", "refit", "aorta", "adult", "judge", "rower", "artsy", "rural", "shave", "wheat",
            ];
        let randomIndex = Math.floor(Math.random() * answerList.length);
        let randomWord = answerList[randomIndex];
        let resp = randomWord;
        let msg = `[WORDLE]\n\n${CTS.Game.Wordle.ActivePlayer[2].substr(0, 12)}, started a wordle game.\n\ntype !𝗴𝘂𝗲𝘀𝘀 [𝗔-𝗭]*𝟱\n\nto guess the answer.\n\n!𝘄𝗼𝗿𝗱𝗹𝗲𝗵𝗲𝗹𝗽 for game rules.`;
        CTS.Game.Wordle.ActiveAnswer.push(randomWord.toUpperCase());
        if (resp !== null) Send("msg", msg);
    }
    
    function WordleVerifyAttempt(guess) {
        if (CTS.Game.Wordle.wordList.includes(guess.toLowerCase())) {
            CTS.Game.Wordle.AttemptList.push(guess);
            attemptResults();
        } else {
            let errorMessage = `[WORDLE]\n\n${guess.toUpperCase()} is not a valid word.`;
            CTS.Game.Wordle.CurrentAttempt = [];
            Send("msg", errorMessage);
        }    
    }
    
    function attemptResults() {
        let msg = "[WORDLE]\n\n";
        let wordleAnswer = CTS.Game.Wordle.ActiveAnswer[0];
        let wordleAttempt = CTS.Game.Wordle.CurrentAttempt[0];
        // compares characters in guess/answer.
        for (let i = 0; i < 5; i++) {
            checkAttempt(wordleAnswer.charAt(i), wordleAttempt.charAt(i));
        }
        // handles multiple occurances of a character in guess/answer.
        for (let i = 0; i < 5; i++) {
            let aLetter = wordleAnswer.charAt(i);
            let gLetter = wordleAttempt.charAt(i);
    
            if (aLetter !== gLetter) {
                let gLetterCountInAnswer = wordleAnswer.split(gLetter).length - 1;
                let gLetterCountInTempMsg = (CTS.Game.Wordle.tempMsg.match(new RegExp(`\\[${gLetter}\\]🟩`, 'g')) || []).length;

                if (gLetterCountInAnswer === gLetterCountInTempMsg) {
                    CTS.Game.Wordle.tempMsg = CTS.Game.Wordle.tempMsg.replace(`[${gLetter}]🟨`, `[${gLetter}]⬛`);
                }
            }
        }
        // adds spaces for character "I" in message to better align blocks
        CTS.Game.Wordle.tempMsg = CTS.Game.Wordle.tempMsg.replace("I", " I ");
        CTS.Game.Wordle.ProgressMsg += (CTS.Game.Wordle.tempMsg + "\n\n");
        CTS.Game.Wordle.tempMsg = "";
        
        if (wordleAttempt === wordleAnswer) {
            let winnerMessage = `${CTS.Game.Wordle.ProgressMsg}${CTS.Game.Wordle.ActivePlayer[2].substr(0, 16)}, WINNER!\n`;
            Send("msg", msg + winnerMessage);
            WordleReset(); 
        } else {
            let remainingAttempts = 6 - CTS.Game.Wordle.AttemptList.length;
            
            if (remainingAttempts < 1) {
                let loseMessage = `${CTS.Game.Wordle.ProgressMsg}LOST! Answer: ${wordleAnswer}`;
                Send("msg", msg + loseMessage);
                WordleReset();
            } else {
                let attemptMessage = `${CTS.Game.Wordle.Keyboard}\n\nAttempts Remaining: ${remainingAttempts}`;
                Send("msg", msg + CTS.Game.Wordle.ProgressMsg + attemptMessage);
                CTS.Game.Wordle.CurrentAttempt = [];
            }
        }
    }
    
    function checkAttempt(aLetter, gLetter) {
        let msg = "";
        let wordleAnswer = CTS.Game.Wordle.ActiveAnswer[0];
        
        if (aLetter === gLetter) {
            msg += `[${gLetter}]🟩`;
        } else if (wordleAnswer.includes(gLetter)) {
            msg += `[${gLetter}]🟨`;
        } else {
            msg += `[${gLetter}]⬛`;
        }
        CTS.Game.Wordle.Keyboard = CTS.Game.Wordle.Keyboard.replace(gLetter, "");
        CTS.Game.Wordle.tempMsg += msg;
    }

    function WordleReset() {
        CTS.Game.Wordle.ActiveAnswer = [];
        CTS.Game.Wordle.ActivePlayer = [];
        CTS.Game.Wordle.AttemptList = [];
        CTS.Game.Wordle.CurrentAttempt = [];
        CTS.Game.Wordle.Keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        CTS.Game.Wordle.ProgressMsg = "";
        if (CTS.Host === CTS.Me.handle && CTS.CanHostWordleGames) {
        setTimeout(() => {
            Send("msg", "[WORDLE]\n\ntype !wordle to start new game.");
          }, "2000");
        }
          
    }

    //MESSAGE FUNCTION
    function CreateMessage() {
        //SCROLLED UP? MISSED A MESSAGE?
        CheckUnreadMessage();
        // POST NEW CHAT ITEM IF ACTIVECHAT IS OUR CURRENT CHAT
        if (arguments[7] == GetActiveChat()) {
            let stack = ChatLogElement.querySelector("#cts-chat-content>.message:last-child cts-message-html:last-child");
            if (arguments[4] == CTS.CreateMessageLast && stack !== null && CTS.ChatType) {
                // Stack
                stack.insertAdjacentHTML("afterend", "<cts-message-html><div class=\"stackmessage\">" + (CTS.TimeStampToggle ? "<div class=\"ctstimehighlight\"> " + arguments[0] + " </div>" : "") + "<span id=\"html\" class=\"message common\"style=\"font-size:" + CTS.FontSize + "px;\">" + arguments[5] + "</span></div></CTS-message-html>");
            } else {
                CTS.CreateMessageLast = arguments[4];
                ChatLogElement.querySelector("#cts-chat-content").insertAdjacentHTML("beforeend", "<div class=\"message" + ((CTS.Avatar) ? " common " : " ") + ((CTS.HighlightList.includes(arguments[3]) || arguments[6]) ? "highlight" : "") + "\" " + ((arguments[2] === "") ? "style=\"padding-left:3px;\"" : "") + ">" + ((arguments[2] == "") ? "" : ((CTS.Avatar) ? "<a href=\"#\" class=\"avatar\"><div><img src=\"" + arguments[2] + "\"></div></a>" : "")) + "<div onclick=\"UserProfileView('" + arguments[3] + "')\" class=\"nickname\" style=\"background:" + arguments[1] + ";\">" + arguments[4] + (CTS.TimeStampToggle ? "<div class=\"ctstime\"> " + arguments[0] + " </div>" : "") + "</div><div class=\"content\"><cts-message-html><span id=\"html\" class=\"message common\"style=\"font-size:" + CTS.FontSize + "px;\">" + arguments[5] + "</span></CTS-message-html></div></div>");
            }
        } else {
            CTS.CreateMessageLast = undefined;
        }
        UpdateScroll(1, false);
    }

    function LoadMessage() {
        let Chat = ChatLogElement.querySelector("#cts-chat-content");
        CTS.ChatScroll = true;
        Chat.innerHTML = "";
        CheckUnreadMessage();
        if (CTS.Message[GetActiveChat()]) {
            //POST MESSAGE
            let len = CTS.Message[GetActiveChat()].length,
                LoadMessageLast;
            for (let ChatIndex = 0; ChatIndex < len; ChatIndex++) {
                if (CTS.Message[GetActiveChat()][ChatIndex].nick == LoadMessageLast && CTS.ChatType) {
                    // Stack
                    ChatLogElement.querySelector("#cts-chat-content>.message:last-child cts-message-html:last-child").insertAdjacentHTML("afterend", "<cts-message-html><div class=\"stackmessage\">" + (CTS.TimeStampToggle ? "<div class=\"ctstimehighlight\"> " + CTS.Message[GetActiveChat()][ChatIndex].time + " </div>" : "") + "<span id=\"html\" class=\"message common\" style=\"font-size:" + CTS.FontSize + "px;\">" + CTS.Message[GetActiveChat()][ChatIndex].msg + "</span></div></CTS-message-html>");
                } else {
                    LoadMessageLast = CTS.Message[GetActiveChat()][ChatIndex].nick;
                    ChatLogElement.querySelector("#cts-chat-content").insertAdjacentHTML("beforeend", "<div class=\"message" + ((CTS.Avatar) ? " common " : " ") + ((CTS.HighlightList.includes(CTS.Message[GetActiveChat()][ChatIndex].username) || CTS.Message[GetActiveChat()][ChatIndex].mention) ? "highlight" : "") + "\" " + ((CTS.Message[GetActiveChat()][ChatIndex].avatar === "") ? "style=\"padding-left:3px;\"" : "") + ">" + ((CTS.Avatar) ? "<a href=\"#\" class=\"avatar\"><div><img src=\"" + (CTS.Message[GetActiveChat()][ChatIndex].avatar) + "\"></div></a>" : "") + "<div onclick=\"UserProfileView('" + CTS.Message[GetActiveChat()][ChatIndex].username + "')\" class=\"nickname\" style=\"-webkit-box-shadow: 0 0 6px " + CTS.Message[GetActiveChat()][ChatIndex].namecolor + ";box-shadow: 0 0 6px " + CTS.Message[GetActiveChat()][ChatIndex].namecolor + ";background:" + CTS.Message[GetActiveChat()][ChatIndex].namecolor + ";\">" + CTS.Message[GetActiveChat()][ChatIndex].nick + (CTS.TimeStampToggle ? "<div class=\"ctstime\"> " + CTS.Message[GetActiveChat()][ChatIndex].time + " </div>" : "") + "</div><div class=\"content\"><cts-message-html><span id=\"html\" class=\"message common\" style=\"font-size:" + CTS.FontSize + "px;\">" + CTS.Message[GetActiveChat()][ChatIndex].msg + "</span></CTS-message-html></div></div>");
                }
                if (ChatIndex == (len - 1)) CTS.CreateMessageLast = CTS.Message[GetActiveChat()][ChatIndex].nick;
            }
        } else {
            //START PM
            CTS.Message[GetActiveChat()] = [];
        }
        UpdateScroll(1, false);
        UpdateScroll(2, false);
    }

    function CreateGift() {
        let gift = arguments[0].gift,
            from = (!gift.anon) ? arguments[0].from.name : "ANONYMOUS",
            to = arguments[0].to.name,
            comment = gift.comment;
        CTS.Message[0].push({
            "time": Time(),
            "namecolor": "#3f69c0",
            "avatar": "",
            "username": "",
            "nick": "SPECIAL DELIVERY",
            "msg": "<br><div class=\"gift\"><center>" + gift.name + "</center><br><a href=\"" + gift.store_url + "\" target=\"_blank\"><img style=\"display: block;margin-left: auto;margin-right: auto;width: 50%;\" src=\"" + gift.url + "\"></a><center>" + ((comment !== "") ? "<br>" + comment : "") + "<br>From:<br>" + from + "<br>To:<br>" + to + "</center></div><br>",
            "mention": true
        });
        let msg = CTS.Message[0][CTS.Message[0].length - 1];
        CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, msg.mention, 0);
        if (window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound && !window.CTSMuted) {
            window.CTSSound.GIFT.volume = window.CTSRoomVolume;
            window.CTSSound.GIFT.play();
        }
        UpdateScroll(1, true);
    }

    function AKB() {
        //WATCH OR REMOVE USERS
        if ((CTS.AutoKick === false && CTS.AutoBan === false) && arguments[0] === true) {
            CTS.WatchList.push([arguments[2], arguments[1], new Date()]);
            debug("WATCHLIST::ADDED", arguments[2] + ":" + arguments[1]);
        } else {
            if (CTS.Me.mod) {
                if (CTS.AutoKick === true) {
                    CTS.NoGreet = true;
                    Send("kick", arguments[1]);
                } else if (CTS.AutoBan === true) {
                    CTS.NoGreet = true;
                    Send("ban", arguments[1]);
                }
            }
        }
    }

    function AKBS() {
        if (arguments[0].username !== "") {
            //EXTENDED SAFELIST
            let temp = [];
            if (Addon.active("AKB")) temp = Addon.get("AKB");
            //DEFAULT SAFELIST
            if (!isSafeListed(arguments[0].username.toUpperCase())) {
                if (arguments[0].subscription > 0 || arguments[0].mod === true) {
                    if (CTS.SafeList.length < 10000) {
                        CTS.SafeList.push(arguments[0].username.toUpperCase());
                        Save("AKB", JSON.stringify(CTS.SafeList));
                        debug("SAFELIST::ADDED", arguments[0].username.toUpperCase() + ":" + arguments[0].handle);
                    }
                } else {
                    if (arguments[0].lurker === false) {
                        AKB(true, arguments[0].handle, arguments[0].username.toUpperCase());
                    } else {
                        AKB(false, arguments[0].handle);
                    }
                }
            }
        } else {
            AKB(false, arguments[0].handle);
        }
    }

    function CheckSafeList() {
        let target = HandleToUser(arguments[0]);
        if (target !== -1) {
            let a = CTS.SafeList.indexOf(CTS.UserList[target].username);
            if (a !== -1) {
                //REMOVE
                if (arguments[1]) {
                    debug("SAFELIST::", "REMOVE USER " + CTS.UserList[target].username + " FROM SAFELIST");
                    Alert(GetActiveChat(), "✓ Removing " + CTS.UserList[target].username + " from safelist!");
                    CommandList.saferemove(a);
                } else {
                    //GETID
                    return a;
                }
            }
        }
    }

    function CheckUnreadMessage() {
        if ((Math.floor(ChatLogElement.querySelector("#chat").scrollTop + 50) >= (ChatLogElement.querySelector("#chat").scrollHeight - ChatLogElement.querySelector("#chat").offsetHeight)) || arguments[0] !== undefined) {
            CTS.MissedMsg = 0;
            CTS.ChatScroll = true;
            ChatLogElement.querySelector(".cts-message-unread").style.display = "none";
        } else {
            CTS.MissedMsg++;
            CTS.ChatScroll = false;
            ChatLogElement.querySelector(".cts-message-unread").style.display = "block";
            ChatLogElement.querySelector(".cts-message-unread").innerHTML = "There are " + CTS.MissedMsg + " unread message(s)!";
        }
    }

    function GetActiveChat() {
        let elem = ChatListElement.querySelector(".active");
        if (elem) return elem.getAttribute("data-chat-id");
        return 0;
    }

    function CheckImgur() {
        if (CTS.Imgur) {
            let i = arguments[0].match(/https?:\/\/i\.imgur\.com\/[a-zA-Z0-9]*\.(jpeg|jpg|gif|png|mp4)/);
            if (i !== null) {
                CTS.ImgurWarning++;
                arguments[0] = (i[1] == "mp4") ? "<center>(Video Below)\n<video onclick=\"if (this.paused) {this.play();}else{this.pause();}\" oncontextmenu=\"return false;\" width=\"288px\" height=\"162px\"><source src=\"" + i[0] + "\" type=\"video/mp4\" /><source src=\"https://i.imgur.com/qLOIgom.mp4\" type=\"video/mp4\" /></video>\n<a href=\"" + i[0] + "\" target=\"_blank\">Direct Link</a></center>" : "<center><img src=\"" + i[0] + "\" width=\"320px\" height=\"240px\" />\n<a href=\"" + i[0] + "\" target=\"_blank\">Direct Link</a></center>";
                if (CTS.ImgurWarning < 1 && CTS.CanSeeTips) Alert(GetActiveChat(), "!imgurtoggle to stop unwanted images.");
            }
        }
        return arguments[0];
    }

    function isCommand(str) {
        return /^!/.test(str);
    }

    function RoomUsers() {
        if (CTS.ScriptInit) UserListElement.querySelector("#header>span>span").innerText = " : " + CTS.UserList.length;
    }

    function LineSpam() {
        let LineBreaks = (arguments[0].match(/\n|\r/g) || []).length;
        if ((LineBreaks >= 10 || /\n\n\n\n/g.test(arguments[0]) || arguments[0].length > 300) && arguments[1] === false) return true;
        
        return false;
    }

    function GamePrevention() {
        if (!CTS.CanSeeGames && arguments[1] && arguments[0].match(/^\[(FISH|FISHING BOAT|FISHING HIGH SCORE|FISHING BOAT HIGH SCORE|TRIVIA|TRIVIA RANK|DAD JOKE|CHUCK NORRIS|URBAN DICTIONARY|ADVICE|COIN FLIP)\]/)) return false;
        return true;
    }

    function UpdateScroll() {
        if (arguments[0] === 1 && (CTS.ChatScroll || arguments[1] === true)) ChatLogElement.querySelector("#chat").scrollTop = ChatLogElement.querySelector("#chat").scrollHeight;
        if (arguments[0] === 2 && (CTS.NotificationScroll || arguments[1] === true) && CTS.NotificationToggle == 0) ChatLogElement.querySelector("#notification-content").scrollTop = ChatLogElement.querySelector("#notification-content").scrollHeight;
    }

    function DecodeTXT() {
        let txt = document.createElement("textarea");
        txt.innerHTML = arguments[0];
        return txt.value;
    }

    function HTMLtoTXT() {
        let p = document.createElement("p");
        let text = document.createTextNode(arguments[0]);
        p.appendChild(text);
        p = p.innerHTML.replace(/(?:(?:(?:https?|ftps?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/igm, (url)=> {
            try {
                if(new URL(url).hostname.includes('xn--')) {
                    return`URL BLOCKED`;
                } else {
                    return `<a target="_blank" href="${url}">${url}</a>`
                }
            } catch (e) {
                return`URL BLOCKED`;
            }
        });
        p = p.replace(/[\u2680-\u2685]/g, "<span style=\"font-size:275%;\">$&</span>").replace(/\n|\r/g, "<br>");
        return p;
    }

    function IgnoreText() {
        if (arguments[0] !== "") {
            if (arguments[0].match(/^(\r|\n|\s).*/)) return false;
            return true;
        }
    }

    function TimeToDate() {
        if (arguments[1] === undefined) arguments[1] = new Date();
        let match = arguments[0].trim().match(/(\d+):(\d+)\s?((?:am|pm))/i);
        let t = {
            hours: parseInt(match[1]),
            minutes: parseInt(match[2]),
            period: match[3].toLowerCase()
        };
        if (t.hours === 12) {
            if (t.period === "am") arguments[1].setHours(t.hours - 12, t.minutes, 0);
            if (t.period === "pm") arguments[1].setHours(t.hours, t.minutes, 0);
        } else {
            if (t.period === "am") arguments[1].setHours(t.hours, t.minutes, 0);
            if (t.period === "pm") arguments[1].setHours(t.hours + 12, t.minutes, 0);
        }
        return arguments[1];
    }

    function PushPM() {
        let text = HTMLtoTXT(arguments[1]),
            list;
        if (arguments[2] !== undefined) {
            list = CTS.UserList[arguments[2]];
            if (isSafeListed(CTS.UserList[arguments[2]].username)) text = CheckImgur(text);
        } else {
            list = CTS.Me;
            text = CheckImgur(text);
        }

        CTS.Message[arguments[0]].push({
            "time": Time(),
            "namecolor": list.namecolor,
            "avatar": list.avatar,
            "username": list.username,
            "nick": list.nick,
            "msg": text,
            "mention": false
        });

        if (arguments[0] == GetActiveChat()) {
            let msg = CTS.Message[arguments[0]][CTS.Message[arguments[0]].length - 1];
            CreateMessage(msg.time, list.namecolor, list.avatar, list.username, list.nick, msg.msg, msg.mention, arguments[0]);
            UpdateScroll(1, false);
        }
    }

    function Time() {
        return (new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        }));
    }

    function DateTime() {
        return (new Date().toLocaleString("en-US", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        }));
    }
    //FEATURES
    function StorageSupport() {
        try {
            if ("localStorage" in window && window.localStorage !== null) {
                localStorage.setItem("CTS_StorageVerify", true);
                localStorage.removeItem("CTS_StorageVerify");
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    function Export() {
        let element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(arguments[1]));
        element.setAttribute("download", arguments[0]);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function StyleSet() {
        // Chat
        let style = document.createElement("style");
        style.setAttribute("id", CTS.ChatStyleCounter);
        style.innerHTML = window.CTSChatCSS[CTS.ChatStyleCounter][0] + ":host, #videolist {background-color:unset;}";
        ChatLogElement.appendChild(style);
        // Video
        style = document.createElement("style");
        style.setAttribute("id", CTS.ChatStyleCounter);
        style.innerHTML = window.CTSChatCSS[CTS.ChatStyleCounter][1] + ":host, #videolist {background-color:unset;}";
        VideoListElement.appendChild(style);
        // Side Menu
        style = document.createElement("style");
        style.setAttribute("id", CTS.ChatStyleCounter);
        style.innerHTML = window.CTSChatCSS[CTS.ChatStyleCounter][2] + ":host, #videolist {background-color:unset;}";
        SideMenuElement.appendChild(style);
    }

    function ChatHeightToggled() {
        CTS.OGStyle.HeightCounter++;
        if (!CTS.ChatDisplay) {
            CTS.ChatWidth += 5;
            CTS.ChatDisplay = true;
        }
        CTS.ChatHeight -= 5;
        CTS.UserListDisplay = true;
        if (CTS.ChatHeight == 20) {
            CTS.ChatHeight = 45;
            CTS.UserListDisplay = false;
            CTS.OGStyle.HeightCounter = 0;
        }
        ChatLogElement.querySelector("#chat-wrapper").style.cssText = "min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%);" + (CTS.UserListDisplay ? "top:unset;min-height:calc(100% - " + CTS.ChatHeight + "% - 119px)!important;max-height:calc(100% - " + CTS.ChatHeight + "% - 119px)!important;" : "bottom:0;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
        TitleElement.querySelector("#room-header").style.cssText = "min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%)!important;top:" + (CTS.UserListDisplay ? "calc(" + CTS.ChatHeight + "% + 84px);" : "84px;");
        VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.cssText = "bottom:unset;min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%);top:" + (CTS.UserListDisplay ? "calc(" + CTS.ChatHeight + "% + 34px);" : "unset;top:34px;");
        VideoListElement.querySelector("#videos-header").style.cssText = !CTS.UserListDisplay ? "top:0;right: 54px;" : "bottom:unset;top:" + CTS.ChatHeight + "%;";
        SideMenuElement.querySelector("#sidemenu").style.cssText = !CTS.UserListDisplay ? "display:none" : "min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%)!important;height:" + CTS.ChatHeight + "%!important;";
        //UserListElement.querySelector("#button-banlist").style.cssText = "top:calc(" + CTS.ChatHeight + "% + 89px);";
        document.querySelector("#content").style.cssText = "width:calc(100% " + (CTS.ChatDisplay ? "- (400px + " + CTS.ChatWidth + "%)" : "") + ")";
        VideoListElement.querySelector("#videos-footer").style.cssText = "display:block;top:" + (CTS.UserListDisplay ? "calc(" + CTS.ChatHeight + "% + 119px);" : "119px;") + "right:-70px;display:block;";
        PerformanceModeInit(CTS.PerformanceMode);
        UpdateScroll(1, true);
        UpdateScroll(2, true);
        Resize();
    }

    function ChatWidthToggled() {
        CTS.OGStyle.WidthCounter++;
        CTS.ChatWidth += 5;
        CTS.ChatDisplay = true;
        if (CTS.ChatWidth == 25) {
            CTS.ChatWidth = -5;
            CTS.ChatDisplay = false;
            CTS.OGStyle.WidthCounter = 0;
        }
        ChatLogElement.querySelector("#chat-wrapper").style.cssText = (!CTS.ChatDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%);" + ((CTS.UserListDisplay) ? "top:unset;min-height:calc(100% - " + CTS.ChatHeight + "% - 119px)!important;max-height:calc(100% - " + CTS.ChatHeight + "% - 119px)!important;" : "bottom:0;;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
        TitleElement.querySelector("#room-header").style.cssText = (!CTS.ChatDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%)!important;top:" + ((CTS.UserListDisplay) ? "calc(" + CTS.ChatHeight + "% + 84px);" : "84px;");
        VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.cssText = (!CTS.ChatDisplay) ? "bottom:0;top:unset;width:100%;position:relative;" : "bottom:unset;min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%);top:" + ((CTS.UserListDisplay) ? "calc(" + CTS.ChatHeight + "% + 34px);" : "34px;bottom:unset;");
        VideoListElement.querySelector("#videos-header").style.cssText = (!CTS.ChatDisplay) ? "display:none" : ((CTS.UserListDisplay) ? "bottom:unset;top:" + CTS.ChatHeight + "%;" : "bottom:unset;top: 0;right: 54px;");
        SideMenuElement.querySelector("#sidemenu").style.cssText = (!CTS.ChatDisplay || !CTS.UserListDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + CTS.ChatWidth + "%);max-width:calc(400px + " + CTS.ChatWidth + "%)!important;height:" + CTS.ChatHeight + "%!important;";
        //UserListElement.querySelector("#button-banlist").style.cssText = (!CTS.ChatDisplay) ? "display:none" : "top:calc(" + CTS.ChatHeight + "% + 89px);";
        document.querySelector("#content").style.cssText = "width:calc(100% " + ((CTS.ChatDisplay) ? "- (400px + " + CTS.ChatWidth + "%)" : "") + ")";
        VideoListElement.querySelector("#videos-footer").style.cssText = "display:block;top:" + ((CTS.UserListDisplay) ? "calc(" + CTS.ChatHeight + "% + 119px);" : "119px;") + "right:-70px;display:block;";
        CTS.PerformanceMode = false;
        PerformanceModeInit(CTS.PerformanceMode);
        UpdateScroll(1, true);
        UpdateScroll(2, true);
        Resize();
    }

    function ChatHide() {
        CTS.NormalStyle.ChatHide = !CTS.NormalStyle.ChatHide;
        ChatLogElement.querySelector("#chat-wrapper").style.display = (CTS.NormalStyle.ChatHide ? "none" : "block");
        UpdateScroll(1, true);
        UpdateScroll(2, true);
        Resize();
    }

    function SoundMeter() {
        //MICROPHONE INDICATOR
        if (CTS.SoundMeterToggle) {
            setTimeout(function() {
                let Camera = VideoListElement.querySelectorAll(".videos-items tc-video-item"),
                    Featured = VideoListElement.querySelectorAll(".videos-items:first-child tc-video-item"),
                    videolist = window.TinychatApp.getInstance().defaultChatroom._videolist,
                    TCCameraList = videolist.items.length,
                    CameraLen = Camera.length,
                    users,
                    item;
                if (Featured.length > 0) {
                    for (let x = 0; x < TCCameraList; x++) {
                        if (CameraLen < 1) break;
                        for (users = 0; users < CameraLen; users++) {
                            item = videolist.items[x];
                            if (item != undefined) {
                                if (Camera[users].shadowRoot.querySelector(".video > div > video").getAttribute("data-video-id") == item.userentity.path) {
                                    Camera[users].shadowRoot.querySelector(".video > div > .overlay").setAttribute("data-mic-level", item.audiolevel);
                                    Camera[users].shadowRoot.querySelector(".video > div > svg").setAttribute("data-mic-level", 0);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (users = 0; users < CameraLen; users++) {
                        item = videolist.items[users];
                        if (item != undefined) {
                            Camera[users].shadowRoot.querySelector(".video > div > .overlay").setAttribute("data-mic-level", item.audiolevel);
                            Camera[users].shadowRoot.querySelector(".video > div > svg").setAttribute("data-mic-level", 0);
                        }
                    }
                }
                //REPEAT
                SoundMeter();
            }, 250);
        }
    }

    function RTC() {
        if (null != arguments[0].rtc) {
            let a = arguments[0].rtc;
            arguments[0].rtc = null;
            MS(arguments[0], a);
        }
    }

    function Vote() {
        let ChecksOut = CTS.VoteSystem,
            len = CTS.WaitToVoteList.length;
        if (len > 0 && ChecksOut) {
            for (let i = 0; i < len; i++) {
                if (CTS.WaitToVoteList[i][0] === CTS.UserList[arguments[0]].username.toUpperCase()) {
                    Send("msg", "Please wait several minutes to cast your vote again!");
                    ChecksOut = false;
                    break;
                }
            }
        }
        if (ChecksOut) {
            if (isSafeListed(CTS.UserList[arguments[0]].username.toUpperCase())) {
                let targetname = arguments[1].match(/^!vote ([a-z0-9]{1,16})$/i);
                if (targetname !== null) {
                    let Target = UsernameToUser(targetname[1].toUpperCase());
                    if (Target !== -1) {
                        if (CTS.UserList[Target].broadcasting && CTS.UserList[Target].username !== "GUEST") {
                            if (CTS.Me.owner || !CTS.UserList[Target].mod) {
                                Send("msg", "Your vote has been cast, you may vote again shortly!");
                                CTS.WaitToVoteList.push([CTS.UserList[arguments[0]].username.toUpperCase(), new Date()]);
                                CTS.UserList[Target].vote += 1;
                                if (CTS.UserList[Target].vote === 3) {
                                    CTS.UserList[Target].vote = 0;
                                    Send("msg", CTS.UserList[Target].nick + "!\nYou've been voted off camera!");
                                    Send("stream_moder_close", CTS.UserList[Target].handle);
                                }
                            } else {
                                Send("msg", "I cannot do that!");
                            }
                        }
                    } else {
                        Send("msg", "The user is not broadcasting...");
                    }
                } else {
                    Send("msg", "The nickname or username does not exist!");
                }
            }
        }
    }

    function PMShow() {
        ChatListElement.querySelector("#chatlist").style.display = ((CTS.enablePMs) ? "block" : "none");
    }

    function MessagePopUp() {
        if (CTS.Popups) {
            let push = false;
            if (arguments[0] != -1) {
                if (ChatListElement.querySelector(".list-item .active")) {
                    if (ChatListElement.querySelector(".active").innerHTML.includes(CTS.UserList[arguments[0]].nick) && !ChatListElement.querySelector(".active").innerHTML.includes("(offline)")) {
                        if (arguments[2]) push = true;
                    } else {
                        push = true;
                    }
                } else if (!arguments[2]) {
                    push = true;
                }
            }
            if (arguments[3]) push = true;
            if (push || !CTS.ChatDisplay) {
                if (VideoListElement.querySelector(".PMOverlay .PMPopup:nth-child(5)")) {
                    Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                    clearTimeout(CTS.NotificationTimeOut[0]);
                    CTS.NotificationTimeOut.shift();
                }
                VideoListElement.querySelector(".PMOverlay").insertAdjacentHTML("beforeend", "<div class=\"PMPopup\"><h2><div class=\"PMTime\">" + Time() + "</div><div class=\"PMName\">" + ((arguments[3]) ? "YouTube" : (CTS.UserList[arguments[0]].nick + " in " + ((arguments[2]) ? "Main" : "PM"))) + "</div></h2><div class=\"PMContent\"style=\"font-size:" + CTS.FontSize + "px\">" + arguments[1] + "</div></div>");
                CTS.NotificationTimeOut.push(setTimeout(function() {
                    if (VideoListElement.querySelector(".PMOverlay .PMPopup")) {
                        Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                        CTS.NotificationTimeOut.shift();
                    }
                }, 11100));
            }
        }
    }

    function Reminder() {
        let temp,
            i,
            len = CTS.ReminderServerInList.length;
        for (i = 0; i < len; i++) clearTimeout(CTS.ReminderServerInList[i]);
        CTS.ReminderServerInList = [];
        if (CTS.Reminder === true) {
            let OffsetTime;
            len = CTS.ReminderList.length;
            for (i = 0; i < len; i++) {
                temp = TimeToDate(CTS.ReminderList[i][0]);
                CTS.RecentTime = new Date();
                if (temp < CTS.RecentTime) temp.setDate(temp.getDate() + 1);
                OffsetTime = temp - CTS.RecentTime;
                CTS.ReminderServerInList.push(setTimeout(AddReminder, OffsetTime, CTS.ReminderList[i][1]));
            }
            if (Addon.active("ReminderList")) {
                len = Addon.get("ReminderList").length;
                for (i = 0; i < len; i++) {
                    temp = TimeToDate(Addon.get("ReminderList")[i][0]);
                    CTS.RecentTime = new Date();
                    if (temp < CTS.RecentTime) temp.setDate(CTS.RecentTime.getDate() + 1);
                    OffsetTime = temp - CTS.RecentTime;
                    CTS.ReminderServerInList.push(setTimeout(AddReminder, OffsetTime, Addon.get("ReminderList")[i][1]));
                }
            }
        }
    }

    function AddReminder() {
        Send("msg", "📣 " + arguments[0]);
        setTimeout(Reminder, 5000);
    }

    function NotificationDisplay() {
        ChatLogElement.querySelector("#notification-content").style.cssText = "display:" + ((CTS.NotificationToggle == 0) ? "block" : "none") + ";";
        ChatLogElement.querySelector(".notifbtn").style.cssText = "display:" + ((CTS.NotificationToggle == 0) ? "block" : "none") + ";";
        if (CTS.NotificationToggle == 0) {
            ChatLogElement.querySelector(".notifbtn").addEventListener("click", NotificationResize, {
                passive: true
            });
        } else {
            ChatLogElement.querySelector(".notifbtn").removeEventListener("click", NotificationResize, {
                passive: true
            });
        }
        UpdateScroll(1, true);
        UpdateScroll(2, true);
    }

    function NotificationResize() {
        ChatLogElement.querySelector("#notification-content").classList.toggle("large");
        if (ChatLogElement.querySelector(".notifbtn").innerText === "▼") {
            ChatLogElement.querySelector(".notifbtn").innerText = "▲";
            ChatLogElement.querySelector("#chat").style.height = "50%%";
        } else {
            ChatLogElement.querySelector(".notifbtn").innerText = "▼";
            ChatLogElement.querySelector("#chat").style.height = "100%";
        }
        UpdateScroll(1, false);
        UpdateScroll(2, true);
    }

    function Dice() {
        return String.fromCharCode("0x268" + Rand(0, 5));
    }

    function Rand() {
        arguments[0] = Math.ceil(arguments[0]);
        arguments[1] = Math.floor(arguments[1]);
        return Math.floor(Math.random() * (arguments[1] - arguments[0] + 1)) + arguments[0];
    }

    function OpenMicrophone() {
        MicrophoneElement.initMouseEvent("mousedown");
        VideoListElement.querySelector("#videos-footer-push-to-talk").dispatchEvent(MicrophoneElement);
    }
    var CameraSound =  new MutationObserver(function(mutations) {Cameras();});
    function Cameras() {
        // Video Items
        let Camera = VideoListElement.querySelectorAll(".videos-items tc-video-item"),
            Len = Camera.length;
        for (let num = 0; num < Len; num++) {
            // Camera Selection
            if (Camera[num] === null) continue;
            if (Camera[num].shadowRoot === null) continue;
            let select  = Camera[num].shadowRoot;
            let user = HandleToUser(select.querySelector(".video > div > video").getAttribute("data-video-id"));

            // Video Border
            if (select.querySelector(".video")) select.querySelector(".video").style.padding = (CTS.CameraBorderToggle) ? "5px" : "0";
            // Handle to UserIndex
            if (user == -1) continue;
            if (CTS.Me.handle !== CTS.UserList[user].handle) {
                if (select.querySelector("div > div > div.overlay > div.icon-volume > tc-volume-control")) {
                    if (select.querySelector("div > div > div.overlay > div.icon-volume > tc-volume-control").shadowRoot) {
                        let VolIco = select.querySelector("div > div > div.overlay > div.icon-volume > tc-volume-control").shadowRoot;
                        CameraSound.observe(VolIco.querySelector(".icon-volume"), { attributes: true, childList: true, subtree: true } );
                        select.querySelector(".video > div > video").volume = (window.CTSMuted)?0:((parseInt(VolIco.querySelector("#videos-header-volume-level").style.width)/100)*window.CTSRoomVolume);
                    }
                }
            }

            if (select.querySelector(".video #fixed")) continue;
            if (CTS.HiddenCameraList.includes(CTS.UserList[user].username)) {
                window.TinychatApp.BLL.Videolist.prototype.toggleHiddenVW(window.TinychatApp.getInstance().defaultChatroom._videolist.items[num], false);
                Alert(GetActiveChat(), CTS.UserList[user].username + " has been auto-hidden!");
            }//border-radius: 3%;.ratio-4-3{border-radius: 3%;box-shadow: 0 0 5px 3px black;}.video{border-radius: 12px;}
            select.querySelector(".video").insertAdjacentHTML("afterbegin", `<style id=\"fixed\">.ratio-4-3{border-radius: 3%!important;box-shadow: 0 0 5px 3px black;}.video.not-visible>div>.overlay{background: url("https://i.imgur.com/7dl4Lom.png") rgb(0, 0, 0) no-repeat;background-position: center!important;background-size: cover!important;}.video.large{position: absolute;left:20%;top: 0;z-index: 2;width: 60%;}.video>div>.overlay[data-mic-level=\"1\"] {-webkit-box-shadow: inset 0 0 7px 1px #53b6ef;box-shadow: inset 0 0 7px 1px #53b6ef; }.video>div>.overlay[data-mic-level=\"2\"] {-webkit-box-shadow: inset 0 0 14px 3px #53b6ef;box-shadow: inset 0 0 14px 3px #53b6ef}.video>div>.overlay[data-mic-level=\"3\"] {-webkit-box-shadow: inset 0 0 14px 5px #53b6ef;box-shadow: inset 0 0 14px 5px #53b6ef;}.video>div>.overlay[data-mic-level=\"4\"],.video>div>.overlay[data-mic-level=\"5\"],.video>div>.overlay[data-mic-level=\"6\"],.video>div>.overlay[data-mic-level=\"7\"],.video>div>.overlay[data-mic-level=\"8\"],.video>div>.overlay[data-mic-level=\"9\"],.video>div>.overlay[data-mic-level=\"10\"] {-webkit-box-shadow: inset 0 0 14px 8px #53b6ef;box-shadow: inset 0 0 14px 8px #53b6ef;}.video:after{content:unset;}</style>`);
        }
        Resize();
    }

    function FeaturedCameras() {
        if (arguments[0] === true) {
            if (VideoListElement.querySelector("#SmallFTYT")) Remove(VideoListElement, "#SmallFTYT");
        } else {
            let node = document.createElement("style");
            node.appendChild(document.createTextNode(FeaturedCSS));
            node.setAttribute("id", "SmallFTYT");
            VideoListElement.appendChild(node);
        }
    }

    function Resize() {
        window.dispatchEvent(new Event("resize"));
    }

    function PerformanceModeInit() {
        if (!CTS.ThemeChange) {
            let value = ((arguments[0]) ? "100%" : "calc(400px + " + CTS.ChatWidth + "%)");
            ChatLogElement.querySelector("#chat-wrapper").style.minWidth = value;
            ChatLogElement.querySelector("#chat-wrapper").style.maxWidth = value;
            ChatLogElement.querySelector("#chat-wrapper").style.width = value;
            TitleElement.querySelector("#room-header").style.minWidth = value;
            TitleElement.querySelector("#room-header").style.maxWidth = value;
            TitleElement.querySelector("#room-header").style.width = value;
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.minWidth = ((!CTS.ChatDisplay) ? "100%" : value);
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.maxWidth = ((!CTS.ChatDisplay) ? "100%" : value);
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.width = ((!CTS.ChatDisplay) ? "100%" : value);
            VideoListElement.querySelector("#videos-header").style.minWidth = ((!CTS.UserListDisplay) ? "calc(" + value + " - 54px)" : value);
            VideoListElement.querySelector("#videos-header").style.maxWidth = ((!CTS.UserListDisplay) ? "calc(" + value + " - 54px)" : value);
            VideoListElement.querySelector("#videos-header").style.width = ((!CTS.UserListDisplay) ? "calc(" + value + " - 54px)" : value);
            SideMenuElement.querySelector("#sidemenu").style.minWidth = value;
            SideMenuElement.querySelector("#sidemenu").style.maxWidth = value;
            SideMenuElement.querySelector("#sidemenu").style.width = value;
            document.querySelector("#content").style.width = ((!arguments[0]) ? "calc(100% " + (CTS.ChatDisplay ? "- (400px + " + CTS.ChatWidth + "%)" : "") + ")" : "0%");
            if (arguments[0]) {
                VideoListElement.querySelector("#videos-content").style.display = "none";
            } else {
                VideoListElement.querySelector("#videos-content").style.removeProperty("display");
            }
        } else {
            if (arguments[0]) {
                VideoListElement.querySelector("#videos-content").style.display = "none";
                ChatLogElement.querySelector("#chat-wrapper").style.width = "100%";
                ChatLogElement.querySelector("#chat-wrapper").style.position = "fixed";
                ChatLogElement.querySelector("#chat-wrapper").style.left = "0";
                ChatLogElement.querySelector("#chat-wrapper").style.bottom = "0";
                ChatLogElement.querySelector("#chat-wrapper").style.minHeight = "100%";
                VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.display = "none";
                VideoListElement.querySelector("#videos-header").style.display = "none";
                VideoListElement.querySelector("#videos-footer").style.display = "none";
            } else {
                VideoListElement.querySelector("#videos-content").style.removeProperty("display");
                ChatLogElement.querySelector("#chat-wrapper").style.removeProperty("width");
                ChatLogElement.querySelector("#chat-wrapper").style.removeProperty("position");
                ChatLogElement.querySelector("#chat-wrapper").style.removeProperty("left");
                ChatLogElement.querySelector("#chat-wrapper").style.removeProperty("bottom");
                ChatLogElement.querySelector("#chat-wrapper").style.removeProperty("min-height");
                VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.removeProperty("display");
                VideoListElement.querySelector("#videos-header").style.removeProperty("display");
                VideoListElement.querySelector("#videos-footer").style.removeProperty("display");
            }
        }
        UpdateScroll(1, true);
        UpdateScroll(2, true);
        Resize();
    }

    function OwnerCommand() {
        //MESSAGE FROM OWNER
        if (isCommand(arguments[1])) {
            if (CTS.UserList[arguments[0]].owner) {
                if (!CTS.Me.owner) {
                    //PROCEED WITH CAUTION (YOU SEND A SWARM OF USERS TO ANOTHER ROOM) - COME SAY HI
                    if (arguments[1].match(/^!raid /i)) {
                        // !raid https://tinychat.com/roomname
                        let raid = arguments[1].match(/^(?:!raid )(?:https?:\/\/)?tinychat\.com(?!\/#)\/(?!gifts|settings|coins|subscription|promote)(?:room\/)?([a-z0-9]{3,16})$/i);
                        if (raid !== null) {
                            if (CTS.RaidToggle) {
                                window.location.replace("https://tinychat.com/room/" + raid[1]);
                            } else {
                                Alert(GetActiveChat(), "[TIP]\nRaids are silenced. Refresh or !raidtoggle");
                            }
                        } else {
                            if (CTS.CanSeeTips) Alert(GetActiveChat(), "[TIP]\nThis is not a valid link for raid.");
                        }
                    }
                    if (arguments[1].match(/^!version$/i)) Send("pvtmsg", "I am using " + CTS.Project.Name + "v" + Ver(), CTS.UserList[arguments[0]].handle);
                } else {
                    if (arguments[1].match(/^!closeall$/i)) {
                        for (let a = 0; a < CTS.Camera.List.length; a++) {
                            if (CTS.Me.handle !== CTS.Camera.List[a]) {
                                Send("stream_moder_close", CTS.Camera.List[a]);
                            } else {
                                CTS.SocketTarget.send(JSON.stringify({
                                    "tc": "stream_close",
                                    "handle": CTS.Me.handle
                                }));
                            }
                        }
                    }
                    if (arguments[1].match(/^!kickall$/i)) {
                        for (let b = 0; b < CTS.UserList.length; b++) {
                            if (CTS.Me.handle !== CTS.UserList[b].handle) Send("kick", CTS.UserList[b].handle);
                        }
                        if (CTS.CanSeeTips) Alert(GetActiveChat(), "[TIP]\nIf you leave now, the entire room resets! GOGOGO~");
                    }
                }
            }
        }
    }

    function Command() {
        let UserCommand = arguments[0].match(/^!([a-z0-9]*)(?: ?)(.*)/i);
        if (UserCommand) {
            if (typeof CommandList[UserCommand[1].toLowerCase()] == "function") {
                debug("COMMAND::" + ((arguments[1]) ? "PM" : "MAIN"), UserCommand[1] + ":" + UserCommand[2]);
                CommandList[UserCommand[1].toLowerCase()](UserCommand[2], arguments[1]);
            }
        }
    }
    //ALERT FUNCTIONS
    function Settings() {
        Alert(GetActiveChat(), ((arguments[0] !== undefined) ? arguments[0] : "") + "<center>CTS BOT CONFIGURATION:\nBot Mode: " + ((CTS.Bot) ? "ON" : "OFF") + "\nPublic Command Mode: " + ((CTS.PublicCommandToggle) ? "ON" : "OFF") + "\nGreen Room Mode:\n" + ((CTS.GreenRoomToggle) ? "AUTO ALLOW" : "MANUAL") + "\n\nStrict: " + ((CTS.Strict) ? "ON" : "OFF") + "\nSpamBan: " + ((CTS.SpamBan) ? "ON" : "OFF") + "\n\nReminder Mode: " + ((CTS.Reminder) ? "ON" : "OFF") + "\n\nGame View: " + ((CTS.CanSeeGames) ? "ON" : "OFF") + "\n\nTrivia Game Host: " + ((CTS.CanHostTriviaGames) ? "ON" : "OFF") + "\nFish Game Host: " + ((CTS.CanHostFishGames) ? "ON" : "OFF") + "\nWordle Game Host: " + ((CTS.CanHostWordleGames) ? "ON" : "OFF") + "\n\nNotification Display: " + ((CTS.NotificationToggle != 2) ? "SHOW(" + CTS.NotificationToggle + ")" : "HIDE") + "\nPopup Display: " + ((CTS.Popups) ? "SHOW" : "HIDE") + "\n\nFOR LIST OF COMMANDS:\n!CTS or !HELP</center>");
    }

    function Alert() {
        CTS.Message[arguments[0]].push({
            "time": Time(),
            "namecolor": (arguments[2] !== undefined) ? "#000000" : "#3f69c0",
            "avatar": (arguments[2] !== undefined) ? ("") : ("https://i.imgur.com/S09irS7.png"),
            "username": "",
            "nick": (arguments[2] !== undefined) ? (arguments[2]) : ("CTS Version: " + Ver()),
            "msg": ((arguments[2] !== undefined) ? ("<div class=\"systemuser\">" + arguments[1] + "</div>") : arguments[1]),
            "mention": true
        });
        let len = CTS.Message[arguments[0]].length - 1;
        arguments[1] = CTS.Message[arguments[0]][len];
        CreateMessage(arguments[1].time, arguments[1].namecolor, arguments[1].avatar, arguments[1].username, arguments[1].nick, arguments[1].msg, arguments[1].mention, arguments[0]);
    }

    window.ShowProfile = function () {
        let resp = JSON.parse(arguments[0]);
        if (resp.result == "success") {
            Alert(
                GetActiveChat(),
                resp.username +
                "\n" + resp.age + "/" + resp.gender +
                "\nLocation: " + ((resp.location !== "") ? ("\n" + resp.location) : "empty") +
                "\nBiography: " + ((resp.biography !== "") ? ("\n" + resp.biography) : "empty") +
                "\n" + (/(standart)/i.test(resp.avatarUrl) ? "Picture: default" : "<img src=\"" + resp.avatarUrl + "\">"),
                "Profile Lookup"
            );
        }
    }

    function Ver() {
        return window.CTSVersion.Major + "." + window.CTSVersion.Minor + "." + window.CTSVersion.Patch;
    }

    function AddUserNotification() {
        if (CTS.FullLoad && CTS.ShowedSettings) {
            let chat = ChatLogElement.querySelector("#notification-content"),
                Notification;
            CTS.NotificationScroll = (Math.floor(chat.scrollTop) + 5 >= (chat.scrollHeight - chat.offsetHeight)) ? true : false;
                Notification = (
                    arguments[0] == 1 ?
                      arguments[3] + (arguments[4] ? " is " : " has stopped ") + "broadcasting!" :
                    arguments[0] == 2 ?
                      (!arguments[4] ?
                        "<span title='Profile Lookup' style='cursor: pointer;' onclick=\"UserProfileView('" + arguments[3] + "')\">🔍</span> " + arguments[3] + " has joined!" :
                        arguments[3] + " has left."
                      ) :
                    arguments[0] == 3 ?
                      arguments[2] + " has mentioned you!" :
                    arguments[0] == 4 ?
                      (arguments[5].toUpperCase() === arguments[3] ?
                        "account " + arguments[3] + " changed name to " + arguments[5] :
                        `⚠️NAME CHANGE⚠️<br>${arguments[5]}:${arguments[3]}`
                      ) :
                      ""
                  );
            if (arguments[0] != 3 && CTS.NotificationToggle == 0) ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><div class=\"notification\"><span class=\"nickname\" style=\"background:" + arguments[1] + ";\">" + arguments[2] + "</span>" + ((CTS.TimeStampToggle) ? "<span class=\"time\"> " + Time() + " </span>" : "") + "<br/>" + Notification + "</div></div>");
            if (CTS.NotificationToggle == 1) Alert(0, Notification, arguments[2]);
            UpdateScroll(2, false);
            let Notifications = ChatLogElement.querySelectorAll(".notification");
            if (Notifications.length > CTS.NotificationLimit + 25) {
                for (let NotificationIndex = 0; NotificationIndex < Notifications.length - CTS.NotificationLimit; NotificationIndex++) Notifications[NotificationIndex].parentNode.removeChild(Notifications[NotificationIndex]);
            }
        }
    }

    function AddSystemNotification() {
        if (CTS.FullLoad && CTS.ShowedSettings) {
            if (CTS.NotificationToggle == 0) {
                ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><span class=\"nickname\"style=\"background:#F00\">SYSTEM</span>" + ((CTS.TimeStampToggle) ? "<span class=\"time\"> " + Time() + " </span>" : "") + "<br/>" + arguments[0] + "</div>");
            } else if (CTS.NotificationToggle == 1) {
                Alert(0, arguments[0], "SYSTEM");
            }
            UpdateScroll(2, false);
        }
    }
    //USER FUNCTION
    function AddUser() {
        CTS.UserList.push({
            "handle": arguments[0],
            "username": arguments[5],
            "nick": arguments[4],
            "owner": arguments[7],
            "mod": arguments[1],
            "namecolor": arguments[2],
            "avatar": arguments[3],
            "canGame": arguments[6],
            "broadcasting": false,
            "vote": 0,
            "triviapoints": CTS.Game.Trivia.PlayerList[arguments[5]] || 0
        });
        if (CTS.ScriptInit) AddUserNotification(2, arguments[2], arguments[4], arguments[5], false);
    }

    function HandleToUser() {
        for (let user = 0; user < CTS.UserList.length; user++) {
            if (CTS.UserList[user].handle == arguments[0]) return user;
        }
        return -1;
    }

    function UsernameToHandle() {
        for (let user = 0; user < CTS.UserList.length; user++) {
            if (CTS.UserList[user].username.toUpperCase() == arguments[0]) return CTS.UserList[user].handle;
        }
        return -1;
    }

    function UsernameToUser() {
        for (let user = 0; user < CTS.UserList.length; user++) {
            if (CTS.UserList[user].username.toUpperCase() == arguments[0]) return user;
        }
        return -1;
    }

    function NicknameToHandle() {
        for (let user = 0; user < CTS.UserList.length; user++) {
            if (CTS.UserList[user].nick.toUpperCase() == arguments[0]) return CTS.UserList[user].handle;
        }
        return -1;
    }

    function NicknameToUser() {
        for (let user = 0; user < CTS.UserList.length; user++) {
            if (CTS.UserList[user].nick.toUpperCase() == arguments[0]) return user;
        }
        return -1;
    }

    function CheckUserListSafe() {
        let len = CTS.UserList.length;
        let temp = [];
        if (Addon.active("AKB")) temp = Addon.get("AKB");
        for (let user = 0; user < len; user++) {
            if (!CTS.UserList[user].mod && !isSafeListed(CTS.UserList[user].username)) CTS.KBQueue.push(CTS.UserList[user].handle);
        }
        len = CTS.KBQueue.length;
        for (let kb = 0; kb < len; kb++) {
            Send(arguments[0], CTS.KBQueue[kb]);
        }
        CTS.KBQueue = [];
    }

    function isSafeListed() {
        let temp = [];
        if (Addon.active("AKB")) temp = Addon.get("AKB");
        return (CTS.SafeList.includes(arguments[0]) || temp.includes(arguments[0]));
    }

    function CheckUserTempIgnore() {
        if (CTS.TempIgnoreUserList.includes(CTS.UserList[arguments[0]].username) || CTS.TempIgnoreNickList.includes(CTS.UserList[arguments[0]].nick.toUpperCase())) return true;
        return false;
    }

    function CheckUserIgnore() {
        if (CTS.IgnoreList.includes(CTS.UserList[arguments[0]].username)) return true;
        return false;
    }

    function CheckUserTouchScreen() {
        if (/Mobi|Android/i.test(navigator.userAgent) || 'ontouchstart' in document.documentElement) {
            CTS.Project.isTouchScreen = true;
            CTS.ThemeChange = true;
        }
    }

    function CheckUserAbuse(targetHandle, targetUser, targetNick) {
        let action = false;
        let isModerator = CTS.Me.mod;
        let isSafeUser = isSafeListed(targetUser);
        let isUserInKickList = CTS.UserKickList.includes(targetUser) || CTS.NickKickList.includes(targetNick.toUpperCase());
        let isUserInBanList = CTS.UserBanList.includes(targetUser) || CTS.NickBanList.includes(targetNick.toUpperCase());
    
        if (isModerator) {
            if (isUserInKickList) {
                CTS.NoGreet = true;
                Alert(GetActiveChat(), `Nick: ${targetNick}\nUser: ${targetUser}\n✓ Kicked by UserKickList!`);
                sendAction("kick", targetHandle);
                action = true;
            } else if (!action && isUserInBanList) {
                CTS.NoGreet = true;
                Alert(GetActiveChat(), `Nick: ${targetNick}\nUser: ${targetUser}\n✓ Banned by UserBanList!`);
                sendAction("ban", targetHandle);
                action = true;
            } else if (!action && targetHandle !== CTS.Me.Handle && !CTS.UserList[targetUser.mod] && !isSafeUser) {
                checkKeyBan(targetHandle, targetUser, targetNick, CTS.NickKeyBanList, "NickKeyBan")
                checkKeyBan(targetHandle, targetUser, targetNick, CTS.UserKeyBanList, "UserKeyBan") 
            }
        }
    }
    
    function checkKeyBan(targetHandle, targetUser, targetNick, keyBanList, banType) {
        for (let bannedKey of keyBanList) {
            let isBanned = (banType === "NickKeyBan") ? targetNick.toUpperCase().includes(bannedKey) : targetUser.toUpperCase().includes(bannedKey);
            if (isBanned) {
                CTS.NoGreet = true;
                alertAndBan(targetHandle, targetNick, targetUser, banType, bannedKey);
                break;
            }
        }
    }
    
    function alertAndBan(targetHandle, targetNick, targetUser, banType, bannedKey) {
        Alert(GetActiveChat(), `✓ ${banType} for "${bannedKey}"\nNick: ${targetNick}\nUser: ${targetUser}`);
        sendAction("ban", targetHandle);
    }
    
    function sendAction(action, targetHandle) {
        Send(action, targetHandle);
    }

    function CheckStrictAbuse(targetHandle, targetUser, targetNick) {
        let isSafeUser = isSafeListed(targetUser);
        let isModdedUser = CTS.UserList[targetUser.mod];
    
        if (CTS.Me.mod && targetHandle !== CTS.Me.Handle && !isModdedUser && !isSafeUser) {
            let isStrictViolation = checkStrictViolation(targetUser, targetNick);
            let isSuspect = checkSuspect(targetUser, targetNick);
    
            if (isStrictViolation || isSuspect) {
                CTS.NoGreet = true;
                alertAndKeyBan(targetHandle, targetUser, targetNick, isStrictViolation ? "Strict" : "Suspect");
            }
        }
    }
    // checks Username for 3 or more letter+number pairs, 5 or more total numbers, or a length over 16 characters
    // checks Nickname does not contain a hyphen to avoid targeting 'guest-###',
    // then checks Nickname for 3 letter+number pairs, 5 or more total digits, or a length over 24 characters
    // use "!safeadd username" to bypass filter for a specific account
    // other users you assign through CTS as mods with "!modadd username" can contribute to your safelist with !safe.
    function checkStrictViolation(targetUser, targetNick) {
        return (
            targetUser.match(/(?:.*\d.*){5}|(?:.*[a-z]\d|.*\d[a-z]){3}/i) ||
            targetNick.match(/^(?:(?![\w-]*-)[\w-]*\d[\w-]*){5}|(?:.*[a-z]\d|.*\d[a-z]){3}/i) ||
            targetUser.length > 16 ||
            targetNick.length > 24
        );
    }
    // checks that nickname is different from username.
    // checks for username 6 or less characters in length that contains any of the characters K,N,P,U,W, or X
    // paired with a matching nickname that is all lowercase 6 or less characters that is not 'guest'
    // IYKYK
    // use "!safeadd username" to bypass filter for a specific account
    // other users you assign through CTS as mods with "!modadd username" can contribute to your safelist with !safe.
    function checkSuspect(targetUser, targetNick) {
        return (
            targetUser !== targetNick.toUpperCase() &&
            targetUser.length <= 6 &&
            /[knpuwx]/i.test(targetUser) &&
            /^(?!guest$)[a-z]{1,6}$/.test(targetNick)
        );
    }
    
    function alertAndKeyBan(targetHandle, targetUser, targetNick, violationType) {
        Alert(GetActiveChat(), `✓ ${violationType} banned!\nNick: ${targetNick}\nUser: ${targetUser}`);
        Send("ban", targetHandle);
        // Uncomment the following block if you want to send a message with an image "ha gotem" in chat
        // if (violationType === "Suspect") {
        //     Send("msg", 'https://i.imgur.com/6E8lwSH.jpg');
        // }
    }

    function CheckUserWordAbuse() {
        if (CTS.UserList[arguments[0]].handle != CTS.Me.handle && !CTS.UserList[arguments[0]].mod) {
            let action = false, //LETS NOT REPEAT/KICK
            len = CTS.KickKeywordList.length,
            keywordTargetNick = CTS.UserList[arguments[0]].nick,
            keywordTargetUser = CTS.UserList[arguments[0]].username;

            for (let i = 0; i < len; i++) {
                if (arguments[1].includes(CTS.KickKeywordList[i])) {
                    Alert(GetActiveChat(), `✓ KickKeywordList "${CTS.KickKeywordList[i]}"\nNick: ${keywordTargetNick}\nUser: ${keywordTargetUser}`);
                    Send("kick", CTS.UserList[arguments[0]].handle);
                    action = true;
                    break;
                }
            }
            if (!action) {
                len = CTS.BanKeywordList.length;
                for (let i = 0; i < len; i++) {
                    if (arguments[1].includes(CTS.BanKeywordList[i])) {
                        Alert(GetActiveChat(), `✓ BanKeywordList "${CTS.BanKeywordList[i]}"\nNick: ${keywordTargetNick}\nUser: ${keywordTargetUser}`);
                        Send("ban", CTS.UserList[arguments[0]].handle);
                        break;
                    }
                }
            }
        }
    }

    function RemoveUserCamera() {
        let len = CTS.Camera.List.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                if (CTS.Camera.List[i] === arguments[0]) {
                    CTS.Camera.List.splice(i, 1);
                    clearTimeout(CTS.Camera.clearRandom);
                    break;
                }
            }
        }
    }

    function CheckUserStream() {
        let user = HandleToUser(arguments[0]);
        if (user != -1) {
            if (CTS.Me.mod) {
                if (arguments[1]) {
                    //PUSH UPDATE
                    CTS.Camera.List.push(CTS.UserList[user].handle);
                    CTS.UserList[user].broadcasting = true;
                    let len = CTS.Camera.List.length;
                    if (CTS.UserList[user].username !== "GUEST" && !CTS.GreenRoomList.includes(CTS.UserList[user].username)) {
                        CTS.GreenRoomList.push(CTS.UserList[user].username);
                        Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
                    }
                    //CLEAR TIMERS
                    clearTimeout(CTS.Camera.clearRandom);
                    //CAMERA SWEEP FUNCTION
                    if (len >= 12 && CTS.Me.handle === CTS.Host && CTS.Camera.Sweep) {
                        CTS.Camera.clearRandom = setTimeout(function() {
                            let rand = Rand(0, len - 1);
                            if (CTS.Camera.List[rand] !== CTS.Me.handle && CTS.Camera.Sweep) {
                                let target = HandleToUser(CTS.Camera.List[rand]);
                                if (CTS.Me.owner || !CTS.UserList[target].mod) {
                                    Send("msg", "[Camera Clear]\n" + CTS.UserList[target].nick + "!\nYou've been randomly selected. You win, a cam close!");
                                    Send("stream_moder_close", CTS.Camera.List[rand]);
                                    CTS.Camera.List.splice(rand, 1);
                                }
                            }
                        }, CTS.Camera.SweepTimer * 60000);
                    }
                } else {
                    clearTimeout(CTS.Camera.clearRandom);
                    RemoveUserCamera(CTS.UserList[user].handle);
                    CTS.UserList[user].broadcasting = false;
                }
                CTS.UserList[user].broadcasting = arguments[1];
            }
            if (CTS.ScriptInit) AddUserNotification(1, CTS.UserList[user].namecolor, CTS.UserList[user].nick, CTS.UserList[user].username, arguments[1]);
        }
    }

    function CheckUserName() {
        return arguments[0].match(/^(-all|[a-z0-9_]{1,32})$/i);
    }

    function CheckUserNameStrict() {
        return arguments[0].match(/^([a-z0-9_]{1,32})$/i);
    }

    function MSR() {
        if (arguments[0]) {
            arguments[1].videolist.RemoveVideoRemote(arguments[1].handle);
        } else {
            arguments[1].mediaStream.stop();
            arguments[1].mediaStream = null;
        }
    }

    function MS() {
        if (arguments[0].mediaStream !== null) {
            if (arguments[0].mediaStream.active && arguments[1].signalingState !== "closed" && typeof arguments[1].removeStream === "function" && arguments[1].removeStream(arguments[0].mediaStream)) MSR(false, arguments[0]);
        } else {
            MSR(true, arguments[0]);
        }
        if (arguments[1].signalingState !== "closed" && arguments[1].close());
    }
    //LOAD/SAVE FUNCTION
    function Load() {
        let val = localStorage.getItem(CTS.Project.Storage + arguments[0]);
        if (null === val && "undefined" != typeof arguments[1]) {
            Save(arguments[0], arguments[1]);
            return arguments[1];
        }
        return val;
    }

    function Save() {
        if (CTS.StorageSupport) {
            localStorage.setItem(CTS.Project.Storage + arguments[0], arguments[1]);
        } else {
            Alert(GetActiveChat(), "Looks like you don't have LocalStorage allowed on this device!\nYour options will not be saved!");
        }
    }

    //SOCKET FUNCTION
    function CTSWebSocket() {
        if (window.Proxy === undefined) return;
        let handler = {
            set(Target, prop, value) {
                if (prop == "onmessage") {
                    let oldMessage = value;
                    value = function(event) {
                        ServerMsg(JSON.parse(event.data), Target);
                        oldMessage(event);
                    };
                }
                return (Target[prop] = value);
            },
            get(Target, prop) {
                let value = Target[prop];
                if (prop == "send") {
                    value = function(event) {
                        ClientMsg(JSON.parse(event), Target);
                        Target.send(event);
                    };
                } else if (typeof value == 'function') {
                    value = value.bind(Target);
                }
                return value;
            }
        };
        let WebSocketProxy = new window.Proxy(window.WebSocket, {
            construct(Target, args) {
                CTS.SocketTarget = new Target(args[0]);
                debug("SOCKET::CONNECTING", args[0]);
                return new window.Proxy(CTS.SocketTarget, handler);
            }
        });
        window.WebSocket = WebSocketProxy;
    }

    function ModCommand() {
        let name = arguments[1].match(/^!(?:userkick|nickkick|userban|nickban|userclose|nickclose|safeadd|safe) (guest-[0-9]{1,32}|[a-z0-9_]{1,32})$/i),
            target;
        if (name !== null) {
            if (name[1].toUpperCase() !== "GUEST") {               
                target = ((arguments[2]) ? UsernameToUser(name[1].toUpperCase()) : NicknameToUser(name[1].toUpperCase()));
                } else {
                target = NicknameToUser(name[1].toUpperCase());
            }
            // Lets users added to !modadd list by BotHost, add users to their SafeList manually with command !safe USERNAME
            // Will also remove user from BotHost UserBanList if they exist.
            // This is useful when running filters like !strict or !nickkeyadd or !userkeyadd as safelisted users will not be screened
            // Remember to remove banned user from TC room BanList as well and they will be good once refreshed.
            if (arguments[0] === "safe_add_mod") {
                let safeAddUserName = name[1].toUpperCase();
                let index = CTS.UserBanList.indexOf(safeAddUserName);
                if (!CTS.SafeList.includes(safeAddUserName)) {
                    CTS.SafeList.push(safeAddUserName);
                    Save("AKB", JSON.stringify(CTS.SafeList));
                    Alert(GetActiveChat(), `✓ Command Accepted!\nUser: ${safeAddUserName}\nadded to safe list by mod.`);
                    Send("msg", `✓ Command Accepted!\nAdded ${safeAddUserName} to SafeList`);
                } else {
                    Alert(GetActiveChat(), "X Safeadd command by mod rejected!");
                    Send("msg", `X ${safeAddUserName} is already on SafeList!`);
                }
                if (CTS.UserBanList.includes(safeAddUserName)) {
                    CTS.UserBanList.splice(index, 1);
                    Save("UserBanList", JSON.stringify(CTS.UserBanList));
                    debug("USERBANLIST::", "REMOVE USER " + safeAddUserName + " FROM USERBANLIST");
                    Send("msg", "✓ Removed " + safeAddUserName + " from UserBanList!");
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                }
            }
            if (target != -1) { // USER ONLINE
                if (CTS.UserList[target].handle !== CTS.Me.handle && !CTS.BotModList.includes(CTS.UserList[target].username) && !CTS.UserList[target].mod) {
                    //IF USER IS NOT HOST/MODERATOR/JR.MODERATOR
                    if (arguments[0] === "stream_moder_close") {
                        if (CTS.UserList[target].broadcasting) Send(arguments[0], CTS.UserList[target].handle);
                    } else if (arguments[0] !== "safe_add_mod") {
                        Send(arguments[0], CTS.UserList[target].handle);
                    }
                } else {
                    Send("msg", "This users authorization is similar or above yours!");
                }
            }
        }
    }

    function ServerMsg() {
        if (typeof ServerInList[arguments[0].tc] == "function") {
            debug(("SERVER::" + arguments[0].tc.toUpperCase()), arguments[0]);
            ServerInList[arguments[0].tc](arguments[0]);
        }
    }

    function ClientMsg() {
        if (typeof ServerOutList[arguments[0].tc] == "function") {
            debug(("CLIENT::" + arguments[0].tc.toUpperCase()), arguments[0]);
            ServerOutList[arguments[0].tc](arguments[0]);
        }
    }

    function Send() {
        ServerSendList[arguments[0]](arguments[0], arguments[1], arguments[2]);
        if (arguments[1] === undefined) arguments[1] = "Open Request";
        debug(("CLIENT::SEND::" + arguments[0].toUpperCase()), arguments[1]);
    }
    //GAME FUNCTION
    //FISHING BOAT
    function fishUpgradeStatus() {
        let msg = "[FISHING BOAT]\n";
        if (arguments[1] != 7) msg += arguments[0].Nickname.substr(0, 16) + ":\n";
        if (arguments[1] == 0 || arguments[1] == 1) msg += "[NET] Lv. " + arguments[0].Upgrades.Net + "\n" + ((arguments[0].Upgrades.Net >= 10) ? "[MAXED]" : "next upgrade $" + Fish.PriceList(arguments[0], 0)) + "\n\n";
        if (arguments[1] == 0 || arguments[1] == 2) msg += "[RADAR] Lv. " + arguments[0].Upgrades.Radar + "\n" + ((arguments[0].Upgrades.Radar >= 20) ? "[MAXED]" : "next upgrade $" + Fish.PriceList(arguments[0], 1)) + "\n\n";
        if (arguments[1] == 0 || arguments[1] == 3) msg += "[SHOP] Lv. " + arguments[0].Upgrades.Store + "\n" + ((arguments[0].Upgrades.Store >= 6) ? "[MAXED]" : "next upgrade $" + Fish.PriceList(arguments[0], 2)) + "\n\n";
        if (arguments[1] == 0 || arguments[1] == 4) msg += "[INSURANCE]\n" + ((arguments[0].Upgrades.Insurance) ? "✓ PAID" : "$" + Fish.PriceList(arguments[0], 3) + " per ROUND") + "\n\n";
        if (arguments[1] == 6) msg = "[FISHING BOAT]\nCOMMAND LIST:\n!fish (ʲᵒⁱⁿ ᵍᵃᵐᵉ)\n!fishbank (ᶜʰᵉᶜᵏ ᵇᵃˡᵃⁿᶜᵉ)\n!fishsplit user|nick (ˢᵖˡⁱᵗ ᵇᵃˡᵃⁿᶜᵉ)\n!fishgamble ᶜᵒˢᵗ $" + Fish.PriceList(arguments[0], 6) + "\n!fishspin ᶜᵒˢᵗ $" + Fish.PriceList(arguments[0], 6) + "\n!fishrob user|nick ᶜᵒˢᵗ $" + Fish.PriceList(arguments[0], 4) + "\n!fishslap user|nick ᶜᵒˢᵗ $" + Fish.PriceList(arguments[0], 5) + "\n!fishupgrade (ᶜʰᵉᶜᵏ ˢᵗᵃᵗᵘˢ)\n!fishupgrade ⁿᵉᵗ|ʳᵃᵈᵃʳ|ˢʰᵒᵖ|ᴵⁿˢᵘʳᵃⁿᶜᵉ\n";
        if (arguments[1] != 6) msg += `Bank: $${arguments[0].Points}`;
        Send("msg", msg);
    }

    function fishTimerCheck() {
        if (new Date() - arguments[0].LastCheck >= 5000) {
            arguments[0].LastCheck = new Date();
            return true;
        }
        return false;
    }

    function fishCommandCheck(user, command) {
            let playerExist = Fish.GetPlayer(user.handle, false, true),
            FishCommand = command.match(/^!(fish(?:rob|slap|spin|split|help|upgrade)?) ?(?:([a-z0-9_]*)|net|radar|shop|insurance)?$/i);
        if (FishCommand) {
            if (FishCommand[1].toLowerCase() === "fishslap" || FishCommand[1].toLowerCase() === "fishrob" || FishCommand[1].toLowerCase() === "fishsplit") {
                 if (FishCommand[2] !== undefined) {
                    if (typeof FishList[FishCommand[1].toLowerCase()] == "function") FishList[FishCommand[1].toLowerCase()](playerExist, FishCommand[2]);
                }
            } else if (FishCommand[1].toLowerCase() === "fishspin") { {
                let lines = /[2-8]$/.test(FishCommand[2]) ? parseInt(FishCommand[2]) : 1;
                if (typeof FishList[FishCommand[1].toLowerCase()] == "function") FishList[FishCommand[1].toLowerCase()](playerExist, lines);
                } 
            } else {
                try {
                    command = ((FishCommand[2] !== undefined) ? FishCommand[1] + FishCommand[2] : FishCommand[1]);
                    if (typeof FishList[command.toLowerCase()] == "function") FishList[command.toLowerCase()](playerExist, user);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
    

    function fishTransfer() {
        if (arguments[1] !== undefined && arguments[1] !== -1) {
            if (arguments[0].Points > arguments[2]) {
                if (arguments[4]) {
                    arguments[0].Points -= arguments[2];
                    arguments[1].Points -= arguments[3];
                    arguments[0].Points += arguments[3];
                    Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname.substr(0, 14)}... paid $${arguments[2]} to ROB ${arguments[1].Nickname.substr(0, 14)} for $${arguments[3]}.\n\nBank:\n${arguments[0].Nickname.substr(0, 14)}...$${arguments[0].Points}\n${arguments[1].Nickname.substr(0, 14)}...$${arguments[1].Points}`);
                } else {
                    arguments[0].Points = arguments[3];
                    arguments[1].Points += arguments[3];
                    //Send("msg", "[FISHING BOAT]\n" + arguments[0].Nickname + " split their money with " + arguments[1].Nickname + "!");
                    Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname.substr(0,14)}... SPLIT half their money.\n\nBank:\n${arguments[0].Nickname.substr(0,14)}...$${arguments[0].Points}\n${arguments[1].Nickname.substr(0,14)}...$${arguments[1].Points}`);
                }
            } else {
                //Send("msg", "[FISHING BOAT]\n" + arguments[0].Nickname + " are you kidding me?\nTalk to me when you have money!");
                Send("msg", `[FISHING BOAT]\n ${arguments[0].Nickname.substr(0, 16)}...\nToo Poor! Cost: $${arguments[2]}\n\nBank: $${arguments[0].Points}`);
            }
        }
    }

    function fishTransaction() {
        if (arguments[0].Points > arguments[1]) {
            arguments[0].Points -= arguments[1];
            return true;
        } else {
            //Send("msg", `[FISHING BOAT]\n ${arguments[0].Nickname}, are you kidding me?\nTalk to me when you have money!`);
            Send("msg", `[FISHING BOAT]\n ${arguments[0].Nickname.substr(0, 16)}...\nToo Poor! Cost: $${arguments[1]}\n\nBank: $${arguments[0].Points}`);
            //Bank: $${arguments[0].Points}
            return false;
        }
    }

    // Calculate the result of the spin and determine winnings
    function calculateSpinResult(slots, lines) {
        let winnings = 0,
        rowSlotsTop = [slots[0], slots[1], slots[2]],
        rowSlotsMid = [slots[3], slots[4], slots[5]],
        rowSlotsBot = [slots[6], slots[7], slots[8]],
        colSlotsLeft = [slots[0], slots[3], slots[6]],
        colSlotsMid = [slots[1], slots[4], slots[7]],
        colSlotsRight = [slots[2], slots[5], slots[8]],
        diagSlotsLtopRbot = [slots[0], slots[4], slots[8]],
        diagSlotsRtopLbot = [slots[2], slots[4], slots[6]];
        if (lines > 0) winnings += calculateRowResult(rowSlotsMid);
        if (lines > 1) winnings += calculateRowResult(rowSlotsBot);
        if (lines > 2) winnings += calculateRowResult(rowSlotsTop);
        if (lines > 3) winnings += calculateRowResult(colSlotsMid);
        if (lines > 4) winnings += calculateRowResult(colSlotsLeft);
        if (lines > 5) winnings += calculateRowResult(colSlotsRight);
        if (lines > 6) winnings += calculateRowResult(diagSlotsLtopRbot);
        if (lines > 7) winnings += calculateRowResult(diagSlotsRtopLbot);

        return winnings;
    }
    
    // Calculate the result of a single row
    function calculateRowResult(rowSlots) {
        let winnings = 0;
      
        if (rowSlots[0] === rowSlots[1] && rowSlots[0] === rowSlots[2]) { // 3 matching emojis
            switch (rowSlots[0]) {
                case "🐠":
                    winnings = 40000; // Payout for 3 "🐠" emojis 
                    break;
                case "🛟":
                    winnings = 50000; // Payout for 3 "🛟" emojis
                    break;
                case "🐡":
                    winnings = 60000; // Payout for 3 "🐡" emojis
                    break;
                case "🐬":
                    winnings = 70000; // Payout for 3 "🐬" emojis
                    break;
                case "🦈":
                    winnings = 80000; // Payout for 3 "🦈" emojis
                    break;
                case "🐋":
                    winnings = 90000; // Payout for 3 "🐋" emojis
                    break;
                case "🐉":
                    winnings = 100000; // Payout for 3 "🐉" emojis
                    break;
                case "🧜‍♀️":
                    winnings = 125000; // Payout for 3 "🧜‍♀️" emojis
                    break;
                case "🍒":
                    winnings = 200000; // Payout for 3 "🍒" emojis
                    break;
            }
        } else if ((rowSlots[0] === rowSlots[1] || rowSlots[0] === rowSlots[2] || rowSlots[1] === rowSlots[2]) && rowSlots.includes("🍒")) {
            // Payout for 2 of a kind + cherry emoji
            let matchingSlot = ((rowSlots[0] === rowSlots[1] || rowSlots[0] === rowSlots[2]) ? rowSlots[0] : rowSlots[1]);
            
            switch (matchingSlot) {
                case "🐠":
                    winnings = 20000;
                    break;
                case "🛟":
                    winnings = 25000;
                    break;
                case "🐡":
                    winnings = 30000;
                    break;
                case "🐬":
                    winnings = 35000;
                    break;
                case "🦈":
                    winnings = 40000;
                    break;
                case "🐋":
                    winnings = 45000;
                    break;
                case "🐉":
                    winnings = 50000;
                    break;
                case "🧜‍♀️":
                    winnings = 55000;
                    break;
                case "🍒": //payout for 2 cherries + other emoji
                    winnings = 30000;
                    break;
            }
        } else if (rowSlots.includes("🍒")) {
            // Payout for 1 cherry
            winnings = 5000;
        }
      
        return winnings;
    }
    
    //SERVER/CLIENT LIST FUNCTION
    const CommandList = {
        cts() {
            Alert(GetActiveChat(), `
                <b style="color:#ffffff;"><u>Owner Commands:</u></b>
                !raid <b style="color:#ffff00;">tc link</b>
                !closeall
                !kickall
                !version
    
                <b style="color:#ffffff;"><u>Moderator Commands:</u></b>
                !whoisbot
                !bot
                !bottoggle
                !greenroomtoggle
                !publiccommandtoggle
                !camsweep <b style="color:#ffff00;">5 - 30</b>
                !votetoggle
                !autokick *be careful!*
                !autoban *be careful!*
                !strict
                !spamban
                !short (short cmd list)
    
                !userbanlist
                !userbanlistclear
                !userbanadd <b style="color:#ffff00;">user</b>
                !userbanremove <b style="color:#ffff00;">#</b>
    
                !nickbanlist
                !nickbanlistclear
                !nickbanadd <b style="color:#ffff00;">nick</b>
                !nickbanremove <b style="color:#ffff00;">#</b>
    
                !bankeywordlist
                !bankeywordlistclear
                !bankeywordadd <b style="color:#ffff00;">keyword | phrase</b>
                !bankeywordremove <b style="color:#ffff00;">#</b>
    
                !userkicklist
                !userkicklistclear
                !userkickadd <b style="color:#ffff00;">user</b>
                !userkickremove <b style="color:#ffff00;">#</b>
    
                !nickkicklist
                !nickkicklistclear
                !nickkickadd <b style="color:#ffff00;">nick</b>
                !nickkickremove <b style="color:#ffff00;">#</b>
    
                !kickkeywordlist
                !kickkeywordlistclear
                !kickkeywordadd <b style="color:#ffff00;">keyword | phrase</b>
                !kickkeywordremove <b style="color:#ffff00;">#</b>
    
                !userkeylist
                !userkeylistclear
                !userkeyadd <b style="color:#ffff00;">keyword</b>
                !userkeyremove <b style="color:#ffff00;">#</b>
    
                !nickkeylist
                !nickkeylistclear
                !nickkeyadd <b style="color:#ffff00;">keyword</b>
                !nickkeyremove <b style="color:#ffff00;">#</b>
    
                !modlist
                !modlistclear
                !modadd <b style="color:#ffff00;">user</b>
                !modremove <b style="color:#ffff00;">#</b>
    
                <b style="color:#ffffff;"><u>Jr. Moderator Commands:</u></b>
                !userban <b style="color:#ffff00;">user</b>
                !nickban <b style="color:#ffff00;">nick</b>
                !userkick <b style="color:#ffff00;">user</b>
                !nickkick <b style="color:#ffff00;">nick</b>
                !userclose <b style="color:#ffff00;">user</b>
                !nickclose <b style="color:#ffff00;">nick</b>
    
                <b style="color:#ffffff;"><u>User Commands:</u></b>
                !fps <b style="color:#ffff00;">1 - 60</b>
    
                !mentionlist
                !mentionlistclear
                !mentionadd <b style="color:#ffff00;">keyword</b>
                !mentionremove <b style="color:#ffff00;">#</b>
    
                !ignorelist
                !ignorelistclear
                !ignoreadd <b style="color:#ffff00;">user</b>
                !ignoreremove <b style="color:#ffff00;">#</b>
    
                !hiddencameralist
                !hiddencameralistclear
                !hiddencameraadd <b style="color:#ffff00;">user</b>
                !hiddencameraremove <b style="color:#ffff00;">#</b>
    
                !greetlist
                !greetlistclear
                !greetadd <b style="color:#ffff00;">user | -all</b>
                !greetremove <b style="color:#ffff00;">#</b>
    
                !highlightlist
                !highlightlistclear
                !highlightadd <b style="color:#ffff00;">user</b>
                !highlightremove <b style="color:#ffff00;">#</b>
    
                !reminderlist
                !reminderlistclear
                !reminderadd <b style="color:#ffff00;">user</b>
                !reminderremove <b style="color:#ffff00;">#</b>
                !remindertoggle
    
                !safelist
                !safelistclear
                !safeadd <b style="color:#ffff00;">user</b>
                !saferemove <b style="color:#ffff00;">#</b>
    
                !greenroomlist
                !greenroomlistclear
                !greenroomadd <b style="color:#ffff00;">user</b>
                !greenroomremove <b style="color:#ffff00;">#</b>
    
                !greenroomignorelist
                !greenroomignorelistclear
                !greenroomignoreadd <b style="color:#ffff00;">user</b>
                !greenroomignoreremove <b style="color:#ffff00;">#</b>
    
                !userlist
    
                !lists
                !listsclear
    
                !greetmodetoggle
                !imgurtoggle
                !raidtoggle
                !avatartoggle
                !notificationtoggle <b style="color:#ffff00;"></b>
                !popuptoggle
                !soundmetertoggle
                !timestamptoggle
    
                !coin
                !advice
                !8ball <b style="color:#ffff00;">question</b>
                !roll <b style="color:#ffff00;">#</b>
                !chuck
                !dad
                !dark
    
                !vote <b style="color:#ffff00;">user</b>
    
                !clrall
                !clr
                !settings
                !share
    
                <b style="color:#ffffff;"><u>Game Commands:</u></b>
                !gameview *hide game msg*
                
                !triviahost
                !trivia
                !triviahelp

                !triviaplayerlist
                !triviaplayerlistclear
                !triviaplayeradd <b style="color:#ffff00;">user</b>
                !triviaplayerremove <b style="color:#ffff00;">#</b>

                !fishhost
                !fish
                !fishhelp

                !wordlehost
                !wordle
                !wordlehelp
                !wordlereset <b style="color:#ffff00;">
                (!modadd to give reset ability.)</b>
            `);
        },
        help() {
            this.cts();
        },
        short() {
            Alert(GetActiveChat(), `
                <b style="color:#ffffff;"><u>Short Commands:</u></b>

                <b style="color:#ffffff;">UserBanList:</b>
                !uba (add)
                !ubr (remove)
                !ubl (list)

                <b style="color:#ffffff;">SafeList:</b>
                !sa (add)
                !sr (remove)
                !sl (list)

                <b style="color:#ffffff;">NickKeyList:</b>
                !nky (add)
                !nkyr (remove)
                !nkyl (list)

                <b style="color:#ffffff;">UserKeyList:</b>
                !uky (add)
                !ukyr (remove)
                !ukyl (list)
                
                <b style="color:#ffffff;">Bye & Undo:</b>
                !b
                !bye
                <b style="color:#ffff00;">!userbanadd' latest user to join</b>
                !undo
                <b style="color:#ffff00;">-Remove last user UserBanList
                +Add user to SafeList</b>
                
                !nba (nickbanadd)
                !uka (userkickadd)

                <b style="color:#ffffff;">BanKeywordList:</b>
                !bka (add)
                !bkr (remove)
                !bkl (list)

                <b style="color:#ffffff;">IgnoreList:</b>
                !ia (add)
                !ir (remove)
                !il (list)
                !ilc (listclear)

                !hide (hiddencameraadd)

                <b style="color:#ffffff;">GreenRoomIgnoreList:</b>
                !gria (add)
                !grir (remove)
                !gril  (list)
                !grilc  (listclear)

                <b style="color:#ffffff;">TriviaPlayerList:</b>
                !tpa (add)
                !tpr (remove)
                !tpl (list)
    
                <b style="color:#ffffff;"><u>Short Toggle Commands:</u></b>
                !img (imgur)
                !pct (publiccommand)
                !put (popup)
                !gmt (greetmode)
                !grt (greenroom)
                !smt (soundmeter)
                !bt (bottoggle)
                !rt  (reminder)
                !nt (notification)
            `);
        },
        userlist() {
            Alert(GetActiveChat(), SettingsList.UserList());
        },
        fps() {
            CTS.FPS = (arguments[0] === "" || isNaN(arguments[0])) ? 30 : (arguments[0] > 60) ? 60 : (arguments[0] < 1) ? 1 : parseInt(arguments[0]);
            Save("FPS", CTS.FPS);
            Alert(GetActiveChat(), "✓ Command Accepted!");
            if (CTS.Me.broadcasting) Alert(GetActiveChat(), "Settings will not change until you re-cam!");
        },
        mentionadd(value) {
            if (!value) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                let uppercasedValue = value.toUpperCase();
                if (CheckUserNameStrict(uppercasedValue)) {
                    if (!CTS.MentionList.includes(uppercasedValue)) {
                        CTS.MentionList.push(uppercasedValue);
                        Save("MentionList", JSON.stringify(CTS.MentionList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
    
        mentionremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.MentionList[arguments[0]] !== undefined) {
                    CTS.MentionList.splice(arguments[0], 1);
                    Save("MentionList", JSON.stringify(CTS.MentionList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        mentionlistclear() {
            CTS.MentionList = [];
            Save("MentionList", JSON.stringify(CTS.MentionList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        mentionlist() {
            Alert(GetActiveChat(), SettingsList.MentionList());
        },
        hiddencameraadd() {
            if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.HiddenCameraList.includes(arguments[0].toUpperCase())) {
                        CTS.HiddenCameraList.push(arguments[0].toUpperCase());
                        Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !hide  short input for !hiddencameraadd
        hide() {
            this.hiddencameraadd(arguments[0]);
        },
        hiddencameraremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.HiddenCameraList[arguments[0]] !== undefined) {
                    CTS.HiddenCameraList.splice(arguments[0], 1);
                    Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        hiddencameralistclear() {
            CTS.HiddenCameraList = [];
            Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        hiddencameralist() {
            Alert(GetActiveChat(), SettingsList.HiddenCameraList());
        },
        ignoreadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.IgnoreList.includes(arguments[0].toUpperCase())) {
                        CTS.IgnoreList.push(arguments[0].toUpperCase());
                        Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !ia short input for !ignoreadd.
        ia() {
            this.ignoreadd(arguments[0]);
        },
        ignoreremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.IgnoreList[arguments[0]] !== undefined) {
                    CTS.IgnoreList.splice(arguments[0], 1);
                    Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !ir short input for !ignoreremove
        ir() {
            this.ignoreremove(arguments[0]);
        },
        ignorelistclear() {
            CTS.IgnoreList = [];
            Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        // !ilc short input for !ignorelistclear
        ilc() {
            this.ignorelistclear();
        },
        ignorelist() {
            Alert(GetActiveChat(), SettingsList.IgnoreList());
        },
        // !il short input for !ignorelist
        il() {
            this.ignorelist();
        },
        userbanadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.UserBanList.includes(arguments[0].toUpperCase())) {
                        CTS.UserBanList.push(arguments[0].toUpperCase());
                        Save("UserBanList", JSON.stringify(CTS.UserBanList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                        let check = UsernameToHandle(arguments[0].toUpperCase());
                        if (check != -1 && CTS.Me.mod) Send("ban", check);
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !uba short input for !userbanadd
        uba() {
            this.userbanadd(arguments[0]);
        },
        //type !bye to auto !userbanadd the last member to join the room, they must still be in the room.
        bye() {
            let lastUser = CTS.UserList.at(-1).username;
            Alert(GetActiveChat(), `✓ Added ${lastUser} to UserBanList!`);
            this.userbanadd(lastUser);
        },
        //type !b to auto !userbanadd the last member to join the room, they must still be in the room.
        b() {
            this.bye();
        },
        userbanremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.UserBanList[arguments[0]] !== undefined) {
                    CTS.UserBanList.splice(arguments[0], 1);
                    Save("UserBanList", JSON.stringify(CTS.UserBanList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !ubr short input for !userbanremove
        ubr() {
            this.userbanremove(arguments[0]);
        },
        // !undo to remove last user on userbanlist & add them to safelist
        undo() {
            let userBanListNumber = CTS.UserBanList.length - 1;
            Alert(GetActiveChat(), `✓ Removed ${CTS.UserBanList[userBanListNumber]} from UserBanList!\n✓ Added to SafeList!`);
            this.safeadd(CTS.UserBanList[userBanListNumber]);
            this.userbanremove(userBanListNumber);
        },
        userbanlistclear() {
            CTS.UserBanList = [];
            Save("UserBanList", JSON.stringify(CTS.UserBanList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        userbanlist() {
            Alert(GetActiveChat(), SettingsList.UserBanList());
        },
        // !ubl short input for !userbanlist
        ubl() {
            this.userbanlist();
        },
        nickbanadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.NickBanList.includes(arguments[0].toUpperCase())) {
                        CTS.NickBanList.push(arguments[0].toUpperCase());
                        Save("NickBanList", JSON.stringify(CTS.NickBanList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                        let check = NicknameToHandle(arguments[0].toUpperCase());
                        if (check != -1 && CTS.Me.mod) Send("ban", check);
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !nba short input for !nickbanadd
        nba() {
            this.nickbanadd(arguments[0]);
        },
        nickbanremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.NickBanList[arguments[0]] !== undefined) {
                    CTS.NickBanList.splice(arguments[0], 1);
                    Save("NickBanList", JSON.stringify(CTS.NickBanList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        nickbanlistclear() {
            CTS.NickBanList = [];
            Save("NickBanList", JSON.stringify(CTS.NickBanList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        nickbanlist() {
            Alert(GetActiveChat(), SettingsList.NickBanList());
        },
        userkickadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.UserKickList.includes(arguments[0].toUpperCase())) {
                        CTS.UserKickList.push(arguments[0].toUpperCase());
                        Save("UserKickList", JSON.stringify(CTS.UserKickList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                        let check = UsernameToHandle(arguments[0].toUpperCase());
                        if (check != -1 && CTS.Me.mod) Send("kick", check);
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !uka short input for !userkickadd
        uka() {
            this.userkickadd(arguments[0]);
        },
        userkickremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.UserKickList[arguments[0]] !== undefined) {
                    CTS.UserKickList.splice(arguments[0], 1);
                    Save("UserKickList", JSON.stringify(CTS.UserKickList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        userkicklistclear() {
            CTS.UserKickList = [];
            Save("UserKickList", JSON.stringify(CTS.UserKickList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        userkicklist() {
            Alert(GetActiveChat(), SettingsList.UserKickList());
        },
        nickkickadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.NickKickList.includes(arguments[0].toUpperCase())) {
                        CTS.NickKickList.push(arguments[0].toUpperCase());
                        Save("NickKickList", JSON.stringify(CTS.NickKickList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                        let check = NicknameToHandle(arguments[0].toUpperCase());
                        if (check != -1 && CTS.Me.mod) Send("kick", check);
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        nickkickremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.NickKickList[arguments[0]] !== undefined) {
                    CTS.NickKickList.splice(arguments[0], 1);
                    Save("NickKickList", JSON.stringify(CTS.NickKickList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        nickkicklistclear() {
            CTS.NickKickList = [];
            Save("NickKickList", JSON.stringify(CTS.NickKickList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        nickkicklist() {
            Alert(GetActiveChat(), SettingsList.NickKickList());
        },
        userkeyadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (!CTS.UserKeyBanList.includes(arguments[0].toUpperCase())) {
                    CTS.UserKeyBanList.push(arguments[0].toUpperCase());
                    Save("UserKeyBanList", JSON.stringify(CTS.UserKeyBanList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                }
            }
        },
        // !uky short input for !userkeyadd
        uky() {
            this.userkeyadd(arguments[0]);
        },
        userkeyremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.UserKeyBanList[arguments[0]] !== undefined) {
                    CTS.UserKeyBanList.splice(arguments[0], 1);
                    Save("UserKeyBanList", JSON.stringify(CTS.UserKeyBanList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !ukyr short input for !userkeyremove
        ukyr() {
            this.userkeyremove(arguments[0]);
        },
        userkeylistclear() {
            CTS.UserKeyBanList = [];
            Save("UserKeyBanList", JSON.stringify(CTS.UserKeyBanList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        userkeylist() {
            Alert(GetActiveChat(), SettingsList.UserKeyBanList());
        },
        // !ukyl short input for !userkeylist
        ukyl() {
            this.userkeylist();
        },
        nickkeyadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (!CTS.NickKeyBanList.includes(arguments[0].toUpperCase())) {
                    CTS.NickKeyBanList.push(arguments[0].toUpperCase());
                    Save("NickKeyBanList", JSON.stringify(CTS.NickKeyBanList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                }
            }
        },
        // !nky short input for !nickkeyadd
        nky() {
            this.nickkeyadd(arguments[0]);
        },
        nickkeyremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.NickKeyBanList[arguments[0]] !== undefined) {
                    CTS.NickKeyBanList.splice(arguments[0], 1);
                    Save("NickKeyBanList", JSON.stringify(CTS.NickKeyBanList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !nkyr short input for !nickkeyremove
        nkyr() {
            this.nickkeyremove(arguments[0]);
        },
        nickkeylistclear() {
            CTS.NickKeyBanList = [];
            Save("NickKeyBanList", JSON.stringify(CTS.NickKeyBanList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        nickkeylist() {
            Alert(GetActiveChat(), SettingsList.NickKeyBanList());
        },
        // !nkyl short input for !nickkeylist
        nkyl() {
            this.nickkeylist();
        },
        bankeywordadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (!CTS.BanKeywordList.includes(arguments[0])) {
                    CTS.BanKeywordList.push(arguments[0]);
                    Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                }
            }
        },
        // !bka short input for !bankeywordadd
        bka() {
            this.bankeywordadd(arguments[0]);
        },
        bankeywordremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.BanKeywordList[arguments[0]] !== undefined) {
                    CTS.BanKeywordList.splice(arguments[0], 1);
                    Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !bkr short input for !bankeywordremove
        bkr() {
            this.bankeywordremove(arguments[0]);
        },
        bankeywordlistclear() {
            CTS.BanKeywordList = [];
            Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        bankeywordlist() {
            Alert(GetActiveChat(), SettingsList.BanKeywordList());
        },
        // !bkl short input for !bankeywordlist
        bkl() {
            this.bankeywordlist();
        },
        kickkeywordadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (!CTS.KickKeywordList.includes(arguments[0])) {
                    CTS.KickKeywordList.push(arguments[0]);
                    Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                }
            }
        },
        kickkeywordremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.KickKeywordList[arguments[0]] !== undefined) {
                    CTS.KickKeywordList.splice(arguments[0], 1);
                    Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        kickkeywordlistclear() {
            CTS.KickKeywordList = [];
            Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        kickkeywordlist() {
            Alert(GetActiveChat(), SettingsList.KickKeywordList());
        },
        greetadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserName(arguments[0])) {
                    if (!CTS.GreetList.includes(arguments[0].toUpperCase())) {
                        CTS.GreetList.push(arguments[0].toUpperCase());
                        Save("GreetList", JSON.stringify(CTS.GreetList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        greetremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.GreetList[arguments[0]] !== undefined) {
                    CTS.GreetList.splice(arguments[0], 1);
                    Save("GreetList", JSON.stringify(CTS.GreetList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        greetlistclear() {
            CTS.GreetList = [];
            Save("GreetList", JSON.stringify(CTS.GreetList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        greetlist() {
            Alert(GetActiveChat(), SettingsList.GreetList());
        },
        highlightadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.HighlightList.includes(arguments[0].toUpperCase())) {
                        CTS.HighlightList.push(arguments[0].toUpperCase());
                        Save("HighlightList", JSON.stringify(CTS.HighlightList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        highlightremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.HighlightList[arguments[0]] !== undefined) {
                    CTS.HighlightList.splice(arguments[0], 1);
                    Save("HighlightList", JSON.stringify(CTS.HighlightList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        highlightlistclear() {
            CTS.HighlightList = [];
            Save("HighlightList", JSON.stringify(CTS.HighlightList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        highlightlist() {
            Alert(GetActiveChat(), SettingsList.HighlightList());
        },
        modadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.BotModList.includes(arguments[0].toUpperCase())) {
                        CTS.BotModList.push(arguments[0].toUpperCase());
                        Save("BotModList", JSON.stringify(CTS.BotModList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nItem is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        modremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.BotModList[arguments[0]] !== undefined) {
                    CTS.BotModList.splice(arguments[0], 1);
                    Save("BotModList", JSON.stringify(CTS.BotModList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        modlistclear() {
            CTS.BotModList = [];
            Save("BotModList", JSON.stringify(CTS.BotModList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        modlist() {
            Alert(GetActiveChat(), SettingsList.BotModList());
        },
        reminderadd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                let reminder = arguments[0].match(/^((?:1[0-2]|0?[1-9]):(?:[0-5][0-9]) ?(?:am|pm)) ([\w\d\s|[^\x00-\x7F]*]*)/i);
                if (reminder === null) {
                    Alert(GetActiveChat(), "X Command Rejected!\n!reminderadd 4:18 PM This is an example you can try!");
                } else {
                    CTS.ReminderList.push([reminder[1], reminder[2]]);
                    Save("ReminderList", JSON.stringify(CTS.ReminderList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                    Reminder();
                }
            }
        },
        reminderremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.ReminderList[arguments[0]] !== undefined) {
                    CTS.ReminderList.splice(arguments[0], 1);
                    Save("ReminderList", JSON.stringify(CTS.ReminderList));
                    Reminder();
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        reminderlistclear() {
            CTS.ReminderList = [];
            Save("ReminderList", JSON.stringify(CTS.ReminderList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        reminderlist() {
            Alert(GetActiveChat(), SettingsList.ReminderList());
        },
        remindertoggle() {
            CTS.Reminder = !CTS.Reminder;
            Save("Reminder", JSON.stringify(CTS.Reminder));
            Reminder();
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Reminder) ? "Reminders are now on!\n" : "Reminders are now off!\n "));
        },
        // !rt short input for !remindertoggle
        rt() {
            this.remindertoggle();
        },
        soundmetertoggle() {
            CTS.SoundMeterToggle = !CTS.SoundMeterToggle;
            Save("SoundMeterToggle", JSON.stringify(CTS.SoundMeterToggle));
            SoundMeter();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.SoundMeterToggle) ? "Sound meter is now on!\n" : "Sound meter is now off!\n "));
        },
        // !smt short input for !soundmetertoggle
        smt() {
            this.soundmetertoggle();
        },
        timestamptoggle() {
            CTS.TimeStampToggle = !CTS.TimeStampToggle;
            Save("TimeStampToggle", JSON.stringify(CTS.TimeStampToggle));
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.TimeStampToggle) ? "Timestamps are now on!\n" : "Timestamps are now off\n "));
            LoadMessage();
        },
        raidtoggle() {
            CTS.RaidToggle = !CTS.RaidToggle;
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.RaidToggle) ? "You'll listen for raid call by room owners!\n" : "You've temporarily silenced raids!\n"));
        },
        safeadd() {
            if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") { // Can't protect guests;
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.SafeList.includes(arguments[0].toUpperCase())) {
                        CTS.SafeList.push(arguments[0].toUpperCase());
                        Save("AKB", JSON.stringify(CTS.SafeList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nUser is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !sa short input for !safeadd
        sa() {
            this.safeadd(arguments[0]);
        },
        saferemove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.SafeList[arguments[0]] !== undefined) {
                    CTS.SafeList.splice(arguments[0], 1);
                    Save("AKB", JSON.stringify(CTS.SafeList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !sr short input for !saferemove
        sr() {
            this.saferemove(arguments[0]);
        },
        safelistclear() {
            CTS.SafeList = [];
            Save("AKB", JSON.stringify(CTS.SafeList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        safelist() {
            Alert(GetActiveChat(), SettingsList.SafeList());
        },
        // !sl short input for !safelist
        sl() {
            this.safelist();
        },
        greenroomadd() {
            if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") { // Can't protect guests;
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.GreenRoomList.includes(arguments[0].toUpperCase())) {
                        CTS.GreenRoomList.push(arguments[0].toUpperCase());
                        Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nUser is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        greenroomremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.GreenRoomList[arguments[0]] !== undefined) {
                    CTS.GreenRoomList.splice(arguments[0], 1);
                    Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        greenroomlistclear() {
            CTS.GreenRoomList = [];
            Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        greenroomlist() {
            Alert(GetActiveChat(), SettingsList.GreenRoomList());
        },
        greenroomignoreadd() {
            if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") { // Can't protect guests;
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CheckUserNameStrict(arguments[0])) {
                    if (!CTS.GreenRoomIgnoreList.includes(arguments[0].toUpperCase())) {
                        CTS.GreenRoomIgnoreList.push(arguments[0].toUpperCase());
                        Save("GreenRoomIgnoreList", JSON.stringify(CTS.GreenRoomIgnoreList));
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nUser is already entered!");
                    }
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nArgument passed didn't match criteria!");
                }
            }
        },
        // !gria short input for !greenroomignoreadd
        gria() {
            this.greenroomignoreadd(arguments[0]);
        },
        greenroomignoreremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                if (CTS.GreenRoomIgnoreList[arguments[0]] !== undefined) {
                    CTS.GreenRoomIgnoreList.splice(arguments[0], 1);
                    Save("GreenRoomIgnoreList", JSON.stringify(CTS.GreenRoomIgnoreList));
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !grir short input for !greenroomignoreremove
        grir() {
            this.greenroomignoreremove(arguments[0]);
        },
        greenroomignorelistclear() {
            CTS.GreenRoomIgnoreList = [];
            Save("GreenRoomIgnoreList", JSON.stringify(CTS.GreenRoomIgnoreList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        // !grilc short input for !greenroomignorelistclear
        grilc() {
            this.greenroomignorelistclear();
        },
        greenroomignorelist() {
            Alert(GetActiveChat(), SettingsList.GreenRoomIgnoreList());
        },
        // !gril short input for !greenroomignorerlist
        gril() {
            this.greenroomignorelist();
        },
        avatartoggle() {
            CTS.Avatar = !CTS.Avatar;
            Save("Avatar", JSON.stringify(CTS.Avatar));
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Avatar) ? "Avatars from now on will be visible!\n " : "Avatars from now on will hidden!\n"));
            LoadMessage();
        },
        popuptoggle() {
            CTS.Popups = !CTS.Popups;
            Save("Popups", JSON.stringify(CTS.Popups));
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Popups) ? "Popups from now on will be visible!\n " : "Popups from now on will hidden!\n"));
        },
        // !put short input for !popuptoggle
        put() {
            this.popuptoggle();
        },
        notificationtoggle() {
            CTS.NotificationToggle++;
            if (CTS.NotificationToggle >= 3) CTS.NotificationToggle = 0;
            Save("NotificationToggle", JSON.stringify(CTS.NotificationToggle));
            NotificationDisplay();
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\nNotifications " + ((CTS.NotificationToggle == 0) ? "above chat enabled" : (CTS.NotificationToggle == 1) ? "in chat enabled" : "disabled") + ".");
        },
        // !nt short input for !notificationtoggle
        nt() {
            this.notificationtoggle();
        },
        greetmodetoggle() {
            CTS.GreetMode = !CTS.GreetMode;
            Save("GreetMode", JSON.stringify(CTS.GreetMode));
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.GreetMode) ? "Server like greet is enabled." : "Server like greet is disabled."));
        },
        // !gmt short input for !greetmodetoggle
        gmt() {
            this.greetmodetoggle();
        },
        imgurtoggle() {
            CTS.Imgur = !CTS.Imgur;
            Save("Imgur", JSON.stringify(CTS.Imgur));
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Imgur) ? "Imgur preview is enabled." : "Imgur preview is disabled."));
        },
        // !img short input for !imgurtoggle
        img() {
            this.imgurtoggle();
        },
        publiccommandtoggle() {
            CTS.PublicCommandToggle = !CTS.PublicCommandToggle;
            Save("PublicCommandToggle", JSON.stringify(CTS.PublicCommandToggle));
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.PublicCommandToggle) ? "Public commands (8Ball, Advice, Chuck, Coin, Dad, Dark, Urb) are enabled." : "Public commands (8Ball, Advice, Chuck, Coin, Dad, Dark, Urb) are disabled."));
        },
        // !pct short input for !publiccommandtoggle
        pct() {
            this.publiccommandtoggle();
        },
        greenroomtoggle() {
            CTS.GreenRoomToggle = !CTS.GreenRoomToggle;
            Save("GreenRoomToggle", JSON.stringify(CTS.GreenRoomToggle));
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.GreenRoomToggle) ? "Green Room Auto Allow ON!" : "Green Room Auto Allow OFF!"));
        },
        // !grt short input for !greenroomtoggle
        grt() {
            this.greenroomtoggle();
        },
        strict() {
            CTS.Strict = !CTS.Strict;
            Save("Strict", JSON.stringify(CTS.Strict));
            Alert(GetActiveChat(), "Command Accepted!\n" + ((CTS.Strict) ? "STRICT IS NOW ON!\nUse !safeadd <b style=\"color:#ffff00;\">username</b>\nto safelist a user." : "STRICT IS NOW OFF!"));
        },
        spamban() {
            CTS.SpamBan = !CTS.SpamBan;
            Save("SpamBan", JSON.stringify(CTS.SpamBan));
            Alert(GetActiveChat(), "Command Accepted!\n" + ((CTS.SpamBan) ? "SPAMBAN IS NOW ON!" : "SPAMBAN IS NOW OFF!"));
        },
        clr() {
            CTS.Message[GetActiveChat()] = [];
            ChatLogElement.querySelector("#cts-chat-content").innerHTML = "";
        },
        clrall() {
            CTS.Message = [];
            CTS.Message[0] = [];
            window.TinychatApp.getInstance().defaultChatroom._chatlog.items = [];
            ChatLogElement.querySelector("#cts-chat-content").innerHTML = "";
        },
        autokick() {
            if (arguments[1] === false && CTS.Me.mod) {
                CTS.AutoKick = !CTS.AutoKick;
                CTS.AutoBan = false;
                Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.AutoKick) ? "AUTO KICK IS NOW ON!" : "AUTO KICK IS NOW OFF!"));
                if (CTS.AutoKick === true) CheckUserListSafe("kick");
            }
        },
        autoban() {
            if (arguments[1] === false && CTS.Me.mod) {
                CTS.AutoBan = !CTS.AutoBan;
                CTS.AutoKick = false;
                Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.AutoBan) ? "AUTO BAN IS NOW ON!" : "AUTO BAN IS NOW OFF!"));
                if (CTS.AutoBan === true) CheckUserListSafe("ban");
            }
        },
        camsweep() {
            if (CTS.Me.mod && CTS.Host === CTS.Me.handle) {
                CTS.Camera.SweepTimer = (arguments[0] === "" || isNaN(arguments[0])) ? 5 : (arguments[0] > 30) ? 30 : (arguments[0] < 1) ? 1 : parseInt(arguments[0]);
                CTS.Camera.Sweep = !CTS.Camera.Sweep;
                clearTimeout(CTS.Camera.clearRandom);
                Settings();
                Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Camera.Sweep) ? "Camera sweep is now on!\nTime set: " + CTS.Camera.SweepTimer + "min(s)" : "Camera sweep is now off!"));
            }
        },
        bottoggle() {
            CTS.Bot = !CTS.Bot;
            Save("Bot", JSON.stringify(CTS.Bot));
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Bot) ? "You'll now ask !bot bypass on load." : "You'll not !bot bypass on load."));
        },
        // !bt short input for !bottoggle
        bt() {
            this.bottoggle();
        },
        votetoggle() {
            if (CTS.Me.mod) {
                CTS.VoteSystem = !CTS.VoteSystem;
                CTS.WaitToVoteList = [];
                let len = CTS.UserList.length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) CTS.UserList[i].vote = 0;
                }
                Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.VoteSystem) ? "VOTING IS NOW ON!" : "VOTING IS NOW OFF!"));
            }
        },
        bot() {
            if (arguments[1] === false && CTS.Me.mod) Alert(0, "✓ Command Accepted!\nBot bypass was called!");
        },
        share() {
            let msg = "CosmosisT's TinyChat Script:\nInstall...\n1. (Tamper Monkey Link)\nhttps://www.tampermonkey.net/\n2. (CTS Link)\nhttps://greasyfork.org/en/scripts/392086\nCTS Discord:\nhttps://discord.gg/KCfH5PQ";
            if (GetActiveChat() !== 0) {
                Send("pvtmsg", msg, GetActiveChat());
                PushPM(GetActiveChat(), msg);
            } else {
                Send("msg", msg);
            }
        },
        gameview() {
            CTS.CanSeeGames = !CTS.CanSeeGames;
            Save("CanSeeGames", JSON.stringify(CTS.CanSeeGames));
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.CanSeeGames) ? "GAME VIEW IS NOW ON!" : "GAME VIEW IS NOW OFF!"));
        },
        fishhost() {
            CTS.CanHostFishGames = !CTS.CanHostFishGames;
            Save("CanHostFishGames", JSON.stringify(CTS.CanHostFishGames));
            Fish.Reset(true, true);
            Settings();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.CanHostFishGames) ? "FISH GAME HOSTING IS NOW ON!" : "FISH GAME HOSTING IS NOW OFF!"));
        },
        wordlehost() {
            CTS.CanHostWordleGames = !CTS.CanHostWordleGames;
            Save("CanHostWordleGames", JSON.stringify(CTS.CanHostWordleGames));
            WordleReset();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.CanHostWordleGames) ? "WORDLE GAME HOSTING IS NOW ON!" : "WORDLE GAME HOSTING IS NOW OFF!"));
        },
        triviahost() {
            CTS.CanHostTriviaGames = !CTS.CanHostTriviaGames;
            Save("CanHostTriviaGames", JSON.stringify(CTS.CanHostTriviaGames));
            Trivia.Reset();
            Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.CanHostTriviaGames) ? "TRIVIA GAME HOSTING IS NOW ON!" : "TRIVIA GAME HOSTING IS NOW OFF!"));
        },
        trivia() {
            if (CTS.Host === CTS.Me.handle && CTS.CanHostTriviaGames) {
                CTS.Game.Trivia.Started = !CTS.Game.Trivia.Started;
                Alert(GetActiveChat(), "✓ Command Accepted!\n" + ((CTS.Game.Trivia.Started) ? "Trivia is now on!\n" : "Trivia is now off!\n"));
                if (CTS.Game.Trivia.Started) {
                    Trivia.init();
                } else {
                    Trivia.Reset();
                }
            }
        },
        triviaplayeradd() {
            if (arguments[0] === "") {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                let player = arguments[0].match(/^([a-z0-9_]{1,32}) ([0-9]{1,10})/i);
                if (player === null) {
                    Alert(GetActiveChat(), "X Command Rejected!\n!triviaplayeradd cosmosist 2000\nThis is an example you can try!");
                } else {
                    if (CTS.Game.Trivia.PlayerList[player[1].toUpperCase()] === undefined) {
                        let point = parseInt(player[2]);
                        CTS.Game.Trivia.PlayerList[player[1].toUpperCase()] = point;
                        Save("TriviaPlayerList", JSON.stringify(CTS.Game.Trivia.PlayerList));
                        let user = UsernameToUser(player[1].toUpperCase());
                        if (user != -1) CTS.UserList[user].triviapoints = point;
                        Alert(GetActiveChat(), "✓ Command Accepted!");
                    } else {
                        Alert(GetActiveChat(), "X Command Rejected!\nUsername is already entered!");
                    }
                }
            }
        },
        // !tpa short input for !triviaplayeradd
        tpa() {
            this.triviaplayeradd(arguments[0]);
        },
        triviaplayerremove() {
            if (arguments[0] === "" || isNaN(arguments[0])) {
                Alert(GetActiveChat(), "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help.");
            } else {
                let user = Object.keys(CTS.Game.Trivia.PlayerList);
                if (CTS.Game.Trivia.PlayerList[user[arguments[0]]] !== undefined) {
                    delete CTS.Game.Trivia.PlayerList[user[arguments[0]]];
                    Save("TriviaPlayerList", JSON.stringify(CTS.Game.Trivia.PlayerList));
                    let useron = UsernameToUser(user[arguments[0]]);
                    if (useron != -1) CTS.UserList[useron].triviapoints = 0;
                    Alert(GetActiveChat(), "✓ Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
                }
            }
        },
        // !tpr short input for !triviaplayerremove
        tpr() {
            this.triviaplayerremove(arguments[0]);
        },
        triviaplayerlistclear() {
            CTS.Game.Trivia.PlayerList = {};
            Save("TriviaPlayerList", JSON.stringify(CTS.Game.Trivia.PlayerList));
            for (let i = 0; i < CTS.UserList.length; i++) CTS.UserList[i].triviapoints = 0;
            Alert(GetActiveChat(), "✓ Command Accepted!");
        },
        triviaplayerlist() {
            Alert(GetActiveChat(), SettingsList.TriviaPlayerList());
        },
        // !tpl short input for !triviaplayerlist
        tpl() {
            this.triviaplayerlist();
        },
        version() {
            if (!CTS.Me.owner) {
                let msg = "I am using " + CTS.Project.Name + "v" + Ver();
                if (GetActiveChat() !== 0) {
                    Send("pvtmsg", msg, GetActiveChat());
                    PushPM(GetActiveChat(), msg);
                } else {
                    Send("msg", msg);
                }
            }
        },
        roll() {
            let dice,
                msg = "";
            dice = (arguments[0] === "" || isNaN(arguments[0])) ? 1 : (arguments[0] < 12) ? arguments[0] : 12;
            for (let i = 0; i < dice; i++) msg += Dice();
            if (GetActiveChat() !== 0) {
                Send("pvtmsg", msg, GetActiveChat());
                PushPM(GetActiveChat(), msg);
            } else {
                Send("msg", msg);
            }
        },
        coin() {
            if (CTS.Host == 0 || GetActiveChat() !== 0) {
                let msg = "The coin landed on " + ((Rand(0, 1) == 1) ? "heads" : "tails") + "!";
                if (GetActiveChat() !== 0) {
                    Send("pvtmsg", msg, GetActiveChat());
                } else {
                    Send("msg", msg);
                }
            }
        },
        settings() {
            Settings();
        },
        lists() {
            Alert(GetActiveChat(), SettingsList.UserList() + "\n" + SettingsList.UserBanList() + "\n" + SettingsList.NickBanList() + "\n" + SettingsList.UserKeyBanList() + "\n" + SettingsList.NickKeyBanList() + "\n" + SettingsList.BanKeywordList() + "\n" + SettingsList.KickKeywordList() + "\n" + SettingsList.UserKickList() + "\n" + SettingsList.NickKickList() + "\n" + SettingsList.BotModList() + "\n" + SettingsList.HiddenCameraList() + "\n" + SettingsList.IgnoreList());
        },
        listsclear() {
            CTS.MentionList = [];
            CTS.IgnoreList = [];
            CTS.HiddenCameraList = [];
            CTS.UserBanList = [];
            CTS.UserKickList = [];
            CTS.NickBanList = [];
            CTS.NickKickList = [];
            CTS.UserKeyBanList = [];
            CTS.NickKeyBanList = [];
            CTS.BanKeywordList = [];
            CTS.KickKeywordList = [];
            CTS.GreetList = [];
            CTS.HighlightList = [];
            CTS.ReminderList = [];
            CTS.BotOPList = [];
            CTS.BotModList = [];
            CTS.Strict = false;
            CTS.SpamBan = false;
            Save("MentionList", JSON.stringify(CTS.MentionList));
            Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
            Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
            Save("UserBanList", JSON.stringify(CTS.UserBanList));
            Save("UserKickList", JSON.stringify(CTS.UserKickList));
            Save("NickBanList", JSON.stringify(CTS.NickBanList));
            Save("NickKickList", JSON.stringify(CTS.NickKickList));
            Save("UserKeyBanList", JSON.stringify(CTS.UserKeyBanList));
            Save("NickKeyBanList", JSON.stringify(CTS.NickKeyBanList));
            Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
            Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
            Save("GreetList", JSON.stringify(CTS.GreetList));
            Save("HighlightList", JSON.stringify(CTS.HighlightList));
            Save("ReminderList", JSON.stringify(CTS.ReminderList));
            Save("BotModList", JSON.stringify(CTS.BotModList));
            Save("BotOPList", JSON.stringify(CTS.BotOPList));
            Save("Strict", JSON.stringify(CTS.Strict));
            Save("SpamBan", JSON.stringify(CTS.SpamBan));
            Alert(GetActiveChat(), "✓ Command Accepted!\nAll list cleared.\nSpamBan: OFF\nStrict: OFF");
        },
    };
    var SettingsList = {
        UserList() {
            let index,
                msg,
                len = CTS.UserList.length;
            msg = "<b style=\"color:#ffffff;\"><u>User list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.UserList[index].username + "\n(" + CTS.UserList[index].nick + ")\n";
            return msg;
        },
        UserBanList() {
            let index,
                msg,
                len = CTS.UserBanList.length;
            msg = "<b style=\"color:#ffffff;\"><u>User Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.UserBanList[index] + "\n";
            return msg;
        },
        NickBanList() {
            let index,
                msg,
                len = CTS.NickBanList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Nick Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.NickBanList[index] + "\n";
            return msg;
        },
        UserKeyBanList() {
            let index,
                msg,
                len = CTS.UserKeyBanList.length;
            msg = "<b style=\"color:#ffffff;\"><u>User Key Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.UserKeyBanList[index] + "\n";
            return msg;
        },
        NickKeyBanList() {
            let index,
                msg,
                len = CTS.NickKeyBanList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Nick Key Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.NickKeyBanList[index] + "\n";
            return msg;
        },
        BanKeywordList() {
            let index,
                msg,
                len = CTS.BanKeywordList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Ban Keyword list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(CTS.BanKeywordList[index]) + "\n";
            return msg;
        },
        UserKickList() {
            let index,
                msg,
                len = CTS.UserKickList.length;
            msg = "<b style=\"color:#ffffff;\"><u>User Kick list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.UserKickList[index] + "\n";
            return msg;
        },
        NickKickList() {
            let index,
                msg,
                len = CTS.NickKickList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Nick Kick list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.NickKickList[index] + "\n";
            return msg;
        },
        KickKeywordList() {
            let index,
                msg,
                len = CTS.KickKeywordList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Kick Keyword list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(CTS.KickKeywordList[index]) + "\n";
            return msg;
        },
        BotOPList() {
            let index,
                msg,
                len = CTS.BotOPList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Bot OP list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.BotOPList[index] + "\n";
            return msg;
        },
        BotModList() {
            let index,
                msg,
                len = CTS.BotModList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Bot Mod list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.BotModList[index] + "\n";
            return msg;
        },
        MentionList() {
            let index,
                msg,
                len = CTS.MentionList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Mention list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(CTS.MentionList[index]) + "\n";
            return msg;
        },
        IgnoreList() {
            let index,
                msg,
                len = CTS.IgnoreList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Ignore list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.IgnoreList[index] + "\n";
            return msg;
        },
        HiddenCameraList() {
            let index,
                msg,
                len = CTS.HiddenCameraList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Hidden Camera list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.HiddenCameraList[index] + "\n";
            return msg;
        },
        GreetList() {
            let index,
                msg,
                len = CTS.GreetList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Greet list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.GreetList[index] + "\n";
            return msg;
        },
        HighlightList() {
            let index,
                msg,
                len = CTS.HighlightList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Highlight list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + CTS.HighlightList[index] + "\n";
            return msg;
        },
        ReminderList() {
            let index,
                msg,
                len = CTS.ReminderList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Reminder list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": [" + CTS.ReminderList[index][0] + "] " + HTMLtoTXT(CTS.ReminderList[index][1]) + "\n";
            return msg;
        },
        SafeList() {
            let index,
                msg,
                len = CTS.SafeList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Safe list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": " + CTS.SafeList[index] + "\n";
            return msg;
        },
        GreenRoomList() {
            let index,
                msg,
                len = CTS.GreenRoomList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Green Room list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": " + CTS.GreenRoomList[index] + "\n";
            return msg;
        },
        GreenRoomIgnoreList() {
            let index,
                msg,
                len = CTS.GreenRoomIgnoreList.length;
            msg = "<b style=\"color:#ffffff;\"><u>Green Room Ignore list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": " + CTS.GreenRoomIgnoreList[index] + "\n";
            return msg;
        },
        TriviaPlayerList() {
            let index,
                msg,
                user = Object.keys(CTS.Game.Trivia.PlayerList),
                len = user.length;
            msg = "<b style=\"color:#ffffff;\"><u>Trivia Player list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": " + user[index] + "@" + CTS.Game.Trivia.PlayerList[user[index]] + "IQ\n";
            return msg;
        }
    };
    var MessageQueueList = {
        add() {
            CTS.SendQueue.push(arguments[0]);
            MessageQueueList.run();
        },
        run() {
            if (CTS.SendQueue !== undefined && CTS.SendQueue.length > 0) {
                setTimeout(function() {
                    let temp = new Date();
                    let OffsetTime = temp - CTS.LastMessage;
                    if (OffsetTime >= 1500) {
                        CTS.LastMessage = new Date();
                        CTS.SocketTarget.send(CTS.SendQueue[0]);
                        CTS.SendQueue.shift();
                    }
                    MessageQueueList.run();
                }, 1600);
            }
        }
    };
    var ServerSendList = {
        msg() {
            let obj = {
                "tc": arguments[0]
            };
            if (arguments[2] !== undefined) {
                obj.handle = arguments[1];
                CTS.SocketTarget.send(JSON.stringify(obj));
            } else {
                if (arguments[1] !== undefined) {
                    obj.text = arguments[1];
                    MessageQueueList.add(JSON.stringify(obj));
                } else {
                    CTS.SocketTarget.send(JSON.stringify(obj));
                }
            }
        },
        pvtmsg() {
            let obj = {
                "tc": arguments[0],
                "text": arguments[1],
                "handle": Number(arguments[2])
            };
            MessageQueueList.add(JSON.stringify(obj));
        },
        kick() {
            CheckSafeList(arguments[1], true);
            ServerSendList.msg(arguments[0], arguments[1], "kick");
        },
        ban() {
            CheckSafeList(arguments[1], true);
            ServerSendList.msg(arguments[0], arguments[1], "ban");
        },
        nick() {
            let obj = {
                "tc": "nick",
                "nick": arguments[1]
            };
            CTS.SocketTarget.send(JSON.stringify(obj));
        },
        stream_moder_close() {
            CheckSafeList(arguments[1], true);
            ServerSendList.msg(arguments[0], arguments[1], "stream_moder_close");
        },
        stream_moder_allow() {
            ServerSendList.msg(arguments[0], arguments[1], "stream_moder_allow");
        }
    };
    var ServerInList = {
        joined() {
            Reset();
            CTS.Me = {
                "handle": arguments[0].self.handle,
                "username": (arguments[0].self.username === "") ? "GUEST" : arguments[0].self.username.toUpperCase(),
                "nick": arguments[0].self.nick,
                "owner": arguments[0].self.owner,
                "mod": arguments[0].self.mod,
                "namecolor": window.CTSNameColor[Rand(0, window.CTSNameColor.length - 1)],
                "avatar": arguments[0].self.avatar,
                "broadcasting": false
            };
            if (CTS.Me.nick.match(/^guest(?:\-[0-9]{1,10})?/i) && CTS.Me.username !== "GUEST") Send("nick", CTS.Me.username); //AUTO CORRECT NAME
            if (CTS.Me.mod && CTS.Bot && CTS.ScriptInit && CTS.SocketConnected) CheckHost();
            CTS.Room = {
                "Avatar": arguments[0].room.avatar,
                "Bio": arguments[0].room.biography,
                "Name": arguments[0].room.name,
                "PTT": arguments[0].room.pushtotalk,
                "Website": arguments[0].room.website,
                "Recent_Gifts": arguments[0].room.recent_gifts
            };
            CTS.SocketConnected = true;
        },
        userlist() {
            let len = arguments[0].users.length;
            for (let user = 0; user < len; user++) {
                AKBS(arguments[0].users[user]);
                let username = (arguments[0].users[user].username === "") ? "GUEST" : arguments[0].users[user].username.toUpperCase();
                CheckUserAbuse(arguments[0].users[user].handle, username, arguments[0].users[user].nick);
                CTS.UserList.push({
                    "handle": arguments[0].users[user].handle,
                    "username": username,
                    "nick": arguments[0].users[user].nick,
                    "owner": arguments[0].users[user].owner,
                    "mod": arguments[0].users[user].mod,
                    "namecolor": window.CTSNameColor[Rand(0, window.CTSNameColor.length - 1)],
                    "avatar": (arguments[0].users[user].avatar === "") ? "https://avatars.tinychat.com/standart/small/eyePink.png" : arguments[0].users[user].avatar,
                    "canGame": (arguments[0].users[user].username !== "GUEST") ? true : false,
                    "broadcasting": false,
                    "vote": 0,
                    "triviapoints": CTS.Game.Trivia.PlayerList[username] || 0
                });
            }
            RoomUsers();
            debug();
        },
        join() {
            AKBS(arguments[0]);
            let user = (arguments[0].username === "") ? "GUEST" : arguments[0].username.toUpperCase();
            CheckUserAbuse(arguments[0].handle, user, arguments[0].nick);
            if (CTS.Strict) {
                CheckStrictAbuse(arguments[0].handle, user, arguments[0].nick);
            } 
            if (CTS.HighlightList.includes(user) && window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound && !window.CTSMuted) {
                window.CTSSound.HIGHLIGHT.volume = window.CTSRoomVolume;
                window.CTSSound.HIGHLIGHT.play();
            } else {
                if ((CTS.GreetList.includes(user) || (CTS.Host == CTS.Me.handle && CTS.GreetList.includes("-ALL"))) && CTS.NoGreet === false) {
                    if ((user.match(/nig|3_b|nazi/i) || arguments[0].nick.match(/nig|3_b|nazi/i)) && !CTS.hasGreetedWC) {
                        CTS.hasGreetedWC = true;
                        Alert(GetActiveChat(), `✓ Banned for bad name!\nNick: ${arguments[0].nick}\nUser: ${user}`);
                        Send("ban", arguments[0].handle);
                    } else if (user != "GUEST") {
                        let nickGuestCheck = arguments[0].nick.match(/^guest$|^guest\-\d+/i);
                        if (nickGuestCheck === null) {
                            Send("msg", (window.CTSWelcomes[Rand(0, window.CTSWelcomes.length - 1)] + arguments[0].nick.toUpperCase()) + ((CTS.GreetMode) ? ".\n" + (((user != "GUEST") ? "You are signed in as " + user : "You are not signed in") + ".\nWelcome to the room!") : "!"));
                            //comment out the above line and uncomment the one below to change welcome message format.
                            //Send("msg", "Welcome " + arguments[0].nick + ", " + (window.CTSWelcomes[Rand(0, window.CTSWelcomes.length - 1)]) + "\nAccount: " + user);
                            
                        } else {
                            Send("msg", `Welcome to the room, ${user}.`);
                        } 
                    }
                    if (window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound && !window.CTSMuted) {
                        window.CTSSound.GREET.volume = window.CTSRoomVolume;
                        window.CTSSound.GREET.play();
                    }
                }
            }
            CTS.NoGreet = false;
            AddUser(arguments[0].handle, arguments[0].mod, window.CTSNameColor[Rand(0, window.CTSNameColor.length - 1)], (arguments[0].avatar === "") ? "https://avatars.tinychat.com/standart/small/eyePink.png" : arguments[0].avatar, arguments[0].nick, user, ((user !== "GUEST") ? true : false), arguments[0].owner);
            RoomUsers();
            debug();
        },
        sysmsg() {
            if (CTS.Me.mod) {
                let action = arguments[0].text.match(/^([a-z0-9_]{1,32}):? (closed|banned|kicked) ([a-z0-9_]{1,32})$/i);
                if (action !== null) {
                    let user;
                    if (action[2] == "closed" || action[2] == "banned" || action[2] == "kicked") {
                        user = NicknameToUser(action[3].toUpperCase());
                        if (user != -1) {
                            if (CTS.UserList[user].username !== "GUEST") {
                                let a = CTS.GreenRoomList.indexOf(CTS.UserList[user].username);
                                if (a !== -1) {
                                    //REMOVE
                                    debug("GREENROOMLIST::", "REMOVE USER " + CTS.UserList[user].username + " FROM GREENROOMLIST");
                                    Alert(GetActiveChat(), "✓ Removing " + CTS.UserList[user].username + " from greenroomlist!");
                                    CommandList.greenroomremove(a);
                                }
                            }
                        }
                    }
                }
            }
            AddSystemNotification(HTMLtoTXT(arguments[0].text));
            debug();
        },
        nick() {
            let user = HandleToUser(arguments[0].handle),
            isMod = CTS.UserList[user].mod,
            isSafe = isSafeListed(arguments[0].username);

            if (user != -1) {
                AddUserNotification(4, CTS.UserList[user].namecolor, CTS.UserList[user].nick, CTS.UserList[user].username, true, arguments[0].nick);                
                CTS.UserList[user].nick = arguments[0].nick;
                if (CTS.Me.handle == arguments[0].handle) CTS.Me.nick = arguments[0].nick;
                CheckUserAbuse(arguments[0].handle, CTS.UserList[user].username, arguments[0].nick);
            }
            debug();
        },
        stream_connected() {
            if (CTS.Host === CTS.Me.handle && CTS.GreenRoomToggle && arguments[0].publish == false && CTS.Me.handle !== arguments[0].handle && !CTS.Camera.List.includes(arguments[0].handle)) {
                //USER IS NOT ON CAMERA START AUTO ACCEPT PROCESS
                let user = HandleToUser(arguments[0].handle);
                if (user != -1) {
                    debug("CAMERA::WAITING", "nickname:" + CTS.UserList[user].nick);
                    if (!CTS.GreenRoomIgnoreList.includes(CTS.UserList[user].username) && CTS.GreenRoomList.includes(CTS.UserList[user].username)) Send("stream_moder_allow", CTS.UserList[user].handle);
                }
            }
            debug();
        },
        stream_closed() {
            debug();
        },
        publish() { //ADD GLOBAL CAMERA
            CheckUserStream(arguments[0].handle, true);
            debug();
        },
        unpublish() { //REMOVE GLOBAL CAMERA
            CheckUserStream(arguments[0].handle, false);
            debug();
        },
        ping() {
            if (CTS.ScriptInit) {
                let verify;
                if (CTS.WatchList.length > 0) {
                    verify = new Date() - CTS.WatchList[0][2];
                    debug("WATCHLIST::LIST", CTS.WatchList);
                    debug("WATCHLIST::VERIFYING", CTS.WatchList[0][0] + " " + verify + "/700000");
                    if (CTS.SafeList.indexOf(CTS.WatchList[0][0]) === -1) { //LET'S NOT ADD TWICE
                        if (verify > 700000) {
                            debug("WATCHLIST::VERIFIED", CTS.WatchList[0][0] + " " + verify + "/700000");
                            CTS.SafeList.push(CTS.WatchList[0][0]);
                            CTS.WatchList.shift();
                        }
                    } else {
                        CTS.WatchList.shift();
                    }
                }
                if (CTS.WaitToVoteList.length > 0) {
                    verify = new Date() - CTS.WaitToVoteList[0][1];
                    debug("VOTE::LIST", CTS.WaitToVoteList);
                    debug("VOTE::WAIT", CTS.WaitToVoteList[0][0] + " " + verify + "/300000");
                    if (verify > 300000) {
                        debug("VOTE::READY", CTS.WaitToVoteList[0][0] + " " + verify + "/300000");
                        CTS.WaitToVoteList.shift();
                    }
                }
            }
            //DISPOSE OF ITEMS
            window.TinychatApp.getInstance().defaultChatroom._chatlog.items = [];
            window.TinychatApp.getInstance().defaultChatroom.packetWorker.queue = {};
            debug();
        },
        quit() {
            if (CTS.ScriptInit) {
                if (CTS.WatchList.length > 0) {
                    let len = CTS.WatchList.length;
                    for (let i = 0; i < len; i++) {
                        if (CTS.WatchList[i][1] == arguments[0].handle) {
                            CTS.WatchList.splice(i, 1);
                            break;
                        }
                    }
                }
                if (CTS.Me.mod) RemoveUserCamera(arguments[0].handle);
                let user = HandleToUser(arguments[0].handle);
                if (user != -1) {
                    if (CTS.Me.handle === CTS.Host && Fish.GetPlayer(arguments[0].handle, true, false)) Send("msg", CTS.Game.Fish.UserQuitLast + ", has slipped off the boat; I don't think we should look back.");
                    //SEND THEM OUT
                    AddUserNotification(2, CTS.UserList[user].namecolor, CTS.UserList[user].nick, CTS.UserList[user].username, true);
                    CTS.UserList.splice(user, 1);
                }
                RoomUsers();
                if (CTS.Host == arguments[0].handle) {
                    CTS.Host = 0;
                    CTS.Camera.Sweep = false;
                    if (CTS.Me.mod && CTS.Bot) {
                        setTimeout(function() {
                            if (CTS.Host == 0) SetBot(false);
                        }, (Rand(10, 30) * 1000));
                    }
                }
            }
            debug();
        },
        msg() {
            if (CTS.ScriptInit) {
                let user = HandleToUser(arguments[0].handle);
                if (user != -1) {
                    if (!LineSpam(arguments[0].text, CTS.UserList[user].mod)) {
                        if (GamePrevention(arguments[0].text, CTS.UserList[user].mod)) {
                            let text = HTMLtoTXT(arguments[0].text);
                            //ALL USERS REPORT
                            OwnerCommand(user, arguments[0].text);
                            BotCheck(user, text, arguments[0]);
                            //MODERATORS
                            if (CTS.Me.mod) {
                                if (CTS.Host == CTS.Me.handle) botCommandCheck(user, text);
                                CheckUserWordAbuse(user, arguments[0].text);
                            }

                            if (!CheckUserIgnore(user) && !CheckUserTempIgnore(user) && IgnoreText(text)) {
                                //PUSH MESSAGE
                                if (isSafeListed(CTS.UserList[user].username)) text = CheckImgur(text);
                                CTS.Message[0].push({
                                    "time": Time(),
                                    "namecolor": CTS.UserList[user].namecolor,
                                    "avatar": CTS.UserList[user].avatar,
                                    "username": CTS.UserList[user].username,
                                    "nick": CTS.UserList[user].nick,
                                    "msg": text,
                                    "mention": false
                                });
                                let msg = CTS.Message[0][CTS.Message[0].length - 1];
                                if (CTS.Me.handle !== arguments[0].handle) {
                                    if (CTS.UserList[user].mod && (text.match(/^!autokick$/i) || text.match(/^!autoban$/i))) {
                                        Alert(GetActiveChat(), "✓ AntiSpam Watch List CLEARED!\nAnother user has initiated autokick/autoban.");
                                        CTS.AutoKick = false;
                                        CTS.AutoBan = false;
                                    }
                                    if (window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound && !window.CTSMuted) {
                                        if (CTS.UserList.length <= 14) {
                                            window.CTSSound.MSG.volume = window.CTSRoomVolume;
                                            window.CTSSound.MSG.play();
                                        }
                                    }
                                    let len = CTS.MentionList.length;
                                    for (let i = 0; i < len; i++) {
                                        if (text.toUpperCase().includes(CTS.MentionList[i])) {
                                            if (window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound && !window.CTSMuted) {
                                                window.CTSSound.MENTION.volume = window.CTSRoomVolume;
                                                window.CTSSound.MENTION.play();
                                            }
                                            msg.mention = true;
                                            AddUserNotification(3, CTS.UserList[user].namecolor, CTS.UserList[user].nick, CTS.UserList[user].username, true);
                                        }
                                    }
                                }
                                if (GetActiveChat() === 0) CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, msg.mention, 0);
                                MessagePopUp(user, text, true, false);
                            }
                        }
                    } else {
                        if (CTS.Host == CTS.Me.handle) {
                            let spamUser = HandleToUser(arguments[0].handle),
                            spammer = CTS.UserList[spamUser];
                            if (!CTS.SpamBan) {
                                Alert(GetActiveChat(), `✓ Kicked for spam!\nNick: ${spammer.nick}\nUser: ${spammer.username}`);
                                Send("kick", arguments[0].handle);
                            }
                            else {
                                Alert(GetActiveChat(), `✓ Banned for spam!\nNick: ${spammer.nick}\nUser: ${spammer.username}`);
                                Send("ban", arguments[0].handle);
                            }
                        } else if (CTS.Host == 0) {
                            if (CTS.Me.mod && !CTS.SpamBan) {
                                Alert(GetActiveChat(), `✓ Kicked for spam!\nNick: ${spammer.nick}\nUser: ${spammer.username}`);
                                Send("kick", arguments[0].handle);
                            }
                            else if (CTS.Me.mod) {
                                Alert(GetActiveChat(), `✓ Banned for spam!\nNick: ${spammer.nick}\nUser: ${spammer.username}`);
                                Send("ban", arguments[0].handle);
                            }
                        }
                    }
                }
            }
            debug();
        },
        pvtmsg() {
            if (CTS.ScriptInit) {
                if (CTS.enablePMs === true) {
                    if (arguments[0].handle != CTS.Me.handle) {
                        let user = HandleToUser(arguments[0].handle);
                        if (user != -1) {
                            if (!LineSpam(arguments[0].text, CTS.UserList[user].mod)) {
                                if (GamePrevention(arguments[0].text, CTS.UserList[user].mod)) {
                                    let text = arguments[0].text;
                                    if (CTS.Me.mod) CheckUserWordAbuse(user, arguments[0].text);
                                    if (!CheckUserIgnore(user) && !CheckUserTempIgnore(user) && IgnoreText(text)) {
                                        if (!CTS.Message[arguments[0].handle]) CTS.Message[arguments[0].handle] = [];
                                        PushPM(arguments[0].handle, text, user);
                                        if (window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound && !window.CTSMuted) {
                                            window.CTSSound.PVTMSG.volume = window.CTSRoomVolume;
                                            window.CTSSound.PVTMSG.play();
                                        }
                                        text = HTMLtoTXT(text);
                                        if (isSafeListed(CTS.UserList[user].username)) text = CheckImgur(text);
                                        MessagePopUp(user, text, false, false);
                                    }
                                }
                            } else {
                                if (CTS.Me.mod) Send("kick", arguments[0].handle);
                            }
                        }
                    }
                }
            }
            debug();
        },
        gift() {
            CreateGift(arguments[0]);
            debug();
        },
    };
    var ServerOutList = {
        pvtmsg() {
            if (CTS.ScriptInit) {
                Command(arguments[0].text, true);
                let text = arguments[0].text;
                if (!CTS.Message[arguments[0].handle]) CTS.Message[arguments[0].handle] = [];
                PushPM(arguments[0].handle, text);
            }
            debug();
        },
        msg() {
            if (CTS.ScriptInit) {
                CTS.LastMessage = new Date();
                Command(arguments[0].text, false);
            }
            debug();
        },
        ban() {
            CheckSafeList(arguments[0].handle, true);
            debug();
        },
        kick() {
            CheckSafeList(arguments[0].handle, true);
            debug();
        },
        stream_moder_close() {
            CheckSafeList(arguments[0].handle, true);
            debug();
        }
    };
    //ADDON
    var Addon = {
        active() {
            if (window.CTSAddon !== undefined) {
                if (window.CTSAddon[arguments[0]] !== undefined) {
                    return true;
                }
            }
            return false;
        },
        get() {
            return window.CTSAddon[arguments[0]];
        }
    };
    //GAME LIST FUNCTION
    const Trivia = {
        init() {
            if (CTS.Me.handle == CTS.Host && CTS.CanHostTriviaGames) {
                this.Reset();
                CTS.Game.Trivia.Started = true;
                this.GetQuestion();
            }
        },
        //TriviaDB (https://opentdb.com/api.php?amount=50&type=multiple)
        GetQuestion: async function() {
            try {
                let response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                let resp = await response.json();
                if (resp.response_code === 0) {
                    CTS.Game.Trivia.QuestionList = resp.results;
                    this.AskQuestion();
                } else {
                    console.error('Error in Trivia API response:', resp);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        },
        AskQuestion() {
            clearTimeout(CTS.Game.Trivia.Timer);
            CTS.Game.Trivia.AttemptList = [];
            CTS.Game.Trivia.Attempts = 0;
            if (CTS.Game.Trivia.Started) {
                if (CTS.Game.Trivia.QuestionList.length > 0) {
                    let RandSlot = Rand(0, 3),
                        msg,
                        incorrect = 0;
                    CTS.Game.Trivia.WaitCount++;
                    CTS.Game.Trivia.Correct = CTS.Game.Trivia.ANum[RandSlot];
                    CTS.Game.Trivia.Worth = ((CTS.Game.Trivia.QuestionList[0].difficulty === "easy") ? Rand(10, 20) : (CTS.Game.Trivia.QuestionList[0].difficulty === "medium") ? Rand(30, 50) : Rand(70, 100));
                    CTS.Game.Trivia.Waiting = false;
                    msg = "[TRIVIA] Worth: " + CTS.Game.Trivia.Worth + " IQ!\n" + CTS.Game.Trivia.QuestionList[0].question + "\n-------------";
                    for (let i = 0; i < 4; i++) {
                        msg += "\n" + CTS.Game.Trivia.ANum[i] + ") ";
                        if (i == RandSlot) {
                            msg += CTS.Game.Trivia.QuestionList[0].correct_answer;
                        } else {
                            msg += CTS.Game.Trivia.QuestionList[0].incorrect_answers[incorrect];
                            incorrect++;
                        }
                    }
                    CTS.Game.Trivia.QuestionList.shift();
                    Send("msg", DecodeTXT(msg));
                    CTS.Game.Trivia.Timer = setTimeout(function(g) {
                        Send("msg", "[TRIVIA] answer was: " + CTS.Game.Trivia.Correct);
                        g.Wait();
                    }, 90000, this); // default 240000
                } else {
                    CTS.Game.Trivia.WaitCount = 0;
                    this.GetQuestion();
                }
                if (CTS.Game.Trivia.WaitCount >= 15) {
                    CTS.Game.Trivia.WaitCount = 0;
                    this.Ranking();
                }
            }
        },
        Wait() {
            CTS.Game.Trivia.Correct = "";
            CTS.Game.Trivia.Waiting = true;
            clearTimeout(CTS.Game.Trivia.Timer);
            setTimeout(function() {
                if (CTS.Game.Trivia.Started) Trivia.AskQuestion();
            }, 30000); // default 60000
        },
        Ranking() {
            Send("msg", "[TRIVIA RANK]\nHigh Score: " + CTS.Game.Trivia.HighScore[0] + "\n" + CTS.Game.Trivia.HighScore[1] + " IQ!");
        },
        Reset() {
            clearTimeout(CTS.Game.Trivia.Timer);
            CTS.Game.Trivia.Attempts = 0;
            CTS.Game.Trivia.WaitCount = 0;
            CTS.Game.Trivia.Started = false;
            CTS.Game.Trivia.Correct = "";
            CTS.Game.Trivia.AttemptList = [];
            CTS.Game.Trivia.QuestionList = {};
            CTS.Game.Trivia.Waiting = true;
        }
    };
    const Fish = {
        Init() {
            if (CTS.Me.handle === CTS.Host && CTS.CanHostFishGames) {
                CTS.Game.Fish.StartTimeout = setTimeout(() => this.StartRound(), 5000, this);
            }
        },
    
        AddPlayer() {
            if (!this.GetPlayer(arguments[0], false, false) && CTS.CanHostFishGames) {
                if (isSafeListed(arguments[1])) {
                    let player = {
                        Handle: arguments[0],
                        Username: arguments[1],
                        Nickname: arguments[2],
                        LastCheck: new Date() - 5000,
                        Points: 5000,
                        Upgrades: {
                            Net: 1,
                            Store: 1,
                            Radar: 1,
                            Insurance: false
                        },
                    };
                    CTS.Game.Fish.Player.push(player);
                    Send("msg", `[FISHING BOAT]\n${arguments[2].substr(0, 16)}...\n has jumped aboard.\n!fishhelp for command list.`);
                    if (this.GetPlayer() === 0) this.Init();
                }
            }
        },
        GetPlayer() {
            let len = CTS.Game.Fish.Player.length;
            if (arguments[0] !== undefined) {
                for (let player of CTS.Game.Fish.Player) {
                    if (player.Handle === arguments[0]) {
                        if (arguments[2]) return player;
                        if (arguments[1]) {
                            CTS.Game.Fish.UserQuitLast = player.Nickname;
                            CTS.Game.Fish.Player.splice(CTS.Game.Fish.Player.indexOf(player), 1);
                        }
                        if (!arguments[2]) return true;
                    }
                }
                if (!arguments[2]) {
                    return false;
                } else {
                    return -1;
                }
            } else {
                return len - 1;
            }
        },

        FindPlayer() {
            if (arguments[1]) {
                let targetPlayer = UsernameToHandle(arguments[0].toUpperCase());
                if (targetPlayer === -1) {
                    targetPlayer = NicknameToHandle(arguments[0].toUpperCase());
                }    
                return Fish.GetPlayer(targetPlayer, false, true);
            } else {
                let targetUser = UsernameToUser(arguments[0].toUpperCase());
                if (targetUser === -1) {
                    targetUser = NicknameToUser(arguments[0].toUpperCase());
                }
                return targetUser;
            }  
        },
    
        Ranking() {
            let msg = "[FISHING RANK]\nTOP 5 PLAYERS:\n",
            place = 0;
            
            for (let u = arguments[0]; u >= 0; u--) {
                place++;
                CTS.Game.Fish.Player[u].Points += 10000;
                CTS.Game.Fish.Player[u].Upgrades.Insurance = false;
                if (u < 5) {
                    msg += `${place}:${CTS.Game.Fish.Player[u].Nickname} [$${CTS.Game.Fish.Player[u].Points}]\n`;
                }
                //CTS.Game.Fish.Player[u].Upgrades.Insurance = false;
                //CTS.Game.Fish.Player[u].Points += 10000;
            }
            //Send("msg", msg);
        },
    
        Winner() {
            let len = CTS.Game.Fish.Player.length - 1;

            CTS.Game.Fish.Player.sort((a, b) => a.Points - b.Points);
            if (CTS.Game.Fish.HighScore[1] < CTS.Game.Fish.Player[len].Points) {
                Send("msg", `[FISHING CHAMP]\nNEW HIGH SCORE,\nKeep going ${CTS.Game.Fish.Player[len].Nickname}!`);
                CTS.Game.Fish.HighScore = [CTS.Game.Fish.Player[len].Nickname, CTS.Game.Fish.Player[len].Points];
                Save("FishHighScore", JSON.stringify(CTS.Game.Fish.HighScore));
            }
            Send("msg", `[FISHING CHAMP]\nHIGH SCORE:\n${CTS.Game.Fish.HighScore[0]} : $${CTS.Game.Fish.HighScore[1]}\n\nROUND WINNER:\n${CTS.Game.Fish.Player[len].Nickname} : $${CTS.Game.Fish.Player[len].Points}\n\nAll Players: +$10000\nNext round starts in 30s.`);
            this.Ranking(len);
            CTS.Game.Fish.RestockTimeout = setTimeout(() => this.Reset(false, true), 30000);
        },
    
        PriceList() {
            let { Upgrades } = arguments[0],
            netPrice = 1000 * Upgrades.Net ** 3, // default 1000 * Upgrades.Net ** 3;
            radarPrice = Upgrades.Radar < 3 ? 5000 : (3000 * (Upgrades.Radar - 1) ** 2), // default 1000 * Upgrades.Radar * 2 + 3500
            storePrice = Upgrades.Store ** 2 * 25000, // default Upgrades.Store ** 2 * 25000; 
            insurancePrice = 10000 * Upgrades.Store, // default 20000
            robPrice = 15000, // default 10000
            slapPrice = 150000, // default 50000
            gamblePrice = 5000, // default 1000
            splitMinimum = 10000; // default 1000
    
            switch (arguments[1]) {
                case 0: return netPrice;
                case 1: return radarPrice;
                case 2: return storePrice;
                case 3: return insurancePrice;
                case 4: return robPrice;
                case 5: return slapPrice;
                case 6: return gamblePrice;
                case 7: return splitMinimum;
                default: return 0;
            }
        },
    
        StartRound() {
            clearTimeout(CTS.Game.Fish.StartTimeout);
    
            if (CTS.Host === CTS.Me.handle) {
                if (this.GetPlayer() >= 0) {
                    if (CTS.Game.Fish.Round < 10) {
                        CTS.Game.Fish.Round++;
                        let playerlen,
                            fishlen = CTS.Game.Fish.TypesOfFish.length - 1,
                            id,
                            type,
                            handle,
                            eliminate = false,
                            msgeliminate,
                            value,
                            msg = "[FISHING BOAT]\n";
    
                        //for (let cast = 0; cast <= 3; cast++) { // default
                        for (let cast = 0; cast <= (this.GetPlayer() > 4 ? 4 : this.GetPlayer() === 4 ? 3 : 2); cast++) {
                            playerlen = this.GetPlayer();
                            id = Rand(0, playerlen);
                            type = Rand(CTS.Game.Fish.Player[id].Upgrades.Radar, fishlen);
    
                            if (Rand(0, 100) <= Rand(10, 70)) {
                                let net = Rand(1, CTS.Game.Fish.Player[id].Upgrades.Net);
                                value = net * CTS.Game.Fish.TypesOfFish[type][1] * 40 * CTS.Game.Fish.Player[id].Upgrades.Store;
    
                                if (CTS.Game.Fish.TypesOfFish[type][2]) {
                                    CTS.Game.Fish.Player[id].Points += value;
                                    msg += `${CTS.Game.Fish.Player[id].Nickname.substr(0, 14)}...[$${CTS.Game.Fish.Player[id].Points}]:\n✓ ${net}x ${CTS.Game.Fish.TypesOfFish[type][0]} +$${value}\n`;
                                } else {
                                    if (!CTS.Game.Fish.Player[id].Upgrades.Insurance) {
                                        CTS.Game.Fish.Player[id].Points -= value;
                                        msg += `${CTS.Game.Fish.Player[id].Nickname.substr(0, 14)}...[${(CTS.Game.Fish.Player[id].Points < 0) ? "broke]:" : `$${CTS.Game.Fish.Player[id].Points}]:`}\nX ${net}x ${CTS.Game.Fish.TypesOfFish[type][0]} -$${value}\n`;
                                    } else {
                                        msg += `${CTS.Game.Fish.Player[id].Nickname.substr(0, 14)}...[$${CTS.Game.Fish.Player[id].Points}]:\n⦸ ${net}x ${CTS.Game.Fish.TypesOfFish[type][0]} -$0\n`;
                                    }
                                }
                            } else {
                                cast--;
                            }
    
                            if (this.GetPlayer() === -1) break;
    
                            if (CTS.Game.Fish.Player[id].Points < 0) {
                                eliminate = true;
                                handle = CTS.Game.Fish.Player[id].Handle;
                                msgeliminate = `[FISHING BOAT]\n${CTS.Game.Fish.Player[id].Nickname.substr(0, 16)}...\nCan walk the plank for costing me my moneys!`;
                                CTS.Game.Fish.Player.splice(id, 1);
                                break;
                            }
                        }
    
                        if (msg !== "[FISHING BOAT]\n") Send("msg", msg);
    
                        if (eliminate) {
                            eliminate = false;
                            Send("msg", msgeliminate);
                        }
    
                        CTS.Game.Fish.ReCastTimeout = setTimeout(() => this.StartRound(), Rand(90000, 120000), this);
                    } else {
                        this.Winner();
                    }
                } else {
                    this.Stop();
                }
            }
        },
    
        Reset() {
            let get = this.GetPlayer();
            if (get !== undefined) {
                if (get >= 0 && !CTS.Game.NoReset || arguments[1] !== undefined) {
                    CTS.Game.Fish.Round = 0;
                    clearTimeout(CTS.Game.Fish.StartTimeout);
                    clearTimeout(CTS.Game.Fish.RestockTimeout);
                    clearTimeout(CTS.Game.Fish.ReCastTimeout);
                    clearTimeout(CTS.Game.Fish.NotEnoughTimeout);
    
                    if (!arguments[0]) {
                        this.Init();
                    } else {
                        if (CTS.Game.Fish.Player.length > 0) Send("msg", "[FISHING BOAT]\nWelp... Boat sank! I'm not refunding anyone!");
                        CTS.Game.Fish.Player = [];
                    }
                }
            }
        },
    
        Stop() {
            CTS.Game.NoReset = false;
            this.Reset(true, true);
        }
    };    
    const FishList = {
        fish() {
            Fish.AddPlayer(arguments[1].handle, arguments[1].username, arguments[1].nick);
        },
    
        fishbank() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname.substr(0, 16)},\n\nBank: $${arguments[0].Points}.`);
            }
        },
    
        fishrob() {
            let player = arguments[0];
            let targetPlayer = Fish.FindPlayer(arguments[1], true);
        
            if (player !== -1 && fishTimerCheck(player)) {
                let caughtAmount = Fish.PriceList(player, 4);
        
                if (targetPlayer === -1) {
                    Send("msg", `[FISHING BOAT]\n ${player.Nickname.substr(0, 16)}...\nInvalid target player.`);
                    return;
                }
        
                if (player.Points <= caughtAmount) {
                    Send("msg", `[FISHING BOAT]\n ${player.Nickname.substr(0, 16)}...\nToo Poor! Cost: $${caughtAmount}\n\nBank: $${player.Points}`);
                    return;
                }
                
                if (targetPlayer.Upgrades.Insurance) {
                    Send("msg", `[FISHING BOAT]\n${player.Nickname.substr(0, 16)}...\n${targetPlayer.Nickname.substr(0, 16)}, has insurance and cannot be robbed.`);
                    return;
                }
        
                if (targetPlayer.Points < 25000) {
                    Send("msg", `[FISHING BOAT]\n${player.Nickname.substr(0, 16)}...\n${targetPlayer.Nickname.substr(0, 16)}, does not have enough money to be robbed.\nMinimum: $25000`);
                    return;
                }
        
                // Calculate the chance of getting caught (25%)
                if (Rand(1, 4) === 1) {
                    fishTransaction(player, caughtAmount);
                    Send("msg", `[FISHING BOAT]\n${player.Nickname.substr(0, 16)}...\nAttempted to rob ${targetPlayer.Nickname.substr(0, 16)} but got caught and lost $${caughtAmount}!\n\nBank: $${player.Points}`);
                } else {
                    // Successful robbery
                    fishTransfer(player, targetPlayer, Fish.PriceList(player, 4), Rand(5000, 25000), true);
                }
            }
        },
    
        fishgamble() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                if (fishTransaction(arguments[0], Fish.PriceList(arguments[0], 6))) {
                    let winnings;
                    if (Rand(1, 10) === 7) { // 10% chance
                        winnings = Rand(10000, 35000); // default 5000, 25000
                    } else if (Rand(1, 7) === 4) { // 15%
                        winnings = Rand(5000, 15000);
                    }
                    if (winnings) {
                        arguments[0].Points += winnings;
                        Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname.substr(0, 16)}, won $${winnings}\n\nBank: $${arguments[0].Points}`);
                    } else {
                        Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname.substr(0, 16)}, lost $5000!\n\nBank: $${arguments[0].Points}`);
                    }
                }
            }
        },
    
        fishspin(player, lines) {
            if (player !== -1 && fishTimerCheck(player)) {
                // Set default wager
                let defaultWager = 5000;
            
                // If lines are provided and valid, use them; otherwise, use default
                let wagerPoints = defaultWager * lines
            
                // Check if the player has enough points for the wager
                if (player.Points >= wagerPoints) {
                    // Deduct the wager from the user's points
                    player.Points -= wagerPoints;
            
                    // Calculate winnings based on the result of the spin
                    let emojis = ["🐠", "🐠", "🐠", "🐠", "🛟", "🛟", "🛟", "🛟", "🐡", "🐡", "🐡", "🐬", "🐬", "🐬", "🦈", "🦈", "🦈", "🐋", "🐋", "🐋", "🐉", "🐉", "🐉", "🧜‍♀️", "🧜‍♀️", "🧜‍♀️", "🍒", "🍒", "🍒"]; // Fish emojis
                    const slots = [];
            
                    for (let i = 0; i < 9; i++) {
                        slots.push(emojis[Rand(0, emojis.length - 1)]);
                    }
            
                    // Display the slots
                    let resultMsg = `[FISHING BOAT]\n${player.Nickname.substr(0, 16)}:\n🎰Jolly TugR🎰\n`;

                    if (lines > 3 ) {
                        resultMsg += ((lines > 6 ? ".◁ " : ". .. ") + (lines > 4 ? "▽" : "△") + " .. " + (lines > 3 ? "▽" : "△") + " .. " + (lines > 5 ? "▽" : "△") + (lines > 7 ? " ▷\n" : "\n"));
                    }

                    for (let row = 0; row < 3; row++) {
                        if (lines === 1 && row === 1 || lines === 2 && row >= 1 || lines > 2) {
                            resultMsg += "▷";
                        } else {
                            resultMsg += "◁";
                        }
            
                        for (let i = 0; i < 3; i++) {
                            resultMsg += `[${slots[row*3 + i]}]`;
                        }
            
                        resultMsg += "\n";
                    }
            
                    resultMsg += `BET: ${lines} x $5000\n`;
            
                    let winnings = calculateSpinResult(slots, lines);
            
                    // Add winnings to the user's points
                    player.Points += winnings;
            
                    resultMsg += `PAYOUT: $${winnings}\n\nBank: $${player.Points}`;
                    Send("msg", resultMsg);
                } else {
                    // Inform the user that they don't have enough points for the wager
                    Send("msg", `[FISHING BOAT]\n ${player.Nickname.substr(0, 16)}...\nToo Poor!\nBET: ${lines} x $5000\n\nBank: $${player.Points}`);
                }
            }

        },

        fishslap() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                let user = Fish.FindPlayer(arguments[1], false);
                if (user !== -1 && CTS.UserList[user].broadcasting && CTS.UserList[user].handle !== CTS.Me.handle && CTS.UserList[user].username !== "GUEST") {
                    if (CTS.Me.owner || !CTS.UserList[user].mod) {
                        if (fishTransaction(arguments[0], Fish.PriceList(arguments[0], 5))) {
                            Send("stream_moder_close", CTS.UserList[user].handle);
                            Send("msg", `[FISHING BOAT]\n${CTS.UserList[user].nick}...\n${arguments[0].Nickname}, has paid to close your camera!`);
                        }
                    } else {
                        Send("msg", "Cannot close moderator!");
                    }
                } else {
                    Send("msg", "Cannot close user!");
                }
            }
        },
    
        fishsplit() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                let targetPlayer = Fish.FindPlayer(arguments[1], true);
                let splitPrice = Fish.PriceList(arguments[0], 7);
                if (arguments[0].Points < splitPrice) {
                    Send("msg", `[FISHING BOAT]\n ${arguments[0].Nickname.substr(0, 16)}...\nToo Poor!\nMinimum: $${splitPrice}\n\nBank: $${arguments[0].Points}`);
                } else {
                    fishTransfer(arguments[0], targetPlayer, Fish.PriceList(arguments[0], 7), Math.round(arguments[0].Points / 2), false);
                }
            }
        },
    
        fishupgrade() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) fishUpgradeStatus(arguments[0], 0);
        },
    
        fishhelp() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) fishUpgradeStatus(arguments[0], 6);
        },
    
        fishupgradenet() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                if (arguments[0].Upgrades.Net >= 10) {
                    Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname}, you own all net upgrades.`);
                } else {
                    if (fishTransaction(arguments[0], Fish.PriceList(arguments[0], 0))) {
                        arguments[0].Upgrades.Net += 1;
                        fishUpgradeStatus(arguments[0], 1);
                    }
                }
            }
        },
    
        fishupgraderadar() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                if (arguments[0].Upgrades.Radar >= 20) {
                    Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname}, you own all radar upgrades.`);
                } else {
                    if (fishTransaction(arguments[0], Fish.PriceList(arguments[0], 1))) {
                        arguments[0].Upgrades.Radar += 2;
                        fishUpgradeStatus(arguments[0], 2);
                    }
                }
            }
        },
    
        fishupgradeshop() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                if (arguments[0].Upgrades.Store >= 6) {
                    Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname}, you own all shop upgrades.`);
                } else {
                    if (fishTransaction(arguments[0], Fish.PriceList(arguments[0], 2))) {
                        arguments[0].Upgrades.Store += 1;
                        fishUpgradeStatus(arguments[0], 3);
                    }
                }
            }
        },
    
        fishupgradeinsurance() {
            if (arguments[0] !== -1 && fishTimerCheck(arguments[0])) {
                if (arguments[0].Upgrades.Insurance === true) {
                    Send("msg", `[FISHING BOAT]\n${arguments[0].Nickname}, you already own insurance.`);
                } else {
                    if (fishTransaction(arguments[0], Fish.PriceList(arguments[0], 3))) {
                        arguments[0].Upgrades.Insurance = true;
                        fishUpgradeStatus(arguments[0], 4);
                    }
                }
            }
        }
    };    
    //MISC FUNCTION
    function SetLocalValues() {
        if (CTS.StorageSupport) {
            //CTS SETTINGS
            CTS.Game.Trivia.PlayerList = JSON.parse(Load("TriviaPlayerList", JSON.stringify({})));
            CTS.Game.Trivia.HighScore = JSON.parse(Load("TriviaHighScore", JSON.stringify(["CosmosisT", 1])));
            CTS.Game.Fish.HighScore = JSON.parse(Load("FishHighScore", JSON.stringify(["CosmosisT", 13337])));
            CTS.PublicCommandToggle = JSON.parse(Load("PublicCommandToggle", JSON.stringify(true)));
            CTS.OGStyle.SavedHeight = JSON.parse(Load("OGStyleHeight", JSON.stringify(3)));
            CTS.GreenRoomIgnoreList = JSON.parse(Load("GreenRoomIgnoreList", JSON.stringify([])));
            CTS.CameraBorderToggle = JSON.parse(Load("CameraBorderToggle", JSON.stringify(true)));
            CTS.OGStyle.SavedWidth = JSON.parse(Load("OGStyleWidth", JSON.stringify(1)));
            CTS.NotificationToggle = JSON.parse(Load("NotificationToggle", JSON.stringify(0)));
            CTS.ChatStyleCounter = JSON.parse(Load("ChatStyle", JSON.stringify(14)));
            CTS.SoundMeterToggle = JSON.parse(Load("SoundMeterToggle", JSON.stringify(true)));
            CTS.HiddenCameraList = JSON.parse(Load("HiddenCameraList", JSON.stringify([])));
            CTS.KickKeywordList = JSON.parse(Load("KickKeywordList", JSON.stringify([])));
            CTS.PerformanceMode = JSON.parse(Load("PerformanceMode", JSON.stringify(false)));
            CTS.TimeStampToggle = JSON.parse(Load("TimeStampToggle", JSON.stringify(true)));
            CTS.GreenRoomToggle = JSON.parse(Load("GreenRoomToggle", JSON.stringify(true)));
            CTS.BanKeywordList = JSON.parse(Load("BanKeywordList", JSON.stringify([])));
            CTS.FavoritedRooms = JSON.parse(Load("FavoritedRooms", JSON.stringify([null, null, null, null, null])));
            CTS.MainBackground = Load("MainBackground", `radial-gradient(#FFFFFF, #5d839c, #254c66) #000`);
            CTS.GreenRoomList = JSON.parse(Load("GreenRoomList", JSON.stringify([])));
            CTS.HighlightList = JSON.parse(Load("HighlightList", JSON.stringify([])));
            CTS.CanHostTriviaGames = JSON.parse(Load("CanHostTriviaGames", JSON.stringify(false)));
            CTS.CanHostFishGames = JSON.parse(Load("CanHostFishGames", JSON.stringify(false)));
            CTS.CanHostWordleGames = JSON.parse(Load("CanHostWordleGames", JSON.stringify(false)));
            CTS.ReminderList = JSON.parse(Load("ReminderList", JSON.stringify([])));
            CTS.UserKickList = JSON.parse(Load("UserKickList", JSON.stringify([])));
            CTS.NickKickList = JSON.parse(Load("NickKickList", JSON.stringify([])));
            CTS.UserBanList = JSON.parse(Load("UserBanList", JSON.stringify([])));
            CTS.NickBanList = JSON.parse(Load("NickBanList", JSON.stringify([])));
            CTS.UserKeyBanList = JSON.parse(Load("UserKeyBanList", JSON.stringify([])));
            CTS.NickKeyBanList = JSON.parse(Load("NickKeyBanList", JSON.stringify([])));
            CTS.MentionList = JSON.parse(Load("MentionList", JSON.stringify([])));
            CTS.CanSeeGames = JSON.parse(Load("CanSeeGames", JSON.stringify(true)));
            CTS.ThemeChange = JSON.parse(Load("ThemeChange", JSON.stringify(true)));
            CTS.Strict = JSON.parse(Load("Strict", JSON.stringify(false)));
            CTS.SpamBan = JSON.parse(Load("SpamBan", JSON.stringify(false)));
            CTS.BotModList = JSON.parse(Load("BotModList", JSON.stringify([])));
            CTS.IgnoreList = JSON.parse(Load("IgnoreList", JSON.stringify([])));
            CTS.GreetList = JSON.parse(Load("GreetList", JSON.stringify([])));
            CTS.BotOPList = JSON.parse(Load("BotOPList", JSON.stringify(["-ALL"])));
            CTS.GreetMode = JSON.parse(Load("GreetMode", JSON.stringify(false)));
            CTS.FontSize = JSON.parse(Load("FontSize", JSON.stringify(20)));
            CTS.SafeList = JSON.parse(Load("AKB", JSON.stringify([])));
            CTS.Featured = JSON.parse(Load("Featured", JSON.stringify(false)));
            CTS.Reminder = JSON.parse(Load("Reminder", JSON.stringify(true)));
            CTS.ChatType = JSON.parse(Load("ChatType", JSON.stringify(true)));
            CTS.Popups = JSON.parse(Load("Popups", JSON.stringify(true)));
            CTS.Avatar = JSON.parse(Load("Avatar", JSON.stringify(true)));
            CTS.Imgur = JSON.parse(Load("Imgur", JSON.stringify(true)));
            CTS.FPS = JSON.parse(Load("FPS", JSON.stringify(30)));
            CTS.Bot = JSON.parse(Load("Bot", JSON.stringify(true)));
            CTS.MediaStreamFilter = Load("MediaStreamFilter", "No Filter");
        }
    }

    function debug() {
        if (window.DebugClear === false) {
            if (arguments[0] !== undefined) {
                let msg = "CTS::" + arguments[0];
                if (arguments[1]) msg = msg + "\n" + JSON.stringify(arguments[1]);
                console.log(msg);
            }
        } else {
            console.clear();
            console.log("             (     \n   (    *   ))\ )  \n   )\ \` )  /(()/(  \n (((_) ( )(_)/(_)) \n )\___(_(_()(_))   \n((/ __|_   _/ __|  \n | (__  | | \__ \  /\n  \___| |_| |___/  \nCosmosisT's TinyChat Script\nCREATOR: COSMOSIST\nVERSION: " + Ver() + "\nCONSOLE DEBUG: FALSE\n\nJoin the discord today!\nhttps://discord.gg/KCfH5PQ");
        }
    }

    function Reset() {
        CTS.UserList = [];
        CTS.Me = [];
        CTS.Room = [];
        CTS.SendQueue = [];
        CTS.Camera.List = [];
        CTS.Camera.List = [];
        CTS.WaitToVoteList = [];
        CTS.WatchList = [];
        CTS.Host = 0;
        CTS.HostAttempt = 0;
        CTS.HostWaiting = false;
        CTS.TempIgnoreUserList = [];
        CTS.TempIgnoreNickList = [];
        // Game Reset
        Fish.Stop();
        Trivia.Reset();
        WordleReset();
    }

    function Remove() {
        return (arguments[1] !== undefined) ? arguments[0].querySelector(arguments[1]).parentNode.removeChild(arguments[0].querySelector(arguments[1])) : arguments[0].parentNode.removeChild(arguments[0]);
    }
})();