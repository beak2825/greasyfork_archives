// ==UserScript==
// @name         B站直播只听声音
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  利用B站app端直播只听声音功能播放声音
// @author       太陽闇の力
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js
// @grant    none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/439875/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8F%AA%E5%90%AC%E5%A3%B0%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/439875/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8F%AA%E5%90%AC%E5%A3%B0%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //0默认收起，1默认展开
    let isunfold = 0;
    let unfold = ["展开","收起"];

    let videoElement;
    // ------------------GUI设计开始---------------
    // 总容器
    const container = window.document.createElement('div');
    container.style.cssText = 'width:260px;position:fixed;bottom:5px;left:40%;z-index:999;box-sizing:border-box;';

    // 工具名称
    const topTool = window.document.createElement('div');
    topTool.innerText = '只听声音';
    topTool.style.cssText = 'text-align:center;line-height:20px;height:20px;width:100%;color:rgb(210,143,166);font-size:14px;';

    // 最小化按钮
    const collapseButton = window.document.createElement('button');
    collapseButton.innerText = unfold[isunfold];
    collapseButton.style.cssText = 'float:right;width:40px;height:20px;border:none;cursor:pointer;background-color:#1890ff;border-radius:1px;color:#ffffff;';

    // 主窗口
    const mainWindow = window.document.createElement('div');
    mainWindow.style.cssText = 'width:100%;background-color:rgba(220, 192, 221, .5);padding:10px;box-sizing:border-box;';
    if(isunfold==0){
        mainWindow.style.display = "none";
    }
    // 按钮区容器
    const buttonArea = window.document.createElement('div');
    buttonArea.style.cssText = 'width:100%;height:30px;box-sizing:border-box;display:flex; justify-content: center;';

    // 按钮区容器2
    const buttonArea2 = window.document.createElement('div');
    buttonArea2.style.cssText = 'width:100%;height:30px;box-sizing:border-box;display:flex;justify-content: space-around;';

    // 开始按钮
    const goButton = window.document.createElement('button');
    goButton.innerText = '开启只听声音';
    goButton.style.cssText = 'width:max-content;height:28px;padding:0 5px;margin-left:5px;';

    // 音量提示文本
    const volumeLabel = window.document.createElement('div');
    volumeLabel.innerText = '音量：'
    volumeLabel.style.cssText = 'height:28px;line-height:28px;';

    // 音量
    const volume = window.document.createElement('input');
    volume.type = "range";
    volume.min = 0;
    volume.max = 100;
    volume.step = 1;
    volume.style.cssText = 'width:max-content;padding:0 5px;height:28px;';

    // 音量值文本
    const valueLabel = window.document.createElement('div');
    valueLabel.innerText = 50;
    valueLabel.style.cssText = 'margin-left:5px;width:24px;height:28px;line-height:28px;';


    // 组装
    topTool.appendChild(collapseButton);
    container.appendChild(topTool);
    buttonArea.appendChild(volumeLabel);
    buttonArea.appendChild(volume);
    buttonArea.appendChild(valueLabel);
    buttonArea2.appendChild(goButton);
    mainWindow.appendChild(buttonArea);
    mainWindow.appendChild(buttonArea2);
    container.appendChild(mainWindow);
    window.document.body.appendChild(container);
    // 显示逻辑控制
    collapseButton.addEventListener('click', () => {
        if (collapseButton.innerText === '收起') {
            mainWindow.style.display = 'none';
            collapseButton.innerText = '展开';
            return;
        }
        if (collapseButton.innerText === '展开') {
            mainWindow.style.display = 'block';
            collapseButton.innerText = '收起';
            return;
        }
    }, false);
    //显示滑动条数字
    volume.oninput = function() {
        valueLabel.innerText = volume.value;
        if(videoElement){
            videoElement.volume = volume.value/100;
        }
    }

    async function getURL(roomid){
        const data = await fetcher('https://api.live.bilibili.com/xlive/app-room/v2/index/getRoomPlayInfo?appkey=iVGUTjsxvpLeuDCf&build=6215200&c_locale=zh_CN&channel=bili&codec=0&device=android&device_name=VTR-AL00&dolby=1&format=0%2C2&free_type=0&http=1&mask=0&mobi_app=android&network=wifi&no_playurl=0&only_audio=1&only_video=0&platform=android&play_type=0&protocol=0%2C1&qn=10000&s_locale=zh_CN&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%226.21.5%22%2C%22abtest%22%3A%22%22%7D&ts='+parseInt(+new Date() / 1000) + "&room_id="+roomid);
        if(data.data.live_status == 1){
            const front = data.data.playurl_info.playurl.stream[0].format[0].codec[0];
            const baseUrl = front.base_url;
            const extra = front.url_info[0].extra;
            const host = front.url_info[0].host;
            const url = host + baseUrl + extra;
            return url;
        }
        return null;
    }

    async function fetcher(url) {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        const data = await res.json()
        if (data.code != 0) {
            throw new Error("B站API请求错误:" + data.message)
        }
        return data
    }
    function play(url){
        if (flvjs.isSupported()) {
            videoElement = document.createElement('video');
            let flvPlayer = flvjs.createPlayer({
                "type": 'flv',
                "isLive":true,
                "hasVideo":false,
                "hasAudio":true,
                "withCredentials":1,
                "url": url
            });

            flvPlayer.attachMediaElement(videoElement);
            videoElement.volume = volume.value/100;
            document.body.append(videoElement);
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play()
            return flvPlayer;
        }
    }
    const roomid = /\d+/.exec(location.pathname)[0];
    let flvp;
    let t;
    goButton.addEventListener('click', () => {
        const video = document.querySelector("video");
        if (goButton.innerText == '关闭只听声音') {
            goButton.innerText = '开启只听声音';
            flvp.pause();
            flvp.unload();
            flvp.detachMediaElement();
            flvp.destroy();
            flvp = null;
            if(videoElement){
                videoElement.remove();
            }
            if(video){video.muted = false;}
            clearInterval(t);
            return;
        }
        if(!video){return}

        getURL(roomid).then(url=>{
            video.muted = true;
            flvp = play(url);
        });

        t = setInterval(()=>{
            getURL(roomid).then(url=>{
                flvp.pause();
                flvp.unload();
                flvp.detachMediaElement();
                flvp.destroy();
                flvp = null;
                flvp = play(url);
            });
        },50*60*1000)

        goButton.innerText = '关闭只听声音';
    })
})();
