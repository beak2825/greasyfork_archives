// ==UserScript==
// @name           Yamibo Blacklist Enhanced
// @name:zh-CN     百合会黑名单增强
// @namespace      Tampermonkey Scripts
// @author         Nagisa_Cheese
// @description    在百合会论坛中屏蔽与相应用户有关的所有内容
// @match          http*://bbs.yamibo.com/*
// @grant          none
// @version        1.11
// @license        MIT
// @supportURL     https://bbs.yamibo.com/thread-520079-1-1.html
// @icon           https://bbs.yamibo.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/493265/Yamibo%20Blacklist%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/493265/Yamibo%20Blacklist%20Enhanced.meta.js
// ==/UserScript==

var ID = new Array("一个测试用户名A", "一个测试用户名B");    // 用户名屏蔽列表  备注: 如需屏蔽多人  按照 "用户名1","用户名2" 格式  注意请使用英文半角引号
var displaymessage = true;                  // 如不需要显示屏蔽提示   请将"true"改为"false"
var displayRecommendation = true;           // 如果需要屏蔽首页热点推荐，请将"true"改为"false"

// 判断是论坛版块页面
if (RegExp('forum(-\\d+){2}|mod=forumdisplay').test(document.URL)) {
    threads = document.querySelectorAll("td.by > cite > a[style]")
    for (var i in threads) {
        thread = threads[i]
        if (ID.includes(thread.innerText)) {
            scr = thread.closest("tr")
            if (displaymessage) {
                scr.innerHTML = "<tr><td class='icn'><img src='static/image/common/folder_common.gif' /></a></td><th class='common'><b>已屏蔽主题 " + "<font color=grey></th><td class='by'><cite><font color=grey>" + thread.innerText + "</font></cite></td><td class='num'></td><td class='by'></td></tr>";
            }
            else {
                scr.innerHTML = '<br />';
            }
        }
    }
    recentReplies = document.querySelectorAll("td.by > cite > a[c='1']")
    for (var i in recentReplies) {
        recentReply = recentReplies[i]
        if (ID.includes(recentReply.innerText)) {
            if (displaymessage) {
                recentReply.innerHTML = '<p><font color=grey>黑名单用户</font></p>';
            }
            else {
                recentReply.innerHTML = '<br />';
            }
        }
    }
}
// 判断是帖子页面
else if (RegExp('thread(-\\d+){3}|mod=viewthread').test(document.URL)) {
    posts = document.querySelectorAll("div.authi > a.xw1")
    for (var i in posts) {
        post = posts[i]
        if (ID.includes(post.innerText)) {
            scr = post.closest("table.plhin")
            if (displaymessage) {
                scr.innerHTML = '<br /><p>已屏蔽 <font color=grey>' + post.innerText + '</font> 的回复</p><br />';
            }
            else {
                scr.innerHTML = '<br />';
            }
        }
    }
    comments = document.querySelectorAll("div.pstl.xs1.cl a.xi2.xw1")
    for (var i in comments) {
        cmt = comments[i]
        if (ID.includes(cmt.innerText)) {
            tgt = cmt.closest("div.pstl.xs1.cl")
            if (displaymessage) {
                tgt.innerHTML = '<p>已屏蔽 <font color=grey>' + cmt.innerText + '</font> 的点评</p>';
            }
            else {
                tgt.innerHTML = '<br />';
            }
        }
    }
    scores = document.querySelectorAll("tr[id] td > a[target='_blank']")
    for (var i in scores) {
        score = scores[i]
        if (ID.includes(score.innerText)) {
            scr = score.closest("tr")
            if (displaymessage) {
                scr.innerHTML = '<tr><td></td><td></td><td class="xg1">已屏蔽 <font color=grey>' + score.innerText + '</font> 的加分</td></tr>';
            }
            else {
                scr.innerHTML = '<br />';
            }
        }
    }
    quotes = document.querySelectorAll("div.quote > blockquote > font > a[target='_blank'] > font")
    for (var i in quotes) {
        quote = quotes[i]
        username = quote.innerText.split(' ')[0]
        if (ID.includes(username)) {
            scr = quote.closest("blockquote")
            if (displaymessage) {
                scr.innerHTML = '<br /><p>已屏蔽引用 <font color=grey>' + username + '</font> 的回复</p><br />';
            }
            else {
                scr.innerHTML = '<br />';
            }
        }
    }
}
// 判断是 BLOG 页面
else if (RegExp('home.php').test(document.URL)) {
    blogs = document.querySelectorAll("div.cl > a[target='_blank']")
    for (var i in blogs) {
        blog = blogs[i]
        if (ID.includes(blog.innerText)) {
            tgt = blog.closest("dl.bbda.cl") === null ? blog.closest("div.cl") : blog.closest("div.cl")
            if (displaymessage) {
                tgt.innerHTML = '<p>已屏蔽 <font color=grey>' + blog.innerText + '</font> 的 BLOG</p>';
            }
            else {
                tgt.innerHTML = '<br />';
            }
        }
    }
}
// 判断是签到页面
else if (RegExp('id=zqlj_sign').test(document.URL)) {
    signIns = document.querySelectorAll("table.dt.mtm > tbody > tr > td a[target='_blank']")
    for (var i in signIns) {
        signIn = signIns[i]
        if (ID.includes(signIn.innerText)) {
            tgt = signIn
            if (displaymessage) {
                tgt.innerHTML = '<p><font color=grey>黑名单用户</font></p>';
            }
            else {
                tgt.innerHTML = '<br />';
            }
        }
    }
}
// 对论坛主页
else if (RegExp('https://bbs.yamibo.com(/forum.php|/index.php|)').test(document.URL)) {
    recentReplies = document.querySelectorAll("cite > a")
    for (var i in recentReplies) {
        recentReply = recentReplies[i]
        if (ID.includes(recentReply.innerText)) {
            if (displaymessage) {
                recentReply.innerHTML = '<p><font color=grey>黑名单用户</font></p>';
            }
            else {
                recentReply.innerHTML = '<br />';
            }
        }
    }
    newMembers = document.querySelectorAll("p > em")
    for (var i in newMembers) {
        newMember = newMembers[i]
        if (ID.includes(newMember.innerText)) {
            if (displaymessage) {
                newMember.innerHTML = '<font color=grey>黑名单用户</font>';
            }
            else {
                newMember.innerHTML = '<br />';
            }
        }
    }
    if (!displayRecommendation) {
        titles = document.querySelectorAll("div.tit > h2")
        for (var i in titles) {
            title = titles[i]
            if (title.innerText == "热点推荐") {
                while (title.className != "listbox") {
                    title = title.parentElement
                }
                title.innerHTML = ""
            }
        }
    }
}
