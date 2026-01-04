// ==UserScript==
// @name         ConfluenceAutoTools
// @namespace    http://www.akuvox.com/
// @version      2.1
// @description  try to take over the world!
// @author       minjie.chen
// @match        http://192.168.10.2:83/pages/*
// @grant        none
// @license      minjie.chen
// @downloadURL https://update.greasyfork.org/scripts/417863/ConfluenceAutoTools.user.js
// @updateURL https://update.greasyfork.org/scripts/417863/ConfluenceAutoTools.meta.js
// ==/UserScript==

(function() {

    String.prototype.replaceAll = function(s1, s2) {
        var value;
        value = this.replace(s1,s2);
        for(var i = 0;i<25;i++){
            value = value.replace(s1,s2);
        }
        return value;
    }

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

    //主函数开始
    //创建button
    var result = createButton();
    autoCompeleteDailyData(1);

    console.log("chenmj1 11111111");


    //自己的方法
    //flag：0本周、1下周、2下月
    function autoCompeleteDailyData(flag){

        //获得人名，userid
        var userInfo = document.getElementById("user-menu-link");
        var userId = userInfo.getAttribute("data-username");
        var userName = userInfo.getAttribute("title");
        //获得本周一
        var nowTemp = new Date();
        var oneDayLong = 24*60*60*1000;
        var c_time = nowTemp.getTime() ;//当前时间的毫秒时间
        var c_day = nowTemp.getDay()||7;//当前时间的星期几
        var m_time = c_time - (c_day-1)*oneDayLong;//当前周一的毫秒时间
        if(flag == 1)
        {
             m_time = c_time - (c_day-6)*oneDayLong;
        }
        var monday = new Date(m_time);//设置周一时间对象
        var m_year = monday.getFullYear();
        var m_month = monday.getMonth()+1;
        var m_date = monday.getDate();
        if(m_month <= 9){
            m_month = "0"+m_month;
        }
        if(m_date <=9){
             m_date = "0"+m_date;
        }
        if(flag ==2){
            m_year = "2020";
            m_month="01";
            m_date="01";
        }

        var mondayStr = m_year.toString()+m_month.toString()+m_date.toString();
        console.log("mondayStr",mondayStr);


        var s_time = c_time - (c_day-7)*oneDayLong;//当前周一的毫秒时间
        if(flag == 1)
        {
            s_time = c_time - (c_day-13)*oneDayLong;
        }
        var s_monday = new Date(s_time);
        var s_year = s_monday.getFullYear();
        var s_month = s_monday.getMonth()+1;
        var s_date = s_monday.getDate();
         if(s_month <= 9){
            s_month = "0"+s_month;
        }
        if(s_date <=9){
             s_date = "0"+s_date;
        }
         if(flag ==2){
            s_year = "2020";
            s_month="12";
            s_date="30";
        }
        var sundayStr = s_year.toString()+s_month.toString()+s_date.toString();

        //填入标题
        var title = document.getElementById("content-title-div").getElementsByTagName("input")[0];
        title.value = userName + " - " + mondayStr + "~" + sundayStr;

        console.log(s_year, "-" , s_month ,"-" , s_date);
        //填入表格数据
        for(var i = 0;i<document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro").length;i++){
            var data = document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].getAttribute("data-macro-parameters");
            console.log("chenmj",data);
            //替换 userid
            data = data.replaceAll("minjie.chen",userId);
            //替换开始日期
            //if(flag == 2){
            data = data.replaceAll("2023-01-07",m_year + "-" + m_month + "-" + m_date);
            data = data.replaceAll("2023-01-14",s_year + "-" + s_month + "-" + s_date);
            /*}else{
            console.log("new date",m_year + "-" + m_month + "-" + m_date);
            data = data.replaceAll("2020-01-01",m_year + "-" + m_month + "-" + m_date);
            data = data.replaceAll("2020-12-30",s_year + "-" + s_month + "-" + s_date);
        }*/


            /*var todo = data.substring(data.indexOf("待办任务"),data.indexOf("数据分析"));
            todo.replaceAll(s_year + "-" + s_month + "-" + s_date,"2099-01-01");
            todo.replaceAll(m_year + "-" + m_month + "-" + m_date,s_year + "-" + s_month + "-" + s_date);*/

            /*var front = data.substring(0,data.indexOf("待办任务"));
            var end = data.substring(data.indexOf("数据分析"));
            data = front + todo + end;*/
            console.log("final data = " ,data);

            document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].setAttribute("data-macro-parameters",data);
        }




    }

    function autoCompeleteMonthData(){
        //获得人名，userid
        var userInfo = document.getElementById("user-menu-link");
        var userId = userInfo.getAttribute("data-username");
        var userName = userInfo.getAttribute("title");
        //获得本月
        var nowTemp = new Date();
        var oneDayLong = 24*60*60*1000;
        var c_time = nowTemp.getTime() ;//当前时间的毫秒时间
        var c_month = nowTemp.getMonth()+1;//当前月份
        var c_year = nowTemp.getFullYear();//当前年份

        var m_month = c_month + 1 % 13 // 下个月
        var m_year = c_year;
        if(m_month == 0){
            m_month = 1;
            m_year = c_year+1;
        }

        if(m_month <= 9){
            m_month = "0"+m_month;
        }

        var mondayStr = m_year.toString()+m_month.toString()
        console.log("mondayStr",mondayStr);


        //填入标题
        var title = document.getElementById("content-title-div").getElementsByTagName("input")[0];
        title.value = userName + " - 工作日志 - " + mondayStr;

        //填入表格数据
        for(var i = 0;i<document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro").length;i++){
            var data = document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].getAttribute("data-macro-parameters");
            console.log("chenmj",data);
            if(null == data){
                continue;
            }
            //替换 userid

            data = data.replaceAll("minjie.chen",userId);
            data = data.replaceAll("2023-01-01",m_year + "-" + m_month + "-" + m_date);
            data = data.replaceAll("2023-01-31",s_year + "-" + s_month + "-" + s_date);
            //替换开始日期
            //if(flag == 2){
            //data = data.replaceAll("2023-08-01",m_year + "-" + m_month + "-" + m_date);
            //data = data.replaceAll("2023-08-31",s_year + "-" + s_month + "-" + s_date);
            /*}else{
            console.log("new date",m_year + "-" + m_month + "-" + m_date);
            data = data.replaceAll("2020-01-01",m_year + "-" + m_month + "-" + m_date);
            data = data.replaceAll("2020-12-30",s_year + "-" + s_month + "-" + s_date);
        }*/


            /*var todo = data.substring(data.indexOf("待办任务"),data.indexOf("数据分析"));
            todo.replaceAll(s_year + "-" + s_month + "-" + s_date,"2099-01-01");
            todo.replaceAll(m_year + "-" + m_month + "-" + m_date,s_year + "-" + s_month + "-" + s_date);*/

            /*var front = data.substring(0,data.indexOf("待办任务"));
            var end = data.substring(data.indexOf("数据分析"));
            data = front + todo + end;*/
            console.log("final data = " ,data);

            document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByClassName("editor-inline-macro")[i].setAttribute("data-macro-parameters",data);
        }
    }

    function test(){
        console.log(window.getSelection().getRangeAt(0).endContainer);
    }

    var isSetDesignData = false;
    function doSetDesignData(){
        if(isSetDesignData){
            return;
        }
        isSetDesignData = true;
        console.log("111");
        //填写标题
        var title = document.getElementById("content-title-div").getElementsByTagName("input")[0];
        title.value = "需求ID"
        //修改模板参数
        var match = window.location.href.match(/[?&]draftId=([^&]*)/);
        // 如果匹配成功，提取 draftId 的值
        var draftId = match && match[1];
        console.log("aaaaaaaaaaaaaa",draftId);
        var data = document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByTagName("a")[0].getAttribute("href");
        console.log("ccccccccccc",data,);
        data = data.replaceAll("chenmjid",draftId)
         console.log("bbbbbbbbb",data);
        document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByTagName("a")[0].setAttribute("data-mce-href",data);
        document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByTagName("a")[0].setAttribute("href",data);
        data = document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByTagName("a")[1].getAttribute("href");
        data = data.replaceAll("chenmjid",draftId)
        document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByTagName("a")[1].setAttribute("data-mce-href",data);
        document.getElementById("wysiwygTextarea_ifr").contentDocument.getElementsByTagName("a")[1].setAttribute("href",data);
        //console.log("data",data);

    }


    function doSetDesignDetailData(index,storeId){
        var title = document.getElementById("content-title-div").getElementsByTagName("input")[0];
        if(index == 0){
            title.value = ("ID"+storeId+"-开发设计")
        }else{
            title.value = ("ID"+storeId+"-自测报告")
        }


    }


    function createButton(){
        var title = document.getElementById("editor-precursor");
        if(null == title){
            return -1;
        }
        //找到工作日志，认为是在编辑日常工作
        var size = document.getElementById("breadcrumbs").getElementsByTagName("li").length;
        var isWorkLog = false;
        var isDesign = false;
        var isDesignDetail = false;
        var storeId = "";

        for(var i = 0;i<size;i++){
            var workspace = document.getElementById("breadcrumbs").getElementsByTagName("li")[i].innerHTML;
            console.log(workspace);
            if(workspace.indexOf("工作日志")>=0){
                isWorkLog = true;
                break;
            }else if (workspace.indexOf("设计文档")>=0){
                isDesign = true;
            }else if(isDesign && workspace.indexOf("需求ID")>=0){
                storeId = document.getElementById("breadcrumbs").getElementsByTagName("li")[i].getElementsByTagName("a")[0].innerHTML.substr(4);
                isDesign = false;
                isDesignDetail = true;
            }
        }
        
       /* var html = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteDailyData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入本周日报数据</button>";
        title.childNodes[0].childNodes[0].appendHTML(html);
        document.getElementById('autoCompeleteDailyData').addEventListener('click', function (ev) {
            autoCompeleteDailyData(0);
        });*/

        if(isWorkLog){
            var html2 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteNextDailyData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入下周日报数据</button>";
            title.childNodes[0].childNodes[0].appendHTML(html2);
            document.getElementById('autoCompeleteNextDailyData').addEventListener('click', function (ev) {
                autoCompeleteDailyData(1);
            });

            var html = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteDailyData' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入下周月报数据</button>";
            title.childNodes[0].childNodes[0].appendHTML(html);
            document.getElementById('autoCompeleteDailyData').addEventListener('click', function (ev) {
                autoCompeleteMonthData();
            })
        }else if (isDesign){
            setInterval(doSetDesignData, 1000);
        }else if(isDesignDetail){
            var html3 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteDesignDetail1Data' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入设计标题</button>";
            title.childNodes[0].childNodes[0].appendHTML(html3);
            document.getElementById('autoCompeleteDesignDetail1Data').addEventListener('click', function (ev) {
                doSetDesignDetailData(0,storeId);
            })
            var html4 = "<button class='aui-button aui-button-subtle rte-button-restrictions' type='button' data-tooltip='未限制' id='autoCompeleteDesignDetail2Data' data-explicit-restrictions='false' data-inherited-restrictions='false'  original-title=''><span class='aui-icon aui-icon-small aui-iconfont-edit'></span>一键填入自测标题</button>";
            title.childNodes[0].childNodes[0].appendHTML(html4);
            document.getElementById('autoCompeleteDesignDetail2Data').addEventListener('click', function (ev) {
                doSetDesignDetailData(1,storeId);
            })
        }


        

    }







})();