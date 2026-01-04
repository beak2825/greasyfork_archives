// ==UserScript==
// @name         黄金右键-灵活控制视频倍速-Golden Right-Flexibly control the playback rate of videos
// @description  按住"→"键倍速播放, 松开"→"键恢复原速, 灵活追剧看视频~ 支持所有H5视频的网站(YouTube、腾讯视频、优酷、番剧等); Press and hold the right arrow key (→) to set the video playback rate faster. Release the key to restore the original rate
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/SkyJinXX/Golden-Right
// @version      1.2.0
// @author       SkyJin
// @include     http://*
// @include     https://*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/396467/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE-%E7%81%B5%E6%B4%BB%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F-Golden%20Right-Flexibly%20control%20the%20playback%20rate%20of%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/396467/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE-%E7%81%B5%E6%B4%BB%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F-Golden%20Right-Flexibly%20control%20the%20playback%20rate%20of%20videos.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let down_count = 0;
    let faster_rate = GM_getValue("faster_rate", 3);
    let normal_rate = 1;
    let add_time = GM_getValue("add_time", 7);
    let page_video;

    // 注册菜单命令
    GM_registerMenuCommand("⚙️ Golden Right Settings", showSettings);

    // 设置界面
    function showSettings() {
        const currentFasterRate = GM_getValue("faster_rate", 3);
        const currentAddTime = GM_getValue("add_time", 7);
        
        // 创建设置对话框 - 使用 DOM API 避免 TrustedHTML 问题
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.5); z-index: 999999; display: flex; 
            align-items: center; justify-content: center;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white; padding: 25px; border-radius: 8px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 400px; max-width: 500px;
            font-family: Arial, sans-serif; line-height: 1.6;
        `;
        
        // 标题
        const title = document.createElement('h3');
        title.textContent = 'Golden Right - Settings';
        title.style.cssText = 'margin-top: 0; color: #333;';
        dialog.appendChild(title);
        
        // 倍速设置区域
        const fasterRateDiv = document.createElement('div');
        fasterRateDiv.style.cssText = 'margin: 15px 0;';
        
        const fasterRateLabel = document.createElement('label');
        fasterRateLabel.textContent = 'Playback Speed Rate:';
        fasterRateLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
        fasterRateDiv.appendChild(fasterRateLabel);
        
        const fasterRateInput = document.createElement('input');
        fasterRateInput.type = 'number';
        fasterRateInput.id = 'fasterRate';
        fasterRateInput.value = currentFasterRate;
        fasterRateInput.min = '1';
        fasterRateInput.max = '10';
        fasterRateInput.step = '0.1';
        fasterRateInput.style.cssText = 'width: 100px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;';
        fasterRateDiv.appendChild(fasterRateInput);
        
        const fasterRateHint = document.createElement('span');
        fasterRateHint.textContent = 'Recommended: 2-4x';
        fasterRateHint.style.cssText = 'color: #666; font-size: 12px; margin-left: 10px;';
        fasterRateDiv.appendChild(fasterRateHint);
        
        dialog.appendChild(fasterRateDiv);
        
        // 快进设置区域
        const addTimeDiv = document.createElement('div');
        addTimeDiv.style.cssText = 'margin: 15px 0;';
        
        const addTimeLabel = document.createElement('label');
        addTimeLabel.textContent = 'Skip Forward Seconds:';
        addTimeLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
        addTimeDiv.appendChild(addTimeLabel);
        
        const addTimeInput = document.createElement('input');
        addTimeInput.type = 'number';
        addTimeInput.id = 'addTime';
        addTimeInput.value = currentAddTime;
        addTimeInput.min = '1';
        addTimeInput.max = '60';
        addTimeInput.style.cssText = 'width: 100px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;';
        addTimeDiv.appendChild(addTimeInput);
        
        const addTimeHint = document.createElement('span');
        addTimeHint.textContent = 'Seconds to skip when single-clicking right arrow';
        addTimeHint.style.cssText = 'color: #666; font-size: 12px; margin-left: 10px;';
        addTimeDiv.appendChild(addTimeHint);
        
        dialog.appendChild(addTimeDiv);
        
        // 使用说明区域
        const helpDiv = document.createElement('div');
        helpDiv.style.cssText = 'margin: 20px 0; padding: 10px; background: #f0f8ff; border-left: 4px solid #1e90ff; border-radius: 3px;';
        
        const helpTitle = document.createElement('strong');
        helpTitle.textContent = 'Usage Instructions:';
        helpDiv.appendChild(helpTitle);
        
        const helpBr1 = document.createElement('br');
        helpDiv.appendChild(helpBr1);
        
        const helpText1 = document.createTextNode('• Single-click right arrow → Skip forward by specified seconds');
        helpDiv.appendChild(helpText1);
        
        const helpBr2 = document.createElement('br');
        helpDiv.appendChild(helpBr2);
        
        const helpText2 = document.createTextNode('• Hold right arrow → Fast playback, release to restore normal speed');
        helpDiv.appendChild(helpText2);
        
        dialog.appendChild(helpDiv);
        
        // 按钮区域
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = 'text-align: right; margin-top: 20px;';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = 'margin-right: 10px; padding: 8px 15px; border: 1px solid #ccc; background: #f8f8f8; border-radius: 3px; cursor: pointer;';
        buttonDiv.appendChild(cancelBtn);
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Settings';
        saveBtn.style.cssText = 'padding: 8px 15px; border: none; background: #4CAF50; color: white; border-radius: 3px; cursor: pointer;';
        buttonDiv.appendChild(saveBtn);
        
        dialog.appendChild(buttonDiv);
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 事件处理
        saveBtn.onclick = () => {
            const newFasterRate = parseFloat(fasterRateInput.value);
            const newAddTime = parseInt(addTimeInput.value);
            
            if (newFasterRate > 0 && newAddTime > 0) {
                GM_setValue("faster_rate", newFasterRate);
                GM_setValue("add_time", newAddTime);
                
                // 更新当前变量
                faster_rate = newFasterRate;
                add_time = newAddTime;
                
                alert('Settings saved! Please refresh the page for changes to take effect.');
                document.body.removeChild(overlay);
            } else {
                alert('Please enter valid values!');
            }
        };
        
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
        };
        
        // 点击遮罩关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
    }

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
            document.body.addEventListener("keydown", downEvent_YT, true);
            document.body.parentElement.addEventListener("keyup", upEvent_YT, true);
        } else {
            document.body.addEventListener("keydown", downEvent, true);
            document.body.parentElement.addEventListener("keyup", upEvent, true);
        }
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
        console.log("Finding available Video Element...");
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
            console.log("Found the Video Element!");
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
    const downEvent = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        // 计数+1
        down_count++;

        // 长按右键-开始
        if (down_count === 2) {
            if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                relativeEvent.shouldPrevent && relativeEvent.prevent();
                normal_rate = page_video.playbackRate;
                page_video.playbackRate = faster_rate;
                console.log("加速播放中...");
            }
        }
    };
    const upEvent = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        // 单击右键时
        if (down_count === 1) {
            if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                page_video.currentTime += add_time;
                console.log("前进" + add_time + "秒");
            }
        }

        // 长按右键-结束
        if (page_video && page_video.playbackRate !== normal_rate) {
            page_video.playbackRate = normal_rate;
            relativeEvent.shouldPrevent && relativeEvent.allow();
        }

        // 计数-重置
        down_count = 0;
    };
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
        console.log("Finding available Video Element...");
        let pv;

        if (document.getElementById("ytd-player") && checkPageVideo_YT(document.getElementById("ytd-player").player_))
            pv = document.getElementById("ytd-player").player_

        if (pv) {
            console.log("Found the Video Element!");
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
    const downEvent_YT = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        // 计数+1
        down_count++;

        // 长按右键-开始
        if (down_count === 2) {
            if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                normal_rate = page_video.getPlaybackRate();
                page_video.setPlaybackRate(faster_rate);
                console.log("加速播放中...");
            }
        }
    };
    const upEvent_YT = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        // 单击右键时
        if (down_count === 1) {
            if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                page_video.seekToStreamTime(page_video.getCurrentTime() + add_time);
                console.log("前进" + add_time + "秒");
            }
        }

        // 长按右键-结束
        if (page_video && page_video.getPlaybackRate() !== normal_rate) {
            page_video.setPlaybackRate(normal_rate);
        }

        // 计数-重置
        down_count = 0;
    };
/*
.............####.##....##.####.########.####....###....########.########
..............##..###...##..##.....##.....##....##.##......##....##......
..............##..####..##..##.....##.....##...##...##.....##....##......
..............##..##.##.##..##.....##.....##..##.....##....##....######..
..............##..##..####..##.....##.....##..#########....##....##......
..............##..##...###..##.....##.....##..##.....##....##....##......
.............####.##....##.####....##....####.##.....##....##....########
*/
    init();
})();
