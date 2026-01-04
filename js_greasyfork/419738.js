// ==UserScript==
// @name         test1
// @namespace    keyroesTools
// @version      0.2
// @description  个人使用
// @author       keyroes
// @compatible   Chrome
// @match        *://jxgl.wyu.edu.cn/*
// @exclude     *://jxgl.wyu.edu.cn/
// @exclude     *://jxgl.wyu.edu.cn/new/logout
// @exclude     *://jxgl.wyu.edu.cn/waf_verify.htm
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419738/test1.user.js
// @updateURL https://update.greasyfork.org/scripts/419738/test1.meta.js
// ==/UserScript==

(function () {
    'use strict';

var testJson={
    "total":5,
    "rows":[
        {
            "kcrwdm":"1085547",
            "kcdm":"101",
            "jxbdm":"111",
            "kcmc":"日常生活与社会心理学",
            "xf":"学分",
            "teaxm":"教师1",
            "kcflmc":"课程分类"
        },
        {
            "kcrwdm":"1085644",
            "kcdm":"102",
            "jxbdm":"112",
            "kcmc":"影视艺术概论",
            "xf":"学分",
            "teaxm":"教师2",
            "kcflmc":"课程分类"
        },
        {
            "kcrwdm":"1085562",
            "kcdm":"103",
            "jxbdm":"113",
            "kcmc":"中华文明简史",
            "xf":"学分",
            "teaxm":"教师3",
            "kcflmc":"课程分类"
        },
        {
            "kcrwdm":"1085561",
            "kcdm":"104",
            "jxbdm":"114",
            "kcmc":"中国古代历史8讲",
            "xf":"学分",
            "teaxm":"教师4",
            "kcflmc":"课程分类"
        },
        {
            "kcrwdm":"1085557",
            "kcdm":"105",
            "jxbdm":"115",
            "kcmc":"西方文明的源与流",
            "xf":"学分",
            "teaxm":"教师5",
            "kcflmc":"课程分类"
        }
    ]
};

var testData = testJson.rows;

    //渲染窗口
$(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px;height: 90%; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.8); overflow-x: auto;" id="keyroes">'+
	    '<span style="font-size: medium;">'+
	    '</span> '+
	    '<div style="font-size: medium;width:70%;display: inline-block;">'+
			'<input type="button" style="margin-right: 10px;" value="去选课" onclick="window.location.href=\'/xsxklist!xsmhxsxk.action\'">'+
			'<input type="button" id="refreshKey" style="margin-right: 10px;" value="刷新">'+
            '<input type="button" id="selectAll" style="margin-right: 10px;" value="全选">'+
		'</div>'+
	    '<div style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>'+
		'<div style="height: 200px;margin:0 10px;display: flex;flex-direction: column;">'+
			'<span style="font-size: 17px;margin-bottom: 5px">可选课程</span>'+
			'<div id="divCheckbox" style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >'+
			'</div>'+
		'</div>'+
		'<div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>'+
		'<div style="margin:0 10px;display: flex;flex-direction: column;">'+
			'<span style="font-size: 17px;margin-bottom: 5px">配置</span>'+
			'<div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >'+
				'<span>循环次数*：<input id="repeatNum" type="text" placeholder="1-2000" value="10"></span>'+
				'<span>延迟(ms)*：<input id="rdelay" type="text" placeholder="0-2000" value="0"></span>'+
				'<span>学期代码：<input type="text" placeholder="例：202001"></span>'+
				'<input type="button" style="margin-right: 10px;margin-top: 5px" value="去除时间冲突课程" onclick="layer.alert(\'去个der\')">'+
			'</div>'+
		'</div>'+
		'<div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>'+
		'<div style="margin:0 10px;display: flex;flex-direction: column;">'+
			'<span style="font-size: 17px;margin-bottom: 5px">开始</span>'+
			'<div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >'+
				'<input id="getClassTool" type="button" style="margin-right: 10px;margin-top: 5px" value="开始">'+
			'</div>'+
		'</div>'+
		'<div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>'+
		'<div style="height: 350px; margin:0 10px;display: flex;flex-direction: column;">'+
			'<div style="display:flex;flex-direction: row">'+
				'<span style="font-size: 17px;margin-bottom: 5px;margin-right: 10px">日志</span>'+
				'<div style="display: flex;justify-content : flex-end;margin-right: 5px">'+
					'<span style="margin-left: 5px">已选：<span id="checkNum">0</span></span>'+
					'<span style="margin-left: 5px">未选：<span id="noCheckNum">0</span></span>'+
					'<span style="margin-left: 5px">次数：<span id="ordNums">0</span></span>'+
				'</div>'+
				'<input type="button" style="margin:0;" value="清空" onclick="$(\'#postLog\').empty()">'+
			'</div>'+
			'<div id="postLog" style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >'+
            '</div>'+
		'</div>'+
	'</div>'
).appendTo('body');

//获取可选课程数据
function getCalssData() {
    $.ajax({
        type: "GET",
        url: "/xsxklist!getDataList.action",
        data: {"page":1,"rows":500,"sort":"kcrwdm","order":"asc"},
        beforeSend: function () {//开始执行时
        },
        success: function (data) {//后端传回数据时
            //验证数据
            var checkData = data.valueOf().toString();
            if (checkData.indexOf("<html>") != -1){//数据有误
                $("#divCheckbox").append(checkData);
                return;
            }
            console.log(testData.valueOf());
            //判断有无数据
            if (testJson.total == 0){
                htmlCalssData+='<span style="margin: 0 auto">暂无可选课程</span>';
            }else {
                $("#divCheckbox").empty()
                //将数据写入复选框
                var htmlCalssData='';
                for (var i = 0;i<testData.length;i++){
                    htmlCalssData+='<span><span><input id="classId'+i+'" type="checkbox" name="category" value="'+testData[i].kcrwdm+','+testData[i].kcmc+'" />'+testData[i].kcmc+'</span><span>&nbsp;&nbsp;&nbsp;&nbsp;'+testData[i].teaxm+'</span></span>';
                }
                console.log(htmlCalssData);
            }
            $("#divCheckbox").append(htmlCalssData);
        },
        complete: function (data) {//结束时
        },
        error: function (XMLHttpRequest) {
            alert("出错了")
        }
    });
}

var userRepeatNum = 0;//循环次数
var userRdelay = 0;//延迟时间（ms）
var classData = [];//要选的课程的数据
var postType = true;//是否继续抢课
var checkNum = 0;//当前抢课程数
var noCheckNum = 0;//当前在抢课程数
var ordNums = 0;//当前抢课次数
//执行抢课脚本
function getClassTool() {
    userRepeatNum = $('#repeatNum').val();//循环次数
    userRdelay = $('#rdelay').val();//延迟时间（ms）
    classData = [];
    //数据验证
    if (!($.isNumeric(userRepeatNum)&&$.isNumeric(userRdelay)) ) {//不是数字
        layer.alert("循环次数和延迟时间必须是数字");
        $("#getClassTool").val("开始");
        $('#repeatNum').val(50);
        $('#rdelay').val(50);
        return;
    }else if (!(userRepeatNum>0 && userRepeatNum<=2000 && userRdelay>=0 && userRdelay<=2000)){
        layer.alert("循环次数或延迟时间不在可选范围内");
        $("#getClassTool").val("开始");
        $('#repeatNum').val(50);
        $('#rdelay').val(50);
        return;
    }

    var oneClassData = [];
    $("input[name='category']:checked").each(function(){//遍历被选中的复选框
        var jsonOneClassData = {};
        oneClassData = $(this).val().split(",");
        jsonOneClassData.kcrwdm = oneClassData[0];
        jsonOneClassData.kcmc = oneClassData[1];
        classData.push(jsonOneClassData);//向数组中添加数据
    });

    if (classData.length<=0){
        layer.alert("请选择抢课课程");
        $("#getClassTool").val("开始");
        return;
    }
    $('#checkNum').text(0);
    $('#noCheckNum').text(classData.length);
    $('#ordNums').text(0);
    checkNum = 0;//当前抢课程数
    noCheckNum = classData.length;//当前在抢课程数
    ordNums = 0;//当前抢课次数
    postType = true;
    getOneClass();
}

var nowUserRepeatNum = 1;//当前循环次数
var nowDataNum = 0;//当前classData位置
//单次抢课
function getOneClass(){
    //console.log(nowUserRepeatNum+":"+nowDataNum);
    //判断是否结束
    if (nowUserRepeatNum>userRepeatNum || !postType || classData.length==0) {//结束
        $("#postLog").prepend('<span>抢课结束</spam>');
        $("#getClassTool").val("开始");
        nowUserRepeatNum = 1;//当前循环次数
        nowDataNum = 0;//当前classData位置
        return;
    }

    var postJsonOneClassData = {};
    window.setTimeout(function () {//设定延迟
        postJsonOneClassData = classData[nowDataNum];
        $.ajax({
            type: "GET",
            url: "/xsxklist!getAdd.action",
            data: {"kcrwdm":postJsonOneClassData.kcrwdm,"kcmc":postJsonOneClassData.kcmc},
            async: false,
            beforeSend: function () {//开始执行时
            },
            success: function (data) {//后端传回数据时
                console.log(data.valueOf().toString());
                if (data.valueOf().toString().indexOf("<html>") != -1){//数据有误
                    $("#postLog").prepend('<span>请求被拦截，请刷新页面</spam>');
                    $("#getClassTool").val("开始");
                    window.open("https://jxgl.wyu.edu.cn/waf_verify.htm");
                    postType = false;
                    return;
                //}else if ("1"==data.valueOf().toString()) {//抢课成功
                }else if (nowUserRepeatNum == 10 && nowDataNum == 0) {//抢课成功
                    $("#postLog").prepend('<span>抢课成功&nbsp;&nbsp;'+postJsonOneClassData.kcmc+'</spam>');
                    classData.splice(nowDataNum,1);
                    $('#checkNum').text(++checkNum);
                    $('#noCheckNum').text(--noCheckNum);
                }else {//抢课失败
                    $("#postLog").prepend('<span>'+data.valueOf().toString()+'&nbsp;&nbsp;'+postJsonOneClassData.kcmc+'</spam>');
                    nowDataNum = (nowDataNum+1)%classData.length;
                    nowUserRepeatNum = nowDataNum==0?nowUserRepeatNum+1:nowUserRepeatNum;
                }
                $('#ordNums').text(++ordNums);
                getOneClass();
            },
            complete: function (data) {//结束时
            },
            error: function (XMLHttpRequest) {
                console.log("nowUserRepeatNum:"+nowUserRepeatNum+",nowDataNum:"+nowDataNum);
                return;
            }
        });
    }, userRdelay); // 延时
}

//终止抢课脚本
function stopGetClass(){
    $("#postLog").prepend('<span>抢课终止</spam>');
    $("#getClassTool").val("开始");
    postType=false;
}

//绑定刷新按钮
$("#refreshKey").on("click",function(){
    getCalssData();
});

//绑定抢课按钮
$("#getClassTool").on("click",function(){
    if ("开始" == $("#getClassTool").val().toString()) {
        $("#getClassTool").val("终止");
        getClassTool();
    }else {
        $("#getClassTool").val("开始");
        stopGetClass()
    }
});

//绑定全选/全不选按钮
$("#selectAll").on("click",function(){
    if ("全选" == $("#selectAll").val().toString()) {
        $("#selectAll").val("全不选");
        $(":checkbox[name='category']").prop("checked", true);
    }else {
        $("#selectAll").val("全选");
        $(":checkbox[name='category']").prop("checked", false);
    }
});

getCalssData();

})();