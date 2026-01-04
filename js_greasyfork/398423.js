// ==UserScript==
// @name         TOC of Jianshu
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  为简书文章生成目录
// @author       RobinTsai
// @match        https://www.jianshu.com/p/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/398423/TOC%20of%20Jianshu.user.js
// @updateURL https://update.greasyfork.org/scripts/398423/TOC%20of%20Jianshu.meta.js
// ==/UserScript==

// jquery API: http://jquery.cuishifeng.cn/
(function() {
    'use strict';

    $('#adinteract').hide() // 去除广告
    $('#adModule').hide()   // 去除广告

    setTimeout(function () {
        $('div[style="width: 200px; height: 400px; position: fixed; top:35%; margin-top:-200px; z-index: 2147483647; right:0px;"]').hide()
        $("div#note").hide()
        $('div[style="width: 200px; height: 400px; position: fixed; top: 35%; margin-top:-200px; z-index: 2147483647; left:0px;"]').hide()
        $('div[style="display: block; padding: 0px; margin: 0px; z-index:2147483648; position: fixed; right: 0px; bottom: auto; left: auto; bottom: 0px; width: 320px; height: 270px;"]').hide()
    }, 800);

    var idx = 0
    var hNames = []
    var content = $("body,.__next,._21bLU4._3kbg6I._gp-ck,section")
    var headings = content.find("h1,h2,h3,h4,h5")
    // 获取 headings 并设置 id
    var minLevel = 5 // 收集最小的层级 h1 => 1, h2 => 2
    var levels = []
    for (idx in headings) {
        if (isNaN(Number(idx))) {
            continue
        }
        var heading = headings[idx]
        if (heading.classList.length > 0) {
            continue
        }
        heading.id = heading.innerText

        var level = parseInt(heading.tagName.replace("H", ""))
        if (levels.indexOf(level) == -1) {
            levels.push(level)
        }

        if (level < minLevel) {
            minLevel = level
        }
        hNames.push({
            tagLevel: level,
            name: heading.innerText,
        })
    }

    var mapLevelToMarginLeft = {}
    levels.sort()
    for (idx in levels) {
        mapLevelToMarginLeft[levels[idx]] = 20 * idx + "px"
    }
    var innerH = []

    for (idx in hNames) {
        var elem = $("<a>", {
            style: "white-space: nowrap; margin-left: " + mapLevelToMarginLeft[hNames[idx].tagLevel],
            innerText: hNames[idx].name,
            text: hNames[idx].name,
            href: "#"+hNames[idx].name,
        })
        innerH.push( elem )
    }

    var headingWrap = $("<div>", {
        id: "TOCofJianShu",
        style: "\
            position: fixed; \
            z-index: 1000; \
            top: 100px; \
            max-height: 400px; \
            width: 174px; \
            overflow: auto; \
            border: solid 1px #826b6b; \
            padding: 5px; \
            padding-left: 12px; \
            background-color: #dedede; \
        ".replace(/ /g, ""),
        mouseover: function() {
        },
        mouseout: function() {
        },
    })
    // hNames.push(content.find("h1._1RuRku").text())

    for (idx in innerH) {
        innerH[idx].appendTo(headingWrap)
        $("<br>").appendTo(headingWrap)
    }
    headingWrap.appendTo("body");
})();