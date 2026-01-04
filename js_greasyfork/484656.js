// ==UserScript==
// @name         automatic evaluation
// @namespace    http://tampermonkey.net/
// @version      2024-01-15.1
// @description  automatic evaluation zjzwfw.gov.cn
// @author       Melancholy
// @license      MIT
// @match        https://zwdc.zjzwfw.gov.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/tesseract.js/4.1.2/tesseract.min.js
// @require      https://cdn.bootcss.com/axios/1.5.0/axios.js
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/uuid/8.3.2/uuid.min.js
// @downloadURL https://update.greasyfork.org/scripts/484656/automatic%20evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/484656/automatic%20evaluation.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const BASE_URL = "https://zwdc.zjzwfw.gov.cn/sxzhdcserver";

  const operatePanel = $("<div class='operate-panel'>").css({
    position: "fixed",
    right: "100px",
    top: "100px",
    width: "200px",
    "background-color": "#fff",
    border: "1px solid #ccc",
    "border-radius": "5px",
    padding: "10px",
    "box-shadow": "0 0 10px #ccc",
    "z-index": 999999,
    lineHeight: 1.6,
  });

  const statusText = $("<div class='status'>状态: 未开始</div>");
  const successCount = $("<div class='success-count'>成功次数: 0</div>");
  const failCount = $("<div class='fail-count'>失败次数: 0</div>");
  const btnStyle = {
    width: "50px",
    height: "30px",
    "font-size": "16px",
    "font-weight": "bold",
    "background-color": "#007ACC",
    color: "#fff",
    border: "none",
    textAlign: "center",
    lineHeight: "30px",
    borderRadius: "5px",
    marginTop: "10px",
  };

  const startBtn = $("<button class='start-btn'>开始</button>")
    .css(btnStyle)
    .click(start);

  const pauseBtn = $("<button class='pause-btn'>暂停</button>")
    .css({
      ...btnStyle,
      "margin-left": "10px",
    })
    .click(pause);

  const btns = $("<div class='btns'>")
    .css({
      display: "flex",
      alignItems: "center",
    })
    .append(startBtn, pauseBtn);

  operatePanel.append(statusText, successCount, failCount, btns);
  $(".foot").append(operatePanel);

  let timer = null;

  const commonParams = {
    type: 2,
    grade: 10,
    user: 0,
    szs: "台州市",
    szqx: "三门县",
  };
  const items = [
    {
      ...commonParams,
      resourceId: "CH0015641",
      reportId: 1119,
      countyCode: "006009016005016001",
      code: "bdyn",
      uuid: "a9f95f37-c8e2-494f-8746-df84565ac3db",
    },
    {
      ...commonParams,
      resourceId: "CH0015641",
      reportId: 997,
      countyCode: "006009016005016001",
      code: "bdyn",
      uuid: "a9f95f37-c8e2-494f-8746-df84565ac3db",
    },
    {
      ...commonParams,
      resourceId: "CH0015641",
      reportId: 1111,
      countyCode: "006009016005016001",
      code: "bdyn",
      uuid: "a9f95f37-c8e2-494f-8746-df84565ac3db",
    },
    {
      ...commonParams,
      resourceId: "CH0015643",
      reportId: 98,
      countyCode: "006009016005",
      code: "bdyn",
      uuid: "a9f95f37-c8e2-494f-8746-df84565ac3db",
    },
    {
      ...commonParams,
      resourceId: "CH0015695",
      reportId: 278,
      countyCode: "006009016005016009",
      code: "bdyn",
      uuid: "a9f95f37-c8e2-494f-8746-df84565ac3db",
    },
  ];

  async function initialItems() {
    const promises = [];

    for (let i = 0; i < items.length; i++) {
      promises.push(
        new Promise(async (resolve) => {
          const nocache = new Date().getTime() + Math.random();
          const uuidv4 = uuid.v4();

          let code = "";
          try {
            const res = await axios({
              method: "get",
              url: `${BASE_URL}/PictureCheckCode?nocache=${nocache}&username=${uuidv4}`,
              responseType: "blob",
              timeout: 5000,
            });

            const ret = await Tesseract.recognize(res.data, "eng", {});
            code = ret.data.text.replace(/\s+/, "").match(/[a-zA-Z0-9]*/)[0];
          } catch (error) {
            console.error(error, "error");
          } finally {
            resolve({
              ...items[i],
              code,
              uuid: uuidv4,
            });
          }
        })
      );
    }

    return await Promise.all(promises);
  }

  let isPause = false;

  async function start() {
    if (isPause) {
      isPause = false;
      return;
    }

    statusText.text("状态: 进行中");
    const paramsList = await initialItems();
    const promises = [];

    paramsList.forEach(async (params) => {
      promises.push(
        new Promise(async (resolve) => {
          try {
            const res = await axios.post(
              BASE_URL + "/rest/evaluate/api/project/save",
              params,
              {
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                },
                timeout: 5000,
              }
            );

            if (res.data.code !== 0) {
              successCount.text(
                `成功次数: ${Number(successCount.text().split(":")[1]) + 1}`
              );
            } else {
              failCount.text(
                `失败次数: ${Number(failCount.text().split(":")[1]) + 1}`
              );
            }
            resolve(res.data);
          } catch (error) {
          } finally {
            resolve();
          }
        })
      );
    });

    Promise.all(promises).then((values) => {
      console.log(values);
      start();
    });
  }
  function pause() {
    statusText.text("状态: 已暂停");
    isPause = true;
  }
})();
