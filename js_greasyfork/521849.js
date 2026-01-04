// ==UserScript==
// @name         林氏OA计算加班时长工具
// @namespace    linshimuye-oa-script
// @version      1.0.5
// @description  LINSHI加班时长计算插件
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @match        https://portal.linshimuye.com/PersonalPortal/AttendanceRecord
// @downloadURL https://update.greasyfork.org/scripts/521849/%E6%9E%97%E6%B0%8FOA%E8%AE%A1%E7%AE%97%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%95%BF%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521849/%E6%9E%97%E6%B0%8FOA%E8%AE%A1%E7%AE%97%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%95%BF%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 本是同根生，相煎何太急
(function () {
  'use strict';
  setTimeout(function () {
    var tab = document.getElementById('tab-cardRecord');
    tab.click();
    cal();
  }, 3000);

  function cal() {
    setTimeout(function () {
      var tableData = [];
      var showData = '';
      var now = new Date();
      let OTSumTime = 0;
      let BEGIN_WORK_TIME = 0;
      let END_WORK_TIME = 0;
      const BEGIN_WORK_MAX_TIME = '06:00:00'; //  我也不太清楚打卡的界限是多少，在什么时间前打卡算前一天，什么时间后算当天

      // 根据前端界面获取数据
      // 这种方式比较蛋疼，前端一改脚本也要跟着改，弃用
      // $('.el-table__body  tr').each(function () {
      //   var obj = {};
      //   obj.attendanceDate = $(this).find('td:eq(3)').text();
      //   obj.clockInTime = $(this)
      //     .find('td:eq(6) .el-popover__reference span')
      //     .text();
      //   obj.tableName = $(this).find('td:eq(5)').text();
      //   tableData.push(obj);
      // });

      // 使用接口获取加班时长
      const formData = new FormData();
      const searchYear = new Date().getFullYear();
      const searchMonth = new Date().getMonth() + 1;
      formData.append(
        'yearMonth',
        searchYear + '-' + searchMonth.toString().padStart(2, '0')
      );

      $.ajax({
        type: 'POST',
        url: 'https://portal.linshimuye.com/oadingding/hrAtClockInRecord/myClockInRecordList',
        data: formData,
        processData: false, // 必须禁用jQuery的自动处理数据
        contentType: false, // 必须禁用jQuery的默认内容类型
        success: function (response) {
          if (response.data.length) {
            tableData = response.data;
            console.log(tableData);

            if (tableData.length > 0) {
              OTSumTime = 0;
              for (let i = 0; i < tableData.length; i++) {
                if (
                  new Date(tableData[i].attendanceDate).toDateString() ===
                  now.toDateString()
                ) {
                  break;
                }
                if (i === tableData.length - 1) {
                  getWorkTime(tableData[i], tableData[i]);
                } else {
                  getWorkTime(tableData[i], tableData[i + 1]);
                }
              }
              showData +=
                '这个月加班时长为:' +
                (OTSumTime / 1000 / 60 / 60).toFixed(2) +
                '小时 \n';
              alert(showData);
            } else {
              alert('没有数据哦，自己看着办');
            }
          }
        },
      });

      function getWorkTime(workTimeData, nextDayWorkTimeData) {
        if (workTimeData.tableName) {
          switch (workTimeData.tableName) {
            case '早D': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '06:40:00'
              ).getTime();
              END_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '16:10:00'
              ).getTime();
              break;
            }
            case '中C': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '10:00:00'
              ).getTime();
              END_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '19:30:00'
              ).getTime();
              break;
            }
            case '中B': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '13:30:00'
              ).getTime();
              END_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '22:30:00'
              ).getTime();
              break;
            }
            case '晚G': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '15:30:00'
              ).getTime();
              END_WORK_TIME =
                new Date(
                  workTimeData.attendanceDate + ' ' + '01:00:00'
                ).getTime() +
                24 * 60 * 60 * 1000;
              break;
            }
            case '上班': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '08:45:00'
              ).getTime();
              END_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '18:15:00'
              ).getTime();
              break;
            }
            case '上休': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '08:45:00'
              ).getTime();
              END_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '12:00:00'
              ).getTime();
              break;
            }
            case '下休': {
              BEGIN_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '13:30:00'
              ).getTime();
              END_WORK_TIME = new Date(
                workTimeData.attendanceDate + ' ' + '18:15:00'
              ).getTime();
              break;
            }
            case '休息': {
              BEGIN_WORK_TIME = 0;
              END_WORK_TIME = 0;
              break;
            }
          }
          const clockInArray = workTimeData.clockInTime.split(',');
          const secondDayClockInArray =
            nextDayWorkTimeData.clockInTime.split(',');

          if (clockInArray.length < 1) {
            return;
          }

          const beginMaxTime = new Date(
            workTimeData.attendanceDate + ' ' + BEGIN_WORK_MAX_TIME
          ).getTime();
          const secondDayBeginMaxTime = new Date(
            nextDayWorkTimeData.attendanceDate + ' ' + BEGIN_WORK_MAX_TIME
          ).getTime();

          const workTimeArray = [];

          for (let i = 0; i < clockInArray.length; i++) {
            const workTime = new Date(
              workTimeData.attendanceDate +
                ' ' +
                clockInArray[i].replace('(补)', '')
            );
            if (workTime >= beginMaxTime) {
              workTimeArray.push(workTime);
            }
          }

          if (nextDayWorkTimeData.clockInTime) {
            for (let i = 0; i < secondDayClockInArray.length; i++) {
              const workTime = new Date(
                nextDayWorkTimeData.attendanceDate +
                  ' ' +
                  secondDayClockInArray[i].replace('(补)', '')
              );
              if (workTime < secondDayBeginMaxTime) {
                workTimeArray.push(workTime);
              }
            }
          }

          if (['休息'].includes(workTimeData.tableName)) {
            calculateRestDayOverTime(workTimeArray);
          } else {
            calculateOverTime(workTimeArray, BEGIN_WORK_TIME, END_WORK_TIME);
          }
        }
      }

      function calculateOverTime(workTimeArray, beginTime, endTime) {
        console.log(workTimeArray, beginTime, endTime);
        if (workTimeArray.length > 0) {
          workTimeArray.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
          const userBeginTime = workTimeArray[0];
          const userEndTime = workTimeArray[workTimeArray.length - 1];

          const beginOTTime = beginTime - userBeginTime.getTime();
          const endOTTime = userEndTime.getTime() - endTime;

          if (userBeginTime === userEndTime) {
            showData +=
              new Date(beginTime).toLocaleString() +
              '上班打卡记录跟下班一致，当天只打了一次卡，要补卡咯 \n';
            return;
          }

          if (beginOTTime < 0 || endOTTime < 0) {
            showData +=
              new Date(beginTime).toLocaleString() + '迟到早退是吧 \n';
            return;
          }

          OTSumTime += beginOTTime + endOTTime;
        }
      }

      function calculateRestDayOverTime(workTimeArray) {
        if (workTimeArray.length > 0) {
          workTimeArray.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
          const userBeginTime = workTimeArray[0];
          const userEndTime = workTimeArray[workTimeArray.length - 1];

          OTSumTime += userEndTime.getTime() - userBeginTime.getTime();
        }
      }
    }, 3000);
  }
})();
