// ==UserScript==
// @name         ambow employee overtime
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  ambow employee overtime~~
// @author       You
// @match        https://erp.ambow.com/spa/workflow/static4form/index.html*
// @icon         http://staging-ehr.ambow.com/resource/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444319/ambow%20employee%20overtime.user.js
// @updateURL https://update.greasyfork.org/scripts/444319/ambow%20employee%20overtime.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function isZeroTen(n){
        return n > 9 ? n : '0' + n
    }
    function getAddDay(start,end, week){
        // 获得员工编号
        $.ajax({
            type: "get",
            url: 'https://api.ambow.com/ehr/workAttendance/getEmployeeByOrganizationId?organizationId=5cde5e48310fb0e42694b53f',
            dataType: "json",
            contentType:'application/json',
            headers : {
                'Authorization': $.cookie('app_token'),
                'customer_id': 'AMBOW_2017_FAKE',
            },
            success: function(res){
                console.log(res[0]);
                var data = {"employeeId":[res[0]],"startDate":start+"T15:45:54.000Z","endDate":end+"T15:45:54.300Z","isFlag":true}
                // 获取加班日期
                $.ajax({
                    type: "POST",
                    url: 'https://api.ambow.com/ehr/workAttendance/getEmployeesDaysWorkingShift',
                    dataType: "json",
                    contentType:'application/json',
                    data: JSON.stringify(data),
                    headers : {
                        'Authorization': $.cookie('app_token'),
                        'customer_id': 'AMBOW_2017_FAKE',
                    },
                    success: function(res){
                        var vo = res[0].employeesWorkingShiftDateVoList.filter(v => (+week === +v.status && (+week === 7 ? v.punchOutTime && v.punchInTime : v.punchOutTime - v.punchInTime - (1000 * 60 * 60 * 11)) > 10) );
                        vo.forEach((v,i) => {
                            if(i){
                                // 新增一条
                                $('#addbutton0').click()
                            }
                            var sd = new Date(v.punchInTime);
                            var xd = new Date(v.punchInTime + (1000 * 60 * 60 * 9));
                            if(+week !== 8){
                                xd = new Date(v.punchInTime);
                            }
                            var ed = new Date(v.punchOutTime);
                            var day = '';
                            var dayFt = '';
                            var strKey = {0:'年',1:'月',2:'日'}
                            // 处理天
                            var workDay = new Date(v.workingDate).toLocaleDateString().split('/').map( (s,i) => {day += isZeroTen(s)+strKey[i];return isZeroTen(s);} );
                            var startTime = (p=':') => `${isZeroTen(xd.getHours())}${p}${isZeroTen(xd.getMinutes())}`;
                            var endTime = (p=':') => `${isZeroTen(ed.getHours())}${p}${isZeroTen(ed.getMinutes())}`;
                            // addTime = (v.punchOutTime - v.punchInTime - (1000 * 60 * 60 * 9)) / 1000 / 60 / 60
                            // console.log(`${day} 上班：${isZeroTen(sd.getHours())}:${isZeroTen(sd.getMinutes())} 下班：${isZeroTen(ed.getHours())}:${isZeroTen(ed.getMinutes())} 加班时长：${addTime}`)
                            console.log(`${day}==${workDay.join('-')}==${i} 上班：${startTime()} 下班：${endTime()}`)
                            $('#request-log').append($('<div>'+`${day}==${workDay.join('-')}==${i} 上班：${startTime()} 下班：${endTime()}`+'</div>'))
                            var s = startTime('.'),e = endTime('.')
                            // 加班小时数计算
                            var aT = Math.floor((e - s) * 10 ) / 10;
                            var sT = Math.floor(e - s)+'.3'
                            var bT = Math.floor(e - s)
                            if(+week !== 8){
                                if(bT >= 6 && bT - 1 < 8){
                                    bT = bT -1;
                                }
                                if(bT >= 8 && bT - 1 >= 8 ){
                                    bT = 8;
                                }
                            }
                            WfForm.changeFieldValue("field12486_"+i, {value:workDay.join('-')});
                            WfForm.changeFieldValue("field12487_"+i, {value:startTime()});
                            WfForm.changeFieldValue("field12489_"+i, {value:endTime()});
                            console.log("aT==",aT,"sT==",sT,"bT==",bT,'工作日==')
                            if(aT >= sT && bT < 8){
                                WfForm.changeFieldValue("field12490_"+i, {value: bT+'.5'});
                            }else {
                                WfForm.changeFieldValue("field12490_"+i, {value: bT});
                            }
                        })
                    }
                });
            }
        });
    }
    // 匹配 员工加班申请页面
    // window.location.href.indexOf("workflowid=921")
    if(window.location.href.indexOf("workflowid=40006") > -1){
        function onReady(fn){
            var readyState = document.readyState;
            if(readyState === 'interactive' || readyState === 'complete') {
                fn()
            }else{
                window.addEventListener("DOMContentLoaded",fn);
            }

        }

        onReady(function(){
            // 向 body 加入 input date 类型
            $('body').before($('<span>开始日期</span><input type="date" id="start">'))
            $('body').before($('<span>结束日期</span><input type="date" id="end">'))
            $('body').before($('<span>公休日</span><select id="week"><option  value="7">休息日</option><option value="8">工作日</option></select>'))
            $('body').before($('<button id="search">查询，并插入</button>'))
            $('body').before($('<div style="height: 170px;overflow: hidden;overflow-y: auto;width: 640px;">日志区域<div id="request-log"></div></div>'))
            $("#search").click(function(){
                var start = $('#start').val()
                var end = $('#end').val()
                var week = $('#week').val()
                var tem = '';
                if(start > end){
                    tem = end
                    end = start
                    start = tem
                }
                $('#start').val(start)
                $('#end').val(end)
                console.log(start,'====',end,'====',week);
                WfForm.changeFieldValue("field23063", {value: +week === 7 ? 0 : 2})
                WfForm.changeFieldValue("field7385", {value: +week === 7 ? 1 : 0})
                $('#request-log').append($('<div>分割线-----加班类型:'+$('#field7385').prev().text()+'-----公休日:'+$('#field23063').prev().text()+'-----分割线</div>'))
                getAddDay(start,end,week)
            })
        })
    }
    // Your code here...
})();