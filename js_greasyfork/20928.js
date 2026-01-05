// ==UserScript==
// @name         Whisper Filter
// @namespace    com.resterman
// @version      0.3.0
// @description  Lets you hide every message except the whispers between you and another user
// @author       resterman
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20928/Whisper%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/20928/Whisper%20Filter.meta.js
// ==/UserScript==

/* jshint esnext: true */

(function() {
    'use strict';
    checkHolodeck();
})();

function checkHolodeck() {
    if (typeof holodeck !== "undefined" && holodeck.ready) init();
    else setTimeout(checkHolodeck, 100);
}

function init() {
    'use strict';
    Holodeck.prototype.showConversationWith = function (user) {
        if (this.whisperFilter && this.whisperFilter.user == user) this.showAllMessages();
        else this.showWhispersOnly(user);
    };

    Holodeck.prototype.showAllMessages = function () {
        var w = this.activeDialogue()._message_window_node;
        var prop = this.whisperFilter;
        w.select('.chat-message')
            .map(x => x.show())
            .reduce(() => [1])
            .map(x => w.scrollTop = prop.scrollTop);
        this.whisperFilter = null;
    };

    Holodeck.prototype.showWhispersOnly = function (user) {
        var w = this.activeDialogue()._message_window_node;
        this.whisperFilter = {
            [user?'user':'mostrandoTodosLosWhispers']: user?user:true,
            scrollTop: w.scrollTop
        };

        w.select('.chat-message')
            .map(x => x.hide())
            .filter(x => x.select('.whisper').length > 0)
            .filter(x => {
                var u = x.select('.username');
                return u.length > 0 && (!user||new RegExp(user, 'i').test(u[0].readAttribute('username')));
            })
            .map(x => x.show());
    };

    Holodeck.prototype.getWhisperUsers = function () {
        var users = this.activeDialogue()._message_window_node.select('.chat-message')
            .filter(x => x.select('.whisper').length > 0)
            .map(x => x.select('.username')[0].readAttribute('username').toLowerCase());

        return new Set(users);
    };

    ChatDialogue.MESSAGE_TEMPLATE.evaluateAntesDeWF=ChatDialogue.MESSAGE_TEMPLATE.evaluate;

    ChatDialogue.MESSAGE_TEMPLATE.evaluate=function(a){
        const regExp=/(<a.*onclick=")(.*(\('.{4,16}'\));return.*)/i;
        if(a.message) a.message=a.message.replace(regExp, '$1if(event.ctrlKey) holodeck.showConversationWith$3; else $2');
        return ChatDialogue.MESSAGE_TEMPLATE.evaluateAntesDeWF(a);
    };

    ChatDialogue.prototype.sendPrivateMessageAntesDeWF=ChatDialogue.prototype.sendPrivateMessage;

    ChatDialogue.prototype.sendPrivateMessage=function(a, b){
        this.sendPrivateMessageAntesDeWF(a, b);
        for(var room in this._holodeck._chat_window._rooms._object){
            if(this._holodeck._chat_window._rooms._object[room]._chat_dialogue!=this){
                this._holodeck._chat_window._rooms._object[room]._chat_dialogue.displayMessage(a, b, {"class": "whisper sent_whisper"}, {"private": !0});
            }
        }
    };

    holodeck.whisperFilter=null;

    holodeck.addChatCommand('wf', function (a, b) {
        var args = b.split(' ');
        if (args.length >= 2) {
            var username = null;
            for (var user of holodeck.getWhisperUsers()) {
                if (new RegExp('^' + args[1].toLowerCase(), 'i').test(user)) {
                    username = user;
                    break;
                }
            }

            if (username) {
                holodeck.showConversationWith(username.toLowerCase());
            } else {
                holodeck.activeDialogue().displayMessage(
                    "Whisper Filter",
                    "You have no whispers with " + args[1],
                    {"class": "whisper received_whisper"},
                    {non_user: !0}
                );
            }
        }
        else if(holodeck.whisperFilter && (holodeck.whisperFilter.user || holodeck.whisperFilter.mostrandoTodosLosWhispers)) holodeck.showAllMessages();
        else if(!holodeck.getWhisperUsers().size) holodeck.activeDialogue().displayMessage(
            "Whisper Filter",
            "You have no whispers",
            {"class": "whisper received_whisper"},
            {non_user: !0}
        );
        else holodeck.showConversationWith();

        return !1;
    });
}