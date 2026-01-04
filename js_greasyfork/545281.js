// ==UserScript==
// @name         爱给音效下载
// @namespace    https://b1ue.me
// @version      2025-08-15
// @description  免登录下载
// @author       B1ue
// @match        https://www.aigei.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545281/%E7%88%B1%E7%BB%99%E9%9F%B3%E6%95%88%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/545281/%E7%88%B1%E7%BB%99%E9%9F%B3%E6%95%88%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.$, AudioPlayerManager = window.AudioPlayerManager, AudioPlayerStatus = window.AudioPlayerStatus;
    const NATIVE_create = AudioPlayerManager.create.bind(AudioPlayerManager), NATIVE_getByEl = AudioPlayerManager.getByEl.bind(AudioPlayerManager);

    const downloadFile = (url, fileName) => {
        fetch(url,{})
            .then(response => response.blob())
            .then(blob => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = fileName;
            link.target = "_blank";
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        });
    };

    const ProcessItem = item => {
        $(`<a id="freedown_${item.id}" class="audio-down-btn btn btn-default" style="color: #3ba36f;" title="点击免费下载"><i class="gei-icon-font-download"></i>免费下载</a>`).click(() => {
            const itemName = item?.itemName?.replace(/<[^>]+>/g,"");
            const url = item?.audioSound?.sound?.url;
            if(!url){
                if(!('fileGet' in window)){alert('未获取到链接,请先播放一次'); return;}
                const ocbk = $('#itemInfoToken_audio_mp3_' + item.id).attr('cbk');
                $('#itemInfoToken_audio_mp3_' + item.id).attr('cbk','callBackAudioFile_Custom');
                window.fileGet.call(AudioPlayerManager, $('#itemInfoToken_audio_mp3_' + item.id).get(0), 'play', null, null, null, null, item.containerEl);
                $('#itemInfoToken_audio_mp3_' + item.id).attr('cbk',ocbk);
                return;
            }
            downloadFile(url,`${itemName}.mp3`);
        }).appendTo(item.containerEl.find('.audio-download-box'));
    };

    AudioPlayerManager.create = elem => {
        NATIVE_create(elem);
        const item = NATIVE_getByEl(elem);
        ProcessItem(item);
    }

    AudioPlayerManager.each(item => {
        ProcessItem(item);
    });

    window.callBackAudioFile_Custom = (id,url,unk,obj) => {
        const item = AudioPlayerManager.getByEl(obj.customData);
        const itemName = item?.itemName?.replace(/<[^>]+>/g,"");
        item.audioSound.init(item.containerEl, url);
        item.urlRequestStatus = AudioPlayerStatus.UrlRequestStatus.succ;
        downloadFile(url,`${itemName}.mp3`);
    };
})();