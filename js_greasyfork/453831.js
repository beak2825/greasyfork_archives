// ==UserScript==
// @name         test-bot
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  For testing only
// @antifeature  miner
// @author       Sloan
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/v/topic/detail?topic_id=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      bilibili.com
// @connect      gitee.com
// @downloadURL https://update.greasyfork.org/scripts/453831/test-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/453831/test-bot.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var s_wlist, s_blist, keyword, csrf
    const topic_id = "36153"
    function getCookie() {
        var obj = new RegExp(/(?<=_jct=).+?(?=; )/)
        var cookie = document.cookie
        csrf = cookie.match(obj)[0]
    }
    function sleep(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    function fget() {
        GM_xmlhttpRequest({
            url: 'https://gitee.com/str1ngn/ink/raw/master/blist.json',
            method: "GET",
            onload: function (data) {
                var json = JSON.parse(data.responseText);
                GM_setValue('zerolist', json ?? []);
            }
        });
        var wlist = GM_getValue('zerolist');
        s_wlist = new Set(wlist);
        //
        GM_xmlhttpRequest({
            url: 'https://gitee.com/str1ngn/ink/raw/master/wlist.json',
            method: "GET",
            onload: function (data) {
                var json = JSON.parse(data.responseText);
                GM_setValue('onelist', json ?? []);
            }
        });
        var blist = GM_getValue('onelist');
        s_blist = new Set(blist);
        //
        GM_xmlhttpRequest({
            url: 'https://gitee.com/s3csima/test/raw/master/sensitive.txt',
            method: "GET",
            onload: function (data) {
                var text = data.responseText;
                GM_setValue('sensitive', text ?? "");
            }
        });
        keyword = new RegExp("锟斤拷烫烫烫屯屯屯锘锘锘|" + GM_getValue('sensitive'));
    }
    //
    fget();
    try { getCookie() }
    catch { console.log("首次获取cookie失败") }
    var reg1 = new RegExp("https://www.bilibili.com/v/topic/.*")
    var reg2 = new RegExp("https://t.bilibili.com/[0-9].*")
    var url = window.location.href;
    function Gopatrol() {
        function getDetails() {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    url: `https://app.bilibili.com/x/topic/web/details/cards?topic_id=${topic_id}&sort_by=3&offset=&page_size=100&source=Web`,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    onload: function (data) {
                        var json = JSON.parse(data.responseText)
                        var items = json.data.topic_card_list.items
                        resolve(items)
                    }
                })
            })
        }
        function check(items) {
            return new Promise(resolve => {
                var aimlist = []
                for (let x of items) {
                    var id_str = x.dynamic_card_item.id_str
                    var mid = x.dynamic_card_item.modules.module_author.mid
                    var username = x.dynamic_card_item.modules.module_author.name
                    try { var text = x.dynamic_card_item.modules.module_dynamic.desc.text }
                    catch { text = "wronggggggggggggggg" }
                    if (s_blist.has(mid) && !s_wlist.has(mid) || username.match(keyword) || text.match(keyword)) {
                        aimlist.push(id_str)
                    }
                }
                resolve(aimlist)
            })
        }
        function report(id_str, csrf) {
            if (typeof id_str != typeof "hello") {
                id_str = String(id_str)
            }
            GM_xmlhttpRequest({
                url: "https://app.bilibili.com/x/topic/resource/report",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: 'topic_id=' + topic_id + '&res_type=0&res_id_str=' + id_str + '&reason=话题不相关&csrf=' + csrf,
                onload: function (resp) {
                    var json = JSON.parse(resp.responseText)
                    if (json.code == 0) {
                        GM_xmlhttpRequest({
                            url: "https://app.bilibili.com/x/topic/resource/report",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            data: 'topic_id=' + topic_id + '&res_type=0&res_id_str=' + id_str + '&reason=引战&csrf=' + csrf,
                            onload: function (resp) {
                                var back = JSON.parse(resp.responseText)
                                if (back.code == 0) {
                                    console.log("清理成功√")
                                }
                                else {
                                    console.log("不明原因失败")
                                }
                            }
                        })
                    }
                    else {
                        console.log("不明原因失败")
                    }
                }
            })
        }
        async function main() {
            fget()
            try { getCookie() }
            catch { return }
            await sleep(50)
            var items = await getDetails()
            var aimlist = await check(items)
            for (let x of aimlist) {
                report(x, csrf)
                await sleep(50)
            }
            await sleep(2000)
            if (aimlist.length == 0 || items.length != 0) {
                console.log("世 界 和 平")
            }
            else {
                console.log(`已图图${aimlist.length}个不明动态`)
            }
            aimlist = []
        }
        main()
    }
    if (url.match(reg1)) {
        (function () {
            var r = 0;
            var rate = [30, 50, 70, 90, 100]
            function refresh() {
                count = 0;
                location.reload();
            }
            function repeat() {
                count = 0;
                var tags = document.querySelectorAll("a[class='switch-tab__tab-text']")
                tags[0].click();
                setTimeout(function () {
                    tags = document.querySelectorAll("a[class='switch-tab__tab-text']")
                    tags[1].click();
                }, 1000)
            }
            function re() {
                if (r == rate[Math.floor(Math.random() * 5)]) {
                    r = 0;
                    refresh();
                }
                else {
                    repeat();
                }
            }
            let count = 0;
            let tim = 0;
            setInterval(() => {
                let aff = document.querySelectorAll(".switch-tab__tab-text")
                if (aff[2].className != "switch-tab__tab-text selected") { aff[2].click() }
                let b = document.querySelector("div[class='bili-dyn-time']");
                if (!b) {
                    r++;
                    re();
                } else {
                    let t = document.createElement('button')
                    t.textContent = 'checked'
                    b.setAttribute('class', 'filtered')
                    b.appendChild(t)
                    if (b) {
                        let followBtn = b.parentNode.querySelector("div[class='bili-dyn-item__following']");
                        if (followBtn) {
                            count++
                            tim++
                            let uid_s = followBtn.getAttribute("data-mid")
                            let uid_n = parseInt(uid_s)
                            try {
                                var text = b.parentNode.parentNode.querySelector(".bili-rich-text__content").innerText
                            }
                            catch {
                                text = "wrongggg"
                            }
                            let name = b.parentNode.querySelector(".bili-dyn-title__text").innerText
                            if (s_blist.has(uid_n) && !s_wlist.has(uid_n) || text.match(keyword) || name.match(keyword)) {
                                console.log(followBtn.getAttribute("data-mid"))
                                let reportBtn = b.parentNode.querySelector("div[class='bili-dyn-item__more'] > div[class='bili-dyn-more__btn tp'] > div[class='bili-popover'] > div[class='bili-dyn-more__menu'] > div[class='bili-dyn-more__menu__item']");
                                if (reportBtn) {
                                    reportBtn.click();
                                    setTimeout(function () {
                                        var biliPopup = document.querySelectorAll("div[class='bili-popup']");
                                        var reportLabel = biliPopup[biliPopup.length - 1].querySelectorAll("div[class='bili-dyn-report__option']")[1];
                                        var yz = reportLabel.getElementsByClassName('bili-radio--medium')[0];
                                        yz.click();
                                        setTimeout(function () {
                                            var confirmBtn = biliPopup[biliPopup.length - 1].querySelector("button[class='bili-dyn-report__button confirm']");
                                            confirmBtn.click();
                                            setTimeout(function () {
                                                var cancelBtn = biliPopup[biliPopup.length - 1].querySelector("button[class='bili-dyn-report__button cancel']");
                                                if (cancelBtn) { cancelBtn.click(); }
                                            }, 500)
                                        }, 500)
                                    }, 500)
                                }
                            }
                            if (count >= 20) {
                                r++;
                                re();
                            }
                            if (tim >= 200) {
                                fget();
                                tim = 0;
                            }
                        }
                    } else {
                        refresh();
                    }
                }
            }, 3000);
        })();
    }
    else if (url.match(reg2)) {
        (function () {
            var rate = [20, 25, 30, 35, 40]
            function newsort() {
                count = 0;
                times++;
                var tag1 = document.querySelector(".hot-sort")
                tag1.click();
                setTimeout(function () {
                    var tag2 = document.querySelector(".new-sort")
                    tag2.click()
                }, 400)
            }
            function rrandom() {
                switch (Math.floor(Math.random() * 5)) {
                    case 0:
                        return "#r15";
                    case 1:
                        return "#r8";
                    case 2:
                        return "#r11";
                    case 3:
                        return "#r13";
                    case 4:
                        return "#r15";
                }
            }
            let count = 0;
            let times = 0;
            setInterval(() => {
                let b = document.querySelector(".user");
                if (!b) {
                    newsort();
                } else {
                    let t = document.createElement('button')
                    t.textContent = 'checked'
                    b.setAttribute('class', 'filtered')
                    b.appendChild(t)
                    let middle = b.querySelector(".name");
                    var text = b.parentNode.querySelector(".text");
                    if (!text) { text = b.parentNode.querySelector(".text-con"); }
                    var txt = text.innerText
                    var name = b.parentNode.querySelector(".name").innerText
                    if (middle) {
                        count++;
                        let uids = middle.getAttribute("data-usercard-mid")
                        let uidn = parseInt(uids)
                        var like = b.parentNode.parentNode.querySelector(".like");
                        if (s_wlist.has(uidn) && !txt.match(keyword) && !name.match(keyword)) {
                            var afi = rrandom();
                            if (afi == "#r15") {
                                if (like.className != "like liked") { like.click(); }
                            }
                        }
                        if (s_blist.has(uidn) && !s_wlist.has(uidn) || txt.match(keyword) || name.match(keyword)) {
                            console.log(middle.getAttribute("data-usercard-mid"));
                            var hate = b.parentNode.parentNode.querySelector(".hate");
                            if (hate.className != "hate hated") { hate.click(); }
                            let report = b.parentNode.parentNode.querySelector(".report");
                            if (report) {
                                report.click();
                                let sp = document.querySelector(rrandom());
                                setTimeout(function () {
                                    sp.click();
                                    setTimeout(function () {
                                        var confirm = document.querySelector(".btn-submit");
                                        confirm.click();
                                        setTimeout(function () {
                                            var cancel = document.querySelector(".btn-cancel");
                                            if (cancel) { cancel.click(); }
                                        }, 100)
                                    }, 500)
                                }, 400)
                            }
                        }
                        if ((count + 5) % 5 == 0) {
                            Gopatrol();
                        }
                        if (count >= 60) {
                            newsort();
                        }
                        if (times == rate[Math.floor(Math.random() * 5)]) {
                            times = 0;
                            location.reload();
                        }
                    }
                }
            }, 2000);
        })();
    }
    else {
        return 0;
    }
})();