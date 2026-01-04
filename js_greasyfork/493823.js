// ==UserScript==
// @name         小桔慧充
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://huichong.xiaojukeji.com/business/orderSettlementSearch*
// @icon         https://pt-starimg.didistatic.com/static/starimg/img/co8IEQt35o1649667033471.png
// @grant        GM.xmlHttpRequest
// @grant        GM_cookie
// @connect      *
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://update.greasyfork.org/scripts/493822/1368643/xlsxjs.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/493823/%E5%B0%8F%E6%A1%94%E6%85%A7%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/493823/%E5%B0%8F%E6%A1%94%E6%85%A7%E5%85%85.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出数据";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "#FFF",
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    margin: "0 10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick);

  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //message.js
  let loadingMsg = null;

  let target_data = null;
  let res_data = null;

  (function listen() {
    var origin = {
      open: XMLHttpRequest.prototype.open,
      send: XMLHttpRequest.prototype.send,
    };
    XMLHttpRequest.prototype.open = function (a, b) {
      this.addEventListener("load", replaceFn);
      origin.open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (a, b) {
      origin.send.apply(this, arguments);
    };
    function replaceFn(obj) {
      if (
        this?.responseURL?.slice(0, 64) ==
        "https://gw.am.xiaojukeji.com/epower-atreus/api/user/station/list"
      ) {
        target_data = obj?.target?.response;
      }
      if (
        this?.responseURL?.slice(0, 68) ==
        "https://gw.am.xiaojukeji.com/aegis-bill-biz/smc/statement/summary/v2"
      ) {
        res_data = obj?.target?.responseURL;
      }
    }
  })();

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelector(".sc-klVQfs.hQWuCe");
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  function getQueryVariable(url) {
    var query = url.substring(69);
    const params = Object.fromEntries(new URLSearchParams(query).entries());
    return params;
  }

  function objectToQueryString(obj) {
    return Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      )
      .join("&");
  }

  function exportToExcel(data, headerAliases, fileName = "output.xlsx") {
    // 获取字段名数组
    const headers = Object.keys(data[0]);

    // 创建工作表
    const sheet = XLSXS.utils.json_to_sheet(data, {
      header: headers,
      skipHeader: false,
    });

    // 替换表头别名
    headers.forEach((header, index) => {
      if (headerAliases[header]) {
        sheet[XLSXS.utils.encode_cell({ r: 0, c: index })].v =
          headerAliases[header];
      }
    });

    // 创建工作簿
    const workbook = XLSXS.utils.book_new();
    XLSXS.utils.book_append_sheet(workbook, sheet, "Sheet1");

    // 将工作簿保存为 Excel 文件
    XLSXS.writeFile(workbook, fileName);

    loadingMsg.close();
  }
  let contrast = {
    name: "站点",
    totalAmount: "订单总额",
    chargeAmount: "充电电量",
    orderServAmount: "充电服务费",
  };

  function listCookies(e) {
    return new Promise((resolve, reject) => {
      GM_cookie.list({ name: e }, (cookies, error) => {
        if (!error && cookies && cookies.length > 0) {
          resolve(cookies[0].value);
        } else {
          reject(error || "No cookies found");
        }
      });
    });
  }

  async function getData(data) {
    let params = getQueryVariable(res_data);

    let cookieStr = await listCookies("ticket");

    let resData = await Promise.all(
      data?.data?.map(async (v) => {
        let p = {
          ...params,
          stationId: v.fullStationId,
          fullStationId: v.fullStationId,
        };

        const queryString = objectToQueryString(p);

        const r = await GM.xmlHttpRequest({
          method: "GET",
          url: `https://gw.am.xiaojukeji.com/aegis-bill-biz/smc/statement/summary/v2?${queryString}`,
          anonymous: true,
          cookie: cookieStr,
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            Connection: "keep-alive",
            Cookie: cookieStr,
            Origin: "https://huichong.xiaojukeji.com",
            Referer:
              "https://huichong.xiaojukeji.com/business/orderSettlementSearch",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            env: "pc",
            "sec-ch-ua":
              '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
          },
        }).catch((e) => console.error(e));
        let res = JSON.parse(r.response).data.orderDTO;

        return {
          name: v.name,
          totalAmount: res.totalAmount, //订单总额
          chargeAmount: res.chargeAmount, //充电电量
          orderServAmount: res.orderServAmount, //充电服务费
        };
      })
    );

    exportToExcel(
      resData,
      contrast,
      "小桔慧充" + "_" + moment().format("YYYY-MM-DD HH:mm:ss") + ".xlsx"
    );
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
