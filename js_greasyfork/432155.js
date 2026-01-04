// ==UserScript==
// @name         Grab Venue in SZU
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  【使用前先看介绍/有问题可反馈】深大抢馆 (Grab Venue in SZU)：一键抢深圳大学粤海校区体育场馆。
// @author       cc
// @match        http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/index.do*
// @require      https://greasyfork.org/scripts/422854-bubble-message.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432155/Grab%20Venue%20in%20SZU.user.js
// @updateURL https://update.greasyfork.org/scripts/432155/Grab%20Venue%20in%20SZU.meta.js
// ==/UserScript==

(function () {
  const config = {
    DEBUG: false, // 是否开启调试，不要动这个选项
    neededTimeSlot: '08:00-22:00', // 所需时间段
    allTimeSlots: ['08:00-12:00', '14:00-22:00'], // 所有时间段
    CQBM: '001', // 场区 ID (可能)
    CGBM: '002', // 场馆 ID (默认羽毛球馆)
    XMDM: '005', // 项目 ID (默认羽毛球)
    CYRS: 4, // 参与人数 (默认 4 人)
    startClock: '12:30', // 开始时间
    timeLimit: 60, // 最大请求持续时间，单位为秒
  }

  const bm = new BubbleMessage();

  // define ['HH:00'] timePoint
  // define ['H1:00-H2:00'] timeSlot
  // define ['H1:00-H2:00' && H1 + 1 == H2] hourTimeSlot
  // define [H] hour

  function inform(msg) {
    var Xmsg = `%c${msg}`;
    console.warn(Xmsg, 'background-color: yellow; font-weight: bold;');
  }

  function range(start, stop) {
    var r = [];
    for (let i = start; i <= stop; ++i)
      r.push(i);
    return r;
  }

  function timeFormat(milliseconds) {
    var unit = parseInt(milliseconds / 1000);
    var second = unit % 60;
    unit = parseInt(unit / 60);
    var minute = unit % 60;
    unit = parseInt(unit / 60);
    var hour = unit % 24;
    var ans = `${second} sec`;
    if (minute > 0)
      ans = `${minute} min ${ans}`;
    if (hour > 0)
      ans = `${hour} hour ${ans}`;
    return ans;
  }

  // 'YYYY-MM-DD'
  function getYYRQ() {
    now = new Date(Date.now() + 86400 * 1000);
    var month = `${now.getMonth() + 1}`.padStart(2, '0');
    var date = `${now.getDate()}`.padStart(2, '0');
    return `${now.getFullYear()}-${month}-${date}`;
  }

  // array[timeSlot] -> array[hour]
  function timeSlotsToNumbers(timeSlots, withoutEnd) {
    var numbers = [];
    for (let timeSlot of timeSlots) {
      var [start, end] = timeSlot.split('-').map(t => parseInt(t.match(/\d+/)[0]));
      numbers = numbers.concat(range(start, (withoutEnd ? end - 1 : end)));
    }
    numbers.sort((a, b) => a - b);
    return numbers;
  }

  // 'H1:00' -> 'H2:00' [H1 + 1 == H2]
  function nextTimePoint(hourTimePoint) {
    return `${parseInt(hourTimePoint.match(/\d+/)[0]) + 1}`.padStart(2, '0') + ':00';
  }

  // 'H1:00-H2:00' -> 'H1:00-H3:00' [H2 + 1 == H3]
  function getHourTimeSlot(timeSlot) {
    var START = timeSlot.match(/\d+:00/)[0];
    var END = nextTimePoint(START);
    return `${START}-${END}`;
  }

  // 'H1:00-H2:00' -> 'H3:00-H2:00' [H1 < H3 and H3:00-(H3+1):00 in allTimeSlots or H3 == H2]
  function nextTimeSlot(timeSlot) {
    var flag = false;
    while (!flag) {
      var [startTimePoint, endTimePoint] = timeSlot.match(/\d+:00/g);
      startTimePoint = nextTimePoint(startTimePoint);
      timeSlot = `${startTimePoint}-${endTimePoint}`;
      if (startTimePoint == endTimePoint)
        break;
      var hourTimeSlot = getHourTimeSlot(timeSlot);
      for (let ts of config.allTimeSlots) {
        if (isInTimeSlot(ts, hourTimeSlot)) {
          flag = true;
          break;
        }
      }
    }
    return timeSlot;
  }

  function isInTimeSlot(neededTimeSlot, timeSlot) {
    var tsRange = timeSlot.match(/\d+:00/g).map(s => parseInt(s.substr(0, 2)));
    let neededTsRange = neededTimeSlot.match(/\d+:00/g).map(s => parseInt(s.substr(0, 2)));
    if (tsRange[0] < neededTsRange[0] || neededTsRange[1] < tsRange[1])
      return false;
    return true;
  }

  function TLE() {
    var tomorrowStartTime = new Date(`${getYYRQ()} ${config.startClock}`);
    var startTime = new Date(tomorrowStartTime.getTime() - 86400 * 1000);
    var tleTime = new Date(startTime.getTime() + config.timeLimit * 1000);
    var diffMillis = parseInt(Date.now() - tleTime.getTime()) / 1000;
    return diffMillis > (config.timeLimit * 1000);
  }

  function finishBooking(timeSlot) {
    var [start, end] = timeSlot.match(/\d+:00/g).map(e => parseInt(e.match(/\d+/)[0]));
    return start >= end;
  }

  function requestVenue(waiting, finished) {
    console.warn('in function requestVenue...');
    if (waiting.length > 0) {
      let WID = waiting[0];
      $.ajax({
        url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/getOrderNum.do',
        method: 'POST',
        data: { wid: WID }
      }).then(res => {
        var DHID = res.DHID;
        if (config.DEBUG) {
          console.log(res);
          console.log(res.DHID);
        }
        var YYRQ = getYYRQ();
        var KYYSJD = getHourTimeSlot(config.neededTimeSlot);
        var [START, END] = KYYSJD.split('-');
        var [YYKS, YYJS] = [`${YYRQ} ${START}`, `${YYRQ} ${END}`];
        $.ajax({
          url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/insertVenueBookingInfo.do',
          method: 'POST',
          data: {
            DHID: DHID,
            YYRGH: localStorage.ampUserId,
            XQWID: config.XQWID,
            CQBM: config.CQBM,
            CGDM: config.CGBM,
            CDWID: WID,
            XMDM: config.XMDM,
            YYRQ: YYRQ,
            KYYSJD: KYYSJD,
            YYKS: YYKS,
            YYJS: YYJS,
            YYLX: 'YY_TT',
            BCXZRS: 6,
            CYRS: config.CYRS,
            QTYYR: []
          }
        }).then(res => {
          if (config.DEBUG) {
            console.log(res);
          }
          if (res.success) {
            // 请求成功
            config.__neededTimeSlot__ = nextTimeSlot(config.__neededTimeSlot__);
            if (!finishBooking(config.__neededTimeSlot__)) {
              // 存在其他时间段需要请求
              requestVenue(waiting, finished);
            } else {
              // 所有时间段请求完毕
              var message = 'All tasks completed.';
              bm.message({
                type: 'success',
                message: message,
                duration: parseInt((1000 * message.length / 14)),
              });
              inform(message);
              switchAction();
            }
          } else {
            // 请求失败，舍弃当前场馆，尝试下一场馆
            finished.push(waiting[0]);
            waiting = waiting.slice(1);
            if (!TLE()) {
              requestVenue(waiting, finished);
            } else {
              var message = 'Tasks in all time periods were not completed, but the time limit was exceeded.';
              bm.message({
                type: 'warning',
                message: message,
                duration: parseInt((1000 * message.length / 14)),
              });
              inform(message);
              switchAction();
            }
          }
        });
      });
    }
  }

  function requestWIDs() {
    console.warn('in function requestWIDs...');
    var [START, END] = config.neededTimeSlot.match(/\d{2}:00/g);
    $.ajax({
      url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/getCdxx.do',
      method: 'POST',
      data: {
        CGBM: config.CGBM,
        XMDM: config.XMDM,
        TYPE: 'YY_TT',
        START: START,
        END: END,
        YYRQ: getYYRQ(),
        YYTYPE: '1.0'
      }
    }).then(res => {
      var WIDs = res.map(e => e.id);
      if (config.DEBUG) {
        console.log(res);
        console.log(WIDs);
      }
      if (WIDs.length == 0) {
        if (!TLE()) {
          setTimeout(requestWIDs, 250);
        } else {
          var message = 'No venue can be reserved, time limit exceeded.';
          bm.message({
            type: 'warning',
            message: message,
            duration: parseInt((1000 * message.length / 14)),
          });
          inform(message);
          switchAction();
        }
      } else {
        requestVenue(WIDs, []);
      }
    });
  }

  function requestSjd() {
    console.warn('in function requestSjd...');
    document.getElementById('grab-venue-in-szu-button').innerHTML = '正在进行抢馆';
    $.ajax({
      url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/getSjdByCg.do',
      method: 'POST',
      data: {
        CGBM: config.CGBM,
        XMDM: config.XMDM,
        TYPE: 'YY_TT',
        YYRQ: getYYRQ(),
        YYTYPE: '1.0'
      },
    }).then(res => {
      var sjd = res.kyysjd.map(e => e.kyysjd);
      var timeslots = sjd.filter(e => isInTimeSlot(config.neededTimeSlot, e));
      if (config.DEBUG) {
        console.log(res);
        console.log(sjd);
        console.log(timeslots);
      }
      if (timeslots.length == 0) {
        // 可用时间段为空
        if (!TLE()) {
          setTimeout(requestSjd, 250);
        } else {
          var message = 'No available time period, time out of limit.';
          bm.message({
            type: 'warning',
            message: message,
            duration: parseInt((1000 * message.length / 14)),
          });
          inform(message);
          switchAction();
        }
      } else {
        // 存在可用时间段
        requestWIDs(timeslots);
      }
    });
  }

  function init() {
    console.warn('in function init...');
    insertStyle();
    insertButton();
    insertSelector();
    updateData();
    $.ajax({
      url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/getSchoolZoneDic.do',
      method: 'POST',
      async: true,
    }).then(res => {
      config.XQWID = res.datas.code.rows[0].id;
    });
  }

  function standBy() {
    console.warn('in function standBy...');
    var now = new Date();
    var startHourMinute = config.startClock.split(':').map(e => parseInt(e));
    var startClock = {
      hour: startHourMinute[0],
      minute: startHourMinute[1],
      second: 0,
    };
    var currentClock = {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
    }
    if (config.DEBUG || (currentClock.hour < startClock.hour || (currentClock.hour == startClock.hour && currentClock.minute < startClock.minute))) {
      var diffMillis = ((startClock.hour - currentClock.hour) * 3600 + (startClock.minute - currentClock.minute) * 60 + (startClock.second - currentClock.second)) * 1000;
      config.__neededTimeSlot__ = config.neededTimeSlot;
      switchAction();
      if (config.DEBUG)
        diffMillis = 7 * 1000;
      var intervalId = setInterval(() => {
        diffMillis -= 1000;
        document.getElementById('grab-venue-in-szu-button').innerText = `正在等待倒计时 ${timeFormat(diffMillis)}`;
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalId);
        requestSjd();
      }, diffMillis);
      var message = `Tasks will be executed in ${timeFormat(diffMillis)}.`;
      bm.message({
        type: 'info',
        message: message,
        duration: parseInt((1000 * message.length / 14)),
      });
      inform(message);
    } else {
      var message = 'The time limit is exceeded and the program is no longer executed.';
      bm.message({
        type: 'warning',
        message: message,
        duration: parseInt((1000 * message.length / 14)),
      });
      inform(message);
    }
    return false;
  }

  function updateData(obj) {
    // 存储和修改使用 neededTimeSlot ，常量使用 __neededTimeSlot__
    var data = GM_getValue('data');
    if (!obj) {
      // 初始化调用
      if (!data) {
        // 未初始化，写入更新
        var start = document.getElementById('grab-venue-in-szu-select-start').value;
        var end = document.getElementById('grab-venue-in-szu-select-end').value;
        var neededTimeSlot = `${start}-${end}`;
        GM_setValue('data', { neededTimeSlot: neededTimeSlot });
        config.neededTimeSlot = neededTimeSlot;
        config.__neededTimeSlot__ = neededTimeSlot;
      } else {
        // 已初始化，读取更新
        data = GM_getValue('data');
        Object.assign(config, data);
        config.__neededTimeSlot__ = config.neededTimeSlot;
        updateSelector();
      }
    } else {
      // 更新调用
      data = GM_getValue('data');
      Object.assign(data, obj);
      GM_setValue('data', data);
      Object.assign(config, data);
      config.__neededTimeSlot__ = config.neededTimeSlot;
    }
  }

  function updateSelector() {
    var startSelect = document.getElementById('grab-venue-in-szu-select-start');
    var endSelect = document.getElementById('grab-venue-in-szu-select-end');
    var [start, end] = config.neededTimeSlot.split('-');
    startSelect.value = start;
    endSelect.value = end;
  }

  function switchAction() {
    if (config.waiting) {
      config.waiting = false;
      var button = document.getElementById('grab-venue-in-szu-button');
      button.innerHTML = '点击开启抢馆';
      button.removeAttribute('disabled');
      button.style.cursor = '';
      var startSelect = document.getElementById('grab-venue-in-szu-select-start');
      startSelect.removeAttribute('disabled');
      startSelect.style.cursor = '';
      var endSelect = document.getElementById('grab-venue-in-szu-select-end');
      endSelect.removeAttribute('disabled');
      endSelect.style.cursor = '';
    } else {
      config.waiting = true;
      var button = document.getElementById('grab-venue-in-szu-button');
      button.setAttribute('disabled', 'disabled');
      button.style.cursor = 'wait';
      var startSelect = document.getElementById('grab-venue-in-szu-select-start');
      startSelect.setAttribute('disabled', 'disabled');
      startSelect.style.cursor = 'not-allowed';
      var endSelect = document.getElementById('grab-venue-in-szu-select-end');
      endSelect.setAttribute('disabled', 'disabled');
      endSelect.style.cursor = 'not-allowed';
    }
  }

  function insertButton() {
    var button = document.createElement('button');
    button.setAttribute('id', 'grab-venue-in-szu-button');
    button.innerHTML = '点击开启抢馆';
    var title = document.querySelector('.bh-headerBar-title');
    title.parentElement.insertBefore(button, title);
    button.onclick = standBy;
  }

  function insertSelector() {
    function rangeToOption(n) {
      n = n.toString().padStart(2, '0') + ':00';
      var option = document.createElement('option');
      option.name = n;
      option.value = n;
      option.innerHTML = n;
      return option;
    }
  
    function getOptions(limit) {
      var r = timeSlotsToNumbers(config.allTimeSlots, !limit);
      if (limit) {
        limit = parseInt(limit.match(/\d+/)[0]);
        var earliest = 0;
        while (r[earliest] <= limit)
          earliest++;
        r = r.slice(earliest);
      }
      return r.map(rangeToOption);
    }
  
    var container = document.createElement('div');
    container.setAttribute('id', 'grab-venue-in-szu-container');
  
    var startText = document.createElement('span');
    startText.innerHTML = '目标时间段';
    container.appendChild(startText);
  
    var startSelect = document.createElement('select');
    startSelect.setAttribute('id', 'grab-venue-in-szu-select-start');
    var startOptions = getOptions();
    startOptions.forEach(option => startSelect.appendChild(option));
    startSelect.addEventListener('change', function(e) {
      var endSelect = document.getElementById('grab-venue-in-szu-select-end');
      [...endSelect.children].forEach(option => option.remove());
      var endOptions = getOptions(e.target.value);
      endOptions.forEach(option => endSelect.appendChild(option));
      updateData({ neededTimeSlot: `${e.target.value}-${endSelect.value}` });
    });
    container.appendChild(startSelect);
  
    var toText = document.createElement('span');
    toText.innerHTML = '至';
    container.appendChild(toText);
  
    var endSelect = document.createElement('select');
    endSelect.setAttribute('id', 'grab-venue-in-szu-select-end');
    var endOptions = getOptions(startSelect.firstElementChild.value);
    endOptions.forEach(option => endSelect.appendChild(option));
    endSelect.addEventListener('change', function(e) {
      var startSelect = document.getElementById('grab-venue-in-szu-select-start');
      updateData({ neededTimeSlot: `${startSelect.value}-${e.target.value}` });
    });
    container.appendChild(endSelect);
  
    var button = document.getElementById('grab-venue-in-szu-button');
    button.parentElement.insertBefore(container, button.nextElementSibling);
  }

  function insertStyle() {
    var style = document.createElement('style');
    style.id = 'grab-venue-in-szu-style';
    style.innerHTML = `
      #grab-venue-in-szu-button {
        font-weight: bold;
        color: black;
        background-color: #ffffff;
        margin: 5px 15px 0;
        border-radius: 3px;
        border: 0;
      }
      #grab-venue-in-szu-container {
        display: inline-flex;
        justify-content: space-between;
        font-weight: bold;
        width: 240px;
      }
      #grab-venue-in-szu-container > span {
        color: white;
        cursor: default;
      }
      #grab-venue-in-szu-container > select {
        border-radius: 3px;
        cursor: pointer;
      }
    `;
    document.body.appendChild(style);
  }

  function check() {
    if (document.querySelector('.bh-headerBar-title')) {
      init();
    } else {
      setTimeout(check, 250);
    }
  }

  check();
})();