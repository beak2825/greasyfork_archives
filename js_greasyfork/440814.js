// ==UserScript==
// @name               Steam社区市场价格历史记录附加按钮
// @name:en            Add extra buttons to the Steam Community Market item details page.
// @name:zh-CN         Steam社区市场价格历史记录附加按钮
// @version            0.0.3
// @description        Steam饰品详情页看历史记录是增加额外的筛选按钮（原有按钮为：周、月、总览）
// @description:en     Add extra buttons to the Steam Community Market item details page when check history prices.
// @description:zh-CN  Steam饰品详情页看历史记录是增加额外的筛选按钮（原有按钮为：周、月、总览）
// @author             guchfeng
// @homepageURL        https://greasyfork.org/zh-CN/scripts/440814
// @icon               https://store.steampowered.com/favicon.ico
// @match              https://steamcommunity.com/market/listings/*
// @grant              none
// @supportURL         https://github.com/guchenfeng/ExtraSteamMarketPageButtons
// @namespace          https://greasyfork.org/users/198749
// @downloadURL https://update.greasyfork.org/scripts/440814/Steam%E7%A4%BE%E5%8C%BA%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%BC%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E9%99%84%E5%8A%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/440814/Steam%E7%A4%BE%E5%8C%BA%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%BC%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E9%99%84%E5%8A%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
  // Your code here...

  // zoom_controls "Zoom graph"(放大图表)-div
  var eles = document.getElementsByClassName("zoom_controls");

  if (eles) {
    // 放大图表 下 有3个 <a>标签:周、月、总览
    var zoomDiv = eles[0];
    var zoomChilds = zoomDiv.children;

    // Week Month Lifetime (周 月 总览)
    var childWeek = zoomChilds[0];
    // 如果未获取到子元素，则跳过避免网页bug
    if (!childWeek) return;

    var childMonth = zoomChilds[1];
    // 如果未获取到子元素，则跳过避免网页bug
    if (!childMonth) return;

    var childLifetime = zoomChilds[2];
    // 如果未获取到子元素，则跳过避免网页bug
    if (!childLifetime) return;

    /*
     * <a class="zoomopt" onclick="return pricehistory_zoomDays( g_plotPriceHistory,
     * g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 7 );" href="javascript:void(0)">周</a>
     *
     */

    // 14 days - half month
    var childHalfMonth = document.createElement("a");
    childHalfMonth.innerHTML = "近半月"
    childHalfMonth.setAttribute("class", "zoomopt");
    childHalfMonth.setAttribute("onclick", "return pricehistory_zoomDays( g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 14)");
    // childHalfMonth.href="javascript:void(0)"
    zoomDiv.insertBefore(childHalfMonth, childMonth);

    // 60 days - two months
    var childTwoMonths = document.createElement("a");
    childTwoMonths.innerHTML = "近两月"
    childTwoMonths.setAttribute("class", "zoomopt");
    childTwoMonths.setAttribute("onclick", "return pricehistory_zoomDays( g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 60)");
    // childTwoMonths.href="javascript:void(0)"
    zoomDiv.insertBefore(childTwoMonths, childLifetime);

    // 90 days - three months
    var childThreeMonths = document.createElement("a");
    childThreeMonths.innerHTML = "近三月"
    childThreeMonths.setAttribute("class", "zoomopt");
    childThreeMonths.setAttribute("onclick", "return pricehistory_zoomDays( g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 90)");
    // childThreeMonths.href="javascript:void(0)"
    zoomDiv.insertBefore(childThreeMonths, childLifetime);

    // 180 days - six months - half year
    var childHalfYear = document.createElement("a");
    childHalfYear.innerHTML = "近半年"
    childHalfYear.setAttribute("class", "zoomopt");
    childHalfYear.setAttribute("onclick", "return pricehistory_zoomDays( g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 180)");
    // childHalfYear.href="javascript:void(0)"
    zoomDiv.insertBefore(childHalfYear, childLifetime);

    // 365 days - one year
    var childOneYear = document.createElement("a");
    childOneYear.innerHTML = "近1年"
    childOneYear.setAttribute("class", "zoomopt");
    childOneYear.setAttribute("onclick", "return pricehistory_zoomDays( g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 365)");
    // childOneYear.href="javascript:void(0)"
    zoomDiv.insertBefore(childOneYear, childLifetime);

    console.debug("UserScript--https://greasyfork.org/zh-CN/scripts/440814--");
    console.debug("--Suessesfully added extra buttons(14days, 60days, 90days, 180days, 365days) to the Market page..");
  }

}

)();
