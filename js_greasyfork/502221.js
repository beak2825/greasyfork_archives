// ==UserScript==
// @name         Shazam自动跳转音乐平台
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  自动在各音乐平台上搜索Shazam当前播放的音频和作者，并允许用户选择跳转到哪一个平台
// @author       OB_BUFF
// @icon         https://help.apple.com/assets/64C2D2BA4F285EDB3409AC28/64C2D2BE4F285EDB3409AC2E/en_US/16a54e583a9dcfeb4cfa917b78806e46.png
// @match        https://www.shazam.com/song/*
// @license CC BY-NC-SA 4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502221/Shazam%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%9F%B3%E4%B9%90%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502221/Shazam%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%9F%B3%E4%B9%90%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面内容加载完成
    window.addEventListener('load', function() {
        // 更新后的XPath选择器
        const songXpath = "//h1[contains(@class, 'TrackPageHeader_title')]";  // 选择包含曲名的标题
        const artistXpath = "//h2//a[contains(@class, 'common_link__7If7r')]/span";  // 选择包含作者名称的链接文本

        // 使用XPath选择曲名和作者的DOM元素
        const songElement = document.evaluate(songXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const artistElement = document.evaluate(artistXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (songElement) {
            // 获取歌曲名称
            const songTitle = songElement.textContent.trim();
            let artistName = '';

            if (artistElement) {
                // 获取作者名称
                artistName = artistElement.textContent.trim();
            }

            // 构建搜索字符串
            let searchString = songTitle;
            if (artistName) {
                searchString += ` - ${artistName}`;
            }

            // 编码搜索字符串
            const encodedSearchString = encodeURIComponent(searchString);

            // 构建各音乐平台的搜索URL
            const spotifyURL = `https://open.spotify.com/search/${encodedSearchString}`;
            const neteaseURL = `https://music.163.com/#/search/m/?s=${encodedSearchString}`;
            const appleMusicURL = `https://music.apple.com/search?term=${encodedSearchString}`;
            const qqMusicURL = `https://y.qq.com/n/ryqq/search?w=${encodedSearchString}`;
            const kugouURL = `https://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord=${encodedSearchString}`;
            const kuwoURL = `http://www.kuwo.cn/search/list?key=${encodedSearchString}`;

            // 创建弹窗
            const popup = document.createElement('div');
            popup.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 10px;">请选择跳转到哪个音乐平台进行搜索：</p>
                    <button style="display: block; width: 100%; margin-bottom: 10px; padding: 10px; color: white; background: #1DB954; border: none; border-radius: 4px; font-size: 16px;" id="spotify">Spotify</button>
                    <button style="display: block; width: 100%; margin-bottom: 10px; padding: 10px; color: white; background: #C20C0C; border: none; border-radius: 4px; font-size: 16px;" id="netease">网易云音乐</button>
                    <button style="display: block; width: 100%; margin-bottom: 10px; padding: 10px; color: white; background: #FA2C19; border: none; border-radius: 4px; font-size: 16px;" id="qqMusic">QQ音乐</button>
                    <button style="display: block; width: 100%; margin-bottom: 10px; padding: 10px; color: white; background: #0071E3; border: none; border-radius: 4px; font-size: 16px;" id="appleMusic">Apple Music</button>
                    <button style="display: block; width: 100%; margin-bottom: 10px; padding: 10px; color: white; background: #31C27C; border: none; border-radius: 4px; font-size: 16px;" id="kugou">酷狗音乐</button>
                    <button style="display: block; width: 100%; margin-bottom: 10px; padding: 10px; color: white; background: #FF5E00; border: none; border-radius: 4px; font-size: 16px;" id="kuwo">酷我音乐</button>
                    <button style="display: block; width: 100%; padding: 10px; color: black; background: #E0E0E0; border: none; border-radius: 4px; font-size: 16px;" id="cancel">取消</button>
                </div>
            `;
            document.body.appendChild(popup);

            // 添加事件监听器
            document.getElementById('spotify').addEventListener('click', () => window.location.href = spotifyURL);
            document.getElementById('netease').addEventListener('click', () => window.location.href = neteaseURL);
            document.getElementById('appleMusic').addEventListener('click', () => window.location.href = appleMusicURL);
            document.getElementById('qqMusic').addEventListener('click', () => window.location.href = qqMusicURL);
            document.getElementById('kugou').addEventListener('click', () => window.location.href = kugouURL);
            document.getElementById('kuwo').addEventListener('click', () => window.location.href = kuwoURL);
            document.getElementById('cancel').addEventListener('click', () => popup.remove());
        } else {
            console.error('Song title not found on the page');
        }
    });
})();
