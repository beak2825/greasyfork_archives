// ==UserScript==
// @name         my atcoder
// @namespace    xay5421
// @version      0.2
// @description  我的 atcoder 插件
// @author       xay5421
// @match        atcoder.jp/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/433445/my%20atcoder.user.js
// @updateURL https://update.greasyfork.org/scripts/433445/my%20atcoder.meta.js
// ==/UserScript==

var $=window.$;

function makeClock(){
	var myClock=$("<div></div>");
	var myInput=$("<input></input>");
    $(".h2:eq(0)").after(myClock);
	var myButton=$("<a class=\"btn btn-default btn-sm\"></a>");
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


function makeTable(){
	var username=["xay5421","zhouzhuan233","wasa855","xyr2005","yzc2005","LJC00118","zxn","Isonan","tourist","wlzhouzhuan","YLWang"];// 换成用户名,统计这些人是否 AC 这题
	var myTable=$("<table style='color:red;'></table>");
	$(".h2:eq(0)").after(myTable);
    var path=window.location.href.split('/')
	for(var i=0;i<username.length;++i){
        setTimeout(
            function(name){
                var str=window.location.href.slice(0,window.location.href.indexOf("/tasks"))+"/submissions?f.Task="+path[path.length-1]+"&f.Status=AC&f.User="+name;
                $.get(str,function(data,status){
                    if(data.indexOf("No Submissions")==-1)myTable.append($("<td>"+name+"&nbsp</td>"));
                });
            },0,username[i]
        );
    }
}

function atcoder(){
	if(window.location.href.match(/atcoder.jp\/contests\/.*\/tasks\/.+/)){
        $("#task-lang-btn").remove();
        makeClock();
        makeTable();
    }
}

(function() {
    atcoder();
})();