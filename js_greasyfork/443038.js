// ==UserScript==
// @name         B站多倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  B站内置多倍速播放
// @author       Candy.
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443038/B%E7%AB%99%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/443038/B%E7%AB%99%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

window.isDOMLoaded = false;
window.isDOMRendered = false;

document.addEventListener('readystatechange', function () {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    window.isDOMLoaded = true;
  }
});

(function () {
  'use strict';

  function processClass(parent, cur) {
    for (let ele of parent.children) {
      ele.className = "bpx-player-ctrl-playbackrate-menu-item"
    }
    cur.className = "bpx-player-ctrl-playbackrate-menu-item bpx-state-active"
  }


  function sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

  function insertLi(videoEle, speedUl, btn, rate) {
    var speedLi = document.createElement("li")
    speedLi.className = "bpx-player-ctrl-playbackrate-menu-item"
    if (typeof rate === 'number') {
      speedLi.dataset.value = rate
      speedLi.innerHTML = rate.toFixed(1) + 'x'
      speedLi.addEventListener('click', function (e) {
        processClass(speedUl, speedLi)
        videoEle.playbackRate = rate
        btn.innerHTML = rate.toFixed(1) + 'x'
        e.stopPropagation()
      })
      speedUl.addEventListener('click', function (e) {
        if (speedLi.className !== "bpx-player-ctrl-playbackrate-menu-item") {
          speedLi.className = "bpx-player-ctrl-playbackrate-menu-item"
        }
      })
    } else {
      speedLi.innerHTML = rate
      speedLi.addEventListener('click', function (e) {
        let userRate = parseFloat(Number(prompt("请输入倍速播放速率")).toFixed(1))
        if (userRate) {
          insertLi(videoEle, speedUl, btn, userRate)
        }
        e.stopPropagation()
      })
    }
    if (speedUl.firstElementChild.innerHTML !== '自定义') {
      speedUl.prepend(speedLi)
    } else {
      speedUl.firstElementChild.after(speedLi)
    }

  }

  function mainProcess(insertLi) {
    var videoEle = document.getElementsByTagName("video")[0]
    var speedUl = document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0]
    var btn = document.getElementsByClassName('bpx-player-ctrl-playbackrate-result')[0]
    if(speedUl.children[0].innerHTML !== "自定义"){
    insertLi(videoEle, speedUl, btn, 2.5)
    insertLi(videoEle, speedUl, btn, 3.0)
    insertLi(videoEle, speedUl, btn, "自定义")
    }
  }

  sleep(5000).then(
    () => {
      var targetNode = document.getElementsByClassName('list-box')[0]
      if (targetNode) {
        var config = {
          attributes: true,
          childList: true,
          subtree: true
        };
        var count = 0
        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList, observer) {
          ++count
          if (count === 1) return
          if (count === 2) {
            // 执行插入程序
            mainProcess(insertLi)
            count = 0
          }
        };
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);
        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
      }
      mainProcess(insertLi)
    }

  )
  // Your code here...
})();