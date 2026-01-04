// ==UserScript==
// @name         HTML5 Player Simulation
// @namespace    xiaoxingxingboer31@outlook.com
// @version      a.1
// @description  English:"Add HTML5 player support in restricted browsers.";中文：“在受限制的浏览器中，添加html5播放器支持”
// @author       xiaoxingxingboer31
// @match        *://*
// @grant        none
// @run-at       document-start
// @license      Proprietary 
// @downloadURL https://update.greasyfork.org/scripts/530535/HTML5%20Player%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/530535/HTML5%20Player%20Simulation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 引入解码器库
    const decoderScripts = [
        'https://cdn.jsdelivr.net/npm/broadway-player@0.5.0/Player/Decoder.js', // H.264
        'https://cdn.jsdelivr.net/npm/libde265.js@1.0.4/libde265.js', // HEVC/H.265
        'https://cdn.jsdelivr.net/npm/dav1d.js@0.8.1/dav1d.js', // AV1
    ];

    decoderScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    });

    // 创建自定义的<video>元素
    class CustomVideoPlayer extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });

            // 创建Canvas用于绘制视频帧
            this.canvas = document.createElement('canvas');
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.backgroundColor = '#000';
            this.shadowRoot.appendChild(this.canvas);

            // 创建基础控件
            const controls = document.createElement('div');
            controls.style.position = 'absolute';
            controls.style.bottom = '0';
            controls.style.left = '0';
            controls.style.right = '0';
            controls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            controls.style.padding = '10px';
            controls.style.display = 'flex';
            controls.style.alignItems = 'center';

            // 播放/暂停按钮
            this.playPauseBtn = document.createElement('button');
            this.playPauseBtn.innerText = '播放';
            this.playPauseBtn.style.padding = '5px 10px';
            this.playPauseBtn.style.marginRight = '10px';
            this.playPauseBtn.addEventListener('click', () => this.togglePlay());
            controls.appendChild(this.playPauseBtn);

            // 音量控制
            this.volumeControl = document.createElement('input');
            this.volumeControl.type = 'range';
            this.volumeControl.min = '0';
            this.volumeControl.max = '1';
            this.volumeControl.step = '0.1';
            this.volumeControl.value = '1';
            this.volumeControl.style.flexGrow = '1';
            this.volumeControl.addEventListener('input', () => this.volume = this.volumeControl.value);
            controls.appendChild(this.volumeControl);

            // 进度条
            this.progressBar = document.createElement('progress');
            this.progressBar.value = '0';
            this.progressBar.max = '100';
            this.progressBar.style.width = '100%';
            this.progressBar.style.marginTop = '10px';
            this.progressBar.addEventListener('click', (e) => this.seek(e));
            controls.appendChild(this.progressBar);

            this.shadowRoot.appendChild(controls);

            // 初始化解码器
            this.decoders = {
                'avc': new Decoder({ rgb: true, webgl: true }), // H.264
                'hevc': new libde265.Decoder(), // HEVC/H.265
                'av1': new dav1d.Decoder(), // AV1
            };

            // 绑定解码器回调
            this.decoders.avc.onPictureDecoded = this.decoders.hevc.onPictureDecoded = this.decoders.av1.onPictureDecoded = (buffer, width, height) => {
                const ctx = this.canvas.getContext('2d');
                const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
                ctx.putImageData(imageData, 0, 0);
            };

            // 初始化状态
            this._src = '';
            this._currentTime = 0;
            this._paused = true;
            this._volume = 1;
            this._muted = false;
            this._playbackRate = 1;
            this._crossOrigin = null;
            this._autoplay = false;
            this._loop = false;
            this._preload = 'auto';
            this._poster = '';
            this._width = 0;
            this._height = 0;
            this._controls = false;
            this._controlsList = '';
            this._disablePictureInPicture = false;
            this._playsInline = false;
            this._videoElement = null;
            this._audioContext = null;
            this._sourceNode = null;
            this._gainNode = null;

            // 绑定事件
            this._timeupdateEvent = new Event('timeupdate');
            this._playEvent = new Event('play');
            this._pauseEvent = new Event('pause');
            this._endedEvent = new Event('ended');
            this._errorEvent = new Event('error');
            this._progressEvent = new Event('progress');
            this._seekedEvent = new Event('seeked');
        }

        // 实现src属性
        get src() {
            return this._src;
        }
        set src(value) {
            this._src = value;
            this.load();
        }

        // 实现currentTime属性
        get currentTime() {
            return this._currentTime;
        }
        set currentTime(value) {
            this._currentTime = value;
            this.dispatchEvent(this._timeupdateEvent);
        }

        // 实现paused属性
        get paused() {
            return this._paused;
        }

        // 实现volume属性
        get volume() {
            return this._volume;
        }
        set volume(value) {
            this._volume = value;
            if (this._gainNode) {
                this._gainNode.gain.value = value;
            }
            this.volumeControl.value = value;
        }

        // 实现muted属性
        get muted() {
            return this._muted;
        }
        set muted(value) {
            this._muted = value;
            if (this._gainNode) {
                this._gainNode.gain.value = value ? 0 : this._volume;
            }
        }

        // 实现playbackRate属性
        get playbackRate() {
            return this._playbackRate;
        }
        set playbackRate(value) {
            this._playbackRate = value;
            if (this._videoElement) {
                this._videoElement.playbackRate = value;
            }
        }

        // 实现crossOrigin属性
        get crossOrigin() {
            return this._crossOrigin;
        }
        set crossOrigin(value) {
            this._crossOrigin = value;
            if (this._videoElement) {
                this._videoElement.crossOrigin = value;
            }
        }

        // 实现autoplay属性
        get autoplay() {
            return this._autoplay;
        }
        set autoplay(value) {
            this._autoplay = value;
            if (this._videoElement) {
                this._videoElement.autoplay = value;
            }
        }

        // 实现loop属性
        get loop() {
            return this._loop;
        }
        set loop(value) {
            this._loop = value;
            if (this._videoElement) {
                this._videoElement.loop = value;
            }
        }

        // 实现preload属性
        get preload() {
            return this._preload;
        }
        set preload(value) {
            this._preload = value;
            if (this._videoElement) {
                this._videoElement.preload = value;
            }
        }

        // 实现poster属性
        get poster() {
            return this._poster;
        }
        set poster(value) {
            this._poster = value;
            if (this._videoElement) {
                this._videoElement.poster = value;
            }
        }

        // 实现width属性
        get width() {
            return this._width;
        }
        set width(value) {
            this._width = value;
            this.canvas.width = value;
        }

        // 实现height属性
        get height() {
            return this._height;
        }
        set height(value) {
            this._height = value;
            this.canvas.height = value;
        }

        // 实现controls属性
        get controls() {
            return this._controls;
        }
        set controls(value) {
            this._controls = value;
            controls.style.display = value ? 'flex' : 'none';
        }

        // 切换播放/暂停
        togglePlay() {
            if (this._paused) {
                this.play();
            } else {
                this.pause();
            }
        }

        // 实现play方法
        play() {
            if (this._videoElement) {
                this._videoElement.play();
                this._paused = false;
                this.playPauseBtn.innerText = '暂停';
                this.dispatchEvent(this._playEvent);
                this._drawVideoFrame();
            }
        }

        // 实现pause方法
        pause() {
            if (this._videoElement) {
                this._videoElement.pause();
                this._paused = true;
                this.playPauseBtn.innerText = '播放';
                this.dispatchEvent(this._pauseEvent);
            }
        }

        // 加载视频并解码
        load() {
            if (this._src) {
                fetch(this._src)
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        const data = new Uint8Array(buffer);
                        const codec = this._detectCodec(data);

                        if (this.decoders[codec]) {
                            this.decoders[codec].decode(data); // 解码视频帧
                        } else {
                            console.error('不支持的视频编码格式:', codec);
                        }
                    })
                    .catch(error => {
                        console.error('视频加载失败:', error);
                    });
            }
        }

        // 检测视频编码格式
        _detectCodec(data) {
            if (data[4] === 0x68 && data[5] === 0x76 && data[6] === 0x63 && data[7] === 0x31) {
                return 'avc'; // H.264
            } else if (data[4] === 0x68 && data[5] === 0x65 && data[6] === 0x76 && data[7] === 0x63) {
                return 'hevc'; // HEVC/H.265
            } else if (data[4] === 0x61 && data[5] === 0x76 && data[6] === 0x30 && data[7] === 0x31) {
                return 'av1'; // AV1
            } else {
                return 'unknown';
            }
        }

        // 绘制视频帧
        _drawVideoFrame() {
            if (!this._paused && this._videoElement) {
                const ctx = this.canvas.getContext('2d');
                ctx.drawImage(this._videoElement, 0, 0, this.canvas.width, this.canvas.height);
                this.currentTime = this._videoElement.currentTime;
                this.progressBar.value = (this.currentTime / this._videoElement.duration) * 100;
                requestAnimationFrame(() => this._drawVideoFrame());
            }
        }

        // 进度条跳转
        seek(e) {
            const rect = this.progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.currentTime = percent * this._videoElement.duration;
        }

        // 释放资源
        _releaseResources() {
            if (this._audioContext) {
                this._audioContext.close();
                this._audioContext = null;
            }
            if (this._videoElement) {
                URL.revokeObjectURL(this._videoElement.src);
                this._videoElement = null;
            }
        }
    }

    // 注册自定义元素
    customElements.define('custom-video', CustomVideoPlayer);

    // 替换<video>标签
    function replaceVideoElements() {
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            const customVideo = document.createElement('custom-video');
            customVideo.src = video.src;
            // 设置其他属性...
            video.parentNode.replaceChild(customVideo, video);
        });
    }

    // 监控DOM变化并替换<video>标签
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'VIDEO') {
                    const customVideo = document.createElement('custom-video');
                    customVideo.src = node.src;
                    // 设置其他属性...
                    node.parentNode.replaceChild(customVideo, node);
                }
            });
        });
    });

    // 在脚本加载完成后替换<video>标签
    window.addEventListener('load', () => {
        replaceVideoElements();
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();