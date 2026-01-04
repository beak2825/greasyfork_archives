// ==UserScript==
// @name         ShuffleIt Chatgrab
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Grabs Chat from Shuffle It
// @author       ceviri
// @match        https://dominion.games/
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/381398/ShuffleIt%20Chatgrab.user.js
// @updateURL https://update.greasyfork.org/scripts/381398/ShuffleIt%20Chatgrab.meta.js
// ==/UserScript==

chatGrab = {
    angular_debug_check: function () {
        if (typeof angular.element(document.body).scope() == 'undefined') {
            angular.reloadWithDebugInfo();
            return false;
        } else {
            return true;
        }
    },

    redraw: function(){
        if (angular.element(document.body).injector().get('log').entries.length > 0){
            if ($('.end-buttons-area .chat-grab').length == 0){
                if (!angular.element(document.body).injector().get('game').heroIsPlayer()) {
                    var log_grab_button = $('<input class="end-turn-button chat-grab" style="font-size:2.4vh;" type=button onclick="chatGrab.grabChat()" value="Copy Chat">');
                    $('.end-buttons-area').append(log_grab_button);
                }
            }
        }
        if ($('.game-log-results')) {
            if ($('.game-log-results .chat-grab').length == 0){
                var log_grab_button = $('<input class="end-turn-button chat-grab" style="font-size:2.4vh; bottom:0;" type=button onclick="chatGrab.grabChat()" value="Copy Chat">');
                $('.game-log-results').append(log_grab_button);
            }
        }
    },

    grabChat: function(){
        function cleanse(message) {
            if (message.sender.match(/^<span.*>(.*):\&nbsp;<\/span>$/)){
                let sender = message.sender.match(/^<span.*>(.*):\&nbsp;<\/span>$/)[1];
                return `${sender}: ${message.message}`;
            } else if (message.sender.match(/^<span.*>Joining game #(\d+) .*<\/span>$/)) {
                let gameId = message.sender.match(/^<span.*>Joining game #(\d+) .*<\/span>$/)[1];
                return `##### Game ${gameId} #####`;
            }
        }
        GM_setClipboard(angular.element(document.body).injector().get('chat').chatLines.map(cleanse).filter(x => x).join("\n"));
    }
}

chatGrab.angular_debug_check();
setInterval(chatGrab.redraw, 500);