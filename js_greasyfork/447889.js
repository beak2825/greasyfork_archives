// ==UserScript==
// @name         亚马逊后台下载工具（个人使用）
// @namespace    https://greasyfork.org/zh-CN/scripts/447889
// @version      0.204
// @description  自动30天订单,库存|退货|账单|店铺高亮|业务报告|自动化|跨境卫士|紫鸟浏览器
// @author       menkeng
// @match        https://sellercentral.amazon.com/*
// @match        https://advertising.amazon.com/cm/*
// @exclude      https://advertising.amazon.com/cm/sp/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/447889/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%90%8E%E5%8F%B0%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447889/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%90%8E%E5%8F%B0%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
// This is how site search get access to the shadow root
// var shadowRoot = $(element.shadowRoot);
// 定制服务  Q：605011383
// 定制服务  Q：605011383
// 定制服务  Q：605011383
 
//时间格式化问题 *特殊处理 昨日 UTC
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getUTCMonth() + 1, //月份
    "d+": this.getUTCDate() - 1, //昨日
    "H+": this.getUTCHours(), //小时
    "m+": this.getUTCMinutes(), //分
    "s+": this.getUTCSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
    "R+": this.getUTCMonth(), //上月月份
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};


// 被删除  暂时不做
// 来源https://blog.csdn.net/mx_csdn/article/details/131518694

var yesterday_cn = new Date().Format("yyyy年M月d日");
var Premonth_first = new Date().Format("yyyy年R月1日");
function y_lastday() {
  var y1 = new Date().Format("yyyy");
  var y2 = new Date().Format("R");
  var last = new Date(y1, y2, 0);
  var Premonth_last = last.getDate();
  return Premonth_last;
}
function lastday() {
  var y1 = new Date().Format("yyyy");
  var y2 = new Date().Format("M");
  var last = new Date(y1, y2, 0);
  var lastday = last.getDate();
  return lastday;
}
var Premonth_last = new Date().Format("yyyy年R月" + y_lastday() + "日");
// 获取地址
var href = window.location.href;
// 业务报告
var rdailyhref =
  /sellercentral.amazon.com\/business-reports\/ref=xx_sitemetric_dnav_xx#\/dashboard/;
// 销量与访问量
var month_sell_href =
  /sellercentral.amazon.com\/business-reports\/ref=xx_sitemetric_dnav_xx#\/report\?id=102%3ASalesTrafficTimeSeries&chartCols/;
// Send to Amazon
var STAhref = /sellercentral.amazon.com\/fba\/sendtoamazon/;
// 管理订单
var now_orderhref = /sellercentral.amazon.com\/orders-v3/;
// 后台
var homehref =
  /sellercentral.amazon.com\/gp\/homepage.html\/ref=xx_home_logo_xx|sellercentral.amazon.com\/home/;
// 付款控制面板
var payhref =
  /sellercentral.amazon.com\/payments\/dashboard\/index.html\/ref=xx_payments_dnav_xx/;
// 广告页面
var adhref = /advertising.amazon.com\/cm*campaigns*|advertising.amazon.com\/cm*portfolios*/;
// 定
// 时
// 器
setTimeout(function () {
  // alert("00")
}, 200);
var button_css =
  "class: button; width: 50px;height: 50px;position: fixed;top: 100px;right: 50px;background: rgb(0, 130, 150);color: white;";
var debug_css =
  "class: button; width: 200px;height: 100px;position: fixed;top: 100px;right: 50px;background:rgba(0,0,0,0.2);color: black;overflow: scroll;";
var txtarea_css =
  "width: 34px;height: 24px;position: absolute;top: 4px;left: 108px;background: rgb(0 130 150);color: white;font:400 13.3333px Arial;box-shadow:0 1px 2px 0 #b5b5b5;";
var Abutton = document.createElement("textarea");
var copy_area = document.createElement("textarea");
var a = document.createElement("a");
var adbtn = document.createElement("button");
var li = document.createElement("li");
var button_box = document.createElement("button");
var debug_text = document.createElement("textarea");
var debug_flag = "0";
// 此处手动添加链接至收藏夹
var r_ad_repo_href =
  "https://advertising.amazon.com/cm/?adrepo"; /* 日报_广告报表 */
var r_daily_visit_href =
  "https://sellercentral.amazon.com/business-reports/ref=xx_sitemetric_dnav_xx#/report?id=102:SalesTrafficTimeSeries"; /* 日报_销量与访问量报表 */
var r_cash_href =
  "https://sellercentral.amazon.com/payments/disburse/details?accountType=PAYABLE?auto"; /* 日报_提现 */
var n_orderlist_href =
  "https://sellercentral.amazon.com/order-reports-and-feeds/reports/allOrders#30day"; /* 备货_30天订单下载 */
var n_invage_href =
  "https://sellercentral.amazon.com/reportcentral/MANAGE_INVENTORY_HEALTH/1?auto"; /* 备货_库龄下载 */
var n_invlist_href =
  "https://sellercentral.amazon.com/reportcentral/FBA_MYI_UNSUPPRESSED_INVENTORY/1?auto"; /* 备货_库存下载 */
var w_newship_href =
  "https://sellercentral.amazon.com/fba/sendtoamazon/?new"; /* 创建新货件 */
var w_daterange_repo_href =
  "https://sellercentral.amazon.com/payments/reports-repository?thismonth"; /* 周报_本月日期范围报告 */
var w_orderlist_href =
  "https://sellercentral.amazon.com/order-reports-and-feeds/reports/allOrders#thismonth"; /* 周报_本月订单下载 */
var w_daily_visit_href =
  "https://sellercentral.amazon.com/business-reports/ref=thismonth#/report?id=102:SalesTrafficTimeSeries"; /* 周报_销量与访问量报表 */
var m_daily_visit_href =
  "https://sellercentral.amazon.com/business-reports/ref=lastmonth#/report?id=102:SalesTrafficTimeSeries"; /* 月报_销量与访问量报表 */
var m_daterange_repo_href =
  "https://sellercentral.amazon.com/payments/reports-repository?lastmonth"; /* 月报_上月日期范围报告 */
var m_refound_repo_href =
  "https://sellercentral.amazon.com/reportcentral/CUSTOMER_RETURNS/1?lastmonth"; /* 月报_上月退货报告 */
var m_orderlist_href =
  "https://sellercentral.amazon.com/order-reports-and-feeds/reports/allOrders#lastmonth"; /* 月报_上月订单下载 */
var m_shipment_href =
  "https://sellercentral.amazon.com/gp/ssof/shipping-queue.html#fbashipment"; /* 月报_上月货件下载 */
// 页面未跳转
if (debug_flag == 1) {
  debug();
}
if (href == n_invage_href) {
  n_invage_auto();
}
if (href == n_invlist_href) {
  setTimeout(() => {
    n_invlist_auto();
  }, 2000);
}
if (href == n_orderlist_href) {
  n_orderlist_auto("30");
}
if (href == w_orderlist_href) {
  n_orderlist_auto("thismonth");
}
if (href == w_daterange_repo_href) {
  setTimeout(() => {
    m_range_repo_auto("thismonth");
  }, 2000);
}
if (href == w_daily_visit_href) {
  setTimeout(() => {
    w_sale_download();
  }, 5000);
}
if (href == m_daily_visit_href) {
  setTimeout(() => {
    m_sale_download();
  }, 5000);
}
if (href == m_daterange_repo_href) {
  setTimeout(() => {
    m_range_repo_auto("lastmonth");
  }, 2000);
}
if (href == m_refound_repo_href) {
  setTimeout(() => {
    m_refound_repo_auto();
  }, 2000);
}
if (href == m_orderlist_href) {
  n_orderlist_auto("lastmonth");
}
// 下载货件暂未完成
// if (href == m_shipment_href) {setTimeout(() => {m_shipment_auto()}, 2000)}

// 页面加载完毕
$().ready(function () {
  var href = window.location.href;
  // 店铺高亮  暂停
  // setInterval(function () {
  //   red();
  // }, 1000);
  // 管理订单sku详情
  if (now_orderhref.test(href)) {
    setTimeout(() => {
      order_skuinfo();
    }, 5000);
  }
  //  业务报告点击前一天
  if (rdailyhref.test(href)) {
    yday();
  }
  // 发货填箱
  if (STAhref.test(href)) {
    Ebutton();
  }
  // 复制广告情况
  if (adhref.test(href)) {
    setTimeout(() => {
      adinfo_button();
    }, 5000);
  }
});
// 店铺高亮
function red() {
  document.querySelector("#partner-switcher > button").style.height = "37px";
  document.querySelector("#partner-switcher > button").style.fontSize = "25px";
  document.querySelector("#partner-switcher > button").style.color = "red";
}
// 日报部分
// 点击前一天
function yday() {
    setTimeout(function () {
        // 或许是shadowdom解决方法
        // var sr = $("[name='remark']")[0].shadowRoot;
        // $(sr).find("button").click()
        document
            .querySelectorAll("kat-dropdown")[0]
            .shadowRoot.querySelector(
                "div.kat-select-container > div.select-options > div > div > slot > kat-option:nth-child(5)"
            )
            .click();
        setTimeout(function () {
            var dom1 = $("div.css-wb79wd > div.css-1nvf2ph > kat-date-picker:nth-child(1)")[0]
                .shadowRoot;
            var dom1_1 = $(dom1).find("kat-calendar")[0].shadowRoot;
            $(dom1_1)
                .find('button[aria-label="' + yesterday_cn + '"]')
                .click();
            setTimeout(function () {
                var dom2 = $("div.css-wb79wd > div.css-1nvf2ph > kat-date-picker:nth-child(2)")[0]
                    .shadowRoot;
                var dom2_1 = $(dom2).find("kat-calendar")[0].shadowRoot;
                $(dom2_1)
                    .find('button[aria-label="' + yesterday_cn + '"]')
                    .click();
                document
                    .querySelector("div.css-1om0prg > kat-button")
                    .shadowRoot.querySelector("button")
                    .click();
                setInterval(function () {
                    copy_button();
                    copy_report();
                }, 1700);
            }, 100);
        }, 1500);
    }, 4000);
}
// 创建复制按钮
function copy_button() {
    document.querySelector(
        "#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh"
    ).style.cssText = "position: relative;";
    Abutton.setAttribute("type", "button");
    Abutton.style.cssText = txtarea_css;
    Abutton.setAttribute("class", "button");
    Abutton.innerText = "复制";
    document
        .querySelector(
            "#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(1)"
        )
        .appendChild(Abutton);
}
// 复制分支 业务报告
function copy_report() {
    Abutton.onclick = function () {
        var t1 = document.querySelector(
            "#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(1) > h2"
        ).innerHTML;
        var t2 = document.querySelector(
            "#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(2) > h2"
        ).innerHTML;
        var t3 = document.querySelector(
            "#root > div > div.css-1hwrlfd > div > kat-box.css-1ff7o6c > div.css-2imjyh > div:nth-child(3) > h2"
        ).innerHTML;
        value = t1 + "\t" + t2 + "\t" + t3;
        GM_setClipboard(value);
        // Abutton.select();
        // document.execCommand("copy");

    };
}
// 创建复制按钮 广告详情
function adinfo_button() {
  setTimeout(function () {
    adbtn.setAttribute("type", "button");
    var adbtn_css = document.querySelector(
      "#J_AACChromePivotNav > div > button:nth-last-child(1)"
    ).className;
    adbtn.setAttribute("class", adbtn_css);
    var text = document.createTextNode("复制");
    var adspan = document.createElement("span");
    var adspan_css = document.querySelector(
      "#J_AACChromePivotNav > div > button:nth-last-child(1) > span"
    ).className;
    adspan.setAttribute("class", adspan_css);
    adspan.onclick = function () {
      ad_copy();
    };
    adspan.appendChild(text);
    adbtn.appendChild(adspan);
    document.querySelector("#J_AACChromePivotNav > div").appendChild(adbtn);
    document.querySelector("#J_AACChromePivotNav > div").appendChild(copy_area);
    // 广告花费复制
    setInterval(() => {
      $("#UCM-CM-APP\\:campaignsDashboard\\:chart\\:kpiCards > div").each(
        function (i, obj) {
          $(this)
            .children("button")
            .click(function () {
              var t1 = $(this).text();
              copy_area.value = t1;
              copy_area.select();
              document.execCommand("copy");
            });
        }
      );
    }, 1000);
  }, 1000);
}
// 发/备货
// 自动选择箱子（未完成
function Ebutton() {
  button_box.setAttribute("type", "button_box");
  button_box.style.cssText = button_css;
  button_box.onclick = function () {
    boxtool();
  };
  button_box.innerText = "箱子";
  document.querySelector("body").appendChild(button_box);
}
// 周
// 报
// 部
// 分

// 本月销量与访问量报告
function w_sale_download() {
  setTimeout(function () {
    var dom1 = $("#daily-time-picker-kat-date-range-picker")[0].shadowRoot;
    var dom1_1 = $(dom1).find("kat-date-picker.start")[0].shadowRoot;
    var dom1_2 = $(dom1_1).find("kat-calendar")[0].shadowRoot;
    $(dom1_2).find('button[data-day="1"]').click();
  }, 200);
}
// 月
// 报
// 部
// 份
// 上月销量与访问量报告
function m_sale_download() {
  setTimeout(function () {
    var dom1 = $("kat-date-picker")[0].shadowRoot;
    var dom1_1 = $(dom1).find("kat-calendar")[0].shadowRoot;
    $(dom1_1).find('button[data-day="1"]').click();
    // 结束时间
    setTimeout(function () {
      document
        .querySelectorAll("kat-date-picker")[1]
        .shadowRoot.querySelector("kat-calendar")
        .shadowRoot.querySelector("div > div.cal-header > button.cal-lft")
        .click();
      setTimeout(function () {
        var dom2 = $("kat-date-picker")[1].shadowRoot;
        var dom2_1 = $(dom2).find("kat-calendar")[0].shadowRoot;
        $(dom2_1).find("td.day.on.last-day").click();
        setTimeout(function () {
          document
            .querySelector("kat-button[label='下载 (.csv)']")
            .shadowRoot.querySelector("button")
            .click();
        }, 200);
      }, 200);
    }, 200);
  }, 200);
}
// 退货报告  //上月日期选择
function m_refound_repo_auto() {
  document
    .querySelector("#daily-time-picker-style > kat-dropdown")
    .shadowRoot.querySelector(
      "div.kat-select-container > div.select-options > div  kat-option[value='-1']"
    )
    .click();
  document
    .querySelector("#daily-time-picker-kat-date-range-picker")
    .shadowRoot.querySelector("kat-date-picker.start")
    .shadowRoot.querySelector("div > div.input__container > kat-input")
    .click();
  time_picker_lastmonth();
  var Interval_1 = setInterval(function () {
    if (document.querySelector("#download-notification-banner-kat-box > a")) {
      clearInterval(Interval_1);
      document
        .querySelector(
          "kat-table-body > kat-table-row:nth-child(1) > kat-table-cell:nth-last-child(1) > kat-button"
        )
        .click();
    }
  }, 1000);
}
// 确切日期-上月初-月末通用
function time_picker_lastmonth() {
  setTimeout(function () {
    document
      .querySelector("#daily-time-picker-kat-date-range-picker")
      .shadowRoot.querySelector("kat-date-picker.start")
      .shadowRoot.querySelector("kat-calendar")
      .shadowRoot.querySelector("div > div.cal-header > button.cal-lft")
      .click();
    setTimeout(function () {
      var dom1 = $("#daily-time-picker-kat-date-range-picker")[0].shadowRoot;
      var dom1_1 = $(dom1).find("kat-date-picker.start")[0].shadowRoot;
      var dom1_2 = $(dom1_1).find("kat-calendar")[0].shadowRoot;
      $(dom1_2).find('button[data-day="1"]').click();
      // 结束时间
      setTimeout(function () {
        document
          .querySelector("#daily-time-picker-kat-date-range-picker")
          .shadowRoot.querySelector("kat-date-picker.end")
          .shadowRoot.querySelector("div > div.input__container > kat-input")
          .click();
        setTimeout(function () {
          document
            .querySelector("#daily-time-picker-kat-date-range-picker")
            .shadowRoot.querySelector("kat-date-picker.end")
            .shadowRoot.querySelector("kat-calendar")
            .shadowRoot.querySelector("div > div.cal-header > button.cal-lft")
            .click();
          setTimeout(function () {
            var dom2 = $("#daily-time-picker-kat-date-range-picker")[0]
              .shadowRoot;
            var dom2_1 = $(dom2).find("kat-date-picker.end")[0].shadowRoot;
            var dom2_2 = $(dom2_1).find("kat-calendar")[0].shadowRoot;
            $(dom2_2)
              .find('button[aria-label="' + Premonth_last + '"]')
              .click();
            document
              .querySelector(
                "#report-page-kat-box > kat-button.download-report-page-kat-button-primary"
              )
              .shadowRoot.querySelector("button > div.content > slot > span")
              .click();
          }, 200);
        }, 200);
      }, 200);
    }, 200);
  }, 200);
}
// 生成日期范围报告
async function m_range_repo_auto(month) {
  var submit_button = $("#filter-generate-button");
  switch (month) {
    case "thismonth":
      await s_thismonth();
      $(submit_button).click();
      await sleep(2000);
      await daterange_repo_check();
      await sleep(2000);
      //   切换为汇总报告
      $("kat-dropdown")[1]
        .shadowRoot.querySelector(
          "div.kat-select-container > div.select-options > div > div > slot > kat-option:nth-child(1)"
        )
        .click();
      await sleep(1000);
      await s_thismonth();
      $(submit_button).click();
      await sleep(2000);
      await daterange_repo_check();
      break;
    case "lastmonth":
      $("#katal-id-9").click();
      $(submit_button).click();
      await sleep(2000);
      await daterange_repo_check();
      //   切换为汇总报告
      $("kat-dropdown")[1]
        .shadowRoot.querySelector(
          "div.kat-select-container > div.select-options > div > div > slot > kat-option:nth-child(1)"
        )
        .click();
      await sleep(1000);
      $(submit_button).click();
      await sleep(2000);
      await daterange_repo_check();
      break;
    default:
      alert("month error");
      break;
  }
  //   生成日期范围报告——当月日期选择
  async function s_thismonth() {
    var thisday = new Date().getUTCDate() - 2;
    var dom1 = $(".time-range-selection.selection-filter > kat-date-picker")[0]
      .shadowRoot;
    var dom1_1 = $(dom1).find("kat-calendar")[0].shadowRoot;
    $(dom1_1).find("kat-icon").click();
    $(dom1_1).find("button[data-day='1']").click();
    await sleep(2000);
    var dom2 = $(".time-range-selection.selection-filter > kat-date-picker")[1]
      .shadowRoot;
    var dom2_1 = $(dom2).find("kat-calendar")[0].shadowRoot;
    $(dom2_1).find("kat-icon").click();
    $(dom2_1)
      .find("button[data-day='" + thisday + "']")
      .click();
  }
  //   生成日期范围报告——请求后下载
  async function daterange_repo_check() {
    await sleep(1000);
    var daterange_repo_button = $(
      "kat-table-row:nth-child(1) > kat-table-cell:last-child > div > kat-button"
    );
    var daterange_repo_button_text = daterange_repo_button.attr("label");
    if (daterange_repo_button_text == "刷新") {
      $("kat-button[label='刷新']").click();
      return daterange_repo_check();
    } else if (daterange_repo_button_text == "再次请求") {
      $("kat-button[label='再次请求']").click();
      return daterange_repo_check();
    } else if (daterange_repo_button_text == "下载 CSV 文件") {
      $(daterange_repo_button).click();
      return;
    }else if (daterange_repo_button_text == "下载 PDF 文件") {
        $(daterange_repo_button).click();
        return;
    } else {
      alert("未知错误");
    }
  }
}
// 选择箱子
function boxtool() {
  $("kat-radiobutton[label='需要多个包装箱']").click();
  $("kat-button[label='确认']").click();
  setTimeout(function () {
    $(
      "div.pack-group-row-body > div.flo-athens-border-left > div > div:nth-child(2) > kat-dropdown > div > div.select-header"
    ).click();
    setTimeout(function () {
      $("#FILE_UPLOAD1").click();
    }, 100);
  }, 100);
}
// 订单报告下载
function n_orderlist_auto(day) {
  setTimeout(() => {
    $("#a-autoid-0-announce").click();
    setTimeout(() => {
      switch (day) {
        case "30":
          document.getElementById("dropdown1_4").click();
          $("#a-autoid-1").click();
          break;
        case "thismonth":
          var thisday = new Date().getUTCDate() - 2;
          document.getElementById("dropdown1_5").click();
          setTimeout(() => {
            $("input[data-action='a-cal-input']")[0].click();
            $("#a-popover-content-2 tr:nth-child(1) a")[0].click();
            setTimeout(() => {
              $("input[data-action='a-cal-input']")[1].click();
              $("#a-popover-content-3 a")[thisday - 1].click();
              $("#a-autoid-1").click();
            }, 1000);
          }, 1000);
          break;
        case "lastmonth":
          document.getElementById("dropdown1_5").click();
          setTimeout(() => {
            $("input[data-action='a-cal-input']")[0].click();
            setTimeout(() => {
              // jQuery可以获取但无法执行
              document
                .querySelector("a.a-declarative.a-cal-paginate-prev")
                .click();
              setTimeout(() => {
                $("#a-popover-content-2 tr:nth-child(1) a")[0].click();
                setTimeout(() => {
                  // 动态生成需on绑定
                  $("#myo-reports-requestAllOrdersReport").on(
                    "click",
                    function () {
                      setTimeout(() => {
                        document
                          .querySelector(
                            "#a-popover-3 table > tbody > tr:last-child a:last-child"
                          )
                          .click();
                        $("#a-autoid-1").click();
                      }, 500);
                    }
                  );
                  $("input[data-action='a-cal-input']")[1].click();
                  $("#myo-reports-requestAllOrdersReport").off("click");
                }, 2000);
              }, 2000);
            }, 500);
          }, 1000);
          break;
        default:
          alert("day not found");
      }
      setTimeout(() => {
        n_orderlist_check();
      }, 12 * 1000);
    }, 2000);
  }, 2000);
}
// 检查订单是否下载完成
function n_orderlist_check() {
  // 动态生成需on绑定
  var executed = false; // 添加标志变量
  var Interval_1 = setInterval(() => {
    $("#refreshButton").click();
    $("#myo-reports-reportStatus").on("click", function () {
      // find不返回数组，使用eq定位
      var status = $("table.a-keyvalue")
        .find("td[data-test-id='myo-reports-reportStatus-status']")
        .eq(0)
        .text();
      var id = $("#myo-reports-reportStatus").find("td").eq(8).text();
      if (status == "就绪") {
        clearInterval(Interval_1);
        $("#myo-reports-tabs").off("click");
        if (!executed) {
          // 检查标志变量是否为false
          executed = true; // 将标志变量设置为true
          // 直接返回id，拼接网址
          location.href =
            "/order-reports-and-feeds/api/documentMetadata?referenceId=" + id;
        }
      }
    });
  }, 2000);
}
// 检查订单是否下载完成
function n_invlist_check() {
  var Interval_1 = setInterval(function () {
    document.querySelector("#download-notification-banner-kat-box > a");
    if (document.querySelector("#download-notification-banner-kat-box > a")) {
      clearInterval(Interval_1);
      document
        .querySelector(
          "#report-page-margin-style > kat-table > kat-table-body > kat-table-row:nth-child(1) > kat-table-cell:nth-child(5) > kat-button"
        )
        .shadowRoot.querySelector("button")
        .click();
    }
  }, 1500);
}
// 库存下载
function n_invlist_auto() {
  $("kat-button.download-report-page-kat-button-primary").click();
  n_invlist_check();
}
// 库龄下载
function n_invage_auto() {
  setTimeout(() => {
    document
      .querySelector(
        "#report-page-kat-box > kat-button.download-report-page-kat-button-primary"
      )
      .shadowRoot.querySelector("button")
      .click();
    n_invlist_check();
  }, 2000);
}
// 管理订单sku详情
function order_skuinfo() {
  var SKU = {};
  var href = {};
  var a = '<a href="" target="_blank"></a>';
  $("div.myo-list-orders-product-name-cell").each(function (i, obj) {
    SKU[i] = $(this)
      .find("div:nth-child(3) > div")
      .text()
      .replace("SKU:  ", "");
    href[i] =
      "https://sellercentral.amazon.com/skucentral?mSku=" +
      SKU[i] +
      "&ref=myi_skuc";
    $(this).find("div:nth-child(3) > div").append(a);
    $(this).find("div:nth-child(3) > div > a").attr("href", href[i]);
    $(this).find("div:nth-child(3) > div > a").text(SKU[i]);
  });
}
// 广告复制
function ad_copy() {
  var ad_table_btm = ".ag-floating-bottom-viewport > div > div > ";
  var baoguang = $(ad_table_btm + "div:nth-child(3)").text();
  var dianji = $(ad_table_btm + "div:nth-child(5)").text();
  var dianjiv = $(ad_table_btm + "div:nth-child(6)").text();
  var huafei = $(ad_table_btm + "div:nth-child(7)").text();
  var danci = $(ad_table_btm + "div:nth-child(8)").text();
  var dingdan = $(ad_table_btm + "div:nth-child(9)").text();
  var xiaoshou = $(ad_table_btm + "div:nth-child(10)").text();
  var acos = $(ad_table_btm + "div:nth-child(11)").text();
  // 处理多余的空格和换行
  var reg = /\s|\n/g;
  huafei = huafei.replace(reg, "");
  baoguang = baoguang.replace(reg, "");
  dianji = dianji.replace(reg, "");
  danci = danci.replace(reg, "");
  dianjiv = dianjiv.replace(reg, "");
  xiaoshou = xiaoshou.replace(reg, "");
  dingdan = dingdan.replace(reg, "");
  acos = acos.replace(reg, "");
  var zhuanhua = parseInt(dingdan) / parseInt(dianji);

  // 待添加
  copy_area.value =
    baoguang +
    "\t" +
    dianji +
    "\t" +
    dianjiv +
    "\t" +
    huafei +
    "\t" +
    zhuanhua +
    "\t" +
    dingdan +
    "\t" +
    xiaoshou +
    "\t" +
    acos;
  // copy_area.value = baoguang+"\n"+dianji+"\n"+dianjiv+"\n"+huafei+"\n"+danci+"\n"+dingdan+"\n"+xiaoshou
  copy_area.select();
  document.execCommand("copy");
}
function debug() {
  debug_text.id = "debug";
  debug_text.style.cssText = debug_css;
  document.querySelector("body").appendChild(debug_text);
}
function bug(text) {
  $("#debug").append(text);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
