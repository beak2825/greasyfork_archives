// ==UserScript==
// @name         福利吧百家姓转换
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动替换百家姓内容并高亮显示(由于原作者silvio27停止更新，所以有了此脚本)
// @author       silviode
// @match        https://fuliba2023.net/*
// @match        https://fuliba2024.net/*
// @match        https://fuliba2025.net/*
// @match        https://fuliba2026.net/*
// @match        https://fuliba2027.net/*
// @match        *://f.uliba.net/*
// @match        *://fuliba66.net/*
// @match        *://fuliba23.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fuliba2023.net
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532256/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/532256/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const obja = {
        "赵": "0", "钱": "1", "孙": "2", "李": "3", "周": "4", "吴": "5", "郑": "6", "王": "7", "冯": "8", "陈": "9",
		"褚": "a", "卫": "b", "蒋": "c", "沈": "d", "韩": "e", "杨": "f", "朱": "g", "秦": "h", "尤": "i", "许": "j",
		"何": "k", "吕": "l", "施": "m", "张": "n", "孔": "o", "曹": "p", "严": "q", "华": "r", "金": "s", "魏": "t",
		"陶": "u", "姜": "v", "戚": "w", "谢": "x", "邹": "y", "喻": "z", "福": "A", "水": "B", "窦": "C", "章": "D",
		"云": "E", "苏": "F", "潘": "G", "葛": "H", "奚": "I", "范": "J", "彭": "K", "郎": "L", "鲁": "M", "韦": "N",
		"昌": "O", "马": "P", "苗": "Q", "凤": "R", "花": "S", "方": "T", "俞": "U", "任": "V", "袁": "W", "柳": "X",
		"唐": "Y", "罗": "Z", "薛": ".", "伍": "-", "余": "_", "米": "+", "贝": "=", "姚": "/", "孟": "?", "顾": "#",
		"尹": "%", "江": "&", "钟": "*", "竺": ":", "赖": "|"
    };

    function dict2pattern(dict) {
        var cnPattern = ''
        for (let i in dict) {
            cnPattern += i
        }
        return new RegExp(`[${cnPattern}]{10,}`, "gm")
    }

    let cnPattern = dict2pattern(obja)
    let youtubePattern = /watch\?v=/;

    let ps = document.querySelectorAll('p')
    ps.forEach(e => {
        let str = e.innerText
        if (str.match(cnPattern)) {
            let res = [...str.matchAll(cnPattern)]
            res.forEach(r => {
                // console.log(r[0])
                if (r[0].length === 40) {
                    e.style.color = "red"
                    e.innerText = e.innerText.replace(r[0],bjx2mag(r[0]))
                } else {
                    e.style.color = "yellowgreen"
                    e.innerText = e.innerText.replace(r[0],bjx2mag(r[0]))
                }
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
    
    let h4s = document.querySelectorAll('h4')
    h4s.forEach(e => {
        let str = e.innerText
        console.log(str);
        if(str.indexOf('油管/channel') >= 0) {
            // 在当前element下插入一个a标签
            e.innerText = '油管：'
            const aTag = document.createElement('a');
            aTag.href = str.replace('油管/channel','https://youtube.com/channel');
            aTag.innerText = aTag.href;
            e.appendChild(aTag);
        }
    })
    
    function isColorWhite(element) {
        const color = window.getComputedStyle(element).color.replace(/ /g, '');
        return color === 'rgb(255,255,255)' || color === 'rgba(255,255,255,1)';
    }
    let atags = document.querySelectorAll('a')
    atags.forEach(e => {
        if(e.style.color){
            if(isColorWhite(e)) {
                e.style.color = "red";
                e.innerText = "好孩子看不见： " + e.innerText
            }
        }
    })

    function bjx2mag(bjx) {
        let str = bjx.replace(/^\s\s*/, '').replace(/\s\s*$/, '').split("");
        let c = ""
        if (str.length === 40) {
            c = "magnet:?xt=urn:btih:"
            for (let i of str) {
                c += obja[i]
            }
        } else {
            for (let i of str) {
                c += obja[i]
            }
        }

        return c
    }

})();