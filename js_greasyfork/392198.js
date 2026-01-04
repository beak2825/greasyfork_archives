// ==UserScript==
// @name        JES (jumpin.chat enhancement suite)
// @namespace   FAT
// @version     0.24
// @description Fixes some jumpin.chat shortcomings and adds useful features.  Examples: Dark mode, maximise cams, streamlines the user interface, toggle user list, alert phrase highlighting and sound alerts, and more!
// @author      Some obese nerd
// @match       https://jumpin.chat/*
// @match       https://jumpinchat.com/*
// @exclude     https://jumpin.chat/contact
// @exclude     https://jumpin.chat/directory
// @exclude     https://jumpin.chat/help*
// @exclude     https://jumpin.chat/login
// @exclude     https://jumpin.chat/privacy
// @exclude     https://jumpin.chat/profile*
// @exclude     https://jumpin.chat/register
// @exclude     https://jumpin.chat/support*
// @exclude     https://jumpin.chat/terms
// @exclude     https://jumpinchat.com/contact
// @exclude     https://jumpinchat.com/directory
// @exclude     https://jumpinchat.com/help*
// @exclude     https://jumpinchat.com/login
// @exclude     https://jumpinchat.com/privacy
// @exclude     https://jumpinchat.com/profile*
// @exclude     https://jumpinchat.com/register
// @exclude     https://jumpinchat.com/support*
// @exclude     https://jumpinchat.com/terms
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/392198/JES%20%28jumpinchat%20enhancement%20suite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392198/JES%20%28jumpinchat%20enhancement%20suite%29.meta.js
// ==/UserScript==

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
        var settingsValue = GM_getValue('jes-settings');

        if (typeof settingsValue !== 'undefined') {
            Object.assign(Settings, JSON.parse(settingsValue));
        }
    }

    function SaveSettings() {
        GM_setValue('jes-settings', JSON.stringify(Settings));
    }

    function ApplyStyleFixes() {
        $('body').append(`<style>.app {
overflow: hidden;
}
.room {
grid-template-rows: 0 calc(100% - 300px) fit-content(300px);
}
.room.layout--horizontal {
grid-template-rows: 0 100%;
}
.room.jes-horiztonal-no-user-list {
grid-template-columns: 1fr 1fr 40rem;
}
.cams__Header {
background: transparent;
padding-left: 0;
}
.cams__RoomInfo {
visibility: hidden;
flex-grow: 1;
}
.cams__RoomInfo div {
display: none;
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
#jes-settings,
#jes-settings:hover {
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
#jes-settings:hover {
position: absolute;
width: 500px;
display: block;
border: 1px solid #9E9E9E;
}
#jes-settings .text {
width: 90%;
}
#jes-settings .jic-checkbox {
width: 24px;
height: 24px;
margin-right: 4px;
}
#jes-settings .jes-setting-container {
display: none;
margin: 8px;
}
#jes-settings:hover .jes-setting-container {
display: block;
}
#jes-settings-gear {
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
#jes-settings-gear:hover {
cursor: pointer;
}
#jes-settings:hover #jes-settings-gear {
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
.jes-maximise-cam-option {
position: absolute;
left: 0.5em;
top: 1em;
opacity: 0;
}
.jes-expand-cam-option {
position: absolute;
left: 0.5em;
top: 2.5em;
opacity: 0;    
}
.cams__CamWrapper:hover .jes-maximise-cam-option,
.cams__CamWrapper:hover .jes-expand-cam-option {
opacity: 1;
}
.jes-expanded-cam-layout {
align-content: flex-start;
}
.jes-maximised-cam-layout .cams__CamWrapper {
display: none;
}
.jes-expanded-cam {
width: 38vw !important;
height: calc((38vw / 4) * 3) !important;
}
.jes-maximised-cam {
display: inline-block !important;
width: 100% !important;
height: 100% !important;
}
.jes-alert {
border-left: 5px solid red;
border-radius: 5px;
}
.jes-dark-mode .cams {
background: #000;
}
.jes-dark-mode .cams__Cam,
.jes-dark-mode .chat__FeedWrapper {
background: #101010;
}
.jes-dark-mode .chat__Header {
background: #000;
border-top: 1px solid #444;
}
.jes-dark-mode .chat__InputWrapper,
.jes-dark-mode .privateMessages__Wrapper,
.jes-dark-mode .privateMessages__Empty, 
.jes-dark-mode .modal__Body input {
background: #101010;
}
.layout--horizontal .chat__UserList, 
.chat__InputWrapper {
border-color: #444;
}
.jes-dark-mode .chat__UserList {
background-color: #000;
color: #9E9E9E;
}
.jes-dark-mode .modal__Body input,
.jes-dark-mode .chat__InputWrapper input {
color: white;
}
.jes-dark-mode .chat__InputWrapper {
background: #050505;
}
.jes-dark-mode .modal__Body {
background: #111;
}
body.jes-dark-mode {
color: #ccc;
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
            $('body').append(`<div id='jesNameOverlayStyle'><style>
.cams__CamHandle {
opacity: 0;
}
.cams__CamWrapper:hover .cams__CamHandle {
opacity: 1;
}</style></div>`);
        } else {
            $('#jesNameOverlayStyle').remove();
        }
    }

    function ToggleUserList(show) {
        if (show) {
            $('.room.layout--horizontal').removeClass('jes-horiztonal-no-user-list');
            $('.chat__UserList').stop(true, true).animate({ width: '20rem' }, 200, function() {});
        } else {
            $('.room.layout--horizontal').addClass('jes-horiztonal-no-user-list');
            $('.chat__UserList').stop(true, true).animate({ width: '1px' }, 200, function() {});
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
                    chatMessageNode.addClass('jes-alert');

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

    function ApplyUserMenuBindings() {
        $('.chat__UserList, .chat__UserList > *').mouseover(function() {
            if (!Settings.ShowUserList) {
                ToggleUserList(true);    
            }
        });

        $('.chat__UserList, .chat__UserList > *').mouseout(function() {
            if (!Settings.ShowUserList) {
                ToggleUserList(false);
            }
        });
    }

    function FixUserMenu() {
        const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && (mutation.addedNodes[0].className.includes('chat__UserList') || mutation.addedNodes[0].className.includes('privateMessages__Wrapper'))) {
                    if (!Settings.ShowUserList) {
                        $('.chat__UserList').css('width', '1px');
                    }

                    ApplyUserMenuBindings();
                    HighlightChatMessages();
                }
            }
        };

        Observe($('.chat__Body')[0], { attributes: false, childList: true, subtree: false }, callback);
    }

    function CamWheel(elem, event) {
        if (event.originalEvent.wheelDelta > 0 && elem.hasClass('jes-expanded-cam')) {
            return;
        } else if (event.originalEvent.wheelDelta < 0 && !elem.hasClass('jes-expanded-cam')) {
            return;
        }

        ToggleEnlargeCam(elem, event);
    }

    function ToggleEnlargeCam(cam) {
        cam.toggleClass('jes-expanded-cam');

        if (cam.parent().find('.jes-expanded-cam').length > 0) {
            cam.parent().addClass('jes-expanded-cam-layout');
        } else {
            cam.parent().removeClass('jes-expanded-cam-layout');
        }
    }

    function CamBind(element) {
        var cam = $(element);
        cam.find('.cams__FullscreenOption').before(`<button class="cams__CamControl jes-maximise-cam-option" type="button" title="Maximise"><i class="fa fa-expand-arrows-alt" aria-hidden="true"></i></button>
                <button class="cams__CamControl jes-expand-cam-option" type="button" title="Expand"><i class="fa fa-search-plus" aria-hidden="true"></i></button>`);
        cam.find('.jes-maximise-cam-option').click(function() {
            cam.toggleClass('jes-maximised-cam');
            cam.parent().toggleClass('jes-maximised-cam-layout');
        });
        cam.find('.jes-expand-cam-option').click(function() {
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

                    var maxCamLayout = $('.jes-maximised-cam-layout');
                    if (maxCamLayout.length > 0 && $('.jes-maximised-cam').length === 0) {
                        maxCamLayout.removeClass('jes-maximised-cam-layout');
                    }

                    var expandedCamLayout = $('.jes-expanded-cam-layout');
                    if (expandedCamLayout.length > 0 && $('.jes-expanded-cam').length === 0) {
                        expandedCamLayout.removeClass('jes-expanded-cam-layout');
                    }
                }
            }
        };

        Observe(document.getElementById('cam-wrapper'), { attributes: false, childList: true, subtree: false }, callback);
    }

    function ToggleDarkMode() {
        $('body').toggleClass('jes-dark-mode');
    }

    function SetupControls() {
        var settingsContainer = $('.cams__Header');

        settingsContainer.prepend($(`<div id="jes-settings" class="noselect">
    <div id="jes-settings-gear" title="Jumpin.chat Enhancement Suite Settings" class="fa fa-gear"></div>
    <div class="jes-setting-container">JES (jumpin.chat enhancement suite)</div>
    <div class="jes-setting-container">
        <label for="jes-cam-name-overlay"><input id="jes-cam-name-overlay" class="jic-checkbox" type="checkbox">Cam names</label>
    </div>
    <div class="jes-setting-container">
        <label for="jes-show-user-list"><input id="jes-show-user-list" class="jic-checkbox" type="checkbox">Show user list</label>
    </div>
    <div class="jes-setting-container">
        <label for="jes-dark-mode"><input id="jes-dark-mode" class="jic-checkbox" type="checkbox">Dark mode</label>
    </div>
    <div class="jes-setting-container">
        <label for="jes-alert-phrases"><input id="jes-alert-phrases" class="jic-checkbox" type="checkbox">Alert phrases</label>
        <div class="inputcontainer">
            <input id="jes-alert-phrases-text" class="text" placeholder="enter alert phrases here"><button id="jes-alert-phrases-button" class="save button-blue">save</button>
        </div>
    </div>
</div>`));

        $('#jes-cam-name-overlay').click(function() {
            Settings.CamNameOverlay = $(this).is(':checked');
            ToggleNameOverlay(Settings.CamNameOverlay);
            SaveSettings();
        });

        $('#jes-show-user-list').click(function() {
            Settings.ShowUserList = $(this).is(':checked');
            ToggleUserList(Settings.ShowUserList);
            SaveSettings();
        });

        $('#jes-alert-phrases').click(function() {
            Settings.AlertPhrases = $(this).is(':checked');
            SaveSettings();
        });

        $('#jes-dark-mode').click(function() {
            Settings.DarkMode = $(this).is(':checked');
            ToggleDarkMode();
            SaveSettings();
        });

        $('#jes-alert-phrases-button').click(function() {
            var alertPhrases = $('#jes-alert-phrases-text').val().split(',');
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
                    ToggleUserList(false);
                }
            }, 200);
        }

        ApplyUserMenuBindings();

        if (Settings.CamNameOverlay) {
            $('#jes-cam-name-overlay').click();
        } else {
            ToggleNameOverlay(false);
        }

        if (Settings.ShowUserList) {
            $('#jes-show-user-list').click();
        }

        if (Settings.AlertPhrases) {
            $('#jes-alert-phrases').click();
        }

        $('#jes-alert-phrases-text').val(Settings.AlertPhrasesText.join(','));

        if (Settings.DarkMode) {
            $('#jes-dark-mode').click();
        }
    }

    function Init() {
        var waitForControls = setInterval(function(){
            var controls = $('.chat__Share');
            if (controls && controls.length > 0) {
                clearInterval(waitForControls);
                FixUserMenu();
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