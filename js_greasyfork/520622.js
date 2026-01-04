// ==UserScript==
// @name            WoD N价显示
// @icon            http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace       WOD_Tools
// @description     在市集和拍卖页面显示物品出售给NPC的价格，大致的利润等信息。
// @author          Christophero
// @include         http*://*.world-of-dungeons.org/wod/spiel/trade/trade.php*
// @license         MIT License
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @connect         www.christophero.xyz
// @modifier        Christophero
// @version         2022.08.21.1
// @downloadURL https://update.greasyfork.org/scripts/520622/WoD%20N%E4%BB%B7%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520622/WoD%20N%E4%BB%B7%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (!String.prototype.hasOwnProperty("replaceAll")) {
    String.prototype.replaceAll = function (s1, s2) {
      return this.replace(new RegExp(s1, "gm"), s2);
    };
  }
  const ifAuction = $('div.box_container>h1:contains("拍卖")').length;

  const $searchBtn = $('a:contains("开始搜索")');
  const $fetchNpcPriceBtn = $(
    '<button type="button" class="button">获取最新N价</button>'
  );
  // 拉取最新N价
  $fetchNpcPriceBtn.click(() => {
    fetch("https://www.christophero.xyz/wod/item/fetchAllNpcPrice", {
      method: "POST",
      headers: {
        "User-Agent": "Apipost client Runtime/+https://www.apipost.cn/",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (!(res && res.code === 200)) {
          alert("获取最新N价时出现问题");
          return;
        }
        const allItems = res.data;
        const priceMap = allItems
          .map((item) => {
            return { name: item.name, npcPrice: item.npcPrice };
          })
          .reduce((map, item) => {
            map[item.name] = item.npcPrice;
            return map;
          }, new Object());
        localStorage.setItem("priceMap", JSON.stringify(priceMap));
        alert("已获取最新N价");
      });
  });
  $searchBtn.after($fetchNpcPriceBtn);

  // 插入最新N价列
  const $trs = $("table.content_table>tbody>tr");
  let map = localStorage.getItem("priceMap");
  if (!map || !$trs.length) return;
  map = JSON.parse(map);
  $("table.content_table>thead>tr.header>th:eq(3)").after(
    $('<th class="">N价</th><th class="">利润</th>')
  );
  $("table.content_table>tfoot>tr.header>th:eq(3)").after(
    $('<th class="">N价</th><th class="">利润</th>')
  );
  $trs.each(function (i, tr) {
    const itemName = $(tr).find("td:eq(1) a").text();
    const $td = $(tr).find("td:eq(3)");
    if (!map.hasOwnProperty(itemName)) {
      $td.after(
        $(
          '<td align="right" nowrap="">-</td><td align="right" nowrap="">-</td>'
        )
      );
      return;
    }
    let npcPrice = map[itemName] || 0;
    const numStr = $(tr)
      .find("td:eq(1)")
      .text()
      .trim()
      .replace(itemName, "")
      .trim();
    if (numStr) {
      const numArr = numStr.replace(/^\(/, "").replace(/\)$/, "").split("/");
      npcPrice = Math.round(
        (parseFloat(npcPrice) * parseFloat(numArr[0])) / parseFloat(numArr[1])
      );
    }
    let price = 0;
    if ($(tr).find("td:eq(3) input").length) {
      price = parseFloat($(tr).find("td:eq(3) input").val());
    } else {
      price = parseFloat(
        $(tr)
          .find("td:eq(3)")
          .text()
          .replace(/^.+\n/, "")
          .replace(/无人出价$/, "")
          .replace(/来自.+$/, "")
          .replaceAll(",", "") || 0
      );
    }
    let diff = Math.floor((1 - 0.1) * price - npcPrice - (ifAuction ? 50 : 10));
    let rate = Math.round((diff * 100) / npcPrice);
    let $diffTd = $('<td align="right" nowrap="">-</td>');
    let diffColor = "#FFFFFF";
    if (diff > 50 && rate > 100) {
      diffColor = "#CC3333";
    } else if (diff > 50 && rate > 50) {
      diffColor = "#FFCF00";
    } else if (diff < 0) {
      diffColor = "#4dbb7c";
    }
    $diffTd.css("color", diffColor);
    $diffTd.text(`${diff}(${rate}%)`);
    $td.after($diffTd);
    $td.after(
      $(
        '<td align="right" nowrap="">' +
          npcPrice +
          '<img alt="" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币" border="0"></td>'
      )
    );
  });
})();
