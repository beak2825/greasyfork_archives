// ==UserScript==
// @name         OMPS多人在线同播
// @namespace    https://xypp.cc/omps/
// @version      7.3.1
// @description  OMPS多人在线同播。脚本默认对所有站点均生效。您可以在TamperMonkey=>管理面板=>OMPS多人在线同播=>设置=>用户排除中修改不想要生效的网站或直接修改源代码
// @author       小鱼飘飘
// @match        *://*/*
// @icon         https://xypp.cc/omps/logo.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_getTab
// @downloadURL https://update.greasyfork.org/scripts/450545/OMPS%E5%A4%9A%E4%BA%BA%E5%9C%A8%E7%BA%BF%E5%90%8C%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/450545/OMPS%E5%A4%9A%E4%BA%BA%E5%9C%A8%E7%BA%BF%E5%90%8C%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const OMPS_VER = "7.3.1";
    const DEBUG = false;
    const URL = "wss://public.xypp.cc:8093";
    /**
     * OMPS 在线多人同播插件
     */

    //为非油猴的直接运行方式优化
    function LOGGER(a) {
        if (DEBUG) {
            console.log("[OMPS]" + a)
        }
    }
    var GM_window, GM_get, GM_set;
    if (typeof unsafeWindow != 'object') GM_window = window;
    else GM_window = unsafeWindow;
    if (typeof GM_getValue != 'function') {
        GM_get = function (key, val) {
            return GM_window.localStorage.getItem(key) || val;
        };
        GM_set = function (key, val) {
            return GM_window.localStorage.setItem(key, val);
        };
    } else {
        GM_get = GM_getValue;
        GM_set = GM_setValue;
    }
    try {
        document.body.setAttribute("data-omps-injected", "true");
    } catch (e) { }
    function getTextSafe(text) {
        var tmpElement = document.createElement("div");
        if (tmpElement.textContent !== null) tmpElement.textContent = text;
        else tmpElement.innerText = text;

        var retText = tmpElement.innerHTML;
        return retText;
    }
    var ws;
    var video;
    var currentDomain = GM_window.location.host;
    var isTopWindow = false;
    var topCode = "", topUrl = "", topTitle = "";
    var frameWindowObjs = [];
    var oneKeySetting = {}
    var trustKey = GM_get("trust", "none");
    var initFinish = false;
    var lastTime = -1;
    var pauseAt = -1;
    var pauseUser = "";
    var globalCount = 24;
    var timerCount = 0;
    var toastCnt = 0;
    var tmpLocalDelay;
    var localDelay;
    var currentRate = 1;
    var baseSpeed = 1;
    var tipSpeed = true;
    var initTime;
    var videoCode = "";
    var HASH = {};
    var videoTitle = "";
    var videoUrl = "";
    var errConnBreak = false;
    var errConnBreak_reconn = 10;
    var errConnBreak_tryCnt = 0;
    var isPausedShowList = false;
    var autoJoinCountDown = -1;
    var videoInterValId = -1;
    const css = `.omps-friend .item:hover{text-decoration: underline;cursor: pointer;}.omps-friend .item:hover::after{content: "→";}.omps-friend{position:absolute;top:140px;left:0}.omps-friend .item{height:30px;border-radius:0 40px 40px 0;background-color:rgba(0,0,0,0.772);padding-left:10px;padding-right:5px;line-height:25px;font-size:15px;color:white;max-width:300px;margin-top:3px}.omps-friend .item.offline{opacity:.5;text-decoration:line-through}.omps-tip{position:absolute;top:100px;height:40px;border-radius:0 40px 40px 0;left:-300px;background-color:rgba(0,0,0,0.772);padding-left:10px;line-height:35px;color:white;max-width:100%;z-index:10000000;transition:all 1s;opacity:0}.omps-tip.open{left:0;opacity:1}.omps-tip div{display:inline;font-size:20px}.omps-tip .btn{color:black;background-color:#fff;border-radius:30px;padding:5px 7px;margin-right:6px;line-height:13px;box-shadow:grey 1px 1px 1px;text-align:center;display:inline-block;vertical-align:middle}.omps-tip .btn svg,.omps-chat-input svg,.omps-chat svg,.omps-friend svg{height:20px;width:20px}.omps-tip .btn svg path{fill:black}.omps-tip .btn:hover{background-color:#dcdcdc}.omps-tip .btn:active{box-shadow:inset gray 1px 1px 1px}.omps-tip .btn span{display:none}.omps-tip .btn:hover span{animation:showLabelAnim 1s linear 1s 1;animation-fill-mode:forwards;max-width:0;overflow-x:hidden;word-break:keep-all;margin:0;display:unset;padding:0;line-height:20px;overflow-y:clip;float:right}@keyframes showLabelAnim{0%{max-width:0}100%{max-width:200px}}.omps-config{font-size:18px;z-index:10000003;max-width:calc(100% - 100px);position:absolute;top:50px;width:600px;left:50px;background-color:rgba(0,0,0,0.772);border-radius:10px;color:white;padding:20px;max-height:calc(100% - 100px);overflow:auto}.omps-config input{display:block;outline:0;border:0;border-radius:5px;color:black;background-color:rgba(255,255,255,0.772)}.omps-config input:active{box-shadow:skyblue 0 0 5px 3px}.omps-config input:focus{box-shadow:skyblue 0 0 3px 1px}.omps-config input.i{height:30px;width:300px;max-width:100%}.omps-config input.c{height:20px;width:20px;-webkit-appearance:checkbox!important;appearance:checkbox!important}.omps-config label{display:block;text-decoration:underline}.omps-config small{display:block;color:lightgray}.omps-config .btn{color:black;background-color:#fff;border-radius:30px;padding:5px 10px;margin-right:10px;box-shadow:grey 1px 1px 1px;text-align:center;display:inline-block;vertical-align:middle}.omps-config .btn:hover{background-color:#dcdcdc}.omps-config .btn:active{box-shadow:inset gray 1px 1px 1px}.omps-chat{font-size:18px;position:absolute;top:5px;right:0;overflow-x:hidden;max-width:100%;width:400px}.omps-chat .item{border-radius:40px 0 0 40px;background-color:rgba(0,0,0,0.772);color:white;max-width:calc(100% - 30px);z-index:10000000;transition:all 1s;opacity:0;transform:translateX(100%);position:relative;margin-top:2px;max-height:0;line-break:loose;word-break:break-all;white-space:normal;overflow:hidden}.omps-chat .item.open{transform:translateX(0%);opacity:1;max-height:400px;padding:10px}.omps-chat .item .name{text-decoration:underline;font-weight:bold}.omps-chat .item .delay{font-size:x-small;font-style:italic;position:absolute;top:1px;right:1px}.omps-chat-input{white-space: nowrap;position:absolute;bottom:50px;right:100px;width:calc(100% - 200px);background-color:rgba(0,0,0,0.772);height:40px}.omps-chat-input{font-size:18px;position:absolute;bottom:150px;right:100px;width:calc(100% - 200px);background-color:rgba(0,0,0,0.772);border-radius:50px;padding:10px 30px;opacity:0;transition:all .5s}.omps-chat-input.tipPos{animation:omps-tipPos 1s ease-in-out 0s infinite}.omps-chat-input:hover,.omps-chat-input.inputActive{opacity:1}@keyframes omps-tipPos{0%{opacity:0}50%{opacity:.5}100%{opacity:0}}.omps-chat-input input{background-color:rgba(0,0,0,0);display:inline-block;outline:0;border:rgba(255,255,255,0.497) 1px solid;border-radius:5px;width:calc(100% - 100px);height:100%;color:white}.omps-chat-input input:active{box-shadow:skyblue 0 0 5px 3px}.omps-chat-input input:focus{box-shadow:skyblue 0 0 3px 1px}.omps-chat-input .btn,.omps-chat .btn{color:black;background-color:#fff;border-radius:30px;padding:5px 10px;margin-right:10px;box-shadow:grey 1px 1px 1px;text-align:center;display:inline-block;vertical-align:middle}.omps-chat-input .btn svg path,.omps-chat .btn svg path{fill:black}.omps-chat-input .btn:hover,.omps-chat .btn:hover{background-color:#dcdcdc}.omps-chat-input .btn:active,.omps-chat .btn:active{box-shadow:inset gray 1px 1px 1px}.omps-chat .btn{padding: 2px 5px;font-size: 16px;}.omps-tipLine{position: absolute;top: 100px;height: 40px;border-radius:5px;left: 0px;width: 3px;background-color: white;z-index: 10000001;transition:background-color 0.5s;}.omps-tipLineMask{position: absolute;top: 100px;height: 40px;border-radius:5px;left: 0px;width: 20px;background-color: transparent;z-index: 9999999;}`;
    function OMPS_INFO() {
        if (isTopWindow) console.log(`
    ____  __  _______  _____
  / __ \\/  |/  / __ \\/ ___/
 / / / / /|_/ / /_/ /\\__ \\ 
/ /_/ / /  / / ____/___/ / 
\\____/_/  /_/_/    /____/  
OMPS在线同播插件Ver${OMPS_VER}
https://xypp.cc/omps/
`);
    }

    const lang = {
        join: "检测到视频，点击进入联机放映",
        reconfigure: "重新填写配置",
        quickJoin: "快速加入",
        toQuickJoin: ["将在", "秒后加入放映厅", ""],
        quit: "关闭",
        setting: {
            userId: {
                label: "用户名",
                tip: "其他用户看到您的名字。请不要使用短用户名防止重名"
            },
            group: {
                label: "加入的房间ID",
                tip: "该房间ID用于同步进度。与您的朋友输入相同的房间ID且您和朋友正在观看相同的视频时，你们的进度将会被同步"
            },
            autoJoin: {
                label: "自动加入",
                tip: "勾选后，下次检测到视频将会自动进入上次填写的群组"
            },
            silent: {
                label: "静默模式",
                tip: "仅会提示您失去同步消息，不会提示您成功消息"
            },
            friend: {
                label: "始终显示好友",
                tip: "常驻显示左侧的好友列表。该列表在不同步/等待好友进度时会自动显示，静默模式下该列表不会显示。"
            },
            showMsgIpt: {
                label: "显示消息输入框",
                tip: "在视频下方中央显示一个输入框，这将您允许发送消息"
            },
            hideMsg: {
                label: "隐藏消息",
                tip: "隐藏消息，不显示别人发送的消息。注意，打开此功能后，显示消息输入框功能将失效。"
            },
            noRateSync: {
                label: "不使用变速同步",
                tip: "变速同步会在您与好友进度略微不同时将快的一方速率降低5%来缓慢而无感的达到同步。关闭此选项后将使用默认的暂停同步方法。"
            },
            saveExit: "保存并关闭",
            saveJoin: "保存并连接"
        },
        conErr: ["无法连接到服务器，将在", "秒后重连"],
        conErrNoRty: "无法连接到服务器，点击重连",
        autoReconn: "自动重连中...",
        pauseMsg: "的视频太慢了，等他一下...",
        pauseSlowMsg: "您的视频慢了，房间中其他人正在等您",
        pauseHandMsg: "房间中其他人正在等您，请手动开始播放",
        delay: ["延迟达到了", "ms，可能会影响您或其他人的观影体验"],
        success: "连接成功，延迟",
        syncSuccess: "同步进度完成",
        playerJoin: "加入了放映厅",
        playerLeave: "离开了放映厅",
        sync: "同步",
        call: "集合",
        sendmsg: "发送",
        exit: "退出",
        unsync: ["失去同步！最快进度为", "(", "s)"],
        unsync_top: "失去同步！您是目前的最快进度",
        videoChange: "视频变更，准备重连",
        dumplName: "注册失败，与服务器中已连接的用户重名",
        secondConnect: "因为您的另一个客户端的连接，本页面已与服务器断开连接",
        tiper: "提示",
        jumpTip: ["用户[", "]从此视频转向观看‘", "’", "点击前往"],
        jumpConfirm: ["您即将前往", "跳转到目标网站可能会带来不明的风险，您确定要跳转吗？"],
        shareUrl: "成功创建了分享链接",
        share: "分享",
        waitTop: ["分享失败", "等待顶层页面响应，请稍后"],
        streamVideo: "这是一个直播视频，已关闭进度同步",
        usingSpeedControl: "正在使用调速同步，这将调整您的视频播放速度"
    }

    //===========设置相关============
    var setting = {
        autoJoin: "",
        userId: "",
        group: "",
        silent: "",
        friend: "",
        showMsgIpt: "",
        hideMsg: "",
        noRateSync: "",
    };
    //导入设置（TamporMonkey/LocalStorage）
    for (const settingItem in setting) {
        if (Object.hasOwnProperty.call(setting, settingItem)) {
            const defaultVal = setting[settingItem];
            setting[settingItem] = GM_get(settingItem, defaultVal);
        }
    }
    var openedSettingPanel;
    //[函数]打开设置面板
    function openSettingPanel() {
        if (openedSettingPanel) {
            closeSettingPanel();
        }
        var el = document.createElement("div");
        el.className = "omps-config";
        el.id = "omps-config";
        el.onclick = noPop;
        el.innerHTML = msgMaker.settingPanel();
        document.body.appendChild(el);
        openedSettingPanel = el;
    }
    function saveSettings() {
        var el = document.getElementById("omps-config");
        if (!el) return;
        GM_set("userId", document.getElementById("omps-input-name").value);
        GM_set("group", document.getElementById("omps-input-group").value);
        GM_set("autoJoin", document.getElementById("omps-input-quick").checked ? "1" : "");
        GM_set("silent", document.getElementById("omps-input-silent").checked ? "1" : "");
        GM_set("friend", document.getElementById("omps-input-friend").checked ? "1" : "");
        GM_set("showMsgIpt", document.getElementById("omps-input-showMsgIpt").checked ? "1" : "");
        GM_set("hideMsg", document.getElementById("omps-input-hideMsg").checked ? "1" : "");
        GM_set("noRateSync", document.getElementById("omps-input-noRateSync").checked ? "1" : "");
        setting.userId = document.getElementById("omps-input-name").value;
        setting.group = document.getElementById("omps-input-group").value;
        setting.autoJoin = document.getElementById("omps-input-quick").checked ? "1" : "";
        setting.silent = document.getElementById("omps-input-silent").checked ? "1" : "";
        setting.friend = document.getElementById("omps-input-friend").checked ? "1" : "";
        setting.showMsgIpt = document.getElementById("omps-input-showMsgIpt").checked ? "1" : "";
        setting.hideMsg = document.getElementById("omps-input-hideMsg").checked ? "1" : "";
        setting.noRateSync = document.getElementById("omps-input-noRateSync").checked ? "1" : "";
    }
    function closeSettingPanel() {
        var el = openedSettingPanel;
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
    //===========设置相关============


    var msgMaker = {
        settingPanel: () => {//设置面板
            return `
            <label>${lang.setting.userId.label}</label>
            <small>${lang.setting.userId.tip}</small>
            <input class="omps-input i" id="omps-input-name" value="${setting.userId}">
            <br>
            <label>${lang.setting.group.label}</label>
            <small>${lang.setting.group.tip}</small>
            <input class="omps-input i" id="omps-input-group" value="${setting.group}">
            <br>
            <label>${lang.setting.autoJoin.label}</label>
            <small>${lang.setting.autoJoin.tip}</small>
            <input class="omps-input c" type="checkbox" id="omps-input-quick" ${setting.autoJoin ? "checked" : ""}>
            <br>
            <label>${lang.setting.silent.label}</label>
            <small>${lang.setting.silent.tip}</small>
            <input class="omps-input c" type="checkbox" id="omps-input-silent" ${setting.silent ? "checked" : ""}>
            <br>
            <label>${lang.setting.friend.label}</label>
            <small>${lang.setting.friend.tip}</small>
            <input class="omps-input c" type="checkbox" id="omps-input-friend" ${setting.friend ? "checked" : ""}>
            <br>
            <label>${lang.setting.showMsgIpt.label}</label>
            <small>${lang.setting.showMsgIpt.tip}</small>
            <input class="omps-input c" type="checkbox" id="omps-input-showMsgIpt" ${setting.showMsgIpt ? "checked" : ""}>
            <br>
            <label>${lang.setting.hideMsg.label}</label>
            <small>${lang.setting.hideMsg.tip}</small>
            <input class="omps-input c" type="checkbox" id="omps-input-hideMsg" ${setting.hideMsg ? "checked" : ""}>
            <br>
            <label>${lang.setting.noRateSync.label}</label>
            <small>${lang.setting.noRateSync.tip}</small>
            <input class="omps-input c" type="checkbox" id="omps-input-noRateSync" ${setting.noRateSync ? "checked" : ""}>
            <br><br>
            <a class="btn" onclick="ompsEventRouter('saveExit');return false;">${lang.setting.saveExit}</a>
            <a class="btn" onclick="ompsEventRouter('saveLink');return false;">${lang.setting.saveJoin}</a>
            `;
        },
        settingButtons: () => {
            return `
            <a class="btn" onclick="ompsEventRouter('config');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /></svg>
                <span class="desc">${lang.reconfigure}</span>
            </a>
            <a class="btn" onclick="ompsEventRouter('share');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-share-fill" viewBox="0 0 16 16"><path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/></svg>
                <span class="desc">${lang.share}</span>
            </a>
            <a class="btn" onclick="ompsEventRouter('exit');return false;">
            <svg t="1674448686043" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1265" width="200" height="200"><path d="M443.093333 622.506667a35.84 35.84 0 0 0 50.773334 50.773333l135.68-135.68a36.266667 36.266667 0 0 0 0-51.2l-135.68-135.68a35.84 35.84 0 0 0-50.773334 50.773333l74.24 74.24H36.053333a35.84 35.84 0 0 0 0 72.106667h481.28z" fill="#5E5C5C" p-id="1266"></path><path d="M983.68 312.746667a512 512 0 0 0-878.933333-110.506667 35.84 35.84 0 0 0 57.173333 42.666667 443.733333 443.733333 0 0 1 151.893333-128 439.466667 439.466667 0 0 1 509.44 84.053333A440.32 440.32 0 0 1 682.88 917.333333a440.746667 440.746667 0 0 1-369.92-12.8 444.586667 444.586667 0 0 1-151.893333-128 35.84 35.84 0 0 0-57.173334 42.666667 516.266667 516.266667 0 0 0 176.64 147.2A512 512 0 0 0 1024.213333 512a506.026667 506.026667 0 0 0-40.533333-199.253333z" fill="#5E5C5C" p-id="1267"></path></svg>
            <span class="desc">${lang.exit}</span>
            </a>
            <a class="btn" onclick="ompsEventRouter('hide');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                <span class="desc">${lang.quit}</span>
            </a>
            `;
        },
        joinAsk: (hasConfigured) => {
            return `${lang.join}
                <a class="btn" onclick="ompsEventRouter('config');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /></svg>
                <span class="desc">${lang.reconfigure}</span>
            </a>
            <a class="btn"onclick="ompsEventRouter('create');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/></svg>
                <span class="desc">${lang.quickJoin}</span>
            </a>
            <a class="btn" onclick="ompsEventRouter('hide');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                <span class="desc">${lang.quit}</span>
            </a>
            `;
        },
        joinPrep: (restCount) => {
            return `${lang.toQuickJoin[0]}${parseInt(restCount)}${lang.toQuickJoin[1]}${setting.group}${lang.toQuickJoin[2]}
            <a class="btn" onclick="ompsEventRouter('noAuto');ompsEventRouter('config');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /></svg>
                <span class="desc">${lang.reconfigure}</span>
            </a>
            <a class="btn"onclick="ompsEventRouter('noAuto');ompsEventRouter('create');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/></svg>
                <span class="desc">${lang.quickJoin}</span>
            </a>
            <a class="btn" onclick="ompsEventRouter('noAuto');ompsEventRouter('hide');return false;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                <span class="desc">${lang.quit}</span>
            </a>
            `;
        },
        success: (code, delv, group) => {
            return `${getTextSafe(group)} ${lang.success}${getTextSafe(delv)}
                ${msgMaker.settingButtons()}
            `;
        },
        conErr: () => {
            return `${lang.conErr}`;
        },
        pauseMsg: (pu) => {
            return `${pu}${lang.pauseMsg}`;
        },
        pauseFor: (isPaused) => {
            return `${isPaused ? lang.pauseHandMsg : lang.pauseSlowMsg}`;
        },
        playFail: () => {
            return `${lang.playFail}`;
        },
        delayTip: (delv) => {
            return `${lang.delay[0]}${getTextSafe(delv)}${lang.delay[1]}`;
        },
        syncSuccess: () => {
            return lang.syncSuccess;
        },
        playerJoin: (pname) => {
            return `${lang.playerJoin}`;
        },
        playerLeave: (pname) => {
            return `${lang.playerLeave}`;
        },
        unsync: (target, deltaTime) => {
            return `${lang.unsync[0]}${getTextSafe(target)}${lang.unsync[1]}${getTextSafe(deltaTime)}${lang.unsync[2]}
            <a class=\"btn\" onclick=\"ompsEventRouter('sync');return false;\">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
            <span class="desc">${lang.sync}</span>
            </a>
            <a class=\"btn\" onclick=\"ompsEventRouter('call');return false;\">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16"><path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/></svg>
            <span class="desc">${lang.call}</span>
            </a>`
        },
        unsync_top: () => {
            return `${lang.unsync_top}
            <a class=\"btn\" onclick=\"ompsEventRouter('call');return false;\">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16"><path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/></svg>
            <span class="desc">${lang.call}</span>
            </a>`
        },
        chat_input: () => {
            return `
                <input class="omps-input i" id="omps-input-chatmsg" onblur="this.parentNode.classList.remove('inputActive')"
                    onfocus="this.parentNode.classList.add('inputActive')" onkeydown="if(event.keyCode == 13){ompsEventRouter('sendMsg');omps_noPop(event);}"
                    onclick="omps_noPop(event)" autocomplete="off">
                <a class="btn" onclick="ompsEventRouter('sendMsg');omps_noPop(event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"
                        class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                        <path
                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span class="desc">${lang.sendmsg}</span>
                </a>
            `;
        },
        chat_block: (name, msg, time) => {
            return `
                <span class="name">${getTextSafe(name)}</span>
                &nbsp;:&nbsp;
                <span>${getTextSafe(msg)}</span>
                <span class="delay">${time}</span>
            `;
        },
        error: (msg, arg) => {
            if (msg == "E_USERNAME_DUMPL") {
                return `
                ${lang.dumplName}
                <a class="btn" onclick="ompsEventRouter('config');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /></svg>
                    <span class="desc">${lang.reconfigure}</span>
                </a>
                <a class="btn" onclick="ompsEventRouter('hide');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    <span class="desc">${lang.quit}</span>
                </a>`;
            } else if (msg == "E_SECOND_CONN") {
                return `${lang.secondConnect}
                <a class="btn" onclick="ompsEventRouter('config');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /></svg>
                    <span class="desc">${lang.reconfigure}</span>
                </a>
                <a class="btn"onclick="ompsEventRouter('create');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/></svg>
                    <span class="desc">${lang.quickJoin}</span>
                </a>
                <a class="btn" onclick="ompsEventRouter('hide');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    <span class="desc">${lang.quit}</span>
                </a>
            `;
            } else if (msg == "E_ERR_NET") {
                let _tipTxt = `${lang.conErr[0]}${arg}${lang.conErr[1]}`;
                if (!arg) _tipTxt = lang.conErrNoRty;
                return `${_tipTxt}
                <a class="btn" onclick="ompsEventRouter('config');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" /></svg>
                    <span class="desc">${lang.reconfigure}</span>
                </a>
                <a class="btn"onclick="ompsEventRouter('create');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/></svg>
                    <span class="desc">${lang.quickJoin}</span>
                </a>
                <a class="btn" onclick="ompsEventRouter('hide');return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    <span class="desc">${lang.quit}</span>
                </a>
            `;
            }
        },
        userJump: (name, title, url) => {
            if (title.length > 80) {
                title = title.substr(0, 80) + "...";
            }
            var urlDat = "";
            try { urlDat = window.btoa(url) } catch (e) { }
            var urlBtn = `<div style="text-align:right;">
            <a class="btn" data-url='${urlDat}' onclick="ompsEventRouter('jump',event);omps_noPop(event);">
                <span>${lang.jumpTip[3]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"
                    class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                    <path
                        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
            </a></div>`;
            if (!urlDat) urlBtn = "【发生错误，无法跳转】";
            return `
            <span class="name">${getTextSafe(name)}</span>
            &nbsp;:&nbsp;
            <span>
            ${lang.jumpTip[0]}${getTextSafe(name)}${lang.jumpTip[1]}${getTextSafe(title)}${lang.jumpTip[2]}${urlBtn}
            </span>
            `
        },
        share_url: (url) => {
            return `
            <span class="name">${lang.shareUrl}</span><br>
            <div><textarea style="background:rgba(0,0,0,0);color:white;width:90%;height:60px;">${url}</textarea></div>
            `
        },
    }


    // 向服务器发送数据
    var sendDat = (data) => {
        ws.send(JSON.stringify(data));
    }

    //=============页内通讯=====================
    function registeInPageMessage() {
        GM_window.addEventListener("message", inPageOnMessage);
        if (GM_window !== GM_window.top) {
            isTopWindow = false;
            GM_window.top.postMessage({
                fromApp: "OMPS",
                action: "reg"
            }, "*");
        } else {
            isTopWindow = true;
            topUrl = GM_window.location.href;
            topTitle = GM_window.document.title;
            OMPS_INFO();
        }
    }
    function inPageOnMessage(event) {
        var data = event.data;
        if ((data.fromApp || "") != "OMPS") return;
        if (data.action == "reg") {
            event.source.postMessage({
                fromApp: "OMPS",
                action: "setCode",
                url: topUrl,
                title: topTitle,
                code: getVideoCode(),
            }, "*");
            if (oneKeySetting.exist)
                event.source.postMessage({
                    fromApp: "OMPS",
                    action: "onekey",
                    data: oneKeySetting,
                }, "*");
            frameWindowObjs.push(event.source)
        } else if (data.action == "setHash") {
            GM_window.location.hash = event.data.val;
        } else if (data.action == "setCode") {
            topCode = data.code;
            topUrl = data.url;
            topTitle = data.title;
            LOGGER("[OMPS]TOP_CODE Received:" + topCode);
            detecVideoCode();
        } else if (data.action == "onekey") {
            oneKeySetting = data.data;
            applyOneKeySetting();
        } else if (data.action == "jumpUrl") {
            if (confirm(lang.jumpConfirm[0] +
                data.url +
                '\n' +
                lang.jumpConfirm[1])) {
                GM_window.location.href = data.url;
            }
        }

    }

    //=============视频识别代码计算==============

    function videoCodeOutdateEventRegist_title() {
        try {
            var titleEl = document.getElementsByTagName("title")[0];
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var MutationObserverConfig = {
                childList: true,
                subtree: true,
                characterData: true
            };
            var observer = new MutationObserver(function (mutations) {
                LOGGER("视频检测到标题变化");
                topUrl = GM_window.location.href;
                topTitle = GM_window.document.title;
                for (let i = 0; i < frameWindowObjs.length; i++) {
                    frameWindowObjs[i].postMessage({
                        fromApp: "OMPS",
                        action: "setCode",
                        url: topUrl,
                        title: topTitle,
                        code: getVideoCode(),
                    }, "*");
                }
                detecVideoCode();
            });
            observer.observe(titleEl, MutationObserverConfig);
        } catch (ignore) { }
    }
    //检测VideoCode是否过期
    function detecVideoCode() {
        if (!initFinish) return;
        let ovideoCode = videoCode;
        calcVideoCode(video, function () {
            if (videoCode != ovideoCode) {
                showToast(lang.videoChange, 1, 1);
                cleanUpVideo();
                showTip();
            } else setTimeout(detecVideoCode, 5000);
        });
    }
    //计算当前视频页面对应的VideoCode
    function getVideoCode() {
        var orgCode = GM_window.document.title;
        var tmpVideoCode = HASH.md5(orgCode);
        tmpVideoCode = tmpVideoCode.toUpperCase();
        return tmpVideoCode;
    }
    //更新VideoCode
    function calcVideoCode(_video, callBack, count = 0) {
        globalCount = 0;
        if (count > 10) {
            LOGGER("[OMPS]TOP_CODE Recv. timeout");
            video = null;
            globalCount = 24;
            videoCode = "";
            testVideo();
            return;
        }
        let t_videoCode = getVideoCode();
        if (!isTopWindow) {
            if (!topCode) {
                LOGGER("[OMPS]STILL WAITING TOP");
                return setTimeout(calcVideoCode, 1000, _video, callBack, (count || 0) + 1);
            } else {
                videoUrl = topUrl;
                videoTitle = topTitle;
                t_videoCode = HASH.md5(t_videoCode + topCode);
            }
        } else {
            videoUrl = GM_window.location.href;
            videoTitle = GM_window.document.title;
        }
        videoCode = t_videoCode.toUpperCase();
        callBack();
    }
    //视频调速
    function setVideoSpeed(speed) {
        currentRate = speed;
        if (video.playbackRate != speed)
            video.playbackRate = speed;
    }

    //==========TOAST提示条====================
    var toastElement;
    var toastTipLine;
    var toastTipLineMask;
    function showToast(text, time, imp) {
        if (time === undefined) time = -1;

        if (time != -1 && setting.silent && !imp) return hideToast();

        if (!toastElement) {
            toastElement = document.createElement("div");
            toastElement.className = "omps-tip"
            toastElement.onclick = noPop;
            video.parentNode.appendChild(toastElement);
        }

        toastCnt = time;
        toastElement.innerHTML = "<div>" + text + "</div>";
        toastElement.style.display = "block";
        setTimeout(() => {
            toastElement.classList.add("open");
        }, 100);
    }
    function hideToast(fh) {
        if (fh) {
            if (toastElement) toastElement.style.display = "none";
            toastCnt = 0;
        } else {
            if (toastElement) toastElement.classList.remove("open");
        }
    }
    function appendTipLine() {
        if (toastTipLine && toastTipLine.parentNode) {
            try { toastTipLine.parentNode.removeChild(toastTipLine) } catch (ignore) { };
        }
        if (toastTipLineMask && toastTipLineMask.parentNode) {
            try { toastTipLineMask.parentNode.removeChild(toastTipLineMask) } catch (ignore) { };
        }
        toastTipLine = document.createElement("div");
        toastTipLine.className = "omps-tipLine";
        toastTipLine.onmouseenter = toastTipLine.ontouchstart = function () {
            showToast(msgMaker.settingButtons(), 3, true);
        }
        toastTipLine.onclick = noPop;
        video.parentNode.appendChild(toastTipLine);

        toastTipLineMask = document.createElement("div");
        toastTipLineMask.className = "omps-tipLineMask";
        toastTipLineMask.onclick = function (event) {
            showToast(msgMaker.settingButtons(), 5, true);
            noPop(event)
        };
        video.parentNode.appendChild(toastTipLineMask);
    }

    //==========加入流程===========
    function ableToDirectJoin() {
        var lastJoinTime = parseInt(GM_get("lastTime", 0));
        var lastJoinDomain = GM_get("lastDomain", "");
        if (Date.now() - lastJoinTime < 60 * 1000 && lastJoinDomain == currentDomain) {
            LOGGER("[OMPS]:判断自动跳转视频，自动加入已生效");
            return true;
        }
        return false;
    }
    function updateDirectJoin() {
        GM_set("lastTime", Date.now());
        GM_set("lastDomain", currentDomain);
    }
    function showTip() {
        //STYLE_A 加入目标window，使得视频播放器中样式可用
        LOGGER("[OMPS]:已找到视频");
        var el = document.createElement("style");
        el.innerHTML = css;
        el.className = "OMPS_CSS";
        video.parentNode.appendChild(el);
        //B 在大window中加入样式
        el = document.createElement("style");
        el.innerHTML = css;
        el.className = "OMPS_CSS";
        document.body.appendChild(el);

        if (video.duration === Infinity) {
            showToast(lang.streamVideo, 3);
            return;
        }

        if (ableToDirectJoin() || setting.oneKeyJoin) {
            setting.oneKeyJoin = true;
            ompsEventRouter("create");
        } else if (setting.autoJoin && setting.userId && setting.group) {
            autoJoinCountDown = 3;
            showToast(msgMaker.joinPrep(autoJoinCountDown));
        } else
            showToast(msgMaker.joinAsk(), 20, 1);
    }
    var getVideosNextIframeList;
    //获取视频
    function testVideo() {
        if (globalCount <= 0) {
            return;
        }
        globalCount--;
        try {
            document.body.setAttribute("data-omps-injected", "true");
            video = null
            var videos = document.getElementsByTagName("video");
            for (let i = 0; i < videos.length; i++) {
                var v = videos[i];
                if (!video && document.body.offsetWidth < v.offsetWidth * 3) {
                    video = v;
                    break;
                }
            }
            if (getVideosNextIframeList) {
                for (let i = 0; i < getVideosNextIframeList.length; i++) {
                    try {
                        var frameBody = getVideosNextIframeList[i].contentDocument.body;
                        if (frameBody.getAttribute("data-omps-injected") == "true") continue;
                        if (frameBody.getAttribute("data-omps-injected") != "waitParent") {
                            frameBody.setAttribute("data-omps-injected", "waitParent");
                            globalCount++;
                            continue;
                        }
                        getVideosNextIframeList[i].contentWindow.ompsEventRouter = ompsEventRouter;
                        var videos = getVideosNextIframeList[i].contentDocument.getElementsByTagName("video");
                        for (let i = 0; i < videos.length; i++) {
                            var v = videos[i];
                            if (!video && frameBody.offsetWidth < v.offsetWidth * 3) {
                                video = v;
                                break;
                            }
                        }
                    } catch (e) { };
                }
            }
            getVideosNextIframeList = document.getElementsByTagName("iframe");
        } catch (e) {
            video = null;
        }
        if (video) {
            calcVideoCode(video, showTip);
        } else if (globalCount > 0)
            setTimeout(testVideo, 5000);
    }
    //连接网络
    function initNetwork() {
        videoTitle = topTitle;
        videoUrl = topUrl;

        if (trustKey == "none") {
            trustKey = HASH.md5(Date.now() + "--" + parseInt(Math.random() * 1000000));
            GM_set("trust", trustKey);
        }
        if (ws) {
            cleanUpVideo();
        }
        createTimer();
        ws = new WebSocket(URL);
        ws.onmessage = wsMsg;
        ws.onopen = () => setTimeout(() => {
            sendDat({
                type: "reg",
                user: setting.userId,
                group: videoCode + "-" + setting.group,
                trust: trustKey,
                title: videoTitle,
                url: videoUrl
            });
        }, 1000);
        ws.onclose = ws.onerror = () => {
            cleanUpVideo();
            errConnBreak = true;
            if (errConnBreak_tryCnt > 5) showToast(msgMaker.error("E_ERR_NET", false), -1, 10);
            else showToast(msgMaker.error("E_ERR_NET", parseInt(errConnBreak_reconn / 5)), -1, 10);
        }
    }

    //=========前端暴露函数=============
    var ompsEventRouter = GM_window.ompsEventRouter = function (name, event) {
        if (name == "config") {
            openSettingPanel();
        } else if (name == "create") {
            hideToast();
            if (setting.group && setting.userId) initNetwork();
            else openSettingPanel();
        } else if (name == "call") {
            sendDat({
                type: "call",
                time: video.currentTime * 1000 + localDelay
            });
        } else if (name == "sync") {
            sendDat({
                type: "sync"
            });
        } else if (name == "hide") {
            hideToast();
        } else if (name == "saveExit") {
            saveSettings();
            closeSettingPanel();
        } else if (name == "saveLink") {
            saveSettings();
            if (setting.group && setting.userId) {
                hideToast();
                initNetwork();
                closeSettingPanel();
            }
        } else if (name == "sendMsg") {
            sendMsg();
        } else if (name == "share") {
            createShare();
        } else if (name == "jump") {
            if (isTopWindow) {
                if (confirm(lang.jumpConfirm[0] + GM_window.atob(event.currentTarget.getAttribute('data-url')) + '\n' + lang.jumpConfirm[1])) {
                    GM_window.location = GM_window.atob(event.currentTarget.getAttribute('data-url'));
                }
            } else {
                GM_window.top.postMessage({ fromApp: "OMPS", action: "jumpUrl", url: window.atob(event.currentTarget.getAttribute('data-url')) }, '*');
            }
        } else if (name == "exit") {
            cleanUpVideo();
            showToast(msgMaker.joinAsk(), 20, 1);
        } else if (name == "noAuto") {
            autoJoinCountDown = -1;
            showToast(msgMaker.joinAsk(), 20, 1);
        }
    }
    var noPop = GM_window.omps_noPop = function (event) {
        event.stopPropagation();
    }

    //=========好友列表================
    var friends = {}, friendCountTick = 0, friCtr;
    function jumpToFriend(event) {
        noPop(event);
        var friid = event.currentTarget.getAttribute("data-friend-name");
        if (friends[friid].tick != friendCountTick) return;
        video.currentTime = (friends[friid].time - friends[setting.userId].time + lastTime) / 1000;
    }
    function addFriendItem(name) {
        var el = document.createElement("div");
        friCtr.appendChild(el);
        el.setAttribute("data-friend-name", name);
        el.onclick = jumpToFriend;
        friends[name] = {
            tick: friendCountTick,
            element: el,
            time: 0
        }
    }
    function removeFriendItem(name) {
        friCtr.removeChild(friends[name].element);
        delete friends[name];
    }
    function updateFriendList(list) {
        if (!friCtr) {
            friCtr = document.createElement("div");
            friCtr.className = "omps-friend"
            video.parentNode.appendChild(friCtr);
        }
        friendCountTick++;
        for (let i = 0; i < list.length; i++) {
            if (!friends[list[i].name]) addFriendItem(list[i].name);
            friends[list[i].name].time = list[i].time;
            if (list[i].name == setting.userId)
                friends[list[i].name].element.innerText = list[i].name + "(你) ";
            else {
                var strSig = "";
                if (list[i].time > lastTime) {
                    strSig = "+";
                }
                friends[list[i].name].element.innerText = list[i].name + "(" + strSig + ((list[i].time - lastTime) / 1000).toFixed(1) + "s) ";
            }
            friends[list[i].name].tick = friendCountTick;
        }
        for (const friid in friends) {
            if (Object.hasOwnProperty.call(friends, friid)) {
                if (friends[friid].tick != friendCountTick) {
                    friends[friid].element.className = "item offline";
                    if (friendCountTick - friends[friid].tick > 2) {
                        removeFriendItem(friid);
                    }
                } else {
                    friends[friid].element.className = "item";
                }
            }
        }
    }
    function hideFriendList() {
        if (friCtr) {
            friCtr.parentNode.removeChild(friCtr);
            friCtr = undefined;
            friends = {};
            friendCountTick = 0;
        }
    }
    //========消息====================
    var msgCtr, msgInput;
    function addMsgInput() {
        var msgInputE = document.createElement("div");
        msgInputE.className = "omps-chat-input tipPos";
        msgInputE.innerHTML = msgMaker.chat_input();
        msgInputE.onclick = noPop;
        video.parentNode.appendChild(msgInputE);
        msgInput = msgInputE.getElementsByTagName("input")[0];
        setTimeout(() => msgInputE.classList.remove("tipPos"), 3000);
    }
    function createMsg(from, msg, time) {
        if (from == setting.userId) time = "你";
        else if (time > 0) time = "+" + time + "s";
        else time += "s";
        createMsgRaw(msgMaker.chat_block(from, msg, time))
    }
    function createMsgRaw(msg, delTime) {
        if (!msgCtr) {
            msgCtr = document.createElement("div");
            msgCtr.className = "omps-chat";
            video.parentNode.appendChild(msgCtr);
        }
        var el = document.createElement("div")
        el.className = "item";
        el.innerHTML = msg
        msgCtr.appendChild(el);
        var hideTime = Math.max(Math.min(8000, msg.length * 400), 3000);
        if (delTime) hideTime = delTime;
        setTimeout(() => el.className = "item open", 200);
        setTimeout(() => el.className = "item", hideTime + 200);
        setTimeout(() => msgCtr.removeChild(el), hideTime + 600);
    }
    function sendMsg() {
        var text = msgInput.value;
        msgInput.value = "";
        if (!text) return;
        sendDat({
            type: "msg",
            time: parseInt(video.currentTime * 1000),
            msg: text
        })
    }
    //=======分享URL====================
    function createShare() {
        if (!topUrl && !isTopWindow) {
            createMsg(lang.waitTop[0], lang.waitTop[1], 4000);
            return;
        }
        var url = topUrl + "#&OMPS_room=" + setting.group + "&OMPS_join";
        createMsgRaw(msgMaker.share_url(url), 10000);
    }
    function parseShareHash() {
        try {
            //一键加入放映厅等功能
            var oneKeyCommand = GM_window.location.hash;
            if (oneKeyCommand.charAt(0) == "#") oneKeyCommand = oneKeyCommand.slice(1);

            if (oneKeyCommand) {
                LOGGER("[OMPS]:正在处理一键链接参数");
                oneKeySetting.exist = true;
                var newHashLst = [];
                var commandList = oneKeyCommand.split("&");
                for (let i = 0; i < commandList.length; i++) {
                    var cmd = commandList[i].split("=");
                    if (cmd.length == 2 && cmd[0] == "OMPS_room") {
                        oneKeySetting.group = cmd[1];
                    } else if (cmd.length == 1 && cmd[0] == "OMPS_join") {
                        oneKeySetting.oneKeyJoin = true;
                    } else {
                        newHashLst.push(cmd.join("="));
                    }
                }
                GM_window.location.hash = newHashLst.join("&");
            }
        } catch (e) {
            LOGGER(`[OMPS][ERROR]:${e}`);
        }
        applyOneKeySetting();
        for (let i = 0; i < frameWindowObjs.length; i++) {
            frameWindowObjs[i].postMessage({
                fromApp: "OMPS",
                action: "onekey",
                data: oneKeySetting,
            }, "*");
        }
    }
    function applyOneKeySetting() {
        if (oneKeySetting.exist) {
            if (oneKeySetting.group) setting.group = oneKeySetting.group;
            if (oneKeySetting.oneKeyJoin) setting.oneKeyJoin = true;
            if (video) {
                if (setting.group && setting.userId) { initNetwork(); }
                else if (oneKeyJoin) {
                    openSettingPanel();
                }
            }
        }

    }
    //=======全局计时器与事件分支===========
    function cleanUpVideo() {//【退出放映厅】清理计时器，断开连接
        try { ws.onclose = ws.onerror = () => { }; } catch (e) { }
        try { ws.close(); } catch (e) { }
        initFinish = false;
        clearInterval(videoInterValId);
        if (toastTipLine && toastTipLine.parentNode) {
            try { toastTipLine.parentNode.removeChild(toastTipLine) } catch (ignore) { };
        }
        if (toastTipLineMask && toastTipLineMask.parentNode) {
            try { toastTipLineMask.parentNode.removeChild(toastTipLineMask) } catch (ignore) { };
        }
        hideFriendList();
    }

    function createTimer() {//创建视频计时器（200ms）
        var reportPtns = 0;
        videoInterValId = setInterval(() => {
            reportPtns++;
            if (reportPtns == 100) reportPtns = 0;
            if (initFinish) {
                timerCount++;
                timerCount %= 40;
                if (timerCount % 20 == 0) {
                    if ((setting.friend || (isPausedShowList && !setting.silent))) {
                        sendDat({ type: "list" });
                    } else hideFriendList();
                }
                if (timerCount == 0) {
                    tmpLocalDelay = Date.now();
                    sendDat({ type: "delay" });
                }

                var currentTime = parseInt(video.currentTime * 1000);
                if (
                    (timerCount % 2 == 0 && currentTime != lastTime)
                ) {
                    sendDat({
                        type: "ping",
                        time: currentTime + localDelay
                    });
                    lastTime = currentTime;
                }
                if (currentRate != video.playbackRate) {
                    setVideoSpeed(video.playbackRate);
                    sendDat({
                        type: "speed",
                        speed: currentRate
                    });
                }
                if (pauseAt != -1 && video.currentTime >= pauseAt) {
                    video.pause();
                    showToast(msgMaker.pauseMsg(pauseUser));
                    isPausedShowList = true;
                    pauseAt = -1;
                }
            }
        }, 200);
    }

    setInterval(() => {//全局事件计时器（Toast计时，重连计时等）
        if (toastCnt > 0) {
            if (--toastCnt == 0) {
                hideToast();
                setTimeout(() => {
                    if (toastCnt == 0) hideToast(1);
                }, 1000);
            }
        }
        if (errConnBreak && errConnBreak_reconn > 0) {
            if (errConnBreak_tryCnt > 5) {
                errConnBreak_reconn = -1;
            }
            errConnBreak_reconn--;
            if (errConnBreak_reconn == 0) {
                errConnBreak_tryCnt++;
                errConnBreak = false;
                errConnBreak_reconn = errConnBreak_tryCnt * 10 + 2;
                ompsEventRouter('create');
                showToast(lang.autoReconn, 3);
            }
        }
        if (autoJoinCountDown > 0) {
            autoJoinCountDown--;
            if (autoJoinCountDown == 0) {
                hideToast();
                ompsEventRouter("create");
            } else {
                showToast(msgMaker.joinPrep(autoJoinCountDown));
            }
        }
    }, 1000);
    var wsMsg = (e) => {//WEBSOCKET事件响应
        var data = JSON.parse(e.data), time, realTime;
        LOGGER(data);
        if (data.time) {
            time = (data.time + localDelay) / 1000;
            realTime = (data.time) / 1000;
        }
        switch (data.type) {
            case "init":
                errConnBreak = false;
                errConnBreak_tryCnt = 0;
                errConnBreak_reconn = 10;
                if (data.time != 0) {
                    initTime = data.time;
                } else initTime = 0;
                localDelay = 0;
                pauseAt = -1;
                tmpLocalDelay = Date.now();
                sendDat({ type: "delay" });
                isPausedShowList = false;
                appendTipLine();
                toastTipLine.style.backgroundColor = "#a5d6a7";
                try {
                    video.play();
                    hideToast();
                } catch (e) {
                    showToast(msgMaker.playFail());
                }
                break;
            case "delay":
                updateDirectJoin();
                localDelay = parseInt((Date.now() - tmpLocalDelay) / 2);
                if (initTime != 0) {
                    video.currentTime = (initTime + 3 * localDelay) / 1000;
                    initTime = 0;
                }
                if (localDelay > 600) {
                    toastTipLine.style.backgroundColor = "#fff59d";
                    showToast(msgMaker.delayTip(localDelay), 2);
                } else {
                    toastTipLine.style.backgroundColor = "#a5d6a7";
                }
                if (!initFinish) {
                    setTimeout(() => {
                        initFinish = true;
                        detecVideoCode();
                        var delayTime = 5;
                        if (setting.autoJoin || setting.oneKeyJoin) delayTime = 12;
                        showToast(msgMaker.success(videoCode, localDelay, setting.group), delayTime, 1);
                    }, 1000);
                    if (setting.showMsgIpt) {
                        addMsgInput();
                    }
                }
                break;
            case "pause":
                //服务器发送Pause指令
                //      指令包含：
                //          切换时间戳
                toastTipLine.style.backgroundColor = "#ffab91";
                if (video.currentTime >= time) {
                    isPausedShowList = true;
                    video.pause();
                    showToast(msgMaker.pauseMsg(data.foru));
                } else {
                    pauseAt = time;
                    pauseUser = data.foru;
                    if (pauseUser == setting.userId) {
                        showToast(msgMaker.pauseFor(video.paused));
                    }
                }

                break;
            case "play":
                //服务器发送Play指令
                pauseAt = -1;
                isPausedShowList = false;
                if (video.currentTime > time) video.currentTime = time;
                setVideoSpeed(baseSpeed);
                toastTipLine.style.backgroundColor = "#a5d6a7";
                try {
                    video.play();
                    showToast(msgMaker.syncSuccess(), 1);
                } catch (e) {
                    showToast(msgMaker.playFail());
                }
                break;
            case "join":
                createMsg(data.user, msgMaker.playerJoin(data.user), 0);
                break;
            case "leave":
                createMsg(data.user, msgMaker.playerLeave(data.user), 0);
                break;
            case "unsync":
                toastTipLine.style.backgroundColor = "#ffab91";
                isPausedShowList = true;
                let deltaTime = (time - video.currentTime).toFixed(1);
                if (deltaTime >= 0) deltaTime = "+" + deltaTime;
                if (data.target != setting.userId)
                    showToast(msgMaker.unsync(data.target, deltaTime));
                else
                    showToast(msgMaker.unsync_top());
                pauseAt = -1;
                break;
            case "sync":
                toastTipLine.style.backgroundColor = "#a5d6a7";
                video.currentTime = (realTime);
                if (data.wait) {
                    video.pause();
                }
                pauseAt = -1;
                showToast(msgMaker.syncSuccess(), 1);
                isPausedShowList = false;
                break;
            case "error":
                cleanUpVideo();
                showToast(msgMaker.error(data.msg), -1, 10);
                isPausedShowList = false;
                break;
            case "list":
                if (setting.friend || (isPausedShowList && !setting.silent)) {
                    updateFriendList(data.list);
                }
                break;
            case "msg":
                if (!setting.hideMsg) {
                    createMsg(data.name, data.msg, parseFloat(realTime - video.currentTime).toFixed(1));
                }
                break;
            case "userJmp":
                if (data.title && !setting.hideMsg) {
                    createMsgRaw(msgMaker.userJump(data.name, data.title, data.url), 10000);
                }
                break;
            case "slow":
                toastTipLine.style.backgroundColor = "#fff59d";
                if (setting.noRateSync) break;
                if (video.currentTime >= time) {
                    if (tipSpeed && !setting.silent) {
                        showToast(lang.usingSpeedControl, 4);
                        tipSpeed = false;
                    }
                    setVideoSpeed(baseSpeed * 0.95);
                } else {
                    setVideoSpeed(baseSpeed);
                }
                break;
            case "noslow":
                toastTipLine.style.backgroundColor = "#a5d6a7";
                setVideoSpeed(baseSpeed);
                break;
            case "speed":
                baseSpeed = data.speed;
                setVideoSpeed(baseSpeed);
                break;
            default:
                break;
        }
    }

    //=======MD5 JS========
    !function (n) { "use strict"; function d(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function f(n, t, r, e, o, u) { return d((u = d(d(t, n), d(e, u))) << o | u >>> 32 - o, r) } function l(n, t, r, e, o, u, c) { return f(t & r | ~t & e, n, t, o, u, c) } function g(n, t, r, e, o, u, c) { return f(t & e | r & ~e, n, t, o, u, c) } function v(n, t, r, e, o, u, c) { return f(t ^ r ^ e, n, t, o, u, c) } function m(n, t, r, e, o, u, c) { return f(r ^ (t | ~e), n, t, o, u, c) } function c(n, t) { var r, e, o, u; n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t; for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)c = l(r = c, e = f, o = i, u = a, n[h], 7, -680876936), a = l(a, c, f, i, n[h + 1], 12, -389564586), i = l(i, a, c, f, n[h + 2], 17, 606105819), f = l(f, i, a, c, n[h + 3], 22, -1044525330), c = l(c, f, i, a, n[h + 4], 7, -176418897), a = l(a, c, f, i, n[h + 5], 12, 1200080426), i = l(i, a, c, f, n[h + 6], 17, -1473231341), f = l(f, i, a, c, n[h + 7], 22, -45705983), c = l(c, f, i, a, n[h + 8], 7, 1770035416), a = l(a, c, f, i, n[h + 9], 12, -1958414417), i = l(i, a, c, f, n[h + 10], 17, -42063), f = l(f, i, a, c, n[h + 11], 22, -1990404162), c = l(c, f, i, a, n[h + 12], 7, 1804603682), a = l(a, c, f, i, n[h + 13], 12, -40341101), i = l(i, a, c, f, n[h + 14], 17, -1502002290), c = g(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510), a = g(a, c, f, i, n[h + 6], 9, -1069501632), i = g(i, a, c, f, n[h + 11], 14, 643717713), f = g(f, i, a, c, n[h], 20, -373897302), c = g(c, f, i, a, n[h + 5], 5, -701558691), a = g(a, c, f, i, n[h + 10], 9, 38016083), i = g(i, a, c, f, n[h + 15], 14, -660478335), f = g(f, i, a, c, n[h + 4], 20, -405537848), c = g(c, f, i, a, n[h + 9], 5, 568446438), a = g(a, c, f, i, n[h + 14], 9, -1019803690), i = g(i, a, c, f, n[h + 3], 14, -187363961), f = g(f, i, a, c, n[h + 8], 20, 1163531501), c = g(c, f, i, a, n[h + 13], 5, -1444681467), a = g(a, c, f, i, n[h + 2], 9, -51403784), i = g(i, a, c, f, n[h + 7], 14, 1735328473), c = v(c, f = g(f, i, a, c, n[h + 12], 20, -1926607734), i, a, n[h + 5], 4, -378558), a = v(a, c, f, i, n[h + 8], 11, -2022574463), i = v(i, a, c, f, n[h + 11], 16, 1839030562), f = v(f, i, a, c, n[h + 14], 23, -35309556), c = v(c, f, i, a, n[h + 1], 4, -1530992060), a = v(a, c, f, i, n[h + 4], 11, 1272893353), i = v(i, a, c, f, n[h + 7], 16, -155497632), f = v(f, i, a, c, n[h + 10], 23, -1094730640), c = v(c, f, i, a, n[h + 13], 4, 681279174), a = v(a, c, f, i, n[h], 11, -358537222), i = v(i, a, c, f, n[h + 3], 16, -722521979), f = v(f, i, a, c, n[h + 6], 23, 76029189), c = v(c, f, i, a, n[h + 9], 4, -640364487), a = v(a, c, f, i, n[h + 12], 11, -421815835), i = v(i, a, c, f, n[h + 15], 16, 530742520), c = m(c, f = v(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844), a = m(a, c, f, i, n[h + 7], 10, 1126891415), i = m(i, a, c, f, n[h + 14], 15, -1416354905), f = m(f, i, a, c, n[h + 5], 21, -57434055), c = m(c, f, i, a, n[h + 12], 6, 1700485571), a = m(a, c, f, i, n[h + 3], 10, -1894986606), i = m(i, a, c, f, n[h + 10], 15, -1051523), f = m(f, i, a, c, n[h + 1], 21, -2054922799), c = m(c, f, i, a, n[h + 8], 6, 1873313359), a = m(a, c, f, i, n[h + 15], 10, -30611744), i = m(i, a, c, f, n[h + 6], 15, -1560198380), f = m(f, i, a, c, n[h + 13], 21, 1309151649), c = m(c, f, i, a, n[h + 4], 6, -145523070), a = m(a, c, f, i, n[h + 11], 10, -1120210379), i = m(i, a, c, f, n[h + 2], 15, 718787259), f = m(f, i, a, c, n[h + 9], 21, -343485551), c = d(c, r), f = d(f, e), i = d(i, o), a = d(a, u); return [c, f, i, a] } function i(n) { for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)t += String.fromCharCode(n[e >> 5] >>> e % 32 & 255); return t } function a(n) { var t = []; for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1)t[e] = 0; for (var r = 8 * n.length, e = 0; e < r; e += 8)t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32; return t } function e(n) { for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)t = n.charCodeAt(o), e += r.charAt(t >>> 4 & 15) + r.charAt(15 & t); return e } function r(n) { return unescape(encodeURIComponent(n)) } function o(n) { return i(c(a(n = r(n)), 8 * n.length)) } function u(n, t) { return function (n, t) { var r, e = a(n), o = [], u = []; for (o[15] = u[15] = void 0, 16 < e.length && (e = c(e, 8 * n.length)), r = 0; r < 16; r += 1)o[r] = 909522486 ^ e[r], u[r] = 1549556828 ^ e[r]; return t = c(o.concat(a(t)), 512 + 8 * t.length), i(c(u.concat(t), 640)) }(r(n), r(t)) } function t(n, t, r) { return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n)) } "function" == typeof define && define.amd ? define(function () { return t }) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t }(HASH);
    GM_window.onload = () => {
        try {
            document.body.setAttribute("data-omps-injected", "true");
        } catch (e) { }
    }


    registeInPageMessage();
    parseShareHash();
    videoCodeOutdateEventRegist_title();
    testVideo();
})();