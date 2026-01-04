// ==UserScript==
// @name         bb-check-in
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  bb werp 打卡計算機
// @author       You
// @match        https://cy.iwerp.net/portal/page/new_home.xhtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iwerp.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472332/bb-check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/472332/bb-check-in.meta.js
// ==/UserScript==

function isInCurrentWeek(dateString, firstDayOfWeek) {
  var currentDate = parseDateString(dateString);
  var weekStart = firstDayOfWeek;
    console.log(weekStart)
  var weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);

  return currentDate >= weekStart && currentDate <= weekEnd;
}

function getcurrentDayOfWeek(dateString) {
  var currentDate = parseDateString(dateString);
  return currentDate.getDay();
}

function parseDateString(dateString) {
  var parts = dateString.split('/');
  var month = parseInt(parts[0], 10) - 1;
  // 月份需減1，因為 JavaScript 的月份是從 0 開始
  var day = parseInt(parts[1].split(' ')[0], 10);

  var currentDate = new Date();
  currentDate.setMonth(month);
  currentDate.setDate(day);

  return currentDate;
}

function addMinutes(time, minutes) {
  var newTime = new Date(time.getTime() + minutes * 60000);
  return newTime;
}

function formatTime(time) {
  var hours = time.getHours().toString().padStart(2, '0');
  var minutes = time.getMinutes().toString().padStart(2, '0');
  return hours + ':' + minutes;
}

function addColor(val,text){
    var retxt = "";
    if(val<0){
         retxt = '<font color="#FF0000">'+ text +'少: '+val+'</font>'
    }else{
         retxt = '<font color="blue">'+ text +'多: '+val+'</font>'
    }
    return retxt;
}

function testA(){
    setTimeout(function() {
        'use strict';
        var today = new Date();
        var currentDayOfWeek = today.getDay(); // 获取今天是星期几，0表示星期日，1表示星期一，以此类推

        // 将日期设置为本周第一天（星期日）
        today.setDate(today.getDate() - currentDayOfWeek);
        // 取得指定 ID 的元素
        var container = document.getElementById('formTemplate:attend_rec_panel_content');
        // 取得所有的 <tr> 元素
        var rows = container.getElementsByTagName('tr');
        // 初始化一個空陣列來儲存資料
        var data = [];
        var sumEstimateMaintain = 0;
        var sumEstimate = 0;
        var todayStart = '';
        // 迭代所有的 <tr> 元素
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            // 取得每一列中的 <td> 元素
            var cells = row.getElementsByTagName('td');
            // 檢查 <td> 元素是否存在
            if (cells.length > 0) {
                var rowData = {};
                // 存放每個 <td> 的內容到對應的鍵值
                rowData.strDate = cells[0].textContent.trim();
                rowData.strStart = cells[1].textContent.trim().split('(')[0].trim();
                rowData.strEnd = cells[2].textContent.trim().split('(')[0].trim();
                var cell1 = row.insertCell();
                if(isInCurrentWeek(rowData.strDate,today)&&rowData.strStart.length>0){
                    console.log("日期："+i +"/"+ rowData.strStart.length);
                    var strStart = rowData.strStart;
                    var strEnd = rowData.strEnd;
                    var dateStart = new Date('1970-01-01 ' + strStart);
                    var dateEnd = new Date('1970-01-01 ' + strEnd);
                    var diffMinutes = (dateEnd - dateStart) / (1000 * 60);
                    if (!strEnd) {
                        rowData.diffMinutes = 0;
                        rowData.estimate = 0;
                        todayStart = strStart;
                    }else{
                        rowData.diffMinutes = diffMinutes;
                        rowData.estimate = diffMinutes-540;
                    }
                    rowData.currentDayOfWeek = getcurrentDayOfWeek(rowData.strDate);
                    // 把資料加入到陣列中
                    if(diffMinutes!=0){
                        cell1.textContent = rowData.estimate;
                    }
                    data.push(rowData);
                    sumEstimate += rowData.estimate;
                    if(rowData.currentDayOfWeek!=3){
                        sumEstimateMaintain += rowData.estimate;
                    }
                }
            }
        }

        // 印出抓取到的資料
        for (var j = 0; j < data.length; j++) {
            console.log("日期：" + data[j].strDate);
            console.log("開始時間：" + data[j].strStart);
            console.log("結束時間：" + data[j].strEnd);
            console.log("分鐘數：" + sumEstimate);
            console.log("今天分鐘數：" + sumEstimateMaintain);
            console.log("星期：" + data[j].currentDayOfWeek);
            console.log("---");
        }
        var xx=rows[0].insertCell();
        xx.innerHTML = addColor(sumEstimate,'') + '<br>' + addColor(sumEstimateMaintain,'[維護]');
        var aa= 540 - sumEstimate;
        var bb= 540 - sumEstimateMaintain;
        var dayS = new Date('1970-01-01 ' + todayStart);
        var newTime = addMinutes(dayS, aa);
        var hasMaintainTime = addMinutes(dayS, bb);
        console.log(dayS);
        console.log(aa);
        console.log(newTime);
        var tbody = document.getElementById('formTemplate:attend_rec_datatable_data');
        var newRow = document.createElement('tr');
        var cell101 = document.createElement('td');
        var cell102 = document.createElement('td');
        var cell11 = document.createElement('td');
        var cell12 = document.createElement('td');
        cell102.textContent = "幾點可走";
        cell11.textContent = "正常:" + formatTime(newTime);
        cell12.textContent = "維護:" + formatTime(hasMaintainTime);
        newRow.appendChild(cell101);
        newRow.appendChild(cell102);
        newRow.appendChild(cell12);
        newRow.appendChild(cell11);
        tbody.appendChild(newRow);
        return rowData;
    },2000); // 等待 1000 毫秒（1 秒）
}


(function() {

    var rowData = testA();


    // Your code here...
})();