// ==UserScript==
// @name         【kick】コメントスクロール
// @namespace     http://tampermonkey.net/
// @version       0.8
// @description   try to take over the world! (Multithreaded version)
// @author        You
// @match         https://kick.com*
// @match         https://kick.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/510761/%E3%80%90kick%E3%80%91%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/510761/%E3%80%90kick%E3%80%91%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

const setting = {
    CommentColor : "white",              //コメントの色
    FontSize : 35,                     //コメントのサイズ  おすすめ 30 ~ 45
    FontFamily : "'Roboto', sans-serif", //フォント
    Alpha : 0.7,                         //透過率 0 ~ 1     0.7 → 70%
    StrokeColor : "black",               //縁取りの色
    LineSize : 1,                        //縁取りの幅
    BoostRate : [0.1, 5],                //コメント加速率   [0.1, 5] → 5文字ごとに10%増加
    ScrollSpeed : 3.5,                   //基礎速度
};

const HTML = {
    CanvasHTML: `<div class="absolute left-0 top-0 h-full w-full" style="pointer-events: none;">
    <canvas id="comment_canvas"></canvas>
    </div>`,
    ResetBtnHTML: `<button id="resetBTN" style="background-color: #4CAF50; border: none; color: white; padding: 5px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; margin: 4px 2px; cursor: pointer;">reset</button>`,
};

class CommentScroll {
    constructor(setting, HTML) {
        this.initSettings(setting);
        this.initFlg();
        this.initCanvasProperties();
        this.initHTML(HTML);
        this.videoElement = null;
        this.observer = null;
        this.eventListeners = []; // 登録したイベントリスナーを管理
        this.commentWorker = null; // Web Worker インスタンス
    }

    initSettings(setting) {
        this.color = setting["CommentColor"];
        this.fontSize = setting["FontSize"];
        this.fontFamily = setting["FontFamily"];
        this.Alpha = setting["Alpha"];
        this.strokeColor = setting["StrokeColor"];
        this.lineW = setting["LineSize"];
        this.boostRate = setting["BoostRate"];
        this.scrollSpeed = setting["ScrollSpeed"];
    }

    initHTML(HTML) {
        this.canvasHTML = HTML["CanvasHTML"];
        this.resetBtnHTML = HTML["ResetBtnHTML"];
    }

    generateCommentLanes(canvasHeight, startPosition = 50, laneSpacing = 30) {
        const commentLanes = [];
        // フォントサイズに基づいてレーン間隔を調整する
        const effectiveLaneSpacing = Math.max(laneSpacing, this.fontSize * 1.1); // フォントサイズより狭くならないように
        const availableSpace = canvasHeight - startPosition;
        const maxLanes = Math.floor(availableSpace / effectiveLaneSpacing);

        for (let i = 0; i < maxLanes; i++) {
            const lanePosition = startPosition + (i * effectiveLaneSpacing);
            if (lanePosition + this.fontSize < canvasHeight) { // コメントが完全に表示されるか確認
                commentLanes.push(lanePosition);
            } else {
                break;
            }
        }
        return commentLanes.length > 0 ? commentLanes : [startPosition]; // 少なくとも1つのレーンを確保
    }

    initCanvasProperties() {
        this.canvas = null;
        this.ctx = null;
        this.canvasWid = 800; // 初期値、canvasSizeSetで更新
        this.commentLane = [50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380]; // 初期値
        // commentObj は worker が管理するので、メインスレッドでは直接保持しない
        this.activeCommentsToDraw = {}; // Workerから受け取った描画用コメントオブジェクト
        this.lastTime = 0;
        this.fps = 60; // 目標FPS
        this.interval = 1000 / this.fps;
    }

    initFlg() {
        this.setup_flg = false;
        this.animationRunning = false;
        this.animationFrameId = null;
        this.isFirstEventSetup = false; // firstEventのリスナーが登録済みか
    }

    setup() {
        if (this.setup_flg) return;
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer && location.href !== 'https://kick.com/') {
            console.log("[CommentScroll] Setup started.");
            this.videoElement = videoPlayer;
            this.addCanvas();
            this.videoSkipEvent();
            this.setup_flg = true;
        } else {
            console.log("[CommentScroll] Video player not found or on main page. Setup aborted.");
        }
    }

    cleanupEventListeners() {
        this.eventListeners.forEach(({ target, type, handler }) => {
            target.removeEventListener(type, handler);
        });
        this.eventListeners = [];
        console.log("[CommentScroll] Cleaned up event listeners.");
    }

    addManagedEventListener(target, type, handler) {
        target.addEventListener(type, handler);
        this.eventListeners.push({ target, type, handler });
    }

    firstEvent() {
        if (this.isFirstEventSetup) {
            this.cleanupEventListeners();
        }

        this.addManagedEventListener(window, 'resize', () => this.canvasSizeSet());
        this.addManagedEventListener(window, "keydown", (e) => {
            if (e.code === 'KeyT') this.canvasSizeSet();
        });

        if (this.setupTimeoutId) clearTimeout(this.setupTimeoutId);
        if (this.resetBtnTimeoutId) clearTimeout(this.resetBtnTimeoutId);

        this.setupTimeoutId = setTimeout(() => this.setup(), 4000);
        this.resetBtnTimeoutId = setTimeout(() => this.resetBtn(), 2000);
        this.isFirstEventSetup = true;
    }

    resetBtn() {
        const chatroomHeader = document.querySelector('#channel-chatroom div:first-child > div');
        if (chatroomHeader && !document.getElementById('resetBTN')) {
            chatroomHeader.insertAdjacentHTML('afterend', this.resetBtnHTML);
            const resetButton = document.getElementById('resetBTN');
            if (resetButton) {
                this.addManagedEventListener(resetButton, "click", () => this.reset());
            }
        }
    }

    reset() {
        console.log("[CommentScroll] Reset button pressed.");
        this.stopAnimation();

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
            console.log("[CommentScroll] Observer stopped.");
        }

        if (this.commentWorker) {
            this.commentWorker.postMessage({ type: 'reset' });
            console.log("[CommentScroll] Worker reset.");
        }
        this.activeCommentsToDraw = {};

        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            console.log("[CommentScroll] Canvas cleared.");
        }

        const existingCanvasDiv = this.videoElement?.parentElement?.querySelector('div[style*="pointer-events: none;"]');
        if (existingCanvasDiv) {
            existingCanvasDiv.remove();
        }

        this.initFlg();
        this.initCanvasProperties();
        this.cleanupEventListeners();

        this.isFirstEventSetup = false;
        this.firstEvent();

        console.log("[CommentScroll] Reset process completed.");
    }

    stopAnimation() {
        if (this.animationRunning && this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationRunning = false;
            this.animationFrameId = null;
            console.log("[CommentScroll] Animation stopped.");
        }
    }

    commentget_observer() {
        if (this.observer) {
            this.observer.disconnect();
        }
        console.log("[CommentScroll] Initializing comment observer.");

        this.observer = new MutationObserver(records => {
            records.forEach((r) => {
                const rNode = r.addedNodes;
                if (rNode.length > 0 && rNode[0] && rNode[0].nodeType === Node.ELEMENT_NODE) {
                    // Modern selector first, then fallback to old
                    const modernCommentElement = rNode[0].querySelector('div[data-chat-entry="true"] span[data-chat-entry-element="message"]');
                    let com = null;
                    if (modernCommentElement) {
                        com = modernCommentElement.textContent.trim();
                    } else {
                        const commentSpans = rNode[0].querySelectorAll('div > div > span');
                        if (commentSpans && commentSpans.length > 2 && commentSpans[2]) {
                            com = commentSpans[2].textContent.trim();
                        }
                    }

                    if (com && com.length > 0 && com !== ': ') {
                        if (this.commentWorker) {
                            this.commentWorker.postMessage({ type: 'addComment', payload: { text: com } });
                        }
                    }
                }
            });
        });

        const chatDivCheck = () => {
            const channelChatroom = document.getElementById('channel-chatroom');
            if (!channelChatroom) {
                setTimeout(chatDivCheck, 1000);
                return;
            }
            const chatDiv = channelChatroom.querySelector('.no-scrollbar');
            if (chatDiv === null) {
                setTimeout(chatDivCheck, 500);
            } else {
                this.observer.disconnect();
                this.observer.observe(chatDiv, { childList: true });
                console.log("[CommentScroll] Observer started on chat messages.");
            }
        };
        chatDivCheck();
    }

    addCanvas() {
        if (!this.videoElement || this.videoElement.parentElement.querySelector('#comment_canvas')) {
            console.log("[CommentScroll] Canvas already exists or videoElement not found.");
            return;
        }

        this.videoElement.insertAdjacentHTML('afterend', this.canvasHTML);

        const getCanvas = () => {
            this.canvas = document.getElementById('comment_canvas');
            if (!this.canvas) {
                setTimeout(getCanvas, 200);
            } else {
                this.ctx = this.canvas.getContext('2d', { alpha: true });
                this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
                this.ctx.fillStyle = this.color;
                this.ctx.strokeStyle = this.strokeColor;
                this.ctx.lineWidth = this.lineW;
                this.ctx.globalAlpha = this.Alpha;
                this.ctx.textBaseline = 'top';

                this.addManagedEventListener(this.videoElement.parentElement, "click", () => this.canvasSizeSet());
                console.log("[CommentScroll] Canvas added and context obtained.");

                this.canvasSizeSet(); // canvasSizeSet内でworkerを初期化
                this.commentget_observer();
                this.startAnimation();
            }
        };
        getCanvas();
    }

    canvasSizeSet() {
        setTimeout(() => {
            if (!this.videoElement || !this.canvas || !this.ctx) return;
            const rect = this.videoElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.canvasWid = this.canvas.width;

            this.commentLane = this.generateCommentLanes(this.canvas.height, this.fontSize * 0.5, this.fontSize * 1.2);

            this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            this.ctx.fillStyle = this.color;
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.lineWidth = this.lineW;
            this.ctx.globalAlpha = this.Alpha;
            this.ctx.textBaseline = 'top';

            // Workerの初期化と設定更新
            if (!this.commentWorker) {
                this.commentWorker = new Worker(this.getWorkerBlobUrl());
                this.commentWorker.onmessage = (e) => {
                    if (e.data.type === 'commentsUpdated') {
                        this.activeCommentsToDraw = e.data.comments;
                    }
                };
            }
            if (this.commentWorker) {
                this.commentWorker.postMessage({
                    type: 'init',
                    payload: {
                        fontSize: this.fontSize,
                        fontFamily: this.fontFamily,
                        scrollSpeed: this.scrollSpeed,
                        boostRate: this.boostRate,
                        canvasWidth: this.canvasWid,
                        commentLanes: this.commentLane
                    }
                });
                this.commentWorker.postMessage({
                    type: 'updateCanvasSize',
                    payload: {
                        canvasWidth: this.canvasWid,
                        commentLanes: this.commentLane
                    }
                });
            }

            console.log(`[CommentScroll] Canvas resized: ${this.canvas.width}x${this.canvas.height}. Lanes: ${this.commentLane.length}`);
        }, 500);
    }

    // WorkerのBlob URLを作成するヘルパー関数
    getWorkerBlobUrl() {
        const workerScriptContent = `
            let commentObj = {};
            let canvasWidth = 0;
            let fontSize = 0;
            let fontFamily = "";
            let scrollSpeed = 0;
            let boostRate = [0, 0];
            let commentLanes = [];
            let laneCounter = 0;
            let idCounter = 0;

            self.onmessage = function(e) {
                const { type, payload } = e.data;

                switch (type) {
                    case 'init':
                        fontSize = payload.fontSize;
                        fontFamily = payload.fontFamily;
                        scrollSpeed = payload.scrollSpeed;
                        boostRate = payload.boostRate;
                        canvasWidth = payload.canvasWidth;
                        commentLanes = payload.commentLanes;
                        if (typeof OffscreenCanvas !== 'undefined') {
                            self.offscreenCanvas = new OffscreenCanvas(1, 1);
                            self.offscreenCtx = self.offscreenCanvas.getContext('2d');
                            self.offscreenCtx.font = \`\${fontSize}px \${fontFamily}\`;
                        } else {
                            console.warn("OffscreenCanvas not supported in this Web Worker environment. Text width calculations might be inaccurate.");
                        }
                        break;

                    case 'addComment':
                        const text = payload.text;
                        let textMetricsWidth = 0;
                        if (self.offscreenCtx) {
                            textMetricsWidth = self.offscreenCtx.measureText(text).width;
                        } else {
                            textMetricsWidth = text.length * (fontSize * 0.6);
                        }

                        const newComment = {
                            TEXT: text,
                            w: canvasWidth, // 初期位置を画面右端に設定
                            s: Math.ceil(scrollSpeed * (1 * (1 + boostRate[0] * Math.floor(text.length / boostRate[1])))),
                            y: commentLanes[laneCounter],
                            textWidth: textMetricsWidth,
                        };
                        commentObj[idCounter] = newComment;
                        laneCounter = (laneCounter >= commentLanes.length - 1) ? 0 : laneCounter + 1;
                        idCounter++;
                        break;

                    case 'updateAndGetComments':
                        const nextCommentObj = {}; // 新しいコメントオブジェクトを生成
                        for (const key in commentObj) {
                            const c = commentObj[key];
                            c.w -= c.s;
                            // コメントが画面外に出ていないものだけを新しいオブジェクトに追加
                            if (c.w + c.textWidth > 0) { // 修正: 画面外判定の条件を厳密化
                                nextCommentObj[key] = c;
                            }
                        }
                        commentObj = nextCommentObj; // 参照を切り替える
                        self.postMessage({ type: 'commentsUpdated', comments: commentObj });
                        break;

                    case 'reset':
                        commentObj = {};
                        laneCounter = 0;
                        idCounter = 0;
                        break;

                    case 'updateCanvasSize':
                        canvasWidth = payload.canvasWidth;
                        commentLanes = payload.commentLanes;
                        if (self.offscreenCtx) {
                            self.offscreenCtx.font = \`\${fontSize}px \${fontFamily}\`;
                        }
                        break;
                }
            };
        `;
        const blob = new Blob([workerScriptContent], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }


    drawComments() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Workerから受け取ったコメントデータを使って描画
        Object.entries(this.activeCommentsToDraw).forEach(([key, c]) => {
            if (this.commentLane.includes(c.y)) { // レーンが存在するか確認（Workerが古いレーン情報で送ってくる可能性も考慮）
                this.ctx.strokeText(c.TEXT, c.w, c.y);
                this.ctx.fillText(c.TEXT, c.w, c.y);
            }
        });
    }

    startAnimation() {
        if (this.animationRunning) return;
        this.animationRunning = true;
        this.lastTime = performance.now();

        const animateLoop = (currentTime) => {
            this.animationFrameId = requestAnimationFrame(animateLoop);
            const deltaTime = currentTime - this.lastTime;
            if (deltaTime >= this.interval) {
                this.lastTime = currentTime - (deltaTime % this.interval);
                // Workerにコメントの更新を要求し、描画データを受け取る
                if (this.commentWorker) {
                    this.commentWorker.postMessage({ type: 'updateAndGetComments' });
                }
                this.drawComments();
            }
        };
        this.animationFrameId = requestAnimationFrame(animateLoop);
        console.log("[CommentScroll] Animation started.");
    }

    videoSkipEvent() {
        if (!this.videoElement) return;
        const reinitObserver = () => {
            console.log("[CommentScroll] Video seeked or arrow key pressed, re-initializing observer.");
            if (this.observer) {
                this.observer.disconnect();
            }
            if (this.commentWorker) {
                this.commentWorker.postMessage({ type: 'reset' }); // Workerのコメントもリセット
            }
            this.commentget_observer();
            this.activeCommentsToDraw = {}; // 描画用のコメントもクリア
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        this.addManagedEventListener(this.videoElement, 'seeked', reinitObserver);
        this.addManagedEventListener(document.body, 'keyup', (e) => {
            if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                reinitObserver();
            }
        });
    }
}

const comeScroll = new CommentScroll(setting, HTML);
let currentGlobalUrl = location.href;

// 初期起動
if (currentGlobalUrl.includes("kick.com/") && !currentGlobalUrl.endsWith("kick.com/")) {
    comeScroll.firstEvent();
}

// URL変更監視
setInterval(() => {
    if (currentGlobalUrl !== location.href) {
        console.log(`[CommentScroll] URL changed (setInterval) from ${currentGlobalUrl} to ${location.href}`);
        currentGlobalUrl = location.href;
        if (location.href.includes("kick.com/") && !location.href.endsWith("kick.com/")) {
            console.log("[CommentScroll] URL change detected (setInterval), dispatching urlChange event.");
            window.dispatchEvent(new CustomEvent('urlChange'));
        } else {
            console.log("[CommentScroll] URL changed (setInterval), but not a streaming page. Stopping features.");
            comeScroll.stopAnimation();
            if (comeScroll.observer) {
                comeScroll.observer.disconnect();
                comeScroll.observer = null;
            }
            if (comeScroll.commentWorker) {
                comeScroll.commentWorker.postMessage({ type: 'reset' });
            }
            comeScroll.cleanupEventListeners();
            const existingCanvasDiv = document.getElementById('comment_canvas')?.parentElement;
            if (existingCanvasDiv) existingCanvasDiv.remove();
            comeScroll.initFlg();
            comeScroll.isFirstEventSetup = false;
        }
    }
}, 3000);

window.addEventListener('urlChange', () => {
    console.log("[CommentScroll] urlChange event received. Calling reset for re-initialization.");
    comeScroll.reset();
});