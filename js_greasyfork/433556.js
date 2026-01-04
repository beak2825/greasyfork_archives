// ==UserScript==
// @name         bilibili弹幕列表实时滚动播放
// @namespace    https://eyesblog.gitee.io
// @version      1.0.1
// @description  在B站看视频时弹幕一多就会遮住内容，可我又想看视频又想看弹幕，就写了这个脚本，安装后右侧的弹幕列表会随视频播放而滚动
// @author       eyes++
// @match        https://www.bilibili.com/video/*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433556/bilibili%E5%BC%B9%E5%B9%95%E5%88%97%E8%A1%A8%E5%AE%9E%E6%97%B6%E6%BB%9A%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/433556/bilibili%E5%BC%B9%E5%B9%95%E5%88%97%E8%A1%A8%E5%AE%9E%E6%97%B6%E6%BB%9A%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 允许跨域请求，防止浏览器拦截
    let meta = document.createElement("meta");
    meta.httpEquiv = "Access-Control-Allow-Origin";
    meta.content = "*";
    $("head")[0].appendChild(meta);

    // 初始化若干变量
    let page_loc = location.href;
    let page_start = page_loc.indexOf("?p=");
    let page_p;

    // 获取视频cid
    if (page_start == -1 || page_start == 1) page_p = 0;
    else page_p = page_loc.slice(page_start + 3) - 1;
    let page_cid = window.__INITIAL_STATE__.videoData.pages[page_p].cid;

    // 发起请求，拿到弹幕数据
    $.ajax({
        url: "https://api.bilibili.com/x/v1/dm/list.so?oid=" + page_cid,
        type: "GET",
        dataType: "XML",
        success: function (xml) {
            // 处理返回数据
            data_deal(xml.all);
        },
        error: function (err) {
            console.log("弹幕列表滚动脚本报错:", err);
            alert("弹幕列表滚动脚本失效，可尝试更新最新版本脚本解决问题！\n如果有一定编程基础可以打开控制台查看报错信息。");
        }
    });

    // 存储数据
    let data_deal = data => {
        let data_list = new Array(); // 存时间信息
        let data_arr = new Array(); // 存内容
        let data_length = data.length;
        for (var i = 8; i < data_length; i++) {
            let data_array = data[i].attributes.p.value.split(",");
            data_array.splice(5, 4);
            data_array.splice(1, 3);
            $.each(data_array, function (i) {
                data_array[i] = parseFloat(data_array[i]); // 转换类型，便于排序
            })
            data_list.push(data_array);
            data_arr.push(data[i].innerHTML);
        }

        // 执行排序
        data_sort(data_list, 0, data_length - 9, data_arr);

        // 修改弹幕列表
        let clear = setInterval(() => {
            if ($(".bui-collapse-header")[0]) { // 等待弹幕列表加载出来
                clearInterval(clear);
                $(".bui-collapse-header").click(() => {
                    let clearInter = setInterval(function () {
                        if ($(".player-auxiliary-danmaku-load-status").css("display") == "none") { // 等待弹幕数据加载出来
                            clearInterval(clearInter);
                            list_change(data_list, data_arr); // 然后开始修改列表
                        }
                    }, 100);
                })
            }
        }, 100)
    }

    // 数据排序(快排算法)
    let data_sort = (data_list, l, r, data_arr) => {
        if (l < r) {
            let i = l,
                j = r,
                temp = data_list[l],
                t1, t2, t3;
            while (i < j) {
                while (i < j && data_list[j][0] >= temp[0]) j--;
                while (i < j && data_list[i][0] <= temp[0]) i++;
                if (i < j) {
                    t1 = data_list[i];
                    data_list[i] = data_list[j];
                    data_list[j] = t1;
                    t2 = data_arr[i];
                    data_arr[i] = data_arr[j];
                    data_arr[j] = t2;
                }
            }

            data_list[l] = data_list[i];
            data_list[i] = temp;
            t3 = data_arr[l];
            data_arr[l] = data_arr[i];
            data_arr[i] = t3;
            data_sort(data_list, l, i - 1, data_arr);
            data_sort(data_list, i + 1, r, data_arr);
        }
    }

    // 查找
    let danmaku_search = (arr, time) => {
        try {
            arr.forEach((v, i) => {
                if (v[0] - time >= 0 && v[0] - time < 1) throw new Error(String(i));
                if (v[0] - time > 1) throw new Error(i);
            });
        } catch (e) {
            return e.message;
        }
        return -1;
    }

    // 时间格式转换(分转秒)
    let time_m_s = a => {
        if (a.length == 2) return a[0] * 60 + a[1];
        else return a[0] * 3600 + a[1] * 60 + a[2];
    }

    // 时间格式转换(秒转分)
    let time_s_m = a => {
        a = Math.floor(a);
        let m = Math.floor(a / 60);
        let s = (a - Math.floor(a / 60) * 60);
        if (m < 0) m = "00";
        else if (m < 10) m = "0" + String(m);
        if (s < 10) s = "0" + String(s);
        return m + ":" + s;
    }

    // 发送日期格式转换
    let data_s_d = a => {
        let date = new Date(a * 1000);
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate();
        if (D < 10) D = "0" + String(D) + ' ';
        else D = D + ' ';
        let h = date.getHours();
        if (h < 10) h = "0" + String(h) + ":";
        else if (h == 0) h = "00" + ":";
        else h = h + ":";
        let m = date.getMinutes();
        if (m < 10) m = "0" + String(m);
        else if (m == 0) m = "00";
        return M + D + h + m;
    }

    // 获取当前视频播放秒数
    let get_now_s = () => {
        let time_now = $('.bilibili-player-video-time-now')[0].innerHTML.split(":");
        $.each(time_now, function (i) {
            time_now[i] = parseInt(time_now[i]);
        })
        return time_m_s(time_now);
    }

    let list_change = (data_list, data_arr) => {
        // 修改页面控制
        $(".player-auxiliary-danmaku-btn-time").removeAttr("orderby");
        $(".player-auxiliary-danmaku-btn-danmaku").removeAttr("orderby");
        $(".player-auxiliary-danmaku-btn-date").removeAttr("orderby");
        $(".player-auxiliary-danmaku-function > .player-auxiliary-danmaku-btn-danmaku")[0].innerHTML = "滚动弹幕(共" + data_arr.length + "条)";

        // 破坏初始列表结构
        $(".player-auxiliary-danmaku-wrap > .player-auxiliary-danmaku-contaner").removeClass("player-auxiliary-danmaku-contaner player-auxiliary-bscrollbar");
        $(".player-auxiliary-danmaku-wrap").off();
        $(".player-auxiliary-danmaku-wrap > div > ul").off();

        // 监听视频播放
        let danmaku_length = $(".player-auxiliary-danmaku-wrap > div > ul > li").length; // 获取当前展示的弹幕数量
        let li_width = $(".player-auxiliary-danmaku-wrap > div > ul > li").css("width"); // 列表宽度
        let isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
        let data_length = data_list.length;

        // 开场进行一次排序
        if (parseFloat($(".player-auxiliary-danmaku-wrap").css("height").replace("px", "")) >= parseFloat($(".player-auxiliary-danmaku-wrap > div > ul").css("height").replace("px", ""))) {
            setInterval(() => {
                if (isChange != $(".bilibili-player-video-time-now")[0].innerHTML) {
                    let now_i = danmaku_search(data_list, get_now_s()); // 获取即将播放的弹幕
                    if (now_i != -1) list_structure(data_list, data_arr, 0, danmaku_length - 1, now_i, li_width);
                    isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
                }
            }, 1000);
        } else {
            setInterval(() => {
                if (isChange != $(".bilibili-player-video-time-now")[0].innerHTML) {
                    // 获取列表首尾
                    let now_i = danmaku_search(data_list, get_now_s());
                    // 判断是否需要更新
                    if (now_i != -1 && parseInt(now_i) + danmaku_length - 15 >= data_length) list_structure(data_list, data_arr, data_length - danmaku_length, data_length - 1);
                    else if (now_i != -1) list_structure(data_list, data_arr, parseInt(now_i) - 7, parseInt(now_i) + danmaku_length - 8);
                    isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
                }
            }, 1000);
        }

        // 开启与停止滚动控制
    }

    // 构建弹幕列表
    let list_structure = (data_list, data_arr, start, end) => {
        $(".player-auxiliary-danmaku-wrap > div > ul").empty(); // 清除先前的弹幕，重新构建
        for (let i = start; i <= end; i++) {
            let li = document.createElement("li");
            let span1 = document.createElement("span");
            let span2 = document.createElement("span");
            let span3 = document.createElement("span");
            let text1 = document.createTextNode(time_s_m(data_list[i][0]));
            let text2 = document.createTextNode(data_arr[i]);
            let text3 = document.createTextNode(data_s_d(data_list[i][1]));
            span1.appendChild(text1);
            span2.appendChild(text2);
            span3.appendChild(text3);
            $(span1).addClass("danmaku-info-time");
            $(span2).addClass("danmaku-info-danmaku");
            $(span3).addClass("danmaku-info-date");
            li.appendChild(span1);
            li.appendChild(span2);
            li.appendChild(span3);
            $(li).addClass("danmaku-info-row");
            $(".player-auxiliary-danmaku-wrap > div > ul")[0].appendChild(li);
        }
    }
})();