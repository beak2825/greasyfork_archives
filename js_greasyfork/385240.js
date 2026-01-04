// ==UserScript==
// @name         评教脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于信息门户评教
// @author       自由
// @match        *://ssfw.scuec.edu.cn/ssfw/jxpg/xscx/pg.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385240/%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/385240/%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    function lilun(){
        //预设分数
var default_scores=10

//随机产生评价的内容
function getrandomText(){
	var innerTxt =[
	'老师讲课很认真，一学期受益匪浅',
	'老师上课生动形象，很注重师生之间的互动',
	'老师上课上课认真负责，对学生要求严格',
	'上课生动有趣，很能引起学生的共鸣',
	'学生很容易接受老师传授的知识',
	'注重实践性，诱导学生发散性思维',
	'热爱学生，尊重学生，关心学生。平等公正对待学生。',
	'严谨治学，潜心钻研。不断改进教育教学方法，并注重将科研成果应用到教学中。',
	'以身作则，为人师表。模范遵守社会公德，严于律己，生活作风严谨正派；仪表端庄大方，语言规范健康，举止文明礼貌，衣着整洁得体；美其言，慎其行。',
	'教书育人，诲人不倦。寓德育于智育中，以良好的思想政治素质引领学生。注意与学生交流思想，关心学生成长',
	'爱岗敬业，尽职尽责。按教学计划要求认真备课上课，认真批改作业，指导学生毕业论文、毕业设计、课程认真负责，教学工作量达到学校规定的要求；上课认真负责，执行考勤制度，不迟到、不早退，课堂纪律严格，认真解答学生提出的问题。'
	];
	return innerTxt[Math.floor(Math.random()*innerTxt.length)];
}
//分数
var scoresTextBox=document.querySelectorAll('.lx10')
for (var i = scoresTextBox.length - 1; i >= 0; i--) {
	scoresTextBox[i].value=default_scores;
};

//评价
var evalTextBox=document.querySelectorAll('.lx3')
for (i = evalTextBox.length - 1; i >= 0; i--) {
	evalTextBox[i].value=getrandomText();
};

//获取“下一题”按钮
function getjumpNextButton(){
	var defaultButton=document.querySelector('#nextlink[style="cursor: pointer;"]')
	var fuckingButton=document.querySelector('#nextlink[style="cursor: pointer; color: rgb(0, 136, 204);"]')
	return defaultButton?defaultButton:(fuckingButton?fuckingButton:false)
}

//跳转任务安排
function jumpNext() {
	if(getjumpNextButton()){
		setTimeout(function() {
			getjumpNextButton().click()
			setTimeout(function(){
				jumpNext()
			}, 50);
		}, 0);
	}else{
		setTimeout(function() {
			document.querySelector('a.saveButton').click()
		}, 0)
	}
}

setTimeout(jumpNext(), 0);
    }

    function shide(){
        //预设评分
//-------------
//1 - 优秀
//2 - 良好
//3 - 合格
//4 - 不合格
var default_scores=1

//随机产生评价的内容
function getrandomText(){
	var innerTxt =[
	'老师讲课很认真，一学期受益匪浅',
	'老师上课生动形象，很注重师生之间的互动',
	'老师上课上课认真负责，对学生要求严格',
	'上课生动有趣，很能引起学生的共鸣',
	'学生很容易接受老师传授的知识',
	'注重实践性，诱导学生发散性思维',
	'热爱学生，尊重学生，关心学生。平等公正对待学生。',
	'严谨治学，潜心钻研。不断改进教育教学方法，并注重将科研成果应用到教学中。',
	'以身作则，为人师表。模范遵守社会公德，严于律己，生活作风严谨正派；仪表端庄大方，语言规范健康，举止文明礼貌，衣着整洁得体；美其言，慎其行。',
	'教书育人，诲人不倦。寓德育于智育中，以良好的思想政治素质引领学生。注意与学生交流思想，关心学生成长',
	'爱岗敬业，尽职尽责。按教学计划要求认真备课上课，认真批改作业，指导学生毕业论文、毕业设计、课程认真负责，教学工作量达到学校规定的要求；上课认真负责，执行考勤制度，不迟到、不早退，课堂纪律严格，认真解答学生提出的问题。'
	];
	return innerTxt[Math.floor(Math.random()*innerTxt.length)];
}
//评分
var scoresRadio=document.querySelectorAll('.lx1>[value="1"]')
for (var i = scoresRadio.length - 1; i >= 0; i--) {
	scoresRadio[i].click()
};

//评价
var evalTextBox=document.querySelectorAll('.lx3')
for (i = evalTextBox.length - 1; i >= 0; i--) {
	evalTextBox[i].value=getrandomText();
};

//获取“下一题”按钮
function getjumpNextButton(){
	var defaultButton=document.querySelector('#nextlink[style="cursor: pointer;"]')
	var fuckingButton=document.querySelector('#nextlink[style="cursor: pointer; color: rgb(0, 136, 204);"]')
	return defaultButton?defaultButton:(fuckingButton?fuckingButton:false)
}

//跳转任务安排
function jumpNext() {
	if(getjumpNextButton()){
		setTimeout(function() {
			getjumpNextButton().click()
			setTimeout(function(){
				jumpNext()
			}, 50);
		}, 0);
	}else{
		setTimeout(function() {
			document.querySelector('a.saveButton').click()
		}, 0)
	}
}

setTimeout(jumpNext(), 0);
    }


    function yiti(){
        //预设评分
//-------------
//1 - 优秀
//2 - 良好
//3 - 合格
//4 - 不合格
var default_scores=1

//随机产生评价的内容
function getrandomText(){
	var innerTxt =[
	'老师讲课很认真，一学期受益匪浅',
	'老师上课生动形象，很注重师生之间的互动',
	'老师上课上课认真负责，对学生要求严格',
	'上课生动有趣，很能引起学生的共鸣',
	'学生很容易接受老师传授的知识',
	'注重实践性，诱导学生发散性思维',
	'热爱学生，尊重学生，关心学生。平等公正对待学生。',
	'严谨治学，潜心钻研。不断改进教育教学方法，并注重将科研成果应用到教学中。',
	'以身作则，为人师表。模范遵守社会公德，严于律己，生活作风严谨正派；仪表端庄大方，语言规范健康，举止文明礼貌，衣着整洁得体；美其言，慎其行。',
	'教书育人，诲人不倦。寓德育于智育中，以良好的思想政治素质引领学生。注意与学生交流思想，关心学生成长',
	'爱岗敬业，尽职尽责。按教学计划要求认真备课上课，认真批改作业，指导学生毕业论文、毕业设计、课程认真负责，教学工作量达到学校规定的要求；上课认真负责，执行考勤制度，不迟到、不早退，课堂纪律严格，认真解答学生提出的问题。'
	];
	return innerTxt[Math.floor(Math.random()*innerTxt.length)];
}
//评分
var scoresRadio=document.querySelectorAll('.lx10')
for (var i = scoresRadio.length - 1; i >= 0; i--) {
	scoresRadio[i].value = 10;
};

//评价
var evalTextBox=document.querySelectorAll('.lx3')
for (i = evalTextBox.length - 1; i >= 0; i--) {
	evalTextBox[i].value=getrandomText();
};

//获取“下一题”按钮
function getjumpNextButton(){
	var defaultButton=document.querySelector('#nextlink[style="cursor: pointer;"]')
	var fuckingButton=document.querySelector('#nextlink[style="cursor: pointer; color: rgb(0, 136, 204);"]')
	return defaultButton?defaultButton:(fuckingButton?fuckingButton:false)
}

//跳转任务安排
function jumpNext() {
	if(getjumpNextButton()){
		setTimeout(function() {
			getjumpNextButton().click()
			setTimeout(function(){
				jumpNext()
			}, 50);
		}, 0);
	}else{
		setTimeout(function() {
			document.querySelector('a.saveButton').click()
		}, 0)
	}
}

setTimeout(jumpNext(), 0);
    }

    $(document).ready(function(){
        lilun();
        shide();
        yiti();
    });
})();