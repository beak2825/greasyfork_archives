// ==UserScript==
// @name        武神传说之自动续药
// @namespace   suqing.fun
// @version     0.0.4
// @author      sq
// @match       http://*.wsmud.com/*
// @homepage    https://greasyfork.org/zh-CN/scripts/381751
// @description 这只是一个自动续药的脚本，所以第一颗药还是得自己吃！
// @run-at      document-start
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/381751/%E6%AD%A6%E7%A5%9E%E4%BC%A0%E8%AF%B4%E4%B9%8B%E8%87%AA%E5%8A%A8%E7%BB%AD%E8%8D%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/381751/%E6%AD%A6%E7%A5%9E%E4%BC%A0%E8%AF%B4%E4%B9%8B%E8%87%AA%E5%8A%A8%E7%BB%AD%E8%8D%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let funny = {
        sendmessage: function(message) {
            if ($("#sendmessage").attr("cmd")) {
                $("#sendmessage").attr("cmd", message);
            } else {
                $(".container").append($(`<span id="sendmessage" cmd="${message}"><span>`));
            }
            $("#sendmessage").click();
        },
        onmessage: function(message) {
            funny.onmessage_fn.apply(this, arguments);
            let data = message.data || "error";
            if ((data.includes("{") && data.includes("}")) || (data.includes("[") && data.includes("]"))) {
                data = new Function("return " + data + ";")();
            }

            if (typeof data === "string") {
                if (data.includes("重新连线") || data.includes("武神传说")) {
                    $(".content-message pre").append(`\n<hig>自动续药</hig>已加载！\n`);
                    $("[command=pack]").click();
                    $(".dialog-close").click();
                }
                //  else if (data.includes("你获得了")) {
                //     // $(".content-message pre").append(`检测到<wht>${funny.statu}</wht>状态！\n`);
                //     // if (funny.statu === "蕴象丸") {
                //     //     $(".content-message pre").append(`将会执行 => <wht>${funny.auto_use_yxw}</wht>\n`);
                //     //     funny.sendmessage(funny.auto_use_yxw);
                //     // } else if (funny.statu === "冰心丹") {
                //     //     $(".content-message pre").append(`将会执行 => <wht>${funny.auto_use_bxd}</wht>\n`);
                //     //     funny.sendmessage(funny.auto_use_bxd);
                //     // }
                // }
            } else {

                if (data.type === "login") {
                    funny.id = data.id;
                } else if (data.type === "dialog" && data.dialog === "pack") {
                    if (data.items) {
                        $(".content-message pre").append(`正在检测...\n`);
                        for (const item of data.items) {
                            if (item.name.includes("蕴象丸")) {
                                funny.auto_use_yxw = `use ${item.id}`;
                                $(".content-message pre").append(`检测到<wht>${item.count}</wht>颗${item.name}！\n`);
                                $(".content-message pre").append(`蕴象丸状态消失会自动执行 => <wht>${funny.auto_use_yxw}</wht>\n`);
                            } else if (item.name.includes("冰心丹")) {
                                funny.auto_use_bxd = `use ${item.id}`;
                                $(".content-message pre").append(`检测到<wht>${item.count}</wht>颗${item.name}！\n`);
                                $(".content-message pre").append(`冰心丹状态消失会自动执行 => <wht>${funny.auto_use_bxd}</wht>\n`);
                            }
                        }
                        $(".content-message pre").append(`检测完毕！\n`);
                        $(".content-message pre").append(`如果显示多种颜色丹药，只会执行最后检测到的！\n`);
                        $(".content-message pre").append(`如果未显示检测到丹药，请事先将丹药放入背包！\n\n`);
                    }
                } else if (data.type === "status" && data.action === "add" && data.id === funny.id && data.sid === "food") {
                    funny.statu = data.name;
                    $(".content-message pre").append(`检测到<hig>${funny.statu}</hig>状态！\n`);
                    funny.sendmessage("dazuo");
                } else if (data.type === "status" && data.action === "remove" && data.id === funny.id && data.sid === "food") {
                    $(".content-message pre").append(`检测到状态消失！\n`);
                    funny.sendmessage("stopstate");
                    if (funny.statu === "蕴象丸") {
                        funny.sendmessage(funny.auto_use_yxw);
                    } else if (funny.statu === "冰心丹") {
                        funny.sendmessage(funny.auto_use_bxd);
                    }

                } else if (data.type === "items") {
                    for (const item of data.items) {
                        if (item.id === funny.id) {
                            for (const statu of item.status) {
                                if (statu.name === "蕴象丸" || statu.name === "冰心丹") {
                                    funny.statu = statu.name;
                                    $(".content-message pre").append(`检测到<wht>${funny.statu}</wht>状态！\n`);
                                }
                            }
                        }
                    }
                }

            }

            if (funny.id === "j9h729c52bc") console.log(data);
        },
    };

    if (WebSocket) {
        unsafeWindow.WebSocket = function(url) {
            funny.webSocket = new WebSocket(url);
        };
        unsafeWindow.WebSocket.prototype = {
            get url() {
                return funny.webSocket.url;
            },
            get protocol() {
                return funny.webSocket.protocol;
            },
            get readyState() {
                return funny.webSocket.readyState;
            },
            get bufferedAmount() {
                return funny.webSocket.bufferedAmount;
            },
            get extensions() {
                return funny.webSocket.extensions;
            },
            get binaryType() {
                return funny.webSocket.binaryType;
            },
            set binaryType(type) {
                funny.webSocket.binaryType = type;
            },
            get onerror() {
                return funny.webSocket.onerror;
            },
            set onerror(fn) {
                funny.webSocket.onerror = fn;
            },
            get onopen() {
                return funny.webSocket.onopen;
            },
            set onopen(fn) {
                funny.webSocket.onopen = fn;
            },
            get onclose() {
                return funny.webSocket.onclose;
            },
            set onclose(fn) {
                funny.webSocket.onclose = fn;
            },
            close: function () {
                funny.webSocket.close();
            },
            get onmessage() {
                return funny.webSocket.onmessage;
            },
            set onmessage(fn) {
                funny.onmessage_fn = fn;
                funny.webSocket.onmessage = funny.onmessage;
            },
            send: function (message) {
                funny.webSocket.send(message);
            },
        };
    }
})();