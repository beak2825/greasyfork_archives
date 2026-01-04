// ==UserScript==
// @name         Mcbbs茶馆帖子过滤
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @license      MIT
// @description  以标题关键词过滤为主, 过滤茶馆帖子
// @author       WinsreWu
// @match        https://www.mcbbs.net/forum-chat-*
// @match        https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=52*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/470351/Mcbbs%E8%8C%B6%E9%A6%86%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/470351/Mcbbs%E8%8C%B6%E9%A6%86%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

// --配置-- //
var blackList = ["怎|咋|么|如何|找个|请教", "服务器|模组服|插件服", "新人", "请问|有没有|找|求|觉得|啊！|大家|你们|啥|哪|吗|有没有|求助|聊一聊|求|找人玩|闲聊|各位", "每日一水|完成任务|新人贴|做任务|新人报道"];
var whiteList = ["蜘蛛侠:纵横宇宙|【必读】|【坛规】|【矿工茶馆规章】|【矿工茶馆索引】", "[!论坛]论|\\[|\"|多图|雾|BGM|Bgm|bgm"]
var debug = true;
var checkAuther = true;
var checkThread = false;
var checkTime = 700;
var reboot = false;
// -------- //

var autherMap, threadMap;

function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}
function mapToJson(map) {
    return JSON.stringify(strMapToObj(map));
}
function objToStrAMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        let au = new Auther(obj[k].id, obj[k].lastUpdate, obj[k].ready, obj[k].level);
        if (!au.isReady()) {
            au.setup();
        }
        strMap.set(k, au);
    }
    return strMap;
}
function objToStrTMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        let th = new Thread(obj[k].tid, obj[k].auther, obj[k].contextLength, obj[k].autherLevel, obj[k].ready, obj[k].autherId);
        if (!th.isReady()) {
            th.setup();
        }
        strMap.set(k, th);
    }
    return strMap;
}
function jsonToAutherMap(jsonStr) {
    return objToStrAMap(JSON.parse(jsonStr));
}
function jsonToThreadMap(jsonStr) {
    return objToStrTMap(JSON.parse(jsonStr));
}

function getMap() {
    autherMap = null;
    threadMap = null;
    try {
        autherMap = jsonToAutherMap(localStorage.getItem("autherMap"));
        threadMap = jsonToThreadMap(localStorage.getItem("threadMap"));
    } catch(e) {
        localStorage.setItem("autherMap", "{}");
        localStorage.setItem("threadMap", "{}");
    }
    if (!autherMap | autherMap == null | autherMap == undefined) {
        autherMap = new Map();
    }
    if (!threadMap | threadMap == null | threadMap == undefined) {
        threadMap = new Map();
    }
}
function saveMap() {
    localStorage.setItem("autherMap", mapToJson(autherMap));
    localStorage.setItem("threadMap", mapToJson(threadMap));
}

var tbodyQuery = [];

class Auther {
    constructor(id, lastUpdate, ready, level) {
        this.id = id;
        this.lastUpdate = lastUpdate;
        this.ready = ready;
        this.level = level;
    }
    setup() {
        if (autherMap.has(this.id)) {
            return;
        }
        this.ready = false;
        this.update();
        this.lastUpdate = Date.now();
    }
    isReady() {
        return this.ready;
    }
    needUpdate() {
        return (Date.now() - this.lastUpdate) > 604800000; // 7 days
    }
    update() {
        this.ready = false;
        let idUrl = "https://www.mcbbs.net/home.php?mod=space&uid=" + this.id;
        const Http = new XMLHttpRequest();
        Http.open("GET", idUrl);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (!(Http.readyState == 4 && Http.status == 200)) {
                if (Http.readyState == 4 && this.counter++ < 4) {
                    this.update();
                }
                return;
            }
            let re = new RegExp("target=\"_blank\">Lv.([0-9]+)");
            if (re.exec(Http.responseText) == null) {
                let ans = Http.responseText.match(/<a href=\"home.php\?mod=spacecp&amp;ac=usergroup&amp;gid=([0-9])+\" target=\"_blank\">([^]+?)<\/a>/)[1];
                if (4 <= ans && ans <= 9) {
                    this.level = -1;
                } else {
                    this.level = 13;
                }
            } else {
                this.level = re.exec(Http.responseText)[1];
            }
            this.ready = true;
            this.lastUpdate = Date.now();
        }
    }
}

class Thread {
    constructor(tid, auther, contextLength, autherLevel, ready, autherid) {
        this.tid = tid;
        this.auther = auther;
        this.contextLength = contextLength;
        this.autherLevel = autherLevel;
        this.ready = ready;
        this.autherid = autherid;
    }
    setup() {
        if (threadMap.has(this.tid)) {
            return;
        }
        this.ready = false;
        this.auther = null;
        let printableUrl = "https://www.mcbbs.net/forum.php?mod=viewthread&action=printable&tid=" + this.tid;
        let detailedUrl = "https://www.mcbbs.net/forum.php?mod=viewthread&tid=" + this.tid;
        const Http1 = new XMLHttpRequest(), Http2 = new XMLHttpRequest();
        Http1.open("GET", printableUrl);
        Http1.send();
        Http2.open("GET", detailedUrl);
        Http1.onreadystatechange = (e) => {
            if (!(Http1.readyState == 4 && Http1.status == 200)) {
                if (Http1.readyState == 4 && this.counter++ < 4) {
                    this.setup();
                }
                return;
            }
            this.contextLength = this.getL(Http1.responseText.match(/<hr noshade size="2" width="100%" color="#808080">[^]*?<hr noshade size="2" width="100%" color="/)[0]);
            this.auther = Http1.responseText.match(/作者: <\/b>[^]*?&nbsp; &nbsp/)[0].slice(8, -12);
            if (this.auther != "匿名" && this.contextLength < 110 && checkAuther) {
                Http2.send();
                return;
            }
            this.ready = true;
        }
        Http2.onreadystatechange = (e) => {
            if (!(Http2.readyState == 4 && Http2.status == 200)) {
                if (Http2.readyState == 4 && this.counter++ < 4) {
                    this.setup();
                }
                return;
            }
            let re = new RegExp("uid=([0-9]+)\" target=\"_blank\" class=\"xw1\"[^>]*>" + this.auther);
            this.autherId = re.exec(Http2.responseText)[1];
            this.isReady();
        }
    }
    isReady() {
        if (this.auther == "匿名") {
            return true;
        }
        if (!this.autherId) {
            return this.ready;
        }
        if (!autherMap.has(this.autherId)) {
                let au = new Auther(this.autherId);
                au.setup();
                autherMap.set(this.autherId, au);
            }
        if (autherMap.get(this.autherId).isReady()) {
            this.autherLevel = autherMap.get(this.autherId).level;
            this.ready = true;
        }
        return this.ready;
    }
    needDel() {
        if (this.auther == "匿名") {
            return false;
        }
        return this.autherLevel >= 8 ? false : this.contextLength < 110;
    }
    reason() {
        if (this.auther == "匿名") {
            return " [ 匿名发帖 ]";
        }
        let reason = " [";
        if (this.contextLength < 110) {
            reason += " 字数过少:" + this.contextLength;
        } else {
            reason += " 字数充足:" + this.contextLength;
        }
        if (this.autherLevel >= 8) {
            reason += " " + this.autherLevel + "级用户发帖"
        }
        reason += " ]";
        return reason;
    }
    getL(Words) {
        let iTotal = 0;
        for (let i = 0; i < Words.length; i++) {
            var c = Words.charAt(i);
            if (c.match(/[\u4e00-\u9fa5]/)) {
                iTotal++;
            }
            else if (c.match(/[\u9FA6-\u9fcb]/)) {
                iTotal++;
            }
        }
        return iTotal;
    }
}

function check() {
    let threadList = document.querySelectorAll("#threadlisttableid tbody");

    threadListLoop:
    for (let i = 0; i < threadList.length; i++) {
        let tbody = threadList[i];

        if (tbody.id == "separatorline" || tbody.getAttribute("check") != null) {
            continue;
        }
        tbody.setAttribute("check", true);

        if (document.querySelector("#" + tbody.id + " .s") == null) {
            continue;
        }
        let title = document.querySelector("#" + tbody.id + " .s").innerHTML;

        if (title.length < 2) {
            if (debug) {
                tbody.style.backgroundColor = "#aaa";
                document.querySelector("#" + tbody.id + " .s").innerHTML += " {标题字数过少";
                continue;
            } else {
                tbody.remove();
                continue;
            }
        }

        let needDel = false; //关键词黑/白名单检测
        for (let i = 0; i < blackList.length; i++) {
            let r = blackList[i];
            for (let i = 0; i < whiteList.length; i++) {
                let r2 = whiteList[i];
                let re = new RegExp(r), re2 = new RegExp(r2);
                if (re.test(title)) {
                    needDel = true;
                }
                if (re2.test(title)) {
                    continue threadListLoop;
                }
            }
        }

        if (needDel) { //关键词屏蔽
            if (document.querySelector("#" + tbody.id + " .s").style.color != "") { //判断标题是否使用变色卡
                continue;
            }
            if (debug) {
                tbody.style.backgroundColor = "#aaa";
                document.querySelector("#" + tbody.id + " .s").innerHTML += " {关键词屏蔽";
                continue;
            } else {
                tbody.remove();
                continue;
            }
        }

        if (document.querySelector("#" + tbody.id + " img[title='图片附件']") == null) { //图片检测
            //后续处理
            if (checkThread) {
                tbodyQuery.push(tbody);
            }
        } else {
            if (debug) {
                document.querySelector("#" + tbody.id + " .s").innerHTML += " [ 有图 ]";
            }
        }
    }
}

function handleTbody() {
    if (tbodyQuery.length == 0) {
        return false;
    }
    let tbody = tbodyQuery[0];
    tbodyQuery.shift();
    let id = tbody.id.match(/[0-9]+/)[0];
    if (!threadMap.has(id)) {
        let th = new Thread(id);
        th.setup();
        threadMap.set(id, th)
        tbodyQuery.push(tbody);
        return false;
    }
    if (!threadMap.get(id).isReady()) {
        tbodyQuery.push(tbody);
        return false;
    }
    let thr = threadMap.get(id);
    if (thr.needDel()) {
        if (debug) {
            tbody.style.backgroundColor = "#999";
            document.querySelector("#" + tbody.id + " .s").innerHTML += thr.reason();
        } else {
            tbody.remove();
        }
    } else {
        if (debug) {
            document.querySelector("#" + tbody.id + " .s").innerHTML += thr.reason();
        }
    }
    return true;
}

window.setInterval(function () {
    saveMap();
    check();
    while(handleTbody());
}, checkTime);

(function () {
    'use strict';
    getMap();
    if (reboot) {
        autherMap = new Map();
        threadMap = new Map();
        window.alert("Reboot Success");
    }
})();

window.addEventListener('beforeunload', function (e) {
 	saveMap();
});