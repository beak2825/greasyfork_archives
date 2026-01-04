// ==UserScript==
// @name         Civitai Text Downloader
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Make Donload button click to save a description text file.
// @author       SenY
// @match        https://civitai.com/*
// @icon         https://civitai.com/favicon.ico
// @grant        none
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/467779/Civitai%20Text%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/467779/Civitai%20Text%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 非メンテナンス警告用のHTMLを作成
    const warningHTML = `
        <div style="padding: 20px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; margin: 10px; font-family: Arial, sans-serif;">
            <h2 style="color: #856404; margin-bottom: 20px;">⚠️ End of Maintenance Notice / 更新終了のお知らせ</h2>
            
            <div style="color: #856404; margin-bottom: 20px;">
                <p style="margin-bottom: 10px;">
                    This userscript "Civitai Text Downloader" is no longer maintained.<br>
                    Please consider switching to the actively maintained fork "Civitai Text Downloader Mod".
                </p>
                <p style="margin-bottom: 20px;">
                    「Civitai Text Downloader」は現在メンテナンスされていません。<br>
                    活発にメンテナンスされているフォーク「Civitai Text Downloader Mod」への移行をご検討ください。
                </p>
            </div>

            <div style="text-align: center;">
                <a href="https://sleazyfork.org/en/scripts/501321-civitai-text-downloader-mod" 
                   target="_blank" 
                   style="display: inline-block; padding: 10px 20px; background-color: #856404; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Go to Civitai Text Downloader Mod
                </a>
            </div>
        </div>
    `;

    // HTMLをBlobに変換
    const blob = new Blob([warningHTML], { type: 'text/html' });
    
    // Blobからbase64エンコードされたURLを作成
    const blobUrl = URL.createObjectURL(blob);
    
    // 新しいウィンドウでメッセージを表示
    window.open(blobUrl, '_blank', 'width=700,height=400');

    // メモリリーク防止のためにURLを解放
    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
    }, 1000);
})();