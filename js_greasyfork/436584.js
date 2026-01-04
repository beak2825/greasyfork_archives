// ==UserScript==
// @name         biliplus弹幕文件批量下载
// @namespace    https://github.com/dyxcloud
// @version      0.03
// @description  批量从biliplus下载某一个av号下所有分P的弹幕xml文件, 不用再一个一个点了, xml文件名是分P的名称
// @author       dyxlike
// @match        https://www.biliplus.com/video/*
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436584/biliplus%E5%BC%B9%E5%B9%95%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/436584/biliplus%E5%BC%B9%E5%B9%95%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getNameMap() {
        let nameMap = new Map();
        let partDivs = document.querySelectorAll("div.part_title");
        for (let part of partDivs) {
            let idStr = part.id.substring(4);
            nameMap.set(idStr, part.innerText);
        }
        return nameMap;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function downloadAll() {
        let nameMap = getNameMap();
        let count = 10;
        for (let [key, value] of nameMap.entries()) {
            let url = `https://comment.bilibili.com/${key}.xml`;
            let fileName = value.replace(/[/\\?%*:|"<>]/g, '-');
            console.log(fileName+"      "+url);
            GM_download({
                url: url,
                name: fileName+".xml",
                onerror: function (e) {
                    console.log(e);
                }
            });
            count--;
            if (count === 0) {
                await sleep(5000);
                count = 10;
            }
        }
    }

    async function copyCidMap() {
        let nameMap = getNameMap();
        let result = '';
        for (let [key, value] of nameMap.entries()) {
            let url = `https://comment.bilibili.com/${key}.xml`;
            let fileName = value.replace(/[/\\?%*:|"<>]/g, '-');
            result += (key + ' ' + fileName)
            result += '\r\n';
        }
        GM_setClipboard(result);
    }

    let topMenu = document.querySelector('.sidebar');
    //生成下载按钮
    let newA = document.createElement('a');
    newA.innerText = "下载全部弹幕文件";
    newA.onclick = function () {
        downloadAll();
        return false;
    };
    topMenu.appendChild(newA);
    topMenu.appendChild(document.createElement('br'));
    //生成复制按钮
    let newB = document.createElement('a');
    newB.innerText = "复制分P的CID";
    newB.onclick = function () {
        copyCidMap();
        return false;
    };
    topMenu.appendChild(newB);


})();
