// ==UserScript==
// @name         b站大锦鲤 动态转发抽奖 脚本（抽奖已死）
// @namespace    http://tampermonkey.net/
// @version      9.4
// @description  【官方已经限制抽奖次数了，散了吧】在大锦鲤的动态页：https://space.bilibili.com/226257459/dynamic，找到转发抽奖的专栏，使用左上角的弹出窗点运行 即可（用完记得关闭插件）【兼容 糯米是个背包 的专栏：https://space.bilibili.com/492426375/dynamic】
// @author       Ikaros
// @match        https://www.bilibili.com/read/cv*
// @match        https://t.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/404
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         http://bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/scripts/456890
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456890/b%E7%AB%99%E5%A4%A7%E9%94%A6%E9%B2%A4%20%E5%8A%A8%E6%80%81%E8%BD%AC%E5%8F%91%E6%8A%BD%E5%A5%96%20%E8%84%9A%E6%9C%AC%EF%BC%88%E6%8A%BD%E5%A5%96%E5%B7%B2%E6%AD%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456890/b%E7%AB%99%E5%A4%A7%E9%94%A6%E9%B2%A4%20%E5%8A%A8%E6%80%81%E8%BD%AC%E5%8F%91%E6%8A%BD%E5%A5%96%20%E8%84%9A%E6%9C%AC%EF%BC%88%E6%8A%BD%E5%A5%96%E5%B7%B2%E6%AD%BB%EF%BC%89.meta.js
// ==/UserScript==

; (async function () {
    console.log("b站大锦鲤 动态转发抽奖 脚本 加载成功")

    // 通用的随机延时时间
    let common_random_time = 500
    // 调用接口的定时器
    var interval1 = null
    // 弹窗div的定时器
    var interval_alert_div = null
    // 所有操作成功标志位 
    var all_success = true
    // 如果中途中断了，可以自定义开始的下标
    let start_num = 1
    // 自定义结束的下标
    let end_num = 999
    // 打开页面的延时 120s
    let open_time = 120
    // 循环调接口的延时 默认30分钟一轮巡
    let interval_time = 30
    // 定时运行定时器
    let interval_run = null
    // 存储打开过的调用API接口的动态id
    let api_dynamic_id_json = {"dynamic_id": []}
    // 清空已经存储的动态id
    // GM_setValue("api_dynamic_id_json", JSON.stringify(api_dynamic_id_json))

    // 生成弹窗div
    function init_alert_div() {
        var body = document.getElementsByTagName("body")[0];
        var alert_div = document.createElement("div");
        var alert_content_span = document.createElement("span");

        alert_div.id = "alert_div";
        alert_div.style.zIndex = "66666";
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

    // 显示弹出框 传入显示的内容content
    function show_alert(content) {
        var data_json = {}
        try {
            data_json = JSON.parse(GM_getValue("data_json"));
        } catch {
            data_json = {
                "alert_div_checkbox": true
            };
        }

        try {
            api_dynamic_id_json = JSON.parse(GM_getValue("api_dynamic_id_json"));
        } catch {
            api_dynamic_id_json = {
                "dynamic_id": []
            };
            GM_setValue("api_dynamic_id_json", JSON.stringify(api_dynamic_id_json))
        }
        
        // 获取启用状态
        if(true != data_json["alert_div_checkbox"]) return;

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

    // 生成弹窗div
    init_alert_div()

    // 获取时间戳（毫秒级）并转换为 _秒级_毫秒 + 一个莫名其妙的数字 待解密
    function get_now_date() {
        var date = Date.now()
        return "_" + date.toString().slice(0, 10) + "_" + date.toString().slice(-3) + random_num(9).toString()
    }

    // 传入动态链接，返回动态id
    function dynamic_url_to_id(url) {
        console.log("url=" + url)

        var matches = url.match(/\d+/g);
        if (matches) {
            return matches[0];
        } else {
            return null;
        }
    }

    // 新动态链接转老动态链接
    function new_dynamic_url_to_old(url) {
        let id = dynamic_url_to_id(url)
        if(id == null) return null
        return "https://t.bilibili.com/" + id.toString()
    }

    // 判断动态是否已经点赞过
    async function already_like(url) {
        var dynamic_url = url;
        return new Promise((resolve, reject) => {
            var dynamic_id = dynamic_url_to_id(dynamic_url);

            // 构建url
            var url = "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?timezone_offset=-480&id=" + dynamic_id
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('GET', url, true);
            httpRequest.withCredentials = true;
            // 发送请求  将请求参数写在URL中
            httpRequest.send();
            httpRequest.onerror = function(error) { 
                console.log("请求动态详情接口出错！" + error); 
                show_alert("请求动态详情接口出错！" + error);
            };
            httpRequest.ontimeout = function() { 
                console.log("请求动态详情接口超时！"); 
                show_alert("请求动态详情接口超时！"); 
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

                    try {
                        if(json["code"] == 0) {
                            var status = json["data"]["item"]["modules"]["module_stat"]["like"]["status"]
                            
                            if(status) {
                                console.log("动态 " + dynamic_id + " 已点赞")
                                show_alert("动态 " + dynamic_id + " 已点赞")
                            } else {
                                console.log("动态 " + dynamic_id + " 未点赞")
                            }
                            
                            
                            resolve(status);
                        } else {
                            console.log("获取动态 " + dynamic_id + " 点赞情况 失败")
                            show_alert("获取动态 " + dynamic_id + " 点赞情况 失败")

                            resolve(false);
                        }
                    } catch {
                        console.log("获取动态 " + dynamic_id + " 点赞情况 失败")
                        show_alert("获取动态 " + dynamic_id + " 点赞情况 失败")

                        resolve(false);
                    }
                }
            };
        });
    }

    // 在页面左侧插入一个配置使用框
    function init_config_div() {
        console.log("生成配置使用框")

        var body = document.getElementsByTagName("body")[0];
        var br1 = document.createElement("br");
        var br2 = document.createElement("br");
        var br3 = document.createElement("br");
        var br4 = document.createElement("br");
        var br5 = document.createElement("br");
        var br6 = document.createElement("br");
        var br7 = document.createElement("br");
        var br8 = document.createElement("br");
        var br9 = document.createElement("br");
        var br10 = document.createElement("br");
        var br11 = document.createElement("br");
        var br12 = document.createElement("br");
        var br13 = document.createElement("br");
        var br14 = document.createElement("br");
        var div = document.createElement("div");
        var show_hide_div = document.createElement("div");
        var search_div = document.createElement("div");

        var link_num_span = document.createElement("span");

        var start_num_span = document.createElement("span");
        var start_num_input = document.createElement("input");

        var end_num_span = document.createElement("span");
        var end_num_input = document.createElement("input");

        var open_time_span = document.createElement("span");
        var open_time_input = document.createElement("input");

        var comment_span = document.createElement("span");
        var comment_input = document.createElement("input");

        var forward_comment_span = document.createElement("span");
        var forward_comment_input = document.createElement("input");

        var append_time_span = document.createElement("span");
        var append_time_input = document.createElement("input");

        var operation_interval_span = document.createElement("span");
        var operation_interval_input = document.createElement("input");

        var interval_span = document.createElement("span");
        var interval_input = document.createElement("input");

        var start_run = document.createElement("button");
        var start_run2 = document.createElement("button");
        var set_btn = document.createElement("button");
        var color_btn = document.createElement("button");

        var alert_div_checkbox = document.createElement("input");
        var alert_div_label = document.createElement("label");
        var use_api_checkbox = document.createElement("input");
        var use_api_label = document.createElement("label");
        var order_checkbox = document.createElement("input");
        var order_label = document.createElement("label");
        var unfollow_checkbox = document.createElement("input");
        var unfollow_label = document.createElement("label");

        var time_input = document.createElement("input");
        var start_run3 = document.createElement("button");

        var link_textarea = document.createElement("textarea");
        var start_run4 = document.createElement("button");

        div.setAttribute("id", "main_div");
        div.style.position = "fixed";
        div.style.top = "10%";
        div.style.width = "320px";
        div.style.left = "10px";
        div.style.zIndex = "66666";
        div.style.background = "#f4f5f7b0";
        show_hide_div.style.width = "120px";
        show_hide_div.style.fontSize = "18px";
        show_hide_div.style.background = "#ef8400";
        show_hide_div.style.textAlign = "center";
        show_hide_div.style.padding = "5px";
        show_hide_div.style.cursor = "pointer";
        show_hide_div.innerText = "页面检索☚";
        show_hide_div.onclick = function(){ show_hide(); };
        search_div.setAttribute("id", "search_div");
        search_div.style.display = "none";
        search_div.style.color = "#000000";
        search_div.style.marginLeft = "5px";

        var a_arr = [];
        // 是否在专栏页面
        if(window.location.href.startsWith("https://www.bilibili.com/read/cv")) {
            a_arr = document.getElementById("article-content").getElementsByTagName("a")
        } else if(window.location.href.startsWith("https://message.bilibili.com/")) {
            a_arr = document.getElementsByClassName("dynamic-link")
        }
        
        link_num_span.innerText = "检索到的动态总量：" + a_arr.length;
        link_num_span.id = "link_num";
        link_num_span.style.fontWeight = "900";

        start_num_span.innerText = "打开页面起始索引";
        start_num_span.title = "页面起始索引从0开始，就是从0开始的所有页面的遍历开始的起始下标，0表示第一个页面";
        start_num_input.setAttribute("id", "start_num");
        start_num_input.value = 1;
        start_num_input.style.margin = "10px";
        start_num_input.style.width = "175px";
        start_num_input.style.background = "white";
        start_num_input.setAttribute("placeholder", "输入页面索引下标，默认1");

        end_num_span.innerText = "打开页面结尾索引";
        end_num_span.title = "页面结尾索引默认999，就是从开始到999所有页面，999表示第1000个页面";
        end_num_input.setAttribute("id", "end_num");
        end_num_input.value = 999;
        end_num_input.style.margin = "10px";
        end_num_input.style.width = "175px";
        end_num_input.style.background = "white";
        end_num_input.setAttribute("placeholder", "输入页面索引下标，默认999");

        open_time_span.innerText = "打开页面间隔(秒)";
        open_time_span.title = "打开前一个动态页面和现在这个页面直接间隔的时间，就是如果间隔是1小时，打开第一个页面是1点，那么2点会打开第二个页面";
        open_time_input.setAttribute("id", "open_time");
        open_time_input.value = 120;
        open_time_input.style.margin = "10px";
        open_time_input.style.width = "180px";
        open_time_input.style.background = "white";
        open_time_input.setAttribute("placeholder", "输入打开页面间隔，默认120秒");
        comment_span.innerText = "动态评论内容";
        comment_span.title = "动态 评论区发表的评论的内容";
        comment_input.setAttribute("id", "comment");
        comment_input.value = "";
        comment_input.style.margin = "10px";
        comment_input.style.width = "200px";
        comment_input.style.background = "white";
        comment_input.setAttribute("placeholder", "不配置默认不给动态评论");
        forward_comment_span.innerText = "转发评论内容";
        forward_comment_span.title = "动态 转发区发表的评论的内容";
        forward_comment_input.setAttribute("id", "forward_comment");
        forward_comment_input.value = "";
        forward_comment_input.style.margin = "10px";
        forward_comment_input.style.width = "200px";
        forward_comment_input.style.background = "white";
        forward_comment_input.setAttribute("placeholder", "不配置默认直接转发，不在转发时追加评论");
        operation_interval_span.innerText = "操作延时间隔(毫秒)";
        operation_interval_span.title = "点赞/评论/转发等操作之间间隔的延时时间，主要在用户网络卡顿导致页面加载慢的情况下使用，默认3000毫秒，不建议设太小，不然很容易操作失败";
        operation_interval_input.setAttribute("id", "operation_interval");
        operation_interval_input.value = 3000;
        operation_interval_input.style.margin = "10px";
        operation_interval_input.style.width = "165px";
        operation_interval_input.style.background = "white";
        operation_interval_input.setAttribute("placeholder", "默认操作延时间隔是3000毫秒");
        append_time_span.innerText = "追加延时时间(毫秒)";
        append_time_span.title = "点赞/评论/转发等操作的追加的延时时间，主要在用户网络卡顿导致页面加载慢的情况下使用";
        append_time_input.setAttribute("id", "common_append_time");
        append_time_input.value = 0;
        append_time_input.style.margin = "10px";
        append_time_input.style.width = "165px";
        append_time_input.style.background = "white";
        append_time_input.setAttribute("placeholder", "默认追加延时是0毫秒");
        interval_span.innerText = "调用接口的循环周期(分)";
        interval_span.title = "每隔这个周期，会请求话题接口获取最新动态然后去进行转发操作";
        // interval_span.style.display = "none"
        interval_input.setAttribute("id", "interval");
        interval_input.value = 30;
        interval_input.style.margin = "10px";
        interval_input.style.width = "140px";
        // interval_input.style.display = "none"
        interval_input.style.background = "white";
        interval_input.setAttribute("placeholder", "默认每30分钟运行一次");

        alert_div_checkbox.id = "alert_div_checkbox";
        alert_div_checkbox.type = "checkbox";
        alert_div_label.innerText = "启用提示框";
        alert_div_label.title = "用于开关提示框，提示框主要用于确认程序运行情况";
        alert_div_label.setAttribute("for", "alert_div_checkbox");
        use_api_checkbox.id = "use_api_checkbox";
        use_api_checkbox.type = "checkbox";
        use_api_label.innerText = "调API模式";
        use_api_label.title = "用于切换工作模式，不开启默认为模拟手动模式，开启后直接调用API完成评论等操作";
        use_api_label.setAttribute("for", "use_api_checkbox");
        order_checkbox.id = "order_checkbox";
        order_checkbox.type = "checkbox";
        order_label.innerText = "预约抽奖";
        order_label.title = "用于开关预约抽奖，默认不启用预约抽奖，容易黑预约";
        order_label.setAttribute("for", "order_checkbox");
        unfollow_checkbox.id = "unfollow_checkbox";
        unfollow_checkbox.type = "checkbox";
        unfollow_label.innerText = "取关模式";
        unfollow_label.title = "取消关注，默认不启用，主要用于开奖后取关";
        unfollow_label.setAttribute("for", "unfollow_checkbox");

        start_run.innerText = "开始运行";
        start_run.title = "保存配置，并开始自动检索页面并进行自动转发";
        start_run.style.background = "#61d0ff";
        start_run.style.border = "1px solid";
        start_run.style.borderRadius = "3px";
        start_run.style.fontSize = "18px";
        start_run.style.width = "100px";
        start_run.style.margin = "5px 10px";
        start_run.style.cursor = "pointer";
        start_run.onclick = function(){ go(0); };
        start_run2.innerText = "调话题接口运行";
        start_run2.title = "保存配置，并开始循环调接口查找新话题动态页面并进行自动转发";
        start_run2.style.background = "#61d0ff";
        start_run2.style.border = "1px solid";
        start_run2.style.borderRadius = "3px";
        start_run2.style.fontSize = "18px";
        start_run2.style.width = "200px";
        start_run2.style.margin = "5px 10px";
        start_run2.style.cursor = "pointer";
        start_run2.onclick = function(){ go2(); };
        set_btn.innerText = "仅保存配置";
        set_btn.title = "仅保存上面的配置项，你就可以手动打开动态页面进行测试操作";
        set_btn.style.background = "#61d0ff";
        set_btn.style.border = "1px solid";
        set_btn.style.borderRadius = "3px";
        set_btn.style.fontSize = "18px";
        set_btn.style.width = "100px";
        set_btn.style.margin = "5px 10px";
        set_btn.style.cursor = "pointer";
        set_btn.onclick = function(){ set_config(); };
        color_btn.innerText = "给选中的链接标记颜色";
        color_btn.title = "点击后会给前面起始和结尾索引范围内的链接标上红色背景，方便用户确认范围";
        color_btn.style.background = "#61d0ff";
        color_btn.style.border = "1px solid";
        color_btn.style.borderRadius = "3px";
        color_btn.style.fontSize = "18px";
        color_btn.style.width = "200px";
        color_btn.style.margin = "5px 10px";
        color_btn.style.cursor = "pointer";
        color_btn.onclick = function(){ set_color(); };

        time_input.id = "run_time";
        time_input.type = "time";
        var now_hour = new Date().getHours();
        var now_min = new Date().getMinutes();
        var now_time = (now_hour >= 10 ? now_hour : "0" + now_hour) + ":" + (now_min >= 10 ? now_min : "0" + now_min);
        time_input.value = now_time;
        time_input.style.cursor = "pointer";
        time_input.style.width = "100px";
        time_input.style.fontSize = "18px";
        time_input.style.border = "1px solid";
        time_input.style.borderRadius = "3px";
        time_input.style.background = "white";
        start_run3.innerText = "定时开始";
        start_run3.title = "保存配置，等到达定时时间后，开始自动检索页面并进行自动转发";
        start_run3.style.background = "#61d0ff";
        start_run3.style.border = "1px solid";
        start_run3.style.borderRadius = "3px";
        start_run3.style.fontSize = "18px";
        start_run3.style.width = "100px";
        start_run3.style.margin = "5px 10px";
        start_run3.style.cursor = "pointer";
        start_run3.onclick = function(){ 
            show_alert("开始定时运行喵~，到" + document.getElementById("run_time").value + "时开始运行程序~")
            console.log("开始定时运行喵~，到" + document.getElementById("run_time").value + "时开始运行程序~")
            clearInterval(interval_run);
            go(1);
            // 定时 每30s 运行一次
            interval_run = setInterval(function(){ go(1); }, 30 * 1000);
        };

        link_textarea.setAttribute("id", "link_textarea");
        link_textarea.value = "";
        link_textarea.cols = "40";
        link_textarea.rows = "5";
        link_textarea.style.background = "white";
        link_textarea.setAttribute("placeholder", "此处填入动态链接，注意：每一个链接占一行，并且链接结尾不能有其他字符！");
        start_run4.innerText = "自定义链接运行";
        start_run4.title = "保存配置，检索文本框内的链接，打开进行自动转发";
        start_run4.style.background = "#61d0ff";
        start_run4.style.border = "1px solid";
        start_run4.style.borderRadius = "3px";
        start_run4.style.fontSize = "18px";
        start_run4.style.width = "200px";
        start_run4.style.margin = "5px 10px";
        start_run4.style.cursor = "pointer";
        start_run4.onclick = function(){ go(2); };

        // 加载旧配置的数据
        var data_json = {}
        try {
            data_json = JSON.parse(GM_getValue("data_json"));
        } catch {
            data_json = {}
        }

        try {
            api_dynamic_id_json = JSON.parse(GM_getValue("api_dynamic_id_json"));
        } catch {
            api_dynamic_id_json = {"dynamic_id": []}
            GM_setValue("api_dynamic_id_json", JSON.stringify(api_dynamic_id_json))
        }
        // 初始化复选框选中状态
        if(data_json.hasOwnProperty("alert_div_checkbox")) {
            if(alert_div_checkbox.checked == null) alert_div_checkbox.checked = true
            else alert_div_checkbox.checked = data_json["alert_div_checkbox"]
        } else {
            alert_div_checkbox.checked = true
            data_json["alert_div_checkbox"] = true
        }

        if(data_json.hasOwnProperty("use_api_checkbox")) {
            if(use_api_checkbox.checked == null) use_api_checkbox.checked = false
            else use_api_checkbox.checked = data_json["use_api_checkbox"]
        } else {
            use_api_checkbox.checked = false
            data_json["use_api_checkbox"] = false
        }

        if(data_json.hasOwnProperty("order_checkbox")) {
            if(order_checkbox.checked == null) order_checkbox.checked = false
            else order_checkbox.checked = data_json["order_checkbox"]
        } else {
            order_checkbox.checked = false
            data_json["order_checkbox"] = false
        }
        
        if(data_json.hasOwnProperty("unfollow_checkbox")) {
            if(unfollow_checkbox.checked == null) unfollow_checkbox.checked = false
            else unfollow_checkbox.checked = data_json["unfollow_checkbox"]
        } else {
            unfollow_checkbox.checked = false
            data_json["unfollow_checkbox"] = false
        }

        if(data_json.hasOwnProperty("start_num")) {
            if(data_json["start_num"] == null) start_num_input.value = 1
            else start_num_input.value = data_json["start_num"]
        } else {
            start_num_input.value = 1
            data_json["start_num"] = 1
        }

        if(data_json.hasOwnProperty("end_num")) {
            if(data_json["end_num"] == null) end_num_input.value = 999
            else end_num_input.value = data_json["end_num"]
        } else {
            end_num_input.value = 999
            data_json["end_num"] = 999
        }
        
        if(data_json.hasOwnProperty("open_time")) {
            if(data_json["open_time"] == null) open_time.value = 120
            else open_time_input.value = data_json["open_time"]
        } else {
            open_time_input.value = 120
            data_json["open_time"] = 120
        }
        if(data_json.hasOwnProperty("comment_content")) {
            comment_input.value = data_json["comment_content"]
        } else {
            comment_input.value = ""
            data_json["comment_content"] = ""
        }
        if(data_json.hasOwnProperty("forward_comment_content")) {
            forward_comment_input.value = data_json["forward_comment_content"]
        } else {
            forward_comment_input.value = ""
            data_json["forward_comment_content"] = ""
        }
        if(data_json.hasOwnProperty("common_append_time")) {
            if(data_json["append_time_input"] == null) append_time_input.value = 0
            else append_time_input.value = data_json["common_append_time"]
        } else {
            append_time_input.value = 0
            data_json["common_append_time"] = 0
        }
        if(data_json.hasOwnProperty("operation_interval")) {
            if(data_json["operation_interval_input"] == null) interval_input.value = 3000
            else operation_interval_input.value = data_json["operation_interval"]
        } else {
            operation_interval_input.value = 3000
            data_json["operation_interval"] = 3000
        }
        if(data_json.hasOwnProperty("interval_time")) {
            if(data_json["interval_time"] == null) interval_input.value = 30
            else interval_input.value = data_json["interval_time"]
        } else {
            interval_input.value = 30
            data_json["interval_time"] = 30
        }

        if(data_json.hasOwnProperty("follow_tagid")) {
            if(data_json["follow_tagid"] == null) data_json["follow_tagid"] = 0
        } else {
            data_json["follow_tagid"] = 0
        }

        GM_setValue("data_json", JSON.stringify(data_json))


        div.appendChild(show_hide_div);
        div.appendChild(search_div);
        search_div.appendChild(link_num_span);
        search_div.appendChild(br10);
        search_div.appendChild(start_num_span);
        search_div.appendChild(start_num_input);
        search_div.appendChild(br1);
        search_div.appendChild(end_num_span);
        search_div.appendChild(end_num_input);
        search_div.appendChild(br9);
        search_div.appendChild(open_time_span);
        search_div.appendChild(open_time_input);
        search_div.appendChild(br2);
        search_div.appendChild(comment_span);
        search_div.appendChild(comment_input);
        search_div.appendChild(br3);
        search_div.appendChild(forward_comment_span);
        search_div.appendChild(forward_comment_input);
        search_div.appendChild(br4);
        search_div.appendChild(operation_interval_span);
        search_div.appendChild(operation_interval_input);
        search_div.appendChild(br8);
        search_div.appendChild(append_time_span);
        search_div.appendChild(append_time_input);
        search_div.appendChild(br5);
        search_div.appendChild(interval_span);
        search_div.appendChild(interval_input);
        search_div.appendChild(br14);
        search_div.appendChild(alert_div_checkbox);
        search_div.appendChild(alert_div_label);
        search_div.appendChild(use_api_checkbox);
        search_div.appendChild(use_api_label);
        search_div.appendChild(order_checkbox);
        search_div.appendChild(order_label);
        search_div.appendChild(unfollow_checkbox);
        search_div.appendChild(unfollow_label);
        search_div.appendChild(br6);
        search_div.appendChild(start_run);
        search_div.appendChild(set_btn);
        search_div.appendChild(br7);
        search_div.appendChild(color_btn);
        search_div.appendChild(br11);
        search_div.appendChild(time_input);
        search_div.appendChild(start_run3);
        search_div.appendChild(br12);
        search_div.appendChild(link_textarea);
        search_div.appendChild(start_run4);
        search_div.appendChild(br13);
        search_div.appendChild(start_run2);

        body.appendChild(div);

        // 创建关注分组
        create_follow_group("抽奖");
    }

    // 仅保存配置 用于手动测试 传入运行的类型
    function set_config(type) {
        try {
            // 删除无用内容
            remove_useless()
        } catch (error) {
            console.log(error)
        }

        var a_arr = [];
        // 是否在专栏页面
        if(window.location.href.startsWith("https://www.bilibili.com/read/cv")) {
            a_arr = document.getElementById("article-content").getElementsByTagName("a")
        } else if(window.location.href.startsWith("https://message.bilibili.com/")) {
            a_arr = document.getElementsByClassName("dynamic-link")
        }
        document.getElementById("link_num").innerText = "检索到的动态总量：" + a_arr.length;

        // 空值自动补充默认值
        document.getElementById("comment").value = document.getElementById("comment").value ? document.getElementById("comment").value : ""
        document.getElementById("forward_comment").value = document.getElementById("forward_comment").value ? document.getElementById("forward_comment").value : ""
        document.getElementById("common_append_time").value = document.getElementById("common_append_time").value != "" ? parseInt(document.getElementById("common_append_time").value) : 0
        document.getElementById("operation_interval").value = document.getElementById("operation_interval").value != "" ? parseInt(document.getElementById("operation_interval").value) : 3000
        document.getElementById("start_num").value = document.getElementById("start_num").value != "" ? parseInt(document.getElementById("start_num").value) : 1
        document.getElementById("end_num").value = document.getElementById("end_num").value != "" ? parseInt(document.getElementById("end_num").value) : 999
        document.getElementById("open_time").value = document.getElementById("open_time").value != "" ? parseInt(document.getElementById("open_time").value) : 120
        document.getElementById("interval").value = document.getElementById("interval").value != "" ? parseInt(document.getElementById("interval").value) : 30

        var comment_content = document.getElementById("comment").value != "" ? document.getElementById("comment").value : ""
        var forward_comment_content = document.getElementById("forward_comment").value != "" ? document.getElementById("forward_comment").value : ""
        var common_append_time = document.getElementById("common_append_time").value != "" ? parseInt(document.getElementById("common_append_time").value) : 0
        var operation_interval = document.getElementById("operation_interval").value != "" ? parseInt(document.getElementById("operation_interval").value) : 3000
        start_num = document.getElementById("start_num").value != "" ? parseInt(document.getElementById("start_num").value) : 1
        end_num = document.getElementById("end_num").value != "" ? parseInt(document.getElementById("end_num").value) : 999
        open_time = document.getElementById("open_time").value != "" ? parseInt(document.getElementById("open_time").value) : 120
        interval_time = document.getElementById("interval").value != "" ? parseInt(document.getElementById("interval").value) : 30

        // 获取下 配置数据
        var temp_data_json = JSON.parse(GM_getValue("data_json"));

        var data_json = {
            "comment_content": comment_content,
            "forward_comment_content": forward_comment_content,
            "operation_interval": operation_interval,
            "common_append_time": common_append_time,
            "start_num": start_num,
            "end_num": end_num,
            "open_time": open_time,
            "interval_time": interval_time,
            "alert_div_checkbox": document.getElementById("alert_div_checkbox").checked,
            "use_api_checkbox": document.getElementById("use_api_checkbox").checked,
            "order_checkbox": document.getElementById("order_checkbox").checked,
            "unfollow_checkbox": document.getElementById("unfollow_checkbox").checked,
            "follow_tagid": temp_data_json["follow_tagid"]
        }

        GM_setValue("data_json", JSON.stringify(data_json))

        console.log(data_json)

        // 自定义链接的情况不需要上色
        if(type != 2) {
            set_color()
        }

        show_alert("配置保存成功喵~")

        // 取关模式 勾选
        if(document.getElementById("unfollow_checkbox").checked == true) {
            // 关注页面
            if(window.location.href.startsWith("https://space.bilibili.com/") && window.location.href.indexOf("/fans/follow") != -1) {
                function unfollow2() {
                    var list_num = document.getElementsByClassName("be-dropdown fans-action-btn fans-action-follow").length;
                    for(let i = 0; i < list_num; i++) {
                        setTimeout(function(){
                            // 点击取关
                            document.getElementsByClassName("be-dropdown fans-action-btn fans-action-follow")[0].getElementsByClassName("be-dropdown-item")[1].click()
                        }, i * 1000 + random_num(250));
                    }
                    
                    setTimeout(function(){
                        if(list_num != 20) {
                            console.log("取关完毕");
                            show_alert("取关完毕");
                            return;
                        } else {
                            console.log("切换页面");
                            show_alert("切换页面");
                            if(document.getElementsByClassName("be-pager-prev")[0]) {
                                if(document.getElementsByClassName("be-pager-prev be-pager-disabled")[0] == null) {
                                    document.getElementsByClassName("be-pager-prev")[0].click();
                                } else {
                                    if(document.getElementsByClassName("be-pager-next")[0]) {
                                        if(document.getElementsByClassName("be-pager-next be-pager-disabled")[0] == null) {
                                            document.getElementsByClassName("be-pager-next")[0].click();
                                        } else {
                                            console.log("取关完毕");
                                            show_alert("取关完毕");
                                        }
                                    }
                                }
                            }
                            
                            setTimeout(function(){ unfollow2();}, 3000 + random_num(250));
                        }
                    }, (list_num + 3) * 1000 + random_num(250))
                }
                
                let res = confirm('确定在此页面开始取关操作吗？');
                if(res == true) {
                    console.log("开始取关");
                    show_alert("开始取关");
                    unfollow2();
                }
            }
        }
    }

    // 显示隐藏配置使用框
    function show_hide() {
        var search_div = document.getElementById("search_div");
        if(search_div.style.display == "none") search_div.style.display = "block";
        else search_div.style.display = "none";
    }

    // 给索引范围内的链接上色
    function set_color() {
        start_num = parseInt(document.getElementById("start_num").value)
        end_num = parseInt(document.getElementById("end_num").value)

        // 是否在专栏页面
        if(window.location.href.startsWith("https://www.bilibili.com/read/cv")) {
            var a_arr = document.getElementById("article-content").getElementsByTagName("a")

            for(var i = 0; i < a_arr.length; i++) {
                // 索引范围外的 设为白色背景
                if(i < start_num || i > end_num) {
                    a_arr[i].style.background = "white"
                } else {
                    // 范围内的设为黄色背景
                    a_arr[i].style.background = "yellow"
                }
            }
        } else if(window.location.href.startsWith("https://message.bilibili.com/")) {
            var a_arr = document.getElementsByClassName("dynamic-link")

            for(var i = 0; i < a_arr.length; i++) {
                // 索引范围外的 设为白色背景
                if(i > (a_arr.length - 1 - start_num) || i < (a_arr.length - 1 - end_num)) {
                    a_arr[i].style.background = "white"
                    a_arr[i].style.color = "black"
                } else {
                    // 范围内的设为黄色背景
                    a_arr[i].style.background = "yellow"
                    a_arr[i].style.color = "black"
                }
            }
        }
    }

    // 准备打开页面 传入type 0为直接运行 1为定时运行 2为自定义链接
    function go(type) {
        // 自定义链接
        if(type == 2) {
            // 设置配置项
            set_config(2)

            var ori_data = document.getElementById("link_textarea").value;
            var ori_data_arr = ori_data.split('\n');
            // 链接数计数
            var link_num = 0;

            // 遍历原始数据
            for(let i = 0; i < ori_data_arr.length; i++) {
                var index = ori_data_arr[i].indexOf("https://");
                if(index == -1) continue;
                let link = ori_data_arr[i].substring(index);
                // 转老动态
                link = new_dynamic_url_to_old(link);

                setTimeout(function() {
                    console.log("i:" + i + " 跳转：" + link)
                    show_alert("i:" + i + " 跳转：" + link)
                    // window.open(a_arr[i].getAttribute("href"))
                    // active:true，新标签页获取页面焦点
                    // setParent :true:新标签页面关闭后，焦点重新回到源页面
                    GM_openInTab(link, { active: false, setParent :true});
                }, open_time * 1000 * link_num)
                link_num++;
            }

            return;
        }

        // 设置配置项
        set_config(0)
    
        console.log("start_num=" + start_num + " end_num=" + end_num)

        // 是否在专栏页面
        if(window.location.href.startsWith("https://www.bilibili.com/read/cv")) {
            var a_arr = document.getElementById("article-content").getElementsByTagName("a")
        } else if(window.location.href.startsWith("https://message.bilibili.com/")) {
            var a_arr = document.getElementsByClassName("dynamic-link")
        }
        console.log(a_arr);

        if(type == 1) {
            var now_hour = new Date().getHours();
            var now_min = new Date().getMinutes();
            var now_time = (now_hour >= 10 ? now_hour : "0" + now_hour) + ":" + (now_min >= 10 ? now_min : "0" + now_min);
            // 是否到点
            if(document.getElementById("run_time").value != now_time) {
                return;
            } else {
                // 结束定时器喵
                clearInterval(interval_run);
            }
        }

        // 没有点赞过的链接
        var unliked_url = [];
        // 是否提前过滤已点赞链接
        var filter_like = true;

        // 是否在专栏页面
        if(window.location.href.startsWith("https://www.bilibili.com/read/cv")) {
            if(filter_like) {
                console.log("准备开始继续点赞过滤喵~大约需要0.5 * 选择数 秒，请耐心等待~")
                show_alert("准备开始继续点赞过滤喵~大约需要0.5 * 选择数 秒，请耐心等待~")

                async function get_unliked_url() {
                    for(let i = start_num; i < a_arr.length; i++) {
                        // 到达结束下标+1时，截断
                        if(i > end_num) break;
                        console.log(a_arr[i].href)
                        let alreadyLiked = await already_like(a_arr[i].href);
                        if(alreadyLiked == null) continue;
                        if (!alreadyLiked) {
                            unliked_url.push(a_arr[i].href);
                            // console.log("没有点赞 插入url=" + a_arr[i].href)
                        }
                        // 等待0.5秒
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                }
                
                get_unliked_url().then(function(result) {
                    console.log("没有点赞过的链接总数：" + unliked_url.length)

                    for(let i = 0; i < unliked_url.length; i++) {
                        setTimeout(function() {
                            console.log("i:" + i + " 跳转：" + new_dynamic_url_to_old(unliked_url[i]))
                            show_alert("i:" + i + " 跳转：" + new_dynamic_url_to_old(unliked_url[i]))
                            // window.open(new_dynamic_url_to_old(unliked_url[i]).getAttribute("href"))
                            // active:true，新标签页获取页面焦点
                            // setParent :true:新标签页面关闭后，焦点重新回到源页面
                            GM_openInTab(new_dynamic_url_to_old(unliked_url[i]), { active: false, setParent :true});
                        }, open_time * 1000 * i)
                    }
                });
            } else {
                for(let i = start_num; i < a_arr.length; i++) {
                    // 到达结束下标+1时，截断
                    if(i > end_num) break;
                    setTimeout(function() {
                        console.log("i:" + i + " 跳转：" + new_dynamic_url_to_old(a_arr[i].href))
                        show_alert("i:" + i + " 跳转：" + new_dynamic_url_to_old(a_arr[i].href))

                        GM_openInTab(new_dynamic_url_to_old(a_arr[i].href), { active: false, setParent :true});
                    }, open_time * 1000 * (i - start_num))
                }
            }
        }
        // 消息页面
        else if(window.location.href.startsWith("https://message.bilibili.com/")) {
            if(filter_like) {
                async function get_unliked_url() {
                    for(let i = (a_arr.length - 1); i >= 0; i--) {
                        // 索引范围外的 设为白色背景
                        if(i <= (a_arr.length - 1 - start_num) && i >= (a_arr.length - 1 - end_num)) {
                            console.log(a_arr[i].href)
                            let alreadyLiked = await already_like(a_arr[i].href);
                            if(alreadyLiked == null) continue;
                            if (!alreadyLiked) {
                                unliked_url.push(a_arr[i].href);
                                // console.log("没有点赞 插入url=" + a_arr[i].href)
                            }
                            // 等待1秒
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                        }
                    }
                }
                
                get_unliked_url().then(function(result) {
                    console.log("没有点赞过的链接总数：" + unliked_url.length)

                    for(let i = 0; i < unliked_url.length; i++) {
                        setTimeout(function() {
                            console.log("i:" + i + " 跳转：" + new_dynamic_url_to_old(unliked_url[i]))
                            show_alert("i:" + i + " 跳转：" + new_dynamic_url_to_old(unliked_url[i]))
                            // window.open(unliked_url[i].getAttribute("href"))
                            // active:true，新标签页获取页面焦点
                            // setParent :true:新标签页面关闭后，焦点重新回到源页面
                            GM_openInTab(new_dynamic_url_to_old(unliked_url[i]), { active: false, setParent :true});
                        }, open_time * 1000 * i)
                    }
                });
            } else {
                for(let i = (a_arr.length - 1); i >= 0; i--) {
                    // 索引范围外的 设为白色背景
                    if(i <= (a_arr.length - 1 - start_num) && i >= (a_arr.length - 1 - end_num)) {
                        setTimeout(function() {
                            console.log("i:" + i + " 跳转：" + new_dynamic_url_to_old(a_arr[i].href))
                            show_alert("i:" + i + " 跳转：" + new_dynamic_url_to_old(a_arr[i].href))
                            // window.open(a_arr[i].getAttribute("href"))
                            // active:true，新标签页获取页面焦点
                            // setParent :true:新标签页面关闭后，焦点重新回到源页面
                            GM_openInTab(new_dynamic_url_to_old(a_arr[i].href), { active: false, setParent :true});
                        }, open_time * 1000 * (a_arr.length - 1 - i))
                    }
                }
            }
        }
    }

    // 调接口获取动态
    function go2() {
        // 设置配置项
        set_config(0)

        console.log("开始进行调接口获取动态喵~");
        show_alert("开始进行调接口获取动态喵~");
        // 先运行一次
        get_dynamic_and_open("互动抽奖")
        // 默认每30分钟执行一次
        interval1 = setInterval(function(){get_dynamic_and_open("互动抽奖")}, interval_time * 60 * 1000)
    }

    // 调用话题接口 传入topic_name 并 打开页面
    function get_dynamic_and_open(topic_name) {
        // 构建url
        var url = "https://api.vc.bilibili.com/topic_svr/v1/topic_svr/fetch_dynamics?topic_name=" + topic_name
        // 建立所需的对象
        var httpRequest = new XMLHttpRequest();
        // 打开连接  将请求参数写在url中 
        httpRequest.open('GET', url, true);
        // 发送请求  将请求参数写在URL中
        httpRequest.send();
        httpRequest.onerror = function(error) { 
            console.log("请求话题接口出错！" + error);
            show_alert("请求话题接口出错！" + error);
        };
        httpRequest.ontimeout = function() { 
            console.log("请求话题接口超时！"); 
            show_alert("请求话题接口超时！");
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

                try {
                    if(json["code"] == 0) {
                        let data_len = json["data"]["cards"].length
                        // 临时存储动态
                        let temp_dynamic_id = []
                        let dynamic_id_len = api_dynamic_id_json["dynamic_id"].length
                        console.log("dynamic_id_len=" + dynamic_id_len)
                        // 遍历数据
                        for(let i = 0; i < data_len; i++) {
                            // 如果没有数据
                            if(dynamic_id_len == 0) {
                                if(json["data"]["cards"][i]["desc"]["orig_dy_id_str"] != "0") {
                                    temp_dynamic_id.push(json["data"]["cards"][i]["desc"]["orig_dy_id_str"])
                                } else {
                                    temp_dynamic_id.push(json["data"]["cards"][i]["desc"]["dynamic_id_str"])
                                }
                                continue
                            }

                            // 遍历已加载过的动态id
                            for(let j = 0; j < dynamic_id_len; j++) {
                                // 判断此dynamic_id是否已经打开过
                                if(json["data"]["cards"][i]["desc"]["dynamic_id_str"] == api_dynamic_id_json["dynamic_id"][j] || 
                                    json["data"]["cards"][i]["desc"]["orig_dy_id_str"] == api_dynamic_id_json["dynamic_id"][j]) {
                                    break;
                                }
                                
                                // 如果到最后都没有打开过，则表示没有加载过，记录数据
                                if(j == (dynamic_id_len - 1)) {
                                    if(json["data"]["cards"][i]["desc"]["orig_dy_id_str"] != "0") {
                                        temp_dynamic_id.push(json["data"]["cards"][i]["desc"]["orig_dy_id_str"])
                                    } else {
                                        temp_dynamic_id.push(json["data"]["cards"][i]["desc"]["dynamic_id_str"])
                                    }
                                }
                            }
                        }

                        console.log("新发布的未参与的互动抽奖数=" + temp_dynamic_id.length);
                        show_alert("新发布的未参与的互动抽奖数=" + temp_dynamic_id.length);
                        // 依次写入id并打开链接
                        for(let i = 0; i < temp_dynamic_id.length; i++) {
                            // 打开链接
                            setTimeout(function(){
                                api_dynamic_id_json["dynamic_id"][dynamic_id_len + i] = temp_dynamic_id[i]
                                var url = "https://t.bilibili.com/" + temp_dynamic_id[i]
                                console.log("i:" + i + " 跳转：" + url)
                                // window.open(url)
                                // active:true，新标签页获取页面焦点
                                // setParent :true:新标签页面关闭后，焦点重新回到源页面
                                GM_openInTab(url, { active: false, setParent :true});
                                // 存储数据
                                GM_setValue("api_dynamic_id_json", JSON.stringify(api_dynamic_id_json))
                            }, open_time * 1000 * i)
                        }
                    } else {
                        console.log("话题接口返回数据有误")
                        show_alert("话题接口返回数据有误")
                    }
                } catch(err) {
                    console.log("话题接口返回数据有误\n" + err)
                    show_alert("话题接口返回数据有误")
                }
            }
        };
    }

    // 获取cookie
    function getCookie(cookie_name) {
        var allcookies = document.cookie;
        //索引长度，开始索引的位置
        var cookie_pos = allcookies.indexOf(cookie_name);

        // 如果找到了索引，就代表cookie存在,否则不存在
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可
            //计算取cookie值得开始索引，加的1为“=”
            cookie_pos = cookie_pos + cookie_name.length + 1; 
            //计算取cookie值得结束索引
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            
            if (cookie_end == -1) {
                cookie_end = allcookies.length;

            }
            //得到想要的cookie的值
            var value = unescape(allcookies.substring(cookie_pos, cookie_end)); 
        }
        return value;
    }

    // 创建关注分组“抽奖关注”
    function create_follow_group(tag) {
        // 构建url
        var url = "https://api.bilibili.com/x/relation/tag/create?tag=" + tag + "&jsonp=jsonp&csrf=" + getCookie("bili_jct")
        // 建立所需的对象
        var httpRequest = new XMLHttpRequest();
        // 打开连接  将请求参数写在url中 
        httpRequest.open('POST', url, true);
        httpRequest.withCredentials = true;
        // 发送请求  将请求参数写在URL中
        httpRequest.send();
        httpRequest.onerror = function(error) { 
            console.log("请求创建关注分组接口出错！" + error); 
            show_alert("请求创建关注分组出错！" + error);
        };
        httpRequest.ontimeout = function() { 
            console.log("请求创建关注分组接口超时！"); 
            show_alert("请求创建关注分组接口超时！"); 
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

                try {
                    if(json["code"] == 0) {
                        // 获取下配置数据
                        var data_json = JSON.parse(GM_getValue("data_json"));
                        data_json["follow_tagid"] = json["data"]["tagid"];
                        // 存储数据
                        GM_setValue("data_json", JSON.stringify(data_json))

                        console.log("创建 " + tag + " 关注分组 成功")
                        show_alert("创建 " + tag + " 关注分组 成功")
                    } else if(json["code"] == 22106) {
                        console.log(tag + " 该分组已经存在")
                        show_alert(tag + " 该分组已经存在")
                    } else {
                        console.log("创建 " + tag + " 关注分组 失败")
                        show_alert("创建 " + tag + " 关注分组 失败")
                    }
                } catch {
                    console.log("创建 " + uid + " 关注分组 失败")
                    show_alert("创建 " + uid + " 关注分组 失败")
                }
            }
        };
    }
    
    // 是否在专栏页面
    if(window.location.href.startsWith("https://www.bilibili.com/read/cv")) {
        setTimeout(() => {
            // 删除无用内容
            function remove_useless() {
                document.getElementById("bili-header-container").remove()
                document.getElementsByClassName("article-breadcrumb")[0].remove()
                document.getElementById("readRecommendInfo").remove()
                document.getElementById("comment-wrapper").remove()
                document.getElementsByClassName("interaction-info")[0].remove()
                show_alert("删除无用内容完毕~")
            }
            
            // 在页面左侧插入一个配置使用框
            init_config_div()
        }, 1000); 
    } 
    // 动态页面
    if(window.location.href.startsWith("https://t.bilibili.com/") || window.location.href.startsWith("https://www.bilibili.com/opus/")) {
        var data_json = JSON.parse(GM_getValue("data_json"));
        // 通用追加延时
        var common_append_time = data_json["common_append_time"]
        var operation_interval = data_json["operation_interval"]

        // 删除无用内容
        function remove_useless() {
            document.getElementById("bili-header-container").remove()
            document.getElementsByClassName("bg")[0].remove()
            document.getElementsByClassName("bili-backtop")[0].remove()
            document.getElementsByClassName("bili-dyn-item__avatar")[0].remove()
            document.getElementsByClassName("bili-dyn-item__header")[0].remove()
            // document.getElementsByClassName("bili-dyn-item__body")[0].remove()
            show_alert("删除无用内容完毕~")
        }

        // 移动关注用户到“抽奖”分组
        function add_user_to_group(uid) {
            // 构建url
            var url = "https://api.bilibili.com/x/relation/tags/addUsers?cross_domain=true&fids=" + 
                uid + "&tagids=" + data_json["follow_tagid"] + "&csrf=" + getCookie("bili_jct")
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.withCredentials = true
            // 发送请求  将请求参数写在URL中
            httpRequest.send();
            httpRequest.onerror = function(error) { 
                console.log("请求 关注分组 接口出错！" + error); 
                show_alert("请求 关注分组 接口出错！" + error);
                all_success = false;
            };
            httpRequest.ontimeout = function() { 
                console.log("请求 关注分组 接口超时！"); 
                show_alert("请求 关注分组 接口超时！"); 
                all_success = false;
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

                    try {
                        if(json["code"] == 0) {
                            console.log("关注分组 " + uid + " 成功")
                            show_alert("关注分组 " + uid + " 成功")
                        } else {
                            console.log("关注分组 " + uid + " 失败")
                            show_alert("关注分组 " + uid + " 失败")
                            all_success = false;
                            return
                        }
                    } catch {
                        console.log("关注分组 " + uid + " 失败")
                        show_alert("关注分组 " + uid + " 失败")
                        all_success = false;
                        return
                    }
                }
            };
        }

        // 关注用户
        function follow(uid) {
            // 构建url
            var url = "https://api.bilibili.com/x/relation/modify?act=1&fid=" + uid + "&spmid=444.42&re_src=0&csrf=" + getCookie("bili_jct")
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.withCredentials = true
            // 发送请求  将请求参数写在URL中
            httpRequest.send();
            httpRequest.onerror = function(error) { 
                console.log("请求关注接口出错！" + error); 
                show_alert("请求关注接口出错！" + error);
                all_success = false;
            };
            httpRequest.ontimeout = function() { 
                console.log("请求关注接口超时！"); 
                show_alert("请求关注接口超时！"); 
                all_success = false;
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

                    try {
                        if(json["code"] == 0) {
                            console.log("关注 " + uid + " 成功")
                            show_alert("关注 " + uid + " 成功")

                            // 关注分组
                            add_user_to_group(uid)
                        } else {
                            console.log("关注 " + uid + " 失败")
                            show_alert("关注 " + uid + " 失败")
                            all_success = false;
                            return
                        }
                    } catch {
                        console.log("关注 " + uid + " 失败")
                        show_alert("关注 " + uid + " 失败")
                        all_success = false;
                        return
                    }
                }
            };
        }

        // 取关用户 动态页面 直接调用接口取关
        function unfollow(uid) {
            // 构建url
            var url = "https://api.bilibili.com/x/relation/modify?act=2&fid=" + uid + "&spmid=444.42&re_src=0&csrf=" + getCookie("bili_jct")
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.withCredentials = true
            // 发送请求  将请求参数写在URL中
            httpRequest.send();
            httpRequest.onerror = function(error) { 
                console.log("请求取关接口出错！" + error); 
                show_alert("请求取关接口出错！" + error);
                all_success = false;
                // 关闭页面
                setTimeout(function(){window.close();}, common_append_time + random_num(common_random_time))
            };
            httpRequest.ontimeout = function() { 
                console.log("请求取关接口超时！"); 
                show_alert("请求取关接口超时！"); 
                all_success = false;
                // 关闭页面
                setTimeout(function(){window.close();}, common_append_time + random_num(common_random_time))
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

                    try {
                        if(json["code"] == 0) {
                            console.log("取关 " + uid + " 成功")
                            show_alert("取关 " + uid + " 成功")
                        } else {
                            console.log("取关 " + uid + " 失败")
                            show_alert("取关 " + uid + " 失败")
                            all_success = false;
                        }
                        // 关闭页面
                        setTimeout(function(){window.close();}, common_append_time + random_num(common_random_time))
                    } catch {
                        console.log("取关 " + uid + " 失败")
                        show_alert("取关 " + uid + " 失败")
                        all_success = false;
                        // 关闭页面
                        setTimeout(function(){window.close();}, common_append_time + random_num(common_random_time))
                    }
                }
            };
        }

        // 发送评论，传入页面id或oid 和 类型（17或11） 和 评论内容
        function send_comment(oid, type, comment_content) {
            // 构建url
            var url = "https://api.bilibili.com/x/v2/reply/add"
            var data = "oid=" + oid + "&type=" + type + "&message=" + 
                comment_content + "&plat=1&ordering=heat&jsonp=jsonp&csrf=" + getCookie("bili_jct")
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            httpRequest.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8") //指定发送的编码
            httpRequest.setRequestHeader("accept", "application/json, text/javascript, */*; q=0.01")
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.withCredentials = true
            // 发送请求  将请求参数写在URL中
            httpRequest.send(data);
            httpRequest.onerror = function(error) { 
                console.log("请求发送评论接口出错！type=" + type.toString() + error); 
                show_alert("请求发送评论接口出错！type=" + type.toString() + error);
                all_success = false; 
            };
            httpRequest.ontimeout = function() { 
                console.log("请求发送评论接口超时！type=" + type.toString()); 
                show_alert("请求发送评论接口超时！type=" + type.toString()); 
                all_success = false;
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

                    try {
                        if(json["code"] == 0) {
                            console.log("type=" + type.toString() + " 发送评论：" + json["data"]["success_toast"])
                            show_alert("type=" + type.toString() + " 发送评论：" + json["data"]["success_toast"])
                        } else {
                            console.log("type=" + type.toString() + " 发送评论失败，code!=0")
                            show_alert("type=" + type.toString() + " 发送评论失败，code!=0")
                            all_success = false;
                            return
                        }
                    } catch {
                        console.log("type=" + type.toString() + " 发送评论失败，解析json失败")
                        show_alert("type=" + type.toString() + " 发送评论失败，解析json失败")
                        all_success = false;
                        return
                    }
                }
            };
        }

        // 发送dny 传入转发的评论内容
        function dny(forward_comment_content) {
            // 构建url
            var url = "https://api.bilibili.com/x/dynamic/feed/create/dyn?csrf=" + getCookie("bili_jct")
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader("Content-Type", "application/json, text/plain, */*");
            httpRequest.withCredentials = true;

            var data_json = {
                "dyn_req":{
                    "content":{
                        "contents":[
                            {
                                "raw_text":forward_comment_content,
                                "type":1,
                                "biz_id":""
                            }
                        ]
                    },
                    "scene":4,
                    "upload_id": getCookie("DedeUserID") + get_now_date(),
                    "meta":{
                        "app_meta":{
                            "from":"create.dynamic.web",
                            "mobi_app":"web"
                        }
                    }
                },
                "web_repost_src":{
                    "dyn_id_str":page_id
                }
            };
            // 发送请求  将请求参数写在URL中
            httpRequest.send(JSON.stringify(data_json));
            httpRequest.onerror = function(error) { 
                console.log("请求dny接口出错！" + error); 
                show_alert("请求dny接口出错！" + error);
                all_success = false;
                return; 
            };
            httpRequest.ontimeout = function() { 
                console.log("请求dny接口超时！"); 
                show_alert("请求dny接口超时！");
                all_success = false;
                return;  
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

                    try {
                        if(json["code"] == 0) {
                            console.log("dny成功")
                            show_alert("dny成功")
                            // 关闭页面
                            setTimeout(function(){window.close();}, operation_interval*0 + common_append_time + random_num(common_random_time))
                        } else {
                            console.log("dny失败，code!=0")
                            show_alert("dny失败，code!=0")
                            all_success = false;
                            return
                        }
                    } catch {
                        console.log("dny失败，解析json失败")
                        show_alert("dny失败，解析json失败")
                        all_success = false;
                        return
                    }
                }
            };
        }

        // 转发 传入转发的评论内容
        function forward(forward_comment_content) {
            // 转发框 原数据
            var ori_content = document.getElementsByClassName("bili-rich-textarea__inner")[0].innerText
            if(ori_content.length > 2) forward_comment_content += ori_content.slice(0, ori_content.length-1)

            // 构建url
            var url = "https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost"
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader("accept", "application/json, text/plain, */*");
            httpRequest.setRequestHeader("content-type", "application/json;charset=UTF-8");
            httpRequest.withCredentials = true;

            var data = '{"uid":' + getCookie("DedeUserID")+',"dynamic_id":' + page_id +',"content":"' + forward_comment_content + '","ctrl": "[]","csrf":"' + getCookie("bili_jct") + '"}';
            // console.log(data)
            
            // 发送请求  将请求参数写在URL中
            httpRequest.send(data);
            httpRequest.onerror = function(error) { 
                console.log("请求转发接口出错！" + error); 
                show_alert("请求转发接口出错！" + error);
                all_success = false;
                return; 
            };
            httpRequest.ontimeout = function() { 
                console.log("请求转发接口超时！"); 
                show_alert("请求转发接口超时！");
                all_success = false;
                return;  
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

                    try {
                        switch (json["code"]) {
                            case 0:
                                console.log('转发动态 成功转发一条动态');
                                show_alert('转发动态 成功转发一条动态');
                                return
                            case 1101004:
                                console.log('转发动态 该动态不能转发分享');
                                show_alert('转发动态 该动态不能转发分享');
                                all_success = false;
                                return
                            case 2201116:
                                console.log('转发动态 请求数据发生错误，请刷新或稍后重试');
                                show_alert('转发动态 请求数据发生错误，请刷新或稍后重试');
                                all_success = false;
                                return
                            case 1101008:
                                console.log('转发动态 操作太频繁了，请稍后重试');
                                show_alert('转发动态 操作太频繁了，请稍后重试');
                                all_success = false;
                                return
                            default:
                                console.log('转发动态 未知错误');
                                show_alert('转发动态 未知错误');
                                all_success = false;
                                return
                        }
                    } catch {
                        console.log("转发动态 失败，解析json失败")
                        show_alert("转发动态 失败，解析json失败")
                        all_success = false;
                        return
                    }
                }
            };
        }

        // 转发 传入转发的评论内容 暂不可用
        function forward2(forward_comment_content) {
            // 构建url
            var url = "https://api.bilibili.com/x/dynamic/feed/create/submit_check?csrf=" + getCookie("bili_jct")
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader("Content-Type", "application/json, text/plain, */*");
            httpRequest.withCredentials = true;

            var data_json = {"content":{"contents":[{"raw_text":forward_comment_content,"type":1,"biz_id":""}]}};
            
            // 发送请求  将请求参数写在URL中
            httpRequest.send(JSON.stringify(data_json));
            httpRequest.onerror = function(error) { 
                console.log("请求转发接口出错！" + error); 
                show_alert("请求转发接口出错！" + error);
                all_success = false;
                return; 
            };
            httpRequest.ontimeout = function() { 
                console.log("请求转发接口超时！"); 
                show_alert("请求转发接口超时！");
                all_success = false;
                return;  
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

                    try {
                        if(json["code"] == 0) {
                            console.log("转发动态成功")
                            show_alert("转发动态成功")
                            // 请求dny
                            dny(forward_comment_content)
                        } else {
                            console.log("转发动态失败，code!=0")
                            show_alert("转发动态失败，code!=0")
                            all_success = false;
                            return
                        }
                    } catch {
                        console.log("转发动态失败，解析json失败")
                        show_alert("转发动态失败，解析json失败")
                        all_success = false;
                        return
                    }
                }
            };
        }

        // 获取用户信息进行关注或取关
        function get_user_info_and_follow() {
            // 构建url
            var url = "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?timezone_offset=-480&id=" + page_id
            // 建立所需的对象
            var httpRequest = new XMLHttpRequest();
            // 打开连接  将请求参数写在url中 
            httpRequest.open('GET', url, true);
            httpRequest.withCredentials = true
            // 发送请求  将请求参数写在URL中
            httpRequest.send();
            httpRequest.onerror = function(error) { 
                console.log("请求页面详情接口出错！" + error); 
                show_alert("请求页面详情接口出错！" + error); 
                all_success = false;
                return
            };
            httpRequest.ontimeout = function() { 
                console.log("请求页面详情超时！"); 
                show_alert("请求页面详情超时！"); 
                all_success = false;
                return
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

                    try {
                        if(json["code"] == 0) {
                            console.log("获取详情 " + page_id + " 成功")
                            show_alert("获取详情 " + page_id + " 成功")
                            var mid = json["data"]["item"]["modules"]["module_author"]["mid"]
                            console.log("mid=" + mid)
                            show_alert("mid=" + mid)

                            // 判断是否为取关模式
                            if(data_json["unfollow_checkbox"] == true) unfollow(mid)
                            else follow(mid)
                        } else {
                            console.log("获取详情 " + page_id + " 失败")
                            show_alert("获取详情 " + page_id + " 失败")
                            all_success = false;
                            return
                        }
                    } catch {
                        console.log("获取详情 " + page_id + " 失败")
                        show_alert("获取详情 " + page_id + " 失败")
                        all_success = false;
                        return
                    }
                }
            }
        }

        // 旧动态
        if(window.location.href.startsWith("https://t.bilibili.com/")) {
            var page_id = window.location.href.split('t.bilibili.com/')[1].split('?')[0]
            console.log("page_id=" + page_id)
            show_alert("page_id=" + page_id)

            setTimeout(function() {
                // 下滑加载数据
                window.scroll(0, 1920*100);
                // 删除无用内容
                remove_useless()

                // 先判断是否点过赞，点过赞就是转发过了，直接return
                if(document.getElementsByClassName("bili-dyn-action like active")[0]) {
                    console.log("已点赞，即将关闭")
                    show_alert("已点赞，即将关闭")
                    // 关闭页面
                    setTimeout(function(){window.close();}, random_num(common_random_time))
                    return
                } else { 
                    console.log("未点赞")
                    show_alert("未点赞")
                    // 点赞
                    setTimeout(function(){
                        try {
                            document.getElementsByClassName("bili-dyn-action like")[0].click()
                            setTimeout(function(){
                                // 判断点赞是否成功
                                if(document.getElementsByClassName("bili-dyn-action like active")[0]) {
                                    console.log("点赞成功")
                                    show_alert("点赞成功")
                                } else {
                                    console.log("点赞失败")
                                    show_alert("点赞失败")
                                    all_success = false;
                                    return
                                }
                            }, operation_interval + random_num(common_random_time))
                        } catch {
                            // 点赞失败多半是页面没有加载成功，尝试刷新页面重载
                            location.reload();
                        }
                    }, random_num(common_random_time))
                }
            }, operation_interval*1 + common_append_time + random_num(common_random_time)) 

            setTimeout(function() {
                // 下滑加载数据
                window.scroll(0, 1920*100);
            }, operation_interval*2 + common_append_time + random_num(common_random_time)) 

            setTimeout(function() {
                window.scroll(0, 1);

                // 判断是否是预约动态 没预约
                if(document.getElementsByClassName("uncheck")[0]) {
                    // 是否开启了预约抽奖
                    if(data_json["order_checkbox"] == true) {
                        console.log("预约动态 没预约，预约后关闭页面")
                        show_alert("预约动态 没预约，预约后关闭页面")
                        setTimeout(function(){document.getElementsByClassName("uncheck")[0].click();}, random_num(common_random_time))
                        get_user_info_and_follow();
                    } else {
                        console.log("预约动态 预约模式未开启，即将关闭页面")
                        show_alert("预约动态 预约模式未开启，即将关闭页面")
                    }
                    // 关闭页面
                    setTimeout(function(){window.close();}, operation_interval + random_num(common_random_time))
                    return
                } else if(document.getElementsByClassName("check")[0]) {
                    console.log("预约动态 预约了，即将关闭页面")
                    show_alert("预约动态 预约了，即将关闭页面")
                    // 关闭页面
                    setTimeout(function(){window.close();}, operation_interval + random_num(common_random_time))
                } else {
                    console.log("非预约动态")
                    show_alert("非预约动态")
                    get_user_info_and_follow();
                }
            }, operation_interval*3 + common_append_time + random_num(common_random_time))

            // 评论配置不为空 则会进行评论
            var comment_content = data_json["comment_content"]
            console.log("comment_content=" + comment_content)
            show_alert("评论内容=" + comment_content)
            if(comment_content != "") {
                // 是否使用api方式
                if(data_json["use_api_checkbox"] == true) {
                    // 调接口发送评论
                    setTimeout(function(){
                        try {
                            var oid = JSON.parse(document.getElementsByClassName("list-item reply-wrap")[0].getAttribute("mr-show"))["msg"]["oid"]
                            // 此处的接口存在变动，2个都进行尝试
                            send_comment(oid, 11, comment_content)
                            setTimeout(function(){
                                send_comment(page_id, 17, comment_content)
                            }, operation_interval + random_num(common_random_time))
                        } catch {
                            // 获取oid失败
                            console.log("获取oid失败，切换为模拟手动模式")
                            show_alert("获取oid失败，切换为模拟手动模式")
                            // 修改评论框
                            setTimeout(function(){
                                document.getElementsByClassName("ipt-txt")[0].innerText = comment_content
                                // 校验修改是否成功，此处只有首次修改才能生效（巨坑）
                                setTimeout(function(){
                                    if(document.getElementsByClassName("ipt-txt")[0].innerHTML != comment_content) {
                                        console.log("修改评论框失败")
                                        show_alert("修改评论框失败")
                                        all_success = false;
                                        return
                                    }
                                }, operation_interval + random_num(common_random_time))
                            }, random_num(common_random_time))
                            // 点击评论按钮
                            setTimeout(function(){
                                document.getElementsByClassName("comment-submit")[0].click()
                            }, operation_interval*2 + random_num(common_random_time))
                        }
                    }, operation_interval*5 + common_append_time + random_num(common_random_time))
                } else {
                    // 修改评论框
                    setTimeout(function(){
                        document.getElementsByClassName("ipt-txt")[0].innerText = comment_content
                        // 校验修改是否成功，此处只有首次修改才能生效（巨坑）
                        setTimeout(function(){
                            if(document.getElementsByClassName("ipt-txt")[0].innerHTML != comment_content) {
                                console.log("修改评论框失败")
                                show_alert("修改评论框失败")
                                all_success = false;
                                return
                            }
                        }, operation_interval + random_num(common_random_time))
                    }, operation_interval*5 + common_append_time + random_num(common_random_time))
                    // 点击评论按钮
                    setTimeout(function(){
                        document.getElementsByClassName("comment-submit")[0].click()
                    }, operation_interval*7 + common_append_time + random_num(common_random_time))
                } 
            }
            // 点击转发页面
            setTimeout(function(){document.getElementsByClassName("bili-dyn-action forward")[0].click()}, operation_interval*8 + common_append_time + random_num(common_random_time))
            // 转发评论配置不为空 则会进行转发评论
            var forward_comment_content = data_json["forward_comment_content"]
            console.log("forward_comment_content=" + forward_comment_content)
            show_alert("转发评论内容=" + forward_comment_content)
            // 是否使用api方式
            if(data_json["use_api_checkbox"] == true) {
                setTimeout(function(){
                    if(forward_comment_content != "") {
                        forward(forward_comment_content)
                    } else {
                        forward("转发动态")
                    }
                }, operation_interval*9 + common_append_time + random_num(common_random_time))
            } else {
                if(forward_comment_content != "") {
                    // 修改转发评论框
                    setTimeout(function(){
                        // 转发评论框是空的
                        if(document.getElementsByClassName("bili-rich-textarea__inner empty")[0]) {
                            var inpEle = document.getElementsByClassName("bili-rich-textarea__inner")[0];
                            var st = forward_comment_content
                            var evt = new InputEvent('input', {
                                inputType: 'insertText',
                                data: st,
                                dataTransfer: null,
                                isComposing: false
                            });
                            inpEle.value = st;
                            inpEle.dispatchEvent(evt);

                            setTimeout(function(){
                                // 检查转发评论内容是否成功输入
                                if(document.getElementsByClassName("bili-rich-textarea__inner empty")[0]) {
                                    console.log("修改转发评论框失败")
                                    show_alert("修改转发评论框失败")
                                    all_success = false;
                                    return
                                }
                            }, operation_interval + random_num(common_random_time))
                        } else {
                            // 点击表情包
                            document.getElementsByClassName("bili-dyn-forward-publishing__emoji")[0].click()
                            setTimeout(function(){
                                // 发送一个随机表情
                                document.getElementsByClassName("bili-emoji__list__item bili-emoji__list__item small")[random_num(23)].click()
                            }, operation_interval + random_num(common_random_time))
                            
                            setTimeout(function(){
                                // 检查表情包是否发送成功
                                if(document.getElementsByClassName("bili-rich-textarea__inner")[0].innerHTML.indexOf("<img") != 1) {
                                    console.log("发送一个随机表情失败")
                                    show_alert("发送一个随机表情失败")
                                    all_success = false;
                                    return
                                }
                            }, operation_interval*2 + random_num(common_random_time))
                        }
                    }, operation_interval*9 + common_append_time + random_num(common_random_time))
                    // 点击转发
                    setTimeout(function(){document.getElementsByClassName("bili-dyn-forward-publishing__action__btn")[0].click()}, operation_interval*12 + common_append_time + random_num(common_random_time))
                }
            }

            // 关闭页面
            setTimeout(function(){window.close();}, operation_interval*13 + common_append_time + random_num(common_random_time))
        
        }
        // 新动态页面 
        else if(window.location.href.startsWith("https://www.bilibili.com/opus/")) {
            // 删除无用内容
            function remove_useless() {
                document.getElementById("bili-header-container").remove()
                document.getElementsByClassName("bg")[0].remove()
                // document.getElementsByClassName("bili-dyn-item__body")[0].remove()
                show_alert("删除无用内容完毕~")
            }

            var page_id = window.location.href.split('www.bilibili.com/opus/')[1].split('?')[0]
            console.log("page_id=" + page_id)
            show_alert("page_id=" + page_id)
            
            setTimeout(function() {
                // 下滑加载数据
                window.scroll(0, 1920*100);
                // 删除无用内容
                remove_useless()

                // 先判断是否点过赞，点过赞就是转发过了，直接return
                if(document.getElementsByClassName("side-toolbar__action like is-active")[0]) {
                    console.log("已点赞，即将关闭")
                    show_alert("已点赞，即将关闭")
                    // 关闭页面
                    setTimeout(function(){window.close();}, random_num(common_random_time))
                    return
                } else { 
                    console.log("未点赞")
                    show_alert("未点赞")
                    // 点赞
                    setTimeout(function(){
                        try {
                            document.getElementsByClassName("side-toolbar__action like")[0].click()
                            setTimeout(function(){
                                // 判断点赞是否成功
                                if(document.getElementsByClassName("side-toolbar__action like is-active")[0]) {
                                    console.log("点赞成功")
                                    show_alert("点赞成功")
                                } else {
                                    console.log("点赞失败")
                                    show_alert("点赞失败")
                                    all_success = false;
                                    return
                                }
                            }, operation_interval + random_num(common_random_time))
                        } catch {
                            // 点赞失败多半是页面没有加载成功，尝试刷新页面重载
                            location.reload();
                        }
                    }, random_num(common_random_time))
                }
            }, operation_interval*1 + common_append_time + random_num(common_random_time)) 

            setTimeout(function() {
                // 下滑加载数据
                window.scroll(0, 1920*100);
            }, operation_interval*2 + common_append_time + random_num(common_random_time)) 

            setTimeout(function() {
                window.scroll(0, 1);

                // 判断是否是预约动态 没预约
                if(document.getElementsByClassName("uncheck")[0]) {
                    // 是否开启了预约抽奖
                    if(data_json["order_checkbox"] == true) {
                        console.log("预约动态 没预约，预约后关闭页面")
                        show_alert("预约动态 没预约，预约后关闭页面")
                        setTimeout(function(){document.getElementsByClassName("uncheck")[0].click();}, random_num(common_random_time))
                        get_user_info_and_follow();
                    } else {
                        console.log("预约动态 预约模式未开启，即将关闭页面")
                        show_alert("预约动态 预约模式未开启，即将关闭页面")
                    }
                    // 关闭页面
                    setTimeout(function(){window.close();}, operation_interval + random_num(common_random_time))
                    return
                } else if(document.getElementsByClassName("check")[0]) {
                    console.log("预约动态 预约了，即将关闭页面")
                    show_alert("预约动态 预约了，即将关闭页面")
                    // 关闭页面
                    setTimeout(function(){window.close();}, operation_interval + random_num(common_random_time))
                } else {
                    console.log("非预约动态")
                    show_alert("非预约动态")
                    get_user_info_and_follow();
                }
            }, operation_interval*3 + common_append_time + random_num(common_random_time))

            // 评论配置不为空 则会进行评论
            var comment_content = data_json["comment_content"]
            console.log("comment_content=" + comment_content)
            show_alert("评论内容=" + comment_content)
            if(comment_content != "") {
                // 是否使用api方式
                if(data_json["use_api_checkbox"] == true) {
                    // 调接口发送评论（用不了）
                    setTimeout(function(){
                        try {
                            var oid = JSON.parse(document.getElementsByClassName("list-item reply-wrap")[0].getAttribute("mr-show"))["msg"]["oid"]
                            // 此处的接口存在变动，2个都进行尝试
                            send_comment(oid, 11, comment_content)
                            setTimeout(function(){
                                send_comment(page_id, 17, comment_content)
                            }, operation_interval + random_num(common_random_time))
                        } catch {
                            // 获取oid失败
                            console.log("获取oid失败，切换为模拟手动模式")
                            show_alert("获取oid失败，切换为模拟手动模式")
                            // 修改评论框
                            setTimeout(function(){
                                document.getElementsByClassName("reply-box-textarea")[0].value = comment_content
                                // 校验修改是否成功，此处只有首次修改才能生效（巨坑）
                                setTimeout(function(){
                                    if(document.getElementsByClassName("reply-box-textarea")[0].innerHTML != comment_content) {
                                        console.log("修改评论框失败")
                                        show_alert("修改评论框失败")
                                        all_success = false;
                                        return
                                    }
                                }, operation_interval + random_num(common_random_time))
                            }, random_num(common_random_time))
                            // 点击评论按钮
                            setTimeout(function(){
                                document.getElementsByClassName("comment-submit")[0].click()
                            }, operation_interval*2 + random_num(common_random_time))
                        }
                    }, operation_interval*5 + common_append_time + random_num(common_random_time))
                } else {
                    // 修改评论框
                    setTimeout(function(){
                        document.getElementsByClassName("reply-box-textarea")[0].focus()

                        var inpEle = document.getElementsByClassName("reply-box-textarea")[0];
                        var st = comment_content
                        var evt = new InputEvent('input', {
                            inputType: 'insertText',
                            data: st,
                            dataTransfer: null,
                            isComposing: false
                        });
                        inpEle.value = st;
                        inpEle.dispatchEvent(evt);

                        setTimeout(function(){
                            if(document.getElementsByClassName("reply-box-textarea")[0].value != comment_content) {
                                console.log("修改评论框失败")
                                show_alert("修改评论框失败")
                                all_success = false;
                                return
                            }
                        }, operation_interval + random_num(common_random_time))
                    }, operation_interval*5 + common_append_time + random_num(common_random_time))
                    // 点击评论按钮
                    setTimeout(function(){
                        document.getElementsByClassName("reply-box-send")[0].click()
                    }, operation_interval*7 + common_append_time + random_num(common_random_time))
                } 
            }
            // 点击转发按钮
            setTimeout(function(){document.getElementsByClassName("side-toolbar__action forward")[0].click()}, operation_interval*8 + common_append_time + random_num(common_random_time))
            // 转发评论配置不为空 则会进行转发评论
            var forward_comment_content = data_json["forward_comment_content"]
            console.log("forward_comment_content=" + forward_comment_content)
            show_alert("转发评论内容=" + forward_comment_content)
            // 是否使用api方式
            if(data_json["use_api_checkbox"] == true) {
                setTimeout(function(){
                    if(forward_comment_content != "") {
                        forward(forward_comment_content)
                    } else {
                        forward("转发动态")
                    }
                }, operation_interval*9 + common_append_time + random_num(common_random_time))
            } else {
                if(forward_comment_content != "") {
                    // 修改转发评论框
                    setTimeout(function(){
                        // 转发评论框是空的
                        if(document.getElementsByClassName("bili-rich-textarea__inner")[0].innerText.length == 2) {
                            var inpEle = document.getElementsByClassName("bili-rich-textarea__inner")[0];
                            var st = forward_comment_content
                            var evt = new InputEvent('input', {
                                inputType: 'insertText',
                                data: st,
                                dataTransfer: null,
                                isComposing: false
                            });
                            inpEle.value = st;
                            inpEle.dispatchEvent(evt);

                            setTimeout(function(){
                                // 检查转发评论内容是否成功输入
                                if(document.getElementsByClassName("bili-rich-textarea__inner")[0].innerText.length == 2) {
                                    console.log("修改转发评论框失败")
                                    show_alert("修改转发评论框失败")
                                    all_success = false;
                                    return
                                }
                            }, operation_interval + random_num(common_random_time))
                        } else {
                            // 点击表情包
                            document.getElementsByClassName("bili-dyn-share-publishing__tools__item emoji")[0].click()
                            setTimeout(function(){
                                // 发送一个随机表情
                                document.getElementsByClassName("bili-emoji__list__item bili-emoji__list__item small")[random_num(23)].click()
                            }, operation_interval + random_num(common_random_time))
                            
                            setTimeout(function(){
                                // 检查表情包是否发送成功
                                if(document.getElementsByClassName("bili-rich-textarea__inner")[0].innerHTML.indexOf("<img") != 1) {
                                    console.log("发送一个随机表情失败")
                                    show_alert("发送一个随机表情失败")
                                    all_success = false;
                                    return
                                }
                            }, operation_interval*2 + random_num(common_random_time))
                        }
                    }, operation_interval*9 + common_append_time + random_num(common_random_time))
                    // 点击转发
                    setTimeout(function(){document.getElementsByClassName("bili-dyn-share-publishing__action")[0].click()}, operation_interval*12 + common_append_time + random_num(common_random_time))
                }
            }

            // 关闭页面
            setTimeout(function(){window.close();}, operation_interval*13 + common_append_time + random_num(common_random_time))
        
        }

    } 
    
    // 关注页面
    if(window.location.href.startsWith("https://space.bilibili.com")) {
        if(window.location.href.indexOf("/fans/follow") != -1) {
            // 在页面左侧插入一个配置使用框
            init_config_div()
        }
    } 
    // 是否在消息页面
    if(window.location.href.startsWith("https://message.bilibili.com/")) {
        // 删除无用内容
        function remove_useless() {
            // show_alert("删除无用内容完毕~")
        }
        
        // 在页面左侧插入一个配置使用框
        init_config_div()
    }

    setTimeout(function(){
        console.log(window.location.href)
        // 404页面
        if(window.location.href == "https://www.bilibili.com/404") {
            console.log("404页面，关了关了")
            show_alert("404页面，关了关了")
            // 关闭页面
            setTimeout(function(){
                window.location.replace('about:blank');
                // 关闭页面
                window.close();
            }, random_num(1000))
        }

        console.log(document.getElementsByTagName("body")[0])
        if(document.getElementsByClassName("im-root").length != 0) {
            console.log("可能位于404页面，即将关闭")
            window.location.replace('about:blank');
            window.opener = null;
            window.open('', '_self');
            // 关闭页面
            window.close();
        }
    }, 3000)

    // 随机一个0-x的整数
    function random_num(x) {
        return Math.round(Math.random() * x)
    }
})();