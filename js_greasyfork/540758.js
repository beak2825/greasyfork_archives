// ==UserScript==
// @name        YouTubeの動画が何時に終わるか表示
// @namespace   mikan-megane.youtube-remaining-time
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.4
// @author      mikan-megane
// @description 動画が何時に終わるかを表示
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540758/YouTube%E3%81%AE%E5%8B%95%E7%94%BB%E3%81%8C%E4%BD%95%E6%99%82%E3%81%AB%E7%B5%82%E3%82%8F%E3%82%8B%E3%81%8B%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540758/YouTube%E3%81%AE%E5%8B%95%E7%94%BB%E3%81%8C%E4%BD%95%E6%99%82%E3%81%AB%E7%B5%82%E3%82%8F%E3%82%8B%E3%81%8B%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict'; // 厳格モードを有効にする

    /**
     * 時刻文字列 (例: "01:23" または "01:23:45") を秒数に変換するヘルパー関数。
     * @param {string} timeStr - 時刻を表す文字列 (MM:SS または HH:MM:SS 形式)。
     * @returns {number} - 変換された秒数。
     */
    const timeToSeconds = (timeStr) => {
        // 時刻文字列を ':' で分割し、各部分を数値に変換する
        const parts = timeStr.split(':').map(Number);
        // reduce を使用して、時、分、秒を合計秒数に変換する
        // 例: [1, 23, 45] -> (0 * 60 + 1) * 60 + 23) * 60 + 45
        return parts.reduce((acc, part) => acc * 60 + part, 0);
    };

    /**
     * DateオブジェクトからAM/PM形式の時刻文字列を生成するヘルパー関数。
     * 例: 13:30 -> PM 01:30
     * @param {Date} date - フォーマットするDateオブジェクト。
     * @returns {string} - フォーマットされた時刻文字列 (例: "AM 10:05", "PM 01:30")。
     */
    const formatTime = (date) => {
        const hours = date.getHours();
        // 12時間形式に変換し、0時と12時は12として表示する
        const displayHours = (hours % 12) || 12;
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // 時と分を2桁表示 (必要に応じて先頭にゼロを追加)
        const formattedHours = String(displayHours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };

    // 1秒ごとに動画の終了時刻を更新するタイマーを設定
    setInterval(() => {
        // 現在の動画プレイヤーの時刻表示部分をすべて取得
        // 通常はページに1つしかないが、念のためすべてを対象とする
        const wrappers = document.querySelectorAll('.ytp-time-contents');

        for (const wrapper of wrappers) {
            // 動画の総時間と現在の再生時間を取得する要素
            const durationElement = wrapper.querySelector('.ytp-time-duration');
            const currentElement = wrapper.querySelector('.ytp-time-current');

            // 終了時刻を表示する要素を検索
            let finishElement = wrapper.querySelector('.ytp-time-finish');

            // 必要な要素が見つからない場合、または時間が非表示の場合はスキップ
            if (!durationElement || !currentElement ||
                document.defaultView.getComputedStyle(durationElement).display === 'none') {
                // 終了時刻があるなら削除
                if(finishElement) {
                    finishElement.remove();
                }
                continue;
            }

            // finishElement がまだ存在しない場合のみ作成し、DOMに追加
            if (!finishElement) {
                finishElement = document.createElement('span');
                finishElement.classList.add('ytp-time-finish');
                // スタイルを適用して、元の時間表示と区別しやすくする
                Object.assign(finishElement.style, {
                    color: '#ddd', // 薄い灰色
                    marginLeft: '0.4em' // 少し左に余白を追加
                });
                // 総時間の要素の直後に挿入
                durationElement.after(finishElement);
            }

            // 総時間と現在の再生時間を秒数に変換
            const durationSeconds = timeToSeconds(durationElement.textContent);
            const currentSeconds = timeToSeconds(currentElement.textContent);

            // 総時間が0の場合（まだ動画情報が読み込まれていないなど）、スキップ
            if (durationSeconds === 0) {
                continue;
            }

            // 残り秒数を計算
            const remainingSeconds = durationSeconds - currentSeconds;
            // 現在時刻に残り秒数を加算して、終了時刻を計算
            const finishTime = new Date(Date.now() + remainingSeconds * 1000);

            // 終了時刻をフォーマットし、要素のテキストコンテンツを更新
            finishElement.textContent = `・ ${formatTime(finishTime)}`;
        }
    }, 1000); // 1000ミリ秒 (1秒) ごとに実行
})();
