// ==UserScript==
// @name         学习通 防暂停 | 防熄屏 | 自动播放 | 自动静音
// @namespace    http://tampermonkey.net/
// @version      20250918-9baf65e9
// @description  南京信息工程大学学习通防暂停、自动播放、自动静音
// @author       HowardZhangdqs
// @match        https://*.chaoxing.com/mycourse/studentstudy*
// @match        https://*.chaoxing.com/mooc-ans/*
// @icon         https://www.chaoxing.com/images/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/512400/%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E9%98%B2%E6%9A%82%E5%81%9C%20%7C%20%E9%98%B2%E7%86%84%E5%B1%8F%20%7C%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%7C%20%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/512400/%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E9%98%B2%E6%9A%82%E5%81%9C%20%7C%20%E9%98%B2%E7%86%84%E5%B1%8F%20%7C%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%7C%20%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

// 20241209
// + fix: 多视频播放时关闭自动播放
// 
// 20241206
// + feat: 阻止系统熄屏
// 
// 20250313
// + feat: 自动刷电子书

(() => {
  "use strict";

  const check_sleep_latency = 1000;
  const check_stop_latency = 5000;
  const fake_scroll_latency = [5000, 1000];
  const fake_scroll_distance = [100, 100];
  const config = {
    check_sleep_latency,
    check_stop_latency,
    fake_scroll_latency,
    fake_scroll_distance,
  };
  const unbounded = () => {
    let interval_id;
    let running = false;
    const closure = {
      start: async () => {
        running = true;
        let video = null;
        interval_id = setInterval(() => {
          const iframeDocument =
            document.getElementsByTagName("iframe")[0].contentWindow?.document;
          const iframes = iframeDocument?.getElementsByTagName("iframe");
          if (!iframes || iframes.length !== 1) {
            return;
          }
          const innerIframeDocument = iframes[0].contentWindow?.document;
          video = innerIframeDocument?.querySelector("#video_html5_api");
          const errDoms = innerIframeDocument?.querySelectorAll(
            ".ans-vjserrdisplay-title",
          ).length;
          if (errDoms) {
            location.reload();
          }
          if (video) {
            video.play();
            video.muted = true;
          }
        }, config.check_sleep_latency);
      },
      stop: () => {
        running = false;
        if (interval_id) {
          clearInterval(interval_id);
        }
      },
      get running() {
        return running;
      },
    };
    return closure;
  };
  const weblock = () => {
    let interval_id;
    let running = false;
    let waken = false;
    const closure = {
      start: async () => {
        running = true;
        interval_id = setInterval(async () => {
          if (waken) {
            return;
          }
          if ("wakeLock" in navigator) {
            try {
              const wakeLock = await navigator.wakeLock.request("screen");
              console.log(
                `Wake Lock ${wakeLock.released ? "未激活" : "已激活"}`,
              );
              waken = true;
            } catch (err) {
              console.error(`${err.name}, ${err.message}`);
            }
            try {
              const wakeLock = await navigator.wakeLock.request("screen");
              wakeLock.addEventListener("release", () => {
                console.log("Wake Lock 已释放");
                waken = false;
              });
            } catch (err) {
              console.error(`${err.name}, ${err.message}`);
            }
          }
        }, config.check_sleep_latency);
      },
      stop: () => {
        running = false;
        if (interval_id) {
          clearInterval(interval_id);
        }
      },
      get running() {
        return running;
      },
    };
    return closure;
  };
  const fake_scroll = () => {
    let interval_id;
    let running = false;
    const closure = {
      start: async () => {
        const match = location.href.match(
          /https:\/\/.*\.chaoxing\.com\/mooc-ans\//,
        );
        if (!match) {
          console.log("当前页面不是超星答题页面，退出");
          throw new Error("当前页面不是超星答题页面，退出");
        } else {
          console.log("当前页面是超星答题页面，继续执行脚本");
        }
        interval_id = setInterval(
          () => {
            console.log("Fake scrolling");
            document.getElementById("outerBody").scrollBy({
              top:
                config.fake_scroll_distance[0] +
                Math.random() * config.fake_scroll_distance[1],
              behavior: "smooth",
            });
          },
          config.fake_scroll_latency[0] +
            Math.random() * config.fake_scroll_latency[1],
        );
        const outerBody = document.getElementById("outerBody");
        const checkScrollEnd = () => {
          if (
            Math.abs(outerBody.scrollHeight - outerBody.scrollTop) -
              outerBody.clientHeight <
            10
          ) {
            console.log("Reached the end of scroll");
            document.getElementById("loadbutton").click();
          }
        };
        outerBody.addEventListener("scrollend", checkScrollEnd);
        checkScrollEnd();
        running = true;
        return interval_id;
      },
      stop: () => {
        clearInterval(interval_id);
        running = false;
      },
      get running() {
        return running;
      },
    };
    return closure;
  };
  const unbounded_instance = unbounded();
  const weblock_instance = weblock();
  const fake_scroll_instance = fake_scroll();
  fake_scroll_instance.start();
  unbounded_instance.start();
  weblock_instance.start();
})();
