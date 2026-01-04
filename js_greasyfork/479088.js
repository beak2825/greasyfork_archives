// ==UserScript==
// @name        根据 UP 来指定视频起始位置 - bilibili.com
// @namespace   randomScript
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0.1-u4
// @author      SakuraYuyuko
// @license     WTFPL
// @description 如果 UP 存在于下面的列表，那么每次看他的视频就会自动从下面设置的时间戳开始播放
// @downloadURL https://update.greasyfork.org/scripts/479088/%E6%A0%B9%E6%8D%AE%20UP%20%E6%9D%A5%E6%8C%87%E5%AE%9A%E8%A7%86%E9%A2%91%E8%B5%B7%E5%A7%8B%E4%BD%8D%E7%BD%AE%20-%20bilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/479088/%E6%A0%B9%E6%8D%AE%20UP%20%E6%9D%A5%E6%8C%87%E5%AE%9A%E8%A7%86%E9%A2%91%E8%B5%B7%E5%A7%8B%E4%BD%8D%E7%BD%AE%20-%20bilibilicom.meta.js
// ==/UserScript==

(function() {

  // uid -> startAt(s)
  upList = {
    // 起飞警示，前 10 秒那个 AI 配音烦人
    373838238: 10.0,
    // https://space.bilibili.com/1963346088
    1963346088: 7.5,
    1587546000: 5,
    1312505439: 10,
  }

  // 获取 UID
  upSpaceLink = document.querySelector("#app > div.video-container-v1 > div.right-container.is-in-large-ab > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name");
  upSpaceLink = upSpaceLink.href.split("/");
  upUid = upSpaceLink[upSpaceLink.length - 1];

  startAt = upList[upUid];
  if (startAt === undefined) {
    return;
  }

  document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div > video").currentTime = startAt;

})();
