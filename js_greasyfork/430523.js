// ==UserScript==
// @name         Darly Asthetic Extensions For Gota.io V1.0 💜
// @version      1.1
// @description  Official Gota.io Darly
// @author       Darly
// @match        https://gota.io/web/*
// @grant        GM_addStyle
// @contributor  APX
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/802364
// @downloadURL https://update.greasyfork.org/scripts/430523/Darly%20Asthetic%20Extensions%20For%20Gotaio%20V10%20%F0%9F%92%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/430523/Darly%20Asthetic%20Extensions%20For%20Gotaio%20V10%20%F0%9F%92%9C.meta.js
// ==/UserScript==


addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Karla);');

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
    var argumentz = arguments;
    if(this.canvas.id == 'leaderboard-canvas'){
    this.font = 'bold 15px Karla';
    }
    if(this.canvas.id == 'minimap-canvas'){
    this.font = 'bold 15px Karla';
    }
    if(this.canvas.id == 'party-canvas'){
    this.font = 'bold 15px Karla';
    }
    fillTextz.apply(this, arguments);
};

GM_addStyle('*{font-family: Karla;}');
GM_addStyle('.coordinates {font-family: Karla;}');
GM_addStyle('.gota-btn {font-family: Karla !important;}');
GM_addStyle('#leaderboard-panel {font-size: 22px;}');
GM_addStyle('.main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('.main-panel {border-radius: 5px}');
GM_addStyle('.main-panel {background: #070707}');
GM_addStyle('.main-version {width: 290px; font-size: 11px;}');
GM_addStyle('#main {width: 1075px; background-color: transparent; border: none;}');
GM_addStyle('#main-content {height: 490px; margin-top: 80px; padding: 0 15px 0 15px;}');
GM_addStyle('#main-left {margin-top: 80px; margin-right: 1px; margin-left: -16px; height: 490px; width: 371px;}');
GM_addStyle('#main-right {height: 490px; width: 345px; margin-top: 80px;}');
GM_addStyle('#main-account {margin: 10px 10px;}');
GM_addStyle('#main-social {background: none; border: none;}');
GM_addStyle('.main-bottom {margin-bottom: 12px;}');
GM_addStyle('.main-bottom-stats {border-radius: 5px}');
GM_addStyle('.main-input-btns {margin-top: 12px;}');
GM_addStyle('.gota-btn {border-radius: 15px;}');
GM_addStyle('.gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('.gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');
GM_addStyle('#popup-party {border-radius: 5px; border-width: 2px;}');
GM_addStyle('#popup-login {border-radius: 5px; border-width: 2px;}');
GM_addStyle('.login-input {border-radius: 0px}');
GM_addStyle('#chat-input {border-radius: 0px}');
GM_addStyle('#chat-container {border-radius: 5px 5px 0px 0px}');
GM_addStyle('#leaderboard-panel, #score-panel, #minimap-panel, #party-panel {border-radius: 5px; border-width: 2px; box-shadow: none;}');
GM_addStyle('#chat-input {font-weight: bold}');
GM_addStyle('#name-box {font-weight: bold}');
GM_addStyle('.stext {margin-top: 2px; margin-bottom: 2px;}');
GM_addStyle('.server-row:hover {background: rgb(119, 119, 119);}');
GM_addStyle('.server-row {transition: all 0.3s}');
GM_addStyle('.server-container, .options-container {width: 90%;}');
GM_addStyle('.server-selected {background-color: rgba(0, 255, 255, 0.8) !important;}');
GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('.scrimmage-select {border: 2px solid black; border-radius: 10px; padding: 4px; font-weight: bold; margin-top: 3px;}');
GM_addStyle('.xp-meter > span {background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet, pink);}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 5px;}');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');
GM_addStyle('#name-box {display: inline-flex;}');
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: #ff0000; color: white; border-radius: 5px; padding: 4px; transition: background 0.3s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: #00f000; color: #014401; padding: 4px; padding-right: 9px;}');
GM_addStyle('input[type="checkbox" i]:checked:after {content: "ON";}');
GM_addStyle('input[type="checkbox" i]:not(:checked):before {content: "OFF"}');
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 10px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #5f5f5f; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 10px;}');


(function () {
    'use strict';
    
    const scriptPrefix = "rplt-";
    const scriptTag = "RPLT";
    let runScript = 1;
    runScript = getOptionState("enable-"+ scriptPrefix +"script", runScript);
    if (runScript) {
        let enableConsoleMessages = 1; // default 0; set to 1 to show console messages.
        enableConsoleMessages = getOptionState("log-"+ scriptPrefix +"msg", enableConsoleMessages);
        let enabledMessages =
           
            "TT-MA|"+
            "TXT-MA|"+
            "DLT1|"+ 
            "DLT2|"+ 
            "FR1|"+

            "RUNT|"+ 
            "EXEC|"+
            "\\bST\\b|"+
            "GEN$|"+
            "^1";
        let logAll = 0; // if 1, logs all titles from blocks.
        logAll = getOptionState("log-"+ scriptPrefix +"all", logAll);
        if (logAll) {
            enabledMessages = enabledMessages.concat("|title");
        }
        const enabledMessagesRegex = new RegExp(enabledMessages); // used in consolelog().

        consolelog("#### ("+ scriptTag +") text replace script began. ####", "EXEC");
        let replaceRules = [

            [/Servers/i, "📃 𝑺𝒆𝒓𝒗𝒆𝒓𝒔 📃"],
            [/Europe/i, "🌍 𝙴𝚞𝚛𝚘𝚙𝚎"],
            [/North America/i, "🌎 𝙽-𝙰𝚖𝚎𝚛𝚒𝚌𝚊"],
            [/Asia Pacific/i, "🌏 𝙰𝚜𝚒𝚊"],
            [/Privacy Options/i, "🔐 𝙿𝚛𝚒𝚟𝚊𝚌𝚢 𝙾𝚙𝚝𝚒𝚘𝚗𝚜 🔐"],
            [/Performance Options/i, "🔋 𝙿𝚎𝚛𝚏𝚘𝚛𝚖𝚊𝚗𝚌𝚎 𝙾𝚙𝚝𝚒𝚘𝚗𝚜 🔋"],
            [/Render Options/i, "📊 𝚁𝚎𝚗𝚍𝚎𝚛 𝙾𝚙𝚝𝚒𝚘𝚗𝚜 📊"],
            [/General Options/i, "🔩 𝙶𝚎𝚗𝚎𝚛𝚊𝚕 𝙾𝚙𝚝𝚒𝚘𝚗𝚜 🔩"],
            [/UI Options/i, "📑 𝚄𝙸 𝙾𝚙𝚝𝚒𝚘𝚗𝚜📑"],
            [/Streamer Options/i, "🎮 𝚂𝚝𝚛𝚎𝚊𝚖𝚎𝚛 𝙾𝚙𝚝𝚒𝚘𝚗𝚜 🎮"],
            [/Options By Donut/i, "🟡 𝙳𝚘𝚗𝚞𝚝 𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 🟡"],
            [/Game Options/i, "🧬 𝙶𝚊𝚖𝚎 𝙲𝚘𝚕𝚘𝚛𝚜 🧬"],
            [/Options/i, "⚙️ 𝑶𝒑𝒕𝒊𝒐𝒏𝒔 ⚙️"],
            [/Hotkeys/i, "📌 𝑯𝒐𝒕𝒌𝒆𝒚𝒔 📌"],
            [/Theme Toggle/i, "🔗 𝚃𝚑𝚎𝚖𝚎 𝚃𝚘𝚐𝚐𝚕𝚎 🔗"],
            [/Interface Colors/i, "🧬 𝙸𝚗𝚝𝚎𝚛𝚏𝚊𝚌𝚎 𝙲𝚘𝚕𝚘𝚛𝚜 🧬"],
            [/Interface Highlights/i, "🧬 𝙸𝚗𝚝𝚎𝚛𝚏𝚊𝚌𝚎 𝙷𝚒𝚐𝚑𝚕𝚒𝚐𝚑𝚝𝚜 🧬"],
            [/UI Colors/i, "🧬 𝚄𝙸 𝙲𝚘𝚕𝚘𝚛𝚜 🧬"],
            [/Custom Assets/i, "🔧 𝙲𝚞𝚜𝚝𝚘𝚖 𝙰𝚜𝚜𝚎𝚝𝚜 🔧"],
            [/Extra/i, "🔻 𝙴𝚡𝚝𝚛𝚊 🔺"],
            [/Theme/i, "🎨 𝑻𝒉𝒆𝒎𝒆 🎨"],
            [/m 🎨 𝑻𝒉𝒆𝒎𝒆 🎨/i, "m Theme"],
            [/t 🎨 𝑻𝒉𝒆𝒎𝒆 🎨/i, "t Theme"],
            [/Cell Panel/i, "🧬 𝑪𝒆𝒍𝒍 𝑷𝒂𝒏𝒆𝒍 🧬"],
            [/Features By Donut/i, "🟡 𝑫𝒐𝒏𝒖𝒕 𝑭𝒆𝒂𝒕𝒖𝒓𝒆𝒔"],
            [/Players/i, "𝙿𝚕𝚊𝚢𝚎𝚛𝚜"],
            [/Name/i, "𝙽𝚊𝚖𝚎"],
            [/Gamemode/i, "𝙶𝚊𝚖𝚎𝚖𝚘𝚍𝚎"],
            [/Play/i, "𝑷𝒍𝒂𝒚 ⚡️"],
            [/Spectate/i, "𝑺𝒑𝒆𝒄𝒕𝒂𝒕𝒆 👀"],
            [/Stats/i, "📊 𝚂𝚝𝚊𝚝𝚜 📊"],
            [/Profile/i, "𝑷𝒓𝒐𝒇𝒊𝒍𝒆 🧑🏻"],
            [/w 𝑷𝒓𝒐𝒇𝒊𝒍𝒆 🧑🏻/i, "w profile"],
            [/Social/i, "𝑺𝒐𝒄𝒊𝒂𝒍 📱"],
            [/Shop/i, "𝑺𝒉𝒐𝒑 💲"],
            [/Logout/i, "𝑳𝒐𝒈𝒐𝒖𝒕 🔴"],
            [/Login/i, "𝑳𝒐𝒈𝒊𝒏 🟢"],
            [/MOUSE FROZEN/i, "𝙻𝚘𝚌𝚔𝚎𝚍 📍"],
            [/Reset Keybinds/i, "↪️ 𝚁𝚎𝚜𝚎𝚝"],
            [/Import/i, "𝙸𝚖𝚙𝚘𝚛𝚝 📥"],
            [/Export/i, "𝙴𝚡𝚙𝚘𝚛𝚝 📤"],
            [/Log in to gain access to exclusive features like 𝑷𝒓𝒐𝒇𝒊𝒍𝒆 🧑🏻s, clans, 📊 𝚂𝚝𝚊𝚝𝚜 📊 tracking and the 𝑺𝒉𝒐𝒑 💲!/i, "Log in to gain access to exclusive features like profiles, clans, stats tracking and the shop!"],
            [/Gota.io Account/i, "🎀 𝗚𝗼𝘁𝗮.𝗶𝗼 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 🎀"],
            [/Privacy Policy/i, ""],
            [/Client version: /i, ""],
            [/AD Privacy Settings/i, ""],
            [/Cookie Policy/i, ""],
            [/Silent 𝑳𝒐𝒈𝒊𝒏 🟢/i, "Silent Login"],
            [/ID:/i, "𝙸𝙳 : "],
            [/Score:/i, "𝚂𝚌𝚘𝚛𝚎 : "],
            [/FPS:/i, "𝙵𝙿𝚂 : "],
            [/Ping:/i, "𝙿𝚒𝚗𝚐 : "],
            [/Cells:/i, "𝙲𝚎𝚕𝚕𝚜 : "],
            [/Invite:/i, "𝑰𝒏𝒗𝒊𝒕𝒆 🔖"],
            [/kick:/i, "𝑲𝒊𝒄𝒌 ❌"],
            [/promote:/i, "𝑷𝒓𝒐𝒎𝒐𝒕𝒆 🔰"],
            [/public:/i, "𝑷𝒖𝒃𝒍𝒊𝒄 💮"],
            [/whisper:/i, "𝑾𝒉𝒊𝒔𝒑𝒆𝒓 💠"],
            [/block:/i, "𝑩𝒍𝒐𝒄𝒌 ⛔️"],
        ];

        document.querySelector("#main-rb").remove();


        addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Karla);');

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
    var argumentz = arguments;
    if(this.canvas.id == 'leaderboard-canvas'){
    this.font = 'bold 15px Karla';
    }
    if(this.canvas.id == 'minimap-canvas'){
    this.font = 'bold 15px Karla';
    }
    if(this.canvas.id == 'party-canvas'){
    this.font = 'bold 15px Karla';
    }
    fillTextz.apply(this, arguments);
};

///////////////
// Cosmetics //
///////////////

GM_addStyle('*{font-family: Karla;}');
GM_addStyle('.coordinates {font-family: Karla;}');
GM_addStyle('.gota-btn {font-family: Karla !important;}');
GM_addStyle('#leaderboard-panel {font-size: 22px;}');
GM_addStyle('.main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('.main-panel {border-radius: 5px}');
GM_addStyle('.main-panel {background: #070707}');
GM_addStyle('.main-version {width: 290px; font-size: 11px;}');
GM_addStyle('#main {width: 1075px; background-color: transparent; border: none;}');
GM_addStyle('#main-content {height: 490px; margin-top: 80px; padding: 0 15px 0 15px;}');
GM_addStyle('#main-left {margin-top: 80px; margin-right: 1px; margin-left: -16px; height: 490px; width: 371px;}');
GM_addStyle('#main-right {height: 490px; width: 345px; margin-top: 80px;}');
GM_addStyle('#main-account {margin: 10px 10px;}');
GM_addStyle('#main-social {background: none; border: none;}');
GM_addStyle('.main-bottom {margin-bottom: 12px;}');
GM_addStyle('.main-bottom-stats {border-radius: 5px}');
GM_addStyle('.main-input-btns {margin-top: 12px;}');
GM_addStyle('.gota-btn {border-radius: 15px;}');
GM_addStyle('.gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('.gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');
GM_addStyle('#popup-party {border-radius: 5px; border-width: 2px;}');
GM_addStyle('#popup-login {border-radius: 5px; border-width: 2px;}');
GM_addStyle('.login-input {border-radius: 0px}');
GM_addStyle('#chat-input {border-radius: 0px}');
GM_addStyle('#chat-container {border-radius: 5px 5px 0px 0px}');
GM_addStyle('#leaderboard-panel, #score-panel, #minimap-panel, #party-panel {border-radius: 5px; border-width: 2px; box-shadow: none;}');
GM_addStyle('#chat-input {font-weight: bold}');
GM_addStyle('#name-box {font-weight: bold}');
GM_addStyle('.stext {margin-top: 2px; margin-bottom: 2px;}');
GM_addStyle('.server-row:hover {background: rgb(119, 119, 119);}');
GM_addStyle('.server-row {transition: all 0.3s}');
GM_addStyle('.server-container, .options-container {width: 90%;}');
GM_addStyle('.server-selected {background-color: rgba(0, 255, 255, 0.8) !important;}');
GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('.scrimmage-select {border: 2px solid black; border-radius: 10px; padding: 4px; font-weight: bold; margin-top: 3px;}');
GM_addStyle('.xp-meter > span {background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet, pink);}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 5px;}');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');
GM_addStyle('#name-box {display: inline-flex;}');
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: #ff0000; color: white; border-radius: 5px; padding: 4px; transition: background 0.3s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: #00f000; color: #014401; padding: 4px; padding-right: 9px;}');
GM_addStyle('input[type="checkbox" i]:checked:after {content: "ON";}');
GM_addStyle('input[type="checkbox" i]:not(:checked):before {content: "OFF"}');
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 10px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #5f5f5f; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 10px;}');



             const enableSpecialRules = 1;
             const classWhitelist = /notif-hidden|notif-text|tag-inst|-counter/i;
             const generateRecheckButton = 1;

        let dynamicChecking = 1;dynamicChecking = getOptionState("enable-"+ scriptPrefix +"dynamic-checking", dynamicChecking);
        let logRuntimes = 1;
        let markCheckedElements = 1;
        let enableSpecialReplace = 1;
        let fullDelete = 0;
        let addTag = 1;
        let enableExecCounter = 0;
        enableExecCounter = getOptionState("enable-"+ scriptPrefix +"counter", enableExecCounter);
        let enableNotifications = 0;
        enableNotifications = getOptionState("enable-"+ scriptPrefix +"notifs", enableNotifications);
        let autohideNotifs = 0;
        let startCollapsed = 1;
        const notifsHex = "#ddd";
        const notifsOpacity = .4;
        const notifsWidth = 120;
        let notifContainerId = "notif-main-container";
        if ((enableExecCounter || enableNotifications) && !jQuery("#"+ notifContainerId).length) {

            const localStorageName = "notif start collapsed";
            if (window.localStorage.getItem(localStorageName)) {
                startCollapsed = window.localStorage.getItem(localStorageName);
                startCollapsed = (startCollapsed == "true");
            }

            const visibleClass = "notif-visible";
            const hiddenClass = "notif-hidden1";
            let startingStateClass = visibleClass;
            let otherStartingStateClass = hiddenClass;
            if (startCollapsed) {
                startingStateClass = hiddenClass;
                otherStartingStateClass = visibleClass;
            }

            // ==== create container ==============================================================|
            /*
            [ notif main container
                [notif1] - counters
                [hide] - button
                [open] - button
                [close] - button
                [clear] - button
                [notif2
                    [dlt-container]
                    [ll-container]
                    [ot-container]
                ]

            ]
            - hide: makes visible open | hides close, clear, notif2
            - open: makes visible hide, close, clear, notif2 | hides open
            - close: deletes notif main container.
            - clear: empties notif-container2
            */

            const openButtonId = "notif-open";
            const hideButtonId = "notif-hide";

            let notificationsElement =
                "<div id='"+ notifContainerId +"'>"+
                "<div id='notif-container1'></div>"+
                "<div id='"+ hideButtonId +"' class='notif-red notif-rounded-block "+ startingStateClass +"'>notif hide</div>"+
                "<div id='"+ openButtonId +"' class='notif-green notif-rounded-block "+ otherStartingStateClass +"'>notif open</div>"+
                "<div id='notif-close' class='notif-gray notif-rounded-block "+ startingStateClass +"'>close notif[]</div>"+
                "<div id='notif-clear' class='notif-orange notif-rounded-block "+ startingStateClass +"'>clear notif</div>"+
                "<div id='notif-container2' class=' "+ startingStateClass +"'>"+
                    "<div id='dlt-container'></div>"+
                    "<div id='ll-container' class='notif-hidden1'></div>"+
                    "<div id='ot-container' class='notif-hidden1'</div>"+
                "</div>"+
                "</div>";
            jQuery("body").prepend(notificationsElement);

            let textReaderElement =
                "<div id='notif-text-overlay' class='notif-text-hidden'></div>";
            jQuery("body").prepend(textReaderElement);

            jQuery('#notif-container2').on( {
                mouseenter: function () {
                    let notifText = jQuery(this).find(".notif-text").text();
                    let notifClassList = this.className;
                    if (/red/.test(notifClassList)) {
                        jQuery("#notif-text-overlay").addClass("notif-red");
                    }else if (/orange/.test(notifClassList)) {
                        jQuery("#notif-text-overlay").addClass("notif-orange");
                    }else if (/yellow/.test(notifClassList)) {
                        jQuery("#notif-text-overlay").addClass("notif-yellow");
                    }else {
                        jQuery("#notif-text-overlay").addClass("notif-gray");
                    }
                    jQuery("#notif-text-overlay").text(notifText);
                    jQuery("#notif-text-overlay").addClass("notif-text-visible");
                },
                mouseleave: function () {
                    jQuery("#notif-text-overlay").removeClass("notif-text-visible");
                    jQuery("#notif-text-overlay").removeClass("notif-red");
                    jQuery("#notif-text-overlay").removeClass("notif-orange");
                }
            }, '.notif-instance');

            // ==== close ====
            jQuery("#notif-close").click(function(){
                jQuery("#"+notifContainerId).remove();
                //console.log("RPL notif close clicked. ("+notifContainerId+")");
            });

            // ==== clears container2 which contains notif instances. ====
            function clearNotif(){
                jQuery("#notif-container2").empty();
            }
            jQuery("#notif-clear").click(clearNotif);

            // ==== open/hide events ==============================================================|

            const mainSelector = "#notif-container2, #"+ hideButtonId +", #notif-close, #notif-clear";

            jQuery("#"+ hideButtonId).click(function () {
                //console.log(hideButtonId);
                window.localStorage.setItem(localStorageName, true);

                switchClasses(
                    mainSelector,
                    "#"+ openButtonId,
                    visibleClass,
                    hiddenClass
                );
            });

            jQuery("#"+ openButtonId).click(function () {
                //console.log(openButtonId);
                window.localStorage.setItem(localStorageName, false);

                switchClasses(
                    mainSelector,
                    "#"+ openButtonId,
                    hiddenClass,
                    visibleClass
                );
            });

            function switchClasses(mainSelector, subSelector, removedClass, newClass) {
                jQuery(mainSelector).removeClass(removedClass);
                jQuery(mainSelector).addClass(newClass);
                jQuery(subSelector).removeClass(newClass);
                jQuery(subSelector).addClass(removedClass);
            }

            // ==== CSS ===========================================================================|
            if(1){var notifsCss =
    `<style type="text/css">
        #`+ notifContainerId +` {
            width: `+ notifsWidth +`px;
            max-height: 50%;
            margin: 0 2px 2px;
            display: block;

            line-height: initial;
            color: #000;
            opacity: `+ notifsOpacity +`;
            position: fixed;
            top: 0px;
            right: 0px;
            z-index: 9999;
            overflow-y: auto;
        }
        #`+ notifContainerId +`:hover {
            opacity: 1;
        }

        .notif-rounded-block {
            display: block;
            padding: 2px;
            border-radius: 3px;
            margin-top: 2px;

            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }

        .s-counter {
            display: block;
            padding: 2px;
            border-radius: 4px;
            margin-top: 2px;

            background: #ddd;
            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
        }

        .notif-text-hidden {
            display:none;
        }
        .notif-text-visible {
            display: block;
            max-width: 50%;
            padding: 5px;
            border: #999 solid 2px;
            border-radius: 10px;

            position: fixed;
            top: 5px;
            left: 5px;
            z-index: 999999;


            font-size: 15px !important;
            font-weight: bold !important;
            text-align: center !important;
            color: black !important;
        }

        .notif-instance {
            display: block;
            padding: 2px;
            border-radius: 4px;
            margin-top: 2px;

            background: `+ notifsHex +`;
            font-size: 11px !important;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }

        .notif-instance div{/* div holding the rule.*/
            max-height: 12px;
            padding: 0px;
            margin: 0px;
            border: 0px;

            overflow: hidden;
            word-break: break-all;
        }
        .notif-hidden{ /* meant to hide the rule */
            opacity: .1;
        }
        .notif-hidden:hover {
            opacity: 1;
        }

        .notif-red {
            background: #f67066;
        }
        .notif-orange {
            background: #ffc107; //yellowish
        }
        .notif-yellow {
            background: #ffc107; //yellowish
        }
        .notif-green {
            background: #62bb66;
        }
        .notif-gray {
            background: #777;
        }

        /* collapsible classes */
        .notif-hidden1 {
            display: none !important;
        }
        .notif-visible {
            display: block !important;
        }

        div#ll-container, div#ot-container {
            border-top: solid black 3px;
        }
    </style>`;
            }
            jQuery(document.body).append(notifsCss);
        }

        if(enableExecCounter) {
            jQuery("#notif-container1").prepend("<div id='"+ scriptTag +"-counter' class='s-counter .notif-rounded-block'>T No text nodes found.</div>");
        }

        // resets lastIndex on tests with global modifiers.
        RegExp.prototype.regexTest = function(testString){
            //consolelog("## regexTest() ##", 1);
            if (this.test(testString)) {
                if (/.\/i?g/.test(this) && this.lastIndex) {//regex global modifier needs to be reset.
                    //consolelog("## last index: "+ this.lastIndex +" ##", 1);
                    this.lastIndex = 0;
                }
                return true;
            }
            return false;
        };

        NodeList.prototype.forEach = Array.prototype.forEach;
        
        // ==== CA. processPage() =================================================================|

        // ==== processPage() globals ====
        let titleChecked = 0; // if the page title was checked or not.
        let fullCheck = 0;

        // ==== counters ====
        let nodeCounter = 0; // counts text nodes.
        let deleteMatches = 0;
        let fullReplaceMatches = 0;
        let executionCounter = 0; // the number of times processPage() was executed.

        function processPage() {
            executionCounter++;

            logRuntimes = getOptionState("log-"+ scriptPrefix +"runtimes", logRuntimes);
            if (logRuntimes) {
                var startTime = performance.now();
            }

            let rulesNum = replaceRules.length;

            // per element variables
            let ruleMatched = 0;

            // ==== checks the title of the page ==================================================|
            if(1){
                let titleText = jQuery("title").text();
                if (titleText && !titleChecked) {
                    for (let index = 0; index < rulesNum; index++) {
                        if (replaceRules[index][0].regexTest(titleText)) {
                            consolelog(scriptTag +" (title match): "+ titleText +" | "+ replaceRules[index][0], "TT-MA");
                            titleText = titleText.replace(replaceRules[index][0], replaceRules[index][1]);
                            jQuery("title").text(titleText);
                        }
                    }
                    titleChecked = 1;
                }
            }

            // ==== selects specified text elements ===============================================|
            if(1){
                const excludedElements = /CODE|SCRIPT|STYLE|TEXTAREA/i;
                const checkClassRegex = new RegExp(scriptPrefix +"node","i");
                var textWalker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: function (node) {
                            if (node.nodeValue.trim() &&
                                !excludedElements.test(node.parentNode.nodeName) && // exclude scripts and style elements
                                (fullCheck || !checkClassRegex.test(node.parentNode.classList)) && // exclude checked elements
                                !classWhitelist.test(node.parentNode.classList)) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                            return NodeFilter.FILTER_SKIP;
                        }
                    },
                    false
                );
            }
            let textNode = textWalker.nextNode();

            // ==== for each textNode =============================================================|
            while (textNode) {

                let nodeText = textNode.nodeValue; // is changed based on matches.
                if (!fullCheck) {
                    let immediateParentNode = textNode.parentNode; // element containing the text node.
                    nodeCounter++;
                    
                    markCheckedElements = getOptionState(scriptPrefix +"mark-checked", markCheckedElements);
                    if (markCheckedElements) {
                        immediateParentNode.classList.add(scriptPrefix +"node-"+ nodeCounter); //prefix
                    }
                }

                // ==== for each rule =============================================================|
                for (let index = 0; index < rulesNum; index++) {

                    let currentRuleRegex = replaceRules[index][0];
                    let replacementValue = replaceRules[index][1];

                    if (currentRuleRegex.regexTest(nodeText.trim())) {
                        ruleMatched = 1;
                        let matchPrefix = "GEN0";
                        consolelog("("+ scriptTag +") (n)"+ nodeCounter +" (match): "+ nodeText.trim() +" | "+ currentRuleRegex, "TXT-MA");

                        const disableReplace = 0; // test: check what is checked through each run.
                        if (!disableReplace) {
                            
                            enableSpecialReplace = getOptionState("enable-special-replace", enableSpecialReplace);
                            // ==== delete1 match =================================================|
                            if (enableSpecialReplace && (/DELETE1/.test(replacementValue) || /DELETE2/.test(replacementValue)) ) {
                                deleteMatches++;

                                matchPrefix = "DLT99";
                                if (/DELETE1/.test(replacementValue) && !/DELETE1/.test(nodeText)) {
                                    matchPrefix = "DLT1";
                                }else if (/DELETE2/.test(replacementValue) && !/DELETE2/.test(nodeText)) {
                                    matchPrefix = "DLT2";
                                }
                                
                                consolelog("("+ scriptTag +") ("+ matchPrefix +") n"+ nodeCounter +" (match): "+ nodeText.trim() +" | "+ currentRuleRegex, matchPrefix);
                                createNotif(nodeCounter +" "+ matchPrefix, currentRuleRegex, nodeText);

                                fullDelete = getOptionState("enable-full-delete", fullDelete);
                                addTag = getOptionState("add-tag", addTag);
                                const tagRegex = new RegExp("^\\["+matchPrefix);

                                if (fullDelete) {
                                    nodeText = "## "+ matchPrefix +" ##"; // replaces the text completely.
                                    break;
                                }else if (addTag && !tagRegex.text(nodeText)) {
                                    nodeText = "["+ matchPrefix +"]: " + nodeText; // prepends DLT1 or DLT2
                                }
                            }
                            // ==== full replace match ============================================|
                            if (enableSpecialReplace && /^FR1/.test(replacementValue)) {
                                fullReplaceMatches++;
                                matchPrefix = "FR1";
                                consolelog("("+ scriptTag +") ("+ matchPrefix +") n"+ nodeCounter +" (match): "+ nodeText.trim() +" | "+ currentRuleRegex, matchPrefix);
                                createNotif(nodeCounter +" "+ matchPrefix, currentRuleRegex, nodeText);

                                nodeText = replacementValue;
                                break;
                            }
                            // ==== base case =====================================================|
                            nodeText = nodeText.replace(currentRuleRegex, replacementValue);
                        } // end if (!disableReplace)
                    }
                } // end for (each rule) ==========================================================|

                if (ruleMatched) { // modify text block.
                    ruleMatched = 0;
                    textNode.nodeValue = nodeText;
                    consolelog("("+ scriptTag +") (n)"+ nodeCounter +" (text): "+ nodeText.trim(), "CH-TT");
                }
                textNode = textWalker.nextNode();
            } // end while (textNode) =============================================================|

            if (!fullCheck) {
                // ==== update counter ====
                let counterText = "T DLT:"+ deleteMatches +" | FR:"+ fullReplaceMatches +" | N:"+ nodeCounter + " | EX:"+ executionCounter;
                jQuery("#"+ scriptTag +"-counter").text(counterText);
                if (nodeCounter) {
                    jQuery("#"+ scriptTag +"-counter").addClass("notif-green");
                }
            }else { //end fullCheck.
                fullCheck = 0;
            }

            //consolelog("## ("+ scriptTag +") execution #"+ executionCounter +" ##", "EXEC");
            // script option handles if this is displayed or not.
            if (logRuntimes) {
                const endTime = performance.now();
                const runTime = ((endTime - startTime) / 1000).toFixed(2);
                if (runTime > 1) {
                    consolelog('('+ scriptTag +') finished after ' + runTime + ' seconds.', "RUNT");
                }else {
                    consolelog('('+ scriptTag +') finished in less than 1 second.', "RUNT");
                }
            }
        } //end function function replaceText()

        // ==== CB. execution control =============================================================|
        
        //console.log("("+ scriptTag +") EXEC: Initial run.");
        //processPage();
        let runWhenReady = 0;
        runWhenReady = getOptionState("run-when-ready", runWhenReady);
        if (runWhenReady) {
            jQuery(document).ready(function() { //after DOM has loaded.
                consolelog("("+ scriptTag +") EXEC: document.ready()", "EXEC");
                //fullCheck = 1;
                processPage();
            });
        }

        let runWhenLoaded = 1;
        runWhenLoaded = getOptionState("run-when-loaded", runWhenLoaded);
        if (runWhenLoaded) {
            jQuery(window).on("load", function() { //after all initial images are loaded.
                consolelog("("+ scriptTag +") EXEC: window.load()", "EXEC");
                //fullCheck = 1;
                processPage();
            });
        }
        if (dynamicChecking) {
            jQuery(document).ready(waitForKeyElements("img", processPage));
        }

        // ==== DA. script button =================================================================|

        let buttonsContainerId = "ctb-container1";
        if (generateRecheckButton && jQuery("#"+ buttonsContainerId).length) {
            jQuery("#"+ buttonsContainerId).prepend("<div id='"+ scriptTag +"-reset' class='ctb-blue ctb-rounded-block'>run "+ scriptTag +"</div>"); //added to beginning
            //jQuery("#"+ scriptTag +"-reset").click(processPage);
            jQuery("#"+ scriptTag +"-reset").click(function() {
                fullCheck = 1;
                processPage();
            });
        }

        // ==== DB. support functions =============================================================|

        function createNotif(notifLabel, notifRule, notifText) { //msg1 needs to match notifTypes
            enableNotifications = getOptionState("enable-"+ scriptPrefix +"notifs", enableNotifications);
            if (enableNotifications) {
                let additionalClass = "notif-gray";
                let notifContainer = "ot-container";
                if (/dlt/i.test(notifLabel)) {
                    additionalClass = "notif-red";
                    notifContainer = "dlt-container";
                }

                let newNotif =
                    "<div class='notif-instance "+ additionalClass +"'><div>t n"+ notifLabel +"</div>"+
                        "<div class='notif-hidden'>"+ notifRule +"</div>"+
                        "<div class='notif-text' hidden>"+ notifText+"</div>"+ // to be displayed at the bottom left.
                    "</div>";

                let enabledNotifTypesRegex = /./;
                if (enabledNotifTypesRegex.test(notifLabel)) {
                    jQuery("#"+ notifContainer).append(newNotif);
                    jQuery(".notif-instance").click(function(){
                        jQuery("#notif-container2").empty();
                    });

                    if (!/dlt/i.test(notifLabel)) {
                        jQuery("#ot-container").removeClass("notif-hidden1");
                    }

                    autohideNotifs = getOptionState("autohide-notifications", autohideNotifs);
                    if (autohideNotifs) {
                        const notifDuration = 10; // default 10; amount of seconds notifications are displayed before disappearing.
                        setTimeout(function() {
                            jQuery(".notif-instance").remove();
                        }, notifDuration*1000);
                    }
                }
            }
        } // end function creatNotif()

        function consolelog(text, messageType) {
            if (enableConsoleMessages && enabledMessagesRegex.test(messageType)) {
                console.log(text);
            }
        }

        // ==== script end ========================================================================|
        consolelog("#### ("+ scriptTag +") text replace script is active. ####", "EXEC");

    } // end if (runScript)

    // ============================================================================================|

    // = getOptionState(, );
    // used to update option if 'script option' is set.
    function getOptionState(idName, currentState) {
        if (document.getElementById(idName)) {
            return document.getElementById(idName).checked;
        }
        return currentState;
    }
})();


