// ==UserScript==
// @name                Netflix Enhanced Progress Bar
// @name:en             Netflix Enhanced Progress Bar
// @name:ja             Netflix Enhanced Progress Bar
// @name:zh-CN          Netflix Enhanced Progress Bar
// @name:ko             Netflix Enhanced Progress Bar
// @name:ru             Netflix Enhanced Progress Bar
// @name:de             Netflix Enhanced Progress Bar
// @description         Netflixの動画にプログレスバーを追加します。
// @description:en      Adds a progress bar to Netflix videos.
// @description:ja      Netflixの動画にプログレスバーを追加します。
// @description:zh-CN   为 Netflix 视频添加进度条。
// @description:ko      Netflix 동영상에 진행 막대를 추가합니다.
// @description:ru      Добавляет индикатор прогресса к видео на Netflix.
// @description:de      Fügt einen Fortschrittsbalken zu Netflix-Videos hinzu.
// @version             1.0.0
// @author              Yos_sy
// @match               *://*.netflix.com/*
// @namespace           http://tampermonkey.net/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @license             MIT
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/501201/Netflix%20Enhanced%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/501201/Netflix%20Enhanced%20Progress%20Bar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定数定義
  const PROGRESS_UPDATE_INTERVAL = 1000; // プログレスバー更新間隔（ミリ秒）
  const VIDEO_CHECK_INTERVAL = 1000; // ビデオ要素チェック間隔（ミリ秒）

  class NetflixProgressBar {
    constructor() {
      this.progressBar = null; // カスタムプログレスバーの要素
      this.progress = null; // プログレスバーの進行状況を示す要素
      this.videoElement = null; // 現在のビデオ要素
      this.updateInterval = null; // プログレスバー更新のためのインターバルID
      this.videoCheckInterval = null; // ビデオ要素チェックのためのインターバルID
    }

    // 初期化メソッド
    init() {
      this.addStyles(); // カスタムスタイルをページに追加
      this.startVideoCheck(); // ビデオ要素の存在を定期的にチェック
      this.observeDOMChanges(); // DOMの変化を監視
      this.observeURLChanges(); // URLの変更を監視（SPA対応）
    }

    // スタイルを追加
    addStyles() {
      const style = document.createElement("style");
      style.textContent = `
        .netflixEnhancedProgressBar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background-color: rgba(128, 128, 128, 0.7);
          z-index: 9999;
        }
        .netflixEnhancedProgress {
          width: 0%;
          height: 100%;
          background-color: #e50914;
          transition: width 0.25s linear;
        }
      `;
      document.head.appendChild(style); // スタイルをheadに追加
    }

    // プログレスバー要素を作成
    createProgressBar() {
      this.progressBar = document.createElement("div");
      this.progressBar.className = "netflixEnhancedProgressBar"; // カスタムプログレスバーのクラス名を設定
      this.progress = document.createElement("div");
      this.progress.className = "netflixEnhancedProgress"; // プログレスバーの進行状況を示すクラス名を設定
      this.progressBar.appendChild(this.progress); // プログレスバーに進行状況を示す要素を追加
      return this.progressBar;
    }

    // プログレスバーの進行状況を更新
    updateProgress() {
      if (!this.videoElement || !this.progress) return; // ビデオ要素またはプログレスバーが存在しない場合は終了
      const percentage =
        (this.videoElement.currentTime / this.videoElement.duration) * 100; // 現在の再生時間を全体の再生時間で割り、パーセンテージを計算
      this.progress.style.width = `${percentage}%`; // プログレスバーの幅を更新
    }

    // プログレスバーの定期更新を開始
    startProgressUpdate() {
      this.stopProgressUpdate(); // 既存の更新を停止
      this.updateInterval = setInterval(
        () => this.updateProgress(),
        PROGRESS_UPDATE_INTERVAL
      ); // プログレスバーの更新を定期的に実行
    }

    // プログレスバーの更新を停止
    stopProgressUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval); // インターバルをクリア
        this.updateInterval = null;
      }
    }

    // ビデオ要素の変更を処理
    handleVideoChange() {
      try {
        const newVideoElement = document.querySelector("video"); // 現在のページに存在するビデオ要素を取得
        if (newVideoElement !== this.videoElement) {
          this.cleanUp(); // 古いリソースをクリーンアップ
          this.videoElement = newVideoElement; // 新しいビデオ要素を設定
          if (this.videoElement) {
            this.createAndAttachProgressBar(); // プログレスバーを作成し、ビデオ要素に付加
            this.startProgressUpdate(); // プログレスバーの定期更新を開始
          }
        }
      } catch (error) {
        console.error("Error in handleVideoChange:", error); // エラーをコンソールに出力
      }
    }

    // プログレスバーを作成し、ビデオ要素に付加
    createAndAttachProgressBar() {
      if (!this.progressBar) {
        this.progressBar = this.createProgressBar(); // プログレスバーが存在しない場合、新規作成
      }
      this.videoElement.parentNode.appendChild(this.progressBar); // プログレスバーをビデオ要素の親要素に追加
    }

    // リソースのクリーンアップ
    cleanUp() {
      this.stopProgressUpdate(); // プログレスバーの定期更新を停止
      if (this.progressBar && this.progressBar.parentNode) {
        this.progressBar.parentNode.removeChild(this.progressBar); // プログレスバーをDOMから削除
      }
      this.progressBar = null; // プログレスバーの参照をクリア
      this.progress = null; // プログレスバーの進行状況要素の参照をクリア
    }

    // ビデオ要素の存在を定期的にチェック
    startVideoCheck() {
      this.videoCheckInterval = setInterval(
        () => this.handleVideoChange(),
        VIDEO_CHECK_INTERVAL
      ); // 定期的にビデオ要素の変更をチェック
    }

    // DOMの変化を監視
    observeDOMChanges() {
      const observer = new MutationObserver(() => this.handleVideoChange()); // DOM変化の監視を設定
      observer.observe(document.body, { childList: true, subtree: true }); // body要素以下の全ての変更を監視
    }

    // URLの変更を監視（SPA対応）
    observeURLChanges() {
      let lastUrl = location.href; // 最後に確認したURLを保存
      new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
          // URLが変更された場合
          lastUrl = url; // 新しいURLを保存
          this.handleVideoChange(); // ビデオ要素の変更を処理
        }
      }).observe(document, { subtree: true, childList: true }); // ドキュメント全体の変更を監視
    }
  }

  // プログレスバーのインスタンスを作成し、初期化
  const progressBar = new NetflixProgressBar();
  progressBar.init();
})();
