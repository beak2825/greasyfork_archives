// ==UserScript==
// @name         青书学堂挂课自动连续播放
// @namespace    http://tampermonkey.net/
// @version      0.15.2
// @description  一个网课挂机自动连续播放工具，仅适用于青书学堂www.qingshuxuetang.com，反馈与交流QQ群：715307684，更新日期：2022年12月9日
// @author       哆哆啦啦梦
// @match        *://qingshuxuetang.com/*
// @match        *://*.qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453283/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453283/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 隐藏登录用户信息
  const userInfoEl = document.querySelector("#userInfo");
  if (userInfoEl) {
    userInfoEl.style.display = "none";
  }
  const href = location.href;
  const idFlag = 'nodeId';
  if (href.indexOf(idFlag) > -1) {
    setTimeout(function () {
      const lessonIdList = [];
      // 获取所有课程（包含概述和讲授）
      const lessonList = document.querySelectorAll("#lessonList li a[id]");
      // 遍历添加到idList
      for (let i = 0; i < lessonList.length; i++) {
        // 去除课程ID中的courseware-
        // 例如：courseware-kcjs_1_1 => kcjs_1_1
        lessonIdList.push(lessonList[i].id.replace("courseware-", ""));
      }
      // 解析url
      const params = new UrlSearch();
      // 课程ID
      const courseId = params.courseId;
      // 视频ID
      const cwNodeId = params[idFlag];
      // 结束标志
      let endFlag = false;
      // 获取nextKey
      let nextKey = null;
      const index = lessonIdList.findIndex((e) => e === cwNodeId);
      // 判断是否为最后一个视频
      if (index === -1) {
        // 取第一个
        nextKey = lessonIdList[0];
      } else if (index === lessonIdList.length - 1) {
        endFlag = true;
      } else {
        nextKey = lessonIdList[index + 1];
      }
      // 提取nextCate
      // const nextCate = nextKey && nextKey.split("_")[0];
      // 下一个视频组件
      // const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&nodeId=${nextKey}&category=${nextCate}`;
      // 没有category了
      const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&${idFlag}=${nextKey}`;
      console.log(
        params,
        "currentId:",
        params[idFlag],
        "nextKey:",
        nextKey,
        "nextUrl:",
        nextUrl
      );
      // 获取所有视频组件
      const videos = document.getElementsByTagName("video");
      // 检查是否存在视频组件
      if (videos.length) {
        const video = document.getElementsByTagName("video")[0];
        console.log("找到视频组件,开始静音并自动播放...", video);
        // 设置静音并播放
        video.muted = true;

        // 播放速率，可自行修改0.5,1,1.25,1.5,2
        video.playbackRate = 1;

        video.play();

        if (!endFlag) {
          // 视频播放结束,自动下一条视频
          video.addEventListener("ended", function () {
            // 延迟跳转
            setTimeout(() => {
              location.replace(nextUrl);
            }, 5000 + new Date().getMilliseconds());
          });
        } else {
          console.log("播放结束,不存在下一个播放视频.");
          alert("播放结束,不存在下一个播放视频.");
        }
      } else {
        console.log(
          `不存在视频播放组件,当前课程ID:${courseId},视频ID:${cwNodeId}`
        );

        if (!endFlag) {
          // 延迟跳转
          setTimeout(() => {
            location.replace(nextUrl);
          }, 5000 + new Date().getMilliseconds());
        } else {
          console.log("播放结束,不存在下一个播放视频.");
          alert("播放结束,不存在下一个播放视频.");
        }
      }
    }, 5000 + new Date().getMilliseconds());

    // 打印播放进度
    getvideoprogress();
  }
})();

function checkWorkTime() {
  // 不检查时间
  return true;
  const hour = new Date().getHours();
  if (hour < 9 || hour > 22) {
    return false;
  } else {
    return true;
  }
}

function UrlSearch() {
  var name, value;
  var str = location.href; //取得整个地址栏
  var num = str.indexOf("?");
  str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

  var arr = str.split("&"); //各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}

// 检测当前播放的进度
function getvideoprogress() {
  setInterval(function () {
    const videos = document.getElementsByTagName("video");
    if (!checkWorkTime()) {
      const hour = new Date().getHours();
      const mins = new Date().getMinutes();
      // 非工作时间
      console.log("非工作时间:", hour, mins);
      if (videos.length) {
        // 非暂停 情况下 暂停视频
        !videos[0].paused && videos[0].pause();
      }
    } else {
      if (videos.length) {
        const currentTime = videos[0].currentTime.toFixed(1);
        const totalTime = videos[0].duration.toFixed(1);
        console.log(
          `当前进度:${currentTime}/${totalTime},状态:${
            videos[0].paused ? "暂停" : "播放"
          }`
        );
        // 暂停 情况下 播放视频
        videos[0].paused && videos[0].play();
      }
    }
  }, 30000);
}
