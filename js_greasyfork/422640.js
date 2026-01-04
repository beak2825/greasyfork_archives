// ==UserScript==
// @name         音豆增强
// @namespace    https://imewchen.com/
// @version      0.1.1
// @description  嘉广集团音豆增强（导播消息聊天）
// @author       MewChen
// @include      http*://fm.cloud.hoge.cn/qd/message/
// @require      https://cdn.bootcdn.net/ajax/libs/socket.io/2.3.1/socket.io.min.js
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422640/%E9%9F%B3%E8%B1%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/422640/%E9%9F%B3%E8%B1%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function () {
        //添加消息窗体
        setTimeout(function () {
            //修改原有窗体布局
            $('.main-content').css('float','left');
            $('.main-content').css('margin-left','80px');
            //获取信息
            var username = $('.d-block.username').text();
            var bodyHeight = $('.body-box').height();
            bodyHeight -= 20;
            console.log('bodyHeight:',bodyHeight);
            //右边窗体
            var newHtml = '<div class="daobo" style="float:left;width:400px;height:100%;padding-top:62px;margin-top:20px;">';
            newHtml += '<div class="daobo-panel" style="background-color:#fff;border:solid 1px #ebf1fa;border-radius:.25rem;">';
            //标题
            newHtml += '<div class="daobo-panel_header" style="font-size:18px;padding:10px;border-bottom: 1px solid rgba(0,0,0,.125);">导播聊天</div>';
            //消息框
            newHtml += '<div class="daobo-panel_body" id="chat_msg_rec" style="padding:10px;background-color: rgba(0,0,0,.03);height:'+ bodyHeight +'px;overflow-y:auto;">';
            newHtml += '</div>';
            //发送框
            newHtml += '<div  class="daobo-panel_footer chat-box" style="padding:10px;">';
            newHtml += '<div class="chat-box_toolbar"></div>';
            newHtml += '<div class="chat-box_area"><textarea id="chat-box_input" style="width:100%;border:0;outline:none;resize:none;font-size:16px;height:5em;"></textarea></div>';
            newHtml += '<div class="chat-box_button" style="text-align:right;padding:10px 0;"><button id="btnSend" style="display:inline-block;*zoom:1;vertical-align:top;font-size:14px;line-height:32px;margin-left:5px;padding:0 20px;background-color:#5FB878;color:#fff;border-radius:3px;box-sizing:content-box;border:0;cursor:pointer;margin-right:28px;">发送</button></div>';
            newHtml += '</div>';
            //右边窗体结束
            newHtml += '</div>';
            newHtml += '</div>';
            $('.layout').append(newHtml);

        }, 5000);

        $('body').on('click','#btnSend', function (e) {
            e.preventDefault();
            var msg = $('#chat-box_input').val();
            console.log("发送消息：" + msg);
            socket.emit('send_msg', msg);
            //
            var username = $('.d-block.username').text();
            var sendHtml = '<div class="message_reply" style="text-align:right;padding-bottom:40px;clear:both;"><p style="color:#aaa;padding:5px;">' + username + '</p><p style="float:right;background:#9eea6a;padding:10px;border-radius:4px;">'+msg+'</p></div>';
            $('.daobo-panel_body').append(sendHtml);
            $('#chat-box_input').val('');
            scrollBottom();
        });

        // 链接socket服务器
        var socket = io('http://workerman.net:2120');

        // socket连接后以username登录
        socket.on('connect', function(){
            socket.emit('login', 'tmsg');
        });

        // 后端推送来消息时
        socket.on('new_msg', function(msg){
            console.log("收到消息："+msg);
            var msgHtml = '<div class="message_timeline" style="text-align:center;margin-top:40px;margin-bottom:10px;clear:both;"><span style="color:#fff;background-color:#dadada;padding:5px;border-radius:4px;">' + getCurrentDate(2) + '</span></div>';
            msgHtml += '<div class="message_receive" style="text-align:left;padding-bottom:40px;clear:both;"><p style="color:#aaa;padding:5px;">导播</p><p style="float:left;background:#fff;padding:10px;border-radius:4px;">'+msg+'</p></div>';
            $('.daobo-panel_body').append(msgHtml);
            scrollBottom();
        });

        // 获取当前时间
        function getCurrentDate(format) {
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期
            var day = now.getDay();//得到周几
            var hour = now.getHours();//得到小时
            var minu = now.getMinutes();//得到分钟
            var sec = now.getSeconds();//得到秒
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;
            var time = "";
            //精确到天
            if(format==1){
                time = year + "-" + month + "-" + date;
            }
            //精确到分
            else if(format==2){
                time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
            }
            return time;
        }

        //滚动条最下面
        function scrollBottom(){
            var ele = document.getElementById('chat_msg_rec');
            ele.scrollTop = ele.scrollHeight;
        }
    });
})();