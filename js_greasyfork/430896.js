"use strict";
// ==UserScript==
// @name         枢-争议提醒
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  创建一个开放、和谐的社区环境，让其他用户能够鉴别存在争议的用户！
// @author       枢 Devs
// @include      /https?://www\.bilibili\.com/video/.+/
// @include      /https?:\/\/space\.bilibili\.com\/\d+([/?].+)?/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @include      /https?://t\.bilibili\.com/.+/
// @downloadURL https://update.greasyfork.org/scripts/430896/%E6%9E%A2-%E4%BA%89%E8%AE%AE%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/430896/%E6%9E%A2-%E4%BA%89%E8%AE%AE%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
var Mode;
(function (Mode) {
    Mode[Mode["QUERY"] = 0] = "QUERY";
    Mode[Mode["ALL"] = 1] = "ALL";
    Mode[Mode["OFFLINE"] = 2] = "OFFLINE";
})(Mode || (Mode = {}));
//设置
//API相关
const API = "https://api.fuckanti.com";
const API_QUERY = "/GetBadGuy";
const API_GET_ALL = "/GetBadGuys";
//模式相关
//QUERY=单次查询模式 效果最好
//ALL=仅获取获取一次模式 最节省服务器资源
//OFFLINE=离线模式 使用下方的OFFLINE_STATS列表
const QUERY_MODE = Mode.QUERY;
//离线模式列表
const OFFLINE_LIST = [
    {
        mid: 1,
        tag: "测试标签1",
        color: "#62ffff",
    },
    {
        mid: 2,
        tag: "测试标签2",
        color: "#ff6a00",
    }
];
//正则匹配表
const REG_VIDEO = /https?:\/\/www\.bilibili\.com\/video\/.+/;
const REG_READ = /https?:\/\/www\.bilibili\.com\/read\/.+/;
const REG_USER_SPACE = /https?:\/\/space\.bilibili\.com\/\d+([/?].+)?/;
const REG_DYNAMIC = /https?:\/\/space\.bilibili\.com\/\d+\/dynamic/;
const REG_DYNAMIC_SPECIFY = /https?:\/\/t\.bilibili\.com\/.+/;
class UStats {
    constructor() {
        this.mid = 0;
        this.tag = "";
        this.color = "";
    }
}
class UStatsOnline extends UStats {
    constructor() {
        super(...arguments);
        this.url = "";
        this.score = 0;
    }
}
class UStatsResponse {
    constructor() {
        this.ErrorCode = 0;
        this.Msg = "";
        this.Success = false;
        this.Data = [];
    }
}
let ALL_LIST = null;
function filtering(mid, lst) {
    let ret = [];
    if (mid instanceof Set) {
        lst.forEach(s => {
            mid.forEach(m => {
                if (s.mid === m)
                    ret.push(s);
            });
        });
    }
    else {
        lst.forEach(s => {
            if (s.mid == mid)
                ret.push(s);
        });
    }
    return ret;
}
function getStats(mid, callback) {
    if (mid instanceof Set && mid.size === 0)
        return;
    let ret = [];
    switch (QUERY_MODE) {
        case Mode.QUERY:
            let req = new XMLHttpRequest();
            req.open("GET", API + API_QUERY + "?mid=" + (mid instanceof Set ? Array.from(mid).toString() : mid));
            req.onload = _ => {
                let usr = JSON.parse(req.response);
                callback(usr.Data, usr);
            };
            req.send();
            break;
        case Mode.ALL:
            if (ALL_LIST === null) {
                let req = new XMLHttpRequest();
                req.open("GET", API + API_GET_ALL);
                req.onload = _ => {
                    let usr = JSON.parse(req.response);
                    ALL_LIST = usr.Data;
                    ret = filtering(mid, ALL_LIST);
                    callback(ret, null);
                };
                req.send();
            }
            else {
                ret = filtering(mid, ALL_LIST);
                callback(ret, null);
            }
            break;
        case Mode.OFFLINE:
            ret = filtering(mid, OFFLINE_LIST);
            callback(ret, null);
            break;
    }
}
function draw(u, s) {
    u.setAttribute("style", "color:" + s.color);
    let str = u.textContent;
    str = str + " | <" + s.tag + ">";
    if (s instanceof UStatsOnline) {
        str = str + " [" + s.score + "]";
        if (s.url !== "") {
            u.setAttribute("herf", s.url);
        }
    }
    u.textContent = str;
}
function drawComment(ue, us) {
    if (ue.length === 0 || us.length === 0)
        return;
    ue.forEach(u => {
        us.forEach(s => {
            try {
                if (Number(u.getAttribute("data-usercard-mid")) === s.mid) {
                    draw(u, s);
                }
            }
            catch (ignored) {
            }
        });
    });
}
function observe(observer, elem) {
    if (elem !== null) {
        observer.observe(elem, {
            childList: true,
            subtree: true,
            characterDataOldValue: true
        });
        console.log("开始监听");
    }
}
function drawUserSpace(us) {
    console.log("准备绘制个人空间");
    let obs = new MutationObserver(_ => {
        let elem = document.getElementById("h-name");
        if (elem !== null) {
            draw(elem, us);
            obs.disconnect();
        }
    });
    observe(obs, document.body);
}
function startObserve() {
    let observer = new MutationObserver(mutationRecords => {
        let mids = new Set();
        let elems = new Array();
        mutationRecords.forEach(rcd => {
            if (rcd.type == "childList") {
                try {
                    let users = Array.from(rcd.addedNodes);
                    users.forEach(user => {
                        try {
                            let lst = user.getElementsByTagName("a");
                            for (let i = 0; i < lst.length; ++i) {
                                try {
                                    let item = lst.item(i);
                                    if (item !== null && item.attributes[0].name === "data-usercard-mid") {
                                        let id = item.attributes[0].value;
                                        mids.add(Number(id));
                                        elems.push(item);
                                    }
                                }
                                catch (ignored) {
                                }
                            }
                        }
                        catch (ignored) {
                        }
                    });
                }
                catch (e) {
                    console.warn(e);
                }
            }
        });
        getStats(mids, (us, usr) => {
            if (usr !== null) {
                if (usr.Success && us.length > 0) {
                    drawComment(elems, us);
                }
                else {
                    console.warn(usr.Msg + "错误代码:" + usr.ErrorCode);
                }
            }
            else {
                if (us.length > 0) {
                    drawComment(elems, us);
                }
            }
        });
    });
    let elem = null;
    if (document.URL.match(REG_VIDEO)) {
        elem = document.getElementById("comment");
    }
    // else if (document.URL.match(REG_DYNAMIC)) {
    //     elem = document.getElementById("page-dynamic")
    // } else if (document.URL.match(REG_READ) || document.URL.match(REG_DYNAMIC_SPECIFY)) {
    //     elem = document.getElementById("app")
    // }
    observe(observer, elem);
}
class Injector {
    constructor() {
        this.help = () => {
            console.log(`帮助:
        help() => void: 帮助菜单
        [测试用]
        randColor() => string: 获取随机颜色
        randUStats() => UStats: 获取随机UStats
        randUStatsOnline() => UStatsOnline: 获取随机UStatsOnline
        testDrawElem(elem :Element,isOnline :boolean =false ) => void: 尝试绘制元素
        testDrawComment(count :number = 5,isOnline :boolean = false) => void: 尝试绘制指定个数评论(默认:5)
        testDrawUserSpace(isOnline :boolean = false) => void: 尝试绘制个人空间`.trim());
        };
        this.randColor = () => {
            return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0');
        };
        this.randUStats = () => {
            let us = new UStats();
            us.color = this.randColor();
            us.tag = "测试标签";
            return us;
        };
        this.randUStatsOnline = () => {
            let us = new UStatsOnline();
            us.color = this.randColor();
            us.tag = "测试标签";
            us.score = Math.floor(Math.random() * 101);
            return us;
        };
        this.testDrawElem = (elem, isOnline = false) => {
            let us = isOnline ? this.randUStatsOnline() : this.randUStats();
            if (elem.getAttribute("testdraw") === "true") {
                console.log("目标已绘制，仅变更颜色。");
                elem.setAttribute("style", "color:" + us.color);
            }
            else {
                elem.setAttribute("testdraw", "true");
                elem.setAttribute("style", "color:" + us.color);
                let str = elem.textContent;
                str = str + " | <" + us.tag + ">";
                console.log("us instanceof UStatsOnline:");
                if (us instanceof UStatsOnline) {
                    str = str + " [" + us.score + "]";
                }
                elem.textContent = str;
                console.log("测试绘制完毕。");
            }
        };
        this.testDrawUserSpace = (isOnline = false) => {
            let elem = document.getElementById("h-name");
            if (elem !== null) {
                this.testDrawElem(elem, isOnline);
            }
        };
        this.testDrawComment = (count = 5, isOnline = false) => {
            let users = document.getElementsByClassName("user");
            for (let idx = 0, draw = 0; idx < users.length && draw < count; ++idx) {
                let items = users[idx].getElementsByTagName("a");
                for (let i = 0; i < users.length; ++i) {
                    try {
                        let item = items.item(i);
                        if (item !== null && item.attributes[0].name === "data-usercard-mid") {
                            if (item.getAttribute("testdraw") == "true")
                                continue;
                            this.testDrawElem(item, isOnline);
                            ++draw;
                        }
                    }
                    catch (ignored) {
                    }
                }
            }
        };
        // @ts-ignore
        document.BiliMarker = this;
    }
}
function empty(s) {
    return (s === "" || s === null || s === undefined);
}
//脚本开始
//@ts-ignore
if (QUERY_MODE !== Mode.OFFLINE) {
    if (empty(API))
        throw "API must not be empty with online mode!";
    //@ts-ignore
    if (QUERY_MODE === Mode.QUERY && empty(API_QUERY))
        throw "Query API must not be empty with query mode!";
    //@ts-ignore
    if (QUERY_MODE === Mode.ALL && empty(API_GET_ALL))
        throw "Get all API must not be empty with get all mode!";
}
//注入
new Injector();
//个人空间匹配
if (document.URL.match(REG_USER_SPACE)) {
    const REG_USER_SPACE_UID = /^https?:\/\/space\.bilibili\.com\/(\d+)(?:.+)*?$/;
    try {
        let ret = document.URL.match(REG_USER_SPACE_UID);
        if (ret !== null && ret.length > 1) {
            let uid = Number(ret[1]);
            getStats(uid, (us, usr) => {
                us.forEach(u => {
                    console.log(u);
                });
                if (usr !== null) {
                    if (usr.Success) {
                        drawUserSpace(us[0]);
                    }
                    else {
                        console.warn(usr.Msg + "错误代码:" + usr.ErrorCode);
                    }
                }
                else if (us.length > 0 && uid === us[0].mid) {
                    drawUserSpace(us[0]);
                }
            });
        }
    }
    catch (e) {
        console.warn("个人空间绘制失败");
        console.warn(e);
    }
}
//开始观测
startObserve();
console.log("BiliMark: Work work.jpg");
