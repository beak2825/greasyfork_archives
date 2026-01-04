// ==UserScript==
// @name         下载网易云lrc歌词
// @namespace    https://github.com/0And1Story
// @version      1.0.0
// @description  下载网易云音乐的歌词（lrc文件格式）
// @author       0And1Story
// @match        https://music.163.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458706/%E4%B8%8B%E8%BD%BD%E7%BD%91%E6%98%93%E4%BA%91lrc%E6%AD%8C%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/458706/%E4%B8%8B%E8%BD%BD%E7%BD%91%E6%98%93%E4%BA%91lrc%E6%AD%8C%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyLyric() {
        let song_id = window.location.href.match(/song\?id=(\d+)/)[1];
        fetch(`http://music.163.com/api/song/media?id=${song_id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.lyric);
            const input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = data.lyric;
            input.setSelectionRange(0, input.value.length);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('复制成功');
        });
    }

    setTimeout(function() {
        let box = document.querySelector('#user-operation > p.s-fc3');
        box.innerHTML = `<a class="f-tdu s-fc7">复制歌词</a>&nbsp;&nbsp;&nbsp;&nbsp;` + box.innerHTML;
        box.querySelector('a').onclick = copyLyric;
    }, 500);
})();