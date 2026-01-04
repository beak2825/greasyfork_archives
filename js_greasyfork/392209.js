// ==UserScript==
// @name         推荐语众包音乐内嵌播放
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://st.music.163.com/music-webview-content/tag.html
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/141
// @downloadURL https://update.greasyfork.org/scripts/392209/%E6%8E%A8%E8%8D%90%E8%AF%AD%E4%BC%97%E5%8C%85%E9%9F%B3%E4%B9%90%E5%86%85%E5%B5%8C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/392209/%E6%8E%A8%E8%8D%90%E8%AF%AD%E4%BC%97%E5%8C%85%E9%9F%B3%E4%B9%90%E5%86%85%E5%B5%8C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const audio = document.createElement('audio');
    audio.setAttribute('autoplay', 'autoplay');
    audio.setAttribute('controls', 'controls');
    audio.setAttribute('style', 'left: 0; top: 20px; width: 100%; position: fixed');

    class FakeXMLHttpRequest extends XMLHttpRequest {
        open(...args) {
            if (args[1].indexOf('api/song/comment/zhongbao/comment/get') >= 0) {
                this.addEventListener('load', () => {
                    audio.src = 'http://music.163.com/song/media/outer/url?id=' + JSON.parse(this.responseText).data.songId + '.mp3';
                    document.body.appendChild(audio);
                    audio.play();
                });
            }
            super.open(...args);
        }
    }
    window.XMLHttpRequest = FakeXMLHttpRequest;
})();