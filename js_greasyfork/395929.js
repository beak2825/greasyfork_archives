// ==UserScript==
// @name        TCplus 
// @version     0.99.1
// @description Tinychat Enhancement for CelebrityStatus https://tinychat.com/celebritystatus 
//              based on but not affiliated with Tinychat Enhancement Suite (TES) by 
//              the user MutationObserver at greasyfork.org. 
// @author      Midkniht
// @url         https://www.celebritystatus.vip/
// @license     Copyright (C) 2020 Free Software Foundation GNU GPL version 2
// 
//              This program is free software: you can redistribute it and/or modify
//              it under the terms of the GNU General Public License as published by
//              the Free Software Foundation, either version 2 of the License, or
//              (at your option) any later version.
//
//              This program is distributed in the hope that it will be useful,
//              but WITHOUT ANY WARRANTY; without even the implied warranty of
//              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//              GNU General Public License for more details.
//
//              You should have received a copy of the GNU General Public License
//              along with this program.  If not, see <https://www.gnu.org/licenses/>
//
// @icon        https://tinychat.com/webrtc/2.0.0-81/images/favicon.png
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts0
// @grant       none
// @run-at      document-start
//              jshint esversion: 6
// @namespace https://greasyfork.org/users/440291
// @downloadURL https://update.greasyfork.org/scripts/395929/TCplus.user.js
// @updateURL https://update.greasyfork.org/scripts/395929/TCplus.meta.js
// ==/UserScript==
(function() {
    "use strict";
    //TCplus
    var TCplus = {
            DebugClear: false,
            Version: "0.99.1",
            Me: [],
            Room: "",
            ScriptInit: false,
            Storage: "TCplus_",
            MainBackground: undefined,
            MainBackgroundColorCounter: 0,
            FontSize: 20,
            ChatStyleCounter: 0,
            ChatHeight: 30,
            ChatWidth: 0,
            ChatDisplay: true,
            UserListDisplay: true,
            ChatStyles: 10,
            NameColors: 22,
            MainBackgroundCounter: 0,
            ChatCSS: [],
            ChatLimit: 1000,
            NotificationLimit: 150,
            ChatScroll: true,
            NotificationScroll: true,
            NoGreet: false,
            Featured: true,
            Bot: true,
            AutoKick: false,
            AutoBan: false,
            GreetMode: false,
            CanTTS: false,
            Popups: true,
            Avatar: true,
            Reminder: true,
            imgur: true,
            Notification: true,
            UserYT: true,
            AutoMicrophone: false,
            Radio: {station: [["Mashrup Reggae Radio", "https://edge1-b.exa.live365.net/a00564"]]},
            EightBall: ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As  I see it, yes.", "Most Likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."],
            TTS: {synth: undefined,voices: undefined},
            Host: 0,
            HostAttempt: 0,
            HostWaiting: false,
            YouTube: {XHR: new XMLHttpRequest(),Playing: false,QueueList: [],NotPlayable: ["Private video", "Deleted video"],VideoID: undefined,Busy: false,DataReady: false,Clear: false,VideoReturn: false,SearchReturn: false,ListBuilt: true,PlayListCount: undefined,ShowQueue: false,CurrentTrack: {ID: undefined,duration: undefined,title: undefined,thumbnail: undefined},},
            UserList: [],
            MentionList: [],
            IgnoreList: [],
            BanList: [],
            KickList: [],
            BotOPList: [],
            TTSList: [],
            BanKeywordList: [],
            KickKeywordList: [],
            HighlightList: [],
            GreetList: [],
            ReminderList: [],
            ReminderSetList: [],
            Favorited: [],
            SafeList: [],
            WatchList: [],
            MessageCallback: [],
            Message: [[]],
            LastMessage: new Date(),
            SendQueue: [],
            MissedMsg: 0,
            ActiveMessage: 0,
            NotificationTimeOut: [],
            Sound: {highlight: new Audio("https://media.vocaroo.com/mp3/mjS6tza4Tu4"), mention: new Audio("https://media.vocaroo.com/mp3/gsrjQNCdhlX"), MSG: new Audio("https://tinychat.com/webrtc/2.0.20-420/sound/pop.mp3"), PVTMSG: new Audio("https://tinychat.com/webrtc/2.0.20-420/sound/pop.mp3")},
            Welcomes: ["Hey ", "What's crackin ", "Hello ", "Good to see you ", "Howdy ", "Hey there ", "Yo ", "What's up ", "Greetings ", "What's hangin' "]
        },
        MainElement, ChatLogElement, VideoListElement, SideMenuElement, TitleElement, UserListElement, ModerationListElement, ChatListElement, UserContextElement, MicrophoneElement;
    window.RADIO_STATIONS = TCplus.Radio.station;
    //TCplus SETTINGS
    TCplus.ChatStyleCounter = JSON.parse(Load("ChatStyle", 0));
    TCplus.KickKeywordList = JSON.parse(Load("KickKeywordList", JSON.stringify([])));
    TCplus.BanKeywordList = JSON.parse(Load("BanKeywordList", JSON.stringify([])));
    TCplus.MainBackground = Load("MainBackground", "url(https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_flag.svg/1200px-Black_flag.svg.png)");
    TCplus.HighlightList = JSON.parse(Load("HighlightList", JSON.stringify([])));
    TCplus.ReminderList = JSON.parse(Load("ReminderList", JSON.stringify([])));
    TCplus.Notification = JSON.parse(Load("Notification", JSON.stringify(true)));
    TCplus.MentionList = JSON.parse(Load("MentionList", JSON.stringify([])));
    TCplus.IgnoreList = JSON.parse(Load("IgnoreList", JSON.stringify([])));
    TCplus.Favorited = JSON.parse(Load("Favorited", JSON.stringify([
        ["celebritystatus", "https://avatars.tinychat.com/87/35e46e/31/medium/phpIQLHqQ.png"], null, null, null, null
    ])));
    TCplus.GreetList = JSON.parse(Load("GreetList", JSON.stringify([])));
    TCplus.BotOPList = JSON.parse(Load("BotOPList", JSON.stringify(["-ALL"])));
    TCplus.GreetMode = JSON.parse(Load("GreetMode", JSON.stringify(false)));
    TCplus.FontSize = JSON.parse(Load("FontSize", 20));
    TCplus.SafeList = JSON.parse(Load("SafeList", JSON.stringify([])));
    TCplus.KickList = JSON.parse(Load("KickList", JSON.stringify([])));
    TCplus.Reminder = JSON.parse(Load("Reminder", JSON.stringify(true)));
    TCplus.TTSList = JSON.parse(Load("TTSList", JSON.stringify([])));
    TCplus.BanList = JSON.parse(Load("BanList", JSON.stringify([])));
    TCplus.UserYT = JSON.parse(Load("UserYT", JSON.stringify(true)));
    TCplus.Popups = JSON.parse(Load("Popups", JSON.stringify(true)));
    TCplus.Avatar = JSON.parse(Load("Avatar", JSON.stringify(true)));
    TCplus.imgur = JSON.parse(Load("imgur", JSON.stringify(true)));
    TCplus.Bot = JSON.parse(Load("Bot", JSON.stringify(true)));
    //ROOM CSS
    var NameColor = ["#3f69c0", "#b63fc0", "#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#26a635", "#00b34d", "#e6c700", "#FF851B", "#FF4136", "#c81e70", "#f00fbb", "#B10DC9", "#111111", "#AAAAAA", "#cc6600", "#009933", "#003366", "#660033", "#804000"];
    var Colors = ["#CD5C5C", "#F08080", "#FA8072", "#E9967A", "#DC143C", "#FF0000", "#B22222", "#8B0000", "#000000", "#FFFFFF", "#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093", "#000000", "#FFFFFF", "#FFA07A", "#FF7F50", "#FF6347", "#FF4500", "#FF8C00", "#FFA500", "#000000", "#FFFFFF", "#FFD700", "#FFFF00", "#FFFFE0", "#FFFACD", "#FAFAD2", "#FFEFD5", "#FFE4B5", "#FFDAB9", "#EEE8AA", "#F0E68C", "#BDB76B", "#000000", "#FFFFFF", "#E6E6FA", "#D8BFD8", "#DDA0DD", "#EE82EE", "#DA70D6", "#FF00FF", "#BA55D3", "#9370DB", "#9966CC", "#8A2BE2", "#9400D3", "#9932CC", "#8B008B", "#800080", "#4B0082", "#6A5ACD", "#483D8B", "#7B68EE", "#000000", "#FFFFFF", "#ADFF2F", "#7FFF00", "#7CFC00", "#00FF00", "#32CD32", "#98FB98", "#90EE90", "#00FA9A", "#00FF7F", "#3CB371", "#2E8B57", "#228B22", "#008000", "#006400", "#9ACD32", "#6B8E23", "#808000", "#556B2F", "#66CDAA", "#8FBC8F", "#20B2AA", "#008B8B", "#008080", "#000000", "#FFFFFF", "#00FFFF", "#E0FFFF", "#AFEEEE", "#7FFFD4", "#40E0D0", "#48D1CC", "#00CED1", "#5F9EA0", "#4682B4", "#B0C4DE", "#B0E0E6", "#ADD8E6", "#87CEEB", "#87CEFA", "#00BFFF", "#1E90FF", "#6495ED", "#4169E1", "#0000FF", "#0000CD", "#00008B", "#000080", "#191970", "#000000", "#FFFFFF", "#FFF8DC", "#FFEBCD", "#FFE4C4", "#FFDEAD", "#F5DEB3", "#DEB887", "#D2B48C", "#BC8F8F", "#F4A460", "#DAA520", "#B8860B", "#CD853F", "#D2691E", "#8B4513", "#A0522D", "#A52A2A", "#800000", "#000000", "#FFFFFF", "#FFFFFF", "#FFFAFA", "#F0FFF0", "#F5FFFA", "#F0FFFF", "#F0F8FF", "#F8F8FF", "#F5F5F5", "#FFF5EE", "#F5F5DC", "#FDF5E6", "#FFFAF0", "#FFFFF0", "#FAEBD7", "#FAF0E6", "#FFF0F5", "#FFE4E1", "#000000", "#FFFFFF", "#DCDCDC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#000000", "#FFFFFF"];
    var Images = ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_flag.svg/1200px-Black_flag.svg.png", 
    ];
    var FeaturedCSS = "#videos.column>.videos-items{background:#0000003b;height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{background:#0000003b;width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
    var VideoCSS = "#videolist.full-screen, #videolist.full-screen > #videos-header, #videolist.full-screen .videos-header-volume:before {background:unset;}.tcplusdrop{position:fixed;display:inline-block;top:4px;right:4px;z-index:2;min-width: 46px;}.tcplusdrop-content{position:absolute;top:28px;right:0px;background-color:#181d1e;min-width:46px;padding:0px;z-index:1;display:none;}.tcplusdrop:hover .tcplusdrop-content{display:block;}.tcplusoptions:hover{background:#53b6ef}.tcplusoptions{width:100%;height:28px;line-height:16px;z-index: 2;cursor: pointer;top: 4px;background-color: #0000008f;border: none;color: white;padding: 4px 8px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer-broadcast-wrapper>.video{position: fixed;display: none;width: 5%;top: 0;left: 0}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:hover{background-color: #1f2223!important}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button{background-color: #2d373a!important}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #181d1e;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: 21px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #53b6ef;cursor: pointer;}#videos-footer #music-radio{left: 0px}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer{top: calc(30% + 119px);display:block;padding: 0 0 0 20px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute}#videos-footer-broadcast{border-radius: 0;z-index: 1;padding: unset!important;white-space: pre}#videos-footer-broadcast-wrapper{z-index: 1;visibility: visible;height: 50px;min-height: 50px;width: 400px;padding: unset;right: 0px;left: unset;position: fixed;top: calc(30% + 34px)}span[title=\"Settings\"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0px;left: 0px;right: 0px;top: 0px}:host,#videolist{background:unset;}.video:after{content: unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header{background:#181d1e;transition: none;left: unset;right: 0px;width: 400px;top: calc(30%);position: fixed;max-height: 34px;min-height: 34px;}#videos-header>span{line-height: unset;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}";
    var SideMenuCSS = "#sidemenu-wider{display:none;}#sidemenu-content::-webkit-scrollbar{width:0px;background:transparent;}#sidemenu{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:300 20px sans-serif;left:unset!important;right:0px!important;padding-bottom:0px;height:30%!important;min-width:400px!important;max-width:400px!important;}#sidemenu-content{scrollbar-width:none;padding-top:unset;min-height:calc(100% - 50px)!important;max-height:calc(100% - 50px)!important;}";
    var MainCSS = "body{background:" + TCplus.MainBackground + " no-repeat center;background-size:cover;overflow:hidden;}#content{width:calc(100% - 400px);padding:0!important;}#nav-static-wrapper, #nav-fixed-wrapper{display:none;}";
    var RoomCSS = "tc-title{display:flex!important;}#room{padding:0px!important;}#room-content{background:unset!important;}";
    var TitleCSS = "#room-header{border:unset;z-index:1;min-height:36px!important;max-height:36px!important;min-width:400px!important;max-width:400px!important;top:calc(30% + 84px);right:0px;position:fixed;background: linear-gradient(0deg,rgb(19, 73, 104)0%,rgba(9, 27, 29, 0.94)50%,rgb(43, 109, 141)100%);}#room-header-info>h1{text-transform:uppercase;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:600 20px sans-serif;color:#FFFFFF;}#room-header-info>h1:after{content:unset;}#room-header-info{padding:7px 0 0 6px;}#room-header-info>span{right: 8px;position: absolute;top:7px;margin-top:0px!important;}";
    var ContextMenuCSS = ".context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background-color:#20262870;position:unset;padding:0px;}";
    var ModeratorCSS = ".video{min-width: 114px;max-width: 114px;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#53b6ef;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background-color: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{max-height:60px;}#moderatorlist>#header{height:60px;font-size:16px;font-weight:600;font-family:sans-serif;color:#FFFFFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}#moderatorlist.show[data-videos-count=\"1\"], #moderatorlist.show[data-videos-count=\"2\"] {max-height:205px;}#moderatorlist.show[data-videos-count=\"3\"], #moderatorlist.show[data-videos-count=\"4\"] {max-height:290px;}#moderatorlist.show[data-videos-count=\"5\"], #moderatorlist.show[data-videos-count=\"6\"] {max-height:400px;}#moderatorlist.show[data-videos-count=\"7\"], #moderatorlist.show[data-videos-count=\"8\"] {max-height:460px;}#moderatorlist.show[data-videos-count=\"9\"], #moderatorlist.show[data-videos-count=\"10\"] {max-height:545px;}#moderatorlist.show[data-videos-count=\"11\"], #moderatorlist.show[data-videos-count=\"12\"] {max-height:630px;}";
    var UserListCSS = ".list-item>span>span[data-cam=\"1\"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator=\"1\"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background-color:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:4px;}.list-item>span>img{top:6px;}#button-banlist{color:#53b6ef;transition:none;top:calc(30% + 89px);right:3px;position:fixed;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}#contextmenu {top:calc(100% - 45px)!important;right:5px!important;left:5px!important;}";
    var ChatListCSS = ".list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background-color:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#53b6ef;}.list-item>span[data-status=\"gold\"]:before,.list-item>span[data-status=\"extreme\"]:before,.list-item>span[data-status=\"pro\"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background-color:#53b6ef;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}";
    var NotificationCSS = ".PMTime{display:inline-block;padding:0 6px 0 0;margin:0px 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0px 0px;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0px;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0px 0px 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
    var ChatboxCSS = "#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #181d1e94;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);padding: 6px;box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;}#user-menu {position: absolute;display: none;bottom: 50px;right: 0;border: 1px solid rgba(0, 0, 0, .06);box-sizing: border-box;border-radius: 3px;color: #FFFFFF;background-color: #181d1e;line-height: 1;box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .09);z-index: 1;}#user-menu > span {display: inline-block;width: 100%;padding: 12px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background-color:unset;}.tcplus-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.tcplustime{-webkit-box-shadow: 0 0 6px #53b6ef;-moz-box-shadow: 0 0 6px #53b6ef;box-shadow: 0 0 6px #53b6ef;position:absolute;right:3px;top:3px;background: #181d1e;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#tcplus-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{color:#FFFFFF;text-decoration:underline;}#chat{will-change: transform;}#tcplus-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#tcplus-chat-content>.message{padding:3px 3px;background:#1316177d;position:relative;left:0;margin-bottom:3px;border-radius:6px}#tcplus-chat-content>.message.highlight,.message.common.highlight{background:#3b7494;-webkit-box-shadow: 0 0 20px #ffffff;-moz-box-shadow: 0 0 20px #ffffff;box-shadow: inset 0 0 20px 0px #ffffff;}#tcplus-chat-content>.message.common{padding:3px 3px 3px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#tcplus-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1)}#chat-instant>.avatar>div,#tcplus-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}#notification-content{will-change: transform;top:0;position:relative;scrollbar-width:none;background:#181d1e;border-radius:12px 12px 0 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;min-height:80px;max-height:80px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#tcplus-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#tcplus-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-position>#chat-instant>a{display:none;}#chat-instant{padding-left:50px;background-color:transparent!important;}#chat-instant::after{background:none;}.on-white-scroll{scrollbar-width: none;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#tcplus-chat-content>.message>.nickname{-webkit-box-shadow: 0 0 6px #ffffff;-moz-box-shadow: 0 0 6px #ffffff;box-shadow: 0 0 6px #ffffff;border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background-color:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background-color:#181d1e;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" + (TCplus.FontSize - 4) + "px;font-family:sans-serif;font-weight:300;}#chat-wrapper{border:none;transition:none;bottom:0;right:0!important;max-height:calc(70% - 119px)!important;min-height:calc(70% - 119px)!important;position:fixed!important;min-width:400px;max-width:400px;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
    //CHATSTYLES
    for (var i = 0; i <= TCplus.ChatStyles; i++) TCplus.ChatCSS[i] = [];
    TCplus.ChatCSS[0].push("#chat-wrapper{background:linear-gradient(0deg,rgba(32,38,40,0.59)0%,rgba(16,14,14,0.76)calc(100% - 62px),rgba(45,55,58,0.72)100%);}");
    TCplus.ChatCSS[0].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}");
    TCplus.ChatCSS[0].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}");
    TCplus.ChatCSS[1].push("#chat-wrapper{background:linear-gradient(0deg,rgb(255,255,255)0%,rgba(99,99,99)calc(100% - 62px),rgba(255,255,255)100%);}");
    TCplus.ChatCSS[1].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}");
    TCplus.ChatCSS[1].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(25,25,25)8px,rgb(76,76,76)100%);}");
    TCplus.ChatCSS[2].push("#chat-wrapper{background:linear-gradient(0deg,rgb(121,24,188)0%,rgb(36,15,45)calc(100% - 62px),rgb(121,24,188)100%)}");
    TCplus.ChatCSS[2].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#7918bc;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#7918bc!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#460b6f!important;}#videos-footer-push-to-talk{background:#7918bc}#videos-footer-push-to-talk:hover{background:#460b6f}#videos-footer-broadcast:hover{background:#460b6f}#videos-footer-broadcast{background:#7918bc;}");
    TCplus.ChatCSS[2].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13,5,15)8px,rgb(121,24,188)100%);}");
    TCplus.ChatCSS[3].push("#chat-wrapper{background:linear-gradient(0deg,rgb(248,5,5)0%,rgb(81,22,22)calc(100% - 62px),rgba(204,0,0)100%);}");
    TCplus.ChatCSS[3].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#c10101;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#c10101!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#6b0f0f!important;}#videos-footer-push-to-talk{background:#c10101}#videos-footer-push-to-talk:hover{background:#6b0f0f}#videos-footer-broadcast:hover{background:#6b0f0f}#videos-footer-broadcast{background:#c10101;}");
    TCplus.ChatCSS[3].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(15,5,5)8px,rgb(193,1,1)100%);}");
    TCplus.ChatCSS[4].push("#chat-wrapper{background:linear-gradient(0deg,rgb(65,144,219)0%,rgb(7,69,97)calc(100% - 62px),rgb(37,179,222)100%);}");
    TCplus.ChatCSS[4].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}");
    TCplus.ChatCSS[4].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,14,15)8px,rgb(83,182,239)100%);}");
    TCplus.ChatCSS[5].push("#chat-wrapper{background:linear-gradient(0deg,rgb(225,0,211)0%,rgb(44,15,45)calc(100% - 62px),rgb(208,0,176)100%);}");
    TCplus.ChatCSS[5].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#bc01a0;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#bc01a0!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#5a004d!important;}#videos-footer-push-to-talk{background:#bc01a0}#videos-footer-push-to-talk:hover{background:#5a004d}#videos-footer-broadcast:hover{background:#5a004d}#videos-footer-broadcast{background:#bc01a0;}");
    TCplus.ChatCSS[5].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(15,5,14)8px,rgb(188,1,160)100%);}");
    TCplus.ChatCSS[6].push("#chat-wrapper{background:linear-gradient(0deg,rgb(0,158,5)0%,rgb(5,15,5)calc(100% - 62px),rgb(13,181,0)100%);}");
    TCplus.ChatCSS[6].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}");
    TCplus.ChatCSS[6].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,15,5)8px,rgb(14,104,7)100%);}");
    TCplus.ChatCSS[7].push("#chat-wrapper{background:linear-gradient(0deg,rgba(0, 0, 0, 0.69)0%,rgba(0, 0, 0, 0.56)calc(100% - 62px),rgb(13, 179, 0)100%);}");
    TCplus.ChatCSS[7].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}");
    TCplus.ChatCSS[7].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(5, 15, 5, 0.72)8px,rgba(0, 0, 0, 0.42)100%);}");
    TCplus.ChatCSS[8].push("#chat-wrapper{background: linear-gradient(0deg,rgb(255, 255, 255)0%,rgba(255, 255, 255, 0.82)calc(100% - 62px),rgb(255, 255, 255)100%);}");
    TCplus.ChatCSS[8].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}");
    TCplus.ChatCSS[8].push("#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(255, 255, 255, 0.72)8px,rgba(255, 255, 255, 0.81)100%);}");
    TCplus.ChatCSS[9].push("#chat-wrapper{background: linear-gradient(0deg,rgba(255, 255, 0, 1)0%,rgba(255, 255, 0, 0.82)calc(100% - 62px),rgba(255, 255, 0, 1)100%);}");
    TCplus.ChatCSS[9].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}");
    TCplus.ChatCSS[9].push("#sidemenu{background: linear-gradient(0deg,rgb(56, 50, 6)0%,rgb(149, 158, 22)8px,rgba(255, 255, 0, 1)100%);}");
    TCplus.ChatCSS[10].push("#chat-wrapper{background: linear-gradient(0deg,rgba(255, 125, 0, 1)0%,rgba(255, 125, 0, 0.82)calc(100% - 62px),rgba(255, 125, 0, 1)100%);}");
    TCplus.ChatCSS[10].push("#videos-footer-broadcast-wrapper>.waiting{background-color:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}");
    TCplus.ChatCSS[10].push("#sidemenu{background: linear-gradient(0deg,rgb(154, 51, 1)0%,rgba(255, 125, 0, 1)8px,rgba(255, 125, 0, 1)100%);}");
    tcplusInit();

    function tcplusInit() {
        //INITIATE TCplus
        TCplus.ScriptLoading = setInterval(function() {
            if (document.querySelector("tinychat-webrtc-app")) {
                if (document.querySelector("tinychat-webrtc-app").shadowRoot) {
                    tcplusRoomInject();
                }
                debug("TINYCHAT::LOAD", "ROOM");
            } else if (document.querySelector("#welcome-wrapper")) {
                tcplusHomeInject();
                debug("TinyChat::LOAD", "HOME");
            }
        }, 100);
        //WEBSOCKET HOOK
        if (!document.URL.match(/^https:\/\/tinychat.com\/#/)) {
            new MutationObserver(function() {
                this.disconnect();
                tcplusWebSocket();
            }).observe(document, {
                subtree: true,
                childList: true
            });
        }
        //FULLY LOADED -> RUNALL
        TCplus.FullLoad = setInterval(function() {
            if (TCplus.ScriptInit === true && TCplus.SocketConnected === true) {
                clearInterval(TCplus.FullLoad);
                Settings("<center><u>" + TCplus.Room.Name.toUpperCase() + "</u>" + (TCplus.Room.Avatar ? '\n<img src="' + TCplus.Room.Avatar + '">' : "") + "\n" + TCplus.Room.Bio + '\n<a href="' + TCplus.Room.Website + '" target="_blank">' + TCplus.Room.Website + "</a>\n\n</center>");
                AddUserNotification(2, TCplus.Me.namecolor, TCplus.Me.nick, TCplus.Me.username, false);
                if (TCplus.Room.PTT === true) {
                    VideoListElement.querySelector("#videos-footer-push-to-talk").addEventListener("mouseup", function(e) {
                        if (e.which == 1) TCplus.AutoMicrophone = false;
                        if (e.which == 1 && e.ctrlKey === true) TCplus.AutoMicrophone = !TCplus.AutoMicrophone;
                        if (e.which == 2) TCplus.AutoMicrophone = !TCplus.AutoMicrophone;
                    }, {
                        passive: true
                    });
                }
                var favorited_rooms = "",
                    len = TCplus.Favorited.length,
                    script = document.createElement("script"),
                    elem = document.getElementsByTagName("script")[0];
                script.text = 'function AddFavorite(obj, index) {\n var val = JSON.parse(localStorage.getItem("' + TCplus.Storage + 'Favorited"));\n val[index]=["' + TCplus.Room.Name + '","' + TCplus.Room.Avatar + '"];\n localStorage.setItem("' + TCplus.Storage + 'Favorited", JSON.stringify(val));\n obj.href ="https://tinychat.com/room/' + TCplus.Room.Name + '";\n obj.innerText = "' + TCplus.Room.Name + '";\n obj.onclick = null;\n return false;\n}';
                elem.parentNode.insertBefore(script, elem);
                for (var i = 0; i < len; i++) favorited_rooms += TCplus.Favorited[i] !== null ? "#" + (i + 1) + '<a href="https://tinychat.com/room/' + TCplus.Favorited[i][0] + '">' + TCplus.Favorited[i][0] + "</a>" : "#" + (i + 1) + '<a href="#" onclick="return AddFavorite(this,' + i + ');">ADD ROOM</a>';
                ChatLogElement.querySelector("#input").insertAdjacentHTML("afterbegin", '<div id="header-user"><label id="label-user" for="input-user"><img class="switcher" src="' + (TCplus.Me.avatar ? TCplus.Me.avatar : "https://i.imgur.com/4Q4Lgzf.png") + '"></label><input type="checkbox" id="input-user" hidden=""><div id="user-menu"><span id="nickname">FAVORITED ROOMS</span>' + favorited_rooms + '<span id="nickname">' + TCplus.Me.username.toUpperCase() + '</span><a href="https://tinychat.com/settings/gifts"> My Gifts</a><a href="https://tinychat.com/settings/profile">Profile</a><a href="https://tinychat.com/room/' + TCplus.Me.username + '">My Room</a><a href="https://tinychat.com/#">Directory</a></div></div>');
            }
        }, 25);
    }

    function tcplusHomeInject() {
        var HomeCSS = '.tile-header > img {transition:unset;}.tile-favroom-opt{cursor:pointer;position: absolute;right: 0;top: 0px;padding: 12px;background:#181d1e94;}.tile-favroom-opt:hover{background:#ff00008c;}#content{padding-bottom:unset;}.tile-content{height:180px;}.tcplus-footer-contents .tile-info{height:20px}.tcplus-footer-contents .tile-header>img{cursor:pointer;height: 220px;}.tile-header>img{height: 230px;width: 100%;max-width: 100%;}.tcplus-footer:hover .tcplus-footer-contents .tile{font-size: 18px;font-weight: 800;width:20%;display:inline-block;}.tcplus-footer-contents .tile {background: #00a2ff;text-align: center;border:unset;height:unset;display:none;margin: unset;}.tcplus-footer {background:#181d1e94;width: 100%;position: fixed;bottom: 0;left: 0;}#catalog > div {display: inline-block;padding: 5px;box-sizing: border-box;}.tile[data-status="pro"], .tile[data-status="extreme"], .tile[data-status="gold"] {margin-top: 12px;}.tile-header {border-radius: 12px 12px 0 0;}#promoted .tile-header > img{width:100%;}#navigation > label{border-radius:12px;}#welcome>div{padding-top:0px}.tile-statistic{padding-top:0;padding-bottom:4px;background: #000000a6;}.tile-name{padding-top:unset;}#promote-button{border-radius: 12px 12px 0 0;}tile-name{padding-top:unset;}.tile-info{bottom:unset;top:0;height:28px;}.tcplus-footer > h2, #promoted-wrapper > h2, #trended-wrapper > h2, #header-for-all{text-align: center;font-size: 30px;font-weight: 800;}body{background:' + TCplus.MainBackground + ' no-repeat center;background-size:cover;background-attachment: fixed;}.tile-content-info-icon > img {display:none;}.tile-content-info{font-size: 14px;font-weight: 600;}#promoted .tile-content-info-text{word-break: break-word;max-height:95px;}.tile{border:2px solid #fff;margin-top: 13px;height:425px;}#loadmore-no-more {background-color:#181d1e;}.tile-content > img{display:none;}#welcome-wrapper{background: #181d1e94;border-bottom:unset;}#loadmore{background-color: #00a2ff;font-weight: 600;}#user-menu{background: #181d1e;}#nav-static-wrapper {-webkit-box-shadow: 0 0 20px 17px #53b6ef;-moz-box-shadow: 0 0 20px 17px #53b6ef;box-shadow: 0 0 20px 17px #53b6ef;background:#181d1e;}#up-button:hover > #up-button-content {background-color: #181d1e59;}#nav-fixed{border-bottom:unset;}#nav-fixed-wrapper{-webkit-box-shadow: 0 0 20px 17px #53b6ef;-moz-box-shadow: 0 0 20px 17px #53b6ef;box-shadow: 0 0 20px 17px #53b6ef;background: #181d1e;}#nav-static {border-bottom:unset;}#welcome{padding:12px 30px 24px;}.tile{border-radius: 12px;background-color: #181d1eb3;}div, span, a, h1, h2, h3, h4, h5, h6, p {text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color: #FFFFFF!important;}#promoted-wrapper > div, #trended-wrapper > div {background: #00a2ff;border-radius: 12px;}.tile-content-info-text {word-break: break-word;width:100%;}.tile-content-info.with-icon {display: contents;}#navigation > label:not([for="input-catalog-navigation"]) {font-weight:600;background: #000000;}';
        //INSERT HTML/CSS
        document.body.querySelector("style").insertAdjacentHTML("beforeend", HomeCSS);
        document.body.insertAdjacentHTML("beforeend", '<div class="tcplus-footer"><h2>FAVORITED ROOMS</h2><div class="tcplus-footer-contents"></div></div>');
        //INSERT SCRIPT
        var script = document.createElement("script"),
            elem = document.getElementsByTagName("script")[0];
        script.text = 'function RemoveFavorite(obj, index) {\n	var val = JSON.parse(localStorage.getItem("' + TCplus.Storage + 'Favorited"));\n	val[index]=null;\n	localStorage.setItem("' + TCplus.Storage + 'Favorited", JSON.stringify(val));\n	return obj.parentNode.parentNode.remove();\n}';
        elem.parentNode.insertBefore(script, elem);
        var len = TCplus.Favorited.length;
        for (var i = 0; i < len; i++) document.body.querySelector(".tcplus-footer-contents").insertAdjacentHTML("beforeend", TCplus.Favorited[i] !== null ? '<div class="tile" data-room-name="' + TCplus.Favorited[i][0] + '">Favorite #' + (i + 1) + ' <div class="tile-header"><img id="tile-header-image" src="' + (TCplus.Favorited[i][1] ? TCplus.Favorited[i][1] : "https://i.imgur.com/VnVFEv7.png") + '" onload="MasonryTails.Refresh();" onclick="locationTo(\'/room/' + TCplus.Favorited[i][0] + '\');"><div class="tile-info"><div class="tile-favroom-opt" onclick="RemoveFavorite(this,' + i + ')">X</div><div class="tile-name">' + TCplus.Favorited[i][0] + '</div><div class="tile-statistic"><svg width="18" height="14" viewBox="0 0 18 14" xmlns="https://www.w3.org/2000/svg"><path d="M9.333 5.667c0-.367-.3-.667-.666-.667h-8C.3 5 0 5.3 0 5.667v6.666C0 12.7.3 13 .667 13h8c.366 0 .666-.3.666-.667V10L12 12.667V5.333L9.333 8V5.667z" transform="translate(3 -3)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span><svg width="20" height="16" viewBox="0 0 20 16" xmlns="https://www.w3.org/2000/svg"><path d="M57 4c-3.182 0-5.9 2.073-7 5 1.1 2.927 3.818 5 7 5s5.9-2.073 7-5c-1.1-2.927-3.818-5-7-5zm0 8.495c1.93 0 3.495-1.565 3.495-3.495 0-1.93-1.565-3.495-3.495-3.495-1.93 0-3.495 1.565-3.495 3.495 0 1.93 1.565 3.495 3.495 3.495zm0-1.51c1.096 0 1.985-.89 1.985-1.985 0-1.096-.89-1.985-1.985-1.985-1.096 0-1.985.89-1.985 1.985 0 1.096.89 1.985 1.985 1.985z" transform="translate(-47 -2)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span></div></div></div></div>' : '<div class="tile">Favorite #' + (i + 1) + "</div>");
        //SCRIPT INIT -> PREPARE()
        clearInterval(TCplus.ScriptLoading);
        TCplus.ScriptInit = true;
        tcplusHomePrepare();
    }

    function tcplusHomePrepare() {
        //FUNCTION BYPASS
        window.ModalFreeTrialPro = function() {};
        //REMOVE
        Remove(document, "#footer");
        Remove(document, ".nav-logo");
    }

    function tcplusRoomInject() {
        //INSERT SCRIPT
        var script = document.createElement("script"),
            elem = document.getElementsByTagName("script")[0];
        script.text = 'var StationSelected = 0,\n	StationPlay = false,\n	StationVol = 0.2;\nfunction VolStation(elem, vol){\n	var StationElem = elem.parentElement.nextSibling;\n	StationVol += vol;\n	if (StationVol < 0){\n		StationVol = 0;\n	} else if (StationVol > 1) {\n		StationVol = 1.0;\n	}\n	StationElem.volume = StationVol;\n}\nfunction PlayPauseStation(elem) {\n	var StationElem=elem.parentElement.nextSibling;\n	StationPlay=!StationPlay;\n	if (StationPlay) {\n		StationElem.volume = StationVol;\n		StationElem.play();\n	} else {\n		StationElem.pause();\n	}\n}\nfunction SeekStation(elem, direction) {\n	var StationElem = elem.parentElement.nextSibling;\n	StationPlay = true;\n	StationSelected += direction;\n	\n	if (StationSelected > window.RADIO_STATIONS.length-1) {\n		StationSelected = 0;\n	} else if (StationSelected < 0){\n		StationSelected = window.RADIO_STATIONS.length-1;\n	}\n	StationElem.pause();\n	StationElem.setAttribute("src", window.RADIO_STATIONS[StationSelected][1]);\n	StationElem.load();\n	StationElem.volume = StationVol;\n	StationElem.play();\n}';
        elem.parentNode.insertBefore(script, elem);
        //LOCALSETTINGS
        TCplus.enablePMs = (window.localStorage.tinychat_settings) ? JSON.parse(window.localStorage.tinychat_settings).enablePMs : true;
        TCplus.enableSound = (window.localStorage.tinychat_settings) ? JSON.parse(window.localStorage.tinychat_settings).enableSound : true;
        //TTS
        if (TCplus.enableSound === true && "speechSynthesis" in window) {
            TCplus.TTS.synth = window.speechSynthesis;
            TCplus.TTS.voices = TCplus.TTS.synth.getVoices();
        }
        //ELEMENT DEFINE
        MainElement = document.querySelector("tinychat-webrtc-app").shadowRoot;
        ChatLogElement = MainElement.querySelector("tc-chatlog").shadowRoot;
        VideoListElement = MainElement.querySelector("tc-videolist").shadowRoot;
        MicrophoneElement = document.createEvent("MouseEvent");
        SideMenuElement = MainElement.querySelector("tc-sidemenu").shadowRoot;
        TitleElement = MainElement.querySelector("tc-title").shadowRoot;
        UserListElement = SideMenuElement.querySelector("tc-userlist").shadowRoot;
        ModerationListElement = SideMenuElement.querySelector("tc-video-moderation").shadowRoot;
        ChatListElement = SideMenuElement.querySelector("tc-chatlist").shadowRoot;
        UserContextElement = UserListElement.querySelector("tc-user-contextmenu").shadowRoot;
        //INSERTHTML/CSS
        ChatLogElement.querySelector("style").insertAdjacentHTML("beforeend", ChatboxCSS);
        ChatLogElement.querySelector("style").insertAdjacentHTML("afterend", '<style id="' + TCplus.ChatStyleCounter + '">' + TCplus.ChatCSS[TCplus.ChatStyleCounter][0] + "</style>");
        VideoListElement.querySelector("style").insertAdjacentHTML("afterend", '<style id="' + TCplus.ChatStyleCounter + '">' + TCplus.ChatCSS[TCplus.ChatStyleCounter][1] + "</style>");
        SideMenuElement.querySelector("style").insertAdjacentHTML("afterend", '<style id="' + TCplus.ChatStyleCounter + '">' + TCplus.ChatCSS[TCplus.ChatStyleCounter][2] + "</style>");
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
        VideoListElement.querySelector("#videos-footer").insertAdjacentHTML("afterbegin", "Media");
        VideoListElement.querySelector("#videos-footer").insertAdjacentHTML("beforeend", '<div id="music-radio"><button class="music-radio-seek" onclick="SeekStation(this,-1);">←</button><button class="music-radio-seek" onclick="SeekStation(this,1);">→</button><button class="music-radio-playpause" onclick="PlayPauseStation(this);">▶❚❚</button><button class="music-radio-vol" onclick="VolStation(this,.05);">+</button><button class="music-radio-vol" style="top:50%" onclick="VolStation(this,-.05);">-</button></div><audio id="music-radio-audio" src="' + TCplus.Radio.station[0][1] + '"></audio>');
        UserListElement.querySelector("#button-banlist").insertAdjacentHTML("beforebegin", "<span>1</span>");
        VideoListElement.querySelector("#videos-header").appendChild(TitleElement.querySelector('span[title="Settings"]'));
        VideoListElement.querySelector("#videolist").appendChild(VideoListElement.querySelector("#videos-footer-broadcast-wrapper"));
        VideoListElement.querySelector("#videos-content").insertAdjacentHTML("beforeend", '<div id="popup" class="PMOverlay"></div>');
        VideoListElement.querySelector("#videolist").insertAdjacentHTML("afterbegin", '<div class="tcplusdrop"><button class="tcplusoptions">⚙</button><div class="tcplusdrop-content"><button id="BackgroundUpdateRight" class="tcplusoptions">+</button><button id="BackgroundUpdateColor" class="tcplusoptions">BG</button><button id="BackgroundUpdateLeft" class="tcplusoptions">-</button><div style="height:6px;background:#624482;"></div><button id="FontSizeUpdate" class="tcplusoptions">🗚</button><div style="height:6px;background:#624482;"></div><button id="ChatColor" class="tcplusoptions">🖉</button><button id="FeaturedToggled" class="tcplusoptions">⛶</button><button id="ChatWidthToggled" class="tcplusoptions">↹</button><button id="ChatHeightToggled" class="tcplusoptions">≡</button></div></div>');
        ChatLogElement.querySelector("#chat-position").insertAdjacentHTML("afterbegin", '<div id="notification-content"></div>');
        ChatLogElement.querySelector("#chat").insertAdjacentHTML("beforeend", '<div id="tcplus-chat-content"></div>');
        ChatLogElement.querySelector("#chat").insertAdjacentHTML("afterend", '<div class="tcplus-message-unread" style="display:none;">There are unread messages!</div>');
        //SCRIPT INIT -> PREPARE()
        clearInterval(TCplus.ScriptLoading);
        TCplus.ScriptInit = true;
        tcplusRoomPrepare();
    }

    function tcplusRoomPrepare() {
        //FUNCTION BYPASS
        window.TinychatApp.BLL.SoundPlayer.playMessage = function() {};
        window.TinychatApp.BLL.SoundPlayer.playGift = function() {};
        window.TinychatApp.BLL.User.isSubscription = function() {return true;};
        window.TinychatApp.BLL.User.canUseFilters = function() {return true;};
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
                e.video = {width: {min: 320, max: 4096}, height: {min: 240, max: 2160}};
            } else {
                navigator.mediaDevices.enumerateDevices().then(g => {
                    var h = false;
                    var len = g.length;
                    for (var c = 0; c < len; c++) {
                        if ("videoinput" === g[c].kind) {
                            if (e.video === void 0) e.video = {width: {min: 320, max: 4096}, height: {min: 240, max: 2160}, frameRate: {min: 30, max: 60}};
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
                            if (e.audio === void 0) {
                                e.audio = {};
                            }
                            if (d.audio !== null && typeof d.audio == "object" && d.audio.deviceId == g[c].deviceId) {
                                e.audio.deviceId = {
                                    exact: d.audio.deviceId
                                };
                            }
                        }
                    }
                    for (var z in i) {
                        if (i.hasOwnProperty(z) && "echoCancellation" == z && e.audio) {
                            e.audio[z] = c.isAcousticEchoCancelation();
                        }
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

        //REMOVE
        Remove(ChatLogElement, 'span[id="input-unread"]');
        Remove(ChatLogElement, "#chat-content");
        Remove(ChatLogElement, "#chat-wider");
        Remove(ChatLogElement, "#chatlog-button");
        Remove(SideMenuElement, "#top-buttons-wrapper");
        Remove(SideMenuElement, "#user-info");
        Remove(SideMenuElement, "#close-users");
        Remove(TitleElement, "#room-header-avatar");
        Remove(TitleElement, "#room-header-gifts");
        Remove(TitleElement, "#room-header-info-text");
        Remove(TitleElement, "#room-header-info-details");
        Remove(TitleElement, "#room-header-mobile-button");
        Remove(TitleElement, 'span[title="Follow"]');
        Remove(TitleElement, 'span[title="Share room"]');
        Remove(VideoListElement, "#youtube-overlay");
        Remove(VideoListElement, "#videos-header-volume");
        Remove(document, "#menu-icon");
        Remove(document, "#users-icon");
        //PARAM REMOVE
        if (TCplus.enablePMs === false) Remove(ChatListElement, "#chatlist");
        //LOAD
        tcplusRoomLoad();
    }

    function tcplusRoomLoad() {
        //EVENT LISTENERS
        VideoListElement.querySelector("#ChatHeightToggled").addEventListener("click", function() {
            if (!TCplus.ChatDisplay) {
                TCplus.ChatWidth += 5;
                TCplus.ChatDisplay = true;
            }
            TCplus.ChatHeight -= 5;
            TCplus.UserListDisplay = true;
            if (TCplus.ChatHeight == 20) {
                TCplus.ChatHeight = 45;
                TCplus.UserListDisplay = false;
            }
            ChatLogElement.querySelector("#chat-wrapper").style.cssText = "min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%);" + (TCplus.UserListDisplay ? "top:unset;min-height:calc(100% - " + TCplus.ChatHeight + "% - 119px)!important;max-height:calc(100% - " + TCplus.ChatHeight + "% - 119px)!important;" : "top:36px;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
            TitleElement.querySelector("#room-header").style.cssText = "min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%)!important;top:" + (TCplus.UserListDisplay ? "calc(" + TCplus.ChatHeight + "% + 84px);" : "0;");
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.cssText = "bottom:unset;min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%);top:" + (TCplus.UserListDisplay ? "calc(" + TCplus.ChatHeight + "% + 34px);" : "unset;bottom:0;");
            VideoListElement.querySelector("#videos-header").style.cssText = "bottom:unset;min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%);top:" + (TCplus.UserListDisplay ? TCplus.ChatHeight + "%;" : "unset;bottom:50px;");
            SideMenuElement.querySelector("#sidemenu").style.cssText = !TCplus.UserListDisplay ? "display:none" : "min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%)!important;height:" + TCplus.ChatHeight + "%!important;";
            UserListElement.querySelector("#button-banlist").style.cssText = "top:calc(" + TCplus.ChatHeight + "% + 89px);";
            document.querySelector("#content").style.cssText = "width:calc(100% " + (TCplus.ChatDisplay ? "- (400px + " + TCplus.ChatWidth + "%)" : "") + ")";
            VideoListElement.querySelector("#videos-footer").style.cssText = "display:block;top:" + (TCplus.UserListDisplay ? "calc(" + TCplus.ChatHeight + "% + 119px);" : "36px;") + "right:-70px;display:block;";
            UpdateScroll(1, true);
            Resize();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#ChatWidthToggled").addEventListener("click", function() {
            TCplus.ChatWidth += 5;
            TCplus.ChatDisplay = true;
            if (TCplus.ChatWidth == 25) {
                TCplus.ChatWidth = -5;
                TCplus.ChatDisplay = false;
            }
            ChatLogElement.querySelector("#chat-wrapper").style.cssText = (!TCplus.ChatDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%);" + ((TCplus.UserListDisplay) ? "top:unset;min-height:calc(100% - " + TCplus.ChatHeight + "% - 119px)!important;max-height:calc(100% - " + TCplus.ChatHeight + "% - 119px)!important;" : "top:36px;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
            TitleElement.querySelector("#room-header").style.cssText = (!TCplus.ChatDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%)!important;top:" + ((TCplus.UserListDisplay) ? "calc(" + TCplus.ChatHeight + "% + 84px);" : "0;");
            VideoListElement.querySelector("#videos-footer-broadcast-wrapper").style.cssText = (!TCplus.ChatDisplay) ? "display:none" : "bottom:unset;min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%);top:" + ((TCplus.UserListDisplay) ? "calc(" + TCplus.ChatHeight + "% + 34px);" : "unset;bottom:0;");
            VideoListElement.querySelector("#videos-header").style.cssText = (!TCplus.ChatDisplay) ? "display:none" : "bottom:unset;min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%);top:" + ((TCplus.UserListDisplay) ? TCplus.ChatHeight + "%;" : "unset;bottom:50px;");
            SideMenuElement.querySelector("#sidemenu").style.cssText = (!TCplus.ChatDisplay || !TCplus.UserListDisplay) ? "display:none" : "min-width:400px;width:calc(400px + " + TCplus.ChatWidth + "%);max-width:calc(400px + " + TCplus.ChatWidth + "%)!important;height:" + TCplus.ChatHeight + "%!important;";
            UserListElement.querySelector("#button-banlist").style.cssText = (!TCplus.ChatDisplay) ? "display:none" : "top:calc(" + TCplus.ChatHeight + "% + 89px);";
            document.querySelector("#content").style.cssText = "width:calc(100% " + ((TCplus.ChatDisplay) ? "- (400px + " + TCplus.ChatWidth + "%)" : "") + ")";
            if (TCplus.Me.mod) VideoListElement.querySelector("#videos-footer").style.cssText = "display:block;top:" + ((TCplus.UserListDisplay) ? "calc(" + TCplus.ChatHeight + "% + 119px);" : "36px;") + "right:-70px;display:block;";
            UpdateScroll(1, true);
            Resize();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#FeaturedToggled").addEventListener("click", function() {
            TCplus.Featured = !TCplus.Featured;
            if (TCplus.Featured === true) {
                Remove(VideoListElement, "#SmallFTYT");
            } else {
                var node = document.createElement("style");
                node.appendChild(document.createTextNode(FeaturedCSS));
                node.setAttribute("id", "SmallFTYT");
                VideoListElement.appendChild(node);
            }
            Resize();
        }, {
            passive: true
        });
        VideoListElement.querySelector("#ChatColor").addEventListener("click", function() {
            TCplus.ChatStyleCounter++;
            Remove(VideoListElement, "style[id=\"" + (TCplus.ChatStyleCounter - 1) + "\"]");
            Remove(ChatLogElement, "style[id=\"" + (TCplus.ChatStyleCounter - 1) + "\"]");
            Remove(SideMenuElement, "style[id=\"" + (TCplus.ChatStyleCounter - 1) + "\"]");
            if (TCplus.ChatStyleCounter > TCplus.ChatStyles) TCplus.ChatStyleCounter = 0;
            ChatLogElement.querySelector("style").insertAdjacentHTML("afterend", "<style id=\"" + TCplus.ChatStyleCounter + "\">" + TCplus.ChatCSS[TCplus.ChatStyleCounter][0] + "</style>");
            VideoListElement.querySelector("style").insertAdjacentHTML("afterend", "<style id=\"" + TCplus.ChatStyleCounter + "\">" + TCplus.ChatCSS[TCplus.ChatStyleCounter][1] + "</style>");
            SideMenuElement.querySelector("style").insertAdjacentHTML("afterend", "<style id=\"" + TCplus.ChatStyleCounter + "\">" + TCplus.ChatCSS[TCplus.ChatStyleCounter][2] + "</style>");
            Save("ChatStyle", TCplus.ChatStyleCounter);
        }, {
            passive: true
        });
        ChatLogElement.querySelector(".tcplus-message-unread").addEventListener("click", function() {
            UpdateScroll(1, true);
            CheckUnreadMessage();
        }, {
            passive: true
        });
        ChatLogElement.querySelector("#chat").addEventListener("scroll", function(event) {
            var element = event.target;
            if (Math.floor(element.scrollTop + 25) >= (element.scrollHeight - element.offsetHeight)) CheckUnreadMessage();
        }, {
            passive: true
        });
        ChatLogElement.querySelector("#notification-content").addEventListener("scroll", function(event) {
            var element = event.target;
            if (Math.floor(element.scrollTop + 25) >= (element.scrollHeight - element.offsetHeight)) TCplus.NotficationScroll = true;
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"BackgroundUpdateLeft\"]").addEventListener("click", function() {
            TCplus.MainBackgroundCounter++;
            if (TCplus.MainBackgroundCounter === Images.length) TCplus.MainBackgroundCounter = 0;
            document.body.style.background = "#000000 url(" + Images[TCplus.MainBackgroundCounter] + ") no-repeat center";
            document.body.style.backgroundSize = "cover";
            Save("MainBackground", "url(" + Images[TCplus.MainBackgroundCounter] + ")");
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"BackgroundUpdateColor\"]").addEventListener("click", function() {
            TCplus.MainBackgroundColorCounter++;
            if (TCplus.MainBackgroundColorCounter === Colors.length) TCplus.MainBackgroundColorCounter = 0;
            document.body.style.background = Colors[TCplus.MainBackgroundColorCounter];
            Save("MainBackground", Colors[TCplus.MainBackgroundColorCounter]);
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"BackgroundUpdateRight\"]").addEventListener("click", function() {
            TCplus.MainBackgroundCounter--;
            if (TCplus.MainBackgroundCounter === -1) TCplus.MainBackgroundCounter = Images.length - 1;
            document.body.style.background = "#000000 url(" + Images[TCplus.MainBackgroundCounter] + ") no-repeat center";
            document.body.style.backgroundSize = "cover";
            Save("MainBackground", "url(" + Images[TCplus.MainBackgroundCounter] + ")");
        }, {
            passive: true
        });
        VideoListElement.querySelector("button[id=\"FontSizeUpdate\"]").addEventListener("click", function() {
            TCplus.FontSize += 5;
            if (TCplus.FontSize >= 40) TCplus.FontSize = 15;
            Save("FontSize", TCplus.FontSize);
            ChatLogElement.querySelector("#textarea").style.fontSize = (TCplus.FontSize - 4) + "px";
        }, {
            passive: true
        });
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
            if (TCplus.AutoMicrophone) {
                OpenMicrophone();
            }
        }).observe(VideoListElement.querySelector("#videos-footer-broadcast-wrapper"), {
            attributes: true,
            attributeFilter: ["class"]
        });
        //REFRESH VIEW
        NotificationDisplay();
        Cameras();
    }

    //YOUTUBE FUNCTIONS
    function CheckHost() {
        if (TCplus.Host === 0) {
            Send("msg", "!whoisbot");
            TCplus.HostAttempt = 0;
            TCplus.HostWaiting = true;
        }
    }

    function SetBot() {
        Send("msg", "!bot");
        TCplus.HostWaiting = false;
    }

    function CheckYouTube(link, type, token, isMod) {
        if (isMod === undefined) isMod = true;
        TCplus.YouTube.XHR.type = type;
        var videoid = link.match(/http(?:s)?(?:\:\/\/)(?:w{1,3}\.)?(?:youtu(?:\.be|be.com))(?:\/v\/|\/)?(?:watch\?|playlist\?|embed\/|user\/|v\/|\/)(list\=[a-z0-9\-\_]{1,34}|(?:v\=)?[a-z0-9\-\_]{1,11})/i);
        if (videoid !== null) {
            videoid = videoid[1].replace(/v\=/g, "");
            if (videoid.match(/list\=/i)) {
                if (isMod) {
                    videoid = videoid.replace(/list\=/, "");
                    debug("YOUTUBE::PLAYLIST LINK GATHERER", videoid);
                    TCplus.YouTube.XHR.open("GET", "https://www.googleapis.com/youtube/v3/playlistItems?playlistId=" + videoid + "&part=snippet&maxResults=50" + ((token !== undefined) ? "&pageToken=" + token : "") + "&type=video&eventType=completed&key=AIzaSyCPQe4gGZuyVQ78zdqf9O5iEyfVLPaRwZg");
                    TCplus.YouTube.XHR.playlistid = videoid;
                    TCplus.YouTube.XHR.send();
                }
            } else {
                TCplus.YouTube.XHR.videoid = videoid;
                TCplus.YouTube.VideoReturn = true;
                TCplus.YouTube.XHR.open("GET", "https://www.googleapis.com/youtube/v3/videos?id=" + TCplus.YouTube.XHR.videoid + "&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=AIzaSyCPQe4gGZuyVQ78zdqf9O5iEyfVLPaRwZg");
                TCplus.YouTube.XHR.send();
                debug("YOUTUBE::LINK SEARCH", TCplus.YouTube.XHR.videoid);
            }
        } else {
            if (TCplus.YouTube.QueueList.length <= 0) {
                link = link.replace(/^(!yt )/, "");
                TCplus.YouTube.SearchReturn = true;
                TCplus.YouTube.XHR.open("GET", "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCPQe4gGZuyVQ78zdqf9O5iEyfVLPaRwZg&maxResults=1&q=" + encodeURI(link) + "&type=video&part=snippet");
                TCplus.YouTube.XHR.send();
                debug("YOUTUBE::KEYWORD SEARCH", link);
            }
        }
    }

    function YouTubePlayList(queue) {
        TCplus.YouTube.ShowQueue = (queue !== undefined) ? true : false;
        if ((!TCplus.YouTube.Playing && TCplus.Host == TCplus.Me.handle) || TCplus.YouTube.Clear === true || TCplus.YouTube.ShowQueue === true) Send("yut_playlist");
    }

    function YouTubeTrackAdd() {
        if (TCplus.YouTube.QueueList[0] !== undefined) {
            if (TCplus.YouTube.Busy === false) {
                if (TCplus.YouTube.QueueList.length > 0) {
                    debug("YOUTUBE::ID", TCplus.YouTube.QueueList[0].snippet.resourceId.videoId);
                    TCplus.YouTube.XHR.open("GET", "https://www.googleapis.com/youtube/v3/videos?id=" + TCplus.YouTube.QueueList[0].snippet.resourceId.videoId + "&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=AIzaSyCPQe4gGZuyVQ78zdqf9O5iEyfVLPaRwZg");
                    TCplus.YouTube.XHR.videoid = TCplus.YouTube.QueueList[0].snippet.resourceId.videoId;
                    TCplus.YouTube.XHR.send();
                    TCplus.YouTube.QueueList.shift();
                }
            }
        }
    }

    function YouTubePlayListItems(list) {
        var len = list.length;
        for (var i = 0; i < len; i++) {
            if (TCplus.YouTube.NotPlayable.includes(list[i].snippet.title) === false) {
                TCplus.YouTube.QueueList.push(list[i]);
            }
        }
    }

    function YouTubePlayListRemove(list) {
        var len = list.length;
        for (var i = 0; i < len; i++) {
            setTimeout(Send("yut_playlist_remove", [list[i].id, list[i].duration, list[i].title, list[i].image]), (i * 5), list);
        }
    }

    function YouTubeTimeConvert(time) {
        var a = time.match(/\d+/g);
        if (time.indexOf("M") >= 0 && time.indexOf("H") == -1 && time.indexOf("S") == -1) a = [0, a[0], 0];
        if (time.indexOf("H") >= 0 && time.indexOf("M") == -1) a = [a[0], 0, a[1]];
        if (time.indexOf("H") >= 0 && time.indexOf("M") == -1 && time.indexOf("S") == -1) a = [a[0], 0, 0];
        var len = a.length;
        time = 0;
        if (len == 3) {
            time = time + parseInt(a[0]) * 3600;
            time = time + parseInt(a[1]) * 60;
            time = time + parseInt(a[2]);
        }
        if (len == 2) {
            time = time + parseInt(a[0]) * 60;
            time = time + parseInt(a[1]);
        }
        if (len == 1) time = time + parseInt(a[0]);
        return time;
    }

    TCplus.YouTube.XHR.onload = function() {
        var response = JSON.parse(TCplus.YouTube.XHR.responseText);
        if (response.error) {
            Send("msg", "⛔" + ((response.error.errors[0].reason) ? response.error.errors[0].reason : "Track could not be added!") + "⛔");
        } else {
            if (response.kind == "youtube#playlistItemListResponse" && response.nextPageToken === undefined && response.items.length === 0) {
                TCplus.YouTube.ListBuilt = true;
                Send("msg", "🎵Found " + TCplus.YouTube.QueueList.length + " tracks!\nThis may take a few moments to add, requests can be made shortly.🎵");
                TCplus.YouTube.DataReady = true;
                TCplus.YouTube.Busy = false;
                YouTubeTrackAdd();
            }
            TCplus.YouTube.DataReady = false;
            if (response.items[0]) {
                TCplus.YouTube.Busy = true;
                if (response.items[0].id) {
                    if (response.kind == "youtube#playlistItemListResponse") {
                        YouTubePlayListItems(response.items);
                    } else {
                        TCplus.YouTube.VideoID = response.items[0].id.videoId;
                        TCplus.YouTube.XHR.open("GET", "https://www.googleapis.com/youtube/v3/videos?id=" + TCplus.YouTube.VideoID + "&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=AIzaSyCPQe4gGZuyVQ78zdqf9O5iEyfVLPaRwZg");
                        TCplus.YouTube.XHR.send();
                    }
                } else if (response.items[0].contentDetails.duration) {
                    TCplus.YouTube.DataReady = true;
                }
                if (TCplus.YouTube.DataReady === false) {
                    TCplus.YouTube.Busy = false;
                    if (response.kind == "youtube#searchListResponse") TCplus.YouTube.XHR.videoid = response.items[0].id.videoId;
                    if (response.kind == "youtube#playlistItemListResponse") {
                        if (response.nextPageToken !== undefined) {
                            TCplus.YouTube.ListBuilt = false;
                            CheckYouTube("https://www.youtube.com/playlist?list=" + TCplus.YouTube.XHR.playlistid, false, response.nextPageToken);
                            TCplus.YouTube.Busy = true;
                        } else {
                            TCplus.YouTube.ListBuilt = true;
                            Send("msg", "🎵Adding " + TCplus.YouTube.QueueList.length + " track(s) to queue!🎵\nEnjoy!");
                            TCplus.YouTube.Busy = false;
                        }
                    }
                } else {
                    TCplus.YouTube.VideoID = (TCplus.YouTube.XHR.videoid) ? TCplus.YouTube.XHR.videoid : TCplus.YouTube.QueueList[0].snippet.resourceId.videoId;
                    if (TCplus.YouTube.Playing === true) {
                        MessagePopUp(-1, "Added " + ((response.items[0] === undefined) ? response.items.snippet.title : response.items[0].snippet.title), true, true);
                        Send("yut_playlist_add", [TCplus.YouTube.VideoID, YouTubeTimeConvert(response.items[0].contentDetails.duration), ((response.items[0] === undefined) ? response.items.snippet.title : response.items[0].snippet.title), (response.items[0] === undefined) ? response.items.snippet.thumbnails.medium.url : response.items[0].snippet.thumbnails.medium.url]);
                        TCplus.YouTube.Busy = false;
                    } else {
                        if (response.items[0].snippet.title !== undefined) {
                            Send("yut_play", [TCplus.YouTube.VideoID, YouTubeTimeConvert(response.items[0].contentDetails.duration), response.items[0].snippet.title, response.items[0].snippet.thumbnails.medium.url, 0]);
                            Send("yut_playlist_remove", [TCplus.YouTube.XHR.videoid, YouTubeTimeConvert(response.items[0].contentDetails.duration), response.items[0].snippet.title, response.items[0].snippet.thumbnails.medium.url]);
                            TCplus.YouTube.Playing = true;
                        }
                        TCplus.YouTube.Busy = false;
                    }
                }
            }
            if (TCplus.YouTube.SearchReturn === true || (TCplus.YouTube.SearchReturn === false && TCplus.YouTube.VideoReturn === true && TCplus.YouTube.XHR.type === true)) {
                var title = "";
                TCplus.YouTube.SearchReturn = false;
                TCplus.YouTube.VideoReturn = false;
                if (response.items[0] !== undefined) {
                    if (response.items[0].length > 0) title = response.items[0].snippet.title;
                }
                if (response.items !== undefined) {
                    if (response.items.length > 0) title = response.items[0].snippet.title;
                }
                Send("msg", ((title === "") ? "⛔Track could not be added!⛔" : "🎵Added " + DecodeTXT(title) + " to queue!🎵"));
            }
            if (TCplus.YouTube.QueueList.length > 0) YouTubeTrackAdd();
        }
    };
    // Message Functions
    function CreateMessage(time, namecolor, avatar, username, nickname, msg, selectedchat) {
        CheckUnreadMessage();
        msg = CheckImgur(msg);
        if (selectedchat == GetActiveChat()) ChatLogElement.querySelector("#tcplus-chat-content").insertAdjacentHTML("beforeend", "<div class=\"message" + ((TCplus.Avatar) ? " common " : " ") + ((TCplus.HighlightList.includes(username.toUpperCase()) || TCplus.HighlightList.includes(nickname.toUpperCase())) ? "highlight" : "") + "\" " + ((avatar === "") ? "style=\"padding-left:3px;\"" : "") + ">" + ((TCplus.Avatar) ? "<a href=\"#\" class=\"avatar\"><div><img src=\"" + avatar + "\"></div></a>" : "") + "<div class=\"nickname\" style=\"-webkit-box-shadow: 0 0 6px " + namecolor + ";-moz-box-shadow: 0 0 6px " + namecolor + ";box-shadow: 0 0 6px " + namecolor + ";background:" + namecolor + ";\">" + nickname + "<div class=\"tcplustime\"> " + time + " </div></div><div class=\"content\"><tcplus-message-html><span id=\"html\" class=\"message common\"style=\"font-size:" + TCplus.FontSize + "px;\">" + msg + "</span></TCplus-message-html></div></div>");
        var Chat = ChatLogElement.querySelectorAll("#tcplus-chat-content>.message");
        var len = Chat.length;
        if (len > TCplus.ChatLimit + 50) {
            TCplus.ChatScroll = true;
            len = Chat.length - TCplus.ChatLimit;
            var ChatIndex = 0;
            for (ChatIndex; ChatIndex < len; ChatIndex++) {
                Chat[ChatIndex].parentNode.removeChild(Chat[ChatIndex]);
                TCplus.Message[selectedchat].shift();
            }
        }
        UpdateScroll(1, false);
    }

    function AKB() {
        if ((TCplus.AutoKick === false && TCplus.AutoBan === false) && arguments[0] === true) {
            TCplus.WatchList.push([arguments[2], arguments[1], new Date()]);
            debug("WATCHLIST::ADDED", arguments[2] + ":" + arguments[1]);
        } else {
            if (TCplus.Me.mod) {
                if (TCplus.AutoKick === true) {
                    TCplus.NoGreet = true;
                    Send("kick", arguments[1]);
                } else if (TCplus.AutoBan === true) {
                    TCplus.NoGreet = true;
                    Send("ban", arguments[1]);
                }
            }
        }
    }

    function AISB() {
        if (arguments[0].username !== "") {
            if (!TCplus.SafeList.includes(arguments[0].username)) {
                if (arguments[0].giftpoints > 0 || arguments[0].subscription > 0 || arguments[0].mod === true) {
                    if (TCplus.SafeList.length < 2500) {
                        TCplus.SafeList.push(arguments[0].username);
                        Save("SafeList", JSON.stringify(TCplus.SafeList));
                        debug("SAFELIST::ADDED", arguments[0].username + ":" + arguments[0].handle);
                    }
                } else {
                    if (arguments[0].lurker === false) {
                        AKB(true, arguments[0].handle, arguments[0].username);
                    } else {
                        AKB(false, arguments[0].handle);
                    }
                }
            }
        } else {
            AKB(false, arguments[0].handle);
        }
    }

    function LoadMessage() {
        var ChatIndex, index, Chat = ChatLogElement.querySelector("#tcplus-chat-content");
        TCplus.ChatScroll = true;
        if (!TCplus.MessageCallback[TCplus.ActiveMessage]) TCplus.MessageCallback[TCplus.ActiveMessage] = [];
        TCplus.MessageCallback[TCplus.ActiveMessage].html = Chat.innerHTML;
        TCplus.MessageCallback[TCplus.ActiveMessage].len = (Chat.innerHTML === "") ? 0 : TCplus.Message[TCplus.ActiveMessage].length;
        Chat.innerHTML = "";
        CheckUnreadMessage();
        TCplus.ActiveMessage = GetActiveChat();
        if (TCplus.Message[TCplus.ActiveMessage]) {
            index = (TCplus.MessageCallback[TCplus.ActiveMessage]) ? TCplus.MessageCallback[TCplus.ActiveMessage].len : 0;
            if (index > 0) Chat.innerHTML = TCplus.MessageCallback[TCplus.ActiveMessage].html;
            var len = TCplus.Message[TCplus.ActiveMessage].length;
            for (ChatIndex = index; ChatIndex < len; ChatIndex++) ChatLogElement.querySelector("#tcplus-chat-content").insertAdjacentHTML("beforeend", "<div class=\"message" + ((TCplus.Avatar) ? " common " : " ") + ((TCplus.HighlightList.includes(TCplus.Message[TCplus.ActiveMessage][ChatIndex].username.toUpperCase())) ? "highlight" : "") + "\" " + ((TCplus.Message[TCplus.ActiveMessage][ChatIndex].avatar === "") ? "style=\"padding-left:3px;\"" : "") + ">" + ((TCplus.Avatar) ? "<a href=\"#\" class=\"avatar\"><div><img src=\"" + (TCplus.Message[TCplus.ActiveMessage][ChatIndex].avatar) + "\"></div></a>" : "") + "<div class=\"nickname\" style=\"-webkit-box-shadow: 0 0 6px " + TCplus.Message[TCplus.ActiveMessage][ChatIndex].namecolor + ";-moz-box-shadow: 0 0 6px " + TCplus.Message[TCplus.ActiveMessage][ChatIndex].namecolor + ";box-shadow: 0 0 6px " + TCplus.Message[TCplus.ActiveMessage][ChatIndex].namecolor + ";background:" + TCplus.Message[TCplus.ActiveMessage][ChatIndex].namecolor + ";\">" + TCplus.Message[TCplus.ActiveMessage][ChatIndex].nick + "<div class=\"tcplustime\"> " + TCplus.Message[TCplus.ActiveMessage][ChatIndex].time + " </div></div><div class=\"content\"><tcplus-message-html><span id=\"html\" class=\"message common\" style=\"font-size:" + TCplus.FontSize + "px;\">" + TCplus.Message[TCplus.ActiveMessage][ChatIndex].msg + "</span></TCplus-message-html></div></div>");
        } else {
            TCplus.Message[TCplus.ActiveMessage] = [];
        }
        UpdateScroll(1, false);
    }

    function CheckUnreadMessage() {
        if (Math.floor(ChatLogElement.querySelector("#chat").scrollTop + 25) >= (ChatLogElement.querySelector("#chat").scrollHeight - ChatLogElement.querySelector("#chat").offsetHeight)) {
            TCplus.MissedMsg = 0;
            TCplus.ChatScroll = true;
            ChatLogElement.querySelector(".tcplus-message-unread").style.display = "none";
        } else {
            TCplus.MissedMsg++;
            TCplus.ChatScroll = false;
            if (ChatLogElement.querySelector(".tcplus-message-unread").style.display == "none") ChatLogElement.querySelector(".tcplus-message-unread").style.display = "block";
            ChatLogElement.querySelector(".tcplus-message-unread").innerHTML = "There are " + TCplus.MissedMsg + " unread message(s)!";
        }
    }

    function GetActiveChat() {
        var elem = ChatListElement.querySelector(".active");
        if (elem) return elem.getAttribute("data-chat-id");
        return 0;
    }

    function CheckImgur(msg) {
        if (TCplus.imgur) {
            var i = msg.match(/https?:\/\/i\.imgur\.com\/[a-zA-Z0-9]*\.(jpg|gif|png|mp4)/);
            if (i !== null) {
                msg = (i[1] == "mp4") ? "<center>(Video Below)\n<video onclick=\"if (this.paused) {this.play();}else{this.pause();}\" oncontextmenu=\"return false;\" width=\"320px\" height=\"240px\"><source src=\"" + i[0] + "\" type=\"video/mp4\" /><source src=\"https://i.imgur.com/qLOIgom.mp4\" type=\"video/mp4\" /></video>\n<a href=\"" + i[0] + "\" target=\"_blank\">Direct Link</a></center>" : "<center><img src=\"" + i[0] + "\" width=\"320px\" height=\"240px\" />\n<a href=\"" + i[0] + "\" target=\"_blank\">Direct Link</a></center>";
            }
        }
        return msg;
    }

    function TTS(msg) {
        var utter = new window.SpeechSynthesisUtterance(msg);
        utter.voice = TCplus.TTS.voices[0];
        utter.rate = 1.0;
        utter.pitch = 0.5;
        TCplus.TTS.synth.speak(utter);
    }

    function RoomUsers() {
        if (TCplus.ScriptInit) UserListElement.querySelector("#header>span>span").innerText = " : " + TCplus.UserList.length;
    }

    function SpamPrevention(msg) {
        var LineBreaks = (msg.match(/\n|\r/g) || []).length;
        if (LineBreaks >= 10) return true;
    }

    function UpdateScroll(box, force) {
        if (box === 1 && (TCplus.ChatScroll || force === true)) ChatLogElement.querySelector("#chat").scrollTop = ChatLogElement.querySelector("#chat").scrollHeight;
        if (box === 2 && (TCplus.NotificationScroll || force === true)) ChatLogElement.querySelector("#notification-content").scrollTop = ChatLogElement.querySelector("#notification-content").scrollHeight;
    }

    function DecodeTXT(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function HTMLtoTXT(str) {
        var p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML.replace(/(?:(?:(?:https?|ftps?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/igm, "<a href=\"$&\" target=\"_blank\">$&</a>").replace(/[\u2680-\u2685]/g, "<span style=\"font-size:275%;\">$&</span>");
    }

    function TimeToDate(time, date) {
        if (date === undefined) date = new Date();
        var match = time.trim().match(/(\d+):(\d+)\s?((am|AM|aM|Am)|(pm|PM|pM|Pm))/);
        var t = {
            hours: parseInt(match[1]),
            minutes: parseInt(match[2]),
            period: match[3].toLowerCase()
        };
        if (t.hours === 12) {
            if (t.period === "am") date.setHours(t.hours - 12, t.minutes, 0);
            if (t.period === "pm") date.setHours(t.hours, t.minutes, 0);
        } else {
            if (t.period === "am") date.setHours(t.hours, t.minutes, 0);
            if (t.period === "pm") date.setHours(t.hours + 12, t.minutes, 0);
        }
        return date;
    }

    function PushPM(handle, text, user) {
        var list = (user !== undefined) ? TCplus.UserList[user] : TCplus.Me;
        TCplus.Message[handle].push({
            "time": Time(),
            "namecolor": list.namecolor,
            "avatar": list.avatar,
            "username": list.username,
            "nick": list.nick,
            "msg": text
        });

        if (handle == GetActiveChat()) {
            var msg = TCplus.Message[handle][TCplus.Message[handle].length - 1];
            CreateMessage(msg.time, list.namecolor, list.avatar, list.username, list.nick, HTMLtoTXT(msg.msg), handle);
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
    // Features
    function MessagePopUp(user, msg, selectedchat, youtube) {
        if (TCplus.Popups) {
            var push = false;
            if (user != -1) {
                if (ChatListElement.querySelector(".list-item .active")) {
                    if (ChatListElement.querySelector(".active").innerHTML.includes(TCplus.UserList[user].nick) && !ChatListElement.querySelector(".active").innerHTML.includes("(offline)")) {
                        if (selectedchat) push = true;
                    } else {
                        push = true;
                    }
                } else if (!selectedchat) {
                    push = true;
                }
            }
            if (youtube) push = true;
            if (push) {
                if (VideoListElement.querySelector(".PMOverlay .PMPopup:nth-child(5)")) {
                    Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                    clearTimeout(TCplus.NotificationTimeOut[0]);
                    TCplus.NotificationTimeOut.shift();
                }
                VideoListElement.querySelector(".PMOverlay").insertAdjacentHTML("beforeend", "<div class=\"PMPopup\"><h2><div class=\"PMTime\">" + Time() + "</div><div class=\"PMName\">" + ((youtube) ? "YouTube Bot" : (TCplus.UserList[user].nick + " in " + ((selectedchat) ? "Main" : "PM"))) + "</div></h2><div class=\"PMContent\"style=\"font-size:" + TCplus.FontSize + "px\">" + msg + "</div></div>");
                TCplus.NotificationTimeOut.push(setTimeout(function() {
                    if (VideoListElement.querySelector(".PMOverlay .PMPopup")) {
                        Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                        TCplus.NotificationTimeOut.shift();
                    }
                }, 11100));
            }
        }
    }

    function Reminder() {
        var temp,
            i,
            len = TCplus.ReminderSetList.length;
        for (i = 0; i < len; i++) clearTimeout(TCplus.ReminderSetList[i]);
        TCplus.ReminderSetList = [];
        if (TCplus.Reminder === true) {
            len = TCplus.ReminderList.length;
            for (i = 0; i < len; i++) {
                temp = TimeToDate(TCplus.ReminderList[i][0]);
                TCplus.RecentTime = new Date();
                if (temp < TCplus.RecentTime) temp.setDate(temp.getDate() + 1);
                var OffsetTime = temp - TCplus.RecentTime;
                TCplus.ReminderSetList.push(setTimeout(AddReminder, OffsetTime, arguments[0], TCplus.ReminderList[i][1], i));
            }
        }
    }

    function AddReminder() {
        Send("msg", "🕬 " + arguments[1]);
        setTimeout(Reminder, 5000, arguments[0]);
    }

    function NotificationDisplay() {
        ChatLogElement.querySelector("#notification-content").style.cssText = "display:" + ((TCplus.Notification) ? "block" : "none") + ";";
    }

    function Dice() {
        return String.fromCharCode("0x268" + Rand(0, 5));
    }

    function Rand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function OpenMicrophone() {
        MicrophoneElement.initMouseEvent("mousedown");
        VideoListElement.querySelector("#videos-footer-push-to-talk").dispatchEvent(MicrophoneElement);
    }

    function Cameras() {
        var Camera = VideoListElement.querySelectorAll(".videos-items:first-child>.js-video");
        for (var featured = 1; featured < Camera.length; featured++) {
            if (!Camera[featured].querySelector("tc-video-item").shadowRoot.querySelector(".video #fixed")) {
                Camera[featured].querySelector("tc-video-item").shadowRoot.querySelector(".video").insertAdjacentHTML("afterbegin", "<style id=\"fixed\">.video.large{position: absolute;left:calc(50% - 30%);top: 0px;z-index: 2;width: 60%;}.video{padding:0px;}.video>div>.overlay{box-shadow:unset!important;}.video:after{content:unset;}</style>");
            }
        }
        Camera = VideoListElement.querySelectorAll(".videos-items:last-child>.js-video");
        for (var normal = 0; normal < Camera.length; normal++) {
            if (!Camera[normal].querySelector("tc-video-item").shadowRoot.querySelector(".video #fixed")) {
                Camera[normal].querySelector("tc-video-item").shadowRoot.querySelector(".video").insertAdjacentHTML("afterbegin", "<style id=\"fixed\">.video.large{position: absolute;left:calc(50% - 30%);top: 0px;z-index: 2;width: 60%;}.video{padding:0px;}.video>div>.overlay{box-shadow:unset!important;}.video:after{content:unset;}</style>");
            }
        }
        Resize();
    }

    function Resize() {
        window.dispatchEvent(new Event("resize"));
    }

    function Command(cmd, inpm) {
        var UserCommand = cmd.match(/^!([a-zA-Z0-9]*)(?:\s?)(.*)/);
        if (UserCommand) {
            if (typeof CommandList[UserCommand[1].toLowerCase()] == "function") {
                debug("COMMAND::" + ((inpm) ? "PM" : "MAIN"), UserCommand[1]);
                CommandList[UserCommand[1].toLowerCase()](UserCommand[2], inpm);
            }
        }
    }
    // Alert Functions
    function Settings(msg) {
        Alert(GetActiveChat(), ((msg !== undefined) ? msg : "") + "<center>TCplus BOT CONFIGURATION:\nBot Mode: " + ((TCplus.Bot) ? "AUTO" : "OFF") + "\nOperator Mode: " + ((TCplus.UserYT) ? "ON" : "OFF") + "\nReminder Mode: " + ((TCplus.Reminder) ? "ON" : "OFF") + "\n\nAvatar Display: " + ((TCplus.Avatar) ? "SHOW" : "HIDE") + "\nNotification Display: " + ((TCplus.Notification) ? "SHOW" : "HIDE") + "\nPopup Display: " + ((TCplus.Popups) ? "SHOW" : "HIDE") + "\nFont Size: " + TCplus.FontSize + "PX\n\nFOR LIST OF COMMANDS:\n!tc</center>");
    }

    function Alert(activechat, msg) {
        TCplus.Message[activechat].push({
            "time": Time(),
            "namecolor": "#3f69c0",
            "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT6iaMnZSdkJ6vXPquGHCiYCnSiEGyOc7KAIBailP2d1Dibcekr",
            "username": "",
            "nick": ("Version: " + TCplus.Storage + "_" + TCplus.Version),
            "msg": msg
        });
        var len = TCplus.Message[activechat].length - 1;
        msg = TCplus.Message[activechat][len];
        CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, activechat);
    }

    function AddUserNotification(type, namecolor, nickname, username, state, newnickname) {
        if (TCplus.ScriptInit) {
            var chat = ChatLogElement.querySelector("#notification-content"),
                Notification;
            TCplus.NotificationScroll = (Math.floor(chat.scrollTop) + 5 >= (chat.scrollHeight - chat.offsetHeight)) ? true : false;
            if (type == 1) {
                Notification = username + ((state) ? " is " : " has stopped ") + "broadcasting!";
            } else if (type == 2) {
                Notification = username + " has " + ((!state) ? "joined!" : "left");
            } else if (type == 3) {
                Notification = nickname + "has mentioned you!";
                ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><div class=\"notification\"><span style=\"background:" + namecolor + "\" class=\"nickname\">" + nickname + "</span><span class=\"time\"> " + Time() + " </span><br/> has mentioned you.</div></div>");
                UpdateScroll(2, true);
            } else if (type == 4) {
                Notification = "with the account name " + username + " changed their name to " + newnickname;
            }
            if (type != 3) ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><div class=\"notification\"><span class=\"nickname\" style=\"background:" + namecolor + ";\">" + nickname + "</span><span class=\"time\"> " + Time() + " </span><br/>" + Notification + "</div></div>");
            if (TCplus.TTS.synth !== undefined && (TCplus.TTSList.includes(nickname.toUpperCase()) || TCplus.TTSList.includes(username.toUpperCase()) || TCplus.TTSList.includes("-ALL") || TCplus.TTSList.includes("-EVENT"))) TTS(nickname + ((type == 4) ? " " : "as ") + Notification);
            UpdateScroll(2, false);
            var Notifications = ChatLogElement.querySelectorAll(".notification");
            if (Notifications.length > TCplus.NotificationLimit + 10) {
                for (var NotificationIndex = 0; NotificationIndex < Notifications.length - TCplus.NotificationLimit; NotificationIndex++) Notifications[NotificationIndex].parentNode.removeChild(Notifications[NotificationIndex]);
            }
        }
    }

    function AddSystemNotification(msg) {
        if (TCplus.ScriptInit) {
            ChatLogElement.querySelector("#notification-content").insertAdjacentHTML("beforeend", "<div class=\"list-item\"><span class=\"nickname\"style=\"background:#F00\">SYSTEM</span><span class=\"time\"> " + Time() + " </span><br/>" + msg + "</div>");
            if (TCplus.TTS.synth !== undefined && (TCplus.TTSList.includes("-ALL") || TCplus.TTSList.includes("-EVENT"))) TTS(msg);
            UpdateScroll(2, false);
        }
    }
    // User Functions
    function AddUser(handle, mod, namecolor, avatar, nickname, username) {
        TCplus.UserList.push({
            "handle": handle,
            "mod": mod,
            "namecolor": namecolor,
            "avatar": avatar,
            "nick": nickname,
            "username": username
        });
        AddUserNotification(2, namecolor, nickname, username, false);
    }

    function User(handle) {
        for (var user = 0; user < TCplus.UserList.length; user++) {
            if (TCplus.UserList[user].handle == handle) return user;
        }
        return -1;
    }

    function UsernameToHandle(username) {
        for (var user = 0; user < TCplus.UserList.length; user++) {
            if (TCplus.UserList[user].username.toUpperCase() == username || TCplus.UserList[user].nick.toUpperCase() == username) return TCplus.UserList[user].handle;
        }
        return -1;
    }

    function CheckUserListSafe(arg) {
        var len = TCplus.UserList.length;
        for (var user = 0; user < len; user++) {
            if (!TCplus.SafeList.includes(TCplus.UserList[user].username)) {
                Send(arg, TCplus.UserList[user].handle);
            }
        }
    }

    function CheckUserIgnore(user) {
        if (TCplus.IgnoreList.includes(TCplus.UserList[user].username.toUpperCase()) || TCplus.IgnoreList.includes(TCplus.UserList[user].nick.toUpperCase())) return true;
        return false;
    }

    function CheckUserAbuse(handle, username, nickname) {
        if (TCplus.Me.mod) {
            if ((TCplus.KickList.includes(username) || TCplus.KickList.includes(nickname))) {
                TCplus.NoGreet = true;
                Send("kick", handle);
            }
            if ((TCplus.BanList.includes(username) || TCplus.BanList.includes(nickname))) {
                TCplus.NoGreet = true;
                Send("ban", handle);
            }
        }
    }

    function CheckUserKeywordAbuse(handle, msg) {
        if (handle != TCplus.Me.handle) {
            var len = TCplus.KickKeywordList.length;
            for (var i = 0; i < len; i++) {
                if (msg.includes(TCplus.KickKeywordList[i])) Send("kick", handle);
            }
            len = TCplus.BanKeywordList.length;
            for (i = 0; i < len; i++) {
                if (msg.includes(TCplus.BanKeywordList[i])) Send("ban", handle);
            }
        }
    }

    function CheckUserStream(handle, published) {
        var user = User(handle);
        if (user != -1) AddUserNotification(1, TCplus.UserList[user].namecolor, TCplus.UserList[user].nick, TCplus.UserList[user].username, published);
    }

    function UserRegex(text) {
        return text.match(/^(-all|[a-z0-9_]){1,32}$/i);
    }
    // Load/Save Function
    function Load(aKey, aDefault) {
        var val = localStorage.getItem(TCplus.Storage + aKey);
        if (null === val && "undefined" != typeof aDefault) {
            Save(aKey, aDefault);
            return aDefault;
        }
        return val;
    }

    function Save(aKey, aVal) {
        localStorage.setItem(TCplus.Storage + aKey, aVal);
    }
    // Socket functions
    function tcplusWebSocket() {
        if (window.Proxy === undefined) return;
        var handler = {
            set: function(Target, prop, value) {
                if (prop == "onmessage") {
                    var oldMessage = value;
                    value = function(event) {
                        var parse = JSON.parse(event.data);
                        ServerMsg(parse, Target);
                        oldMessage(event);
                    };
                }
                return (Target[prop] = value);
            },
            get: function(Target, prop) {
                var value = Target[prop];
                if (prop == "send") {
                    value = function(event) {
                        var parse = JSON.parse(event);
                        ClientMsg(parse, Target);
                        Target.send(event);
                    };
                }
                return value;
            }
        };
        var WebSocketProxy = new window.Proxy(window.WebSocket, {
            construct: function(Target, args) {
                TCplus.SocketTarget = new Target(args[0]);
                debug("SOCKET::CONNECTING", args[0]);
                return new window.Proxy(TCplus.SocketTarget, handler);
            }
        });
        window.WebSocket = WebSocketProxy;
    }

    function BotOperator() {
        var len = TCplus.YouTube.QueueList.length;
        if (len <= 0) {
            // Moderator Control
            if (TCplus.UserList[arguments[1]].mod) {
                if (arguments[0] == 2) {
                    if (TCplus.YouTube.CurrentTrack.ID !== undefined) {
                        TCplus.YouTube.Clear = true;
                        YouTubePlayList();
                    }
                }
                if (arguments[0] == 5) SetBot();
            }
            // User and Moderator Control
            if ((TCplus.UserYT && (TCplus.BotOPList.includes(TCplus.UserList[arguments[1]].username.toUpperCase()) || TCplus.BotOPList.includes("-ALL"))) || TCplus.UserList[arguments[1]].mod) {
                if (arguments[0] == 1) CheckYouTube(arguments[2], true, undefined, TCplus.UserList[arguments[1]].mod);
                if (arguments[0] == 4) YouTubePlayList(true);
                if (arguments[0] == 6) {
                    if (TCplus.UserList[arguments[1]].mod) {
                        var videoid = arguments[2].match(/http(?:s)?(?:\:\/\/)(?:w{1,3}\.)?(?:youtu(?:\.be|be.com))(?:\/v\/|\/)?(?:watch\?|embed\/|user\/|v\/|\/)(?:v\=)?([a-z0-9\-\_]{1,11})/i);
                        if (videoid !== null) {
                            TCplus.SocketTarget.send(JSON.stringify({
                                "tc": "yut_play",
                                "item": {
                                    "id": videoid[1],
                                    "duration": 3600,
                                    "offset": 0,
                                    "title": "YOUTUBE IS BYPASSED - MODS ONLY"
                                }
                            }));
                            debug("YOUTUBE::LINK BYPASS", videoid[1]);
                        }
                    } else {
                        Send("msg", "Ask a moderator to play your request.");
                    }
                }
                if (arguments[0] == 3) {
                    if (TCplus.YouTube.CurrentTrack.ID !== undefined) {
                        Send("yut_stop", [TCplus.YouTube.CurrentTrack.ID, TCplus.YouTube.CurrentTrack.duration, TCplus.YouTube.CurrentTrack.title, TCplus.YouTube.CurrentTrack.thumbnail, 0]);
                        Send("msg", "🎵" + TCplus.YouTube.CurrentTrack.title + " has been skipped!🎵");
                    }
                }
            }
        } else {
            if (TCplus.YouTube.ListBuilt === false) {
                Send("msg", "🎵 Playlist search is happening, please wait! 🎵\n" + TCplus.YouTube.QueueList.length + " tracks found.");
            } else {
                Send("msg", "🎵 Playlist items are being added, please wait! 🎵\n" + TCplus.YouTube.QueueList.length + " tracks remaining.");
            }
        }
    }

    function ServerMsg(parse) {
        if (typeof SetList[parse.tc] == "function") {
            debug(("SERVER::" + parse.tc.toUpperCase()), parse);
            SetList[parse.tc](parse);
        }
    }

    function ClientMsg(parse) {
        if (typeof GetList[parse.tc] == "function") {
            debug(("CLIENT::" + parse.tc.toUpperCase()), parse);
            GetList[parse.tc](parse);
        }
    }

    function Send(set, arg, activepm) {
        SendList[set](set, arg, activepm);
        if (arg === undefined) arg = "Open Request";
        debug(("CLIENT::SEND::" + set.toUpperCase()), arg);
    }

    // List Functions
    var UnicodeConversionList = {
        convert: function(string) {
            return this.numerical(string).replace(/[A-Za-z]/g, this.alphabet);
        },
        alphabet: function(string) {
            return String.fromCodePoint(string.codePointAt(0) + ((/[A-Z]/.test(string)) ? "𝗔".codePointAt(0) - "A".codePointAt(0) : "𝗮".codePointAt(0) - "a".codePointAt(0)));
        },
        numerical: function(string) {
            return string.replace(/\d/g, function(c) {
                return String.fromCodePoint(0x1D79E + c.charCodeAt(0));
            });
        }
    };
    var CommandList = {
        tcplus: function(arg, inpm) {
            Alert(GetActiveChat(), "Command List:\n<b style=\"color:#ee3636;\">Moderator Commands:</b>\n!whoisbot\n!bot\n!bottoggle\n!autokick (be careful!)\n!autoban (be careful!)\n\n!ytbypass <b style=\"color:#ffff00;\">link (no playlists)</b>\n!yt <b style=\"color:#ffff00;\">link | keyword</b>\n!ytclear\n\n!banlist\n!banlistclear\n!banadd <b style=\"color:#ffff00;\">user | nick</b>\n!banremove <b style=\"color:#ffff00;\">#</b>\n\n!bankeywordlist\n!bankeywordlistclear\n!bankeywordadd <b style=\"color:#ffff00;\">keyword</b>\n!bankeywordremove <b style=\"color:#ffff00;\">#</b>\n\n!kicklist\n!kicklistclear\n!kickadd <b style=\"color:#ffff00;\">user | nick</b>\n!kickremove <b style=\"color:#ffff00;\">#</b>\n\n!kickkeywordlist\n!kickkeywordlistclear\n!kickkeywordadd <b style=\"color:#ffff00;\">keyword</b>\n!kickkeywordremove <b style=\"color:#ffff00;\">#</b>\n\n!oplist\n!oplistclear\n!opadd <b style=\"color:#ffff00;\">user | nick | -all</b>\n!opremove <b style=\"color:#ffff00;\">#</b>\n!optoggle\n\n<b style=\"color:#ee3636;\">User Commands:</b>\n!yt <b style=\"color:#ffff00;\">link | keyword</b>\n!ytskip\n!ytqueue\n\n!mentionlist\n!mentionlistclear\n!mentionadd <b style=\"color:#ffff00;\">keyword</b>\n!mentionremove <b style=\"color:#ffff00;\">#</b>\n\n!ignorelist\n!ignorelistclear\n!ignoreadd <b style=\"color:#ffff00;\">user | nick</b>\n!ignoreremove <b style=\"color:#ffff00;\">#</b>\n\n!greetlist\n!greetlistclear\n!greetadd <b style=\"color:#ffff00;\">user | nick | -all</b>\n!greetremove <b style=\"color:#ffff00;\">#</b>\n\n!ttslist\n!ttslistclear\n!ttsadd <b style=\"color:#ffff00;\">user | nick | -all | -event</b>\n!ttsremove <b style=\"color:#ffff00;\">#</b>\n\n!highlightlist\n!highlightlistclear\n!highlightadd <b style=\"color:#ffff00;\">user | nick</b>\n!highlightremove <b style=\"color:#ffff00;\">#</b>\n\n!reminderlist\n!reminderlistclear\n!reminderadd <b style=\"color:#ffff00;\">user | nick</b>\n!reminderremove <b style=\"color:#ffff00;\">#</b>\n!remindertoggle\n\n!safelist\n!safelistclear\n!safelistremove <b style=\"color:#ffff00;\">#</b>\n\n!lists\n!listsclear\n\n!greetmode\n!imgurtoggle\n!avatartoggle\n!notificationtoggle\n!popuptoggle\n\n!8ball <b style=\"color:#ffff00;\">question</b>\n!roll <b style=\"color:#ffff00;\">#</b>\n\n!clr\n!settings\n!share");
        },
        mentionadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.MentionList.push(arg.toUpperCase());
                    Save("MentionList", JSON.stringify(TCplus.MentionList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                }
            }
        },
        mentionremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.MentionList[arg] !== undefined) {
                    TCplus.MentionList.splice(arg, 1);
                    Save("MentionList", JSON.stringify(TCplus.MentionList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        mentionlistclear: function() {
            TCplus.MentionList = [];
            Save("MentionList", JSON.stringify(TCplus.MentionList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        mentionlist: function() {
            Alert(GetActiveChat(), SettingsList.MentionList());
        },
        ignoreadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.IgnoreList.push(arg.toUpperCase());
                    Save("IgnoreList", JSON.stringify(TCplus.IgnoreList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                }
            }
        },
        ignoreremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.IgnoreList[arg] !== undefined) {
                    TCplus.IgnoreList.splice(arg, 1);
                    Save("IgnoreList", JSON.stringify(TCplus.IgnoreList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        ignorelistclear: function() {
            TCplus.IgnoreList = [];
            Save("IgnoreList", JSON.stringify(TCplus.IgnoreList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        ignorelist: function() {
            Alert(GetActiveChat(), SettingsList.IgnoreList());
        },
        banadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.BanList.push(arg.toUpperCase());
                    Save("BanList", JSON.stringify(TCplus.BanList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                    var check = UsernameToHandle(arg.toUpperCase());
                    if (check != -1 && TCplus.Me.mod) Send("ban", check);
                }
            }
        },
        banremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.BanList[arg] !== undefined) {
                    TCplus.BanList.splice(arg, 1);
                    Save("BanList", JSON.stringify(TCplus.BanList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        banlistclear: function() {
            TCplus.BanList = [];
            Save("BanList", JSON.stringify(TCplus.BanList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        banlist: function() {
            Alert(GetActiveChat(), SettingsList.BanList());
        },
        kickadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.KickList.push(arg.toUpperCase());
                    Save("KickList", JSON.stringify(TCplus.KickList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                    var check = UsernameToHandle(arg.toUpperCase());
                    if (check != -1 && TCplus.Me.mod) Send("kick", check);
                }
            }
        },
        kickremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.KickList[arg] !== undefined) {
                    TCplus.KickList.splice(arg, 1);
                    Save("KickList", JSON.stringify(TCplus.KickList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        kicklistclear: function() {
            TCplus.KickList = [];
            Save("KickList", JSON.stringify(TCplus.KickList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        kicklist: function() {
            Alert(GetActiveChat(), SettingsList.KickList());
        },
        bankeywordadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                TCplus.BanKeywordList.push(arg);
                Save("BanKeywordList", JSON.stringify(TCplus.BanKeywordList));
                Alert(GetActiveChat(), "🗹Command Accepted!");
            }
        },
        bankeywordremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.BanKeywordList[arg] !== undefined) {
                    TCplus.BanKeywordList.splice(arg, 1);
                    Save("BanKeywordList", JSON.stringify(TCplus.BanKeywordList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        bankeywordlistclear: function() {
            TCplus.BanKeywordList = [];
            Save("BanKeywordList", JSON.stringify(TCplus.BanKeywordList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        bankeywordlist: function() {
            Alert(GetActiveChat(), SettingsList.BanKeywordList());
        },
        kickkeywordadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                TCplus.KickKeywordList.push(arg);
                Save("KickKeywordList", JSON.stringify(TCplus.KickKeywordList));
                Alert(GetActiveChat(), "🗹Command Accepted!");
            }
        },
        kickkeywordremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.KickKeywordList[arg] !== undefined) {
                    TCplus.KickKeywordList.splice(arg, 1);
                    Save("KickKeywordList", JSON.stringify(TCplus.KickKeywordList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        kickkeywordlistclear: function() {
            TCplus.KickKeywordList = [];
            Save("KickKeywordList", JSON.stringify(TCplus.KickKeywordList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        kickkeywordlist: function() {
            Alert(GetActiveChat(), SettingsList.KickKeywordList());
        },
        greetadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.GreetList.push(arg.toUpperCase());
                    Save("GreetList", JSON.stringify(TCplus.GreetList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                }
            }
        },
        greetremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.GreetList[arg] !== undefined) {
                    TCplus.GreetList.splice(arg, 1);
                    Save("GreetList", JSON.stringify(TCplus.GreetList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        greetlistclear: function() {
            TCplus.GreetList = [];
            Save("GreetList", JSON.stringify(TCplus.GreetList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        greetlist: function() {
            Alert(GetActiveChat(), SettingsList.GreetList());
        },
        highlightadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.HighlightList.push(arg.toUpperCase());
                    Save("HighlightList", JSON.stringify(TCplus.HighlightList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                }
            }
        },
        highlightremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.HighlightList[arg] !== undefined) {
                    TCplus.HighlightList.splice(arg, 1);
                    Save("HighlightList", JSON.stringify(TCplus.HighlightList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        highlightlistclear: function() {
            TCplus.HighlightList = [];
            Save("HighlightList", JSON.stringify(TCplus.HighlightList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        highlightlist: function() {
            Alert(GetActiveChat(), SettingsList.HighlightList());
        },
        opadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (UserRegex(arg)) {
                    TCplus.BotOPList.push(arg.toUpperCase());
                    Save("BotOPList", JSON.stringify(TCplus.BotOPList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                }
            }
        },
        opremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.BotOPList[arg] !== undefined) {
                    TCplus.BotOPList.splice(arg, 1);
                    Save("BotOPList", JSON.stringify(TCplus.BotOPList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        oplistclear: function(arg, inpm) {
            TCplus.BotOPList = [];
            Save("BotOPList", JSON.stringify(TCplus.BotOPList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        oplist: function() {
            Alert(GetActiveChat(), SettingsList.BotOPList());
        },
        ttsadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (arg.match(/^(-all|-event|[a-z0-9_]){1,32}$/i)) {
                    TCplus.TTSList.push(arg.toUpperCase());
                    Save("TTSList", JSON.stringify(TCplus.TTSList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                }
            }
        },
        ttsremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.TTSList[arg] !== undefined) {
                    TCplus.TTSList.splice(arg, 1);
                    Save("TTSList", JSON.stringify(TCplus.TTSList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        ttslistclear: function(arg, inpm) {
            TCplus.TTSList = [];
            Save("TTSList", JSON.stringify(TCplus.TTSList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        ttslist: function() {
            Alert(GetActiveChat(), SettingsList.TTSList());
        },
        reminderadd: function(arg, inpm) {
            if (arg === "") {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                var reminder = arg.match(/^((?:1[0-2]|0?[1-9]):(?:[0-5][0-9])\s?(?:[AaPp][Mm]))\s(.*)/);
                if (reminder === null) {
                    Alert(GetActiveChat(), "🗷Command Rejected!\n!reminderadd 4:18 PM This is an example you can try!");
                } else {
                    TCplus.ReminderList.push([reminder[1], reminder[2]]);
                    Save("ReminderList", JSON.stringify(TCplus.ReminderList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                    Reminder();
                }
            }
        },
        reminderremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.ReminderList[arg] !== undefined) {
                    TCplus.ReminderList.splice(arg, 1);
                    Save("ReminderList", JSON.stringify(TCplus.ReminderList));
                    Reminder();
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        reminderlistclear: function() {
            TCplus.ReminderList = [];
            Save("ReminderList", JSON.stringify(TCplus.ReminderList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        reminderlist: function() {
            Alert(GetActiveChat(), SettingsList.ReminderList());
        },
        remindertoggle: function() {
            TCplus.Reminder = !TCplus.Reminder;
            Save("Reminder", JSON.stringify(TCplus.Reminder));
            Reminder();
            Settings();
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.Reminder) ? "Reminders are now on!\n" : "Reminders are now off!\n "));
        },
        safelistremove: function(arg, inpm) {
            if (arg === "" || isNaN(arg)) {
                Alert(GetActiveChat(), "🗷Command Rejected!\nParameter was missing/incorrect\nUse <b>!tc</b> for help.");
            } else {
                if (TCplus.SafeList[arg] !== undefined) {
                    TCplus.SafeList.splice(arg, 1);
                    Save("SafeList", JSON.stringify(TCplus.SafeList));
                    Alert(GetActiveChat(), "🗹Command Accepted!");
                } else {
                    Alert(GetActiveChat(), "🗷Command Rejected!\nID was not found!");
                }
            }
        },
        safelistclear: function(arg, inpm) {
            TCplus.SafeList = [];
            Save("SafeList", JSON.stringify(TCplus.SafeList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        safelist: function() {
            Alert(GetActiveChat(), SettingsList.SafeList());
        },
        optoggle: function() {
            TCplus.UserYT = !TCplus.UserYT;
            Save("UserYT", JSON.stringify(TCplus.UserYT));
            Settings();
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.UserYT) ? "Operators can now use YouTube.\n" : "Operators cannot use YouTube.\n"));
        },
        avatartoggle: function() {
            TCplus.Avatar = !TCplus.Avatar;
            Save("Avatar", JSON.stringify(TCplus.Avatar));
            Settings();
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.Avatar) ? "Avatars from now on will be visible!\n " : "Avatars from now on will hidden!\n"));
        },
        popuptoggle: function() {
            TCplus.Popups = !TCplus.Popups;
            Save("Popups", JSON.stringify(TCplus.Popups));
            Settings();
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.Popups) ? "Popups from now on will be visible!\n " : "Popups from now on will hidden!\n"));
        },
        notificationtoggle: function() {
            TCplus.Notification = !TCplus.Notification;
            Save("Notification", JSON.stringify(TCplus.Notification));
            NotificationDisplay();
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        greetmode: function() {
            TCplus.GreetMode = !TCplus.GreetMode;
            Save("GreetMode", JSON.stringify(TCplus.GreetMode));
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.GreetMode) ? "Server like greet is enabled." : "Server like greet is disabled."));
        },
        imgurtoggle: function() {
            TCplus.imgur = !TCplus.imgur;
            Save("imgur", JSON.stringify(TCplus.imgur));
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.imgur) ? "Imgur preview is enabled." : "Imgur preview is disabled."));
        },
        clr: function() {
            TCplus.MessageCallback = [];
            TCplus.Message = [];
            TCplus.Message[0] = [];
            ChatLogElement.querySelector("#tcplus-chat-content").innerHTML = "";
        },
        autokick: function(arg, inpm) {
            if (inpm === false && TCplus.Me.mod) {
                TCplus.AutoKick = !TCplus.AutoKick;
                TCplus.AutoBan = false;
                Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.AutoKick) ? "AUTO KICK IS NOW ON!" : "AUTO KICK IS NOW OFF!"));
                if (TCplus.AutoKick === true) CheckUserListSafe("kick");
            }
        },
        autoban: function(arg, inpm) {
            if (inpm === false && TCplus.Me.mod) {
                TCplus.AutoBan = !TCplus.AutoBan;
                TCplus.AutoKick = false;
                Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.AutoBan) ? "AUTO BAN IS NOW ON!" : "AUTO BAN IS NOW OFF!"));
                if (TCplus.AutoBan === true) CheckUserListSafe("ban");
            }
        },
        bottoggle: function() {
            TCplus.Bot = !TCplus.Bot;
            Save("Bot", JSON.stringify(TCplus.Bot));
            Settings();
            Alert(GetActiveChat(), "🗹Command Accepted!\n" + ((TCplus.Bot) ? "You'll now ask !bot bypass on load." : "You'll not !bot bypass on load."));
        },
        bot: function(arg, inpm) {
            if (inpm === false && TCplus.Me.mod) Alert(0, "🗹Command Accepted!\nBot bypass was called!");
        },
        share: function() {
            var msg = "TCplus TinyChat Script:\n(TCplus Link)\nhttps://greasyfork.org/en/scripts/395929-tcplus";
            if (GetActiveChat() !== 0) {
                Send("pvtmsg", msg, GetActiveChat());
                PushPM(GetActiveChat(), msg);
            } else {
                Send("msg", msg);
            }
        },
        roll: function(arg, inpm) {
            var dice,
                msg = "";
            dice = (arg === "" || isNaN(arg)) ? 1 : (arg < 12) ? arg : 12;
            for (var i = 0; i < dice; i++) msg += Dice();
            if (GetActiveChat() !== 0) {
                Send("pvtmsg", msg, GetActiveChat());
                PushPM(GetActiveChat(), msg);
            } else {
                Send("msg", msg);
            }
        },
        "8ball": function(arg) {
            if (arg === "") {
                Alert(GetActiveChat(), "That's not a question!");
            } else {
                var msg = TCplus.EightBall[Rand(0, TCplus.EightBall.length - 1)];
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
            Alert(GetActiveChat(), SettingsList.BanList() + SettingsList.BanKeywordList() + SettingsList.KickList() + SettingsList.KickKeywordList() + SettingsList.BotOPList() + SettingsList.MentionList() + SettingsList.IgnoreList() + SettingsList.GreetList() + SettingsList.TTSList() + SettingsList.HighlightList() + SettingsList.ReminderList());
        },
        listsclear: function() {
            TCplus.MentionList = [];
            TCplus.IgnoreList = [];
            TCplus.BanList = [];
            TCplus.KickList = [];
            TCplus.BanKeywordList = [];
            TCplus.KickKeywordList = [];
            TCplus.GreetList = [];
            TCplus.HighlightList = [];
            TCplus.ReminderList = [];
            TCplus.TTSList = [];
            TCplus.BotOPList = [];
            Save("MentionList", JSON.stringify(TCplus.MentionList));
            Save("IgnoreList", JSON.stringify(TCplus.IgnoreList));
            Save("BanList", JSON.stringify(TCplus.BanList));
            Save("KickList", JSON.stringify(TCplus.KickList));
            Save("BanKeywordList", JSON.stringify(TCplus.BanKeywordList));
            Save("KickKeywordList", JSON.stringify(TCplus.KickKeywordList));
            Save("GreetList", JSON.stringify(TCplus.GreetList));
            Save("HighlightList", JSON.stringify(TCplus.HighlightList));
            Save("ReminderList", JSON.stringify(TCplus.ReminderList));
            Save("TTSList", JSON.stringify(TCplus.TTSList));
            Save("BotOPList", JSON.stringify(TCplus.BotOPList));
            Alert(GetActiveChat(), "🗹Command Accepted!");
        },
        ytqueue: function() {},
        ytclear: function() {},
        ytskip: function() {},
        yt: function() {},
        ytbypass: function() {}
    };
    var SettingsList = {
        BanList: function() {
            var index,
                msg,
                len = TCplus.BanList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Ban list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.BanList[index] + "\n";
            return msg;
        },
        BanKeywordList: function() {
            var index,
                msg,
                len = TCplus.BanKeywordList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Ban Keyword list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(TCplus.BanKeywordList[index]) + "\n";
            return msg;
        },
        KickList: function() {
            var index,
                msg,
                len = TCplus.KickList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Kick list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.KickList[index] + "\n";
            return msg;
        },
        KickKeywordList: function() {
            var index,
                msg,
                len = TCplus.KickKeywordList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Kick Keyword list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(TCplus.KickKeywordList[index]) + "\n";
            return msg;
        },
        BotOPList: function() {
            var index,
                msg,
                len = TCplus.BotOPList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Bot OP list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.BotOPList[index] + "\n";
            return msg;
        },
        MentionList: function() {
            var index,
                msg,
                len = TCplus.MentionList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Mention list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + HTMLtoTXT(TCplus.MentionList[index]) + "\n";
            return msg;
        },
        IgnoreList: function() {
            var index,
                msg,
                len = TCplus.IgnoreList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Ignore list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.IgnoreList[index] + "\n";
            return msg;
        },
        GreetList: function() {
            var index,
                msg,
                len = TCplus.GreetList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Greet list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.GreetList[index] + "\n";
            return msg;
        },
        TTSList: function() {
            var index,
                msg,
                len = TCplus.TTSList.length;
            msg = "<b style=\"color:#ee3636;\"><u>TTS list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.TTSList[index] + "\n";
            return msg;
        },
        HighlightList: function() {
            var index,
                msg,
                len = TCplus.HighlightList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Highlight list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + " : " + TCplus.HighlightList[index] + "\n";
            return msg;
        },
        ReminderList: function() {
            var index,
                msg,
                len = TCplus.ReminderList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Reminder list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": [" + TCplus.ReminderList[index][0] + "] " + HTMLtoTXT(TCplus.ReminderList[index][1]) + "\n";
            return msg;
        },
        SafeList: function() {
            var index,
                msg,
                len = TCplus.SafeList.length;
            msg = "<b style=\"color:#ee3636;\"><u>Safe list:</u></b>\n" + ((!len) ? "empty\n" : "");
            for (index = 0; index < len; index++) msg += index + ": " + TCplus.SafeList[index] + "\n";
            return msg;
        }
    };
    var QueueList = {
        add: function(item) {
            TCplus.SendQueue.push(item);
            QueueList.run();
        },
        run: function() {
            var SendInterval = setInterval(function() {
                if (TCplus.SendQueue !== undefined && TCplus.SendQueue.length > 0) {
                    var temp = new Date();
                    var OffsetTime = temp - TCplus.LastMessage;
                    if (OffsetTime >= 1500) {
                        TCplus.LastMessage = new Date();
                        TCplus.SocketTarget.send(TCplus.SendQueue[0]);
                        TCplus.SendQueue.shift();
                    }
                } else {
                    clearInterval(SendInterval);
                }
            }, 1500, TCplus.LastMessage);
        }
    };
    var SendList = {
        msg: function() {
            var obj = {
                "tc": arguments[0]
            };
            if (arguments[2] !== undefined) {
                obj.handle = arguments[1];
                TCplus.SocketTarget.send(JSON.stringify(obj));
            } else {
                if (arguments[1] !== undefined) {
                    obj.text = arguments[1];
                    QueueList.add(JSON.stringify(obj));
                } else {
                    TCplus.SocketTarget.send(JSON.stringify(obj));
                }
            }
        },
        pvtmsg: function() {
            var obj = {
                "tc": arguments[0],
                "text": arguments[1],
                "handle": Number(arguments[2])
            };
            TCplus.SocketTarget.send(JSON.stringify(obj));
        },
        kick: function() {
            SendList.msg(arguments[0], arguments[1], "kick");
        },
        ban: function() {
            SendList.msg(arguments[0], arguments[1], "ban");
        },
        yut_playlist_add: function() {
            var obj = {
                "tc": arguments[0],
                "item": {
                    "id": arguments[1][0],
                    "duration": arguments[1][1],
                    "title": arguments[1][2],
                    "image": arguments[1][3]
                }
            };
            if (arguments[1][4] !== undefined) obj.item.offset = arguments[1][4];
            TCplus.SocketTarget.send(JSON.stringify(obj));
        },
        yut_playlist_remove: function() {
            SendList.yut_playlist_add(arguments[0], arguments[1]);
        },
        yut_stop: function() {
            SendList.yut_playlist_add(arguments[0], arguments[1]);
        },
        yut_play: function() {
            SendList.yut_playlist_add(arguments[0], arguments[1]);
        },
        yut_playlist: function() {
            SendList.msg("yut_playlist");
        }
    };
    var SetList = {
        joined: function(parse) {
            debug();
            TCplus.Me = {
                "handle": parse.self.handle,
                "namecolor": NameColor[Rand(0, TCplus.NameColors)],
                "avatar": parse.self.avatar,
                "username": parse.self.username,
                "nick": parse.self.nick,
                "mod": parse.self.mod
            };
            TCplus.Room = {
                "Avatar": parse.room.avatar,
                "Bio": parse.room.biography,
                "Name": parse.room.name,
                "PTT": parse.room.pushtotalk,
                "Website": parse.room.website
            };
            TCplus.SocketConnected = true;
            var modcall = setInterval(function() {
                if (TCplus.ScriptInit === true) {
                    if (TCplus.Me.mod) {
                        if (TCplus.Bot) CheckHost();
                        VideoListElement.querySelector("#videos-footer>#videos-footer-youtube").style.cssText = "display:block;";
                        VideoListElement.querySelector("#videos-footer>#videos-footer-soundcloud").style.cssText = "display:none;";
                    }
                    clearInterval(modcall);
                }
            }, 200);
            Reminder();
        },
        userlist: function(parse) {
            var len = parse.users.length;
            for (var user = 0; user < len; user++) {
                AISB(parse.users[user]);
                CheckUserAbuse(parse.users[user].handle, (parse.users[user].username === "") ? "GUEST" : parse.users[user].username.toUpperCase(), parse.users[user].nick.toUpperCase());
                TCplus.UserList.push({
                    "handle": parse.users[user].handle,
                    "mod": parse.users[user].mod,
                    "namecolor": NameColor[Rand(0, TCplus.NameColors)],
                    "avatar": parse.users[user].avatar,
                    "username": (parse.users[user].username === "") ? "GUEST" : parse.users[user].username,
                    "nick": parse.users[user].nick
                });
            }
            RoomUsers();
        },
        join: function(parse) {
            AISB(parse);
            var user = (parse.username === "") ? "GUEST" : parse.username.toUpperCase();
            CheckUserAbuse(parse.handle, user, parse.nick.toUpperCase());
            if (TCplus.HighlightList.includes(user) || TCplus.HighlightList.includes(parse.nick.toUpperCase())) {
                if (TCplus.enableSound === true) TCplus.Sound.highlight.play();
            }
            if ((TCplus.GreetList.includes(user) || TCplus.GreetList.includes(parse.nick.toUpperCase()) || (TCplus.Me.mod && TCplus.GreetList.includes("-ALL"))) && TCplus.NoGreet === false) {
                Send("msg", UnicodeConversionList.convert(((TCplus.Welcomes[Rand(0, TCplus.Welcomes.length - 1)] + parse.nick.toUpperCase()) + ((TCplus.GreetMode) ? ".\n" + (((user != "GUEST") ? "You are signed in as " + user : "You are not signed in") + ".\nWelcome to the room!") : "!"))));
                if (TCplus.enableSound === true) TCplus.Sound.highlight.play();
            }
            TCplus.NoGreet = false;
            AddUser(parse.handle, parse.mod, NameColor[Rand(0, TCplus.NameColors)], (parse.avatar === "") ? "https://i.imgur.com/4Q4Lgzf.png" : parse.avatar, parse.nick, user);
            RoomUsers();
        },
        sysmsg: function(parse) {
            AddSystemNotification(HTMLtoTXT(parse.text));
        },
        nick: function(parse) {
            var user = User(parse.handle);
            if (user != -1) {
                AddUserNotification(4, TCplus.UserList[user].namecolor, TCplus.UserList[user].nick, TCplus.UserList[user].username, true, parse.nick);
                TCplus.UserList[user].nick = parse.nick;
                if (TCplus.Me.handle == parse.handle) TCplus.Me.nick = parse.nick;
            }
        },
        stream_connected: function() {
            debug();
        },
        stream_closed: function(parse) {
            debug();
        },
        ping: function() {
            debug();
            if (TCplus.WatchList.length > 0) {
                var verify = new Date() - TCplus.WatchList[0][2];
                debug("WATCHLIST::LIST", TCplus.WatchList);
                debug("WATCHLIST::VERIFYING", TCplus.WatchList[0][0] + " " + verify + "/900000");
                if (verify > 900000) {
                    debug("WATCHLIST::VERIFIED", TCplus.WatchList[0][0] + " " + verify + "/900000");
                    TCplus.SafeList.push(TCplus.WatchList[0][0]);
                    TCplus.WatchList.shift();
                }
            }
        },
        quit: function(parse) {
            if (TCplus.ScriptInit) {
                if (TCplus.WatchList.length > 0) {
                    var len = TCplus.WatchList.length;
                    for (var i = 0; i < len; i++) {
                        if (TCplus.WatchList[i][1] == parse.handle) {
                            TCplus.WatchList.splice(i, 1);
                            break;
                        }
                    }
                }
                var user = User(parse.handle);
                if (user != -1) {
                    AddUserNotification(2, TCplus.UserList[user].namecolor, TCplus.UserList[user].nick, TCplus.UserList[user].username, true);
                    TCplus.UserList.splice(user, 1);
                }
                RoomUsers();
                if (TCplus.Host == parse.handle && TCplus.Me.mod && TCplus.Bot) {
                    setTimeout(function(handle) {
                        if (handle == TCplus.Host) SetBot();
                    }, (Rand(10, 60) * 1000), parse.handle);
                }
            }
        },
        msg: function(parse) {
            if (TCplus.ScriptInit) {
                var user = User(parse.handle);
                if (user != -1) {
                    if (!SpamPrevention(parse.text)) {
                        if (!CheckUserIgnore(user)) {
                            var text = HTMLtoTXT(parse.text);
                            if (TCplus.Me.mod) {
                                if (TCplus.Host == TCplus.Me.handle) {
                                    if (text.match(/^!play$/i)) YouTubePlayList();
                                    if (text.match(/^!whoisbot$/i)) BotOperator(5, user);
                                    if (text.match(/^!yt\s/)) BotOperator(1, user, text);
                                    if (text.match(/^!ytbypass\s/)) BotOperator(6, user, text);
                                    if (text.match(/^!ytclear$/)) BotOperator(2, user);
                                    if (text.match(/^!ytskip$/)) BotOperator(3, user);
                                    if (text.match(/^!ytqueue$/)) BotOperator(4, user);
                                }
                                CheckUserKeywordAbuse(parse.handle, parse.text);
                            }
                            if (TCplus.UserList[user].mod && text.match(/^!bot$/)) {
                                TCplus.Host = parse.handle;
                                TCplus.HostWaiting = false;
                                if (TCplus.Me.handle == parse.handle) YouTubePlayList();
                            } else if (TCplus.HostWaiting === true) {
                                TCplus.HostAttempt++;
                                if (TCplus.HostAttempt == 1) {
                                    setTimeout(function() {
                                        if (TCplus.HostWaiting === true && TCplus.Host === 0) SetBot();
                                    }, 6000);
                                }
                                if (TCplus.HostAttempt == 10) SetBot();
                            }
                            TCplus.Message[0].push({
                                "time": Time(),
                                "namecolor": TCplus.UserList[user].namecolor,
                                "avatar": TCplus.UserList[user].avatar,
                                "username": TCplus.UserList[user].username,
                                "nick": TCplus.UserList[user].nick,
                                "msg": text
                            });

                            if (GetActiveChat() === 0) {
                                var msg = TCplus.Message[0][TCplus.Message[0].length - 1];
                                CreateMessage(msg.time, msg.namecolor, msg.avatar, msg.username, msg.nick, msg.msg, 0);
                            }
                            if (TCplus.Me.handle !== parse.handle) {
                                if (TCplus.UserList[user].mod && (text.match(/^!autokick$/) || text.match(/^!autoban$/))) {
                                    Alert(GetActiveChat(), "🗹AntiSpam Watch List CLEARED!\nAnother user has initiated autokick/autoban.");
                                    TCplus.AutoKick = false;
                                    TCplus.AutoBan = false;
                                }
                                if (TCplus.enableSound === true) {
                                    TCplus.Sound.MSG.play();
                                    if (TCplus.TTS.synth !== undefined && (TCplus.TTSList.includes(TCplus.UserList[user].username.toUpperCase()) || TCplus.TTSList.includes(TCplus.UserList[user].nick.toUpperCase()) || TCplus.TTSList.includes("-ALL"))) TTS(TCplus.UserList[user].nick + ((!text.match(/(?:^\!)|(?:https?|www|\uD83C\uDFB5)/gim)) ? " said, " + text : "is box banging!"));
                                }
                                var len = TCplus.MentionList.length;
                                for (var i = 0; i < len; i++) {
                                    if (text.toUpperCase().includes(TCplus.MentionList[i])) {
                                        if (TCplus.enableSound === true) {
                                            TCplus.Sound.mention.play();
                                        }
                                        AddUserNotification(3, TCplus.UserList[user].namecolor, TCplus.UserList[user].nick, TCplus.UserList[user].username, true);
                                    }
                                }
                            }
                            MessagePopUp(user, text, true, false);
                        }
                    } else {
                        if (TCplus.Me.mod) Send("kick", parse.handle);
                    }
                }
            }
        },
        pvtmsg: function(parse) {
            if (TCplus.ScriptInit) {
                if (TCplus.enablePMs === true) {
                    if (parse.handle != TCplus.Me.handle) {
                        var user = User(parse.handle);
                        if (user != -1) {
                            if (!SpamPrevention(parse.text)) {
                                if (!CheckUserIgnore(user)) {
                                    var text = HTMLtoTXT(parse.text);
                                    if (TCplus.Me.mod) CheckUserKeywordAbuse(parse.handle, parse.text);
                                    if (!TCplus.Message[parse.handle]) TCplus.Message[parse.handle] = [];
                                    PushPM(parse.handle, text, user);
                                    if (TCplus.enableSound === true) {
                                        TCplus.Sound.PVTMSG.play();
                                        if (TCplus.TTS.synth !== undefined && (TCplus.TTSList.includes(TCplus.UserList[user].username.toUpperCase()) || TCplus.TTSList.includes(TCplus.UserList[user].nick.toUpperCase()) || TCplus.TTSList.includes("-ALL"))) TTS(TCplus.UserList[user].nick + ((!text.match(/(?:^\!)|(?:https?|www)/gim)) ? " said, " + text : "is box banging!"));
                                    }
                                    MessagePopUp(user, text, false, false);
                                }
                            } else {
                                if (TCplus.Me.mod) Send("kick", parse.handle);
                            }
                        }
                    }
                }
            }
        },
        yut_playlist_add: function(parse) {
            if (TCplus.ScriptInit) {
                if (!TCplus.YouTube.Playing) {
                    if (TCplus.PlayListStart === true) TCplus.PlayListStart = false;
                    if (TCplus.Host != TCplus.Me.handle) {
                        Send("msg", "!play");
                    } else {
                        YouTubePlayList();
                    }
                }
            }
        },
        yut_playlist: function(parse) {
            if (TCplus.ScriptInit) {
                if (TCplus.Me.mod && TCplus.Me.handle == TCplus.Host) {
                    if (TCplus.YouTube.Clear === true) {
                        if (parse.items !== null) YouTubePlayListRemove(parse.items);
                        TCplus.YouTube.QueueList = [];
                        Send("msg", "🎵YouTube cleared!🎵");
                        TCplus.YouTube.Clear = false;
                    } else {
                        if (parse.items === null) {
                            TCplus.PlayListStart = true;
                        } else {
                            TCplus.YouTube.PlayListCount = parse.items.length;
                            TCplus.PlayListStart = false;
                            if (TCplus.YouTube.ShowQueue === true) {
                                var msg = "🎵" + TCplus.YouTube.PlayListCount + " track(s) in queue!🎵";
                                for (var i = 0; i < 3; i++) {
                                    if (parse.items[i] === undefined) break;
                                    msg = msg + "\n" + (i + 1) + ": " + parse.items[i].title + "\n[" + Math.floor(parse.items[i].duration / 60) + "M" + (parse.items[i].duration % 60) + "S]";
                                }
                                Send("msg", msg);
                            }
                        }
                        if (parse.items !== null && TCplus.Host == TCplus.Me.handle && TCplus.YouTube.Playing === false) CheckYouTube("https://www.youtube.com/watch?v=" + parse.items[0].id, false);
                    }
                    TCplus.YouTube.ShowQueue = false;
                }
            }
        },
        yut_play: function(parse) {
            if (TCplus.ScriptInit) {
                if (TCplus.YouTube.CurrentTrack.ID != parse.item.id) {
                    TCplus.YouTube.CurrentTrack.ID = parse.item.id;
                    TCplus.YouTube.CurrentTrack.duration = parse.item.duration;
                    TCplus.YouTube.CurrentTrack.title = parse.item.title;
                    TCplus.YouTube.CurrentTrack.thumbnail = parse.item.image;
                    MessagePopUp(-1, TCplus.YouTube.CurrentTrack.title + " is now playing!", true, true);
                }
                TCplus.YouTube.Playing = true;
                YouTubePlayList();
            }
        },
        yut_stop: function(parse) {
            if (TCplus.ScriptInit) {
                TCplus.YouTube.CurrentTrack.ID = undefined;
                TCplus.YouTube.CurrentTrack.duration = undefined;
                TCplus.YouTube.CurrentTrack.title = undefined;
                TCplus.YouTube.CurrentTrack.thumbnail = undefined;
                TCplus.YouTube.Playing = false;
                YouTubePlayList();
            }
        },
        publish: function(parse) {
            if (TCplus.ScriptInit) {
                CheckUserStream(parse.handle, true);
            }
        },
        unpublish: function(parse) {
            if (TCplus.ScriptInit) {
                CheckUserStream(parse.handle, false);
            }
        }
    };
    var GetList = {
        pvtmsg: function(parse) {
            if (TCplus.ScriptInit) {
                Command(parse.text, true);
                var text = parse.text;
                if (!TCplus.Message[parse.handle]) TCplus.Message[parse.handle] = [];
                PushPM(parse.handle, text);
            }
        },
        msg: function(parse) {
            if (TCplus.ScriptInit) {
                TCplus.LastMessage = new Date();
                Command(parse.text, false);
            }
        }
    };
    // Misc Functions
    function debug(e, parse) {
        if (TCplus.DebugClear === false) {
            if (e !== undefined) {
                var msg = "%ctc::" + e;
                if (parse) msg = msg + "\n%c" + JSON.stringify(parse);
                console.log(msg, "background: #000000; color: #53b6ef;", "color:#FFF;");
            }
        } else {
            console.clear();
            console.log("VERSION: " + TCplus.Version + "\nCONSOLE DEBUG: FALSE\n");
        }
    }

    function Remove(query, element) {
        return (element !== undefined) ? query.querySelector(element).parentNode.removeChild(query.querySelector(element)) : query.parentNode.removeChild(query);
    }
})();
