// ==UserScript==
// @name         XueTangZaiXian Auto Play
// @namespace    https://www.xuetangx.com/
// @version      0.1
// @description  Auto play vidoes on XTZX.
// @author       Shaun Young
// @match        https://www.xuetangx.com/learn/*
// @icon         https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetangxXImg/logo.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426230/XueTangZaiXian%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/426230/XueTangZaiXian%20Auto%20Play.meta.js
// ==/UserScript==

const data = {
  // 获取任务列表
  handleGetAllSections() {
    // 获取节点列表
    let all = document.querySelectorAll('.titlespan.noScore');
    // 转换为数组
    all = Array.apply(null, all);
    return all;
  },

  // 获取当前任务
  handleGetCurrentSection() {
    // 获取当前任务元素
    let current = document.querySelector('.title.active').children[1];
    return current;
  },

  // 监测视频是否播放完毕
  handleCheckPlayEnd() {
    // 如果视频左下角两个时间相等，则播放完毕
    if (
      document.querySelector('.xt_video_player_current_time_display.fl')
        .children[0].innerHTML ===
      document.querySelector('.xt_video_player_current_time_display.fl')
        .children[1].innerHTML
    ) {
      return true;
    } else {
      return false;
    }
  },

  // 判断是否为测试
  isTest() {
    if (
      document.querySelector('.xt_video_player_current_time_display.fl') ===
      null
    ) {
      return true;
    } else {
      return false;
    }
  },

  // 获取播放任务号
  handleGetPlay(all) {
    // 获取当前任务节点
    let current = this.handleGetCurrentSection();
    // 获取正在进行的任务号
    let play = all.indexOf(current);
    return play;
  },
};
(function () {
  'use strict';
  // 延迟 5 秒执行
  setTimeout(() => {
    // 获取任务节点列表
    let all = data.handleGetAllSections();
    // 获取正在进行的任务号
    let play = data.handleGetPlay(all);
    // 若任务存在
    if (play !== -1) {
      // 每5秒检查一次视频播放是否完毕
      setInterval(() => {
        // 若为测试
        if (data.isTest()) {
          // 更新 play
          play = data.handleGetPlay(all);
          // 点击下一个任务
          all[play + 1].click();
        }
        if (data.handleCheckPlayEnd()) {
          // 若播放完毕
          // 更新 play
          play = data.handleGetPlay(all);
          // 点击下一个任务
          all[play + 1].click();
        }
      }, 5000);
    } else {
      window.alert('Error! Please contact the developer!');
    }
  }, 5000);
})();