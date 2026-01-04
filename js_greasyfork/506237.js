// ==UserScript==
// @name         BiliBili自动跳过广告
// @namespace    AWang_Dog/bilibili-StepOverADS
// @version      0.2.3
// @description  自动跳过视频中的广告
// @author       AWang_Dog
// @license      GPLv3
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=
// @match        *://*.bilibili.com/video/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @website      https://github.com/AWangDog/bilibili-StepOverADS
// @supportURL   https://github.com/AWangDog/bilibili-StepOverADS/issues
// @downloadURL https://update.greasyfork.org/scripts/506237/BiliBili%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/506237/BiliBili%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
var jmpStart_ID
var jmpADS_ID
var jmpEND_ID
var startActived

(async function() {
    'use strict';
    console.log('StepOverADS-脚本开始执行');
    startActived = GM_getValue('startActived', {jmpStart: false, jmpADS: true, jmpEnd: false});
    GM_setValue('startActived', startActived);
    // 初始化
    registerMenuCommand(startActived); // 注册菜单
    const videoId = getVideoId(); // 获取视频id
    var player = getPlayer(); // 获取视频播放器
    const adInfo = await getADInfo(videoId); // 获取跳转时间信息
    listen(player, adInfo)

})();

function listen(player, adInfo) {
    const TimeInter = getTimeInter(adInfo) // 获取全部时间区间
    // 监听视频播放器
    player.addEventListener('timeupdate', function() {
        for (let interval of TimeInter) {
            if (player.currentTime >= interval[1] && player.currentTime <= interval[2]) {
                console.log("StepOverADS-当前位于需跳转时间段中");
                if (interval[0] == "start" && startActived.jmpStart) {
                    console.log("StepOverADS-跳过片头: 已由" + player.currentTime + "跳到" + interval[2]);
                    player.currentTime = interval[2]
                }
                else if (interval[0] == "ads" && startActived.jmpADS) {
                    console.log("StepOverADS-跳过广告: 已由" + player.currentTime + "跳到" + interval[2]);
                    player.currentTime = interval[2]
                }
                else if (interval[0] == "end" && startActived.jmpEnd) {
                    console.log("StepOverADS-跳过片尾: 已由" + player.currentTime + "跳到" + interval[2]);
                    player.currentTime = interval[2]
                }
            }
        }
    });
}

// 获取视频播放器
function getPlayer() {
    var video = document.querySelector('video');
    if (video) {
        console.info('StepOverADS-视频播放器已加载');
        return video;
    } else {
        console.error('StepOverADS-视频播放器未加载');
        return null;
    };
};

// 获取视频id
function getVideoId() {
    const url = window.location.href;
    console.info('StepOverADS-视频url:', url);
    const match = url.match(/BV\w+/);
    if (match) {
        console.info('StepOverADS-视频id:', match[0]);
        return match[0].trim();
    } else {
        console.error('StepOverADS-未找到视频id');
        return null;
    };
};

// 获取广告信息
async function getADInfo(videoId) {
    try {
        // 使用fetch API获取JSON文件
        const response = await fetch('https://raw.githubusercontent.com/AWangDog/bilibili-StepOverADS/main/ads_jump.json');

        // 检查响应是否成功
        if (!response.ok) {
            console.error(`StepOverADS-HTTP error: ${response.status}`);
        }

        // 将响应解析为JSON并返回
        const data = await response.json();
        console.info('StepOverADS-广告信息获取成功: ', data);
        if (data.hasOwnProperty(videoId)) {
            console.info('StepOverADS-找到此视频广告信息: ', data[videoId]);
            return data[videoId];
        } else {
            console.warn('StepOverADS-未找到广告信息');
            return null;
        }
    } catch (error) {
        console.error('StepOverADS-Error fetching AD info:', error);
        return null;
    }
}

// 注册脚本菜单
function registerMenuCommand(startActived) {
    if (jmpStart_ID) {GM_unregisterMenuCommand(jmpStart_ID); GM_unregisterMenuCommand(jmpADS_ID); GM_unregisterMenuCommand(jmpEND_ID)}
    jmpStart_ID = GM_registerMenuCommand(`${startActived.jmpStart?'✅':'❌'} 跳过片头`, function() {startActived.jmpStart = !startActived.jmpStart; GM_setValue('startActived', startActived);registerMenuCommand(startActived)});
    jmpADS_ID = GM_registerMenuCommand(`${startActived.jmpADS?'✅':'❌'} 跳过广告`, function() {startActived.jmpADS = !startActived.jmpADS; GM_setValue('startActived', startActived);registerMenuCommand(startActived)});
    jmpEND_ID = GM_registerMenuCommand(`${startActived.jmpEnd?'✅':'❌'} 跳过片尾`, function() {startActived.jmpEnd = !startActived.jmpEnd; GM_setValue('startActived', startActived);registerMenuCommand(startActived)});
}
// 获取时间区间
function getTimeInter(data) {
    let result = [];
    let maxEndTime = 10000000000; // 定义一个非常大的结束时间

    // 处理 "start"
    try {
        if (data.start && Array.isArray(data.start)) {
            // 将 "start" 部分合并成一个时间段
            let startTimes = data.start.sort((a, b) => a - b);
            result.push(["start", startTimes[0], startTimes[startTimes.length - 1]]);
        } else {console.warn("StepOverADS-未找到片头信息: ")}
    } catch (error) {
        console.warn("StepOverADS-未找到片头信息: ", error);
    }

    // 处理 "ads"
    try {
        if (data.ads && Array.isArray(data.ads)) {
            data.ads.forEach(ad => {
                if (Array.isArray(ad) && ad.length === 2) {
                    const ads = ["ads", ad[0], ad[1]]
                    result.push(ads);
                }
            });
        } else {console.warn("StepOverADS-未找到广告信息: ")}
    } catch (error) {
        console.warn("StepOverADS-未找到广告信息: ", error);
    }

    // 处理 "end"
    try {
        if (data.end && Array.isArray(data.end)) {
            data.end.forEach(endTime => {
                result.push(["end", endTime, maxEndTime]);
            });
        } else {console.warn("StepOverADS-未找到片尾信息: ")}
    } catch (error) {
        console.warn("StepOverADS-未找到片尾信息: ", error);
    }
    console.info('StepOverADS-全部时间段: ', result);
    return result;
}
