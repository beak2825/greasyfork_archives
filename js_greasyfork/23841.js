// ==UserScript==
// @name         VPGAME一键参加免费roll活动
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  批量打开无需密码的roll活动，输入验证码后自动确认并关闭,只需直接输入4个验证码即可(会自动为活动发起者点赞) open all password-free page in vpgame.com to join the roll activity,it will automatically focus on the input and hit the button to summit,all you need is input 4 words.（will give a free cheese to the owner）
// @author       Chuck
// @match        http://www.vpgame.com/*
// @match        http://www.vpgame.com/roll/*
// @icon         http://www.vpgame.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23841/VPGAME%E4%B8%80%E9%94%AE%E5%8F%82%E5%8A%A0%E5%85%8D%E8%B4%B9roll%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/23841/VPGAME%E4%B8%80%E9%94%AE%E5%8F%82%E5%8A%A0%E5%85%8D%E8%B4%B9roll%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function() {



function openfreeroll (){
	$.each($('.btn-roll-ft'),function(index){
           if($(this).children().hasClass('bm-btn'))
           {
             
           }
           else if($(this).children().hasClass('active')){
           	$(this).children().removeClass('active');
           	window.open("http://www.vpgame.com/roll/"+$(this).attr("id").slice(-7)+".html");    
       		opensum++;
           }
           	
       });
	if(opensum===0)alert("当前页已经没有无需密码的活动了，请向下滚动滚轮加载更多活动");
}
function Captchaok(){
	    if($("#verifyCode").val().length==4)
	        {return true;}
	    return false;
	}

if(window.location.href.slice(-9)==="roll.html"){
	var chuck = document.createElement('div');
	var txt = document.createTextNode("点击批量参加roll活动");
	chuck.appendChild(txt);
	var checkboxCss = 'cursor: pointer; position: fixed; bottom: 50%; width: 114px; right: 10px; z-index: 9999; border: 2px solid; font-size: 2em;';
	chuck.style.cssText = checkboxCss; 
	chuck.addEventListener('click', function(){ openfreeroll(); }, false);
	document.body.appendChild(chuck);
	var opensum = 0;	
}
else{
$("#verifyframe").css({"display":"block"},{"padding-right":"17px"});
$("input").blur(function(){ $("#verifyCode").focus();});           
$("#verifyCode").focus();
$(".zan-icon").click();	
$(".btn-warning[data-dismiss='modal']").click();
timer = setInterval(function(){
		if(Captchaok())
			{           
			$("#verify-btn").click();
			$("#verifyCode").val("");
			}				    
		},200);
timer2 = setInterval(function(){
			if($(".btn-roll-room").text()==="参加成功"){window.close();}			    
    $(".btn-warning[data-dismiss='modal']").click();
		},1000);

lastHidden= false;
timer3 = setInterval(function(){
			console.log(lastHidden);
			  if(!document.hidden)
			  {
			  	if(lastHidden)
                {$("#captche").click();
                }
			  }
			lastHidden = document.hidden;
		},1000); 

}



})();