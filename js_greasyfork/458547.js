// ==UserScript==
// @name         b站视频评论区开奖脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  打开b站视频，左上角显示控制面板，等待页面大致加载完成后，再进行抽奖哦~
// @author       Ikaros
// @match        https://www.bilibili.com/video/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         http://bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/scripts/458547
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458547/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%BC%80%E5%A5%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458547/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%BC%80%E5%A5%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

; (async function () {
    // 获取时间
    function get_date() {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        h = h < 10 ? ('0' + h) : h;
        m = m < 10 ? ('0' + m) : m;
        s = s < 10 ? ('0' + s) : s;
        var currentDate = "[" + h + ":" + m + ":" + s + "] ";
        return currentDate;
    }

    // 弹窗div的定时器
    var interval_alert_div = null;
    // 评论数
    var comment_num = 1;

    // 生成弹窗div
    function init_alert_div() {
        var body = document.getElementsByTagName("body")[0];
        var alert_div = document.createElement("div");
        var alert_content_span = document.createElement("span");

        alert_div.id = "alert_div";
        alert_div.style.zIndex = "10000";
        alert_div.style.top = "1%";
        alert_div.style.left = "40%";
        alert_div.style.width = "300px";
        alert_div.style.height = "50px";
        alert_div.style.padding = "5px";
        alert_div.style.position = "fixed"
        alert_div.style.background = "#4a4a4aaa";
        alert_div.style.display = "none";
        alert_content_span.id = "alert_content_span";
        alert_content_span.style.width = "280px";
        alert_content_span.style.fontSize = "16px";
        alert_content_span.style.color = "white";
        alert_content_span.innerText = "";

        alert_div.appendChild(alert_content_span);
        body.appendChild(alert_div);
    }

    // 生成弹窗div
    init_alert_div()

    // 显示弹出框 传入显示的内容content
    function show_alert(content) {
        // 清除旧的定时
        clearTimeout(interval_alert_div);
        var alert_div = document.getElementById("alert_div");
        var alert_content_span = document.getElementById("alert_content_span");
        alert_content_span.innerText = content;
        alert_div.style.display = "block";
        // 5s后自动隐藏弹窗div
        interval_alert_div = setTimeout(() => {
            alert_div.style.display = "none";
        }, 5000);
    }

    console.log(get_date() + "b站视频评论区开奖脚本 加载成功")
    show_alert(get_date() + "b站视频评论区开奖脚本 加载成功")

    // 在页面左侧插入一个配置使用框
    function init_config_div() {
        var body = document.getElementsByTagName("body")[0];
        var br1 = document.createElement("br");
        var br2 = document.createElement("br");
        // var br3 = document.createElement("br");
        var div = document.createElement("div");
        var show_hide_div = document.createElement("div");
        var search_div = document.createElement("div");

        var draw_num_span = document.createElement("span");
        var draw_num_input = document.createElement("input");

        var start_run = document.createElement("button");
        var clear_btn = document.createElement("button");

        var textarea = document.createElement("textarea");

        div.style.position = "fixed";
        div.style.top = "10%";
        div.style.width = "400px";
        div.style.left = "10px";
        div.style.zIndex = "6666";
        div.style.background = "#4a4a4a70";
        show_hide_div.style.width = "220px";
        show_hide_div.style.fontSize = "18px";
        show_hide_div.style.background = "#ef8400";
        show_hide_div.style.textAlign = "center";
        show_hide_div.style.padding = "5px";
        show_hide_div.style.cursor = "pointer";
        show_hide_div.innerText = "视频评论区开奖☚";
        show_hide_div.onclick = function(){ show_hide(); };
        search_div.setAttribute("id", "search_div");
        search_div.style.display = "none";
        search_div.style.color = "#000000";
        search_div.style.marginLeft = "5px";

        draw_num_span.innerText = "抽奖人数：";
        draw_num_span.title = "抽出来的人数，如果是多等奖，建议按顺序1 2 3等，算了，随你";
        draw_num_input.setAttribute("id", "draw_num");
        draw_num_input.value = 1;
        draw_num_input.style.margin = "10px";
        draw_num_input.style.width = "175px";
        draw_num_input.setAttribute("placeholder", "输入中奖人数，默认1");

        start_run.innerText = "开始抽奖";
        start_run.title = "字面意思啦";
        start_run.style.background = "#61d0ff";
        start_run.style.border = "1px solid";
        start_run.style.borderRadius = "3px";
        start_run.style.fontSize = "18px";
        start_run.style.width = "100px";
        start_run.style.margin = "5px 10px";
        start_run.style.cursor = "pointer";
        start_run.onclick = function(){ 
            comment_num = parseInt(document.getElementsByClassName("total-reply")[0].innerText);

            console.log("评论数：" + comment_num)
            show_alert("评论数：" + comment_num)
            // 开始自动下滑 r_time毫秒一次
            my_loop = setInterval(
                function(){
                    r();
                }, r_time
            ); 
        };
        clear_btn.innerText = "清空日志";
        clear_btn.title = "字面意思啦";
        clear_btn.style.background = "#61d0ff";
        clear_btn.style.border = "1px solid";
        clear_btn.style.borderRadius = "3px";
        clear_btn.style.fontSize = "18px";
        clear_btn.style.width = "100px";
        clear_btn.style.margin = "5px 10px";
        clear_btn.style.cursor = "pointer";
        clear_btn.onclick = function(){ clear_log(); };

        textarea.id = "textarea";
        textarea.cols = "50";
        textarea.rows = "20";

        div.appendChild(show_hide_div);
        div.appendChild(search_div);
        search_div.appendChild(draw_num_span);
        search_div.appendChild(draw_num_input);
        search_div.appendChild(br1);
        search_div.appendChild(start_run);
        search_div.appendChild(clear_btn);
        search_div.appendChild(br2);
        search_div.appendChild(textarea);

        body.appendChild(div);
    }
    
    // 在页面左侧插入一个配置使用框
    init_config_div()

    // 显示隐藏配置使用框
    function show_hide() {
        var search_div = document.getElementById("search_div");
        if(search_div.style.display == "none") search_div.style.display = "block";
        else search_div.style.display = "none";
    }

    // 随机一个0-x的整数
    function random_num(x) {
        return Math.round(Math.random() * x)
    }

    // 清空textarea
    function clear_log() {
        document.getElementById("textarea").value = ""
    }

    show_alert(get_date() + "程序开始运行");
    console.log(get_date() + "程序开始运行");
    show_alert(get_date() + "定义集合存储数据");
    console.log(get_date() + "定义集合存储数据");
    let name_set = new Set();
    let id_set = new Set();

    // 循环变量
    var my_loop;
    // 下滑延时 1000毫秒 网速/加载速度较慢的朋友们最好放慢速度 提高准确性
    var r_time = 1000;

    // 下滑
    function r()
    {
        setTimeout(() => {
            window.scroll(0, 1);
        }, 1000); 
        window.scroll(0, 1920*comment_num);
        // 没有评论后自动停止下滑 并 抽奖
        if(document.getElementsByClassName("reply-end")[0])
        {
            // 停止下滑循环
            stop_r();
            // 抽奖函数
            draw();
        }
    }

    // 停止下滑循环
    function stop_r()
    {
        clearInterval(my_loop);
    }

    // 抽奖函数
    function draw()
    {
        show_alert(get_date() + "开始载入数据");
        console.log(get_date() + "开始载入数据");

        // 循环次数
        var len = document.getElementsByClassName("user-name").length;
        for(var i=0; i<len; i++)
        {
            var name = document.getElementsByClassName("user-name")[i].innerText;
            var id = document.getElementsByClassName("user-name")[i].getAttributeNode("data-user-id").value;
            // console.log(name+"，加入集合");
            name_set.add(name);
            id_set.add(id);
        }
        
        show_alert(get_date() + "全部数据加载完毕");
        console.log(get_date() + "全部数据加载完毕");
        document.getElementById("textarea").value += get_date() + "全部数据加载完毕\n";
        show_alert(get_date() + "总共" + name_set.size + "名用户");
        console.log(get_date() + "总共" + name_set.size + "名用户");
        document.getElementById("textarea").value += get_date() + "总共" + name_set.size + "名用户\n";
        
        // 这就是注释
        //return false;

        var num = document.getElementById("draw_num").value;
        try {
            num = parseInt(num);
            go(num);
        } catch(error) {
            console.log(error);
            go(1);
        }
    }

    // 获取幸运儿
    function go(num)
    {
        for(var i = 0; i < num; i++)
        {
            // 生成随机数，直接打印中奖者信息
            var lucky_num = parseInt(Math.random()*(name_set.size), 10);

            var out_str = get_date() + " \n" + 
                get_date() + "中奖用户ID为:" + Array.from(id_set)[lucky_num] + " \n" +
                get_date() + "中奖用户名为:" + Array.from(name_set)[lucky_num] + " \n" +
                get_date() + " \n";

            document.getElementById("textarea").value += out_str;

            show_alert(get_date() + "已经输出第" + (i + 1) + "位中奖用户~")
            console.log(out_str);
        }
    }

})();