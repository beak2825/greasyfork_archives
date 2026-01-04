// ==UserScript==
// @name        my BZOJ
// @namespace    xay5421
// @version      0.1
// @description  我的 BZOJ 和 darkbzoj 的美化和一些插件
// @author       xay5421
// @match        https://www.lydsy.com/*
// @match        https://darkbzoj.tk/*
// @match        http://darkbzoj.tk/*
// @require       https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395565/my%20BZOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/395565/my%20BZOJ.meta.js
// ==/UserScript==

var $=window.$;

function bzoj_makeTable(){
	var username=["NAME1","NAME2","NAME3"];// 换成用户名,统计这些人是否 AC 这题
	var myTable=$("<table style='color:red;'></table>");
	$("h2:eq(0)").append(myTable);
	for(var i=0;i<username.length;++i)setTimeout(function(name){$.get("/JudgeOnline/userinfo.php?user="+name,function(data,status){if(data.indexOf("p("+window.location.href.slice(-4)+");")!=-1){myTable.append($("<td>"+name+"</td>"));}});},0,username[i]);
}

function bzoj_makeClock(){
	var myClock=$("<div></div>");
	var myInput=$("<input></input>");
	$("h2:eq(0)").append(myClock);
	var myButton=$("<button></button>");
	myInput.attr({
		"value":"00:10:00",
		"style":"width:80px"
	});
	myButton.text("开始");
	myClock.append(myInput);
	myClock.append(myButton);
//	document.onkeydown=function(e){if(e.keyCode==13)myButton.click();};
	var flag=0,cur;
	myButton.click(function(){
		if(flag==0){
			var x=myInput.val(),now;
			if(x.length!=8||!x.match(/[0-9][0-9]:[0-5][0-9]:[0-5][0-9]/)){
				alert("您的输入不合法,请重新输入");myInput.val("00:10:00");
				return;
			}
			flag=1;myButton.text("停止");
			var y=parseInt(x[0]+x[1])*60*60+parseInt(x[3]+x[4])*60+parseInt(x[6]+x[7]);
			cur=setInterval(function(){
				if(y>0)--y;
				myInput.val((""+parseInt(y/36000)%10)+(""+parseInt(y/3600)%10)+(":"+parseInt(y/600)%6)+(""+parseInt(y/60)%10)+(":"+parseInt(y/10)%6)+(""+parseInt(y)%10));
				if(y<=0){
					alert("时间到");
					flag=0;myButton.text("开始");clearInterval(cur);myInput.val("00:10:00");
				}
			},1000);
		}else{
			flag=0;myButton.text("开始");clearInterval(cur);//myInput.val("00:10:00");
		}
	});
}

function bzoj(){
	bzoj_makeClock();
	bzoj_makeTable();
}

function darkbzoj(){
	if(!window.location.href.match(/https:\/\/darkbzoj.tk\/data\//)){
		$("h1:eq(0)").replaceWith(`<div style="width:90%; text-align:left"><img src="https://www.lydsy.com/JudgeOnline/image/logo.png"></div>`);
		$(".navbar-brand").html("BZOJ");
	}
	if(window.location.href.match(/https?:\/\/darkbzoj.tk\/problem\//)){
		var k1=$("h1:eq(1)");
		k1.replaceWith("<center><h2>"+k1.html()+"</h2></center>");
		k1=$("h2:eq(0)");
		k1.html(k1.html().slice(1).replace(".",":"));
	}
}

$(function(){
	if(window.location.href.match(/https:\/\/www.lydsy.com\/JudgeOnline\/problem.php\?id=/)){
		bzoj();
	}
	else if(window.location.href.match(/darkbzoj.tk/)){
		darkbzoj();
	}
});