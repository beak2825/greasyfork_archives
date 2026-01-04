// ==UserScript==
// @name 仙剑奇缘监控
// @description 用于仙剑奇缘的监控和过滤
// @namespace Yf.keyword.LegendOfSwordFate
// @require http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @include http://manager.chat.q-dazzle.com/index.php
// @exclude http://manager.chat.q-dazzle.com/control/login.php
// @author HaoJJ
// @version 1.1.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/36029/%E4%BB%99%E5%89%91%E5%A5%87%E7%BC%98%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/36029/%E4%BB%99%E5%89%91%E5%A5%87%E7%BC%98%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

var areaNum = 34; //区服数
var uploadUrl = "http://keyword.xiaohao.com/LegendOfSwordFate/UpLoad"; //上报地址




var alist = [];
//记录上一条聊天记录，防止聊天数据
var pre_chats = new Array();
var last_get_time = 0;
var timetmp = Date.parse(new Date) / 1000 - 2;
var room_id = new Date().getTime();


var cookie = {
    set: function (key, val, time) {//设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //设置cookie
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    delete: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString();//设置cookie
    }
}

var temp;
//初始化
var init = function(){    
    //初始化频道注册列表
    for (var i = 1; i <= areaNum; i++) {
        alist.push('t4_t4yunfeng_' + i);
    }
    var temp = alist.join(',');
    cookie.set("post_list",temp);
}

var showController = function(){
    var doc =$(window.frames["leftFrame"].document);
    doc.find('#mainNav').append(`<button id="btn-Monitor">开启监控</button>`);
    doc.find('#btn-Monitor').toggle(function(){
        watcher.connect();
        $(this).text('关闭监控');
    },function(){
        watcher.close();
        $(this).text('开启监控');
    })
}

var ws = null;
var watcher = {  
    invterval: 0,
    close:function(){
        clearInterval(this.invterval);
        ws.onclose = null;
        ws.close();
        console.log("已关闭");
    },
    connect : function(){
        // 创建websocket
        ws = new WebSocket("ws://onlychat.q-dazzle.com:7272");
        // 当socket连接打开时，输入用户名
        ws.onopen = this.onopen;
        // 当有消息时根据消息类型显示不同信息
        ws.onmessage = this.onmessage;
        ws.onclose = function () {
            console.clear();
            console.log("连接关闭，定时重连");
            watcher.connect();
        };
        ws.onerror = function () {
            console.log("出现错误");
        };
    },
    onopen:function(){
        console.log("开始链接！");            
        for (var i = 1; i <= alist.length; i++) {            
            var login_data = '{"type":"get_chat_monitor","room_id":"' + (room_id+i) + '", "flist":"' + alist[i-1] + '","last":"' + timetmp + '","now":"' + timetmp + '"}';
            var ret = ws.send(login_data);
        }
        console.log('连接完毕！');
        watcher.invterval = setInterval(watcher.continue_get, 1500);
    },
    continue_get:function() {
        var now = Date.parse(new Date) / 1000 - 2;
        for (var i = 1; i <= alist.length; i++) {
            var post_data = '{"type":"get_chat_monitor","room_id":"' + (room_id+i)  + '", "flist":"' + alist[i-1] + '","last":"' + timetmp + '","now":"' + now + '"}';
            ws.send(post_data);
        }
        timetmp = now;
        //console.log("发送登录数据:"+post_data);
    },
    onmessage:function(e) {
        var data = eval("(" + e.data + ")");
        switch (data['type']) {
            // 服务端ping客户端
            case 'ping':
                //在心跳检测时判断websocket是否需要重新连接
                new_time = Date.parse(new Date) / 1000 - last_get_time;
                console.log("last_get_time_CD:" + new_time);
                if (new_time >= 25) {
                    ws.send = '{"type":"pong"}';
                    ws.close();
                    ws = false;
                }
                break;
            case 'send_chat_monitor':
                last_get_time = Date.parse(new Date) / 1000;
                var upModel = [];
                var date = new Date();                
                for (var f in data['msg']) {
                    if (data['msg'][f] != "") {
                        var tmp = data['msg'][f];
                        for (var i in tmp) {
                            for (var j in tmp[i]) {
                                upModel.push(watcher.createModel(tmp[i][j], date));
                            }
                        }
                    }
                }
                if(upModel.length > 0){
                    $.ajax({
                        url: uploadUrl,
                        data: { rows: JSON.stringify(upModel) },
                        type: 'POST',
                        success: function (d) {                        
                        }
                    });
                }
                //window.setTimeout(continue_get, 6000);
                break;
            case "forbid_user":
                alert(data['msg']);
                break;
    
        }
    },
    createModel: function(chat, date) {
        var channel = '';
        if (chat['chat_type'] == "私聊") {
            channel = "私聊频道"
        } else if (chat['chat_type'] == "公聊") {
            channel = "公聊频道"
        } else if (chat['chat_type'] == "帮聊") {
            channel = "帮派频道"
        } else if (chat['chat_type'] == "跨服") {
            channel = "跨服频道"
        }

        var updateTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${chat['op_timestamp']}`;
        var updateDate = new Date(updateTime);
        if(updateDate > date){
            updateDate.setDate(updateDate.getDate() - 1);
        }
        return {
            GameName: '仙剑奇缘',
            Aera: chat['server_id'] + '服',
            Channel: channel,
            Account: chat['plat_user_name'],
            RoleName: chat['role_name'],
            Level: -1,
            Content: chat['chat_content'],
            CreateTime: `${updateDate.getFullYear()}/${updateDate.getMonth() + 1}/${updateDate.getDate()} ${chat['op_timestamp']}`,
            Credit: -1,
            VIPLevel: chat['vip'],
        };
    }
}

//立即执行
$(function(){
    init();    
    //watcher.connect();
    showController();
});


