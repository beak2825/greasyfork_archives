    // ==UserScript==
    // @name        n_n
    // @version     1.1.2
    // @description First time messing with JS; bare with me.
    // @author      n_n
    // @url         no url
    // @license     GNU General Public License
    // @icon        https://tinychat.com/webrtc/2.0.0-81/images/favicon.png
    // @match       https://tinychat.com/room/*
    // @match       https://tinychat.com/*
    // @exclude     https://tinychat.com/settings/*
    // @exclude     https://tinychat.com/subscription/*
    // @exclude     https://tinychat.com/promote/*
    // @exclude     https://tinychat.com/coins/*
    // @exclude     https://tinychat.com/gifts*
    // @grant       none
    // @run-at      document-start
    // @namespace https://tinychat.com/room/hell
// @downloadURL https://update.greasyfork.org/scripts/484504/n_n.user.js
// @updateURL https://update.greasyfork.org/scripts/484504/n_n.meta.js
    // ==/UserScript==
     
    (function() {
        "use strict";
        //DEBUGGER
        window.DebugClear = true;
        window.HELLVersion = {
            Major: 1,
            Minor: 1,
            Patch: 11
        };
        var MainElement, ChatLogElement, VideoListElement, SideMenuElement, TitleElement, UserListElement, ModerationListElement, ChatListElement, UserContextElement, MicrophoneElement, TextAreaElement,
            FeaturedCSS, VideoCSS, SideMenuCSS, MainCSS, RoomCSS, TitleCSS, ContextMenuCSS, ModeratorCSS, UserListCSS, ChatListCSS, NotificationCSS, ChatboxCSS;
        //HELL MAIN VARIABLES
        var HELL = {
            Project: {
                Name: "HELL",
                Storage: "HELL_",
                isTouchScreen: false
            },
            Chuck: {
                XHR: new XMLHttpRequest()
            },
            Urb: {
                XHR: new XMLHttpRequest()
            },
            Dad: {
                XHR: new XMLHttpRequest()
            },
            Advice: {
                XHR: new XMLHttpRequest()
            },
            Events: {
                XHR: new XMLHttpRequest()
            },
            Me: {},
            Room: {},
            ScriptInit: false,
            MainBackground: "url(https://i.imgur.com/MB3vwHI.png) rgb(0, 0, 0) no-repeat",
            MediaStreamFilter:"No Filter",
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
            MainBackgroundCounter: 0,
            NotificationLimit: 100,
            ChatScroll: true,
            CreateMessageLast:undefined,
            NotificationScroll: true,
            NoGreet: false,
            Featured: true,
            Bot: false,
            AutoKick: false,
            AutoBan: false,
            GreetMode: false,
            PerformanceMode: false,
            CanTTS: false,
            VoteSystem: false,
            Popups: true,
            Avatar: true,
            Reminder: true,
            ServerEvent: true,
            CanSeeTips:true,
            CanSeeGames: true,
            isFullScreen: false,
            Imgur: true,
            ImgurWarning: 0,
            Notification: true,
            UserYT: true,
            ThemeChange: true,
            SoundMeterToggle: true,
            TimeStampToggle: true,
            AutoMicrophone: false,
            GreenRoomToggle: true,
            PublicCommandToggle: true,
            TTS: {
                synth: undefined,
                voices: undefined
            },
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
            TTSList: [],
            BanKeywordList: [],
            KickKeywordList: [],
            HighlightList: [],
            GreetList: [],
            ServerEventList: [],
            ServerEventServerInList: [],
            ReminderList: [],
            ReminderServerInList: [],
            Favorited: ["hell", null, null, null, null],
            SafeList: [],
            GreenRoomIgnoreList: [],
            GreenRoomList: [],
            WatchList: [],
            HiddenCameraList: [],
            KBQueue: [],
            Message: [
                []
            ],
            Clipboard:{
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
            ToggleStackMessage: true
        };
     
        HELL.StorageSupport = StorageSupport();
        SetLocalValues();
     
        //IS USER TOUCHSCREEN
        CheckUserTouchScreen();
     
        if (HELL.ThemeChange) {
            // TinyChat Style
            FeaturedCSS = "#videos.column>.videos-items{background:#0000003b;height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{background:#0000003b;width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
            ChatListCSS = "#chatlist{background:#00000075;}.list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#53b6ef;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background:#53b6ef;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{font-weight: 600;border-radius:unset;color:#FFFFFF;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}";
            ChatboxCSS = "#chat-import-label{text-align: center;height: 20px;right: 70px;width:35px;cursor:pointer;}#chat-import{opacity: 0;position: absolute;z-index: -1;}.stackmessage:hover > .HELLtimehighlight{display:block;}.HELLtimehighlight{font-weight: 600;font-size: 16px;color: #FFF;position: absolute;right: 3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;display:none;}.stackmessage{background: #00000085;border-radius: 6px;margin: 5px 0 0 -5px;padding: 5px;-webkit-box-shadow: 0 0 9px 0px #ffffff9e;box-shadow: 0 0 9px 0px #ffffff9e;}#chat-export{right:35px;width:35px;}#chat-download{right:0;width:35px;}#chat-import-label:hover, #chat-export:hover, #chat-download:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #111111;box-shadow: inset 0 0 20px 0 #111111;}.chat-button{outline:none;background: unset;border: unset;position: absolute;height: 22px;padding-top: 2px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;}#chatlog-button{display:none!important;}@media screen and (max-width: 1200px){#chat-hide{top: -39px!important;left: 0!important;width: 100%!important;border-radius: 0!important;}}#chat-hide{top: calc(50% - 18px);position: absolute;display: block;height: 16px;width: 16px;left: -8px;margin-top: -20px;border-radius: 16px;font-size: 0;background:url(https://i.imgur.com/jFSLyDD.png) #000000 center no-repeat;background-size:16px;cursor: pointer;z-index: 1;-webkit-box-shadow: 0 0 6px #111111;box-shadow: 0 0 6px #111111;}#chat-instant.show{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(25, 29, 32)100%)!important;}#chat-wider:before{transition:.3s;margin: -4px 0 0 -4px;border-width: 6px 6px 6px 0;border-color: transparent #ffffff!important;}#chat-wider{-webkit-box-shadow: 0 0 6px #111111;box-shadow: 0 0 6px #111111;z-index: 2;background:#000000!important}#chat-wrapper{transition:none;}#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #10131494;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;overflow:hidden;}#user-menu{border-radius: 6px;background: #000000b8;position: absolute;display: none;bottom: 50px;right: 0;box-sizing: border-box;border-radius: 6px;color: #FFFFFF;line-height: 1;z-index: 1;max-width:300px;padding:12px;}#user-menu > span {border-radius:6px;background:#000000c9;display: inline-block;width: 100%;padding: 6px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background:unset;}.HELL-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#111111;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.HELLtime{position:absolute;right:3px;top:3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#HELL-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message>.systemuser{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgba(0, 0, 0, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift>a{background:black;}.serverevent{background: linear-gradient(0deg,rgb(13, 135, 200)0%,rgba(17, 107, 169, 0.85)50%,rgba(40, 118, 232, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift{border-radius:12px;background: #0165d0;-webkit-box-shadow: inset 0 0 5em 5px #000;box-shadow: inset 0 0 5em 5px #000;}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{text-decoration:underline;}#chat{will-change: transform;min-height:unset;}#HELL-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#HELL-chat-content>.message{padding:3px 3px;background:#101314a8;position:relative;left:0;margin-bottom:3px;border-radius:6px}#HELL-chat-content>.message.highlight,.message.common.highlight{background:#393939AA;-webkit-box-shadow: inset 0 0 20px #000000;box-shadow: inset 0 0 20px 0 #000000;}#HELL-chat-content>.message.common{min-height: 50px;padding:3px 3px 3px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#HELL-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);pointer-events:none;}#chat-instant>.avatar>div,#HELL-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}.notifbtn:hover{background:linear-gradient(0deg,rgb(0, 135, 186)0%,rgba(0, 49, 64, 0.94)75%,rgba(0, 172, 255, 0.6)100%);}.notifbtn{cursor: pointer;border-radius: 0 0 12px 12px;outline: none;background:linear-gradient(0deg,rgba(0, 0, 0, 0)0%,rgba(37, 37, 37, 0.32)75%,rgba(255, 255, 255, 0.6)100%);border: none;color: white;width: 100%;}#notification-content.large{height:50%;}#notification-content{will-change: transform;top:0;position:relative;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height:20%;min-height:38px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#HELL-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#HELL-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#111111;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-instant::after{content:unset;}.on-white-scroll{scrollbar-width: none;overflow-wrap: break-word;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#HELL-chat-content>.message>.nickname{border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" + (HELL.FontSize - 4) + "px;font-family:sans-serif;font-weight:300;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
            MainCSS = "#menu{display:none;}#mobile-app.show{display:none;}html{background:rgba(0,0,0,1);}#menu-icon{display:none;}body{background:" + HELL.MainBackground + ";background-position: center!important;background-size:cover!important;overflow:hidden;}#nav-static-wrapper {display:none;}#content{padding:0!important;}";
            VideoCSS = ".video>div{border-radius:10px;}@media screen and (max-width: 600px){#videos{top:38px;}#videos-header{position: unset;height: unset;width: unset;top: unset;bottom: unset;padding: 0 2px 10px 15px;box-sizing: border-box;}}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{height:unset;}#videolist[data-mode=\"dark\"]{background-color:unset;}@media screen and (max-width: 1200px){#videos-footer{right: unset!important;bottom: -22px!important;top: unset!important;}}#videos-footer-broadcast-wrapper{margin-top:16px;}#youtube.video > div > .overlay, .video > div > .overlay{display:block!important}.tcsettings{display:none}#videos-header{background:#101314;}#videos-footer-broadcast-wrapper.active>#videos-footer-broadcast,#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button,#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:focus{background-color:#2d373a!important;}.js-video.broken{display:none;}.videos-header-volume {border-color:#202627;}.tcsettings:hover{background:#008cda;}.tcsettings{cursor: pointer;outline: none;background:#101314;border: none;color: white;}.music-radio-info>.description{cursor:default;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.music-radio-info>.volume{bottom: 0;position: absolute;background: #2a6a89;height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.music-radio-info{top: -50px;position: absolute;background: #071c19f0;height: 50px;width: 336px;line-height: 24px;}.HELLdrop{position:fixed;display:inline-block;top:3px;left:4px;z-index:5;min-width: 46px;}.HELLdrop-content{position:absolute;top:28px;right:0;background:#101314;min-width:46px;width: 46px;padding:0;z-index:1;display:none;}.HELLdrop:hover .HELLdrop-content{display:block;}.HELLoptions:hover{background:#111111}.HELLoptions{width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #10131475;border: none;padding: 5% 0;display: inline-block;}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: -64px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #111111;cursor: pointer;}#videos-footer #music-radio{left: 0;border-radius: 12px;background: #101314;}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #111111;box-shadow: inset 0 0 20px 0 #111111;}#videos-footer{cursor:pointer;top:0;display:block;padding: 2px 0 0 11px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute}#videos-footer-broadcast{height:unset;border-radius:unset;z-index: 1;padding: unset!important;white-space: pre}span[title=\"Settings\"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0;left: 0;right: 0;top: 0}:host,#videolist{background:unset!important;}.video:after{content: unset;border:unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header>span{display:block;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}";
            RoomCSS = "tc-title{display:flex;}#room-content{padding-top:0!important;background:unset!important;}";
            TitleCSS = "#room-header-info > h1:after{content:unset;}@media screen and (max-width: 600px){#room-header-info{left:unset;right:unset;}}#room-header-info > span + span,#room-header-info > span{display:none;}#room-header-info > h1{width:unset;max-width:unset; position: relative;top: 8px;left: 60px;}#room-header-info{padding:unset;}#room-header-avatar{display:none}#room-header-gifts{display:none}#room-header-info-text{display:none}#room-header-info-details{display:none}#room-header-mobile-button{display:none}#room-header{width:100%;min-height:38px;max-height:38px;}";
            SideMenuCSS = "#sidemenu{left:0;z-index:3;}@media screen and (max-width: 1000px){#sidemenu{left:-270px;}}#sidemenu.full-screen{left:-270px;}#user-info{display:none;}#top-buttons-wrapper{display:none;}#sidemenu-content{scrollbar-width:none;padding-top:unset;}#sidemenu-wider:before{margin: -4px 0 0 -4px;border-width: 6px 6px 6px 0;border-color: transparent #ffffff;}#sidemenu-wider{-webkit-box-shadow: 0 0 6px #111111;box-shadow: 0 0 6px #111111;z-index: 2;display:block;background-color: #000000;}#sidemenu-content::-webkit-scrollbar{display: none;}#sidemenu.wider {left: -270px;}";
            NotificationCSS = "#youtube.video{min-height:unset;min-width:unset;}@media screen and (max-width: 600px){#videos-header>span{line-height:50px;}}#videos-header > span {background-color: unset!important;}.PMTime{display:inline-block;padding:0 6px 0 0;margin:0 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{word-break: break-word;white-space: pre-line;word-wrap: break-word;user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;color: #FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#111111}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0 0;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0 0 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
            UserListCSS = "#contextmenu {top:unset!important;bottom:0!important;right:0!important;left:0!important;}.list-item>span>span{padding: 0 8px;top:-2px}.list-item > span:hover > span{background-color:unset;box-shadow:unset;}#userlist{background: #00000075;}.js-user-list-item{background: linear-gradient(0deg,rgb(0, 0, 0) 2px,rgba(0, 0, 0, 0.25) 2px,rgba(0, 0, 0, 0.59) 32%);}.list-item>span>span[data-cam=\"1\"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator=\"1\"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:5px;}.list-item>span>img{top:6px;}#button-banlist{border-radius:unset;top:-1px;right:10px;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{font-weight: 600;color:#FFFFFF;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}";
            ModeratorCSS = ".video{min-width: 114px;max-width: 114px;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#111111;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{max-height:60px;background: #00000075;}#moderatorlist>#header{height: 60px;color: #FFFFFF;border-radius: unset;line-height: 22px;}#moderatorlist.show[data-videos-count=\"1\"], #moderatorlist.show[data-videos-count=\"2\"] {max-height:205px;}#moderatorlist.show[data-videos-count=\"3\"], #moderatorlist.show[data-videos-count=\"4\"] {max-height:290px;}#moderatorlist.show[data-videos-count=\"5\"], #moderatorlist.show[data-videos-count=\"6\"] {max-height:400px;}#moderatorlist.show[data-videos-count=\"7\"], #moderatorlist.show[data-videos-count=\"8\"] {max-height:460px;}#moderatorlist.show[data-videos-count=\"9\"], #moderatorlist.show[data-videos-count=\"10\"] {max-height:545px;}#moderatorlist.show[data-videos-count=\"11\"], #moderatorlist.show[data-videos-count=\"12\"] {max-height:630px;}";
            ContextMenuCSS = ".context[data-mode=\"dark\"] > span:hover{background-color:#04caff;}.context.show{height:100%;}.context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background:#101314;position:unset;padding:0;height:0;transition:.25s;}";
        } else {
            //HELL Style
            FeaturedCSS = "#videos.column>.videos-items{background:#0000003b;height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{background:#0000003b;width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
            ChatListCSS = ".list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#111111;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background:#111111;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}";
            ChatboxCSS = "#chat-import-label{text-align: center;height: 20px;right: 70px;width:35px;cursor:pointer;}#chat-import{display: none;position: absolute;z-index: -1;}.stackmessage:hover > .HELLtimehighlight{display:block;}.HELLtimehighlight{font-weight: 600;font-size: 16px;color: #FFF;position: absolute;right: 3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;display:none;}.stackmessage{background: #00000085;border-radius: 6px;margin: 5px 0 0 -5px;padding: 5px;-webkit-box-shadow: 0 0 9px 0px #ffffff9e;box-shadow: 0 0 9px 0px #ffffff9e;}#chat-export{right:35px;width:35px;}#chat-download{right:0;width:35px;}#chat-import-label:hover, #chat-export:hover, #chat-download:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #111111;box-shadow: inset 0 0 20px 0 #111111;}.chat-button{outline:none;background: unset;border: unset;position: absolute;height: 22px;padding-top: 2px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;}#chatlog-button{display:none!important;}#chat-instant.show{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(25, 29, 32)100%)!important;}#chat-wider{display:none;}#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #10131494;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;overflow:hidden;}#user-menu {border-radius: 6px;background: #000000b8;position: absolute;display: none;bottom: 50px;right: 0;box-sizing: border-box;border-radius: 6px;color: #FFFFFF;line-height: 1;z-index: 1;max-width:300px;padding:12px;}#user-menu > span {border-radius:6px;background:#000000c9;display: inline-block;width: 100%;padding: 6px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background:unset;}.HELL-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#111111;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.HELLtime{position:absolute;right:3px;top:3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#HELL-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message>.systemuser{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgba(0, 0, 0, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift>a{background:black;}.serverevent{background: linear-gradient(0deg,rgb(13, 135, 200)0%,rgba(17, 107, 169, 0.85)50%,rgba(40, 118, 232, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift{border-radius:12px;background: #0165d0;-webkit-box-shadow: inset 0 0 5em 5px #000;box-shadow: inset 0 0 5em 5px #000;}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{text-decoration:underline;}#chat{will-change: transform;min-height:unset;}#HELL-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#HELL-chat-content>.message{padding:3px 3px;background:#101314a8;position:relative;left:0;margin-bottom:3px;border-radius:6px}#HELL-chat-content>.message.highlight,.message.common.highlight{background:#393939AA;-webkit-box-shadow:inset 0 0 20px #000000;box-shadow: inset 0 0 20px 0 #000000;}#HELL-chat-content>.message.common{min-height: 50px;padding:3px 3px 3px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#HELL-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);pointer-events:none;}#chat-instant>.avatar>div,#HELL-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}.notifbtn:hover{background:linear-gradient(0deg,rgb(0, 135, 186)0%,rgba(0, 49, 64, 0.94)75%,rgba(0, 172, 255, 0.6)100%);}.notifbtn{cursor: pointer;border-radius: 0 0 12px 12px;outline: none;background:linear-gradient(0deg,rgba(0, 0, 0, 0)0%,rgba(37, 37, 37, 0.32)75%,rgba(255, 255, 255, 0.6)100%);border: none;color: white;width: 100%;}#notification-content.large{height:50%;}#notification-content{will-change: transform;top:0;position:relative;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height: 15%;min-height:38px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#HELL-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#HELL-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#111111;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-instant::after{content:unset;}.on-white-scroll{scrollbar-width: none;overflow-wrap: break-word;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#HELL-chat-content>.message>.nickname{border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" + (HELL.FontSize - 4) + "px;font-family:sans-serif;font-weight:300;}#chat-wrapper{border:none;transition:none;bottom:0;right:0!important;max-height:calc(70% - 119px)!important;min-height:calc(70% - 119px)!important;position:fixed!important;min-width:400px;max-width:400px;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
            MainCSS = "#menu{display:none;}.container{display:none;}#mobile-app.show{display:none;}html{background:rgba(0,0,0,1);}#users-icon{display:none;}#menu-icon{display:none;}body{background:" + HELL.MainBackground + ";background-position: center!important;background-size:cover!important;overflow:hidden;}#content{width:calc(100% - 400px);padding:0!important;}#nav-static-wrapper, #nav-fixed-wrapper{display:none;}";
            VideoCSS = ".video>div{border-radius:10px;}@media screen and (max-width: 600px){#videos{top:38px;}}#videolist[data-mode=\"dark\"]{background-color:unset;}#youtube.video > div > .overlay, .video > div > .overlay{display:block!important}.js-video.broken{display:none;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-submenu{right:0;}#videos-footer-submenu{width: calc(100% - 14px);right:0;bottom:-2px;}.videos-header-volume {border-color:#202627;}.tcsettings:hover{background:#008cda;}.tcsettings{cursor: pointer;outline: none;background:#101314;border: none;color: white;}.music-radio-info>.description{cursor:default;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.music-radio-info>.volume{bottom: 0;position: absolute;background: #2a6a89;height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.music-radio-info{top: -50px;position: absolute;background: #071c19f0;height: 50px;width: 336px;line-height: 24px;}.HELLdrop{position:fixed;display:inline-block;top:3px;right:4px;z-index:5;min-width: 46px;}.HELLdrop-content{position:absolute;top:28px;right:0;background:#101314;min-width:46px;width: 46px;padding:0;z-index:1;display:none;}.HELLdrop:hover .HELLdrop-content{display:block;}.HELLoptions:hover{background:#111111}.HELLoptions{width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #101314;border: none;padding: 5% 0;display: inline-block;}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer-broadcast-wrapper>.video{position: fixed;display: none;width: 5%;top: 0;left: 0}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:hover{background: #1f2223!important}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button{background: #2d373a!important}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: 21px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #111111;cursor: pointer;}#videos-footer #music-radio{left: 0;border-radius: 12px;background: #101314;}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #111111;box-shadow: inset 0 0 20px 0 #111111;}#videos-footer{cursor:pointer;top: calc(30% + 119px);display:block;padding: 2px 0 0 11px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute}#videos-footer-broadcast{border-radius:unset;z-index: 1;padding: unset!important;white-space: pre}#videos-footer-broadcast-wrapper{z-index: 0;visibility: visible;height: 50px;min-height: 50px;width: 400px;padding: unset;right: 0;left: unset;position: fixed;top: calc(30% + 34px)}span[title=\"Settings\"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0;left: 0;right: 0;top: 0}:host,#videolist{background:unset!important;}.video:after{content: unset;border:unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header{z-index: 3;background:#101314;transition: none;left: unset;right: 0;width: 400px;top: calc(30%);position: fixed;max-height: 34px;min-height: 34px;}#videos-header>span{display:block;line-height: unset;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}";
            RoomCSS = "tc-title{display:flex!important;}#room{padding:0!important;}#room-content{padding-top:0!important;background:unset!important;}";
            TitleCSS = "#room-header-avatar{display:none}#room-header-gifts{display:none}#room-header-info-text{display:none}#room-header-info-details{display:none}#room-header-mobile-button{display:none}#room-header{border:unset;z-index:1;min-height:36px!important;max-height:36px!important;min-width:400px;max-width:400px;top:calc(30% + 84px);right:0;position:fixed;background: linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(9, 41, 57)100%);}#room-header-info>h1{height:100%;top: unset;left: unset;right: unset;text-transform:uppercase;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:600 20px sans-serif;color:#FFFFFF;}#room-header-info>h1:after{content:unset;}#room-header-info {padding: 7px 0 0 6px!important;box-sizing: border-box;width: 100%!important;top: 0!important;left: 0!important;right: 0!important;}#room-he#room-header-info>span{right: 8px;position: absolute;top:7px;margin-top:0!important;}";
            SideMenuCSS = "#close-users{display:none!important;}#user-info{display:none;}#top-buttons-wrapper{display:none;}@media screen and (max-width: 600px) {#sidemenu {top:unset;z-index:2;padding-bottom:0;margin-top:0;}}#sidemenu-wider{display:none;}#sidemenu-content::-webkit-scrollbar{width:0;background:transparent;}#sidemenu{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:300 20px sans-serif;left:unset!important;right:0!important;padding-bottom:0;height:30%!important;min-width:400px;max-width:400px;}#sidemenu-content{scrollbar-width:none;padding-top:unset;}";
            NotificationCSS = "#youtube.video{min-height:unset;min-width:unset;}#videos-header > span {background-color: unset!important;line-height: unset;}.PMTime{display:inline-block;padding:0 6px 0 0;margin:0 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{word-break: break-word;white-space: pre-line;word-wrap: break-word;user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;color: #FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#111111}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0 0;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0 0 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
            UserListCSS = "#userlist{padding-bottom:40px;}.list-item>span>span[data-cam=\"1\"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator=\"1\"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:4px;}.list-item>span>img{top:6px;}#button-banlist{color:#111111;transition:none;top:calc(30% + 89px);right:3px;position:fixed;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}#contextmenu {top:unset!important;bottom:0!important;right:0!important;left:0!important;}";
            ModeratorCSS = ".video{min-width: 114px;max-width: 114px;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#111111;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{max-height:60px;}#moderatorlist>#header{height: 60px;color: #FFFFFF;border-radius: unset;line-height: 22px;}#moderatorlist.show[data-videos-count=\"1\"], #moderatorlist.show[data-videos-count=\"2\"] {max-height:205px;}#moderatorlist.show[data-videos-count=\"3\"], #moderatorlist.show[data-videos-count=\"4\"] {max-height:290px;}#moderatorlist.show[data-videos-count=\"5\"], #moderatorlist.show[data-videos-count=\"6\"] {max-height:400px;}#moderatorlist.show[data-videos-count=\"7\"], #moderatorlist.show[data-videos-count=\"8\"] {max-height:460px;}#moderatorlist.show[data-videos-count=\"9\"], #moderatorlist.show[data-videos-count=\"10\"] {max-height:545px;}#moderatorlist.show[data-videos-count=\"11\"], #moderatorlist.show[data-videos-count=\"12\"] {max-height:630px;}";
            ContextMenuCSS = ".context[data-mode=\"dark\"] > span:hover{background-color:#04caff;}.context.show{height:100%;}.context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background:#101314;position:unset;padding:0;height:0;transition:.25s;}";
        }
        //INITIATE
        HELLInit();
     
        function HELLInit() {
            //INITIATE HELL
            var err_out = 0;
            HELL.ScriptLoading = setInterval(function() {
                err_out++;
                if (document.querySelector("tinychat-webrtc-app")) {
                    if (document.querySelector("tinychat-webrtc-app").shadowRoot) HELLRoomInject();
                    debug("TINYCHAT::LOAD", "ROOM");
                } else if (document.querySelector("#welcome-wrapper")) {
                    HELLHomeInject();
                    debug("TinyChat::LOAD", "HOME");
                } else {
                    err_out++;
                }
                if (err_out == 50) {
                    clearInterval(HELL.ScriptLoading);
                    clearInterval(HELL.FullLoad);
                }
            }, 200);
            //WEBSOCKET HOOK
            if (!document.URL.match(/^https:\/\/tinychat\.com\/(?:$|#)/i)) {
                new MutationObserver(function() {
                    this.disconnect();
                    HELLWebSocket();
                }).observe(document, {
                    subtree: true,
                    childList: true
                });
            }
            //FULLY LOADED -> RUNALL
            HELL.FullLoad = setInterval(function() {
                if (HELL.ScriptInit && HELL.SocketConnected) {
                    clearInterval(HELL.FullLoad);
                    if (HELL.Me.mod) {
                        if (HELL.Bot) CheckHost();
                        if (HELL.Room.YT_ON) VideoListElement.querySelector("#videos-footer>#videos-footer-youtube").style.cssText = "display:block;";
                        if (HELL.Room.YT_ON && HELL.Project.isTouchScreen) VideoListElement.querySelector("#videos-footer>#videos-footer-youtube").classList.toggle("hidden");
                        //VideoListElement.querySelector("#videos-footer>#videos-footer-soundcloud").style.cssText = "display:block;";
                    }
                    //PTT AUTO
                    if (HELL.Room.PTT) {
                        VideoListElement.querySelector("#videos-footer-push-to-talk").addEventListener("mouseup", function(e) {
                            e = e || window.event;
                            if (e.which == 1) HELL.AutoMicrophone = false;
                            if (e.which == 1 && e.ctrlKey === true) HELL.AutoMicrophone = !HELL.AutoMicrophone;
                            if (e.which == 2) HELL.AutoMicrophone = !HELL.AutoMicrophone;
                        }, {
                            passive: true
                        });
                    }
                    //FAVORITE ROOM
                    var favorited_rooms = "",
                        len = HELL.FavoritedRooms.length,
                        script = document.createElement("script"),
                        elem = document.getElementsByTagName("script")[0];
                    script.text = 'function AddFavorite(obj, index) {\n var val = JSON.parse(localStorage.getItem("' + HELL.Project.Storage + 'FavoritedRooms"));\n val[index]=["' + HELL.Room.Name + '"];\n localStorage.setItem("' + HELL.Project.Storage + 'FavoritedRooms", JSON.stringify(val));\n obj.href ="https://tinychat.com/room/' + HELL.Room.Name + '";\n obj.innerText = "' + HELL.Room.Name + '";\n obj.onclick = null;\n return false;\n}';
                    elem.parentNode.insertBefore(script, elem);
                    for (var i = 0; i < len; i++) favorited_rooms += HELL.FavoritedRooms[i] !== null ? "<span>#" + (i + 1) + ' <a href="https://tinychat.com/room/' + HELL.FavoritedRooms[i] + '">' + HELL.FavoritedRooms[i] + "</a></span>" : "<span>#" + (i + 1) + ' <a href="#" onclick="return AddFavorite(this,' + i + ');">click to add this room</a></span>';
                    ChatLogElement.querySelector("#input").insertAdjacentHTML("afterbegin", '<div id="header-user"><label id="label-user" for="input-user"><img class="switcher" src="' + (HELL.Me.avatar ? HELL.Me.avatar : "https://avatars.tinychat.com/standart/small/eyePink.png") + '"></label><input type="checkbox" id="input-user" hidden=""><div id="user-menu"><span id="nickname">favourited rooms</span>' + favorited_rooms + '<span id="title">' + HELL.Me.username + '</span><span><a href="https://tinychat.com/settings/gifts">my gifts</a></span><span><a href="https://tinychat.com/settings/profile">profile</a></span><span><a href="https://tinychat.com/room/' + HELL.Me.username + '">my room</a></span><span><a href="https://tinychat.com/#">directory</a></span></div></div>');
                    //RECENT GIFTS
                    var recent_gifts = "\n";
                    for (var g = 0; g < HELL.Room.Recent_Gifts.length; g++) recent_gifts += "<img src=\"" + HELL.Room.Recent_Gifts[g] + "\" />";
                    //ALERT
                    Settings("<center><u>" + HELL.Room.Name.toUpperCase() + "</u>" + (HELL.Room.Avatar ? '\n<img src="' + HELL.Room.Avatar + '">' : "") + "\n" + HELL.Room.Bio + '\n<a href="' + HELL.Room.Website + '" target="_blank">' + HELL.Room.Website + "</a>" + ((recent_gifts != "") ? recent_gifts : "") + "</center>");
                    HELL.ShowedSettings = true;
                    AddUserNotification(2, HELL.Me.namecolor, HELL.Me.nick, HELL.Me.username, false);
                    //FEATURE LAUNCH
                    SoundMeter();
                    Reminder();
                    Events();
                    PerformanceModeInit(HELL.PerformanceMode);
                }
            }, 500);
        }
     
        function HELLHomeInject() {
            var HomeCSS = "@media screen and (max-width: 1000px){.nav-menu {background-color: #181e1f;}}.nav-sandwich-menu-button{background-color:unset;}#modalfree-wrapper{display: none;}.tile-header > img {transition:unset;}.tile-favroom-opt{cursor:pointer;position: absolute;right: 0;top: 0;padding: 1px;background:#10131494;}.tile-favroom-opt:hover{background:#ff00008c;}#content{padding-bottom:unset;}.tile-content{height:180px;}.HELL-footer-contents .tile-info{height:20px}.HELL-footer-contents .tile-header>img{cursor:pointer;height: 220px;}.tile-header>img{height: 230px;width: 100%;max-width: 100%;}.HELL-footer:hover .HELL-footer-contents .tile{font-size: 18px;font-weight: 800;width:20%;display:inline-block;}.HELL-footer-contents .tile {background: #00a2ff;text-align: center;border:unset;height:unset;display:none;margin: unset;}.HELL-footer {background:#10131494;width: 100%;position: fixed;bottom: 0;left: 0;}#catalog > div {display: inline-block;padding: 5px;box-sizing: border-box;}.tile[data-status=\"pro\"], .tile[data-status=\"extreme\"], .tile[data-status=\"gold\"] {margin-top: 12px;}.tile-header {border-radius: 12px 12px 0 0;}#promoted .tile-header > img{width:100%;}#navigation > label{border-radius:12px;}#welcome>div{padding-top:0}.tile-statistic{padding-top:0;padding-bottom:4px;background: #000000a6;}.tile-name{padding-top:unset;}#promote-button{border-radius: 12px 12px 0 0;}tile-name{padding-top:unset;}.tile-info{bottom:unset;top:0;height:28px;}.HELL-footer > h2, #promoted-wrapper > h2, #trended-wrapper > h2, #header-for-all{text-align: center;font-size: 30px;font-weight: 800;}body{background:" + HELL.MainBackground + ";background-size:cover;background-attachment: fixed;}.tile-content-info-icon > img {display:none;}.tile-content-info{font-size: 14px;font-weight: 600;}#promoted .tile-content-info-text{word-break: break-word;max-height:95px;}.tile{border:2px solid #fff;margin-top: 13px;height:425px;}#loadmore-no-more {background:#101314;}.tile-content > img{display:none;}#welcome-wrapper{background: #10131494;border-bottom:unset;}#loadmore{background: #00a2ff;font-weight: 600;}#user-menu{background: #101314;}#nav-static-wrapper {-webkit-box-shadow: 0 0 20px 17px #111111;box-shadow: 0 0 20px 17px #111111;background:#101314;}#up-button:hover > #up-button-content {background: #10131459;}#nav-fixed{border-bottom:unset;}#nav-fixed-wrapper{-webkit-box-shadow: 0 0 20px 17px #111111;box-shadow: 0 0 20px 17px #111111;background: #101314;}#nav-static {border-bottom:unset;}#welcome{padding:12px 30px 24px;}.tile{border-radius: 12px;background: #101314b3;}div, span, a, h1, h2, h3, h4, h5, h6, p {text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color: #FFFFFF!important;}#promoted-wrapper > div, #trended-wrapper > div {background: #00a2ff;border-radius: 12px;}.tile-content-info-text {word-break: break-word;width:100%;}.tile-content-info.with-icon {display: contents;}#navigation > label:not([for=\"input-catalog-navigation\"]) {font-weight:600;background: #000000;}";
            //INSERT HTML/CSS
            document.body.querySelector("style").insertAdjacentHTML("beforeend", HomeCSS);
            document.body.insertAdjacentHTML("beforeend", '<div class="HELL-footer"><h2>FAVORITED ROOMS</h2><div class="HELL-footer-contents"></div></div>');
            //INSERT SCRIPT
            var script = document.createElement("script"),
                elem = document.getElementsByTagName("script")[0];
            script.text = 'function RemoveFavorite(obj, index) {\n	var val = JSON.parse(localStorage.getItem("' + HELL.Project.Storage + 'FavoritedRooms"));\n	val[index]=null;\n	localStorage.setItem("' + HELL.Project.Storage + 'FavoritedRooms", JSON.stringify(val));\n	return obj.parentNode.parentNode.remove();\n}';
            elem.parentNode.insertBefore(script, elem);
            var len = HELL.FavoritedRooms.length;
            for (var i = 0; i < len; i++) document.body.querySelector(".HELL-footer-contents").insertAdjacentHTML("beforeend", HELL.FavoritedRooms[i] !== null ? '<div class="tile" data-room-name="' + HELL.FavoritedRooms[i] + '">Favorite #' + (i + 1) + ' <div class="tile-header"><img id="tile-header-image" src=\"https://upload.tinychat.com/pic/'+HELL.FavoritedRooms[i]+'\")' + '" onload="MasonryTails.Refresh();" onclick="locationTo(\'/room/' + HELL.FavoritedRooms[i] + '\');"><div class="tile-info"><div class="tile-favroom-opt" onclick="RemoveFavorite(this,' + i + ')">X</div><div class="tile-name">' + HELL.FavoritedRooms[i] + '</div><div class="tile-statistic"><svg width="18" height="14" viewBox="0 0 18 14" xmlns="https://www.w3.org/2000/svg"><path d="M9.333 5.667c0-.367-.3-.667-.666-.667h-8C.3 5 0 5.3 0 5.667v6.666C0 12.7.3 13 .667 13h8c.366 0 .666-.3.666-.667V10L12 12.667V5.333L9.333 8V5.667z" transform="translate(3 -3)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span><svg width="20" height="16" viewBox="0 0 20 16" xmlns="https://www.w3.org/2000/svg"><path d="M57 4c-3.182 0-5.9 2.073-7 5 1.1 2.927 3.818 5 7 5s5.9-2.073 7-5c-1.1-2.927-3.818-5-7-5zm0 8.495c1.93 0 3.495-1.565 3.495-3.495 0-1.93-1.565-3.495-3.495-3.495-1.93 0-3.495 1.565-3.495 3.495 0 1.93 1.565 3.495 3.495 3.495zm0-1.51c1.096 0 1.985-.89 1.985-1.985 0-1.096-.89-1.985-1.985-1.985-1.096 0-1.985.89-1.985 1.985 0 1.096.89 1.985 1.985 1.985z" transform="translate(-47 -2)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span></div></div></div></div>' : '<div class="tile">Favorite #' + (i + 1) + "</div>");
            //SCRIPT INIT -> PREPARE()
            clearInterval(HELL.ScriptLoading);
            HELL.ScriptInit = true;
            HELLHomePrepare();
        }
     
        function HELLHomePrepare() {
            //FUNCTION BYPASS
            window.ModalFreeTrialPro = function() {};
            //REMOVE
            Remove(document, "#footer");
            Remove(document, ".nav-logo");
        }
     
        function HELLRoomInject() {
            // PUBLIC / ADDON GRABBERS
            window.HELLRoomVolume = 1;
            window.HELLImages = [
                "https://i.imgur.com/MB3vwHI.png", "https://i.imgur.com/knMBWGG.jpg", "https://i.imgur.com/GdiZPUS.png", "https://i.imgur.com/80x3eHb.png", "https://i.imgur.com/NARAGpS.png", "https://i.imgur.com/PLl2Hqf.png", "https://i.imgur.com/6eUGAxC.png", "https://i.imgur.com/PQYSEhg.png", "https://i.imgur.com/6ZuhSqI.png", "https://i.imgur.com/Qi9UD0j.png", "https://i.imgur.com/3IendJS.png", "https://i.imgur.com/aBdg0mq.png", "https://i.imgur.com/Ar4teQF.png", "https://i.imgur.com/uYyr8tt.png", "https://i.imgur.com/vv8Gkle.png", "https://i.imgur.com/MJyiCEf.png", "https://i.imgur.com/uZgmvyA.png", "https://i.imgur.com/fLqQ81o.png", "https://i.imgur.com/5IzrEfa.png", "https://i.imgur.com/FOvvLSz.png", "https://i.imgur.com/LE9SLCv.png", "https://i.imgur.com/OXOIOk1.png", "https://i.imgur.com/iGVBco5.jpg", "https://i.imgur.com/B2UM6K4.png", "https://i.imgur.com/mmOpGmT.png", "https://i.imgur.com/wvP8Hyo.png", "https://i.imgur.com/AlqxV7A.png", "https://i.imgur.com/T6hzSto.png", "https://i.imgur.com/wt8AAL5.png", "https://i.imgur.com/xixXysr.png", "https://i.imgur.com/ehJEaIf.png", "https://i.imgur.com/zhtxX3q.png", "https://i.imgur.com/YCI072k.png", "https://i.imgur.com/NjSrZmF.png", "https://i.imgur.com/zWjhpWz.png", "https://i.imgur.com/ECHjPTo.png", "https://i.imgur.com/Y7N4HvE.png", "https://i.imgur.com/1dSZykt.png", "https://i.imgur.com/aGHneyh.png", "https://i.imgur.com/5cMa36m.png", "https://i.imgur.com/0Z3hk3K.png", "https://i.imgur.com/Cbwtznj.png", "https://i.imgur.com/fGEt6eh.png", "https://i.imgur.com/EKfuBPT.png", "https://i.imgur.com/SgTbSFm.png", "https://i.imgur.com/KYfZMqZ.png", "https://i.imgur.com/kFKnBxD.png", "https://i.imgur.com/lTqrq9k.png", "https://i.imgur.com/R5eq9C1.png", "https://i.imgur.com/djoGcJW.png", "https://i.imgur.com/BaAYY84.png", "https://i.imgur.com/fJRlWTF.png", "https://i.imgur.com/IQBxLLK.png", "https://i.imgur.com/gAUxvSA.png", "https://i.imgur.com/lu1E9FB.png", "https://i.imgur.com/0RJsa1K.png", "https://i.imgur.com/nDet3Rw.png",
            ];
            window.HELLEightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As  I see it, yes.", "Most Likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
            window.HELLWelcomes = ["yo ", "hey ", "hi ", "fk off ", "dang it's ", "word ", "Yo ", "ay ", "greets "];
            window.HELLSound = {
                C: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
                HIGHLIGHT: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
                GREET: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
                MENTION: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
                MSG: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
                GIFT: new Audio("https://tinychat.com" + window.rootDir + "/sound/magic.mp3"),
                PVTMSG: new Audio("https://tinychat.com" + window.rootDir + "/sound/pop.mp3"),
            };
            window.HELLRadioStations = [
                ["Flex 98.5FM", "https://edge1-b.exa.live365.net/a23768"],
                ["The Loop 97.9", "https://16883.live.streamtheworld.com/WLUPFMAAC.aac"],
                ["HOT899", "https://newcap.leanstream.co/CIHTFM"],
                ["chillstep.info", "https://chillstep.info/listen.ogg"],
                ["HOT997", "https://ice5.securenetsystems.net/KHHK"],
                ["Dance365", "https://edge1-b.exa.live365.net/a93720"],
                ["kexp.org", "https://kexp-mp3-128.streamguys1.com/kexp128.mp3"],
                ["Classic Deep Cuts", "https://edge1-b.exa.live365.net/a72496"],
                ["Divas Hustle Radio", "https://edge1-b.exa.live365.net/a72972"],
                ["Retro 8089", "https://edge1-b.exa.live365.net/a53202"],
                ["Teerex Radio Teerex", "https://edge1-b.exa.live365.net/a74387"],
                ["NGI Radio", "https://edge1-b.exa.live365.net/a24650"],
                ["Legend Oldies", "https://edge1-b.exa.live365.net/a88135"],
                ["Music City Roadhouse", "https://edge1-b.exa.live365.net/a73754"],
                ["Mashrup Reggae Radio", "https://edge1-b.exa.live365.net/a00564"],
                ["97.5 Dance Hits", "https://edge1-b.exa.live365.net/a50365"]
            ];
            window.HELLNameColor = ["#3f69c0", "#b63fc0", "#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#26a635", "#00b34d", "#e6c700", "#FF851B", "#FF4136", "#c81e70", "#f00fbb", "#B10DC9", "#111111", "#53b6ef", "#AAAAAA", "#cc6600", "#009933", "#003366", "#660033", "#804000"];
            window.HELLChatCSS = [
                
                [ //STYLE #0
                    ["#chat-wrapper{background: linear-gradient(0deg,rgb(141, 36, 95)0%,rgba(191, 0, 255, 0.82)calc(100% - 62px),rgb(255, 0, 202)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(150, 0, 175)8px,rgb(176, 0, 226)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //STYLE #1
                    ["#chat-wrapper{background:linear-gradient(0deg,rgba(32,38,40,0.59)0%,rgba(16,14,14,0.76)calc(100% - 62px),rgba(45,55,58,0.72)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //STYLE #2
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(121,24,188)0%,rgb(36,15,45)calc(100% - 62px),rgb(121,24,188)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(83, 17, 128)8px,rgb(68, 15, 103)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#7918bc;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#7918bc!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#460b6f!important;}#videos-footer-push-to-talk{background:#7918bc}#videos-footer-push-to-talk:hover{background:#460b6f}#videos-footer-broadcast:hover{background:#460b6f}#videos-footer-broadcast{background:#7918bc;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13,5,15)8px,rgb(121,24,188)100%);}"]
                ],
                [ //STYLE #3
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(248,5,5)0%,rgb(81,22,22)calc(100% - 62px),rgba(204,0,0)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(121, 3, 3)8px,rgb(176, 2, 2)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#c10101;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#c10101!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#6b0f0f!important;}#videos-footer-push-to-talk{background:#c10101}#videos-footer-push-to-talk:hover{background:#6b0f0f}#videos-footer-broadcast:hover{background:#6b0f0f}#videos-footer-broadcast{background:#c10101;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(15,5,5)8px,rgb(193,1,1)100%);}"]
                ],
                [ //STYLE #4
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(65,144,219)0%,rgb(7,69,97)calc(100% - 62px),rgb(37,179,222)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(26, 59, 75)8px,rgb(59, 130, 170)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,14,15)8px,rgb(83,182,239)100%);}"]
                ],
                [ //STYLE #5
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(0,158,5)0%,rgb(5,15,5)calc(100% - 62px),rgb(13,181,0)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,15,5)8px,rgb(14,104,7)100%);}"]
                ],
                [ //STYLE #6
                    ["#chat-wrapper{background: linear-gradient(0deg,rgb(119, 45, 2) 0%,rgb(24, 29, 30) 52%,rgb(234, 129, 38) 100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(226, 92, 19)8px,rgb(158, 73, 16)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(154, 51, 1)0%,rgba(255, 125, 0, 1)8px,rgba(255, 125, 0, 1)100%);}"]
                ],
                [ //STYLE #7
                    ["#chat-wrapper{background: linear-gradient(0deg,rgb(141, 36, 95)0%,rgba(191, 0, 255, 0.82)calc(100% - 62px),rgb(255, 0, 202)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(150, 0, 175)8px,rgb(176, 0, 226)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(94, 3, 62)0%,rgb(191, 0, 255)8px,rgb(71, 0, 20)100%);}"]
                ],
                [ //STYLE #8
                    ["#chat-wrapper{background:linear-gradient(0deg,rgba(0, 0, 0, 0.69)0%,rgba(0, 0, 0, 0.56)calc(100% - 62px),rgb(13, 179, 0)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(5, 15, 5, 0.72)8px,rgba(0, 0, 0, 0.42)100%);}"]
                ],
                [ //STYLE #9
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(65,144,219)0%,rgb(7,69,97)calc(100% - 62px),rgb(37,179,222)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(26, 59, 75)8px,rgb(59, 130, 170)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //STYLE #10
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(121,24,188)0%,rgb(36,15,45)calc(100% - 62px),rgb(121,24,188)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(83, 17, 128)8px,rgb(68, 15, 103)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#7918bc;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#7918bc!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#460b6f!important;}#videos-footer-push-to-talk{background:#7918bc}#videos-footer-push-to-talk:hover{background:#460b6f}#videos-footer-broadcast:hover{background:#460b6f}#videos-footer-broadcast{background:#7918bc;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //STYLE #11
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(0,158,5)0%,rgb(5,15,5)calc(100% - 62px),rgb(13,181,0)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //STYLE #12
                    ["#chat-wrapper{background: linear-gradient(0deg,rgb(141, 36, 95)0%,rgba(191, 0, 255, 0.82)calc(100% - 62px),rgb(255, 0, 202)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(150, 0, 175)8px,rgb(176, 0, 226)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //STYLE #13
                    ["#chat-wrapper{background: linear-gradient(0deg,rgb(119, 45, 2) 0%,rgb(24, 29, 30) 52%,rgb(234, 129, 38) 100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(226, 92, 19)8px,rgb(158, 73, 16)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ],
                [ //DEFAULT #14 BLACK/GREY UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #3B3B3B77 0%, #21212177 calc(100% - 62px), #3B3B3B77 100%) !important;}#HELL-chat-content > .message {background: #212121a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #212121DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #3B3B3B;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #3B3B3B, #212121) !important;border: 1px solid #212121;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #212121, #3B3B3B) !important;}#videos-footer-push-to-talk {background: #3B3B3B;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #212121, #3B3B3B);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #212121, #3B3B3B);}#videos-footer-broadcast {background: #3B3B3B;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#3b3c3b!important;}"],
                    ["#sidemenu {background: linear-gradient(15deg, rgba(33, 33, 33, .4) 0%, rgba(59, 59, 59, 0.2) 30%, rgba(33, 33, 33, 0.4) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #15 UPDATED SAND/GREY
                    ["#chat-wrapper{background:linear-gradient(45deg, #d7d2cc 0%, #304352 90%)!important;box-shadow:0 0 5px rgba(255,255,255,1)}#HELL-chat-content>.message{background:#304352a8;color:#fff;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black}"],
                    [".PMPopup .PMContent{background:#304352DB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#d7d2cc}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #d7d2cc, #304352)!important;border:1px solid #304352;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #304352, #d7d2cc)!important}#videos-footer-push-to-talk{background:#d7d2cc;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #304352, #d7d2cc)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #304352, #d7d2cc);}#videos-footer-broadcast{background:#d7d2cc;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#d7d6cc!important;}"],
                    ["#sidemenu{background:linear-gradient(15deg, rgba(215,210,204,0.95) 0%, rgba(48,67,82,0.75) 40%, rgba(215,210,204,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255,255,255,0.2)}"]
                ],
                [ //STYLE #16 UPDATED TITANIUM
                    ["#chat-wrapper{background:linear-gradient(45deg, #859398 0%, #283048 90%)!important;box-shadow:0 0 5px rgba(0,0,0,0.7)}#HELL-chat-content>.message{background:#283048a8;color:#fff;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black}"],
                    [".PMPopup .PMContent{background:#283048DB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#859398}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #859398, #283048)!important;border:1px solid #283048;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #283048, #859398)!important}#videos-footer-push-to-talk{background:#859398}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #283048, #859398)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #283048, #859398)}#videos-footer-broadcast{background:#859398}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#85a498!important;}"],
                    ["#sidemenu{background:linear-gradient(0deg, rgba(133,147,152,0.95) 0%, rgba(40,48,72,0.75) 30%, rgba(133,147,152,0.95) 100%);box-shadow:4px 0 6px -4px rgba(0,0,0,0.7)}"]
                ],
                [ //STYLE #17 UPDATED RED/TAN
                    ["#chat-wrapper{background:linear-gradient(45deg, #F4D58D 0%, #8D0801 90%)!important;box-shadow:0 0 10px rgba(0,0,0,0.5)}#HELL-chat-content>.message{background:#8D0801a8;color:#fff;text-shadow:-1px 0 #8D0801,0 1px #8D0801,1px 0 #8D0801,0 -1px #8D0801}"],
                    [".PMPopup .PMContent{background:#8D0801DB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#F4D58D}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #F4D58D, #8D0801)!important;border-left:2px solid #8D0801;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #8D0801, #F4D58D)!important}#videos-footer-push-to-talk{background:#F4D58D}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #8D0801, #F4D58D)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #8D0801, #F4D58D)}#videos-footer-broadcast{background:#F4D58D}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#f4dc8d!important;}"],
                    ["#sidemenu{background:linear-gradient(0deg, rgba(141,8,1,0.95) 0%, rgba(244,213,141,0.75) 30%, rgba(141,8,1,0.95) 100%);box-shadow:4px 0 6px -4px rgba(0,0,0,0.5)}"]
                ],
                [ //STYLE #18 UPDATED PURPLE/GREEN
                    ["#chat-wrapper{background:linear-gradient(0deg, #71B280 0%, #01084F calc(100% - 62px), #71B280 100%)!important;}#HELL-chat-content>.message{background:#01084Fa8;}.message{color:#fff;text-shadow:-1px 0 #01084f, 0 1px #01084f, 1px 0 #01084f, 0 -1px #01084f;}"],
                    [".PMPopup .PMContent{background:#01084FDB;}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper>.waiting{background:#71B280;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #71B280, #01084F)!important;border:1px solid #01084F;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #01084F, #71B280)!important;}#videos-footer-push-to-talk{background:#71B280;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #01084F, #71B280);}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #01084F, #71B280);}#videos-footer-broadcast{background:#71B280;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#71c380!important;}"],
                    ["#sidemenu{background:linear-gradient(0deg, rgba(113,178,128,0.95) 0%, rgba(19,78,94,0.75) 30%, rgba(113,178,128,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #19 UPDATED PINK/BLUE
                    ["#chat-wrapper{background:linear-gradient(0deg, #FF7A7A 0%, #003366 calc(100% - 62px), #FF7A7A 100%)!important;}#HELL-chat-content>.message{background:#003366a8;}.message{color:#fff;text-shadow:-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;}"],
                    [".PMPopup .PMContent{background:#003366DB;}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #FFD700 8px, #FF8C00 100%);}#videos-footer-broadcast-wrapper>.waiting{background:#FF7A7A;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #FF7A7A, #003366)!important;border:1px solid #003366;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #003366, #FF7A7A)!important;}#videos-footer-push-to-talk{background:#FF7A7A;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #003366, #FF7A7A);}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #003366, #FF7A7A);}#videos-footer-broadcast{background:#FF7A7A;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#ff8b7a!important;}"],
                    ["#sidemenu{background:linear-gradient(0deg, rgba(255,122,122,1) 0%, rgba(0,51,102,0.75) 30%, rgba(255,122,122,1) 100%);box-shadow:4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #20 UPDATED OLIVE GREEN/PURPLE
                    ["#chat-wrapper{background:linear-gradient(0deg, #6B8E23 0%, #800080 calc(100% - 62px), #6B8E23 100%)!important;}#HELL-chat-content>.message{background:#800080a8;}.message{color:#fff;text-shadow:-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;}"],
                    [".PMPopup .PMContent{background:#6B8E23DB;}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #FFD700 8px, #FF8C00 100%);}#videos-footer-broadcast-wrapper>.waiting{background:#6B8E23;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #6B8E23, #800080)!important;border:1px solid #800080;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #800080, #6B8E23)!important;}#videos-footer-push-to-talk{background:#6B8E23;}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #800080, #6B8E23);}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #800080, #6B8E23);}#videos-footer-broadcast{background:#6B8E23;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#6b9d23!important;}"],
                    ["#sidemenu{background:linear-gradient(15deg, rgb(107, 142, 35), rgba(128, 0, 128,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #21 UPDATED ORANGE/BLUE
                    ["#chat-wrapper {background: linear-gradient(0deg, #F4A261 0%, #2A9D8F calc(100% - 62px), #F4A261 100%) !important;}#HELL-chat-content > .message {background: #2A9D8FCC;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #2A9D8FDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #F4A261;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #F4A261, #2A9D8F) !important;border: 1px solid #2A9D8F;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #2A9D8F, #F4A261) !important;}#videos-footer-push-to-talk {background: #F4A261;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #2A9D8F, #F4A261);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #2A9D8F, #F4A261);}#videos-footer-broadcast {background: #F4A261;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#F4B361!important;}"],
                    ["#sidemenu {background: linear-gradient(15deg, rgba(42,157,143,1) 0%, rgba(244,162,97,0.75) 40%, rgba(42,157,143, 1) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #22 GREY UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #848484 0%, #6A6A6A calc(100% - 62px), #848484 100%) !important;}#HELL-chat-content > .message {background: #6A6A6Aa8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #6A6A6ADB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #848484;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #848484, #6A6A6A) !important;border: 1px solid #6A6A6A;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #6A6A6A, #848484) !important;}#videos-footer-push-to-talk {background: #848484;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #6A6A6A, #848484);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #6A6A6A, #848484);}#videos-footer-broadcast {background: #848484;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#848984!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(106, 106, 106, 1 0%, rgba(132, 132, 132, 0.75) 30%, rgba(106, 106, 106, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #23 ARMY UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #7C7106 0%, #4C4504 calc(100% - 62px), #7C7106 100%) !important;}#HELL-chat-content > .message {background: #4C4504a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #4C4504DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #7C7106;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #7C7106, #4C4504) !important;border: 1px solid #4C4504;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #4C4504, #7C7106) !important;}#videos-footer-push-to-talk {background: #7C7106;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #4C4504, #7C7106);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #4C4504, #7C7106);}#videos-footer-broadcast {background: #7C7106;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#7c8206!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(76, 69, 4, 1) 0%, rgba(124, 113, 6, 0.75) 30%, rgba(76, 69, 4, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #24 UPDATED SHERBERT
                    ["#chat-wrapper{background:linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)!important;box-shadow:0 0 5px rgba(255,255,255,1)}#HELL-chat-content>.message{background:#01084Fa8;color:#fff;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black}"],
                    [".PMPopup .PMContent{background:#01084FDB}.PMPopup h2{background:linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%)}#videos-footer-broadcast-wrapper>.waiting{background:#FA8BFF}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:linear-gradient(45deg, #FA8BFF, #01084F)!important;border-left: 3px solid #01084F;box-shadow:0 2px 4px rgba(0,0,0,0.2)}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:linear-gradient(45deg, #01084F, #FA8BFF)!important}#videos-footer-push-to-talk{background:#FA8BFF}#videos-footer-push-to-talk:hover{background:linear-gradient(45deg, #01084F, #FA8BFF)}#videos-footer-broadcast:hover{background:linear-gradient(45deg, #01084F, #FA8BFF)}#videos-footer-broadcast{background:#FA8BFF;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#FA8BFF!important;}"],
                    ["#sidemenu{background:linear-gradient(0deg, rgba(250,139,255,0.95) 0%, rgba(43,210,255,0.75) 30%, rgba(250,139,255,0.95) 100%);box-shadow:4px 0 6px -4px rgba(255,255,255,0.2)}"]
                ],
                [ //STYLE #25 ORANGE UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #F69C3C 0%, #F4830B calc(100% - 62px), #F69C3C 100%) !important;}#HELL-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #F4830BDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #F69C3C;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #F69C3C, #F4830B) !important;border: 1px solid #F4830B;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #F4830B, #F69C3C) !important;}#videos-footer-push-to-talk {background: #F69C3C;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #F4830B, #F69C3C);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #F4830B, #F69C3C);}#videos-footer-broadcast {background: #F69C3C;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#f6ad3c!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(244, 131, 11, 1) 0%, rgba(246, 156, 60, 0.75) 30%, rgba(244, 131, 11, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #26 GREEN UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #75BD81 0%, #52AD62 calc(100% - 62px), #75BD81 100%) !important;}#HELL-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #52AD62DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #75BD81;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #75BD81, #52AD62) !important;border: 1px solid #52AD62;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #52AD62, #75BD81) !important;}#videos-footer-push-to-talk {background: #75BD81;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #52AD62, #75BD81);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #52AD62, #75BD81);}#videos-footer-broadcast {background: #75BD81;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#75ce81!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(82, 173, 98, 0.95) 0%, rgba(117, 189, 129, 0.75) 30%, rgba(82, 173, 98, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #27 SEAWATER UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #53C7DF 0%, #28B9D7 calc(100% - 62px), #53C7DF 100%) !important;}#HELL-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #28B9D7DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #53C7DF;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #53C7DF, #28B9D7) !important;border: 1px solid #28B9D7;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #28B9D7, #53C7DF) !important;}#videos-footer-push-to-talk {background: #53C7DF;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #28B9D7, #53C7DF);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #28B9D7, #53C7DF);}#videos-footer-broadcast {background: #53C7DF;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#53d8df!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(40, 185, 215, 0.95) 0%, rgba(83, 199, 223, 0.75) 30%, rgba(40, 185, 215, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #28 PURPLE UPDATED
                    ["#chat-wrapper{background: linear-gradient(0deg, #7918bc 0%, #24152d calc(100% - 62px), #7918bc 100%) !important;}#HELL-chat-content > .message{background: #101314a8;}.message{color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #2d373aDB;}.PMPopup h2{background: linear-gradient(0deg, #000 0%, #531180 8px, #441769 100%);}#videos-footer-broadcast-wrapper > .waiting{background: #7918bc;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{background: #7918bc !important;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover{background: #460b6f !important;}#videos-footer-push-to-talk{background: #7918bc;}#videos-footer-push-to-talk:hover{background: #460b6f;}#videos-footer-broadcast:hover{background: #460b6f;}#videos-footer-broadcast{background: #7918bc;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(53, 22, 73, 0.95) 0%, rgba(121, 24, 188, 0.75) 30%, rgba(53, 22, 73, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #29 PURPLE/BLUE UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #631E50 0%, #01084F calc(100% - 62px), #631E50 100%) !important;}#HELL-chat-content > .message {background: #01084Fa8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #01084FDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #631E50;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #631E50, #01084F) !important;border: 1px solid #01084F;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #01084F, #631E50) !important;}#videos-footer-push-to-talk {background: #631E50;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #01084F, #631E50);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #01084F, #631E50);}#videos-footer-broadcast {background: #631E50;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#632d50!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(1, 8, 79, 0.95) 0%, rgba(99, 30, 80, 0.75) 30%, rgba(1, 8, 79, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.2);}"]
                ],
                [ //STYLE #30 PINK #1 UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #fcd1d5 0%, #f69dc6 calc(100% - 62px), #fcd1d5 100%) !important;}#HELL-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #f69dc6DB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #fcd1d5;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #fcd1d5, #f69dc6) !important;border: 1px solid #f69dc6;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #f69dc6, #fcd1d5) !important;}#videos-footer-push-to-talk {background: #fcd1d5;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #f69dc6, #fcd1d5);}#videos-footer-broadcast:hover {background: linear-gr,adient(45deg, #f69dc6, #fcd1d5);}#videos-footer-broadcast {background: #fcd1d5;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#fce2d5!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(246, 157, 198, 0.95) 0%, rgba(252, 209, 213, 0.75) 30%, rgba(246, 157, 198, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #31 PINK #2 UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #B87A88 0%, #A6596B calc(100% - 62px), #B87A88 100%) !important;}#HELL-chat-content > .message {background: #A6596Ba8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #A6596BDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #B87A88;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #B87A88, #A6596B) !important;border: 1px solid #A6596B;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #A6596B, #B87A88) !important;}#videos-footer-push-to-talk {background: #B87A88;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #A6596B, #B87A88);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #A6596B, #B87A88);}#videos-footer-broadcast {background: #B87A88;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#b88b88!important;}"],
                    ["#sidemenu {background: linear-gradient(0deg, rgba(166, 89, 107, 0.95) 0%, rgba(184, 122, 136, 0.85) 30%, rgba(166, 89, 107, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #32 PINK #3 UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #F039B1 0%, #E305AD calc(100% - 62px), #F039B1 100%) !important;}#HELL-chat-content > .message {background: #272f31a8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #E305ADDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #F039B1;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #F039B1, #E305AD) !important;border: 1px solid #E305AD;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #E305AD, #F039B1) !important;}#videos-footer-push-to-talk {background: #F039B1;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #E305AD, #F039B1);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #E305AD, #F039B1);}#videos-footer-broadcast {background: #F039B1;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#f04ab1!important;}"],
                    ["#sidemenu {background: linear-gradient(5deg, rgba(240, 57, 177, 1) 0%, rgba(227, 5, 173, 0.85) 40%, rgba(240, 57, 177, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #33 PINK #4 UPDATED
                    ["#chat-wrapper {background: linear-gradient(0deg, #CC66CC 0%, #BF40BF calc(100% - 62px), #CC66CC 100%) !important;}#HELL-chat-content > .message {background: #BF40BFa8;}.message {color: #fff;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent {background: #BF40BFDB;}.PMPopup h2 {background: linear-gradient(0deg, #000 0%, #3e5e73 8px, #33515e 100%);}#videos-footer-broadcast-wrapper > .waiting {background: #CC66CC;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {background: linear-gradient(45deg, #CC66CC, #BF40BF) !important;border: 1px solid #BF40BF;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {background: linear-gradient(45deg, #BF40BF, #CC66CC) !important;}#videos-footer-push-to-talk {background: #CC66CC;}#videos-footer-push-to-talk:hover {background: linear-gradient(45deg, #BF40BF, #CC66CC);}#videos-footer-broadcast:hover {background: linear-gradient(45deg, #BF40BF, #CC66CC);}#videos-footer-broadcast {background: #CC66CC;}#videos-footer-broadcast-wrapper.active > #videos-footer-broadcast{background-color:#cc77cc!important;}"],
                    ["#sidemenu {background: linear-gradient(5deg, rgba(191, 64, 191, 1) 0%, rgba(204, 102, 204, 0.85) 30%, rgba(191, 64, 191, 0.95) 100%);box-shadow: 4px 0 6px -4px rgba(255, 255, 255, 0.2);}"]
                ],
                [ //STYLE #34 UPDATED
                    ["#HELL-chat-content>.message{ background: #262b30; }#chat-wrapper{background: #373f45 !important;}#HELL-chat-content>.message{background:#262b30a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background: #394551DB;}.PMPopup h2 {background: #373f45;}#videos-footer-broadcast-wrapper>.waiting{background: #6ca5d6;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background: #6ca5d6 !important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background: #507c9e !important;}#videos-footer-push-to-talk{background: #6ca5d6;}#videos-footer-push-to-talk:hover{background: #507c9e;}#videos-footer-broadcast:hover{background: #507c9e;}#videos-footer-broadcast{background: #6ca5d6;}"],
                    ["#sidemenu{background: #373f45;}"]
                ],                
                [ //STYLE #35
                    ["#chat-wrapper{background:linear-gradient(0deg,rgb(248,5,5)0%,rgb(81,22,22)calc(100% - 62px),rgba(204,0,0)100%)!important;}#HELL-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"],
                    [".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(121, 3, 3)8px,rgb(176, 2, 2)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#c10101;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#c10101!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#6b0f0f!important;}#videos-footer-push-to-talk{background:#c10101}#videos-footer-push-to-talk:hover{background:#6b0f0f}#videos-footer-broadcast:hover{background:#6b0f0f}#videos-footer-broadcast{background:#c10101;}"],
                    ["#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"]
                ]
            ];
            //INSERT SCRIPT
            var script = document.createElement("script"),
                elem = document.getElementsByTagName("script")[0];
            script.text = 'var StationSelected = 0,\n	StationPlay = false,\n	StationVol = 1;\nfunction VolStation(elem, vol){\n	var StationElem = elem.parentElement.nextSibling;\n	var StationVolElem = elem.parentElement.querySelector(".music-radio-info>.volume");\nStationVol += vol;\n	if (StationVol < 0){\n		StationVol = 0;\n	} else if (StationVol > 1) {\n		StationVol = 1.0;\n	}\n	StationElem.volume = StationVol;\nStationVolElem.style.width=((StationVol * 100)+"%");}\nfunction PlayPauseStation(elem) {\n	var StationPlayPauseBtn = elem.parentElement.querySelector(".music-radio-playpause");\n var StationElem=elem.parentElement.nextSibling;\nvar StationDescElem=elem.parentElement.querySelector(".music-radio-info>.description");\n	StationPlay=!StationPlay;\n	if (StationPlay) {\n		StationElem.volume = StationVol;\n		StationElem.play();\n StationPlayPauseBtn.innerText="❚❚";	StationDescElem.innerText = ("Playing: "+window.HELLRadioStations[StationSelected][0]+"\\nURL: "+window.HELLRadioStations[StationSelected][1]);\n} else {\n		StationElem.pause();\nStationPlayPauseBtn.innerText="▶";\n	StationDescElem.innerText = ("Paused: "+window.HELLRadioStations[StationSelected][0]+"\\nURL: "+window.HELLRadioStations[StationSelected][1]);}\n}\nfunction SeekStation(elem, direction) {\n	var StationElem = elem.parentElement.nextSibling;\n	var StationDescElem = elem.parentElement.querySelector(".music-radio-info>.description");\nvar StationPlayPauseBtn = elem.parentElement.querySelector(".music-radio-playpause");\n	StationPlay = true;\n	StationSelected += direction;\n	\n	if (StationSelected > window.HELLRadioStations.length-1) {\n		StationSelected = 0;\n	} else if (StationSelected < 0){\n		StationSelected = window.HELLRadioStations.length-1;\n	}\n	StationElem.pause();\n	StationElem.setAttribute("src", window.HELLRadioStations[StationSelected][1]);\n	StationElem.load();\n	StationElem.volume = StationVol;\nStationPlayPauseBtn.innerText="❚❚";\n	StationElem.play();\nStationDescElem.innerText = ("Playing: "+window.HELLRadioStations[StationSelected][0]+"\\nURL: "+window.HELLRadioStations[StationSelected][1]);\n}';
            elem.parentNode.insertBefore(script, elem);
            //LOCALSETTINGS
            HELL.enablePMs = window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enablePMs;
            HELL.enableSound = window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enableSound;
            //TTS (TEXT-TO-SPEECH)
            if (HELL.enableSound === true && "speechSynthesis" in window) {
                HELL.TTS.synth = window.speechSynthesis;
                HELL.TTS.voices = HELL.TTS.synth.getVoices();
            }
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
            var insert = TitleElement.querySelector('span[title="Settings"]');
            VideoListElement.querySelector("#videos-header").appendChild(insert);
            //INSERT HTML/CSS
            if (!HELL.Project.isTouchScreen) {
                insert = VideoListElement.querySelector("#videos-footer-broadcast-wrapper");
                VideoListElement.querySelector("#videolist").appendChild(insert);
                VideoListElement.querySelector("#videos-footer").insertAdjacentHTML("afterbegin", "Media");
                VideoListElement.querySelector("#videos-footer").insertAdjacentHTML("beforeend", '<div id="music-radio"><div class="music-radio-info"><div class="description">Playing: None<br>URL: None</div><div class="volume"></div></div><button class="music-radio-seek" onclick="SeekStation(this,-1);">&#8592;</button><button class="music-radio-seek" onclick="SeekStation(this,1);">&#8594;</button><button class="music-radio-playpause" onclick="PlayPauseStation(this);">&#9654;</button><button class="music-radio-vol" onclick="VolStation(this,.05);">&#43;</button><button class="music-radio-vol" style="top:50%" onclick="VolStation(this,-.05);">&#45;</button></div><audio id="music-radio-audio" src="' + window.HELLRadioStations[0][1] + '"></audio>');
                TitleCSS += "span[title=\"Follow\"], span[title=\"Share room\"]{display:none!important;}";
            } else {
                VideoCSS = ".video>div{border-radius:10px;}#youtube.video > div > .overlay, .video > div > .overlay {display: block!important;}#videos-footer-broadcast{border-radius:unset!important;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{border-radius:unset;}#videos-footer-push-to-talk{margin-left:0!important;border-radius:unset;}#videos-footer-youtube, #videos-footer-soundcloud{min-width:35px;border-radius:unset;margin-right: 0;}@media screen and (max-width: 600px){#videos{top:38px;}#videos-footer-broadcast, #videos-footer-broadcast-wrapper.hide-submenu > #videos-footer-broadcast {height:50px;line-height:50px;}#videos-footer{min-height: 50px;padding:0}}span[title=\"Settings\"]>svg{padding:7px 10px;height:24px;width:24px;}#videolist[data-mode=\"dark\"]{background-color:unset;}#videos-footer-broadcast-wrapper{display:contents;}.video:after{content: unset;border:unset;}#videos-header{padding:0;background:#181d1e;}.HELLdrop{position:fixed;display:inline-block;top:3px;left:4px;z-index:5;min-width: 46px;}.HELLdrop-content{position:absolute;top:28px;right:0;background:#181d1e;min-width:46px;width: 46px;padding:0;z-index:1;display:none;}.HELLdrop:hover .HELLdrop-content{display:block;}.HELLoptions:hover{background:#53b6ef}.HELLoptions{width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #181d1e75;border: none;padding: 5% 0;display: inline-block;}";
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
            VideoListElement.querySelector("#videos-header").insertAdjacentHTML("afterbegin", "<button style=\"display:" + ((HELL.Project.isTouchScreen) ? "none" : "block") + "\" class=\"tcsettings\">←</button>");
            VideoListElement.querySelector("#videos-content").insertAdjacentHTML("beforeend", '<div id="popup" class="PMOverlay"></div>');
            VideoListElement.querySelector("#videolist").insertAdjacentHTML("afterbegin", '<div class="HELLdrop"><button class="HELLoptions" title="script ptions"><img src="https://i.imgur.com/nvr9FjM.png" /></button><div class="HELLdrop-content"><div style="height:6px;background:#624482;"></div><button id="BackgroundUpdateRight" class="HELLoptions" title="Background"><img src="https://i.imgur.com/Zn97vqS.png" /></button><button id="BackgroundUpdateLeft" class="HELLoptions" title="Background"><img src="https://i.imgur.com/OAcfZRy.png" /></button><div style="height:6px;background:#624482;"></div><button id="FontSizeUpdate" class="HELLoptions" title="Font Size"><img src="https://i.imgur.com/eVc0N5A.png" /></button><div style="height:6px;background:#624482;"></div><button id="ChatColor" class="HELLoptions" title="Chat Style"><img src="https://i.imgur.com/62jpRbt.png" /></button><button id="CameraBorderToggled" class="HELLoptions" title="Camera Border"><img src="https://i.imgur.com/BXK3MR2.png" /></button><button id="GamePreventionToggled" class="HELLoptions" title="Hide Bot Messages"><img src="https://i.imgur.com/MrojvOu.png" /></button><button id="FeaturedToggled" class="HELLoptions" title="YouTube/Featured Resize"><img src="https://i.imgur.com/u8mBZYJ.png" /></button>' + ((!HELL.ThemeChange) ? '<button id="ChatWidthToggled" class="HELLoptions" title="chat width resize"><img src="https://i.imgur.com/G95jVFI.png" /></button><button id="ChatHeightToggled" class="HELLoptions" title="chat height resize"><img src="https://i.imgur.com/AGc7mLN.png" /></button><div style="height:6px;background:#624482;"></div>' : '') + '<button id="PerformanceModeToggled" class="HELLoptions" title="performance mode"><img src="https://i.imgur.com/qoKTU4y.png" /></button>' + ((!HELL.Project.isTouchScreen) ? '<div style="height:6px;background:#624482;"></div><button id="ThemeChange" class="HELLoptions" title="switch theme mode"><img src="https://i.imgur.com/NF6U3Us.png" /></button></div></div>' : ''));
            ChatLogElement.querySelector("#chat-position").insertAdjacentHTML("afterbegin", '<div id="notification-content"></div><button class="notifbtn">▼</button>');
            ChatLogElement.querySelector("#chat").insertAdjacentHTML("beforeend", '<div id="HELL-chat-content"></div>');
            ChatLogElement.querySelector("#chat").insertAdjacentHTML("afterend", '<div class="HELL-message-unread" style="display:none;">there are unread messages...</div>');
            //SCRIPT INIT -> PREPARE()
            clearInterval(HELL.ScriptLoading);
            HELL.ScriptInit = true;
            HELLRoomPrepare();
        }
     
        function HELLRoomPrepare() {
            //FUNCTION BYPASS
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
            if (!HELL.Project.isTouchScreen) {
                window.TinychatApp.BLL.ChatRoom.prototype.BroadcastStart = function(a) {
                    var b = this,
                        d = this.settings.getSettings();
                    if (d.video === null) {
                        return void this.app.MediaSettings(() => {
                            this.BroadcastStart();
                        });
                    }
                    this.videolist.AddingVideoSelf(this.self_handle);
                    var e = {};
                    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                        e.audio = true;
                        e.video = {
                            width: {
                                min: 320,
                                max: 4096
                            },
                            height: {
                                min: 240,
                                max: 2160
                            },
                            frameRate: {
                                min: 15,
                                ideal: 30,
                                max: 60
                            }
                        };
                    } else {
                        navigator.mediaDevices.enumerateDevices().then(g => {
                            var h = false;
                            var len = g.length;
                            for (var c = 0; c < len; c++) {
                                if (g[c].kind === "videoinput") {
                                    if (e.video === void 0) e.video = {
                                        width: {
                                            min: 320,
                                            max: 4096
                                        },
                                        height: {
                                            min: 240,
                                            max: 2160
                                        },
                                        frameRate: {
                                            min: 15,
                                            ideal: 30,
                                            max: 60
                                        }
                                    };
                                    if (h) {
                                        d.video = g[c];
                                        h = false;
                                        this.settings.saveSettings(d);
                                    } else if (d.video === null) {
                                        d.video = g[c];
                                        this.settings.saveSettings(d);
                                    } else if (d.video !== null && typeof d.video == "object" && d.video.deviceId == g[c].deviceId && d.video.deviceId !== a) {
                                        e.video.deviceId = {
                                            exact: d.video.deviceId
                                        };
                                    } else if (d.video.deviceId === a) {
                                        h = true;
                                    }
                                }
                                if (g[c].kind === "audioinput") {
                                    if (e.audio === void 0) e.audio = {};
                                    if (d.audio !== null && typeof d.audio == "object" && d.audio.deviceId == g[c].deviceId) {
                                        e.audio = {
                                            deviceId: {
                                                exact: d.audio.deviceId
                                            },
                                        };
                                    }
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
                                var m = new window.TinychatApp.BLL.BroadcastProgressEvent(window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START);
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
                var b = ((a.isUsername)?a.username:a.nickname);
                if (this.isIgnored(a) || this.ignored.push(b)) {
                    var c = new window.TinychatApp.BLL.IgnorelistUpdateUserEvent(a);
                    this.EventBus.broadcast(window.TinychatApp.BLL.IgnorelistUpdateUserEvent.ID, c);
                    this.app.showToast(b + " ignored until they leave or you refresh.");
                    if (!a.isUsername) {
                        HELL.TempIgnoreNickList.push(b.toUpperCase());
                    } else {
                        HELL.TempIgnoreUserList.push(b.toUpperCase());
                    }
                }
            };
            window.TinychatApp.BLL.Userlist.prototype.unignore = function(a) {
                var b = ((a.isUsername)?a.username:a.nickname),
                    index = this.ignored.indexOf(b);
                if (index != -1) this.ignored.splice(index, 1);
                if (!a.isUsername) {
                    index = HELL.TempIgnoreNickList.indexOf(b.toUpperCase());
                    if (index != -1) HELL.TempIgnoreNickList.splice(index, 1);
                } else {
                    index = HELL.TempIgnoreUserList.indexOf(b.toUpperCase());
                    if (index != -1) HELL.TempIgnoreUserList.splice(index, 1);
                }
                var e = new window.TinychatApp.BLL.IgnorelistUpdateUserEvent(a);
                this.EventBus.broadcast(window.TinychatApp.BLL.IgnorelistUpdateUserEvent.ID, e);
                this.app.showToast(a.username + " unignored.");
            };
            if (HELL.StorageSupport) {
                window.TinychatApp.BLL.SettingsFeature.prototype.getSettings = function() {
                    var A = this._get("tinychat_settings");
                    try {
                        A = Object.assign(new window.TinychatApp.DAL.SettingsEntity(), JSON.parse(A));
                    } catch (E) {}
                    if (A !== undefined) {
                        HELL.enableSound = A.enableSound;
                        if (HELL.enablePMs !== A.enablePMs) {
                            HELL.enablePMs = A.enablePMs;
                            PMShow();
                        }
                    }
                    return ((void 0 == A || "object" !== typeof A) && (A = new window.TinychatApp.DAL.SettingsEntity()) || A);
                };
            }
            window.TinychatApp.BLL.ChatRoom.prototype.prepareStream = function(a) {
                function b() {
                    if (null == c.mediaStreamCanvas) return;
                    d.clearRect(0, 0, c.mediaStreamCanvas.width, c.mediaStreamCanvas.height);
                    var a = c.mediaStreamVideo.videoHeight,
                        e = c.mediaStreamVideo.videoWidth;
                    c.mediaStreamCanvas.width = e;
                    c.mediaStreamCanvas.height = a;
                    window.TinychatApp.BLL.VideoFilters.getFilter(HELL.MediaStreamFilter).apply(d, e, a);
                    d.drawImage(c.mediaStreamVideo, 0, 0, e, a, 0, 0, c.mediaStreamCanvas.width, c.mediaStreamCanvas.height);
                    requestAnimationFrame(b);
                }
                this.mediaStreamOrigin = a;
                this.mediaStreamVideo = document.createElement("video");
                this.mediaStreamVideo.srcObject = this.mediaStreamOrigin;
                this.mediaStreamVideo.pause();
                this.mediaStreamVideo.oncanplay = function() {
                    requestAnimationFrame(b);
                };
                this.mediaStreamVideo.autoplay = !0;
                this.mediaStreamVideo.muted = !0;
                this.mediaStreamCanvas = document.createElement("canvas");
                var c = this,
                    d = this.mediaStreamCanvas.getContext("2d");
                this.mediaStreamVideo.play();
                var e = this.mediaStreamCanvas.captureStream(15);
                return (e.addTrack(this.mediaStreamOrigin.getAudioTracks()[0]) || e);
            };
            window.TinychatApp.BLL.ChatRoom.prototype.applyFilter = function(a) {
                this.mediaStreamFilter = a;
                HELL.MediaStreamFilter = a;
                Save("MediaStreamFilter", HELL.MediaStreamFilter);
            };
            window.TinychatApp.BLL.Videolist.prototype.toggleHiddenVW = function(a) {
                var b = window.TinychatApp.getInstance().defaultChatroom._videolist.items.indexOf(a);
                if (b != -1) {
                    var username = a.userentity.username.toUpperCase(),
                        index = HELL.HiddenCameraList.indexOf(username.toUpperCase());
                    if(username === "GUEST") {
                        a.hidden = !a.hidden;
                    } else {
                        if (a.hidden) {
                            a.hidden = false;
                            if (index !== -1) {
                                //REMOVE
                                if (arguments[1] === undefined) {
                                    debug("HIDDENCAMERALIST::", "REMOVE USER " + username + " FROM HIDDENCAMERALIST");
                                    //Alert(GetActiveChat(), "✓ removed " + username + " from hidden camera list.");
                                    MessagePopUp(-1, "✓ removed " + username + " from hidden camera list.", true, true);
                                    CommandList.hiddencameraremove(index);
                                }
                            }
                        } else {
                            a.hidden = true;
                            if (index === -1) {
                                //ADD
                                if (arguments[1] === undefined) {
                                    debug("HIDDENCAMERALIST::", "ADD USER " + username + " TO HIDDEN CAMERA LIST");
                                    //Alert(GetActiveChat(), "✓ added " + username + " to hidden camera list.");
                                    MessagePopUp(-1, "✓ added " + username + " to hidden camera list.", true, true);
                                    CommandList.hiddencameraadd(username);
                                }
                            }
                        }
                    }
                    a.mute = ((HELL.Me.username === username) ? true : a.mute);
                    window.TinychatApp.getInstance().defaultChatroom._videolist._pauseMediaStream(a.mediastream, a.hidden);
                    if (!a.hidden) window.TinychatApp.getInstance().defaultChatroom._videolist._muteMediaStream(a.mediastream, a.mute);
                    let d = new window.TinychatApp.BLL.VideolistEvent(window.TinychatApp.BLL.VideolistAction.Update,a,b);
                    window.TinychatApp.getInstance().defaultChatroom._videolist.EventBus.broadcast(window.TinychatApp.BLL.VideolistEvent.ID, d);
                }
            };
            window.fullscreenManager.status = () =>{
                if (HELL.isFullScreen !== (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen)) {
                    HELL.isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    // Fix FullScreen
                    MainElement.querySelector("#room").classList.toggle("full-screen");
                }
                return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            };
            //REMOVE
            Remove(ChatLogElement, 'span[id="input-unread"]');
            Remove(ChatLogElement, "#chat-content");
            //SETTINGS PREPARE
            if (HELL.enablePMs === false) PMShow();
            //LOAD
            HELLRoomLoad();
        }
     
        function HELLRoomLoad() {
            var element;
            //EVENT LISTENERS
            if (!HELL.ThemeChange) {
                // BOOT UP OG THEME
                var finishoff = false;
                while (HELL.OGStyle.SavedHeight !== HELL.OGStyle.HeightCounter || HELL.OGStyle.SavedWidth !== HELL.OGStyle.WidthCounter) {
                    if (HELL.OGStyle.SavedHeight !== HELL.OGStyle.HeightCounter) {
                        ChatHeightToggled();
                    } else {
                        finishoff = true;
                    }
                    if (HELL.OGStyle.SaveWidth !== HELL.OGStyle.WidthCounter && finishoff) ChatWidthToggled();
                }
                VideoListElement.querySelector("#ChatHeightToggled").addEventListener("click", function() {
                    ChatHeightToggled();
                    Save("OGStyleHeight", HELL.OGStyle.HeightCounter);
                }, {
                    passive: true
                });
                VideoListElement.querySelector("#ChatWidthToggled").addEventListener("click", function() {
                    ChatWidthToggled();
                    Save("OGStyleWidth", JSON.stringify(HELL.OGStyle.WidthCounter));
                }, {
                    passive: true
                });
            } else {
                if (!HELL.Project.isTouchScreen) {
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
                var len = HELL.UserList.length,
                    t = "Users : " + len + "\n",
                    c;
                for (c = 0; c < len; c++) {
                    if (c) { // 0 = false
                        t += ", ";
                        if (c % 10 === 0) t += "\n";
                    }
                    t += HELL.UserList[c].username + " (" + HELL.UserList[c].nick + ")";
                }
                t += "\n\n";
                len = HELL.Message[GetActiveChat()].length;
                for (c = 0; c < len; c++) t += "[" + HELL.Message[GetActiveChat()][c].time + "][" + HELL.Message[GetActiveChat()][c].username + "(" + HELL.Message[GetActiveChat()][c].nick + ")]: " + (HELL.Message[GetActiveChat()][c].msg.replace(/(\r\n|\n|\r)/gm, "") + "\n");
                Export("TinyChat_" + HELL.Room.Name.toUpperCase() + " " + DateTime() + ".log", "Room : " + HELL.Room.Name + "\n" + t);
            }, {
                passive: true
            });
            element = document.createElement("button");
            element.setAttribute("id", "chat-export");
            element.setAttribute("class", "chat-button");
            element.setAttribute("title", "Export your saved settings");
            ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
            ChatLogElement.querySelector("#chat-export").textContent = "📤";
            ChatLogElement.querySelector("#chat-export").addEventListener("click", function() {
                var tempobj = {};
                for (var i = 0; i < localStorage.length; i++){
                    if (localStorage.key(i).substring(0,4) == 'HELL_') {
                        tempobj[localStorage.key(i)] = localStorage[localStorage.key(i)];
                    }
                }
                Export("HELL_Settings_" + DateTime() + ".backup", JSON.stringify(tempobj));
            }, {
                passive: true
            });
            element = document.createElement("label");
            element.setAttribute("for", "chat-import");
            element.setAttribute("class", "chat-button");
            element.setAttribute("title", "Import your saved settings");
            element.setAttribute("id", "chat-import-label");
            ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
            ChatLogElement.querySelector("#chat-import-label").textContent = "📥";
            element = document.createElement("input");
            element.setAttribute("type", "file");
            element.setAttribute("id", "chat-import");
            ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
            ChatLogElement.querySelector("#chat-import").addEventListener('change', function(e) {
                var file = ChatLogElement.querySelector("#chat-import").files[0],
                    reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function() {
                    try {
                        var resp = JSON.parse(reader.result);
                        if (resp !== null) {
                            var keys = Object.keys(resp),
                                ready = true;
                            Alert(GetActiveChat(), "..scanning backup..");
                            for (var a = 0; a < keys.length; a++) {
                                if (keys[a].substring(0,4) !== 'HELL_') ready = false;
                            }
                            if (ready) {
                                Alert(GetActiveChat(), "..looks ok..");
                                var localkeys = Object.keys(localStorage),
                                    locallen = localkeys.length;
                                Alert(GetActiveChat(), "..clearing storage..");
                                for (var b = 0; b < locallen; b++) {
                                    if (localkeys[b].substring(0, 4) === "HELL_") localStorage.removeItem(localkeys[b]);
                                }
                                Alert(GetActiveChat(), "..cleared. applying Backup..");
                                for (var c = 0; c < keys.length; c++) {
                                    localStorage.setItem(keys[c], resp[keys[c]]);
                                }
                                Alert(GetActiveChat(), "✓ done. refreshing..");
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
     
            if (!HELL.Project.isTouchScreen) {
                VideoListElement.querySelector("#ThemeChange").addEventListener("click", function() {
                    HELL.ThemeChange = !HELL.ThemeChange;
                    Save("ThemeChange", JSON.stringify(HELL.ThemeChange));
                    location.reload();
                }, {
                    passive: true
                });
            }
            VideoListElement.querySelector("#PerformanceModeToggled").addEventListener("click", function() {
                if (HELL.ChatDisplay) {
                    HELL.PerformanceMode = !HELL.PerformanceMode;
                    Save("PerformanceMode", JSON.stringify(HELL.PerformanceMode));
                    PerformanceModeInit(HELL.PerformanceMode);
                }
            }, {
                passive: true
            });
            VideoListElement.querySelector("#FeaturedToggled").addEventListener("click", function() {
                HELL.Featured = !HELL.Featured;
                Save("Featured", JSON.stringify(HELL.Featured));
                FeaturedCameras(HELL.Featured);
                Resize();
            }, {
                passive: true
            });
            VideoListElement.querySelector("#CameraBorderToggled").addEventListener("click", function() {
                HELL.CameraBorderToggle = !HELL.CameraBorderToggle;
                Save("CameraBorderToggle", JSON.stringify(HELL.CameraBorderToggle));
                Cameras();
                Resize();
            }, {
                passive: true
            });
            VideoListElement.querySelector("#GamePreventionToggled").addEventListener("click", function() { //testing
                CommandList.gameview();
            }, {
                passive: true
            });
            VideoListElement.querySelector("#ChatColor").addEventListener("click", function() {
                HELL.ChatStyleCounter++;
                Remove(VideoListElement, "style[id=\"" + (HELL.ChatStyleCounter - 1) + "\"]");
                Remove(ChatLogElement, "style[id=\"" + (HELL.ChatStyleCounter - 1) + "\"]");
                Remove(SideMenuElement, "style[id=\"" + (HELL.ChatStyleCounter - 1) + "\"]");
                var len = window.HELLChatCSS.length - 1;
                if (HELL.ChatStyleCounter > len) HELL.ChatStyleCounter = 0;
                StyleSet();
                Save("ChatStyle", HELL.ChatStyleCounter);
            }, {
                passive: true
            });
            ChatLogElement.querySelector(".HELL-message-unread").addEventListener("click", function() {
                UpdateScroll(1, true);
                CheckUnreadMessage();
            }, {
                passive: true
            });
            ChatLogElement.querySelector("#chat").addEventListener("scroll", function(event) {
                var element = event.target;
     
                if (Math.floor(element.scrollTop + 50) >= (element.scrollHeight - element.offsetHeight)) CheckUnreadMessage(true);
            }, {
                passive: true
            });
            ChatLogElement.querySelector("#notification-content").addEventListener("scroll", function(event) {
                var element = event.target;
                if (Math.floor(element.scrollTop + 50) >= (element.scrollHeight - element.offsetHeight)) HELL.NotficationScroll = true;
            }, {
                passive: true
            });
            if (HELL.NotificationToggle === 0) {
                ChatLogElement.querySelector(".notifbtn").addEventListener("click", NotificationResize, {
                    passive: true
                });
            }
            VideoListElement.querySelector(".tcsettings").addEventListener("click", function(event) {
                var arg;
                if (this.innerText === "→") {
                    this.innerText = "←";
                    arg = "block";
                } else {
                    this.innerText = "→";
                    arg = "none";
                }
                VideoListElement.querySelector("#videos-header-sound").style.display = arg;
                if (HELL.Room.PTT === false) VideoListElement.querySelector("#videos-header-mic").style.display = arg;
                //VideoListElement.querySelector("#videos-header-snapshot").style.display = arg;
                VideoListElement.querySelector("#videos-header-fullscreen").style.display = arg;
                VideoListElement.querySelector("span[title=\"Settings\"]").style.display = arg;
            }, {
                passive: true
            });
            VideoListElement.querySelector("button[id=\"BackgroundUpdateLeft\"]").addEventListener("click", function() {
                if (!Addon.active("BGIMG")) {
                    HELL.MainBackgroundCounter++;
                    if (HELL.MainBackgroundCounter === window.HELLImages.length) HELL.MainBackgroundCounter = 0;
                    var background = "url(\"" + window.HELLImages[HELL.MainBackgroundCounter] + "\") rgb(0, 0, 0) no-repeat";
                    document.body.style.background = background;
                    Save("MainBackground", background);
                }
            }, {
                passive: true
            });
            VideoListElement.querySelector("button[id=\"BackgroundUpdateRight\"]").addEventListener("click", function() {
                if (!Addon.active("BGIMG")) {
                    HELL.MainBackgroundCounter--;
                    if (HELL.MainBackgroundCounter === -1) HELL.MainBackgroundCounter = window.HELLImages.length - 1;
                    var background = "url(\"" + window.HELLImages[HELL.MainBackgroundCounter] + "\") rgb(0, 0, 0) no-repeat";
                    document.body.style.background = background;
                    Save("MainBackground", background);
                }
            }, {
                passive: true
            });
            VideoListElement.querySelector("button[id=\"FontSizeUpdate\"]").addEventListener("click", function() {
                HELL.FontSize += 5;
                if (HELL.FontSize >= 40) HELL.FontSize = 15;
                Save("FontSize", HELL.FontSize);
                TextAreaElement.style.fontSize = (HELL.FontSize - 4) + "px";
            }, {
                passive: true
            });
            TextAreaElement.oninput = function() {
                HELL.Clipboard.Log = TextAreaElement.value;
            };
            TextAreaElement.onkeyup = function(e) {
                e = e || window.event;
                if (e.keyCode == 13) {
                    // SAVE CLIPBOARD
                    HELL.Clipboard.Message.push(HELL.Clipboard.Log);
                    if (HELL.Clipboard.Message.length > 3) HELL.Clipboard.Message.shift();
                    HELL.Clipboard.MessageLen = HELL.Clipboard.Message.length-1;
                } else if (e.keyCode == 40) {
                    // NAVIGATE CLIPBOARD (IF TYPING IS FALSE)
                    if (HELL.Clipboard.Message.includes(HELL.Clipboard.Log)) {
                        HELL.Clipboard.Counter = ((TextAreaElement.value == "") ? 0 : ((HELL.Clipboard.Counter >= HELL.Clipboard.MessageLen) ? 0 : (HELL.Clipboard.Counter + 1)));
                        TextAreaElement.value = HELL.Clipboard.Message[HELL.Clipboard.Counter];
                    }
                } else if (e.keyCode == 38) {
                    // NAVIGATE CLIPBOARD (IF TYPING IS FALSE)
                    if (HELL.Clipboard.Message.includes(HELL.Clipboard.Log)) {
                        HELL.Clipboard.Counter = ((TextAreaElement.value == "") ? HELL.Clipboard.MessageLen : ((HELL.Clipboard.Counter <= 0) ? HELL.Clipboard.MessageLen : (HELL.Clipboard.Counter - 1)));
                        TextAreaElement.value = HELL.Clipboard.Message[HELL.Clipboard.Counter];
                    }
                }
            };
            //MUTATION OBSERVERS
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
                if (HELL.AutoMicrophone) {
                    OpenMicrophone();
                }
            }).observe(VideoListElement.querySelector("#videos-footer-broadcast-wrapper"), {
                attributes: true,
                attributeFilter: ["class"]
            });
            //BOOT UP - FIRST START
            NotificationDisplay();
            FeaturedCameras(HELL.Featured);
            Cameras();
        }
     
        function CheckHost() {
     
            if (HELL.Host === 0) {
                Send("msg", "!whoisbot");
                HELL.HostAttempt = 0;
                HELL.HostWaiting = true;
            }
        }
        function SetBot() {
            Send("msg", "!bot");
            HELL.HostWaiting = false;
        }
     
        function BotCommandCheck() {
            //USER COMMANDS TO HOST
            if (isCommand(arguments[1])) {
                if (arguments[1].match(/^!userkick |^!userban |^!userclose |^!nickkick |^!nickban |^!nickclose /i)) {
                    BotCommandCheckJR(arguments[0], arguments[1]);
                } else if (arguments[1].match(/^!whoisbot$|^!8ball |^!vote |^!coin$|^!chuck$|^!urb |^!dad$|^!advice$/i)) {
                    BotCommandCheckPUB(arguments[0], arguments[1]);
                }
            }
        }
     
        function BotCommandCheckJR() {
            //MOD/JR.MOD
            if (HELL.BotModList.includes(HELL.UserList[arguments[0]].username) || HELL.UserList[arguments[0]].mod) {
                if (arguments[1].match(/^!userkick /i)) {
                    ModCommand("kick", arguments[1], true);
                } else if (arguments[1].match(/^!userban /i)) {
                    ModCommand("ban", arguments[1], true);
                } else if (arguments[1].match(/^!userclose /i)) {
                    ModCommand("stream_moder_close", arguments[1], true);
                } else if (arguments[1].match(/^!nickkick /i)) {
                    ModCommand("kick", arguments[1], false);
                } else if (arguments[1].match(/^!nickban /i)) {
                    ModCommand("ban", arguments[1], false);
                } else if (arguments[1].match(/^!nickclose /i)) {
                    ModCommand("stream_moder_close", arguments[1], false);
                }
            }
        }
     
        function BotCommandCheckPUB() {
            if (arguments[1].match(/^!whoisbot$/i)) BotCommand(5, arguments[0]);
            if (arguments[1].match(/^!vote /i)) Vote(arguments[0], arguments[1]);
            // PUBLIC COMMANDS
            if (HELL.PublicCommandToggle) {
                if (arguments[1].match(/^!8ball [\w\s]*\??/i)) {
                    if (HELL.UserList[arguments[0]].mod || isSafeListed(HELL.UserList[arguments[0]].username)) Send("msg", "[8BALL]\n" + window.HELLEightBall[Rand(0, window.HELLEightBall.length - 1)]);
                } else if (arguments[1].match(/^!coin$/i)) {
                    if (HELL.UserList[arguments[0]].mod || isSafeListed(HELL.UserList[arguments[0]].username)) Send("msg", "[COIN FLIP]\nThe coin landed on " + ((Rand(0, 1) == 1) ? "heads" : "tails") + "!");
                } else {
                    if (arguments[1].match(/^!chuck$/i)) {
                        Chuck(HELL.UserList[arguments[0]].username);
                    } else if (arguments[1].match(/^!urb /i)) {
                        Urb(arguments[1], HELL.UserList[arguments[0]].username);
                    } else if (arguments[1].match(/^!dad$/i)) {
                        Dad(HELL.UserList[arguments[0]].username);
                    } else if (arguments[1].match(/^!advice$/i)) {
                        Advice(HELL.UserList[arguments[0]].username);
                    }
                }
            }
        }
     
        function BotCheck() {
            if (HELL.UserList[arguments[0]].mod) {
                //CHECK HOST
                if (arguments[1].match(/^!bot$/i)) {
                    //SET HOST
                    HELL.Host = arguments[2].handle;
                    HELL.HostWaiting = false;
     
                    //IF CLIENT(ME) BECOMES HOST CHECK YOUTUBE IF ENABLED
                } else if (HELL.HostWaiting === true) {
                    HELL.HostAttempt++;
                    //SET BOT IF NO RESPONSE IN 10 MESSAGES or 10 SECONDS
                    if (HELL.HostAttempt == 1) {
                        setTimeout(function() {
                            //CHECK WAITING STATE OR IF HOST HAS CHANGED
                            if (HELL.HostWaiting === true && HELL.Host === 0) SetBot(false);
                        }, 10000);
                    }
                    //SETS BOT FORCEFULLY ON 10 MESSAGES CANCELING TIMER EVENT WHEN IT QUEUES
                    if (HELL.HostAttempt == 10) SetBot(false);
                }
            }
        }
     
        function Chuck() {
            //OPEN REQUEST
            if (isSafeListed(arguments[0])) {
                HELL.Chuck.XHR.open("GET", "https://api.chucknorris.io/jokes/random");
                HELL.Chuck.XHR.send();
            }
        }
     
        function Urb() {
            //CHECK TERM
            if (isSafeListed(arguments[1])) {
                var urban = arguments[0].match(/^!urb ([\w ]*)/i);
                if (urban !== null) {
                    //OPEN REQUEST
                    HELL.Urb.XHR.open("GET", "https://api.urbandictionary.com/v0/define?term=" + urban[1]);
                    HELL.Urb.XHR.send();
                }
            }
        }
     
        function Dad() {
            //OPEN REQUEST
            if (isSafeListed(arguments[0])) {
                HELL.Dad.XHR.open("GET", "https://icanhazdadjoke.com/");
                HELL.Dad.XHR.setRequestHeader("Accept", "application/json");
                HELL.Dad.XHR.send();
            }
        }
     
        function Advice() {
            //OPEN REQUEST
            if (isSafeListed(arguments[0])) {
                HELL.Advice.XHR.open("GET", "https://api.adviceslip.com/advice");
                HELL.Advice.XHR.setRequestHeader("Accept", "application/json");
                HELL.Advice.XHR.send();
            }
        }
     
        function Events() {}
        //MESSAGE FUNCTION
        function CreateMessage() {
            //SCROLLED UP? MISSED A MESSAGE?
            CheckUnreadMessage();
            // POST NEW CHAT ITEM IF ACTIVECHAT IS OUR CURRENT CHAT
            if (arguments[7] == GetActiveChat()) {
                var stack = ChatLogElement.querySelector("#HELL-chat-content>.message:last-child HELL-message-html:last-child");
                if (arguments[4] == HELL.CreateMessageLast && stack !== null) {
                    // Stack
                    stack.insertAdjacentHTML("afterend", "<HELL-message-html><div class=\"" + (HELL.ToggleStackMessage ? "stackmessage" : "message") + "\">" + (HELL.TimeStampToggle ? "<div class=\"HELLtimehighlight\"> " + arguments[0] + " </div>" : "") + "<span id=\"html\" class=\"message common\"style=\"font-size:" + HELL.FontSize + "px;\">" + arguments[5] + "</span></div></HELL-message-html>");
                } else {
                    HELL.CreateMessageLast = arguments[4];
                    ChatLogElement.querySelector("#HELL-chat-content").insertAdjacentHTML("beforeend", "<div class=\"message" + ((HELL.Avatar) ? " common " : " ") + ((HELL.HighlightList.includes(arguments[3]) || arguments[6]) ? "highlight" : "") + "\" " + ((arguments[2] === "") ? "style=\"padding-left:3px;\"" : "") + ">" + ((arguments[2] == "") ? "" : ((HELL.Avatar) ? "<a href=\"#\" class=\"avatar\"><div><img src=\"" + arguments[2] + "\"></div></a>" : "")) + "<div class=\"nickname\" style=\"background:" + arguments[1] + ";\">" + arguments[4] + (HELL.TimeStampToggle ? "<div class=\"HELLtime\"> " + arguments[0] + " </div>" : "") + "</div><div class=\"content\"><HELL-message-html><span id=\"html\" class=\"message common\"style=\"font-size:" + HELL.FontSize + "px;\">" + arguments[5] + "</span></HELL-message-html></div></div>");
                }
            } else {
                HELL.CreateMessageLast = undefined;
            }
            UpdateScroll(1, false);
        }
     
        function LoadMessage() {
            var Chat = ChatLogElement.querySelector("#HELL-chat-content");
            HELL.ChatScroll = true;
            Chat.innerHTML = "";
            CheckUnreadMessage();
            if (HELL.Message[GetActiveChat()]) {
                //POST MESSAGE
                var len = HELL.Message[GetActiveChat()].length,
                    LoadMessageLast;
                for (var ChatIndex = 0; ChatIndex < len; ChatIndex++) {
                    if (HELL.Message[GetActiveChat()][ChatIndex].nick == LoadMessageLast) {
                        // Stack
                        ChatLogElement.querySelector("#HELL-chat-content>.message:last-child HELL-message-html:last-child").insertAdjacentHTML("afterend", "<HELL-message-html><div class=\"stackmessage\">" + (HELL.TimeStampToggle ? "<div class=\"HELLtimehighlight\"> " + HELL.Message[GetActiveChat()][ChatIndex].time + " </div>" : "") + "<span id=\"html\" class=\"message common\" style=\"font-size:" + HELL.FontSize + "px;\">" + HELL.Message[GetActiveChat()][ChatIndex].msg + "</span></div></HELL-message-html>");
                    } else {
                        LoadMessageLast = HELL.Message[GetActiveChat()][ChatIndex].nick;
                        ChatLogElement.querySelector("#HELL-chat-content").insertAdjacentHTML("beforeend", "<div class=\"message" + ((HELL.Avatar) ? " common " : " ") + ((HELL.HighlightList.includes(HELL.Message[GetActiveChat()][ChatIndex].username) || HELL.Message[GetActiveChat()][ChatIndex].mention) ? "highlight" : "") + "\" " + ((HELL.Message[GetActiveChat()][ChatIndex].avatar === "") ? "style=\"padding-left:3px;\"" : "") + ">" + ((HELL.Avatar) ? "<a href=\"#\" class=\"avatar\"><div><img src=\"" + (HELL.Message[GetActiveChat()][ChatIndex].avatar) + "\"></div></a>" : "") + "<div class=\"nickname\" style=\"-webkit-box-shadow: 0 0 6px " + HELL.Message[GetActiveChat()][ChatIndex].namecolor + ";box-shadow: 0 0 6px " + HELL.Message[GetActiveChat()][ChatIndex].namecolor + ";background:" + HELL.Message[GetActiveChat()][ChatIndex].namecolor + ";\">" + HELL.Message[GetActiveChat()][ChatIndex].nick + (HELL.TimeStampToggle ? "<div class=\"HELLtime\"> " + HELL.Message[GetActiveChat()][ChatIndex].time + " </div>" : "") + "</div><div class=\"content\"><HELL-message-html><span id=\"html\" class=\"message common\" style=\"font-size:" + HELL.FontSize + "px;\">" + HELL.Message[GetActiveChat()][ChatIndex].msg + "</span></HELL-message-html></div></div>");
                    }
                    if(ChatIndex == (len-1)) HELL.CreateMessageLast = HELL.Message[GetActiveChat()][ChatIndex].nick;
                }
            } else {
                //START PM
                HELL.Message[GetActiveChat()] = [];
            }
            UpdateScroll(1, false);
            UpdateScroll(2, false);
        }
     
        function CreateServerEvent() {
            HELL.Message[0].push({
                "time": Time(),
                "namecolor": "#3f69c0",
                "avatar": "",
                "username": "",
                "nick": "SERVER EVENT",
                "msg": "<br><div class=\"serverevent\" style=\"font-size:110%;\"><center>"+((arguments[2] !== "")?"<br><img src=\"" + arguments[2]+ "\" width=\"40%\" height=\"40%\" /><br>":"")+((arguments[1] !== "")?"<a href=\"https://tinychat.com/"+ arguments[1]+"\" target=\"_self\">"+arguments[1].toUpperCase()+"</a><br>":"")+arguments[3]+"</center></div><br>",
                "mention": true
            });
            var msg = HELL.Message[arguments[0]][HELL.Message[arguments[0]].length - 1];
            CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, msg.mention, arguments[0]);
            UpdateScroll(1, true);
        }
     
        window.CreateGift = function() {
            var gift = arguments[0].gift,
                from = (!gift.anon) ? arguments[0].from.name : "ANONYMOUS",
                to = arguments[0].to.name,
                comment = (comment = gift.comment) ? gift.comment : "";
            HELL.Message[0].push({
                "time": Time(),
                "namecolor": "#3f69c0",
                "avatar": "",
                "username": "",
                "nick": "SPECIAL DELIVERY",
                "msg": "<br><div class=\"gift\"><center>" + gift.name + "</center><br><a href=\"" + gift.store_url + "\" target=\"_blank\"><img style=\"display: block;margin-left: auto;margin-right: auto;width: 50%;\" src=\"" + gift.url + "\"></a><center>" + ((comment !== "") ? "<br>" + comment : "") + "<br>From:<br>" + from + "<br>To:<br>" + to + "</center></div><br>",
                "mention": true
            });
            var msg = HELL.Message[0][HELL.Message[0].length - 1];
            CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, msg.mention, 0);
            if (HELL.enableSound === true && window.TinychatApp.getInstance().defaultChatroom.volume > 0) window.HELLSound.GIFT.play();
            if (GetActiveChat() === 0) UpdateScroll(1, true);
        };
     
        function AKB() {
            //WATCH OR REMOVE USERS
            if ((HELL.AutoKick === false && HELL.AutoBan === false) && arguments[0] === true) {
                HELL.WatchList.push([arguments[2], arguments[1], new Date()]);
                debug("WATCHLIST::ADDED", arguments[2] + ":" + arguments[1]);
            } else {
                if (HELL.Me.mod) {
                    if (HELL.AutoKick === true) {
                        HELL.NoGreet = true;
                        Send("kick", arguments[1]);
                    } else if (HELL.AutoBan === true) {
                        HELL.NoGreet = true;
                        Send("ban", arguments[1]);
                    }
                }
            }
        }
     
        function AKBS() {
            if (arguments[0].username !== "") {
                //EXTENDED SAFELIST
                var temp = [];
                if (Addon.active("AKB")) temp = Addon.get("AKB");
                //DEFAULT SAFELIST
                if (!isSafeListed(arguments[0].username.toUpperCase())) {
                    if (arguments[0].giftpoints > 0 || arguments[0].subscription > 0 || arguments[0].mod === true) {
                        if (HELL.SafeList.length < 5000) {
                            HELL.SafeList.push(arguments[0].username.toUpperCase());
                            Save("AKB", JSON.stringify(HELL.SafeList));
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
            var target = HandleToUser(arguments[0]);
            if (target !== -1) {
                var a = HELL.SafeList.indexOf(HELL.UserList[target].username);
                if (a !== -1) {
                    //REMOVE
                    if (arguments[1]) {
                        debug("SAFELIST::", "REMOVE USER " + HELL.UserList[target].username + " FROM SAFELIST");
                        Alert(GetActiveChat(), "✓ Removed " + HELL.UserList[target].username + " from safelist.");
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
                HELL.MissedMsg = 0;
                HELL.ChatScroll = true;
                ChatLogElement.querySelector(".HELL-message-unread").style.display = "none";
            } else {
                HELL.MissedMsg++;
                HELL.ChatScroll = false;
                ChatLogElement.querySelector(".HELL-message-unread").style.display = "block";
                ChatLogElement.querySelector(".HELL-message-unread").innerHTML = "There are " + HELL.MissedMsg + " unread message(s)!";
            }
        }
     
        function GetActiveChat() {
            var elem = ChatListElement.querySelector(".active");
            if (elem) return elem.getAttribute("data-chat-id");
            return 0;
        }
     
        function CheckImgur() {
            if (HELL.Imgur) {
                var i = arguments[0].match(/https?:\/\/i\.imgur\.com\/[a-zA-Z0-9]*\.(jpeg|jpg|gif|png|mp4)/);
                if (i !== null) {
                    HELL.ImgurWarning++;
                    arguments[0] = (i[1] == "mp4") ? "<center>(Video Below)\n<video onclick=\"if (this.paused) {this.play();}else{this.pause();}\" oncontextmenu=\"return false;\" width=\"288px\" height=\"162px\"><source src=\"" + i[0] + "\" type=\"video/mp4\" /><source src=\"https://i.imgur.com/qLOIgom.mp4\" type=\"video/mp4\" /></video>\n<a href=\"" + i[0] + "\" target=\"_blank\">Direct Link</a></center>" : "<center><img src=\"" + i[0] + "\" width=\"320px\" height=\"240px\" />\n<a href=\"" + i[0] + "\" target=\"_blank\">Direct Link</a></center>";
                    if (HELL.ImgurWarning < 2 && HELL.CanSeeTips) Alert(GetActiveChat(), "[tip] !imgurtoggle to stop image links showing.");
                }
            }
            return arguments[0];
        }
     
        function TTS() {
            var utter = new window.SpeechSynthesisUtterance(arguments[0]);
            utter.voice = HELL.TTS.voices[0];
            utter.rate = 1.0;
            utter.pitch = 0.5;
            HELL.TTS.synth.speak(utter);
        }
     
        function isCommand() {
            return arguments[0].match(/^!/);
        }
     
        function RoomUsers() {
            if (HELL.ScriptInit) UserListElement.querySelector("#header>span>span").innerText = " : " + HELL.UserList.length;
        }
     
        function LineSpam() {
            var LineBreaks = (arguments[0].match(/\n|\r/g) || []).length;
            if (LineBreaks >= 14 && arguments[1] === false) return true;
            return false;
        }
     
        function GamePrevention(message, isMod) {
            var gameRegex = /🌠|💥|🧞|🌈|💀|🎰|🔍|⛏|🎲|🎣|🍳|🪓|🔥 \[𝗙𝗶𝗿𝗲𝗺𝗮𝗸𝗶𝗻𝗴\]:|⚒|🔪|🛠|⚗️|🏃|🔨|💧|🕵 \[𝗠𝗮𝘀𝘁𝗲𝗿 𝗼𝗳 𝗧𝗿𝗮𝗱𝗲𝘀\]:|📓|🖤|💸|💰|☄️|🌌|🃏|💲|🪐|🚀|🗻|🌋|✈️|🌀|🏦|💎 \[𝗗𝗶𝗮𝗺𝗼𝗻𝗱\]:|♻|🛸|⚡|🔑|👻|🧜|🧙|👽|😈 \[𝗗𝗲𝘃𝗶𝗹'𝘀 𝗖𝗵𝗲𝘀𝘁\]:|⚔️/i;
            if (!HELL.CanSeeGames && isMod && gameRegex.test(message)) return false;
            if (!HELL.CanSeeGames && isMod && /^\🤖/.test(message)){
                var robottext = message;
                if(robottext.indexOf("\uD835\uDDE3\uD835\uDDFC\uD835\uDDF8\u00E9") !== -1) return false; //𝗣𝗼𝗸é
                if(robottext.indexOf("\uD835\uDDD5\uD835\uDDFC\uD835\uDE00\uD835\uDE00") !== -1) return false; //Boss
                if(robottext.indexOf("\uD835\uDDF4\uD835\uDDFC\uD835\uDDF9\uD835\uDDF1") !== -1) return false; //gold
                if(robottext.indexOf("\uD835\uDE00\uD835\uDDF5\uD835\uDDEE\uD835\uDDFF\uD835\uDDF1") !== -1) return false; //shard
                if(robottext.indexOf("\u005D\u0020\uD835\uDDF5\uD835\uDDEE\uD835\uDE00\u0020\u0028") !== -1) return false; //] has (
                if(robottext.indexOf("\uD835\uDDDB\uD835\uDDF2\uD835\uDDF9\uD835\uDDF9\u0027\uD835\uDE00") !== -1) return false; //Hell's
                if(robottext.indexOf("\uD835\uDDE7\uD835\uDDFF\uD835\uDDF6\uD835\uDE03\uD835\uDDF6\uD835\uDDEE") !== -1) return false; //Trivia
                if(robottext.indexOf("\uD835\uDDE3\uD835\uDDEE\uD835\uDDFF\uD835\uDE01\uD835\uDDF6\uD835\uDDF0") !== -1) return false; //Partic
                if(robottext.indexOf("\uD835\uDDE0\uD835\uDDF6\uD835\uDDFB\uD835\uDDF6\uD835\uDDFB\uD835\uDDF4") !== -1) return false; //Mining
                if(robottext.indexOf("\uD835\uDDE6\uD835\uDDF9\uD835\uDDEE\uD835\uDE06\uD835\uDDF2\uD835\uDDFF") !== -1) return false; //Slayer
                if(robottext.indexOf("\uD835\uDDD9\uD835\uDDF6\uD835\uDE00\uD835\uDDF5\uD835\uDDF6\uD835\uDDFB\uD835\uDDF4") !== -1) return false; //Fishing
                if(robottext.indexOf("\uD835\uDDEC\uD835\uDDFC\uD835\uDE02\u0020\uD835\uDE00\uD835\uDDF2\uD835\uDDEE") !== -1) return false; //You sea
                if(robottext.indexOf("\uD835\uDDEC\uD835\uDDFC\uD835\uDE02\u0020\uD835\uDDF3\uD835\uDDFC\uD835\uDE02") !== -1) return false; //You fou
                if(robottext.indexOf("\uD835\uDDEC\uD835\uDDFC\uD835\uDE02\u0020\uD835\uDE04\uD835\uDDF2\uD835\uDDFF") !== -1) return false; //You wer
                if(robottext.indexOf("\uD835\uDDD5\uD835\uDDF9\uD835\uDDEE\uD835\uDDF0\uD835\uDDF8\uD835\uDDF7\uD835\uDDEE\uD835\uDDF0\uD835\uDDF8") !== -1) return false; //Blackjack
                if(robottext.indexOf("\uD835\uDDE3\uD835\uDDFC\uD835\uDE01\uD835\uDDF6\uD835\uDDFC\uD835\uDDFB\u0020\uD835\uDDF5\uD835\uDDEE\uD835\uDE00") !== -1) return false; //Potion has
                if(robottext.indexOf("\uD835\uDDF5\uD835\uDDEE\uD835\uDE00\u0020\uD835\uDDF2\uD835\uDE05\uD835\uDDFD\uD835\uDDF6\uD835\uDDFF\uD835\uDDF2\uD835\uDDF1") !== -1) return false; //has expired
     
                return true;
    		}
     
            return true;
        }
     
     
        function UpdateScroll() {
            if (arguments[0] === 1 && (HELL.ChatScroll || arguments[1] === true)) ChatLogElement.querySelector("#chat").scrollTop = ChatLogElement.querySelector("#chat").scrollHeight;
            if (arguments[0] === 2 && (HELL.NotificationScroll || arguments[1] === true) && HELL.NotificationToggle == 0) ChatLogElement.querySelector("#notification-content").scrollTop = ChatLogElement.querySelector("#notification-content").scrollHeight;
        }
     
        function DecodeTXT() {
            var txt = document.createElement("textarea");
            txt.innerHTML = arguments[0];
            return txt.value;
        }
     
        function HTMLtoTXT() {
            var p = document.createElement("p");
            var text = document.createTextNode(arguments[0]);
            p.appendChild(text);
            return p.innerHTML.replace(/(?:(?:(?:https?|ftps?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/igm, "<a href=\"$&\" target=\"_blank\">$&</a>").replace(/[\u2680-\u2685]/g, "<span style=\"font-size:275%;\">$&</span>").replace(/\n|\r/g, "<br>");
        }
     
        function IgnoreText() {
            if (arguments[0] !== "") {
                if (arguments[0].match(/^(\r|\n|\s).*/)) return false;
                return true;
            }
        }
     
        function TimeToDate() {
            if (arguments[1] === undefined) arguments[1] = new Date();
            var match = arguments[0].trim().match(/(\d+):(\d+)\s?((?:am|pm))/i);
            var t = {
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
            var text = HTMLtoTXT(arguments[1]),
                list;
            if (arguments[2] !== undefined) {
                list = HELL.UserList[arguments[2]];
                if (isSafeListed(HELL.UserList[arguments[2]].username)) text = CheckImgur(text);
            } else {
                list = HELL.Me;
                text = CheckImgur(text);
            }
     
            HELL.Message[arguments[0]].push({
                "time": Time(),
                "namecolor": list.namecolor,
                "avatar": list.avatar,
                "username": list.username,
                "nick": list.nick,
                "msg": text,
                "mention": false
            });
     
            if (arguments[0] == GetActiveChat()) {
                var msg = HELL.Message[arguments[0]][HELL.Message[arguments[0]].length - 1];
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
                    localStorage.setItem("HELL_StorageVerify", true);
                    localStorage.removeItem("HELL_StorageVerify");
                    return true;
                }
            } catch (e) {
                return false;
            }
        }
     
        function Export() {
            var element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(arguments[1]));
            element.setAttribute("download", arguments[0]);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
     
        function StyleSet() {
            // Chat
            var style = document.createElement("style");
            style.setAttribute("id", HELL.ChatStyleCounter);
            style.innerHTML = window.HELLChatCSS[HELL.ChatStyleCounter][0] + ":host, #videolist {background-color:unset;}";
            ChatLogElement.appendChild(style);
            // Video
            style = document.createElement("style");
            style.setAttribute("id", HELL.ChatStyleCounter);
            style.innerHTML = window.HELLChatCSS[HELL.ChatStyleCounter][1] + ":host, #videolist {background-color:unset;}";
            VideoListElement.appendChild(style);
            // Side Menu
            style = document.createElement("style");
            style.setAttribute("id", HELL.ChatStyleCounter);
            style.innerHTML = window.HELLChatCSS[HELL.ChatStyleCounter][2] + ":host, #videolist {background-color:unset;}";
            SideMenuElement.appendChild(style);
        }
     
        function ChatHeightToggled() {
            HELL.OGStyle.HeightCounter++;
            if (!HELL.ChatDisplay) {
                HELL.ChatWidth += 5;
                HELL.ChatDisplay = true;
            }
            HELL.ChatHeight -= 5;
            HELL.UserListDisplay = true;
            if (HELL.ChatHeight == 20) {
                HELL.ChatHeight = 45;
                HELL.UserListDisplay = false;
                HELL.OGStyle.HeightCounter = 0;
            }
            ChatLogElement.querySelector("#chat-wrapper").style.cssText = "min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%);" + (HELL.UserListDisplay ? "top:unset;min-height:calc(100% - " + HELL.ChatHeight + "% - 119px)!important;max-height:calc(100% - " + HELL.ChatHeight + "% - 119px)!important;" : "bottom:0;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
            TitleElement.querySelector("#room-header").style.cssText = "min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%)!important;top:" + (HELL.UserListDisplay ? "calc(" + HELL.ChatHeight + "% + 84px);" : "84px;");
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.cssText = "bottom:unset;min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%);top:" + (HELL.UserListDisplay ? "calc(" + HELL.ChatHeight + "% + 34px);" : "unset;top:34px;");
            VideoListElement.querySelector("#videos-header").style.cssText = !HELL.UserListDisplay ? "top:0;right: 54px;" : "bottom:unset;top:" + HELL.ChatHeight + "%;";
            SideMenuElement.querySelector("#sidemenu").style.cssText = !HELL.UserListDisplay ? "display:none" : "min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%)!important;height:" + HELL.ChatHeight + "%!important;";
            UserListElement.querySelector("#button-banlist").style.cssText = "top:calc(" + HELL.ChatHeight + "% + 89px);";
            document.querySelector("#content").style.cssText = "width:calc(100% " + (HELL.ChatDisplay ? "- (400px + " + HELL.ChatWidth + "%)" : "") + ")";
            VideoListElement.querySelector("#videos-footer").style.cssText = "display:block;top:" + (HELL.UserListDisplay ? "calc(" + HELL.ChatHeight + "% + 119px);" : "119px;") + "right:-70px;display:block;";
            PerformanceModeInit(HELL.PerformanceMode);
            UpdateScroll(1, true);
            UpdateScroll(2, true);
            Resize();
        }
     
        function ChatWidthToggled() {
            HELL.OGStyle.WidthCounter++;
            HELL.ChatWidth += 5;
            HELL.ChatDisplay = true;
            if (HELL.ChatWidth == 25) {
                HELL.ChatWidth = -5;
                HELL.ChatDisplay = false;
                HELL.OGStyle.WidthCounter = 0;
            }
            ChatLogElement.querySelector("#chat-wrapper").style.cssText = (!HELL.ChatDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%);" + ((HELL.UserListDisplay) ? "top:unset;min-height:calc(100% - " + HELL.ChatHeight + "% - 119px)!important;max-height:calc(100% - " + HELL.ChatHeight + "% - 119px)!important;" : "bottom:0;;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
            TitleElement.querySelector("#room-header").style.cssText = (!HELL.ChatDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%)!important;top:" + ((HELL.UserListDisplay) ? "calc(" + HELL.ChatHeight + "% + 84px);" : "84px;");
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.cssText = (!HELL.ChatDisplay) ? "bottom:0;top:unset;width:100%;position:relative;" : "bottom:unset;min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%);top:" + ((HELL.UserListDisplay) ? "calc(" + HELL.ChatHeight + "% + 34px);" : "34px;bottom:unset;");
            VideoListElement.querySelector("#videos-header").style.cssText = (!HELL.ChatDisplay) ? "display:none" : ((HELL.UserListDisplay) ? "bottom:unset;top:" + HELL.ChatHeight + "%;" : "bottom:unset;top: 0;right: 54px;");
            SideMenuElement.querySelector("#sidemenu").style.cssText = (!HELL.ChatDisplay || !HELL.UserListDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + HELL.ChatWidth + "%);max-width:calc(400px + " + HELL.ChatWidth + "%)!important;height:" + HELL.ChatHeight + "%!important;";
            UserListElement.querySelector("#button-banlist").style.cssText = (!HELL.ChatDisplay) ? "display:none" : "top:calc(" + HELL.ChatHeight + "% + 89px);";
            document.querySelector("#content").style.cssText = "width:calc(100% " + ((HELL.ChatDisplay) ? "- (400px + " + HELL.ChatWidth + "%)" : "") + ")";
            VideoListElement.querySelector("#videos-footer").style.cssText = "display:block;top:" + ((HELL.UserListDisplay) ? "calc(" + HELL.ChatHeight + "% + 119px);" : "119px;") + "right:-70px;display:block;";
            HELL.PerformanceMode = false;
            PerformanceModeInit(HELL.PerformanceMode);
            UpdateScroll(1, true);
            UpdateScroll(2, true);
            Resize();
        }
     
        function ChatHide() {
            HELL.NormalStyle.ChatHide = !HELL.NormalStyle.ChatHide;
            ChatLogElement.querySelector("#chat-wrapper").style.display = (HELL.NormalStyle.ChatHide ? "none" : "block");
            UpdateScroll(1, true);
            UpdateScroll(2, true);
            Resize();
        }
     
        function SoundMeter() {
            //MICROPHONE INDICATOR
            if (HELL.SoundMeterToggle) {
                setTimeout(function() {
                    var Camera = VideoListElement.querySelectorAll(".videos-items tc-video-item"),
                        Featured = VideoListElement.querySelectorAll(".videos-items:first-child tc-video-item"),
                        videolist = window.TinychatApp.getInstance().defaultChatroom._videolist,
                        TCCameraList = videolist.items.length,
                        CameraLen = Camera.length,
                        users,
                        item;
                    if (Featured.length > 0) {
                        for (var x = 0; x < TCCameraList; x++) {
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
                }, 300);
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
            var ChecksOut = HELL.VoteSystem,
                len = HELL.WaitToVoteList.length;
            if (len > 0 && ChecksOut) {
                for (var i = 0; i < len; i++) {
                    if (HELL.WaitToVoteList[i][0] === HELL.UserList[arguments[0]].username.toUpperCase()) {
                        Send("msg", "Please wait several minutes till you can cast your vote again!");
                        ChecksOut = false;
                        break;
                    }
                }
            }
            if (ChecksOut) {
                if (isSafeListed(HELL.UserList[arguments[0]].username.toUpperCase())) {
                    var targetname = arguments[1].match(/^!vote ([a-z0-9]{1,16})$/i);
                    if (targetname !== null) {
                        var Target = UsernameToUser(targetname[1].toUpperCase());
                        if (Target !== -1) {
                            if (HELL.UserList[Target].broadcasting && HELL.UserList[Target].username !== "GUEST") {
                                if (HELL.Me.owner || !HELL.UserList[Target].mod) {
                                    Send("msg", "your vote has been cast, you may vote again shortly.");
                                    HELL.WaitToVoteList.push([HELL.UserList[arguments[0]].username.toUpperCase(), new Date()]);
                                    HELL.UserList[Target].vote += 1;
                                    if (HELL.UserList[Target].vote === 3) {
                                        HELL.UserList[Target].vote = 0;
                                        Send("msg", HELL.UserList[Target].nick + "!\nyou've been voted off camera.");
                                        Send("stream_moder_close", HELL.UserList[Target].handle);
                                    }
                                } else {
                                    Send("msg", "I cannot do that.");
                                }
                            }
                        } else {
                            Send("msg", "user is not broadcasting...");
                        }
                    } else {
                        Send("msg", "nickname or username does not exist.");
                    }
                }
            }
        }
     
        function PMShow() {
            ChatListElement.querySelector("#chatlist").style.display = ((HELL.enablePMs)?"block":"none");
        }
     
        function MessagePopUp() {
            if (HELL.Popups) {
                var push = false;
                if (arguments[0] != -1) {
                    if (ChatListElement.querySelector(".list-item .active")) {
                        if (ChatListElement.querySelector(".active").innerHTML.includes(HELL.UserList[arguments[0]].nick) && !ChatListElement.querySelector(".active").innerHTML.includes("(offline)")) {
                            if (arguments[2]) push = true;
                        } else {
                            push = true;
                        }
                    } else if (!arguments[2]) {
                        push = true;
                    }
                }
                if (arguments[3]) push = true;
                if (push || !HELL.ChatDisplay) {
                    if (VideoListElement.querySelector(".PMOverlay .PMPopup:nth-child(5)")) {
                        Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                        clearTimeout(HELL.NotificationTimeOut[0]);
                        HELL.NotificationTimeOut.shift();
                    }
                    VideoListElement.querySelector(".PMOverlay").insertAdjacentHTML("beforeend", "<div class=\"PMPopup\"><h2><div class=\"PMTime\">" + Time() + "</div><div class=\"PMName\">" + ((arguments[3]) ? " " : (HELL.UserList[arguments[0]].nick + " in " + ((arguments[2]) ? "Main" : "PM"))) + "</div></h2><div class=\"PMContent\"style=\"font-size:" + HELL.FontSize + "px\">" + arguments[1] + "</div></div>");
                    HELL.NotificationTimeOut.push(setTimeout(function() {
                        if (VideoListElement.querySelector(".PMOverlay .PMPopup")) {
                            Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                            HELL.NotificationTimeOut.shift();
                        }
                    }, 11100));
                }
            }
        }
     
        function Reminder() {
            var temp,
                i,
                len = HELL.ReminderServerInList.length;
            for (i = 0; i < len; i++) clearTimeout(HELL.ReminderServerInList[i]);
            HELL.ReminderServerInList = [];
            if (HELL.Reminder === true) {
                var OffsetTime;
                len = HELL.ReminderList.length;
                for (i = 0; i < len; i++) {
                    temp = TimeToDate(HELL.ReminderList[i][0]);
                    HELL.RecentTime = new Date();
                    if (temp < HELL.RecentTime) temp.setDate(temp.getDate() + 1);
                    OffsetTime = temp - HELL.RecentTime;
                    HELL.ReminderServerInList.push(setTimeout(AddReminder, OffsetTime, HELL.ReminderList[i][1]));
                }
                if (Addon.active("ReminderList")) {
                    len = Addon.get("ReminderList").length;
                    for (i = 0; i < len; i++) {
                        temp = TimeToDate(Addon.get("ReminderList")[i][0]);
                        HELL.RecentTime = new Date();
                        if (temp < HELL.RecentTime) temp.setDate(HELL.RecentTime.getDate() + 1);
                        OffsetTime = temp - HELL.RecentTime;
                        HELL.ReminderServerInList.push(setTimeout(AddReminder, OffsetTime, Addon.get("ReminderList")[i][1]));
                    }
                }
            }
        }
     
        function AddReminder() {
            Send("msg", "📣 " + arguments[0]);
            setTimeout(Reminder, 5000);
        }
     
        function ServerEvent() {
            var temp,
                i,
                len = HELL.ServerEventServerInList.length;
            for (i = 0; i < len; i++) clearTimeout(HELL.ServerEventServerInList[i]);
            HELL.ServerEventServerInList = [];
            var OffsetTime,
                event = true;
            len = HELL.ServerEventList.length;
            for (i = 0; i < len; i++) {
                temp = new Date(HELL.ServerEventList[i][1]);
                HELL.RecentTime = new Date();
                if (temp < HELL.RecentTime && HELL.ServerEventList[i][0]) {
                    temp.setDate(HELL.RecentTime.getDate());
                    temp.setYear(HELL.RecentTime.getFullYear());
                }
                OffsetTime = temp - HELL.RecentTime;
                if (OffsetTime >  0 && OffsetTime < 3600000) {
                    event = false;
                    HELL.ServerEventServerInList.push(setTimeout(AddServerEvent, OffsetTime, HELL.ServerEventList[i][2], HELL.ServerEventList[i][3], HELL.ServerEventList[i][4]));
                }
            }
            if (event) setTimeout(Events, 3600000);
        }
     
        function AddServerEvent() {
            CreateServerEvent(GetActiveChat(), arguments[0], arguments[1], "📢 " + arguments[2]);
            setTimeout(ServerEvent, 5000);
        }
     
        function NotificationDisplay() {
            ChatLogElement.querySelector("#notification-content").style.cssText = "display:" + ((HELL.NotificationToggle == 0) ? "block" : "none") + ";";
            ChatLogElement.querySelector(".notifbtn").style.cssText = "display:" + ((HELL.NotificationToggle == 0) ? "block" : "none") + ";";
            if (HELL.NotificationToggle == 0) {
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
                ChatLogElement.querySelector(".notifbtn").innerText = "-▼-";
                ChatLogElement.querySelector("#notification-content").style.height = "50%";
                ChatLogElement.querySelector("#chat").style.height = "100%";
            } else if (ChatLogElement.querySelector(".notifbtn").innerText === "-▼-") {
                ChatLogElement.querySelector(".notifbtn").innerText = "▲";
                ChatLogElement.querySelector("#notification-content").style.height = "100%";
                ChatLogElement.querySelector("#chat").style.height = "100%";
            } else {
                ChatLogElement.querySelector(".notifbtn").innerText = "▼";
                ChatLogElement.querySelector("#notification-content").style.height = "25%";
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
                if (select.querySelector(".video")) select.querySelector(".video").style.padding = (HELL.CameraBorderToggle) ? "5px" : "0";
                // Handle to UserIndex
                if (user == -1) continue;
                if (HELL.Me.handle !== HELL.UserList[user].handle) {
                    if (select.querySelector("div > div > div.overlay > div.icon-volume > tc-volume-control")) {
                        if (select.querySelector("div > div > div.overlay > div.icon-volume > tc-volume-control").shadowRoot) {
                            let VolIco = select.querySelector("div > div > div.overlay > div.icon-volume > tc-volume-control").shadowRoot;
                            CameraSound.observe(VolIco.querySelector(".icon-volume"), { attributes: true, childList: true, subtree: true } );
                            select.querySelector(".video > div > video").volume = (window.HELLMuted)?0:((parseInt(VolIco.querySelector("#videos-header-volume-level").style.width)/100)*window.HELLRoomVolume);
                        }
                    }
                }
    
                if (select.querySelector(".video #fixed")) continue;
                if (HELL.HiddenCameraList.includes(HELL.UserList[user].username)) {
                    window.TinychatApp.BLL.Videolist.prototype.toggleHiddenVW(window.TinychatApp.getInstance().defaultChatroom._videolist.items[num], false);
                    Alert(GetActiveChat(), HELL.UserList[user].username + " has been auto-hidden!");
                }
                select.querySelector(".video").insertAdjacentHTML("afterbegin", `<style id=\"fixed\">.video{border-radius: 12px;}.video.not-visible>div>.overlay{background: url('https://i.imgur.com/vSibSHJ.png') rgb(0, 0, 0) no-repeat;background-position: center!important;background-size: cover!important;}.video.large{position: absolute;left:20%;top: 0;z-index: 2;width: 60%;}.video>div>.overlay[data-mic-level=\"1\"] {-webkit-box-shadow: inset 0 0 2px 3px #FF0000;box-shadow: inset 0 0 2px 3px #FF0000;}.video>div>.overlay[data-mic-level=\"2\"] {-webkit-box-shadow: inset 0 0 6px 4px #FF0000;box-shadow: inset 0 0 6px 4px #FF0000;}.video>div>.overlay[data-mic-level=\"3\"],.video>div>.overlay[data-mic-level=\"4\"], .video>div>.overlay[data-mic-level=\"5\"], .video>div>.overlay[data-mic-level=\"6\"], .video>div>.overlay[data-mic-level=\"7\"], .video>div>.overlay[data-mic-level=\"8\"], .video>div>.overlay[data-mic-level=\"9\"], .video>div>.overlay[data-mic-level=\"10\"] {-webkit-box-shadow: inset 0 0 8px 5px #FF0000;box-shadow: inset 0 0 8px 5px #FF0000;}.video:after{content:unset;}</style>`);
            }
            Resize();
        }
     
        function FeaturedCameras() {
            if (arguments[0] === true) {
                if (VideoListElement.querySelector("#SmallFTYT")) {
                    Remove(VideoListElement, "#SmallFTYT");
                }
            } else {
                var node = document.createElement("style");
                node.appendChild(document.createTextNode(FeaturedCSS));
                node.setAttribute("id", "SmallFTYT");
                VideoListElement.appendChild(node);
            }
        }
     
        function Resize() {
            window.dispatchEvent(new Event("resize"));
        }
     
        function PerformanceModeInit() {
            if (!HELL.ThemeChange) {
                var value = ((arguments[0]) ? "100%" : "calc(400px + " + HELL.ChatWidth + "%)");
                ChatLogElement.querySelector("#chat-wrapper").style.minWidth = value;
                ChatLogElement.querySelector("#chat-wrapper").style.maxWidth = value;
                ChatLogElement.querySelector("#chat-wrapper").style.width = value;
                TitleElement.querySelector("#room-header").style.minWidth = value;
                TitleElement.querySelector("#room-header").style.maxWidth = value;
                TitleElement.querySelector("#room-header").style.width = value;
                VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.minWidth = ((!HELL.ChatDisplay) ? "100%" : value);
                VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.maxWidth = ((!HELL.ChatDisplay) ? "100%" : value);
                VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.width = ((!HELL.ChatDisplay) ? "100%" : value);
                VideoListElement.querySelector("#videos-header").style.minWidth = ((!HELL.UserListDisplay) ? "calc(" + value + " - 54px)" : value);
                VideoListElement.querySelector("#videos-header").style.maxWidth = ((!HELL.UserListDisplay) ? "calc(" + value + " - 54px)" : value);
                VideoListElement.querySelector("#videos-header").style.width = ((!HELL.UserListDisplay) ? "calc(" + value + " - 54px)" : value);
                SideMenuElement.querySelector("#sidemenu").style.minWidth = value;
                SideMenuElement.querySelector("#sidemenu").style.maxWidth = value;
                SideMenuElement.querySelector("#sidemenu").style.width = value;
                document.querySelector("#content").style.width = ((!arguments[0]) ? "calc(100% " + (HELL.ChatDisplay ? "- (400px + " + HELL.ChatWidth + "%)" : "") + ")" : "0%");
                VideoListElement.querySelector("#videos").style.display = ((!arguments[0]) ? "block!important" : "none!important");
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
     
     
        function Command() {
            var UserCommand = arguments[0].match(/^!([a-z0-9]*)(?: ?)(.*)/i);
            if (UserCommand) {
                if (typeof CommandList[UserCommand[1].toLowerCase()] == "function") {
                    debug("COMMAND::" + ((arguments[1]) ? "PM" : "MAIN"), UserCommand[1] + ":" + UserCommand[2]);
                    CommandList[UserCommand[1].toLowerCase()](UserCommand[2], arguments[1]);
                }
            }
        }
        //ALERT FUNCTIONS
        function Settings() {
            Alert(GetActiveChat(), ((arguments[0] !== undefined) ? arguments[0] : "") + "<center>script config:\n<center>--------</center>check for bot: " + ((HELL.Bot) ? "yes" : "no") + "\nop mode: " + ((HELL.UserYT) ? "on" : "off") + "\naccept basic user commands: " + ((HELL.PublicCommandToggle) ? "on" : "off") + "\ngreen room approval:\n" + ((HELL.GreenRoomToggle) ? "auto allow" : "manual") + "\nreminders: " + ((HELL.Reminder) ? "on" : "off") + "\nview games: " + ((HELL.CanSeeGames) ? "yes" : "no") + "\n\ndisplay avatars: " + ((HELL.Avatar) ? "yes" : "no") + "\nnotification display: " + ((HELL.NotificationToggle != 2) ? "show option (" + HELL.NotificationToggle + ")" : "hide") + "\npopup display: " + ((HELL.Popups) ? "show" : "hide") + "\nfont size: " + HELL.FontSize + "PX\n\ntype !commands or !hell\nfor list of commands.</center>");
        }
     
        function Alert() {
            HELL.Message[arguments[0]].push({
                "time": Time(),
                "namecolor": (arguments[2] !== undefined) ? "#000000" : "#3f69c0",
                "avatar": (arguments[2] !== undefined) ? ("") : (""),
                "username": "",
                "nick": (arguments[2] !== undefined) ? (arguments[2]) : ("script version: " + Ver()),
                "msg": ((arguments[2] !== undefined) ? ("<div class=\"systemuser\">" + arguments[1] + "</div>") : arguments[1]),
                "mention": true
            });
            var len = HELL.Message[arguments[0]].length - 1;
            arguments[1] = HELL.Message[arguments[0]][len];
            CreateMessage(arguments[1].time, arguments[1].namecolor, arguments[1].avatar, arguments[1].username, arguments[1].nick, arguments[1].msg, arguments[1].mention, arguments[0]);
        }
     
        function Ver() {
            return window.HELLVersion.Major + "." + window.HELLVersion.Minor + "." + window.HELLVersion.Patch;
        }
     
        function AddUserNotification() {
            if (HELL.FullLoad && HELL.ShowedSettings) {
                var chat = ChatLogElement.querySelector("#notification-content"),
                    Notification;
                HELL.NotificationScroll = (Math.floor(chat.scrollTop) + 5 >= (chat.scrollHeight - chat.offsetHeight)) ? true : false;
                if (arguments[0] == 1) {
                    Notification = "(" + arguments[3] + ((arguments[4]) ? ") is " : ") has stopped ") + "broadcasting.";
                } else if (arguments[0] == 2) {
                    Notification = "(" + arguments[3] + ") has " + ((!arguments[4]) ? "joined." : "left.");;
                } else if (arguments[0] == 3) {
                    Notification = arguments[2] + "has mentioned you.";
                    if (HELL.NotificationToggle == 0) ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><div class=\"notification\"><span style=\"background:" + arguments[1] + "\" class=\"nickname\">" + arguments[2] + "</span>" + ((HELL.TimeStampToggle) ? "<span class=\"time\"> " + Time() + " </span>" : "") + "<br/> has mentioned you.</div></div>");
                    UpdateScroll(2, true);
                } else if (arguments[0] == 4) {
                    Notification = "(" + arguments[3] + ") changed nick to " + arguments[5];
                }
                if (arguments[0] != 3 && HELL.NotificationToggle == 0) ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><div class=\"notification\"><span class=\"nickname\" style=\"background:" + arguments[1] + ";\">" + arguments[2] + "</span>" + ((HELL.TimeStampToggle) ? "<span class=\"time\"> " + Time() + " </span>" : "") + "<br/>" + Notification + "</div></div>");
                if (HELL.NotificationToggle == 1) Alert(0, Notification, arguments[2]);
                if (HELL.TTS.synth !== undefined && (HELL.TTSList.includes(arguments[3]) || HELL.TTSList.includes("-ALL") || HELL.TTSList.includes("-EVENT"))) TTS(arguments[2] + ((arguments[0] == 4) ? " " : "as ") + Notification);
                UpdateScroll(2, false);
                var Notifications = ChatLogElement.querySelectorAll(".notification");
                if (Notifications.length > HELL.NotificationLimit + 25) {
                    for (var NotificationIndex = 0; NotificationIndex < Notifications.length - HELL.NotificationLimit; NotificationIndex++) Notifications[NotificationIndex].parentNode.removeChild(Notifications[NotificationIndex]);
                }
            }
        }
     
        function AddSystemNotification() {
            if (HELL.FullLoad && HELL.ShowedSettings) {
                if (HELL.NotificationToggle == 0) {
                    ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><span class=\"nickname\"style=\"background:#F00\">SYSTEM</span>" + ((HELL.TimeStampToggle) ? "<span class=\"time\"> " + Time() + " </span>" : "") + "<br/>" + arguments[0] + "</div>");
                } else if (HELL.NotificationToggle == 1) {
                    Alert(0, arguments[0], "SYSTEM");
                }
                if (HELL.TTS.synth !== undefined && (HELL.TTSList.includes("-ALL") || HELL.TTSList.includes("-EVENT"))) TTS(arguments[0]);
                UpdateScroll(2, false);
            }
        }
        //USER FUNCTION
        function AddUser() {
            HELL.UserList.push({
                "handle": arguments[0],
                "username": arguments[5],
                "nick": arguments[4],
                "owner": arguments[7],
                "mod": arguments[1],
                "namecolor": arguments[2],
                "avatar": arguments[3],
                "broadcasting": false,
                "vote": 0,
            });
            if (HELL.ScriptInit) AddUserNotification(2, arguments[2], arguments[4], arguments[5], false);
        }
     
        function HandleToUser() {
            for (var user = 0; user < HELL.UserList.length; user++) {
                if (HELL.UserList[user].handle == arguments[0]) return user;
            }
            return -1;
        }
     
        function UsernameToHandle() {
            for (var user = 0; user < HELL.UserList.length; user++) {
                if (HELL.UserList[user].username.toUpperCase() == arguments[0]) return HELL.UserList[user].handle;
            }
            return -1;
        }
     
        function UsernameToUser() {
            for (var user = 0; user < HELL.UserList.length; user++) {
                if (HELL.UserList[user].username.toUpperCase() == arguments[0]) return user;
            }
            return -1;
        }
     
        function NicknameToHandle() {
            for (var user = 0; user < HELL.UserList.length; user++) {
                if (HELL.UserList[user].nick.toUpperCase() == arguments[0]) return HELL.UserList[user].handle;
            }
            return -1;
        }
     
        function NicknameToUser() {
            for (var user = 0; user < HELL.UserList.length; user++) {
                if (HELL.UserList[user].nick.toUpperCase() == arguments[0]) return user;
            }
            return -1;
        }
     
        function CheckUserListSafe() {
            var len = HELL.UserList.length;
            var temp = [];
            if (Addon.active("AKB")) temp = Addon.get("AKB");
            for (var user = 0; user < len; user++) {
                if (!HELL.UserList[user].mod && !isSafeListed(HELL.UserList[user].username)) HELL.KBQueue.push(HELL.UserList[user].handle);
            }
            len = HELL.KBQueue.length;
            for (var kb = 0; kb < len; kb++) {
                Send(arguments[0], HELL.KBQueue[kb]);
            }
            HELL.KBQueue = [];
        }
     
        function isSafeListed() {
            var temp = [];
            if (Addon.active("AKB")) temp = Addon.get("AKB");
            return (HELL.SafeList.includes(arguments[0]) || temp.includes(arguments[0]));
        }
     
        function CheckUserTempIgnore() {
            if (HELL.TempIgnoreUserList.includes(HELL.UserList[arguments[0]].username) || HELL.TempIgnoreNickList.includes(HELL.UserList[arguments[0]].nick.toUpperCase())) return true;
            return false;
        }
     
        function CheckUserIgnore() {
            if (HELL.IgnoreList.includes(HELL.UserList[arguments[0]].username)) return true;
            return false;
        }
     
        function CheckUserTouchScreen() {
            if (/Mobi|Android/i.test(navigator.userAgent) || 'ontouchstart' in document.documentElement) {
                HELL.Project.isTouchScreen = true;
                HELL.ThemeChange = true;
            }
        }
     
        function CheckUserAbuse() {
            var action = false;
            if (HELL.Me.mod) {
                if (HELL.UserKickList.includes(arguments[1]) || HELL.NickKickList.includes(arguments[2].toUpperCase())) {
                    HELL.NoGreet = true;
                    Send("kick", arguments[0]);
                    action = true;
                }
                if (!action) {
                    if (HELL.UserBanList.includes(arguments[1]) || HELL.NickBanList.includes(arguments[2].toUpperCase())) {
                        HELL.NoGreet = true;
                        Send("ban", arguments[0]);
                    }
                }
            }
        }
     
        function CheckUserWordAbuse() {
            if (HELL.UserList[arguments[0]].handle != HELL.Me.handle && !HELL.UserList[arguments[0]].mod) {
                var action = false; //LETS NOT REPEAT/KICK
                var len = HELL.KickKeywordList.length;
                for (var i = 0; i < len; i++) {
                    if (arguments[1].includes(HELL.KickKeywordList[i])) {
                        Send("kick", HELL.UserList[arguments[0]].handle);
                        action = true;
                        break;
                    }
                }
                if (!action) {
                    len = HELL.BanKeywordList.length;
                    for (i = 0; i < len; i++) {
                        if (arguments[1].includes(HELL.BanKeywordList[i])) {
                            Send("ban", HELL.UserList[arguments[0]].handle);
                            break;
                        }
                    }
                }
            }
        }
     
        function RemoveUserCamera() {
            var len = HELL.Camera.List.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    if (HELL.Camera.List[i] === arguments[0]) {
                        HELL.Camera.List.splice(i, 1);
                        clearTimeout(HELL.Camera.clearRandom);
                        break;
                    }
                }
            }
        }
     
        function CheckUserStream() {
            if (HELL.Me.mod) {
                var user = HandleToUser(arguments[0]);
                if (user != -1) {
                    if (arguments[1]) {
                        //PUSH UPDATE
                        HELL.Camera.List.push(HELL.UserList[user].handle);
                        HELL.UserList[user].broadcasting = true;
                        var len = HELL.Camera.List.length;
                        if (HELL.UserList[user].username !== "GUEST" && !HELL.GreenRoomList.includes(HELL.UserList[user].username)) {
                            HELL.GreenRoomList.push(HELL.UserList[user].username);
                            Save("GreenRoomList", JSON.stringify(HELL.GreenRoomList));
                        }
                        //CLEAR TIMERS
                        clearTimeout(HELL.Camera.clearRandom);
                        //CAMERA SWEEP FUNCTION
                        if (len >= 12 && HELL.Me.handle === HELL.Host && HELL.Camera.Sweep) {
                            HELL.Camera.clearRandom = setTimeout(function() {
                                var rand = Rand(0, len - 1);
                                if (HELL.Camera.List[rand] !== HELL.Me.handle && HELL.Camera.Sweep) {
                                    var target = HandleToUser(HELL.Camera.List[rand]);
                                    if (HELL.Me.owner || !HELL.UserList[target].mod) {
                                        Send("msg", "[Camera Clear]\n" + HELL.UserList[target].nick + "!\nyou've been randomly selected; you win a cam close!");
                                        Send("stream_moder_close", HELL.Camera.List[rand]);
                                        HELL.Camera.List.splice(rand, 1);
                                    }
                                }
                            }, HELL.Camera.SweepTimer * 60000);
                        }
                    } else {
                        clearTimeout(HELL.Camera.clearRandom);
                        RemoveUserCamera(HELL.UserList[user].handle);
                        HELL.UserList[user].broadcasting = false;
                    }
                    HELL.UserList[user].broadcasting = arguments[1];
                    if (HELL.ScriptInit) AddUserNotification(1, HELL.UserList[user].namecolor, HELL.UserList[user].nick, HELL.UserList[user].username, arguments[1]);
                }
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
            var val = localStorage.getItem(HELL.Project.Storage + arguments[0]);
            if (null === val && "undefined" != typeof arguments[1]) {
                Save(arguments[0], arguments[1]);
                return arguments[1];
            }
            return val;
        }
     
        function Save() {
            if (HELL.StorageSupport) {
                localStorage.setItem(HELL.Project.Storage + arguments[0], arguments[1]);
            } else {
                Alert(GetActiveChat(), "storage now allowed on this device.");
            }
        }
     
        //SOCKET FUNCTION
        function HELLWebSocket() {
            if (window.Proxy === undefined) return;
            var handler = {
                set: function(Target, prop, value) {
                    if (prop == "onmessage") {
                        var oldMessage = value;
                        value = function(event) {
                            ServerMsg(JSON.parse(event.data), Target);
                            oldMessage(event);
                        };
                    }
                    return (Target[prop] = value);
                },
                get: function(Target, prop) {
                    var value = Target[prop];
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
            var WebSocketProxy = new window.Proxy(window.WebSocket, {
                construct: function(Target, args) {
                    HELL.SocketTarget = new Target(args[0]);
                    debug("SOCKET::CONNECTING", args[0]);
                    return new window.Proxy(HELL.SocketTarget, handler);
                }
            });
            window.WebSocket = WebSocketProxy;
        }
     
        function ModCommand() {
            var name = arguments[1].match(/^!(?:userkick|nickkick|userban|nickban|userclose|nickclose) (guest-[0-9]{1,32}|[a-z0-9_]{1,32})$/i),
                target;
            if (name !== null) {
                if (name[1].toUpperCase() !== "GUEST") {
                    target = ((arguments[2]) ? UsernameToUser(name[1].toUpperCase()) : NicknameToUser(name[1].toUpperCase()));
                } else {
                    target = NicknameToUser(name[1].toUpperCase());
                }
                if (target != -1) { // USER ONLINE
                    if (HELL.UserList[target].handle !== HELL.Me.handle && !HELL.BotModList.includes(HELL.UserList[target].username) && !HELL.UserList[target].mod) {
                        //IF USER IS NOT HOST/MODERATOR/JR.MODERATOR
                        if (arguments[0] === "stream_moder_close") {
                            if (HELL.UserList[target].broadcasting) Send(arguments[0], HELL.UserList[target].handle);
                        } else {
                            Send(arguments[0], HELL.UserList[target].handle);
                        }
                    } else {
                        Send("msg", "users authorisation is equal or above yours.");
                    }
                }
            }
        }
     
        function BotCommand() {
            if (arguments[0] == 5) {
                SetBot(true);
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
     
        //SERVER/CLIENT LIST FUNCTION
        var CommandList = {
            commands: function() {
                Alert(GetActiveChat(), "<b style=\"color:#ffffff;\"><u>mod commands:</u></b>\n!whoisbot\n!bot\n!bottoggle\n!greenroomtoggle\n!publiccommandtoggle\n!camsweep <b style=\"color:#ffff00;\">5 - 30</b>\n!votetoggle\n!autokick\n!autoban\n\n!userbanlist\n!userbanlistclear\n!userbanadd <b style=\"color:#ffff00;\">user</b>\n!userbanremove <b style=\"color:#ffff00;\">#</b>\n\n!nickbanlist\n!nickbanlistclear\n!nickbanadd <b style=\"color:#ffff00;\">nick</b>\n!nickbanremove <b style=\"color:#ffff00;\">#</b>\n\n!bankeywordlist\n!bankeywordlistclear\n!bankeywordadd <b style=\"color:#ffff00;\">keyword | phrase</b>\n!bankeywordremove <b style=\"color:#ffff00;\">#</b>\n\n!userkicklist\n!userkicklistclear\n!userkickadd <b style=\"color:#ffff00;\">user</b>\n!userkickremove <b style=\"color:#ffff00;\">#</b>\n\n!nickkicklist\n!nickkicklistclear\n!nickkickadd <b style=\"color:#ffff00;\">nick</b>\n!nickkickremove <b style=\"color:#ffff00;\">#</b>\n\n!kickkeywordlist\n!kickkeywordlistclear\n!kickkeywordadd <b style=\"color:#ffff00;\">keyword | phrase</b>\n!kickkeywordremove <b style=\"color:#ffff00;\">#</b>\n\n!oplist\n!oplistclear\n!opadd <b style=\"color:#ffff00;\">user | -all</b>\n!opremove <b style=\"color:#ffff00;\">#</b>\n!optoggle\n\n!modlist\n!modlistclear\n!modadd <b style=\"color:#ffff00;\">user</b>\n!modremove <b style=\"color:#ffff00;\">#</b>\n\n<b style=\"color:#ffffff;\"><u>Jr. Moderator Commands:</u></b>\n!userban <b style=\"color:#ffff00;\">user</b>\n!nickban <b style=\"color:#ffff00;\">nick</b>\n!userkick <b style=\"color:#ffff00;\">user</b>\n!nickkick <b style=\"color:#ffff00;\">nick</b>\n!userclose <b style=\"color:#ffff00;\">user</b>\n!nickclose <b style=\"color:#ffff00;\">nick</b>\n\n<b style=\"color:#ffffff;\"><u>User Commands:</u></b>\n!mentionlist\n!mentionlistclear\n!mentionadd <b style=\"color:#ffff00;\">keyword</b>\n!mentionremove <b style=\"color:#ffff00;\">#</b>\n\n!ignorelist\n!ignorelistclear\n!ignoreadd <b style=\"color:#ffff00;\">user</b>\n!ignoreremove <b style=\"color:#ffff00;\">#</b>\n\n!hiddencameralist\n!hiddencameralistclear\n!hiddencameraadd <b style=\"color:#ffff00;\">user</b>\n!hiddencameraremove <b style=\"color:#ffff00;\">#</b>\n\n!greetlist\n!greetlistclear\n!greetadd <b style=\"color:#ffff00;\">user | -all</b>\n!greetremove <b style=\"color:#ffff00;\">#</b>\n\n!ttslist\n!ttslistclear\n!ttsadd <b style=\"color:#ffff00;\">user | -all | -event</b>\n!ttsremove <b style=\"color:#ffff00;\">#</b>\n\n!highlightlist\n!highlightlistclear\n!highlightadd <b style=\"color:#ffff00;\">user</b>\n!highlightremove <b style=\"color:#ffff00;\">#</b>\n\n!reminderlist\n!reminderlistclear\n!reminderadd <b style=\"color:#ffff00;\">user</b>\n!reminderremove <b style=\"color:#ffff00;\">#</b>\n!remindertoggle\n\n!safelist\n!safelistclear\n!safeadd <b style=\"color:#ffff00;\">user</b>\n!saferemove <b style=\"color:#ffff00;\">#</b>\n\n!greenroomlist\n!greenroomlistclear\n!greenroomadd <b style=\"color:#ffff00;\">user</b>\n!greenroomremove <b style=\"color:#ffff00;\">#</b>\n\n!greenroomignorelist\n!greenroomignorelistclear\n!greenroomignoreadd <b style=\"color:#ffff00;\">user</b>\n!greenroomignoreremove <b style=\"color:#ffff00;\">#</b>\n\n!userlist\n\n!lists\n!listsclear\n\n!greetmodetoggle\n!imgurtoggle\n!avatartoggle\n!notificationtoggle <b style=\"color:#ffff00;\"></b>\n!popuptoggle\n!soundmetertoggle\n!timestamptoggle\n\n!coin\n!advice\n!8ball <b style=\"color:#ffff00;\">question</b>\n!roll <b style=\"color:#ffff00;\">#</b>\n!chuck\n!dad\n\n!vote <b style=\"color:#ffff00;\">user</b>\n\n!clrall\n!clr\n!settings\n!share\n\n<b style=\"color:#ffffff;\"><u>toggle showing a box around multiple messages:</u></b>\n!stackmessage\n\n<b style=\"color:#ffffff;\"><u>toggle seeing games or not:</u></b>\n!gameview");
            },
            hell: function() {
                this.commands();
            },
            userlist: function() {
                Alert(GetActiveChat(), SettingsList.UserList());
            },
            mentionadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.MentionList.includes(arguments[0].toUpperCase())) {
                            HELL.MentionList.push(arguments[0].toUpperCase());
                            Save("MentionList", JSON.stringify(HELL.MentionList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            mentionremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.MentionList[arguments[0]] !== undefined) {
                        HELL.MentionList.splice(arguments[0], 1);
                        Save("MentionList", JSON.stringify(HELL.MentionList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            mentionlistclear: function() {
                HELL.MentionList = [];
                Save("MentionList", JSON.stringify(HELL.MentionList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            mentionlist: function() {
                Alert(GetActiveChat(), SettingsList.MentionList());
            },
            hiddencameraadd: function() {
                if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.HiddenCameraList.includes(arguments[0].toUpperCase())) {
                            HELL.HiddenCameraList.push(arguments[0].toUpperCase());
                            Save("HiddenCameraList", JSON.stringify(HELL.HiddenCameraList));
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            hiddencameraremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.HiddenCameraList[arguments[0]] !== undefined) {
                        HELL.HiddenCameraList.splice(arguments[0], 1);
                        Save("HiddenCameraList", JSON.stringify(HELL.HiddenCameraList));
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            hiddencameralistclear: function() {
                HELL.HiddenCameraList = [];
                Save("HiddenCameraList", JSON.stringify(HELL.HiddenCameraList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            hiddencameralist: function() {
                Alert(GetActiveChat(), SettingsList.HiddenCameraList());
            },
            ignoreadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.IgnoreList.includes(arguments[0].toUpperCase())) {
                            HELL.IgnoreList.push(arguments[0].toUpperCase());
                            Save("IgnoreList", JSON.stringify(HELL.IgnoreList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            ignoreremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.IgnoreList[arguments[0]] !== undefined) {
                        HELL.IgnoreList.splice(arguments[0], 1);
                        Save("IgnoreList", JSON.stringify(HELL.IgnoreList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            ignorelistclear: function() {
                HELL.IgnoreList = [];
                Save("IgnoreList", JSON.stringify(HELL.IgnoreList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            ignorelist: function() {
                Alert(GetActiveChat(), SettingsList.IgnoreList());
            },
            userbanadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.UserBanList.includes(arguments[0].toUpperCase())) {
                            HELL.UserBanList.push(arguments[0].toUpperCase());
                            Save("UserBanList", JSON.stringify(HELL.UserBanList));
                            Alert(GetActiveChat(), "✓ ok.");
                            var check = UsernameToHandle(arguments[0].toUpperCase());
                            if (check != -1 && HELL.Me.mod) Send("ban", check);
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            userbanremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.UserBanList[arguments[0]] !== undefined) {
                        HELL.UserBanList.splice(arguments[0], 1);
                        Save("UserBanList", JSON.stringify(HELL.UserBanList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            userbanlistclear: function() {
                HELL.UserBanList = [];
                Save("UserBanList", JSON.stringify(HELL.UserBanList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            userbanlist: function() {
                Alert(GetActiveChat(), SettingsList.UserBanList());
            },
            nickbanadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.NickBanList.includes(arguments[0].toUpperCase())) {
                            HELL.NickBanList.push(arguments[0].toUpperCase());
                            Save("NickBanList", JSON.stringify(HELL.NickBanList));
                            Alert(GetActiveChat(), "✓ ok.");
                            var check = NicknameToHandle(arguments[0].toUpperCase());
                            if (check != -1 && HELL.Me.mod) Send("ban", check);
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            nickbanremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.NickBanList[arguments[0]] !== undefined) {
                        HELL.NickBanList.splice(arguments[0], 1);
                        Save("NickBanList", JSON.stringify(HELL.NickBanList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            nickbanlistclear: function() {
                HELL.NickBanList = [];
                Save("NickBanList", JSON.stringify(HELL.NickBanList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            nickbanlist: function() {
                Alert(GetActiveChat(), SettingsList.NickBanList());
            },
            userkickadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.UserKickList.includes(arguments[0].toUpperCase())) {
                            HELL.UserKickList.push(arguments[0].toUpperCase());
                            Save("UserKickList", JSON.stringify(HELL.UserKickList));
                            Alert(GetActiveChat(), "✓ ok.");
                            var check = UsernameToHandle(arguments[0].toUpperCase());
                            if (check != -1 && HELL.Me.mod) Send("kick", check);
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            userkickremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.UserKickList[arguments[0]] !== undefined) {
                        HELL.UserKickList.splice(arguments[0], 1);
                        Save("UserKickList", JSON.stringify(HELL.UserKickList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            userkicklistclear: function() {
                HELL.UserKickList = [];
                Save("UserKickList", JSON.stringify(HELL.UserKickList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            userkicklist: function() {
                Alert(GetActiveChat(), SettingsList.UserKickList());
            },
            nickkickadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.NickKickList.includes(arguments[0].toUpperCase())) {
                            HELL.NickKickList.push(arguments[0].toUpperCase());
                            Save("NickKickList", JSON.stringify(HELL.NickKickList));
                            Alert(GetActiveChat(), "✓ ok.");
                            var check = NicknameToHandle(arguments[0].toUpperCase());
                            if (check != -1 && HELL.Me.mod) Send("kick", check);
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            nickkickremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.NickKickList[arguments[0]] !== undefined) {
                        HELL.NickKickList.splice(arguments[0], 1);
                        Save("NickKickList", JSON.stringify(HELL.NickKickList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            nickkicklistclear: function() {
                HELL.NickKickList = [];
                Save("NickKickList", JSON.stringify(HELL.NickKickList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            nickkicklist: function() {
                Alert(GetActiveChat(), SettingsList.NickKickList());
            },
            bankeywordadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (!HELL.BanKeywordList.includes(arguments[0])) {
                        HELL.BanKeywordList.push(arguments[0]);
                        Save("BanKeywordList", JSON.stringify(HELL.BanKeywordList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - item already exists.");
                    }
                }
            },
            bankeywordremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.BanKeywordList[arguments[0]] !== undefined) {
                        HELL.BanKeywordList.splice(arguments[0], 1);
                        Save("BanKeywordList", JSON.stringify(HELL.BanKeywordList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            bankeywordlistclear: function() {
                HELL.BanKeywordList = [];
                Save("BanKeywordList", JSON.stringify(HELL.BanKeywordList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            bankeywordlist: function() {
                Alert(GetActiveChat(), SettingsList.BanKeywordList());
            },
            kickkeywordadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (!HELL.KickKeywordList.includes(arguments[0])) {
                        HELL.KickKeywordList.push(arguments[0]);
                        Save("KickKeywordList", JSON.stringify(HELL.KickKeywordList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - item already exists.");
                    }
                }
            },
            kickkeywordremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.KickKeywordList[arguments[0]] !== undefined) {
                        HELL.KickKeywordList.splice(arguments[0], 1);
                        Save("KickKeywordList", JSON.stringify(HELL.KickKeywordList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            kickkeywordlistclear: function() {
                HELL.KickKeywordList = [];
                Save("KickKeywordList", JSON.stringify(HELL.KickKeywordList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            kickkeywordlist: function() {
                Alert(GetActiveChat(), SettingsList.KickKeywordList());
            },
            greetadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserName(arguments[0])) {
                        if (!HELL.GreetList.includes(arguments[0].toUpperCase())) {
                            HELL.GreetList.push(arguments[0].toUpperCase());
                            Save("GreetList", JSON.stringify(HELL.GreetList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            greetremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.GreetList[arguments[0]] !== undefined) {
                        HELL.GreetList.splice(arguments[0], 1);
                        Save("GreetList", JSON.stringify(HELL.GreetList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            greetlistclear: function() {
                HELL.GreetList = [];
                Save("GreetList", JSON.stringify(HELL.GreetList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            greetlist: function() {
                Alert(GetActiveChat(), SettingsList.GreetList());
            },
            highlightadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.HighlightList.includes(arguments[0].toUpperCase())) {
                            HELL.HighlightList.push(arguments[0].toUpperCase());
                            Save("HighlightList", JSON.stringify(HELL.HighlightList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            highlightremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.HighlightList[arguments[0]] !== undefined) {
                        HELL.HighlightList.splice(arguments[0], 1);
                        Save("HighlightList", JSON.stringify(HELL.HighlightList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            highlightlistclear: function() {
                HELL.HighlightList = [];
                Save("HighlightList", JSON.stringify(HELL.HighlightList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            highlightlist: function() {
                Alert(GetActiveChat(), SettingsList.HighlightList());
            },
            opadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserName(arguments[0])) {
                        if (!HELL.BotOPList.includes(arguments[0].toUpperCase())) {
                            HELL.BotOPList.push(arguments[0].toUpperCase());
                            Save("BotOPList", JSON.stringify(HELL.BotOPList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            opremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.BotOPList[arguments[0]] !== undefined) {
                        HELL.BotOPList.splice(arguments[0], 1);
                        Save("BotOPList", JSON.stringify(HELL.BotOPList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            oplistclear: function() {
                HELL.BotOPList = [];
                Save("BotOPList", JSON.stringify(HELL.BotOPList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            oplist: function() {
                Alert(GetActiveChat(), SettingsList.BotOPList());
            },
            modadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.BotModList.includes(arguments[0].toUpperCase())) {
                            HELL.BotModList.push(arguments[0].toUpperCase());
                            Save("BotModList", JSON.stringify(HELL.BotModList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            modremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.BotModList[arguments[0]] !== undefined) {
                        HELL.BotModList.splice(arguments[0], 1);
                        Save("BotModList", JSON.stringify(HELL.BotModList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            modlistclear: function() {
                HELL.BotModList = [];
                Save("BotModList", JSON.stringify(HELL.BotModList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            modlist: function() {
                Alert(GetActiveChat(), SettingsList.BotModList());
            },
            ttsadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (arguments[0].match(/^(-all|-event|[a-z0-9_]){1,32}$/i)) {
                        if (!HELL.TTSList.includes(arguments[0].toUpperCase())) {
                            HELL.TTSList.push(arguments[0].toUpperCase());
                            Save("TTSList", JSON.stringify(HELL.TTSList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - item already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            ttsremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.TTSList[arguments[0]] !== undefined) {
                        HELL.TTSList.splice(arguments[0], 1);
                        Save("TTSList", JSON.stringify(HELL.TTSList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            ttslistclear: function() {
                HELL.TTSList = [];
                Save("TTSList", JSON.stringify(HELL.TTSList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            ttslist: function() {
                Alert(GetActiveChat(), SettingsList.TTSList());
            },
            reminderadd: function() {
                if (arguments[0] === "") {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    var reminder = arguments[0].match(/^((?:1[0-2]|0?[1-9]):(?:[0-5][0-9]) ?(?:am|pm)) ([\w\d\s|[^\x00-\x7F]*]*)/i);
                    if (reminder === null) {
                        Alert(GetActiveChat(), "X Command Rejected!\n!reminderadd 4:18 PM This is an example you can try!");
                    } else {
                        HELL.ReminderList.push([reminder[1], reminder[2]]);
                        Save("ReminderList", JSON.stringify(HELL.ReminderList));
                        Alert(GetActiveChat(), "✓ ok.");
                        Reminder();
                    }
                }
            },
            reminderremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.ReminderList[arguments[0]] !== undefined) {
                        HELL.ReminderList.splice(arguments[0], 1);
                        Save("ReminderList", JSON.stringify(HELL.ReminderList));
                        Reminder();
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            reminderlistclear: function() {
                HELL.ReminderList = [];
                Save("ReminderList", JSON.stringify(HELL.ReminderList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            reminderlist: function() {
                Alert(GetActiveChat(), SettingsList.ReminderList());
            },
            remindertoggle: function() {
                HELL.Reminder = !HELL.Reminder;
                Save("Reminder", JSON.stringify(HELL.Reminder));
                Reminder();
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.Reminder) ? "Reminders are now on!\n" : "Reminders are now off!\n "));
            },
            soundmetertoggle: function() {
                HELL.SoundMeterToggle = !HELL.SoundMeterToggle;
                Save("SoundMeterToggle", JSON.stringify(HELL.SoundMeterToggle));
                SoundMeter();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.SoundMeterToggle) ? "Sound meter is now on!\n" : "Sound meter is now off!\n "));
            },
            timestamptoggle: function() {
                HELL.TimeStampToggle = !HELL.TimeStampToggle;
                Save("TimeStampToggle", JSON.stringify(HELL.TimeStampToggle));
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.TimeStampToggle) ? "Timestamps are now on!\n" : "Timestamps are now off\n "));
            },
            safeadd: function() {
                if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") { // Can't protect guests;
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.SafeList.includes(arguments[0].toUpperCase())) {
                            HELL.SafeList.push(arguments[0].toUpperCase());
                            Save("AKB", JSON.stringify(HELL.SafeList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X Command Rejected!\nUser is already entered!");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            saferemove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.SafeList[arguments[0]] !== undefined) {
                        HELL.SafeList.splice(arguments[0], 1);
                        Save("AKB", JSON.stringify(HELL.SafeList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            safelistclear: function() {
                HELL.SafeList = [];
                Save("AKB", JSON.stringify(HELL.SafeList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            safelist: function() {
                Alert(GetActiveChat(), SettingsList.SafeList());
            },
            greenroomadd: function() {
                if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") { // Can't protect guests;
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.GreenRoomList.includes(arguments[0].toUpperCase())) {
                            HELL.GreenRoomList.push(arguments[0].toUpperCase());
                            Save("GreenRoomList", JSON.stringify(HELL.GreenRoomList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X Command Rejected!\nUser is already entered!");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            greenroomremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.GreenRoomList[arguments[0]] !== undefined) {
                        HELL.GreenRoomList.splice(arguments[0], 1);
                        Save("GreenRoomList", JSON.stringify(HELL.GreenRoomList));
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            greenroomlistclear: function() {
                HELL.GreenRoomList = [];
                Save("GreenRoomList", JSON.stringify(HELL.GreenRoomList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            greenroomlist: function() {
                Alert(GetActiveChat(), SettingsList.GreenRoomList());
            },
            greenroomignoreadd: function() {
                if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") { // Can't protect guests;
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (CheckUserNameStrict(arguments[0])) {
                        if (!HELL.GreenRoomIgnoreList.includes(arguments[0].toUpperCase())) {
                            HELL.GreenRoomIgnoreList.push(arguments[0].toUpperCase());
                            Save("GreenRoomIgnoreList", JSON.stringify(HELL.GreenRoomIgnoreList));
                            Alert(GetActiveChat(), "✓ ok.");
                        } else {
                            Alert(GetActiveChat(), "X oops - user already exists.");
                        }
                    } else {
                        Alert(GetActiveChat(), "X oops - criteria not met.");
                    }
                }
            },
            greenroomignoreremove: function() {
                if (arguments[0] === "" || isNaN(arguments[0])) {
                    Alert(GetActiveChat(), "X oops. parameter incorrect.");
                } else {
                    if (HELL.GreenRoomIgnoreList[arguments[0]] !== undefined) {
                        HELL.GreenRoomIgnoreList.splice(arguments[0], 1);
                        Save("GreenRoomIgnoreList", JSON.stringify(HELL.GreenRoomIgnoreList));
                        Alert(GetActiveChat(), "✓ ok.");
                    } else {
                        Alert(GetActiveChat(), "X oops - ID not found.");
                    }
                }
            },
            greenroomignorelistclear: function() {
                HELL.GreenRoomIgnoreList = [];
                Save("GreenRoomIgnoreList", JSON.stringify(HELL.GreenRoomIgnoreList));
                Alert(GetActiveChat(), "✓ ok.");
            },
            greenroomignorelist: function() {
                Alert(GetActiveChat(), SettingsList.GreenRoomIgnoreList());
            },
            optoggle: function() {
                HELL.UserYT = !HELL.UserYT;
                Save("UserYT", JSON.stringify(HELL.UserYT));
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.UserYT) ? "Operators can now use YouTube.\n" : "Operators cannot use YouTube.\n"));
            },
            avatartoggle: function() {
                HELL.Avatar = !HELL.Avatar;
                Save("Avatar", JSON.stringify(HELL.Avatar));
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.Avatar) ? "Avatars from now on will be visible!\n " : "Avatars from now on will hidden!\n"));
            },
            popuptoggle: function() {
                HELL.Popups = !HELL.Popups;
                Save("Popups", JSON.stringify(HELL.Popups));
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.Popups) ? "Popups from now on will be visible!\n " : "Popups from now on will hidden!\n"));
            },
            notificationtoggle: function() {
                HELL.NotificationToggle++;
                if (HELL.NotificationToggle >= 3) HELL.NotificationToggle = 0;
                Save("NotificationToggle", JSON.stringify(HELL.NotificationToggle));
                NotificationDisplay();
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\nNotifications " + ((HELL.NotificationToggle == 0) ? "above chat enabled" : (HELL.NotificationToggle == 1) ? "in chat enabled" : "disabled") + ".");
            },
            greetmodetoggle: function() {
                HELL.GreetMode = !HELL.GreetMode;
                Save("GreetMode", JSON.stringify(HELL.GreetMode));
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.GreetMode) ? "Server like greet is enabled." : "Server like greet is disabled."));
            },
            stackmessage: function () {
                HELL.ToggleStackMessage = !HELL.ToggleStackMessage;
                Save("ToggleStackMessage", JSON.stringify(HELL.ToggleStackMessage));
            },
            imgurtoggle: function() {
                HELL.Imgur = !HELL.Imgur;
                Save("Imgur", JSON.stringify(HELL.Imgur));
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.Imgur) ? "Imgur preview is enabled." : "Imgur preview is disabled."));
            },
            publiccommandtoggle: function() {
                HELL.PublicCommandToggle = !HELL.PublicCommandToggle;
                Save("PublicCommandToggle", JSON.stringify(HELL.PublicCommandToggle));
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.PublicCommandToggle) ? "Public commands (8Ball,  Advice, Chuck, Coin, Dad, Urb) are enabled." : "Public commands (8Ball,  Advice, Chuck, Coin, Dad, Urb) are disabled."));
            },
            greenroomtoggle: function() {
                HELL.GreenRoomToggle = !HELL.GreenRoomToggle;
                Save("GreenRoomToggle", JSON.stringify(HELL.GreenRoomToggle));
                //Settings();
                Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.GreenRoomToggle) ? "Green Room Auto Allow ON!" : "Green Room Auto Allow OFF!"));
            },
            clr: function() {
                HELL.Message[GetActiveChat()] = [];
                ChatLogElement.querySelector("#HELL-chat-content").innerHTML = "";
            },
            clrall: function() {
                HELL.Message = [];
                HELL.Message[0] = [];
                window.TinychatApp.getInstance().defaultChatroom._chatlog.items = [];
                ChatLogElement.querySelector("#HELL-chat-content").innerHTML = "";
            },
            autokick: function() {
                if (arguments[1] === false && HELL.Me.mod) {
                    HELL.AutoKick = !HELL.AutoKick;
                    HELL.AutoBan = false;
                    Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.AutoKick) ? "AUTO KICK IS NOW ON!" : "AUTO KICK IS NOW OFF!"));
                    if (HELL.AutoKick === true) CheckUserListSafe("kick");
                }
            },
            autoban: function() {
                if (arguments[1] === false && HELL.Me.mod) {
                    HELL.AutoBan = !HELL.AutoBan;
                    HELL.AutoKick = false;
                    Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.AutoBan) ? "AUTO BAN IS NOW ON!" : "AUTO BAN IS NOW OFF!"));
                    if (HELL.AutoBan === true) CheckUserListSafe("ban");
                }
            },
            camsweep: function() {
                if (HELL.Me.mod && HELL.Host === HELL.Me.handle) {
                    HELL.Camera.SweepTimer = arguments[0] === "" || isNaN(arguments[0]) ? 5 : (arguments[0] > 30) ? 30 : (arguments[0] < 1) ? 1 : parseInt(arguments[0]);
                    HELL.Camera.Sweep = !HELL.Camera.Sweep;
                    clearTimeout(HELL.Camera.clearRandom);
                    //Settings();
                    Alert(GetActiveChat(), "✓ ok.\n" + ((HELL.Camera.Sweep) ? "Camera sweep is now on!\nTime set: " + HELL.Camera.SweepTimer + "min(s)" : "Camera sweep is now off!"));
                }
            },
            bottoggle: function() {
                HELL.Bot = !HELL.Bot;
                Save("Bot", JSON.stringify(HELL.Bot));
                //Settings();
                Alert(GetActiveChat(), "✓ ok. " + ((HELL.Bot) ? "check for room bot, enabled." : "check for room bot, disabled."));
            },
            votetoggle: function() {
                if (HELL.Me.mod) {
                    HELL.VoteSystem = !HELL.VoteSystem;
                    HELL.WaitToVoteList = [];
                    var len = HELL.UserList.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) HELL.UserList[i].vote = 0;
                    }
                    Alert(GetActiveChat(), "✓ ok. " + ((HELL.VoteSystem) ? "voting is on." : "voting is off."));
                }
            },
            share: function() {
                var msg = "Hell's Tinychat Script.\n \nAsk a Moderator for use!";
                if (GetActiveChat() !== 0) {
                    Send("pvtmsg", msg, GetActiveChat());
                    PushPM(GetActiveChat(), msg);
                } else {
                    Send("msg", msg);
                }
            },
            bot: function() {
                if (arguments[1] === false && HELL.Me.mod) Alert(0, "✓ your script is now acting as bot.");
            },
            gameview: function() {
                HELL.CanSeeGames = !HELL.CanSeeGames;
                Save("CanSeeGames", JSON.stringify(HELL.CanSeeGames));
                //Settings();
                Alert(GetActiveChat(), "✓ ok. " + ((HELL.CanSeeGames) ? "games are now visible." : "games are now hidden."));
            },
            roll: function() {
                var dice,
                    msg = "";
                dice = (arguments[0] === "" || isNaN(arguments[0])) ? 1 : (arguments[0] < 12) ? arguments[0] : 12;
                for (var i = 0; i < dice; i++) msg += Dice();
                if (GetActiveChat() !== 0) {
                    Send("pvtmsg", msg, GetActiveChat());
                    PushPM(GetActiveChat(), msg);
                } else {
                    Send("msg", msg);
                }
            },
            coin: function() {
                if (HELL.Host == 0 || GetActiveChat() !== 0) {
                    var msg = "The coin landed on " + ((Rand(0, 1) == 1) ? "heads" : "tails") + "!";
                    if (GetActiveChat() !== 0) {
                        Send("pvtmsg", msg, GetActiveChat());
                    } else {
                        Send("msg", msg);
                    }
                }
            },
            settings: function() {
                Settings();
            },
            lists: function() {
                Alert(GetActiveChat(), SettingsList.UserList() + "\n" + SettingsList.UserBanList() + "\n" + SettingsList.NickBanList() + "\n" + SettingsList.BanKeywordList() + "\n" + SettingsList.UserKickList() + "\n" + SettingsList.NickKickList() + "\n" + SettingsList.KickKeywordList() + "\n" + SettingsList.BotOPList() + "\n" + SettingsList.BotModList() + "\n" + SettingsList.MentionList() + "\n" + SettingsList.HiddenCameraList() + "\n" + SettingsList.IgnoreList() + "\n" + SettingsList.GreetList() + "\n" + SettingsList.TTSList() + "\n" + SettingsList.HighlightList() + "\n" + SettingsList.ReminderList());
            },
            listsclear: function() {
                HELL.MentionList = [];
                HELL.IgnoreList = [];
                HELL.HiddenCameraList = [];
                HELL.UserBanList = [];
                HELL.UserKickList = [];
                HELL.NickBanList = [];
                HELL.NickKickList = [];
                HELL.BanKeywordList = [];
                HELL.KickKeywordList = [];
                HELL.GreetList = [];
                HELL.HighlightList = [];
                HELL.ReminderList = [];
                HELL.TTSList = [];
                HELL.BotOPList = [];
                HELL.BotModList = [];
                Save("MentionList", JSON.stringify(HELL.MentionList));
                Save("IgnoreList", JSON.stringify(HELL.IgnoreList));
                Save("HiddenCameraList", JSON.stringify(HELL.IgnoreList));
                Save("UserBanList", JSON.stringify(HELL.UserBanList));
                Save("UserKickList", JSON.stringify(HELL.UserKickList));
                Save("NickBanList", JSON.stringify(HELL.NickBanList));
                Save("NickKickList", JSON.stringify(HELL.NickKickList));
                Save("BanKeywordList", JSON.stringify(HELL.BanKeywordList));
                Save("KickKeywordList", JSON.stringify(HELL.KickKeywordList));
                Save("GreetList", JSON.stringify(HELL.GreetList));
                Save("HighlightList", JSON.stringify(HELL.HighlightList));
                Save("ReminderList", JSON.stringify(HELL.ReminderList));
                Save("TTSList", JSON.stringify(HELL.TTSList));
                Save("BotModList", JSON.stringify(HELL.BotModList));
                Save("BotOPList", JSON.stringify(HELL.BotOPList));
                Alert(GetActiveChat(), "✓ all lists cleared.");
            },
        };
        var SettingsList = {
            UserList: function() {
                var index,
                    msg,
                    len = HELL.UserList.length;
                msg = "<b style=\"color:#ffffff;\"><u>User list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.UserList[index].username + "\n(" + HELL.UserList[index].nick + ")\n";
                return msg;
            },
            UserBanList: function() {
                var index,
                    msg,
                    len = HELL.UserBanList.length;
                msg = "<b style=\"color:#ffffff;\"><u>User Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.UserBanList[index] + "\n";
                return msg;
            },
            NickBanList: function() {
                var index,
                    msg,
                    len = HELL.NickBanList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Nick Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.NickBanList[index] + "\n";
                return msg;
            },
            BanKeywordList: function() {
                var index,
                    msg,
                    len = HELL.BanKeywordList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Ban Keyword list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(HELL.BanKeywordList[index]) + "\n";
                return msg;
            },
            UserKickList: function() {
                var index,
                    msg,
                    len = HELL.UserKickList.length;
                msg = "<b style=\"color:#ffffff;\"><u>User Kick list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.UserKickList[index] + "\n";
                return msg;
            },
            NickKickList: function() {
                var index,
                    msg,
                    len = HELL.NickKickList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Nick Kick list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.NickKickList[index] + "\n";
                return msg;
            },
            KickKeywordList: function() {
                var index,
                    msg,
                    len = HELL.KickKeywordList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Kick Keyword list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(HELL.KickKeywordList[index]) + "\n";
                return msg;
            },
            BotOPList: function() {
                var index,
                    msg,
                    len = HELL.BotOPList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Bot OP list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.BotOPList[index] + "\n";
                return msg;
            },
            BotModList: function() {
                var index,
                    msg,
                    len = HELL.BotModList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Bot Mod list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.BotModList[index] + "\n";
                return msg;
            },
            MentionList: function() {
                var index,
                    msg,
                    len = HELL.MentionList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Mention list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(HELL.MentionList[index]) + "\n";
                return msg;
            },
            IgnoreList: function() {
                var index,
                    msg,
                    len = HELL.IgnoreList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Ignore list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.IgnoreList[index] + "\n";
                return msg;
            },
            HiddenCameraList: function() {
                var index,
                    msg,
                    len = HELL.IgnoreList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Ignore list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.IgnoreList[index] + "\n";
                return msg;
            },
            GreetList: function() {
                var index,
                    msg,
                    len = HELL.GreetList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Greet list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.GreetList[index] + "\n";
                return msg;
            },
            TTSList: function() {
                var index,
                    msg,
                    len = HELL.TTSList.length;
                msg = "<b style=\"color:#ffffff;\"><u>TTS list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.TTSList[index] + "\n";
                return msg;
            },
            HighlightList: function() {
                var index,
                    msg,
                    len = HELL.HighlightList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Highlight list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + " : " + HELL.HighlightList[index] + "\n";
                return msg;
            },
            ReminderList: function() {
                var index,
                    msg,
                    len = HELL.ReminderList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Reminder list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + ": [" + HELL.ReminderList[index][0] + "] " + HTMLtoTXT(HELL.ReminderList[index][1]) + "\n";
                return msg;
            },
            SafeList: function() {
                var index,
                    msg,
                    len = HELL.SafeList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Safe list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + ": " + HELL.SafeList[index] + "\n";
                return msg;
            },
            GreenRoomList: function() {
                var index,
                    msg,
                    len = HELL.GreenRoomList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Green Room list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + ": " + HELL.GreenRoomList[index] + "\n";
                return msg;
            },
            GreenRoomIgnoreList: function() {
                var index,
                    msg,
                    len = HELL.GreenRoomIgnoreList.length;
                msg = "<b style=\"color:#ffffff;\"><u>Green Room Ignore list:</u></b>\n" + ((!len) ? "empty\n" : "");
                for (index = 0; index < len; index++) msg += index + ": " + HELL.GreenRoomIgnoreList[index] + "\n";
                return msg;
            },
        };
        var MessageQueueList = {
            add: function() {
                HELL.SendQueue.push(arguments[0]);
                MessageQueueList.run();
            },
            run: function() {
                if (HELL.SendQueue !== undefined && HELL.SendQueue.length > 0) {
                    setTimeout(function() {
                        var temp = new Date();
                        var OffsetTime = temp - HELL.LastMessage;
                        if (OffsetTime >= 1500) {
                            HELL.LastMessage = new Date();
                            HELL.SocketTarget.send(HELL.SendQueue[0]);
                            HELL.SendQueue.shift();
                        }
                        MessageQueueList.run();
                    }, 1600, HELL.LastMessage);
                }
            }
        };
        var ServerSendList = {
            msg: function() {
                var obj = {
                    "tc": arguments[0]
                };
                if (arguments[2] !== undefined) {
                    obj.handle = arguments[1];
                    HELL.SocketTarget.send(JSON.stringify(obj));
                } else {
                    if (arguments[1] !== undefined) {
                        obj.text = arguments[1];
                        MessageQueueList.add(JSON.stringify(obj));
                    } else {
                        HELL.SocketTarget.send(JSON.stringify(obj));
                    }
                }
            },
            pvtmsg: function() {
                var obj = {
                    "tc": arguments[0],
                    "text": arguments[1],
                    "handle": Number(arguments[2])
                };
                MessageQueueList.add(JSON.stringify(obj));
            },
            kick: function() {
                CheckSafeList(arguments[1], true);
                ServerSendList.msg(arguments[0], arguments[1], "kick");
            },
            ban: function() {
                CheckSafeList(arguments[1], true);
                ServerSendList.msg(arguments[0], arguments[1], "ban");
            },
            nick: function() {
                var obj = {
                    "tc": "nick",
                    "nick": arguments[1]
                };
                HELL.SocketTarget.send(JSON.stringify(obj));
            },
            stream_moder_close: function() {
                CheckSafeList(arguments[1], true);
                ServerSendList.msg(arguments[0], arguments[1], "stream_moder_close");
            },
            stream_moder_allow: function() {
                ServerSendList.msg(arguments[0], arguments[1], "stream_moder_allow");
            }
        };
        var ServerInList = {
            joined: function() {
                Reset();
                HELL.Me = {
                    "handle": arguments[0].self.handle,
                    "username": (arguments[0].self.username === "") ? "GUEST" : arguments[0].self.username.toUpperCase(),
                    "nick": arguments[0].self.nick,
                    "owner": arguments[0].self.owner,
                    "mod": arguments[0].self.mod,
                    "namecolor": window.HELLNameColor[Rand(0, window.HELLNameColor.length - 1)],
                    "avatar": arguments[0].self.avatar
                };
                if (HELL.Me.nick.match(/^guest(?:\-[0-9]{1,10})?/i) && HELL.Me.username !== "GUEST") Send("nick", HELL.Me.username); //AUTO CORRECT NAME
                if (HELL.Me.mod && HELL.Bot && HELL.ScriptInit && HELL.SocketConnected) CheckHost();
                HELL.Room = {
                    "Avatar": arguments[0].room.avatar,
                    "Bio": arguments[0].room.biography,
                    "Name": arguments[0].room.name,
                    "PTT": arguments[0].room.pushtotalk,
                    "Website": arguments[0].room.website,
                    "Recent_Gifts": arguments[0].room.recent_gifts
                };
                HELL.SocketConnected = true;
            },
            userlist: function() {
                var len = arguments[0].users.length;
                for (var user = 0; user < len; user++) {
                    AKBS(arguments[0].users[user]);
                    var username = (arguments[0].users[user].username === "") ? "GUEST" : arguments[0].users[user].username.toUpperCase();
                    CheckUserAbuse(arguments[0].users[user].handle, username, arguments[0].users[user].nick);
                    HELL.UserList.push({
                        "handle": arguments[0].users[user].handle,
                        "username": username,
                        "nick": arguments[0].users[user].nick,
                        "owner": arguments[0].users[user].owner,
                        "mod": arguments[0].users[user].mod,
                        "namecolor": window.HELLNameColor[Rand(0, window.HELLNameColor.length - 1)],
                        "avatar": (arguments[0].users[user].avatar === "") ? "https://avatars.tinychat.com/standart/small/eyePink.png" : arguments[0].users[user].avatar,
                        "broadcasting": false,
                        "vote": 0,
                    });
                }
                RoomUsers();
                debug();
            },
            join: function() {
                AKBS(arguments[0]);
                var user = (arguments[0].username === "") ? "GUEST" : arguments[0].username.toUpperCase();
                CheckUserAbuse(arguments[0].handle, user, arguments[0].nick);
                if (HELL.HighlightList.includes(user) && HELL.enableSound === true && window.TinychatApp.getInstance().defaultChatroom.volume > 0) window.HELLSound.HIGHLIGHT.play();
     
                    if ((HELL.GreetList.includes(user) || (HELL.Host == HELL.Me.handle && HELL.GreetList.includes("-ALL"))) && HELL.NoGreet === false) {
                        Send("msg", (window.HELLWelcomes[Rand(0, window.HELLWelcomes.length - 1)] + arguments[0].nick.toUpperCase()) + ((HELL.GreetMode) ? ".\n" + (((user != "GUEST") ? "You are signed in as " + user : "you are not signed in") + ".\nwelcome to the room") : "."));
                        if (HELL.enableSound === true) window.HELLSound.GREET.play();
                    }
     
                HELL.NoGreet = false;
                AddUser(arguments[0].handle, arguments[0].mod, window.HELLNameColor[Rand(0, window.HELLNameColor.length - 1)], (arguments[0].avatar === "") ? "https://avatars.tinychat.com/standart/small/eyePink.png" : arguments[0].avatar, arguments[0].nick, user, ((user !== "GUEST") ? true : false), arguments[0].owner);
                RoomUsers();
                debug();
            },
            sysmsg: function() {
                if (HELL.Me.mod) {
                    var action = arguments[0].text.match(/^([a-z0-9_]{1,32}):? (closed|banned|kicked) ([a-z0-9_]{1,32})$/i);
                    if (action !== null) {
                        var user;
                        if (action[2] == "closed" || action[2] == "banned" || action[2] == "kicked") {
                            user = NicknameToUser(action[3].toUpperCase());
                            if (user != -1) {
                                if (HELL.UserList[user].username !== "GUEST") {
                                    var a = HELL.GreenRoomList.indexOf(HELL.UserList[user].username);
                                    if (a !== -1) {
                                        //REMOVE
                                        debug("GREENROOMLIST::", "REMOVE USER " + HELL.UserList[user].username + " FROM GREENROOMLIST");
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
            nick: function() {
                var user = HandleToUser(arguments[0].handle);
                if (user != -1) {
                    AddUserNotification(4, HELL.UserList[user].namecolor, HELL.UserList[user].nick, HELL.UserList[user].username, true, arguments[0].nick);
                    if ((HELL.GreetList.includes(HELL.UserList[user].username) || (HELL.Host == HELL.Me.handle && HELL.GreetList.includes("-ALL"))) && HELL.NoGreet === false) Send("msg", HELL.UserList[user].nick + "\naccount name " + HELL.UserList[user].username + " changed their nick to " + arguments[0].nick);
                    HELL.UserList[user].nick = arguments[0].nick;
                    if (HELL.Me.handle == arguments[0].handle) HELL.Me.nick = arguments[0].nick;
                    CheckUserAbuse(arguments[0].handle, HELL.UserList[user].username, arguments[0].nick);
                }
                debug();
            },
            stream_connected: function() {
                if (HELL.Host === HELL.Me.handle && HELL.GreenRoomToggle && arguments[0].publish == false && HELL.Me.handle !== arguments[0].handle && !HELL.Camera.List.includes(arguments[0].handle)) {
                    //USER IS NOT ON CAMERA START AUTO ACCEPT PROCESS
                    var user = HandleToUser(arguments[0].handle);
                    if (user != -1) {
                        debug("CAMERA::WAITING", "nickname:" + HELL.UserList[user].nick);
                        if (!HELL.GreenRoomIgnoreList.includes(HELL.UserList[user].username) && HELL.GreenRoomList.includes(HELL.UserList[user].username)) Send("stream_moder_allow", HELL.UserList[user].handle);
                    }
                }
                debug();
            },
            stream_closed: function() {
                debug();
            },
            publish: function() { //ADD GLOBAL CAMERA
                CheckUserStream(arguments[0].handle, true);
                debug();
            },
            unpublish: function() { //REMOVE GLOBAL CAMERA
                CheckUserStream(arguments[0].handle, false);
                debug();
            },
            ping: function() {
                if (HELL.ScriptInit) {
                    var verify;
                    if (HELL.WatchList.length > 0) {
                        verify = new Date() - HELL.WatchList[0][2];
                        debug("WATCHLIST::LIST", HELL.WatchList);
                        debug("WATCHLIST::VERIFYING", HELL.WatchList[0][0] + " " + verify + "/700000");
                        if (HELL.SafeList.indexOf(HELL.WatchList[0][0]) === -1) { //LET'S NOT ADD TWICE
                            if (verify > 700000) {
                                debug("WATCHLIST::VERIFIED", HELL.WatchList[0][0] + " " + verify + "/700000");
                                HELL.SafeList.push(HELL.WatchList[0][0]);
                                HELL.WatchList.shift();
                            }
                        } else {
                            HELL.WatchList.shift();
                        }
                    }
                    if (HELL.WaitToVoteList.length > 0) {
                        verify = new Date() - HELL.WaitToVoteList[0][1];
                        debug("VOTE::LIST", HELL.WaitToVoteList);
                        debug("VOTE::WAIT", HELL.WaitToVoteList[0][0] + " " + verify + "/300000");
                        if (verify > 300000) {
                            debug("VOTE::READY", HELL.WaitToVoteList[0][0] + " " + verify + "/300000");
                            HELL.WaitToVoteList.shift();
                        }
                    }
                }
                //DISPOSE OF ITEMS
                window.TinychatApp.getInstance().defaultChatroom._chatlog.items = [];
                window.TinychatApp.getInstance().defaultChatroom.packetWorker.queue = {};
                debug();
            },
            quit: function() {
                if (HELL.ScriptInit) {
                    if (HELL.WatchList.length > 0) {
                        var len = HELL.WatchList.length;
                        for (var i = 0; i < len; i++) {
                            if (HELL.WatchList[i][1] == arguments[0].handle) {
                                HELL.WatchList.splice(i, 1);
                                break;
                            }
                        }
                    }
                    if (HELL.Me.mod) RemoveUserCamera(arguments[0].handle);
                    var user = HandleToUser(arguments[0].handle);
                    if (user != -1) {
                        //SEND THEM OUT
                        AddUserNotification(2, HELL.UserList[user].namecolor, HELL.UserList[user].nick, HELL.UserList[user].username, true);
                        HELL.UserList.splice(user, 1);
                    }
                    RoomUsers();
                    if (HELL.Host == arguments[0].handle) {
                        HELL.Host = 0;
                        HELL.Camera.Sweep = false;
                        if (HELL.Me.mod && HELL.Bot) {
                            setTimeout(function() {
                                if (HELL.Host == 0) SetBot(false);
                            }, (Rand(10, 30) * 1000));
                        }
                    }
                }
                debug();
            },
            msg: function() {
                if (HELL.ScriptInit) {
                    var user = HandleToUser(arguments[0].handle);
                    if (user != -1) {
                        if (!LineSpam(arguments[0].text, HELL.UserList[user].mod)) {
                            if (GamePrevention(arguments[0].text, HELL.UserList[user].mod)) {
                                var text = HTMLtoTXT(arguments[0].text);
                                //ALL USERS REPORT
                                //OwnerCommand(user, arguments[0].text);
                                BotCheck(user, text, arguments[0]);
                                //MODERATORS
                                if (HELL.Me.mod) {
                                    if (HELL.Host == HELL.Me.handle) BotCommandCheck(user, text);
                                    CheckUserWordAbuse(user, arguments[0].text);
                                }
     
                                if (!CheckUserIgnore(user) && !CheckUserTempIgnore(user) && IgnoreText(text)) {
                                    //PUSH MESSAGE
                                    if (isSafeListed(HELL.UserList[user].username)) text = CheckImgur(text);
                                    HELL.Message[0].push({
                                        "time": Time(),
                                        "namecolor": HELL.UserList[user].namecolor,
                                        "avatar": HELL.UserList[user].avatar,
                                        "username": HELL.UserList[user].username,
                                        "nick": HELL.UserList[user].nick,
                                        "msg": text,
                                        "mention": false
                                    });
                                    var msg = HELL.Message[0][HELL.Message[0].length - 1];
                                    if (HELL.Me.handle !== arguments[0].handle) {
                                        if (HELL.UserList[user].mod && (text.match(/^!autokick$/i) || text.match(/^!autoban$/i))) {
                                            Alert(GetActiveChat(), "another user has initiated autokick/autoban.");
                                            HELL.AutoKick = false;
                                            HELL.AutoBan = false;
                                        }
                                        if (HELL.enableSound === true && window.TinychatApp.getInstance().defaultChatroom.volume > 0) {
                                            if (HELL.UserList.length <= 4) window.HELLSound.MSG.play();
                                            if (HELL.TTS.synth !== undefined && (HELL.TTSList.includes(HELL.UserList[user].username) || HELL.TTSList.includes("-ALL"))) TTS(HELL.UserList[user].nick + ((!text.match(/(?:^!)|(?:https?|www|\uD83C\uDFB5)/gim)) ? " said, " + text : ", lol uwot"));
                                        }
                                        var len = HELL.MentionList.length;
                                        for (var i = 0; i < len; i++) {
                                            if (text.toUpperCase().includes(HELL.MentionList[i])) {
                                                if (HELL.enableSound === true) window.HELLSound.MENTION.play();
                                                msg.mention = true;
                                                AddUserNotification(3, HELL.UserList[user].namecolor, HELL.UserList[user].nick, HELL.UserList[user].username, true);
                                            }
                                        }
                                    }
                                    if (GetActiveChat() === 0) CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, msg.mention, 0);
                                    MessagePopUp(user, text, true, false);
                                }
                            }
                        } else {
                            if (HELL.Host == HELL.Me.handle) {
                                Send("kick", arguments[0].handle);
                            } else if (HELL.Host == 0) {
                                //if (HELL.Me.mod) Send("kick", arguments[0].handle);
                            }
                        }
                    }
                }
                debug();
            },
            pvtmsg: function() {
                if (HELL.ScriptInit) {
                    if (HELL.enablePMs === true) {
                        if (arguments[0].handle != HELL.Me.handle) {
                            var user = HandleToUser(arguments[0].handle);
                            if (user != -1) {
                                if (!LineSpam(arguments[0].text, HELL.UserList[user].mod)) {
                                    if (GamePrevention(arguments[0].text, HELL.UserList[user].mod)) {
                                        var text = arguments[0].text;
                                        if (HELL.Me.mod) CheckUserWordAbuse(user, arguments[0].text);
                                        if (!CheckUserIgnore(user) && !CheckUserTempIgnore(user) && IgnoreText(text)) {
                                            if (!HELL.Message[arguments[0].handle]) HELL.Message[arguments[0].handle] = [];
                                            PushPM(arguments[0].handle, text, user);
                                            if (HELL.enableSound === true && window.TinychatApp.getInstance().defaultChatroom.volume > 0) {
                                                window.HELLSound.PVTMSG.play();
                                                if (HELL.TTS.synth !== undefined && (HELL.TTSList.includes(HELL.UserList[user].username) || HELL.TTSList.includes("-ALL"))) TTS(HELL.UserList[user].nick + ((!text.match(/(?:^!)|(?:https?|www)/gim)) ? " said, " + text : "lol, uwot"));
                                            }
                                            text = HTMLtoTXT(text);
                                            if (isSafeListed(HELL.UserList[user].username)) text = CheckImgur(text);
                                            MessagePopUp(user, text, false, false);
                                        }
                                    }
                                } else {
                                    //if (HELL.Me.mod) Send("kick", arguments[0].handle);
                                }
                            }
                        }
                    }
                }
                debug();
            },
            gift: function() {
                window.CreateGift(arguments[0]);
                debug();
            },
        };
        var ServerOutList = {
            pvtmsg: function() {
                if (HELL.ScriptInit) {
                    Command(arguments[0].text, true);
                    var text = arguments[0].text;
                    if (!HELL.Message[arguments[0].handle]) HELL.Message[arguments[0].handle] = [];
                    PushPM(arguments[0].handle, text);
                }
                debug();
            },
            msg: function() {
                if (HELL.ScriptInit) {
                    HELL.LastMessage = new Date();
                    Command(arguments[0].text, false);
                }
                debug();
            },
            ban: function() {
                CheckSafeList(arguments[0].handle, true);
                debug();
            },
            kick: function() {
                CheckSafeList(arguments[0].handle, true);
                debug();
            },
            stream_moder_close: function() {
                CheckSafeList(arguments[0].handle, true);
                debug();
            }
        };
        //ADDON
        var Addon = {
            active: function() {
                if (window.HELLAddon !== undefined) {
                    if (window.HELLAddon[arguments[0]] !== undefined) {
                        return true;
                    }
                }
                return false;
            },
            get: function() {
                return window.HELLAddon[arguments[0]];
            }
        };
        //XMLHttpRequest
        //Chuck Norris Jokes API (https://api.chucknorris.io/)
        HELL.Chuck.XHR.onload = function() {
            var resp = JSON.parse(HELL.Chuck.XHR.responseText),
                msg = "[CHUCK NORRIS]\n" + resp.value;
            if (resp !== null) Send("msg", msg.substr(0, 499));
        };
        //URB API (https://api.Urb.com/)
        HELL.Urb.XHR.onload = function() {
            var resp = JSON.parse(HELL.Urb.XHR.responseText),
                msg = "[URBAN DICTIONARY]\n" + ((resp.list[0] !== undefined) ? resp.list[0].word + "\n" + resp.list[0].definition : "Nothing was found!");
            if (resp !== null) Send("msg", msg.substr(0, 499));
        };
        //ICanHazDadJoke's API (https://icanhazdadjoke.com/)
        HELL.Dad.XHR.onload = function() {
            var resp = JSON.parse(HELL.Dad.XHR.responseText),
                msg = "[DAD JOKE]\n" + resp.joke;
            if (resp !== null) Send("msg", msg.substr(0, 499));
        };
        //AdviceSlip API (https://api.adviceslip.com/advice)
        HELL.Advice.XHR.onload = function() {
            var resp = JSON.parse(HELL.Advice.XHR.responseText),
                msg = "[ADVICE]\n" + resp.slip.advice;
            if (resp !== null) Send("msg", msg.substr(0, 499));
        };
        //Events API (https://api.github.com/)
        HELL.Events.XHR.onload = function() {
            var resp = JSON.parse(HELL.Events.XHR.responseText);
            if (resp !== null) {
                if (resp.files.HELLJson.content !== null) {
                    try {
                        var parse = JSON.parse(resp.files.HELLJson.content);
                        HELL.ServerEventList = parse.serverevent;
                    } catch (e) {
                        HELL.ServerEventList = [];
                    }
                    ServerEvent();
                }
            }
        };
     
     
        //MISC FUNCTION
        function SetLocalValues() {
            if (HELL.StorageSupport) {
                //HELL SETTINGS
                HELL.PublicCommandToggle = JSON.parse(Load("PublicCommandToggle", JSON.stringify(true)));
                HELL.OGStyle.SavedHeight = JSON.parse(Load("OGStyleHeight", JSON.stringify(3)));
                HELL.GreenRoomIgnoreList = JSON.parse(Load("GreenRoomIgnoreList", JSON.stringify([])));
                HELL.CameraBorderToggle = JSON.parse(Load("CameraBorderToggle", JSON.stringify(true)));
                HELL.OGStyle.SavedWidth = JSON.parse(Load("OGStyleWidth", JSON.stringify(1)));
                HELL.NotificationToggle = JSON.parse(Load("NotificationToggle", JSON.stringify(0)));
                HELL.ChatStyleCounter = JSON.parse(Load("ChatStyle", JSON.stringify(14)));
                HELL.SoundMeterToggle = JSON.parse(Load("SoundMeterToggle", JSON.stringify(true)));
                HELL.HiddenCameraList = JSON.parse(Load("HiddenCameraList", JSON.stringify([])));
                HELL.KickKeywordList = JSON.parse(Load("KickKeywordList", JSON.stringify([])));
                HELL.PerformanceMode = JSON.parse(Load("PerformanceMode", JSON.stringify(false)));
                HELL.TimeStampToggle = JSON.parse(Load("TimeStampToggle", JSON.stringify(true)));
                HELL.GreenRoomToggle = JSON.parse(Load("GreenRoomToggle", JSON.stringify(true)));
                HELL.BanKeywordList = JSON.parse(Load("BanKeywordList", JSON.stringify([])));
                HELL.FavoritedRooms = JSON.parse(Load("FavoritedRooms", JSON.stringify(["hell", null, null, null, null])));
                HELL.MainBackground = Load("MainBackground", "url(https://i.imgur.com/MB3vwHI.png) rgb(0, 0, 0) no-repeat");
                HELL.GreenRoomList = JSON.parse(Load("GreenRoomList", JSON.stringify([])));
                HELL.HighlightList = JSON.parse(Load("HighlightList", JSON.stringify([])));
                HELL.ReminderList = JSON.parse(Load("ReminderList", JSON.stringify([])));
                HELL.UserKickList = JSON.parse(Load("UserKickList", JSON.stringify([])));
                HELL.NickKickList = JSON.parse(Load("NickKickList", JSON.stringify([])));
                HELL.UserBanList = JSON.parse(Load("UserBanList", JSON.stringify([])));
                HELL.NickBanList = JSON.parse(Load("NickBanList", JSON.stringify([])));
                HELL.MentionList = JSON.parse(Load("MentionList", JSON.stringify([])));
                HELL.CanSeeGames = JSON.parse(Load("CanSeeGames", JSON.stringify(true)));
                HELL.ThemeChange = JSON.parse(Load("ThemeChange", JSON.stringify(true)));
                HELL.BotModList = JSON.parse(Load("BotModList", JSON.stringify([])));
                HELL.IgnoreList = JSON.parse(Load("IgnoreList", JSON.stringify([])));
                HELL.GreetList = JSON.parse(Load("GreetList", JSON.stringify([])));
                HELL.BotOPList = JSON.parse(Load("BotOPList", JSON.stringify(["-ALL"])));
                HELL.GreetMode = JSON.parse(Load("GreetMode", JSON.stringify(false)));
                HELL.FontSize = JSON.parse(Load("FontSize", JSON.stringify(20)));
                HELL.SafeList = JSON.parse(Load("AKB", JSON.stringify([])));
                HELL.Featured = JSON.parse(Load("Featured", JSON.stringify(true)));
                HELL.Reminder = JSON.parse(Load("Reminder", JSON.stringify(true)));
                HELL.TTSList = JSON.parse(Load("TTSList", JSON.stringify([])));
                HELL.UserYT = JSON.parse(Load("UserYT", JSON.stringify(true)));
                HELL.Popups = JSON.parse(Load("Popups", JSON.stringify(true)));
                HELL.Avatar = JSON.parse(Load("Avatar", JSON.stringify(true)));
                HELL.Imgur = JSON.parse(Load("Imgur", JSON.stringify(true)));
                HELL.Bot = JSON.parse(Load("Bot", JSON.stringify(false)));
                HELL.ToggleStackMessage = JSON.parse(Load("ToggleStackMessage", JSON.stringify(false)));
                HELL.MediaStreamFilter = Load("MediaStreamFilter", "No Filter");
            }
        }
     
        function debug() {
            if (window.DebugClear === false) {
                if (arguments[0] !== undefined) {
                    var msg = "HELL::" + arguments[0];
                    if (arguments[1]) msg = msg + "\n" + JSON.stringify(arguments[1]);
                    console.log(msg);
                }
            } else {
                //console.clear();
                console.log("function debug() - window.debugclear flagged true");
            }
        }
     
        function Reset() {
            HELL.UserList = [];
            HELL.Me = [];
            HELL.Room = [];
            HELL.SendQueue = [];
            HELL.Camera.List = [];
            HELL.Camera.List = [];
            HELL.WaitToVoteList = [];
            HELL.WatchList = [];
            HELL.Host = 0;
            HELL.HostAttempt = 0;
            HELL.HostWaiting = false;
            HELL.TempIgnoreUserList = [];
            HELL.TempIgnoreNickList = [];
        }
     
        function Remove() {
            return (arguments[1] !== undefined) ? arguments[0].querySelector(arguments[1]).parentNode.removeChild(arguments[0].querySelector(arguments[1])) : arguments[0].parentNode.removeChild(arguments[0]);
        }
    })();