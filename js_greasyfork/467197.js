// ==UserScript==
// @name         仙家军成分查询Helper
// @namespace    www.bilibili.com
// @version      1.8.0.1
// @description  用于标记仙家军和动态转发仙以及使用仙话术的b站用户。可能存在误伤，请注意辨别。标记仅供参考，不建议直接作为“依据”使用。
// @author       Darknights
// @match        *://*.bilibili.com/*
// @match        *://*.biligame.com/detail/?id=*
// @exclude      *://message.bilibili.com/*
// @exclude      *://manga.bilibili.com/*
// @exclude      *://www.bilibili.com/correspond/*
// @exclude      *://www.bilibili.com/page-proxy/*
// @exclude      *://live.bilibili.com/*
// @exclude      *://search.bilibili.com/*
// @icon         *://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @connect      biligame.com
// @connect      fastly.jsdelivr.net
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467197/%E4%BB%99%E5%AE%B6%E5%86%9B%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/467197/%E4%BB%99%E5%AE%B6%E5%86%9B%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2Helper.meta.js
// ==/UserScript==

'use strict';

// 以下为网络名单
let xianLists = [];
let xianFavList = [];
let wordLists = [];
let xianLeakList = [];
let ignoreList = [];
let aidList = [];

//以下为本地名单，请在脚本编辑器-存储区自行添加，关键词列表均为字符串形式，注意要转义反斜杠
// 大部分为仙，少数可能有误判
const localXianList = GM_getValue("localXianList", []);

// 转发者常见仙的，包含且不限于一些up主/被仙缠上的人等等
const localXianFavList = GM_getValue("localXianFavList", []);

// 无视官号和无关号的动态，防止匹配到关键词浪费标签
const localIgnoreList = GM_getValue("localIgnoreList", []);

// 仙可能会用的词汇
const localXianWordList = GM_getValue("localXianWordList", []);

// 被开盒者隐私信息，需要特殊处理故与关键词列表区分
const localXianLeakList = GM_getValue("localXianLeakList", []);

// 辅助，因为有些正则匹配返回值为空
const localAidList = GM_getValue("localAidList", []);

const recordMap = new Map();
const uidSet = new Set();

const xianTags = [["仙", "#11DD77"], ["仙Ⅰ", "#11DD77"], ["仙Ⅱ", "#11DD77"], ["仙Ⅲ", "#11DD77"]];
const localXianTag = ["仙(本地)", "#11DD77"];

const xianRepostTags = [["转发仙:", "#1E971E"], ["转发仙Ⅰ:", "#1E971E"], ["转发仙Ⅱ:", "#1E971E"], ["转发仙Ⅲ:", "#1E971E"]];
const localXianRepostTag = ["转发仙(本地):", "#1E971E"];

const favRepostTag = ["转发:", "#2C9EFF"];
const localFavRepostTag = ["转发(本地):", "#2C9EFF"];

const wordTags = [["命中:", "#04AEAB"], ["命中Ⅰ:", "#04AEAB"], ["命中Ⅱ:", "#04AEAB"], ["命中Ⅲ:", "#04AEAB"]];
const localXianWordTag = ["命中(本地):", "#04AEAB"];

const errorTag = ["出错", "#FF3434"];

const captchaTag = ["出错,点此消除", "#FF3434"];

const refreshTag = ["然后点此🔄", "#FF7B00"];

const newVerTag = ["*已有新版本*", "#990CD0"];

const BLOG_URL = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=";

const BILI_URL = "https://t.bilibili.com/";

const SCRIPT_URL = "https://greasyfork.org/zh-CN/scripts/467197";

const PRIVATE_TIPS = "*已隐藏，注意可能是无关话题被匹配*";

const XIAN_MATCH_TIPS = ["*未定级的仙或其拥护者、跟风者，可能存在误判，请注意辨别*", "*主要在评论区活动的仙，或仙的拥护者、跟风者，可能存在误判，请注意辨别*", "*此类仙呈抱团趋势，大量制造暗区动态、或爱反串，或粉丝较多，有一定号召力*", "*此类仙大量制造暗区视频、专栏，或存在开盒行为，或是粉丝量极高，为仙的意见领袖*"];

const NEW_VERSION_TIPS = "*点击跳转安装页，更多功能尽在新版本*";

const BIG_V_CLASS = ".bili-avatar-icon-business,.bili-avatar-icon-personal,.bili-avatar-icon--business,.bili-avatar-icon--personal,.local-3,.local-4";

const CheckType = {
    Profile: "PROFILE",
    Comment: "COMMENT",
    At: "AT",
    Reference: "REFER",
    Repo: "REPO",
    Follow: "FOLLOW",
    GameComment: "GAME",
    Like: "LIKE"
}

const urlSourceDic = {
    githubusercontent: "https://raw.githubusercontent.com/Darknights1750/XianLists/main/xianLists.json",
    jsdelivr: "https://fastly.jsdelivr.net/gh/Darknights1750/XianLists@main/xianLists.json"
}

const statusDic = {
    0: "脚本已暂停⚠️",
    1: "脚本运行中✅"
}

const loadingSvg = `<svg t="1734440955984" class="loading-xian" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5163" id="mx_n_1734440955985" width="18" height="18"><path d="M512 61.44a40.96 40.96 0 0 1 40.96 40.96v122.88a40.96 40.96 0 1 1-81.92 0V102.4a40.96 40.96 0 0 1 40.96-40.96z" fill="#06dbff" p-id="5164"></path><path d="M737.28 121.79456a40.96 40.96 0 0 1 14.99136 55.95136l-61.44 106.43456a40.96 40.96 0 1 1-70.94272-40.96l61.44-106.43456A40.96 40.96 0 0 1 737.28 121.79456z" fill="#06dbff" p-id="5165"></path><path d="M902.20544 286.72a40.96 40.96 0 0 1-14.99136 55.95136l-106.43456 61.44a40.96 40.96 0 0 1-40.96-70.94272l106.43456-61.44a40.96 40.96 0 0 1 55.95136 14.99136z" fill="#06dbff" p-id="5166"></path><path d="M962.56 512a40.96 40.96 0 0 1-40.96 40.96h-122.88a40.96 40.96 0 1 1 0-81.92h122.88a40.96 40.96 0 0 1 40.96 40.96z" fill="#06dbff" p-id="5167"></path><path d="M902.20544 737.28a40.96 40.96 0 0 1-55.95136 14.99136l-106.43456-61.44a40.96 40.96 0 1 1 40.96-70.94272l106.43456 61.44A40.96 40.96 0 0 1 902.20544 737.28z" fill="#06dbff" p-id="5168"></path><path d="M737.28 902.20544a40.96 40.96 0 0 1-55.95136-14.99136l-61.44-106.43456a40.96 40.96 0 0 1 70.94272-40.96l61.44 106.43456A40.96 40.96 0 0 1 737.28 902.20544z" fill="#06dbff" p-id="5169"></path><path d="M512 962.56a40.96 40.96 0 0 1-40.96-40.96v-122.88a40.96 40.96 0 1 1 81.92 0v122.88a40.96 40.96 0 0 1-40.96 40.96z" fill="#06dbff" p-id="5170"></path><path d="M286.72 902.20544a40.96 40.96 0 0 1-14.99136-55.95136l61.44-106.43456a40.96 40.96 0 1 1 70.94272 40.96l-61.44 106.43456a40.96 40.96 0 0 1-55.95136 14.99136z" fill="#06dbff" p-id="5171"></path><path d="M121.79456 737.28a40.96 40.96 0 0 1 14.99136-55.95136l106.43456-61.44a40.96 40.96 0 0 1 40.96 70.94272l-106.43456 61.44A40.96 40.96 0 0 1 121.79456 737.28z" fill="#06dbff" p-id="5172"></path><path d="M61.44 512a40.96 40.96 0 0 1 40.96-40.96h122.88a40.96 40.96 0 1 1 0 81.92H102.4a40.96 40.96 0 0 1-40.96-40.96z" fill="#06dbff" p-id="5173"></path><path d="M121.79456 286.72a40.96 40.96 0 0 1 55.95136-14.99136l106.43456 61.44a40.96 40.96 0 1 1-40.96 70.94272l-106.43456-61.44A40.96 40.96 0 0 1 121.79456 286.72z" fill="#06dbff" p-id="5174"></path><path d="M286.72 121.79456a40.96 40.96 0 0 1 55.95136 14.99136l61.44 106.43456a40.96 40.96 0 0 1-70.94272 40.96l-61.44-106.43456A40.96 40.96 0 0 1 286.72 121.79456z" fill="#06dbff" p-id="5175"></path></svg>`

let updateTime;
let onlineVersion;
let isLatestVersion = false;
let clearAllMenuId;
let urlSourceMenuId;
let statusMenuId;


const commandClearTags = function (element) {
    Array.prototype.slice.call(element.getElementsByClassName('xian')).forEach(item => item.remove());
    Array.prototype.slice.call(element.getElementsByClassName('xian-fail')).forEach(item => item.remove());
}
const commandClearAllTags = function () {
    commandClearTags(document);
}

const commandUrlSource = function () {
    GM_unregisterMenuCommand(urlSourceMenuId);
    if ("jsdelivr" === GM_getValue("urlSource", "jsdelivr")) {
        GM_setValue("urlSource", "githubusercontent");
    } else {
        GM_setValue("urlSource", "jsdelivr");
    }
    urlSourceMenuId = GM_registerMenuCommand("切换数据源(刷新生效)｜当前" + GM_getValue("urlSource", "jsdelivr"), commandUrlSource);
}

const commandStatus = function () {
    GM_unregisterMenuCommand(statusMenuId);
    if (1 === GM_getValue("status", 1)) {
        GM_setValue("status", 0);
    } else {
        GM_setValue("status", 1);
    }
    statusMenuId = GM_registerMenuCommand("暂停/启动脚本｜当前" + statusDic[GM_getValue("status", 1)], commandStatus);
}

// 初始化存储区、菜单选项
const initSettings = function () {
    // 0：不开启，1：开启
    if (null === GM_getValue("timeInterval", null)) GM_setValue("timeInterval", 2500); // 标签处理间隔时间 单位:ms
    if (null === GM_getValue("testLog", null)) GM_setValue("testLog", 0); // 是否开启调试日志
    if (null === GM_getValue("previewLength", null)) GM_setValue("previewLength", 60); // 文本预览长度
    if (null === GM_getValue("usingCheckProfile", null)) GM_setValue("usingCheckProfile", 1); // 是否监测个人主页UID
    if (null === GM_getValue("usingCheckComments", null)) GM_setValue("usingCheckComments", 1); // 是否监测评论区
    if (null === GM_getValue("usingCheckRepos", null)) GM_setValue("usingCheckRepos", 1); // 是否监测转发区
    if (null === GM_getValue("usingCheckReferences", null)) GM_setValue("usingCheckReferences", 1); // 是否监测动态被转发者
    if (null === GM_getValue("usingCheckAts", null)) GM_setValue("usingCheckAts", 1); // 是否监测@他人
    if (null === GM_getValue("usingCheckFollows", null)) GM_setValue("usingCheckFollows", 1); // 是否监测关注/粉丝列表
    if (null === GM_getValue("usingCheckGameComments", null)) GM_setValue("usingCheckGameComments", 1); // 是否监测游戏评价区
    if (null === GM_getValue("usingCheckLikes", null)) GM_setValue("usingCheckLikes", 1); // 是否监测动态转赞区
    if (null === GM_getValue("localXianList", null)) GM_setValue("localXianList", []);
    if (null === GM_getValue("localXianFavList", null)) GM_setValue("localXianFavList", []);
    if (null === GM_getValue("localIgnoreList", null)) GM_setValue("localIgnoreList", []);
    if (null === GM_getValue("localXianWordList", null)) GM_setValue("localXianWordList", []);
    if (null === GM_getValue("localXianLeakList", null)) GM_setValue("localXianLeakList", []);
    if (null === GM_getValue("localAidList", null)) GM_setValue("localAidList", []);
    if (null === GM_getValue("captchaUrl", null)) GM_setValue("captchaUrl", "https://space.bilibili.com/208259/dynamic"); // 输验证码跳转的个人主页，默认叔叔
    if (null === GM_getValue("fanLimit", null)) GM_setValue("fanLimit", 250000); // up主粉丝阈值，超过将不再进行匹配（对<仙>无效）
    clearAllMenuId = GM_registerMenuCommand("清空本页所有标签", commandClearAllTags);
    urlSourceMenuId = GM_registerMenuCommand("切换数据源(刷新生效)｜当前" + GM_getValue("urlSource", "jsdelivr"), commandUrlSource);
    statusMenuId = GM_registerMenuCommand("暂停/启动脚本｜当前" + statusDic[GM_getValue("status", 1)], commandStatus);
}


const log = function (message) {
    return GM_getValue("testLog", 0) ? console.log(message) : null;
};

const spawnHtml = function (data, text) {
    return `<a class="xian" style='color: ${data[1]} !important' title='${text}' target='_blank' onclick="event.stopPropagation()">&lt;${data[0]}&gt;</a>`;
}

const spawnErrorHtml = function (data, text) {
    return `<a class="xian-error" style='color: ${data[1]} !important' target='_blank' onclick="event.stopPropagation()">&lt;${data[0]}:${text}&gt;</a>`;
}

const spawnCaptchaHtml = function (data) {
    return `<a class="xian-fail" style='color: ${data[1]} !important' href=${GM_getValue("captchaUrl", "https://space.bilibili.com/208259/dynamic")} target='_blank' onclick="event.stopPropagation()">&lt;${data[0]}&gt;</a>`;
}

const spawnRefreshHtml = function (data) {
    return `<a class="xian-fail" style='color: ${data[1]} !important' target='_blank' onclick="event.stopPropagation();refreshTags();">&lt;${data[0]}&gt;</a>`;
}

const spawnHtmlWithRef = function (data, word, link, text) {
    return `<a class="xian" style='color: ${data[1]} !important' href='${link}' title='${text}' target='_blank' onclick="event.stopPropagation()">&lt;${data[0]}${word}&gt;</a>`;
}

// 检测是不是新版
const isNew = function () {
    if (location.host === 'space.bilibili.com') {
        return true;
    }
    if (document.getElementsByClassName('item goback').length > 0) {
        return true;
    }
    if (document.getElementsByClassName('app-v1').length > 0) {
        return true;
    }
    if (document.getElementsByClassName('opus-detail').length > 0) {
        return true;
    }
    if (document.getElementsByClassName('bgc').length > 0) {
        return true;
    }
    return false;
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const getXianListOnline = function () {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: urlSourceDic[GM_getValue("urlSource", "jsdelivr")],
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
            },
            onload: res => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.responseText));
                } else {
                    resolve(JSON.parse('{"xianList":[],"xianFavList":[],"wordLv1List":[],"wordLv2List":[],"wordLv3List":[]}'));
                    log('[xian-helper]获取远程列表失败！请检查网络情况');
                    log(res);
                }
            },
            onerror: res => {
                log('[xian-helper]访问列表失败！请检查网络情况');
                log(res);
            }
        });
    });
}

const createScriptFun = function () {
    let refreshTagsScript = document.createElement('script');
    refreshTagsScript.type = "text/javascript";
    refreshTagsScript.innerText = `const refreshTags=function(){Array.prototype.slice.call(document.getElementsByClassName('xian-fail')).forEach(item=>item.remove());}`;
    document.head.appendChild(refreshTagsScript);
}

const compareVersions = function (curVer, netVer) {
    var curArr = curVer.split('.');
    var netArr = netVer.split('.');
    for (var i = 0; i < Math.max(curArr.length, netArr.length); i++) {
        var curNum = parseInt(curArr[i] || 0);
        var netNum = parseInt(netArr[i] || 0);
        if (curNum < netNum) {
            return 1;
        }
        if (curNum > netNum + 10 || !/^\d+$/.test(curNum) || !/^\d+$/.test(netNum)) {
            return 2;
        }
        if (curNum > netNum) {
            return -1;
        }
    }
    return 0;
}

const fillLists = async function () {
    let json = await getXianListOnline();
    xianLists = [
        json.xianList,
        json.xianLv1List,
        json.xianLv2List,
        json.xianLv3List
    ];
    xianFavList = json.xianFavList;
    ignoreList = [...localIgnoreList, ...json.ignoreList];
    wordLists = [
        json.wordLv1List.map((item) => new RegExp(item)),
        json.wordLv2List.map((item) => new RegExp(item)),
        json.wordLv3List.map((item) => new RegExp(item))
    ];
    xianLeakList = json.xianLeakList.map((item) => new RegExp(item));
    aidList = json.aidList.map((item) => new RegExp(item));
    aidList = [...aidList, ...localAidList];
    updateTime = json.updateTime;
    onlineVersion = json.version;
    log(`[xian-helper]>>List update time: ${updateTime}`);
}

const newQueryAll = function (root, selector) {
    let elements = Array.from(root.querySelectorAll(selector));
    root.querySelectorAll("*").forEach(element => {
        const shadowRoot = element.shadowRoot;
        if (shadowRoot) {
            elements = elements.concat(newQueryAll(shadowRoot, selector));
        }
    });
    return elements ?? [];
}

const runHelper = function () {

    /* Functions */
    const isBlank = function (str) {
        if (!str || /^\s*$/.test(str)) return true;
        return false;
    }

    const getUidLevel = function (uid, isFav = false, isLocal = false) {
        if (isLocal) {
            const usingList = isFav ? localXianFavList : localXianList;
            return usingList.indexOf(uid) > -1 ? 0 : -1;
        }
        if (isFav) {
            return xianFavList.indexOf(uid) > -1 ? 0 : -1;
        }
        for (let level = 3; level >= 0; level--) {
            const xianList = xianLists[level];
            if (xianList.indexOf(uid) > -1) return level;
        }
        return -1;
    }

    //忽略认证用户和大up主，但不忽略名单里的。html方法只能找到主页、评论和关注的
    const isBigUpByHtml = function (checkType, uid) {
        if (getUidLevel(uid) > -1) return false;
        if (checkType === CheckType.Profile) {
            const profileTitle = document.querySelector(`.h-user,.upinfo__main`);
            if (profileTitle) {
                const bigV = profileTitle.querySelector(BIG_V_CLASS);
                if (bigV) return true;
            }
            // const dynAvater = document.querySelector(`.bili-dyn-item__avatar`);
            // if (dynAvater) {
            //     const bigV = dynAvater.querySelector(BIG_V_CLASS);
            //     if (bigV) return true;
            // } else {
            //     const bigV = document.querySelector(`.h-user`).querySelector(BIG_V_CLASS);
            //     if (bigV) return true;
            // }
            const fanCount = document.getElementById("n-fs");
            if (fanCount) {
                const count = Number(fanCount.computedName?.replace(/\,/g, ""));
                return (count ?? 0) >= GM_getValue("fanLimit", 250000);
            }
        }
        if (checkType === CheckType.Comment) {
            const bigVShadow = newQueryAll(document, `[data-user-profile-id="${uid}"] bili-avatar`)
            if (bigVShadow.length > 0) {
                const png = bigVShadow[0].shadowRoot.innerHTML;
                if (/(res-local3|res-local4)/.test(png)) return true;
            }
            const bigVNew = document.querySelector(`[data-user-id="${uid}"]`)?.querySelector(BIG_V_CLASS);
            const bigVOld = document.querySelector(`[data-usercard-mid="${uid}"]`)?.querySelector(BIG_V_CLASS);
            if (bigVNew || bigVOld) return true;
        }
        if (checkType === CheckType.Follow) {
            const bigV = document.querySelector(`[href^="//space.bilibili.com/${uid}"]`)?.querySelector(BIG_V_CLASS);
            if (bigV) return true;
        }
        return false;
    }

    //忽略认证用户和大up主，但不忽略名单里的。
    const isBigUpByJson = function (moduleAuthor) {
        if (getUidLevel(String(moduleAuthor.mid)) > -1) return false;
        const verify = moduleAuthor?.official_verify?.type;
        return verify != null && verify > -1;
    }

    const getUid = function (htmlEntity, checkType) {
        if (checkType === CheckType.Profile) {
            return window.location.href.match(/(?<=space\.bilibili\.com\/)\d+/)[0];
        }
        if (checkType === CheckType.Comment) {
            return htmlEntity.dataset?.userId ?? htmlEntity.dataset?.usercardMid ?? htmlEntity.dataset?.userProfileId ?? htmlEntity.href?.match(/(?<=space\.bilibili\.com\/)\d+/)[0];
            // return htmlEntity.dataset?.userId ?? htmlEntity.dataset?.usercardMid ?? htmlEntity.href?.replace(/[^\d]/g, "") ?? htmlEntity.parentElement?.previousElementSibling?.href?.replace(/[^\d]/g, "");
        }
        if (checkType === CheckType.Repo) {
            return htmlEntity._profile.uid;
        }
        if (checkType === CheckType.At) {
            if (htmlEntity.dataset.oid) return htmlEntity.dataset.oid;
            if (htmlEntity.dataset.userId) return htmlEntity.dataset.userId;
            if (htmlEntity.dataset.usercardMid) return htmlEntity.dataset.usercardMid;
        }
        if (checkType === CheckType.Reference) {
            return htmlEntity._profile?.uid ?? htmlEntity.href?.match(/(?<=space\.bilibili\.com\/)\d+/)[0];
        }
        if (checkType === CheckType.Follow) {
            return htmlEntity.parentElement?.href?.match(/(?<=space\.bilibili\.com\/)\d+/)[0] ?? htmlEntity.href?.match(/(?<=space\.bilibili\.com\/)\d+/)[0];
        }
        if (checkType === CheckType.GameComment) {
            return htmlEntity.href.match(/(?<=space\.bilibili\.com\/)\d+/)[0];
        }
        if (checkType === CheckType.Like) {
            return htmlEntity.parentElement.previousElementSibling._profile.uid;
        }
        return null;
    }

    const getName = function (htmlEntity, checkType) {
        if (checkType === CheckType.Profile) {
            return htmlEntity.textContent;
        }
        if (checkType === CheckType.Comment) {
            return htmlEntity.textContent.trim().replace(/[@：]/g, "");
        }
        if (checkType === CheckType.Repo) {
            return htmlEntity.textContent;
        }
        if (checkType === CheckType.At) {
            return htmlEntity.textContent.trim().replace(/[@：]/g, "");
        }
        if (checkType === CheckType.Reference) {
            return htmlEntity.textContent;
        }
        if (checkType === CheckType.Follow) {
            return htmlEntity.textContent;
        }
        if (checkType === CheckType.GameComment) {
            return htmlEntity.textContent;
        }
        if (checkType === CheckType.Like) {
            return htmlEntity.textContent.slice(0, -2);
        }
        return null;
    }

    const getCommentList = function () {
        let oldArray = newQueryAll(document, ".user-name,#user-name,.sub-user-name,.user>.name");
        let headerArray1 = Array.from(document.querySelector(".bili-header")?.querySelectorAll(".user-name,.sub-user-name,.user>.name") ?? []);
        let headerArray2 = Array.from(document.querySelector(".nav-user-center") ?? []);
        let headerArray = [...headerArray1, ...headerArray2];
        // let oldArray = Array.from(document.querySelectorAll(".user-name,.sub-user-name,.user>.name"));
        // let headerArray1 = Array.from(document.querySelector(".bili-header")?.querySelectorAll(".user-name,.sub-user-name,.user>.name") ?? []);
        // let headerArray2 = Array.from(document.querySelector(".nav-user-center") ?? []);
        // let headerArray = [...headerArray1, ...headerArray2];
        return oldArray.filter(item => !headerArray.includes(item));
    }

    const getRepoList = function () {
        return document.getElementsByClassName('bili-dyn-forward-item__uname');
    }

    const getReferenceList = function () {
        return document.querySelectorAll('.dyn-orig-author__name,.original-card-content .username');
    }

    const getLikeList = function () {
        return document.getElementsByClassName('reaction-item__name');
    }

    const getFollowList = function () {
        return Array.from(document.querySelectorAll(".fans-name,.relation-card-info__uname"));
    }

    const getGameCommentList = function () {
        return Array.from(document.querySelectorAll("a.user-name"));
    }

    const getAtList = function () {
        const lst = new Set();
        for (let c of document.getElementsByClassName('jump-link user')) {
            lst.add(c);
        }
        for (let c of document.getElementsByClassName('bili-rich-text-module at')) {
            lst.add(c);
        }
        for (let c of document.querySelectorAll('.text-con > a,.text > a')) {
            if (c.dataset.usercardMid) lst.add(c);
        }
        return Array.from(lst);
    }

    const spliceText = function (moduleDynamic) {
        let fullTextArr = [];
        if (moduleDynamic.topic && !isBlank(moduleDynamic.topic.name)) {
            fullTextArr.push(moduleDynamic.topic.name);
        }
        if (moduleDynamic.desc && !isBlank(moduleDynamic.desc.text)) {
            fullTextArr.push(moduleDynamic.desc.text);
        }
        if (moduleDynamic.major) {
            if (moduleDynamic.major.archive) {
                if (!isBlank(moduleDynamic.major.archive.title)) {
                    fullTextArr.push(moduleDynamic.major.archive.title);
                }
                if (!isBlank(moduleDynamic.major.archive.desc)) {
                    fullTextArr.push(moduleDynamic.major.archive.desc);
                }
            }
            if (moduleDynamic.major.article) {
                if (!isBlank(moduleDynamic.major.article.title)) {
                    fullTextArr.push(moduleDynamic.major.article.title);
                }
                if (!isBlank(moduleDynamic.major.article.desc)) {
                    fullTextArr.push(moduleDynamic.major.article.desc);
                }
            }
            if (moduleDynamic.major.live && !isBlank(moduleDynamic.major.live.title)) {
                fullTextArr.push(moduleDynamic.major.live.title);
            }
        }
        if (moduleDynamic.additional && moduleDynamic.additional.ugc && !isBlank(moduleDynamic.additional.ugc.title)) {
            fullTextArr.push(moduleDynamic.additional.ugc.title);
        }
        return fullTextArr.join('//');
    }

    const previewText = function (text, index, len) {
        if (!text) return '';
        const left = Math.max(0, index - len);
        const right = Math.min(text.length, index + len);
        let textPart = '';
        if (left > 0) {
            textPart += '...';
        }
        textPart += text.substring(left, right).replace(/\n|\r/g, '').trim();
        if (right < text.length) {
            textPart += '...';
        }
        return textPart;
    }

    const findRepost = function (items, ownId, matchedDynamicList, isFav, isLocal) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (isBigUpByJson(item.modules.module_author)) {
                matchedDynamicList.push(String(item.id_str));
                continue;
            }
            if (item.orig) {
                if (!isFav && isBigUpByJson(item.orig.modules.module_author)) {
                    matchedDynamicList.push(String(item.orig.id_str));
                    continue;
                }
                const origId = String(item.orig.modules.module_author.mid);
                if (origId === ownId) continue;
                const uidLevel = getUidLevel(origId, isFav, isLocal);
                if (uidLevel > -1) {
                    const origName = String(item.orig.modules.module_author.name);
                    const ownFullText = spliceText(item.modules.module_dynamic);
                    const origFullText = spliceText(item.orig.modules.module_dynamic);
                    const ownTextPart = previewText(ownFullText, 0, GM_getValue("previewLength", 60));
                    const origTextPart = previewText(origFullText, 0, GM_getValue("previewLength", 60));
                    const bothTextPart = `${ownTextPart}//@${origName}:${origTextPart}`;
                    matchedDynamicList.push(String(item.id_str));
                    matchedDynamicList.push(String(item.orig.id_str));
                    return [origId, origName, String(item.id_str), bothTextPart, uidLevel];
                }
            }
        }
        return null;
    }

    const hearOne = function (text, usingWordList, level) {
        for (const word of usingWordList) {
            const matchRes = text.match(word);
            if (matchRes) {
                let matchStr = matchRes[0];
                let matchIndex = matchRes.index;
                if (matchStr === '') {
                    for (const aidWord of aidList) {
                        const matchAid = text.match(aidWord);
                        if (matchAid) {
                            matchStr = matchAid[0];
                            matchIndex = matchAid.index;
                            break;
                        }
                    }
                }
                matchStr = matchStr.replace(/\n|\r/g, ' ').trim();
                return [matchStr, matchIndex + matchStr.length / 2, level];
            }
        }
        return null;
    }

    const hear = function (text, name, isLocal) {
        if (isBlank(text) || ignoreList.indexOf(name) > -1) return null;
        const usingLeakList = isLocal ? localXianLeakList : xianLeakList;
        if (!isLocal) {
            for (let level = 2; level >= 0; level--) {
                const wordList = wordLists[level];
                const matchRes = hearOne(text, wordList, level);
                if (matchRes) return matchRes;
            }
        } else {
            const matchRes = hearOne(text, localXianWordList, -1);
            if (matchRes) return matchRes;
        }
        for (const word of usingLeakList) {
            const matchRes = text.match(word);
            if (matchRes) return ['可能是盒隐私', -1, -1];
        }
        return null;
    }

    /**
     * 查找关键词
     * @param {} items 动态列表
     * @returns [关键词,动态id,动态片段]
     */
    const findWord = function (items, ownName, matchedDynamicList, isLocal) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            //忽略认证用户 但不忽略名单里的
            if (isBigUpByJson(item.modules.module_author)) {
                matchedDynamicList.push(String(item.id_str));
                continue;
            }
            let level = -1;
            let origName;
            let ownFullText = spliceText(item.modules.module_dynamic);
            let origFullText;
            let ownTextPart;
            let origTextPart;
            let returnWord; // 关键词
            let returnPart; // 预览文本
            if (matchedDynamicList.indexOf(String(item.id_str)) > -1) {
                ownFullText = null;
            }
            if (item.orig) {
                origName = String(item.orig.modules.module_author.name);
                origFullText = spliceText(item.orig.modules.module_dynamic);
                if (isBigUpByJson(item.orig.modules.module_author)) {
                    matchedDynamicList.push(String(item.orig.id_str));
                    origFullText = null;
                }
                if (matchedDynamicList.indexOf(String(item.orig.id_str)) > -1) {
                    origFullText = null;
                }
            }
            const ownMatch = hear(ownFullText, ownName, isLocal);
            const origMatch = hear(origFullText, origName, isLocal);
            const ownLevel = ownMatch ? ownMatch[2] : -2;
            const origLevel = origMatch ? origMatch[2] : -2;
            if (ownLevel === -2 && origLevel === -2) {
                continue;
            }
            if (ownLevel < origLevel) {
                level = origLevel;
                returnWord = '🔁' + origMatch[0];
            } else {
                level = ownLevel;
                returnWord = ownMatch[0];
            }
            const ownIndex = ownMatch ? ownMatch[1] : 0;
            const origIndex = origMatch ? origMatch[1] : 0;
            ownTextPart = ownIndex < 0 ? PRIVATE_TIPS : previewText(ownFullText, ownIndex, GM_getValue("previewLength", 60) / 2);
            returnPart = ownTextPart;
            if (!isBlank(origName)) {
                origTextPart = origIndex < 0 ? PRIVATE_TIPS : previewText(origFullText, origIndex, GM_getValue("previewLength", 60) / 2);
                returnPart = ownTextPart + `//@${origName}:${origTextPart}`;
            }
            return [returnWord, String(item.id_str), returnPart, level + 1];
        }
        return null;
    }

    //检查记录
    const findRecord = async function (uid, name) {
        let oldTag;
        if (recordMap.has(uid)) {
            oldTag = recordMap.get(uid);
            uidSet.delete(uid);
            if (oldTag) {
                log(`[xian-helper]>>Record:${name}@UID-${uid}>>find>>${oldTag.replaceAll(/<\/?a.*?>/g, "").replaceAll(/&gt;&lt;/g, "、").replaceAll(/&.t;/g, "")}`);
            }
        } else if (uidSet.has(uid)) {
            await sleep(500);
            oldTag = findRecord(uid, name);
        } else {
            uidSet.add(uid);
        }
        return oldTag;
    }

    function isContain(dom) {
        const totalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const totalWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // 当滚动条滚动时，top、left、bottom、right时刻会发生改变
        const { top, right, bottom, left } = dom.getBoundingClientRect();
        return left >= 0 && top >= 0 && right <= totalWidth && bottom <= totalHeight;
    }

    const checkEntity = async function (htmlEntity, checkType) {
        if (htmlEntity.innerHTML.indexOf(`<span class="xian`) < 0) {
            htmlEntity.textContent = htmlEntity.textContent.trim();
            if (isContain(htmlEntity)) {
            if (htmlEntity.innerHTML.indexOf(`class="loading-xian"`) < 0) {
                htmlEntity.innerHTML += loadingSvg;
            }
                let xianSpan = document.createElement('span');
                xianSpan.className = 'xian';
                htmlEntity.appendChild(xianSpan);
                if (compareVersions(GM_info.script.version, onlineVersion) > 0) {
                    xianSpan.innerHTML += spawnHtmlWithRef(newVerTag, '', SCRIPT_URL, NEW_VERSION_TIPS);
                }
                const uid = String(getUid(htmlEntity, checkType));
                if (!/^\d+$/.test(uid)) {
                    log(`[xian-helper]传入UID格式错误：${uid}`);
                    xianSpan.innerHTML += spawnErrorHtml(errorTag, 'UID格式错误');
                    Array.prototype.slice.call(htmlEntity.getElementsByClassName('loading-xian')).forEach(item => item.remove());
                    return;
                }
                if (isBigUpByHtml(checkType, uid)) {
                    Array.prototype.slice.call(htmlEntity.getElementsByClassName('loading-xian')).forEach(item => item.remove());
                    return;
                }
                const name = getName(htmlEntity, checkType).trim();
                if (ignoreList.indexOf(name) > -1) {
                    Array.prototype.slice.call(htmlEntity.getElementsByClassName('loading-xian')).forEach(item => item.remove());
                    return;
                }
                let oldTag = await findRecord(uid, name);

                if (typeof oldTag === 'string') {
                    xianSpan.innerHTML += oldTag;
                    Array.prototype.slice.call(htmlEntity.getElementsByClassName('loading-xian')).forEach(item => item.remove());
                } else {
                    let newTag = '';
                    const uidLevel = getUidLevel(uid);
                    if (uidLevel > -1) {
                        log(`[xian-helper]>>Find Target Lv${uidLevel}:${name}@UID-${uid}>>${checkType}`);
                        newTag += spawnHtml(xianTags[uidLevel], XIAN_MATCH_TIPS[uidLevel]);
                    } else if (localXianList.indexOf(uid) > -1) {
                        log(`[xian-helper]>>Find Local Target:${name}@UID-${uid}>>${checkType}`);
                        newTag += spawnHtml(localXianTag, XIAN_MATCH_TIPS[0]);
                    }
                    GM_xmlhttpRequest({
                        method: "get",
                        url: BLOG_URL + uid,
                        headers: {
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                        },
                        onload: res => {
                            if (res.status === 200) {
                                const dynamicJson = JSON.parse(res.response).data;
                                if (dynamicJson) {
                                    if (dynamicJson.items) {
                                        let matchedDynamicList = [];
                                        const repostMatch = findRepost(dynamicJson.items, uid, matchedDynamicList, false, false);
                                        if (repostMatch) {
                                            log(`[xian-helper]>>Find Repost Lv${repostMatch[4]}:${name}@UID-${uid}>>repost>>${repostMatch[1]}@UID-${repostMatch[0]}>>${checkType}`);
                                            const fixedText = repostMatch[1].length > 12 ? repostMatch[1].slice(0, 9) + '...' : repostMatch[1];
                                            newTag += spawnHtmlWithRef(xianRepostTags[repostMatch[4]], fixedText, BILI_URL + repostMatch[2], repostMatch[3]);
                                        } else {
                                            const localRepostMatch = findRepost(dynamicJson.items, uid, matchedDynamicList, false, true);
                                            if (localRepostMatch) {
                                                log(`[xian-helper]>>Find Local Repost:${name}@UID-${uid}>>repost>>${repostMatch[1]}@UID-${repostMatch[0]}>>${checkType}`);
                                                const fixedText = repostMatch[1].length > 12 ? repostMatch[1].slice(0, 9) + '...' : repostMatch[1];
                                                newTag += spawnHtmlWithRef(localXianRepostTag, fixedText, BILI_URL + repostMatch[2], repostMatch[3]);
                                            }
                                        }
                                        const favRepostMatch = findRepost(dynamicJson.items, uid, matchedDynamicList, true, false);
                                        if (favRepostMatch) {
                                            log(`[xian-helper]>>Find Fav:${name}@UID-${uid}>>repost>>${favRepostMatch[1]}@UID-${favRepostMatch[0]}>>${checkType}`);
                                            const fixedText = favRepostMatch[1].length > 12 ? favRepostMatch[1].slice(0, 9) + '...' : favRepostMatch[1];
                                            newTag += spawnHtmlWithRef(favRepostTag, fixedText, BILI_URL + favRepostMatch[2], favRepostMatch[3]);
                                        } else {
                                            const localFavRepostMatch = findRepost(dynamicJson.items, uid, matchedDynamicList, true, true);
                                            if (localFavRepostMatch) {
                                                log(`[xian-helper]>>Find Local Fav:${name}@UID-${uid}>>repost>>${favRepostMatch[1]}@UID-${favRepostMatch[0]}>>${checkType}`);
                                                const fixedText = favRepostMatch[1].length > 12 ? favRepostMatch[1].slice(0, 9) + '...' : favRepostMatch[1];
                                                newTag += spawnHtmlWithRef(localFavRepostTag, fixedText, BILI_URL + favRepostMatch[2], favRepostMatch[3]);
                                            }
                                        }
                                        const wordMatch = findWord(dynamicJson.items, name, matchedDynamicList, false);
                                        if (wordMatch) {
                                            log(`[xian-helper]>>Find Word:${name}@UID-${uid}>>say>>${wordMatch[0]}>>${checkType}`);
                                            const fixedText = wordMatch[0].length > 12 ? wordMatch[0].slice(0, 9) + '...' : wordMatch[0];
                                            newTag += spawnHtmlWithRef(wordTags[wordMatch[3]], fixedText, BILI_URL + wordMatch[1], wordMatch[2]);
                                        } else {
                                            const localWordMatch = findWord(dynamicJson.items, name, matchedDynamicList, true);
                                            if (localWordMatch) {
                                                log(`[xian-helper]>>Find Local Word:${name}@UID-${uid}>>say>>${wordMatch[0]}>>${checkType}`);
                                                const fixedText = wordMatch[0].length > 12 ? wordMatch[0].slice(0, 9) + '...' : wordMatch[0];
                                                newTag += spawnHtmlWithRef(localXianWordTag, fixedText, BILI_URL + wordMatch[1], wordMatch[2]);
                                            }
                                        }
                                    }
                                    xianSpan.innerHTML += newTag;
                                    recordMap.set(uid, newTag);
                                } else {
                                    xianSpan.className = 'xian-fail';
                                    newTag = newTag.replace(/"xian"/g, '"xian-fail"');
                                    xianSpan.innerHTML += newTag;
                                    xianSpan.innerHTML += spawnCaptchaHtml(captchaTag);
                                    xianSpan.innerHTML += spawnRefreshHtml(refreshTag);
                                    uidSet.delete(uid);
                                    log('[xian-helper]仙家军成分查询Helper get dynamic fail...');
                                    log(htmlEntity);
                                    log(res);
                                }
                            } else {
                                xianSpan.className = 'xian-error';
                                newTag = newTag.replace(/"xian"/g, '"xian-error"');
                                xianSpan.innerHTML += newTag;
                                xianSpan.innerHTML += spawnErrorHtml(errorTag, "网络请求异常");
                                log('[xian-helper]仙家军成分查询Helper request fail...');
                                log(htmlEntity);
                                log(res);
                            }
                            Array.prototype.slice.call(htmlEntity.getElementsByClassName('loading-xian')).forEach(item => item.remove());
                        },
                    });
                }
            }
        } else {
            Array.prototype.slice.call(htmlEntity.getElementsByClassName('loading-xian')).forEach(item => item.remove());
        }
    }

    const checkComments = function () {
        const commentlist = getCommentList();
        if (commentlist && commentlist.length > 0) {
            commentlist.forEach(htmlEntity => {
                checkEntity(htmlEntity, CheckType.Comment);
            });
        }
    }

    const checkRepos = function () {
        const repolist = getRepoList();
        if (repolist && repolist.length > 0) {
            repolist.forEach(htmlEntity => {
                checkEntity(htmlEntity, CheckType.Repo);
            });
        }
    }

    const checkAts = function () {
        const atList = getAtList();
        if (atList && atList.length > 0) {
            atList.forEach(htmlEntity => checkEntity(htmlEntity, CheckType.At));
        }
    }

    const checkReferences = function () {
        const referenceList = getReferenceList();
        if (referenceList && referenceList.length > 0) {
            referenceList.forEach(htmlEntity => checkEntity(htmlEntity, CheckType.Reference));
        }
    }

    const checkFollows = function () {
        const followList = getFollowList();
        if (followList && followList.length > 0) {
            followList.forEach(htmlEntity => checkEntity(htmlEntity, CheckType.Follow));
        }
    }

    const checkProfile = async function () {
        let htmlEntity = document.getElementById('h-name') ?? document.querySelector('.nickname');
        if (htmlEntity) checkEntity(htmlEntity, CheckType.Profile);
    }

    const checkGameComments = async function () {
        const gameCommentList = getGameCommentList();
        if (gameCommentList && gameCommentList.length > 0) {
            gameCommentList.forEach(htmlEntity => checkEntity(htmlEntity, CheckType.GameComment));
        }
    }

    const checkLikes = async function () {
        const LikeList = getLikeList();
        if (LikeList && LikeList.length > 0) {
            LikeList.forEach(htmlEntity => checkEntity(htmlEntity, CheckType.Like));
        }
    }

    log(`[xian-helper]start finding targets...`);

    setInterval(() => {
        if (GM_getValue("status", 1)) {
            if (location.host === "www.biligame.com") {
                if (GM_getValue("usingCheckGameComments", 1)) {
                    checkGameComments();
                }
            } else {
                if (GM_getValue("usingCheckComments", 1)) {
                    checkComments();
                }
                if (GM_getValue("usingCheckRepos", 1)) {
                    checkRepos();
                }
                if (GM_getValue("usingCheckReferences", 1)) {
                    checkReferences();
                }
                if (GM_getValue("usingCheckAts", 1)) {
                    checkAts();
                }
                if (GM_getValue("usingCheckLikes", 1)) {
                    checkLikes();
                }
                if (location.host === "space.bilibili.com") {
                    if (GM_getValue("usingCheckProfile", 1)) {
                        checkProfile();
                    }
                    if (GM_getValue("usingCheckFollows", 1)) {
                        checkFollows();
                    }
                }
            }
        } else {
            Array.prototype.slice.call(document.body.getElementsByClassName('loading-xian')).forEach(item => item.remove());
        }
        const zhuangbans = document.querySelectorAll('.sailing');
        for (const zhuangban of zhuangbans) {
            if (zhuangban.style.pointerEvents !== "none") {
                zhuangban.style.pointerEvents = "none";
            }
        }
    }, GM_getValue("timeInterval", 2500));

}

const fitBiliHelper = function () {
    if (!document.getElementById("helper-card")) {
        const args = Array.from(arguments).slice(0, arguments.length);
        setTimeout(fitBiliHelper, GM_getValue("timeInterval", 2500));
        return;
    }
    const target = document.querySelector('.helper-card-face.face');
    const observer = new MutationObserver(function (mutations) {
        mutations.map(function (mutation) {
            commandClearTags(document.getElementById("helper-card"));
        });
    });

    observer.observe(target, { attributeFilter: ["src"] });
}

const start = async function () {
    log(`[xian-helper]仙家军成分查询Helper v${GM_info.script.version}，启动！
[xian-helper]>>isNew: ${isNew()}
[xian-helper]>>Loading: ${window.location.href}
[xian-helper]>>urlSource: ${GM_getValue("urlSource", "jsdelivr")}`);
    initSettings();
    createScriptFun();
    await fillLists();
    runHelper();
    fitBiliHelper();
}

start();
