// ==UserScript==
// @name         循环监测b站用户粉丝数、舰长数及增量
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  页面左侧会生成输入框，输入用户UID，点击“监测”；
// @author       Ikaros
// @match        https://www.bilibili.com/*
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/zh-CN/scripts/453169
// @downloadURL https://update.greasyfork.org/scripts/453169/%E5%BE%AA%E7%8E%AF%E7%9B%91%E6%B5%8Bb%E7%AB%99%E7%94%A8%E6%88%B7%E7%B2%89%E4%B8%9D%E6%95%B0%E3%80%81%E8%88%B0%E9%95%BF%E6%95%B0%E5%8F%8A%E5%A2%9E%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453169/%E5%BE%AA%E7%8E%AF%E7%9B%91%E6%B5%8Bb%E7%AB%99%E7%94%A8%E6%88%B7%E7%B2%89%E4%B8%9D%E6%95%B0%E3%80%81%E8%88%B0%E9%95%BF%E6%95%B0%E5%8F%8A%E5%A2%9E%E9%87%8F.meta.js
// ==/UserScript==
 
window.addEventListener('load', function() {
	// 在页面左侧插入一个用户筛选框
	var body = document.getElementsByTagName("body")[0];
	var div = document.createElement("div");
	div.style.width = "60px";
	div.style.fontSize = "18px";
	div.style.background = "#ef8400";
	div.style.textAlign = "center";
	div.style.padding = "5px";
	div.style.cursor = "pointer";
    div.style.position = "fixed";
    div.style.top = "10px";
	div.innerText = "监测用户☚";
    div.style.zIndex = "2000";
	div.onclick = function(){ show_hide(); };
	body.appendChild(div);

    var global_name = "";
    var global_uid = "";
    var global_roomid = "";
    var global_fans = 0;
    var global_guard = 0;
    var last_fans = 0;
    var last_guard = 0;
    var Interval1;
 
	// 显示隐藏筛选框
	function show_hide() {
        document.body.innerHTML = "";
		// 在页面左侧插入一个用户筛选框
        var body = document.getElementsByTagName("body")[0];
        var div = document.createElement("div");
        var monitor_div = document.createElement("div");
        var uid_input = document.createElement("input");
        var time_input = document.createElement("input");
        var textarea = document.createElement("textarea");
        var monitor = document.createElement("button");
        var clear = document.createElement("button");
        div.style.position = "fixed";
        div.style.top = "5%";
        div.style.width = "100%";
        div.style.left = "10px";
        monitor_div.setAttribute("id", "monitor_div");
        uid_input.id = "uid_input";
        uid_input.type = "text";
        uid_input.style.width = "200px";
        uid_input.style.height = "30px";
        uid_input.style.padding = "5px";
        uid_input.setAttribute("placeholder", "输入用户UID");
        time_input.id = "time_input";
        time_input.type = "text";
        time_input.style.width = "200px";
        time_input.style.height = "30px";
        time_input.style.padding = "5px";
        time_input.setAttribute("placeholder", "输入监测循环时间（秒）");
        textarea.setAttribute("id", "textarea1");
        textarea.setAttribute("rows", "50");
        textarea.setAttribute("cols", "200");
        textarea.style.padding = "5px";
        textarea.style.margin = "10px 0px";
        monitor.innerText = "监测";
        monitor.style.fontSize = "18px";
        monitor.style.width = "100px";
        monitor.style.margin = "0px 10px";
        monitor.style.border = "1px solid";
        monitor.onclick = function(){ start_monitor(); };
        clear.innerText = "清空";
        clear.style.fontSize = "18px";
        clear.style.width = "100px";
        clear.style.border = "1px solid";
        clear.onclick = function(){ clear_dom(); };
        div.appendChild(monitor_div);
        monitor_div.appendChild(uid_input);
        monitor_div.appendChild(time_input);
        monitor_div.appendChild(monitor);
        monitor_div.appendChild(clear);
        monitor_div.appendChild(textarea);
        body.appendChild(div);

        // 清除数据
        function clear_dom() {
            document.getElementById("textarea1").value = "";
        }

        // 开始监测
        function start_monitor() {
            clearInterval(Interval1);
            var uid = document.getElementById("uid_input").value;
            var loop_time = document.getElementById("time_input").value;
            get_base_info(uid);
            Interval1 = setInterval(()=>{ get_base_info(uid) }, loop_time * 1000);
        }
	}

    function get_time() {   
        let time = new Date()
        return time.toLocaleString();
    }

    function get_base_info(uid) {
        // 构建url
        var url = "https://account.bilibili.com/api/member/getCardByMid?mid=" + uid;
        // 建立所需的对象
        var httpRequest = new XMLHttpRequest();
        // 打开连接  将请求参数写在url中 
        httpRequest.open('GET', url, true);
        // 发送请求  将请求参数写在URL中
        httpRequest.send();
        httpRequest.onerror = function(error) { 
            console.log("请求get_base_info出错！" + error); 
            layer.msg('请求get_base_info出错！');
            layer.close(load_index);
        };
        httpRequest.ontimeout = function() { 
            console.log("请求get_base_info超时！"); 
            layer.msg('请求get_base_info超时！');
            layer.close(load_index);
        };
        // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                // 获取到json字符串
                var ret = httpRequest.responseText;
                //console.log(ret);
                // 转为JSON对象
                var json = JSON.parse(ret);
                console.log(json);
    
                global_name = json['card']['name'];
                global_uid = json['card']['mid'];
                global_fans = json['card']['fans']

                get_room_id(uid);

                return 1;
            }
        };
    }
    
    function get_room_id(uid) {
        // 构建url
        var url = "https://api.live.bilibili.com/room/v2/Room/room_id_by_uid?uid=" + uid;
        // 建立所需的对象
        var httpRequest = new XMLHttpRequest();
        // 打开连接  将请求参数写在url中 
        httpRequest.open('GET', url, true);
        // 发送请求  将请求参数写在URL中
        httpRequest.send();
        httpRequest.onerror = function(error) { 
            console.log("请求get_room_id出错！" + error); 
            layer.msg('请求get_room_id出错！');
            layer.close(load_index);
        };
        httpRequest.ontimeout = function() { 
            console.log("请求get_room_id超时！"); 
            layer.msg('请求get_room_id超时！');
            layer.close(load_index);
        };
        // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                // 获取到json字符串
                var ret = httpRequest.responseText;
                //console.log(ret);
                // 转为JSON对象
                var json = JSON.parse(ret);
                console.log(json);
    
                global_roomid = json['data']['room_id'];
                get_guard_info(global_uid, global_roomid);

                return 1;
            }
        };
    }
    
    function get_guard_info(uid, room_id) {
        // 构建url
        var url = "https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=" + room_id + 
            '&page=1&ruid=' + uid + '&page_size=0';
        // 建立所需的对象
        var httpRequest = new XMLHttpRequest();
        // 打开连接  将请求参数写在url中 
        httpRequest.open('GET', url, true);
        // 发送请求  将请求参数写在URL中
        httpRequest.send();
        httpRequest.onerror = function(error) { 
            console.log("请求get_guard_info出错！" + error); 
            layer.msg('请求get_guard_info出错！');
            layer.close(load_index);
        };
        httpRequest.ontimeout = function() { 
            console.log("请求get_guard_info超时！"); 
            layer.msg('请求get_guard_info超时！');
            layer.close(load_index);
        };
        // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                // 获取到json字符串
                var ret = httpRequest.responseText;
                //console.log(ret);
                // 转为JSON对象
                var json = JSON.parse(ret);
                console.log(json);
    
                global_guard = json['data']['info']['num'];
                var msg = get_time() + ' | 用户名：' + global_name + ' | UID：' + global_uid + ' | 房间号：' + 
                global_roomid + ' | 粉丝增加：' + (global_fans - last_fans) + ' | 粉丝数：' + global_fans + 
                ' | 舰团增加：' + (global_guard - last_guard) + ' | 舰团数：' + global_guard + '\n';
                last_fans = global_fans;
                last_guard = global_guard;
                console.log(msg);

                var textarea1 = document.getElementById("textarea1");
                textarea1.value =  msg + textarea1.value;

                return 1;
            }
        };
    }

})