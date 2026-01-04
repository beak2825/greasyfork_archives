// ==UserScript==
// @name         小宇宙一键反黑
// @namespace    https://www.weibo.com/timeline4arthur
// @version      0.4.4
// @description  try to take over the world!
// @author       timeline4arthur
// @match        https://m.weibo.cn/detail/*
// @match        https://m.weibo.cn/status/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/396468/%E5%B0%8F%E5%AE%87%E5%AE%99%E4%B8%80%E9%94%AE%E5%8F%8D%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/396468/%E5%B0%8F%E5%AE%87%E5%AE%99%E4%B8%80%E9%94%AE%E5%8F%8D%E9%BB%91.meta.js
// ==/UserScript==

/*
1 垃圾营销
	102 广告信息 @ 我   108 其他广告    101 卖粉丝认证
2 涉黄信息
	201 售卖色情资源	202 低俗信息	203 招嫖信息	204 色情图文	205 侵害未成年人	206 色情视频
5 不实信息
	501 社会时事	502 食品安全	503 不在以上分类	504 冒充新闻当事人
6 人身攻击
	601 人身攻击我	602 地域攻击
8 有害信息
	801 暴恐血腥	802 宗教民族问题	803 侮辱英烈	804 其他有害信息
9 内容抄袭
	901 抄袭我的内容	902 盗用我的原发图	903 盗用我的视频
15 违法信息
	1501 涉枪爆刀	1502 毒品	1503 赌博	1504 假证假票	1505 其他违禁品	1506 售卖考试答案	1507 售卖个人信息
22 诈骗信息
    2202 网络兼职诈骗	2203 票务诈骗	2205 虚假链接诈骗	2206 投注返钱诈骗	2207 不在以上类型
27 恶意营销
    2701 引战   2702    无资质采编
*/

(function () {
    'use strict';

    // Your code here...
    let uid = 6416499365;
    let spamData = [];
    let categories = [];
    let status_rid = -1;

    let init = function () {
        //retrive click timestamp
        const regex = /[0-9]{10,}/;
        const rid = regex.exec(window.location.href);
        if (rid[0]) {
            status_rid = rid[0];
            const clickTime = GM_getValue(status_rid, 0);
            if (clickTime > 0 && status_rid > 0) {
                document.getElementById("report-spam-btn").innerHTML = new Date(clickTime).toLocaleString();
            }
        }

        //sso session
        const lastTime = GM_getValue("sso", 0);
        const now = new Date().getTime();
        if (now > lastTime + 1000 * 60 * 60) {
            GM_openInTab("https://service.account.weibo.com/myexposures", true);
            GM_setValue("sso", now);
        }
        console.log("last sso", lastTime, "now", now);

        //categrories
        let html = document.querySelector("div.weibo-text").innerHTML;
        const innerHTML = html;
        categories = [];
        while (html.indexOf("【") > -1) {
            const n1 = html.indexOf("【");
            const n2 = html.indexOf("】");
            const category = html.substring(n1 + 1, n2);

            categories.push({ pos: innerHTML.indexOf(category), name: category });

            html = html.substring(n2 + 1);
        }
        console.log(categories);

        //spam links
        spamData = [];
        const links = document.querySelector("div.weibo-text").getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
            if (links[i].href.indexOf("service.account.weibo.com/reportspam") > -1) {
                const n = innerHTML.indexOf(links[i].href.replace(/&/g, '&amp;'));
                let category = "未知分类";
                for (let j = 0; j < categories.length; j++) {
                    if (categories[j].pos < n) {
                        category = categories[j].name;
                    }
                }
                const regex = /[0-9]{10,}/;
                const rid = regex.exec(links[i].href);
                if (rid[0]) spamData.push({ name: category, pos: n, rid: rid[0], url: links[i] });
            }
        }
        console.log(spamData);
        if (spamData.length == 0) document.getElementById("report-spam-btn").disabled = true;
        else document.getElementById("report-spam-btn").disabled = false;
    }

    let reportSpams = function () {
        doGet(spamData, 0);
        document.getElementById("report-spam-btn").disabled = true;
    }

    const doNext = function (type, list, n) {
        if (type === "GET") {
            if (n == list.length - 1) {
                //console.log(list);
                if (status_rid > 0) GM_setValue(status_rid, new Date().getTime());
                console.log("GET finished.");
                //setTimeout(() => { doPost(list, 0) }, (Math.floor(Math.random() * 2) + 2) * 1000);
            } else {
                setTimeout(() => { doGet(list, n + 1) }, (Math.floor(Math.random() * 2) + 2) * 1000);
            }
        } else {
            if (n < list.length)
                setTimeout(() => { doPost(list, n) }, (Math.floor(Math.random() * 2) + 2) * 1000);
        }
    }
    let parser = new DOMParser();
    let doGet = function (list, n) {
        const spam = list[n];
        const url = spam.url.href;
        const span = spam.url.querySelector("span.surl-text");
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                console.log(n, response.status, spam.name, url);

                const responseDoc = parser.parseFromString(response.responseText, "text/html");
                const infobox = responseDoc.querySelector("p.module-infobox");
                let txt = "not available";
                if (infobox) txt = infobox.innerText;
                else {
                    const modinfo = responseDoc.querySelector("span.mod-info");
                    if (modinfo) txt = modinfo.innerText;
                }
                span.innerText = txt.replace(/^\s+|\s+$/g, '');

                let href = "";
                if (spam.rid.length > 10) href = "https://m.weibo.cn/detail/" + spam.rid;
                else href = "https://m.weibo.cn/u/" + spam.rid;
                const alink = '<a id="' + spam.rid + '" href="' + href + '">' + spam.rid + '🚫</a>'
                spam.url.outerHTML = alink + spam.url.outerHTML;
                spam.extra_data = responseDoc.getElementById("extra_data").value;
                spam.mweibo = span.innerText;

                doNext("POST", list, n);
            }
        });
    }

    const tags = [
        { tag: "有害信息", data: "category=8&tag_id=804&" },
        { tag: "其他广告", data: "category=1&tag_id=108&" },
        { tag: "低俗信息", data: "category=2&tag_id=202&" },
        { tag: "不实信息", data: "category=5&tag_id=503&" },
        { tag: "引战",     data: "category=27&tag_id=2701&" },
        { tag: "垃圾yx-其他", data: "category=1&tag_id=108&" },
    ];
    let doPost = function (list, n) {
        const spam = list[n];
        const extra_data = spam.extra_data;
        const alink = document.getElementById(spam.rid);
        const postURL = "https://service.account.weibo.com/aj/reportspamobile?__rnd=" + new Date().getTime();
        const refURL = spam.url.href;

        let tagData = "";
        tags.forEach(t => { if (spam.name.indexOf(t.tag) > -1) { tagData = t.data; } })
        const postData = tagData + extra_data + "&appGet=0&weiboGet=0&blackUser=0&_t=0";
        if (tagData.length == 0) {
            alink.innerText = "🈲分类无法识别🈲" + spam.name + "🚫" + alink.innerText;
        }
        if (tagData.length == 0 || postData.indexOf(spam.rid) == -1 || (spam.mweibo && spam.mweibo.length < 5)) {
            console.log(n, "skiped...", spam.name, postData, spam.mweibo);
            doNext("GET", list, n);
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: postURL,
            data: postData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://service.account.weibo.com",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": refURL
            },
            onload: function (response) {
                console.log(n, response.status, spam.name, postURL, postData);
                console.log(JSON.stringify(JSON.parse(response.responseText)));
                alink.innerText = JSON.parse(response.responseText).msg + "🚫" + alink.innerText;

                doNext("GET", list, n);
            }
        });
    }

    let addFunction = function () {
        let head_tag = document.querySelector("div.m-text-box");
        if (!head_tag) return;
        let a_tag = head_tag.getElementsByTagName("a")[0];
        if (!a_tag) return;
        let href = a_tag.href;
        console.log(href);
        if (href.indexOf(uid) == -1) return;
        let btn = document.createElement("BUTTON");
        btn.innerHTML = "反黑内容预览&举报（拉黑需手动）";
        btn.id = "report-spam-btn";
        btn.addEventListener('click', reportSpams);
        head_tag.appendChild(btn);

        init();
    }

    const injectDom = function () {
        console.log("spam injectDom");
        if (document.querySelector("div.m-text-box")) {
            setTimeout(addFunction, 1000);
        } else {
            setTimeout(injectDom, 1000);
        }
    }
    injectDom();

    window.addEventListener("load", () => {
        //firefox does not always work.
        console.log("spam load");
    });
})();
