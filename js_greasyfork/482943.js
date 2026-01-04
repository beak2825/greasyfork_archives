// ==UserScript==
// @name         抖音自动高清
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.7
// @description  douyin high
// @match       *://*.douyin.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482943/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/482943/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85.meta.js
// ==/UserScript==
(async () => {
  var duration = "";
  setInterval(function () {
      try {
        document.querySelector("#trust-logout-dialog").remove();
      } catch (error) {}
      var virtual = document.getElementsByClassName("virtual");
      if (virtual.length > 0) {
          for (var i = 0; i < virtual.length; i++) {
              var item = virtual[i];
              for (var j = 0; j < item.children.length; j++) {
                  var cilck = item.children[j];
                  if (
                      cilck.innerText === "高清" &&
                      cilck.className.indexOf("selected") < 0
                  ) {
                     // cilck.click();
                  }
              }
          }
      }
      var divs = document.getElementsByTagName("div");
      if (divs.length > 0) {
          for (var i = 0; i < divs.length; i++) {
              var div = divs[i];
              if (div.outerText.indexOf("任意操作可继续播放")>0 ) {
                  div.click();
              }
          }
      }
      var OG51D9OO = document.getElementsByClassName("OG51D9OO");
      if (OG51D9OO.length > 0) {
          OG51D9OO[0].click();
      }

  }, 3000);
  var name1 = "";
  var name2 = "";
  var isSkip = false;
  setInterval(function () {
      /*try {
          var temp0 = timeStringToSeconds(document.getElementsByClassName("time-duration")[1].innerText);
          if ( temp0 == 0 ) {
              name1 = "";
              name2 = "";
              isSkip = false;
              return;
          }
      } catch (error) {
          name1 = "";
          name2 = "";
          isSkip = false;
          return;
      }
      try {
          var name = document.getElementsByClassName("account-name")[1].innerText;
          isSkip = false;
          if (name == name1) {
              if (name1 == name2) {
                  isSkip = true;
              } else {
                  name2 = name;
              }
          } else {
              name1 = name;
              isSkip = false;
          }
      } catch (error) {
          name1 = "";
          name2 = "";
          isSkip = false;
          return;
      }
      try {
          if ( isSkip ) {
              return;
          }
      } catch (error) {}*/
      try {
          var checked = document.getElementsByClassName("xg-switch-checked");
          if ( checked.length == 0) {
              return;
          }
      } catch (error) {
          return;
      }
      try {
          var temp0 = timeStringToSeconds(document.getElementsByClassName("time-duration")[1].innerText);
          if ( temp0 == 0 ) {
              return;
          }
      } catch (error) {
          return;
      }
      try {
          var temp = timeStringToSeconds(document.getElementsByClassName("time-duration")[1].innerText);
          if (temp > 300) {
              document.getElementsByClassName("xgplayer-playswitch-next")[0].click();
              console.error('tooLong');
          }
      } catch (error) {}
      try {
          if (getDateStringDifference(parseTime(document.getElementsByClassName("video-create-time")[1].innerText.trim()
                  .replace("· ", ""))) > 2) {
              document.getElementsByClassName("xgplayer-playswitch-next")[0].click();
              console.error('overTime');
          }
      } catch (error) {}
      try {
          if (document.getElementsByClassName("FJhgcCvF")[1].querySelectorAll('div')[1].classList.contains('BRVFKf2N')) {
              document.getElementsByClassName("xgplayer-playswitch-next")[0].click();
              console.error('ads');
          }
      } catch (error) {}
      try {
          if (document.getElementsByClassName("account")[1].querySelectorAll('svg').length>0) {
              document.getElementsByClassName("xgplayer-playswitch-next")[0].click();
              console.error('ads');
          }
      } catch (error) {}
  }, 200);

  function parseTime(timeString) {
      const currentTime = new Date();

      // 判断是否是相对时间字符串
      if (timeString.includes("小时前")) {
          const hours = parseInt(timeString);
          currentTime.setHours(currentTime.getHours() - hours);
          return currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      } else if (timeString.includes("天前")) {
          const days = parseInt(timeString);
          currentTime.setDate(currentTime.getDate() - days);
          return currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      } else if (timeString.includes("周前")) {
          const weeks = parseInt(timeString);
          currentTime.setDate(currentTime.getDate() - weeks * 7);
          return currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
          // 尝试解析为日期字符串
          const matchYearMonthDay = timeString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (matchYearMonthDay) {
              const year = parseInt(matchYearMonthDay[1]);
              const month = parseInt(matchYearMonthDay[2]) - 1;
              const day = parseInt(matchYearMonthDay[3]);
              const inputTime = new Date(year, month, day);
              if (!isNaN(inputTime.getTime())) {
                  return inputTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
              }
          } else {
              // 获取当年
              const currentYear = currentTime.getFullYear();

              // 用当年的月日去转换
              const matchMonthDay = timeString.match(/(\d{1,2})月(\d{1,2})日/);
              if (matchMonthDay) {
                  const month = parseInt(matchMonthDay[1]) - 1;
                  const day = parseInt(matchMonthDay[2]);
                  const inputTime = new Date(currentYear, month, day);
                  if (!isNaN(inputTime.getTime())) {
                      return inputTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
                  }
              }
          }
      }

      // 如果无法解析，返回错误信息
      return "无法解析时间";
  }


  function getDateStringDifference(dateString) {
      // 获取当前日期
      const currentDate = new Date();

      // 从日期字符串中提取年、月、日
      const match = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (!match) {
          return "无效的日期格式";
      }
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // 月份从0开始，所以要减去1
      const day = parseInt(match[3]);

      // 使用提取出的年、月、日创建日期对象
      const inputDate = new Date(year, month, day);

      // 计算两个日期对象之间的差值（以毫秒为单位）
      const differenceInMilliseconds = currentDate - inputDate;

      // 将毫秒转换为天数
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      return differenceInDays;
  }

  function timeStringToSeconds(timeString) {
      // 将时间字符串拆分为小时、分钟和秒数
      const timeParts = timeString.split(':')
          .map(part => parseInt(part));

      // 根据时间字符串的长度确定小时、分钟和秒数的位置
      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      if (timeParts.length === 3) {
            [hours, minutes, seconds] = timeParts;
      } else if (timeParts.length === 2) {
            [minutes, seconds] = timeParts;
      } else if (timeParts.length === 1) {
          seconds = timeParts[0];
      }

      // 计算小时、分钟和秒数对应的秒数
      const hoursInSeconds = hours * 3600; // 1小时 = 3600秒
      const minutesInSeconds = minutes * 60; // 1分钟 = 60秒

      // 计算总秒数
      const totalSeconds = hoursInSeconds + minutesInSeconds + seconds;

      return totalSeconds;
  }

})();