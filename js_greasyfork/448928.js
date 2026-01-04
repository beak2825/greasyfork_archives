// ==UserScript==
// @name         自动向下刷
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto scroll screen in weibo website
// @author       Hui
// @match        https://weibo.com/*
// @icon         https://img1.baidu.com/it/u=246575162,2537276218&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=533
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448928/%E8%87%AA%E5%8A%A8%E5%90%91%E4%B8%8B%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/448928/%E8%87%AA%E5%8A%A8%E5%90%91%E4%B8%8B%E5%88%B7.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // https://weibo.com/1713926427/LDEKNt3VT?filter=hot&root_comment_id=0&type=comment&ssl_rnd=1658652960.4338#_rnd1658653590628
    let latest_comment_id;
    let total_changed_count = 0;
    let pattern = /.* 来自(\S+)/;
    let location_dict = {};
    let all_comment_arrays = [];
    let all_comment_count = 0;

    // 默认不移除其他元素
    let is_remove_other_element = false;
    // 默认每隔2秒向下刷一次
    let auto_scroll_time = 2000;
    // 向下刷高度
    let scroll_height = 0;
    // 自动下滑定时器
    let interval_scroll;
    let sort_by_time = true;
    let key_info;
    const background_color_green =
        "background: #00cc00; color: #fff; border-radius: 3px 0 0 3px;padding:2px 5px";
    const background_color_bule =
        "background: #1475B2; color: #fff; border-radius: 0 3px 3px 0;padding:2px 5px";

    function change_aim_comment_color() {
        let this_changed_count = 0;
        let this_find_image_numbers = 0;
        let array_length = 0;
        document
            .querySelectorAll("div[node-type] .list_li")
            .forEach((element, index, array) => {
                array_length = array.length;
                const comment_id = element.getAttribute("comment_id");
                let comment_location = "";
                if (element.innerText.match(pattern)) {
                    comment_location = element.innerText.match(pattern)[1];
                }

                if (all_comment_arrays.indexOf(comment_id) < 0) {
                    all_comment_arrays.push(comment_id);
                    all_comment_count += 1;
                    if (comment_location in location_dict) {
                        location_dict[comment_location] += 1;
                    } else {
                        location_dict[comment_location] = 1;
                    }

                    const image_element = element.querySelector(".bigcursor");
                    if (image_element) {
                        // 点击图片
                        image_element.click();
                        this_find_image_numbers += 1;
                    }
                    if (
                        (element.innerText.indexOf("四川") > 0) |
                        (element.innerText.indexOf("评论配图") > 0)
                    ) {
                        // 变更背景
                        total_changed_count += 1;
                        this_changed_count += 1;
                        element.style.backgroundColor = "rgb(232 223 50)";
                        latest_comment_id = element.getAttribute("comment_id");
                        if (
                            element.innerText.indexOf("四川") > 0 &&
                            element.innerText.indexOf("评论配图") > 0
                        ) {
                            element.style.backgroundColor = "red";
                        }
                    } else if (
                        element.innerText.indexOf("来自") > 0 &&
                        index < array.length &&
                        is_remove_other_element
                    ) {
                        // 移除元素
                        element.remove();
                    }
                }
            });
        let sort_location_array = Object.entries(location_dict).sort(
            ([_, a], [_2, b]) => b - a
        );
        console.log("%c %s", background_color_green, sort_location_array.join());
        console.log(
            "%c累计评论%d次；总计变更%d次；此次页面元素个数%d；此次找到图片：%d次；此次变更背景：%d次",
            background_color_bule,
            all_comment_count,
            total_changed_count,
            array_length,
            this_find_image_numbers,
            this_changed_count
        );
    }

    function autoScrollScreen() {
        let roll_count = 0;

        function scroll_screen() {
            var element = document.documentElement;
            if (
                element.scrollTop + element.clientHeight + 500 >=
                element.scrollHeight
            ) {
                if (document.querySelector(".list_ul .more_txt")) {
                    // 到底部时点击查看更多
                    document.querySelector(".list_ul .more_txt").click();
                }
            } else {

                element.scrollTop += scroll_height;
                roll_count += 1;
                console.log("%c下滑次数：", background_color_bule, String(roll_count));
            }
            change_aim_comment_color();
            if (roll_count > 3 && document.querySelector(".list_ul .more_txt")) {
                // 到底部时点击查看更多
                document.querySelector(".list_ul .more_txt").click();
            }
        }
        interval_scroll = setInterval(scroll_screen, auto_scroll_time);
    }

    window.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.code == "KeyR") {
            key_info = "开始自动刷";
            autoScrollScreen();
        } else if (e.ctrlKey && e.code == "KeyC") {
            key_info = "停止自动刷";
            clearInterval(interval_scroll);
        } else if (e.ctrlKey && e.code == "KeyW") {
            if (sort_by_time) {
                // 按时间
                document
                    .querySelectorAll(".repeat_list .tab .S_line1 .S_txt1")[1]
                    .click();
            } else {
                // 按热度
                document
                    .querySelectorAll(".repeat_list .tab .S_line1 .S_txt1")[0]
                    .click();
            }
            key_info = sort_by_time ? "通过时间排序查看" : "通过热度排序查看";
            sort_by_time = !sort_by_time;
            all_comment_arrays = [];
        } else if (e.ctrlKey && e.code == "KeyE") {
            is_remove_other_element = !is_remove_other_element;
            key_info = is_remove_other_element ?
                "移除" + "其他元素" :
                "不移除" + "其他元素";
        } else if (e.ctrlKey && e.code == "KeyY") {
            scroll_height += 100;
            key_info = "增加每次向下刷高度到" + scroll_height;
        } else if (e.ctrlKey && e.code == "KeyG") {
            scroll_height -= 100;
            key_info = "减少每次向下刷高度到" + scroll_height;
        } else if (e.ctrlKey && e.code == "KeyH") {
            scroll_height -= 100;
            key_info = "Ctrl+r 开始 Ctrl+c 停止 Ctrl+w 切换时间排序或热度排序 " +
                "Ctrl+e 是否移除其他元素 默认不移除 Ctrl+y 增加下滑高度 Ctrl+g 减少下滑高度 Ctrl+h 提示帮组信息";
        }

        if (e.ctrlKey && e.code.indexOf("Key") >= 0) {
            console.log(
                "%c执行了 %s %s %c %s",
                background_color_green,
                e.ctrlKey ? "Ctrl" : "",
                e.code.replace("Key", ""),
                background_color_bule,
                key_info
            );
        }
    });
})();