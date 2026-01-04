// ==UserScript==
// @name         Atcoder 中文版
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  翻译
// @author       You
// @match        https://atcoder.jp/*
// @run-at       document-start
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/503732/Atcoder%20%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/503732/Atcoder%20%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==
(function () {
    const TEXT = {
        "(local time)": "（本地时间）",
        "Active Users": "活跃用户",
        "Affiliation": "工作单位",
        "Algorithm": "算法竞赛",
        "All": "全部",
        "All Submissions": "所有提交",
        "All Users": "所有用户",
        "Auto Refresh": "自动刷新",
        "Back to Home": "返回主页",
        "Birth Year": "出生年份",
        "Category": "类别",
        "Change Password": "更换密码",
        "Change Photo": "更换头像",
        "Change/Verify Email address": "更改/验证电子邮件地址",
        "Clarifications": "提问",
        "Company": "公司信息",
        "Competition History": "历史比赛",
        "Contact": "联系方式",
        "Contest": "比赛",
        "Contest Archive": "比赛记录",
        "Contest Name": "比赛名字",
        "Contest Status": "比赛记录",
        "Country/Region": "国家/地区",
        "Custom Test": "自定义测试",
        "Customize": "自定义",
        "Duration": "持续时间",
        "Editorial": "题解",
        "Email Notifications": "邮箱提醒",
        "FAQ": "常见问题",
        "General Settings": "基本设置",
        "Glossary": "术语",
        "Heuristic": "启发式竞赛",
        "Heuristic Contest": "启发式比赛",
        "Highest Rating": "最高等级分",
        "Home": "首页",
        "Information": "公告",
        "Information Protection Policy": "信息保护政策",
        "Last Contest Result": "上次比赛结果",
        "Manage Fav": " 管理收藏",
        "More...": "更多...",
        "My Profile": "我的主页",
        "My Score": "我的分数",
        "My Submissions": "我的提交",
        "Nickname": "昵称",
        "Other": "其他",
        "Page Top": "页首",
        "Past Contests": "往届比赛",
        "Permanent Contests": "永久性比赛",
        "Present Contests": "当前比赛",
        "Privacy Policy": "隐私政策",
        "Profile": "简介",
        "Rank": "排名",
        "Ranking": "排名",
        "Rated Range": "等级范围",
        "Rating": "等级分",
        "Rating Distribution": "评级分布",
        "Recent Contests": "最近的比赛",
        "Refresh": "刷新",
        "Register": "报名",
        "Reset": "重置",
        "Restructuring of contests": "比赛调整",
        "Results": "结果",
        "Rule": "规则",
        "Search": "搜索",
        "Search in Archive": "在存档中搜索",
        "Settings": "设置",
        "Sign In": "登录",
        "Sign Out": "退出登录",
        "Sign Up": "注册",
        "Sponsored ABC": "赞助入门赛（ABC）",
        "Sponsored ARC": "赞助常规赛（ARC）",
        "Sponsored Heuristic Contest": "赞助启发式比赛",
        "Sponsored Parallel(rated)": "赞助平行赛（评级）",
        "Sponsored Parallel(unrated)": "赞助平行赛（未评级）",
        "Sponsored Tournament": "赞助锦标赛",
        "Standings": "排名",
        "Start Time": "开始时间",
        "Submit": "提交",
        "Tasks": "题目",
        "Terms of service": "服务条款",
        "The file size must be at most 1MB.": "文件大小不得超过1MB。",
        "The width and height must be at most 512px.": "宽度和高度不得超过512px。",
        "There is no clarifications yet.": "目前还没有提示。",
        "This user has not competed in a rated contest yet.": "该用户没有参加过有评级的比赛。",
        "This user has not competed yet.": "该用户没有参加过比赛。",
        "Top": "首页",
        "Unofficial(unrated)": "非官方（未评级）",
        "Upcoming Contests": "即将到来的比赛",
        "Update": "更新",
        "Upload": "上传",
        "User": "用户",
        "View all": "查看全部",
        "Virtual Participation": "虚拟参与",
        "Virtual Standings": "虚拟排名",
        "You can use only jpg/png files.": "您只能使用jpg/png文件。",
        "last update": "上次更新",
        "【Important Notice】 Please beware of fake sites impersonating AtCoder": "【重要提示】请注意假冒AtCoder的虚假网站"
    }
    function ObjSort(arys) {
        var newkey = Object.keys(arys).sort();
        var newObj = {};
        for (var i = 0; i < newkey.length; i++) newObj[newkey[i]] = arys[newkey[i]];
        return newObj; //返回排好序的新对象
    }
    console.log("词汇表：");
    console.log(ObjSort(TEXT));
    let cnt = 0, id, flag = sessionStorage["translate"], bflag = 0;
    if (flag == undefined) {
        flag = 1;
        sessionStorage["translate"] = 1;
    }
    function translate(x) {
        if (x.nodeType == 3) {
            let str = x.nodeValue, l = 0, ls = "", r = 0, rs = "";
            while (" \n\t".includes(str[l])) ls += str[l], l++;
            while (" \n\t".includes(str[str.length - 1 - r]) && str.length - 1 - r >= l) rs += str[str.length - 1 - r], r++;
            if (str[str.length - 1 - r] == ":") rs += "：", r++;
            if (TEXT[str.substring(l, str.length - r)] != undefined) {
                str = TEXT[str.substring(l, str.length - r)];
                x.old = x.nodeValue;
                x.nodeValue = ls + str + rs;
            }
            return;
        }
        let c = Array.from(x.childNodes)
        for (let i of c) translate(i);
    }
    function back(x) {
        if (x.nodeType == 3) {
            if (x.old != undefined) {
                x.nodeValue = x.old
                x.old = undefined;
            }
            return;
        }
        let c = Array.from(x.childNodes)
        for (let i of c) back(i);
    }
    function main() {
        if (bflag == 0) {
            let a = document.getElementsByClassName("nav navbar-nav navbar-right")[0];
            if (a != undefined) {
                bflag = 1;
                let bu = document.createElement("button");
                bu.innerText = (flag == 1) ? "关闭翻译" : "开启翻译";
                bu.onclick = function () {
                    if (bu.innerText == "关闭翻译") {
                        bu.innerText = "开启翻译";
                        back(document.body);
                        flag = 0;
                    } else {
                        bu.innerText = "关闭翻译";
                        flag = 1;
                    }
                    sessionStorage["translate"] = flag;
                }
                a.appendChild(bu);
            }
        }
        if (flag != 0) translate(document.body);
        cnt++;
        if (cnt == 1000) {
            // 网页启动时高频刷新，启动后 1 秒降低刷新频率，降低压力
            clearInterval(id);
            setInterval(main, 100);
        }
    }
    id = setInterval(main, 1);
})();