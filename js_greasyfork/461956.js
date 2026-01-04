// ==UserScript==
// @name         VideoRecorder
// @namespace 	 Recorder
// @version      0.0.3
// @description  视频录屏
// @author       zenfanxing
// @license      MIT
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @match        *://pan.baidu.com/disk/main*
// @match        *://yun.baidu.com/disk/main*
// @match        *://pan.baidu.com/s*
// @match        *://yun.baidu.com/s*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.iq.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://m.v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://tv.sohu.com/*
// @match        *://film.sohu.com/*
// @match        *://*.1905.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.pptv.com/*
// @match        *://item.taobao.com/*
// @match        *://s.taobao.com/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.tmall.hk/*
// @match        *://item.jd.com/*
// @match        *://*.yiyaojd.com/*
// @match        *://npcitem.jd.hk/*
// @match        *://*.liangxinyao.com/*
// @match        *://music.163.com/*
// @match        *://y.qq.com/*
// @match        *://*.kugou.com/*
// @match        *://*.kuwo.cn/*
// @match        *://*.ximalaya.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.douyin.com/*
// @match        *://*.kuaishou.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/461956/VideoRecorder.user.js
// @updateURL https://update.greasyfork.org/scripts/461956/VideoRecorder.meta.js
// ==/UserScript==

(function () {
    // const videoType = 'video/mp4'
    const videoType = 'video/webm'
    const html = `
        <style>
            *:not(#recorder-videos)>video:hover {
                outline: 4px solid greenyellow;
            }
            video.recorder-selected {
                outline: 4px solid orange;
            }
            .recorder {
                display: none;
            }
            .recorder.show {
                display: block;
            }
            .recorder * {
                box-sizing: border-box;
            }
            .recorder-btn {
                position: fixed;
                right: 60px;
                bottom: 60px;
                width: 60px;
                height: 60px;
                padding: 4px;
                padding-bottom: 56px;
                opacity: 0.4;
                transform: all 0.3s;
                background-color: #00B2FF;
                border-radius: 30px;
                overflow: hidden;
                color: white;
                z-index: 999;
            }
            .recorder-btn button {
                display: none;
                width: 52px;
                height: 52px;
                background-color: #0091FF;
                border-radius: 50%;
                margin-bottom: 10px;
                border: none;
                cursor: pointer;
                color: inherit;
                font-size: 12px;
            }
            .recorder-btn #recorder-btn-list {
                display: block;
            }
            .recorder-btn button.show {
                display: block;
            }
            .recorder-btn:hover {
                height: auto;
                opacity: 1;
            }
            .recorder-modal {
                display: none;
            }
            .recorder-modal.show {
                display: block;
            }
            .recorder-mask {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.3);
                z-index: 9999;
            }
            .recorder-videos {
                position: fixed;
                right: 0;
                top: 0;
                background-color: #fff;
                width: 300px;
                height: 100%;
                padding: 10px;
                z-index: 9999;
                overflow-y: auto;
            }
            .recorder-videos::before {
                content: 'CTRL + T 快捷键快速设置录屏结束点';
                margin-bottom: 10px;
                font-size: 12px;
            }
            .recorder-videos video {
                width: 280px;
            }
            .recorder-videos a {
                display: block;
                color: white;
                background-color: #00B2FF;
                padding: 6px;
                margin-bottom: 10px;
                text-align: center;
                text-decoration: none;
            }
            .recorder-btn-handle {
                display: flex;
                position: absolute;
                left: 0;
                bottom: 0;
                width: 60px;
                height: 60px;
                justify-content: center;
                align-items: center;
                font-size: 40px;
                background-color: #00B2FF;
                cursor: pointer;
            }
            #recorder-time {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: red;
                display: none;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-size: 12px;
            }
            #recorder-time.show {
                display: flex;
            }
        </style>
        <div class="recorder" id="recorder">
            <div class="recorder-btn">
                <button id="recorder-btn-list">列表</button>
                <button id="recorder-btn-pause">暂停</button>
                <button id="recorder-btn-resume">恢复</button>
                <button id="recorder-btn-stop">停止</button>
                <button id="recorder-btn-start" class="show">开始</button>
                <div class="recorder-btn-handle">
                    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.25 10.607v5.321h1.5v-5.321h5.321v-1.5H10.75V3.786h-1.5v5.32H3.93v1.5h5.32Z"
                            fill="currentColor"></path>
                    </svg>
                    <div id="recorder-time"></div>
                </div>
            </div>
            <div id="recorder-modal" class="recorder-modal">
                <div id="recorder-mask" class="recorder-mask"></div>
                <div id="recorder-videos" class="recorder-videos"></div>
            </div>
        </div>
    `
    // 创建html
    const createHTML = () => {
        const con = document.createElement('div');
        con.innerHTML = html;
        document.body.appendChild(con)
    }
    // 时间格式化
    const timeFormat = (t, hasHours = true) => {
        let h, m
        if (hasHours) {
            h = parseInt(t / 3600000) + ''
            m = parseInt((t % 3600000) / 60000) + ''
        } else {
            m = parseInt(t / 60000) + ''
        }
        const s = parseInt(t % 60000 / 1000) + ''
        return hasHours ? `${h}:${m.padStart(2, '0')}:${s.padStart(2, '0')}` : `${m}:${s.padStart(2, '0')}`
    }
    // 状态
    const STATUS = {
        PAUSE: 'pause',
        RECORDING: 'recording',
        STOP: 'stop'
    }
    class Recorder {
        constructor() {
            this._urls = []; // 录屏视频链接
            this._status = STATUS.STOP; // 初始状态
            this._time = 0; // 录制时常
            this._realtime = 0; // 实时显示时长
            this._targetTime = 0; // 自动停止时间点
            this.init(); // 初始话html
            // dom
            this._recorderEle = document.getElementById('recorder');
            this._modalEle = document.getElementById('recorder-modal');
            this._maskEle = document.getElementById('recorder-mask');
            this._videos = document.getElementById('recorder-videos');
            this._startEle = document.getElementById('recorder-btn-start');
            this._pauseEle = document.getElementById('recorder-btn-pause');
            this._resumeEle = document.getElementById('recorder-btn-resume');
            this._stopEle = document.getElementById('recorder-btn-stop');
            this._listEle = document.getElementById('recorder-btn-list');
            this._timeEle = document.getElementById('recorder-time');
            this._video = document.querySelector('video');
            // 自动选择页面第一个视频节点
            if (this._video) {
                this._video.classList.add("recorder-selected");
                this._recorderEle.classList.add('show');
                this._video.preload = 'auto';
            }
            this.listen();
        }
        init() {
            createHTML(html);
        }
        // 监听元素点击事件
        listen() {
            this._startEle.onclick = () => {
                this.start();
            }
            this._pauseEle.onclick = () => {
                this.pause();
            }
            this._resumeEle.onclick = () => {
                this.resume();
            }
            this._stopEle.onclick = () => {
                this.stop();
            }
            this._listEle.onclick = () => {
                this._modalEle.classList.add('show');
            }
            this._maskEle.onclick = () => {
                this._modalEle.classList.remove('show');
            }
            if (this._video) {
                this.videoAddListener();
            }
            // 快捷键
            window.addEventListener('keydown', (e) => {
                // ctrl + T
                if (this._video && e.ctrlKey && e.keyCode === 84) {
                    if (this._status === STATUS.STOP && this._video.currentTime && this._targetTime !==
                        this._video.currentTime && confirm(
                            `设置视频的${timeFormat(this._video.currentTime * 1000)}下次录制的结束时间点`)) {
                        this._targetTime = this._video.currentTime;
                    } else if (this._targetTime && alert('清除录制结束点')) {
                        this._targetTime = 0;
                    }
                }
            })
            // 切换视频节点
            document.body.addEventListener('click', (e) => {
                if (e.target.nodeName === 'VIDEO' && e.target.parentNode.id !== 'recorder-videos' &&
                    this._status === STATUS.STOP && this._video !== e.target) {
                    this._recorderEle.classList.add('show');
                    this._video && this._video.classList.remove('recorder-selected');
                    this._video && this.videoRemoveListener();
                    this._video = e.target;
                    this._video.preload = 'auto';
                    this.videoAddListener();
                    this._video.classList.add("recorder-selected");
                }
            })
        }
        // 视频节点事件监听
        videoAddListener() {
            if (!this._video) return;
            this._videoHandlePlay = () => {
                if (this._status === STATUS.PAUSE) {
                    this.setStatus(STATUS.RECORDING);
                }
            }
            this._videoHandlePause = () => {
                if (this._status === STATUS.RECORDING) {
                    this.setStatus(STATUS.PAUSE);
                }
            }
            this._videoHandleEnded = () => {
                if (this._status !== STATUS.STOP) {
                    this.setStatus(STATUS.STOP);
                }
            }
            this._videoHandleTimeUpdate = () => {
                if (this._targetTime && this._status === STATUS.RECORDING && this._video.currentTime >= this
                    ._targetTime) {
                    this.stop();
                }
                if (this._status === STATUS.RECORDING && this._video.buffered && this._video.buffered.length && (this._video.buffered.end(this._video.buffered.length - 1) - this._video.currentTime < 3)) {
                    this._bufferTimer && clearInterval(this._bufferTimer);
                    this._bufferTimer = null;
                    this.pause();
                    this._video.pause();
                    console.log('buffered 小于 3s, 暂停录制等待缓存', this._video.buffered.end(this._video.buffered.length - 1) - this._video.currentTime)
                    this._bufferTimer = setInterval(() => {
                        if (this._video.buffered.end(this._video.buffered.length - 1) - this._video.currentTime > 6) {
                            this._bufferTimer && clearInterval(this._bufferTimer);
                            this._bufferTimer = null;
                            this.resume();
                            this._video.play();
                            console.log('buffered 大于 6s, 恢复录制')
                        }
                    }, 500)
                }
            }
            this._video.addEventListener('play', this._videoHandlePlay);
            this._video.addEventListener('pause', this._videoHandlePause);
            this._video.addEventListener('waiting', this._videoHandlePause);
            this._video.addEventListener('playing', this._videoHandlePlay);
            this._video.addEventListener('ended', this._videoHandleEnded);
            this._video.addEventListener('timeupdate', this._videoHandleTimeUpdate);
        }
        // 视频节点事件移除
        videoRemoveListener() {
            if (!this._video) return;
            this._video.removeEventListener('play', this._videoHandlePlay);
            this._video.removeEventListener('pause', this._videoHandlePause);
            this._video.removeEventListener('waiting', this._videoHandlePause);
            this._video.removeEventListener('playing', this._videoHandlePlay);
            this._video.removeEventListener('ended', this._videoHandleEnded);
            this._video.addEventListener('timeupdate', this._videoHandleTimeUpdate);
        }
        // 更新状态
        setStatus(status) {
            const now = Date.now();
            switch (status) {
                case STATUS.RECORDING:
                    // 视频可播放下一帧才开始录制
                    if (this._status === STATUS.PAUSE) {
                        this._recorder.state !== 'inactive' && this._recorder.resume(); // 恢复录制
                    } else {
                        this._recorder.start(); // 开始录制
                    }
                    this._video.play();
                    this.timing();
                    // 更新ui
                    this._timeEle.classList.add('show');
                    this._startEle.classList.remove('show');
                    this._resumeEle.classList.remove('show');
                    this._pauseEle.classList.add('show');
                    this._stopEle.classList.add('show');
                    this._bufferTimer && clearInterval(this._bufferTimer);
                    this._bufferTimer = null;
                    break;
                case STATUS.PAUSE:
                    this.timingEnd();
                    this._recorder.state !== 'inactive' && this._recorder.pause(); // 暂停录制
                    // 更新ui
                    this._pauseEle.classList.remove('show');
                    this._resumeEle.classList.add('show');
                    break;
                case STATUS.STOP:
                    this.timingEnd();
                    this._bufferTimer && clearInterval(this._bufferTimer);
                    this._bufferTimer = null;
                    this._time = 0;
                    this._targetTime = 0;
                    this._recorder.state !== 'inactive' && this._recorder.stop(); // 停止录制
                    this._video.pause(); // 暂停视频
                    // 更新ui
                    this._timeEle.classList.remove('show');
                    this._startEle.classList.add('show');
                    this._pauseEle.classList.remove('show');
                    this._resumeEle.classList.remove('show');
                    this._stopEle.classList.remove('show');
                    break;
            }
            // 更新状态
            this._status = status;
        }
        // 录制前初始化
        startInit() {
            if (this._targetTime && this._video.currentTime >= this._targetTime) {
                this._targetTime = 0;
            }
            this._time = 0;
            this._realtime = 0;
            this._recorder = null;
            this._currentStartTime = null;
            clearInterval(this._timer);
            this._timer = null;
            clearInterval(this._bufferTimer)
            this._bufferTimer = null;
        }
        // 开始录制
        start() {
            if (!this._video || !this._video.isConnected) {
                alert('请点击重新选中播放器');
                return;
            }
            if (this._video.ended) {
                alert('视频已经播完');
                return;
            }
            if (this._video.readyState !== 4) {
                alert('视频还未准备好');
                return
            }
            if (this._status === STATUS.STOP) {
                this.startInit(); // 初始化
                this._recorder = new MediaRecorder(this._video.captureStream(), {
                    mimeType: 'video/webm;codecs=h264' // 视频编码格式
                });
                const blobs = [];
                // 处理剪辑的数据
                this._recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) blobs.push(event.data);
                };
                this._recorder.onstop = () => {
                    this._urls.push(URL.createObjectURL(new Blob(blobs, {
                        type: videoType
                    })));
                    // 更新列表
                    this.renderList();
                }
                this.setStatus(STATUS.RECORDING);
            }
        }
        // 停止
        stop() {
            if (this._recorder && this._status !== STATUS.STOP) {
                this.setStatus(STATUS.STOP);
            }
        }
        // 暂停
        pause() {
            if (this._recorder && this._status === STATUS.RECORDING) {
                this.setStatus(STATUS.PAUSE);
            }
        }
        // 恢复
        resume() {
            if (this._recorder && this._status === STATUS.PAUSE) {
                this.setStatus(STATUS.RECORDING);
            }
        }
        // 开始计时
        timing() {
            this._currentStartTime = Date.now();
            const run = () => {
                this._realtime = this._time + (Date.now() - this._currentStartTime)
                this._timeEle.innerText =
                    `${timeFormat(this._realtime, false)}${this._targetTime ? `\n(${timeFormat(this._targetTime * 1000)})`: ''}`;
            }
            run();
            this._timer = setInterval(run, 500);
        }
        // 结束计时
        timingEnd() {
            if (this._currentStartTime) {
                clearInterval(this._timer);
                this._time += (Date.now() - this._currentStartTime);
                this._currentStartTime = null;
                this._realtime = 0;
            }
        }
        // 更新录制列表
        renderList() {
            const htmlList = this._urls.map((url) =>
                `<video src=${url} controls></video><a download href="${url}">下载</a>`);
            this._videos.innerHTML = htmlList.join('');
        }
    }
    window.__videoRecorder = new Recorder()
})();