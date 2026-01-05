// ==UserScript==
// @name         Twitch Arbitrary Chat Mode
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @description  Hides chat messages unless they roll a D6
// @version      1.1
// @author       nixx quality <nixx@is-fantabulo.us>
// @match        https://twitch.tv/*
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29020/Twitch%20Arbitrary%20Chat%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/29020/Twitch%20Arbitrary%20Chat%20Mode.meta.js
// ==/UserScript==

(function() {
    function setDeceleratingTimeout(callback, factor, times)
    {
        var internalCallback = function(tick, counter) {
            return function() {
                if (--tick >= 0) {
                    window.setTimeout(internalCallback, ++counter * factor);
                    callback();
                }
            };
        }(times, 0);

        window.setTimeout(internalCallback, factor);
    }

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomIntInclusiveNotX(min, max, x) {
        var num;
        do {
            num = getRandomIntInclusive(min, max);
        } while (num == x);
        return num;
    }

    function numberToDie(number) {
        switch (number) {
            case 1:
                return "⚀";
            case 2:
                return "⚁";
            case 3:
                return "⚂";
            case 4:
                return "⚃";
            case 5:
                return "⚄";
            case 6:
                return "⚅";
        }
    }

    function dealWithMessage(messageItem) {
        var turns = getRandomIntInclusive(2, 8);
        var div = messageItem.children[0];
        var messageSpan;
        for (i = 0; i < div.children.length; i++) {
            if (div.children[i].className == "message") {
                messageSpan = div.children[i];
                break;
            }
        }
        var originalMessage = messageSpan.innerHTML; // twitch why do I need to trim manually?
        var lastRoll = getRandomIntInclusive(1, 6);
        messageSpan.innerText = numberToDie(lastRoll);
        messageSpan.classList.add("arbitrary-dice");

        var interv = setDeceleratingTimeout(function() {
            turns = turns - 1;
            var roll = getRandomIntInclusiveNotX(1, 6, lastRoll);
            lastRoll = roll;
            messageSpan.innerText = "•".repeat(messageSpan.innerText.length) + numberToDie(roll);
            if (turns !== 0) return;
            clearInterval(interv);
            if (roll == 6) {
                setTimeout(function() {
                    messageSpan.innerHTML = originalMessage;
                    messageSpan.classList.remove("arbitrary-dice");
                }, 600);
            }
        }, 100, turns);
    }

    setInterval(function() { // go through "unparsed" messages and handle them
        var chatlines = document.getElementsByClassName("chat-lines")[0];
        for (var i = 0; i < chatlines.children.length; i++) {
            var child = chatlines.children[i];
            if (!child.classList.contains("admin")) {
                if (!child.classList.contains("arbitrary")) {
                    dealWithMessage(child);
                    child.classList.add("arbitrary");
                }
            }
        }
    }, 200);

    var css = '.chat-lines > * { display: none; } .chat-lines > .arbitrary, .admin { display: list-item; } .arbitrary-dice { line-height: 12px; vertical-align: middle; font-size: 24px; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
    style.styleSheet.cssText = css;
    } else {
    style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
})();