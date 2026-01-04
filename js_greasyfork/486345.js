// ==UserScript==
// @name         Useful Twitch Toggles
// @description  Attempt at making shortcuts for Twitch. "w" is set to make viewable screen bigger, and "p" is set to toggle chat popped out into seperate window.
// @version      6
// @namespace    twitch.popoutchat.and.fullscreen
// @author       Snorlaxing
// @match        http*://*.twitch.tv/*
// @match        http*://twitch.tv/*
// @match        http*://*twitch.tv
// @match        http*://*.twitch.tv/*
// @exclude      https://www.twitch.tv/popout/*/chat?popout=
// @exclude      https://www.twitch.tv/popout/*/chat?popout=
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486345/Useful%20Twitch%20Toggles.user.js
// @updateURL https://update.greasyfork.org/scripts/486345/Useful%20Twitch%20Toggles.meta.js
// ==/UserScript==


function wait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

async function fixMarginTopAfterLoad(time, el, amt) {
    await wait(time);
    el.style.marginTop = amt;

}

(function() {
    'use strict';

    let currentPage = location.href;

    // listen for changes
    setInterval(function()
                {
        if (currentPage != location.href)
        {
            // page has changed, set new page as 'current'
            currentPage = location.href;
            console.log('Url has changed, reloading script');
            setup();

            if (poppedOut) {
                //attempt to change popOut to new chat
                var regexp = /(https?:\/\/www\.twitch\.tv\/)(\w+)\w*/g;
                var url = window.location.href;
                var result = [...url.matchAll(regexp)];
                var newUrl = result[0][1] + 'popout/' + result[0][2] + '/chat?popout='
                chatWindow.document.location.href = newUrl;
            }
        }
    }, 500);

    //globals
    var $ = window.jQuery;
    var fullScreenToggle = 'w';
    var popOutToggle = 'p';
    var toggles = [popOutToggle, fullScreenToggle];
    var poppedOut = false;
    var theatreMode = false;
    var mainWindow = window;
    var chatWindow = null;
    var closeChatIfLeavingStreamingChannel = true;

    //elements for theatre mode
    var previousMaxHeight = null;
    var topNav = null;
    var leftSideNav = null;
    var expandChatButton = null;
    var videoDiv = null;
    var mainPlayer = null;
    var persistentPlayer = null;
    var rootInfo = null;
    var onStreamer = false;

    //tracking for keyboard inputs
    var newKeyPressed = false;
    var singleLetter = true;
    var keyTimer = null;

    /*
    * This function is called whenever a key press is recorded.
    */
    function catchKeys(e) {
        //call to determine whether you are actually typing or pressing toggle key.
        registerToggleKeyPress(e);
    }


    /*
    * This function fills in all the global variables and handles closing chat if move to home page.
    * Change closeChatIfLeavingStreamingChannel to false, if you do not want chat to auto close when
    * you move to twitch home page or similar.
    */
    function setup() {

        console.log('Running script setup');
        window.removeEventListener("keydown", catchKeys, true);
        if (window.location.pathname.split('/').length > 1 && document.querySelectorAll('.channel-root--watch').length > 0) {

            onStreamer = true;
            console.log('On twitch streamer page, continuing setup');
            previousMaxHeight = document.querySelector('.persistent-player').style.maxHeight;
            topNav = document.querySelector('[data-a-target="top-nav-container"]');
            leftSideNav = document.querySelector('[data-test-selector="side-nav"]');
            expandChatButton = document.querySelector('.toggle-visibility__right-column');
            videoDiv = document.querySelector('.video-player__container--resize-calc');
            mainPlayer = document.querySelector('div.channel-root__player');
            persistentPlayer = document.querySelector('.persistent-player');
            rootInfo = document.querySelector('.channel-root__info');
            //document.addEventListener("keydown", catchKeys, true);
            window.addEventListener("keydown", catchKeys, false);

        } else {
            console.log('On home or other twitch page, no need to setup');
            onStreamer = false;
            if (poppedOut && chatWindow != null && closeChatIfLeavingStreamingChannel) {
                chatWindow.close();
            }
        }
    }


    /*
    * This function determines whether a single keyboard key was pressed or whether
    * user was typing.
    */
    function registerToggleKeyPress(e) {
        if (e.target != null) {
            //tpying into chat
            if (e.target.getAttribute('data-a-target') == 'chat-input') {
                return;
            }

            //tpying into input field
            try {
                if (isInputOrText(e.target)) {
                    return;
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        //Otherwise, record time between keys until typing stops.
        if (keyTimer != null) {
            clearInterval(keyTimer);
            singleLetter = false;
        }
        newKeyPressed = true;
        keyTimer = setInterval(function() {
            if (!newKeyPressed) {

                clearInterval(keyTimer);
                if (singleLetter && toggles.includes(e.key)) {
                    console.log('Registered toggle key ' + e.key + ' pressed');
                    handleToggles(e);
                }

                keyTimer = null;
                singleLetter = true;
            }
            newKeyPressed = false;
        }, 400);
    }

    /*
    * This function handles the individual toggles.
    */
    function handleToggles(e) {
        if (e.key === fullScreenToggle && onStreamer) {
            if (theatreMode) {
                console.log('exit theatre mode');
                exitTheatreMode();
            } else if (!theatreMode) {
                console.log('enter theatre mode');
                enterTheatreMode();
            }
        } else if (e.key === popOutToggle && onStreamer) {
            if (!poppedOut && chatWindow == null) {
                popOutChat();
            } else {
                showChatOnSide();
            }
        }
    }

    function isInputOrText(element) {
        var tagName = element.tagName.toLowerCase();
        if (tagName === 'textarea') return true;
        if (tagName === 'input') return true;
        if (element.getAttribute('type') != null) {
            var type = element.getAttribute('type').toLowerCase(),
            // if any of these input types is not supported by a browser, it will behave as input type text.
            inputTypes = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week']
            return inputTypes.indexOf(type) >= 0;
        }
        return false;
    }

    setup();


    function exitTheatreMode() {

        topNav.removeAttribute("style");
        topNav.style.height = '5rem';
        leftSideNav.removeAttribute("style");
        expandChatButton.removeAttribute("style");
        expandChatButton.classList.add("kLMGYG");
        mainPlayer.classList.add('channel-root__player');
        mainPlayer.removeAttribute("style");
        videoDiv.removeAttribute("style");
        theatreMode = false;

        //Fixplayer
        persistentPlayer.style.top = '0px'
        persistentPlayer.style.left = '0px'
        persistentPlayer.style.maxHeight = previousMaxHeight;
        persistentPlayer.style.position = 'absolute';
        persistentPlayer.style.overflow = 'hidden';
        persistentPlayer.style.zIndex = '1';
        persistentPlayer.style.height = 'auto';
        persistentPlayer.style.transition = 'transform 0.5s ease 0s';
        persistentPlayer.style.transformOrigin = 'center top';
        persistentPlayer.style.transform = 'scale(1)';
    }

    function enterTheatreMode() {

        //If chat window is showing, close
        var right = document.querySelector('div.channel-root__right-column');
        if (right.classList.contains('channel-root__right-column--expanded')) {
            document.querySelector('[aria-label="Collapse Chat"]').click();
        }

        topNav.style.display = "none ";
        leftSideNav.style.display = "none";
        expandChatButton.style.display = 'none';
        expandChatButton.classList.remove("kLMGYG");
        mainPlayer.classList.remove('channel-root__player');
        mainPlayer.style.height = 'calc(100vh)';
        persistentPlayer.style.maxHeight = 'calc(100vh)';
        videoDiv.style.maxHeight = '100%';
        fixMarginTopAfterLoad(500, rootInfo, '0px');
        persistentPlayer.style.display = 'flex';
        persistentPlayer.style.height = '100%';
        persistentPlayer.style.flexDirection = 'column';
        persistentPlayer.style.justifyContent = 'center';
        persistentPlayer.style.backgroundColor = 'black';
        theatreMode = true;
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function popOutChat() {

        //Get right expand element
        var right = document.querySelector('div.channel-root__right-column');

        //Get site details for popup
        var regexp = /(https?:\/\/www\.twitch\.tv\/)(\w+)\w*/g;
        var url = window.location.href;
        var result = [...url.matchAll(regexp)];
        var newUrl = result[0][1] + 'popout/' + result[0][2] + '/chat?popout='
        chatWindow = window.open(newUrl,'chat','toolbar=0,status=0,height=500,width=400');
        poppedOut = true;

        //Close side panel if open
        if (right.classList.contains('channel-root__right-column--expanded')) {
            document.querySelector('[aria-label="Collapse Chat"]').click();
        }

        console.log('Chat Popped Out');
        //Track new window
        trackNewWindow();
    }

    function showChatOnSide() {
        //if already poppedOut
        if (poppedOut && chatWindow != null) {
            //close chatWindow
            chatWindow.close();
        }

        //Open right Side
        var right = document.querySelector('div.channel-root__right-column');
        if (!right.classList.contains('channel-root__right-column--expanded')) {
            document.querySelector('[aria-label="Expand Chat"]').click();
        }

        console.log('Chat closed and opened in side panel');

    }

    function trackNewWindow() {
        var timer = setInterval(function() {
            if(chatWindow.closed) {
                clearInterval(timer);
                poppedOut = false;
                chatWindow = null;
            }
        }, 1000);
    }
})();