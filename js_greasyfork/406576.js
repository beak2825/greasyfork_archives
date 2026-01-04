// ==UserScript==
// @name         语雀助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       logeast
// @match        https://www.yuque.com/changtou/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406576/%E8%AF%AD%E9%9B%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406576/%E8%AF%AD%E9%9B%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  window.onload = () => {
    const nameList = [
      "夜白",
      "小八",
      "小梨子肉肉哒",
      "吴思蒂",
      "心心",
      "芒果",
      "丸子",
      "🌻",
      "多走走，多看看",
      "即锋-刘秋平-13591189128",
      "越自信越美丽",
      "吉吉",
      "清 风🌴🌴",
      "小美美",
      "whisper",
      "向东",
      "one",
      "喜喜",
      "艾一艾",
      "时尚嘉韵",
      "Christina Pan",
      "民生九龙李小镇",
      "杨清苹",
      "小邱",
      "莲安。",
      "嘻嘻我是卉哥🙄",
      "豆_子📿",
      "🚲旭坛",
      "Y、HH",
      "C_丹莉",
      "红装素裹",
    ];

    const getTargetName = () => {
      let _targetName = [];
      const parent = document.querySelector(".ant-list-items");
      const commenters = parent && parent.querySelectorAll(".commenter");
      Array.from(commenters).map((item) => {
        _targetName.push(item.querySelector("a").innerText);
      });
      return _targetName;
    };

    const targetNameSet = new Set(getTargetName());
    const finished = [
      //...new Set(nameList.filter((item) => targetNameSet.has(item))),
      ...getTargetName()
    ];
    const delay = [
      ...new Set(nameList.filter((item) => !targetNameSet.has(item))),
    ];

    const result = `已完成👍(${finished.length}): ${
      finished.join("，") || "暂无人完成..."
    }

未完成👎(${delay.length}): ${delay.join("，") || "全部完成啦！"}`;

    const copy = (str) => {
      let result = false;
      let save = (e) => {
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
      };
      document.addEventListener("copy", save);
      result = document.execCommand("copy");
      document.removeEventListener("copy", save);
      return result;
    };

    const createCopyButton = () => {
      const btnStyle = `
        position: absolute;
        right: 1em;
        top: 1em;
        z-index: 999999;
      `;
      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute("style", btnStyle);
      button.setAttribute("class", "ant-btn ant-btn-primary");
      button.innerText = "复制名单";

      const parentNode = document.querySelector(".post");

      parentNode.append(button);

      button.addEventListener("click", (event) => {
        copy(result) ? (event.target.innerText = "复制成功") : null;
        setTimeout(() => {
          event.target.innerText = "复制名单";
        }, 1500);
      });
    };
    createCopyButton();

    console.log(result);
  };
})();
