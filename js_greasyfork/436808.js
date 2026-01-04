"use strict";
// ==UserScript==
// @name         提升卡记录
// @version      0.1.5
// @match        https://www.mcbbs.net/home.php?mod=space*
// @match        https://www.mcbbs.net/?*
// @match        https://www.mcbbs.net/forum.php?mod=viewthread&tid=*
// @match        https://www.mcbbs.net/thread-*.html
// @author       xmdhs
// @license      MIT
// @description  查看用户的提升卡使用记录
// @namespace    https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/436808/%E6%8F%90%E5%8D%87%E5%8D%A1%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/436808/%E6%8F%90%E5%8D%87%E5%8D%A1%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (location.href.startsWith("https://www.mcbbs.net/home.php?mod=space") || location.href.startsWith("https://www.mcbbs.net/?")) {
        yield userPage();
        return;
    }
    else {
        let doms;
        try {
            doms = document.querySelectorAll("div.pi > div > a.xw1");
        }
        catch (e) {
            return;
        }
        let i = 0;
        for (const dom of Array.from(doms)) {
            i++;
            if (!(dom instanceof HTMLAnchorElement)) {
                continue;
            }
            let u = new URL(dom.href);
            const uid = u.searchParams.get("uid");
            if (!uid)
                continue;
            dosome(uid, dom, 0);
            if (i > 5) {
                yield new Promise((r) => setTimeout(r, 1000));
                i = 0;
            }
        }
    }
    function userPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = getuid();
            if (uid === null) {
                alert("无法获取 uid");
                return;
            }
            let d = {
                data: [],
                msg: "",
                code: 0
            };
            let f = yield fetch(`https://auto.xmdhs.com/getforuid?uid=` + uid);
            d = yield f.json();
            if (d.code != 0) {
                console.warn(d.msg);
                alert(d.msg);
                return;
            }
            const profile = document.querySelector(".bm_c.u_profile");
            if (profile && profile.lastElementChild) {
                profile.lastElementChild.className = "pbm mbm bbda cl";
            }
            const p = document.querySelector("#ct > div > div.bm.bw0 > div > div.bm_c.u_profile");
            const div = document.createElement("div");
            p ? p.appendChild(div) : console.warn("没有找到");
            const text = document.createElement("h2");
            text.className = "mbn";
            text.innerText = "提升卡记录";
            div.appendChild(text);
            if (d.data == null) {
                console.log("没有数据");
                return;
            }
            div.appendChild(makeTable(d.data));
        });
    }
    function countData(data) {
        let m = {};
        for (const v of data) {
            if (v.operation.indexOf("提升卡") == -1) {
                continue;
            }
            if (m[v.tid] == undefined) {
                m[v.tid] = { count: 1, lastime: v.time };
            }
            else {
                m[v.tid].count++;
                v.time > m[v.tid].lastime && (m[v.tid].lastime = v.time);
            }
        }
        let l = [];
        for (const key in m) {
            let v = m[key];
            l.push({
                count: v.count,
                lastime: v.lastime,
                tid: Number(key)
            });
        }
        l.sort((a, b) => b.lastime - a.lastime);
        return l;
    }
    function makeTable(data) {
        const c = countData(data);
        let table = document.createElement("table");
        table.className = "bm dt";
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<th class="xw1">tid</th><th class="xw1">数量</th><th class="xw1">上一次顶贴时间</th>`;
        for (const v of c) {
            let trr = document.createElement("tr");
            tbody.appendChild(trr);
            addTr(trr, `<a href="https://www.mcbbs.net/thread-${v.tid}-1-1.html" target="_blank">${v.tid}</a>`, true);
            addTr(trr, String(v.count));
            addTr(trr, transformTime(v.lastime));
        }
        return table;
    }
    function addTr(item, v, h) {
        let t = document.createElement("td");
        if (h === true) {
            t.innerHTML = v;
        }
        else {
            t.innerText = v;
        }
        item.appendChild(t);
    }
    function transformTime(timestamp) {
        var time = new Date(timestamp * 1000);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m);
    }
    function addZero(m) {
        return m < 10 ? '0' + String(m) : String(m);
    }
    function getuid() {
        let u = new URL(location.href);
        let uid = u.searchParams.get('uid');
        if (uid && uid.length > 0) {
            return uid;
        }
        let dom = document.querySelector("#uhd > div > div > a");
        if (dom.href.length > 0) {
            u = new URL(dom.href);
            return u.searchParams.get('uid');
        }
        return null;
    }
    function dosome(uid, dom, i) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            i++;
            if (i > 3) {
                console.warn(`${uid} 失败超过3次，跳过`);
                return;
            }
            try {
                const data = yield getData(uid);
                if (data.length == 0) {
                    return;
                }
                const dd = document.createElement("dd");
                let c = 0;
                data.forEach(v => {
                    if (v.operation.indexOf("提升卡") != -1) {
                        c++;
                    }
                });
                dd.textContent = `${c} 张`;
                const dt = document.createElement("dt");
                const timg = document.createElement("img");
                timg.src = "https://www.mcbbs.net/source/plugin/mcbbs_mcserver_plus/magic/magic_serverBump.small.gif";
                timg.style.verticalAlign = "middle";
                dt.textContent = ` 提升`;
                dt.style.color = "red";
                dt.style.fontWeight = "bold";
                dt.insertBefore(timg, dt.firstChild);
                const dl = (_c = (_b = (_a = dom === null || dom === void 0 ? void 0 : dom.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode) === null || _c === void 0 ? void 0 : _c.querySelector("dl.pil");
                dl === null || dl === void 0 ? void 0 : dl.appendChild(dt);
                dl === null || dl === void 0 ? void 0 : dl.appendChild(dd);
            }
            catch (e) {
                console.warn(e);
                yield new Promise((r) => setTimeout(r, 2000));
                yield dosome(uid, dom, i);
            }
        });
    }
    function getData(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            let f = yield fetch(`https://auto.xmdhs.com/getforuid?uid=` + uid);
            let d = {
                data: [],
                msg: "",
                code: 0
            };
            d = yield f.json();
            if (d.code != 0) {
                throw new Error(d.msg);
            }
            if (d.data == null) {
                return [];
            }
            return d.data;
        });
    }
}))();
//# sourceMappingURL=bump.user.js.map