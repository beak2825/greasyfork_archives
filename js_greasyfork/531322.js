// ==UserScript==
// @name         搜狗scel词库转txt
// @namespace    https://github.com/journey-ad
// @version      0.1
// @description  搜狗scel词库转txt并下载
// @author       journey-ad
// @license      MIT
// @match        *://pinyin.sogou.com/dict/*
// @icon         https://www.google.com/s2/favicons?domain=pinyin.sogou.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531322/%E6%90%9C%E7%8B%97scel%E8%AF%8D%E5%BA%93%E8%BD%ACtxt.user.js
// @updateURL https://update.greasyfork.org/scripts/531322/%E6%90%9C%E7%8B%97scel%E8%AF%8D%E5%BA%93%E8%BD%ACtxt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function readUtf16Str(buffer, offset, length) {
        let dataView = new DataView(buffer, offset, length);
        let result = '';
        for (let i = 0; i < length; i += 2) {
            let code = dataView.getUint16(i, true);
            if (code === 0) break;
            result += String.fromCharCode(code);
        }
        return result;
    }

    function readUint16(buffer, offset) {
        return new DataView(buffer, offset, 2).getUint16(0, true);
    }

    function getHzOffset(buffer) {
        let mask = new DataView(buffer, 4, 1).getUint8(0);
        return mask === 0x44 ? 0x2628 : mask === 0x45 ? 0x26c4 : -1;
    }

    function getPyMap(buffer) {
        let pyMap = {}, offset = 0x1540 + 4;
        while (offset + 4 <= buffer.byteLength) {
            let pyIdx = readUint16(buffer, offset);
            let pyLen = readUint16(buffer, offset + 2);
            let pyStr = readUtf16Str(buffer, offset + 4, pyLen);
            pyMap[pyIdx] = pyStr;
            offset += 4 + pyLen;
            if (pyStr === "zuo") break;
        }
        return pyMap;
    }

    function getRecords(buffer, hzOffset, pyMap) {
        let records = [], offset = hzOffset;
        while (offset + 4 <= buffer.byteLength) {
            let wordCount = readUint16(buffer, offset);
            let pyIdxCount = readUint16(buffer, offset + 2) / 2;
            offset += 4;
            let pySet = [];
            for (let i = 0; i < pyIdxCount; i++) {
                let pyIdx = readUint16(buffer, offset);
                pySet.push(pyMap[pyIdx] || '');
                offset += 2;
            }
            for (let i = 0; i < wordCount; i++) {
                let wordLen = readUint16(buffer, offset);
                let wordStr = readUtf16Str(buffer, offset + 2, wordLen);
                offset += 2 + wordLen + 12;
                records.push(wordStr);
            }
        }
        return records;
    }

    function convertScelToTxt(buffer, filename) {
        let hzOffset = getHzOffset(buffer);
        if (hzOffset < 0) return;
        let pyMap = getPyMap(buffer);
        let records = getRecords(buffer, hzOffset, pyMap);
        let output = records.join("\n");
        let blob = new Blob([output], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename.replace(".scel", ".txt");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function fetchAndConvertScel(url) {
        let urlParams = new URLSearchParams(new URL(url).search);
        let filename = urlParams.get('name') || "dict.scel";

        fetch(url).then(res => res.arrayBuffer()).then(buffer => {
            convertScelToTxt(buffer, filename);
        }).catch(err => console.error("下载失败", err));
    }

    function addDownloadButton(aTag) {
        let downloadBtn = document.createElement("a");
        downloadBtn.innerText = "下载txt";
        downloadBtn.href = "javascript:;";
        downloadBtn.style = "position:relative;z-index:99;background:none;height:auto;font-size:14px;color:hotpink;display:inline-flex;justify-content:center;";
        downloadBtn.onclick = function(event) {
            event.preventDefault();
            fetchAndConvertScel(aTag.href);
        };
        aTag.parentNode.appendChild(downloadBtn, aTag.prevSibling);
    }

    function processLinks() {
        document.querySelectorAll("a[href^='https://pinyin.sogou.com/d/dict/download_cell.php'],a[href^='//pinyin.sogou.com/d/dict/download_cell.php']").forEach(addDownloadButton);
    }

    processLinks();
})();
