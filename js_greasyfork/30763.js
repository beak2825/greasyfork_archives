// ==UserScript==
// @name         arbitrage-helper
// @version      0.0.2
// @description  简化并优化 sosobtc.com 的显示效果以提供(搬砖)套利比价参考. 要求买一价和卖一价必须在4, 5两列. 目前只对自选产品有效.
// @match        *://www.sosobtc.com/
// @run-at       document-end
// @grant        GM_addStyle
// @icon         https://www.sosobtc.com/favicon.ico
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @namespace    userscripts.henryfour.com
// @homepageURL  https://github.com/henryfour/userscripts
// @supportURL   https://github.com/henryfour/userscripts/issues
// @author       HenryFour
// @copyright    2017, HenryFour
// @downloadURL https://update.greasyfork.org/scripts/30763/arbitrage-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30763/arbitrage-helper.meta.js
// ==/UserScript==

// GM_addStyle("body { background-color: black; }");
// 买一价, 卖一价, 涨幅等突出显示
GM_addStyle(
    //"#market_tabs .tab-content { background-color: #E6E6FA;font-weight:bold; }" +
    // 设置币种和交易平台(交易商)名字颜色
    "#market_tabs .tab-content table tr td.market_name span { color:blue; }" +
    "#market_tabs .tab-content table tr td.market_name span.name { color:black; }" +
    // 设置 买入, 卖出, 涨幅的背景色, 注意位置是固定死的
    "#market_tabs .tab-content table td:nth-child(4) { background-color: #009688;font-weight:bold; }" +
    "#market_tabs .tab-content table td:nth-child(5) { background-color: #CC6600;font-weight:bold; }" +
    "#market_tabs .tab-content table td:nth-child(6) { background-color: #B0E0E6;font-weight:bold; }" +
    // 设置行 hover 的背景色
    "#market_tabs .tab-content table tr:hover { background-color:grey; }" +
    ""
);

(function() {
    'use strict';
    var $markets = $("#market_tabs");
    // console.log($markets.nextAll());
    // 隐藏行情下面内容(各个币种市值)
    $markets.nextAll().hide();
    // 删除右边的导航和挖矿数据等内容
    $markets.parent().nextAll().hide();
    // 隐藏 footer
    $("footer").hide();
    // 隐藏导航下面的内容
    $(".header-container").parent().nextAll().hide();
    // 隐藏 logo 和标语
    $("._3GrMQ7i3tFoJgOqEacuMyt").hide();
    $("._9mJU0WMvJKiO0r8w5UoBV").hide();
    // 添加价格显示区域
    $("._3QGExTshWJ53K_WZIr05vm").append("<div><p class=price1 style='color:black;font-weight:bold;line-height:20px;margin:10px 0 0 0'></p><p class=price2 style='color:black;font-weight:bold;line-height:20px;margin:5px 0 0 0'></p></div>");
    var $price1 = $("._3QGExTshWJ53K_WZIr05vm").find("div .price1");
    var $price2 = $("._3QGExTshWJ53K_WZIr05vm").find("div .price2");
    $price1.text("提示信息区1: ....");
    $price2.text("提示信息区2: ....");

    // 背景色设置
    var colorBuy="#009688", colorSell="#CC6600", colorFocus="red", rowFocus="lightyellow";
    var compareTwoPrice = function($x1, $x2) {
        // 计算价格的比率
        var pBuy = $x1.cell.find(".main").text(), pSell = $x2.cell.find(".main").text();
        var rate = (((pSell-pBuy)/pBuy) * 100).toFixed(2);
        // 获取币种信息
        var name = $x1.cell.parent().find(".market_name .name").parent().text();
        name = name.substring(0, name.indexOf("("));
        return name + ": " + pBuy + " -> " + pSell + "   获利比   " + rate + "%";
    };
    // 点击买卖价格时显示颜色并计算差价
    var priceQ = [];
    // 刷新选择的价格比率
    var refreshPricePairs = function() {
        var len = priceQ.length;
        var text;
        if (len == 4) {
            text = compareTwoPrice(priceQ[0], priceQ[1]);
            console.log(text);
            $price1.text(text);
        }
        if (len >= 2) {
            text = compareTwoPrice(priceQ[len-2], priceQ[len-1]);
            console.log(text);
            $price2.text(text);
        }
    };
    setInterval(refreshPricePairs, 400);
    var onClickPrice = function(bs, $x) {
        priceQ.push({
            bs: bs,
            cell: $x,
        });
        // 弹出前面第5个点击点
        if (priceQ.length > 4) {
            // 重置前面第5个点击的格子(如果连续点击同一个格子, 那么下一次重置会有问题)
            var pop = priceQ.shift();
            // 取消行高亮
            pop.cell.parent().css("background-color", "");
            if (pop.bs == "buy") {
                pop.cell.css("background-color", colorBuy);
            } else {
                pop.cell.css("background-color", colorSell);
            }
        }
        // 高亮当前的格子
        $x.css("background-color", colorFocus);
        // 高亮当前的行
        $x.parent().css("background-color", rowFocus);
        refreshPricePairs();
    };
    var $buy1s = $("#market_tabs .tab-content table td:nth-child(4)");
    var $sell1s = $("#market_tabs .tab-content table td:nth-child(5)");
    // 禁用各行的链接
    $buy1s.parent().off("click");
    $sell1s.parent().off("click");
    // 直接禁用行的点击事件, 会导致最后一个操作也没法点击, 该操作图标的 click 事件应该是绑定在 tr 的祖先元素上的
    //$buy1s.parent().click(function(e){e.stopPropagation();});
    //$sell1s.parent().click(function(e){e.stopPropagation();});
    // 禁用除了操作按钮列之外的其他单元格的点击跳转
    //$("#market_tabs .tab-content table td:not(.opts)").click(function(e){e.stopPropagation();});
    $("#market_tabs .tab-content table").on("click", "td:not(.opts)", function(e) {
        e.stopPropagation();
    });
    $("#market_tabs .tab-content table").on("click", "td:nth-child(4)", function(e) {
        onClickPrice("buy", $(this));
        e.stopPropagation();
    });
    $("#market_tabs .tab-content table").on("click", "td:nth-child(5)", function(e) {
        onClickPrice("sell", $(this));
        e.stopPropagation();
    });
})();

(function afterLoad(){
    var marketMore = $(".market_more");
})();
