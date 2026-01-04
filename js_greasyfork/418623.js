// ==UserScript==
// @name         超星学习通超能小助手
// @namespace    RouterCheng
// @version      1.1.1
// @description  查看考试成绩，新版作业提取为Word
// @author       Router_Cheng
// @connect      cdn.jsdelivr.net
// @connect      mooc.xxcheng.top
// @resource     buildcss https://mooc.xxcheng.top/export/user.css
// @resource     getInfo https://mooc.xxcheng.top/export/setting.json
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418623/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B6%85%E8%83%BD%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418623/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B6%85%E8%83%BD%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * since 2020/12/08
 */
//用户配置
let config = {

};

//系统配置，不要改这个，改上面的
let helper = {
	url: window.location.pathname,
	setting:JSON.parse(GM_getResourceText('getInfo')),
	version:"1.1.1",
	pagesTools: {
		"/mooc2/work/view": {
			showTiMiList: true
		},
		"/exam/test/reVersionPaperMarkContentNew":{
			showTiMiList: true
		},
		"/exam-stastics/stu-index":{
			showScoreList:true
		},
		"/mooc2/exam/list":{
			examDetailCheck:true
		}
	},
	allowQuestionType: [
		"单选题",
		"多选题",
		"填空题",
		"判断题",
		"简答题"//,
		// "名词解释",
		// "论述题",
		// "计算题",
		// "分录题",
		// "资料题",
		// "连线题",
		// "排序题",
		// "完型填空",
		// "阅读理解",
		// "程序题",
		// "口语题",
		// "听力题",
		// "共用选项题",
		// "其它"
	]
};
window.superStarHelperState = true;
let buildcss=GM_getResourceText('buildcss');
window.onload = function() {
	if ( !helper["setting"]["isAllowUsed"] || helper["pagesTools"][helper.url] == undefined) {
		//console.log("helper is not working");
		return;
	}
	//展示题目和答案
	if (helper["pagesTools"][helper.url]["showTiMiList"]) {
		let currentPageAllTiMuListCode = getTiMuList();
		let currentPageAllTiMuList=[];
		for( let ti of currentPageAllTiMuListCode ){
			switch( ti["type"] ){
				case "单选题":
					currentPageAllTiMuList.push(parseNewQuestionChoice(ti));
					break;
				case "多选题":
					currentPageAllTiMuList.push(parseNewQuestionChoice(ti));
					break;
				case "填空题":
					currentPageAllTiMuList.push(parseNewQuestionGapFilling(ti));
					break;
				case "判断题":
					currentPageAllTiMuList.push(parseNewQuestionYesNo(ti));
					break;
				case "简答题":
					currentPageAllTiMuList.push(parseNewQuestionCommon(ti));
					break;
			}
		}
		console.log(currentPageAllTiMuList);
		helper["currentPageAllTiMuList"]=currentPageAllTiMuList;
		let exportTiMu=[];
		for( let i of  currentPageAllTiMuList){
			exportTiMu.push(i["export"]);
		}
		helper["exportTiMu"]=exportTiMu;
		if( currentPageAllTiMuList.length>0 ){
			let tbody=createElementUI();
			createButton();
			for( let e of helper["currentPageAllTiMuList"] ){
				appendTiMu(tbody,e);
			}
			document.querySelector("#download_word").style.display="block";
			document.querySelector("#download_word").onclick=function (){
				bgFont();
				loadDownWord(helper["exportTiMu"]);
			}
			document.querySelector("#helperNoticeBoard").innerHTML=helper["setting"]["helperNoticeBoard"];
		}
	}
	//展示分数功能
	if( helper["pagesTools"][helper.url]["showScoreList"] ){
		showStuScore();
	}
	if( helper["pagesTools"][helper.url]["examDetailCheck"] ){
		redirectToExamDetail();
	}
};
/**
 * @param {question List Code} code
 * 把所有题目获取到一个数组，包括一个题型
 */
function getTiMuList() {
	let tiMuList = null;
	switch (helper["url"]) {
		case "/mooc2/work/view":
			//新版学习通作业
			tiMuList = findNewItem();
			break;
		case "/exam/test/reVersionPaperMarkContentNew":
			tiMuList = findNewItem();
			break;
	}
	return tiMuList;
}

/**
 * @param {Object} code
 * 新页面作业
 */
function findNewItem() {
	let all = document.querySelectorAll(".mark_item");
	let tiMuList = [];
	let type = null;
	for (let childAll of all) {
		for (let questionLi of childAll.children) {
			if (questionLi.tagName == "H2") {
				type = questionLi.innerText.match(/\.([^（]*)/)[1].trim();
				if (!helper["allowQuestionType"].includes(type)) {
					break;
				}
			} else {
				let tmp = questionLi;
				tmp["type"] = type;
				tiMuList.push(tmp);
			}
		}
	}
	return tiMuList;
}

/**
 * 开始解析题目啦
 */

//初始化新题
function initNewQuestion(code){
	code.querySelector("h3").querySelector(".colorShallow").remove();
	return {
		element:code,
		export:{},
		type:code["type"],
		titleHTML:code.querySelector(".mark_name").innerHTML.match(/\d+\.(.*)/)[1].trim()
	}
}

//新选择题的解析
function parseNewQuestionChoice(code){
	let ti=initNewQuestion(code);
	ti["answerHTMLAll"]=code.querySelector(".mark_letter");
	ti["key"]=code.querySelector(".mark_answer").querySelector(".mark_key").innerText.match(/正确答案:\s?([A-Z]*)/);
	ti["key"]=ti["key"]?ti["key"][1]:code.querySelector(".mark_answer").querySelector(".mark_key").innerText.match(/我的答案:\s?([A-Z]*)/)[1];
	ti["keyArr"]=ti["key"].split("");
	ti["answerHTML"]=[];
	ti["export"]["answer"]=[];
	for( let ans of ti["answerHTMLAll"].children ){
		let option=ans.innerHTML.match(/[^\.]*/)[0].trim()
		let pre=ans.innerHTML.match(/[^\.]*\.(.*)/)[1].trim();
		ti["answerHTML"].push(pre);
		ti["export"]["answer"].push({
			name:option,
			content:pre,
			isanswer:ti["keyArr"].includes(option)
		});
	}
	ti["export"]["content"]=ti["titleHTML"];
	ti["export"]["name"]=ti["keyArr"].length==1?"单选题":"多选题";
	ti["export"]["type"]=ti["keyArr"].length==1?0:1;
	ti["export"]["id"]=0;
	return ti;
}

//新填空题的解析
function parseNewQuestionGapFilling(code){
	let ti=initNewQuestion(code);ti["answerHTMLAll"]=code.querySelector(".mark_answer").children[0];
	ti["answerCountElements"]=ti["answerHTMLAll"].querySelectorAll("dt");
	if( ti["answerCountElements"].length==2 ){
		let allTrueAnswer=ti["answerHTMLAll"].querySelectorAll("dl")[1].querySelectorAll("dd");
		ti["keyArr"]=[];
		ti["export"]["answer"]=[];
		for( let answerItem of allTrueAnswer){
			let key=answerItem.innerHTML.match(/\([\d]+\)(.*)/)[1].trim();
			ti["keyArr"].push(key);
			ti["export"]["answer"].push({
				content:key,
				name:ti["export"]["answer"].length+1
			});
		}
	}{
		//没有提供正确答案的到时候在搞
	}
	ti["export"]["content"]=ti["titleHTML"];
	ti["export"]["analysis"]="无";
	ti["export"]["name"]="填空题";
	ti["export"]["type"]=2;
	ti["export"]["id"]=0;
	return ti;
}

//新判断的解析
function parseNewQuestionYesNo(code){
	let ti=initNewQuestion(code);
	ti["answerHTMLAll"]=code.querySelector(".mark_answer").children[0];
	ti["answerCountElements"]=ti["answerHTMLAll"].querySelectorAll("span");
	ti["key"]=ti["answerCountElements"][(ti["answerCountElements"].length==2?1:0)].innerHTML.match(/对/)?true:false;
	ti["keyArr"]=[];
	ti["export"]["answer"]=[];
	ti["keyArr"].push(ti["key"]?"√":"×");
	ti["export"]["answer"].push({
		answer:ti["key"]
	});
	ti["export"]["content"]=ti["titleHTML"];
	ti["export"]["analysis"]="无";
	ti["export"]["name"]="判断题";
	ti["export"]["type"]=3;
	ti["export"]["id"]=0;
	return ti;
}
function parseNewQuestionCommon(code){
	let ti=initNewQuestion(code);
	ti["answerHTMLAll"]=code.querySelector(".mark_answer").children[0];
	ti["answerCountElements"]=ti["answerHTMLAll"].querySelectorAll("dt");
	if( ti["answerCountElements"].length==2 ){
		let allTrueAnswer=ti["answerHTMLAll"].querySelectorAll("dl")[1].querySelectorAll("dd");
		ti["keyArr"]=[];
		ti["export"]["answer"]=[];
		ti["key"]=allTrueAnswer[0].innerHTML;
		ti["keyArr"].push(ti["key"]);
		ti["export"]["answer"].push({
			answer:ti["key"]
		});
	}{
		//没有提供正确答案的到时候在搞
	}
	ti["export"]["content"]=ti["titleHTML"];
	ti["export"]["analysis"]="无";
	ti["export"]["name"]="简答题";
	ti["export"]["type"]=4;
	ti["export"]["id"]=0;
	return ti;
}
function createElementUI(){
	let showDiv=document.createElement("div");
		showDiv.innerHTML='<div id="createDiv" style="z-index:9999">'+
		'    <div class="divShow">'+
		'        <table border="1" class="tableShow" cellpadding="0" cellspacing="0">'+
		'            <thead>'+
		'            <tr>'+
		'                <th style="width: 25px; min-width: 25px;">题号</th>'+
		'                <th style="width: 60%; min-width: 130px;">题目</th>'+
		'                <th style="min-width: 130px;">答案</th>'+
		'                <th style="min-width: 50px;">题型</th>'+
		'            </tr>'+
		'            <tr>'+
		'                <td colspan="4" id="helper_notic">'+
		'                </td>'+
		'            </tr>'+
		'            </thead>'+
		'            <tbody id="showTable">'+
		'            <tr>'+
		'            <tr>'+
		'                <td colspan="4" id="helperNoticeBoard">'+
		'                </td>'+
		'            </tr>'+
		'                <td colspan="4">'+
		'                    <button id="download_word" style="float:left;display:none;">点击下载Word文档</button>'+
		'                </td>'+
		'            </tr>'+
		'            </tbody>'+
		'        </table>'+
		'    </div>'+
		'</div>';
		document.body.appendChild(showDiv);
		GM_addStyle(buildcss);
		let t=document.getElementById("showTable");
		t["tid"]=1;
		return t;
}
function createButton(){
		let createDiv=document.getElementById("createDiv");
		let newButton=document.createElement("button");
		newButton.id="midbtn";
		newButton.style.right="-114px";
		newButton.style.top=document.documentElement.clientHeight/2-newButton.style.height/2+"px";
		newButton.innerText="隐藏题目列表";
		newButton.state=true;
		newButton.onclick=function () {
			if(newButton.state){
				newButton.innerText="显示题目列表";
				createDiv.style.display="none";
				newButton.state=false;
			}else{
				newButton.innerText="隐藏题目列表";
				createDiv.style.display="block";
				newButton.state=true;
			}
		}
		document.body.appendChild(newButton);
		newButton.onmouseover=function () {
			moveTo(2,5);
		}
		newButton.onmouseleave=function () {
			moveTo(-114,-5);
		}
		
		let movetoTime;
		function moveTo(end,speed){
			clearInterval(movetoTime);
			movetoTime=setInterval(function () {
				newButton.style.right=parseInt(newButton.style.right)+speed+"px";
				if(( speed<0 && parseInt(newButton.style.right)+speed<=end ) || ( speed>0 && parseInt(newButton.style.right)+speed>=end ) ){newButton.style.right=end+"px";clearInterval(movetoTime);}
			},15);
		}
}
//把文件塞到列表
function appendTiMu(t,e){
	let options="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let tr=document.createElement("tr");
	tr.style.cursor="pointer";
	let answerText="";
	if( e["type"]=="单选题" || e["type"]=="多选题" ){
		for( let key of e["keyArr"] ){
			answerText+=e["answerHTML"][options.indexOf(key)];
		}
	}else if( e["type"]=="填空题" ){
		for( let answer of e["keyArr"] ){
			answerText+=",<br/>"+answer;
		}
		answerText=answerText.substr(1,answerText.length);
	}else if( e["type"]=="判断题" ){
		answerText=e["key"]?"√":"×";
	}else if( e["type"]=="简答题" ){
		answerText=e["key"];
	}
	let td="<td data="+e["element"].getAttribute("data")+">"+(t["tid"]++)+"</td><td>"+e.titleHTML+"</td><td>"+answerText+"</td><td>"+e.type+"</td>";
	tr.onclick=()=>{
		document.querySelector("#answerSheet"+e["element"].getAttribute("data")).click();
	}
	let currentStyle=document.querySelector("#question"+e["element"].getAttribute("data")).style;
	tr.onmouseenter=()=>{
		currentStyle.backgroundColor="#E6F0FF";
		currentStyle.borderRadius="10px";
		currentStyle.boxSizing="border-box";
	}
	tr.onmouseleave=()=>{
		currentStyle.backgroundColor="";
		currentStyle.borderRadius="";
		currentStyle.boxSizing="";
	}
	tr.innerHTML=td;
	t.appendChild(tr);
}
//下载word文档
function loadDownWord(qjson){
	 GM_xmlhttpRequest({
		method: "POST",
		url: "https://mooc.xxcheng.top/export/api/toWord.php",
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		},
		data:"qjson="+encodeURIComponent(JSON.stringify(qjson)),
		onload: function (xhr) {
			if (xhr.status == 200) {
				let data=JSON.parse(xhr.responseText);
				if( data["status"] ){
					window.open(data["url"]);
				}else{
					alert(data["msg"]);
				}
			}else{
				alert("下载失败！");
			}
			bgFont(true);
		},
		ontimeout: function () {
			alert("服务器异常");
			bgFont(true);
		}
	});
}

function showStuScore(){
	helper.currentPage=1;
	document.querySelector("#studentWorkPage").onclick=(e)=>{
		if( e["target"].tagName="LI" ){
			let element=e["target"];
			if( element.classList.contains("xl-prevPage") ){
				updataStuScore(--helper.currentPage);
			}else if( element.classList.contains("xl-nextPage") ){
				updataStuScore(++helper.currentPage);
			}else if( element.classList=="" ){
				helper.currentPage=element.innerText;
				updataStuScore(helper.currentPage);
			}
		}
	}
	updataStuScore(helper.currentPage);
}
function updataStuScore(currentPage){
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://stat2-ans.chaoxing.com/exam-stastics/stu-exams?clazzid="+clazzId+"&courseid="+courseId+"&cpi="+cpi +"&ut=s&page="+currentPage+"&pageSize="+pageSize+"&personId="+personId,
		headers: {
			"Content-type": "application/json"
		},
		data:"",
		onload: function (xhr) {
			document.querySelector("#studentWorkTable").innerHTML="";
			let content = "";
			let result=JSON.parse(xhr.responseText);
			let dataArray = result.data;
			let page = result.page;
			for (let i = 0; i < dataArray.length; i++) {
				let obj = dataArray[i];
				let status = obj.status;
				let statusDesc = "<td>未查看</td>";
				let viewDetail = "<td><a href=\"#\">查看</a></td>";
				if(status < 3){
					viewDetail = "<td class=\"disableTd\"><a href=\"#\">查看</a></td>";
				}
				if (4 == status){
					statusDesc = "<td>待批阅</td>";
				}
				if (3 == status){
					statusDesc = "<td>已完成<span class=\"grey\">分数: "+obj.stuOriginScore+"分</span></td>";
				}
				if(5 == status){
					statusDesc = "<td class=\"color-red\">待重做</td>";
				}
				content += '<tr>'
						+ '<td class="tr-title overHidden1">' + obj.title + '</td>'
						+ '<td>' + obj.startTime + '</td>'
						+ '<td>' + obj.endTime + '</td>'
						+ '<td>' + obj.totalScore + '分</td>'
						+ '<td>' + obj.markPerson + '</td>'
						+ statusDesc;
				document.querySelector("#studentWorkTable").innerHTML+=content;
				content="";
			}
		},
		ontimeout: function () {
			alert("服务器异常");
		}
	});
}

function bgFont(isClose=false){
	if( isClose ){
		document.querySelector("#FontElement").remove();
		helper.bgFontElement=false;
		return;
	}
	helper.bgFontElement=document.createElement("div");
	helper.bgFontElement.id="FontElement";
	helper.bgFontElement.style.height=document.documentElement.clientHeight+"px";
	helper.bgFontElement.style.width=document.documentElement.clientWidth+"px";
	helper.bgFontElement.style.backgroundColor="rgba(232,232,232,0.5)";
	helper.bgFontElement.style.position="fixed";
	helper.bgFontElement.style.top=0;
	helper.bgFontElement.style.left=0;
	helper.bgFontElement.style.zIndex=99999;
	let cicleHeight=(document.documentElement.clientHeight-50)/2+"px";
	helper.bgFontElement.innerHTML=`<div class="circle-side" style="width:50px;height:50px;margin:${cicleHeight} auto;"></div>`;
	document.body.appendChild(helper.bgFontElement);
}

function redirectToExamDetail(){
	GM_addStyle(buildcss);
	let button=document.createElement("button");
	button.innerText="查看考试详情(可看分数)";
	button.style.float="right";
	button.style.width="auto";
	button.style.padding="2px 5px"
	document.querySelector(".top-back").children[0].appendChild(button);
	button.onclick=()=>{
		window.open(
			"https://stat2-ans.chaoxing.com/exam-stastics/stu-index?courseid="
			+document.querySelector("#courseId").value+"&cpi="
			+document.querySelector("#cpi").value+"&clazzid="
			+document.querySelector("#classId").value+"&ut=s&"
		);
	}
}