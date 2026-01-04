// ==UserScript==
// @name         OA工时统计
// @namespace    https://blog.csdn.net/FengZ1
// @version      19
// @description  工时统计js
// @author       Rui
// @match        *://oa.vemic.com/sign/index/history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vemic.com
// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472329/OA%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/472329/OA%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var YYYYMMDD = '2023/02/24 ';
var am = new Date(YYYYMMDD + '12:00:00');
var pm = new Date(YYYYMMDD + '13:00:00');
var computeToday=true;
(function () {
    $('#signForceClearCacheNotice').before("<button id='noComputeToday' type='button' style='margin-left:10px;padding: 6px 18px;border-radius:5px;font-size: 16px' class='btn'>不记当天</button>");

      $('#noComputeToday').on('click', function () {
          if(computeToday){
              computeToday=false;
              $(this).text('计算当天');
          }else{
              computeToday=true;
              $(this).text('不记当天');
          }
    });

    //当前时间作为签退时间
    let endTimeli = $('.today').find('.note.t-c');
    if (endTimeli.length > 0) {
        let currentTime = new Date();
        let dateStr = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
        let currentTimeHtml = "<ul title='' class='sign-off'><li class='sign-time'><i class='icon icon-clock'></i><i class='a-i-text'>" + dateStr + "</i></li><li class='sign-sub' title='签退IP : 10.10.16.15'><i class='icon icon-computer'></i></li><li class='sign-adjust note' title=''></li></ul>";
        endTimeli.after(currentTimeHtml);
        endTimeli.remove();
    }

    showTime();
    $('.month ').click(function () {
        setTimeout(function () {
            showTime();
        }, 500);
    })
    if (endTimeli.length > 0) {
        setInterval(function () {
            let currentTime = new Date();
            $('.today').find('.a-i-text:last').text(currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds());
            trRefresh($(".today").parent());
        }, 1000);
    }
})();

function showTime() {
    $("#history_listview tr").each(function (i, e) {
        trRefresh(e);
    });
}

function trRefresh(e) {
    $(e).find('.countWorkTime').remove();
    $(e).find('.dayWorkTime').remove();
    let times = 0
    let workday = 0;
    $(e).find('td').each(function (i2, d) {
        if($(this).hasClass('today') && !computeToday){
        }else
        if (0 < i2 && i2 < 6 && $(d).find('.note.t-c').length === 0 && $(d).find('ul').length > 0) {
            let startTimeStr = $(d).find(".sign-time:eq(0) .a-i-text").text();
            let endTimeStr = $(d).find('.sign-time:eq(1) .a-i-text').text();
            let startTime = new Date(YYYYMMDD + startTimeStr);
            let endTime = new Date(YYYYMMDD + endTimeStr);
            // 中午休息时间下班
            if (am <= endTime && endTime < pm) {
                endTime = am;
            }
            //中午休息时间上班
            else if (am <= startTime && startTime < pm){
                startTime=pm;
            }
            //常规上午来，下午走，扣除1小时休息时间
            else if (endTime => pm && startTime < am) {
                endTime = new Date(endTime.getTime() - (1000 * 60 * 60));
            }
            times += ((endTime - startTime) / 1000);
            workday++;
            $(d).append(getTimeStr(((endTime - startTime) / 1000), false));
        }
        if (i2 == 6 && workday > 0) {
            $(d).append("<span class='countWorkTime'>" + workday + "天在岗时长<br/>" + getTimeStr(times, false) + '<br/></span>');
            $(d).append("<span class='countWorkTime'>" + getTimeStr((workday * 8 * 60 * 60) - times, true) + '<br/></span>');
            times = 0
            workday = 0;
        }
    });
}
//是否计算当前天天
function noComputeToday(){
    computeToday=false;
}

function getTimeStr(sec, colorf) {
    let h = parseInt(sec / 60 / 60)
    let m = parseInt(sec / 60 % 60)
    let s = parseInt(sec % 60)
    let color = "还需时长<br/><span class='countWorkTime' style='color:red'>";
    if (h < 0 || m < 0 || s < 0) {
        h=h*-1;
        m=m*-1;
        s=s*-1;
        color = "超出时长<br/><span class='countWorkTime'style='color:green'>";
    }
    if (h == 0) {
        h = '';
    } else {
        h = h + '时';
    }
    if (m == 0) {
        m = '';
    } else {
        m = m + '分';
    }
    if (s == 0) {
        s = '';
    } else {
        s = s + '秒';
    }
    if (colorf) {
        return color + h + m + s + '</span>';
    } else {
        return "<span class='dayWorkTime'>" + h + m + s + "</span>";
    }
    return color + h + m + s + '</span>';
}
function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要加1
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

