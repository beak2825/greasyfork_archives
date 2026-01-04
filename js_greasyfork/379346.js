// ==UserScript==
// @name         快点做正事！ 结合Todoist帮助你专心工作
// @namespace    *
// @version      0.4
// @description  帮助提醒你限制娱乐时长，专心工作，同时提醒你每日任务，需要注册Todoist(https://todoist.com)
// @include      *
// @author       kwp
// @match        *
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/379346/%E5%BF%AB%E7%82%B9%E5%81%9A%E6%AD%A3%E4%BA%8B%EF%BC%81%20%E7%BB%93%E5%90%88Todoist%E5%B8%AE%E5%8A%A9%E4%BD%A0%E4%B8%93%E5%BF%83%E5%B7%A5%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/379346/%E5%BF%AB%E7%82%B9%E5%81%9A%E6%AD%A3%E4%BA%8B%EF%BC%81%20%E7%BB%93%E5%90%88Todoist%E5%B8%AE%E5%8A%A9%E4%BD%A0%E4%B8%93%E5%BF%83%E5%B7%A5%E4%BD%9C.meta.js
// ==/UserScript==


let block_urls = [
    /https?:\/\/.*?\.bilibili\.com.*?/,
    /https?:\/\/.*?\.?weibo\..*?/,
    /https?:\/\/.*?steampowered\..*?/,
    /https?:\/\/.*?\.douyu\..*?/,
    /https?:\/\/.*?\.?nga\..*?/,
    /https?:\/\/.*?\.?acfun\..*?/,
    /https?:\/\/.*?\.?zhihu\..*?/,
    /https?:\/\/.*?\.?4399\..*?/,
    /https?:\/\/.*?\.?youku\..*?/,
    /https?:\/\/.*?\.?iqiyi\..*?/,
    /https?:\/\/.*?\.?youtube\..*?/,
    /https?:\/\/v\.qq.com.*?/,

];


(function () {
    'use strict';
    const todoist_token = GM_getValue("todoist_token", "");
    const max_minutes = GM_getValue("max_minutes", 30);

    let first_launch = GM_getValue("first_lanuch", true);
    if (first_launch) {
        let idUrl = "https://todoist.com/prefs/integrations";
        alert("欢迎使用!\n请在打开的窗口内复制API置换符，然后在油猴的配置中点击 \"设置 Todoist Token\" 以修改");
        GM_openInTab(idUrl);
        GM_setValue("first_lanuch", false);
        return;
    }

    let ID = Date();  // 脚本ID
    GM_setValue("runID", ID);

    let today = new Date();
    let key = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    let second = GM_getValue(key, 0);

    let url = location.href;
    let block = false;
    block_urls.some((pattern, i) => {
        if (url.match(pattern)) {
            console.log("match" + pattern);
            block = true;
            return true;
        }
    });
    if (!block) return;

    let interval = setInterval(function () {
        let second = GM_getValue(key, 0);
        GM_setValue(key, second + 5);
        let id = GM_getValue("runID");
        if (id !== ID) {
            clearInterval(interval)
        }
    }, 5000);

    if (second < max_minutes * 60) return;

    const confession = "我知道这样不好，但我还是要玩";

    let mask = document.createElement("div");
    mask.id = "mask";
    $(mask).css("position", "fixed").css("left", "0").css("top", "0").css("right", "0")
        .css("bottom", "0").css("background", "white").css("z-index", "999999999");

    mask.innerHTML = "<style>.hint-title { font-size: 50px; text-align: center; font-weight: bolder; } .hint-content {margin: 5% 25%;font-weight: bolder;font-size: 20px;}\n" +
        "li.hint-item {margin: 5% 0;font-size: 18px;} @-webkit-keyframes twinkling{ 0%{ opacity: 0; } 100%{opacity: 1;} } .hint-day, h1{color: black}\n" +
        "@keyframes twinkling{ 0%{ opacity: 0; } 100%{opacity: 1;} } a.undue {color: green;} a.due {color: red;-webkit-animation: twinkling 0.2s infinite ease-in-out}\n" +
        "a.today{color: blue;} .loading{color: lightseagreen;-webkit-animation: twinkling 1s infinite ease-in-out}</style><div class=\"hint-content\">\n" +
        "    <h1 class=\"hint-title\">快去做正事！</h1><p class=\"hint-day\">你还有这些任务没有做</p><ol id=\"todolist\"> </ol>\n" +
        "    <p class=\"loading\">加载中</p><button id=\"continue\">执意要玩</button></div>\n";

    document.body.appendChild(mask);
    let todo_url = "https://beta.todoist.com/API/v8/tasks";
    function append_task(content, due, url) {
        let due_time = new Date(Date.parse(due));
        let today = new Date();
        let is_today = due_time.getFullYear() === today.getFullYear()
            && due_time.getMonth() === today.getMonth()
            && due_time.getDate() === today.getDate();
        let hint = "";
        let cls = "";
        if (Date.parse(due) - Date.now() > 0) {
            hint = "";
            cls = "undue";
        } else if (is_today) {
            hint = "(今天)";
            cls = "today";
        } else {
            hint = "(已过期)";
            cls = "due";
        }
        $("#todolist").append("<li class='hint-item'><a target='_blank' class='" + cls + "' href='" + url + "'>" + due + "  :  " + content + "  " + hint + "</a></li>");
    }
    $.get({
        url: todo_url,
        headers: {
            Authorization: "Bearer " + todoist_token
        },
        success: function (array) {
            let count = 0;
            array.forEach((item, i) => {
                if (Object.keys(item).indexOf("due") > -1) {
                    append_task(item["content"], item["due"]["date"], item["url"]);
                    $(".loading").remove();
                    count++;
                }
            });
            if (count === 0) {
                $(".loading").html("没有待办事项了");
            }
        }
    });
    $("#continue").on("click", function () {
        let cfm = prompt("输入: " + confession, "");
        if (cfm === confession)
            $("#mask").remove();
    });
})();

function set_todo_key() {
    let token = prompt("输入复制到的 Todoist Token", "");
    if (confirm("确定设置为 " + token + " 吗?")) {
        GM_setValue("todoist_token", token);
        alert("设置成功！");
    }
}

function set_max_minute() {
    if (!window.confirm("确定要修改时长吗？")) return;
    let max_use = GM_getValue("max_minutes", 30);
    let len = prompt("输入最大时长（分钟）", max_use);
    if (len.match(/^[0-9]+$/).length === 0) {
        alert("输入错误！");
        return;
    }

    let num = parseInt(len);
    let confirm = "我知道我修改的最大时长，我会为我的行为负责";
    if (prompt("你的输入为 " + num + " 分钟, 输入: " + confirm + " 以确认") === confirm) {
        GM_setValue("max_minutes", num);
        alert("修改成功！");
    } else {
        alert("修改失败！");
    }

}

function look_use_minute(){
    let today = new Date();
    let key = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    let second = GM_getValue(key, 0);
    alert("你今天已经玩了 " + parseInt(second / 60) + " 分钟");
}

GM_registerMenuCommand("设置 Todoist Token", set_todo_key);
GM_registerMenuCommand("修改最大允许时间", set_max_minute);
GM_registerMenuCommand("查看今天使用的时长", look_use_minute);
