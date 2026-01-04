// ==UserScript==
// @name         抢座位(二楼)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  如果当前时间小于可以抢座位时间，则会启动定时任务（定时任务不要设置过长，可能不准确）。如果当前时间大于等于可抢座时间，及开始抢座。
// @author       yhs
// @match        https://libic.sicnu.edu.cn/ClientWeb/xcus/ic2/Default.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433382/%E6%8A%A2%E5%BA%A7%E4%BD%8D%28%E4%BA%8C%E6%A5%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433382/%E6%8A%A2%E5%BA%A7%E4%BD%8D%28%E4%BA%8C%E6%A5%BC%29.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const checkedArr = JSON.parse(localStorage.getItem("checkedMemo") || "[]");
  // 并发量设置为6；
  const maxRequestNumber = 6;
  // 全局事件
  /**
   * checkbox 事件
   *
   * 1. 改变状态
   * 2. 更新本地缓存
   * @param {InputEvent} event
   */
  window.seat_checkChange = function (event) {
    const index = event.target.dataset.id;
    const value = event.target.checked;
    checkedArr[index] = value;
    localStorage.setItem("checkedMemo", JSON.stringify(checkedArr));
  };
  (async function () {
    await import("https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/dayjs.min.js");
    const sendRequestCreator = () => {
      let index = 0;
      let fulfilled = false;
      let pendingRequest = 0;
      const failHandler = (err, startTime, endTime) => {
        console.log(err);
        pendingRequest--;
        run(startTime, endTime);
      };

      const doneHandler = (data, targetEntry, startTime, endTime) => {
        console.log(data);
        const input = document.getElementById(targetEntry[0]);
        if (data.includes("成功")) {
          // 成功案例
          input &&
            (input.parentElement.parentElement.style.background = "green");
          fulfilled = true;
          document.getElementById("start").disabled = false;
          return;
        }
        if (data.includes("已有")) {
          input && (input.parentElement.parentElement.style.background = "red");
          !fulfilled && alert(`已有预约: ${JSON.parse(data).msg}`);
          fulfilled = true;
          document.getElementById("start").disabled = false;
          return;
        }
        if (["CONFLICT"].some((e) => data.includes(e))) {
          // 错误案例
          input && (input.parentElement.parentElement.style.background = "red");
          pendingRequest--;
          run(startTime, endTime);
          return;
        }

        !fulfilled && alert(`发生错误：${JSON.parse(data).msg}`);
        fulfilled = true;
        document.getElementById("start").disabled = false;
      };
      function run(startTime, endTime) {
        while (
          pendingRequest < maxRequestNumber &&
          index < seatMapEntries.length &&
          !fulfilled
        ) {
          const targetEntry = seatMapEntries[index];
          const isChecked = checkedArr[index];
          index++;
          if (!isChecked) continue;
          pendingRequest++;
          const url = `https://libic.sicnu.edu.cn/ClientWeb/pro/ajax/reserve.aspx?start=${startTime}&end=${endTime}`;
          $.ajax(url, {
            data: {
              dev_id: targetEntry[1],
              type: "dev",
              act: "set_resv",
              _: Date.now(),
            },
          })
            .done((data) => doneHandler(data, targetEntry, startTime, endTime))
            .fail((err) => failHandler(err, startTime, endTime));
        }
      }

      return run;
    };
    // 二楼的座位数据
    const seatMapEntries = Array.from({ length: 144 }).map((e, i) => [
      `A${2001 + i}`,
      `${102171982 + i}`,
    ]);

    const template = `
<div>
  <div
    id="expand"
    style="
      position: fixed;
      top: 100px;
      left: 100px;
      background: #fff;
      padding: 1em;
      border-radius: 50%;
      z-index: 9999;
      overflow: auto;
      display: none;
    "
  >
    展开
  </div>
  <div
    id="seat-main"
    style="
      position: fixed;
      top: 100px;
      left: 100px;
      background: #fff;
      padding: 1em;
      border-radius: 4px;
      z-index: 9999;
      height: 500px;
      overflow: auto;
    "
  >
    <button style="
      position: absolute;
      right: 0;
      transform: translateX(-50%);
    " id="close-button">x</button>
    <div>
      <h3>抢座位<small> 注意：定时不要太长，登录可能过期</small></h3>
      <button class="btn btn-primary" id="start">开始占座</button>
    </div>
    <div style="margin: 1em 0">
      <input type="date" id="input-date" value=${new dayjs()
        .add(1, "day")
        .format("YYYY-MM-DD")}>
      <input type="time" id="input-time-start" value="07:00" />
      <input type="time" id="input-time-end" value="22:00" } />
    </div>
    <div
      class="wrapper"
      style="
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-column-gap: .5em;
        grid-row-gap: 0.5em;
      "
      onchange="seat_checkChange(event)"
    >
      ${seatMapEntries
        .map(
          (e, i) => `
      <div style="border: 1px solid black; padding: 0.5em; border-radius: 2px">
        <label>
          ${e[0]}
          <input class="checkbox" data-id=${i} type="checkbox" ${
            checkedArr[i] ? "checked" : ""
          } id="${e[0]}" />
        </label>
      </div>
      `
        )
        .join("")}
    </div>
  </div>
</div>
  `;
    const dom = new DOMParser().parseFromString(template, "text/html");
    document.body.appendChild(dom.body.firstChild);

    document.getElementById("start").addEventListener("click", (e) => {
      console.log("开始占座");
      // 重置样式
      seatMapEntries.forEach((e) => {
        const dom = document.getElementById(e[0]);
        if (!dom) return;
        dom.parentElement.parentElement.style.background = "";
      });
      const date = document.getElementById("input-date").value;
      const start = document.getElementById("input-time-start").value;
      const end = document.getElementById("input-time-end").value;
      const sendRequest = sendRequestCreator();

      // 判断时间，决定定时
      const planDate = new dayjs(date);
      const nowDate = new dayjs();
      const disTime = planDate.subtract(nowDate).valueOf();
      // 时间超过两天
      if (disTime > 86400000 * 2) {
        alert(`当前距离开启占座时间过长`);
        return;
      }
      // 7点以前
      const dateString = planDate.add(-1, "day").format("YYYY-MM-DD");
      const BeforeDay7 = new dayjs(`${dateString} 07:00:00`);
      if (disTime > 8640000 && nowDate.isBefore(BeforeDay7)) {
        e.target.disabled = true;
        let time = BeforeDay7.subtract(nowDate).valueOf();
        setTimeout(() => {
          sendRequest(`${date}+${start}`, `${date}+${end}`);
        }, time);

        // 设置一个展示剩余时间
        const interval = setInterval(() => {
          time -= 1000;
          if (time < 0) {
            e.target.innerText = "开始抢票";
            clearInterval(interval);
            return;
          }
          e.target.innerText = `还剩${Math.round(time / 1000)}秒到7点`;
        }, 1000);
        return;
      }

      sendRequest(`${date}+${start}`, `${date}+${end}`);
    });

    // 展开和关闭按钮
    document.getElementById("expand").addEventListener("click", (e) => {
      e.target.style.display = "none";
      document.getElementById("seat-main").style.display = "block";
    });
    document.getElementById("close-button").addEventListener("click", (e) => {
      document.getElementById("seat-main").style.display = "none";
      document.getElementById("expand").style.display = "block";
    });
  })();
})();
