// ==UserScript==
// @name         CICD Auto detect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://*.s3-website-ap-northeast-1.amazonaws.com/status/index.html*
// @match        http*://*.s3-website-ap-northeast-1.amazonaws.com/status/fe.txt*
// @match        http*://*.s3-website-ap-northeast-1.amazonaws.com/status/be.txt*
// @match        http*://stage-*.carekarte.jp/status/index.html*
// @match        http*://stage-*.carekarte.jp/status/fe.txt*
// @match        http*://stage-*.carekarte.jp/status/be.txt*
// @match        http*://*.cloudfront.net/status/index.html*
// @match        http*://*.cloudfront.net/status/fe.txt*
// @match        http*://*.cloudfront.net/status/be.txt*
// @run-at       document-start
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/410019/CICD%20Auto%20detect.user.js
// @updateURL https://update.greasyfork.org/scripts/410019/CICD%20Auto%20detect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  Object.defineProperty(window, 'loadFileFe', {
    value: function () {
      loadFile('fe')
    },
    enumerable: true,
    writable: false
  });

  Object.defineProperty(window, 'loadFileBe', {
    value: function () {
      loadFile('be')
    },
    enumerable: true,
    writable: false
  });

  var monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  var dayOfWeekNames = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  function formatDate(date, patternStr) {
    if (!patternStr) {
      patternStr = 'M/d/yyyy';
    }
    var day = date.getDate(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds(),
      miliseconds = date.getMilliseconds(),
      h = hour % 12,
      hh = twoDigitPad(h),
      HH = twoDigitPad(hour),
      mm = twoDigitPad(minute),
      ss = twoDigitPad(second),
      aaa = hour < 12 ? 'AM' : 'PM',
      EEEE = dayOfWeekNames[date.getDay()],
      EEE = EEEE.substr(0, 3),
      dd = twoDigitPad(day),
      M = month + 1,
      MM = twoDigitPad(M),
      MMMM = monthNames[month],
      MMM = MMMM.substr(0, 3),
      yyyy = year + "",
      yy = yyyy.substr(2, 2)
      ;
    // checks to see if month name will be used
    patternStr = patternStr
      .replace('hh', hh).replace('h', h)
      .replace('HH', HH).replace('H', hour)
      .replace('mm', mm).replace('m', minute)
      .replace('ss', ss).replace('s', second)
      .replace('S', miliseconds)
      .replace('dd', dd).replace('d', day)

      .replace('EEEE', EEEE).replace('EEE', EEE)
      .replace('yyyy', yyyy)
      .replace('yy', yy)
      .replace('aaa', aaa);
    if (patternStr.indexOf('MMM') > -1) {
      patternStr = patternStr
        .replace('MMMM', MMMM)
        .replace('MMM', MMM);
    }
    else {
      patternStr = patternStr
        .replace('MM', MM)
        .replace('M', M);
    }
    return patternStr;
  }

  function twoDigitPad(num) {
    return num < 10 ? "0" + num : num;
  }

  function timeAgo(time) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'giây', 1], // 60
      [120, '1 phút trước', '1 phút tới'], // 60*2
      [3600, 'phút', 60], // 60*60, 60
      [7200, '1 giờ trước', '1 giờ tới'], // 60*60*2
      [86400, 'giờ', 3600], // 60*60*24, 60*60
      [172800, 'Hôm qua', 'Ngày mai'], // 60*60*24*2
      [604800, 'ngày', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Tuần trước', 'Tuần tới'], // 60*60*24*7*4*2
      [2419200, 'tuần', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Tháng trước', 'Tháng tới'], // 60*60*24*7*4*2
      [29030400, 'tháng', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Năm ngoái', 'Năm tới'], // 60*60*24*7*4*12*2
      [2903040000, 'năm', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Thế kỷ trước', 'Thế kỷ tới'], // 60*60*24*7*4*12*100*2
      [58060800000, 'thế kỉ', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'trước',
      list_choice = 1;

    if (seconds == 0) {
      return 'Vừa nãy';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'tới';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++]) {
      if (seconds < format[0]) {
        if (typeof format[2] == 'string') {
          return format[list_choice];
        } else {
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
      }
    }
    return time;
  }

  var running = false;

  function displayContents(id, text) {
    var el = document.getElementById(id);
    text = text.replace(/(\d{1,4}\-\d{1,2}\-\d\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2})/g, (match, p1) => {
      var d = new Date(p1);
      d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
      return '<span style="font-weight: 700">' + formatDate(d, 'HH:mm:ss dd-MM-yyyy') + '</span> (' + timeAgo(d) + ')';
    });
    el.innerHTML = text;
  }

  function loadFile(name) {
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', name + '.txt?t=' + new Date().getTime(), true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var text = rawFile.responseText;
          displayContents(name, text);
          if (name === 'fe') {
            if (text.indexOf('BUILD SUCCESS Frontend') === -1) {
              running = true;
            } else if (running === true) {
              running = false;
              notifyMe();
            }
          }
        }
      }
    };
    rawFile.send(null);
  }

  function refresh() {
    loadFile('fe');
    loadFile('be');
  }
  setInterval(refresh, 10000);
  refresh();

  function notifyMe() {
    GM_notification({
      text: 'CICD xong rùi nha',
      title: 'CICD',
      image: 'https://www.google.com/s2/favicons?sz=64&domain_url=' + location.origin + '?t=' + new Date().getTime(),
      onclick: function () {
        window.open(location.origin + '/000186');
      }
    });
  }
})();