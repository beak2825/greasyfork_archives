// ==UserScript==
// @name         Tapd 故事墙打开任务详情
// @namespace    https://github.com/PRC-Cc/Tampermonkey.git
// @version      0.3
// @description  在tapd故事墙单项标题后添加详情按钮，用于打开任务详情
// @author       Cache
// @match        https://www.tapd.cn/*/storywalls*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/413817/Tapd%20%E6%95%85%E4%BA%8B%E5%A2%99%E6%89%93%E5%BC%80%E4%BB%BB%E5%8A%A1%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/413817/Tapd%20%E6%95%85%E4%BA%8B%E5%A2%99%E6%89%93%E5%BC%80%E4%BB%BB%E5%8A%A1%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function () {
  function insertAfter(newEl, targetEl) {
    const parentEl = targetEl.parentNode;
    if (parentEl.lastChild == targetEl) {
      parentEl.appendChild(newEl);
    } else {
      parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
  }

  function isParent(obj, parentObj) {
    while (
      obj != undefined &&
      obj != null &&
      obj.tagName.toUpperCase() != "BODY"
    ) {
      if (obj == parentObj) {
        return true;
      }
      obj = obj.parentNode;
    }
    return false;
  }

  const STATUS_COLOR_MAP = {
    NORMAL: "#bfbfbf",
    HOVER: "#8a8a8a",
    SUCCESS: "#1296db",
    FAIL: "#d81e06",
  };
  const triggerElements = [];

  window.addEventListener(
    "click",
    (e) => {
      const triggerElement = triggerElements.find(
        ([item]) => item === e.target || isParent(e.target, item)
      );
      if (!triggerElement) return;
      const [ele, callback] = triggerElement;
      e.stopImmediatePropagation();
      e.stopPropagation();
      callback();
    },
    true
  );

  window.onload = function () {
    document
      .querySelectorAll("#resource_table > tbody > tr")
      .forEach(function (tr) {
        const stories = tr.querySelectorAll("li[story_id]");
        stories.forEach(function (li) {
          const storyId = li.getAttribute("story_id");
          const title = li.querySelector(".note_head");
          title.style.display = "flex";
          title.style["justify-content"] = "space-between";

          const containerEle = document.createElement("div");
          containerEle.style.cursor = "pointer";

          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          svg.style.width = "14px";
          svg.style.padding = "0 2px";

          svg.setAttribute("viewBox", "0 0 1024 1024");
          svg.setAttribute("version", "1.1");
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          path.setAttribute(
            "d",
            "M938.666667 512a42.666667 42.666667 0 0 0-42.666667 42.666667v298.666666c0 23.573333-19.093333 42.666667-42.666667 42.666667H170.666667c-23.573333 0-42.666667-19.093333-42.666667-42.666667V170.666667c0-23.573333 19.093333-42.666667 42.666667-42.666667h298.666666a42.666667 42.666667 0 0 0 0-85.333333H170.666667C99.978667 42.666667 42.666667 99.978667 42.666667 170.666667v682.666666c0 70.688 57.312 128 128 128h682.666666c70.688 0 128-57.312 128-128V554.666667a42.666667 42.666667 0 0 0-42.666666-42.666667z m42.666666-426.666667v256a42.666667 42.666667 0 0 1-85.333333 0V188.330667l-349.557333 349.546666a42.666667 42.666667 0 0 1-60.32-60.330666L835.658667 128H682.666667a42.666667 42.666667 0 0 1 0-85.333333h256a42.666667 42.666667 0 0 1 42.666666 42.666666z"
          );
          path.setAttribute("fill", STATUS_COLOR_MAP.NORMAL);
          svg.appendChild(path);

          containerEle.addEventListener("mouseenter", function () {
            path.setAttribute("fill", STATUS_COLOR_MAP.HOVER);
          });
          containerEle.addEventListener("mouseleave", function () {
            path.setAttribute("fill", STATUS_COLOR_MAP.NORMAL);
          });

          triggerElements.push([
            containerEle,
            () => {
              const detailPath = location.href.replace(
                /(https:\/\/www.tapd.cn\/.*\/)storywalls.*/,
                "$1" + "stories/view/" + storyId
              );
              window.open(detailPath);
            },
          ]);

          containerEle.appendChild(svg);
          insertAfter(containerEle, title.firstElementChild);
        });
      });
  };
})();
