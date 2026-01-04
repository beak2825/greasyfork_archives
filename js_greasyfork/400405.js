// ==UserScript==
// @name         look无情场控机器
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  look直播无情场控机器
// @author       heibai
// @match        *://look.163.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/400405/look%E6%97%A0%E6%83%85%E5%9C%BA%E6%8E%A7%E6%9C%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/400405/look%E6%97%A0%E6%83%85%E5%9C%BA%E6%8E%A7%E6%9C%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setInterval(function(){
        location.reload();
    }, 15 * 60 * 1000);
    $(document).ready(function(){
        var input = $(".comment-container_29Qlr .chat_2lkcR .main_2YtBX .region_YG4FC");
        var send_button = $(".comment-container_29Qlr .chat_2lkcR .send-chat_uhGZA");
        var anchor_name = $(".anchorinfo-tags_3o9fO .nickname_3pHT9").text();
        if(anchor_name === "Jessica") {
            anchor_name = "卡卡";
        }
        if(anchor_name.indexOf("Swag") != -1) {
            anchor_name = "四歪哥";
        }
        if(anchor_name.indexOf("十七鹿") != -1) {
            anchor_name = "小鹿";
        }
        var ckc_arr = new Array(
            "爱生活，爱" + anchor_name.substring(0, 2),
            "✨第一宝藏主播" + anchor_name.substring(0, 2) + "来温暖你🌙 ✨喜欢主播声音可以点关注💫 ✨支持可以加个粉团喔💚",
            "🍃十里春风不如你🌸绚丽落魄都陪你。一场幸运🌟一场雨✨" + anchor_name.substring(0, 2) + "等风也等你",
            "🌈 这里是宝藏主播" + anchor_name.substring(0, 2) + "喔～🌟 喜欢的点点关注🔝 进进粉团🌸 清清背包💙  丢丢人气卡🎟️",
            "来得潇洒走得酷✨刷刷礼物显风度🌈喜欢" + anchor_name.substring(0, 2) + "点关注🙋期待你成为一家人哦🥰");
        /*var ckc_arr = new Array("🍃十里春风不如你🌸绚丽落魄都陪你。一场幸运🌟一场雨✨" + anchor_name.substring(0, 2) + "等风也等你",
                               "来得潇洒走得酷✨刷刷礼物显风度🌈喜欢" + anchor_name.substring(0, 2) + "点关注🙋期待你成为一家人哦🥰");*/

        setInterval(function() {
            input.val(ckc_arr[Math.floor(Math.random() * ckc_arr.length)]);
            send_button.click();
        }, 3 * 60 * 1000);
        $(".comment-container_29Qlr .comment_2mRsa").scroll(function(){
            var last = $('.comment-container_29Qlr .comment_2mRsa .comment-row_2DsAY').last();
            var text_290DO = $('.comment-container_29Qlr .comment_2mRsa .comment-row_2DsAY').last().children(".text_290DO").text();// 发言消息
            var send_3VjZd = $('.comment-container_29Qlr .comment_2mRsa .comment-row_2DsAY').last().children(".send_3VjZd").text();// 礼物消息
            var giftNum_dyilU = $('.comment-container_29Qlr .comment_2mRsa .comment-row_2DsAY').last().children(".giftNum_dyilU").text();// 礼物数量

            var nick_20QEy = last.children(".nick_20QEy").text().trim().replace(":", "");// 用户名字
            var username = nick_20QEy.substring(0,nick_20QEy.length);

            /*var welcome = welcome_arr[Math.floor(Math.random() * welcome_arr.length)];*/
            if(username && username !== "匿名用户"){
                if(text_290DO){
                    /*if(text_290DO.indexOf("黑白 ") != -1){
                        text_290DO = text_290DO.replace("黑白 ", "");
                        GM_xmlhttpRequest({
                            method: "post",
                            url: "http://148.70.183.216:18000/txai/chat",
                            //url: "http://localhost:18000/txai/chat",
                            data: 'question=' + text_290DO,
                            dataType: 'json',
                            headers:{
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload:function(responseDetails){
                                if(responseDetails.status === 200){
                                    var res = responseDetails.responseText
                                    input.val(res);
                                    send_button.click();
                                }else{
                                    input.val("看不懂艾...");
                                    send_button.click();
                                }
                            },
                            onerror : function(err){
                                input.val("出错了...");
                                send_button.click();
                            }
                        });
                        return;
                    }
                    if(text_290DO.indexOf("接龙 ") != -1){
                        text_290DO = text_290DO.replace("接龙 ", "");
                        GM_xmlhttpRequest({
                            method: "post",
                            url: "http://148.70.183.216:18000/idiom/solitaire",
                            //url: "http://localhost:18000/idiom/solitaire",
                            data: 'param=' + text_290DO,
                            dataType: 'json',
                            headers:{
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload:function(responseDetails){
                                if(responseDetails.status === 200){
                                    var res = JSON.parse(responseDetails.responseText).data;
                                    input.val(res);
                                    send_button.click();
                                }else{
                                    input.val("把我整懵逼了...");
                                    send_button.click();
                                }
                            },
                            onerror : function(err){
                                input.val("出错了...");
                                send_button.click();
                            }
                        });
                        return;
                    }
                    if(text_290DO.indexOf("成语释义 ") != -1){
                        text_290DO = text_290DO.replace("成语释义 ", "");
                        GM_xmlhttpRequest({
                            method: "post",
                            url: "http://148.70.183.216:8080/idiom/explanation",
                            data: 'param=' + text_290DO,
                            dataType: 'json',
                            headers:{
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload:function(responseDetails){
                                if(responseDetails.status === 200){
                                    var res = JSON.parse(responseDetails.responseText).data;
                                    input.val(res);
                                    send_button.click();
                                }else{
                                    input.val("没接上...");
                                    send_button.click();
                                }
                            },
                            onerror : function(err){
                                input.val("出错了...");
                                send_button.click();
                            }
                        });
                        return;
                    }*/
                    /*if(text_290DO === "进入了直播间" || text_290DO === "进入网易云音乐直播间"){
                        input.val("欢迎 " + username + " 来到" + anchor_name.substring(0, 2) + "温馨的大家庭");
                        send_button.click();
                        return;
                    }*/
                    if(text_290DO === "关注了主播，TA的开播不再错过"){
                        input.val("谢谢 " + username + " 的关注哦，记得常来看看" + anchor_name.substring(0, 2) + "！");
                        send_button.click();
                        return;
                    }
                    if(text_290DO === "加入了粉团"){
                        input.val("欢迎 " + username + " 加入粉团，以后就是一家人了呦～");
                        send_button.click();
                        return;
                    }
                    if(text_290DO === "晚安" || text_290DO === "灰灰" || text_290DO === "挥挥" || text_290DO === "再见"
                      || text_290DO === "早上好" || text_290DO === "中午好" || text_290DO === "晚上好" || text_290DO === "早安"){
                        input.val(text_290DO + "吖");
                        send_button.click();
                        return;
                    }
                }

                if(send_3VjZd){
                    var numStr = giftNum_dyilU ? giftNum_dyilU.replace("x", "") : "1";
                    var giftName = send_3VjZd.replace("送了", "");
                    input.val("感谢 " + username + " 的" + numStr + "个" + giftName);
                    send_button.click();
                    return;
                }
            }
        });
    });
})();