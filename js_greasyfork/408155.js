// ==UserScript==
// @name         Akuvox TaskBoard Tools
// @namespace    http://www.akuvox.com/
// @version      3.2
// @description  try to take over the world!
// @author       minjie.chen
// @match        http://192.168.10.3:81/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/408155/Akuvox%20TaskBoard%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/408155/Akuvox%20TaskBoard%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    * wiki脚本源码
    */

    function getTaskCardUserName(taskCard) {
        var res = $(taskCard).find('div[class="minicard-members js-minicard-members"]').find('a').attr('title');
        if (res === null || res === undefined) {
            res = "";
        } else {
            res = res.toString();
        }
        return res;
    }

    function getTaskCardTitle(taskCard) {
        var res = $(taskCard).find('div[class="minicard-title"]').find('p').text();
        if (res === null || res === undefined) {
            res = "";
        } else {
            res = res.toString();
        }
        return res;
    }

    function getTaskPriority(taskCard) {
        var res = $(taskCard).find('.minicard-label').attr('title');
        if (res === null || res === undefined) {
            res = "P1";        // 默认P1
        } else {
            res = res.toString();
        }
        return res;
    }

    function getTaskCardDeadLine(taskCard) {
        var res = $(taskCard).find('div[class="dates"]').find('time').last().text();
        if (res === null || res === undefined) {
            res = "";
        } else {
            res = res.toString();
        }
        return res;
    }

    function getPriorityValue(taskPri, delay) {
        if (taskPri === "P0") {
            return delay? -1 : 3;
        } else if (taskPri === "P1") {
            return delay?  0 : 1;
        } else if (taskPri === "P2") {
            return delay?  1 : 0;
        }

        // default
        return delay?  0 : 1;
    }

    function getScoreValue(taskScore) {
        return parseInt(taskScore);
    }

    function isOverTaskCardDeadLine(taskCard) {
        var deadline = $(taskCard).find('div[class="dates"]').find('time').last();
        if (deadline === null || deadline === undefined) {
            return false;
        }

        return deadline.parent().is('.current');
    }

    function getTaskCardColor(taskCard) {
        var deadline = $(taskCard).find('div[class="dates"]').find('time').last();
        if (deadline === null || deadline === undefined) {
            return false;
        }
        if(deadline.parent().is('.due') || deadline.parent().is('.long-overdue')){
            return 2;
        }else if(deadline.parent().is('.almost-due')){
            return 1;
        }
        return 0;
    }

    function getTimeValue(taskTime) {
        if (taskTime) {
            return 1;
        }

        return 0;
    }


    function getTaskStatus(taskCard) {
        var res = $(taskCard).parents('div[class="list js-list"]').find('h2[class="list-header-name js-open-inlined-form is-editable"]').text().toString();
        if (res.indexOf("To Do") >= 0) {
            return "ToDo";
        } else if (res.indexOf("Doing") >= 0) {
            return "Doing";
        } else if (res.indexOf("Suspended") >= 0) {
            return "Suspended";
        }
        return null;
    }

    function getTaskDoneStatus(taskCard) {
        var res = $(taskCard).parents('div[class="list js-list"]').find('h2[class="list-header-name js-open-inlined-form is-editable"]').text().toString();
        if (res.indexOf("Archived") >= 0) {
            return "Archived";
        }
        return null;
    }

    function addToResult(currentResult, taskCard) {
        var taskUserName = getTaskCardUserName(taskCard);
        var taskTitle = getTaskCardTitle(taskCard);
        var taskDeadLine = getTaskCardDeadLine(taskCard);
        var taskStatus = getTaskStatus(taskCard);
        var taskWellDone = getTaskCardColor(taskCard);
        if (taskStatus === null) {
            return currentResult;
        }

        var task = {"user": taskUserName, "title": taskTitle, "deadline": taskDeadLine, "status": taskStatus,"deadlineStatus":taskWellDone};
        currentResult.push(task);
        return currentResult
    }

    function getTaskScore(taskCard) {
        var customitem = $(taskCard).find('div[class="minicard-custom-field-item"]').last();
        if (customitem === null || customitem === undefined) {
            // default
            return "0";
        }

        var score = customitem.find('p').text().toString();
        if (score === null || score === undefined || score === '') {
            // default
            return "0";
        }

        return score;
    }


    var memberList = ['刘紫馨 (jane.liu)', '叶林凤 (phoenixylf)', '洪梁枫 (vipHong)', '冯涛 (fenton)', '游炳坤 (Bink)', '赖胜昌 (shengchang.lai)', '陈敏杰 (陈敏杰)', '曾磊 (lei.zeng)', '刘鲤扬 (lynn)', '胡传淑敏 (chuanshumin.hu)', '乐忠豪 (乐忠豪)','王伟建 (王伟建)','杨伊莎 (yangyisha)','林昱 (linky)', '黄慜哲 (SeaRecluse)', '兰泽华 (lanzehua)', '唐鹏遥 (bobby)'];

    function sortByList(a, b) {
        if(memberList.indexOf(a.user) == -1){
            memberList.push(a.user);
        }
        if(memberList.indexOf(b.user) == -1){
            memberList.push(b.user);
        }
        return memberList.indexOf(a.user) - memberList.indexOf(b.user);
    }

    function sortByDoneList(a, b) {
        return memberList.indexOf(a.name) - memberList.indexOf(b.name);
    }

    function addToDoneResult(currentResult, taskCard) {
        var taskStatus = getTaskDoneStatus(taskCard);
        if (taskStatus === null) {
            return currentResult;
        }

        var taskUserName = getTaskCardUserName(taskCard);
        var taskTitle = getTaskCardTitle(taskCard);
        var taskPri = getTaskPriority(taskCard);
        var taskWellDone = isOverTaskCardDeadLine(taskCard);
        var taskScore = getTaskScore(taskCard);

        var task = {"name": taskUserName, "pri": taskPri, "score": taskScore, "inTime": taskWellDone, "title": taskTitle};
        currentResult.push(task);
        return currentResult
    }

    function performanceScorePolicy(sumUsers, userName, finalResult) {
        var score = 0;
        $.each(finalResult, function(i, result){
            if (0 <= result.name.indexOf(userName)) {
                var x = getScoreValue(result.score);
                var t = getTimeValue(result.inTime);
                var pri = getPriorityValue(result.pri, t == 0);
                if (t == 0) {
                    // 延误
                    score += (x - 3 + pri);
                } else {
                    // 按时
                    var tmp = (x - 1 + pri);
                    score += tmp < 0 ? 0 : tmp;
                }
            }
        });

        if (score <= -5) score = -5;
        if (score >= 15) score = 15;
        return score;
    }


    //----------------------------------//


    /*
    * 库方法
    */
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

    function scrollView(node){

        var btn=node;
        var mousedown = document.createEvent("MouseEvents");
        var rect = btn.getBoundingClientRect();
        var x = rect.x;
        var y = rect.y;
        mousedown.initMouseEvent("mousedown",true,true,window,0,
                                 x, y, x, y,false,false,false,false,0,null);
        btn.dispatchEvent(mousedown);

        var dx = 0;
        var dy = 500;
        var times = 4;
        var interval = setInterval(function(){
            var mousemove = document.createEvent("MouseEvents");
            var _x = x + dx;
            var _y = y + dy;

            mousemove.initMouseEvent("mousemove",true,true,window,0,
                                     _x, _y, _x, _y,false,false,false,false,0,null);
            btn.dispatchEvent(mousemove);

            btn.dispatchEvent(mousemove);
            times --;
            if(times < 0){
                clearInterval(interval);
                var mouseup = document.createEvent("MouseEvents");
                mouseup.initMouseEvent("mouseup",true,true,window,0,
                                       _x, _y, _x, _y,false,false,false,false,0,null);
                btn.dispatchEvent(mouseup);
            }else{
                dy += 200;
            }
        }, 30);
    }


   //----------------------------------//
    var interval = 0;
    var intervalDone = 0;
    function showTableResult(){
        clearInterval(interval);
        clearInterval(intervalDone);
        var tableDone = document.getElementById("tableDoneResult");
        if(null != tableDone && tableDone.style.display == ""){
            tableDone.style.display="none";
        }

        var table = document.getElementById("tableResult");
        if(null != table && table.style.display == ""){
            table.style.display="none";
            document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.visibility = "";
        }else{
         
            document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.height = "100000px";
            document.documentElement.webkitRequestFullscreen();

            var resultCount = 0;
            interval = setInterval(function(){
                var finalResult = [];
                var taskCards = $(".minicard");
                for (var j in taskCards) {
                    if (j < 200) {
                        finalResult = addToResult(finalResult, taskCards[j]);
                    }
                }
                finalResult = finalResult.sort(sortByList);
                resultCount = finalResult.length;
                console.log(resultCount,finalResult);
                var html = ""
                html += "<div id=\"tableResult\"><table  align=\"center\" style=\"width:70%;position: relative;margin:0 auto;z-index:100\" >"+
                    "<tbody><tr><td style=\"width:10%\"><label>序号</label></td><td style=\"width:20%\"><label>用户名</label></td><td style=\"width:50%\"><label>任务名称</label></td><td style=\"width:10%\"><label>截至日期</label></td><td style=\"width:10%\"><label>状态</label></td></tr></tbody>";
                html += "</table>";

                var lastName = "null";
                var childCount = 0;
                var missionCountArr = [];
                var missionCount = 0;
                for(var i = 0;i<finalResult.length;i++){
                    if(lastName != finalResult[i].user){
                        lastName = finalResult[i].user;
                        html += "<table align=\"center\" style=\"width:70%;position: relative;margin:0 auto;z-index:100\" >"+
                            "<tbody><tr><td style=\"background:#E2EFF8;\"><label id=usetItemTable"+(childCount)+" style=\"text-align:center;cursor: pointer;\">"+(finalResult[i].user == ""?"未分配":finalResult[i].user)+"</label></td></tr></tbody>";
                        html += "</table>";
                        html += "<table id=childTable"+(childCount)+" align=\"center\" style=\"width:70%;position: relative;margin:0 auto;z-index:100\" >";
                        missionCountArr[childCount-1] = missionCount;
                        missionCount = 0;
                        childCount++;
                    }
                    missionCount++;
                    if(finalResult[i].deadlineStatus == 1){
                        html += "<tr style=\"background: #ffff0052\">";
                    }else if(finalResult[i].deadlineStatus == 2){
                        html += "<tr style=\"background: #ec22226e\">";
                    }

                    html += "<td style=\"width:10%\"><label>"+(i+1)+"</label></td><td style=\"width:20%\"><label>"+finalResult[i].user+"</label></td><td style=\"width:50%\"><label>"+finalResult[i].title+"</label></td><td style=\"width:10%\"><label>"+finalResult[i].deadline+"</label></td><td style=\"width:10%\"><label>"+finalResult[i].status+"</label></td></tr>";

                }
                missionCountArr[childCount-1] = missionCount;
                html += "</div>";
                var table = document.getElementById("tableResult");
                if(null == table){
                    console.log("empty");
                    document.getElementById("content").appendHTML(html);
                }else{
                    console.log("empty111");
                    table.innerHTML = html;
                    table.style.display="";

                }

                for(var k = 0;k<childCount;k++){
                    document.getElementById("usetItemTable"+k).innerHTML += (" —— 任务量：" + missionCountArr[k] + "个");

                    document.getElementById("usetItemTable"+k).addEventListener('click', function (ev) {
                        var dom = this.parentNode.parentNode.parentNode.parentNode.nextElementSibling;

                        if(dom.style.display == ""){
                            dom.style.display = "none";
                        }else{
                            dom.style.display = "";
                        }
                    });
                }

                //document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.display = "none";
                document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.visibility = "hidden";
                document.getElementsByTagName("html")[0].style.userSelect="auto"
                //clearInterval(interval);
                 document.webkitCancelFullScreen();
            }, 2000);
        }
    }

    function showAllTable(){
        for(var i = 0;i<memberList.length+1;i++){
            if(null != document.getElementById("childTable"+i)){
                document.getElementById("childTable"+i).style.display=""
            }
            if(null != document.getElementById("childDoneTable"+i)){
                document.getElementById("childDoneTable"+i).style.display="";
            }
        }
    }

    function hideAllTable(){
        for(var i = 0;i<memberList.length+1;i++){
            if(null != document.getElementById("childTable"+i)){
                document.getElementById("childTable"+i).style.display="none"
            }
            if(null != document.getElementById("childDoneTable"+i)){
                document.getElementById("childDoneTable"+i).style.display="none";
            }
        }
    }

    function showTableDoneResult(){
        clearInterval(interval);
        clearInterval(intervalDone);
        var table = document.getElementById("tableResult");
        if(null != table && table.style.display == ""){
            table.style.display="none";
        }

        var tableDone = document.getElementById("tableDoneResult");
        if(null != tableDone && tableDone.style.display == ""){
            tableDone.style.display="none";
            document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.visibility = "";
        }else{
            /*for(var j = 0;j<document.getElementsByClassName("ps-scrollbar-y").length;j++){
                scrollView(document.getElementsByClassName("ps-scrollbar-y")[j]);
            }*/
            document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.height = "100000px";
            document.documentElement.webkitRequestFullscreen();

           intervalDone = setInterval(function(){
                var finalResult = [];
                var scores = [
                    {
                        "name": "林昱",
                        "score": 0,
                        "offset": 0.5,
                        "performance": 0
                    },
                    {
                        "name": "刘紫馨",
                        "score": 0,
                        "offset": 0.5,
                        "performance": 0
                    },
                    {
                        "name": "叶林凤",
                        "score": 0,
                        "offset": 0.5,
                        "performance": 0
                    },
                    {
                        "name": "洪梁枫",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "冯涛",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "游炳坤",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "赖胜昌",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "陈敏杰",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "曾磊",
                        "score": 0,
                        "offset": 0,
                        "performance": 0
                    },
                    {
                        "name": "刘鲤扬",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "胡传淑敏",
                        "score": 0,
                        "offset": 0,
                        "performance": 0
                    },
                    {
                        "name": "乐忠豪",
                        "score": 0,
                        "offset": 0,
                        "performance": 0
                    },
                    {
                        "name": "王伟建",
                        "score": 0,
                        "offset": 0,
                        "performance": 0
                    },
                    {
                        "name": "杨伊莎",
                        "score": 0,
                        "offset": 0,
                        "performance": 0
                    },
                    {
                        "name": "黄慜哲",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "兰泽华",
                        "score": 0,
                        "offset": 0.25,
                        "performance": 0
                    },
                    {
                        "name": "唐鹏遥",
                        "score": 0,
                        "offset": 0,
                        "performance": 0
                    },
                ];

                var taskCards = $(".minicard");
                for (var i in taskCards) {
                    if (i < 1000) {
                        finalResult = addToDoneResult(finalResult, taskCards[i]);
                    }
                }

                $.each(scores, function(i, user){
                    var performance = performanceScorePolicy(scores.length, user.name, finalResult);
                    user.score = performance + user.offset;
                });

                $.each(scores, function(i, user){
                    var x = user.score;
                    if (x <= -3) {
                        x = Math.log(-x);
                        user.performance = -0.17*x*x + 0.25*x + 0.83;
                    } else if (x <= 0) {
                        x = (1 - Math.exp(x))/(1 + Math.exp(x));
                        user.performance = -0.44*x*x*x + 0.52*x*x - 0.2*x + 0.95;
                    } else if (x <= 2) {
                        user.performance = 0.025*x + 0.95;
                    } else if (x <= 5) {
                        user.performance = 0.06*Math.sqrt(x) + 0.915;
                    } else if (x <= 10) {
                        x = Math.log(x + 20) / Math.log(10);
                        user.performance = x - 0.348;
                    } else {
                        x = Math.log(x + 20) / Math.log(10);
                        user.performance = -42.16*x + 108.08*Math.sqrt(x) - 67.95;
                    }

                    // 在这里计算基准分
                    // user.performance -= 0.00;
                    var trimValue = user.performance.toFixed(2);
                    trimValue = trimValue.charAt(trimValue.length - 1);
                    trimValue = parseInt(trimValue);
                    if (user.performance < 1.0) {
                        if (trimValue > 5) {
                            user.performance = (user.performance + (10 - trimValue)/100);
                        }
                    } else {
                        if (trimValue > 5) {
                            user.performance = user.performance - (trimValue - 5)/100;
                        } else if (trimValue < 5) {
                            user.performance = user.performance - trimValue/100;
                        }
                    }

                    user.performance = user.performance.toFixed(2);
                    delete user.offset;
                });

                finalResult = finalResult.sort(sortByDoneList);
                var html = ""
                //合计分数
                html += "<div id=\"tableDoneResult\"><table  align=\"center\" style=\"width:35%;position: relative;margin:0 auto;z-index:100\" >"+
                    "<tbody><tr><td style=\"width:30%\"><label>序号</label></td><td style=\"width:40%\"><label>用户名</label></td><td style=\"width:30%\"><label>绩效</label></td></tr></tbody>";

                for(var n = 0;n<scores.length;n++){
                    html += "<tr><td style=\"width:30%\"><label>"+(n+1)+"</label></td><td style=\"width:40%\"><label>"+scores[n].name+"</label></td><td style=\"width:30%\"><label>"+scores[n].performance+"</label></td></tr>";
                }
                html += "</table>";


                //具体内容
                html += "<table  align=\"center\" style=\"width:70%;position: relative;margin:0 auto;z-index:100\" >"+
                    "<tbody><tr><td style=\"width:7.5%\"><label>序号</label></td><td style=\"width:20%\"><label>用户名</label></td><td style=\"width:50%\"><label>任务名称</label></td><td style=\"width:7.5%\"><label>紧急程度</label></td><td style=\"width:7.5%\"><label>分数</label><td style=\"width:7.5%\"><label>是否按时</label></td></tr></tbody>";
                html += "</table>";

                var lastName = "null";
                var childCount = 0;
                var missionCountArr = [];
                var missionCount = 0;
                var scoreCountArr = [];
                var scoreCount = 0;
                for(var k = 0;k<finalResult.length;k++){
                    if(lastName != finalResult[k].name){
                        lastName = finalResult[k].name;
                        html += "<table align=\"center\" style=\"width:70%;position: relative;margin:0 auto;z-index:100\" >"+
                            "<tbody><tr><td style=\"background:#E2EFF8;\"><label id=usetItemDoneTable"+(childCount)+" style=\"text-align:center;cursor: pointer;\">"+(finalResult[k].name == ""?"未分配":finalResult[k].name)+"</label></td></tr></tbody>";
                        html += "</table>";
                        html += "<table id=childDoneTable"+(childCount)+" align=\"center\" style=\"width:70%;position: relative;margin:0 auto;z-index:100\" >";
                        missionCountArr[childCount-1] = missionCount;
                        missionCount = 0;
                        scoreCountArr[childCount-1] = scoreCount;
                        scoreCount = 0;
                        childCount++;
                    }
                    missionCount++;
                    scoreCount += Number(finalResult[k].score);
                    if(!finalResult[k].inTime){
                        html += "<tr style=\"background: #ec22226e\">";
                    }
                    html += "<td style=\"width:7.5%\"><label>"+(k+1)+"</label></td><td style=\"width:20%\"><label>"+finalResult[k].name+"</label></td><td style=\"width:50%\"><label>"+finalResult[k].title+"</label></td><td style=\"width:7.5%\"><label>"+finalResult[k].pri+"</label></td><td style=\"width:7.5%\"><label>"+finalResult[k].score+"</label></td><td style=\"width:7.5%\"><label>"+(finalResult[k].inTime? "是":"否")+"</label></td></tr>";

                }
                missionCountArr[childCount-1] = missionCount;
                scoreCountArr[childCount-1] = scoreCount;
                html += "</div>";

                var table = document.getElementById("tableDoneResult");
                if(null == table){
                    document.getElementById("content").appendHTML(html);
                }else{
                    table.innerHTML = html;
                    table.style.display="";
                }
                
                for(var m = 0;m<childCount;m++){
                    document.getElementById("usetItemDoneTable"+m).innerHTML += (" —— 完成数量：" + missionCountArr[m] + "个、——合计分数：" + scoreCountArr[m] +"分");

                    document.getElementById("usetItemDoneTable"+m).addEventListener('click', function (ev) {
                        var dom = this.parentNode.parentNode.parentNode.parentNode.nextElementSibling;

                        if(dom.style.display == ""){
                            dom.style.display = "none";
                        }else{
                            dom.style.display = "";
                        }
                    });
                }
                document.getElementsByClassName("board-wrapper board-color-nephritis")[0].style.visibility = "hidden";
                document.getElementsByTagName("html")[0].style.userSelect="auto"
                 document.webkitCancelFullScreen();
            }, 2000);
        }
    }


    function createButton() {
        document.getElementsByClassName("board-header-btns left")[0].appendHTML("<a class=\"board-header-btn \" title=\"查看待办任务\" href=\"#\" id=btnTodo ><i class=\"fa fa-th-large\"></i><span>查看待办任务</span></a>");
        document.getElementById('btnTodo').addEventListener('click', function (ev) {
            showTableResult();
        });

        document.getElementsByClassName("board-header-btns left")[0].appendHTML("<a class=\"board-header-btn \" title=\"查看完成任务\" href=\"#\" id=btnDone ><i class=\"fa fa-flag\"></i><span>查看完成任务</span></a>");
        document.getElementById('btnDone').addEventListener('click', function (ev) {
            showTableDoneResult();
        });

        document.getElementsByClassName("board-header-btns left")[0].appendHTML("<a class=\"board-header-btn \" title=\"一键打开\" href=\"#\" id=btnShowAll ><i class=\"fa fa-angle-double-down\"></i><span>一键打开</span></a>");
        document.getElementById('btnShowAll').addEventListener('click', function (ev) {
            showAllTable();
        });

        document.getElementsByClassName("board-header-btns left")[0].appendHTML("<a class=\"board-header-btn \" title=\"一键关闭\" href=\"#\" id=hideAll ><i class=\"fa fa-angle-double-up\"></i><span>一键关闭</span></a>");
        document.getElementById('hideAll').addEventListener('click', function (ev) {
            hideAllTable();
        });

    }


    function hasInited(){
        if($(".minicard").length > 0 ){
            clearInterval(checkInit);
            createButton();
            test();
        }

    }

    var checkInit = setInterval(hasInited,500);


    function test(){
        //document.getElementsByClassName("board-header-btn js-toggle-sidebar")[0].click();
    }

})();