// ==UserScript==
// @name         依涵学习通作业助手
// @namespace    https://www.yihanstudio.com/
// @version      1.0.5
// @description  开发中,目前支持新版学习通作业和老版考试答题功能，新增老版界面自动讨论功能，第一遍答题后会请求第二个接口答题，实现答题率在95%以上;
// @author       ZhouChaoHan
// @match        *://*.chaoxing.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435926/%E4%BE%9D%E6%B6%B5%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435926/%E4%BE%9D%E6%B6%B5%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var unknowQuestionAnswerArray = []

function strSimilarity2Number(s, t) {
	var n = s.length,
		m = t.length,
		d = [];
	var i, j, s_i, t_j, cost;
	if (n == 0) return m;
	if (m == 0) return n;
	for (i = 0; i <= n; i++) {
		d[i] = [];
		d[i][0] = i;
	}
	for (j = 0; j <= m; j++) {
		d[0][j] = j;
	}
	for (i = 1; i <= n; i++) {
		s_i = s.charAt(i - 1);
		for (j = 1; j <= m; j++) {
			t_j = t.charAt(j - 1);
			if (s_i == t_j) {
				cost = 0;
			} else {
				cost = 1;
			}
			d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
		}
	}
	return d[n][m];
}

function Minimum(a, b, c) {
	return a < b ? (a < c ? a : c) : (b < c ? b : c);
}

//两字符串相似度匹配
function strSimilarity2Percent(s, t) {
	var l = s.length > t.length ? s.length : t.length;
	var d = strSimilarity2Number(s, t);
	return parseInt((1 - d / l).toFixed(4) * 100);
}

function isInArray(ary,str){
    for(let i=0;i<ary.length;i++){
        if(ary[i].trim() == str.trim()){return true;}
    }
    return false;
}

//单选题选择
function choiseAnswerOptionType1(options,answer){
    let fs = 0;
    let ary = [];
    for (let j = 0; j < options.length; j++) {
        let option = $(options[j]); //选项体
        let optionName = option.find(".answer_p").text().trim(); //选项文字
        optionName = optionName.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
        answer = answer.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"").trim();
        let lsfs = strSimilarity2Percent(optionName, answer);
        if (lsfs >= 70 && lsfs > fs) {
            fs = lsfs;
            ary.push(option);
        }
    }
    if(ary.length == 0){
        return false;
    }
    if(!ary[ary.length-1].find(".check_answer").attr("data")){
        ary[ary.length-1].click();
        return true;
    }else{
        return true;
    }
    return false;
}

//多选题选择
function choiseAnswerOptionType2(options,answers){
    let choiseNum = 0;
    let lsAnswers = answers.replace(/\s/g,"").split("#");
    if(lsAnswers.length <= 1){
        lsAnswers = answers.replace(/\s/g,"").split(/[^\u4e00-\u9fa5^\w]/g);
    }
    for(let i=0;i<options.length;i++){
        let option = $(options[i]); //选项体
        let optionName = option.find(".answer_p").text().trim(); //选项文字
        optionName = optionName.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
        for(let j=0;j<lsAnswers.length;j++){
            let answer = lsAnswers[j];//答案
            answer = answer.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"").trim();
            if(optionName == answer){
                if(!option.find(".check_answer_dx").attr("data")){
                    option.click();
                }
                choiseNum++;
            }
        }
    }
    if(choiseNum > 0){
        return true;
    }
    return false;
}

//填空题填空
function writeTextAnswerType3(textareas,answers){
    let writeNum = 0;
    let lsAnswers = answers.replace(/\s/g,"").split("#");
    if(lsAnswers.length <= 1){
        lsAnswers = answers.replace(/\s/g,"").split(/[^\u4e00-\u9fa5^\w]/g);
    }
    if(textareas.length == lsAnswers.length){
        for(let i=0;i<textareas.length;i++){
            UE.getEditor(textareas[i].name).setContent(lsAnswers[i]);
        }
        return true;
    }
    return false;
}

//判断题选择
function choiseAnswerOptionType4(options,answer){
    let zq = ["正确","是","true","True","T","对","√","ri"];
    let cw = ["错误","否","false","False","F","错","×","wr"];
    let lsAnswer = null;
    if(isInArray(zq,answer.trim())){lsAnswer = true;}
    if(isInArray(cw,answer.trim())){lsAnswer = false;}
    for (let j = 0; j < options.length; j++) {
        let lsOption = null;
        let option = $(options[j]); //选项体
        let optionName = option.find(".answer_p").text().trim(); //选项文字
        if(isInArray(zq,optionName)){lsOption = true;}
        if(isInArray(cw,optionName)){lsOption = false;}
        if(lsAnswer != null && lsOption != null && lsOption == lsAnswer){
            if(!option.find(".check_answer").attr("data")){
                option.click();
            }
            return true;
        }else{
            continue;
        }
    }
    return false;
}

function getAnswer(questionName,isFirst){
    return new Promise(res => {
        let qType = $(".Cy_TItle").next().val() || '-1';
        let courseId = location.search.match(/courseId=(\d+)/i)[1];
        let classId= location.search.match(/classId=(\d+)/i)[1];
        let knowledgeId=0
        try {
            knowledgeId= location.search.match(/knowledgeid=(\d+)/i)[1];
        } catch (err) {
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: isFirst ? "http://onlinecoursekiller.online/OnlineCourseKiller/killer" : "http://s.jiaoyu139.com:886/get?ua=cx&v=1&keyword="+questionName+"&courseid="+courseId+"&type="+qType+"&classid="+classId+"&knowledgeid="+knowledgeId,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: isFirst ? "q=" + questionName : "",
            timeout: 5000,
            onload: function(xhr) {
                if (xhr.status == 200) {
                    if(isFirst == true){
                        let answer = JSON.parse(xhr.response);
                        if (answer.success === "true") {
                            $('<tr>' +
                              '<td style="border: 1px solid;">0</td>' +
                              '<td style="border: 1px solid;">' + questionName + '</td>' +
                              '<td style="border: 1px solid;">' + answer.answer + '</td>' +
                              '</tr>').appendTo(".question-table-tbody").css('background-color','');
                        }else{
                            $('<tr>' +
                              '<td style="border: 1px solid;">0</td>' +
                              '<td style="border: 1px solid;">' + questionName + '</td>' +
                              '<td style="border: 1px solid;">' + answer.answer + '</td>' +
                              '</tr>').appendTo(".question-table-tbody").css('background-color', 'rgba(200 ,0 ,0, 0.6)');
                        }
                    }else{
                        let answer = JSON.parse(xhr.response);
                        if (answer.code == 1) {
                            $('<tr>' +
                              '<td style="border: 1px solid;">1</td>' +
                              '<td style="border: 1px solid;">' + questionName + '</td>' +
                              '<td style="border: 1px solid;">' + answer.data.answer + '</td>' +
                              '</tr>').appendTo(".question-table-tbody").css('background-color','');
                        }else{
                            $('<tr>' +
                              '<td style="border: 1px solid;">1</td>' +
                              '<td style="border: 1px solid;">' + questionName + '</td>' +
                              '<td style="border: 1px solid;">' + answer.data.answer + '</td>' +
                              '</tr>').appendTo(".question-table-tbody").css('background-color', 'rgba(200 ,0 ,0, 0.6)');
                        }
                    }
                    var divscll = document.getElementById('question-scdiv');
                    divscll.scrollTop = divscll.scrollHeight;
                }else{
                    getAnswer(questionName,isFirst);
                }
                setTimeout(() => {
                    res();
                }, 200);
            },
            ontimeout: function() {

            }
        });
    });
}

function findAnswer(isFirst,questionName, type, question) {
	return new Promise(res => {
        let qType = question.find('input[name^=answertype]:eq(0)').val() || '-1';
        let courseId = location.search.match(/courseId=(\d+)/i)[1];
        let classId= location.search.match(/classId=(\d+)/i)[1];
        let knowledgeId=0
        try {
            knowledgeId= location.search.match(/knowledgeid=(\d+)/i)[1];
        } catch (err) {
        }
		GM_xmlhttpRequest({
			method: 'POST',
			url: isFirst ? "http://onlinecoursekiller.online/OnlineCourseKiller/killer" : "http://s.jiaoyu139.com:886/get?ua=cx&v=1&keyword="+questionName+"&courseid="+courseId+"&type="+qType+"&workid="+($('#workId').val() || $('#oldWorkId').val())+"&classid="+classId+"&knowledgeid="+knowledgeId,
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			data: isFirst ? "q=" + questionName : "",
			timeout: 5000,
			onload: function(xhr) {
				if (xhr.status == 200) {
                    if(isFirst == true){
                        let answer = JSON.parse(xhr.response);
                        if (answer.success === "true") {
                            let tf = false;
                            //1.2.4获取选项组
                            if (type == 1 || type == 2 || type == 4) {
                                let answerOptions = question.find(".stem_answer .clearfix");
                                if(type == 1){
                                    tf = choiseAnswerOptionType1(answerOptions,answer.answer);
                                }else if(type == 2){
                                    tf = choiseAnswerOptionType2(answerOptions,answer.answer);
                                }else if(type == 4){
                                    tf = choiseAnswerOptionType4(answerOptions,answer.answer);
                                }
                            } else if (type == 3) {
                                //填空题
                                let textareas = question.find("textarea");
                                tf = writeTextAnswerType3(textareas,answer.answer);
                            }
                            if(tf == false){
                                $('<tr>' +
                                  '<td style="border: 1px solid;">' + questionName + '</td>' +
                                  '<td style="border: 1px solid;">' + answer.answer + '</td>' +
                                  '</tr>').appendTo(".question-table-tbody").css('background-color', 'rgba(200 ,0 ,0, 0.6)');
                                question.attr("noGetAnswer","no");
                                question.css('background-color', 'rgba(200 ,0 ,0, 0.6)');
                                unknowQuestionAnswerArray.push(question);
                            }else{
                                $('<tr>' +
                                  '<td style="border: 1px solid;">' + questionName + '</td>' +
                                  '<td style="border: 1px solid;">' + answer.answer + '</td>' +
                                  '</tr>').appendTo(".question-table-tbody").css('background-color','');
                                question.css('background-color', 'rgba(0 ,200 ,0, 0.6)');
                            }
                        }else{
                            $('<tr>' +
                              '<td style="border: 1px solid;">' + questionName + '</td>' +
                              '<td style="border: 1px solid;">' + answer.answer + '</td>' +
                              '</tr>').appendTo(".question-table-tbody").css('background-color', 'rgba(200 ,0 ,0, 0.6)');
                            //未获取到答案
                            question.attr("noGetAnswer","no");
                            question.css('background-color', 'rgba(200 ,0 ,0, 0.6)');
                            unknowQuestionAnswerArray.push(question);
                        }
                    }else{
                        let answer = JSON.parse(xhr.response);
                        if (answer.code == 1) {
                            let tf = false;
                            if (type == 1 || type == 2 || type == 4) {
                                let answerOptions = question.find(".stem_answer .clearfix");
                                if(type == 1){
                                    tf = choiseAnswerOptionType1(answerOptions,answer.data.answer);
                                }else if(type == 2){
                                    tf = choiseAnswerOptionType2(answerOptions,answer.data.answer);
                                }else if(type == 4){
                                    tf = choiseAnswerOptionType4(answerOptions,answer.data.answer);
                                }
                            } else if (type == 3) {
                                //填空题
                                let textareas = question.find("textarea");
                                tf = writeTextAnswerType3(textareas,answer.data.answer);
                            }
                            if(tf == true && question.attr("noGetAnswer") == "no"){
                                question.css('background-color', 'rgba(0 ,200 ,0, 0.6)');
                            }
                        }
                    }
                    var divscll = document.getElementById('question-scdiv');
                    divscll.scrollTop = divscll.scrollHeight;
				}else{
                    findAnswer(isFirst,questionName, type, question);
                }
				setTimeout(() => {
					res();
				}, 200);
			},
			ontimeout: function() {

			}
		});
	});
}
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
(async function() {
	'use strict';
    var taolunList = [];
    var index = 0;
	$(document).on("click", "#hideButton", function() {
		$(".question-showdiv").show();
		$(".question-div").hide();
	});
	$(document).on("click", "#showButton", function() {
		$(".question-div").show();
		$(".question-showdiv").hide();
	});
    $(".clearfix").click(function(){
        if($(this).parent().parent().attr("noGetAnswer") == "no"){
            $(this).parent().parent().css('background-color', 'rgba(0 ,0 ,0, 0)');
        }
    });
    $(document).on("click",".thisCT",function(){
        let div = $(".content1118 .oneRight");
        let go = false;
        taolunList = [];
        for(let i=0;i<div.length;i++){
            if(div.eq(i).parent().attr("id") == $(this).parent().attr("id")){
                go = true;
            }
            if(go){
                taolunList.push(div.eq(i).find(".bt a"));
            }
        }
        let val = window.open(taolunList[index].attr("href")+"&isFirstJoin=1", "讨论", "height=500, width=1500,top=200");
    });

	var url = location.pathname;
	console.log(url);
	if (url === "/mooc2/work/dowork") {
		console.log("进入作业")
		let div = $(
			'<div class="question-showdiv" style="display: none;position: fixed;top: ' + $(".subNav")
			.height() +
			'px;right: 10px;height: 100px;width: 300px;">' +
			'<div style="font-size: medium;">已隐藏</div>' +
			'<button id="showButton">取消隐藏</button>' +
			'</div>' +
			'<div class="question-div" style="position: fixed;top: ' + $(".subNav").height() +
			'px;right: 10px;height: 500px;width: 300px;z-index: 99999;background-color: rgba(190, 231, 233 ,0.9);border: 2px dashed rgb(190 ,231 ,233);">' +
			'<div style="font-size: medium;height:20px;" id="question">正在搜索答案...</div>' +
			'<button id="hideButton" style="height:20px;">隐藏显示</button>' +
            '<div style="max-height: 460px; overflow-y: auto;" id="question-scdiv">'+
			'<table border="1" style="font-size: 12px;overflow-y: auto;">' +
			'<thead>' +
			'<tr>' +
			'<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
			'<th style="min-width: 130px;">答案（点击可复制）</th>' +
			'</tr>' +
			'</thead>' +
			'<tbody class="question-table-tbody">' +
			'</tbody>' +
			'</table>' +
            '</div>'+
			'</div>'
		);
		$("body").append(div);
		//获取题目组
		var questions = $(".questionLi");
		if (questions.length === parseInt($(".infoHead span:eq(0)").text().split(':')[1])) {
			console.log("共" + questions.length + "题");
			for (let i = 0; i < questions.length; i++) {
				let question = $(questions[i]); //题目体
				let type = 0;
				if (question.attr("typename").trim() === "单选题") {
					type = 1
				} else if (question.attr("typename").trim() === "多选题") {
					type = 2
				} else if (question.attr("typename").trim() === "填空题") {
					type = 3
				} else if (question.attr("typename").trim() === "判断题") {
					type = 4
				}
				//获取题目
				let questionName = question.find(".mark_name").text(); //题目文字
				questionName = questionName.substring(questionName.indexOf(")") + 1).trim();

				//查找答案
				await findAnswer(true, questionName, type, question);
			}
            if(unknowQuestionAnswerArray.length > 0){
                //二次查找答案
                for(let i=0;i<unknowQuestionAnswerArray.length;i++){
                    let question = $(unknowQuestionAnswerArray[i]); //题目体
                    let type = 0;
                    if (question.attr("typename").trim() === "单选题") {
                        type = 1
                    } else if (question.attr("typename").trim() === "多选题") {
                        type = 2
                    } else if (question.attr("typename").trim() === "填空题") {
                        type = 3
                    } else if (question.attr("typename").trim() === "判断题") {
                        type = 4
                    }
                    //获取题目
                    let questionName = question.find(".mark_name").text(); //题目文字
                    questionName = questionName.substring(questionName.indexOf(")") + 1).trim();
                    await findAnswer(false, questionName, type, question);
                }
            }
		}
	}else if(url === "/exam/test/reVersionTestStartNew"){
        console.log("进入考试");
		let div = $(
			'<div class="question-showdiv" style="display: none;position: fixed;top: 10px;right: 10px;height: 100px;width: 300px;">' +
			'<div style="font-size: medium;">已隐藏</div>' +
			'<button id="showButton">取消隐藏</button>' +
			'</div>' +
			'<div class="question-div" style="position: fixed;top: 10px;right: 10px;height: 500px;width: 300px;z-index: 99999;background-color: rgba(190, 231, 233 ,0.9);border: 2px dashed rgb(190 ,231 ,233);">' +
			'<div style="font-size: medium;height:20px;" id="question">正在搜索答案...</div>' +
			'<button id="hideButton" style="height:20px;">隐藏显示</button>' +
            '<div style="max-height: 460px; overflow-y: auto;" id="question-scdiv">'+
			'<table border="1" style="font-size: 12px;overflow-y: auto;">' +
			'<thead>' +
			'<tr>' +
            '<th>接口</th>' +
			'<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
			'<th style="min-width: 130px;">答案（点击可复制）</th>' +
			'</tr>' +
			'</thead>' +
			'<tbody class="question-table-tbody">' +
			'</tbody>' +
			'</table>' +
            '</div>'+
			'</div>'
		);
		$("body").append(div);
        let thisQuestionName = $(".Cy_TItle div:eq(0)").text().trim().replace(/\（.*?\）/g,'').replace(/\(.*?\)/g,'').replace(/（[^）]+）/g,'');
        getAnswer(thisQuestionName,true);
        getAnswer(thisQuestionName,false);
    }else if (url === "/bbscircle/grouptopic"){
        let ct = $(".content1118");
        for(let i=0;i<ct.length;i++){
            ct.eq(i).append("<button class='thisCT'>从此处开始</button>");
        }
        //重写message事件以接受打开表单页面2返回的值
        window.onmessage = function (e) {
            var data = e.data;
            if (data != undefined && data != null) {
                console.log(data);
                if(data == "close"){
                    index += 1;
                    if(index == taolunList.length){
                        alert("讨论回答完毕!");
                        return;
                    }
                    if(!taolunList[index].attr("href")){
                        alert("讨论回答完毕!");
                        return;
                    }
                    let val = window.open(taolunList[index].attr("href")+"&isFirstJoin=1", "讨论", "height=500, width=1500,top=200");
                }
            }
        };
    }else if(url == "/bbscircle/gettopicdetail"){
        $("body").append(`
<script>
function submitTaoLun(topicId,clazzid,cpi,ut,showChooseClazzId){
    var content = $("#" + topicId).val();
    var img=$("#images_img_"+topicId).find("img");
    var str="";
    for(var i=0;i<img.size();i++){
        var imgsrc=img[i];
        if(i==img.size()){
            str=str+imgsrc.src.replace("100_100","origin");
        }else{
            str=str+imgsrc.src.replace("100_100","origin")+",";
        }
    }
    if((content==""||content=="回复话题:"||content.trim()=='')&&str==""){
        alert("请输入回复内容！");
        return false;
    }
    if(typeof(cpi) == "undefined" || cpi == ""){
    	cpi = 0;
    }
    if(typeof(ut) == "undefined" ){
    	ut = "t";
    }
    var allAttachment = getAllNoticeAttachment();
    jQuery.ajax({
        type: "post",
        url : "https://mooc1-2.chaoxing.com/bbscircle/addreply",
        dataType:'html',
        data: {
            clazzid : clazzid,
            topicId : topicId,
            content : content,
            files : str,
            cpi : cpi,
            ut : ut,
            attachmentFile:allAttachment,
			openc : getOpenc(),
			showChooseClazzId: showChooseClazzId
		},
        success: function(data){

        }
    });
}
</script>
        `);
        if(getQueryVariable("isFirstJoin") == 1){
            let replyfirstname = $($("[name=replyfirstname]")[Math.floor(Math.random()*$("[name=replyfirstname]").length)]);
            $(".oneDiv .tl1").click();
            $(".oneDiv textarea").val(replyfirstname.text());
            $("body").append(`<button id="subTL" onclick="submitTaoLun${$(".oneDiv textarea").parent().find("input[type=submit]").attr("onclick").match(/\((.+?)\)/g)[0]}"></button>`);
            $("#subTL").click();
            if (window.opener) {
                setTimeout(function(){window.opener.postMessage("close", '*');},1500);
            }
        }
    }
})();