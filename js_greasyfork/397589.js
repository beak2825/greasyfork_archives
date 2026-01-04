// ==UserScript==
// @name         csscloud flash 播放器替换
// @namespace    https://home.asec01.net/
// @version      0.4.2
// @description  将 csscloud 的 flash 播放器换为 DPlayer
// @author       Zhe Zhang
// @license      MIT
// @supportURL   https://github.com/zzzz0317/csscloud-flash-player-replacer/
// @icon         https://github.com/zzzz0317/csscloud-flash-player-replacer/raw/master/favicon_csscloud.ico
// @match        http://view.csslcloud.net/api/view/*
// @match        https://view.csslcloud.net/api/view/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/flv.js@1.5.0/dist/flv.min.js
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.25.1/dist/DPlayer.min.js
// @require      https://cdn.jsdelivr.net/npm/Base64@1.1.0/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/397589/csscloud%20flash%20%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/397589/csscloud%20flash%20%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

(function () {

    var zzValue = {
        "name": "ZZ 的播放器替换脚本",
        "projectLink": "https://github.com/zzzz0317/csscloud-flash-player-replacer/",
        "mainMsg": "欢迎使用 ZZ 的 csscloud 播放器替换脚本",
        "mainMsgShowTime": 5000
    };

    var playerSettings = {
        'showNameInDanmaku': false,
        'preventLivePause': false,
        'preventRetryError': false
    };

    function readPlayerSettings() {
        var v = GM_getValue('playerSettings');
        if (v != undefined) {
            playerSettings = v;
        } else {
            savePlayerSettings();
        }
    }

    function savePlayerSettings() {
        GM_setValue('playerSettings', playerSettings);
    }

    function setPlayerSettings(item, value) {
        playerSettings[item] = value;
        savePlayerSettings();
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }

    var dp;
    var dpContextMenu = [
        {
            text: getZZValue("name"),
            link: getZZValue("projectLink"),
        },
        {
            text: '弹幕发送者显示开关',
            click: (player) => {
                setPlayerSettings("showNameInDanmaku", !playerSettings.showNameInDanmaku);
                if (playerSettings.showNameInDanmaku) {
                    player.notice("显示弹幕发送者");
                } else {
                    player.notice("不显示弹幕发送者");
                }
            },
        },
        {
            text: '阻止暂停开关',
            click: (player) => {
                setPlayerSettings("preventLivePause", !playerSettings.preventLivePause);
                if (playerSettings.preventLivePause) {
                    player.notice("阻止暂停功能已打开");
                } else {
                    player.notice("阻止暂停功能已关闭");
                }
            },
        },
        {
            text: '阻止失败刷新开关',
            click: (player) => {
                setPlayerSettings("preventRetryError", !playerSettings.preventRetryError);
                if (playerSettings.preventRetryError) {
                    player.notice("阻止失败刷新功能已打开");
                } else {
                    player.notice("阻止失败刷新功能已关闭");
                }
            },
        },
        {
            text: '复制视频链接到剪贴板',
            click: (player) => {
                zzlog("视频链接:\n" + player.options.video.url);
                GM_setClipboard(player.options.video.url);
            },
        },
        {
            text: '输出播放器信息到控制台',
            click: (player) => {
                console.log(player);
            },
        },
        {
            text: '--------------------'
        },
    ];

    function playLive(u) {
        zzlog("监听聊天框");
        var targetNode = document.getElementById('chat-list');
        var config = {attributes: true, childList: true, subtree: true};
        const mutationCallback = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type == "childList") {
                    var nodeElem = mutation.addedNodes[1];
                    console.log(nodeElem);
                    var displayContent = nodeElem.getElementsByClassName("peo-chat")[0].getElementsByClassName("chat-content")[0].innerHTML;
                    if (playerSettings.showNameInDanmaku) {
                        var displayName = nodeElem.getElementsByClassName("peo-names")[0].innerText;
                        addDanmaku(displayName + " : " + displayContent);
                    } else {
                        addDanmaku(displayContent);
                    }
                }
            }
        };
        var observer = new MutationObserver(mutationCallback);
        observer.observe(targetNode, config);

        zzlog("playLive播放链接:\n" + u);
        dp = new DPlayer({
            container: document.getElementById('videoElement'),
            autoplay: true,
            live: true,
            screenshot: true,
            volume: 1,
            danmaku: true,
            contextmenu: dpContextMenu,
            apiBackend: {
                read: function (endpoint, callback) {
                    endpoint.success();
                },
                send: function (endpoint, danmakuData, callback) {
                    observer.disconnect();
                    console.log(endpoint);
                    zzlog("发送弹幕: " + endpoint.data.text);
                    jq("#chatContent").val(endpoint.data.text);
                    sendChatMsg();
                    endpoint.success();
                    setTimeout(function () {
                        observer.observe(targetNode, config);
                    }, 200);
                },
            },
            video: {
                url: u,
            },
        });
        dp.on('pause', function () {
            if (playerSettings.preventLivePause) {
                dp.play();
                dp.notice("直播，请不要暂停", 1000);
            } else {
                dp.notice("直播，建议不要暂停", 1000);
            }
        });

        dp.plugins.flvjs.on(flvjs.Events.ERROR, (errType, errDetail) => {
            if (playerSettings.preventRetryError) {
                dp.notice("拉流出错，播放停止", 1000);
            } else {
                dp.notice("拉流出错，刷新页面中......", 1000);
                location.reload();
            }
        });

        setTimeout(function () {
            var catchFrame = false;

            function readLoop() {
                var maxDelay = 8;
                var catchFrameSpeed = 1.5;
                var currentTime = dp.video.currentTime;
                var bufferedEnd = dp.video.buffered.end(0);
                var bufferedLength = dp.video.buffered.length;
                var delayTime = bufferedEnd - currentTime;
                zzlog("延迟定时检测\n" + "dp.video.currentTime: " + currentTime +
                    "\ndp.video.buffered.end(0): " + bufferedEnd +
                    "\ndp.video.buffered.length: " + bufferedLength);
                if (bufferedLength > 0 && delayTime > maxDelay) {
                    zzlog("延迟" + delayTime + "秒，追帧");
                    dp.speed(catchFrameSpeed);
                    catchFrame = true;
                    setTimeout(function () {
                        dp.speed(1);
                        catchFrame = false;
                        zzlog("追帧完成\n" + "dp.video.currentTime: " + dp.video.currentTime +
                            "\ndp.video.buffered.end(0): " + dp.video.buffered.end(0) +
                            "\ndp.video.buffered.length: " + dp.video.buffered.length);
                    }, (delayTime - 3) * 1000);
                    // dp.video.currentTime = bufferedEnd - 3;
                }
            }

            setInterval(function () {
                if (catchFrame) {
                    zzlog("正在追帧，取消本次追帧检测");
                } else {
                    readLoop();
                }
            }, 10000);

        }, 10000);
        zzWelcomeDanmaku();
    }

    var danmakuArray = [];

    function playLink(u) {
        zzlog("playLink播放链接:\n" + u);
        dp = new DPlayer({
            container: document.getElementById('videoElement'),
            autoplay: true,
            live: false,
            screenshot: true,
            volume: 1,
            danmaku: true,
            contextmenu: dpContextMenu,
            apiBackend: {
                read: function (endpoint, callback) {
                    endpoint.success();
                },
                send: function (endpoint, danmakuData, callback) {
                    endpoint.success();
                },
            },
            video: {
                url: u,
            },
        });

        function readLoop() {
            var currentTime = dp.video.currentTime;
            var cTime = parseInt(currentTime);
            danmakuArray.forEach(function (item) {
                //console.log(item);
                if (item.time == cTime) {
                    if (playerSettings.showNameInDanmaku) {
                        addDanmaku(item.userName + " : " + showEm(item.content));
                    } else {
                        addDanmaku(showEm(item.content));
                    }
                    var realTimeMsg = {
                        userid: item.userId,
                        username: item.userName,
                        msg: item.content,
                        time: item.time
                    };
                    on_cc_live_chat_msg(realTimeMsg);
                }
            })
        }

        var readInter;
        dp.on('pause', function () {
            zzlog('播放暂停');
            clearInterval(readInter);
        });
        dp.on('play', function () {
            zzlog('播放');
            readInter = setInterval(function () {
                readLoop()
            }, 1000);
        });
        zzWelcomeDanmaku();
    }

    function addDanmaku(t) {
        const danmaku = {
            text: t,
            color: '#ffffff',
            type: 'right',
        };
        dp.danmaku.draw(danmaku);
    }

    function zzlog(t) {
        console.log("%cZZ csscloud userscript\n%c" + t, "font-weight:bold", "");
    }

    function zzWelcome() {
        console.log("\n" +
            "%cZZ Injected\n" +
            "%c\n欢迎使用 ZZ 的 csscloud 播放器替换脚本\n" +
            "项目主页：https://github.com/zzzz0317/csscloud-flash-player-replacer/\n" +
            "作者主页：https://home.asec01.net/\n", "font-size:20pt", "");
    }

    function zzWelcomeDanmaku() {
        dp.notice(getZZValue("mainMsg"), getZZValue("mainMsgShowTime"));
    }

    function refreshZZValue() {
        var v = GM_getValue('zzValue');
        if (v != undefined) {
            zzValue = v;
        }
        jq.ajax({
            method: 'GET',
            url: '//www.zhangzhe-tech.cn/copyright-files/csscloud-flash-player-replacer.json',
            data: {
                rand: Math.ceil(Math.random() * 1000)
            },
            success: function (data) {
                console.log(data);
                zzValue = data.data;
                GM_setValue('zzValue', zzValue);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                zzlog("refreshValueError: " + textStatus + " " + jqXHR.status + " " + errorThrown);
            }
        });
    }

    function getZZValue(item) {
        var v = "";
        try {
            v = zzValue[item];
        } catch (err) {
            v = "Unknown value";
            zzlog("getValueError: " + err.description);
        }
        return v;
    }

    'use strict';
    zzWelcome();
    zzlog("初始化");
    var isHttps = 'https:' == document.location.protocol ? true : false;
    var roomId = getQueryVariable("roomid");
    var recordId = getQueryVariable("recordid");
    var liveId = getQueryVariable("liveid");
    var userId = getQueryVariable("userid");
    zzlog("roomId: " + roomId);
    zzlog("recordId: " + recordId);
    zzlog("liveId: " + recordId);
    zzlog("userId: " + userId);
    zzlog("isHttps: " + isHttps);
    readPlayerSettings();
    jq(document).ready(function () {
        zzlog("Dom加载完成");
        var livePlayer = jq('#doc-main');
        if (livePlayer.length == 1) {
            // jq(livePlayer).html('<video id="videoElement" height="100%" width="100%" autoplay controls></video>');
            jq(livePlayer).html('<div id="videoElement"></div>');
        }
        GM_addStyle(".videoElement { width: 100%; height: 100%; }");
        GM_addStyle(".dplayer { width: 100%; height: 100%; }");
        GM_addStyle(".video-middle { background-color: black; }");

        if (recordId == false) {
            if (roomId == false) {
                zzlog("参数错误 - 未获取到roomid和recordId");
            } else {
                zzlog("直播模式");
                playLive('//stream-ali1.csslcloud.net/src/' + roomId + '.flv');
            }
        } else {
            zzlog("回放模式");
            GM_addStyle("#doc-main { height: 100%; }");
            var lmb = document.getElementsByClassName("l-m-b")[0];
            lmb.style.display = "none";

            jq.ajax({
                method: 'GET',
                url: '//view.csslcloud.net/api/vod/v2/play/h5',
                data: {
                    recordid: recordId,
                    userid: userId
                },
                success: function (data) {
                    //console.log(data);
                    var linkObj = data["video"][0];
                    var link = "";
                    if (isHttps) {
                        link = linkObj["secureplayurl"];
                    } else {
                        link = linkObj["playurl"];
                    }
                    playLink(link);
                }
            });
            jq.ajax({
                method: 'GET',
                url: '//view.csslcloud.net/api/view/replay/chatqa/info',
                data: {
                    roomid: roomId,
                    liveid: liveId,
                    recordid: recordId,
                    userid: userId
                },
                success: function (data) {
                    // console.log(data);
                    danmakuArray = data.datas.meta.chatLog;
                }
            });

        }
    });
    refreshZZValue();
})();
