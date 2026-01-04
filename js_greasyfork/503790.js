// ==UserScript==
// @name        round 1
// @version     1.0
// @description For The Bodega Room On TC
// @author      Bort
// @license
// @icon        https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts*
// @grant       none
// @run-at      document-start
// @namespace   https://greasyfork.org/users/1024912
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/503790/round%201.user.js
// @updateURL https://update.greasyfork.org/scripts/503790/round%201.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  "use strict";

  // Bodega Bot script content
  (function () {
    "use strict";

    //*********** CONFIG ***********
    var CFG = {
      broadcastReconnect: true,
      //Automatically cam back up if it gets closed by a tinychat server request
      reconnectAttempts: 10,
      //Cam up attempt limit

      botCheckCooldown: 0,
      //Cooldown before responding to another !whoisbot request. Set as 0 to disable
      alwaysBot: true,
      //Ensure only one person has this enabled else it'll case reoccuring !bot spam every 2 minutes
      checkForBot: false //Whoisbot check on join
    };

    //********************************
    //******* HELPER FUNCTIONS *******

    function wordCount(text) {
      return text.split(" ").filter(function (num) {
        return num != "";
      }).length;
    }
    function capsCheck(text) {
      var words = text.split(" ");
      var capsWords = 0;
      for (
        var _iterator = _createForOfIteratorHelperLoose(words), _step;
        !(_step = _iterator()).done;

      ) {
        var word = _step.value;
        if (word === word.toUpperCase()) capsWords++;
        if (capsWords > CTS.HideCapsThreshold) return true;
      }
      return false;
    }
    function isSpecialChar(text) {
      var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      return format.test(text);
    }
    function getGreetCooldown(user) {
      var t = Date.now();
      user = user.toUpperCase();
      if (window.CTSCooldowns[user] !== undefined) {
        var tt = window.CTSCooldowns[user];
        window.CTSCooldowns[user] = t;
        return t - tt;
      }
      window.CTSCooldowns[user] = t;
      return t;
    }
    function is_numeric_char(c) {
      return /\d/.test(c);
    }
    function isNumeric(str) {
      var strAr = str.split("");
      for (var i = 0; i < strAr.length; i++) {
        if (!is_numeric_char(strAr[i])) return false;
      }
      return true;
    }
    function customGreet(user) {
      if (window.CFG.customGreetings[user] != undefined)
        return window.CFG.customGreetings[user];
      if (window.CFG.customGreetings[user.toLowerCase()] != undefined)
        return window.CFG.customGreetings[user];
      return "n/a";
    }
    function cleanNickname(name) {
      name = name.toLowerCase();
      var len = name.length;
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

      //Remove numbers from the end
      for (var i = name.length - 1; i > 0; i--) {
        if (is_numeric_char(name.charAt(i))) {
          len--;
        } else break;
      }
      name = name.substring(0, len);
      //console.log("clean nickname = " + name);
      //Remove numbers from the beginning
      len = 0;
      for (i = 0; i < name.length - 1; i++) {
        if (is_numeric_char(name.charAt(i))) {
          len++;
        } else break;
      }
      name = name.substring(len, name.length - len);
      console.log("clean nickname = " + name);
      var arr = name.split("_");
      if (arr[0].length > 1) name = arr[0];
      console.log("clean nickname = " + name);
      return name;
    }
    function checkFatal() {
      var fatal = document
        .querySelector("tinychat-webrtc-app")
        .shadowRoot.querySelector("tc-modal-fatalerror");
      if (fatal != null) {
        var modal = MainElement.querySelector("tc-modal").shadowRoot;
        modal.querySelector("#modal-window").style.cssText =
          "display:none !important;";
        Alert(
          GetActiveChat(),
          "<b><u>FATAL ERROR</u>:</b> (popup hidden)\nPage refresh required before any popup windows can be seen again"
        );
      } else setTimeout(checkFatal, 2000);
    }

    //**** HELPER FUNCTIONS END *****

    function onStartBroadcast() {
      if (CTS.Me.broadcasting) {
        console.log("Broadcast started!");
        attempt = 0;
      }
    }
    var attempt = 0;
    console.stderror = console.error.bind(console);
    console.errors = [];
    console.error = function () {
      if (arguments[0] != null && CFG.broadcastReconnect) {
        if (
          arguments[0]
            .toString()
            .includes("Broadcast closed due server request")
        ) {
          if (Date.now() - CTS.Me.lastBroadcast > 60000) attempt = 0;
          if (attempt <= CFG.reconnectAttempts && CTS.ReCam) {
            attempt++;
            CTS.Me.lastBroadcast = Date.now();
            if (attempt >= CFG.reconnectAttempts) attempt = 0;
            else
              setTimeout(function () {
                VideoListElement.querySelector(
                  "#videos-footer-broadcast"
                ).click();
              }, 1000);
          }
        }
      }
      console.errors.push(Array.from(arguments));
      console.stderror.apply(console, arguments);
    };
    function onStart() {
      console.log("SCRIPT STARTED");
      setTimeout(function () {
        checkFatal();
        console.log("FirstLoad state: " + CTS.FirstLoad);
        if (CTS.FirstLoad) {
          alert(
            "This is a modified version of the crude cosmosisT script\n\nIt was originally intended for personal use within The Bodega"
          );
          Alert(
            GetActiveChat(),
            "<b><u>CAUTION</u>:</> This script is under construction"
          );
          Save("FirstLoad", false);
        }
        var currentDiv = VideoListElement.querySelector("#button-banlist");
        var reCamButton = document.createElement("button");
        reCamButton.setAttribute("id", "button-reCam");
        reCamButton.style.cssText = "display:block;width:50px;";
        reCamButton.style.borderColor = "transparent";
        reCamButton.style.color = "white";
        console.log("ReCam state: " + CTS.ReCam);
        if (CTS.ReCam) {
          reCamButton.style.backgroundColor = "green";
          Alert(GetActiveChat(), "<b><u>CAUTION</u>:</b> ReCam enabled");
        } else reCamButton.style.backgroundColor = "transparent";
        reCamButton.appendChild(document.createTextNode("Re Cam"));
        VideoListElement.querySelector("#videos-header").insertBefore(
          reCamButton,
          currentDiv
        );
        reCamButton.onclick = function () {
          var reCamButton = VideoListElement.querySelector("#button-reCam");
          if (!CTS.ReCam) {
            if (!window.chrome && !CTS.allowReCamAllBrowsers) {
              Alert(
                GetActiveChat(),
                "This function is less reliable on non-chromium browsers.\n\nTo override, type:\n!toggleReCamAllBrowsers"
              );
              return;
            }
            CTS.ReCam = true;
            reCamButton.style.backgroundColor = "green";
            Alert(GetActiveChat(), "<b><u>CAUTION</u>:</b> ReCam enabled");
          } else {
            reCamButton.style.backgroundColor = "transparent";
            CTS.ReCam = false;
          }
          Save("ReCam", CTS.ReCam);
        };
      }, 3000);
    }

    //DEBUGGER
    window.DebugClear = false; // TRUE = CLEARS || FALSE = SHOWS
    window.CTSVersion = {
      Major: 1,
      Minor: 8,
      Patch: 65
    };
    var MainElement,
      ChatLogElement,
      VideoListElement,
      SideMenuElement,
      TitleElement,
      UserListElement,
      ModerationListElement,
      ChatListElement,
      UserContextElement,
      MicrophoneElement,
      TextAreaElement,
      FeaturedCSS,
      VideoCSS,
      SideMenuCSS,
      MainCSS,
      RoomCSS,
      TitleCSS,
      ContextMenuCSS,
      ModeratorCSS,
      UserListCSS,
      ChatListCSS,
      NotificationCSS,
      ChatboxCSS;
    //CTS MAIN VARIABLES
    var CTS = {
      Project: {
        Name: "CTS",
        Storage: "CTS_",
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
      YouTube: {
        API_KEY: "AIzaSyCP56n8GoVT_Wx4nLNOKOR-Qw4la-Hi_jk",
        XHR: new XMLHttpRequest(),
        Playing: false,
        MessageQueueList: [],
        NotPlayable: ["Private video", "Deleted video"],
        VideoID: undefined,
        Busy: false,
        DataReady: false,
        Clear: false,
        VideoReturn: false,
        SearchReturn: false,
        ListBuilt: true,
        PlayListCount: undefined,
        ShowQueue: false,
        CurrentTrack: {
          ID: undefined,
          duration: undefined,
          title: undefined,
          thumbnail: undefined
        }
      },
      AnimationFrameWorker: undefined,
      WorkersAllowed: typeof Worker !== "undefined",
      Me: {},
      Room: {},
      ScriptInit: false,
      MainBackground:
        "url(https://i.imgur.com/0E5d32a.png) rgb(0, 0, 0) no-repeat",
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
      GreetMode: true,
      PerformanceMode: false,
      CanTTS: false,
      VoteSystem: false,
      Popups: true,
      Avatar: true,
      Reminder: true,
      CanSeeTips: true,
      CanSeeGames: true,
      CanHostFishGames: false,
      CanHostTriviaGames: false,
      isFullScreen: false,
      Imgur: true,
      ImgurWarning: 0,
      Notification: true,
      UserYT: true,
      RaidToggle: true,
      ThemeChange: true,
      SoundMeterToggle: true,
      TimeStampToggle: true,
      AutoMicrophone: false,
      GreenRoomToggle: true,
      PublicCommandToggle: true,
      Game: {
        NoReset: false,
        Trivia: {
          XHR: new XMLHttpRequest(),
          QuestionList: [],
          Timer: undefined,
          ANum: ["A", "B", "C", "D"],
          Correct: "",
          Attempts: 0,
          AttemptList: [],
          WaitCount: 0,
          Waiting: true,
          HighScore: ["TheBodega", 2],
          Worth: 0,
          PlayerList: {},
          PriceList: {
            raid: 10000,
            spot: 500,
            ytbypass: 200
          }
        },
        Fish: {
          HighScore: ["TheBodega", 13337],
          StartTimeout: undefined,
          RestockTimeout: undefined,
          ReCastTimeout: undefined,
          NotEnoughTimeout: undefined,
          Round: 0,
          Player: [],
TypesOfFish: [
    ["frog", 1, true],
    ["sunfish", 2, true],
    ["goldfish", 3, true],
    ["fish swollowed hook", 4, false],
    ["family of sardine", 5, true],
    ["catfish", 6, true],
    ["spotted bass", 7, true],
    ["largemouth bass", 8, true],
    ["family of shrimp", 9, true],
    ["it pays to not drink,\ncrazy night however!", 10, false],
    ["cisco", 11, true],
    ["seaweed, still edible", 12, true],
    ["snagged a tire and lost rod", 13, false],
    ["snagged a tire and lost hook", 14, false],
    ["lost their rod to a shark", 15, false],
    ["rainbow trout", 16, true],
    ["It's your turn for dinner", 80, false],
    ["parrot fish", 17, true],
    ["snagged a plastic bag,\n their hook is gone", 18, false],
    ["walleye", 19, true],
    ["Round Whitefish", 20, true],
    ["family of clams", 21, true],
    ["family of oyster", 22, true],
    ["Round blackfish", 23, true],
    ["dolphin", 24, true],
    ["seagull,\n not a fish but will do", 25, true],
    ["pufferfish", 26, true],
    ["fined for smuggling\nmore than fish", 27, false],
    ["lobster", 28, true],
    ["tuna", 29, true],
    ["electric eel", 30, true],
    ["Eel electricuted you,\nrod is toast", 31, false],
    ["swordfish", 32, true],
    ["had bills at home to pay", 33, false],
    ["slipped and lost equipment", 34, false],
    ["bike, still good too", 35, true],
    ["great white", 36, true],
    ["octopus", 37, true],
    ["serpeant", 38, true],
    ["sea turtle", 39, true],
    ["cleaned garbage from the lake", 40, true],
    ["fined for capturing,\n a female whale", 41, false],
    ["male whale", 42, true],
    ["barracuda", 43, true],
    ["pike", 44, true],
    ["lochiness monster", 45, true],
    ["anglerfish", 46, true],
    ["small treasure chest", 47, true],
    ["golden tuna", 48, true],
    ["family of beautiful rims", 49, true],
    ["red snapper", 50, true],
    ["jaws", 51, true],
    ["mermaid", 52, true],
    ["holy grail,\nhow'd that get there?", 75, true],
    ["secret formula", 100, true],
    ["whale shark", 53, true],
    ["blue marlin", 54, true],
    ["mantis shrimp", 55, true],
    ["giant squid", 56, true],
    ["sea dragon", 57, true],
    ["albino catfish", 58, true],
    ["kelp forest", 59, true],
    ["amberjack", 60, true],
    ["golden lobster", 61, true],
    ["giant clam", 62, true],
    ["crystal clear water", 63, true],
    ["pearl oyster", 64, true],
    ["viperfish", 65, true],
    ["moonfish", 66, true],
    ["deep-sea angler", 67, true],
    ["starfish", 68, true],
    ["glowing jellyfish", 69, true],
    ["trident", 70, true],
    ["sunken treasure", 71, true],
    ["tropical parrotfish", 72, true],
    ["golden sea cucumber", 73, true],
    ["rare coral", 74, true],
    ["ancient sea scroll", 76, true],
    ["fabled sea serpent", 77, true],
    ["black marlin", 78, true],
    ["mystical sea turtle", 79, true],
    ["shark fin", 81, false],
    ["floating treasure chest", 82, true],
    ["manta ray", 83, true],
    ["giant sea anemone", 84, true],
    ["whirlpool", 85, false],
    ["shimmering starfish", 86, true],
    ["legendary golden trout", 87, true],
    ["northern pike", 88, true],
    ["ancient underwater ruins", 89, true],
    ["sunken ship", 90, true],
    ["sea serpent egg", 91, true],
    ["kelp giant", 92, true],
    ["crimson octopus", 93, true],
    ["mystic manta", 94, true],
    ["glowing sea urchin", 95, true],
    ["golden starfish", 96, true],
    ["mythical squid", 97, true],
    ["deep-sea treasure", 98, true],
    ["rare sea dragon", 99, true],
    ["enchanted sea coral", 101, true],
    ["giant sea monster", 102, true],
    ["whale fin", 103, false],
    ["abandoned shipwreck", 104, true],
    ["legendary sea monster", 105, true],
    ["golden sea horse", 106, true],
    ["emerald crab", 107, true],
    ["mystic sea anemone", 108, true],
    ["ancient ship's wheel", 109, true],
    ["pearl-encrusted clam", 110, true],
    ["giant kelp", 111, true],
    ["sea dragon egg", 112, true],
    ["silver swordfish", 113, true],
    ["dragon's treasure", 114, true],
    ["sunken lighthouse", 115, true],
    ["golden sea star", 116, true],
    ["ancient sea relic", 117, true],
    ["deep-sea leviathan", 118, true],
    ["crystal sea turtle", 119, true],
    ["enchanted kelp", 120, true],
    ["black pearl", 121, true],
    ["whale's tooth", 122, false],
    ["mermaid's comb", 123, true],
    ["shimmering sea shell", 124, true],
    ["legendary sea serpent scale", 125, true],
    ["underwater volcano", 126, false],
    ["mystic sea dragon", 127, true],
    ["sunken treasure chest", 128, true]
]
        }
      },
      TTS: {
        synth: undefined,
        voices: undefined
      },
      hasGreetedWC: false,
      Host: 0,
      HostAttempt: 0,
      HostWaiting: false,
      botLastSet: 0,
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
      ReminderList: [],
      ReminderServerInList: [],
      Favorited: [null, null, null, null, null],
      SafeList: [],
      GreenRoomIgnoreList: [],
      GreenRoomList: [],
      WatchList: [],
      HiddenCameraList: [],
      KBQueue: [],
      Message: [[]],
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
      ReCam: false,
      toggleReCamAllBrowsers: false,
      FirstLoad: true,
      DisableGifts: false,
      Hide420: false,
      HideCaps: false,
      HideCapsThreshold: 6
    };
    CTS.StorageSupport = StorageSupport();
    SetLocalValues();

    //IS USER TOUCHSCREEN
    CheckUserTouchScreen();
    if (CTS.ThemeChange) {
      // TinyChat Style
      FeaturedCSS =
        "#videos.column>.videos-items{height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
      ChatListCSS =
        '#playerYT{background: black;border-radius: 3px;}.overlay .duration{background:#9a0000;}.overlay .volume{background: #2a6a89;}.overlay .volume, .overlay .duration{height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.overlay button:hover{background: #53b6ef;cursor: pointer;}.overlay button{outline: none;line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 28px;width: 34px;}.overlay{position: absolute;width: 100%;height: 25px;display: contents;}#player{pointer-events:none; width:100%; height:20%;}#chatlist{background:#00000075;}.list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#53b6ef;}.list-item>span[data-status="gold"]:before,.list-item>span[data-status="extreme"]:before,.list-item>span[data-status="pro"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background:#53b6ef;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{font-weight: 600;border-radius:unset;color:#FFFFFF;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}';
      ChatboxCSS =
        "#chat-import-label{text-align: center;height: 20px;right: 70px;width:35px;cursor:pointer;}#safelist-import-label{text-align: center;height: 20px;cursor:pointer;}#chat-import{opacity: 0;position: absolute;z-index: -1;}#safelist-import{opacity: 0;position: absolute;z-index: -1;}.stackmessage:hover > .ctstimehighlight{display:block;z-index:1;}.ctstimehighlight{font-weight: 600;font-size: 16px;color: #FFF;position: absolute;right: 3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;display:none;}.stackmessage{background: #00000085;border-radius: 6px;margin: 5px 0 0 -5px;padding: 5px;border: #7672729e 1px solid;}#chat-export{right:35px;width:35px;}#safelist-export{right:105px; width:35px;}#safelist-import-label{right:140px; width:35px;}#chat-download{right:0;width:35px;}#safelist-import-label:hover,#safelist-export:hover, #chat-import-label:hover, #chat-export:hover, #chat-download:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}.chat-button{outline:none;background: unset;border: unset;position: absolute;height: 22px;padding-top: 2px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;}#chatlog-button{display:none!important;}@media screen and (max-width: 1200px){#chat-hide{top: -39px!important;left: 0!important;width: 100%!important;border-radius: 0!important;}}#chat-hide{top: calc(50% - 18px);position: absolute;display: block;height: 16px;width: 16px;left: -8px;margin-top: -20px;border-radius: 16px;font-size: 0;background:url(https://i.imgur.com/jFSLyDD.png) #000000 center no-repeat;background-size:16px;cursor: pointer;z-index: 1;-webkit-box-shadow: 0 0 6px #53b6ef;box-shadow: 0 0 6px #53b6ef;}#chat-instant.show{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(25, 29, 32)100%)!important;}#chat-wider:before{transition:.3s;margin: -4px 0 0 -4px;border-width: 6px 6px 6px 0;border-color: transparent #ffffff!important;}#chat-wider{-webkit-box-shadow: 0 0 6px #53b6ef;box-shadow: 0 0 6px #53b6ef;z-index: 2;background:#000000!important}#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #10131494;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;overflow:hidden;}#user-menu{border-radius: 6px;background: #000000b8;position: absolute;display: none;bottom: 50px;right: 0;box-sizing: border-box;border-radius: 6px;color: #FFFFFF;line-height: 1;z-index: 1;max-width:300px;padding:12px;}#user-menu > span {border-radius:6px;background:#000000c9;display: inline-block;width: 100%;padding: 6px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background:unset;}.cts-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.ctstime{position:absolute;right:3px;top:3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#cts-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message>.systemuser{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgba(0, 0, 0, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift>a{background:black;}.gift{border-radius:12px;background: #0165d0;-webkit-box-shadow: inset 0 0 5em 5px #000;box-shadow: inset 0 0 5em 5px #000;}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{text-decoration:underline;}#chat{will-change: transform;min-height:unset;}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#cts-chat-content>.message{padding:6px 3px;background:#101314a8;position:relative;left:0;margin-bottom:3px;border-radius:6px}#cts-chat-content>.message.highlight,.message.common.highlight{background:#243584a1;-webkit-box-shadow: inset 0 0 20px #000000;box-shadow: inset 0 0 20px 0 #000000;}#cts-chat-content>.message.common{min-height: 50px;padding:3px 3px 9px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#cts-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);pointer-events:none;}#chat-instant>.avatar>div,#cts-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}.notifbtn:hover{background:linear-gradient(0deg,rgb(0, 135, 186)0%,rgba(0, 49, 64, 0.94)75%,rgba(0, 172, 255, 0.6)100%);}.notifbtn{cursor: pointer;border-radius: 0 0 12px 12px;outline: none;background:linear-gradient(0deg,rgba(0, 0, 0, 0)0%,rgba(37, 37, 37, 0.32)75%,rgba(255, 255, 255, 0.6)100%);border: none;color: white;width: 100%;}#notification-content.large{height:50%;}#notification-content{transition: .2s;will-change: transform;top:0;position:relative;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height:20%;min-height:38px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#cts-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-instant::after{content:unset;}.on-white-scroll{scrollbar-width: none;overflow-wrap: break-word;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content>.message>.nickname{cursor: pointer;border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" +
        (CTS.FontSize - 4) +
        "px;font-family:sans-serif;font-weight:300;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
      MainCSS =
        "#menu{display:none;}#mobile-app.show{display:none;}html{background:rgba(0,0,0,1);}#menu-icon{display:none;}body{background:" +
        CTS.MainBackground +
        ";background-position: center!important;background-size:cover!important;overflow:hidden;}#nav-static-wrapper {display:none;}#content{padding:0!important;}";
      VideoCSS =
        '#button-banlist{display:none;color: white;cursor: pointer;background: #101314;border: none;}#button-banlist:hover{background:#53b6ef;}.overlay{display:none;}#youtube.video > div > .overlay > .icon-visibility{display:none;}@media screen and (min-width: 700px){#seek-duration{display:block!important;}}#seek-duration{display:none;}#youtube.video:hover > div > .overlay{opacity:1;}#youtube.video > div{margin-bottom:unset;}#youtube.video > div > .overlay{top: calc(100% - 57px);opacity: 0;transition: opacity .5s ease-out;-moz-transition: opacity .5s ease-out;-webkit-transition: opacity .5s ease-out;-o-transition: opacity .5s ease-out;background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}.video>div{border-radius:10px;}@media screen and (max-width: 600px){#videos{top:38px;}#videos-header{position: unset;height: unset;width: unset;top: unset;bottom: unset;padding: 0 2px 10px 15px;box-sizing: border-box;}}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{height:unset;}#videolist[data-mode="dark"]{background-color:unset;}@media screen and (max-width: 1200px){#videos-footer{right: unset!important;bottom: -22px!important;top: unset!important;}}#videos-footer-broadcast-wrapper{margin-top:16px;}.tcsettings{display:none}#videos-header{background:#101314;}#videos-footer-broadcast-wrapper.active>#videos-footer-broadcast,#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button,#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:focus{background-color:#2d373a!important;}.js-video.broken{display:none;}.videos-header-volume {border-color:#202627;}.tcsettings:hover{background:#008cda;}.tcsettings{cursor: pointer;outline: none;background:#101314;border: none;color: white;}.music-radio-info>.description{cursor:default;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.music-radio-info>.volume{bottom: 0;position: absolute;background: #2a6a89;height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.music-radio-info{top: -50px;position: absolute;background: #071c19f0;height: 50px;width: 336px;line-height: 24px;}.ctsdrop{position:fixed;display:inline-block;top:3px;left:4px;z-index:5;min-width: 46px;}.ctsdrop-content{top:28px;right:0;background:#101314;width: 92px;padding:0;z-index:1;display:none;}.ctsdrop:hover .ctsdrop-content{display:block;}.ctsdrop-content button.hidden{display:none;}.ctsdrop-content button:hover, .ctsoptions:hover{background:#53b6ef}.ctsdrop-content button, .ctsoptions{line-height: 22px;color: white;width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #10131475;border: none;padding: 5% 0;display: inline-block;}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: -64px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-push-to-talk {min-width: 170px; width: 170px;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #53b6ef;cursor: pointer;}#videos-footer #music-radio{left: 0;border-radius: 12px;background: #101314;}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}#videos-footer{cursor:pointer;top:0;display:block;padding: 2px 0 0 11px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute}#videos-footer-broadcast{height:unset;border-radius:unset;z-index: 1;padding: unset!important;white-space: pre}span[title="Settings"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0;left: 0;right: 0;top: 0}:host,#videolist{background:unset!important;}.video:after{content: unset;border:unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header>span{display:block;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}';
      RoomCSS =
        "tc-title{display:flex;}#room-content{padding-top:0!important;background:unset!important;}";
      TitleCSS =
        "#room-header-info > h1:after{content:unset;}@media screen and (max-width: 600px){#room-header-info{left:unset;right:unset;}}#room-header-info > span + span,#room-header-info > span{display:none;}#room-header-info > h1{width:unset;max-width:unset; position: relative;top: 8px;left: 60px;}#room-header-info{padding:unset;}#room-header-avatar{display:none}#room-header-gifts{display:none}#room-header-info-text{display:none}#room-header-info-details{display:none}#room-header-mobile-button{display:none}#room-header{display:none;width:100%;min-height:38px;max-height:38px;}";
      SideMenuCSS =
        "#sidemenu{left:0;z-index:3;}@media screen and (max-width: 1000px){#sidemenu{left:-270px;}}#sidemenu.full-screen{left:-270px;}#user-info{display:none;}#top-buttons-wrapper{display:none;}#sidemenu-content{scrollbar-width:none;padding-top:unset;}#sidemenu-wider:before{margin: -4px 0 0 -4px;border-width: 6px 6px 6px 0;border-color: transparent #ffffff;}#sidemenu-wider{-webkit-box-shadow: 0 0 6px #53b6ef;box-shadow: 0 0 6px #53b6ef;z-index: 2;display:block;background-color: #000000;}#sidemenu-content::-webkit-scrollbar{display: none;}#sidemenu.wider {left: -270px;}";
      NotificationCSS =
        "#youtube.video{min-height:unset;min-width:unset;}f@media screen and (max-width: 600px){#videos-header>span{line-height:50px;}}#videos-header > span {background-color: unset!important;}.PMTime{display:inline-block;padding:0 6px 0 0;margin:0 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{word-break: break-word;white-space: pre-line;word-wrap: break-word;user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;color: #FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0 0;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0 0 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
      UserListCSS =
        '#contextmenu {top:unset!important;bottom:0!important;right:0!important;left:0!important;}.list-item>span>span{padding: 0 8px;top:-2px}.list-item > span:hover > span{background-color:unset;box-shadow:unset;}#userlist{background: #00000075;}.js-user-list-item{background: linear-gradient(0deg,rgb(0, 0, 0) 2px,rgba(0, 0, 0, 0.25) 2px,rgba(0, 0, 0, 0.59) 32%);}.list-item>span>span[data-cam="1"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator="1"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:5px;}.list-item>span>img{top:6px;}.list-item>span[data-status="gold"]:before,.list-item>span[data-status="extreme"]:before,.list-item>span[data-status="pro"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{font-weight: 600;color:#FFFFFF;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}';
      ModeratorCSS =
        '.video{width:100%}.video > div > .overlay{background-color:unset;}.video:hover{max-width:unset;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#53b6ef;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{padding-left:unset;max-height:60px;background: #00000075;}#moderatorlist>#header{height: 60px;color: #FFFFFF;border-radius: unset;line-height: 22px;}#moderatorlist.show[data-videos-count="1"], #moderatorlist.show[data-videos-count="2"],#moderatorlist.show[data-videos-count="3"],#moderatorlist.show[data-videos-count="4"],#moderatorlist.show[data-videos-count="5"],#moderatorlist.show[data-videos-count="6"],#moderatorlist.show[data-videos-count="7"],#moderatorlist.show[data-videos-count="8"],#moderatorlist.show[data-videos-count="9"],#moderatorlist.show[data-videos-count="10"],#moderatorlist.show[data-videos-count="11"],#moderatorlist.show[data-videos-count="12"]{margin: 5px;max-height:100%}';
      ContextMenuCSS =
        '.context[data-mode="dark"] > span:hover{background-color:#04caff;}.context.show{height:100%;}.context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background:#101314;position:unset;padding:0;height:0;transition:.25s;}';
    } else {
      //CTS Style
      FeaturedCSS =
        "#videos.column>.videos-items{background:#0000003b;height:20%}#videos.column>.videos-items+.videos-items{background:none;height:80%}#videos.row>.videos-items{background:#0000003b;width:20%}#videos.row>.videos-items+.videos-items{background:none;width:80%}#videos.row.featured-2>.videos-items{width:20%}#videos.row.featured-2>.videos-items+.videos-items{width:80%}#videos.column.featured-2>.videos-items{height:20%}#videos.column.featured-2>.videos-items+.videos-items{height:80%}#videos.row.featured-3>.videos-items{width:20%}#videos.row.featured-3>.videos-items+.videos-items{width:80%}#videos.column.featured-3>.videos-items{height:20%}#videos.column.featured-3>.videos-items+.videos-items{height:80%}";
      ChatListCSS =
        '.list-item>span>img{top:6px;}.list-item>span.active>span{transition:none;box-shadow:none;background:transparent;visibility:hidden;}.list-item>span>span{top:-4px;background:transparent;box-shadow:none;}.list-item>span>span[data-messages]:before{background:#53b6ef;}.list-item>span[data-status="gold"]:before,.list-item>span[data-status="extreme"]:before,.list-item>span[data-status="pro"]:before{top:5px;}#chatlist>#header>.list-item>span.active{background:#53b6ef;}#chatlist>#header{height:60px;top:30px}#chatlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#chatlist>div{height:22px;line-height:22px;}';
      ChatboxCSS =
        "#chat-import-label{text-align: center;height: 20px;right: 70px;width:35px;cursor:pointer;}#safelist-import{opacity: 0;position: absolute;z-index: -1;}#safelist-import-label{text-align: center;height: 20px;cursor:pointer;}#chat-import{display: none;position: absolute;z-index: -1;}.stackmessage:hover > .ctstimehighlight{display:block;z-index:1;}.ctstimehighlight{font-weight: 600;font-size: 16px;color: #FFF;position: absolute;right: 3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;display:none;}.stackmessage{background: #00000085;border-radius: 6px;margin: 5px 0 0 -5px;padding: 5px;border:#7672729e 1px solid;}#chat-export{right:35px;width:35px;}#safelist-export{right:105px; width:35px;}#safelist-import-label{right:140px; width:35px;}#chat-download{right:0;width:35px;}#safelist-import-label:hover,#safelist-export:hover, #chat-import-label:hover, #chat-export:hover, #chat-download:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}.chat-button{outline:none;background: unset;border: unset;position: absolute;height: 22px;padding-top: 2px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;}#chatlog-button{display:none!important;}#chat-instant.show{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(25, 29, 32)100%)!important;}#chat-wider{display:none;}#fav-opt{display: inline-block;cursor: pointer;padding: 12px;background: #10131494;}#input-user:checked ~ #user-menu{display:inline-block;}#user-menu > a:hover #user-menu > span > a:hover{color: #FFFFFF}#user-menu > a, #user-menu > span > a {font-weight: 600;position: relative;display: inline-block;width:calc(100% - 30px);box-sizing: border-box;font-size: 18px;color: #53b6ef;cursor: pointer;transition: .2s;overflow:hidden;}#user-menu {border-radius: 6px;background: #000000b8;position: absolute;display: none;bottom: 50px;right: 0;box-sizing: border-box;border-radius: 6px;color: #FFFFFF;line-height: 1;z-index: 1;max-width:300px;padding:12px;}#user-menu > span {border-radius:6px;background:#000000c9;display: inline-block;width: 100%;padding: 6px;box-sizing: border-box;font-size: 16px;font-weight: 500;white-space: nowrap;text-overflow: ellipsis;cursor: default;overflow: hidden;}#label-user > img {position: absolute;height: 100%;left: -8px;vertical-align: top;}#label-user{position: relative;display: inline-block;height: 48px;width: 48px;border-radius: 100%;overflow: hidden;cursor: pointer;}#header-user{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;position: absolute;top: 10px;right: 0;}#chat-wrapper.full-screen #chat-instant, #chatf-wrapper.full-screen #chat-instant>.avatar>.status-icon,#chat-wrapper.full-screen #chat-content>.message>.avatar>.status-icon {background:unset;}.cts-message-unread{display:block;border-radius:6px;padding:1px 6px 1px 6px;background:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font:bold 16px sans-serif;cursor:pointer}.ctstime{position:absolute;right:3px;top:3px;background: #101314;border: 1px solid black;border-radius: 6px;padding: 1px 6px;}#chat-instant>.avatar>div>img,#cts-chat-content>.message>.avatar>div>img{position:relative;height:100%;left:-7px}.message>.systemuser{background:linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgba(0, 0, 0, 0.72)100%);border: 1px solid black;border-radius: 6px;padding: 1px 6px 1px 6px;word-wrap: break-word;font-weight: 600;font-size: 16px;color: #FFF;text-decoration: none;overflow: hidden;text-overflow: ellipsis;}.gift>a{background:black;}.gift{border-radius:12px;background: #0165d0;-webkit-box-shadow: inset 0 0 5em 5px #000;box-shadow: inset 0 0 5em 5px #000;}.message{color:#FFF;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-family:sans-serif;font-weight:300;font-size:20px;white-space:pre-line;word-wrap:break-word}.message a, .message a:visited, .message a:hover, .message a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.message a:hover{text-decoration:underline;}#chat{will-change: transform;min-height:unset;}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#cts-chat-content>.message{padding:6px 3px;background:#101314a8;position:relative;left:0;margin-bottom:3px;border-radius:6px}#cts-chat-content>.message.highlight,.message.common.highlight{background:#243584a1;-webkit-box-shadow:inset 0 0 20px #000000;box-shadow: inset 0 0 20px 0 #000000;}#cts-chat-content>.message.common{min-height: 50px;padding:3px 3px 9px 50px;box-sizing:border-box;text-align:left}#chat-instant>.avatar,#cts-chat-content>.message>.avatar{position:absolute;height:40px;width:40px;top:3px;left:3px;-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);pointer-events:none;}#chat-instant>.avatar>div,#cts-chat-content>.message>.avatar>div{position:absolute;height:100%;width:100%;top:0;left:0;border-radius:100%;overflow:hidden}#notification-content .nickname{border-radius:6px;padding:1px 6px 1px 6px}.notification{padding:1px 0 1px 0;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black}.time{position:absolute;right:5px}.notifbtn:hover{background:linear-gradient(0deg,rgb(0, 135, 186)0%,rgba(0, 49, 64, 0.94)75%,rgba(0, 172, 255, 0.6)100%);}.notifbtn{cursor: pointer;border-radius: 0 0 12px 12px;outline: none;background:linear-gradient(0deg,rgba(0, 0, 0, 0)0%,rgba(37, 37, 37, 0.32)75%,rgba(255, 255, 255, 0.6)100%);border: none;color: white;width: 100%;}#notification-content.large{height:50%;}#notification-content{transition: .2s;will-change: transform;top:0;position:relative;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height: 15%;min-height:38px;font:bold 16px sans-serif;color:#FFF;overflow-y:scroll;overflow-wrap:break-word;padding:0 6px 0 6px}#notification-content::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content{display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}#chat-instant>.avatar>.status-icon,#cts-chat-content>.message>.avatar>.status-icon{left:0!important}#chat-instant>.nickname{color:#53b6ef;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-size: 20px;font-weight: 800;}#chat-instant::after{content:unset;}.on-white-scroll{scrollbar-width: none;overflow-wrap: break-word;}.on-white-scroll::-webkit-scrollbar{width:0;background:transparent}#cts-chat-content>.message>.nickname{cursor: pointer;border:1px solid black;border-radius:6px;padding:1px 6px 1px 6px;word-wrap:break-word;max-width:calc(100% - 115px);font-weight:600;font-size:16px;color:#FFF;display:inline-block;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#input{padding-top:0}:host,#input>.waiting{background:#20262870}#input:before,#input:after{content:unset}#input>textarea::placeholder{color:#FFF}#input>textarea::-webkit-input-placeholder{color:#fff}#input>textarea:-moz-placeholder{color:#fff}#input>textarea{width: calc(100% - 57px);line-height:unset;min-height:65px;max-height:65px;border-radius:6px;scrollbar-width:none;background:#101314;text-shadow:-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color:#FFF;font-size:" +
        (CTS.FontSize - 4) +
        "px;font-family:sans-serif;font-weight:300;}#chat-wrapper{border:none;transition:none;bottom:0;right:0!important;max-height:calc(70% - 119px)!important;min-height:calc(70% - 119px)!important;position:fixed!important;min-width:400px;max-width:400px;}#chat-position{top:22px;left:6px;right:6px;bottom:5px;}.on-white-scroll::webkit-scrollbar{width:0;background:transparent;}";
      MainCSS =
        "#menu{display:none;}.container{display:none;}#mobile-app.show{display:none;}html{background:rgba(0,0,0,1);}#users-icon{display:none;}#menu-icon{display:none;}body{background:" +
        CTS.MainBackground +
        ";background-position: center!important;background-size:cover!important;overflow:hidden;}#content{width:calc(100% - 400px);padding:0!important;}#nav-static-wrapper, #nav-fixed-wrapper{display:none;}";
      VideoCSS =
        '#button-banlist{display:none;color: white;cursor: pointer;background: #101314;border: none;}#button-banlist:hover{background:#53b6ef;}.overlay{display:none;}#youtube.video > div > .overlay > .icon-visibility{display:none;}#youtube.video:hover > div > .overlay{opacity:1;}@media screen and (min-width: 700px){#seek-duration{display:block!important;}}#seek-duration{display:none;}#youtube.video > div{margin-bottom:unset;}#youtube.video > div > .overlay{top: calc(100% - 57px);opacity: 0;transition: opacity .5s ease-out;-moz-transition: opacity .5s ease-out;-webkit-transition: opacity .5s ease-out;-o-transition: opacity .5s ease-out;background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}@media screen and (max-width: 600px){#videos-footer-broadcast{height:unset;text-align:center;line-height:50px;}}.video>div{border-radius:10px;}@media screen and (max-width: 600px){#videos{top:38px;}}#videolist[data-mode="dark"]{background-color:unset;}.js-video.broken{display:none;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-submenu{right:0;}#videos-footer-submenu{width: calc(100% - 14px);right:0;bottom:-2px;}.videos-header-volume {border-color:#202627;}.tcsettings:hover{background:#008cda;}.tcsettings{cursor: pointer;outline: none;background:#101314;border: none;color: white;}.music-radio-info>.description{cursor:default;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.music-radio-info>.volume{bottom: 0;position: absolute;background: #2a6a89;height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.music-radio-info{top: -50px;position: absolute;background: #071c19f0;height: 50px;width: 336px;line-height: 24px;}.ctsdrop{position:fixed;display:inline-block;top:3px;right:4px;z-index:5;min-width: 46px;}.ctsdrop-content{position:absolute;top:28px;right:0;background:#101314;width: 92px;padding:0;z-index:1;display:none;}.ctsdrop:hover .ctsdrop-content{display:block;}.ctsdrop-content button.hidden{display:none;}.ctsdrop-content button:hover, .ctsoptions:hover{background:#53b6ef}.ctsdrop-content button, .ctsoptions{line-height: 22px;color: white;width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #101314;border: none;padding: 5% 0;display: inline-block;}#youtube{padding: unset}#grab{left: 0;background:#2d373a;border-radius: 12px;visibility: hidden;top: -36px;position: absolute;display: flex}#videos-footer-broadcast-wrapper>.video{position: fixed;display: none;width: 5%;top: 0;left: 0}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button:hover{background: #1f2223!important}#videos-footer-broadcast-wrapper.active>#videos-footer-submenu-button{background: #2d373a!important}#videos-footer #music-radio .music-radio-playpause{position:absolute;top:0;left:30px;height:100%;width:60px;}#videos-footer #music-radio .music-radio-vol{position: absolute;right: 0;top: 0;}#videos-footer #music-radio button{line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 50%;display: block;width: 30px;}#videos-footer #videos-footer-youtube{left: 120px;border-radius: 0;display:none;}#videos-footer #videos-footer-soundcloud{display:none;border-radius: 0;left: 240px}#videos-footer #videos-footer-youtube,#videos-footer #videos-footer-soundcloud,#videos-footer #music-radio{transition: .2s;line-height: 33px;bottom: 21px;visibility: hidden;height: 36px;margin: unset;width: 120px;position: absolute;z-index: 1;}#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-push-to-talk {min-width: 170px; width: 170px;}#videos-footer-push-to-talk{border-radius: unset}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{border-radius: unset;}#videos-footer-broadcast-wrapper.moderation>#videos-footer-broadcast{padding: unset}#videos-footer #music-radio button:hover{background: #53b6ef;cursor: pointer;}#videos-footer #music-radio{left: 0;border-radius: 12px;background: #101314;}#videos-footer:hover #videos-footer-youtube,#videos-footer:hover #videos-footer-soundcloud,#videos-footer:hover #music-radio{visibility: visible}#videos-footer:hover{cursor: pointer;-webkit-box-shadow: inset 0 0 20px #53b6ef;box-shadow: inset 0 0 20px 0 #53b6ef;}#videos-footer{cursor:pointer;top: calc(30% + 119px);display:block;padding: 2px 0 0 11px;text-shadow: -1px 0 black,0 1px black,1px 0 black,0 -1px black;font: 800 14px sans-serif;color: #FFFFFF;left: unset;right: -70px;height: 22px;min-height: 22px;z-index: 2;width: 70px;position: absolute;}#videos-footer-broadcast{border-radius:unset;z-index: 1;padding: unset!important;white-space: pre}#videos-footer-broadcast-wrapper{z-index: 0;visibility: visible;height: 50px;min-height: 50px;width: 400px;padding: unset;right: 0;left: unset;position: fixed;top: calc(30% + 34px)}span[title="Settings"]>svg{padding:4px;height:24px;width:24px}#seek-duration{pointer-events: none;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font: 600 20px sans-serif}#videos{bottom: 0;left: 0;right: 0;top: 0}:host,#videolist{background:unset!important;}.video:after{content: unset;border:unset;}#videos-header-mic>svg{padding: 2px 10px;}#videos-header{z-index: 3;background:#101314;transition: none;left: unset;right: 0;width: 400px;top: calc(30%);position: fixed;max-height: 34px;min-height: 34px;}#videos-header>span{display:block;line-height: unset;}#videos-header-sound>svg{padding: 4px}#videos-header-fullscreen > svg {padding: 7px 8px;}';
      RoomCSS =
        "tc-title{display:flex!important;}#room{padding:0!important;}#room-content{padding-top:0!important;background:unset!important;}";
      TitleCSS =
        "#room-header-avatar{display:none}#room-header-gifts{display:none}#room-header-info-text{display:none}#room-header-info-details{display:none}#room-header-mobile-button{display:none}#room-header{border:unset;z-index:1;min-height:36px!important;max-height:36px!important;min-width:400px;max-width:400px;top:calc(30% + 84px);right:0;position:fixed;background: linear-gradient(0deg,rgb(0, 19, 29)0%,rgba(0, 0, 0, 0.85)50%,rgb(9, 41, 57)100%);}#room-header-info>h1{height:100%;top: unset;left: unset;right: unset;text-transform:uppercase;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:600 20px sans-serif;color:#FFFFFF;}#room-header-info>h1:after{content:unset;}#room-header-info {padding: 7px 0 0 6px!important;box-sizing: border-box;width: 100%!important;top: 0!important;left: 0!important;right: 0!important;}#room-he#room-header-info>span{right: 8px;position: absolute;top:7px;margin-top:0!important;}";
      SideMenuCSS =
        "#playerYT{background: black;border-radius: 3px;}:host, #videolist{z-index:0;}.overlay .volume{background: #2a6a89;}.overlay .volume, .overlay .duration{height: 6px;width: 100%;line-height: 24px;overflow-wrap: break-word;white-space: nowrap;overflow: hidden;text-overflow: ellipsis}.overlay .duration{background:#9a0000;}.overlay button:hover{background: #53b6ef;cursor: pointer;}.overlay button{outline: none;line-height: 14px;background: #101314;border: none;font-size: 18px;color: white;height: 28px;width: 34px;}#player{pointer-events:none; width:100%;}#close-users{display:none!important;}#user-info{display:none;}#top-buttons-wrapper{display:none;}@media screen and (max-width: 600px) {#sidemenu {top:unset;z-index:2;padding-bottom:0;margin-top:0;}}#sidemenu-wider{display:none;}#sidemenu-content::-webkit-scrollbar{width:0;background:transparent;}#sidemenu{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:300 20px sans-serif;left:unset!important;right:0!important;padding-bottom:0;height:30%!important;min-width:400px;max-width:400px;}#sidemenu-content{scrollbar-width:none;padding-top:unset;}";
      NotificationCSS =
        "#youtube.video{min-height:unset;min-width:unset;}#videos-header > span {background-color: unset!important;line-height: unset;}.PMTime{display:inline-block;padding:0 6px 0 0;margin:0 8px 0 0;border-right:4px groove #797979;}.PMName{display:inline-block;}#popup div{word-break: break-word;white-space: pre-line;word-wrap: break-word;user-select: text;-webkit-user-select: text;-moz-user-select: text;color:#FFFFFF;text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font-weight: 300;font-size: 18px;font-family: sans-serif;z-index:1;}.PMOverlay{height: calc(100% - 92px);overflow: hidden;pointer-events:none;position:absolute;padding-top:12px;top:0;bottom:0;left:0;right:0;visibility:visible;}.PMPopup{pointer-events:all;margin:5px auto;width:50%;position:relative;color: #FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}.PMPopup a, .PMPopup a:visited, .PMPopup a:hover, .PMPopup a:active{position:relative;transition:0.5s color ease;text-decoration:none;color:#53b6ef}.PMPopup a:hover{color:#FFFFFF;text-decoration:underline;}.PMPopup h2{border-radius:5px 5px 0 0;background:linear-gradient(0deg,rgb(24, 29, 30) 0%,rgb(24, 29, 30) 52%,rgb(60, 117, 148) 100%);margin:0;padding:5px;font-size:16px;}.PMPopup .PMContent {border-radius: 0 0 5px 5px;padding:5px;max-height:30%;overflow:hidden;word-break:break-all;background:#202628;}";
      UserListCSS =
        '#userlist{padding-bottom:40px;}.list-item>span>span[data-cam="1"]:after{height:15px;width:15px;background-image:url(https://i.imgur.com/QKSbq8d.png);}.list-item>span>span[data-moderator="1"]:before{margin-right:3px;width:15px;height:15px;background-image:url(https://i.imgur.com/CEA9aro.png);}.list-item>span>span{background:transparent;box-shadow:none;}.list-item>span>span>.send-gift{top:4px;}.list-item>span>img{top:6px;}.list-item>span[data-status="gold"]:before,.list-item>span[data-status="extreme"]:before,.list-item>span[data-status="pro"]:before{top:5px;}#userlist>div{height:22px;}#userlist>div>span{color:#FFFFFF;font:bold 16px sans-serif;height:22px;line-height:22px;}#userlist>#header{height:40px;top:10px;}#contextmenu {top:unset!important;bottom:0!important;right:0!important;left:0!important;}';
      ModeratorCSS =
        '.video{width:350px}.video > div > .overlay{background-color:unset;}.video:hover{max-width:unset;}#moderatorlist:after{right:5px;color:#FFFFFF;background:#53b6ef;}#moderatorlist>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist>#header>span>button{top:-2px;background: #20262870;}#moderatorlist.show>#header>span>button>svg path{fill:#FFFFFF;}#moderatorlist{margin: 5px;max-height:60px;}#moderatorlist>#header{height: 60px;color: #FFFFFF;border-radius: unset;line-height: 22px;}#moderatorlist.show[data-videos-count="1"], #moderatorlist.show[data-videos-count="2"],#moderatorlist.show[data-videos-count="3"],#moderatorlist.show[data-videos-count="4"],#moderatorlist.show[data-videos-count="5"],#moderatorlist.show[data-videos-count="6"],#moderatorlist.show[data-videos-count="7"],#moderatorlist.show[data-videos-count="8"],#moderatorlist.show[data-videos-count="9"],#moderatorlist.show[data-videos-count="10"],#moderatorlist.show[data-videos-count="11"],#moderatorlist.show[data-videos-count="12"]{max-height:326px;max-width:350px;}';
      ContextMenuCSS =
        '.context[data-mode="dark"] > span:hover{background-color:#04caff;}.context.show{height:100%;}.context:after{content:unset;}.context>span{text-shadow:-1px 0 black,0 1px black,1px 0 black,0 -1px black;font:800 14px sans-serif;color:#FFFFFF;display:inline-block;padding:1px 1%;line-height:17px;height:17px;}.context{background:#101314;position:unset;padding:0;height:0;transition:.25s;}';
    }
    //INITIATE
    CTSInit();
    function CTSInit() {
      //INITIATE CTS
      var err_out = 0;
      CTS.ScriptLoading = setInterval(function () {
        err_out++;
        if (document.querySelector("tinychat-webrtc-app")) {
          if (document.querySelector("tinychat-webrtc-app").shadowRoot)
            CTSRoomInject();
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
        new MutationObserver(function () {
          this.disconnect();
          CTSWebSocket();
        }).observe(document, {
          subtree: true,
          childList: true
        });
      }
      //FULLY LOADED -> RUNALL
      CTS.FullLoad = setInterval(function () {
        if (CTS.ScriptInit && CTS.SocketConnected) {
          clearInterval(CTS.FullLoad);
          if (CTS.Me.mod) {
            if (CTS.Bot) CheckHost();
            if (CTS.Room.YT_ON)
              VideoListElement.querySelector(
                "#videos-footer>#videos-footer-youtube"
              ).style.cssText = "display:block;";
            if (CTS.Room.YT_ON && CTS.Project.isTouchScreen)
              VideoListElement.querySelector(
                "#videos-footer>#videos-footer-youtube"
              ).classList.toggle("hidden");
            //VideoListElement.querySelector("#videos-footer>#videos-footer-soundcloud").style.cssText = "display:block;";
            VideoListElement.querySelector("#button-banlist").setAttribute(
              "style",
              "display: block;"
            );
          }
          //PTT AUTO
          if (CTS.Room.PTT) {
            VideoListElement.querySelector(
              "#videos-footer-push-to-talk"
            ).addEventListener(
              "mouseup",
              function (e) {
                e = e || window.event;
                if (e.which == 1) CTS.AutoMicrophone = false;
                if (e.which == 1 && e.ctrlKey === true)
                  CTS.AutoMicrophone = !CTS.AutoMicrophone;
                if (e.which == 2) CTS.AutoMicrophone = !CTS.AutoMicrophone;
              },
              {
                passive: true
              }
            );
          }
          //FAVORITE ROOM
          var favorited_rooms = "",
            len = CTS.FavoritedRooms.length,
            script = document.createElement("script"),
            elem = document.getElementsByTagName("script")[0];
          script.text =
            'function AddFavorite(obj, index) {\n var val = JSON.parse(localStorage.getItem("' +
            CTS.Project.Storage +
            'FavoritedRooms"));\n val[index]=["' +
            CTS.Room.Name +
            '"];\n localStorage.setItem("' +
            CTS.Project.Storage +
            'FavoritedRooms", JSON.stringify(val));\n obj.href ="https://tinychat.com/room/' +
            CTS.Room.Name +
            '";\n obj.innerText = "' +
            CTS.Room.Name +
            '";\n obj.onclick = null;\n return false;\n}';
          elem.parentNode.insertBefore(script, elem);
          for (var i = 0; i < len; i++)
            favorited_rooms +=
              CTS.FavoritedRooms[i] !== null
                ? "<span>#" +
                  (i + 1) +
                  ' <a href="https://tinychat.com/room/' +
                  CTS.FavoritedRooms[i] +
                  '">' +
                  CTS.FavoritedRooms[i] +
                  "</a></span>"
                : "<span>#" +
                  (i + 1) +
                  ' <a href="#" onclick="return AddFavorite(this,' +
                  i +
                  ');">ADD ROOM</a></span>';
          ChatLogElement.querySelector("#input").insertAdjacentHTML(
            "afterbegin",
            '<div id="header-user"><label id="label-user" for="input-user"><img class="switcher" src="' +
              (CTS.Me.avatar
                ? CTS.Me.avatar
                : "https://avatars.tinychat.com/standart/small/eyePink.png") +
              '"></label><input type="checkbox" id="input-user" hidden=""><div id="user-menu"><span id="nickname">FAVORITED ROOMS</span>' +
              favorited_rooms +
              '<span id="title">' +
              CTS.Me.username +
              '</span><span><a href="https://tinychat.com/settings/gifts"> My Gifts</a></span><span><a href="https://tinychat.com/settings/profile">Profile</a></span><span><a href="https://tinychat.com/room/' +
              CTS.Me.username +
              '">My Room</a></span><span><a href="https://tinychat.com/#">Directory</a></span></div></div>'
          );
          //RECENT GIFTS
          var recent_gifts = "\n";
          for (var g = 0; g < CTS.Room.Recent_Gifts.length; g++)
            recent_gifts += '<img src="' + CTS.Room.Recent_Gifts[g] + '" />';
          //ALERT
          Settings(
            "<center><u>" +
              CTS.Room.Name.toUpperCase() +
              "</u>" +
              (CTS.Room.Avatar ? '\n<img src="' + CTS.Room.Avatar + '">' : "") +
              "\n" +
              CTS.Room.Bio +
              '\n<a href="' +
              CTS.Room.Website +
              '" target="_blank">' +
              CTS.Room.Website +
              "</a>" +
              (recent_gifts != "" ? recent_gifts : "") +
              "\n\nROOM CONFIGURATION:\nYouTube Mode: " +
              (CTS.Room.YT_ON ? "ON" : "OFF") +
              "\n\n</center>"
          );
          CTS.ShowedSettings = true;
          AddUserNotification(
            2,
            CTS.Me.namecolor,
            CTS.Me.nick,
            CTS.Me.username,
            false
          );
          var tag = document.createElement("script");
          tag.text =
            "var tag = document.createElement('script');\ntag.src = \"https://www.youtube.com/iframe_api\";\nvar firstScriptTag = document.getElementsByTagName('script')[0];\nfirstScriptTag.parentNode.insertBefore(tag, firstScriptTag);";
          document.body.appendChild(tag);
          //FEATURE LAUNCH
          SoundMeter();
          Reminder();
          PerformanceModeInit(CTS.PerformanceMode);
        }
      }, 500);
    }
    function CTSHomeInject() {
      var HomeCSS =
        '@media screen and (max-width: 1000px){.nav-menu {background-color: #181e1f;}}.nav-sandwich-menu-button{background-color:unset;}#modalfree-wrapper{display: none;}.tile-header > img {transition:unset;}.tile-favroom-opt{cursor:pointer;position: absolute;right: 0;top: 0;padding: 1px;background:#10131494;}.tile-favroom-opt:hover{background:#ff00008c;}#content{padding-bottom:unset;}.tile-content{height:180px;}.cts-footer-contents .tile-info{height:20px}.cts-footer-contents .tile-header>img{cursor:pointer;height: 220px;}.tile-header>img{height: 230px;width: 100%;max-width: 100%;}.cts-footer:hover .cts-footer-contents .tile{font-size: 18px;font-weight: 800;width:20%;display:inline-block;}.cts-footer-contents .tile {background: #00a2ff;text-align: center;border:unset;height:unset;display:none;margin: unset;}.cts-footer {background:#10131494;width: 100%;position: fixed;bottom: 0;left: 0;}#catalog > div {display: inline-block;padding: 5px;box-sizing: border-box;}.tile[data-status="pro"], .tile[data-status="extreme"], .tile[data-status="gold"] {margin-top: 12px;}.tile-header {border-radius: 12px 12px 0 0;}#promoted .tile-header > img{width:100%;}#navigation > label{border-radius:12px;}#welcome>div{padding-top:0}.tile-statistic{padding-top:0;padding-bottom:4px;background: #000000a6;}.tile-name{padding-top:unset;}#promote-button{border-radius: 12px 12px 0 0;}tile-name{padding-top:unset;}.tile-info{bottom:unset;top:0;height:28px;}.cts-footer > h2, #promoted-wrapper > h2, #trended-wrapper > h2, #header-for-all{text-align: center;font-size: 30px;font-weight: 800;}body{background:' +
        CTS.MainBackground +
        ';background-size:cover;background-attachment: fixed;}.tile-content-info-icon > img {display:none;}.tile-content-info{font-size: 14px;font-weight: 600;}#promoted .tile-content-info-text{word-break: break-word;max-height:95px;}.tile{border:2px solid #fff;margin-top: 13px;height:425px;}#loadmore-no-more {background:#101314;}.tile-content > img{display:none;}#welcome-wrapper{background: #10131494;border-bottom:unset;}#loadmore{background: #00a2ff;font-weight: 600;}#user-menu{background: #101314;}#nav-static-wrapper {-webkit-box-shadow: 0 0 20px 17px #53b6ef;box-shadow: 0 0 20px 17px #53b6ef;background:#101314;}#up-button:hover > #up-button-content {background: #10131459;}#nav-fixed{border-bottom:unset;}#nav-fixed-wrapper{-webkit-box-shadow: 0 0 20px 17px #53b6ef;box-shadow: 0 0 20px 17px #53b6ef;background: #101314;}#nav-static {border-bottom:unset;}#welcome{padding:12px 30px 24px;}.tile{border-radius: 12px;background: #101314b3;}div, span, a, h1, h2, h3, h4, h5, h6, p {text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;color: #FFFFFF!important;}#promoted-wrapper > div, #trended-wrapper > div {background: #00a2ff;border-radius: 12px;}.tile-content-info-text {word-break: break-word;width:100%;}.tile-content-info.with-icon {display: contents;}#navigation > label:not([for="input-catalog-navigation"]) {font-weight:600;background: #000000;}';
      //INSERT HTML/CSS
      document.body
        .querySelector("style")
        .insertAdjacentHTML("beforeend", HomeCSS);
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div class="cts-footer"><h2>FAVORITED ROOMS</h2><div class="cts-footer-contents"></div></div>'
      );
      //INSERT SCRIPT
      var script = document.createElement("script"),
        elem = document.getElementsByTagName("script")[0];
      script.text =
        'function RemoveFavorite(obj, index) {\n	var val = JSON.parse(localStorage.getItem("' +
        CTS.Project.Storage +
        'FavoritedRooms"));\n	val[index]=null;\n	localStorage.setItem("' +
        CTS.Project.Storage +
        'FavoritedRooms", JSON.stringify(val));\n	return obj.parentNode.parentNode.remove();\n}';
      elem.parentNode.insertBefore(script, elem);
      var len = CTS.FavoritedRooms.length;
      for (var i = 0; i < len; i++)
        document.body
          .querySelector(".cts-footer-contents")
          .insertAdjacentHTML(
            "beforeend",
            CTS.FavoritedRooms[i] !== null
              ? '<div class="tile" data-room-name="' +
                  CTS.FavoritedRooms[i] +
                  '">Favorite #' +
                  (i + 1) +
                  ' <div class="tile-header"><img id="tile-header-image" src="https://upload.tinychat.com/pic/' +
                  CTS.FavoritedRooms[i] +
                  '")' +
                  '" onload="MasonryTails.Refresh();" onclick="locationTo(\'/room/' +
                  CTS.FavoritedRooms[i] +
                  '\');"><div class="tile-info"><div class="tile-favroom-opt" onclick="RemoveFavorite(this,' +
                  i +
                  ')">X</div><div class="tile-name">' +
                  CTS.FavoritedRooms[i] +
                  '</div><div class="tile-statistic"><svg width="18" height="14" viewBox="0 0 18 14" xmlns="https://www.w3.org/2000/svg"><path d="M9.333 5.667c0-.367-.3-.667-.666-.667h-8C.3 5 0 5.3 0 5.667v6.666C0 12.7.3 13 .667 13h8c.366 0 .666-.3.666-.667V10L12 12.667V5.333L9.333 8V5.667z" transform="translate(3 -3)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span><svg width="20" height="16" viewBox="0 0 20 16" xmlns="https://www.w3.org/2000/svg"><path d="M57 4c-3.182 0-5.9 2.073-7 5 1.1 2.927 3.818 5 7 5s5.9-2.073 7-5c-1.1-2.927-3.818-5-7-5zm0 8.495c1.93 0 3.495-1.565 3.495-3.495 0-1.93-1.565-3.495-3.495-3.495-1.93 0-3.495 1.565-3.495 3.495 0 1.93 1.565 3.495 3.495 3.495zm0-1.51c1.096 0 1.985-.89 1.985-1.985 0-1.096-.89-1.985-1.985-1.985-1.096 0-1.985.89-1.985 1.985 0 1.096.89 1.985 1.985 1.985z" transform="translate(-47 -2)" fill="#fff" fill-rule="evenodd"></path></svg><span>0</span></div></div></div></div>'
              : '<div class="tile">Favorite #' + (i + 1) + "</div>"
          );
      //SCRIPT INIT -> PREPARE()
      clearInterval(CTS.ScriptLoading);
      CTS.ScriptInit = true;
      CTSHomePrepare();
    }
    function CTSHomePrepare() {
      //FUNCTION BYPASS
      window.ModalFreeTrialPro = function () {};
      //REMOVE
      Remove(document, "#footer");
      Remove(document, ".nav-logo");
    }
    function CTSRoomInject() {
      if (window.CFG == null) {
        //Backup config if alt script isn't loaded
        var CFG = {
          greetPeople: true,
          alwaysGreetPeople: true,
          greetDelay: "9000",
          // 9 seconds delay before greeting
          greetCooldown: 300000,
          // 5 minutes cooldown instead of 20 minutes
          greetWbTime: 600000,
          // 10 minutes instead of 36 minutes
          followupChance: 1,
          customGreetings: {
            USERNAME: "nickname"
          },
          Welcomes: [
            "Heyyy 👋😎",
            "Nǐ hǎo! 🌟👋",
            "Good to see you! 😊✨",
            "Hey! 👋😄",
            "Yooo! 😎🙌",
            "Yo! 👋😎",
            "Good to see you! 😊🌟",
            "Cześć! 🇵🇱👋",
            "Salut! 🇫🇷💫",
            "Hola! 🇪🇸🎉",
            "Good day! 🌞👌",
            "Olá! 🇵🇹😃",
            "Guten tag! 🇩🇪👋",
            "G'day! 🇦🇺👋",
            "Kon'nichiwa! 🇯🇵🌸",
            "Ahoj! 🇨🇿🎉",
            "Hallo! 🇩🇪🎈",
            "Hallå! 🇸🇪👋",
            "Halò! 🇮🇹🌟",
            "Kamusta! 🇵🇭😊",
            "Halló! 🇮🇸💬",
            "Ciao! 🇮🇹🌟",
            "Hei! 🇳🇴👋",
            "Welcome! 🎉👋",
            "Greetings! 🙌🌟",
            "Hi there! 👋😃",
            "Hello! 🌟😊",
            "Howdy! 🤠👋",
            "Bonjour! 🇫🇷✨",
            "Aloha! 🌺👋",
            "Shalom! 🇮🇱😊",
            "Namaste! 🙏🌟",
            "What's crackin'? 🔥👋",
            "Sup? 😎👋",
            "Hiya! 😊🙋‍♂️",
            "Greetings and salutations! 👋✨",
            "Top of the mornin' to ya! ☀️😄",
            "Pleasure to see you! 😃🎉",
            "Well hello there! 👋😎",
            "Look who's here! 👀😃",
            "Fancy meeting you here! 😲👋",
            "G'day mate! 🇦🇺😎",
            "Ahoy there! ⚓👋",
            "Konbanwa! 🇯🇵🌟",
            "Pleased to meet ya! 😁🎉",
            "How's it hangin'? 😎👋",
            "Wazzup? 🤙😄",
            "Privet! 🇷🇺👋",
            "Здравствуйте! 🇷🇺🎉",
            "你好! 🇨🇳✨",
            "Welcome aboard! 🚢👋",
            "Glad you could make it! 😊🎉",
            "Hello, sunshine! 🌞😊",
            "Hey, good lookin'! 😎💫",
            "Salutations! 👋🌟",
            "Long time no see! 😄👋",
            "What's the word? 🗨️😎",
            "How do you do? 😃👋",
            "Howdy-doody! 🤠👋",
            "Hey, stranger! 👋😲",
            "Look what the cat dragged in! 🐱👋",
            "Well, well, well! 😲👋",
            "Aloha, friend! 🌺👋",
            "Greetings, Earthling! 👽🌍",
            "Welcome to our humble abode! 🏡👋",
            "Ahoy, matey! ⚓😎",
            "Hail and well met! 👋🌟",
            "Top o' the mornin'! ☀️😄",
            "Well aren't you a sight for sore eyes! 👀😊",
            "Lovely to see you! 🌟😊",
            "Welcome to the party! 🎉👋",
            "Bienvenue! 🇫🇷🎉",
            "Willkommen! 🇩🇪👋",
            "Ayy, it's lit! 🔥😎",
            "What's good, fam? 👋😃",
            "Ey up, me duck! 🦆😄",
            "Wassup, homie? 😎👋",
            "Hey, bud! 👋😄",
            "What's poppin'? 😎🎉",
            "Yo, pass the peace pipe! 🚬✌️",
            "Greetings, fellow traveler! 🌍👋",
            "Welcome to the circle! 🔄🎉",
            "Ayyy, look who rolled in! 🚗👋",
            "Cheers, mate! 🍻😄",
            "Hey, high roller! 🎲😎",
            "Welcome to the green room! 🎤🌿",
            "Salud! 🍹😃",
            "Prost! 🍻🌟",
            "Sláinte! 🍀😊",
            "Na zdrowie! 🍷🎉",
            "Kanpai! 🍶😄",
            "L'chaim! 🍷😃",
            "Bottoms up! 🍹👋",
            "Welcome to the smoke spot! 🚬😎",
            "Ayy, it's time to blaze! 🔥🌟",
            "Welcome to the chill zone! 🛋️😄",
            "Hey, fellow toker! 🚬👋",
            "What's the buzz? 🐝😎",
            "Welcome to the hotbox! 🚬🔥",
            "Ay, it's 420 somewhere! 🌍🚬",
            "Welcome to the dank side! 🍁😎",
            "Yo, hit this! 🚬👋",
            "Hey, wanna smoke? 🚬😄",
            "Welcome to flavor country! 🌶️😎",
            "Ayyy, pass it to the left! 🚬✌️",
            "Welcome to the green team! 🌿👋",
            "Hey, got a light? 💡🚬",
            "Welcome to the high life! 😎🌟",
            "Yo, spark it up! 🚬🔥",
            "Hey, fellow ent! 🌿👋",
            "Welcome to the pineapple express! 🍍🚂",
            "Ayy, let's get zooted! 🌿🚀",
            "Welcome to the joint session! 🚬🎉",
            "Hey, wanna chief? 🚬👋",
            "Welcome to the baked brigade! 🌿😎",
            "Yo, it's dab o'clock! 💨🕒",
            "Hey, ready to elevate? 🚀🌟",
            "Welcome to the kush kingdom! 🌿👑",
            "Ayy, let's get twisted! 🌪️😄",
            "Welcome to the tipsy tribe! 🍹👋",
            "Hey, shots shots shots! 🥃🎉",
            "Welcome to the booze cruise! 🚢🍹",
            "Yo, let's get sloshed! 🍻😎",
            "Hey, time to tie one on! 🍸👋",
            "Welcome to the gin joint! 🍸😄",
            "Ayy, it's wine o'clock! 🍷🕒",
            "Welcome to the beer garden! 🍺🌿",
            "Hey, fancy a pint? 🍺😊",
            "Welcome to the cocktail hour! 🍹🕒",
            "Yo, let's raise some hell! 🔥😎",
            "Hey, bottoms up, buttercup! 🍹👋",
            "Welcome to the whiskey business! 🥃😄",
            "Ayy, let's get this party started! 🎉🚀",
            "Welcome to the rum runners! 🏃‍♂️🍹",
            "Hey, care for a nightcap? 🍸🌙",
            "Welcome to the tequila sunrise! 🌅🍹",
            "Yo, it's martini time! 🍸🕒",
            "Hey, shall we wine and dine? 🍷🍽️",
            "Welcome to the vodka revolution! 🍸🚀",
            "Ayy, let's paint the town red! 🎨🌆"
          ],
          FollowUps: [
            "What's poppin'? 😎🌟",
            "Got any plans? 🤔🎉",
            "How’s life treating ya? 😄🌟",
            "What’s good, fam? 👋✨",
            "How’s it hanging? 😎🎉",
            "What's the vibe today? 🌟🎶",
            "Any exciting news? 😄🎉",
            "What's the scoop? 📰😎",
            "What’s the haps? 😃🌟",
            "How's the grind? 💪✨",
            "What’s up next? 🚀😎",
            "Anything new? 🤔🌟",
            "What’s shaking? 🍹🎉",
            "Got any updates? 🗣️✨",
            "What’s the 411? 📞😄",
            "How's your day? 😊🌞",
            "Got any cool stories? 📖😎",
            "What’s the word on the street? 🗣️🎉",
            "What’s the latest? 📰✨",
            "How’s everything going? 😊🎉",
            "What’s the dealio? 🤔🌟",
            "Any new jams? 🎶😎",
            "What’s on your radar? 🌟🚀",
            "How’s the hustle? 💪✨",
            "What’s the latest buzz? 🐝😄",
            "Anything exciting happening? 🎉😎",
            "What’s cooking? 🍳🎉",
            "How’s the week treating ya? 📅😄",
            "Any fun plans ahead? 🎉🚀",
            "What’s the latest and greatest? 🌟😎",
            "Got any new goals? 🎯✨",
            "What’s the hot topic? 🔥😄",
            "Anything interesting? 🤔🎉",
            "What’s the lowdown? 🗣️✨",
            "Got any cool adventures? 🌍😎",
            "What’s the latest scoop? 🗞️🎉",
            "Any exciting developments? 🚀✨",
            "How’s your journey going? 🌟😊",
            "What’s the fresh news? 🗞️😄",
            "How’s everything shaping up? 🛠️🌟",
            "Any new discoveries? 🔍😎",
            "What’s new and exciting? 🎉🌟",
            "Got any fresh plans? 📅😄",
            "What’s on your agenda? 🗓️✨",
            "Any cool updates? 😎🌟",
            "How’s your day shaping up? 🌞😊",
            "What’s the latest with you? 📣😄",
            "Any exciting news to share? 🌟🎉",
            "What’s on your mind? 🤔✨",
            "Got any fun events coming up? 🎉😎",
            "What’s the buzz around here? 🐝🌟",
            "How’s your week going? 📅😄",
            "What’s the latest hype? 🔥😎",
            "Any interesting updates? 🗞️✨",
            "What’s new with you? 😄🌟",
            "Got any new interests? 🎨😎",
            "What’s your next move? 🚀🎉",
            "Any fresh ideas? 💡✨",
            "What’s the latest trend? 🌟😎",
            "How’s your adventure going? 🏞️😊",
            "Got any new projects? 🛠️😄",
            "What’s the freshest news? 🗞️🌟",
            "Any new and exciting goals? 🎯✨",
            "How’s everything in your world? 🌍😎",
            "What’s your latest obsession? 😍🎉",
            "Got any new hobbies? 🎨🌟",
            "What’s the current buzz? 🔥😄",
            "How’s your week treating you? 📅😊",
            "Got any cool updates? 😎🎉",
            "What’s the latest scoop around here? 🗞️✨",
            "Any new and exciting things happening? 🌟🎉",
            "How’s everything on your end? 😊🌟"
          ],
          WelcomeBacks: [
            "Welcome back, superstar! 🌟🚀",
            "Hey there, legend! 😎✨",
            "Look who’s back! 🙌🎉",
            "What’s up, champ? 🏆🌟",
            "Hey, hey, welcome back! 👋😄",
            "Welcome back, rockstar! 🎸🌟",
            "Glad to see you again! 😊✨",
            "Look who’s here! 🌟🎉",
            "Welcome back, awesome one! 😎🎉",
            "Hey, welcome back! 🌟😄",
            "Guess who’s back? 🎉🙌",
            "Welcome back, trailblazer! 🚀🌟",
            "Nice to have you back! 😄✨",
            "Hey, you’re back! 👋🌟",
            "Welcome back, hero! 🦸‍♂️🎉",
            "So glad to see you again! 😊🌟",
            "Welcome back, VIP! 🎉✨",
            "Hey, look who’s back! 😎🎉",
            "Welcome back, friend! 🤗🌟",
            "Awesome to have you back! 😄🚀",
            "Welcome back, superstar! 🌟🎉",
            "Hey, glad you’re back! 👋✨",
            "Welcome back, ace! 😎🌟",
            "It’s great to see you again! 😊🎉",
            "Welcome back, legend! 🌟🎉",
            "Hey there, welcome back! 🙌✨",
            "Welcome back, star player! 🌟🚀",
            "So nice to see you again! 😊🎉",
            "Hey, welcome back, champ! 🏆✨",
            "Glad you’re here! 😄🌟",
            "Welcome back, rockstar! 🎸🎉",
            "Great to have you back! 😊✨",
            "Welcome back, top dog! 🐶🌟",
            "Hey, welcome back! 👋😎",
            "Nice to see you again, superstar! 🌟🎉",
            "Welcome back, star! 🌟✨",
            "Hey, welcome back! 🙌😄",
            "Glad you’re back with us! 🌟🚀",
            "Welcome back, friend! 🤗🎉",
            "So happy to see you again! 😊🌟",
            "Welcome back, legend! 🎉✨",
            "Hey there, welcome back! 👋🌟",
            "Welcome back, ace! 😎🎉",
            "Great to see you again! 😄🚀",
            "Welcome back, superstar! 🌟🎉",
            "Hey, welcome back! 🙌✨",
            "Glad to have you back! 😊🌟",
            "Welcome back, champ! 🏆🎉",
            "Nice to see you back here! 😄🚀",
            "Welcome back, top player! 🌟✨",
            "Hey, welcome back! 👋🎉",
            "So glad you’re here again! 😊🌟",
            "Welcome back, hero! 🦸‍♂️✨",
            "Great to see you again, superstar! 🌟🎉",
            "Welcome back, legend! 🌟🚀",
            "Hey, welcome back! 🙌🎉"
          ],
          appendBackgroundImages: true,
          backgroundImages: []
        };
        window.CFG = CFG;
      }

      // PUBLIC / ADDON GRABBERS
      window.CTSRoomVolume = 1;
      window.CTSMuted = false;
      window.CTSImages = [
        "https://mir-s3-cdn-cf.behance.net/project_modules/1400/9bc27292880429.5e569ff84e4d0.gif",
        "https://wallpapercave.com/wp/wp2760959.gif",
        "https://i.pinimg.com/originals/55/fb/ff/55fbffb51b0c162a2ece528152832418.gif",
        "https://images5.alphacoders.com/880/880175.jpg",
        "https://images3.alphacoders.com/112/1120921.jpg",
        "https://images5.alphacoders.com/829/829971.jpg",
        "https://images8.alphacoders.com/829/829728.jpg",
        "https://images.alphacoders.com/925/925465.png",
        "https://images7.alphacoders.com/829/829969.jpg",
        "https://images.alphacoders.com/120/1208599.png",
        "https://images.alphacoders.com/914/914666.png",
        "https://wallpapercave.com/wp/wp5696451.jpg",
        "https://wallpapercave.com/wp/wp5696457.jpg",
        "https://wallpapercave.com/uwp/uwp4452397.jpeg",
        "https://wallpapercave.com/uwp/uwp4451869.jpeg",
        "https://wallpapercave.com/wp/wp5696495.jpg",
        "https://wallpapercave.com/wp/wp2339750.jpg",
        "https://wallpapercave.com/wp/wp2339752.jpg",
        "https://wallpapercave.com/wp/wp2339754.jpg",
        "https://wallpapercave.com/wp/wp1860528.jpg",
        "https://wallpapercave.com/wp/wp2339756.jpg",
        "https://wallpapercave.com/wp/wp2339757.jpg",
        "https://wallpapercave.com/wp/wp2339759.jpg",
        "https://wallpapercave.com/wp/wp2339765.jpg",
        "https://wallpapercave.com/wp/wp2339767.jpg",
        "https://wallpapercave.com/wp/wp2339770.jpg",
        "https://wallpapercave.com/wp/wp2339775.jpg",
        "null"
      ];
      if (window.CFG.backgroundImages.length > 0) {
        if (window.CFG.appendBackgroundImages) {
          window.CTSImages = window.CTSImages.concat(
            window.CFG.backgroundImages
          );
        } else window.CTSImages = window.CFG.backgroundImages;
      }
      window.CTSEightBall = [
        "Stop bugging me, will ya? 😤",
        "It’s a sure thing, my friend. 👍",
        "Oh, definitely! 🎉",
        "No doubt about it! ✅",
        "Yes, for sure! 💯",
        "You can count on it. 📈",
        "It’s looking good! 🌟",
        "You betcha! 😎",
        "Signs are all pointing to yes! 👀",
        "Outlook is bright! ☀️",
        "You got it! 🎯",
        "Absolutely yes! 🙌",
        "You’re on the right track! 🚂",
        "Looks like a yes to me! 👌",
        "Sure thing, partner! 🤠",
        "That’s a big yes! 🥳",
        "Everything’s pointing your way! 🎯",
        "Yep, you’re in luck! 🍀",
        "Oh, the stars are aligned! 🌌",
        "Definitely a yes! 👍",
        "Looks promising! 🤩",
        "You’ve got my approval! 🆗",
        "Yes, with a capital Y! 🎉",
        "Spot on! 🎯",
        "I’d say yes, for sure! 🥳",
        "All signs say yes! ✅",
        "Most definitely! 🌟",
        "The outlook is sunny! ☀️",
        "Yes, indeed! 🙌",
        "It’s a thumbs up! 👍",
        "Everything's coming up roses! 🌹",
        "That’s a big ol' yes! 👏",
        "Looks like you’re winning! 🏆",
        "Yes, with extra sparkle! ✨",
        "Feeling pretty good about this! 😊",
        "You’re on the winning side! 🥇",
        "Yes, absolutely! 🎉",
        "It’s a green light! 🚦",
        "You’re golden! 🏅",
        "Yes, no doubt! ✅",
        "Definitely yes, with a smile! 😄",
        "The answer is a joyful yes! 😃",
        "It’s a happy yes! 😁",
        "Yep, you’re good to go! 🚀",
        "That’s a resounding yes! 📣",
        "Yes, indeed, with enthusiasm! 🤩",
        "Everything’s coming up yes! 🌟",
        "Yes, yes, yes! 🎉",
        "All signs are a big yes! ✅",
        "The universe says yes! 🌌",
        "Oh, absolutely! Like a boss. 👊",
        "For sure, with a side of awesome. 😎",
        "Definitely yes, no questions asked! 🏅",
        "Totally yes, with a cherry on top. 🍒",
        "Yes, with an exclamation point! ❗",
        "Yup, you’re golden like a trophy. 🏆",
        "Yes, with a sparkle and a wink! 😉",
        "The stars have officially aligned! 🌠",
        "You’ve hit the jackpot of yes! 💰",
        "Yes, like a rock star! 🎸",
        "Oh yes, and don’t you forget it! 🙌",
        "Absolutely yes, and then some! 🌟",
        "Yes, with a side of pizzazz. ✨",
        "All signs say yes, and they’re flashing! 🚨",
        "The answer is yes, and it’s dancing! 💃",
        "Yes, with a side of confetti! 🎊",
        "Definitely yes, with a twirl! 💫",
        "Yes, and it’s got glitter! ✨",
        "You’re riding high on a yes wave! 🌊",
        "Yes, with all the fanfare! 🎺",
        "The universe has rolled out the red carpet for you! 🎟️",
        "Yes, with a bow and a flourish! 🎀",
        "The answer is yes, and it’s singing! 🎵",
        "Oh yes, like a victory dance! 💃",
        "Absolutely yes, with jazz hands! 🎷",
        "Yes, and it’s doing a happy jig! 🕺",
        "Yes, and it’s wearing party hats! 🎉",
        "Totally yes, with a big high five! 🖐️",
        "Yes, with a thumbs-up and a grin! 😁",
        "Definitely yes, with fireworks! 🎆",
        "Yes, and it’s throwing a parade! 🎊",
        "The stars have given their full approval! 🌟",
        "Yes, with a dance break! 💃",
        "The answer is yes, and it’s on a roller coaster! 🎢",
        "Yes, with a side of happy dance! 🕺",
        "Absolutely yes, with a pom-pom shake! 🎉",
        "Yes, and it’s going all out! 🎉",
        "You’ve got a yes, and it’s feeling groovy! ✌️",
        "The answer is yes, and it’s doing a victory lap! 🏅",
        "Yes, with confetti cannons! 🎉",
        "Definitely yes, with a wink and a smile! 😉",
        "A big yes, like a roaring crowd! 📣",
        "Yes, and it’s ready to party! 🎉",
        "Oh yes, and it’s got the moves! 💃",
        "Yes, with a side of sparkle and shine! ✨",
        "The answer is a yes, and it’s living it up! 🎉",
        "Yes, with a cartwheel and a cheer! 🤸",
        "Definitely yes, with a trumpet fanfare! 🎺",
        "Yes, and it’s on cloud nine! ☁️",
        "The answer is yes, and it’s rocking out! 🎸",
        "Stop fucking asking me questions! 😡",
        "It is certain. 🔮",
        "It is decidedly so. 🧐",
        "Without a doubt. ✅",
        "Yes - definitely. 💯",
        "You may rely on it. 📊",
        "As I see it, yes. 👁️",
        "Most Likely. 🤔",
        "Outlook good. 🌟",
        "Yes. 👍",
        "Signs point to yes. 🔮",
        "Reply hazy, try again. 🌫️",
        "Ask again later. ⏳",
        "Better not tell you now. 🤐",
        "Cannot predict now. 🔮",
        "Concentrate and ask again. 🧠",
        "Don't count on it. 🚫",
        "My reply is no. ❌",
        "My sources say no. 🗞️",
        "Not a chance. 🚫",
        "Hell no. 👎",
        "Definitely not. ❌",
        "Nooope. 🚫",
        "NO! 🔴",
        "Outlook not so good. ☁️",
        "Very doubtful. 🤨"
      ];
      window.CTSWelcomes = window.CFG.Welcomes; //["Heyyy", "Ni hao", "Good to see you", "Hey", "Yooo", "Yo", "Wb", "Wecome", "Welcome back", "Good to see you", "Czesc", "Salut", "Hola", "Good morning", "Good afternoon", "Morning", "Afternoon", "Good day"];
      window.CTSFollowups = window.CFG.Followups; //["what's up?", "how's things?", "how's it going?", "hope you're doing well", "hows it going?", "whats up?", "hows things?", "hru?", "cam up!", "cam up <3", "cam up ^^"];
      window.CTSCooldowns = {};
      window.lastBotCheck = -10000000;
      window.CTSWelcomeBacks = window.CFG.WelcomeBacks; //["wb", "Wb", "Welcome back"];

      window.CTSSound = {
        C: new Audio("https://media.vocaroo.com/mp3/e3VIvvFqdHe"),
        HIGHLIGHT: new Audio("https://media.vocaroo.com/mp3/mjS6tza4Tu4"),
        GREET: new Audio("https://media.vocaroo.com/mp3/mjS6tza4Tu4"),
        MENTION: new Audio("https://media.vocaroo.com/mp3/gsrjQNCdhlX"),
        MSG: new Audio(
          "https://tinychat.com" + window.rootDir + "/sound/pop.mp3"
        ),
        GIFT: new Audio(
          "https://tinychat.com" + window.rootDir + "/sound/magic.mp3"
        ),
        PVTMSG: new Audio("https://media.vocaroo.com/mp3/1eX3L752VdQ")
      };
      window.CTSRadioStations = [
        //
        ["Triple J", "https://live-radio01.mediahubaustralia.com/2TJW/aac/"],
        ["Hot 108 Jamz", "https://live.powerhitz.com/hot108"],
        ["Hip Hop and Soul", "http://stream.rtlradio.de/rnb/mp3-192/"],
        ["Hot 97 FM", "https://ice5.securenetsystems.net/KHHK"],
        ["Jump 106.9", "https://corus.leanstream.co/CKQBFM"],
        ["Power 95", "https://usa10.fastcast4u.com/power95grenada"],
        [
          "Rock On",
          "https://streaming.radiostreamlive.com/radiorockon_devices"
        ],
        [
          "Capital XTRA",
          "https://media-ssl.musicradio.com/CapitalXTRANational"
        ],
        [
          "Hot 97 NYC",
          "https://playerservices.streamtheworld.com/api/livestream-redirect/WQHTFM.mp3"
        ],
        ["Smooth Jazz", "https://smoothjazz.cdnstream1.com/2585_128.mp3"],
        ["Metal Rock Radio", "https://kathy.torontocast.com:3340/stream"],
        ["Real 92.3", "https://stream.revma.ihrhls.com/zc185"],
        ["Z100 New York", "https://stream.revma.ihrhls.com/zc1469"],
        ["KIIS FM", "https://stream.revma.ihrhls.com/zc185"],
        ["Capital FM", "https://media-ssl.musicradio.com/CapitalUK"],
        ["Heart Radio", "https://media-ssl.musicradio.com/HeartUK"],
        ["iHeart 80s Radio", "https://stream.revma.ihrhls.com/zc4443"],
        ["Dance Wave!", "https://dancewave.online/dance.mp3"],
        ["Slam! MixMarathon", "https://streaming.slam.nl/web11_mp3"],
        [
          "Today's Hits Radio",
          "https://playerservices.streamtheworld.com/api/livestream-redirect/977_HITS.mp3"
        ],
        ["KCRW", "https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air"],
        ["Power 99 (Philadelphia)", "https://stream.revma.ihrhls.com/zc1641"],
        ["181.FM The Beat", "https://listen.181fm.com/181-beat_128k.mp3"],
        ["Rap Attack", "https://stream-160.zeno.fm/6rhytd8kdf9uv"],
        ["KQED (NPR)", "https://streams.kqed.org/kqedradio"],
        [
          "BBC World Service",
          "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service"
        ],
        ["1.FM Amsterdam Trance", "https://strm112.1.fm/atr_mobile_mp3"],
        [
          "181.FM Classic Hits",
          "https://listen.181fm.com/181-greatoldies_128k.mp3"
        ],
        ["SomaFM Groove Salad", "https://ice1.somafm.com/groovesalad-256-mp3"],
        ["Ambient Sleeping Pill", "https://radio.stereoscenic.com/asp-h"],
        ["Jazz24", "https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1"],
        ["SomaFM Underground 80s", "https://ice1.somafm.com/u80s-256-mp3"],
        ["1.FM Blues", "https://strm112.1.fm/blues_mobile_mp3"],
        ["181.FM Soul", "https://listen.181fm.com/181-soul_128k.mp3"],
        [
          "BigR Radio Hip Hop Top 40",
          "https://bigrradio.cdnstream1.com/5127_128"
        ],
        ["SomaFM Left Coast 70s", "https://ice1.somafm.com/seventies-320-mp3"],
        ["1.FM Absolute Top 40", "https://strm112.1.fm/top40_mobile_mp3"],
        [
          "Classic Rock Florida",
          "https://live.radiospinner.com/classic-rock-64"
        ],
        ["Smooth Jazz 24/7", "https://strm112.1.fm/smoothjazz_mobile_mp3"],
        ["181.FM Reggae Roots", "https://listen.181fm.com/181-reggae_128k.mp3"],
        ["SomaFM Indie Pop Rocks!", "https://ice1.somafm.com/indiepop-128-mp3"],
        [
          "1.FM Chillout Lounge",
          "https://strm112.1.fm/chilloutlounge_mobile_mp3"
        ],
        [
          "BigR Radio Alternative Rock",
          "https://bigrradio.cdnstream1.com/5187_128"
        ],
        ["181.FM The Office", "https://listen.181fm.com/181-office_128k.mp3"],
        ["SomaFM DEF CON Radio", "https://ice1.somafm.com/defcon-256-mp3"],
        ["1.FM Dance One", "https://strm112.1.fm/dance_mobile_mp3"],
        [
          "BigR Radio 80s and 90s Pop Mix",
          "https://bigrradio.cdnstream1.com/5181_128"
        ],
        ["181.FM The Rock!", "https://listen.181fm.com/181-rock_128k.mp3"],
        ["SomaFM Drone Zone", "https://ice1.somafm.com/dronezone-256-mp3"],
        [
          "Hip Hop & Rap",
          "https://audiotainment-sw.streamabc.net/atsw-ushiphop-mp3-128-6266005?sABC=6699s639%230%23519nqn0n763n94962sss606s41n133or%23&aw_0_1st.playerid="
        ]
      ];
      window.CTSNameColor = [
        "#3f69c0",
        "#b63fc0",
        "#001f3f",
        "#0074D9",
        "#7FDBFF",
        "#39CCCC",
        "#3D9970",
        "#26a635",
        "#00b34d",
        "#e6c700",
        "#FF851B",
        "#FF4136",
        "#c81e70",
        "#f00fbb",
        "#B10DC9",
        "#111111",
        "#AAAAAA",
        "#cc6600",
        "#009933",
        "#003366",
        "#660033",
        "#804000"
      ];
      window.CTSChatCSS = [
        [
          //STYLE #0
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgba(32,38,40,0.59)0%,rgba(16,14,14,0.76)calc(100% - 62px),rgba(45,55,58,0.72)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #1
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(255,255,255)0%,rgba(99,99,99)calc(100% - 62px),rgba(255,255,255)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(58, 58, 58)8px,rgb(30, 30, 30)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(25,25,25)8px,rgb(76,76,76)100%);}"
          ]
        ],
        [
          //STYLE #2
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(121,24,188)0%,rgb(36,15,45)calc(100% - 62px),rgb(121,24,188)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(83, 17, 128)8px,rgb(68, 15, 103)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#7918bc;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#7918bc!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#460b6f!important;}#videos-footer-push-to-talk{background:#7918bc}#videos-footer-push-to-talk:hover{background:#460b6f}#videos-footer-broadcast:hover{background:#460b6f}#videos-footer-broadcast{background:#7918bc;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13,5,15)8px,rgb(121,24,188)100%);}"
          ]
        ],
        [
          //STYLE #3
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(248,5,5)0%,rgb(81,22,22)calc(100% - 62px),rgba(204,0,0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(121, 3, 3)8px,rgb(176, 2, 2)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#c10101;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#c10101!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#6b0f0f!important;}#videos-footer-push-to-talk{background:#c10101}#videos-footer-push-to-talk:hover{background:#6b0f0f}#videos-footer-broadcast:hover{background:#6b0f0f}#videos-footer-broadcast{background:#c10101;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(15,5,5)8px,rgb(193,1,1)100%);}"
          ]
        ],
        [
          //STYLE #4
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(65,144,219)0%,rgb(7,69,97)calc(100% - 62px),rgb(37,179,222)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(26, 59, 75)8px,rgb(59, 130, 170)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,14,15)8px,rgb(83,182,239)100%);}"
          ]
        ],
        [
          //STYLE #5
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(0,158,5)0%,rgb(5,15,5)calc(100% - 62px),rgb(13,181,0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(5,15,5)8px,rgb(14,104,7)100%);}"
          ]
        ],
        [
          //STYLE #6
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgba(0, 0, 0, 0.69)0%,rgba(0, 0, 0, 0.56)calc(100% - 62px),rgb(13, 179, 0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(5, 15, 5, 0.72)8px,rgba(0, 0, 0, 0.42)100%);}"
          ]
        ],
        [
          //STYLE #7
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgb(255, 255, 255)0%,rgba(255, 255, 255, 0.82)calc(100% - 62px),rgb(255, 255, 255)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(255, 255, 255, 0.72)8px,rgba(255, 255, 255, 0.81)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(255, 255, 255, 0.72)8px,rgba(255, 255, 255, 0.81)100%);}"
          ]
        ],
        [
          //STYLE #8
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgba(255, 255, 0, 1)0%,rgba(255, 255, 0, 0.82)calc(100% - 62px),rgba(255, 255, 0, 1)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(234, 236, 5)8px,rgb(180, 187, 15)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(56, 50, 6)0%,rgb(149, 158, 22)8px,rgba(255, 255, 0, 1)100%);}"
          ]
        ],
        [
          //STYLE #9
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgb(119, 45, 2) 0%,rgb(24, 29, 30) 52%,rgb(234, 129, 38) 100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(226, 92, 19)8px,rgb(158, 73, 16)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(154, 51, 1)0%,rgba(255, 125, 0, 1)8px,rgba(255, 125, 0, 1)100%);}"
          ]
        ],
        [
          //STYLE #10
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgb(141, 36, 95)0%,rgba(191, 0, 255, 0.82)calc(100% - 62px),rgb(255, 0, 202)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(150, 0, 175)8px,rgb(176, 0, 226)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(94, 3, 62)0%,rgb(191, 0, 255)8px,rgb(71, 0, 20)100%);}"
          ]
        ],
        [
          //STYLE #11
          [
            "#cts-chat-content>.message{background:#101314;}#chat-wrapper{background: repeating-linear-gradient(-45deg,rgb(0, 0, 0)1px,rgb(0, 186, 255)3px,rgba(0, 115, 255, 0.49)15px)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:repeating-linear-gradient(-45deg,rgb(0, 0, 0)1px,rgb(0, 186, 255)3px,rgba(0, 115, 255, 0.49)15px);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: repeating-linear-gradient(-45deg,rgb(0, 0, 0)1px,rgb(0, 186, 255)3px,rgba(0, 115, 255, 0.49)15px);}"
          ]
        ],
        [
          //STYLE #12
          [
            ".stackmessage{background:#ffffff}#chat-wrapper{background: #fff!important;}.message>.systemuser{color:#FFFFFF}#cts-chat-content>.message{background:#00000000}.message{color:#000000;text-shadow: unset;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(255, 255, 255, 0.72)8px,rgba(255, 255, 255, 0.81)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          ["#sidemenu{background: #2d373a;}"]
        ],
        [
          //STYLE #13
          [
            "#chat-wrapper{background: url(https://i.imgur.com/ek4TEsz.jpg)!important;}#cts-chat-content>.message{background:#17951a8c;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(37, 101, 27)8px,rgb(36, 98, 25)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: url(https://i.imgur.com/LCOulGB.png) repeat-x bottom;}"
          ]
        ],
        [
          //STYLE #14
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgba(32,38,40,0.59)0%,rgba(16,14,14,0.76)calc(100% - 62px),rgba(45,55,58,0.72)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #14
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(255,255,255)0%,rgba(99,99,99)calc(100% - 62px),rgba(255,255,255)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(58, 58, 58)8px,rgb(30, 30, 30)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #15
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(121,24,188)0%,rgb(36,15,45)calc(100% - 62px),rgb(121,24,188)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(83, 17, 128)8px,rgb(68, 15, 103)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#7918bc;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#7918bc!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#460b6f!important;}#videos-footer-push-to-talk{background:#7918bc}#videos-footer-push-to-talk:hover{background:#460b6f}#videos-footer-broadcast:hover{background:#460b6f}#videos-footer-broadcast{background:#7918bc;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #16
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(248,5,5)0%,rgb(81,22,22)calc(100% - 62px),rgba(204,0,0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(121, 3, 3)8px,rgb(176, 2, 2)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#c10101;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#c10101!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#6b0f0f!important;}#videos-footer-push-to-talk{background:#c10101}#videos-footer-push-to-talk:hover{background:#6b0f0f}#videos-footer-broadcast:hover{background:#6b0f0f}#videos-footer-broadcast{background:#c10101;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #17
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(65,144,219)0%,rgb(7,69,97)calc(100% - 62px),rgb(37,179,222)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(26, 59, 75)8px,rgb(59, 130, 170)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #18
          [
            "#chat-wrapper{background:linear-gradient(0deg,rgb(0,158,5)0%,rgb(5,15,5)calc(100% - 62px),rgb(13,181,0)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(13, 96, 7)8px,rgb(8, 48, 6)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#0cae00;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#0cae00!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#054c00!important;}#videos-footer-push-to-talk{background:#0cae00}#videos-footer-push-to-talk:hover{background:#054c00}#videos-footer-broadcast:hover{background:#054c00}#videos-footer-broadcast{background:#0cae00;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #19
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgb(255, 255, 255)0%,rgba(255, 255, 255, 0.82)calc(100% - 62px),rgb(255, 255, 255)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background:#2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(255, 255, 255, 0.72)8px,rgba(255, 255, 255, 0.81)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #20
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgba(255, 255, 0, 1)0%,rgba(255, 255, 0, 0.82)calc(100% - 62px),rgba(255, 255, 0, 1)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(234, 236, 5)8px,rgb(180, 187, 15)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #21
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgb(119, 45, 2) 0%,rgb(24, 29, 30) 52%,rgb(234, 129, 38) 100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(226, 92, 19)8px,rgb(158, 73, 16)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #22
          [
            "#chat-wrapper{background: linear-gradient(0deg,rgb(141, 36, 95)0%,rgba(191, 0, 255, 0.82)calc(100% - 62px),rgb(255, 0, 202)100%)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:linear-gradient(0deg,rgb(0, 0, 0)0%,rgb(150, 0, 175)8px,rgb(176, 0, 226)100%);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #23
          [
            "#cts-chat-content>.message{background:#101314;}#chat-wrapper{background: repeating-linear-gradient(-45deg,rgb(0, 0, 0)1px,rgb(0, 186, 255)3px,rgba(0, 115, 255, 0.49)15px)!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:repeating-linear-gradient(-45deg,rgb(0, 0, 0)1px,rgb(0, 186, 255)3px,rgba(0, 115, 255, 0.49)15px);}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          [
            "#sidemenu{background: linear-gradient(0deg,rgb(0, 0, 0)0%,rgba(19,19,19,0.73)8px,rgba(0,0,0,0.34)100%);}"
          ]
        ],
        [
          //STYLE #24
          [
            "#cts-chat-content>.message{background:#101314;}#chat-wrapper{background: #202628!important;}#cts-chat-content>.message{background:#101314a8;}.message{color:#FFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;}"
          ],
          [
            ".PMPopup .PMContent{background: #2d373ADB;}.PMPopup h2{background:#202628;}#videos-footer-broadcast-wrapper>.waiting{background:#53b6ef;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button{background:#53b6ef!important;}#videos-footer-broadcast-wrapper>#videos-footer-submenu-button:hover{background:#3d89b5!important;}#videos-footer-push-to-talk{background:#53b6ef}#videos-footer-push-to-talk:hover{background:#3d89b5}#videos-footer-broadcast:hover{background:#3d89b5}#videos-footer-broadcast{background:#53b6ef;}"
          ],
          ["#sidemenu{background:#202628;}"]
        ]
      ];
      //INSERT SCRIPT
      var script = document.createElement("script"),
        elem = document.getElementsByTagName("script")[0];
      script.text =
        'function UserProfileView(username) {if (username === "") {return;}var profilefetch = new XMLHttpRequest();profilefetch.onreadystatechange = function() {if (this.readyState == 4 && this.status == 200){window.ShowProfile(profilefetch.responseText);}};profilefetch.open("GET", "https://tinychat.com/api/v1.0/user/profile?username="+username, true);profilefetch.send();}window.StationSelected = 0,\n	window.StationPlay = false,\n	window.StationVol = 1;\nfunction VolStation(elem, vol){\n	window.StationElem = elem.parentElement.nextSibling;\n	var StationVolElem = elem.parentElement.querySelector(".music-radio-info>.volume");\nStationVol += vol;\n	if (StationVol < 0){\n		StationVol = 0;\n	} else if (StationVol > 1) {\n		StationVol = 1.0;\n	}\n	window.StationElem.volume = StationVol*window.CTSRoomVolume;\nStationVolElem.style.width=((StationVol * 100)+"%");}\nfunction PlayPauseStation(elem) {\n	var StationPlayPauseBtn = elem.parentElement.querySelector(".music-radio-playpause");\n window.StationElem=elem.parentElement.nextSibling;\nvar StationDescElem=elem.parentElement.querySelector(".music-radio-info>.description");\n	StationPlay=!StationPlay;\n	if (StationPlay) {\n		window.StationElem.volume = StationVol*window.CTSRoomVolume;\n		if(!window.CTSMuted) window.StationElem.play();\n StationPlayPauseBtn.innerText="❚❚";	StationDescElem.innerText = ("Playing: "+window.CTSRadioStations[StationSelected][0]+"\\nURL: "+window.CTSRadioStations[StationSelected][1]);\n} else {\n		window.StationElem.pause();\nStationPlayPauseBtn.innerText="▶";\n	StationDescElem.innerText = ("Paused: "+window.CTSRadioStations[StationSelected][0]+"\\nURL: "+window.CTSRadioStations[StationSelected][1]);}\n}\nfunction SeekStation(elem, direction) {\n	window.StationElem = elem.parentElement.nextSibling;\n	var StationDescElem = elem.parentElement.querySelector(".music-radio-info>.description");\nvar StationPlayPauseBtn = elem.parentElement.querySelector(".music-radio-playpause");\n	StationPlay = true;\n	StationSelected += direction;\n	\n	if (StationSelected > window.CTSRadioStations.length-1) {\n		StationSelected = 0;\n	} else if (StationSelected < 0){\n		StationSelected = window.CTSRadioStations.length-1;\n	}\n	window.StationElem.pause();\n	window.StationElem.setAttribute("src", window.CTSRadioStations[StationSelected][1]);\n	window.StationElem.load();\n	window.StationElem.volume = StationVol*window.CTSRoomVolume;\nStationPlayPauseBtn.innerText="❚❚";\n	if(!window.CTSMuted) window.StationElem.play();\nStationDescElem.innerText = ("Playing: "+window.CTSRadioStations[StationSelected][0]+"\\nURL: "+window.CTSRadioStations[StationSelected][1]);\n}';
      elem.parentNode.insertBefore(script, elem);
      //LOCALSETTINGS
      CTS.enablePMs =
        window.TinychatApp.BLL.SettingsFeature.prototype.getSettings().enablePMs;

      //TTS (TEXT-TO-SPEECH)
      if (
        window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
          .enableSound &&
        "speechSynthesis" in window
      ) {
        CTS.TTS.synth = window.speechSynthesis;
        CTS.TTS.voices = CTS.TTS.synth.getVoices();
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
      ModerationListElement = SideMenuElement.querySelector(
        "tc-video-moderation"
      ).shadowRoot;
      ChatListElement = SideMenuElement.querySelector("tc-chatlist").shadowRoot;
      UserContextElement = UserListElement.querySelector(
        "tc-user-contextmenu"
      ).shadowRoot;
      var insert = TitleElement.querySelector('span[title="Settings"]');
      VideoListElement.querySelector("#videos-header").appendChild(insert);
      //INSERT HTML/CSS
      if (!CTS.Project.isTouchScreen) {
        insert = VideoListElement.querySelector(
          "#videos-footer-broadcast-wrapper"
        );
        VideoListElement.querySelector("#videolist").appendChild(insert);
        VideoListElement.querySelector("#videos-footer").insertAdjacentHTML(
          "afterbegin",
          "Media"
        );
        VideoListElement.querySelector("#videos-footer").insertAdjacentHTML(
          "beforeend",
          '<div id="music-radio"><div class="music-radio-info"><div class="description">Playing: None<br>URL: None</div><div class="volume"></div></div><button class="music-radio-seek" onclick="SeekStation(this,-1);">&#8592;</button><button class="music-radio-seek" onclick="SeekStation(this,1);">&#8594;</button><button class="music-radio-playpause" onclick="PlayPauseStation(this);">&#9654;</button><button class="music-radio-vol" onclick="VolStation(this,.05);">&#43;</button><button class="music-radio-vol" style="top:50%" onclick="VolStation(this,-.05);">&#45;</button></div><audio id="music-radio-audio" src="' +
            window.CTSRadioStations[0][1] +
            '"></audio>'
        );
        TitleCSS +=
          'span[title="Follow"], span[title="Share room"]{display:none!important;}';
      } else {
        VideoCSS =
          '.video>div{border-radius:10px;}#videos-footer-broadcast{border-radius:unset!important;}#videos-footer-broadcast-wrapper > #videos-footer-submenu-button{border-radius:unset;}#videos-footer-push-to-talk{margin-left:0!important;border-radius:unset;}#videos-footer-youtube, #videos-footer-soundcloud{min-width:35px;border-radius:unset;margin-right: 0;}@media screen and (max-width: 600px){#videos{top:38px;}#videos-footer-broadcast, #videos-footer-broadcast-wrapper.hide-submenu > #videos-footer-broadcast {height:50px;line-height:50px;}#videos-footer{min-height: 50px;padding:0}}span[title="Settings"]>svg{padding:7px 10px;height:24px;width:24px;}#videolist[data-mode="dark"]{background-color:unset;}#videos-footer-broadcast-wrapper{display:contents;}.video:after{content: unset;border:unset;}#videos-header{padding:0;background:#181d1e;}.ctsdrop{position:fixed;display:inline-block;top:3px;left:4px;z-index:5;min-width: 46px;}.ctsdrop-content{top:28px;right:0;background:#181d1e;width: 92px;padding:0;z-index:1;display:none;}.ctsdrop:hover .ctsdrop-content{display:block;}.ctsdrop-content button:hover, .ctsoptions:hover{background:#53b6ef}.ctsdrop-content button.hidden{display:none;}.ctsdrop-content button., .ctsoptions{line-height: 22px;color: white;width:46px;height:28px;z-index: 2;cursor: pointer;top: 4px;background: #181d1e75;border: none;padding: 5% 0;display: inline-block;}';
        MainCSS += "body{overflow:auto;}";
        UserListCSS += "#contextmenu{top:unset;bottom:0;left:0;}";
      }
      ChatLogElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        ChatboxCSS
      );
      StyleSet();
      document.body
        .querySelector("style")
        .insertAdjacentHTML("beforeend", MainCSS);
      MainElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        RoomCSS
      );
      VideoListElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        NotificationCSS
      );
      VideoListElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        VideoCSS
      );
      SideMenuElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        SideMenuCSS
      );
      UserListElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        UserListCSS
      );
      ChatListElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        ChatListCSS
      );
      ModerationListElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        ModeratorCSS
      );
      UserContextElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        ContextMenuCSS
      );
      TitleElement.querySelector("style").insertAdjacentHTML(
        "beforeend",
        TitleCSS
      );
      UserListElement.querySelector("#button-banlist").insertAdjacentHTML(
        "beforebegin",
        "<span>1</span>"
      );
      VideoListElement.querySelector("#videos-header").insertAdjacentHTML(
        "afterbegin",
        '<button style="display:' +
          (CTS.Project.isTouchScreen ? "none" : "block") +
          '" class="tcsettings">←</button><input id="cts-vol-control" type="range" min="10" max="100" value="100" step="1" oninput="window.AdjustRoomVolume(this.value)" onchange="window.AdjustRoomVolume(this.value)" style="min-width: 100px;"><span id="videos-header-sound-cts"><svg id="videos-header-sound-mute-cts" style="padding: 5px 0;" width="20" height="26" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg" class=""><path d="M533.31 159.634c.933.582 1.69.166 1.69-.94v-19.388c0-1.1-.76-1.52-1.69-.94l-6.724 4.187c-.934.58-2.587 1.053-3.687 1.053h-1.904c-1.102 0-1.996.9-1.996 2.004v6.78c0 1.107.895 2.004 1.996 2.004h1.903c1.1 0 2.754.473 3.686 1.054l6.723 4.186z" transform="translate(-517 -136)" stroke="#41b7ef" stroke-width="2" fill="none" fill-rule="evenodd"></path></svg></span>'
      );
      VideoListElement.querySelector("#videos-content").insertAdjacentHTML(
        "beforeend",
        '<div id="popup" class="PMOverlay"></div>'
      );
      VideoListElement.querySelector("#videolist").insertAdjacentHTML(
        "afterbegin",
        '<div class="ctsdrop"><button class="ctsoptions" title="CTS Options">🔧</button><div class="ctsdrop-content"><div style="height:6px;background:#624482;"></div><button id="BackgroundUpdateRight" class="ctsoptions" title="Background">➖</button><button id="BackgroundUpdateLeft" class="ctsoptions" title="Background">➕</button><div style="height:6px;background:#624482;"></div><button id="FontSizeUpdate" class="ctsoptions" title="Font Size">🔍</button><button id="ChatCompact" class="ctsoptions" title="Compact Chat">💬</button><div style="height:6px;background:#624482;"></div>' +
          (!CTS.ThemeChange
            ? '<button id="ChatWidthToggled" class="ctsoptions" title="Chat Resize">↔</button><button id="ChatHeightToggled" class="ctsoptions" title="Chat Resize">↕</button><div style="height:6px;background:#624482;"></div>'
            : "") +
          '<button id="ChatColor" class="ctsoptions" title="Chat Style">🔨</button><button id="CameraBorderToggled" class="ctsoptions" title="Camera Border">📷</button><button id="FeaturedToggled" class="ctsoptions" title="Featured Resize">📺</button><button id="PerformanceModeToggled" class="ctsoptions" title="Performance Mode">🎮</button>' +
          (!CTS.Project.isTouchScreen
            ? '<div style="height:6px;background:#624482;"></div><button id="ThemeChange" class="ctsoptions" title="Switch CTS Theme Mode">🔄</button></div></div>'
            : "")
      );
      insert = UserListElement.querySelector("#button-banlist");
      VideoListElement.querySelector("#videos-header").appendChild(insert);
      ChatLogElement.querySelector("#chat-position").insertAdjacentHTML(
        "afterbegin",
        '<div id="notification-content"></div><button class="notifbtn">▼</button>'
      );
      ChatLogElement.querySelector("#chat").insertAdjacentHTML(
        "beforeend",
        '<div id="cts-chat-content"></div>'
      );
      ChatLogElement.querySelector("#chat").insertAdjacentHTML(
        "afterend",
        '<div class="cts-message-unread" style="display:none;">There are unread messages!</div>'
      );
      //SCRIPT INIT -> PREPARE()
      clearInterval(CTS.ScriptLoading);
      CTS.ScriptInit = true;
      CTSRoomPrepare();
    }
    function CTSRoomPrepare() {
      var _this3 = this;
      //FUNCTION BYPASS
      window.YouTube = {
        Player: undefined,
        Volume: 100,
        IFrameReady: false,
        onReadyYT: false,
        BehindChat: false,
        Playing: false,
        Muted: false,
        Popup: null,
        Offset: 0,
        PlayerStateOK: false,
        Init: function Init() {
          if (CTS.YouTube.CurrentTrack.ID != undefined) {
            if (window.YouTube.Popup !== null) {
              window.YouTube.Popup.location.href =
                "https://www.youtube.com/watch?v=" +
                CTS.YouTube.CurrentTrack.ID +
                "&autoplay=1&t=" +
                Math.trunc(CTS.YouTube.CurrentTrack.offset + 2);
            } else if (window.YouTube.IFrameReady) {
              // CONTAINER
              var element = document.createElement("div");
              element.setAttribute("id", "playerYT");
              var query = !CTS.ThemeChange
                ? SideMenuElement.querySelector(
                    "#sidemenu-content"
                  ).insertBefore(
                    element,
                    SideMenuElement.querySelector("#sidemenu-content")
                      .childNodes[0] || null
                  )
                : ChatListElement.insertBefore(
                    element,
                    ChatListElement.childNodes[0] || null
                  );
              // OVERLAY
              element = document.createElement("div");
              element.setAttribute("class", "overlay");
              element.innerHTML =
                '<div class="volume"></div><div class="duration"></div><button id="yt_voldown">🔉</button><button id="yt_volup">🔊</button><button id="yt_volmute">🔇</button>' +
                (!CTS.Project.isTouchScreen
                  ? '<button id="yt_fullscreen">⛶</button><button id="yt_pip">PIP</button>' +
                    (!CTS.ThemeChange
                      ? '<button id="yt_behindchat">↸</button>'
                      : "")
                  : "") +
                (CTS.Me.mod
                  ? '<button id="yt_close" style="float:right;">X</button>'
                  : "");
              query.insertBefore(element, query.childNodes[0]);
              // EVENT LISTENERS
              query
                .querySelector("#yt_voldown")
                .addEventListener("click", YouTubeVolumeDown, true);
              query
                .querySelector("#yt_volup")
                .addEventListener("click", YouTubeVolumeUp, true);
              query
                .querySelector("#yt_volmute")
                .addEventListener("click", YouTubeMute, true);
              if (!CTS.ThemeChange && !CTS.Project.isTouchScreen)
                query
                  .querySelector("#yt_behindchat")
                  .addEventListener("click", YouTubeBehindChat, true);
              if (!CTS.Project.isTouchScreen)
                query
                  .querySelector("#yt_fullscreen")
                  .addEventListener("click", YouTubeFullScreen, true);
              if (!CTS.Project.isTouchScreen)
                query
                  .querySelector("#yt_pip")
                  .addEventListener("click", YouTubePIP, true);
              if (CTS.Me.mod)
                query
                  .querySelector("#yt_close")
                  .addEventListener("click", YouTubeClose, true);
              // PLAYER
              element = document.createElement("div");
              element.setAttribute("id", "player");
              query = query.insertBefore(element, query.childNodes[0]);
              // Convert To Video
              window.YouTube.Player = new window.YT.Player(query, {
                width: 200,
                height: 200,
                videoId: CTS.YouTube.CurrentTrack.ID,
                playerVars: {
                  autohide: 0,
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                  enablejsapi: 1,
                  fs: 1,
                  iv_load_policy: 3,
                  modestbranding: 1
                },
                events: {
                  onReady: window.YouTube.onPlayerReady,
                  onStateChange: window.YouTube.onPlayerStateChange
                }
              });
              window.YouTube.Playing = true;
            } else {
              setTimeout(window.YouTube.Init, 250);
            }
          }
        },
        onPlayerReady: function onPlayerReady(event) {
          window.YouTube.onReadyYT = true;
          event.target.setVolume(
            Math.ceil(
              window.CTSRoomVolume !== 1
                ? window.YouTube.Volume * window.CTSRoomVolume
                : window.YouTube.Volume
            )
          );
          window.YouTube.Player[
            window.CTSMuted ? "mute" : window.YouTube.Muted ? "mute" : "unMute"
          ]();
          event.target.seekTo(Math.trunc(CTS.YouTube.CurrentTrack.offset) + 2);
          event.target.playVideo();
          YouTubeVolumeIndicator();
          YouTubeBehindChat(true);
          YouTubeMute(true);
        },
        onPlayerStateChange: function onPlayerStateChange(event) {
          if (event.data == 1) {
            window.YouTube.PlayerStateOK = true;
          } else {
            window.YouTube.PlayerStateOK = false;
          }
        },
        stopVideo: function stopVideo() {
          if (window.YouTube.Playing) {
            window.YouTube.Playing = false;
            var elem = !CTS.ThemeChange
              ? SideMenuElement.querySelector("#sidemenu-content")
              : ChatListElement;
            elem
              .querySelector("#yt_voldown")
              .removeEventListener("click", YouTubeVolumeDown, true);
            elem
              .querySelector("#yt_volmute")
              .removeEventListener("click", YouTubeMute, true);
            if (!CTS.ThemeChange && !CTS.Project.isTouchScreen)
              elem
                .querySelector("#yt_behindchat")
                .removeEventListener("click", YouTubeBehindChat, true);
            if (!CTS.Project.isTouchScreen)
              elem
                .querySelector("#yt_fullscreen")
                .removeEventListener("click", YouTubeFullScreen, true);
            if (CTS.Me.mod)
              elem
                .querySelector("#yt_close")
                .removeEventListener("click", YouTubeClose, true);
            Remove(elem, "#playerYT");
            window.YouTube.onReadyYT = false;
          }
        }
      };
      window.onYouTubeIframeAPIReady = function () {
        window.YouTube.IFrameReady = true;
      };
      window.AdjustRoomVolume = function (val) {
        // Room Volume Value Set
        window.CTSRoomVolume = val / 100;
        window.CTSMuted = window.CTSRoomVolume == 0.1 ? true : false;
        VideoListElement.querySelector(
          "#videos-header-sound-cts path"
        ).setAttribute(
          "style",
          "stroke:" + (window.CTSMuted ? "#FF4136" : "#41b7ef")
        );
        // Adjust Camera Volumes in accordance
        Cameras();
        // Adjust YouTube Volume
        if (window.YouTube.onReadyYT) {
          window.YouTube.Player.setVolume(
            window.CTSMuted
              ? 0
              : Math.ceil(window.YouTube.Volume * window.CTSRoomVolume)
          );
          if (!window.CTSMuted && !window.YouTube.Muted)
            window.YouTube.Player.unMute();
        }
        // Adjust Radio Volume
        VideoListElement.querySelector("#music-radio-audio").volume =
          window.CTSMuted ? 0 : window.StationVol * window.CTSRoomVolume;
        if (window.StationPlay)
          VideoListElement.querySelector("#music-radio-audio").play();
      };
      window.TinychatApp.BLL.ChatRoom.prototype.tcPkt_MsgParse = function (a) {
        var b = new window.TinychatApp.DAL.ChatLogItemEntity();
        b.message_text = a.text || "";
        var c = a.handle || 0;
        b.user = this.userlist.get(c);
        return b;
      };
      window.TinychatApp.BLL.Videolist.prototype.blurOtherVids = function () {};
      window.TinychatApp.BLL.SoundPlayer.playMessage = function () {};
      window.TinychatApp.BLL.SoundPlayer.playGift = function () {};
      window.TinychatApp.BLL.User.isSubscription = function () {
        return true;
      };
      window.TinychatApp.BLL.User.canUseFilters = function () {
        return true;
      };
      window.TinychatApp.BLL.MediaConnection.prototype.Close = function () {
        RTC(this);
      };
      window.TinychatApp.BLL.ChatRoom.prototype.sendPushForUnreadPrivateMessage =
        function () {};
      if (!CTS.Project.isTouchScreen) {
        window.TinychatApp.BLL.ChatRoom.prototype.BroadcastStart = function (
          a
        ) {
          var _this = this;
          var b = this,
            d = this.settings.getSettings();
          if (d.video === null) {
            return void this.app.MediaSettings(
              function () {
                _newArrowCheck(this, _this);
                this.BroadcastStart();
              }.bind(this)
            );
          }
          this.videolist.AddingVideoSelf(this.self_handle);
          var e = {};
          if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.enumerateDevices
          ) {
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
            navigator.mediaDevices
              .enumerateDevices()
              .then(
                function (g) {
                  var _this2 = this;
                  _newArrowCheck(this, _this);
                  var h = false;
                  var len = g.length;
                  for (var c = 0; c < len; c++) {
                    if (g[c].kind === "videoinput") {
                      if (e.video === void 0)
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
                      if (h) {
                        d.video = g[c];
                        h = false;
                        this.settings.saveSettings(d);
                      } else if (d.video === null) {
                        d.video = g[c];
                        this.settings.saveSettings(d);
                      } else if (
                        d.video !== null &&
                        typeof d.video == "object" &&
                        d.video.deviceId == g[c].deviceId &&
                        d.video.deviceId !== a
                      ) {
                        e.video.deviceId = {
                          exact: d.video.deviceId
                        };
                      } else if (d.video.deviceId === a) {
                        h = true;
                      }
                    }
                    if (g[c].kind === "audioinput") {
                      if (e.audio === void 0) e.audio = {};
                      if (
                        d.audio !== null &&
                        typeof d.audio == "object" &&
                        d.audio.deviceId == g[c].deviceId
                      )
                        e.audio = {
                          deviceId: {
                            exact: d.audio.deviceId
                          }
                        };
                    }
                  }
                  if (
                    e.video !== null &&
                    d.video !== null &&
                    d.video.deviceId == b.id__miconly
                  )
                    delete e.video;
                  var i = navigator.mediaDevices.getSupportedConstraints();
                  for (var _a in i) {
                    if (
                      i.hasOwnProperty(_a) &&
                      "echoCancellation" == _a &&
                      e.audio
                    )
                      e.audio[_a] = this.settings.isAcousticEchoCancelation();
                  }
                  if (!(e.audio || e.video)) {
                    b.onMediaFailedCallback(
                      new Error("No media devices to start broadcast.")
                    );
                  } else if (
                    "https:" === location.protocol ||
                    this.app.isDebug()
                  ) {
                    debug("BROADCAST", "Initiating Media...");
                    var m = new window.TinychatApp.BLL.BroadcastProgressEvent(
                      window.TinychatApp.BLL.BroadcastProgressEvent.MEDIA_START
                    );
                    this.EventBus.broadcast(
                      window.TinychatApp.BLL.BroadcastProgressEvent.ID,
                      m
                    );
                    b.mediaLastConstraints = e;
                    navigator.mediaDevices.getUserMedia(e).then(
                      function (m) {
                        _newArrowCheck(this, _this2);
                        b.onMediaSuccessCallback(m);
                      }.bind(this)
                    );
                  }
                }.bind(this)
              )
              ["catch"](
                function (er) {
                  _newArrowCheck(this, _this);
                  debug("CAMERA::ERROR", er);
                }.bind(this)
              );
          }
        };
      }
      window.TinychatApp.BLL.Userlist.prototype.ignore = function (a) {
        var b = a.isUsername ? a.username : a.nickname;
        if (this.isIgnored(a) || this.ignored.push(b)) {
          var c = new window.TinychatApp.BLL.IgnorelistUpdateUserEvent(a);
          this.EventBus.broadcast(
            window.TinychatApp.BLL.IgnorelistUpdateUserEvent.ID,
            c
          );
          this.app.showToast(
            b + " ignored successfully till they leave or you refresh!"
          );
          if (!a.isUsername) {
            CTS.TempIgnoreNickList.push(b.toUpperCase());
          } else {
            CTS.TempIgnoreUserList.push(b.toUpperCase());
          }
        }
      };
      window.TinychatApp.BLL.Userlist.prototype.unignore = function (a) {
        var b = a.isUsername ? a.username : a.nickname,
          index = this.ignored.indexOf(b);
        if (index != -1) this.ignored.splice(index, 1);
        if (!a.isUsername) {
          index = CTS.TempIgnoreNickList.indexOf(b.toUpperCase());
          if (index != -1) CTS.TempIgnoreNickList.splice(index, 1);
        } else {
          index = CTS.TempIgnoreUserList.indexOf(b.toUpperCase());
          if (index != -1) CTS.TempIgnoreUserList.splice(index, 1);
        }
        var e = new window.TinychatApp.BLL.IgnorelistUpdateUserEvent(a);
        this.EventBus.broadcast(
          window.TinychatApp.BLL.IgnorelistUpdateUserEvent.ID,
          e
        );
        this.app.showToast(a.username + " unignored");
      };
      if (CTS.StorageSupport) {
        window.TinychatApp.BLL.SettingsFeature.prototype.getSettings =
          function () {
            var A = this._get("tinychat_settings");
            try {
              A = Object.assign(
                new window.TinychatApp.DAL.SettingsEntity(),
                JSON.parse(A)
              );
            } catch (E) {}
            if (A !== undefined) {
              CTS.enableSound = A.enableSound;
              if (CTS.enablePMs !== A.enablePMs) {
                CTS.enablePMs = A.enablePMs;
                PMShow();
              }
            }
            return (
              ((void 0 == A || "object" !== typeof A) &&
                (A = new window.TinychatApp.DAL.SettingsEntity())) ||
              A
            );
          };
      }
      if (!CTS.Project.isTouchScreen) {
        window.TinychatApp.BLL.ChatRoom.prototype.prepareStream = function (a) {
          function b() {
            if (null == c.mediaStreamCanvas) {
              if (CTS.AnimationFrameWorker != undefined) {
                CTS.AnimationFrameWorker.terminate();
                CTS.AnimationFrameWorker = undefined;
              }
              CTS.Me.broadcasting = false;
              return;
            }
            d.clearRect(
              0,
              0,
              c.mediaStreamCanvas.width,
              c.mediaStreamCanvas.height
            );
            var a = c.mediaStreamVideo.videoHeight,
              e = c.mediaStreamVideo.videoWidth;
            c.mediaStreamCanvas.width = e;
            c.mediaStreamCanvas.height = a;
            window.TinychatApp.BLL.VideoFilters.getFilter(
              CTS.MediaStreamFilter
            ).apply(d, e, a);
            d.drawImage(
              c.mediaStreamVideo,
              0,
              0,
              e,
              a,
              0,
              0,
              c.mediaStreamCanvas.width,
              c.mediaStreamCanvas.height
            );
          }
          this.mediaStreamOrigin = a;
          this.mediaStreamVideo = document.createElement("video");
          this.mediaStreamVideo.srcObject = this.mediaStreamOrigin;
          this.mediaStreamVideo.pause();
          this.mediaStreamVideo.oncanplay = function () {
            CTS.Me.broadcasting = true;
            setTimeout(function () {
              onStartBroadcast();
            }, 3000);
            if (CTS.WorkersAllowed) {
              if (CTS.AnimationFrameWorker == undefined) {
                CTS.AnimationFrameWorker = new Worker(
                  window.URL.createObjectURL(
                    new Blob([
                      'function Counter() {self.postMessage("0");}setInterval(function(){Counter();}, 1e3/' +
                        CTS.FPS +
                        ");"
                    ])
                  )
                );
                CTS.AnimationFrameWorker.onmessage = function () {
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
          var c = this,
            d = this.mediaStreamCanvas.getContext("2d");
          this.mediaStreamVideo.play();
          var e = this.mediaStreamCanvas.captureStream(CTS.FPS);
          return e.addTrack(this.mediaStreamOrigin.getAudioTracks()[0]) || e;
        };
      }
      window.TinychatApp.BLL.ChatRoom.prototype.applyFilter = function (a) {
        this.mediaStreamFilter = a;
        CTS.MediaStreamFilter = a;
        Save("MediaStreamFilter", CTS.MediaStreamFilter);
      };
      window.TinychatApp.BLL.Videolist.prototype.toggleHiddenVW = function (a) {
        var b =
          window.TinychatApp.getInstance().defaultChatroom._videolist.items.indexOf(
            a
          );
        if (b != -1) {
          var username = a.userentity.username.toUpperCase(),
            index = CTS.HiddenCameraList.indexOf(username.toUpperCase());
          if (username === "GUEST") {
            a.hidden = !a.hidden;
          } else {
            if (a.hidden) {
              a.hidden = false;
              if (index !== -1) {
                //REMOVE
                if (arguments[1] === undefined) {
                  debug(
                    "HIDDENCAMERALIST::",
                    "REMOVE USER " + username + " FROM HIDDENCAMERALIST"
                  );
                  Alert(
                    GetActiveChat(),
                    "✓ Removing " + username + " from hiddencameralist!"
                  );
                  CommandList.hiddencameraremove(index);
                }
              }
            } else {
              a.hidden = true;
              if (index === -1) {
                //ADD
                if (arguments[1] === undefined) {
                  debug(
                    "HIDDENCAMERALIST::",
                    "ADD USER " + username + " TO HIDDEN CAMERA LIST"
                  );
                  Alert(
                    GetActiveChat(),
                    "✓ Adding " + username + " to hidden camera list!"
                  );
                  CommandList.hiddencameraadd(username);
                }
              }
            }
          }
          a.mute = CTS.Me.username === username ? true : a.mute;
          window.TinychatApp.getInstance().defaultChatroom._videolist._pauseMediaStream(
            a.mediastream,
            a.hidden
          );
          if (!a.hidden)
            window.TinychatApp.getInstance().defaultChatroom._videolist._muteMediaStream(
              a.mediastream,
              a.mute
            );
          var d = new window.TinychatApp.BLL.VideolistEvent(
            window.TinychatApp.BLL.VideolistAction.Update,
            a,
            b
          );
          window.TinychatApp.getInstance().defaultChatroom._videolist.EventBus.broadcast(
            window.TinychatApp.BLL.VideolistEvent.ID,
            d
          );
        }
      };
      window.fullscreenManager.status = function () {
        _newArrowCheck(this, _this3);
        if (
          CTS.isFullScreen !==
          (document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen)
        ) {
          CTS.isFullScreen =
            document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen;
          // Fix FullScreen
          MainElement.querySelector("#room").classList.toggle("full-screen");
        }
        return (
          document.fullScreen ||
          document.mozFullScreen ||
          document.webkitIsFullScreen
        );
      }.bind(this);
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
      var element;
      //EVENT LISTENERS
      if (!CTS.ThemeChange) {
        // BOOT UP OG THEME
        var finishoff = false;
        while (
          CTS.OGStyle.SavedHeight !== CTS.OGStyle.HeightCounter ||
          CTS.OGStyle.SavedWidth !== CTS.OGStyle.WidthCounter
        ) {
          if (CTS.OGStyle.SavedHeight !== CTS.OGStyle.HeightCounter) {
            ChatHeightToggled();
          } else {
            finishoff = true;
          }
          if (CTS.OGStyle.SaveWidth !== CTS.OGStyle.WidthCounter && finishoff)
            ChatWidthToggled();
        }
        VideoListElement.querySelector("#ChatHeightToggled").addEventListener(
          "click",
          function () {
            ChatHeightToggled();
            Save("OGStyleHeight", CTS.OGStyle.HeightCounter);
          },
          {
            passive: true
          }
        );
        VideoListElement.querySelector("#ChatWidthToggled").addEventListener(
          "click",
          function () {
            ChatWidthToggled();
            Save("OGStyleWidth", JSON.stringify(CTS.OGStyle.WidthCounter));
          },
          {
            passive: true
          }
        );
      } else {
        if (!CTS.Project.isTouchScreen) {
          element = document.createElement("div");
          element.setAttribute("id", "chat-hide");
          ChatLogElement.querySelector("#chat-wider").parentNode.insertBefore(
            element,
            ChatLogElement.querySelector("#chat-wider")
          );
          ChatLogElement.querySelector("#chat-hide").addEventListener(
            "click",
            function () {
              ChatHide();
            },
            {
              passive: true
            }
          );
        }
      }
      element = document.createElement("button");
      element.setAttribute("id", "chat-download");
      element.setAttribute("class", "chat-button");
      element.setAttribute("title", "Download copy of chat-log");
      ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
      ChatLogElement.querySelector("#chat-download").textContent = "📋";
      ChatLogElement.querySelector("#chat-download").addEventListener(
        "click",
        function () {
          var len = CTS.UserList.length,
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
          for (c = 0; c < len; c++)
            t +=
              "[" +
              CTS.Message[GetActiveChat()][c].time +
              "][" +
              CTS.Message[GetActiveChat()][c].username +
              "(" +
              CTS.Message[GetActiveChat()][c].nick +
              ")]: " +
              (CTS.Message[GetActiveChat()][c].msg.replace(
                /(\r\n|\n|\r)/gm,
                ""
              ) +
                "\n");
          Export(
            "TinyChat_" +
              CTS.Room.Name.toUpperCase() +
              " " +
              DateTime() +
              ".log",
            "Room : " + CTS.Room.Name + "\n" + t
          );
        },
        {
          passive: true
        }
      );
      element = document.createElement("button");
      element.setAttribute("id", "safelist-export");
      element.setAttribute("class", "chat-button");
      element.setAttribute("title", "Export your safelist");
      ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
      ChatLogElement.querySelector("#safelist-export").textContent = "📤";
      ChatLogElement.querySelector("#safelist-export").addEventListener(
        "click",
        function () {
          if (localStorage.getItem("CTS_AKB") !== null)
            Export(
              "CTS_Safelist_" + DateTime() + ".backup",
              JSON.stringify(CTS.SafeList)
            );
        },
        {
          passive: true
        }
      );
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
      ChatLogElement.querySelector("#safelist-import").addEventListener(
        "change",
        function (e) {
          var file = ChatLogElement.querySelector("#safelist-import").files[0],
            reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function () {
            try {
              var resp = JSON.parse(reader.result);
              if (resp !== null) {
                var len2 = resp.length,
                  counter = 0;
                for (var i = 0; i < len2; i++) {
                  if (
                    CheckUserNameStrict(resp[i]) &&
                    !CTS.SafeList.includes(resp[i].toUpperCase())
                  ) {
                    CTS.SafeList.push(resp[i].toUpperCase());
                    counter++;
                  }
                }
                Save("AKB", JSON.stringify(CTS.SafeList));
                Alert(
                  GetActiveChat(),
                  "✓ Backup looks good! " + counter + "users added to SafeList!"
                );
              }
            } catch (e) {
              debug("BACKUP::ERROR", e);
            }
          };
          reader.onerror = function () {
            debug("BACKUP::ERROR", "Something went wrong...");
          };
        }
      );
      element = document.createElement("button");
      element.setAttribute("id", "chat-export");
      element.setAttribute("class", "chat-button");
      element.setAttribute("title", "Export your saved CTS settings");
      ChatLogElement.querySelector("#chat-wrapper").appendChild(element);
      ChatLogElement.querySelector("#chat-export").textContent = "📤";
      ChatLogElement.querySelector("#chat-export").addEventListener(
        "click",
        function () {
          var tempobj = {};
          for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substring(0, 4) == "CTS_")
              tempobj[localStorage.key(i)] = localStorage[localStorage.key(i)];
          }
          Export(
            "CTS_Settings_" + DateTime() + ".backup",
            JSON.stringify(tempobj)
          );
        },
        {
          passive: true
        }
      );
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
      ChatLogElement.querySelector("#chat-import").addEventListener(
        "change",
        function (e) {
          var file = ChatLogElement.querySelector("#chat-import").files[0],
            reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function () {
            try {
              var resp = JSON.parse(reader.result);
              if (resp !== null) {
                var keys = Object.keys(resp),
                  ready = true;
                Alert(GetActiveChat(), "- Scanning backup!");
                for (var a = 0; a < keys.length; a++) {
                  if (keys[a].substring(0, 4) !== "CTS_") ready = false;
                }
                if (ready) {
                  Alert(GetActiveChat(), "✓ Backup looks good!");
                  var localkeys = Object.keys(localStorage),
                    locallen = localkeys.length;
                  Alert(GetActiveChat(), "- Clearing Storage!");
                  for (var b = 0; b < locallen; b++) {
                    if (localkeys[b].substring(0, 4) === "CTS_")
                      localStorage.removeItem(localkeys[b]);
                  }
                  Alert(
                    GetActiveChat(),
                    "✓ Storage cleared!\n- Applying CTS Backup!"
                  );
                  for (var c = 0; c < keys.length; c++) {
                    localStorage.setItem(keys[c], resp[keys[c]]);
                  }
                  Alert(
                    GetActiveChat(),
                    "✓ All done!\n\nYou'll auto-refresh shortly!"
                  );
                  setTimeout(function () {
                    location.reload();
                  }, 3000);
                }
              }
            } catch (e) {
              debug("BACKUP::ERROR", e);
            }
          };
          reader.onerror = function () {
            debug("BACKUP::ERROR", "Something went wrong...");
          };
        }
      );
      if (!CTS.Project.isTouchScreen) {
        VideoListElement.querySelector("#ThemeChange").addEventListener(
          "click",
          function () {
            CTS.ThemeChange = !CTS.ThemeChange;
            Save("ThemeChange", JSON.stringify(CTS.ThemeChange));
            location.reload();
          },
          {
            passive: true
          }
        );
      }
      VideoListElement.querySelector(
        "#videos-header-sound-mute-cts"
      ).addEventListener(
        "click",
        function () {
          // Set Room Muted
          window.CTSMuted = !window.CTSMuted;
          VideoListElement.querySelector(
            "#videos-header-sound-cts path"
          ).setAttribute(
            "style",
            "stroke:" + (window.CTSMuted ? "#FF4136" : "#41b7ef")
          );
          VideoListElement.querySelector("#cts-vol-control").value =
            window.CTSMuted ? 0.1 : window.CTSRoomVolume * 100;

          // un/Mute Radio
          var radioelem = VideoListElement.querySelector("#music-radio-audio");
          if (radioelem)
            radioelem[
              window.CTSMuted ? "pause" : window.StationPlay ? "play" : "pause"
            ]();

          // un/Mute YouTube
          if (window.YouTube.onReadyYT) {
            window.YouTube.Player[
              window.CTSMuted
                ? "mute"
                : window.YouTube.Muted
                ? "mute"
                : "unMute"
            ]();
            window.YouTube.Player.setVolume(
              Math.ceil(
                window.CTSRoomVolume !== 1
                  ? window.YouTube.Volume * window.CTSRoomVolume
                  : window.YouTube.Volume
              )
            );
          }
          Cameras();
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector(
        "#PerformanceModeToggled"
      ).addEventListener(
        "click",
        function () {
          if (CTS.ChatDisplay) {
            CTS.PerformanceMode = !CTS.PerformanceMode;
            Save("PerformanceMode", JSON.stringify(CTS.PerformanceMode));
            PerformanceModeInit(CTS.PerformanceMode);
          }
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector("#FeaturedToggled").addEventListener(
        "click",
        function () {
          CTS.Featured = !CTS.Featured;
          Save("Featured", JSON.stringify(CTS.Featured));
          FeaturedCameras(CTS.Featured);
          Resize();
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector("#CameraBorderToggled").addEventListener(
        "click",
        function () {
          CTS.CameraBorderToggle = !CTS.CameraBorderToggle;
          Save("CameraBorderToggle", JSON.stringify(CTS.CameraBorderToggle));
          Cameras();
          Resize();
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector("#ChatColor").addEventListener(
        "click",
        function () {
          CTS.ChatStyleCounter++;
          Remove(
            VideoListElement,
            'style[id="' + (CTS.ChatStyleCounter - 1) + '"]'
          );
          Remove(
            ChatLogElement,
            'style[id="' + (CTS.ChatStyleCounter - 1) + '"]'
          );
          Remove(
            SideMenuElement,
            'style[id="' + (CTS.ChatStyleCounter - 1) + '"]'
          );
          var len = window.CTSChatCSS.length - 1;
          if (CTS.ChatStyleCounter > len) CTS.ChatStyleCounter = 0;
          StyleSet();
          Save("ChatStyle", CTS.ChatStyleCounter);
        },
        {
          passive: true
        }
      );
      ChatLogElement.querySelector(".cts-message-unread").addEventListener(
        "click",
        function () {
          UpdateScroll(1, true);
          CheckUnreadMessage();
        },
        {
          passive: true
        }
      );
      ChatLogElement.querySelector("#chat").addEventListener(
        "scroll",
        function (event) {
          var element = event.target;
          if (
            Math.floor(element.scrollTop + 50) >=
            element.scrollHeight - element.offsetHeight
          )
            CheckUnreadMessage(true);
        },
        {
          passive: true
        }
      );
      ChatLogElement.querySelector("#notification-content").addEventListener(
        "scroll",
        function (event) {
          var element = event.target;
          if (
            Math.floor(element.scrollTop + 50) >=
            element.scrollHeight - element.offsetHeight
          )
            CTS.NotficationScroll = true;
        },
        {
          passive: true
        }
      );
      if (CTS.NotificationToggle === 0) {
        ChatLogElement.querySelector(".notifbtn").addEventListener(
          "click",
          NotificationResize,
          {
            passive: true
          }
        );
      }
      VideoListElement.querySelector(".tcsettings").addEventListener(
        "click",
        function (event) {
          var arg;
          var broadcast;
          if (this.innerText === "→") {
            this.innerText = "←";
            arg = "block";
            broadcast = VideoListElement.querySelector(
              "#videos-footer-broadcast-wrapper"
            );
            var video = VideoListElement.querySelector("#videolist");
            broadcast.style.cssText = "";
            video.appendChild(broadcast);
          } else {
            this.innerText = "→";
            arg = "none";
            broadcast = VideoListElement.querySelector(
              "#videos-footer-broadcast-wrapper"
            );
            broadcast.style.cssText = "top:-15px;height:50px;";
            var bar = VideoListElement.querySelector("#videos-header");
            bar.appendChild(broadcast);
          }
          if (CTS.Room.PTT === false)
            VideoListElement.querySelector("#videos-header-mic").style.display =
              arg;
          //VideoListElement.querySelector("#videos-header-snapshot").style.display = arg;
          VideoListElement.querySelector(
            "#videos-header-fullscreen"
          ).style.display = arg;
          VideoListElement.querySelector(
            'span[title="Settings"]'
          ).style.display = arg;
          VideoListElement.querySelector(
            "#videos-header-sound-cts"
          ).style.display = arg;
          VideoListElement.querySelector("#cts-vol-control").style.display =
            arg;
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector(
        'button[id="BackgroundUpdateLeft"]'
      ).addEventListener(
        "click",
        function () {
          if (!Addon.active("BGIMG")) {
            CTS.MainBackgroundCounter++;
            if (CTS.MainBackgroundCounter === window.CTSImages.length)
              CTS.MainBackgroundCounter = 0;
            var background =
              'url("' +
              window.CTSImages[CTS.MainBackgroundCounter] +
              '") rgb(0, 0, 0) no-repeat';
            document.body.style.background = background;
            Save("MainBackground", background);
          }
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector(
        'button[id="BackgroundUpdateRight"]'
      ).addEventListener(
        "click",
        function () {
          if (!Addon.active("BGIMG")) {
            CTS.MainBackgroundCounter--;
            if (CTS.MainBackgroundCounter === -1)
              CTS.MainBackgroundCounter = window.CTSImages.length - 1;
            var background =
              'url("' +
              window.CTSImages[CTS.MainBackgroundCounter] +
              '") rgb(0, 0, 0) no-repeat';
            document.body.style.background = background;
            Save("MainBackground", background);
          }
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector(
        'button[id="FontSizeUpdate"]'
      ).addEventListener(
        "click",
        function () {
          CTS.FontSize += 5;
          if (CTS.FontSize >= 40) CTS.FontSize = 15;
          Save("FontSize", CTS.FontSize);
          TextAreaElement.style.fontSize = CTS.FontSize - 4 + "px";
          LoadMessage();
        },
        {
          passive: true
        }
      );
      VideoListElement.querySelector(
        'button[id="ChatCompact"]'
      ).addEventListener(
        "click",
        function () {
          CTS.ChatType = !CTS.ChatType;
          Save("ChatType", CTS.ChatType);
          LoadMessage();
        },
        {
          passive: true
        }
      );
      TextAreaElement.oninput = function () {
        CTS.Clipboard.Log = TextAreaElement.value;
      };
      TextAreaElement.onkeyup = function (e) {
        e = e || window.event;
        if (e.keyCode == 13) {
          // SAVE CLIPBOARD
          CTS.Clipboard.Message.push(CTS.Clipboard.Log);
          if (CTS.Clipboard.Message.length > 3) CTS.Clipboard.Message.shift();
          CTS.Clipboard.MessageLen = CTS.Clipboard.Message.length - 1;
        } else if (e.keyCode == 40) {
          // NAVIGATE CLIPBOARD (IF TYPING IS FALSE)
          if (CTS.Clipboard.Message.includes(CTS.Clipboard.Log)) {
            CTS.Clipboard.Counter =
              TextAreaElement.value == ""
                ? 0
                : CTS.Clipboard.Counter >= CTS.Clipboard.MessageLen
                ? 0
                : CTS.Clipboard.Counter + 1;
            TextAreaElement.value =
              CTS.Clipboard.Message[CTS.Clipboard.Counter];
          }
        } else if (e.keyCode == 38) {
          // NAVIGATE CLIPBOARD (IF TYPING IS FALSE)
          if (CTS.Clipboard.Message.includes(CTS.Clipboard.Log)) {
            CTS.Clipboard.Counter =
              TextAreaElement.value == ""
                ? CTS.Clipboard.MessageLen
                : CTS.Clipboard.Counter <= 0
                ? CTS.Clipboard.MessageLen
                : CTS.Clipboard.Counter - 1;
            TextAreaElement.value =
              CTS.Clipboard.Message[CTS.Clipboard.Counter];
          }
        }
      };
      //MUTATION OBSERVERS
      new MutationObserver(function (elem) {
        MainElement.querySelector("#modal")
          .shadowRoot.querySelector("#modal-window")
          .classList.remove("modal-show");
        if (MainElement.querySelector("#fatal"))
          Remove(MainElement.querySelector("#fatal"));
        if (MainElement.querySelector("#modal").hasChildNodes())
          MainElement.querySelector("#modal")
            .shadowRoot.querySelector("#modal-window")
            .classList.add("modal-show");
      }).observe(MainElement.querySelector("#modal"), {
        childList: true
      });
      new MutationObserver(function () {
        LoadMessage();
      }).observe(ChatLogElement.querySelector("#chat-instant"), {
        attributes: true,
        attributeFilter: ["class"],
        childList: false,
        characterData: false
      });
      new MutationObserver(function () {
        Cameras();
      }).observe(VideoListElement.querySelector(".videos-items:first-child"), {
        childList: true
      });
      new MutationObserver(function () {
        Cameras();
      }).observe(VideoListElement.querySelector(".videos-items:last-child"), {
        childList: true
      });
      new MutationObserver(function () {
        if (CTS.AutoMicrophone) {
          OpenMicrophone();
        }
      }).observe(
        VideoListElement.querySelector("#videos-footer-broadcast-wrapper"),
        {
          attributes: true,
          attributeFilter: ["class"]
        }
      );
      //BOOT UP - FIRST START
      NotificationDisplay();
      FeaturedCameras(CTS.Featured);
      Cameras();
    }
    //YOUTUBE FUNCTIONS
    function YouTubePIP() {
      if (window.YouTube.Popup == null || window.YouTube.Popup.closed) {
        window.YouTube.Popup = window.open(
          "https://www.youtube.com/watch?v=" +
            CTS.YouTube.CurrentTrack.ID +
            "&autoplay=1&t=" +
            Math.trunc(CTS.YouTube.CurrentTrack.offset + 2),
          "CTS YouTube - " + CTS.YouTube.CurrentTrack.title,
          "width=1080,height=720"
        );
        var detect_popup = setInterval(function () {
          if (window.YouTube.Popup.closed) {
            clearInterval(detect_popup);
            window.YouTube.Popup = null;
            window.YouTube.Init();
          }
        }, 1000);
        window.YouTube.Popup.focus();
        window.YouTube.stopVideo();
      }
    }
    function YouTubeDuration(calc) {
      var elem = !CTS.ThemeChange
        ? SideMenuElement.querySelector("#sidemenu-content")
        : ChatListElement;
      if (elem.querySelector(".duration"))
        elem.querySelector(".duration").style.width = calc + "%";
    }
    function YouTubeFullScreen() {
      var elem = !CTS.ThemeChange
        ? SideMenuElement.querySelector("#sidemenu-content")
        : ChatListElement;
      var playerElement = elem.querySelector("#player");
      var requestFullScreen =
        playerElement.requestFullScreen ||
        playerElement.mozRequestFullScreen ||
        playerElement.webkitRequestFullScreen;
      if (requestFullScreen) requestFullScreen.bind(playerElement)();
    }
    function YouTubeBehindChat(reset) {
      if (!CTS.ThemeChange) {
        if (reset !== true)
          window.YouTube.BehindChat = !window.YouTube.BehindChat;
        var elem = !CTS.ThemeChange
          ? SideMenuElement.querySelector("#sidemenu-content")
          : ChatListElement;
        elem.querySelector("#player").style.cssText = window.YouTube.BehindChat
          ? "position: fixed;top: 0;left: 0;height: 100%;z-index: -1;"
          : "";
        elem.querySelector(".overlay").style.cssText = window.YouTube.BehindChat
          ? "left: 0px;position: absolute; z-index: 1;"
          : "";
      }
    }
    function YouTubeMute(reset) {
      if (window.YouTube.onReadyYT) {
        if (window.CTSMuted) {
          window.YouTube.Player.mute();
        } else {
          if (reset === true) {
            window.YouTube.Player[window.YouTube.Muted ? "mute" : "unMute"]();
          } else {
            window.YouTube.Player[
              window.YouTube.Player.isMuted() ? "unMute" : "mute"
            ]();
            window.YouTube.Muted = window.YouTube.Player.isMuted()
              ? false
              : true;
          }
        }
        window.YouTube.Player.setVolume(
          Math.ceil(
            window.CTSRoomVolume !== 1
              ? window.YouTube.Volume * window.CTSRoomVolume
              : window.YouTube.Volume
          )
        );
      }
    }
    function YouTubeVolumeUp() {
      YouTubeVolumeController(true);
    }
    function YouTubeVolumeController(val) {
      if (window.YouTube.onReadyYT) {
        var vol = window.YouTube.Volume;
        vol = val
          ? vol < 100
            ? vol >= 50
              ? vol + 10
              : vol >= 20
              ? vol + 5
              : vol + 1
            : vol
          : vol > 1
          ? vol >= 60
            ? vol - 10
            : vol >= 25
            ? vol - 5
            : vol - 1
          : vol;
        window.YouTube.Volume = vol;
        window.YouTube.Player.setVolume(Math.ceil(vol * window.CTSRoomVolume));
        if (!window.CTSMuted && window.YouTube.Muted) {
          window.YouTube.Player.unMute();
          window.YouTube.Muted = false;
        }
        YouTubeVolumeIndicator();
      }
    }
    function YouTubeVolumeDown() {
      YouTubeVolumeController(false);
    }
    function YouTubeVolumeIndicator() {
      var elem = !CTS.ThemeChange
        ? SideMenuElement.querySelector("#sidemenu-content")
        : ChatListElement;
      elem.querySelector(".volume").style.width = window.YouTube.Volume + "%";
    }
    function YouTubeClose() {
      Send("yut_stop", [
        CTS.YouTube.CurrentTrack.ID,
        CTS.YouTube.CurrentTrack.duration,
        CTS.YouTube.CurrentTrack.title,
        CTS.YouTube.CurrentTrack.thumbnail,
        0
      ]);
    }
    function VerifyYouTube() {
      // Check Mod/JRMod
      if (
        CTS.UserList[arguments[0]].mod ||
        CTS.BotModList.includes(CTS.UserList[arguments[0]].username)
      )
        return true;
      // Check OP
      if (CTS.UserYT) {
        if (CTS.BotOPList.includes(CTS.UserList[arguments[0]].username))
          return true;
        if (
          CTS.BotOPList.includes("-ALL") &&
          isSafeListed(CTS.UserList[arguments[0]].username)
        )
          return true;
      }
      return false;
    }
    function CheckHost() {
      if (CTS.Host === 0 && CFG.checkForBot) {
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
    function CheckYouTube() {
      //CHECK YOUTUBE LINK VIA REGEX (NEARLY EVERY LINK ALLOWED SOME FORMATTING REQUIRED ON PLAYLIST)
      if (arguments[3] === undefined) arguments[3] = true;
      CTS.YouTube.XHR.type = arguments[1];
      var videoid = arguments[0].match(
        /http(?:s)?(?:\:\/\/)(?:w{1,3}\.)?(?:youtu(?:\.be|be.com))(?:\/v\/|\/)?(?:watch\?|playlist\?|embed\/|user\/|v\/|\/)(list\=[a-z0-9\-\_]{1,34}|(?:v\=)?[a-z0-9\-\_]{1,11})/i
      );
      if (videoid !== null) {
        videoid = videoid[1].replace(/v\=/g, "");
        //LINK IS PLAYLIST
        if (videoid.match(/list\=/i)) {
          if (arguments[3]) {
            videoid = videoid.replace(/list\=/, "");
            debug("YOUTUBE::PLAYLIST LINK GATHERER", videoid);
            CTS.YouTube.XHR.open(
              "GET",
              "https://www.googleapis.com/youtube/v3/playlistItems?playlistId=" +
                videoid +
                "&part=snippet&maxResults=25" +
                (arguments[2] !== undefined
                  ? "&pageToken=" + arguments[2]
                  : "") +
                "&type=video&eventType=completed&key=" +
                CTS.YouTube.API_KEY
            );
            CTS.YouTube.XHR.send();
          }
        } else {
          //LINK IS REGULAR
          CTS.YouTube.XHR.videoid = videoid;
          CTS.YouTube.VideoReturn = true;
          CTS.YouTube.XHR.open(
            "GET",
            "https://www.googleapis.com/youtube/v3/videos?id=" +
              CTS.YouTube.XHR.videoid +
              "&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=" +
              CTS.YouTube.API_KEY
          );
          CTS.YouTube.XHR.send();
          debug("YOUTUBE::LINK SEARCH", CTS.YouTube.XHR.videoid);
        }
      } else {
        //KEYWORD SEARCH
        if (CTS.YouTube.MessageQueueList.length <= 0) {
          arguments[0] = arguments[0].replace(/^(!yt )/, "");
          CTS.YouTube.SearchReturn = true;
          CTS.YouTube.XHR.open(
            "GET",
            "https://www.googleapis.com/youtube/v3/search?key=" +
              CTS.YouTube.API_KEY +
              "&maxResults=1&q=" +
              encodeURI(arguments[0]) +
              "&type=video&part=snippet"
          );
          CTS.YouTube.XHR.send();
          debug("YOUTUBE::KEYWORD SEARCH", arguments[0]);
        }
      }
    }
    function YoutubeBypass() {
      var videoid = arguments[0].match(
        /http(?:s)?(?:\:\/\/)(?:w{1,3}\.)?(?:youtu(?:\.be|be\.com))(?:\/v\/|\/)?(?:watch\?|embed\/|user\/|v\/|\/)(?:v\=)?([a-z0-9\-\_]{1,11})/i
      );
      if (videoid !== null) {
        CTS.SocketTarget.send(
          JSON.stringify({
            tc: "yut_play",
            item: {
              id: videoid[1],
              duration: 7200,
              offset: 0,
              title: "YOUTUBE IS BYPASSED - MODS ONLY"
            }
          })
        );
        debug("YOUTUBE::LINK BYPASS", videoid[1]);
      }
    }
    function YouTubePlayList() {
      CTS.YouTube.ShowQueue = arguments[0] !== undefined ? true : false;
      if (
        (!CTS.YouTube.Playing && CTS.Host == CTS.Me.handle) ||
        CTS.YouTube.Clear === true ||
        CTS.YouTube.ShowQueue === true
      )
      Send("yut_playlist");
    }
    function YouTubeTrackAdd() {
      if (CTS.YouTube.MessageQueueList[0] !== undefined) {
        if (CTS.YouTube.Busy === false) {
          if (CTS.YouTube.MessageQueueList.length > 0) {
            debug(
              "YOUTUBE::ID",
              CTS.YouTube.MessageQueueList[0].snippet.resourceId.videoId
            );
            CTS.YouTube.XHR.open(
              "GET",
              "https://www.googleapis.com/youtube/v3/videos?id=" +
                CTS.YouTube.MessageQueueList[0].snippet.resourceId.videoId +
                "&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=" +
                CTS.YouTube.API_KEY
            );
            CTS.YouTube.XHR.videoid =
              CTS.YouTube.MessageQueueList[0].snippet.resourceId.videoId;
            CTS.YouTube.XHR.send();
            CTS.YouTube.MessageQueueList.shift();
          }
        }
      }
    }
    function YouTubePlayListItems() {
      var len = arguments[0].length;
      for (var i = 0; i < len; i++) {
        if (
          CTS.YouTube.NotPlayable.includes(arguments[0][i].snippet.title) ===
          false
        ) {
          CTS.YouTube.MessageQueueList.push(arguments[0][i]);
        }
      }
    }
    function YouTubeTimeConvert() {
      //TIME CONVERSION FOR APPROPRIATE YOUTUBE DURATION TO SEND BACK
      var a = arguments[0].match(/\d+/g);
      if (
        arguments[0].indexOf("M") >= 0 &&
        arguments[0].indexOf("H") == -1 &&
        arguments[0].indexOf("S") == -1
      )
        a = [0, a[0], 0];
      if (arguments[0].indexOf("H") >= 0 && arguments[0].indexOf("M") == -1)
        a = [a[0], 0, a[1]];
      if (
        arguments[0].indexOf("H") >= 0 &&
        arguments[0].indexOf("M") == -1 &&
        arguments[0].indexOf("S") == -1
      )
        a = [a[0], 0, 0];
      var len = a.length;
      arguments[0] = 0;
      if (len == 3) {
        arguments[0] = arguments[0] + parseInt(a[0]) * 3600;
        arguments[0] = arguments[0] + parseInt(a[1]) * 60;
        arguments[0] = arguments[0] + parseInt(a[2]);
      }
      if (len == 2) {
        arguments[0] = arguments[0] + parseInt(a[0]) * 60;
        arguments[0] = arguments[0] + parseInt(a[1]);
      }
      if (len == 1) arguments[0] = arguments[0] + parseInt(a[0]);
      return arguments[0];
    }
    function BotCommandCheck() {
      //USER COMMANDS TO HOST
      if (isCommand(arguments[1])) {
        if (
          arguments[1].match(
            /^!play$|^!yt |^!ytbypass |^!ytclear$|^!ytskip$|^!ytqueue$/i
          )
        ) {
          BotCommandCheckYT(arguments[0], arguments[1]);
        } else if (
          arguments[1].match(
            /^!userkick |^!userban |^!userclose |^!nickkick |^!nickban |^!nickclose /i
          )
        ) {
          BotCommandCheckJR(arguments[0], arguments[1]);
        } else if (
          arguments[1].match(
            /^!whoisbot$|^!8ball |^!vote |^!coin$|^!chuck$|^!urb |^!dad$|^!advice$/i
          )
        ) {
          BotCommandCheckPUB(arguments[0], arguments[1]);
        } else if (CTS.UserList[arguments[0]].canGame && CTS.CanHostFishGames) {
          FishCommandCheck(arguments[0], arguments[1]);
        }
      }
      if (
        CTS.Game.Trivia.Started &&
        CTS.CanHostTriviaGames &&
        arguments[1].match(
          /^!iq$|^!triviahelp$|^!triviashop$|^!raid |^!ytbypass |^!spot$|^[a-d]$/i
        )
      )
        TriviaCommandCheck(arguments[0], arguments[1]);
    }
    function TriviaCommandCheck() {
      var User = CTS.UserList[arguments[0]];
      if (User.canGame) {
        if (isSafeListed(User.username)) {
          if (!isCommand(arguments[1])) {
            //NO CHEATERS
            var Guessed = CTS.Game.Trivia.AttemptList.includes(User.username);
            if (
              arguments[1].length == 1 &&
              CTS.Game.Trivia.ANum.includes(arguments[1].toUpperCase()) &&
              !Guessed &&
              !CTS.Game.Trivia.Waiting
            ) {
              if (CTS.Game.Trivia.Correct === arguments[1].toUpperCase()) {
                // Save Progress
                User.triviapoints += CTS.Game.Trivia.Worth;
                CTS.Game.Trivia.PlayerList[User.username] = User.triviapoints;
                Save(
                  "TriviaPlayerList",
                  JSON.stringify(CTS.Game.Trivia.PlayerList)
                );
                // Send Output
                Send(
                  "msg",
                  "[TRIVIA]\n" +
                    User.username +
                    ", that's correct!\nYou've gained " +
                    CTS.Game.Trivia.Worth +
                    " IQ points to use towards the store or save.\n\nYour added IQ puts you at " +
                    User.triviapoints +
                    " points!"
                );
                if (User.triviapoints > CTS.Game.Trivia.HighScore[1]) {
                  CTS.Game.Trivia.HighScore[0] = User.username;
                  CTS.Game.Trivia.HighScore[1] = User.triviapoints;
                  // Save HighScore
                  Save(
                    "TriviaHighScore",
                    JSON.stringify(CTS.Game.Trivia.HighScore)
                  );
                }
                // Wait
                Trivia.Wait();
              } else {
                CTS.Game.Trivia.Attempts++;
                CTS.Game.Trivia.AttemptList.push(User.username);
                Send(
                  "msg",
                  "[TRIVIA]\n" +
                    User.username +
                    " that's wrong however you may attempt next rounds question."
                );
                if (CTS.Game.Trivia.Attempts == 3) {
                  Send(
                    "msg",
                    "[TRIVIA]\nNobody got it!\nNext round will start in shortly.\nThe answer however was: " +
                      CTS.Game.Trivia.Correct
                  );
                  Trivia.Wait();
                }
              }
            }
          } else {
            TriviaCommand(arguments[0], arguments[1]);
          }
        }
      }
    }
    function TriviaCommand() {
      var User = CTS.UserList[arguments[0]];
      if (!User.mod && !CTS.BotModList.includes(User.username)) {
        if (arguments[1].match(/^!ytbypass/i) && CTS.Room.YT_ON) {
          if (
            CTS.Game.Trivia.PlayerList[User.username] >=
            CTS.Game.Trivia.PriceList.ytbypass
          ) {
            User.triviapoints -= CTS.Game.Trivia.PriceList.ytbypass;
            CTS.Game.Trivia.PlayerList[User.username] = User.triviapoints;
            Save(
              "TriviaPlayerList",
              JSON.stringify(CTS.Game.Trivia.PlayerList)
            );
            Send(
              "msg",
              "[TRIVIA]\n" +
                User.username +
                ",\nyou've just purchased ytbypass for " +
                CTS.Game.Trivia.PriceList.ytbypass +
                " IQ Points!\n\nHopefully you inserted the link right!:)"
            );
            YoutubeBypass(arguments[1]);
          } else {
            TriviaTooPoor(User.username);
          }
        }
      }
      if (CTS.Me.owner) {
        if (!User.owner) {
          if (arguments[1].match(/^!raid /i)) {
            if (
              CTS.Game.Trivia.PlayerList[User.username] >=
              CTS.Game.Trivia.PriceList.raid
            ) {
              var raid = arguments[1].match(
                /^(?:!raid )(?:<a href=")(?:https?:\/\/)?tinychat\.com(?!\/#)\/(?!gifts|settings|coins|subscription|promote)(?:room\/)?([a-z0-9]{3,16})/i
              );
              if (raid !== null) {
                User.triviapoints -= CTS.Game.Trivia.PriceList.raid;
                CTS.Game.Trivia.PlayerList[User.username] = User.triviapoints;
                Save(
                  "TriviaPlayerList",
                  JSON.stringify(CTS.Game.Trivia.PlayerList)
                );
                Send(
                  "msg",
                  "[TRIVIA]\n" +
                    User.username +
                    ",\nyou've just purchased raid for " +
                    CTS.Game.Trivia.PriceList.raid +
                    " IQ Points!\n\nCTS Users be prepared to teleport in several seconds!"
                );
                Send(
                  "msg",
                  "[TRIVIA]\nREMEMBER HAVE FUN IF YOU DON'T WARP CLICK THE LINK SHORTLY!\n\nhttps://tinychat.com/room/" +
                    raid[1]
                );
                // WAIT
                setTimeout(function () {
                  Send("msg", "!raid https://tinychat.com/room/" + raid[1]);
                }, 10000);
              } else {
                Send(
                  "msg",
                  "[TRIVIA]\nThis is not a valid link/format for raid.\n\n(ex. !raid https://tinychat.com/stonercircle)\n\nThis is a costly operation, can't mess around if you want to be captain!"
                );
              }
            } else {
              TriviaTooPoor(User.username);
            }
          } else if (arguments[1].match(/^!spot$/i)) {
            if (
              CTS.Game.Trivia.PlayerList[User.username] >=
              CTS.Game.Trivia.PriceList.spot
            ) {
              var rand = Rand(0, CTS.Camera.List.length - 1),
                target = HandleToUser(CTS.Camera.List[rand]);
              if (target != -1) {
                User.triviapoints -= CTS.Game.Trivia.PriceList.spot;
                CTS.Game.Trivia.PlayerList[User.username] = User.triviapoints;
                Save(
                  "TriviaPlayerList",
                  JSON.stringify(CTS.Game.Trivia.PlayerList)
                );
                Send(
                  "msg",
                  "[TRIVIA]\n" +
                    User.username +
                    ",\nyou've just purchased " +
                    CTS.UserList[target].username +
                    "'s spot for " +
                    CTS.Game.Trivia.PriceList.spot +
                    " IQ Points!\n"
                );
                if (CTS.UserList[target].handle !== CTS.Me.handle) {
                  Send("stream_moder_close", CTS.Camera.List[rand]);
                } else {
                  CTS.SocketTarget.send(
                    JSON.stringify({
                      tc: "stream_close",
                      handle: CTS.Me.handle
                    })
                  );
                }
              }
            } else {
              TriviaTooPoor(User.username);
            }
          }
        }
      }
      if (arguments[1].match(/^!triviashop$/i)) {
        Send(
          "msg",
          "[TRIVIA]\n" +
            (CTS.Me.owner
              ? "!raid\n[FOR " +
                CTS.Game.Trivia.PriceList.raid +
                "IQ]\n\n!spot\n[FOR " +
                CTS.Game.Trivia.PriceList.spot +
                "IQ]\n\n"
              : "") +
            "!ytbypass <link>\n[FOR " +
            CTS.Game.Trivia.PriceList.ytbypass +
            "IQ]"
        );
      } else if (arguments[1].match(/^!triviahelp$/i)) {
        Send("msg", "[TRIVIA]\n!iq\n!triviashop");
      } else if (arguments[1].match(/^!iq$/i)) {
        Send(
          "msg",
          "[TRIVIA]\n" +
            User.username +
            ",\nYou have an IQ of " +
            User.triviapoints +
            "."
        );
      }
    }
    function TriviaTooPoor() {
      Send(
        "msg",
        "[TRIVIA]\n" + arguments[0] + ",\nyou cannot afford this right now!"
      );
    }
    function BotCommandCheckYT() {
      //ROOM IS PAID AND YOUTUBE IS ONLINE (TC SET)
      if (CTS.Room.YT_ON) {
        if (arguments[1].match(/^!play$/i)) {
          if (CTS.UserList[arguments[0]].mod) YouTubePlayList();
        } else if (arguments[1].match(/^!yt /i)) {
          BotCommand(1, arguments[0], arguments[1]);
        } else if (arguments[1].match(/^!ytbypass /i)) {
          BotCommand(6, arguments[0], arguments[1]);
        } else if (arguments[1].match(/^!ytclear$/i)) {
          BotCommand(2, arguments[0]);
        } else if (arguments[1].match(/^!ytskip$/i)) {
          BotCommand(3, arguments[0]);
        } else if (arguments[1].match(/^!ytqueue$/i)) {
          BotCommand(4, arguments[0]);
        }
      }
    }
    function BotCommandCheckJR() {
      //MOD/JR.MOD
      if (
        CTS.BotModList.includes(CTS.UserList[arguments[0]].username) ||
        CTS.UserList[arguments[0]].mod
      ) {
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
      if (arguments[1].match(/^!whoisbot$/i)) {
        var t = Date.now();
        if (t - window.lastBotCheck > CFG.botCheckCooldown) {
          BotCommand(5, arguments[0]);
          window.lastBotCheck = t;
        }
      }
      if (arguments[1].match(/^!vote /i)) Vote(arguments[0], arguments[1]);
      // PUBLIC COMMANDS
      if (CTS.PublicCommandToggle) {
        if (arguments[1].match(/^!8ball [\w\s]*\??/i)) {
          if (
            CTS.UserList[arguments[0]].mod ||
            isSafeListed(CTS.UserList[arguments[0]].username)
          )
            Send(
              "msg",
              "[8BALL]\n" +
                window.CTSEightBall[Rand(0, window.CTSEightBall.length - 1)]
            );
        } else if (arguments[1].match(/^!coin$/i)) {
          if (
            CTS.UserList[arguments[0]].mod ||
            isSafeListed(CTS.UserList[arguments[0]].username)
          )
            Send(
              "msg",
              "[COIN FLIP]\nThe coin landed on " +
                (Rand(0, 1) == 1 ? "heads" : "tails") +
                "!"
            );
        } else {
          if (arguments[1].match(/^!chuck$/i)) {
            Chuck(CTS.UserList[arguments[0]].username);
          } else if (arguments[1].match(/^!urb /i)) {
            Urb(arguments[1], CTS.UserList[arguments[0]].username);
          } else if (arguments[1].match(/^!dad$/i)) {
            Dad(CTS.UserList[arguments[0]].username);
          } else if (arguments[1].match(/^!advice$/i)) {
            Advice(CTS.UserList[arguments[0]].username);
          }
        }
      }
    }
    function BotForce() {
      if (CTS.Host == CTS.Me.handle) return;
      setTimeout(function () {
        if (Date.now() - CTS.botLastSet > 120000) {
          SetBot(false);
        } else BotForce();
      }, 30000);
    }
    function BotCheck() {
      if (CTS.UserList[arguments[0]].mod) {
        //CHECK HOST
        if (arguments[1].match(/^!bot$/i)) {
          //SET HOST
          CTS.Host = arguments[2].handle;
          CTS.HostWaiting = false;
          CTS.botLastSet = Date.now();
          if (
            CFG.alwaysBot &&
            CTS.Me.handle != CTS.UserList[arguments[0]].handle
          ) {
            BotForce();
          }
          //RESET GAMES
          if (CTS.Host != CTS.Me.handle && CTS.Game.NoReset)
            CTS.Game.NoReset = true;
          if (
            arguments[2].handle === CTS.Host &&
            CTS.HostWaiting === false &&
            !CTS.Game.NoReset
          ) {
            if (CTS.Me.handle !== arguments[2].handle) {
              CTS.Game.NoReset = false;
              Fish.Reset();
              // Reset Trivia
              Trivia.Reset();
            }
          }
          //IF CLIENT(ME) BECOMES HOST CHECK YOUTUBE IF ENABLED
          if (CTS.Me.handle == arguments[2].handle && CTS.Room.YT_ON)
            YouTubePlayList();
          //ELSE KEEP ON UNLESS HOSTWAITING (!WHOISBOT)
        } else if (CTS.HostWaiting === true) {
          CTS.HostAttempt++;
          //SET BOT IF NO RESPONSE IN 10 MESSAGES or 10 SECONDS
          if (CTS.HostAttempt == 1) {
            setTimeout(function () {
              //CHECK WAITING STATE OR IF HOST HAS CHANGED
              if (CTS.HostWaiting === true && CTS.Host === 0) SetBot(false);
            }, Rand(60, 90) * 1000);
          }
          //SETS BOT FORCEFULLY ON 10 MESSAGES CANCELING TIMER EVENT WHEN IT QUEUES
          //if (CTS.HostAttempt == 30) SetBot(false);
        }
      }
    }
    function Chuck() {
      //OPEN REQUEST
      if (isSafeListed(arguments[0])) {
        CTS.Chuck.XHR.open("GET", "https://api.chucknorris.io/jokes/random");
        CTS.Chuck.XHR.send();
      }
    }
    function Urb() {
      //CHECK TERM
      if (isSafeListed(arguments[1])) {
        var urban = arguments[0].match(/^!urb ([\w ]*)/i);
        if (urban !== null) {
          //OPEN REQUEST
          CTS.Urb.XHR.open(
            "GET",
            "https://api.urbandictionary.com/v0/define?term=" + urban[1]
          );
          CTS.Urb.XHR.send();
        }
      }
    }
    function Dad() {
      //OPEN REQUEST
      if (isSafeListed(arguments[0])) {
        CTS.Dad.XHR.open("GET", "https://icanhazdadjoke.com/");
        CTS.Dad.XHR.setRequestHeader("Accept", "application/json");
        CTS.Dad.XHR.send();
      }
    }
    function Advice() {
      //OPEN REQUEST
      if (isSafeListed(arguments[0])) {
        CTS.Advice.XHR.open("GET", "https://api.adviceslip.com/advice");
        CTS.Advice.XHR.setRequestHeader("Accept", "application/json");
        CTS.Advice.XHR.send();
      }
    }
    //MESSAGE FUNCTION
    function CreateMessage() {
      //SCROLLED UP? MISSED A MESSAGE?
      CheckUnreadMessage();
      // POST NEW CHAT ITEM IF ACTIVECHAT IS OUR CURRENT CHAT
      if (arguments[7] == GetActiveChat()) {
        var stack = ChatLogElement.querySelector(
          "#cts-chat-content>.message:last-child cts-message-html:last-child"
        );
        if (
          arguments[4] == CTS.CreateMessageLast &&
          stack !== null &&
          CTS.ChatType
        ) {
          // Stack
          stack.insertAdjacentHTML(
            "afterend",
            '<cts-message-html><div class="stackmessage">' +
              (CTS.TimeStampToggle
                ? '<div class="ctstimehighlight"> ' + arguments[0] + " </div>"
                : "") +
              '<span id="html" class="message common"style="font-size:' +
              CTS.FontSize +
              'px;">' +
              arguments[5] +
              "</span></div></CTS-message-html>"
          );
        } else {
          CTS.CreateMessageLast = arguments[4];
          ChatLogElement.querySelector("#cts-chat-content").insertAdjacentHTML(
            "beforeend",
            '<div class="message' +
              (CTS.Avatar ? " common " : " ") +
              (CTS.HighlightList.includes(arguments[3]) || arguments[6]
                ? "highlight"
                : "") +
              '" ' +
              (arguments[2] === "" ? 'style="padding-left:3px;"' : "") +
              ">" +
              (arguments[2] == ""
                ? ""
                : CTS.Avatar
                ? '<a href="#" class="avatar"><div><img src="' +
                  arguments[2] +
                  '"></div></a>'
                : "") +
              "<div onclick=\"UserProfileView('" +
              arguments[3] +
              '\')" class="nickname" style="background:' +
              arguments[1] +
              ';">' +
              arguments[4] +
              (CTS.TimeStampToggle
                ? '<div class="ctstime"> ' + arguments[0] + " </div>"
                : "") +
              '</div><div class="content"><cts-message-html><span id="html" class="message common"style="font-size:' +
              CTS.FontSize +
              'px;">' +
              arguments[5] +
              "</span></CTS-message-html></div></div>"
          );
        }
      } else {
        CTS.CreateMessageLast = undefined;
      }
      UpdateScroll(1, false);
    }
    function LoadMessage() {
      var Chat = ChatLogElement.querySelector("#cts-chat-content");
      CTS.ChatScroll = true;
      Chat.innerHTML = "";
      CheckUnreadMessage();
      if (CTS.Message[GetActiveChat()]) {
        //POST MESSAGE
        var len = CTS.Message[GetActiveChat()].length,
          LoadMessageLast;
        for (var ChatIndex = 0; ChatIndex < len; ChatIndex++) {
          if (
            CTS.Message[GetActiveChat()][ChatIndex].nick == LoadMessageLast &&
            CTS.ChatType
          ) {
            // Stack
            ChatLogElement.querySelector(
              "#cts-chat-content>.message:last-child cts-message-html:last-child"
            ).insertAdjacentHTML(
              "afterend",
              '<cts-message-html><div class="stackmessage">' +
                (CTS.TimeStampToggle
                  ? '<div class="ctstimehighlight"> ' +
                    CTS.Message[GetActiveChat()][ChatIndex].time +
                    " </div>"
                  : "") +
                '<span id="html" class="message common" style="font-size:' +
                CTS.FontSize +
                'px;">' +
                CTS.Message[GetActiveChat()][ChatIndex].msg +
                "</span></div></CTS-message-html>"
            );
          } else {
            LoadMessageLast = CTS.Message[GetActiveChat()][ChatIndex].nick;
            ChatLogElement.querySelector(
              "#cts-chat-content"
            ).insertAdjacentHTML(
              "beforeend",
              '<div class="message' +
                (CTS.Avatar ? " common " : " ") +
                (CTS.HighlightList.includes(
                  CTS.Message[GetActiveChat()][ChatIndex].username
                ) || CTS.Message[GetActiveChat()][ChatIndex].mention
                  ? "highlight"
                  : "") +
                '" ' +
                (CTS.Message[GetActiveChat()][ChatIndex].avatar === ""
                  ? 'style="padding-left:3px;"'
                  : "") +
                ">" +
                (CTS.Avatar
                  ? '<a href="#" class="avatar"><div><img src="' +
                    CTS.Message[GetActiveChat()][ChatIndex].avatar +
                    '"></div></a>'
                  : "") +
                "<div onclick=\"UserProfileView('" +
                CTS.Message[GetActiveChat()][ChatIndex].username +
                '\')" class="nickname" style="-webkit-box-shadow: 0 0 6px ' +
                CTS.Message[GetActiveChat()][ChatIndex].namecolor +
                ";box-shadow: 0 0 6px " +
                CTS.Message[GetActiveChat()][ChatIndex].namecolor +
                ";background:" +
                CTS.Message[GetActiveChat()][ChatIndex].namecolor +
                ';">' +
                CTS.Message[GetActiveChat()][ChatIndex].nick +
                (CTS.TimeStampToggle
                  ? '<div class="ctstime"> ' +
                    CTS.Message[GetActiveChat()][ChatIndex].time +
                    " </div>"
                  : "") +
                '</div><div class="content"><cts-message-html><span id="html" class="message common" style="font-size:' +
                CTS.FontSize +
                'px;">' +
                CTS.Message[GetActiveChat()][ChatIndex].msg +
                "</span></CTS-message-html></div></div>"
            );
          }
          if (ChatIndex == len - 1)
            CTS.CreateMessageLast =
              CTS.Message[GetActiveChat()][ChatIndex].nick;
        }
      } else {
        //START PM
        CTS.Message[GetActiveChat()] = [];
      }
      UpdateScroll(1, false);
      UpdateScroll(2, false);
    }
    function CreateGift() {
      if (CTS.DisableGifts) return;
      var gift = arguments[0].gift,
        from = !gift.anon ? arguments[0].from.name : "ANONYMOUS",
        to = arguments[0].to.name,
        comment = gift.comment;
      CTS.Message[0].push({
        time: Time(),
        namecolor: "#3f69c0",
        avatar: "",
        username: "",
        nick: "SPECIAL DELIVERY",
        msg:
          '<br><div class="gift"><center>' +
          gift.name +
          '</center><br><a href="' +
          gift.store_url +
          '" target="_blank"><img style="display: block;margin-left: auto;margin-right: auto;width: 50%;" src="' +
          gift.url +
          '"></a><center>' +
          (comment !== "" ? "<br>" + comment : "") +
          "<br>From:<br>" +
          from +
          "<br>To:<br>" +
          to +
          "</center></div><br>",
        mention: true
      });
      var msg = CTS.Message[0][CTS.Message[0].length - 1];
      CreateMessage(
        msg.time,
        msg.namecolor,
        msg.avatar,
        msg.username,
        msg.nick,
        msg.msg,
        msg.mention,
        0
      );
      if (
        window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
          .enableSound &&
        !window.CTSMuted
      ) {
        window.CTSSound.GIFT.volume = window.CTSRoomVolume;
        window.CTSSound.GIFT.play();
      }
      UpdateScroll(1, true);
    }
    function AKB() {
      //WATCH OR REMOVE USERS
      if (
        CTS.AutoKick === false &&
        CTS.AutoBan === false &&
        arguments[0] === true
      ) {
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
        var temp = [];
        if (Addon.active("AKB")) temp = Addon.get("AKB");
        //DEFAULT SAFELIST
        if (!isSafeListed(arguments[0].username.toUpperCase())) {
          if (arguments[0].subscription > 0 || arguments[0].mod === true) {
            if (CTS.SafeList.length < 10000) {
              CTS.SafeList.push(arguments[0].username.toUpperCase());
              Save("AKB", JSON.stringify(CTS.SafeList));
              debug(
                "SAFELIST::ADDED",
                arguments[0].username.toUpperCase() + ":" + arguments[0].handle
              );
            }
          } else {
            if (arguments[0].lurker === false) {
              AKB(
                true,
                arguments[0].handle,
                arguments[0].username.toUpperCase()
              );
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
        var a = CTS.SafeList.indexOf(CTS.UserList[target].username);
        if (a !== -1) {
          //REMOVE
          if (arguments[1]) {
            debug(
              "SAFELIST::",
              "REMOVE USER " + CTS.UserList[target].username + " FROM SAFELIST"
            );
            Alert(
              GetActiveChat(),
              "✓ Removing " + CTS.UserList[target].username + " from safelist!"
            );
            CommandList.saferemove(a);
          } else {
            //GETID
            return a;
          }
        }
      }
    }
    function CheckUnreadMessage() {
      if (
        Math.floor(ChatLogElement.querySelector("#chat").scrollTop + 50) >=
          ChatLogElement.querySelector("#chat").scrollHeight -
            ChatLogElement.querySelector("#chat").offsetHeight ||
        arguments[0] !== undefined
      ) {
        CTS.MissedMsg = 0;
        CTS.ChatScroll = true;
        ChatLogElement.querySelector(".cts-message-unread").style.display =
          "none";
      } else {
        CTS.MissedMsg++;
        CTS.ChatScroll = false;
        ChatLogElement.querySelector(".cts-message-unread").style.display =
          "block";
        ChatLogElement.querySelector(".cts-message-unread").innerHTML =
          "There are " + CTS.MissedMsg + " unread message(s)!";
      }
    }
    function GetActiveChat() {
      var elem = ChatListElement.querySelector(".active");
      if (elem) return elem.getAttribute("data-chat-id");
      return 0;
    }
    function CheckImgur() {
      if (CTS.Imgur) {
        var i = arguments[0].match(
          /https?:\/\/i\.imgur\.com\/[a-zA-Z0-9]*\.(jpeg|jpg|gif|png|mp4)/
        );
        if (i !== null) {
          CTS.ImgurWarning++;
          arguments[0] =
            i[1] == "mp4"
              ? '<center>(Video Below)\n<video onclick="if (this.paused) {this.play();}else{this.pause();}" oncontextmenu="return false;" width="288px" height="162px"><source src="' +
                i[0] +
                '" type="video/mp4" /><source src="https://i.imgur.com/qLOIgom.mp4" type="video/mp4" /></video>\n<a href="' +
                i[0] +
                '" target="_blank">Direct Link</a></center>'
              : '<center><img src="' +
                i[0] +
                '" width="320px" height="240px" />\n<a href="' +
                i[0] +
                '" target="_blank">Direct Link</a></center>';
          if (CTS.ImgurWarning < 2 && CTS.CanSeeTips)
            Alert(
              GetActiveChat(),
              "[TIP]\nYou can !imgurtoggle at anytime to stop unwanted images showing through."
            );
        }
      }
      return arguments[0];
    }
    function TTS() {
      var utter = new window.SpeechSynthesisUtterance(arguments[0]);
      utter.voice = CTS.TTS.voices[0];
      utter.rate = 1.0;
      utter.pitch = 0.5;
      CTS.TTS.synth.speak(utter);
    }
    function isCommand() {
      return arguments[0].match(/^!/);
    }
    function RoomUsers() {
      if (CTS.ScriptInit)
        UserListElement.querySelector("#header>span>span").innerText =
          " : " + CTS.UserList.length;
    }
    function LineSpam() {
      var LineBreaks = (arguments[0].match(/\n|\r/g) || []).length;
      if (LineBreaks >= 14 && arguments[1] === false) return true;
      return false;
    }
    function GamePrevention() {
      if (
        !CTS.CanSeeGames &&
        arguments[1] &&
        arguments[0].match(/^\[(FISHING BOAT|TRIVIA)\]/)
      )
        return false;
      return true;
    }
    function UpdateScroll() {
      if (arguments[0] === 1 && (CTS.ChatScroll || arguments[1] === true))
        ChatLogElement.querySelector("#chat").scrollTop =
          ChatLogElement.querySelector("#chat").scrollHeight;
      if (
        arguments[0] === 2 &&
        (CTS.NotificationScroll || arguments[1] === true) &&
        CTS.NotificationToggle == 0
      )
        ChatLogElement.querySelector("#notification-content").scrollTop =
          ChatLogElement.querySelector("#notification-content").scrollHeight;
    }
    function DecodeTXT() {
      var txt = document.createElement("textarea");
      txt.innerHTML = arguments[0];
      return txt.value;
    }
    function HTMLtoTXT() {
      var _this4 = this;
      var p = document.createElement("p");
      var text = document.createTextNode(arguments[0]);
      p.appendChild(text);
      p = p.innerHTML.replace(
        /(?:(?:(?:https?|ftps?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/gim,
        function (url) {
          _newArrowCheck(this, _this4);
          try {
            if (new URL(url).hostname.includes("xn--")) {
              return "URL BLOCKED";
            } else {
              return '<a target="_blank" href="' + url + '">' + url + "</a>";
            }
          } catch (e) {
            return "URL BLOCKED";
          }
        }.bind(this)
      );
      p = p
        .replace(/[\u2680-\u2685]/g, '<span style="font-size:275%;">$&</span>')
        .replace(/\n|\r/g, "<br>");
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
      var match = arguments[0].trim().match(/(\d+):(\d+)\s?((?:am|pm))/i);
      var t = {
        hours: parseInt(match[1]),
        minutes: parseInt(match[2]),
        period: match[3].toLowerCase()
      };
      if (t.hours === 12) {
        if (t.period === "am")
          arguments[1].setHours(t.hours - 12, t.minutes, 0);
        if (t.period === "pm") arguments[1].setHours(t.hours, t.minutes, 0);
      } else {
        if (t.period === "am") arguments[1].setHours(t.hours, t.minutes, 0);
        if (t.period === "pm")
          arguments[1].setHours(t.hours + 12, t.minutes, 0);
      }
      return arguments[1];
    }
    function PushPM() {
      var text = HTMLtoTXT(arguments[1]),
        list;
      if (arguments[2] !== undefined) {
        list = CTS.UserList[arguments[2]];
        if (isSafeListed(CTS.UserList[arguments[2]].username))
          text = CheckImgur(text);
      } else {
        list = CTS.Me;
        text = CheckImgur(text);
      }
      CTS.Message[arguments[0]].push({
        time: Time(),
        namecolor: list.namecolor,
        avatar: list.avatar,
        username: list.username,
        nick: list.nick,
        msg: text,
        mention: false
      });
      if (arguments[0] == GetActiveChat()) {
        var msg =
          CTS.Message[arguments[0]][CTS.Message[arguments[0]].length - 1];
        CreateMessage(
          msg.time,
          list.namecolor,
          list.avatar,
          list.username,
          list.nick,
          msg.msg,
          msg.mention,
          arguments[0]
        );
        UpdateScroll(1, false);
      }
    }
    function Time() {
      return new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true
      });
    }
    function DateTime() {
      return new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true
      });
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
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(arguments[1])
      );
      element.setAttribute("download", arguments[0]);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function StyleSet() {
      // Chat
      var style = document.createElement("style");
      style.setAttribute("id", CTS.ChatStyleCounter);
      style.innerHTML =
        window.CTSChatCSS[CTS.ChatStyleCounter][0] +
        ":host, #videolist {background-color:unset;}";
      ChatLogElement.appendChild(style);
      // Video
      style = document.createElement("style");
      style.setAttribute("id", CTS.ChatStyleCounter);
      style.innerHTML =
        window.CTSChatCSS[CTS.ChatStyleCounter][1] +
        ":host, #videolist {background-color:unset;}";
      VideoListElement.appendChild(style);
      // Side Menu
      style = document.createElement("style");
      style.setAttribute("id", CTS.ChatStyleCounter);
      style.innerHTML =
        window.CTSChatCSS[CTS.ChatStyleCounter][2] +
        ":host, #videolist {background-color:unset;}";
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
      ChatLogElement.querySelector("#chat-wrapper").style.cssText =
        "min-width:400px;width:calc(400px + " +
        CTS.ChatWidth +
        "%);max-width:calc(400px + " +
        CTS.ChatWidth +
        "%);" +
        (CTS.UserListDisplay
          ? "top:unset;min-height:calc(100% - " +
            CTS.ChatHeight +
            "% - 119px)!important;max-height:calc(100% - " +
            CTS.ChatHeight +
            "% - 119px)!important;"
          : "bottom:0;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
      TitleElement.querySelector("#room-header").style.cssText =
        "min-width:400px;width:calc(400px + " +
        CTS.ChatWidth +
        "%);max-width:calc(400px + " +
        CTS.ChatWidth +
        "%)!important;top:" +
        (CTS.UserListDisplay
          ? "calc(" + CTS.ChatHeight + "% + 84px);"
          : "84px;");
      VideoListElement.querySelector(
        "#videos-footer-broadcast-wrapper"
      ).style.cssText =
        "bottom:unset;min-width:400px;width:calc(400px + " +
        CTS.ChatWidth +
        "%);max-width:calc(400px + " +
        CTS.ChatWidth +
        "%);top:" +
        (CTS.UserListDisplay
          ? "calc(" + CTS.ChatHeight + "% + 34px);"
          : "unset;top:34px;");
      VideoListElement.querySelector("#videos-header").style.cssText =
        !CTS.UserListDisplay
          ? "top:0;right: 54px;"
          : "bottom:unset;top:" + CTS.ChatHeight + "%;";
      SideMenuElement.querySelector("#sidemenu").style.cssText =
        !CTS.UserListDisplay
          ? "display:none"
          : "min-width:400px;width:calc(400px + " +
            CTS.ChatWidth +
            "%);max-width:calc(400px + " +
            CTS.ChatWidth +
            "%)!important;height:" +
            CTS.ChatHeight +
            "%!important;";
      //UserListElement.querySelector("#button-banlist").style.cssText = "top:calc(" + CTS.ChatHeight + "% + 89px);";
      document.querySelector("#content").style.cssText =
        "width:calc(100% " +
        (CTS.ChatDisplay ? "- (400px + " + CTS.ChatWidth + "%)" : "") +
        ")";
      VideoListElement.querySelector("#videos-footer").style.cssText =
        "display:block;top:" +
        (CTS.UserListDisplay
          ? "calc(" + CTS.ChatHeight + "% + 119px);"
          : "119px;") +
        "right:-70px;display:block;";
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
      ChatLogElement.querySelector("#chat-wrapper").style.cssText =
        !CTS.ChatDisplay
          ? "display:none"
          : "min-width:400px;width:calc(400px + " +
            CTS.ChatWidth +
            "%);max-width:calc(400px + " +
            CTS.ChatWidth +
            "%);" +
            (CTS.UserListDisplay
              ? "top:unset;min-height:calc(100% - " +
                CTS.ChatHeight +
                "% - 119px)!important;max-height:calc(100% - " +
                CTS.ChatHeight +
                "% - 119px)!important;"
              : "bottom:0;;min-height:calc(100% - 120px)!important;max-height: calc(100% - 120px)!important;");
      TitleElement.querySelector("#room-header").style.cssText =
        !CTS.ChatDisplay
          ? "display:none"
          : "min-width:400px;width:calc(400px + " +
            CTS.ChatWidth +
            "%);max-width:calc(400px + " +
            CTS.ChatWidth +
            "%)!important;top:" +
            (CTS.UserListDisplay
              ? "calc(" + CTS.ChatHeight + "% + 84px);"
              : "84px;");
      VideoListElement.querySelector(
        "#videos-footer-broadcast-wrapper"
      ).style.cssText = !CTS.ChatDisplay
        ? "bottom:0;top:unset;width:100%;position:relative;"
        : "bottom:unset;min-width:400px;width:calc(400px + " +
          CTS.ChatWidth +
          "%);max-width:calc(400px + " +
          CTS.ChatWidth +
          "%);top:" +
          (CTS.UserListDisplay
            ? "calc(" + CTS.ChatHeight + "% + 34px);"
            : "34px;bottom:unset;");
      VideoListElement.querySelector("#videos-header").style.cssText =
        !CTS.ChatDisplay
          ? "display:none"
          : CTS.UserListDisplay
          ? "bottom:unset;top:" + CTS.ChatHeight + "%;"
          : "bottom:unset;top: 0;right: 54px;";
      SideMenuElement.querySelector("#sidemenu").style.cssText =
        !CTS.ChatDisplay || !CTS.UserListDisplay
          ? "display:none"
          : "min-width:400px;width:calc(400px + " +
            CTS.ChatWidth +
            "%);max-width:calc(400px + " +
            CTS.ChatWidth +
            "%)!important;height:" +
            CTS.ChatHeight +
            "%!important;";
      //UserListElement.querySelector("#button-banlist").style.cssText = (!CTS.ChatDisplay) ? "display:none" : "top:calc(" + CTS.ChatHeight + "% + 89px);";
      document.querySelector("#content").style.cssText =
        "width:calc(100% " +
        (CTS.ChatDisplay ? "- (400px + " + CTS.ChatWidth + "%)" : "") +
        ")";
      VideoListElement.querySelector("#videos-footer").style.cssText =
        "display:block;top:" +
        (CTS.UserListDisplay
          ? "calc(" + CTS.ChatHeight + "% + 119px);"
          : "119px;") +
        "right:-70px;display:block;";
      CTS.PerformanceMode = false;
      PerformanceModeInit(CTS.PerformanceMode);
      UpdateScroll(1, true);
      UpdateScroll(2, true);
      Resize();
    }
    function ChatHide() {
      CTS.NormalStyle.ChatHide = !CTS.NormalStyle.ChatHide;
      ChatLogElement.querySelector("#chat-wrapper").style.display = CTS
        .NormalStyle.ChatHide
        ? "none"
        : "block";
      UpdateScroll(1, true);
      UpdateScroll(2, true);
      Resize();
    }
    function SoundMeter() {
      //MICROPHONE INDICATOR
      if (CTS.SoundMeterToggle) {
        setTimeout(function () {
          var Camera = VideoListElement.querySelectorAll(
              ".videos-items tc-video-item"
            ),
            Featured = VideoListElement.querySelectorAll(
              ".videos-items:first-child tc-video-item"
            ),
            videolist =
              window.TinychatApp.getInstance().defaultChatroom._videolist,
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
                  if (
                    Camera[users].shadowRoot
                      .querySelector(".video > div > video")
                      .getAttribute("data-video-id") == item.userentity.path
                  ) {
                    Camera[users].shadowRoot
                      .querySelector(".video > div > .overlay")
                      .setAttribute("data-mic-level", item.audiolevel);
                    Camera[users].shadowRoot
                      .querySelector(".video > div > svg")
                      .setAttribute("data-mic-level", 0);
                    break;
                  }
                }
              }
            }
          } else {
            for (users = 0; users < CameraLen; users++) {
              item = videolist.items[users];
              if (item != undefined) {
                Camera[users].shadowRoot
                  .querySelector(".video > div > .overlay")
                  .setAttribute("data-mic-level", item.audiolevel);
                Camera[users].shadowRoot
                  .querySelector(".video > div > svg")
                  .setAttribute("data-mic-level", 0);
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
        var a = arguments[0].rtc;
        arguments[0].rtc = null;
        MS(arguments[0], a);
      }
    }
    function Vote() {
      var ChecksOut = CTS.VoteSystem,
        len = CTS.WaitToVoteList.length;
      if (len > 0 && ChecksOut) {
        for (var i = 0; i < len; i++) {
          if (
            CTS.WaitToVoteList[i][0] ===
            CTS.UserList[arguments[0]].username.toUpperCase()
          ) {
            Send(
              "msg",
              "Please wait several minutes till you can cast your vote again!"
            );
            ChecksOut = false;
            break;
          }
        }
      }
      if (ChecksOut) {
        if (isSafeListed(CTS.UserList[arguments[0]].username.toUpperCase())) {
          var targetname = arguments[1].match(/^!vote ([a-z0-9]{1,16})$/i);
          if (targetname !== null) {
            var Target = UsernameToUser(targetname[1].toUpperCase());
            if (Target !== -1) {
              if (
                CTS.UserList[Target].broadcasting &&
                CTS.UserList[Target].username !== "GUEST"
              ) {
                if (CTS.Me.owner || !CTS.UserList[Target].mod) {
                  Send(
                    "msg",
                    "Your vote has been cast, you may vote again shortly!"
                  );
                  CTS.WaitToVoteList.push([
                    CTS.UserList[arguments[0]].username.toUpperCase(),
                    new Date()
                  ]);
                  CTS.UserList[Target].vote += 1;
                  if (CTS.UserList[Target].vote === 3) {
                    CTS.UserList[Target].vote = 0;
                    Send(
                      "msg",
                      CTS.UserList[Target].nick +
                        "!\nYou've been voted off camera!"
                    );
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
      ChatListElement.querySelector("#chatlist").style.display = CTS.enablePMs
        ? "block"
        : "none";
    }
    function MessagePopUp() {
      if (CTS.Popups) {
        var push = false;
        if (arguments[0] != -1) {
          if (ChatListElement.querySelector(".list-item .active")) {
            if (
              ChatListElement.querySelector(".active").innerHTML.includes(
                CTS.UserList[arguments[0]].nick
              ) &&
              !ChatListElement.querySelector(".active").innerHTML.includes(
                "(offline)"
              )
            ) {
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
          if (
            VideoListElement.querySelector(".PMOverlay .PMPopup:nth-child(5)")
          ) {
            Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
            clearTimeout(CTS.NotificationTimeOut[0]);
            CTS.NotificationTimeOut.shift();
          }
          VideoListElement.querySelector(".PMOverlay").insertAdjacentHTML(
            "beforeend",
            '<div class="PMPopup"><h2><div class="PMTime">' +
              Time() +
              '</div><div class="PMName">' +
              (arguments[3]
                ? "YouTube"
                : CTS.UserList[arguments[0]].nick +
                  " in " +
                  (arguments[2] ? "Main" : "PM")) +
              '</div></h2><div class="PMContent"style="font-size:' +
              CTS.FontSize +
              'px">' +
              arguments[1] +
              "</div></div>"
          );
          CTS.NotificationTimeOut.push(
            setTimeout(function () {
              if (VideoListElement.querySelector(".PMOverlay .PMPopup")) {
                Remove(VideoListElement, ".PMOverlay .PMPopup:first-child");
                CTS.NotificationTimeOut.shift();
              }
            }, 11100)
          );
        }
      }
    }
    function Reminder() {
      var temp,
        i,
        len = CTS.ReminderServerInList.length;
      for (i = 0; i < len; i++) clearTimeout(CTS.ReminderServerInList[i]);
      CTS.ReminderServerInList = [];
      if (CTS.Reminder === true) {
        var OffsetTime;
        len = CTS.ReminderList.length;
        for (i = 0; i < len; i++) {
          temp = TimeToDate(CTS.ReminderList[i][0]);
          CTS.RecentTime = new Date();
          if (temp < CTS.RecentTime) temp.setDate(temp.getDate() + 1);
          OffsetTime = temp - CTS.RecentTime;
          CTS.ReminderServerInList.push(
            setTimeout(AddReminder, OffsetTime, CTS.ReminderList[i][1])
          );
        }
        if (Addon.active("ReminderList")) {
          len = Addon.get("ReminderList").length;
          for (i = 0; i < len; i++) {
            temp = TimeToDate(Addon.get("ReminderList")[i][0]);
            CTS.RecentTime = new Date();
            if (temp < CTS.RecentTime)
              temp.setDate(CTS.RecentTime.getDate() + 1);
            OffsetTime = temp - CTS.RecentTime;
            CTS.ReminderServerInList.push(
              setTimeout(
                AddReminder,
                OffsetTime,
                Addon.get("ReminderList")[i][1]
              )
            );
          }
        }
      }
    }
    function AddReminder() {
      Send("msg", "📣 " + arguments[0]);
      setTimeout(Reminder, 5000);
    }
    function NotificationDisplay() {
      ChatLogElement.querySelector("#notification-content").style.cssText =
        "display:" + (CTS.NotificationToggle == 0 ? "block" : "none") + ";";
      ChatLogElement.querySelector(".notifbtn").style.cssText =
        "display:" + (CTS.NotificationToggle == 0 ? "block" : "none") + ";";
      if (CTS.NotificationToggle == 0) {
        ChatLogElement.querySelector(".notifbtn").addEventListener(
          "click",
          NotificationResize,
          {
            passive: true
          }
        );
      } else {
        ChatLogElement.querySelector(".notifbtn").removeEventListener(
          "click",
          NotificationResize,
          {
            passive: true
          }
        );
      }
      UpdateScroll(1, true);
      UpdateScroll(2, true);
    }
    function NotificationResize() {
      ChatLogElement.querySelector("#notification-content").classList.toggle(
        "large"
      );
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
      return (
        Math.floor(Math.random() * (arguments[1] - arguments[0] + 1)) +
        arguments[0]
      );
    }
    function OpenMicrophone() {
      MicrophoneElement.initMouseEvent("mousedown");
      VideoListElement.querySelector(
        "#videos-footer-push-to-talk"
      ).dispatchEvent(MicrophoneElement);
    }
    var CameraSound = new MutationObserver(function (mutations) {
      Cameras();
    });
    function Cameras() {
      // Video Items
      var Camera = VideoListElement.querySelectorAll(
          ".videos-items tc-video-item"
        ),
        Len = Camera.length;
      for (var num = 0; num < Len; num++) {
        // Camera Selection
        if (Camera[num] === null) continue;
        if (Camera[num].shadowRoot === null) continue;
        var select = Camera[num].shadowRoot;
        var user = HandleToUser(
          select
            .querySelector(".video > div > video")
            .getAttribute("data-video-id")
        );

        // Video Border
        if (select.querySelector(".video"))
          select.querySelector(".video").style.padding = CTS.CameraBorderToggle
            ? "5px"
            : "0";
        // Handle to UserIndex
        if (user == -1) continue;
        if (CTS.Me.handle !== CTS.UserList[user].handle) {
          if (
            select.querySelector(
              "div > div > div.overlay > div.icon-volume > tc-volume-control"
            )
          ) {
            if (
              select.querySelector(
                "div > div > div.overlay > div.icon-volume > tc-volume-control"
              ).shadowRoot
            ) {
              var VolIco = select.querySelector(
                "div > div > div.overlay > div.icon-volume > tc-volume-control"
              ).shadowRoot;
              CameraSound.observe(VolIco.querySelector(".icon-volume"), {
                attributes: true,
                childList: true,
                subtree: true
              });
              select.querySelector(".video > div > video").volume =
                window.CTSMuted
                  ? 0
                  : (parseInt(
                      VolIco.querySelector("#videos-header-volume-level").style
                        .width
                    ) /
                      100) *
                    window.CTSRoomVolume;
            }
          }
        }
        if (select.querySelector(".video #fixed")) continue;
        if (CTS.HiddenCameraList.includes(CTS.UserList[user].username)) {
          window.TinychatApp.BLL.Videolist.prototype.toggleHiddenVW(
            window.TinychatApp.getInstance().defaultChatroom._videolist.items[
              num
            ],
            false
          );
          Alert(
            GetActiveChat(),
            CTS.UserList[user].username + " has been auto-hidden!"
          );
        }
        select
          .querySelector(".video")
          .insertAdjacentHTML(
            "afterbegin",
            '<style id="fixed">.video{border-radius: 5px;}.video.not-visible>div>.overlay{background: url(https://i.imgur.com/uOP8tlr.png) rgb(0, 0, 0) no-repeat;background-position: center!important;background-size: cover!important;}.video.large{position: absolute;left:50%;top: 50%;transform: translate(-50%, -50%);z-index: 2;width: 82%;}.video>div>.overlay[data-mic-level="1"] {-webkit-box-shadow: inset 0 0 7px 1px #00ff4d;box-shadow: inset 0 0 7px 1px #00ff4d; }.video>div>.overlay[data-mic-level="2"] {-webkit-box-shadow: inset 0 0 14px 3px #00ff4d;box-shadow: inset 0 0 14px 3px #00ff4d}.video>div>.overlay[data-mic-level="3"] {-webkit-box-shadow: inset 0 0 14px 5px #00ff4d;box-shadow: inset 0 0 14px 5px #00ff4d;}.video>div>.overlay[data-mic-level="4"],.video>div>.overlay[data-mic-level="5"],.video>div>.overlay[data-mic-level="6"],.video>div>.overlay[data-mic-level="7"],.video>div>.overlay[data-mic-level="8"],.video>div>.overlay[data-mic-level="9"],.video>div>.overlay[data-mic-level="10"] {-webkit-box-shadow: inset 0 0 14px 8px #00ff4d;box-shadow: inset 0 0 14px 8px #00ff4d;}.video:after{content:unset;}</style>'
          );
      }
      Resize();
    }
    function FeaturedCameras() {
      if (arguments[0] === true) {
        if (VideoListElement.querySelector("#SmallFTYT"))
          Remove(VideoListElement, "#SmallFTYT");
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
      if (!CTS.ThemeChange) {
        var value = arguments[0]
          ? "100%"
          : "calc(400px + " + CTS.ChatWidth + "%)";
        ChatLogElement.querySelector("#chat-wrapper").style.minWidth = value;
        ChatLogElement.querySelector("#chat-wrapper").style.maxWidth = value;
        ChatLogElement.querySelector("#chat-wrapper").style.width = value;
        TitleElement.querySelector("#room-header").style.minWidth = value;
        TitleElement.querySelector("#room-header").style.maxWidth = value;
        TitleElement.querySelector("#room-header").style.width = value;
        VideoListElement.querySelector(
          "#videos-footer-broadcast-wrapper"
        ).style.minWidth = !CTS.ChatDisplay ? "100%" : value;
        VideoListElement.querySelector(
          "#videos-footer-broadcast-wrapper"
        ).style.maxWidth = !CTS.ChatDisplay ? "100%" : value;
        VideoListElement.querySelector(
          "#videos-footer-broadcast-wrapper"
        ).style.width = !CTS.ChatDisplay ? "100%" : value;
        VideoListElement.querySelector("#videos-header").style.minWidth =
          !CTS.UserListDisplay ? "calc(" + value + " - 54px)" : value;
        VideoListElement.querySelector("#videos-header").style.maxWidth =
          !CTS.UserListDisplay ? "calc(" + value + " - 54px)" : value;
        VideoListElement.querySelector("#videos-header").style.width =
          !CTS.UserListDisplay ? "calc(" + value + " - 54px)" : value;
        SideMenuElement.querySelector("#sidemenu").style.minWidth = value;
        SideMenuElement.querySelector("#sidemenu").style.maxWidth = value;
        SideMenuElement.querySelector("#sidemenu").style.width = value;
        document.querySelector("#content").style.width = !arguments[0]
          ? "calc(100% " +
            (CTS.ChatDisplay ? "- (400px + " + CTS.ChatWidth + "%)" : "") +
            ")"
          : "0%";
        if (arguments[0]) {
          VideoListElement.querySelector("#videos-content").style.display =
            "none";
        } else {
          VideoListElement.querySelector(
            "#videos-content"
          ).style.removeProperty("display");
        }
      } else {
        if (arguments[0]) {
          VideoListElement.querySelector("#videos-content").style.display =
            "none";
          ChatLogElement.querySelector("#chat-wrapper").style.width = "100%";
          ChatLogElement.querySelector("#chat-wrapper").style.position =
            "fixed";
          ChatLogElement.querySelector("#chat-wrapper").style.left = "0";
          ChatLogElement.querySelector("#chat-wrapper").style.bottom = "0";
          ChatLogElement.querySelector("#chat-wrapper").style.minHeight =
            "100%";
          VideoListElement.querySelector(
            "#videos-footer-broadcast-wrapper"
          ).style.display = "none";
          VideoListElement.querySelector("#videos-header").style.display =
            "none";
          VideoListElement.querySelector("#videos-footer").style.display =
            "none";
        } else {
          VideoListElement.querySelector(
            "#videos-content"
          ).style.removeProperty("display");
          ChatLogElement.querySelector("#chat-wrapper").style.removeProperty(
            "width"
          );
          ChatLogElement.querySelector("#chat-wrapper").style.removeProperty(
            "position"
          );
          ChatLogElement.querySelector("#chat-wrapper").style.removeProperty(
            "left"
          );
          ChatLogElement.querySelector("#chat-wrapper").style.removeProperty(
            "bottom"
          );
          ChatLogElement.querySelector("#chat-wrapper").style.removeProperty(
            "min-height"
          );
          VideoListElement.querySelector(
            "#videos-footer-broadcast-wrapper"
          ).style.removeProperty("display");
          VideoListElement.querySelector("#videos-header").style.removeProperty(
            "display"
          );
          VideoListElement.querySelector("#videos-footer").style.removeProperty(
            "display"
          );
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
              var raid = arguments[1].match(
                /^(?:!raid )(?:https?:\/\/)?tinychat\.com(?!\/#)\/(?!gifts|settings|coins|subscription|promote)(?:room\/)?([a-z0-9]{3,16})$/i
              );
              if (raid !== null) {
                if (CTS.RaidToggle) {
                  window.location.replace(
                    "https://tinychat.com/room/" + raid[1]
                  );
                } else {
                  Alert(
                    GetActiveChat(),
                    "[TIP]\nRaids are silenced. Refresh or !raidtoggle"
                  );
                }
              } else {
                if (CTS.CanSeeTips)
                  Alert(
                    GetActiveChat(),
                    "[TIP]\nThis is not a valid link for raid."
                  );
              }
            }
            if (arguments[1].match(/^!version$/i))
              Send(
                "pvtmsg",
                "I am using " + CTS.Project.Name + "v" + Ver(),
                CTS.UserList[arguments[0]].handle
              );
          } else {
            if (arguments[1].match(/^!closeall$/i)) {
              for (var a = 0; a < CTS.Camera.List.length; a++) {
                if (CTS.Me.handle !== CTS.Camera.List[a]) {
                  Send("stream_moder_close", CTS.Camera.List[a]);
                } else {
                  CTS.SocketTarget.send(
                    JSON.stringify({
                      tc: "stream_close",
                      handle: CTS.Me.handle
                    })
                  );
                }
              }
            }
            if (arguments[1].match(/^!kickall$/i)) {
              for (var b = 0; b < CTS.UserList.length; b++) {
                if (CTS.Me.handle !== CTS.UserList[b].handle)
                  Send("kick", CTS.UserList[b].handle);
              }
              if (CTS.CanSeeTips)
                Alert(
                  GetActiveChat(),
                  "[TIP]\nIf you leave now, the entire room resets! GOGOGO~"
                );
            }
          }
        }
      }
    }
    function Command() {
      var UserCommand = arguments[0].match(/^!([a-z0-9]*)(?: ?)(.*)/i);
      if (UserCommand) {
        if (typeof CommandList[UserCommand[1].toLowerCase()] == "function") {
          debug(
            "COMMAND::" + (arguments[1] ? "PM" : "MAIN"),
            UserCommand[1] + ":" + UserCommand[2]
          );
          CommandList[UserCommand[1].toLowerCase()](
            UserCommand[2],
            arguments[1]
          );
        }
      }
    }
    //ALERT FUNCTIONS
    function Settings() {
      Alert(
        GetActiveChat(),
        (arguments[0] !== undefined ? arguments[0] : "") +
          "<center>CTS BOT CONFIGURATION:\nBot Mode: " +
          (CTS.Bot ? "ON" : "OFF") +
          "\nOperator Mode: " +
          (CTS.UserYT ? "ON" : "OFF") +
          "\nPublic Command Mode: " +
          (CTS.PublicCommandToggle ? "ON" : "OFF") +
          "\nGreen Room Mode:\n" +
          (CTS.GreenRoomToggle ? "AUTO ALLOW" : "MANUAL") +
          "\n\nReminder Mode: " +
          (CTS.Reminder ? "ON" : "OFF") +
          "\n\nGame View: " +
          (CTS.CanSeeGames ? "ON" : "OFF") +
          "\n\nTriva Game Host: " +
          (CTS.CanHostTriviaGames ? "ON" : "OFF") +
          "\nFish Game Host: " +
          (CTS.CanHostFishGames ? "ON" : "OFF") +
          "\n\nNotification Display: " +
          (CTS.NotificationToggle != 2
            ? "SHOW(" + CTS.NotificationToggle + ")"
            : "HIDE") +
          "\nPopup Display: " +
          (CTS.Popups ? "SHOW" : "HIDE") +
          "\n\nFOR LIST OF COMMANDS:\n!CTS</center>"
      );
    }
    function Alert() {
      CTS.Message[arguments[0]].push({
        time: Time(),
        namecolor: arguments[2] !== undefined ? "#000000" : "#3f69c0",
        avatar:
          arguments[2] !== undefined
            ? ""
            : "https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif",
        username: "",
        nick: arguments[2] !== undefined ? arguments[2] : "Bodega Bot v:4.0 ",
        msg:
          arguments[2] !== undefined
            ? '<div class="systemuser">' + arguments[1] + "</div>"
            : arguments[1],
        mention: true
      });
      var len = CTS.Message[arguments[0]].length - 1;
      arguments[1] = CTS.Message[arguments[0]][len];
      CreateMessage(
        arguments[1].time,
        arguments[1].namecolor,
        arguments[1].avatar,
        arguments[1].username,
        arguments[1].nick,
        arguments[1].msg,
        arguments[1].mention,
        arguments[0]
      );
    }
    window.ShowProfile = function () {
      var resp = JSON.parse(arguments[0]);
      if (resp.result == "success")
        Alert(
          GetActiveChat(),
          "Username:\n" +
            resp.username +
            "\nAge:\n" +
            resp.age +
            "\nGender:\n" +
            resp.gender +
            "\nLocation:\n" +
            resp.location +
            "\nBiography:\n" +
            resp.biography,
          "Profile Lookup"
        );
    };
    function Ver() {
      return (
        window.CTSVersion.Major +
        "." +
        window.CTSVersion.Minor +
        "." +
        window.CTSVersion.Patch
      );
    }
    function AddUserNotification() {
      if (CTS.FullLoad && CTS.ShowedSettings) {
        var chat = ChatLogElement.querySelector("#notification-content"),
          Notification;
        CTS.NotificationScroll =
          Math.floor(chat.scrollTop) + 5 >=
          chat.scrollHeight - chat.offsetHeight
            ? true
            : false;
        if (arguments[0] == 1) {
          //if(arguments[4]) onUserBroadcast(arguments[3], arguments[2]); //username, nickname
          Notification =
            arguments[3] +
            (arguments[4] ? " is " : " has stopped ") +
            "broadcasting!";
        } else if (arguments[0] == 2) {
          if (arguments[4]) getGreetCooldown(arguments[3]);
          Notification =
            arguments[3] + " has " + (!arguments[4] ? "joined!" : "left.");
        } else if (arguments[0] == 3) {
          Notification = arguments[2] + "has mentioned you!";
          if (CTS.NotificationToggle == 0)
            ChatLogElement.querySelector(
              "#notification-content"
            ).insertAdjacentHTML(
              "beforeend",
              '<div class="list-item"><div class="notification"><span style="background:' +
                arguments[1] +
                '" class="nickname">' +
                arguments[2] +
                "</span>" +
                (CTS.TimeStampToggle
                  ? '<span class="time"> ' + Time() + " </span>"
                  : "") +
                "<br/> has mentioned you.</div></div>"
            );
          UpdateScroll(2, true);
        } else if (arguments[0] == 4) {
          Notification =
            "with the account name " +
            arguments[3] +
            " changed their name to " +
            arguments[5];
        }
        if (arguments[0] != 3 && CTS.NotificationToggle == 0)
          ChatLogElement.querySelector(
            "#notification-content"
          ).insertAdjacentHTML(
            "beforeend",
            '<div class="list-item"><div class="notification"><span class="nickname" style="background:' +
              arguments[1] +
              ';">' +
              arguments[2] +
              "</span>" +
              (CTS.TimeStampToggle
                ? '<span class="time"> ' + Time() + " </span>"
                : "") +
              "<br/>" +
              Notification +
              "</div></div>"
          );
        if (CTS.NotificationToggle == 1) Alert(0, Notification, arguments[2]);
        if (
          CTS.TTS.synth !== undefined &&
          (CTS.TTSList.includes(arguments[3]) ||
            CTS.TTSList.includes("-ALL") ||
            CTS.TTSList.includes("-EVENT"))
        )
          TTS(arguments[2] + (arguments[0] == 4 ? " " : "as ") + Notification);
        UpdateScroll(2, false);
        var Notifications = ChatLogElement.querySelectorAll(".notification");
        if (Notifications.length > CTS.NotificationLimit + 25) {
          for (
            var NotificationIndex = 0;
            NotificationIndex < Notifications.length - CTS.NotificationLimit;
            NotificationIndex++
          )
            Notifications[NotificationIndex].parentNode.removeChild(
              Notifications[NotificationIndex]
            );
        }
      }
    }
    function AddSystemNotification() {
      if (CTS.FullLoad && CTS.ShowedSettings) {
        if (CTS.NotificationToggle == 0) {
          ChatLogElement.querySelector(
            "#notification-content"
          ).insertAdjacentHTML(
            "beforeend",
            '<div class="list-item"><span class="nickname"style="background:#F00">SYSTEM</span>' +
              (CTS.TimeStampToggle
                ? '<span class="time"> ' + Time() + " </span>"
                : "") +
              "<br/>" +
              arguments[0] +
              "</div>"
          );
        } else if (CTS.NotificationToggle == 1) {
          Alert(0, arguments[0], "SYSTEM");
        }
        if (
          CTS.TTS.synth !== undefined &&
          (CTS.TTSList.includes("-ALL") || CTS.TTSList.includes("-EVENT"))
        )
          TTS(arguments[0]);
        UpdateScroll(2, false);
      }
    }
    //USER FUNCTION
    function AddUser() {
      CTS.UserList.push({
        handle: arguments[0],
        username: arguments[5],
        nick: arguments[4],
        owner: arguments[7],
        mod: arguments[1],
        namecolor: arguments[2],
        avatar: arguments[3],
        canGame: arguments[6],
        broadcasting: false,
        vote: 0,
        triviapoints: CTS.Game.Trivia.PlayerList[arguments[5]] || 0
      });
      if (CTS.ScriptInit)
        AddUserNotification(2, arguments[2], arguments[4], arguments[5], false);
    }
    function HandleToUser() {
      for (var user = 0; user < CTS.UserList.length; user++) {
        if (CTS.UserList[user].handle == arguments[0]) return user;
      }
      return -1;
    }
    function UsernameToHandle() {
      for (var user = 0; user < CTS.UserList.length; user++) {
        if (CTS.UserList[user].username.toUpperCase() == arguments[0])
          return CTS.UserList[user].handle;
      }
      return -1;
    }
    function UsernameToUser() {
      for (var user = 0; user < CTS.UserList.length; user++) {
        if (CTS.UserList[user].username.toUpperCase() == arguments[0])
          return user;
      }
      return -1;
    }
    function NicknameToHandle() {
      for (var user = 0; user < CTS.UserList.length; user++) {
        if (CTS.UserList[user].nick.toUpperCase() == arguments[0])
          return CTS.UserList[user].handle;
      }
      return -1;
    }
    function NicknameToUser() {
      for (var user = 0; user < CTS.UserList.length; user++) {
        if (CTS.UserList[user].nick.toUpperCase() == arguments[0]) return user;
      }
      return -1;
    }
    function CheckUserListSafe() {
      var len = CTS.UserList.length;
      var temp = [];
      if (Addon.active("AKB")) temp = Addon.get("AKB");
      for (var user = 0; user < len; user++) {
        if (
          !CTS.UserList[user].mod &&
          !isSafeListed(CTS.UserList[user].username)
        )
          CTS.KBQueue.push(CTS.UserList[user].handle);
      }
      len = CTS.KBQueue.length;
      for (var kb = 0; kb < len; kb++) {
        Send(arguments[0], CTS.KBQueue[kb]);
      }
      CTS.KBQueue = [];
    }
    function isSafeListed() {
      var temp = [];
      if (Addon.active("AKB")) temp = Addon.get("AKB");
      return CTS.SafeList.includes(arguments[0]) || temp.includes(arguments[0]);
    }
    function CheckUserTempIgnore() {
      if (
        CTS.TempIgnoreUserList.includes(CTS.UserList[arguments[0]].username) ||
        CTS.TempIgnoreNickList.includes(
          CTS.UserList[arguments[0]].nick.toUpperCase()
        )
      )
        return true;
      return false;
    }
    function CheckUserIgnore() {
      if (CTS.IgnoreList.includes(CTS.UserList[arguments[0]].username))
        return true;
      return false;
    }
    function CheckUserTouchScreen() {
      if (
        /Mobi|Android/i.test(navigator.userAgent) ||
        "ontouchstart" in document.documentElement
      ) {
        CTS.Project.isTouchScreen = true;
        CTS.ThemeChange = true;
      }
    }
    function CheckUserAbuse() {
      var action = false;
      if (CTS.Me.mod) {
        if (
          CTS.UserKickList.includes(arguments[1]) ||
          CTS.NickKickList.includes(arguments[2].toUpperCase())
        ) {
          CTS.NoGreet = true;
          Send("kick", arguments[0]);
          action = true;
        }
        if (!action) {
          if (
            CTS.UserBanList.includes(arguments[1]) ||
            CTS.NickBanList.includes(arguments[2].toUpperCase())
          ) {
            CTS.NoGreet = true;
            Send("ban", arguments[0]);
          }
        }
      }
    }
    function CheckUserWordAbuse() {
      if (
        CTS.UserList[arguments[0]].handle != CTS.Me.handle &&
        !CTS.UserList[arguments[0]].mod
      ) {
        var action = false; //LETS NOT REPEAT/KICK
        var len = CTS.KickKeywordList.length;
        for (var i = 0; i < len; i++) {
          if (arguments[1].includes(CTS.KickKeywordList[i])) {
            Send("kick", CTS.UserList[arguments[0]].handle);
            action = true;
            break;
          }
        }
        if (!action) {
          len = CTS.BanKeywordList.length;
          for (i = 0; i < len; i++) {
            if (arguments[1].includes(CTS.BanKeywordList[i])) {
              Send("ban", CTS.UserList[arguments[0]].handle);
              break;
            }
          }
        }
      }
    }
    function RemoveUserCamera() {
      var len = CTS.Camera.List.length;
      if (len > 0) {
        for (var i = 0; i < len; i++) {
          if (CTS.Camera.List[i] === arguments[0]) {
            CTS.Camera.List.splice(i, 1);
            clearTimeout(CTS.Camera.clearRandom);
            break;
          }
        }
      }
    }
    function CheckUserStream() {
      var user = HandleToUser(arguments[0]);
      if (user != -1) {
        if (CTS.Me.mod) {
          if (arguments[1]) {
            //PUSH UPDATE
            CTS.Camera.List.push(CTS.UserList[user].handle);
            CTS.UserList[user].broadcasting = true;
            var len = CTS.Camera.List.length;
            if (
              CTS.UserList[user].username !== "GUEST" &&
              !CTS.GreenRoomList.includes(
                CTS.UserList[user].username.toUpperCase()
              )
            ) {
              CTS.GreenRoomList.push(CTS.UserList[user].username.toUpperCase());
              Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
            }
            //CLEAR TIMERS
            clearTimeout(CTS.Camera.clearRandom);
            //CAMERA SWEEP FUNCTION
            if (len >= 12 && CTS.Me.handle === CTS.Host && CTS.Camera.Sweep) {
              CTS.Camera.clearRandom = setTimeout(function () {
                var rand = Rand(0, len - 1);
                if (
                  CTS.Camera.List[rand] !== CTS.Me.handle &&
                  CTS.Camera.Sweep
                ) {
                  var target = HandleToUser(CTS.Camera.List[rand]);
                  if (CTS.Me.owner || !CTS.UserList[target].mod) {
                    Send(
                      "msg",
                      "[Camera Clear]\n" +
                        CTS.UserList[target].nick +
                        "!\nYou've been randomly selected. You win, a cam close!"
                    );
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
        if (CTS.ScriptInit)
          AddUserNotification(
            1,
            CTS.UserList[user].namecolor,
            CTS.UserList[user].nick,
            CTS.UserList[user].username,
            arguments[1]
          );
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
        if (
          arguments[0].mediaStream.active &&
          arguments[1].signalingState !== "closed" &&
          typeof arguments[1].removeStream === "function" &&
          arguments[1].removeStream(arguments[0].mediaStream)
        )
          MSR(false, arguments[0]);
      } else {
        MSR(true, arguments[0]);
      }
      if (arguments[1].signalingState !== "closed" && arguments[1].close());
    }
    //LOAD/SAVE FUNCTION
    function Load() {
      var val = localStorage.getItem(CTS.Project.Storage + arguments[0]);
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
        Alert(
          GetActiveChat(),
          "Looks like you don't have LocalStorage allowed on this device!\nYour options will not be saved!"
        );
      }
    }

    //SOCKET FUNCTION
    function CTSWebSocket() {
      if (window.Proxy === undefined) return;
      var handler = {
        set: function set(Target, prop, value) {
          if (prop == "onmessage") {
            var oldMessage = value;
            value = function value(event) {
              ServerMsg(JSON.parse(event.data), Target);
              oldMessage(event);
            };
          }
          return (Target[prop] = value);
        },
        get: function get(Target, prop) {
          var value = Target[prop];
          if (prop == "send") {
            value = function value(event) {
              ClientMsg(JSON.parse(event), Target);
              Target.send(event);
            };
          } else if (typeof value == "function") {
            value = value.bind(Target);
          }
          return value;
        }
      };
      var WebSocketProxy = new window.Proxy(window.WebSocket, {
        construct: function construct(Target, args) {
          CTS.SocketTarget = new Target(args[0]);
          debug("SOCKET::CONNECTING", args[0]);
          return new window.Proxy(CTS.SocketTarget, handler);
        }
      });
      window.WebSocket = WebSocketProxy;
    }
    function ModCommand() {
      var name = arguments[1].match(
          /^!(?:userkick|nickkick|userban|nickban|userclose|nickclose) (guest-[0-9]{1,32}|[a-z0-9_]{1,32})$/i
        ),
        target;
      if (name !== null) {
        if (name[1].toUpperCase() !== "GUEST") {
          target = arguments[2]
            ? UsernameToUser(name[1].toUpperCase())
            : NicknameToUser(name[1].toUpperCase());
        } else {
          target = NicknameToUser(name[1].toUpperCase());
        }
        if (target != -1) {
          // USER ONLINE
          if (
            CTS.UserList[target].handle !== CTS.Me.handle &&
            !CTS.BotModList.includes(CTS.UserList[target].username) &&
            !CTS.UserList[target].mod
          ) {
            //IF USER IS NOT HOST/MODERATOR/JR.MODERATOR
            if (arguments[0] === "stream_moder_close") {
              if (CTS.UserList[target].broadcasting)
                Send(arguments[0], CTS.UserList[target].handle);
            } else {
              Send(arguments[0], CTS.UserList[target].handle);
            }
          } else {
            Send("msg", "This users authorization is similar or above yours!");
          }
        }
      }
    }
    function BotCommand() {
      var len = CTS.YouTube.MessageQueueList.length;
      if (len <= 0) {
        var check = true;
        // Moderator Control
        if (CTS.UserList[arguments[1]].mod) {
          if (arguments[0] == 2) {
            if (CTS.YouTube.CurrentTrack.ID !== undefined) {
              CTS.YouTube.Clear = true;
              YouTubePlayList();
            }
            check = false;
          }
          if (arguments[0] == 5) {
            SetBot(true);
            check = false;
          }
        }
        // User and Moderator Control
        if (check) {
          if (VerifyYouTube(arguments[1])) {
            if (arguments[0] == 1)
              CheckYouTube(
                arguments[2],
                true,
                undefined,
                CTS.UserList[arguments[1]].mod
              );
            if (arguments[0] == 4) YouTubePlayList(true);
            if (
              CTS.UserList[arguments[1]].mod ||
              CTS.BotModList.includes(CTS.UserList[arguments[1]].username)
            ) {
              if (arguments[0] == 6) YoutubeBypass(arguments[2]);
              if (arguments[0] == 3) {
                if (CTS.YouTube.CurrentTrack.ID !== undefined) {
                  Send("yut_stop", [
                    CTS.YouTube.CurrentTrack.ID,
                    CTS.YouTube.CurrentTrack.duration,
                    CTS.YouTube.CurrentTrack.title,
                    CTS.YouTube.CurrentTrack.thumbnail,
                    0
                  ]);
                  Send(
                    "msg",
                    "🎵" +
                      CTS.YouTube.CurrentTrack.title +
                      " has been skipped!🎵"
                  );
                }
              }
            }
          }
        }
      } else {
        if (CTS.YouTube.ListBuilt === false) {
          Send(
            "msg",
            "🎵 Playlist search is happening, please wait! 🎵\n" +
              CTS.YouTube.MessageQueueList.length +
              " tracks found."
          );
        } else {
          Send(
            "msg",
            "🎵 Playlist items are being added,a please wait! 🎵\n" +
              CTS.YouTube.MessageQueueList.length +
              " tracks remaining."
          );
        }
      }
    }
    function ServerMsg() {
      if (typeof ServerInList[arguments[0].tc] == "function") {
        debug("SERVER::" + arguments[0].tc.toUpperCase(), arguments[0]);
        ServerInList[arguments[0].tc](arguments[0]);
      }
    }
    function ClientMsg() {
      if (typeof ServerOutList[arguments[0].tc] == "function") {
        debug("CLIENT::" + arguments[0].tc.toUpperCase(), arguments[0]);
        ServerOutList[arguments[0].tc](arguments[0]);
      }
    }
    function Send() {
      ServerSendList[arguments[0]](arguments[0], arguments[1], arguments[2]);
      if (arguments[1] === undefined) arguments[1] = "Open Request";
      debug("CLIENT::SEND::" + arguments[0].toUpperCase(), arguments[1]);
    }
    //GAME FUNCTION
    //FISHING BOAT
    function FishUpgradeStatus() {
      var msg = "[FISHING BOAT]\n";
      if (arguments[1] != 7) msg += arguments[0].Nickname + ":\n";
      if (arguments[1] == 0 || arguments[1] == 1)
        msg +=
          "[NET]Lv. " +
          arguments[0].Upgrades.Net +
          "\n" +
          (arguments[0].Upgrades.Net >= 10
            ? "[MAXED]"
            : "[COSTS $" +
              Fish.PriceList(arguments[0], 0) +
              " to UPGRADE]\n\n");
      if (arguments[1] == 0 || arguments[1] == 2)
        msg +=
          "[RADAR]Lv. " +
          arguments[0].Upgrades.Radar +
          "\n" +
          (arguments[0].Upgrades.Radar >= 20
            ? "[MAXED]"
            : "[COSTS $" + Fish.PriceList(arguments[0], 1) + " to UPGRADE]") +
          "\n\n";
      if (arguments[1] == 0 || arguments[1] == 3)
        msg +=
          "[INSURANCE]\n" +
          (arguments[0].Upgrades.Insurance
            ? "[OWNED]"
            : "[COSTS $" + Fish.PriceList(arguments[0], 3) + " per ROUND]") +
          "\n\n";
      if (arguments[1] == 0 || arguments[1] == 4)
        msg +=
          "[SHOP]Lv. " +
          arguments[0].Upgrades.Store +
          "\n" +
          (arguments[0].Upgrades.Store >= 6
            ? "[MAXED]"
            : "[COSTS $" + Fish.PriceList(arguments[0], 2) + " to UPGRADE]") +
          "\n\n";
      if (arguments[1] == 6)
        msg +=
"HELP:\n" +
"!fish 🐟\n" +
"!fishbank 🏦\n" +
"!fishweather 🌦️\n" +
"!fishlevel 📊\n" +
"!fishachievements 🏅\n" +
"!fishsplit user|nick 🧩\n" +
"!fishgamble 🎲\n[COSTS $" + Fish.PriceList(arguments[0], 6) + "]\n" +
"!fishrob user|nick 🚨\n[COSTS $" + Fish.PriceList(arguments[0], 4) + "]\n" +
"!fishslap user|nick 🖐️\n[COSTS $" + Fish.PriceList(arguments[0], 5) + "]\n" +
"!fishupgrade 🔧\n[Net|Radar|Insurance|Shop]\n\n";
      Send("msg", msg);
    }
    function FishTimerCheck() {
      if (new Date() - arguments[0].LastCheck >= 5000) {
        arguments[0].LastCheck = new Date();
        return true;
      }
      return false;
    }
    function FishCommandCheck() {
      var command,
        playerExist = Fish.GetPlayer(
          CTS.UserList[arguments[0]].handle,
          false,
          true
        ),
        FishCommand = arguments[1].match(
          /^!(fish(?:rob|slap|split|help|upgrade)?) ?(?:([a-z0-9_]*)|net|shop|radar|insurance)?$/i
        );
      if (FishCommand) {
        if (
          FishCommand[1] === "fishslap" ||
          FishCommand[1] === "fishrob" ||
          FishCommand[1] === "fishsplit"
        ) {
          if (FishCommand[2] !== undefined) {
            if (typeof FishList[FishCommand[1].toLowerCase()] == "function")
              FishList[FishCommand[1].toLowerCase()](
                playerExist,
                FishCommand[2]
              );
          }
        } else {
          try {
            command =
              FishCommand[2] !== undefined
                ? FishCommand[1] + FishCommand[2]
                : FishCommand[1];
            if (typeof FishList[command.toLowerCase()] == "function")
              FishList[command.toLowerCase()](
                playerExist,
                CTS.UserList[arguments[0]]
              );
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
    function FishTransfer() {
      if (arguments[1] !== undefined && arguments[1] !== -1) {
        if (arguments[0].Points > arguments[2]) {
          if (arguments[4]) {
            arguments[0].Points -= arguments[2];
            if (arguments[1].Points <= arguments[3]) {
              arguments[3] = arguments[1].Points;
              arguments[1].Points -= arguments[3];
              arguments[0].Points += arguments[3];
              Send(
                "msg",
                "[FISHING BOAT]\n" +
                  arguments[0].Nickname +
                  " destroyed " +
                  arguments[1].Nickname +
                  "\nMoney made $" +
                  arguments[3] +
                  "!"
              );
              Fish.GetPlayer(arguments[1].Handle, true);
            } else {
              arguments[1].Points -= arguments[3];
              arguments[0].Points += arguments[3];
              Send(
                "msg",
                "[FISHING BOAT]\n" +
                  arguments[0].Nickname +
                  " robbed " +
                  arguments[1].Nickname +
                  " for $" +
                  arguments[3] +
                  "!"
              );
            }
          } else {
            arguments[0].Points = arguments[3];
            arguments[1].Points += arguments[3];
            Send(
              "msg",
              "[FISHING BOAT]\n" +
                arguments[0].Nickname +
                " split their money with " +
                arguments[1].Nickname +
                "!"
            );
          }
        } else {
          Send(
            "msg",
            "[FISHING BOAT]\n" +
              arguments[0].Nickname +
              " are you kidding me?\nTalk to me when you have money!"
          );
        }
      }
    }
    function FishTransaction() {
      if (arguments[0].Points > arguments[1]) {
        arguments[0].Points -= arguments[1];
        return true;
      } else {
        Send(
          "msg",
          "[FISHING BOAT]\n" +
            arguments[0].Nickname +
            ", are you kidding me?\nTalk to me when you have money!"
        );
        return false;
      }
    }

    //SERVER/CLIENT LIST FUNCTION
    var CommandList = {
      cts: function cts() {
        Alert(
          GetActiveChat(),
          '<b style="color:#ffffff;"><u>Owner Commands:</u></b>\n!raid <b style="color:#ffff00;">tc link</b>\n!closeall\n!kickall\n!version\n\n<b style="color:#ffffff;"><u>Moderator Commands:</u></b>\n!whoisbot\n!bot\n!bottoggle\n!greenroomtoggle\n!publiccommandtoggle\n!camsweep <b style="color:#ffff00;">5 - 30</b>\n!votetoggle\n!autokick (be careful!)\n!autoban (be careful!)\n\n!ytapi <b style="color:#ffff00;">apikey</b>\n!ytbypass <b style="color:#ffff00;">link (no playlists)</b>\n!yt <b style="color:#ffff00;">link | keyword</b>\n!ytskip\n!ytclear\n\n!userbanlist\n!userbanlistclear\n!userbanadd <b style="color:#ffff00;">user</b>\n!userbanremove <b style="color:#ffff00;">#</b>\n\n!nickbanlist\n!nickbanlistclear\n!nickbanadd <b style="color:#ffff00;">nick</b>\n!nickbanremove <b style="color:#ffff00;">#</b>\n\n!bankeywordlist\n!bankeywordlistclear\n!bankeywordadd <b style="color:#ffff00;">keyword | phrase</b>\n!bankeywordremove <b style="color:#ffff00;">#</b>\n\n!userkicklist\n!userkicklistclear\n!userkickadd <b style="color:#ffff00;">user</b>\n!userkickremove <b style="color:#ffff00;">#</b>\n\n!nickkicklist\n!nickkicklistclear\n!nickkickadd <b style="color:#ffff00;">nick</b>\n!nickkickremove <b style="color:#ffff00;">#</b>\n\n!kickkeywordlist\n!kickkeywordlistclear\n!kickkeywordadd <b style="color:#ffff00;">keyword | phrase</b>\n!kickkeywordremove <b style="color:#ffff00;">#</b>\n\n!oplist\n!oplistclear\n!opadd <b style="color:#ffff00;">user | -all</b>\n!opremove <b style="color:#ffff00;">#</b>\n!optoggle\n\n!modlist\n!modlistclear\n!modadd <b style="color:#ffff00;">user</b>\n!modremove <b style="color:#ffff00;">#</b>\n\n<b style="color:#ffffff;"><u>Jr. Moderator Commands:</u></b>\n!userban <b style="color:#ffff00;">user</b>\n!nickban <b style="color:#ffff00;">nick</b>\n!userkick <b style="color:#ffff00;">user</b>\n!nickkick <b style="color:#ffff00;">nick</b>\n!userclose <b style="color:#ffff00;">user</b>\n!nickclose <b style="color:#ffff00;">nick</b>\n\n<b style="color:#ffffff;"><u>User Commands:</u></b>\n!fps <b style="color:#ffff00;">1 - 60</b>\n\n!yt <b style="color:#ffff00;">link | keyword</b>\n!ytqueue\n\n!mentionlist\n!mentionlistclear\n!mentionadd <b style="color:#ffff00;">keyword</b>\n!mentionremove <b style="color:#ffff00;">#</b>\n\n!ignorelist\n!ignorelistclear\n!ignoreadd <b style="color:#ffff00;">user</b>\n!ignoreremove <b style="color:#ffff00;">#</b>\n\n!hiddencameralist\n!hiddencameralistclear\n!hiddencameraadd <b style="color:#ffff00;">user</b>\n!hiddencameraremove <b style="color:#ffff00;">#</b>\n\n!greetlist\n!greetlistclear\n!greetadd <b style="color:#ffff00;">user | -all</b>\n!greetremove <b style="color:#ffff00;">#</b>\n\n!ttslist\n!ttslistclear\n!ttsadd <b style="color:#ffff00;">user | -all | -event</b>\n!ttsremove <b style="color:#ffff00;">#</b>\n\n!highlightlist\n!highlightlistclear\n!highlightadd <b style="color:#ffff00;">user</b>\n!highlightremove <b style="color:#ffff00;">#</b>\n\n!reminderlist\n!reminderlistclear\n!reminderadd <b style="color:#ffff00;">user</b>\n!reminderremove <b style="color:#ffff00;">#</b>\n!remindertoggle\n\n!safelist\n!safelistclear\n!safeadd <b style="color:#ffff00;">user</b>\n!saferemove <b style="color:#ffff00;">#</b>\n\n!greenroomlist\n!greenroomlistclear\n!greenroomadd <b style="color:#ffff00;">user</b>\n!greenroomremove <b style="color:#ffff00;">#</b>\n\n!greenroomignorelist\n!greenroomignorelistclear\n!greenroomignoreadd <b style="color:#ffff00;">user</b>\n!greenroomignoreremove <b style="color:#ffff00;">#</b>\n\n!userlist\n\n!lists\n!listsclear\n\n!greetmodetoggle\n!imgurtoggle\n!raidtoggle\n!avatartoggle\n!notificationtoggle <b style="color:#ffff00;"></b>\n!popuptoggle\n!soundmetertoggle\n!timestamptoggle\n\n!coin\n!advice\n!8ball <b style="color:#ffff00;">question</b>\n!roll <b style="color:#ffff00;">#</b>\n!chuck\n!dad\n\n!vote <b style="color:#ffff00;">user</b>\n\n!clrall\n!clr\n!settings\n!share\n\n<b style="color:#ffffff;"><u>Game Commands:</u></b>\n!gameview\n!triviahost\n!trivia\n!triviahelp\n!fishhost\n!fish\n!fishhelp\n\n!triviaplayerlist\n!triviaplayerlistclear\n!triviaplayeradd <b style="color:#ffff00;">user</b>\n!triviaplayerremove <b style="color:#ffff00;">#</b>'
        );
      },
      ctsm: function ctsm() {
        Alert(
          GetActiveChat(),
          "!toggleReCamAllBrowsers\n!toggleGifts\n!hidecaps\n!hideCaps [Threshold]\n!hide420"
        );
      },
      togglegifts: function togglegifts() {
        CTS.DisableGifts = !CTS.DisableGifts;
        Save("DisableGifts", CTS.DisableGifts);
        Alert(
          GetActiveChat(),
          CTS.DisableGifts
            ? "Gifts will now be hidden in chat"
            : "Gifts will now be shown in chat"
        );
      },
      togglerecamallbrowsers: function togglerecamallbrowsers() {
        CTS.allowReCamAllBrowsers = !CTS.allowReCamAllBrowsers;
        if (CTS.allowReCamAllBrowsers)
          Alert(
            GetActiveChat(),
            "ReCam will now be allowed to run on any browser.\nHowever cam up may only occur while the page is in focus *<u>or when focus is later returned</u>*"
          );
        else Alert(GetActiveChat(), "ReCam browser override disabled");
        Save("allowReCamAllBrowsers", CTS.allowReCamAllBrowsers);
      },
      firstload: function firstload() {
        CTS.FirstLoad = true;
        Save("FirstLoad", CTS.FirstLoad);
        Alert(GetActiveChat(), "FirstLoad was reset");
      },
      hide420: function hide420() {
        CTS.Hide420 = !CTS.Hide420;
        Save("Hide420", CTS.Hide420);
        Alert(
          GetActiveChat(),
          CTS.Hide420 ? "Hiding 420 messages" : "Showing 420 messages"
        );
      },
      hidecaps: function hidecaps() {
        CTS.HideCaps = !CTS.HideCaps;
        var threshold = parseInt(arguments[0]);
        if (!isNaN(threshold) && arguments[0] === "" + threshold) {
          CTS.HideCaps = true;
          CTS.HideCapsThreshold = threshold;
          Save("HideCapsThreshold", CTS.HideCapsThreshold);
        } else if (arguments[0] != "") {
          Alert(GetActiveChat(), "ERR: Threshold must be a number");
          return;
        }
        Save("HideCaps", CTS.HideCaps);
        Alert(
          GetActiveChat(),
          CTS.HideCaps
            ? "Hiding ALLCAPS messages > " + CTS.HideCapsThreshold + " words"
            : "Showing ALLCAPS messages"
        );
      },
      help: function help() {
        this.cts();
      },
      userlist: function userlist() {
        Alert(GetActiveChat(), SettingsList.UserList());
      },
      ytapi: function ytapi() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (arguments[0].match(/^([0-9A-Z_-]*)/i)) {
            CTS.YouTube.API_KEY = arguments[0];
            Save("YouTubeAPI", arguments[0]);
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      fps: function fps() {
        CTS.FPS =
          arguments[0] === "" || isNaN(arguments[0])
            ? 30
            : arguments[0] > 60
            ? 60
            : arguments[0] < 1
            ? 1
            : parseInt(arguments[0]);
        Save("FPS", CTS.FPS);
        Alert(GetActiveChat(), "✓ Command Accepted!");
        if (CTS.Me.broadcasting)
          Alert(GetActiveChat(), "Settings will not change till you re-cam!");
      },
      mentionadd: function mentionadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.MentionList.includes(arguments[0].toUpperCase())) {
              CTS.MentionList.push(arguments[0].toUpperCase());
              Save("MentionList", JSON.stringify(CTS.MentionList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      mentionremove: function mentionremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      mentionlistclear: function mentionlistclear() {
        CTS.MentionList = [];
        Save("MentionList", JSON.stringify(CTS.MentionList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      mentionlist: function mentionlist() {
        Alert(GetActiveChat(), SettingsList.MentionList());
      },
      hiddencameraadd: function hiddencameraadd() {
        if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.HiddenCameraList.includes(arguments[0].toUpperCase())) {
              CTS.HiddenCameraList.push(arguments[0].toUpperCase());
              Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      hiddencameraremove: function hiddencameraremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      hiddencameralistclear: function hiddencameralistclear() {
        CTS.HiddenCameraList = [];
        Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      hiddencameralist: function hiddencameralist() {
        Alert(GetActiveChat(), SettingsList.HiddenCameraList());
      },
      ignoreadd: function ignoreadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.IgnoreList.includes(arguments[0].toUpperCase())) {
              CTS.IgnoreList.push(arguments[0].toUpperCase());
              Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      ignoreremove: function ignoreremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      ignorelistclear: function ignorelistclear() {
        CTS.IgnoreList = [];
        Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      ignorelist: function ignorelist() {
        Alert(GetActiveChat(), SettingsList.IgnoreList());
      },
      userbanadd: function userbanadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.UserBanList.includes(arguments[0].toUpperCase())) {
              CTS.UserBanList.push(arguments[0].toUpperCase());
              Save("UserBanList", JSON.stringify(CTS.UserBanList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
              var check = UsernameToHandle(arguments[0].toUpperCase());
              if (check != -1 && CTS.Me.mod) Send("ban", check);
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      userbanremove: function userbanremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      userbanlistclear: function userbanlistclear() {
        CTS.UserBanList = [];
        Save("UserBanList", JSON.stringify(CTS.UserBanList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      userbanlist: function userbanlist() {
        Alert(GetActiveChat(), SettingsList.UserBanList());
      },
      nickbanadd: function nickbanadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.NickBanList.includes(arguments[0].toUpperCase())) {
              CTS.NickBanList.push(arguments[0].toUpperCase());
              Save("NickBanList", JSON.stringify(CTS.NickBanList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
              var check = NicknameToHandle(arguments[0].toUpperCase());
              if (check != -1 && CTS.Me.mod) Send("ban", check);
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      nickbanremove: function nickbanremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      nickbanlistclear: function nickbanlistclear() {
        CTS.NickBanList = [];
        Save("NickBanList", JSON.stringify(CTS.NickBanList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      nickbanlist: function nickbanlist() {
        Alert(GetActiveChat(), SettingsList.NickBanList());
      },
      userkickadd: function userkickadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.UserKickList.includes(arguments[0].toUpperCase())) {
              CTS.UserKickList.push(arguments[0].toUpperCase());
              Save("UserKickList", JSON.stringify(CTS.UserKickList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
              var check = UsernameToHandle(arguments[0].toUpperCase());
              if (check != -1 && CTS.Me.mod) Send("kick", check);
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      userkickremove: function userkickremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      userkicklistclear: function userkicklistclear() {
        CTS.UserKickList = [];
        Save("UserKickList", JSON.stringify(CTS.UserKickList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      userkicklist: function userkicklist() {
        Alert(GetActiveChat(), SettingsList.UserKickList());
      },
      nickkickadd: function nickkickadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.NickKickList.includes(arguments[0].toUpperCase())) {
              CTS.NickKickList.push(arguments[0].toUpperCase());
              Save("NickKickList", JSON.stringify(CTS.NickKickList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
              var check = NicknameToHandle(arguments[0].toUpperCase());
              if (check != -1 && CTS.Me.mod) Send("kick", check);
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      nickkickremove: function nickkickremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      nickkicklistclear: function nickkicklistclear() {
        CTS.NickKickList = [];
        Save("NickKickList", JSON.stringify(CTS.NickKickList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      nickkicklist: function nickkicklist() {
        Alert(GetActiveChat(), SettingsList.NickKickList());
      },
      bankeywordadd: function bankeywordadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (!CTS.BanKeywordList.includes(arguments[0])) {
            CTS.BanKeywordList.push(arguments[0]);
            Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nItem is already entered!"
            );
          }
        }
      },
      bankeywordremove: function bankeywordremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      bankeywordlistclear: function bankeywordlistclear() {
        CTS.BanKeywordList = [];
        Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      bankeywordlist: function bankeywordlist() {
        Alert(GetActiveChat(), SettingsList.BanKeywordList());
      },
      kickkeywordadd: function kickkeywordadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (!CTS.KickKeywordList.includes(arguments[0])) {
            CTS.KickKeywordList.push(arguments[0]);
            Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nItem is already entered!"
            );
          }
        }
      },
      kickkeywordremove: function kickkeywordremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      kickkeywordlistclear: function kickkeywordlistclear() {
        CTS.KickKeywordList = [];
        Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      kickkeywordlist: function kickkeywordlist() {
        Alert(GetActiveChat(), SettingsList.KickKeywordList());
      },
      greetadd: function greetadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserName(arguments[0])) {
            if (!CTS.GreetList.includes(arguments[0].toUpperCase())) {
              CTS.GreetList.push(arguments[0].toUpperCase());
              Save("GreetList", JSON.stringify(CTS.GreetList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      greetremove: function greetremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      greetlistclear: function greetlistclear() {
        CTS.GreetList = [];
        Save("GreetList", JSON.stringify(CTS.GreetList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      greetlist: function greetlist() {
        Alert(GetActiveChat(), SettingsList.GreetList());
      },
      highlightadd: function highlightadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.HighlightList.includes(arguments[0].toUpperCase())) {
              CTS.HighlightList.push(arguments[0].toUpperCase());
              Save("HighlightList", JSON.stringify(CTS.HighlightList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      highlightremove: function highlightremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      highlightlistclear: function highlightlistclear() {
        CTS.HighlightList = [];
        Save("HighlightList", JSON.stringify(CTS.HighlightList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      highlightlist: function highlightlist() {
        Alert(GetActiveChat(), SettingsList.HighlightList());
      },
      opadd: function opadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserName(arguments[0])) {
            if (!CTS.BotOPList.includes(arguments[0].toUpperCase())) {
              CTS.BotOPList.push(arguments[0].toUpperCase());
              Save("BotOPList", JSON.stringify(CTS.BotOPList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      opremove: function opremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CTS.BotOPList[arguments[0]] !== undefined) {
            CTS.BotOPList.splice(arguments[0], 1);
            Save("BotOPList", JSON.stringify(CTS.BotOPList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
          }
        }
      },
      oplistclear: function oplistclear() {
        CTS.BotOPList = [];
        Save("BotOPList", JSON.stringify(CTS.BotOPList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      oplist: function oplist() {
        Alert(GetActiveChat(), SettingsList.BotOPList());
      },
      modadd: function modadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.BotModList.includes(arguments[0].toUpperCase())) {
              CTS.BotModList.push(arguments[0].toUpperCase());
              Save("BotModList", JSON.stringify(CTS.BotModList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      modremove: function modremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      modlistclear: function modlistclear() {
        CTS.BotModList = [];
        Save("BotModList", JSON.stringify(CTS.BotModList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      modlist: function modlist() {
        Alert(GetActiveChat(), SettingsList.BotModList());
      },
      ttsadd: function ttsadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (arguments[0].match(/^(-all|-event|[a-z0-9_]){1,32}$/i)) {
            if (!CTS.TTSList.includes(arguments[0].toUpperCase())) {
              CTS.TTSList.push(arguments[0].toUpperCase());
              Save("TTSList", JSON.stringify(CTS.TTSList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nItem is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      ttsremove: function ttsremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CTS.TTSList[arguments[0]] !== undefined) {
            CTS.TTSList.splice(arguments[0], 1);
            Save("TTSList", JSON.stringify(CTS.TTSList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
          }
        }
      },
      ttslistclear: function ttslistclear() {
        CTS.TTSList = [];
        Save("TTSList", JSON.stringify(CTS.TTSList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      ttslist: function ttslist() {
        Alert(GetActiveChat(), SettingsList.TTSList());
      },
      reminderadd: function reminderadd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          var reminder = arguments[0].match(
            /^((?:1[0-2]|0?[1-9]):(?:[0-5][0-9]) ?(?:am|pm)) ([\w\d\s|[^\x00-\x7F]*]*)/i
          );
          if (reminder === null) {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\n!reminderadd 4:18 PM This is an example you can try!"
            );
          } else {
            CTS.ReminderList.push([reminder[1], reminder[2]]);
            Save("ReminderList", JSON.stringify(CTS.ReminderList));
            Alert(GetActiveChat(), "✓ Command Accepted!");
            Reminder();
          }
        }
      },
      reminderremove: function reminderremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      reminderlistclear: function reminderlistclear() {
        CTS.ReminderList = [];
        Save("ReminderList", JSON.stringify(CTS.ReminderList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      reminderlist: function reminderlist() {
        Alert(GetActiveChat(), SettingsList.ReminderList());
      },
      remindertoggle: function remindertoggle() {
        CTS.Reminder = !CTS.Reminder;
        Save("Reminder", JSON.stringify(CTS.Reminder));
        Reminder();
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.Reminder
              ? "Reminders are now on!\n"
              : "Reminders are now off!\n ")
        );
      },
      soundmetertoggle: function soundmetertoggle() {
        CTS.SoundMeterToggle = !CTS.SoundMeterToggle;
        Save("SoundMeterToggle", JSON.stringify(CTS.SoundMeterToggle));
        SoundMeter();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.SoundMeterToggle
              ? "Sound meter is now on!\n"
              : "Sound meter is now off!\n ")
        );
      },
      timestamptoggle: function timestamptoggle() {
        CTS.TimeStampToggle = !CTS.TimeStampToggle;
        Save("TimeStampToggle", JSON.stringify(CTS.TimeStampToggle));
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.TimeStampToggle
              ? "Timestamps are now on!\n"
              : "Timestamps are now off\n ")
        );
        LoadMessage();
      },
      raidtoggle: function raidtoggle() {
        CTS.RaidToggle = !CTS.RaidToggle;
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.RaidToggle
              ? "You'll listen for raid call by room owners!\n"
              : "You've temporarily silenced raids!\n")
        );
      },
      safeadd: function safeadd() {
        if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") {
          // Can't protect guests;
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.SafeList.includes(arguments[0].toUpperCase())) {
              CTS.SafeList.push(arguments[0].toUpperCase());
              Save("AKB", JSON.stringify(CTS.SafeList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nUser is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      saferemove: function saferemove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      safelistclear: function safelistclear() {
        CTS.SafeList = [];
        Save("AKB", JSON.stringify(CTS.SafeList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      safelist: function safelist() {
        Alert(GetActiveChat(), SettingsList.SafeList());
      },
      greenroomadd: function greenroomadd() {
        if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") {
          // Can't protect guests;
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.GreenRoomList.includes(arguments[0].toUpperCase())) {
              CTS.GreenRoomList.push(arguments[0].toUpperCase());
              Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nUser is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      greenroomremove: function greenroomremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
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
      greenroomlistclear: function greenroomlistclear() {
        CTS.GreenRoomList = [];
        Save("GreenRoomList", JSON.stringify(CTS.GreenRoomList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      greenroomlist: function greenroomlist() {
        Alert(GetActiveChat(), SettingsList.GreenRoomList());
      },
      greenroomignoreadd: function greenroomignoreadd() {
        if (arguments[0] === "" || arguments[0].toUpperCase() === "GUEST") {
          // Can't protect guests;
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CheckUserNameStrict(arguments[0])) {
            if (!CTS.GreenRoomIgnoreList.includes(arguments[0].toUpperCase())) {
              CTS.GreenRoomIgnoreList.push(arguments[0].toUpperCase());
              Save(
                "GreenRoomIgnoreList",
                JSON.stringify(CTS.GreenRoomIgnoreList)
              );
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nUser is already entered!"
              );
            }
          } else {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\nArgument passed didn't match criteria!"
            );
          }
        }
      },
      greenroomignoreremove: function greenroomignoreremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          if (CTS.GreenRoomIgnoreList[arguments[0]] !== undefined) {
            CTS.GreenRoomIgnoreList.splice(arguments[0], 1);
            Save(
              "GreenRoomIgnoreList",
              JSON.stringify(CTS.GreenRoomIgnoreList)
            );
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
          }
        }
      },
      greenroomignorelistclear: function greenroomignorelistclear() {
        CTS.GreenRoomIgnoreList = [];
        Save("GreenRoomIgnoreList", JSON.stringify(CTS.GreenRoomIgnoreList));
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      greenroomignorelist: function greenroomignorelist() {
        Alert(GetActiveChat(), SettingsList.GreenRoomIgnoreList());
      },
      optoggle: function optoggle() {
        CTS.UserYT = !CTS.UserYT;
        Save("UserYT", JSON.stringify(CTS.UserYT));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.UserYT
              ? "Operators can now use YouTube.\n"
              : "Operators cannot use YouTube.\n")
        );
      },
      avatartoggle: function avatartoggle() {
        CTS.Avatar = !CTS.Avatar;
        Save("Avatar", JSON.stringify(CTS.Avatar));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.Avatar
              ? "Avatars from now on will be visible!\n "
              : "Avatars from now on will hidden!\n")
        );
        LoadMessage();
      },
      popuptoggle: function popuptoggle() {
        CTS.Popups = !CTS.Popups;
        Save("Popups", JSON.stringify(CTS.Popups));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.Popups
              ? "Popups from now on will be visible!\n "
              : "Popups from now on will hidden!\n")
        );
      },
      notificationtoggle: function notificationtoggle() {
        CTS.NotificationToggle++;
        if (CTS.NotificationToggle >= 3) CTS.NotificationToggle = 0;
        Save("NotificationToggle", JSON.stringify(CTS.NotificationToggle));
        NotificationDisplay();
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\nNotifications " +
            (CTS.NotificationToggle == 0
              ? "above chat enabled"
              : CTS.NotificationToggle == 1
              ? "in chat enabled"
              : "disabled") +
            "."
        );
      },
      greetmodetoggle: function greetmodetoggle() {
        CTS.GreetMode = !CTS.GreetMode;
        Save("GreetMode", JSON.stringify(CTS.GreetMode));
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.GreetMode
              ? "Server like greet is enabled."
              : "Server like greet is disabled.")
        );
      },
      imgurtoggle: function imgurtoggle() {
        CTS.Imgur = !CTS.Imgur;
        Save("Imgur", JSON.stringify(CTS.Imgur));
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.Imgur
              ? "Imgur preview is enabled."
              : "Imgur preview is disabled.")
        );
      },
      publiccommandtoggle: function publiccommandtoggle() {
        CTS.PublicCommandToggle = !CTS.PublicCommandToggle;
        Save("PublicCommandToggle", JSON.stringify(CTS.PublicCommandToggle));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.PublicCommandToggle
              ? "Public commands (8Ball,  Advice, Chuck, Coin, Dad, Urb) are enabled."
              : "Public commands (8Ball,  Advice, Chuck, Coin, Dad, Urb) are disabled.")
        );
      },
      greenroomtoggle: function greenroomtoggle() {
        CTS.GreenRoomToggle = !CTS.GreenRoomToggle;
        Save("GreenRoomToggle", JSON.stringify(CTS.GreenRoomToggle));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.GreenRoomToggle
              ? "Green Room Auto Allow ON!"
              : "Green Room Auto Allow OFF!")
        );
      },
      clr: function clr() {
        CTS.Message[GetActiveChat()] = [];
        ChatLogElement.querySelector("#cts-chat-content").innerHTML = "";
      },
      clrall: function clrall() {
        CTS.Message = [];
        CTS.Message[0] = [];
        window.TinychatApp.getInstance().defaultChatroom._chatlog.items = [];
        ChatLogElement.querySelector("#cts-chat-content").innerHTML = "";
      },
      autokick: function autokick() {
        if (arguments[1] === false && CTS.Me.mod) {
          CTS.AutoKick = !CTS.AutoKick;
          CTS.AutoBan = false;
          Alert(
            GetActiveChat(),
            "✓ Command Accepted!\n" +
              (CTS.AutoKick ? "AUTO KICK IS NOW ON!" : "AUTO KICK IS NOW OFF!")
          );
          if (CTS.AutoKick === true) CheckUserListSafe("kick");
        }
      },
      autoban: function autoban() {
        if (arguments[1] === false && CTS.Me.mod) {
          CTS.AutoBan = !CTS.AutoBan;
          CTS.AutoKick = false;
          Alert(
            GetActiveChat(),
            "✓ Command Accepted!\n" +
              (CTS.AutoBan ? "AUTO BAN IS NOW ON!" : "AUTO BAN IS NOW OFF!")
          );
          if (CTS.AutoBan === true) CheckUserListSafe("ban");
        }
      },
      camsweep: function camsweep() {
        if (CTS.Me.mod && CTS.Host === CTS.Me.handle) {
          CTS.Camera.SweepTimer =
            arguments[0] === "" || isNaN(arguments[0])
              ? 5
              : arguments[0] > 30
              ? 30
              : arguments[0] < 1
              ? 1
              : parseInt(arguments[0]);
          CTS.Camera.Sweep = !CTS.Camera.Sweep;
          clearTimeout(CTS.Camera.clearRandom);
          Settings();
          Alert(
            GetActiveChat(),
            "✓ Command Accepted!\n" +
              (CTS.Camera.Sweep
                ? "Camera sweep is now on!\nTime set: " +
                  CTS.Camera.SweepTimer +
                  "min(s)"
                : "Camera sweep is now off!")
          );
        }
      },
      bottoggle: function bottoggle() {
        CTS.Bot = !CTS.Bot;
        Save("Bot", JSON.stringify(CTS.Bot));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.Bot
              ? "You'll now ask !bot bypass on load."
              : "You'll not !bot bypass on load.")
        );
      },
      votetoggle: function votetoggle() {
        if (CTS.Me.mod) {
          CTS.VoteSystem = !CTS.VoteSystem;
          CTS.WaitToVoteList = [];
          var len = CTS.UserList.length;
          if (len > 0) {
            for (var i = 0; i < len; i++) CTS.UserList[i].vote = 0;
          }
          Alert(
            GetActiveChat(),
            "✓ Command Accepted!\n" +
              (CTS.VoteSystem ? "VOTING IS NOW ON!" : "VOTING IS NOW OFF!")
          );
        }
      },
      bot: function bot() {
        if (arguments[1] === false && CTS.Me.mod)
          Alert(0, "✓ Command Accepted!\nBot bypass was called!");
      },
      share: function share() {
        var msg =
          "The Bodega Bot for TinyChat:\n\n" +
          "1. Install TamperMonkey: https://www.tampermonkey.net/\n\n" +
          "2. Install Bodega Bot: https://greasyfork.org/en/scripts/501454-bodega-bot\n\n" +
          "3. Install ADDON+ for Bodega Bot: https://greasyfork.org/en/scripts/503234-addon-for-bodega-bot\n\n" +
          "📷 Screenshot - 📺 Youtube Sync Play - 🛠 Command List";
        if (GetActiveChat() !== 0) {
          Send("pvtmsg", msg, GetActiveChat());
          PushPM(GetActiveChat(), msg);
        } else {
          Send("msg", msg);
        }
      },
      gameview: function gameview() {
        CTS.CanSeeGames = !CTS.CanSeeGames;
        Save("CanSeeGames", JSON.stringify(CTS.CanSeeGames));
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.CanSeeGames ? "GAME VIEW IS NOW ON!" : "GAME VIEW IS NOW OFF!")
        );
      },
      fishhost: function fishhost() {
        CTS.CanHostFishGames = !CTS.CanHostFishGames;
        Save("CanHostFishGames", JSON.stringify(CTS.CanHostFishGames));
        Fish.Reset();
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.CanHostFishGames
              ? "FISH GAME HOSTING IS NOW ON!"
              : "FISH GAME HOSTING IS NOW OFF!")
        );
      },
      triviahost: function triviahost() {
        CTS.CanHostTriviaGames = !CTS.CanHostTriviaGames;
        Save("CanHostTriviaGames", JSON.stringify(CTS.CanHostTriviaGames));
        Trivia.Reset();
        Settings();
        Alert(
          GetActiveChat(),
          "✓ Command Accepted!\n" +
            (CTS.CanHostTriviaGames
              ? "TRIVIA GAME HOSTING IS NOW ON!"
              : "TRIVIA GAME HOSTING IS NOW OFF!")
        );
      },
      trivia: function trivia() {
        if (CTS.Host === CTS.Me.handle && CTS.CanHostTriviaGames) {
          CTS.Game.Trivia.Started = !CTS.Game.Trivia.Started;
          Alert(
            GetActiveChat(),
            "✓ Command Accepted!\n" +
              (CTS.Game.Trivia.Started
                ? "Trivia is now on!\n"
                : "Trivia is now off!\n")
          );
          if (CTS.Game.Trivia.Started) {
            Trivia.init();
          } else {
            Trivia.Reset();
          }
        }
      },
      triviaplayeradd: function triviaplayeradd() {
        if (arguments[0] === "") {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          var player = arguments[0].match(/^([a-z0-9_]{1,32}) ([0-9]{1,10})/i);
          if (player === null) {
            Alert(
              GetActiveChat(),
              "X Command Rejected!\n!triviaplayeradd TheBodega \nThis is an example you can try!"
            );
          } else {
            if (
              CTS.Game.Trivia.PlayerList[player[1].toUpperCase()] === undefined
            ) {
              var point = parseInt(player[2]);
              CTS.Game.Trivia.PlayerList[player[1].toUpperCase()] = point;
              Save(
                "TriviaPlayerList",
                JSON.stringify(CTS.Game.Trivia.PlayerList)
              );
              var user = UsernameToUser(player[1].toUpperCase());
              if (user != -1) CTS.UserList[user].triviapoints = point;
              Alert(GetActiveChat(), "✓ Command Accepted!");
            } else {
              Alert(
                GetActiveChat(),
                "X Command Rejected!\nUsername is already entered!"
              );
            }
          }
        }
      },
      triviaplayerremove: function triviaplayerremove() {
        if (arguments[0] === "" || isNaN(arguments[0])) {
          Alert(
            GetActiveChat(),
            "X Command Rejected!\nParameter was missing/incorrect\nUse <b>!cts</b> for help."
          );
        } else {
          var user = Object.keys(CTS.Game.Trivia.PlayerList);
          if (CTS.Game.Trivia.PlayerList[user[arguments[0]]] !== undefined) {
            delete CTS.Game.Trivia.PlayerList[user[arguments[0]]];
            Save(
              "TriviaPlayerList",
              JSON.stringify(CTS.Game.Trivia.PlayerList)
            );
            var useron = UsernameToUser(user[arguments[0]]);
            if (useron != -1) CTS.UserList[useron].triviapoints = 0;
            Alert(GetActiveChat(), "✓ Command Accepted!");
          } else {
            Alert(GetActiveChat(), "X Command Rejected!\nID was not found!");
          }
        }
      },
      triviaplayerlistclear: function triviaplayerlistclear() {
        CTS.Game.Trivia.PlayerList = {};
        Save("TriviaPlayerList", JSON.stringify(CTS.Game.Trivia.PlayerList));
        for (var i = 0; i < CTS.UserList.length; i++)
          CTS.UserList[i].triviapoints = 0;
        Alert(GetActiveChat(), "✓ Command Accepted!");
      },
      triviaplayerlist: function triviaplayerlist() {
        Alert(GetActiveChat(), SettingsList.TriviaPlayerList());
      },
      version: function version() {
        if (!CTS.Me.owner) {
          var msg = "I am using " + CTS.Project.Name + "v" + Ver();
          if (GetActiveChat() !== 0) {
            Send("pvtmsg", msg, GetActiveChat());
            PushPM(GetActiveChat(), msg);
          } else {
            Send("msg", msg);
          }
        }
      },
      roll: function roll() {
        var dice,
          msg = "";
        dice =
          arguments[0] === "" || isNaN(arguments[0])
            ? 1
            : arguments[0] < 12
            ? arguments[0]
            : 12;
        for (var i = 0; i < dice; i++) msg += Dice();
        if (GetActiveChat() !== 0) {
          Send("pvtmsg", msg, GetActiveChat());
          PushPM(GetActiveChat(), msg);
        } else {
          Send("msg", msg);
        }
      },
      coin: function coin() {
        if (CTS.Host == 0 || GetActiveChat() !== 0) {
          var msg =
            "The coin landed on " + (Rand(0, 1) == 1 ? "heads" : "tails") + "!";
          if (GetActiveChat() !== 0) {
            Send("pvtmsg", msg, GetActiveChat());
          } else {
            Send("msg", msg);
          }
        }
      },
      settings: function settings() {
        Settings();
      },
      lists: function lists() {
        Alert(
          GetActiveChat(),
          SettingsList.UserList() +
            "\n" +
            SettingsList.UserBanList() +
            "\n" +
            SettingsList.NickBanList() +
            "\n" +
            SettingsList.BanKeywordList() +
            "\n" +
            SettingsList.UserKickList() +
            "\n" +
            SettingsList.NickKickList() +
            "\n" +
            SettingsList.KickKeywordList() +
            "\n" +
            SettingsList.BotOPList() +
            "\n" +
            SettingsList.BotModList() +
            "\n" +
            SettingsList.MentionList() +
            "\n" +
            SettingsList.HiddenCameraList() +
            "\n" +
            SettingsList.IgnoreList() +
            "\n" +
            SettingsList.GreetList() +
            "\n" +
            SettingsList.TTSList() +
            "\n" +
            SettingsList.HighlightList() +
            "\n" +
            SettingsList.ReminderList() +
            "\n" +
            SettingsList.TriviaPlayerList()
        );
      },
      listsclear: function listsclear() {
        CTS.MentionList = [];
        CTS.IgnoreList = [];
        CTS.HiddenCameraList = [];
        CTS.UserBanList = [];
        CTS.UserKickList = [];
        CTS.NickBanList = [];
        CTS.NickKickList = [];
        CTS.BanKeywordList = [];
        CTS.KickKeywordList = [];
        CTS.GreetList = [];
        CTS.HighlightList = [];
        CTS.ReminderList = [];
        CTS.TTSList = [];
        CTS.BotOPList = [];
        CTS.BotModList = [];
        Save("MentionList", JSON.stringify(CTS.MentionList));
        Save("IgnoreList", JSON.stringify(CTS.IgnoreList));
        Save("HiddenCameraList", JSON.stringify(CTS.HiddenCameraList));
        Save("UserBanList", JSON.stringify(CTS.UserBanList));
        Save("UserKickList", JSON.stringify(CTS.UserKickList));
        Save("NickBanList", JSON.stringify(CTS.NickBanList));
        Save("NickKickList", JSON.stringify(CTS.NickKickList));
        Save("BanKeywordList", JSON.stringify(CTS.BanKeywordList));
        Save("KickKeywordList", JSON.stringify(CTS.KickKeywordList));
        Save("GreetList", JSON.stringify(CTS.GreetList));
        Save("HighlightList", JSON.stringify(CTS.HighlightList));
        Save("ReminderList", JSON.stringify(CTS.ReminderList));
        Save("TTSList", JSON.stringify(CTS.TTSList));
        Save("BotModList", JSON.stringify(CTS.BotModList));
        Save("BotOPList", JSON.stringify(CTS.BotOPList));
        Alert(GetActiveChat(), "✓ Command Accepted!\nItems Mentionlist, igore");
      },
      ytqueue: function ytqueue() {},
      ytclear: function ytclear() {},
      ytskip: function ytskip() {},
      yt: function yt() {},
      ytbypass: function ytbypass() {}
    };
    var SettingsList = {
      UserList: function UserList() {
        var index,
          msg,
          len = CTS.UserList.length;
        msg =
          '<b style="color:#ffffff;"><u>User list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg +=
            index +
            " : " +
            CTS.UserList[index].username +
            "\n(" +
            CTS.UserList[index].nick +
            ")\n";
        return msg;
      },
      UserBanList: function UserBanList() {
        var index,
          msg,
          len = CTS.UserBanList.length;
        msg =
          '<b style="color:#ffffff;"><u>User Ban list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.UserBanList[index] + "\n";
        return msg;
      },
      NickBanList: function NickBanList() {
        var index,
          msg,
          len = CTS.NickBanList.length;
        msg =
          '<b style="color:#ffffff;"><u>Nick Ban list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.NickBanList[index] + "\n";
        return msg;
      },
      BanKeywordList: function BanKeywordList() {
        var index,
          msg,
          len = CTS.BanKeywordList.length;
        msg =
          '<b style="color:#ffffff;"><u>Ban Keyword list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + HTMLtoTXT(CTS.BanKeywordList[index]) + "\n";
        return msg;
      },
      UserKickList: function UserKickList() {
        var index,
          msg,
          len = CTS.UserKickList.length;
        msg =
          '<b style="color:#ffffff;"><u>User Kick list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.UserKickList[index] + "\n";
        return msg;
      },
      NickKickList: function NickKickList() {
        var index,
          msg,
          len = CTS.NickKickList.length;
        msg =
          '<b style="color:#ffffff;"><u>Nick Kick list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.NickKickList[index] + "\n";
        return msg;
      },
      KickKeywordList: function KickKeywordList() {
        var index,
          msg,
          len = CTS.KickKeywordList.length;
        msg =
          '<b style="color:#ffffff;"><u>Kick Keyword list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + HTMLtoTXT(CTS.KickKeywordList[index]) + "\n";
        return msg;
      },
      BotOPList: function BotOPList() {
        var index,
          msg,
          len = CTS.BotOPList.length;
        msg =
          '<b style="color:#ffffff;"><u>Bot OP list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.BotOPList[index] + "\n";
        return msg;
      },
      BotModList: function BotModList() {
        var index,
          msg,
          len = CTS.BotModList.length;
        msg =
          '<b style="color:#ffffff;"><u>Bot Mod list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.BotModList[index] + "\n";
        return msg;
      },
      MentionList: function MentionList() {
        var index,
          msg,
          len = CTS.MentionList.length;
        msg =
          '<b style="color:#ffffff;"><u>Mention list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + HTMLtoTXT(CTS.MentionList[index]) + "\n";
        return msg;
      },
      IgnoreList: function IgnoreList() {
        var index,
          msg,
          len = CTS.IgnoreList.length;
        msg =
          '<b style="color:#ffffff;"><u>Ignore list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.IgnoreList[index] + "\n";
        return msg;
      },
      HiddenCameraList: function HiddenCameraList() {
        var index,
          msg,
          len = CTS.HiddenCameraList.length;
        msg =
          '<b style="color:#ffffff;"><u>Hidden Camera list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.HiddenCameraList[index] + "\n";
        return msg;
      },
      GreetList: function GreetList() {
        var index,
          msg,
          len = CTS.GreetList.length;
        msg =
          '<b style="color:#ffffff;"><u>Greet list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.GreetList[index] + "\n";
        return msg;
      },
      TTSList: function TTSList() {
        var index,
          msg,
          len = CTS.TTSList.length;
        msg =
          '<b style="color:#ffffff;"><u>TTS list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.TTSList[index] + "\n";
        return msg;
      },
      HighlightList: function HighlightList() {
        var index,
          msg,
          len = CTS.HighlightList.length;
        msg =
          '<b style="color:#ffffff;"><u>Highlight list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + " : " + CTS.HighlightList[index] + "\n";
        return msg;
      },
      ReminderList: function ReminderList() {
        var index,
          msg,
          len = CTS.ReminderList.length;
        msg =
          '<b style="color:#ffffff;"><u>Reminder list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg +=
            index +
            ": [" +
            CTS.ReminderList[index][0] +
            "] " +
            HTMLtoTXT(CTS.ReminderList[index][1]) +
            "\n";
        return msg;
      },
      SafeList: function SafeList() {
        var index,
          msg,
          len = CTS.SafeList.length;
        msg =
          '<b style="color:#ffffff;"><u>Safe list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + ": " + CTS.SafeList[index] + "\n";
        return msg;
      },
      GreenRoomList: function GreenRoomList() {
        var index,
          msg,
          len = CTS.GreenRoomList.length;
        msg =
          '<b style="color:#ffffff;"><u>Green Room list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + ": " + CTS.GreenRoomList[index] + "\n";
        return msg;
      },
      GreenRoomIgnoreList: function GreenRoomIgnoreList() {
        var index,
          msg,
          len = CTS.GreenRoomIgnoreList.length;
        msg =
          '<b style="color:#ffffff;"><u>Green Room Ignore list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg += index + ": " + CTS.GreenRoomIgnoreList[index] + "\n";
        return msg;
      },
      TriviaPlayerList: function TriviaPlayerList() {
        var index,
          msg,
          user = Object.keys(CTS.Game.Trivia.PlayerList),
          len = user.length;
        msg =
          '<b style="color:#ffffff;"><u>Trivia Player List list:</u></b>\n' +
          (!len ? "empty\n" : "");
        for (index = 0; index < len; index++)
          msg +=
            index +
            ": " +
            user[index] +
            "@" +
            CTS.Game.Trivia.PlayerList[user[index]] +
            "IQ\n";
        return msg;
      }
    };
    var MessageQueueList = {
      add: function add() {
        CTS.SendQueue.push(arguments[0]);
        MessageQueueList.run();
      },
      run: function run() {
        if (CTS.SendQueue !== undefined && CTS.SendQueue.length > 0) {
          setTimeout(function () {
            var temp = new Date();
            var OffsetTime = temp - CTS.LastMessage;
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
      msg: function msg() {
        var obj = {
          tc: arguments[0]
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
      pvtmsg: function pvtmsg() {
        var obj = {
          tc: arguments[0],
          text: arguments[1],
          handle: Number(arguments[2])
        };
        MessageQueueList.add(JSON.stringify(obj));
      },
      kick: function kick() {
        CheckSafeList(arguments[1], true);
        ServerSendList.msg(arguments[0], arguments[1], "kick");
      },
      ban: function ban() {
        CheckSafeList(arguments[1], true);
        ServerSendList.msg(arguments[0], arguments[1], "ban");
      },
      nick: function nick() {
        var obj = {
          tc: "nick",
          nick: arguments[1]
        };
        CTS.SocketTarget.send(JSON.stringify(obj));
      },
      stream_moder_close: function stream_moder_close() {
        CheckSafeList(arguments[1], true);
        ServerSendList.msg(arguments[0], arguments[1], "stream_moder_close");
      },
      stream_moder_allow: function stream_moder_allow() {
        ServerSendList.msg(arguments[0], arguments[1], "stream_moder_allow");
      },
      yut_playlist_add: function yut_playlist_add() {
        var obj = {
          tc: arguments[0],
          item: {
            id: arguments[1][0],
            duration: arguments[1][1] + 10,
            title: arguments[1][2],
            image: arguments[1][3]
          }
        };
        if (arguments[1][4] !== undefined) obj.item.offset = arguments[1][4];
        CTS.SocketTarget.send(JSON.stringify(obj));
      },
      yut_playlist_remove: function yut_playlist_remove() {
        ServerSendList.yut_playlist_add(arguments[0], arguments[1]);
      },
      yut_stop: function yut_stop() {
        ServerSendList.yut_playlist_add(arguments[0], arguments[1]);
      },
      yut_play: function yut_play() {
        ServerSendList.yut_playlist_add(arguments[0], arguments[1]);
      },
      yut_playlist: function yut_playlist() {
        ServerSendList.msg("yut_playlist");
      },
      yut_playlist_clear: function yut_playlist_clear() {
        ServerSendList.msg("yut_playlist_clear");
      }
    };
    var lastanswer = undefined;
    var ServerInList = {
      joined: function joined() {
        if (!CTS.ScriptInit) CTSRoomInject();
        Reset();
        CTS.Me = {
          handle: arguments[0].self.handle,
          username:
            arguments[0].self.username === ""
              ? "GUEST"
              : arguments[0].self.username.toUpperCase(),
          nick: arguments[0].self.nick,
          owner: arguments[0].self.owner,
          mod: arguments[0].self.mod,
          namecolor:
            window.CTSNameColor[Rand(0, window.CTSNameColor.length - 1)],
          avatar: arguments[0].self.avatar,
          broadcasting: false,
          lastBroadcast: 0
        };
        if (
          CTS.Me.nick.match(/^guest(?:\-[0-9]{1,10})?/i) &&
          CTS.Me.username !== "GUEST"
        )
          Send("nick", CTS.Me.username); //AUTO CORRECT NAME
        if (CTS.Me.mod && CTS.Bot && CTS.ScriptInit && CTS.SocketConnected)
          CheckHost();
        CTS.Room = {
          Avatar: arguments[0].room.avatar,
          Bio: arguments[0].room.biography,
          Name: arguments[0].room.name,
          PTT: arguments[0].room.pushtotalk,
          Website: arguments[0].room.website,
          YT_ON: arguments[0].room.youtube_enabled,
          Recent_Gifts: arguments[0].room.recent_gifts
        };
        CTS.SocketConnected = true;
      },
      userlist: function userlist() {
        var len = arguments[0].users.length;
        for (var user = 0; user < len; user++) {
          AKBS(arguments[0].users[user]);
          var username =
            arguments[0].users[user].username === ""
              ? "GUEST"
              : arguments[0].users[user].username.toUpperCase();
          CheckUserAbuse(
            arguments[0].users[user].handle,
            username,
            arguments[0].users[user].nick
          );
          CTS.UserList.push({
            handle: arguments[0].users[user].handle,
            username: username,
            nick: arguments[0].users[user].nick,
            owner: arguments[0].users[user].owner,
            mod: arguments[0].users[user].mod,
            namecolor:
              window.CTSNameColor[Rand(0, window.CTSNameColor.length - 1)],
            avatar:
              arguments[0].users[user].avatar === ""
                ? "https://avatars.tinychat.com/standart/small/eyePink.png"
                : arguments[0].users[user].avatar,
            canGame:
              arguments[0].users[user].username !== "GUEST" ? true : false,
            broadcasting: false,
            vote: 0,
            triviapoints: CTS.Game.Trivia.PlayerList[username] || 0,
            greet: true
          });
        }
        RoomUsers();
        debug();
      },
      join: function join() {
        var _arguments = arguments,
          _this5 = this;
        AKBS(arguments[0]);
        var user =
          arguments[0].username === ""
            ? "GUEST"
            : arguments[0].username.toUpperCase();
        CheckUserAbuse(arguments[0].handle, user, arguments[0].nick);
        if (
          CTS.HighlightList.includes(user) &&
          window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
            .enableSound &&
          !window.CTSMuted
        ) {
          window.CTSSound.HIGHLIGHT.volume = window.CTSRoomVolume;
          window.CTSSound.HIGHLIGHT.play();
        }
        arguments[0].greet = true;
        setTimeout(
          function () {
            _newArrowCheck(this, _this5);
            var user =
              _arguments[0].username === ""
                ? "GUEST"
                : _arguments[0].username.toUpperCase();
            var customName = customGreet(user);
            var name =
              customName != "n/a"
                ? customName
                : cleanNickname(_arguments[0].nick);
            var wb = false;
            var cooldown = getGreetCooldown(user);
            var msg = "";
            var capitalize = false;
            if (cooldown < window.CFG.greetCooldown) {
              _arguments[0].greet = false;
            } else if (cooldown < window.CFG.greetWbTime) {
              wb = true;
            }

            //skip guests
            if (_arguments[0].nick.toLowerCase().substring(0, 5) == "guest") {
              console.log("Greeting bypassed: guest");
              _arguments[0].greet = false;
            }
            if (wb)
              msg =
                window.CTSWelcomeBacks[
                  Rand(0, window.CTSWelcomeBacks.length - 1)
                ] + " ";
            else
              msg = window.CTSWelcomes[Rand(0, window.CTSWelcomes.length - 1)];
            if (
              (CTS.Host == CTS.Me.handle || window.CFG.alwaysGreetPeople) &&
              _arguments[0].greet == true
            ) {
              console.log("Greeting user");
              //Greeting + name
              msg = msg + " " + name;
              console.log("greet msg = " + msg);
              //Followup
              if (Math.random() < window.CFG.followupChance && wb == false) {
                //If special character at the end, capitalize followup message
                capitalize = isSpecialChar(msg.slice(-1)) ? true : false;
                capitalize = Math.random() > 0.5 || capitalize ? true : false;
                if (capitalize) {
                  if (isSpecialChar(msg.slice(-1))) msg = msg + " ";
                  else msg = msg + ". ";
                  var fu =
                    window.CTSFollowups[
                      Rand(0, window.CTSFollowups.length - 1)
                    ];
                  msg = msg + " " + fu.charAt(0).toUpperCase() + fu.slice(1);
                }
                //If not, regular followup message
                else {
                  msg =
                    msg +
                    " " +
                    window.CTSFollowups[
                      Rand(0, window.CTSFollowups.length - 1)
                    ];
                }
              }
              if (CTS.GreetMode && _arguments[0].greet) Send("msg", msg);
              if (
                window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
                  .enableSound &&
                !window.CTSMuted
              ) {
                window.CTSSound.GREET.volume = window.CTSRoomVolume;
                window.CTSSound.GREET.play();
              }
            }
          }.bind(this),
          window.CFG.greetDelay,
          arguments
        );
        CTS.NoGreet = false;
        AddUser(
          arguments[0].handle,
          arguments[0].mod,
          window.CTSNameColor[Rand(0, window.CTSNameColor.length - 1)],
          arguments[0].avatar === ""
            ? "https://avatars.tinychat.com/standart/small/eyePink.png"
            : arguments[0].avatar,
          arguments[0].nick,
          user,
          user !== "GUEST" ? true : false,
          arguments[0].owner
        );
        RoomUsers();
        debug();
      },
      sysmsg: function sysmsg() {
        if (CTS.Me.mod) {
          var action = arguments[0].text.match(
            /^([a-z0-9_]{1,32}):? (closed|banned|kicked) ([a-z0-9_]{1,32})$/i
          );
          if (action !== null) {
            var user;
            if (
              action[2] == "closed" ||
              action[2] == "banned" ||
              action[2] == "kicked"
            ) {
              user = NicknameToUser(action[3].toUpperCase());
              if (user != -1) {
                if (CTS.UserList[user].username !== "GUEST") {
                  var a = CTS.GreenRoomList.indexOf(
                    CTS.UserList[user].username
                  );
                  if (a !== -1) {
                    //REMOVE
                    debug(
                      "GREENROOMLIST::",
                      "REMOVE USER " +
                        CTS.UserList[user].username +
                        " FROM GREENROOMLIST"
                    );
                    Alert(
                      GetActiveChat(),
                      "✓ Removing " +
                        CTS.UserList[user].username +
                        " from greenroomlist!"
                    );
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
      nick: function nick() {
        var user = HandleToUser(arguments[0].handle);
        if (user != -1) {
          AddUserNotification(
            4,
            CTS.UserList[user].namecolor,
            CTS.UserList[user].nick,
            CTS.UserList[user].username,
            true,
            arguments[0].nick
          );
          if (
            (CTS.GreetList.includes(CTS.UserList[user].username) ||
              (CTS.Host == CTS.Me.handle && CTS.GreetList.includes("-ALL"))) &&
            CTS.NoGreet === false
          )
            Send(
              "msg",
              CTS.UserList[user].nick +
                "\nwith the account name " +
                CTS.UserList[user].username +
                " changed their name to " +
                arguments[0].nick
            );
          CTS.UserList[user].nick = arguments[0].nick;
          if (CTS.Me.handle == arguments[0].handle)
            CTS.Me.nick = arguments[0].nick;
          CheckUserAbuse(
            arguments[0].handle,
            CTS.UserList[user].username,
            arguments[0].nick
          );
        }
        debug();
      },
      stream_connected: function stream_connected() {
        if (
          CTS.Host === CTS.Me.handle &&
          CTS.GreenRoomToggle &&
          arguments[0].publish == false &&
          CTS.Me.handle !== arguments[0].handle &&
          !CTS.Camera.List.includes(arguments[0].handle)
        ) {
          //USER IS NOT ON CAMERA START AUTO ACCEPT PROCESS
          var user = HandleToUser(arguments[0].handle);
          if (user != -1) {
            debug("CAMERA::WAITING", "nickname:" + CTS.UserList[user].nick);
            if (
              !CTS.GreenRoomIgnoreList.includes(CTS.UserList[user].username) &&
              CTS.GreenRoomList.includes(CTS.UserList[user].username)
            )
              Send("stream_moder_allow", CTS.UserList[user].handle);
          }
        }
        debug();
      },
      stream_closed: function stream_closed() {
        if (arguments[0].handle == CTS.Me.handle)
          CTS.Me.lastBroadcast = Date.now();
        debug();
      },
      publish: function publish() {
        //ADD GLOBAL CAMERA
        CheckUserStream(arguments[0].handle, true);
        debug();
      },
      unpublish: function unpublish() {
        //REMOVE GLOBAL CAMERA
        CheckUserStream(arguments[0].handle, false);
        debug();
      },
      ping: function ping() {
        if (CTS.ScriptInit) {
          var verify;
          if (CTS.WatchList.length > 0) {
            verify = new Date() - CTS.WatchList[0][2];
            debug("WATCHLIST::LIST", CTS.WatchList);
            debug(
              "WATCHLIST::VERIFYING",
              CTS.WatchList[0][0] + " " + verify + "/700000"
            );
            if (CTS.SafeList.indexOf(CTS.WatchList[0][0]) === -1) {
              //LET'S NOT ADD TWICE
              if (verify > 700000) {
                debug(
                  "WATCHLIST::VERIFIED",
                  CTS.WatchList[0][0] + " " + verify + "/700000"
                );
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
            debug(
              "VOTE::WAIT",
              CTS.WaitToVoteList[0][0] + " " + verify + "/300000"
            );
            if (verify > 300000) {
              debug(
                "VOTE::READY",
                CTS.WaitToVoteList[0][0] + " " + verify + "/300000"
              );
              CTS.WaitToVoteList.shift();
            }
          }
        }
        //DISPOSE OF ITEMS
        window.TinychatApp.getInstance().defaultChatroom._chatlog.items = [];
        window.TinychatApp.getInstance().defaultChatroom.packetWorker.queue =
          {};
        debug();
      },
      quit: function quit() {
        if (CTS.ScriptInit) {
          if (CTS.WatchList.length > 0) {
            var len = CTS.WatchList.length;
            for (var i = 0; i < len; i++) {
              if (CTS.WatchList[i][1] == arguments[0].handle) {
                CTS.WatchList.splice(i, 1);
                break;
              }
            }
          }
          if (CTS.Me.mod) RemoveUserCamera(arguments[0].handle);
          var user = HandleToUser(arguments[0].handle);
          if (user != -1) {
            if (
              CTS.Me.handle === CTS.Host &&
              Fish.GetPlayer(arguments[0].handle, true, false)
            )
              Send(
                "msg",
                CTS.Game.Fish.UserQuitLast +
                  ", has slipped off the boat; I don't think we should look back."
              );
            //SEND THEM OUT
            AddUserNotification(
              2,
              CTS.UserList[user].namecolor,
              CTS.UserList[user].nick,
              CTS.UserList[user].username,
              true
            );
            CTS.UserList.splice(user, 1);
          }
          RoomUsers();
          if (CTS.Host == arguments[0].handle) {
            CTS.Host = 0;
            CTS.Camera.Sweep = false;
            if (CTS.Me.mod && CTS.Bot) {
              setTimeout(function () {
                if (CTS.Host == 0) SetBot(false);
              }, Rand(10, 30) * 1000);
            }
          }
        }
        debug();
      },
      msg: function msg() {
        if (CTS.ScriptInit) {
          var user = HandleToUser(arguments[0].handle);
          if (user != -1) {
            if (!LineSpam(arguments[0].text, CTS.UserList[user].mod)) {
              if (GamePrevention(arguments[0].text, CTS.UserList[user].mod)) {
                var text = HTMLtoTXT(arguments[0].text);
                if (text.match(/stinky/g)) return;
                var found = text.match(
                  /(?!The first user to type the number \")([0-9]{1,})/g
                );
                if (found !== null) {
                  console.log(found);
                  lastanswer = found[0];
                }
                found = text.match(/︻┳═一 𝚂𝚃𝙰𝚁𝚃 一═┳︻/g);
                if (found !== null) {
                  CTS.SocketTarget.send(JSON.stringify(lastanswer));
                }
                //ALL USERS REPORT
                OwnerCommand(user, arguments[0].text);
                BotCheck(user, text, arguments[0]);
                //MODERATORS
                if (CTS.Me.mod) {
                  if (CTS.Host == CTS.Me.handle) BotCommandCheck(user, text);
                  CheckUserWordAbuse(user, arguments[0].text);
                }

                // * change *
                if (CTS.HideCaps) {
                  if (capsCheck(text)) {
                    text = text.toLowerCase();
                  }
                }
                if (CTS.Hide420) {
                  if (text.startsWith("📣")) return;
                }
                var t = text.toLowerCase();
                if (t.startsWith("!alwaybot")) {
                  if (CTS.UserList[user].username == CTS.Me.username) {
                    CFG.alwaysBot = true;
                    BotForce();
                  } else CFG.alwaysBot = true;
                }
                if (
                  !CheckUserIgnore(user) &&
                  !CheckUserTempIgnore(user) &&
                  IgnoreText(text)
                ) {
                  //PUSH MESSAGE
                  if (isSafeListed(CTS.UserList[user].username))
                    text = CheckImgur(text);
                  CTS.Message[0].push({
                    time: Time(),
                    namecolor: CTS.UserList[user].namecolor,
                    avatar: CTS.UserList[user].avatar,
                    username: CTS.UserList[user].username,
                    nick: CTS.UserList[user].nick,
                    msg: text,
                    mention: false
                  });
                  var msg = CTS.Message[0][CTS.Message[0].length - 1];
                  if (CTS.Me.handle !== arguments[0].handle) {
                    if (
                      CTS.UserList[user].mod &&
                      (text.match(/^!autokick$/i) || text.match(/^!autoban$/i))
                    ) {
                      Alert(
                        GetActiveChat(),
                        "✓ AntiSpam Watch List CLEARED!\nAnother user has initiated autokick/autoban."
                      );
                      CTS.AutoKick = false;
                      CTS.AutoBan = false;
                    }
                    if (
                      window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
                        .enableSound &&
                      !window.CTSMuted
                    ) {
                      if (CTS.UserList.length <= 14) {
                        window.CTSSound.MSG.volume = window.CTSRoomVolume;
                        window.CTSSound.MSG.play();
                      }
                      if (
                        CTS.TTS.synth !== undefined &&
                        (CTS.TTSList.includes(CTS.UserList[user].username) ||
                          CTS.TTSList.includes("-ALL"))
                      )
                        TTS(
                          CTS.UserList[user].nick +
                            (!text.match(
                              /(?:^!)|(?:https?|www|\uD83C\uDFB5)/gim
                            )
                              ? " said, " + text
                              : "is box banging!")
                        );
                    }
                    var len = CTS.MentionList.length;
                    for (var i = 0; i < len; i++) {
                      if (text.toUpperCase().includes(CTS.MentionList[i])) {
                        if (
                          window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
                            .enableSound &&
                          !window.CTSMuted
                        ) {
                          window.CTSSound.MENTION.volume = window.CTSRoomVolume;
                          window.CTSSound.MENTION.play();
                        }
                        msg.mention = true;
                        AddUserNotification(
                          3,
                          CTS.UserList[user].namecolor,
                          CTS.UserList[user].nick,
                          CTS.UserList[user].username,
                          true
                        );
                      }
                    }
                  }
                  if (GetActiveChat() === 0)
                    CreateMessage(
                      msg.time,
                      msg.namecolor,
                      msg.avatar,
                      msg.username,
                      msg.nick,
                      msg.msg,
                      msg.mention,
                      0
                    );
                  MessagePopUp(user, text, true, false);
                }
              }
            } else {
              if (CTS.Host == CTS.Me.handle) {
                Send("kick", arguments[0].handle);
              } else if (CTS.Host == 0) {
                if (CTS.Me.mod) Send("kick", arguments[0].handle);
              }
            }
          }
        }
        debug();
      },
      pvtmsg: function pvtmsg() {
        if (CTS.ScriptInit) {
          if (CTS.enablePMs === true) {
            if (arguments[0].handle != CTS.Me.handle) {
              var user = HandleToUser(arguments[0].handle);
              if (user != -1) {
                if (!LineSpam(arguments[0].text, CTS.UserList[user].mod)) {
                  if (
                    GamePrevention(arguments[0].text, CTS.UserList[user].mod)
                  ) {
                    var text = arguments[0].text;
                    if (CTS.Me.mod) CheckUserWordAbuse(user, arguments[0].text);
                    if (
                      !CheckUserIgnore(user) &&
                      !CheckUserTempIgnore(user) &&
                      IgnoreText(text)
                    ) {
                      if (!CTS.Message[arguments[0].handle])
                        CTS.Message[arguments[0].handle] = [];
                      PushPM(arguments[0].handle, text, user);
                      if (
                        window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
                          .enableSound &&
                        !window.CTSMuted
                      ) {
                        window.CTSSound.PVTMSG.volume = window.CTSRoomVolume;
                        window.CTSSound.PVTMSG.play();
                        if (
                          CTS.TTS.synth !== undefined &&
                          (CTS.TTSList.includes(CTS.UserList[user].username) ||
                            CTS.TTSList.includes("-ALL"))
                        )
                          TTS(
                            CTS.UserList[user].nick +
                              (!text.match(/(?:^!)|(?:https?|www)/gim)
                                ? " said, " + text
                                : "is box banging!")
                          );
                      }
                      text = HTMLtoTXT(text);
                      if (isSafeListed(CTS.UserList[user].username))
                        text = CheckImgur(text);
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
      gift: function gift() {
        if (CTS.DisableGifts) return;
        CreateGift(arguments[0]);
        debug();
      },
      yut_playlist_add: function yut_playlist_add() {
        if (CTS.ScriptInit) {
          if (!CTS.YouTube.Playing) {
            if (CTS.PlayListStart === true) CTS.PlayListStart = false;
            if (CTS.Host != CTS.Me.handle) {
              Send("msg", "!play");
            } else {
              YouTubePlayList();
            }
          }
        }
        debug();
      },
      yut_playlist: function yut_playlist() {
        if (CTS.ScriptInit) {
          if (CTS.Me.mod && CTS.Me.handle == CTS.Host) {
            if (CTS.YouTube.Clear === true) {
              if (arguments[0].items !== null) Send("yut_playlist_clear");
              CTS.YouTube.MessageQueueList = [];
              Send("msg", "🎵YouTube cleared!🎵");
              CTS.YouTube.Clear = false;
            } else {
              if (arguments[0].items === null) {
                CTS.PlayListStart = true;
              } else {
                CTS.YouTube.PlayListCount = arguments[0].items.length;
                CTS.PlayListStart = false;
                if (CTS.YouTube.ShowQueue === true) {
                  var msg =
                    "🎵" + CTS.YouTube.PlayListCount + " track(s) in queue!🎵";
                  for (var i = 0; i < 3; i++) {
                    if (arguments[0].items[i] === undefined) break;
                    msg =
                      msg +
                      "\n" +
                      (i + 1) +
                      ": " +
                      arguments[0].items[i].title +
                      "\n[" +
                      Math.floor(arguments[0].items[i].duration / 60) +
                      "M" +
                      (arguments[0].items[i].duration % 60) +
                      "S]";
                  }
                  Send("msg", msg);
                }
              }
              if (
                arguments[0].items !== null &&
                CTS.Host == CTS.Me.handle &&
                CTS.YouTube.Playing === false
              )
                CheckYouTube(
                  "https://www.youtube.com/watch?v=" + arguments[0].items[0].id,
                  false
                );
            }
            CTS.YouTube.ShowQueue = false;
          }
        }
        debug();
      },
      yut_play: function yut_play() {
        if (CTS.ScriptInit) {
          if (CTS.YouTube.CurrentTrack.ID != arguments[0].item.id) {
            CTS.YouTube.CurrentTrack.ID = arguments[0].item.id;
            CTS.YouTube.CurrentTrack.duration = arguments[0].item.duration;
            CTS.YouTube.CurrentTrack.title = arguments[0].item.title;
            CTS.YouTube.CurrentTrack.thumbnail = arguments[0].item.image;
            CTS.YouTube.CurrentTrack.offset = arguments[0].item.offset;
            MessagePopUp(
              -1,
              CTS.YouTube.CurrentTrack.title + " is now playing!",
              true,
              true
            );
          }
          if (window.YouTube.Playing) window.YouTube.stopVideo();
          if (
            window.TinychatApp.BLL.SettingsFeature.prototype.getSettings()
              .enableYoutube
          ) {
            window.YouTube.Init();
            window.YouTube.Offset = setInterval(function () {
              CTS.YouTube.CurrentTrack.offset += 1;
              if (window.YouTube.Popup == null || window.YouTube.Popup.closed)
                YouTubeDuration(
                  Math.trunc(
                    (CTS.YouTube.CurrentTrack.offset * 100) /
                      CTS.YouTube.CurrentTrack.duration
                  )
                );
            }, 1000);
          }
          CTS.YouTube.Playing = true;
          YouTubePlayList();
        }
        debug();
      },
      yut_stop: function yut_stop() {
        if (CTS.ScriptInit) {
          CTS.YouTube.CurrentTrack.ID = undefined;
          CTS.YouTube.CurrentTrack.duration = undefined;
          CTS.YouTube.CurrentTrack.title = undefined;
          CTS.YouTube.CurrentTrack.thumbnail = undefined;
          clearInterval(window.YouTube.Offset);
          CTS.YouTube.Playing = false;
          window.YouTube.stopVideo();
          YouTubePlayList();
        }
        debug();
      }
    };
    var ServerOutList = {
      pvtmsg: function pvtmsg() {
        if (CTS.ScriptInit) {
          Command(arguments[0].text, true);
          var text = arguments[0].text;
          if (!CTS.Message[arguments[0].handle])
            CTS.Message[arguments[0].handle] = [];
          PushPM(arguments[0].handle, text);
        }
        debug();
      },
      msg: function msg() {
        if (CTS.ScriptInit) {
          CTS.LastMessage = new Date();
          Command(arguments[0].text, false);
        }
        debug();
      },
      ban: function ban() {
        CheckSafeList(arguments[0].handle, true);
        debug();
      },
      kick: function kick() {
        CheckSafeList(arguments[0].handle, true);
        debug();
      },
      stream_moder_close: function stream_moder_close() {
        CheckSafeList(arguments[0].handle, true);
        debug();
      }
    };
    //ADDON
    var Addon = {
      active: function active() {
        if (window.CTSAddon !== undefined) {
          if (window.CTSAddon[arguments[0]] !== undefined) {
            return true;
          }
        }
        return false;
      },
      get: function get() {
        return window.CTSAddon[arguments[0]];
      }
    };
    //XMLHttpRequest
    // YouTube Search V3 API (https://console.developers.google.com/)
    CTS.YouTube.XHR.onload = function () {
      var response = JSON.parse(CTS.YouTube.XHR.responseText);
      if (response.error) {
        Send(
          "msg",
          "⛔" +
            (response.error.errors[0].reason
              ? response.error.errors[0].reason
              : "Track could not be added!") +
            "⛔"
        );
      } else {
        if (
          response.kind == "youtube#playlistItemListResponse" &&
          response.nextPageToken === undefined &&
          response.items.length === 0
        ) {
          CTS.YouTube.ListBuilt = true;
          Send(
            "msg",
            "🎵Found " +
              CTS.YouTube.MessageQueueList.length +
              " tracks!\nThis may take a few moments to add, requests can be made shortly.🎵"
          );
          CTS.YouTube.DataReady = true;
          CTS.YouTube.Busy = false;
          YouTubeTrackAdd();
        }
        CTS.YouTube.DataReady = false;
        if (response.items[0]) {
          CTS.YouTube.Busy = true;
          if (response.items[0].id) {
            if (response.kind == "youtube#playlistItemListResponse") {
              YouTubePlayListItems(response.items);
            } else {
              CTS.YouTube.VideoID = response.items[0].id.videoId;
              CTS.YouTube.XHR.open(
                "GET",
                "https://www.googleapis.com/youtube/v3/videos?id=" +
                  CTS.YouTube.VideoID +
                  "&type=video&eventType=completed&part=contentDetails,snippet&fields=items/snippet/title,items/snippet/thumbnails/medium,items/contentDetails/duration&eventType=completed&key=" +
                  CTS.YouTube.API_KEY
              );
              CTS.YouTube.XHR.send();
            }
          } else if (response.items[0].contentDetails.duration) {
            CTS.YouTube.DataReady = true;
          }
          if (CTS.YouTube.DataReady === false) {
            CTS.YouTube.Busy = false;
            if (response.kind == "youtube#searchListResponse")
              CTS.YouTube.XHR.videoid = response.items[0].id.videoId;
            if (response.kind == "youtube#playlistItemListResponse") {
              CTS.YouTube.ListBuilt = true;
              Send(
                "msg",
                "🎵Adding " +
                  CTS.YouTube.MessageQueueList.length +
                  " track(s) to queue!🎵\nEnjoy!"
              );
              CTS.YouTube.Busy = false;
            }
          } else {
            CTS.YouTube.VideoID = CTS.YouTube.XHR.videoid
              ? CTS.YouTube.XHR.videoid
              : CTS.YouTube.MessageQueueList[0].snippet.resourceId.videoId;
            if (CTS.YouTube.Playing === true) {
              MessagePopUp(
                -1,
                "Added " +
                  (response.items[0] === undefined
                    ? response.items.snippet.title
                    : response.items[0].snippet.title),
                true,
                true
              );
              Send("yut_playlist_add", [
                CTS.YouTube.VideoID,
                YouTubeTimeConvert(response.items[0].contentDetails.duration),
                response.items[0] === undefined
                  ? response.items.snippet.title
                  : response.items[0].snippet.title,
                response.items[0] === undefined
                  ? response.items.snippet.thumbnails.medium.url
                  : response.items[0].snippet.thumbnails.medium.url
              ]);
              CTS.YouTube.Busy = false;
            } else {
              if (response.items[0].snippet.title !== undefined) {
                Send("yut_play", [
                  CTS.YouTube.VideoID,
                  YouTubeTimeConvert(response.items[0].contentDetails.duration),
                  response.items[0].snippet.title,
                  response.items[0].snippet.thumbnails.medium.url,
                  0
                ]);
                Send("yut_playlist_remove", [
                  CTS.YouTube.XHR.videoid,
                  YouTubeTimeConvert(response.items[0].contentDetails.duration),
                  response.items[0].snippet.title,
                  response.items[0].snippet.thumbnails.medium.url
                ]);
                CTS.YouTube.Playing = true;
              }
              CTS.YouTube.Busy = false;
            }
          }
        }
        if (
          CTS.YouTube.SearchReturn === true ||
          (CTS.YouTube.SearchReturn === false &&
            CTS.YouTube.VideoReturn === true &&
            CTS.YouTube.XHR.type === true)
        ) {
          var title = "";
          CTS.YouTube.SearchReturn = false;
          CTS.YouTube.VideoReturn = false;
          if (response.items[0] !== undefined) {
            if (response.items[0].length > 0)
              title = response.items[0].snippet.title;
          }
          if (response.items !== undefined) {
            if (response.items.length > 0)
              title = response.items[0].snippet.title;
          }
          Send(
            "msg",
            title === ""
              ? "⛔Track could not be added!⛔"
              : "🎵Added " + DecodeTXT(title) + " to queue!🎵"
          );
        }
        if (CTS.YouTube.MessageQueueList.length > 0) YouTubeTrackAdd();
      }
    };
    //Chuck Norris Jokes API (https://api.chucknorris.io/)
    CTS.Chuck.XHR.onload = function () {
      var resp = JSON.parse(CTS.Chuck.XHR.responseText),
        msg = "[CHUCK NORRIS]\n" + resp.value;
      if (resp !== null) Send("msg", msg.substr(0, 499));
    };
    //URB API (https://api.Urb.com/)
    CTS.Urb.XHR.onload = function () {
      var resp = JSON.parse(CTS.Urb.XHR.responseText),
        msg =
          "[URBAN DICTIONARY]\n" +
          (resp.list[0] !== undefined
            ? resp.list[0].word + "\n" + resp.list[0].definition
            : "Nothing was found!");
      if (resp !== null) Send("msg", msg.substr(0, 499));
    };
    //ICanHazDadJoke's API (https://icanhazdadjoke.com/)
    CTS.Dad.XHR.onload = function () {
      var resp = JSON.parse(CTS.Dad.XHR.responseText),
        msg = "[DAD JOKE]\n" + resp.joke;
      if (resp !== null) Send("msg", msg.substr(0, 499));
    };
    //AdviceSlip API (https://api.adviceslip.com/advice)
    CTS.Advice.XHR.onload = function () {
      var resp = JSON.parse(CTS.Advice.XHR.responseText),
        msg = "[ADVICE]\n" + resp.slip.advice;
      if (resp !== null) Send("msg", msg.substr(0, 499));
    };
    // https://opentdb.com/api.php?amount=10
    CTS.Game.Trivia.XHR.onload = function () {
      var resp = JSON.parse(CTS.Game.Trivia.XHR.responseText);
      if (resp.response_code == 0) {
        CTS.Game.Trivia.QuestionList = resp.results;
        Trivia.AskQuestion();
      }
    };
    //GAME LIST FUNCTION
    var Trivia = {
      init: function init() {
        if (CTS.Me.handle == CTS.Host && CTS.CanHostTriviaGames) {
          // CHANGE BACK TO HOST NEEDED!!!!
          this.Reset();
          CTS.Game.Trivia.Started = true;
          this.GetQuestion();
        }
      },
      GetQuestion: function GetQuestion() {
        CTS.Game.Trivia.XHR.open(
          "GET",
          "https://opentdb.com/api.php?amount=50&difficulty=hard&type=multiple"
        );
        CTS.Game.Trivia.XHR.send();
      },
      AskQuestion: function AskQuestion() {
        clearTimeout(CTS.Game.Trivia.Timer);
        CTS.Game.Trivia.AttemptList = [];
        CTS.Game.Trivia.Attempts = 0;
        if (CTS.Game.Trivia.Started) {
          if (CTS.Game.Trivia.QuestionList.length > 0) {
            var RandSlot = Rand(0, 3),
              msg,
              incorrect = 0;
            CTS.Game.Trivia.WaitCount++;
            CTS.Game.Trivia.Correct = CTS.Game.Trivia.ANum[RandSlot];
            CTS.Game.Trivia.Worth =
              CTS.Game.Trivia.QuestionList[0].difficulty === "easy"
                ? Rand(10, 20)
                : CTS.Game.Trivia.QuestionList[0].difficulty === "medium"
                ? Rand(30, 50)
                : Rand(70, 100);
            CTS.Game.Trivia.Waiting = false;
            msg =
              "[TRIVIA]\n" +
              CTS.Game.Trivia.QuestionList[0].question +
              "\n\nWorth:" +
              CTS.Game.Trivia.Worth +
              "IQ points!\n-------------";
            for (var i = 0; i < 4; i++) {
              msg += "\n\n" + CTS.Game.Trivia.ANum[i] + ") ";
              if (i == RandSlot) {
                msg += CTS.Game.Trivia.QuestionList[0].correct_answer;
              } else {
                msg +=
                  CTS.Game.Trivia.QuestionList[0].incorrect_answers[incorrect];
                incorrect++;
              }
            }
            CTS.Game.Trivia.QuestionList.shift();
            Send("msg", DecodeTXT(msg));
            CTS.Game.Trivia.Timer = setTimeout(
              function (g) {
                Send(
                  "msg",
                  "[TRIVIA]\nToo hard eh? Next question coming up in sixty seconds!\nThe answer however was: " +
                    CTS.Game.Trivia.Correct
                );
                g.Wait();
              },
              90000,
              this
            );
          } else {
            CTS.Game.Trivia.WaitCount = 0;
            this.GetQuestion();
          }
          if (CTS.Game.Trivia.WaitCount >= 4) {
            CTS.Game.Trivia.WaitCount = 0;
            this.Ranking();
          }
        }
      },
      Wait: function Wait() {
        CTS.Game.Trivia.Correct = "";
        CTS.Game.Trivia.Waiting = true;
        clearTimeout(CTS.Game.Trivia.Timer);
        setTimeout(function () {
          if (CTS.Game.Trivia.Started) Trivia.AskQuestion();
        }, 60000);
      },
      Ranking: function Ranking() {
        Send(
          "msg",
          "[TRIVIA RANK]\n" +
            CTS.Game.Trivia.HighScore[0] +
            " has set the record of " +
            CTS.Game.Trivia.HighScore[1] +
            " IQ Points!"
        );
      },
      Reset: function Reset() {
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
var Fish = {
  Init: function Init() {
    if (CTS.Me.handle == CTS.Host && CTS.CanHostFishGames === true) {
      Send(
        "msg",
        "[🎣 FISHING BOAT] 🐟\n" +
"!fish 🐠 at any time and upgrade your way up! 🚀\n\n" +
"!gameview 👁️ to show/hide games.\n\n" +
"Remember there's a five-second delay for all commands ⏳, don't spam! 🚫\n" +
"For commands type !fishhelp 📜"
      );
      this.SetWeather();
      CTS.Game.Fish.StartTimeout = setTimeout(
        function (g) {
          g.StartRound();
        },
        5000,
        this
      );
    }
  },
  AddPlayer: function AddPlayer() {
    if (
      !this.GetPlayer(arguments[0], false, false) &&
      CTS.CanHostFishGames === true
    ) {
      if (isSafeListed(arguments[1])) {
        CTS.Game.Fish.Player.push({
          Handle: arguments[0],
          Username: arguments[1],
          Nickname: arguments[2],
          LastCheck: new Date() - 5000,
          Points: 5000,
          Level: 1,
          Experience: 0,
          Achievements: [],
          Upgrades: {
            Net: 1,
            Store: 1,
            Radar: 1,
            Insurance: false
          }
        });
        Send(
          "msg",
          "[🚤 FISHING BOAT] 🎣\n"
 +
            arguments[2].substr(0, 16) +
            "...\n has jumped aboard the fishing boat! 🚤🎣\nType !fishhelp 📜 for commands if you don't already know! 🐟"
        );
        if (this.GetPlayer() == 0) this.Init();
      }
    }
  },
  GetPlayer: function GetPlayer() {
    var len = CTS.Game.Fish.Player.length;
    if (arguments[0] !== undefined) {
      for (var player = 0; player < len; player++) {
        if (CTS.Game.Fish.Player[player].Handle == arguments[0]) {
          if (arguments[2]) return CTS.Game.Fish.Player[player];
          if (arguments[1]) {
            CTS.Game.Fish.UserQuitLast = CTS.Game.Fish.Player[player].Nickname;
            CTS.Game.Fish.Player.splice(player, 1);
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
  Ranking: function Ranking() {
    var msg = "[🎣 FISHING BOAT] 🚤\nTOP 5 PLAYERS 🏆:\n"
,
      place = 0;
    for (var u = arguments[0]; u >= 0; u--) {
      place++;
      if (u < 5) {
        msg +=
          place +
          ":" +
          CTS.Game.Fish.Player[u].Nickname +
          "[$" +
          CTS.Game.Fish.Player[u].Points +
          " - Lvl " +
          CTS.Game.Fish.Player[u].Level +
          "]\n";
      }
      CTS.Game.Fish.Player[u].Upgrades.Insurance = false;
      CTS.Game.Fish.Player[u].Points += 10000;
    }
    Send("msg", msg);
  },
  Winner: function Winner() {
    CTS.Game.Fish.Player.sort(function (a, b) {
      return a.Points - b.Points;
    });
    if (CTS.Game.Fish.HighScore[1] < CTS.Game.Fish.Player[0].Points) {
      Send(
        "msg",
        "[FISHING HIGH SCORE]\nNEW HIGH SCORE,\nKeep going " +
          CTS.Game.Fish.Player[0].Nickname +
          "!"
      );
      CTS.Game.Fish.HighScore = [
        CTS.Game.Fish.Player[0].Nickname,
        CTS.Game.Fish.Player[0].Points
      ];
      Save("FishHighScore", JSON.stringify(CTS.Game.Fish.HighScore));
    }
    var len = CTS.Game.Fish.Player.length - 1;
    Send(
      "msg",
      "[🚤 FISHING BOAT HIGH SCORE 🚤]\n🏆 HIGH SCORE 🏆:\n"
 +
        CTS.Game.Fish.HighScore[0] +
        " : $" +
        CTS.Game.Fish.HighScore[1] +
        "\n\n🏅 ROUND WINNER 🏅:\n" +
        CTS.Game.Fish.Player[len].Nickname +
        " : $" +
        CTS.Game.Fish.Player[len].Points +
        "!\n\n⏳ Next round will start in thirty seconds! 🌟"
    );
    this.Ranking(len);
    CTS.Game.Fish.RestockTimeout = setTimeout(function () {
      Fish.Reset(false, true);
    }, 30000);
  },
  PriceList: function PriceList() {
    if (arguments[1] == 0) {
      // net
      return (
        1000 *
        arguments[0].Upgrades.Net *
        arguments[0].Upgrades.Net *
        arguments[0].Upgrades.Net
      );
    } else if (arguments[1] == 1) {
      // radar
      return 1000 * arguments[0].Upgrades.Radar * 2 + 3500;
    } else if (arguments[1] == 2) {
      // shop
      return arguments[0].Upgrades.Store * arguments[0].Upgrades.Store * 25000;
    } else if (arguments[1] == 3) {
      // insurance
      return 20000;
    } else if (arguments[1] == 4) {
      // rob
      return 10000;
    } else if (arguments[1] == 5) {
      // slap
      return 50000;
    } else if (arguments[1] == 6) {
      // split (min$) / gamble
      return 1000;
    }
  },
  StartRound: function StartRound() {
    clearTimeout(CTS.Game.Fish.StartTimeout);
    if (CTS.Host === CTS.Me.handle) {
      if (this.GetPlayer() >= 0) {
        if (CTS.Game.Fish.Round < 10) {
          CTS.Game.Fish.Round++;
          var playerlen,
            fishlen = CTS.Game.Fish.TypesOfFish.length - 1,
            id,
            type,
            handle,
            eliminate = false,
            msgeliminate,
            value,
            msg = "[🎣 FISHING BOAT]\n";

          // Check for special event
          if (this.CheckSpecialEvent()) {
            msg +=
              "🎉 Special Event: 🦈 Fishing Tournament! Double points for all catches! 🎉\n\n"
;
          }
          msg += "👨🏻‍💼Current Weather: " + CTS.Game.Fish.Weather + "\n\n";
          for (var cast = 0; cast <= 2; cast++) {
            playerlen = this.GetPlayer();
            id = Rand(0, playerlen);
            type = Rand(CTS.Game.Fish.Player[id].Upgrades.Radar, fishlen);
            if (Rand(0, 100) <= Rand(10, 70) * this.GetWeatherMultiplier()) {
              var net = Rand(1, CTS.Game.Fish.Player[id].Upgrades.Net);
              value =
                net *
                CTS.Game.Fish.TypesOfFish[type][1] *
                40 *
                CTS.Game.Fish.Player[id].Upgrades.Store;

              // Apply special event multiplier
              if (CTS.Game.Fish.SpecialEvent) {
                value *= 2;
              }
              if (CTS.Game.Fish.TypesOfFish[type][2] === true) {
                CTS.Game.Fish.Player[id].Points += value;
                msg +=
                  CTS.Game.Fish.Player[id].Nickname.substr(0, 16) +
                  "...[$" +
                  CTS.Game.Fish.Player[id].Points +
                  "]:\n✓ " +
                  net +
                  " x " +
                  CTS.Game.Fish.TypesOfFish[type][0] +
                  " +$" +
                  value +
                  "\n";

                // Add experience and check for level up
                this.AddExperience(CTS.Game.Fish.Player[id], value);

                // Check for rare fish
                if (this.IsRareFish(type)) {
                  msg += "🌟 🎣 Rare fish caught! Bonus points awarded! 🎣 🌟\n";
                  CTS.Game.Fish.Player[id].Points += 5000;
                }

                // Check for achievements
                this.CheckAchievements(CTS.Game.Fish.Player[id], type, value);
              } else {
                if (!CTS.Game.Fish.Player[id].Upgrades.Insurance) {
                  CTS.Game.Fish.Player[id].Points -= value;
                  msg +=
                    CTS.Game.Fish.Player[id].Nickname.substr(0, 16) +
                    "..." +
                    (CTS.Game.Fish.Player[id].Points < 0
                      ? "[broke]"
                      : "[$" + CTS.Game.Fish.Player[id].Points + "]") +
                    ":\nX " +
                    CTS.Game.Fish.TypesOfFish[type][0] +
                    " -$" +
                    value +
                    "\n";
                } else {
                  msg +=
                    CTS.Game.Fish.Player[id].Nickname.substr(0, 16) +
                    "...[$" +
                    CTS.Game.Fish.Player[id].Points +
                    "]:\n✓ " +
                    net +
                    " x " +
                    CTS.Game.Fish.TypesOfFish[type][0] +
                    " -$0\n";
                }
              }
            } else {
              cast--;
            }
            if (this.GetPlayer() == -1) break;
            if (CTS.Game.Fish.Player[id].Points < 0) {
              eliminate = true;
              handle = CTS.Game.Fish.Player[id].Handle;
              msgeliminate =
                "[🎣 FISHING BOAT]\n" +
                (CTS.Game.Fish.Player[id].Nickname.substr(0, 16) +
                  "...\n 🌊 Can walk the plank for costing me my moneys! 💸");
              CTS.Game.Fish.Player.splice(id, 1);
              break;
            }
          }
          if (msg !== "[🎣 FISHING BOAT]\n") Send("msg", msg);
          if (eliminate) {
            eliminate = false;
            Send("msg", msgeliminate);
          }
          CTS.Game.Fish.ReCastTimeout = setTimeout(
            function (g) {
              g.StartRound();
            },
            Rand(90000, 120000),
            this
          );
        } else {
          this.Winner();
        }
      } else {
        //RESTART
        Fish.Stop();
      }
    }
  },
  Reset: function Reset() {
    var get = this.GetPlayer();
    if (get !== undefined) {
      if ((get >= 0 && !CTS.Game.NoReset) || arguments[1] !== undefined) {
        CTS.Game.Fish.Round = 0;
        clearTimeout(CTS.Game.Fish.StartTimeout);
        clearTimeout(CTS.Game.Fish.RestockTimeout);
        clearTimeout(CTS.Game.Fish.ReCastTimeout);
        clearTimeout(CTS.Game.Fish.NotEnoughTimeout);
        if (!arguments[0]) {
          this.Init();
        } else {
          if (CTS.Game.Fish.Player.length > 0)
            Send(
              "msg",
              "[🎣FISHING BOAT]\n💥 Welp... Boat sank! 🚤 I'm not refunding anyone! 💸"
            );
          CTS.Game.Fish.Player = [];
        }
      }
    }
  },
  Stop: function Stop() {
    CTS.Game.NoReset = false;
    this.Reset(true, true);
  },
  SetWeather: function SetWeather() {
    var weathers = ["Sunny ☀️", "Cloudy ☁️", "Rainy 🌧", "Stormy ⛈"];
    CTS.Game.Fish.Weather =
      weathers[Math.floor(Math.random() * weathers.length)];
    Send(
      "msg",
      "[🎣FISHING BOAT]\nThe weather has changed to " +
        CTS.Game.Fish.Weather +
        "!"
    );
  },
  GetWeatherMultiplier: function GetWeatherMultiplier() {
    switch (CTS.Game.Fish.Weather) {
      case "Sunny ☀️":
        return 1.2;
      case "Cloudy ☁️":
        return 1;
      case "Rainy 🌧":
        return 0.8;
      case "Stormy ⛈":
        return 0.5;
      default:
        return 1;
    }
  },
  CheckSpecialEvent: function CheckSpecialEvent() {
    if (Math.random() < 0.1) {
      // 10% chance of special event
      CTS.Game.Fish.SpecialEvent = true;
      return true;
    }
    CTS.Game.Fish.SpecialEvent = false;
    return false;
  },
  AddExperience: function AddExperience(player, value) {
    player.Experience += Math.floor(value / 100);
    if (player.Experience >= player.Level * 1000) {
      player.Level++;
      player.Experience = 0;
      Send(
        "msg",
        "[🎣FISHING BOAT]\n🎉 " +
          player.Nickname +
          " has reached level " +
          player.Level +
          "! 🎉"
      );
    }
  },
  IsRareFish: function IsRareFish(type) {
    return Math.random() < 0.05; // 5% chance of rare fish
  },
  CheckAchievements: function CheckAchievements(player, type, value) {
    if (!player.Achievements.includes("FirstCatch") && value > 0) {
      player.Achievements.push("FirstCatch");
      Send(
        "msg",
        "[FISHING BOAT]\n🏆 " +
          player.Nickname +
          " has earned the 'First Catch' achievement! 🏆"
      );
    }
    if (!player.Achievements.includes("BigSpender") && player.Points > 100000) {
      player.Achievements.push("BigSpender");
      Send(
        "msg",
        "[FISHING BOAT]\n🏆 " +
          player.Nickname +
          " has earned the 'Big Spender' achievement! 🏆"
      );
    }
    if (!player.Achievements.includes("MasterFisher") && player.Level >= 10) {
      player.Achievements.push("MasterFisher");
      Send(
        "msg",
        "[FISHING BOAT]\n🏆 " +
          player.Nickname +
          " has earned the 'Master Fisher' achievement! 🏆"
      );
    }
  }
};
var FishList = {
  fish: function fish() {
    Fish.AddPlayer(
      arguments[1].handle,
      arguments[1].username,
      arguments[1].nick
    );
  },
  fishbank: function fishbank() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0]))
      Send(
        "msg",
        "[🎣FISHING BOAT]\n" +
          arguments[0].Nickname.substr(0, 16) +
          ", you have $" +
          arguments[0].Points +
          " and you're level " +
          arguments[0].Level +
          "."
      );
  },
  fishrob: function fishrob() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      var CanEliminate = Fish.GetPlayer(
        UsernameToHandle(arguments[1].toUpperCase()),
        false,
        true
      );
      FishTransfer(
        arguments[0],
        CanEliminate,
        Fish.PriceList(arguments[0], 4),
        Rand(5000, 20000),
        true
      );
    }
  },
  fishgamble: function fishgamble() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      if (FishTransaction(arguments[0], Fish.PriceList(arguments[0], 6))) {
        var winnings;
        if (Rand(1, 10) === 7) {
          // 10% chance
          winnings = Rand(1000, 25000);
          arguments[0].Points += winnings;
          Send(
            "msg",
            "[🎣FISHING BOAT]\n" +
              arguments[0].Nickname +
              "🎉 You've won $" +
              winnings
          );
        } else {
          if (Rand(1, 7) === 4) {
            // 15%
            winnings = Rand(1000, 5000);
            arguments[0].Points += winnings;
            Send(
              "msg",
              "[🎣FISHING BOAT]\n" +
                arguments[0].Nickname +
                "🎉 You've won $" +
                winnings
            );
          } else {
            Send(
              "msg",
              "[🎣FISHING BOAT]\n" +
                arguments[0].Nickname +
                "😞 Tough luck, you lost $1000! 💸"
            );
          }
        }
      }
    }
  },
  fishslap: function fishslap() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      var user = UsernameToUser(arguments[1].toUpperCase());
      if (user !== -1) {
        if (
          CTS.UserList[user].broadcasting &&
          CTS.UserList[user].handle !== CTS.Me.handle &&
          CTS.UserList[user].username !== "GUEST"
        ) {
          if (CTS.Me.owner || !CTS.UserList[user].mod) {
            if (
              FishTransaction(arguments[0], Fish.PriceList(arguments[0], 5))
            ) {
              Send("stream_moder_close", CTS.UserList[user].handle);
              Send(
                "msg",
                arguments[0].Nickname +
                  " has paid to close your camera " +
                  CTS.UserList[user].nick +
                  "!"
              );
            }
          } else {
            Send("msg", "Cannot close moderator!");
          }
        } else {
          Send("msg", "Cannot close user!");
        }
      }
    }
  },
  fishsplit: function fishsplit() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      var CanEliminate = Fish.GetPlayer(
        UsernameToHandle(arguments[1].toUpperCase()),
        false,
        true
      );
      FishTransfer(
        arguments[0],
        CanEliminate,
        Fish.PriceList(arguments[0], 6),
        Math.round(arguments[0].Points / 2),
        false
      );
    }
  },
  fishupgrade: function fishupgrade() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0]))
      FishUpgradeStatus(arguments[0], 0);
  },
  fishhelp: function fishhelp() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0]))
      FishUpgradeStatus(arguments[0], 6);
  },
  fishupgradenet: function fishupgradenet() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      if (arguments[0].Upgrades.Net >= 10) {
        Send("msg", arguments[0].Nickname + ", you own all upgrades. 🎉🚀");
      } else {
        if (FishTransaction(arguments[0], Fish.PriceList(arguments[0], 0))) {
          arguments[0].Upgrades.Net += 1;
          FishUpgradeStatus(arguments[0], 1);
        }
      }
    }
  },
  fishupgradeshop: function fishupgradeshop() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      if (arguments[0].Upgrades.Store >= 6) {
        Send("msg", arguments[0].Nickname + ", you own them all already! 🎉");
      } else {
        if (FishTransaction(arguments[0], Fish.PriceList(arguments[0], 2))) {
          arguments[0].Upgrades.Store += 1;
          FishUpgradeStatus(arguments[0], 4);
        }
      }
    }
  },
  fishupgraderadar: function fishupgraderadar() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      if (arguments[0].Upgrades.Radar >= 20) {
        Send("msg", arguments[0].Nickname + ", you own all upgrades. 🎉🚀");
      } else {
        if (FishTransaction(arguments[0], Fish.PriceList(arguments[0], 1))) {
          arguments[0].Upgrades.Radar += 5;
          FishUpgradeStatus(arguments[0], 2);
        }
      }
    }
  },
  fishupgradeinsurance: function fishupgradeinsurance() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      if (arguments[0].Upgrades.Insurance === true) {
        Send("msg", arguments[0].Nickname + ", you already have insurance! 🛡️");
      } else {
        if (FishTransaction(arguments[0], Fish.PriceList(arguments[0], 3))) {
          arguments[0].Upgrades.Insurance = true;
          FishUpgradeStatus(arguments[0], 3);
        }
      }
    }
  },
  fishweather: function fishweather() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      Send("msg", "[🎣FISHING BOAT]\nCurrent weather: " + CTS.Game.Fish.Weather);
    }
  },
  fishachievements: function fishachievements() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      var achievementsList = arguments[0].Achievements.join(", ");
      Send(
        "msg",
        "[🎣FISHING BOAT]\n" +
          arguments[0].Nickname +
          "'s Achievements: " +
          (achievementsList.length > 0 ? achievementsList : "None yet!🙈")
      );
    }
  },
  fishlevel: function fishlevel() {
    if (arguments[0] !== -1 && FishTimerCheck(arguments[0])) {
      Send(
        "msg",
        "[🎣FISHING BOAT]\n" +
          arguments[0].Nickname +
          " is level " +
          arguments[0].Level +
          " with " +
          arguments[0].Experience +
          " experience points."
      );
    }
  }
};

    //MISC FUNCTION
    function SetLocalValues() {
      if (CTS.StorageSupport) {
        //CTS SETTINGS
        CTS.Game.Trivia.PlayerList = JSON.parse(
          Load("TriviaPlayerList", JSON.stringify({}))
        );
        CTS.Game.Trivia.HighScore = JSON.parse(
          Load("TriviaHighScore", JSON.stringify(["Bort", 1]))
        );
        CTS.Game.Fish.HighScore = JSON.parse(
          Load("FishHighScore", JSON.stringify(["Bort", 13337]))
        );
        CTS.PublicCommandToggle = JSON.parse(
          Load("PublicCommandToggle", JSON.stringify(true))
        );
        CTS.OGStyle.SavedHeight = JSON.parse(
          Load("OGStyleHeight", JSON.stringify(3))
        );
        CTS.GreenRoomIgnoreList = JSON.parse(
          Load("GreenRoomIgnoreList", JSON.stringify([]))
        );
        CTS.CameraBorderToggle = JSON.parse(
          Load("CameraBorderToggle", JSON.stringify(true))
        );
        CTS.OGStyle.SavedWidth = JSON.parse(
          Load("OGStyleWidth", JSON.stringify(1))
        );
        CTS.NotificationToggle = JSON.parse(
          Load("NotificationToggle", JSON.stringify(0))
        );
        CTS.ChatStyleCounter = JSON.parse(
          Load("ChatStyle", JSON.stringify(14))
        );
        CTS.SoundMeterToggle = JSON.parse(
          Load("SoundMeterToggle", JSON.stringify(true))
        );
        CTS.HiddenCameraList = JSON.parse(
          Load("HiddenCameraList", JSON.stringify([]))
        );
        CTS.KickKeywordList = JSON.parse(
          Load("KickKeywordList", JSON.stringify([]))
        );
        CTS.PerformanceMode = JSON.parse(
          Load("PerformanceMode", JSON.stringify(false))
        );
        CTS.TimeStampToggle = JSON.parse(
          Load("TimeStampToggle", JSON.stringify(true))
        );
        CTS.YouTube.API_KEY = Load(
          "YouTubeAPI",
          "AIzaSyAf1XXorjOLdjS2j5PGi3SLCGl7LhyxQXs"
        );
        CTS.GreenRoomToggle = JSON.parse(
          Load("GreenRoomToggle", JSON.stringify(true))
        );
        CTS.BanKeywordList = JSON.parse(
          Load("BanKeywordList", JSON.stringify([]))
        );
        CTS.FavoritedRooms = JSON.parse(
          Load(
            "FavoritedRooms",
            JSON.stringify(["TheBodega", null, null, null, null])
          )
        );
        CTS.MainBackground = Load(
          "MainBackground",
          "url(https://i.imgur.com/aS5RCaX.jpg) rgb(0, 0, 0) no-repeat"
        );
        CTS.GreenRoomList = JSON.parse(
          Load("GreenRoomList", JSON.stringify([]))
        );
        CTS.HighlightList = JSON.parse(
          Load("HighlightList", JSON.stringify([]))
        );
        CTS.CanHostTriviaGames = JSON.parse(
          Load("CanHostTriviaGames", JSON.stringify(false))
        );
        CTS.CanHostFishGames = JSON.parse(
          Load("CanHostFishGames", JSON.stringify(false))
        );
        CTS.ReminderList = JSON.parse(Load("ReminderList", JSON.stringify([])));
        CTS.UserKickList = JSON.parse(Load("UserKickList", JSON.stringify([])));
        CTS.NickKickList = JSON.parse(Load("NickKickList", JSON.stringify([])));
        CTS.UserBanList = JSON.parse(Load("UserBanList", JSON.stringify([])));
        CTS.NickBanList = JSON.parse(Load("NickBanList", JSON.stringify([])));
        CTS.MentionList = JSON.parse(Load("MentionList", JSON.stringify([])));
        CTS.CanSeeGames = JSON.parse(Load("CanSeeGames", JSON.stringify(true)));
        CTS.ThemeChange = JSON.parse(Load("ThemeChange", JSON.stringify(true)));
        CTS.BotModList = JSON.parse(Load("BotModList", JSON.stringify([])));
        CTS.IgnoreList = JSON.parse(Load("IgnoreList", JSON.stringify([])));
        CTS.GreetList = JSON.parse(Load("GreetList", JSON.stringify([])));
        CTS.BotOPList = JSON.parse(Load("BotOPList", JSON.stringify(["-ALL"])));
        CTS.GreetMode = JSON.parse(Load("GreetMode", JSON.stringify(true)));
        CTS.FontSize = JSON.parse(Load("FontSize", JSON.stringify(20)));
        CTS.SafeList = JSON.parse(Load("AKB", JSON.stringify([])));
        CTS.Featured = JSON.parse(Load("Featured", JSON.stringify(false)));
        CTS.Reminder = JSON.parse(Load("Reminder", JSON.stringify(true)));
        CTS.ChatType = JSON.parse(Load("ChatType", JSON.stringify(true)));
        CTS.TTSList = JSON.parse(Load("TTSList", JSON.stringify([])));
        CTS.UserYT = JSON.parse(Load("UserYT", JSON.stringify(true)));
        CTS.Popups = JSON.parse(Load("Popups", JSON.stringify(true)));
        CTS.Avatar = JSON.parse(Load("Avatar", JSON.stringify(true)));
        CTS.Imgur = JSON.parse(Load("Imgur", JSON.stringify(true)));
        CTS.FPS = JSON.parse(Load("FPS", JSON.stringify(30)));
        CTS.FirstLoad = JSON.parse(Load("FirstLoad", JSON.stringify(true)));
        CTS.Hide420 = JSON.parse(Load("Hide420", JSON.stringify(false)));
        CTS.HideCaps = JSON.parse(Load("HideCaps", JSON.stringify(false)));
        CTS.DisableGifts = JSON.parse(
          Load("DisableGifts", JSON.stringify(false))
        );
        CTS.ReCam = JSON.parse(Load("ReCam", JSON.stringify(false)));
        CTS.allowReCamAllBrowsers = JSON.parse(
          Load("allowReCamAllBrowsers", JSON.stringify(false))
        );
        CTS.Bot = JSON.parse(Load("Bot", JSON.stringify(true)));
        CTS.MediaStreamFilter = Load("MediaStreamFilter", "No Filter");
        try {
          CTS.HideCapsThreshold = JSON.parse(
            Load("HideCapsThreshold", JSON.stringify(6))
          );
        } catch (e) {
          CTS.HideCapsThreshold = 6;
          Save("HideCapsThreshold", CTS.HideCapsThreshold);
        }
      }
    }
    function debug() {
      if (window.DebugClear === false) {
        if (arguments[0] !== undefined) {
          var msg = "CTS::" + arguments[0];
          if (arguments[1]) msg = msg + "\n" + JSON.stringify(arguments[1]);
          console.log(msg);
        }
      } else {
        console.clear();
        console.log(
          "\nBodega Bot by Bort\nhttps://greasyfork.org/en/users/1024912-bort-mack\n        "
        );
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
    }
    function Remove() {
      return arguments[1] !== undefined
        ? arguments[0]
            .querySelector(arguments[1])
            .parentNode.removeChild(arguments[0].querySelector(arguments[1]))
        : arguments[0].parentNode.removeChild(arguments[0]);
    }
    onStart();
    var errorSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="640" viewBox="0 0 640 640"><metadata><?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c142 79.160924, 2017/07/13-01:06:39        "><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about=""/></rdf:RDF></x:xmpmeta><?xpacket end="w"?></metadata><defs><style>.cls-1 {fill: #226122;filter: url(#filter);}.cls-2, .cls-4 {fill: #fff;}.cls-3 {fill: #0ec00e;filter: url(#filter-2);}.cls-4 {fill-rule: evenodd;}</style><filter id="filter" x="6" y="6" width="628" height="628" filterUnits="userSpaceOnUse"><feFlood result="flood" flood-color="#b43a3a"/><feComposite result="composite" operator="in" in2="SourceGraphic"/><feBlend result="blend" in2="SourceGraphic"/></filter><filter id="filter-2" x="35" y="39" width="562" height="562" filterUnits="userSpaceOnUse"><feFlood result="flood" flood-color="#f55"/><feComposite result="composite" operator="in" in2="SourceGraphic"/><feBlend result="blend" in2="SourceGraphic"/></filter></defs><circle class="cls-1" cx="320" cy="320" r="314"/><circle id="Ellipse_1_Kopie" data-name="Ellipse 1 Kopie" class="cls-2" cx="317" cy="320" r="290"/><circle id="Ellipse_1_Kopie_2" data-name="Ellipse 1 Kopie 2" class="cls-3" cx="316" cy="320" r="281"/><path id="Rechteck_1" data-name="Rechteck 1" class="cls-4" d="M397.875,191.993l50.132,50.132-205.3,205.3L192.573,397.3Z"/><path id="Rechteck_1_Kopie" data-name="Rechteck 1 Kopie" class="cls-4" d="M447.743,397.813l-50.194,50.194L191.993,242.451l50.194-50.194Z"/></svg>';
  })();
})();
