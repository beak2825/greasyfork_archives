// ==UserScript==
// @name         知乎工具箱
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  知乎工具箱，各种奇奇怪怪的小功能~
// @author       kuubee
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428597/%E7%9F%A5%E4%B9%8E%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/428597/%E7%9F%A5%E4%B9%8E%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

const ZHI_HU_BLUE = "#06f";
(function () {
  "use strict";
  window.onload = () => {
    if (window.firstFlag) return;
    window.firstFlag = true;
    ZhihuUtils.aJumpOptimization();
    ZhihuUtils.answerListInit();
  };
})();
class ZhihuUtils {
  // a 标签跳转优化
  static aJumpOptimization() {
    window.addEventListener("click", (e) => {
      if (e.target.tagName !== "A") return;
      const href = e.target.href;
      const matchList = href.match(
        /https?:\/\/link\.zhihu\.com\/\?target=(.*)/
      );
      if (!matchList) return;
      if (!matchList[0]) return;
      if (!matchList[1]) return;
      const targetHref = decodeURIComponent(matchList[1]);
      e.preventDefault();
      window.open(targetHref);
    });
  }

  // 初始化问答列表
  static answerListInit() {
    // 旧的列表长度
    let oldListLenght = 0;
    /**
     * @param {HTMLElement} rootEle 根列表元素
     */
    const init = (rootEle) => {
      const listItemDom = Array.from(
        rootEle.querySelectorAll(
          ".Card.TopstoryItem.TopstoryItem--old.TopstoryItem-isRecommend"
        )
      );
      if (listItemDom.length <= 0) {
        oldListLenght = 0;
        return console.log("无数据");
      }
      if (listItemDom.length === oldListLenght) return console.log("数量未变");
      console.log("数量改变，重新计算", oldListLenght, listItemDom.length);
      // 只处理新增的数据
      listItemDom.slice(oldListLenght, listItemDom.length).forEach((item) => {
        const firstChild = item.children[0];
        const cardInfo = JSON.parse(firstChild.dataset?.zaExtraModule ?? "{}");
        if (
          Object.keys(cardInfo).length <= 0 ||
          item.className === "Pc-feedAd-container "
        )
          return ZhihuUtils.hiddenAD(item);
        if (cardInfo?.card?.has_video)
          return ZhihuUtils.hiddenVidelAnswer(firstChild);
      });
      oldListLenght = listItemDom.length;
    };
    const listRootDom = document.querySelector("#TopstoryContent");
    const listRootDomObs = new MutationObserver(() => init(listRootDom));
    listRootDomObs.observe(listRootDom, {
      attributes: false,
      childList: true,
      subtree: true
    });
    init(listRootDom);
  }

  /**
   * @param {HTMLElement} ele 对应的元素
   */
  static hiddenAD(ele) {
    console.log("这个card 是一个广告");
    ele.style.display = "none";
  }

  /**
   * @param {HTMLElement} ele 对应的元素
   */
  static hiddenVidelAnswer(ele) {
    console.log("这是一个视频回答");
    // 标题 dom
    const titleDom = ele.querySelector(".ContentItem-title");
    const titleInnterDom =
      titleDom.querySelector("div") ?? titleDom.querySelector("a");
    // 视频 dom
    const videoDom =
      ele.querySelector(".VideoAnswerPlayer") ??
      ele.querySelector(".ZVideoItem-video");
    if (videoDom) videoDom.style.display = "none";
    // 创建 tag dom
    const tagDom = document.createElement("div");
    // 调整样式
    // tag 样式
    /** @type {CSSStyleDeclaration} **/
    const tagStyleObj = {
      border: `2px solid ${ZHI_HU_BLUE}`,
      borderRadius: "10px",
      padding: "2px 0",
      fontWeight: "400",
      textAlign: "center",
      minWidth: "80px",
      background: "#fff",
      boxSizing: "border-box",
      color: ZHI_HU_BLUE,
      fontSize: "12px",
      marginRight: "10px",
      userSelect: "none"
    };
    for (const key in tagStyleObj) {
      if (Object.hasOwnProperty.call(tagStyleObj, key)) {
        const element = tagStyleObj[key];
        tagDom.style[key] = element;
      }
    }

    // title 样式
    titleDom.style.display = "flex";
    titleDom.style.alignItems = "center";
    titleDom.style.marginBottom = "10px";
    // 插入元素
    tagDom.innerText = "视频回答";
    titleDom.insertBefore(tagDom, titleInnterDom);
  }
}
