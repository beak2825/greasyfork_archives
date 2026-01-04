// ==UserScript==
// @name     airflow-hack
// @namespace thedream
// @description "调整airflow web上的时间显示方式"
// @version  1.5.1
// @grant    none
// @include http://plat-crontab*/admin/
// @include http://plat-crontab*/admin/airflow/tree*
// @include http://plat-crontab*/admin/dagrun/*
// @include http://plat-crontab*/admin/taskinstance/*
// @include http://localhost:8082/admin/
// @include http://localhost:8082/admin/airflow/tree*
// @include http://localhost:8082/admin/dagrun/*
// @include http://localhost:8082/admin/taskinstance/*
// @include http://kettle-crontab*/admin/
// @include http://kettle-crontab*/admin/taskinstance/*
// @include http://kettle-crontab*/admin/dagrun/*
// @include http://kettle-crontab*/admin/airflow/tree*
// @author guanxiaoqin
// @downloadURL https://update.greasyfork.org/scripts/391954/airflow-hack.user.js
// @updateURL https://update.greasyfork.org/scripts/391954/airflow-hack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function heightLight(tableEle) {
        let oldColor = '';
        let tableRows = tableEle.tBodies[0].rows.length;
        for (let i = 0; i < tableRows; i++) {
            let item = tableEle.tBodies[0].rows[i];
            item.onmouseover = function () {
                oldColor = this.style.background;
                this.style.background = "#f1f1f1";  //高亮背景
            };
            item.onmouseout = function () {
                this.style.background = oldColor;
            };
        }
    }

    function replaceTimeInAdmin() {
        var $e = $(".text-nowrap.latest_dag_run");
        if ($e.length === 0) return;
        $e.each(function () {
            var time;
            var text = $(this).find("span").attr("data-original-title");
            if (text) time = text.split("Start Date: ")[1];
            time = changeTimeForm(time, true, false);
            $(this).find("a").text(time)
        })
    }

    function replaceTimeInTreeView() {
        var $e = $(".stateboxes .state");
        if ($e.length === 0) return;
        $e.each(function () {
            let Arr;
            let text = $(this).attr("data-original-title");
            if (text) Arr = text.split("<br>");
            let arrNew = Arr.map(function (currentValue) {  // 修改数组里面指定的时间文本
                let newVal = currentValue
                if (currentValue.indexOf('Run:') > -1 || currentValue.indexOf('Started:') > -1 || currentValue.indexOf('Ended:') > -1) {
                    let time = currentValue.split(" ")[1]  // 'Run: 2020-03-13T05:55:01.213686+00:00'
                    let fnTime = changeTimeByRule(time)
                    time = changeTimeForm(fnTime, true, true);
                    newVal = currentValue.split(" ")[0] + ' ' + time
                }
                return newVal;
            });
            let newText = arrNew.join('<br>')
            $(this).attr("data-original-title", newText) // 替换属性内容
        })
    }

    function addTitleInAdmin() {
        var $e = $(".text-nowrap.latest_dag_run");
        if ($e.length === 0) return; // 判断是否是admin页面
        var $td = $("tr td:nth-child(3)");
        if ($td.length === 0) return;
        $td.each(function () {
            var textAll = $(this).find('a').text();
            var text = $(this).find("a").attr("title");
            if (text) textAll = `${textAll} - (${text})`
            $(this).find("a").text(textAll)
        })
    }

    function changeTimeInTask(element) {
        var $e = $(element);
        if ($e.length === 0) return;
        $e.each(function () {
            let time = $(this).text()
            if(!time) return // 容错性
            let fnTime = changeTimeByRule(time)
            fnTime = changeTimeForm(fnTime, true, true);
            $(this).text(fnTime)
        })
    }

    function changeTimeByRule(time) { // 2020-03-13T05:55:01.213686+00:00 ====>  2019-12-22 06:09:28
        let fnTime = time.split("+")[0].split(".")[0];
        const arr = fnTime.split("T");
        if (arr.length < 2) return;
        const dateArr = arr[0].split("-"); // 年月日数组
        if (dateArr.length === 2) {
          fnTime = (new Date()).getFullYear() + "-" + arr[0] + " " + arr[1]; // 补上此刻的年份
        } else {
          fnTime = arr[0] + " " + arr[1]; // 格式为 2019-12-22 06:09:28
        }
        return fnTime
    }

    function changeTimeForm(oldTime, with_year, with_second) { // 2019-12-22 06:09:28 ====>  2019-12-22 14:09:28
        function pad(str) {
            return +str >= 10 ? str : '0' + str;
        }

        var timestamp = (new Date(oldTime)).getTime() + 8 * 60 * 60 * 1000; // 单位毫秒，增加8小时
        var dateObj = new Date(+timestamp);
        var year = dateObj.getFullYear();
        var month = pad(dateObj.getMonth() + 1);
        var date = pad(dateObj.getDate());
        var hours = pad(dateObj.getHours());
        var minutes = pad(dateObj.getMinutes());
        var seconds = pad(dateObj.getSeconds());
        var prefix_year = "";
        var prefix_second = "";
        if (with_year) prefix_year = year + '-';
        if (with_second) prefix_second = ':' + seconds;
        return prefix_year + month + '-' + date + ' ' + hours + ':' + minutes + prefix_second
    }

    replaceTimeInAdmin();// 替换admin页面中时间
    addTitleInAdmin(); // admin title拼接
    changeTimeInTask("td.col-execution_date nobr");// 改变task页面中指定元素的时间
    changeTimeInTask("td.col-start_date nobr");
    changeTimeInTask("td.col-end_date nobr");
    changeTimeInTask("td.col-queued_dttm nobr");
    replaceTimeInTreeView() // 替换/airflow/tree页面的时间

    let tableEle = document.getElementById('dags');// 获取admin页面表格
    if (tableEle) heightLight(tableEle);

})();
