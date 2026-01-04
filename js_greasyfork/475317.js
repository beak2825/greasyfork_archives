// ==UserScript==
// @name         数银_全链路分析
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  数银扩展工具
// @author       siji-Xian
// @match        *://databank.tmall.com*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/475317/%E6%95%B0%E9%93%B6_%E5%85%A8%E9%93%BE%E8%B7%AF%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/475317/%E6%95%B0%E9%93%B6_%E5%85%A8%E9%93%BE%E8%B7%AF%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (
    location.href.startsWith(
      "https://databank.tmall.com/#/fullLinkDistribution"
    )
  ) {
    var new_element = document.createElement("link");
    new_element.setAttribute("rel", "stylesheet");
    new_element.setAttribute(
      "href",
      "https://qmsg.refrain.xyz/message.min.css"
    );

    const button = document.createElement("div");
    button.textContent = "导出数据";
    Object.assign(button.style, {
      height: "34px",
      lineHeight: "var(--line-height, 34px)",
      alignItems: "center",
      color: "white",
      background:
        "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
      borderRadius: "5px",
      marginLeft: "10px",
      fontSize: "13px",
      padding: "0 10px",
      cursor: "pointer",
      fontWeight: "500",
    });
    button.addEventListener("click", urlClick);

    const button2 = document.createElement("div");
    button2.textContent = "创建WS连接";
    Object.assign(button2.style, {
      height: "34px",
      lineHeight: "var(--line-height, 34px)",
      alignItems: "center",
      color: "white",
      background:
        "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
      borderRadius: "5px",
      marginLeft: "10px",
      fontSize: "13px",
      padding: "0 10px",
      cursor: "pointer",
      fontWeight: "500",
    });
    button2.addEventListener("click", wsClick);

    const getRequestOptions = {
      method: "GET",
      redirect: "follow",
    };

    async function fetchFun(url, data, requestOptions = getRequestOptions) {
      const params = new URLSearchParams(data).toString();
      try {
        const response = await fetch(`${url}?${params}`, requestOptions);
        if (response.ok) {
          const result = await response.json();
          return result;
        } else {
          throw new Error(`Fetch failed: ${response.status}`);
        }
      } catch (error) {
        loadingMsg.close();
        Qmsg.error({
          content: `网络请求错误: ${error.message}`,
          timeout: 5000,
        });
        throw error;
      }
    }

    function appendDoc() {
      const likeComment = document.querySelector(".databank-ceiling-bar");
      if (likeComment) {
        document.body.appendChild(new_element);
        likeComment.append(button2);
        likeComment.append(button);
        return;
      }
      setTimeout(appendDoc, 1000);
    }
    appendDoc();

    function getCrowdIdFromHash() {
      let url = new URL(window.location.href);
      let hash = url.hash;
      hash = hash.slice(23);
      let searchParams = new URLSearchParams(hash);
      let crowdId = searchParams.get("crowdId");
      return crowdId;
    }
    // 消息队列
    let tableList = [];
    let zongList = []

    //处理日期
    async function getDateRange(startDate, endDate) {
      const dateArray = [];
      const currentDate = moment(startDate);
      const lastDate = moment(endDate);

      while (currentDate <= lastDate) {
        dateArray.push(currentDate.format("YYYYMMDD"));
        currentDate.add(1, "days");
      }

      return dateArray;
    }
    let dates = [];

    async function getData(thedate) {
      const zong = await fetchFun(
        "https://databank.tmall.com/api/ecapi",
        {
          thedate,
          path: '/datatable/fulllink/'
        }
      );
      return zong?.data[1].uv
    }

    async function wsClick() {
      try {
        let res = prompt(
          "日期，例: 20230511,20230521 （起始页和结束页中间用英文逗号分隔）"
        );
        if (res) {
          let [startPage, endPage] = res.split(",");
          let startPageInt = parseInt(startPage);
          let endPageInt = parseInt(endPage);
          if (isNaN(startPageInt) || isNaN(endPageInt) || endPage < startPage) {
            throw new Error("日期格式错误！");
          }
          dates = await getDateRange(startPage, endPage);
        }
      } catch (err) {
        Qmsg.error(err.message);
      }
      // 调用函数获取 crowdId 的值
      tableList = [];

      // 获取总数值数据
      zongList = await Promise.all(dates.map(async v=>{
        return {key:v,value:await getData(v)}
      }))

      let data = {
        method: "/queryDataService/queryDataOnWidget",
        headers: { rid: "1694746656769012", type: "PULL" },
        body: {
          args: {
            referer: "databank-fullLinkDistribution",
            id: "892669",
            isMock: 0,
            whatIfParam: { widgetParamList: [], customParamList: [] },
            widgetSelections: null,
            selections: [
              {
                dimensionName: "cateId",
                restrictList: [{ hide: 1, oper: "eq", value: "-99" }],
                eq: [{ hide: 1, oper: "eq", value: "-99" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "-99",
              },
              {
                dimensionName: "brandId",
                restrictList: [{ hide: 1, oper: "eq", value: "3949661" }],
                eq: [{ hide: 1, oper: "eq", value: "3949661" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "3949661",
              },
              {
                dimensionName: "searchKeyword",
                restrictList: [{ hide: 1, oper: "eq", value: "" }],
                eq: [{ hide: 1, oper: "eq", value: "" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "",
              },
              {
                dimensionName: "buyRecency",
                restrictList: [
                  { hide: 1, oper: "eq", value: "1", showName: "<=1天" },
                ],
                eq: [{ hide: 1, oper: "eq", value: "1", showName: "<=1天" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "<=1天",
              },
              {
                dimensionName: "statusId",
                restrictList: [
                  { hide: 1, oper: "eq", value: "1020", showName: "兴趣" },
                ],
                eq: [{ hide: 1, oper: "eq", value: "1020", showName: "兴趣" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "兴趣",
              },
              {
                dimensionName: "theDate",
                restrictList: [{ hide: 1, oper: "eq", value: "20230914" }],
                eq: [{ hide: 1, oper: "eq", value: "20230914" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "20230914",
              },
              {
                dimensionName: "ds",
                restrictList: [
                  { hide: 1, oper: "le", value: "20230914" },
                  { hide: 1, oper: "ge", value: "undefined" },
                ],
                eq: null,
                lt: null,
                gt: null,
                ge: [{ hide: 1, oper: "ge", value: "undefined" }],
                le: [{ hide: 1, oper: "le", value: "20230914" }],
                ne: null,
                showText: "20230914, undefined",
              },
              {
                dimensionName: "isAll",
                restrictList: [{ hide: 1, oper: "eq", value: "1" }],
                eq: [{ hide: 1, oper: "eq", value: "1" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "1",
              },
              {
                dimensionName: "level1TouchId",
                restrictList: [
                  { hide: 1, oper: "eq", value: "8", showName: "付费广告" },
                ],
                eq: [{ hide: 1, oper: "eq", value: "8", showName: "付费广告" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "付费广告",
              },
              {
                dimensionName: "departmentType",
                restrictList: [
                  { hide: 1, oper: "eq", value: "EC", showName: "部门版本" },
                ],
                eq: [
                  { hide: 1, oper: "eq", value: "EC", showName: "部门版本" },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "部门版本",
              },
              {
                dimensionName: "commodityAnalysis",
                restrictList: [
                  { hide: 1, oper: "eq", value: "true", showName: "商品权限" },
                ],
                eq: [
                  { hide: 1, oper: "eq", value: "true", showName: "商品权限" },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "商品权限",
              },
              {
                dimensionName: "env",
                restrictList: [
                  { hide: 1, oper: "eq", value: "//databank.tmall.com" },
                ],
                eq: [{ hide: 1, oper: "eq", value: "//databank.tmall.com" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "//databank.tmall.com",
              },
              {
                dimensionName: "itemTag",
                restrictList: [
                  { hide: 1, showName: "全部", value: "-999", oper: "eq" },
                ],
                eq: [{ hide: 1, showName: "全部", value: "-999", oper: "eq" }],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "全部",
              },
            ],
            rdPathInfoList: [],
            appId: "6",
          },
        },
      };

      // 创建 WebSocket 连接
      const socket = new WebSocket("wss://ws-insight-engine.tmall.com/");

      // 监听连接成功事件
      socket.onopen = function (event) {
        console.log("WebSocket 连接已建立", new Date());
        Qmsg.info("WebSocket 连接已建立");
        // 在连接成功后发送消息
        dates.forEach((v) => {
          data.headers.rid = v;
          data.body.args.selections[5].restrictList[0].value = v;
          data.body.args.selections[5].eq[0].value = v;
          data.body.args.selections[5].showText = v;
          data.body.args.selections[6].restrictList[0].value = v;
          data.body.args.selections[6].le[0].value = v;

          socket.send(JSON.stringify(data));
        });
      };

      // 监听接收消息事件
      socket.onmessage = function (event) {
        let eventData = JSON.parse(event.data);
        if (eventData?.body?.axises.length==1 && eventData?.body?.datas.length==2 ) {
          tableList.push(eventData);
        }
      };

      // 监听连接关闭事件
      socket.onclose = function (event) {
        console.log("WebSocket 连接已关闭", new Date());
        // 在此处进行连接关闭后的处理
        Qmsg.info("WebSocket 连接已关闭");
      };

      // 监听发生错误事件
      socket.onerror = function (error) {
        console.error("WebSocket 发生错误:", error);
        // 在此处处理错误
        Qmsg.info("WebSocket 发生错误");
      };
    }

    //message.js
    let loadingMsg = null;

    function expExcel(e) {
      console.log(e)
      let mapData = new Map(
        e.map((item) => {
          let value = item.body.axises[0].values.map((v, i) => {
            return {
              key: v.showName,
              value: [
                item.body.datas[0].values[i],
                item.body.datas[1].values[i],
              ],
            };
          });
          return [item.headers.rid, value];
        })
      );
      let mapData2 = new Map(
        zongList.map((v) => {
          return [v.key,v.value]
        })
      )
      console.log(mapData2)

      let expData = dates.map((v) => {
        return {
          key: v,
          value: mapData2.get(v),
          value1: mapData.get(v)[0].value[0],
          value2: mapData.get(v)[0].value[1],
        };
      });

      let contrast = {
        日期: "key",
        num:'value',
        搜索占比: "value1",
        行业均值: "value2",
      };

      let option = {};
      option.fileName = "数银_全链路分析"; //文件名
      option.datas = [
        {
          sheetName: "",
          sheetData: expData,
          sheetHeader: Object.keys(contrast),
          sheetFilter: Object.values(contrast),
          columnWidths: [], // 列宽
        },
      ];

      var toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
      loadingMsg.close();
    }

    function urlClick() {
      if (tableList.length) {
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        expExcel(tableList);
      }else{
        Qmsg.warning("请先创建ws链接！");
      }

    }
  }
})();
