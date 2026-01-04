// ==UserScript==
// @name        「QQ 群」今天谁值日
// @namespace   wdssmq
// @version     1.2
// @author      沉冰浮水
// @description 用于确定值日生/doge
// @link        https://greasyfork.org/zh-CN/scripts/26812
// @null     ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null     ----------------------------
// @link     https://github.com/wdssmq/userscript
// @link     https://afdian.net/@wdssmq
// @link     https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null     ----------------------------
// @include     https://qun.qq.com/member.html*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427517/%E3%80%8CQQ%20%E7%BE%A4%E3%80%8D%E4%BB%8A%E5%A4%A9%E8%B0%81%E5%80%BC%E6%97%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/427517/%E3%80%8CQQ%20%E7%BE%A4%E3%80%8D%E4%BB%8A%E5%A4%A9%E8%B0%81%E5%80%BC%E6%97%A5.meta.js
// ==/UserScript==
/* jshint esversion:6 */
(function () {
  "use strict";
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }
  function fnTime(type = "s", span = 1) {
    const curDate = new Date();
    //
    const curTime = parseInt(curDate.valueOf() / 1000);
    if (type === "s") {
      return curTime / span;
    }
    //
    const curDay = parseInt(curTime / 86400);
    if (type === "d") {
      return curDay / span;
    }
    //
    const curWeek = parseInt(curDay / 7);
    if (type === "w") {
      return curWeek / span;
    }
  }

  const fnGetMaster = () => {
    //
    const elImg = $n("a.group-master-a+img");
    return elImg.getAttribute("id").replace(/\D/g, "");
  };

  const fnGetMngs = () => {
    const elMngs = $na(".icon-group-manage");
    const idMngs = [fnGetMaster()];
    for (let i = 0; i < elMngs.length; i++) {
      idMngs.push(elMngs[i].dataset.id);
    }
    idMngs.sort((a, b) => {
      return parseInt(a) - parseInt(b);
    });
    return idMngs;
  };

  const config_num = 2;

  const fnPickMngs = () => {
    const curWeek = fnTime("w");
    const arrMngs = fnGetMngs();
    console.log("管理列表：");
    console.log(arrMngs);
    const arrIndex = (() => {
      const numSerial = curWeek % parseInt(arrMngs.length / config_num);
      const arrRlt = [];
      for (let i = 0; i < config_num; i++) {
        arrRlt.push((numSerial * config_num) + i);
      }
      console.log(curWeek, parseInt(arrMngs.length / config_num), numSerial);
      return arrRlt;
    })();
    const rltMngs = [];
    arrIndex.forEach((i) => {
      if (arrMngs[i]) {
        rltMngs.push(arrMngs[i]);
      }
    });
    console.log("选取：");
    console.log(rltMngs);
    return rltMngs;
  };

  const fnSetStyle = (pickMngs) => {
    pickMngs.forEach((id) => {
      const elMb = $n(`.mb${id}`);
      const elSpan = elMb.querySelector(".td-user-nick span");
      elSpan.style.color = "red";
    });
  };

  let config_done = false;
  function fnMain() {
    if ($n("a.group-master-a+img") && !config_done) {
      fnSetStyle(fnPickMngs());
      config_done = true;
    }
  }
  fnMain();

  // window.addEventListener('load', fnMain, false);
  window.addEventListener("scroll", function () {
    fnMain();
  });
})();
