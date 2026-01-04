// ==UserScript==
// @name         Jira Tools
// @namespace    http://www.akuvox.com/
// @version      1.7
// @description  Jira看板，自动统计工作量
// @author       minjie.chen
// @match        http://192.168.10.2:82/secure/RapidBoard.jspa?rapidView=11*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10.2
// @grant        none
// @license      minjie.chen
// @downloadURL https://update.greasyfork.org/scripts/472154/Jira%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/472154/Jira%20Tools.meta.js
// ==/UserScript==

(function() {

    /*库方法*/
    HTMLElement.prototype.appendHTML = function(html) {
        var divTemp = document.createElement("div"), nodes = null
        , fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i=0, length=nodes.length; i<length; i+=1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        this.appendChild(fragment);
        nodes = null;
        fragment = null;
    };

    setInterval(doGetDataAndShowWorkload, 1000);

    function doGetDataAndShowWorkload(){
        // 页面及所有资源加载完成后执行的代码
        $.get('http://192.168.10.2:82/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=11&selectedProjectKey=ANDROID', function(data) {
            // 请求成功，打印响应数据
            showWorkload(data);

        }).fail(function() {
            // 请求失败，打印错误信息
            showWorkload("");

        });
    }




    var loadButton = true;
    var isFirst = true;
    function showWorkload(data){

        //var element = document.getElementsByClassName("subnav-container")[0].parentNode;
        var element = document.getElementById("ghx-operations");
        if(loadButton){
            loadButton = false;
            document.getElementById('ghx-header').setAttribute('isshow',0);
            element.appendHTML("<a  class=\"aui-button aui-button-primary aui-style\" onclick=\"document.getElementById('LastMonthPBX').style.display = '';document.getElementById('ghx-header').setAttribute('isshow',1);\" >上月PBC</a><a  class=\"aui-button aui-button-primary aui-style \" onclick=\"document.getElementById('CurMonthPBX').style.display = '';document.getElementById('ghx-header').setAttribute('isshow',1);\">本月PBC</a><a  class=\"aui-button aui-button-primary aui-style \" onclick=\"document.getElementById('NextMonthPBX').style.display = '';document.getElementById('ghx-header').setAttribute('isshow',1);\" >下月PBC</a></br>");
        }
        if(document.getElementById("AkuvoxWorkload") !== null){
            document.getElementById("AkuvoxWorkload").innerHTML = "";
            element = document.getElementById("AkuvoxWorkload");
        }
        if(data == ""){
            element.appendHTML("<span id=\"AkuvoxWorkload\" style=\"color: red;font-size: 20px;\">工作量统计错误，请刷新界面</span>");
            return;
        }
        var allData = data.issuesData.issues;
        var timeData = getMyWorkLoad(allData);
        var displayName = getDisplayName();
        console.log(timeData);

        element.appendHTML("<span id=\"AkuvoxWorkload\" style=\"font-size: 20px;\">"+displayName+":本周工作量：<span style=\"color:red;\">"+hoursToDaysAndHours(timeData.thisWeekWorkload)+"</span>;  下周工作量：<span style=\"color:red;\">"+hoursToDaysAndHours(timeData.netWeekWorkload)+"</span><br>"+displayName+":本月工作量：<span style=\"color:red;\">"+hoursToDaysAndHours(timeData.thisMonthWorkload)+"</span>;  下月工作量：<span style=\"color:red;\">"+hoursToDaysAndHours(timeData.nextMonthWorkload)+"</span></span>");


        var body = document.getElementById("jira");
        var lastPbc = "";
        for(var i = 0;i<timeData.lastMonthResult.length;i++){
            var dueDate = ""
            var worktime = ""
            for(var j = 0;j<timeData.lastMonthResult[i].extraFields.length;j++){
                if(timeData.lastMonthResult[i].extraFields[j].label == "到期日" || timeData.lastMonthResult[i].extraFields[j].label == "Due Date" || allData[i].extraFields[j].label == "Target end"){
                     dueDate = timeData.lastMonthResult[i].extraFields[j].html;
                     var regex = /<time[^>]*>([^<]*)<\/time>/;
                     var match = dueDate.match(regex);
                     if (match && match[1]) {
                         dueDate = match[1];
                     }
                }
                if(timeData.lastMonthResult[i].extraFields[j].label == "初始预估" || timeData.lastMonthResult[i].extraFields[j].label == "Original Estimate"){
                     worktime = timeData.lastMonthResult[i].extraFields[j].html;
                }
            }
            lastPbc = lastPbc + ("<tr><td>" + timeData.lastMonthResult[i].summary + "</td><td>" + dueDate + "</td><td>" + dueDate+ "</td><td>" + worktime+ "</td><td>" + 0 + "</td><td>"+ 0+ "</td><td>" + 0 + "</td>");
        }

        var curPbc = "";
        for(var i = 0;i<timeData.thisMonthResult.length;i++){
            var dueDate = ""
            var worktime = ""
            for(var j = 0;j<timeData.thisMonthResult[i].extraFields.length;j++){
                if(timeData.thisMonthResult[i].extraFields[j].label == "到期日" || timeData.thisMonthResult[i].extraFields[j].label == "Due Date" || allData[i].extraFields[j].label == "Target end"){
                     dueDate = timeData.thisMonthResult[i].extraFields[j].html;
                     var regex = /<time[^>]*>([^<]*)<\/time>/;
                     var match = dueDate.match(regex);

                     if (match && match[1]) {
                         dueDate = match[1];
                     }
                }
                if(timeData.thisMonthResult[i].extraFields[j].label == "初始预估" || timeData.thisMonthResult[i].extraFields[j].label == "Original Estimate"){
                     worktime = timeData.thisMonthResult[i].extraFields[j].html;
                }
            }
            curPbc = curPbc + ("<tr><td>" + timeData.thisMonthResult[i].summary + "</td><td>" + dueDate + "</td><td>" + dueDate+ "</td><td>" + worktime+ "</td><td>" + 0 + "</td><td>"+ 0+ "</td><td>" + 0 + "</td>");
        }

        var nextPbc = "";
        for(var i = 0;i<timeData.nextMonthResult.length;i++){
            var dueDate = ""
            var worktime = ""
            for(var j = 0;j<timeData.nextMonthResult[i].extraFields.length;j++){
                if(timeData.nextMonthResult[i].extraFields[j].label == "到期日" || timeData.nextMonthResult[i].extraFields[j].label == "Due Date" || allData[i].extraFields[j].label == "Target end"){
                     dueDate = timeData.nextMonthResult[i].extraFields[j].html;
                     var regex = /<time[^>]*>([^<]*)<\/time>/;
                     var match = dueDate.match(regex);
                     if (match && match[1]) {
                         dueDate = match[1];
                     }
                }
                if(timeData.nextMonthResult[i].extraFields[j].label == "初始预估" || timeData.nextMonthResult[i].extraFields[j].label == "Original Estimate"){
                     worktime = timeData.nextMonthResult[i].extraFields[j].html;
                }
            }
            nextPbc = nextPbc + ("<tr><td>" + timeData.nextMonthResult[i].summary + "</td><td>" + dueDate + "</td><td>" + dueDate+ "</td><td>" + worktime+ "</td><td>" + 0 + "</td><td>"+ 0+ "</td><td>" + 0 + "</td>");
        }

        var last = body;
        var cur = body;
        var next = body;
        var isShow = document.getElementById('ghx-header').getAttribute('isShow');
        console.log("isShow:",isShow);
        if(isShow == 0){
            if(document.getElementById("LastMonthPBX") !== null){
                console.log("dlaksjdlasjkl!!!!!!!!!!!!!!!!!!!!");
                document.getElementById("LastMonthPBX").innerHTML = "";
                document.getElementById("CurMonthPBX").innerHTML = "";
                document.getElementById("NextMonthPBX").innerHTML = "";
                //body.removeChild(document.getElementById("LastMonthPBX"));
                //body.removeChild(document.getElementById("CurMonthPBX"));
                //body.removeChild(document.getElementById("NextMonthPBX"));
                last = document.getElementById("LastMonthPBX");
                cur = document.getElementById("CurMonthPBX");
                next = document.getElementById("NextMonthPBX");

            }

            last.appendHTML("<div id=\"LastMonthPBX\" class=\"jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready\" style=\"width: 810px; margin-left: -406px;top: 0%;"+(isFirst?"display:none":"")+"\">" +
                            "<span class=\"ghx-iconfont aui-icon aui-icon-small aui-iconfont-close-dialog\" onclick=\"document.getElementById('LastMonthPBX').style.display = 'none';document.getElementById('ghx-header').setAttribute('isshow',0);\"  style=\"float: right;\"></span>" +
                            "<table border=\"1\"><tr><th>任务名称</th><th>计划完成时间</th><th>实际完成时间</th><th>工作量</th><th>已超期</th><th>未完成</th><th>难度系数</th></tr>"+lastPbc+"</table></div>");

            cur.appendHTML("<div id=\"CurMonthPBX\" class=\"jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready\" style=\"width: 810px; margin-left: -406px;top: 0%;"+(isFirst?"display:none":"")+"\">" +
                           "<span class=\"ghx-iconfont aui-icon aui-icon-small aui-iconfont-close-dialog\" onclick=\"document.getElementById('CurMonthPBX').style.display = 'none';document.getElementById('ghx-header').setAttribute('isshow',0);\"  style=\"float: right;\"></span>" +
                           "<table border=\"1\"><tr><th>任务名称</th><th>计划完成时间</th><th>实际完成时间</th><th>工作量</th><th>已超期</th><th>未完成</th><th>难度系数</th></tr>"+curPbc+"</table></div>");

            next.appendHTML("<div id=\"NextMonthPBX\" class=\"jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready\" style=\"width: 810px; margin-left: -406px;top: 0%;"+(isFirst?"display:none":"")+"\">" +
                            "<span class=\"ghx-iconfont aui-icon aui-icon-small aui-iconfont-close-dialog\" onclick=\"document.getElementById('NextMonthPBX').style.display = 'none';document.getElementById('ghx-header').setAttribute('isshow',0);\"  style=\"float: right;\"></span>" +
                            "<table border=\"1\"><tr><th>任务名称</th><th>计划完成时间</th><th>实际完成时间</th><th>工作量</th><th>已超期</th><th>未完成</th><th>难度系数</th></tr>"+nextPbc+"</table></div>");
        }
        isFirst=false;
    }

    function isDateInThisWeek(dateString) {
        // 将日期字符串转换为 Date 对象
        var date = new Date(dateString);

        // 获取当前日期
        var currentDate = new Date();

        // 获取当前日期的星期几（0表示星期日，1表示星期一，以此类推）
        var currentDayOfWeek = currentDate.getDay();

        // 获取本周一的日期
        var monday = new Date(currentDate);
        monday.setDate(currentDate.getDate() - currentDayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);

        // 获取本周日的日期
        var sunday = new Date(currentDate);
        sunday.setDate(currentDate.getDate() + (7 - currentDayOfWeek));
        sunday.setHours(23, 59, 59, 999);

        // 将待判断日期与本周一和本周日进行比较
        return date >= monday && date <= sunday;
    }

    function isDateInNextWeek(dateString) {
        // 将日期字符串转换为 Date 对象
        var date = new Date(dateString);

        // 获取当前日期
        var currentDate = new Date();

        // 获取当前日期的星期几（0表示星期日，1表示星期一，以此类推）
        var currentDayOfWeek = currentDate.getDay();

        // 计算下周一的日期
        var nextMonday = new Date(currentDate);
        nextMonday.setDate(currentDate.getDate() - currentDayOfWeek + 8);
        nextMonday.setHours(0, 0, 0, 0);

        // 计算下周日的日期
        var nextSunday = new Date(currentDate);
        nextSunday.setDate(currentDate.getDate() - currentDayOfWeek + 14);
        nextSunday.setHours(23, 59, 59, 999);

        // 将待判断日期与下周一和下周日进行比较
        return date >= nextMonday && date <= nextSunday;
    }

    function isDateInThisMonth(dateString) {
        // 将日期字符串转换为 Date 对象
        var date = new Date(dateString);

        // 获取当前日期
        var currentDate = new Date();

        // 获取当前日期的年份和月份
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        // 获取待判断日期的年份和月份
        var targetYear = date.getFullYear();
        var targetMonth = date.getMonth();

        // 判断待判断日期是否属于本月
        return currentYear === targetYear && currentMonth === targetMonth;
    }

    function isDateInLastMonth(dateString) {
        // 将日期字符串转换为 Date 对象
        var date = new Date(dateString);

        // 获取当前日期
        var currentDate = new Date();

        // 获取当前日期的年份和月份
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        // 获取待判断日期的年份和月份
        var targetYear = date.getFullYear();
        var targetMonth = date.getMonth();

        // 判断待判断日期是否是上个月
        if (currentYear === (targetYear+1) && currentMonth === 0 && targetMonth === 11) {
            return true;  // 当前是1月，待判断日期是去年的12月
        }

        return currentYear === targetYear && currentMonth - 1 === targetMonth;
    }

    function isDateInNextMonth(dateString) {
        // 将日期字符串转换为 Date 对象
        var date = new Date(dateString);

        // 获取当前日期
        var currentDate = new Date();

        // 获取当前日期的年份和月份
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        // 获取待判断日期的年份和月份
        var targetYear = date.getFullYear();
        var targetMonth = date.getMonth();

        // 计算下个月的年份和月份
        var nextMonthYear = currentYear;
        var nextMonth = currentMonth + 1;
        if (nextMonth === 12) {
            nextMonthYear = currentYear + 1;
            nextMonth = 0;
        }

        // 判断待判断日期是否属于下个月
        return targetYear === nextMonthYear && targetMonth === nextMonth;
    }


    function timeToHours(time) {
        // 定义时间单位与小时的换算关系
        const weeksToHours = 5 * 8;
        const daysToHours = 8;

        let totalHours = 0;


        var array = time.split(",");
        for(var i = 0 ;i<array.length;i++){

            const [amount, unit] = array[i].trim().split(' ');
            // 根据单位进行换算，并累加到总小时数
            if (unit === 'week' || unit === 'weeks') {
                totalHours += parseInt(amount) * weeksToHours;
            } else if (unit === 'day' || unit === 'days') {
                totalHours += parseInt(amount) * daysToHours;
            } else if (unit === 'hour' || unit === 'hours') {
                totalHours += parseInt(amount);
            }
        }
        

        return totalHours;
    }

    function getUserName(){
        var currentURL = window.location.href;
        if (currentURL.includes('quickFilter=')) {
            // 提取quickFilter参数的值
            const urlParams = new URLSearchParams(currentURL.split('?')[1]);
            const quickFilterValue = urlParams.get('quickFilter');
            if(quickFilterValue == 54){
                return "minjie.chen"
            }else if(quickFilterValue == 55){
                return "guoyong.lin"
            }else if(quickFilterValue == 59){
                return "weijian.wang"
            }else if(quickFilterValue == 57){
                return "hao.jiang"
            }else if(quickFilterValue == 56){
                return "minghui.zhou"
            }else if(quickFilterValue == 58){
                return "kaijia.wu"
            }else if(quickFilterValue == 60){
                return "nairong.yang"
            }else if(quickFilterValue == 127){
                return "zhixian.yang"
            }else if(quickFilterValue == 137){
                return "shize.huang"
            }else if(quickFilterValue == 138){
                return "xianhong.zhang"
            }else if(quickFilterValue == 179){
                return "zixin.liu"
            }else if(quickFilterValue == 190){
                return "kai.xiong"
            }else if(quickFilterValue == 192){
                return "haonan.chen"
            }else if(quickFilterValue == 223){
                return "hongru.chen"
            }else{
                return document.getElementById("header-details-user-fullname").getAttribute('data-username');
            }
        } else {
            return document.getElementById("header-details-user-fullname").getAttribute('data-username');
        }
    }

     function getDisplayName(){
         var currentURL = window.location.href;
        if (currentURL.includes('quickFilter=')) {
            // 提取quickFilter参数的值
            const urlParams = new URLSearchParams(currentURL.split('?')[1]);
            const quickFilterValue = urlParams.get('quickFilter');
            if(quickFilterValue == 54){
                return "陈敏杰"
            }else if(quickFilterValue == 55){
                return "林国勇"
            }else if(quickFilterValue == 59){
                return "王伟建"
            }else if(quickFilterValue == 57){
                return "江昊"
            }else if(quickFilterValue == 56){
                return "周明辉"
            }else if(quickFilterValue == 58){
                return "吴铠嘉"
            }else if(quickFilterValue == 60){
                return "杨乃容"
            }else if(quickFilterValue == 127){
                return "杨智贤"
            }else if(quickFilterValue == 137){
                return "黄世泽"
            }else if(quickFilterValue == 138){
                return "张显鸿"
            }else if(quickFilterValue == 179){
                return "刘紫馨"
            }else if(quickFilterValue == 190){
                return "熊凯"
            }else if(quickFilterValue == 192){
                return "陈浩楠"
            }else if(quickFilterValue == 223){
                return "陈鸿儒"
            }else{
                return document.getElementById("header-details-user-fullname").getAttribute('data-displayname');
            }
        } else {
            return document.getElementById("header-details-user-fullname").getAttribute('data-displayname');
        }
    }

    function hoursToDaysAndHours(hours) {
        // 计算天数和剩余小时数
        var days = Math.floor(hours / 8);
        var remainingHours = hours % 8;

        // 构造结果字符串
        var result = "";
        if (days > 0) {
            result += days + "天 ";
        }
        result += remainingHours + "小时";

        return result;
    }

    function getMyWorkLoad(allData){
        // 获得用户名
        var userName = getUserName();

        var thisWeekWorkload = 0;
        var netWeekWorkload = 0;
        var thisMonthWorkload = 0;
        var nextMonthWorkload = 0;

        var thisMonthResult = [];
        var nextMonthResult = [];
        var lastMonthResult = [];

        for(var i = 0;i<allData.length;i++){
            if(allData[i].assignee == userName){

                var thisWeek = 0;
                var nextWeek = 0;
                var thisMonth = 0;
                var nextMonth = 0;
                var time = 0;

                for(var j = 0;j<allData[i].extraFields.length;j++){
                    if(allData[i].extraFields[j].label == "初始预估" || allData[i].extraFields[j].label == "Original Estimate"){
                        time = timeToHours(allData[i].extraFields[j].html);
                    }else if(allData[i].extraFields[j].label == "到期日" || allData[i].extraFields[j].label == "Due Date" || allData[i].extraFields[j].label == "Target end"){
                        var targetTime = allData[i].extraFields[j].html;
                        var regex = /<time[^>]*>([^<]*)<\/time>/;
                        var match = targetTime.match(regex);
                        if (match && match[1]) {
                            targetTime = match[1];
                        }


                        if(isDateInThisWeek(targetTime)){
                             console.log("时间=",allData[i]);
                            thisWeek = time;
                        }
                        if(isDateInNextWeek(targetTime)){
                            nextWeek = time;
                        }
                        if(isDateInThisMonth(targetTime)){
                            thisMonth = time;
                            thisMonthResult.push(allData[i]);
                            break;
                        }
                        if(isDateInNextMonth(targetTime)){
                            nextMonth = time;
                            nextMonthResult.push(allData[i]);
                            break;
                        }
                        if(isDateInLastMonth(targetTime)){
                            lastMonthResult.push(allData[i]);
                            break;
                        }
                    }
                }
                thisWeekWorkload += thisWeek;
                netWeekWorkload += nextWeek;
                thisMonthWorkload += thisMonth;
                nextMonthWorkload += nextMonth;
            }
        }
        return {"thisWeekWorkload":thisWeekWorkload,"netWeekWorkload":netWeekWorkload,"thisMonthWorkload":thisMonthWorkload,"nextMonthWorkload":nextMonthWorkload,"thisMonthResult":thisMonthResult,"nextMonthResult":nextMonthResult,"lastMonthResult":lastMonthResult};
    }


})();