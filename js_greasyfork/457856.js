// ==UserScript==
// @name         福利吧页面精简优化
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  fuliba页面优化内测
// @author       silvio27
// @match        https://fuliba2023.net/*
// @match        https://fuliba2023.net
// @match        *://f.uliba.net/*
// @match        *://fuliba66.net/*
// @match        *://fuliba23.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fuliba2023.net
// @license      GPLv3
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/457856/%E7%A6%8F%E5%88%A9%E5%90%A7%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457856/%E7%A6%8F%E5%88%A9%E5%90%A7%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 查看是否有蓝奏云链接
    downloadLZY()

    function downloadLZY(auto = false) {
        try {
            let lanzouUrl = /http\S+/g
            let url = $("body")[0].innerText.match(lanzouUrl)[0]
            let backlog
            if (url) {
                GM_setClipboard("FULI", "text")
                const menu_command_id = GM_registerMenuCommand("下载蓝奏云图包", function () {
                    backlog = openUrl(url)
                }, "a");
                if (auto) {
                    backlog = openUrl(url)
                }
            }

            setTimeout(() => {
                console.log(backlog)
            }, 11 * 1000)

        } catch (e) {
            console.log("网页无链接")
        }


        // 蓝奏云自动下载
        function openUrl(url) {
            let newtab = GM_openInTab(url, {
                active: true,
                insert: true,
            })
            return newtab
        }
    }

    // TODO 百家姓转换
    const obja = {
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
        for (let i in obja) {
            cnPattern += i
        }
        return new RegExp(`[${cnPattern}]{10,}`, "gm")
    }

    let cnPattern = dict2pattern(obja)

    let ps = document.querySelectorAll('p')
    ps.forEach(e => {
        let str = e.innerText
        if (str.match(cnPattern)) {
            let res = [...str.matchAll(cnPattern)]
            res.forEach(r => {
                // console.log(r[0])
                if (r[0].length === 40) {
                    e.style.color = "red"
                    e.innerText = e.innerText.replace(r[0], bjx2mag(r[0]))
                } else {
                    e.style.color = "yellowgreen"
                    e.innerText = e.innerText.replace(r[0], bjx2mag(r[0]))
                }
            })

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

    // 优化图片页
    if (document.URL.endsWith("l/2") || document.URL.endsWith("l/3")) {
        let target_part = document.querySelectorAll("section.container")[0]

        target_part.style.margin = 0
        target_part.style.maxWidth = window.innerWidth + 'px'
        target_part.style.minHeight = '300px'
        // target_part.style.border = "1px solid black"
        target_part.style.display = "flex"
        target_part.style.flexWrap = "wrap"
        let gapWidth = 10
        target_part.style.gap = gapWidth + "px"
        let n = 7
        let imgWidth = Math.ceil((window.innerWidth - (n + 1) * 2 * gapWidth) / n)
        let imgs = document.querySelectorAll(".article-content>p>img")
        while (target_part.firstChild) {
            target_part.removeChild(target_part.firstChild);
        }

        imgs.forEach(p => {
            target_part.appendChild(p)
            console.log(p.style.width * p.style.height)
            p.style.width = imgWidth + "px"

        })
    }







    // remove 屏蔽广告关键词
    console.log('REMOVE')

    let banned_list = ["流量卡","福吧定制","购物网赚"]

    let articles = document.querySelectorAll("article")
    articles.forEach(e => {
        banned_list.forEach(bl_item=>{
            if (e.innerText.includes(bl_item)) {
                e.style.display = "none"
            }
        })

    })



    // remove Ads


    let removelist = `
    .orbui,
    .orbui-post-footer,
    .header,
    .site-search,
    .breadcrumbs,
    .more,
    .site-nav,
    .topmenu,
    .karbar-rb,
    .sidebar,
    .shares,
    .post-actions,
    .post-copyright,
    .relates,
    .article-nav,
    .branding,
    .footer {
        display: none;
    }
    `
    GM_addStyle(removelist)


})();