// ==UserScript==
// @name         高考报考辅助2.0
// @namespace    keyroesTools
// @version      0.1
// @description  个人使用
// @author       keyroes
// @compatible   Chrome
// @license MIT
// @match        https://zyfz.eesc.com.cn*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446994/%E9%AB%98%E8%80%83%E6%8A%A5%E8%80%83%E8%BE%85%E5%8A%A920.user.js
// @updateURL https://update.greasyfork.org/scripts/446994/%E9%AB%98%E8%80%83%E6%8A%A5%E8%80%83%E8%BE%85%E5%8A%A920.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //可改数据
    var minNum = 120000;//最小排位
    var maxNum=180000;//最大排位
    var Authorization = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTgxMjEyMzM4IiwidXNlck1hcCI6eyJrc2giOiIwOTgxMjEyMzM4Iiwia3NrbG1jIjoi5pmu6YCa57G7KOWOhuWPsikiLCJ4a2JqIjoiMCIsImJ4a21tYyI6IuWOhuWPsiIsInp4a21tYzIiOiLmlL_msrsiLCJieGttZG0iOiIwMTUiLCJrc21jIjoi6Km557Sr6IqsIiwidXNlckNvZGUiOiIwOTgxMjEyMzM4IiwienhrbW1jMSI6IueUn-eJqSIsImtza2xkbSI6IjIiLCJ1c2VyVHlwZSI6IjEiLCJ6eGttZG0xIjoiMDEzIiwienhrbWRtMiI6IjAxNCJ9LCJleHAiOjE2NTYxMDE1Njd9.Uocvt9SqzZFho5rPq2RdYyJKYV6msgJv8IkbOxBMKRUyf9HNCuDCFWibzgvAQhsVZRIF2wn6U3c5rIPr0ArtSA";
    var sat = "CYugbdMrRc8WtLAHMw5lJU707szaGaGtTzPI7VjR7PdcL5Yq3+NYfIwZTq0FGmspznQjF3oYWPMPD9R47Iw92PD4sk0EIMKPLMKdQXeupFgr5gjxM99kzCv4P5QTLKIILtUn4hWt13kpV9Bp1yZ3COY++2nuSSXY04oYYFZKirTbRiCr8b1I2jjoKuv/aK6qecs0CxEI1bAIP51Bu51U825Om9t9znmugq1LGD5jY9sye+dfQhMHLRQpnQ6EBly/XAjzBellr/VqFtXN6wDu0xya7DQe/T95KAkI1q5apu9miCrKhUB6Wj9n6lxTZdOW4BNmfKGI1RY6JN6S0TFjeg==";
    var pcdm = 51;//51:专科，21:本科
    var aaa = 0;//0:历史，1:物理
    var selectedSubjectCode = "013,014";//012：化学，013：生物，014：政治，016：地理（英文逗号隔开）
    var jblxdm = "1";//"":全部，"1":公办
    var provinceCode = "440000";//"":全部，"440000":广东

    //后面不用动
    var jhlbdm = ["100","200"];
    var preferredSubjectCode = ["015","011"];
    var nowUrl = window.location.pathname;
    var div3 = '<div style="position: fixed; top:2px; right:20px; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv">'+
	    '<input type="button" value="显示" id="allBtn">'+
    '</div>'+
    '<div style="border: 2px dashed rgb(0, 85, 68); width:60%;height: 90%; position: fixed; top: 0; right: 0; z-index: 99998; background-color: rgb(70, 196, 38); overflow-x: auto;display:none" id="keyroes">'+
    	'<span style="font-size: medium;"></span> '+
    	'<div style="font-size: medium;width:70%;display: inline-block;">'+
    		'<input id="getData2" type="button" style="margin-right: 10px;" value="获取专业组数据">'+
            '<input id="getData3" type="button" style="margin-right: 10px;" value="获取专业数据">'+
            '<input type="button" style="margin-right: 10px;" value="复制数据" id="copy">'+
            '<input type="button" style="margin-right: 10px;" value="转表格" onclick="window.open(\'https://tooltt.com/json2excel\');">'+
    	'</div>'+
    	'<div style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>'+
    	'<span style="font-size: 17px;margin-bottom: 5px">1.在源码中修改参数<br>2.点击获取数据<br>3.点击复制数据会复制数据到剪切板<br>4.点击访问转表格粘贴数据转换成表格</span>'+
    '</div>';



var schoolData = new Array();//学校数据
var zyzData = new Array();//专业组数据
var zyData = new Array();//专业数据
var type = false;//是否获取专业数据
var zyzTitle={
    ssmc: "所在地*",
    yxmc: "院校名称*",
    yxzyzdm:"专业组代码*",
    tdfs:"投档分*",
    tdpw:"投档排位*",
    tdrs:"投档人数*",
    lqrs:"录取人数*",
    jblxmc: "公办民办",
    bxkmmc:"首选科目",
    kxgxmc:"其次科目",
    yxdm: "院校代码"
    };
var zyTitle={
    ssmc: "所在地*",
    yxmc: "院校名称*",
    zymc:"专业名称*",
    lqcjL:"录取最低分*",
    lqcjLRanking:"录取最低排位*",
    jhrs:"计划人数*",
    lqrs:"录取人数*",
    jblxmc: "公办民办",
    yxdm: "院校代码",
    yxzyzdm:"专业组代码",
    zydh:"专业代码",
    bxkmmc:"首选科目",
    kxgxmc:"其次科目",
    bz:"备注"
    };

//获取院校数据
function getData1() {
    var total = 101;//全部院校数量
    for(var x = 1 ; (x-1)*100 < total ; x++){
        $.ajax({
            type: "GET",
            url: "https://zyfz.eesc.com.cn/newgkrecommend/front/zytjXgkTbzn/hisYxList?pcdm="+pcdm+"&jhlbdm="+jhlbdm[aaa]+"&preferredSubjectCode="+preferredSubjectCode[aaa]+"&selectedSubjectCode="+selectedSubjectCode+"&selectedSubjectRelation=&provinceCode="+provinceCode+"&jblxdm="+jblxdm+"&zglbdm=&yx=&zy=&yxzyz=&isYjsy=&isYldx=&isYlxk=&zszldm=&yylbdm=&zylbdm=&sfxzyx=&pageIndex="+x+"&pageSize=100",
            async: false,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Authorization": Authorization,
                "sat": sat
            },
            beforeSend: function () {//开始执行时
            },
            success: function (data) {//后端传回数据时
                total = data.total;
                var datas = data.data.content;
                for ( var i = 0; i < datas.length; i++)
                {
                    delete datas[i].examYear;
                    delete datas[i].yxdh;
                    delete datas[i].ssdm;
                    delete datas[i].zgbmmc;
                    delete datas[i].pcdm;
                    delete datas[i].pcmc;
                    delete datas[i].bxkmmc;
                }
                schoolData.push.apply(schoolData,datas);
            },
            complete: function (data) {//结束时
            },
            error: function (XMLHttpRequest) {
            }
        });
    }
    console.log("学校数据：",schoolData);
}

//获取专业组数据
function getData2() {
    getData1();
    for(var x = 0 ; x < schoolData.length ; x++){
        console.log(schoolData.length+":"+x);
        $.ajax({
            type: "GET",
            url: "https://zyfz.eesc.com.cn/newgkrecommend/front/zytjXgkTbzn/hisYxzyzList?pcdm="+pcdm+"&jhlbdm="+jhlbdm[aaa]+"&preferredSubjectCode="+preferredSubjectCode[aaa]+"&selectedSubjectCode="+selectedSubjectCode+"&selectedSubjectRelation=&provinceCode="+provinceCode+"&jblxdm="+jblxdm+"&zglbdm=&yx=&zy=&yxzyz=&isYjsy=&isYldx=&isYlxk=&zszldm=&yylbdm=&zylbdm=&sfxzyx=&yxdh="+schoolData[x].yxdm,
            async: false,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Authorization": Authorization,
                "sat": sat
            },
            beforeSend: function () {//开始执行时
            },
            success: function (data) {//后端传回数据时
                var datas = data.data.content;
                //console.log(datas);
                for ( var i = 0; i < datas.length; i++)
                {
                    if(datas[i].tdpw>=minNum && datas[i].tdpw<=maxNum ){
                       //console.log(1);
                       if(type){//如果需要获取专业数据
                           delete datas[i].tdrs;
                           delete datas[i].lqrs;
                           delete datas[i].tdfs;
                           delete datas[i].tdpw;
                       }
                       if(datas[i].kxkmmc != null){
                           datas[i].kxgxmc = datas[i].kxkmmc+"("+datas[i].kxgxmc+")";
                       }
                       delete datas[i].examYear;
                       delete datas[i].pcdm;
                       delete datas[i].pcmc;
                       delete datas[i].yxdh;
                       delete datas[i].bxkmdm;
                       delete datas[i].kxkmmc;
                       delete datas[i].zygs;
                       delete datas[i].zyfx;
                       delete datas[i].jhrs;
                       delete datas[i].bz;
                       datas[i].ssmc = schoolData[x].ssmc;
                       datas[i].jblxmc = schoolData[x].jblxmc;
                    }else{
                       //console.log(2);
                       datas.splice(i--,1);
                    }
                }
                //console.log(datas);
                zyzData.push.apply(zyzData,datas);
            },
            complete: function (data) {//结束时
            },
            error: function (XMLHttpRequest) {
            }
        });
    }
    console.log("专业组数据：",zyzData);
    if(type){//如果需要获取专业数据
        getData3();
    }
}

//获取专业数据
function getData3() {
    for(var x = 0 ; x < zyzData.length ; x++){
        console.log(zyzData.length+":"+x);
        $.ajax({
            type: "GET",
            url: "https://zyfz.eesc.com.cn/newgkrecommend/front/zytjXgkTbzn/hisYxzyList?pcdm="+pcdm+"&jhlbdm="+jhlbdm[aaa]+"&preferredSubjectCode="+preferredSubjectCode[aaa]+"&selectedSubjectCode="+selectedSubjectCode+"&selectedSubjectRelation=&provinceCode="+provinceCode+"&jblxdm="+jblxdm+"&zglbdm=&yx=&zy=&yxzyz=&isYjsy=&isYldx=&isYlxk=&zszldm=&yylbdm=&zylbdm=&sfxzyx=&yxdh="+zyzData[x].yxdm+"&yxzyzdm="+zyzData[x].yxzyzdm,
            async: false,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Authorization": Authorization,
                "sat": sat
            },
            beforeSend: function () {//开始执行时
            },
            success: function (data) {//后端传回数据时
                var datas = data.data.content;
                //console.log(datas);
                for ( var i = 0; i < datas.length; i++)
                {
                    if(datas[i].lqcjLRanking>=minNum && datas[i].lqcjLRanking<=maxNum ){
                       //console.log(1);
                       delete datas[i].yxdh;
                       //delete datas[i].yxdm;
                       //delete datas[i].yxmc;
                       delete datas[i].examYear;
                       delete datas[i].kldm;
                       delete datas[i].klmc;
                       delete datas[i].pcdm;
                       delete datas[i].pcmc;
                       //delete datas[i].zydh;
                       delete datas[i].zydm;
                       //delete datas[i].zymc;
                       delete datas[i].zyfx;
                       delete datas[i].lqpjf;
                       //delete datas[i].lqcjL;
                       //delete datas[i].lqcjLRanking;
                       //delete datas[i].lqrs;
                       //delete datas[i].jhrs;
                       delete datas[i].zstzmc;
                       //delete datas[i].bz;
                       datas[i].ssmc = zyzData[x].ssmc;
                       datas[i].jblxmc = zyzData[x].jblxmc;
                       datas[i].yxzyzdm = zyzData[x].yxzyzdm;
                       datas[i].bxkmmc = zyzData[x].bxkmmc;
                       datas[i].kxgxmc = zyzData[x].kxgxmc;
                    }else{
                       //console.log(2);
                       datas.splice(i--,1);
                    }
                }
                //console.log(datas);
                zyData.push.apply(zyData,datas);
            },
            complete: function (data) {//结束时
            },
            error: function (XMLHttpRequest) {
            }
        });
    }
    console.log("专业数据：",zyData);
}


    //渲染窗口
    $(div3).appendTo('body');

    //绑定获取数据按钮
    $("#getData2").on("click", function () {
        schoolData = new Array();
        zyzData = new Array();
        zyData = new Array();
        zyzData.push(zyzTitle);
        type = false;
        getData2();
    });
    $("#getData3").on("click", function () {
        schoolData = new Array();
        zyzData = new Array();
        zyData = new Array();
        zyData.push(zyTitle);
        type = true;
        getData2();
    });

    //绑定复制按钮
    $("#copy").on("click", function () {
        if(type){//如果需要获取专业数据
            copyText(JSON.stringify(zyData));
        }else{
            copyText(JSON.stringify(zyzData));
        }
    });


    //绑定隐藏/显示按钮
    $("#allBtn").on("click", function () {
        if ("隐藏" == $("#allBtn").val().toString()) {
            $("#allBtn").val("显示");
            $("#allBtn").css("background-color", "rgba(70, 196, 38, 0.8)");
            $("#keyroes").css("display", "none");
        } else {
            $("#allBtn").val("隐藏");
            $("#allBtn").css("background-color", "snow");
            $("#keyroes").css("display", "block");
        }
    });

    //复制
    function copyText(val){ // text: 要复制的内容
        console.log("1");
        var temp = document.createElement('textarea');
        temp.value = val;
        document.body.appendChild(temp);
        temp.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        temp.style.display='none';
        return;
    }
})();