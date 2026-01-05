// ==UserScript==
// @name			Ikariam Pirates
// @namespace		vampire
// @description		auto run Ikariam Pirates
// @include			*-ae.ikariam.gameforge.com*
// @version			2.7
// @website			https://greasyfork.org/scripts/5117-ikariam-pirates/
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_deleteValue
// @require			https://greasyfork.org/scripts/5178-hot-keys/code/hot%20keys.js?version=18278
// @downloadURL https://update.greasyfork.org/scripts/5117/Ikariam%20Pirates.user.js
// @updateURL https://update.greasyfork.org/scripts/5117/Ikariam%20Pirates.meta.js
// ==/UserScript==
$(document).ready(function(){
    $(document).bind('keydown', 'alt+1', function(){
    	number=1;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+2', function(){
    	number=2;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+3', function(){
    	number=3;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+4', function(){
    	number=4;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+5', function(){
    	number=5;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+6', function(){
    	number=6;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+7', function(){
    	number=7;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+8', function(){
    	number=8;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
    $(document).bind('keydown', 'alt+9', function(){
    	number=9;
    	no=number-1;
    	GM_setValue("number",number);
    	alert("المهمة رقم "+number+" تشتغل الان");
    });
	function myFunction() {
		if (typeof number == 'undefined') {
			if (typeof GM_getValue("number") != 'undefined'){
				number=GM_getValue("number");
				no=number-1;
				test();
			}else{
				number = prompt("اختار رقم المهمة", "1");
				GM_setValue("number",number);
				no=number-1;
				test();
			}
		}else{
			if(number==1){
				no=0;
				timer=2.5*60*1000;
			}else if(number==2){
				no=1;
				timer=7.5*60*1000;
			}else if(number==3){
				no=2;
				timer=15*60*1000;
			}else if(number==4){
				no=3;
				timer=30*60*1000;
			}else if(number==5){
				no=4;
				timer=1*60*60*1000;
			}else if(number==6){
				no=5;
				timer=2*60*60*1000;
			}else if(number==7){
				no=6;
				timer=4*60*60*1000;
			}else if(number==8){
				no=7;
				timer=8*60*60*1000;
			}else{
				no=8;
				timer=16*60*60*1000;
			}
			setTimeout(test, timer);
		}
	}
	function test(){
		if($("#loadingPreview").css("display")=="block"){
			setTimeout(test,1000);
		}else if($('.captchaImage').length==1){
			var audio = new Audio('http://soundbible.com/mp3/Siren-SoundBible.com-1094437108.mp3');
			audio.play();
			setTimeout(test,60*1000);
		}else if($('#js_tabBootyQuest').length==1&&!$('#js_tabBootyQuest').hasClass('selected')){
			$('#js_tabBootyQuest').click();
            setTimeout(test,1000);
		}else if($('.capture:eq('+no+')').text()=="اختطاف"){
			$('.capture:eq('+no+')').click();
			setTimeout(test,1000);
		}else if($(".button_disabled").length>=1){
			if (typeof $("#missionProgressTime").text() != 'undefined' && $("#missionProgressTime").text()!="" && $("#missionProgressTime").text()!="-"){
				first=$("#missionProgressTime").text().split('ساعة ');
				if (typeof first[1] == 'undefined'){
					h=0;
					second=first[0].split('د');
				}else{
					h=first[0];
					second=first[1].split('د');
				}
				if (typeof second[1] == 'undefined'){
					m=0;
					third=second[0].split('ث');
				}else{
					m=second[0];
					third=second[1].split('ث');
				}
				s=third[0];
				time=h*60*60+m*60+s*1;
				setTimeout(test,time*1000);
			}else{
				setTimeout(test,1000);
			}
		}else if($(".abort").length==0 && $('.capture:eq('+no+')').length==0&&$("#js_CityPosition17Link").attr("title")!="مكان بناء فارغ"){
			$("#js_CityPosition17Link").click();
			setTimeout(test,5000);
		}else{
			setTimeout(test,10*1000);
		}
	}
	myFunction();
});