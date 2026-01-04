// ==UserScript==
// @name         AutoZjooc | 在浙学自动刷课
// @namespace    Albresky
// @version      0.0.4
// @description  [Zjooc|在浙学] 自动刷章节视频|文档，支持0-16倍速，支持后台播放，视频静音。
// @author       Albresky
// @include      /^https:\/\/www\.zjooc\.cn\/ucenter\/student\/course\/study\/.*/plan\/detail\/.+$
// @include      /^https:\/\/www\.zjooc\.cn\/ucenter\/student\/course\/study\/.*/test\/do\/.+$
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         https://www.zjooc.cn/favicon.ico
// @license      GPLv3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/464751/AutoZjooc%20%7C%20%E5%9C%A8%E6%B5%99%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464751/AutoZjooc%20%7C%20%E5%9C%A8%E6%B5%99%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function mLog(text) {
    console.log(new Date().toLocaleTimeString() + " | [AutoZjooc] " + text);
  }

  mLog("Script starts.");

  let videoRate = 1; // 倍速播放视频的倍数，最大为16倍，默认为16倍，网速慢的话可以调小一些，防止卡顿
  let startFromSelected = true; // 是否从当前选中的章节开始刷课
  let v_mute = true; // 是否静音
  let delay = 1000; // 某些环节等待加载的延迟，如果网络卡顿可以调大一些（单位ms）
  let autoRestartDelay = 5000; // 重新开始任务的延迟，如果网络卡顿可以调大一些（单位ms）
  let recent_loaded_delay = 8000; // 视频加载失败时的页面刷新 timestamp delay (单位ms)
  let videoRightLoadDelay = 1000; // 检测视频是否加载成功的延迟（单位ms）
  let videoValidCheckDelay = 60000; // 视频有效性检查的周期（单位ms）
  let enableFloatTime = true;

  const regExamPath = new RegExp(
    "^/ucenter/student/course/study/.*/test/do/.+$",
    "g"
  );
  const floatStyle =
    "background: rgb(0, 49, 168);color: rgb(255, 255, 255);right: 50%;height: auto;top: 0%;margin-right: -70px;width: 140px;overflow: hidden;z-index: 9999;margin-top: -6px;padding: 8px;position: fixed;text-align: center;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;";

  let win = unsafeWindow;
  let winDoc = unsafeWindow.document;

  let labelList = [];
  let dirList = [];

  let labelNow = null;
  let dirNow = null;

  let dirIndex = 0;
  let labelIndex = 0;

  if (videoRate < 0 || videoRate > 16) {
    videoRate = 16;
    mLog("视频倍速不得大于16倍或小于0！");
  }
  if (delay < 0) {
    delay = 2000;
    mLog("delay不得小于0！");
  }
  if (autoRestartDelay < 1000) {
    autoRestartDelay = 5000;
    mLog("autoRestartDelay不得小于1000！");
  }

  let nullFunction = function () {};
  let find = {
    // 获取当前所在章节标题
    _curChapterTitle: ".el-header>ul>li",
    curChapterTitle: function () {
      let title = winDoc.querySelectorAll(this._curChapterTitle)[0].innerHTML;
      return title;
    },

    // 获取当前小节标题
    _curTitle: ".el-header>ul>li",
    curTitle: function () {
      let title = winDoc.querySelectorAll(this._curTitle)[1].innerHTML;
      return title;
    },

    // 查找当前所在类函数的集合
    _curDir: "#pane-Chapter>div>ul>li.el-submenu>ul>li.is-active>span",
    curDir: function () {
      // 获取当前所在小章节
      let dir = winDoc.querySelector(this._curDir);
      return dir;
    },

    // 查找类函数的集合
    _dir: "#pane-Chapter>div>ul>li.el-submenu>ul>li>span",
    dir: function () {
      // 获取每一个小章节存入数组
      let list = winDoc.querySelectorAll(
        "#pane-Chapter>div>ul>li.el-submenu>ul>li>span"
      );
      // 从当前选中的章节开始刷课
      if (startFromSelected) {
        let __curTitle = find.curTitle();
        for (let i = 0; i < list.length; i++) {
          if (list[i].innerHTML == __curTitle) {
            dirIndex = i;
            break;
          }
        }
      }
      return list;
    },

    _videoLabel: "div>span.label>i.icon-shipin:not(.complete)+span",
    videoLabel: function () {
      // 获取每个小节未看的视频标签存入数组
      let list = winDoc.querySelectorAll(this._videoLabel);
      return list;
    },

    _docLabel: "div>span.label>i:not(.icon-shipin):not(.complete)+span",
    docLabel: function () {
      // 获取每个小节未看的非视频标签存入数组
      let list = winDoc.querySelectorAll(this._docLabel);
      return list;
    },

    label: function () {
      // 获取小节内所有标签（先所有视频，再所有文档）
      let videoLabel = find.videoLabel();
      let docLabel = find.docLabel();
      let list = new Array(videoLabel.length + docLabel.length);
      for (let i = 0; i < videoLabel.length; ++i) {
        list[i] = videoLabel[i];
      }
      for (let i = 0; i < docLabel.length; ++i) {
        list[videoLabel.length + i] = docLabel[i];
      }
      return list;
    },

    _button: "div>div>div.contain-bottom>button",
    button: function () {
      // 获取当前文档的“完成学习”按钮并返回
      let btn = winDoc.querySelector("div>div>div.contain-bottom>button");
      return btn;
    },
  };

  function doAfterLoad(selector, event, interval = 1000) {
    // 当元素加载后执行指定函数
    let scan = setInterval(() => {
      let load = winDoc.querySelector(selector);
      if (load) {
        stop(scan);
        event();
      }
    }, interval);
    function stop(obj) {
      clearInterval(obj);
    }
  }

  function onVideoLoadFail() {
    mLog("Video loading failed, reload page.");
    GM_setValue("zjooc_last_loaded", Date.now());
    location.reload();
  }

  function videoIntervalCheck() {
    // 每个一段时间检查视频是否在播放，如果不在播放则刷新网页
    let scan = setInterval(() => {
      let _video = winDoc.querySelector("video");
      if (_video) {
        let btnPause = $("[class^='pausech']");
        if (btnPause.length > 0) {
          // If the video is playing normally, click pause button will pause it, and the loading animation will not show.
          btnPause[0].click();
          if (!checkVideoRightLoaded()) {
            clearInterval(scan);
            onVideoLoadFail();
          } else {
            mLog("Video is loaded normally.");
            let btnPlay = $("[class^='playch']");
            if (btnPlay.length > 0) {
              btnPlay[0].click();
            }
          }
        }
      }
    }, videoValidCheckDelay);
  }

  function nextDir() {
    // 跳转至下一小节
    if (++dirIndex > dirList.length - 1) {
      end();
    } else {
      expandChapterNode(dirList[dirIndex]);
      dirList[dirIndex].click();
      dirNow = dirList[dirIndex];
      setTimeout(() => {
        labelList = find.label();
        labelIndex = 0;
        labelNow = labelList[0];
        if (labelList.length == 0) {
          nextDir();
        } else {
          labelNow.click();
          setTimeout(() => {
            if (winDoc.querySelector("video")) {
              videoPlay(nextLabel);
            } else {
              find.button().click();
              setTimeout(() => {
                nextLabel();
              }, delay);
            }
          }, delay);
        }
      }, delay);
    }
  }

  function nextLabel() {
    // 点击下一个未观看的视频标签
    if (++labelIndex > labelList.length - 1) {
      nextDir();
    } else {
      labelList[labelIndex].click();
      labelNow = labelList[labelIndex];
      setTimeout(() => {
        if (winDoc.querySelector("video")) {
          videoPlay(nextLabel);
        } else {
          find.button().click();
          setTimeout(() => {
            nextLabel();
          }, delay);
        }
      }, delay);
    }
  }

  function checkVideoRightLoaded() {
    // 检查视频是否加载成功
    let v_progress = $("[class^='timetext']")[0].innerText;
    if (v_progress == "00:00 / 00:00") {
      return false;
    }
    // setTimeout(() => {
    let _loading = $("[class^='loadingch']");
    if (
      _loading &&
      _loading.length > 0 &&
      _loading[0].style.display == "block"
    ) {
      return false;
    }
    return true;
    // }, videoRightLoadDelay);
  }

  function muteVideo() {
    // 使静音视频
    let muteNode = $("[class^='mutech']");
    if (muteNode && muteNode.length == 2) {
      if (muteNode[0].style.display == "block") muteNode[0].click();
    }
  }

  function videoPlay(afterEvent = nullFunction) {
    // 播放当前页面的视频并指定播放完之后执行的函数
    doAfterLoad("video", () => {
      let video = winDoc.querySelector("video");
      if (!checkVideoRightLoaded()) {
        onVideoLoadFail();
        return;
      }
      if (v_mute) {
        muteVideo();
      }
      videoIntervalCheck();
      video.playbackRate = videoRate; // 调倍速
      video.play(); // 开始播放视频
      video.addEventListener("ended", () => {
        // 监听视频是否播放完毕
        afterEvent();
      });
    });
  }
  function end() {
    //结束函数
    winDoc.querySelector("#passButton").innerHTML = "完成！";
    GM_addStyle(`
                #passButton{
                    background-color:#e67e22
                }
            `);
  }

  function expandChapterNode(unitNode) {
    // 自动展开章节节点
    let chapterNode = unitNode.parentNode.parentNode.parentNode;
    if (!chapterNode) {
      mLog("chapterNode is null");
      return;
    }
    let menuNode = chapterNode.querySelector("ul");
    if (menuNode && menuNode.getAttribute("style")) {
      menuNode.removeAttribute("style");
    }
    if (chapterNode.getAttribute("aria-expanded") != "true") {
      chapterNode.setAttribute("aria-expanded", "true");
    }
    let classList = chapterNode.classList;
    if (!classList.contains("is-active")) {
      classList.add("is-active");
    }
    if (!classList.contains("is-opened")) {
      classList.add("is-opened");
    }
  }

  function recent_loaded() {
    let last_loaded_time = GM_getValue("zjooc_last_loaded", 0);
    if (last_loaded_time > 0) {
      let last_loaded_time_delta = Date.now() - last_loaded_time;
      mLog("last_loaded_time_delta:" + last_loaded_time_delta + "ms");
      GM_deleteValue("zjooc_last_loaded");
      if (last_loaded_time_delta < recent_loaded_delay) {
        mLog("Recent loaded.");
        return true;
      }
    } else {
      GM_deleteValue("zjooc_last_loaded");
      return false;
    }
  }

  function floatTime() {
    let _timer = setInterval(() => {
      let timeDiv = winDoc.querySelectorAll("div>.ta-c>p");
      if (timeDiv && timeDiv.length >= 2) {
        if (timeDiv[1].innerHTML.startsWith("\n 倒计时")) {
          timeDiv[1].style = floatStyle;
          mLog("Float time enabled.");
        }
        clearInterval(_timer);
      }
    }, 200);
  }

  function main() {
    setTimeout(() => {
      dirList = find.dir();
      mLog("dirIndex:" + dirIndex);
      dirNow = dirList[dirIndex];
      expandChapterNode(dirNow);
      dirNow.click();
      setTimeout(() => {
        labelList = find.label();
        labelIndex = 0;
        labelNow = labelList[0];
        if (labelList.length == 0) {
          nextDir();
        } else {
          labelNow.click();
          setTimeout(() => {
            if (winDoc.querySelector("video")) {
              labelNow.click();
              videoPlay(nextLabel);
            } else {
              //buttonNow.click()
              find.button().click();
              setTimeout(() => {
                nextLabel();
              }, delay);
            }
          }, delay);
        }
      }, delay);
    }, delay);
  }

  if (enableFloatTime && regExamPath.test(location.pathname)) {
    floatTime();
  } else {
    let passButton = winDoc.createElement("button");
    passButton.id = "passButton";
    passButton.innerHTML = "开始刷课";
    win.onload = () => {
      // 页面加载时添加按钮
      let header = winDoc.querySelector("#app>div>section>section>header");
      header.appendChild(passButton);
      passButton.onclick = () => {
        mLog("passButton clicked.");
        // 指定按钮点击事件
        main();
        passButton.innerHTML = "刷课中…";
        GM_addStyle(`
                #passButton{
                    background-color:#53555e
                }
      `);
        // 按钮点击后移除点击事件
        passButton.onclick = nullFunction;
      };
    };
    // 定义按钮样式
    GM_addStyle(`
        #passButton{
            background-color: #1192ff;
            color: white;
            text-align: center;
            padding: 0px 32px;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
        }
  `);

    // 视频加载失败后自动重启任务
    if (recent_loaded()) {
      mLog(
        "Page was recent loaded, auto start in " + autoRestartDelay + " ms."
      );
      setTimeout(() => {
        passButton.click();
      }, autoRestartDelay);
    }
  }
})();
