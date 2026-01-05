// ==UserScript==
// @name         Twitch Chat Cleverbot
// @namespace    http://twitchspam.edu/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22864/Twitch%20Chat%20Cleverbot.user.js
// @updateURL https://update.greasyfork.org/scripts/22864/Twitch%20Chat%20Cleverbot.meta.js
// ==/UserScript==

var victimButton = ".button.float-right.qa-chat-buttons__submit.js-chat-buttons__submit";
var victimChatbox = ".js-chat_input.chat_text_input.mousetrap.ember-view.ember-text-area";
var msg = '';
var author = '';
var minDelay = 10000;
var maxDelay = 15000;
var inputTimer;
var isResponding = false;
var atMessage = false;
var optionsWindow;
var cleverbot_window;

$(document).ready(function() {
    $(document).keypress(function(e) {
        if(e.keyCode == 96) {
            loadOptionWindow();
        }
    });
    cleverbot_window = window.open('http://www.cleverbot.com/', 'cleverbot');
    $(cleverbot_window.document).ready(function() {
        inputTimer = Date.now() + getRandInt(minDelay, maxDelay);
        setInterval(spamCleverbot, 1000);
    });
});

function spamCleverbot() {
    if(Date.now() > inputTimer && !isResponding) {
        var chat = document.getElementsByClassName('chat-line');
        msg = chat[chat.length - 1];

        author = msg.getElementsByClassName('from')[0];
        var txt = msg.getElementsByClassName('message')[0];
        var mentions = txt.getElementsByClassName('user-mention');
        var imgs = txt.getElementsByTagName('img');
        var links = txt.getElementsByTagName('a');
        while (mentions[0]) {
            mentions[0].parentNode.removeChild(mentions[0]);
        }
        while (imgs[0]) {
            imgs[0].parentNode.removeChild(imgs[0]);
        }
        while(links[0]) {
            links[0].parentNode.removeChild(links[0]);
        }

        cleverbot_window.document.querySelector('input[name=stimulus]').value = txt.innerHTML;
        cleverbot_window.document.querySelector('input[name=thinkaboutitbutton]').click();
        console.log(author.innerHTML + ':' + txt.innerHTML);

        isResponding = true;
    } else if (isResponding && cleverbot_window.document.querySelector('span#snipTextIcon.yellow')) {
        var response = cleverbot_window.document.getElementById('line1').getElementsByClassName('bot')[0].innerHTML;
        if(atMessage) {
            document.querySelector(victimChatbox).value = '@' + author.innerHTML + ' ' + response;
        } else {
            document.querySelector(victimChatbox).value = response;
        }
        document.querySelector(victimButton).click();
        console.log('CLEVERBOT:' + response);

        isResponding = false;
        inputTimer = Date.now() + getRandInt(minDelay, maxDelay);
    }
}

function loadOptionWindow() {
    optionsWindow = window.open('', 'Cleverbot Options');
    optionsWindow.document.write("<div id='cleverbot-opts'></div>");
    optionsWindow.document.write("<h2>Cleverbot Options</h2>");

    optionsWindow.document.write("<input type='checkbox' name='atMessage' id='atMessage' value='atMessage'>Use the @ when sending a response<br>");

    optionsWindow.document.write("<label for='min-delay'>Min Input Delay</label><br>");
    optionsWindow.document.write("<input type='text' name='min-delay'><br>");

    optionsWindow.document.write("<label for='max-delay'>Max Input Delay</label><br>");
    optionsWindow.document.write("<input type='text' name='max-delay'><br>");

    optionsWindow.document.getElementById('atMessage').checked = atMessage;
    optionsWindow.document.getElementsByName('min-delay')[0].value = minDelay;
    optionsWindow.document.getElementsByName('max-delay')[0].value = maxDelay;

    $(optionsWindow.document).ready( function() {
        $(optionsWindow).unload(saveOptions);
    });
}

function saveOptions() {
    console.log('Saving options...');

    atMessage = optionsWindow.document.getElementById('atMessage').checked;
    var _minDelay = optionsWindow.document.getElementsByName('min-delay')[0].value;
    var _maxDelay = optionsWindow.document.getElementsByName('max-delay')[0].value;
    if(isNumeric(_minDelay) && isNumeric(_maxDelay) && Number(_maxDelay) > Number(_minDelay)) {
        minDelay = Number(_minDelay);
        maxDelay = Number(_maxDelay);
    }
    console.log("atMessage:"+atMessage+" minDelay:"+minDelay+" maxDelay:"+maxDelay);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min)) + min;
}
