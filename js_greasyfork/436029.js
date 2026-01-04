// ==UserScript==
// @name         gitlab issue TOC
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为 gitlab issue 生成目录（需要自己改下 domain）
// @author       RobinTsai
// @match        https://gitlab.com/*/issues/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/436029/gitlab%20issue%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/436029/gitlab%20issue%20TOC.meta.js
// ==/UserScript==

// jquery API: http://jquery.cuishifeng.cn/
(function() {
    'use strict';

    var tocID = "TOC"
    var moveTOC = function() { // 调整 TOC 位置
        var pos = $("a.toggle-sidebar-button").css("width");
        $("#"+tocID).animate({"left": pos}, "slow");
    }

    $(document).ready(function(){ // dom 加载完成后将 TOC 放到合适的位置
        moveTOC();
    });

    $("a.toggle-sidebar-button").on("click", function() { // 监听左侧栏事件，调整 TOC 位置
        setTimeout(moveTOC, 255)
    });

    var idx = 0
    var hNames = []
    var content = $("body,.detail-page-description")
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
        id: tocID,
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
            left: 220px; \
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