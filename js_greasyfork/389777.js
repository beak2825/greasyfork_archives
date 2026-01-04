// ==UserScript==
// @name         快搭应用
// @namespace    https://yun.kujiale.com/
// @version      0.29
// @description  快搭debug工具
// @author       donghua
// @match        *.kujiale.com/pub/tool/yundesign/index*
// @match        *.kujiale.com/tool/h5/diy*
// @match        *.kujiale.com/cloud/tool/h5/diy*
// @match        *.feat.qunhequnhe.com/cloud/tool/h5/diy*
// @match        local.kujiale.com:7000/vc/flash/diy*
// @match        *.kujiale.com/pcenter/design/*/list*
// @match        */tool/h5/bim*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389777/%E5%BF%AB%E6%90%AD%E5%BA%94%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/389777/%E5%BF%AB%E6%90%AD%E5%BA%94%E7%94%A8.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function getDebugData() {
    return window._KUAIDA_DEBUG;
  }

  function getReady(readyFunc) {
    return new Promise(r => {
      let value = undefined;
      let timer = setInterval(func, 500);

      function func() {
        value = readyFunc();
        if (value !== undefined) {
          clearInterval(timer);
          r(value);
        }
      }
    });
  }

  function parseUrl() {
    let str = location.search;
    str = str.slice(1);
    const data = {};
    str.split("&").forEach(keyValuePair => {
      const [key, value] = keyValuePair.split("=");
      data[key] = decodeURIComponent(value);
    });
    return data;
  }

  function stringify(data) {
    if (typeof data === "number") return String(data);
    if (!data) return "";
    if (typeof data === "string") return data;
    let ret = [];
    for (let key in data) {
      ret.push(`${key}=${encodeURIComponent(data[key])}`);
    }
    return ret.join("&");
  }

  async function getRoom(rooms, roomId) {
    return new Promise((r, j) => {
      const room = rooms.find(t => t.id === roomId);
      r(room || { name: "未找到" });
    });
  }

  function formatRoomArea(area) {
    return Number((area / 1000000).toFixed(2));
  }


  function copy(str, successCb) {
    try {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', str);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        successCb && successCb();
    } catch (e) {
        // e
    }
  }


  function getLevelId() {
    return window.g_levelId;
  }

  function handleChildUse() {
      const searchValues = parseUrl();
      if (
        location.pathname.includes("/pcenter/design") &&
        searchValues.copyDesignId
      ) {
        // 方案详情
        fetch(
          `https://www.kujiale.com/dsample/api/design/copy?planid=${searchValues.copyDesignId}`,
          {
            method: "POST"
          }
        )
          .then(r => r.json())
          .then(resp => {
            if (resp.c !== "0") {
              alert(`复制接口报错：${resp.m}`);
              return;
            }
            const designId = resp.d.designId;
            const queries = {
              designid: designId,
              obsSampleId: searchValues.obsSampleId,
              roomId: searchValues.roomId,
              matchType: searchValues.matchType
            };
            const host = {
              beta: 'yun-beta.kujiale.com',
              prod: 'yun.kujiale.com'
            }[searchValues.env || 'beta'];
            location.href = `https://${host}/tool/h5/diy?${stringify(
            queries
          )}`;
          });
      }
    }

  function floorplanFit(params, successCb, failCb) {
    const { productFind, rooms, kuaidaSDK } = getDebugData();

    kuaidaSDK
      .apply({
        obsSampleId: params.obsSampleId,
        roomId: params.roomId,
        autofitMatchType: params.matchType,
      })
      .then(async (response) => {
        // 关联样板间失败情况
        if (response.relativeMatchFail) {
          alert(response.msg);
        }

        // 素材寻回 硬装不使用
        if (
          params.matchType !== 2 &&
          response.unAppliedProducts &&
          response.unAppliedProducts.length > 0
        ) {
          const room = await getRoom(rooms, params.roomId);
          productFind.setShow(true);
          productFind.setData(response.unAppliedProducts, [
            {
              id: params.roomId,
              name: (room && room.name) || params.roomId,
            },
          ]);
          productFind.setApplyId(response.applyId);
        } else {
          productFind.setShow(false);
        }

        successCb();
      })
      .catch((e) => {
        console.error(e);
        failCb && failCb();
        alert(e.message);
      });
  }

  const matchTypeMap = {
      0: "软硬装",
      1: "软装",
      2: "硬装",
      3: "饰品"
    };

  const container = document.createElement("div");
  container.style = `
  position: fixed;
  top: 20px;
  left: 30px;
  z-index: 99;
  background: white;
  padding: 5px;
  overflow: hidden;
`;

  container.innerHTML = `
  <span style="cursor: pointer;" id="kuaida-debug-toggle">收起</span> 
`;

  function* getHeight() {
    let i = 0;
    while (true) {
      const num = i % 2;
      i++;
      yield {
        0: "25px",
        1: "auto"
      }[num];
    }
  }
  const height = getHeight();

  let isAppened = false;
  function getContainer() {
    if (!isAppened) {
      document.body.appendChild(container);
      isAppened = true;

      document
        .getElementById("kuaida-debug-toggle")
        .addEventListener("click", () => {
          container.style.height = height.next().value;
        });
    }
    return container;
  }

  function handleAutofit() {
    const searchValues = parseUrl();
    getReady(() => {
      const data = getDebugData();
      if (data && data.rooms && data.rooms.length) {
        return data;
      }
    }).then(async debugData => {
      const { roomId, obsSampleId, matchType } = searchValues;
      const { rooms=[] } = debugData;
      const room = await getRoom(rooms, roomId);

      const el = document.createElement("div");
      let hasAppended = false;
      function getYuntuApp(params) {
        el.innerHTML = `
        <p>obsSampleId: ${obsSampleId}</p>
        <p>roomId: ${roomId} 房间: ${room.name} 面积：${formatRoomArea(
        room.area
      )}</p>
        <p>应用类型: ${matchTypeMap[matchType]}</p>
        <button id="kuaida-debug-btn" >${params.buttonText}</button>
        <p>${params.statusText}</p>
        <p>
          <a style="text-decoration: underline;" target="_blank" href="https://tetris.qunhequnhe.com/d/1024?c.tid=${
            params.hunterid
          }">${params.hunterid ? "查看hunter日志" : ""}</a>
        </p>
      `;
        if (!hasAppended) {
          hasAppended = true;
          getContainer().appendChild(el);
        }
        setTimeout(() => {
          document
            .querySelector("#kuaida-debug-btn")
            .addEventListener("click", apply);
        }, 0);
      }

      function apply() {
        getYuntuApp({
          statusText: "",
          buttonText: "应用中..."
        });

        floorplanFit(
          searchValues,
          () => {
            const hunterid = debugData.autofitHunterid;
            getYuntuApp({
              statusText: "应用完成",
              buttonText: "应用",
              hunterid
            });
          },
          () => {
            const hunterid = debugData.autofitHunterid;
            getYuntuApp({
              statusText: "应用失败",
              buttonText: "应用",
              hunterid
            });
          }
        );
      }

      if (roomId && matchType) {
        getYuntuApp({
          statusText: "",
          buttonText: "应用"
        });
      }
    });
  }

  function assistant() {
    getReady(() => {
      const data = getDebugData();
      if (data && data.rooms && data.rooms.length) {
        return data;
      }
    }).then(debugDaga => {
      const searchValues = parseUrl();
      const { rooms=[] } = debugDaga;
      const levelId = getLevelId();

      const el = document.createElement("div");
      el.innerHTML = `
            </br>
            <div>
                <p>
                房间：
                <select id="kuaida-debug-roomId">
                    ${rooms.map(
                      r =>
                        `<option ${
                          searchValues.roomId === r.id ? "selected" : ""
                        } value="${r.id}">${r.name} ${r.id}</option>`
                    )}
                </select>
                </p>
                <p>
                应用类型：
                <select id="kuaida-debug-matchType">
                    ${Object.keys(matchTypeMap).map(
                      type =>
                        `<option  ${
                          searchValues.matchType === type ? "selected" : ""
                        } value="${type}">${matchTypeMap[type]}</option>`
                    )}
                </select>
                </p>
                <p>
                obsSampleId：
                    <input id="kuaida-debug-obsSampleId" value="${searchValues.obsSampleId ||
                      ""}"/>
                </p>

                <p>
                <button id="kuaida-debug-copy">复制</button>
                </p>
            </div>
            </br>
        `;
      getContainer().appendChild(el);
      document
        .getElementById("kuaida-debug-copy")
        .addEventListener("click", () => {
          const roomId = document.getElementById("kuaida-debug-roomId").value;
          const matchType = document.getElementById("kuaida-debug-matchType")
            .value;
          const obsSampleId = document.getElementById("kuaida-debug-obsSampleId")
            .value;
          const params = {
            obsSampleId,
            levelId,
            obsDesignId: window.g_designId,
            roomId,
            lang: "zh_CN",
            obsUserId: window.g_flashCfg.appConfig.userConfig.userId,
            autofitMatchType: matchType,
            obsRelativeSampleRoomIds: []
          };

          console.log(params);
          copy(JSON.stringify(params, null, 2), () => {
            alert("复制成功");
          });
        });
    });
  }

  // 标识需要debug
  window.jlfajkdjfklsdjl = true;

  (function() {
    // 子账号复现
    handleChildUse();
    // 快速应用
    handleAutofit();
    // 辅助功能
    assistant();
  })();

}());
