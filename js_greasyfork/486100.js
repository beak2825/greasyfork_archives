// ==UserScript==
// @name         北森系统-当月加班时间汇总
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对表格中的某一列进行求和，并显示结果
// @author       felixfeng
// @match        https://www.italent.cn/portal/convoy/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486100/%E5%8C%97%E6%A3%AE%E7%B3%BB%E7%BB%9F-%E5%BD%93%E6%9C%88%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%97%B4%E6%B1%87%E6%80%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/486100/%E5%8C%97%E6%A3%AE%E7%B3%BB%E7%BB%9F-%E5%BD%93%E6%9C%88%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%97%B4%E6%B1%87%E6%80%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加点击事件监听器
    document.addEventListener('click', function(event) {
        var currentDate = new Date();

        // 获取当前月份
        var currentMonth = currentDate.getMonth() + 1;

        // 将月份转换为字符串，并使用 padStart 方法填充为两位数
        var formattedMonth = currentMonth.toString().padStart(2, '0');



        const d1 = document.querySelectorAll('.fixedDataTableRowLayout_rowWrapper');
        var pattern = new RegExp("\\b\\d{4}-"+formattedMonth+"-\\d{2}\\s*[\\r\\n]*(\\d*)分钟", "i");
        var sum = 0;
        for(var i=1;i<d1.length;i++){
            //var minutes = parseInt(d1[i].innerText.match(/\d{4}-\d{2}-\d{2}\s*[\r\n]*(\d*)分钟/)[1]);
            var minutes = parseInt(d1[i].innerText.match(pattern)[1]);

            sum = sum + minutes;
            console.log( "第"+i+"行: "+d1[i].innerText + " match :" + minutes)
        }
        console.log("当月" + formattedMonth + " 加班时长:"+ sum/60);
        console.log("剩余加班时长:"+(20*60-sum)/60);

        var pagingFooter = document.querySelector('#ViewListLayer');

        var newDiv = document.createElement('span');
        newDiv.innerHTML = "当月" + formattedMonth + "加班时长:"+(sum/60).toFixed(2) +"   剩余加班时长:"+((20*60-sum)/60).toFixed(2);

        pagingFooter.parentNode.insertBefore(newDiv, pagingFooter.nextSibling);

    },{ once: true });


})();
