// ==UserScript==
// @name         快下歌
// @version      0.1
// @description  解析下歌小增强
// @author       zzy
// @match        http://music.eggvod.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eggvod.cn
// @license      MIT
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/769762
// @downloadURL https://update.greasyfork.org/scripts/450027/%E5%BF%AB%E4%B8%8B%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/450027/%E5%BF%AB%E4%B8%8B%E6%AD%8C.meta.js
// ==/UserScript==

(function () {
  waitForKeyElements("#j-src-btn", showButton());
})();

function showButton() {
  var shortButton, bodyBase;
  shortButton = document.createElement("div");
  bodyBase = document.querySelector("body");
  bodyBase.appendChild(shortButton);
  shortButton.innerHTML = "复制";
  shortButton.style =
    "position:fixed;top:100px;left:30px;width:60px;height:60px;background:red;opacity:0.8;color:white;text-align:center;line-height:60px;cursor:pointer;";
  shortButton.onclick = function () {
    var intro = isCopying();
    if (intro != "") {
      console.log(intro);
      toClip(intro);
      shortButton.innerHTML = "复制成功";
      document.querySelector("#j-src-btn").click();
    } else {
      shortButton.innerHTML = "复制失败";
    }
    var i = 0;
    var t = setInterval(function () {
      shortButton.innerHTML = "复制";
      i++;
      if (i == 2) clearInterval(t);
    }, 1000);
  };
}

function isCopying() {
  var allInfo = "";

  var title = document.querySelector(
    "#j-player > div.aplayer-info > div.aplayer-music > span.aplayer-title"
  ).innerHTML;
  var author = document.querySelector(
    "#j-player > div.aplayer-info > div.aplayer-music > span.aplayer-author"
  ).innerHTML;
  allInfo = title + author + ".mp3";
  return allInfo;
}

function toClip(info) {
  var textArea = document.createElement("textarea");
  textArea.value = info;
  // 使text area不在viewport，同时设置不可见
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
}

function waitForKeyElements(
  selectorTxt,
  actionFunction,
  bWaitOnce,
  iframeSelector
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") {
    targetNodes = $(selectorTxt);
  } else {
    targetNodes = $(iframeSelector).contents().find(selectorTxt);
  }

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) {
          btargetsFound = false;
        } else {
          jThis.data("alreadyFound", true);
        }
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
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
