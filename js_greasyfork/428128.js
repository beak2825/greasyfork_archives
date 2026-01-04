// ==UserScript==
// @name         TutorJr 課程預看
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可以解除上課前1小時才能看教材限制，並提早查看今日上課老師。
// @author       You
// @match        https://www.tutorjr.com/Center/
// @icon         https://www.google.com/s2/favicons?domain=tutorjr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428128/TutorJr%20%E8%AA%B2%E7%A8%8B%E9%A0%90%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428128/TutorJr%20%E8%AA%B2%E7%A8%8B%E9%A0%90%E7%9C%8B.meta.js
// ==/UserScript==


function strftime(sFormat, date) {
    if (!(date instanceof Date)) date = new Date();
    var nDay = date.getDay(),
      nDate = date.getDate(),
      nMonth = date.getMonth(),
      nYear = date.getFullYear(),
      nHour = date.getHours(),
      aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      aMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
      isLeapYear = function() {
        if ((nYear&3)!==0) return false;
        return nYear%100!==0 || nYear%400===0;
      },
      getThursday = function() {
        var target = new Date(date);
        target.setDate(nDate - ((nDay+6)%7) + 3);
        return target;
      },
      zeroPad = function(nNum, nPad) {
        return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
      };
    return sFormat.replace(/%[a-z]/gi, function(sMatch) {
      return {
        '%a': aDays[nDay].slice(0,3),
        '%A': aDays[nDay],
        '%b': aMonths[nMonth].slice(0,3),
        '%B': aMonths[nMonth],
        '%c': date.toUTCString(),
        '%C': Math.floor(nYear/100),
        '%d': zeroPad(nDate, 2),
        '%e': nDate,
        '%F': date.toISOString().slice(0,10),
        '%G': getThursday().getFullYear(),
        '%g': ('' + getThursday().getFullYear()).slice(2),
        '%H': zeroPad(nHour, 2),
        '%I': zeroPad((nHour+11)%12 + 1, 2),
        '%j': zeroPad(aDayCount[nMonth] + nDate + ((nMonth>1 && isLeapYear()) ? 1 : 0), 3),
        '%k': '' + nHour,
        '%l': (nHour+11)%12 + 1,
        '%m': zeroPad(nMonth + 1, 2),
        '%M': zeroPad(date.getMinutes(), 2),
        '%p': (nHour<12) ? 'AM' : 'PM',
        '%P': (nHour<12) ? 'am' : 'pm',
        '%s': Math.round(date.getTime()/1000),
        '%S': zeroPad(date.getSeconds(), 2),
        '%u': nDay || 7,
        '%V': (function() {
                var target = getThursday(),
                  n1stThu = target.valueOf();
                target.setMonth(0, 1);
                var nJan1 = target.getDay();
                if (nJan1!==4) target.setMonth(0, 1 + ((4-nJan1)+7)%7);
                return zeroPad(1 + Math.ceil((n1stThu-target)/604800000), 2);
              })(),
        '%w': '' + nDay,
        '%x': date.toLocaleDateString(),
        '%X': date.toLocaleTimeString(),
        '%y': ('' + nYear).slice(2),
        '%Y': nYear,
        '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
        '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1')
      }[sMatch] || sMatch;
    });
}

function setbtn(){
    setTimeout(() => {
        try{
            document.getElementsByClassName("class_bottom")[0].getElementsByTagName("a")[0].style.display = "inline-block";
            document.getElementsByClassName("class_bottom")[0].getElementsByTagName("a")[1].style.display = "inline-block";
            document.getElementsByClassName("class_bottom")[0].getElementsByTagName("a")[2].style.display = "inline-block";
        }catch{
            console.log("沒有即將要上的課程!");
        }

        try{
            var newtime = strftime('%Y/%m/%d %H:%M:00', new Date());
            document.getElementsByClassName("class_bottom_right")[0].getElementsByTagName("a")[1].setAttribute("data-showtime",newtime);
            console.log("修改時間為:",newtime);
        }
        catch{
            console.log("修改時間失敗!");
        }

    }, 3500);
}

(function() {
    'use strict';

    setbtn();
    window.history.pushState =  function(event){
         setbtn();
    }

})();




