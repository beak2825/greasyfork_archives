// ==UserScript==
// @name         下载网易云lrc歌词文件
// @namespace    https://gitee.com/PDBC
// @version      1.0.1
// @description  下载网易云音乐的歌词（lrc文件格式）
// @author       nullnull
// @match        https://music.163.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534065/%E4%B8%8B%E8%BD%BD%E7%BD%91%E6%98%93%E4%BA%91lrc%E6%AD%8C%E8%AF%8D%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/534065/%E4%B8%8B%E8%BD%BD%E7%BD%91%E6%98%93%E4%BA%91lrc%E6%AD%8C%E8%AF%8D%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lyrictext;
    let lrcfilename;

    // 创建并显示浮动提示（在鼠标位置附近）
    function showToast(message, event, posx, posy) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.left = (event.clientX - posx) + 'px';
        toast.style.top = (event.clientY - posy) + 'px';
        toast.style.padding = '8px 12px';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = '#fff';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.transform = 'translateY(10px)';
        toast.style.pointerEvents = 'none';
        toast.style.fontSize = '14px';
        toast.style.maxWidth = '300px';
        toast.style.whiteSpace = 'nowrap';
        document.body.appendChild(toast);

        // 显示提示
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // 2秒后淡出并移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    }

    function getSongInfo(event) {
        let song_id = window.location.href.match(/song\?id=(\d+)/)[1];
        return  Promise.all([
		fetch(`http://music.163.com/api/song/media?id=${song_id}`),
        fetch(`https://music.163.com/api/song/detail?ids=[${song_id}]`)
        ])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([lyricdata,detaildata]) => {
            lyrictext = lyricdata.lyric;
            showToast(`已成功获取歌词信息`,event, 0, 50);

            const song = detaildata.songs[0];
            // 处理多个艺术家的情况
            const artists = song.artists?.map(artist => artist.name) || [];
            const artistNames = artists.length > 0 ?
                  artists.join(',') :  // 用逗号分隔多个歌手
            '未知艺术家';

            const infoText = `${artistNames} - ${song.name || '未知歌曲'}.lrc`;
            lrcfilename = infoText;
        });
    }

    async function saveFile(event) {
        await getSongInfo(event);
        if (lrcfilename != undefined)
        {
            showToast(`歌词文件名:\n${lrcfilename}`,event, 0, 50);

            try {
                const filename = lrcfilename;
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{
                        description: 'lrc Files',
                        accept: { 'text/plain': ['.lrc'] },
                    }],
                });

                const writable = await handle.createWritable();
                await writable.write(lyrictext);
                await writable.close();
            } catch (err) {
                // 用户取消保存时会触发
            }
        }
        else
        {
            showToast(`歌词文件名为:${lrcfilename}, 请点击获取歌词信息`,event, 0, 50);
        }

    }

    setTimeout(function() {
        let box = document.querySelector('#user-operation > p.s-fc3');
        if (box) {
            // 添加两个按钮
            box.innerHTML = `
                <a class="f-tdu s-fc7" style="margin-right: 15px;">下载歌词文件</a>
            ` + box.innerHTML;

            // 为按钮添加事件
            box.querySelectorAll('a')[0].addEventListener('click', saveFile);
        }
    }, 500);
})();