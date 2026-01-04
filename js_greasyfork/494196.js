// ==UserScript==
// @name         福利吧论坛百家姓磁力链接自动转换
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动替换论坛百家姓地址
// @author       You
// @match        https://www.wnflb2023.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fuliba2023.net
// @grant        none
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494196/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E7%99%BE%E5%AE%B6%E5%A7%93%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/494196/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E7%99%BE%E5%AE%B6%E5%A7%93%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const conversionDict = {
        "赵": "0", "钱": "1", "孙": "2", "李": "3", "周": "4", "吴": "5",
        "郑": "6", "王": "7", "冯": "8", "陈": "9", "褚": "a", "卫": "b",
        "蒋": "c", "沈": "d", "韩": "e", "杨": "f", "朱": "g", "秦": "h",
        "尤": "i", "许": "j", "何": "k", "吕": "l", "施": "m", "张": "n",
        "孔": "o", "曹": "p", "严": "q", "华": "r", "金": "s", "魏": "t",
        "陶": "u", "姜": "v", "戚": "w", "谢": "x", "邹": "y", "喻": "z",
        "福": "A", "水": "B", "窦": "C", "章": "D", "云": "E", "苏": "F",
        "潘": "G", "葛": "H", "奚": "I", "范": "J", "彭": "K", "郎": "L",
        "鲁": "M", "韦": "N", "昌": "O", "马": "P", "苗": "Q", "凤": "R",
        "花": "S", "方": "T", "俞": "U", "任": "V", "袁": "W", "柳": "X",
        "唐": "Y", "罗": "Z", "薛": ".", "伍": "-", "余": "_", "米": "+",
        "贝": "=", "姚": "/", "孟": "?", "顾": "#", "尹": "%", "江": "&",
        "钟": "*"
    };

    function dict2pattern(dict) {
        var cnPattern = ''
        for (let i in conversionDict ) {
            cnPattern += i
        }
        return new RegExp(`[${cnPattern}]{10,}`, "gm")
    }

    let cnPattern = dict2pattern(conversionDict)
    let youtubePattern = /watch\?v=/;

    let ps = document.querySelectorAll('td')
    ps.forEach(e => {
        let str = e.innerText
        if (str.match(cnPattern)) {
            let res = [...str.matchAll(cnPattern)]
            res.forEach(r => {
                const mag = `<div style="color: red;">${bjx2mag(r[0])}</div>`
                e.innerHTML = e.innerHTML.replace(r[0], mag)
            })

        }
        if (youtubePattern.test(str)) {
            const videoId = str.split('?v=')[1];
            const aTag = document.createElement('a');
            aTag.href = `https://www.youtube.com/watch?v=${videoId}`;
            aTag.innerText = "油管链接";
            e.appendChild(aTag);
        }

    })

    function bjx2mag(bjx) {
        let str = bjx.replace(/^\s\s*/, '').replace(/\s\s*$/, '').split("");
        let c = ""
        for (let i of str) {
            c += conversionDict[i]
        }
        if(!c.startsWith('magnet:?xt=urn:btih:')) {
            c= `magnet:?xt=urn:btih:${c}`
        }
        return c;
    }

})();