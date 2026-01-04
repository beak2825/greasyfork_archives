// ==UserScript==
// @name         b站首页自动转发视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  b站首页，左侧加载弹窗，配置相关内容，点击 开始运行 即可
// @author       Ikaros
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         http://bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/scripts/461056
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461056/b%E7%AB%99%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%8F%91%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/461056/b%E7%AB%99%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%8F%91%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

/*
使用说明:
    暂时懒得写
*/

; (async function () {
    // 配置数据
    let open_video_data_json = null;
    // 打开页面时间间隔
    let open_time = 12000;
    // 最大打开直播间数量
    let max_num = 10;
    // 弹窗定时器
    let interval_alert_div = null;
    let auto_close = true;
    let auto_remove = true;

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
            open_video_data_json = JSON.parse(GM_getValue("open_video_data_json"));
            open_time = open_video_data_json["open_time"] == null ? 12000 : open_video_data_json["open_time"]
            max_num = open_video_data_json["max_num"] == null ? 15 : open_video_data_json["max_num"]
            auto_close = open_video_data_json["auto_close"] == null ? true : open_video_data_json["auto_close"]
            auto_remove = open_video_data_json["auto_remove"] == null ? true : open_video_data_json["auto_remove"]

            console.log("当前配置： 打开页面间隔=" + open_time + " 最大页面数=" + max_num + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
            show_alert("当前配置： 打开页面间隔=" + open_time + " 最大页面数=" + max_num + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
        } catch {
            open_video_data_json = {
                "open_time": open_time,
                "max_num": max_num,
                "auto_close": true,
                "auto_remove": true
            }
            GM_setValue("open_video_data_json", JSON.stringify(open_video_data_json))
            console.log("本地无配置，已初始化")
            show_alert("本地无配置，已初始化")
        }
    }

    get_config();

    // 位于视频页面
    if (window.location.href.startsWith("https://www.bilibili.com/video/")) {
        // 删除无用内容
        function remove_useless() {
            document.getElementById("playerWrap").remove()
            console.log("删除视频框")
            show_alert("删除视频框")
        }

        // 删除视频框
        if(open_video_data_json["auto_remove"]) {
            // x后自动删除无用内容
            setTimeout(() => {
                remove_useless()
            }, 5000);
        }

        // 鼠标悬停转发
        setTimeout(function() {
            document.getElementById("share-btn-outer").dispatchEvent(new MouseEvent('mouseenter'));
            console.log("鼠标悬停转发")
            show_alert("鼠标悬停转发")
        }, 6000);

        // 等待一段时间，使得弹出窗口能够完全显示出来
        setTimeout(function() {
            document.getElementsByClassName("share-btn")[0].click()
            console.log("点击分享动态")
            show_alert("点击分享动态")

            // 等秒点击转发按钮
            setTimeout(function() {
                var iframe = document.getElementsByTagName("iframe")[(document.getElementsByTagName("iframe").length - 1)]
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.getElementsByClassName("share-step")[0].getElementsByClassName("share-btn")[0].click()
                console.log("点击转发")
                show_alert("点击转发")
            }, 3000);
        }, 9000);
        // 等待秒后模拟点击按钮

        

        // 自动关闭
        if(open_video_data_json["auto_close"]) {
            setInterval(() => {
                console.log("关闭页面")
                show_alert("关闭页面")
                // 关闭页面
                window.close()
            }, 15 * 1000);
        }
    }
    // 位于首页
    else if(window.location.href == "https://www.bilibili.com/") {
        // 在页面左侧插入一个配置使用框
        function init_config_div() {
            // 在页面左侧插入一个用户筛选框
            var body = document.getElementsByTagName("body")[0];
            var br1 = document.createElement("br");
            var br2 = document.createElement("br");
            var br3 = document.createElement("br");
            var div = document.createElement("div");
            var show_hide_div = document.createElement("div");
            var search_div = document.createElement("div");

            var open_time_span = document.createElement("span");
            var open_time_input = document.createElement("input");
            var max_num_span = document.createElement("span");
            var max_num_input = document.createElement("input");

            var auto_close_checkbox = document.createElement("input");
            var auto_close_label = document.createElement("label");
            var auto_remove_checkbox = document.createElement("input");
            var auto_remove_label = document.createElement("label");

            var search = document.createElement("button");
            var save_config_btn = document.createElement("button");

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
            show_hide_div.innerText = "视频检索☚";
            show_hide_div.onclick = function () { show_hide(); };
            search_div.setAttribute("id", "search_div");
            search_div.style.display = "none";
            search_div.style.color = "#c7ff00";
            search_div.style.padding = "0px 0px 10px 10px";

            open_time_span.innerText = "打开页面间隔（毫秒）";
            open_time_input.setAttribute("id", "open_time");
            open_time_input.value = open_time;
            open_time_input.style.margin = "10px";
            open_time_input.style.width = "100px";
            open_time_input.setAttribute("placeholder", "输入打开页面间隔,默认" + open_time + "毫秒");
            max_num_span.innerText = "页面最大数量";
            max_num_input.setAttribute("id", "max_num");
            max_num_input.value = max_num;
            max_num_input.style.margin = "10px";
            max_num_input.style.width = "150px";
            max_num_input.setAttribute("placeholder", "输入打开页面最大数量,默认" + max_num + "个");

            auto_close_checkbox.id = "auto_close_checkbox";
            auto_close_checkbox.type = "checkbox";
            auto_close_label.innerText = "自动关闭视频页";
            auto_close_label.title = "避免过多爆炸";
            auto_close_label.setAttribute("for", "auto_close_checkbox");
            auto_remove_checkbox.id = "auto_remove_checkbox";
            auto_remove_checkbox.type = "checkbox";
            auto_remove_label.innerText = "删除视频内容";
            auto_remove_label.title = "主要用于简化视频页面，防止某些问题";
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

            search.innerText = "开始运行";
            search.style.background = "#61d0ff";
            search.style.border = "1px solid";
            search.style.borderRadius = "3px";
            search.style.fontSize = "18px";
            search.style.width = "200px";
            search.style.margin = "5px 10px";
            search.style.padding = "5px";
            search.style.cursor = "pointer";
            search.onclick = function () { go(); };

            div.appendChild(show_hide_div);
            div.appendChild(search_div);
            search_div.appendChild(open_time_span);
            search_div.appendChild(open_time_input);
            search_div.appendChild(br1);
            search_div.appendChild(max_num_span);
            search_div.appendChild(max_num_input);
            search_div.appendChild(br2);
            search_div.appendChild(auto_close_checkbox);
            search_div.appendChild(auto_close_label);
            search_div.appendChild(auto_remove_checkbox);
            search_div.appendChild(auto_remove_label);
            search_div.appendChild(br3);
            search_div.appendChild(save_config_btn);
            search_div.appendChild(search);

            body.appendChild(div);

            // 初始化复选框选中状态
            if(open_video_data_json.hasOwnProperty("auto_close")) {
                if(auto_close_checkbox.checked == null) auto_close_checkbox.checked = false
                else auto_close_checkbox.checked = open_video_data_json["auto_close"]
            } else {
                auto_close_checkbox.checked = false
                open_video_data_json["auto_close"] = false
            }

            if(open_video_data_json.hasOwnProperty("auto_remove")) {
                if(auto_remove_checkbox.checked == null) auto_remove_checkbox.checked = false
                else auto_remove_checkbox.checked = open_video_data_json["auto_remove"]
            } else {
                auto_remove_checkbox.checked = false
                open_video_data_json["auto_remove"] = false
            }
        }

        init_config_div();

        // 显示隐藏筛选框
        function show_hide() {
            var search_div = document.getElementById("search_div");
            if (search_div.style.display == "none") search_div.style.display = "block";
            else search_div.style.display = "none";
        }

        // 仅保存配置
        function save_config() {
            console.log("准备保存配置喵")
            show_alert("准备保存配置喵")

            let temp_open_time = document.getElementById("open_time").value
            let temp_max_num = document.getElementById("max_num").value
            let temp_auto_close = document.getElementById("auto_close_checkbox").checked
            let temp_auto_remove = document.getElementById("auto_remove_checkbox").checked


            try {
                if (temp_open_time.length != 0) {
                    open_time = parseFloat(temp_open_time)
                }

                if (temp_max_num.length != 0) {
                    max_num = parseInt(temp_max_num)
                }

                auto_close = temp_auto_close

                auto_remove = temp_auto_remove
            } catch (error) {
                console.log(error);
                show_alert(error)
            }

            open_video_data_json["open_time"] = open_time
            open_video_data_json["max_num"] = max_num
            open_video_data_json["auto_close"] = auto_close
            open_video_data_json["auto_remove"] = auto_remove
            GM_setValue("open_video_data_json", JSON.stringify(open_video_data_json))
            console.log("保存配置到本地")
            show_alert("保存配置到本地")


            console.log("当前配置： 打开页面间隔=" + open_time + " 最大页面数=" + max_num + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
            show_alert("当前配置： 打开页面间隔=" + open_time + " 最大页面数=" + max_num + " 自动关闭=" + auto_close + " 自动删除无用=" + auto_remove)
        }

        function go() {
            console.log("开始运行喵~")
            show_alert("开始运行喵~")

            // 保存配置
            save_config()

            // 下滑加载数据
            window.scroll(0, 1920*100);

            setTimeout(() => {
                // 下滑加载数据
                window.scroll(0, 1920*100);

                setTimeout(() => {
                    // 下滑加载数据
                    window.scroll(0, 1920*100);

                    setTimeout(() => {
                        // 下滑加载数据
                        window.scroll(0, 1920*100);

                        setTimeout(() => {
                            // 下滑加载数据
                            window.scroll(0, 1920*100);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);

            setTimeout(() => {
                let total_video = document.getElementsByClassName("bili-video-card__wrap __scale-wrap")
                let total_video_len = total_video.length

                console.log("加载视频数=" + (total_video_len - 1))
                show_alert("加载视频数=" + (total_video_len - 1))

                for(let i = 1; i < total_video_len; i++) {
                    if (i > max_num) break;
                    let url = total_video[i].getElementsByTagName("a")[0].href
                    setTimeout(function() {
                        console.log("i:" + i + " 跳转房间号：" + url)
                        show_alert("i:" + i + " 跳转房间号：" + url)
                        // window.open(roomid_list[i]).getAttribute("href"))
                        // active:true，新标签页获取页面焦点
                        // setParent :true:新标签页面关闭后，焦点重新回到源页面
                        GM_openInTab(url, { active: false, setParent :true});
                    }, open_time * (i - 1))
                }
            }, 3000);
        }
    }
})();