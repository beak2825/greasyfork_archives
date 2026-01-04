// ==UserScript==
// @name         学习通20倍速刷课
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  学习通快速刷课
// @author       kylan
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515948/%E5%AD%A6%E4%B9%A0%E9%80%9A20%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/515948/%E5%AD%A6%E4%B9%A0%E9%80%9A20%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  const RATIO = 20;

  const secToTime = (sec) =>
    new Date(0 + sec * 1e3)
      .toISOString()
      .replace(/[\d-]+T([\d:]+)\.\d+Z/, "$1");

  function findUntil(tag, cb) {
    return new Promise((resolve) => {
      const intv = setInterval(() => {
        console.log(`finding ${tag}...`);
        const elems = cb();
        if (elems?.length) {
          resolve(elems);
          clearInterval(intv);
        }
      }, 100);
    });
  }

  const findTabs = () =>
    findUntil("tabs", () => document.querySelectorAll("#prev_tab > ul > li"));

  const findCards = () =>
    findUntil("cards", () =>
      document
        .getElementById("iframe")
        ?.contentDocument?.querySelectorAll(".ans-attach-ct")
    );

  //   function newShowHTML5Player() {
  //     gVidcfgResolve(arguments[0]);
  //     return origShowHTML5Player(...arguments);
  //   }
  async function getVidInfo(objectId) {
    const fid = getCookie("fid");
    const resp = await fetch(
      `https://mooc1.chaoxing.com/ananas/status/${objectId}?k=${fid}&flag=normal&_dc=${Date.now()}`
    );
    const { duration, dtoken } = await resp.json();
    return { duration, dtoken };
  }

  async function updateLog(window3, playtime, fakenow, data) {
    const {
      objectId,
      jobid,
      otherInfo,
      videoFaceCaptureEnc,
      attDurationEnc,
      attDuration,
      rt,
      clazzId,
      userid,
      reportUrl,
      duration,
      dtoken,
      secret,
    } = data;
    const hasho = `[${clazzId}][${userid}][${jobid}][${objectId}][${
      playtime * 1e3
    }][${secret}][${duration * 1e3}][0_${duration}]`;
    const md5 = window3.md5(hasho);
    const url = `${reportUrl}/${dtoken}?clazzId=${clazzId}&playingTime=${playtime}&duration=${duration}&clipTime=0_${duration}&objectId=${objectId}&otherInfo=${otherInfo}&jobid=${jobid}&userid=${userid}&isdrag=${0}&view=pc&enc=${md5}&rt=${
      rt ?? "0.9"
    }&videoFaceCaptureEnc=${videoFaceCaptureEnc}&dtype=Video&_t=${fakenow}&attDuration=${attDuration}&attDurationEnc=${attDurationEnc}`;
    const resp = await window3.fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    try {
      console.log(await resp.json());
    } catch {
      // location.reload();
    }
  }

  async function getPlayTime(cardUrl, jobid) {
    try {
      const cardHtmlR = await fetch(cardUrl);
      const cardHtml = await cardHtmlR.text();
      const mArg = JSON.parse(
        cardHtml.replaceAll("\n", "").match(/mArg\s?=\s?({.+?});/)[1]
      );
      const att = mArg.attachments.find((a) => a.jobid === jobid);
      return att.playTime ?? 0;
    } catch {
      // location.reload();
    }
  }

  async function logVideo(data, initialPlayTime, window3, cardUrl) {
    const secret = "d_yHJ!$pdA~5"; // window3._0x499a64(0x27d);
    const { duration, dtoken } = await getVidInfo(data.objectId);
    const _data = {
      ...data,
      duration,
      dtoken,
      secret,
    };
    // console.log("DATA", _data);
    // console.log("WIN3", window3);
    // console.log("initialPlayTime", initialPlayTime);

    const dispAttach = document.querySelector(".prev_title_pos");
    const disp = document.createElement("div");
    dispAttach.appendChild(disp);

    const UPDATE_GAP = 10;
    let origPlayTime = initialPlayTime ?? 0;
    let startTime = Date.now();
    while (true) {
      const playtime = Math.floor(origPlayTime / 1000);
      if (playtime > Math.floor(duration * 0.9)) {
        break;
      }

      const targetNewTime = Math.min(
        playtime + UPDATE_GAP * RATIO,
        duration - 1
      );
      await updateLog(window3, targetNewTime, Date.now(), _data);
      await new Promise((r) => setTimeout(r, 1000));
      const newPlayTime = await getPlayTime(cardUrl, data.jobid);
      // console.log("newPlayTime", newPlayTime);

      const timelapse = secToTime(Math.floor((Date.now() - startTime) / 1000));
      const pt = Math.floor(newPlayTime / 1000);
      disp.innerHTML = `[${timelapse}] 进度: ${secToTime(pt)} / ${secToTime(
        duration
      )} (${((pt / duration) * 100).toFixed(2)}%)`;
      if (newPlayTime !== origPlayTime) {
        if (pt > Math.floor(duration * 0.9)) {
          // location.reload();
          break;
        }
        origPlayTime = newPlayTime;
        console.log("wait 9s...");
        await new Promise((r) => setTimeout(r, 9e3));
      } else {
        console.log("wait 4s...");
        await new Promise((r) => setTimeout(r, 4e3));
      }
    }
  }

  if (!MutationObserver) alert("NO MUTATION!");
  // let tabs_resolve;
  const observer = new MutationObserver((mutations) => {
    console.log(mutations);
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(async (node) => {
          if (node.className === "course_main") {
            hook();
            // const windows = await findFrame();
            // console.log(windows);
            // } else if (node.id === "prev_tab") {
            //   if (tabs_resolve) {
            //     console.log("resolve by observer");
            //     tabs_resolve(node);
            //   }
          }
        });
      }
    });
  });

  // 将observer应用到document.body，以监控整个文档的DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // const tabs = await new Promise((r) => {
  //   const t = document.getElementById("prev_tab");
  //   if (t) {
  //     console.log("resolve by cur doc");
  //     r(t);
  //   } else {
  //     tabs_resolve = r;
  //   }
  // });

  // async function logVideo(data, initialPlayTime, window3, cardUrl) {}

  async function hook() {
    const tabs = await findTabs();
    console.log(tabs);

    for (let tab of tabs) {
      const cards = await findCards();
      // console.log(cards);
      const window2 = document.getElementById("iframe").contentWindow;
      console.log(window2.mArg);
      const {
        attachments,
        defaults: { clazzId, userid, reportUrl },
      } = window2.mArg;

      const dispAttach = document.querySelector(".prev_title_pos");
      const disp = document.createElement("div");
      dispAttach.appendChild(disp);

      let ind = 0;
      for (let att of attachments) {
        ind += 1;
        disp.innerText = `当前刷课：第${ind}个 / 共${attachments.length}个`;
        if (att.isPassed) continue;
        const {
          objectId,
          jobid,
          otherInfo,
          videoFaceCaptureEnc,
          attDurationEnc,
          attDuration,
          property: { rt },
        } = att;
        await logVideo(
          {
            objectId,
            jobid,
            otherInfo,
            videoFaceCaptureEnc,
            attDurationEnc,
            attDuration,
            rt,
            clazzId,
            userid,
            reportUrl,
          },
          att.playTime,
          window2.document.querySelector(`iframe[jobid='${jobid}']`)
            .contentWindow,
          window2.location.href
        );
      }
    }
  }

  // const courses = [
  //   ...document.querySelectorAll(".posCatalog_select .posCatalog_name"),
  // ];
  // const next =
  //   courses[
  //     courses.indexOf(
  //       document.querySelector(".posCatalog_active .posCatalog_name")
  //     ) + 1
  //   ];
  // if (next) {
  //   console.log(next);
  //   next.click();
  // } else {
  //   alert("完成全部课程！");
  // }
})();
