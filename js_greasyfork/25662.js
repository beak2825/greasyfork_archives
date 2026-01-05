
// ==UserScript==
// @name         「Z-Blog」开发者工具（应用中心）
// @namespace    https://www.wdssmq.com/
// @version      2.1
// @author       沉冰浮水
// @description  含订单搜索，附带隐藏未付订单，应用审核回显；
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.net/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @match     https://app.zblogcn.com/zb_system/admin/edit.php*id=*
// @match     https://app.zblogcn.com/zb_users/plugin/AppBuy/shop/main.php*
// @match     https://app.zblogcn.com/?id=*
// @match     https://user.zblogcn.com/trade/money/payout
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25662/%E3%80%8CZ-Blog%E3%80%8D%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%EF%BC%88%E5%BA%94%E7%94%A8%E4%B8%AD%E5%BF%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/25662/%E3%80%8CZ-Blog%E3%80%8D%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%EF%BC%88%E5%BA%94%E7%94%A8%E4%B8%AD%E5%BF%83%EF%BC%89.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  "use strict";

  const gm_name = "zbp_DevTools";

  // ---------------------------------------------------
  const _log = (...args) => console.log(`[${gm_name}]\n`, ...args);
  // ---------------------------------------------------
  let $ = null;
  try {
    $ = window.$ || unsafeWindow.$;
  } catch (e) {
    // _error(e);
  }
  function $n(e) {
    return document.querySelector(e);
  }
  // ---------------------------------------------------
  const fnElChange = (el, fn = () => { }) => {
    const observer = new MutationObserver((mutationRecord, mutationObserver) => {
      // _log('mutationRecord = ', mutationRecord);
      // _log('mutationObserver === observer', mutationObserver === observer);
      fn(mutationRecord, mutationObserver);
      // mutationObserver.disconnect();
    });
    observer.observe(el, {
      // attributes: false,
      // attributeFilter: ["class"],
      childList: true,
      // characterData: false,
      subtree: true,
    });
  };

  // 前台编辑链接
  (() => {
    if ($ === null) return;
    if ($(".app-content").text() === "") return false;
    const edtLink =
      "https://app.zblogcn.com/zb_system/admin/edit.php" +
      location.search +
      "&act=ArticleEdt";
    const domLink = $(
      "<a title=\"编辑\" target=\"_blank\" href=\"" + edtLink + "\">编辑</a>",
    );
    domLink
      .css({
        color: "darkgray",
        "font-size": "14px",
        "padding-left": "0.5em",
      })
      .hover(
        function () {
          $(this).css({
            color: "#d60000",
          });
        },
        function () {
          $(this).css({
            color: "darkgray",
          });
        },
      );
    $(".app-header-detail h3").append(domLink);
  })();

  // Ajax 回显自动审核
  (() => {
    if ($ === null) return;
    let $p = $("#response3 dl p");
    if ($p.length == 0 || $p.find("a").length == 1) {
      return;
    }
    function fnGet(cb) {
      $.ajax({
        url: location.href,
        type: "get",
        success: function (data) {
          let $el = $(data).find("#response3 dl a");
          if ($el.attr("href")) {
            cb($el.attr("href"));
          }
          console.log($el.attr("href"));
        },
      });
    }
    let i = 43;
    let t = setInterval(() => {
      $p.html(`自动审核中，请稍侯${i}`);
      i--;
      if (i % 13 == 0) {
        fnGet((href) => {
          $p.html(
            `自动审核完毕，<a target="_blank" href="${href}">请点击此处查看。</a>`,
          );
          clearInterval(t);
        });
      }
      if (i == 0) {
        i = 47;
      }
    }, 1000);
  })();

  (() => {
    if ($ === null) return;
    // 移除指定的节点
    function fnHide(t = "") {
      let curHtml;
      $("tr").each(function () {
        curHtml = $(this).html();
        if (/待付款/.test(curHtml)) $(this).remove();
        if (t === "all") $(this).remove();
      });
    }

    // 时间对比转天数
    function fnTimeDiff(recent, past) {
      let timeDiff = recent.getTime() - past.getTime();
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }

    // 初始全局变量
    const gobBase = {
      oDate: null,
      timeRan: {
        recent: null,
        past: null,
      },
      // 订单计数
      intCount: 0,
      // 价格总计
      intTOL: 0,
      // 金额累加，输入为金额字符串，扣除分成
      add(amt) {
        this.intTOL += parseFloat(amt) * 100 * 0.75;
      },
      diff() {
        const intDiff = fnTimeDiff(this.timeRan.recent, this.timeRan.past);
        return intDiff > 0 ? intDiff : 1;
      },
      view(t = "") {
        let rltNum = 0;
        switch (t) {
          case "perDay":
            rltNum = this.intTOL / this.diff() / 100;
            break;
          case "perMonth":
            rltNum = this.intTOL / this.diff() / 100 * 30;
            break;
          default:
            rltNum = this.intTOL / 100;
            break;
        }
        return rltNum.toFixed(2);
      },
    };

    // 实际调用
    let gob;

    // 搜索调用
    function fnSearch(q) {
      gob = Object.assign({}, gobBase);
      _log(JSON.stringify(gob));
      const regPat = new RegExp(q + ".+已付款", "");
      fnHide("all");
      fnAjax(1, regPat);
    }

    // Ajax 请求
    function fnAjax(page, regPat) {
      $.ajax({
        url:
          "https://app.zblogcn.com/zb_users/plugin/AppBuy/shop/main.php?page=" +
          page,
        type: "get",
        success: function (data) {
          if (/已付款/.test(data)) {
            // if (/已付款/.test(data) && page < 2) {
            // _log($(data));
            let curHtml;
            $(data)
              .find("#divMain2 table tr")
              .each(function () {
                curHtml = $(this)
                  .html()
                  .replace(/[\n\s]+/g, " ");
                if (regPat.test(curHtml) === true) {
                  // 匹配时间字符串
                  let mltDate = curHtml.match(/<td.*>([^<]+)<\/td> <td>已付款<\/td>/);
                  // 转换时间对象
                  gob.oDate = new Date(Date.parse(mltDate[1]));

                  _log(curHtml);
                  _log(gob.oDate);

                  // 日期区间
                  if (gob.timeRan.recent === null) {
                    gob.timeRan.recent = gob.oDate;
                  }
                  gob.timeRan.past = gob.oDate;
                  // 订单计数
                  gob.intCount++;
                  // 匹配金额字符串
                  // let mltAMT = curHtml.match(/<td>￥([^<]+)<\/td>/);
                  let mltAMT = curHtml.match(/<td>￥[^<]+\(([^<]+)\)<\/td>/);
                  // 金额累加
                  gob.add(mltAMT[1]);
                  // 添加节点
                  $("table:not(#tbStatistic) tbody").append(
                    "<tr>" + curHtml + "</tr>\n",
                  );
                }
              });
            page++;
            fnAjax(page, regPat);
            $("#js-page").text(page);
          } else {
            $("#js-page").text("完成");
            const strTR = `<tr>
            <td colspan="2"></td>
            <td>${gob.intCount}</td>
            <td>${gob.view()}</td>
            <td colspan="2">${gob.view("perDay")}/天 | ${gob.view("perMonth")}/30 天</td>
            <td>天数：${gob.diff()}</td>
            <td></td>
            <td></td>
          </tr>`;
            $("table:not(#tbStatistic) tbody").prepend(
              strTR,
            );
            // _log(gob);
          }      },
        // end success
      });
    }

    // 放置搜索框
    $(".SubMenu").append(
      "<input id=\"search\" style=\"float:left;margin-right: 2px;margin-top: 2px\" type=\"text\" value=\"\">" +
      "<a href=\"javascript:;\" id=\"js-search\"><span class=\"m-left\">搜索</span></a>" +
      "<span id=\"js-page\"></span>",
    );

    // 搜索触发
    $("#js-search").click(function () {
      const search = $("#search").val();
      // alert(search);
      fnSearch(search);
    });
  })();

  (() => {
    const $body = $n("body");
    fnElChange($body, (mutationRecord, mutationObserver) => {
      const $input = $n(".ivu-input-number-input");
      const $amt = $n(".ivu-alert-message p b");
      if ($input === null) return;
      $input.value = $amt.innerText;
      mutationObserver.disconnect();
    });
  })();

})();
