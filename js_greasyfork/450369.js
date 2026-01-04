// ==UserScript==
// @name         StuckGraber
// @namespace    copws.github.io/StackGraber
// @version      0.1
// @description  抓取在线音乐播放器正在播放的歌曲并下载，支持QQ音乐，酷狗音乐，酷我音乐，咪咕音乐
// @author       copcin
// @match        https://y.qq.com/n/ryqq/player
// @match        https://www.kugou.com/song/*
// @match        https://www.kuwo.cn/play_detail/*
// @match        https://music.migu.cn/v3/music/player/audio
// @license      GNU GPLv3
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/450369/StuckGraber.user.js
// @updateURL https://update.greasyfork.org/scripts/450369/StuckGraber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        HotKeyHandler.Init();
    }
    var HotKeyHandler = {
        currentMainKey: null,
        currentValueKey: null,
        Init: function() {
            HotKeyHandler.Register(0, "D",
            function() {
                var audios = document.getElementsByTagName("audio");
                GM_setClipboard(audios[0].src);
                alert("下载链接已复制到剪贴板");
            });
        },
        Register: function(tag, value, func) {
            var MainKey = "";
            switch (tag) {
            case 0:
                MainKey = 17; //Ctrl
                break;
            case 1:
                MainKey = 16; //Shift
                break;
            case 2:
                MainKey = "18"; //Alt
                break;
            }
            document.onkeyup = function(e) {
                HotKeyHandler.currentMainKey = null;
            }
            document.onkeydown = function(event) {
                //获取键值
                var keyCode = event.keyCode;
                var keyValue = String.fromCharCode(event.keyCode);
                event.preventDefault();
                if (HotKeyHandler.currentMainKey != null) {
                    if (keyValue == value) {
                        HotKeyHandler.currentMainKey = null;
                        if (func != null) func();
                    }
                }
                if (keyCode == MainKey) HotKeyHandler.currentMainKey = keyCode;
            }
        }
    }
})();
