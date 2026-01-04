// ==UserScript==
// @name         眼不见为净
// @namespace    https://github.com/u1805/Tamperscript
// @version      0.1
// @description  Bilibili 评论屏蔽
// @author       带dai
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @match        https://t.bilibili.com/*
// @icon         data:image/png;base64,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
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454367/%E7%9C%BC%E4%B8%8D%E8%A7%81%E4%B8%BA%E5%87%80.user.js
// @updateURL https://update.greasyfork.org/scripts/454367/%E7%9C%BC%E4%B8%8D%E8%A7%81%E4%B8%BA%E5%87%80.meta.js
// ==/UserScript==

(function () {
  /* 这里配置关键词 */
  const checkers = ["戳啦","你是懂","你说得对，但是","鼠鼠", "打个胶先",
                "😭", "🥵", "😋",
                "好臭", "这么臭的", "114514", "恶臭", "嗯哼哼啊啊啊啊" // 淫梦小鬼
                ];
  
  // 监听回复元素出现
  waitForKeyElements(".reply-content", installCheck); // 视频评论
  waitForKeyElements(".con .text", installCheck); // 动态评论
  waitForKeyElements(".text-con", installCheck); // 动态评论回复

  // 检查
  function installCheck(element) {
    for (tag of checkers) {
      if (element[0].innerText.indexOf(tag) != -1) {
        element[0].setAttribute("reply-data", element[0].innerHTML);
        element[0].innerText = "░".repeat(element[0].innerText.length);

        element[0].addEventListener("click", function () {
          if (element[0].innerText[0] == "░") 
            element[0].innerHTML = element[0].getAttribute("reply-data");
          else 
            element[0].innerText = "░".repeat(element[0].innerText.length);
        });
      }
    }
  }

  function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents().find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      targetNodes.each(function () {
        var jThis = $(this);
        var alreadyFound = jThis.data("alreadyFound") || false;

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound) btargetsFound = false;
          else jThis.data("alreadyFound", true);
        }
      });
    } else {
      btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey];
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function () {
          waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
        }, 300);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }
})();