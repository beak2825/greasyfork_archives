// ==UserScript==
// @name         GitHub in Simplified Chinese
// @namespace    mailto:wangxinhe06@gmail.com
// @version      0.1
// @description  Convert GitHub.com to Simplified Chinese
// @author       汪心禾
// @match        https://github.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/393689/GitHub%20in%20Simplified%20Chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/393689/GitHub%20in%20Simplified%20Chinese.meta.js
// ==/UserScript==

/* LICENSE
MIT License

Copyright (c) 2019 汪心禾

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    var trans = [
        // `/**`
        ["body > div.js-header-wrapper > header > div.Header-item--full > div > div > form > label", "Search or jump to…", "搜索或跳转至……"],
        ["body > div.js-header-wrapper > header > div.Header-item--full > nav", "Pull requests", "拉取请求"],
        ["body > div.js-header-wrapper > header > div.Header-item--full > nav", "Issues", "议题"],
        // ["body > div.js-header-wrapper > header > div.Header-item--full > nav", "Marketplace", "Marketplace"],
        ["body > div.js-header-wrapper > header > div.Header-item--full > nav", "Explore", "探索"],

        ["body > div.application-main > div main > div.intro-shelf > div > div > h2", "Learn Git and GitHub without any code!", "不用任何代码学习 Git 和 GitHub！"],
        ["body > div.application-main > div main > div.intro-shelf > div > div > p", "Using the Hello World guide, you’ll create a repository, start a branch, write comments, and open a pull request.", "使用 Hello World 指南，您将创建一个仓库，编写注释，打开一个拉取请求。"],
        ["body > div.application-main > div main > div.intro-shelf > div > div > p", "Using the Hello World guide, you’ll start a branch, write comments, and open a pull request.", "使用 Hello World 指南，您将启动一个分支，编写注释，打开一个拉取请求。"],
        ["body > div.application-main > div main > div.intro-shelf > div > div > a.btn-primary", "Read the guide", "阅读该指南"],
        ["body > div.application-main > div main > div.intro-shelf > div > div > a:nth-child(4)", "Start a project", "开始一个项目"],

        ["form.starred > button", "Unstar", "取消星标"],
        ["form.unstarred > button", "Star", "星标"],
        ["form.follow, span.follow > form", "Follow", "关注"],
        ["form.unfollow, span.unfollow > form", "Unfollow", "取消关注"],

        ["time-ago, relative-time", "just now", "刚刚"],
        ["time-ago, relative-time", "seconds ago", "秒前"],
        ["time-ago, relative-time", /minutes? ago/, "分钟前"],
        ["time-ago, relative-time", /hours? ago/, "小时前"],
        ["time-ago, relative-time", "yesterday", "昨天"],
        ["time-ago, relative-time", "days ago", "天前"],
        ["time-ago, relative-time", "last month", "上个月"],
        ["time-ago, relative-time", "months ago", "个月前"],
        ["time-ago, relative-time", "last year", "去年"],
        ["time-ago, relative-time", "years ago", "年前"],

        // `/`
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.Details.js-repos-container > div > h2', "Repositories", "仓库"],
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.Details.js-repos-container > div > h2 > a', "New", "新建"],
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.Details.js-repos-container > div > div', "Find a repository…", "查找仓库……"],
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.Details.js-repos-container > div > form > button', "Show more", "显示更多"],
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.Details.js-repos-container > div > form > button', "Loading more…", "正在加载更多……"],
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.js-repos-container.user-repos > div > h2', "Your teams", "您的团队"],
        ['body > div.application-main > div > aside[aria-label="Account"] > div.dashboard-sidebar.js-sticky > div.js-repos-container.user-repos > div > p', "You don’t belong to any teams yet!", "您还不属于任何团队！"],
        ['body > div.application-main > div > aside[aria-label="Account"] > h2', "You don’t belong to any teams yet!", "您还不属于任何团队！"],
        ['body > div.application-main > div > aside[aria-label="Explore"] > h2', "Explore repositories", "探索仓库"],
        ['body > div.application-main > div > aside[aria-label="Explore"] > a', "Explore more →", "探索更多 →"],

        // `/*`
        ['#js-pjax-container > div > div[itemtype$="schema.org/Person"] > div:nth-child(2) > div:nth-child(2) > form > div > button.btn-primary', "Save", "保存"],
        ['#js-pjax-container > div > div[itemtype$="schema.org/Person"] > div:nth-child(2) > div:nth-child(2) > form > div > button.js-profile-editable-cancel', "Cancel", "取消"],
        ['#js-pjax-container > div > div[itemtype$="schema.org/Person"] > div:nth-child(2) > div:nth-child(2) > div > div.js-profile-editable-area > div > button', "Edit profile", "编辑个人资料"],
        ['#js-pjax-container > div > div[itemtype$="schema.org/Person"] > div:nth-child(2) > div:nth-child(2) > div > h2', "Organizations", "组织"],
        ['#js-pjax-container > div > div[itemtype$="schema.org/Person"] > div:nth-child(2) > div:nth-child(2) > div:nth-child(6) > div > details > summary', "Block or report user", "屏蔽或举报用户"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a:nth-child(1)", "Overview", "概述"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a:nth-child(2)", "Repositories", "仓库"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a:nth-child(3)", "Projects", "项目"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a:nth-child(4)", "Packages", "包"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a", "Stars", "星标"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a", "Followers", "关注者"],
        ["#js-pjax-container > div > div > div.user-profile-nav > nav > a", "Following", "正在关注"],
        ["#js-pjax-container > div > div > div > div:nth-child(1) > div > h2", "Pinned", "已嵌入"],
        ["#js-pjax-container > div > div > div > div:nth-child(1) > div > h2", "Popular repositories", "常用仓库"],
        ["#js-contribution-activity > h2", "Contribution activity", "贡献活动"],

        // `/*/*`
        ["#sponsor-button-repo", "Sponsor", "赞助"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > details > summary', "Used by", "被使用"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > details > div > div > div:nth-child(1) > div:nth-child(1) > span', "Used by", "被"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > details > div > div > div:nth-child(1) > div:nth-child(1) > a', "repositories", "个仓库使用"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > form > details > summary > span', "Watch", "关注"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > form > details > summary > span', "Unwatch", "取消关注"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > form > details > details-menu > div.select-menu-header > span', "Notifications", "通知"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > div > ul > li > details > summary', "Fork", "复刻"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > span:nth-child(1) > a > span[itemprop="name"]', "Code", "代码"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > span:nth-child(2) > a > span[itemprop="name"]', "Issues", "议题"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > span:nth-child(3) > a > span[itemprop="name"]', "Pull requests", "拉取请求"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > span:nth-child(4) > a', "Actions", "操作"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > a:nth-child(5)', "Projects", "项目"],
        // ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > a:nth-child(6)', "Wiki", "Wiki"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > a', "Security", "安全"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > a', "Insights", "洞察"],
        ['div[itemtype$="schema.org/SoftwareSourceCode"] > main > div.repohead > nav > a:nth-child(9)', "Settings", "设置"],
        ["#repo-meta-edit > summary > div > div > span.btn", "Edit", "编辑"],
        ["#repo-meta-edit > form > div:nth-child(4)", "Description", "描述"],
        ["#repo-meta-edit > form > div:nth-child(5)", "Website", "网址"],
        ["#repo-meta-edit > form > div > button.btn", "Save", "保存"],
        ["#repo-meta-edit > form > div.no-wrap", " or ", " 或 "],
        ["#repo-meta-edit > form > div > button.btn-link", "Cancel", "取消"],
        ["#topics-list-container > summary > div > span.btn-link", "Manage topics", "管理主题"],
        ["#topics-list-container > div > label", "Topics ", "主题"],
        ["#topics-list-container > div > label > span", "(separate with spaces)", "（以空格分隔）"],
        ["#topics-list-container > div > div > p", "Add topics to categorize your repository and make it more discoverable.", "添加主题以便归类您的仓库并使其更易于查找。"],
        ["#topics-list-container > div > div.topic-input-container > div > form > button", "Done", "完成"],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.overall-summary > ul > li.commits > a", /commits?/, "提交"],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.overall-summary > ul > li:nth-child(2) > a", /branch(es)?/, "分支"],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.overall-summary > ul > li:nth-child(3) > a", /packages?/, "包"],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.overall-summary > ul > li:nth-child(4) > a", /releases?/, "发行版"],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.overall-summary > ul > li:nth-child(5) > a", /contributors?/, "贡献者"],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.commit-tease > div", " and ", " 与 "],
        ["#js-repo-pjax-container > div.new-discussion-timeline > div > div.commit-tease > div:nth-child(3) > span:nth-child(2)", "Latest commit", "最后提交"],
    ]
    setInterval(function () {
        for (var i in trans) {
            try {
                $(trans[i][0]).each(function () {
                    if ($(this).html().search(trans[i][1]) >= 0) {
                        $(this).html($(this).html().replace(trans[i][1], trans[i][2]));
                    }
                });
            } catch(e) {
                // console.log(e);
            }
        }
    }, 0);
})();
