// ==UserScript==
// @name         记录上次查看时间
// @version      0.7.6
// @match        https://www.mcbbs.net/*
// @author       xmdhs
// @license MIT
// @description  记录上次查看时间。
// @namespace    https://xmdhs.top
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/idb-keyval/6.1.0/umd.min.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/420491/%E8%AE%B0%E5%BD%95%E4%B8%8A%E6%AC%A1%E6%9F%A5%E7%9C%8B%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/420491/%E8%AE%B0%E5%BD%95%E4%B8%8A%E6%AC%A1%E6%9F%A5%E7%9C%8B%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(async function () {
    let tid = document.querySelector("#postlist .plc a[href^='forum.php?mod=viewthread&action=printable']")
    const customStore = idbKeyval.createStore('lastview-db-name', 'lastview-store-name');
    const replies = document.querySelectorAll("a[id^=postnum]")
    let data = localStorage.getItem("lastview")
    if (data) {
        let o = JSON.parse(data)
        for (const key in o) {
            await idbKeyval.set(String(key), String(o[key]), customStore)
        }
        localStorage.removeItem("lastview")
    }
    try {
        let temp = new URLSearchParams(tid.href)
        tid = temp.get("tid")
    } catch (error) { console.debug(error); }
    if (tid > 0) {
        const last = replies[replies.length - 1]
        const lastPid = new URLSearchParams(last.href).get("pid")
        const idbKv = await idbKeyval.get(tid, customStore)
        let sava = true
        if (idbKv) {
            const oldPid = new URLSearchParams(idbKv?.href).get("pid")
            if (Number(oldPid) > Number(lastPid)) {
                sava = false
            }
        }
        if (sava) {
            idbKeyval.set(String(tid), {
                time: String(new Date().getTime()),
                href: last.href || "",
            }, customStore)
        }
    } else {
        const dl = document.querySelectorAll("tbody[id^='normalthread_'")
        for (const d of dl) {
            const dom = d.querySelector(".xst")
            let link = dom["href"]
            if (!link) {
                continue
            }
            let tid = link.match(/thread-([0-9]{1,10})-1-[0-9]{1,10}.html/)
            let atime
            let idbKv
            if (tid != null && tid.length >= 2) {
                tid = tid[1]
                idbKv = await idbKeyval.get(tid, customStore)
            } else {
                let b = new URLSearchParams(link)
                tid = b.get("tid")
                if (tid != "") {
                    idbKv = await idbKeyval.get(tid, customStore)
                }
            }
            if (!idbKv) continue
            let href
            if (typeof idbKv == 'string') {
                atime = Number(idbKv)
            } else {
                atime = Number(idbKv.time)
                href = idbKv.href
            }
            let lastTime;
            const tDom = d.querySelector("td.by > em > a > span[title]")
            if (tDom) {
                lastTime = Date.parse(tDom["title"])
            } else {
                lastTime = Date.parse(d.querySelector("td.by > em > a").textContent)
            }
            if (atime > 0) {
                let d = document.createElement("span")
                d.textContent = `[${diffTime(new Date(atime), new Date())}]`
                d.style.fontWeight = "bolder"
                if (lastTime > atime) {
                    d.style.color = "red"
                    d.addEventListener('click', (e) => {
                        e.preventDefault()
                        if (href) {
                            window.open(href, "_blank")
                        } else {
                            window.open(`forum.php?mod=redirect&tid=${tid}&goto=lastpost#lastpost`, "_blank")
                        }
                        d.style.color = ""
                    })
                }
                dom.insertBefore(d, dom.firstChild)
            }
        }
    }

    const lastViewClean = async (s = 2592000000) => {
        const keys = await idbKeyval.keys(customStore)
        const t = new Date().getTime() - s
        for (const k of keys) {
            const v = await idbKeyval.get(k, customStore)
            if (Number(v) < t) {
                await idbKeyval.del(k, customStore)
            }
        }
    }
    GM_registerMenuCommand("清理储存的记录", () => {
        let day = prompt("天数", 30)
        if (day == null) {
            return
        }
        if (isNaN(Number(day))) {
            alert("必须是数字")
        }
        day = day * 24 * 60 * 60 * 1000
        lastViewClean(day)
    })
})();

// https://www.jianshu.com/p/bdda96a1dcd8
function diffTime(startDate, endDate) {
    var diff = endDate.getTime() - startDate;//.getTime();//时间差的毫秒数

    //计算出相差天数
    var days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数
    var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);

    var returnStr = seconds + "秒前";
    if (minutes > 0) {
        returnStr = minutes + "分钟前";//+ returnStr;
    }
    if (hours > 0) {
        returnStr = hours + "小时前";// + returnStr;
    }
    if (days > 0) {
        returnStr = days + "天前";//+ returnStr;
    }
    return returnStr;
}