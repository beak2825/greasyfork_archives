// ==UserScript==
// @name         数银_自定义人群分析报告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  数银扩展工具
// @author       siji-Xian
// @match        *://databank.tmall.com*
// @include      /^https?:\/\/databank\.tmall\.com\/#\/customAnalysisReport\?/
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/474276/%E6%95%B0%E9%93%B6_%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90%E6%8A%A5%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/474276/%E6%95%B0%E9%93%B6_%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90%E6%8A%A5%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (
    location.href.startsWith(
      "https://databank.tmall.com/#/customAnalysisReport?"
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

    function appendDoc() {
      const likeComment = document.querySelector(".dt-oui-tabs-nav-wrap");
      if (likeComment) {
        document.body.appendChild(new_element);
        likeComment.append(button2);
        likeComment.append(button);
        return;
      }
      setTimeout(appendDoc, 1000);
    }
    appendDoc();

    function getDate() {
      let date = document.querySelector(
        ".dt-oui-picker.dt-oui-picker-small.dt-oui-date-picker.dt-oui-picker-bg-normal .dt-oui-picker-input input"
      ).value;
      return moment(date).format("YYYYMMDD");
    }

    function getCrowdIdFromHash() {
      let url = new URL(window.location.href);
      let hash = url.hash;
      hash = hash.slice(23);
      let searchParams = new URLSearchParams(hash);
      let crowdId = searchParams.get("crowdId");
      return crowdId;
    }
    let crowdId = getCrowdIdFromHash();
    // 消息队列
    let tableList = [];

    //level1
    let level1Touch = null;

    function wsClick() {
      let date = getDate();
      // 调用函数获取 crowdId 的值
      tableList = []

      let data = {
        method: "/queryDataService/queryDataOnWidget",
        headers: {
          rid: "169338654923136",
          type: "PULL",
        },
        body: {
          args: {
            referer: "databank-customAnalysisReport",
            id: "935209",
            isMock: 0,
            whatIfParam: {
              widgetParamList: [],
              customParamList: [],
            },
            widgetSelections: null,
            selections: [
              {
                dimensionName: "theEqDate",
                restrictList: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: date,
                  },
                ],
                eq: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: date,
                  },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: date,
              },
              {
                dimensionName: "theDate",
                restrictList: [
                  {
                    hide: 1,
                    oper: "le",
                    value: date,
                  },
                  {
                    hide: 1,
                    oper: "ge",
                    value: "20230601",
                  },
                ],
                eq: null,
                lt: null,
                gt: null,
                ge: [
                  {
                    hide: 1,
                    oper: "ge",
                    value: "20230601",
                  },
                ],
                le: [
                  {
                    hide: 1,
                    oper: "le",
                    value: date,
                  },
                ],
                ne: null,
                showText: `${getDate()}, 20230601`,
              },
              {
                dimensionName: "level1TouchId",
                restrictList: [
                  {
                    showName: "付费广告",
                    hide: 1,
                    oper: "eq",
                    value: "8",
                  },
                ],
                eq: [
                  {
                    showName: "付费广告",
                    hide: 1,
                    oper: "eq",
                    value: "8",
                  },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "付费广告",
              },
              {
                dimensionName: "crowdId",
                restrictList: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: crowdId,
                  },
                ],
                eq: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: crowdId,
                  },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: crowdId,
              },
            ],
            rdPathInfoList: [],
            appId: "6",
          },
        },
      };

      let data1 = {
        method: "/queryDataService/queryDataOnWidget",
        headers: {
          rid: "169338654923543",
          type: "PULL",
        },
        body: {
          args: {
            referer: "databank-customAnalysisReport",
            id: "935208",
            isMock: 0,
            whatIfParam: {
              widgetParamList: [],
              customParamList: [],
            },
            widgetSelections: null,
            selections: [
              {
                dimensionName: "theEqDate",
                restrictList: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: date,
                  },
                ],
                eq: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: date,
                  },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: date,
              },
              {
                dimensionName: "theDate",
                restrictList: [
                  {
                    hide: 1,
                    oper: "le",
                    value: date,
                  },
                  {
                    hide: 1,
                    oper: "ge",
                    value: "20230601",
                  },
                ],
                eq: null,
                lt: null,
                gt: null,
                ge: [
                  {
                    hide: 1,
                    oper: "ge",
                    value: "20230601",
                  },
                ],
                le: [
                  {
                    hide: 1,
                    oper: "le",
                    value: date,
                  },
                ],
                ne: null,
                showText: `${getDate()}, 20230601`,
              },
              {
                dimensionName: "level1TouchId",
                restrictList: [
                  {
                    showName: "付费广告",
                    hide: 1,
                    oper: "eq",
                    value: "8",
                  },
                ],
                eq: [
                  {
                    showName: "付费广告",
                    hide: 1,
                    oper: "eq",
                    value: "8",
                  },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: "付费广告",
              },
              {
                dimensionName: "crowdId",
                restrictList: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: crowdId,
                  },
                ],
                eq: [
                  {
                    hide: 1,
                    oper: "eq",
                    value: crowdId,
                  },
                ],
                lt: null,
                gt: null,
                ge: null,
                le: null,
                ne: null,
                showText: crowdId,
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
        socket.send(JSON.stringify(data));
      };

      // 监听接收消息事件
      socket.onmessage = function (event) {
        let eventData = JSON.parse(event.data);
        let ed = eventData.body.axises[0];
        if (ed.name === "level1TouchId") {
          level1Touch = ed.values;
          ed.values.map((v) => {
            data1.headers.rid = v.key;
            data1.body.args.selections[2].restrictList[0].showName = v.showName;
            data1.body.args.selections[2].restrictList[0].value = v.key;
            data1.body.args.selections[2].eq[0].showName = v.showName;
            data1.body.args.selections[2].eq[0].value = v.key;
            data1.body.args.selections[2].showText = v.showName;
            // 在连接成功后发送消息
            socket.send(JSON.stringify(data1));
          });
        } else if (ed.name === "level2TouchId") {
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
      let mapData = new Map(
        e.map((item) => {
          let value = item.body.axises[0].values.map((v, i) => {
            return { key: v.showName, value: item.body.datas[0].values[i] };
          });
          return [item.headers.rid, value];
        })
      );
      let expData = level1Touch.map((v) => {
        return { key: v.showName, value: mapData.get(v.key) };
      });

      console.log(expData);

      let contrast = {
        '触点':'key',
        '值':'value'
      };

      let option = {};
      option.fileName = "数银"; //文件名
      option.datas = expData.map((v)=>{
        return {
            sheetName: v.key,
            sheetData: v.value.length?v.value:[{}],
            sheetHeader: Object.keys(contrast),
            sheetFilter: Object.values(contrast),
            columnWidths: [], // 列宽
          }
      })
      
      var toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
      loadingMsg.close();
    }

    function urlClick() {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(tableList);
    }
  }
})();
