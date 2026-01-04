// ==UserScript==
// @name         Shwoo
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Shwoo auto bid at last second
// @author       SDxBacon
// @match        https://shwoo.gov.taipei/shwoo/newproduct/newproduct00/product*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454360/Shwoo.user.js
// @updateURL https://update.greasyfork.org/scripts/454360/Shwoo.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // constants
  const BidTimeStatus = {
    MoreThanAMinute: "MoreThanAMinute",
    LessThanSixtySeconds: "LessThanSixtySeconds",
    Ended: "Ended",
  };
  const mapBidTimeStatusToTimeout = {
    MoreThanAMinute: 30 * 1000, // 30 seconds
    LessThanSixtySeconds: 500, // 0.5 seconds
    Ended: Number.MAX_SAFE_INTEGER,
  };
  const deadline = 1500; // 1.5 seconds

  // variables
  let divEL;
  let timer;
  let isRunning = false;

  /**
   * All helpers
   */
  const helpers = {
    getBidTimeStatus: (serverTime, bidEndDate) => {
      const numBidEndDate = Number(bidEndDate);
      const numServerTime = Number(serverTime);

      if (!numBidEndDate || !numServerTime) {
        return -1;
      }

      if (numServerTime >= numBidEndDate) {
        return BidTimeStatus.Ended;
      }
      if (numBidEndDate - numServerTime > 60 * 1000) {
        return BidTimeStatus.MoreThanAMinute;
      }
      return BidTimeStatus.LessThanSixtySeconds;
    },
    /**
     * 取得 recaptcha keys
     * @returns Promise<token>
     */
    getCaptchaKeys: () => {
      const grecaptchaKey = "6LdlsaYZAAAAAGeg0UxjitSRrjwPVeSXxu4lSdVd";
      return grecaptcha.execute(grecaptchaKey, { action: "submit" });
    },
    /** 下標 */
    bid: (cb) => {
      helpers
        .getCaptchaKeys()
        .then((token) => {
          bidButtonClicked = true;
          webSocket_send_callback(
            getJson2(
              2,
              auid,
              document.getElementById("bidprice").options[1].value, // 使用第二個價格作為下注金額送出
              memid,
              "1.161.29.18",
              null,
              null,
              null,
              null,
              token
            ),
            function () {
              updateBidInfo();
              bidButtonClicked = false;
            }
          );
        })
        .finally(() => {
          cb();
        });
    },
  };

  /**
   * Div button helper
   */
  const DivHelper = {
    baseStyle: {
      position: "fixed",
      cursor: "pointer",
      left: "10px",
      bottom: "100px",
      height: "30px",
      width: "130px",
      lineHeight: "30px",
      textAlign: "center",
      fontWeight: "bold",
    },
    stopStyle: {
      background: "orange",
    },
    startStyle: {
      background: "green",
    },
    assignStyle: (style, element = divEL) => {
      if (!element) return;

      for (let prop of Object.keys(style)) {
        element.style[prop.toString()] = style[prop.toString()];
      }
    },
    createDivBtnEl: () => {
      const el = document.createElement("div");
      const style = {
        ...DivHelper.baseStyle,
        ...DivHelper.stopStyle,
      };

      DivHelper.assignStyle(style, el);

      el.innerHTML = "停止中";
      return el;
    },
    renderStart: () => {
      const style = DivHelper.startStyle;
      DivHelper.assignStyle(style);
      divEL.innerHTML = "自動下標執行中...";
    },
    renderStop: () => {
      const style = DivHelper.stopStyle;
      DivHelper.assignStyle(style);
      divEL.innerHTML = "停止中";
    },
  };

  /**
   * processor
   */
  const processor = {
    run: () => {
      if (isRunning) return;

      // lock the latch
      isRunning = true;
      // render start
      DivHelper.renderStart();

      function routine() {
        // ServerTime 這個物件原本的script 一直在跳動，每次routine執行就應該先memorize serverTime成 local variable
        const sServerTime = serverTime;
        const sBidEndDate = bidEndDate;
        const status = helpers.getBidTimeStatus(sServerTime, sBidEndDate);

        // 異常 停窗並終止
        if (status === -1) {
          alert(
            `getBidTimeStatus 異常\nserverTime: ${sServerTime}\nbidEndDate: ${sBidEndDate}`
          );
          processor.stop();
          return;
        }

        // time is up, quitting
        if (status === BidTimeStatus.Ended) {
          console.log("[Debug] 投注時間結束, stop routine");
          processor.stop();
          alert("投注時間已結束！");
          return; // end
        }

        // more than a minute.
        if (status === BidTimeStatus.MoreThanAMinute) {
          console.log("[Debug] 投注時間還大於一分鐘, restart timer");
          const timeout = mapBidTimeStatusToTimeout.MoreThanAMinute;
          timer = setTimeout(() => {
            routine();
          }, timeout);
          return;
        }

        // 小於一分鐘
        const numBidEndDate = Number(sBidEndDate);
        const numServerTime = Number(sServerTime);

        if (!numBidEndDate || !numServerTime) {
          processor.stop();
          alert(
            `時間小於一分鐘，時間資訊異常\nserverTime: ${sServerTime}\nbidEndDate: ${sBidEndDate}`
          );
          return;
        }

        // 如果小於 deadline, 重新取得物品價格並執行下注動作
        if (numBidEndDate - numServerTime <= deadline) {
          console.log("[Debug] 結標時間小於 1s 開始下注行程");
          //取得物品價格, 這邊是參考網頁的script
          webSocket_send_callback(getJson(1, auid), function () {
            // 執行下注動作，下注會用select.options中的第二個價格下標
            helpers.bid(function () {
              processor.stop();
            });
          });
          return;
        }

        // 否則重啟timer
        console.log("[Debug] 投注時間小於一分鐘！");
        const timeout = mapBidTimeStatusToTimeout.LessThanSixtySeconds;
        timer = setTimeout(() => {
          routine();
        }, timeout);
        return;
      }

      timer = setTimeout(() => {
        routine();
      }, 0);
    },
    stop: () => {
      // clean out timer
      clearTimeout(timer);
      // release the latch
      isRunning = false;

      DivHelper.renderStop();

      console.log("[Debug] Processor.stop");
    },
  };

  // recaptcha ready watcher
  grecaptcha.ready(function () {
    isGrecaptchaReady = true;
    console.log("[Debug] GreCaptcha is ready");
  });

  // createDivElement
  divEL = DivHelper.createDivBtnEl();
  divEL.onclick = function handleClick() {
    if (memid === "") {
      alert("請先登入");
      return;
    }

    if (isRunning) processor.stop();
    else processor.run();
  };
  document.body.append(divEL);
})();
