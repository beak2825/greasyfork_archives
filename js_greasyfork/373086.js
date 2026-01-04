// ==UserScript==
// @name         wsmud_lib
// @namespace    cqv
// @version      0.0.12
// @date         8/08/2018
// @modified     03/10/2018
// @homepage     https://greasyfork.org/zh-CN/scripts/373086
// @description  MUD
// @author       fjcqv
// @match        http://game.wsmud.com/*
// @run-at       document-start
// @grant        unsafeWindow
//参考https://gitee.com/zwu9/user-script
// @downloadURL https://update.greasyfork.org/scripts/373086/wsmud_lib.user.js
// @updateURL https://update.greasyfork.org/scripts/373086/wsmud_lib.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.WebSocket) {
        var _ws = window.WebSocket, ws, ws_on_message;
        var message_listeners = [];
        var listener_seq = 0;
        var in_array = function (val, arr) {
            if (arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    if (val == arr[i]) return true;
                }
            }
            return false;
        }
        function add_listener(types, fn) {
            var listener = {
                'id': ++listener_seq,
                'types': types,
                'fn': fn
            };
            message_listeners.push(listener);
            return listener.id;

        }
        function remove_listener(id) {
            for (var i = 0; i < message_listeners.length; i++) {
                if (message_listeners[i].id == id) {
                    message_listeners.splice(i, 1);
                }
            }
        }
        function fire_listener(data) {
            for (var i = 0; i < message_listeners.length; i++) {
                var listener = message_listeners[i];
                if (listener.types == data.type || in_array(data.type, listener.types)) {
                    listener.fn(data);
                }
            }
        }
        var my_receive_message = function (evt) {
            ws_on_message.apply(this, arguments);
            if (!evt || !evt.data) return;
            var data;
            if (evt.data[0] == '{' || evt.data[0] == '[') {
                var func = new Function("return " + evt.data + ";");
                data = func();
            } else {
                data = { type: 'text', msg: evt.data };
            }
            fire_listener(data);
        };

        var cmd_queue = [], cmd_busy = false, echo = false;
        var send_dirdect = 0;
        var manual_send = 0;
        var _send_cmd = function () {
            if (!ws || ws.readyState != 1) {
                cmd_busy = false;
                cmd_queue = [];
            } else if (cmd_queue.length > 0) {
                cmd_busy = true;
                let t = new Date().getTime();
                let t1 = t - 3000;
                let i;
                let del_i;
                for (i = 0, del_i = 0; i < cmd_queue.length; i++) {
                    if (cmd_queue[i].timestamp == 0) {
                        break;
                    }
                    if (cmd_queue[i].timestamp < t1) {
                        del_i = i + 1;
                    }
                }
                cmd_queue.splice(0, del_i);
                i = i - del_i;
                if (i == 0) send_dirdect = 0;
                for (; i < cmd_queue.length; i++) {
                    try {
                        if (echo) {
                            show_msg('<hiy>' + cmd_queue[i].cmd + '</hiy>');
                        }
                        ws.send(cmd_queue[i].cmd);
                        cmd_queue[i].timestamp = t;
                        t += 250;

                    } catch (e) {
                        show_msg(e);
                        cmd_busy = false;
                        cmd_queue = [];
                        return;
                    }
                    send_dirdect++;
                    if (send_dirdect > 10) break;
                }
                if (!cmd_queue[cmd_queue.length - 1].timestamp) {
                    let next_t = send_dirdect > 20 ? 400 : 250;
                    next_t += manual_send * 20;
                    setTimeout(_send_cmd, next_t);
                } else {
                    cmd_busy = false;
                }
            } else {
                cmd_busy = false;
            }
        };
        var send_cmd = function (cmd, no_queue) {
            if (ws && ws.readyState == 1) {
                cmd = cmd instanceof Array ? cmd : cmd.split(';');

                if (no_queue) {
                    for (var i = 0; i < cmd.length; i++) {
                        if (echo) {
                            show_msg('<hiy>' + cmd[i] + '</hiy>');
                        }
                        ws.send(cmd[i]);
                    }
                } else {
                    for (i = 0; i < cmd.length; i++) {
                        cmd_queue.push({ cmd: cmd[i], timestamp: 0 });
                    }
                    if (!cmd_busy) {
                        _send_cmd();
                    }
                }
            }
        };
        function cmd_echo(b) {
            echo = b == true ? true : false;
        }
        function show_msg(msg) {
            ws_on_message({ data: msg });

        }

        unsafeWindow.WebSocket = function (uri) {
            ws = new _ws(uri);
            console.log("武神传说websocket已捕获！");
            document.getElementsByClassName("signinfo")[0].innerHTML = "<HIR>武神传说前置插件正常运行！</HIR>"
        };
        unsafeWindow.WebSocket.prototype = {
            CONNECTING: _ws.CONNECTING,
            OPEN: _ws.OPEN,
            CLOSING: _ws.CLOSING,
            CLOSED: _ws.CLOSED,
            get url() {
                return ws.url;
            },
            get protocol() {
                return ws.protocol;
            },
            get readyState() {
                return ws.readyState;
            },
            get bufferedAmount() {
                return ws.bufferedAmount;
            },
            get extensions() {
                return ws.extensions;
            },
            get binaryType() {
                return ws.binaryType;
            },
            set binaryType(t) {
                ws.binaryType = t;
            },
            get onopen() {
                return ws.onopen;
            },
            set onopen(fn) {
                ws.onopen = fn;
            },
            get onmessage() {
                return ws.onmessage;
            },
            set onmessage(fn) {
                ws_on_message = fn;
                ws.onmessage = my_receive_message;
            },
            get onclose() {
                return ws.onclose;
            },
            set onclose(fn) {
                ws.onclose = fn;
            },
            get onerror() {
                return ws.onerror;
            },
            set onerror(fn) {
                ws.onerror = fn;
            },
            send: function (text) {
                if (echo) {
                    show_msg('<hiy>' + text + '</hiy>');
                }
                manual_send++;
                setTimeout(() => {
                    manual_send--;
                    console.log(manual_send);
                }, 3000);
                ws.send(text);
            },
            close: function () {
                ws.close();
            }
        };
        unsafeWindow.add_listener = add_listener;
        unsafeWindow.remove_listener = remove_listener;
        unsafeWindow.send_cmd = send_cmd;
        unsafeWindow.cmd_echo = cmd_echo;
        unsafeWindow.test = my_receive_message;
        unsafeWindow.cmd_queue = cmd_queue;
    }
    else {
        console.log("武神传说websocket捕获失败！");
        if (document.body) {
            document.getElementsByClassName("signinfo")[0].innerHTML = "<HIR>使用yandex浏览器请油猴设置为高级，实验-注入模式设置为严格</HIR>";
            setTimeout(() => { location.reload(); }, 2000);
        }
    }
})();