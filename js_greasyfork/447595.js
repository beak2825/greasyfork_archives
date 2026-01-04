// ==UserScript==
// @name         b站直播分区页面 自动检索红包/天选直播间并跳转 脚本
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  配合 b站直播自动抽红包脚本使用。来到直播分区页面，如：https://live.bilibili.com/p/eden/area-tags?parentAreaId=9&areaId=0 按“F1”或“F2”开始运行，按“F9”删除页面的直播封面（低调摸鱼）
// @author       Ikaros
// @match        https://live.bilibili.com/p/eden/area-tags*
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         http://bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/scripts/447595
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447595/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%88%86%E5%8C%BA%E9%A1%B5%E9%9D%A2%20%E8%87%AA%E5%8A%A8%E6%A3%80%E7%B4%A2%E7%BA%A2%E5%8C%85%E5%A4%A9%E9%80%89%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B9%B6%E8%B7%B3%E8%BD%AC%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447595/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%88%86%E5%8C%BA%E9%A1%B5%E9%9D%A2%20%E8%87%AA%E5%8A%A8%E6%A3%80%E7%B4%A2%E7%BA%A2%E5%8C%85%E5%A4%A9%E9%80%89%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B9%B6%E8%B7%B3%E8%BD%AC%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*
使用说明:
    配合 b站直播自动抽红包脚本使用。
    来到直播分区页面，如：https://live.bilibili.com/p/eden/area-tags?parentAreaId=9&areaId=0
    点击筛选按钮运行 或 按“F1”或“F2”开始运行
*/

window.addEventListener('load', function () {
    // 配置数据
    let red_packet_data_json = null;
    // 分区id
    let area_id = 9;
    // 打开页面时间间隔
    let open_time = 5000;
    // 最大打开直播间数量
    let max_num = 5;
    // 请求传入页面的参数
    let page = 1;
    let key_flag = 0;
    // roomid数组
    let roomid_list = [];
    // 弹窗定时器
    let interval_alert_div = null;
    // 打开页面类型 0红包+天选 1红包 2天选
    let page_type = 1;
    // 自动循环运行定时器
    let loop_run_interval = null;
    // 自动循环时间间隔 毫秒,默认15分钟
    let loop_run_time = 15;
    // 循环判断直播间有无红包时间间隔 默认3分钟
    let auto_close_interval = 3;
    // 是否启用无红包自动关闭直播间功能 false是禁用 true是启用
    let auto_close = false;
    // 是否启用自动删除无用内容 false是禁用 true是启用
    let auto_remove = false;
    
    // 生成弹窗div
    function init_alert_div() {
        var body = document.getElementsByTagName("body")[0];
        var alert_div = document.createElement("div");
        var alert_content_span = document.createElement("span");

        alert_div.id = "alert_div";
        alert_div.style.zIndex = "66666";
        alert_div.style.top = "1%";
        alert_div.style.left = "30%";
        alert_div.style.width = "500px";
        alert_div.style.height = "50px";
        alert_div.style.padding = "5px";
        alert_div.style.position = "fixed"
        alert_div.style.background = "#4a4a4aaa";
        alert_div.style.display = "none";
        alert_content_span.id = "alert_content_span";
        alert_content_span.style.width = "280px";
        alert_content_span.style.fontSize = "16px";
        alert_content_span.style.color = "white";
        // alert_content_span.style.backgroundColor = "#4a4a4aaa";
        alert_content_span.innerText = "";

        alert_div.appendChild(alert_content_span);
        body.appendChild(alert_div);
    }

    init_alert_div();

    // 显示弹出框 传入显示的内容content
    function show_alert(content, auto_hide = true) {
        // 清除旧的定时
        clearTimeout(interval_alert_div);

        var alert_div = document.getElementById("alert_div");
        var alert_content_span = document.getElementById("alert_content_span");
        alert_content_span.innerText = content;
        alert_div.style.display = "block";

        // console.log(auto_hide);
        if (auto_hide) {
            // console.log("自动隐藏")
            // 5s后自动隐藏弹窗div
            interval_alert_div = setTimeout(() => {
                alert_div.style.display = "none";
            }, 5000);
        }
    }

    // 获取配置
    function get_config() {
        console.log("获取本地配置")
        show_alert("获取本地配置")

        // 尝试获取
        try {
            red_packet_data_json = JSON.parse(GM_getValue("red_packet_data_json"));
            area_id = red_packet_data_json["area_id"] == null ? 9 : red_packet_data_json["area_id"]
            open_time = red_packet_data_json["open_time"] == null ? 3000 : red_packet_data_json["open_time"]
            max_num = red_packet_data_json["max_num"] == null ? 5 : red_packet_data_json["max_num"]
            loop_run_time = red_packet_data_json["loop_run_time"] == null ? 15 : red_packet_data_json["loop_run_time"]
            auto_close_interval = red_packet_data_json["auto_close_interval"] == null ? 3 : red_packet_data_json["auto_close_interval"]
            auto_close = red_packet_data_json["auto_close"] == null ? false : red_packet_data_json["auto_close"]
            auto_remove = red_packet_data_json["auto_remove"] == null ? false : red_packet_data_json["auto_remove"]
            

            console.log("当前配置：分区ID=" + area_id + " 打开页面间隔=" + open_time + " 最大页面数=" + max_num + 
                "\n红包/天选存在检测间隔=" + auto_close_interval + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
            show_alert("当前配置：分区ID=" + area_id + " 打开页面间隔=" + open_time + " 最大页面数=" + max_num +
                "\n红包/天选存在检测间隔=" + auto_close_interval + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
        } catch {
            red_packet_data_json = {
                "area_id": area_id, 
                "open_time": open_time, 
                "max_num": max_num,
                "loop_run_time": loop_run_time,
                "auto_close_interval": auto_close_interval,
                "auto_close": false,
                "auto_remove": false
            }
            GM_setValue("red_packet_data_json", JSON.stringify(red_packet_data_json))
            console.log("本地无配置，已初始化")
            show_alert("本地无配置，已初始化")
        }
    }

    get_config();

    // 位于直播分区页面
    if(window.location.href.startsWith("https://live.bilibili.com/p/eden/area-tags")) {
        // 在页面左侧插入一个配置使用框
        function init_config_div() {
            // 在页面左侧插入一个用户筛选框
            var body = document.getElementsByTagName("body")[0];
            var br1 = document.createElement("br");
            var br2 = document.createElement("br");
            var br3 = document.createElement("br");
            var br4 = document.createElement("br");
            var br5 = document.createElement("br");
            var br6 = document.createElement("br");
            var br7 = document.createElement("br");
            var br8 = document.createElement("br");
            var div = document.createElement("div");
            var show_hide_div = document.createElement("div");
            var search_div = document.createElement("div");
            var area_id_span = document.createElement("span");
            var area_id_input = document.createElement("input");
            var open_time_span = document.createElement("span");
            var open_time_input = document.createElement("input");
            var max_num_span = document.createElement("span");
            var max_num_input = document.createElement("input");
            var loop_run_time_span = document.createElement("span");
            var loop_run_time_input = document.createElement("input");
            var auto_close_interval_span = document.createElement("span");
            var auto_close_interval_input = document.createElement("input");
            var auto_close_checkbox = document.createElement("input");
            var auto_close_label = document.createElement("label");
            var auto_remove_checkbox = document.createElement("input");
            var auto_remove_label = document.createElement("label");
            var save_config_btn = document.createElement("button");
            var search = document.createElement("button");
            var search1 = document.createElement("button");
            var search2 = document.createElement("button");
            var loop_btn = document.createElement("button");
            var describe_span = document.createElement("span");

            div.style.position = "fixed";
            div.style.top = "10%";
            div.style.width = "300px";
            div.style.left = "10px";
            div.style.zIndex = "6666";
            div.style.background = "#4a4a4abb";
            show_hide_div.style.width = "180px";
            show_hide_div.style.fontSize = "18px";
            show_hide_div.style.background = "#ef8400";
            show_hide_div.style.textAlign = "center";
            show_hide_div.style.padding = "5px";
            show_hide_div.style.cursor = "pointer";
            show_hide_div.innerText = "红包/天选检索☚";
            show_hide_div.onclick = function () { show_hide(); };
            search_div.setAttribute("id", "search_div");
            search_div.style.display = "none";
            search_div.style.color = "#c7ff00";
            search_div.style.padding = "0px 0px 10px 10px";

            area_id_span.innerText = "分区ID";
            area_id_input.setAttribute("id", "area_id");
            area_id_input.value = area_id;
            area_id_input.style.margin = "10px";
            area_id_input.style.width = "185px";
            area_id_input.setAttribute("placeholder", "输入分区的id，比如虚拟区的就是9，一共有（1,2,3,5,6,9,10,11,13,300）");
            open_time_span.innerText = "打开页面间隔（毫秒）";
            open_time_input.setAttribute("id", "open_time");
            open_time_input.value = open_time;
            open_time_input.style.margin = "10px";
            open_time_input.style.width = "100px";
            open_time_input.setAttribute("placeholder", "输入打开页面间隔,默认5000毫秒");
            max_num_span.innerText = "页面最大数量";
            max_num_input.setAttribute("id", "max_num");
            max_num_input.value = max_num;
            max_num_input.style.margin = "10px";
            max_num_input.style.width = "150px";
            max_num_input.setAttribute("placeholder", "输入打开页面最大数量,默认5个");
            loop_run_time_span.innerText = "自动运行间隔(分钟）";
            loop_run_time_input.setAttribute("id", "loop_run_time");
            loop_run_time_input.value = loop_run_time;
            loop_run_time_input.style.margin = "10px";
            loop_run_time_input.style.width = "110px";
            loop_run_time_input.setAttribute("placeholder", "自动运行的间隔时间");
            
            auto_close_interval_span.innerText = "红包/天选存在检测间隔(分钟）";
            auto_close_interval_input.setAttribute("id", "auto_close_interval");
            auto_close_interval_input.value = auto_close_interval;
            auto_close_interval_input.style.margin = "10px";
            auto_close_interval_input.style.width = "59px";
            auto_close_interval_input.setAttribute("placeholder", "检测直播间是否存在红包/天选的间隔时间");

            auto_close_checkbox.id = "auto_close_checkbox";
            auto_close_checkbox.type = "checkbox";
            auto_close_label.innerText = "自动关闭无奖直播间";
            auto_close_label.title = "主要用于自动运行模式下，对抽奖结束的直播间进行关闭，避免过多爆炸";
            auto_close_label.setAttribute("for", "auto_close_checkbox");
            auto_remove_checkbox.id = "auto_remove_checkbox";
            auto_remove_checkbox.type = "checkbox";
            auto_remove_label.innerText = "删除直播间无用内容";
            auto_remove_label.title = "主要用于简化抽奖页面，防止页面内容过多导致的性能不足问题";
            auto_remove_label.setAttribute("for", "auto_remove_checkbox");

            
            save_config_btn.innerText = "仅保存配置";
            save_config_btn.style.background = "#61d0ff";
            save_config_btn.style.border = "1px solid";
            save_config_btn.style.borderRadius = "3px";
            save_config_btn.style.fontSize = "18px";
            save_config_btn.style.width = "200px";
            save_config_btn.style.margin = "5px 10px";
            save_config_btn.style.padding = "5px";
            save_config_btn.style.cursor = "pointer";
            save_config_btn.onclick = function () { save_config(); };

            search.innerText = "筛选红包+天选";
            search.style.background = "#61d0ff";
            search.style.border = "1px solid";
            search.style.borderRadius = "3px";
            search.style.fontSize = "18px";
            search.style.width = "200px";
            search.style.margin = "5px 10px";
            search.style.padding = "5px";
            search.style.cursor = "pointer";
            search.onclick = function () { go(0); };

            search1.innerText = "筛选红包";
            search1.style.background = "#61d0ff";
            search1.style.border = "1px solid";
            search1.style.borderRadius = "3px";
            search1.style.fontSize = "18px";
            search1.style.width = "100px";
            search1.style.margin = "5px 10px";
            search1.style.padding = "5px";
            search1.style.cursor = "pointer";
            search1.onclick = function () { go(1); };

            search2.innerText = "筛选天选";
            search2.style.background = "#61d0ff";
            search2.style.border = "1px solid";
            search2.style.borderRadius = "3px";
            search2.style.fontSize = "18px";
            search2.style.width = "100px";
            search2.style.margin = "5px 10px";
            search2.style.padding = "5px";
            search2.style.cursor = "pointer";
            search2.onclick = function () { go(2); };

            loop_btn.innerText = "每隔n分钟，自动筛选";
            loop_btn.setAttribute("placeholder", "默认读取上一次的筛选模式");
            loop_btn.style.background = "#61d0ff";
            loop_btn.style.border = "1px solid";
            loop_btn.style.borderRadius = "3px";
            loop_btn.style.fontSize = "16px";
            loop_btn.style.width = "200px";
            loop_btn.style.margin = "5px 10px";
            loop_btn.style.padding = "5px";
            loop_btn.style.cursor = "pointer";
            loop_btn.onclick = function () {
                console.log("清除旧定时器")
                clearInterval(loop_run_interval);

                let temp_loop_run_time = document.getElementById("loop_run_time").value
            
                try {
                    if (temp_loop_run_time.length != 0) {
                        loop_run_time = parseInt(temp_loop_run_time)
                    }
                } catch (error) {
                    console.log(error);
                    show_alert(error)
                }

                red_packet_data_json["loop_run_time"] = loop_run_time

                console.log("开启定时任务，每隔" + loop_run_time + "分钟运行一次")
                show_alert("开启定时任务，每隔" + loop_run_time + "分钟运行一次")

                setTimeout(() => {
                    go(page_type);
                }, 3000);
                
                loop_run_interval = setInterval(() => {
                    go(page_type);
                }, loop_run_time * 60 * 1000);
            };

            describe_span.innerText = "自动运行默认读取上一次的筛选模式。\n自动模式注意页面总数，避免爆炸"
            describe_span.style.fontSize = "13px";

            div.appendChild(show_hide_div);
            div.appendChild(search_div);
            search_div.appendChild(area_id_span);
            search_div.appendChild(area_id_input);
            search_div.appendChild(br1);
            search_div.appendChild(open_time_span);
            search_div.appendChild(open_time_input);
            search_div.appendChild(br2);
            search_div.appendChild(max_num_span);
            search_div.appendChild(max_num_input);
            search_div.appendChild(br3);
            search_div.appendChild(loop_run_time_span);
            search_div.appendChild(loop_run_time_input);
            search_div.appendChild(br6);
            search_div.appendChild(auto_close_interval_span);
            search_div.appendChild(auto_close_interval_input);
            search_div.appendChild(br8);
            search_div.appendChild(auto_close_checkbox);
            search_div.appendChild(auto_close_label);
            search_div.appendChild(auto_remove_checkbox);
            search_div.appendChild(auto_remove_label);
            search_div.appendChild(br7);
            search_div.appendChild(save_config_btn);
            search_div.appendChild(search);
            search_div.appendChild(br4);
            search_div.appendChild(search1);
            search_div.appendChild(search2);
            search_div.appendChild(loop_btn);
            search_div.appendChild(br5);
            search_div.appendChild(describe_span);
            body.appendChild(div);

            // 初始化复选框选中状态
            if(red_packet_data_json.hasOwnProperty("auto_close")) {
                if(auto_close_checkbox.checked == null) auto_close_checkbox.checked = false
                else auto_close_checkbox.checked = red_packet_data_json["auto_close"]
            } else {
                auto_close_checkbox.checked = false
                red_packet_data_json["auto_close"] = false
            }

            if(red_packet_data_json.hasOwnProperty("auto_remove")) {
                if(auto_remove_checkbox.checked == null) auto_remove_checkbox.checked = false
                else auto_remove_checkbox.checked = red_packet_data_json["auto_remove"]
            } else {
                auto_remove_checkbox.checked = false
                red_packet_data_json["auto_remove"] = false
            }

            const url = window.location.href;
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const parentAreaId = urlParams.get('parentAreaId');
            console.log("parentAreaId=" + parentAreaId);
            area_id_input.value = parentAreaId;

            console.log("自动获取分区ID=" + parentAreaId)
            setTimeout(() => {
                show_alert("自动获取分区ID=" + parentAreaId)
            }, 1500);
        }

        init_config_div();

        // 显示隐藏筛选框
        function show_hide() {
            var search_div = document.getElementById("search_div");
            if (search_div.style.display == "none") search_div.style.display = "block";
            else search_div.style.display = "none";
        }

        // 传递传递参数event
        function keydown(event) {
            // “112”为按键F1，可根据需要修改为其他
            if (event.keyCode == 112 || event.keyCode == 113) {
                if (key_flag == 0) {
                    // 按下后执行的代码
                    go(page_type);
                }
                key_flag = 1;
                for (var i = 0; i < 100000; i++);
            } else if (event.keyCode == 120) { // 按f9删除一些无用的图片
                if(window.location.href.startsWith("https://live.bilibili.com/p/eden/area-tags")) {
                    var len = document.getElementsByClassName("Item_3ysKErMC").length;
                    for(var j = 0; j < len; j++) {
                        document.getElementsByClassName("Item_3ysKErMC")[j].getElementsByClassName("bg-bright-filter")[0].style.display = "none"
                        document.getElementsByClassName("Item_2onI5dXq")[j].style.display = "none";
                    }
                    document.getElementsByClassName("link-navbar-ctnr")[0].remove();
                    document.getElementById("area-tags").remove();
                }
            }
        }

        document.addEventListener("keydown", keydown);

        // 请求分区列表，获取分区直播用户信息 传入分区id 和 页数page
        async function get_live_list(area_id, page) {
            return new Promise(function (resolve, reject) {
                var url = "https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=" + area_id + "&page=" + page
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(xhr.statusText);
                        }
                    }
                };
                xhr.send();
            });
        }

        // 获取红包/天选 用户数据
        async function requestData(area_id) {
            try {
                const data = await get_live_list(area_id, page);
                // console.log(data);
                var json = JSON.parse(data);
                console.log(json);

                // 判断是否需要继续请求数据
                if (json["code"] != 0) {
                    console.log("code!=0，请求结束");
                    open_page();
                    return;
                }

                // console.log('json["data"]["list"].length=' + json["data"]["list"].length)

                // 遍历列表数据
                for(let i = 0; i < json["data"]["list"].length; i++) {
                    // console.log(json["data"]["list"][i]["pendant_info"])
                    // 检查JSON对象是否有内容
                    if (Object.keys(json["data"]["list"][i]["pendant_info"]).length > 0) {
                        // 有内容，解析pendent_id
                        for (var key in json["data"]["list"][i]["pendant_info"]) {
                            if (json["data"]["list"][i]["pendant_info"].hasOwnProperty(key)) {
                                var pendent_id = json["data"]["list"][i]["pendant_info"][key].pendent_id;
                                // console.log(pendent_id);
                                if(page_type == 0) {
                                    // 检索id 是否是红包 或 天选
                                    if(pendent_id == 1096 || pendent_id == 504) {
                                        // 直播房间号追加入list
                                        roomid_list.push(json["data"]["list"][i]["roomid"])
                                        break
                                    }
                                } else if(page_type == 1) {
                                    // 检索id 是否是红包
                                    if(pendent_id == 1096) {
                                        // 直播房间号追加入list
                                        roomid_list.push(json["data"]["list"][i]["roomid"])
                                        break
                                    }
                                } else if(page_type == 2) {
                                    // 检索id 是否是天选
                                    if(pendent_id == 504) {
                                        // 直播房间号追加入list
                                        roomid_list.push(json["data"]["list"][i]["roomid"])
                                        break
                                    }
                                }
                            }
                        }
                    }
                }

                // 去重
                roomid_list = roomid_list.filter((value, index) => roomid_list.indexOf(value) === index);

                // 已经检索到足够数量的直播间，结束
                if(roomid_list.length >= max_num) {
                    console.log("已经检索到足够数量的直播间，搜索结束");
                    show_alert("已经检索到足够数量的直播间，搜索结束");
                    open_page();
                    return;
                }

                // 单页数据不足20说明到底了
                if(json["data"]["list"].length < 20) {
                    console.log("单页数据不足20，搜索到底，结束\n" + "搜索到的结果数=" + roomid_list.length);
                    show_alert("单页数据不足20，搜索到底，结束\n" + "搜索到的结果数=" + roomid_list.length);
                    open_page();
                    return;
                }

                // 继续请求数据
                page++;
                setTimeout(() => {
                    requestData(area_id, page);
                }, 200); 
            } catch (error) {
                console.log(error);
                open_page();
                return;
            }
        }

        // 打开页面
        function open_page() {
            for(let i = 0; i < roomid_list.length; i++) {
                if(i >= max_num) {
                    return;
                }
                setTimeout(function() {
                    console.log("i:" + i + " 跳转房间号：" + roomid_list[i])
                    show_alert("i:" + i + " 跳转房间号：" + roomid_list[i])
                    let url = "https://live.bilibili.com/" + roomid_list[i]
                    // window.open(roomid_list[i]).getAttribute("href"))
                    // active:true，新标签页获取页面焦点
                    // setParent :true:新标签页面关闭后，焦点重新回到源页面
                    GM_openInTab(url, { active: false, setParent :true});
                }, open_time * i)
            }
        }

        // 仅保存配置
        function save_config() {
            console.log("准备保存配置喵")
            show_alert("准备保存配置喵")

            let temp_area_id = document.getElementById("area_id").value
            let temp_open_time = document.getElementById("open_time").value
            let temp_max_num = document.getElementById("max_num").value
            let temp_loop_run_time = document.getElementById("loop_run_time").value
            let temp_auto_close_interval = document.getElementById("auto_close_interval").value
            let temp_auto_close = document.getElementById("auto_close_checkbox").checked
            let temp_auto_remove = document.getElementById("auto_remove_checkbox").checked
            
            try {
                if (temp_area_id.length != 0) {
                    area_id = parseInt(temp_area_id)
                }
        
                if (temp_open_time.length != 0) {
                    open_time = parseFloat(temp_open_time)
                }
        
                if (temp_max_num.length != 0) {
                    max_num = parseInt(temp_max_num)
                }

                if (temp_loop_run_time.length != 0) {
                    loop_run_time = parseFloat(temp_loop_run_time)
                }

                if (temp_auto_close_interval.length != 0) {
                    auto_close_interval = parseFloat(temp_auto_close_interval)
                }

                auto_close = temp_auto_close

                auto_remove = temp_auto_remove
            } catch (error) {
                console.log(error);
                show_alert(error)
            }

            red_packet_data_json["area_id"] = area_id
            red_packet_data_json["open_time"] = open_time
            red_packet_data_json["max_num"] = max_num
            red_packet_data_json["auto_close_interval"] = auto_close_interval
            red_packet_data_json["auto_close"] = auto_close
            red_packet_data_json["auto_remove"] = auto_remove
            GM_setValue("red_packet_data_json", JSON.stringify(red_packet_data_json))
            console.log("保存配置到本地")
            show_alert("保存配置到本地")
            

            console.log("当前配置：分区ID=" + area_id + " 打开页面间隔=" + open_time + " 最大页面数=" + max_num + 
                "\n红包/天选存在检测间隔=" + auto_close_interval + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
            show_alert("当前配置：分区ID=" + area_id + " 打开页面间隔=" + open_time + " 最大页面数=" + max_num +
                "\n红包/天选存在检测间隔=" + auto_close_interval + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
        }

        function go(type) {
            console.log("开始运行喵~检索此分区所有数据或检索到足够数量的直播间后，才会打开链接，请耐心等待~")
            show_alert("开始运行喵~检索此分区所有数据或检索到足够数量的直播间后，才会打开链接，请耐心等待~")
            
            page_type = type
            // 清空旧数据
            roomid_list = []
            page = 1

            // 保存配置
            save_config()

            // 开始请求数据
            requestData(area_id);
        }
    }
    // 位于直播页面
    else if (window.location.href.startsWith("https://live.bilibili.com/")) {
        // 删除无用内容
        function remove_useless() {
            document.getElementById("sections-vm").remove();
            document.getElementById("link-footer-vm").remove();
            document.getElementById("sidebar-vm").remove();
            document.getElementById("background-manage-vm").remove();
            document.getElementById("aside-area-vm").remove();
            document.getElementById("room-ssr-vm").remove();
            document.getElementsByClassName("gift-presets p-relative t-right")[0].remove();
            document.getElementsByClassName("m-guard-ent gift-section guard-ent")[0].remove();
            document.getElementsByClassName("player-section p-relative border-box none-select z-player-section")[0].innerHTML = "";
            document.getElementsByClassName("live-skin-coloration-area relative dp-i-block")[0].remove();
            document.getElementById("my-dear-haruna-vm").remove();
            document.getElementsByClassName("lower-row")[0].remove();
        }

        if(red_packet_data_json["auto_remove"]) {
            // 5秒后自动删除无用内容
            setTimeout(() => {
                remove_useless()
            }, 5000);
        }

        // 6秒后自动展开红包栏
        setTimeout(() => {
            try {
                document.getElementsByClassName("inner-part")[0].style.display = "block";
            } catch(error) {
                console.error("Error:", error);
            }
        }, 6000);

        if(red_packet_data_json["auto_close"]) {
            setInterval(() => {
                if(0 == document.getElementsByClassName("popularity-red-envelope-entry gift-left-part").length &&
                    0 == document.getElementsByClassName("anchor-lottery-entry gift-left-part").length) {
                    // 关闭页面
                    window.close();
                }
            }, auto_close_interval * 60 * 1000);
        }   
    }
})