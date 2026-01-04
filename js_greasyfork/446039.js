// ==UserScript==
// @name         猫耳机器人 vol.2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  由于消息解析函数过于复杂，我选择hook TextDecoder函数 (*/ω＼*)
// @author       bigfraud
// @match        https://fm.missevan.com/live/*
// @icon         https://www.google.com/s2/favicons?domain=missevan.com
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/446039/%E7%8C%AB%E8%80%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%20vol2.user.js
// @updateURL https://update.greasyfork.org/scripts/446039/%E7%8C%AB%E8%80%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%20vol2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastName = ""; // 最后一个欢迎的用户名
    var liveId = document.baseURI.split('/')[4]; // 根据URI获取直播房间id
    var TextDecoder_bak = TextDecoder;
    !function (){
        TextDecoder = function() {
            var obj = new TextDecoder_bak();
            obj.decode_bak = obj.decode;
            obj.decode = function(v) {
                var res = obj.decode_bak(v);
                var data = JSON.parse(res);
                switch (data.type) {
                    case "member":
                        if (data.event != "join_queue") {
                            break;
                        }
                        var queue = data.queue;
                        for (var i = 0; i < queue.length; i++){
                            var name = queue[i].username;
                            if (name == lastName || name == ""){
                                continue;
                            }else if(!name){
                                console.log("欢迎：匿名用户进入直播间~");
                            }
                            else {
                                // sendMsg("欢迎：" + queue[i].username + "进入直播间~", liveId)
                                console.log("欢迎：" + name + "进入直播间~");
                            }
                        }
                        break;
                    case "gift":
                        if (data.room_id == liveId){
                            var gift = data.gift;
                            // TODO
                            // gift == 礼物的信息
                            // sendMsg("谢谢" + data.user.username + "赠送的: " + gift.name, liveId)
                            console.log("谢谢" + data.user.username + "赠送的: " + gift.name);
                            break;
                        }
                        break;
                }
                return res;
            }
            return obj;
        }
    }()
})();