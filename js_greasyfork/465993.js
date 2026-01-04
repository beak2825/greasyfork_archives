// ==UserScript==
// @name         教师教育网挂机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习一下油猴脚本的编写，去除电影天堂的漂浮广告
// @author       You
// @match        *://*.teacheredu.cn/*
// @icon         http://www.teacheredu.cn/r/cms/www/default/images/favicon.ico
// @grant        none
// @run-at document-start
// @license      可以自由更改
// @downloadURL https://update.greasyfork.org/scripts/465993/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/465993/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
	//var  (window.location.pathname);
	if(document.title!="学员工作室 - 课程学习")return;
	window.setInterval(jiance,1000);

})();

function jiance(){
	window.alert=function(){return true;}
	window.confirm=function(){return true;}
	//function getRandomSecond(){return 600;}//此处不能小于10分钟，否则会造成自动结束学习
    //randomTime=600;//此变量在原网页中已经声明
	//获取累计学习时间
	var leijiTime=document.getElementById('zonggong').textContent;
	//获取课程时长
	var spans=document.querySelectorAll('span');
	var kechengTime='';
	for(var i=0;i<spans.length;i++)
	{
		if(spans[i].textContent=="课程时长："){
			//console.log(spans[i].parentElement.textContent);
			kechengTime=spans[i].parentElement.textContent;
			//用正则表达式找出其中的数字
			var regStr=/\d+/;
			kechengTime= kechengTime.match(regStr)[0];
			break;

		}
	}
	//输出本次需要时长
    var shengyuTime = randomTime - document.form2.passedtime.value;
    var myTime=document.getElementById('myTime');
    if (!myTime)
    {
		myTime=document.createElement('a');
		myTime.id='myTime';
        myTime.title='此时间自动更新学习时间\n也可单击更新需要学习至少10分钟';
		myTime.href='javascript:void(0);';
		//myTime.onclick="sdUpdateTime()";
		myTime.addEventListener('click',function(){if(document.form2.passedtime.value>=600){updateStudyTime(0);setRandomTipTime();}return false;})
		document.getElementById('exit_study_btn').parentElement.appendChild(myTime);
    }

	myTime.innerText= (shengyuTime / 60).toFixed()+'分' + (shengyuTime % 60).toString() + '秒';
    //判断挂机时长超过课程时长则点击结束学习按钮
	if(Number(leijiTime)>=Number(kechengTime)){
		document.getElementById('exit_study_btn').click();
	}

}
