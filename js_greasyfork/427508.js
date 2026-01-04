// ==UserScript==
// @name         郑州房奴助手.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  郑州住房保障局公示信息统计 预售楼盘价格的统计（统计均价、最高、最低价 同一户型的均价、最高、最低价）
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      *://http://218.28.223.8/*
// @downloadURL https://update.greasyfork.org/scripts/427508/%E9%83%91%E5%B7%9E%E6%88%BF%E5%A5%B4%E5%8A%A9%E6%89%8Bjs.user.js
// @updateURL https://update.greasyfork.org/scripts/427508/%E9%83%91%E5%B7%9E%E6%88%BF%E5%A5%B4%E5%8A%A9%E6%89%8Bjs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // map分组函数
    function groupBy(array, f) {
        let groups = {};
        array.forEach(function(o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function(group) {
            return groups[group];
        });
    }

    // 郑州住房保障局
    function zzzfbzjHandler() {
        this.addHtmlElements = function() {
            // var div = document.createElement("div");
            // div.innerHTML = "<button id='button_0023' style='position:absolute;right:100;top:10' '>房奴助手</button>"
            // document.getElementsByClassName("inner1")[1].appendChild(div);

            var parentNode = document.getElementsByClassName('main-wrap clearfix')[2];
            var beforeNode = document.getElementsByClassName("inner1")[1];
            var targetNode = document.createElement("div")
            targetNode.className = "inner1";
            targetNode.style = "width: 100%;"
            targetNode.innerHTML = "<h4>房奴助手</h4><span>请先选择楼栋、单元 再</span><button id='button_0023' style='margin-left:10'>点击计算</button><button id='button_0024' style='margin-left:10'>清除</button><div id='result_0023'></div>";
            parentNode.insertBefore(targetNode, beforeNode);
        }

        this.bindEvent = function() {
            $("#button_0023").on("click", function() {
                var elements = document.getElementsByClassName("yisou")
                let datas = [];
                Array.from(elements).forEach(function(element, index) {
                    var number = element.innerText.match(/编号：(\S*)/)[1];
                    var price = element.innerText.match(/预售申报价：(\S*)元\/㎡/)[1];
                    let map = new Map();
                    map.set("number", Number(number));
                    map.set("price", Number(price));
                    map.set("floor", Math.floor(Number(number) / 100));
                    map.set("room", Number(number) % 10);
                    datas.push(map);
                });
                let rooms = groupBy(datas, function(item) { return item.get("room") });
                let floors = groupBy(datas, function(item) { return item.get("floor") });

                // 房间统计
                var resultHTML = "共" + floors.length + "层 一层" + rooms.length + "户 总计" + datas.length + "个房间";

                // 计算均价
                let average = datas.map(function(item) { return item.get("price") }).reduce(function(total, current) { return total + current }, 0) / datas.length;
                resultHTML = resultHTML + " " + "平均价格:" + average.toFixed(2) + "/㎡";

                // 找到最贵的 最便宜的
                let maxPriceRoom = datas.sort(function(item1, item2) { return item1.get("price") - item2.get("price") })[datas.length - 1];
                resultHTML = resultHTML + " " + "最贵的是:" + maxPriceRoom.get("number") + " 价格:" + maxPriceRoom.get("price") + "/㎡";

                let minPriceRoom = datas.sort(function(item1, item2) { return item2.get("price") - item1.get("price") })[datas.length - 1];
                resultHTML = resultHTML + " " + "最便宜的是:" + minPriceRoom.get("number") + " 价格:" + minPriceRoom.get("price") + "/㎡";

                // 找到同户型最贵的 最便宜的
                rooms.forEach(function(items) {
                    // 同户型的均价
                    let average = items.map(function(item) { return item.get("price") }).reduce(function(total, current) { return total + current }, 0) / items.length;
                    resultHTML = resultHTML + "<br>" + items[0].get("room") + "号房间平均价格：" + average.toFixed(2) + "/㎡";
                    // 同户型最贵 最便宜
                    let maxPriceRoom = items.sort(function(item1, item2) { return item1.get("price") - item2.get("price") })[items.length - 1];
                    resultHTML = resultHTML + " 最贵的是:" + maxPriceRoom.get("number") + " 价格:" + maxPriceRoom.get("price") + "/㎡";
                    let minPriceRoom = items.sort(function(item1, item2) { return item2.get("price") - item1.get("price") })[items.length - 1];
                    resultHTML = resultHTML + " 最便宜的是:" + minPriceRoom.get("number") + " 价格:" + minPriceRoom.get("price") + "/㎡";
                })

                var resultNode = document.getElementById("result_0023");
                resultNode.innerHTML = resultHTML;
                console.log(resultHTML);
            });
            $("#button_0024").on("click", function() {
                var resultNode = document.getElementById("result_0023");
                resultNode.innerHTML = "";
            });
            console.log("绑定事件ok")
        }

        this.start = function() {
            var pathName = window.document.location.pathname;
            if (pathName.indexOf("/gov/search.html") >= 0) {
                this.addHtmlElements();
                this.bindEvent();
            }
        }
    }

    // 入口函数
    var domain = document.domain;
    console.log("document.domain:", document.domain);
    switch (domain) {
        case "218.28.223.8":
            new zzzfbzjHandler().start();
            break;
        default:
            console.log("不是目标网站");
    }

})();