// ==UserScript==
// @name         暮光方块论坛-音乐分享助手
// @name:zh-TW   暮光方块论坛-QQ音乐分享助手
// @namespace    https://bbs.tsfk.top
// @version      2.2.0
// @description  更加方便获取音乐ID然后在暮光方块论坛分享
// @description:zh-tw  更加方便获取QQ音乐ID然后在暮光方块论坛分享
// @author       Karry,TssTech
// @match        https://y.qq.com/n/yqq/song/*.html*
// @match        https://y.qq.com/n/ryqq/songDetail/*
// @match        https://y.qq.com/n/ryqq/playlist/*
// @match        https://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421377/%E6%9A%AE%E5%85%89%E6%96%B9%E5%9D%97%E8%AE%BA%E5%9D%9B-%E9%9F%B3%E4%B9%90%E5%88%86%E4%BA%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/421377/%E6%9A%AE%E5%85%89%E6%96%B9%E5%9D%97%E8%AE%BA%E5%9D%9B-%E9%9F%B3%E4%B9%90%E5%88%86%E4%BA%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function getQQMusicId() {
        var url = window.location.href;
        var parts = url.split("/");
        var id = parts[parts.length - 1];
        if (id === "") {
            id = parts[parts.length - 2];
        }
        return id.split(".")[0];
    }

    function getNetEaseMusicId() {
        var url = window.location.href;
        var params = url.split('?')[1];
        return params.split('=')[1];
    }

    function appendQQMusicCode() {
        var singerElement = document.querySelector(".data__singer");
        if (singerElement) {
            var url = window.location.href;
            var isPlaylist = url.includes("/playlist/");
            var codeElement = document.createElement("div");
            var codeText = isPlaylist ? '[QMP]' + getQQMusicId() + '[/QMP]' : '[QMUSIC]' + getQQMusicId() + '[/QMUSIC]';
            var innerHTML = isPlaylist ?
                '<font color="#ff85ae" style="position: absolute;margin-left: 253px;margin-top: -107px;">如果要将此歌单分享到暮光方块论坛，请复制此代码：</font><text id="code" style="position: absolute;margin-left: 250px;margin-top: -87px;">' + codeText + '</text>' :
                '<font color="#ff85ae" style="position: absolute;margin-left: 253px;margin-top: -107px;">如果要将此音乐分享到暮光方块论坛，请复制此代码：</font><text id="code" style="position: absolute;margin-left: 250px;margin-top: -87px;">' + codeText + '</text>';
            innerHTML += '<button style="position: absolute;margin-left: 582px;margin-top: -109px;" onclick="navigator.clipboard.writeText(\'' + codeText + '\')">快速复制</button>';
            codeElement.innerHTML = innerHTML;
            singerElement.appendChild(codeElement);
        }
    }

    function appendNetEaseMusicCode() {
        var isPlaylist = window.location.href.includes("/playlist?");
        var targetElement = isPlaylist ? document.querySelector('.out.out-list.s-fc3') : document.querySelector('.out.s-fc3');
        if (targetElement) {
            var codeElement = document.createElement('div');
            var codeText = isPlaylist ? '[NCMP]' + getNetEaseMusicId() + '[/NCMP]' : '[NCMS]' + getNetEaseMusicId() + '[/NCMS]';
            var innerHTML = isPlaylist ?
                '<div class="out out-list s-fc3"><i class="u-icn u-icn-95 f-fl"></i><a href="javascript:void(0);" onclick="navigator.clipboard.writeText(\'' + codeText + '\')" class="des s-fc7">复制暮光方块论坛分享代码</a></div>' :
                '<div class="out s-fc3"><i class="u-icn u-icn-95 f-fl"></i><a href="javascript:void(0);" onclick="navigator.clipboard.writeText(\'' + codeText + '\')" class="des s-fc7">复制暮光方块论坛分享代码</a></div>';
            codeElement.innerHTML = innerHTML;
            targetElement.parentNode.insertBefore(codeElement, targetElement.nextSibling);
        }
    }

    if (window.location.host === 'y.qq.com') {
        window.onload = appendQQMusicCode;
    } else if (window.location.host === 'music.163.com') {
        window.addEventListener('load', function() {
            var iframe = document.getElementById('g_iframe');
            if (iframe) {
                iframe.onload = appendNetEaseMusicCode;
            } else {
                appendNetEaseMusicCode();
            }
        });
    }
})();
