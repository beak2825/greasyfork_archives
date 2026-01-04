// ==UserScript==
// @name         黄金右键-灵活控制视频倍速(改)-Golden Right-Flexibly control the playback rate of videos (edited)
// @description     长按"→"键加速倍速播放, 松开"→"键恢复用户初始速度, 点击">"加速倍速增加, 点击"<"加速倍速减小, 点击"?"重置正常速度到1倍速, 重置加速速度到2倍速, 灵活追剧看视频~ 支持b站、YouTube、腾讯视频、优酷...
// @description:en  Hold '→': speed up playback, release '→': return to normal speed, press '<': decrease faster playback speed, press '>': increase faster playback speed, press '?': reset normal speed to 1 and faster playback speed to 2. 
// @namespace    http://tampermonkey.net/
// @version      1.1.1.7
// @author       SkyJin (作者) & SteveQian (修改)
// @include     http://*
// @include     https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495538/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE-%E7%81%B5%E6%B4%BB%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%28%E6%94%B9%29-Golden%20Right-Flexibly%20control%20the%20playback%20rate%20of%20videos%20%28edited%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495538/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE-%E7%81%B5%E6%B4%BB%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%28%E6%94%B9%29-Golden%20Right-Flexibly%20control%20the%20playback%20rate%20of%20videos%20%28edited%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 按键分配
    // →:39, >:190, <:188, ?:191
    let Forward_KeyCode = 39        // →:39  点按 正常跳播 和 长按 加速前进播放 键
    let Forward_IncRate_KeyCode = 190    // >:190 增加 加速前进播放 速度 键
    let Forward_DecRate_KeyCode = 188    // <:188 减小 加速前进播放 速度 键
    let Forward_ResetRate_KeyCode = 191         // ?:191 重置 正常播放 速度 和 加速前进播放 速度 键

    const Init_Normal_Rate_Forward = 1 // 初始 正常 播放 速度
    const Init_Faster_Rate_Forward = 2 // 初始 加速前进 播放 速度
    let Current_Normal_Rate_Forward = 1 // 当前 正常 播放 速度
    let Current_Faster_Rate_Forward = 2 // 当前 加速前进 播放 速度
    let Count_Forward_Key_Down = 0 // 加速前进 播放 键 点击时间
    const Add_Time_Forward = 7 // 正常跳播 前进时间

    // 增加 加速前进播放 速度 键 和 减小 加速前进播放 速度 键 是否被按下
    let is_Forward_IncRate_Key_Down = false // 增加 加速前进播放 速度 键 是否被按下
    let is_Forward_DecRate_Key_Down = false // 减小 加速前进播放 速度 键 是否被按下

    let is_Forward_Key_Down = false // 是否正在 加速前进播放

    let page_video

    function makeArray(arr) {
        if (arr.item) {
            var len = arr.length;
            var array = [];
            while (len--) {
                array[len] = arr[len];
            }
            return array;
        }
        return Array.prototype.slice.call(arr);
    }

    const init = () => {
        if (location.origin.indexOf("youtube.com") > -1) {
            document.body.addEventListener("keydown", Forward_Key_Down_Event_YT, true);
            document.body.parentElement.addEventListener("keyup", Forward_Key_Up_Event_YT, true);
        } else {
            document.body.addEventListener("keydown", Forward_Key_Down_Event, true);
            document.body.parentElement.addEventListener("keyup", Forward_Key_Up_Event, true);
        }

        document.body.addEventListener("keydown", Forward_IncRate_Key_Down_Event, true)
        document.body.addEventListener("keydown", Forward_DecRate_Key_Down_Event, true)

        document.body.parentElement.addEventListener("keyup", Forward_IncRate_Key_Up_Event, true)
        document.body.parentElement.addEventListener("keyup", Forward_DecRate_Key_Up_Event, true)

        document.body.parentElement.addEventListener("keyup", Forward_ResetRate_Key_Up_Event, true)
        
    };

/*
.............########..#######..########......#######..########.##.....##.########.########...######.
.............##.......##.....##.##.....##....##.....##....##....##.....##.##.......##.....##.##....##
.............##.......##.....##.##.....##....##.....##....##....##.....##.##.......##.....##.##......
.............######...##.....##.########.....##.....##....##....#########.######...########...######.
.............##.......##.....##.##...##......##.....##....##....##.....##.##.......##...##.........##
.............##.......##.....##.##....##.....##.....##....##....##.....##.##.......##....##..##....##
.............##........#######..##.....##.....#######.....##....##.....##.########.##.....##..######.
*/
    const getPageVideo = () => {
        console.log("正在查找可用的Video Element...");
        const allVideoElementArray = makeArray(
            document.getElementsByTagName("video")
        ).concat(makeArray(document.getElementsByTagName("bwp-video")));
        console.log(allVideoElementArray);
        const page_video = Array.prototype.find.call(
            allVideoElementArray,
            (e) => {
                if (checkPageVideo(e)) return e;
            }
        );

        if (page_video) {
            console.log("找到正在播放的Video Element!");
            return page_video;
        } else {
            console.log("找不到正在播放的Video Element");
        }
    };
    const checkPageVideo = (v) => {
        if (v) {
            return v.offsetWidth > 9 && !v.paused;
        } else {
            return false;
        }
    };
    const relativeEvent = {
        _stopper: (e) => e.stopPropagation(),
        // 目前针对腾讯视频
        shouldPrevent:
            location.origin.indexOf("qq.com") > -1 ||
            location.origin.indexOf("wetv.vip") > -1,
        prevent() {
            document.body.addEventListener("ratechange", this._stopper, true);
            document.body.addEventListener("timeupdate", this._stopper, true);
        },
        allow() {
            document.body.removeEventListener(
                "ratechange",
                this._stopper,
                true
            );
            document.body.removeEventListener(
                "timeupdate",
                this._stopper,
                true
            );
        },
    };
    // 加速前进播放 键按下事件，加速播放开始
    const Forward_Key_Down_Event = (e) => {
        if (e.keyCode !== Forward_KeyCode) return
        e.stopPropagation()

        // 加速前进播放键时间计数+1
        Count_Forward_Key_Down++

        // 长按按键-开始
        if (Count_Forward_Key_Down === 2) {
            if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                is_Forward_Key_Down = true
                relativeEvent.shouldPrevent && relativeEvent.prevent()
                Current_Normal_Rate_Forward = page_video.playbackRate
                page_video.playbackRate = Current_Faster_Rate_Forward
                console.log(Current_Faster_Rate_Forward + '倍前进加速播放中')
            }
        }
    };
    // 加速前进播放 键松开事件，加速播放结束
    const Forward_Key_Up_Event = (e) => {
        if (e.keyCode !== Forward_KeyCode) return
        e.stopPropagation()

        // 单击 加速前进播放 键
        if (Count_Forward_Key_Down === 1) {
            if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                page_video.currentTime += Add_Time_Forward
                console.log('前进' + Add_Time_Forward + '秒')
            }
        }

        // 长按 加速前进播放 键-结束
        // if (page_video && page_video.playbackRate !== Normal_Rate_Forward) {
        if (page_video && is_Forward_Key_Down) {
            is_Forward_Key_Down = false
            page_video.playbackRate = Current_Normal_Rate_Forward
            relativeEvent.shouldPrevent && relativeEvent.allow()
            console.log('前进加速播放结束')
        }
        // 计数-重置
        Count_Forward_Key_Down = 0
    }

/*
    .########..#######..########.....##....##..#######..##.....##.########.##.....##.########..########
    .##.......##.....##.##.....##.....##..##..##.....##.##.....##....##....##.....##.##.....##.##......
    .##.......##.....##.##.....##......####...##.....##.##.....##....##....##.....##.##.....##.##......
    .######...##.....##.########........##....##.....##.##.....##....##....##.....##.########..######..
    .##.......##.....##.##...##.........##....##.....##.##.....##....##....##.....##.##.....##.##......
    .##.......##.....##.##....##........##....##.....##.##.....##....##....##.....##.##.....##.##......
    .##........#######..##.....##.......##.....#######...#######.....##.....#######..########..########
*/
    const getPageVideo_YT = () => {
        console.log("正在查找可用的Video Element...");
        let pv;

        if (document.getElementById("ytd-player") && checkPageVideo_YT(document.getElementById("ytd-player").player_))
            pv = document.getElementById("ytd-player").player_

        if (pv) {
            console.log("找到正在播放的Video Element!");
            return pv;
        } else {
            console.log("找不到正在播放的Video Element");
        }
    };
    const checkPageVideo_YT = (v) => {
        if (v) {
            return v.getPlayerState() == 1;
        } else {
            return false;
        }
    };
    const Forward_Key_Down_Event_YT = (e) => {
        if (e.keyCode !== Forward_KeyCode) return;
        e.stopPropagation();

        // 计数+1
        Count_Forward_Key_Down++;

        // 长按-开始
        if (Count_Forward_Key_Down === 2) {
            if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                is_Forward_Key_Down = true
                Current_Normal_Rate_Forward = page_video.getPlaybackRate();
                page_video.setPlaybackRate(Current_Faster_Rate_Forward);
                console.log(Current_Faster_Rate_Forward + '倍前进加速播放中');
            }
        }
    };
    const Forward_Key_Up_Event_YT = (e) => {
        if (e.keyCode !== Forward_KeyCode) return;
        e.stopPropagation();

        // 单击时
        if (Count_Forward_Key_Down === 1) {
            if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                page_video.seekToStreamTime(page_video.getCurrentTime() + Add_Time_Forward);
                console.log("前进" + Add_Time_Forward + "秒");
            }
        }

        // 长按-结束
        if (page_video && page_video.playbackRate !== Current_Normal_Rate_Forward) {
            is_Forward_Key_Down = false
            page_video.setPlaybackRate(Current_Normal_Rate_Forward);
            console.log('前进加速播放结束')
        }

        // 计数-重置
        Count_Forward_Key_Down = 0;
    };
    // YT专用 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








    // 增加 加速前进播放 速度 键按下事件，增加前进加速速度
    const Forward_IncRate_Key_Down_Event = (e) => {
        if (e.keyCode !== Forward_IncRate_KeyCode) return
        e.stopPropagation()

        if (!is_Forward_IncRate_Key_Down) {
            is_Forward_IncRate_Key_Down = true
            Current_Faster_Rate_Forward = Math.min(Current_Faster_Rate_Forward + 1, 10)
            console.log("增加快进速度:" + Current_Faster_Rate_Forward)
            if (is_Forward_Key_Down) {
                page_video.playbackRate = Current_Faster_Rate_Forward
                console.log(Current_Faster_Rate_Forward + '倍前进加速播放中')
            }
        }
    }

    // 增加 加速前进播放 速度 键松开事件
    const Forward_IncRate_Key_Up_Event = (e) => {
        if (e.keyCode !== Forward_IncRate_KeyCode) return
        e.stopPropagation()

        if (is_Forward_IncRate_Key_Down) {
            is_Forward_IncRate_Key_Down = false
        }
    }


    // 减小 加速前进播放 速度 键按下事件，减少前进加速速度
    const Forward_DecRate_Key_Down_Event = (e) => {
        if (e.keyCode !== Forward_DecRate_KeyCode) return
        e.stopPropagation()

        if (!is_Forward_DecRate_Key_Down) {
            is_Forward_DecRate_Key_Down = true
            Current_Faster_Rate_Forward = Math.max(Current_Faster_Rate_Forward - 1, 2)
            console.log("减少快进速度:" + Current_Faster_Rate_Forward)
            if (is_Forward_Key_Down) {
                page_video.playbackRate = Current_Faster_Rate_Forward
                console.log(Current_Faster_Rate_Forward + '倍前进加速播放中')
            }
        }
    }
    // 减小 加速前进播放 速度 键松开事件
    const Forward_DecRate_Key_Up_Event = (e) => {
        if (e.keyCode !== Forward_DecRate_KeyCode) return
        e.stopPropagation()

        if (is_Forward_DecRate_Key_Down) {
            is_Forward_DecRate_Key_Down = false
        }
    }


    // 重置 正常播放 速度 和 加速前进播放 速度 键松开事件，重置速度
    const Forward_ResetRate_Key_Up_Event = (e) => {
        if (e.keyCode !== Forward_ResetRate_KeyCode) return
        e.stopPropagation()

        Current_Normal_Rate_Forward = Init_Normal_Rate_Forward
        Current_Faster_Rate_Forward = Init_Faster_Rate_Forward
        if (is_Forward_Key_Down) {
            page_video.playbackRate = Current_Faster_Rate_Forward
            console.log(Current_Faster_Rate_Forward + '倍前进加速播放中')
        }
        else {
            page_video.playbackRate = Init_Normal_Rate_Forward
        }
        console.log("重置前进设置: 正常=" + Init_Normal_Rate_Forward + ", 快速=" + Init_Faster_Rate_Forward)
    }

/*
.............####.##....##.####.########.####....###....########.########
..............##..###...##..##.....##.....##....##.##......##....##......
..............##..####..##..##.....##.....##...##...##.....##....##......
..............##..##.##.##..##.....##.....##..##.....##....##....######..
..............##..##..####..##.....##.....##..#########....##....##......
..............##..##...###..##.....##.....##..##.....##....##....##......
.............####.##....##.####....##....####.##.....##....##....########
*/
    init()
})();