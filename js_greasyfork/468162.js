// ==UserScript==
// @name         重庆干教辅助
// @namespace    http://tampermonkey.net/
// @version        23.6.7
// @description  重庆干部网络学院自动学习
// @author         Dannial
// @match         https://cqgj.12371.gov.cn/*
// @match         https://cqcdn.jystudy.com/*
// @license        MIT
// @grant          none
// @icon           https://cqgj.12371.gov.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/468162/%E9%87%8D%E5%BA%86%E5%B9%B2%E6%95%99%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/468162/%E9%87%8D%E5%BA%86%E5%B9%B2%E6%95%99%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

	function id(x) {
		if (typeof x == "string") return document.getElementById(x);
		return x;
	}
    function classes(x) {
		if (typeof x == "string") return document.getElementsByClassName(x);
		return x;
	}
    function tags(x) {
		if (typeof x == "string") return document.getElementsByTagName(x);
		return x;
	}


	var question,temptext,islearning=0;
	var questionanswer;
	var answers;
	var i,j;
	var inte1,inte2;
	var disblock,curtime=0,duration;

	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	//console.log(params.get('foo')); // Output: "bar"
	//console.log(params.get('baz')); // Output: "qux"

	addGlobalStyle(".tmBorder .form-group{width:60%!important}");


///////////////////////////考试自动答
	setTimeout(function(){
		if (window.location.href.indexOf("exam/exam?")>0){
			answers=document.querySelector(".exam").querySelectorAll(".question_item");
			for(i=0;i<answers.length;i++){
				if(answers[i].querySelectorAll(".jqRadio")!=null){
					try{
						answers[i].querySelectorAll(".jqRadio")[0].click();
					}catch{}
				}
				if(answers[i].querySelectorAll(".jqCheckbox")!=null){
					for(j=0;j<answers[i].querySelectorAll(".jqCheckbox").length;j++){
						answers[i].querySelectorAll(".jqCheckbox")[j].click();
						//console.log(j);
					}
				}
			}
		}
	},500);

//////////////////////////////////课程详情没学完自动跳转，学完跳转考试////////////////////////////////////////
	if (window.location.href.indexOf("courseCenter/courseDetails")>0){
		setTimeout(function(){
			classes("listtb4")[4].getElementsByTagName("a")[0].style.display="none";
		},1000);

		setTimeout(function(){
			if((islearning<1)&&(classes("progress-bar")[0].innerText.trim()!="100.0%")){
				//window.location.href=classes("listtb4")[4].getElementsByTagName("a")[0].getAttribute("href");
				classes("listtb4")[4].getElementsByTagName("a")[0].click();
				islearning=1;
			}else{
				classes("listtb4")[3].getElementsByTagName("a")[0].click();
			}
			//var yanggbDialog = window.open();
		},1000);
	}


//////////////////////////////考试结果不合格，刷新重新作答////////////////////////////////////////////
	if (window.location.href.indexOf("exam/examReview?examId=")>0){
		if (parseInt(document.querySelectorAll(".xz.score ul li")[1])>=60){
			//window.opener.yanggbDialog.close();
		}else{
			window.open("https://cqgj.12371.gov.cn/#/exam/exam?Id="+window.location.href.substring(window.location.href.indexOf("examId=")+7,window.location.href.indexOf("&recordId")));
		}
	}


///////////////////////////////学习学习//////////////////////////////////////////////////////////////

	var int1=setInterval(function(){

		//console.log("1");
		/////////视频学习///////////
		if (id("myplayer_display_button")!=null){
			duration=parseInt(classes("jw-duration")[0].innerText.trim().substring(0,classes("jw-duration")[0].innerText.trim().indexOf(":")));
			curtime=parseInt(classes("jw-current-time")[0].innerText.trim().substring(0,classes("jw-current-time")[0].innerText.trim().indexOf(":")));
			document.querySelector(".my-player video").muted=true;
			document.querySelector(".my-player video").play();
			///////暂时没办法，DOMException: play() failed because the user didn't interact with the document first
			/*if(document.querySelector(".player-progress-inner").style.width=="0%"){
				console.log("start");
				document.querySelector(".my-player video").setAttribute("muted","muted");
				document.querySelector(".my-player video").setAttribute("autoplay","true");
				document.querySelector(".my-player video").muted=true;
				document.querySelector(".my-player video").play();
				//document.querySelector("#myplayer_display").click();
			}*/
			//setTimeout(function(){
				if ((id("myplayer_display_button").style.opacity=="1")&&(islearning<2)&&(duration>0)){
					//id("myplayer_display_button").click();
					document.querySelector(".my-player video").play();
				}
			//},2000);
			//console.log("Duration: "+duration+"; Playtime: "+curtime);
			//console.log("IsLearning: "+islearning);
			if ((curtime>0)&&(duration==curtime)){
				//id("myplayer_display_button").click();
				islearning=2;
				document.querySelector(".my-player video").pause();
				//console.log("stoped");
				if(window.opener){
					window.opener.location.reload();
				}
				window.close();
			}
		}
		//console.log("2");
		if (classes("questions-inner").length>0){
			question=classes("question-name ng-binding")[0].innerText.substring(0,classes("question-name ng-binding")[0].innerText.indexOf("="));
			if(question.indexOf("+")>0){
				questionanswer=parseInt(question.substring(0,question.indexOf("+")).trim())+parseInt(question.substring(question.indexOf("+")+1).trim());
			}else if (question.indexOf("-")>0){
				questionanswer=parseInt(question.substring(0,question.indexOf("-")).trim())-parseInt(question.substring(question.indexOf("-")+1).trim());
			}
			console.log("Answer is "+questionanswer);
			//answers=classes("questions-inner")[0].getElementsByTagName("label").innerText;
			for (i=0;i<4;i++){
				if(classes("questions-inner")[0].getElementsByTagName("label")[i].innerText.substring(classes("questions-inner")[0].getElementsByTagName("label")[i].innerText.indexOf(".")+1).trim()==questionanswer){
					classes("questions-inner")[0].getElementsByTagName("input")[i].click();
				}
			}
			classes("questions-inner")[0].getElementsByTagName("button")[0].click();
			//console.log("Operation Completed");
		}
		if(id("current_time")){
			//console.log(id("current_time").innerText);
		}
		//console.log("3");
		//if ((id("questionsList")!=null)&&(id("questionsList").style.display=="block")){

///////////////////////////////////滑动验证自动跳过///////////////////////////////////////
		/*if((classes("handler")[0]!=null)&&(islearning<5)){
			//classes("handler")[0].style["left"]!="260px")
			islearning+=1;
			event = document.createEvent('MouseEvents');
			event.initEvent('mousedown', true, false);
			document.querySelector(".handler").dispatchEvent(event);
			event = document.createEvent('MouseEvents');
			event.initEvent('mousemove', true, false);
			Object.defineProperty(event,'pageX',{get(){return 260;}})
			document.querySelector(".handler").dispatchEvent(event);
			//classes("handler")[0].style["left"]="260px";
			if(islearning==5){
				event = document.createEvent('MouseEvents');
				event.initEvent('mouseup', true, false);
				document.querySelector(".handler").dispatchEvent(event);
				console.log(islearning);
			}
		}*/
		if((classes("handler")[0]!=null)&&(classes("handler")[0].style["left"]!="260px")){
			var btn,mousedown,mousemove,mouseup,x,y,_x,_y,w,dx,dy,rect,intervaltimer;
			btn=document.querySelector(".handler");
			mousedown = document.createEvent("MouseEvents");
			rect = btn.getBoundingClientRect();
			x = rect.x||rect.left;
			y = rect.y||rect.top;
			mousedown.initMouseEvent("mousedown",true,true,window,0,
					x, y, x, y,false,false,false,false,0,null);
			btn.dispatchEvent(mousedown);
			dx = 263;
			dy = 0;
			setTimeout(function(){
				mousemove = document.createEvent("MouseEvents");
				_x = x + dx;
				_y = y + dy;
				mousemove.initMouseEvent("mousemove",true,true,window,0,
						_x, _y, _x, _y,false,false,false,false,0,null);
				btn.dispatchEvent(mousemove);
			},200);
			setTimeout(function(){
				mouseup = document.createEvent("MouseEvents");
				mouseup.initMouseEvent("mouseup",true,true,window,0,
					_x, _y, _x, _y,false,false,false,false,0,null);
				btn.dispatchEvent(mouseup);
			},500);
			/*var btn,mousedown,x,y,w,dx,dy,rect,intervaltimer;
			btn=document.querySelector(".handler");
			mousedown = document.createEvent("MouseEvents");
			rect = btn.getBoundingClientRect();
			x = rect.x||rect.left;
			y = rect.y||rect.top;
			w = document.querySelector(".drag_bg").getBoundingClientRect().width;
			//点击滑块
			mousedown.initMouseEvent("mousedown",true,true,window,0,
					x, y, x, y,false,false,false,false,0,null);
			btn.dispatchEvent(mousedown);

			dx = 10;
			dy = 10;
			//滑动滑块
			intervaltimer = setInterval(function(){
				var mousemove = document.createEvent("MouseEvents");
				var _x = x + dx;
				var _y = y + dy;
				mousemove.initMouseEvent("mousemove",true,true,window,0,
						_x, _y, _x, _y,false,false,false,false,0,null);
				btn.dispatchEvent(mousemove);

				btn.dispatchEvent(mousemove);
				if(_x - x >= w){
					clearInterval(intervaltimer);
					var mouseup = document.createEvent("MouseEvents");
					mouseup.initMouseEvent("mouseup",true,true,window,0,
					_x, _y, _x, _y,false,false,false,false,0,null);
					btn.dispatchEvent(mouseup);
					setTimeout(function(){
						console.log('拖动结束执行逻辑');
					}, 1000);
				}
				else{
					dx += parseInt(Math.random()*(209-199)+199)/33;
					console.log(x,y,_x,_y,dx);
				}
			}, 30);*/
		}

		if((islearning<1)&&(classes("continue-study")[0]!=null)){
			classes("continue-study")[0].click();
			islearning=1;
		}

/////////////////////////PPT类的学习自动跳转真实页面并学习//////////////////////////////////
		/*if(tags("iframe")[0]!=null){
			if(tags("iframe")[0].src.indexOf("PlayScorm.html")>0){
				setTimeout(function(){
					window.location.href=tags("iframe")[0].src;
				},500);
			}
		}*/

		if (window.location.href.indexOf("PlayJyxScorm/PlayScorm.html")>0){
			document.querySelector("iframe").contentWindow.document.querySelector(".video video").muted=true;
			if((window.frames[0]!=null)&&(window.frames[0].document.getElementById("questionsList").style["display"]=="block")){
				disblock=window.frames[0].document.getElementsByClassName("dis_block")[0];
				answers=disblock.getElementsByTagName("span")[1].innerText.substring(disblock.getElementsByTagName("span")[1].innerText.indexOf(":")+1).trim().split("");
				for (i=0;i<answers.length;i++){
					if(!disblock.getElementsByClassName("options")[answers[i].replace(/A/g,"0").replace(/B/g,"1").replace(/C/g,"2").replace(/D/g,"3").replace(/E/g,"4")].getElementsByTagName("input")[0].checked){
						disblock.getElementsByClassName("options")[answers[i].replace(/A/g,"0").replace(/B/g,"1").replace(/C/g,"2").replace(/D/g,"3").replace(/E/g,"4")].getElementsByTagName("input")[0].click();

					}
				}
				disblock.getElementsByClassName("submit")[0].getElementsByTagName("input")[0].click();
			}
			if(document.getElementsByTagName("iframe")[0].contentWindow.document.querySelector("#current_time") &&
			parseInt(document.getElementsByTagName("iframe")[0].contentWindow.document.querySelector("#current_time").innerText.substr(3,2))>0&&
			document.getElementsByTagName("iframe")[0].contentWindow.document.querySelector("#current_time").innerText==document.getElementsByTagName("iframe")[0].contentWindow.document.querySelector("#duration").innerText){
				console.log("sending message");
				window.parent.postMessage("close","*")
			}
		}

///

	},2000);

		////////////////ppt接到信号自动关窗口
	setTimeout(function(){
		if(document.querySelector("iframe") && document.querySelector("iframe").src.indexOf("PlayScorm.html")>0){
			window.addEventListener("message", e => {
				const data = e.data;
				//if (e.origin.includes("PlayScorm.html") && e.data.includes("close")) {
				if (e.data.includes("close")) {
					if(window.opener){
						window.opener.location.reload();
					}
					window.close();
				}
			});
		}
	},2000);

/////////////个人中心考试自动进试卷
	if (window.location.href.indexOf("/personalCenter")>0){


		//document.querySelector(".tmBorder .form-group").style.width="60%";
		setTimeout(function(){
			////////个人中心跳转自动学
			var batLearnBtn=document.createElement("button");
			batLearnBtn.className="btn btn-primary";
			batLearnBtn.innerText="批学习";
			batLearnBtn.addEventListener("click",function(){
				window.location="https://cqgj.12371.gov.cn/#/personalCenter?shua=yes";
				window.location.reload();
			});
			document.querySelector(".tmBorder .formSearch").appendChild(batLearnBtn);

			////////个人中心直接打开试卷
			j=document.querySelectorAll("div[aria-valuenow='100']")
			for (i=0;i<j.length;i++){
				j[i].parentNode.parentNode.parentNode.querySelectorAll(".list0-75 a")[2].addEventListener("click",function(){
					setTimeout(function(){
						document.querySelectorAll(".modal-dialog .modal-body tbody td a")[1].click();
						document.querySelector(".seeTest").click();
						//document.querySelectorAll(".modal-dialog .modal-header button.close")[0].click();
					},200);
				});

				//j[i].parentNode.parentNode.parentNode.querySelector(".ellipsis a").removeAttribute("href");
				//j[i].parentNode.parentNode.parentNode.querySelector(".ellipsis a").addEventListener("click",function(){
					//console.log(document.querySelectorAll("div[aria-valuenow='100']")[i]);
					//j[i].parentNode.parentNode.parentNode.querySelectorAll(".list0-75 a")[2].click();
					//setTimeout(function(){
					//	document.querySelector(".modal-dialog .modal-body tbody td a")[0].click();
					//},500);
				//});
				//temptext=j[i].getElementsByTagName("a")[0].outerHTML.substring(j[i].getElementsByTagName("a")[0].outerHTML.indexOf("Id="));
				//temptext=temptext.substring(3,temptext.indexOf("\""));
				//j[i].getElementsByTagName("div")[8].getElementsByTagName("a")[0].outerHTML="<a onclick=\"javascript:window.open('https://cqgj.12371.gov.cn/#/exam/exam?Id="+temptext+"')\">考试</a>";
			}
		},1000);
	}
	///////自动学实际操作

	if(window.location.href.indexOf("personalCenter?shua=yes")>0){
		setTimeout(function(){
			var pageN,pageC,listN,listC;
            pageN=0;
			function sendit()
			{
                console.log(pageN);
				listN=0;
				pageC=document.querySelectorAll(".page-list .pagination .ng-scope");
				//if(pageC[pageN].className.indexOf("active")<0){
					//pageC[pageN].click();
				//}
				listC=document.querySelectorAll(".tab-content .tab-panel .list");
				while(listN<listC.length){
					console.log("3");
					if(!listC[listN].querySelector("div[aria-valuenow='100']")){
						window.open(listC[listN].querySelector(".list0-75 a").getAttribute("href"));
						console.log("4");
						pageC=0;
						break;
					}
					listN++;
				}
				listN=0;
				pageN++;
				if(pageN<pageC.length/3 && pageC.length>0){
					pageC[pageN].click();
					// Call sendit() the next time, repeating
					setTimeout(sendit, 2000);
				}
			}
			// Call sendit() the first time
			setTimeout(sendit, 2000);

		},10000);


	}

    // Your code here...
})();