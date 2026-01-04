// ==UserScript==
// @name         浙江理工大学继续教育学院自动化
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  可自动播放
// @author       大魔法师kuku
// @match        http://*.sccchina.net/*
// @match        http://*.chinaedu.net/*
// @require      https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425293/%E6%B5%99%E6%B1%9F%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/425293/%E6%B5%99%E6%B1%9F%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const interval = 1000;
  let log;
  let action;
  let isTop;
  if (window.top === window.self) {
    isTop = true;
    log = console.log;
    window.addEventListener(
      "message",
      (event) => {
        console.log("log:" + event.data);
      },
      false
    );
  } else {
    isTop = false;
    window.addEventListener(
      "message",
      (event) => {
        if (event.data == "action") {
          nextSession();
        }
      },
      false
    );
    log = (data) => {
      window.top.postMessage(data, "*");
    };
    action = () => {
      window.parent.postMessage("action", "*");
    };
  }

  function doWock(work) {
    let r = work();
    if (!r) {
      setTimeout(doWock, interval, work);
    }
  }

  function findNodeByContent(text, root = document.body) {
    let treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);

    let nodeList = [];

    while (treeWalker.nextNode()) {
      let node = treeWalker.currentNode;

      if (node.value === text) {
        nodeList.push(node);
      }
    }

    return nodeList;
  }

  function findNodeById(id) {
    if (!$) return null;
    var element = $(id);
    if (element.length > 0) return $(id);
    else return null;
  }

  function waitNodeById(id, callback) {
    let element = findNodeById(id);
    if (element) {
      callback(element);
    } else {
      setTimeout(waitNodeById, interval, id, callback);
    }
  }

  function waitObjectByName(name, callback) {
    let object = window[name];
    if (object) {
      callback(object);
    } else {
      setTimeout(waitObjectByName, interval, name, callback);
    }
  }

  function nextSession() {
    let sessions = $("li.leftOneLevel");
    if (sessions.length > 0) {
      let isActive;
      for (let i = 0; i < sessions.length; i++) {
        let session = $(sessions[i]);
        if (isActive) {
          session.children().get(0).click();
          log("自动播放下一课");
          return;
        }
        if (session.hasClass("active")) {
          isActive = true;
        }
      }
      alert("播放结束");
    } else {
      action();
    }
    /*
    let sessions = $("li.leftTwoLevel");
    if (sessions.length > 0) {
      let isActive;
      for (let i = 0; i < sessions.length; i++) {
        let session = $(sessions[i]);
        if (isActive) {
          if (session.children().get(0).title == "本章自测") continue;

          session.children().get(0).click();
          doWock(() => {
            let btns = $("a.resBtn");
            if (btns.length < 6) return false;

            btns.get(4).click();
            return true;
          });
          log("自动播放下一课");
          return;
        }
        if (session.hasClass("active")) {
          isActive = true;
        }
      }
      alert("播放结束");
    } else {
      action();
    }*/
  }

  if (isTop) {
    log("开始运行");
    setInterval(() => {
      let btns = findNodeByContent("确定");
      if (btns.length > 0) {
        btns[0].click();
        log("自动点击确定");
      }
    }, 1000);
  } else {
    log("开始运行");
    waitNodeById("#pop", (pop) => {
      var p = pop.children("p");
      pop.children("p").first().text("浙江理工大学继续教育学院自动化");
    });
    waitObjectByName("videojs", (videojs) => {
      if (videojs.players.videoFrame_video.ended()) {
        log("播放结束");
        nextSession();
      }

      videojs.players.videoFrame_video.on("ended", () => {
        log("播放结束");
        nextSession();
      });
    });
  }
})();
