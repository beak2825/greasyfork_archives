// ==UserScript==
// @name        JumpInChat Plus
// @namespace   FAT
// @version     1.021
// @author      Kaze
// @description Adds convenient functions and changes room theme of JumpInChat. Install and refresh.
// @match       https://jumpin.chat/*
// @exclude     https://jumpin.chat/contact
// @exclude     https://jumpin.chat/directory
// @exclude     https://jumpin.chat/help*
// @exclude     https://jumpin.chat/login
// @exclude     https://jumpin.chat/privacy
// @exclude     https://jumpin.chat/profile*
// @exclude     https://jumpin.chat/register
// @exclude     https://jumpin.chat/support*
// @exclude     https://jumpin.chat/terms
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/391822/JumpInChat%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/391822/JumpInChat%20Plus.meta.js
// ==/UserScript==

var waitInterval = setInterval(function(){
    var headerOptions = document.getElementsByClassName("chat__HeaderOptions")[0];
    if(headerOptions != undefined){
        clearInterval(waitInterval);
        HideButton();
        //constant loop
        var startLoop = setInterval(function (){
            dynamicCheck();
        },100)
    }
},200)



function dynamicCheck(){

        //check for wideLayout
    var room = document.getElementsByClassName("room")[0];
    if (!room.classList.contains("layout--horizontal")){
        room.style.gridTemplateColumns = "";
    }else{
        var userList = document.getElementsByClassName("chat__UserList")[0];
        if (userList.style.display == "none"){
            room.style.gridTemplateColumns = "1fr 1fr 37rem";
        }
    }
}

//Hiding User List
var hideUsers = false;

function HideUserList(){
    var userList = document.getElementsByClassName("chat__UserList")[0];
    var isWide = undefined;
    var chatLayout = undefined;
    try{
        userList = document.getElementsByClassName("chat__UserList")[0];
        chatLayout = document.getElementsByClassName("room layout--horizontal")[0];
        if(chatLayout != undefined){
            isWide = chatLayout.classList.contains("layout--horizontal")
            if (!hideUsers){
                hideUsers = !hideUsers;
                userList.style.display = "none";
                if (isWide){
                    chatLayout.style.gridTemplateColumns = "1fr 1fr 37rem";
                }else{
                    chatLayout.style.gridTemplateColumns = "";
                }
            }else{
                hideUsers = !hideUsers;
                userList.style.display = "block";
                if (isWide){
                    chatLayout.style.gridTemplateColumns = "1fr 1fr 60rem";
                }else{
                    chatLayout.style.gridTemplateColumns = "";
                }
            }
        }
        else{
            chatLayout = document.getElementsByClassName("room")[0];
            if (!hideUsers){
                hideUsers = !hideUsers;
                userList.style.display = "none";
            }else{
                hideUsers = !hideUsers;
                userList.style.display = "block";
            }
            chatLayout.style.gridTemplateColumns = "";
        }
    }catch(e){
        console.log(e);
    }
}

(function() {
    'use strict';
var sourcewrapper = document.getElementsByClassName("mediaSources__SourceWrapper");
sourcewrapper.setAttribute("background-color", "#000");
      })

function HideButton(){
    var headerOptions = document.getElementsByClassName("chat__HeaderOptions")[0];
    var btn = document.createElement("BUTTON");
        btn.setAttribute("id", "hidelist");
        btn.setAttribute("class", "cams__Action button button-floating button-blue");
        btn.addEventListener("click", HideUserList);
        btn.innerHTML = "Hide Userlist";
        headerOptions.appendChild(btn);
    btn.onclick = function() {
    var x = document.getElementById("hidelist");
  if (x.innerHTML === "Hide Userlist") {
    x.innerHTML = "Show Userlist";
  } else {
    x.innerHTML = "Hide Userlist";
  }
    }
}

(function() {
    'use strict';

    var $ = window.jQuery;

    var Settings = {
        CamNameOverlay: false,
        ShowUserList: false,
        DarkMode: false,
        AlertPhrases: false,
        AlertPhrasesText: []
    };

    function LoadSettings() {
        var settingsValue = GM_getValue('plus-settings');

        if (typeof settingsValue !== 'undefined') {
            Object.assign(Settings, JSON.parse(settingsValue));
        }
    }

    function SaveSettings() {
        GM_setValue('plus-settings', JSON.stringify(Settings));
    }

    function ApplyStyleFixes() {
        $('body').append(`<style>
        	.app {
overflow: hidden;
}
.room {
grid-template-rows: 0 calc(100% - 300px) fit-content(300px);
}
.room.layout--horizontal {
grid-template-rows: 0 100%;
}
.cams__Header {
background: transparent;
padding-left: 0;
}
.cams__RoomInfo {
visibility: visible;
flex-grow: 1;
}
.chat__Share .chat__ShareInput,
.chat__Share .chat__ShareCopy,
.cams__CamWatermark,
.roomHeader {
display: none;
}
.cams__CamWrapper {
padding: 0px;
}
.cams__Cam {
border: 0 none;
}
#plus-settings,
#plus-settings:hover {
font-size: 1.2em;
display: flex;
flex-shrink: 0;
position: relative;
left: 0;
top: 0;
background: black;
color: white;
padding: 8px;
width: 24px;
overflow: hidden;
white-space: nowrap;
z-index: 1;
}
#plus-settings:hover {
position: absolute;
width: 500px;
display: block;
border: 1px solid #9E9E9E;
}
input#plus-alert-phrases-text {
    font: inherit;
    color: #fff;
    background-color: #444;
    border: 0;
    height: 1.1875em;
    margin: 8px;
    display: inline;
    padding: 8px 6px 8px;
    min-width: 0;
    box-sizing: content-box;
    width: 80%;
}
#plus-settings .jic-checkbox {
width: 24px;
height: 24px;
margin-right: 4px;
}
#plus-settings .plus-setting-container {
display: none;
margin: 8px;
}
#plus-alert-phrases-button { 
}
#plus-settings:hover .plus-setting-container {
display: block;
}
#plus-settings-gear {
display: block;
width: 24px;
height: 24px;
font-size: 24px;
line-height: 24px;
color: #22add5;
-moz-transition: all 300ms ease-in-out;
-webkit-transition: all 300ms ease-in-out;
-o-transition: all 300ms ease-in-out;
-ms-transition: all 300ms ease-in-out;
transition: all 300ms ease-in-out;
}
#plus-settings-gear:hover {
cursor: pointer;
}
#plus-settings:hover #plus-settings-gear {
transform: rotate(-90deg);
}
.noselect {
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}
.plus-maximise-cam-option {
position: absolute;
left: 0.5em;
top: 1em;
opacity: 0;
}
.plus-expand-cam-option {
position: absolute;
left: 0.5em;
top: 2.5em;
opacity: 0;    
}
.cams__CamWrapper:hover .plus-maximise-cam-option,
.cams__CamWrapper:hover .plus-expand-cam-option {
opacity: 1;
}
.plus-expanded-cam-layout {
align-content: flex-start;
}
.plus-maximised-cam-layout .cams__CamWrapper {
display: none;
}
.plus-expanded-cam {
width: 38vw !important;
height: calc((38vw / 4) * 3) !important;
}
.plus-maximised-cam {
display: inline-block !important;
width: 100% !important;
height: 100% !important;
}
.plus-alert {
border-left: 5px solid red;
border-radius: 5px;
}
    .button-blue {
    background: #00659f!important;
}

html, body {
    background: #000000!important;
}

.modal__Body {
    padding: 2rem 1rem!important;
    background: #0e0e10!important;
}

.button-blue:hover {
    background: #00659f!important;
}

.roomHeader {
    display: none!important;
}

.room.layout--horizontal {
    grid-template-rows: 0px calc(100% - 0px)!important;
}

.cams__Header {
    justify-content: space-between!important;
    height: 40px!important;
    padding: 0 1em!important;
    background: #0e0e10!important;
    color: #ffffff!important;
}

.cams__InfoLabel {
    font-size: .85em!important;
    font-weight: 700!important;
    color: #d9d9d9!important;
}

.cams__Restriction {
    background-color: #00659f!important;
}

.cams__Footer {
    background: #0e0e10!important;
    justify-content: flex-end!important;
}

.chat__Share {
    display: none!important;
}

button#ChatSettings {
    color: #fff!important;
}

.icon--hd {
    color: #fff!important;
}

label.button.chat__HeaderOption.chat__HeaderOption-streamVolume {
    color: #fff!important;
}

.chat__FeedWrapper {
    display: flex!important;
    flex-direction: column!important;
    flex-grow: 1!important;
    background: #000!important;
    padding-left: 8px!important;
}

.chat__Input {
    background-color: #000!important;
}

.input {
    color: #fff!important;
}

.form__Input {
    color: #fff;
    background: #1e1e1e;
}

.chat__InputWrapper {
    border: none!important;
    border-style: none!important;
        background: #000000;
}

.chat__InputAction.button:hover {
    color: #00659f!important;
}

.chat__InputAction.button {
    color: #00659f!important;
    background-color: #000!important;
}

.button-clear:hover {
    color: #00659f!important;
}

.chat__UserList {
    color: #fff!important;
    background: #0e0e10!important;
    font-size: 12px!important;
    padding: 1em!important;
}

.chat__UserListItem {
    border-top: none!important;
}

.layout--horizontal .chat__UserList {
    height: auto!important;
    width: 20rem!important;
    border-left-width: 1px!important;
    border-left-style: none!important;
    border-left-color: #dadfe5!important;
}

.cams__Cam {
    border: none!important;
}

.chat__Message.green {
    color: #2ba55f!important;
}

.chat__Message.yellowalt {
    color: #f5c93c!important;
}

.chat__Message.greenalt {
    color: #55ca1f!important;
}

.chat__Message.redalt {
    color: #ff5b61!important;
}

.chat__Message.purplealt {
    color: #e75998!important;
}

.privateMessages__Empty {
    background: #000!important;
    color: #ffffff!important;
}

.chat__Header {
    background: #0e0e10!important;
    color: #fff!important;
}

.chat__Color-green {
    background-color: #2ba55f!important;
}

.chat__Color-redalt {
    background-color: #ff5b61!important;
}

.chat__Color-greenalt {
    background-color: #55ca1f!important;
}

.chat__Color-yellowalt {
    background-color: #f5c93c!important;
}

.chat__Color-purplealt {
    background-color: #e75998!important;
}

    .settings__Color-green {
        background-color: #2ba55f!important;
    }

    .settings__Color-redalt {
        background-color: #ff5b61!important;
    }

    .settings__Color-greenalt {
        background-color: #55ca1f!important;
    }

    .settings__Color-yellowalt {
        background-color: #f5c93c!important;
    }

    .settings__Color-purplealt {
        background-color: #e75998!important;
    }

.cams__CamWrapper {
padding: 0!important;
}

.cams__CamWatermark {
display: none!important;
}

.cams__CamHandle {
font-size: 1.5em;
textShadow = 0px 0px 4px rgba(0,0,0,1)!important;
}

.settings__PopOver {
    width: 40%;
}

.settings__ChatPreview {
    width: 60%;
    background: black;
    border: #242424 solid 2px;
}

@media (min-width: 2000px){
    .chat__Message {
    font-size: 17px;
    letter-spacing: -0.3px;
  }
}

</style>`);
    }

    function Observe(targetNode, config, callback) {
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        return observer;
    }

    function ToggleNameOverlay(show) {
        if (!show) {
            $('body').append(`<div id='plus-NameOverlayStyle'><style>
.cams__CamHandle {
opacity: 0;
}
.cams__CamWrapper:hover .cams__CamHandle {
opacity: 1;
}</style></div>`);
        } else {
            $('#plus-NameOverlayStyle').remove();
        }
    }

    function PlayNotificationSound() {
        try {
            var notificationSound = new Audio('https://jumpin.chat/sounds/jic-mention.mp3');
            notificationSound.play();
        } catch (e) {
            console.log(e);
        }
    }

    function HighlightChatMessage(chatMessageNode, playSound) {
        var chatMessageBody = chatMessageNode.find('.chat__MessageBody');
        if (!chatMessageBody || chatMessageBody.length === 0) {
            return;
        }
        var chatMessageElements = chatMessageBody.children().not('.chat__MessageHandle');
        if (chatMessageElements && chatMessageElements.length > 0) {
            var text = chatMessageElements.text().toLowerCase();
            for (var i = 0; i < Settings.AlertPhrasesText.length; i++) {
                var phrase = Settings.AlertPhrasesText[i].toLowerCase();
                if (text.includes(phrase)) {
                    chatMessageNode.addClass('plus-alert');

                    if (playSound) {
                        PlayNotificationSound();
                        setTimeout(function() { PlayNotificationSound() }, 150);
                        setTimeout(function() { PlayNotificationSound() }, 300);
                    }

                    break;
                }
            }
        }
    }

    function HighlightChatMessages() {
        if (!Settings.AlertPhrases || Settings.AlertPhrasesText.length === 0) {
            return;
        }

        $('.chat__Message').each(function(index, element) {
            HighlightChatMessage($(element), false);
        });
    }

    function ProcessAlerts() {
        const callback = function (mutationsList, observer) {
            if (!Settings.AlertPhrases || Settings.AlertPhrasesText.length === 0) {
                return;
            }
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node && node.className && node.className.includes('chat__Message')) {
                            HighlightChatMessage($(node), true);
                        }
                    }
                }
            }
        };

        Observe($('.chat__Body')[0], { attributes: false, childList: true, subtree: true }, callback);
    }



    function CamWheel(elem, event) {
        if (event.originalEvent.wheelDelta > 0 && elem.hasClass('plus-expanded-cam')) {
            return;
        } else if (event.originalEvent.wheelDelta < 0 && !elem.hasClass('plus-expanded-cam')) {
            return;
        }

        ToggleEnlargeCam(elem, event);
    }

    function ToggleEnlargeCam(cam) {
        cam.toggleClass('plus-expanded-cam');

        if (cam.parent().find('.plus-expanded-cam').length > 0) {
            cam.parent().addClass('plus-expanded-cam-layout');
        } else {
            cam.parent().removeClass('plus-expanded-cam-layout');
        }
    }

    function CamBind(element) {
        var cam = $(element);
        cam.find('.cams__FullscreenOption').before(`<button class="cams__CamControl plus-maximise-cam-option" type="button" title="Maximise"><i class="fa fa-expand-arrows-alt" aria-hidden="true"></i></button>
                <button class="cams__CamControl plus-expand-cam-option" type="button" title="Expand"><i class="fa fa-search-plus" aria-hidden="true"></i></button>`);
        cam.find('.plus-maximise-cam-option').click(function() {
            cam.toggleClass('plus-maximised-cam');
            cam.parent().toggleClass('plus-maximised-cam-layout');
        });
        cam.find('.plus-expand-cam-option').click(function() {
            ToggleEnlargeCam(cam);
        });

        $(element).bind('mousewheel DOMMouseScroll', function(event){
            CamWheel(cam, event);
        });
    }

    function FixCams() {
        $('#cam-wrapper').sortable();

        const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0) {
                        CamBind(mutation.addedNodes[0]);
                    }

                    var maxCamLayout = $('.plus-maximised-cam-layout');
                    if (maxCamLayout.length > 0 && $('.plus-maximised-cam').length === 0) {
                        maxCamLayout.removeClass('plus-maximised-cam-layout');
                    }

                    var expandedCamLayout = $('.plus-expanded-cam-layout');
                    if (expandedCamLayout.length > 0 && $('.plus-expanded-cam').length === 0) {
                        expandedCamLayout.removeClass('plus-expanded-cam-layout');
                    }
                }
            }
        };

        Observe(document.getElementById('cam-wrapper'), { attributes: false, childList: true, subtree: false }, callback);
    }

    function ToggleDarkMode() {
        $('body').toggleClass('plus-dark-mode');
    }

    function SetupControls() {
        var settingsContainer = $('.cams__Header');

        settingsContainer.prepend($(`
<div id="plus-settings" class="noselect">
    <div id="plus-settings-gear" class="fa fa-gear"></div>
    <div class="plus-setting-container">
        <label for="plus-cam-name-overlay"><input id="plus-cam-name-overlay" class="jic-checkbox" type="checkbox">Always Display Cam Names</label>
    </div>
    <div class="plus-setting-container">
        <label for="plus-alert-phrases"><input id="plus-alert-phrases" class="jic-checkbox" type="checkbox">Alert Phrases<span style="margin-left: 8px; font-size: .75em; opacity:75%;">Add phrases to be notified when they are said in chat.</span></label>
        <div class="inputcontainer">
            <input id="plus-alert-phrases-text" class="text" placeholder="Enter a comma separated list of phrases"><button id="plus-alert-phrases-button" class="save button button-blue">save</button>
        </div>
    </div>
</div>`));

        $('#plus-cam-name-overlay').click(function() {
            Settings.CamNameOverlay = $(this).is(':checked');
            ToggleNameOverlay(Settings.CamNameOverlay);
            SaveSettings();
        });

        $('#plus-alert-phrases').click(function() {
            Settings.AlertPhrases = $(this).is(':checked');
            SaveSettings();
        });

        $('#plus-alert-phrases-button').click(function() {
            var alertPhrases = $('#plus-alert-phrases-text').val().split(',');
            Settings.AlertPhrasesText = [];
            $(alertPhrases).each(function(index, element) {
                if (element !== '' && element !== ',' && Settings.AlertPhrasesText.indexOf(element) === -1) {
                    Settings.AlertPhrasesText.push(element);
                }
            });
            SaveSettings();
        });
    }

    function InitControls() {
        if (!Settings.ShowUserList) {
            var waitForControls = setInterval(function(){
                var controls = $('.chat__UserList');
                if (controls && controls.length > 0 && controls.html() != '') {
                    clearInterval(waitForControls);
                }
            }, 200);
        }


        if (Settings.CamNameOverlay) {
            $('#plus-cam-name-overlay').click();
        } else {
            ToggleNameOverlay(false);
        }

        if (Settings.AlertPhrases) {
            $('#plus-alert-phrases').click();
        }

        $('#plus-alert-phrases-text').val(Settings.AlertPhrasesText.join(','));

        if (Settings.DarkMode) {
            $('#plus-dark-mode').click();
        }
    }

    function Init() {
        var waitForControls = setInterval(function(){
            var controls = $('.chat__Share');
            if (controls && controls.length > 0) {
                clearInterval(waitForControls);
                SetupControls();
                InitControls();
                FixCams();
            }
        }, 200);
    }


    function RunJes() {
        LoadSettings();
        ApplyStyleFixes();
        ProcessAlerts();
        Init();
    }

    var isSiteLoadedCheck = setInterval(function(){
        var controls = $('.chat__Body');
        if (controls && controls.length > 0) {
            clearInterval(isSiteLoadedCheck);
            RunJes();
        }
    }, 200);

})();