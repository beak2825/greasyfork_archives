"use strict";
// ==UserScript==
// @name         问答管理
// @version      0.5.1
// @match        https://www.mcbbs.net/forum.php?mod=viewthread&tid=*
// @match        https://www.mcbbs.net/thread-*.html
// @match        https://www.mcbbs.net/forum.php?mod=modcp&action=report*
// @author       xmdhs
// @description  问答管理。
// @namespace    xmdhs
// @homepageURl  https://gist.github.com/xmdhs/fc18fd53327a0ee7b31a5c35f3038111
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447668/%E9%97%AE%E7%AD%94%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/447668/%E9%97%AE%E7%AD%94%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==
(async function () {
    try {
        if (location.href.startsWith("https://www.mcbbs.net/forum.php?mod=viewthread&tid=") ||
            location.href.startsWith("https://www.mcbbs.net/thread-")) {
            threadDo();
        }
        if (location.href.startsWith("https://www.mcbbs.net/forum.php?mod=modcp&action=report")) {
            await reportMod();
        }
    }
    catch (e) {
        console.warn(e);
        alert(e);
    }
})();
const wthis = (window.unsafeWindow || window);
function threadDo() {
    const editUrl = document.querySelector("a.editp");
    if (!editUrl || !(editUrl instanceof HTMLAnchorElement))
        return;
    const sp = new URL(editUrl.href).searchParams;
    const tid = sp.get("tid");
    const fid = sp.get("fid");
    if (tid == null || (fid != "1566" && fid != "110" && fid != "266" && fid != "431" && fid != "265"))
        return;
    outData();
    const dl = [];
    const pidList = [];
    const om = new Map();
    document.querySelectorAll("div[id^=post_]").forEach(d => {
        var _a;
        d.querySelectorAll("div.pob.cl > p > a").forEach(dom => {
            if (dom.textContent != "评分")
                return;
            dl.push(dom);
        });
        const pid = Number((_a = d.getAttribute("id")) === null || _a === void 0 ? void 0 : _a.replace("post_", ""));
        if (isNaN(pid))
            return;
        pidList.push({
            pid: Number(pid),
            dom: d,
        });
        editlog(d, pid, om);
    });
    pidList.sort((a, b) => a.pid - b.pid);
    pidList.forEach((v, i) => {
        const d = v.dom.querySelector("a[id^=postnum]");
        if (!d)
            return;
        d.textContent = `${i + 1} 楼`;
    });
    const akrate = document.querySelector("#ak_rate");
    if (akrate)
        dl.push(akrate);
    dl.forEach(dom => {
        dom.addEventListener("click", async () => {
            try {
                await pulsRate(tid, fid)();
            }
            catch (e) {
                console.warn(e);
                alert(e);
            }
        });
    });
    window.addEventListener('load', () => {
        panel();
    });
}
// 标记超过时效
function outData() {
    const l = document.querySelectorAll("em[id^=authorposton]");
    const timeReg = /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/;
    const nowUNIX = new Date().getTime();
    for (const v of Array.from(l)) {
        if (!v.textContent)
            throw new Error("textContent == null");
        const rl = timeReg.exec(v.textContent);
        rl === null || rl === void 0 ? void 0 : rl.forEach(s => {
            const t = Date.parse(s);
            if ((nowUNIX - t) > 15552000000) {
                v.style.color = "red";
                v.style.fontWeight = "bolder";
                v.textContent = `发表于 ${s} (超过追溯期)`;
            }
        });
    }
}
// 检查是否已解决
function checkFinish() {
    const d = document.querySelector("div.rwdn > p > button > span");
    if ((d === null || d === void 0 ? void 0 : d.textContent) == "​我来回答​") {
        return false;
    }
    return true;
}
// 评分界面增加删帖和发卡选项
function pulsRate(tid, fid) {
    const f = async () => {
        const p = new Promise((r) => {
            const o = new MutationObserver((_, o) => {
                let d = document.querySelector("#rateform > p");
                if (d && d instanceof HTMLElement) {
                    o.disconnect();
                    r(d);
                }
            });
            const dom = document.querySelector("body");
            if (!dom) {
                r(null);
                return;
            }
            o.observe(dom, { childList: true, subtree: true });
        });
        const d = await p;
        if (!d)
            throw new Error("d == null");
        const attr = d.getAttribute("qamod");
        if (attr == "has")
            return;
        d.setAttribute("qamod", "has");
        const sendreasonpm = document.querySelector("input#sendreasonpm");
        sendreasonpm.checked = true;
        const crimerecordlabel = document.createElement("label");
        crimerecordlabel.innerHTML = `<input type="checkbox" class="pc" id="crimerecordlabel">违规登记 `;
        const dellabel = document.createElement("label");
        dellabel.innerHTML = `<input type="checkbox" class="pc" id="delpost">删帖 `;
        const warnlabel = document.createElement("label");
        warnlabel.innerHTML = `<input type="checkbox" class="pc" id="warnpost">发卡 `;
        const beforDom = document.querySelector("#rateform > p > label[for=sendreasonpm]");
        d.insertBefore(crimerecordlabel, beforDom);
        d.insertBefore(dellabel, beforDom);
        d.insertBefore(warnlabel, beforDom);
        addUsage();
        const buttonDom = document.querySelector("#rateform > p > button[name=ratesubmit]");
        buttonDom.addEventListener("click", async (d) => {
            d.preventDefault();
            d.stopImmediatePropagation();
            try {
                const reasonDom = document.querySelector("input#reason");
                const formhashDom = document.querySelector(`input[name=formhash]`);
                const pidDom = document.querySelector(`input[name=pid]`);
                const sp = sendreasonpm.checked;
                const reason = reasonDom.value;
                const formhash = formhashDom.value;
                const pid = pidDom.value;
                const il = document.querySelectorAll("input[id^=score]");
                let scores = [];
                for (const v of Array.from(il)) {
                    scores.push({
                        "name": v.id,
                        "value": v.value
                    });
                }
                if (reason == "") {
                    wthis.showError("需要操作理由");
                    return;
                }
                const needWarn = document.querySelector("input#warnpost").checked;
                const needDel = document.querySelector("input#delpost").checked;
                const needcrimerecord = document.querySelector("input#crimerecordlabel").checked;
                let rate = false;
                for (const v of scores) {
                    if (v.value != "0") {
                        rate = true;
                        break;
                    }
                }
                if (rate) {
                    await ratePost(tid, pid, formhash, reason, scores, sp);
                }
                if (needWarn) {
                    await warnPost(tid, pid, fid, formhash, reason, sp);
                }
                if (needDel) {
                    await delPost(tid, pid, fid, formhash, reason, needcrimerecord, sp);
                }
                wthis.ajaxget(`forum.php?mod=viewthread&tid=${tid}&viewpid=${pid}`, `post_${pid}`, `post_${pid}`);
            }
            catch (e) {
                wthis.showError(String(e));
                console.warn(e);
            }
            finally {
                wthis.hideWindow('rate');
            }
        });
    };
    return f;
}
// 发卡
async function warnPost(tid, pid, fid, formhash, reason, sendreasonpm) {
    await _action("warn", tid, pid, fid, formhash, reason, false, sendreasonpm);
}
// 删帖
async function delPost(tid, pid, fid, formhash, reason, crimerecord = false, sendreasonpm) {
    await _action("delpost", tid, pid, fid, formhash, reason, crimerecord, sendreasonpm);
}
async function _action(action, tid, pid, fid, formhash, reason, crimerecord = false, sendreasonpm) {
    const q = new URLSearchParams(`page=1&handlekey=mods&warned=1`);
    q.set("formhash", formhash);
    q.set("fid", fid);
    q.set("tid", tid);
    q.set("topiclist[]", pid);
    q.set("reason", reason);
    if (sendreasonpm) {
        q.set("sendreasonpm", "on");
    }
    if (crimerecord) {
        q.set("crimerecord", "on");
    }
    const r = await fetch(`https://www.mcbbs.net/forum.php?mod=topicadmin&action=${action}&modsubmit=yes&infloat=yes&modclick=yes&inajax=1`, {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
        },
        "referrer": "https://www.mcbbs.net/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": q,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    if (r.status != 200) {
        throw new Error(String(r.status));
    }
}
// 评分
async function ratePost(tid, pid, formhash, reason, scores, sendreasonpm) {
    const q = new URLSearchParams(`referer=https%3A%2F%2Fwww.mcbbs.net%2Fforum.php&handlekey=rate`);
    q.set("formhash", formhash);
    q.set("tid", tid);
    q.set("pid", pid);
    q.set("reason", reason);
    if (sendreasonpm) {
        q.set("sendreasonpm", "on");
    }
    for (const v of scores) {
        q.set(v.name, v.value);
    }
    const r = await fetch("https://www.mcbbs.net/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
        },
        "referrer": "https://www.mcbbs.net/forum.php?mod=viewthread&tid=1360703&page=1",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": q,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    if (r.status != 200) {
        throw new Error(String(r.status));
    }
}
// 增加常见操作
async function addUsage() {
    const rselectDom = document.querySelector("#reasonselect");
    if (!rselectDom)
        return;
    rselectDom.querySelectorAll("li").forEach(v => v.remove());
    for (const v of reasonList) {
        const liDom = document.createElement("li");
        liDom.textContent = v.reason;
        liDom.addEventListener("click", () => {
            const rDom = document.querySelector("input#reason");
            rDom.value = v.reason;
            const warnPost = document.querySelector("input#warnpost");
            warnPost.checked = false;
            const delDom = document.querySelector("input#delpost");
            delDom.checked = false;
            document.querySelectorAll("input[id^=score]").forEach(v => {
                v.value = "0";
            });
            v.do();
        });
        liDom.addEventListener("mouseover", () => liDom.classList.add("xi2", "cur1"));
        liDom.addEventListener("mouseout", () => liDom.classList.remove("xi2", "cur1"));
        liDom.style.cursor = "pointer";
        rselectDom.appendChild(liDom);
    }
}
const reasonList = [
    {
        "reason": "无意义 / 无帮助",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "请勿灌水",
        "do": () => {
            const s1 = document.querySelector("input#score1");
            s1.value = "-1";
            const s2 = document.querySelector("input#score2");
            s2.value = "-20";
            const w = document.querySelector("input#warnpost");
            w.checked = true;
            const d = document.querySelector("input#delpost");
            d.checked = true;
        }
    },
    {
        "reason": "如需补充请在主楼编辑",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "错版",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "请勿自顶",
        "do": () => {
            const w = document.querySelector("input#warnpost");
            w.checked = true;
        }
    },
    {
        "reason": "审题",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "超长文本未折叠",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "无意义标题",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "单纯附和 / 复制他人答案",
        "do": () => {
            const w = document.querySelector("input#warnpost");
            w.checked = true;
        }
    },
    {
        "reason": "请勿在他人问答帖下提问",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "请勿挖坟，注意发帖时间",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
    {
        "reason": "误导",
        "do": () => {
            const d = document.querySelector("input#score2");
            d.value = "-10";
        }
    },
];
async function reportMod() {
    const td = document.querySelector("#list_modcp_logs > tbody");
    const trl = td === null || td === void 0 ? void 0 : td.querySelectorAll("tr");
    if (!trl)
        return;
    for (const v of Array.from(trl)) {
        if (v.childElementCount != 4)
            continue;
        if (reportOut(v.innerHTML)) {
            setReportMsg(v, "-3", "已过追溯期，注意发帖时间");
            continue;
        }
        const t = await getReportTPid(v);
        if (t == null) {
            continue;
        }
        const reportTime = getReportTime(v);
        if (await isRepotAfterRate(v, t.tid, t.pid, reportTime) || await isRepotAfterWarn(v, t.tid, t.pid, reportTime)) {
            setReportMsg(v, "-3", "请不要举报已处理的帖子");
            continue;
        }
    }
}
function setReportMsg(v, n, msg) {
    const s = v.querySelector("select[name^=creditsvalue]");
    s.value = n;
    const input = v.querySelector("input[name^=msg]");
    input.value = msg;
    const cDom = v.querySelector("input.checkbox");
    cDom.checked = true;
}
function reportOut(test) {
    const FirstPostReg = /<strong>发帖时间:<\/strong>.*?(\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2})<br>/;
    const fl = FirstPostReg.exec(test);
    if (!fl || fl.length != 2)
        return false;
    const ft = new Date(fl[1]).getTime();
    return ((new Date().getTime() - ft) > 15552000000);
}
async function isRepotAfterRate(dom, tid, pid, reportTime) {
    var _a, _b, _c;
    const td3 = dom.querySelector("td:nth-child(3)");
    if (!td3 || td3.childElementCount == 0) {
        return false;
    }
    if (!((_a = td3.innerHTML) === null || _a === void 0 ? void 0 : _a.includes("可能已被扣分"))) {
        return false;
    }
    const pr = await fetch(`https://www.mcbbs.net/forum.php?mod=misc&action=viewratings&tid=${tid}&pid=${pid}&inajax=1`);
    if (pr.status != 200) {
        throw new Error(String(pr.status));
    }
    const text = await pr.text();
    const div = document.createElement("div");
    div.innerHTML = text;
    const trl = div.querySelectorAll("tr");
    for (const v of Array.from(trl)) {
        if (!((_b = v.querySelector("td")) === null || _b === void 0 ? void 0 : _b.innerText.includes(" -"))) {
            continue;
        }
        const td3 = v.querySelector("td:nth-child(3)");
        let text = td3.innerText;
        const span = td3.querySelector("span");
        if (span) {
            text = (_c = span.getAttribute("title")) !== null && _c !== void 0 ? _c : "";
        }
        if (text == "") {
            throw new Error('text == ""');
        }
        const t = new Date(text).getTime();
        return reportTime > t;
    }
    return false;
}
async function isRepotAfterWarn(dom, tid, pid, reportTime) {
    var _a, _b;
    const td3 = dom.querySelector("td:nth-child(3)");
    if (!td3 || td3.childElementCount == 0) {
        return false;
    }
    if (!((_a = td3.innerHTML) === null || _a === void 0 ? void 0 : _a.includes("已被警告"))) {
        return false;
    }
    const pr = await fetch(`forum.php?mod=viewthread&tid=${tid}&viewpid=${pid}`);
    if (pr.status != 200) {
        throw new Error(String(pr.status));
    }
    const text = await pr.text();
    const div = document.createElement("div");
    div.innerHTML = text;
    const aDom = div.querySelector("a.xi2");
    const href = aDom.href;
    const userPage = await fetch(href);
    if (userPage.status != 200) {
        throw new Error(String(userPage.status));
    }
    const utext = await userPage.text();
    const udiv = document.createElement("div");
    udiv.innerHTML = utext;
    const trl = udiv.querySelectorAll("#pcr > tbody > tr");
    for (const d of Array.from(trl)) {
        if (!((_b = d.querySelector("td")) === null || _b === void 0 ? void 0 : _b.innerText.includes("警告帖子"))) {
            continue;
        }
        const aDom = d.querySelector("td:nth-child(3) > a");
        const uq = new URLSearchParams(aDom.href);
        if (uq.get("pid") != pid)
            continue;
        const tdDom = d.querySelector("td:nth-child(2)");
        if (!tdDom || !tdDom.textContent) {
            throw new Error('tdDom.textContent == ""');
        }
        return reportTime > new Date(tdDom.textContent).getTime();
    }
    return false;
}
async function getReportTPid(dom) {
    const href = dom.querySelector("td:nth-child(2) > a").href;
    const pid = new URL(href).searchParams.get("pid");
    if (!pid)
        throw new Error("pid == null");
    const r = await fetch(href);
    const tid = new URL(r.url).searchParams.get("tid");
    if (!tid)
        throw new Error("tid == null");
    return { pid: pid, tid: tid };
}
function getReportTime(dom) {
    const reportTimeReg = /<strong>举报时间:<\/strong>.*?(\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2})/;
    const rl = reportTimeReg.exec(dom.innerHTML);
    return new Date(rl[1]).getTime();
}
async function panel() {
    var _a, _b, _c;
    let pn = document.querySelectorAll("#spr-md-log-anl > p > a");
    const ul = getUserList();
    if (!pn || pn.length == 0) {
        const div = document.createElement("div");
        // 改写自绵羊的脚本
        div.className = "lb-block";
        div.innerHTML = `<div class="lb-box" id="spr-md-log-anl" style="display: block;"></div>`;
        let cssStr = "";
        cssStr += ".lb-block{position: fixed; top: 15%; left: 1%; width: 12em; height: auto; color: #FFF;}";
        cssStr += ".lb-box{background: rgba(0,0,0,0.25); width: auto; height: auto; color: #FFF; padding: 10px; margin-top: 5px; text-shadow: 1px 1px 0px #000; transition: all .3s; max-height: 400px;overflow: overlay;}";
        cssStr += ".lb-box:hover{background: rgba(0,0,0,0.5);}";
        cssStr += ".lb-box-red{background: rgba(255,0,0,0.3);}";
        cssStr += ".lb-box-red:hover{background: rgba(255,0,0,0.5);}";
        cssStr += ".lb-box-green{background: rgba(0,150,0,0.3);}";
        cssStr += ".lb-box-green:hover{background: rgba(0,150,0,0.5);}";
        cssStr += ".lb-box a{color: #FFF;}";
        const style = document.createElement("style");
        style.innerHTML = cssStr;
        (_b = (_a = document.getElementsByTagName("HEAD")) === null || _a === void 0 ? void 0 : _a.item(0)) === null || _b === void 0 ? void 0 : _b.appendChild(style);
        const pl = div.querySelector("#spr-md-log-anl");
        ul.forEach(v => {
            const p = document.createElement("p");
            const a = document.createElement("a");
            const lu = new URL(location.href);
            lu.hash = "pid" + v.pid;
            a.href = lu.toString();
            a.textContent = v.name;
            const o = new IntersectionObserver((e) => {
                if (e.length > 0 && e[0].intersectionRatio > 0) {
                    p.style.border = "solid";
                }
                else {
                    p.style.border = "";
                }
            });
            o.observe(document.querySelector("#pid" + v.pid + " div.authi"));
            p.appendChild(a);
            pl.appendChild(p);
        });
        document.querySelector("body").appendChild(div);
        pn = document.querySelectorAll("#spr-md-log-anl > p > a");
    }
    const um = new Map();
    ul.forEach(v => {
        um.set(v.name, v);
    });
    for (const [key, v] of um) {
        const dosome = () => {
            v.white = true;
            um.set(v.uid, v);
        };
        if (v.heart > 5) {
            dosome();
            continue;
        }
    }
    const set = new Set();
    for (const d of Array.from(pn)) {
        if (!d.textContent)
            continue;
        if (!set.has(d.textContent)) {
            set.add(d.textContent);
            const s = document.createElement("span");
            s.textContent = "*";
            d.parentNode.insertBefore(s, d);
        }
        const ud = um.get(d.textContent);
        if (!ud)
            continue;
        (_c = d.parentNode) === null || _c === void 0 ? void 0 : _c.querySelectorAll(".qamod").forEach(dom => {
            var _a;
            (_a = d.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(dom);
        });
        if (!ud.white) {
            d.style.color = "aqua";
        }
        const s = document.createElement("span");
        s.textContent = " " + ud.level;
        d.parentNode.appendChild(s);
    }
    const pnn = document.querySelector("#spr-md-log-anl");
    const nextA = document.querySelector(".pgbtn > a");
    if (nextA) {
        const a = document.createElement("a");
        a.textContent = "→";
        a.href = nextA.href;
        pnn === null || pnn === void 0 ? void 0 : pnn.appendChild(a);
    }
}
function getUserList() {
    var _a, _b;
    const postDom = document.querySelectorAll("div[id^=post_]");
    const um = [];
    for (const d of Array.from(postDom)) {
        const uDoms = d.querySelector("div.authi > a.xw1");
        const hDoms = (_b = (_a = d.querySelector("dl > dt > img[src^='template/mcbbs/image/apple']")) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.nextSibling;
        const lDom = d.querySelector("p >em > a[href^='home.php?mod=spacecp&ac=usergroup']");
        if (!uDoms || !hDoms || !uDoms.textContent || !lDom || !lDom.textContent)
            continue;
        const uid = new URLSearchParams(uDoms.href).get("uid");
        if (!uid) {
            continue;
        }
        const heart = Number(hDoms.textContent.replace(" 心", ""));
        um.push({
            name: uDoms.textContent,
            uid: uid,
            heart: heart,
            pid: d.id.replace("post_", ""),
            level: lDom.textContent.replace(/ .*$/, "")
        });
    }
    return um;
}
async function editlog(dom, pid, oldHtmlMap) {
    var _a;
    const pdom = dom.querySelector("td.plc > div.po.hin > div.pob.cl > p");
    let lz = false;
    if (((_a = pdom.lastElementChild) === null || _a === void 0 ? void 0 : _a.textContent) == "查看编辑记录") {
        lz = true;
    }
    if (!dom.querySelector(".pstatus"))
        return;
    const aDome = document.createElement("a");
    aDome.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const r = await ((await fetch("https://auto.xmdhs.com/sculk/post?pid=" + pid)).json());
        if (r.code != 0) {
            throw [r.code, r.msg];
        }
        wthis.showWindow('viewlogs', 'plugin.php?id=mcbbs_editlog&doing=viewthreadlogs&pid=' + pid, 'get', -1);
        const p = new Promise((r) => {
            const o = new MutationObserver((_, o) => {
                let d = document.querySelector("#fwin_content_viewlogs");
                if (d && d instanceof HTMLElement) {
                    o.disconnect();
                    r(d);
                }
            });
            const dom = document.querySelector("body");
            if (!dom) {
                r(null);
                return;
            }
            o.observe(dom, { childList: true, subtree: true });
        });
        const d = await p;
        if (!d)
            return;
        const tb = d.querySelector("table.list > tbody");
        for (const v of Array.from(tb.childNodes)) {
            v.remove();
        }
        for (const v of r.data) {
            const tr = document.createElement("tr");
            tr.appendChild(maketd("-"));
            tr.appendChild(maketd(""));
            if (v.ChangeTime == 0) {
                tr.appendChild(maketd("-"));
            }
            else {
                tr.appendChild(maketd(new Intl.DateTimeFormat('zh-CN', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false
                }).format(v.ChangeTime * 1000)));
            }
            const a = document.createElement("a");
            a.textContent = "查看";
            a.addEventListener("click", () => {
                const d = dom.querySelector("td[id^=postmessage_]");
                d.innerHTML = v.Message;
            });
            a.href = "javascript:;";
            tr.appendChild(maketd(a));
            tb.appendChild(tr);
        }
        const tr = document.createElement("tr");
        tr.appendChild(maketd("-"));
        tr.appendChild(maketd(""));
        tr.appendChild(maketd("当前版本"));
        const a = document.createElement("a");
        a.textContent = "查看";
        let oldHtml = oldHtmlMap.get(String(pid));
        if (!oldHtml) {
            oldHtml = dom.querySelector("td[id^=postmessage_]").innerHTML;
            oldHtmlMap.set(String(pid), oldHtml);
        }
        a.addEventListener("click", () => {
            const d = dom.querySelector("td[id^=postmessage_]");
            d.innerHTML = oldHtml;
        });
        a.href = "javascript:;";
        tr.appendChild(maketd(a));
        tb.appendChild(tr);
    });
    aDome.href = "javascript:;";
    aDome.textContent = "查看编辑记录（sculk）";
    pdom.appendChild(aDome);
}
function maketd(msg) {
    const td = document.createElement("td");
    if (typeof msg == 'string') {
        td.textContent = msg;
        return td;
    }
    td.appendChild(msg);
    return td;
}
//# sourceMappingURL=qamod.user.js.map