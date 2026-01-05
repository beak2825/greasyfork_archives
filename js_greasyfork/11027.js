// ==UserScript==
// @name        IPChat IRC Simulator
// @version     1.0.0
// @namespace   https://bitbucket.com/chipscape
// @description Adds IRC features (notify, mention) to IPChat
// @include     http://insanedifficulty.com/board/index.php?app=ipchat
// @include     http://www.insanedifficulty.com/board/index.php?app=ipchat
// @include     https://insanedifficulty.com/board/index.php?app=ipchat
// @include     https://www.insanedifficulty.com/board/index.php?app=ipchat
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11027/IPChat%20IRC%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/11027/IPChat%20IRC%20Simulator.meta.js
// ==/UserScript==

/*
 * Format of data: "1,last_msg_id~~||~~messages_go_here"
 * Format of messages: "timestamp,flag,author,text,something,authorid"
 */

;(() => {
    Notifier = {
        init: function() {
            this.lastMsgId = 0;
            this.activate();
        },

        activate: function() {
            const _updateMessages = ipb.chat.updateMessages;
            ipb.chat.updateMessages = (text) => {
                this.log(text);
                _updateMessages(text);
                if (ipb.chat.lastMsgId > this.lastMsgId) {
                    const messages = this.extractMessages(text);
                    this.log(messages);
                    if (messages && this.shouldNotify(messages)) this.notify();
                }
                this.lastMsgId = ipb.chat.lastMsgId;
            };
        },

        log: function(text) {
            if (true) return;
            console.log(text);
        },

        shouldNotify: function(messages) {
            // if (this.lastMsgId <= 1) return;
            const process = (msg) => {
                switch (msg.type) {
                case 'msg':
                    if (userName === msg.authorName) return false;
                    return true;
                case 'leavejoin':
                    if (userName === msg.authorName) return false;
                    return true;
                default:
                    return true;
                }
            };
            const result = messages.map(process);
            this.log(result);
            return !result.every((bool) => !bool);
        },

        notify: function() {
            this.default_sound.play();
            this.log("Notification!");
        },

        // text -> [messages]
        extractMessages: function(text) {
            const messages = text.split("~~||~~").slice(1, -1);
            const parseMessage = (msg) => {
                const msgDetails = msg.split(',');
                let result =  {
                    timestamp: msgDetails[0],
                    authorName: msgDetails[2],
                    text: msgDetails[3],
                    authorId: msgDetails[5]
                };
                switch (msgDetails[1]) {
                case '1':
                    result.type = 'msg';
                    break;
                case '2':
                    result.type = 'leavejoin';
                    break;
                case '3':
                    result.type = 'msg';
                    break;
                }
                if (msgDetails[4]) {
                    if (msgDetails[4][0] === '1') {
                        result.joining = true;
                    } else if (msgDetails[4][0] === '2') {
                        result.leaving = true;
                    }
                }
                return result;
            };
            return messages.map(parseMessage);
        },

        default_sound: new Audio("https://gist.github.com/pernatiy/38bc231506b06fd85473/raw/beep-30.mp3")
    };

    Notifier.init();
})();
