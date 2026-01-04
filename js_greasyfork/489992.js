// ==UserScript==
// @name         idols.events 日期倒计时
// @namespace    https://github.com/yonjar
// @version      0.2
// @description  idols.events 显示日期星期几和倒计时
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @author       Yonjar
// @match        https://ievent.life/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idols.events
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489992/idolsevents%20%E6%97%A5%E6%9C%9F%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489992/idolsevents%20%E6%97%A5%E6%9C%9F%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

// https://juejin.cn/post/7135590843544502308

const day_map = ["日", "一", "二", "三", "四", "五", "六"];
const now = dayjs().format("YYYY-MM-DD");

const originOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (_, url) {
  if (
    url.indexOf("/API/Event/recent?page=") > 0 ||
    url.indexOf("/API/Event/search") > 0 ||
    url.indexOf("/API/Mypage/recentEvents") > 0 ||
    url.indexOf("/API/Event/locationRecent") > 0
  ) {
    // if (url === "/API/Event/recent?page=1") {
    const xhr = this;
    const getter = Object.getOwnPropertyDescriptor(
      XMLHttpRequest.prototype,
      "response"
    ).get;
    Object.defineProperty(xhr, "responseText", {
      get: () => {
        let result = getter.call(xhr);
        try {
          const res = JSON.parse(result);
          for (let event of res.data.events) {
            let tmp_date = dayjs(event.date, "YYYY-MM-DD");
            let tmp_day = tmp_date.day();
            let diff = tmp_date.diff(now, "day");
            let countdown =
              diff > 0 ? ` / ${diff}天后` : ` / ${Math.abs(diff)}天前`;
            event.date += ` / (${day_map[tmp_day]})` + countdown;
          }

          return JSON.stringify(res);
        } catch (e) {
          return result;
        }
      },
    });
  }
  if (url.indexOf("/API/Event/find?id=") > 0) {
    const xhr = this;
    const getter = Object.getOwnPropertyDescriptor(
      XMLHttpRequest.prototype,
      "response"
    ).get;
    Object.defineProperty(xhr, "responseText", {
      get: () => {
        let result = getter.call(xhr);
        try {
          const res = JSON.parse(result);

          let tmp_date = dayjs(res.data.date, "YYYY-MM-DD");
          let tmp_day = tmp_date.day();
          let diff = tmp_date.diff(now, "day");
          let countdown =
            diff > 0 ? ` / ${diff}天后` : ` / ${Math.abs(diff)}天前`;
          res.data.date += ` / (${day_map[tmp_day]})` + countdown;

          return JSON.stringify(res);
        } catch (e) {
          return result;
        }
      },
    });
  }
  originOpen.apply(this, arguments);
};
