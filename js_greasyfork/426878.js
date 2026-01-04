// ==UserScript==
// @name         b站历史记录-仅显示番剧
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  b站历史记录添加番剧筛选功能
// @author       Potato-DiGua
// @supportURL   https://github.com/Potato-DiGua/scripts/blob/main/bilibili_bangumi_history/README.md
// @match        https://www.bilibili.com/account/history
// @icon         http://static.hdslb.com/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426878/b%E7%AB%99%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95-%E4%BB%85%E6%98%BE%E7%A4%BA%E7%95%AA%E5%89%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/426878/b%E7%AB%99%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95-%E4%BB%85%E6%98%BE%E7%A4%BA%E7%95%AA%E5%89%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;

    function debounce(fn, delay = 300) {
        let ctx, args, timer = null;
        function later() {
            fn.apply(ctx, args);
        }
        return function () {
            ctx = this;
            args = arguments;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(later, delay);
        }
    }

    function isBangumiHistory(liNode) {
        if (liNode == null) {
            return false;
        }
        const p = liNode.find("div.r-info.clearfix > div.cover-contain > p").first();
        return p != null && p.text() == "番剧";
    }

    function setDisplay(display) {
        $("#history_list > li").filter(function (_, element) {
            return !isBangumiHistory($(element))
        }).css("display", display ? "none" : "block");
    }

    function init() {
        const input = $("<input/>", { type: "checkbox", style: "display:inline-block; vertical-align:middle; " })
        input.change(function () {
            setDisplay(this.checked);
        });
        $("#app > div > div.newlist_info > div > div.b-head-c").after($("<div/>", {
            style: "display:inline-block; margin-left:16px;padding:6px 0; vertical-align:middle; font-size: 12px;"
        }).append($("<p/>").append(input, "仅显示番剧")));

        const inputEle = input[0];

        const resizeOb = new ResizeObserver(debounce(_ => {
            console.log("大小发生变化");
            setDisplay(inputEle.checked);
        }));
        resizeOb.observe($("#history_list")[0])
    }

    init();
})();

