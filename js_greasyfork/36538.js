// ==UserScript==
// @name         ZHJW_FAST_COMMENT
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  SCU教务系统快速评教插件（非一键评教）| 帮助你快速填写评价，免去繁琐的选项与文字输入 | 请不要使用“兼容模式”
// @author       Julydate
// @match        http://202.115.47.141/student/teachingEvaluation
// @match        http://zhjw.scu.edu.cn/student/teachingEvaluation
// @match        http://202.115.47.141/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36538/ZHJW_FAST_COMMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/36538/ZHJW_FAST_COMMENT.meta.js
// ==/UserScript==

(function() {
        //检测框架是否加载完成并注入脚本
        document.onreadystatechange = onFrameLoad;
        function onFrameLoad(){
            if(document.readyState == "complete"){
                showBox();
				insertScript();
            }
        }
		//注入评教框
        function showBox() {
            if (document.getElementById("sp-pj-container") === null) {
                var setBox = document.getElementById("breadcrumbs");
                var Container = document.createElement('div');
                Container.id = "sp-pj-container";
                Container.style = "top: 44px;right: 30px;position: fixed !important;z-index: 9999999;";
                Container.innerHTML =
                    "<div id='sp-py-content' style='display: block;'> \n" +
                    "	<button class='btn btn-info btn-round' value='1级' onclick='checkList(1);' style='height: 30px;line-height: 10px;'>1级</button> \n" +
                    "	<button class='btn btn-info btn-round' value='2级' onclick='checkList(2);' style='height: 30px;line-height: 10px;'>2级</button> \n" +
                    "	<button class='btn btn-info btn-round' value='3级' onclick='checkList(3);' style='height: 30px;line-height: 10px;'>3级</button> \n" +
                    "	<button class='btn btn-info btn-round' value='4级' onclick='checkList(4);' style='height: 30px;line-height: 10px;'>4级</button> \n" +
                    "	<button class='btn btn-info btn-round' value='5级' onclick='checkList(5);' style='height: 30px;line-height: 10px;'>5级</button> \n" +
                    "	<button class='btn btn-info btn-round' value='随机生成评价' onclick='writeComment();' style='height: 30px;line-height: 10px;'>随机生成评价</button> \n" +
					" 	<button class='btn btn-danger btn-round' value='提交' onclick='toEvaluation();' style='height: 30px;line-height: 10px;'>提交</button> \n" +
					" 	<button class='btn btn-info btn-round' value='BUG反馈' onclick='window.open(\"https://github.com/smarterq/ZHJW_FAST_COMMENT/issues/new\",\"_blank\");' style='height: 30px;line-height: 10px;'>BUG反馈</button> \n" +
                    "</div> \n";
                setBox.appendChild(Container);
            }
        }
		//注入脚本
		function insertScript() {
            var jsBox = document.getElementById("breadcrumbs");
			var Scriptbox = document.createElement('script');
			Scriptbox.text =
					"//修改提交参数 \n" +
					"var flag = true; \n" +
					"//填写问卷内容 \n" +
					"function checkList(num) { \n" +
					"	var num \n" +
					"	if(num == '1'){var numValue = '10_1';var stuValue = '0';} \n" +
					"	if(num == '2'){var numValue = '10_0.8';var stuValue = '0';} \n" +
					"	if(num == '3'){var numValue = '10_0.6';var stuValue = '0';} \n" +
					"	if(num == '4'){var numValue = '10_0.4';var stuValue = '10_0.3';} \n" +
					"	if(num == '5'){var numValue = '10_0.2';var stuValue = '10_0';} \n" +
					"	var allInputs = document.getElementsByTagName('input'); \n" +
					"	for(var x = 0 ; x < allInputs.length ; x++){ \n" +
					"		if(allInputs[x].value == numValue) \n" +
					"			allInputs[x].checked = true; \n" +
					"		if(allInputs[x].value == stuValue) \n" +
					"			allInputs[x].checked = true; \n" +
					"	} \n" +
					"} \n" +
					"//填写主观评价 \n" +
					"function writeComment() { \n" +
					"	var comments = [ \n" +
					"		'热爱教学，用心经营教学，对所授课程有明确的目标，在教学活动中，充满爱心，言传身教，立德树人，传递正能量。', \n" +
					" 		'教学很好地激发了我的学习兴趣并调动了我的学习积极性，我在该课程学习中付出了最大努力。', \n" +
					"		'为我提供的学习资源以及引导我们自主寻找的学习资源，对我的学习帮助很大。', \n" +
					"		'精心设计课程的成绩评定办法和过程考核环节，激励我在整个学期中都努力学习。', \n" +
					"		'作业和考试后，针对我的学习情况给予了及时且有价值的反馈，这些反馈可以很好的帮助我了解如何改进学习。', \n" +
					"		'该门课程的总体授课效果令我很满意。', \n" +
					"		'对我的学习很有帮助', \n" +
					"		'非常认真负责而且善于沟通', \n" +
					"		'激发了我的学习兴趣并且能够清晰地解答我的疑问' \n" +
					"	] \n" +
					"	var commentText = comments[Math.floor(Math.random()*comments.length)]; \n" +
					"	var comment = document.getElementsByName('zgpj'); \n" +
					"	comment[0].value = commentText; \n" +
					"} \n";
					jsBox.appendChild(Scriptbox);
		}
})();