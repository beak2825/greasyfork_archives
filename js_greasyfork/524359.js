// ==UserScript==
// @name         我就一看番的
// @namespace    xavierror
// @version      0.0.1
// @description  屏蔽评论、讨论啥啥的 https://bgm.tv/group/topic/388787
// @supportURL   https://bgm.tv/group/topic/388787
// @author       xavierror
// @match        *://*bgm.tv/*
// @match        *://*bangumi.tv/*
// @icon         https://bgm.tv/img/ico/ico_ios.png
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524359/%E6%88%91%E5%B0%B1%E4%B8%80%E7%9C%8B%E7%95%AA%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/524359/%E6%88%91%E5%B0%B1%E4%B8%80%E7%9C%8B%E7%95%AA%E7%9A%84.meta.js
// ==/UserScript==
(() => {
  const path = location.pathname;
  const styleElement = document.createElement("style");

  const sleep = (ms) =>
    new Promise((resolve) => {
      const timer = setTimeout(() => resolve(clearTimeout(timer)), ms);
    });

  // 首页
  if (path === "/") {
    styleElement.innerText = `
      #home_grp_tpc,
      #home_subject_tpc,
      #home_tml {
        display: none !important;
      }
      #footer {
        margin-top: 0 !important;
      }
      #cloumnSubjectInfo .infoWrapper_tv{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      #cloumnSubjectInfo .tinyMode {
        margin:0;
        width: 49%;
        border-bottom: 1px solid #e6e6e6;
      }
      #cloumnSubjectInfo .tinyMode:hover{
        box-shadow: none;
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
      }
      #cloumnSubjectInfo .tinyMode:nth-child(odd) {
        border-right: 1px solid #e6e6e6;
      }
      #cloumnSubjectInfo .tinyMode:nth-child(even) {
        border-left: 1px solid #e6e6e6;
      }
      #cloumnSubjectInfo .tinyMode div.epGird {
        margin-left: 60px;
      }
      span.avatarSize48 {
        width: 56px;
        height: 75px;
        border-radius: 3px;
        background-position: top center;
      }
    `;

    // 转成中文
    sleep(500).then(() => {
      const subjects = document.querySelectorAll('div[id^="subjectPanel"]');
      subjects.forEach((e) => {
        const cover = e.querySelector("a.avatar > span.avatarNeue");
        cover.style.backgroundImage = cover.style.backgroundImage.replace("/m/","/l/");

        const title = e.querySelector(".epGird > .tinyHeader > .textTip[data-subject-name-cn]:not([data-subject-name-cn=''])");
        if (title && title.getAttribute("data-subject-name-cn"))
          title.innerText = title.getAttribute("data-subject-name-cn");
      });
    });
  }

  // 详情页
  if (path.search("/subject/") === 0) {
    styleElement.innerText =
      "#ChartWarpper,#columnInSubjectA div.rr,#panelInterestWrapper div[rel='v:rating'],#columnSubjectHomeB .subject_section:nth-last-child(-n+4){display:none!important}";
  }

  // 人物页
  if (path.search("/character/") === 0) {
    styleElement.innerText =
      "#columnCrtB .crtCommentList{display:none!important}";
  }

  // 章节页
  if (path.search("/ep/") === 0) {
    styleElement.innerText =
      "#columnEpA .singleCommentList{display:none!important}";
  }

  document.head.appendChild(styleElement);
})();
