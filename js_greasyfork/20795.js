// ==UserScript==
// @name         7 Cups - Chat timer
// @description  Time recording for 1-to-1 member or guest chats
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @match        https://www.7cups.com/listener/
// @match        https://www.7cups.com/listener/connect/conversation.php?c=*
// @run-at       document-start
// @grant        none
// @namespace    http://tampermonkey.net/
// @version      0.1
// zjshint       ignore: start
// @downloadURL https://update.greasyfork.org/scripts/20795/7%20Cups%20-%20Chat%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/20795/7%20Cups%20-%20Chat%20timer.meta.js
// ==/UserScript==
(function() {
    if (window.parent != window) return;

    rc_Timer = {
        init: function () {
            this.isPath = location.pathname == '/listener/';
            console.log('+++ init - path: ' + this.isPath);

            // wait for Chat box...
            var observer = new MutationObserver(function () {
                if (typeof($) != 'function') return;
                if (typeof(processConv) != 'function') return;
                if (!rc_Timer.isPath && typeof(setConversation) != 'function') return;
                var box = $('div.conversationBox');
                if (!box) return;
                observer.disconnect(); // do this only once

                console.log('+++ observer at ' + rc_Timer.now());

                // get my data...
                var data = localStorage.getItem('rc_timer');
                if (data) data = JSON.parse(data);
                else {
                    data = {total: 0};
                    rc_Timer.store(data);
                    }
                rc_Timer.data = data;

                // insert my stylesheet...
                var s = document.head.appendChild(document.createElement('STYLE'));
                s.setAttribute('type', 'text/css');
                s.textContent = '#rc-chat-total {position: absolute; top: 18px; right: 20px; padding: 2px 4px; ' +
                    'font-size: 15px; font-weight: bold; color: #373a3c; letter-spacing: 1px; cursor: pointer; ' +
                    'border-radius: 4px; border: 1px solid #07e; min-width: 3.5em; text-align: right;}' +
                  '#rc-chat-total:hover {background: #acf;}' +
                  '.chat-list .chatIndicator.rc-clock {color: #07e; background: none; padding: 0; font-size: 16px; line-height: 16px;}' +
                  '#rc-chat-timer {position: absolute; top: -1px; left: 69px; min-width: 100px; padding: 2px 4px; font-size: 12px; letter-spacing: 1px;}' +
                  '#rc-chat-timer i {display: inline-block; margin-right: .5ex; color: #07e;}' +
                  '.chatInput: {position: relative;} ';

                // trap conversation list refresh...
                rc_Timer.processConv = processConv;
                processConv = function (list) {
                    rc_Timer.processConv(list);
                    rc_Timer.showClocks(list, data);
                    };

                if (rc_Timer.isPath) { // on Path page display my total...
                    box.css('position', 'relative');
                    box.prepend('<div id="rc-chat-total" data-toggle="tooltip" ' +
                      'data-html="true" data-original-title="Total chat time<br>hr : min<br>Click to reset"></div>');
                    rc_Timer.showTotal(data);
                    $('#rc-chat-total').click(function () {
                        bootbox.confirm({
                            //size: 'small',
                            title: '<i class="fa fa-lg fa-clock-o" style="color: #07e;"></i> Chat timer reset',
                            message: 'Do you really want to remove all the clocks running in chats, and reset the total chat time to zero?',
                            callback: function (ok) {
                                if (!ok) return;
                                data = {total: 0};
                                rc_Timer.store(data);
                                rc_Timer.showTotal(data);
                                }
                            });
                        });
                    }
                else { // on Connect page watch the current conversation...
                    window.addEventListener('load', function () {
                        $('h1#conversationHead').parent().append(
                            '<div id="rc-chat-timer" data-toggle="tooltip" data-original-title="Time since start of chat">' +
                            '<i class="fa fa-clock-o"></i><span id="rc-chat-clock"></span></div>'
                            );
                        setTimeout(function () {
                            rc_Timer.timeConversation(data, true); // initial conv on the page
                            }, 1000); // yuck
                        });
                    rc_Timer.setConversation = setConversation; // trap 7C function
                    setConversation = function (id, refresh) {
                        rc_Timer.setConversation(id, refresh);
                        rc_Timer.timeConversation(data, false); // switch conv on the page
                        };
                    rc_Timer.endLiveChat = endLiveChat; // trap 7C function
                    endLiveChat = function (rx) {
                        rc_Timer.endLiveChat(rx);
                        rc_Timer.chatEnd();
                        };
                    rc_Timer.loadMessage = loadMessage; // trap 7C function
                    loadMessage = function (msg, skip) {
                        rc_Timer.loadMessage(msg, skip);
                        rc_Timer.chatEvent();
                        };
                    }
                });
            observer.observe(document.documentElement, {childList: true, subtree: true});
            },

        chatAdd: function (id) { // register a chat and return it...
            if (!id) id = ChatSession.convID;
            console.log('+++ chatAdd ' + id);
            var chat = rc_Timer.data[id];
            if (chat) return chat;
            chat = {start: rc_Timer.now(), event: 0};
            rc_Timer.data[id] = chat;
            rc_Timer.store(rc_Timer.data);
            return chat;
            },

        chatEnd: function (id) { // deregister a chat and update total...
            if (!id) id = ChatSession.convID;
            console.log('+++ chatEnd ' + id);
            var chat = rc_Timer.data[id];
            if (!chat) return;
            if (true || chat.event) rc_Timer.data.total += rc_Timer.now() - chat.start; // <<<<<<<<<<<<<<<<<<<<<
            delete rc_Timer.data[id];
            rc_Timer.store(rc_Timer.data);
            },

        chatEvent: function (id) { // register an event...
            if (!id) id = ChatSession.convID;
            console.log('+++ chatEvent ' + id);
            var chat = rc_Timer.data[id];
            if (!chat) return;
            chat.event = rc_Timer.now();
            rc_Timer.data[id] = chat;
            rc_Timer.store(rc_Timer.data);
            },

        clearClock: function (id) { // clear a clock...
            console.log('+++ clearClock ' + id);
            if (!id) id = ChatSession.convID;

            var a = $('#convListItem_' + id.replace(/!/g, '\\!')), c = $('.chatIndicator', a);
            c.removeClass('rc-clock');
            c.children().tooltip('destroy');
            c.empty();

            var chat = rc_Timer.data[id];
            if (!chat) return;

            delete rc_Timer.data[id];
            rc_Timer.store(rc_Timer.data);
            },

        now: function () { // time now in seconds...
            return Math.round(Date.now() / 1000);
            },

        showClocks: function (list, data) { // show my clock icons in box...
            console.log('+++ showClocks');
            if (!data) data = rc_Timer.data;
            for (var id in data) {
                if (id == 'total') continue;
                var a = $('#convListItem_' + id.replace(/!/g, '\\!'));
                var online = $('.statusBlock', a).hasClass('userOnline'); online = true; // EVERYONE IS ONLINE
                if (online) {
                    var c = $('.chatIndicator', a);
                    c.addClass('rc-clock');
                    c.html('<i class="fa fa-lg fa-clock-o" data-toggle="tooltip" data-html="true" ' +
                      'data-original-title="Timer running' +
                      (rc_Timer.isPath? '<br>Click to remove' : '') +
                      '"></i>');
                    if (rc_Timer.isPath) c.click(function (event) {
                        console.log('+++ Click to remove ' + id);
                        rc_Timer.chatEnd(id);
                        rc_Timer.clearClock(id);
                        return false;
                        });
                    }
                else rc_Timer.chatEnd(id); // force end of chat if GorM is offline
                }
            },

        showTotal: function (data) {
            console.log('+++ showTotal');
            if (!data) data = rc_Timer.data;
            var min = Math.round(data.total / 60);
            var hr = Math.floor(min / 60);
            min = min - 60 * hr;
            if (min < 10) min = '0' + min;
            $('#rc-chat-total').text(hr + ':' + min);
            },

        store: function (data) { // store my data...
            //console.log('+++ store ' + JSON.stringify(data));
            localStorage.setItem('rc_timer', JSON.stringify(data));
            },

        tick: function () { // local clock for display only...
            var s = ++rc_Timer.seconds, m = Math.floor(s / 60);
            if (!s) console.log('+++ tick ' + s);
            s -= 60 * m;
            if (s < 10) s = '0' + s;
            var h = Math.floor(m / 60);
            m -= 60 * h;
            h = h? h + ':' : '';
            $('#rc-chat-clock').text(h + m + ':' + s);
            },

        timeConversation: function (data, initial) {
            console.log('+++ timeConversation ' + (initial? 'initial' : ''));
            if (rc_Timer.interval) clearInterval(rc_Timer.interval);
            var a = $('#prevConList a.activeConv');
            if (!a) { // yuck...wait for it...
                setTimeout(function () {
                    rc_Timer.timeConversation(data, initial);
                    }, 0);
                return;
                }
            var id = a.attr('id').substr(13);
            var online = $('.statusBlock', a).hasClass('userOnline'); online = true; // EVERYONE IS ONLINE
            var type = $('.userInfo .label', a).text().substr(0, 1);
            var gorm = type == 'G' || type == 'M'; // guest or member

            if (online && gorm) { // this convo needs a clock...
                var chat = rc_Timer.chatAdd(id); // ensure chat is active
                rc_Timer.seconds = rc_Timer.now() - chat.start; // local clock for display
                rc_Timer.tick();
                rc_Timer.interval = setInterval(rc_Timer.tick, 1000);
                $('#rc-chat-timer').show();
                }
            else { // end the chat, hide the clock...
                rc_Timer.chatEnd(id);
                $('#rc-chat-timer').hide();
                }
            },
        };
    rc_Timer.init();

    if (typeof(unsafeWindow) == 'object') unsafeWindow.rc_Timer = rc_Timer;
})();