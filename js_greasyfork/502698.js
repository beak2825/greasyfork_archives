// ==UserScript==
// @name         EpointOA-辅助助手
// @namespace    http://tampermonkey.net/
// @description  一些适合自己办公辅助脚本
// @author       icelo.org
// @match        https://oa.epoint.com.cn/epointoa9/frame/pages/basic/communication/waithandle/*
// @match        https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontent*
// @match        https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/fydetail_edit?*
// @match        https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrzsummary/gzrzsummarylist
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epoint.com.cn
// @grant        GM_xmlhttpRequest
// @license      MIT
// @version      v1.4.0
// @require https://update.greasyfork.org/scripts/445697/1244619/Greasy%20Fork%20API.js
// @downloadURL https://update.greasyfork.org/scripts/502698/EpointOA-%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502698/EpointOA-%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
     // 等待页面加载完成
    var url = window.location.href;
    console.log(url);
    if(url.startsWith('https://oa.epoint.com.cn/epointoa9/frame/pages/basic/communication/waithandle/')) {
        var NewNode = document.createElement('input');
        NewNode.setAttribute("type",'button');
        NewNode.setAttribute('value','生成周报');
        document.getElementsByClassName('fui-toolbar')[0].appendChild(NewNode);
        NewNode.addEventListener("click", gen);


        // console.log(document.cookie)

        // var noteGird = mini.get('datagrid');
        // var noteColumns = noteGird.columns;

        // noteColumns.push({
        //     width : 100,
        //     headerAlign : "center",
        //     align : "center",
        //     header : '截止时间',
        //     renderer:function(e){
        //         if(e.record.beizhu ==='问题受理'){
        //             url = "https://fdoc.epoint.com.cn/onlinedoc/rest/kfzknowledge/kfzknowledge/handlequestionworkflowaction9/page_load?ProcessVersionInstanceGuid="+ e.record.pviguid;
        //             console.log(url)
        //             var value;
        //             GM_xmlhttpRequest({
        //                 method: "POST",
        //                 url: url,
        //                 async:false,
        //                 headers: {
        //                     "Accept": "application/json, text/javascript, */*; q=0.01",
        //                     "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        //                     "Cache-Control": "no-cache",
        //                     "Connection": "keep-alive",
        //                     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        //                 },
        //                 data: "commonDto=[{\"id\":\"mini-21\",\"bind\":\"dataBean.shouldfinishdate\",\"type\":\"outputtext\",\"action\":\"\",\"format\":\"yyyy-MM-dd+HH:mm:ss\",\"dataOptions\":\"{format:'yyyy-MM-dd HH:mm:ss'}\"}]",
        //                 onload: function(response) {
        //                     const data = JSON.parse(response.responseText);
        //                     value = data.controls[0].value;
        //                     console.log(value)
        //                 },
        //                 onerror: function(response) {
        //                     return "Request failed";
        //                 }
        //             });

        //             console.log(value)
        //             return value;
        //         }
        //         else{
        //             return "无需关注时间"
        //         }
        //     }
		// });

        // noteGird.set({columns : noteColumns});
        // noteGird.reload();
        // console.log(document.cookie)

        // var noteGird = mini.get('datagrid');
        // var noteColumns = noteGird.columns;

        // noteColumns.push({
        //     width : 100,
        //     headerAlign : "center",
        //     align : "center",
        //     header : '截止时间',
        //     renderer:function(e){
        //         if(e.record.beizhu ==='问题受理'){
        //             url = "https://fdoc.epoint.com.cn/onlinedoc/rest/kfzknowledge/kfzknowledge/handlequestionworkflowaction9/page_load?ProcessVersionInstanceGuid="+ e.record.pviguid;
        //             console.log(url)
        //             var value;
        //             GM_xmlhttpRequest({
        //                 method: "POST",
        //                 url: url,
        //                 async:false,
        //                 headers: {
        //                     "Accept": "application/json, text/javascript, */*; q=0.01",
        //                     "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        //                     "Cache-Control": "no-cache",
        //                     "Connection": "keep-alive",
        //                     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        //                 },
        //                 data: "commonDto=[{\"id\":\"mini-21\",\"bind\":\"dataBean.shouldfinishdate\",\"type\":\"outputtext\",\"action\":\"\",\"format\":\"yyyy-MM-dd+HH:mm:ss\",\"dataOptions\":\"{format:'yyyy-MM-dd HH:mm:ss'}\"}]",
        //                 onload: function(response) {
        //                     const data = JSON.parse(response.responseText);
        //                     value = data.controls[0].value;
        //                     console.log(value)
        //                 },
        //                 onerror: function(response) {
        //                     return "Request failed";
        //                 }
        //             });

        //             console.log(value)
        //             return value;
        //         }
        //         else{
        //             return "无需关注时间"
        //         }
        //     }
		// });

        // noteGird.set({columns : noteColumns});
        // noteGird.reload();

    }

    else if(url.startsWith('https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/fydetail_edit')) {
        var cbButtonNode = document.createElement('input');
        cbButtonNode.setAttribute("type",'button');
        cbButtonNode.setAttribute('value','转换餐补');
        document.getElementsByClassName('fui-toolbar')[0].appendChild(cbButtonNode);
        cbButtonNode.addEventListener("click", cb);
    }

    else if(url.startsWith('https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontentold')){
        var taskGrid = mini.get('taskGrid');
        var columns = taskGrid.columns;

         //展示任务评审工时
        columns.insert(11,{
						width : 50,
						headerAlign : "center",
						align : "center",
						header : '计划任务工时',
                        field : 'expectcosted'
		});


        //展示任务评审工时
        columns.insert(12,{
						width : 50,
						headerAlign : "center",
						align : "center",
						header : '标准任务工时',
                        field : 'expectcosted',
            renderer:function(e){
                //职级为10的话要除1.5才是实际计划工时
                return e.value/1.27;
            }
		});


        columns.insert(13,{
						width : 50,
						headerAlign : "center",
						align : "center",
						header : '结余率',
                        field : 'expectcosted',
            renderer:function(e){
                var costWork = e.record.realworkdays;
                var costWorkValue = costWork==""?0:costWork;
                var rate =formatDecimal(100 - (costWorkValue/e.value)*100,2);
                if (rate > 0 && rate < 10){
                 return '<font Color=Greed>'+rate +"%"+'</font>'
                }
                else{
                    return '<font Color=Red>'+rate +"%"+'</font>'
                }
            }
		});

        columns.push({
						width : 50,
						headerAlign : "center",
						align : "center",
						header : '任务延期',
            renderer:function(e){
        return "<a href='https://oa.epoint.com.cn/ProjectManage/ProjectMission/MissionDelay/Finisher_Delay.aspx?RowGuid=" + e.row.rowguid + "' target = '_blank'>延期</a>"
    }
		});


        //新增勾选框
        columns.push({
            width : 15,
            type : 'checkcolumn',
        });

        taskGrid.set({columns : columns});
        taskGrid.reload();

        var rzzbButton = document.createElement('input');
        rzzbButton.setAttribute("type",'button');
        rzzbButton.setAttribute('value','生成周报');
        var targetElement =  document.getElementById('btnopenceshimissonapplynew');
        if (targetElement.nextSibling) {
            targetElement.parentNode.insertBefore(rzzbButton, targetElement.nextSibling);
        } else {
            targetElement.parentNode.appendChild(rzzbButton);
        }

        rzzbButton.addEventListener("click", rzgen);
    }

    else if(url.startsWith('https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrzsummary/gzrzsummarylist')){
        var rzGrid = mini.get("datagrid");

        rzGrid.on("load", function(e) {
            let rzSum = 0;
            rzGrid.getData().forEach(item=>{
                if(isDateInCurrentMonth(item.rzdate)){
                    rzSum += item.gongzuosj != '' ?  parseFloat(item.gongzuosj) : 0;
                }
            });
            console.log(rzSum)
             // 创建一个新的 div 元素
            const newDiv = document.createElement("div");

            // 设置 div 的文本内容
            newDiv.textContent = `当月已填工时为 ${rzSum}小时`;

            // 找到 class 为 'fui-condition' 的元素
            const conditionElement = document.querySelector(".fui-condition");

            // 将新创建的 div 插入到 'fui-condition' 元素之前
            conditionElement.parentNode.insertBefore(newDiv, conditionElement);
        });
    }


    function rzgen(){
       var datagrid = mini.get('taskGrid');
       var ids = datagrid.getSelectedIds();

        if (ids.length > 0) {
            var titleArray = [];
            var selectArrayData = mini.get(datagrid).getSelecteds();
            selectArrayData.forEach(item=>{
                const str = item.missionname;
                titleArray.add(str);
            });
            var output ="";
            titleArray.forEach((str, index) => {
                output += str + (index < titleArray.length - 1 ? "\n" : "");
            });
            copyContent(output)
        } else {
            epoint.alert("请选择要生成的记录!", null, null, 'warning');
        }
    }

    // 定义delay函数
    function gen() {
       var datagrid = mini.get('datagrid');
       var ids = datagrid.getSelectedIds();

        if (ids.length > 0) {
            var titleArray = [];
            var selectArrayData = mini.get(datagrid).getSelecteds();
            selectArrayData.forEach(item=>{
                const str = item.topic;
                const regex = /title="\s*(.*?)\s*"/;
                const match = str.match(regex);
                if (match) {
                    titleArray.add(match[1])
                } else {
                    console.log('未找到 title 属性');
                }
            });
            var output ="";
            titleArray.forEach((str, index) => {
                output += str + (index < titleArray.length - 1 ? "\n" : "");
            });
            copyContent(output)
        } else {
            epoint.alert("请选择要生成的记录!", null, null, 'warning');
        }
    }

    // 餐补
    function cb() {
        var btlx = document.getElementById('bxTypeName$text');
        btlx.removeAttribute('readonly')
        mini.get("bxType").setValue('010206');
        mini.get("bxTypeName").setValue('加班餐补贴');
        mini.get("beizhu").setValue('加班晚餐(25元)');
        save()
    }

    // 复制到粘贴板
    async function copyContent(content) {
        try {
            console.log(content)
            await navigator.clipboard.writeText(content);
            epoint.confirm("生成成功，去粘贴?","确认",function(){
                window.open("https://shimo.im/docs/5rk9KrPW61FNlZ3x");
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }


    function isDateInCurrentMonth(dateString) {
        // 将字符串转换为Date对象
        const date = new Date(dateString);

        // 获取当前日期
        const currentDate = new Date();

        // 判断年份和月份是否相同
        return date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth();
    }

    function formatDecimal(num, decimal) {
        num = num.toString()
        let index = num.indexOf('.')
        if (index !== -1) {
            num = num.substring(0, decimal + index + 1)
        } else {
            num = num.substring(0)
        }
        return parseFloat(num).toFixed(decimal)
}

})();
