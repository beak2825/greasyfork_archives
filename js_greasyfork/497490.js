// ==UserScript==
// @name         YouTube字幕自動翻訳
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自動的にYouTubeの字幕を日本語に翻訳します
// @author       Aoi
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497490/YouTube%E5%AD%97%E5%B9%95%E8%87%AA%E5%8B%95%E7%BF%BB%E8%A8%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/497490/YouTube%E5%AD%97%E5%B9%95%E8%87%AA%E5%8B%95%E7%BF%BB%E8%A8%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setJapaneseSubtitles() {
        let settingsButton = document.querySelector('.ytp-settings-button');
        if (settingsButton) {
            settingsButton.click();
            setTimeout(() => {
                let menuItems = document.querySelectorAll('.ytp-menuitem');
                let subtitlesMenuItem = Array.from(menuItems).find(item => item.innerText.includes('字幕'));
                if (subtitlesMenuItem) {
                    subtitlesMenuItem.click();
                    setTimeout(() => {
                        let langItems = document.querySelectorAll('.ytp-menuitem');
                        let japaneseItem = Array.from(langItems).find(langItem => langItem.innerText.includes('日本語'));
                        if (japaneseItem) {
                            japaneseItem.click();
                            // 設定メニューを閉じる
                            setTimeout(() => {
                                settingsButton.click();
                            }, 500);
                        } else {
                            // 日本語字幕が見つからなかった場合でも設定メニューを閉じる
                            settingsButton.click();
                        }
                    }, 500);
                } else {
                    // 字幕メニューが見つからなかった場合でも設定メニューを閉じる
                    settingsButton.click();
                }
            }, 500);
        }
    }

    // 字幕ボタンのクリックイベントを監視
    const observer = new MutationObserver(() => {
        let subtitleButton = document.querySelector('.ytp-subtitles-button.ytp-button');
        if (subtitleButton) {
            subtitleButton.addEventListener('click', setJapaneseSubtitles);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
