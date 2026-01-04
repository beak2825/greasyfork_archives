// ==UserScript==
// @name         91huayi_auto_class(91华医公需课选修课视频考试我全都要)v2.3
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  91huayi_auto_class_
// @author       Acdtms4zfx
// @match        *://*.91huayi.com/course_ware/*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/pages/course.aspx?cid=*
// @match        *://*.91huayi.com/pages/noplay.aspx?cid=*
// @match        *://*.91huayi.com/secure/login.aspx
// @match        *://*.91huayi.com/cme/index.html
// @grant        none
// @supportURL   https://github.com/hysbeta/91huayi
// @license      CC BY-NC-ND 2.0 DEED
// @downloadURL https://update.greasyfork.org/scripts/496911/91huayi_auto_class%2891%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%E9%80%89%E4%BF%AE%E8%AF%BE%E8%A7%86%E9%A2%91%E8%80%83%E8%AF%95%E6%88%91%E5%85%A8%E9%83%BD%E8%A6%81%29v23.user.js
// @updateURL https://update.greasyfork.org/scripts/496911/91huayi_auto_class%2891%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%E9%80%89%E4%BF%AE%E8%AF%BE%E8%A7%86%E9%A2%91%E8%80%83%E8%AF%95%E6%88%91%E5%85%A8%E9%83%BD%E8%A6%81%29v23.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert = console.log;
    var wait_time=10;
    console.log('91huayi_auto_exam_v2');
    function getlocalStorage(name)
    {
        if(localStorage.getItem(name)!=null){
            return unescape(localStorage.getItem(name));
        }else{
            return null;
        }
    };
    function setlocalStorage(name,value)
    {
        localStorage.setItem(name,escape(value));
    };
    function dellocalStorage(name)
    {
       localStorage.removeItem(name);
    };
    function enableStartExam(){
        var btn_exam = $("#jrks");
        showExam(true);
        var p = $("<p>   </p>");
        p.appendTo(btn_exam);
        setTimeout(() => {
            p.trigger('click');
        }, wait_time);
    };
    function sleep(time, unit){
        if(time == null){time = wait_time * 1000;}
        if(unit != null){time = time * 1000;}
        for(var t = Date.now();Date.now() - t <= time;);
    };
    sleep();
    if (document.querySelector("body").textContent.search("应用程序中的服务器错误。") != -1 && document.querySelector("body").textContent.search("运行时错误") != -1){
        console.log("Now in error page");
        setTimeout(function(){location.reload();},wait_time * 1000);
    };
    if (window.location.href.search(".91huayi.com/course_ware/") != -1){
        console.log("Now in class page");
        var fuc = setInterval(function() {
			document.querySelector("#video > div > div.pv-video-wrap > video").muted=true; //启用未交互后台播放
			document.querySelector("#video > div > div.pv-video-wrap > video").play(); //播放
			document.querySelector("#video > div > div.pv-video-wrap > video").volume=0; //播放器静音
			closeBangZhu(); //关闭提示弹窗
			if (document.querySelector("#video > div > div.pv-line-tips") != null){
				document.querySelector("#video > div > div.pv-line-tips > a").click();
			}; //切换线路
			if (document.querySelector("#video > div > div.pv-ask-modal-wrap") != null){
				document.querySelector("#video > div > div.pv-ask-modal-wrap").remove();
			}; //清除问题
			if (document.querySelector("#video > div > div.sign-in-menu > div") != null){
				document.querySelector("#video > div > div.sign-in-menu > div").remove();
			}; //清除签到
			if (document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right") != null){
				for (var i=1;i<=document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right").childElementCount;i++){
					if (document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > button") != null){
						if(document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > button").className.indexOf('pv-icon-volumeon') != -1){
							document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child("+i+") > button").click();
						};
					};
				};
			}; //播放按钮静音
			initialSign(); //调用签到保活（保持播放）
			while (document.querySelector("#video > div > div.sign-in-menu > div > div.sign-in-wrap > div.sign-in-wrap_btn > span") != null){
				document.querySelector("#video > div > div.sign-in-menu > div > div.sign-in-wrap > div.sign-in-wrap_btn > span").click();
			}; //签到
			if (document.querySelector("#video > div > div.pv-video-wrap > div.pv-log-error > div.pv-log-errormsg").textContent!=""){
				console.log("Looks like something goes wrong, try refresh the page after 10s...");
				setTimeout(function(){location.reload();},wait_time * 1000);
			}; //If error
			document.querySelector("#jrks").click();
			setlocalStorage("lastactionts",Date.parse(new Date()));
		},wait_time * 1000);
    };
    if (window.location.href.search(".91huayi.com/pages/exam.aspx") != -1){
        console.log("Now in exam page");
        if (getlocalStorage("correct_ans")==null){
			var correct_ans = {};
		}else{
			var correct_ans = JSON.parse(getlocalStorage("correct_ans"));
		};
		if (getlocalStorage("wrong_ans")==null){
			var wrong_ans = {};
		}else{
			var wrong_ans = JSON.parse(getlocalStorage("wrong_ans"));
		};
		console.log("correct_ans:"+JSON.stringify(correct_ans));
		console.log("wrong_ans:"+JSON.stringify(wrong_ans));
		var i, j, question_text, ans_text;
		var sub_ans = {};
		for (i=2;i<=document.querySelector("#gvQuestion > tbody").childElementCount;i++){
			question_text=(document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table.tablestyle > thead > tr > th > span").textContent.substring(document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table.tablestyle > thead > tr > th > span").textContent.indexOf("、")+1));
			console.log("Q:"+question_text)
			if (correct_ans.hasOwnProperty(question_text)){
				for (j=1;j<=document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody").childElementCount;j++){
					if (correct_ans[question_text]==document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child("+j+") > td").textContent){
						document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child("+j+") > td > input").click();
						ans_text=document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child("+j+") > td").textContent
						sub_ans[question_text]=ans_text;
						console.log("Already have correct answer for this question -> "+ans_text)
						break;
					}
				}
			}else if(wrong_ans.hasOwnProperty(question_text)){
				for (j=1;j<=document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody").childElementCount;j++){
					if (wrong_ans[question_text].indexOf(document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child("+j+") > td").textContent) == -1){
						document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child("+j+") > td > input").click();
						ans_text=document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child("+j+") > td").textContent
						sub_ans[question_text]=ans_text;
						console.log("Only have wrong answer for this question, try -> "+ans_text)
						break;
					}
				}
			}else{
				document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child(1) > td > input").click();
				ans_text=document.querySelector("#gvQuestion > tbody > tr:nth-child("+i+") > td > table:nth-child(2) > tbody > tr:nth-child(1) > td").textContent
				sub_ans[question_text]=ans_text;
				console.log("First time meet this question, try -> "+ans_text)
			}
		};
		console.log("sub_ans:"+JSON.stringify(sub_ans));
		setlocalStorage("sub_ans",JSON.stringify(sub_ans))
		setlocalStorage("lastactionts",Date.parse(new Date()));
		document.querySelector("#btn_submit").click();
		setTimeout(function(){location.reload();},wait_time * 1000);
    };
    if (window.location.href.search(".91huayi.com/pages/exam_result.aspx") != -1){
        console.log("Now in exam result page");
        if (getlocalStorage("sub_ans")==null){
			var sub_ans = {};
		}else{
			var sub_ans = JSON.parse(getlocalStorage("sub_ans"));
		};
		if (getlocalStorage("correct_ans")==null){
			var correct_ans = {};
		}else{
			var correct_ans = JSON.parse(getlocalStorage("correct_ans"));
		};
		if (getlocalStorage("wrong_ans")==null){
			var wrong_ans = {};
		}else{
			var wrong_ans = JSON.parse(getlocalStorage("wrong_ans"));
		};
		var i, j, key, wrong_questions;
		wrong_questions = [];
		for (i=1;i<=document.querySelector("#ctl00 > div.container > div > div.cent_box > ul").childElementCount;i++){
			//wrong_questions.push(document.querySelector("#ctl00 > div.state_container > div.state_cent_box > ul > li:nth-child("+i+") > p").textContent);
			wrong_questions.push(document.querySelector("#ctl00 > div.container > div > div.cent_box > ul > li:nth-child("+i+") > p").getAttribute("title"));
		}
		console.log("wrong_questions:"+JSON.stringify(wrong_questions));
		console.log("sub_ans:"+JSON.stringify(sub_ans));
		for (key in sub_ans) {
			console.log("Q:"+key);
			if (wrong_questions.indexOf(key) != -1){
				console.log("Wrong answer -> "+sub_ans[key]);
				if (!wrong_ans.hasOwnProperty(key)){
					wrong_ans[key]=[];
				};
				wrong_ans[key].push(sub_ans[key]);
			}else{
				correct_ans[key]=sub_ans[key];
				console.log("Correct answer -> "+sub_ans[key]);
			};
		};
		console.log("sub_ans:"+JSON.stringify(sub_ans));
		console.log("correct_ans:"+JSON.stringify(correct_ans));
		console.log("wrong_ans:"+JSON.stringify(wrong_ans));
		if (document.querySelector("#ctl00 > div.container > div > div.cent_box > div.state_tips > p").textContent.trim()=="考试通过"){
			dellocalStorage("sub_ans");
			dellocalStorage("correct_ans");
			dellocalStorage("wrong_ans");
			var finish_state=true;
			for (j=1;j<=document.querySelector("#ctl00 > div.container > div > div.cent_box > ul").childElementCount;j++){
				if (document.querySelector("#ctl00 > div.container > div > div.cent_box > ul > li:nth-child("+j+") > input").value=="立即学习"){
					var finish_state=false;
					console.log("Congratulations! We will move to next class in "+wait_time+"s...");
					console.log("Next:"+document.querySelector("#ctl00 > div.container > div > div.cent_box > ul > li:nth-child("+j+") > p").title);
					setlocalStorage("lastactionts",Date.parse(new Date()));
					document.querySelector("#ctl00 > div.container > div > div.cent_box > ul > li:nth-child("+j+") > input").click();
					break;
				};
			}
		}else{
			console.log("Oh... We will take the exam again in "+wait_time+"s...");
			dellocalStorage("sub_ans");
			setlocalStorage("correct_ans",JSON.stringify(correct_ans));
			setlocalStorage("wrong_ans",JSON.stringify(wrong_ans));
			setlocalStorage("lastactionts",Date.parse(new Date()));
			document.querySelector("#ctl00 > div.container > div > div.cent_box > div.state_foot > input:nth-child(2)").click();
		};
		if (document.querySelector("#ctl00 > div.container > div > div.cent_box > div.state_foot > input:nth-child(1)").value!="申请证书"){
			setlocalStorage("lastactionts",Date.parse(new Date()));
			setTimeout(function(){location.reload();},wait_time * 1000);
		}else{
			console.log("Congratulations! It's all done~");
			dellocalStorage("classURL");
			setTimeout(function(){setlocalStorage("lastactionts",Date.parse(new Date()));},wait_time * 1000);
		};
    };
    if (window.location.href.search(".91huayi.com/pages/course.aspx") != -1){
        console.log("Now in course list");
        setlocalStorage("classURL",window.location.href);
		if (getlocalStorage("lastactionts") == null){
			console.log("Class not started yet or last action ts misssing. Do nothing now...");
			setTimeout(function(){location.reload();},wait_time * 1000 * 2);
		}else{
			if (Date.parse(new Date()) - getlocalStorage("lastactionts") < wait_time * 1000 * 3){
				console.log("Having class now...");
				setTimeout(function(){location.reload();},wait_time * 1000 * 3);
			}else{
				console.log("Seems like got exception, try to take class again...");
				var i;
				for (i=3;i<=document.querySelector("#containter > div.main > div.colm_mid").childElementCount;i++){
					if (document.querySelector("#containter > div.main > div.colm_mid > div:nth-child("+i+")").getAttribute("class")=="course"){
						if (document.querySelector("#containter > div.main > div.colm_mid > div:nth-child("+i+") > h3 > span > a > img").getAttribute("src").search("anniu_03a.gi") == -1){
							document.querySelector("#containter > div.main > div.colm_mid > div:nth-child("+i+") > h3 > span > a > img").click();
							break
						};
					};
					dellocalStorage("classURL");
				};
                console.log("Will refresh the page in 30s...");
				setTimeout(function(){location.reload();},wait_time * 1000 * 3);
			};
		};
    };
    if (window.location.href.search(".91huayi.com/pages/noplay.aspx") != -1){
        console.log("Now in noplay page");
        window.close();
    };
    if (window.location.href.search(".91huayi.com/secure/login.aspx") != -1){
        console.log("Now in login page");
        setTimeout(function(){location.reload();},wait_time * 1000 * 3);
    };
    if (window.location.href.search(".91huayi.com/cme/index.html") != -1 && getlocalStorage("classURL") != null){
        console.log("Now in landing page");
        window.location.href=getlocalStorage("classURL");
    };
})();