// ==UserScript==
// @name         TWatch: Twitch Chat Watcher
// @namespace    https://github.com/jakebathman/TWatch
// @version      v1.3.1
// @description  Watch Twitch chat for certain users, any @mentions of you, or certain watched words, and play a sound/alert when one is posted. HUGE thanks to ihavebeenasleep for his script AntiKappa, which was very helpful in building this one.
// @author       Jake Bathman (Twitter: @jakebathman, Reddit: /u/ironrectangle, Twitch: jakebathman)
// @supportURL   https://github.com/jakebathman/TWatch/issues
// @include      http*://www.twitch.tv*
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/alertify.min.js
// @resource     alertifyCSS https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/alertify.min.css
// @resource     alertifyCSSDefault https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/default.min.css
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40597/TWatch%3A%20Twitch%20Chat%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/40597/TWatch%3A%20Twitch%20Chat%20Watcher.meta.js
// ==/UserScript==
/* jshint -W097 */

/***

   OH MY GOD WHERE DID MY SETTINGS GO?!!

   If you updated this script from an older version, the "config" section below might not have your stuff anymore.

   This is a crappy side effect of Tampermonkey scripts, and there's not a very good way to handle it.

   BUT: We might be able to get them back. Follow these steps:

     1. Go to twitch.tv
     2. Open up DevTools Console by pressing F12 or right-clicking the page and selecting "Inspect"
     3. Click the "Application" tab at the top (it might be hiding behind the >> icon)
     4. Expand the "Local Storage" section
     5. Find the "Key" called "TWatchSettings:v1.0.0" (if there are multiple, find the highest version number)
     6. Copy the "Value" next to that key and paste below into the "config" section, like this:

        var Twatch = {
          config:
          {
            // Paste it here, removing any duplicate keys like "watchTheseUsers" that already exist
          },

          ...
        }

   Hopefully this works, and I'm sorry if it didn't. Again, there's not a very good way to handle user configs when a script needs updating.

   If you have trouble, find me on Twitter @jakebathman or open an issue on GitHub at https://github.com/jakebathman/TWatch/issues

***/

var TWatch = {
    config:
    {
        //  || ||                                || ||
        //  || ||   CHANGE SETTINGS BELOW HERE   || ||
        //  \/ \/                                \/ \/

        // Any user here will be watched for a post (based on their name in-chat)
        // This is case-insensitive (e.g. "JaKebAThmAn" works for "jakebathman")
        watchTheseUsers: [
            'jakebathman', 'drlupo',
        ],

        // Any word here will be watched in any chat message
        // This is also case-insensitive
        watchTheseWords: [
            'giveaway', 'twitch prime',
        ],

        // By default, alerts will never auto-dismiss. This means you have to click each message to make it go away
        // If you want certain alerts to go away automatically, put the number of seconds below for that
        // type of alert (e.g. "mentionTimeout: 5" will dismiss alerts of @mentions of you after 5 seconds)
        mentionTimeout: 0,
        wordTimeout: 0,
        userTimeout: 0,

        // Other options and settings that you can change, but the defaults are probably fine
        sendAlertOnLoad: true, // after the script is loaded, an alert is shown so that you know everything's working
    },

    //  /\ /\                                /\ /\
    //  || ||   CHANGE SETTINGS ABOVE HERE   || ||
    //  || ||                                || ||

    messageArray: [],
    debugModeBool: true,
    scriptVersion: 'v1.3.1'
};


/*****************************************

     DON'T CHANGE ANYTHING BELOW HERE

*****************************************/

// Store the user config in localStorage for this script version
// This ensures we don't have any lost configs if the script gets updated
localStorage.setItem('TWatchSettings:' + TWatch.scriptVersion, JSON.stringify(TWatch.config));

// Include Alertify.js and styles
// Learn more: http://alertifyjs.com/notifier.html
$("head").append(
    '<script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/alertify.min.js"></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/alertify.min.css"/><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/default.min.css"/>'
);

// If you're in theater mode, the normal alert box will be invisible (underneath the chat)
$("head").append(
    '<style>.alertify-notifier{z-index:99999;}.auto-close-timer{font-size:9px;opacity:.5;margin-bottom:-12px;margin-top:5px;}.alertify-notifier a{word-wrap: break-word;text-decoration: underline;}.ajs-error a{color: cyan !important;}</style>'
);


// Specify the alert defaults (most arean't changed, but don't edit this unless you know what you're doing. Stuff will break.)
alertify.defaults = {
    // dialogs defaults
    autoReset: true,
    basic: false,
    closable: true,
    closableByDimmer: true,
    frameless: false,
    maintainFocus: true, // <== global default not per instance, applies to all dialogs
    maximizable: true,
    modal: true,
    movable: true,
    moveBounded: false,
    overflow: true,
    padding: true,
    pinnable: true,
    pinned: true,
    preventBodyShift: false, // <== global default not per instance, applies to all dialogs
    resizable: true,
    startMaximized: false,
    transition: 'zoom',

    // notifier defaults
    notifier: {
        // auto-dismiss wait time (in seconds)
        delay: 30,
        // default position
        position: 'top-right',
        // adds a close button to notifier messages
        closeButton: false
    },

    // language resources
    glossary: {
        // dialogs default title
        title: 'AlertifyJS',
        // ok button text
        ok: 'OK',
        // cancel button text
        cancel: 'Cancel'
    },

    // theme settings
    theme: {
        // class name attached to prompt dialog input textbox.
        input: 'ajs-input',
        // class name attached to ok button
        ok: 'ajs-ok',
        // class name attached to cancel button
        cancel: 'ajs-cancel'
    }
};

$(function () {
    'use strict';

    if (self !== top) {
        // In an iframe, probably an ad modal, so let's quit
        return;
    }

    console.log('TWatch script loaded!');

    TWatch.logDebugMessage = function (message) {
        if (TWatch.debugModeBool) {
            console.log("TWatch - " + message);
        }
    };

    TWatch.mainLoop = function () {
        TWatch.checkMessages();
    };

    TWatch.checkMessages = function () {
        var isMention = false;

        // Check for a mention or watched user first, and don't filter those ever
        $('span.chat-author__display-name:not(.TWatchChecked), span.mention-fragment--recipient:not(.TWatchChecked)').each(function () {
            var $message = $(this);
            var messageText = $message.closest('div.chat-line__message').text().replace(/(\d\d?\:\d\d)(.*)/g, "$1 - $2");
            var audioformsg = new Audio();
            if ($message.data('aTarget') == "chat-message-mention") {
                // Play sound for @mentions

                audioformsg.src = 'https://emoji-cheat-sheet.campfirenow.com/sounds/bell.mp3';
                audioformsg.autoplay = true;
                $message.addClass('TWatchChecked');
                $message.parent().addClass('TWatchChecked');

                TWatch.showTimeout(alertify.notify(
                    "<strong>You were mentioned!</strong><br />" + TWatch.prepareText(messageText) + "<div class='auto-close-timer'></div>",
                    'error',
                    TWatch.config.mentionTimeout
                ), TWatch.config.mentionTimeout);

            } else if ($message.data('aTarget') == "chat-message-username") {
                $message.addClass('TWatchChecked');
                $message.parent().addClass('TWatchChecked');

                if (TWatch.isWatchedUser($message.text()) === true) {
                    // Play sound for watched users

                    audioformsg.src = 'https://jakebathman.com/sounds/robot-blip.mp3';
                    audioformsg.autoplay = true;

                    TWatch.showTimeout(alertify.notify(
                        '<strong>Watched user!</strong><br />' + TWatch.prepareText(messageText) + "<div class='auto-close-timer'></div>",
                        'warning',
                        TWatch.config.userTimeout
                    ), TWatch.config.userTimeout);

                }
            }
        });

        if (isMention === false) {
            $('div.chat-line__message > span:not(.TWatchChecked)').each(function () {
                var $message = $(this);
                var messageText = $message.closest('div.chat-line__message').text().replace(/(\d\d?\:\d\d)(.*)/g, "$1 - $2");
                if ($message.data('aTarget') == "chat-message-text") {
                    var $parent = $message.parent();
                    if (TWatch.hasWatchedWord($message.text())) {
                        var audioformsg = new Audio();
                        audioformsg.src = 'https://jakebathman.com/sounds/robot-blip.mp3';
                        audioformsg.autoplay = true;

                        TWatch.showTimeout(alertify.notify(
                            '<strong>Watched word!</strong><br />' + TWatch.prepareText(messageText) + "<div class='auto-close-timer'></div>",
                            'notify',
                            TWatch.config.wordTimeout
                        ), TWatch.config.wordTimeout);
                    }

                    // Mark the message so we don't keep checking it
                    $message.addClass('TWatchChecked');
                    $parent.addClass('TWatchChecked');
                    TWatch.messageArray.push($message.text());
                }
            });
        }

    };

    TWatch.prepareText = function (text) {
        var matches = text.match(/Ban (.*?)Timeout/i);

        if (matches != null) {
            // matched text: match[0]
            // match start: match.index
            // capturing group n: match[n]
            var username = matches[1];
            var re = new RegExp("Ban "+matches[1]+"\s*?Timeout "+matches[1]);
            text = text.replace(re,'');
        }

        text = text.replace(/\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/, '<a href="$&" target="_blank">$&</a>');
        return text;
    };

    TWatch.isMention = function (text) {
        if (text.toUpperCase().indexOf(TWatch.username) > -1) {
            TWatch.logDebugMessage("Mention!");
            return true;
        }
    };

    TWatch.isWatchedUser = function (text) {
        for (var i = 0; i < TWatch.config.watchTheseUsers.length; i++) {
            if (text.toUpperCase().trim() == TWatch.config.watchTheseUsers[i].toUpperCase().trim()) {
                TWatch.logDebugMessage("Watched user!");
                return true;
            }
        }
    };

    TWatch.hasWatchedWord = function (text) {
        for (var i = 0; i < TWatch.config.watchTheseWords.length; i++) {
            if (text.toUpperCase().trim().indexOf(TWatch.config.watchTheseWords[i].toUpperCase().trim()) > -1) {
                TWatch.logDebugMessage("Watched word!");
                return true;
            }
        }
    };

    TWatch.showTimeout = function(msg, duration){
        if(duration > 0){
            var tick = 250;
            var interval = setInterval(function(){
                if(Math.floor(duration) < 0){
                    clearInterval(interval);
                }
                else{
                    duration = duration - (tick / 1000);
                    var sec = "seconds";
                    if(Math.floor(duration) == 1){
                        sec  = "second";
                    }

                    if(Math.floor(duration) == 0){
                        $(msg.element).find('div.auto-close-timer').html('Automatically closing right meow');
                    }
                    else {
                        $(msg.element).find('div.auto-close-timer').html('Automagically closing in ' + Math.floor(duration) + ' ' + sec);
                    }
                }
            }, tick);
        }
    };

    TWatch.purgeEntries = function () {
        TWatch.messageArray = [];
    };

    // Run the main function every 200ms
    setInterval(TWatch.mainLoop, 200);

    // Remove old stuff every 10 minutes
    setInterval(TWatch.purgeEntries, 1000 * 60 * 10);

    if (TWatch.config.sendAlertOnLoad === true) {
        // Make sure this isn't loaded into an ad iframe

        TWatch.showTimeout(alertify.notify(
            '<strong>TWatch Is Ready!</strong><br />TWatch is locked and loaded, and will alert you for watched users, words, and @mentions (based on your settings).<br /><br /><strong>Need help? Go to <a href="https://github.com/jakebathman/TWatch" target="_blank">github.com/jakebathman/TWatch</a></strong><div class="auto-close-timer"></div>',
            'warning',
            15
        ), 15);
    }
});