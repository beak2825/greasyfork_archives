// ==UserScript==
// @name         抖音跳过广告-GPT优化
// @namespace    https://greasyfork.org/zh-CN/users/1020626-wszx3394?locale_override=1
// @version      1.0
// @description  关闭抖音弹窗登录,跳过抖音广告和直播,观看直播默认原画
// @author       wszx3394
// @license      wszx3394
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @license      MIT
// @match        https://www.douyin.com/
// @match        https://live.douyin.com/*
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/455943/1270016/ajaxHooker.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483129/%E6%8A%96%E9%9F%B3%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A-GPT%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483129/%E6%8A%96%E9%9F%B3%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A-GPT%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const url = window.location.host;

  if (url === "www.douyin.com") {
    const configxgIcon = [
      { name: "清屏", option: false, type: "qingping" },
      { name: "直播", option: true, type: "live" },
      { name: "右侧", option: true, type: "right" },
      { name: "底部", option: true, type: "bottom" },
      { name: "提示", option: true, type: "tips" },
      { name: "回退", option: true, type: "rollback" },
      { name: "屏蔽", option: true, type: "filter" },
    ];

    let storedConfig = localStorage.getItem("xg-icon");
    const storedConfigParsed = storedConfig ? JSON.parse(storedConfig) : [];

    const configxgIconFinal = storedConfigParsed.length === configxgIcon.length
      ? storedConfigParsed
      : configxgIcon;

    localStorage.setItem("xg-icon", JSON.stringify(configxgIconFinal));

    const listModuleContent = `
      <div class="userInput">
        <div class="choice"> ﹀ </div>
        <input class="content" type="text">
        <div class="confirm"> ✔ </div>
      </div>
      <div class="option"></div>
      <div class="list"> </div>
    `;

    const listModule = document.createElement("div");
    listModule.className = "listModule";
    listModule.innerHTML = listModuleContent;

    const rootvideo = document.querySelector(".YwClj8rK.fullscreen_capture_feedback");
    if (rootvideo) {
      rootvideo.appendChild(listModule);
    }

    const userValue = listModule.querySelector(".content");

    const KeywordFiltering = [
      { name: "名字", class: "username", data: [] },
      { name: "文案", class: "Copywriting", data: [] },
      { name: "标签", class: "Tag", data: ["图文", "购物", "广告"] },
      { name: "全选", class: "selectall", data: [] },
      { name: "时间", class: "time", time: 7, tips: function () { return `当前过滤${this.time}天以外的视频(7~999,999为不过滤)` } }
    ];

    const storedKeywordData = localStorage.getItem("KeywordData");
    const KeywordFilteringFinal = storedKeywordData
      ? JSON.parse(storedKeywordData).map(item => KeywordFiltering.find(subItem => subItem.name === item.name) ? { ...KeywordFiltering.find(subItem => subItem.name === item.name), ...item } : item)
      : KeywordFiltering;

    localStorage.setItem("KeywordData", JSON.stringify(KeywordFilteringFinal));

    for (const item of KeywordFilteringFinal) {
      const li = document.createElement("li");
      li.innerText = item.name;
      listModule.querySelector(".option").appendChild(li);

      const div = document.createElement("div");
      div.className = item.class;
      listModule.querySelector(".list").appendChild(div);

      li.onclick = () => {
        for (const allDiv of listModule.querySelectorAll(".list div")) {
          allDiv.style.display = "none";
        }
        div.style.display = "block";
        listModule.querySelector(".option").style.display = "none";

        listModule.querySelector(".choice").innerText = li.innerText;
        listModule.querySelector(".confirm").onclick = () => {
          if (userValue.value === "") {
            Tips("不允许为空");
            return;
          }

          if (item.data) {
            if (item.data.includes(userValue.value)) {
              Tips("已存在");
              return;
            }

            const span = document.createElement("span");
            span.innerText = userValue.value;
            div.appendChild(span);
            item.data.push(userValue.value);
          }

          if (item.time || item.time === 0) {
            if (isNaN(userValue.value)) {
              Tips("请输入有效数字");
              return;
            } else if (userValue.value < 7 || userValue.value > 999) {
              Tips("不符合规定");
              return;
            }

            item.time = Number(userValue.value);
            document.querySelector(`.list .${item.class} span`).innerText = item.tips();
          }

          userValue.value = "";
          localStorage.setItem("KeywordData", JSON.stringify(KeywordFilteringFinal));
        };

        userValue.onkeydown = (e) => {
          if (e.keyCode === 13) {
            listModule.querySelector(".confirm").click();
          }
        };
      };

      if (item.data) {
        item.data.forEach(subitem => {
          const span = document.createElement("span");
          span.innerText = subitem;
          div.appendChild(span);
        });
      }

      if (item.time || item.time === 0) {
        const p = document.createElement("span");
        p.innerText = item.tips();
        div.appendChild(p);
      }

      div.onclick = (e) => {
        if (item.data && e.target.nodeName === "SPAN") {
          e.target.remove();
          item.data = item.data.filter(item => item !== e.target.innerText);
          localStorage.setItem("KeywordData", JSON.stringify(KeywordFilteringFinal));
        }
      };
    }

    listModule.querySelector(".choice").onmouseover = () => {
      listModule.querySelector(".option").style.display = "block";
    };

    listModule.querySelector(".choice").onmouseout = () => {
      listModule.querySelector(".option").style.display = "none";
    };

    listModule.querySelector(".list").onmouseover = () => {
      listModule.querySelector(".option").style.display = "block";
    };

    listModule.querySelector(".list").onmouseout = () => {
      listModule.querySelector(".option").style.display = "none";
    };

    const rollbackButton = listModule.querySelector(".rollback");
    rollbackButton.onclick = () => {
      const timeArray = [];
      const time = setInterval(() => {
        timeArray.push(time);
        document.documentElement.scrollTop = document.documentElement.scrollTop - 50;

        if (document.documentElement.scrollTop === 0) {
          timeArray.forEach(time => clearInterval(time));
        }
      }, 10);
    };

    const qingping = listModule.querySelector(".qingping");
    qingping.onclick = () => {
      for (const allDiv of listModule.querySelectorAll(".list div")) {
        for (const allSpan of allDiv.querySelectorAll("span")) {
          allSpan.remove();
        }
        allDiv.innerText = allDiv.className;
      }

      for (const allLi of listModule.querySelectorAll(".option li")) {
        allLi.remove();
      }

      localStorage.removeItem("KeywordData");
      localStorage.removeItem("xg-icon");

      Tips("已清空");
    };

    const live = listModule.querySelector(".live");
    live.onclick = () => {
      live.style.backgroundColor = live.style.backgroundColor === "rgba(32, 32, 32, 0.8)" ? "" : "rgba(32, 32, 32, 0.8)";
    };

    const right = listModule.querySelector(".right");
    const bottom = listModule.querySelector(".bottom");
    right.onclick = () => {
      right.style.backgroundColor = right.style.backgroundColor === "rgba(32, 32, 32, 0.8)" ? "" : "rgba(32, 32, 32, 0.8)";
      bottom.style.backgroundColor = "";
    };
    bottom.onclick = () => {
      bottom.style.backgroundColor = bottom.style.backgroundColor === "rgba(32, 32, 32, 0.8)" ? "" : "rgba(32, 32, 32, 0.8)";
      right.style.backgroundColor = "";
    };

    const filter = listModule.querySelector(".filter");
    filter.onclick = () => {
      filter.style.backgroundColor = filter.style.backgroundColor === "rgba(32, 32, 32, 0.8)" ? "" : "rgba(32, 32, 32, 0.8)";
    };

    const tips = listModule.querySelector(".tips");
    tips.onclick = () => {
      tips.style.backgroundColor = tips.style.backgroundColor === "rgba(32, 32, 32, 0.8)" ? "" : "rgba(32, 32, 32, 0.8)";
    };

    let observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const video = document.querySelector(".YwClj8rK.fullscreen_capture_feedback");

        if (video) {
          configxgIconFinal.forEach(item => {
            if (item.option) {
              video.classList.add(item.type);
            } else {
              video.classList.remove(item.type);
            }
          });

          if (video.classList.contains("filter") || video.classList.contains("live")) {
            video.classList.add("widthadd");
          } else {
            video.classList.remove("widthadd");
          }

          video.classList.add("yj");

          const videoContent = video.querySelector(".video-content");
          videoContent.style.maxWidth = video.classList.contains("widthadd") ? "100%" : "";

          if (video.classList.contains("tips")) {
            const tipsDiv = document.createElement("div");
            tipsDiv.className = "tipsDiv";
            video.appendChild(tipsDiv);
            Tips("此模式下可屏蔽");
          }

          video.querySelector(".author-info").style.maxHeight = video.classList.contains("tips") ? "40px" : "";

          video.querySelector(".name-wrapper").style.maxHeight = video.classList.contains("tips") ? "60px" : "";

          video.querySelector(".eotlEHgR").style.maxHeight = video.classList.contains("tips") ? "90px" : "";

          const tipsDiv = document.querySelector(".tipsDiv");
          if (tipsDiv) {
            tipsDiv.remove();
          }

          const observerTips = new MutationObserver((mutations) => {
            mutations.forEach(() => {
              Tips("已屏蔽");
            });
          });

          observerTips.observe(video, { attributes: true, attributeFilter: ["class"] });
        }
      });
    });

    observer.observe(rootvideo, { attributes: true, attributeFilter: ["class"] });

    function Tips(text) {
      const tipsDiv = document.querySelector(".tipsDiv");
      if (tipsDiv) {
        tipsDiv.innerText = text;
      } else {
        const newTipsDiv = document.createElement("div");
        newTipsDiv.className = "tipsDiv";
        newTipsDiv.innerText = text;
        document.body.appendChild(newTipsDiv);
        setTimeout(() => {
          newTipsDiv.remove();
        }, 2000);
      }
    }
  }
})();

