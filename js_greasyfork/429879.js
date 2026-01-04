// ==UserScript==
// @name         TinyLlama : Tinychat Themes and Extra Features
// @namespace    http://www.smokeyllama.com
// @version      2021.15
// @description  Editing Overall Theme of Tinychat. 12 Color Themes, Background Images, and More! Install and refresh.
// @author       SmokeyLlama
// @match        https://tinychat.com/*
// @match        https://tinychat.com/room/*
// @exclude      https://tinychat.com/room/*?1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/429879/TinyLlama%20%3A%20Tinychat%20Themes%20and%20Extra%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/429879/TinyLlama%20%3A%20Tinychat%20Themes%20and%20Extra%20Features.meta.js
// ==/UserScript==
/* Room vs Homepage */
if (/\/room/.test(location.pathname)) {
    LLAMA_SocketWatcher``;
    var initInterval = setInterval(function() {
        if (document.querySelector("tinychat-webrtc-app").shadowRoot) LLAMAapp = runLLAMA``;
        else llamaConsole("Waiting for DOM...");
    }, 500);

    function runLLAMA() {
        clearInterval(initInterval);
        llamaConsole("> Starting TINY-LLAMA...")
        try {
            // Default Variables
            var bodyElem = document.querySelector("body");

            var webappOuter = document.querySelector("tinychat-webrtc-app");
            var webappElem = webappOuter.shadowRoot;

            var chatlogOuter = webappElem.querySelector("#room-content");
            var chatlogElem = webappElem.querySelector("tc-chatlog").shadowRoot;
            var titleElem = webappElem.querySelector("tc-title").shadowRoot;
            var sidemenuElem = webappElem.querySelector("tc-sidemenu").shadowRoot;
            var videomoderationElem = sidemenuElem.querySelector("tc-video-moderation").shadowRoot;
            var videolistElem = webappElem.querySelector("tc-videolist").shadowRoot;

            var chatlistElem = sidemenuElem.querySelector("tc-chatlist").shadowRoot;
            var userlistElem = sidemenuElem.querySelector("tc-userlist").shadowRoot;
            var userContextmenuElem = userlistElem.querySelector("tc-user-contextmenu").shadowRoot;

            var chatlogCSS = chatlogElem.querySelector("#chat-wrapper");
            var sidemenuCSS = sidemenuElem.querySelector("#sidemenu");

            var videomoderationCSS = videomoderationElem.querySelector("#moderatorlist");
            var webappCSS = webappElem.querySelector("#room");

            var chatlistCSS = chatlistElem.querySelector("#chatlist");
            var userlistCSS = userlistElem.querySelector("#userlist");
            var userContextmenuCSS = userContextmenuElem.querySelector("#main");
            var titleCSS = titleElem.querySelector("#room-header");
            var themeCSS = titleElem.querySelector("#llama-themes");
            var buttonCSS = videolistElem.querySelector("#videos-footer");

            var videolistCSS = videolistElem.querySelector("#videolist");
            var bodyCSS = document.querySelector("body");

            var userinfoCont = sidemenuElem.querySelector("#user-info > div");
            var scrollbox = chatlogElem.querySelector("#chat");
            var unreadbubble = chatlogElem.querySelector("#input-unread");

            var resourceDirectory = document.querySelector('link[rel="manifest"]').getAttribute("href").split("manifest")[0]; // \/([\d\.\-])+\/
            var pinkPop = new Audio(resourceDirectory + 'sound/pop.mp3');
            var weedPop = new Audio('https://smokeyllama.com/bong.mp3');
            var audioPop = new Audio(resourceDirectory + 'sound/pop.mp3');
            var settingMentions = [];
            var giftsElemWidth = 127;
            var messageHeight;
            var chatboxHeight;
            var totalScrolledUp = 0;
            var freshInstall = (GM_listValues().length == 0);
            var isModerator = (!userlistElem.querySelector("#button-banlist").classList.contains("hidden"));
            var isPaidAccount = (sidemenuElem.querySelector("#sidemenu-wider"));

            var browserFirefox = navigator.userAgent.includes("Firefox/");
            var urlAddress = new URL(window.location.href);
            var urlPars = urlAddress.searchParams;

            var messageQueryString = "#chat-content .message:not(.llama-systemMsg)";
            var camQueryString = ".videos-items:last-child > .js-video";

            var userCount = 0;
            var messageCount = 0;
            var camMaxedCurrent = null;
            var camClosedCurrent = null;
            var autoScrollStatus = true;
            var roomName = webappOuter.getAttribute("roomname");
            var joinTime = getFormattedDateTime(new Date(), "time");
            var joinDate = getFormattedDateTime(new Date());

            document.title = roomName + " - Tinychat";
            declareGlobalVars();
            var settingsWaitInterval = setInterval(waitForSettings, 1000);

            // [START] CSS VARIABLES
            // I got tired of running around for css sections
            // if statements are purely for collapse ability
            if ('llamaSettingsCSS' != true) {
                var llamaSettingsCSS = (`
                    <!--- START OF THEMES --->
                    <div id="llama-themes">
                    <div id="llama-themesBox" class="hidden">
                    <div id="llama-colors">
                    <div id="llama-settings-pinkmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="PINK"></span>
                    <div class="foo2 pink"></div>
                    </label>
                    </div>
                    <div id="llama-settings-greenmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="GREEN"></span>
                    <div class="foo2 green"></div>
                    </label>
                    </div>
                    <div id="llama-settings-bluemode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="BLUE"></span>
                    <div class="foo2 blue"></div>
                    </label>
                    </div>
                    <div id="llama-settings-mauvemode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="MAUVE"></span>
                    <div class="foo2 mauve"></div>
                    </label>
                    </div>
                    <div id="llama-settings-orangemode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="ORANGE"></span>
                    <div class="foo2 orange"></div>
                    </label>
                    </div>
                    <div id="llama-settings-redmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="RED"></span>
                    <div class="foo2 red"></div>
                    </label>
                    </div>
                    <div id="llama-settings-purplemode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="PURPLE"></span>
                    <div class="foo2 purple"></div>
                    </label>
                    </div>
                    <div id="llama-settings-blackmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="BLACK"></span>
                    <div class="foo2 black"></div>
                    </label>
                    </div>
                    <div id="llama-settings-trueblackmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="TRUE BLACK"></span>
                    <div class="foo2 trueblack"></div>
                    </label>
                    </div>
                    <div id="llama-settings-defaultmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark" title="WHITE"></span>
                    <div class="foo2 default"></div>
                    </label>
                    </div>
                    <div id="llama-settings-weedmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark feature1" title="Weed"></span>
                    <div class="foo2 featureone"></div>
                    </label>
                    </div>
                    <div id="llama-settings-smashbrosmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark feature2" title="Smash Bros"></span>
                    <div class="foo2 featuretwo"></div>
                    </label>
                    </div>
                    <div id="llama-settings-splatoonmode">
                    <label class="llama-color-container">
                    <input type="checkbox"><span class="checkmark feature3" title="Splatoon"></span>
                    <div class="foo2 featurethree"></div>
                    </label>
                    </div>
                    <div id="featured" class="featured" style="display:none;">
                    <div id="llama-settings-featuredmode">FEATURED</div>
                    </div>
                    </div>
                    </div>
                    <div id="llama-themesGear" title="Themes">

                    <style>
                    #llama-themesGear:hover {
                    cursor: pointer;}
            #llama-themesGear:hover > #llama-themesButton {
                background-color: var(--llamatheme-bordercolor)}
            llama-themesButton
            #llama-themesGear>div>span:after {
                content: "";
                position: relative;
                display: none;
                /* display: inline-block; */
                height: 7px;
                width: 7px;
                top: -1px;
                left: 0;
                margin-left: 4px;
                border-width: 2px 2px 0 0;
                border-style: solid;
                border-color: #fff;
                box-sizing: border-box;
                transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
                transition: .2s;
            }

            #llama-themesGear>div>span:hover::after {
                margin-left: 8px;
            }

            #llama-themesButton.llama-themes-open>span::after {
                border-width: 0 0 2px 2px;
                margin-left: 8px;
            }

            </style>
            <div class="llama-themesButton" id="llama-themesButton"><span><img src="https://raw.githubusercontent.com/snwh/paper-icon-theme/master/Paper/512x512/apps/preferences-color.png" width="20px" style="margin-top:3px;"></span></div>
                </div></div></div>
            <!--- END OF THEMES --->

            <!--- START OF HIDING --->

            <style>
                    #llama-hidinglist>a {
                        background-color: #002f3e;
                        border: 1px solid #c1c1c17d;
                        border-bottom-right-radius: 5px;
                        color: #fff;
                        text-decoration: none;
                        padding: 5px;
                        position: absolute;
                        left: -2px;
                        box-shadow: -1px 1px 5px 0px #000;
                    }

            </style>

            <div id="llama-hiding" style="display:none;">
                <div id="llama-hidingBox" class="hidden">
                    <div id="llama-hidinglist">
                        <a href="https://smokeyllama.glitch.me/game_list.html" target="gamelist">«
            RETURN TO GAME LIST</a><!-- Copy and Paste Me --><iframe allow="geolocation; microphone; camera; midi; encrypted-media" src="https://smokeyllama.glitch.me/game_list.html" name="gamelist" style="border:0px;padding:0px;margin:0px;padding-top:10px;"/></iframe>
            </div>
            </div>
            <div id="llama-hidingGear" title="Games">
                <div class="llama-hidingButton" id="llama-hidingButton"><span style="margin-left:10px;">
                    </span>
            </div>
            </div>
            </div>

            <!--- END OF HIDING --->

            <!--- START OF GAMES --->

            <style>
                    #llama-gameslist>a {
                        background-color: #002f3e;
                        border: 1px solid #c1c1c17d;
                        border-bottom-right-radius: 5px;
                        color: #fff;
                        text-decoration: none;
                        padding: 5px;
                        position: absolute;
                        left: -2px;
                        box-shadow: -1px 1px 5px 0px #000;
                    }

            </style>

            <div id="llama-games" style="">
                <div id="llama-gamesBox" class="hidden">
                    <div id="llama-gameslist">
                        <a href="https://smokeyllama.glitch.me/game_list.html" target="gamelist">«
            RETURN TO GAME LIST</a><!-- Copy and Paste Me --><iframe allow="geolocation; microphone; camera; midi; encrypted-media" src="https://smokeyllama.glitch.me/game_list.html" name="gamelist" style="border:0px;padding:0px;margin:0px;padding-top:10px;"/></iframe>
            </div>
            </div>
            <div id="llama-gamesGear" title="Games">
                <div class="llama-gamesButton" id="llama-gamesButton"><span style="margin-left:10px;">
                    </span>
            </div>
            </div>
            </div>
            <style>
                    .default-theme .chat__LlamaOption {
                        background-color: #006e8c !important;
                        border-color: #04caff !important;
                        color: #fff !important;
                    }
            .default-theme .chat__LlamaOption.active,
                .default-theme .chat__LlamaOption:hover{
                    background-color: #04caff !important;
                }
            .chat__LlamaOption.active {
                font-weight: 600;
                background-color: var(--llamatheme-buttontext);
                color: var(--llamatheme-textcolor);
            }
            .chat__LlamaOption:hover {
                background-color: var(--llamatheme-buttontext);
            }
            .chat__LlamaOption {
                width: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                min-height: 40px;
                padding: 0;
                box-sizing: border-box;
                cursor: pointer;
                border-radius: 5px;
                margin: 2px;
                padding-left: 8px;
                padding-right: 8px;
                min-height: 27px;
                border: 1px solid transparent;
                border-color: var(--llamatheme-bordercolor);
                background-color: var(--llamatheme-bordercolor);
                color: var(--llamatheme-textcolor);
                box-shadow: 0 -1px rgb(0 0 0/50%) inset!important;
            }
            #llama_top_bar {
                vertical-align: top;
                display: inline-block;
                width: 30%;
                margin-right: 10px;
            }
            .llama_settings_inner {
                width: 450px;
            }
            .llama_setting {
                display: inline-block;
                width: 65%;
                max-width: 65%;
                max-height: 600px;
                height: 200px;
                /*overflow: auto;*/
                margin-top: 7px;
            }
            .d-none {
                display: none!important;
            }
            .w-100 {
                width: 100%!important;
            }

            .dabchatog_mode {
                background-color: #143848;
            }

            .color_square {
                width: 20px;
                height: 20px;
                display: inline-block;
                margin: 1px;
                cursor: pointer;
                border-radius: 3px;
                border: 1px solid #1b8cb5;
            }

            .color_square:hover {
                transition-timing-function: ease-in;
                transform: scale(0.9)
            }

            .dabchat_mode {
                background-color: #848e98
            }

            .dabchatog_mode {
                background-color: #143848
            }

            .pink_mode {
                background-color: #ffd1dc
            }

            .neonpink_mode {
                background-color: #ad0098
            }

            .green_mode {
                background-color: #042500
            }

            .neongreen_mode {
                background-color: #01ca21
            }

            .blue_mode {
                background-color: #111949
            }

            .mauve_mode {
                background-color: #9168b2
            }

            .orange_mode {
                background-color: #b33700
            }

            .red_mode {
                background-color: #590000
            }

            .purple_mode {
                background-color: #280048
            }

            .black_mode {
                background-color: #2c2f33
            }

            .trueblack_mode {
                background-color: #111
            }

            .default_mode {
                background-color: #fff
            }

            .weed_mode {
                background-color: transparent;
                background-image:url('https://i.ibb.co/0Dp3Knx/weed-logo2.png');
                background-size: cover;
                border: 0px;
            }

            .smashbros_mode {
                background-color: transparent;
                background-image:url('https://i.ibb.co/7KSTsdj/smash-clipart-87526.png');
                background-size: cover;
                border: 0px;
            }

            .splatoon_mode {
                background-color: transparent;
                background-image:url('https://i.ibb.co/3dHQVhC/splat-mic2.png');
                background-size: cover;
                border: 0px;
            }
            .small, small {
                font-size: 80%;
                font-weight: 400;
            }
            .float-right {float: right !important;}
            </style>
            <!--- END OF GAMES --->

            <div id="llama-settings">
                <div id="llama-settingsGear" title="Settings">
                    <span style="">
                        <img src="https://cdn1.iconfinder.com/data/icons/MetroStation-PNG/128/MB__Llama.png" width="20px">
                            </span>
            </div>
            <div id="llama-settingsBox" class="hidden">
                <p id="title">⪢ TINY-LLAMA Settings<span class="float-right small"><a href="https://www.smokeyllama.com" target="_blank" rel="noopener">smokeyllama.com</a> | <a href="https://github.com/SmokeyLlama" target="_blank" rel="noopener">scripts gitHub</a></span></p>
            <div class="llama_settings_inner">
                <div id="llama_top_bar">
                    <label class="button chat__LlamaOption active" id="llama_general">
                        General
            </label>

            <label class="button chat__LlamaOption" id="llama_theme">
                Themes
            </label>

            <label class="button chat__LlamaOption" id="llama_images">
                Images
            </label>

            <label class="button chat__LlamaOption" id="llama_cams">
                Cams
            </label>
            </div>

            <div class="llama_setting" id="llama_general_settings">
                <span style="color: var(--llamatheme-textcolor); font-weight: bold;font-size: 9pt;">General Settings</span>
            <hr style="border: 2px solid var(--llamatheme-bordercolor);">
                <div id="llama-settings-mentions" class="llama-setting-container">
                    <input type="checkbox"><span class="label">Alert phrases <span class="info" data-title='A comma-separated list of phrases to alert/highlight for. Example of 3 phrases: "hello,Google Chrome,sky"'>?</span></span>
                        <div class="inputcontainer"><input class="text"><button class="save blue-button">save</button></div>
                            </div>
            <div id="llama-settings-autoscroll" class="llama-setting-container"><input type="checkbox"><span class="label">Autoscroll </span></div>
                <div id="llama-settings-notifications" class="llama-setting-container"><input type="checkbox"><span class="label">Hide notifications </span></div>
                    <div id="llama-settings-changefont" class="llama-setting-container"><input type="checkbox"><span class="label">Improve font <span class="info" data-title='The default font is too thin in some browsers'>?</span></span></div>
            <div id="llama-settings-chatbelow" class="llama-setting-container"><input type="checkbox"><span class="label">Chat on Bottom <span class="info" data-title='!! BETA !! ------ If cams dont resize, hit the arrow on the side of the chatlog to force resize.'>*</span></span></div>

            </div>

            <div class="llama_setting" id="llama_theme_settings">
                <span style="color: var(--llamatheme-textcolor); font-weight: bold;font-size: 9pt;">Theme Settings</span>
            <hr style="border: 2px solid var(--llamatheme-bordercolor);">
                <div class="color_square pink_mode" title="pink" id="pink_square"></div>
            <div class="color_square green_mode" title="green" id="green_square"></div>
            <div class="color_square blue_mode" title="blue" id="blue_square"></div>
            <div class="color_square mauve_mode" title="mauve" id="mauve_square"></div>
            <div class="color_square orange_mode" title="orange" id="orange_square"></div>
            <div class="color_square red_mode" title="red" id="red_square"></div>
            <div class="color_square purple_mode" title="purple" id="purple_square"></div>
            <div class="color_square black_mode" title="black" id="black_square"></div>
            <div class="color_square trueblack_mode" title="trueblack" id="trueblack_square"></div>
            <div class="color_square default_mode" title="default" id="default_square"></div>
            <br>
                <div class="color_square weed_mode" title="weed" id="weed_square"></div>
            <div class="color_square smashbros_mode" title="smash bros" id="smashbros_square"></div>
            <div class="color_square splatoon_mode" title="splatoon" id="splatoon_square"></div>
            <div id="llama-trans-chat" class="llama-setting-container"><input type="checkbox" id="llama-trans-chat-checkbox"><span class="label">Transparent Chatbox </span></div>
                </div>

            <div class="llama_setting" id="llama_images_settings">
                <span style="color: var(--llamatheme-textcolor); font-weight: bold;font-size: 9pt;">Custom Image Settings</span>
            <hr style="border: 2px solid var(--llamatheme-bordercolor);">
                <div id="llama-settings-roombg" class="llama-setting-container"><input type="checkbox"><span class="label">Room BG Image </span></div>

                    <span class="dropdown__Option no_hoverbg no_hover" id="room_bg_box">
                        <input type="text" id="llama_roombg_img" class="w-100" placeholder="Room BG image URL..">
                            </span>
            </div>


            <div class="llama_setting" id="llama_cams_settings">
                <span style="color: var(--llamatheme-textcolor); font-weight: bold;font-size: 9pt;">Cam Settings</span>
            <hr style="border: 2px solid var(--llamatheme-bordercolor);">
                <div id="llama-settings-roundedcams" class="llama-setting-container"><input type="checkbox"><span class="label">Round Cam Corners</span></div>
                    <div id="llama-settings-borderlesscams" class="llama-setting-container"><input type="checkbox"><span class="label">Remove Cam Padding</span></div>
                        <div id="llama-settings-maxcamposition" class="llama-setting-container"><input type="checkbox"><span class="label">Maximized Cam On Left</span></div>
                            </div>

            </div>

            </div>
            </div>
            </div></div></div>

            <!--- START OF TEST --->

            <div id="llama-settings-miniyt" class="llama-setting-container right" style="position:absolute;right:100px;">
                <label class="llama-miniyt-container">
                    <input type="checkbox"">
            <span class="checkmark" title="Toggle Mini Youtube"></span>
            <span class="label">
                <img src="https://i.ibb.co/x5wQDvb/MiniYT.png">
                    <span class="info" data-title='Mini Youtube : After Toggle, Press the arrow button on the side of the chatbox to fix cams!'>?</span>
            </span>
            </label>
            </div>

            <style>
                        /*-TEST----*/

                        #llama-settings-miniyt>label:hover {
                            background-color: transparent;
                            border:0px solid var(--llamatheme-bordercolor) !important;}


            /* On mouse-over, add a grey background color */

            .llama-miniyt-container:hover input~.checkmark {
                background-color: transparent;
                border-right: 1px solid #fff;
                border-bottom: 1px solid #fff;
                border-bottom-right-radius: 10px;
                border-left: 0px;
                width: 25px;
                height: 25px;
            }


            /* When the checkbox is checked, add a blue background */

            .llama-miniyt-container input:checked~.checkmark {
                background-color: transparent;
                border: 0px solid #FFFFFF;
                border-top-right-radius: 100px;
                border-bottom-right-radius: 100px;
                border-left: 0px;
                width: 25px;
            }


            /* Create the checkmark/indicator (hidden when not checked) */

            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }


            /* Show the checkmark when checked */

            .llama-miniyt-container input:checked~.checkmark:after {
                display: block;
            }


            /* Style the checkmark/indicator */

            #llama-settings-miniyt>label>span.checkmark:after {
                left: 8px;
                top: 1px;
                width: 3px;
                height: 8px;
                border: solid #ffffff;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }


            /*-TEST---------*/

            #llama-settings-miniyt>label>input[type=checkbox] {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }

            .checkmark2 {
                position: absolute;
                top: 0;
                left: 0;
                height: 14px;
                width: 15px;
                background-color: transparent;
                border-radius: 3px;
            }

            #llama-settings-miniyt .info {
                position: absolute;
                top: 0px;
                left: 0px;
                color: transparent;
                font-weight: bold;
                font-family: Arial;
                border: transparent 1px solid;
                border-radius: 16px;
                height: 1.5em;
                width: 1.5em;
                text-align: center;
                display: inline-block;
            }

            #llama-settings-miniyt .info:hover:after {
                font-weight: normal;
                padding: 4px 7px 4px 7px;
                border-radius: 7px;
                color: white;
                background: #0085ad;
                content: attr(data-title);
                display: inline-block;
                position: absolute;
                top: 25px;
                left: 0;
                width: 200px;
                z-index: 9;
            }

            </style>

            </div>
            <!--- END OF TEST --->
		`);
            }
            if ('llamaTitleCSS' != true) {
                var llamaTitleCSS = (`
                    #llama-ColorChoice {
                        position:absolute;
                        top:10px;
                        background-color:#00ff00;}

                .foo {
                    float: left;
                    width: 90px;
                    height: 13px;
                    margin-left: 25px;
                    border: 1px solid rgba(0, 0, 0, .2);
                    border-radius: 0px;
                    text-align: center;
                    font-weight: bold;}

                .foo2 {
                    float: left;
                    width: 25px;
                    height: 15px;
                    border-top-right-radius: 100px;
                    border-bottom-right-radius: 100px;
                    text-align: center;
                    font-weight: bold;
                    border: 0PX SOLID #313131;}

                .foo3 {
                    float: left;
                    width: 65px;
                    height: 50px;
                    /*  border: 1px solid rgba(0, 0, 0, .2); */
                    border-radius: 3px;
                    text-align: center;
                    font-weight: bold;
                    border: 1px solid #C1C1C1;
                    margin-left: 5px;}

                .pick {font-size: 11px;
                       position: relative;
                       top: 2px;
                       left: 20px;
                       float: left;
                       color: #313131;}



                .pink {background: #ffadc1;
                       color: #952c46;}
                .green {background: #00500d;
                        color: #952c46;}
                .blue {background: #2a388b;
                       color: #952c46;}
                .mauve {background: #BF8FE5;
                        color: #952c46;}
                .purple {background: #550098;
                         color: #952c46;}
                .orange {background: #ff4f00;
                         color: #952c46;}
                .red {background: #860000;
                      color: #952c46;}
                .default {background: #ffffff;
                          color: #952c46;}
                .weed {
                    color: #952c46;}
                .smashbros {
                    color: #952c46;}
                .splatoon {
                    color: #952c46;}
                .black {
                    background: #191919;
                }
                .trueblack {
                    background: #000;
                }

                .feature1 {
                    width: 30px !important;
                    height: 33px !important;
                }

                .feature1:hover {
                    background-color:#00ff00;
                    width: 30px !important;
                    height: 33px !important;
                }
                .featureone {
                    background-image: url(https://i.ibb.co/0Dp3Knx/weed-logo2.png);
                                          background-size: 36px;
                                          position: relative;
                                          right: 8px;
                                          background-position: top left;
                                          background-repeat: no-repeat;
                                          color: #952c46;
                                          float: left;
                                          width: 50px;
                                          height: 50px;
                                          text-align: center;}


                .feature2 {
                    width: 30px !important;
                    height: 33px !important;
                }

                .feature2:hover {
                    background-color:#00ff00;
                    width: 30px !important;
                    height: 33px !important;
                }
                .featuretwo {
                    background-image: url(https://i.ibb.co/7KSTsdj/smash-clipart-87526.png);
                                          background-size: 36px;
                                          position: relative;
                                          right: 8px;
                                          background-position: top left;
                                          background-repeat: no-repeat;
                                          color: #952c46;
                                          float: left;
                                          width: 50px;
                                          height: 50px;
                                          text-align: center;}

                .feature3 {
                    width: 30px !important;
                    height: 33px !important;
                }

                .feature3:hover {
                    background-color:#00ff00;
                    width: 30px !important;
                    height: 33px !important;
                }
                .featurethree {
                    background-image: url(https://i.ibb.co/3dHQVhC/splat-mic2.png);
                                          background-size: 36px;
                                          position: relative;
                                          right: 8px;
                                          background-position: top left;
                                          background-repeat: no-repeat;
                                          color: #952c46;
                                          float: left;
                                          width: 50px;
                                          height: 50px;
                                          text-align: center;}


                @keyframes ease-to-left {
                    0% {right: -50px; opacity: 0;}
                    100% {right: 0; opacity: 1;}}

                @keyframes ease-to-right {
                    0% {right:auto;}
                    100% {right:0;}}

                @keyframes ease-to-bottom-21px {
                    0% {top:-300px; opacity: 0;}
                    100% {top:0; opacity: 1;}}
                width: 446px;

                #content {
                    padding: 0px;
                    background-color:#111111;}

                #room-header-gifts-buttons > #get-coins {
                    background-color: var(--llamatheme-cambgcolor);
                    border-color: var(--llamatheme-bordercolor);
                    color: var(--llamatheme-bordercolor);}

                #room-header-gifts-buttons > #get-coins:hover {
                    background-color: var(--llamatheme-bordercolor);
                    border-color: var(--llamatheme-bordercolor);
                    color: var(--llamatheme-cambgcolor);}

                #room-header-gifts-buttons > a {
                    background-color: var(--llamatheme-cambgcolor);
                    border-color: var(--llamatheme-bordercolor);
                    color: var(--llamatheme-bordercolor);}

                #room-header-gifts-buttons > a:hover {
                    background-color: var(--llamatheme-bordercolor);
                    border-color: var(--llamatheme-bordercolor);
                    color: var(--llamatheme-cambgcolor);}

                #llama-header-grabber {
                    position: absolute;
                    top: 88px;
                    right: 50%;
                    background: white;
                    width: 60px;
                    height: 20px;
                    border-color: var(--llamatheme-bordercolor);
                    border-top: 1px solid var(--llamatheme-bordercolor);
                    border-right: 0px;
                    border-bottom: 0px;
                    border-left: 0px;
                    border-radius: 19px;
                    text-align: center;
                    color: var(--llamatheme-bordercolor);
                    cursor: pointer;
                    transition: all .4s ease-in-out;
                    background-color: var(--llamatheme-cambgcolor);
                    z-index:9;}

                #llama-header-grabber:hover {
                    background-color: var(--llamatheme-bordercolor);
                    border-color: var(--llamatheme-bordercolor);}

                #llama-fullscreen-grabber {
                    position: absolute;
                    top: 50px;
                    right: 18%;#room-header *
                        background: white;
                    width: 20px;
                    height: 20px;
                    border: #313131 1px solid;
                    border-radius: 19px;
                    text-align: center;
                    color: #b4c1c5;
                    cursor: pointer;
                    transition: all .4s ease-in-out;
                    background-color:#111111;}

                #llama-header-grabber:before{    content: '';
                                             position: absolute;
                                             display: block;
                                             height: 0;
                                             width: 0;
                                             top: 50%;
                                             left: 50%;
                                             margin: -7px 0 0 -2px;
                                             border-width: 4px 4px 4px 0;
                                             border-style: solid;
                                             border-left: 4px solid transparent;
                                             border-right: 4px solid transparent;
                                             border-top: 4px solid transparent;
                                             transition: .8s;}

                .llama-headerCollapsed #llama-header-grabber:before {
                    transform: rotate(180deg);
                    -webkit-transform: rotate(180deg);
                    top: 12px;}

                .llama-headerCollapsed #llama-header-grabber {
                    top: 0px;
                    background: var(--llamatheme-bgcolor);
                    border-top: 0;
                    z-index: 9;
                    border-radius: 11px;
                    line-height: 15px;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    height: 15px;}

                .llama-headerCollapsed:hover #llama-header-grabber {
                    height: 29px;
                    line-height: 43px;}

                .llama-nightmode #llama-settings > div#llama-updateNotifier {
                    border-color: #5d7883;}

                .llama-nightmode #llama-settings > div#llama-updateNotifier {
                    background-color: transparent;
                    border-color: #145876;
                    color:#191919;
                    top: -100px;}

                -------

                    #llama-settings > div#llama-updateNotifier {
                        top: -200px;
                        margin-right: -33px;
                        float: left;
                        border: #53b6ef 1px solid;
                        border-radius: 8px 0 0px 8px;
                        padding: 5px;
                        padding-right: 32px;
                        height: auto;
                        transition: visibility 0s, opacity 0.5s linear;
                        background: white;}

                #llama-settings.llama-open > div#llama-updateNotifier {
                    visibility: hidden;
                    opacity: 0;
                    width: 0;
                    height: 0;
                    padding: 0;}

                #llama-settings > div#llama-updateNotifier:hover {
                    cursor: pointer;}

                .llama-exitButtonSmall {
                    float: left;
                    padding-right: 37px;
                    /* margin: 0px; */
                    color: #191919;
                    padding-left: 5px;
                    padding-top: 9px;
                    padding-bottom: 7px;
                    background-color: cyan;
                    border-radius: 50px;
                    height: 20px;
                    margin-right: 7px;
                    position: relative;
                    top: -36px;
                    right: -82px;
                    font-size: 12pt;
                    font-weight: bold;}

                #llama-settings > div#llama-updateNotifier.visible {
                    top: 38px;
                    color: #ffffff !important;
                    text-transform: uppercase;
                    background-color: transparent;
                    border-color:cyan;
                    padding: 5px;
                    padding-top: 10px;
                    padding-right: 40px;
                    padding-bottom: 10px;
                    border-radius: 20px;}

                .llama-exitButtonSmall:hover {
                    color: #7ccefe;
                    background-color: #2b2b2b;
                    border-radius: 50px;
                    border:1px solid cyan;
                    height: 20px;
                    padding-bottom: 5px;}


                ------

                input {
                    border: 1px solid #c4d4dc;
                    line-height: 16px;
                    padding-left: 3px;}

                .label ~ input {
                    border-bottom-left-radius: 6px;
                    border-top-left-radius: 6px;}

                input ~ button {
                    border-bottom-right-radius: 6px;
                    border-top-right-radius: 6px;}

                input[type="button"], button {
                    display: inline;
                    padding: 0 15px;
                    border: 0;
                    box-sizing: border-box;
                    letter-spacing: 1px;
                    font-size: 12px;
                    font-weight: bold;
                    line-height: 20px;
                    text-align: center;
                    transition: .2s;
                    outline: none;}

                .blue-button {
                    color: #fff;
                    border: 1px solid var(--llamatheme-bordercolor);
                    background-color: var(--llamatheme-bgcolor);}

                .blue-button:hover {
                    background-color: var(--llamatheme-lightbgcolor);}

                .blue-button:active {
                    background-color: #38a8dd;}

                .llama-setting-container {
                    line-height: initial;}

                #llama-settings > div {
                    animation: ease-to-bottom-21px .2s ease 0s 1;
                    position: relative;
                    top: 10px;
                }

                #llama-settings > div > span {
                    position: relative;
                    top: -23px;
                    background-color: var(--llamatheme-cambgcolor);
                    border: 1px solid var(--llamatheme-bordercolor);
                    border-radius: 100px;
                    padding-left: 5px;
                    padding-right: 5px;}


                @media screen and (max-width: 1000px) {
                    #llama-settings > div {
                        height: 92px;}
                }

                #llama-settings .hidden {
                    display: none;}

                #llama-themes .hidden {
                    display: none;}

                #llama-games .hidden {
                    display: none;}

                #llama-hiding .hidden {
                    display: none;}

                #llama-settings #title {
                    font-weight: bold;
                    color: var(--llamatheme-textcolor);
                    background-color: var(--llamatheme-lightbgcolor);
                    padding: 5px 5px 10px 5px;
                    border-radius: 5px 5px 0px 0px;
                    margin: -1px -10px 5px -10px;
                }

                #llama-settings {
                    transition: all .4s ease-in-out;
                    animation: ease-to-bottom-21px .2s ease 0s 1;
                    font-size: 11px;
                    flex: none;
                    overflow: hidden;
                    z-index: 5;
                    position: absolute;
                    top: 0px;
                    /*	right: px; */}



                #llama-themes.llama-sidemenuCollapsed {position:absolute;left:0px !important;}
                #llama-themes {
                    width: 25px;
                    /*		transition: all .4s ease-in-out;*/
                    /*		animation: ease-to-bottom-21px .2s ease 0s 1;*/
                    /*max-height: 10%;*/
                    font-size: 11px;
                    flex: none;
                    z-index: 9;
                    position: absolute;
                    top: 5px;
                    left:161px;}

                .default-theme #llama-themesGear > div {
                    background-color: #04caff !important;
                    border-color: #04caff !important;
                    color: #fff !important;
                }
                #llama-themesGear > div {
                    background-color: var(--llamatheme-cambgcolor);
                    border:1px solid var(--llamatheme-bordercolor);
                    height: 25px;
                    border-bottom-right-radius:20px;
                    border-top-right-radius:20px;
                    border-left:0px;
                    text-align: center;
                    font-weight: bold;
                    color: var(--llamatheme-textcolor);
                    line-height: 20px;
                    font-size: 13px;}

                /*

                #llama-themesGear > div:hover{
                    background-color: #04caff;
                    height: 25px;
                    border-bottom-right-radius:20px;
                    border-top-right-radius:20px;
                    cursor:pointer;
                    text-align: center;
                    color:#fff;}*/

                #llama-themesButton > span > img:hover{
                    -webkit-animation-name: rotate;
                    -webkit-animation-duration: 2s;
                    -webkit-animation-iteration-count: infinite;
                    -webkit-animation-timing-function: linear;
                    -moz-animation-name: rotate;
                    -moz-animation-duration: 2s;
                    -moz-animation-iteration-count: infinite;
                    -moz-animation-timing-function: linear;
                    animation-name: rotate;
                    animation-duration: 2s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                @-webkit-keyframes rotate {
                    from {-webkit-transform: rotate(0deg);}
                    to {-webkit-transform: rotate(360deg);}
                }

                @-moz-keyframes rotate {
                    from {-moz-transform: rotate(0deg);}
                    to {-moz-transform: rotate(360deg);}
                }

                @keyframes rotate {
                    from {transform: rotate(0deg);}
                    to {transform: rotate(360deg);}
                }


                #llama-hiding {
                    width: 53px;
                    font-size: 11px;
                    flex: none;
                    z-index: 9;
                    position: absolute;
                    top: 199px;
                    right: 0px;}

                #llama-hidingGear > div {
                    background-color: #111111;
                    background-image: url(https://i.ibb.co/FXrx1X9/Video-Game-Controller-Icon-IDV-edit-green-svg.png);
                                          background-position: top center;
                                          background-position-y: -6px;
                                          background-size: 27px;
                                          background-repeat: no-repeat;
                                          border: 1px solid #313131;
                                          height: 24px;
                                          border-bottom-left-radius: 15px;
                                          border-bottom-right-radius: 15px;
                                          /* border-left: 0px; */
                                          text-align: center;
                                          font-weight: bold;
                                          color: #C1C1C1;
                                          line-height: 20px;
                                          font-size: 13px;;}

                #llama-hidingGear > div:hover {
                    background-color: #04caff;
                    height: 20px;
                    cursor:pointer;
                    text-align: center;
                    color:#fff;}

                #llama-games {display:none;
                              width: 33px;
                              font-size: 11px;
                              flex: none;
                              z-index: 9;
                              position: absolute;
                              top: 99px;
                              right: 0px;}

                .llama-headerCollapsed #llama-games {
                    top:-1px;
                    right:36px;
                    z-index:10;
                }


                #llama-gamesGear > div {
                    background-color: #111111;
                    background-image: url(https://i.ibb.co/FXrx1X9/Video-Game-Controller-Icon-IDV-edit-green-svg.png);
                                          background-position: top center;
                                          background-position-y: -6px;
                                          background-size: 27px;
                                          background-repeat: no-repeat;
                                          border: 1px solid #313131;
                                          height: 24px;
                                          border-bottom-left-radius: 15px;
                                          border-bottom-right-radius: 15px;
                                          /* border-left: 0px; */
                                          text-align: center;
                                          font-weight: bold;
                                          color: #C1C1C1;
                                          line-height: 20px;
                                          font-size: 13px;;}

                #llama-gamesGear > div:hover {
                    background-color: #04caff;
                    height: 20px;
                    cursor:pointer;
                    text-align: center;
                    color:#fff;}

                #llama-colors {
                    width: 70px;
                    height: 300px;
                    transition: all .4s ease-in-out;
                    animation: ease-to-bottom-21px .2s ease 0s 1;
                    /*max-height: 10%;*/
                    font-size: 11px;
                    flex: none;
                    overflow: hidden;
                    z-index: 8;
                    position: absolute;
                    top: 26px;
                    left:1px;

                    /*background-color: #111111;*/
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                    /*border: 1px solid #313131;*/

                    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);*/
                }

                #llama-gameslist {
                    width: 350px;
                    height: 620px;
                    transition: all .4s ease-in-out;
                    animation: ease-to-bottom-21px .2s ease 0s 1;
                    /* max-height: 10%; */
                    font-size: 11px;
                    flex: none;
                    overflow: hidden;
                    z-index: 8;
                    position: absolute;
                    top: 24px;
                    right: 5px;resize:vertical;
                    background-color: #191919;
                    border: 2px solid #c1c1c17d;
                    border-radius: 10px;
                    background-position: center center;
                    background-image: url(https://anceldesigns.000webhostapp.com/img/arcade2.jpg);}
                                          .footer_wrapper {background-color:#fff;}
                #llama-gameslist > iframe {
                    height:600px;
                    width:350px;}

                @media screen and (max-width: 1000px) {
                    #llama-settings {
                        right: 37px!important;
                        top: -20px;}

                    #llama-settings.llama-open {
                        top: 6px;}

                    #llama-settingsGear {
                        font-size: 52px!important;}

                    #room-header-gifts-items {
                        padding: 0 11px;
                        border-radius: 12px;
                        background-color: #2a2a2a;
                        font-size: 0;
                        text-align: center;
                        white-space: nowrap;}
                }

                @media screen and (max-width: 600px) {
                    #llama-settings {
                        right: -4px!important;
                        top: 19px;}
                }

                #llama-settings:hover {
                    overflow: visible;}

                #llama-settings-mentions .inputcontainer {
                    position: relative;
                    left: 3px;}

                #llama-settingsGear {
                    font-size: 40px;
                    color: #53b6ef;
                    float: right;}

                #llama-settingsGear:hover {
                    cursor: pointer;
                    color: #7ccefe;}

                .llama-open #llama-settingsGear {
                    background: none;
                    border-bottom-right-radius: 15px;
                    border-top-right-radius: 15px;
                    border: #53b6ef 0px solid;
                    border-left: 0;
                }

                .llama-open #llama-settingsGear span img{
                    fill: red;}
                /*transition: all .2s linear;*/}

            #llama-settingsGear span {
                display: block;
                transition: transform 0.4s ease-in-out;}

            #llama-settingsBox.hidden {
                animation: ease-to-right .2s ease 0s 1;
                display: visible;
                /*position: relative; right: -1000px;*/}

            /*** Inline with header ***/
            .default-theme #llama-settingsBox {
                background: #fff;
                color: #000;
            }
            .default-theme #llama-settings #title,
                .default-theme #llama-settings .label{
                    color: #000;
                }
            #llama-settingsBox {
                border-bottom-left-radius: 15px;
                border-top-left-radius: 15px;
                background: var(--llamatheme-bgcolor);
                padding: 0px 10px 0px 10px;
                float: left;
                border: var(--llamatheme-bordercolor) 1px solid;
                border-radius: 5px;
                animation: ease-to-left .2s ease 0s 1;
                right: 0;
                top: 0px !important;
                margin-right: 10px;
                margin-top: 10px;
                box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
            }

            #llama-settingsGear {
                display: table;}

            #llama-settingsGear span {
                display: table-cell;
                vertical-align: middle;}
            ------

            /*** ******RIGHT SIDE*******   ***/

            #llama-settings .right {
                position: absolute;
                left: 189px;}

            #llama-settings .right .label {
                margin-left: 22px;}

            #llama-settings .right .head {
                position: relative;
                top: -10px;
                left: -6px;
                width: 110%;
                color: #000;
                background-color: #fff;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                text-transform: uppercase;
                text-align: center;
                font-weight: bold;}

            #llama-settings-maxcamposition { top: 54px; }
            #llama-settings-borderlesscams { top: 67px; }
            #llama-settings-miniyt:hover {
                background-color: var(--llamatheme-cambgcolor);
                border-color: var(--llamatheme-cambgcolor);
            }
            #llama-settings-miniyt {
                top: 100px;
                left: 162px;
                z-index: 2;
                background-color: var(--llamatheme-bordercolor);
                width: 25px;height:25px;
                color: #fff;
                border-bottom-right-radius: 10px;}
            #llama-settings-miniyt > span > img {position: relative;
                                                 top: 9px;
                                                 left: -6px;}
            .llama-headerCollapsed #llama-settings-miniyt {
                top:-1px;
                right:36px;
                left: 210px;border-bottom-left-radius:10px}
            .llama-sidemenuCollapsed #llama-settings-miniyt {
                top:-1px;
                right:36px;
                left: 0px;}

            .llama-sidemenuCollapsed.llama-headerCollapsed #llama-settings-miniyt {
                left: 33px;}


            /***------------------------------------PINKKK------------------------------------***/
            #llama-settings-pinkmode {
                top: 4px !important;
                position: relative;}

            /***------------------------------------GREENNN------------------------------------***/
            #llama-settings-greenmode {
                position:absolute;
                top: 22px !important;}

            /***------------------------------------BLUEEE------------------------------------***/
            #llama-settings-bluemode {
                position:absolute;
                top: 39px !important;}

            /***------------------------------------MAUVEEE------------------------------------***/
            #llama-settings-mauvemode {
                position:absolute;
                top: 56px !important;}

            /***------------------------------------ORANGEEE------------------------------------***/
            #llama-settings-orangemode {
                position:absolute;
                top: 73px !important;}

            /***------------------------------------REDDD------------------------------------***/
            #llama-settings-redmode {
                position:absolute;
                top: 90px !important;}

            /***------------------------------------DARKPURPLEEE------------------------------------***/
            #llama-settings-purplemode {
                position:absolute;
                top: 107px !important;}

            /***------------------------------------BLACKKKK------------------------------------***/
            #llama-settings-blackmode {
                position:absolute;
                top: 123px !important;}

            /***------------------------------------TRUEBLACKKKK------------------------------------***/
            #llama-settings-trueblackmode {
                position:absolute;
                top: 140px !important;}

            /***------------------------------------DEFAULTTT------------------------------------***/
            #llama-settings-defaultmode {
                position:absolute;
                top: 157px !important;}

            /***------------------------------------WEEDDD------------------------------------***/
            #llama-settings-weedmode {
                position:absolute;
                top: 176px !important;}

            /***------------------------------------SMASHBROSSS------------------------------------***/
            #llama-settings-smashbrosmode {
                position:absolute;
                top: 214px !important;}
            /***------------------------------------SPLATOONNN------------------------------------***/
            #llama-settings-splatoonmode {
                position:absolute;
                top: 255px !important;}

            #llama-settings-featuredmode {
                position:absolute;
                left: 0px !important;
                top:30px !important;
                background-color: #04caff;
                width: 100%;
                text-align: center;
                font-weight:bold;}

            /* The container */
            .llama-color-container {
                display: block;
                position: relative;
                cursor: pointer;
                font-size: 22px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;}

            /* Hide the browser's default checkbox */
            #llama-settings-blackmode > label > input[type="checkbox"],
                #llama-settings-trueblackmode > label > input[type="checkbox"],
                #llama-settings-pinkmode > label > input[type="checkbox"],
                #llama-settings-greenmode > label > input[type="checkbox"],
                #llama-settings-bluemode > label > input[type="checkbox"],
                #llama-settings-orangemode > label > input[type="checkbox"],
                #llama-settings-redmode > label > input[type="checkbox"],
                #llama-settings-weedmode > label > input[type="checkbox"],
                #llama-settings-smashbrosmode > label > input[type="checkbox"],
                #llama-settings-purplemode > label > input[type="checkbox"],
                #llama-settings-mauvemode > label > input[type="checkbox"],
                #llama-settings-defaultmode > label > input[type="checkbox"],
                #llama-settings-splatoonmode > label > input[type="checkbox"]   {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;}

            /* Create a custom checkbox */
            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 14px;
                width: 15px;
                background-color: transparent;
                border-radius:3px;}
            .checkmark .feature1:hover {background-color:#00ff00;}


            /* On mouse-over, add a grey background color */
            .llama-color-container:hover input ~ .checkmark {
                background-color:  transparent;
                border:1px solid #FFFFFF;
                border-top-right-radius: 100px;
                border-bottom-right-radius: 100px;
                border-left:0px;
                width:25px;
            }
            .feature .llama-color-container:hover input ~ .checkmark {
                background-color:  transparent;
                border:1px solid #00ff00;
                border-top-right-radius: 100px;
                border-bottom-right-radius: 100px;
                border-left:0px;
                width:20px;
            }

            /* When the checkbox is checked, add a blue background */
            .llama-color-container input:checked ~ .checkmark {
                background-color: transparent;
                /*border: 0px solid #FFFFFF;*/
                border-top-right-radius: 100px;
                border-bottom-right-radius: 100px;
                border-left: 0px;
                width:25px;}

            /* Create the checkmark/indicator (hidden when not checked) */
            .checkmark:after {
                content: "";
                position: absolute;
                display: none;}

            /* Show the checkmark when checked */
            .llama-color-container input:checked ~ .checkmark:after {
                /*display: block;*/}

            /* Style the checkmark/indicator */
            #llama-settings-defaultmode > label > span.checkmark:after,
                #llama-settings-mauvemode > label > span.checkmark:after,
                    #llama-settings-purplemode > label > span.checkmark:after,
                        #llama-settings-bluemode > label > span.checkmark:after,
                            #llama-settings-greenmode > label > span.checkmark:after,
                                #llama-settings-orangemode > label > span.checkmark:after,
                                    #llama-settings-redmode > label > span.checkmark:after,
                                        #llama-settings-smashbrosmode > label > span.checkmark:after,
                                            #llama-settings-pinkmode > label > span.checkmark:after,
                                                #llama-settings-whitemode > label > span.checkmark:after,
                                                    #llama-settings-splatoonmode > label > span.checkmark:after {
                                                        left: 8px;
                                                        top: 1px;
                                                        width: 3px;
                                                        height: 8px;
                                                        border: solid #ffffff;
                                                        border-width: 0 3px 3px 0;
                                                        -webkit-transform: rotate(45deg);
                                                        -ms-transform: rotate(45deg);
                                                        transform: rotate(45deg);}

            #llama-settings-weedmode > label > span.checkmark:after {
                left: 44px;
                top: -5px;
                width: 3px;
                height: 8px;
                border: solid #ffffff;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);}

            label {
                border:0px solid #ccc;
                padding:0px;
                display:block;}

            label:hover {
                background:#53b6ef;
                border-radius:5px;
                cursor:pointer;}

            #modes {
                padding: 5px;
                background-color: #111111;
                border: #ffffff 1px solid;
                border-radius: 10px;
                box-shadow: 0 4px 8px 0 rgba(255,255,255,0.27), 0 6px 20px 0 rgba(255,255,255,0.27);}

            .llama-pinkmode #modes {
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}

            .llama-greenmode #modes {
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}

            .llama-bluemode #modes {
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}

            #llama-settings .label{
                color:#ffffff;
                position: relative;
                top: -2px;}

            .llama-whitemode #llama-settings .label{
                color:#000000;
            }

            #llama-settings .info{
                margin-left: 3px;
                color: #0d94e3;
                font-weight: bold;
                font-family: Arial;
                border: #0d94e3 1px solid;
                border-radius: 16px;
                height: 1em;
                width: 1em;
                text-align: center;
                display: inline-block;}

            #llama-settings .info:hover:after{
                font-weight: normal;
                padding: 4px 7px 4px 7px;
                border-radius: 7px;
                color: white;
                background: #61787f;
                content: attr(data-title);
                display: inline-block;
                position: absolute;
                top: 1px;
                left: 0;
                z-index: 9;}

            /*#llama-settings .label:hover:before{
                    border: solid;
                    border-color: #61787f transparent;
                    border-width: 0px 6px 6px 6px;
                    top: 10px;
                    content: "";
                    left: 8%;
                    position: relative;
                    display: inline-block;}*/

            #llama-settings a:visited, #llama-settings a:link {
                text-decoration: none;
                color: inherit;}

            #llama-settings a:hover {
                color: #53b6ef;}

            #room-header.default-theme {
                background-color: #f6f6f6 !important;
            }

            #room-header {
                z-index:9;
                height: 100px;
                max-height: unset;
                min-height: unset;
                transition: all .4s ease-in-out;
                background-color: var(--llamatheme-bgcolor);
                border-bottom: 1px solid var(--llamatheme-bordercolor);
            }

            #room-header {
                background-position: center center;
                background-image: var(--llamatheme-headerbg);
            }


            #room-header.smashbros-theme {
                background-color: #282828;
                background-position: right center;
                background-size: 240px;
                background-repeat:no-repeat;
            }


            #room-header.splatoon-theme {
                background-color: transparent;
                border: 0px;
                background-position: right center;
                background-repeat: no-repeat;
                border-top-right-radius: 100px;
                border-bottom-right-radius: 100px;
            }

            #room-header-gifts-items {
                padding: 0 11px;
                border-radius: 12px;
                background-color: transparent;
                font-size: 0;
                text-align: center;
                white-space: nowrap;}

            #room-header-gifts-items > a > img {
                height: 75%;
                width: 75%;
                border-radius: 50px;
                border: 4px solid #313131;}

            #room-header.llama-headerCollapsed {

                height: 0px;
                margin-top: -10px;}

            #room-header.llama-headerCollapsed #room-header-avatar,
                #room-header.llama-headerCollapsed #room-header-info,
                    #room-header.llama-headerCollapsed #room-header-gifts-buttons,
                        #room-header.llama-headerCollapsed #room-header-gifts
            {
                display: none;}


            #room-header.llama-headerCollapsed:hover {
                /*	height: 25px;*/}

            @media screen and (max-width: 600px) {

                #room-header {
                    min-height: 0px !important;
                    max-height: 0px !important;    height: 0px !important;
                }
            }

            #room-header-info {
                padding: 0;
                color: var(--llamatheme-textcolor);}

            #room-header-info span > svg > path,
                #room-header-info > span:nth-child(3) > svg > circle {fill:var(--llamatheme-bordercolor) !important;}

            #room-header-info span > svg > circle {stroke:var(--llamatheme-bordercolor) !important;}

            #room-header-info > h1 {
                color: var(--llamatheme-textcolor);
                text-transform: uppercase;}

            #room-header-info > h1:after {
                visibility: hidden;
                hidden: none;}

            #room-header-info-text:after{
                visibility: hidden;
                hidden: none;}

            #room-header-info-text {
                height: auto;}

            @media screen and (max-width: 600px) {
                #room-header-info-text {
                    height: inherit;}
            }

            #room-header-avatar {
                margin: 2px 10px 0 35px;
                height: 90px;
                min-width: 90px;
                max-width: 90px;
                transition: all .5s linear;}

            .llama-headerCollapsed:hover #room-header-avatar:hover {
                z-index: 9;}

            #room-header-gifts {
                padding: 10px 10px;}

            #room-header-avatar:hover {
                border-radius: unset;}

            .llama-headerCollapsed #llama-settingsGear {
                font-size: 33px;}

            .llama-headerCollapsed #llama-settings > div {
                height: fit-content;}

            #room-header-avatar > img {left:-22px;}

            .llama-headerCollapsed #llama-settingsBox {
                border-width: 1px;
                border-radius: 7px;
                border-top-right-radius: 0;
                padding-bottom: 7px;}

            .llama-headerCollapsed #llama-settings {
                top: 0px;
                right: 0;}
                `);
            }
            if ('llamaVideolistCSS' != true) {
                var llamaVideolistCSS = (`
                    #videolist.llama-sidemenuCollapsed {
                    width: 100%;}
            .video > div > .blured  {opacity:0 !important; visibility: hidden !important;}
            .video > div > video  {filter:none !important;}

            #videos-footer {
                display: flex;
                flex-direction: row;
                align-items: stretch;
                height: 0px;
                min-height: 0px;
                width: 170px;
                position: fixed;
                bottom: 0;
                left: 10px !important;
                padding: 0 30px 0px;
                box-sizing: border-box;
                font-size: 0;
                z-index: 3;
                left: auto;
                background-color:#111111;}

            #videos-footer.llama-sidemenuCollapsed{
                position: relative;
                bottom: 0;
                right: 50px;}

            .llama-sidemenuCollapsed#videos-footer{
                position: relative;
                bottom: 0;
                right: 50px;}

            #youtube.video:after {
                border: none;}

            .video:after {
                content: '';
                position: absolute;
                display: block;
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
                border: 5px solid #111;
                border-radius: 10px;
                box-sizing: border-box;
                pointer-events: none;}

            #video::after {
                border: 5px solid #111;}

            #video:after {
                border: 5px solid #111;}

            #videos > .video {
                position: relative;
                width: 100%;
                padding: 5px;
                box-sizing: border-box;
                font-size: 0;
                overflow: hidden;
                background-color: #ffffff !important;}

            .video > div > iframe {
                width:100%;}

            #videos-header {
                height: 10px;
                min-height: 10px;
                background-color: transparent;}

            #videos-content {
                background-color: transparent;}

            @media screen and (max-width: 600px) {
                #submenu-icons > div {
                    width: 32% !important;
                    position: fixed !important;
                    top: -3px !important;
                    left: 4px !important;}
                #videos-footer-broadcast {display:none !important;}
                #videos-footer-youtube {
                }

                #videos-footer-broadcast {display:none;}
                #videos-footer-submenu {opacity: 1 !important;
                                        visibility: visible !important;background-color: transparent !important;}

                #videos-footer-submenu > span {opacity: 0 !important;
                                               visibility: hidden !important;    }
            }

        }

        #videos-footer-youtube {
            background-color: green !important;
            background-size: 36% !important;
        }

        #videos-footer-youtube {
            background-color: red;
            background-position: top center;
            background-size: 36%;
            background-repeat: no-repeat;
            position: relative;
            left: -20px;
            top: -2px;
        }

        #videos-footer-youtube > svg, #videos-footer-soundcloud > svg {
            vertical-align: middle;
            display:none;}

        #videos-footer-push-to-talk > svg {
            vertical-align: middle;
            pointer-events: none;
            display:none;}

        #videos-footer-youtube, #videos-footer-soundcloud {
            height: 42px;
            width: 10px !important;
            min-width: 115px !important;
            margin-right: -63px !important;
            margin-top: -150px;
            border-radius: 11px;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            overflow: hidden;
            transition: .2s;}

        .llama-sidemenuCollapsed #videos-footer {
            position: fixed;
            top: 205px;}
        .llama-sidemenuCollapsed #videos-footer-push-to-talk {    position: fixed !important;
                                                              bottom: 22px !important;
                                                              right: 7px !important;
                                                              width: 60px !important;
                                                              min-width: 10px !important;
                                                              height: 45px !important;
                                                              top:unset !important;
                                                              border-top-left-radius: 11px !important;
                                                              border-top-right-radius: 11px !important;
                                                             }

        .llama-sidemenuCollapsed #videos-footer-broadcast {
            position: fixed;
            bottom: 1px;
            right: 210px;
            border-top-right-radius: 0px;
            border-bottom-left-radius: 5px;
            top: unset;
            left: unset;
            width: 120px !important;
            min-width: 10px !important;
            height: 18px;
            font-size: 12px;
            line-height: 20px;
        }
        .llama-chatbelow #videos-footer-youtube {
            display:none;
        }
        .llama-sidemenuCollapsed #videos-footer-youtube {
            position: fixed;
            bottom: 31px;
            right: 405px;
            border-top-right-radius: 0px;
            top: unset;
            left: unset;
            width: 30px !important;
            min-width: 10px !important;
            height: 30px;
            background-image: url(https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/play-icon-18-256.png);
                                  background-position: top center;
                                  background-position: 1px;
                                  background-size: 30px;
                                  background-repeat: no-repeat;}

        #videos-footer-push-to-talk {
            height: 55px;
            margin-top: 4px;
            background-image: url(https://www.iconpacks.net/icons/1/free-microphone-icon-342-thumb.png);
                                  background-position: center center;
                                  background-size: 35px 35px;
                                  background-repeat: no-repeat;
                                  }

        #videos-footer-push-to-talk.llama-sidemenuCollapsed {
            height: 55px;
            margin-top: -14px;}

        #videos-footer-broadcast-wrapper.llama-sidemenuCollapsed {
            position: relative;
            right: 10px;}

        #videos-footer-broadcast-wrapper {
            position: relative;
            right: 90px;
            margin-top: -105px;
            display: unset;
            flex-direction: row;
            align-items: unset;
            width: unset;
            padding-left: 0px !important;}

        #videos-footer-broadcast-wrapper > #videos-footer-submenu-button {
            height: 15px;
            margin-bottom: 0px;
            background-color: #328332;
            position: absolute;
            top: -15px;
            left: -9px;
            display: block;
            width: 20px;
            min-width: 10px;
            border-radius: 5px 5px 0px 0px;
            box-sizing: border-box;
            cursor: pointer;
            transition: .2s;}

        #videos-footer-submenu {
            position: absolute;
            width: 250px;
            bottom: 100px;
            left: 150px;
            right: 0px;
            padding: 7px;
            border-radius: 4px;
            background-color: #fff;
            font-size: 14px;
            color: #000;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .09);
            opacity: 0;
            visibility: hidden;
            z-index: 2;
            transition: .2s;}

        #videos-footer-submenu:before, #videos-footer-submenu:after {
            content: '';
            position: absolute;
            display: block;
            height: 0;
            width: 0;
            right: unset;
            bottom: unset;
            border-width: 7px 7px 0 7px;
            border-style: solid;
            border-color: rgba(0, 0, 0, .06) transparent;}

        #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before {
            content: '';
            position: absolute;
            display: block;
            height: 0;
            width: 0;
            top: 4px;
            right: 3px;
            border-width: 0 5px 6px;
            border-style: solid;
            border-color: #fff transparent;
            opacity: 1;
            visibility: visible;
            transition: .2s;}

        #videos-footer-broadcast {
            position: relative;
            display: block;
            right: 5px;
            height: 39px;
            min-width: 162px;
            max-width: 100%;
            padding-left: 0px;
            border-radius: 0px 5px 5px 0px;
            box-sizing: unset;
            background-color: #13a832;
            font-size: 15px;
            font-weight: 550;
            color: #fff;
            text-align: center;
            line-height: 38px;
            cursor: pointer;
            text-transform: uppercase;
            transition: .2s;}

        #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button {
            z-index:-1;}

        #videos-footer-broadcast-wrapper > .waiting {
            position: absolute;
            width: 125px;
            height: 55px;
            top: 45px;
            bottom: 0;
            left: 10px;
            right: 0;
            border-radius: 11px;
            background-color: #38cd57;
            opacity: 0;
            visibility: hidden;
            transition: .2s;}

        #videos-footer-youtube.hidden, #videos-footer-soundcloud.hidden {
            width: 0;
            min-width: 0;
            margin-right: 0;
            visibility: hidden;}
    }

    #Fvideolist * {
        width: 75%!important;
        display: contents;
        float: right;
        flex-direction: column;}

    #Fvideos {
        flex-direction: unset;
        flex-wrap: unset;}

    #videos-header > span {
        line-height: initial;
        position: relative;
        top: 1px;
        background: none;}

    #videos-header > span > svg {
        height: 16px;
        padding: 0;}

    .videos-header-volume {
        position: absolute;
        height: 128px;
        width: 24px;
        top: 2px;
        left: 50%;
        margin-left: -14px;
        margin-top: 15px;
        border-width: 50px 22px 22px;
        border-style: solid;
        border-color: #111;
        border-radius: 5px;
        box-shadow: 10px 1px 4px 0 rgba(0, 0, 0, .09);
        opacity: 0;
        visibility: hidden;
        transition: .2s;}

    .videos-header-volume-level > div {
        position: absolute;
        display: block;
        height: 12px;
        width: 24px;
        top: 0px;
        left: 0px;
        border-radius: 0;
        background-color:#313131;}

    .videos-header-volume:before {
        background-color: #111;
    }
	`
                );
            }
            if ('llamaChatlistCSS' != true) {
                var llamaChatlistCSS = (`
                    #chatlist {margin-top:-25px;}
            #chatlist.llama-orangemode > div > span {
                color:#000000;}

            #chatlist.llama-redmode > div > span {
                color:#000000;}

            #chatlist > div > span {
                padding-left: 10px;}

            #chatlist > #header {
                top: 3px;
                height: auto;}

            /*** --- this block is in chatlistCSS & userlistCSS --- ***/

            .list-item > span > img {
                right: 13px;
                left: auto;}

            .list-item > span[data-status]:before {
                left: auto;
                right: 0;}

            .list-item > span > span {
                background: none!important;
                box-shadow: none!important;}

            /*** ---                                        --- ***/

            .close-instant > path {
                fill: white;}

            .list-item > span > span { /* gift and close buttons */
                right: 16px;}

            .list-item > span:hover > span { /* gift and close buttons */
                right: 16px;
                background: none!important;}

            #chatlist > div > span,
                #chatlist > #header,
                #chatlist > div.list-item {
                    color: var(--llamatheme-textcolor);
                }
                `);
            }
            if ('llamaUserlistCSS' != true) {
                var llamaUserlistCSS = (`

#userlist.splatoon-theme > div > span {
    border-color: var(--llamatheme-bordercolor);
    background-image: url('https://i.ibb.co/FWFnhc4/messagebg.png');
    border-radius: 14px;
    margin-top: 2px;
    color: var(--featurethreemode-textcolor);
    font-weight: bold;
    text-shadow: 1px 2px #2b6600;
}
<style>
#userlist.splatoon-theme > div > span {
    width: 98%;
}

#userlist > div > span {
	padding-left: 2px;
	padding-right: 2px;
    position: relative;
    display: inline-block;
    height: 30px;
    width: 100%;
    border-radius: 0 0 0 0;
    box-sizing: border-box;
    font-size: 14px;
    color: var(--llamatheme-textcolor);
    line-height: 30px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    transition: .2s;}

.llama-sidemenuCollapsed #button-banlist {
    left: -100px;
    width: 10px;}

.list-item > span > span {
	right: auto;
	padding: 0 5px;}

.list-item > span > .nickname {
	padding-right: 3px;}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/

.list-item > span > img {
	right: 13px;
	left: auto;}

.list-item > span[data-status]:before {
	left: auto;
	right: 0;}

.list-item > span > span {
	background: none;
	box-shadow: none;}

		/*** ---                                        --- ***/

.list-item > span > span[data-moderator="1"]:before {
	filter: hue-rotate(226deg) saturate(4000%);}

#userlist > #header {
	top: auto;
	height: auto;}


 #userlist.default-theme > #header > span {
    background-color: #202628;
    color: #FFF;
}
#userlist > #header > span,
#chatlist > #header > span
{
    display: block;
    border-color: var(--llamatheme-bordercolor);
    background-color: var(--llamatheme-bordercolor);
    color: var(--llamatheme-textcolor);
    text-align: center;
    top: 4px;}

#chatlist > #header {
    color: #111111;}

#button-banlist {
top: 1px;
	padding: 0 12px;
    text-indent: -9999px;
    background-image: url(https://www.freeiconspng.com/uploads/red-x-png-4.png);
    background-size: 15px;
    background-position: center center;
    background-repeat: no-repeat;
    white-space: nowrap;
    background-color: var(--llamatheme-cambgcolor);}

.list-item > span:hover {
    background-color: var(--llamatheme-cambgcolor);
    }


.list-item > span:hover > span {
    background-color:var(--llamatheme-cambgcolor);
    box-shadow: 0 0 0px 0px transparent;}

.list-item > span[data-status]:before {
    left: auto;
    right: 0;
    border-radius:10px;}

.list-item > span > span[data-cam="1"]:after
{   background-image: url(https://i.ibb.co/RjLdY26/63629-3.png) !important;
    background-size: 10px;}
	</style>

                `);
            }
            if ('llamaBodyCSS' != true) {
                var llamaBodyCSS = (`

body {
    overflow: hidden;
    background-color:var(--llamatheme-cambgcolor);
    background-image: var(--llamatheme-roombg);
    background-position: center center;
    background-size: cover;
}

#nav-static-wrapper {
    width: 2px;
    opacity: .7;
    display:none;
    visibility:hidden;}

#nav-static-wrapper {
    width: 2px;
    opacity: .7;
    display:none;
    visibility:hidden;}

#nav-static-wrapper.llama-sidemenuCollapsed{
    display:none;
    visibility:hidden;}

@media screen and (max-width: 1000px) {
#nav-static-wrapper {
    width: 82px;
    opacity: 1;}
}


#menu-icon {
    transition: 1s;
    display:none;}

.llama-sidemenuCollapsed #menu-icon {
    z-index: -1;
    opacity: 0;
    display:none;}

.llama-sidemenuCollapsed #header-user {
    display: none;}

@media screen and (max-width: 1000px) {
#header-user {
    left: 21px;}

#videos-footer-youtube.llama-sidemenuCollapsed{
    padding: 0px;
    left:100px;
    background-color:#f07629;}


body.llama-changefont {
    font-family: sans-serif;}

#header-user {
    left: 62px;}

@media screen and (max-width: 1000px) {
#header-user {
    left: 21px;}
}

@media screen and (max-width: 600px) {
#header-user {
    left: auto;
    right: 54px;}
}

@media screen and (min-width: 1000px) {
#menu-icon:hover {
    opacity: 1;}

#menu-icon {
    top: 4px;
    left: 19px;
    height: 12px;
    width: 109px;
    font-size: 10px;
    background: #04caff;
    border-radius: 6px;
    opacity: .8;
    visibility: hidden;
    display:none;}

#menu-icon:after {
    position: absolute;
    top: 3px;
    left: 51px;
    content: "";
    height: 7px;
    width: 7px;
    border-width: 2px 2px 0px 0px;
    border-style: solid;
    border-color: #fff;
    box-sizing: border-box;
    transform: rotate(45deg);
    transition: .2s;
    visibility: hidden;}

#menu-icon:hover:after {
    border-width: 0px 0px 2px 2px;
    visibility: hidden;}

#menu-icon > svg {
    opacity: 0;
    visibility: hidden;}
}

#menu-icon {
    visibility: hidden;
    display:none;}
	</style>

                `);
            }
            if ('llamaMessageCSS' != true) {
                var llamaMessageCSS = (`

.llama-nightmode { color: var(--nightmode-textcolor);}

.llama-nightmode.blacknight { color: white;}

.llama-mention-message { color: red !important; }

.llama-nightmode.llama-mention-message { color: #e44a3f; }
.llama-nightmode.message.system,
.llama-nightmode #chat-content > .message.system {
	background-color: #313c3f;
	color: #677174;}

.llama-nightmode.blacknight.message.system,
.llama-nightmode.blacknight #chat-content > .message.system {
	background-color: transparent;
	color: #4d4d4d;}


.message.system {
    font-size: 12px;
    font-weight: 600;
    color: #8f999c;
    left: 0px;}

.o
		.llama-mention-message { color: red; }
.on-white-scroll {
    padding-left: 16px;
    box-sizing: border-box;
    overflow-x: hidden;
    }


.message {
    font-size: 14px;
    color: var(--llamatheme-textcolor);
    white-space: pre-line;
    word-wrap: break-word;
    position: relative;
    right: 12px;
    font-weight:bold;
    top: 3px;}
                `);
            }
            if ('llamaChatlogCSS' != true) {
                var llamaChatlogCSS = (llamaMessageCSS + `
div.llama-systemMsg {
    padding-top: 0!important;
    margin-bottom: 5px;
    margin-right: 10px;
    padding-bottom: 9px;
    color: var(--llamatheme-textcolor) !important;
    background-color: var(--llamatheme-lightbgcolor);
    border: 1px solid var(--llamatheme-lightbgcolor);
    border-radius: 20px;
}
/* HERE IS THE OTHER GRABBER */
#llama-chat-grabber {
    position: absolute;
    top: 88px;
    right: 50%;tinychat-chatlog *
    background: white;
    width: 60px;
    height: 20px;
    border: #313131 1px solid;
    border-radius: 19px;
    text-align: center;
    color: #b4c1c5;
    cursor: pointer;
    transition: all .4s ease-in-out;
    background-color:#111111;}

.llama-chatCollapsed #llama-chat-grabber {
    top: 0px;
    background: #111111;
    border-top: 0;
    z-index: 9;
    border-radius: 11px;
    line-height: 15px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 15px;}

.llama-chatCollapsed:hover #llama-chat-grabber {
    height: 29px;
    line-height: 43px;}

:host, #chat-wrapper.llama-chatCollapsed {
}

@media screen and (max-width: 600px){

:host, #chat-wrapper, #chat-wider + #chat-wrapper, #chat-wider.active + #chat-wrapper {
    position: relative;
    min-width: 320px;
    top: -8px;
}

#users-icon {

    right:0px !important;

}

}
/* END */

		.message a:first-child,
		.message a:first-child img:first-child {
			transition: .1s;
		}
		.message a:first-child:hover {
			width: 100px!important;
			height: 75px!important;
			z-index: 1000;
		}
		.message a:first-child:hover img:first-child {
			width: 100px;
			height: 79px!important;
		}
#chat-instant .message.common > a > .avatar, #chat-content > .message.common > a > .avatar:hover {border-radius:100%;}
#chat-instant .message.common > a > .avatar, #chat-content > .message.common > .avatar{width:30px;height:30px;}
#chat-instant .message.common > .avatar > div > img, #chat-content > .message.common > .avatar > div > img {border-radius:100%;}

#chat-instant .message.common > a > .status-icon, #chat-content > .message.common > a > .status-icon {
    position: absolute;
    height: 15px;
    width: 15px;
    top: 0px;
    left: 315px;
    padding: 3px;
    border-radius: 100%;
    background-color: #fff;}

#chat-content > .message.system > .content {
    font-size: 12px;
    font-weight: 600;
    color: #00ff00;
    margin:10px;}
@media screen and (max-width: 600px) {
#chat-wrapper.default-theme {border-left:1px solid rgba(0, 0, 0, .1) !important;}

#chat-wrapper {border:0px !important;}
#chat-content > .message.common > .nickname {right:5px !important;}

#users-icon, #input-users:checked ~ #users-icon, #input-menu:checked ~ #input-users ~ #users-icon {left: 17px !important;}
#videos-header-fullscreen {display:none;}
}


#chat-wrapper {
    min-width: 350px;
    border-left: 0px solid rgba(0, 0, 0, .1);
    box-sizing: border-box;
    background-color: var(--llamatheme-cambgcolor);
    transition: .8s;}

#chat-wrapper {
    background-image: var(--llamatheme-chatbg);
    background-position: center center;
    background-blend-mode: overlay;
    background-size: cover;
}

#chat-wrapper.splatoon-theme {
    background-size: unset;
    border-radius: 0px;
    background-color: transparent;
    background-position: 0px 0px;
    background-repeat: repeat-y;
    animation: animatedBackground 10s linear infinite;
    min-width: 346px;
}

@keyframes animatedBackground {
	from { background-position: 0 0; }
	to { background-position: 0 100%; }
}

		/*
#chat-content > .message:hover {
    background: rgba(0, 0, 0, 0.03);
    color: #ffffff;}
		*/

#chat-content > .message.common {
    padding-top: 0!important;
    min-height: 0px!important;
    margin-bottom: 5px;
    margin-right: 10px;
    padding-bottom: 9px;
    color: var(--llamatheme-textcolor) !important;
    background-color: var(--llamatheme-lightbgcolor);
    border: 1px solid var(--llamatheme-lightbgcolor);
    border-radius: 20px;}

#chat-content > .message.system {
    box-sizing: border-box;
    background-color: #0000006b;
    cursor: default;
    border: 1px solid #8f999c;
    color: #8f999c;
    border-radius:24px;
    padding: 0px 0px;}
}

#chat-content.llama-notif-off > .message.system {
    display: none;}

#chat-content.llama-notif-off > .message.system.dontHide {
    display: initial;}

#chat-instant .message.common > a:first-child,
#chat-content > .message.common > a:first-child {
    top: 5px; left: 2px;}

#chat-position #input:before {
    background: none;}

#input {
    position: relative;
    display: block;
    padding-top: 10px;
    margin-right: 25px;
    overflow-wrap: break-word;}
.default-theme #input > textarea {
    border:1px solid var(--llamatheme-bordercolor);
}
#input > textarea{
    overflow-y:auto;
    background-color: var(--llamatheme-cambgcolor);
    border:1px solid var(--llamatheme-lightbgcolor);
    color: var(--llamatheme-textcolor);}

#input:after {
    content: "";
    position: absolute;
    display: block;
    top: 10px;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0px solid #cbcfcf;
    border-radius: 12px;
    box-sizing: border-box;
    pointer-events: none;}

#input > .waiting {
    position: absolute;
    width: auto;
    top: 10px;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 12px;
    background-color: #e9eaea;
    z-index: 1;
    opacity: 0;
    visibility: hidden;
    transition: .2s;}

#chat-position {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    top: 20px;
    left: 10px;
    right: -20px;
    bottom: 19px;}

#chat-wider {
    font-size: 0;
    background-color: var(--llamatheme-cambgcolor);
    border: 1px solid var(--llamatheme-bordercolor);
    cursor: pointer;
    z-index: 1;
    padding-top: 10px;
    color: var(--llamatheme-bordercolor);
    position: absolute;
    top: 47%;}

#chat-wider.active + #chat-wrapper {
    min-width: 0px;}

#chat-wider.active {
    left: -15px;
    border-radius: 10px 0 0 10px;}

#chat-wider:before {
    border-color: transparent var(--llamatheme-bordercolor);
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);}

#chat-wider.active:before {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);}

#chat-wider:hover {
    background: var(--llamatheme-bordercolor);
    color: var(--llamatheme-textcolor);
    cursor: pointer;
    border:0px;}

#chat-instant .message.common > a > .avatar,
#chat-content > .message.common > a > .avatar {
    width:75%;
    height:100%;
    background-color: #666666;
    border-top-left-radius: 100%;
    border-bottom-left-radius: 100%;
    border-top-right-radius: 0%;
    border-bottom-right-radius: 0%;
    overflow: hidden;}

#abovefiller{
    border-radius: unset;}

#timestamp {
    font-size: 11px;
    color: #999999;
    float: right;
    position: absolute;
    right: 0;
    padding-top: 3px;
    padding-right: 20px;
    font-weight: 600;}

#chat-content > .message.common > .nickname {
    overflow: initial;
    line-height: initial;
    position: relative;
    right: 15px;
    color: #00abfa;}

#chat-content div.message.common:last-of-type {
    margin-bottom: 10px;
    margin-right: 10px;}

#chat-instant-button.llama-loading {
    border: 0;
    font-size: x-large;
    animation: spin .5s linear infinite;}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }}

#llama-chatlogDisplay {
    display: none;
    position: fixed;
    top: 121px;
    left: 177px;
    width: 90%;
    height: 80%;
    z-index: 7;
    cursor: default;}

#llama-chatlogDisplay.show {
    display: unset; }

#llama-chatlogDisplay * {
    float: left;
    height: 50%;}

#llama-chatlogDisplay textarea {
    transition: .2s;
    opacity: 0;
    border-radius: 6px;
    width: 90%;}

#llama-chatlogDisplay textarea.show {
    opacity: 1;}

#llama-chatlogDisplay textarea.show {
    background-color:#111111;
    color:#17ff00;}

#llama-chatlogDisplay #close {
    opacity: 0;
    transition: .2s;
    width: 30px;
    background: #313131;
    height: 30px;
    border-radius: 10px;
    position: relative;
    color: white;
    top: -1%;
left:-21px;
    vertical-align: middle;
    font-size: 22px;
    text-align: center;
    padding-top: 0px;
    cursor: pointer;}

#llama-chatlogDisplay #close:hover {
    background: #990000;}

#llama-chatlogDisplay #close.show {
    opacity: 1;
border:1px solid #990000;}

#llama-chatlogButtons {
    position: absolute;
    top: 2px;
    left: 6px;
    font: 15px monospace;
    /*display: none;*/
    }

.llama-chatlogBut {
    padding: 2px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border: silver 0px solid;
    color: silver;
    transition: .3s;
    width: 10px;
    height: 10px;
    overflow: hidden;
    cursor: pointer;
    opacity: 1;
    float: left;}

.llama-chatlogBut:hover {
    color: black;
    border-color: #17ff00;}

.llama-chatlogBut ~ .llama-chatlogBut {
    margin-left: 2px;}

.llama-chatlogBut .icon {
    width: 10px;}

.llama-chatlogBut .label {
    width: 0;
    opacity: 0;
    overflow: hidden;
    transition: .3s;
    display: block;
    position: relative;
    top: -2px;
    left: 13px;
    font: 11px sans-serif;
    color: black;}

.llama-chatlogBut:hover .label {
    opacity: 1;
color: #17ff00;}

.llama-chatboxPM #llama-chatlogSave {
    opacity: 0;
    z-index: -5;
		}
#llama-chatlogSave .icon {
    /* transform: scaleY(.6); */
    position: absolute;
    top: -1px;
    left: 4px;}

#llama-chatlogSave .icon svg {
    width: 19px;
    height: 19px;
    position: relative;
    left: -3px;}

#llama-chatlogSave .icon path {
    transform: scale(.08) scaleX(1.2) rotate(180deg);
    fill: #ccc;
    transform-origin: 11px 12px;}

#llama-chatlogSave:hover .icon path {
    fill: #17ff00;
border}

#llama-chatlogSave:hover {
}

#llama-chatlogSave:hover .label {
}

#llama-chatlogView .icon {
    font-size: 10px;
    top: 1px;
    position: absolute;}

#llama-chatlogView:hover {
    color:#17ff00;}
.default-theme #input > textarea::placeholder
{    color:rgba(0, 0, 0, .5);}
#input > textarea::placeholder
{    color:var(--llamatheme-lightbgcolor);}
path {fill: var(--llamatheme-bordercolor) !important;}


	</style>
                `);
            }
            if ('llamaSidemenuCSS' != true) {
                var llamaSidemenuCSS = (`
    #sidemenu {
        min-width: 162px;
        max-width: 162px;
        left: 0px;
        background-color: var(--llamatheme-bgcolor);
        /* 	background-image: url('http://i68.tinypic.com/2rp4ncm.png'); */
        background-position: right top;
        background-size: 100%;
        border-right:1px solid var(--llamatheme-bordercolor);
        transition: all .4s ease-in-out;
        z-index:3;}
#sidemenu-content {
    height: 90%;
    padding-top: 30px;
    box-sizing: border-box;
    padding-left: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    /*background-color: var(--llamatheme-bgcolor);*/
    /* background-image:url('http://i68.tinypic.com/2rp4ncm.png'); */
    background-position: right top;
    background-size: 100%;
    border-right:0px solid;}

#user-info {
    position: absolute;
    height: 80px;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 20px 30px 20px 20px;
    border-top: 1px solid rgba(0, 0, 0, .1);
    box-sizing: border-box;
    background-color: #2a2a2a;
    display: none; visibility:hidden;}

@media screen and (max-width: 1000px) {
#sidemenu {
    left: -188px;transition: all .4s ease-in-out;}
}

#live-directory-wrapper {
    padding: 0;}

#top-buttons-wrapper {
    padding: 0;}

.logged-in #user-info {
    padding: 0;
    height: auto;
    text-align: center;
    visibility: hidden;
    display: none;}

#user-info button {
    opacity: .8;}

#user-info:hover button {
    opacity: 1;}

.logged-in #user-info > a {
    display: none;
    visibility:hidden;}

@media screen and (min-width: 1000px) {
/*---DEFAULT---*/
.default-theme #live-directory {
    background-color: #04caff !important;
    border-color: #04caff !important;
    color: #fff !important;
}

#live-directory {
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    opacity: .8;
    margin-left: 24px;
    width: 150px;
    background-color: var(--llamatheme-cambgcolor);
    border:1px solid var(--llamatheme-bordercolor);
    position: relative;
    top: -25px;}

#upgrade {
    height: 0px;
    line-height: 0px;
    font-size: 13px;
    opacity: .8;}

#live-directory:before {
    height: 8px;
    width: 8px;
    top: 0px;}

#upgrade {
    margin-top: 0px;
    visibility: hidden;
    display: none;}

#live-directory:hover, #upgrade:hover {
    opacity: 1;
    background-color:var(--llamatheme-bordercolor);}
}

#sidemenu.llama-sidemenuCollapsed {
    min-width: 0px;
    max-width: 0px;
    border:0px;}


#llama-sidemenu-grabber {
    position: absolute;
    top: 47%;
    right: 0;
    left: 153px;
    background: var(--llamatheme-cambgcolor);
    color: var(--llamatheme-bordercolor);
    z-index: 3;
    border-radius: 10px;
    border-right: 0px;
    border-bottom: 0px;
    border-top: 0px;
    height: 34px;
    padding-top: 19px;
    width: 16px;
    text-align: center;
    transition: all .4s ease-in-out;
    border-left: var(--llamatheme-bordercolor) 1px solid;}

#llama-sidemenu-grabber:before {
    content: '';
    position: absolute;
    display: block;
    height: 0;
    width: 0;
    top: 50%;
    left: 50%;
    margin: -4px 0 0 -2px;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-color: #cbcfcf;
    transition: .8s;}

#llama-sidemenu-grabber:hover {
    background: var(--llamatheme-bordercolor);
    color: #5c5c5c;
    cursor: pointer;}

.llama-sidemenuCollapsed #llama-sidemenu-grabber{
    background: var(--llamatheme-bgcolor);
    border-radius: 0 10px 10px 0;
    right: -15px;
    left: -4px;}
#llama-sidemenu-grabber:before {border-color: transparent var(--llamatheme-bordercolor);}

#sidemenu.llama-nightmode{
    background: #191919;}

.llama-nightmode #sidemenu-content::-webkit-scrollbar-track {
    background: transparent;}
#sidemenu-content::-webkit-scrollbar-track {
    background: transparent;}

.llama-nightmode #llama-sidemenu-grabber {
    background: #111111;}

.llama-nightmode #llama-sidemenu-grabber:hover {
    background: #333;
    color: #5c5c5c;}

.llama-sidemenuCollapsed #llama-sidemenu-grabber:before {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);}

.llama-nightmode #user-info {
    background: black;}

.llama-nightmode #user-info > button {
    background: #035268;
    color: #aaa;}

.llama-nightmode #user-info > button:hover {
    background: #0080a3;
    color: white;}

.llama-nightmode #sidemenu-content::-webkit-scrollbar-thumb {
    border: 1px solid #191919;
    width:50%;
    background-color: #111;}

.llama-nightmode #sidemenu-content::-webkit-scrollbar {
    width: 3px;}

#sidemenu {
    border-color: var(--llamatheme-bordercolor);
    background-image: var(--llamatheme-userbg);
    background-position: right center;
    background-size: cover;
}

#sidemenu.smashbros-theme {
    background-color: var(--llamatheme-bgcolor);
    background-attachment: fixed;
    background-position:left;
    background-size: 900px;
    background-repeat: no-repeat;
}

#sidemenu.splatoon-theme {
    background-color:transparent;
    border: 0px;
    background-attachment: fixed;
    background-position:left;
    border-radius: 30px;
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    height: 99%;
}

#sidemenu.splatoon-theme #sidemenu-content  {
    background-color:transparent;
}
	</style>
                `);
            }
            if ('llamaVideoModerationCSS' != true) {
                var llamaVideoModerationCSS = (`

#moderatorlist {
    padding-left: 0;
    z-index: 7;
    max-height:22px;}

#moderatorlist:hover {
    position: absolute;
    background: white;
    z-index: 1000;
    width: 300px;
    min-height: 155px;
    flex-direction: column;
    position: absolute;
    background: #111;
    z-index: 1000;
    width: 350px;
    max-height: fit-content!important;
    left: 15px;
    border-radius: 13px;
    border: #fff 1px solid;
    top: 30px;
    left:0px;}

#moderatorlist:after {
    top: 2px;
    right: 1px;}

#moderatorlist:hover #header {
	height: unset;
	top: unset;
    padding-left:0 !important;}

#moderatorlist > #header {
    top: 2px !important;
    width: 100%;
    height:20px;}

#moderatorlist > #header > span > button {
    border-radius:10px;
    width: unset !important;
    height:unset !important;
    background-color: unset;}

#moderatorlist.llama-nightmode > #header > span > button {
    background: var(--nightmodeBlack-bgcolor);}

#moderatorlist.llama-nightmode:hover {
	border-color: #333;}

.video:after{
    border:0px;}

	</style>
                `);
            }
            if ('llamaWebappCSS' != true) {
                var llamaWebappCSS = (`

.input-menu{display:none;}


#room {
    padding: 0;
    padding-left: 80px;}

#room.llama-sidemenuCollapsed {
    margin-left: -161px;
    width: 110%;}



@media screen and (max-width: 1000px) {
:host > #room {
    padding-left: 82px;}
}

@media screen and (max-width: 600px) {
:host > #room {
    padding-left: 0;width: 450px !important;}

#room-content {padding-top:0px !important;}
}

#room-content.llama-chatbelow {
    flex-direction: column !important;
    margin-bottom: -10px !important;}

#oom-header-duh {
    background-color:transparent;
    background-image: var(--llamatheme-roombg);
    background-position: center center;
    background-size: cover;
}
#room-content.smashbros-theme {
    background-position: right center;
}

.llama-nightmode tc-videolist { background: var(--nightmode-bgcolor); }
.llama-nightmode.blacknight tc-videolist { background: transparent; }

	</style>
                `);
            }

            injectCSS();
            injectElements();

            var scrollboxEvent = scrollbox.addEventListener("wheel", userHasScrolled);
            var unreadbubbleEvent = unreadbubble.addEventListener("click", function() {
                autoScrollStatus = true;
            });

            if (userinfoCont.hasAttribute("title")) {
                bodyCSS.classList.add("logged-in");
                sidemenuElem.querySelector("#sidemenu").classList.add("logged-in");
            }
            if (isModerator) {
                userlistElem.querySelector("#userlist").classList.add("llama-mod");
                chatlistElem.querySelector("#chatlist").classList.add("llama-mod");
            }

            //grab GM Values and turn into a settingsQuick[] array
            var settingsQuick = {
                "Autoscroll": (GM_getValue("llama-Autoscroll") == "true" || GM_getValue("llama-Autoscroll") == undefined),
                "MentionsMonitor": (GM_getValue("llama-MentionsMonitor") == "true" || GM_getValue("llama-MentionsMonitor") == undefined),
                "NotificationsOff": (GM_getValue("llama-NotificationsOff") == "true" || GM_getValue("llama-NotificationsOff") == undefined),
                "ChangeFont": (GM_getValue("llama-ChangeFont") == "true" || GM_getValue("llama-ChangeFont") == undefined),
                "MaxedCamLeft": (GM_getValue("llama-MaxedCamLeft") == "true" || GM_getValue("llama-MaxedCamLeft") == undefined),
                "NightMode": (GM_getValue("llama-NightMode") == "true"),
                "BorderlessCams": (GM_getValue("llama-BorderlessCams") == "true" || GM_getValue("llama-BorderlessCams") == undefined),
                "RoundedCams": (GM_getValue("llama-RoundedCams") == "true" || GM_getValue("llama-RoundedCams") == undefined),
                "TransparentChat": (GM_getValue("llama-TransparentChat") == "true" || GM_getValue("llama-TransparentChat") == undefined),
                "ThemeChoice": (GM_getValue("llama-ThemeChoice")),
                "RoomBG": (GM_getValue("llama-RoomBG") == "true" || GM_getValue("llama-RoomBG") == undefined),
                "RoomBGURL": (GM_getValue("llama-RoomBGURL")),
                "miniyt": (GM_getValue("llama-miniyt") == "true"),
                "ChatBelow": (GM_getValue("llama-ChatBelow") == "true"),
            };
            settingsQuick["LlamaTheme"] = true;
            let usersSelectedTheme = settingsQuick["ThemeChoice"];
            if (usersSelectedTheme != undefined) {Toggle_Theme(usersSelectedTheme);} else {Toggle_Theme('default');}

            if (settingsQuick["ChangeFont"]) bodyElem.classList.add("llama-changefont");
            if (settingsQuick["MaxedCamLeft"]) videolistCSS.classList.add("llama-leftcam");
            if (settingsQuick["miniyt"]) miniytToggle(true);
            if (settingsQuick["ChatBelow"]) chatBelowToggle(true);
            if (settingsQuick["BorderlessCams"]) borderlessCamsToggle(true);
            if (settingsQuick["RoundedCams"]) roundCamsToggle(true);

            if (browserFirefox && 1 == 2) {
                titleElem.querySelector("#room-header-info").insertAdjacentHTML("afterend", `
                    <div id="llama-firefoxwarning" class="style-scope tinychat-title" style="font-size: .75em; background: white; color: grey; width: 200px; padding: 5px; line-height: 13px;vertical-align: middle;border: #ddd 1px solid;border-width: 0px 1px 0px 1px;">
                    <div class="style-scope tinychat-title" style="display: table;height: 100%;">
                    <span style="display: table-cell; vertical-align: middle;top: 16%;" class="style-scope tinychat-title">
                    Tinychat Theme requires Chrome or Opera.
                    </span>
                    </div>
                    </div>
            `);
            }

            function waitForSettings() {
                try {
                    settingsVisible = false;
                    if (titleElem.querySelector("#room-header-gifts") != null) {
                        clearInterval(settingsWaitInterval);
                        newCamAdded();
                        newUserAdded();
                        newMessageAdded();
                        setTimeout(messageParserCheckCSS, 3000);

                        giftsElemWidth = titleElem.querySelector("#room-header-gifts").offsetWidth;
                        if (titleElem.querySelector("#room-header-gifts-items") == null) {
                            giftsElemWidth1000 = giftsElemWidth + 45;
                        } else {
                            giftsElemWidth1000 = giftsElemWidth;
                        }
                        if (titleCSS.querySelector("#titleCSS")) {
                            titleCSS.querySelector("#titleCSS").innerHTML += `
                                #llama-settings {
                                    right: ` + giftsElemWidth + `px;
                                }
                            `;
                        }

                        var sidemenuFakeBorder = document.createElement("span");
                        sidemenuFakeBorder.setAttribute("id", "llama-sidemenufakeborder");
                        sidemenuCSS.insertAdjacentElement("beforeend", sidemenuFakeBorder);

                        settingsElem = titleElem.querySelector("#room-header-gifts").insertAdjacentHTML("beforebegin", llamaSettingsCSS);

                        titleElem.getElementById("llama-settingsGear").addEventListener("click", toggleSettingsDisplay);
                        titleElem.getElementById("llama-themesGear").addEventListener("click", toggleThemesDisplay);
                        titleElem.getElementById("llama-gamesGear").addEventListener("click", toggleGamesDisplay);
                        titleElem.getElementById("llama-trans-chat-checkbox").addEventListener("click", toggleTransparentChat);
                        toggleSubSetting()

                        // llama menus
                        var llama_menus = ["general", "theme", "images", "cams"];
                        llama_menus.forEach(function(llama_menu) {
                            titleElem.getElementById("llama_" + llama_menu).addEventListener("click", function() {
                                toggleSubSetting(llama_menu);
                            });
                        });

                        // llama themes
                        var llama_themes = ['pink', 'green', 'blue', 'mauve', 'orange', 'red', 'purple', 'black', 'trueblack', 'default', 'weed', 'smashbros', 'splatoon'];
                        llama_themes.forEach(function(llama_theme) {
                            titleElem.getElementById(llama_theme + "_square").addEventListener("click", function() {
                                Toggle_Theme(llama_theme);
                            });
                            titleElem.querySelector("#llama-settings-" + llama_theme + "mode input").addEventListener("click", function() {
                                Toggle_Theme(llama_theme);
                            });
                            //console.log('AEL THEME:----' + llama_theme)
                        });

                        // llama custom background image
                        titleElem.getElementById("llama-settings-roombg").addEventListener("click", function() {
                            Toggle_Theme("roombg");
                        });
                        titleElem.getElementById("llama_roombg_img").addEventListener("focusout", function() {
                            Toggle_Theme("roombg");
                        });

                        // llama mentions
                        titleElem.querySelector("#llama-settings #llama-settings-mentions button.save").addEventListener("click", function() {
                            mentionsManager("save");
                        });

                        // llama original settings
                        var llama_original_settings = ['borderlesscams', 'miniyt', 'autoscroll', 'mentions', 'notifications', 'changefont', 'chatbelow', 'roundedcams', 'maxcamposition'];
                        llama_original_settings.forEach(function(llama_original_setting) {
                            titleElem.querySelector("#llama-settings-" + llama_original_setting + " input").addEventListener("click", function() {
                                settingsCheckboxUpdate("llama-settings-" + llama_original_setting);
                            });
                            //console.log('AEL ORIG:----' + llama_original_setting)
                        });

                        // llama reloaders
                        mentionsManager("load");
                        settingsCheckboxUpdate();
                        toggleTransparentChat('reload')
                        reloadUserImages();

                        notificationHider();

                    }
                    llamaConsole("> LOAD COMPLETE!")

                } catch (e) {
                    llamaConsole("error waitForSettings: " + e.message);
                }
            }

            function Toggle_Theme(color) {
                var trueblack_bgcolor = "#000000"
                var trueblack_bordercolor = "#0d0d0e"
                var trueblack_lightbgcolor = "#0e0e0e"
                var trueblack_textcolor = "#FFFFFF"
                var trueblack_buttontext = "#2e303a"
                var trueblack_userlist = "#FFFFFF"
                var trueblack_cambgcolor = "#000"
                var darkgreen_bgcolor = "#143848"
                var darkgreen_bordercolor = "#061015"
                var darkgreen_lightbgcolor = "#263233"
                var darkgreen_textcolor = "#FFFFFF"
                var darkgreen_buttontext = "#446165"
                var darkgreen_userlist = "#FFFFFF"
                var darkgreen_cambgcolor = "#071921"
                var pink_bgcolor = "#fb98c9"
                var pink_bordercolor = "#eebfda"
                var pink_lightbgcolor = "#ffe0ee"
                var pink_textcolor = "#db6ba3"
                var pink_buttontext = "#a65480"
                var pink_userlist = "#FFFFFF"
                var pink_cambgcolor = "#b7719d"
                var neonpink_bgcolor = "#940282"
                var neonpink_bordercolor = "#ff51ea"
                var neonpink_lightbgcolor = "#ad0098"
                var neonpink_textcolor = "#FFFFFF"
                var neonpink_buttontext = "#350024"
                var neonpink_userlist = "#000000"
                var neonpink_cambgcolor = "#650059"
                var green_bgcolor = "#042500"
                var green_bordercolor = "#217c16"
                var green_lightbgcolor = "#00500d"
                var green_textcolor = "#FFFFFF"
                var green_buttontext = "#042500"
                var green_userlist = "#FFFFFF"
                var green_cambgcolor = "#010c00"
                var neongreen_bgcolor = "#109600"
                var neongreen_bordercolor = "#0e6904"
                var neongreen_lightbgcolor = "#01ca21"
                var neongreen_textcolor = "#FFFFFF"
                var neongreen_buttontext = "#063c00"
                var neongreen_userlist = "#FFFFFF"
                var neongreen_cambgcolor = "#010c00"
                var blue_bgcolor = "#111949"
                var blue_bordercolor = "#596ce0"
                var blue_lightbgcolor = "#2a388b"
                var blue_textcolor = "#FFFFFF"
                var blue_buttontext = "#111949"
                var blue_userlist = "#FFFFFF"
                var blue_cambgcolor = "#050921"
                var mauve_bgcolor = "#9168b2"
                var mauve_bordercolor = "#d6b7ef"
                var mauve_lightbgcolor = "#BF8FE5"
                var mauve_textcolor = "#000000"
                var mauve_buttontext = "#9168b2"
                var mauve_userlist = "#000000"
                var mauve_cambgcolor = "#4c2c65"
                var orange_bgcolor = "#b33700"
                var orange_bordercolor = "#ff8d10"
                var orange_lightbgcolor = "#ff4f00"
                var orange_textcolor = "#000000"
                var orange_buttontext = "#b33700"
                var orange_userlist = "#000000"
                var orange_cambgcolor = "#6b2100"
                var red_bgcolor = "#590000"
                var red_bordercolor = "#d02323"
                var red_lightbgcolor = "#860000"
                var red_textcolor = "#FFFFFF"
                var red_buttontext = "#590000"
                var red_userlist = "#FFFFFF"
                var red_cambgcolor = "#290000"
                var purple_bgcolor = "#280048"
                var purple_bordercolor = "#b14fff"
                var purple_lightbgcolor = "#550098"
                var purple_textcolor = "#FFFFFF"
                var purple_buttontext = "#280048"
                var purple_userlist = "#FFFFFF"
                var purple_cambgcolor = "#0d0017"
                var black_bgcolor = "#191919"
                var black_bordercolor = "#23272a"
                var black_lightbgcolor = "#2a2a2a"
                var black_textcolor = "#FFFFFF"
                var black_buttontext = "#7289da"
                var black_userlist = "#FFFFFF"
                var black_cambgcolor = "#111"
                try {
                    var body = document.body
                    if(color != "roombg") {
                        llamaConsole('Theme -> ' + color.charAt(0).toUpperCase() + color.slice(1))
                        var theme_choices = ['pink', 'green', 'blue', 'purple', 'orange', 'red', 'darkpurple', 'black', 'trueblack', 'default', 'weed', 'smashbros', 'splatoon']
                        theme_choices.forEach(function(theme_choice) {
                            if (theme_choice === color) {
                                bodyElem.classList.add("llama-theme")
                                bodyElem.classList.add(color + "-theme")
                                titleCSS.classList.add(color + "-theme")
                                sidemenuCSS.classList.add(color + "-theme")
                                userlistCSS.classList.add(color + "-theme")
                                webappCSS.classList.add(color + "-theme")
                                videolistCSS.classList.add(color + "-theme")
                                videomoderationCSS.classList.add(color + "-theme")
                                chatlistCSS.classList.add(color + "-theme")
                                chatlogCSS.classList.add(color + "-theme")
                                chatlogElem.querySelector("#chat-wider").classList.add(color + "-theme")
                                //console.log('yes - ' + color)
                            } else {
                                bodyElem.classList.remove(theme_choice + "-theme")
                                titleCSS.classList.remove(theme_choice + "-theme")
                                sidemenuCSS.classList.remove(theme_choice + "-theme")
                                userlistCSS.classList.remove(theme_choice + "-theme")
                                webappCSS.classList.remove(theme_choice + "-theme")
                                videolistCSS.classList.remove(theme_choice + "-theme")
                                videomoderationCSS.classList.remove(theme_choice + "-theme")
                                chatlistCSS.classList.remove(theme_choice + "-theme")
                                chatlogCSS.classList.remove(theme_choice + "-theme")
                                //console.log('no - ' + theme_choice)
                            }
                        })
                    }
                    if (color === "roombg") {
                        let roombg_checkbox = titleElem.querySelector('#llama-settings-roombg > input')
                        let current_room_bg_image = titleElem.getElementById('llama_roombg_img').value
                        if(roombg_checkbox.checked === true) {
                            settingsQuick['RoomBG'] = true;
                            document.documentElement.style.setProperty("--llamatheme-roombg", "url('" + current_room_bg_image + "')")
                            GM_setValue('llama-RoomBG', true.toString())
                            GM_setValue('llama-RoomBGURL', current_room_bg_image.toString())
                            llamaConsole('Room BG Image -> ON');
                            llamaConsole('Room BG Image URL -> ' + current_room_bg_image);
                            //console.log(GM_getValue('llama-RoomBG'))
                        } else {
                            document.documentElement.style.setProperty("--llamatheme-roombg", "url('')")
                            settingsQuick['RoomBG'] = false;
                            GM_setValue('llama-RoomBG', false.toString())
                            GM_setValue('llama-RoomBGURL', current_room_bg_image.toString())
                            //console.log(GM_getValue('llama-RoomBG'))
                        }
                    } else if (color === "weed") {
                        GM_setValue('llama-ThemeChoice', color.toString())
                        if (color === "weed") {
                            document.documentElement.style.setProperty("--llamatheme-bgcolor", "#000000")
                            document.documentElement.style.setProperty("--llamatheme-bordercolor", "#005900")
                            document.documentElement.style.setProperty("--llamatheme-lightbgcolor", "#000000")
                            document.documentElement.style.setProperty("--llamatheme-textcolor", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-buttontext", "#073800")
                            document.documentElement.style.setProperty("--llamatheme-userlist", "#005900")
                            document.documentElement.style.setProperty("--llamatheme-cambgcolor", "#000000")
                            document.documentElement.style.setProperty("--llamatheme-headerbg", "url(https://i.ibb.co/jDC8w3C/weed-wallpaper-1920x1080.jpg)")
                            if(settingsQuick['RoomBG'] != true) {document.documentElement.style.setProperty("--llamatheme-roombg", "url(https://i.ibb.co/5YKLsSK/wp2565886.jpg)")}
                            document.documentElement.style.setProperty("--llamatheme-userbg", "url(https://i.ibb.co/5YKLsSK/wp2565886.jpg)")
                            document.documentElement.style.setProperty("--llamatheme-chatbg", "url(https://i.ibb.co/5YKLsSK/wp2565886.jpg)")
                        }
                    } else if (color === "smashbros") {
                        GM_setValue('llama-ThemeChoice', color.toString())
                        if (color === "smashbros") {
                            document.documentElement.style.setProperty("--llamatheme-bgcolor", "#282828")
                            document.documentElement.style.setProperty("--llamatheme-bordercolor", "#3c3c3c")
                            document.documentElement.style.setProperty("--llamatheme-lightbgcolor", "#282828")
                            document.documentElement.style.setProperty("--llamatheme-textcolor", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-buttontext", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-userlist", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-cambgcolor", "#151515")
                            document.documentElement.style.setProperty("--llamatheme-headerbg", "url(https://i.ibb.co/BK1CXz4/smashlogo.jpg)")
                            if(settingsQuick['RoomBG'] != true) {document.documentElement.style.setProperty("--llamatheme-roombg", "url(https://i.ibb.co/JxkgSdj/melee-minimal-wallpaper-by-browniehooves-d8lwcvk.png)")}
                            document.documentElement.style.setProperty("--llamatheme-userbg", "url(https://i.ibb.co/nRNHL9C/20444930186-7a639da784-o.png)")
                            document.documentElement.style.setProperty("--llamatheme-chatbg", "url(https://i.ibb.co/ZSYHQs7/chat.jpg)")
                            document.documentElement.style.setProperty("--llamatheme-ptt", "url(https://i.ibb.co/7KSTsdj/smash-clipart-87526.png)")
                        }
                    } else if (color === "splatoon") {
                        GM_setValue('llama-ThemeChoice', color.toString())
                        if (color === "splatoon") {
                            document.documentElement.style.setProperty("--llamatheme-bgcolor", "#282828")
                            document.documentElement.style.setProperty("--llamatheme-bordercolor", "#3c3c3c")
                            document.documentElement.style.setProperty("--llamatheme-lightbgcolor", "#282828")
                            document.documentElement.style.setProperty("--llamatheme-textcolor", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-buttontext", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-userlist", "#FFF")
                            document.documentElement.style.setProperty("--llamatheme-cambgcolor", "#151515")
                            document.documentElement.style.setProperty("--llamatheme-headerbg", "url(https://i.ibb.co/XsTjVk0/splay-bg-header2.png)")
                            if(settingsQuick['RoomBG'] != true) {document.documentElement.style.setProperty("--llamatheme-roombg", "url(https://i.ibb.co/C18JNgK/splatbg.jpg)")}
                            document.documentElement.style.setProperty("--llamatheme-userbg", "url(https://i.ibb.co/7nrB9LT/test.png)")
                            document.documentElement.style.setProperty("--llamatheme-chatbg", "url(https://i.ibb.co/TrKBZFn/splat-chat-bg3.png)")
                            document.documentElement.style.setProperty("--llamatheme-ptt", "url(https://i.ibb.co/3dHQVhC/splat-mic2.png)")
                        }
                    } else {
                        GM_setValue('llama-ThemeChoice', color.toString())
                        var llama_theme_bgcolor = ""
                        var llama_theme_bordercolor = ""
                        var llama_theme_lightbgcolor = ""
                        var llama_theme_textcolor = ""
                        var llama_theme_buttontext = ""
                        var llama_theme_userlist = ""
                        var llama_theme_cambgcolor = ""
                        if (color === "default") {
                            document.documentElement.style.setProperty("--llamatheme-bgcolor", "#2d373a")
                            document.documentElement.style.setProperty("--llamatheme-bordercolor", "")
                            document.documentElement.style.setProperty("--llamatheme-lightbgcolor", "")
                            document.documentElement.style.setProperty("--llamatheme-textcolor", "")
                            document.documentElement.style.setProperty("--llamatheme-buttontext", "")
                            document.documentElement.style.setProperty("--llamatheme-userlist", "")
                            document.documentElement.style.setProperty("--llamatheme-cambgcolor", "#FFF")
                        } else if (color === "darkgreen") {
                            llama_theme_bgcolor = darkgreen_bgcolor
                            llama_theme_bordercolor = darkgreen_bordercolor
                            llama_theme_lightbgcolor = darkgreen_lightbgcolor
                            llama_theme_textcolor = darkgreen_textcolor
                            llama_theme_buttontext = darkgreen_buttontext
                            llama_theme_userlist = darkgreen_userlist
                            llama_theme_cambgcolor = darkgreen_cambgcolor
                        } else if (color === "pink") {
                            llama_theme_bgcolor = pink_bgcolor
                            llama_theme_bordercolor = pink_bordercolor
                            llama_theme_lightbgcolor = pink_lightbgcolor
                            llama_theme_textcolor = pink_textcolor
                            llama_theme_buttontext = pink_buttontext
                            llama_theme_userlist = pink_userlist
                            llama_theme_cambgcolor = pink_cambgcolor
                        } else if (color === "neonpink") {
                            llama_theme_bgcolor = neonpink_bgcolor
                            llama_theme_bordercolor = neonpink_bordercolor
                            llama_theme_lightbgcolor = neonpink_lightbgcolor
                            llama_theme_textcolor = neonpink_textcolor
                            llama_theme_buttontext = neonpink_buttontext
                            llama_theme_userlist = neonpink_userlist
                            llama_theme_cambgcolor = neonpink_cambgcolor
                        } else if (color === "green") {
                            llama_theme_bgcolor = green_bgcolor
                            llama_theme_bordercolor = green_bordercolor
                            llama_theme_lightbgcolor = green_lightbgcolor
                            llama_theme_textcolor = green_textcolor
                            llama_theme_buttontext = green_buttontext
                            llama_theme_userlist = green_userlist
                            llama_theme_cambgcolor = green_cambgcolor
                        } else if (color === "neongreen") {
                            llama_theme_bgcolor = neongreen_bgcolor
                            llama_theme_bordercolor = neongreen_bordercolor
                            llama_theme_lightbgcolor = neongreen_lightbgcolor
                            llama_theme_textcolor = neongreen_textcolor
                            llama_theme_buttontext = neongreen_buttontext
                            llama_theme_userlist = neongreen_userlist
                            llama_theme_cambgcolor = neongreen_cambgcolor
                        } else if (color === "blue") {
                            llama_theme_bgcolor = blue_bgcolor
                            llama_theme_bordercolor = blue_bordercolor
                            llama_theme_lightbgcolor = blue_lightbgcolor
                            llama_theme_textcolor = blue_textcolor
                            llama_theme_buttontext = blue_buttontext
                            llama_theme_userlist = blue_userlist
                            llama_theme_cambgcolor = blue_cambgcolor
                        } else if (color === "mauve") {
                            llama_theme_bgcolor = mauve_bgcolor
                            llama_theme_bordercolor = mauve_bordercolor
                            llama_theme_lightbgcolor = mauve_lightbgcolor
                            llama_theme_textcolor = mauve_textcolor
                            llama_theme_buttontext = mauve_buttontext
                            llama_theme_userlist = mauve_userlist
                            llama_theme_cambgcolor = mauve_cambgcolor
                        } else if (color === "orange") {
                            llama_theme_bgcolor = orange_bgcolor
                            llama_theme_bordercolor = orange_bordercolor
                            llama_theme_lightbgcolor = orange_lightbgcolor
                            llama_theme_textcolor = orange_textcolor
                            llama_theme_buttontext = orange_buttontext
                            llama_theme_userlist = orange_userlist
                            llama_theme_cambgcolor = orange_cambgcolor
                        } else if (color === "red") {
                            llama_theme_bgcolor = red_bgcolor
                            llama_theme_bordercolor = red_bordercolor
                            llama_theme_lightbgcolor = red_lightbgcolor
                            llama_theme_textcolor = red_textcolor
                            llama_theme_buttontext = red_buttontext
                            llama_theme_userlist = red_userlist
                            llama_theme_cambgcolor = red_cambgcolor
                        } else if (color === "purple") {
                            llama_theme_bgcolor = purple_bgcolor
                            llama_theme_bordercolor = purple_bordercolor
                            llama_theme_lightbgcolor = purple_lightbgcolor
                            llama_theme_textcolor = purple_textcolor
                            llama_theme_buttontext = purple_buttontext
                            llama_theme_userlist = purple_userlist
                            llama_theme_cambgcolor = purple_cambgcolor
                        } else if (color === "black") {
                            llama_theme_bgcolor = black_bgcolor
                            llama_theme_bordercolor = black_bordercolor
                            llama_theme_lightbgcolor = black_lightbgcolor
                            llama_theme_textcolor = black_textcolor
                            llama_theme_buttontext = black_buttontext
                            llama_theme_userlist = black_userlist
                            llama_theme_cambgcolor = black_cambgcolor
                        } else if (color === "trueblack") {
                            llama_theme_bgcolor = trueblack_bgcolor
                            llama_theme_bordercolor = trueblack_bordercolor
                            llama_theme_lightbgcolor = trueblack_lightbgcolor
                            llama_theme_textcolor = trueblack_textcolor
                            llama_theme_buttontext = trueblack_buttontext
                            llama_theme_userlist = trueblack_userlist
                            llama_theme_cambgcolor = trueblack_cambgcolor
                        }
                        document.documentElement.style.setProperty("--llamatheme-bgcolor", llama_theme_bgcolor)
                        document.documentElement.style.setProperty("--llamatheme-bordercolor", llama_theme_bordercolor)
                        document.documentElement.style.setProperty("--llamatheme-lightbgcolor", llama_theme_lightbgcolor)
                        document.documentElement.style.setProperty("--llamatheme-textcolor", llama_theme_textcolor)
                        document.documentElement.style.setProperty("--llamatheme-buttontext", llama_theme_buttontext)
                        document.documentElement.style.setProperty("--llamatheme-userlist", llama_theme_userlist)
                        document.documentElement.style.setProperty("--llamatheme-cambgcolor", llama_theme_cambgcolor)


                        document.documentElement.style.setProperty("--llamatheme-headerbg", "")
                        if(settingsQuick['RoomBG'] != true) {document.documentElement.style.setProperty("--llamatheme-roombg", "")}
                        document.documentElement.style.setProperty("--llamatheme-userbg", "")
                        document.documentElement.style.setProperty("--llamatheme-chatbg", "")
                        document.documentElement.style.setProperty("--llamatheme-ptt", "")
                    }

                    //alert('theme `' + color + '` chosen');
                } catch (e) {
                    llamaConsole("error toggleTheme: " + e.message);
                }
            }

            function toggleTransparentChat(status) {
                status = status || ''
                let current_trans_status = settingsQuick["TransparentChat"]
                let current_trans_checkbox = titleElem.getElementById('llama-trans-chat-checkbox')
                if(status != 'reload') {
                    if(current_trans_status == true) {
                        current_trans_checkbox.checked = false
                        chatlogElem.querySelector("#chat-wrapper").setAttribute('style', '')
                        var newValue = current_trans_checkbox.checked;
                        settingsQuick["TransparentChat"] = newValue;
                        GM_setValue("llama-TransparentChat", newValue.toString());
                    } else {
                        current_trans_checkbox.checked = true
                        chatlogElem.querySelector("#chat-wrapper").setAttribute('style', 'background-color: transparent;')
                        var newValue = current_trans_checkbox.checked;
                        settingsQuick["TransparentChat"] = newValue;
                        GM_setValue("llama-TransparentChat", newValue.toString());
                        llamaConsole('Trasparent Chat -> ON')
                    }
                } else {
                    if(current_trans_status == true) {
                        current_trans_checkbox.checked = true
                        chatlogElem.querySelector("#chat-wrapper").setAttribute('style', 'background-color: transparent;')
                        llamaConsole('Trasparent Chat -> ON')
                    }
                }
            }

            function toggleSettingsDisplay(arg) {
                //console.log(arg)
                try {
                    if (settingsVisible == true) {
                        titleElem.getElementById("llama-settingsBox").classList.add("hidden");
                        titleElem.getElementById("llama-settings").classList.remove("llama-open");
                        settingsVisible = false;
                    } else {
                        titleElem.getElementById("llama-settingsBox").classList.remove("hidden");
                        titleElem.getElementById("llama-settings").classList.add("llama-open");
                        settingsVisible = true;
                    }
                } catch (e) {
                    llamaConsole("error toggleSettingsDisplay: " + e.message);
                }
            }

            function toggleThemesDisplay(arg) {

                if (settingsVisible == true) {
                    titleElem.getElementById("llama-themesBox").classList.add("hidden");
                    titleElem.getElementById("llama-themes").classList.remove("llama-open");
                    titleElem.getElementById("llama-themesButton").classList.remove("llama-themes-open");
                    settingsVisible = false;
                } else {
                    titleElem.getElementById("llama-themesBox").classList.remove("hidden");
                    titleElem.getElementById("llama-themes").classList.add("llama-open");
                    titleElem.getElementById("llama-themesButton").classList.add("llama-themes-open");
                    settingsVisible = true;
                }

            }

            function toggleGamesDisplay(arg) {

                if (settingsVisible == true) {
                    titleElem.getElementById("llama-gamesBox").classList.add("hidden");
                    titleElem.getElementById("llama-games").classList.remove("llama-open");
                    titleElem.getElementById("llama-gamesButton").classList.remove("llama-games-open");
                    settingsVisible = false;
                } else {
                    titleElem.getElementById("llama-gamesBox").classList.remove("hidden");
                    titleElem.getElementById("llama-games").classList.add("llama-open");
                    titleElem.getElementById("llama-gamesButton").classList.add("llama-games-open");
                    settingsVisible = true;
                }

            }

            function toggleHidingDisplay(arg) {

                if (settingsVisible == true) {
                    titleElem.getElementById("llama-hidingBox").classList.add("hidden");
                    titleElem.getElementById("llama-hiding").classList.remove("llama-open");
                    titleElem.getElementById("llama-hidingButton").classList.remove("llama-hiding-open");
                    settingsVisible = false;
                } else {
                    titleElem.getElementById("llama-hidingBox").classList.remove("hidden");
                    titleElem.getElementById("llama-hiding").classList.add("llama-open");
                    titleElem.getElementById("llama-hidingButton").classList.add("llama-hiding-open");
                    settingsVisible = true;
                }

            }

            function toggleSubSetting(arg) {
                arg = arg || 'reload'
                try {
                    //console.log(arg)
                    if(arg != 'reload') {
                      //llamaConsole('MENU -> ' + arg.charAt(0).toUpperCase() + arg.slice(1))
                    } else {arg = 'general';}
                    var setting_choices = ["general", "theme", "images", "cams"]
                    setting_choices.forEach(function(setting_choice) {
                        if (setting_choice === arg) {
                            titleElem.getElementById('llama_' + arg).classList.add('active')
                            titleElem.getElementById('llama_' + arg + '_settings').classList.remove('d-none')
                        } else {
                            titleElem.getElementById('llama_' + setting_choice).classList.remove('active')
                            titleElem.getElementById('llama_' + setting_choice + '_settings').classList.add('d-none')
                        }
                    })
                } catch (e) {
                    llamaConsole("error toggleSubSetting: " + e.message);
                }
            }

            function settingsCheckboxUpdate(settingName = null, value = null) {
                try {
                    if (settingName == null && value == null) {
                        //no arguments set, then load checkboxes from settingsQuick[]
                        titleElem.getElementById("llama-settings-borderlesscams").querySelector("input").checked = settingsQuick["BorderlessCams"];
                        titleElem.getElementById("llama-settings-roundedcams").querySelector("input").checked = settingsQuick["RoundedCams"];
                        titleElem.getElementById("llama-settings-miniyt").querySelector("input").checked = settingsQuick["miniyt"];
                        titleElem.getElementById("llama-settings-autoscroll").querySelector("input").checked = settingsQuick["Autoscroll"];
                        titleElem.getElementById("llama-settings-mentions").querySelector("input").checked = settingsQuick["MentionsMonitor"];
                        titleElem.getElementById("llama-settings-notifications").querySelector("input").checked = settingsQuick["NotificationsOff"];
                        titleElem.getElementById("llama-settings-changefont").querySelector("input").checked = settingsQuick["ChangeFont"];
                        titleElem.getElementById("llama-settings-chatbelow").querySelector("input").checked = settingsQuick["ChatBelow"];
                        titleElem.getElementById("llama-settings-maxcamposition").querySelector("input").checked = settingsQuick["MaxedCamLeft"];
                        return;
                    }

                    if (settingName == "llama-settings-autoscroll") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-autoscroll").querySelector("input").checked;
                            settingsQuick["Autoscroll"] = newValue;
                            GM_setValue("llama-Autoscroll", newValue.toString());
                        }
                    }
                    if (settingName == "llama-settings-mentions") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-mentions").querySelector("input:first-of-type").checked;
                            // if (newValue) {
                            // titleElem.getElementById("llama-settings-mentions").getAttribute("class").includes("setting-disabled");
                            // }
                            settingsQuick["MentionsMonitor"] = newValue;
                            GM_setValue("llama-MentionsMonitor", newValue.toString());
                            llamaConsole('MentionsMonitor -> ' + newValue);
                        }
                    }
                    if (settingName == "llama-settings-notifications") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-notifications").querySelector("input").checked;
                            settingsQuick["NotificationsOff"] = newValue;
                            GM_setValue("llama-NotificationsOff", newValue.toString());
                            notificationHider();
                        }
                    }
                    if (settingName == "llama-settings-changefont") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-changefont").querySelector("input").checked;
                            settingsQuick["ChangeFont"] = newValue;
                            GM_setValue("llama-ChangeFont", newValue.toString());
                            fontToggle(newValue);
                            llamaConsole('Improve Font -> ' + newValue);
                        }
                    }
                    if (settingName == "llama-settings-chatbelow") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-chatbelow").querySelector("input").checked;
                            settingsQuick["ChatBelow"] = newValue;
                            GM_setValue("llama-ChatBelow", newValue.toString());
                            chatBelowToggle(newValue);
                            llamaConsole('Chat on Bottom -> ' + newValue);
                        }
                    }
                    if (settingName == "llama-settings-maxcamposition") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-maxcamposition").querySelector("input").checked;
                            settingsQuick["MaxedCamLeft"] = newValue;
                            GM_setValue("llama-MaxedCamLeft", newValue.toString());
                            maxCamPositionToggle(newValue);
                            llamaConsole('Max Cam Position on Left -> ' + newValue);
                        }
                    }
                    if (settingName == "llama-settings-miniyt") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-miniyt").querySelector("input").checked;
                            settingsQuick["miniyt"] = newValue;
                            GM_setValue("llama-miniyt", newValue.toString());
                            miniytToggle(newValue);
                            llamaConsole('Mini Youtube Player -> ' + newValue);
                        }
                    }
                    if (settingName == "llama-settings-borderlesscams") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-borderlesscams").querySelector("input").checked;
                            settingsQuick["BorderlessCams"] = newValue;
                            GM_setValue("llama-BorderlessCams", newValue.toString());
                            borderlessCamsToggle(newValue);
                            llamaConsole('Borderless Cams -> ' + newValue);
                        }
                    }

                    if (settingName == "llama-settings-roundedcams") {
                        if (value == null) {
                            var newValue = titleElem.getElementById("llama-settings-roundedcams").querySelector("input").checked;
                            settingsQuick["RoundedCams"] = newValue;
                            GM_setValue("llama-RoundedCams", newValue.toString());
                            roundCamsToggle(newValue);
                            llamaConsole('Rounded Cam Corners -> ' + newValue);
                        }
                    }
                } catch (e) {
                    llamaConsole("error settingsCheckboxUpdate: " + e.message);
                }
            }

            function fontToggle(arg) {
                try {
                    arg ? bodyElem.classList.add("llama-changefont") : bodyElem.classList.remove("llama-changefont");
                } catch (e) {
                    llamaConsole("error fontToggle: " + e.message);
                }
            }

            function reloadUserImages() {
                let current_roombg = settingsQuick['RoomBG'];
                let current_roombg_url = settingsQuick['RoomBGURL'];
                //console.log('room bg: ' + current_roombg)
                //console.log('room bg url: ' + current_roombg_url)
                let roombg_checkbox = titleElem.querySelector('#llama-settings-roombg > input')
                if (current_roombg_url) {titleElem.getElementById('llama_roombg_img').value = current_roombg_url}
                if (current_roombg == true) {roombg_checkbox.checked = true; Toggle_Theme('roombg');}
            }

            function roundCamsToggle(arg) {
                if (videolistElem.querySelector(camQueryString) != null) {
                    var camElems = videolistElem.querySelectorAll(camQueryString);
                    for (i = 0; i < camElems.length; i++) {
                        var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
                        var camElem = camItem.querySelector(".video");
                        arg ? camElem.classList.add("llama-roundedcams") : camElem.classList.remove("llama-roundedcams");
                    }
                }
                arg ? llamaConsole('Rounded Cams -> ON') : ''
                arg ? videolistCSS.classList.add("llama-roundedcams") : videolistCSS.classList.remove("llama-roundedcams");
            }

            function borderlessCamsToggle(arg) {
                if (videolistElem.querySelector(camQueryString) != null) {
                    var camElems = videolistElem.querySelectorAll(camQueryString);
                    for (i = 0; i < camElems.length; i++) {
                        var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
                        var camElem = camItem.querySelector(".video");
                        arg ? camElem.classList.add("llama-borderlesscams") : camElem.classList.remove("llama-borderlesscams");
                    }
                }
                arg ? llamaConsole('Remove Cam Padding -> ON') : ''
                arg ? videolistCSS.classList.add("llama-borderlesscams") : videolistCSS.classList.remove("llama-borderlesscams");
            }

            function maxCamPositionToggle(arg) {
                try {
                    arg ? videolistCSS.classList.add("llama-leftcam") : videolistCSS.classList.remove("llama-leftcam");
                } catch (e) {
                    llamaConsole("error maxCamPositionToggle: " + e.message);
                }
            }

            function miniytToggle(arg) {
                try {
                    arg ? videolistCSS.classList.add("llama-miniyt") : videolistCSS.classList.remove("llama-miniyt");
                } catch (e) {
                    llamaConsole("error miniytToggle: " + e.message);
                }
            }

            function chatBelowToggle(arg) {
                try {
                    arg ? chatlogOuter.classList.add("llama-chatbelow") : chatlogOuter.classList.remove("llama-chatbelow");
                    arg ? videosFooter.classList.add("llama-chatbelow") : chatlogOuter.classList.remove("llama-chatbelow");
                } catch (e) {
                    llamaConsole("error chatBelowToggle: " + e.message);
                }
            }

            function notificationHider() {
                try {
                    chatlogContainer = chatlogElem.querySelector("#chat-content");
                    settingsQuick["NotificationsOff"] ? chatlogContainer.classList.add("llama-notif-off") : chatlogContainer.classList.remove("llama-notif-off");
                } catch (e) {
                    llamaConsole("error notificationHider: " + e.message);
                }
            }

            function copyChatlog(opt = null) {
                try {
                    if (opt == "close") {
                        chatlogDisplayElem.classList.remove("show");
                        chatlogDisplayClose.classList.remove("show");
                        setTimeout(function() {
                            chatlogDisplayCont.classList.remove("show");
                        }, 300);
                        return;
                    }

                    var filename = "tinychat_" + roomName + "_" + joinDate + "_" + joinTime.replace(/:/g, ".") + "-chatlog.log";
                    var chatlogText = "Tinychat room " + roomName + " on " + joinDate + " " + joinTime + newline + "Users (" + usersCountInitial + "): " + userlistInitial + newline + chatlogMain;

                    var downloadLink = 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatlogText);
                    var downloadElem = document.createElement('a');
                    downloadElem.setAttribute("href", downloadLink);

                    downloadElem.setAttribute("download", filename);

                    if (opt == "download") {
                        if (browserFirefox) showUpdateNotifier("Chat log downloading doesn't work in Firefox yet.");
                        else downloadElem.click();
                    }
                    if (opt == "view" || opt == null) {
                        if (typeof chatlogDisplayCont == "undefined") {
                            chatlogDisplayCont = chatlogElem.querySelector("#llama-chatlogDisplay");
                            chatlogDisplayElem = chatlogDisplayCont.querySelector("textarea");
                            chatlogDisplayClose = chatlogDisplayCont.querySelector("#close");
                        }
                        chatlogDisplayElem.value = chatlogText;
                        chatlogDisplayCont.classList.add("show");
                        setTimeout(function() {
                            chatlogDisplayElem.classList.add("show");
                            chatlogDisplayClose.classList.add("show");
                        }, 50);
                        chatlogDisplayElem.scrollTop = chatlogDisplayElem.scrollHeight;
                    }
                } catch (e) {
                    llamaConsole("error copyChatlog: " + e.message);
                }
            }

            function getFormattedDateTime(d, opt = null) {
                try {
                    if (opt == "time") return d.toLocaleTimeString('en-US', {
                        hour12: false
                    });
                    else return d.toLocaleDateString('zh-CN', {
                        'year': 'numeric',
                        'month': '2-digit',
                        'day': '2-digit'
                    }).replace(/\//g, "-");
                } catch (e) {
                    llamaConsole("error getFormattedDateTime: " + e.message);
                }
            }

            function mentionsManager(mode) {
                try {
                    var inputElem = titleElem.querySelector("#llama-settings #llama-settings-mentions input.text");
                    // phrases = inputElem.value.split(",");
                    var phrase = inputElem.value;
                    if (phrase.endsWith(",")) {
                        phrase = phrase.slice(0, -1);
                    }
                    if (phrase.startsWith(",")) {
                        phrase = phrase.slice(1);
                    }

                    if (mode == "save") {
                        GM_setValue("llama-Mentions", phrase);
                        settingMentions = phrase.split(",");
                        inputElem.value = phrase;
                    }
                    if (mode == "load") {
                        var loadedMentions = GM_getValue("llama-Mentions");
                        if (loadedMentions != undefined) {
                            inputElem.value = loadedMentions;
                            settingMentions = loadedMentions.split(",");
                        }
                    }
                    return;

                    var phrase = phrase.toString();
                    if (mode == "save") {
                        settingMentions.push(phrases);
                        GM_setValue("llama-Mentions", JSON.stringify(setting_Mentions));
                    }
                    if (mode == "load") {
                        var mentions = JSON.parse(GM_getValue("llama-Mentions"));
                        settingMentions = mentions;
                        inputElem.value = settingMentions.join();
                    }
                } catch (e) {
                    llamaConsole("error mentionsManager: " + e.message);
                }
            }

            function declareGlobalVars() {

                try {
                    globalCSS = `:root {
    --llamatheme-bgcolor: #2d373a;
    --llamatheme-bordercolor: rgba(0, 0, 0, .1);
    --llamatheme-lightbgcolor: #2d373a;
    --llamatheme-textcolor: #000;
    --llamatheme-buttontext: ;
    --llamatheme-roombg: ;
    --llamatheme-userbg: ;
    --llamatheme-chatheaderbg: ;
    --llamatheme-chatbg: ;
    --llamatheme-messagebg: ;
    --llamatheme-userlist: ;
    --llamatheme-cambgcolor: #FFF;
;
}

* {
    scrollbar-color: #ccc transparent;
    scrollbar-width: thin;
}
.llama-nightmode * {
    scrollbar-color: #242C2E transparent;
}
.llama-nightmode.blacknight * {
    scrollbar-color: #111 transparent;
}
.icon-resize {
    left: 50%;
    margin-left: -11px;display:none;
}

:host, #videolist {
    background-color: transparent;
}
@media screen and (max-width: 600px){

:host, #videolist {
height: 0px !important;
}}

.video.llama-roundedcams div.ratio-4-3 {
	border-radius: 10px;
}
/*--------------------------------------------------MINIYT--------------------------------------------------------*/
.llama-miniyt .videos-items:first-child:not(.hidden) {
    width: 100px !important;
    position: absolute;
    top: -20px;
    left: -24px;
    height: 75px !important;
    z-index: 1;
    opacity: 0.5;}

.llama-miniyt #icon-seek {display:none;}

@media only screen and (min-width: 1920px) {
.llama-miniyt #videos.row > .videos-items:last-child {
    width: 100%;}
}

	`;

                    camItemCSShtml = `
		<style id="camItemCSS">` + globalCSS + `

			.icon-llama-max {
				position: absolute;
				top: -40%;
				right: 0;
				z-index: 9;
				background: none;
				border: 0;
			}
			.icon-llama-max:hover { cursor: pointer; }
			.icon-llama-max path { fill: #04caff; }

			.video:hover .icon-llama-max {
				top: 40%;
				transition: top .2s ease .2s,
						right .2s ease .2s,
						left .2s ease .2s,
						opacity .2s;
				}
			.icon-llama-close {
				position: absolute;
				top: -40%;
				left:3%;
				z-index: 9;
				background: none;
				border: 0;
			}

			.icon-llama-close:hover { cursor: pointer; }
			.icon-llama-close path { fill: #ff0000; }

			.video:hover .icon-llama-close {
				top: 40%;
				transition: top .2s ease .2s,
						left .2s ease .2s,
						right .2s ease .2s,
						opacity .2s;
				}
		.video > div > .overlay {
				border-radius: 40px;
			}

			.video:after { border: 0px !important; border-color:#2a2c2c !important;}

			/* Disable cam border
			.video:after { border: none; border-color:#2a2c2c}
			.video > div { background-color: unset; }
			video,
			.video > div > .overlay {
				border-radius: 10px;
			}
			*/
			.video { transition: .4s; }
			.llama-borderlesscams.video { padding: 0; }
			.llama-leftcam.llama-close.llama-closedCam.video > div > .overlay {	border-radius: 100px;}
			.llama-borderlesscams.video:after { display: none; }

			.llama-nightmode.video:after { border-color: var(--nightmode-bgcolor); }
			.llama-nightmode.blacknight.video:after { border-color: var(--nightmodeBlack-bgcolor); }
.llama-pinkmode.blacknight.video:after,
.llama-greenmode.blacknight.video:after,
.llama-bluemode.blacknight.video:after,
.llama-purplemode.blacknight.video:after,
.llama-orangemode.blacknight.video:after,
.llama-redmode.blacknight.video:after,
.llama-darkpurplemode.blacknight.video:after,
.llama-whitemode.blacknight.video:after
{ border-color: transparent; }




			.llama-nightmode.blacknight.video > div > .waiting { background: #111; }
			.llama-nightmode.blacknight.video > div { background-color: #111; }
		</style>
	`;

                    camMaxCSShtml = `
	<style id="camMaxCSS">` + globalCSS + `
		.llama-max .js-video {
			width: 15%!important;
			z-index: 1;
		}
		.llama-leftcam .llama-max .js-video {
			float: right;
			order: 2;
		}
		.llama-leftcam .llama-max .llama-maxedCam {
			float: left;
			order: 1;
		}

		div[data-video-count="5"] .llama-max .js-video:not(.llama-maxedCam),
		div[data-video-count="6"] .llama-max .js-video:not(.llama-maxedCam),
		div[data-video-count="7"] .llama-max .js-video:not(.llama-maxedCam)
		{ width: 20%!important; }
		.llama-max.llama-camCount2 .js-video { width: 30%!important; }
		.llama-max.llama-camCount10-11 .js-video { width: 16%!important; }
		.llama-max.llama-camCount12 .js-video { width: 14%!important; }

		:not(.hidden) + .llama-max.llama-camCount12 .js-video,
		:not(.hidden) + .llama-max.llama-camCount10-11 .js-video,
		:not(.hidden) + .llama-max .js-video
		{ width: 30%!important; }
		:not(.hidden) + .llama-max.llama-camCount2 .js-video { width: 60%!important; }

		.llama-max .js-video.llama-maxedCam,
		:not(.hidden) + .llama-max .js-video.llama-maxedCam { width: 70%!important; }

		@media screen and (max-width: 1400px) {
			.llama-max .js-video { width: 20%!important; }

			.llama-max.llama-camCount2 .js-video { width: 40%!important; }
			.llama-max.llama-camCount10-11 .js-video { width: 18%!important; }
			.llama-max.llama-camCount12 .js-video { width: 15%!important; }

			.llama-max .js-video.llama-maxedCam,
			:not(.hidden) + .llama-max .js-video.llama-maxedCam { width: 60%!important; }
		}
	`;

                    camMaxButtonHtml = `
		<button class="icon-llama-max" id="maxbutton-camName">
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.37 12.95l3.335 3.336a1.003 1.003 0 1 1-1.42 1.42L12.95 14.37a8.028 8.028 0 1 1 1.42-1.42zm-6.342 1.1a6.02 6.02 0 1 0 0-12.042 6.02 6.02 0 0 0 0 12.042zM6.012 9.032a.996.996
				0 0 1-.994-1.004c0-.554.452-1.003.994-1.003h4.033c.55 0 .994.445.994 1.003 0 .555-.454 1.004-.995 1.004H6.012z" fill-rule="evenodd"></path>
				<path d="M0 .99C0 .445.444 0 1 0a1 1 0 0 1 1 .99v4.02C2 5.555 1.556 6 1 6a1 1 0 0 1-1-.99V.99z" transform="translate(7 5)" fill-rule="evenodd"></path>
			</svg>
		</button>
	`;
                    camCloseCSShtml = `
	<style id="camCloseCSS">` + globalCSS + `
		.llama-close .js-video {
			z-index: 1;
		}
		.llama-leftcam .llama-close .js-video {
			float: right;
			order: 2;
		}


/*---------CLOSED ITEM--------*/
.llama-leftcam .llama-close .llama-closedCam {
    width: 8% !important;
    z-index: 12;
    position: absolute;
    top: -130px;
    right: 100px;
    height: 5px !important;
    margin: 0;
    padding: 0;
    opacity: 0.5;
    float: left;
    order: 1;}




		div[data-video-count="5"] .llama-close .js-video:not(.llama-closedCam),
		div[data-video-count="6"] .llama-close .js-video:not(.llama-closedCam),
		div[data-video-count="7"] .llama-close .js-video:not(.llama-closedCam)
		{}
		.llama-close.llama-camCount2 .js-video {}
		.llama-close.llama-camCount10-11 .js-video {}
		.llama-close.llama-camCount12 .js-video {}

		:not(.hidden) + .llama-close.llama-camCount12 .js-video,
		:not(.hidden) + .llama-close.llama-camCount10-11 .js-video,
		:not(.hidden) + .llama-close .js-video
		{}
		:not(.hidden) + .llama-close.llama-camCount2 .js-video {}

/*---------CLOSED ITEM--------*/
		.llama-max .js-video.llama-closedCam,
		:not(.hidden) + .llama-close .js-video.llama-closedCam {}



		@media screen and (max-width: 1400px) {
			.llama-close .js-video {}

			.llama-close.llama-camCount2 .js-video {}
			.llama-close.llama-camCount10-11 .js-video {}
			.llama-close.llama-camCount12 .js-video {}


/*---------CLOSED ITEM--BIG SCREEN------*/
			.llama-close .js-video.llama-closedCam,
			:not(.hidden) + .llama-close .js-video.llama-closedCam {}
		}
	`;

                    camCloseButtonHtml = `
		<button class="icon-llama-close" id="closebutton-camName" style="">
			<svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
				<path d="M3.63 12.024C1.474 10.5.52 8.65.52 8.65c-.657-.9-.68-2.417-.128-3.362C.392 5.288 2.452 0 10 0c1.94 0 3.52.35 4.79.867l.594-.592a.945.945 0 0 1 1.34.006.953.953
				0 0 1 .004 1.34L4.616 13.724a.945.945 0 0 1-1.34-.006.953.953 0 0 1-.004-1.34l.357-.356zm9.598-9.594c-.942-.28-2.013-.43-3.23-.43-2.797
				0-4.83.803-6.288 2.125-.496.45-.888.928-1.183 1.4-.163.26-.25.436-.27.49L2.2 6.16l-.08.137c-.17.29-.15.946.017 1.176l.09.123.07.136c.042.08.168.29.378.58A9.167
				9.167 0 0 0 4.058 9.82c.32.28.656.535 1.01.766l8.16-8.156zm-6.08 11.222l1.713-1.714c.368.04.747.062 1.14.062 2.423 0 4.374-.814 5.942-2.185a9.2 9.2
				0 0 0 1.386-1.51c.212-.293.338-.5.38-.583l.057-.108.07-.1c.19-.282.217-.94.07-1.17L17.8 6.18l-.072-.184a3.74 3.74 0 0 0-.268-.485 6.577 6.577
				0 0 0-.972-1.2l1.415-1.414c1.244 1.225 1.69 2.374 1.69 2.374.6.94.512 2.465-.107 3.37 0 0-2.774 5.36-9.487 5.36-1.046 0-1.995-.13-2.853-.348z" fill-rule="evenodd"></path>
			</svg>
		</button>
	`;
                } catch (e) {
                    llamaConsole("error declareGlobalVars: " + e.message);
                }
            }

            function injectCSS(cssName = null) {
                try {
                    // Indenting is purposely wrong, for readability
                    var insertPosition = "beforeend";
                    headElem = document.querySelector("head");
                    browserSpoofedChrome = (headElem.innerHTML.includes("Shady DOM styles for") ? true : false);
                    if (browserSpoofedChrome) llamaConsole("browserSpoofedChrome");
                    var firefoxCSS = "";

                    // titleCSS
                    if (browserFirefox) var firefoxCSS = `
                            #llama-settings-nightmode .nightmode-colors:after { display: none; }
                            #llama-settings-nightmode .nightmode-colors {
                            }
                            #llama-settings-nightmode > span {
                                position: relative;
                                top: -4px;
                            }
                            #llama-settings-nightmode .label { margin-right: 3px; }
                            #llama-settings-nightmode .sublabel {
                                margin-left: unset;
                                position: relative;
                                top: -2px;
                            }
                            #llama-settings-nightmode .colorCont {
                                position: relative;
                                top: -2px;
                            }
                       `;

                    titleCSShtml = `<style id="titleCSS" scope="tinychat-title">` + globalCSS + llamaTitleCSS + firefoxCSS + `</style>`;
                    titleCSS.insertAdjacentHTML(insertPosition, titleCSShtml);

                    // videolistCSS
                    videolistCSShtml = `<style id="videolistCSS" scope="tc-videolist">` + globalCSS + llamaVideolistCSS + `</style>`;
                    videolistCSS.insertAdjacentHTML(insertPosition, videolistCSShtml);

                    // chatlistCSS
                    chatlistCSShtml = `<style id="chatlistCSS" scope="tinychat-chatlist">` + globalCSS + llamaChatlistCSS + `</style>`;
                    chatlistCSS.insertAdjacentHTML(insertPosition, chatlistCSShtml);

                    // userlistCSS
                    userlistCSShtml = `<style id="userlistCSS" scope="tinychat-userlist">` + globalCSS + llamaUserlistCSS + `</style>`;
                    userlistCSS.insertAdjacentHTML(insertPosition, userlistCSShtml);

                    // userContextmenuCSS
                    userContextmenuCSShtml = `<style id="userContextmenuCSS" scope="tinychat-user-contextmenu">` + globalCSS + `#main {border: 1px solid rgba(0, 0, 0, .1);}</style>`;
                    userContextmenuCSS.insertAdjacentHTML(insertPosition, userContextmenuCSShtml);

                    // bodyCSS
                    bodyCSShtml = `<style id="bodyCSS">` + globalCSS + llamaBodyCSS + `</style>`;
                    bodyCSS.insertAdjacentHTML(insertPosition, bodyCSShtml);

                    // messageCSS
                    messageCSS = llamaMessageCSS;

                    // chatlogCSS
                    chatlogCSShtml = `<style id="chatlogCSS" scope="tinychat-chatlog">` + globalCSS + llamaChatlogCSS + `</style>`;
                    chatlogCSS.insertAdjacentHTML(insertPosition, chatlogCSShtml);

                    // sidemenuCSS
                    var firefoxCSS = "";
                    if (browserSpoofedChrome) {
                        firefoxCSS = `#sidemenu {left: 0!important;transition: all .4s ease-in-out;}`;
                    }
                    sidemenuCSShtml = `<style id="sidemenuCSS" scope="tinychat-sidemenu">` + globalCSS + llamaSidemenuCSS + firefoxCSS + `</style>`;
                    sidemenuCSS.insertAdjacentHTML(insertPosition, sidemenuCSShtml);

                    // videomoderationCSS
                    videomoderationCSShtml = `<style id="videomoderationCSS" scope="tc-video-moderation">` + globalCSS + llamaVideoModerationCSS + `</style>`;
                    videomoderationCSS.insertAdjacentHTML(insertPosition, videomoderationCSShtml);

                    // webappCSS
                    webappCSShtml = `<style id="webappCSS" scope="tinychat-webrtc-app">` + globalCSS + llamaWebappCSS + `</style>`;
                    webappCSS.insertAdjacentHTML(insertPosition, webappCSShtml);
                } catch (e) {
                    llamaConsole("error injectCSS: " + e.message);
                }
            }

            function injectElements() {
                try {
                    headerGrabberParElem = titleElem.querySelector("#room-header");
                    headerGrabberParElem.insertAdjacentHTML("beforeend", `<div id="llama-header-grabber"></div>`);
                    headerGrabberElem = headerGrabberParElem.querySelector("#llama-header-grabber");
                    headerGrabberElem.addEventListener("click", headerGrabber);

                    sidemenuOverlayElem = bodyElem.querySelector("#menu-icon");
                    sidemenuOverlayElem.addEventListener("click", function() {
                        sidemenuOverlayElem.classList.toggle("expanded");
                    });

                    chatlogButtonsHTML = `
                    		<div id="llama-chatlogButtons">
                    			<div id="llama-chatlogSave" class="llama-chatlogBut">
		                    		<span class="icon">
                    					<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                    						<path d="m0,50l50,-50l50,50l-25,0l0,50l-50,0l0,-50l-25,0z"></path>
                    					</svg>
                    				</span><!-- ⇩ -->
                    				<span class="label">download</span>
                    			</div>
                    			<div id="llama-chatlogView" class="llama-chatlogBut">
                    				<span class="icon">☰</span>
		                    		<span class="label">view</span>
                    			</div>
	                    		<div id="llama-chatlogDisplay">
	                    			<textarea spellcheck="false"></textarea>
	                    			<div id="close">✕</div>
	                    		</div>
	                    	</div>
                            <style>
                            #systemMessageLog {
                            padding: 5px;
                            width: 97%;
                            height: 200px;
                            border-radius: 5px;
                            margin: 3px;
                            color: var(--llamatheme-textcolor);
                            top: 22px;
                            position: relative;
                            margin: 0 auto;    z-index: 9;
                            }
                            #liveTimer {
                            position:relative;
                            top:-23px;
                            padding: 5px 10px 5px 10px;
                            border-radius: 5px;
                            border: 1px solid var(--llamatheme-bordercolor);
                            background-color:var(--llamatheme-cambgcolor);
                            color: var(--llamatheme-textcolor);
                            width: 94.7%;
                            box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
                            text-align: center;
                            font-weight: bold;
                            }
                            .llama-systemMsg {margin-bottom: 5px;}
                            </style>

                            <div id="systemMessageLog">
                            <div id="liveTimer" style="display: none;"></div>

                            </div>
                    `;

                    selectAllButton = chatlogElem.querySelector("#chat-wrapper").insertAdjacentHTML("afterbegin", chatlogButtonsHTML);
                    chatlogElem.querySelector("#llama-chatlogSave").addEventListener("click", function() {
                        copyChatlog("download")
                    });
                    chatlogElem.querySelector("#llama-chatlogView").addEventListener("click", function() {
                        copyChatlog("view")
                    });
                    chatlogElem.querySelector("#llama-chatlogDisplay #close").addEventListener("click", function() {
                        copyChatlog("close")
                    });

                    if (!isPaidAccount) {
                        sidemenuGrabberParElem = sidemenuElem.querySelector("#sidemenu");
                        sidemenuGrabberElem = document.createElement("div");
                        sidemenuGrabberElem.setAttribute("id", "llama-sidemenu-grabber");
                        sidemenuGrabberElem.innerHTML = "";
                        sidemenuGrabberElem.addEventListener("click", sidemenuGrabber);
                        sidemenuGrabberParElem.appendChild(sidemenuGrabberElem);
                        sidemenuGrabberElem = sidemenuElem.querySelector("#llama-sidemenu-grabber");
                    }
                } catch (e) {
                    llamaConsole("error injectElements: " + e.message);
                }
            }

            function sidemenuGrabber() {
                try {
                    sidemenuGrabberParElem.classList.toggle("llama-sidemenuCollapsed");
                    sidemenuGrabberParElem.classList.contains("llama-sidemenuCollapsed") ? sidemenuGrabberElem.innerHTML = "" : sidemenuGrabberElem.innerHTML = "";

                    userlistElem.querySelector("#userlist").classList.toggle("llama-sidemenuCollapsed");
                    videolistElem.querySelector("#videolist").classList.toggle("llama-sidemenuCollapsed");
                    webappElem.querySelector("#room").classList.toggle("llama-sidemenuCollapsed");
                    bodyElem.classList.toggle("llama-sidemenuCollapsed");
                    titleElem.querySelector("#llama-themes").classList.toggle("llama-sidemenuCollapsed");
                    titleElem.querySelector("#llama-settings-miniyt").classList.toggle("llama-sidemenuCollapsed");
                    titleElem.querySelector("#room-header").classList.toggle("llama-sidemenuCollapsed");
                } catch (e) {
                    llamaConsole("error sidemenuGrabber: " + e.message);
                }
            }

            function chatlogGrabber() {
                try {
                    chatlogGrabberParElem.classList.toggle("llama-chatCollapsed");
                    chatlogGrabberParElem.classList.contains("llama-chatCollapsed") ? chatlogGrabberElem.innerHTML = "" : chatlogGrabberElem.innerHTML = "";
                } catch (e) {
                    llamaConsole("error sidemenuGrabber: " + e.message);
                }
            }

            function headerGrabber() {
                try {
                    headerGrabberParElem.classList.toggle("llama-headerCollapsed");
                    headerGrabberParElem.classList.contains("llama-headerCollapsed") ? headerGrabberElem.innerHTML = "" : headerGrabberElem.innerHTML = "";
                } catch (e) {
                    llamaConsole("error headerGrabber: " + e.message);
                }
            }

            function updateScroll() {
                try {
                    scrollbox.scrollTop = scrollbox.scrollHeight;
                    scrollbox.scrollTop = scrollbox.scrollTop + 5;
                } catch (e) {
                    llamaConsole("error updateScroll: " + e.message);
                }
            }

            function userHasScrolled(e) {
                try {
                    var scrollwheelAmount = e.deltaY;

                    if (scrollwheelAmount < 0) {
                        autoScrollStatus = false;
                        totalScrolledUp += scrollwheelAmount * -1;
                    } else {
                        totalScrolledUp -= scrollwheelAmount;
                    }

                    if (autoScrollStatus === false && scrollbox.scrollHeight - scrollbox.scrollTop == scrollbox.offsetHeight) {
                        autoScrollStatus = true;
                        totalScrolledUp = 0;
                    }
                } catch (e) {
                    llamaConsole("error userHasScrolled: " + e.message);
                }
            }

            function newMessageAdded() {
                //try {
                    if (autoScrollStatus === true && settingsQuick["Autoscroll"]) {
                        updateScroll();
                    }
                    timestampAdd();
                    messageParser();
                //} catch (e) {
                //    llamaConsole("error newMessageAdded: " + e.message);
                //}
            }

            function userContextmenuUpdated() {
                try {
                    var elemBottom = 0;
                    var topPos = userContextmenuCSS.getBoundingClientRect().top;
                    var elemBottom = topPos + userContextmenuCSS.offsetHeight;
                    if (elemBottom > (window.innerHeight - 82)) {
                        // userContextmenuCSS.style.top = (userContextmenuCSS.style.top - userlistElem.querySelector("#userlist").scrollTop - 200) + "px";
                        // userContextmenuCSS.style.top = (userlistElem.querySelector("#userlist").scrollTop - window.innerHeight) + "px";
                        userContextmenuCSS.style.top = (window.innerHeight - 82 - userContextmenuCSS.offsetHeight - 15) + "px";
                        // llamaConsole("Change: " + userContextmenuCSS.style.top);
                    }

                    // llamaConsole("elemBottom: " + elemBottom + ". Max: " + (window.innerHeight - 82) + ". offsetHeight: " + userContextmenuCSS.offsetHeight + ". New top: " + (window.innerHeight - 82 - userContextmenuCSS.offsetHeight));
                } catch (e) {
                    llamaConsole("error userContextmenuUpdated: " + e.message);
                }
            }

            function messageParserCheckCSS() {
                try {
                    var messages = chatlogElem.querySelectorAll(messageQueryString);
                    var messagesAmount = messages.length;
                    chatboxHeight = chatlogElem.querySelector("#chat").offsetHeight;
                    var messagesToCheck = messageHeight ? parseInt(chatboxHeight / messageHeight) + 3 : 20;

                    if (messagesAmount > 0) {
                        for (i = messagesAmount - 1; i > ((messagesAmount - messagesToCheck) - 1); i--) {
                            if (i == 0) break;
                            var tcMessageHtmlElem = messages[i].querySelector("tc-message-html").shadowRoot;
                            if (!tcMessageHtmlElem.querySelector("#messageCSS")) tcMessageHtmlElem.appendChild(messageParserAddCSS());
                            if (settingsQuick["NightMode"]) tcMessageHtmlElem.querySelector("#html").classList.add("llama-nightmode");
                            if (settingsQuick["NightModeBlack"]) tcMessageHtmlElem.querySelector("#html").classList.add("blacknight");
                        }
                    }
                } catch (e) {
                    llamaConsole("error messageParserCheckCSS: " + e.message);
                }
            }

            function messageParserAddCSS(elem = null) {
                try {
                    var node = document.createElement("style");
                    var textnode = document.createTextNode(messageCSS);
                    node.appendChild(textnode);
                    node.setAttribute("id", "messageCSS");

                    if (elem) {
                        elem.appendChild(node);
                    } else {
                        return node;
                    }
                } catch (e) {
                    llamaConsole("error messageParserAddCSS: " + e.message);
                }
            }

            function getCurrentTime(){
                var timestamp = new Date().toLocaleTimeString('en-US', {
                    hour12: false
                });
                return timestamp;
            }
            // START TOKE TIMERS
            let current_timer = false;
            let current_tokers = [];
            function liveTimer(current_time) {
                //llamaConsole(current_time)
                current_timer = true;
                current_time = (current_time-1)
                var liveTimer = setInterval(function() {
                    if(current_time >= 1) {
                        runLiveTimer(current_time);
                        current_time = (current_time-1);
                        chatlogCSS.querySelector('#liveTimer').setAttribute('style', '')
                    } else {
                        clearInterval(liveTimer)
                        chatlogCSS.querySelector('#liveTimer').innerHTML = ''
                        chatlogCSS.querySelector('#liveTimer').setAttribute('style', 'display: none;')
                        current_timer = false;
                        current_tokers = []
                    }
                }, 1000)
            }

            function runLiveTimer(current_time) {
                let timer_box = chatlogCSS.querySelector('#liveTimer')
                let displayTime = current_time.toString();
                timer_box.innerHTML = displayTime + ' seconds until tokes!';
                current_time = (current_time-1)
            }
            let MessageQueueList = [];


            function messageParser() {
                //try {
                    let message_starter = "<a href='#' class='avatar'><div><img src='https://cdn1.iconfinder.com/data/icons/MetroStation-PNG/128/MB__Llama.png' style='left: 0px;'></div></a><a href='#' class='nickname' data-status=''>Tiny-Llama</a> <div class='content'><span id='html' class='message common llama-systemMsg' data-mode=''>";
                    let message_ender = '</span></div>'
                    latestMessageElem = chatlogElem.querySelector(messageQueryString + ":last-of-type");

                    var typeSystem = false;
                    var typeTinyLlamaSystem = false;

                    if (latestMessageElem != null) {
                        if (!messageHeight) {
                            messageHeight = latestMessageElem.scrollHeight;
                            chatboxHeight = chatlogElem.querySelector("#chat").offsetHeight;
                        }

                        if (latestMessageElem.classList.contains("system")) {
                            typeSystem = true;
                            //latestMessageElem.classList.add('d-none')
                            //chatlogCSS.querySelector('#systemMessageLog').appendChild(latestMessageElem)
                        }

                        if (latestMessageElem.classList.contains("llama-systemMsg")) {
                            typeTinyLlamaSystem = true;
                        }

                        //console.log(latestMessageElem.classList)
                        latestMessageElem.setAttribute("id", "msg-" + messageCount);
                        messageCount++;

                        if (!typeSystem) {
                            var latestMessageNickElem = latestMessageElem.querySelector(".nickname");
                            if(latestMessageNickElem){var latestMessageNick = latestMessageNickElem.innerHTML} else {var latestMessageNick = '';};
                        } else {
                            latestMessageNick = "&system";
                        }

                        if (latestMessageElem.querySelector("tc-message-html")) {
                        tcMessageHtmlElem = latestMessageElem.querySelector("tc-message-html").shadowRoot;
                        latestMessageContentElem = tcMessageHtmlElem.querySelector("#html");
                        //llamaConsole(latestMessageContentElem.innerHTML)

                        if(latestMessageContentElem.innerHTML.startsWith("!join")) {
                            let current_chat_log = chatlogElem.querySelector("#chat-content > dom-repeat")
                            //add users to tokers []
                            if(current_timer === true) {
                                if(current_tokers.includes(latestMessageNick)) {
                                    let new_system_msg = document.createElement("div");
                                    new_system_msg.classList.add("llama-systemMSG", "message", "common");
                                    new_system_msg.innerHTML = "<span id='timestamp'>[" + getCurrentTime() + "]</span>" + message_starter + latestMessageNick + ", you've already joined the toke! <br> Have patience young padawan!" + message_ender;
                                    chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                                } else {
                                    let new_system_msg = document.createElement("div");
                                    new_system_msg.classList.add("llama-systemMSG", "message", "common");
                                    new_system_msg.innerHTML = "<span id='timestamp'>[" + getCurrentTime() + "]</span>" + message_starter + latestMessageNick + " has joined the toke!" + message_ender;
                                    chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                                    current_tokers.push(latestMessageNick)
                                }
                            }
                        }

                        if(latestMessageContentElem.innerHTML.startsWith("!toke")) {
                            let current_chat_log = chatlogElem.querySelector("#chat-content > dom-repeat")
                            if(current_timer === true) {
                                if(current_tokers.includes(latestMessageNick)) {
                                    let new_system_msg = document.createElement("div");
                                    new_system_msg.classList.add("llama-systemMSG", "message", "common");
                                    new_system_msg.innerHTML = "<span id='timestamp'>[" + getCurrentTime() + "]</span>" + message_starter + latestMessageNick + ", Timer has already started, and you've already joined! What more do you want from me?!" + message_ender;
                                    chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                                } else {
                                    let new_system_msg = document.createElement("div");
                                    new_system_msg.classList.add("llama-systemMSG", "message", "common");
                                    new_system_msg.innerHTML = "<span id='timestamp'>[" + getCurrentTime() + "]</span>" + message_starter + latestMessageNick + " 🔥 Timer already started! Adding you to timer! " + message_ender;
                                    chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                                    current_tokers.push(latestMessageNick)
                                }
                            } else {
                            if(current_tokers.includes(latestMessageNick)) {} else {current_tokers.push(latestMessageNick)}
                            let latestMessageContentArray = latestMessageContentElem.innerHTML.split(' ')
                            let sent_time = 30;
                            if(latestMessageContentArray[1]) {
                                sent_time = latestMessageContentArray[1]
                            }
                            liveTimer(sent_time.toString())
                            let new_system_msg = document.createElement("div");
                            new_system_msg.classList.add("llama-systemMSG", "message", "common");
                            new_system_msg.innerHTML = "<span id='timestamp'>Started: " + getCurrentTime() + "</span>" + message_starter + " 🔥 TOKE TIMER STARTED!" + message_ender;
                            chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                            new_system_msg = document.createElement("div");
                            new_system_msg.classList.add("llama-systemMSG", "message", "common");
                            new_system_msg.innerHTML = "<span id='timestamp'></span> " + message_starter + latestMessageNick + " has started a <strong>" + sent_time + "</strong> second toke timer!" + message_ender;
                            chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)

                            let current_int = (latestMessageContentArray[1]*1000)
                            if(latestMessageContentArray[1] > 5) {
                                let repeat_amount = (latestMessageContentArray[1]/2)
                                repeat_amount = (repeat_amount*1000)
                                let repeat_timer_msg = setInterval(function(){
                                let new_system_msg = document.createElement("div");
                                    new_system_msg.classList.add("llama-systemMSG", "message", "common");
                                    new_system_msg.innerHTML = "<span id='timestamp'></span> " + message_starter + " ⌛ TIMER IS HALF WAY DONE! <br> JOIN NOW USING !join" + message_ender;
                                    chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                                    clearInterval(repeat_timer_msg)
                                }, repeat_amount)
                            }

                            let current_timer = setInterval(function(){
                                let new_system_msg = document.createElement("div");
                                    new_system_msg.classList.add("llama-systemMSG", "message", "common");
                                var count = 0;
                                for(var i = 0; i < current_tokers.length; ++i){
                                    if(current_tokers[i] == 2)
                                        count++;
                                }
                                if(count > 1) {
                                    new_system_msg.innerHTML = "<span class='timestamp'></span> " + message_starter + " 🔥 " + current_tokers.toString() + ", IT's TIME TO TOKE! CHEERS! 🔥" + message_ender;
                                } else {
                                    new_system_msg.innerHTML = "<span class='timestamp'></span> " + message_starter + " 🔥 " + current_tokers.toString() + ", IT's TIME TO TOKE! CHEERS! 🔥" + message_ender;
                                }
                                //let test
                                //chatlogCSS.querySelector('#systemMessageLog').appendChild(new_system_msg);
                                chatlogElem.querySelector("#chat-content").insertBefore(new_system_msg, current_chat_log)
                                clearInterval(current_timer)
                            }, (current_int-1))
                        }}

                        if (!tcMessageHtmlElem.querySelector("#messageCSS")) {
                            messageParserAddCSS(tcMessageHtmlElem);
                        }
                        if (settingsQuick["NightMode"]) latestMessageContentElem.classList.add("llama-nightmode");
                        if (settingsQuick["NightModeBlack"]) latestMessageContentElem.classList.add("blacknight");

                        }
                        latestMessageContent = latestMessageContentElem.innerHTML;

                        latestMessageContent.includes(" banned ") || latestMessageContent.includes(" kicked ") ? latestMessageElem.classList.add("dontHide") : void(0);

                        if (settingsQuick["MentionsMonitor"]) {
                            if (!(settingMentions.length == 1 && settingMentions[0] == "")) {
                                for (i = 0; i < settingMentions.length; i++) {
                                    if (latestMessageContent.toLowerCase().includes(settingMentions[i].toLowerCase())) {
                                        latestMessageContentElem.classList.add("llama-mention-message");
                                        if (settingsQuick["PinkMode"]) {
                                            pinkPop.play();
                                        }
                                        if (settingsQuick["FeatureOneMode"]) {
                                            weedPop.play();
                                        } else {
                                            audioPop.play();
                                        }
                                        llamaConsole('MENTION: "' + settingMentions[i] + '" : ' + latestMessageContent);
                                        break;
                                    }
                                }
                            }
                        }
                    }

                //} catch (e) {
               //     llamaConsole("error messageParser: " + e.message);
               // }
            }

            var messagesMO = new MutationObserver(function(e) {
                if (e[0].addedNodes) newMessageAdded();
            });
            messagesMO.observe(chatlogElem.querySelector("#chat-content"), {
                childList: true
            });

            var camsMO = new MutationObserver(function(e) {
                if (e[0].addedNodes) newCamAdded();
            });
            camsMO.observe(videolistElem.querySelector(".videos-items:last-child"), {
                childList: true
            });

            var userContextmenuMO = new MutationObserver(function(e) {
                if (e[0].addedNodes) userContextmenuUpdated();
            });
            userContextmenuMO.observe(userContextmenuCSS, {
                attributes: true
            });

            var chatTextboxMO = new MutationObserver(function(e) {
                if (e[0].addedNodes) chatboxSwitch();
            });
            chatTextboxMO.observe(chatlogElem.querySelector("#chat-instant"), {
                attributes: true,
                attributeFilter: ['class'],
                childList: false,
                characterData: false
            });

            var userlistMO = new MutationObserver(function(e) {
                if (e[0].addedNodes) newUserAdded();
            });
            userlistMO.observe(userlistElem.querySelector("#userlist"), {
                childList: true
            });

            function chatboxSwitch() {
                messageParserCheckCSS();
                return;

                // if (chatlistElem.querySelector("#chat-instant-button")) chatlistElem.querySelector("#chat-instant-button").classList.add("llama-loading");
                try {
                    chatboxPM = (chatlogElem.querySelector("#chat-instant").getAttribute("class") == "show");
                    chatboxPM ? chatlogCSS.classList.add("llama-chatboxPM") : chatlogCSS.classList.remove("llama-chatboxPM");
                    messageParserCheckCSS();
                } catch (e) {
                    llamaConsole("error chatboxSwitch: " + e.message)
                };
            }

            function timestampAdd(opt = null) {
                try {
                    var SHOW_SECONDS = true;

                    var date = new Date();
                    var hours = date.getHours();
                    var minutes = date.getMinutes().toString();
                    var secs = date.getSeconds().toString();

                    if (hours > 11) {
                        hours = (hours % 12 || 12);
                        var period = "pm";
                    } else {
                        var period = "am";
                    }

                    if (hours == "0") {
                        hours = "12";
                    }
                    if (minutes == "0") {
                        minutes = "00";
                    }
                    if (minutes.length == 1) {
                        minutes = "0" + minutes;
                    }
                    if (secs.length == 1) {
                        secs = "0" + secs;
                    }

                    if (SHOW_SECONDS == true) {
                        var timestamp = hours + ":" + minutes + ":" + secs + "" + period;
                    } else {
                        var timestamp = hours + ":" + minutes + period;
                    }

                    if (opt == "return") return;

                    var queryString = messageQueryString + ".common:last-of-type .nickname";
                    if (chatlogElem.querySelector(queryString) != null) {
                        var recentMsgNickname = chatlogElem.querySelector(queryString);
                        recentMsgNickname.insertAdjacentHTML("afterend", "<span id='timestamp'> " + timestamp + "</span>");
                    }
                } catch (e) {
                    llamaConsole("error timestampAdd: " + e.message);
                }
            }

            function newUserAdded(opt = null) {
                try {
                    if (!userlistElem.querySelector("#userlist .list-item")) return;
                    var usersElems = userlistElem.querySelectorAll("#userlist .list-item");
                    userCount = usersElems.length;

                    setTimeout(function() {
                        for (i = 0; i < usersElems.length; i++) {
                            var userNickItem = usersElems[i].querySelector(".nickname");
                            var userNick = userNickItem.innerHTML;

                            userNickItem.classList.remove("llama-myNick");
                            //if (userNick == myNick) {
                            //	userNickItem.classList.add("llama-myNick");
                            //}
                        }
                    }, 500);

                    if (opt == "scanOnly") {
                        return;
                    } else {
                        if (!userlistElem.querySelector("#llama-userCount")) {
                            userCountParElem = userlistElem.querySelector("#header > span");
                            userCountElem = document.createElement("span");
                            userCountElem.setAttribute("id", "llama-userCount");
                            userCountElem.innerHTML = "(" + userCount + ")";
                            userCountParElem.appendChild(userCountElem);
                            userCountElem = userlistElem.querySelector("#llama-userCount");
                        } else {
                            userCountElem.innerHTML = "(" + userCount + ")";
                        }
                    }
                } catch (e) {
                    llamaConsole("error newUserAdded: " + e.message);
                }
            }

            function newCamAdded() {
                try {
                    if (videolistElem.querySelector(camQueryString)) var camElems = videolistElem.querySelectorAll(camQueryString);
                    else return;

                    camsCount = 0;

                    for (i = 0; i < camElems.length; i++) {
                        camsCount = i + 1;
                        var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
                        var camItemCSS = camItem.querySelector(".video");
                        if (settingsQuick["NightMode"]) camItemCSS.classList.add("llama-nightmode");
                        else camItemCSS.classList.remove("llama-nightmode");
                        if (settingsQuick["NightModeBlack"]) camItemCSS.classList.add("blacknight");
                        else camItemCSS.classList.remove("blacknight");
                        if (settingsQuick["BorderlessCams"]) camItemCSS.classList.add("llama-borderlesscams");
                        if (settingsQuick["RoundedCams"]) camItemCSS.classList.add("llama-roundedcams");
                        else camItemCSS.classList.remove("llama-borderlesscams");

                        if (!camItem.querySelector("#camItemCSS")) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);

                        var camName = camItem.querySelector(".nickname").getAttribute("title");
                        camElems[i].setAttribute("id", "camUser-" + camName);

                        // Cam maxing
                        try {
                            if (camItem.querySelector(".icon-llama-max")) {
                                var maxbutton = camItem.querySelector(".icon-llama-max");
                                maxbutton.parentNode.removeChild(maxbutton);
                            }
                            camItem.querySelector(".icon-resize").insertAdjacentHTML("beforebegin", camMaxButtonHtml);
                            camItem.querySelector(".icon-llama-max").setAttribute("id", "maxbutton-" + camName);
                            var maxCamVar = function(maxCamVarArg) {
                                videolistElem.querySelector(".videos-items:last-child").classList.remove("llama-max-noAnim");
                                maximizeCam(maxCamVarArg, "buttonpress");
                            };
                            camItem.querySelector("#maxbutton-" + camName).addEventListener("click", maxCamVar.bind(this, camName));

                            if (camMaxedCurrent == camName) {
                                camElems[i].classList.add("llama-maxedCam");
                                camElems[i].parentElement.classList.add("llama-max");
                            }
                            if (!videolistElem.querySelector(".llama-maxedCam")) camElems[i].parentElement.classList.remove("llama-max");

                            if (videolistCSS.querySelector("#camMaxCSS")) {
                                var maxcss = videolistCSS.querySelector("#camMaxCSS");
                                maxcss.parentNode.removeChild(maxcss);
                            }
                            videolistCSS.insertAdjacentHTML("beforeend", camMaxCSShtml);

                        } catch (e) {
                            llamaConsole("error newCamAdded: " + e.message);
                        }

                        // Cam closing
                        try {
                            if (camItem.querySelector(".icon-llama-close")) {
                                var closebutton = camItem.querySelector(".icon-llama-close");
                                closebutton.parentNode.removeChild(closebutton);
                            }
                            camItem.querySelector(".icon-resize").insertAdjacentHTML("beforebegin", camCloseButtonHtml);
                            camItem.querySelector(".icon-llama-close").setAttribute("id", "closebutton-" + camName);
                            var closeCamVar = function(closeCamVarArg) {
                                videolistElem.querySelector(".videos-items:last-child").classList.remove("llama-close-noAnim");
                                closeimizeCam(closeCamVarArg, "buttonpress2");
                            };
                            camItem.querySelector("#closebutton-" + camName).addEventListener("click", closeCamVar.bind(this, camName));

                            if (camClosedCurrent == camName) {
                                camElems[i].classList.add("llama-closedCam");
                                camElems[i].parentElement.classList.add("llama-close");
                            }
                            if (!videolistElem.querySelector(".llama-closedCam")) camElems[i].parentElement.classList.remove("llama-close");

                            if (videolistCSS.querySelector("#camCloseCSS")) {
                                var closecss = videolistCSS.querySelector("#camCloseCSS");
                                closecss.parentNode.removeChild(closecss);
                            }
                            videolistCSS.insertAdjacentHTML("beforeend", camCloseCSShtml);

                        } catch (e) {
                            llamaConsole("error newCamAdded: " + e.message);
                        }

                        if (settingsQuick["HideAllCams"] == "true" || urlPars.get("hideallcams") == "") {
                            camItem.querySelector("button.icon-visibility").click();
                            llamaConsole("Cam hide: " + camName);
                        }

                        camCounter(camElems[i]);
                    }
                } catch (e) {
                    llamaConsole("error newCamAdded: " + e.message);
                }
            }

            function maximizeCam(camName, opt = null) {
                try {
                    if (camName != camMaxedCurrent && camMaxedCurrent != null) {
                        maximizeCam(camMaxedCurrent);
                        maximizeCam(camName);
                        return;
                    }

                    var camElem = videolistElem.querySelector("#camUser-" + camName);
                    if (camElem == null) {
                        camMaxedCurrent = null;
                        return;
                    }

                    if (opt == "bbuttonpress") {
                        camElem.parentElement.classList.remove("llama-max-noAnim");
                    }

                    if (camElem.classList.contains("llama-maxedCam")) {
                        camElem.classList.remove("llama-maxedCam");
                        camElem.parentElement.classList.remove("llama-max");
                        camMaxedCurrent = null;
                    } else {
                        camElem.classList.add("llama-maxedCam");
                        camElem.parentElement.classList.add("llama-max");
                        camMaxedCurrent = camName;
                        setTimeout(function() {
                            camElem.parentElement.classList.add("llama-max-noAnim");
                        }, 500);
                    }
                    camCounter(camElem);
                } catch (e) {
                    llamaConsole("error maximizeCam: " + e.message);
                }
            }

            function closeimizeCam(camName, opt = null) {
                try {
                    if (camName != camClosedCurrent && camClosedCurrent != null) {
                        closeimizeCam(camClosedCurrent);
                        closeimizeCam(camName);
                        return;
                    }

                    var camElem = videolistElem.querySelector("#camUser-" + camName);
                    if (camElem == null) {
                        camClosedCurrent = null;
                        return;
                    }

                    if (opt == "bbuttonpress2") {
                        camElem.parentElement.classList.remove("llama-close-noAnim");
                    }

                    if (camElem.classList.contains("llama-closedCam")) {

                        camElem.parentElement.classList.remove("llama-close");
                        camClosedCurrent = null;
                    } else {
                        camElem.classList.add("llama-closedCam");
                        camElem.parentElement.classList.add("llama-close");
                        camClosedCurrent = camName;
                        setTimeout(function() {
                            camElem.parentElement.classList.add("llama-close-noAnim");
                        }, 500);
                    }
                    camCounter(camElem);
                } catch (e) {
                    llamaConsole("error closeimizeCam: " + e.message);
                }
            }

            function closeimizeYoutube(camName, opt = null) {
                try {
                    if (camName != camClosedCurrent && camClosedCurrent != null) {
                        closeimizeCam(camClosedCurrent);
                        closeimizeCam(camName);
                        return;
                    }

                    var camElem = videolistElem.querySelector("#camUser-" + camName);
                    if (camElem == null) {
                        camClosedCurrent = null;
                        return;
                    }

                    if (opt == "bbuttonpress2") {
                        camElem.parentElement.classList.remove("llama-close-noAnim");
                    }

                    if (camElem.classList.contains("llama-closedCam")) {
                        camElem.classList.remove("llama-closedCam");
                        camElem.parentElement.classList.remove("llama-close");
                        camClosedCurrent = null;
                    } else {
                        camElem.classList.add("llama-closedCam");
                        camElem.parentElement.classList.add("llama-close");
                        camClosedCurrent = camName;
                        setTimeout(function() {
                            camElem.parentElement.classList.add("llama-close-noAnim");
                        }, 500);
                    }
                    camCounter(camElem);
                } catch (e) {
                    llamaConsole("error closeimizeCam: " + e.message);
                }
            }

            function camCounter(camElem) {
                try {
                    if (camsCount == 12) {
                        camElem.parentElement.classList.remove("llama-camCount10-11");
                        camElem.parentElement.classList.remove("llama-camCount2");

                        camElem.parentElement.classList.add("llama-camCount12");
                    } else if (camsCount > 9 && camsCount < 12) {
                        camElem.parentElement.classList.remove("llama-camCount12");
                        camElem.parentElement.classList.remove("llama-camCount2");

                        camElem.parentElement.classList.add("llama-camCount10-11");
                    } else if (camsCount == 2) {
                        camElem.parentElement.classList.remove("llama-camCount12");
                        camElem.parentElement.classList.remove("llama-camCount10-11");

                        camElem.parentElement.classList.add("llama-camCount2");
                    } else {
                        camElem.parentElement.classList.remove("llama-camCount12");
                        camElem.parentElement.classList.remove("llama-camCount10-11");
                        camElem.parentElement.classList.remove("llama-camCount2");
                    }
                } catch (e) {
                    llamaConsole("error camCounter: " + e.message);
                }
            }
        } catch (e) {
            llamaConsole("error runLLAMA: " + e.message);
        }
        /* End main function */
        return {
            newUserAdded: newUserAdded
        };
    }

    function llamaConsole(m) {
        try {
            if (m.includes("error ")) {
                var m = m.split("error ")[1];
                console.log("TINY-LLAMA " + "%cerror" + "%c" + ": " + m, "font-weight: bold; color: #53b6ef;", "color: red;", "");
            } else {
                console.log("TINY-LLAMA: " + "%c" + m, "font-weight: bold; color: #53b6ef;", "");
            }
        } catch (e) {
            console.log("------ LLAMA error llamaConsole: " + e.message);
        }
    }

    function play() {
        try {
            var audio = document.getElementById("audio");
            audio.play();
        } catch (e) {
            llamaConsole.log("error Audio Play" + e.message);
        }
    }

    function addtonewbox(m){
        llamaConsole(m)
        //get message array #
        //delete message
    }
    function LLAMA_SocketWatcher() {
        try {
            wsdata = [];
            chatlogMain = "";
            userlistLog = {};
            usernamesLog = [];
            userlistLogQuits = {};
            newline = `
`;
            WebSocket.prototype._send = WebSocket.prototype.send;
            // Parse Data Sent
            WebSocket.prototype.send = function(data) {
                try {
                    this._send(data);
                    this.addEventListener('message', function(msg) {
                         var msg_parsed = JSON.parse(msg.data);
                    try {
                        if (msg.data.includes('"tc" : "joined"')) {
                            myNick = msg_parsed["self"]["nick"];
                            myHandle = msg_parsed["self"]["handle"];
                        }

                        if (msg.data.includes('"tc" : "msg"') && msg.data.includes('"handle"')) {
                            var handle = msg_parsed["handle"];
                            var nick = userlistLog[handle]["nick"];

                            chatlogAdd(nick + ": " + msg_parsed["text"]);

                            //addMessageToNewChatbox(handle, nick, msg_parsed["text"]);
                        }

                        if (msg.data.includes('"tc" : "pvtmsg"') && msg.data.includes('"handle"')) {
                            var handle = msg_parsed["handle"];
                            var nick = userlistLog[handle]["nick"];

                            chatlogAdd('[' + nick + "]: " + msg_parsed["text"]);

                            //addMessageToNewChatbox(handle, nick, msg_parsed["text"], true);
                        }

                        if (msg.data.match(/"tc" : "(?:un)?publish"/)) {
                            var action = (msg_parsed["tc"] == "publish") ? "is" : "stopped";
                            var handle = msg_parsed["handle"];

                            if (userlistLog[handle]) var nick = userlistLog[handle]["nick"];
                            else var nick = userlistLogQuits[handle]["nick"];

                            chatlogAdd("- " + nick + " " + action + " broadcasting.");
                        }

                        if (msg.data.includes('"tc" : "sysmsg"')) {
                            chatlogAdd("[SYSTEM] -> " + msg_parsed["text"]);
                            addtonewbox("[SYSTEM] -> " + msg_parsed["text"])
                        }

                        if (msg.data.includes('"tc" : "userlist"')) {
                            userlistArr = msg_parsed["users"];
                            for (i = 0; i < userlistArr.length; i++) {
                                var nick = userlistArr[i]["nick"];
                                var handle = userlistArr[i]["handle"];
                                var username = userlistArr[i]["username"];
                                var isMod = userlistArr[i]["mod"];

                                userlistLog[handle] = {
                                    "nick": nick,
                                    "username": username,
                                    "mod": isMod
                                };
                                var isMod = isMod == true ? "[MOD]" : "";
                                var logtext = username == "" ? nick : nick + "(" + username + ")";
                                logtext += isMod;
                                usernamesLog.push(logtext);
                            }

                            userlistInitial = usernamesLog.join(', ');
                            usersCountInitial = usernamesLog.length;
                        }

                        if (msg.data.includes('"tc" : "join","username":"')) {
                            var nick = msg_parsed["nick"];
                            var handle = msg_parsed["handle"];
                            var username = msg_parsed["username"];
                            var isMod = msg_parsed["mod"];
                            userlistLog[handle] = {
                                "nick": nick,
                                "username": username,
                                "mod": isMod
                            };

                            //TESapp.ignoreFromManualList(username, nick);
                        }

                        if (msg.data.includes('"tc" : "quit"')) {
                            var handle = msg_parsed["handle"];
                            userlistLogQuits[handle] = userlistLog[handle];
                            delete userlistLog[handle];
                        }

                        if (msg.data.includes('"tc" : "nick"')) {
                            var handle = msg_parsed["handle"];
                            var nick = msg_parsed["nick"];

                            userlistLog[handle]["nick"] = nick;
                            if (handle == myHandle) {
                                myNick = nick;
                            }

                            //TESapp.newUserAdded("scanOnly");
                        }

                        if (msg.data.includes('"item"')) {
                            if (msg.data.includes('tc" : "yut_play"')) {
                                var id = msg_parsed["item"]["id"];
                                chatlogAdd("- YouTube video started: " + "https://youtube.com/watch?v=" + id);
                            }
                            if (msg.data.includes('tc" : "yut_stop"')) chatlogAdd("- YouTube video stopped.");
                        }
                    } catch(e) {
                        llamaConsole("error WebSocket.prototype.send function: " + e.message);
                    }
                    }, false);
                    this.send = function(data) {
                        this._send(data);
                    };

                } catch (e) {
                    llamaConsole("error LLAMA_SocketWatcher -> WebSocket.prototype.send: " + e.message);
                }
            }

            function chatlogAdd(arg) {
                var timestamp = new Date().toLocaleTimeString('en-US', {
                    hour12: false
                });
                chatlogMain += "[" + timestamp + "] " + arg + newline;
                llamaConsole(arg + newline)
            }

        } catch (e) {
            llamaConsole("error LLAMA_SocketWatcher: " + e.message);
        }
    }



} else

{//homepage css
    (function() {
        var css = [
            ".left-arrow.active:before, .right-arrow.active:before {",
            "    border-color: #111111 !important;",
            "}",
            ".left-arrow:before, .right-arrow:before {",
            "    border-color: #111111 !important;",
            "}",
            "body {",
            "        background-color: #333333 !important;",
            "}",
            "",
            "#welcome-wrapper {",
            "    width: 100% !important;",
            "    max-width: none !important;",
            "    padding: 0 !important;",
            "    border-bottom: 1px solid #e5e5e5 !important;",
            "    box-sizing: border-box !important;",
            "    background-color: #666666 !important;",
            "    height: 10px !important;",
            "    display: none !important;",
            "}",
            "#navigation {",
            "    position: relative !important;",
            "    display: block !important;",
            "    top: -25px !important;",
            "    left: 0px !important;",
            "    right: 30px !important;",
            "    margin: 0 auto !important;",
            "    font-size: 0 !important;",
            "    text-align: center !important;",
            "    z-index: 6 !important;",
            "    width: 650px !important;",
            "}",
            "#promoted-wrapper > #promote-button {",
            "    max-width: 200px !important;",
            "    margin: 10px auto 0px !important;",

            "}",
            "#nav-static-wrapper {",
            "    position: relative !important;",
            "    height: 87px !important;",
            "    width: 100% !important;",
            "    background-color: #222222 !important;",
            "    opacity: 0.95 !important;",
            "    z-index: 2 !important;",
            "    border:0px !important;",
            "}",
            "#nav-static {",
            "    position: relative !important;",
            "    height: 100% !important;",
            "    max-width: 1300px !important;",
            "    margin: 0 auto !important;",
            "    padding: 0 30px !important;",
            "    border-bottom: 2px solid #000 !important;",
            "    box-sizing: border-box !important;",
            "    line-height: 87px !important;",
            "    vertical-align: middle !important;",
            "    border-radius:10px !important;",
            "}",
            "#nav-fixed {",
            "    position: relative !important;",
            "    height: 60px !important;",
            "    max-width: 1300px !important;",
            "    margin: auto !important;",
            "    padding: 0 30px !important;",
            "    border-bottom: 1px solid #111111 !important;",
            "    line-height: 60px !important;",
            "}",
            "#nav-fixed-wrapper {",
            "    position: fixed !important;",
            "    height: 60px !important;",
            "    width: 100% !important;",
            "    top: -400px !important;",
            "    left: 0 !important;",
            "    font-family: \"Open Sans\" !important;",
            "    background-color: #111111 !important;",
            "    opacity: 0.95 !important;",
            "    z-index: 2 !important;",
            "    transition: top .3s !important;",
            "        border-bottom: 0px solid #e9e9e9 !important;",
            "}",
            ".tile-header {",
            "    height: 195px !important;",
            "    outline: 0px solid #111111 !important;",
            "",
            "}",
            ".tile-header > img {",
            "    height: 195px !important;",
            "    outline: 0px solid #111111 !important;",
            "",
            "}",
            ".tile {",
            "    position: relative !important;",
            "    border-radius: 15px !important;",
            "    background-color: #222222 !important;",
            "    border:0px solid #666666 !important;",
            "    box-shadow: 0 2px 15px 0 #111111 !important;",
            "    overflow: hidden !important;",
            "",
            "}",
            "#promoted-left-arrow, #promoted-right-arrow {",
            "    display: none !important;",
            "}",
            "#promoted-tiles {",
            "    position: relative !important;",
            "    left: -100px !important;",
            "    overflow: visible !important;",
            "}",
            ".trended-tiles {",
            "    position: relative !important;",
            "    border-radius: 4px !important;",
            "    background-color: #222222 !important;",
            "    border:2px solid #111111 !important;",
            "    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .1) !important;",
            "    overflow: hidden;",
            "",
            "}",
            ".tile-content {",
            "    display: block !important;",
            "    width: 100% !important;",
            "    padding: 29px 23px 35px 17px !important;",
            "    box-sizing: border-box !important;",
            "    /* text-align: left !important; */",
            "    overflow: hidden !important;",
            "}",
            ".tile-content-info{",
            "    height: 40px !important;",
            "}",
            "",
            ".tile-content-info-text{",
            "    color: #666666 !important;",
            "    position: relative !important;",
            "    bottom: 20px !important;",
            "}",
            "",
            ".tile-name {",
            "   /* background-color:#111111 !important;*/ ",
            "    padding-top: 0px !important;",
            "    font-size: 20px !important;",
            "    white-space: nowrap !important;",
            "    position: relative;",
            "    left: 80px;",
            "    top: 160px;",
            "   /* box-shadow: 0 2px 15px 0 #111111 !important;*/",
            "    border-bottom: 0px solid #666666 !important;",
            "}",
            ".tile-content > img {",
            "    position: relative !important;",
            "    bottom: 20px !important;",
            "    padding-top: 0px !important;",
            "    border-radius: 10PX !important;",
            "/*DISPLAY: NONE !important;8",
            "VISIBILITY: HIDDEN !important;*/",
            "}",
            ".tile-info {",
            "    position: absolute !important;",
            "    display: block !important;",
            "    height: 195px !important;",
            "    width: 110% !important;",
            "    bottom: 0 !important;",
            "    left: -20px !important;",
            "    font-weight: 600 !important;",
            "    color: #ffffff !important;",
            "    text-shadow: 0 1px 3px rgba(0, 0, 0, .4) !important;",
            "    box-shadow: 0 2px 15px 0 #111111 !important;",
            "}",
            "#catalog-wrapper {",
            "    position: relative;",
            "    display: block;",
            "    max-width: none;",
            "    padding: 10px 160px 50px;",
            "    margin-top: -145px;",
            "}",
            ".tile-statistic {",
            "    border-radius: 10px !important;",
            "    text-align: left !important;",
            "    position: relative !important;",
            "    top: 135px !important;",
            "    left:0px !important;",
            "    padding-top: 0px !important;",
            "    width:100px !important;",
            "    height: 25px !important;",
            "    font-size: 0 !important;",
            "    text-shadow: 0 1px 3px rgba(0, 0, 0, .4) !important;",
            "    background-color:#111111 !important; ",
            "    white-space: nowrap !important;",
            "    border: 1px solid #232323 !important;",
            "}",
            "",
            "#promoted-wrapper, #trended-wrapper {",
            " ",
            "    position: relative !important;",
            "    display: none;",
            "    width: 100% !important;",
            "    max-width: 1360px !important;",
            "    margin: 0 auto !important;",
            "    padding-bottom:20px !important;",
            "    border-bottom:3px solid #ffb000 !important;",
            "    border-radius: 15px !important;",
            "",
            "}",
            "",
            "#promoted .tile-promoted, #trended .tile-promoted {",
            "    position: absolute !important;",
            "    bottom: 20px !important;",
            "/* display:none; */",
            "/* visibility: hidden !important;*/}",
            "",
            "#no-rooms-error {",
            "    padding-top: 33px !important;",
            "    font-family: Roboto !important;",
            "    font-weight: 300 !important;",
            "    font-size: 40px !important;",
            "    color: #ffffff !important;",
            "}",
            "#footer-content {",
            "    max-width: 1300px !important;",
            "    margin: 0 auto !important;",
            "    padding: 0px 0px 0px !important;",
            "    font-size: 11px !important;",
            "    color: #333333 !important;",
            "}",
            "#footer-content-wrapper {",
            "    background-color: #333333 !important;",
            "    display: none !important;",
            "    visibility: hidden !important;",
            "}",
            "#footer {",
            "    position: relative !important;",
            "    height: 0px !important;",
            "    width: 100% !important;",
            "    padding: 0 !important;",
            "    background-color: #333333 !important;",
            "    border-top: 1px solid #111111 !important;",
            "    display: none !important;",
            "    visibility: hidden !important;",
            "}",
            "#footer-social {",
            "    position: absolute !important;",
            "    width: 650px !important;",
            "    min-height: 54px !important;",
            "    top: -30px !important;",
            "    left: 30px !important;",
            "    right: 30px !important;",
            "    margin: 0 auto !important;",
            "    text-align: center !important;",
            "    border: 1px solid #e1e1e1 !important;",
            "    background-color: #fff !important;",
            "    color: transparent !important;",
            "    display: none !important;",
            "    visibility: hidden !important;",
            "}",
            ".nav-menu-links, .nav-menu-links {",
            "	font-weight: bold !important;",
            "	display: none !important;",
            "}",
            ".nav-menu-links > a {",
            "    position: relative !important;",
            "    height: 100% !important;",
            "    padding: 0 1% !important;",
            "    box-sizing: border-box !important;",
            "    color: #FFFFFF !important;",
            "    transition: color .2s !important;",
            "    	font-weight: bold !important;",
            "}",
            ".nav-menu-links > a:before {",
            "    content: \"\" !important;",
            "    position: absolute !important;",
            "    display: block !important;",
            "    height: 4px !important;",
            "    width: 100% !important;",
            "    bottom: -1px !important;",
            "    left: 0 !important;",
            "    color: #111111 !important;",
            "    background-color: #111111 !important;",
            "    cursor: default !important;",
            "    opacity: 0 !important;",
            "    transition: opacity .2s !important;",
            "}",
            ".nav-menu-links > a:hover, .nav-menu-links > a.active {",
            "    color: #111111 !important;",
            "}",
            ".nav-btn-sign-on {",
            "    position: absolute !important;",
            "    right: -30px !important;",
            "    top: 25px;",
            "}",
            ".nav-btn-instant-room {",
            "    font-family: \"Open Sans\" !important;",
            "    border: 1px solid #111111 !important;",
            "    background-color: #111111 !important;",
            "    color: #fff !important;",
            "    margin-right: 20px !important;",
            "    position: absolute !important;",
            "    right: 50px !important;",
            "    top: 25px;",
            "}",
            "#navigation > .not-selectable:hover {",
            "    background-color: #111111 !important;",
            "    border: 1px solid #FFFFFF !important;",
            "    color: white !important;",
            "}",
            "#promoted-wrapper > h2, #trended-wrapper > h2, #header-for-all {",
            "    padding: 0 0 11px 5px !important;",
            "    font-size: 20px !important;",
            "    line-height: 27px !important;",
            "    color: #fff !important;",
            "    text-transform: uppercase !important;",
            "    text-align: left !important;",
            "    font-weight: bold !important;",
            "    text-shadow: 0 1px 3px rgba(0, 0, 0, .4) !important;",
            "}",
            "#input-catalog-menu-all:checked ~ #navigation > label[for=\"input-catalog-menu-all\"], #input-catalog-menu-near-you:checked ~ #navigation > label[for=\"input-catalog-menu-near-you\"], #input-catalog-menu-most-gifted:checked ~ #navigation > label[for=\"input-catalog-menu-most-gifted\"] {",
            "    background-color: #111111 !important;",
            "    border:1px solid #111111 !important;",
            "    z-index: 1 !important;",
            "    font-weight: bold !important;",
            "    border-radius:25px;",
            "    margin:5px;",
            "}",
            "#navigation > label[for=\"input-catalog-navigation\"] {",
            "    display: none !important;",
            "    border-radius:25px;",
            "    margin:5px;",
            "}",
            "#navigation > label {",
            "    position: relative !important;",
            "    display: inline-block !important;",
            "    height: 40px !important;",
            "    width: 193px !important;",
            "    background-color: #222222 !important;",
            "    border: 1px solid #fff !important;",
            "    font-size: 17px !important;",
            "    color: #fff !important;",
            "    cursor: pointer !important;",
            "    z-index: 1 !important;",
            "    transition: .2s !important;",
            "    border-radius:25px;",
            "    margin:5px;",
            "}",
            ".nav-sandwich-menu-button:before {",
            "    height: 5px !important;",
            "    width: 100% !important;",
            "    top: 4px !important;",
            "    left: 0 !important;",
            "    background-color: #111111 !important;",
            "}",
            ".nav-sandwich-menu-button {",
            "",
            "    background-color: #222222 !important;",
            "",
            "}",
            ".nav-sandwich-menu-button:after {",
            "    height: 5px !important;",
            "    width: 100% !important;",
            "    top: 4px !important;",
            "    left: 0 !important;",
            "    background-color: #111111 !important;",
            "    bottom: 4px !important;",
            "}",
            "#loadmore {",
            "    height: 48px !important;",
            "    font-size: 16px !important;",
            "    color: #fff !important;",
            "    background-color: #111111 !important;",
            "    line-height: 48px !important;",
            "    vertical-align: middle !important;",
            "    transition: background-color .2s !important;",
            "}",
            "#content > h1 {",
            "    text-transform: uppercase;",
            "    font-weight: 600 !important;",
            "    color: #fff !important;",
            "}",
            "#content > #wrapper-forms {",
            "    background-color: #222222 !important;",
            "}",
            "#content {",
            "    background-color: #333333 !important;",
            "    padding-bottom: 0px !important;",
            "}",
            "#content-page-content {",
            "    background-color: transparent !important;",
            "}",
            "#content {",
            "    top:100px !important;",
            "}",
            "#content-page-menu {",
            "    background-color: #666666 !important;",
            "    box-shadow: 0 2px 15px 0 #111111 !important;",
            "}",
            "#content-page-menu > a:hover, #content-page-menu > a.active {",
            "    background-color: #333333 !important;",
            "    color: #fff !important;",
            "}",
            "#wrapper {",
            "    background-color: #222222 !important;",
            "}",
            "#up-button-content:hover {",
            "    background-color:#000 !important;",
            "}",
            "#content > * {",
            "    background-color: #222222 !important;",
            "	 /*background-image: url(https://image.ibb.co/mCRLCT/Wallpaper_Here.jpg);*/",
            "    background-attachment: fixed;",
            "    background-position: center;",
            "}",
            "#live-broadcasts-wrapper > div {",
            "    background-color: #222222 !important;",
            "}",
            ".tile-gold, .tile-extreme, .tile-pro {",
            "    text-align: left; !important;",
            "    top: 2px !important;",
            "}",
            "#live-broadcasts-wrapper {",
            "    background-color: #222222 !important;",
            "}"
        ].join("\n");
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
            addStyle(css);
        } else {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
    })();
}
