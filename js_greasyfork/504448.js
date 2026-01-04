// ==UserScript==
// @name         vjudge 汉化
// @namespace    http://vjudge.net/
// @version      0.1
// @description  vjudge 汉化脚本
// @license      MIT
// @author       xiezheyuan
// @match        https://vjudge.net/*
// @match        https://vjudge.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504448/vjudge%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/504448/vjudge%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

const vjudge_chinese = (function () {
    'use strict';
    const $$ = (selector) => document.querySelector(selector);
    const update = (selector, content) => {
        let data = document.querySelectorAll(selector);
        for (let i = 0; i < data.length; i++) {
            data[i].innerHTML = content;
        }
    };

    const translate = (selector, replacement, value) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 深度优先搜索所有子节点
            function dfs(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // 如果是文本节点，则替换文本
                    node.textContent = node.textContent.replace(new RegExp(replacement, 'g'), value);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // 如果是元素节点，则递归处理其子节点
                    Array.from(node.childNodes).forEach(dfs);
                }
            }

            // 从当前元素开始深度优先搜索
            dfs(element);
        });
    };

    // 顶部导航栏
    // Home
    translate("#navbarResponsive > a", "Home", "主页");
    // Problem
    update("#nav-problem > a", "题目");
    // Status
    update("#nav-status > a", "状态");
    // Contest
    update("#nav-contest > a", "比赛");
    // Workbook
    update("#nav-workbook > a", "题单");
    // User
    update("#nav-user > a", "用户");
    // Group
    update("#nav-group > a", "团队");
    // Forum
    update("#nav-comment > a", "论坛"); // pay attention to "comment"
    // Logout
    update("a.logout", "登出");
    // Login
    update("a.login", "登录");
    // Register
    update("a.register", "注册");
    // Profile
    update("#navbarResponsive > ul > li.nav-item.dropdown.float-xs-right > div > a:nth-child(1)", "个人信息");
    // Update
    update("#navbarResponsive > ul > li.nav-item.dropdown.float-xs-right > div > a:nth-child(2)", "修改信息");
    // Message
    update("#navbarResponsive > ul > li.nav-item.dropdown.float-xs-right > div > a:nth-child(3)", "私信");

    // 登录界面

    // Login
    translate("#loginModalLabel", "Login", "登录");
    // Forget Password
    translate("#btn-forget-password", "Forget Password", "忘记密码");
    // Login
    translate("#btn-login", "Login", "登录");
    // Username or Email
    if($$("#login-username") != null){
        $$("#login-username").setAttribute("placeholder", "用户名或邮箱");
    }
    // Password
    if($$("#login-password") != null){
        $$("#login-password").setAttribute("placeholder", "密码");
    }

    // 主页面 vjudge 介绍
    update("#index-intro > div > div.col-md-8 > p", "Virtual Judge 不是传统的 OJ，而是从其他传统 OJ 中抓取题目，然后模拟提交这些题目。这主要用于在不具备数据的情况下举办比赛。<br/><br/>现在，Virtual Judge 支持以下 OJ 平台：");

    // 主页面 Service Status
    translate("#ojs > div:nth-child(3) > a", "Service status", "服务器状态");

    // 所有界面的 Feedback
    $$("#img-support").setAttribute("title", "反馈");

    // 题目检索页面的左侧菜单栏
    // All
    translate("#prob-category > a:nth-child(1)", "All", "全部");
    // Solved
    translate("#prob-category > a:nth-child(2)", "Solved", "已通过");
    // Attempted
    translate("#prob-category > a:nth-child(3)", "Attempted", "尝试过");
    // Favorites
    translate("#prob-category > a:nth-child(4)", "Favorites", "收藏夹");

    // 题目检索页面的分页
    // Previous
    // update("#listProblem_previous > a", "上一页");
    // // Next
    // update("#listProblem_next > a", "下一页");
    // Filter
    if (document.getElementById("filter") != null) {
        $$("#filter").setAttribute("value", "筛选");
    }
    // Reset
    if (document.getElementById("reset") != null) {
        $$("#reset").setAttribute("value", "重置");
    }

    // 比赛页面的进度
    // Start
    update("#time-info > div:nth-child(1) > div.col-xs-3.text-xs-left > b", "开始时间");
    // End
    update("#time-info > div:nth-child(1) > div.col-xs-3.text-xs-right > b", "结束时间");
    // Remaining
    translate("#info-remaining > b", "Remaining", "剩余时间");

    // 比赛页面的标签页
    // Overview
    translate("#contest-tabs > li:nth-child(1) > a", "Overview", "概述");
    // Problem
    translate("#contest-tabs > li:nth-child(2) > a", "Problem", "题目");
    // Status
    translate("#contest-tabs > li:nth-child(3) > a", "Status", "状态");
    // Rank
    translate("#contest-tabs > li:nth-child(4) > a", "Rank", "排名");
    // Comments
    translate("#contest-tabs > li:nth-child(5) > a", "Comments", "评论");
    // Setting
    translate("#btn-setting", "Setting", "设置");

    // 题目通用的 tag
    // Solved
    translate("span.tag-success", "Solved", "已通过");
    // Attempted
    translate("span.tag-warning", "Attempted", "尝试过");

    // 题目通用的提交相关
    // Submit
    translate("#problem-submit", "Submit", "提交");
    // Status
    translate("#btn-contest-status", "Status", "状态");
    // My Status
    translate("#btn-contest-my-status", "My Status", "我的状态");
    // Translate
    translate("#btn-contest-translate", "Translate", "Google 翻译");
    // Time limit
    translate("dt.col-sm-4", "Time limit", "时间限制");
    // Mem limit
    translate("dt.col-sm-4", "Mem limit", "内存限制");
    // Problem
    translate("#prob-2 > label", "Problem", "题目");
    // Problem
    translate("#prob-1 > label", "Problem", "题目");
    // Open
    translate("#open-row > label", "Open", "公开");
    // Submit by
    translate("#submitter-type-row > label", "Submit by", "提交方式");
    // My Account
    translate("#submitter-type > label.btn.btn-secondary", "My Account", "我的账号");
    // Archive
    translate("#submitter-type > label.btn.btn-secondary", "Archive", "归档");
    // Account
    translate("#my-account-row > label", "Account", "账号");
    // Update
    translate("#my-account-row > div > a", "Update", "更新");
    // Language
    translate("#language-row > label", "Language", "语言");
    // Solution
    translate("#solution-row > label", "Solution", "代码");
    // Cancel
    translate("button.btn.btn-secondary", "Cancel", "取消");
    // Submit
    translate("#btn-submit", "Submit", "提交");
    // Submit
    translate("#submitModalLabel", "Submit", "提交");
    // Verify My Account
    translate("#confirm-title", "Verify My Account", "验证账号");
    // Confirm
    translate("#btn-confirm", "Confirm", "确认");
    // Type
    translate("#confirm-body > table > thead > tr > th:nth-child(1)", "Type", "类型");
    // Domain
    translate("#confirm-body > table > thead > tr > th:nth-child(2)", "Domain", "域名");
    // Name
    translate("#confirm-body > table > thead > tr > th:nth-child(3)", "Name", "名称");
    // Value
    translate("#confirm-body > table > thead > tr > th:nth-child(4)", "Value", "值");
    // More tips
    translate("#confirm-body > div > a:nth-child(6)", "More tips", "更多提示 (English)");
    // More tips
    translate("#my-account-tip > a:nth-child(8)", "More tips", "更多提示 (English)");
    // Source code should contain 20 characters at least
    translate("#submit-alert", "Source code should contain 20 characters at least", "代码至少包含 20 个字符");
    // At least 20 characters
    if ($$("#submit-solution") != null) {
        $$("#submit-solution").setAttribute("placeholder", "至少 20 个字符");
    }

    // 题目左侧控制面板

    // Submissions
    translate("#prob-operation > div > div:nth-child(2) > div:nth-child(1) > a", "Submissions", "提交记录");
    // Leaderboard
    translate("#btn-leader-board", "Leaderboard", "排行榜");
    // Recrawl
    translate("#prob-operation > div > div:nth-child(3) > div:nth-child(1) > a", "Recrawl", "重新爬取");
    // Translation
    translate("#prob-operation > div > div:nth-child(3) > div:nth-child(2) > a", "Translation", "ChatGPT 翻译");
    // Source
    translate("dt.col-sm-4", "Source", "来源");
    // Author
    translate("dt.col-sm-4", "Author", "作者");
    // Tags
    translate("dt.col-sm-4", "Tags", "标签");
    // Difficulty
    translate("dt.col-sm-4", "Difficulty", "难度");
    // Spoilers
    translate("dt.col-sm-4", "Spoilers", "剧透");
    // Input file
    translate("dt.col-sm-4", "Input file", "输入文件");
    // Output file
    translate("dt.col-sm-4", "Output file", "输出文件");
    // Editorial
    translate("dt.col-sm-4", "Editorial", "题解");
    // Users
    translate("dt.col-sm-4", "Users", "用户");
    // Hide
    translate("a.toggle-problem-spoiler", "Hide", "隐藏");
    // Show
    translate("a.toggle-problem-spoiler", "Show", "显示");
    // System Crawler
    translate("a.author", "System Crawler", "系统爬虫");
    // GPT Translation
    translate("#gptTranslateModal > div > div > div.modal-header > h4", "GPT Translation", "ChatGPT 翻译");

    // GPT Translation

    // Language
    translate("#gpt-translate-target-lang > label", "Language", "语言");
    // Translate
    translate("#btn-request-translate", "Translate", "翻译");
    // Problem
    translate("th", "Problem", "题目");
    // Language
    translate("th", "Language", "语言");
    // Requested
    translate("th", "Requested", "请求时间");
    // Cost
    translate("th", "Cost", "耗时");
    // Status
    translate("th", "Status", "状态");
    // Already in target language
    translate("#gpt-translate-message", "Already in target language", "原题面即为目标语言");
    // Translation complete.
    translate("#gpt-translate-message", "Translation complete.", "翻译完成。");
    // Take a look
    translate("#gpt-translate-message > a", "Take a look", "查看结果");
    // Translation requested. Please stand by.
    translate("#gpt-translate-message", "Translation requested. Please stand by.", "翻译请求已发送，请稍候。");

    // Leaderboard 对话框

    // Rank
    translate("th", "Rank", "排名");
    // Username
    translate("th", "Username", "用户名");
    translate("th", "User name", "用户名");
    // User
    translate("th", "User", "用户");
    // Update Time
    translate("th", "Update Time", "更新时间");
    // Begin Time
    translate("th", "Begin Time", "开始时间");
    // Source
    translate("th", "Source", "来源");
    // Solved
    translate("th", "Solved", "通过");
    // Title
    translate("th", "Title", "名称");
    // No matching records found
    translate("td.dataTables_empty", "No matching records found", "没有找到匹配的记录");
    // Submit Time
    translate("th", "Submit Time", "提交时间");
    // Time
    translate("th", "Time", "耗时");
    // Memory
    translate("th", "Memory", "内存");
    // Mem
    translate("th", "Mem", "内存");
    // Length
    if (window.location.href.includes("contest")) {
        translate("th", "Length", "时长");
    }
    else {
        translate("th", "Length", "长度");
    }
    // Leaderboard
    translate("#leaderBoardModalLabel", "Leaderboard", "排行榜");
    // // Previous
    // translate("#leaderboard_table_previous", "Previous", "上一页");
    // // Next
    // translate("#leaderboard_table_next", "Next", "下一页");

    // 提交记录

    // Lang
    translate("th", "Lang", "语言");
    // Result
    translate("th", "Result", "结果");
    // Prob
    translate("th", "Prob", "题目");
    // // Previous
    // translate("#listStatus_previous", "Previous", "上一页");
    // // Next
    // translate("#listStatus_next", "Next", "下一页");
    // All
    translate("#status-owner > a.list-group-item", "All", "全部");
    // Mine
    translate("#status-owner > a.list-group-item", "Mine", "我的");
    // Followed
    translate("#status-owner > a.list-group-item", "Followed", "关注");

    // 提交记录展示对话框

    // Submitted
    translate("th", "Submitted", "提交时间");
    // RemoteRunId
    translate("th", "RemoteRunId", "远程 OJ 返回编号");

    // 通用评论组件

    document.querySelectorAll("div.comment-edit > textarea").forEach((ele) => {
        ele.setAttribute("placeholder", "支持 Markdown 语法");
    });

    // Preview
    translate("div.comment-edit > div.preview > span", "Preview", "预览");
    // Clear
    translate("div.comment-edit > div.preview > div.buttons > button.btn.btn-secondary.cancel", "Clear", "清空");
    // Post
    translate("div.comment-edit > div.preview > div.buttons > button.btn.btn-secondary.post", "Post", "发布");
    // Save
    translate("div.comment-edit > div.preview > div.buttons > button.btn.btn-primary.save", "Save", "保存");
    // Post & Broadcast
    translate("div.comment-edit > div.preview > div.buttons > button.btn.btn-primary.post.broadcast", "Post & Broadcast", "发布并广播");

    // 比赛页面

    // // Previous
    // translate("#listContest_previous", "Previous", "上一页");
    // // Next
    // translate("#listContest_next", "Next", "下一页");
    // Statistic
    translate("#btn-statistic", "Statistic", "统计");
    // Create Contest
    if ($$("#btn-create") != null) {
        $$("#btn-create").setAttribute("value", "创建比赛");
    }
    // Owner
    translate("th", "Owner", "创建者");
    // Password
    translate("#contest-login-form > div > div > div.modal-body > div > label", "Password", "密码");
    // Login
    translate("#btn-contest-login", "Login", "登录");
    // Password is not correct!
    translate("#contest-login-alert", "Password is not correct!", "密码错误！");
    // Please login with your account first
    translate("#contest-login-alert", "Please login with your account first", "请先登录！");
    // Elapsed
    translate("#info-elapsed > b", "Elapsed", "已用时");
    // Running
    translate("#info-running", "Running", "进行中");
    // Ended
    translate("#info-running", "Ended", "已结束");
    // All
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div.contest-running.list-group.col-xs-4.col-lg-12 > a:nth-child(1)", "All", "全部");
    // Scheduled
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div.contest-running.list-group.col-xs-4.col-lg-12 > a:nth-child(2)", "Scheduled", "计划中");
    // Running
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div.contest-running.list-group.col-xs-4.col-lg-12 > a:nth-child(3)", "Running", "进行中");
    // Ended
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div.contest-running.list-group.col-xs-4.col-lg-12 > a:nth-child(4)", "Ended", "已结束");
    // All Contests
    translate("#my-contest-panel > a:nth-child(1)", "All Contests", "全部比赛");
    // Public Contests
    translate("#my-contest-panel > a:nth-child(2)", "Public Contests", "公开比赛");
    // My Contests
    translate("#my-contest-panel > a:nth-child(3)", "My Contests", "我的比赛");
    // My Participation
    translate("#my-contest-panel > a:nth-child(4)", "My Participation", "我参与的");
    // My Arrangement
    translate("#my-contest-panel > a:nth-child(5)", "My Arrangement", "我安排的");
    // My Group
    translate("#my-contest-panel > a:nth-child(6)", "My Group", "我团队的");
    // My Favorites
    translate("#my-contest-panel > a:nth-child(7)", "My Favorites", "我收藏的");
    // My Follow
    translate("#my-contest-panel > a:nth-child(8)", "My Follow", "我关注的");
    // Classical
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div:nth-child(3) > a:nth-child(1)", "Classical", "经典赛事");
    // Group
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div:nth-child(3) > a:nth-child(2)", "Group", "团队赛事");
    // Replay
    translate("body > div.container-fluid > div > div.col-xs-12.col-lg-2 > div:nth-child(3) > a:nth-child(3)", "Replay", "重现赛事");
    // Private
    translate("#contest-manager > span", "Private", "私有赛事");
    // Run ID
    translate("th", "Run ID", "提交编号");

    // 个人信息

    // 24 hours
    translate("th", "24 hours", "24 小时");
    // 7 days
    translate("th", "7 days", "7 天");
    // 30 days
    translate("th", "30 days", "30 天");
    // Overall solved
    translate("th", "Overall solved", "总解决");
    // Overall attempted
    translate("th", "Overall attempted", "总尝试");
    // Detail
    translate("th", "Detail", "详情");
    // Export
    translate("th", "Export", "导出");
    // Toggle
    translate("a.toggle-detail", "Toggle", "隐藏 / 显示");
    // Attempted
    translate("th", "Attempted", "尝试");
    // Register
    translate(".user-info > dt.col-sm-3", "Register", "注册时间");
    // Last seen
    translate(".user-info > dt.col-sm-3", "Last seen", "最后登录");
    // School
    translate(".user-info > dt.col-sm-3", "School", "学校");
    // Email
    translate(".user-info > dt.col-sm-3", "Email", "邮箱");
    // View
    translate("th", "View", "访问");
    // Like
    translate("th", "Like", "点赞");
    // Date
    translate("th", "Date", "日期");
    // Articles
    translate("body > div.container > div:nth-child(7) > div > div > h5", "Articles", "文章");

    // 用户信息修改

    // Update
    translate("#updateModalLabel", "Update", "修改信息");
    // Username
    translate("#update-form > div > div:nth-child(1) > div:nth-child(1) > label", "Username", "用户名");
    // Original Password
    translate("#update-form > div > div:nth-child(1) > div:nth-child(2) > label", "Original", "原");
    translate("#update-form > div > div:nth-child(1) > div:nth-child(2) > label", "Password", "密码");
    // Password
    translate("#update-form > div > div:nth-child(1) > div:nth-child(3) > label", "Password", "新密码");
    // Repeat Password
    translate("#update-form > div > div:nth-child(1) > div:nth-child(4) > label", "Repeat Password", "重复新密码");
    // Nickname
    translate("#update-form > div > div:nth-child(1) > div:nth-child(5) > label", "Nickname", "昵称");
    // School
    translate("#update-form > div > div:nth-child(1) > div:nth-child(6) > label", "School", "学校");
    // Email
    translate("#update-form > div > div:nth-child(1) > div:nth-child(8) > label", "Email", "邮箱");
    // Captcha
    translate("#update-form > div > div:nth-child(1) > div:nth-child(9) > label", "Captcha", "验证码");
    // Introduction
    translate("#update-form > div > div:nth-child(2) > div > label", "Introduction", "简介");
    // Update
    translate("#btn-update-profile", "Update", "修改");

    // 私信
    // Show older
    translate(".show-older-conversation", "Show older", "显示更多");

    // Please compose in Markdown. Be polite, and don't discuss sensitive content, including password, politics, etc.
    if($$("#reply-content") != null){
        $$("#reply-content").setAttribute("placeholder", "可以使用 Markdown 语法，请保持文明，不要讨论敏感内容，如密码，正治等。");
    }

    // Send
    translate("body > div.container-fluid > div > div.col-md-9 > table > tbody > tr > td.send", "Send", "发送");

    // 注册界面
    // Register
    translate("#registerModalLabel", "Register", "注册");
    // Username
    translate("#register-form > div:nth-child(1) > label", "Username", "用户名");
    // Password
    translate("#register-form > div:nth-child(2) > label", "Password", "密码");
    // Repeat Pass
    translate("#register-form > div:nth-child(3) > label", "Repeat Pass", "重复密码");
    // Nickname
    translate("#register-form > div:nth-child(4) > label", "Nickname", "昵称");
    // School
    translate("#register-form > div:nth-child(5) > label", "School", "学校");
    // Email
    translate("#register-form > div:nth-child(7) > label", "Email", "邮箱");
    // Captcha
    translate("#register-form > div:nth-child(8) > label", "Captcha", "验证码");
    // Introduction
    translate("#register-form > div:nth-child(9) > label", "Introduction", "简介");
    // Register
    translate("#btn-register", "Register", "注册");
    // Repeat password above
    if($$("#register-repeat-password") != null){
        $$("#register-repeat-password").setAttribute("placeholder", "重复上面的密码");
    }
    // Invisible to others. Please fill a real one. You need it after you forget the password.
    if($$("#register-email") != null){
        $$("#register-email").setAttribute("placeholder", "邮箱对其他用户不可见。请填写一个真实邮箱，以帮助您找回密码。");
    }
    // Your brief introduction in Markdown
    if($$("#register-introduction") != null){
        $$("#register-introduction").setAttribute("placeholder", "使用 Markdown 语法介绍自己。");
    }

    // Workbook

    // I Joined
    translate("#prob-category > a:nth-child(2)", "I Joined", "我加入的");
    // I Created
    translate("#prob-category > a:nth-child(3)", "I Created", "我创建的");
    // Active
    translate("th", "Active", "活跃");
    // Joined
    translate("th", "Joined", "参加");
    // Author
    translate("th", "Author", "作者");
    // Create
    if(window.location.href.includes("workbook")){
        translate("#btn-create", "Create", "创建");
    }

    if($$("#article-title") != null){
        $$("#article-title").setAttribute("placeholder", "文章标题");
    }
    // Private
    translate("#edit-article-form > div:nth-child(1) > div:nth-child(2) > div > label:nth-child(1)", "Private", "私有");
    // Unlistable
    translate("#edit-article-form > div:nth-child(1) > div:nth-child(2) > div > label:nth-child(2)", "Unlistable", "列表不显示");
    // Unlistabale （注意这里有一个typo）
    translate("#edit-article-form > div:nth-child(1) > div:nth-child(2) > div > label", "Unlistabale", "列表不显示");
    // Broadcast
    translate("#edit-article-form > div:nth-child(1) > div:nth-child(2) > div > label:nth-child(3)", "Broadcast", "广播");
    // Title mustn't be blank
    translate("#edit-article-alert", "Title mustn't be blank", "标题不能为空");
    // Confirm
    translate("#confirm-title", "Confirm", "确认");
    // Are you sure to delete this article ?
    translate("#confirm-body", "Are you sure to delete this article ?", "确定删除此文章？");
    // workbook
    translate(".workbook-tag", "workbook", "题单");
    // Unlistable
    translate(".unlistable-tag", "Unlistable", "列表不显示");
    // Private
    translate(".private-tag", "Private", "私有");
    // Broadcast
    translate(".broadcast-tag", "Broadcast", "广播");
    // Tag View
    translate("#article-container > div > div.right-panel.col-md-9 > div:nth-child(1) > div:nth-child(1) > span:nth-child(6) > div > label:nth-child(1)", "Tag View", "标签视图");
    // Mixed View
    translate("#article-container > div > div.right-panel.col-md-9 > div:nth-child(1) > div:nth-child(1) > span:nth-child(6) > div > label:nth-child(2)", "Mixed View", "混合视图");
    // Table View
    translate("#article-container > div > div.right-panel.col-md-9 > div:nth-child(1) > div:nth-child(1) > span:nth-child(6) > div > label:nth-child(3)", "Table View", "表格视图");
    // Leave
    translate(".btn-leave", "Leave", "退出");
    // Origin
    translate("th", "Origin", "原题号");
    // Note
    translate("th", "Note", "备注");
    // Active Participants
    translate("#article-container > div > div.left-panel.col-md-3 > div.list-group.hidden-sm-down.member-category > a:nth-child(1)", "Active Participants", "活跃参与者");
    // All Participants
    translate("#article-container > div > div.left-panel.col-md-3 > div.list-group.hidden-sm-down.member-category > a:nth-child(2)", "All Participants", "所有参与者");
    // Myself
    translate("#article-container > div > div.left-panel.col-md-3 > div.list-group.hidden-sm-down.member-category > a:nth-child(3)", "Myself", "我自己");
    // Followed
    translate("#article-container > div > div.left-panel.col-md-3 > div.list-group.hidden-sm-down.member-category > a:nth-child(4)", "Followed", "我关注的");
    // Search
    translate("#DataTables_Table_0_filter > label", "Search", "搜索");
    // Join
    translate(".btn-join", "Join", "加入");
    // Previous
    translate(".previous.paginate_button", "Previous", "上一页");
    // Next
    translate(".next.paginate_button", "Next", "下一页");
    // Update time
    translate("th", "Update time", "更新时间");
    // Show
    translate(".dataTables_length", "Show", "展示");
    // entries
    translate(".dataTables_length", "entries", "项");

    // 用户
    // Nickname
    translate("th", "Nickname", "昵称");
    // School
    translate("th", "School", "学校");
    // Att
    translate("th", "Att", "尝试");
    // All
    translate("#left-panel > div > a:nth-child(1)", "All", "全部");
    // Followed
    translate("#left-panel > div > a:nth-child(2)", "Followed", "我关注的");

    // Grouop
    
    // My Invitation
    translate("#my-invitations-li", "My Invitation", "我的邀请");
    // My Group
    translate("#group-tabs > li:nth-child(2)", "My Groups", "我的团队");
    // Explore
    translate("#group-tabs > li:nth-child(3)", "Explore", "发现");
    // Create Group
    translate("#btn-create-group", "Create Group", "创建团队");
    if($$("#search-group-name") != null){
        $$("#search-group-name").setAttribute("placeholder", "通过团队名称搜索");
    }
    // Search
    translate("#btn-search-group", "Search", "搜索");
    // Apply join
    translate("#group-oprts > div > a", "Apply join", "申请加入");
    // Contests
    translate("#contests-anchor", "Contests", "比赛");
    // Members
    translate("#members-anchor", "Members", "成员");
    // Leader
    translate(".tag-warning", "Leader", "团主");
    // Manager
    translate(".tag-info", "Manager", "管理员");
    // Member
    translate(".tag-default", "Member", "成员");
    // Join
    translate("th", "Join", "加入");
    // Nick name
    translate("th", "Nick name", "昵称");
    // Role
    translate("th", "Role", "角色");
    // Visibility
    translate("li.list-group-item", "Visibility", "可见性");
    // Public
    translate("li.list-group-item", "Public", "公开");
    // Private
    translate("li.list-group-item", "Private", "私有");
    // Join policy
    translate("li.list-group-item", "Join policy", "加入策略");
    // Invitation & Application
    translate("li.list-group-item", "Invitation & Application", "邀请或申请");
    // Invitation only
    translate("li.list-group-item", "Invitation only", "仅邀请");
    // Free join
    translate("li.list-group-item", "Free join", "自由加入");
    // Leader
    translate("li.list-group-item", "Leader", "团主");
    // Manager
    translate("li.list-group-item", "Managers", "管理员");
    // Members
    translate("li.list-group-item", "Members", "成员");
    // Contests
    translate("li.list-group-item", "Contests", "比赛");
    // Create Time
    translate("li.list-group-item", "Create Time", "创建时间");
    // My name
    translate("li.list-group-item", "My name", "我的昵称");
    // Featured Articles
    translate("#featured-articles-anchor", "Featured Articles", "精选文章");
    // Leave
    translate(".btn-danger.kick-out", "Leave", "退出");
    // Change you name
    translate("#confirm-title", "Change you name", "修改你的昵称");
    // Your new name in group
    translate("#confirm-body", "Your new name in group", "你的新昵称");
    // Invite
    translate("a.invite", "Invite", "邀请");
    // Update
    translate("a.update-group", "Update", "更新");
    // Arrange Contest
    translate("a.create-group-contest", "Arrange Contest", "安排比赛");
    // Invite
    translate("#confirm-title", "Invite", "邀请");
    // Input userNames of invitees. Separate by white spaces
    if($$("#invitees") != null){
        $$("#invitees").setAttribute("placeholder", "输入邀请对象，用空格分隔");
    }
    // Update group
    translate("#createGroupModalLabel", "Update group", "更新团队");
    // Create Group
    translate("#createGroupModalLabel", "Create Group", "创建团队");
    // Group name
    translate("#create-group-form > div:nth-child(1) > label", "Group name", "团队名称");
    // Short name
    translate("#create-group-form > div:nth-child(2) > label", "Short name", "简称");
    // Visibility
    translate("#create-group-form > div:nth-child(3) > label", "Visibility", "可见性");
    // Join policy
    translate("#create-group-form > div:nth-child(4) > label", "Join policy", "加入策略");
    // Contest coordinator
    translate("#create-group-form > div:nth-child(5) > label", "Contest coordinator", "比赛管理员");
    // Brief
    translate("#create-group-form > div:nth-child(6) > label", "Brief", "简介");
    // Introduction
    translate("#create-group-form > div:nth-child(7) > label", "Introduction", "介绍");
    // Private
    translate("#group-visibility > label.btn.btn-secondary", "Private", "私有");
    // Public
    translate("#group-visibility > label.btn.btn-secondary", "Public", "公开");
    // Invite only
    translate("#group-join-policy > label.btn.btn-secondary", "Invite only", "仅邀请");
    // Apply & Approve
    translate("#group-join-policy > label.btn.btn-secondary", "Apply & Approve", "申请 & 审批");
    // Free
    translate("#group-join-policy > label.btn.btn-secondary", "Free", "自由加入");
    // All members
    translate("#group-arrange-contest-policy > label", "All members", "所有成员");
    // Leader & Managers
    translate("#group-arrange-contest-policy > label", "Leader & Managers", "团主 & 管理员");
    // Leader
    translate("#group-arrange-contest-policy > label", "Leader", "团主");
    // Plain
    translate("#group-intro-format > label:nth-child(3)", "Plain", "纯文本");
    // Join now
    translate("a.join", "Join now", "立即加入");
    // Statistics
    translate("group-contest-stat", "Statistics", "统计");
    // Stat
    translate("th", "Stat", "统计");
    // New groups
    translate("#explore-groups > div:nth-child(3) > div > h4", "New groups", "新团队");
    // Edit
    translate("a.edit-articles", "Edit", "编辑");
    // Featured Articles
    translate("#confirm-title", "Featured Articles", "精选文章");
    // Input ID of featured articles. Separate by white spaces
    if($$("#article-ids") != null){
        $$("#article-ids").setAttribute("placeholder", "输入精选文章ID，用空格分隔");
    }


    // 比赛相关
    // Solve
    translate("th", "Solve", "解决");
    // Penalty
    translate("th", "Penalty", "罚时");
    // Contest Ids (you can use any separator)
    if($$("body > form > textarea[name=cids]") != null && window.location.href.includes("statistic")){
        $$("body > form > textarea[name=cids]").setAttribute("placeholder", "输入比赛ID，可用任何分隔符分隔");
    }
    // Create Contest
    translate("#editContestModalLabel", "Create Contest", "创建比赛");
    // Basic Info
    translate("#panel-info", "Basic Info", "基本信息");
    // Wgt.
    translate("th", "Wgt.", "权重");
    // Alias
    translate("th", "Alias", "别名");
    // Type
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div:nth-child(1) > label", "Type", "类型");
    // Openness
    translate("#contest-openness-group > label", "Openness", "开放性");
    // Title
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div:nth-child(5) > label", "Title", "标题");
    // Begin Time
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div:nth-child(6) > label", "Begin Time", "开始时间");
    // Length
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div:nth-child(7) > label", "Length", "时长");
    // History Rank
    translate("#contest-time-machine-group > label", "History Rank", "历史排名");
    // Rank Rule
    translate("#contest-rank-rule-group > label", "Rank Rule", "排名规则");
    // Total penalty
    translate("#contest-sum-time-group > label", "Total penalty", "总罚时");
    // Penalty
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div.rank-rule > div:nth-child(2) > label", "Penalty", "罚时");
    // Partial Score
    translate("#contest-partial-score-group > label", "Partial Score", "部分分");
    // Peer Status
    translate("#contest-show-peers-group > label", "Peer Status", "成员状态");
    // Personal Account
    translate("#contest-manual-submit-group > label", "Personal Account", "个人账号");
    // Announcement
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div:nth-child(13) > label", "Announcement", "公告");
    // Description
    translate("#editContestModal > div > div > div.modal-body > div:nth-child(2) > div:nth-child(14) > label", "Description", "描述");
    // Problem Set
    translate("#panel-problems", "Problem Set", "题目");
    // Classical Contest
    translate("#contest-type > label.btn.btn-secondary", "Classical Contest", "传统赛事");
    // Group Contest
    translate("#contest-type > label.btn.btn-secondary", "Group Contest", "团队赛事");
    // Replay
    translate("#contest-type > label.btn.btn-secondary", "Replay", "重放赛事");
    // Public - any one can see and submit
    translate("#contest-openness > option:nth-child(1)", "Public - any one can see and submit", "公开 - 任意用户可查看和提交");
    // Protected - any one can see, but only users knowing contest password can submit
    translate("#contest-openness > option:nth-child(2)", "Protected - any one can see, but only users knowing contest password can submit", "保护 - 任意用户可查看，但只有知道密码的用户可提交");
    // Private - only users knowing contest password can see and submit
    translate("#contest-openness > option:nth-child(3)", "Private - only users knowing contest password can see and submit", "私有 - 只有知道密码的用户可查看和提交");
    // Password
    translate("#contest-password-group > label", "Password", "密码");
    // Group
    translate("#contest-group-group > label", "Group", "团队");
    // Public - any one can see and submit
    translate("#contest-openness > option:nth-child(1)", "Public - any one can see and submit", "公开 - 任意用户可查看和提交");
    // Protected - any one can see, but only group members can submit
    translate("#contest-openness > option:nth-child(2)", "Protected - any one can see, but only group members can submit", "保护 - 任意用户可查看，但只有团队成员可提交");
    // Private - only group members can see and submit
    translate("#contest-openness > option:nth-child(3)", "Private - only group members can see and submit", "私有 - 只有团队成员可查看和提交");
    // Add a problem
    translate("#addBtn > i", "Add a problem", "添加题目");
    // No such problem
    translate("#addTable > tbody > tr.cp_row.real > td:nth-child(7) > span", "No such problem", "没有该题目");
    // Select OJ
    translate(".modal-title", "Select OJ", "选择 OJ");
    // Clone
    translate("#btn-clone", "Clone", "克隆");
    // Update
    translate("#btn-update", "Update", "更新");
    // Delete
    translate("#btn-delete", "Delete", "删除");
    // Display
    translate("#contest-time-machine > label.btn.btn-secondary", "Display", "显示");
    // Hide until contest ends
    translate("#contest-time-machine > label.btn.btn-secondary", "Hide until contest ends", "隐藏直到比赛结束");
    // Standard ICPC
    translate("#contest-rank-rule > label.btn.btn-secondary", "Standard ICPC", "标准 ICPC 赛制");
    // Customized
    translate("#contest-rank-rule > label.btn.btn-secondary", "Customized", "自定义");
    // Latest
    translate("#contest-sum-time > label", "Latest", "最新");
    // Sum
    translate("#contest-sum-time > label", "Sum", "总和");
    // Disable
    translate("#contest-partial-score > label.btn.btn-secondary", "Disable", "禁用");
    // Enable
    translate("#contest-partial-score > label.btn.btn-secondary", "Enable", "启用");
    // Hide
    translate("#contest-show-peers > label.btn.btn-secondary", "Hide", "隐藏");
    // Display
    translate("#contest-show-peers > label.btn.btn-secondary", "Display", "显示");
    // Allow If Necessary
    translate("#contest-manual-submit > label.btn.btn-secondary", "Allow If Necessary", "必要时允许");
    // Free Usage
    translate("#contest-manual-submit > label.btn.btn-secondary", "Free Usage", "自由使用");
    // Replay Info
    translate("#panel-replay", "Replay Info", "重放信息");
    // Clone Contest
    translate("#editContestModalLabel", "Clone Contest", "克隆赛事");
    // Open
    translate("th", "Open", "公开");
    // Share text
    translate("th", "Share text", "共享代码");
    // Link
    translate(".share-text > a", "Link", "链接");

    // 论坛
    // Comments
    translate("th", "Comments", "评论");
    // Last by
    translate("th", "Last by", "最后动态");
    // New Discuss
    translate("#btn-post", "New Discuss", "新讨论");
    // All
    translate("#comment_category > div:nth-child(1) > a.list-group-item", "All", "全部");
    // Article
    translate("#comment_category > div:nth-child(1) > a.list-group-item", "Article", "文章");
    // Problem
    translate("#comment_category > div:nth-child(1) > a.list-group-item", "Problem", "题目");
    // Source
    translate("#comment_category > div:nth-child(1) > a.list-group-item", "Source", "来源");
    // Contest
    translate("#comment_category > div:nth-child(1) > a.list-group-item", "Contest", "赛事");
    // Starred
    translate("#comment_category > div:nth-child(2) > a:nth-child(1)", "Starred", "收藏");
    // Involved
    translate("#comment_category > div:nth-child(2) > a:nth-child(2)", "Involved", "参与");
    // Adhoc
    translate("#comment_category > div:nth-child(2) > a:nth-child(3)", "Adhoc", "自选");
    // Google Group
    translate("#comment_category > div:nth-child(2) > a:nth-child(4)", "Google Group", "Google 群组");
    // Top
    translate(".tag-default", "Top", "置顶");
    // Edit
    translate("a.edit", "Edit", "编辑");
    // Delete
    translate("a.delete", "Delete", "删除");
    // Reply
    translate("a.reply", "Reply", "回复");
    // Spam
    translate("a.toggle-spam", "Spam", "标记为垃圾");
});

// 页面加载后执行
window.onload = vjudge_chinese;
// 定时执行
setInterval(vjudge_chinese, 1000);
