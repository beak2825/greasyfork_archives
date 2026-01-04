// ==UserScript==
// @name         统计当月平均工时
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  统计工时!
// @author       lq
// @include        https://ihr.corpautohome.com/pc/person/calendar*
// @include        https://ihr.corpautohome.com/person/calendar*
// @match        https://ihr.corpautohome.com/person/calendar
// @icon         https://www.google.com/s2/favicons?domain=corpautohome.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license      MIT
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/485246/%E7%BB%9F%E8%AE%A1%E5%BD%93%E6%9C%88%E5%B9%B3%E5%9D%87%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485246/%E7%BB%9F%E8%AE%A1%E5%BD%93%E6%9C%88%E5%B9%B3%E5%9D%87%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var countHourScript = `
       /**
         操作提示
         1.进入当月考勤，自动计算考勤平均工时，并弹窗提示
       */

        $.cookie.json = true;
        var weekEndTdIndex = [5, 6, 12, 13, 19, 20, 26, 27, 33, 34];
        var tjClickTimer = null;
        function statisticsJiabanDate(){
            clearTimeout(tjClickTimer);
             tjClickTimer = setTimeout(function(){
                $('.ant-page-header-heading-left').html('');
                var dateDoms = $(".ant-picker-cell-in-view");
                var count=0;
                var timeCount=0;
                dateDoms.each((index,elem)=>{
                    var dateCell = $(elem);
                    var currDate = dateCell.attr('title');
                    var amTimeStr = dateCell.find('div[class=text] div:eq(0)').text().replace('上午：','')||"";
                    var pmTimeStr = dateCell.find('div[class=text] div:eq(1)').text().replace('下午：','')||"";
                    var amTime = new Date(currDate +' '+amTimeStr);
                    var pmTime = new Date(currDate +' '+pmTimeStr);
                    if(amTimeStr && pmTimeStr ){
                        var oneDay = (pmTime.getTime() - amTime.getTime())/3600000
                        timeCount+=oneDay;
                        count++;
                    }
                });
                $('.ant-page-header-heading-left').html('<span class="ant-page-header-heading-title" title="我的考勤">我的考勤</span><span style="color:red"> 本月平均工时：'+(timeCount/count).toFixed(2)+'</span>')
            },500);
        }
          $(function(){
             //statisticsJiabanDate();
            //切换月份或点击当月事件
            $(document).on('click','.month',()=>{
               console.log('month area click');
               statisticsJiabanDate();
            });
         })


//===================end===================================
  `;

    $("head").append(`<script title="pm8money_lzy"> ${countHourScript}</script>`);
    setTimeout(function(){
       statisticsJiabanDate();
    },500);

})();
