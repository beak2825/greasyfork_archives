// ==UserScript==
// @name        QQ音乐网页播放器歌词lrc获取器
// @namespace   AnnAngela
// @match       https://y.qq.com/n/ryqq/player*
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @version     1.0
// @author      AnnAngela
// @description QQ音乐网页播放器歌词获取器，直接在播放器内获取lrc
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/427810/QQ%E9%9F%B3%E4%B9%90%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E5%99%A8%E6%AD%8C%E8%AF%8Dlrc%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/427810/QQ%E9%9F%B3%E4%B9%90%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E5%99%A8%E6%AD%8C%E8%AF%8Dlrc%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==
"use strict";
const base65Charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const decodeQMStupidEncodedText = function (encodedText) {
    const filteredText = encodedText.replace(/[^A-Za-z0-9+/=]/g, "");
    let transferedText = "";
    for (let i = 0; i < encodedText.length; void 0) {
        const i1 = i++;
        const i2 = i++;
        const i3 = i++;
        const i4 = i++;
        const transferedCode1 = base65Charset.indexOf(filteredText.charAt(i2));
        const charCode = base65Charset.indexOf(filteredText.charAt(i1)) << 2 | transferedCode1 >> 4;
        const transferedCode2 = base65Charset.indexOf(filteredText.charAt(i3));
        const transferedCode3 = (15 & transferedCode1) << 4 | transferedCode2 >> 2;
        const transferedCode4 = base65Charset.indexOf(filteredText.charAt(i4));
        const transferedCode5 = (3 & transferedCode2) << 6 | transferedCode4;
        transferedText += String.fromCharCode(charCode);
        if (transferedCode2 !== 64) {
            transferedText += String.fromCharCode(transferedCode3);
        }
        if (transferedCode4 !== 64) {
            transferedText += String.fromCharCode(transferedCode5);
        }
    }
    let decodedText = "";
    for (let j = 0; j < transferedText.length; void 0) {
        const charCode = transferedText.charCodeAt(j);
        if (charCode < 128) {
            decodedText += String.fromCharCode(charCode);
            j++;
        } else if (charCode > 191 && charCode < 224) {
            const charCode2 = transferedText.charCodeAt(j + 1);
            decodedText += String.fromCharCode((31 & charCode) << 6 | 63 & charCode2);
            j += 2;
        } else {
            const charCode3 = transferedText.charCodeAt(j + 1);
            const charCode4 = transferedText.charCodeAt(j + 2);
            decodedText += String.fromCharCode((15 & charCode) << 12 | (63 & charCode3) << 6 | 63 & charCode4);
            j += 3;
        }
    }
    return decodedText;
};
const lyrics = {};
class XHR extends unsafeWindow.XMLHttpRequest {
    constructor(...args) {
        super(...args);
        this.addEventListener("readystatechange", () => {
            if (this.readyState === 4 && this.responseURL.startsWith("https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg")) {
                try {
                    const json = JSON.parse(this.responseText);
                    const songmid = new URL(this.responseURL).searchParams.get("songmid");
                    if (typeof songmid === "string" && songmid.length > 4 && json.code === 0 && json.type !== 3) {
                        const originalLyric = decodeQMStupidEncodedText(json.lyric);
                        const translatedLyric = decodeQMStupidEncodedText(json.trans);
                        const playSongData = JSON.parse(localStorage.getItem("playSongData"));
                        const title = playSongData.value.songList.filter(({ mid }) => mid === songmid)[0].title;
                        lyrics[title] = { originalLyric, translatedLyric };
                    }
                } catch (e) {
                    console.error("[Lyric Fetcher From QQMusic Web Player] Error:", e);
                }
            }
        });
    }
}
unsafeWindow.XMLHttpRequest = XHR;
window.addEventListener("load", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.setAttribute("style", "position:fixed;top:20%;bottom:20%;left:30%;right:30%;z-index:999999999;background:white;opacity:0;pointer-event:none;");
    const button = document.createElement("div");
    document.body.appendChild(button);
    button.setAttribute("style", "position:fixed;bottom:1em;right:1em;z-index:999999999;background:white;padding: .25rem; border-radius: .25rem;cursor:pointer;");
    button.innerText = "获取歌词lrc";
    let opening = false;
    button.addEventListener("click", () => {
        if (opening) {
            opening = false;
            container.style.opacity = "0";
            container.style.pointerEvents = "none";
            button.innerText = "获取歌词lrc";
            return;
        }
        opening = true;
        container.style.opacity = "1";
        container.style.pointerEvents = "all";
        button.innerText = "关闭歌词lrc窗口";
        container.innerHTML = '<h2 style="text-align: center;">获取歌词lrc</h2>';
        const ul = document.createElement("ul");
        ul.style.margin = "revert";
        ul.style.padding = "revert";
        container.appendChild(ul);
        for (const [name, { originalLyric, translatedLyric }] of Object.entries(lyrics)) {
            const li = document.createElement("li");
            ul.appendChild(li);
            li.style.listStyle = "revert";
            li.style.margin = "revert";
            li.style.padding = "revert";
            const span = document.createElement("span");
            li.appendChild(span);
            span.innerText = name;
            if (originalLyric) {
                const br = document.createElement("br");
                li.appendChild(br);
                const span = document.createElement("span");
                li.appendChild(span);
                span.innerText = "原文歌词：";
                const button = document.createElement("button");
                button.innerText = "复制到剪切板";
                button.addEventListener("click", () => {
                    GM_setClipboard(originalLyric);
                });
                li.appendChild(button);
                const br2 = document.createElement("br");
                li.appendChild(br2);
                const span2 = document.createElement("span");
                span2.innerText = `预览：${originalLyric.length > 100 ? `${originalLyric.slice(0, 100)}……` : originalLyric}`;
                li.appendChild(span2);
            }
            if (translatedLyric) {
                const br = document.createElement("br");
                li.appendChild(br);
                const span = document.createElement("span");
                li.appendChild(span);
                span.innerText = "翻译歌词：";
                const button = document.createElement("button");
                button.innerText = "复制到剪切板";
                button.addEventListener("click", () => {
                    GM_setClipboard(translatedLyric);
                });
                li.appendChild(button);
                const br2 = document.createElement("br");
                li.appendChild(br2);
                const span2 = document.createElement("span");
                span2.innerText = `预览：${translatedLyric.length > 100 ? `${translatedLyric.slice(0, 100)}……` : translatedLyric}`;
                li.appendChild(span2);
            }
        }
    });
});