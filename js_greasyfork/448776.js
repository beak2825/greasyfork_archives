// ==UserScript==
// @name         摸鱼派小尾巴
// @namespace    fishpi.cn.tailer
// @version      0.3
// @description  小尾巴啦~~~
// @author       涛之雨
// @match        https://fishpi.cn/cr
// @icon         https://fishpi.cn/images/favicon.png
// @grant        GM_registerMenuCommand
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/448776/%E6%91%B8%E9%B1%BC%E6%B4%BE%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/448776/%E6%91%B8%E9%B1%BC%E6%B4%BE%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

/* global $ ChatRoom*/
/* eslint-disable no-caller */
!function() {
    let t = 0, e = 0;
    const o = ($(".avatar-small").css("background-image").match(/https?:\/\/[^?]+/g) || [ "https://pwl.stackoverflow.wiki/2021/10/blob-29bbd528.png" ])[0], n = function() {
        const n = ChatRoom.editor.getValue();
        ChatRoom.editor.setValue(n.trim().startsWith("小冰") || n.trim().startsWith("点歌") || n.trim().startsWith("朗读") || n.trim().toUpperCase().startsWith("TTS") || n.trim().startsWith("tts") ? n : n + (100 !== t ? `\n\n\n> ![](https://unv-shield.librian.net/api/unv_shield?scale=1.3&txt=%E5%BD%93%E5%89%8D%E6%B4%BB%E8%B7%83%E5%BA%A6${t}%25${"[" + ">".repeat(Math.floor(t / 10)) + "=".repeat(10 - Math.floor(t / 10)) + "]"}&url=${o}&backcolor=66ccff&fontcolor=ffffff)\n> 下次更新时间：${15 - Math.floor((new Date().getTime() - e) / 1e3)}秒后` : `\n\n\n> ![](https://unv-shield.librian.net/api/unv_shield?scale=0.79&txt=🎉满了满了💕&url=${o}&backcolor=66ccff&fontcolor=ffffff)`))
        setTimeout(() => ChatRoom._send(), 0);
    };
    ChatRoom._send = ChatRoom._send || ChatRoom.send
    ChatRoom.send = function() {
        arguments.callee && ![ "ctrlEnter", "onclick" ].includes(arguments.callee.caller.name) ? ChatRoom._send() : 100 !== t && new Date().getTime() - e > 15e3 ? (fetch("https://fishpi.cn/user/liveness?_=" + Math.random()).then(t => t.json()).then(e => {
            t = e.liveness
            n();
        }), e = new Date().getTime()) : n();
    };
}();