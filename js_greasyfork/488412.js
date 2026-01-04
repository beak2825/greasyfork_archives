// ==UserScript==
// @name         Download Audio Button for Biligame Wiki with Custom Filename
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download audio files with custom filenames based on nearby text content on Biligame Wiki pages
// @author       XTer
// @match        *://wiki.biligame.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488412/Download%20Audio%20Button%20for%20Biligame%20Wiki%20with%20Custom%20Filename.user.js
// @updateURL https://update.greasyfork.org/scripts/488412/Download%20Audio%20Button%20for%20Biligame%20Wiki%20with%20Custom%20Filename.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadAudio(url, customName) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function(response) {
                GM_download({
                    url: URL.createObjectURL(response.response),
                    name: customName ? `${customName}.mp3` : url.split('/').pop(),
                    saveAs: true
                });
            },
            onerror: function(error) {
                console.error('Download failed:', error);
            }
        });
    }
    function cleanFileName(fileName) {
        // 去除各种括号及其内容
        fileName = fileName.replace(/[\(\（]/g, '') // 移除小括号开
            .replace(/[\)\）]/g, '') // 移除小括号闭
            .replace(/[\[\【]/g, '') // 移除中括号开
            .replace(/[\]\】]/g, '') // 移除中括号闭
            .replace(/[\{｛]/g, '') // 移除大括号开
            .replace(/[\}｝]/g, '') // 移除大括号闭
            .replace(/[《〈]/g, '') // 移除书名号开
            .replace(/[》〉]/g, '') // 移除书名号闭
            .replace(/[「]/g, '') // 移除「开
            .replace(/[」]/g, ''); // 移除」闭

        // 替换Windows系统不允许的文件名字符
        var invalidChars = /[\\/:*?"<>|]/g; // Windows系统不允许在文件名中使用的字符
        var replacementMap = {
            "\\": "＼",
            "/": "／",
            ":": "：",
            "*": "＊",
            "?": "？",
            "\"": "＂",
            "<": "＜",
            ">": "＞",
            "|": "｜"
        };
        fileName = fileName.replace(invalidChars, function(match) {
            return replacementMap[match] || " "; // 替换为全角版本或空格
        });

        return fileName.trim(); // 去除前后空格
    }

    function addDownloadButton(audioElement) {
        var button = document.createElement("button");
        button.textContent = "Download";
        button.style.marginLeft = "10px";

        button.onclick = function() {
            // Find the nearest element with class="voice_text_chs" for a custom filename
            var customNameElement = audioElement.closest('.visible-md').querySelector('.voice_text_chs');
            var customName = customNameElement ? cleanFileName(customNameElement.textContent) : null;
            downloadAudio(audioElement.src, customName);
        };

        audioElement.parentNode.insertBefore(button, audioElement.nextSibling);
    }

    setTimeout(function() {
        var audioElements = document.querySelectorAll('audio');
        audioElements.forEach(function(audio) {
            addDownloadButton(audio);
        });
    }, 4000);
})();
