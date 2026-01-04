// ==UserScript==
// @name         重庆继续教育自动学习
// @namespace    http://tampermonkey.net/
// @version      2024-05-20-1338
// @description  点击科目的【进入学习】按钮，自动依次完成科目内的视频播放，直到科目进度100%停止，无需要用户操作
// @author       lqqgis
// @match        http*://cqrl.21tb.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495546/%E9%87%8D%E5%BA%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/495546/%E9%87%8D%E5%BA%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(async function () {
  // Your code here...

  var href = window.location.href;
  console.log(document.readyState, href);


  // 课程详情页面
  if (href.includes("courseDetail")) {
    for(let i=0; i< localStorage.length; i++){
      const key = localStorage.key(i)
      localStorage.removeItem(key)
    }
    localStorage.setItem("isPlay", 0);
    console.log("####### 课程详情页面 #########");
    let params = href.split("&");
    let projectId = params.filter((p) => p.includes("projectId="))[0];
    let sessionId = sessionStorage.getItem("eln_session_id");
    let corpCode = sessionStorage.getItem("corp_code");
    // 获取stageId
    async function getRmProjectDetail() {
      const url = `https://cqrl.21tb.com/nms/html/courseStudy/getRmProjectDetail.do?${projectId}&eln_session_id=${sessionId}&corp_code=${corpCode}`;
      let data = await fetch(url).then((res) => res.json());

      return { stageId: data.currentStageId, percentStr: data.percentStr };
    }

    let project = await getRmProjectDetail();
    if (project.percentStr !== "100") {
      var isClick = false;
      const observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          if (isClick) return;
          if (mutation.removedNodes.length === 0) return;
          if (!mutation.removedNodes[0].classList.contains("el-loading-mask"))
            return;
          const btnItems = document.getElementsByClassName("btn-item");
          if (btnItems.length === 0) return;
          const uncompeleted = [...btnItems].filter(
            (p) => p.innerText === "未完成"
          )[0];
          if (!uncompeleted.classList.contains("btn-item-active")) {
            console.log("点击 未完成");
            uncompeleted.click();
            return;
          }
          setTimeout(function () {
            const textItems = document.getElementsByClassName("text-item");
            const tabMust = document.getElementById("tab-MUST");
            if (tabMust.classList.contains("is-active")) {
              if (textItems.length === 0) {
                const tabSelect = document.getElementById("tab-SELECTIVE");
                console.log("必修课无课程, 点击【选修课】");
                tabSelect.click();
                return;
              }
            }
            const filterTextItems = [...textItems].filter(
              (p) => !p.innerText.includes("测试课程，勿学")
            );
            if (filterTextItems.length > 0) {
              if (!isClick) {
                console.log("🚀 ~ 全部课程: ", filterTextItems);
                isClick = true;
                filterTextItems[0].click();
                return;
              }
            }
          }, 4000);
        }
      });
      observer.observe(document.body, { childList: true, subtree: false });

      // 监听是不是学完课程，学完则刷新页面
      window.addEventListener("storage", function (e) {
        if (e.key === "isPlay") {
          console.log("🚀 ~ storage.isPlay:", e);
          if (e.oldValue === "1" && e.newValue === "0") {
            console.log("监听到 学完课程", e);
            window.location.reload();
          }
        }
      });
    }
  }

  // 课程学习页面
  if (href.includes("coursePlay")) {
    localStorage.setItem("isPlay", 1);

    setInterval(function () {
      let playBtn = document.getElementsByClassName("prism-big-play-btn")[0];
      console.log("检查到 播放按钮1", playBtn.children);
      if (!playBtn.classList.contains('playing')) {
        playBtn.click();
        return
      }

      let elements = document.getElementsByClassName("next-button");
      if (elements.length > 0) {
        console.log("检查到【下一页】");
        let nextButton = elements[0];
        nextButton.click();
        return;
      }

      elements = document.getElementsByClassName("only-one-btn");
      if (elements.length > 0) {
        let onBtns = elements[0];
        console.log("检查到 已经完成课程【确定】");
        onBtns.click();
        localStorage.setItem("isPlay", 0);
        window.top.close();
        return;
      }

      elements = document.getElementsByClassName("player-endInfo");
      if (elements.length > 0) {
        console.log("检查到 已是最后一节");
        localStorage.setItem("isPlay", 0);
        window.top.close();
        return;
      }
    }, 2000);
  }
})();
